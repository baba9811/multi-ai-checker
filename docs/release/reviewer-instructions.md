# Reviewer instructions draft — intended 0.3.1

Do not submit until the [release blockers](release-checklist.md) are resolved and the final build is verified. These instructions are expected behavior, not a report of completed live tests.

CrossCheck has no extension-specific account or API key. It uses permitted provider accounts signed in normally in the same Chrome profile. Provider access, quotas, models, and file support vary. No shared personal account, cookie, token, or private conversation is supplied for review. Publisher support contact: **bany981111@gmail.com**. If a review-access limitation remains, establish an allowed review path before submission.

## Expected main workflow, once provider access is permitted

1. Use a non-sensitive test conversation in the original main provider. Ask: "When does water boil at 100°C? Explain the pressure condition." Wait for a completed answer and leave the composer empty.
2. Open CrossCheck from its toolbar action; use its native side panel. Select at least two allowed providers including the main provider. In **연결**, each **연결** button opens/focuses the appropriate provider tab. Complete normal login yourself if needed. Return and use **로그인 완료 · 다시 확인**. Unknown pages remain marked for checking; no login or CAPTCHA bypass is attempted.
3. Return to the original main provider conversation, open **검토**, and use **현재 탭에서 다시 선택**. Confirm the imported question and completed answer. If the source was already pinned, **메인 대화로 돌아가기** returns to it; connection actions do not replace that source.
4. Optionally select a harmless original `facts.txt` containing "Water boiling point depends on pressure." Existing attachments are not automatically retrieved: select every original file/image used by the source conversation together. Check the displayed filenames, then check the required confirmation that all originals are selected or the original conversation has no attachments. Press **자동 검토 시작** once and keep the panel open. The sharing notice covers chosen prompts, answers, and files going to the selected providers. The main answer is reused, peer responses are collected, a bounded cross-review runs, and synthesis returns to the original main conversation. Confirm the completed final answer appears in the panel.
5. When a file is selected, verify each participating provider accepts the original file on its first required request, including the original main synthesis in the fast workflow. Later requests on the same bound conversation do not repeat the file. Unsupported/incomplete uploads fail visibly; the extension does not silently send a text-only substitute.
6. Model choices are read from the account's actual web menu. A manual model-list request/choice must not send a question. Unsupported model menus show that the web-selected model is used. No subscription, quota, or search entitlement is invented.

## Expected safety/recovery behavior

- A draft or generating response prevents automatic sending; existing drafts are not overwritten.
- Changing/reloading the original main conversation blocks its later synthesis send. Do not redirect it to another conversation.
- Closing the panel or stopping a run does not automatically resend uncertain requests when reopened. Check the provider tab for any already-sent result.
- Raw selected files are not in stored history. After closing/reloading, matching originals must be selected again before an explicitly resumed review can use them.
- **탭 열기** provides missing-tab recovery. Revoked permissions require another explicit connection/start gesture.
- **진단 저장** exports structural status only, not question/answer text, URLs, account identifiers, or file bytes. Clearing the extension's record does not delete provider conversations/uploads.

Use separate evidence for unit tests, synthetic DOM/browser fixtures, the installed native side panel, and live provider services. Fixture success cannot establish live service or upload compatibility. See the owning [validation record](../testing/validation.md) and [live-login procedure](../testing/live-login.md).

The store's test-instructions field is available for review guidance and restricted-access information. This draft does not authorize sharing provider credentials. [Official test-instructions guidance](https://developer.chrome.com/docs/webstore/cws-dashboard-test-instructions).
