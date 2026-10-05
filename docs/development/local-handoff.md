# 로컬 개발 인계

## 목표와 현재 상태

CrossCheck는 같은 Chrome 프로필에 웹 로그인한 ChatGPT·Claude·Gemini를 사용합니다. 최종 사용자는 API 키, CLI, TUI 없이 확장 화면만 사용해야 합니다.

0.2.0 기본 흐름은 **현재 질문·답변 자동 가져오기 → 다른 AI 답변 수집 → 교차 검토 → 원래 메인 대화에 최종 프롬프트 전송 → 최종 답변 수집**입니다. 사용자는 ‘자동 검토 시작’을 한 번 누릅니다. 단계별 승인이나 복사·붙여넣기를 기본 흐름에 다시 넣지 마세요. 세부 설정과 수동 복구는 접어 둡니다.

현재 구현과 실제 서비스 호환성을 구분해야 합니다. 클라우드에서 타입·빌드·단위 테스트 25개·Chromium 합성 화면/DOM 테스트 21개는 통과했습니다. 실제 확장 테스트 3개는 관리자 설치 정책으로 실행 전 실패했습니다. 실제 로그인 E2E는 아직 미검증입니다. 합성 테스트가 실서비스 성공을 증명하지 않습니다.

## 먼저 읽을 파일

- `README.md`: 설치와 사용 흐름
- `docs/architecture/overview.md`: 단방향 의존성과 도메인 경계
- `docs/testing/validation.md`, `docs/testing/live-login.md`: 검증 범위와 남은 실제 E2E
- `docs/research/chatgpt-compatibility.md`: ChatGPT 화면 변경 조사, 확인된 표식과 추정한 호환 후보의 구분
- `docs/research/references.md`, `docs/research/ui-decisions.md`: OSS·UI 근거와 라이선스
- `docs/security/privacy.md`: 데이터와 브라우저 권한의 경계

핵심 코드는 `src/application/automatic-workflow.ts`, `src/infrastructure/chrome/provider-client.ts`, `src/infrastructure/providers/`, `entrypoints/bridge.ts`, `src/presentation/shell/App.tsx`, `src/presentation/providers/ConnectionSettings.tsx`입니다. 테스트 데이터는 `tests/fixtures`에만 둡니다.

## 로컬 환경 준비

기존 체크아웃이 없다면 `https://github.com/baba9811/multi-ai-checker.git`의 `main`을 클론합니다. 기존 사용자 변경은 보존합니다. Node 24와 잠금 파일을 사용해 `npm ci`를 실행합니다.

`npx playwright install chromium`으로 테스트 브라우저를 준비하고, 현재 OS에서 Playwright의 `chromium.executablePath()`가 반환하는 경로를 `CHROMIUM_PATH`로 지정합니다. 기본 브라우저 테스트 설정의 `/usr/bin/chromium`은 Linux 클라우드 경로이므로 macOS·Windows에서 그대로 사용하지 마세요. 실제 확장 테스트는 unpacked 확장을 허용하는 Chromium 환경이 필요합니다. 기기의 관리 정책은 우회하지 않습니다.

검증 명령은 `npm run check`, `npm run test:e2e`, `npm run test:e2e:extension`입니다. 확장 설치 폴더는 `npm run build`가 만드는 `.output/chrome-mv3`이며, `npm run zip`으로 배포 ZIP을 다시 만듭니다. 빌드 산출물은 Git에 포함하지 않습니다. 테스트용 Vite 서버는 Playwright가 자동으로 시작·종료합니다.

실계정 검증에는 확장 설치가 허용된 Chrome 프로필을 사용하고 사용자가 원래 사이트에서 직접 로그인하도록 합니다. 로그인 정보·쿠키·세션 토큰을 요청하거나 기본 개인 프로필을 복사하지 마세요. 업데이트 후에는 확장과 AI 탭을 모두 새로고침해야 기존 bridge가 교체됩니다.

## 로컬에서 우선 해결할 일

1. 일반 ChatGPT 대화(`chatgpt.com` 또는 `/c/…`)에서 입력란과 현재 질문·답변을 정확히 읽는지 실측합니다. 사용자가 이 화면에서 감지 실패를 보고했습니다. 현재의 보강된 선택자는 합성 DOM에서만 검증했으므로 문제가 끝났다고 가정하지 마세요.
2. 실제 로그인한 세 서비스에서 연결 상태와 모델 메뉴 읽기·선택을 확인합니다. 목록은 해당 계정의 웹 메뉴에서 읽어야 합니다. 없는 모델·구독 권한·잔여 쿼타를 추측하지 않습니다. 메뉴 미지원 시 웹의 현재 모델을 유지한다고 표시합니다.
3. 짧고 민감하지 않은 테스트 질문으로 시작 한 번부터 **원래 메인 대화에 최종 프롬프트가 실제 전송되고 답변이 돌아오는 것까지** 확인합니다. 모델이 웹 검색을 실제 사용했는지도 별도로 기록합니다.
4. 실패를 재현해 관련 어댑터를 고치고 회귀 테스트를 보강합니다. 대화 변경·작성 중인 메시지·중단/패널 종료·쿼타 제한 때 잘못 전송하거나 자동 재시도하지 않아야 합니다.
5. 로컬 실제 확장 테스트와 실계정 검증 결과를 문서에 나눠 기록하고 최신 ZIP을 만듭니다. 필요한 로그인이나 기기 권한 외의 일반 구현 판단은 스스로 진행합니다.

다수 모델의 합의를 사실 검증으로 표현하지 마세요. 확인한 1차 자료와 미확인 주장을 구분하도록 요청하되 실제 검색·출처 정확성을 보장한다고 표시하지 않습니다. 계정 순환·쿼타 우회·CAPTCHA 우회·비공개 API·쿠키/토큰 추출은 구현하지 않습니다. 도메인별 코드·문서·데이터 분리와 단방향 의존성, 원본 공급자 로고, 간결한 UI를 유지합니다.
