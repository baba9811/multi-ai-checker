# 오픈소스·공식 자료 검토

검토일: 2026-10-05 (Asia/Seoul). 별도 `/tmp/multi-ai-research`에서 원본 코드·README·라이선스를 확인했습니다. 인기나 README의 지원 목록을 현재 동작 보장으로 취급하지 않았습니다.

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

## 남은 조사·출시 조건

서비스의 최신 약관, 자동화 허용 범위, Chrome Web Store 공개/개인정보 규정은 배포 전에 현재 원문으로 재검토해야 합니다. 이번 환경에서는 세 서비스의 실제 페이지/로그인도 차단되어, 현재 DOM 선택자·전송 성공·검색 도구 실행을 실계정으로 확인하지 못했습니다. [실서비스 검증표](../testing/live-login.md)를 통과하기 전에는 정식 호환성이나 정확도 수치를 표시하지 않습니다.
