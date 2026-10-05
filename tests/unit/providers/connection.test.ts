import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import {
  connect,
  inspect,
  preparePeer,
  refreshConnection,
} from '../../../src/infrastructure/chrome/provider-client';

const home = 'https://chatgpt.com/';
const tab = (id: number, url: string) => ({ id, url, windowId: 4, status: 'complete' });
let active: ReturnType<typeof tab>[];
let candidates: ReturnType<typeof tab>[];
const getTab = async (id: number) =>
  [...active, ...candidates].find((t) => t.id === id) ?? tab(id, home);
const browser = {
  permissions: { request: vi.fn(async () => true), contains: vi.fn(async () => true) },
  tabs: {
    query: vi.fn(async (query: { active?: boolean }) => (query.active ? active : candidates)),
    create: vi.fn(async () => tab(9, home)),
    get: vi.fn(getTab),
    update: vi.fn(async () => undefined),
    sendMessage: vi.fn(async (id: number) => ({
      ok: true,
      data: {
        provider: 'chatgpt',
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
  windows: { update: vi.fn(async () => undefined) },
  scripting: { executeScript: vi.fn(async () => []) },
};
beforeEach(() => {
  active = [];
  candidates = [];
  vi.clearAllMocks();
  browser.tabs.get.mockImplementation(getTab);
  vi.stubGlobal('chrome', browser);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it('opens and focuses a normal home when no provider tab exists, even without a composer', async () => {
  expect(await connect('chatgpt')).toMatchObject({ tabId: 9, url: home });
  expect(browser.permissions.request).toHaveBeenCalledWith({ origins: ['https://chatgpt.com/*'] });
  expect(browser.tabs.create).toHaveBeenCalledWith({ url: home, active: true });
  expect(browser.tabs.update).toHaveBeenCalledWith(9, { active: true });
  expect(browser.windows.update).toHaveBeenCalledWith(4, { focused: true });
});

it('uses the exact active provider tab over other conversations', async () => {
  active = [tab(1, 'https://chatgpt.com/c/active')];
  candidates = [tab(2, home), tab(3, 'https://chatgpt.com/c/other')];
  expect(await connect('chatgpt')).toMatchObject({ tabId: 1 });
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(browser.tabs.update).toHaveBeenCalledWith(1, { active: true });
});

it('uses a unique existing candidate', async () => {
  candidates = [tab(2, 'https://chatgpt.com/c/only')];
  expect(await connect('chatgpt')).toMatchObject({ tabId: 2 });
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(browser.windows.update).toHaveBeenCalledWith(4, { focused: true });
});

it('uses an unambiguous blank home among several matching conversations', async () => {
  candidates = [tab(2, 'https://chatgpt.com/c/one'), tab(3, home)];
  expect(await connect('chatgpt')).toMatchObject({ tabId: 3 });
  expect(browser.tabs.create).not.toHaveBeenCalled();
});

it('opens a new home instead of choosing among multiple blank homes', async () => {
  candidates = [tab(2, home), tab(3, home)];
  expect(await connect('chatgpt')).toMatchObject({ tabId: 9 });
  expect(browser.tabs.create).toHaveBeenCalledWith({ url: home, active: true });
});

it('never chooses an arbitrary conversation when multiple candidates exist', async () => {
  candidates = [tab(2, 'https://chatgpt.com/c/one'), tab(3, 'https://chatgpt.com/c/two')];
  expect(await connect('chatgpt')).toMatchObject({ tabId: 9 });
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
  await expect(inspect(saved)).rejects.toThrow('대화가 바뀌었습니다');
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
  await expect(preparePeer('chatgpt', saved)).rejects.toThrow('다시 연결');
  expect(browser.scripting.executeScript).not.toHaveBeenCalled();
  expect(browser.tabs.create).not.toHaveBeenCalled();
});

it('refreshes only the same tab after login or reload, without permission prompts or menu commands', async () => {
  candidates = [tab(2, 'https://chatgpt.com/c/returned')];
  const binding = await refreshConnection({
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
    refreshConnection({ provider: 'chatgpt', tabId: 2, documentId: 'old', url: home }),
  ).rejects.toThrow('로그인 또는 페이지 전환을 완료');
  expect(browser.scripting.executeScript).not.toHaveBeenCalled();
  expect(browser.permissions.request).not.toHaveBeenCalled();
});

it('explains closed-tab recovery', async () => {
  browser.tabs.get.mockRejectedValueOnce(new Error('No tab'));
  await expect(
    refreshConnection({ provider: 'chatgpt', tabId: 2, documentId: 'old', url: home }),
  ).rejects.toThrow('연결 탭이 닫혔습니다. 탭 열기');
});

it('waits for loading without creating a replacement tab', async () => {
  vi.useFakeTimers();
  browser.tabs.get.mockImplementationOnce(async (id: number) => ({
    ...tab(id, home),
    status: 'loading',
  }));
  candidates = [tab(2, home)];
  const promise = connect('chatgpt');
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
  const outcome = expect(connect('chatgpt')).rejects.toThrow('페이지가 아직 로딩 중');
  await vi.advanceTimersByTimeAsync(20000);
  await outcome;
  expect(browser.scripting.executeScript).not.toHaveBeenCalled();
  expect(browser.tabs.create).not.toHaveBeenCalled();
});

it('does not select or open tabs if the click permission request is denied', async () => {
  browser.permissions.request.mockResolvedValueOnce(false);
  await expect(connect('chatgpt')).rejects.toThrow('연결 권한이 필요');
  expect(browser.tabs.query).not.toHaveBeenCalled();
  expect(browser.tabs.create).not.toHaveBeenCalled();
});

it.each([false, true])(
  'activates a %s existing blank peer before bridge attachment',
  async (existing) => {
    if (existing) candidates = [tab(2, home)];
    const binding = await preparePeer('chatgpt');
    expect(browser.tabs.update).toHaveBeenCalledWith(binding.tabId, { active: true });
    expect(browser.windows.update).toHaveBeenCalledWith(4, { focused: true });
    expect(browser.tabs.update.mock.invocationCallOrder[0]).toBeLessThan(
      browser.scripting.executeScript.mock.invocationCallOrder[0]!,
    );
  },
);
