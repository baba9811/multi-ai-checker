import { useState } from 'react';
import { Download, ExternalLink, RefreshCw, Unplug } from 'lucide-react';
import type { Platform, Workspace } from '../../application/ports';
import type { ModelCatalog, Snapshot } from '../../application/provider-protocol';
import {
  providerIds,
  providers,
  type ProviderId,
  type Binding,
} from '../../domains/providers/model';
import { ProviderLogo } from './ProviderLogo';

export function ConnectionSettings({
  platform,
  bindings,
  locked,
  onBinding,
  onError,
  onWorking,
}: {
  platform: Platform;
  bindings: Workspace['bindings'];
  locked: boolean;
  onBinding: (provider: ProviderId, binding?: Binding) => void;
  onError: (error: unknown) => void;
  onWorking: (working: boolean) => void;
}) {
  const [working, setWorking] = useState<ProviderId>();
  const [snapshots, setSnapshots] = useState<Partial<Record<ProviderId, Snapshot>>>({});
  const [catalogs, setCatalogs] = useState<Partial<Record<ProviderId, ModelCatalog>>>({});
  const [errors, setErrors] = useState<Partial<Record<ProviderId, string>>>({});
  const disabled = locked || working !== undefined;
  async function check(id: ProviderId, reconnect = false, key?: string) {
    if (disabled) return;
    setWorking(id);
    onWorking(true);
    setErrors((old) => ({ ...old, [id]: undefined }));
    try {
      const binding = reconnect || !bindings[id] ? await platform.connect(id) : bindings[id]!;
      onBinding(id, binding);
      const snap = await platform.inspect(binding);
      setSnapshots((old) => ({ ...old, [id]: snap }));
      if (snap.url !== binding.url)
        throw new Error('연결한 대화가 바뀌었습니다. 다시 연결해주세요.');
      if (!snap.composer) {
        setCatalogs((old) => ({ ...old, [id]: undefined }));
        throw new Error('입력란을 찾지 못했습니다. 사이트에서 로그인 상태를 확인해주세요.');
      }
      const catalog = await platform.models(binding, key);
      setCatalogs((old) => ({ ...old, [id]: catalog }));
    } catch (error) {
      setErrors((old) => ({
        ...old,
        [id]: error instanceof Error ? error.message : '연결 검사 실패',
      }));
    } finally {
      setWorking(undefined);
      onWorking(false);
    }
  }
  function downloadDiagnostics() {
    const data = Object.fromEntries(
      providerIds.map((id) => {
        const snap = snapshots[id];
        return [
          id,
          {
            bound: !!bindings[id],
            composer: snap?.composer,
            busy: snap?.busy,
            draft: snap?.draft,
            diagnostics: snap?.diagnostics,
          },
        ];
      }),
    );
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'crosscheck-diagnostics.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <div className="page-intro">
        <h1>연결</h1>
        <p>같은 Chrome에서 로그인하면 됩니다.</p>
      </div>
      {providerIds.map((id) => {
        const snap = snapshots[id];
        const catalog = catalogs[id];
        const chosen =
          catalog?.options.find(
            (option) => option.key === catalog.current || option.label === catalog.current,
          )?.key ?? '';
        return (
          <article key={id} className="connection">
            <div className="section-title">
              <h2>
                <ProviderLogo provider={id} />
                {providers[id].name}
              </h2>
              <span className="hint">
                {working === id
                  ? '확인 중'
                  : errors[id]
                    ? '확인 필요'
                    : snap?.composer
                      ? '사용 가능'
                      : bindings[id]
                        ? '탭 연결됨'
                        : '미연결'}
              </span>
            </div>
            <div className="button-row">
              <button
                className="secondary"
                disabled={disabled}
                onClick={() => void check(id, true)}
              >
                {bindings[id] ? '다시 연결' : '연결'}
              </button>
              <button
                className="text-button"
                disabled={disabled}
                onClick={() =>
                  void (
                    bindings[id] ? platform.reveal(bindings[id]!) : platform.openProvider(id)
                  ).catch(onError)
                }
              >
                <ExternalLink size={13} /> 사이트 열기
              </button>
              {bindings[id] && (
                <button
                  className="icon-button"
                  aria-label={`${providers[id].name} 연결 검사`}
                  disabled={disabled}
                  onClick={() => void check(id)}
                >
                  <RefreshCw size={14} />
                </button>
              )}
            </div>
            {bindings[id] && (
              <div className="model-setting">
                <label htmlFor={`model-${id}`}>모델</label>
                <select
                  id={`model-${id}`}
                  aria-label={`${providers[id].name} 모델`}
                  value={chosen}
                  disabled={disabled || !catalog?.options.length}
                  onChange={(event) => void check(id, false, event.target.value)}
                >
                  {!chosen && <option value="">{catalog?.current ?? '웹에서 선택한 모델'}</option>}
                  {catalog?.options.map((option) => (
                    <option key={option.key} value={option.key} disabled={option.disabled}>
                      {option.label}
                      {option.disabled ? ' · 사용 불가' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {catalog?.message && <p className="hint">{catalog.message}</p>}
            {errors[id] && (
              <p className="error" role="status">
                {errors[id]}
              </p>
            )}
            {bindings[id] && (
              <details className="connection-detail">
                <summary>연결 정보</summary>
                <p className="hint">
                  {snap
                    ? `질문 ${snap.diagnostics?.questions ?? (snap.lastQuestion ? 1 : 0)} · 답변 ${snap.diagnostics?.answers ?? (snap.lastAnswer ? 1 : 0)} · 입력란 ${snap.composer ? '감지' : '미감지'}`
                    : '연결 검사로 현재 상태를 확인하세요.'}
                </p>
                <button
                  className="text-button"
                  disabled={disabled}
                  onClick={() =>
                    void platform
                      .disconnect(id)
                      .then(() => {
                        onBinding(id);
                        setSnapshots((old) => ({ ...old, [id]: undefined }));
                        setCatalogs((old) => ({ ...old, [id]: undefined }));
                      })
                      .catch(onError)
                  }
                >
                  <Unplug size={13} /> 연결 해제
                </button>
              </details>
            )}
          </article>
        );
      })}
      <button className="text-button" onClick={downloadDiagnostics}>
        <Download size={13} /> 진단 저장
      </button>
      <p className="hint">대화 내용과 계정 정보는 포함하지 않습니다.</p>
    </>
  );
}
