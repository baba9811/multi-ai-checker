import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Snapshot } from '../../../src/application/provider-protocol';
import { providerForUrl } from '../../../src/domains/providers/model';
let client: typeof import('../../../src/infrastructure/chrome/provider-client');

const home = 'https://chatgpt.com/';
const tab = (id: number, url: string) => ({ id, url, windowId: 4, status: 'complete' });
let active: ReturnType<typeof tab>[];
let candidates: ReturnType<typeof tab>[];
let allocated: ReturnType<typeof tab>[];
const getTab = async (id: number) =>
  [...allocated, ...active, ...candidates].find((t) => t.id === id) ?? tab(id, home);
async function getReviewWindow(
  _windowId: number,
  options?: { populate?: boolean },
): Promise<{ id: number; focused: boolean; type: string; tabs?: ReturnType<typeof tab>[] }> {
  const tabs = options?.populate
    ? await Promise.all(allocated.map((created) => browser.tabs.get(created.id)))
    : undefined;
  return {
    id: 12,
    focused: false,
    type: 'normal',
    tabs: tabs?.filter((tab) => tab.windowId === 12),
  };
}
const browser = {
  permissions: { request: vi.fn(async () => true), contains: vi.fn(async () => true) },
  tabs: {
    query: vi.fn(async (query: { active?: boolean }) => (query.active ? active : candidates)),
    create: vi.fn(async (options: chrome.tabs.CreateProperties) => ({
      ...tab(9, options.url ?? home),
      windowId: options.windowId ?? 4,
    })),
    get: vi.fn(getTab),
    update: vi.fn(async (_id: number, _options: chrome.tabs.UpdateProperties) => undefined),
    sendMessage: vi.fn(async (id: number) => ({
      ok: true,
      data: {
        provider: providerForUrl((await browser.tabs.get(id)).url),
        documentId: 'doc',
        url: (await browser.tabs.get(id)).url,
        composer: false,
        busy: false,
        draft: false,
        truncated: false,
        lastQuestion: '',
        lastAnswer: '',
        context: { scope: 'rendered' as const, turns: [] },
      },
    })),
  },
  windows: {
    create: vi.fn(async (_options?: chrome.windows.CreateData) => ({
      id: 12,
      focused: false,
      type: 'normal',
      tabs: [{ ...tab(9, home), windowId: 12 }],
    })),
    get: vi.fn(getReviewWindow),
    update: vi.fn(async () => undefined),
  },
  scripting: { executeScript: vi.fn(async () => []) },
};
const getSnapshot = browser.tabs.sendMessage.getMockImplementation()!;
beforeEach(async () => {
  vi.resetModules();
  client = await import('../../../src/infrastructure/chrome/provider-client');
  active = [];
  candidates = [];
  allocated = [];
  vi.clearAllMocks();
  browser.tabs.get.mockReset().mockImplementation(getTab);
  browser.tabs.sendMessage.mockReset().mockImplementation(getSnapshot);
  browser.tabs.create.mockReset().mockImplementation(async (options) => {
    const created = { ...tab(9, options.url ?? home), windowId: options.windowId ?? 4 };
    allocated.push(created);
    return created;
  });
  browser.windows.create.mockReset().mockImplementation(async (options) => {
    const created = {
      ...tab(9, typeof options?.url === 'string' ? options.url : home),
      windowId: 12,
    };
    allocated.push(created);
    return { id: 12, focused: false, type: 'normal', tabs: [created] };
  });
  browser.windows.get.mockReset().mockImplementation(getReviewWindow);
  vi.stubGlobal('chrome', browser);
});

it('allocates ordinary peers in one unfocused review window without touching user tabs', async () => {
  candidates = [tab(2, home)];
  browser.tabs.get.mockImplementation(async (id) => ({ ...tab(id, home), windowId: 12 }));
  const first = await client.preparePeer('chatgpt', undefined, undefined, undefined, true);
  expect(browser.windows.create).toHaveBeenCalledExactlyOnceWith({
    focused: false,
    type: 'normal',
    url: home,
  });
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(first.tabId).toBe(9);
  await client.preparePeer('chatgpt', undefined, undefined, undefined, true);
  expect(browser.windows.create).toHaveBeenCalledTimes(1);
  expect(browser.tabs.create).toHaveBeenCalledExactlyOnceWith({
    windowId: 12,
    active: true,
    url: home,
  });
  expect(browser.tabs.query).not.toHaveBeenCalled();
  expect(browser.windows.update).not.toHaveBeenCalled();
  expect(browser.tabs.update.mock.calls.every(([id]) => id === 9)).toBe(true);
});

async function ownedPeer() {
  browser.tabs.get.mockImplementation(async (id) => ({ ...tab(id, home), windowId: 12 }));
  const binding = await client.preparePeer('chatgpt', undefined, undefined, undefined, true);
  vi.clearAllMocks();
  return binding;
}

it('does not activate or relocate an unowned main or saved target', async () => {
  expect(typeof client.prepareAutomaticTarget).toBe('function');
  await client.prepareAutomaticTarget({
    provider: 'chatgpt',
    tabId: 2,
    documentId: 'doc',
    url: home,
  });
  expect(browser.tabs.update).not.toHaveBeenCalled();
  expect(browser.windows.update).not.toHaveBeenCalled();
  expect(browser.windows.get).not.toHaveBeenCalled();
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(browser.windows.create).not.toHaveBeenCalled();
});

it('activates only its owned peer in the same unfocused window after legitimate route creation', async () => {
  const binding = await ownedPeer();
  const url = 'https://chatgpt.com/c/owned-peer';
  browser.tabs.get.mockImplementation(async (id) => ({ ...tab(id, url), windowId: 12 }));
  expect(typeof client.prepareAutomaticTarget).toBe('function');
  await client.prepareAutomaticTarget({ ...binding, url });
  expect(browser.windows.get).toHaveBeenCalledWith(12, { populate: true });
  expect(browser.tabs.update).toHaveBeenCalledExactlyOnceWith(binding.tabId, { active: true });
  expect(browser.windows.update).not.toHaveBeenCalled();
  expect(browser.tabs.create).not.toHaveBeenCalled();
});

it.each(['closed', 'moved', 'focused', 'reloaded', 'changed-binding'])(
  'does not activate or replace a %s owned target',
  async (state) => {
    const binding = await ownedPeer();
    if (state === 'closed') browser.tabs.get.mockRejectedValueOnce(new Error('No tab'));
    if (state === 'moved')
      browser.tabs.get.mockImplementation(async (id) => ({ ...tab(id, home), windowId: 4 }));
    if (state === 'focused')
      browser.windows.get.mockResolvedValueOnce({ id: 12, focused: true, type: 'normal' });
    if (state === 'reloaded') {
      const result = await getSnapshot(binding.tabId);
      browser.tabs.sendMessage.mockResolvedValueOnce({
        ...result,
        data: { ...result.data, documentId: 'replacement-document' },
      });
    }
    expect(typeof client.prepareAutomaticTarget).toBe('function');
    await expect(
      client.prepareAutomaticTarget(
        state === 'changed-binding' ? { ...binding, documentId: 'replacement-document' } : binding,
      ),
    ).rejects.toThrow();
    expect(browser.tabs.update).not.toHaveBeenCalled();
    expect(browser.windows.update).not.toHaveBeenCalled();
    expect(browser.tabs.create).not.toHaveBeenCalled();
    expect(browser.windows.create).not.toHaveBeenCalled();
  },
);

it('rechecks window ownership after inspection before activation', async () => {
  const binding = await ownedPeer();
  const inspect = browser.tabs.sendMessage.getMockImplementation()!;
  browser.tabs.sendMessage.mockImplementationOnce(async (id) => {
    const result = await inspect(id);
    browser.tabs.get.mockImplementation(async (tabId) => ({ ...tab(tabId, home), windowId: 4 }));
    return result;
  });
  expect(typeof client.prepareAutomaticTarget).toBe('function');
  await expect(client.prepareAutomaticTarget(binding)).rejects.toThrow();
  expect(browser.tabs.update).not.toHaveBeenCalled();
});

it('does not activate an owned tab moved while checking its window', async () => {
  const binding = await ownedPeer();
  browser.windows.get.mockImplementationOnce(async () => {
    browser.tabs.get.mockImplementation(async (id) => ({ ...tab(id, home), windowId: 4 }));
    return {
      id: 12,
      focused: false,
      type: 'normal',
      tabs: [await browser.tabs.get(binding.tabId)],
    };
  });
  await expect(client.prepareAutomaticTarget(binding)).rejects.toThrow();
  expect(browser.tabs.update).not.toHaveBeenCalled();
});

it('does not activate after the user focuses the review window during the last tab read', async () => {
  const binding = await ownedPeer();
  let focused = false;
  const read = browser.tabs.get.getMockImplementation()!;
  browser.windows.get.mockImplementation(async (_windowId, options) => {
    const tabs = options?.populate ? [await browser.tabs.get(binding.tabId)] : undefined;
    return { id: 12, focused, type: 'normal', tabs };
  });
  const inspect = browser.tabs.sendMessage.getMockImplementation()!;
  browser.tabs.sendMessage.mockImplementationOnce(async (id) => {
    const result = await inspect(id);
    browser.tabs.get.mockImplementationOnce(async (tabId) => {
      focused = true;
      return read(tabId);
    });
    return result;
  });
  await expect(client.prepareAutomaticTarget(binding)).rejects.toThrow();
  expect(browser.tabs.update).not.toHaveBeenCalled();
});

it('preserves an exact saved user binding without selecting its tab or creating a window', async () => {
  const saved = { provider: 'chatgpt' as const, tabId: 2, documentId: 'doc', url: home };
  expect(await client.preparePeer('chatgpt', saved, undefined, undefined, true)).toBe(saved);
  expect(browser.tabs.update).not.toHaveBeenCalled();
  expect(browser.windows.update).not.toHaveBeenCalled();
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(browser.windows.create).not.toHaveBeenCalled();
});

it.each([false, true])(
  'stops allocation and activation when already cancelled (background=%s)',
  async (background) => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      client.preparePeer('chatgpt', undefined, undefined, controller.signal, background),
    ).rejects.toThrow();
    expect(browser.windows.create).not.toHaveBeenCalled();
    expect(browser.tabs.create).not.toHaveBeenCalled();
    expect(typeof client.prepareAutomaticTarget).toBe('function');
    await expect(
      client.prepareAutomaticTarget(
        { provider: 'chatgpt', tabId: 2, documentId: 'doc', url: home },
        controller.signal,
      ),
    ).rejects.toThrow();
    expect(browser.tabs.update).not.toHaveBeenCalled();
  },
);

it.each([false, true])(
  'does not inject after cancellation while allocating a peer (background=%s)',
  async (background) => {
    const controller = new AbortController();
    if (background) {
      const create = browser.windows.create.getMockImplementation()!;
      browser.windows.create.mockImplementationOnce(async () => {
        const window = await create();
        controller.abort();
        return window;
      });
    } else {
      const create = browser.tabs.create.getMockImplementation()!;
      browser.tabs.create.mockImplementationOnce(async (options) => {
        const tab = await create(options);
        controller.abort();
        return tab;
      });
    }
    await expect(
      client.preparePeer('chatgpt', undefined, undefined, controller.signal, background),
    ).rejects.toThrow();
    expect(browser.scripting.executeScript).not.toHaveBeenCalled();
    expect(browser.tabs.update).not.toHaveBeenCalled();
  },
);

it('does not activate after cancellation during owned-window validation', async () => {
  const binding = await ownedPeer();
  const controller = new AbortController();
  browser.windows.get.mockImplementationOnce(async () => {
    controller.abort();
    return { id: 12, focused: false, type: 'normal' };
  });
  expect(typeof client.prepareAutomaticTarget).toBe('function');
  await expect(client.prepareAutomaticTarget(binding, controller.signal)).rejects.toThrow();
  expect(browser.tabs.update).not.toHaveBeenCalled();
});

it.each(['closed', 'focused'])('does not add a peer to a %s owned window', async (state) => {
  await ownedPeer();
  if (state === 'closed') browser.windows.get.mockRejectedValueOnce(new Error('No window'));
  else browser.windows.get.mockResolvedValueOnce({ id: 12, focused: true, type: 'normal' });
  await expect(
    client.preparePeer('chatgpt', undefined, undefined, undefined, true),
  ).rejects.toThrow();
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(browser.windows.create).not.toHaveBeenCalled();
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it.each([1, 2])(
  'does not reuse %i retained background peers as an ordinary connection after new reviews',
  async (count) => {
    const peerHome = 'https://claude.ai/new';
    candidates = Array.from({ length: count }, (_, index) => tab(index + 2, peerHome));
    browser.tabs.get.mockImplementation(async (id) => ({
      ...tab(id, peerHome),
      windowId: id === 9 ? 12 : 4,
    }));
    const binding = await client.preparePeer(
      'claude',
      {
        provider: 'claude',
        tabId: count + 1,
        documentId: 'doc',
        url: peerHome,
        threadId: crypto.randomUUID(),
      },
      undefined,
      undefined,
      true,
    );
    expect(binding.tabId).toBe(9);
    expect(binding.threadId).toBeUndefined();
    expect(browser.windows.create).toHaveBeenCalledWith({
      url: peerHome,
      type: 'normal',
      focused: false,
    });
    expect(browser.tabs.create).not.toHaveBeenCalled();
  },
);

it('prepares and retains an inactive thread without revealing it', async () => {
  const peerHome = 'https://claude.ai/new';
  browser.tabs.get.mockImplementation(async (id) => tab(id, peerHome));
  const threadId = crypto.randomUUID();
  const binding = await client.preparePeer('claude', undefined, threadId);
  expect(binding.threadId).toBe(threadId);
  expect(browser.tabs.create).toHaveBeenCalledWith({ url: peerHome, active: false });
  expect(browser.tabs.update).not.toHaveBeenCalled();
  expect(browser.windows.update).not.toHaveBeenCalled();
  browser.tabs.create.mockClear();
  expect(await client.preparePeer('claude', binding, threadId)).toEqual(binding);
  expect(browser.tabs.create).not.toHaveBeenCalled();
});

it('opens a fresh foreground Claude home instead of reusing retained background peer tabs by default', async () => {
  const peerHome = 'https://claude.ai/new';
  candidates = [tab(2, peerHome), tab(3, peerHome)];
  const binding = await client.preparePeer('claude', {
    provider: 'claude',
    tabId: 2,
    documentId: 'doc',
    url: peerHome,
    threadId: crypto.randomUUID(),
  });
  expect(binding.tabId).toBe(9);
  expect(binding.threadId).toBeUndefined();
  expect(browser.tabs.query).not.toHaveBeenCalled();
  expect(browser.tabs.create).toHaveBeenCalledExactlyOnceWith({ url: peerHome, active: true });
  expect(browser.tabs.update).toHaveBeenCalledExactlyOnceWith(9, { active: true });
  expect(browser.windows.update).toHaveBeenCalledExactlyOnceWith(4, { focused: true });
  expect(browser.windows.create).not.toHaveBeenCalled();
});

it('cancels an inactive peer while readiness is pending without injection or reveal', async () => {
  vi.useFakeTimers();
  browser.tabs.get.mockImplementation(async (id) => ({
    ...tab(id, 'https://claude.ai/new'),
    status: 'loading',
  }));
  const controller = new AbortController();
  const promise = client.preparePeer('claude', undefined, crypto.randomUUID(), controller.signal);
  const outcome = expect(promise).rejects.toThrow();
  await vi.advanceTimersByTimeAsync(200);
  controller.abort();
  await vi.advanceTimersByTimeAsync(200);
  await outcome;
  expect(browser.scripting.executeScript).not.toHaveBeenCalled();
  expect(browser.tabs.update).not.toHaveBeenCalled();
});

it('opens and focuses a normal home when no provider tab exists, even without a composer', async () => {
  expect(await client.connect('chatgpt')).toMatchObject({ tabId: 9, url: home });
  expect(browser.permissions.request).toHaveBeenCalledWith({ origins: ['https://chatgpt.com/*'] });
  expect(browser.tabs.create).toHaveBeenCalledWith({ url: home, active: true });
  expect(browser.tabs.update).toHaveBeenCalledWith(9, { active: true });
  expect(browser.windows.update).toHaveBeenCalledWith(4, { focused: true });
});

it('uses the exact active provider tab over other conversations', async () => {
  active = [tab(1, 'https://chatgpt.com/c/active')];
  candidates = [tab(2, home), tab(3, 'https://chatgpt.com/c/other')];
  expect(await client.connect('chatgpt')).toMatchObject({ tabId: 1 });
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(browser.tabs.update).toHaveBeenCalledWith(1, { active: true });
});

it('uses a unique existing candidate', async () => {
  candidates = [tab(2, 'https://chatgpt.com/c/only')];
  expect(await client.connect('chatgpt')).toMatchObject({ tabId: 2 });
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(browser.windows.update).toHaveBeenCalledWith(4, { focused: true });
});

it('uses an unambiguous blank home among several matching conversations', async () => {
  candidates = [tab(2, 'https://chatgpt.com/c/one'), tab(3, home)];
  expect(await client.connect('chatgpt')).toMatchObject({ tabId: 3 });
  expect(browser.tabs.create).not.toHaveBeenCalled();
});

it('opens a new home instead of choosing among multiple blank homes', async () => {
  candidates = [tab(2, home), tab(3, home)];
  expect(await client.connect('chatgpt')).toMatchObject({ tabId: 9 });
  expect(browser.tabs.create).toHaveBeenCalledWith({ url: home, active: true });
});

it('never chooses an arbitrary conversation when multiple candidates exist', async () => {
  candidates = [tab(2, 'https://chatgpt.com/c/one'), tab(3, 'https://chatgpt.com/c/two')];
  expect(await client.connect('chatgpt')).toMatchObject({ tabId: 9 });
  expect(browser.tabs.create).toHaveBeenCalledWith({ url: home, active: true });
});

it('a read-only connection check rejects a changed conversation without rebinding or injecting', async () => {
  candidates = [tab(2, 'https://chatgpt.com/c/unrelated')];
  const saved = {
    provider: 'chatgpt' as const,
    tabId: 2,
    documentId: 'doc',
    url: 'https://chatgpt.com/c/original',
  };
  await expect(client.inspect(saved)).rejects.toThrow('대화가 바뀌었습니다');
  expect(browser.scripting.executeScript).not.toHaveBeenCalled();
  expect(browser.permissions.request).not.toHaveBeenCalled();
  expect(browser.tabs.update).not.toHaveBeenCalled();
});

it.each([
  { documentId: 'doc', url: 'https://chatgpt.com/c/unrelated' },
  { documentId: 'reloaded-document', url: 'https://chatgpt.com/c/original' },
])('does not rebind a saved peer when its snapshot changes to %j', async (changed) => {
  const saved = {
    provider: 'chatgpt' as const,
    tabId: 2,
    documentId: 'doc',
    url: 'https://chatgpt.com/c/original',
  };
  candidates = [tab(saved.tabId, saved.url)];
  browser.tabs.sendMessage.mockResolvedValueOnce({
    ok: true,
    data: {
      provider: saved.provider,
      ...changed,
      composer: true,
      busy: false,
      draft: false,
      truncated: false,
      lastQuestion: '',
      lastAnswer: '',
      context: { scope: 'rendered' as const, turns: [] },
    },
  });
  await expect(client.preparePeer('chatgpt', saved)).rejects.toThrow('다시 연결');
  expect(browser.scripting.executeScript).not.toHaveBeenCalled();
  expect(browser.tabs.create).not.toHaveBeenCalled();
});

it('refreshes only the same tab after login or reload, without permission prompts or menu commands', async () => {
  candidates = [tab(2, 'https://chatgpt.com/c/returned')];
  const binding = await client.refreshConnection({
    provider: 'chatgpt',
    tabId: 2,
    documentId: 'old',
    url: home,
  });
  expect(binding).toMatchObject({ tabId: 2, documentId: 'doc', url: candidates[0]!.url });
  expect(browser.permissions.request).not.toHaveBeenCalled();
  expect(browser.tabs.query).not.toHaveBeenCalled();
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(browser.tabs.update).not.toHaveBeenCalled();
  expect(browser.windows.update).not.toHaveBeenCalled();
  expect(browser.tabs.sendMessage).toHaveBeenCalledWith(
    2,
    { type: 'snapshot', waitFor: 'composer' },
    { frameId: 0 },
  );
});

it('reports a login-host redirect without injecting there or requesting extra permissions', async () => {
  candidates = [tab(2, 'https://accounts.example.test/signin')];
  await expect(
    client.refreshConnection({ provider: 'chatgpt', tabId: 2, documentId: 'old', url: home }),
  ).rejects.toThrow('로그인 또는 페이지 전환을 완료');
  expect(browser.scripting.executeScript).not.toHaveBeenCalled();
  expect(browser.permissions.request).not.toHaveBeenCalled();
});

it('explains closed-tab recovery', async () => {
  browser.tabs.get.mockRejectedValueOnce(new Error('No tab'));
  await expect(
    client.refreshConnection({ provider: 'chatgpt', tabId: 2, documentId: 'old', url: home }),
  ).rejects.toThrow('연결 탭이 닫혔습니다. 탭 열기');
});

it('waits for loading without creating a replacement tab', async () => {
  vi.useFakeTimers();
  browser.tabs.get.mockImplementationOnce(async (id: number) => ({
    ...tab(id, home),
    status: 'loading',
  }));
  candidates = [tab(2, home)];
  const promise = client.connect('chatgpt');
  await vi.advanceTimersByTimeAsync(200);
  expect(await promise).toMatchObject({ tabId: 2 });
  expect(browser.tabs.create).not.toHaveBeenCalled();
});

it('stops waiting after the loading deadline and gives a page-check recovery', async () => {
  vi.useFakeTimers();
  browser.tabs.get.mockImplementation(async (id: number) => ({
    ...tab(id, home),
    status: 'loading',
  }));
  candidates = [tab(2, home)];
  const outcome = expect(client.connect('chatgpt')).rejects.toThrow('페이지가 아직 로딩 중');
  await vi.advanceTimersByTimeAsync(45000);
  await outcome;
  expect(browser.scripting.executeScript).not.toHaveBeenCalled();
  expect(browser.tabs.create).not.toHaveBeenCalled();
});

it('does not select or open tabs if the click permission request is denied', async () => {
  browser.permissions.request.mockResolvedValueOnce(false);
  await expect(client.connect('chatgpt')).rejects.toThrow('연결 권한이 필요');
  expect(browser.tabs.query).not.toHaveBeenCalled();
  expect(browser.tabs.create).not.toHaveBeenCalled();
});

it.each([false, true])(
  'leaves an existing blank peer alone (present: %s) when opening the review window',
  async (existing) => {
    if (existing) candidates = [tab(2, home)];
    expect((await client.preparePeer('chatgpt', undefined, undefined, undefined, true)).tabId).toBe(
      9,
    );
    expect(browser.tabs.update).not.toHaveBeenCalled();
    expect(browser.windows.update).not.toHaveBeenCalled();
    expect(browser.tabs.query).not.toHaveBeenCalled();
    expect(browser.windows.create.mock.invocationCallOrder[0]).toBeLessThan(
      browser.scripting.executeScript.mock.invocationCallOrder[0]!,
    );
  },
);

it.each([false, true])(
  'reveals an existing or newly created ordinary peer by default (existing=%s)',
  async (existing) => {
    if (existing) candidates = [tab(2, home)];
    const binding = await client.preparePeer('chatgpt');
    expect(binding.tabId).toBe(existing ? 2 : 9);
    expect(browser.windows.create).not.toHaveBeenCalled();
    expect(browser.tabs.query).toHaveBeenCalledExactlyOnceWith({
      currentWindow: true,
      url: `${home}*`,
    });
    if (existing) expect(browser.tabs.create).not.toHaveBeenCalled();
    else expect(browser.tabs.create).toHaveBeenCalledExactlyOnceWith({ url: home, active: true });
    expect(browser.windows.update).toHaveBeenCalledExactlyOnceWith(4, { focused: true });
    expect(browser.tabs.update).toHaveBeenCalledExactlyOnceWith(binding.tabId, { active: true });
    expect(browser.tabs.update.mock.invocationCallOrder[0]).toBeLessThan(
      browser.scripting.executeScript.mock.invocationCallOrder[0]!,
    );
  },
);

it('reveals the exact saved ordinary binding by default without replacing it', async () => {
  const saved = { provider: 'chatgpt' as const, tabId: 2, documentId: 'doc', url: home };
  expect(await client.preparePeer('chatgpt', saved)).toBe(saved);
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(browser.windows.create).not.toHaveBeenCalled();
  expect(browser.windows.update).toHaveBeenCalledExactlyOnceWith(4, { focused: true });
  expect(browser.tabs.update).toHaveBeenCalledExactlyOnceWith(2, { active: true });
});

for (const action of ['connect', 'refresh', 'prepare', 'prepare-background'] as const) {
  it(`${action} waits for a tab that completes after 28 seconds`, async () => {
    vi.useFakeTimers();
    const started = Date.now();
    const readyHome = 'https://gemini.google.com/app';
    candidates = [tab(2, readyHome)];
    browser.tabs.get.mockImplementation(async (id: number) => ({
      ...tab(id, readyHome),
      windowId: action === 'prepare-background' ? 12 : 4,
      status: Date.now() - started < 28000 ? 'loading' : 'complete',
    }));
    const promise =
      action === 'connect'
        ? client.connect('gemini')
        : action === 'prepare' || action === 'prepare-background'
          ? client.preparePeer(
              'gemini',
              undefined,
              undefined,
              undefined,
              action === 'prepare-background',
            )
          : client.refreshConnection({
              provider: 'gemini',
              tabId: 2,
              documentId: 'old',
              url: readyHome,
            });
    const outcome = promise.then(
      (binding) => ({ binding }),
      (error) => ({ error }),
    );
    await vi.advanceTimersByTimeAsync(28000);
    expect(await outcome).toMatchObject({
      binding: { tabId: action === 'prepare-background' ? 9 : 2, url: readyHome },
    });
    expect(browser.tabs.create).not.toHaveBeenCalled();
  });
}

it.each(
  [false, true].flatMap((background) =>
    ['closed', 'login', 'loading'].map((state) => ({ background, state })),
  ),
)(
  'preparePeer fails closed for a $state tab (background=$background)',
  async ({ state, background }) => {
    vi.useFakeTimers();
    candidates = [tab(2, home)];
    browser.tabs.get.mockImplementation(async (id: number) => {
      if (state === 'closed') throw new Error('No tab');
      return {
        ...tab(id, state === 'login' ? 'https://accounts.example.test/signin' : home),
        status: state === 'loading' ? 'loading' : 'complete',
      };
    });
    const outcome = client.preparePeer('chatgpt', undefined, undefined, undefined, background).then(
      () => undefined,
      (error: Error) => error.message,
    );
    await vi.advanceTimersByTimeAsync(45000);
    expect(await outcome).toContain(
      state === 'closed'
        ? background
          ? '연결 탭이 닫혔습니다'
          : 'No tab'
        : state === 'login'
          ? '로그인 또는 페이지 전환'
          : '페이지가 아직 로딩 중',
    );
    expect(browser.scripting.executeScript).not.toHaveBeenCalled();
    expect(browser.tabs.create).not.toHaveBeenCalled();
  },
);

it('preserves older reserved peer ownership on explicit reconnect so an ordinary review opens a fresh Claude home', async () => {
  const peerHome = 'https://claude.ai/new';
  const threadA = crypto.randomUUID();
  active = [tab(2, peerHome)];
  candidates = [tab(2, peerHome), tab(3, peerHome)];
  browser.tabs.get.mockImplementation(async (id) => ({
    ...tab(id, peerHome),
    windowId: id === 9 ? 12 : 4,
  }));
  const snap = await browser.tabs.sendMessage.getMockImplementation()!(2);
  const reserved = { ...snap, data: { ...snap.data, threadId: threadA } };
  browser.tabs.sendMessage.mockResolvedValueOnce(reserved);
  const reconnected = await client.connect('claude');
  expect(reconnected).toMatchObject({ tabId: 2, threadId: threadA });
  expect(browser.tabs.create).not.toHaveBeenCalled();
  const ordinary = await client.preparePeer('claude', reconnected, undefined, undefined, true);
  expect(ordinary.tabId).toBe(9);
  expect(ordinary.threadId).toBeUndefined();
  expect(browser.windows.create).toHaveBeenCalledExactlyOnceWith({
    url: peerHome,
    type: 'normal',
    focused: false,
  });
  expect(browser.tabs.create).not.toHaveBeenCalled();
});

it.each([undefined, 'different'])(
  'rejects contradictory snapshot ownership for a %s saved binding without rebinding',
  async (ownership) => {
    const peerHome = 'https://claude.ai/new';
    candidates = [tab(2, peerHome)];
    const snap = await browser.tabs.sendMessage.getMockImplementation()!(2);
    const reserved = { ...snap, data: { ...snap.data, threadId: crypto.randomUUID() } };
    browser.tabs.sendMessage.mockResolvedValueOnce(reserved);
    const saved = {
      provider: 'claude' as const,
      tabId: 2,
      documentId: 'doc',
      url: peerHome,
      ...(ownership ? { threadId: crypto.randomUUID() } : {}),
    };
    await expect(client.inspect(saved)).rejects.toThrow('검토 연결');
    expect(browser.tabs.create).not.toHaveBeenCalled();
    expect(browser.scripting.executeScript).not.toHaveBeenCalled();
    expect(browser.tabs.update).not.toHaveBeenCalled();
  },
);

it('permits a newly bound local thread before its first send establishes page ownership', async () => {
  const peerHome = 'https://claude.ai/new';
  candidates = [tab(2, peerHome)];
  await expect(
    client.inspect({
      provider: 'claude',
      tabId: 2,
      documentId: 'doc',
      url: peerHome,
      threadId: crypto.randomUUID(),
    }),
  ).resolves.toMatchObject({ provider: 'claude', documentId: 'doc' });
  expect(browser.tabs.create).not.toHaveBeenCalled();
});

it('validates snapshot ownership as a Claude-only opaque local UUID while retaining legacy snapshots', async () => {
  const { data } = await browser.tabs.sendMessage.getMockImplementation()!(2);
  expect(Snapshot.safeParse(data).success).toBe(true);
  expect(
    Snapshot.safeParse({ ...data, provider: 'claude', threadId: crypto.randomUUID() }).success,
  ).toBe(true);
  expect(
    Snapshot.safeParse({ ...data, provider: 'gemini', threadId: crypto.randomUUID() }).success,
  ).toBe(false);
  expect(
    Snapshot.safeParse({ ...data, provider: 'claude', threadId: 'not-a-local-uuid' }).success,
  ).toBe(false);
});
