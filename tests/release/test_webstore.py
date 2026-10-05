"""Exercise the release boundary without credentials or store mutations."""
import importlib.util
from contextlib import redirect_stdout
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile

spec = importlib.util.spec_from_file_location(
    "webstore", Path(__file__).parents[2] / "scripts/release/webstore.py"
)
webstore = importlib.util.module_from_spec(spec)
spec.loader.exec_module(webstore)
ITEM = "a" * 32
NAME = f"publishers/test-publisher/items/{ITEM}"


class ReleaseBoundary(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.package = Path(self.tmp.name) / "extension.zip"
        self.write_package("0.3.0")

    def write_package(self, version):
        with zipfile.ZipFile(self.package, "w") as archive:
            archive.writestr("manifest.json", json.dumps({"manifest_version": 3, "version": version}))

    def run_release(self, responses, submit=True):
        requests = []

        def respond(request, **_):
            requests.append(request)
            response = responses.pop(0)
            if isinstance(response, Exception):
                raise response
            return io.BytesIO(json.dumps({"name": NAME, "itemId": ITEM, **response}).encode())

        with patch.object(webstore, "urlopen", side_effect=respond), patch.object(webstore.time, "sleep"), redirect_stdout(io.StringIO()):
            webstore.release(self.package, "0.3.0", "test-token", "test-publisher", ITEM, submit)
        return requests

    def test_upload_poll_then_submit_and_no_review_bypass(self):
        requests = self.run_release([
            {}, {"uploadState": "IN_PROGRESS"},
            {"lastAsyncUploadState": "IN_PROGRESS"}, {"lastAsyncUploadState": "SUCCEEDED"},
            {"state": "PENDING_REVIEW"},
        ])
        self.assertEqual([r.get_method() for r in requests], ["GET", "POST", "GET", "GET", "POST"])
        self.assertEqual(requests[1].data, self.package.read_bytes())
        self.assertIn("/upload/v2/", requests[1].full_url)
        self.assertEqual(json.loads(requests[-1].data), {
            "publishType": "DEFAULT_PUBLISH", "skipReview": False, "blockOnWarnings": True,
        })

    def test_upload_only_never_submits(self):
        requests = self.run_release([{}, {"uploadState": "SUCCEEDED", "crxVersion": "0.3.0"}], False)
        self.assertEqual(len(requests), 2)

    def test_package_mismatch_stops_before_network(self):
        self.write_package("0.2.0")
        with patch.object(webstore, "urlopen") as request, self.assertRaises(ValueError):
            webstore.release(self.package, "0.3.0", "test-token", "test-publisher", ITEM, True)
        request.assert_not_called()

    def test_failed_unknown_or_mismatched_upload_never_submits(self):
        for result in [{"uploadState": "FAILED"}, {"uploadState": "UNKNOWN"},
                       {"uploadState": "SUCCEEDED", "crxVersion": "0.2.0"},
                       {"uploadState": "SUCCEEDED", "crxVersion": "0.3.0", "itemId": "b" * 32}]:
            with self.subTest(result=result), self.assertRaises(RuntimeError):
                self.run_release([{}, result])

    def test_existing_review_or_published_version_blocks_duplicate(self):
        for result in [{"submittedItemRevisionStatus": {"state": "PENDING_REVIEW"}},
                       {"publishedItemRevisionStatus": {"distributionChannels": [{"crxVersion": "0.3.0"}]}},
                       {"warned": True}, {"lastAsyncUploadState": "IN_PROGRESS"}]:
            with self.subTest(result=result), self.assertRaises(RuntimeError):
                self.run_release([result])

    def test_uncertain_upload_is_not_retried(self):
        with self.assertRaisesRegex(RuntimeError, "not retried"):
            self.run_release([{}, TimeoutError("uncertain")])

    def test_polling_is_bounded(self):
        with self.assertRaisesRegex(RuntimeError, "still processing"):
            self.run_release([{}, {"uploadState": "IN_PROGRESS"}] + [{"lastAsyncUploadState": "IN_PROGRESS"}] * 12)


if __name__ == "__main__":
    unittest.main()
