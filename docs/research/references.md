# 오픈소스·공식 자료 검토

최초 검토일: 2026-10-05 (Asia/Seoul). 별도 `/tmp/multi-ai-research`에서 원본 코드·README·라이선스를 확인했습니다. 인기나 README의 지원 목록을 현재 동작 보장으로 취급하지 않았습니다. 아래 통신 방식 비교는 2026-10-07에 현재 소스와 공식 문서로 추가 확인했습니다.

2026-10-12 추가 조사: 사용자는 탭 전환을 없애면서 **기존 웹 로그인·구독만 유지**하기로 했습니다. 이 조건에 맞춘 내부 웹 호출 후보, 인증 경계와 검증 순서는 [백그라운드 웹 전송 조사](background-web-transport.md)가 소유합니다. 아래 10월 7일의 DOM 유지 권고를 현재 사용자 편의성 결정으로 그대로 적용하지 않습니다.

Claude 조직 선택에는 [Claude Usage Badge 공급자 구현](https://github.com/dineshkruplani/Claude-Usage-Badge-Extension/blob/7b4262c9faff033a23791b41a483fa621a06701d/src/providers/claude-web.ts#L101-L104)과 [직접 조사 기록](https://github.com/dineshkruplani/Claude-Usage-Badge-Extension/blob/7b4262c9faff033a23791b41a483fa621a06701d/docs/PHASE1-FINDINGS.md#L78-L94)의 API 전용·`chat` capability 구분을 참고했습니다. 실험은 유일한 채팅 조직만 허용하며 첫 조직·플랜 추정 fallback과 계정 로깅은 채택하지 않습니다. 해당 공개 구현의 존재는 생성 POST 성공을 증명하지 않습니다.

## 비교와 채택 결정

| 프로젝트                                               | 확인한 스냅샷 / 라이선스                                                 | 검토 결과                                                                                                                                                                                  | 적용                                                                                                               |
| ------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| [ChatHub](https://github.com/chathub-dev/chathub)      | `a7a2bd6e12050d6a39fcaf30868bdfd7ccf78f22`, GPL-3.0                      | 병렬 비교 UI, 로컬 기록, 웹/API 어댑터. `chatgpt-webapp/client.ts`는 인증 세션에서 토큰을 얻어 비공개 backend API를 호출하고 Claude도 비공개 조직 API를 사용. 이전 Bard 도메인 코드도 존재 | UX와 어댑터 분리 아이디어 참고. GPL 소스 복사·링크 없음. 인증/비공개 API 구현은 채택하지 않음                      |
| [ChatALL](https://github.com/ai-shifu/ChatALL)         | `6d089c2ab72dde2ba1010cc1e910ceb766458546`, Apache-2.0                   | `Bot.js`의 공급자 추상화·동시 요청·로컬 저장. Electron/Vue 앱이며 `ClaudeAIBot.js`는 쿠키 기반 비공개 completion API 사용. README 스스로 웹 연동의 불안정성을 경고                         | 공급자별 모듈, 실패 시 계속 가능한 UX 참고. Electron·자격 증명 처리 코드는 재사용하지 않음                         |
| [LLM Council](https://github.com/karpathy/llm-council) | `92e1fccb1bdcf1bab7221aa9ed90f9dc72529131`, 이 체크아웃에서 LICENSE 없음 | `backend/council.py`: 독립 응답 → 익명 라벨 평가 → 의장 종합. OpenRouter 키와 유료 크레딧 필요. README는 유지보수하지 않는 실험이라고 명시                                                 | 3단계 아이디어를 독자 구현. 코드/프롬프트 복사 없음. 다수결과 사실 확인을 분리하고 사용자 근거·원래 탭 재질의 추가 |
| [WXT](https://github.com/wxt-dev/wxt)                  | `0d9c34b59e3f21840c471dec3fd4d9b0cb3b013a`, MIT                          | MV3, Vite, entrypoint 빌드와 ZIP, TypeScript 지원                                                                                                                                          | 실제 프레임워크로 사용. 검증된 버전은 `package-lock.json`에 고정                                                   |
| [promptfoo](https://github.com/promptfoo/promptfoo)    | `b56166bda60396ce06ff25a7f2386956d100ffa6`, MIT                          | 모델/프롬프트 평가와 공격 테스트에 유용하나 웹 로그인 어댑터를 제공하지 않음                                                                                                               | 이번의 브라우저 동작 검증에는 Playwright/Vitest 사용. API를 지원할 때 의미 품질 평가 도구로 재검토                 |
| [Playwright](https://github.com/microsoft/playwright)  | 설치된 `@playwright/test` 버전은 lockfile, Apache-2.0                    | 실제 브라우저, 확장 persistent context, tracing, fixture route 지원                                                                                                                        | 실제 Chromium UI/DOM 검증과 별도 확장 설치 테스트에 사용                                                           |

`무료 API`라고 표시된 프로젝트가 웹 구독 무료 쿼타를 공식적으로 제공한다는 뜻은 아닙니다. 인증 토큰 추출·비공개 API 역공학·계정 순환 구현을 재사용하면 연동 유지비와 보안 위험이 커집니다. 이번 구현은 로그인된 브라우저 탭의 사용자가 볼 수 있는 UI만 조작합니다. 이 선택도 서비스의 자동화 약관 준수를 보증하지 않습니다.

## 공식 설계 근거

Chrome 공식 사이트는 클라우드 프록시에서 차단되어, **GoogleChrome 소유의 공개 문서 저장소**에서 아래 문서 원문을 읽었습니다. 해당 저장소는 과거 문서 스냅샷이므로 최신 런타임의 근거는 실제 빌드/브라우저 테스트와 함께 판단해야 합니다. 검토 ref: `51dd7dd5d510ed85d86f5a91cb8fde50b62351c7`.

- [Content scripts / isolated worlds](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts) · [확인한 공식 원문](https://github.com/GoogleChrome/developer.chrome.com/blob/51dd7dd5d510ed85d86f5a91cb8fde50b62351c7/site/en/docs/extensions/mv3/content_scripts/index.md): 페이지 JavaScript와 분리된 ISOLATED world에서 실행. MAIN world 주입·postMessage 명령 통로 없음.
- [Permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions) · [공식 원문](https://github.com/GoogleChrome/developer.chrome.com/blob/51dd7dd5d510ed85d86f5a91cb8fde50b62351c7/site/en/docs/extensions/mv3/declare_permissions/index.md): 최소 권한, 사이트별 optional host permissions. `<all_urls>`, cookies, debugger, webRequest 권한 없음.
- [Security](https://developer.chrome.com/docs/extensions/develop/security-privacy/stay-secure) · [공식 원문](https://github.com/GoogleChrome/developer.chrome.com/blob/51dd7dd5d510ed85d86f5a91cb8fde50b62351c7/site/en/docs/extensions/mv3/security/index.md): 입력 검증, CSP, 최소 권한, 외부 연결 제한. Zod 메시지 검증, 발신자 URL 확인, 텍스트 렌더링.
- [Service worker lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle) · [공식 원문](https://github.com/GoogleChrome/developer.chrome.com/blob/51dd7dd5d510ed85d86f5a91cb8fde50b62351c7/site/en/docs/extensions/mv3/service_workers/service-worker-lifecycle/index.md): 30초 유휴 종료와 전역 변수 손실을 고려. 긴 AI 작업을 service worker 메모리에 맡기지 않고 열린 패널 + 세션 체크포인트로 처리. 복원 시 전송 중 요청은 중단 상태로 변경.
- [Side Panel API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel) · [공식 원문](https://github.com/GoogleChrome/developer.chrome.com/blob/51dd7dd5d510ed85d86f5a91cb8fde50b62351c7/site/en/docs/extensions/reference/sidePanel/index.md): Chrome side panel 사용, 브라우저 액션으로 열기.
- [OWASP LLM Prompt Injection Prevention](https://github.com/OWASP/CheatSheetSeries/blob/668ba7db3d0da5868b8a0305c259f7f6914a6ecd/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.md): 외부 답변을 신뢰하지 않기, 도구 권한 최소화, 사람 승인, HTML/이미지 유출 주의. 답변을 JSON 데이터로 구분하고 모델 출력에서 명령·브라우저 동작을 생성하지 않습니다. 프롬프트 분리만으로 injection이 해결된다고 주장하지 않습니다.

## 통신 방식의 안정성·안전성 비교 — 2026-10-07

범위는 로컬 `9c7893b`의 소스·권한·CSP 검사, 공개 프로젝트 코드/README, 현재 공식 문서입니다. 설치본·로그인 서비스는 이번 조사에서 조작하지 않았습니다. 이전 실제 완료는 [검증 기록](../testing/validation.md)의 역사적 증거이며 현재 성공률이나 성능 수치로 환산하지 않습니다. 내부 API와 공식 API의 실계정 비교 실행은 하지 않았고 자격 증명도 수집하지 않았습니다.

### 비교 판단

| 방식 | 안정성의 근거와 한계 | 보안·제품 적합성 | 판단 |
| --- | --- | --- | --- |
| 현재 DOM 어댑터 | 탭 활성화, 편집기 준비, 언어별 완료 표식과 업로드 UI에 의존. 과거 실제 실패 및 수정 기록이 있음 | 웹 로그인 비밀정보를 읽지 않고 기존 대화에 답변을 돌려보낼 수 있음. 자동화 약관 위험은 남음 | 기존 웹 구독·확장만 설치하는 흐름을 유지할 때의 현행 선택 |
| 웹 내부 API 직접 호출 | DOM 의존성을 줄일 가능성은 있지만 웹 인증·요청 형식·업로드 절차·응답 스트림의 공개 호환성 계약을 확인하지 못함 | 구현에 따라 웹 세션 토큰 처리 등 새로운 권한과 책임이 생김. 모든 구현이 쿠키 추출을 요구하는 것은 아니지만, 공식 사용 허가가 생기는 것도 아님 | 안정성·안전성 향상 근거가 부족해 공개 버전 전면 전환을 권장하지 않음 |
| 정식 개발자 API | 문서화된 버전·오류·완료 이벤트를 사용. 모델 폐기, 쿼타, 스트림 중단에는 여전히 대응해야 함 | 웹 로그인 비밀정보 없이 별도 인증 가능. 키 보호·비용·데이터 보관 설계 필요. 웹의 기존 대화·첨부·개인화가 자동 계승된다는 근거 없음 | 장기 운영의 우선 후보. 현재 제품 계약을 그대로 대체하지는 않음 |
| 공식 사용자 동의 기반 구독 연동 | OpenAI의 문서화된 경로가 있으나 프리뷰 제한과 계정별 가용성 확인 필요 | 웹 세션 추출 없이 동의된 권한으로 호출 가능. 기존 ChatGPT 대화 접근은 제공하지 않음. 현재 문서는 로컬 콜백·보호된 자격 증명 저장을 전제 | API 키 없는 UX의 조사 후보. Chrome 확장 단독 적용 또는 세 서비스 공통 지원은 미확인 |

이는 문서·구조에 근거한 판단이며 세 방식의 실측 장애율 순위가 아닙니다. 직접 호출 시 탭 전환·DOM 조회가 줄어들 수 있다는 점도 CPU·메모리 절감의 실측 증거는 아닙니다.

### 판단 근거

- 현재 `wxt.config.ts`는 네 권한과 세 optional origin만 요청하고 확장 페이지에 `connect-src 'none'`을 설정합니다. `provider-client.ts`는 ISOLATED bridge에 명령을 보내고, bridge는 발신자·문서·대화를 검증합니다. `automatic-workflow.ts`는 전송 의도를 저장한 뒤 보내고, `attachments.ts`는 선택한 원본의 크기·해시와 업로드 준비를 확인합니다. 어떤 통신 방식으로 바꾸더라도 이 보호와 전체 공유 맥락은 유지해야 합니다. 세부 소유 경계는 [아키텍처](../architecture/overview.md), [보안](../security/privacy.md)이 관리합니다.
- [ChatHub의 확인한 구현](https://github.com/chathub-dev/chathub/blob/a7a2bd6e12050d6a39fcaf30868bdfd7ccf78f22/src/app/bots/chatgpt-webapp/client.ts)은 웹 세션에서 받은 토큰으로 내부 API를 호출합니다. [ChatALL README](https://github.com/ai-shifu/ChatALL/blob/6d089c2ab72dde2ba1010cc1e910ceb766458546/README.md#note-on-web-connected-bot-reliability)는 웹 연동의 유지보수·안정성 문제를 명시하고 API 연결을 권장합니다. 공개 코드의 존재와 최신 실서비스 성공은 구별합니다.
- [OpenAI 호환성 정책](https://developers.openai.com/api/reference/overview#backwards-compatibility)과 [Anthropic 버전 정책](https://platform.claude.com/docs/en/api/versioning)은 문서화된 API의 변경 경계를 설명합니다. [Claude 스트리밍 문서](https://platform.claude.com/docs/en/build-with-claude/streaming)는 종료 이벤트와 스트림 중 오류를 명시합니다. HTTP 성공이나 텍스트 일부 수신만으로 완료 처리하거나, 결과가 불확실한 생성 요청을 자동 재시도해서는 안 됩니다.
- [Anthropic 소비자 약관](https://www.anthropic.com/legal/consumer-terms) §3.7은 API 키 또는 명시적 허가의 예외를 두며, 내부 웹 API를 호출하는 것 자체는 그 예외의 근거가 아닙니다. [OpenAI 소비자 약관](https://openai.com/policies/row-terms-of-use/)의 자동 데이터·출력 추출 제한도 DOM을 HTTP로 바꾼다는 이유로 해소되지 않습니다. 여기서 모든 Google 웹 자동화의 허용 여부까지 판정한 것은 아닙니다.
- API라는 이름만으로 개인정보 보호가 보장되지 않습니다. [Gemini API 키 보안](https://ai.google.dev/gemini-api/docs/api-key#security-and-secret-management)은 제품 클라이언트에 키를 내장하지 말라고 안내합니다. [Gemini API 약관](https://ai.google.dev/gemini-api/terms#unpaid-services)은 무료·유료 및 지역별 데이터 처리 조건을 구분합니다. 특히 한국 사용자의 민감한 기존 대화를 무료 API로 자동 전환하는 설계는 적절하지 않습니다. [Files API](https://ai.google.dev/gemini-api/docs/files#usage-information)도 별도 보관·삭제 수명을 가지므로 웹 첨부와 동일한 것으로 취급하지 않습니다.

### 공식 구독 연동에 관한 정정

일반 API 키의 과금은 ChatGPT 웹 구독과 분리되어 있지만, 이를 모든 공식 연동에 대한 절대 규칙으로 일반화해서는 안 됩니다. [Sign in with ChatGPT의 공식 OSS 안내](https://developers.openai.com/siwc/token-sharing-open-source)는 적격 오픈소스·로컬 앱이 사용자 동의로 ChatGPT 플랜을 사용하는 경로를 설명합니다. 유료·원격 호스팅 앱에는 별도 문의 경로를 안내하며, 기존 ChatGPT 대화와 계정 맥락에 대한 접근은 제공하지 않는다고 명시합니다.

[호출 문서](https://developers.openai.com/siwc/token-sharing-open-source/models-and-inference)는 공개 Responses API를 사용하며 웹 `backend-api`로 보내지 말라고 명시합니다. [등록 문서](https://developers.openai.com/siwc/token-sharing-open-source/sign-in)는 loopback 콜백과 PKCE를, [세션 보안 문서](https://developers.openai.com/siwc/token-sharing-open-source/profiles-and-sessions)는 보호된 로컬 저장과 브라우저 저장소에 토큰을 넣지 않는 경계를 설명합니다. 현재 확장만으로 이 계약을 충족한다고 확인한 것은 아닙니다. 기존 브라우저나 다른 앱의 자격 증명을 추출·재사용하는 대안은 채택하지 않습니다.

[프리뷰 제한](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations)에 따라 HTTP 요청은 필요한 이력을 매번 보내며, 영속 대화 연결과 Files 업로드 API 등은 지원되지 않습니다. 모델이 수용하는 텍스트·이미지·파일 입력과 Files 업로드 API의 지원 여부는 서로 다릅니다. 선택한 모든 원본의 지원·크기·완료를 검증하기 전에는 첨부 기능의 대체로 간주하지 않습니다.

### 권고와 검증 범위

현재 공개 후보를 내부 API 방식으로 교체하지 않습니다. 장기 후보는 공식 API 또는 적격 공식 구독 연동입니다. 원래 웹 대화로 돌아가는 기능을 유지한다면 대화 가져오기·최종 반환은 웹에서, 다른 모델의 검토는 공식 API에서 처리하는 혼합 구성을 평가할 수 있습니다. 이 경우에도 남은 웹 자동화의 약관·호환성 위험은 사라지지 않으며, 새로운 비용·데이터 수신자·인증 저장소를 명시적으로 설계해야 합니다. 이번 조사는 해당 구성을 구현하거나 승인한 것이 아닙니다.

차후 비교 실험은 동일한 합성 다중 턴과 원본 파일로 전송 중복, 잘못된 대화 연결, 첨부 누락, 부분 응답의 완료 오인, 중단·복원, 인증 만료·쿼타 오류를 검증해야 합니다. 전송 여부가 불명확하면 다른 통신 방식으로 자동 재전송하지 않습니다. 기존 대화 맥락·첨부 지원·원래 대화 반환이 다르면 같은 기능의 비교로 표시하지 않습니다.

이번 실행은 `npm test -- tests/unit/architecture/boundaries.test.ts tests/unit/attachments tests/unit/crosscheck tests/unit/privacy tests/unit/providers`의 단위 76개가 통과했습니다. 합성 브라우저·설치 확장·실계정 검사는 이번에 실행하지 않았습니다. 제품 코드·권한·설치본은 변경하지 않았고 조사 결과만 기록했습니다.

## 초기 조사 환경과 현재 출시 근거

2026-10-05의 초기 클라우드에서는 세 서비스의 실제 페이지/로그인에 접근하지 못했습니다. 이 역사적 환경 제한을 현재 로컬 상태로 옮기지 않습니다. 이후 실서비스 결과는 [검증 기록](../testing/validation.md), 확인 범위는 [실서비스 검증표](../testing/live-login.md), 실제 업로드·제출·공개 상태는 [출시 체크리스트](../release/release-checklist.md)가 관리합니다. 호환성·속도·정확도·심사 통과율을 근거 없이 수치화하지 않습니다.
