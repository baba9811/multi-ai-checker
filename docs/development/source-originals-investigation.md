# Source originals: bounded investigation

## Current result

Automatic retrieval of complete original attachments is **not proved across ChatGPT, Claude and Gemini**. The observations below are read-only inspections of task-owned synthetic conversations and current public client code. They are separate from unit tests, synthetic browser fixtures, installed-extension tests and end-to-end native review acceptance. No automatic source-original acquisition is accepted on this evidence alone.

The known originals are the public repository fixtures in `tests/fixtures/attachments/`:

| File                   | Type         | Bytes | SHA-256                                                            |
| ---------------------- | ------------ | ----: | ------------------------------------------------------------------ |
| `crosscheck-facts.txt` | `text/plain` |   129 | `81d91a4ee9986f524b9e22a0ada236e15e51865ae92fc4c427c3831b8c7939ad` |
| `crosscheck-icon.png`  | `image/png`  |  2479 | `53965b77a2bc601314def977e52cbd1b9026040414fae6f760015815922a9a3a` |

## Provider evidence and remaining gaps

**ChatGPT.** The exact loaded public module exposes the site's original-download helper. Access through the supported Aside module-import path was unsuccessful. A callable, source-bound original-byte path and complete acquisition remain unverified. This tooling result does not establish that the provider has no original-download API.

**Claude.** Current public attachment handlers associate an attachment with its owning human message. The source-proven ordinary history getter returned successfully inside the provider page. Its complete server tree contained eight messages, while two human messages matched the captured DOM rows; history outside the captured rows must not expand the approved sharing scope. The first matched row owned the TXT and PNG, and the second owned neither.

- The TXT history entry supplied an identity, filename, `text/plain` type and 129-byte size. Its inline attachment flow selects the attachment and renders `extracted_content`; original bytes were not retrieved. Re-encoding that extracted text would be a reconstruction, even if this fixture happened to match.
- The existing PNG DOM blob was 2479 bytes and matched the original fixture hash. This proves those observed page-local bytes, not a reusable original-download path after reload or for other images.
- Following the saved image's observed `preview_asset` path returned `image/webp`, 1002 bytes, SHA-256 `06dd005370441718724935f70b6ed57a51c9778f5a931c7563560c0c00a76bcd`. Its declared variant was `preview`; it is not the original PNG.
- The actual modern image Download handler requires a files-API download source and a server-file identity. This legacy image record lacked those fields, so that handler does not support this representation. Other original-byte paths remain unverified.

The finite public-code trace was attachment rendering and `onOpenAttachment` in `shared-14`, selection dispatch in `shared-17`, image Download eligibility in `shared-7`, the inline-text preview module, and the image-preview module. Public source fetches omitted credentials. History and asset requests executed inside the owning provider page; no provider identities, signed URLs, authentication values or raw history objects were exported.

**Gemini.** The captured source yielded an exact two-entry attachment manifest, and the TXT bytes were verified. Fetching the observed original PNG path failed with `TypeError`; original PNG bytes and complete two-file acquisition remain unverified. The failure alone does not identify its cause or establish that original retrieval is unsupported.

## Acquisition contract for further implementation

The smallest complete implementation must:

1. Bind the manifest to every captured owning message and the unchanged source conversation. Account for all attachment representations, duplicates and unsupported entries; a partial visible list or an entire server history is not the approved scope.
2. Obtain each original through an observed, source-proven ordinary download path. Validate filename, type, byte length and identity, then verify exact known bytes in synthetic acceptance. Never substitute a thumbnail, preview or extracted text.
3. Retrieve the entire approved batch or stop before any review send. Keep bytes in memory only, within the existing attachment limits. Keep provider identifiers and temporary download references inside their owning provider page, and export only validated attachment payloads through the existing attachment boundary.
4. Recheck the captured source before accepting the batch and before sending. Preserve one-start execution, upload readiness, persisted send intent and the ban on uncertain retries. After memory loss, require matching originals rather than silently reacquire or omit files.

The current fallback remains the existing manual original-file selection and completeness confirmation. An unproved automatic path must leave that fallback available and explain the missing retrieval step; it must not send a reduced batch. Further investigation should begin at the specific gaps above, rather than repeat broad account, runtime or SDK inspection.
