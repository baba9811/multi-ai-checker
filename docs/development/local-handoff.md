# 로컬 개발 인계

## 목표와 현재 상태

CrossCheck는 같은 Chrome 프로필에 웹 로그인한 ChatGPT·Claude·Gemini를 사용합니다. 최종 사용자는 API 키, CLI, TUI 없이 확장 화면만 사용해야 합니다.

기본 흐름은 **기존 대화의 완료된 여러 질문·답변 가져오기 → 원본 파일 확인 → 자동 검토 시작 → 다른 AI 답변·교차 검토 수집 → 원래 메인 대화의 최종 답변 수집**입니다. 단계별 승인이나 복사·붙여넣기를 기본 흐름에 넣지 않습니다. 현재 `codex/background-web-transport`는 렌더된 원본과 TXT/PNG를 공유하는 명시적 **Claude 백그라운드 검토**를 추가하며 기본 전체 DOM 흐름은 유지합니다. 최종 소유권 수정 artifact의 실제 native 세 Q/A·TXT/PNG collect/review 수용까지 완료했습니다. manifest의 0.4.0만으로 과거 설치본·스토어 패키지와 같은 코드라고 판단하지 마세요.

과거 DOM 설치본의 상세 증거는 [검증 기록](../testing/validation.md)이 소유합니다. 실제 Aside의 0.3.0 제거·0.4.0 설치와 `90e7f84`의 네이티브 2쌍·TXT·PNG → 세 서비스 독립 답변·교차 검토 → 원래 ChatGPT 최종 답변 수집이 기록돼 있습니다. 이 결과는 당시 소스와 계정에 대한 증거이며 현재 실험 빌드의 실계정 성공을 뜻하지 않습니다.

출시 작업의 2026-10-07 제출·심사 대기·미게시 기록은 과거 상태입니다. 2026-10-13 공개 조회에서는 **0.4.0 상세 페이지·설치 제공·CrossCheck와 Multi AI Checker 검색 노출**을 확인했습니다. 실제 사용자 설치와 대시보드 승인 시점·현재 심사/초안 상태는 확인하지 않았습니다. 이 로컬 실험 브랜치는 스토어에 배포하지 않았고 버전 번호만으로 공개 패키지와 같은 소스라고 판단하지 않습니다. 제출 당시 PR #2·릴리스 `37449257291`·CI ZIP 12개 파일 일치 등 역사와 최신 공개 근거는 [출시 체크리스트](../release/release-checklist.md)가 소유하며 배포 절차는 [배포 자동화](../release/automation.md)를 확인합니다.

## 현재 Task 12: Gemini 정상 클라이언트 metadata 분류 — 수용 완료

순수 synchronous MAIN의 실제 consumer profile을 기존 모델/문서/finish receipt에 구현했습니다. 정확한 compact host/container와 정해진 declaration 관계를 통해 컴포넌트 자체의 selected service/API 참조만 읽습니다. Root cache lookup·hydration·provider factory/getter/메서드·DOM 변경·인증값 조회는 없고 strict enum만 일시적으로 반환하며 세션은 ID/status입니다. 상세 계약은 [소스 조사](../research/background-web-transport.md), artifact별 증거는 [검증 기록](../testing/validation.md)이 소유합니다.

최종 source classifier는 순수190개와 전체 **630 단위·타입·빌드, installed-origin15개(23.6초), 전체 synthetic176개(3.4분)**를 순서대로 통과했습니다. 실제 native는 context/slot/container·세 declaration·original container[16]·최종 컴포넌트/선택된 서비스와 보호 활성 검사를 모두 통과하고 **`unsupported/transport-rpc`**를 반환했습니다. 자동 모드/페이지 보안 설정과 finish도 완료됐습니다. 현재 configured initial framework-stream 경로를 구분한 metadata 수용이며 요청/응답의 증거가 아닙니다. 실제 cold-native candidate는 현재 계정의 선택 경로에서 지원·확인한 상태가 아닙니다. Artifact별 상세 결과는 [검증 기록](../testing/validation.md)이 소유합니다.

Classifier는 실제 API의 own Aa를 먼저 읽습니다. True면 실제 session.oa true만 요구하고 Nd는 읽지 않습니다. False일 때만 own Nd true를 SSE-first/fallback 가능 경로, false를 framework RPC로 고정 분류합니다. Unknown은 고정 오류이며 cold-native candidate의 prewarm/hook 검사는 해당 native 경로에서만 수행합니다. 값/flag/경로를 바꾸지 않습니다.

이전592 artifact의 native `owner-declaration-3-binding` 실패 뒤 현재 페이지가 로드한 공개 정적 core/component를 credentials 없이 다시 읽었습니다. `k/ck`가 같아도 바이트 해시는 과거 source와 달랐으며 동일 source라는 주장은 하지 않습니다. 두 공개 버전 모두 정상 NgTemplateOutlet 삽입이 child[5]를 insertion TNode로 바꾸지만 child[16]의 원래 declaration container는 유지하는 경로를 확인했습니다. 세 번째 link만 이 원래 container의 정확한 parent81/marker/parent/node provenance로 검증했고 수정 전18 실패/150 통과를 재현했습니다. 첫 두 child[5]와 최종 owner/service 검사는 유지합니다. 608의 aggregate transport와615의 oa-first transport-session 결과는 최종 route classifier 이전의 역사적 증거입니다. [Task 12 계획](gemini-client-capability-plan.md).

최근 exact 프로젝트 설치 ID/경로/버전과 reload 완료 후 실제 extension action/sidepanel을 사용했고 manager 선택과 새 소유 홈의 비활성을 유지했습니다. 홈은 native close/fresh absence로 닫고 manager 선택을 복원했으며 허가된 helper 종료 뒤 실제 부재를 확인했습니다. 이전585 artifact의 홈도 읽기 전용 public asset 확인 후 닫았습니다. 608 artifact의 ZIP은 역사적 패키지입니다. 최종630 로컬 ZIP도 테스트/native output과12개 파일·해시 일치를 확인했으며 [검증 기록](../testing/validation.md)에 보존했습니다. Task 12 metadata는 checkpoint 가능한 상태이고 Gemini 실제 응답 목표는 열려 있습니다. 정상 SDK의 request-owned `Uwa.setParam("rt") → own Rj.send` guard는 다음 소스 조사 후보이며 구현·증명하지 않았습니다. Global fetch patch·flag 강제·인증값 조회·새 Gemini 질문·push·store 업로드는 없습니다.

## 이전 Task 11: Gemini 실제 설정 projection — 2026-10-14, metadata 수용 완료

Task 10은 `65d1334`로 보존했습니다. 실제 unknown을 고정 이유로 분리한 첫 native 진단은 `bootstrap-ambiguous`였습니다. 문자열 언급을 정의로 취급하는 DOM scanner를 완화하지 않고, provider 페이지 안의 self-contained MAIN 함수가 현재 `TSDtV`를 읽고 고정 enum만 반환하도록 전환했습니다. 원문/인증값/모델 key는 RPC·storage·로그에 반환하지 않습니다. 세션은 ID/status만 유지합니다.

원래 bridge UUID와 Chrome native document ID를 각각 검사합니다. 고정 top-frame/home boolean으로 native ID를 얻고 전후 원래 binding을 확인한 뒤 동일 문서 MAIN에만 실행합니다. 초기 실제 모델 capture는 pending 상태이며 private mode key/잠금을 유지하고 명시적 finish의 모델·key 재검사와 cleanup 뒤에만 done을 허용합니다. 새 generation/계정 API/prompt/upload는 없습니다.

최종 소스는 **431 단위·타입·빌드, 집중 준비 확인 31개(40.7초), 전체 synthetic174개(3.4분), installed-origin13개(22.1초)**를 순서대로 통과했습니다. 설치 fixture의 permission pregrant·inactive allocation shim·일반 extension-origin panel 한계는 유지됩니다. 최종 signal guard 이후의 실제 native 설치에서는 새 비활성 Gemini 홈 하나에서 **자동 모드 + 페이지 추가 보안 검사 켜짐**을 수집했습니다. 정확한 프로젝트 설치 ID/경로/버전과 reload 완료를 확인하고 실제 extension action/sidepanel을 사용했으며 manager 탭은 시험 중 계속 선택됐습니다. 최종 artifact 해시와 증거별 한계는 [검증 기록](../testing/validation.md)이 소유합니다.

초기 pre-dense native 성공 뒤 후속 artifact의 generic/model-selection/model-trigger 실패를 구분했습니다. 고정 단계 진단으로 required 모델 버튼 부재를 selection 오류와 분리하고, 입력란 준비가 모델 제어 준비를 보장하지 않음을 확인했습니다. Gemini는 기존 2.5초/80ms 준비 대기를 재사용합니다. 실제 모델 변경을 cleanup까지 감시하고, cleanup 안의 모든 예외를 고정 실패로 처리하며, 실패한 페이지의 mutation lock은 새로고침·재연결까지 유지합니다. 취소/페이지 변경 사유를 우선하면서 고정된 cleanup 실패만 내부에 보존합니다. 대기 중 취소 후 버튼이 복원되자 메뉴를 열던 회귀도 red로 재현했고, 기존 signal을 대기 직후 다시 검사해 UI 변경 전에 멈추도록 수정했습니다. 대기 수정 artifact의 native 세 번 연속 성공은 마지막 signal guard 이전의 역사적 증거이며 최종 artifact의 한 번 수용과 구분합니다.

최종 소유 홈은 native close 뒤 fresh absence로 폐쇄를 확인했고 manager 선택을 복원했습니다. 허가된 native helper도 종료 뒤 실제 부재를 확인했습니다. 최종 로컬 개발 ZIP은 테스트한 output과 12개 파일이 모두 일치하며 패키지 검사 결과는 [검증 기록](../testing/validation.md)에 보존합니다. 사용자 원본·다른 탭·설정은 수정하지 않았고 push·store 업로드·심사·공개 배포는 없습니다.

Task 11 수용 당시 Task 12의 [정상 client capability 사전 확인](gemini-client-capability-plan.md)은 계획 단계였으며 현재 진행 상태는 위 Task 12가 소유합니다. 보안 bootstrap 플래그를 실제 cached/injected 소비 상태와 같다고 추정하지 않습니다. 정상 transport·보호 경로·완료/readback과 Gemini 생성·원본 전달·메인 반환은 아직 미검증이며, 누락 attestation fallback이나 임의 직접 POST는 사용하지 않습니다. [진단 설계](gemini-protection-diagnostics-plan.md), [검증](../testing/validation.md), [실패 교훈](verification-lessons.md).

## 이전 Task 10: Gemini 준비 확인 — 2026-10-13

Gemini 현재 메뉴의 모델과 응답 깊이를 구분하고, 넓은 ARIA owner와 실제 좁은 `gem-button`/local popover owner를 각각 읽습니다. 실제 설치/native 두 번째 실행은 **자동 모드**를 반환했고 보안 상태는 **unknown**이어서 생성하지 않았습니다. 첫 compact 모델 읽기 실패와 수정 뒤 수용을 구분합니다. 보안 활성 여부나 unknown의 원인을 미확인 상태에서 단정하지 않습니다.

**연결 → Gemini 준비 확인**은 metadata-only 동작입니다. 새 inactive home, strict id/document/url RPC, 전송 아닌 확인 intent의 선저장·uncertain 복원·자동 재시작 없음·cleanup까지 mutation lock을 유지합니다. RPC에는 UI 모델 이름/고정 enum만, session에는 확인 ID/status만 남습니다. auth/account API/prompt/upload는 추가하지 않았습니다. 개발 도구로 실제 bootstrap/token/request body를 읽지 않았습니다.

최종 check는 340개·타입·빌드, full synthetic 151개(2.9분), installed-origin 11개(18.6초)와 독립 코드/UX 재리뷰를 통과했습니다. 설치 fixture의 permission/navigation/native 한계와 최종 exact artifact hashes는 [validation](../testing/validation.md)이 소유합니다. 초기 generic/error-copy 및 compact layout 수정 뒤의 실제 native 결과는 합성 성공으로 대신하지 않았습니다.

이전 Claude synthetic 결과는 native 기록 저장으로 다운로드 완료를 확인했습니다. 두 task-owned Gemini 홈은 실제 native close와 fresh absence로 정리하고 manager 선택/최종 패널 결과를 보존했습니다. 브라우저 REPL 종료0과 native helper의 실제 부재도 확인했습니다. 새 업로드·심사·공개 배포는 없습니다.

다음은 unknown 보호 상태를 값 유출 없이 확인하는 지원 경로, 정상 protection/transport, 현재 계정 mode/effort request mapping, text-only metadata와 exact CID/RID/RCID readback을 증명하는 별도 generation 단계입니다. 과거 Python recipe/SDK 실패 fallback/생략된 보호 값으로 요청하지 않습니다. Gemini 답변·파일·main 반환이 아직 미검증이라는 표시를 유지합니다. [계획](gemini-background-readiness-plan.md), [현재 client 조사](../research/background-web-transport.md).

## Task 9: 렌더된 원본의 Claude 검토 — 2026-10-13 완료 기록

현재 불러온 비-Claude 원본의 완료된 전체 캡처 Q/A와 직접 선택한 원본을 collect·economy review의 두 Claude 프롬프트에 공유합니다. 기존 원본 답변과 `importedRun`/`promptFor`를 재사용하고 두 요청의 전체 승인 범위를 유지합니다. 결과는 Claude의 독립 답변과 검토 답변이며 원래 메인에 새 요청/최종 synthesis를 보내지 않습니다. 기존 진단과 기본 전체 파이프라인은 유지합니다.

TXT는 변환 없는 UTF-8 각 64 KiB 이하, PNG는 실제 decoder로 확인한 각 축 4096 이하만 지원하며 기존 10개·총 20 MiB와 실제 바이트/해시 검사를 유지합니다. TXT inline 원본은 첫 생성에만, PNG는 모든 완료 receipt를 기다려 한 번만 업로드합니다. 정확한 first-human history가 전체 원본과 일치해야 전달 완료로 간주하고 review에 바이트가 없어도 전체 manifest·첫 history/receipt가 그대로여야 합니다. 미지원/누락/변경/불확실 상태에서 파일 없는 질문으로 대체하지 않습니다.

`Run.kind: 'claude-peer'`와 sending jobs는 먼저 저장되며 collect → review만 허용합니다. 새 비활성 홈에 연결한 `Binding.threadId`는 확장 로컬 UUID이고 backend 대화/메시지/모델/receipt IDs는 provider 페이지에만 둡니다. snapshot·reconnect·UI equality에서 로컬 소유권을 유지하고 inspect/receipt 불일치를 거부합니다. 정상 saved Claude 연결은 그대로 검사하고 ordinary unbound Claude는 예약 peer 대신 새 홈을 만듭니다. 이미 시도한 session이 없어지면 대체 대화·DOM fallback·retry 없이 멈춥니다.

| 구분           | 확인한 checkpoint                                                                                                                                               | 한계                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 타입·단위·빌드 | 최종 304 단위·타입·빌드 통과                                                                                                                                    | architecture 경계 포함, pinned Node24                                                                   |
| 합성·설치      | 최종 전체 합성 132개·2.8분, installed-origin9개·20.0초 통과                                                                                                     | fixture pregrant/allocation shim/일반 extension panel은 native 수용과 다름. TXT/PNG와 한 번 업로드 포함 |
| 실제 텍스트    | 실제 native에서 원본 두 Q/A → Claude collect·동일 대화 review 두 답변. 원본/foreground 유지                                                                     | 텍스트만·최종 ownership 수정 전 artifact                                                                |
| 실제 파일      | 최종 native 설치에서 파일이 있는 원본 세 Q/A와 picker로 다시 선택한 TXT/PNG → 두 Claude 답변. 각각 문맥·검증 문자열·이미지 설명 포함, 원본3 Q/A/foreground 유지 | 엄격한 product receipt/history 검사 수용. 서버 바이트 해시·모든 파일 형식은 입증하지 않음               |
| 리뷰·수정      | peer A/B reconnect의 ownership 손실을 red 회귀로 재현·수정 후 전체 독립 재리뷰 통과                                                                             | 중요한 미해결 finding 없음. 최신 최종 코드·설치·native 검사와 정리 완료                                 |

성공 뒤 소유한 Claude 홈 두 개·AgentTabs 두 개만 닫고 원래 source/완료 panel을 유지했습니다. REPL 종료0과 허가된 native helper 프로세스 부재도 확인했습니다. 파일 protocol의 공개 JS와 정제한 합성 일반-UI history 근거, 로컬 bytes→receipt→history 증명의 한계는 [전송 조사](../research/background-web-transport.md), 최종 artifact 해시·수용은 [검증 기록](../testing/validation.md)이 소유합니다. GET→POST는 원자적이지 않으며 arbitrary 기존 메인 HTTP 이어쓰기·다른 공급자 background 전환·전체 workflow migration은 입증하지 않습니다. [peer 계획](claude-peer-review-plan.md).

## 이전 Task 8: 합성 문맥·후속 응답 진단 — 2026-10-13

연결의 접힌 진단 안에 **문맥·후속 응답 시험 시작**을 추가했습니다. 고정된 합성 질문·답변 두 쌍을 한 번 전달해 `CROSSCHECK_CONTEXT_OK/47`을 받고, 같은 새 테스트 대화에서 원본을 다시 포함하지 않는 후속 질문으로 `47/CROSSCHECK_CONTEXT_OK`를 확인합니다. 개인 대화나 파일을 가져오는 기능은 아니며 정상 완료에는 정확히 두 번의 POST가 필요합니다. 기존 한 요청 시험은 그대로 남습니다.

**첫 실제 문맥 시험이 성공했습니다.** 2026-10-13 같은 production 설치 경로 `.output/chrome-mv3`의 CrossCheck 0.4.0을 새로고침하고 새 진단 동작을 확인한 뒤 실제 Aside native 사이드패널에서 시작 → 진행 중 → 완료를 관찰했습니다. 화면에 `First reply: CROSSCHECK_CONTEXT_OK/47`과 `Follow-up reply: 47/CROSSCHECK_CONTEXT_OK`가 함께 표시됐습니다. 기존 확장 관리 탭은 계속 선택됐고 Chrome이 생성한 새 Claude 홈 탭은 비활성이었습니다. 제품의 두 POST·엄격한 네 메시지 readback 경로로 완료한 증거이며 개발 도구의 수동 POST·어댑터 주입으로 대체하지 않았습니다.

첫 답변은 예상값·완료 스트림·정확한 대화의 두 메시지 readback을 모두 확인해야 합니다. 두번째 POST 직전 같은 대화를 다시 GET해 첫 쌍·leaf·모델·내용·관계가 바뀌지 않았는지 확인하고 실제 모델 표시·문서/정확한 URL·중단도 재검사합니다. 첫 검증된 assistant만 후속 parent로 사용하며 생성 매개변수는 첫 요청에만 있습니다. 최종 readback은 같은 대화/모델, 네 개의 고유 메시지와 정확한 parent/leaf, 불변인 첫 쌍, 두 예상 답변·authoritative text-only content·빈 첨부·잘림 없음·정상 종료를 요구합니다. 실패하면 추가 전송·자동 재시도·DOM 대체 없이 멈춥니다.

세션 기록은 `{ id, status, kind? }`뿐이며 `kind: 'context'`는 두 요청 계획을 구분합니다. 답변·조직/모델/대화/메시지 참조·인증값은 저장하지 않습니다. 복원한 진행 기록은 불확실로 표시하고 자동 재개하지 않습니다. 공개 asset을 인증정보 없이 GET해 현재 parent/최초 생성 경로를 확인했지만 GET과 POST는 원자적이지 않습니다. 사이의 원격 변경은 최종 readback으로 탐지할 수 있어도 요청 전에 모두 막을 수는 없으므로 새 비민감 테스트 대화에만 적용합니다. 임의 기존 메인 대화 이어쓰기·파일·다른 공급자는 미해결입니다.

| 구분           | 현재 Task 8 증거                                                                                                         | 한계                                                                                                                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 타입·단위·빌드 | `npm run check`, 단위 219개·타입·빌드 통과                                                                               | 2026-10-13 15:53 KST. 실제 두 턴 성공과 별도                                                                                                                                                                                           |
| 합성 브라우저  | 관련 14개 통과, 12.8초. 전체 130개 통과, 3.1분·exit 0                                                                    | 2026-10-13 live 뒤 같은 제품 소스로 재빌드. 아래 Task 7 결과와 구분                                                                                                                                                                    |
| 설치 확장      | fixture 수정 후 7개 통과, 최종 11.5초                                                                                    | 실제 주입/RPC/readback/session/UI/origin 검사. 문맥 case는 미리 연 합성 탭을 test-only `tabs.create` shim으로 반환하고 manifest로 Claude 권한을 미리 허용하므로 실제 비활성 새 탭 생성·권한 prompt·네이티브 side panel을 입증하지 않음 |
| 실제 로그인    | 첫 native 문맥 시험: 두 예상 답변·같은 새 대화/네 메시지 검증·패널 완료 성공. 기존 활성 탭 유지·새 Claude 탭 비활성 확인 | 고정 합성 두 Q/A 쌍과 그 대화의 후속 한 번만. 실제 원본 가져오기·파일·다른 공급자·메인 이어쓰기는 미검증                                                                                                                               |
| 리뷰·정리      | production 및 test-only fixture 재리뷰에 중요한 결함 없음. 소유 테스트 탭·브라우저 REPL·native helper 종료 확인          | 새 관찰로 확인했으며 관련 없는 사용자 탭은 변경하지 않음                                                                                                                                                                               |

첫 설치 문맥 fixture의 새 탭 탐색은 Playwright route를 벗어나 실제 사이트의 Cloudflare challenge에 도달했습니다. 실패 trace와 red 산출물은 Git 제외 `.superpowers/sdd/red-evidence/context-installed`에 보존했고 보안 검사를 우회하지 않았습니다. fixture만 미리 연 등록 합성 탭을 반환하도록 고쳤으며 생산 코드는 이 shim을 사용하지 않습니다. 설치 검사의 extension-origin 일반 탭은 native 패널·새 비활성 생성의 증거가 아니며 위의 별도 실제 시험이 그 경로를 확인했습니다.

완료 후 작업이 만든 새 Claude 홈 탭만 선택·주소 확인 후 닫았습니다. 새 native 관찰에서 확장 관리 탭 선택·두 답변 완료 표시는 유지됐고 새 Claude 홈 행은 없었습니다. 이전 Aside REPL은 사용자 입력 전환으로 끝났으며 프로세스 목록에서 남은 REPL이 없음을 확인했습니다. 조사 agent 탭은 native 시험 전에 이미 없어졌고 개인 사용자 탭은 변경하지 않았습니다. 허가된 native helper도 종료하고 정확한 프로세스 조건으로 부재를 다시 확인했습니다. 새 업로드·심사 제출은 없었고 공개 0.4.0과 이 로컬 실험 빌드는 구분합니다.

## 이전 Task 7: 한 요청 연결 시험 — 2026-10-12

사용자는 별도 개발자 API 대신 기존 웹 로그인·구독을 유지하고, 필요한 인증 처리를 공급자 페이지의 임시 메모리 안에서만 수행하는 경계를 확인했습니다. **연결 → 백그라운드 연결 시험**은 비활성 새 Claude 홈 탭을 만들고 실제 현재 모델을 확인한 뒤 `Reply with CROSSCHECK_OK only.` 한 요청을 보냅니다. 브라우저 관리 쿠키를 같은-origin 요청에 자동 사용하며 쿠키·토큰을 읽거나 복사하지 않습니다. 계정 참조는 해당 페이지 안에만 있고 세션에는 시험 ID·상태만 저장합니다.

시험은 유일한 채팅 capability 조직·유일한 현재 모델 대응·텍스트 응답만 지원합니다. API 전용 조직은 채팅 대상에서 제외하고 채팅 조직이 없거나 둘 이상이면 멈춥니다. 정확한 페이지 주소를 각 요청 직전에 다시 확인하고, 새 assistant/parent UUID·닫힌 텍스트 블록·`end_turn`·`message_stop`이 모두 맞아야 완료입니다. 중단·패널 종료·페이지 변경·부분 응답은 자동 재전송하거나 DOM으로 대체하지 않습니다. ChatGPT는 조사한 클라이언트의 Sentinel 계산을 채택하지 않아 직접 생성 경로가 미해결이고, Gemini·TXT/PNG·후속 요청·원래 메인 최종 반환도 미검증입니다.

**당시 한 요청 실계정 시험은 성공했습니다.** 2026-10-12 실제 설치 경로의 CrossCheck 0.4.0을 새로고침하고 네이티브 패널에서 연결 → 고정 시험 시작 → 진행 중 → **연결 시험 완료 · CROSSCHECK_OK**를 확인했습니다. 23번째 시도의 새 Claude 탭은 비활성이었고 기존 확장 관리 탭 선택도 유지됐습니다. 이는 이전 빌드의 비민감 고정 텍스트 한 요청 증거이며 현재 Task 8의 두 요청 성공이나 ChatGPT·Gemini·전체 문맥·파일·원래 메인 반환을 뜻하지 않습니다. [실험 계획](background-web-transport-plan.md)과 [전송 조사](../research/background-web-transport.md)를 함께 읽습니다.

| 구분           | 이전 Task 7 기록                                                                                                                   | 한계                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 타입·단위·빌드 | 당시 `npm run check`·단위 190개·타입·빌드 통과                                                                                     | 2026-10-12 17:33 KST. 실제 서비스와 별도                                                                         |
| 합성 브라우저  | 관련 20개와 최종 전체 126개 통과                                                                                                   | 전체 검사는 동일 소스에서 재빌드한 `npm run test:e2e`, 5.6분. 실제 로그인 서비스와 별도                          |
| 설치 확장      | 당시 5개 통과. 20 ms 메뉴 cleanup 전 값 캡처·포커스 유지 포함                                                                      | 17:35 KST. 메뉴 회귀는 test-only 복사 manifest로 Claude를 미리 허용하므로 실제 권한 prompt는 미검증              |
| 실제 로그인    | 23번째 네이티브 시험에서 고정 요청·엄격한 스트림/대화 readback·패널 `CROSSCHECK_OK` 수집 성공. 기존 활성 탭 유지·새 탭 비활성 확인 | 실제 웹 로그인·구독의 단일 고정 텍스트만. 전체 3개 서비스·파일·최종 반환은 미검증                                |
| 독립 리뷰      | 최종 production·회귀 source의 중요한 결함 없음                                                                                     | 리뷰와 실제 실행 증거는 구분                                                                                     |
| 포맷           | 이번 변경 파일의 Prettier 검사와 diff 공백 검사 통과                                                                               | 전체 검사는 기존 HEAD와 같은 문서 4개 및 Git에서 제외된 로컬 실패 증거의 형식 경고. 원문 증거와 기존 문서는 보존 |

첫 네이티브 시험 뒤 모델 표시명에 effort 설명이 붙는 형태를 내용 없는 UI 메타데이터로 확인했습니다. 선택된 메뉴 항목을 읽도록 수정했고, 모델명 wrapper의 `textContent`가 설명·아이콘 텍스트까지 합치는 별도 결함도 합성 회귀에서 재현했습니다. wrapper의 실제 표시 첫 줄을 읽는 최소 수정 뒤 즉시·지연 메뉴 회귀 2개가 통과했습니다. 실패 사유는 원문 대신 고정 단계값으로만 전달합니다.

아래 실패는 **현재 수정 전 역사**입니다. 세번째 시험은 조직 총수 조건 때문에 멈춰 유일한 채팅 capability 기준으로 수정했습니다. 다섯번째는 구 `claude_ai_bootstrap_models_config`가 null이어서 POST 전 중단했으며 정적 기본값으로 대신하지 않았습니다. 현재는 닫힌 모델 버튼의 고유 표시를 bootstrap의 선택 chat state·활성 config·유일한 available ID에 대응시켜 메뉴를 열지 않습니다. MAIN-world 활성화 시도는 폐기하고 제품 파일·포트를 제거했습니다.

20번째는 실제 생성 후 수집에서 실패했고 21/22번째는 서버가 두 요청 메시지 ID를 바꾸는 원인을 확인했습니다. 현재는 서버 SSE ID를 임시값으로 받고, 정확한 새 대화의 고정 human 내용·고유 메시지 둘·sender/parent/leaf·text-only content·선택 모델·빈 첨부·잘림 없음·정상 종료를 독립 GET으로 확인한 뒤 반환합니다. content가 authoritative이며 legacy `text`는 빈 문자열 또는 같은 값만 허용합니다. 명시된 stream model은 요청 모델과 같아야 합니다. 추가 POST·자동 재시도 없이 23번째 실제 패널 수집을 통과했습니다. 상세 교훈은 [verification-lessons.md](verification-lessons.md)에 정리했습니다.

Task 7 당시에는 스토어 조회·업로드·제출 없이 자신이 만든 Claude 시험 탭을 정리했고 관련 없는 탭·확장 관리 탭 선택·완료 표시를 보존했습니다. 브라우저 REPL 정상 종료와 허가된 helper 종료·실제 프로세스 부재도 확인했습니다. 이 정리 증거는 현재 Task 8 작업의 종료를 뜻하지 않습니다.

## 먼저 읽을 파일

- `README.md`: 설치와 사용 흐름
- `docs/architecture/overview.md`: 단방향 의존성과 도메인 경계
- `docs/testing/validation.md`, `docs/testing/live-login.md`: 검증 범위와 남은 실제 E2E
- `docs/research/chatgpt-compatibility.md`: ChatGPT 화면 변경 조사, 확인된 표식과 추정한 호환 후보의 구분
- `docs/research/references.md`, `docs/research/ui-decisions.md`: OSS·UI 근거와 라이선스
- `docs/research/background-web-transport.md`, `docs/development/background-web-transport-plan.md`: 내부 호출 실험·범위·현재 증거
- `docs/security/privacy.md`: 데이터와 브라우저 권한의 경계
- `docs/release/updates.md`, `docs/release/release-checklist.md`: 업데이트와 출시 전 차단 사항

핵심 코드는 `src/application/automatic-workflow.ts`, `src/infrastructure/chrome/provider-client.ts`, `src/infrastructure/providers/`, `entrypoints/bridge.ts`, `src/presentation/shell/App.tsx`, `src/presentation/providers/ConnectionSettings.tsx`입니다. 테스트 데이터는 `tests/fixtures`에만 둡니다.

## 로컬 환경 준비

기존 체크아웃이 없다면 `https://github.com/baba9811/multi-ai-checker.git`의 `main`을 클론합니다. 기존 사용자 변경은 보존합니다. Node 24와 잠금 파일을 사용해 `npm ci`를 실행합니다.

`npx playwright install chromium`으로 Playwright 관리 브라우저를 준비합니다. 기본 설정은 이 브라우저를 사용합니다. 필요한 경우에만 현재 기기에 실제로 존재하는 실행 파일을 `CHROMIUM_PATH`로 지정합니다. 다른 OS의 경로를 복사하지 마세요. 실제 확장 테스트는 unpacked 확장을 허용하는 Chromium 환경이 필요합니다. 기기의 관리 정책은 우회하지 않습니다.

검증 명령은 `npm run check`, `npm run test:e2e`, `npm run test:e2e:extension`입니다. `.output`과 브라우저 상태를 공유하므로 빌드·브라우저 검사는 순서대로 실행합니다. 확장 설치 폴더는 `npm run build`가 만드는 `.output/chrome-mv3`입니다. 설치는 빌드 → 해당 `manifest.json` 폴더 선택 → 설치 버전 확인 → 실제 사이드패널 열기 → 기존 AI 탭 새로고침 순서로 확인합니다. 패키지는 검증한 소스에서 `npm run zip`으로 만들고 실제 ZIP을 검사합니다. 빌드 산출물은 Git에 포함하지 않습니다. 테스트용 Vite 서버는 Playwright가 자동으로 시작·종료합니다.

실계정 검증에는 확장 설치가 허용된 Chrome 프로필을 사용하고 사용자가 원래 사이트에서 직접 로그인하도록 합니다. 로그인 정보·쿠키·세션 토큰을 요청하거나 기본 개인 프로필을 복사하지 마세요. 기존 작업을 끝내고 필요한 **기록 저장**을 마친 뒤 확장 교체·새로고침을 진행합니다.

## 원본·연결·복원 규칙

**현재 탭에서 가져오기 / 현재 탭으로 변경**으로 원본을 읽고 고정합니다. 연결에서 다른 AI 탭을 열어도 고정한 메인은 바뀌지 않습니다. **원래 대화로 돌아가기**로 확인할 수 있으며, 최종 종합은 그 원본 탭·주소·문서에만 전송합니다. 수동으로 대화를 바꾸거나 새로고침한 기존 연결을 자동으로 다시 붙이지 않습니다. 수동 **연결** 또는 **로그인 완료 · 다시 확인**이 명시적인 재연결이며, 이미 시작한 검토의 대상 변경을 허용하는 기능은 아닙니다.

대화의 첨부를 썸네일에서 복원하지 않습니다. **파일 선택**에서 파일·이미지 원본을 모두 고르고 **원래 대화의 파일·이미지를 모두 선택했습니다**를 체크해야 시작할 수 있습니다. 첨부가 없는 원본은 **원래 대화에 첨부파일이 없습니다**로 확인합니다. 최대 10개·합계 20 MB이고 사이트별 제한도 적용됩니다. 각 공급자의 첫 요청에 같은 원본을 전달하며, 업로드 준비를 확인하지 못하면 전송하지 않습니다. 이후 같은 공급자의 검토 요청에 파일을 반복 첨부하지 않습니다.

파일 원본은 패널 메모리에만 있습니다. 패널을 닫았다 다시 열면 계속하기 전에 이름·크기·형식·SHA-256이 일치하는 원본을 다시 선택해야 합니다. 세션 기록은 전송 의도와 첨부 메타데이터를 저장하며, 중단되거나 전송 여부가 불확실한 요청을 자동 재시도하지 않습니다. 확장 비활성화·새로고침·업데이트·브라우저 재시작은 세션 기록과 연결도 지웁니다. 이 경우 이전 검토 복원을 약속하지 않고 새 검토로 시작합니다. 스토어 설치본은 Chrome 자동 업데이트를 사용하며, 진행 중 강제 새로고침이나 주기적 업데이트 확인을 하지 않습니다.

## 로컬에서 우선 해결할 일

1. 완료한 Claude 원본·TXT/PNG collect/review를 다시 구현하지 말고, 다음 Gemini 내부 경로와 원래 메인 반환을 각각 검증합니다. 이 경로들이 입증되기 전 기본 전체 검토를 내부 호출로 바꾸지 않습니다. 새 환경에서는 현재 code/설치/account 상태를 먼저 확인하고 합성/설치나 이전 artifact 결과를 새 실계정 증거로 옮기지 않습니다.
2. 과거 제거·재설치 증거와 현재 설치본을 구분합니다. 스토어 설치본 자동 업데이트는 공개 배포 후 별도로 확인해야 하며, 압축해제 설치 새로고침으로 대신하지 않습니다.
3. 실제 계정의 모델 메뉴 읽기·선택, 비로그인 연결 과정, 실제 웹 검색 실행은 각각 별도로 확인합니다. 없는 모델·구독 권한·잔여 쿼타를 추측하지 않습니다. 메뉴 미지원 시 웹의 현재 모델을 유지한다고 표시합니다.
4. 대화 변경·새로고침·작성 중인 메시지·중단/패널 종료·업로드 실패·쿼타 제한 때 잘못 전송하거나 자동 재시도하지 않는지 확인합니다. 실패는 재현 후 관련 어댑터와 최소 회귀 검사로 해결합니다.
5. 현재 스토어 상태를 새로 확인하고 승인·게시·실제 검색 노출을 각각 기록합니다. 이 실험을 심사 중 패키지에 덮어쓰거나 불확실한 제출을 재시도하지 않습니다. 새 출시 전 검증 소스의 ZIP·권한·라이선스·이미지·개인정보·리뷰어 안내를 맞추고 [출시 조건](../release/release-checklist.md)을 확인합니다. 스토어 승인을 공급자의 허가로 간주하지 않습니다.

다수 모델의 합의를 사실 검증으로 표현하지 마세요. 확인한 1차 자료와 미확인 주장을 구분하도록 요청하되 실제 검색·출처 정확성을 보장하지 않습니다. 계정 순환·쿼타 우회·CAPTCHA 우회·쿠키/토큰 추출은 구현하지 않습니다. 내부 호출 실험은 위의 좁은 인증·요청 경계 안에서만 진행합니다. 도메인별 코드·문서·데이터 분리와 단방향 의존성, 간결한 UI를 유지합니다.

## 공개 문서와 제출한 등록정보 — 과거 기록

아래는 2026-10-07 제출 시 확인한 정보입니다. 현재 스토어 상태를 재확인한 기록이 아닙니다.

사용자가 지정한 공개 연락처는 `bany981111@gmail.com`입니다. `docs/security/privacy-notice.html`을 전용 `codex/privacy-notice` 브랜치에서 https://baba9811.github.io/multi-ai-checker/ 로 게시했고, 제출 전 비로그인 HTTPS 200 및 원본 바이트 일치를 다시 확인했습니다. 개발 브랜치 전체를 게시하지 않습니다. 스토어 항목 ID는 `jkffbjajcmbcobmgbcilenbpjfemapki`입니다. 제한된 GitHub OIDC와 키 없는 전용 서비스 계정을 이용한 릴리스 업로드는 검증됐습니다. 제출은 대시보드에서 수행했으며 당시 GitHub의 `CWS_SUBMIT=false`도 다시 확인하고 유지했습니다. 세부 설정과 복구 절차는 [배포 자동화](../release/automation.md)가 소유합니다.

제출한 항목의 공개·전체 지역, 도구 카테고리, 지원 링크, 아이콘·실제 UI 합성 스크린샷 2개·작은 홍보 이미지, 개인정보와 권한 설명, 리뷰어 안내, 세 데이터 사용 확인을 확인했습니다. 한국어 설명은 기능과 사용 단계 중심으로 다듬되 자동 전송·대화와 원본 파일 공유·서비스 계정 및 한도·비공식 제품임을 명시했습니다. 실제 제출 문안은 [스토어 등록정보](../release/store-listing.md)가 소유합니다. 당시 공개 검색 결과는 확인되지 않았습니다. 제출 때의 브라우저 DOM 제어 세션은 종료했고 네이티브 컴퓨터 제어는 사용하지 않았다는 기록도 보존합니다. 이 기록은 현재 실험의 설치·실계정 검사와 구분합니다.
