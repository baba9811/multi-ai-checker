# 검증 기록

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
