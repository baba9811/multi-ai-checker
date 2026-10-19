import { z } from 'zod';
import { Binding, providerForUrl, providers, type ProviderId } from '../../domains/providers/model';
import { LIMITS, type Job } from '../../domains/crosscheck/model';
import { ModelCatalog, Progress, Snapshot } from '../../application/provider-protocol';
import type { Collected, Conversation } from '../../application/ports';
import type { Attachment, AttachmentPayload } from '../../domains/attachments/model';

export async function rpc(tabId: number, command: unknown): Promise<unknown> {
  const response = z
    .object({ ok: z.boolean(), data: z.unknown().optional(), error: z.string().optional() })
    .parse(await chrome.tabs.sendMessage(tabId, command, { frameId: 0 }));
  if (!response.ok) throw new Error(response.error ?? '탭 작업에 실패했습니다.');
  return response.data;
}
export async function reveal(binding: Pick<Binding, 'tabId'>): Promise<void> {
  const tab = await chrome.tabs.get(binding.tabId);
  await chrome.windows.update(tab.windowId, { focused: true });
  await chrome.tabs.update(binding.tabId, { active: true });
}
let automaticWindowId: number | undefined;
const automaticPeers = new Map<number, { windowId: number; binding: Binding }>();

async function checkAutomaticWindow(windowId: number, signal?: AbortSignal) {
  signal?.throwIfAborted();
  const window = await chrome.windows.get(windowId, { populate: true });
  signal?.throwIfAborted();
  if (window.id !== automaticWindowId || window.type !== 'normal' || window.focused)
    throw new Error('검토 창이 바뀌었거나 사용 중입니다. 자동으로 창을 전환하지 않습니다.');
  return window;
}

export async function prepareAutomaticTarget(
  binding: Binding,
  signal?: AbortSignal,
): Promise<void> {
  signal?.throwIfAborted();
  const owned = automaticPeers.get(binding.tabId);
  if (!owned) return;
  if (
    binding.provider !== owned.binding.provider ||
    binding.documentId !== owned.binding.documentId ||
    binding.threadId !== owned.binding.threadId
  )
    throw new Error('검토 탭의 연결이 바뀌었습니다. 다시 연결해주세요.');
  await inspect(binding);
  signal?.throwIfAborted();
  const window = await checkAutomaticWindow(owned.windowId, signal);
  const matches = window.tabs?.filter((tab) => tab.id === binding.tabId) ?? [];
  if (
    matches.length !== 1 ||
    matches[0]!.windowId !== owned.windowId ||
    matches[0]!.url !== binding.url
  )
    throw new Error('검토 탭이 이동되었거나 대화가 바뀌었습니다. 자동으로 전환하지 않습니다.');
  await chrome.tabs.update(binding.tabId, { active: true });
  signal?.throwIfAborted();
}
export async function connect(provider: ProviderId): Promise<Binding> {
  // Called directly in a click handler to preserve the user gesture.
  const allowed = await chrome.permissions.request({
    origins: [`${providers[provider].origin}/*`],
  });
  if (!allowed) throw new Error('이 사이트의 연결 권한이 필요합니다.');
  const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
  let tab = active;
  if (!tab?.id || providerForUrl(tab.url ?? '') !== provider) {
    const candidates = await chrome.tabs.query({
      url: `${providers[provider].origin}/*`,
    });
    const blank = candidates.filter((candidate) => candidate.url === providers[provider].home);
    tab =
      (candidates.length === 1 ? candidates[0] : blank.length === 1 ? blank[0] : undefined) ??
      (await chrome.tabs.create({ url: providers[provider].home, active: true }));
  }
  if (!tab?.id) throw new Error('AI 탭을 열지 못했습니다. 다시 연결해주세요.');
  await reveal({ tabId: tab.id });
  await readyConnectionTab(provider, tab.id);
  return attach(provider, tab.id);
}
async function readyConnectionTab(provider: ProviderId, tabId: number, signal?: AbortSignal) {
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    signal?.throwIfAborted();
    let tab: chrome.tabs.Tab;
    try {
      tab = await chrome.tabs.get(tabId);
    } catch {
      throw new Error('연결 탭이 닫혔습니다. 탭 열기 후 다시 연결해주세요.');
    }
    signal?.throwIfAborted();
    if (tab.status === 'complete') {
      if (providerForUrl(tab.url ?? '') !== provider)
        throw new Error('사이트에서 로그인 또는 페이지 전환을 완료한 뒤 다시 확인해주세요.');
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error('페이지가 아직 로딩 중입니다. 탭을 확인한 뒤 다시 확인해주세요.');
}
/** Explicit login-complete/reconnect action only; automatic checks use inspect. */
export async function refreshConnection(binding: Binding): Promise<Binding> {
  if (
    !(await chrome.permissions.contains({ origins: [`${providers[binding.provider].origin}/*`] }))
  )
    throw new Error('사이트 권한이 해제되었습니다. 연결 버튼으로 다시 허용해주세요.');
  await readyConnectionTab(binding.provider, binding.tabId);
  return attach(binding.provider, binding.tabId);
}
export async function prepareClaudeProbe(signal: AbortSignal): Promise<Binding> {
  signal.throwIfAborted();
  const tab = await chrome.tabs.create({ url: providers.claude.home, active: false });
  if (!tab.id) throw new Error('테스트 탭을 열지 못했습니다.');
  await readyConnectionTab('claude', tab.id, signal);
  signal.throwIfAborted();
  return attach('claude', tab.id);
}
export async function prepareGeminiReadiness(
  signal: AbortSignal,
  allocated?: (tabId: number) => void,
): Promise<Binding> {
  signal.throwIfAborted();
  const tab = await chrome.tabs.create({ url: providers.gemini.home, active: false });
  if (!tab.id) throw new Error('Gemini 준비 확인 탭을 열지 못했습니다.');
  allocated?.(tab.id);
  await readyConnectionTab('gemini', tab.id, signal);
  signal.throwIfAborted();
  return attach('gemini', tab.id);
}
/** Allocates and injects only: never attaches or exports a conversation snapshot. */
export async function prepareGeminiHeaderObservation(
  signal: AbortSignal,
  allocated: (tabId: number) => void,
  loaded: () => void,
): Promise<number> {
  signal.throwIfAborted();
  const tab = await chrome.tabs.create({ url: providers.gemini.home, active: false });
  if (!tab.id) throw new Error('Gemini 관찰 탭을 열지 못했습니다.');
  allocated(tab.id);
  signal.throwIfAborted();
  await readyConnectionTab('gemini', tab.id, signal);
  signal.throwIfAborted();
  loaded();
  const current = await chrome.tabs.get(tab.id);
  signal.throwIfAborted();
  if (current.active || current.url !== providers.gemini.home)
    throw new Error('Gemini 관찰 페이지가 바뀌었습니다.');
  await chrome.scripting.executeScript({
    target: { tabId: tab.id, frameIds: [0] },
    files: ['bridge.js'],
    world: 'ISOLATED',
  });
  signal.throwIfAborted();
  return tab.id;
}
async function attach(
  provider: ProviderId,
  tabId: number,
  conversation = false,
  signal?: AbortSignal,
): Promise<Binding> {
  signal?.throwIfAborted();
  await chrome.scripting.executeScript({
    target: { tabId, frameIds: [0] },
    files: ['bridge.js'],
    world: 'ISOLATED',
  });
  signal?.throwIfAborted();
  const snap = Snapshot.parse(
    await rpc(tabId, { type: 'snapshot', waitFor: conversation ? 'conversation' : 'composer' }),
  );
  signal?.throwIfAborted();
  if (snap.provider !== provider) throw new Error('연결한 사이트가 바뀌었습니다.');
  return {
    provider,
    tabId,
    documentId: snap.documentId,
    url: snap.url,
    ...(snap.threadId ? { threadId: snap.threadId } : {}),
  };
}
export async function currentConversation(
  requestAccess?: ProviderId[],
): Promise<Conversation | undefined> {
  // Permission prompt must stay directly in the start button's user gesture.
  if (
    requestAccess &&
    !(await chrome.permissions.request({
      origins: requestAccess.map((id) => `${providers[id].origin}/*`),
    }))
  )
    throw new Error('선택한 AI 사이트에 연결 권한이 필요합니다.');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const provider = providerForUrl(tab?.url ?? '');
  if (!tab?.id || !provider) return;
  if (!(await chrome.permissions.contains({ origins: [`${providers[provider].origin}/*`] })))
    return;
  const binding = await attach(provider, tab.id, true);
  return { binding, snapshot: await inspect(binding) };
}
export async function preparePeer(
  provider: ProviderId,
  saved?: Binding,
  threadId?: string,
  signal?: AbortSignal,
  background = false,
): Promise<Binding> {
  if (threadId) {
    signal?.throwIfAborted();
    if (provider !== 'claude') throw new Error('Claude 검토 연결이 필요합니다.');
    if (saved) {
      if (saved.provider !== 'claude' || saved.threadId !== threadId)
        throw new Error('Claude 검토 연결이 일치하지 않습니다.');
      await inspect(saved);
      return saved;
    }
    const tab = await chrome.tabs.create({ url: providers.claude.home, active: false });
    if (!tab.id) throw new Error('Claude 검토 탭을 열지 못했습니다.');
    await readyConnectionTab('claude', tab.id, signal);
    signal?.throwIfAborted();
    return Binding.parse({ ...(await attach('claude', tab.id)), threadId });
  }
  signal?.throwIfAborted();
  if (saved?.threadId) saved = undefined;
  if (saved) {
    try {
      // Resume preserves the exact document and conversation; reconnect is an explicit action.
      if (saved.provider === provider) {
        if (!background) {
          await reveal(saved);
          signal?.throwIfAborted();
        }
        await inspect(saved);
        signal?.throwIfAborted();
        return saved;
      }
    } catch {
      /* Missing or inaccessible saved tabs require an explicit reconnect. */
    }
    throw new Error(
      `${providers[provider].name} 연결 탭이 바뀌었습니다. 연결 화면에서 다시 연결하세요.`,
    );
  }
  if (!background) {
    // Unbound Claude homes may own page-local background sessions from earlier runs.
    const tabs =
      provider === 'claude'
        ? []
        : await chrome.tabs.query({
            currentWindow: true,
            url: `${providers[provider].origin}/*`,
          });
    signal?.throwIfAborted();
    const blank = tabs.find((tab) => tab.url === providers[provider].home);
    const tab =
      blank ?? (await chrome.tabs.create({ url: providers[provider].home, active: true }));
    signal?.throwIfAborted();
    if (!tab.id) throw new Error('AI 탭을 열지 못했습니다.');
    await reveal({ tabId: tab.id });
    signal?.throwIfAborted();
    await readyConnectionTab(provider, tab.id, signal);
    return attach(provider, tab.id, false, signal);
  }
  let tab: chrome.tabs.Tab;
  if (automaticWindowId === undefined) {
    const window = await chrome.windows.create({
      focused: false,
      type: 'normal',
      url: providers[provider].home,
    });
    signal?.throwIfAborted();
    if (
      window?.id === undefined ||
      window.type !== 'normal' ||
      window.focused ||
      window.tabs?.length !== 1
    )
      throw new Error('검토 창을 안전하게 열지 못했습니다.');
    automaticWindowId = window.id;
    tab = window.tabs[0]!;
  } else {
    await checkAutomaticWindow(automaticWindowId, signal);
    tab = await chrome.tabs.create({
      windowId: automaticWindowId,
      active: true,
      url: providers[provider].home,
    });
    signal?.throwIfAborted();
  }
  if (!tab.id) throw new Error('AI 탭을 열지 못했습니다.');
  await readyConnectionTab(provider, tab.id, signal);
  signal?.throwIfAborted();
  const binding = await attach(provider, tab.id, false, signal);
  await checkAutomaticWindow(automaticWindowId, signal);
  const current = await chrome.tabs.get(tab.id);
  signal?.throwIfAborted();
  if (current.windowId !== automaticWindowId || current.url !== binding.url)
    throw new Error('검토 탭이 이동되었거나 대화가 바뀌었습니다.');
  automaticPeers.set(tab.id, { windowId: automaticWindowId, binding });
  return binding;
}
export async function models(binding: Binding, key?: string): Promise<ModelCatalog> {
  const snap = await inspect(binding);
  if (snap.url !== binding.url) throw new Error('연결한 대화가 바뀌었습니다. 다시 연결하세요.');
  return ModelCatalog.parse(
    await rpc(binding.tabId, {
      type: key === undefined ? 'models' : 'selectModel',
      documentId: binding.documentId,
      url: binding.url,
      ...(key === undefined ? {} : { key }),
    }),
  );
}
export async function inspect(binding: Binding) {
  if (
    !(await chrome.permissions.contains({ origins: [`${providers[binding.provider].origin}/*`] }))
  )
    throw new Error('사이트 연결 권한이 해제되었습니다. 다시 연결하거나 수동으로 진행하세요.');
  const tab = await chrome.tabs.get(binding.tabId);
  if (providerForUrl(tab.url ?? '') !== binding.provider)
    throw new Error('연결한 탭이 닫혔거나 다른 사이트로 이동했습니다.');
  const snap = Snapshot.parse(await rpc(binding.tabId, { type: 'snapshot', waitFor: 'composer' }));
  if (snap.provider !== binding.provider || snap.documentId !== binding.documentId)
    throw new Error('페이지가 새로고침되었습니다. 다시 연결하세요.');
  if (snap.threadId !== undefined && snap.threadId !== binding.threadId)
    throw new Error('Claude 검토 연결이 바뀌었습니다. 다시 연결해주세요.');
  if (snap.url !== binding.url)
    throw new Error(
      '연결한 대화가 바뀌었습니다. 탭을 확인한 뒤 로그인 완료 · 다시 확인 또는 다시 연결을 눌러주세요.',
    );
  return snap;
}
export async function sendAndCollect(
  job: Job,
  target: Binding,
  signal: AbortSignal,
  attachments: AttachmentPayload[] = [],
  approved: Attachment[] = [],
): Promise<Collected> {
  if (
    target.threadId &&
    (target.provider !== 'claude' || job.provider !== 'claude' || job.stage === 'synthesize')
  )
    throw new Error('Claude 검토 대상이 일치하지 않습니다.');
  if (signal.aborted) throw new Error('중단됨');
  const snap = await inspect(target);
  if (snap.url !== target.url)
    throw new Error('연결한 대화가 변경되었습니다. 자동 전송을 멈췄습니다.');
  if (signal.aborted) throw new Error('중단됨');
  const deadline = Date.now() + LIMITS.timeoutMs;
  let port: chrome.runtime.Port | undefined;
  let disconnected = false;
  let rejectReady: (error: Error) => void = () => {};
  const close = () => {
    disconnected = true;
    rejectReady(new Error('패널 연결이 끊겨 수집을 중단했습니다. 자동 재전송하지 않습니다.'));
    port?.disconnect();
  };
  try {
    if (!target.threadId) {
      port = chrome.tabs.connect(target.tabId, {
        frameId: 0,
        name: `crosscheck-collector:${job.id}`,
      });
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        await new Promise<void>((resolve, reject) => {
          rejectReady = reject;
          port!.onMessage.addListener((value) => {
            if (value?.type === 'collector-ready' && value.id === job.id) resolve();
          });
          port!.onDisconnect.addListener(() => {
            void chrome.runtime.lastError;
            disconnected = true;
            reject(new Error('패널 연결이 끊겨 수집을 중단했습니다. 자동 재전송하지 않습니다.'));
          });
          timer = setTimeout(
            () => reject(new Error('패널 연결을 확인하지 못했습니다. 자동 전송하지 않습니다.')),
            Math.max(0, deadline - Date.now()),
          );
          signal.addEventListener('abort', close, { once: true });
          if (signal.aborted) close();
        });
      } finally {
        clearTimeout(timer);
      }
    }
    signal.throwIfAborted();
    if (disconnected) throw new Error('패널 연결이 끊겨 자동 전송하지 않습니다.');
    if (Date.now() >= deadline)
      throw new Error('패널 연결을 확인하지 못했습니다. 자동 전송하지 않습니다.');
    await rpc(target.tabId, {
      type: target.threadId ? 'sendClaudePeer' : 'send',
      id: job.id,
      documentId: target.documentId,
      url: target.url,
      prompt: job.prompt,
      attachments,
      ...(target.threadId ? { threadId: target.threadId, stage: job.stage, approved } : {}),
    });
    while (Date.now() < deadline + 5000) {
      if (signal.aborted) {
        await rpc(target.tabId, { type: 'cancel', id: job.id }).catch(() => {});
        throw new Error('수집을 중단했습니다. 이미 전송된 요청은 탭에서 확인하세요.');
      }
      if (disconnected)
        throw new Error('패널 연결이 끊겨 수집을 중단했습니다. 자동 재전송하지 않습니다.');
      const progress = Progress.parse(await rpc(target.tabId, { type: 'poll', id: job.id }));
      if (signal.aborted) {
        await rpc(target.tabId, { type: 'cancel', id: job.id }).catch(() => {});
        throw new Error('수집을 중단했습니다. 이미 전송된 요청은 탭에서 확인하세요.');
      }
      if (disconnected)
        throw new Error('패널 연결이 끊겨 수집을 중단했습니다. 자동 재전송하지 않습니다.');
      if (progress.status === 'done') {
        if (!progress.url || providerForUrl(progress.url) !== target.provider)
          throw new Error('응답의 대화 위치를 확인하지 못했습니다.');
        return { answer: progress.answer, binding: { ...target, url: progress.url } };
      }
      if (progress.status === 'error')
        throw new Error(progress.error ?? '완료를 확인하지 못했습니다.');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    await rpc(target.tabId, { type: 'cancel', id: job.id }).catch(() => {});
    throw new Error('응답 시간이 초과되었습니다. 자동으로 재전송하지 않습니다.');
  } finally {
    signal.removeEventListener('abort', close);
    port?.disconnect();
  }
}
