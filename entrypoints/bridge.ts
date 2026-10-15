import { defineUnlistedScript } from 'wxt/utils/define-unlisted-script';
import { Command, type Progress } from '../src/application/provider-protocol';
import { LIMITS } from '../src/domains/crosscheck/model';
import { providerForUrl } from '../src/domains/providers/model';
import {
  assertTarget,
  finishedMarker,
  isBusy,
  replies,
  questions,
  settledSnapshot,
  snapshot,
  submit,
  textOf,
  messageKey,
} from '../src/infrastructure/providers/dom';
import { modelMenu, readClaudeProbeLabel } from '../src/infrastructure/providers/models';
import { claudeProbe } from '../src/infrastructure/providers/claude/probe';
import { createClaudePeer } from '../src/infrastructure/providers/claude/peer';
import { ClaudeProbeReason, type ClaudeProbeProgress } from '../src/application/claude-probe';
import {
  GeminiReadinessProgress,
  GeminiReadinessReason,
} from '../src/application/gemini-readiness';
import { createGeminiHeaderObservation } from '../src/infrastructure/providers/gemini/header-observation';
import { geminiReadiness } from '../src/infrastructure/providers/gemini/readiness';

export default defineUnlistedScript(() => {
  const world = globalThis as typeof globalThis & { __crosscheckInstalled?: boolean };
  if (world.__crosscheckInstalled) return;
  const provider = providerForUrl(location.href);
  if (!provider) return;
  world.__crosscheckInstalled = true;
  const documentId = crypto.randomUUID();
  type Active = {
    id: string;
    status: Progress['status'];
    answer: string;
    error?: string;
    baseline: Set<string>;
    userBaseline: Set<string>;
    prompt: string;
    previous: string;
    changed: number;
    start: number;
    poll: number;
    submitted: boolean;
    url: string;
    canCreate: boolean;
  };
  let active: Active | undefined;
  let peerThread:
    { id: string; session?: ReturnType<typeof createClaudePeer>; failed: boolean } | undefined;
  let peerJob:
    | (Progress & {
        id: string;
        controller: AbortController;
        poll: number;
        start: number;
        url: string;
      })
    | undefined;
  const stopPeer = () => {
    if (peerThread) peerThread.failed = true;
    if (peerJob?.status !== 'pending') return;
    peerJob.status = 'error';
    peerJob.answer = '';
    peerJob.error =
      'Claude 검토를 완료하지 못했습니다. 이미 전송됐을 수 있으므로 자동 재전송하지 않습니다.';
    peerJob.controller.abort();
  };
  window.addEventListener('beforeunload', stopPeer);
  document.addEventListener('input', stopPeer, true);
  let probe:
    | (ClaudeProbeProgress & {
        id: string;
        controller: AbortController;
        url: string;
        poll: number;
        start: number;
      })
    | undefined;
  const stopProbe = () => {
    if (probe?.status !== 'pending') return;
    probe.status = 'error';
    probe.answer = '';
    probe.reason ??= 'interrupted';
    probe.controller.abort();
  };
  window.addEventListener('beforeunload', stopProbe);
  document.addEventListener('input', stopProbe, true);
  let readiness:
    | (GeminiReadinessProgress & {
        id: string;
        controller: AbortController;
        url: string;
        poll: number;
        start: number;
        modeId?: string;
        pickerPending: boolean;
      })
    | undefined;
  const stopReadiness = () => {
    if (readiness?.status !== 'pending') return;
    readiness.status = 'error';
    readiness.result = undefined;
    readiness.modeId = undefined;
    readiness.reason ??= 'interrupted';
    readiness.controller.abort();
    if (!readiness.pickerPending) choosingModel = modelCleanupFailed;
  };
  window.addEventListener('beforeunload', stopReadiness);
  document.addEventListener('input', stopReadiness, true);
  for (const type of ['pointerdown', 'keydown', 'click'])
    document.addEventListener(
      type,
      (event) => {
        if (event.isTrusted) stopReadiness();
      },
      true,
    );
  let choosingModel = false;
  let modelCleanupFailed = false;
  let sdkTrial:
    { id: string; closed: boolean; userChanged: boolean; start: number; poll: number } | undefined;
  type HeaderObservation = {
    id: string;
    observer?: ReturnType<typeof createGeminiHeaderObservation>;
  };
  let headerObservation: HeaderObservation | undefined;
  let sdkRevision = 0;
  const stopSdkTrial = (userChanged = false) => {
    if (!sdkTrial) return;
    sdkTrial.closed = true;
    sdkTrial.userChanged ||= userChanged;
    // This page is quarantined until retirement or a fresh document.
    choosingModel = true;
  };
  const changedSdkPage = () => {
    sdkRevision++;
    stopSdkTrial(true);
  };
  for (const type of ['beforeinput', 'input', 'change', 'paste', 'drop'])
    document.addEventListener(type, changedSdkPage, true);
  for (const type of ['pointerdown', 'keydown', 'click'])
    document.addEventListener(
      type,
      (event) => {
        if (event.isTrusted) changedSdkPage();
      },
      true,
    );
  for (const type of ['pagehide', 'popstate', 'hashchange'])
    window.addEventListener(type, changedSdkPage);
  const failedModelCleanup = (failure: unknown): boolean =>
    failure instanceof Error &&
    (failure.cause === 'model-cleanup' ||
      (failure instanceof AggregateError &&
        failure.errors.some((error) => error instanceof Error && error.cause === 'model-cleanup')));
  const used = new Set<string>();
  const fail = (job: Active, message: string) => {
    job.status = 'error';
    job.error = message;
  };
  chrome.runtime.onMessage.addListener((raw, sender, respond) => {
    // Web pages/content scripts may not dispatch commands, even from this extension.
    if (
      sender.id !== chrome.runtime.id ||
      sender.url?.split('?')[0] !== chrome.runtime.getURL('sidepanel.html')
    )
      return;
    const parsed = Command.safeParse(raw);
    if (!parsed.success) {
      respond({ ok: false, error: '잘못된 명령입니다.' });
      return;
    }
    const command = parsed.data;
    void (async () => {
      if (command.type === 'startGeminiHeaderObservation') {
        if (
          provider !== 'gemini' ||
          window.top !== window ||
          location.href !== 'https://gemini.google.com/app' ||
          headerObservation ||
          sdkTrial ||
          choosingModel ||
          modelCleanupFailed ||
          active?.status === 'pending' ||
          probe?.status === 'pending' ||
          readiness?.status === 'pending' ||
          peerJob?.status === 'pending' ||
          used.has(command.id) ||
          used.size >= 30
        )
          throw new Error('새 Gemini 관찰 페이지가 필요합니다.');
        used.add(command.id);
        const revision = sdkRevision;
        // Reservation is synchronous; this document stays quarantined after settlement.
        const job: HeaderObservation = { id: command.id };
        headerObservation = job;
        job.observer = createGeminiHeaderObservation(
          new AbortController().signal,
          () => revision === sdkRevision,
        );
        return { documentId };
      }
      if (
        command.type === 'pollGeminiHeaderObservation' ||
        command.type === 'cancelGeminiHeaderObservation'
      ) {
        if (
          provider !== 'gemini' ||
          command.documentId !== documentId ||
          headerObservation?.id !== command.id ||
          !headerObservation.observer ||
          window.top !== window ||
          location.href !== 'https://gemini.google.com/app'
        )
          throw new Error('Gemini 관찰 페이지의 연결이 바뀌었습니다.');
        return command.type === 'pollGeminiHeaderObservation'
          ? headerObservation.observer.poll()
          : headerObservation.observer.cancel();
      }
      if (headerObservation && command.type !== 'snapshot')
        throw new Error('이 페이지는 Gemini 버튼 관찰에 예약되어 있습니다.');
      if (command.type === 'checkGeminiSdkTrial' || command.type === 'cancelGeminiSdkTrial') {
        if (
          provider !== 'gemini' ||
          command.documentId !== documentId ||
          sdkTrial?.id !== command.id
        )
          throw new Error('Gemini 시험 페이지의 연결이 바뀌었습니다.');
        if (command.type === 'cancelGeminiSdkTrial') {
          stopSdkTrial();
          return true;
        }
        const samePage = () =>
          window.top === window &&
          /^https:\/\/gemini\.google\.com\/app(?:\/[0-9a-fA-F]{1,16})?$/.test(location.href);
        if (!samePage()) stopSdkTrial(true);
        if (Date.now() - sdkTrial.poll > 15000 || Date.now() - sdkTrial.start > LIMITS.timeoutMs)
          stopSdkTrial();
        sdkTrial.poll = Date.now();
        await settledSnapshot(provider, documentId);
        const snap = snapshot(provider, documentId);
        const unchanged = samePage();
        if (!unchanged || !snap.composer || snap.draft) stopSdkTrial(true);
        return {
          ready: !sdkTrial.closed && unchanged,
          safeToRetire: unchanged && !sdkTrial.userChanged && snap.composer && !snap.draft,
        };
      }
      if (command.type === 'snapshot')
        return {
          ...(await settledSnapshot(provider, documentId, command.waitFor)),
          ...(peerThread ? { threadId: peerThread.id } : {}),
        };
      if (command.type === 'cancelGeminiReadiness') {
        if (readiness?.id === command.id) stopReadiness();
        return true;
      }
      if (command.type === 'pollGeminiReadiness') {
        if (!readiness || readiness.id !== command.id)
          throw new Error('Gemini 준비 확인을 찾지 못했습니다.');
        if (location.href !== readiness.url) stopReadiness();
        readiness.poll = Date.now();
        return {
          status: readiness.status,
          result: readiness.result,
          reason: readiness.reason,
        } satisfies GeminiReadinessProgress;
      }
      if (command.type === 'cancelClaudeProbe') {
        if (probe?.id === command.id) stopProbe();
        return true;
      }
      if (command.type === 'pollClaudeProbe') {
        if (!probe || probe.id !== command.id) throw new Error('연결 시험을 찾지 못했습니다.');
        if (location.href !== probe.url) stopProbe();
        probe.poll = Date.now();
        return {
          status: probe.status,
          answer: probe.answer,
          reason: probe.reason,
        } satisfies ClaudeProbeProgress;
      }
      if (command.type === 'cancel') {
        if (peerJob?.id === command.id) stopPeer();
        if (active?.id === command.id)
          fail(active, '수집을 중단했습니다. 이미 시작된 AI 생성은 해당 탭에서 중지하세요.');
        return true;
      }
      if (command.type === 'poll') {
        if (peerJob?.id === command.id) {
          if (location.href !== peerJob.url) stopPeer();
          peerJob.poll = Date.now();
          return {
            status: peerJob.status,
            answer: peerJob.answer,
            error: peerJob.error,
            url: peerJob.url,
          } satisfies Progress;
        }
        if (!active || active.id !== command.id)
          throw new Error(
            '페이지가 새로고침되어 작업을 찾지 못했습니다. 답변을 수동으로 가져오세요.',
          );
        active.poll = Date.now();
        return {
          status: active.status,
          answer: active.answer,
          error: active.error,
          url: active.url,
        } satisfies Progress;
      }
      if (command.documentId !== documentId)
        throw new Error('연결 후 페이지가 바뀌었습니다. 다시 연결하세요.');
      assertTarget(provider, command.url);
      if (modelCleanupFailed)
        throw new Error(
          '모델 메뉴 정리를 확인하지 못했습니다. 이 페이지를 새로고침한 뒤 다시 연결하세요.',
        );
      if (command.type === 'reserveGeminiSdkTrial') {
        const occupied = () =>
          headerObservation ||
          sdkTrial ||
          choosingModel ||
          active?.status === 'pending' ||
          probe?.status === 'pending' ||
          readiness?.status === 'pending' ||
          peerJob?.status === 'pending';
        if (provider !== 'gemini' || occupied() || used.has(command.id))
          throw new Error('새 Gemini 시험 페이지가 필요합니다.');
        const revision = sdkRevision;
        await settledSnapshot(provider, documentId);
        const snap = snapshot(provider, documentId);
        if (
          revision !== sdkRevision ||
          location.href !== command.url ||
          !snap.composer ||
          snap.busy ||
          snap.draft ||
          snap.truncated ||
          questions(provider).length ||
          replies(provider).length ||
          snap.context.turns.length ||
          snap.lastQuestion ||
          snap.lastAnswer
        )
          throw new Error('Gemini 시험 페이지가 비어 있지 않습니다.');
        // Reserve after the awaited snapshot only if no competing task started.
        if (occupied()) throw new Error('Gemini 시험 페이지를 다른 작업이 사용 중입니다.');
        used.add(command.id);
        sdkTrial = {
          id: command.id,
          closed: false,
          userChanged: false,
          start: Date.now(),
          poll: Date.now(),
        };
        choosingModel = true;
        return true;
      }
      if (command.type === 'finishGeminiReadiness') {
        const job = readiness;
        if (
          provider !== 'gemini' ||
          !job ||
          job.id !== command.id ||
          job.status !== 'pending' ||
          !job.result ||
          !job.modeId ||
          job.pickerPending
        )
          throw new Error('Gemini 준비 확인을 완료하지 못했습니다. 요청은 보내지 않았습니다.');
        const model = job.result.model;
        const modeId = job.modeId;
        job.pickerPending = true;
        job.poll = Date.now();
        job.reason = 'model-confirmation';
        try {
          const confirmed = await geminiReadiness(job.controller.signal);
          if (
            readiness !== job ||
            job.status !== 'pending' ||
            job.controller.signal.aborted ||
            location.href !== job.url ||
            confirmed.model !== model ||
            confirmed.modeId !== modeId
          )
            throw new Error('확인이 중단되었습니다.');
          job.status = 'done';
          job.reason = undefined;
          job.modeId = undefined;
          return true;
        } catch (failure) {
          modelCleanupFailed ||= failedModelCleanup(failure);
          if (readiness === job && job.status === 'pending') {
            const cause = GeminiReadinessReason.safeParse(
              failure instanceof Error ? failure.cause : undefined,
            );
            if (cause.success) job.reason = cause.data;
            stopReadiness();
          }
          throw new Error('Gemini 준비 확인을 완료하지 못했습니다. 요청은 보내지 않았습니다.');
        } finally {
          job.pickerPending = false;
          if (readiness === job && job.status !== 'pending') choosingModel = modelCleanupFailed;
        }
      }
      if (command.type === 'models' || command.type === 'selectModel') {
        if (
          choosingModel ||
          active?.status === 'pending' ||
          probe?.status === 'pending' ||
          readiness?.status === 'pending' ||
          peerJob?.status === 'pending' ||
          isBusy(provider)
        )
          throw new Error('진행 중인 작업이 끝난 후 모델을 변경하세요.');
        choosingModel = true;
        try {
          return await modelMenu(
            provider,
            command.type === 'selectModel' ? command.key : undefined,
          );
        } catch (failure) {
          modelCleanupFailed ||= failedModelCleanup(failure);
          throw failure;
        } finally {
          choosingModel = modelCleanupFailed;
        }
      }
      if (choosingModel) throw new Error('모델 설정이 끝난 뒤 시작하세요.');
      if (used.has(command.id)) throw new Error('이미 시도한 요청입니다. 중복 전송하지 않습니다.');
      if (
        active?.status === 'pending' ||
        probe?.status === 'pending' ||
        readiness?.status === 'pending' ||
        peerJob?.status === 'pending'
      )
        throw new Error('이 탭에서 다른 작업이 진행 중입니다.');
      if (used.size >= 30)
        throw new Error('이 탭의 실행 한도에 도달했습니다. 새로고침 후 다시 연결하세요.');
      used.add(command.id);
      if (command.type === 'sendClaudePeer') {
        if (provider !== 'claude' || !['/', '/new'].includes(location.pathname))
          throw new Error('Claude의 새 검토 페이지가 필요합니다.');
        if (
          peerThread
            ? peerThread.id !== command.threadId || peerThread.failed || !peerThread.session
            : command.stage !== 'collect'
        )
          throw new Error('Claude 검토 연결을 잃었습니다. 새 대화를 만들거나 재전송하지 않습니다.');
        if (!peerThread) peerThread = { id: command.threadId, failed: false };
        const thread = peerThread;
        const job = {
          id: command.id,
          status: 'pending' as const,
          answer: '',
          controller: new AbortController(),
          poll: Date.now(),
          start: Date.now(),
          url: command.url,
        };
        peerJob = job;
        void (async () => {
          const snap = await settledSnapshot(provider, documentId, 'composer');
          if (
            !snap.composer ||
            snap.busy ||
            snap.draft ||
            snap.context.turns.length ||
            snap.lastQuestion ||
            snap.lastAnswer
          )
            throw new Error('Claude 검토 페이지가 비어 있지 않습니다.');
          if (thread.failed || job.controller.signal.aborted || location.href !== job.url)
            throw new Error('검토가 중단되었습니다.');
          if (!thread.session) thread.session = createClaudePeer(await readClaudeProbeLabel());
          const answer = await thread.session.send(
            command.prompt,
            command.attachments,
            command.approved,
            command.stage,
            job.controller.signal,
          );
          if (
            thread.failed ||
            peerJob !== job ||
            peerJob.status !== 'pending' ||
            location.href !== job.url
          )
            throw new Error('검토가 중단되었습니다.');
          peerJob.answer = answer;
          peerJob.status = 'done';
        })().catch(() => {
          if (peerJob === job) stopPeer();
        });
        return true;
      }
      if (peerThread) throw new Error('이 페이지는 Claude 백그라운드 검토에 연결되어 있습니다.');
      if (command.type === 'startGeminiReadiness') {
        if (provider !== 'gemini' || location.href !== 'https://gemini.google.com/app')
          throw new Error('Gemini의 새 준비 확인 페이지가 필요합니다.');
        const job: NonNullable<typeof readiness> = {
          id: command.id,
          status: 'pending',
          reason: 'page',
          controller: new AbortController(),
          url: command.url,
          poll: Date.now(),
          start: Date.now(),
          pickerPending: true,
        };
        readiness = job;
        // Cancellation must keep the picker locked until its asynchronous cleanup finishes.
        choosingModel = true;
        void (async () => {
          const snap = await settledSnapshot(provider, documentId, 'composer');
          if (
            !snap.composer ||
            snap.busy ||
            snap.draft ||
            snap.context.turns.length ||
            snap.lastQuestion ||
            snap.lastAnswer
          )
            throw new Error('준비 확인 페이지가 비어 있지 않습니다.');
          if (location.href !== job.url || job.status !== 'pending')
            throw new Error('확인이 중단되었습니다.');
          job.reason = 'model';
          const result = await geminiReadiness(job.controller.signal);
          if (readiness !== job || location.href !== job.url || job.status !== 'pending')
            throw new Error('확인이 중단되었습니다.');
          job.result = { model: result.model };
          job.modeId = result.modeId;
          job.reason = undefined;
        })()
          .catch((failure) => {
            modelCleanupFailed ||= failedModelCleanup(failure);
            if (readiness === job && job.status === 'pending') {
              const cause = GeminiReadinessReason.safeParse(
                failure instanceof Error ? failure.cause : undefined,
              );
              if (cause.success) job.reason = cause.data;
              stopReadiness();
            }
          })
          .finally(() => {
            job.pickerPending = false;
            if (readiness === job && job.status !== 'pending') choosingModel = modelCleanupFailed;
          });
        return true;
      }
      if (command.type === 'startClaudeProbe') {
        if (provider !== 'claude' || !['/', '/new'].includes(location.pathname))
          throw new Error('Claude의 새 테스트 페이지가 필요합니다.');
        const job = {
          id: command.id,
          status: 'pending' as ClaudeProbeProgress['status'],
          answer: '',
          reason: 'page' as ClaudeProbeReason | undefined,
          controller: new AbortController(),
          url: command.url,
          poll: Date.now(),
          start: Date.now(),
        };
        probe = job;
        void (async () => {
          const snap = await settledSnapshot(provider, documentId, 'composer');
          if (
            !snap.composer ||
            snap.busy ||
            snap.draft ||
            snap.context.turns.length ||
            snap.lastQuestion ||
            snap.lastAnswer
          )
            throw new Error('테스트 페이지가 비어 있지 않습니다.');
          job.reason = 'model';
          const selectedModel = await readClaudeProbeLabel();
          if (location.href !== job.url || job.status !== 'pending')
            throw new Error('테스트를 중단했습니다.');
          job.reason = undefined;
          const answer = await claudeProbe(selectedModel, job.controller.signal, command.kind);
          if (location.href !== job.url || job.status !== 'pending')
            throw new Error('테스트를 중단했습니다.');
          job.answer = answer;
          job.status = 'done';
        })().catch((error) => {
          if (probe === job) {
            const cause = ClaudeProbeReason.safeParse(
              error instanceof Error ? error.cause : undefined,
            );
            if (cause.success) job.reason = cause.data;
            stopProbe();
          }
        });
        return true;
      }
      const job: Active = {
        id: command.id,
        status: 'pending',
        answer: '',
        baseline: new Set(replies(provider).map(messageKey)),
        userBaseline: new Set(questions(provider).map(messageKey)),
        prompt: command.prompt,
        previous: '',
        changed: Date.now(),
        start: Date.now(),
        poll: Date.now(),
        submitted: false,
        url: command.url,
        canCreate: ['/', '/new', '/app'].includes(new URL(command.url).pathname),
      };
      active = job;
      void submit(
        provider,
        command.prompt,
        () => active === job && job.status === 'pending' && location.href === command.url,
        command.attachments,
      )
        .then(() => {
          job.submitted = true;
        })
        .catch((error) => fail(job, error instanceof Error ? error.message : '전송 실패'));
      return true;
    })()
      .then((data) => respond({ ok: true, data }))
      .catch((error) =>
        respond({ ok: false, error: error instanceof Error ? error.message : '작업 실패' }),
      );
    return true;
  });
  setInterval(() => {
    if (
      sdkTrial &&
      !sdkTrial.closed &&
      (Date.now() - sdkTrial.poll > 15000 || Date.now() - sdkTrial.start > LIMITS.timeoutMs)
    )
      stopSdkTrial();
    if (
      readiness?.status === 'pending' &&
      (location.href !== readiness.url ||
        Date.now() - readiness.poll > 15000 ||
        Date.now() - readiness.start > LIMITS.timeoutMs)
    )
      stopReadiness();
    if (
      peerJob?.status === 'pending' &&
      (location.href !== peerJob.url ||
        Date.now() - peerJob.poll > 15000 ||
        Date.now() - peerJob.start > LIMITS.timeoutMs)
    )
      stopPeer();
    if (
      probe?.status === 'pending' &&
      (location.href !== probe.url ||
        Date.now() - probe.poll > 15000 ||
        Date.now() - probe.start > LIMITS.timeoutMs)
    )
      stopProbe();
    const job = active;
    if (!job || job.status !== 'pending') return;
    if (Date.now() - job.poll > 15000) {
      fail(job, '패널 연결이 끊겨 수집을 중단했습니다. 자동 재전송하지 않습니다.');
      return;
    }
    if (Date.now() - job.start > LIMITS.timeoutMs) {
      fail(
        job,
        '3분 동안 완료를 확인하지 못했습니다. 한도·로그인·화면 변경을 확인하고 답변을 수동 입력하세요.',
      );
      return;
    }
    if (!job.submitted) return;
    if (location.href !== job.url) {
      const path = location.pathname;
      const created =
        job.canCreate &&
        providerForUrl(location.href) === provider &&
        (provider === 'chatgpt'
          ? /^\/c\/[^/]+$/.test(path)
          : provider === 'claude'
            ? /^\/chat\/[^/]+$/.test(path)
            : /^\/app\/[^/]+$/.test(path));
      if (!created) {
        fail(job, '대화가 변경되어 수집을 멈췄습니다.');
        return;
      }
      job.url = location.href;
      job.canCreate = false;
    }
    const all = replies(provider).filter((el) => !job.baseline.has(messageKey(el)));
    if (!all.length) return;
    const userMessages = questions(provider).filter((el) => !job.userBaseline.has(messageKey(el)));
    if (
      all.length !== 1 ||
      userMessages.length !== 1 ||
      textOf(userMessages.at(-1)).replace(/\s+/g, ' ') !== job.prompt.trim().replace(/\s+/g, ' ')
    ) {
      fail(
        job,
        '대화 내용이 바뀌어 답변을 안전하게 연결할 수 없습니다. 답변을 수동으로 가져오세요.',
      );
      return;
    }
    const latest = all.at(-1)!;
    const text = textOf(latest);
    if (text.length > LIMITS.answer) {
      fail(job, '답변이 14,000자를 초과했습니다. 필요한 부분을 수동으로 가져오세요.');
      return;
    }
    if (text !== job.previous) {
      job.previous = text;
      job.changed = Date.now();
    }
    if (
      text &&
      !isBusy(provider) &&
      finishedMarker(provider, latest) &&
      Date.now() - job.changed >= 2500
    ) {
      job.answer = text;
      job.status = 'done';
    }
  }, 600);
});
