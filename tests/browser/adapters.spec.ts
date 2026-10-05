import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import { providerPage, redesignedChatgptPage } from '../fixtures/providers/pages';
import { providerIds, providers, type ProviderId } from '../../src/domains/providers/model';

async function command(
  page: Page,
  message: object,
  senderUrl = 'chrome-extension://fixture/sidepanel.html',
) {
  return page.evaluate(
    ({ message, senderUrl }) =>
      new Promise<{ ok: boolean; data?: any; error?: string }>((resolve) => {
        const handler = (window as any).__bridgeHandler;
        handler(message, { id: 'fixture', url: senderUrl }, resolve);
        if (senderUrl !== 'chrome-extension://fixture/sidepanel.html')
          setTimeout(() => resolve({ ok: false, error: 'no response' }), 50);
      }),
    { message, senderUrl },
  );
}
async function setup(page: Page, provider: ProviderId, html = providerPage(provider)) {
  await page.route(`${providers[provider].origin}/**`, (route) =>
    route.fulfill({ contentType: 'text/html', body: html }),
  );
  await page.goto(providers[provider].home);
  await page.evaluate(() => {
    (window as any).chrome = {
      runtime: {
        id: 'fixture',
        getURL: (s: string) => `chrome-extension://fixture/${s}`,
        onMessage: {
          addListener: (listener: unknown) => {
            (window as any).__bridgeHandler = listener;
          },
        },
      },
    };
  });
  await page.addScriptTag({ path: path.resolve('.output/chrome-mv3/bridge.js') });
  const response = await command(page, { type: 'snapshot' });
  expect(response.ok).toBe(true);
  return response.data as { documentId: string; url: string };
}
for (const provider of providerIds) {
  test(`${provider} DOM contract: actual built bridge edits, sends once and collects a new completed response`, async ({
    page,
  }) => {
    const snapshot = await setup(page, provider);
    const send = {
      type: 'send',
      id: 'unique',
      documentId: snapshot.documentId,
      url: snapshot.url,
      prompt: '테스트 질문\n두 번째 줄',
    };
    expect((await command(page, send)).ok).toBe(true);
    expect((await command(page, send)).ok).toBe(false);
    await expect
      .poll(async () => (await command(page, { type: 'poll', id: 'unique' })).data?.status)
      .toBe('done');
    const result = await command(page, { type: 'poll', id: 'unique' });
    expect(result.data.answer).toBe(`새로운 ${provider} 검증 답변`);
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([
      '테스트 질문\n두 번째 줄',
    ]);
  });
}
test('adapter refuses existing draft, untrusted sender and changed conversation', async ({
  page,
}) => {
  const snapshot = await setup(page, 'chatgpt');
  expect((await command(page, { type: 'snapshot' }, 'https://chatgpt.com/')).error).toBe(
    'no response',
  );
  await page.locator('#prompt-textarea').fill('사용자가 작성 중인 중요한 문장');
  await command(page, {
    type: 'send',
    id: 'draft',
    documentId: snapshot.documentId,
    url: snapshot.url,
    prompt: 'replacement',
  });
  await expect
    .poll(async () => (await command(page, { type: 'poll', id: 'draft' })).data?.status)
    .toBe('error');
  await expect(page.locator('#prompt-textarea')).toHaveValue('사용자가 작성 중인 중요한 문장');
  await page.evaluate(() => history.pushState({}, '', '/c/another'));
  expect(
    (
      await command(page, {
        type: 'send',
        id: 'changed',
        documentId: snapshot.documentId,
        url: snapshot.url,
        prompt: 'replacement',
      })
    ).ok,
  ).toBe(false);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
});
test('adapter does not mistake old or unfinished output for a completed answer', async ({
  page,
}) => {
  const snapshot = await setup(page, 'chatgpt');
  await page.evaluate(() => {
    (window as any).fixtureMode = 'no-completion';
  });
  await command(page, {
    type: 'send',
    id: 'unfinished',
    documentId: snapshot.documentId,
    url: snapshot.url,
    prompt: '새 질문',
  });
  await expect(page.getByText('새로운 chatgpt 검증 답변')).toBeVisible();
  await page.clock.install();
  await page.clock.runFor(5000);
  expect((await command(page, { type: 'poll', id: 'unfinished' })).data.status).toBe('pending');
  await command(page, { type: 'cancel', id: 'unfinished' });
  expect((await command(page, { type: 'poll', id: 'unfinished' })).data.status).toBe('error');
});

test('redesigned ChatGPT imports Korean turns, recognizes editor and survives virtualized history', async ({
  page,
}) => {
  const target = await setup(page, 'chatgpt', redesignedChatgptPage());
  const snap = (await command(page, { type: 'snapshot' })).data;
  expect(snap.composer).toBe(true);
  expect(snap.lastQuestion).toBe('안녕');
  expect(snap.lastAnswer).toBe('안녕하세요. 무엇을 도와드릴까요?');
  expect(snap.diagnostics.layout).toBe('redesigned');
  expect(JSON.stringify(snap.diagnostics)).not.toContain('안녕');
  expect(
    (await command(page, { type: 'send', id: 'modern', ...target, prompt: '추가 질문' })).ok,
  ).toBe(true);
  await expect
    .poll(async () => (await command(page, { type: 'poll', id: 'modern' })).data?.status)
    .toBe('done');
  expect((await command(page, { type: 'poll', id: 'modern' })).data.answer).toBe(
    '새로운 ChatGPT 답변',
  );
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual(['추가 질문']);
});

test('ambiguous ChatGPT editors and unanswered turns are not silently imported', async ({
  page,
}) => {
  await setup(page, 'chatgpt', redesignedChatgptPage());
  await page.evaluate(() => {
    const input = document.querySelector('[contenteditable]')!;
    input.parentElement!.append(input.cloneNode(true));
    const question = document.createElement('div');
    question.dataset.messageAuthorRole = 'user';
    question.textContent = '아직 답하지 않은 질문';
    document.querySelector('section')!.append(question);
  });
  const snap = (await command(page, { type: 'snapshot' })).data;
  expect(snap.composer).toBe(false);
  expect(snap.diagnostics.composerCandidates).toBe(2);
  expect(snap.lastQuestion).toBe('아직 답하지 않은 질문');
  expect(snap.lastAnswer).toBe('');
});

test('ChatGPT fallback excludes tool rows and control text and honors visual order', async ({
  page,
}) => {
  await setup(page, 'chatgpt', redesignedChatgptPage());
  await page.evaluate(() => {
    document.querySelector('.markdown')!.className = '';
    const thread = document.querySelector('section')!;
    const tool = document.createElement('div');
    tool.dataset.chatgptSearchMessageIds = 'tool';
    tool.textContent = 'Searching the web…';
    thread.append(tool);
    // Same visual order, opposite DOM order.
    [...thread.children].reverse().forEach((child) => thread.append(child));
    (thread as HTMLElement).style.cssText = 'display:flex;flex-direction:column-reverse';
  });
  const snap = (await command(page, { type: 'snapshot' })).data;
  expect(snap.lastAnswer).toBe('안녕하세요. 무엇을 도와드릴까요?');
  expect(snap.lastAnswer).not.toContain('복사');
  expect(snap.diagnostics.answers).toBe(1);
});

for (const provider of providerIds) {
  test(`${provider} model picker reads actual menu choices, disables upgrades and confirms changes`, async ({
    page,
  }) => {
    const target = await setup(page, provider);
    const labels = {
      chatgpt: ['GPT-5 Test A', 'GPT-5 Test B'],
      claude: ['Claude Test A', 'Claude Test B'],
      gemini: ['Gemini Test A', 'Gemini Test B'],
    }[provider];
    await page.evaluate(
      ({ provider, labels }) => {
        const trigger = document.createElement('button');
        if (provider === 'chatgpt') trigger.dataset.testid = 'model-switcher-dropdown-button';
        if (provider === 'claude') trigger.dataset.testid = 'model-selector-dropdown';
        if (provider === 'gemini') trigger.setAttribute('data-test-id', 'bard-mode-menu-button');
        trigger.textContent = labels[0]!;
        trigger.setAttribute('aria-haspopup', 'menu');
        trigger.setAttribute('aria-expanded', 'false');
        const menu = document.createElement('div');
        menu.setAttribute('role', 'menu');
        menu.hidden = true;
        labels.concat(`${labels[1]} Upgrade`).forEach((label, index) => {
          const option = document.createElement('button');
          option.setAttribute('role', 'menuitemradio');
          option.textContent = label;
          if (index === 2) option.setAttribute('aria-disabled', 'true');
          option.onclick = () => {
            trigger.textContent = label;
            menu.hidden = true;
            trigger.setAttribute('aria-expanded', 'false');
          };
          menu.append(option);
        });
        trigger.onclick = () => {
          menu.hidden = !menu.hidden;
          trigger.setAttribute('aria-expanded', String(!menu.hidden));
        };
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
            menu.hidden = true;
            trigger.setAttribute('aria-expanded', 'false');
          }
        });
        document.body.prepend(trigger, menu);
      },
      { provider, labels },
    );
    const catalog = await command(page, { type: 'models', ...target });
    expect(catalog.ok).toBe(true);
    expect(catalog.data.options).toHaveLength(3);
    expect(catalog.data.options[2].disabled).toBe(true);
    await expect(page.getByRole('menu')).not.toBeVisible();
    const selected = await command(page, { type: 'selectModel', ...target, key: labels[1] });
    expect(selected.ok).toBe(true);
    expect(selected.data.current).toBe(labels[1]);
    expect(
      (await command(page, { type: 'selectModel', ...target, key: `${labels[1]} Upgrade` })).ok,
    ).toBe(false);
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  });
}

test('unsupported model UI returns no invented models and sends nothing', async ({ page }) => {
  const target = await setup(page, 'chatgpt');
  const result = await command(page, { type: 'models', ...target });
  expect(result.data.options).toEqual([]);
  expect(result.data.message).toContain('웹에서 선택한 모델');
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
});

test('new-conversation navigation is accepted once and subsequent conversation changes stop collection', async ({
  page,
}) => {
  const target = await setup(page, 'chatgpt');
  await command(page, { type: 'send', id: 'created', ...target, prompt: '새 대화 질문' });
  await expect(page.getByText('새로운 chatgpt 검증 답변')).toBeVisible();
  await page.evaluate(() => history.pushState({}, '', '/c/created'));
  await expect
    .poll(async () => (await command(page, { type: 'poll', id: 'created' })).data?.status)
    .toBe('done');
  expect((await command(page, { type: 'poll', id: 'created' })).data.url).toBe(
    'https://chatgpt.com/c/created',
  );
  await command(page, {
    type: 'send',
    id: 'next',
    documentId: target.documentId,
    url: 'https://chatgpt.com/c/created',
    prompt: '후속 질문',
  });
  await expect.poll(() => page.evaluate(() => (window as any).fixtureSent.length)).toBe(2);
  await page.evaluate(() => history.pushState({}, '', '/c/another'));
  await expect
    .poll(async () => (await command(page, { type: 'poll', id: 'next' })).data?.status)
    .toBe('error');
  expect((await command(page, { type: 'poll', id: 'next' })).data.error).toContain('대화가 변경');
});
