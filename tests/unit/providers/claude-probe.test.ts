import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  collectClaudeProbeStream,
  claudeProbe,
  CLAUDE_PROBE_PROMPT,
} from '../../../src/infrastructure/providers/claude/probe';
const menu = vi.hoisted(() => vi.fn());
vi.mock('../../../src/infrastructure/providers/models', () => ({ readClaudeProbeLabel: menu }));
const choice = 'Test';
const human = '11111111-1111-4111-8111-111111111111';
const assistant = '22222222-2222-4222-8222-222222222222';
const event = (type: string, fields = {}) =>
  `event: ${type}\ndata: ${JSON.stringify({ type, ...fields })}\n\n`;
const events = () => [
  event('message_start', { message: { uuid: assistant, parent_uuid: human, role: 'assistant' } }),
  event('content_block_start', { index: 0, content_block: { type: 'text', text: '' } }),
  event('content_block_delta', {
    index: 0,
    delta: { type: 'text_delta', text: '한CROSSCHECK_OK' },
  }),
  event('content_block_stop', { index: 0 }),
  event('message_delta', { delta: { stop_reason: 'end_turn' } }),
  event('message_stop'),
];
function stream(text: string) {
  const bytes = new TextEncoder().encode(text);
  return new ReadableStream<Uint8Array>({
    start(c) {
      for (const b of bytes) c.enqueue(new Uint8Array([b]));
      c.close();
    },
  });
}
const collect = (text: string, signal = new AbortController().signal) =>
  collectClaudeProbeStream(stream(text), signal, 'claude-test');
afterEach(() => vi.unstubAllGlobals());
describe('Claude probe stream', () => {
  it.each([
    { text: 'data: invalid\n\n', cause: 'response-event' },
    { text: 'event: ping\ndata: {}\n\n', cause: 'response-terminal' },
    {
      text: event('message_start', {
        message: { uuid: 'wrong', parent_uuid: human, role: 'assistant' },
      }),
      cause: 'response-binding',
    },
    {
      text: event('message_start', {
        message: { uuid: assistant, parent_uuid: 'wrong', role: 'assistant' },
      }),
      cause: 'response-binding',
    },
    {
      text: event('message_start', {
        message: { uuid: 'wrong', parent_uuid: 'wrong', role: 'assistant' },
      }),
      cause: 'response-binding',
    },
    {
      text: events()[0]! + events()[0]!,
      cause: 'response-binding',
    },
    {
      text: event('message_start', {
        message: { uuid: assistant, parent_uuid: human, role: 'human' },
      }),
      cause: 'response-role',
    },
    {
      text:
        events()[0] +
        event('content_block_start', {
          index: 0,
          content_block: { type: 'thinking', text: 'private' },
        }),
      cause: 'response-block',
    },
    { text: events().slice(0, -1).join(''), cause: 'response-terminal' },
  ])('reports only fixed parser stage $cause', async ({ text, cause }) => {
    await expect(collect(text)).rejects.toMatchObject({ message: 'Claude probe failed.', cause });
  });
  it('rejects split UTF-8 completion without message_stop', async () => {
    await expect(collect(events().slice(0, -1).join(''))).rejects.toThrow('Claude probe failed.');
  });
  it('collects split UTF-8 only after bound complete response', async () => {
    await expect(collect(events().join(''))).resolves.toEqual({
      answer: '한CROSSCHECK_OK',
      human,
      assistant,
    });
  });
  it.each(['uuid', 'parent_uuid', 'role'])('rejects mismatched %s', async (key) => {
    const e = events();
    e[0] = event('message_start', {
      message: { uuid: assistant, parent_uuid: human, role: 'assistant', [key]: 'wrong' },
    });
    await expect(collect(e.join(''))).rejects.toThrow('Claude probe failed.');
  });
  it.each([3, 4])('requires closed blocks and end_turn (%i)', async (index) => {
    const e = events();
    e.splice(index, 1);
    await expect(collect(e.join(''))).rejects.toThrow('Claude probe failed.');
  });
  it.each([
    'event: error\ndata: {"type":"error","secret":"private"}\n\n',
    'event: ping\ndata: invalid\n\n',
    event('unsupported'),
    'data: {}\n\n',
    event('message_stop'),
  ])('rejects malformed/unsupported streams without raw errors', async (text) => {
    await expect(collect(text)).rejects.toThrow(/^Claude probe failed\.$/);
  });
  it('accepts valid data-only SSE frames', async () => {
    await expect(
      collect(
        events()
          .join('')
          .replace(/^event: .*\n/gm, ''),
      ),
    ).resolves.toEqual({ answer: '한CROSSCHECK_OK', human, assistant });
  });
  it('requires explicit event names to match payload types', async () => {
    await expect(
      collect(events().join('').replace('event: message_start', 'event: ping')),
    ).rejects.toThrow('Claude probe failed.');
  });
  it('rejects chat completion id without the bound message UUID', async () => {
    const e = events();
    e[0] = event('message_start', {
      message: { id: assistant, parent_uuid: human, role: 'assistant' },
    });
    await expect(collect(e.join(''))).rejects.toThrow('Claude probe failed.');
  });
  it('rejects a non-end_turn stop reason', async () => {
    const e = events();
    e[4] = event('message_delta', { delta: { stop_reason: 'max_tokens' } });
    await expect(collect(e.join(''))).rejects.toThrow('Claude probe failed.');
  });
  it('bounds answer text', async () => {
    const e = events();
    e[2] = event('content_block_delta', {
      index: 0,
      delta: { type: 'text_delta', text: 'x'.repeat(4097) },
    });
    await expect(collect(e.join(''))).rejects.toThrow('Claude probe failed.');
  });
  it('bounds wire data', async () => {
    await expect(
      collectClaudeProbeStream(
        new ReadableStream({
          start(c) {
            c.enqueue(new Uint8Array(1048577));
            c.close();
          },
        }),
        new AbortController().signal,
        'claude-test',
      ),
    ).rejects.toThrow('Claude probe failed.');
  });
  it('cancels a waiting reader on abort', async () => {
    const c = new AbortController();
    const cancel = vi.fn();
    const pending = collectClaudeProbeStream(
      new ReadableStream({ cancel }),
      c.signal,
      'claude-test',
    );
    c.abort();
    await expect(pending).rejects.toThrow('Claude probe failed.');
    expect(cancel).toHaveBeenCalledOnce();
  });
  it('accepts server UUIDs with absent roles and metadata without payload types', async () => {
    const e = events();
    e[0] = event('message_start', { message: { uuid: assistant, parent_uuid: human } });
    await expect(
      collect('event: ping\ndata: {}\n\nevent: conversation_ready\ndata: {}\n\n' + e.join('')),
    ).resolves.toEqual({ answer: '한CROSSCHECK_OK', human, assistant });
  });
  it.each(['claude-test', 'other', 42])(
    'requires an explicit stream model to equal the requested model (%s)',
    async (model) => {
      const e = events();
      e[0] = event('message_start', { message: { uuid: assistant, parent_uuid: human, model } });
      const result = collect(e.join(''));
      if (model === 'claude-test')
        await expect(result).resolves.toEqual({ answer: '한CROSSCHECK_OK', human, assistant });
      else await expect(result).rejects.toMatchObject({ cause: 'response-binding' });
    },
  );
  it('rejects a declared wrong sender or identical message IDs', async () => {
    for (const message of [
      { uuid: assistant, parent_uuid: human, sender: 'human' },
      { uuid: human, parent_uuid: human },
    ]) {
      const e = events();
      e[0] = event('message_start', { message });
      await expect(collect(e.join(''))).rejects.toThrow('Claude probe failed.');
    }
  });
});
describe('Claude page-local request', () => {
  const org = '33333333-3333-4333-8333-333333333333';
  const selectorState = () => [{ id: 'chat', model: 'claude-test' }];
  const selectorConfig = () => [
    {
      id: 'chat',
      models: [{ id: 'claude-test', name: 'Test', section: 'main' }],
    },
  ];
  const history = (conversation: string) => ({
    uuid: conversation,
    model: 'claude-test',
    current_leaf_message_uuid: assistant,
    chat_messages: [
      {
        uuid: human,
        sender: 'human',
        text: '',
        truncated: false,
        content: [{ type: 'text', text: CLAUDE_PROBE_PROMPT }],
        attachments: [],
        files: [],
        sync_sources: [],
      },
      {
        uuid: assistant,
        parent_message_uuid: human,
        sender: 'assistant',
        text: '',
        stop_reason: 'end_turn',
        truncated: false,
        content: [{ type: 'text', text: '한CROSSCHECK_OK' }],
        attachments: [],
        files: [],
        sync_sources: [],
      },
    ],
  });
  function setup(
    organizations: unknown = [{ uuid: org, capabilities: ['chat'] }],
    models: unknown = [{ model_id: 'claude-test', minimum_tier: 'any' }],
    state: unknown = selectorState(),
    config: unknown = selectorConfig(),
  ) {
    menu.mockReset().mockResolvedValue(choice);
    vi.stubGlobal('location', { href: 'https://claude.ai/new', origin: 'https://claude.ai' });
    let conversation = '';
    const fetch = vi.fn(async (_url: string, init: RequestInit) => {
      if (init.method === 'GET' && _url.includes('/chat_conversations/'))
        return new Response(JSON.stringify(history(conversation)));
      if (init.method !== 'POST')
        return new Response(
          JSON.stringify(
            fetch.mock.calls.length === 1
              ? organizations
              : {
                  model_selector_state: state,
                  model_selector_config: config,
                  claude_ai_available_models: { models },
                },
          ),
        );
      conversation = _url.split('/').at(-2)!;
      const e = events();
      e[0] = event('message_start', { message: { uuid: assistant, parent_uuid: human } });
      return new Response(e.join(''), { headers: { 'content-type': 'text/event-stream' } });
    });
    vi.stubGlobal('fetch', fetch);
    return fetch;
  }
  it('uses fixed same-origin GETs then one fixed completion POST', async () => {
    const fetch = setup();
    await expect(claudeProbe(choice, new AbortController().signal)).resolves.toBe(
      '한CROSSCHECK_OK',
    );
    expect(fetch).toHaveBeenCalledTimes(4);
    const completion = fetch.mock.calls[2];
    if (!completion) throw new Error('Expected completion request');
    const [url, init] = completion;
    expect(url).toMatch(/^\/api\/organizations\/[\w-]+\/chat_conversations\/[\w-]+\/completion$/);
    for (const [, options] of fetch.mock.calls)
      expect(options).toMatchObject({ credentials: 'same-origin', redirect: 'error' });
    expect(init.headers).toEqual({
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      'anthropic-client-platform': 'web_claude_ai',
    });
    const body = JSON.parse(init.body as string);
    expect(body.prompt).toBe(CLAUDE_PROBE_PROMPT);
    expect(body.model).toBe('claude-test');
    expect(body).not.toHaveProperty('parent_message_uuid');
    expect(body.turn_message_uuids.human_message_uuid).not.toBe(human);
    expect(body.turn_message_uuids.assistant_message_uuid).not.toBe(assistant);
    expect(fetch.mock.calls[3]?.[0]).toBe(
      url.replace(
        '/completion',
        '?tree=True&rendering_mode=messages&render_all_tools=true&include_inline_comparison=true',
      ),
    );
  });
  it('joins selected chat metadata to the closed UI label and rechecks it', async () => {
    const fetch = setup();
    await expect(claudeProbe(choice, new AbortController().signal)).resolves.toBe(
      '한CROSSCHECK_OK',
    );
    expect(fetch.mock.calls[1]?.[0]).toContain('/edge-api/bootstrap/');
    expect(menu).toHaveBeenCalledOnce();
  });
  it.each(['Other', 'Test Medium'])(
    'rejects changed closed UI label before POST',
    async (current) => {
      const fetch = setup();
      menu.mockResolvedValue(current);
      await expect(claudeProbe(choice, new AbortController().signal)).rejects.toMatchObject({
        message: 'Claude probe failed.',
        cause: 'model-confirmation',
      });
      expect(fetch.mock.calls.some(([, init]) => init.method === 'POST')).toBe(false);
    },
  );
  it('normalizes whitespace only when joining the exact selected name', async () => {
    const config = [
      { id: 'chat', models: [{ id: 'claude-test', name: ' Test  Model ', section: 'main' }] },
    ];
    const fetch = setup(undefined, undefined, undefined, config);
    menu.mockResolvedValue('Test Model');
    await expect(claudeProbe(' Test\nModel ', new AbortController().signal)).resolves.toBe(
      '한CROSSCHECK_OK',
    );
    expect(fetch.mock.calls.filter(([, init]) => init.method === 'POST')).toHaveLength(1);
  });
  it.each([
    { state: null },
    { state: [] },
    {
      state: [
        { id: 'chat', model: 'claude-test' },
        { id: 'chat', model: 'claude-test' },
      ],
    },
    { state: [{ id: 'chat', model: 'other' }] },
    { state: [{ id: 'chat', model: 'unsafe/path' }] },
    { config: null },
    { config: [] },
    { config: [selectorConfig()[0], selectorConfig()[0]] },
    { config: [{ id: 'chat', models: [] }] },
    {
      config: [
        { id: 'chat', models: [selectorConfig()[0]!.models[0], selectorConfig()[0]!.models[0]] },
      ],
    },
  ])('rejects missing or ambiguous chat selector metadata %#', async (metadata) => {
    const fetch = setup(
      undefined,
      undefined,
      'state' in metadata ? metadata.state : selectorState(),
      'config' in metadata ? metadata.config : selectorConfig(),
    );
    await expect(claudeProbe(choice, new AbortController().signal)).rejects.toMatchObject({
      cause: 'catalog',
    });
    expect(fetch.mock.calls.some(([, init]) => init.method === 'POST')).toBe(false);
  });
  it.each([
    { id: 'unsafe/path' },
    { name: 'Other' },
    { name: 'Test Medium' },
    { name: '' },
    { disabled: true },
    { disabled: 'false' },
    { disabled_reason: 'unavailable' },
    { disabled_reason: '' },
    { section: 'legacy' },
    { section: 'deprecated' },
  ])('rejects unusable or mismatched selected model configuration %#', async (change) => {
    const config = [{ id: 'chat', models: [{ ...selectorConfig()[0]!.models[0], ...change }] }];
    const fetch = setup(undefined, undefined, undefined, config);
    await expect(claudeProbe(choice, new AbortController().signal)).rejects.toMatchObject({
      cause: 'catalog',
    });
    expect(fetch.mock.calls.some(([, init]) => init.method === 'POST')).toBe(false);
  });
  it('rejects two enabled IDs with the same displayed name', async () => {
    const config = [
      {
        id: 'chat',
        models: [
          {
            id: 'claude-test',
            name: 'Test',
            disabled: false,
            disabled_reason: null,
            section: 'main',
          },
          { id: 'other', name: ' Test ', section: 'main' },
        ],
      },
    ];
    const fetch = setup(undefined, undefined, undefined, config);
    await expect(claudeProbe(choice, new AbortController().signal)).rejects.toMatchObject({
      cause: 'catalog',
    });
    expect(fetch.mock.calls.some(([, init]) => init.method === 'POST')).toBe(false);
  });
  it('accepts explicit enabled metadata without treating a disabled namesake as available', async () => {
    const config = [
      {
        id: 'chat',
        models: [
          {
            id: 'claude-test',
            name: 'Test',
            disabled: false,
            disabled_reason: null,
            section: 'main',
          },
          { id: 'other', name: 'Test', disabled: true, section: 'main' },
        ],
      },
    ];
    const fetch = setup(undefined, undefined, undefined, config);
    await expect(claudeProbe(choice, new AbortController().signal)).resolves.toBe(
      '한CROSSCHECK_OK',
    );
    expect(fetch.mock.calls.filter(([, init]) => init.method === 'POST')).toHaveLength(1);
  });
  it('rejects aborted confirmation before POST', async () => {
    const fetch = setup();
    const controller = new AbortController();
    menu.mockImplementation(async () => {
      controller.abort();
      return choice;
    });
    await expect(claudeProbe(choice, controller.signal)).rejects.toThrow('Claude probe failed.');
    expect(fetch.mock.calls.some(([, init]) => init.method === 'POST')).toBe(false);
  });
  it('refuses wrong origin before network', async () => {
    const fetch = setup();
    vi.stubGlobal('location', { origin: 'https://evil.test', href: 'https://evil.test' });
    await expect(claudeProbe(choice, new AbortController().signal)).rejects.toThrow(
      'Claude probe failed.',
    );
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each(
    [
      [],
      [
        { uuid: org, capabilities: ['chat'] },
        { uuid: org, capabilities: ['chat'] },
      ],
      [{ uuid: 'unsafe/path', capabilities: ['chat'] }],
      [{ uuid: org }],
    ].map((value) => [value]),
  )('refuses ambiguous/invalid organizations', async (orgs) => {
    const fetch = setup(orgs);
    await expect(claudeProbe(choice, new AbortController().signal)).rejects.toThrow(
      'Claude probe failed.',
    );
    expect(fetch.mock.calls.some(([, o]) => o.method === 'POST')).toBe(false);
  });
  it.each(
    [
      [],
      [{ model_id: 'other' }],
      [{ model_id: 'claude-test' }, { model_id: 'claude-test' }],
      [{ model_id: 'unsafe/path' }],
    ].map((value) => [value]),
  )('refuses unavailable/ambiguous model metadata', async (models) => {
    const fetch = setup(undefined, models);
    await expect(claudeProbe(choice, new AbortController().signal)).rejects.toThrow(
      'Claude probe failed.',
    );
    expect(fetch.mock.calls.some(([, o]) => o.method === 'POST')).toBe(false);
  });
  it('refuses POST after same-origin navigation during metadata lookup', async () => {
    const fetch = setup();
    const request = fetch.getMockImplementation()!;
    fetch.mockImplementation(async (url, init) => {
      const response = await request(url, init);
      if (fetch.mock.calls.length === 2) location.href = 'https://claude.ai/chat/other';
      return response;
    });
    await expect(claudeProbe(choice, new AbortController().signal)).rejects.toThrow(
      /^Claude probe failed\.$/,
    );
    expect(fetch.mock.calls.filter(([, init]) => init.method === 'POST')).toHaveLength(0);
  });
  it('does not retry a failed completion POST', async () => {
    const fetch = setup();
    const send = fetch.getMockImplementation()!;
    fetch.mockImplementation(async (url, init) => {
      if (init.method === 'POST') throw new Error('private account error');
      return send(url, init);
    });
    await expect(claudeProbe(choice, new AbortController().signal)).rejects.toThrow(
      /^Claude probe failed\.$/,
    );
    expect(fetch.mock.calls.filter(([, init]) => init.method === 'POST')).toHaveLength(1);
  });
  it('sanitizes network failure without retry', async () => {
    const fetch = setup();
    fetch.mockRejectedValue(new Error('private token'));
    await expect(claudeProbe(choice, new AbortController().signal)).rejects.toThrow(
      /^Claude probe failed\.$/,
    );
    expect(fetch).toHaveBeenCalledOnce();
  });
  it('reports only a fixed catalog stage for null model metadata without sending', async () => {
    const fetch = setup(undefined, null);
    const failure = await claudeProbe(choice, new AbortController().signal).catch((e) => e);
    expect(failure.message).toBe('Claude probe failed.');
    expect(failure.cause).toBe('catalog');
    expect(fetch.mock.calls.some(([, o]) => o.method === 'POST')).toBe(false);
  });
  it('distinguishes ambiguous organization metadata before any POST', async () => {
    const fetch = setup([
      { uuid: org, capabilities: ['chat'] },
      { uuid: org, capabilities: ['chat'] },
    ]);
    const failure = await claudeProbe(choice, new AbortController().signal).catch((e) => e);
    expect(failure.message).toBe('Claude probe failed.');
    expect(failure.cause).toBe('account-selection');
    expect(fetch).toHaveBeenCalledOnce();
  });
  it.each([
    { part: 'conversation', change: { uuid: human } },
    { part: 'conversation', change: { current_leaf_message_uuid: human } },
    { part: 'human', change: { uuid: assistant } },
    { part: 'human', change: { text: 'different prompt' } },
    { part: 'human', change: { content: [{ type: 'text', text: 'different prompt' }] } },
    { part: 'human', change: { sender: 'assistant' } },
    { part: 'human', change: { truncated: true } },
    { part: 'assistant', change: { uuid: human } },
    { part: 'assistant', change: { parent_message_uuid: assistant } },
    { part: 'assistant', change: { text: 'different answer' } },
    { part: 'assistant', change: { text: null } },
    { part: 'assistant', change: { content: null } },
    { part: 'assistant', change: { content: [{ type: 'text', text: 'different answer' }] } },
    { part: 'assistant', change: { stop_reason: 'max_tokens' } },
    { part: 'assistant', change: { truncated: true } },
    { part: 'assistant', change: { content: [{ type: 'thinking', text: 'private' }] } },
    { part: 'assistant', change: { attachments: [{}] } },
    { part: 'conversation', change: { chat_messages: [] } },
  ])(
    'rejects unbound or incomplete conversation readback %# without retry',
    async ({ part, change }) => {
      const fetch = setup();
      const request = fetch.getMockImplementation()!;
      fetch.mockImplementation(async (url, init) => {
        const response = await request(url, init);
        if (init.method !== 'GET' || !url.includes('/chat_conversations/')) return response;
        const value = await response.json();
        Object.assign(
          part === 'conversation' ? value : value.chat_messages[part === 'human' ? 0 : 1],
          change,
        );
        return new Response(JSON.stringify(value));
      });
      await expect(claudeProbe(choice, new AbortController().signal)).rejects.toMatchObject({
        cause: 'response-confirmation',
      });
      expect(fetch.mock.calls.filter(([, init]) => init.method === 'POST')).toHaveLength(1);
    },
  );
  it.each(['claude-test', 'other'])(
    'requires the requested saved model with consistent populated legacy text (%s)',
    async (savedModel) => {
      const fetch = setup();
      const request = fetch.getMockImplementation()!;
      fetch.mockImplementation(async (url, init) => {
        const response = await request(url, init);
        if (init.method !== 'GET' || !url.includes('/chat_conversations/')) return response;
        const value = await response.json();
        value.model = savedModel;
        for (const message of value.chat_messages)
          message.text = message.content.map((block: { text: string }) => block.text).join('');
        return new Response(JSON.stringify(value));
      });
      const result = claudeProbe(choice, new AbortController().signal);
      if (savedModel === 'claude-test') await expect(result).resolves.toBe('한CROSSCHECK_OK');
      else await expect(result).rejects.toMatchObject({ cause: 'response-confirmation' });
    },
  );
  it('never fetches readback for an incomplete stream', async () => {
    const fetch = setup();
    const request = fetch.getMockImplementation()!;
    fetch.mockImplementation(async (url, init) =>
      init.method === 'POST'
        ? new Response(events().slice(0, -1).join(''), {
            headers: { 'content-type': 'text/event-stream' },
          })
        : request(url, init),
    );
    await expect(claudeProbe(choice, new AbortController().signal)).rejects.toThrow(
      'Claude probe failed.',
    );
    expect(
      fetch.mock.calls.filter(
        ([url, init]) => init.method === 'GET' && url.includes('/chat_conversations/'),
      ),
    ).toHaveLength(0);
  });
  it.each(['navigation', 'abort'])(
    'rejects %s during readback without a second send',
    async (change) => {
      const fetch = setup();
      const request = fetch.getMockImplementation()!;
      const controller = new AbortController();
      fetch.mockImplementation(async (url, init) => {
        const response = await request(url, init);
        if (init.method === 'GET' && url.includes('/chat_conversations/')) {
          if (change === 'abort') controller.abort();
          else location.href = 'https://claude.ai/chat/changed';
        }
        return response;
      });
      await expect(claudeProbe(choice, controller.signal)).rejects.toMatchObject({
        cause: change === 'abort' ? 'interrupted' : 'response-confirmation',
      });
      expect(fetch.mock.calls.filter(([, init]) => init.method === 'POST')).toHaveLength(1);
    },
  );
  it('reports access denial without exposing the response body', async () => {
    const fetch = setup();
    fetch.mockResolvedValueOnce(new Response('private account information', { status: 403 }));
    const failure = await claudeProbe(choice, new AbortController().signal).catch((e) => e);
    expect(failure.message).toBe('Claude probe failed.');
    expect(failure.cause).toBe('access');
    expect(fetch).toHaveBeenCalledOnce();
  });
  it('propagates a fixed parser stage from the completion without retrying', async () => {
    const fetch = setup();
    const request = fetch.getMockImplementation()!;
    fetch.mockImplementation(async (url, init) =>
      init.method === 'POST'
        ? new Response('event: unknown\ndata: {"private":"never expose"}\n\n', {
            headers: { 'content-type': 'text/event-stream' },
          })
        : request(url, init),
    );
    await expect(claudeProbe(choice, new AbortController().signal)).rejects.toMatchObject({
      message: 'Claude probe failed.',
      cause: 'response-event',
    });
    expect(fetch.mock.calls.filter(([, init]) => init.method === 'POST')).toHaveLength(1);
  });
  it('uses the unique chat-capable organization instead of the first organization', async () => {
    const fetch = setup([
      { uuid: human, capabilities: ['api'] },
      { uuid: org, capabilities: ['chat'] },
    ]);
    await expect(claudeProbe(choice, new AbortController().signal)).resolves.toBe(
      '한CROSSCHECK_OK',
    );
    expect(fetch.mock.calls[1]?.[0]).toBe(
      `/edge-api/bootstrap/${org}/app_start?statsig_hashing_algorithm=djb2&growthbook_format=sdk&cache_bust=1&include_system_prompts=false`,
    );
    expect(fetch.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(1);
  });
});
