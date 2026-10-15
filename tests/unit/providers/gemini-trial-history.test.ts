import { describe, expect, it, vi } from 'vitest';
import { GEMINI_FIXED_TEXT_TRIAL_ANSWER } from '../../../src/application/gemini-fixed-text-trial';
import { readGeminiTrialHistory } from '../../../src/infrastructure/providers/gemini/trial-history';
import type {
  GeminiFinalMarker,
  GeminiTrialCompletion,
} from '../../../src/infrastructure/providers/gemini/fixed-text-contract';
import { geminiTrialHistoryFixture } from '../../fixtures/providers/gemini-trial-history';

type Fixture = ReturnType<typeof geminiTrialHistoryFixture>;
const read = (f: Fixture, current = f.current, completion: GeminiTrialCompletion = f.completed) =>
  readGeminiTrialHistory(f.namespace, f.api, f.approved, completion, f.controller.signal, current);
const marker = (f: Fixture): GeminiFinalMarker => ({
  kind: 'marker',
  conversationId: f.completed.conversationId,
  turnId: f.completed.turnId,
});
async function rejected(promise: Promise<unknown>, reason: 'history' | 'interrupted') {
  await expect(promise).rejects.toMatchObject({
    message: 'Gemini trial history failed.',
    cause: reason,
  });
}

describe('Gemini owned unary trial history', () => {
  it.each([false, true])(
    'reads one genuine saved turn for a marker with observed candidate %j',
    async (observed) => {
      const f = geminiTrialHistoryFixture();
      const completion = marker(f);
      if (observed) completion.observedCandidateId = f.completed.candidateId;
      f.response.fl[28] = true;
      f.response.fl[14] = 'synthetic-server-choice';
      f.synchronous();
      await expect(read(f, f.current, completion)).resolves.toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
      expect(f.wrapper().requestMessage.fl[0]).toBe(completion.conversationId);
      expect(f.calls.fetch).toBe(1);
      expect(f.calls.then).toBe(1);
      expect(Object.keys(completion)).toEqual(
        observed
          ? ['kind', 'conversationId', 'turnId', 'observedCandidateId']
          : ['kind', 'conversationId', 'turnId'],
      );
    },
  );
  it.each([
    { kind: 'other' },
    { conversationId: '' },
    { turnId: '' },
    { observedCandidateId: undefined },
    { observedCandidateId: '' },
    { candidateId: 'rc_49' },
    { answer: GEMINI_FIXED_TEXT_TRIAL_ANSWER },
    { Zzb: false },
    { privateExtra: undefined },
  ])('refuses malformed marker %j before SDK initialization', async (change) => {
    const f = geminiTrialHistoryFixture();
    const completion = { ...marker(f), ...change } as GeminiTrialCompletion;
    await rejected(read(f, f.current, completion), 'history');
    expect(f.calls.fetch).toBe(0);
    expect(f.calls.then).toBe(0);
    expect(f.calls.setters).toEqual([]);
  });
  it.each(['kind', 'conversationId', 'turnId', 'observedCandidateId'])(
    'refuses a marker %s getter before SDK initialization',
    async (key) => {
      const f = geminiTrialHistoryFixture();
      const getter = vi.fn(() => 'SYNTHETIC_PRIVATE_MARKER');
      const completion = Object.defineProperty(marker(f), key, { get: getter });
      await rejected(read(f, f.current, completion), 'history');
      expect(f.calls.fetch).toBe(0);
      expect(f.calls.setters).toEqual([]);
      expect(getter).not.toHaveBeenCalled();
    },
  );
  it.each(['conversationId', 'turnId', 'observedCandidateId', 'extra', 'getter'] as const)(
    'rejects queued marker %s changes before genuine dispatch',
    async (key) => {
      const f = geminiTrialHistoryFixture();
      const completion = { ...marker(f), observedCandidateId: f.completed.candidateId };
      const getter = vi.fn(() => 'SYNTHETIC_PRIVATE_MARKER');
      f.deferReady();
      const pending = read(f, f.current, completion);
      if (key === 'extra') Object.assign(completion, { privateExtra: undefined });
      else if (key === 'getter') Object.defineProperty(completion, 'turnId', { get: getter });
      else completion[key] = 'synthetic-other';
      f.flushReady();
      await rejected(pending, 'history');
      expect(f.calls.fetch).toBe(0);
      expect(getter).not.toHaveBeenCalled();
    },
  );
  it.each(['abort', 'lease'] as const)('refuses queued marker reads after %s', async (cause) => {
    const f = geminiTrialHistoryFixture();
    f.deferReady();
    const pending = read(f, f.current, marker(f));
    if (cause === 'abort') f.controller.abort();
    else f.loseLease();
    f.flushReady();
    await rejected(pending, 'interrupted');
    expect(f.calls.fetch).toBe(0);
  });
  it('cancels a marker read after initialization and never accepts a late reply', async () => {
    const f = geminiTrialHistoryFixture();
    f.deferReady();
    const pending = read(f, f.current, marker(f));
    void pending.catch(() => {});
    f.flushReady();
    expect(f.calls.fetch).toBe(1);
    f.controller.abort();
    await rejected(pending, 'interrupted');
    expect(f.calls.cancel).toBe(1);
    expect(f.fetched().ha).toBe(3);
    f.resolve();
    expect(f.calls.fetch).toBe(1);
    expect(f.calls.cancel).toBe(1);
  });
  it.each(['dense', 'sparse'] as const)(
    'reads %s saved29 omission with later metadata once',
    async (representation) => {
      const f = geminiTrialHistoryFixture();
      if (representation === 'dense') {
        f.response.fl[28] = null;
        f.response.fl[29] = 'synthetic-route';
        f.response.fl[30] = 'synthetic-effort';
      } else {
        f.response.fl = [
          [f.candidate],
          {
            4: f.completed.candidateId,
            10: true,
            29: null,
            30: 'synthetic-route',
            31: 'synthetic-effort',
          },
        ];
        f.response.fl[f.namespace.La] = 2144 | (2 << 14);
      }
      f.synchronous();
      await expect(read(f, f.current, marker(f))).resolves.toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
      expect(f.calls.fetch).toBe(1);
      expect(f.calls.then).toBe(1);
    },
  );
  it.each(['selection', 'incomplete', 'stopped'] as const)(
    'refuses marker %s history without retry',
    async (cause) => {
      const f = geminiTrialHistoryFixture();
      const completion = { ...marker(f), observedCandidateId: f.completed.candidateId };
      if (cause === 'selection') f.response.fl[3] = f.candidate.fl[0] = 'rc_other';
      if (cause === 'incomplete') f.status[0] = 1;
      if (cause === 'stopped') f.response.fl[10] = true;
      f.synchronous();
      await rejected(read(f, f.current, completion), 'history');
      expect(f.calls.fetch).toBe(1);
      expect(f.calls.then).toBe(1);
    },
  );
  it.each([false, true])(
    'preserves a private %j Boolean receipt through the exact history read',
    async (value) => {
      const f = geminiTrialHistoryFixture();
      Object.assign(f.completed, { Zzb: value });
      f.response.fl[28] = value;
      f.synchronous();
      await expect(read(f)).resolves.toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
      expect(f.calls.fetch).toBe(1);
      expect(f.calls.then).toBe(1);
    },
  );
  it.each([1, 0, 'true', 'false', null])(
    'refuses malformed private Boolean %j before any fetch',
    async (value) => {
      const f = geminiTrialHistoryFixture();
      Object.assign(f.completed, { Zzb: value });
      await rejected(read(f), 'history');
      expect(f.calls.fetch).toBe(0);
    },
  );
  it('does not read an accessor on the private Boolean receipt', async () => {
    const f = geminiTrialHistoryFixture();
    const getter = vi.fn(() => true);
    Object.defineProperty(f.completed, 'Zzb', { get: getter });
    await rejected(read(f), 'history');
    expect(getter).not.toHaveBeenCalled();
    expect(f.calls.fetch).toBe(0);
  });
  it('does not retry a saved Boolean mismatch', async () => {
    const f = geminiTrialHistoryFixture();
    Object.assign(f.completed, { Zzb: true });
    f.response.fl[28] = false;
    f.synchronous();
    await rejected(read(f), 'history');
    expect(f.calls.fetch).toBe(1);
    expect(f.calls.then).toBe(1);
  });

  it('mirrors the exact finite normal request and returns only the validated literal', async () => {
    const f = geminiTrialHistoryFixture();
    f.api.requestSource = 33;
    f.api.yGc = true;
    f.api.xd = true;
    f.Gc.Ha = true;
    const pending = read(f);
    const wrapper = f.wrapper();
    expect(Object.getPrototypeOf(wrapper)).toBe(f.namespace.xxa.prototype);
    expect(Object.getPrototypeOf(wrapper.rpcId)).toBe(f.namespace.Zy.prototype);
    expect(wrapper.rpcId[f.namespace.Kwa]).toBe('unary');
    expect(wrapper.rpcId[f.namespace.ll]).toBe(f.namespace.Uy.o_hNvQHb);
    expect(wrapper.requestMessage.fl).toEqual([
      f.completed.conversationId,
      2,
      undefined,
      33,
      expect.anything(),
      [4, 12],
      undefined,
      true,
    ]);
    expect(Object.getPrototypeOf(wrapper.requestMessage.fl[4])).toBe(f.namespace.RI.prototype);
    expect(wrapper.requestMessage.fl[4].fl).toEqual([true]);
    expect(f.calls.setters.map(([_message, field, value]) => [field, value])).toEqual([
      [1, f.completed.conversationId],
      [2, 2],
      [3, undefined],
      [4, 1],
      [1, true],
      [5, wrapper.requestMessage.fl[4]],
      [4, 33],
      [6, 4],
      [6, 12],
      [8, true],
    ]);
    expect(f.calls.fetch).toBe(1);
    expect(f.calls.then).toBe(1);
    f.resolve();
    await expect(pending).resolves.toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    expect(f.calls.fetch).toBe(1);
  });
  it('preserves absence of optional capabilities and bool flags', async () => {
    const f = geminiTrialHistoryFixture();
    f.synchronous();
    await expect(read(f)).resolves.toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    expect(f.wrapper().requestMessage.fl).toEqual([
      f.completed.conversationId,
      2,
      undefined,
      1,
      expect.anything(),
      [4],
    ]);
    expect(f.wrapper().requestMessage.fl[4].fl).toEqual([false]);
  });
  it.each([
    (f: Fixture) => Object.setPrototypeOf(f.api, Object.prototype),
    (f: Fixture) => (f.api.oa = {} as any),
    (f: Fixture) => (f.api.Gc = {} as any),
    (f: Fixture) => (f.api.yGc = 1 as any),
    (f: Fixture) => (f.api.xd = 'true' as any),
    (f: Fixture) => (f.api.requestSource = NaN),
    (f: Fixture) => (f.Gc.Ha = 'private' as any),
    (f: Fixture) => (f.namespace.RGd.Ob = 'synthetic-foreign'),
    (f: Fixture) => (f.namespace.RGd.Rb = false),
    (f: Fixture) => (f.namespace.Uy.o_hNvQHb.Ub = f.namespace.RI),
    (f: Fixture) => f.namespace.Uy.o_hNvQHb.n_b.push({ key: {}, value: 'private' }),
    (f: Fixture) => Object.assign(f.namespace.RGd, { privateExtra: undefined }),
    (f: Fixture) =>
      (f.namespace.Pi = () => {
        throw new Error('private');
      }),
    (f: Fixture) =>
      Object.assign(f.oa, {
        fetch() {
          f.calls.fetch++;
          return new f.namespace.te();
        },
      }),
    (f: Fixture) =>
      (Object.getPrototypeOf(f.oa).fetch = () => {
        f.calls.fetch++;
        return new f.namespace.te();
      }),
    (f: Fixture) => (f.completed.conversationId = ''),
    (f: Fixture) => (f.completed.answer = 'private' as any),
    (f: Fixture) => (f.approved.modeId = ''),
  ])('rejects invalid owned client/profile/receipt before any read', async (mutate) => {
    const f = geminiTrialHistoryFixture();
    mutate(f);
    f.synchronous();
    await rejected(read(f), 'history');
    expect(f.calls.fetch).toBe(0);
    expect(f.calls.then).toBe(0);
  });
  it.each(['abort', 'lease', 'throw'] as const)(
    'does zero reads for an initial %s interruption',
    async (reason) => {
      const f = geminiTrialHistoryFixture();
      if (reason === 'abort') f.controller.abort();
      if (reason === 'lease') f.loseLease();
      await rejected(
        read(
          f,
          reason === 'throw'
            ? () => {
                throw new Error('private');
              }
            : f.current,
        ),
        'interrupted',
      );
      expect(f.calls.fetch).toBe(0);
      expect(f.calls.setters).toEqual([]);
    },
  );
  it.each(['lease', 'abort', 'source'] as const)(
    'rechecks after request assembly for %s changes',
    async (reason) => {
      const f = geminiTrialHistoryFixture();
      f.beforeSet(() => {
        if (reason === 'lease') f.loseLease();
        if (reason === 'abort') f.controller.abort();
        if (reason === 'source') f.api.requestSource = 2;
      });
      f.synchronous();
      await rejected(read(f), reason === 'source' ? 'history' : 'interrupted');
      expect(f.calls.fetch).toBe(0);
    },
  );
  it('closes before genuine cancellation and ignores a late matching reply', async () => {
    const f = geminiTrialHistoryFixture();
    const remove = vi.spyOn(f.controller.signal, 'removeEventListener');
    const pending = read(f);
    f.controller.abort();
    await rejected(pending, 'interrupted');
    expect(f.calls.cancel).toBe(1);
    expect(remove).toHaveBeenCalledOnce();
    f.resolve();
    expect(f.calls.fetch).toBe(1);
    expect(f.calls.then).toBe(1);
    expect(f.calls.cancel).toBe(1);
  });
  it.each(['lease', 'owner', 'receipt', 'getter'] as const)(
    'rejects late %s changes without another read',
    async (reason) => {
      const f = geminiTrialHistoryFixture();
      const pending = read(f);
      const getter = vi.fn(() => 'private');
      if (reason === 'lease') f.loseLease();
      if (reason === 'owner') f.api.oa = {} as any;
      if (reason === 'receipt') f.completed.candidateId = 'rc_foreign';
      if (reason === 'getter') Object.defineProperty(f.api, 'requestSource', { get: getter });
      f.resolve();
      await rejected(pending, reason === 'lease' ? 'interrupted' : 'history');
      expect(f.calls.fetch).toBe(1);
      expect(getter).not.toHaveBeenCalled();
    },
  );
  it.each(['foreign', 'incomplete', 'error'] as const)(
    'refuses %s raw history without retry/projection',
    async (reason) => {
      const f = geminiTrialHistoryFixture();
      if (reason === 'foreign') f.identity.fl[0] = 'c_foreign';
      if (reason === 'incomplete') delete f.response.fl[9];
      const pending = read(f);
      if (reason === 'error') f.reject();
      else f.resolve();
      await rejected(pending, 'history');
      expect(f.calls.fetch).toBe(1);
      expect(f.calls.then).toBe(1);
    },
  );
  it('removes cancellation hook on synchronous valid settlement', async () => {
    const f = geminiTrialHistoryFixture();
    f.synchronous();
    const remove = vi.spyOn(f.controller.signal, 'removeEventListener');
    await expect(read(f)).resolves.toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    expect(remove).toHaveBeenCalledOnce();
    f.controller.abort();
    expect(f.calls.cancel).toBe(0);
  });
  it('requests genuine cleanup when cancelled during synchronous registration', async () => {
    const f = geminiTrialHistoryFixture();
    f.beforeThen(() => f.controller.abort());
    f.synchronous();
    await rejected(read(f), 'interrupted');
    expect(f.calls.fetch).toBe(1);
    expect(f.calls.then).toBe(1);
    expect(f.calls.cancel).toBe(1);
  });
  it('sanitizes a synchronous source read callback error and does not retry', async () => {
    const f = geminiTrialHistoryFixture();
    f.fetchError();
    await rejected(read(f), 'history');
    expect(f.calls.fetch).toBe(1);
    expect(f.calls.then).toBe(1);
  });
  it('rejects accessor inputs without invoking them or reading', async () => {
    for (const target of ['namespace', 'api', 'descriptor', 'receipt'] as const) {
      const f = geminiTrialHistoryFixture();
      const getter = vi.fn(() => 'private');
      if (target === 'namespace') Object.defineProperty(f.namespace, 'Zy', { get: getter });
      else if (target === 'api') Object.defineProperty(f.api, 'oa', { get: getter });
      else if (target === 'descriptor')
        Object.defineProperty(f.namespace.RGd, 'Pb', { get: getter });
      else Object.defineProperty(f.completed, 'conversationId', { get: getter });
      f.synchronous();
      await rejected(read(f), 'history');
      expect(getter).not.toHaveBeenCalled();
      expect(f.calls.fetch).toBe(0);
    }
  });
  it.each(['lease', 'owner'] as const)(
    'does not delegate a queued unary read after %s is lost',
    async (reason) => {
      const f = geminiTrialHistoryFixture();
      f.deferReady();
      const pending = read(f);
      expect(f.calls.fetch).toBe(0);
      if (reason === 'lease') f.loseLease();
      else f.api.requestSource = 33;
      f.flushReady();
      if (f.calls.fetch) f.resolve();
      await rejected(pending, reason === 'lease' ? 'interrupted' : 'history');
      expect(f.calls.fetch).toBe(0);
    },
  );
  it('uses genuine cancellation to prevent an owned pending initialization callback', async () => {
    const f = geminiTrialHistoryFixture();
    f.deferReady();
    const pending = read(f);
    f.controller.abort();
    await rejected(pending, 'interrupted');
    f.flushReady();
    expect(f.calls.fetch).toBe(0);
    expect(f.calls.cancel).toBe(1);
  });
  it('binds the genuine inner SDK promise after initialization for effective pending cancellation', async () => {
    const f = geminiTrialHistoryFixture();
    f.deferReady();
    const pending = read(f);
    f.flushReady();
    expect(f.calls.fetch).toBe(1);
    f.controller.abort();
    await rejected(pending, 'interrupted');
    expect(f.calls.cancel).toBe(1);
    expect(f.fetched().ha).toBe(3);
    f.resolve();
    expect(f.calls.fetch).toBe(1);
  });
  it.each(['data', 'accessor', 'undefined'] as const)(
    'refuses a preexisting %s initialization then override',
    async (kind) => {
      const f = geminiTrialHistoryFixture();
      const getter = vi.fn(() => 'private');
      Object.defineProperty(
        f.oa.ka,
        'then',
        kind === 'accessor'
          ? { get: getter }
          : { value: kind === 'undefined' ? undefined : () => {} },
      );
      await rejected(read(f), 'history');
      expect(f.calls.fetch).toBe(0);
      expect(getter).not.toHaveBeenCalled();
    },
  );
  it('restores the initialization method immediately while retaining only the deferred callback', async () => {
    const f = geminiTrialHistoryFixture();
    f.deferReady();
    const pending = read(f);
    expect(Object.hasOwn(f.oa.ka, 'then')).toBe(false);
    expect(f.calls.fetch).toBe(0);
    f.flushReady();
    f.resolve();
    await expect(pending).resolves.toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    expect(Object.hasOwn(f.oa.ka, 'then')).toBe(false);
    expect(f.calls.fetch).toBe(1);
    expect(f.calls.then).toBe(1);
  });
  it('closes before delegation when current reentrantly aborts during queued initialization', async () => {
    const f = geminiTrialHistoryFixture();
    f.deferReady();
    let abort = false;
    const pending = read(f, () => {
      if (abort) f.controller.abort();
      return true;
    });
    abort = true;
    f.flushReady();
    await rejected(pending, 'interrupted');
    expect(f.calls.fetch).toBe(0);
    expect(f.calls.cancel).toBe(1);
  });
  it('restores the owned initialization method after synchronous fetch initialization failure', async () => {
    const f = geminiTrialHistoryFixture();
    f.readyThenError();
    const remove = vi.spyOn(f.controller.signal, 'removeEventListener');
    await rejected(read(f), 'history');
    expect(Object.hasOwn(f.oa.ka, 'then')).toBe(false);
    expect(f.calls.fetch).toBe(0);
    expect(f.calls.then).toBe(0);
    expect(remove).toHaveBeenCalledOnce();
  });
  it('requests inner cleanup after synchronous observer registration failure', async () => {
    const f = geminiTrialHistoryFixture();
    f.beforeThen(() => {
      throw new Error('SYNTHETIC_PRIVATE_MARKER');
    });
    const remove = vi.spyOn(f.controller.signal, 'removeEventListener');
    await rejected(read(f), 'history');
    expect(f.calls.fetch).toBe(1);
    expect(f.calls.then).toBe(1);
    expect(f.calls.cancel).toBe(1);
    expect(f.fetched().ha).toBe(3);
    expect(remove).toHaveBeenCalledOnce();
  });
  it('refuses a changed descriptor before queued delegation', async () => {
    const f = geminiTrialHistoryFixture();
    f.deferReady();
    const pending = read(f);
    f.namespace.Uy.o_hNvQHb = { ...f.namespace.Uy.o_hNvQHb };
    f.flushReady();
    await rejected(pending, 'history');
    expect(f.calls.fetch).toBe(0);
    expect(f.calls.then).toBe(1);
  });
  it('does not delete a foreign replacement of the temporary initialization gate', async () => {
    const f = geminiTrialHistoryFixture();
    const foreign = () => {};
    f.beforeFetch(() =>
      Object.defineProperty(f.oa.ka, 'then', {
        value: foreign,
        configurable: true,
        writable: true,
      }),
    );
    await rejected(read(f), 'history');
    expect(f.oa.ka.then).toBe(foreign);
    expect(f.calls.fetch).toBe(1);
    expect(f.calls.then).toBe(0);
    expect(f.calls.cancel).toBe(1);
  });
  it('continues to refuse incomplete raw history after delayed normal initialization', async () => {
    const f = geminiTrialHistoryFixture();
    f.deferReady();
    delete f.response.fl[9];
    const pending = read(f);
    f.flushReady();
    f.resolve();
    await rejected(pending, 'history');
    expect(f.calls.fetch).toBe(1);
    expect(f.calls.then).toBe(1);
  });
  it('still requests genuine inner cancellation if listener cleanup throws', async () => {
    const f = geminiTrialHistoryFixture();
    const pending = read(f);
    const remove = vi.spyOn(f.controller.signal, 'removeEventListener').mockImplementation(() => {
      throw new Error('SYNTHETIC_PRIVATE_MARKER');
    });
    f.controller.abort();
    await rejected(pending, 'history');
    expect(f.calls.cancel).toBe(1);
    expect(f.fetched().ha).toBe(3);
    remove.mockRestore();
  });
});
