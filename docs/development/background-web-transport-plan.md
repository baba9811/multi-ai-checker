# Claude page-local transport probe implementation plan

> For agentic workers: use subagent-driven-development for the isolated provider adapter and review; root owns the sequential integration and browser validation.

**Goal:** Verify explicit, fixed, non-sensitive Claude connection and context diagnostics without moving the user's foreground tab.

**Current acceptance:** Task 8 native context attempt 1 completed through the exact reloaded production side panel with both expected replies, retaining the selected extension-manager tab and leaving the new Claude tab inactive. Current evidence is 219 unit/type/build, 14 related and 130 full synthetic browser cases, and seven installed-origin checks with their documented fixture substitutions. Independent implementation and test-adjustment review reports no important findings; owned native test tab and helper cleanup are confirmed. Scope is two fixed synthetic question/answer pairs plus one same-conversation follow-up; the default multi-provider workflow remains unchanged.

**Architecture:** The existing isolated bridge performs same-origin requests using browser-managed cookies. Account references stay in that page; a separate metadata-only session record remembers the bounded diagnostic intent and optional context kind. The default multi-provider workflow is unchanged pending full compatibility evidence.

**Tech stack:** Existing TypeScript, Zod, WXT, Vitest, Playwright; no new dependencies or permissions.

## Global constraints

- Preserve the original workflow, attachments, bound-main protections, and browser-managed updates.
- No credentials through development tools, RPC, storage, logs, or developer servers.
- No arbitrary URL/header/prompt proxy, challenge solver, automatic retry, or fallback send.
- One inactive extension-owned Claude home tab; real document/URL validation; no fabricated workflow binding.
- For the fixed probe, read the closed owning button's own displayed model label, pair it exactly with the unique selected chat state and enabled named config from app_start, require one validated available-model ID match, and recheck the UI label before POST. Do not open the popup or infer selection from effort/composite text. Missing/ambiguous/disabled metadata prevents POST; catalog tiers are not entitlement evidence.
- Require one unique chat-capable organization; exclude API-only organizations and never choose the first or infer a plan.
- Persist intent before the mutating request; closing/reloading the panel makes unfinished results uncertain and never resumes them.
- Treat valid distinct server stream IDs as provisional. Require closed text blocks, end_turn and message_stop, then independently bind the exact new conversation's fixed prompt, authoritative message pair/parent/leaf and text-only answer through a bounded readback before returning the panel answer. Client-requested message IDs are intent, not guaranteed server identity; EOF/HTTP success alone is insufficient.
- Evidence categories remain separate. Never equate synthetic fixtures with live success.

## Task 1: Provider-owned request and completion validation

Create `src/infrastructure/providers/claude/probe.ts` and `tests/unit/providers/claude-probe.test.ts`.

Initial interface (superseded by Task 4's provider-local selected label/key contract):

```ts
export const CLAUDE_PROBE_PROMPT = 'Reply with CROSSCHECK_OK only.';
export async function claudeProbe(uiModel: string, signal: AbortSignal): Promise<string>;
```

- [x] First add a failing test for a split UTF-8 stream that ends without message_stop; it must reject.
- [x] Cover exact assistant/parent UUIDs, closed blocks, stop reasons, malformed data, bounded wire/text, cancellation, wrong origin, ambiguous organizations/model names, and no leaked raw errors.
- [x] Implement same-origin organization/catalog GETs and one completion POST from published protocol evidence. All URLs are constructed locally from validated UUIDs. Use `credentials: 'same-origin'`, `redirect: 'error'`, fixed headers and fixed prompt. Never copy Cookie, Origin, Referer, Sec*, or User-Agent.
- [x] Strictly parse SSE incrementally with TextDecoder; reject incomplete or unsupported protocol. Sanitize every network/protocol failure to a fixed message.
- [x] Run only focused unit tests; report red/green evidence and limits. No builds or browser manipulation in this task.

## Task 2: Explicit native-panel integration

Modify `src/application/ports.ts`, `src/application/provider-protocol.ts`, `entrypoints/bridge.ts`, `src/infrastructure/chrome/platform.ts`, `src/infrastructure/chrome/provider-client.ts`, and `src/presentation/providers/ConnectionSettings.tsx`. Add a provider-owned probe UI component only if needed to keep ConnectionSettings focused.

- [x] Add narrow probe start/poll/cancel commands to the existing exact-sidepanel sender and document/URL checks.
- [x] Reuse modelMenu to read the new tab's actual model, guard against drafts/generation, and abort on navigation/heartbeat loss/timeout. All duplicate IDs share the bridge's one-shot guard.
- [x] Add optional probe read/start ports and a small Zod-validated metadata-only session record, separate from Workspace. Store pending before any POST. Restore pending as uncertain without dispatch.
- [x] Request permission in the initiating click, create an inactive owned tab, attach without reveal, poll bounded progress, and cancel on Stop/unmount. Keep the test tab available for manual inspection on failure; do not close user-owned tabs.
- [x] Show the fixed prompt and separate test-conversation purpose under collapsed connection diagnostics. Lock other operations through onWorking; display completion or fixed failure/uncertain messages.
- [x] Add regression checks for failed intent persistence, duplicate dispatch, restore without send, and bridge sender/document guards.

## Task 3: Verification and evidence

- [x] Run focused regressions, typecheck, all unit tests, and build sequentially using a supported Node runtime.
- [x] Run synthetic browser fixtures against the built bridge with routed provider endpoints and recorded synthetic streams; verify no DOM send and no focus change. The latest built artifact passes 10 related checks.
- [x] Review the complete diff independently. Fix important findings and rerun their focused checks. Latest review reports no important findings.
- [x] Build/install the exact experimental directory; confirm the native panel and attempt the non-sensitive live probe. The fifth attempt stopped at account catalog before POST; live generation/focus acceptance is not met. Native computer control was stopped after UI work.
- [x] Record installed and live checks separately. No experiment upload, store query or submission was made.

Current baseline: 82 unit tests passed on the unchanged source with Node 24.19.0. Live safe Claude organization GET returned HTTP 200 without exposing its body. This is authentication/read evidence only. ChatGPT direct sending remains unresolved because examined public clients implement their own Sentinel proof calculation; no such code is adopted.

## First checkpoint evidence — before Task 4

- The initial integrated typecheck, 119 unit tests and build passed with Node 24.19.0. The adapter then had 31 focused tests and session orchestration had 6; this is the earlier integration evidence.
- At this checkpoint typecheck/build and all 125 unit tests passed, including the actual-null catalog case. The built artifact passed 10 related synthetic browser checks: 2 immediate/delayed model-wrapper cases, 4 probe cases, and 4 other-provider/model-menu cases. Four installed-extension tests passed before the final organization/wrapper corrections; this source distinction remains explicit.
- The earlier complete synthetic browser run passed 114 tests before the navigation-race and loading-cancellation fixes; do not claim it covers later fixes.
- Independent review identified navigation between preflight GETs and POST, plus delayed Stop during tab readiness. Both received failing regression checks and fixes. The latest complete diff was reviewed again with no important findings.
- The first native probe did not confirm completion. A read-only UI check found an effort suffix on the current model label, reproduced by a failing synthetic regression and corrected in the shared model reader, including immediate/delayed menu closure.
- The third native probe stopped during organization selection before POST. A safe GET emitted only two-organization count, UUID/array validation and a unique chat-capability result. A new two-organization regression failed before the eligibility filter was added.
- Model-name wrapper `textContent` also flattened description/icon text. Both immediate/delayed synthetic cases failed before the shared label helper was changed to the first displayed `innerText` line; both now pass.
- The fifth native attempt used the latest installed/reloaded CrossCheck 0.4.0 directory and actual side panel. It passed model and organization selection but stopped at catalog before POST. A safe same-origin GET returned HTTP 200 and an explicitly null account catalog. No raw body, account/model identifiers or credentials were logged. A usable validated account/UI/backend model pair remains absent; public-client static defaults are not a substitute.
- All task-owned probe/search tabs were closed, the browser REPL exited successfully, and a fresh process check confirmed the authorized native helper had stopped.
- No experiment package has been uploaded, submitted or published. Existing store records are historical; current status requires a fresh dashboard check.

Limits: one unique chat-capable organization, a unique account/UI model name match, fixed text only, strict supported SSE events. Thinking/tool blocks, files, follow-up turns, original-main synthesis, ChatGPT and Gemini direct generation remain unverified or unsupported by this probe. Browser-managed cookies are used without reading cookie or token values. [Verification lessons](verification-lessons.md) records the evidence and causes before the durable model-reading rule was amended in AGENTS.md.

The checked verification activities record completed attempts and their results, not a successful live-transport goal. At this checkpoint the legacy account catalog provided no usable model mapping. Task 4 replaces that dependency through observed UI/bootstrap pairing; do not use guessed IDs or claim the default review has migrated.

## Task 4: Resolve the selected model through the web app's current contract — historical

The owner requested continued work through a real response using the existing web session. A source-informed, read-only `edge-api/bootstrap` request returns `claude_ai_available_models.models[].model_id`. The actual unique enabled checked model option exposes `data-model-id`; its value has exactly one catalog match. Catalog tiers are not an entitlement check. Only the actual selected enabled UI option establishes the selection.

- [x] Reproduce the old null-organization-catalog failure with the current DOM attribute and synthetic bootstrap contract before editing production code.
- [x] In `src/infrastructure/providers/models.ts`, share a private menu reader between the existing `modelMenu` display contract and a narrow `readClaudeProbeModel(): Promise<{ label: string; modelId: string }>` reader. Require a unique enabled checked option and a validated owning `data-model-id`; never expose its request key through normal model RPC.
- [x] In `src/infrastructure/providers/claude/probe.ts`, accept that provider-local selection, validate exactly one matching bootstrap model ID, and reread the selected option after GETs. Require unchanged label/key immediately before the existing guarded sole POST. Remove reliance on the null organization model catalog; keep organization, fixed prompt, cancellation, intent and completion safeguards.
- [x] Update the bridge caller and synthetic/unit fixtures. Cover missing/malformed/duplicate keys, UI changes during GET, navigation and cancellation with zero POSTs; retain incomplete-stream rejection and fixed diagnostics.
- Historical verification continued through type/unit/build and related browser checks, but this popup-based path did not meet live response acceptance. Tasks 6/7 below supersede it.
- Its attempted live results and prior cleanup remain separate from synthetic success. No experiment upload or change to the default multi-provider workflow occurred.

Historical Task 4 evidence: typecheck/build and 129 unit tests passed; 17 related synthetic browser checks passed after bounded menu closure and provider-specific keyboard activation were added. The earlier 14-case run covered closure only. Review reproduced a detached-menu P2 where reading the selected DOM node after `finally` cleanup flattened rendered labels; values are now captured before cleanup. A second regression first returned a valid value while the menu remained open, then failed on the next read; cleanup now confirms both removed options and cleared expanded state before returning. These proven generic-menu fixes remain; Task 6 removes popup interaction from the fixed probe.

The safe read-only bootstrap GET returned HTTP 200 and 679,681 bytes, below the 1 MiB bound. It confirmed one chat-capable organization, 15 valid unique model IDs, and one exact selected UI/catalog match without printing raw responses, identifiers or credentials. Installed menu attempts still stopped before POST. Initial observations associated page Enter with menu opening; the subsequent investigation below did not support treating synthetic Enter as a native button's default click. The 17-case synthetic result does not establish live activation. Actual requests are attempted only through the installed extension's fixed probe, never by a development/manual POST.

The pinned [Claude2api declaration](https://github.com/aurora-develop/Claude2api/blob/6a9ea135f41626cd335950c97ba290f42fa7dd64/claude/models.go#L22) is an endpoint clue only. The observed actual selected UI key and size-bounded valid unique bootstrap list establish the pairing; that project's cookie/TLS approach was not adopted.

## Task 5: Activate the picker in the page environment — abandoned

The ready installed extension's model-list action also returned no options, and the fixed probe stopped at model activation before POST. A one-off bundled MAIN-world UI command was attempted under a narrow sender/document/URL boundary, then abandoned. Its production files, commands and ports have been removed; no authentication/network/global-bridge capability is retained from that attempt.

Superseding evidence: synthetic Enter dispatch does not cause native button default click. The public [event wrapper/click source](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/vendor-frame-DNQ-FS3I.js) follows Base UI conventions; it does not establish every menu implementation or the assumed Radix mechanism. A deferred MAIN-world `button.click()` opened an untouched home page's picker, but the installed isolated-click probe still failed at the menu stage without POST. Active-page reproduction means this cannot be described solely as a loading/background problem; the exact failure mechanism is not proven by these observations.

## Task 6: Read the closed control and validated current chat state

For the fixed probe only, read the closed owning button's first own displayed text node, keeping its effort label separate. Validate the unique chat entry's model in `model_selector_state` against exactly one enabled named row in `model_selector_config` in the size-bounded app_start response and exactly one ID in the valid unique available-model list. Require the config name to equal the actual UI label, then reread the UI label immediately before the existing guarded sole POST. Do not open or close the model popup; keep backend references in provider-page memory and retain all intent, document/URL, cancellation and completion guards.

Safe GET evidence: one chat state, one matching config, one selected row, UI/config name agreement, main section, no disabled reason and one available ID match. Only counts/comparisons were reported; no identifiers, credentials or raw account body were logged. The implemented path passed typecheck/build, 152 unit checks, 20 related synthetic browser cases and five installed-extension tests. The installed detached-menu case covers capture before 20 ms cleanup and unchanged foreground; its test-only copied manifest pregrants Claude, so the actual permission prompt is not covered there. Independent review reported no important findings at this checkpoint. The generic menu's primitive capture and awaited cleanup fixes remain independently useful.

At this historical checkpoint native attempt 20 reached POST, then failed response collection. A safe GET of the uniquely identified recent owned fixed-prompt conversation returned HTTP 200, two messages and the fixed assistant marker, confirming generation only. This historical check did not establish the original POST's exact conversation UUID through the product path. Attempts 21/22 isolated response binding and confirmed that both server-returned message IDs differed from the proposed IDs. No successful installed-panel result existed then; Task 7 below adds exact product-path binding and meets the fixed-request acceptance.

Current primary source links: [state/config reader](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-1-DT-Mq-A-.js), [name/disabled/default reader](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-0-Dsui6SsB.js), [separate trigger labels](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-7-B-kXHUOv.js). Stored/context/default model state may differ, so the live owning UI label remains required; these changing public assets are clues, not a compatibility promise.

## Task 7: Bind authoritative stream IDs through the exact new conversation

The public [Qv client](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-1-DT-Mq-A-.js) handles `clientUuidHonored: false` when the returned human ID differs from the proposal. The request UUIDs record intent; they cannot replace verified server identity. Keep one sole POST, accept valid distinct stream IDs provisionally and require the existing strict completion checks. Then use the public [detail GET builder](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-l-p-m-3-B9pUKnbr.js) shape to read only the exact newly generated conversation UUID.

Readback must be size bounded and confirm exactly two unique human/assistant messages, the literal fixed human prompt, the stream's ID pair and exact answer, correct parent and leaf, exact requested conversation model, no attachment/file/sync-source entries, `truncated: false` and `end_turn`. Text-only content arrays are authoritative and must match the fixed prompt/stream answer; legacy text may be empty or identical, never contradictory. Reject a mismatched explicitly supplied stream model. Return the panel answer only after that binding succeeds. Preserve page/origin/URL/cancellation checks; never request another POST or automatically resend after uncertain collection.

A safe read-only check of the owned test conversation confirmed these readback-shape comparisons inside provider-page memory without logging IDs, credentials or raw content. Task 7 is implemented and the following checks are complete:

- [x] Validate provisional server identity through exact newly generated conversation content/relationships and authoritative content arrays; preserve one sole POST and all completion/navigation/cancellation guards.
- [x] Run typecheck/build and all 190 unit checks (2026-10-12 17:33 KST), 20 related synthetic browser cases (17:34), the final full 126-case browser suite (`npm run test:e2e`, 5.6 minutes), and five installed-extension tests (17:35) sequentially on the tested build. The menu fixture's test-only pregrant does not validate the actual permission prompt.
- [x] Independently review the final production and regression source with no important findings.
- [x] Reload the exact production installation, open the actual native panel and collect `CROSSCHECK_OK` on native attempt 23. The sequence was Connections → fixed probe start → pending → completed answer; the previously selected extension-manager tab stayed active and the new owned Claude tab stayed inactive.

Acceptance scope: one non-sensitive fixed text request using the existing Claude web login/subscription, without credential reads, developer API or developer server. ChatGPT/Gemini direct generation, files, multi-turn context and original-main synthesis remain unverified. No store query/upload/submission occurred. Current task-owned Claude test tabs were closed sequentially and fresh inventory confirmed no owned/open or unknown home tabs, with unrelated tabs preserved. The original extension-manager tab remained active and the native panel still displayed the completed marker. The task-owned browser REPL exited successfully and its authorized native helper was stopped; current observations confirm no actual helper process remains.

Final formatting check: all changed files and diff whitespace passed. The repository-wide formatter still reports the unchanged baseline release/reference documents and ignored local red-test evidence; neither preserved evidence nor unrelated existing prose was rewritten.

## Task 8: Verify synthetic multi-turn context and a bound follow-up

**Goal:** Extend the explicit Claude diagnostic with a `context` kind that sends a declared synthetic two-pair transcript, collects the expected first answer, then verifies recall through one follow-up in the same newly created conversation. The existing single-request diagnostic and default review remain unchanged.

**Architecture:** Keep `kind?: 'context'` in the strict application command, platform port and persisted metadata. Fixed prompts and expected words are application-owned; account/model/conversation/message references stay in the provider page. The initial persisted context intent authorizes exactly two requests; no partial completion, automatic retry, restoration or fallback is permitted.

**Global constraints:** Existing web login/subscription only; no credential reads, extra permissions, dependencies or developer server. Use a fresh non-sensitive conversation, retain the bound home document/URL and inactive tab, and disclose exactly two requests before starting. Build/browser suites sharing output run sequentially. Unit, synthetic, installed and live results remain separate.

### Provider task

Files: `src/infrastructure/providers/claude/probe.ts`, `tests/unit/providers/claude-probe.test.ts`.

Interface: `claudeProbe(initialLabel: string, signal: AbortSignal, kind?: 'context'): Promise<string>`. Existing omitted-kind behavior keeps exactly one POST. Context mode returns `First reply: <verified answer>\nFollow-up reply: <verified answer>` within the existing 4096-character boundary.

- [x] Add failing unit checks for two bounded sends on one conversation, verified first-assistant parent, no second creation parameters, retained first pair, fresh proposed/returned IDs and expected recall. Save the red output before implementation.
- [x] Use `CLAUDE_CONTEXT_PROBE_PROMPT` only on the first request and `CLAUDE_CONTEXT_PROBE_FOLLOWUP` only on the second. The second prompt contains neither the synthetic transcript nor the expected verification word. Verify exact first answer/readback before any follow-up.
- [x] Immediately before follow-up, GET only that same conversation and require the first pair/leaf/content/relationships unchanged; reread the actual closed model label and check cancellation/document/URL. Use the confirmed assistant as `parent_message_uuid` and omit `create_conversation_params`. Never discover or append to an existing user conversation.
- [x] After the second completed stream, require exactly four unique messages, the same conversation/model, unchanged first pair, the second human linked to the first verified assistant, second assistant linked to that human and final leaf. Verify all prompts, authoritative text blocks, roles, empty attachments/files/sync sources, no truncation and normal completion. Reject reused returned IDs, extra branches, mismatched expected recall or an altered first pair.
- [x] Run the focused unit file. Cover incomplete first/second streams, first mismatch/readback changes, model/navigation change and abort between requests; failures before follow-up must retain exactly one POST. Keep original one-request regressions.

### Application, installation and UI task

Files: `src/application/claude-probe.ts`, `src/application/provider-protocol.ts`, `src/application/ports.ts`, `src/infrastructure/chrome/claude-probe.ts`, `entrypoints/bridge.ts`, `src/presentation/providers/ClaudeProbe.tsx`, `tests/unit/providers/claude-probe-session.test.ts`, `tests/fixtures/application/platform.ts`, `tests/browser/claude-probe.spec.ts`, installed extension tests and owning validation/privacy documents.

- [x] Add failing session assertions that `kind: 'context'` is persisted before tab creation and reaches the strict bridge start command; restored pending context is uncertain with no dispatch. Preserve legacy records and the original request shape.
- [x] Add application-owned fixed transcript/prompts and the optional context kind to the port, record and strict command; forward it through Chrome and bridge without accepting arbitrary prompt/URL/header options. Record the planned kind in all pending/done/uncertain writes; no answer is stored.
- [x] Add one secondary `문맥·후속 응답 시험 시작` action within the existing collapsed diagnostic. Disclose the fixed synthetic transcript and two requests. Keep its busy/stop/unmount handling and indicate completion only after both verified replies. Failure text must not imply that an earlier request was never sent.
- [x] Add synthetic browser success/failure checks through the actual compiled bridge and UI, preserving inactive focus and no repeat sends. Add an installed native-origin panel check of context-kind plumbing on the disposable provider fixture.
- [x] Run focused regressions, `npm run check`, relevant browser checks and installed suite sequentially, then independently review the connected final source. Build/reload the exact production installation and start only through the actual native panel. Confirm both replies, same-conversation verification and unchanged foreground; remove task-owned tabs and stop native control afterward.
- [x] Record actual evidence and remaining scope, including the non-atomic GET-to-POST race. This milestone does not prove arbitrary existing-main append, original conversation import, files, other providers or public release.

Protocol evidence checked on 2026-10-13: publicly loaded Claude entrypoint `index-Bzztfoks.js` identified `shared-1-DT-Mq-A-.js`; safe browser GETs with `credentials: 'omit'` returned 200 and its Qv builder copies `parent_message_uuid` directly. A 200 public `shared-0-Dsui6SsB.js` GET exposes optional `create_conversation_params`. [Pinned payload implementation](https://github.com/diegosouzapw/OmniRoute/blob/7f3cbb046b3706bf0bbc047b7eaa0cbada8d9e50/open-sse/executors/claude-web/payload.ts#L297) corroborates first-only creation and follow-up parent behavior; current live acceptance remains required. GET/readback and POST are not atomic: concurrent remote edits must be detected by final exact readback, but cannot be prevented by this experiment.

Task 8 live evidence (2026-10-13): actual reloaded production/native panel completed the first context attempt with `CROSSCHECK_CONTEXT_OK/47` and `47/CROSSCHECK_CONTEXT_OK`. The selected extension-manager tab remained active, and the new Chrome-created Claude home stayed inactive. After completion, only that owned home was selected and closed; a fresh native observation retained the manager selection and completed panel answers. The task-owned native helper was stopped and its absence confirmed. No manual request/injection or store upload/submission was performed. The independent production/spec and test-only adjustment reviews found no important issue. Initial installed-fixture routing failure is preserved as failure evidence; the corrected installed-origin case substitutes allocation to a registered synthetic tab and does not prove creation/native UI/permission grant. Those paths have separate live evidence as described above. Full synthetic regression subsequently passed all 130 cases in 3.1 minutes on the same rebuilt product source.
