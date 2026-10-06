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
- Verification: the independent re-review found both issues resolved; actionlint and seven simulated uploader-boundary tests passed. Those review checks did not verify Google authentication; the subsequent real deployment evidence and maintained setup belong in [release automation](../release/automation.md).

### Observe native picker state before declaring it blocked

- Observation: the delegated DOM-only draft attempt could not operate the OS picker. A later native-control attempt opened the actual store picker. Paste did not change the path; both fresh accessibility text and screenshot confirmed that failure. Setting the observed path field directly did change it; Return resolved the exact ZIP, and Open started upload.
- Verification: a fresh store DOM showed the resulting item in draft status, and its Package page confirmed version 0.3.0 and the expected permissions. Native control was reset immediately afterwards. This success does not prove that earlier live-review control discrepancies are resolved.

### Verification links can carry secrets in their path

- Observation: an email verification link rendered its token in the URL path and link label, so query-string-only redaction did not remove it from the observed output. No token is retained in repository files.
- Correction: inspect authentication/verification surfaces with allowlisted status and element-reference metadata. Do not print raw link labels or full URLs; sensitive values are not confined to query strings. Validate the destination origin without logging the complete URL.
- Verification: the intended official confirmation completed and the dashboard reported a verified contact. This does not make raw verification-link logging acceptable; the existing repository privacy rule already forbids it.

## Multi-turn source review — 2026-10-06 KST

### Shared context must match the imported scope

- Observation: the earlier snapshot/import contract retained only the latest question and answer; earlier turns never reached peer collection. A visible turn count alone would have misrepresented what was shared.
- Correction: carry ordered completed pairs through import, every prompt stage, stored review metadata, and export. Show the loaded scope and complete preview. Verify the entire captured transcript before starting and before sending back to the main; only completed extension-owned exchanges may be appended.
- Verification: regressions preserve earlier context, reject preceding-turn changes and unrelated additions, and finish a thorough review whose own appended prompt exceeds the source-import limit. Transport inspection and user-import limits serve different purposes and must not be conflated.

### Partial-history checks must inspect the captured population

- Observation: independent review found that all DOM turn indices were checked while extraction filtered hidden messages. Hidden, inert, or aria-hidden earlier units could fill numerical gaps although their text was omitted.
- Confirmed cause: index completeness and text extraction operated on different message populations. Three built-bridge fixtures reproduced the missing rejection before correction.
- Correction: associate observed history markers with the messages actually captured. Reject detectable missing history without inventing unobserved provider selectors or claiming unloaded history is complete. The focused built-bridge regressions passed after correction; live virtualization remains a separate verification scope.

### UI copy changes affect every control caller

- Observation: full browser verification failed in three existing cases after visible peer checkboxes and new originals-confirmation copy were introduced. Two assertions used an unscoped checkbox locator; the update-lifecycle check still requested the removed label.
- Correction: keep assertions scoped to their semantic control and inspect all callers when changing shared UI copy. Preserve the first failure artifacts before rerunning. The targeted source-reset, unavailable-source and update-lifecycle checks passed after correction.
- Related user-facing issue: an over-limit source passed transport validation but failed the stricter import schema with raw Zod issue JSON. Translate that expected boundary failure into concise Korean limit and recovery guidance; keep validation strict.

## Recording further lessons

For a new incident, record the observed failure, evidence, confirmed cause (or explicitly labeled hypothesis), correction, and verification result. Remove private data and machine-specific account details. Promote only reusable rules into `AGENTS.md`; keep dates and evolving results here or in `docs/testing/validation.md`.

## Live provider readiness and completion — 2026-10-06

- The first installed multi-turn run uploaded the selected synthetic TXT/PNG and sent Claude's prompt successfully. Its completed answer remained pending because the Copy toolbar was a sibling of the streaming wrapper. The nearest observed article isolates one assistant and its toolbar; a broad transcript ancestor also includes other messages and must not be accepted. The regression suite covers sibling tools, streaming state, previous-turn tools, and additional visible/hidden responses.
- A second installed run exposed background readiness differences: Gemini's document upload input remained absent during a bounded poll (guard valid), while activating the same tab revealed its file menu. A separately observed active menu mounted the input in about 0.4 seconds. Claude's new background tab similarly preserved a filled draft after its send button was not ready; activation showed the button. Treat foreground readiness as a workflow concern before extending deadlines. High host CPU was observed; no unrelated processes were terminated and no builds/tests overlapped live sends.
- A diagnostic error briefly reported only provider, MIME type, candidate count, validity and elapsed time to isolate that failure. Remove diagnostic probes from the shipped source and installed build; do not serialize conversations, credentials, account identifiers or attachment bytes for debugging.

### Cancellation must preserve work that never began

- Observation: independent review found that the sequential job loop caught an already-aborted signal inside the next job's validation handler. It marked that untouched job interrupted, so explicit continuation skipped it despite no send attempt.
- Correction: check cancellation before entering the next job's validation handler; retain its ready state. Keep interrupted status for work whose outcome may be uncertain.
- Verification: the regression failed with interrupted instead of ready, then passed while checking that explicit continuation sends the untouched peer once and never repeats the previous peer's collection.

### A new tab may restore a site's existing draft

- Observation: closing the synthetic Claude draft tab did not discard its site-persisted prompt and attachments. A newly opened home tab restored them, and the extension correctly refused to overwrite the draft.
- Correction: inspect the new tab before assuming it is empty. Clean only explicitly owned test drafts through the site's UI, verify after reload, and explicitly reconnect changed documents. Never add automatic draft deletion to the product.
- Verification: the fresh empty editor and reconnection were observed; the next attempt sent and collected Claude's first response. Subsequent review-send readiness and Gemini paragraph handling are separate failures, recorded in validation.

### Editor display text is not the submitted logical text

- Observation: live Gemini uploaded both originals, but its Quill composer represented the prompt as paragraphs with placeholder BRs. `innerText` added display newlines, so exact comparison correctly stopped the send against an incorrectly decoded draft.
- Correction: reuse the existing paragraph decoder for the observed Quill editor. Remove only the sole placeholder BR in an empty paragraph; preserve paragraph boundaries, real inline BRs, spaces and deliberate blank paragraphs. Do not normalize arbitrary whitespace or weaken concurrent-edit guards.
- Verification: corrected fixtures reproduced the old built bridge's mismatch for both paragraph-only and real-inline-BR prompts. The updated bridge passed these cases and text/blank-line/spacing mutation rejections in the 65-case provider/editor run. Live verification remains a separate step.

### Readiness polling must retain the editor's settling boundary

- Observation: live Claude preserved a filled review draft because Send was not ready at the existing single check. The first bounded-poll implementation could click an already-ready button synchronously, accidentally removing the existing settling window.
- Evidence: independent review identified the regression; all three unchanged ProseMirror concurrent-edit checks failed against that first implementation.
- Correction: retain the minimum 300 ms settling window within a bounded 2.5-second readiness check. Recheck exact editor/text, operation validity, attachments, generation and unique enabled Send before the sole click. Missing readiness remains a stopped request, never an automatic resend.
- Verification: delayed readiness, all three unchanged concurrent-edit checks and cancellation, URL change, replaced editor, ambiguous controls and attachment guards passed in the 65-case provider/editor run. These limits describe current implementation evidence, not permanent repository-wide timing rules.

### Accessible duplicate labels are not conversation content

- Observation: Gemini sent the prompt and generated an answer, but an accessibility-only H5 duplicated part of the question and broke association with the exact sent text.
- Correction: exclude the observed screen-reader-only class at the shared text extraction boundary. Preserve legitimate visible headings, actual question text and multiple-question rejection.
- Verification: the focused positive and negative regressions and the 72-case provider/editor run passed after a confirmed baseline failure. This is separate from live collection evidence.

### Settling must cover the first exact comparison

- Observation: the send loop delayed its click but compared text immediately. A synthetic asynchronous paragraph cleanup reproduced a false draft mismatch before the settling deadline. Later stable live Claude DOM matched the prompt, but its insertion-time layout was not captured.
- Correction: gate the first exact comparison and sole click with the same settling condition while checking cancellation, editor identity, generation and files immediately. Do not weaken comparisons or lengthen the wait without evidence.
- Verification: all existing early concurrent edits and new postsettling mutations remained blocked. The next live run collected Claude's answer and review; the whole three-provider pipeline still encountered separate loading/filename failures.

### Resetting a native-control client does not prove its helper stopped

- Observation: after a store-image picker attempt, native screenshot capture timed out. Resetting the control REPL left its dedicated helper running at about 27% CPU; the Aside REPL also did not exit normally.
- Correction: follow the user's explicit request to stop unused computer control. Stop the identified control helper gracefully and interrupt only the task-owned REPL; do not terminate unrelated apps or broad process groups.
- Verification: a fresh process listing no longer contained the dedicated helper and the task REPL exited. Image slots were not confirmed uploaded; prepared local artwork is separate from store persistence. Check that the supported native tool restarts normally before later UI work.

### Attachment display aliases must remain one-to-one

- Observation: ChatGPT accepted the same synthetic originals but displayed duplicate-name counters, so literal original-name readiness stopped before prompt input.
- Correction: accept only the provider's observed literal stem, positive integer counter and exact extension; require one unique original per tile and every original exactly once. Bind the confirmed display label into the existing receipt so a later rename also invalidates readiness.
- Verification: the positive alias case failed before the fix; missing, extra, wrong, colliding and changed-label fixtures remain rejected. This does not infer file bytes from a name or thumbnail.

### Install a fake clock before the code creates its timers

- Observation: the new attachment-positive browser fixture sent once with exact bytes but response collection stayed pending when the test replaced timers after bridge initialization.
- Correction: install the existing Playwright clock before navigation and bridge injection. Keep product polling, exact comparisons and time bounds unchanged.
- Verification: preserving the first artifacts and changing only clock initialization made the same focused positive fixture pass; related attachment guards also passed.

### Cancellation after awaited preflight is still known-unsent

- Observation: cancellation during preparation, reveal or inspection entered an error handler before any persisted send intent; it could erase the ready checkpoint.
- Correction: propagate cancellation before both pre-intent catch handlers mutate jobs. Preserve the conservative interrupted state after persisted sending intent.
- Verification: five new baseline failures and one already-safe case; all six pass with zero sends before cancellation and exactly one on explicit continuation. Related workflow guards remain green.

### Captured continuity alone misses an omitted suffix

- Observation: filtering known keys down to captured messages first left a valid index zero when later complete pairs were hidden, inert or aria-hidden.
- Correction: reconcile recognized user/assistant keys in captured threads with the captured population before accepting continuity. Do not scrape hidden text, include unrelated tool/thread markers or invent unmarked history.
- Verification: three later-omission fixtures failed before the fix. Fourteen relevant history/context cases pass, including earlier omissions and a complete-history positive case with unrelated markers.
