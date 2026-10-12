# 웹 구독을 유지하는 백그라운드 검토 방식

조사일: 2026-10-12 KST. 기준 `9c7893b`에서 분리한 `codex/background-web-transport` 작업이며 기존 미커밋 문서는 보존했습니다. 사용자는 **기존 ChatGPT·Claude·Gemini 웹 로그인과 구독만 사용**하는 조건을 선택했습니다. 별도 유료 개발자 API나 OpenRouter를 기본 연결로 바꾸지 않습니다.

조사를 바탕으로 **Claude의 고정 텍스트 한 요청**을 별도의 연결 시험으로 구현했습니다. 최신 네이티브 시험은 계정 모델 목록이 명시적으로 null인 탓에 POST 전에 멈췄고 생성 완료는 없습니다. 기본 DOM 검토는 유지하며 세 서비스·전체 문맥·파일·최종 반환의 전환 완료를 뜻하지 않습니다. 이 실험의 스토어 업로드는 없고 현재 스토어 상태도 재조회하지 않았습니다. 설치·실계정 결과는 아래에서 별도로 기록합니다.

## 현재 불편의 코드 근거

`src/infrastructure/chrome/provider-client.ts`의 `reveal()`은 창을 포커스하고 대상 탭을 활성화합니다. `preparePeer()`, `src/application/automatic-workflow.ts`의 원본 확인 및 각 작업 사전 검사, `src/presentation/shell/App.tsx`의 시작 동작에서 이를 호출합니다. 따라서 다른 탭을 보고 있어도 검토가 사용자의 작업 위치를 바꿉니다.

이 활성화는 이전 비활성 탭의 편집기·업로드 준비 실패에 대응해 추가됐습니다. 과거 증거는 [검증 기록](../testing/validation.md)이 소유합니다. 활성화 호출만 삭제하면 입력·업로드·완료 수집의 백그라운드 호환성이 검증되는 것은 아닙니다. 수동으로 대화를 보여주는 버튼의 `reveal()`까지 제거해서도 안 됩니다.

## 비교 결과

| 방식 | 사용자 편의 | 기존 웹 구독 조건 | 판단 |
| --- | --- | --- | --- |
| 같은 서비스의 내부 웹 HTTP 호출 | 편집기 입력·버튼 클릭·DOM 완료 탐색과 탭 전환을 줄일 수 있음 | 기존 브라우저 세션으로 호출 가능한 경우 유지 | 우선 검증할 후보. 인증·파일·완료·대화 연결은 서비스별로 입증해야 함 |
| 공식 개발자 API / OpenRouter | 백그라운드 요청, 문서화된 응답, 단일 연결 가능 | 별도 인증·과금·데이터 수신자가 생김. 일부 구독 크레딧 예외는 실제 계정별 확인 필요 | 사용자가 선택한 기본 조건과 달라 이번 기본 전환에서 제외 |
| 공식 구독 연동 / 로컬 실행 앱 | 일부 서비스는 기존 플랜으로 공식 호출 가능 | 추가 인증·설치가 필요하고 세 서비스 공통 경로가 아님 | 향후 대안. 웹 로그인만으로 세 서비스가 연결된다고 안내하지 않음 |
| 별도 검토 창에서 기존 DOM 실행 | 개인 탭과 검토 탭을 분리할 수 있음 | 유지 | 과도기 실험만 가능. 최소화·가려짐·동결 때 성공은 미검증이며 DOM 방식 자체가 남음 |

Chrome은 콘텐츠 스크립트 요청이 주입된 페이지의 origin에서 실행됨을 설명하고, Fetch 표준은 같은 origin 요청에 브라우저 관리 인증정보를 포함할 수 있음을 규정합니다. 따라서 HTTP 호출마다 쿠키 값을 읽거나 내보내야 하는 것은 아닙니다. 이것은 **요청 가능한 브라우저 구조의 근거**이며 특정 서비스의 생성 요청이 허용·성공한다는 근거가 아닙니다. [Chrome 요청 경계](https://developer.chrome.com/docs/extensions/develop/concepts/network-requests), [Fetch 인증 모드](https://fetch.spec.whatwg.org/#concept-request-credentials-mode).

직접 sidepanel 요청은 탭 동결의 영향을 줄일 후보지만 현재 CSP의 `connect-src 'none'`과 다른 설계입니다. host permission이 있어도 실제 인증·쿠키 설정·서비스 요구사항을 확인해야 합니다. 특정 origin과 동작만 허용해야 하며 임의 URL fetch 프록시를 만들지 않습니다. [Chrome 쿠키 동작](https://developer.chrome.com/docs/extensions/develop/concepts/storage-and-cookies).

## 서비스별 증거와 미확인 사항

| 서비스 | 확인한 공개 구현 | 아직 확인하지 못한 것 |
| --- | --- | --- |
| ChatGPT | ChatHub 공개 ref `a7a2bd6`는 `/api/auth/session`의 access token을 읽고 backend 호출·모델·파일 초기화에 Bearer 헤더를 사용. 브라우저 프록시도 인증 헤더를 확장 메시지로 전달. ChatGPTBox `df8ef92`도 Bearer를 사용. 조사한 생성 클라이언트의 자체 Sentinel 계산은 채택하지 않음 | 인증값을 페이지 밖으로 전달하지 않고 서비스 보호 검사를 우회하지 않는 현재 생성 경로, 파일·원래 대화 이어쓰기 |
| Claude | 공개 웹 클라이언트는 조직·대화·completion 경로를 사용. 쿠키 조회 없는 GET과 공개 completion/SSE 구조로 한 요청 시험 구현. 실제 계정 모델 목록이 null이어서 catalog 단계에서 POST 전 중단 | 검증 가능한 계정/UI/백엔드 모델 대응 경로가 없음. 생성 POST·완료·포커스 유지, TXT/PNG·후속 요청·원래 대화 반환은 미검증 |
| Gemini | 공개 웹 클라이언트는 StreamGenerate/batchexecute, 페이지별 요청 값과 별도 업로드를 사용. Gemini-API `1ad0d4a`는 최근 유지보수된 Python 구현 | 쿠키 추출 없이 현재 브라우저 문맥에서 작동하는지, 페이지 요청 값·첨부·RPC 완료를 안전하게 확인할 수 있는지 |

근거: [ChatHub ChatGPT client](https://github.com/chathub-dev/chathub/blob/a7a2bd6e12050d6a39fcaf30868bdfd7ccf78f22/src/app/bots/chatgpt-webapp/client.ts), [ChatHub proxy](https://github.com/chathub-dev/chathub/blob/a7a2bd6e12050d6a39fcaf30868bdfd7ccf78f22/src/services/proxy-fetch.ts), [ChatGPTBox](https://github.com/ChatGPTBox-dev/chatGPTBox/blob/df8ef92c7495c5dde1f256216d1608e87d099cf6/src/services/apis/chatgpt-web.mjs), [Claude 사용량 확장 조사](https://github.com/dineshkruplani/Claude-Usage-Badge-Extension/blob/main/docs/PHASE1-FINDINGS.md), [Gemini-API](https://github.com/HanaokaYuzu/Gemini-API/blob/1ad0d4a93e505e77c79769d78ef2997641f973c8/README.md).

ChatHub 공개 소스에는 Claude 2.1과 예전 Bard 도메인도 남아 있어 현재 호환성의 근거로 쓸 수 없습니다. Gemini-API의 쿠키 복사·브라우저 쿠키 추출·캐시 구현을 가져오지 않습니다. ChatALL도 웹 연동의 잦은 고장을 경고하며, Electron의 web security/SameSite 변경은 이 확장에 채택하지 않습니다. 라이선스가 다른 구현을 복사하지 않고 동작 구조만 참고합니다. [ChatALL 경고](https://github.com/ai-shifu/ChatALL#note-on-web-connected-bot-reliability).

## 구현한 Claude 시험의 범위

**연결 → 백그라운드 연결 시험**을 직접 시작하면 확장이 비활성 새 Claude 홈 탭을 만듭니다. 실제 화면의 현재 모델을 읽고 계정의 모델 이름과 유일하게 대응시킨 뒤 `Reply with CROSSCHECK_OK only.` 한 요청만 보냅니다. 사용자 창·활성 탭을 바꾸는 `reveal()`은 이 경로에서 호출하지 않습니다. 쿠키는 브라우저가 같은-origin 요청에 부착하며 조직·모델 참조는 공급자 페이지 메모리에만 있습니다.

- 요청/완료 검사는 `src/infrastructure/providers/claude/probe.ts`, 의도 저장·비활성 탭·취소는 `src/infrastructure/chrome/claude-probe.ts`와 `provider-client.ts`가 소유합니다. 좁은 시작·조회·중단 명령은 기존 bridge의 정확한 확장 발신자·문서·URL 검사로 연결합니다. UI는 주입된 Platform 포트만 사용합니다.
- 세션에는 시험 ID와 상태만 저장합니다. 답변·조직·백엔드 모델 참조·인증정보는 저장하지 않습니다. 열린 패널에는 완결된 텍스트 답변만 전달합니다. 복원한 진행 상태는 불확실로 표시하며 자동 재개하지 않습니다.
- 각 GET/POST 직전에 시작 시점의 정확한 페이지 주소를 확인합니다. 저장 실패·기존 초안·생성 중·대화 변경·중단·조회 단절이면 멈추며 재시도나 DOM 대체 전송을 하지 않습니다.
- 스트림은 실제 assistant/parent UUID, 텍스트 블록 종료, `end_turn`, `message_stop`을 모두 확인합니다. HTTP 200·스트림 EOF·일부 답변은 완료가 아닙니다. 내용과 전송 크기를 제한하고 오류 원문은 확장으로 내보내지 않습니다. 오류 진단은 고정된 단계 사유만 허용합니다.

`chat` capability가 있는 조직이 정확히 하나이고 현재 모델 메타데이터가 명확할 때만 진행합니다. 계정에 API 전용 조직이 추가로 있어도 이를 채팅 대상으로 선택하지 않으며, 채팅 조직이 없거나 둘 이상이면 멈춥니다. 생각/도구 블록을 포함하는 응답과 확인하지 않은 이벤트 형식은 실패로 처리하므로 계정·모델에 따라 시험이 작동하지 않을 수 있습니다. 첨부 목록은 비어 있고 대화 가져오기·후속 생성·원래 메인 반환은 지원하지 않습니다. 새 테스트 대화는 Claude에 남을 수 있습니다.

Claude 요청 구조는 [OmniRoute payload](https://github.com/diegosouzapw/OmniRoute/blob/7f3cbb046b3706bf0bbc047b7eaa0cbada8d9e50/open-sse/executors/claude-web/payload.ts), [stream](https://github.com/diegosouzapw/OmniRoute/blob/7f3cbb046b3706bf0bbc047b7eaa0cbada8d9e50/open-sse/executors/claude-web/stream.ts), 모델 메타데이터는 [AIFuel](https://github.com/robertogogoni/aifuel/blob/de119ddd68e29adc23ad0d9abbd9ad14f087efb6/internal/installer/chrome-extension/background.js#L63-L97), UUID 관계는 [Claude2api 응답 정의](https://github.com/aurora-develop/Claude2api/blob/6a9ea135f41626cd335950c97ba290f42fa7dd64/models/response.go#L242-L289)를 참고했습니다. 이들의 서버 쿠키 저장·TLS 지문·보호 검사 해결 방식은 가져오지 않았습니다. 공개 구현을 읽었다는 사실이 현재 서비스 호환성이나 사용 허가를 증명하지 않습니다.

조직의 API 전용·채팅 구분은 [Claude Usage Badge의 공급자 구현](https://github.com/dineshkruplani/Claude-Usage-Badge-Extension/blob/7b4262c9faff033a23791b41a483fa621a06701d/src/providers/claude-web.ts#L101-L104)과 [직접 조사 기록](https://github.com/dineshkruplani/Claude-Usage-Badge-Extension/blob/7b4262c9faff033a23791b41a483fa621a06701d/docs/PHASE1-FINDINGS.md#L78-L94)을 참고했습니다. `chat` capability의 유일성만 사용하며 첫 조직 선택·플랜 추정·계정 로깅은 채택하지 않습니다.

### 이번 작업의 검증 기록

| 증거 | 확인한 범위 | 상태 |
| --- | --- | --- |
| 단위·타입·빌드 | Node 24.19.0·`npm run check`·단위 125개 | 최신 모델명 wrapper 수정 후 통과. 생성 성공 증거 아님 |
| 합성 브라우저 | 최신 관련 10개 통과: 즉시/지연 wrapper 모델 2개·probe 4개·다른 공급자/모델 메뉴 4개 | 전체 114개는 마지막 수정 전 소스 결과. 모두 합성 응답 |
| 설치 확장 | 설치 검사 4개 통과는 마지막 조직·wrapper 수정 전 결과. 최신 네이티브 경로 설치·새로고침·0.4.0 실제 패널 확인 | 설치 성공과 실계정 생성 성공은 구분 |
| 실제 로그인 읽기 | 안전한 GET에서 조직 구조·capability 여부만 확인. 모델 목록 GET은 HTTP 200·`claude_ai_bootstrap_models_config: null` | 원문·계정/조직/모델 식별자·인증값은 출력하지 않음 |
| 실제 로그인 생성 | 다섯번째 네이티브 시험은 모델·조직 선택을 통과하고 catalog 단계에서 POST 전 중단 | 생성 요청·완료·실행 중 포커스 유지 미검증 |
| 독립 코드 리뷰 | 최신 전체 diff 재검토 | 중요한 결함 없음. 계정 호환성 증거 아님 |

독립 리뷰의 주소 변경 경합과 로딩 중 중단 지연은 각각 요청 직전 URL 재확인·준비 단계 AbortSignal로 수정하고 최소 단위 회귀를 추가했습니다. 이 수정 뒤의 합성·설치·실계정 결과를 앞선 전체 브라우저 결과와 합쳐 표시하지 않습니다.

첫 실계정 시험 이후 모델 표시명에 effort 설명이 붙은 UI 형태를 내용 없는 메타데이터로 확인했습니다. 합성 회귀에서 현재 모델 대응 실패를 재현하고 선택된 메뉴 항목을 읽도록 수정했습니다. 이후 모델명 wrapper의 `textContent`가 설명·아이콘 텍스트를 합치는 결함을 재현하고 표시 첫 줄을 읽도록 최소 수정했습니다. 즉시·지연 메뉴 회귀 2개가 통과했습니다. 네이티브 빈 화면과 DOM 관찰의 차이를 생성 성공이나 미전송으로 해석하지 않았으며 원문 없는 고정 실패 사유만 전달합니다.

세번째 실제 시험은 계정 조직 선택 단계에서 POST 전에 멈췄습니다. 안전한 GET은 식별자 없이 개수와 구조·capability 여부만 반환했고 API 전용 조직과 채팅 조직이 함께 있는 경우를 확인했습니다. 전체 조직 수가 하나여야 한다는 초기 조건을 두 조직의 합성 회귀로 재현한 뒤 유일한 채팅 capability 기준으로 수정했습니다. 상세 원인과 회귀 증거는 [검증 교훈](../development/verification-lessons.md)이 소유합니다.

### 남은 구체적인 차단 사항

최신 경로의 다섯번째 네이티브 시험은 모델·조직 선택을 통과하고 계정 모델 catalog 단계에서 POST 전에 멈췄습니다. 같은-origin 읽기 전용 GET은 HTTP 200이지만 `claude_ai_bootstrap_models_config`가 명시적으로 null임을 내용 없는 상태값으로 확인했습니다. 실제 UI의 선택을 검증 가능한 백엔드 모델 참조와 대응시킬 자료가 없으므로 요청하지 않았습니다.

[AIFuel의 확인한 구현](https://github.com/robertogogoni/aifuel/blob/de119ddd68e29adc23ad0d9abbd9ad14f087efb6/internal/installer/chrome-extension/background.js#L63-L97)도 이 목록의 null을 빈 목록으로 취급합니다. [OmniRoute의 공개 payload](https://github.com/diegosouzapw/OmniRoute/blob/7f3cbb046b3706bf0bbc047b7eaa0cbada8d9e50/open-sse/executors/claude-web/payload.ts)에 있는 정적 기본 모델은 현재 계정의 가용성이나 실제 UI 선택을 증명하지 않으므로 대체하지 않습니다. 필요한 것은 계정·UI·실제 요청 모델의 검증 가능한 대응 경로이며 로그인 성공만으로 이를 대신할 수 없습니다.

실계정 생성·완료와 세 서비스 전체 전환은 미검증입니다. 자신이 만든 Claude 시험 탭과 검색 탭을 모두 닫고 브라우저 제어 REPL 정상 종료와 작업용 네이티브 helper 부재를 새 관찰로 확인했습니다. 스토어 조회·새 업로드·새 심사 제출은 하지 않았습니다.

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

변경을 검증하기 전 제출한 0.4.0 패키지를 새 방식으로 바꾸거나 현재 스토어 상태를 추정하지 않습니다. 마지막 확인된 제출 상태는 [출시 기록](../release/release-checklist.md)이 소유합니다. 내부 호출도 제공자의 문서화된 호환성 계약은 아니며, 전송 방식을 바꾸는 것만으로 약관 문제가 해소되지는 않습니다.

## 공식 대안의 현재 범위

OpenAI의 Sign in with ChatGPT는 일부 오픈소스·로컬 앱이 사용자 동의로 기존 플랜을 사용하는 경로입니다. 기존 ChatGPT 대화 접근은 제공하지 않으며 보호된 로컬 자격 증명 저장·loopback 인증 계약 때문에 확장만으로 동일하게 적용된다고 확인하지 못했습니다. [공식 OSS 안내](https://developers.openai.com/siwc/token-sharing-open-source), [인증 저장 경계](https://developers.openai.com/siwc/token-sharing-open-source/profiles-and-sessions).

Claude Max/Team의 API 크레딧 등 플랜 예외와 Google의 외부 API 조건도 현재 문서에서 확인했습니다. 이 예외를 이 사용자의 계정 권한으로 추정하거나 별도 API 전환 동의로 취급하지 않습니다. Gemini CLI OAuth를 다른 앱에서 빌려 쓰는 방식도 채택하지 않습니다. [Claude 플랜 크레딧](https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-and-team-plans), [Google AI 플랜](https://ai.google.dev/gemini-api/docs/google-ai-plans), [Gemini CLI FAQ](https://geminicli.com/docs/resources/faq/).
