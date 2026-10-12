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
async function setup(page: Page, partial = false) {
  let posts = 0;
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
      return route.fulfill({
        json: {
          claude_ai_bootstrap_models_config: [
            {
              model: 'claude-sonnet-fixture',
              name: 'Sonnet fixture',
              inactive: false,
              overflow: false,
            },
          ],
        },
      });
    if (pathname.endsWith('/completion')) {
      posts++;
      const body = route.request().postDataJSON();
      expect(body.prompt).toBe('Reply with CROSSCHECK_OK only.');
      expect(body.attachments).toEqual([]);
      expect(body.files).toEqual([]);
      const events = [
        {
          type: 'message_start',
          message: {
            uuid: body.turn_message_uuids.assistant_message_uuid,
            parent_uuid: body.turn_message_uuids.human_message_uuid,
            role: 'assistant',
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
    button.textContent = 'Sonnet fixture Medium';
    document.body.append(button);
    button.onclick = () => {
      const menu = document.createElement('div');
      menu.setAttribute('role', 'menu');
      const option = document.createElement('button');
      option.setAttribute('role', 'menuitemradio');
      option.setAttribute('aria-checked', 'true');
      option.textContent = 'Sonnet fixture';
      menu.append(option);
      document.body.append(menu);
      option.onkeydown = (event) => {
        if (event.key === 'Escape') menu.remove();
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

test('fixed Claude probe collects an HTTP terminal answer without DOM sending or repeat dispatch', async ({
  page,
  context,
}) => {
  const { target, posts } = await setup(page);
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
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  expect(await other.evaluate(() => document.hasFocus())).toBe(true);
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
