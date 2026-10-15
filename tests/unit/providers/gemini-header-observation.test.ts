import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import * as observer from '../../../src/infrastructure/providers/gemini/header-observation';
import {
  composer,
  draftText,
  isBusy,
  settledSnapshot,
  snapshot,
  submit,
} from '../../../src/infrastructure/providers/dom';
import { inspectGeminiHeader, modelMenu } from '../../../src/infrastructure/providers/models';
import bootstrapBridge from '../../../entrypoints/bridge';

vi.mock('wxt/utils/define-unlisted-script', () => ({
  defineUnlistedScript: (start: () => unknown) => start,
}));

vi.mock('../../../src/infrastructure/providers/dom', () => ({
  composer: vi.fn(() => ({})),
  draftText: vi.fn(() => ''),
  isBusy: vi.fn(() => false),
  assertTarget: vi.fn(),
  settledSnapshot: vi.fn(),
  snapshot: vi.fn(),
  questions: vi.fn(() => []),
  replies: vi.fn(() => []),
  submit: vi.fn(),
  selectors: { gemini: { user: 'question', assistant: 'reply' } },
}));
vi.mock('../../../src/infrastructure/providers/attachments', () => ({
  hasAttachments: vi.fn(() => false),
}));
vi.mock('../../../src/infrastructure/providers/models', () => ({
  inspectGeminiHeader: vi.fn(() => false),
  modelMenu: vi.fn(),
}));
let doc: EventTarget & { visibilityState: string; querySelector: ReturnType<typeof vi.fn> };
let controller: AbortController;
beforeEach(() => {
  vi.useFakeTimers();
  vi.mocked(composer).mockReturnValue({} as HTMLElement);
  vi.mocked(draftText).mockReturnValue('');
  vi.mocked(isBusy).mockReturnValue(false);
  vi.mocked(inspectGeminiHeader).mockReturnValue(false);
  doc = Object.assign(new EventTarget(), {
    visibilityState: 'hidden',
    querySelector: vi.fn(() => null),
  });
  vi.stubGlobal('document', doc);
  const win = new EventTarget();
  vi.stubGlobal('window', Object.assign(win, { top: win }));
  vi.stubGlobal('location', { href: 'https://gemini.google.com/app' });
  controller = new AbortController();
});
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const start = () => observer.createGeminiHeaderObservation(controller.signal);
it('refuses a pending SDK reservation when the separate observer reserves before its snapshot continuation', async () => {
  const documentId = '00000000-0000-4000-8000-000000000000';
  vi.spyOn(crypto, 'randomUUID').mockReturnValue(documentId);
  vi.stubGlobal('__crosscheckInstalled', false);
  vi.mocked(inspectGeminiHeader).mockReturnValue(true);
  const snap = {
    provider: 'gemini' as const,
    documentId,
    url: location.href,
    composer: true,
    busy: false,
    draft: false,
    truncated: false,
    lastQuestion: '',
    lastAnswer: '',
    context: { scope: 'rendered' as const, turns: [] },
  };
  vi.mocked(snapshot).mockReturnValue(snap);
  let settle!: () => void;
  vi.mocked(settledSnapshot).mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        settle = () => resolve(snap);
      }),
  );
  let handler!: Parameters<typeof chrome.runtime.onMessage.addListener>[0];
  const privateRead = vi.fn(() => {
    throw Error('private access forbidden');
  });
  Object.defineProperty(window, 'WIZ_global_data', { get: privateRead });
  const executeScript = vi.fn();
  const network = vi.fn();
  vi.stubGlobal('fetch', network);
  vi.stubGlobal('chrome', {
    runtime: {
      id: 'fixture',
      getURL: (name: string) => `chrome-extension://fixture/${name}`,
      onMessage: {
        addListener: (listener: typeof handler) => {
          handler = listener;
        },
      },
    },
    scripting: { executeScript },
  });
  (bootstrapBridge as unknown as () => void)();
  const send = (message: object) =>
    new Promise<any>((resolve) => {
      handler(
        message,
        { id: 'fixture', url: 'chrome-extension://fixture/sidepanel.html' },
        resolve,
      );
    });
  const sdk = send({
    type: 'reserveGeminiSdkTrial',
    id: 'pending-sdk',
    documentId,
    url: location.href,
  });
  expect(settledSnapshot).toHaveBeenCalledExactlyOnceWith('gemini', documentId);
  const observed = send({ type: 'startGeminiHeaderObservation', id: 'observer' });
  expect(await observed).toEqual({ ok: true, data: { documentId } });
  const bound = { id: 'observer', documentId };
  const terminal = {
    ok: true,
    data: { status: 'done', visibility: 'hidden', outcome: 'ready-early' },
  };
  expect(await send({ type: 'pollGeminiHeaderObservation', ...bound })).toEqual(terminal);
  settle();
  const reservation = await sdk;
  expect(await send({ type: 'cancelGeminiHeaderObservation', ...bound })).toEqual({
    ok: true,
    data: { safeToRetire: true },
  });
  expect(await send({ type: 'pollGeminiHeaderObservation', ...bound })).toEqual(terminal);
  expect(submit).not.toHaveBeenCalled();
  expect(modelMenu).not.toHaveBeenCalled();
  expect(privateRead).not.toHaveBeenCalled();
  expect(executeScript).not.toHaveBeenCalled();
  expect(network).not.toHaveBeenCalled();
  expect(reservation).toEqual({
    ok: false,
    error: 'Gemini 시험 페이지를 다른 작업이 사용 중입니다.',
  });
});
it('observes early readiness synchronously without awaiting an eligible sample', () => {
  vi.mocked(inspectGeminiHeader).mockReturnValue(true);
  expect(start().poll()).toEqual({ status: 'done', visibility: 'hidden', outcome: 'ready-early' });
});
it('requires negative witnesses on both sides of 2500 before classifying late readiness', async () => {
  const job = start();
  await vi.advanceTimersByTimeAsync(2560);
  expect(job.poll()).toEqual({ status: 'pending', visibility: 'hidden' });
  vi.mocked(inspectGeminiHeader).mockReturnValue(true);
  await vi.advanceTimersByTimeAsync(80);
  expect(job.poll()).toEqual({ status: 'done', visibility: 'hidden', outcome: 'ready-late' });
  expect(vi.getTimerCount()).toBe(0);
});
it('a first eligible sample exactly at 2500 without a post-cutoff negative is inconclusive', async () => {
  const job = start();
  vi.spyOn(performance, 'now').mockReturnValue(2500);
  vi.mocked(inspectGeminiHeader).mockReturnValue(true);
  await vi.advanceTimersByTimeAsync(80);
  expect(job.poll()).toEqual({ status: 'done', visibility: 'hidden', outcome: 'inconclusive' });
});
it('does not inspect at the absolute 15000 boundary or count a delayed positive callback', async () => {
  const job = start();
  const reads = vi.mocked(inspectGeminiHeader).mock.calls.length;
  vi.spyOn(performance, 'now').mockReturnValue(15000);
  vi.mocked(inspectGeminiHeader).mockReturnValue(true);
  await vi.advanceTimersByTimeAsync(80);
  expect(job.poll()).toEqual({ status: 'done', visibility: 'hidden', outcome: 'inconclusive' });
  expect(inspectGeminiHeader).toHaveBeenCalledTimes(reads);
});
it('reports only not-observed when the early and post-cutoff negative witnesses exist', async () => {
  const job = start();
  for (let i = 0; i < 29; i++) {
    await vi.advanceTimersByTimeAsync(500);
    job.poll();
  }
  await vi.advanceTimersByTimeAsync(500);
  expect(job.poll()).toEqual({ status: 'done', visibility: 'hidden', outcome: 'not-observed' });
  expect(vi.getTimerCount()).toBe(0);
});
it.each(['visibility', 'page', 'draft', 'busy', 'messages', 'abort', 'exception'])(
  'invalidates %s and releases timers and listeners before late callbacks',
  async (kind) => {
    const remove = vi.spyOn(doc, 'removeEventListener');
    const job = start();
    if (kind === 'visibility') doc.dispatchEvent(new Event('visibilitychange'));
    if (kind === 'page') location.href += '?changed';
    if (kind === 'draft') vi.mocked(draftText).mockReturnValue('synthetic draft');
    if (kind === 'busy') vi.mocked(isBusy).mockReturnValue(true);
    if (kind === 'messages') doc.querySelector.mockReturnValue({});
    if (kind === 'abort') controller.abort();
    if (kind === 'exception')
      vi.mocked(inspectGeminiHeader).mockImplementation(() => {
        throw Error('private');
      });
    await vi.advanceTimersByTimeAsync(80);
    const outcome =
      kind === 'visibility'
        ? 'visibility-changed'
        : kind === 'page'
          ? 'page'
          : kind === 'abort'
            ? 'interrupted'
            : kind === 'exception'
              ? 'unsupported'
              : 'not-empty';
    expect(job.poll()).toEqual({ status: 'done', visibility: 'hidden', outcome });
    expect(vi.getTimerCount()).toBe(0);
    expect(remove).toHaveBeenCalledWith('visibilitychange', expect.any(Function), true);
    const reads = vi.mocked(inspectGeminiHeader).mock.calls.length;
    await vi.advanceTimersByTimeAsync(16000);
    expect(job.poll()).toEqual({ status: 'done', visibility: 'hidden', outcome });
    expect(inspectGeminiHeader).toHaveBeenCalledTimes(reads);
  },
);
it('cancel during preparation is terminal and retirement is a separate fresh safety check', async () => {
  vi.mocked(composer).mockReturnValue(undefined);
  const job = start();
  expect(job.cancel()).toEqual({ safeToRetire: false });
  vi.mocked(composer).mockReturnValue({} as HTMLElement);
  expect(job.cancel()).toEqual({ safeToRetire: true });
  expect(job.poll()).toEqual({ status: 'done', visibility: 'hidden', outcome: 'interrupted' });
  await vi.advanceTimersByTimeAsync(3000);
  expect(inspectGeminiHeader).not.toHaveBeenCalled();
  expect(vi.getTimerCount()).toBe(0);
});
it('never replaces an already settled result when cancelled or retirement becomes unsafe', () => {
  vi.mocked(inspectGeminiHeader).mockReturnValue(true);
  const job = start();
  vi.mocked(draftText).mockReturnValue('draft');
  expect(job.cancel()).toEqual({ safeToRetire: false });
  expect(job.poll()).toEqual({ status: 'done', visibility: 'hidden', outcome: 'ready-early' });
});
it('does not renew the absolute window or liveness with terminal polls', async () => {
  const job = start();
  await vi.advanceTimersByTimeAsync(16000);
  const result = job.poll();
  const reads = vi.mocked(inspectGeminiHeader).mock.calls.length;
  job.poll();
  job.cancel();
  job.poll();
  expect(job.poll()).toEqual(result);
  expect(inspectGeminiHeader).toHaveBeenCalledTimes(reads);
  expect(vi.getTimerCount()).toBe(0);
});

it('a late first structural read cannot fabricate early or delayed readiness', () => {
  vi.mocked(inspectGeminiHeader).mockImplementation(() => {
    vi.spyOn(performance, 'now').mockReturnValue(2600);
    return true;
  });
  expect(start().poll()).toEqual({ status: 'done', visibility: 'hidden', outcome: 'inconclusive' });
});
it('a valid positive at 14999 counts, but no timer or replacement renews the origin', async () => {
  const job = start();
  await vi.advanceTimersByTimeAsync(2560);
  vi.spyOn(performance, 'now').mockReturnValue(14999);
  vi.mocked(inspectGeminiHeader).mockReturnValue(true);
  await vi.advanceTimersByTimeAsync(80);
  expect(job.poll()).toEqual({ status: 'done', visibility: 'hidden', outcome: 'ready-late' });
  expect(vi.getTimerCount()).toBe(0);
});
it('exactly 2500 is a post-cutoff negative witness, never an early witness', async () => {
  const job = start();
  const now = vi.spyOn(performance, 'now').mockReturnValue(2500);
  await vi.advanceTimersByTimeAsync(80);
  now.mockReturnValue(2501);
  vi.mocked(inspectGeminiHeader).mockReturnValue(true);
  await vi.advanceTimersByTimeAsync(80);
  expect(job.poll()).toEqual({ status: 'done', visibility: 'hidden', outcome: 'ready-late' });
});
it('trusted interaction between polls invalidates and cannot retire even an empty home', () => {
  const job = start();
  const input = new Event('pointerdown');
  Object.defineProperty(input, 'isTrusted', { value: true });
  doc.dispatchEvent(input);
  expect(job.poll()).toEqual({ status: 'done', visibility: 'hidden', outcome: 'interrupted' });
  expect(job.cancel()).toEqual({ safeToRetire: false });
});
it('preparation uses its own clock and releases its wait when no unique composer settles', async () => {
  vi.mocked(composer).mockReturnValue(undefined);
  const job = start();
  await vi.advanceTimersByTimeAsync(2550);
  expect(job.poll()).toEqual({ status: 'done', visibility: 'hidden', outcome: 'inconclusive' });
  expect(inspectGeminiHeader).not.toHaveBeenCalled();
  expect(vi.getTimerCount()).toBe(0);
});
it('document replacement refuses retirement', () => {
  const job = start();
  vi.stubGlobal('document', Object.assign(new EventTarget(), { visibilityState: 'hidden' }));
  expect(job.cancel()).toEqual({ safeToRetire: false });
});
it.each(['hidden', 'visible'])(
  'accepts consistent %s early and late evidence',
  async (visibility) => {
    doc.visibilityState = visibility;
    vi.mocked(inspectGeminiHeader).mockReturnValue(true);
    expect(start().poll()).toEqual({ status: 'done', visibility, outcome: 'ready-early' });
    vi.mocked(inspectGeminiHeader).mockReturnValue(false);
    const job = start();
    await vi.advanceTimersByTimeAsync(2560);
    vi.mocked(inspectGeminiHeader).mockReturnValue(true);
    await vi.advanceTimersByTimeAsync(80);
    expect(job.poll()).toEqual({ status: 'done', visibility, outcome: 'ready-late' });
  },
);
it.each(['hidden', 'visible'])(
  'invalidates any transition from initial %s, including an event restored between polls',
  async (visibility) => {
    doc.visibilityState = visibility;
    const job = start();
    doc.visibilityState = visibility === 'hidden' ? 'visible' : 'hidden';
    await vi.advanceTimersByTimeAsync(80);
    expect(job.poll()).toEqual({ status: 'done', visibility, outcome: 'visibility-changed' });
    doc.visibilityState = visibility;
    const eventJob = start();
    doc.dispatchEvent(new Event('visibilitychange'));
    expect(eventJob.poll()).toEqual({ status: 'done', visibility, outcome: 'visibility-changed' });
  },
);
it('unsupported initial visibility remains unobserved and never supports positive evidence', () => {
  doc.visibilityState = 'prerender';
  expect(start().poll()).toEqual({
    status: 'done',
    visibility: 'unobserved',
    outcome: 'unsupported',
  });
  expect(
    GeminiHeaderObservationResult.safeParse({
      outcome: 'ready-late',
      retirement: 'closed',
      visibility: 'unobserved',
    }).success,
  ).toBe(false);
  expect(
    GeminiHeaderObservationProgress.safeParse({
      status: 'done',
      outcome: 'ready-early',
      visibility: 'unobserved',
    }).success,
  ).toBe(false);
});

import { Command } from '../../../src/application/provider-protocol';
import {
  GeminiHeaderObservationProgress,
  GeminiHeaderObservationResult,
} from '../../../src/application/gemini-readiness';
it('admits only fixed document-bound observation commands and finite content-free DTOs', () => {
  for (const type of ['pollGeminiHeaderObservation', 'cancelGeminiHeaderObservation']) {
    expect(Command.safeParse({ type, id: 'x', documentId: 'd' }).success).toBe(true);
    expect(Command.safeParse({ type, id: 'x' }).success).toBe(false);
    expect(Command.safeParse({ type, id: 'x', documentId: 'd', timeout: 15000 }).success).toBe(
      false,
    );
  }
  expect(Command.safeParse({ type: 'startGeminiHeaderObservation', id: 'x' }).success).toBe(true);
  for (const field of ['url', 'documentId', 'selector', 'headers', 'prompt', 'source', 'private'])
    expect(
      Command.safeParse({ type: 'startGeminiHeaderObservation', id: 'x', [field]: 'hidden' })
        .success,
    ).toBe(false);
  expect(
    GeminiHeaderObservationProgress.safeParse({
      status: 'pending',
      visibility: 'hidden',
      outcome: 'ready-early',
    }).success,
  ).toBe(false);
  expect(
    GeminiHeaderObservationProgress.safeParse({
      status: 'done',
      visibility: 'hidden',
      outcome: 'ready-early',
      elapsed: 50,
    }).success,
  ).toBe(false);
  expect(
    GeminiHeaderObservationResult.safeParse({
      visibility: 'hidden',
      outcome: 'ready-late',
      retirement: 'closed',
      text: 'private',
    }).success,
  ).toBe(false);
});

import { observeGeminiHeaderReadiness } from '../../../src/infrastructure/chrome/gemini-header-observation';
function chromeFixture() {
  const event = () => {
    const listeners = new Set<(...args: any[]) => void>();
    return {
      addListener: (fn: (...args: any[]) => void) => listeners.add(fn),
      removeListener: (fn: (...args: any[]) => void) => listeners.delete(fn),
      fire: (...args: any[]) => {
        for (const fn of listeners) fn(...args);
      },
      listeners,
    };
  };
  const onActivated = event(),
    onUpdated = event(),
    onRemoved = event();
  const tab = { id: 9, active: false, url: 'https://gemini.google.com/app', status: 'complete' };
  const commands: any[] = [];
  const sendMessage = vi.fn(async (_id: number, command: any) => {
    commands.push(command);
    if (command.type === 'startGeminiHeaderObservation')
      return { ok: true, data: { documentId: 'owned' } };
    if (command.type === 'pollGeminiHeaderObservation')
      return { ok: true, data: { status: 'done', outcome: 'ready-late', visibility: 'visible' } };
    if (command.type === 'cancelGeminiHeaderObservation')
      return { ok: true, data: { safeToRetire: true } };
    throw Error('Forbidden command');
  });
  const api = {
    permissions: {
      contains: vi.fn(async () => true),
      request: vi.fn(() => {
        throw Error('permission request forbidden');
      }),
    },
    tabs: {
      create: vi.fn(async () => tab),
      get: vi.fn(async () => tab),
      remove: vi.fn(async () => {}),
      sendMessage,
      onActivated,
      onUpdated,
      onRemoved,
    },
    scripting: { executeScript: vi.fn(async () => []) },
    storage: {
      session: {
        set: vi.fn(() => {
          throw Error('storage forbidden');
        }),
      },
    },
  };
  vi.stubGlobal('chrome', api);
  return { api, tab, commands };
}
it('Chrome path allocates once inactive, injects only bridge, propagates visible evidence and checks twice before removal', async () => {
  const { api, commands } = chromeFixture();
  expect(await observeGeminiHeaderReadiness(controller.signal)).toEqual({
    outcome: 'ready-late',
    visibility: 'visible',
    retirement: 'closed',
  });
  expect(api.tabs.create).toHaveBeenCalledExactlyOnceWith({
    url: 'https://gemini.google.com/app',
    active: false,
  });
  expect(api.scripting.executeScript).toHaveBeenCalledExactlyOnceWith({
    target: { tabId: 9, frameIds: [0] },
    files: ['bridge.js'],
    world: 'ISOLATED',
  });
  expect(commands.map((command) => command.type)).toEqual([
    'startGeminiHeaderObservation',
    'pollGeminiHeaderObservation',
    'cancelGeminiHeaderObservation',
    'cancelGeminiHeaderObservation',
  ]);
  expect(api.tabs.remove).toHaveBeenCalledExactlyOnceWith(9);
  expect(api.permissions.request).not.toHaveBeenCalled();
  expect(api.storage.session.set).not.toHaveBeenCalled();
  expect(
    api.tabs.onActivated.listeners.size +
      api.tabs.onUpdated.listeners.size +
      api.tabs.onRemoved.listeners.size,
  ).toBe(0);
});
it('missing preexisting permission allocates nothing and never asks for a grant', async () => {
  const { api } = chromeFixture();
  api.permissions.contains.mockResolvedValue(false);
  await expect(observeGeminiHeaderReadiness(controller.signal)).rejects.toThrow('연결 권한');
  expect(api.tabs.create).not.toHaveBeenCalled();
  expect(api.permissions.request).not.toHaveBeenCalled();
  expect(api.tabs.onUpdated.listeners.size).toBe(0);
});
it.each(['activation', 'navigation', 'replacement', 'unsafe', 'identity'])(
  'Chrome retains on %s without adopting a changed page',
  async (kind) => {
    const { api, tab, commands } = chromeFixture();
    const normal = api.tabs.sendMessage.getMockImplementation()!;
    api.tabs.sendMessage.mockImplementation(async (id, command) => {
      if (command.type === 'pollGeminiHeaderObservation') {
        if (kind === 'activation') api.tabs.onActivated.fire({ tabId: 9 });
        if (kind === 'navigation') {
          tab.url += '?changed';
          api.tabs.onUpdated.fire(9, { url: tab.url });
        }
        if (kind === 'replacement') api.tabs.onUpdated.fire(9, { status: 'loading' });
      }
      if (kind === 'identity' && command.type === 'startGeminiHeaderObservation')
        return { ok: true, data: { documentId: 'owned', private: 'forbidden' } } as any;
      if (kind === 'unsafe' && command.type === 'cancelGeminiHeaderObservation')
        return { ok: true, data: { safeToRetire: false } } as any;
      return normal(id, command);
    });
    const result = await observeGeminiHeaderReadiness(controller.signal);
    expect(result.retirement).toBe('retained');
    expect(api.tabs.remove).not.toHaveBeenCalled();
    expect(
      commands.filter((command) => command.type === 'startGeminiHeaderObservation'),
    ).toHaveLength(kind === 'identity' ? 0 : 1);
  },
);
it('reentrant activation during the final retirement check prevents deletion without rewriting terminal evidence', async () => {
  const { api } = chromeFixture();
  const normal = api.tabs.sendMessage.getMockImplementation()!;
  let checks = 0;
  api.tabs.sendMessage.mockImplementation(async (id, command) => {
    if (command.type === 'cancelGeminiHeaderObservation' && ++checks === 2)
      api.tabs.onActivated.fire({ tabId: 9 });
    return normal(id, command);
  });
  expect(await observeGeminiHeaderReadiness(controller.signal)).toEqual({
    outcome: 'ready-late',
    visibility: 'visible',
    retirement: 'retained',
  });
  expect(api.tabs.remove).not.toHaveBeenCalled();
});

it('a visibility event restored before cancellation cannot regain retirement safety', () => {
  const job = start();
  doc.dispatchEvent(new Event('visibilitychange'));
  expect(job.cancel()).toEqual({ safeToRetire: false });
  expect(job.poll()).toEqual({
    status: 'done',
    visibility: 'hidden',
    outcome: 'visibility-changed',
  });
});
it('a nonempty or throwing page cannot regain retirement safety after its terminal refusal', async () => {
  const job = start();
  vi.mocked(draftText).mockReturnValue('draft');
  await vi.advanceTimersByTimeAsync(80);
  vi.mocked(draftText).mockReturnValue('');
  expect(job.cancel()).toEqual({ safeToRetire: false });
});

it('a delayed expiry is not-observed only after sufficient actual negative witnesses', async () => {
  const job = start();
  await vi.advanceTimersByTimeAsync(2560);
  const reads = vi.mocked(inspectGeminiHeader).mock.calls.length;
  vi.spyOn(performance, 'now').mockReturnValue(21000);
  await vi.advanceTimersByTimeAsync(80);
  expect(job.poll()).toEqual({ status: 'done', visibility: 'hidden', outcome: 'not-observed' });
  expect(inspectGeminiHeader).toHaveBeenCalledTimes(reads);
});
it('the bridge revision guard retains user history after observer listeners end', () => {
  let revision = 0;
  vi.mocked(inspectGeminiHeader).mockReturnValue(true);
  const job = observer.createGeminiHeaderObservation(controller.signal, () => revision === 0);
  expect(job.poll()).toEqual({ status: 'done', visibility: 'hidden', outcome: 'ready-early' });
  revision++; // Bridge retains input history even when a draft is subsequently cleared.
  expect(job.cancel()).toEqual({ safeToRetire: false });
  expect(job.poll()).toEqual({ status: 'done', visibility: 'hidden', outcome: 'ready-early' });
});

it('same-home navigation during bridge injection is not adopted as a fresh diagnostic context', async () => {
  const { api } = chromeFixture();
  api.scripting.executeScript.mockImplementation(async () => {
    api.tabs.onUpdated.fire(9, { status: 'loading' });
    return [];
  });
  expect(await observeGeminiHeaderReadiness(controller.signal)).toEqual({
    outcome: 'page',
    visibility: 'unobserved',
    retirement: 'retained',
  });
  expect(api.tabs.sendMessage).not.toHaveBeenCalled();
  expect(api.tabs.remove).not.toHaveBeenCalled();
});
