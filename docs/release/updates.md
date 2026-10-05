# Updates

## Users

The panel displays its installed manifest version, not a claim that it is the latest release. When that manifest has an update source, it shows browser-managed update guidance. Without that capability, it shows manual instructions without asserting an installation type.

Chrome normally checks on startup and every few hours. Installation waits until the extension is idle; an open side panel delays it. Policies may restrict updates. [Official update lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/extensions-update-lifecycle).

A downloaded-update notice asks you to finish the review, export needed results with **기록 저장**, and close the panel. **Disable, reload, update, or browser restart clears session review history and bindings.** Selected file bytes are temporary; keep the originals. An update does not preserve resumable session state or automatically continue interrupted sends. [Official session-storage lifecycle](https://developer.chrome.com/docs/extensions/reference/api/storage#property-session).

For store installs, **확장 관리 열기** opens this extension's management page. Chrome's Developer mode → Update manually checks installed extensions as a group. For an unpacked install, finish work/export records, replace the local release folder, reload only CrossCheck, then refresh provider tabs. [Official manual-update instructions](https://developer.chrome.com/docs/extensions/develop/concepts/extensions-update-lifecycle).

**한국어:** 현재 설치 버전을 표시합니다. 스토어 설치의 업데이트 확인·설치는 Chrome이 처리하며, 열린 패널은 설치를 늦출 수 있습니다. 새 버전 안내가 나오면 검토를 마치고 **기록 저장**으로 내보낸 뒤 패널을 닫으세요. 업데이트하면 세션의 검토 내역과 연결이 지워집니다. 원본 파일은 직접 보관하고 필요할 때 다시 선택하세요. 압축해제 설치는 새 폴더로 교체 후 이 확장과 AI 탭을 새로고침합니다.

## Maintainer implementation and release

Updates can be uploaded and submitted from GitHub Releases after the one-time store/authentication setup. See [release automation](automation.md) for the workflow, activation state, and recovery procedure.

- Background listens to `runtime.onUpdateAvailable` and stores only the downloaded pending version in session. A reopened panel can read a missed notice while the same installation/session remains. Chrome clears that notice on update together with other session data.
- UI listens passively, removes its listener on close, and disables the management action during active operations. It does not reload the extension, check on a timer, run a persistent worker, download packages, or change review state.
- `requestUpdateCheck` is intentionally absent: Chrome recommends it only in exceptional circumstances such as a backend-known incompatible client. There is no such backend here. [Runtime update APIs](https://developer.chrome.com/docs/extensions/reference/api/runtime).
- No management permission, custom update server, remote code, persistent local history cache, or guessed store listing URL was added. Manifest `update_url` is a capability hint, not proof of store publication or entitlement.
- Publish a higher-version reviewed package through the store's normal submission/review process; do not overwrite an unpacked local folder and claim store users received it. Confirm actual distribution separately. [Store update procedure](https://developer.chrome.com/docs/webstore/update).

Verification is tracked separately in [validation.md](../testing/validation.md): six focused unit checks cover passive metadata/event persistence and cleanup; three synthetic UI checks cover guidance, active-review safety, and same-session panel reopening. These passed within the final 55-unit and 53-browser suites. The final unpacked-extension suite also passed all three checks. A native installed panel showed version 0.3.0. None of these checks demonstrates a real Chrome Web Store download/install, which requires a published store release.
