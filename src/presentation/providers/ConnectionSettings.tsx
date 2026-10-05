import { useEffect, useRef, useState } from 'react';
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
  const checking = useRef(false);
  const mounted = useRef(true);
  const refresh = useRef(async () => {});
  const disabled = locked || working !== undefined;
  async function check(
    id: ProviderId,
    reconnect = false,
    key?: string,
    readModels = false,
    reattach = false,
  ) {
    if (disabled || checking.current || !mounted.current) return;
    checking.current = true;
    setWorking(id);
    onWorking(true);
    setErrors((old) => ({ ...old, [id]: undefined }));
    setSnapshots((old) => ({ ...old, [id]: undefined }));
    try {
      const saved = bindings[id];
      const binding =
        reconnect || !saved
          ? await platform.connect(id)
          : reattach && platform.refreshConnection
            ? await platform.refreshConnection(saved)
            : saved;
      if (!mounted.current) return;
      if (
        !saved ||
        binding.documentId !== saved.documentId ||
        binding.url !== saved.url ||
        binding.tabId !== saved.tabId
      ) {
        onBinding(id, binding);
        setCatalogs((old) => ({ ...old, [id]: undefined }));
      }
      const snap = await platform.inspect(binding);
      if (!mounted.current) return;
      setSnapshots((old) => ({ ...old, [id]: snap }));
      if (snap.url !== binding.url)
        throw new Error('연결한 대화가 바뀌었습니다. 다시 연결해주세요.');
      if (!snap.composer || snap.busy || snap.draft) {
        setCatalogs((old) => ({ ...old, [id]: undefined }));
        return;
      }
      if (readModels || key !== undefined) {
        const catalog = await platform.models(binding, key);
        if (mounted.current) setCatalogs((old) => ({ ...old, [id]: catalog }));
      }
    } catch (error) {
      setCatalogs((old) => ({ ...old, [id]: undefined }));
      setErrors((old) => ({
        ...old,
        [id]: error instanceof Error ? error.message : '연결 검사 실패',
      }));
    } finally {
      checking.current = false;
      if (mounted.current) {
        setWorking(undefined);
        onWorking(false);
      }
    }
  }
  refresh.current = async () => {
    if (disabled || checking.current) return;
    for (const id of providerIds) {
      if (!mounted.current) break;
      if (bindings[id]) await check(id);
    }
  };
  useEffect(() => {
    mounted.current = true;
    const update = () => {
      if (document.visibilityState === 'visible') void refresh.current();
    };
    window.addEventListener('focus', update);
    document.addEventListener('visibilitychange', update);
    const stop = platform.watchActiveTab?.(update);
    update();
    return () => {
      mounted.current = false;
      if (checking.current) onWorking(false);
      window.removeEventListener('focus', update);
      document.removeEventListener('visibilitychange', update);
      stop?.();
    };
  }, [platform]);
  async function openTab(id: ProviderId) {
    const saved = bindings[id];
    if (saved) {
      try {
        await platform.reveal(saved);
        return;
      } catch {
        onBinding(id);
        setSnapshots((old) => ({ ...old, [id]: undefined }));
        setCatalogs((old) => ({ ...old, [id]: undefined }));
      }
    }
    await platform.openProvider(id);
    setErrors((old) => ({
      ...old,
      [id]: '열린 탭에서 페이지·로그인 상태를 확인한 뒤 연결해주세요.',
    }));
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
        <p>연결을 누르면 AI 탭이 열립니다. 필요한 경우 그 탭에서 로그인하세요.</p>
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
                    ? '페이지 확인 필요'
                    : snap?.busy
                      ? '응답 중'
                      : snap?.draft
                        ? '작성 중'
                        : snap?.composer
                          ? '입력란 감지'
                          : bindings[id]
                            ? '페이지 확인 필요'
                            : '미연결'}
              </span>
            </div>
            <div className="button-row">
              <button
                className="secondary"
                disabled={disabled}
                onClick={() => void check(id, true, undefined, true)}
              >
                {bindings[id] ? '다시 연결' : '연결'}
              </button>
              <button
                className="text-button"
                disabled={disabled}
                onClick={() => void openTab(id).catch(onError)}
              >
                <ExternalLink size={13} /> 탭 열기
              </button>
              {(bindings[id] || errors[id]) && (
                <button
                  className="text-button"
                  aria-label={`${providers[id].name} 로그인 완료 · 다시 확인`}
                  disabled={disabled}
                  onClick={() => void check(id, false, undefined, false, true)}
                >
                  <RefreshCw size={14} /> 로그인 완료 · 다시 확인
                </button>
              )}
            </div>
            {snap && !errors[id] && (
              <p className="hint" role="status">
                {snap.busy
                  ? 'AI가 응답 중입니다. 끝난 뒤 다시 확인하세요.'
                  : snap.draft
                    ? '작성 중인 내용이 있습니다. 웹에서 직접 전송하거나 정리한 뒤 다시 확인하세요.'
                    : snap.composer
                      ? '입력란을 확인했습니다. 웹에서 선택한 모델을 사용합니다.'
                      : '페이지 확인 필요 · 탭에서 페이지·로그인 상태를 확인한 뒤 다시 확인하세요.'}
              </p>
            )}
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
            {catalog && !catalog.options.length && !catalog.message && (
              <p className="hint">
                모델 메뉴를 지원하지 않는 페이지입니다. 웹에서 직접 선택한 모델을 사용합니다.
              </p>
            )}
            {bindings[id] && snap?.composer && !snap.busy && !snap.draft && (
              <button
                className="text-button"
                disabled={disabled}
                onClick={() => void check(id, false, undefined, true)}
              >
                모델 목록 불러오기
              </button>
            )}
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
