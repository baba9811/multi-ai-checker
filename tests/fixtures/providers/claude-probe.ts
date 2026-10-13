import type { BrowserContext, Page } from '@playwright/test';
import { providerPage } from './pages';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const claudeProbeOrg = '11111111-1111-4111-8111-111111111111';
export const claudeProbeBootstrap = {
  model_selector_state: [{ id: 'chat', model: 'claude-sonnet-fixture' }],
  model_selector_config: [
    {
      id: 'chat',
      models: [
        {
          id: 'claude-sonnet-fixture',
          name: 'Sonnet fixture',
          section: 'main',
          capabilities: { mm_images: true },
        },
      ],
    },
  ],
  claude_ai_available_models: {
    models: [{ model_id: 'claude-sonnet-fixture', minimum_tier: 'free' }],
  },
};

/** Synthetic provider contracts shared by bridge and installed-origin tests. */
export async function claudeProbeFixture(
  target: Page | BrowserContext,
  options: { partialTurn?: number; changedReadback?: number; originals?: boolean } = {},
) {
  const requests: Array<{ conversation: string; body: Record<string, any> }> = [];
  let saved: Record<string, any> | undefined;
  let readbacks = 0;
  const uploads: { exactBytes: boolean }[] = [];
  const imageBytes = options.originals
    ? await readFile(path.resolve('tests/fixtures/attachments/crosscheck-icon.png'))
    : undefined;
  const imageUuid = '88888888-8888-4888-8888-888888888888';
  const imageReceipt = {
    success: true,
    file_kind: 'image',
    file_uuid: imageUuid,
    file_name: 'crosscheck-icon.png',
    size_bytes: imageBytes?.length,
    preview_asset: { image_width: 128, image_height: 128 },
  };
  const org = claudeProbeOrg;
  await target.route('https://claude.ai/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname;
    if (pathname === `/api/${org}/upload`) {
      const body = route.request().postDataBuffer();
      const exactBytes =
        !!imageBytes &&
        !!body?.includes(imageBytes) &&
        body.includes(Buffer.from('filename="crosscheck-icon.png"'));
      uploads.push({ exactBytes });
      return route.fulfill({
        status: exactBytes ? 200 : 400,
        json: exactBytes ? imageReceipt : { type: 'error' },
      });
    }
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
      return route.fulfill({ json: claudeProbeBootstrap });
    if (
      pathname.startsWith(`/api/organizations/${org}/chat_conversations/`) &&
      !pathname.endsWith('/completion')
    ) {
      readbacks++;
      const result = structuredClone(saved ?? {});
      if (readbacks === options.changedReadback && result.chat_messages)
        result.chat_messages[0].content[0].text = 'Changed synthetic input';
      return route.fulfill({ json: result });
    }
    if (pathname.endsWith('/completion')) {
      const body = route.request().postDataJSON();
      const turn = requests.length + 1;
      const conversation = pathname.split('/').at(-2)!;
      requests.push({ conversation, body });
      const human =
        turn === 1
          ? '44444444-4444-4444-8444-444444444444'
          : '66666666-6666-4666-8666-666666666666';
      const assistant =
        turn === 1
          ? '55555555-5555-4555-8555-555555555555'
          : '77777777-7777-4777-8777-777777777777';
      const answer =
        turn === 1
          ? body.prompt === 'Reply with CROSSCHECK_OK only.'
            ? 'CROSSCHECK_OK'
            : 'CROSSCHECK_CONTEXT_OK/47'
          : '47/CROSSCHECK_CONTEXT_OK';
      const messages = [
        {
          uuid: human,
          sender: 'human',
          parent_message_uuid: body.parent_message_uuid ?? '00000000-0000-4000-8000-000000000000',
          text: '',
          content: [{ type: 'text', text: body.prompt }],
          truncated: false,
          attachments: (body.attachments ?? []).map(
            ({ origin: _origin, kind: _kind, ...attachment }: Record<string, unknown>) => ({
              ...attachment,
              id: '99999999-9999-4999-8999-999999999999',
            }),
          ),
          files: (body.files ?? []).map((uuid: string) => ({
            ...imageReceipt,
            file_uuid: uuid,
            uuid,
          })),
          sync_sources: [],
        },
        {
          uuid: assistant,
          sender: 'assistant',
          parent_message_uuid: human,
          text: '',
          content: [{ type: 'text', text: answer }],
          stop_reason: 'end_turn',
          truncated: false,
          attachments: [],
          files: [],
          sync_sources: [],
        },
      ];
      saved = {
        uuid: conversation,
        current_leaf_message_uuid: assistant,
        model: body.model,
        chat_messages: [...(saved?.chat_messages ?? []), ...messages],
      };
      const events = [
        { type: 'message_start', message: { uuid: assistant, parent_uuid: human } },
        { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } },
        { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: answer } },
        { type: 'content_block_stop', index: 0 },
        { type: 'message_delta', delta: { stop_reason: 'end_turn' } },
        ...(options.partialTurn === turn ? [] : [{ type: 'message_stop' }]),
      ];
      return route.fulfill({
        contentType: 'text/event-stream',
        body: events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join(''),
      });
    }
    const html = providerPage('claude').replace(
      '</body>',
      `<script>
      document.getElementById('messages').replaceChildren();
      const button = document.createElement('button');
      button.dataset.testid = 'model-selector-dropdown';
      button.setAttribute('aria-expanded', 'false');
      const name = document.createElement('span'); name.textContent = 'Sonnet fixture';
      const effort = document.createElement('span'); effort.textContent = 'Medium';
      button.append(name, effort); document.body.append(button);
    </script></body>`,
    );
    return route.fulfill({ contentType: 'text/html', body: html });
  });
  return { requests, posts: () => requests.length, readbacks: () => readbacks, uploads };
}
