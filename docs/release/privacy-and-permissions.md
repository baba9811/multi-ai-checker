# Privacy and permission worksheet — intended 0.4.0

Dashboard preparation worksheet. Public privacy policy: [CrossCheck privacy and support](https://baba9811.github.io/multi-ai-checker/) (publication verification is recorded in the release checklist). The owner selected **bany981111@gmail.com** as the public support/privacy contact. Policy effective date: **2026-10-06**. The legal publisher identity shown in the dashboard still requires owner verification. Check the final ZIP against [security/privacy.md](../security/privacy.md) before completing dashboard certifications.

The store requires a policy for products handling user data, including collection/use/sharing and recipients. Local handling and provider uploads still require disclosure. [Privacy policy requirements](https://developer.chrome.com/docs/webstore/program-policies/privacy).

## Policy data-flow summary

The public policy source is [privacy-notice.html](../security/privacy-notice.html). Update that source when handling changes; this worksheet maps it to dashboard fields.

CrossCheck reads the completed question-and-answer turns loaded in the provider conversation you choose. The panel shows the captured scope and a complete preview before sharing. After you start a review, it sends those conversation turns, review prompts, evidence you enter, and original files you select to the participating AI services. The final synthesis request is sent to the original main conversation. The recipients are OpenAI/ChatGPT, Anthropic/Claude, and Google/Gemini, according to your selection and the released provider availability.

The extension does not operate a developer backend, analytics service, advertising tracker, or telemetry endpoint. It does not read passwords, browser cookies, login tokens, or files you have not selected. The provider website uses its own normal login session. Provider retention, training settings, and processing are governed by that provider's policy and your account settings; the extension does not change them.

Chrome `storage.session` holds imported conversation turns, review text, entered evidence, job status, bound provider-tab/conversation references, and selected file metadata (name, MIME type, size, SHA-256 matching value). Raw file bytes/base64 are not stored in workspace history. They are processed temporarily in panel memory and the destination tab's upload flow. Closing/reloading the panel loses its selected raw-file memory; continuing requires reselecting matching originals. Uploading a file already shares it with the provider, even if a later send fails.

The extension's record-clearing control removes the review record; provider bindings remain until disconnected. Session records and bindings also clear when the extension is disabled, reloaded, updated, or the browser restarts. Save any needed review export before updating. These actions do not remove provider conversations, uploaded files, or user-downloaded exports. Those must be deleted separately. Diagnostic exports omit conversation text, URLs, account identifiers, and file content. [Chrome session-storage lifecycle](https://developer.chrome.com/docs/extensions/reference/api/storage#property-session).

Data is used for the visible review workflow, not sold or used for advertising, unrelated profiling, creditworthiness, or lending decisions. For questions, contact **bany981111@gmail.com**.

**한국어 핵심 고지:** 사용자가 시작한 검토에 선택한 질문·답변·근거와 직접 선택한 원본 파일을 참여 AI 서비스에 보냅니다. 개발자 서버·분석 전송은 없습니다. Chrome 세션에는 검토 기록·연결 참조·파일 이름/형식/크기/해시를 저장하며 원본 파일은 일시적으로 메모리와 업로드 과정에서만 처리합니다. 패널을 다시 열어 이어가려면 같은 원본을 다시 선택해야 합니다. 기록 삭제나 연결 해제는 서비스에 이미 보낸 대화·업로드 파일을 삭제하지 않습니다.

## Minimal permission justifications

Single purpose: compare user-selected AI conversation responses and chosen files through a bounded review, then return synthesis to the original conversation.

| Manifest item                            | Dashboard justification draft                                                                                                                                             |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sidePanel`                              | Display connection controls, selected files, review progress, and collected responses beside the user's chosen conversation.                                              |
| `storage`                                | Keep review state and provider bindings in Chrome session storage; persist send intent to prevent ambiguous automatic resends. Store file metadata only.                  |
| `scripting`                              | Inject the bundled local bridge into the selected provider tab's top frame to inspect the conversation/composer and perform the user-started review and file upload.      |
| `activeTab`                              | Identify the active provider conversation when the user opens/starts the extension.                                                                                       |
| `https://chatgpt.com/*` (optional)       | Access the selected ChatGPT conversation/composer/model menu and process its authorized review requests and chosen uploads. Requested on a user connection/start gesture. |
| `https://claude.ai/*` (optional)         | Same scoped behavior for selected Claude tabs; distribution remains blocked until the provider-permission question is resolved.                                           |
| `https://gemini.google.com/*` (optional) | Same scoped behavior for selected Gemini tabs. No permission is requested for Google sign-in hosts.                                                                       |

No `<all_urls>`, cookies, browsing-history API, remote-code, or extra login-host permissions are proposed. Check the actual manifest; remove unused permissions before upload. The minimum-permission rule also covers optional hosts. [Store privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy), [minimum-permission FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq/).

## Data-usage declaration worksheet

The dashboard saved Website content and Personal communications, No remote code, and the three audited data-use certifications. Saved-state evidence belongs to the [release checklist](release-checklist.md); this worksheet describes their data-flow basis. Recheck against the final package whenever behavior changes; never select "no data" merely because there is no developer server.

| Data handled                                  | Declaration preparation                                                                                                                                                                                                                                     |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Website content                               | Declare chosen provider conversation text, composer state, actual model menu choices, and content/file data shared in the workflow.                                                                                                                         |
| Personal communications/user-provided content | Disclose selected questions/answers and chosen documents. Confirm the dashboard's current communications definition when choosing its checkbox.                                                                                                             |
| Page references                               | Explain bound provider tab/document/conversation references used for safe targeting. This is not a full browsing-history collection; do not claim that no URLs are processed.                                                                               |
| File metadata                                 | Name, MIME type, size, and SHA-256 value in session; filenames may themselves contain personal information.                                                                                                                                                 |
| Sensitive information within selected content | Arbitrary chosen text/files may contain personal, health, or financial information. The extension does not seek those categories independently. Final declarations must reflect supported actual use rather than promise that such content can never occur. |
| Authentication/account identifiers            | No passwords/cookies/tokens or account-profile fields are extracted. The site itself handles authentication.                                                                                                                                                |
| Analytics/location/activity tracking          | No developer telemetry, geolocation collection, or cross-site tracking. Operational review status remains in session.                                                                                                                                       |
| Remote code                                   | Candidate answer: no. Confirm all executable code is bundled in the final MV3 package.                                                                                                                                                                      |

Verify the final package's data flows before certifying no sale, no unrelated use/transfer, and no credit/lending use. Provider uploads are declared workflow transfers, not "no third-party sharing." Keep dashboard text, public notice, listing, and in-product sharing disclosure consistent. [Dashboard disclosure guidance](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy).
