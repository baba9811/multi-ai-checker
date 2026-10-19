# Readable review and background execution

The user requested readable provider messages, editable answer language and stage instructions with reset, automatic forwarding of existing source attachments, and no automatic foreground tab switching.

## Design

- Preserve the one-start workflow, complete approved context, reuse of the original answer, original main binding, upload receipts and persisted send intent. No ambiguous retry or interrupted automatic resume.
- New runs snapshot validated prompt options. Language and the three task paragraphs are editable; sharing boundaries, untrusted-data rules and source uncertainty remain fixed. Preferences use the existing session workspace. Old runs without options retain their stored prompts and legacy composition.
- New prompts use readable sections and literal paragraphs. They carry the same complete source turns, candidate answers, reviews, evidence and file metadata. No JSON scaffold, escaping or silent shortening.
- The stable default remains the established foreground DOM workflow. No-switch execution is an explicit experimental option: new peers share an extension-owned unfocused window, and only owned peer tabs can be activated there. Saved user tabs and the original main stay in place. Experimental readiness failure stops explicitly, without silently switching to foreground execution.
- Source originals require a complete owning-message manifest and an ordinary, proved original-byte download path. Retrieval must be explicit, all-or-nothing, memory-only, bound to unchanged source, and match known synthetic bytes. Thumbnails, extracted text, guessed endpoints and exported signed URLs are unacceptable. Unsupported sources must be disclosed rather than silently omit files.

## Work and validation

1. Domain regression tests, prompt options and readable composition, including legacy continuation and full-scope bounds.
2. Optional collapsed settings UI, per-stage/all reset, session restoration and immutable run settings; application and browser regressions.
3. Validate the stable foreground default and the explicit experimental no-switch option separately. Synthetic background-window and installed-extension focus checks do not establish ordinary service readiness. Three native Claude attempts failed in the no-switch path; a 10-second wait did not resolve the failure. That wait was reverted, and no-switch execution must not become the default on the existing evidence. The precise native cause remains unresolved.
4. Bound source-original discovery on the existing synthetic conversations, then implement only a proved original-byte path and its complete-manifest regressions. [The bounded investigation](source-originals-investigation.md) records the current provider-specific evidence, unsupported representations and unverified retrieval steps. Complete automatic original retrieval across all three providers remains unproved; retain manual original selection.
5. Independent review, type/format/unit validation, sequential build → browser → installed extension → genuine native service verification. Keep evidence categories distinct. Refresh release artifacts only after acceptance; store authentication remains deferred by the user.

Historical October 19 release artifacts predate these behavior changes and are not evidence for this implementation.
