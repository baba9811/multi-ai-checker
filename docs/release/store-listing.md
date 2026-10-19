# Store listing — 0.5.0 candidate

The copy below is prepared for 0.5.0 and has not yet been saved for this release. The previous 0.4.0 Korean listing was submitted on 2026-10-07; the [release checklist](release-checklist.md) owns its later public availability and the current package/dashboard state. English copy remains an unsubmitted draft. Do not infer upload, submission or publication from this prepared text.

## English

**Name:** CrossCheck — Multi AI Checker

**Short description:** Compare ChatGPT, Claude and Gemini conversations and attachments, cross-review answers, and synthesize in your original chat.

**Detailed description:**

CrossCheck helps you compare responses from selected ChatGPT, Claude, and Gemini web conversations in a Chrome side panel.

Load a conversation with completed question-and-answer turns. Inspect the loaded scope and full preview, then choose the peer services. If the source conversation contains attachments, select every original file and image; otherwise confirm that it has no attachments. One start reuses the main answer, gathers other responses, requests a bounded review, and sends the synthesis request back to the original main conversation. Keep the panel open while it runs.

Review settings let you edit the answer language and each stage instruction, or reset them to defaults. The default workflow activates provider tabs in sequence. No-switch execution is an opt-in experiment with a known live Claude Send failure.

The optional Claude original-file review collects Claude's review and cross-review in the panel without requesting main-conversation synthesis. Optional connection and response checks show fixed or synthetic prompts before a separate start, create fresh test conversations when a response is requested, and do not send your imported review or selected files. An interrupted or uncertain request never automatically resends.

The separate Gemini SDK response check is experimental. Its latest live trial stopped at a compatibility check; a completed response and matching saved history have not been verified. The standard review uses the separate DOM workflow.

Connection opens the provider tab so you can complete normal login. Available model choices come from your account's web interface; unsupported menus keep the web-selected model. Accounts, subscriptions, quotas, and file support are controlled by each provider.

The selected services receive the loaded conversation turns, review material, and chosen files. CrossCheck has no developer server or telemetry. Review history and file metadata stay in Chrome session storage; raw files are held temporarily in memory. Provider conversations and uploaded files may remain with the provider.

AI agreement is not factual verification. Search execution, source accuracy, and uninterrupted service compatibility are not guaranteed. CrossCheck is an independent product, not an official product of OpenAI, Anthropic, or Google.

## 한국어

**이름:** CrossCheck — Multi AI Checker

**짧은 설명:** ChatGPT·Claude·Gemini 대화와 첨부파일을 비교·교차 검토하고, 원래 대화에서 종합 답변을 받으세요.

**상세 설명:**

하나의 대화를 여러 AI의 관점으로 검토하고, 원래 대화에서 종합 답변을 받으세요.

CrossCheck는 ChatGPT·Claude·Gemini 웹 대화를 연결하는 Chrome 사이드패널 확장입니다. 이미 나눈 여러 턴의 질문과 답변을 불러와 비교·교차 검토할 수 있습니다.

사용 방법

1. 연결 버튼으로 서비스 탭을 열고 평소처럼 로그인하세요. 별도 API 키는 필요 없습니다.
2. 완료된 질문·답변이 있는 메인 대화를 불러온 뒤, 공유할 전체 내용과 검토할 AI를 확인하세요.
3. 대화에 첨부가 있다면 파일·이미지 원본을 모두 다시 선택하세요. 없다면 첨부 없음을 확인하세요.
4. 자동 검토 시작을 한 번 누르세요. 기존 메인 답변을 재사용하고, 선택한 AI에 요청을 자동 전송해 답변과 교차 검토를 모은 뒤 원래 메인 대화에 종합 요청을 보냅니다. 실행 중에는 패널을 열어두세요.

각 서비스의 계정·구독·사용 한도·파일 지원이 적용됩니다. 모델 선택은 실제 계정의 웹 화면을 따릅니다.

검토 설정에서 답변 언어와 단계별 지시문을 편집하거나 기본값으로 되돌릴 수 있습니다. 기본 실행은 AI 탭을 차례로 활성화합니다. 탭 전환 없는 실행은 선택형 실험이며, 현재 Claude 전송이 실패할 수 있습니다.

선택형 Claude 원본 검토는 Claude의 검토·교차 검토를 패널에 모으며 메인 대화에 종합 요청을 보내지 않습니다. 연결·응답 시험은 고정 또는 합성 문구를 보여준 뒤 별도로 시작합니다. 응답 시험은 새 시험 대화를 만들며 가져온 검토 문맥이나 선택한 파일은 보내지 않습니다. 중단되거나 전송 여부가 불확실한 요청을 자동으로 다시 보내지 않습니다.

별도 Gemini SDK 응답 시험은 실험 기능입니다. 최신 실제 시험은 호환성 검사에서 중단되어, 완료된 답변과 동일 대화의 저장 기록은 검증하지 못했습니다. 일반 검토는 별도의 DOM 경로를 사용합니다.

공유와 개인정보
선택한 서비스에는 불러온 대화, 검토 자료, 선택한 원본 파일이 전달됩니다. 개발자 서버나 분석 전송은 없습니다. 검토 기록과 파일 메타데이터는 Chrome 세션에 보관하며, 원본 파일은 일시적으로 메모리에서 처리합니다. 서비스에 전송한 대화와 파일은 해당 서비스에 남을 수 있습니다.

AI 답변 비교를 돕는 도구입니다. 중요한 내용과 출처는 직접 확인하세요. CrossCheck는 OpenAI·Anthropic·Google의 공식 제품이 아닙니다.

## Historical submitted listing fields — 0.4.0, 2026-10-07

- Privacy policy URL: https://baba9811.github.io/multi-ai-checker/ (the previous 2026-10-06 policy had unauthenticated HTTPS 200 and matched its then-canonical bytes before the 0.4.0 submission; this does not verify the new 0.5.0 notice).
- Public support contact: **bany981111@gmail.com** (owner selected for public display). Verified through the official confirmation email; Publisher Settings confirms it is a verified public contact.
- Saved project homepage: https://github.com/baba9811/multi-ai-checker. Saved support URL: https://github.com/baba9811/multi-ai-checker/issues.
- The 0.4.0 manifest summary and its original Korean description were confirmed in the dashboard. This does not establish that the revised 0.5.0 text above is saved. The observed category was **Productivity → Tools**, default language **Korean**. English copy remained preparation material.
- Store images: actual final UI with synthetic content only; no private conversations or account identifiers. Specifications and rights review are in the checklist.
- Provider names/logos: verify rights before use; an independence statement alone does not resolve trademark permission. [Store impersonation/IP policy](https://developer.chrome.com/docs/webstore/program-policies/impersonation-and-intellectual-property).

## Public discovery

The owner requested a publicly searchable listing. Keep the recognizable title **CrossCheck — Multi AI Checker** and describe AI answer comparison, cross-review and the supported providers naturally in the short and detailed descriptions. Keep the Korean manifest description identical to the Korean short description above. Do not add unrelated keyword lists, repetition, unsupported rankings or official-affiliation claims. [Listing guidance](https://developer.chrome.com/docs/webstore/best-listing).

Before release, confirm **Public** visibility and the intended available regions, including South Korea. Public, Unlisted and Private all require review; Unlisted does not provide the requested store discovery. After confirmed publication, verify the public listing while signed out and search its exact title, then relevant functional terms. Indexing may take several hours, and keyword placement does not guarantee a ranking. Record observed results separately from saved metadata or selected visibility. [Distribution settings](https://developer.chrome.com/docs/webstore/cws-dashboard-distribution), [search discovery](https://developer.chrome.com/docs/webstore/discovery).

Historical dashboard observation on 2026-10-07: **공개 (Public)** and **전체 지역 (all regions)** were confirmed and preserved. After submission, the item showed **검토 대기 중 (Pending review)**; Package identified version **0.4.0** and said it had never been published. Automatic publication after approval was checked in the submission dialog. Later public-listing observations and current release state belong to the [release record](release-checklist.md).
