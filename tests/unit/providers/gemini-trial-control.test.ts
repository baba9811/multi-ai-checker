import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  GEMINI_FIXED_TEXT_TRIAL_ANSWER,
  GEMINI_NATIVE_DISPATCH_REASONS,
  GEMINI_FIXED_TEXT_TRIAL_PROMPT,
  GeminiFixedTextTrialProgress,
  GeminiFixedTextTrialRecord,
  GeminiFixedTextTrialResult,
} from '../../../src/application/gemini-fixed-text-trial';
import * as receiveContract from '../../../src/application/gemini-fixed-text-trial';
import { LIMITS } from '../../../src/domains/crosscheck/model';
import { createGeminiTrialControl } from '../../../src/infrastructure/providers/gemini/trial-control';

const result = { model: 'Synthetic UI model', answer: 'CROSSCHECK_GEMINI_OK' } as const;
const interrupted = { status: 'error', reason: 'interrupted' };
const controls: ReturnType<typeof createGeminiTrialControl>[] = [];
let page: EventTarget;

function deferred() {
  let resolve!: (value: GeminiFixedTextTrialResult) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<GeminiFixedTextTrialResult>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
function control(start: (signal: AbortSignal) => Promise<GeminiFixedTextTrialResult>) {
  const value = createGeminiTrialControl(start);
  controls.push(value);
  return value;
}
const settle = () => vi.advanceTimersByTimeAsync(0);

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
  page = new EventTarget();
  vi.stubGlobal('window', page);
});
afterEach(() => {
  for (const value of controls.splice(0)) value.registry.stop(value.bootstrap.capability);
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('fixed public trial contracts', () => {
  it('keeps a compiled fixed prompt and exact answer', () => {
    expect(GEMINI_FIXED_TEXT_TRIAL_PROMPT).toBe('Reply with CROSSCHECK_GEMINI_OK only.');
    expect(GEMINI_FIXED_TEXT_TRIAL_ANSWER).toBe(result.answer);
    expect(GeminiFixedTextTrialResult.parse(result)).toEqual(result);
    expect(GeminiFixedTextTrialRecord.parse({ id: 'synthetic-intent', status: 'pending' })).toEqual(
      {
        id: 'synthetic-intent',
        status: 'pending',
      },
    );
  });
  it.each(['', ' CROSSCHECK_GEMINI_OK', 'CROSSCHECK_GEMINI_OK\n', '**CROSSCHECK_GEMINI_OK**'])(
    'rejects an inexact answer %j',
    (answer) => {
      expect(GeminiFixedTextTrialResult.safeParse({ ...result, answer }).success).toBe(false);
    },
  );
  it.each(['', 'x'.repeat(161)])('bounds the public model label %j', (model) => {
    expect(GeminiFixedTextTrialResult.safeParse({ ...result, model }).success).toBe(false);
  });
  it.each([
    ...GEMINI_NATIVE_DISPATCH_REASONS,
    'client',
    'client-initial',
    'client-protection',
    'client-current',
    'model-trigger',
    'model-trigger-compact-control',
    'model-trigger-final-control',
    'model-trigger-header-context',
    'model-trigger-header-deadline',
    'model-trigger-header-association',

    'model-menu',
    'model-menu-open-trigger',
    'model-menu-open-menu',
    'model-menu-owner-missing',
    'model-menu-owner-changed',
    'model-menu-trigger-detached',
    'model-menu-popover-ambiguous',
    'model-menu-menu-ambiguous',
    'model-menu-controls-invalid',
    'model-menu-owner-duplicate',
    'model-cleanup',
    'capture-readiness',
    'capture-editor',
    'capture-bindings',
    'capture-actions',
    'capture-request-id',
    'response-error',
    'response-event',
    'response-event-1',
    'response-event-2',
    'response-event-3',
    'dispatch-runtime-shape',
    'dispatch-route',
    'dispatch-protection',
    'dispatch-source-profile',
    'dispatch-descriptor',
    'dispatch-binding',
    'dispatch-handoff',
    'dispatch-retry',
    'dispatch-stream',
    'dispatch-backend',
    'dispatch-closed',
    'dispatch-spent',
    'dispatch-interrupted',
    'dispatch-source-stream',
    'dispatch-source-async',
    'dispatch-source-factory',
    'dispatch-source-handler',
    'dispatch-source-notify',
    'dispatch-observation',
    'response-disconnect-1',
    'response-disconnect-2',
    'response-disconnect-3',
    'response-disconnect-4',
    'response-disconnect-5',
    'response-disconnect-6',
    'response-shape',
    'response-extra',
    'response-raw-fields',
    'response-raw-field-1',
    'response-raw-field-3',
    'response-raw-field-4',
    'response-raw-field-14',
    'response-raw-field-17',
    'response-raw-field-18',
    'response-raw-field-19',
    'response-raw-field-22',
    'response-raw-field-29',
    'response-raw-field-31',
    'response-raw-field-38',
    'response-raw-field-39',
    'response-raw-field-42',
    'response-raw-field-44',
    'response-raw-field-45',
    'response-raw-field-51',
    'response-raw-field-54',
    'response-raw-field-6',
    'response-raw-field-7',
    'response-raw-field-8',
    'response-raw-field-10',
    'response-raw-field-25',
    'response-raw-field-30',
    'response-raw-field-33',
    'response-raw-field-35',
    'response-raw-field-36',
    'response-raw-field-41',
    'response-raw-field-47',
    'response-raw-field-49',
    'response-raw-field-53',
    'response-raw-field-57',
    'response-raw-title',
    'response-raw-routing',
    'response-raw-attribution',
    'response-raw-history',
    'response-raw-quota',
    'response-raw-heartbeat',
    'response-raw-string',
    'response-raw-enum',
    'response-raw-client',
    'response-raw-supplement',
    'response-raw-continuation',
    'response-raw-disconnect',
    'response-flags',
    'response-lists',
    'response-metadata',
    'response-identity',
    'response-candidate-lists',
    'response-answer',
    'response-candidate-extra',
    'response-final-metadata',
    'response-content',
    'response-completion',
  ])('preserves fixed reason %s without private fields or retry', async (reason) => {
    const progress = { status: 'error', reason };
    expect(GeminiFixedTextTrialProgress.safeParse(progress).success).toBe(true);
    expect(
      GeminiFixedTextTrialProgress.safeParse({ ...progress, detail: 'SYNTHETIC_PRIVATE_MARKER' })
        .success,
    ).toBe(false);
    const start = vi.fn(async () => {
      throw new Error('SYNTHETIC_PRIVATE_MARKER', { cause: reason });
    });
    const value = control(start);
    value.registry.lease(value.bootstrap.capability);
    await settle();
    expect(value.registry.lease(value.bootstrap.capability)).toEqual(progress);
    expect(value.registry.terminalError(value.bootstrap.capability)).toEqual({
      status: 'error',
      reason,
    });
    expect(value.registry.terminalError('wrong')).toBeNull();
    value.registry.stop(value.bootstrap.capability);
    const now = vi.spyOn(performance, 'now');
    const set = vi.spyOn(globalThis, 'setTimeout');
    const clear = vi.spyOn(globalThis, 'clearTimeout');
    for (let query = 0; query < 3; query++)
      expect(value.registry.terminalError(value.bootstrap.capability)).toEqual({
        status: 'error',
        reason,
      });
    expect(now).not.toHaveBeenCalled();
    expect(set).not.toHaveBeenCalled();
    expect(clear).not.toHaveBeenCalled();
    now.mockRestore();
    set.mockRestore();
    clear.mockRestore();
    await settle();
    expect(start).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });
  it.each([
    { status: 'pending', result },
    { status: 'done' },
    { status: 'done', result, reason: 'interrupted' },
    { status: 'error' },
    { status: 'error', reason: 'SYNTHETIC_PRIVATE_MARKER' },
    { status: 'error', reason: 'model-trigger-private' },
    {
      status: 'error',
      reason: 'model-trigger-header-deadline',
      geminiTriggerDiagnostic: 'header-deadline',
    },
    { status: 'error', reason: 'response-raw-field-0' },
    { status: 'error', reason: 'response-raw-field-2' },
    { status: 'error', reason: 'response-raw-field-65' },
    { status: 'error', reason: 'response-raw-field-81' },
    { status: 'error', reason: 'response-raw-field-017' },
    { status: 'error', reason: 'response-raw-field-NaN' },
    { status: 'error', reason: 'response-raw-field-SYNTHETIC_PRIVATE_MARKER' },
    { status: 'error', reason: 'history', result },
  ])('rejects mismatched progress fields %j', (value) => {
    expect(GeminiFixedTextTrialProgress.safeParse(value).success).toBe(false);
  });
  it('rejects private extras in public results, progress and persisted records', () => {
    expect(
      GeminiFixedTextTrialResult.safeParse({ ...result, modeId: 'synthetic-private' }).success,
    ).toBe(false);
    expect(
      GeminiFixedTextTrialProgress.safeParse({ status: 'pending', capability: 'synthetic-private' })
        .success,
    ).toBe(false);
    expect(
      GeminiFixedTextTrialRecord.safeParse({
        id: 'synthetic',
        status: 'done',
        answer: result.answer,
      }).success,
    ).toBe(false);
  });
});

describe('MAIN-local trial control', () => {
  it('returns a fresh 256-bit bootstrap secret separately from the fixed registry', () => {
    const start = vi.fn(async () => result);
    const first = control(start);
    const second = control(start);
    expect(first.bootstrap.capability).toMatch(/^[a-f0-9]{64}$/);
    expect(second.bootstrap.capability).not.toBe(first.bootstrap.capability);
    expect(Object.keys(first.registry).sort()).toEqual(['lease', 'stop', 'terminalError']);
    expect(JSON.stringify(first.registry)).not.toContain(first.bootstrap.capability);
    expect(start).not.toHaveBeenCalled();
  });
  it.each(
    [undefined, null, false, 1, {}, [], '', 'x'.repeat(64)].map((capability) => [capability]),
  )('does not start or expose a result to malformed/unknown capability %j', async (capability) => {
    const start = vi.fn(async () => result);
    const value = control(start);
    expect(value.registry.lease(capability)).toEqual(interrupted);
    value.registry.stop(capability);
    await settle();
    expect(start).not.toHaveBeenCalled();
    expect(value.registry.lease(value.bootstrap.capability)).toEqual({ status: 'pending' });
    await settle();
    expect(start).toHaveBeenCalledTimes(1);
    expect(value.registry.lease(capability)).toEqual(interrupted);
    expect(value.registry.lease(value.bootstrap.capability)).toEqual({ status: 'done', result });
  });
  it('does not coerce a capability object or invoke its accessors', () => {
    const getter = vi.fn(() => {
      throw new Error('SYNTHETIC_PRIVATE_MARKER');
    });
    const capability = Object.defineProperty({}, 'toString', { get: getter });
    const start = vi.fn(async () => result);
    const value = control(start);
    expect(value.registry.lease(capability)).toEqual(interrupted);
    value.registry.stop(capability);
    expect(getter).not.toHaveBeenCalled();
    expect(start).not.toHaveBeenCalled();
  });
  it('starts only once after the first valid lease and projects a detached strict result', async () => {
    const start = vi.fn(async () => ({ ...result }));
    const value = control(start);
    expect(value.registry.lease(value.bootstrap.capability)).toEqual({ status: 'pending' });
    expect(value.registry.lease(value.bootstrap.capability)).toEqual({ status: 'pending' });
    expect(start).not.toHaveBeenCalled();
    await settle();
    expect(start).toHaveBeenCalledTimes(1);
    expect(value.registry.lease(value.bootstrap.capability)).toEqual({ status: 'done', result });
    expect(
      GeminiFixedTextTrialProgress.safeParse(value.registry.lease(value.bootstrap.capability))
        .success,
    ).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('expires dormant work without starting and cannot restart it', async () => {
    const start = vi.fn(async () => result);
    const value = control(start);
    await vi.advanceTimersByTimeAsync(15000);
    expect(value.registry.lease(value.bootstrap.capability)).toEqual(interrupted);
    await settle();
    expect(start).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
  it('closes before abort callbacks run and stops the supplied inner-operation hook', async () => {
    const wait = deferred();
    const observations: unknown[] = [];
    const teardown = vi.fn(() =>
      observations.push(value.registry.lease(value.bootstrap.capability)),
    );
    const start = vi.fn((signal: AbortSignal) => {
      signal.addEventListener('abort', teardown, { once: true });
      return wait.promise;
    });
    const value = control(start);
    value.registry.lease(value.bootstrap.capability);
    await settle();
    value.registry.stop(value.bootstrap.capability);
    value.registry.stop(value.bootstrap.capability);
    expect(teardown).toHaveBeenCalledTimes(1);
    expect(observations).toEqual([interrupted]);
    wait.resolve(result);
    await settle();
    expect(value.registry.lease(value.bootstrap.capability)).toEqual(interrupted);
    expect(start).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('blocks an already queued start when stopped before its microtask', async () => {
    const start = vi.fn(async () => result);
    const value = control(start);
    value.registry.lease(value.bootstrap.capability);
    value.registry.stop(value.bootstrap.capability);
    await settle();
    expect(start).not.toHaveBeenCalled();
    expect(value.registry.lease(value.bootstrap.capability)).toEqual(interrupted);
  });
  it('does not renew the lease for an unknown capability', async () => {
    const wait = deferred();
    const start = vi.fn((_signal: AbortSignal) => wait.promise);
    const value = control(start);
    value.registry.lease(value.bootstrap.capability);
    await vi.advanceTimersByTimeAsync(14000);
    expect(value.registry.lease('x'.repeat(64))).toEqual(interrupted);
    await vi.advanceTimersByTimeAsync(1000);
    expect(start.mock.calls[0]![0].aborted).toBe(true);
    wait.resolve(result);
    await settle();
    expect(value.registry.lease(value.bootstrap.capability)).toEqual(interrupted);
  });
  it('valid leases renew only the lease, never the absolute deadline', async () => {
    const wait = deferred();
    const start = vi.fn((_signal: AbortSignal) => wait.promise);
    const value = control(start);
    value.registry.lease(value.bootstrap.capability);
    for (let elapsed = 10000; elapsed < LIMITS.timeoutMs; elapsed += 10000) {
      await vi.advanceTimersByTimeAsync(10000);
      expect(value.registry.lease(value.bootstrap.capability)).toEqual({ status: 'pending' });
    }
    await vi.advanceTimersByTimeAsync(10000);
    expect(start.mock.calls[0]![0].aborted).toBe(true);
    wait.resolve(result);
    await settle();
    expect(value.registry.lease(value.bootstrap.capability)).toEqual(interrupted);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('checks elapsed monotonic time before renewing when timer execution is delayed', () => {
    const start = vi.fn(async () => result);
    const value = control(start);
    vi.spyOn(performance, 'now').mockReturnValue(15000);
    expect(value.registry.lease(value.bootstrap.capability)).toEqual(interrupted);
    expect(start).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
  it('keeps private current false until the first lease and never renews or restarts work', async () => {
    const wait = deferred();
    const start = vi.fn((_signal: AbortSignal) => wait.promise);
    const value = control(start);
    expect(value.current()).toBe(false);
    expect(start).not.toHaveBeenCalled();
    expect(Object.keys(value.registry).sort()).toEqual(['lease', 'stop', 'terminalError']);
    value.registry.lease(value.bootstrap.capability);
    await vi.advanceTimersByTimeAsync(14000);
    expect(value.current()).toBe(true);
    await vi.advanceTimersByTimeAsync(1000);
    expect(value.current()).toBe(false);
    expect(start.mock.calls[0]![0].aborted).toBe(true);
    expect(start).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('private current closes before a late SDK delegation when watchdog execution is stalled', async () => {
    const wait = deferred();
    const start = vi.fn((_signal: AbortSignal) => wait.promise);
    const send = vi.fn();
    const value = control(start);
    value.registry.lease(value.bootstrap.capability);
    await settle();
    expect(value.current()).toBe(true);
    vi.spyOn(performance, 'now').mockReturnValue(15000);
    if (value.current()) send();
    expect(send).not.toHaveBeenCalled();
    expect(start.mock.calls[0]![0].aborted).toBe(true);
    expect(value.registry.lease(value.bootstrap.capability)).toEqual(interrupted);
    expect(value.current()).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('private current checks the absolute deadline after valid lease renewals without timer execution', async () => {
    const wait = deferred();
    const start = vi.fn((_signal: AbortSignal) => wait.promise);
    const send = vi.fn();
    const value = control(start);
    value.registry.lease(value.bootstrap.capability);
    await settle();
    const now = vi.spyOn(performance, 'now');
    for (let elapsed = 14000; elapsed < LIMITS.timeoutMs; elapsed += 14000) {
      now.mockReturnValue(elapsed);
      expect(value.registry.lease(value.bootstrap.capability)).toEqual({ status: 'pending' });
    }
    now.mockReturnValue(LIMITS.timeoutMs);
    if (value.current()) send();
    expect(send).not.toHaveBeenCalled();
    expect(start.mock.calls[0]![0].aborted).toBe(true);
    expect(value.registry.lease(value.bootstrap.capability)).toEqual(interrupted);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('pagehide closes the operation and removes owned listeners and timers', async () => {
    const remove = vi.spyOn(page, 'removeEventListener');
    const wait = deferred();
    const start = vi.fn((_signal: AbortSignal) => wait.promise);
    const value = control(start);
    value.registry.lease(value.bootstrap.capability);
    await settle();
    page.dispatchEvent(new Event('pagehide'));
    expect(start.mock.calls[0]![0].aborted).toBe(true);
    expect(remove).toHaveBeenCalledWith('pagehide', expect.any(Function));
    expect(vi.getTimerCount()).toBe(0);
    wait.resolve(result);
    await settle();
    expect(value.registry.lease(value.bootstrap.capability)).toEqual(interrupted);
  });
  it.each([
    { ...result, answer: result.answer + '\n' },
    { ...result, model: '' },
    { ...result, model: 'x'.repeat(161) },
    { ...result, providerId: 'SYNTHETIC_PRIVATE_MARKER' },
  ])('rejects unsupported results with a fixed content-free error %j', async (output) => {
    const value = control(async () => output as GeminiFixedTextTrialResult);
    value.registry.lease(value.bootstrap.capability);
    await settle();
    expect(value.registry.lease(value.bootstrap.capability)).toEqual({
      status: 'error',
      reason: 'response',
    });
    expect(vi.getTimerCount()).toBe(0);
  });
  it('rejects unknown SDK menu suffixes and arbitrary public diagnostic properties', () => {
    expect(
      GeminiFixedTextTrialProgress.safeParse({ status: 'error', reason: 'model-menu-private' })
        .success,
    ).toBe(false);
    expect(
      GeminiFixedTextTrialProgress.safeParse({
        status: 'error',
        reason: 'model-menu',
        geminiMenuDiagnostic: 'open-trigger',
      }).success,
    ).toBe(false);
  });
  it('does not invoke a result getter or expose private accessor text', async () => {
    const getter = vi.fn(() => 'SYNTHETIC_PRIVATE_MARKER');
    const output = Object.defineProperty({ answer: result.answer }, 'model', { get: getter });
    const value = control(async () => output as GeminiFixedTextTrialResult);
    value.registry.lease(value.bootstrap.capability);
    await settle();
    expect(getter).not.toHaveBeenCalled();
    expect(value.registry.lease(value.bootstrap.capability)).toEqual({
      status: 'error',
      reason: 'response',
    });
  });
  it('does not accept a completion after elapsed time even before the watchdog callback runs', async () => {
    const wait = deferred();
    const value = control(() => wait.promise);
    value.registry.lease(value.bootstrap.capability);
    await settle();
    vi.spyOn(performance, 'now').mockReturnValue(15000);
    wait.resolve(result);
    await settle();
    expect(value.registry.lease(value.bootstrap.capability)).toEqual(interrupted);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('freezes detached public progress and closes before successful teardown', async () => {
    const remove = vi.spyOn(page, 'removeEventListener');
    const output: GeminiFixedTextTrialResult = { ...result };
    const observations: unknown[] = [];
    const value = control(async (signal) => {
      signal.addEventListener(
        'abort',
        () => {
          observations.push(value.registry.lease(value.bootstrap.capability));
        },
        { once: true },
      );
      return output;
    });
    value.registry.lease(value.bootstrap.capability);
    await settle();
    output.model = 'Changed after completion';
    const done = value.registry.lease(value.bootstrap.capability);
    expect(done).toEqual({ status: 'done', result });
    expect(Object.isFrozen(done)).toBe(true);
    if (done.status === 'done') expect(Object.isFrozen(done.result)).toBe(true);
    expect(observations).toEqual([done]);
    expect(remove).toHaveBeenCalledWith('pagehide', expect.any(Function));
    page.dispatchEvent(new Event('pagehide'));
    value.registry.stop(value.bootstrap.capability);
    expect(value.registry.lease(value.bootstrap.capability)).toEqual(done);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('never exposes a delayed rejected start after closure', async () => {
    const wait = deferred();
    const value = control(() => wait.promise);
    value.registry.lease(value.bootstrap.capability);
    await settle();
    value.registry.stop(value.bootstrap.capability);
    wait.reject(new Error('SYNTHETIC_PRIVATE_MARKER', { cause: 'history' }));
    await settle();
    expect(value.registry.lease(value.bootstrap.capability)).toEqual(interrupted);
    expect(vi.getTimerCount()).toBe(0);
  });
  it.each([
    [new Error('SYNTHETIC_PRIVATE_MARKER', { cause: 'history' }), 'history'],
    [new Error('SYNTHETIC_PRIVATE_MARKER', { cause: 'SYNTHETIC_PRIVATE_MARKER' }), 'response'],
    [new Error('SYNTHETIC_PRIVATE_MARKER', { cause: 'response-raw-field-0' }), 'response'],
    [new Error('SYNTHETIC_PRIVATE_MARKER', { cause: 'response-raw-field-2' }), 'response'],
    [new Error('SYNTHETIC_PRIVATE_MARKER', { cause: 'response-raw-field-65' }), 'response'],
    [new Error('SYNTHETIC_PRIVATE_MARKER', { cause: 'response-raw-field-81' }), 'response'],
    [new Error('SYNTHETIC_PRIVATE_MARKER', { cause: 'response-raw-field-017' }), 'response'],
    [new Error('SYNTHETIC_PRIVATE_MARKER', { cause: 'response-raw-field-NaN' }), 'response'],
    [
      new Error('SYNTHETIC_PRIVATE_MARKER', {
        cause: 'response-raw-field-SYNTHETIC_PRIVATE_MARKER',
      }),
      'response',
    ],
    ['SYNTHETIC_PRIVATE_MARKER', 'response'],
  ])('sanitizes a rejected start to a fixed reason', async (error, reason) => {
    const value = control(async () => {
      throw error;
    });
    value.registry.lease(value.bootstrap.capability);
    await settle();
    expect(value.registry.lease(value.bootstrap.capability)).toEqual({ status: 'error', reason });
    expect(vi.getTimerCount()).toBe(0);
  });
  it('sanitizes a synchronous start exception and does not retry', async () => {
    const start = vi.fn(() => {
      throw new Error('SYNTHETIC_PRIVATE_MARKER');
    });
    const value = control(start);
    value.registry.lease(value.bootstrap.capability);
    await settle();
    expect(value.registry.lease(value.bootstrap.capability)).toEqual({
      status: 'error',
      reason: 'response',
    });
    await settle();
    expect(start).toHaveBeenCalledTimes(1);
  });
  it('does not read an error cause accessor', async () => {
    const getter = vi.fn(() => 'SYNTHETIC_PRIVATE_MARKER');
    const error = Object.defineProperty(new Error('SYNTHETIC_PRIVATE_MARKER'), 'cause', {
      get: getter,
    });
    const value = control(async () => {
      throw error;
    });
    value.registry.lease(value.bootstrap.capability);
    await settle();
    expect(getter).not.toHaveBeenCalled();
    expect(value.registry.lease(value.bootstrap.capability)).toEqual({
      status: 'error',
      reason: 'response',
    });
  });
});

describe('inert terminal-error query', () => {
  it('does not start, coerce capabilities or expose a pre-start stop', async () => {
    const start = vi.fn(async () => result);
    const value = control(start);
    const getter = vi.fn(() => value.bootstrap.capability);
    for (const received of [
      undefined,
      null,
      false,
      1,
      {},
      [],
      'wrong',
      Object.defineProperty({}, 'toString', { get: getter }),
      value.bootstrap.capability,
    ])
      expect(value.registry.terminalError(received)).toBeNull();
    expect(vi.getTimerCount()).toBe(2);
    value.registry.stop(value.bootstrap.capability);
    expect(value.registry.terminalError(value.bootstrap.capability)).toBeNull();
    await settle();
    expect(start).not.toHaveBeenCalled();
    expect(getter).not.toHaveBeenCalled();
  });
  it('does not check elapsed time, stop or renew a pending lease', async () => {
    const wait = deferred();
    const start = vi.fn((_signal: AbortSignal) => wait.promise);
    const value = control(start);
    value.registry.lease(value.bootstrap.capability);
    await vi.advanceTimersByTimeAsync(14000);
    const now = vi.spyOn(performance, 'now').mockReturnValue(15001);
    const set = vi.spyOn(globalThis, 'setTimeout');
    const clear = vi.spyOn(globalThis, 'clearTimeout');
    expect(value.registry.terminalError(value.bootstrap.capability)).toBeNull();
    expect(start.mock.calls[0]![0].aborted).toBe(false);
    expect(now).not.toHaveBeenCalled();
    expect(set).not.toHaveBeenCalled();
    expect(clear).not.toHaveBeenCalled();
    now.mockRestore();
    await vi.advanceTimersByTimeAsync(1000);
    expect(start.mock.calls[0]![0].aborted).toBe(true);
    expect(value.registry.terminalError(value.bootstrap.capability)).toEqual({
      status: 'error',
      reason: 'interrupted',
    });
    expect(start).toHaveBeenCalledTimes(1);
  });
  it('returns no completed result and does not change timers or terminal progress', async () => {
    const start = vi.fn(async () => result);
    const value = control(start);
    value.registry.lease(value.bootstrap.capability);
    await settle();
    const set = vi.spyOn(globalThis, 'setTimeout');
    const clear = vi.spyOn(globalThis, 'clearTimeout');
    for (let i = 0; i < 3; i++)
      expect(value.registry.terminalError(value.bootstrap.capability)).toBeNull();
    expect(set).not.toHaveBeenCalled();
    expect(clear).not.toHaveBeenCalled();
    expect(start).toHaveBeenCalledTimes(1);
    expect(value.registry.lease(value.bootstrap.capability)).toEqual({ status: 'done', result });
  });
  it.each([false, true])(
    'keeps the first terminal failure across a stop race: stop first %s',
    async (stopFirst) => {
      const wait = deferred();
      const start = vi.fn(() => wait.promise);
      const value = control(start);
      value.registry.lease(value.bootstrap.capability);
      await settle();
      if (stopFirst) value.registry.stop(value.bootstrap.capability);
      wait.reject(new Error('SYNTHETIC_PRIVATE_MARKER', { cause: 'response-error' }));
      await settle();
      if (!stopFirst) value.registry.stop(value.bootstrap.capability);
      expect(value.registry.terminalError(value.bootstrap.capability)).toEqual({
        status: 'error',
        reason: stopFirst ? 'interrupted' : 'response-error',
      });
      expect(value.registry.terminalError('wrong')).toBeNull();
      expect(vi.getTimerCount()).toBe(0);
      expect(start).toHaveBeenCalledTimes(1);
    },
  );
});

describe('Native66 closed receive progress', () => {
  const diagnostic = { origin: 'capture', predicate: 'dispatch-native-n15-wire-06' };
  it('preserves an immutable detached P18 snapshot through both existing channels', async () => {
    const error = Object.defineProperty(
      new Error('SYNTHETIC_PRIVATE', { cause: 'dispatch-observation' }),
      'geminiNativeReceiveDiagnostic',
      { value: diagnostic },
    );
    const value = control(async () => {
      throw error;
    });
    value.registry.lease(value.bootstrap.capability);
    await settle();
    const expected = {
      status: 'error',
      reason: 'dispatch-observation',
      diagnostic: { ...diagnostic },
    };
    const ordinary = value.registry.lease(value.bootstrap.capability);
    expect(ordinary).toEqual(expected);
    expect(value.registry.terminalError(value.bootstrap.capability)).toBe(ordinary);
    expect(Object.isFrozen(ordinary)).toBe(true);
    expect(Object.isFrozen((ordinary as any).diagnostic)).toBe(true);
    diagnostic.origin = 'decode';
    expect(value.registry.terminalError(value.bootstrap.capability)).toEqual(expected);
    diagnostic.origin = 'capture';
  });
  it('enumerates every explicit codebook and rejects malformed/accessor/extra/non-P18 metadata', () => {
    const api = receiveContract as any;
    expect(api.GEMINI_NATIVE_RECEIVE_ORIGIN_CODES).toBeDefined();
    expect(api.GEMINI_NATIVE_RECEIVE_PREDICATE_CODES).toBeDefined();
    for (const predicate of ['dispatch-native-n25', 'dispatch-native-n26', 'dispatch-native-n27'])
      expect(
        GeminiFixedTextTrialProgress.safeParse({
          status: 'error',
          reason: 'dispatch-observation',
          diagnostic: { origin: 'prior-guard', predicate },
        }).success,
      ).toBe(false);
    expect(
      api.formatGeminiNativeReceiveDiagnostic({
        origin: 'capture',
        predicate: 'dispatch-native-n15-wire-06',
      }),
    ).toBe('P18-R3-P38');
    for (const [origin, ordinal] of Object.entries(api.GEMINI_NATIVE_RECEIVE_ORIGIN_CODES)) {
      const d = { origin, predicate: 'unknown' };
      expect(api.formatGeminiNativeReceiveDiagnostic(d)).toBe(`P18-R${ordinal}-P1`);
      expect(
        GeminiFixedTextTrialProgress.safeParse({
          status: 'error',
          reason: 'dispatch-observation',
          diagnostic: d,
        }).success,
      ).toBe(true);
    }
    for (const [predicate, ordinal] of Object.entries(api.GEMINI_NATIVE_RECEIVE_PREDICATE_CODES))
      expect(api.formatGeminiNativeReceiveDiagnostic({ origin: 'capture', predicate })).toBe(
        `P18-R3-P${ordinal}`,
      );
    const getter = vi.fn(() => 'capture');
    for (const malformed of [
      { ...diagnostic, extra: 'SYNTHETIC_PRIVATE' },
      { ...diagnostic, origin: 'private' },
      { ...diagnostic, predicate: 'private' },
      Object.defineProperty({ predicate: 'unknown' }, 'origin', { get: getter }),
      null,
      'capture',
    ])
      expect(
        GeminiFixedTextTrialProgress.safeParse({
          status: 'error',
          reason: 'dispatch-observation',
          diagnostic: malformed,
        }).success,
      ).toBe(false);
    expect(getter).not.toHaveBeenCalled();
    for (const status of [
      { status: 'error', reason: 'cleanup' },
      { status: 'pending' },
      { status: 'done', result },
    ])
      expect(GeminiFixedTextTrialProgress.safeParse({ ...status, diagnostic }).success).toBe(false);
    expect(
      GeminiFixedTextTrialRecord.safeParse({ id: 'synthetic', status: 'uncertain', diagnostic })
        .success,
    ).toBe(false);
  });
});

it('Native66 ignores forged/accessor P18 metadata and never retains it on another reason', async () => {
  const getter = vi.fn(() => ({ origin: 'decode', predicate: 'unknown' }));
  const values = [
    Object.defineProperty(
      new Error('', { cause: 'dispatch-observation' }),
      'geminiNativeReceiveDiagnostic',
      { get: getter },
    ),
    Object.assign(new Error('', { cause: 'dispatch-observation' }), {
      geminiNativeReceiveDiagnostic: { origin: 'decode', predicate: 'unknown' },
    }),
    Object.defineProperty(new Error('', { cause: 'cleanup' }), 'geminiNativeReceiveDiagnostic', {
      value: { origin: 'decode', predicate: 'unknown' },
    }),
    Object.defineProperty(
      new Error('', { cause: 'dispatch-observation' }),
      'geminiNativeReceiveDiagnostic',
      { value: { origin: 'decode', predicate: 'unknown', private: 'SYNTHETIC' } },
    ),
  ];
  for (const error of values) {
    const value = control(async () => {
      throw error;
    });
    value.registry.lease(value.bootstrap.capability);
    await settle();
    expect(value.registry.terminalError(value.bootstrap.capability)).toEqual({
      status: 'error',
      reason: error.cause,
    });
  }
  expect(getter).not.toHaveBeenCalled();
});

it('Native66 rejects a diagnostic accessor on an error snapshot without invoking it', () => {
  const getter = vi.fn(() => ({ origin: 'capture', predicate: 'unknown' }));
  const payload = Object.defineProperty(
    { status: 'error', reason: 'dispatch-observation' },
    'diagnostic',
    { get: getter, enumerable: true },
  );
  expect(GeminiFixedTextTrialProgress.safeParse(payload).success).toBe(false);
  expect(getter).not.toHaveBeenCalled();
});

it('Native66 keeps prototype-named and symbol extras visible to strict error snapshot validation', () => {
  const payload = { status: 'error', reason: 'dispatch-observation' };
  Object.defineProperty(payload, '__proto__', { value: Object.create(null), enumerable: true });
  expect(GeminiFixedTextTrialProgress.safeParse(payload).success).toBe(false);
  expect(
    GeminiFixedTextTrialProgress.safeParse({ ...payload, [Symbol('private')]: 'SYNTHETIC_PRIVATE' })
      .success,
  ).toBe(false);
});

it.each([
  ['ordinary progress', GeminiFixedTextTrialProgress],
  ['terminal error', receiveContract.GeminiFixedTextTrialErrorProgress],
] as const)(
  'Native66 review rejects result accessors on error snapshots before parsing another %s branch',
  (_name, schema) => {
    const throwing = vi.fn(() => {
      throw Error('SYNTHETIC_GETTER');
    });
    const payload = { status: 'error', reason: 'dispatch-observation' };
    const extraResult = Object.defineProperty({ ...payload }, 'result', {
      get: throwing,
      enumerable: true,
    });
    let parsed: ReturnType<typeof schema.safeParse> | undefined;
    expect(() => {
      parsed = schema.safeParse(extraResult);
    }).not.toThrow();
    expect(parsed).toMatchObject({ success: false });
    expect(throwing).not.toHaveBeenCalled();
  },
);

it.each(['status', 'diagnostic'] as const)(
  'Native66 review rejects a top-level %s accessor without invoking it in either channel',
  (key) => {
    const getter = vi.fn(() =>
      key === 'status' ? 'error' : { origin: 'capture', predicate: 'unknown' },
    );
    const payload = Object.defineProperty(
      { status: 'error', reason: 'dispatch-observation' },
      key,
      { get: getter, enumerable: true },
    );
    for (const schema of [
      GeminiFixedTextTrialProgress,
      receiveContract.GeminiFixedTextTrialErrorProgress,
    ]) {
      let parsed: ReturnType<typeof schema.safeParse> | undefined;
      expect(() => {
        parsed = schema.safeParse(payload);
      }).not.toThrow();
      expect(parsed).toMatchObject({ success: false });
      expect(getter).not.toHaveBeenCalled();
    }
  },
);

it.each([
  ['ordinary progress', GeminiFixedTextTrialProgress],
  ['terminal error', receiveContract.GeminiFixedTextTrialErrorProgress],
] as const)(
  'Native66 review does not parse nested result getters on a malformed error through %s',
  (_name, schema) => {
    const nested = vi.fn(() => {
      throw Error('SYNTHETIC_NESTED_GETTER');
    });
    const result = Object.defineProperties(
      {},
      { model: { get: nested, enumerable: true }, answer: { get: nested, enumerable: true } },
    );
    let parsed: ReturnType<typeof schema.safeParse> | undefined;
    expect(() => {
      parsed = schema.safeParse({ status: 'error', reason: 'dispatch-observation', result });
    }).not.toThrow();
    expect(parsed).toMatchObject({ success: false });
    expect(nested).not.toHaveBeenCalled();
  },
);

it('Native67 appends only fixed field-boundary codes and keeps both strict P18 channels', async () => {
  const labels = [
    'fields-envelope-ignored-branch',
    'fields-envelope-other',
    'fields-hjd-ignored-branch',
    'fields-hjd-other',
    'fields-bjd-ignored-branch',
    'fields-bjd-other',
    'fields-ajd-ignored-branch',
    'fields-ajd-other',
    'fields-prior-aa-identity',
    'fields-native-holder',
    'fields-raw-identity',
    'fields-raw-location',
    'fields-raw-routing',
    'fields-raw-client',
    'fields-raw-fallback',
    'fields-raw-candidate',
    'fields-raw-candidate-extra',
    'fields-raw-status',
    'fields-raw-text',
    'fields-raw-structured',
    'fields-raw-node',
    'fields-raw-plain',
  ];
  expect(receiveContract.GEMINI_NATIVE_RECEIVE_PREDICATE_CODES['dispatch-native-n15-wire-16']).toBe(
    48,
  );
  expect(receiveContract.GEMINI_NATIVE_RECEIVE_PREDICATE_CODES['response-transition']).toBe(211);
  for (const [index, predicate] of labels.entries()) {
    const diagnostic = { origin: 'capture', predicate };
    expect(receiveContract.formatGeminiNativeReceiveDiagnostic(diagnostic)).toBe(
      `P18-R3-P${212 + index}`,
    );
    const value = control(async () => {
      throw Object.defineProperty(
        new Error('SYNTHETIC_PRIVATE', { cause: 'dispatch-observation' }),
        'geminiNativeReceiveDiagnostic',
        { value: diagnostic },
      );
    });
    value.registry.lease(value.bootstrap.capability);
    await settle();
    const expected = { status: 'error', reason: 'dispatch-observation', diagnostic };
    expect(value.registry.lease(value.bootstrap.capability)).toEqual(expected);
    expect(value.registry.terminalError(value.bootstrap.capability)).toEqual(expected);
    expect(GeminiFixedTextTrialProgress.safeParse(expected).success).toBe(true);
    expect(
      GeminiFixedTextTrialRecord.safeParse({ id: 'synthetic', status: 'uncertain', diagnostic })
        .success,
    ).toBe(false);
  }
  expect(
    receiveContract.formatGeminiNativeReceiveDiagnostic({
      origin: 'capture',
      predicate: 'fields-envelope-private-value',
    }),
  ).toBeUndefined();
});
