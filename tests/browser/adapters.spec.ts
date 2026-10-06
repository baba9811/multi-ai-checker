import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import { providerPage, redesignedChatgptPage } from '../fixtures/providers/pages';
import { providerIds, providers, type ProviderId } from '../../src/domains/providers/model';
import { createHash } from 'node:crypto';

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

async function quillParagraphs(page: Page, inlineBreak = false) {
  const target = await setup(page, 'gemini');
  await page.evaluate((inlineBreak) => {
    const editor = document.querySelector<HTMLElement>('.ql-editor')!;
    const edit = document.execCommand.bind(document);
    document.execCommand = (command, showUI, value) => {
      const result = edit(command, showUI, value);
      if (command !== 'insertText') return result;
      // Native multi-line insertion emits one input event per line; model the site's final value.
      const lines = value!.split('\n');
      editor.replaceChildren(
        ...lines.map((line) => {
          const paragraph = document.createElement('p');
          if (line) paragraph.textContent = line;
          else paragraph.append(document.createElement('br'));
          return paragraph;
        }),
      );
      if (inlineBreak) {
        const code = editor.children[2]!;
        const line = editor.children[3]!;
        code.append(document.createElement('br'), ...line.childNodes);
        line.remove();
      }
      return result;
    };
    document.getElementById('send')!.onclick = () => {
      // The synthetic service consumes Quill's paragraph value, not its display spacing.
      const text = [...editor.children]
        .map((paragraph) =>
          paragraph.childNodes.length === 1 && paragraph.firstChild instanceof HTMLBRElement
            ? ''
            : [...paragraph.childNodes]
                .map((node) => (node instanceof HTMLBRElement ? '\n' : node.textContent))
                .join(''),
        )
        .join('\n');
      (window as any).fixtureSent.push(text);
      (window as any).user(text);
      editor.replaceChildren();
      (window as any).assistant('새로운 gemini 검증 답변');
    };
  }, inlineBreak);
  return target;
}
const paragraphPrompt = '한국어 질문\n\n코드:\n    const  value = 1;\n\n끝';

for (const question of ['matching', 'mismatched', 'duplicate']) {
  test(`Gemini question labels preserve the ${question} actual question boundary`, async ({
    page,
  }) => {
    const target = await quillParagraphs(page);
    await page.evaluate((question) => {
      const state = window as any;
      const decorate = (query: Element, text: string) => {
        const label = document.createElement('h5');
        label.className = 'cdk-visually-hidden screen-reader-user-query-label';
        label.style.cssText = 'position:absolute;width:1px;height:1px;clip-path:inset(50%)';
        label.textContent = `말씀하신 내용 ${text.slice(0, 20)}`;
        query.replaceChildren(
          label,
          ...text.split('\n').map((line) => {
            const paragraph = document.createElement('p');
            paragraph.className = 'query-text-line';
            paragraph.textContent = line;
            return paragraph;
          }),
        );
      };
      document
        .querySelectorAll('.query-text')
        .forEach((query) => decorate(query, query.textContent!));
      const user = state.user;
      state.user = (text: string) => {
        user(text);
        const query = [...document.querySelectorAll('.query-text')].at(-1)!;
        decorate(query, question === 'mismatched' ? `${text} changed` : text);
        if (question === 'duplicate') user(text);
      };
      const assistant = state.assistant;
      state.assistant = (text: string) => {
        assistant(text);
        const heading = document.createElement('h5');
        heading.textContent = text;
        [...document.querySelectorAll('.model-response-text')].at(-1)!.replaceChildren(heading);
      };
    }, question);
    await command(page, { type: 'send', id: 'query-label', ...target, prompt: paragraphPrompt });
    await expect
      .poll(async () => {
        const result = (await command(page, { type: 'poll', id: 'query-label' })).data;
        return result.status === 'error' && question === 'matching' ? result.error : result.status;
      })
      .toBe(question === 'matching' ? 'done' : 'error');
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([paragraphPrompt]);
    if (question === 'matching') {
      expect((await command(page, { type: 'poll', id: 'query-label' })).data.answer).toBe(
        '새로운 gemini 검증 답변',
      );
      const snapshot = (await command(page, { type: 'snapshot' })).data;
      expect(snapshot.lastQuestion).toBe(paragraphPrompt);
      expect(snapshot.context.turns.map((turn: { question: string }) => turn.question)).toEqual([
        '기존 질문',
        paragraphPrompt,
      ]);
    } else
      expect((await command(page, { type: 'poll', id: 'query-label' })).data.error).toContain(
        '대화 내용이 바뀌어',
      );
  });
}

for (const inlineBreak of [false, true]) {
  test(`Gemini Quill paragraphs preserve blank lines, Korean and code spacing through collection (inline BR: ${inlineBreak})`, async ({
    page,
  }) => {
    const target = await quillParagraphs(page, inlineBreak);
    await command(page, { type: 'send', id: 'quill', ...target, prompt: paragraphPrompt });
    await expect
      .poll(async () => {
        const result = (await command(page, { type: 'poll', id: 'quill' })).data;
        return result.status === 'error' ? result.error : result.status;
      })
      .toBe('done');
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([paragraphPrompt]);
  });
}

test('Claude waits for a delayed enabled send control, sends once and collects completion', async ({
  page,
}) => {
  const target = await setup(page, 'claude');
  await page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>('#send')!;
    button.disabled = true;
    document.querySelector('[contenteditable]')!.addEventListener('input', () => {
      setTimeout(() => (button.disabled = false), 700);
    });
  });
  await command(page, {
    type: 'send',
    id: 'delayed-ready',
    ...target,
    prompt: 'Delayed readiness',
  });
  await expect
    .poll(async () => {
      const result = (await command(page, { type: 'poll', id: 'delayed-ready' })).data;
      return result.status === 'error' ? result.error : result.status;
    })
    .toBe('done');
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual(['Delayed readiness']);
});

for (const edit of ['text', 'newline', 'spacing']) {
  test(`Gemini Quill refuses a concurrent ${edit} edit while waiting for send readiness`, async ({
    page,
  }) => {
    const target = await quillParagraphs(page);
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(1000);
    await page.evaluate((edit) => {
      const editor = document.querySelector<HTMLElement>('.ql-editor')!;
      const button = document.querySelector<HTMLButtonElement>('#send')!;
      button.disabled = true;
      editor.addEventListener(
        'input',
        () => {
          setTimeout(() => {
            if (edit === 'newline') editor.children[1]!.remove();
            else if (edit === 'spacing') editor.children[3]!.textContent = '    const value = 1;';
            else editor.children[0]!.textContent = '사용자 변경';
            button.disabled = false;
          }, 700);
        },
        { once: true },
      );
    }, edit);
    await command(page, { type: 'send', id: 'edited-quill', ...target, prompt: paragraphPrompt });
    await page.clock.runFor(3000);
    const result = (await command(page, { type: 'poll', id: 'edited-quill' })).data;
    expect(result.status).toBe('error');
    expect(result.error).toContain('입력 내용이 달라져');
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  });
}

for (const unsafe of [
  'missing',
  'disabled',
  'aria-disabled',
  'duplicate-button',
  'duplicate-editor',
  'changed-editor',
  'busy',
  'files',
  'cancel',
  'changed-url',
]) {
  test(`send readiness refuses ${unsafe} without clicking`, async ({ page }) => {
    const target = await setupUpload(page, 'claude');
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(1000);
    await page.evaluate((unsafe) => {
      const editor = document.querySelector<HTMLElement>('[contenteditable]')!;
      const button = document.querySelector<HTMLButtonElement>('#send')!;
      button.disabled = true;
      editor.addEventListener('input', () => {
        setTimeout(() => {
          button.disabled = unsafe === 'disabled';
          if (unsafe === 'missing') button.remove();
          if (unsafe === 'aria-disabled') button.setAttribute('aria-disabled', 'true');
          if (unsafe === 'duplicate-button') button.after(button.cloneNode(true));
          if (unsafe === 'duplicate-editor') editor.after(editor.cloneNode(true));
          if (unsafe === 'changed-editor') editor.replaceWith(editor.cloneNode(true));
          if (unsafe === 'busy') {
            const stop = document.createElement('button');
            stop.setAttribute('aria-label', 'Stop response');
            stop.textContent = 'Stop';
            document.body.append(stop);
          }
          if (unsafe === 'files') (window as any).fixtureExistingFile();
          if (unsafe === 'changed-url') history.pushState({}, '', '/chat/changed');
        }, 700);
      });
    }, unsafe);
    await command(page, { type: 'send', id: 'unsafe-ready', ...target, prompt: 'Readiness guard' });
    await page.clock.runFor(450);
    if (unsafe === 'cancel') await command(page, { type: 'cancel', id: 'unsafe-ready' });
    await page.clock.runFor(3000);
    expect((await command(page, { type: 'poll', id: 'unsafe-ready' })).data.status).toBe('error');
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  });
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

// Original file bytes are synthetic; the GIF is a complete, decodable one-pixel image.
const uploadImage = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64',
);
function uploadPayload(name: string, type: string, bytes: Buffer) {
  return {
    name,
    type,
    size: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    base64: bytes.toString('base64'),
  };
}
const uploadOriginals = [
  uploadPayload('facts.txt', 'text/plain', Buffer.from('unchanged original')),
  uploadPayload('diagram.gif', 'image/gif', uploadImage),
];

async function setupUpload(
  page: Page,
  provider: ProviderId,
  mode: 'hold' | 'normal' | 'failure' = 'normal',
) {
  const target = await setup(page, provider);
  await page.evaluate(
    ({ provider, mode, imageBase64 }) => {
      const state = window as any;
      state.fixtureUploads = [];
      state.fixtureUploadMode = mode;
      state.fixtureMenuOpenings = 0;
      state.fixtureReplacedAttachment = false;
      const editor = document.querySelector<HTMLElement>('textarea,[contenteditable]')!;
      const root = document.createElement(provider === 'chatgpt' ? 'form' : 'div');
      root.addEventListener('submit', (event) => event.preventDefault());
      if (provider === 'claude') root.setAttribute('data-tap-focuses-field', '');
      if (provider === 'gemini') root.setAttribute('xapfileselectordropzone', '');
      // Retain rich-textarea so Gemini's actual editor selector remains valid.
      const composer = provider === 'gemini' ? editor.closest('rich-textarea')! : editor;
      composer.before(root);
      root.append(composer, document.querySelector('#send')!);
      const attachments = document.createElement('div');
      attachments.dataset.fixtureAttachments = '';
      if (provider === 'chatgpt') attachments.setAttribute('data-composer-attachments', '');
      root.append(attachments);
      const appendTile = (file: File) => {
        const tile = document.createElement(provider === 'gemini' ? 'mat-basic-chip' : 'div');
        tile.style.display = 'inline-block';
        if (provider === 'claude') tile.dataset.testid = 'file-thumbnail';
        const content = provider === 'gemini' ? document.createElement('div') : tile;
        if (provider === 'gemini') content.className = 'gem-attachment-content';
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.textContent = '×';
        if (provider === 'gemini') {
          remove.className = 'gem-attachment-close-button';
          if (file.type.startsWith('image/')) {
            const image = document.createElement('img');
            image.className = 'gem-attachment-style-img';
            image.alt = 'attachment';
            image.src = URL.createObjectURL(file);
            tile.append(image);
            remove.setAttribute('aria-label', '첨부파일 닫기');
          } else {
            const stem = file.name.replace(/\.[^.]+$/, '');
            const title = document.createElement('span');
            title.className = 'gem-attachment-text';
            title.textContent = stem;
            const extension = document.createElement('span');
            extension.className = 'gem-attachment-extension-label';
            extension.textContent = file.name.split('.').at(-1)!;
            content.append(extension, title);
            remove.setAttribute('aria-label', `close ${stem}`);
          }
        } else {
          remove.setAttribute(
            'aria-label',
            `Remove ${state.fixtureDisplayNames?.[file.name] ?? file.name}`,
          );
          if (provider === 'claude') remove.setAttribute('data-cds-attachment-remove', '');
        }
        content.append(remove);
        if (provider === 'gemini') tile.append(content);
        remove.onclick = () => tile.remove();
        attachments.append(tile);
      };
      const addInput = (parent: HTMLElement, images = false) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        if (provider === 'chatgpt') input.setAttribute('aria-label', 'Attach files');
        if (provider === 'claude') input.dataset.testid = 'file-upload';
        if (images) input.accept = 'image/*';
        input.onchange = async () => {
          const files = [...input.files!];
          root.querySelector('[data-fixture-upload-menu]')?.remove();
          const originals = await Promise.all(
            files.map(async (file) => {
              const bytes = new Uint8Array(await file.arrayBuffer());
              return {
                name: file.name,
                type: file.type,
                size: file.size,
                base64: btoa(String.fromCharCode(...bytes)),
              };
            }),
          );
          state.fixtureUploads.push(originals);
          files.forEach(appendTile);
          const progress = document.createElement('div');
          progress.setAttribute('role', 'progressbar');
          progress.textContent = 'Uploading originals';
          attachments.append(progress);
          if (state.fixtureUploadMode === 'failure')
            setTimeout(() => {
              progress.remove();
              const alert = document.createElement('div');
              alert.setAttribute('role', 'alert');
              alert.textContent = 'Upload failed. The file could not be processed.';
              attachments.append(alert);
            }, 200);
          if (state.fixtureUploadMode === 'normal') setTimeout(() => progress.remove(), 200);
        };
        parent.append(input);
      };
      if (provider === 'gemini') {
        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.setAttribute('aria-label', '업로드 및 도구');
        trigger.textContent = 'Upload and tools';
        trigger.onclick = () => {
          state.fixtureMenuOpenings += 1;
          const menu = document.createElement('div');
          menu.dataset.fixtureUploadMenu = '';
          const documents = document.createElement('images-files-uploader');
          const images = document.createElement('uploader');
          addInput(documents);
          addInput(images, true);
          menu.append(documents, images);
          root.append(menu);
        };
        root.append(trigger);
      } else addInput(root);
      state.fixtureFinishUploads = () => {
        state.fixtureUploadMode = 'normal';
        root.querySelectorAll('[role="progressbar"]').forEach((progress) => progress.remove());
      };
      state.fixtureExistingFile = () =>
        appendTile(
          new File(
            [Uint8Array.from(atob(imageBase64), (value) => value.charCodeAt(0))],
            'user-draft.gif',
            { type: 'image/gif' },
          ),
        );
      state.fixtureReplaceOnPrompt = () =>
        editor.addEventListener(
          'input',
          () => {
            const tile = attachments.querySelector(
              provider === 'gemini' ? '.gem-attachment-content' : 'button',
            )!;
            tile.replaceWith(tile.cloneNode(true));
            state.fixtureReplacedAttachment = true;
          },
          { once: true },
        );
    },
    { provider, mode, imageBase64: uploadImage.toString('base64') },
  );
  return target;
}

test('Gemini selects the direct document input and ignores its nested legacy file chooser', async ({
  page,
}) => {
  const target = await setupUpload(page, 'gemini');
  await page.evaluate(() => {
    document.querySelector('button[aria-label="업로드 및 도구"]')!.addEventListener('click', () => {
      const documents = document.querySelector('images-files-uploader')!;
      const nested = document.createElement('div');
      const other = document.createElement('input');
      other.type = 'file';
      other.name = 'Filedata';
      other.setAttribute('aria-hidden', 'true');
      other.onchange = () => {
        (window as any).wrongUploaderUsed = true;
      };
      nested.append(other);
      documents.append(nested);
    });
  });
  await command(page, {
    type: 'send',
    id: 'nested-upload',
    ...target,
    prompt: 'Review originals',
    attachments: uploadOriginals,
  });
  await expect
    .poll(async () => (await command(page, { type: 'poll', id: 'nested-upload' })).data?.status, {
      timeout: 10000,
    })
    .toBe('done');
  expect(await page.evaluate(() => (window as any).fixtureUploads.flat())).toEqual(
    uploadOriginals.map(({ sha256: _, ...file }) => file),
  );
  expect(await page.evaluate(() => (window as any).wrongUploaderUsed)).toBeUndefined();
});

for (const provider of providerIds) {
  test(`${provider} uploads exact text and image originals and waits for every spinner`, async ({
    page,
  }) => {
    const target = await setupUpload(page, provider, 'hold');
    await page.clock.install();
    await command(page, {
      type: 'send',
      id: 'originals',
      ...target,
      prompt: 'Review selected originals',
      attachments: uploadOriginals,
    });
    await expect(page.getByRole('progressbar')).toBeVisible();
    // Advance past both readiness stability and prompt settling while upload stays pending.
    await page.clock.runFor(1800);
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
    expect((await command(page, { type: 'poll', id: 'originals' })).data.status).toBe('pending');
    await page.evaluate(() => (window as any).fixtureFinishUploads());
    await expect
      .poll(async () => (await command(page, { type: 'poll', id: 'originals' })).data?.status, {
        timeout: 10000,
      })
      .toBe('done');
    const uploaded = await page.evaluate(() => (window as any).fixtureUploads.flat());
    expect(uploaded).toEqual(uploadOriginals.map(({ sha256: _, ...file }) => file));
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([
      'Review selected originals',
    ]);
    if (provider === 'gemini')
      expect(await page.evaluate(() => (window as any).fixtureMenuOpenings)).toBe(2);
  });

  test(`${provider} does not send after progress becomes an upload failure`, async ({ page }) => {
    const target = await setupUpload(page, provider, 'failure');
    await command(page, {
      type: 'send',
      id: 'failed-upload',
      ...target,
      prompt: 'Must not send',
      attachments: uploadOriginals,
    });
    await expect(page.getByRole('alert')).toContainText('Upload failed');
    await expect(page.getByRole('progressbar')).toHaveCount(0);
    await expect
      .poll(async () => (await command(page, { type: 'poll', id: 'failed-upload' })).data?.status)
      .toBe('error');
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  });

  test(`${provider} preserves an existing file draft without uploading originals`, async ({
    page,
  }) => {
    const target = await setupUpload(page, provider);
    await page.evaluate(() => (window as any).fixtureExistingFile());
    expect((await command(page, { type: 'snapshot' })).data.draft).toBe(true);
    await command(page, {
      type: 'send',
      id: 'file-draft',
      ...target,
      prompt: 'Must not send',
      attachments: uploadOriginals,
    });
    await expect
      .poll(async () => (await command(page, { type: 'poll', id: 'file-draft' })).data?.status)
      .toBe('error');
    expect(await page.evaluate(() => (window as any).fixtureUploads)).toEqual([]);
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
    expect((await command(page, { type: 'snapshot' })).data.draft).toBe(true);
  });

  test(`${provider} refuses a same-name attachment tile replaced during prompt settling`, async ({
    page,
  }) => {
    const target = await setupUpload(page, provider);
    await page.evaluate(() => (window as any).fixtureReplaceOnPrompt());
    await command(page, {
      type: 'send',
      id: 'replaced-file',
      ...target,
      prompt: 'Must not send',
      attachments: [uploadOriginals[0]!],
    });
    await expect
      .poll(async () => (await command(page, { type: 'poll', id: 'replaced-file' })).data?.status)
      .toBe('error');
    expect(await page.evaluate(() => (window as any).fixtureReplacedAttachment)).toBe(true);
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  });
}

test('a mismatched original hash fails before files reach the provider', async ({ page }) => {
  const target = await setupUpload(page, 'chatgpt');
  await command(page, {
    type: 'send',
    id: 'bad-hash',
    ...target,
    prompt: 'Must not send',
    attachments: [{ ...uploadOriginals[0], sha256: '0'.repeat(64) }],
  });
  await expect
    .poll(async () => (await command(page, { type: 'poll', id: 'bad-hash' })).data?.status)
    .toBe('error');
  expect((await command(page, { type: 'poll', id: 'bad-hash' })).data.error).toContain('원본 검증');
  expect(await page.evaluate(() => (window as any).fixtureUploads)).toEqual([]);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
});

for (const phase of ['hash', 'upload'] as const) {
  test(`an unowned file change during ${phase} invalidates the pending send`, async ({ page }) => {
    const target = await setupUpload(page, 'chatgpt', 'hold');
    if (phase === 'hash')
      await page.evaluate(() => {
        const state = window as any;
        const digest = crypto.subtle.digest.bind(crypto.subtle);
        crypto.subtle.digest = async (...args: Parameters<SubtleCrypto['digest']>) => {
          state.fixtureHashStarted = true;
          await new Promise<void>((resolve) => {
            state.fixtureReleaseHash = resolve;
          });
          return digest(...args);
        };
      });
    await command(page, {
      type: 'send',
      id: `changed-${phase}`,
      ...target,
      prompt: 'Must not send',
      attachments: [uploadOriginals[0]!],
    });
    if (phase === 'hash')
      await expect.poll(() => page.evaluate(() => (window as any).fixtureHashStarted)).toBe(true);
    else await expect(page.getByRole('progressbar')).toBeVisible();
    await page.evaluate(() => {
      const input = document.querySelector<HTMLInputElement>('input[type="file"]')!;
      const transfer = new DataTransfer();
      transfer.items.add(new File(['user replacement bytes'], 'facts.txt', { type: 'text/plain' }));
      input.files = transfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      (window as any).fixtureReleaseHash?.();
    });
    await expect
      .poll(
        async () => (await command(page, { type: 'poll', id: `changed-${phase}` })).data?.status,
      )
      .toBe('error');
    await expect
      .poll(() => page.evaluate(() => (window as any).fixtureUploads.length))
      .toBe(phase === 'hash' ? 1 : 2);
    const last = await page.evaluate(() => (window as any).fixtureUploads.at(-1));
    expect(last).toEqual([
      {
        name: 'facts.txt',
        type: 'text/plain',
        size: Buffer.byteLength('user replacement bytes'),
        base64: Buffer.from('user replacement bytes').toString('base64'),
      },
    ]);
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  });
}

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
  expect((await command(page, { type: 'snapshot' })).data.lastAnswer).toBe('');
});

test('replacing the editor while preparing a send never submits the new draft', async ({
  page,
}) => {
  const target = await setup(page, 'chatgpt');
  await page.evaluate(() => {
    const input = document.querySelector('#prompt-textarea')!;
    input.addEventListener(
      'input',
      () => {
        const replacement = input.cloneNode() as HTMLTextAreaElement;
        replacement.value = 'User draft in replacement editor';
        input.replaceWith(replacement);
      },
      { once: true },
    );
  });
  await command(page, { type: 'send', id: 'replaced', ...target, prompt: 'Review prompt' });
  await expect
    .poll(async () => (await command(page, { type: 'poll', id: 'replaced' })).data?.status)
    .toBe('error');
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  await expect(page.locator('#prompt-textarea')).toHaveValue('User draft in replacement editor');
});

for (const provider of ['claude', 'gemini'] as const) {
  test(`${provider} refuses distinct editors across selector alternatives`, async ({ page }) => {
    await setup(page, provider);
    await page.evaluate((provider) => {
      const second = document.createElement('div');
      second.contentEditable = 'true';
      second.className = provider === 'claude' ? 'ProseMirror' : 'ql-editor';
      document.body.append(second);
    }, provider);
    const response = await command(page, { type: 'snapshot' });
    expect(response.ok && response.data.composer).toBeFalsy();
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  });
}

test('current ChatGPT Send control submits once and collects completion', async ({ page }) => {
  const target = await setup(page, 'chatgpt');
  await page.locator('#send').evaluate((button) => {
    button.removeAttribute('data-testid');
    button.setAttribute('aria-label', 'Send');
    button.setAttribute('type', 'submit');
  });
  await command(page, { type: 'send', id: 'current-send', ...target, prompt: 'Test current Send' });
  await expect
    .poll(async () => (await command(page, { type: 'poll', id: 'current-send' })).data?.status)
    .toBe('done');
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual(['Test current Send']);
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
for (const provider of providerIds) {
  test(`${provider} captures ordered complete multi-turn context and rejects incomplete sequence`, async ({
    page,
  }) => {
    await setup(page, provider);
    await page.evaluate(() => {
      (window as any).user('두 번째 질문');
      (window as any).assistant('두 번째 답변');
    });
    const context = (await command(page, { type: 'snapshot' })).data.context;
    expect(context.turns).toEqual([
      { question: '기존 질문', answer: '과거 답변 — 새 답변으로 수집하면 안 됨' },
      { question: '두 번째 질문', answer: '두 번째 답변' },
    ]);
    await page.evaluate(() => (window as any).user('미완료 질문'));
    expect((await command(page, { type: 'snapshot' })).data.context.error).toBeTruthy();
  });
}
test('ChatGPT refuses detectable unloaded history by observed fallback turn index', async ({
  page,
}) => {
  await setup(page, 'chatgpt', redesignedChatgptPage());
  await page
    .locator('[data-chatgpt-search-message-ids]')
    .first()
    .evaluate((element) =>
      element.setAttribute('data-chatgpt-search-unit-key', 'fallback-turn-2:0:user'),
    );
  expect((await command(page, { type: 'snapshot' })).data.context.error).toContain('이전 대화');
});
test('ChatGPT captures fully represented keyed history without inventing unrelated turns', async ({
  page,
}) => {
  await setup(page, 'chatgpt', redesignedChatgptPage());
  await page.evaluate(() => {
    document
      .querySelectorAll('[data-chatgpt-search-message-ids]')
      .forEach((element, index) =>
        element.setAttribute(
          'data-chatgpt-search-unit-key',
          `fallback-turn-0:${index ? 2 : 0}:${index ? 'assistant' : 'user'}`,
        ),
      );
    const unrelated = document.createElement('aside');
    unrelated.setAttribute('data-chatgpt-search-unit-key', 'fallback-turn-99:0:user');
    document.body.append(unrelated);
    const tool = document.createElement('div');
    tool.setAttribute('data-chatgpt-search-unit-key', 'fallback-turn-0:1:tool');
    document.querySelector('section')!.append(tool);
  });
  const context = (await command(page, { type: 'snapshot' })).data.context;
  expect(context.error).toBeUndefined();
  expect(context.turns).toEqual([{ question: '안녕', answer: '안녕하세요. 무엇을 도와드릴까요?' }]);
});

for (const omitted of ['hidden', 'inert', 'aria-hidden']) {
  for (const position of ['earlier', 'later']) {
    test(`ChatGPT rejects ${omitted} ${position} keyed history retained in the DOM`, async ({
      page,
    }) => {
      await setup(page, 'chatgpt', redesignedChatgptPage());
      await page.evaluate(
        ({ omitted, position }) => {
          const thread = document.querySelector('section')!;
          const old = [...thread.children];
          const later = old.map((element) => element.cloneNode(true) as HTMLElement);
          later.forEach((element) => thread.append(element));
          [...thread.querySelectorAll('[data-chatgpt-search-message-ids]')].forEach(
            (element, index) =>
              element.setAttribute(
                'data-chatgpt-search-unit-key',
                `fallback-turn-${Math.floor(index / 2)}:${index % 2 ? 2 : 0}:${index % 2 ? 'assistant' : 'user'}`,
              ),
          );
          (position === 'earlier' ? old : later).forEach((element) =>
            element.setAttribute(omitted, omitted === 'aria-hidden' ? 'true' : ''),
          );
        },
        { omitted, position },
      );
      expect((await command(page, { type: 'snapshot' })).data.context.error).toContain('이전 대화');
    });
  }
}

async function claudeSiblingToolbar(page: Page) {
  const target = await setup(page, 'claude');
  await page.evaluate(() => {
    const state = window as any;
    const move = () => {
      const stream = document.querySelector('[data-is-streaming]:last-child')!;
      const turn = document.createElement('div');
      turn.setAttribute('role', 'article');
      turn.dataset.testid = 'transcript-row';
      stream.replaceWith(turn);
      turn.append(stream);
      const copy = stream.querySelector('button')!;
      copy.dataset.testid = 'action-bar-copy';
      turn.append(copy);
    };
    move();
    const assistant = state.assistant;
    state.assistant = (text: string, complete = true) => {
      assistant(text, complete);
      if (complete) move();
    };
  });
  return target;
}
test('Claude collects completion from its sibling toolbar inside an isolated article turn', async ({
  page,
}) => {
  const target = await claudeSiblingToolbar(page);
  expect((await command(page, { type: 'snapshot' })).data.lastAnswer).toContain('과거 답변');
  await command(page, {
    type: 'send',
    id: 'sibling-toolbar',
    ...target,
    prompt: 'New synthetic question',
  });
  await expect
    .poll(async () => (await command(page, { type: 'poll', id: 'sibling-toolbar' })).data.status)
    .toBe('done');
  expect((await command(page, { type: 'poll', id: 'sibling-toolbar' })).data.answer).toBe(
    '새로운 claude 검증 답변',
  );
});
for (const unsafe of ['previous-turn', 'multiple-replies', 'hidden-replies', 'streaming']) {
  test(`Claude sibling toolbar rejects ${unsafe} completion`, async ({ page }) => {
    await claudeSiblingToolbar(page);
    await page.evaluate((unsafe) => {
      const turn = document.querySelector('[role="article"]')!;
      const stream = turn.querySelector('[data-is-streaming]')!;
      if (unsafe === 'streaming') stream.setAttribute('data-is-streaming', 'true');
      if (unsafe === 'multiple-replies' || unsafe === 'hidden-replies') {
        const additional = stream
          .querySelector('.font-claude-response')!
          .cloneNode(true) as HTMLElement;
        additional.hidden = unsafe === 'hidden-replies';
        stream.append(additional);
      }
      if (unsafe === 'previous-turn') {
        const later = turn.cloneNode(true) as HTMLElement;
        later.querySelector('button')!.remove();
        document.getElementById('messages')!.append(later);
      }
    }, unsafe);
    expect((await command(page, { type: 'snapshot' })).data.lastAnswer).toBe('');
  });
}

test('ChatGPT accepts unambiguous duplicate counters while uploading unchanged originals', async ({
  page,
}) => {
  // Control the bridge collector interval from its creation, before navigation/injection.
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  const target = await setupUpload(page, 'chatgpt', 'hold');
  await page.evaluate(() => {
    (window as any).fixtureDisplayNames = {
      'facts.txt': 'facts(1).txt',
      'diagram.gif': 'diagram(1).gif',
    };
  });
  await command(page, {
    type: 'send',
    id: 'renamed',
    ...target,
    prompt: 'Review selected originals',
    attachments: uploadOriginals,
  });
  await expect(page.getByRole('progressbar')).toBeVisible();
  await page.evaluate(() => (window as any).fixtureFinishUploads());
  await page.clock.runFor(6000);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([
    'Review selected originals',
  ]);
  expect((await command(page, { type: 'poll', id: 'renamed' })).data.status).toBe('done');
  expect(await page.evaluate(() => (window as any).fixtureUploads.flat())).toEqual(
    uploadOriginals.map(({ sha256: _, ...file }) => file),
  );
});

for (const names of [
  ['facts(01).txt', 'diagram(1).gif'],
  ['facts (1).txt', 'diagram(1).gif'],
  ['facts(1).csv', 'diagram(1).gif'],
  ['other(1).txt', 'diagram(1).gif'],
  ['facts(1).txt', 'facts(2).txt'],
  ['facts(1).txt'],
  ['facts(1).txt', 'diagram(1).gif', 'extra.txt'],
]) {
  test(`ChatGPT rejects missing, extra or unmatched display names ${JSON.stringify(names)}`, async ({
    page,
  }) => {
    const target = await setupUpload(page, 'chatgpt', 'hold');
    await page.clock.install();
    await page.clock.pauseAt(new Date(Date.now() + 1000));
    await command(page, {
      type: 'send',
      id: 'bad-names',
      ...target,
      prompt: 'Must not send',
      attachments: uploadOriginals,
    });
    await expect(page.getByRole('progressbar')).toBeVisible();
    await page.evaluate((names) => {
      const root = document.querySelector('[data-composer-attachments]')!;
      root.querySelectorAll('button').forEach((button) => button.remove());
      names.forEach((name) => {
        const button = document.createElement('button');
        button.setAttribute('aria-label', `Remove ${name}`);
        root.append(button);
      });
      (window as any).fixtureFinishUploads();
    }, names);
    await page.clock.runFor(2500);
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
    expect((await command(page, { type: 'poll', id: 'bad-names' })).data.status).toBe('pending');
    await command(page, { type: 'cancel', id: 'bad-names' });
  });
}

test('ChatGPT rejects a counter colliding with another original filename', async ({ page }) => {
  const target = await setupUpload(page, 'chatgpt', 'hold');
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page.evaluate(() => {
    (window as any).fixtureDisplayNames = {
      'facts.txt': 'facts(1).txt',
      'facts(1).txt': 'facts(2).txt',
    };
  });
  await command(page, {
    type: 'send',
    id: 'collision',
    ...target,
    prompt: 'Must not send',
    attachments: [uploadOriginals[0]!, { ...uploadOriginals[0]!, name: 'facts(1).txt' }],
  });
  await expect(page.getByRole('progressbar')).toBeVisible();
  await page.evaluate(() => (window as any).fixtureFinishUploads());
  await page.clock.runFor(2500);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  expect((await command(page, { type: 'poll', id: 'collision' })).data.status).toBe('pending');
  await command(page, { type: 'cancel', id: 'collision' });
});

test('ChatGPT rejects the same attachment tile when its confirmed counter changes', async ({
  page,
}) => {
  const target = await setupUpload(page, 'chatgpt', 'hold');
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page.evaluate(() => {
    (window as any).fixtureDisplayNames = { 'facts.txt': 'facts(1).txt' };
    document.querySelector('textarea,[contenteditable]')!.addEventListener(
      'input',
      () => {
        document
          .querySelector('[data-composer-attachments] button')!
          .setAttribute('aria-label', 'Remove facts(2).txt');
      },
      { once: true },
    );
  });
  await command(page, {
    type: 'send',
    id: 'counter-changed',
    ...target,
    prompt: 'Must not send',
    attachments: [uploadOriginals[0]!],
  });
  await expect(page.getByRole('progressbar')).toBeVisible();
  await page.evaluate(() => (window as any).fixtureFinishUploads());
  await page.clock.runFor(2500);
  expect((await command(page, { type: 'poll', id: 'counter-changed' })).data.status).toBe('error');
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
});
