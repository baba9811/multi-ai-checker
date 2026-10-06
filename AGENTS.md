# Repository working rules

## Start with evidence

- Read `README.md`, `docs/development/local-handoff.md`, and the relevant architecture, security, and validation documents before continuing work. Check the branch, worktree, and local changes; preserve existing work.
- Treat handoff notes and prior test results as historical evidence. Verify the current code, environment, installed extension, and browser state before relying on them.
- Trace a reported failure from the UI through the application, Chrome messaging, and provider adapter. Inspect all callers of a shared function before changing it.
- Reproduce the failure and identify its cause before editing. Add the smallest regression check that would fail without the fix. Reuse existing code and test infrastructure; avoid speculative abstractions or dependencies.

## Preserve the product contract

- Keep the existing one-start, bounded review workflow unless the user requests a change. Preserve the full approved sharing scope through every stage, reuse the main answer, and send the final synthesis only to the original bound conversation.
- Keep provider DOM behavior in provider adapters, Chrome APIs in infrastructure, orchestration in application, and business rules in domains. Presentation uses the injected platform port.
- Fail closed on ambiguous editors, changed captured context, existing drafts, incomplete answers, or uncertain sends. Validate completeness against the messages actually captured; hidden or omitted messages must not make a partial transcript appear complete. Never overwrite a draft or automatically retry a request that may already have been sent.
- Persist send intent before sending. Interrupted work must not silently resume after panel closure, reload, extension replacement, or browser restart. Distinguish uncertain attempts from work that never began so cancellation preserves safe explicit continuation.
- Read model choices from the actual account's UI. Do not invent available models, subscription entitlements, quotas, search execution, or source verification.
- Model agreement is not factual verification. Preserve uncertainty and distinguish verified sources from model claims.

## Domain ownership and dependency direction

- Organize code, data, tests, and documentation by the domain that owns them. Keep each artifact in its appropriate kind of directory within that ownership scheme; do not mix implementation, datasets, generated output, and prose into an undifferentiated folder.
- Choose placement by responsibility and source of truth, not by whichever caller currently uses the artifact. Keep domain-specific models, fixtures, schemas, and explanations with their owning domain. Shared material must have a real cross-domain purpose and an explicit owner.
- Keep production data, synthetic test data, generated artifacts, and private user material distinct. Never use a fixture or a copied document as an undeclared production dependency.
- Maintain an acyclic, one-way dependency graph. Domain rules must not depend on presentation, orchestration, infrastructure, browser APIs, or framework details. Application behavior depends on domain contracts; outer adapters implement inward-facing ports.
- Cross-domain access must use a deliberate public contract in the permitted direction. Do not reach into another domain's internal files or create reciprocal imports. If two domains need each other, reconsider ownership or coordinate them from a higher layer instead of introducing a cycle.
- Avoid generic shared folders as a shortcut around boundaries. Move code to a shared location only when its responsibility is truly shared; keep unrelated domain concerns separate.
- Preserve these boundaries in documentation and data references as well as code. Link to the owning source instead of copying definitions into multiple domains. Check architecture tests or equivalent import checks when changing boundaries.
- Describe architectural invariants here, not the current directory tree. Keep concrete file maps and evolving dependency diagrams in architecture documentation and verify them against the repository when needed.

## Browser and installation discipline

- Use the browser skill and supported browser tools. Inspect the available tabs and profiles first; do not assume an automation session shares the user's active tab or login profile.
- Target the exact extension by name, ID, version, and installation path. Remove or reload only this project's installation; leave unrelated extensions and tabs alone.
- Keep installation steps sequential: build, select the directory containing `manifest.json`, confirm the installed version, open the production panel, and refresh provider tabs when replacing injected code.
- For native file pickers, verify each state transition: picker opened, path field opened, path resolved, intended directory selected, installation accepted. Do not chain dependent keystrokes across unobserved dialogs.
- Treat UI actions as attempts until a fresh observation confirms the result. Reacquire element references after state changes. If accessibility text and visible state disagree, inspect a screenshot and a fresh snapshot before repeating an action.
- Prefer DOM tools for web content and native UI tools only for browser chrome or native dialogs. Avoid competing controllers manipulating the same surface. Serialize operations that require the same foreground surface, and verify readiness after activation.
- Keep native computer control active only while it is needed for a UI action. Release the control session when returning to code or tests; do not leave unnecessary capture or control running in the background.
- Forward attachments only after the user selects the original files and each destination confirms upload readiness. Never silently omit a file, infer binary content from a thumbnail, or persist raw attachment bytes in workspace history. After losing in-memory files, require matching originals before resuming.
- Use a new, non-sensitive test conversation for live sends. Verify the installed production path through final answer collection; manual DOM injection or a panel in a regular tab is not proof that the native side panel works.

## Verification discipline

- Separate four kinds of evidence: unit tests, synthetic browser fixtures, installed-extension tests, and live logged-in service tests. Report each independently; success in one does not establish success in another.
- Run build and browser suites sequentially when they share `.output`, test results, reports, browser profiles, or installation state. Parallel execution requires disjoint writable paths and independent state first.
- Use the repository's pinned dependencies and Playwright-managed browser by default. An explicit browser override must exist on the current host; never assume a Linux executable path on another OS.
- Preserve failure logs before rerunning a suite that cleans its output. Inspect the first meaningful failure and determine whether it occurred during setup, an assertion, or teardown.
- For timeouts or missing artifacts, check process contention, overlapping runs, output cleanup, and browser availability before changing product logic or increasing time limits. Do not kill unrelated user processes.
- After a fix, run the relevant regression check, then the required validation commands. Repeat broader checks only when new changes, failures, or unresolved concerns justify them.
- Never bypass managed browser policy, CAPTCHA, provider quotas, login protections, or security checks to make a test pass. Record blocked or unverified checks honestly.

## Privacy and release

- Do not extract, copy, or log cookies, credentials, session tokens, or private browser profiles. Keep private conversations, account identifiers, signed URLs, and unrelated tab contents out of fixtures, logs, screenshots for publication, and commits.
- Keep diagnostics content-free. Request only necessary provider permissions and preserve the existing local session-storage boundary unless explicitly redesigning it.
- Bind publishing privileges to trusted workflow code and immutable repository identity. Enforce release provenance before authentication, deploy the validated artifact, and never rely on a tag or environment name alone as a trust boundary.
- Before release, inspect the actual ZIP, manifest, permissions, bundled licenses, icons, store images, listing, privacy policy, and reviewer instructions. Verify the package corresponds to the tested source.
- Prefer browser-managed extension updates. Never force a reload during active work or add periodic update polling without a demonstrated need. Explain storage loss and required exports before lifecycle actions; an installed version is not proof that it is the latest available version.
- Check current official provider terms and store requirements; do not assume prior compliance notes remain valid. Document concrete release blockers and distinguish a prepared package, uploaded draft, submitted review, and public listing.
- Complete authorized preparation before requesting any genuinely required user action. Do not claim publication or approval without a confirmed store state.

## Maintaining this file

- Write this file in English. Keep it concise and limited to durable, repository-wide rules that guide future decisions.
- When a failure reveals a reusable lesson, record the evidence and cause in the relevant development or testing document first. Add or amend a rule here only when it prevents recurrence across tasks.
- Express rules as an actionable invariant or decision procedure. Do not add session transcripts, current task status, dates, version numbers, machine-specific paths, tab/extension IDs, selectors, model names, test counts, or temporary workarounds here.
- Keep changing facts and detailed reproduction steps in their owning documents or tests; link to those documents instead of duplicating them. Label hypotheses and historical results as such.
- Before changing a rule, read the entire file, check it against the current code and explicit user instructions, and remove or merge redundant or superseded rules. Amend existing guidance instead of appending contradictory exceptions.
- At task completion, review whether a proven lesson warrants an update. Do not edit this file merely to record progress or an unverified assumption. Check the diff for secrets, stale facts, duplication, and accidental scope changes.
