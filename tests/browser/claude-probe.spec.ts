import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import {
  claudeProbeFixture,
  claudeProbeOrg as org,
  claudeProbeBootstrap as bootstrap,
} from '../fixtures/providers/claude-probe';

async function command(
  page: Page,
  message: object,
  sender = 'chrome-extension://fixture/sidepanel.html',
) {
  return page.evaluate(
    ({ message, sender }) =>
      new Promise<{ ok: boolean; data?: any; error?: string }>((resolve) => {
        (window as any).__bridgeHandler(message, { id: 'fixture', url: sender }, resolve);
        if (sender !== 'chrome-extension://fixture/sidepanel.html')
          setTimeout(() => resolve({ ok: false }), 50);
      }),
    { message, sender },
  );
}
async function setup(page: Page, options: { partialTurn?: number; changedReadback?: number } = {}) {
  const fixture = await claudeProbeFixture(page, options);
  await page.goto('https://claude.ai/new');
  await page.evaluate(() => {
    document.getElementById('messages')!.replaceChildren();
    const button = document.querySelector<HTMLButtonElement>(
      '[data-testid="model-selector-dropdown"]',
    )!;
    button.onclick = () => {
      button.setAttribute('aria-expanded', 'true');
      const menu = document.createElement('div');
      menu.setAttribute('role', 'menu');
      const option = document.createElement('button');
      option.setAttribute('role', 'menuitemradio');
      option.setAttribute('aria-checked', 'true');
      const key = (window as any).fixtureProbeModelId;
      if (key !== null) option.setAttribute('data-model-id', key ?? 'claude-sonnet-fixture');
      const name = document.createElement('div');
      name.dataset.testid = 'model-name';
      const opened = ((window as any).fixtureModelMenuOpens ?? 0) + 1;
      (window as any).fixtureModelMenuOpens = opened;
      for (const text of ['Sonnet fixture', `Description ${opened}`, 'icon']) {
        const line = document.createElement('span');
        line.style.display = 'block';
        line.textContent = text;
        name.append(line);
      }
      option.append(name);
      menu.append(option);
      document.body.append(menu);
      option.onkeydown = (event) => {
        if (event.key === 'Escape') {
          menu.remove();
          button.setAttribute('aria-expanded', 'false');
        }
      };
      option.focus();
    };
    (window as any).chrome = {
      runtime: {
        id: 'fixture',
        getURL: (s: string) => `chrome-extension://fixture/${s}`,
        onMessage: {
          addListener: (handler: unknown) => {
            (window as any).__bridgeHandler = handler;
          },
        },
      },
    };
  });
  await page.addScriptTag({ path: path.resolve('.output/chrome-mv3/bridge.js') });
  const snapshot = (await command(page, { type: 'snapshot' })).data;
  return { ...fixture, target: { documentId: snapshot.documentId, url: snapshot.url } };
}

test('fixed Claude probe verifies server-assigned message IDs without menu opening or repeat dispatch', async ({
  page,
  context,
}) => {
  const { target, posts, requests } = await setup(page);
  const displayCatalog = (await command(page, { type: 'models', ...target })).data;
  expect(JSON.stringify(displayCatalog)).not.toContain('claude-sonnet-fixture');
  await page.evaluate(() => ((window as any).fixtureModelMenuOpens = 0));
  const other = await context.newPage();
  await other.goto('about:blank');
  await other.bringToFront();
  expect((await command(page, { type: 'startClaudeProbe', id: 'one-shot', ...target })).ok).toBe(
    true,
  );
  await expect
    .poll(
      async () => (await command(page, { type: 'pollClaudeProbe', id: 'one-shot' })).data?.status,
    )
    .toBe('done');
  expect((await command(page, { type: 'pollClaudeProbe', id: 'one-shot' })).data?.answer).toBe(
    'CROSSCHECK_OK',
  );
  expect((await command(page, { type: 'startClaudeProbe', id: 'one-shot', ...target })).ok).toBe(
    false,
  );
  expect(posts()).toBe(1);
  expect(requests[0]?.body).toMatchObject({
    prompt: 'Reply with CROSSCHECK_OK only.',
    model: 'claude-sonnet-fixture',
    attachments: [],
    files: [],
  });
  expect(requests[0]?.body.turn_message_uuids.human_message_uuid).not.toBe(
    '44444444-4444-4444-8444-444444444444',
  );
  expect(requests[0]?.body.turn_message_uuids.assistant_message_uuid).not.toBe(
    '55555555-5555-4555-8555-555555555555',
  );
  expect(await page.evaluate(() => (window as any).fixtureModelMenuOpens)).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  expect(await other.evaluate(() => document.hasFocus())).toBe(true);
});

for (const condition of ['missing', 'expanded', 'composite', 'disabled', 'ambiguous']) {
  test(`closed probe model refuses ${condition} UI before HTTP sending`, async ({ page }) => {
    const { target, posts } = await setup(page);
    await page.evaluate((condition) => {
      const button = document.querySelector<HTMLButtonElement>(
        '[data-testid="model-selector-dropdown"]',
      )!;
      if (condition === 'missing') button.remove();
      if (condition === 'expanded') button.setAttribute('aria-expanded', 'true');
      if (condition === 'composite') button.textContent = 'Sonnet fixture Medium';
      if (condition === 'disabled') button.disabled = true;
      if (condition === 'ambiguous') document.body.append(button.cloneNode(true));
    }, condition);
    await command(page, { type: 'startClaudeProbe', id: 'invalid-ui', ...target });
    await expect
      .poll(
        async () =>
          (await command(page, { type: 'pollClaudeProbe', id: 'invalid-ui' })).data?.status,
      )
      .toBe('error');
    expect(posts()).toBe(0);
    expect(await page.evaluate(() => (window as any).fixtureModelMenuOpens ?? 0)).toBe(0);
  });
}

test('probe refuses a changed selected model after bootstrap GET before sending', async ({
  page,
}) => {
  const { target, posts } = await setup(page);
  await page.route(`https://claude.ai/edge-api/bootstrap/${org}/app_start?**`, async (route) => {
    await page.evaluate(() => {
      document.querySelector('[data-testid="model-selector-dropdown"] span')!.textContent =
        'Opus fixture';
    });
    await route.fulfill({
      json: bootstrap,
    });
  });
  await command(page, { type: 'startClaudeProbe', id: 'changed-key', ...target });
  await expect
    .poll(
      async () =>
        (await command(page, { type: 'pollClaudeProbe', id: 'changed-key' })).data?.status,
    )
    .toBe('error');
  expect(posts()).toBe(0);
});

test('EOF after text and end_turn remains an uncertain outcome', async ({ page }) => {
  const { target, posts } = await setup(page, { partialTurn: 1 });
  expect((await command(page, { type: 'startClaudeProbe', id: 'partial', ...target })).ok).toBe(
    true,
  );
  await expect
    .poll(
      async () => (await command(page, { type: 'pollClaudeProbe', id: 'partial' })).data?.status,
    )
    .toBe('error');
  expect(posts()).toBe(1);
});

test('probe rejects wrong document, non-panel sender, and injected proxy options before HTTP', async ({
  page,
}) => {
  const { target, posts } = await setup(page);
  expect(
    (
      await command(page, {
        type: 'startClaudeProbe',
        id: 'wrong',
        ...target,
        documentId: 'different',
      })
    ).ok,
  ).toBe(false);
  expect(
    (
      await command(
        page,
        { type: 'startClaudeProbe', id: 'wrong-sender', ...target },
        'https://claude.ai/new',
      )
    ).ok,
  ).toBe(false);
  expect(
    (
      await command(page, {
        type: 'startClaudeProbe',
        id: 'proxy',
        ...target,
        prompt: 'private',
        url: 'https://evil.example/',
      })
    ).ok,
  ).toBe(false);
  expect(posts()).toBe(0);
});

test('context probe retains both synthetic pairs and follows the verified assistant without moving focus', async ({
  page,
  context,
}) => {
  const { target, posts, requests, readbacks } = await setup(page);
  const other = await context.newPage();
  await other.goto('about:blank');
  await other.bringToFront();
  expect(
    (await command(page, { type: 'startClaudeProbe', kind: 'context', id: 'context', ...target }))
      .ok,
  ).toBe(true);
  await expect
    .poll(
      async () => (await command(page, { type: 'pollClaudeProbe', id: 'context' })).data?.status,
    )
    .toBe('done');
  expect((await command(page, { type: 'pollClaudeProbe', id: 'context' })).data?.answer).toBe(
    'First reply: CROSSCHECK_CONTEXT_OK/47\nFollow-up reply: 47/CROSSCHECK_CONTEXT_OK',
  );
  expect(posts()).toBe(2);
  expect(readbacks()).toBe(3);
  expect(requests[0]?.conversation).toBe(requests[1]?.conversation);
  expect(requests[0]?.body.prompt).toContain('Answer: CROSSCHECK_CONTEXT_OK');
  expect(requests[0]?.body.prompt).toContain('Answer: 47');
  expect(requests[0]?.body.prompt.match(/Question:/g)).toHaveLength(2);
  expect(requests[1]?.body.prompt).not.toMatch(/CROSSCHECK_CONTEXT_OK|47|<conversation>/);
  expect(requests[1]?.body.parent_message_uuid).toBe('55555555-5555-4555-8555-555555555555');
  expect(requests[1]?.body).not.toHaveProperty('create_conversation_params');
  expect(
    (await command(page, { type: 'startClaudeProbe', kind: 'context', id: 'context', ...target }))
      .ok,
  ).toBe(false);
  expect(posts()).toBe(2);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  expect(await other.evaluate(() => document.hasFocus())).toBe(true);
});

test('changed first conversation prevents the context follow-up', async ({ page }) => {
  const { target, posts } = await setup(page, { changedReadback: 2 });
  await command(page, {
    type: 'startClaudeProbe',
    kind: 'context',
    id: 'changed-context',
    ...target,
  });
  await expect
    .poll(
      async () =>
        (await command(page, { type: 'pollClaudeProbe', id: 'changed-context' })).data?.status,
    )
    .toBe('error');
  expect(posts()).toBe(1);
});

test('incomplete second stream never completes or retries the context probe', async ({ page }) => {
  const { target, posts } = await setup(page, { partialTurn: 2 });
  await command(page, {
    type: 'startClaudeProbe',
    kind: 'context',
    id: 'partial-context',
    ...target,
  });
  await expect
    .poll(
      async () =>
        (await command(page, { type: 'pollClaudeProbe', id: 'partial-context' })).data?.status,
    )
    .toBe('error');
  expect(
    (await command(page, { type: 'pollClaudeProbe', id: 'partial-context' })).data?.answer,
  ).toBe('');
  expect(posts()).toBe(2);
});

test('connection diagnostic discloses the fixed request and never resumes after reload', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: '연결', exact: true }).first().click();
  await page.getByText('백그라운드 연결 시험', { exact: true }).click();
  await expect(page.getByText('Reply with CROSSCHECK_OK only.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Claude 연결 시험 시작', exact: true }).click();
  await expect(page.getByText('연결 시험 완료', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.harness.sends)).toEqual([]);
  expect(await page.evaluate(() => window.harness.probeStarts)).toBe(1);
  await page.reload();
  await page.getByRole('button', { name: '연결', exact: true }).first().click();
  await page.getByText('백그라운드 연결 시험', { exact: true }).click();
  expect(await page.evaluate(() => window.harness.probeStarts)).toBe(0);
});

test('context diagnostic discloses both fixed requests and passes only its bounded kind', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: '연결', exact: true }).first().click();
  await page.getByText('백그라운드 연결 시험', { exact: true }).click();
  const start = page.getByRole('button', { name: '문맥·후속 응답 시험 시작', exact: true });
  await expect(start).toBeVisible({ timeout: 2500 });
  await expect(page.getByText(/시험용 질문·답변 2쌍/)).toBeVisible();
  await page.getByText('시험에 보내는 내용', { exact: true }).click();
  await expect(page.getByText(/Answer: CROSSCHECK_CONTEXT_OK/)).toBeVisible();
  await expect(page.getByText(/Using the synthetic conversation already provided/)).toBeVisible();
  await start.click();
  await expect(page.getByText('문맥·후속 응답 시험 완료', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.harness.probeKinds)).toEqual(['context']);
  expect(await page.evaluate(() => window.harness.sends)).toEqual([]);
  await page.reload();
  await page.getByRole('button', { name: '연결', exact: true }).first().click();
  await page.getByText('백그라운드 연결 시험', { exact: true }).click();
  expect(await page.evaluate(() => window.harness.probeStarts)).toBe(0);
});
