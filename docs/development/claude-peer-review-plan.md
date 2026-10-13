# Claude imported-conversation peer review

## Accepted scope

Continue the existing-web-session experiment with a real rendered source transcript and selected original files. An explicit `Claude background review` action performs the existing collect and economy peer-review prompts, returns both answers in the panel, and leaves the original main conversation unchanged. This is an intermediate compatibility milestone; the default complete workflow remains unchanged.

No new dependencies, developer API, credentials, servers or permissions. Current supported originals are UTF-8 TXT and PNG; reject unsupported or invalid files before any upload/completion, never silently omit them. Keep native control off during code/test work.

**Acceptance completed on 2026-10-13:** final source passed 304 unit/type/build, 132 full synthetic browser checks and nine installed-origin fixtures. Independent whole-change re-review passed after the reconnect ownership fix. Actual production/native file attempt 1 imported three non-sensitive source pairs and both originals; collect and same-conversation review returned the context label/value, TXT token and PNG description, preserving the original source and selected tab. Owned Claude homes/research tabs and native helper were cleaned up; source/completed panel remains for inspection. Artifact identity and limitations are owned by [validation](../testing/validation.md). Main synthesis and other-provider background transport remain separate work.

## Global constraints

- Reuse `importedRun`, `promptFor`, the bounded workflow and existing original-file hash validation. Preserve the complete approved transcript and attachment manifest in both requests.
- Persist a `claude-peer` run intent and each sending job before mutations. This intent cannot enter synthesis, become a normal run on recovery, or send to the original main conversation. Legacy runs remain compatible.
- Create one new inactive extension-owned Claude home document. Bind it to an opaque local UUID belonging to this run. Never reuse an arbitrary saved Claude conversation or create a replacement after losing a bound session.
- Keep organization, actual model, server conversation/message IDs, upload receipts and verified history only in the owning provider document. No credentials through developer tools, messaging, storage, diagnostics or servers. Browser-managed same-origin cookies only.
- Match the full approved original-file metadata on every send, including a follow-up carrying no new file bytes. Upload once, await all receipts, and verify the originals in authoritative first-message readback before treating them as delivered.
- Verify exact prompt/answer pairs, roles, parents, leaves, model, unique identities, nontruncation, normal completion and attachment/file membership in the exact created conversation. Independently reread the unchanged first pair immediately before the second request. No automatic retry, fallback or duplicate send after uncertainty.
- Recheck the actual closed model label, document/URL, empty composer, draft and busy state. Abort on input, navigation, cancellation, lost panel heartbeat or timeout. Errors must contain no provider/user content.
- Main and peer inspection must not activate tabs for this intent. The initial source transcript must still match before every request.
- Unit, synthetic browser, installed-origin fixture and actual installed/native/live evidence remain separate. Build/browser suites sharing writable output run sequentially. No store publication of the experiment.

## Task 1: Provider session and original-file contract

Owner: provider implementer. Files: `src/infrastructure/providers/claude/*` and their unit tests. Root owns all integration files.

Expose `createClaudePeer(initialLabel: string)` returning an object with `send(prompt: string, files: AttachmentPayload[], approved: Attachment[], stage: 'collect' | 'review', signal: AbortSignal): Promise<string>`. Keep all state in this closure. First stage must be collect; exactly one subsequent review is allowed; failed/uncertain sessions are terminal. Use existing limits (100,000 prompt / 14,000 answer, 10 originals / 20 MiB total).

Extract/reuse the fixed probe's account/model/request/SSE/readback validation rather than copy it. Preserve all existing fixed probe behavior/tests, including its 4096-character limit and context expected markers. The bridge reads the actual initial model label before constructing the peer.

First add failing unit checks for real arbitrary transcript prompts, same-conversation review, original hash/type/UTF-8/PNG validation before mutation, TXT inline attachment, PNG awaited upload UUID, exact history membership, changed/lost file receipt, altered prior pair, abort, model change, failed upload, limits, terminal uncertainty and content-free errors. Preserve red output.

Use observed public client contracts: small TXT uses `origin: 'user_upload', kind: 'file'` with file name/type/size and extracted content; PNG multipart POST `/api/${org}/upload` returns an image receipt; completion `files` is an array of receipt UUIDs. Confirm final projection and saved-history schemas from current public source before implementing their validation; never invent fields. Reject unsupported contracts before further mutation.

Run focused provider unit tests only. Report the exact command and red/green results to `.superpowers/sdd/claude-peer-provider-report.md`. No builds, browser changes, live sends, or commits touching root-owned files.

## Task 2: Persisted intent, Chrome bridge and panel

Owner: root. Add optional `Run.kind: 'claude-peer'` and `Binding.threadId` (local UUID, Claude only). Enforce exactly source+Claude, economy mode, no Claude chair, no synthesize stage/job. Add strict dedicated bridge send command with job ID, local thread UUID, stage, exact document/home URL, prompt, selected payloads and complete approved metadata. Ordinary send must reject a thread binding; peer send must reject missing/lost/mismatched session.

Extend existing platform peer preparation and send ports with optional thread intent and full approved manifest. Use the existing attachment target receipt with the thread UUID included in equality. Create the inactive peer once and retain it across collect/review; the bridge owns the provider closure. Reuse existing polling/cancel shape, exact-sidepanel sender guard, one-shot ID guard and pending-job heartbeat without enabling DOM submission or fallback for a peer request.

Add an explicit action under existing collapsed settings. Disclose two Claude requests, current rendered transcript, selected originals, TXT/PNG support and that the main conversation receives no new request. Show two-stage progress and a Claude review result; recovery must remain in this intent. Do not label it final synthesis. Preserve the existing default action.

First add focused regressions for persisted intent/recovery, no activation/main mutation, changed source before follow-up, strict command schema, cross-thread receipt mismatch and loss without allocation. Then typecheck, unit and build.

## Task 3: Independent review and installed acceptance

Review connected production source independently. Run synthetic provider/bridge/panel fixtures and installed-origin fixtures sequentially, disclosing any allocation/permission substitutions. Then reload the exact production directory, confirm installation and native panel, create a new non-sensitive source conversation and import its actual rendered turns. Test text-only first, then original TXT+PNG selected through the panel. Require collected Claude answer and same-conversation review, unchanged main transcript and foreground tab, original content recognition and no repeated upload.

Record actual outcomes and blockers in owning validation/handoff documents. Clean up only owned browser tabs and the authorized native helper. The GET-to-POST history check is not atomic; final readback detects a concurrent remote edit but cannot undo a request already accepted. Full main synthesis and other-provider background transports remain outside this milestone.
