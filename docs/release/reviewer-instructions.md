# Reviewer instructions — 0.5.0 candidate

These instructions are prepared for 0.5.0; upload, review submission and publication are separate states recorded in the [release record](release-checklist.md). The steps below describe expected behavior, not a report of completed live tests. Previous 0.4.0 submission evidence remains historical.

CrossCheck has no extension-specific account or API key. It uses permitted provider accounts signed in normally in the same Chrome profile. Provider access, quotas, models, and file support vary. No shared personal account, cookie, token, or private conversation is supplied for review. Publisher support contact: **bany981111@gmail.com**. If a review-access limitation remains, establish an allowed review path before submission.

## Expected main workflow, once provider access is permitted

1. Use a non-sensitive test conversation in the original main provider. Ask: "When does water boil at 100°C? Explain the pressure condition." Wait for a completed answer, then ask a follow-up referring to its pressure condition. Wait again and leave the composer empty.
2. Open CrossCheck from its toolbar action; use its native side panel. Select at least two allowed providers including the main provider. In **연결**, each **연결** button opens/focuses the appropriate provider tab. Complete normal login yourself if needed. Return and use **로그인 완료 · 다시 확인**. Unknown pages remain marked for checking; no login or CAPTCHA bypass is attempted.
3. Return to the original main provider conversation, open **검토**, and use **현재 탭에서 가져오기** (or **현재 탭으로 변경**). Confirm the imported pair count and expand **공유할 대화 전체 보기** to inspect both turns. If the source was already pinned, **원래 대화로 돌아가기** returns to it; connection actions do not replace that source.
4. Optionally select a harmless original `facts.txt` containing "Water boiling point depends on pressure." Existing attachments are not automatically retrieved: select every original file/image used by the source conversation together. Check the displayed filenames, then check the required confirmation that all originals are selected or the original conversation has no attachments. Press **자동 검토 시작** once and keep the panel open. The sharing notice covers all loaded conversation turns, review prompts, and files going to the selected providers. The main answer is reused, peer responses are collected, a bounded cross-review runs, and synthesis returns to the original main conversation. Confirm the completed final answer appears in the panel.
5. When a file is selected, verify each participating provider accepts the original file on its first required request, including the original main synthesis in the fast workflow. Later requests on the same bound conversation do not repeat the file. Unsupported/incomplete uploads fail visibly; the extension does not silently send a text-only substitute.
6. Model choices are read from the account's actual web menu. A manual model-list request/choice must not send a question. Unsupported model menus show that the web-selected model is used. No subscription, quota, or search entitlement is invented.
7. In **검토 설정**, answer language and each stage instruction are editable and resettable. New runs use readable text sections; a started run retains its captured instructions. The default workflow activates provider tabs. **탭 전환 없이 실행 (실험)** is opt-in and has a known live Claude Send failure; synthetic background completion does not establish live reliability.

## Expected safety/recovery behavior

Optional checks in **연결** require a separate explicit start after displaying their fixed/synthetic prompt. **Gemini 응답 시험** sends `Reply with CROSSCHECK_GEMINI_OK only.` in a fresh background conversation. Accept its result only after the original SDK completion and matching saved-conversation check; a visible provider answer alone is insufficient. Claude connection/context checks likewise use disclosed synthetic text. They do not forward imported review content or selected originals. Their session intent remains uncertain after interruption and must never silently resume. New provider-side test conversations can remain after stopping; delete them in the provider if desired.

The separate Gemini SDK response check is experimental. Its latest live trial stopped at `P18-R3-P156 / response-raw-field-45`; a completed response and matching saved history have not been verified. The standard review uses the separate DOM workflow. Do not resume or resend an uncertain attempt.

The optional Claude original-file review is a different review choice: it sends the previewed imported context and explicitly selected originals to one new Claude conversation, collects its review and cross-review, and finishes in the panel without requesting synthesis in the original main conversation. Claude's account workspace/model metadata is used inside its provider page; no provider credentials are supplied or exported for review.

- A draft or generating response prevents automatic sending; existing drafts are not overwritten.
- Editing an earlier imported turn, adding an unrelated turn, or changing/reloading the original main conversation blocks its later synthesis send. Do not redirect it to another conversation.
- Closing the panel or stopping a run does not automatically resend uncertain requests when reopened. Check the provider tab for any already-sent result.
- Raw selected files are not in stored history. After closing/reloading, matching originals must be selected again before an explicitly resumed review can use them.
- **탭 열기** provides missing-tab recovery. Revoked permissions require another explicit connection/start gesture.
- **진단 저장** exports structural status only, not question/answer text, URLs, account identifiers, or file bytes. Clearing the extension's record does not delete provider conversations/uploads.

Use separate evidence for unit tests, synthetic DOM/browser fixtures, the installed native side panel, and live provider services. Fixture success cannot establish live service or upload compatibility. See the owning [validation record](../testing/validation.md) and [live-login procedure](../testing/live-login.md).

The store's test-instructions field is available for review guidance and restricted-access information. This draft does not authorize sharing provider credentials. [Official test-instructions guidance](https://developer.chrome.com/docs/webstore/cws-dashboard-test-instructions).
