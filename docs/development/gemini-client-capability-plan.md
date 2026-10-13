# Gemini normal-client capability preflight

> Implement with subagent-driven development or executing-plans, using independent review and sequential root-owned browser/build verification.

**Goal:** Establish whether the actual owned Gemini page has the cached prerequisites for a later protected text trial, without initiating provider operations or exposing private values.

**Architecture:** A self-contained synchronous MAIN function reads only exact own data descriptors and cached provider references. Chrome pins it to the already validated native document during the pending model receipt. Application owns the strict fixed result contract; presentation explains the result without claiming generation readiness.

**Tech stack:** Existing TypeScript, WXT, Zod, Vitest and Playwright; no new dependency or permission.

## Scope and constraints

- Preserve existing web login/subscription, source conversation, foreground, metadata intent, cancellation, session ID/status boundary and model cleanup ownership.
- Accept only the source profile documented in [the transport investigation](../research/background-web-transport.md). A missing export, unsupported context, unresolved cache, shadowing record or unexpected descriptor is unsupported; do not guess aliases or hydrate a service.
- MAIN receives no DOM node or private context from ISOLATED. Reacquire exactly one attached visible compact `gem-button[data-test-id="bard-mode-menu-button"]`, its exact nearest `bard-mode-switcher[data-test-id="bard-mode-switcher"]`, and one owning visible inner button. Use only the GEM-BUTTON host's own context; another layout, duplicate or missing context is unsupported. Do not search ancestors for a context or use broad selector fallbacks. Never enumerate general namespaces, views, tokens or services.
- Never invoke provider factories, injectors, observers, protection, store, connection, generation or history methods. Do not inspect authentication, bootstrap siblings, headers, body, packet values or private model keys.
- Export only a strict fixed result: candidate, or unsupported with a fixed reason. Keep flags, references and context IDs inside the page. Neither result authorizes a request.
- A registered prewarm manager is unsupported in this first scope. Do not clear it, disable it, choose another transport or alter flags. The actual new connection's dispatch callback cannot be proven before its later creation.

## Task 1: Fixed contract and pure provider projection

Files: `src/application/gemini-readiness.ts`, new `src/infrastructure/providers/gemini/client-capability.ts`, and new `tests/unit/providers/gemini-client-capability.test.ts`.

- [ ] Add the strict result union and the smallest failing checks for unsupported input and a complete invented source-profile fixture. Fixed unsupported reasons are page, owner, runtime-shape, injector, cached-service, service-identity, protection, transport, prewarm and hook.
- [ ] Implement the synchronous projection with all runtime helpers nested so serialization retains no imported dependency. Reject getters instead of invoking them, distinguish absent data from explicit undefined and require exact prototype identity.
- [ ] Resolve only that host's owning numeric context through exact exported `DOb`. Validate live LView ownership by own slot 28: the exact host, or one live component LView whose own slot 0 is that host and parent slots 3/14 are the owning view. Embedded views may have null slot 0; do not require slot-0 containment or scan slots. Read exact own injector slot 9, then walk at most eight legitimate `FVb` parents, rejecting cycles and local unresolved or construction records. Read only exact requested token records and source-defined factory identity; a missing locally root-scoped record cannot be replaced by a parent's value, while the source's explicit null cache marker delegates.
- [ ] Require cached `sC/lN`, `IL/HL`, `pL`, `RHd`, `DL` and `IHd` with exact class/factory identity. Require `conversation.ha === api`, `api.Ja === protection`, `protection.isEnabled === true`, `api.wb === sessionFactory`, `IHd/sessionFactory.oa/api.Nd/api.Aa === true`, and `api.Fb === registry`. Positive absence of the registry's `ha` must also reject inherited/accessor state; `api.Ia` is a lifetime service, not this registry. Inspect future-hook descriptors only. No Rzc callback exists to inspect until a later connection is created.
- [ ] Test serialized execution, missing/duplicate/foreign owners, getters, null-host embedded views with exact slot-28 ownership, destroyed views, shadowed/unresolved caches, fake/substitute services, disabled or mismatched transport, registered/inherited/accessor manager state, existing own API wrappers and immutable descriptors. Assert zero provider-method calls and fixed output only. Descriptor checks do not authenticate namespace or prototype functions replaced with the same shape; do not claim general patch detection.

## Task 2: Installed metadata path

Files: `src/infrastructure/chrome/gemini-readiness.ts`, `src/presentation/providers/GeminiReadiness.tsx`, existing session/unit/browser/installed readiness tests and their synthetic platform fixture.

- [ ] Execute the new function on the same validated native document while the existing receipt is pending. Strictly validate one matching top-frame result, inspect the original bridge binding again and finish only after current model/key confirmation and cleanup.
- [ ] Render candidate as prerequisite evidence only; unsupported results explain that direct sending is not established. Preserve fixed errors, neutral explicit cancellation and ID/status-only restoration. Do not add a send action or persist capability metadata.
- [ ] Add rejection cases for wrong document/frame, arbitrary/extra output, cancellation and restore. Test actual serialized MAIN with ISOLATED bridge, disclosing fixture permission/allocation/general-panel substitutions.
- [ ] Root runs type/unit/build, relevant synthetic and installed checks sequentially. Reload only the exact project installation and use the native panel with one new inactive home. Record only fixed capability status/reason and visible model label, then close the owned home and stop the native helper.
- [ ] Independently review correctness/privacy/UX, update the owning evidence documents and preserve a local checkpoint.

## Later generation boundary

This deliverable does not implement a request. An outer API call counter is insufficient because the current SDK has internal reconnect/fallback paths. A later narrow cold-native trial must bind one final approved packet, one subscription and one genuine connection callback, retain its guards through actual MAIN cancellation and queued effects, and confirm exact raw saved-history completion. Missing capture or teardown after a possible connect is uncertain, never proof of a request that did not begin. Those gates must be resolved before generation; this preflight must not present itself as a successful response or a general sending capability.
