import { readFile } from 'node:fs/promises';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createClaudePeer } from '../../../src/infrastructure/providers/claude/peer';
import { prepareAttachments } from '../../../src/application/attachments';
import type { AttachmentPayload } from '../../../src/domains/attachments/model';
const menu = vi.hoisted(() => vi.fn());
vi.mock('../../../src/infrastructure/providers/models', () => ({ readClaudeProbeLabel: menu }));
const create = () => createClaudePeer('Test');
const org = '33333333-3333-4333-8333-333333333333';
const root = '00000000-0000-4000-8000-000000000000';
const attachmentId = '88888888-8888-4888-8888-888888888888';
const imageId = '99999999-9999-4999-8999-999999999999';
const prompt = 'Review this real transcript: 질문 1 → answer one; question 2 → answer two.';
const event = (type: string, fields = {}) =>
  `event: ${type}\ndata: ${JSON.stringify({ type, ...fields })}\n\n`;
function setup(
  options: {
    answer?: string;
    partial?: boolean;
    onRead?: (data: Record<string, any>, read: number) => void;
    onPost?: () => void;
    onUpload?: (body: FormData) => Promise<Response>;
    capability?: boolean;
  } = {},
) {
  menu.mockReset().mockResolvedValue('Test');
  vi.stubGlobal('location', { href: 'https://claude.ai/new', origin: 'https://claude.ai' });
  let conversation = '',
    reads = 0;
  const messages: Record<string, unknown>[] = [];
  const attachmentUuids = new Map<string, string>();
  const posts: { url: string; body: Record<string, any> }[] = [];
  const order: string[] = [];
  vi.stubGlobal(
    'createImageBitmap',
    vi.fn(async () => ({ width: 128, height: 128, close: vi.fn() })),
  );
  const fetch = vi.fn(async (url: string, init: RequestInit) => {
    if (url === `/api/${org}/upload`) {
      order.push('upload');
      return options.onUpload
        ? options.onUpload(init.body as FormData)
        : Response.json({
            success: true,
            file_kind: 'image',
            file_uuid: imageId,
            file_name: 'crosscheck-icon.png',
            preview_asset: { image_width: 128, image_height: 128 },
          });
    }
    if (url === '/api/organizations') return Response.json([{ uuid: org, capabilities: ['chat'] }]);
    if (url.startsWith('/edge-api/bootstrap/'))
      return Response.json({
        model_selector_state: [{ id: 'chat', model: 'claude-test' }],
        model_selector_config: [
          {
            id: 'chat',
            models: [
              {
                id: 'claude-test',
                name: 'Test',
                capabilities: { mm_images: options.capability ?? true },
              },
            ],
          },
        ],
        claude_ai_available_models: { models: [{ model_id: 'claude-test' }] },
      });
    if (init.method === 'GET') {
      order.push('read');
      const data = {
        uuid: conversation,
        model: 'claude-test',
        current_leaf_message_uuid: messages.at(-1)!.uuid,
        chat_messages: structuredClone(messages),
      };
      options.onRead?.(data, ++reads);
      return Response.json(data);
    }
    const body = JSON.parse(init.body as string);
    posts.push({ url, body });
    order.push('post');
    options.onPost?.();
    conversation = url.split('/').at(-2)!;
    const human = crypto.randomUUID(),
      assistant = crypto.randomUUID();
    const answer = options.answer ?? `Verified arbitrary answer ${posts.length}`;
    const message = (
      uuid: string,
      sender: string,
      text: string,
      parent: string,
    ): Record<string, unknown> => ({
      uuid,
      sender,
      text: '',
      parent_message_uuid: parent,
      content: [{ type: 'text', text }],
      truncated: false,
      attachments: [],
      files: [],
      sync_sources: [],
      ...(sender === 'assistant' ? { stop_reason: 'end_turn' } : {}),
    });
    const user = message(
      human,
      'human',
      body.prompt,
      posts.length === 1 ? root : String(messages.at(-1)!.uuid),
    );
    user.attachments = body.attachments.map(
      ({ origin: _, kind: __, ...data }: Record<string, unknown>) => {
        const name = String(data.file_name);
        if (!attachmentUuids.has(name))
          attachmentUuids.set(name, attachmentUuids.size ? crypto.randomUUID() : attachmentId);
        return { ...data, id: attachmentUuids.get(name)! };
      },
    );
    user.files = body.files.map((id: string) => ({
      success: true,
      file_kind: 'image',
      file_uuid: id,
      uuid: id,
      file_name: 'crosscheck-icon.png',
      preview_asset: { image_width: 128, image_height: 128 },
    }));
    messages.push(user, message(assistant, 'assistant', answer, human));
    const frames = [
      event('message_start', {
        message: { uuid: assistant, parent_uuid: human, model: 'claude-test' },
      }),
      event('content_block_start', { index: 0, content_block: { type: 'text', text: answer } }),
      event('content_block_stop', { index: 0 }),
      event('message_delta', { delta: { stop_reason: 'end_turn' } }),
      event('message_stop'),
    ];
    return new Response((options.partial ? frames.slice(0, -1) : frames).join(''), {
      headers: { 'content-type': 'text/event-stream' },
    });
  });
  vi.stubGlobal('fetch', fetch);
  return { fetch, posts, order };
}
const signal = () => new AbortController().signal;
afterEach(() => vi.unstubAllGlobals());
describe('Claude imported peer session', () => {
  it('accepts arbitrary full prompts and independently rereads the first pair before one same-conversation review', async () => {
    const { posts, order } = setup();
    const peer = create();
    await expect(peer.send(prompt, [], [], 'collect', signal())).resolves.toBe(
      'Verified arbitrary answer 1',
    );
    await expect(
      peer.send('Peer review with full approved transcript', [], [], 'review', signal()),
    ).resolves.toBe('Verified arbitrary answer 2');
    expect(order).toEqual(['post', 'read', 'read', 'post', 'read']);
    expect(posts[0]!.body.prompt).toBe(prompt);
    expect(posts[1]!.url).toBe(posts[0]!.url);
    expect(posts[0]!.body).toHaveProperty('create_conversation_params');
    expect(posts[1]!.body).not.toHaveProperty('create_conversation_params');
    expect(posts[1]!.body.parent_message_uuid).toBeTypeOf('string');
    expect(menu).toHaveBeenCalledTimes(2);
    await expect(peer.send('Third request', [], [], 'review', signal())).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    expect(posts).toHaveLength(2);
  });
  it.each(['review', 'collect'] as const)(
    'rejects invalid %s order without new requests',
    async (stage) => {
      const { posts } = setup();
      const peer = create();
      if (stage === 'collect') await peer.send(prompt, [], [], 'collect', signal());
      await expect(peer.send(prompt, [], [], stage, signal())).rejects.toThrow(
        /^Claude peer failed\.$/,
      );
      expect(posts).toHaveLength(stage === 'collect' ? 1 : 0);
    },
  );
  it.each(['prompt', 'legacy', 'parent', 'leaf', 'model', 'files', 'extra'])(
    'rejects altered prior %s before review',
    async (change) => {
      const { posts } = setup({
        onRead(data, read) {
          if (read !== 2) return;
          if (change === 'prompt') data.chat_messages[0].content[0].text = 'changed';
          if (change === 'legacy') data.chat_messages[0].text = prompt;
          if (change === 'parent') data.chat_messages[0].parent_message_uuid = null;
          if (change === 'leaf') data.current_leaf_message_uuid = root;
          if (change === 'model') data.model = 'other';
          if (change === 'files') data.chat_messages[0].files = [{ file_uuid: root }];
          if (change === 'extra') data.chat_messages.push({ uuid: root });
        },
      });
      const peer = create();
      await peer.send(prompt, [], [], 'collect', signal());
      await expect(peer.send(prompt, [], [], 'review', signal())).rejects.toThrow(
        /^Claude peer failed\.$/,
      );
      expect(posts).toHaveLength(1);
    },
  );
  it('accepts workflow-sized answers beyond diagnostic limits', async () => {
    setup({ answer: 'A'.repeat(14000) });
    await expect(create().send(prompt, [], [], 'collect', signal())).resolves.toHaveLength(14000);
  });
  it.each([0, 100001])('rejects prompt limit %i before any mutation', async (length) => {
    const { posts } = setup();
    await expect(create().send('A'.repeat(length), [], [], 'collect', signal())).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    expect(posts).toHaveLength(0);
  });
  it('rejects overlong answers and makes uncertain sessions terminal', async () => {
    const { posts } = setup({ answer: 'A'.repeat(14001) });
    const peer = create();
    await expect(peer.send(prompt, [], [], 'collect', signal())).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    await expect(peer.send(prompt, [], [], 'collect', signal())).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    expect(posts).toHaveLength(1);
  });
  it('never retries a partial response', async () => {
    const { posts } = setup({ partial: true });
    const peer = create();
    await expect(peer.send(prompt, [], [], 'collect', signal())).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    await expect(peer.send(prompt, [], [], 'review', signal())).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    expect(posts).toHaveLength(1);
  });
  it.each(['abort', 'model', 'navigation'])('rejects %s before follow-up', async (change) => {
    const { posts } = setup();
    const peer = create();
    await peer.send(prompt, [], [], 'collect', signal());
    const c = new AbortController();
    if (change === 'abort') c.abort();
    if (change === 'model') menu.mockResolvedValue('Other');
    if (change === 'navigation') location.href = 'https://claude.ai/chat/other';
    await expect(peer.send(prompt, [], [], 'review', c.signal)).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    expect(posts).toHaveLength(1);
  });
  it('sanitizes provider errors without content in cause', async () => {
    const { fetch } = setup();
    fetch.mockRejectedValue(new Error('private transcript and account'));
    const error = await create()
      .send(prompt, [], [], 'collect', signal())
      .catch((e) => e);
    expect(error.message).toBe('Claude peer failed.');
    expect(String(error.cause)).not.toContain('private');
    expect(fetch).toHaveBeenCalledOnce();
  });
  it.each([
    'hash',
    'type',
    'utf8',
    'nul',
    'bom',
    'png',
    'manifest-type',
    'manifest-size',
    'count',
    'unsupported',
  ])('rejects invalid original %s before upload or completion', async (change) => {
    const { fetch } = setup();
    let bytes: Uint8Array = new TextEncoder().encode('Synthetic TXT original');
    let type = 'text/plain',
      name = 'original.txt';
    if (change === 'utf8') bytes = new Uint8Array([255]);
    if (change === 'nul') bytes = new Uint8Array([0]);
    if (change === 'bom') bytes = new Uint8Array([239, 187, 191, 65]);
    if (change === 'png') {
      type = 'image/png';
      name = 'original.png';
    }
    if (change === 'unsupported') {
      type = 'application/pdf';
      name = 'original.pdf';
    }
    let files = await prepareAttachments([
      new File([bytes as Uint8Array<ArrayBuffer>], name, { type }),
    ]);
    const approved = files.map(({ base64: _, ...metadata }) => metadata);
    if (change === 'hash') files[0]!.base64 = btoa('x'.repeat(files[0]!.size));
    if (change === 'type') files[0]!.type = 'image/png';
    if (change === 'manifest-type') approved[0]!.type = 'image/png';
    if (change === 'manifest-size') approved[0]!.size++;
    if (change === 'count')
      files = Array.from({ length: 11 }, (_, i) => ({ ...files[0]!, name: `${i}.txt` }));
    await expect(create().send(prompt, files, approved, 'collect', signal())).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    expect(fetch.mock.calls.filter(([, init]) => init.method === 'POST')).toHaveLength(0);
  });
});

const originals = async () =>
  prepareAttachments([
    new File(
      [
        new Uint8Array(
          await readFile(
            new URL('../../fixtures/attachments/crosscheck-facts.txt', import.meta.url),
          ),
        ),
      ],
      'crosscheck-facts.txt',
      { type: 'text/plain' },
    ),
    new File(
      [
        new Uint8Array(
          await readFile(
            new URL('../../fixtures/attachments/crosscheck-icon.png', import.meta.url),
          ),
        ),
      ],
      'crosscheck-icon.png',
      { type: 'image/png' },
    ),
  ]);
const metadata = (files: AttachmentPayload[]) => files.map(({ base64: _, ...item }) => item);
describe('Claude original-file evidence contract', () => {
  it('awaits PNG upload, sends exact inline TXT and PNG UUID, verifies authoritative originals and never reuploads on review', async () => {
    const files = await originals();
    const approved = metadata(files);
    const { fetch, posts, order } = setup();
    const peer = create();
    await expect(peer.send(prompt, files, approved, 'collect', signal())).resolves.toBe(
      'Verified arbitrary answer 1',
    );
    expect(order).toEqual(['upload', 'post', 'read']);
    const upload = fetch.mock.calls.find(([url]) => url.endsWith('/upload'))![1];
    expect(upload).toMatchObject({ credentials: 'same-origin', redirect: 'error' });
    expect(upload.headers).toEqual({ Accept: 'application/json' });
    const png = (upload.body as FormData).get('file') as File;
    expect(png.name).toBe(files[1]!.name);
    expect(new Uint8Array(await png.arrayBuffer())).toEqual(
      new Uint8Array(
        await readFile(new URL('../../fixtures/attachments/crosscheck-icon.png', import.meta.url)),
      ),
    );
    expect(posts[0]!.body.attachments).toEqual([
      {
        file_name: files[0]!.name,
        file_type: files[0]!.type,
        file_size: files[0]!.size,
        extracted_content: atob(files[0]!.base64),
        origin: 'user_upload',
        kind: 'file',
      },
    ]);
    expect(posts[0]!.body.files).toEqual([imageId]);
    await expect(
      peer.send('Full approved transcript review', [], approved, 'review', signal()),
    ).resolves.toBe('Verified arbitrary answer 2');
    expect(order).toEqual(['upload', 'post', 'read', 'read', 'post', 'read']);
    expect(posts[1]!.body.attachments).toEqual([]);
    expect(posts[1]!.body.files).toEqual([]);
    expect(fetch.mock.calls.filter(([url]) => url.endsWith('/upload'))).toHaveLength(1);
  });
  it('does not complete before the PNG upload resolves', async () => {
    const files = await originals();
    let ready!: (response: Response) => void;
    const { posts, fetch } = setup({
      onUpload: async () =>
        new Promise((resolve) => {
          ready = resolve;
        }),
    });
    const pending = create()
      .send(prompt, files, metadata(files), 'collect', signal())
      .then(
        (answer) => ({ answer }),
        (error) => ({ error }),
      );
    await vi.waitFor(() =>
      expect(fetch.mock.calls.some(([url]) => url.endsWith('/upload'))).toBe(true),
    );
    expect(posts).toHaveLength(0);
    ready(
      Response.json({
        success: true,
        file_kind: 'image',
        file_uuid: imageId,
        file_name: files[1]!.name,
      }),
    );
    await expect(pending).resolves.toEqual({ answer: 'Verified arbitrary answer 1' });
  });
  it.each([
    'missing',
    'wrong-id',
    'wrong-name',
    'wrong-kind',
    'failed',
    'size',
    'dimensions',
    'duplicate',
    'txt-id',
    'txt-content',
    'txt-type',
    'txt-size',
    'txt-extra',
    'txt-missing',
    'sync-source',
  ])('rejects authoritative %s membership and makes the session terminal', async (change) => {
    const files = await originals();
    const { posts } = setup({
      onRead(data) {
        const user = data.chat_messages[0];
        if (change === 'missing') user.files = [];
        if (change === 'wrong-id') user.files[0].file_uuid = root;
        if (change === 'wrong-name') user.files[0].file_name = 'different.png';
        if (change === 'wrong-kind') user.files[0].file_kind = 'file';
        if (change === 'failed') user.files[0].success = false;
        if (change === 'size') user.files[0].size_bytes = 1;
        if (change === 'dimensions') user.files[0].preview_asset.image_width = 127;
        if (change === 'duplicate') user.files.push(user.files[0]);
        if (change === 'txt-id') user.attachments[0].id = 'not-an-id';
        if (change === 'txt-content') user.attachments[0].extracted_content = 'changed';
        if (change === 'txt-type') user.attachments[0].file_type = 'other';
        if (change === 'txt-size') user.attachments[0].file_size++;
        if (change === 'txt-extra') user.attachments.push(user.attachments[0]);
        if (change === 'txt-missing') user.attachments = [];
        if (change === 'sync-source') user.sync_sources = [root];
      },
    });
    const peer = create();
    await expect(peer.send(prompt, files, metadata(files), 'collect', signal())).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    await expect(peer.send(prompt, [], metadata(files), 'review', signal())).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    expect(posts).toHaveLength(1);
  });
  it.each(['txt-id', 'image-id', 'txt-content', 'image-missing'])(
    'rejects changed prior receipt %s before review',
    async (change) => {
      const files = await originals();
      const { posts } = setup({
        onRead(data, read) {
          if (read !== 2) return;
          if (change === 'txt-id') data.chat_messages[0].attachments[0].id = root;
          if (change === 'image-id') data.chat_messages[0].files[0].file_uuid = root;
          if (change === 'txt-content')
            data.chat_messages[0].attachments[0].extracted_content = 'changed';
          if (change === 'image-missing') data.chat_messages[0].files = [];
        },
      });
      const peer = create();
      await peer.send(prompt, files, metadata(files), 'collect', signal());
      await expect(peer.send(prompt, [], metadata(files), 'review', signal())).rejects.toThrow(
        /^Claude peer failed\.$/,
      );
      expect(posts).toHaveLength(1);
    },
  );
  it('accepts observed asynchronous size appearance and changing preview URLs while preserving stable identity', async () => {
    const files = await originals();
    setup({
      onRead(data, read) {
        if (read > 1) data.chat_messages[0].files[0].size_bytes = files[1]!.size;
        data.chat_messages[0].files[0].preview_url = `not-fetched-${read}`;
        data.chat_messages[0].attachments[0].created_at = `not-an-identity-${read}`;
      },
    });
    const peer = create();
    await peer.send(prompt, files, metadata(files), 'collect', signal());
    await expect(peer.send(prompt, [], metadata(files), 'review', signal())).resolves.toBe(
      'Verified arbitrary answer 2',
    );
  });
  it.each([
    { success: false },
    { file_kind: 'file' },
    { file_uuid: root, file_name: 'other.png' },
    { file_uuid: 'invalid' },
    { size_bytes: 1 },
    { type: 'error' },
  ])('rejects failed/malformed upload %# before completion with no retry', async (change) => {
    const files = await originals();
    const { posts, fetch } = setup({
      onUpload: async () =>
        Response.json({
          success: true,
          file_kind: 'image',
          file_uuid: imageId,
          file_name: files[1]!.name,
          ...change,
        }),
    });
    const peer = create();
    await expect(peer.send(prompt, files, metadata(files), 'collect', signal())).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    await expect(peer.send(prompt, files, metadata(files), 'collect', signal())).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    expect(posts).toHaveLength(0);
    expect(fetch.mock.calls.filter(([url]) => url.endsWith('/upload'))).toHaveLength(1);
  });
  it('requires observed selected model image capability before uploading', async () => {
    const files = await originals();
    const { fetch } = setup({ capability: false });
    await expect(
      create().send(prompt, files, metadata(files), 'collect', signal()),
    ).rejects.toThrow(/^Claude peer failed\.$/);
    expect(fetch.mock.calls.some(([, init]) => init.method === 'POST')).toBe(false);
  });
  it('rejects a changed full approved manifest on a byte-free review', async () => {
    const files = await originals();
    const { posts } = setup();
    const peer = create();
    await peer.send(prompt, files, metadata(files), 'collect', signal());
    const approved = metadata(files);
    approved[0]!.type = 'image/png';
    await expect(peer.send(prompt, [], approved, 'review', signal())).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    expect(posts).toHaveLength(1);
  });
});

describe('Claude peer cancellation and original guards', () => {
  it('refuses a saved conversation document before network', async () => {
    const { fetch } = setup();
    location.href = 'https://claude.ai/chat/existing';
    await expect(create().send(prompt, [], [], 'collect', signal())).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    expect(fetch).not.toHaveBeenCalled();
  });
  it('cancels an active follow-up when the first-stage signal is cancelled', async () => {
    const first = new AbortController();
    const { posts } = setup({
      onPost() {
        if (posts.length === 2) first.abort();
      },
    });
    const peer = create();
    await peer.send(prompt, [], [], 'collect', first.signal);
    await expect(peer.send(prompt, [], [], 'review', signal())).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    expect(posts).toHaveLength(2);
  });
  it.each(['header', 'dimensions', 'zero', 'decoder', 'decode-failure'])(
    'rejects invalid PNG %s before any request',
    async (change) => {
      const files = await originals();
      const bytes = new Uint8Array(
        await readFile(new URL('../../fixtures/attachments/crosscheck-icon.png', import.meta.url)),
      );
      const { fetch } = setup();
      if (change === 'header') bytes[0] = 0;
      if (change === 'dimensions') new DataView(bytes.buffer).setUint32(16, 4097);
      if (change === 'zero') new DataView(bytes.buffer).setUint32(20, 0);
      if (change === 'decoder')
        vi.stubGlobal(
          'createImageBitmap',
          vi.fn(async () => ({ width: 127, height: 128, close: vi.fn() })),
        );
      if (change === 'decode-failure')
        vi.stubGlobal(
          'createImageBitmap',
          vi.fn(async () => {
            throw new Error('private bytes');
          }),
        );
      files[1] = (
        await prepareAttachments([new File([bytes], files[1]!.name, { type: 'image/png' })])
      )[0]!;
      await expect(
        create().send(prompt, files, metadata(files), 'collect', signal()),
      ).rejects.toThrow(/^Claude peer failed\.$/);
      expect(fetch).not.toHaveBeenCalled();
    },
  );
  it('cancels after a pending upload without completion or retry', async () => {
    const files = await originals();
    const controller = new AbortController();
    const { posts, fetch } = setup({
      onUpload: async () => {
        controller.abort();
        return Response.json({
          success: true,
          file_kind: 'image',
          file_uuid: imageId,
          file_name: files[1]!.name,
        });
      },
    });
    const peer = create();
    await expect(
      peer.send(prompt, files, metadata(files), 'collect', controller.signal),
    ).rejects.toThrow(/^Claude peer failed\.$/);
    await expect(peer.send(prompt, files, metadata(files), 'collect', signal())).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    expect(posts).toHaveLength(0);
    expect(fetch.mock.calls.filter(([url]) => url.endsWith('/upload'))).toHaveLength(1);
  });
  it('validates reselected original bytes on review without uploading again', async () => {
    const files = await originals();
    const { fetch } = setup();
    const peer = create();
    await peer.send(prompt, files, metadata(files), 'collect', signal());
    await expect(peer.send(prompt, files, metadata(files), 'review', signal())).resolves.toBe(
      'Verified arbitrary answer 2',
    );
    expect(fetch.mock.calls.filter(([url]) => url.endsWith('/upload'))).toHaveLength(1);
  });
  it('rejects oversized TXT before any request', async () => {
    const { fetch } = setup();
    const files = await prepareAttachments([
      new File(['a'.repeat(65537)], 'large.txt', { type: 'text/plain' }),
    ]);
    await expect(
      create().send(prompt, files, metadata(files), 'collect', signal()),
    ).rejects.toThrow(/^Claude peer failed\.$/);
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe('Claude peer bounded history size', () => {
  it('verifies ten maximum inline TXT originals plus two maximum escaped prompts within a bounded history response', async () => {
    const files = await prepareAttachments(
      Array.from(
        { length: 10 },
        (_, i) => new File(['x' + '\u0001'.repeat(65535)], `${i}.txt`, { type: 'text/plain' }),
      ),
    );
    const { posts } = setup({ answer: 'a' + '\u0001'.repeat(13999) });
    const fullPrompt = 'p' + '\u0001'.repeat(99999);
    const peer = create();
    await expect(
      peer.send(fullPrompt, files, metadata(files), 'collect', signal()),
    ).resolves.toHaveLength(14000);
    await expect(
      peer.send(fullPrompt, [], metadata(files), 'review', signal()),
    ).resolves.toHaveLength(14000);
    expect(posts).toHaveLength(2);
    expect(posts[0]!.body.attachments).toHaveLength(10);
  });
  it('retains the 1MiB account-response bound without mutation', async () => {
    const { fetch, posts } = setup();
    fetch.mockResolvedValueOnce(
      Response.json([{ uuid: org, capabilities: ['chat'], extra: 'x'.repeat(1048576) }]),
    );
    await expect(create().send(prompt, [], [], 'collect', signal())).rejects.toThrow(
      /^Claude peer failed\.$/,
    );
    expect(posts).toHaveLength(0);
  });
});
