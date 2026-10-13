import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { chromePlatform } from '../../../src/infrastructure/chrome/platform';

const home = 'https://claude.ai/new';
const stored: Record<string, unknown> = {};
const browser = {
  permissions: { request: vi.fn(async () => true), contains: vi.fn(async () => true) },
  tabs: {
    create: vi.fn(async () => ({ id: 91, url: home, status: 'complete' })),
    get: vi.fn(async () => ({ id: 91, url: home, status: 'complete' })),
    update: vi.fn(),
    sendMessage: vi.fn(async (_id: number, command: { type: string }) => ({
      ok: true,
      data:
        command.type === 'snapshot'
          ? {
              provider: 'claude',
              documentId: 'probe-doc',
              url: home,
              composer: true,
              busy: false,
              draft: false,
              truncated: false,
              lastQuestion: '',
              lastAnswer: '',
              context: { scope: 'rendered', turns: [] },
            }
          : command.type === 'pollClaudeProbe'
            ? { status: 'done', answer: 'CROSSCHECK_OK' }
            : true,
    })),
  },
  windows: { update: vi.fn() },
  scripting: { executeScript: vi.fn(async () => []) },
  storage: {
    session: {
      get: vi.fn(async () => ({ ...stored })),
      set: vi.fn(async (value: Record<string, unknown>) => {
        Object.assign(stored, value);
      }),
    },
  },
};
beforeEach(() => {
  vi.clearAllMocks();
  for (const key of Object.keys(stored)) delete stored[key];
  browser.permissions.request.mockResolvedValue(true);
  browser.tabs.get.mockResolvedValue({ id: 91, url: home, status: 'complete' });
  browser.storage.session.set.mockImplementation(async (value) => {
    Object.assign(stored, value);
  });
  vi.stubGlobal('chrome', browser);
});
afterEach(() => vi.unstubAllGlobals());

it('starts a one-shot probe in a new inactive tab after intent is safely stored', async () => {
  expect(chromePlatform.startClaudeProbe).toBeTypeOf('function');
  expect(await chromePlatform.startClaudeProbe!(new AbortController().signal)).toBe(
    'CROSSCHECK_OK',
  );
  expect(browser.tabs.create).toHaveBeenCalledWith({ url: home, active: false });
  expect(browser.tabs.update).not.toHaveBeenCalled();
  expect(browser.windows.update).not.toHaveBeenCalled();
  const sends = browser.tabs.sendMessage.mock.calls.filter(
    ([, command]) => command.type === 'startClaudeProbe',
  );
  expect(sends).toHaveLength(1);
  expect(browser.storage.session.set.mock.invocationCallOrder[0]).toBeLessThan(
    browser.tabs.create.mock.invocationCallOrder[0]!,
  );
  expect(stored['crosscheck.claude-probe.v1']).toMatchObject({ status: 'done' });
  expect(JSON.stringify(stored)).not.toContain('CROSSCHECK_OK');
});

it('never starts a request if intent persistence fails', async () => {
  expect(chromePlatform.startClaudeProbe).toBeTypeOf('function');
  browser.storage.session.set.mockRejectedValueOnce(new Error('storage unavailable'));
  await expect(chromePlatform.startClaudeProbe!(new AbortController().signal)).rejects.toThrow();
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(browser.tabs.sendMessage).not.toHaveBeenCalled();
});

it('restores unfinished intent as uncertain without creating or messaging a tab', async () => {
  expect(chromePlatform.readClaudeProbe).toBeTypeOf('function');
  stored['crosscheck.claude-probe.v1'] = { id: 'test-attempt', status: 'pending' };
  expect(await chromePlatform.readClaudeProbe!()).toEqual({
    id: 'test-attempt',
    status: 'uncertain',
  });
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(browser.tabs.sendMessage).not.toHaveBeenCalled();
});

it('persists the bounded context intent before creating its tab and forwards the kind', async () => {
  await chromePlatform.startClaudeProbe!(new AbortController().signal, 'context');
  const first = browser.storage.session.set.mock.calls[0]?.[0];
  expect(first?.['crosscheck.claude-probe.v1']).toMatchObject({
    kind: 'context',
    status: 'pending',
  });
  expect(browser.storage.session.set.mock.invocationCallOrder[0]).toBeLessThan(
    browser.tabs.create.mock.invocationCallOrder[0]!,
  );
  const starts = browser.tabs.sendMessage.mock.calls.filter(
    ([, command]) => command.type === 'startClaudeProbe',
  );
  expect(starts).toHaveLength(1);
  expect(starts[0]?.[1]).toMatchObject({ kind: 'context' });
  expect(stored['crosscheck.claude-probe.v1']).toMatchObject({ kind: 'context', status: 'done' });
  expect(browser.tabs.update).not.toHaveBeenCalled();
  expect(JSON.stringify(stored)).not.toContain('CROSSCHECK_OK');
});

it('restores pending context as uncertain without resuming either request', async () => {
  stored['crosscheck.claude-probe.v1'] = {
    id: 'context-attempt',
    kind: 'context',
    status: 'pending',
  };
  expect(await chromePlatform.readClaudeProbe!()).toEqual({
    id: 'context-attempt',
    kind: 'context',
    status: 'uncertain',
  });
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(browser.tabs.sendMessage).not.toHaveBeenCalled();
});

it('rejects overlapping starts without duplicating an attempt', async () => {
  expect(chromePlatform.startClaudeProbe).toBeTypeOf('function');
  let release!: (allowed: boolean) => void;
  browser.permissions.request.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        release = resolve;
      }),
  );
  const first = chromePlatform.startClaudeProbe!(new AbortController().signal);
  await expect(chromePlatform.startClaudeProbe!(new AbortController().signal)).rejects.toThrow();
  release(true);
  await first;
  expect(browser.tabs.create).toHaveBeenCalledTimes(1);
});

it('does not dispatch a request after cancellation during setup', async () => {
  expect(chromePlatform.startClaudeProbe).toBeTypeOf('function');
  const controller = new AbortController();
  browser.storage.session.set.mockImplementationOnce(async (value) => {
    Object.assign(stored, value);
    controller.abort();
  });
  await expect(chromePlatform.startClaudeProbe!(controller.signal)).rejects.toThrow();
  expect(browser.tabs.sendMessage).not.toHaveBeenCalled();
});

it('shows a fixed catalog failure without exposing provider errors or retrying', async () => {
  browser.tabs.sendMessage
    .mockImplementationOnce(async () => ({
      ok: true,
      data: {
        provider: 'claude',
        documentId: 'probe-doc',
        url: home,
        composer: true,
        busy: false,
        draft: false,
        truncated: false,
        lastQuestion: '',
        lastAnswer: '',
        context: { scope: 'rendered', turns: [] },
      },
    }))
    .mockImplementationOnce(async () => ({ ok: true, data: true }))
    .mockImplementationOnce(async () => ({
      ok: true,
      data: { status: 'error', answer: '', reason: 'catalog' },
    }));
  await expect(chromePlatform.startClaudeProbe!(new AbortController().signal)).rejects.toThrow(
    '모델 목록',
  );
  expect(
    browser.tabs.sendMessage.mock.calls.filter(([, c]) => c.type === 'startClaudeProbe'),
  ).toHaveLength(1);
  expect(JSON.stringify(stored)).not.toContain('catalog');
});

it('Stop interrupts tab-loading readiness promptly without injection or generation', async () => {
  vi.useFakeTimers();
  const controller = new AbortController();
  browser.tabs.get.mockImplementation(async () => {
    controller.abort();
    return { id: 91, url: home, status: 'loading' };
  });
  let finished = false;
  const attempt = chromePlatform.startClaudeProbe!(controller.signal).catch(() => {
    finished = true;
  });
  await vi.advanceTimersByTimeAsync(200);
  const promptly = finished;
  await vi.advanceTimersByTimeAsync(45000);
  await attempt;
  vi.useRealTimers();
  expect(promptly).toBe(true);
  expect(browser.scripting.executeScript).not.toHaveBeenCalled();
  expect(browser.tabs.sendMessage).not.toHaveBeenCalled();
});
