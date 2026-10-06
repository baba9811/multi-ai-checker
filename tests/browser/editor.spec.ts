import { expect, test, type Page } from '@playwright/test';
import path from 'node:path';
import { providerPage } from '../fixtures/providers/pages';

async function command(page: Page, message: object) {
  return page.evaluate(
    (message) =>
      new Promise<{ ok: boolean; data?: any; error?: string }>((resolve) => {
        (window as any).__bridgeHandler(
          message,
          { id: 'fixture', url: 'chrome-extension://fixture/sidepanel.html' },
          resolve,
        );
      }),
    message,
  );
}

async function setupEditor(
  page: Page,
  edit?: 'text' | 'blank-line' | 'space',
  asyncNormalization = false,
) {
  await page.route('https://claude.ai/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: providerPage('claude') }),
  );
  await page.goto('https://claude.ai/new');
  const options = { edit, asyncNormalization };
  await page.evaluate(({ edit, asyncNormalization }) => {
    const state = window as any;
    const editor = document.querySelector<HTMLElement>('.ProseMirror')!;
    editor.dataset.testid = 'chat-input';
    state.fixtureCommands = [];
    // The live ProseMirror editor converts native inserted lines to adjacent paragraphs.
    const nativeInsert = document.execCommand.bind(document);
    document.execCommand = (name, showUI, value) => {
      state.fixtureCommands.push(name);
      const inserted = nativeInsert(name, showUI, value);
      if (inserted && name === 'insertText') {
        editor.replaceChildren(
          ...(value ?? '')
            .replace(/\r\n/g, '\n')
            .split('\n')
            .map((line) => {
              const paragraph = document.createElement('p');
              paragraph.dir = 'auto';
              if (line) paragraph.textContent = line;
              else {
                const filler = document.createElement('br');
                filler.className = 'ProseMirror-trailingBreak';
                paragraph.append(filler);
              }
              return paragraph;
            }),
        );
        if (asyncNormalization) {
          const paragraphs = [...editor.childNodes];
          const transient = document.createElement('div');
          transient.append(...paragraphs);
          editor.replaceChildren(transient);
          setTimeout(() => editor.replaceChildren(...paragraphs), 150);
          // Keep send pending so a real edit after settling must still be rejected.
          if (edit) {
            const send = document.querySelector<HTMLButtonElement>('#send')!;
            send.disabled = true;
            setTimeout(() => (send.disabled = false), 700);
          }
        }
        if (edit)
          setTimeout(
            () => {
              if (edit === 'text') editor.children[1]!.textContent = 'User changed this line';
              if (edit === 'blank-line') editor.children[2]!.remove();
              if (edit === 'space') editor.children[1]!.textContent = 'second line';
            },
            asyncNormalization ? 500 : 100,
          );
      }
      return inserted;
    };
    const send = document.querySelector<HTMLButtonElement>('#send')!;
    const originalSend = send.onclick!;
    send.onclick = function (event) {
      const paragraphs = [...editor.children].map((node) => node.cloneNode(true));
      state.fixtureSubmittedLines = paragraphs.map((node) => node.textContent);
      state.fixtureRenderedInput = editor.innerText;
      originalSend.call(this, event);
      // Preserve the actual paragraph structure in the posted user message too.
      document
        .querySelectorAll('[data-testid="user-message"]')
        .item(1)
        .replaceChildren(...paragraphs);
    };
    state.chrome = {
      runtime: {
        id: 'fixture',
        getURL: (file: string) => `chrome-extension://fixture/${file}`,
        onMessage: { addListener: (handler: unknown) => (state.__bridgeHandler = handler) },
      },
    };
  }, options);
  await page.addScriptTag({ path: path.resolve('.output/chrome-mv3/bridge.js') });
  const snapshot = await command(page, { type: 'snapshot' });
  return snapshot.data as { documentId: string; url: string };
}

const prompt = 'first line\nsecond  line\n\n  {"literal": "<b>not HTML</b>"}\nlast line';

test('Claude waits for asynchronous paragraph normalization before exact comparison', async ({
  page,
}) => {
  const target = await setupEditor(page, undefined, true);
  await command(page, { type: 'send', id: 'async-paragraphs', ...target, prompt });
  await expect
    .poll(async () => {
      const result = (await command(page, { type: 'poll', id: 'async-paragraphs' })).data;
      return result.status === 'error' ? result.error : result.status;
    })
    .toBe('done');
  expect(await page.evaluate(() => (window as any).fixtureSubmittedLines)).toEqual(
    prompt.split('\n'),
  );
  expect(await page.evaluate(() => (window as any).fixtureCommands)).toEqual(['insertText']);
});

for (const edit of ['text', 'blank-line', 'space'] as const) {
  test(`Claude refuses a postsettling ${edit} edit after asynchronous normalization`, async ({
    page,
  }) => {
    const target = await setupEditor(page, edit, true);
    await command(page, { type: 'send', id: 'async-edited', ...target, prompt });
    await expect
      .poll(async () => (await command(page, { type: 'poll', id: 'async-edited' })).data?.error)
      .toContain('입력 내용이 달라져');
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  });
}

test('Claude paragraph editor preserves exact prompt lines and collects the matching answer', async ({
  page,
}) => {
  const target = await setupEditor(page);
  expect((await command(page, { type: 'send', id: 'paragraphs', ...target, prompt })).ok).toBe(
    true,
  );
  await expect
    .poll(async () => (await command(page, { type: 'poll', id: 'paragraphs' })).data?.status)
    .toBe('done');
  expect(await page.evaluate(() => (window as any).fixtureSubmittedLines)).toEqual(
    prompt.split('\n'),
  );
  expect(await page.evaluate(() => (window as any).fixtureRenderedInput)).not.toBe(prompt);
  expect(await page.evaluate(() => (window as any).fixtureCommands)).toEqual(['insertText']);
  await expect(page.locator('[data-testid="user-message"] b')).toHaveCount(0);
  expect((await command(page, { type: 'poll', id: 'paragraphs' })).data.answer).toBe(
    '새로운 claude 검증 답변',
  );
});

for (const edit of ['text', 'blank-line', 'space'] as const) {
  test(`Claude paragraph editor refuses a concurrent ${edit} edit`, async ({ page }) => {
    const target = await setupEditor(page, edit);
    await command(page, { type: 'send', id: edit, ...target, prompt });
    await expect
      .poll(async () => (await command(page, { type: 'poll', id: edit })).data?.error)
      .toContain('입력 내용이 달라져');
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  });
}
