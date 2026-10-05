"""Upload one validated ZIP through Chrome Web Store API v2; no third-party SDK."""
import argparse
import hashlib
import io
import json
import os
from pathlib import Path
import re
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
import zipfile


def version_parts(version):
    if not re.fullmatch(r"(?:0|[1-9][0-9]*)(?:\.(?:0|[1-9][0-9]*)){0,3}", version):
        raise ValueError("Expected a numeric Chrome manifest version.")
    parts = tuple(map(int, version.split(".")))
    if max(parts) > 65535 or not any(parts):
        raise ValueError("Chrome version components must be 0–65535 and not all zero.")
    return parts + (0,) * (4 - len(parts))


def package_bytes(path, version):
    version_parts(version)
    data = path.read_bytes()
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        if archive.namelist().count("manifest.json") != 1:
            raise ValueError("ZIP must contain exactly one root manifest.json.")
        manifest = json.loads(archive.read("manifest.json"))
    if manifest.get("version") != version or manifest.get("manifest_version") != 3:
        raise ValueError("ZIP manifest must be MV3 and match the release tag version.")
    return data


def release(path, version, token, publisher, item, submit):
    data = package_bytes(path, version)
    if not token or not re.fullmatch(r"[A-Za-z0-9_-]+", publisher) or not re.fullmatch(r"[a-p]{32}", item):
        raise ValueError("Configure the access token, publisher ID and store extension ID.")
    name = f"publishers/{publisher}/items/{item}"
    base = f"https://chromewebstore.googleapis.com/v2/{name}"

    def request(url, body=None, content_type="application/json"):
        req = Request(url, data=body, headers={"Authorization": f"Bearer {token}", "Content-Type": content_type})
        try:
            with urlopen(req, timeout=30) as response:
                result = json.load(response)
        except (HTTPError, URLError, TimeoutError, OSError, ValueError) as error:
            # Do not print response bodies, headers or credentials; a POST may have succeeded.
            code = f"HTTP {error.code}" if isinstance(error, HTTPError) else type(error).__name__
            raise RuntimeError(f"Store request failed ({code}); not retried. Inspect the dashboard before another run.") from None
        if not isinstance(result, dict) or result.get("name") != name or result.get("itemId") != item:
            raise RuntimeError("Unexpected store item in response; stopped without retry.")
        return result

    status = request(base + ":fetchStatus")
    submitted = status.get("submittedItemRevisionStatus", {})
    if status.get("takenDown") or status.get("warned") or status.get("lastAsyncUploadState") == "IN_PROGRESS":
        raise RuntimeError("Resolve the current store warning/takedown/upload in the dashboard first.")
    if submitted.get("state") in ("PENDING_REVIEW", "STAGED"):
        raise RuntimeError("An existing review or staged release must be resolved first.")
    for revision in (submitted, status.get("publishedItemRevisionStatus", {})):
        for channel in revision.get("distributionChannels", []):
            if version_parts(version) <= version_parts(channel["crxVersion"]):
                raise RuntimeError("Release version must be newer than submitted/published versions; not resubmitting.")

    result = request(f"https://chromewebstore.googleapis.com/upload/v2/{name}:upload", data, "application/zip")
    state = result.get("uploadState")
    if state == "SUCCEEDED" and result.get("crxVersion") != version:
        raise RuntimeError("Uploaded store version does not match the ZIP; not submitting.")
    for _ in range(12):
        if state != "IN_PROGRESS":
            break
        time.sleep(5)
        state = request(base + ":fetchStatus").get("lastAsyncUploadState")
    if state == "IN_PROGRESS":
        raise RuntimeError("Upload still processing; inspect the dashboard. No retry or submission was made.")
    if state != "SUCCEEDED":
        raise RuntimeError("Store did not confirm upload success; not submitting.")

    outcome = "Draft uploaded; not submitted for review."
    if submit:
        result = request(base + ":publish", json.dumps({
            "publishType": "DEFAULT_PUBLISH", "skipReview": False, "blockOnWarnings": True,
        }).encode())
        state = result.get("state")
        if state not in ("PENDING_REVIEW", "PUBLISHED", "PUBLISHED_TO_TESTERS"):
            raise RuntimeError("Unexpected submission state; inspect the dashboard before another run.")
        outcome = f"Submission API state: {state}. Check the dashboard/listing for distribution."
    report = f"Version: {version}\nZIP SHA-256: {hashlib.sha256(data).hexdigest()}\n{outcome}\n"
    print(report)
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as summary:
            summary.write(report)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("package", type=Path)
    parser.add_argument("version")
    parser.add_argument("--submit", action="store_true", help="Submit for review and publish after approval.")
    parser.add_argument("--check", action="store_true", help="Validate the local ZIP without network access.")
    args = parser.parse_args()
    try:
        if args.check:
            data = package_bytes(args.package, args.version)
            print(f"Validated version {args.version}; ZIP SHA-256: {hashlib.sha256(data).hexdigest()}")
        else:
            release(args.package, args.version, os.environ.get("CWS_ACCESS_TOKEN", ""),
                    os.environ.get("CWS_PUBLISHER_ID", ""), os.environ.get("CWS_EXTENSION_ID", ""), args.submit)
    except (ValueError, RuntimeError, OSError, zipfile.BadZipFile) as error:
        print(f"Release stopped: {error}", file=sys.stderr)
        sys.exit(1)
