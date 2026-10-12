import { CLAUDE_PROBE_PROMPT, type ClaudeProbeReason } from '../../../application/claude-probe';
export { CLAUDE_PROBE_PROMPT };
const FAILURE = 'Claude probe failed.';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function fail(): never {
  throw new Error(FAILURE);
}
const record = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fail();
  return value as Record<string, unknown>;
};

export async function collectClaudeProbeStream(
  stream: ReadableStream<Uint8Array>,
  human: string,
  assistant: string,
  signal: AbortSignal,
): Promise<string> {
  const reader = stream.getReader();
  const abort = () => {
    void reader.cancel().catch(() => {});
  };
  signal.addEventListener('abort', abort, { once: true });
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let buffer = '',
    text = '',
    bytes = 0,
    started = false,
    ended = false,
    stopped = false;
  const blocks = new Map<number, boolean>();
  function frame(raw: string) {
    let name = '';
    const data: string[] = [];
    for (const line of raw.split(/\r\n|\n|\r/)) {
      if (!line || line.startsWith(':')) continue;
      if (line.startsWith('event:')) {
        if (name) fail();
        name = line.slice(6).trim();
      } else if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''));
      else fail();
    }
    if (!name && !data.length) return;
    const value = record(JSON.parse(data.join('\n')));
    if (typeof value.type !== 'string' || !value.type || (name && value.type !== name) || stopped)
      fail();
    name ||= value.type;
    if (['ping', 'message_limit', 'conversation_ready', 'cache_performance'].includes(name)) return;
    if (name === 'message_start') {
      const message = record(value.message);
      if (
        started ||
        message.uuid !== assistant ||
        message.parent_uuid !== human ||
        message.role !== 'assistant'
      )
        fail();
      started = true;
      return;
    }
    if (!started) fail();
    if (name === 'message_delta') {
      if (
        ended ||
        !blocks.size ||
        [...blocks.values()].some((open) => open) ||
        record(value.delta).stop_reason !== 'end_turn'
      )
        fail();
      ended = true;
      return;
    }
    if (name === 'message_stop') {
      if (!ended || !text.trim()) fail();
      stopped = true;
      return;
    }
    if (ended) fail();
    const index = value.index;
    if (typeof index !== 'number' || !Number.isSafeInteger(index) || index < 0) fail();
    if (name === 'content_block_start') {
      const block = record(value.content_block);
      if (blocks.has(index) || block.type !== 'text' || typeof block.text !== 'string') fail();
      blocks.set(index, true);
      text += block.text;
    } else if (name === 'content_block_delta') {
      const delta = record(value.delta);
      if (!blocks.get(index) || delta.type !== 'text_delta' || typeof delta.text !== 'string')
        fail();
      text += delta.text;
    } else if (name === 'content_block_stop') {
      if (!blocks.get(index)) fail();
      blocks.set(index, false);
    } else fail();
    if (text.length > 4096) fail();
  }
  try {
    for (;;) {
      if (signal.aborted) fail();
      const chunk = await reader.read();
      if (signal.aborted) fail();
      if (chunk.done) {
        buffer += decoder.decode();
        break;
      }
      bytes += chunk.value.byteLength;
      if (bytes > 1048576) fail();
      buffer += decoder.decode(chunk.value, { stream: true });
      let separator: RegExpExecArray | null;
      while ((separator = /\r\n\r\n|\n\n|\r\r/.exec(buffer))) {
        frame(buffer.slice(0, separator.index));
        buffer = buffer.slice(separator.index + separator[0].length);
      }
      if (stopped) {
        if (buffer.trim()) fail();
        return text;
      }
    }
    return fail();
  } catch {
    return fail();
  } finally {
    signal.removeEventListener('abort', abort);
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export async function claudeProbe(uiModel: string, signal: AbortSignal): Promise<string> {
  let stage: ClaudeProbeReason = 'page';
  try {
    const initialUrl = location.href;
    if (
      location.origin !== 'https://claude.ai' ||
      new URL(location.href).origin !== 'https://claude.ai' ||
      signal.aborted
    )
      fail();
    async function request(path: string, body?: unknown): Promise<Response> {
      if (signal.aborted || location.origin !== 'https://claude.ai' || location.href !== initialUrl)
        fail();
      const response = await fetch(path, {
        method: body ? 'POST' : 'GET',
        credentials: 'same-origin',
        redirect: 'error',
        signal,
        headers: body
          ? {
              'Content-Type': 'application/json',
              Accept: 'text/event-stream',
              'anthropic-client-platform': 'web_claude_ai',
            }
          : { Accept: 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      if (response.status === 401 || response.status === 403) stage = 'access';
      if (!response.ok || response.redirected || signal.aborted) fail();
      return response;
    }
    async function json(path: string): Promise<unknown> {
      const response = await request(path);
      if (!response.body) fail();
      const reader = response.body.getReader();
      let size = 0,
        data = '';
      const abort = () => {
        void reader.cancel().catch(() => {});
      };
      signal.addEventListener('abort', abort, { once: true });
      const decoder = new TextDecoder('utf-8', { fatal: true });
      try {
        for (;;) {
          const chunk = await reader.read();
          if (signal.aborted) fail();
          if (chunk.done) break;
          size += chunk.value.byteLength;
          if (size > 1048576) fail();
          data += decoder.decode(chunk.value, { stream: true });
        }
        return JSON.parse(data + decoder.decode());
      } finally {
        signal.removeEventListener('abort', abort);
        await reader.cancel().catch(() => {});
        reader.releaseLock();
      }
    }
    stage = 'account';
    const organizations = await json('/api/organizations');
    stage = 'account-selection';
    if (!Array.isArray(organizations)) fail();
    const eligible = organizations
      .map(record)
      .filter(
        (organization) =>
          Array.isArray(organization.capabilities) && organization.capabilities.includes('chat'),
      );
    if (eligible.length !== 1) fail();
    const org = eligible[0]!.uuid;
    if (typeof org !== 'string' || !UUID.test(org)) fail();
    stage = 'catalog';
    const models = record(
      await json(`/api/organizations/${org}`),
    ).claude_ai_bootstrap_models_config;
    const normalize = (name: string) => name.trim().replace(/\s+/g, ' ').toLowerCase();
    if (!Array.isArray(models) || !uiModel.trim()) fail();
    const matches = models
      .map(record)
      .filter(
        (model) =>
          model.inactive === false &&
          model.overflow === false &&
          typeof model.name === 'string' &&
          normalize(model.name) === normalize(uiModel),
      );
    const selected = matches[0];
    if (matches.length !== 1 || !selected) fail();
    const model = selected.model;
    if (typeof model !== 'string' || !/^[a-z0-9][a-z0-9._-]{0,127}$/i.test(model)) fail();
    const conversation = crypto.randomUUID(),
      human = crypto.randomUUID(),
      assistant = crypto.randomUUID();
    const opus = model === 'claude-opus-5';
    // Public-client protocol evidence; account rollout compatibility requires a live probe.
    stage = 'send';
    const response = await request(
      `/api/organizations/${org}/chat_conversations/${conversation}/completion`,
      {
        prompt: CLAUDE_PROBE_PROMPT,
        model,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        locale: 'en-US',
        personalized_styles: [
          {
            type: 'default',
            key: 'Default',
            name: 'Normal',
            nameKey: 'normal_style_name',
            prompt: 'Normal\n',
            summary: 'Default responses from Claude',
            summaryKey: 'normal_style_summary',
            isDefault: true,
          },
        ],
        tools: [],
        attachments: [],
        files: [],
        sync_sources: [],
        rendering_mode: 'messages',
        effort: opus ? 'high' : 'low',
        thinking_mode: opus ? 'auto' : 'off',
        turn_message_uuids: { human_message_uuid: human, assistant_message_uuid: assistant },
        create_conversation_params: {
          name: '',
          model,
          include_conversation_preferences: true,
          paprika_mode: null,
          compass_mode: null,
          is_temporary: false,
          enabled_imagine: true,
          tool_search_mode: 'auto',
        },
      },
    );
    stage = 'response';
    if (
      !response.body ||
      !response.headers.get('content-type')?.toLowerCase().startsWith('text/event-stream')
    )
      fail();
    return await collectClaudeProbeStream(response.body, human, assistant, signal);
  } catch {
    throw new Error(FAILURE, { cause: signal.aborted ? 'interrupted' : stage });
  }
}
