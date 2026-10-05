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
          remove.setAttribute('aria-label', `Remove ${file.name}`);
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
