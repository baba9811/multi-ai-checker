import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import bootstrapBridge from '../../../entrypoints/bridge';
import { LIMITS } from '../../../src/domains/crosscheck/model';
import {
  finishedMarker,
  isBusy,
  questions,
  replies,
  submit,
} from '../../../src/infrastructure/providers/dom';

vi.mock('wxt/utils/define-unlisted-script', () => ({
  defineUnlistedScript: (start: () => unknown) => start,
}));
vi.mock('../../../src/infrastructure/providers/dom', () => ({
  assertTarget: vi.fn(),
  finishedMarker: vi.fn(() => true),
  isBusy: vi.fn(() => true),
  replies: vi.fn(() => []),
  questions: vi.fn(() => []),
  settledSnapshot: vi.fn(),
  snapshot: vi.fn(),
  submit: vi.fn(async () => {}),
  textOf: (element?: { text: string }) => element?.text ?? '',
  messageKey: (element: { key: string }) => element.key,
  matchesQuestion: (_provider: string, element: { text: string } | undefined, prompt: string) =>
    element?.text.replace(/\s+/g, ' ') === prompt.trim().replace(/\s+/g, ' '),
}));

const sender = { id: 'fixture', url: 'chrome-extension://fixture/sidepanel.html' };
let message: Parameters<typeof chrome.runtime.onMessage.addListener>[0];
let connect: Parameters<typeof chrome.runtime.onConnect.addListener>[0] | undefined;
const request = (value: object) => new Promise<any>((resolve) => message(value, sender, resolve));
const send = (id = 'job') =>
  request({
    type: 'send',
    id,
    documentId: 'document',
    url: 'https://chatgpt.com/',
    prompt: 'Public synthetic prompt',
  });
function collector(id = 'job', source = sender) {
  const listeners = new Set<() => void>();
  const port = {
    name: `crosscheck-collector:${id}`,
    sender: source,
    postMessage: vi.fn(),
    onDisconnect: { addListener: (listener: () => void) => listeners.add(listener) },
    disconnect: vi.fn(() => {
      for (const listener of listeners) listener();
    }),
  };
  connect?.(port as unknown as chrome.runtime.Port);
  return port;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  vi.mocked(questions).mockReturnValue([]);
  vi.mocked(replies).mockReturnValue([]);
  vi.mocked(isBusy).mockReturnValue(true);
  vi.mocked(finishedMarker).mockReturnValue(true);
  vi.mocked(submit).mockResolvedValue(undefined);
  vi.spyOn(crypto, 'randomUUID').mockReturnValue(
    'document' as `${string}-${string}-${string}-${string}-${string}`,
  );
  const win = new EventTarget();
  vi.stubGlobal('window', Object.assign(win, { top: win }));
  vi.stubGlobal('document', new EventTarget());
  vi.stubGlobal('location', { href: 'https://chatgpt.com/' });
  vi.stubGlobal('__crosscheckInstalled', false);
  connect = undefined;
  vi.stubGlobal('chrome', {
    runtime: {
      id: 'fixture',
      getURL: (path: string) => `chrome-extension://fixture/${path}`,
      onMessage: { addListener: (listener: typeof message) => (message = listener) },
      onConnect: { addListener: (listener: typeof connect) => (connect = listener) },
    },
  });
  (bootstrapBridge as unknown as () => void)();
});
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('keeps a live panel collector through a polling gap and collects exactly one completed answer', async () => {
  collector();
  expect((await send()).ok).toBe(true);
  await vi.advanceTimersByTimeAsync(26000);
  expect((await request({ type: 'poll', id: 'job' })).data.status).toBe('pending');
  vi.mocked(questions).mockReturnValue([
    { key: 'question', text: 'Public synthetic prompt' },
  ] as unknown as HTMLElement[]);
  vi.mocked(replies).mockReturnValue([
    { key: 'answer', text: 'Completed synthetic answer' },
  ] as unknown as HTMLElement[]);
  vi.mocked(isBusy).mockReturnValue(false);
  await vi.advanceTimersByTimeAsync(3600);
  expect((await request({ type: 'poll', id: 'job' })).data).toMatchObject({
    status: 'done',
    answer: 'Completed synthetic answer',
  });
  expect(submit).toHaveBeenCalledTimes(1);
});

it('stops the matching pending collector on a real port disconnection without resending', async () => {
  const port = collector();
  await send();
  port.disconnect();
  expect((await request({ type: 'poll', id: 'job' })).data).toMatchObject({
    status: 'error',
    error: expect.stringContaining('패널 연결이 끊겨'),
  });
  expect((await send()).ok).toBe(false);
  expect(submit).toHaveBeenCalledTimes(1);
});

it('requires the matching live collector before starting a send', async () => {
  collector('other-job');
  expect((await send()).ok).toBe(false);
  expect(submit).not.toHaveBeenCalled();
});

it('does not start after a collector disconnects before Send', async () => {
  collector().disconnect();
  expect((await send()).ok).toBe(false);
  expect(submit).not.toHaveBeenCalled();
});

it('preserves the disconnection reason when an in-flight upload later rejects', async () => {
  let rejectUpload!: (error: Error) => void;
  vi.mocked(submit).mockReturnValue(new Promise((_, reject) => (rejectUpload = reject)));
  const port = collector();
  await send();
  port.disconnect();
  rejectUpload(new Error('Synthetic upload interrupted'));
  await vi.advanceTimersByTimeAsync(0);
  expect((await request({ type: 'poll', id: 'job' })).data).toMatchObject({
    status: 'error',
    error: expect.stringContaining('패널 연결이 끊겨'),
  });
  expect(submit).toHaveBeenCalledTimes(1);
});

it.each([
  { id: 'other-extension', url: sender.url },
  { id: sender.id, url: 'https://chatgpt.com/' },
  { id: sender.id, url: 'chrome-extension://fixture/untrusted.html' },
])('rejects a collector from an untrusted sender %j', async (source) => {
  const port = collector('job', source);
  expect((await send()).ok).toBe(false);
  expect(port.disconnect).toHaveBeenCalledTimes(1);
  expect(submit).not.toHaveBeenCalled();
});

it('refuses a duplicate collector without replacing the original lifecycle owner', async () => {
  const original = collector();
  const duplicate = collector();
  expect(duplicate.disconnect).toHaveBeenCalledTimes(1);
  expect(original.disconnect).not.toHaveBeenCalled();
  expect((await send()).ok).toBe(true);
  duplicate.disconnect();
  expect((await request({ type: 'poll', id: 'job' })).data.status).toBe('pending');
  original.disconnect();
  expect((await request({ type: 'poll', id: 'job' })).data.status).toBe('error');
});

it('retains the three minute collection deadline with a live collector', async () => {
  collector();
  await send();
  await vi.advanceTimersByTimeAsync(LIMITS.timeoutMs + 600);
  expect((await request({ type: 'poll', id: 'job' })).data).toMatchObject({
    status: 'error',
    error: expect.stringContaining('3분'),
  });
  expect(submit).toHaveBeenCalledTimes(1);
});
