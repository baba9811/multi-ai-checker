# 보안과 개인정보

## 권한과 데이터 경계

| 항목           | 동작                                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| `sidePanel`    | 사용자 작업 화면                                                                                               |
| `storage`      | 브라우저 세션 메모리 기록. sync/local 대화 저장 없음                                                           |
| `scripting`    | 선택한 탭의 top frame에 로컬 ISOLATED bridge와 동일 문서의 고정 MAIN 보안/클라이언트 준비 메타데이터 함수 실행 |
| `activeTab`    | 사용자가 연 확장에서 현재 탭 선택                                                                              |
| Optional hosts | chatgpt.com / claude.ai / gemini.google.com의 HTTPS만, 시작 시 선택한 origin만 허용                            |

쿠키·비밀번호·로그인 토큰을 조회하지 않습니다. 확장 백엔드, telemetry, 별도 개발자 API, remote code, web-accessible resource, `postMessage` 명령 채널이 없습니다. 확장 화면의 CSP는 외부 네트워크와 실행 코드를 막으며, 공급자 페이지에서 실행되는 bridge의 같은-origin 요청과는 구분합니다. 연결을 해제하면 해당 origin 권한을 제거합니다.

MAIN-world에서 모델 메뉴를 활성화하는 Task 5는 폐기했고 해당 제품 파일·명령·포트를 제거했습니다. 명시적 Claude 내부 요청은 ISOLATED bridge가 닫힌 모델 표시와 계정 상태를 검증하는 경로입니다. Task 11의 Gemini 준비 확인은 별도 순수 MAIN-world 함수로 현재 페이지의 보안 플래그만 해석하고 고정 enum을 반환합니다. 실제 bootstrap/인증값은 그 페이지 밖으로 반환하거나 저장하지 않으며 네트워크·DOM 변경·전역 export·이벤트 명령 채널·임의 요청 proxy가 없습니다. 원래 bridge 문서와 별도 Chrome 문서 ID를 각각 검사하고 top frame의 동일 문서에만 실행하며, 실제 모델 재검사와 정리까지 pending 잠금을 유지합니다. 이 플래그 확인만으로 공식 클라이언트의 실제 필수 보안 검사나 생성 성공을 입증하지 않습니다. [진단 설계](../development/gemini-protection-diagnostics-plan.md).

Task 12의 동기 MAIN 실제 consumer preflight도 같은 pending 문서/모델 경계를 사용합니다. 정확한 compact model host·정해진 container/declaration/TNode·native `sV` consumer 소유권과 [source profile](../research/background-web-transport.md)을 검증하고, 이미 생성된 그 consumer의 own selected service/API 참조만 읽습니다. Root cache를 조회하거나 runtime getter·injector resolver·factory·provider method를 호출하지 않으며, 서비스/연결 생성·네트워크·DOM 변경·credentials 조회·새 권한이 없습니다. 내부 context ID·service/API 참조·flag 값·오류 원문은 반환하지 않고 strict `candidate` 또는 `unsupported`의 고정 사유만 내보냅니다. Client metadata는 열린 패널의 일시적 결과이며 session은 기존 ID/status만 저장합니다. 정상 transparent proxy를 배제하거나 root factory 출처를 입증하지 않으며, candidate는 필요한 attestation·dispatch·`Rzc` callback·생성/응답·모델 사용 권한의 증명이 아닙니다. [구현 범위](../development/gemini-client-capability-plan.md)와 [증거별 수용 한계](../testing/validation.md)를 함께 따릅니다.

이전 한 요청/고정 합성 문맥 진단과 현재 렌더된 원본 검토는 서로 다른 milestone입니다. 최종 Task 9 artifact는 실제 native panel의 세 Q/A·TXT/PNG collect/review 수용을 마쳤으며 artifact별 근거는 [검증 기록](../testing/validation.md)이 소유합니다.

선택한 서비스에는 패널에서 공유 범위를 확인한 여러 턴의 질문과 답변·검토·근거 및 직접 선택한 원본 첨부파일을 보냅니다. 해당 서비스는 자신의 로그인 쿠키와 기존 대화 맥락을 사용하며, 그 서비스의 데이터 처리 정책이 적용됩니다. 확장은 서비스의 보관·학습 설정을 변경하지 않습니다.

첨부 원본은 열린 패널의 메모리와 전송 대상 탭의 일시적인 업로드 처리에만 사용하며 저장소에 기록하지 않습니다. 세션에는 파일 이름·크기·형식·SHA-256 확인값을 보관합니다. 기존 대화의 파일 원본이나 썸네일을 자동 수집하지 않습니다. 패널을 닫거나 새로고침한 뒤 계속하려면 같은 원본을 다시 선택해야 합니다. 전송 경계에서 개수·합계 크기·인코딩을 검사하고, 업로드 전에 원본 해시를 검증합니다. 파일 업로드 자체로 대상 AI 서비스에 데이터가 전달되므로 전송이 실패해도 업로드된 파일은 해당 서비스에 남을 수 있습니다.

## 선택적 Claude 원본 검토

**Claude 백그라운드 검토**는 불러온 현재 렌더된 비-Claude 대화와 직접 고른 TXT/PNG 원본을 collect·economy review의 두 Claude 요청에 공유하는 별도 동작입니다. 원래 메인 답변을 재사용하고 두 프롬프트에 모든 승인된 캡처 내용·파일 metadata를 유지하며 원래 메인에는 새 요청이나 synthesis를 보내지 않습니다. 기본 전체 DOM 동작은 바꾸지 않습니다. `Run.kind: 'claude-peer'`와 각 sending job을 먼저 저장하며 복원 때도 이 intent를 일반 실행/메인 전송으로 바꾸지 않습니다.

원본은 전체 승인 manifest·실제 크기·SHA-256을 확인한 뒤 전송합니다. 이 경로는 UTF-8 TXT 각 64 KiB 이하(변환/BOM/NUL 없이), PNG 각 축 4096 이하의 원본만 지원하고 기존 10개·총 20 MiB 한도를 유지합니다. 형식 밖·누락·변경된 원본은 업로드/생성 전에 거부합니다. TXT는 첫 요청의 정확한 inline attachment이며 PNG는 native 디코딩·현재 모델 이미지 capability를 확인하고 같은-origin multipart로 원본을 한 번만 업로드합니다. 모든 success/image receipt를 기다리고 첫 human saved-history에 정확한 TXT 내용/metadata와 PNG receipt가 들어간 것을 확인해야 전달 완료입니다. review에 새 바이트가 없어도 전체 manifest가 같아야 하고 첫 원본/receipt history가 그대로여야 합니다.

서버 organization/model/conversation/message IDs, upload receipts와 검증한 history는 provider 페이지 closure에만 존재합니다. 쿠키/토큰 값은 읽지 않고 브라우저가 같은-origin 쿠키를 부착합니다. 확장이 만든 로컬 UUID `threadId`만 binding/snapshot/session receipt 동등성에 사용하며 backend 대화 ID가 아닙니다. 재연결·UI binding 갱신에서 소유권을 보존하고 불일치를 거부합니다. 정상 saved Claude 연결은 정확히 검사하며 unbound ordinary Claude는 예약 peer를 재사용하지 않고 새 홈을 만듭니다. 시도된 peer가 reload·문서/URL 변경·중단·heartbeat 상실로 session을 잃으면 새 대화 할당·DOM fallback·자동 retry 없이 멈춥니다.

peer의 질문·검증된 두 답변·파일 metadata는 기존 Workspace의 Chrome 세션 수명 안에 저장하고 파일 바이트·backend 참조·인증값은 저장하지 않습니다. 아래 진단의 `{ id, status, kind? }` 기록과는 다릅니다. 원본 캡처는 매 요청 전 다시 일치해야 하며 same-conversation exact prompt/answer·sender/parent/leaf·모델·full file membership·잘림 없음·정상 완료를 확인합니다. peer history GET만 최대 8 MiB로 제한하고 진단/계정/업로드 JSON·SSE의 기존 1 MiB와 prompt 100,000/answer 14,000 문자 한도는 유지합니다. 데이터 경계와 현재 결과는 [아키텍처](../architecture/overview.md), [검증](../testing/validation.md)이 소유합니다.

파일 증명은 확인한 로컬 바이트→업로드 receipt→정확한 history 참조의 연결입니다. 서버 바이트 해시를 독립 확인한 것은 아니고 signed preview URL을 가져오지 않습니다. 업로드가 수락되면 불확실한 생성/중단 뒤에도 파일은 Claude에 남을 수 있습니다. GET→POST는 원자적이지 않아 최종 history로 원격 변경을 탐지해도 이미 수락된 요청을 취소하지 못합니다. 임의 기존 메인 대화 이어쓰기와 다른 공급자 전환은 별도 미검증입니다.

## 실험용 Claude 연결 시험

기존 **백그라운드 연결 시험**과 선택적인 **문맥·후속 응답 시험**도 그대로 유지합니다. 비활성 새 탭의 ISOLATED bridge가 `credentials: 'same-origin'`으로 요청하므로 브라우저가 인증 쿠키를 부착하며 JavaScript로 쿠키·토큰을 읽지 않습니다. 조직·모델·대화·메시지 참조는 공급자 페이지의 일시적인 메모리 안에서만 처리하고, 확장 메시지·저장소·진단·개발자 서버로 보내지 않습니다. 기존 origin 권한을 사용하며 쿠키 조회 권한을 추가하지 않습니다.

기존 시험은 고정된 비민감 문장 한 번과 빈 첨부 목록을 보냅니다. 선택적 문맥 진단은 공개된 합성 질문·답변 두 쌍을 첫 요청에 담고, 같은 새 테스트 대화에 원본이나 예상 답변을 포함하지 않는 고정 후속 질문을 한 번 보냅니다. 정상 완료는 정확히 두 POST이며 첫 검증 실패 시 후속 요청 없이 멈춥니다. 개인 대화·원본 파일을 가져오거나 임의 기존 대화에 이어쓰지 않습니다.

채팅 capability 조직은 정확히 하나여야 하며 API 전용 조직이나 첫 조직을 임의로 선택하지 않습니다. 닫힌 소유 버튼의 첫 표시 텍스트에서 모델 이름만 읽고 별도 effort 표시를 합치지 않습니다. 같은-origin `app_start`에서 유일한 선택 chat state의 모델, 그 모델의 활성 config 표시명, 중복 없는 available-model ID 목록을 정확히 대응시켜야 합니다. 누락·중복·비활성 사유·UI 표시와 불일치를 거부하고 계정 응답 크기를 제한합니다. POST 직전 UI 표시를 다시 읽어 변경 시 멈추며 모델 요청 키는 공급자 페이지 메모리에만 둡니다.

일반 모델 메뉴에서 필요한 값은 메뉴가 표시된 동안 캡처하고 닫힘을 확인한 뒤 반환합니다. 닫히거나 분리된 메뉴의 텍스트를 뒤늦게 읽어 설명·아이콘을 모델 이름으로 오인하지 않습니다. 고정 시험의 모델 읽기는 메뉴 열기·닫기를 사용하지 않습니다. 정적 모델 ID나 플랜 tier 추정으로 계정 권한을 대신하지 않습니다. 임의 URL·헤더·프롬프트 대리 호출, 보안 검사 해결, 재시도, DOM 대체 전송은 없습니다.

서버 스트림의 서로 다른 유효한 human/assistant UUID는 임시 참조로만 받아들입니다. 텍스트 블록 닫힘·`end_turn`·`message_stop` 뒤 **확장이 새로 만든 정확한 대화 UUID**의 bounded GET으로 고정 human 문장·고유 메시지·스트림 ID/답변·sender/parent/leaf·요청 모델을 검증합니다. 한 요청 완료에는 정확히 두 메시지가 필요합니다. authoritative text-only content는 고정 문장/스트림 답변과 같아야 하며 legacy `text`는 빈 문자열 또는 같은 값만 허용합니다. 빈 첨부/files/sync_sources, `truncated: false`, 정상 종료도 필요하고 명시된 stream model 불일치는 거부합니다. UUID 형식만 맞는 출력은 완료가 아닙니다.

문맥 진단은 첫 답변의 정확한 예상값과 두 메시지 readback을 확인하고, 두번째 POST 직전 같은 대화를 다시 GET해 첫 쌍·leaf·모델·내용·관계가 그대로인지 검사합니다. 실제 모델 표시와 문서/URL·중단을 다시 확인한 뒤 첫 검증된 assistant를 후속 parent로 사용합니다. 두번째 요청에는 새 대화 생성 매개변수가 없습니다. 마지막 readback은 네 개의 고유 메시지·불변 첫 쌍·올바른 후속 parent/leaf와 두 예상 답변을 모두 요구해야 두 답변을 패널에 반환합니다. 부분 성공·불확실한 결과를 재전송하거나 다른 방식으로 대체하지 않습니다. 실패 사유에는 고정된 단계값만 포함하며 서버 원문·계정 참조·인증정보는 제외합니다.

세션에는 `{ id, status, kind? }`만 저장합니다. 상태는 `pending`/`done`/`uncertain`이며 선택적 `kind: 'context'`는 시작 전에 공개한 두 요청 계획을 구분합니다. 답변·backend 참조·인증값은 저장하지 않고 검증된 답변은 열린 패널 메모리에서만 표시합니다. 패널 종료·중단·새로고침 후 자동 재개하지 않습니다. 서버에서 이미 처리됐거나 계속 생성되면 시험 대화가 Claude에 남을 수 있으며 사용자가 사이트에서 확인·삭제해야 합니다. 기본 DOM 검토는 그대로이고 임의 기존 문맥·파일·메인 최종 반환은 검증하지 않습니다. [조사 및 검증 범위](../research/background-web-transport.md).

## 공격/오작동 방어

- 모델 출력과 페이지 텍스트는 신뢰하지 않습니다. React 텍스트로만 표시합니다. 원격 이미지·HTML·Markdown 실행을 하지 않습니다.
- 명령은 Zod 스키마, 자신의 확장 ID, 정확한 sidepanel URL로 검증합니다. 데이터로 임의 URL 탐색·스크립트·도구 호출을 실행하지 않습니다.
- 출처 링크는 공개 HTTPS 주소의 사용자 클릭만 지원합니다. IP/localhost/자격증명 포함 URL/다른 scheme/포트를 거부합니다. 링크의 진위나 DNS 안전성을 보증하지 않으며 자동 fetch하지 않습니다.
- 시작 버튼에 공유 대상과 자동 최종 요청을 안내합니다. 선택한 페이지에 불러온 완료된 여러 질문·답변 쌍을 가져오며, 개인정보가 담긴 대화의 공유 여부는 사용자가 결정합니다. 연결 메뉴의 모델 변경은 질문을 보내지 않습니다.
- 작성 중인 입력·중복 요청·응답 중인 탭·바뀐 대화·완료 미확인 답변은 안전하게 실패합니다. CAPTCHA나 rate limit을 우회하지 않습니다.
- 프롬프트 injection에 대해 JSON 데이터 경계를 명시하지만 이것은 완전한 방어가 아닙니다. 모델 출력에 브라우저/계정 권한을 주지 않는 구조가 핵심 경계입니다.

## 삭제 및 보관

Chrome `storage.session`의 검토 기록·연결 참조는 브라우저 재시작뿐 아니라 확장 비활성화·새로고침·업데이트 때도 사라집니다. 필요한 검토는 업데이트 전에 **기록 저장**으로 내려받습니다. 확장 화면의 새 검토는 질문·답변·근거를 지우고 탭 연결은 유지하며, 각 연결 카드에서 따로 권한을 해제할 수 있습니다. 이미 AI 사이트에 보낸 대화와 내보낸 파일은 별도로 삭제해야 합니다. 진단 내보내기에는 질문·답변·URL·계정값을 넣지 않습니다. [Chrome 세션 저장소 수명](https://developer.chrome.com/docs/extensions/reference/api/storage#property-session).

실험의 상태 기록에도 같은 저장소 수명이 적용됩니다. 공개 0.4.0의 상세 페이지·설치 제공·두 검색어 노출은 2026-10-13 확인했지만 현재 진단/peer 검토를 담은 로컬 브랜치는 스토어에 배포하지 않았습니다. [출시 기록](../release/release-checklist.md). 이 문서는 개발 브랜치의 데이터 흐름이며 공개 개인정보처리방침을 변경했다는 뜻이 아닙니다. 기능 배포 전 해당 공개 문서·등록정보를 실제 패키지에 맞춰 다시 검토해야 합니다.

## 잔여 위험

실제 사이트의 UI/언어/실험군에 따라 선택자가 달라질 수 있습니다. 내부 HTTP 경로도 문서화된 호환성 계약이 아니며 계정별 모델·응답 형식 변경으로 시험이 실패할 수 있습니다. 문맥 진단의 GET과 다음 POST는 원자적이지 않아 그 사이의 원격 변경을 최종 readback으로 탐지할 수 있어도 전송 자체를 모두 예방하지는 못합니다. 새 비민감 테스트 대화에만 적용하며 임의 기존 메인 대화의 안전한 이어쓰기 근거로 사용하지 않습니다.

이전 Task 8의 고정 문맥 진단은 단위 219·전체 합성 130·설치 7 및 native 성공 기록입니다. Task 9의 첫 299/type/build·전체 합성 131·설치 8과 실제 렌더된 원본의 텍스트 두 답변 성공은 최종 reconnect ownership 수정 전 artifact입니다. 최종 수정 뒤 304/type/build·전체 합성132·설치9와 실제 native 세 Q/A·TXT/PNG 두 Claude 답변 수용을 확인했습니다. source/foreground를 유지하고 소유 테스트 탭·helper 종료를 새로 확인했습니다. permission pregrant·allocation shim·extension-origin panel fixture는 실제 native sidepanel/file 수용을 대신하지 않습니다. source와 history schema를 확인해도 계정/모델별 실제 지원을 보장하지 않으며 [최신 결과](../testing/validation.md)를 따릅니다. 출처가 모델의 허구일 수 있으며 합의율을 진실 확률로 제공하지 않습니다. 최신 서비스 약관과 스토어 정책 검토, 해당 실제 E2E는 출시 조건입니다.
