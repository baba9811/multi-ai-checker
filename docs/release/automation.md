# Chrome Web Store release automation

## Design and scope

Publish a normal GitHub Release tagged `v<package.json version>` from a commit already on the default branch. The release workflow reuses the ordinary CI job, waits for its sequential checks, and uploads that job's ZIP artifact without rebuilding. It verifies the tag, package and packaged MV3 versions before requesting a short-lived Google access token. Prereleases do not deploy. Pushes and pull requests only validate.

API v2 updates an **existing** item; its first upload, listing, privacy fields and distribution setup remain dashboard work. The API cannot create an item or change its visibility. Submission starts Google's review; it does not mean approval or public availability. [API guide](https://developer.chrome.com/docs/webstore/using-api), [v2 capabilities](https://developer.chrome.com/blog/cws-api-v2).

Use Google's GitHub OIDC action through a dedicated service account, not a stored JSON key or personal refresh token. Build/test jobs have no Google publishing identity. The privileged upload job lives in a reusable workflow loaded from `main`, with its identity enforced by the Google trust condition. It checks the release event, exact tag/commit and main ancestry before authentication, and uses the uploader from that trusted checkout. Protect `main` and release tags from unauthorized changes. The upload job requests only the Chrome Web Store OAuth scope and does not write a credential file. The store-linked service account has publisher-wide item access; limit impersonation to this repository, release workflow, tag events and GitHub environment. [Service accounts](https://developer.chrome.com/docs/webstore/service-accounts), [Google's auth action](https://github.com/google-github-actions/auth).

Implementation sequence: add request-boundary regression tests; implement the dependency-free API uploader; reuse validation CI in a release workflow; lint and independently review; configure the environment; connect the initial store item and publisher identity; verify the first authorized release. The last connection and real deployment are not established by mocked tests.

## One-time connection

1. Complete the initial dashboard item upload and record its **store** item ID and publisher ID. An unpacked extension ID is not a substitute. Complete listing/privacy/distribution fields. Resolve [release gates](release-checklist.md) before review submission.
2. Select an owner-controlled Google Cloud project. Enable `chromewebstore.googleapis.com`, `iam.googleapis.com`, `iamcredentials.googleapis.com`, and `sts.googleapis.com`. Create a dedicated service account, such as `crosscheck-store`, without project-wide Editor/Owner roles or service-account keys.
3. Create a Workload Identity Pool and GitHub OIDC provider (`https://token.actions.githubusercontent.com`). Map `google.subject=assertion.sub` and `attribute.repository_id=assertion.repository_id`. For this repository, restrict the provider with the following condition (verify numeric GitHub ownership IDs if migrating):

   ```text
   assertion.repository_owner_id == '92177860' &&
   assertion.repository_id == '1405903555' &&
   assertion.event_name == 'release' &&
   assertion.ref.startsWith('refs/tags/v') &&
   assertion.environment == 'chrome-web-store' &&
   assertion.job_workflow_ref == 'baba9811/multi-ai-checker/.github/workflows/store-upload.yml@refs/heads/main' &&
   assertion.workflow_ref == 'baba9811/multi-ai-checker/.github/workflows/release.yml@' + assertion.ref
   ```

   Check numeric repository/owner and environment claims directly: new repositories use GitHub's [immutable subject format](https://docs.github.com/en/actions/reference/security/oidc#immutable-subject-claims), so a legacy hardcoded `sub` string will not match.

4. Grant only `roles/iam.workloadIdentityUser` **on that service account** to `principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/attribute.repository_id/1405903555`. Fill project/pool values from the created resources; these are identifiers, not secrets. Do not grant roles to every GitHub repository or create a long-lived key. Follow the official [WIF setup](https://github.com/google-github-actions/auth#workload-identity-federation-through-a-service-account) for the resource creation commands.
5. In the Web Store dashboard's Account section, bind this service-account email. Check any existing binding first: the store permits one linked service account per publisher. Do not overwrite another publisher workflow without resolving its ownership.
6. Configure the GitHub environment **chrome-web-store**, allowing only tags matching `v*`, with these environment variables:

   | Variable                         | Value                                                                                      |
   | -------------------------------- | ------------------------------------------------------------------------------------------ |
   | `GCP_WORKLOAD_IDENTITY_PROVIDER` | Full `projects/.../locations/global/workloadIdentityPools/.../providers/...` resource name |
   | `GCP_SERVICE_ACCOUNT`            | Dedicated service-account email                                                            |
   | `CWS_PUBLISHER_ID`               | Publisher ID from the dashboard                                                            |
   | `CWS_EXTENSION_ID`               | Existing store item ID, 32 lowercase letters `a`–`p`                                       |
   | `CWS_SUBMIT`                     | `false` for upload only; `true` submits and publishes on approval                          |

   Missing/invalid configuration fails the run. Keep `CWS_SUBMIT=false` until live validation and release gates are resolved. Once ready, setting it to `true` automates future review submission; it never skips review or ignores store warnings. No credentials belong in repository files, GitHub variables, logs or chat.

## Each release

1. Increase the package/lock version, complete required validation and release checks, and merge the reviewed source into the default branch.
2. Create the matching `vX.Y.Z` GitHub Release. Use an explicit tag commit; do not move existing release tags. The workflow validates, packages, authenticates, and uploads. It submits automatically only when `CWS_SUBMIT=true`.
3. Inspect the workflow summary's version, ZIP hash and actual API state. Track review and public availability separately in the dashboard/listing. After approval, Chrome manages installed-user updates; see [update behavior](updates.md).

The uploader refuses current warnings/takedowns, another pending/staged review, a concurrent async upload, non-increasing submitted/published versions, mismatched response identity/version, and uncertain upload results. It polls async processing a bounded number of times. The async-status API does not expose a draft version/hash: serialize release jobs and avoid concurrent manual uploads to the same item. The workflow does not cancel older deployments or automatically retry mutations.

After a timeout/network failure, inspect the dashboard **before** rerunning: the upload or submission might have succeeded. Resolve the draft/review there; a blind rerun is not a recovery procedure. A rejected upload/submission should be fixed in source and released with an appropriate new version. Do not use a lower version to roll back; release a higher-version fix. The workflow inherits the dashboard's visibility and rollout settings; check them before enabling submission.

## Validation and current activation

Run `python3 -m unittest discover -s tests/release -v` for the uploader boundary checks; no third-party Python packages or real store requests are used. `python3 scripts/release/webstore.py PATH_TO_ZIP VERSION --check` validates a local artifact without authentication/network. The ordinary CI runs these checks alongside product tests.

As of 2026-10-06, local uploader checks and remote GitHub push, PR and merged-main validation runs pass. PR #1 is merged into `main` and all release workflows are active. The CI ZIP and uploaded local ZIP have byte-identical uncompressed contents; their container hashes are recorded in [validation](../testing/validation.md). The initial store draft was created with item ID `jkffbjajcmbcobmgbcilenbpjfemapki`. The publishing identity is connected and the first real CI authentication/draft upload succeeded as recorded below; review submission has not been attempted. The existing local Google Cloud CLI account is unrelated to the selected personal publisher and must not be repurposed implicitly.

Personal Google Cloud project: `crosscheck-releases-baba9811` (project number `607808545903`). Service account `crosscheck-store@crosscheck-releases-baba9811.iam.gserviceaccount.com` has no keys or project-wide roles. The owner authorized the GitHub/publisher connection. Pool `crosscheck-releases` and OIDC provider `github` were created with the issuer, subject/repository-ID mappings and exact restricted condition above. The console confirmed the repository-specific service-account impersonation binding (`attribute.repository_id="1405903555"`), and Web Store Settings confirmed the linked service account.

GitHub environment **chrome-web-store** now has all five required variables, including provider resource `projects/607808545903/locations/global/workloadIdentityPools/crosscheck-releases/providers/github`. Its deployment rule permits only `v*` tags and `CWS_SUBMIT=false`. IAM, IAM Credentials, STS and Cloud Resource Manager APIs were enabled; the owner directly activated Chrome Web Store API, and its console page confirms Enabled. No personal OAuth refresh token or service-account key was created.

Release `v0.3.1`, source `b0622ca401fa12e22f7512f54b35b994e7085009`, completed [run 37380170468](https://github.com/baba9811/multi-ai-checker/actions/runs/37380170468): sequential CI checks, trusted-main/tag provenance, OIDC/service-account authentication and API v2 draft upload all passed. The uploader reported **Draft uploaded; not submitted for review.** A refreshed Web Store Package page independently confirmed draft **0.3.1**, the expected permissions and no published item. The exact artifact checksum and byte comparison are in [validation](../testing/validation.md). This establishes CI upload, not review approval or installed-user auto-update. Keep `CWS_SUBMIT=false` until the release gates are resolved. Browser control sessions are closed when unused.


Release `v0.4.0`, merged source `f46bde6c0255caa5df097a31c1ced213f251b53b`, completed [run 37449257291](https://github.com/baba9811/multi-ai-checker/actions/runs/37449257291). The full validation job and trusted-main OIDC/API v2 upload succeeded. A reloaded dashboard confirms **0.4.0 draft**, expected permissions, saved public/all-region distribution and no published item. `CWS_SUBMIT=false` remains unchanged. The uploaded artifact matches the native-tested build; exact evidence and limits belong to [validation](../testing/validation.md). This demonstrates a subsequent version update through GitHub Releases without a manual ZIP upload.
