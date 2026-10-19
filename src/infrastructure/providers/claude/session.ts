import type { ClaudeProbeReason } from '../../../application/claude-probe';
import { readClaudeProbeLabel } from '../models';
const FAILURE = 'Claude probe failed.';
const RESPONSE_STAGES = [
  'response-event',
  'response-metadata',
  'response-binding',
  'response-role',
  'response-block',
  'response-terminal',
] as const;
const METADATA_EVENTS = ['ping', 'message_limit', 'conversation_ready', 'cache_performance'];
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function fail(): never {
  throw new Error(FAILURE);
}
export const record = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fail();
  return value as Record<string, unknown>;
};

export async function collectClaudeStream(
  stream: ReadableStream<Uint8Array>,
  signal: AbortSignal,
  model: string,
  answerLimit: number,
): Promise<{ answer: string; human: string; assistant: string }> {
  let stage: (typeof RESPONSE_STAGES)[number] = 'response-event';
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
  let human = '',
    assistant = '';
  const blocks = new Map<number, boolean>();
  function frame(raw: string) {
    stage = 'response-event';
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
    if (stopped) fail();
    if (METADATA_EVENTS.includes(name)) return;
    const value = record(JSON.parse(data.join('\n')));
    if (typeof value.type !== 'string' || !value.type || (name && value.type !== name) || stopped)
      fail();
    name ||= value.type;
    if (METADATA_EVENTS.includes(name)) return;
    if (name === 'message_start') {
      stage = 'response-binding';
      const message = record(value.message);
      if (message.model !== undefined && message.model !== model) fail();
      if (
        started ||
        typeof message.uuid !== 'string' ||
        !UUID.test(message.uuid) ||
        typeof message.parent_uuid !== 'string' ||
        !UUID.test(message.parent_uuid) ||
        message.uuid === message.parent_uuid
      )
        fail();
      stage = 'response-role';
      if (
        (message.role !== undefined && message.role !== 'assistant') ||
        (message.sender !== undefined && message.sender !== 'assistant')
      )
        fail();
      human = message.parent_uuid;
      assistant = message.uuid;
      started = true;
      return;
    }
    if (!started) fail();
    if (name === 'message_delta') {
      stage = 'response-terminal';
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
      stage = 'response-terminal';
      if (!ended || !text.trim()) fail();
      stopped = true;
      return;
    }
    if (ended) {
      stage = 'response-terminal';
      fail();
    }
    if (['content_block_start', 'content_block_delta', 'content_block_stop'].includes(name))
      stage = 'response-block';
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
    if (text.length > answerLimit) fail();
  }
  try {
    for (;;) {
      if (signal.aborted) fail();
      const chunk = await reader.read();
      if (signal.aborted) fail();
      if (chunk.done) {
        stage = 'response-terminal';
        buffer += decoder.decode();
        break;
      }
      bytes += chunk.value.byteLength;
      stage = 'response-event';
      if (bytes > 1048576) fail();
      buffer += decoder.decode(chunk.value, { stream: true });
      let separator: RegExpExecArray | null;
      while ((separator = /\r\n\r\n|\n\n|\r\r/.exec(buffer))) {
        frame(buffer.slice(0, separator.index));
        buffer = buffer.slice(separator.index + separator[0].length);
      }
      if (stopped) {
        stage = 'response-terminal';
        if (buffer.trim()) fail();
        return { answer: text, human, assistant };
      }
    }
    stage = 'response-terminal';
    return fail();
  } catch {
    throw new Error(FAILURE, { cause: signal.aborted ? 'interrupted' : stage });
  } finally {
    signal.removeEventListener('abort', abort);
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export type ClaudeOriginals = {
  prepare(
    org: string,
    model: Record<string, unknown>,
    request: (path: string, body?: unknown) => Promise<Response>,
    json: (response: Response) => Promise<unknown>,
  ): Promise<{ attachments: unknown[]; files: string[] }>;
  verify(
    message: Record<string, unknown>,
    turn: number,
  ): { attachments: unknown[]; files: unknown[] };
};
export function createClaudeSession(
  initialLabel: string,
  policy: {
    answerLimit: number;
    historyBytes: number;
    strictRoot: boolean;
    expected?: readonly string[];
    failure: string;
  },
) {
  const initialUrl = location.href;
  const normalize = (name: string) => name.replace(/\s+/g, ' ').trim();
  const label = normalize(initialLabel);
  let stage: ClaudeProbeReason = 'page';
  let signal: AbortSignal;
  let initialized = false,
    terminal = false,
    busy = false;
  let org = '',
    model = '';
  let selectedModel: Record<string, unknown> = {};
  const conversation = crypto.randomUUID();
  const usedIds = new Set<string>([conversation]);
  type Turn = Awaited<ReturnType<typeof collectClaudeStream>> & { prompt: string };
  const turns: Turn[] = [];
  let firstPair: string | undefined;
  let originals: ClaudeOriginals | undefined;
  async function request(path: string, body?: unknown): Promise<Response> {
    if (signal.aborted || location.origin !== 'https://claude.ai' || location.href !== initialUrl)
      fail();
    const multipart = body instanceof FormData;
    const response = await fetch(path, {
      method: body ? 'POST' : 'GET',
      credentials: 'same-origin',
      redirect: 'error',
      signal,
      headers:
        body && !multipart
          ? {
              'Content-Type': 'application/json',
              Accept: 'text/event-stream',
              'anthropic-client-platform': 'web_claude_ai',
            }
          : { Accept: 'application/json' },
      ...(body ? { body: multipart ? body : JSON.stringify(body) } : {}),
    });
    if (response.status === 401 || response.status === 403) stage = 'access';
    if (!response.ok || response.redirected || signal.aborted) fail();
    return response;
  }
  async function json(path: string, byteLimit = 1048576): Promise<unknown> {
    return responseJson(await request(path), byteLimit);
  }
  async function responseJson(response: Response, byteLimit = 1048576): Promise<unknown> {
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
        if (size > byteLimit) fail();
        data += decoder.decode(chunk.value, { stream: true });
      }
      return JSON.parse(data + decoder.decode());
    } finally {
      signal.removeEventListener('abort', abort);
      await reader.cancel().catch(() => {});
      reader.releaseLock();
    }
  }
  async function initialize() {
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
    org = eligible[0]!.uuid as string;
    if (typeof org !== 'string' || !UUID.test(org)) fail();
    stage = 'catalog';
    const bootstrap = record(
      await json(
        `/edge-api/bootstrap/${org}/app_start?statsig_hashing_algorithm=djb2&growthbook_format=sdk&cache_bust=1&include_system_prompts=false`,
      ),
    );
    if (!label || label.length > 160) fail();
    function chatSelector(value: unknown) {
      if (!Array.isArray(value)) return fail();
      const chat = value.map(record).filter((entry) => entry.id === 'chat');
      if (chat.length !== 1) return fail();
      return chat[0]!;
    }
    const state = chatSelector(bootstrap.model_selector_state);
    const config = chatSelector(bootstrap.model_selector_config);
    const validId = (id: unknown): id is string =>
      typeof id === 'string' && /^[a-z0-9][a-z0-9._-]{0,127}$/i.test(id);
    if (!validId(state.model) || !Array.isArray(config.models)) fail();
    const configured = config.models.map(record);
    const configuredIds = configured.map((entry) => entry.id);
    if (
      configuredIds.some((id) => !validId(id)) ||
      new Set(configuredIds).size !== configuredIds.length
    )
      fail();
    const matching = configured.filter(
      (entry) =>
        (entry.disabled === undefined || entry.disabled === false) &&
        (entry.disabled_reason === undefined || entry.disabled_reason === null) &&
        (entry.section === undefined ||
          (typeof entry.section === 'string' &&
            !['legacy', 'deprecated'].includes(entry.section))) &&
        typeof entry.name === 'string' &&
        normalize(entry.name) === label,
    );
    if (matching.length !== 1 || matching[0]!.id !== state.model) fail();
    model = state.model;
    const available = record(bootstrap.claude_ai_available_models).models;
    if (!Array.isArray(available)) fail();
    const ids = available.map((entry) => record(entry).model_id);
    if (
      ids.some((id) => !validId(id)) ||
      new Set(ids).size !== ids.length ||
      ids.filter((id) => id === model).length !== 1
    )
      fail();
    selectedModel = matching[0]!;
    initialized = true;
  }
  async function complete(
    prompt: string,
    payload: { attachments: unknown[]; files: string[] },
    parent?: string,
  ): Promise<Turn> {
    const opus = model === 'claude-opus-5';
    stage = 'send';
    const human = crypto.randomUUID(),
      assistant = crypto.randomUUID();
    if (
      !UUID.test(human) ||
      !UUID.test(assistant) ||
      human === assistant ||
      usedIds.has(human) ||
      usedIds.has(assistant)
    )
      fail();
    const response = await request(
      `/api/organizations/${org}/chat_conversations/${conversation}/completion`,
      {
        prompt,
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
        attachments: payload.attachments,
        files: payload.files,
        sync_sources: [],
        rendering_mode: 'messages',
        effort: opus ? 'high' : 'low',
        thinking_mode: opus ? 'auto' : 'off',
        turn_message_uuids: { human_message_uuid: human, assistant_message_uuid: assistant },
        ...(parent
          ? { parent_message_uuid: parent }
          : {
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
            }),
      },
    );
    stage = 'response';
    if (
      !response.body ||
      !response.headers.get('content-type')?.toLowerCase().startsWith('text/event-stream')
    )
      fail();
    const completed = await collectClaudeStream(response.body, signal, model, policy.answerLimit);
    stage = 'response-binding';
    if (usedIds.has(completed.human) || usedIds.has(completed.assistant)) fail();
    for (const id of [human, assistant, completed.human, completed.assistant]) usedIds.add(id);
    if (policy.expected) {
      stage = 'response-context';
      if (completed.answer !== policy.expected[turns.length]) fail();
    }
    return { ...completed, prompt };
  }
  async function verifyConversation() {
    stage = 'response-confirmation';
    const saved = record(
      await json(
        `/api/organizations/${org}/chat_conversations/${conversation}?tree=True&rendering_mode=messages&render_all_tools=true&include_inline_comparison=true`,
        policy.historyBytes,
      ),
    );
    if (
      saved.uuid !== conversation ||
      saved.model !== model ||
      saved.current_leaf_message_uuid !== turns.at(-1)!.assistant ||
      !Array.isArray(saved.chat_messages) ||
      saved.chat_messages.length !== turns.length * 2
    )
      fail();
    const messages = saved.chat_messages.map(record);
    if (new Set(messages.map((message) => message.uuid)).size !== messages.length) fail();
    for (const [index, turn] of turns.entries()) {
      const user = messages.find((message) => message.uuid === turn.human);
      const reply = messages.find((message) => message.uuid === turn.assistant);
      if (
        !user ||
        !reply ||
        user.sender !== 'human' ||
        reply.sender !== 'assistant' ||
        reply.parent_message_uuid !== turn.human ||
        reply.stop_reason !== 'end_turn' ||
        (index > 0 && user.parent_message_uuid !== turns[index - 1]!.assistant)
      )
        fail();
      const pair = [user, reply];
      let verifiedOriginals: { attachments: unknown[]; files: unknown[] } | undefined;
      for (const message of pair) {
        if (
          message.truncated !== false ||
          typeof message.text !== 'string' ||
          !Array.isArray(message.content)
        )
          fail();
        const content = message.content.map(record);
        if (content.some((block) => block.type !== 'text' || typeof block.text !== 'string'))
          fail();
        const text = content.map((block) => block.text).join('');
        if (
          text !== (message === user ? turn.prompt : turn.answer) ||
          (message.text !== '' && message.text !== text)
        )
          fail();
        if (message === user && originals) verifiedOriginals = originals.verify(message, index);
        else
          for (const key of ['attachments', 'files', 'sync_sources'])
            if (!Array.isArray(message[key]) || message[key].length !== 0) fail();
      }
      if (index === 0 && policy.strictRoot) {
        const root = user.parent_message_uuid;
        if (root !== undefined && root !== null && root !== '00000000-0000-4000-8000-000000000000')
          fail();
        // Preserve the validated identity, parent, content representation and completion fields.
        const snapshot = JSON.stringify(
          pair.map((message) => ({
            uuid: message.uuid,
            sender: message.sender,
            parent: message.parent_message_uuid,
            text: message.text,
            content: (message.content as Record<string, unknown>[]).map((block) => block.text),
            stop: message.stop_reason,
            truncated: message.truncated,
            attachments:
              message === user
                ? (verifiedOriginals?.attachments ?? message.attachments)
                : message.attachments,
            files: message === user ? (verifiedOriginals?.files ?? message.files) : message.files,
            sync_sources: message.sync_sources,
          })),
        );
        if (firstPair !== undefined && snapshot !== firstPair) fail();
        firstPair = snapshot;
      }
    }
    if (signal.aborted || location.href !== initialUrl || location.origin !== 'https://claude.ai')
      fail();
  }
  return {
    async send(
      prompt: string,
      nextSignal: AbortSignal,
      nextOriginals?: ClaudeOriginals,
    ): Promise<string> {
      if (terminal || busy || turns.length >= 2) throw new Error(policy.failure, { cause: 'send' });
      busy = true;
      signal = nextSignal;
      stage = 'page';
      try {
        if (
          location.origin !== 'https://claude.ai' ||
          new URL(location.href).origin !== 'https://claude.ai' ||
          location.href !== initialUrl ||
          signal.aborted
        )
          fail();
        if (!initialized) await initialize();
        if (turns.length) await verifyConversation();
        stage = 'model-confirmation';
        if (
          signal.aborted ||
          location.href !== initialUrl ||
          normalize(await readClaudeProbeLabel()) !== label
        )
          fail();
        let payload = { attachments: [] as unknown[], files: [] as string[] };
        if (!turns.length && nextOriginals) {
          originals = nextOriginals;
          stage = 'send';
          payload = await originals.prepare(org, selectedModel, request, responseJson);
          stage = 'model-confirmation';
          if (
            signal.aborted ||
            location.href !== initialUrl ||
            normalize(await readClaudeProbeLabel()) !== label
          )
            fail();
        }
        turns.push(await complete(prompt, payload, turns.at(-1)?.assistant));
        await verifyConversation();
        return turns.at(-1)!.answer;
      } catch (error) {
        terminal = true;
        const cause =
          (stage as ClaudeProbeReason) === 'response' &&
          error instanceof Error &&
          RESPONSE_STAGES.some((reason) => reason === error.cause)
            ? error.cause
            : stage;
        throw new Error(policy.failure, { cause: signal.aborted ? 'interrupted' : cause });
      } finally {
        busy = false;
      }
    },
  };
}
