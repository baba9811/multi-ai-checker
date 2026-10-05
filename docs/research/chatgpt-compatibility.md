# ChatGPT DOM 호환성 조사

검토일: 2026-10-05 UTC. 사용자가 일반 `chatgpt.com` / `/c/…` 대화에서 질문·답변 및 입력란을 감지하지 못하는 문제를 보고했습니다. 스크린샷만으로 사용자의 정확한 DOM이나 원인을 확정할 수는 없습니다.

## 확인한 공개 근거

- [pionxzh/chatgpt-exporter, 4c8fe6e](https://github.com/pionxzh/chatgpt-exporter/tree/4c8fe6ea01d58a59bc59aea9ba1421fee7d80969), MIT, 2026-09-27 커밋을 읽었습니다.
  - [src/main.tsx](https://github.com/pionxzh/chatgpt-exporter/blob/4c8fe6ea01d58a59bc59aea9ba1421fee7d80969/src/main.tsx)는 9월 24일 추가된 메시지 선택자로 `[data-chatgpt-conversation-selection-target] [data-chatgpt-search-message-ids]`를 명시합니다.
  - [src/exporter/image.ts](https://github.com/pionxzh/chatgpt-exporter/blob/4c8fe6ea01d58a59bc59aea9ba1421fee7d80969/src/exporter/image.ts)는 `[data-turn-key]`, `.bg-user-message`, 역방향 스크롤 및 화면 밖 메시지가 DOM에서 제거되는 구조를 다룹니다.
- [KudoAI/chatgpt.js, 43f377e](https://github.com/KudoAI/chatgpt.js/tree/43f377e0485c3ca8eaaf1cb8363fc8b03afd602c), 2026-08-10 커밋의 기존 `#prompt-textarea` / send-button 표식은 최신 레이아웃을 단독으로 보장하지 못합니다.

이 프로젝트의 코드를 복사하지 않았습니다. 공개 DOM 표식을 호환성 근거로 참고했으며, 토큰 추출·비공개 API·계정 데이터 요청은 사용하지 않습니다.

## 구현과 검증 범위

기존 role 기반 레이아웃을 유지하며 변경된 타임라인 표식을 추가했습니다. 입력란은 명시적인 편집 요소만 허용하고, 여러 개면 전송하지 않습니다. unified composer / Lexical / ProseMirror / form textbox는 보수적인 호환 후보이며, 모두 실계정에서 관찰한 선택자라는 뜻은 아닙니다.

질문 버블과 답변 본문을 구분하고, 역할이 불명확한 검색·도구 행은 답변으로 추측하지 않습니다. 완료된 턴의 버튼·보조 문구를 제거합니다. 렌더링 순서를 사용해 역방향 DOM도 처리하고, 새 질문에 과거 답변을 잘못 붙이지 않습니다. 수집은 메시지 개수 대신 안정적인 메시지 표식과 보낸 질문의 일치를 검사합니다. 공유 페이지 여부·레이아웃·메시지 수 등만 진단에 포함하며 대화 내용이나 메시지 ID는 내보내지 않습니다.

실제 Chromium에서 빌드한 bridge를 합성 DOM에 실행하여 기존 화면, 변경된 화면, `display:contents`, 가상화에 따른 이전 메시지 제거, 한글 입력/완료 버튼, 모호한 입력란, 역순 타임라인을 검사합니다. 합성 fixture는 서비스의 실제 DOM 캡처가 아닙니다. 사용자 계정의 실제 동작 검증은 아직 필요합니다.

## 웹 모델 선택

세 서비스의 모델 메뉴 버튼과 접근성 menu/option 표식을 읽습니다. 모델 목록·구독 권한·잔여 쿼타를 하드코딩하지 않습니다. 메뉴에 실제 표시된 선택지 중 비활성/업그레이드 항목은 선택하지 않으며, 클릭 후 메뉴 버튼의 표시가 바뀌었는지 확인합니다. 메뉴가 없거나 중첩/실험 UI를 읽을 수 없으면 웹의 현재 설정을 유지합니다. 메뉴 읽기는 잠시 메뉴를 열었다 닫지만 질문을 전송하지 않습니다.
