import { afterEach, beforeEach, expect, it, vi, type Mock } from 'vitest';
import { sendAndCollect } from '../../../src/infrastructure/chrome/provider-client';
import type { Job } from '../../../src/domains/crosscheck/model';
import { LIMITS } from '../../../src/domains/crosscheck/model';

function event<T extends (...args: any[]) => void>() {
  const listeners = new Set<T>();
  return {
    addListener: (listener: T) => listeners.add(listener),
    removeListener: (listener: T) => listeners.delete(listener),
    emit: (...args: Parameters<T>) => {
      for (const listener of listeners) listener(...args);
    },
  };
}
const target = {
  provider: 'chatgpt' as const,
  tabId: 9,
  documentId: 'document',
  url: 'https://chatgpt.com/',
};
const job: Job = {
  id: 'job',
  provider: 'chatgpt',
  stage: 'collect',
  prompt: 'Public synthetic prompt',
  status: 'ready',
  answer: '',
};
let port: {
  onMessage: ReturnType<typeof event<(value: unknown) => void>>;
  onDisconnect: ReturnType<typeof event<() => void>>;
  disconnect: ReturnType<typeof vi.fn>;
};
let connect: ReturnType<typeof vi.fn>;
let sendMessage: Mock<
  (id: number, command: { type: string }) => Promise<{ ok: boolean; data: unknown }>
>;
let controller: AbortController;
const sends = () => sendMessage.mock.calls.filter(([, command]) => command.type === 'send');

beforeEach(() => {
  vi.useFakeTimers();
  controller = new AbortController();
  port = {
    onMessage: event(),
    onDisconnect: event(),
    disconnect: vi.fn(() => port.onDisconnect.emit()),
  };
  connect = vi.fn(() => port);
  sendMessage = vi.fn(async (_id: number, command: { type: string }) => ({
    ok: true,
    data:
      command.type === 'snapshot'
        ? {
            provider: 'chatgpt',
            documentId: target.documentId,
            url: target.url,
            composer: true,
            busy: false,
            draft: false,
            truncated: false,
            lastQuestion: '',
            lastAnswer: '',
            context: { scope: 'rendered', turns: [] },
          }
        : command.type === 'poll'
          ? { status: 'done', answer: 'Completed answer', url: target.url }
          : true,
  }));
  vi.stubGlobal('chrome', {
    runtime: {},
    permissions: { contains: vi.fn(async () => true) },
    tabs: { connect, get: vi.fn(async () => ({ id: target.tabId, url: target.url })), sendMessage },
  });
});
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it('waits for the matching live collector handshake before sending and releases it on completion', async () => {
  const result = sendAndCollect(job, target, controller.signal);
  await vi.advanceTimersByTimeAsync(0);
  expect(connect).toHaveBeenCalledWith(target.tabId, {
    frameId: 0,
    name: 'crosscheck-collector:job',
  });
  expect(sends()).toHaveLength(0);
  port.onMessage.emit({ type: 'collector-ready', id: 'different-job' });
  await vi.advanceTimersByTimeAsync(0);
  expect(sends()).toHaveLength(0);
  port.onMessage.emit({ type: 'collector-ready', id: job.id });
  expect(await result).toEqual({ answer: 'Completed answer', binding: target });
  expect(sends()).toHaveLength(1);
  expect(port.disconnect).toHaveBeenCalledTimes(1);
});

it.each(['disconnect', 'abort'] as const)(
  'does not send after %s before the collector handshake',
  async (cause) => {
    const result = sendAndCollect(job, target, controller.signal).then(
      () => 'unexpected completion',
      (error: Error) => error.message,
    );
    await vi.advanceTimersByTimeAsync(0);
    if (cause === 'disconnect') port.onDisconnect.emit();
    else controller.abort();
    await vi.advanceTimersByTimeAsync(0);
    expect(await result).not.toBe('unexpected completion');
    expect(sends()).toHaveLength(0);
    expect(port.disconnect).toHaveBeenCalled();
  },
);

it('never reconnects or repeats a send after losing a pending collector', async () => {
  const original = sendMessage.getMockImplementation()!;
  sendMessage.mockImplementation(async (id: number, command: { type: string }) =>
    command.type === 'poll'
      ? { ok: true, data: { status: 'pending', answer: '' } }
      : original(id, command),
  );
  const result = sendAndCollect(job, target, controller.signal).then(
    () => 'unexpected completion',
    (error: Error) => error.message,
  );
  let outcome: string | undefined;
  void result.then((value) => (outcome = value));
  await vi.advanceTimersByTimeAsync(0);
  port.onMessage.emit({ type: 'collector-ready', id: job.id });
  await vi.advanceTimersByTimeAsync(0);
  expect(sends()).toHaveLength(1);
  port.onDisconnect.emit();
  await vi.advanceTimersByTimeAsync(1000);
  expect(outcome).toContain('패널 연결');
  expect(connect).toHaveBeenCalledTimes(1);
  expect(sends()).toHaveLength(1);
});

it('does not send if the collector closes immediately after READY', async () => {
  const result = sendAndCollect(job, target, controller.signal).then(
    () => 'unexpected completion',
    (error: Error) => error.message,
  );
  await vi.advanceTimersByTimeAsync(0);
  port.onMessage.emit({ type: 'collector-ready', id: job.id });
  port.onDisconnect.emit();
  await vi.advanceTimersByTimeAsync(0);
  expect(await result).not.toBe('unexpected completion');
  expect(sends()).toHaveLength(0);
});

it.each(['disconnect', 'abort'] as const)(
  'does not accept a pending poll success after %s',
  async (cause) => {
    let resolvePoll!: (value: { ok: boolean; data: unknown }) => void;
    const original = sendMessage.getMockImplementation()!;
    sendMessage.mockImplementation((id, command) =>
      command.type === 'poll'
        ? new Promise((resolve) => (resolvePoll = resolve))
        : original(id, command),
    );
    const result = sendAndCollect(job, target, controller.signal).then(
      () => 'unexpected completion',
      (error: Error) => error.message,
    );
    await vi.advanceTimersByTimeAsync(0);
    port.onMessage.emit({ type: 'collector-ready', id: job.id });
    await vi.advanceTimersByTimeAsync(0);
    expect(sends()).toHaveLength(1);
    if (cause === 'disconnect') port.onDisconnect.emit();
    else controller.abort();
    resolvePoll({ ok: true, data: { status: 'done', answer: 'Late answer', url: target.url } });
    await vi.advanceTimersByTimeAsync(0);
    expect(await result).not.toBe('unexpected completion');
    expect(connect).toHaveBeenCalledTimes(1);
    expect(sends()).toHaveLength(1);
  },
);

it('includes collector admission in the existing three minute deadline', async () => {
  const original = sendMessage.getMockImplementation()!;
  sendMessage.mockImplementation(async (id, command) =>
    command.type === 'poll'
      ? { ok: true, data: { status: 'pending', answer: '' } }
      : original(id, command),
  );
  let outcome: string | undefined;
  void sendAndCollect(job, target, controller.signal).then(
    () => (outcome = 'unexpected completion'),
    (error: Error) => (outcome = error.message),
  );
  await vi.advanceTimersByTimeAsync(0);
  await vi.advanceTimersByTimeAsync(LIMITS.timeoutMs - 1000);
  port.onMessage.emit({ type: 'collector-ready', id: job.id });
  await vi.advanceTimersByTimeAsync(6000);
  expect(outcome).toEqual(expect.stringContaining('응답 시간이 초과'));
  expect(connect).toHaveBeenCalledTimes(1);
  expect(sends()).toHaveLength(1);
  expect(port.disconnect).toHaveBeenCalledTimes(1);
});

it('cancels a Claude peer when aborted during its pending poll', async () => {
  const peer = {
    ...target,
    provider: 'claude' as const,
    url: 'https://claude.ai/new',
    threadId: '00000000-0000-4000-8000-000000000000',
  };
  vi.mocked(chrome.tabs.get).mockImplementation(
    async () =>
      ({
        id: peer.tabId,
        url: peer.url,
      }) as chrome.tabs.Tab,
  );
  let resolvePoll!: (value: { ok: boolean; data: unknown }) => void;
  sendMessage.mockImplementation(async (_id, command) => {
    if (command.type === 'poll') return new Promise((resolve) => (resolvePoll = resolve));
    return {
      ok: true,
      data:
        command.type === 'snapshot'
          ? {
              provider: peer.provider,
              documentId: peer.documentId,
              url: peer.url,
              threadId: peer.threadId,
              composer: true,
              busy: false,
              draft: false,
              truncated: false,
              lastQuestion: '',
              lastAnswer: '',
              context: { scope: 'rendered', turns: [] },
            }
          : true,
    };
  });
  const result = sendAndCollect({ ...job, provider: 'claude' }, peer, controller.signal).then(
    () => 'unexpected completion',
    (error: Error) => error.message,
  );
  await vi.advanceTimersByTimeAsync(0);
  controller.abort();
  resolvePoll({ ok: true, data: { status: 'done', answer: 'Late peer answer', url: peer.url } });
  await vi.advanceTimersByTimeAsync(0);
  expect(await result).not.toBe('unexpected completion');
  expect(sendMessage.mock.calls.filter(([, command]) => command.type === 'cancel')).toHaveLength(1);
  expect(connect).not.toHaveBeenCalled();
});
