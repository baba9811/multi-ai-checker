import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCheck,
  ChevronDown,
  CircleHelp,
  Download,
  ExternalLink,
  Link2,
  LockKeyhole,
  MessageSquare,
  RotateCcw,
  Square,
  X,
} from 'lucide-react';
import { Binding, providerIds, providers, type ProviderId } from '../../domains/providers/model';
import { stageNames, type Run } from '../../domains/crosscheck/model';
import { budget, markdown, recoverRun, updateJob } from '../../domains/crosscheck/workflow';
import { executeAutomatic, importedRun } from '../../application/automatic-workflow';
import type { Conversation, Platform, Workspace } from '../../application/ports';
import { ProviderLogo } from '../providers/ProviderLogo';
import { ConnectionSettings } from '../providers/ConnectionSettings';
import { JobCard } from '../crosscheck/JobCard';
import { Guide } from '../privacy/Guide';

const message = (error: unknown) =>
  error instanceof Error ? error.message : '작업을 완료하지 못했습니다.';
export function App({ platform }: { platform: Platform }) {
  const [tab, setTab] = useState<'work' | 'connections' | 'guide'>('work');
  const [ready, setReady] = useState(false);
  const [owner, setOwner] = useState(false);
  const [notice, setNotice] = useState('');
  const [run, setRun] = useState<Run>();
  const [bindings, setBindings] = useState<Workspace['bindings']>({});
  const [source, setSource] = useState<Conversation>();
  const [selected, setSelected] = useState<ProviderId[]>([...providerIds]);
  const [mode, setMode] = useState<Run['mode']>('economy');
  const [busy, setBusy] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const abort = useRef<AbortController | undefined>(undefined);
  const alive = useRef(true);
  const operation = useRef(false);
  const writer = useRef(Promise.resolve());
  const workspace = useRef<Workspace>({ bindings: {} });

  useEffect(() => {
    alive.current = true;
    let release: (() => void) | undefined;
    void navigator.locks
      .request('crosscheck-controller', { ifAvailable: true }, async (lock) => {
        if (!alive.current) return;
        if (!lock) {
          setNotice('다른 CrossCheck 패널을 닫은 뒤 다시 여세요.');
          setReady(true);
          return;
        }
        setOwner(true);
        try {
          const stored = await platform.load();
          if (stored && alive.current) {
            const saved: Workspace['bindings'] = {};
            for (const id of providerIds) {
              const binding = Binding.safeParse(stored.bindings?.[id]);
              if (binding.success && binding.data.provider === id) saved[id] = binding.data;
            }
            const restored = recoverRun(stored.run);
            workspace.current = { run: restored, bindings: saved };
            setBindings(saved);
            setRun(restored);
          }
        } catch {
          setNotice('이전 기록을 복원하지 못했습니다. 새 검토를 시작할 수 있습니다.');
        }
        setReady(true);
        await new Promise<void>((resolve) => {
          release = resolve;
          if (!alive.current) resolve();
        });
      })
      .catch((error) => setNotice(message(error)));
    return () => {
      alive.current = false;
      abort.current?.abort();
      release?.();
    };
  }, []);

  useEffect(() => {
    if (!ready || !owner || busy || run) return;
    let cancelled = false;
    let sequence = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const read = async () => {
      const current = ++sequence;
      try {
        const value = await platform.currentConversation();
        if (!cancelled && current === sequence) {
          setSource(value);
          if (value)
            setSelected((old) =>
              old.includes(value.binding.provider) ? old : [...old, value.binding.provider],
            );
        }
      } catch {
        if (!cancelled && current === sequence) setSource(undefined);
      }
    };
    const poll = async () => {
      await read();
      if (!cancelled) timer = setTimeout(() => void poll(), 2500);
    };
    void poll();
    const changed = () => {
      void read();
    };
    const stop = platform.watchActiveTab?.(changed);
    window.addEventListener('focus', changed);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      stop?.();
      window.removeEventListener('focus', changed);
    };
  }, [ready, owner, busy, run, refresh]);

  function checkpoint(value: Workspace) {
    if (!alive.current) return Promise.reject(new Error('패널이 닫혀 작업을 중단했습니다.'));
    workspace.current = value;
    setRun(value.run);
    setBindings(value.bindings);
    writer.current = writer.current.then(() => platform.save(value));
    return writer.current;
  }
  async function start(resume = false) {
    if (!owner || operation.current || configuring) return;
    operation.current = true;
    setBusy(true);
    setNotice('');
    const controller = new AbortController();
    abort.current = controller;
    writer.current = writer.current.catch(() => {});
    try {
      let initial = resume ? workspace.current.run : undefined;
      if (!initial) {
        const active = await platform.currentConversation(selected);
        if (!active) throw new Error('ChatGPT, Claude 또는 Gemini 대화를 열고 시작해주세요.');
        initial = importedRun(active, selected, mode);
        setSource(active);
      }
      await executeAutomatic(
        initial,
        workspace.current.bindings,
        platform,
        controller.signal,
        checkpoint,
      );
    } catch (error) {
      if (alive.current) setNotice(message(error));
    } finally {
      operation.current = false;
      if (alive.current) setBusy(false);
    }
  }
  function onBinding(provider: ProviderId, binding?: Binding) {
    const next = { ...workspace.current.bindings };
    if (binding) next[provider] = binding;
    else delete next[provider];
    void checkpoint({ ...workspace.current, bindings: next }).catch((error) =>
      setNotice(message(error)),
    );
  }
  function reset() {
    if (busy) return;
    setNotice('');
    setSource(undefined);
    void checkpoint({ bindings: workspace.current.bindings }).catch((error) =>
      setNotice(message(error)),
    );
    setRefresh((old) => old + 1);
  }
  function exportRun() {
    if (!run) return;
    const url = URL.createObjectURL(
      new Blob([markdown(run)], { type: 'text/markdown;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'crosscheck.md';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const final = run?.jobs.find((job) => job.stage === 'synthesize' && job.status === 'done');
  const failed =
    run?.jobs.filter((job) => job.status === 'error' || job.status === 'interrupted') ?? [];
  const locked = !ready || !owner || busy || configuring;
  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <CheckCheck size={23} /> crosscheck
        </div>
        <span className="privacy" title="쿠키·비밀번호를 읽지 않습니다">
          <LockKeyhole size={14} />
        </span>
      </header>
      <nav className="tabs" aria-label="메뉴">
        <button className={tab === 'work' ? 'active' : ''} onClick={() => setTab('work')}>
          <MessageSquare size={14} /> 검토
        </button>
        <button
          className={tab === 'connections' ? 'active' : ''}
          onClick={() => setTab('connections')}
        >
          <Link2 size={14} /> 연결
        </button>
        <button
          className={`help-tab ${tab === 'guide' ? 'active' : ''}`}
          aria-label="사용 안내"
          onClick={() => setTab('guide')}
        >
          <CircleHelp size={16} />
        </button>
      </nav>
      {notice && (
        <div className="notice" role="status">
          <span>{notice}</span>
          <button aria-label="알림 닫기" onClick={() => setNotice('')}>
            <X size={14} />
          </button>
        </div>
      )}
      <main>
        {!ready ? (
          <p className="loading">불러오는 중…</p>
        ) : tab === 'connections' ? (
          <ConnectionSettings
            platform={platform}
            bindings={bindings}
            locked={locked}
            onBinding={onBinding}
            onError={(error) => setNotice(message(error))}
            onWorking={setConfiguring}
          />
        ) : tab === 'guide' ? (
          <Guide />
        ) : !run ? (
          <>
            <div className="workspace-heading">
              <h1>현재 답변 검토</h1>
              <button
                className="icon-button"
                aria-label="현재 대화 새로 읽기"
                disabled={locked}
                onClick={() => setRefresh((old) => old + 1)}
              >
                <RotateCcw size={15} />
              </button>
            </div>
            <section className="auto-source">
              {source?.snapshot.lastQuestion ? (
                <>
                  <div className="source-label">
                    <ProviderLogo provider={source.binding.provider} />
                    <span>{providers[source.binding.provider].name} · 현재 대화</span>
                  </div>
                  <p className="source-question">{source.snapshot.lastQuestion}</p>
                  {source.snapshot.lastAnswer && (
                    <details className="source-preview">
                      <summary>
                        가져온 답변 <ChevronDown size={13} />
                      </summary>
                      <pre>{source.snapshot.lastAnswer}</pre>
                    </details>
                  )}
                </>
              ) : (
                <p className="empty-source">
                  검토할 AI 대화를 열어주세요.
                  <br />
                  질문과 답변은 자동으로 가져옵니다.
                </p>
              )}
            </section>
            <p className="auto-explanation">다른 AI 검토부터 메인 대화의 최종 답변까지.</p>
            <div className="auto-participants">
              {selected.map((id) => (
                <span key={id}>
                  <ProviderLogo provider={id} />
                  {providers[id].name}
                </span>
              ))}
            </div>
            <button
              className="primary full"
              disabled={locked || selected.length < 2}
              onClick={() => void start()}
            >
              {busy ? '대화 연결 중…' : '자동 검토 시작'}
              <ArrowRight size={16} />
            </button>
            <p className="action-note">
              시작하면 선택한 AI에 질문·답변을 공유하고
              <br />
              현재 대화에 최종 프롬프트를 보냅니다.
            </p>
            <details className="auto-options">
              <summary>
                검토 설정 <ChevronDown size={14} />
              </summary>
              <div className="providers">
                {providerIds.map((id) => (
                  <button
                    key={id}
                    className={`provider ${selected.includes(id) ? 'selected' : ''}`}
                    aria-label={`${providers[id].name} 참여`}
                    aria-pressed={selected.includes(id)}
                    disabled={locked || id === source?.binding.provider}
                    onClick={() =>
                      setSelected((old) =>
                        old.includes(id) ? old.filter((value) => value !== id) : [...old, id],
                      )
                    }
                  >
                    <ProviderLogo provider={id} />
                    {providers[id].name}
                  </button>
                ))}
              </div>
              <div className="review-options">
                <div className="segmented" aria-label="검토 깊이">
                  {(['economy', 'thorough'] as const).map((value) => (
                    <button
                      key={value}
                      className={value === mode ? 'active' : ''}
                      aria-pressed={value === mode}
                      disabled={locked}
                      onClick={() => setMode(value)}
                    >
                      {value === 'economy' ? '빠르게' : '꼼꼼하게'}
                    </button>
                  ))}
                </div>
                <span>최대 {budget(selected.length, mode) - 1}회 요청</span>
              </div>
              <button className="text-button" onClick={() => setTab('connections')}>
                <Link2 size={13} /> 연결·모델 설정
              </button>
            </details>
          </>
        ) : (
          <>
            <div className="run-top">
              <h1>{final ? '검토 완료' : busy ? '검토 중' : '검토 멈춤'}</h1>
              <button
                className="icon-button"
                aria-label="기록 지우고 새 검토"
                disabled={locked}
                onClick={reset}
              >
                <RotateCcw size={16} />
              </button>
            </div>
            <p className="source-question run-question">{run.question}</p>
            {!final && (
              <>
                <div className="auto-progress" role="status" aria-live="polite">
                  {(['collect', 'review', 'synthesize'] as const).map((stage, index) => {
                    const passed = index < ['collect', 'review', 'synthesize'].indexOf(run.stage);
                    const active = run.stage === stage;
                    return (
                      <div key={stage} className={active ? 'current' : passed ? 'passed' : ''}>
                        <span>{passed ? <Check size={13} /> : index + 1}</span>
                        {stageNames[stage]}
                        {active && busy && <span className="pulse" />}
                      </div>
                    );
                  })}
                </div>
                <div className="provider-progress">
                  {run.jobs
                    .filter((job) => job.stage === run.stage)
                    .map((job) => (
                      <div key={job.id}>
                        <span>
                          <ProviderLogo provider={job.provider} />
                          {providers[job.provider].name}
                        </span>
                        <span className={`job-status ${job.status}`}>
                          {
                            {
                              ready: '대기',
                              sending: '답변 생성 중',
                              done: '완료',
                              error: '확인 필요',
                              interrupted: '중단됨',
                            }[job.status]
                          }
                        </span>
                      </div>
                    ))}
                </div>
                {busy && (
                  <button className="stop-button full" onClick={() => abort.current?.abort()}>
                    <Square size={12} /> 검토 중단
                  </button>
                )}
              </>
            )}
            {final && (
              <>
                <div className="final-answer">
                  <div className="source-label">
                    <ProviderLogo provider={run.chair} />
                    {providers[run.chair].name} · 최종 답변
                  </div>
                  <pre className="answer">{final.answer}</pre>
                </div>
                <button
                  className="primary full"
                  onClick={() =>
                    void platform.reveal(run.main!).catch((error) => setNotice(message(error)))
                  }
                >
                  메인 대화에서 보기 <ExternalLink size={14} />
                </button>
                <p className="action-note">출처와 미확인 내용도 함께 확인해주세요.</p>
              </>
            )}
            {failed.length > 0 && (
              <div className="run-errors">
                {failed.map((job) => (
                  <p key={job.id}>
                    <strong>{providers[job.provider].name}</strong> · {job.error}
                  </p>
                ))}
              </div>
            )}
            <details className="history">
              <summary>
                검토 내역 <ChevronDown size={14} />
              </summary>
              {run.jobs.map((job) => (
                <div key={job.id}>
                  <h3>
                    {providers[job.provider].name} · {stageNames[job.stage]}
                  </h3>
                  <pre>{job.answer || job.error || '아직 요청하지 않았습니다.'}</pre>
                  <details>
                    <summary>보낸 프롬프트</summary>
                    <pre>{job.prompt}</pre>
                  </details>
                </div>
              ))}
              <button className="text-button" onClick={exportRun}>
                <Download size={13} /> 기록 저장
              </button>
            </details>
            {!busy && !final && (
              <details className="recovery">
                <summary>
                  중단된 검토 복구 <ChevronDown size={14} />
                </summary>
                <p className="hint">
                  이미 전송된 요청은 다시 보내지 않습니다. 해당 탭의 답변을 가져온 뒤 계속할 수
                  있습니다.
                </p>
                {run.jobs
                  .filter((job) => job.stage === run.stage && job.status !== 'done')
                  .map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      locked={locked}
                      onNotice={setNotice}
                      onManual={(answer) => {
                        const value = updateJob(workspace.current.run!, job.id, {
                          answer,
                          status: 'done',
                          method: 'manual',
                          error: undefined,
                        });
                        void checkpoint({ ...workspace.current, run: value }).catch((error) =>
                          setNotice(message(error)),
                        );
                      }}
                    />
                  ))}
                <button
                  className="secondary full"
                  disabled={locked}
                  onClick={() => void start(true)}
                >
                  남은 검토 계속
                </button>
              </details>
            )}
          </>
        )}
      </main>
    </div>
  );
}
