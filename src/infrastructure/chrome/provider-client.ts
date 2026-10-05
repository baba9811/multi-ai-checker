import { z } from 'zod';
import { Binding, providerForUrl, providers, type ProviderId } from '../../domains/providers/model';
import { LIMITS, type Job } from '../../domains/crosscheck/model';
import { ModelCatalog, Progress, Snapshot } from '../../application/provider-protocol';
import type { Collected, Conversation } from '../../application/ports';
import type { AttachmentPayload } from '../../domains/attachments/model';

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
async function readyConnectionTab(provider: ProviderId, tabId: number) {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    let tab: chrome.tabs.Tab;
    try {
      tab = await chrome.tabs.get(tabId);
    } catch {
      throw new Error('연결 탭이 닫혔습니다. 탭 열기 후 다시 연결해주세요.');
    }
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
async function attach(provider: ProviderId, tabId: number, conversation = false): Promise<Binding> {
  await chrome.scripting.executeScript({
    target: { tabId, frameIds: [0] },
    files: ['bridge.js'],
    world: 'ISOLATED',
  });
  const snap = Snapshot.parse(
    await rpc(tabId, { type: 'snapshot', waitFor: conversation ? 'conversation' : 'composer' }),
  );
  if (snap.provider !== provider) throw new Error('연결한 사이트가 바뀌었습니다.');
  return { provider, tabId, documentId: snap.documentId, url: snap.url };
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
export async function preparePeer(provider: ProviderId, saved?: Binding): Promise<Binding> {
  if (saved) {
    try {
      // Resume preserves the exact document and conversation; reconnect is an explicit action.
      if (saved.provider === provider) {
        await reveal(saved);
        await inspect(saved);
        return saved;
      }
    } catch {
      /* Missing or inaccessible saved tabs require an explicit reconnect. */
    }
    throw new Error(
      `${providers[provider].name} 연결 탭이 바뀌었습니다. 연결 화면에서 다시 연결하세요.`,
    );
  }
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    url: `${providers[provider].origin}/*`,
  });
  const blank = tabs.find((tab) => tab.url === providers[provider].home);
  const tab = blank ?? (await chrome.tabs.create({ url: providers[provider].home, active: true }));
  if (!tab.id) throw new Error('AI 탭을 열지 못했습니다.');
  await reveal({ tabId: tab.id });
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    const state = await chrome.tabs.get(tab.id);
    if (state.status === 'complete') return attach(provider, tab.id);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`${providers[provider].name} 탭 로딩을 기다리고 있습니다. 사이트를 확인하세요.`);
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
): Promise<Collected> {
  if (signal.aborted) throw new Error('중단됨');
  const snap = await inspect(target);
  if (snap.url !== target.url)
    throw new Error('연결한 대화가 변경되었습니다. 자동 전송을 멈췄습니다.');
  if (signal.aborted) throw new Error('중단됨');
  await rpc(target.tabId, {
    type: 'send',
    id: job.id,
    documentId: target.documentId,
    url: target.url,
    prompt: job.prompt,
    attachments,
  });
  const end = Date.now() + LIMITS.timeoutMs + 5000;
  while (Date.now() < end) {
    if (signal.aborted) {
      await rpc(target.tabId, { type: 'cancel', id: job.id }).catch(() => {});
      throw new Error('수집을 중단했습니다. 이미 전송된 요청은 탭에서 확인하세요.');
    }
    const progress = Progress.parse(await rpc(target.tabId, { type: 'poll', id: job.id }));
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
}
