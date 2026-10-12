import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  collectClaudeProbeStream,
  claudeProbe,
  CLAUDE_PROBE_PROMPT,
} from '../../../src/infrastructure/providers/claude/probe';
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
  collectClaudeProbeStream(stream(text), human, assistant, signal);
afterEach(() => vi.unstubAllGlobals());
describe('Claude probe stream', () => {
  it('rejects split UTF-8 completion without message_stop', async () => {
    await expect(collect(events().slice(0, -1).join(''))).rejects.toThrow('Claude probe failed.');
  });
  it('collects split UTF-8 only after bound complete response', async () => {
    await expect(collect(events().join(''))).resolves.toBe('한CROSSCHECK_OK');
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
    ).resolves.toBe('한CROSSCHECK_OK');
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
        human,
        assistant,
        new AbortController().signal,
      ),
    ).rejects.toThrow('Claude probe failed.');
  });
  it('cancels a waiting reader on abort', async () => {
    const c = new AbortController();
    const cancel = vi.fn();
    const pending = collectClaudeProbeStream(
      new ReadableStream({ cancel }),
      human,
      assistant,
      c.signal,
    );
    c.abort();
    await expect(pending).rejects.toThrow('Claude probe failed.');
    expect(cancel).toHaveBeenCalledOnce();
  });
});
describe('Claude page-local request', () => {
  const org = '33333333-3333-4333-8333-333333333333';
  function setup(
    organizations: unknown = [{ uuid: org, capabilities: ['chat'] }],
    models: unknown = [{ model: 'claude-test', name: 'Test', inactive: false, overflow: false }],
  ) {
    vi.stubGlobal('location', { href: 'https://claude.ai/new', origin: 'https://claude.ai' });
    const fetch = vi.fn(async (_url: string, init: RequestInit) => {
      if (init.method !== 'POST')
        return new Response(
          JSON.stringify(
            fetch.mock.calls.length === 1
              ? organizations
              : { claude_ai_bootstrap_models_config: models },
          ),
        );
      const body = JSON.parse(init.body as string);
      const e = events();
      e[0] = event('message_start', {
        message: {
          uuid: body.turn_message_uuids.assistant_message_uuid,
          parent_uuid: body.turn_message_uuids.human_message_uuid,
          role: 'assistant',
        },
      });
      return new Response(e.join(''), { headers: { 'content-type': 'text/event-stream' } });
    });
    vi.stubGlobal('fetch', fetch);
    return fetch;
  }
  it('uses fixed same-origin GETs then one fixed completion POST', async () => {
    const fetch = setup();
    await expect(claudeProbe(' Test ', new AbortController().signal)).resolves.toBe(
      '한CROSSCHECK_OK',
    );
    expect(fetch).toHaveBeenCalledTimes(3);
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
  });
  it('refuses wrong origin before network', async () => {
    const fetch = setup();
    vi.stubGlobal('location', { origin: 'https://evil.test', href: 'https://evil.test' });
    await expect(claudeProbe('Test', new AbortController().signal)).rejects.toThrow(
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
    await expect(claudeProbe('Test', new AbortController().signal)).rejects.toThrow(
      'Claude probe failed.',
    );
    expect(fetch.mock.calls.some(([, o]) => o.method === 'POST')).toBe(false);
  });
  it.each(
    [
      [],
      [{ model: 'a', name: 'Test', inactive: true }],
      [
        { model: 'a', name: 'Test' },
        { model: 'b', name: 'Test' },
      ],
      [{ model: 'a', name: 'Test Extended' }],
    ].map((value) => [value]),
  )('refuses unavailable/ambiguous model metadata', async (models) => {
    const fetch = setup(undefined, models);
    await expect(claudeProbe('Test', new AbortController().signal)).rejects.toThrow(
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
    await expect(claudeProbe('Test', new AbortController().signal)).rejects.toThrow(
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
    await expect(claudeProbe('Test', new AbortController().signal)).rejects.toThrow(
      /^Claude probe failed\.$/,
    );
    expect(fetch.mock.calls.filter(([, init]) => init.method === 'POST')).toHaveLength(1);
  });
  it('sanitizes network failure without retry', async () => {
    const fetch = setup();
    fetch.mockRejectedValue(new Error('private token'));
    await expect(claudeProbe('Test', new AbortController().signal)).rejects.toThrow(
      /^Claude probe failed\.$/,
    );
    expect(fetch).toHaveBeenCalledOnce();
  });
  it('reports only a fixed catalog stage for null model metadata without sending', async () => {
    const fetch = setup(undefined, null);
    const failure = await claudeProbe('Test', new AbortController().signal).catch((e) => e);
    expect(failure.message).toBe('Claude probe failed.');
    expect(failure.cause).toBe('catalog');
    expect(fetch.mock.calls.some(([, o]) => o.method === 'POST')).toBe(false);
  });
  it('distinguishes ambiguous organization metadata before any POST', async () => {
    const fetch = setup([
      { uuid: org, capabilities: ['chat'] },
      { uuid: org, capabilities: ['chat'] },
    ]);
    const failure = await claudeProbe('Test', new AbortController().signal).catch((e) => e);
    expect(failure.message).toBe('Claude probe failed.');
    expect(failure.cause).toBe('account-selection');
    expect(fetch).toHaveBeenCalledOnce();
  });
  it('reports access denial without exposing the response body', async () => {
    const fetch = setup();
    fetch.mockResolvedValueOnce(new Response('private account information', { status: 403 }));
    const failure = await claudeProbe('Test', new AbortController().signal).catch((e) => e);
    expect(failure.message).toBe('Claude probe failed.');
    expect(failure.cause).toBe('access');
    expect(fetch).toHaveBeenCalledOnce();
  });
  it('uses the unique chat-capable organization instead of the first organization', async () => {
    const fetch = setup([
      { uuid: human, capabilities: ['api'] },
      { uuid: org, capabilities: ['chat'] },
    ]);
    await expect(claudeProbe('Test', new AbortController().signal)).resolves.toBe(
      '한CROSSCHECK_OK',
    );
    expect(fetch.mock.calls[1]?.[0]).toBe(`/api/organizations/${org}`);
    expect(fetch.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(1);
  });
});
