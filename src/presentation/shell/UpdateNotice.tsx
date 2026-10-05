import { useEffect, useState } from 'react';
import type { ExtensionStatus, Platform } from '../../application/ports';

export function UpdateNotice({ platform, busy }: { platform: Platform; busy: boolean }) {
  const [status, setStatus] = useState<ExtensionStatus>();
  const [error, setError] = useState('');
  useEffect(() => {
    if (!platform.extensionStatus) return;
    let active = true;
    let announced: string | undefined;
    const stop = platform.watchExtensionUpdate?.((version) => {
      announced = version;
      if (active) setStatus((old) => (old ? { ...old, pendingVersion: version } : old));
    });
    void platform
      .extensionStatus()
      .then((info) => {
        if (active) setStatus(announced ? { ...info, pendingVersion: announced } : info);
      })
      .catch(() => {
        if (active) setError('버전 정보를 읽지 못했습니다. 확장 관리에서 확인하세요.');
      });
    return () => {
      active = false;
      stop?.();
    };
  }, [platform]);
  if (!platform.extensionStatus) return null;
  return (
    <section className="update-info" aria-label="확장 업데이트">
      {status?.pendingVersion && (
        <p className="notice" role="status">
          새 버전 {status.pendingVersion} 설치 대기 ·{' '}
          {busy ? '진행 중인 작업을 마친 뒤' : '필요한 검토 내역을 확인한 뒤'} 기록 저장으로
          내보내고 패널을 닫으세요. 업데이트하면 검토 내역과 연결이 지워집니다. 원본 파일도 다시
          선택해야 합니다.
        </p>
      )}
      <details>
        <summary>
          버전 {status?.version ?? (error ? '확인 필요' : '확인 중')} · 업데이트 안내
        </summary>
        {error && (
          <p className="error" role="status">
            {error}
          </p>
        )}
        {status && (
          <>
            <p>{status.automaticUpdates ? '브라우저 자동 업데이트' : '수동 업데이트 안내'}</p>
            <p>
              {status.automaticUpdates
                ? 'Chrome이 시작할 때와 몇 시간마다 확인합니다. 열린 패널은 설치를 늦출 수 있으므로 진행 중인 검토를 마친 뒤 닫으세요. 관리 정책에 따라 업데이트가 제한될 수 있습니다.'
                : '자동 업데이트 설정을 확인하지 못했습니다. 압축해제 설치는 새 배포 폴더로 교체한 뒤 확장 관리에서 이 확장만 새로고침하세요. 검토를 마친 뒤 진행하고 AI 탭도 새로고침하세요.'}
            </p>
            <p>
              스토어 설치를 수동 확인하려면 확장 관리의 개발자 모드 → 업데이트를 사용하세요. 이
              버튼은 설치된 확장 전체를 확인합니다. 현재 버전 표시만으로 최신 버전임을 보장하지
              않습니다.
            </p>
            <p>
              확장 비활성화·새로고침·업데이트·브라우저 재시작은 세션의 검토 내역과 연결을 지웁니다.
              먼저 기록 저장으로 필요한 내역을 내보내세요. 원본 파일은 다시 선택해야 하며, 업데이트
              뒤 중단된 검토를 자동으로 이어가지 않습니다.
            </p>
          </>
        )}
        {platform.openExtensionManager && (
          <button
            className="text-button"
            disabled={busy}
            onClick={() =>
              void platform.openExtensionManager!().catch(() =>
                setError(
                  '확장 관리 페이지를 열지 못했습니다. 주소창에 chrome://extensions를 입력하세요.',
                ),
              )
            }
          >
            확장 관리 열기
          </button>
        )}
      </details>
    </section>
  );
}
