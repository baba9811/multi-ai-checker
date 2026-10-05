# Verification observations

These are dated observations, not permanent product guarantees. Durable working rules live in [AGENTS.md](../../AGENTS.md).

## Local investigation — 2026-10-06 KST

### Overlapping Playwright output cleanup

- Observation: the unpacked-extension suite failed during `context.close()` with missing trace/network files under `test-results/extension/.playwright-artifacts-*`.
- Cause: the browser suite started concurrently and used the parent `test-results` output directory, which Playwright cleans at startup. Both npm scripts also rebuild the same `.output` directory.
- Correction: run these suites sequentially. Do not diagnose the missing artifacts as a manifest or permissions assertion failure. Preserve logs and rerun the affected suite in isolation.
- Verification: isolated reruns passed. The later 0.3.0 run completed all 45 synthetic browser tests and all 3 installed-extension tests sequentially. The initial overlapping failure remains evidence of an invalid test setup, not a product pass.

### Native installation dialog and stale observations

- Observation: chained native file-picker actions initially selected an unrelated previously visited directory. Later, accessibility text still reported the earlier missing-manifest error while a screenshot and fresh browser snapshot showed CrossCheck installed.
- Correction: observe the picker, path-entry sheet, resolved directory, and installation result separately. Confirm the directory contains `manifest.json`. Resolve conflicting accessibility/screenshot evidence before retrying installation.
- Status: CrossCheck 0.2.0 was visibly installed in Aside, and its production panel opened. This alone does not verify live message sending or native side-panel behavior.

### Browser timeouts under contention

- Observation: several browser tests exceeded their timeout, including a failure while setting up the `page` fixture before any product assertion. The host simultaneously reported high system load.
- Interpretation: resource contention is a plausible contributor, not yet a proven explanation for every timeout.
- Correction: inspect the specific failing phase and trace; rerun one affected test with no competing project test process before changing application logic or timeout settings. Do not stop unrelated user processes.
- Verification: the affected cases passed in isolation, followed by the sequential 0.3.0 suites. This supports contention as a contributing factor without proving the cause of every earlier timeout.

### Upload readiness differs by provider and file type

- Observation: live ChatGPT, Claude, and Gemini expose different attachment controls. Gemini separates document and image inputs, closes its upload menu after each selection, omits the filename from image chips, and omits file extensions from document removal labels. Its accessibility snapshot also omitted attachment chips that were present in the DOM.
- Correction: use provider-owned, composer-scoped adapters and inspect actual upload controls. Require exact expected attachment count, usable previews, completed upload indicators, and stable attachment nodes before sending. A missing accessibility label is not evidence that the upload disappeared.
- Verification: synthetic tests cover document plus image uploads for all three providers, progress and error states, existing drafts, corrupt payloads, and user replacement during upload. The synthetic ChatGPT live conversation read the selected text token and image correctly. This is not evidence of a completed live multi-provider extension run.

### Delivery receipts belong to the destination conversation

- Observation: a provider-level delivery flag could omit originals after reconnecting that provider to a different conversation.
- Correction: bind the successful delivery receipt to provider, tab, document, and exact conversation URL. Reuse it only for that same destination; otherwise upload the selected originals again.
- Verification: a workflow regression covers a changed destination and preserves the no-silent-omission rule.

### Native rich-text editing and nested upload controls

- Observation: the first native-panel attachment run uploaded both selected originals to Claude but stopped before Send because ProseMirror represented each input newline as a paragraph and `innerText` added display-only spacing. Gemini stopped before upload because its document component contained both the real direct input and a nested legacy `Filedata` input.
- Correction: serialize the observed ProseMirror paragraph structure into logical lines for the exact pre-Send check; preserve spaces, blank lines, and literal text. Scope Gemini document selection to the direct child input. Do not loosen text equality or choose an arbitrary matching input.
- Verification: both defects were reproduced against the built bridge before correction. Three concurrent Claude text/line/space-edit guards already passed before the correction. The corrected cases passed in the final 53-test synthetic browser suite; the final installed-extension suite passed all 3 tests in 7.1 seconds. The post-correction native attempt did not establish a new provider send or a completed live pipeline; see [validation](../testing/validation.md).

### Native capture and browser DOM can disagree

- Observation: during replacement testing, Aside's browser DOM and page screenshot showed the extension manager, while native screenshots showed blank web content. Clicking removal did not establish removal or an accessible confirmation dialog.
- Correction: record the discrepancy and verify the installed version independently. Do not repeat destructive actions from stale references or claim installation success from a click alone. Release native control when returning to code work.
- Final observation: the latest native attempt selected both originals and found Claude/Gemini composers ready, but CUA accessibility text, pixels, and button state disagreed. Repeated scrolling returned `noWindowsAvailable`; fresh bindings and a control reset did not resolve it. No new provider send occurred after the latest fixes. A final read-only check found both composers empty, and native control was reset off.
- Interpretation: this control discrepancy does not establish another provider defect or successful sending. The complete three-provider live pipeline, uninstall/reinstall, and store-managed automatic updating remain unverified. A separate installed-extension test profile passing does not resolve this live browser observation.

### Confirming original files in a native picker

- Observation: selecting both originals and pressing Return produced a confirmable selection more reliably in this session than clicking Open.
- Limit: this is an observed difference between attempts, not a proven cause of the native control discrepancy or a guarantee for other pickers. Keep observing each state transition and confirm the selected files in the panel before starting.

### Final automated evidence and package identity

- Verification: the final type check, 55 unit tests, production build, 53 synthetic browser tests, and 3 installed-extension tests passed. These are distinct from the incomplete final live service run.
- Package: the 0.3.0 ZIP is 159,027 bytes, SHA-256 `30c17d9894e7d21e6f025b511640523f07effc739135cee22dce3499962bf3c0`. All 12 ZIP files are byte-identical to their counterparts in the current production build.
- Limit: package creation and identity checking do not establish store upload, review submission, public publication, or live provider compatibility. The detailed evidence belongs in [validation](../testing/validation.md).

### Environment and installation assumptions

- Observation: the checkout had no installed dependencies initially; its browser-test config defaulted to a Linux-only executable path. Aside contained the three logged-in service tabs but no CrossCheck installation.
- Correction: inspect the current machine and actual browser profile first. Use the locked dependency install and the Playwright-managed browser. Treat earlier cloud installation-policy failures as historical, not as current local blockers.

### Read-only connection checks must remain read-only

- Observation: passive connection refresh reattached a saved tab to its current document/URL. A stopped review could therefore resume into a different conversation without an explicit reconnect. A related race existed between checking a saved tab URL and taking a new binding snapshot.
- Correction: passive checks and resume inspect the exact saved binding. Only an explicit reconnect can replace it. Reject changed documents and exact URLs at the shared inspection boundary.
- Verification: three connection regressions failed before the corrections and passed afterwards; the focused connection suite passed all 15 cases.

### Updates clear session storage

- Evidence: Chrome documents that extension disable, reload, update, and browser restart clear `storage.session`, including review state and bindings. An open side panel delays normal update installation.
- Correction: use Chrome's passive update lifecycle, display installed and pending versions without claiming latestness, and ask users to export needed review records before closing for an update. Do not add persistent private storage or force a reload to hide this lifecycle.
- Sources and implementation rationale: [release/updates.md](../release/updates.md).

### Release identity must trust reviewed workflow code

- Observation: independent review of the initial release workflow found that a tag-defined ancestry check could be removed in the same untrusted tag that requested publishing credentials. A tag/environment name alone did not enforce main-branch provenance. A hardcoded legacy GitHub OIDC subject also mismatched this repository's newer immutable subject format.
- Correction: put authentication and provenance checks in a reusable workflow loaded from the trusted main branch; enforce that reusable workflow identity, immutable repository/owner claims and environment in the Google trust policy. Use the exact same-run validated ZIP artifact, not a rebuild after authentication.
- Verification: the independent re-review found both issues resolved; actionlint and seven simulated uploader-boundary tests passed. Real Google authentication is still unverified. The maintained setup and state belong in [release automation](../release/automation.md).

### Observe native picker state before declaring it blocked

- Observation: the delegated DOM-only draft attempt could not operate the OS picker. A later native-control attempt opened the actual store picker. Paste did not change the path; both fresh accessibility text and screenshot confirmed that failure. Setting the observed path field directly did change it; Return resolved the exact ZIP, and Open started upload.
- Verification: a fresh store DOM showed the resulting item in draft status, and its Package page confirmed version 0.3.0 and the expected permissions. Native control was reset immediately afterwards. This success does not prove that earlier live-review control discrepancies are resolved.

### Verification links can carry secrets in their path

- Observation: an email verification link rendered its token in the URL path and link label, so query-string-only redaction did not remove it from the observed output. No token is retained in repository files.
- Correction: inspect authentication/verification surfaces with allowlisted status and element-reference metadata. Do not print raw link labels or full URLs; sensitive values are not confined to query strings. Validate the destination origin without logging the complete URL.
- Verification: the intended official confirmation completed and the dashboard reported a verified contact. This does not make raw verification-link logging acceptable; the existing repository privacy rule already forbids it.

## Recording further lessons

For a new incident, record the observed failure, evidence, confirmed cause (or explicitly labeled hypothesis), correction, and verification result. Remove private data and machine-specific account details. Promote only reusable rules into `AGENTS.md`; keep dates and evolving results here or in `docs/testing/validation.md`.
