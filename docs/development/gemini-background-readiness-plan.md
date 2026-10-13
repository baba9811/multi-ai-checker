# Gemini background readiness implementation plan

> **For agentic workers:** Use subagent-driven development for isolated provider work and independent review. Steps use checkboxes; root alone builds, runs browser suites, and operates the browser.

**Goal:** Establish the current Gemini mode selection and required generation protection through the installed extension before attempting a fixed background request.

**Architecture:** Provider adapters read their owning DOM and transient bootstrap in the provider page. The application exposes only strict readiness metadata; Chrome infrastructure allocates one inactive fresh home and persists the check intent. Presentation uses the injected platform port. This readiness check performs no authenticated API request and does not authorize generation.

**Tech stack:** Existing TypeScript, Zod, React, WXT, Vitest, and Playwright; no new dependency.

## Global constraints

- Existing web login/subscription only. Do not read credentials through development/browser tools or export provider authentication through RPC, storage, diagnostics, or a server.
- Do not omit, fabricate, reimplement, or bypass required provider security checks. An absent flag is unknown, not proof of disabled protection.
- The readiness check must not send a prompt, upload, fetch private account data, or claim response success.
- Preserve existing work and provider behavior. Run build and browser suites sequentially when output is shared.
- Report unit, synthetic browser, installed origin, native panel, and live provider evidence separately.

## Task 1: Read the current owning Gemini model menu

Files: `src/infrastructure/providers/models.ts`; `tests/browser/adapters.spec.ts` (existing model checks); current provider fixture if needed.

Interface: `readGeminiMode(): Promise<{ label: string; modeId: string }>` remains provider local. Normal `modelMenu('gemini')` returns labels only, never the backend key. Current `gem-menu-item[role="menuitem"][data-mode-id]` rows are models. Their selected class is a current official-client selection marker; effort rows have no mode key and must not enter the model list. Associate the wide portal with the owning trigger's `aria-controls`. For the observed compact `gem-button` path without that attribute, use its unique native inner button and the local model popover inside the same `bard-mode-switcher`; never use a global menu fallback. Require one enabled selected model row. Capture primitive label/key before closing the menu and confirm cleanup.

- [x] Add a synthetic fixture with one selected automatic model row and a separately selected low-effort row. Assert the model list/current contain only the owning model row, no request key, and the menu is closed. Add ambiguous model selection and foreign portal rejection. Run these checks red before production edits.
- [x] Reuse the current picker lifecycle and add a provider-specific owner/row reader. Preserve other providers and legacy Gemini fixtures. Do not use a global selected class or map automatic mode to a guessed model.
- [x] Run focused browser checks on the rebuilt artifact and check all affected call sites.

## Task 2: Provider-local security readiness

Files: create `src/application/gemini-readiness.ts`, `src/infrastructure/providers/gemini/readiness.ts`, and `tests/unit/providers/gemini-readiness.test.ts`.

Interface: `geminiReadiness(): Promise<{ model: string; protection: 'disabled' | 'enabled' | 'unknown' }>` returns only a UI label and fixed protection state. `readGeminiProtection(): 'disabled' | 'enabled' | 'unknown'` reads one bounded DOM script assignment for `WIZ_global_data` and only its `TSDtV` flag container. It does not evaluate script, use MAIN-world exports, or return raw bootstrap. The current official `45428920` flag controls BotGuard. The JSON flags form requires an explicit boolean. In the JSPB form, require one keyed flag row with exactly the boolean oneof; false/0 is disabled, true/1 enabled. Missing, duplicated, malformed, oversized, conflicting, or inaccessible state is unknown. Never adopt the client fallback that continues after a protection failure.

- [x] Write failing unit checks for explicit disabled/enabled JSON and JSPB states, duplicate/missing flag and oneof conflicts, malformed/oversized/multiple DOM bootstrap, and no network use. These fixtures contain invented values only.
- [x] Implement strict bounded parsing and source-supported flag interpretation in provider ownership. Bind to the exact fresh Gemini home; check cancellation/page changes through the bridge. Combine with the current provider-local model reader.
- [x] Run focused unit checks; inspect the data returned to ensure no account/request key/bootstrap content escapes.

## Task 3: Installed-panel readiness action

Files: `src/application/ports.ts`, `src/application/provider-protocol.ts`, `src/infrastructure/chrome/provider-client.ts`, `src/infrastructure/chrome/platform.ts`; create `src/infrastructure/chrome/gemini-readiness.ts`, `src/presentation/providers/GeminiReadiness.tsx`; modify `entrypoints/bridge.ts`, `src/presentation/providers/ConnectionSettings.tsx`; add session, bridge, UI, and installed-origin regressions using the existing fixture infrastructure.

Interfaces: optional `Platform.readGeminiReadiness(): Promise<GeminiReadinessRecord | undefined>` and `Platform.checkGeminiReadiness(signal): Promise<GeminiReadinessResult>`. Strict start/poll/cancel commands accept only id/document/url; no prompts, headers, request options, tokens, or URLs. Persist `{id,status:'pending'}` before tab creation; completion stores only `{id,status:'done'}`. Restored pending becomes uncertain without dispatch. Model/protection live result stays in memory.

- [x] Add failing session checks for inactive fresh home, persisted intent before allocation, cancellation, uncertain restoration, one dispatch, content-free storage and no tab reveal. Add strict RPC/no proxy and provider mismatch checks.
- [x] Reuse the existing bounded diagnostic lifecycle without changing the Claude path. Guard models/sends/readiness against overlap and duplicate IDs; stop on page input, navigation, panel heartbeat loss or cancellation. No generation/network action exists in this flow.
- [x] Add a collapsed `Gemini 준비 확인` action explaining that it reads the selected model and protection state, sends no request, and does not establish response success. Show enabled/unknown as generation blocked, and disabled as one prerequisite only.
- [x] Run unit/type/build, focused synthetic/installed-origin checks, and independent review. Reload only the project extension, confirm its path/artifact, invoke the real native panel action, and record the actual outcome. Close only owned tabs and stop owned native control afterward.

## Next generation gate

Only after readiness can prove a safe required-protection path should a separate fixed single-request milestone be implemented. Current public source establishes LF-inclusive UTF-16 framing, explicit stream final, CID/RID/RCID readback, saved selected candidate, mode echo and pagination. The exact current request/header mapping and supported text-only metadata allowlist still require verification. No guessed recipe, automatic retry, latest-conversation recovery, generic authenticated proxy, or migration of the default review is permitted.
