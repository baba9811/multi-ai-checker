import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import { providerPage } from '../fixtures/providers/pages';

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
const org = '11111111-1111-4111-8111-111111111111';
const bootstrap = {
  model_selector_state: [{ id: 'chat', model: 'claude-sonnet-fixture' }],
  model_selector_config: [
    {
      id: 'chat',
      models: [{ id: 'claude-sonnet-fixture', name: 'Sonnet fixture', section: 'main' }],
    },
  ],
  claude_ai_available_models: {
    models: [{ model_id: 'claude-sonnet-fixture', minimum_tier: 'free' }],
  },
};
async function setup(page: Page, partial = false) {
  let posts = 0;
  let saved: object | undefined;
  await page.route('https://claude.ai/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname;
    if (pathname === '/api/organizations')
      return route.fulfill({
        json: [
          { uuid: '33333333-3333-4333-8333-333333333333', capabilities: ['api'] },
          { uuid: org, capabilities: ['chat'] },
        ],
      });
    if (pathname === `/api/organizations/${org}`)
      return route.fulfill({ json: { claude_ai_bootstrap_models_config: null } });
    if (pathname === `/edge-api/bootstrap/${org}/app_start`)
      return route.fulfill({
        json: bootstrap,
      });
    if (
      pathname.startsWith(`/api/organizations/${org}/chat_conversations/`) &&
      !pathname.endsWith('/completion')
    )
      return route.fulfill({ json: saved ?? {} });
    if (pathname.endsWith('/completion')) {
      posts++;
      const body = route.request().postDataJSON();
      expect(body.prompt).toBe('Reply with CROSSCHECK_OK only.');
      expect(body.model).toBe('claude-sonnet-fixture');
      expect(body.attachments).toEqual([]);
      expect(body.files).toEqual([]);
      const human = '44444444-4444-4444-8444-444444444444';
      const assistant = '55555555-5555-4555-8555-555555555555';
      expect(human).not.toBe(body.turn_message_uuids.human_message_uuid);
      expect(assistant).not.toBe(body.turn_message_uuids.assistant_message_uuid);
      saved = {
        uuid: pathname.split('/').at(-2),
        current_leaf_message_uuid: assistant,
        model: body.model,
        chat_messages: [
          {
            uuid: human,
            sender: 'human',
            text: '',
            content: [{ type: 'text', text: body.prompt }],
            truncated: false,
            attachments: [],
            files: [],
            sync_sources: [],
          },
          {
            uuid: assistant,
            sender: 'assistant',
            parent_message_uuid: human,
            text: '',
            content: [{ type: 'text', text: 'CROSSCHECK_OK' }],
            stop_reason: 'end_turn',
            truncated: false,
            attachments: [],
            files: [],
            sync_sources: [],
          },
        ],
      };
      const events = [
        {
          type: 'message_start',
          message: {
            uuid: assistant,
            parent_uuid: human,
          },
        },
        { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } },
        {
          type: 'content_block_delta',
          index: 0,
          delta: { type: 'text_delta', text: 'CROSSCHECK_OK' },
        },
        { type: 'content_block_stop', index: 0 },
        { type: 'message_delta', delta: { stop_reason: 'end_turn' } },
        ...(partial ? [] : [{ type: 'message_stop' }]),
      ];
      return route.fulfill({
        contentType: 'text/event-stream',
        body: events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join(''),
      });
    }
    return route.fulfill({ contentType: 'text/html', body: providerPage('claude') });
  });
  await page.goto('https://claude.ai/new');
  await page.evaluate(() => {
    document.getElementById('messages')!.replaceChildren();
    const button = document.createElement('button');
    button.dataset.testid = 'model-selector-dropdown';
    const base = document.createElement('span');
    base.textContent = 'Sonnet fixture';
    const effort = document.createElement('span');
    effort.textContent = 'Medium';
    button.append(base, effort);
    button.setAttribute('aria-expanded', 'false');
    document.body.append(button);
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
  return { target: { documentId: snapshot.documentId, url: snapshot.url }, posts: () => posts };
}

test('fixed Claude probe verifies server-assigned message IDs without menu opening or repeat dispatch', async ({
  page,
  context,
}) => {
  const { target, posts } = await setup(page);
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
  const { target, posts } = await setup(page, true);
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
