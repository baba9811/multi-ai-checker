import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { chromePlatform } from '../../../src/infrastructure/chrome/platform';

vi.mock('wxt/utils/define-background', () => ({ defineBackground: (start: () => void) => start }));
const available: ((details: { version: string }) => void)[] = [];
const browser = {
  runtime: {
    id: 'synthetic-extension-id',
    getManifest: vi.fn(() => ({ version: '0.3.0', update_url: undefined as string | undefined })),
    onUpdateAvailable: {
      addListener: vi.fn((listener: (details: { version: string }) => void) =>
        available.push(listener),
      ),
      removeListener: vi.fn((listener: (details: { version: string }) => void) => {
        const index = available.indexOf(listener);
        if (index >= 0) available.splice(index, 1);
      }),
    },
    requestUpdateCheck: vi.fn(),
    reload: vi.fn(),
  },
  storage: {
    session: {
      get: vi.fn(async () => ({}) as Record<string, unknown>),
      set: vi.fn(async (_value: Record<string, unknown>) => {}),
      setAccessLevel: vi.fn(async () => {}),
    },
  },
  sidePanel: { setPanelBehavior: vi.fn(async () => {}) },
  tabs: { create: vi.fn(async () => ({})) },
};
beforeEach(() => {
  vi.clearAllMocks();
  available.length = 0;
  browser.runtime.getManifest.mockReturnValue({ version: '0.3.0', update_url: undefined });
  browser.storage.session.get.mockResolvedValue({});
  vi.stubGlobal('chrome', browser);
});
afterEach(() => vi.unstubAllGlobals());

it('reads installed version and conservative automatic-update capability without checking or reloading', async () => {
  expect(await chromePlatform.extensionStatus?.()).toEqual({
    version: '0.3.0',
    automaticUpdates: false,
  });
  browser.runtime.getManifest.mockReturnValue({
    version: '0.3.0',
    update_url: 'https://clients2.google.com/service/update2/crx',
  });
  expect(await chromePlatform.extensionStatus?.()).toEqual({
    version: '0.3.0',
    automaticUpdates: true,
  });
  expect(browser.runtime.requestUpdateCheck).not.toHaveBeenCalled();
  expect(browser.runtime.reload).not.toHaveBeenCalled();
});

it('background preserves a downloaded update notice without keeping a worker alive or forcing reload', async () => {
  const entry = await import('../../../entrypoints/background');
  (entry.default as unknown as () => void)();
  expect(available).toHaveLength(1);
  available[0]!({ version: '0.3.1' });
  expect(browser.storage.session.set).toHaveBeenCalledWith({
    'crosscheck.update.pending.v1': '0.3.1',
  });
  expect(browser.runtime.requestUpdateCheck).not.toHaveBeenCalled();
  expect(browser.runtime.reload).not.toHaveBeenCalled();
});

it('restores a missed update notice when a panel opens again', async () => {
  browser.storage.session.get.mockResolvedValue({ 'crosscheck.update.pending.v1': '0.3.1' });
  expect(await chromePlatform.extensionStatus?.()).toEqual({
    version: '0.3.0',
    automaticUpdates: false,
    pendingVersion: '0.3.1',
  });
});

it('does not show an already-installed version as pending', async () => {
  browser.storage.session.get.mockResolvedValue({ 'crosscheck.update.pending.v1': '0.3.0' });
  expect((await chromePlatform.extensionStatus?.())?.pendingVersion).toBeUndefined();
});

it('watches only lifecycle notices and removes the listener when the panel closes', () => {
  const changed = vi.fn();
  expect(chromePlatform.watchExtensionUpdate).toBeTypeOf('function');
  const stop = chromePlatform.watchExtensionUpdate!(changed);
  available[0]!({ version: '0.3.1' });
  expect(changed).toHaveBeenCalledWith('0.3.1');
  stop();
  expect(available).toHaveLength(0);
  expect(browser.runtime.requestUpdateCheck).not.toHaveBeenCalled();
  expect(browser.runtime.reload).not.toHaveBeenCalled();
});

it('opens this extension management page rather than guessing a store listing URL', async () => {
  expect(chromePlatform.openExtensionManager).toBeTypeOf('function');
  await chromePlatform.openExtensionManager!();
  expect(browser.tabs.create).toHaveBeenCalledWith({
    url: 'chrome://extensions/?id=synthetic-extension-id',
  });
});
