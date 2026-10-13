# 웹 구독을 유지하는 백그라운드 검토 방식

조사일: 2026-10-12–13 KST. 기준 `9c7893b`에서 분리한 `codex/background-web-transport` 작업이며 기존 미커밋 문서는 보존했습니다. 사용자는 **기존 ChatGPT·Claude·Gemini 웹 로그인과 구독만 사용**하는 조건을 선택했습니다. 별도 유료 개발자 API나 OpenRouter를 기본 연결로 바꾸지 않습니다.

**현재 Task 9의 렌더된 원본·TXT/PNG Claude collect/review 수용은 완료했습니다.** 최종 artifact/native panel에서 비민감 ChatGPT의 파일이 있는 실제 세 Q/A와 다시 선택한 두 원본을 공유해 같은 Claude 대화의 두 답변을 수집했고 원본/foreground를 유지했습니다. 이전 텍스트 두 Q/A 시험은 마지막 ownership 수정 전의 별도 증거입니다. 기본 DOM 전체 workflow는 그대로이고 원래 메인에 새 요청을 보내지 않습니다. 현재 공개 0.4.0과 이 로컬 실험의 소스는 구분합니다.

**이전 Task 8의 고정 합성 문맥 성공은 별도 기록입니다.** native 두 예상 답변·비활성 새 탭, 219 단위·전체 합성 130·설치 7은 당시 artifact의 결과입니다. 현재 실제 원본과 파일 수용을 증명하지 않습니다. 당시 artifact에는 인증값 읽기·개발자 API/서버·MAIN-world 제품 경로가 없었습니다. 현재 Gemini의 고정 MAIN 메타데이터 경로는 아래 Task 11에서 구분합니다.

**이전 Task 7 빌드의 성공은 별도 역사입니다.** 2026-10-12 실제 설치/native 패널의 23번째 시험에서 `CROSSCHECK_OK`, 기존 활성 탭 유지·새 탭 비활성을 확인했습니다. 이 한 요청 증거를 현재 두 요청 성공으로 쓰지 않습니다. 당시 artifact는 기존 웹 로그인·구독만 사용하고 인증값 읽기·개발자 API·서버·MAIN-world 제품 경로가 없었습니다. 공개 스토어 0.4.0의 상세 페이지·설치 제공·두 검색어 노출은 2026-10-13 별도 확인했으며 로컬 실험 브랜치는 미배포입니다. [출시 기록](../release/release-checklist.md).

## 현재 불편의 코드 근거

`src/infrastructure/chrome/provider-client.ts`의 `reveal()`은 창을 포커스하고 대상 탭을 활성화합니다. `preparePeer()`, `src/application/automatic-workflow.ts`의 원본 확인 및 각 작업 사전 검사, `src/presentation/shell/App.tsx`의 시작 동작에서 이를 호출합니다. 따라서 다른 탭을 보고 있어도 검토가 사용자의 작업 위치를 바꿉니다.

이 활성화는 이전 비활성 탭의 편집기·업로드 준비 실패에 대응해 추가됐습니다. 과거 증거는 [검증 기록](../testing/validation.md)이 소유합니다. 활성화 호출만 삭제하면 입력·업로드·완료 수집의 백그라운드 호환성이 검증되는 것은 아닙니다. 수동으로 대화를 보여주는 버튼의 `reveal()`까지 제거해서도 안 됩니다.

## 비교 결과

| 방식                            | 사용자 편의                                                  | 기존 웹 구독 조건                                                                  | 판단                                                                             |
| ------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 같은 서비스의 내부 웹 HTTP 호출 | 편집기 입력·버튼 클릭·DOM 완료 탐색과 탭 전환을 줄일 수 있음 | 기존 브라우저 세션으로 호출 가능한 경우 유지                                       | 우선 검증할 후보. 인증·파일·완료·대화 연결은 서비스별로 입증해야 함              |
| 공식 개발자 API / OpenRouter    | 백그라운드 요청, 문서화된 응답, 단일 연결 가능               | 별도 인증·과금·데이터 수신자가 생김. 일부 구독 크레딧 예외는 실제 계정별 확인 필요 | 사용자가 선택한 기본 조건과 달라 이번 기본 전환에서 제외                         |
| 공식 구독 연동 / 로컬 실행 앱   | 일부 서비스는 기존 플랜으로 공식 호출 가능                   | 추가 인증·설치가 필요하고 세 서비스 공통 경로가 아님                               | 향후 대안. 웹 로그인만으로 세 서비스가 연결된다고 안내하지 않음                  |
| 별도 검토 창에서 기존 DOM 실행  | 개인 탭과 검토 탭을 분리할 수 있음                           | 유지                                                                               | 과도기 실험만 가능. 최소화·가려짐·동결 때 성공은 미검증이며 DOM 방식 자체가 남음 |

Chrome은 콘텐츠 스크립트 요청이 주입된 페이지의 origin에서 실행됨을 설명하고, Fetch 표준은 같은 origin 요청에 브라우저 관리 인증정보를 포함할 수 있음을 규정합니다. 따라서 HTTP 호출마다 쿠키 값을 읽거나 내보내야 하는 것은 아닙니다. 이것은 **요청 가능한 브라우저 구조의 근거**이며 특정 서비스의 생성 요청이 허용·성공한다는 근거가 아닙니다. [Chrome 요청 경계](https://developer.chrome.com/docs/extensions/develop/concepts/network-requests), [Fetch 인증 모드](https://fetch.spec.whatwg.org/#concept-request-credentials-mode).

직접 sidepanel 요청은 탭 동결의 영향을 줄일 후보지만 현재 CSP의 `connect-src 'none'`과 다른 설계입니다. host permission이 있어도 실제 인증·쿠키 설정·서비스 요구사항을 확인해야 합니다. 특정 origin과 동작만 허용해야 하며 임의 URL fetch 프록시를 만들지 않습니다. [Chrome 쿠키 동작](https://developer.chrome.com/docs/extensions/develop/concepts/storage-and-cookies).

## 서비스별 증거와 미확인 사항

| 서비스  | 확인한 공개 구현                                                                                                                                                                                                                                                               | 아직 확인하지 못한 것                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| ChatGPT | ChatHub 공개 ref `a7a2bd6`는 `/api/auth/session`의 access token을 읽고 backend 호출·모델·파일 초기화에 Bearer 헤더를 사용. 브라우저 프록시도 인증 헤더를 확장 메시지로 전달. ChatGPTBox `df8ef92`도 Bearer를 사용. 조사한 생성 클라이언트의 자체 Sentinel 계산은 채택하지 않음 | 인증값을 페이지 밖으로 전달하지 않고 서비스 보호 검사를 우회하지 않는 현재 생성 경로, 파일·원래 대화 이어쓰기 |
| Claude  | 실제 렌더 원본 세 Q/A·TXT/PNG의 collect/review를 최종 native 설치에서 수집. 엄격한 stream/동일 대화 history·파일 receipt 검증, 원본/foreground 유지                                                                                                                            | 현재 지원 원본은 bounded UTF-8 TXT/PNG. 기존 메인 HTTP 이어쓰기/최종 반환·다른 공급자 전환은 미검증           |
| Gemini  | 공개 웹 클라이언트는 StreamGenerate/batchexecute, 페이지별 요청 값과 별도 업로드를 사용. Gemini-API `1ad0d4a`는 최근 유지보수된 Python 구현                                                                                                                                    | 쿠키 추출 없이 현재 브라우저 문맥에서 작동하는지, 페이지 요청 값·첨부·RPC 완료를 안전하게 확인할 수 있는지    |

근거: [ChatHub ChatGPT client](https://github.com/chathub-dev/chathub/blob/a7a2bd6e12050d6a39fcaf30868bdfd7ccf78f22/src/app/bots/chatgpt-webapp/client.ts), [ChatHub proxy](https://github.com/chathub-dev/chathub/blob/a7a2bd6e12050d6a39fcaf30868bdfd7ccf78f22/src/services/proxy-fetch.ts), [ChatGPTBox](https://github.com/ChatGPTBox-dev/chatGPTBox/blob/df8ef92c7495c5dde1f256216d1608e87d099cf6/src/services/apis/chatgpt-web.mjs), [Claude 사용량 확장 조사](https://github.com/dineshkruplani/Claude-Usage-Badge-Extension/blob/main/docs/PHASE1-FINDINGS.md), [Gemini-API](https://github.com/HanaokaYuzu/Gemini-API/blob/1ad0d4a93e505e77c79769d78ef2997641f973c8/README.md).

ChatHub 공개 소스에는 Claude 2.1과 예전 Bard 도메인도 남아 있어 현재 호환성의 근거로 쓸 수 없습니다. Gemini-API의 쿠키 복사·브라우저 쿠키 추출·캐시 구현을 가져오지 않습니다. ChatALL도 웹 연동의 잦은 고장을 경고하며, Electron의 web security/SameSite 변경은 이 확장에 채택하지 않습니다. 라이선스가 다른 구현을 복사하지 않고 동작 구조만 참고합니다. [ChatALL 경고](https://github.com/ai-shifu/ChatALL#note-on-web-connected-bot-reliability).

## 현재 Task 9: 승인된 원본의 Claude 검토

명시적 **Claude 백그라운드 검토**는 불러온 비-Claude 원본과 선택한 UTF-8 TXT/PNG를 기존 collect·economy review 프롬프트로 공유합니다. 원래 답변을 재사용하고 두 프롬프트에 전체 캡처 scope와 full approved manifest를 유지합니다. `claude-peer` intent는 source+Claude 두 참여자·collect/review만 허용하며 main synthesis에 진입하지 않습니다. 새 비활성 소유 홈에서 두 답변을 패널에 반환하고 원래 메인에는 전송하지 않습니다.

TXT 각 64 KiB 이하·BOM/NUL/변환 없는 UTF-8, PNG 각 축 4096 이하/native decode·현재 이미지 capability, 기존 10개/총 20 MiB와 바이트/해시를 확인한 원본만 허용합니다. TXT는 최초 생성의 inline attachment이고 PNG는 checked original multipart를 한 번 업로드해 성공 receipt를 기다립니다. 최초 human history의 exact file membership 뒤에만 전달 완료로 인정하고 후속 review에서도 전체 manifest·같은 first pair/receipt가 유지돼야 합니다. unsupported contract·추가/누락/중복/변경된 원본은 자동 fallback 없이 거부합니다.

`claude/session.ts`가 기존 진단과 모델/request/SSE/authoritative history 검사를 공유하고 `peer.ts`/`originals.ts`가 bounded stages와 원본을 소유합니다. server conversation/message/model/receipt refs는 페이지 closure에만 둡니다. binding/snapshot의 `threadId`는 extension-local UUID이며 reconnect·UI equality·delivery receipt에 보존합니다. ordinary unbound Claude는 예약 peer를 재사용하지 않고 fresh home을 만들며 명시적 정상 saved binding은 정확히 유지합니다. 소유 session loss·문서/URL/모델/원본 변경·cancel·uncertain send에는 대체 할당/DOM fallback/retry가 없습니다.

### 파일 protocol의 증거

credential-omitted 공개 JS는 작은 TXT의 `{file_name,file_type,file_size,extracted_content,origin:'user_upload',kind:'file'}`, PNG의 같은-origin `/api/${org}/upload` multipart `file`, 완료 receipt의 UUID-only `files` projection을 확인했습니다. [upload handler](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-m-2-CMVAQFi7.js), [enum/UUID projection](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-l-p-m-1--E6c7YGn.js), [completion body](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-1-DT-Mq-A-.js), [최종 serialization](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-0-Dsui6SsB.js).

이 outbound 형식은 saved-history schema를 증명하지 않습니다. 별도 소유한 합성 TXT/PNG를 일반 서비스 UI로 처리한 정제 history가 first-human TXT의 생성 identity/이름/타입/크기/내용과 PNG의 성공 image·`uuid === file_uuid`·원본 이름 및 관찰된 metadata를 확인했습니다. draft restoration validator, preview URL, 파일명이나 답변 인식을 history 검증으로 대신하지 않습니다. volatile URL/timestamp와 비동기 size 필드 등장 자체는 first-pair snapshot에서 제외하지만 나타난 size/dimension의 모순은 계속 거부합니다.

증명은 local checked bytes→awaited successful receipt→exact saved-history refs이며 서버 바이트 SHA-256을 독립 확인하지 않습니다. 선택 범위 안의 JSON escaping을 감당하도록 peer history GET만 최대 8 MiB이며 진단/account/bootstrap/upload JSON과 SSE는 기존 1 MiB를 유지합니다. 전체 approved prompts/answers의 기존 100,000/14,000 문자 한도도 유지합니다. 모든 타입·크기·hash 검사는 업로드/생성 전이며 TXT conversion·PNG resizing·alternate upload·silent omission은 없습니다.

### Task 9 최종 checkpoint — 2026-10-13

최종 ownership 수정 후 304 단위·타입·빌드, 전체 합성132개/2.8분·installed-origin9개/20.0초를 통과했습니다. 독립 whole-change review가 발견한 reconnect P2는 snapshot/attach/inspect·UI equality의 red 회귀와 수정 재리뷰로 해결했습니다. fixture의 pregrant·allocation shim·일반 extension-origin panel은 실제 native 수용과 구분합니다. 최종 native 파일 시험은 실제 세 Q/A·TXT/PNG의 두 Claude 답변을 엄격한 완료/history 검사 뒤 수집했습니다. [최신 검증 기록](../testing/validation.md).

두 native 시험 모두 실제 reloaded production panel에서 수행했습니다. source/foreground 유지와 peer 홈 비활성을 확인했고 수동 provider POST/injection은 없었습니다. 최종 파일 시험 뒤 소유한 Claude 홈·연구 탭만 정리하고 원래 source/완료 panel을 유지했으며 REPL 종료와 native helper 부재를 새로 확인했습니다. GET→POST는 원자적이지 않아 final history가 경합을 탐지해도 이미 수락된 요청/업로드를 되돌리지 못합니다. 원래 메인 새 요청·HTTP append·full migration·다른 공급자 background transport는 미검증이며 이 로컬 실험은 스토어에 업로드/제출하지 않았습니다.

## 다음 Gemini 검증의 범위 — 2026-10-13 공개 소스 조사

Gemini의 기존 DOM 회귀 통과는 background 생성의 증거가 아닙니다. 공개 [Gemini-API generation 구현](https://github.com/HanaokaYuzu/Gemini-API/blob/1ad0d4a93e505e77c79769d78ef2997641f973c8/src/gemini_webapi/client.py#L1468)은 nested JSON/form 요청과 framed JSON 응답을 사용하며 Claude의 SSE·UUID/parent 검증을 그대로 재사용할 수 없습니다. 계정 RPC의 모델 후보와 실제 선택 UI의 고유 대응, 정확한 conversation/response/candidate 및 raw history 완료 계약을 먼저 확인해야 합니다. 공개 Python의 cookie 추출·rotation·TLS impersonation·proxy·자동 retry/recovery는 채택하지 않습니다. 필요한 인증 처리는 허가된 product provider-page 메모리에만 한정하고 개발 도구로 실제 값을 읽거나 돌려주지 않습니다.

[파일 업로드 구현](https://github.com/HanaokaYuzu/Gemini-API/blob/1ad0d4a93e505e77c79769d78ef2997641f973c8/src/gemini_webapi/utils/upload_file.py#L73)은 다른 origin의 Google upload endpoint를 사용합니다. 현재 browser CORS·헤더·receipt·saved-file identity는 미검증이며 이를 맞추려고 worker token proxy나 광범위한 권한을 추가하지 않습니다. [Google의 파일 안내](https://support.google.com/gemini/answer/14903178?hl=en)는 계정별 파일 지원을 설명하지만 내부 전송 계약은 제공하지 않습니다. 이 독립 공개 클라이언트는 공식 지원 계약이 아니며 현재 계정의 사용 가능 모델·구독·쿼타를 증명하지 않습니다.

다음 최소 milestone은 실제 public web client 계약을 확인한 뒤 새 비활성 Gemini 탭에서 고정된 비민감 텍스트 한 요청을 보내는 별도 진단입니다. 의도 선저장, 모델/페이지/중단 가드, bounded framing과 정확한 단일 대화 readback, credential-free RPC/storage/diagnostics, 재전송 없음부터 unit → 합성 → 설치 → 실제 native로 각각 입증합니다. 그 뒤 같은 대화 후속 요청과 원본 파일을 별도로 검증합니다. 이 조사에서는 제품 구현·로그인된 Gemini 요청·파일 업로드를 실행하지 않았습니다.

## 이전 고정 Claude 시험의 범위

연결의 접힌 진단에서 기존 **백그라운드 연결 시험**은 `Reply with CROSSCHECK_OK only.` 한 요청을 보냅니다. 선택적 **문맥·후속 응답 시험**은 고정 합성 질문·답변 두 쌍을 첫 요청으로 전달한 뒤 같은 새 테스트 대화에서 한 번의 후속 요청을 합니다. 정상 완료는 정확히 두 POST입니다. 두 동작은 비활성 새 Claude 홈 탭을 만들고 `reveal()`을 호출하지 않으며 브라우저가 같은-origin 요청에 쿠키를 부착합니다. 한 요청의 native 23은 이전 빌드 증거이고 현재 두 요청은 별도 첫 native 시험에서 완료까지 확인했습니다.

Task 6은 닫힌 소유 버튼의 첫 표시 텍스트에서 모델명만 읽고 별도 effort 표시를 합치지 않습니다. `app_start`의 유일한 chat 선택 상태·그 모델의 활성 config 표시명·유효하고 중복 없는 available-model ID 목록을 정확히 대응시킨 뒤 POST 직전 UI 표시를 다시 확인합니다. 고정 시험은 메뉴 열기·닫기를 사용하지 않습니다. 누락·중복·비활성 사유·표시 불일치·UI 변경을 거부하고 응답 크기 제한을 유지합니다. 요청 키는 공급자 페이지 메모리에만 있으며 일반 모델 목록 RPC에 넣지 않습니다. 목록 tier를 계정 권한으로 해석하지 않습니다. 일반 모델 메뉴의 값 사전 캡처와 닫힘 확인은 별도로 유지합니다.

- 요청/완료 검사는 `src/infrastructure/providers/claude/probe.ts`, 의도 저장·비활성 탭·취소는 `src/infrastructure/chrome/claude-probe.ts`와 `provider-client.ts`가 소유합니다. 좁은 시작·조회·중단 명령은 기존 bridge의 정확한 확장 발신자·문서·URL 검사로 연결합니다. UI는 주입된 Platform 포트만 사용합니다.
- 세션에는 `{ id, status, kind? }`만 저장합니다. 선택적 `kind: 'context'`는 시작 전에 공개한 두 요청 계획이며 답변·조직·모델·대화·메시지 backend 참조·인증정보는 저장하지 않습니다. 열린 패널에만 검증된 텍스트 답변을 전달하며 복원한 진행 상태는 불확실로 표시하고 자동 재개하지 않습니다.
- 각 GET/POST 직전에 시작 시점의 정확한 페이지 주소를 확인합니다. 저장 실패·기존 초안·생성 중·대화 변경·중단·조회 단절이면 멈추며 재시도나 DOM 대체 전송을 하지 않습니다.
- 서버 assistant/parent UUID는 유효하고 서로 다른 임시값이며 텍스트 블록 종료·`end_turn`·`message_stop`을 확인합니다. 정확한 새 대화 GET의 고정 human 문장·스트림 ID/답변·sender/parent/leaf·요청 모델·authoritative text-only content·빈 첨부·잘림 없음·정상 종료를 검증합니다. 한 요청은 두 메시지, 문맥 진단 최종 완료는 네 메시지가 필요합니다. legacy `text`는 빈 값 또는 같은 content만 허용하고 명시된 stream model 불일치를 거부합니다. HTTP 200·EOF·일부 답변·UUID 형식만으로 완료를 인정하지 않습니다. 크기와 내용을 제한하며 오류 원문 대신 고정 단계 사유만 내보냅니다.

`chat` capability가 있는 조직이 정확히 하나이고 현재 모델 메타데이터가 명확할 때만 진행합니다. API 전용 조직은 선택하지 않으며 채팅 조직이 없거나 둘 이상이면 멈춥니다. 생각/도구 블록과 확인하지 않은 이벤트 형식은 실패로 처리하므로 계정·모델에 따라 작동하지 않을 수 있습니다. 첨부 목록은 비어 있고 실제 대화 가져오기·임의 후속 생성·원래 메인 반환은 지원하지 않습니다. 후속 요청은 아래의 고정 합성 진단에만 있으며 새 테스트 대화는 Claude에 남을 수 있습니다.

Claude 요청 구조는 [OmniRoute payload](https://github.com/diegosouzapw/OmniRoute/blob/7f3cbb046b3706bf0bbc047b7eaa0cbada8d9e50/open-sse/executors/claude-web/payload.ts), [stream](https://github.com/diegosouzapw/OmniRoute/blob/7f3cbb046b3706bf0bbc047b7eaa0cbada8d9e50/open-sse/executors/claude-web/stream.ts), 모델 메타데이터는 [AIFuel](https://github.com/robertogogoni/aifuel/blob/de119ddd68e29adc23ad0d9abbd9ad14f087efb6/internal/installer/chrome-extension/background.js#L63-L97), UUID 관계는 [Claude2api 응답 정의](https://github.com/aurora-develop/Claude2api/blob/6a9ea135f41626cd335950c97ba290f42fa7dd64/models/response.go#L242-L289)를 참고했습니다. 이들의 서버 쿠키 저장·TLS 지문·보호 검사 해결 방식은 가져오지 않았습니다. 공개 구현을 읽었다는 사실이 현재 서비스 호환성이나 사용 허가를 증명하지 않습니다.

조직의 API 전용·채팅 구분은 [Claude Usage Badge의 공급자 구현](https://github.com/dineshkruplani/Claude-Usage-Badge-Extension/blob/7b4262c9faff033a23791b41a483fa621a06701d/src/providers/claude-web.ts#L101-L104)과 [직접 조사 기록](https://github.com/dineshkruplani/Claude-Usage-Badge-Extension/blob/7b4262c9faff033a23791b41a483fa621a06701d/docs/PHASE1-FINDINGS.md#L78-L94)을 참고했습니다. `chat` capability의 유일성만 사용하며 첫 조직 선택·플랜 추정·계정 로깅은 채택하지 않습니다.

### 이전 Task 8의 검증 기록 — 2026-10-13

| 증거           | 확인한 범위                                                                                                        | 상태                                                                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 단위·타입·빌드 | `npm run check`, 단위 219개·타입·빌드 통과, 15:53 KST                                                              | 실제 두 요청 성공과 별도                                                                                                                                                              |
| 합성 브라우저  | 관련 14개 통과, 12.8초. 전체 130개 통과, 3.1분·exit 0                                                              | 2026-10-13 live 뒤 같은 제품 소스로 재빌드. 이전 전체 126개와 구분                                                                                                                    |
| 설치 확장      | fixture 수정 후 7개 통과, 최종 11.5초                                                                              | 주입/RPC/readback/session/UI/origin 검사. test-only `tabs.create`가 등록한 합성 탭을 반환하며 Claude 권한을 미리 허용. 실제 비활성 생성·권한 prompt·native side panel은 입증하지 않음 |
| 실제 로그인    | 첫 native 문맥 시험의 시작·진행·완료, 두 예상 답변·같은 새 대화/네 메시지 검증·기존 활성 탭 유지·새 탭 비활성 확인 | 고정 합성 두 Q/A 쌍·그 대화 후속 한 번만. 원본 가져오기·파일·다른 공급자·메인 이어쓰기 미검증                                                                                         |
| 리뷰·정리      | production 및 test-only 재리뷰에 중요한 결함 없음. 소유 탭·REPL·native helper 종료를 새 관찰로 확인                | 개인 사용자 탭은 변경하지 않음                                                                                                                                                        |

초기 설치 fixture의 새 탭 탐색은 Playwright route를 벗어나 Cloudflare challenge에 도달했습니다. red trace/산출물은 Git 제외 로컬 증거로 보존했고 보안 검사를 우회하지 않았습니다. 테스트는 미리 연 합성 탭만 반환하도록 고쳤으며 이 shim은 생산 코드에 없습니다. 실제 native 탭 생성·패널 완료는 이 fixture와 별도로 위의 live 시험에서 확인했습니다.

실제 `.output/chrome-mv3` 설치를 새로고침하고 새 진단 버튼을 확인한 뒤 첫 native 문맥 시험을 시작했습니다. 화면은 pending에서 완료로 바뀌어 `First reply: CROSSCHECK_CONTEXT_OK/47`과 `Follow-up reply: 47/CROSSCHECK_CONTEXT_OK`를 표시했습니다. 확장 관리 탭은 계속 선택됐고 실제 Chrome 새 Claude 홈 탭은 비활성이었습니다. 완료 뒤 소유한 홈 탭만 주소를 확인하고 닫았으며 새 native 관찰은 관리 탭 선택·완료 답변 유지·새 Claude 행 부재를 확인했습니다. 이전 Aside REPL은 사용자 입력 전환으로 끝났고 남은 REPL 프로세스가 없음을 확인했습니다. 조사 agent 탭은 native 시험 전에 이미 없어졌으며 허가된 native helper도 종료하고 정확한 프로세스 조건으로 부재를 확인했습니다. 관련 없는 개인 탭은 건드리지 않았고 새 업로드·심사 제출도 없습니다.

live 이후 같은 제품 소스로 실행한 `npm run test:e2e`는 exit 0·130개·3.1분으로 통과했습니다. 제품 소스는 live 이후 변경하지 않았으며 재빌드의 bridge 표시 크기와 패널 청크 이름도 설치 전 빌드와 같았습니다. 별도 바이트 해시 비교로 이 결과를 확대하지 않습니다. 이 전체 합성 회귀는 실제 로그인 시험을 대신하지 않으며 고정 진단의 성공을 기존 원본·파일·다른 공급자·메인 반환으로 확대하지 않습니다.

### 이전 Task 7의 검증 기록 — 2026-10-12

| 증거                  | 확인한 범위                                                                                                                                                                              | 상태                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 단위·타입·빌드        | 최종 Task 7의 단위 190개·타입·빌드 통과, 2026-10-12 17:33 KST                                                                                                                            | 실제 로그인 결과와 별도                                                                                     |
| 합성 브라우저         | 같은 최신 소스에서 관련 20개와 최종 전체 126개 통과                                                                                                                                      | 전체 검사는 `npm run test:e2e`, 5.6분. 모두 합성 응답이며 실제 로그인 결과와 별도                           |
| 설치 확장             | 최신 5개 통과, 17:35 KST. 메뉴 20 ms 지연 cleanup 전 값 캡처·포커스 유지 포함                                                                                                            | 해당 메뉴 회귀는 test-only 복사 manifest로 Claude를 미리 허용함. 실제 권한 prompt·실서비스 성공 근거는 아님 |
| 실제 로그인 읽기      | 앞선 HTTP 200·679,681 bytes·채팅 조직 1개·모델 ID 15개·UI 키 대응 1개. 후속 확인은 chat state/config/선택 행 각 1개·UI 이름 일치·main section·disabled reason 없음·available ID 대응 1개 | 원문·계정/조직/모델 식별자·인증값은 출력하지 않음                                                           |
| 실제 로그인 생성·수집 | 23번째 exact production 설치/native 패널에서 시작·진행·완료 `CROSSCHECK_OK`. 기존 활성 탭 유지·새 Claude 탭 비활성 확인                                                                  | 단일 고정 텍스트. 전체 세 서비스·파일·최종 반환으로 확대하지 않음                                           |
| 독립 코드 리뷰        | 최종 production·회귀 source 중요한 결함 없음. detached-menu P2는 회귀로 재현하고 수정                                                                                                    | 실계정 결과와 별도                                                                                          |

독립 리뷰의 주소 변경 경합과 로딩 중 중단 지연은 각각 요청 직전 URL 재확인·준비 단계 AbortSignal로 수정하고 최소 단위 회귀를 추가했습니다. 이 수정 뒤의 합성·설치·실계정 결과를 앞선 전체 브라우저 결과와 합쳐 표시하지 않습니다.

첫 실계정 시험 이후 모델 표시명에 effort 설명이 붙은 UI 형태를 내용 없는 메타데이터로 확인했습니다. 합성 회귀에서 현재 모델 대응 실패를 재현하고 선택된 메뉴 항목을 읽도록 수정했습니다. 이후 모델명 wrapper의 `textContent`가 설명·아이콘 텍스트를 합치는 결함을 재현하고 표시 첫 줄을 읽도록 최소 수정했습니다. 즉시·지연 메뉴 회귀 2개가 통과했습니다. 네이티브 빈 화면과 DOM 관찰의 차이를 생성 성공이나 미전송으로 해석하지 않았으며 원문 없는 고정 실패 사유만 전달합니다.

세번째 실제 시험은 계정 조직 선택 단계에서 POST 전에 멈췄습니다. 안전한 GET은 식별자 없이 개수와 구조·capability 여부만 반환했고 API 전용 조직과 채팅 조직이 함께 있는 경우를 확인했습니다. 전체 조직 수가 하나여야 한다는 초기 조건을 두 조직의 합성 회귀로 재현한 뒤 유일한 채팅 capability 기준으로 수정했습니다. 상세 원인과 회귀 증거는 [검증 교훈](../development/verification-lessons.md)이 소유합니다.

### 구 catalog 실패와 bootstrap 대응의 후속 변경

앞선 다섯번째 네이티브 시험은 모델·조직 선택을 통과하고 구 계정 모델 catalog 단계에서 POST 전에 멈췄습니다. 같은-origin 읽기 전용 GET은 HTTP 200이지만 `claude_ai_bootstrap_models_config`가 명시적으로 null임을 내용 없는 상태값으로 확인했습니다. 당시 검증 가능한 백엔드 모델 참조가 없으므로 요청하지 않았습니다.

[AIFuel의 확인한 구현](https://github.com/robertogogoni/aifuel/blob/de119ddd68e29adc23ad0d9abbd9ad14f087efb6/internal/installer/chrome-extension/background.js#L63-L97)도 이 목록의 null을 빈 목록으로 취급합니다. [OmniRoute의 공개 payload](https://github.com/diegosouzapw/OmniRoute/blob/7f3cbb046b3706bf0bbc047b7eaa0cbada8d9e50/open-sse/executors/claude-web/payload.ts)에 있는 정적 기본 모델은 현재 계정의 가용성이나 실제 UI 선택을 증명하지 않으므로 대체하지 않습니다. 필요한 것은 계정·UI·실제 요청 모델의 검증 가능한 대응 경로이며 로그인 성공만으로 이를 대신할 수 없습니다.

[Claude2api의 pinned 선언](https://github.com/aurora-develop/Claude2api/blob/6a9ea135f41626cd335950c97ba290f42fa7dd64/claude/models.go#L22)은 `edge-api/bootstrap` 경로를 찾는 단서로만 사용했습니다. 실제 읽기 전용 확인에서는 응답의 `claude_ai_available_models.models[].model_id` 목록과 화면의 유일하게 선택된 활성 항목의 `data-model-id`가 유일하게 일치했습니다. 이 프로젝트의 쿠키/TLS 처리 방식은 채택하지 않았고 공개 소스의 선언을 현재 서비스 계약이나 생성 성공의 증거로 쓰지 않습니다.

Task 4는 이 label/key 값을 메뉴 cleanup 전에 캡처하고 GET 후 UI를 다시 읽는 방식이었습니다. 후속 리뷰에서는 메뉴를 닫은 뒤 DOM 참조를 읽어 설명·아이콘이 다시 모델명에 섞이는 P2를 재현했으며, 값을 먼저 캡처하는 최소 수정으로 회귀가 통과했습니다. 누락·잘못된 UI 키·중복 bootstrap ID·GET 중 선택 변경·탐색·중단은 POST를 차단했습니다. 일반 모델 RPC에 백엔드 키가 새지 않는 합성 검사도 통과했습니다. 일반 메뉴의 사전 값 캡처·닫힘 확인은 유지하되 고정 시험은 Task 6으로 바꿉니다.

비동기 닫힘 회귀에서는 첫 읽기는 성공해도 메뉴가 열린 채 남아 두번째 읽기가 실패했습니다. Escape 전송을 닫힘 완료로 간주한 것이 원인이며, 선택 항목이 사라지고 expanded 상태도 해제된 것을 제한 시간 안에 확인한 뒤 반환하도록 수정했습니다. 이 수정 후 단위 129개와 관련 합성 브라우저 14개가 통과했습니다.

합성 fixture의 활성화 handler가 실제와 다른 동작을 허용한 공백을 확인했습니다. 키보드-only fixture 수정 후 단위 129개·타입·빌드와 관련 합성 브라우저 17개가 통과했지만 설치 probe는 메뉴 단계에서 POST 전에 멈췄습니다. 초기 관찰에서는 페이지 Enter와 열림이 함께 보였으나, 후속 조사에서 synthetic Enter가 native button의 기본 click을 일으키지 않음을 확인해 그 인과 해석을 정정했습니다. Escape 닫힘이 비동기라는 관찰은 유지합니다.

일반 설치 확장의 모델 목록도 준비된 활성 페이지에서 실패해 로딩·비활성 상태만의 문제로 해석하지 않았습니다. 공개 클라이언트의 이벤트 wrapper는 Base UI 관례와 일치했으며, 이것만으로 메뉴 전체 구현이나 Radix 활성화 방식까지 단정하지 않습니다. untouched home의 deferred MAIN `button.click()`은 메뉴를 열었지만 설치 ISOLATED-click probe는 여전히 메뉴 단계에서 실패했습니다. Task 5의 MAIN 활성화 제품 파일·명령·포트는 폐기하고 제거했습니다. 관찰된 차이만으로 실행 문맥 이동이 원인을 해결한다고 주장하지 않습니다. [관찰한 wrapper/click 소스](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/vendor-frame-DNQ-FS3I.js), [Base UI trigger](https://github.com/mui/base-ui/blob/a2dc320c88c90eaa8160e536ec22ddd166576af2/packages/react/src/menu/trigger/MenuTrigger.tsx), [native button 처리](https://github.com/mui/base-ui/blob/a2dc320c88c90eaa8160e536ec22ddd166576af2/packages/react/src/internals/use-button/useButton.ts).

### Task 6: 메뉴 없이 현재 선택 상태 읽기

공개 웹 클라이언트는 `model_selector_state`에서 chat의 `model`을 읽고 chat config의 해당 모델 행에서 표시명을 대응시킵니다. 비활성 사유가 없는 상태와 legacy/deprecated가 아닌 행을 구별하며, 별도 context model 또는 hub default가 선택에 영향을 줄 수 있으므로 저장 상태만으로 UI 선택을 단정하지 않습니다. 현재 trigger는 모델 행의 이름을 먼저 표시하고 fast/effort/mode 설명을 별도 span에 표시합니다. 이 구조를 근거로 닫힌 소유 버튼의 첫 모델 표시를 읽고 계정 상태와 정확히 일치하는지를 검증하는 작은 경로를 구현했습니다. [상태/config 대응](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-1-DT-Mq-A-.js), [모델 이름·비활성·default 처리](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-0-Dsui6SsB.js), [trigger 표시 구조](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-7-B-kXHUOv.js).

실제 안전한 GET은 chat state·chat config·선택 행 각각 1개, config 이름과 UI 이름의 일치, main section, disabled reason 없음, available-model ID의 유일한 대응을 상태값으로만 확인했습니다. 고정 시험은 popup을 열거나 닫지 않고 POST 직전 UI 표시를 다시 확인합니다. 이 변경 뒤 단위 152개·타입·빌드·합성 20개·설치 5개가 통과했고 독립 리뷰에서 중요한 문제가 없었습니다. 20번째 실제 시도에서 생성까지 진행됐으나 패널 수집은 실패했습니다. 공개 asset은 조사 시점 소스이며 문서화된 호환성 계약은 아닙니다.

### Task 7: 요청 UUID와 서버 메시지 대응

20번째 native 시험은 POST 뒤 응답 수집에서 실패했고, 최근 자체 테스트 대화 중 고정 문장으로 유일하게 확인한 대화의 안전한 GET은 HTTP 200·두 메시지·assistant `CROSSCHECK_OK`를 확인했습니다. 이 과거 조회는 원래 POST UUID와 제품 경로의 정확한 대응까지 입증한 것은 아닙니다. 21번째는 `response-binding`, 22번째는 `response-ids` 진단으로 요청한 human/assistant ID와 두 서버 ID가 모두 다름을 확인했습니다. 공개 Qv 클라이언트도 human ID가 요청과 다를 때 `clientUuidHonored: false`를 처리합니다. 클라이언트 생성 ID는 전송 의도이며 서버의 확정 identity가 아닙니다. [Qv 응답 대응](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-1-DT-Mq-A-.js).

Task 7은 서로 다른 유효한 SSE ID를 임시값으로 받아들이고 기존 완료 검사를 유지합니다. 이후 새로 생성한 정확한 대화 UUID를 크기가 제한된 GET으로 읽어, 고정 human 문장·두 고유 메시지의 sender와 스트림 ID·정확한 답변·parent/leaf·요청 모델·빈 첨부/files/sync_sources·`truncated: false`·`end_turn`을 모두 확인한 뒤 패널 답변을 반환합니다. content 배열의 text-only 값이 authoritative이며 고정 문장/완료 스트림과 정확히 같아야 합니다. legacy `text`는 빈 문자열 또는 같은 값만 허용하고 명시된 stream model이 다르면 거부합니다. 독립 readback이 요청과 응답을 묶는 추가 경계이며 UUID 형식이나 답변이 그럴듯하다는 이유로 검증을 약화하지 않습니다. 추가 POST·자동 재시도는 없습니다. [실제 클라이언트 GET 구성](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-l-p-m-3-B9pUKnbr.js).

같은 소유 테스트 대화에서 readback 형태를 안전하게 확인했으며 원문·ID·인증값은 출력하지 않았습니다. 최종 단위 190개·타입·빌드, 같은 빌드의 관련 합성 20개·설치 5개를 순서대로 통과한 뒤 exact production 경로를 새로고침했습니다. 23번째 actual native 패널이 `CROSSCHECK_OK` 완료를 표시했고 제품 코드의 정확한 새 대화 대응, 기존 확장 관리 탭 선택과 새 Claude 탭 비활성을 확인했습니다. 앞선 20–22번째 실패는 수정 전 기록이며 현재 차단 사항이 아닙니다. 최종 production·회귀 source의 독립 리뷰에는 중요한 문제가 없었습니다.

후속 전체 브라우저 회귀도 동일 소스에서 재빌드한 뒤 126개 모두 통과했습니다. 이번 변경 파일의 포맷·diff 공백 검사는 통과했으며, 전체 포맷에는 변경하지 않은 기존 문서 4개와 보존한 로컬 실패 증거의 형식 경고가 남습니다.

개발 도구에서는 읽기 전용 요청과 UI 동작만 확인했고 인증값 읽기나 수동 생성 POST는 하지 않았습니다. 실제 전송 시도는 설치 확장의 고정 시험 버튼으로만 수행했고 이번에는 패널의 완결 답변까지 확인했습니다.

Task 7 당시 작업용 Claude 시험 탭을 닫고 관련 없는 탭·확장 관리 탭 선택·패널 완료 표시를 보존했습니다. REPL 정상 종료와 허가된 helper 종료·프로세스 부재도 확인했습니다. 이 과거 정리 기록은 현재 Task 8 작업 종료를 뜻하지 않습니다. 당시 스토어 조회·새 업로드·새 심사 제출은 없었습니다.

### Task 8: 고정 합성 문맥과 같은 대화의 후속 응답

첫 고정 질문은 합성 질문·답변 두 쌍을 전달해 `CROSSCHECK_CONTEXT_OK/47`을 요구합니다. 첫 답변의 정확한 예상값, 완료 스트림과 정확한 새 대화의 두 메시지 readback을 모두 확인해야 합니다. 다음 고정 질문은 합성 원본이나 예상 검증 단어를 다시 포함하지 않고 두 답변의 역순을 요청해 `47/CROSSCHECK_CONTEXT_OK`를 확인합니다. 개인 대화 가져오기나 임의 prompt/URL/header 대리 호출은 제공하지 않습니다.

후속 POST 직전 같은 대화를 한 번 더 GET해 첫 쌍의 identity·parent·content 표현·완료 상태, leaf와 모델이 그대로인지 검증하고 실제 닫힌 모델 표시·원래 문서/정확한 URL·중단도 다시 확인합니다. 첫 검증된 assistant만 `parent_message_uuid`로 사용하며 `create_conversation_params`는 첫 요청에만 포함합니다. 마지막 readback은 같은 대화·모델, 네 개의 고유 메시지, 불변인 첫 쌍, 두번째 human→첫 assistant와 두번째 assistant→그 human의 parent 관계, final leaf, 두 고정 prompt/예상 답변과 기존 content/첨부/완료 검사를 요구합니다. 재사용 ID·추가 분기·변경된 첫 쌍·부분 완료를 거부하며 정상 완료의 POST는 정확히 두 번이고 자동 재시도는 없습니다.

2026-10-13 공개 asset의 `credentials: 'omit'` GET은 HTTP 200이었으며 현재 Qv 경로가 parent 값을 직접 전달하고 최초 생성 매개변수는 선택적임을 확인했습니다. [현재 parent 처리](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-1-DT-Mq-A-.js), [현재 생성 매개변수](https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/shared-0-Dsui6SsB.js), [pinned 첫 요청/후속 payload](https://github.com/diegosouzapw/OmniRoute/blob/7f3cbb046b3706bf0bbc047b7eaa0cbada8d9e50/open-sse/executors/claude-web/payload.ts#L297). 인증값을 읽은 요청이 아니며 공개 구현만으로 현재 계정의 실제 성공을 단정하지 않습니다.

GET/readback과 다음 POST는 원자적이지 않습니다. 사이에 원격 변경이 생기면 최종 정확한 readback으로 실패를 탐지할 수 있어도 이미 보낸 후속 요청을 모두 예방하지는 못합니다. 따라서 새 비민감 테스트 대화의 고정 진단에만 적용하며 임의 기존 메인 대화 이어쓰기의 안전성을 입증하지 않습니다. 파일·실제 여러 턴 원본·메인 최종 반환·다른 공급자 내부 호출은 별도 미해결입니다. 현재 단위 219개·타입·빌드 통과와 실제 두 요청/포커스 수집 성공은 구분합니다.

## 제안하는 사용 흐름과 경계

1. 최초 연결이나 로그인 만료 때만 사용자가 로그인 화면을 엽니다. 실행 중에는 사용자 창·활성 탭·키보드 입력을 바꾸지 않습니다.
2. 메인 대화를 한 번 불러오고 전체 공유 범위와 원본 파일을 확인합니다. 완료된 기존 메인 답변은 그대로 재사용합니다.
3. 승인된 내부 호출로 독립 답변과 교차 검토를 수집합니다. 기존 개인 peer 대화나 초안을 덮어쓰지 않고 확장이 생성한 검토 대화를 별도로 사용합니다.
4. 최종 요청은 원래 탭·문서·정확한 URL과 캡처한 대화 범위를 확인하고 원래 메인의 대화·메시지 참조에만 보냅니다. 다른 탭 사용은 허용하되 같은 메인 대화의 편집·추가 질문·탭 탐색·새로고침·초안·생성 중 상태는 기존처럼 자동 전송을 막습니다. 안전한 parent-message 검증을 제공하지 못하는 공급자에서는 자동 반환을 지원한다고 표시하지 않습니다. 이 조건을 완화하는 것은 별도 제품 계약 변경입니다.
5. 원본 파일은 메모리에서 검증하고 공급자마다 확인된 참조로 전달합니다. 후속 요청에서도 해당 파일이 유효하게 연결됐는지 확인합니다. 웹용 `delivered ? [] : attachments`를 stateless HTTP 요청에 그대로 적용하지 않습니다.
6. 전송 의도부터 저장하고 한 번만 요청합니다. 응답 일부·HTTP 200·스트림 종료만으로 완료를 표시하지 않고, 공급자의 완료 상태와 해당 요청 대응을 확인합니다. 불확실한 HTTP 결과를 DOM 재전송으로 자동 대체하지 않습니다.

검토 UI는 연결 상태, 공유 범위/원본, 시작 버튼, 진행 상태, 최종 결과에 집중합니다. API 구현 세부정보는 연결 실패 진단에만 필요한 수준으로 노출합니다. 확인하지 못한 모델이나 구독 권한을 만들지 않습니다.

### 사용자가 확인한 인증 경계

[AGENTS.md](../../AGENTS.md)는 개발·브라우저 제어 도구의 자격 증명 수집을 금지합니다. 사용자가 허용한 제품 인증 처리는 해당 공급자 페이지의 일시적인 메모리와 해당 공급자 요청 안에서만 수행하며, 도구로 실제 인증값을 읽거나 내보내는 허용이 아닙니다. 쿠키를 브라우저가 자동 부착하는 요청은 쿠키 값의 JavaScript 조회 없이 동작하는 후보입니다.

사용자에게 **필요한 인증값을 서비스 페이지의 임시 메모리에서만 사용하고 확장 저장소·확장 메시지·개발자/제3자 서버·로그로 내보내지 않는 내부 호출 실험**을 허용할지 질문했습니다. 인증값은 선택한 공급자의 같은-origin 인증 요청에만 사용합니다. 인증 요청의 공급자 서버 전송과 개발자 서버로 자격 증명을 복사하는 행위를 구분합니다. 사용자는 확장 내부에서만 사용하고 개발자 서버·DB에 저장하지 않는다는 설명을 확인했습니다. 이에 따라 위의 좁은 임시 인증 경계를 적용해 실험을 진행합니다. 이 허용과 별개로 도구로 실제 사용자 쿠키·세션 토큰을 수집하거나 fixture에 남기지 않습니다. 인증 세부정보나 서명된 업로드 URL을 브라우저 RPC 응답에 넣지 않습니다.

## 검증 순서와 적용 범위

- 먼저 서비스별 읽기 전용 호환성을 확인하고, 텍스트 한 요청·명시적 완료·같은 대화 후속 요청을 검증합니다. 이를 통과한 서비스만 TXT/PNG와 최종 반환을 검증합니다. 하나의 성공을 세 서비스 성공으로 기록하지 않습니다.
- 단위 검사는 전체 캡처 범위, 원본 해시/참조, 요청 전에 저장, 불확실한 전송 중단과 중복 방지에 집중합니다. 합성 브라우저·설치 확장·실계정 결과는 별도로 기록합니다.
- 실제 확장에서 검토 중 다른 창/탭에 입력해도 포커스와 입력이 유지되는지 확인합니다. 패널 종료·로그인 만료·탭 동결/삭제·부분 응답·메인 대화 변경은 명시적으로 멈춰야 합니다.
- 기존 `Platform`은 웹 탭/문서/URL을 생성과 함께 묶습니다. HTTP 성공을 가짜 `Binding`, `composer: true`, 기존 DOM 완료 상태로 위장하지 않습니다. 필요한 최소 계약만 분리하고 도메인·원본·오케스트레이션을 재사용합니다. [아키텍처](../architecture/overview.md).
- 최초 탭 목록 조사에서는 지원 AI origin이 보이지 않았지만, 이 목록만으로 사용자의 전체 프로필이나 로그인 상태를 판단하지 않았습니다. 이후 별도 Claude 홈 탭의 안전한 GET을 확인했습니다. 구체적 설치·생성 결과는 위 증거 표에만 기록합니다.

2026-10-13의 공개 0.4.0 상세 페이지·설치 제공·CrossCheck/Multi AI Checker 검색 노출은 [출시 기록](../release/release-checklist.md)이 소유합니다. 실제 사용자 설치·대시보드 승인 시점/현재 심사 상태는 미확인이고 현재 로컬 실험은 미배포입니다. 공개 버전 번호를 현재 실험 소스의 배포 증거로 사용하지 않습니다. 내부 호출도 제공자의 문서화된 호환성 계약은 아니며 전송 방식 변경만으로 약관 문제가 해소되지는 않습니다.

## 공식 대안의 현재 범위

OpenAI의 Sign in with ChatGPT는 일부 오픈소스·로컬 앱이 사용자 동의로 기존 플랜을 사용하는 경로입니다. 기존 ChatGPT 대화 접근은 제공하지 않으며 보호된 로컬 자격 증명 저장·loopback 인증 계약 때문에 확장만으로 동일하게 적용된다고 확인하지 못했습니다. [공식 OSS 안내](https://developers.openai.com/siwc/token-sharing-open-source), [인증 저장 경계](https://developers.openai.com/siwc/token-sharing-open-source/profiles-and-sessions).

Claude Max/Team의 API 크레딧 등 플랜 예외와 Google의 외부 API 조건도 현재 문서에서 확인했습니다. 이 예외를 이 사용자의 계정 권한으로 추정하거나 별도 API 전환 동의로 취급하지 않습니다. Gemini CLI OAuth를 다른 앱에서 빌려 쓰는 방식도 채택하지 않습니다. [Claude 플랜 크레딧](https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-and-team-plans), [Google AI 플랜](https://ai.google.dev/gemini-api/docs/google-ai-plans), [Gemini CLI FAQ](https://geminicli.com/docs/resources/faq/).

## 이전 Task 10: Gemini current client and metadata-only readiness — 2026-10-13

Task 10 조사에서는 Google이 해당 Gemini 페이지에 배포한 공개 정적 JS 65개를 `credentials: omit`으로 읽었습니다. 실제 계정의 bootstrap/auth/request body는 개발 도구로 읽거나 저장하지 않았습니다. 이전 Python 구현은 조사 단서이며 현재 서비스의 호환성 계약으로 사용하지 않습니다.

- [현재 메뉴 클라이언트](https://gemini.gstatic.com/_/mss/boq-gemini-web-uiserver/_/js/k=boq-gemini-web-uiserver.BardChatUi.ko.EpdKdVSmyNw.2018.O/ck=boq-gemini-web-uiserver.BardChatUi.GdivHQOKjPc.L.B1.O/am=YYQA0PAPMPv2QYEvQgcDBRhBJwjiBwAAACAE/d=1/exm=ABELSd,AdpaDf,BIsfnb,BenWQc,C3yBDb,CK6Z6b,CsakMb,E3fsbf,FRlTNb,G5GDje,GzXWE,HbEaCf,HwBxOc,ItLZxc,JKGJfb,LQaXg,LVUOyb,MGIlxc,N9BqIf,No94jc,OWHuje,OpU7Tc,PU1dDc,PdaDwd,QuxHpf,TK6Kl,UE0P2d,UghKfd,VSiC6e,Z1MNA,Z8wCif,ZQlXXb,_b,aIycJb,awWKFf,bNyBZd,bnLiYc,cteZTb,eK0zfd,fSXoCf,gMf0nf,h4lope,hSZKtd,ir0vzb,k9O9ef,mqe9lc,nShoMc,o2mxrc,o2nH0b,ponblb,pwgmXb,qxlpjc,tCaMKd,uEAQfd,uEXP3c,v9r4Te,xmtx9e,xy0Mif,zSgmx,ziINQc/excm=_b/ed=1/br=1/wt=2/ujg=1/rs=AKrAJMq2LJjBi1TcgJIV7X5fdYI2V44euA/ee=DGWCxb:CgYiQ;EmZ2Bf:zr1jrb;NJ1rfe:yGfSdd;Pjplud:PoEs9b;QGR0gd:Mlhmy;ScI3Yc:e7Hzgb;UYRIEb:HzTAQc;YIZmRd:A1yn5d;cEt90b:ws9Tlc;dIoSBb:SpsfSb;dowIGb:ebZ3mb;eBAeSb:zbML3c;iFQyKf:vfuNJf;oGtAuc:sOXFj;qQEoOc:KUM7Z;qddgKe:xQtZb;wR5FRb:siKnQd;yxTchf:KUM7Z/dti=1/m=TRJwtb?wli=BardChatUi.t6Zy63jb7qM.libheifWasm.O%3A%3BBardChatUi.QpskBFoiyBU.mediaIntentWasm.O%3A%3B)의 `QHk/RHk`는 `gem-menu-item[data-mode-id]`에 모델 키와 선택 상태를 붙입니다. 응답 깊이의 `XHk/aIk`는 다른 선택 조건을 사용하고 mode key가 없습니다. 모델 행과 노력 행이 동시에 selected일 수 있으므로 전역 class 선택이나 이름표 alias로 모델을 추정하지 않습니다. 현재 제어 버튼의 `aria-controls`로 메뉴를 소유하고 모델 행의 own title만 읽습니다.
- [현재 Google 핵심 클라이언트](https://gemini.gstatic.com/_/mss/boq-gemini-web-uiserver/_/js/k=boq-gemini-web-uiserver.BardChatUi.ko.EpdKdVSmyNw.2018.O/ck=boq-gemini-web-uiserver.BardChatUi.GdivHQOKjPc.L.B1.O/am=YYQA0PAPMPv2QYEvQgcDBRhBJwjiBwAAACAE/d=1/exm=_b/excm=_b/ed=1/br=1/wt=2/ujg=1/rs=AKrAJMq2LJjBi1TcgJIV7X5fdYI2V44euA/ee=DGWCxb:CgYiQ;EmZ2Bf:zr1jrb;NJ1rfe:yGfSdd;Pjplud:PoEs9b;QGR0gd:Mlhmy;ScI3Yc:e7Hzgb;UYRIEb:HzTAQc;YIZmRd:A1yn5d;cEt90b:ws9Tlc;dIoSBb:SpsfSb;dowIGb:ebZ3mb;eBAeSb:zbML3c;iFQyKf:vfuNJf;oGtAuc:sOXFj;qQEoOc:KUM7Z;qddgKe:xQtZb;wR5FRb:siKnQd;yxTchf:KUM7Z/dti=1/m=LQaXg?wli=BardChatUi.t6Zy63jb7qM.libheifWasm.O%3A%3BBardChatUi.QpskBFoiyBU.mediaIntentWasm.O%3A%3B)의 `EGd/BGd`는 BotGuard flag `45428920`에 따라 프롬프트/대화 참조와 연결된 검사를 수행합니다. 실패하면 검사 값을 생략하는 SDK fallback을 채택하지 않습니다. `TSDtV`의 명시적 false는 해당 bootstrap 설정의 비활성 근거만 제공하며 실제 injected/cached runtime 보호 상태를 증명하지 않습니다. 누락/불명/다중 해석은 unknown입니다. [기초 decoder](https://gemini.gstatic.com/_/mss/boq-gemini-web-uiserver/_/js/k=boq-gemini-web-uiserver.BardChatUi.ko.EpdKdVSmyNw.2018.O/am=YYQA0PAPMPv2QYEvQgcDBRhBJwjiBwAAACAE/d=1/excm=_b/ed=1/dg=0/br=1/wt=2/ujg=1/rs=AKrAJMq4D8s7SVE58KT3ryMuO7kDHp-9lw/ee=DGWCxb:CgYiQ;EmZ2Bf:zr1jrb;NJ1rfe:yGfSdd;Pjplud:PoEs9b;QGR0gd:Mlhmy;ScI3Yc:e7Hzgb;UYRIEb:HzTAQc;YIZmRd:A1yn5d;cEt90b:ws9Tlc;dIoSBb:SpsfSb;dowIGb:ebZ3mb;eBAeSb:zbML3c;iFQyKf:vfuNJf;oGtAuc:sOXFj;qQEoOc:KUM7Z;qddgKe:xQtZb;wR5FRb:siKnQd;yxTchf:KUM7Z/dti=1/m=_b?wli=BardChatUi.t6Zy63jb7qM.libheifWasm.O%3A%3BBardChatUi.QpskBFoiyBU.mediaIntentWasm.O%3A%3B)의 `_$ba`는 sparse numeric-field object가 앞 dense value를 덮어쓸 수 있어 미지원 표현을 거부합니다.
- `Rvd/MK`의 현재 요청에는 필드 109까지 존재하며 이전 81-entry recipe를 복사할 수 없습니다. `HL.Oub`는 `45771354`의 session-channel, `EJd`는 `45806759`의 SSE/legacy 선택을 각각 처리합니다. 실제 계정의 활성 경로를 증명하지 않고 구형 경로로 fallback하지 않습니다.
- `UYb/VYb`의 legacy framing은 UTF-16 문자열 길이이며 길이 span에 구분 LF가 포함됩니다. incomplete tail이나 malformed JSON을 무시하는 외부 library 방식을 채택하지 않습니다. Stream final은 field15, history selected response/final/stopped는 별도 필드입니다. `hNvQHb` readback은 turn의 CID/RID, saved selected RCID, query mode, pagination token을 따로 확인해야 합니다. Auto는 라우팅 모드이며 Fast/Pro의 고정 alias가 아닙니다.

Task 10에서 추가한 **연결 → Gemini 준비 확인**은 새 비활성 Gemini home에서 현재 UI 모델 이름과 보안 상태만 읽는 동작입니다. Prompt/upload/account API/authenticated fetch는 없습니다. 모델 request key와 bootstrap은 provider 페이지 안에 두고 RPC에는 모델 표시명·고정 enum만 반환합니다. Session에는 확인 ID/상태만 저장하며 pending 복원은 uncertain으로 바꾸고 자동 시작하지 않습니다. 모델 cleanup 완료까지 취소 이후에도 기존 mutation lock을 유지합니다. disabled 결과도 로그인·실제 응답·모든 전송 조건의 성공을 뜻하지 않습니다. 현재 MAIN projection과 실제 runtime 보호의 구분은 아래 Task 11이 소유합니다.

정적 source의 SHA-256: base `ef94b2e9b0dd90652e08dd5f64317244a5e566b07e841cffa9ce015173c5d2ca`, core `1ab342b63369a132c0e69f9145f841d099056413ebcacf268b9573609af7dc5a`, menu `607be40771ff2dc7e1b1b2b662b1405c51bef721047f8f87c05e1b7ef49112de`. 공개 asset은 변경 가능하며 이 기록은 조사 시점 근거입니다. 실제 installed/native 결과는 [검증 기록](../testing/validation.md)이 소유합니다.

남은 generation gate: 제품 안에서 실제 필요한 protection/transport를 확인하고 정상 검사를 통과하는 경로, 현재 계정의 UI mode/effort→request mapping, 지원되는 텍스트-only 응답 metadata와 정확한 readback을 각각 입증해야 합니다. 이 준비 확인을 답변 시험으로 표시하거나 보안 값을 생략한 생성 요청으로 대체하지 않습니다. [준비 확인 계획](../development/gemini-background-readiness-plan.md).

좁은 실제 side panel 환경에서는 trigger가 `gem-button` host와 그 native inner button으로 바뀌며 ARIA controls/expanded가 없습니다. 현재 compact `AGk/zGk` template과 `gem-popover`의 `cdkAttachPopoverAsChild` 소스, 실제 same-component ancestry를 확인했습니다. 이 경우만 해당 `bard-mode-switcher` 안의 `bard-mode-popover-menu`와 `gem-mode-menu`를 읽습니다. 기존 wide ARIA 경계를 완화하지 않으며 present-but-invalid ARIA는 fallback하지 않습니다. 첫 native 실패와 수정 뒤 수용은 합성/설치 결과와 별도로 기록합니다.

## 현재 Task 11: Gemini bootstrap projection과 정상 보호 경로의 경계

현재 제품 구현은 metadata-only 준비 확인입니다. `readGeminiPageProtection`은 동일 top-frame Gemini home의 MAIN world에서 실행하는 self-contained 순수 함수이며, live `WIZ_global_data.TSDtV`만 해석해 고정 보호 상태/사유 enum을 반환합니다. DOM 문자열의 언급을 설정 정의로 취급하지 않습니다. 원문·인증값·모델 request key를 반환하거나 저장하지 않고, 이 함수에 네트워크·DOM 변경·전역 export·임의 요청 경로는 없습니다.

- **문서와 모델 소유권:** 원래 ISOLATED bridge의 로컬 UUID와 Chrome의 native document ID는 별도 namespace입니다. 원래 binding을 전후 검사하고 정확히 하나의 top-frame/native 문서 결과만 수용한 뒤 같은 문서 MAIN에 실행합니다. 첫 모델 capture는 pending receipt이며 private mode key/잠금을 유지합니다. 명시적 finish에서 실제 모델 표시와 key를 다시 비교하고 메뉴 cleanup을 마쳐야 done입니다. 취소·같은 label의 key 변경·문서 변경·불명 결과는 완료로 바꾸지 않습니다.
- **전체 첫 설정 검증:** 위 기초/핵심 공개 클라이언트의 `tZa/DZa`는 첫 decoded configuration을 authoritative하게 사용합니다. 현재 dense reader는 그 설정의 모든 row/key와 active oneof를 검증하며 크기·깊이·행 수를 제한합니다. 중복/잘못된 key, 경쟁 또는 미지원 oneof, sparse override, Any와 nested 표현은 unknown입니다. oneof 밖의 문자열 metadata와 첫 설정을 바꾸지 않는 추가 configuration은 이 경계를 완화하지 않습니다. target row의 명시적 boolean만으로 나머지 설정의 오류를 무시하지 않습니다.
- **bootstrap과 실제 보호는 다름:** `sz.Ba`의 optional `_.tw(_.Ta,8)` byte configuration이 `TSDtV`보다 우선할 수 있고 실제 cached `pL`은 주입된 `sz`에서 `isEnabled`를 정합니다. 따라서 명시적 true/false는 해당 bootstrap 설정의 flag만 증명합니다. 주입된 우선 설정의 부재나 동등성을 입증하지 않았으므로 이 projection으로 생성에 실제 필요한 보안 상태를 단정하지 않습니다.

같은 cached Google 핵심 클라이언트는 정상 서비스를 재사용할 **후보**도 보여 줍니다. 정확한 owning element의 `__ngContext__` → exported `_.DOb` → live LView의 `[9]` injector에서 실제 `_.sC`/`_.IL`/`_.pL`의 이미 cached된 참조만 확인하고, 선택된 정상 `lN`, 그 `ha`와 실제 `HL`, API의 `Ja`와 실제 `pL` identity가 일치해야 합니다. 공개 소스에는 `_.HL` export도 있으나 현재 live namespace/injector/cache/service 존재는 검증하지 않았습니다. missing record를 hydrate할 수 있는 `.get()`으로 대신하지 않고, 미지원 owner/context·미해결 cache는 거부합니다. 첫 global view, 추정 debug API, 별도 서비스 생성이나 replacement API로 대신하지 않습니다.

현재 source-supported 후보는 실제 `sC.sendRequest`의 정상 builder·전체 preprocessor·보호·response/store chain을 사용하므로 private lexical `dTd` registry를 별도로 찾을 필요가 없습니다. 정확한 API instance의 `Oub` own-property gate가 최종 처리된 request의 승인 input/model/ownership·지원 context와 실제 `A5a/B5a` packet을 검사한 뒤 원래 receiver/packet으로 한 번만 delegation하는 방향입니다. 빈 history만으로 업로드·페이지·프로젝트·task context가 없다고 추정하거나 필드를 삭제해 통과시키지 않습니다. 이는 미구현·미검증 후보이며 정상 effects가 같은 API instance를 쓰는지, queued effects·cancel까지 gate를 유지하고 안전하게 정리할 수 있는지, 원래 transport가 내부 reconnect/retry를 하지 않는지는 여전히 확인해야 합니다. 외부 delegation 한 번만으로 내부 재전송의 부재가 증명되지는 않습니다.

그 뒤에도 같은 실제 `HL.h5a`가 정상 `pL/WFd`로 만든 request-bound `{request,A5a,B5a}` 보호 packet이 필요합니다. `EGd`는 보호 실패를 catch한 뒤 `A5a/B5a: undefined`로 반환하므로 `lN.sendRequest` 재사용만으로 fail-closed가 보장되지 않습니다. 필요한 packet이 없거나 승인된 prompt/client ID/CID/parents와 맞지 않으면 `HL.Oub` 전에 멈춰야 합니다. 인증·nonce·attestation은 provider 안의 opaque 값으로 유지하고 생략·직접 재구현·재전송을 하지 않습니다.

**정상 generation send는 구현하지 않았습니다.** 실제 소유 서비스·전처리·필수 보호 packet·현재 transport와 취소/재연결 계약, 최종 text-only stream 및 정확한 raw saved-history readback은 남은 gate입니다. `HL.Xcb`의 parsed first-candidate/final/completeness 기본값을 완료 근거로 사용하지 않고, 명시적 CID/RID/selected RCID·완료·정확한 승인 입력/답변을 확인해야 합니다. 공개 소스는 구현 단서이며 실제 Gemini 답변 성공이나 지원 API 계약이 아닙니다. 단위·합성 브라우저·설치 확장·actual native와 artifact별 결과는 [검증 기록](../testing/validation.md), 다음 재현 작업은 [진단 설계](../development/gemini-protection-diagnostics-plan.md)가 소유합니다.
