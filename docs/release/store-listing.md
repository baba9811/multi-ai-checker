# Store listing draft — intended 0.4.0

Preparation only. Do not submit this copy until the [release checklist](release-checklist.md) is complete. It describes intended behavior, not verified compatibility or publication. Reconcile it with the final package and allowed providers before upload.

## English

**Name:** CrossCheck — Multi AI Checker

**Short description:** Compare ChatGPT, Claude and Gemini conversations and attachments, cross-review answers, and synthesize in your original chat.

**Detailed description:**

CrossCheck helps you compare responses from selected ChatGPT, Claude, and Gemini web conversations in a Chrome side panel.

Load a conversation with completed question-and-answer turns. Inspect the loaded scope and full preview, then choose the peer services. If the source conversation contains attachments, select every original file and image; otherwise confirm that it has no attachments. One start reuses the main answer, gathers other responses, requests a bounded review, and sends the synthesis request back to the original main conversation. Keep the panel open while it runs.

Connection opens the provider tab so you can complete normal login. Available model choices come from your account's web interface; unsupported menus keep the web-selected model. Accounts, subscriptions, quotas, and file support are controlled by each provider.

The selected services receive the loaded conversation turns, review material, and chosen files. CrossCheck has no developer server or telemetry. Review history and file metadata stay in Chrome session storage; raw files are held temporarily in memory. Provider conversations and uploaded files may remain with the provider.

AI agreement is not factual verification. Search execution, source accuracy, and uninterrupted service compatibility are not guaranteed. CrossCheck is an independent product, not an official product of OpenAI, Anthropic, or Google.

## 한국어

**이름:** CrossCheck — Multi AI Checker

**짧은 설명:** ChatGPT·Claude·Gemini 대화와 첨부파일을 비교·교차 검토하고, 원래 대화에서 종합 답변을 받으세요.

**상세 설명:**

CrossCheck는 Chrome 사이드패널에서 선택한 ChatGPT·Claude·Gemini 웹 대화의 답변을 비교하도록 돕습니다.

완료된 질문·답변이 있는 대화를 불러오세요. 불러온 턴 수와 전체 공유 내용을 확인한 뒤 검토할 다른 AI를 선택하세요. 원래 대화에 첨부가 있다면 파일·이미지 원본을 모두 선택하고, 없다면 첨부가 없음을 확인하세요. 시작 한 번으로 메인 답변을 재사용하고, 다른 답변과 교차 검토를 모아 원래 메인 대화에 종합 요청을 보냅니다. 실행 중에는 패널을 열어두세요.

연결을 누르면 서비스 탭이 열려 평소처럼 로그인할 수 있습니다. 모델 목록은 실제 계정의 웹 화면에서 읽으며, 메뉴를 지원하지 않으면 웹에서 선택한 모델을 사용합니다. 구독·한도·파일 지원은 각 서비스가 결정합니다.

선택한 서비스에 불러온 여러 턴의 대화·검토 자료와 선택한 원본 파일이 전달됩니다. 개발자 서버나 분석 전송은 없습니다. 검토 기록과 파일 메타데이터는 Chrome 세션에 보관하고 원본 파일은 일시적으로 메모리에서 처리합니다. 서비스에 전송한 대화와 업로드한 파일은 서비스에 남을 수 있습니다.

AI 간 합의는 사실 검증이 아닙니다. 실제 검색 실행·출처 정확성·서비스 화면 호환성을 보장하지 않습니다. OpenAI·Anthropic·Google의 공식 제품이 아닙니다.

## Listing fields and saved draft

- Privacy policy URL: https://baba9811.github.io/multi-ai-checker/ (verify public reachability before submission).
- Public support contact: **bany981111@gmail.com** (owner selected for public display). Verified through the official confirmation email; Publisher Settings confirms it is a verified public contact.
- Saved project homepage: https://github.com/baba9811/multi-ai-checker. Saved support URL: https://github.com/baba9811/multi-ai-checker/issues.
- The existing 0.3.1 package draft now has the multi-turn detailed description above saved and independently revisited. Its package summary still comes from the uploaded 0.3.1 manifest; the new short description will arrive with the 0.4.0 package. Category remains **Productivity → Tools**, default language **Korean**. English copy remains preparation material.
- Store images: actual final UI with synthetic content only; no private conversations or account identifiers. Specifications and rights review are in the checklist.
- Provider names/logos: verify rights before use; an independence statement alone does not resolve trademark permission. [Store impersonation/IP policy](https://developer.chrome.com/docs/webstore/program-policies/impersonation-and-intellectual-property).

## Public discovery

The owner requested a publicly searchable listing. Keep the recognizable title **CrossCheck — Multi AI Checker** and describe AI answer comparison, cross-review and the supported providers naturally in the short and detailed descriptions. Keep the Korean manifest description identical to the Korean short description above. Do not add unrelated keyword lists, repetition, unsupported rankings or official-affiliation claims. [Listing guidance](https://developer.chrome.com/docs/webstore/best-listing).

Before release, confirm **Public** visibility and the intended available regions, including South Korea. Public, Unlisted and Private all require review; Unlisted does not provide the requested store discovery. After confirmed publication, verify the public listing while signed out and search its exact title, then relevant functional terms. Indexing may take several hours, and keyword placement does not guarantee a ranking. Record observed results separately from saved metadata or selected visibility. [Distribution settings](https://developer.chrome.com/docs/webstore/cws-dashboard-distribution), [search discovery](https://developer.chrome.com/docs/webstore/discovery).

Dashboard observation on 2026-10-06: **공개 (Public)** and **전체 지역 (all regions)** were already selected and were preserved. The item remains a never-published 0.3.1 draft with saved listing images and audited data-use certifications; submission is enabled but has not been requested. This is configuration evidence, not public search-result evidence.
