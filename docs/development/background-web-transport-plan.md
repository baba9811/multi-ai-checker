# Claude page-local transport probe implementation plan

> For agentic workers: use subagent-driven-development for the isolated provider adapter and review; root owns the sequential integration and browser validation.

**Goal:** Verify one explicit, fixed, non-sensitive Claude text request without moving the user's foreground tab.

**Architecture:** The existing isolated bridge performs same-origin requests using browser-managed cookies. Account references stay in that page; a separate metadata-only session record remembers the one-shot attempt. The default multi-provider workflow is unchanged pending full compatibility evidence.

**Tech stack:** Existing TypeScript, Zod, WXT, Vitest, Playwright; no new dependencies or permissions.

## Global constraints

- Preserve the original workflow, attachments, bound-main protections, and browser-managed updates.
- No credentials through development tools, RPC, storage, logs, or developer servers.
- No arbitrary URL/header/prompt proxy, challenge solver, automatic retry, or fallback send.
- One inactive extension-owned Claude home tab; real document/URL validation; no fabricated workflow binding.
- Read the actual UI model and match its name uniquely to the authenticated account's backend model metadata. Missing/ambiguous metadata prevents POST.
- Require one unique chat-capable organization; exclude API-only organizations and never choose the first or infer a plan.
- Persist intent before the mutating request; closing/reloading the panel makes unfinished results uncertain and never resumes them.
- Require corresponding assistant UUID, closed text blocks, end_turn, and message_stop; EOF/HTTP success alone is insufficient.
- Evidence categories remain separate. Never equate synthetic fixtures with live success.

## Task 1: Provider-owned request and completion validation

Create `src/infrastructure/providers/claude/probe.ts` and `tests/unit/providers/claude-probe.test.ts`.

Interface:
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

## Final checkpoint evidence

- The initial integrated typecheck, 119 unit tests and build passed with Node 24.19.0. The adapter then had 31 focused tests and session orchestration had 6; this is the earlier integration evidence.
- The latest typecheck/build and all 125 unit tests pass, including the actual-null catalog case. The latest built artifact passes 10 related synthetic browser checks: 2 immediate/delayed model-wrapper cases, 4 probe cases, and 4 other-provider/model-menu cases. Four installed-extension tests passed before the final organization/wrapper corrections; this source distinction remains explicit.
- The earlier complete synthetic browser run passed 114 tests before the navigation-race and loading-cancellation fixes; do not claim it covers later fixes.
- Independent review identified navigation between preflight GETs and POST, plus delayed Stop during tab readiness. Both received failing regression checks and fixes. The latest complete diff was reviewed again with no important findings.
- The first native probe did not confirm completion. A read-only UI check found an effort suffix on the current model label, reproduced by a failing synthetic regression and corrected in the shared model reader, including immediate/delayed menu closure.
- The third native probe stopped during organization selection before POST. A safe GET emitted only two-organization count, UUID/array validation and a unique chat-capability result. A new two-organization regression failed before the eligibility filter was added.
- Model-name wrapper `textContent` also flattened description/icon text. Both immediate/delayed synthetic cases failed before the shared label helper was changed to the first displayed `innerText` line; both now pass.
- The fifth native attempt used the latest installed/reloaded CrossCheck 0.4.0 directory and actual side panel. It passed model and organization selection but stopped at catalog before POST. A safe same-origin GET returned HTTP 200 and an explicitly null account catalog. No raw body, account/model identifiers or credentials were logged. A usable validated account/UI/backend model pair remains absent; public-client static defaults are not a substitute.
- All task-owned probe/search tabs were closed, the browser REPL exited successfully, and a fresh process check confirmed the authorized native helper had stopped.
- No experiment package has been uploaded, submitted or published. Existing store records are historical; current status requires a fresh dashboard check.

Limits: one unique chat-capable organization, a unique account/UI model name match, fixed text only, strict supported SSE events. Thinking/tool blocks, files, follow-up turns, original-main synthesis, ChatGPT and Gemini direct generation remain unverified or unsupported by this probe. Browser-managed cookies are used without reading cookie or token values. [Verification lessons](verification-lessons.md) records the evidence and causes before the durable model-reading rule was amended in AGENTS.md.

The checked verification activities record completed attempts and their results, not a successful live-transport goal. The live-generation goal remains unmet because the authenticated account returns no usable catalog; do not replace this explicit blocker with guessed model IDs or claim the default review has migrated.
