import { test, expect } from './extension';
import type { BrowserContext, Page } from '@playwright/test';
import {
  geminiSdkTrialReadinessPage,
  installGeminiHeaderObservationFixture,
} from '../fixtures/providers/gemini-readiness';

// Disposable installed copy grants Gemini synthetically. Allocation is substituted with one
// routed tab; visibility/projection are explicit ISOLATED fixture seams. The real bridge runs.
// The panel is a regular extension tab: this suite is not genuine native-sidepanel evidence.
test.describe('installed DOM-only observation', () => {
  test.use({ syntheticGeminiPermission: true });
  async function prepare(context: BrowserContext, panel: Page, delay: number, visible = false) {
    // Leave automatic source import before creating an active synthetic provider page.
    await panel.getByRole('button', { name: '연결', exact: true }).first().click();
    const gemini = await context.newPage();
    let requests = 0;
    await gemini.route('https://gemini.google.com/**', (route) => {
      if (['xhr', 'fetch'].includes(route.request().resourceType())) requests++;
      return route.fulfill({ contentType: 'text/html', body: geminiSdkTrialReadinessPage() });
    });
    await gemini.goto('https://gemini.google.com/app');
    const ids = await panel.evaluate(async () =>
      (await chrome.tabs.query({ url: 'https://gemini.google.com/app' })).map((tab) => tab.id!),
    );
    expect(ids).toHaveLength(1);
    // Test-only setup: the same self-contained literal used by synthetic MAIN browser cases.
    // Playwright evaluates a function literal here; no eval/CSP change or product injection.
    await panel.evaluate(`chrome.scripting.executeScript({
      target: { tabId: ${ids[0]!}, frameIds: [0] },
      world: 'ISOLATED',
      func: (${installGeminiHeaderObservationFixture.toString()}),
      args: [${JSON.stringify(delay)}, ${JSON.stringify(visible)}]
    })`);
    await panel.evaluate((id) => {
      const f = {
        allocations: 0,
        bridge: 0,
        main: 0,
        snapshots: 0,
        forbidden: 0,
        writes: 0,
        commands: [] as string[],
      };
      (window as any).fixtureHeaderChrome = f;
      const execute = chrome.scripting.executeScript.bind(chrome.scripting);
      // Test-only finite reads use the original API, separately from product scripting below.
      (window as any).fixtureHeaderRead = async () => {
        const [frame] = await execute({
          target: { tabId: id, frameIds: [0] },
          world: 'ISOLATED',
          func: () => {
            const state = (window as any).fixtureHeader;
            return {
              hidden: state.hidden,
              reads: state.reads,
              clicks: state.clicks,
              privateReads: state.privateReads,
              started: state.started,
              network: (window as any).fixtureNetworkCalls,
            };
          },
        });
        if (frame?.frameId !== 0 || !frame.result) throw Error('Missing receiving-realm fixture');
        return frame.result;
      };
      chrome.scripting.executeScript = (async (options: any) => {
        if (options.world === 'MAIN') {
          f.main++;
          throw Error('Observation must not enter MAIN');
        }
        if (options.world !== 'ISOLATED' || JSON.stringify(options.files) !== '["bridge.js"]')
          throw Error('Unexpected product scripting');
        f.bridge++;
        return execute(options);
      }) as typeof chrome.scripting.executeScript;
      const send = chrome.tabs.sendMessage.bind(chrome.tabs);
      chrome.tabs.sendMessage = (async (tabId: number, message: any, options: any) => {
        if (tabId === id) {
          f.commands.push(message.type);
          if (message.type === 'snapshot') f.snapshots++;
          if (
            ![
              'startGeminiHeaderObservation',
              'pollGeminiHeaderObservation',
              'cancelGeminiHeaderObservation',
            ].includes(message.type)
          )
            f.forbidden++;
        }
        return send(tabId, message, options);
      }) as typeof chrome.tabs.sendMessage;
      const save = chrome.storage.session.set.bind(chrome.storage.session);
      chrome.storage.session.set = (async (items: any) => {
        if (Object.keys(items).some((key) => key.startsWith('crosscheck.gemini'))) f.writes++;
        return save(items);
      }) as typeof chrome.storage.session.set;
      // Test-only removal gate lets assertions inspect the real page before production cleanup.
      const remove = chrome.tabs.remove.bind(chrome.tabs);
      chrome.tabs.remove = (async (removedId: number | number[]) => {
        (window as any).fixtureRetirementReady = true;
        await new Promise<void>((resolve) => {
          (window as any).fixtureReleaseRetirement = resolve;
        });
        return typeof removedId === 'number' ? remove(removedId) : remove(removedId);
      }) as typeof chrome.tabs.remove;
      chrome.tabs.create = (async (options: chrome.tabs.CreateProperties) => {
        if (options.url !== 'https://gemini.google.com/app' || options.active !== false)
          throw Error('Unexpected allocation');
        f.allocations++;
        return chrome.tabs.get(id);
      }) as typeof chrome.tabs.create;
    }, ids[0]!);
    const read = () => panel.evaluate(() => (window as any).fixtureHeaderRead());
    expect(await read()).toEqual({
      hidden: !visible,
      reads: 0,
      clicks: 0,
      privateReads: 0,
      started: false,
      network: 0,
    });
    const selected = await context.newPage();
    await selected.goto('about:blank');
    await selected.bringToFront();
    const before = await panel.evaluate(async () =>
      (await chrome.tabs.query({ active: true, currentWindow: true })).map((tab) => tab.id),
    );
    await panel.getByText('Gemini 준비 확인', { exact: true }).click();
    const details = panel
      .locator('details.connection-detail')
      .filter({ hasText: 'Gemini 준비 확인' });
    return { gemini, selected, before, details, read, requests: () => requests };
  }
  for (const visible of [false, true]) {
    test(`installed real observation propagates ${visible ? 'visible' : 'hidden'} late evidence and safely retires its one inactive allocation`, async ({
      extension,
    }) => {
      const { context, panel } = extension;
      const f = await prepare(context, panel, 3200, visible);
      expect((await f.read()).started).toBe(false);
      await f.details.getByRole('button', { name: 'Gemini 버튼 준비만 관찰', exact: true }).click();
      // 3200ms synthetic delay plus existing 80ms sampling/500ms transport cadence.
      await expect
        .poll(() => panel.evaluate(() => (window as any).fixtureRetirementReady), {
          timeout: 10000,
        })
        .toBe(true);
      const observed = await f.read();
      expect(observed.reads).toBeGreaterThan(0);
      expect({
        clicks: observed.clicks,
        privateReads: observed.privateReads,
        sent: await f.gemini.evaluate(() => (window as any).fixtureSent),
        network: observed.network,
      }).toEqual({ clicks: 0, privateReads: 0, sent: [], network: 0 });
      expect(await f.gemini.locator('[role="menu"]').count()).toBe(0);
      // Both fresh retirement checks precede removal; onRemoved can cancel its own observer.
      expect(
        await panel.evaluate(() =>
          (window as any).fixtureHeaderChrome.commands.filter(
            (type: string) => type === 'cancelGeminiHeaderObservation',
          ),
        ),
      ).toHaveLength(2);
      await panel.evaluate(() => (window as any).fixtureReleaseRetirement());
      await expect(
        f.details.getByText(/초기 제한 이후의 준비되지 않은 구조와 이후 준비된 구조/),
      ).toBeVisible({ timeout: 10000 });
      await expect(
        f.details.getByText(
          visible ? /관찰 페이지는 계속 표시 상태였습니다/ : /관찰 페이지는 계속 숨김 상태였습니다/,
        ),
      ).toBeVisible();
      await expect(f.details.getByText(/관찰 탭을 닫았습니다/)).toBeVisible();
      expect(f.gemini.isClosed()).toBe(true);
      const chromeEvidence = await panel.evaluate(() => (window as any).fixtureHeaderChrome);
      expect(chromeEvidence).toEqual({
        allocations: 1,
        bridge: 1,
        main: 0,
        snapshots: 0,
        forbidden: 0,
        writes: 0,
        commands: expect.any(Array),
      });
      expect(
        chromeEvidence.commands.filter((type: string) => type === 'startGeminiHeaderObservation'),
      ).toHaveLength(1);
      expect(f.requests()).toBe(0);
      expect(
        await panel.evaluate(async () =>
          (await chrome.tabs.query({ active: true, currentWindow: true })).map((tab) => tab.id),
        ),
      ).toEqual(f.before);
      expect(await f.selected.evaluate(() => document.hasFocus())).toBe(true);
    });
  }
  for (const kind of ['activation', 'navigation', 'replacement'] as const) {
    test(`installed ${kind} invalidates ownership and retains the page`, async ({ extension }) => {
      const { context, panel } = extension;
      const f = await prepare(context, panel, 15000);
      await f.details.getByRole('button', { name: 'Gemini 버튼 준비만 관찰', exact: true }).click();
      await expect.poll(async () => (await f.read()).started).toBe(true);
      if (kind === 'activation') await f.gemini.bringToFront();
      if (kind === 'navigation')
        await f.gemini.goto('https://gemini.google.com/app?synthetic-navigation');
      if (kind === 'replacement') await f.gemini.reload();
      await expect(f.details.getByText(/관찰 페이지의 연결이 바뀌어 중단했습니다/)).toBeVisible();
      await expect(f.details.getByText(/관찰 탭을 유지했습니다/)).toBeVisible();
      expect(f.gemini.isClosed()).toBe(false);
      expect(await panel.evaluate(() => (window as any).fixtureHeaderChrome.allocations)).toBe(1);
      expect(await panel.evaluate(() => (window as any).fixtureHeaderChrome.main)).toBe(0);
      expect(await panel.evaluate(() => (window as any).fixtureHeaderChrome.writes)).toBe(0);
      expect(f.requests()).toBe(0);
    });
  }
  test('installed cancellation after a draft retains the page and never starts a second observation', async ({
    extension,
  }) => {
    const { context, panel } = extension;
    const f = await prepare(context, panel, 15000);
    await f.details.getByRole('button', { name: 'Gemini 버튼 준비만 관찰', exact: true }).click();
    await expect.poll(async () => (await f.read()).started).toBe(true);
    // Test-only DOM mutation: the retained draft is synthetic and is never exported.
    await f.gemini.evaluate(() => {
      document.querySelector<HTMLElement>('.ql-editor')!.textContent = 'synthetic retained draft';
    });
    await f.details.getByRole('button', { name: '확인 중단', exact: true }).click();
    await expect(f.details.getByText(/버튼 관찰을 중단했습니다/)).toBeVisible();
    await expect(
      f.details.getByRole('button', { name: 'Gemini 버튼 준비만 관찰', exact: true }),
    ).toBeEnabled();
    expect(f.gemini.isClosed()).toBe(false);
    expect(await f.gemini.locator('.ql-editor').innerText()).toBe('synthetic retained draft');
    const observed = await f.read();
    expect({
      clicks: observed.clicks,
      privateReads: observed.privateReads,
      sent: await f.gemini.evaluate(() => (window as any).fixtureSent),
      network: observed.network,
    }).toEqual({ clicks: 0, privateReads: 0, sent: [], network: 0 });
    expect(await panel.evaluate(() => (window as any).fixtureHeaderChrome.allocations)).toBe(1);
    expect(await panel.evaluate(() => (window as any).fixtureHeaderChrome.main)).toBe(0);
    expect(await panel.evaluate(() => (window as any).fixtureHeaderChrome.writes)).toBe(0);
    expect(f.requests()).toBe(0);
    expect(
      await panel.evaluate(async () =>
        (await chrome.tabs.query({ active: true, currentWindow: true })).map((tab) => tab.id),
      ),
    ).toEqual(f.before);
  });
});

test('installed observation checks permission presence without requesting access or allocating', async ({
  extension,
}) => {
  const { panel } = extension;
  await panel.getByRole('button', { name: '연결', exact: true }).first().click();
  await panel.getByText('Gemini 준비 확인', { exact: true }).click();
  await panel.evaluate(() => {
    (window as any).fixturePermissionRequests = 0;
    chrome.permissions.request = (async () => {
      (window as any).fixturePermissionRequests++;
      throw Error('No permission prompt allowed');
    }) as typeof chrome.permissions.request;
  });
  await panel.getByRole('button', { name: 'Gemini 버튼 준비만 관찰', exact: true }).click();
  await expect(panel.getByText(/Gemini 버튼을 관찰하지 못했습니다/)).toBeVisible();
  expect(await panel.evaluate(() => (window as any).fixturePermissionRequests)).toBe(0);
  expect(
    await panel.evaluate(
      async () => (await chrome.tabs.query({ url: 'https://gemini.google.com/*' })).length,
    ),
  ).toBe(0);
});
