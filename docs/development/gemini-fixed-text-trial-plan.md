# Gemini Cold-Native Fixed-Text Trial — Conditional Plan

> **For agentic workers:** Use `subagent-driven-development` or `executing-plans` to execute the approved scope task by task. Checkboxes describe future work; this document does not authorize skipping its prerequisite gates.

**Goal:** Collect the exact reply `CROSSCHECK_GEMINI_OK` to one non-sensitive fixed request, using the current account's normal protected web client in a new inactive Gemini home and displaying the verified answer in the installed native side panel.

**Architecture:** Preserve the actual selected conversation service's builder, processors, protection and store effects. Gate the final packet and one normal cold native-SSE subscription, capture its connection before dispatch, and require processed/store ownership plus explicit raw saved-history completion. Chrome owns intent and document binding; provider references, model keys and authentication remain in their provider page.

**Tech Stack:** Existing TypeScript, WXT, Chrome MV3, React, Zod, Vitest and Playwright. No dependency or permission addition.

## Global constraints and present gate

- Existing web login/subscription only. No API key, server, database, copied cookie/token, protection reconstruction, transport forcing, manager clearing or automatic generation retry.
- Fixed prompt: `Reply with CROSSCHECK_GEMINI_OK only.` Exact expected answer: `CROSSCHECK_GEMINI_OK`. Reject whitespace, markup, extra text or another answer rather than normalizing it into success.
- One new extension-owned inactive home, one explicit start, one normal request. No files, imported/private conversation, follow-up turn, existing main delivery or workflow migration.
- Session storage contains only the local intent ID and `pending`/`done`/`uncertain`. Answer stays in the open panel; server identifiers, private mode key, packet and control capability are not stored or logged.
- This is a **static, conditional cold-native plan**. The latest installed result is `unsupported/transport-rpc`: the current account selects the initial framework stream branch, which this plan does not cover. No candidate or generation success is claimed. Preserve this proposal for a naturally supported cold-native page; do not force a flag or apply it to the current framework branch. That branch needs a separate reviewed dispatch/lifetime design. A previous diagnostic success cannot authorize a different document.
- During implementation, an unresolved contract is a no-go for the dependent step. Do not weaken a guard, invent an export, choose an ancestor/service, force a flag or add an alternative send route to proceed.

The [owning research](../research/background-web-transport.md#next-gate-fixed-text-protected-trial-plan-only) records source facts and provenance limits. The cached core generation profile is `module-001.js`, SHA-256 `1ab342b63369a132c0e69f9145f841d099056413ebcacf268b9573609af7dc5a`; offsets are zero-based. The loaded build must be compared before relying on these changing names/fields.

## Design decision

Use the real `lN.sendRequest` pipeline and a scoped final gate. A direct `fVd → h5a → Oub` implementation would need the private processor registry and duplicate normal effects. A direct legacy request cannot establish the bounded dispatch contract because of fallback/reconnect and SDK refresh behavior. Both alternatives are outside this plan.

The trial's authoritative model receipt is captured **inside the same MAIN request closure**, by compiling and reusing `geminiReadiness`/`readGeminiMode`. Retain its exact label/key there, reread before send, compare it to that owning `sV.I7` and final `request.Hi`, and recheck before the first callback delegation. Do not pass an ISOLATED private key through Chrome arguments/RPC or accept page-event model confirmations. Task 12 is a prerequisite diagnostic; its separate receipt is not this new trial's request receipt. If a separate ISOLATED receipt must become authoritative, stop until its exact pre-dispatch equality has an independently reviewed mechanism.

## Exact read and change scope

Read `AGENTS.md`, `README.md`, `docs/development/local-handoff.md`, architecture, privacy and validation documents first. Trace all callers in these files before editing:

- Application: `src/application/ports.ts`, `provider-protocol.ts`, `gemini-readiness.ts`, `claude-probe.ts`.
- Chrome: `src/infrastructure/chrome/provider-client.ts`, `gemini-readiness.ts`, `claude-probe.ts`, `platform.ts`.
- Provider: `src/infrastructure/providers/models.ts`, `dom.ts`, `gemini/readiness.ts`, `gemini/client-capability.ts`.
- Lifecycle/UI: `entrypoints/bridge.ts`, `entrypoints/background.ts`, `src/presentation/providers/ConnectionSettings.tsx`, `GeminiReadiness.tsx`, `ClaudeProbe.tsx`.
- Tests: existing Gemini readiness unit/session/browser/installed tests, `tests/fixtures/application/platform.ts`, `tests/fixtures/providers/gemini-readiness.ts`, `tests/unit/architecture/boundaries.test.ts`.

Create only these focused implementation units when the opening gate passes:

| File                                                         | Responsibility                                                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `src/application/gemini-fixed-text-trial.ts`                 | Fixed prompt/expected answer and strict public record/progress/reason schemas.                         |
| `src/infrastructure/providers/gemini/owned-client.ts`        | Extract the current exact owner/consumer resolver once; references never leave provider code.          |
| `src/infrastructure/providers/gemini/fixed-text-contract.ts` | Pure final-packet and raw-history validation against the fixed trial.                                  |
| `src/infrastructure/providers/gemini/fixed-text-trial.ts`    | Persistent MAIN closure, fixed lease/stop, normal pipeline, guarded subscription, store/readback.      |
| `entrypoints/gemini-fixed-text-trial.ts`                     | Local unlisted MAIN bundle; its execution is the only initiation path.                                 |
| `entrypoints/gemini-client-capability.ts`                    | Bundled metadata projection sharing the extracted resolver, preserving Task 12's strict result.        |
| `src/infrastructure/chrome/gemini-fixed-text-trial.ts`       | Persist-before-start, owned allocation, exact native document, capability polling/stop and retirement. |
| `src/presentation/providers/GeminiFixedTextTrial.tsx`        | One folded fixed-text test action, stop/status and verified answer through injected Platform.          |

The resolver extraction requires updating `gemini/client-capability.ts` and its Chrome invocation/tests from function serialization to the local metadata bundle. Do not copy its ownership checks into the trial. Reuse `prepareGeminiReadiness`, `inspect`, the Platform pattern and public ID/status semantics; keep a separate trial storage key so metadata confirmation cannot appear as a successful response. Add the two trial Platform methods, fixed bridge reservation/cancellation cases, fixture implementation and ConnectionSettings mount. No manifest/CSP/update/release workflow change.

## Chunk 1: pure request/history contract and shared ownership

**Interfaces:** `resolveGeminiOwnedClient()` supplies the already instantiated exact consumer/service/API references to provider callers; public projection still returns only candidate/unsupported. The following schemas/contracts are fixed; private `approved`/`completed` never cross the provider boundary:

```ts
type GeminiFixedTextTrialRecord = {
  id: string;
  status: 'pending' | 'done' | 'uncertain';
};
type GeminiFixedTextTrialResult = {
  model: string;
  answer: 'CROSSCHECK_GEMINI_OK';
};
type GeminiFixedTextTrialReason =
  | 'page'
  | 'model'
  | 'client'
  | 'packet'
  | 'capture'
  | 'dispatch'
  | 'response'
  | 'history'
  | 'cleanup'
  | 'interrupted';
type GeminiFixedTextTrialProgress =
  | { status: 'pending' }
  | { status: 'done'; result: GeminiFixedTextTrialResult }
  | { status: 'error'; reason: GeminiFixedTextTrialReason };
type ApprovedGeminiTrial = {
  storeId: string;
  clientTurnId: string;
  modeId: string;
  model: string;
};
type CompletedGeminiTrial = {
  conversationId: string;
  turnId: string;
  candidateId: string;
  answer: 'CROSSCHECK_GEMINI_OK';
};
// Return the original value; do not construct a packet to pass the check.
declare function assertGeminiTrialPacket(packet: unknown, approved: ApprovedGeminiTrial): unknown;
declare function assertGeminiTrialHistory(
  raw: unknown,
  approved: ApprovedGeminiTrial,
  completed: CompletedGeminiTrial,
): 'CROSSCHECK_GEMINI_OK';
```

- [ ] Compare the current public generation code with the listed source boundaries. Verify `sV.Oa → lN.ha → HL.Ja/wb/Fb`, effects' same API resolution and natural cold eligibility. Missing or changed normal contracts stop this chunk before implementation.
- [ ] Source-prove the normal new-home route/store transition. Existing `inspect(binding)` rejects any changed URL, so it is suitable for initial binding but cannot be casually reused across a normal home-to-conversation navigation. Require an exact in-page transition tied to the matched client/store/server CID, projecting only fixed ownership status; preserve native document/bridge UUID separately. If that transition cannot be distinguished from user navigation, stop instead of accepting an arbitrary same-origin URL.
- [ ] Define strict public schemas: record `{id,status}`, result `{model,answer}` with exact expected answer, progress `pending`/`done`/`error` with only a fixed reason and optional done result. No raw packet, model key, CID/RID/RCID, control key or private source in schemas. Schema tests reject each extra field.
- [ ] Add failing pure tests before extraction/validators. Preserve existing owner/container/transplanted-template/accessor/cycle rejections; prove the metadata bundle executes with its real imports and still projects no references.
- [ ] Validate the final postprocessor request: exact fixed text/client ID/effective mode and captured active store `Ae`, empty initial CID/parents/history/version, `Rg=false`, `wh=false`, `Qo=0`, `Ug=0`, ordinary supported request source, and no upload/tool/page/project/task/continuation/system/import/special mode context. Derive allowed locale/catalog/thinking/personal-context fields from `fVd` (2079786) and processors (2064967), not a broad allowlist. Defined unknown context, getters or unsupported variants fail before any transport call. Leave the original packet unchanged.
- [ ] Require effective enabled `pL` and the genuine normal nonempty `A5a/B5a` packet at `Oub`; reject `EGd`'s undefined fallback. Presence is not independent cryptographic verification; normal provider validation remains intact.
- [ ] Mirror raw `Xcb` read-only construction: exported `uEd`, `Hy(wEd)`, `Cud/Dud`, normal `api.oa.fetch`, owned CID, size at least two, empty token, actual request source/capabilities and normal optional bits (`Xcb` 2001148; setters 1999183–1999466). No shared fetch wrapper or handwritten authenticated request.
- [ ] Implement only the source-proved JSPB representation: validate own arrays/data descriptors, bounded sparse tail and field presence before typed access. `SZc` is private lexical (1529221), so read candidate field 9's explicitly present status field 1 via the supported raw representation; never invent `runtime.SZc`. Reject ambiguous dense/sparse duplication, getters, malformed flags/types, oversized structures and unsupported representations.
- [ ] Require exactly one saved turn/no pagination, stream/store CID/RID, exact prompt/empty original parents/mode, explicitly present selected RCID matching one candidate, explicit final true/non-stopped, explicit completion enum 2, and exact text-only reply. Reject missing/unmatched selection, default final/completion, partial/EOF-only/error/rich/media output. `RZc`/`wXc` defaults (1441600–1445305) cannot establish completion.
- [ ] Run `npx vitest run tests/unit/providers/gemini-fixed-text-contract.test.ts tests/unit/providers/gemini-client-capability.test.ts tests/unit/architecture/boundaries.test.ts`. Record the meaningful RED rejection/delegation failure, then require all focused checks green. Independent review must approve no-private-output and fail-before-dispatch evidence before Chunk 2.

Representative acceptance matrix, with synthetic data only:

| Mutation                                                               | Required observable effect                                              |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Same visible label, different mode key/`Hi`; changed text or client ID | Original `Oub`/`Rzc` spy has zero calls.                                |
| Undefined/empty protection; selected upload/context; accessor          | Zero transport calls; fixed failure only; input object unchanged.       |
| Missing RCID/final/status or extra saved turn/page token               | No done result despite nonempty/defaulted parsed text.                  |
| Dense/sparse conflict, getter, unsupported rich candidate              | No getter invocation, no projected private value or normalized success. |

## Chunk 2: one MAIN operation, fixed lifetime control and normal request

**Interfaces:** The unlisted bundle returns an infrastructure-only strict `{capability}` bootstrap, a fresh 256-bit value generated by this extension code in MAIN and returned only in the trusted ScriptResult. An own fixed registry exposes only `lease(capability)` returning strict public progress and `stop(capability)`; neither accepts a prompt, URL, mode, callable or send command. The secret remains in the closure and transient Chrome memory, never session storage, DOM/events, diagnostics or logs. It is unrelated to provider authentication.

- [ ] Add synthetic failures for missing/duplicate factory capture, wrong receiver/lifetime, duplicate observable subscription, synchronous reentry, cancellation before/after attestation, refused second dispatch after error, and incomplete teardown. Assert original callbacks are never delegated on invalid paths.
- [ ] Prove the actual compiled bootstrap/Promise result with pinned WXT's unlisted-script path; do not serialize a function with missing imported helpers. Reuse the existing model reader inside this MAIN bundle and keep its exact receipt private. Reject preexisting registry/another trial before provider methods run.
- [ ] Bootstrap installs one dormant operation; no model mutation/protection/request runs before the first valid trusted lease. The local bundle execution arms only the compiled fixed trial once. A wrong/missing/duplicate bootstrap or capability expires without generation; lease cannot create another operation, change inputs or revive a cancelled one.
- [ ] Install the minimal fixed lease/stop registry with own data descriptors and a closure-private capability. Compare the global registry object/method descriptors with the locally owned originals before model mutation, final `Oub`, every subscription and every `Rzc` delegation. Invalid capability must not renew a lease or return an answer. Page stop events may only invalidate; no positive permission/model confirmation comes from them.
- [ ] Use a 15-second lease and an independent `LIMITS.timeoutMs` absolute deadline. Trusted Chrome polling supplies the capability to the exact native document and renews only this trial; closure expiry closes future effects first, then tears down the real inner subscription/connection. A normal builder subscription alone is insufficient. Compare-before-delete/restore and a local watchdog retain fail-closed protection after panel/bridge loss.
- [ ] Document and test capability exposure/tamper limits: observed registry replacement is failure; wrong/stale keys cannot authorize work; do not claim the provider runtime or all lookalike replacements are authenticated. If bootstrap, capability ownership, lost-panel/replacement shutdown or safe cleanup cannot be proven on the receiving context, generation remains no-go. Do not replace this gate with a forgeable page lease.
- [ ] Bind the one `Oub` gate to the exact approved packet/API. Preserve the original observable/events. Its one-subscription wrapper arms `QHd` only during that subscription's synchronous execution, with exact `api.wb/api.Ia` and reentry checks (`Oub` 1907678; `AJd` 1897432). Restore only a still-owned factory descriptor after capture.
- [ ] Capture exactly that factory's new `zHd.connection`, install an own `Rzc` allowance before `AJd` connects, and charge before original delegation (`QHd` 1880569; `GHd` 1879109; `EHd/FHd` 1877029/1878613). Preserve normal args/body/auth without inspecting or exporting them. A second call invalidates the result, never refunds/retries. No manager, legacy or fallback route.
- [ ] Retain actual inner teardown until quiescence or owned-page retirement. Cold teardown uses normal `AL`/disconnect; server cancellation is not established. Missed capture or exceptions are uncertain, not proof of never sent.
- [ ] Capture empty `Oa.Qe` and active `Oa.oa` before sending; bind the final request `Ae` and processed result to that exact store. Subscribe to the exact processed `Oa.Qe`/matched store result without creating another generation. Require consistent owned CID/RID/RCID, final text and normal stream completion; ignore title/quota/routing as answers, reject disconnect/continuation/errors. Read same-CID history at most three times, separated by 500 ms, within the overall deadline; never generate again. Both store and raw readback must agree with the exact expected answer before done.
- [ ] Review the pure/serialized lifecycle evidence before connecting a UI action. Keep the tested gates until termination; do not restore on first text, callback return, panel closure or a settled builder promise.
- [ ] Run `npx vitest run tests/unit/providers/gemini-fixed-text-trial.test.ts tests/unit/providers/gemini-fixed-text-contract.test.ts`; invalid subscription/cancellation cases must retain zero forbidden callback calls, not merely reject a promise. Approve the reviewed local checkpoint before Chunk 3.

The counter proves at most one application `Rzc`/fetch delegation. It does not prove one browser HTTP hop, server execution or quota charge; ordinary redirects and server processing remain outside the claim.

## Chunk 3: Chrome binding, intent/controller and concise panel

**Public ports:** `readGeminiFixedTextTrial(): Promise<GeminiFixedTextTrialRecord | undefined>` and `startGeminiFixedTextTrial(signal: AbortSignal): Promise<GeminiFixedTextTrialResult>`. No caller can supply text/model/URL or ask for another request.

- [ ] Add failing Chrome/session tests for denied permission, failed intent persistence, wrong/duplicate frame/native document, changed bridge UUID, same-label key change in MAIN, missing bootstrap capability, stale registry, cancellation and restored pending state. Every invalid case must avoid done/answer and automatic restart.
- [ ] Request the existing origin in the initiating gesture, persist pending, allocate the owned inactive home with `prepareGeminiReadiness`, inspect its original binding and obtain/validate one top-frame native document ID. Reserve this trial in the existing bridge mutation lock; all ordinary send/model/metadata callers must reject competition. Reservation does not carry a prompt/private key or start MAIN work.
- [ ] Execute only the bundled trial on that exact native document. Strictly validate its one bootstrap result before supplying the first lease. Poll the fixed capability lease through trusted same-document scripting while retaining the original bridge UUID separately; never let a page event report done or supply the answer. Recheck ownership/abort after each await. Use the source-proved private ownership check for an expected normal route transition; an unrelated URL/store/document invalidates the operation.
- [ ] Bind cancellation to the exact native document using the transient capability; also stop the bridge reservation. If acknowledgement/quiescence fails, retire only this newly allocated owned tab and preserve uncertain intent. Do not allocate a substitute, resume after panel reload, or close unrelated tabs. A valid completed trial may release reservation after verified cleanup; retirement is required when safety is uncertain.
- [ ] Record done only after strict verified result and final binding/cleanup acknowledgement. Catch persists uncertain; pending restore returns uncertain; capability/answer/server IDs never enter storage. Logs expose only fixed status/stage. Existing readiness status remains independent.
- [ ] Add one folded “Gemini 응답 시험” component in Connections showing the fixed sentence, current-model scope, one start button, stop and verified reply. Use the injected Platform and existing `onWorking`/controller pattern. State uncertainty plainly without “요청하지 않았습니다” after an ambiguous attempt. Unmount aborts; no settings/model selector/new general workflow.
- [ ] Update both Platform implementations, ConnectionSettings mount, protocol/bridge callers and affected unit/UI fixtures. Update architecture/privacy descriptions for the concrete fixed MAIN control handle before a live trial; do not retain their old no-global/metadata-only claims for this new path. Test duplicate clicks, disabled mutation controls, neutral stop, answer clearing, pending reload and an unsupported natural route with zero generation.
- [ ] Run `npx vitest run tests/unit/providers/gemini-fixed-text-trial-session.test.ts`, then build and run `npx playwright test tests/browser/gemini-fixed-text-trial.spec.ts` sequentially. Require strict storage/output projection and no automatic restart in both suites before Chunk 4.

## Chunk 4: evidence in separate environments

- [ ] Focused RED/GREEN checks: new `tests/unit/providers/gemini-fixed-text-contract.test.ts`, `gemini-fixed-text-trial.test.ts`, `gemini-fixed-text-trial-session.test.ts`, plus existing metadata/session/architecture tests. At least one fixture invokes the actual compiled MAIN bundle, not a test-only manual injection substitute.
- [ ] Synthetic browser: new `tests/browser/gemini-fixed-text-trial.spec.ts` and `tests/fixtures/providers/gemini-fixed-text-trial.ts`; exercise actual UI, model cleanup, delayed effects, broken lease, tampered packet, callback refusal and strict readback. Use invented public-safe input; assert no auth/private values in projected messages/storage.
- [ ] Run validation sequentially using pinned dependencies: `npm run check`; `npx playwright test`; `npx playwright test --config playwright.extension.config.ts`. Preserve failure logs before reruns. Add installed cases to `tests/extension/workspace.spec.ts`, covering actual MAIN bundle/bootstrap, isolated reservation, native document, permissions and UI result. Label any permission pregrant/allocation shim/regular-tab panel substitution.
- [ ] Inspect exact built manifest/bundles and unchanged permissions/CSP, reload only the project installation, confirm ID/version/path, and refresh only owned provider injection. Use the real native side panel. Check the current account's natural prerequisite on the exact new test page immediately before the one authorized send; unsupported remains no-go.
- [ ] Collect the exact verified reply through the installed production path. Verify foreground/original conversation preserved, no attachments, no extra request/retry, strict completion/readback and safe owned cleanup. Release the actual native computer helper when leaving UI work.
- [ ] Record unit, synthetic browser, installed fixture and logged-in native results independently, tied to the tested artifact. Update owning handoff/validation/privacy/architecture/research documentation; amend AGENTS only for a proven durable lesson. A native failure does not license retrying an uncertain generation. No store upload/publication is part of this trial.

## Execution gates and remaining limits

Chunk 1 depends on actual natural-route preflight and current public-source review. Chunk 2 depends on approved pure guards and proved receiving-context capability/cancellation behavior. Chunk 3 depends on no-invalid-delegation and cleanup review. A logged-in send depends on all preceding fixtures and exact installed readiness; an unknown cannot become a checkbox checked by assumption.

This plan proves no current candidate, response, account entitlement, absence of transparent proxies, complete runtime authenticity or server cancellation. Those limits stay visible in the final validation record. The implementation may stop honestly at an unsupported account route while this conditional design is preserved for a supported normal route.
