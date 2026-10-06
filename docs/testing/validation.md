# 검증 기록

## Gemini 완료와 ChatGPT 업로드 범위 수정 — 2026-10-06 KST

`284ff6f`는 현재 답변 안의 한국어 Gemini `복사` 완료 버튼을 인식합니다. 수정 전 양성 실패를 확인했고 완료·숨김·이전 응답·생성 중의 4개 회귀와 기존 관련 9개 검사가 통과했습니다. 독립 리뷰도 통과했습니다. 원격 [PR 실행 37447039221](https://github.com/baba9811/multi-ai-checker/actions/runs/37447039221)과 push 실행 37447034131이 성공했고, 로그에서 단위 82개·합성 브라우저 107개·설치 확장 3개·업로더 7개 및 타입·빌드를 확인했습니다.

해당 빌드를 네이티브 확장에서 실행해 2쌍·TXT·PNG → Claude 독립 답변 → Gemini 독립 답변 → Claude 교차 검토까지 수집했습니다. 마지막 ChatGPT에서는 SPA 전환 뒤 다른 폼에 남은 파일 입력란 때문에 전역 유일성 검사가 실패했습니다. 원본 메인에 최종 프롬프트나 파일은 전송되지 않았습니다.

후속 수정은 ChatGPT 업로드 입력란을 캡처한 편집기의 기존 폼 안에서 찾습니다. 같은 폼의 모호함은 거부하고 Claude/Gemini의 포털 범위는 유지합니다. 수정 전 새 검사 중 2개가 예상대로 실패했고, 수정 후 새 3개 및 기존 첨부 가드 26개가 통과했습니다. 타입·단위 82개·프로덕션 빌드, 독립 정확성·보안·간결성 리뷰도 통과했습니다. 새 bridge SHA-256은 `1113f690b5e1a0d27f647c5133a71dd52bc58c5641b2f6a47d3e1791e30e921b`이며 최신 네이티브 전체 실행은 별도로 확인합니다.

## 마지막 실서비스 차이 수정 — 2026-10-06 KST

`2c7961d`는 ChatGPT가 원본 파일 이름에 붙인 양의 정수 `(n)` 표시를 정확한 원본 줄기·확장자와 일대일로 대응시킵니다. 누락·추가·중복·충돌은 거부하고 준비 확인 후 같은 타일의 표시 이름이 바뀌어도 전송하지 않습니다. 새 공급자 준비는 기존 origin 검사와 준비 함수를 재사용하며, 관찰한 Gemini 28.44초 로딩을 수용하는 제한을 공유합니다. 저장된 정확한 대화 연결은 바꾸지 않습니다.

수정 전 집중 단위 3개와 첨부 별칭 브라우저 검사의 실패를 확인했습니다. 수정 후 연결 단위 23개, 새 첨부 브라우저 10개, 기존 관련 첨부 가드 17개, 타입·전체 단위 76개·프로덕션 빌드와 설치 확장 3개(25.3초)가 통과했습니다. 독립 요구사항·품질 리뷰도 통과했습니다. 브라우저 양성 검사에서 수집이 끝나지 않은 원인은 bridge의 조회 타이머 생성 이후에 가짜 시계를 설치한 테스트 순서였습니다. 원래 실패 자료를 보존하고 시계를 탐색·주입 전에 설치하자 해당 검사가 통과했습니다. 제품의 제한이나 검증 조건은 완화하지 않았습니다.

이 결과는 합성 및 깨끗한 브라우저 설치 검증입니다. 실제 사용자의 설치본은 당시 이전 소스였고 최신 소스로 최종 메인 답변까지의 네이티브 재실행은 별도입니다.

## 최종 독립 리뷰 수정 — 2026-10-06 KST

전체 브랜치 리뷰에서 전송 의도 저장 전의 취소가 미전송 작업을 중단 상태로 바꾸는 문제와, 뒤쪽의 숨겨진 keyed 턴을 제외한 앞부분만 완전한 대화로 받아들이는 문제를 발견했습니다. `8ba7a3a`는 기존 취소 검사를 준비·전송 전 검사 catch에 적용하고, 캡처된 대화 스레드의 알려진 질문·답변 키와 실제 캡처를 함께 확인합니다. 전송 의도 저장 이후의 불확실한 전송 처리는 유지합니다.

새 단위 실패 5개와 뒤쪽 누락 브라우저 실패 3개를 수정 전 재현했습니다. 취소 경계 6개, 기존 관련 단위 36개, 대화/이력 브라우저 14개(7.9초), 타입·전체 단위 82개·프로덕션 빌드가 통과했습니다. 두 발견 사항에 대한 독립 재리뷰는 요구사항·품질 모두 통과했습니다. 로컬 전체 브라우저 재실행 대신 같은 소스의 원격 CI에서 전체 합성·설치 검증을 진행합니다.

배포 후보 `multi-ai-checker-0.4.0-chrome.zip`은 161,022바이트, SHA-256 `0fb2a063066664de0088358b36762f919cfb0895103c2bbe73687c99e9bb0282`입니다. 12개 파일 모두 검증 빌드와 같고, bridge SHA-256은 `b09455f2e587174c9a5164bee73e97e4a028c1895ccebbd49777515ac34147a4`입니다. 실제 ZIP의 버전·MV3·권한·세 origin·CSP·아이콘·라이선스와 배포 제외 파일을 검사했고 업로더의 오프라인 검사가 통과했습니다. 실제 설치본의 새로고침 완료와 0.4.0 네이티브 패널, 세 쌍 및 TXT·PNG 원본을 확인하여 새 실행을 시작했습니다. 완료 결과는 아직 별도 확인 중입니다.

## 원격 전체 검사와 네이티브 최종 수집 — 2026-10-06 KST

소스 `4ac0e21`의 push 실행 [37441667945](https://github.com/baba9811/multi-ai-checker/actions/runs/37441667945)와 PR 실행 [37441770053](https://github.com/baba9811/multi-ai-checker/actions/runs/37441770053)이 모두 성공했습니다. PR CI 로그에서 타입·단위 82개·빌드, 업로더 7개, 전체 합성 브라우저 103개(2.7분), 설치 확장 3개(4.1초), 패키징 성공을 확인했습니다. 내려받은 CI ZIP은 161,352바이트, SHA-256 `45dbad654a1bc52f0370fbc5edb2aa7e93a91d4ecea7e026572c2ae3562bfddf`입니다. 압축 컨테이너의 바이트는 로컬 ZIP과 다르지만 12개 내부 파일은 모두 같습니다.

같은 제품 소스를 실제 관리 화면에서 새로고침하고 네이티브 패널로 실행한 결과, **3쌍·TXT·PNG → Claude 독립 답변·교차 검토 → 원래 ChatGPT의 최종 답변 수집**이 추가 전송 조작 없이 완료됐습니다. 패널은 검토 완료와 ChatGPT·Claude 참여, Gemini 제외를 표시했습니다. 메인에서 `(2)`가 붙은 두 원본을 정상 처리했습니다. 이후 네 쌍을 가져온 새 검토도 두 서비스 최종 수집까지 완료했고 `(3)` 표시를 수용했습니다. 이 두 완료는 세 서비스 전체 성공과 다릅니다.

첫 실행에서 Gemini의 기존 비활성 빈 탭은 45초 준비 확인에서 멈췄습니다. 뒤에 관찰한 navigation 완료 값은 1.647초였으나 실제 로딩이 언제 시작했는지 입증하지 못하므로 원인을 단정하지 않습니다. 명시적인 Gemini 연결은 입력란과 실제 모델 Gemini Pro를 읽는 데 성공했습니다. 다음 실행은 업로드 입력란 확인에서 전송 전에 멈췄습니다. 나중의 동일 메뉴 DOM에는 정확한 문서·이미지 입력란이 각각 하나 있었고, 실제 활성 탭에서 메뉴를 닫고 다시 열자 약 864ms 안에 둘 다 확인됐습니다. 선택자 불일치나 필요한 대기 시간 증가를 입증한 결과가 아닙니다. 해당 실행은 파일이나 질문을 Gemini에 보내지 않았고, 누락한 채 성공으로 표시하지 않았습니다.

별도의 짧은 사과 합성 대화는 원래 두 쌍에 첨부 내용을 넣지 않았습니다. TXT·PNG를 선택한 새 검토에서 Claude 독립 답변·교차 검토와 원래 ChatGPT 최종 수집이 다시 완료됐고, 파일의 토큰과 이미지 체크 수를 답했습니다. Gemini는 같은 입력란 오류로 제외됐습니다. 이는 세 번째 두 서비스 완료이며 세 서비스 전체 완료가 아닙니다.

이후 입력란 오류에만 내용 없는 임시 진단을 넣은 실제 설치본은 `document`, 5,970ms, 입력 후보 0개, 가드 유효, 문서 `complete`, 가시성 `hidden`을 보고했습니다. 질문이나 파일을 보내기 전에 멈췄습니다. 일반 네이티브 새 탭을 명시적으로 연결한 별도 검토에서는 같은 코드가 TXT·PNG를 모두 업로드하고 질문을 한 번 보냈습니다. 완료 답변에 토큰·이미지 설명과 첨부 인용이 있었지만 3분 뒤 확장 수집은 시간 제한으로 멈췄습니다. 읽기 전용 DOM에는 단일 `model-response`, 중첩된 답변 후보 둘(outermost 하나), 생성 중 표식 없음, 같은 응답 안의 `aria-label="복사"` 버튼과 없는 `data-test-id`가 확인됐습니다. 기존 완료 선택자에 이 한국어 표식이 없어 수집이 끝나지 않는 차이를 별도로 수정·검증합니다. 업로드 가시성 진단은 소스에서 제거했으며 배포 전 깨끗한 빌드로 교체합니다.

## 로컬 0.4.0 다중 턴 후보 — 2026-10-06 KST

기준은 `79fd4cc` 이후 다중 턴 구현 `8eeb096`, 리뷰 수정 `8772b46`입니다. 변경 이후 타입 검사·단위 64개·프로덕션 빌드, 전체 합성 브라우저 61개(2.8분), 별도 설치 확장 3개(35.9초)가 순서대로 통과했습니다. 이 결과는 아래 실계정 실패를 대신하지 않습니다.

실제 Aside 확장 관리 화면에서 프로젝트의 기존 0.3.0을 제거하고 제거된 상태를 확인한 다음, `.output/chrome-mv3`의 새 0.4.0을 설치했습니다. 관리 화면의 이름·ID·버전과 실제 `sidepanel.html`을 확인하고 공급자 탭을 새로고침했습니다. 원래 ChatGPT의 합성 질문·답변 3쌍을 가져왔으며, 패널의 범위 표시와 TXT·PNG 두 원본의 선택을 확인했습니다. 이 과정은 이전 0.3.0의 네이티브 제어 불일치와 별개로 실제 제거·재설치가 확인된 새 증거입니다.

### 순차 활성 탭 실행 수정

`0aaf76a`는 각 공급자 탭을 활성화하고 한 요청의 수집을 마친 뒤 다음 작업으로 이동합니다. 독립 리뷰의 취소 상태 지적도 수정하고 재리뷰를 통과했습니다. 타입·단위 70개·빌드, 집중 단위 37개, 별도 설치 확장 3개(1.4분)가 통과했습니다. 합성 브라우저 전체 첫 실행은 64개 통과·2개 시간 제한(8.5분)이었습니다. 두 실패는 자동 검토 시작 전 UI 확인에서 발생했고, 첫 실패에는 Chromium 세션 종료가 포함됐습니다. 호스트 부하를 관찰하고 첫 로그·추적 자료를 보존했습니다. 제품이나 제한 시간을 바꾸지 않은 집중 재실행에서 두 실패 검사(20.7초)와 중단·원본 복원 2개(33초)가 각각 통과했습니다. 이를 단일 전체 66개 통과로 표현하지 않습니다.

### 실제 서비스에서 발견한 문제

- 첫 실행: Claude에는 세 턴 맥락과 두 원본이 전달됐고 완료 답변도 생성됐지만 확장이 완료를 수집하지 못했습니다. 현재 화면의 Copy 도구가 `[data-is-streaming]` 밖, 같은 `role=article` 턴 안에 있음을 내용 없는 DOM 메타데이터로 확인했습니다. `11e5e3b`는 해당 턴만 사용하며 다중 답변·다른 턴의 도구·생성 중 상태를 거부합니다. 타입·빌드와 집중 브라우저 6개(23.9초)가 통과했고 독립 리뷰도 통과했습니다.
- 첫 실행의 Gemini는 업로드 입력란을 찾지 못해 질문 전송 전에 멈췄습니다. 파일 없는 프롬프트로 바꾸거나 재전송하지 않았습니다.
- 두 번째 새 검토: Claude 새 탭은 두 원본 업로드와 프롬프트 입력까지 진행했으나 전송 버튼 준비를 확인하지 못해 클릭하지 않았습니다. 탭을 활성화한 뒤 보존된 초안과 활성 Send message를 확인했습니다.
- Gemini의 임시 진단은 첫 `text/plain` 업로드 입력란 후보 0개, 대상/편집 가드 유효, 실제 경과 약 14.2초를 보였습니다. 설정된 탐색 한도는 5초였습니다. 백그라운드 탭을 활성화하자 열린 메뉴에 파일·Drive·Google 포토가 나타났습니다. 별도의 활성 탭 메뉴 관찰에서는 편집란이 유지된 채 약 0.4초 후 입력란 1개가 준비됐습니다. 이 차이를 근거로 탭 활성화와 순차 실행을 수정·검증 중입니다. 임시 진단은 내용·URL·계정·원본 바이트를 기록하지 않았으며 최종 소스와 재로드한 빌드에서 제거했습니다.

순차 실행 수정본의 첫 새 검토는 Claude가 이전 테스트 초안·파일을 새 탭에도 복원해 전송 전 멈췄고, Gemini의 새 탭 로딩은 20초 한도에 걸렸습니다. 이는 새 전송 실패와 구분합니다. 테스트 초안만 정리하고 Claude를 새로고침해 빈 상태를 확인한 뒤 명시적으로 재연결했습니다. Gemini의 실제 입력란과 document.readyState=complete도 확인했습니다.

준비된 연결로 다음 새 검토를 시작한 결과, **Claude의 세 턴·TXT·PNG 전송과 완료 답변 수집이 성공**했습니다. Gemini도 TXT 칩과 실제 체크 표시 이미지가 화면에 나타났고, 두 첨부 타일·이미지 로드·진행 표시 없음이 확인됐습니다. 그러나 Gemini는 프롬프트의 줄바꿈 비교에서 멈췄습니다. 실제 Quill 편집기는 41개 P와 빈 문단의 BR을 사용했고 innerText가 표시용 줄바꿈을 추가했습니다. 이어 Claude의 교차 검토는 프롬프트만 입력하고 전송 버튼이 준비되지 않아 멈췄습니다. 나중에 활성화된 전송 버튼과 보존된 초안을 확인했습니다. 이 두 입력/준비 상태 차이를 집중 수정 중이며 최종 메인 전송은 아직 없습니다.

### 편집기 줄바꿈·전송 준비 수정과 다음 실서비스 실행

`380d28a`는 Quill 문단의 논리적 줄바꿈을 보존하고 전송 버튼을 제한된 시간 동안 확인합니다. 최초 구현의 동기 클릭 문제는 독립 리뷰와 기존 동시 편집 검사 3개의 실패로 재현한 뒤 최소 대기를 복원했습니다. 최종 타입·단위 70개·빌드, 공급자/편집기 합성 브라우저 65개(2.2분), 별도 설치 확장 3개(25.2초)가 순서대로 통과했습니다. 이 범위는 전체 합성 UI 검사나 실계정 검증과 구분합니다.

이 빌드를 실제 확장 관리 화면에서 새로고침하고 완료 표시와 0.4.0 패널을 확인했습니다. 메인 ChatGPT 탭도 새로고침한 뒤 3쌍과 TXT·PNG 원본으로 새 자동 검토를 시작했습니다. Gemini는 두 첨부를 전송했고 완료 답변을 생성했습니다. 실제 화면에서 TXT·이미지 칩 및 토큰·이미지 묘사를 확인했습니다. 다만 질문 DOM에 접근성 전용 `h5.cdk-visually-hidden.screen-reader-user-query-label`이 포함되어 원문 대응 검사에서 중단됐습니다. 질문 영역은 이 안내문과 41개의 `p.query-text-line`으로 구성됐습니다. 실제 답변 생성 성공을 확장 수집 성공으로 바꾸어 기록하지 않습니다.

같은 실행의 Claude는 원본 업로드와 프롬프트 입력 후 정확한 입력 비교에서 전송 전에 멈췄습니다. 이후 안정된 편집기는 41개의 직접 P와 빈 문단의 trailing BR 2개였고, 논리 텍스트는 1,816자였습니다. JSON을 다시 정렬한 결과와 정확히 같았고 NBSP가 없었으며 Gemini의 실제 전송 질문과 공백 정규화 비교가 일치했습니다. 입력 직후 비교가 편집기의 비동기 정리보다 먼저 실행된다는 가설을 재현 중입니다. 입력 순간 DOM은 관찰하지 않았으므로 확정 원인으로 표현하지 않습니다. Claude의 이 실행에만 속한 미전송 초안과 첨부는 UI로 정리하고 새로고침 후 빈 상태를 확인했습니다.

### 접근성 중복 안내 제외·입력 비교 시점 수정

`8064159`는 공유 텍스트 추출에서 `.cdk-visually-hidden` 안내만 제외하며 일반 H5와 실제 문단은 유지합니다. 입력의 첫 정확한 텍스트 비교도 기존 최소 안정 대기 이후로 옮겼습니다. 그 전에도 취소·편집기 교체·생성·첨부 가드는 계속 검사합니다. 합성 회귀 2개는 수정 전 실패를 확인했고, 집중 검사 14개, 타입·단위 70개·빌드, 공급자/편집기 합성 72개(6.0분), 별도 설치 확장 3개(1.2분)가 순서대로 통과했습니다. 독립 리뷰에서 남은 차단 결함은 없었습니다. 실서비스의 입력 순간 DOM을 관찰한 것은 아니므로 비동기 정리 가설과 합성 재현 증거는 구분합니다.

이 수정과 새 스토어용 설명을 포함한 0.4.0을 실제 관리 화면에서 새로고침하고 완료 표시를 확인했습니다. 원래 ChatGPT의 3쌍과 TXT·PNG로 새 검토를 시작한 결과, **Claude의 첫 답변과 교차 검토가 모두 완료·수집**되어 원래 메인 최종 단계까지 진행했습니다. 도중 Claude의 구독 안내에 `Not now`를 한 번 눌렀고 화면 전환을 확인했으므로 완전 무개입 실행으로 기록하지 않습니다. 업그레이드나 결제는 선택하지 않았습니다.

이 실행은 다음 두 경계에서 멈췄습니다.

- 새 Gemini 탭의 준비는 기존 20초 제한을 넘었습니다. 이후 읽기 전용 navigation timing에서 DOM interactive 약 20.67초, complete 약 28.44초, load 종료 약 28.45초와 준비된 빈 편집기를 확인했습니다. 원본 업로드·질문 전송은 시작되지 않았습니다.
- 메인 ChatGPT는 원본 두 개를 업로드하며 표시 이름에 `(1)`을 붙였습니다. 연결된 제거 버튼 2개, 진행·오류 표시 없음, 활성 Send와 빈 편집기를 확인했습니다. 원본 이름과의 엄격한 비교 때문에 업로드 준비에서 멈췄고 **최종 프롬프트는 입력·전송되지 않았습니다**. 이 실행에 속한 미전송 첨부만 UI로 제거하고 빈 상태를 확인했습니다. 원래 3쌍은 그대로입니다.

두 관찰에 대한 최소 수정과 회귀 검사는 진행 중입니다. 모든 실행은 자동 재시도 없이 멈췄으며 세 서비스 전체 완료, 0.4.0 최종 ZIP, 새 CI 초안 배포는 아직 확인 중입니다. 다른 앱/사용자 프로세스를 종료하지 않았고 빌드·테스트와 실서비스 전송을 겹치지 않았습니다. 네이티브 제어는 UI 단계 밖에서 초기화하고 Aside REPL은 사용 후 종료했습니다.

## 로컬 0.3.0 — 2026-10-06 KST

macOS / Node 25.2.1 / npm 11.6.2. `codex/live-extension-validation`, 기준 커밋 `802149b`와 현재 작업 변경분입니다. 스토어 게시본이 아닙니다.

- 타입 검사·단위 테스트 55개·프로덕션 빌드 통과.
- Claude 문단 줄바꿈·Gemini 중첩 파일 입력란 수정을 포함한 최종 합성 브라우저 검사 53개 통과. 두 수정 이후 실제 unpacked 설치 검사도 최종 3개 통과(7.1초). 앞선 48개 브라우저·3개 설치 결과와 구분하며, 빌드와 각 검사 묶음은 순서대로 실행했습니다.
- 실제 Aside에서는 설치된 0.2.0을 관리 화면 새로고침으로 0.3.0으로 교체했고, 실제 사이드패널과 고정된 ChatGPT 원본 질문·답변 읽기를 확인했습니다. 제거 확인창을 접근 가능한 도구로 확인하지 못했으므로 제거 후 새 설치를 완료했다고 주장하지 않습니다.
- 비어 있는 Claude 탭을 닫고 확장 연결 버튼으로 열기·입력란 감지를 확인했습니다. 세 서비스 연결과 웹의 현재 모델 표시를 확인했고, 지원하지 않는 모델 메뉴에는 수동 안내가 표시됐습니다. 로그인 자체는 이미 로그인된 계정을 사용했으므로 비로그인 상태의 전체 인증 과정은 별도 미검증입니다.
- 실제 패널에서 합성 TXT+PNG 원본을 선택한 첫 검토는 Claude의 문단 줄바꿈 불일치와 Gemini의 중첩 파일 입력란 때문에 전송 전에 멈췄습니다. 오류를 숨기거나 파일 없는 질문으로 대체하지 않았습니다. 남은 합성 초안·파일은 확인 후 정리했습니다.
- 두 실서비스 차이를 built bridge 회귀 검사로 재현했습니다. 수정 후 해당 5개 검사(정상 전달·수집과 동시 편집 차단)가 통과했고, 위 최종 전체 검사에도 포함됐습니다.
- 최신 코드의 네이티브 재실행에서는 두 원본 선택과 Claude·Gemini 입력란 준비까지 확인했습니다. 이후 CUA 접근성 정보·화면 픽셀·버튼 상태가 서로 일치하지 않았고 반복 스크롤에 `noWindowsAvailable`이 반환됐습니다. 새 연결과 제어 도구 초기화로도 해소되지 않아 시작/전송 결과를 확인할 수 없었습니다. 최신 수정 이후 새 공급자 전송은 없었고, 마지막 읽기 전용 검사에서 Claude·Gemini 입력란은 비어 있었습니다. 네이티브 제어는 초기화해 종료했습니다.
- 원본 파일 선택창에서 두 파일을 선택한 뒤 Return으로 확정한 시도는 열기 버튼 클릭보다 결과 확인이 잘 됐습니다. 이번 관찰일 뿐 일반적으로 보장되는 동작이나 불일치의 확정 원인은 아닙니다.

### 최종 패키지

`npm run zip`으로 `.output/multi-ai-checker-0.3.0-chrome.zip`을 생성했습니다. 크기는 159,027바이트이며 SHA-256은 `30c17d9894e7d21e6f025b511640523f07effc739135cee22dce3499962bf3c0`입니다. ZIP의 12개 파일 모두 현재 프로덕션 빌드의 대응 파일과 바이트 단위로 일치했습니다. 패키지 생성·일치 확인은 스토어 업로드·심사 제출·공개 게시를 뜻하지 않습니다.

### 남은 실제 수용 검증

최신 수정의 세 서비스 전체 실계정 파이프라인은 원래 메인 대화의 최종 답변 수집까지 확인하지 못했습니다. 실제 브라우저의 제거 후 재설치, 스토어 배포본 자동 업데이트도 미검증입니다. 네이티브 제어 불일치를 제품 전송 성공 또는 새 공급자 오류로 해석하지 않습니다. 관리 브라우저의 설치 검사 통과와 별도로 [로그인 E2E](live-login.md)를 수행하고, 비로그인 인증·실제 모델 선택·검색 실행을 각각 확인해야 합니다.

실제 ChatGPT에 직접 보낸 별도 합성 질문은 `CC-4729`와 이미지의 두 흰 체크 표시를 읽었습니다. 이는 파일 자체가 읽히는 증거이며, 세 서비스의 확장 파이프라인 완료를 대신하지 않습니다.

## 이전 클라우드 0.2.0 — 역사적 기록

0.2.0 · 2026-10-05 UTC (한국 10월 6일). 클라우드 Linux x86_64 / Node 24.19.0 / npm 11.9.0 / Chromium 151.0.7922.173.

| 구분                        | 결과                   | 범위                                                              |
| --------------------------- | ---------------------- | ----------------------------------------------------------------- |
| 저장한 설치 스크립트 재실행 | 통과                   | `npm ci` 동결 설치, 타입 검사, 테스트, MV3 빌드                   |
| 단위 테스트                 | 25개 통과              | 도메인 전환/프롬프트/복구, 개인정보 URL 규칙, 단방향 아키텍처     |
| Chromium 화면·DOM fixture   | 21개 통과              | 아래 범위. 실계정 호출 없음                                       |
| 실제 unpacked 확장 테스트   | 환경 차단으로 3개 실패 | 관리자 정책 검사에서 중단, assertion 실행 전                      |
| 실제 로그인 서비스 E2E      | 미검증                 | 설치 정책 및 실제 로그인 세션 부재, 앞선 서비스 요청은 프록시 403 |
| 배포 패키지                 | 생성                   | `.output/multi-ai-checker-0.2.0-chrome.zip`                       |

## 이전 클라우드에서 실행한 브라우저 검증

화면 harness는 동일한 React UI와 자동 파이프라인에 합성 Platform을 주입합니다. DOM 테스트는 **실제 빌드된 `bridge.js`**를 합성 공급자 페이지에서 실행합니다. 실서비스 DOM 캡처나 실제 계정 연결은 아닙니다. fixture는 배포 빌드에 포함하지 않습니다.

- 세 공급자의 실제 편집 이벤트, 단일 전송, 새 완료 답변 수집.
- 신뢰하지 않는 발신자, 작성 중인 메시지, 바뀐 대화 거부. 오래되거나 미완성인 답변을 완료로 오인하지 않음.
- ChatGPT 변경 타임라인의 질문/답변/입력란, 한글 버튼, `display:contents`, 메시지 가상화, 역방향 DOM, 불명확한 검색 행 제외.
- 새 질문에 이전 답변을 붙이지 않음. 여러 입력란이면 자동 전송하지 않음.
- 세 공급자의 웹 메뉴에서 모델 목록을 읽고 변경 확인. 업그레이드 항목 거부, 메뉴 미지원 시 빈 목록. 모델 검사 과정에서 질문 전송 없음.
- 새 대화의 첫 주소 변경 허용 및 이후 다른 대화로 바뀌면 수집 중단.
- 시작 한 번으로 자동 가져오기 → 다른 AI 답변 → 교차 검토 → **원래 메인 대화 대상의 최종 요청**. 중간 확인 창이나 단계 버튼 없음.
- 기존 메인 답변 재사용으로 세 AI의 빠르게 모드에서 4회만 요청. 최종 프롬프트에 실제 수집한 답변과 비판 포함.
- 메인 대화 변경 시 최종 전송 차단. 한 AI의 쿼타 실패를 표시하고 성공한 AI만으로 계속 진행. 답변이 부족하면 중단.
- 중단/복원 시 재전송 없음. 저장 실패 시 전송하지 않음. 모델 HTML을 실행하지 않음.
- 연결 화면의 모델 목록/선택 및 320px 패널/키보드 접근. 스크린샷으로 단순화한 기본 화면도 확인.

초기 테스트에서 메인 대화 변경을 너무 늦게 주입하는 타이밍 경합과 실제 모델명 형식과 다른 합성 라벨을 발견했습니다. 변경 시점을 검토 응답 경계에 고정하고 합성 라벨을 지원하는 모델명 형식으로 수정한 뒤, 최종 21개 전체 검증이 통과했습니다. 제품의 전송 차단/가용 모델 검사 조건을 완화하지 않았습니다.

## 이전 클라우드의 환경 차단과 남은 수용 검증

당시 클라우드 머신의 `/etc/chromium/policies/managed/extensions.json`에 있는 `ExtensionInstallBlocklist: ["*"]` 때문에 확장 설치가 허용되지 않았습니다. 0.2.0 확장 전용 테스트도 이 정책 검사에서 `ENVIRONMENT BLOCKER`로 실패했습니다. 우회하거나 테스트를 skip/pass로 처리하지 않았습니다. 현재 로컬 설치 검사의 차단 사유로 옮기지 않습니다.

당시 결과만으로 실제 `chrome.runtime`, 선택적 권한 프롬프트, side panel 컨테이너 및 실계정 모델 메뉴까지 검증됐다고 주장하지 않습니다. 당시 서비스 접속 확인도 `Tunnel connection failed: 403 Forbidden`이었습니다. 네트워크 초안 저장은 실제 접속 성공을 의미하지 않습니다.

관리 정책이 허용된 Chrome에서 [로그인 E2E](live-login.md)를 수행해야 합니다. 사용자 비밀번호/쿠키를 요구하지 않고 본인 Chrome에서 로그인합니다. 서비스별 선택자·계정의 모델 선택지·실제 검색 실행·원래 대화 재전송과 수집을 확인한 뒤에만 해당 연결을 실계정 검증 완료로 표시합니다.

## GitHub release preparation — 2026-10-06

Remote GitHub Actions runs `37358139057` (push) and `37358258500` (PR) passed for source `96b18606d1b076938fa34610e25c428e6b11a8f1`: type/build, 55 unit tests, 53 synthetic browser tests, 3 unpacked-extension tests, and 7 simulated release-uploader checks. All three workflow files also passed local actionlint. Independent release review's trust-boundary and OIDC-subject findings were corrected and re-reviewed with no remaining blocking code findings. PR #1 merged as `0745d42dca1e7f58054753dece1d02c1700a080f`; the release and trusted-upload workflows are active in GitHub.

Merged-main run `37358897139` also completed successfully for that merge commit. Real Google publishing access is still unconnected; this successful validation is not an end-to-end deployment test.

The push-run ZIP artifact was downloaded and inspected: 159,352 bytes, SHA-256 `5dfc25872e7f168e0c672831999c2381911b0b3f4b15c36b5725edbe0a50e911`. All 12 uncompressed files exactly match the locally audited ZIP uploaded to the store. ZIP container bytes differ; do not substitute the CI hash for the uploaded local package's hash.

The first actual store upload is confirmed as a **draft**, version 0.3.0, item `jkffbjajcmbcobmgbcilenbpjfemapki`. The Package page confirms expected permissions and no published item. This does not establish API authentication/upload, store review/approval, or the still-unverified live provider pipeline. Current deployment connections belong in [release automation](../release/automation.md).

## First real CI draft deployment — 0.3.1, 2026-10-06 KST

Source `b0622ca401fa12e22f7512f54b35b994e7085009` changes only package/lock version metadata and release documentation. Local type/build and 55 unit checks passed. Comparing all 12 built files with the audited 0.3.0 ZIP found only `manifest.json`'s version changed to 0.3.1; production code, permissions and other manifest fields are unchanged. This does not count as a fresh native/live-provider test.

[Release run 37380170468](https://github.com/baba9811/multi-ai-checker/actions/runs/37380170468) passed all validation: 55 unit tests, 53 synthetic browser tests, 3 unpacked-extension tests, 7 simulated uploader tests, type/build and packaging. Push/tag CI runs `37380108677` and `37380168916` also passed. The subsequent trusted-main upload job passed tag/commit ancestry and artifact checks, exchanged GitHub OIDC for a short-lived service-account token, and uploaded through Chrome Web Store API v2. No long-lived key or personal refresh token was used.

The exact CI ZIP is 159,353 bytes, SHA-256 `44958d77faa5fb50c76892d191f6031a927db9888087833e4e67e22e7a051457`. The downloaded artifact's 12 uncompressed files exactly match the locally built 0.3.1 files. The uploader logged that same checksum and **Draft uploaded; not submitted for review.** A freshly reloaded store Package page independently showed draft version 0.3.1, the four expected permissions, and no published item. `CWS_SUBMIT=false` remains configured.

This is the first confirmed real authenticated CI upload. Review submission/approval, public extension availability, store-installed automatic update and the full logged-in provider pipeline remain unverified. The temporary Cloud console tabs and Aside REPL were closed; native computer control was not started during this connection work.
