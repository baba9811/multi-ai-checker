import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { chromePlatform } from '../../../src/infrastructure/chrome/platform';

const home = 'https://gemini.google.com/app';
const stored: Record<string, unknown> = {};
const browser = {
  permissions: { request: vi.fn(async () => true), contains: vi.fn(async () => true) },
  tabs: {
    create: vi.fn(async () => ({ id: 92, url: home, status: 'complete' })),
    get: vi.fn(async () => ({ id: 92, url: home, status: 'complete' })),
    update: vi.fn(),
    sendMessage: vi.fn(
      async (_id: number, command: { type: string }): Promise<{ ok: boolean; data: unknown }> => ({
        ok: true,
        data:
          command.type === 'snapshot'
            ? {
                provider: 'gemini',
                documentId: 'gemini-doc',
                url: home,
                composer: true,
                busy: false,
                draft: false,
                truncated: false,
                lastQuestion: '',
                lastAnswer: '',
                context: { scope: 'rendered', turns: [] },
              }
            : command.type === 'pollGeminiReadiness'
              ? { status: 'done', result: { model: 'Automatic fixture', protection: 'enabled' } }
              : true,
      }),
    ),
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
  browser.storage.session.set.mockImplementation(async (value) => {
    Object.assign(stored, value);
  });
  vi.stubGlobal('chrome', browser);
});
afterEach(() => vi.unstubAllGlobals());

it('checks one inactive new Gemini home after intent persistence, stores no live metadata', async () => {
  expect(chromePlatform.checkGeminiReadiness).toBeTypeOf('function');
  expect(await chromePlatform.checkGeminiReadiness!(new AbortController().signal)).toEqual({
    model: 'Automatic fixture',
    protection: 'enabled',
  });
  expect(browser.tabs.create).toHaveBeenCalledWith({ url: home, active: false });
  expect(browser.tabs.update).not.toHaveBeenCalled();
  expect(browser.windows.update).not.toHaveBeenCalled();
  expect(browser.storage.session.set.mock.invocationCallOrder[0]).toBeLessThan(
    browser.tabs.create.mock.invocationCallOrder[0]!,
  );
  expect(
    browser.tabs.sendMessage.mock.calls.filter(([, c]) => c.type === 'startGeminiReadiness'),
  ).toHaveLength(1);
  expect(stored['crosscheck.gemini-readiness.v1']).toMatchObject({ status: 'done' });
  expect(JSON.stringify(stored)).not.toMatch(/Automatic|protection|enabled/);
});

it('never creates or dispatches when readiness intent cannot be persisted', async () => {
  expect(chromePlatform.checkGeminiReadiness).toBeTypeOf('function');
  browser.storage.session.set.mockRejectedValueOnce(new Error('unavailable'));
  await expect(
    chromePlatform.checkGeminiReadiness!(new AbortController().signal),
  ).rejects.toThrow();
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(browser.tabs.sendMessage).not.toHaveBeenCalled();
});

it('restores unfinished readiness as uncertain without dispatch', async () => {
  expect(chromePlatform.readGeminiReadiness).toBeTypeOf('function');
  stored['crosscheck.gemini-readiness.v1'] = { id: 'interrupted', status: 'pending' };
  expect(await chromePlatform.readGeminiReadiness!()).toEqual({
    id: 'interrupted',
    status: 'uncertain',
  });
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(browser.tabs.sendMessage).not.toHaveBeenCalled();
});

it('cancellation during intent persistence does not create a tab', async () => {
  expect(chromePlatform.checkGeminiReadiness).toBeTypeOf('function');
  const controller = new AbortController();
  browser.storage.session.set.mockImplementationOnce(async (value) => {
    Object.assign(stored, value);
    controller.abort();
  });
  await expect(chromePlatform.checkGeminiReadiness!(controller.signal)).rejects.toThrow();
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(browser.tabs.sendMessage).not.toHaveBeenCalled();
  expect(stored['crosscheck.gemini-readiness.v1']).toMatchObject({ status: 'uncertain' });
});

it('returns only a fixed model-stage cause when the provider cannot read its own menu', async () => {
  browser.tabs.sendMessage
    .mockImplementationOnce(async () => ({
      ok: true,
      data: {
        provider: 'gemini',
        documentId: 'gemini-doc',
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
    .mockImplementationOnce(async () => ({ ok: true, data: { status: 'error', reason: 'model' } }));
  await expect(
    chromePlatform.checkGeminiReadiness!(new AbortController().signal),
  ).rejects.toMatchObject({ cause: 'model' });
  expect(stored['crosscheck.gemini-readiness.v1']).toMatchObject({ status: 'uncertain' });
  expect(JSON.stringify(stored)).not.toContain('model');
});
