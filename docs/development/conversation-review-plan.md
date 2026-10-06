# Multi-turn conversation review

## Objective

Load the completed question/answer turns from the selected provider conversation, share the selected context and original files with chosen peer AIs, collect their reviews, and request the final response in the original bound conversation with one start action. Keep the native side panel concise and intuitive.

## Global constraints

- Preserve exact main tab/document/conversation binding, persisted send intent, no ambiguous retries, and no overwriting drafts.
- Original attachments are selected once in memory and confirmed ready at each destination; never silently downgrade to text only.
- Capture ordered question/answer pairs, not independently counted messages. Reject ambiguous, incomplete, oversized, or detectably partial transcripts. Never claim unloaded history was read.
- The UI must state the loaded scope and actual pair count and allow every shared question and answer to be inspected.
- Changes in an earlier captured turn must invalidate the pinned source before sending. The final synthesis stays in the original main conversation.
- Use existing domain/application/provider/presentation boundaries, test infrastructure, and dependencies.
- Keep one-start bounded execution and native browser-managed extension updates.
- Build and browser suites share output and must run sequentially. Root owns logged-in browser/native installation; subagents must not manipulate it.

## Task 1: Implement multi-turn context and concise UI

Read AGENTS.md, README.md, local handoff, architecture/security/validation docs and trace all relevant callers before editing. Establish failing regression checks first.

Extend the existing crosscheck model and provider snapshot with ordered completed turns. Preserve stored-run compatibility without silently accepting a fresh snapshot that lacks conversation context. Capture rendered provider conversation messages in visual order, pair strictly, and reject ambiguous or partial sequences. Use existing provider DOM helpers, no private APIs or credentials. Bounded context must be validated without clipping. Clearly expose the loaded scope; if the provider has detectable unloaded/virtualized history, block import and provide an actionable message rather than forwarding only the latest answer.

Include the earlier conversation in peer collection, review, and synthesis JSON while reusing the main model's last answer. Keep the latest question as the direct review target. Preserve context in exports. Recheck the entire captured transcript before start (not only the last pair). Add focused tests for multiple turns, preceding-turn changes, incomplete/ambiguous sequences, bounds, and legacy saved runs. Preserve existing draft, send intent, attachment, and exact-main safeguards.

Simplify the work UI: title `대화 검토`; source `ChatGPT · 원래 대화` (actual provider), honest loaded pair count, expandable complete transcript, original-conversation action and current-tab replacement. Show peer AI checkboxes before start, lock main participation. Keep mode/max requests and connection/model options under settings. Compact originals controls: custom `파일 선택` / `파일 다시 선택` trigger with selected names; confirmation copy depends on whether files are selected. Avoid a visible reset native input claiming no files next to selected files. Use `전송·답변 확인 중` for pending sends and uploads. Name the original main provider in sharing copy; place original-conversation button and excluded-provider warning above the final answer. Ensure 320px usability and accessible controls. Use the existing style system.

Do not modify cloud/release settings, package version, or claim live validation. Root will handle actual installation and live testing. Run focused unit/typing tests, and coordinate with root before building or running browser tests. Commit only owned feature/test files. Write a report with scope, checks, remaining limitations, and commit IDs to `.superpowers/sdd/conversation-task-report.md`.

## Task 2: Independent review and actual installed testing

Review the implementation against all global constraints, fix concrete findings, then run required type/unit/build, synthetic browser, and installed extension suites sequentially. Verify the actual browser extension name/ID/version/path, install or reload this project only, refresh provider tabs, and use fresh non-sensitive multi-turn conversations plus the existing original file/image fixtures. Verify from the native side panel through peer responses and final response in the original main conversation. Release native computer control whenever returning to code/tests. Record evidence separately; fix actual failures with regression checks. Update owning development/validation/release docs and only durable proven AGENTS rules. Release an updated draft only after the package matches tested source; do not claim review submission or publication without store confirmation.
