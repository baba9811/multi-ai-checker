import { installCollectorFixture } from '../fixtures/chrome/collector';
import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import { geminiReadinessPage } from '../fixtures/providers/gemini-readiness';

type Target = { documentId: string; url: string };
type Reply = { ok: boolean; data?: unknown; error?: string };
async function command(
  page: Page,
  message: object,
  sender = { id: 'fixture', url: 'chrome-extension://fixture/sidepanel.html' },
) {
  return page.evaluate(
    ({ message, sender }) =>
      new Promise<Reply>((resolve) => {
        (window as any).__bridgeHandler(message, sender, resolve);
        if (sender.id !== 'fixture' || sender.url !== 'chrome-extension://fixture/sidepanel.html')
          setTimeout(() => resolve({ ok: false }), 50);
      }),
    { message, sender },
  );
}
async function setup(page: Page): Promise<Target> {
  await page.route('https://gemini.google.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: geminiReadinessPage(true) }),
  );
  await page.goto('https://gemini.google.com/app');
  await page.evaluate(() => {
    (window as any).chrome = {
      runtime: {
        id: 'fixture',
        getURL: (name: string) => `chrome-extension://fixture/${name}`,
        onMessage: {
          addListener: (handler: unknown) => {
            (window as any).__bridgeHandler = handler;
          },
        },
      },
    };
  });
  await page.evaluate(installCollectorFixture);
  const bridge = await page.addScriptTag({ path: path.resolve('.output/chrome-mv3/bridge.js') });
  await bridge.evaluate((element) => element.parentNode?.removeChild(element));
  const snapshot = await command(page, { type: 'snapshot' });
  expect(snapshot.ok).toBe(true);
  const target = snapshot.data as Target;
  return { documentId: target.documentId, url: target.url };
}
const reserve = (page: Page, target: Target, id = 'fixed-trial') =>
  command(page, { type: 'reserveGeminiSdkTrial', id, ...target });
const check = (page: Page, target: Target, id = 'fixed-trial') =>
  command(page, { type: 'checkGeminiSdkTrial', id, documentId: target.documentId });
const cancel = (page: Page, target: Target, id = 'fixed-trial') =>
  command(page, { type: 'cancelGeminiSdkTrial', id, documentId: target.documentId });
async function noSends(page: Page) {
  expect(
    await page.evaluate(() => ({
      sent: (window as any).fixtureSent,
      network: (window as any).fixtureNetworkCalls,
    })),
  ).toEqual({ sent: [], network: 0 });
  await expect(page.locator('[role="menu"]')).toHaveCount(0);
}

test('one fresh reservation returns only fixed safe metadata and permanently quarantines standard mutations', async ({
  page,
}) => {
  const target = await setup(page);
  expect((await reserve(page, target)).ok).toBe(true);
  expect(await check(page, target)).toEqual({
    ok: true,
    data: { ready: true, safeToRetire: true },
  });
  expect((await reserve(page, target)).ok).toBe(false);
  expect((await reserve(page, target, 'second-trial')).ok).toBe(false);
  const mutations = [
    { type: 'models', ...target },
    { type: 'selectModel', ...target, key: 'synthetic-choice' },
    { type: 'send', id: 'synthetic-send', ...target, prompt: 'BLOCKED_SYNTHETIC_PROMPT' },
    { type: 'startGeminiReadiness', id: 'synthetic-ready', ...target },
    { type: 'startClaudeProbe', id: 'synthetic-probe', ...target },
  ];
  for (const message of mutations) expect((await command(page, message)).ok).toBe(false);
  expect(await cancel(page, target)).toEqual({ ok: true, data: true });
  expect(await check(page, target)).toEqual({
    ok: true,
    data: { ready: false, safeToRetire: true },
  });
  for (const message of mutations) expect((await command(page, message)).ok).toBe(false);
  await noSends(page);
});

test('strict fixed home, document and IDs refuse foreign or extra command fields without consuming a reservation', async ({
  page,
}) => {
  const target = await setup(page);
  for (const message of [
    { type: 'reserveGeminiSdkTrial', id: '', ...target },
    { type: 'reserveGeminiSdkTrial', id: 'x'.repeat(101), ...target },
    { type: 'reserveGeminiSdkTrial', id: 'wrong-doc', ...target, documentId: 'foreign' },
    {
      type: 'reserveGeminiSdkTrial',
      id: 'wrong-home',
      ...target,
      url: 'https://gemini.google.com/app/abcd',
    },
    { type: 'reserveGeminiSdkTrial', id: 'extra', ...target, prompt: 'UNAPPROVED_SYNTHETIC_TEXT' },
  ])
    expect((await command(page, message)).ok).toBe(false);
  expect((await reserve(page, target)).ok).toBe(true);
  for (const type of ['checkGeminiSdkTrial', 'cancelGeminiSdkTrial']) {
    expect((await command(page, { type, id: 'foreign', documentId: target.documentId })).ok).toBe(
      false,
    );
    expect((await command(page, { type, id: 'fixed-trial', documentId: 'foreign' })).ok).toBe(
      false,
    );
    expect(
      (
        await command(page, {
          type,
          id: 'fixed-trial',
          documentId: target.documentId,
          url: target.url,
        })
      ).ok,
    ).toBe(false);
  }
  expect((await check(page, target)).data).toEqual({ ready: true, safeToRetire: true });
  await noSends(page);
});

test('only the actual extension panel sender can reserve', async ({ page }) => {
  const target = await setup(page);
  for (const sender of [
    { id: 'fixture', url: 'https://gemini.google.com/app' },
    { id: 'foreign', url: 'chrome-extension://fixture/sidepanel.html' },
  ])
    expect(
      (await command(page, { type: 'reserveGeminiSdkTrial', id: 'fixed-trial', ...target }, sender))
        .ok,
    ).toBe(false);
  expect((await reserve(page, target)).ok).toBe(true);
  await noSends(page);
});

for (const occupied of ['draft', 'composer', 'conversation', 'busy'] as const) {
  test(`reservation refuses a non-fresh ${occupied} page without sending`, async ({ page }) => {
    const target = await setup(page);
    if (occupied === 'draft') await page.locator('.ql-editor').fill('SYNTHETIC_EXISTING_DRAFT');
    else
      await page.evaluate((occupied) => {
        if (occupied === 'composer') document.querySelector('.ql-editor')!.remove();
        if (occupied === 'conversation')
          document.getElementById('messages')!.innerHTML =
            '<user-query><div class="query-text">Synthetic previous question</div></user-query>';
        if (occupied === 'busy') {
          const stop = document.createElement('button');
          stop.setAttribute('aria-label', 'Stop response');
          stop.textContent = 'Stop';
          document.body.append(stop);
        }
      }, occupied);
    expect((await reserve(page, target)).ok).toBe(false);
    expect((await check(page, target)).ok).toBe(false);
    await noSends(page);
  });
}

test('trusted user interaction and a cleared user draft permanently forbid automatic retirement', async ({
  page,
}) => {
  const target = await setup(page);
  expect((await reserve(page, target)).ok).toBe(true);
  await page.locator('.ql-editor').fill('SYNTHETIC_USER_DRAFT');
  await page.locator('.ql-editor').fill('');
  await page.locator('h1').click();
  expect((await check(page, target)).data).toEqual({ ready: false, safeToRetire: false });
  expect((await cancel(page, target)).ok).toBe(true);
  expect((await check(page, target)).data).toEqual({ ready: false, safeToRetire: false });
  await noSends(page);
});

for (const changed of ['draft', 'composer'] as const) {
  test(`current ${changed} readiness fails even without an input event`, async ({ page }) => {
    const target = await setup(page);
    expect((await reserve(page, target)).ok).toBe(true);
    await page.evaluate((changed) => {
      const editor = document.querySelector('.ql-editor')!;
      (window as any).__sdkFixtureEditor = editor;
      (window as any).__sdkFixtureParent = editor.parentElement;
      if (changed === 'draft') editor.textContent = 'SYNTHETIC_PROGRAMMATIC_DRAFT';
      else editor.remove();
    }, changed);
    expect((await check(page, target)).data).toEqual({ ready: false, safeToRetire: false });
    await page.evaluate((changed) => {
      const editor = (window as any).__sdkFixtureEditor as HTMLElement;
      if (changed === 'draft') editor.textContent = '';
      else (window as any).__sdkFixtureParent.append(editor);
    }, changed);
    expect((await command(page, { type: 'snapshot' })).data).toMatchObject({
      composer: true,
      draft: false,
    });
    expect((await check(page, target)).data).toEqual({ ready: false, safeToRetire: false });
    await noSends(page);
  });
}

test('foreign route change during the awaited check cannot use cached home metadata', async ({
  page,
}) => {
  const target = await setup(page);
  expect((await reserve(page, target)).ok).toBe(true);
  const reply = await page.evaluate((target) => {
    const pending = new Promise<Reply>((resolve) =>
      (window as any).__bridgeHandler(
        { type: 'checkGeminiSdkTrial', id: 'fixed-trial', documentId: target.documentId },
        { id: 'fixture', url: 'chrome-extension://fixture/sidepanel.html' },
        resolve,
      ),
    );
    history.pushState(null, '', '/settings');
    return pending;
  }, target);
  expect(reply).toEqual({ ok: true, data: { ready: false, safeToRetire: false } });
  await page.evaluate(() => history.replaceState(null, '', '/app'));
  expect((await check(page, target)).data).toEqual({ ready: false, safeToRetire: false });
  await noSends(page);
});

test('input during the initial snapshot invalidates reservation even when the draft is restored empty', async ({
  page,
}) => {
  const target = await setup(page);
  const reply = await page.evaluate((target) => {
    const pending = new Promise<Reply>((resolve) =>
      (window as any).__bridgeHandler(
        { type: 'reserveGeminiSdkTrial', id: 'fixed-trial', ...target },
        { id: 'fixture', url: 'chrome-extension://fixture/sidepanel.html' },
        resolve,
      ),
    );
    const editor = document.querySelector('.ql-editor')!;
    editor.textContent = 'SYNTHETIC_TRANSIENT_INPUT';
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    editor.textContent = '';
    return pending;
  }, target);
  expect(reply.ok).toBe(false);
  expect((await check(page, target)).ok).toBe(false);
  await noSends(page);
});

test('an expired reservation cannot be revived by checking or reserving again', async ({
  page,
}) => {
  await page.clock.install({ time: 0 });
  const target = await setup(page);
  expect((await reserve(page, target)).ok).toBe(true);
  await page.clock.runFor(15001);
  expect((await check(page, target)).data).toEqual({ ready: false, safeToRetire: true });
  expect((await check(page, target)).data).toEqual({ ready: false, safeToRetire: true });
  expect((await reserve(page, target, 'after-expiry')).ok).toBe(false);
  await noSends(page);
});
