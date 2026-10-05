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

As of 2026-10-06, local uploader checks pass against simulated v2 responses and the prepared 0.3.0 ZIP passes offline validation. The initial store draft was created with item ID `jkffbjajcmbcobmgbcilenbpjfemapki`. The Google publishing identity is not connected; no real API upload or review submission has been tested. The existing local Google Cloud CLI account is unrelated to the selected personal publisher and must not be repurposed implicitly.
