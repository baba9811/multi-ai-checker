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
import {
  executeAutomatic,
  importedRun,
  assertSameSource,
} from '../../application/automatic-workflow';
import { matchAttachments, prepareAttachments } from '../../application/attachments';
import { attachmentMetadata, type AttachmentPayload } from '../../domains/attachments/model';
import type { Conversation, Platform, Workspace } from '../../application/ports';
import { ProviderLogo } from '../providers/ProviderLogo';
import { ConnectionSettings } from '../providers/ConnectionSettings';
import { JobCard } from '../crosscheck/JobCard';
import { Guide } from '../privacy/Guide';
import { UpdateNotice } from './UpdateNotice';

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
  const [files, setFiles] = useState<AttachmentPayload[]>([]);
  const [readingFiles, setReadingFiles] = useState(false);
  const [readingSource, setReadingSource] = useState(false);
  const [originalsConfirmed, setOriginalsConfirmed] = useState(false);
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
    if (!ready || !owner || busy || run || source || readingSource || tab !== 'work') return;
    let cancelled = false;
    let sequence = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const read = async () => {
      const current = ++sequence;
      try {
        const value = await platform.currentConversation();
        if (!cancelled && current === sequence) {
          if (
            value?.snapshot.composer &&
            value.snapshot.lastQuestion &&
            value.snapshot.lastAnswer &&
            !value.snapshot.busy &&
            !value.snapshot.draft &&
            !value.snapshot.truncated &&
            value.snapshot.context?.turns.length &&
            !value.snapshot.context.error
          ) {
            setSource(value);
            setSelected((old) =>
              old.includes(value.binding.provider) ? old : [...old, value.binding.provider],
            );
          }
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
  }, [ready, owner, busy, run, source, readingSource, tab, refresh]);

  function checkpoint(value: Workspace) {
    if (!alive.current) return Promise.reject(new Error('패널이 닫혀 작업을 중단했습니다.'));
    workspace.current = value;
    setRun(value.run);
    setBindings(value.bindings);
    writer.current = writer.current.then(() => platform.save(value));
    return writer.current;
  }
  async function start(resume = false) {
    if (
      !owner ||
      operation.current ||
      configuring ||
      readingFiles ||
      readingSource ||
      (!resume && (!originalsConfirmed || !source))
    )
      return;
    operation.current = true;
    setBusy(true);
    setNotice('');
    const controller = new AbortController();
    abort.current = controller;
    writer.current = writer.current.catch(() => {});
    try {
      // Keep the permission request in the initiating click before any other asynchronous work.
      const access = platform.requestAccess?.(resume ? workspace.current.run!.selected : selected);
      await access;
      let initial = resume ? workspace.current.run : undefined;
      if (!initial) {
        if (!source) throw new Error('메인 대화를 먼저 선택해주세요.');
        await platform.reveal(source.binding);
        if (controller.signal.aborted) throw new Error('자동 검토를 중단했습니다.');
        const active = {
          binding: source.binding,
          snapshot: await platform.inspect(source.binding),
        };
        assertSameSource(source.snapshot, active.snapshot);
        initial = importedRun(active, selected, mode, files.map(attachmentMetadata));
        setSource(active);
      }
      if (!matchAttachments(initial.attachments, files))
        throw new Error(
          '저장된 원본 파일과 일치하지 않습니다. 이름과 내용을 바꾸지 않은 원본을 다시 선택해주세요.',
        );
      await executeAutomatic(
        initial,
        workspace.current.bindings,
        platform,
        controller.signal,
        checkpoint,
        files,
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
    if (busy || readingFiles) return;
    setNotice('');
    setSource(undefined);
    setFiles([]);
    setOriginalsConfirmed(false);
    void checkpoint({ bindings: workspace.current.bindings }).catch((error) =>
      setNotice(message(error)),
    );
    setRefresh((old) => old + 1);
  }
  async function reselectSource() {
    if (busy || configuring || readingFiles || readingSource) return;
    setSource(undefined);
    setFiles([]);
    setOriginalsConfirmed(false);
    setNotice('');
    setReadingSource(true);
    try {
      const active = await platform.currentConversation(selected);
      if (!active)
        throw new Error('검토할 ChatGPT, Claude 또는 Gemini 대화를 열고 다시 선택해주세요.');
      const participants = selected.includes(active.binding.provider)
        ? selected
        : [...selected, active.binding.provider];
      // Validate a readable source before enabling file selection or review.
      importedRun(active, participants, mode);
      if (alive.current) {
        setSource(active);
        setSelected(participants);
      }
    } catch (error) {
      if (alive.current) setNotice(message(error));
    } finally {
      if (alive.current) setReadingSource(false);
    }
  }
  async function selectFiles(input: HTMLInputElement) {
    const selectedFiles = [...(input.files ?? [])];
    if (!selectedFiles.length) return;
    setReadingFiles(true);
    setFiles([]);
    if (!run) setOriginalsConfirmed(false);
    setNotice('');
    try {
      const payloads = await prepareAttachments(selectedFiles);
      if (alive.current) {
        setFiles(payloads);
      }
    } catch (error) {
      if (alive.current) setNotice(message(error));
    } finally {
      input.value = '';
      if (alive.current) setReadingFiles(false);
    }
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
  const locked = !ready || !owner || busy || configuring || readingFiles || readingSource;
  const matchingFiles = !run || matchAttachments(run.attachments, files);
  const mainBinding = run?.main ?? source?.binding;
  const included =
    run?.jobs
      .filter((job) => job.stage === 'collect' && job.status === 'done')
      .map((job) => job.provider) ?? [];
  const excluded = run?.selected.filter((id) => !included.includes(id)) ?? [];
  const fileSelection = (
    <section className="attachments" aria-label="원본 첨부파일">
      <div className="attachment-header">
        <h2>{run ? '검토에 사용한 원본 파일' : '함께 검토할 파일'}</h2>
        <label className="attachment-picker">
          {readingFiles ? '파일 읽는 중…' : files.length || run ? '파일 다시 선택' : '파일 선택'}
          <input
            type="file"
            multiple
            aria-label="원본 파일 선택"
            disabled={locked || (!source && !run)}
            onChange={(event) => void selectFiles(event.currentTarget)}
          />
        </label>
      </div>
      <p className="hint">첨부가 있으면 원본을 모두 선택하세요.</p>
      <details className="file-guide">
        <summary>파일 안내</summary>
        <p className="hint">
          대화에 올린 파일·이미지를 자동으로 가져올 수 없습니다. 원본을 선택하면 각 AI의 업로드를
          확인한 뒤 전송합니다. 최대 10개 · 합계 20 MB. 파일 내용은 패널이 열려 있는 동안만
          보관합니다.
        </p>
      </details>
      {run && run.attachments.length > 0 && (
        <p className="hint">필요한 원본: {run.attachments.map((file) => file.name).join(', ')}</p>
      )}
      {files.length > 0 && (
        <ul className="attachment-list">
          {files.map((file) => (
            <li key={file.name}>
              <span>
                {file.name}
                <small>
                  {(file.size / 1024).toLocaleString('ko-KR', { maximumFractionDigits: 1 })} KB
                </small>
              </span>
              <button
                type="button"
                className="icon-button"
                aria-label={`${file.name} 선택 해제`}
                disabled={locked}
                onClick={() => {
                  setFiles((old) => old.filter((item) => item !== file));
                  setOriginalsConfirmed(false);
                }}
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {run && !matchingFiles && (
        <p className="error" role="status">
          {files.length
            ? '저장된 원본 파일과 일치하지 않습니다. 이름과 내용을 바꾸지 않은 원본을 다시 선택해주세요.'
            : '계속하려면 위에 표시된 원본 파일을 다시 선택해주세요. 이미 전송된 요청은 재전송하지 않습니다.'}
        </p>
      )}
      {!run && (
        <label className="originals-confirmation">
          <input
            type="checkbox"
            checked={originalsConfirmed}
            disabled={locked || !source}
            onChange={(event) => setOriginalsConfirmed(event.target.checked)}
          />
          {files.length
            ? '원래 대화의 파일·이미지를 모두 선택했습니다'
            : '원래 대화에 첨부파일이 없습니다'}
        </label>
      )}
    </section>
  );
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
          <>
            {mainBinding && (
              <button
                className="secondary main-return"
                onClick={() =>
                  void platform.reveal(mainBinding).catch((error) => setNotice(message(error)))
                }
              >
                <ExternalLink size={14} /> 원래 대화로 돌아가기
              </button>
            )}
            <ConnectionSettings
              platform={platform}
              bindings={bindings}
              locked={locked}
              onBinding={onBinding}
              onError={(error) => setNotice(message(error))}
              onWorking={setConfiguring}
            />
          </>
        ) : tab === 'guide' ? (
          <Guide />
        ) : !run ? (
          <>
            <div className="workspace-heading">
              <h1>대화 검토</h1>
              <button
                className="text-button"
                disabled={locked}
                onClick={() => void reselectSource()}
              >
                <RotateCcw size={15} />
                {readingSource
                  ? '대화 읽는 중…'
                  : source
                    ? '현재 탭으로 변경'
                    : '현재 탭에서 가져오기'}
              </button>
            </div>
            <section className="auto-source">
              {source?.snapshot.lastQuestion ? (
                <>
                  <div className="source-label">
                    <ProviderLogo provider={source.binding.provider} />
                    <span>{providers[source.binding.provider].name} · 원래 대화</span>
                  </div>
                  <p className="hint">
                    현재 화면에 불러온 질문·답변 {source.snapshot.context.turns.length}쌍 · 불러오지
                    않은 이전 대화는 포함하지 않습니다.
                  </p>
                  <button
                    className="text-button"
                    onClick={() =>
                      void platform
                        .reveal(source.binding)
                        .catch((error) => setNotice(message(error)))
                    }
                  >
                    <ExternalLink size={14} /> 원래 대화로 돌아가기
                  </button>
                  <p className="source-question">{source.snapshot.lastQuestion}</p>
                  {source.snapshot.lastAnswer && (
                    <details className="source-preview">
                      <summary>
                        공유할 대화 전체 보기 <ChevronDown size={13} />
                      </summary>
                      {source.snapshot.context.turns.map((turn, index) => (
                        <div key={index}>
                          <h3>{index + 1}번째 질문</h3>
                          <pre>{turn.question}</pre>
                          <h3>{index + 1}번째 답변</h3>
                          <pre>{turn.answer}</pre>
                        </div>
                      ))}
                    </details>
                  )}
                </>
              ) : (
                <p className="empty-source">
                  검토할 AI 대화를 열고 현재 탭에서 가져오기를 눌러주세요.
                  <br />
                  처음에는 대화를 읽을 사이트 권한이 필요합니다.
                </p>
              )}
            </section>
            {fileSelection}
            <p className="hint">검토할 다른 AI</p>
            <div className="auto-participants" role="group" aria-label="검토할 다른 AI">
              {providerIds
                .filter((id) => id !== source?.binding.provider)
                .map((id) => (
                  <label key={id}>
                    <input
                      type="checkbox"
                      aria-label={`${providers[id].name} 참여`}
                      checked={selected.includes(id)}
                      disabled={locked || id === source?.binding.provider}
                      onChange={() =>
                        setSelected((old) =>
                          old.includes(id) ? old.filter((value) => value !== id) : [...old, id],
                        )
                      }
                    />
                    <ProviderLogo provider={id} />
                    {providers[id].name}
                  </label>
                ))}
            </div>
            <button
              className="primary full"
              disabled={locked || selected.length < 2 || !source || !originalsConfirmed}
              onClick={() => void start()}
            >
              {busy ? '전송·답변 확인 중' : '자동 검토 시작'}
              <ArrowRight size={16} />
            </button>
            <p className="action-note">
              AI 탭을 하나씩 방문합니다. 패널을 열어두세요. 시작하면 선택한 AI에 불러온 대화·선택한
              파일을 공유하고
              <br />
              {source ? providers[source.binding.provider].name : '원래 AI'} 원래 대화에 최종
              프롬프트를 보냅니다.
            </p>
            <details className="auto-options">
              <summary>
                검토 설정 <ChevronDown size={14} />
              </summary>
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
              <button className="text-button" disabled={locked} onClick={reset}>
                <RotateCcw size={16} />새 검토
              </button>
            </div>
            {final && (
              <p className="participation-summary">
                {included.length}개 AI 참여: {included.map((id) => providers[id].name).join(' · ')}
                {excluded.length > 0 && (
                  <span> · 제외: {excluded.map((id) => providers[id].name).join(' · ')}</span>
                )}
              </p>
            )}
            <p className="source-question run-question">{run.question}</p>
            {run.context && (
              <details className="source-preview">
                <summary>공유한 대화 · 현재 화면에 불러온 {run.context.turns.length}쌍</summary>
                {run.context.turns.map((turn, index) => (
                  <div key={index}>
                    <h3>{index + 1}번째 질문</h3>
                    <pre>{turn.question}</pre>
                    <h3>{index + 1}번째 답변</h3>
                    <pre>{turn.answer}</pre>
                  </div>
                ))}
              </details>
            )}
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
                              sending: '전송·답변 확인 중',
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
                <button
                  className="primary full"
                  onClick={() =>
                    void platform.reveal(run.main!).catch((error) => setNotice(message(error)))
                  }
                >
                  원래 대화에서 보기 <ExternalLink size={14} />
                </button>
                <div className="final-answer">
                  <div className="source-label">
                    <ProviderLogo provider={run.chair} />
                    {providers[run.chair].name} · 최종 답변
                  </div>
                  <pre className="answer">{final.answer}</pre>
                </div>
                <p className="action-note">출처와 미확인 내용도 함께 확인해주세요.</p>
              </>
            )}
            {failed.length > 0 && (
              <div className="run-errors">
                {failed.map((job) => (
                  <div className="run-error" key={job.id}>
                    <p>
                      <strong>{providers[job.provider].name}</strong> · {job.error}
                    </p>
                    {bindings[job.provider] && (
                      <button
                        className="text-button"
                        onClick={() =>
                          void platform
                            .reveal(bindings[job.provider]!)
                            .catch((error) => setNotice(message(error)))
                        }
                        aria-label={`${providers[job.provider].name} AI에서 확인`}
                      >
                        <ExternalLink size={13} /> AI에서 확인
                      </button>
                    )}
                  </div>
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
              <details className="recovery" open>
                <summary>
                  중단된 검토 복구 <ChevronDown size={14} />
                </summary>
                <p className="hint">
                  이미 전송된 요청은 다시 보내지 않습니다. 해당 탭의 답변을 가져온 뒤 계속할 수
                  있습니다.
                </p>
                {run.attachments.length > 0 && fileSelection}
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
                  disabled={locked || !matchingFiles}
                  onClick={() => void start(true)}
                >
                  남은 검토 계속
                </button>
              </details>
            )}
          </>
        )}
      </main>
      <UpdateNotice platform={platform} busy={locked} />
    </div>
  );
}
