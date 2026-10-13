# Verification observations

These are dated observations, not permanent product guarantees. Durable working rules live in [AGENTS.md](../../AGENTS.md).

## Imported-conversation Claude peer — 2026-10-13 final evidence

### Reconnect must preserve local ownership through snapshots and UI equality

- Observation: independent review reproduced reconnecting older reserved peer A while B was saved. Snapshot/attach discarded A's local thread marker, so the UI saved a healthy-looking normal binding and ordinary preparation reused a page whose bridge correctly refused normal sending. This was a failed-closed workflow regression.
- Cause: ownership existed in the page but was omitted from the public snapshot/binding transition. A same-tab repair could also be dropped because UI equality compared only tab/document/URL.
- Correction contract: expose only the extension's local UUID in a Claude-only snapshot, preserve it in attach/refresh/reconnect and compare it in the connection UI. Reject contradictory ownership during inspect; normal unbound Claude allocates a fresh home rather than selecting retained peers, while an explicit normal saved connection remains exact. Server IDs/receipts remain provider-local.
- Evidence: focused connection regressions and ownership-only UI equality were red before the fix and green afterward. Final corrected code passed 304 unit/type/build, 132 synthetic browser checks, nine installed-origin cases and native original-file acceptance. The earlier text-only native success predates this correction.

### Rendered evidence must come from the actual production path

- Observation: an inactive research stub can expose a different rendered state from a regular service tab controlled through the native browser. Treating it as the user's actual source or native sidepanel can misstate readiness and captured scope.
- Decision: reacquire actual ordinary-tab/native state and load the exact production panel. Import the rendered source there and verify all captured Q/A pairs, unchanged source and foreground through returned peer answers. Do not substitute a stub, manual provider POST or injected adapter for native acceptance.
- Evidence: the initial native text run imported two actual rendered pairs. Final artifact acceptance imported three actual pairs and reselected the known original TXT/PNG through the native picker; both Claude stages retained context, text token and image description while the original three pairs and selected tab remained unchanged.

### Outbound file shape is not authoritative saved-file shape

- Evidence: credential-omitted public client assets establish inline small TXT objects, awaited multipart PNG receipt UUIDs and completion projection. Draft-restoration validators do not establish saved history. Sanitized task-owned synthetic normal-UI history supplied the stable first-message TXT metadata/content and PNG identity representation before implementing exact membership checks.
- Contract: bind checked local bytes to awaited upload receipts and exact history, preserve the full manifest even when review sends no new bytes, and reject missing/extra/duplicate/changed receipts. Do not use thumbnails, a filename or the model's recognition as a substitute for identity; do not claim a server-side byte-hash check when none is exposed.
- Bounds: peer history alone uses an 8 MiB cap for accepted escaped TXT/prompts/answers; fixed diagnostics/metadata/upload JSON/SSE retain existing bounds. There is no conversion, image transform, silent omission or upload retry fallback.

Current final evidence: 304 unit/type/build, 132 full synthetic cases (2.8 minutes), nine installed-origin cases (20.0 seconds), independent re-review and native original-file acceptance. Owned Claude homes and research tabs were closed, original source/completed panel retained, REPL exited and authorized native helper absence confirmed. AGENTS.md now states the reusable complete ownership invariant across snapshots, reconnection, messaging, persistence and delivery receipts; changing field names and evidence stay here.

## Page-local transport investigation — 2026-10-12 KST

### Model controls can contain settings beyond the model name

- Observation: a read-only live UI check showed the current Claude control combining a model label with an effort label. Comparing that whole control text with an individual model option blocked the connection probe.
- Confirmed cause: `modelMenu()` returned the trigger's composite text even when the menu exposed a uniquely checked model option. A synthetic regression reproduced the mismatch before correction.
- Correction: when selection markers exist, read the single enabled selected option's own label. Reject no selection, multiple selections, and disabled selections rather than guessing by removing words from the control text. Use the existing trigger fallback only when the menu exposes no selection markers.
- Verification: the checked-option, ambiguous-check and delayed-close fixtures are included in the related browser checks recorded below. No account name, conversation sidebar, or private page capture was retained in fixtures.

### Model selection and menu closure can complete asynchronously

- Observation: a model click may leave the previous checked option and open menu visible briefly before the new selection appears and the menu closes. The delayed-close synthetic case reproduced this transition.
- Correction: wait within the existing bounded confirmation loop for fresh selected-state evidence. Reopen the owned menu for confirmation only after the previous options disappear, and close the menu owned by this operation afterward. A click or old trigger label alone is not selection confirmation.
- Verification: immediate and delayed closure both pass the related browser regression. This synthetic timing evidence does not establish every live account rollout.

### A model-name wrapper can include hidden or descriptive text

- Observation: a model-name wrapper contained the visible model name, a description, and icon text. The regression expected the synthetic model label but received those concatenated strings.
- Confirmed cause: `textContent` flattened all descendants of the wrapper. The pre-correction synthetic assertions failed for both immediate and delayed menu closure.
- Correction: reuse the existing label helper and read the wrapper's first displayed `innerText` line, then retain the existing trim and length bound. Keep selected-option cardinality and disabled-state checks; do not strip guessed suffixes or hardcode models.
- Verification: both focused cases pass after the correction. The latest related browser run also covers other providers' menus and unsupported UI.

### Navigation guards must cover asynchronous preflight requests

- Observation: independent review identified that same-origin navigation during the organization/model GETs could occur before the completion POST. An origin-only check would still permit the mutation in a changed page.
- Confirmed cause: the initial URL check did not span all awaited metadata work. A regression changed the exact URL during the second GET and demonstrated that the old code could reach POST.
- Correction: retain the starting URL and verify it with the origin and cancellation state immediately before every request. Preserve the bridge's document/URL checks and never fall back to a different transport after an uncertain send.
- Verification: the regression now rejects before POST; the provider unit checks cover this boundary. A live generation pass is separate evidence.

### Stop must reach tab readiness before bridge injection

- Observation: Stop during an owned tab's loading stage could wait for the full readiness deadline even though generation had not begun.
- Confirmed cause: the readiness loop did not receive the probe's AbortSignal. The regression kept tab status loading and initially failed the prompt-cancellation assertion.
- Correction: pass cancellation through the existing readiness helper and check it before and after each tab-state read. Do not inject or generate after cancellation; do not change unrelated callers' readiness behavior.
- Verification: the focused session regression confirms prompt rejection with no bridge injection or generation.

### API-only organizations are not chat destinations

- Observation: the third native probe stopped at organization selection before POST. A safe read-only check reported only that the response was an array of two valid-UUID organizations with capability arrays, exactly one having chat capability; no organization identifier or raw account response was logged.
- Confirmed cause: the initial prototype required one total organization, although the account may expose an API-only organization alongside its Claude chat organization. A new two-organization regression failed before correction. The public first-hand [usage-provider implementation](https://github.com/dineshkruplani/Claude-Usage-Badge-Extension/blob/7b4262c9faff033a23791b41a483fa621a06701d/src/providers/claude-web.ts#L101-L104) and [findings](https://github.com/dineshkruplani/Claude-Usage-Badge-Extension/blob/7b4262c9faff033a23791b41a483fa621a06701d/docs/PHASE1-FINDINGS.md#L78-L94) distinguish these capabilities.
- Correction: require exactly one organization whose validated capability array includes chat, then validate its UUID. Reject absent or multiple chat-capable destinations. Do not copy the public implementation's first-item/plan fallback or logging.
- Verification: the pre-correction failure is recorded and the latest unit check passes. The fifth native attempt progressed past organization selection but stopped at model catalog before POST, as detailed below.

### Successful account reads can still lack a usable model catalog

- Observation: the fifth native probe on the installed production side panel passed actual UI-model and chat-organization selection, then reported the fixed catalog-stage reason before POST. A safe same-origin GET returned HTTP 200 and confirmed only that `claude_ai_bootstrap_models_config` was explicitly null; no raw body, identifiers, or credentials were logged.
- Confirmed blocker: the current account response provides no validated UI-name/backend-model pair for the strict request path. This is not fixed by successful login, HTTP 200, or a synthetic fixture's model array.
- Decision: stop before generation. The pinned [AIFuel implementation](https://github.com/robertogogoni/aifuel/blob/de119ddd68e29adc23ad0d9abbd9ad14f087efb6/internal/installer/chrome-extension/background.js#L63-L97) treats a null catalog as empty; public clients' static default models do not establish this account's available or selected model. Do not guess, hardcode or substitute a plan/model to obtain a pass.
- Historical checkpoint: the legacy catalog did not provide an account/UI/backend pairing source and live generation was not established. The subsequent bootstrap/UI pairing work below replaces this dependency; it does not turn the fifth failed attempt into a pass.

### Pair the actual selected option with the current bootstrap catalog — Task 4 history

- Source clue: the pinned [Claude2api endpoint declaration](https://github.com/aurora-develop/Claude2api/blob/6a9ea135f41626cd335950c97ba290f42fa7dd64/claude/models.go#L22) identified an `edge-api/bootstrap` path. It is only an endpoint clue, not proof of the current account's model access or generation success. Its cookie/TLS approach was not adopted.
- Observed account structure: the safe read-only bootstrap GET returned HTTP 200 and 679,681 bytes, below the 1 MiB bound. It exposed 15 valid unique `claude_ai_available_models.models[].model_id` values, exactly one chat-capable organization, and exactly one match for the actual enabled selected UI option's owning `data-model-id`. Only counts, validity and match status were reported; no raw response, account/model identifiers or credentials were logged.
- Task 4 correction: capture the selected option's label and request key in provider-page memory, validate the size-bounded bootstrap response and all unique model IDs, and require one exact match. Read the UI again after the GETs and require the same label/key before the existing guarded POST. Missing/malformed/duplicate keys, changed UI, navigation and cancellation prevent sending. Catalog tier labels are not entitlement evidence. Task 6 below replaces popup interaction for the fixed probe only.
- Verification: the legacy null catalog/current-key fixture failed before correction. Typecheck/build and 129 unit tests passed; the subsequent keyboard-activation change passed 17 related synthetic browser cases. New cases cover missing/malformed owning keys and UI changes after bootstrap with zero POSTs. The display-only model RPC fixture confirms the backend key is not exposed. The latest native attempt still stopped at model activation before POST; read-only pairing is not generation success.

### Capture selected values before menu cleanup

- Observation: independent review reproduced a P2 defect where the shared reader returned a selected DOM node, closed/detached the menu in `finally`, then a caller read `innerText`. The detached label flattened description/icon text again despite the earlier visible-line fix.
- Confirmed cause: DOM references outlived the rendered state needed to interpret their text; reading after an awaited helper returned occurred after its cleanup.
- Correction: capture the plain label/key pair while the selected enabled option is still rendered, before `finally` closes the owned menu. The public display catalog remains separate from the provider-local request key.
- Verification: the regression first failed and passes with value capture before cleanup. This fixes a UI-read lifetime error; a synthetic pass is not an actual service response.

### Confirm asynchronous cleanup before returning a menu read

- Observation: a delayed-close regression returned the first model read successfully while the menu was still open; the next read then failed. The initial failing result distinguished a correct value from incomplete cleanup.
- Confirmed cause: dispatching Escape did not synchronously remove the menu or clear its expanded state. Returning immediately left state that the next dependent operation did not expect.
- Correction: wait within a bounded loop for both owned options to disappear and the trigger to leave the expanded state. If the owned menu remains open, use the existing close control and confirm closure again; reject if closure cannot be confirmed.
- Verification: the repeated-read regression failed before correction, then passed with bounded closure confirmation. The related browser run passed 14 cases and all 129 unit checks passed after this fix. Live Escape closure was independently observed to complete asynchronously.

### Synthetic activation handlers can hide a live control mismatch

- Initial observation: the installed-panel attempt stopped at the initial model step before POST. Some live observations appeared to associate page-environment Enter with opening, while isolated activation left the control closed. Further observation below supersedes that causal interpretation. No development/manual generation POST or credential read was used to investigate the difference.
- Confirmed fixture gap: the synthetic control opened through `onclick`, so the old fixture accepted an activation that the live control did not. Prior green menu fixtures therefore did not establish that live activation worked.
- Historical correction: a keyboard-only fixture and adapter passed typecheck/build, all 129 unit checks and 17 related synthetic browser cases. The preceding 14-case result covered cleanup only. Later public-source and live observations showed the fixture was not faithful to native button default activation; this green result is not evidence for the abandoned MAIN-world approach.

### Do not promote a UI observation into an unproven event mechanism

- Observation: after the keyboard correction, the latest installed fixed probe reported `model-activation`: its exact owning control remained closed after Enter in the isolated bridge. The ordinary installed model-list action also failed on the ready active page. This reproduced the issue outside the new/background-tab path; it was not just a loading or background readiness hypothesis.
- Superseding evidence: synthetic Enter dispatch does not invoke a native button's default click. The observed public [event wrapper/click source](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/vendor-frame-DNQ-FS3I.js) follows Base UI conventions; that identifies an event utility, not every menu component. An assumed Radix keyboard mechanism was unsupported. A deferred MAIN-world `button.click()` opened an untouched home page's picker; the installed isolated-click probe still failed at the menu stage before POST. These observations do not establish that moving the product event to MAIN world solves the live problem.
- Source boundary: [Base UI's native button implementation](https://github.com/mui/base-ui/blob/a2dc320c88c90eaa8160e536ec22ddd166576af2/packages/react/src/internals/use-button/useButton.ts) leaves native keyboard activation to the browser; a dispatched keyboard event is not a physical keyboard's default action. A synthetic fixture must not insert that missing default action implicitly.
- Decision: abandon Task 5's MAIN-world activation command/function; its production files and ports have been removed. Keep the proven generic-menu value-capture and bounded cleanup fixes. Use the smaller read-only current-state path below for the fixed probe; do not broaden the authentication or execution boundary to compensate for an unproven UI hypothesis.

### Read a fixed probe's selected state without opening a popup

- Observed account structure: a safe `app_start` GET confirmed one chat state, one matching chat config, one selected row, a config name matching the owning UI label, main section, no disabled reason, and one available-model ID match. Only counts and comparison results were reported; no identifiers, raw account body or credentials were logged.
- Current Task 6 contract: read the closed owning button's first displayed own text node without concatenating its separate effort display. Require exact pairing of the unique chat entry's model in `model_selector_state`, its enabled row name in `model_selector_config`, the actual UI label and one ID in the validated unique available-model list. Re-read the UI label just before the existing guarded POST; missing, ambiguous, disabled or changed state prevents sending. Backend values remain in provider-page memory.
- Primary-source evidence: the current public [state/config reader](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-1-DT-Mq-A-.js) joins chat's stored model to its config row, and the [name/default reader](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-0-Dsui6SsB.js) identifies names, disabled reasons and defaults. Context/default overrides make exact UI comparison necessary. The [current trigger](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-7-B-kXHUOv.js) separates the model name from fast/effort/mode text. These assets are investigation-time evidence, not a stable service contract.
- Task 6 verification: the closed-label/account-state implementation passed typecheck/build, 152 unit checks, 20 related synthetic browser cases and five installed-extension tests. The installed detached-menu regression includes 20 ms cleanup and foreground preservation. Its separate test-only copied manifest pregrants Claude permission, so it does not validate the permission prompt. Independent review found no important issues at this checkpoint. The fixed probe does not open/close the popup; ordinary model-menu behavior remains separate.
- Live distinction: native attempt 20 passed POST but failed response collection. A safe GET of the uniquely identified recent owned fixed-prompt conversation returned HTTP 200, exactly two messages and assistant text `CROSSCHECK_OK`. This confirms generation, not the original POST UUID's exact product-path binding or a successful panel result. Native attempts 21 and 22 isolated response binding and then the mismatch between both requested and server-returned message IDs. No identifiers, raw response or credentials were logged.

### Requested identity is intent; server identity requires independent binding

- Confirmed cause: the collector assumed the submitted client human/assistant UUIDs were authoritative. Native response diagnostics confirmed that both server UUIDs differed. The public [Qv client](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-1-DT-Mq-A-.js) also handles `clientUuidHonored: false`; this is protocol evidence, not proof that every account follows the same behavior.
- Task 7 correction: accept valid distinct stream IDs only provisionally while retaining strict block/terminal completion. Then read the exact newly created conversation UUID through a bounded same-origin GET and require the fixed human prompt, two unique human/assistant messages with IDs equal to the stream, parent/leaf relations, exact requested model, empty attachment/file/sync-source lists, `truncated: false` and `end_turn`. Text-only content arrays are authoritative and must match the prompt/stream answer; legacy text may be empty or identical, never contradictory. An explicitly supplied stream model must match the request. Only this independent binding allows the panel answer. See the public [conversation GET builder](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-l-p-m-3-B9pUKnbr.js).
- Reusable lesson: a client-generated reference records intent and may be rewritten by the authoritative service. Preserve it as the attempt/conversation boundary, then verify returned identity through independently observed request content and relationships. Do not weaken binding to UUID syntax, HTTP success, a plausible answer or partial stream; never add a second POST or automatic resend to compensate.
- Verification: latest typecheck/build and 190 unit checks pass; the same tested build passes 20 related synthetic browser cases and five installed-extension tests. Native attempt 23 on the exact reloaded production path completed the actual panel flow and displayed `CROSSCHECK_OK`. The selected extension-manager tab remained active and the new Claude tab inactive. No raw IDs, account content or credentials were retained in docs. This is one fixed-text success, not full multi-provider migration.

### Authoritative content may coexist with empty legacy text

- Observation: the actual owned-conversation readback had authoritative text content arrays while legacy text fields could be empty. Requiring every legacy field to duplicate content would reject an otherwise independently bound response.
- Correction: require text-only content to equal the literal fixed prompt or completed stream answer. Accept legacy text only when empty or identical; reject conflicting or malformed text. Also bind the saved model to the requested model and reject explicit stream model mismatch.
- Verification: focused unit branches are included in the final 190-check pass, followed by the latest synthetic/installed checks and native 23's completed panel response. Independent final production and regression review reports no important findings.

### Evidence at this handoff

- The final Task 7 source passed typecheck/build and 190 unit checks at 17:33 KST, 20 related synthetic browser cases at 17:34 and five installed-extension tests at 17:35 on 2026-10-12. The Task 6 152-check result, preceding 125/10 and 129/17 checkpoints, and full 114-case run cover earlier source. Task 5 is abandoned and removed.
- Installed tests cover production boundaries/session recovery plus the detached-menu regression. The latter's test-only pregranted manifest does not establish the real permission prompt or live service behavior. The exact experimental CrossCheck 0.4.0 native side panel was separately installed/reloaded and exercised.
- Safe bootstrap reads confirmed account/UI selection. Native 20 generated the fixed answer but collection failed; 21/22 identified rewritten server message IDs. These historical failures were superseded by native 23's actual installed-panel completion with the original selected tab retained and the new tab inactive.
- Fresh independent review of the final production and regression source reported no important findings. Full multi-provider HTTP review, attachments, bound-main synthesis and foreground preservation through those full workflows remain unverified.
- Current follow-up cleanup was confirmed independently of the earlier checkpoint: task-owned Claude test tabs closed sequentially, fresh inventory showed no owned/open or unknown home tabs and preserved unrelated tabs. The selected extension-manager tab and native completed result remained. The task-owned browser REPL exited successfully; its authorized helper was stopped and no actual helper process remained. No store query/upload/submission was made for this experiment.

## Store submission preparation — 2026-10-07 KST

### Filter tab inventories before logging

- Observation: printing an unfiltered browser-tab inventory included unrelated tab URLs and signed URL fields in tool output. The raw values were not copied into repository files or used for this task.
- Cause: inventory output was logged before selecting the task-relevant surface. Sanitizing only later would not undo that exposure.
- Correction: filter to the intended task origin/item in memory, then log only necessary tab references and allowlisted status fields. Omit unrelated titles and URLs; sensitive path/query values must not reach logs.
- Verification: subsequent operations targeted only the selected store item. Repository changes contain no raw inventory or signed URLs; browser control exited after the confirmed submission.

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

### A selected browser tab can still contain a hidden document

- Observation: a content-free attachment diagnostic reported a complete Gemini document, valid operation guard, zero document inputs after 5,970 ms, and `document.visibilityState === 'hidden'`, although the native tab strip selected that tab. Its web-content area was blank. A separately opened normal native tab rendered the page and uploaded both synthetic originals with the same adapter and timing bounds.
- Interpretation: this isolates the observed upload failure to the tab/document activation environment rather than proving a wrong upload selector. The exact Aside lifecycle cause remains unconfirmed; a selected tab ID alone did not establish a visible document.
- Correction: observe the actual rendered surface and document readiness before changing provider selectors or deadlines. Keep browser-control sessions from competing with the installed extension. Temporary diagnostics contain no conversation text, file bytes, credentials, or URLs and must be removed before release.
- Limit: successful upload and generation are separate from collection. The normal-tab attempt exposed a missing Korean completion marker; record that independently.

### Observe the target upload slot, not only the file picker

- Observation: a native accessibility click on an offscreen screenshot control opened the marquee slot instead; the correctly sized screenshot was rejected there as invalid dimensions. No incorrect image persisted. A fresh screenshot located the visible screenshot dropzone, and sequential native pickers accepted the intended icon, two screenshots, and small promo.
- Verification: Save draft, reload, and a fresh listing read retained all four accepted images. The remaining form prerequisite was data-use certification. Image acceptance is not review submission or public listing evidence.

### Completion controls can change independently of response content

- Observation: the normal native Gemini tab uploaded and sent the selected originals, generated a completed answer, then timed out in extension collection. The actual Korean Copy control had `aria-label="복사"` and no test ID inside the same `model-response`; the adapter recognized neither this label nor another matching completion control.
- Correction: add only the observed Korean label to the existing response-scoped completion list. Preserve visible-control, generation, exact prompt association, cardinality and stable-text checks.
- Verification: a built-bridge fixture first sent exactly once but remained pending; the minimal correction passed that case plus hidden-control, previous-response and active-streaming protections. Nine related browser cases and the type/unit/build check passed. Native completion remains a separate acceptance check.

### Upload uniqueness belongs to the active composer

- Observation: the next clean native run collected both peer answers and Claude's cross-review, then stopped before the final ChatGPT send. After home-to-conversation SPA navigation, the page retained two enabled `Attach files` inputs: one in an old form with no editor and one in the current form with one editor. The global input lookup rejected both together.
- Confirmed cause: upload-input selection used document-wide uniqueness while attachment tiles and readiness already used the intended composer's form. A regression also showed the inverse safety issue: when only the unrelated form had an input, the previous lookup could use it.
- Correction: resolve ChatGPT upload inputs from the existing composer-owned region. Reject multiple candidates within that region and reject its missing input even if another form has one. Do not filter native hidden file controls or select the first global match. Keep other providers' observed portal behavior separate.
- Verification: positive leftover-form and missing-own-input regressions failed before correction; same-form ambiguity was already rejected. Final checks and native acceptance are recorded in [validation](../testing/validation.md).

## Installed synthetic navigation — 2026-10-13

- Failure: the new installed-origin context test remained pending instead of reaching its synthetic fixture. Preserved trace artifacts show a challenge-platform request, demonstrating that the extension-created tab's initial navigation was not captured by the intended Playwright route before registration. This was a fixture setup failure, not proof of a provider adapter failure; no security challenge was solved or bypassed.
- Correction: preload a registered synthetic provider tab and let a narrowly scoped test-only allocation substitute return it only for the exact inactive-home request. The test still exercises production readiness, ISOLATED bridge injection, sender-checked RPC, fetch/completion/readback validation, session writes and panel UI. Its disposable pregranted manifest and regular extension-origin panel do not prove interactive permission grants, actual new-tab allocation or native side-panel behavior.
- Evidence: the corrected seven-case installed suite passed, and a separate actual native side-panel context attempt verified both replies, Chrome-created inactive tab, unchanged foreground and exact conversation binding. The fixture's substitutions must be disclosed wherever this result is cited. Related browser and live evidence belong to [the transport investigation](../research/background-web-transport.md).
