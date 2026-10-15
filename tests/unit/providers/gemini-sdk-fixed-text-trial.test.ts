import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Script } from 'node:vm';
import { geminiSdkFixedTextTrialFixture as fixture } from '../../fixtures/providers/gemini-sdk-fixed-text-trial';
import {
  geminiNativeTrialPage,
  geminiNativeTrialSource,
} from '../../fixtures/providers/gemini-readiness';
import { runGeminiSdkFixedTextTrial } from '../../../src/infrastructure/providers/gemini/sdk-fixed-text-trial';
import { readGeminiClientCapability } from '../../../src/infrastructure/providers/gemini/client-capability';
import { GeminiClientCapability } from '../../../src/application/gemini-readiness';
import {
  GeminiFixedTextTrialReason,
  GeminiFixedTextTrialProgress,
} from '../../../src/application/gemini-fixed-text-trial';
let f: ReturnType<typeof fixture>;
vi.mock('../../../src/infrastructure/providers/gemini/client-capability', () => ({
  readGeminiClientCapability: vi.fn(
    (capture: Function, expectedUrl = 'https://gemini.google.com/app') => {
      if (f.location.href !== expectedUrl || !f.host.isConnected || !f.owner.isConnected)
        return { status: 'unsupported', reason: 'owner' };
      capture(f.client);
      return {
        status: 'unsupported',
        reason: f.native
          ? Object.hasOwn(f.api, 'Zxb')
            ? 'hook'
            : 'transport-webchannel'
          : 'transport-rpc',
      };
    },
  ),
}));
vi.mock('../../../src/infrastructure/providers/gemini/readiness', () => ({
  geminiReadiness: (signal: AbortSignal, requireHeaderGlow: boolean) => {
    expect(signal).toBeInstanceOf(AbortSignal);
    expect(requireHeaderGlow).toBe(true);
    return f.readiness();
  },
}));
vi.mock('../../../src/infrastructure/providers/gemini/model-receipt', () => ({
  captureGeminiTrialModel: () => f.receipt(),
}));
vi.mock('../../../src/infrastructure/providers/gemini/sdk-dispatch', () => ({
  armGeminiRpcDispatch: (
    _n: unknown,
    _a: unknown,
    current: () => boolean,
    incoming: Parameters<typeof f.guard>[1],
  ) => f.guard(current, incoming),
}));
vi.mock('../../../src/infrastructure/providers/gemini/trial-history', async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import('../../../src/infrastructure/providers/gemini/trial-history')
    >();
  return {
    readGeminiTrialHistory: (...args: Parameters<typeof actual.readGeminiTrialHistory>) =>
      f.native ? actual.readGeminiTrialHistory(...args) : f.history(...args),
  };
});
vi.mock('../../../src/infrastructure/providers/dom', () => ({
  composer: () => f.editor,
  draftText: () => f.draft(),
}));
const start = () => runGeminiSdkFixedTextTrial(f.controller.signal, f.current);
const ready = async () => {
  for (let i = 0; i < 8; i++) await Promise.resolve();
};
beforeEach(() => {
  vi.mocked(readGeminiClientCapability).mockImplementation(
    (capture, expectedUrl = 'https://gemini.google.com/app') => {
      if (f.location.href !== expectedUrl || !f.host.isConnected || !f.owner.isConnected)
        return { status: 'unsupported', reason: 'owner' };
      capture?.(f.client);
      return {
        status: 'unsupported',
        reason: f.native
          ? Object.hasOwn(f.api, 'Zxb')
            ? 'hook'
            : 'transport-webchannel'
          : 'transport-rpc',
      };
    },
  );
  f = fixture();
  vi.stubGlobal('window', f.window);
  vi.stubGlobal('document', f.document);
  vi.stubGlobal('location', f.location);
});

const initialReasons = GeminiClientCapability.options[1].shape.reason.options;

describe('Native62 source-initialized current conversation state', () => {
  const noRequest = { requestId: 0, builder: 0, send: 0, oub: 0, inner: 0, history: 0 };
  it('executes current root/thread initializers and selectors including absent-thread fallback', () => {
    const root = f.conversation.store.state();
    expect(root['bard-conversations'].eY).toBe(f.approved.storeId);
    expect(f.namespace.AC(root)).toBe(f.approved.storeId);
    expect(f.namespace.wC(root)).toBe(f.thread.latest);
    expect(
      f.namespace.wC({ 'bard-conversations': { ...root['bard-conversations'], Rm: {} } }),
    ).toBe(f.initialState.source.Sec);
    expect(f.initialState.source.$ec(root)).toEqual({ id: '', Wb: [] });
    expect(f.initialState.source.ifc(root)).toBeUndefined();
    expect(f.thread.latest).toMatchObject({
      conversationId: '',
      Hj: [],
      Wb: {},
      isTemporaryChat: false,
    });
    expect(Object.hasOwn(f.thread.latest as object, 'Gj')).toBe(false);
    expect(Object.hasOwn(root['bard-conversations'], 'V_')).toBe(false);
    expect(Object.hasOwn(root['bard-conversations'], 'jn')).toBe(false);
  });
  it('accepts the default current source state through fixed answer original completion and history', async () => {
    expect(Object.hasOwn(f.thread.latest as object, 'Gj')).toBe(false);
    const result = start().then(
      (value) => ({ status: 'done', value }),
      (error) => ({ status: 'error', cause: error.cause }),
    );
    await ready();
    f.emit();
    f.end();
    expect({
      result: await result,
      attempts: { requestId: f.calls.requestId, send: f.calls.send, history: f.calls.history },
    }).toEqual({
      result: { status: 'done', value: { model: 'Synthetic Auto', answer: f.completed.answer } },
      attempts: { requestId: 1, send: 1, history: 1 },
    });
    expect(f.calls).toMatchObject({ builder: 1, oub: 1, inner: 1 });
    expect(f.initialState.source.$ec(f.conversation.store.state())).toEqual(f.turns.latest);
  });
  it.each(['saa', 'vNc'] as const)(
    'rejects unsafe current %s with an explicitly test-only legacy Gj alias control',
    async (field) => {
      // Test-only legacy alias isolates the two stale safety reads before the separate Gj fix.
      f.thread.emit({
        ...(f.thread.latest as object),
        Gj: [],
        [field]: field === 'saa' ? {} : true,
      });
      const result = start().then(
        (value) => ({ status: 'done', value }),
        (error) => ({ status: 'error', cause: error.cause }),
      );
      await ready();
      f.emit();
      f.end();
      expect({
        result: await result,
        attempts: { requestId: f.calls.requestId, send: f.calls.send, history: f.calls.history },
      }).toEqual({
        result: { status: 'error', cause: 'capture-state' },
        attempts: { requestId: 0, send: 0, history: 0 },
      });
      expect(f.calls).toMatchObject(noRequest);
    },
  );
  it.each([undefined, 'malformed', ['unmaterialized-turn']])(
    'rejects missing malformed or nonempty current Hj: %j',
    async (value) => {
      const state: any = { ...(f.thread.latest as object), Hj: value };
      if (value === undefined) delete state.Hj;
      f.thread.emit(state);
      expect(f.turns.latest).toEqual({ id: '', Wb: [] });
      await expect(start()).rejects.toMatchObject({ cause: 'capture-state' });
      expect(f.calls).toMatchObject(noRequest);
    },
  );
  it.each(['saa', 'vNc'] as const)('rejects current %s without any legacy alias', async (field) => {
    f.thread.emit({ ...(f.thread.latest as object), [field]: field === 'saa' ? {} : true });
    expect(Object.hasOwn(f.thread.latest as object, 'Gj')).toBe(false);
    expect(f.namespace.wC(f.conversation.store.state())).toBe(f.thread.latest);
    await expect(start()).rejects.toMatchObject({ cause: 'capture-state' });
    expect(f.calls).toMatchObject(noRequest);
  });
});

it.each(['Hj', 'saa', 'vNc'] as const)(
  'Native62 rejects an initial %s getter without invoking it',
  async (field) => {
    const getter = vi.fn(() => {
      throw Error('private');
    });
    Object.defineProperty(f.thread.latest, field, { enumerable: true, get: getter });
    await expect(start()).rejects.toMatchObject({ cause: 'capture-state' });
    expect(getter).not.toHaveBeenCalled();
    expect(f.calls).toMatchObject({
      requestId: 0,
      builder: 0,
      send: 0,
      oub: 0,
      inner: 0,
      history: 0,
    });
  },
);

describe('Gemini fixed SDK capture failure stages', () => {
  it('keeps 29 bounded initial stages and rejects private WebChannel diagnostics', () => {
    expect(initialReasons).toHaveLength(29);
    expect(initialReasons.at(-1)).toBe('transport-webchannel');
    const progress = { status: 'error', reason: 'client-initial-transport-webchannel' };
    expect(GeminiFixedTextTrialProgress.parse(progress)).toEqual(progress);
    for (const extra of [{ oa: false }, { detail: 'SYNTHETIC_PRIVATE_MARKER' }])
      expect(GeminiFixedTextTrialProgress.safeParse({ ...progress, ...extra }).success).toBe(false);
    expect(
      GeminiFixedTextTrialReason.safeParse('client-initial-transport-webchannel-unknown').success,
    ).toBe(false);
  });

  it.each(initialReasons)(
    'projects the failed initial %s capability without acquiring or sending a request',
    async (reason) => {
      const read = vi.mocked(readGeminiClientCapability);
      read.mockClear();
      read.mockImplementationOnce(() => ({
        status: 'unsupported',
        reason,
        raw: 'SYNTHETIC_PRIVATE_MARKER',
      }));
      const removeWindow = vi.spyOn(f.window, 'removeEventListener');
      const removeDocument = vi.spyOn(f.document, 'removeEventListener');
      const removeSignal = vi.spyOn(f.controller.signal, 'removeEventListener');
      const receipt = vi.spyOn(f, 'receipt');
      const initialThread = f.thread.latest;
      const initialTurns = f.turns.latest;
      const error = await start().catch((error: unknown) => error);
      expect(error).toMatchObject({
        message: 'Gemini SDK trial failed.',
        cause: `client-initial-${reason}`,
      });
      expect(GeminiFixedTextTrialReason.safeParse(`client-initial-${reason}`).success).toBe(true);
      expect(Object.getOwnPropertyNames(error)).toEqual(['stack', 'message', 'cause']);
      expect(String(error)).not.toContain('SYNTHETIC_PRIVATE_MARKER');
      expect(read).toHaveBeenCalledTimes(1);
      expect(receipt).not.toHaveBeenCalled();
      expect(f.calls).toMatchObject({ builder: 0, send: 0, oub: 0, inner: 0, history: 0 });
      expect(f.thread.latest).toBe(initialThread);
      expect(f.turns.latest).toBe(initialTurns);
      expect(removeWindow).toHaveBeenCalledTimes(3);
      expect(removeDocument).toHaveBeenCalledTimes(8);
      expect(removeSignal).toHaveBeenCalledTimes(1);
      for (const stream of Object.values(f.conversation) as any[])
        if (stream?.listeners instanceof Set) expect(stream.listeners.size).toBe(0);
      f.emit();
      f.end();
      f.controller.abort();
      f.document.dispatchEvent(new Event('input'));
      await ready();
      expect(f.calls).toMatchObject({ builder: 0, send: 0, oub: 0, inner: 0, history: 0 });
    },
  );

  it.each(
    initialReasons.filter((reason) => !['transport-rpc', 'transport-webchannel'].includes(reason)),
  )('still refuses a captured client with initial %s capability', async (reason) => {
    vi.mocked(readGeminiClientCapability).mockImplementationOnce((capture) => {
      capture?.(f.client);
      return { status: 'unsupported', reason };
    });
    await expect(start()).rejects.toHaveProperty('cause', `client-initial-${reason}`);
    expect(f.calls).toMatchObject({ builder: 0, send: 0, oub: 0, inner: 0, history: 0 });
  });

  it.each([
    'candidate',
    'candidate-empty',
    'unknown',
    'unknown-empty',
    'unclassified',
    'object',
    'symbol',
    'missing',
    'duplicate',
  ] as const)('keeps an initial %s result generic without any request', async (kind) => {
    const stringify = vi.fn(() => 'SYNTHETIC_PRIVATE_MARKER');
    vi.mocked(readGeminiClientCapability).mockImplementationOnce((capture) => {
      if (!kind.endsWith('-empty')) capture?.(f.client);
      if (kind === 'duplicate') capture?.(f.client);
      return kind.startsWith('candidate')
        ? { status: 'candidate' }
        : ({
            status: kind === 'unclassified' ? 'SYNTHETIC_PRIVATE_MARKER' : 'unsupported',
            reason:
              kind === 'object'
                ? { toString: stringify }
                : kind === 'symbol'
                  ? Symbol('SYNTHETIC_PRIVATE_MARKER')
                  : kind === 'missing'
                    ? undefined
                    : 'SYNTHETIC_PRIVATE_MARKER',
          } as never);
    });
    const error = await start().catch((error: unknown) => error);
    expect(error).toMatchObject({ message: 'Gemini SDK trial failed.', cause: 'client-initial' });
    expect(Object.getOwnPropertyNames(error)).toEqual(['stack', 'message', 'cause']);
    expect(String(error)).not.toContain('SYNTHETIC_PRIVATE_MARKER');
    expect(stringify).not.toHaveBeenCalled();
    expect(
      GeminiFixedTextTrialReason.safeParse('client-initial-SYNTHETIC_PRIVATE_MARKER').success,
    ).toBe(false);
    expect(f.calls).toMatchObject({ builder: 0, send: 0, oub: 0, inner: 0, history: 0 });
    await ready();
    expect(f.calls.send).toBe(0);
  });

  it('keeps the captured source-normal transport-rpc client admitted', async () => {
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await expect(pending).resolves.toEqual({ model: 'Synthetic Auto', answer: f.completed.answer });
    expect(f.calls).toMatchObject({ builder: 1, send: 1, oub: 1, inner: 1, history: 1 });
  });

  it.each(['initial', 'protection', 'current'] as const)(
    'classifies the existing %s client check without a second send or private details',
    async (stage) => {
      if (stage === 'initial') f.host.isConnected = false;
      if (stage === 'protection') {
        const receipt = f.receipt;
        f.receipt = async () => {
          const captured = await receipt();
          f.api.Ja.isEnabled = false;
          return captured;
        };
      }
      const pending = start();
      void pending.catch(() => {});
      if (stage === 'current') {
        await ready();
        f.client.namespace = {};
        f.emit();
        f.end();
      }
      await expect(pending).rejects.toMatchObject({
        message: 'Gemini SDK trial failed.',
        cause: stage === 'initial' ? 'client-initial-owner' : `client-${stage}`,
      });
      const started = stage === 'current' ? 1 : 0;
      expect(f.calls).toMatchObject({
        builder: started,
        send: started,
        oub: started,
        inner: started,
        history: 0,
      });
      expect(f.forwarded).toHaveLength(0);
      await ready();
      expect(f.calls.send).toBe(started);
    },
  );

  describe('bounded setup stages', () => {
    const unused = ['UId', 'yJd', 'zJd', 'AJd', 'rPd', '$Id', 'HJd', 'IJd'];

    it.each(['readiness', 'editor', 'bindings', 'actions', 'request-id'] as const)(
      'classifies %s before any request and releases existing observations',
      async (stage) => {
        const initialThread = f.thread.latest;
        const initialTurns = f.turns.latest;
        if (stage === 'readiness')
          f.readiness = async () => {
            throw new Error('SYNTHETIC_PRIVATE', { cause: 'model-unknown-stage' });
          };
        if (stage === 'editor') f.change.draft('SYNTHETIC_PRIVATE');
        if (stage === 'bindings') f.namespace.st = undefined;
        if (stage === 'actions') f.namespace.jLd = undefined;
        if (stage === 'request-id') f.namespace.GN.prototype.Vg = () => '';
        await expect(start()).rejects.toMatchObject({
          message: 'Gemini SDK trial failed.',
          cause: `capture-${stage}`,
        });
        expect(f.calls).toMatchObject({
          builder: 0,
          send: 0,
          oub: 0,
          inner: 0,
          cancel: 0,
          history: 0,
        });
        expect(f.thread.latest).toBe(initialThread);
        expect(f.turns.latest).toBe(initialTurns);
        for (const stream of Object.values(f.conversation) as any[])
          if (stream?.listeners instanceof Set) expect(stream.listeners.size).toBe(0);
      },
    );

    it.each(['missing', 'accessor', 'duplicate'] as const)(
      'does not acquire unused action definitions that are %s',
      async (kind) => {
        const getter = vi.fn(() => f.namespace.jLd);
        for (const name of unused) {
          if (kind === 'missing') delete f.namespace[name];
          else if (kind === 'accessor') Object.defineProperty(f.namespace, name, { get: getter });
          else f.namespace[name] = f.namespace.jLd;
        }
        const pending = start();
        await ready();
        f.emit();
        f.end();
        await expect(pending).resolves.toEqual({
          model: 'Synthetic Auto',
          answer: f.completed.answer,
        });
        expect(getter).not.toHaveBeenCalled();
        expect(f.calls).toMatchObject({
          builder: 1,
          send: 1,
          oub: 1,
          inner: 1,
          cancel: 1,
          history: 1,
        });
      },
    );

    it('rejects a required creator accessor without invoking it', async () => {
      const getter = vi.fn(() => () => {});
      Object.defineProperty(f.namespace, 'jLd', { get: getter });
      await expect(start()).rejects.toHaveProperty('cause', 'capture-actions');
      expect(getter).not.toHaveBeenCalled();
      expect(f.calls).toMatchObject({ send: 0, oub: 0, inner: 0, history: 0 });
    });

    it('retains uniqueness across required completion and negative actions', async () => {
      f.namespace.mM.type = f.namespace.jLd.type;
      await expect(start()).rejects.toHaveProperty('cause', 'capture-actions');
      expect(f.calls).toMatchObject({ send: 0, oub: 0, inner: 0, history: 0 });
    });

    it.each([
      'model',
      'model-trigger',
      'model-menu',
      'model-cleanup',
      'client',
      'page',
      'interrupted',
      'cleanup',
    ] as const)(
      'preserves recognized readiness cause %s with a fixed public message',
      async (cause) => {
        f.readiness = async () => {
          throw new Error('SYNTHETIC_PRIVATE', { cause });
        };
        await expect(start()).rejects.toMatchObject({ message: 'Gemini SDK trial failed.', cause });
        expect(f.calls).toMatchObject({ send: 0, oub: 0, inner: 0, history: 0 });
      },
    );

    it.each([
      'open-trigger',
      'open-menu',
      'owner-missing',
      'owner-changed',
      'trigger-detached',
      'popover-ambiguous',
      'menu-ambiguous',
      'controls-invalid',
      'owner-duplicate',
    ] as const)(
      'projects finite Gemini menu diagnostic %s only in the SDK trial',
      async (diagnostic) => {
        f.readiness = async () => {
          throw Object.assign(new Error('SYNTHETIC_PRIVATE', { cause: 'model-menu' }), {
            geminiMenuDiagnostic: diagnostic,
          });
        };
        await expect(start()).rejects.toMatchObject({
          message: 'Gemini SDK trial failed.',
          cause: `model-menu-${diagnostic}`,
        });
        expect(f.calls).toMatchObject({ send: 0, oub: 0, inner: 0, history: 0 });
      },
    );

    it.each(['unknown', 'accessor', 'inherited', 'other-cause'] as const)(
      'keeps unsupported Gemini menu diagnostic %s generic without invoking it',
      async (kind) => {
        const getter = vi.fn(() => 'open-trigger');
        const cause = kind === 'other-cause' ? 'model-trigger' : 'model-menu';
        const error = new Error('SYNTHETIC_PRIVATE', { cause });
        if (kind === 'inherited')
          Object.setPrototypeOf(
            error,
            Object.assign(Object.create(Error.prototype), {
              geminiMenuDiagnostic: 'open-trigger',
            }),
          );
        else
          Object.defineProperty(
            error,
            'geminiMenuDiagnostic',
            kind === 'accessor'
              ? { get: getter }
              : {
                  value: kind === 'unknown' ? 'SYNTHETIC_PRIVATE' : 'open-trigger',
                },
          );
        f.readiness = async () => {
          throw error;
        };
        await expect(start()).rejects.toMatchObject({ message: 'Gemini SDK trial failed.', cause });
        expect(getter).not.toHaveBeenCalled();
        expect(f.calls).toMatchObject({ send: 0, oub: 0, inner: 0, history: 0 });
      },
    );

    it.each([
      'compact-control',
      'final-control',
      'header-context',
      'header-deadline',
      'header-association',
    ] as const)(
      'projects finite Gemini trigger diagnostic %s only in the SDK trial',
      async (diagnostic) => {
        f.readiness = async () => {
          throw Object.assign(new Error('SYNTHETIC_PRIVATE', { cause: 'model-trigger' }), {
            geminiTriggerDiagnostic: diagnostic,
          });
        };
        await expect(start()).rejects.toMatchObject({
          message: 'Gemini SDK trial failed.',
          cause: `model-trigger-${diagnostic}`,
        });
        expect(f.calls).toMatchObject({ send: 0, oub: 0, inner: 0, history: 0 });
      },
    );

    it.each(['unknown', 'accessor', 'inherited', 'other-cause', 'non-error'] as const)(
      'keeps unsupported Gemini trigger diagnostic %s generic without invoking it',
      async (kind) => {
        const getter = vi.fn(() => 'compact-control');
        const cause = kind === 'other-cause' ? 'model-menu' : 'model-trigger';
        const error = new Error('SYNTHETIC_PRIVATE', { cause });
        if (kind === 'inherited')
          Object.setPrototypeOf(
            error,
            Object.assign(Object.create(Error.prototype), {
              geminiTriggerDiagnostic: 'compact-control',
            }),
          );
        else
          Object.defineProperty(
            error,
            'geminiTriggerDiagnostic',
            kind === 'accessor'
              ? { get: getter }
              : {
                  value: kind === 'unknown' ? 'SYNTHETIC_PRIVATE' : 'compact-control',
                },
          );
        f.readiness = async () => {
          throw kind === 'non-error'
            ? { cause, geminiTriggerDiagnostic: 'compact-control' }
            : error;
        };
        await expect(start()).rejects.toMatchObject({ message: 'Gemini SDK trial failed.', cause });
        expect(getter).not.toHaveBeenCalled();
        expect(f.calls).toMatchObject({ send: 0, oub: 0, inner: 0, history: 0 });
      },
    );

    it.each(['unknown-substage', 'private', 'accessor'] as const)(
      'sanitizes a %s readiness cause without reading private error data',
      async (kind) => {
        const getter = vi.fn(() => 'model');
        const error = new Error('SYNTHETIC_PRIVATE');
        Object.defineProperty(
          error,
          'cause',
          kind === 'accessor'
            ? { get: getter }
            : { value: kind === 'unknown-substage' ? 'model-unknown-stage' : 'SYNTHETIC_PRIVATE' },
        );
        f.readiness = async () => {
          throw error;
        };
        await expect(start()).rejects.toMatchObject({
          message: 'Gemini SDK trial failed.',
          cause: 'capture-readiness',
        });
        expect(getter).not.toHaveBeenCalled();
        expect(f.calls).toMatchObject({ send: 0, oub: 0, inner: 0, history: 0 });
      },
    );
  });

  it.each(['setup', 'observation', 'completion', 'store'] as const)(
    'classifies a remaining %s boundary and closes without another attempt',
    async (stage) => {
      const initialThread = f.thread.latest;
      const initialTurns = f.turns.latest;
      if (stage === 'setup') f.namespace.st = undefined;
      if (stage === 'observation') f.conversation.oa = {};
      const pending = start();
      await ready();
      if (stage === 'completion') f.conversation.oa.complete();
      if (stage === 'store') f.conversation.oa.emit('SYNTHETIC_PRIVATE');
      await expect(pending).rejects.toMatchObject({
        message: 'Gemini SDK trial failed.',
        cause: stage === 'setup' ? 'capture-bindings' : `capture-${stage}`,
      });
      const attempts = stage === 'completion' || stage === 'store' ? 1 : 0;
      expect(f.calls).toMatchObject({
        builder: attempts,
        send: attempts,
        oub: attempts,
        inner: attempts,
        cancel: attempts,
        history: 0,
      });
      expect(f.thread.latest).toBe(initialThread);
      expect(f.turns.latest).toBe(initialTurns);
      for (const stream of Object.values(f.conversation) as any[])
        if (stream?.listeners instanceof Set) expect(stream.listeners.size).toBe(0);
    },
  );

  it('classifies a changed current draft before inner delegation', async () => {
    f.change.beforeSubscribe(() => f.change.draft('SYNTHETIC_PRIVATE'));
    const pending = start();
    await expect(pending).rejects.toMatchObject({ cause: 'capture-current' });
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 0, history: 0 });
  });
  it('classifies a nonempty initial thread before building a request', async () => {
    f.thread.emit({ conversationId: 'c_123', Hj: [], Wb: {} });
    const pending = start();
    await expect(pending).rejects.toMatchObject({ cause: 'capture-state' });
    expect(f.calls).toMatchObject({ send: 0, oub: 0, inner: 0, history: 0 });
  });
  it('classifies an unsupported action record without reading its data', async () => {
    const pending = start();
    await ready();
    f.actions.emit(Object.create({ type: 'SYNTHETIC_PRIVATE' }));
    await expect(pending).rejects.toMatchObject({ cause: 'capture-action' });
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0 });
  });
  it('does not reclassify an unrelated late failure as setup', async () => {
    const history = f.history;
    f.history = async (...args: Parameters<typeof history>) => {
      await history(...args);
      throw new Error('SYNTHETIC_PRIVATE');
    };
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await expect(pending).rejects.toMatchObject({
      message: 'Gemini SDK trial failed.',
      cause: 'capture',
    });
    expect(f.calls).toMatchObject({ builder: 1, send: 1, oub: 1, inner: 1, cancel: 1, history: 1 });
  });
});

describe('Gemini fixed SDK observable error reasons', () => {
  it.each([
    'client',
    'client-initial',
    ...initialReasons.map((reason) => `client-initial-${reason}`),
    'client-protection',
    'client-current',
    'response-raw-client',
    'response-raw-supplement',
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
    'model-menu-owner-changed',
    'model-menu-trigger-detached',
  ])('preserves only the fixed %s diagnostic without private error details', async (cause) => {
    const pending = start();
    await ready();
    f.error(new Error('SYNTHETIC_PRIVATE_MARKER', { cause }));
    await expect(pending).rejects.toMatchObject({ message: 'Gemini SDK trial failed.', cause });
    expect(f.calls).toMatchObject({ send: 1, cancel: 1, history: 0 });
  });

  it.each([
    'client-initial-SYNTHETIC_PRIVATE_MARKER',
    'client-initial-owner-unknown',
    'response-raw-field-0',
    'response-raw-field-2',
    'response-raw-field-65',
    'response-raw-field-81',
    'response-raw-field-017',
    'response-raw-field-NaN',
    'response-raw-field-SYNTHETIC_PRIVATE_MARKER',
  ])('sanitizes an unlisted raw field reason %s without retry or history', async (cause) => {
    const pending = start();
    await ready();
    f.error(new Error('SYNTHETIC_PRIVATE_MARKER', { cause }));
    await expect(pending).rejects.toMatchObject({
      message: 'Gemini SDK trial failed.',
      cause: 'response-error',
    });
    expect(f.calls).toMatchObject({ send: 1, cancel: 1, history: 0 });
  });

  it.each(['generation', 'state'] as const)(
    'preserves only a fixed dispatch cause from the %s observable error',
    async (kind) => {
      const pending = start();
      await ready();
      const error = new Error('SYNTHETIC_PRIVATE', { cause: 'dispatch' });
      if (kind === 'generation') f.error(error);
      else f.stateError(error);
      await expect(pending).rejects.toMatchObject({ cause: 'dispatch' });
      expect(f.calls.cancel).toBe(1);
      expect(f.calls.history).toBe(0);
    },
  );
  it.each(['generation', 'state'] as const)(
    'sanitizes unknown and accessor causes from the %s observable',
    async (kind) => {
      for (const accessor of [false, true]) {
        f = fixture();
        vi.stubGlobal('window', f.window);
        vi.stubGlobal('document', f.document);
        vi.stubGlobal('location', f.location);
        const getter = vi.fn(() => 'dispatch');
        const error = new Error('SYNTHETIC_PRIVATE');
        Object.defineProperty(
          error,
          'cause',
          accessor ? { get: getter } : { value: 'SYNTHETIC_PRIVATE' },
        );
        const pending = start();
        await ready();
        if (kind === 'generation') f.error(error);
        else f.stateError(error);
        await expect(pending).rejects.toMatchObject({
          cause: kind === 'generation' ? 'response-error' : 'capture-observation',
        });
        expect(getter).not.toHaveBeenCalled();
        expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, cancel: 1 });
        expect(f.calls.history).toBe(0);
      }
    },
  );

  it.each(['unknown', 'dispatch'] as const)(
    'closes a synchronous initial state error with %s cause before any request',
    async (kind) => {
      const error = new Error('SYNTHETIC_PRIVATE', {
        cause: kind === 'dispatch' ? 'dispatch' : 'SYNTHETIC_PRIVATE',
      });
      const initialThread = f.thread.latest;
      const initialTurns = f.turns.latest;
      Object.defineProperty(f.turns, 'start', {
        value: (observer: { error(value: unknown): void }) => {
          f.turns.listeners.add(observer);
          observer.error(error);
          return () => f.turns.listeners.delete(observer);
        },
      });
      await expect(start()).rejects.toMatchObject({
        message: 'Gemini SDK trial failed.',
        cause: kind === 'dispatch' ? 'dispatch' : 'capture-observation',
      });
      expect(f.calls).toMatchObject({
        send: 0,
        oub: 0,
        inner: 0,
        cancel: 0,
        builder: 0,
        history: 0,
      });
      expect(f.thread.latest).toBe(initialThread);
      expect(f.turns.latest).toBe(initialTurns);
      for (const stream of Object.values(f.conversation) as any[])
        if (stream?.listeners instanceof Set) expect(stream.listeners.size).toBe(0);
    },
  );
});

afterEach(() => {
  f.controller.abort();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('Gemini fixed SDK runner', () => {
  it('propagates the current source fixed-probe flags from the original SDK caller', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit();
    f.end();
    await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
    expect(f.packet.request.Rg).toBe(false);
    expect(f.packet.request.uh).toBe(false);
  });

  it('maps current source completion metadata into the unchanged receipt contract', async () => {
    Object.assign(f.final.response, {
      Vla: 'synthetic-choice',
      O0a: 'MODE_CATEGORY_FAST',
      Uo: 'synthetic-route',
      Lj: 'synthetic-effort',
      regionCode: 'synthetic-region',
    });
    Object.assign(f.response.fl, {
      14: 'synthetic-choice',
      24: 1,
      29: 'synthetic-route',
      30: 'synthetic-effort',
      8: 'synthetic-region',
    });
    const history = vi.spyOn(f, 'history');
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
    expect(history.mock.calls[0]?.[3]).toEqual({
      ...f.completed,
      Eka: 'synthetic-choice',
      tZa: 'MODE_CATEGORY_FAST',
      Cq: 'synthetic-route',
      Hj: 'synthetic-effort',
      regionCode: 'synthetic-region',
    });
  });

  it.each(['N5', 'W5'])('refuses unsupported outer candidate %s metadata', async (key) => {
    f.final.response.draft[key] = { UGd: [], ccc: [], Yhc: [], Q_f: 0 };
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'response-candidate-extra');
    expect(f.forwarded).toHaveLength(0);
    expect(f.calls.history).toBe(0);
  });

  describe('finite original response own keys', () => {
    it.each([
      ['response', 'nonempty'],
      ['response', 'undefined'],
      ['response', 'accessor'],
      ['candidate', 'nonempty'],
      ['candidate', 'undefined'],
      ['candidate', 'accessor'],
    ] as const)('refuses an unknown %s own field that is %s', async (kind, valueKind) => {
      const target = kind === 'response' ? f.final.response : f.final.response.draft;
      const getter = vi.fn(() => undefined);
      Object.defineProperty(
        target,
        'syntheticUnknown',
        valueKind === 'accessor'
          ? { get: getter, enumerable: true }
          : {
              value: valueKind === 'undefined' ? undefined : 'SYNTHETIC_PRIVATE',
              enumerable: true,
            },
      );
      const pending = start();
      await ready();
      f.emit();
      f.end();
      const cause =
        valueKind === 'accessor'
          ? kind === 'response'
            ? 'response-record'
            : 'response-answer'
          : kind === 'response'
            ? 'response-extra'
            : 'response-candidate-extra';
      await expect(pending).rejects.toMatchObject({ message: 'Gemini SDK trial failed.', cause });
      expect(getter).not.toHaveBeenCalled();
      expect(f.forwarded).toHaveLength(0);
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, cancel: 1, history: 0 });
    });

    it.each(['response', 'candidate'] as const)(
      'preserves source-known %s metadata without changing the original DTO',
      async (kind) => {
        if (kind === 'response')
          Object.assign(f.final.response, {
            lI: undefined,
            bV: undefined,
            Hof: undefined,
            vS: undefined,
            iV: undefined,
            Xc: { eu: undefined, R6: undefined },
            PN: undefined,
            Ozc: undefined,
            GAa: undefined,
          });
        else
          Object.assign(f.final.response.draft, {
            KEc: undefined,
            jId: undefined,
            Xc: { o6: undefined, rbc: undefined },
            safeMode: undefined,
            i1a: undefined,
            H9d: undefined,
            m9d: undefined,
            xSc: undefined,
          });
        const pending = start();
        await ready();
        f.emit();
        f.end();
        await expect(pending).resolves.toEqual({
          model: 'Synthetic Auto',
          answer: f.completed.answer,
        });
        expect(f.forwarded).toEqual([f.final]);
        expect(f.forwarded[0]).toBe(f.final);
        expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, cancel: 1, history: 1 });
      },
    );
  });

  describe('request-owned raw receiving contract', () => {
    it('leaves registered processor copies intact and proves the same raw/history final', async () => {
      f.change.processedTurn((value) => {
        const snapshot = { ...value, response: { ...value.response, No: [], JNa: 1, rjb: 1 } };
        return { ...snapshot, KAb: snapshot, request: { ...snapshot.request, Ie: [] } };
      });
      const pending = start();
      await ready();
      f.emit();
      f.end();
      await expect(pending).resolves.toEqual({
        model: 'Synthetic Auto',
        answer: 'CROSSCHECK_GEMINI_OK',
      });
      expect(f.forwarded[0]).toBe(f.final);
      expect(Object.hasOwn(f.final, 'KAb')).toBe(false);
      expect(f.actionTurn.KAb).toBeDefined();
      expect(f.actionTurn.request).not.toBe(f.final.request);
      expect(f.storedTurn.xj).toBe(true);
      expect(f.storedTurn.response.timestamp).toEqual(new Date(0));
      expect(f.calls).toMatchObject({ builder: 1, send: 1, oub: 1, inner: 1, history: 1 });
    });
    it('keeps KAb refused on the original raw Xub event', async () => {
      f.final.KAb = f.final;
      const pending = start();
      await ready();
      f.emit();
      f.end();
      await expect(pending).rejects.toHaveProperty('cause', 'response-envelope-keys');
      expect(f.calls.history).toBe(0);
    });
    it('does not require an RId UI turn when raw completion, acknowledgement and history agree', async () => {
      f.change.suppressTurnAction();
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.emit();
      f.end();
      await ready();
      expect(f.calls.history).toBe(1);
      await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1 });
    });
    it.each(['synchronous', 'delayed', 'early'] as const)(
      'requires both returned stream completion and %s acknowledgement',
      async (timing) => {
        if (timing !== 'synchronous') f.change.deferSuccess();
        const pending = start();
        void pending.catch(() => {});
        await ready();
        f.emit();
        if (timing === 'early') {
          f.success();
          await ready();
          expect(f.calls.history).toBe(0);
        }
        f.end();
        if (timing === 'delayed') {
          await ready();
          expect(f.calls.history).toBe(0);
          f.success();
        }
        await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
        expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
      },
    );
    it('does not complete or read history without aJd acknowledgement', async () => {
      f.change.suppressSuccess();
      const pending = start();
      await ready();
      f.emit();
      f.end();
      await ready();
      expect(f.calls.history).toBe(0);
      f.controller.abort();
      await expect(pending).rejects.toHaveProperty('cause', 'interrupted');
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1 });
    });
    it.each([
      ['before', 'error'],
      ['after', 'error'],
      ['before', 'stop'],
      ['after', 'stop'],
      ['before', 'lease'],
      ['after', 'lease'],
    ] as const)('keeps %s-aJd downstream %s terminal before history', async (when, kind) => {
      const fail = () => {
        if (kind === 'error') throw new Error('SYNTHETIC_PRIVATE');
        if (kind === 'stop') f.actions.emit({ type: f.namespace.mM.type });
        if (kind === 'lease') f.change.active(false);
      };
      if (when === 'before') f.change.beforeComplete(fail);
      else f.change.afterSuccess(fail);
      const pending = start();
      await ready();
      f.emit();
      f.end();
      await expect(pending).rejects.toMatchObject({
        message: 'Gemini SDK trial failed.',
        cause:
          kind === 'error'
            ? 'response-stream'
            : kind === 'stop'
              ? 'response-action'
              : 'interrupted',
      });
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0, cancel: 1 });
    });
    it.each(['home', 'route'] as const)(
      'closes monotonically on a foreign→restored store CID at %s',
      async (where) => {
        const pending = start();
        await ready();
        f.emit();
        if (where === 'route') f.location.href = 'https://gemini.google.com/app/47';
        const state = f.thread.latest as object;
        f.thread.emit({ ...state, conversationId: 'c_99' });
        f.thread.emit(state);
        f.end();
        await expect(pending).rejects.toHaveProperty('cause', 'capture-current');
        expect(f.calls.history).toBe(0);
      },
    );
    it.each(['home', 'route'] as const)(
      'allows blank pending CID at %s only with exact raw/history ownership',
      async (where) => {
        f.change.afterFinal(() => {
          if (where === 'route') f.location.href = 'https://gemini.google.com/app/47';
          f.thread.emit({ ...(f.thread.latest as object), conversationId: '' });
        });
        const pending = start();
        await ready();
        f.emit();
        f.end();
        await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
        expect(f.calls.history).toBe(1);
      },
    );
    it.each([undefined, null, 1])('refuses invalid current store CID %j', async (cid) => {
      const pending = start();
      await ready();
      f.thread.emit({ ...(f.thread.latest as object), conversationId: cid });
      f.emit();
      f.end();
      await expect(pending).rejects.toHaveProperty('cause', 'capture-current');
      expect(f.calls.history).toBe(0);
    });
    it.each(['$Kd', 'jLd'] as const)('retains approved context validation for %s', async (type) => {
      f.change.deferSuccess();
      const pending = start();
      await ready();
      f.emit();
      f.actions.emit({
        type: f.namespace[type].type,
        turn: Object.create({}),
        Wl: {
          ze: f.approved.storeId,
          request: { ...f.final.request, clientTurnId: 'SYNTHETIC_PRIVATE' },
          Azb: false,
          bJa: false,
          GRd: false,
        },
      });
      f.end();
      await expect(pending).rejects.toHaveProperty('cause', 'response-action');
      expect(f.calls.history).toBe(0);
    });
    it('refuses foreign saved identity despite a normal downstream UI copy', async () => {
      f.change.processedTurn((value) => ({ ...value, KAb: value }));
      f.identity.fl[0] = 'c_99';
      const pending = start();
      await ready();
      f.emit();
      f.end();
      await expect(pending).rejects.toHaveProperty('cause', 'history');
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
    });
  });

  describe('projected envelope diagnostic boundaries', () => {
    it.each([
      ['record', undefined],
      ['kind', undefined],
      ['keys', undefined],
      ['meta-1', 'Ita'],
      ['meta-2', 'ajb'],
      ['meta-3', 'iga'],
      ['meta-4', 'LJb'],
      ['meta-5', 'MJb'],
      ['meta-6', 'mia'],
      ['meta-7', 'zj'],
    ] as const)(
      'reports only the fixed %s envelope boundary in its existing caller',
      async (stage, field) => {
        if (stage === 'kind') f.final.xj = true;
        if (stage === 'keys') f.final.extra = undefined;
        if (field) f.final[field] = 'SYNTHETIC_PRIVATE';
        const pending = start();
        await ready();
        f.emit(stage === 'record' ? Object.create({ responseType: 'TURN' }) : f.final);
        f.end();
        await expect(pending).rejects.toMatchObject({
          message: 'Gemini SDK trial failed.',
          cause: stage === 'record' ? 'capture' : `response-envelope-${stage}`,
        });
        expect(f.calls).toMatchObject({ builder: 1, send: 1, oub: 1, inner: 1, history: 0 });
        expect(f.forwarded).toHaveLength(0);
      },
    );
  });

  describe('projected shape diagnostic boundaries', () => {
    it.each(['envelope', 'record', 'identity'] as const)(
      'reports only the fixed %s boundary before forwarding or history',
      async (stage) => {
        if (stage === 'envelope') f.final.xj = true;
        if (stage === 'record') f.final.response = Object.create({ turnId: 'r_50' });
        if (stage === 'identity') f.final.response.turnId = 'SYNTHETIC_PRIVATE';
        const pending = start();
        await ready();
        f.emit();
        f.end();
        await expect(pending).rejects.toMatchObject({
          message: 'Gemini SDK trial failed.',
          cause: stage === 'envelope' ? 'response-envelope-kind' : `response-${stage}`,
        });
        expect(f.calls).toMatchObject({ builder: 1, send: 1, oub: 1, inner: 1, history: 0 });
        expect(f.forwarded).toHaveLength(0);
      },
    );
  });

  describe('projected response diagnostic boundaries', () => {
    it.each(['shape', 'metadata', 'answer', 'content'] as const)(
      'reports a fixed %s stage from this projection call only',
      async (stage) => {
        if (stage === 'shape') f.final.extra = undefined;
        if (stage === 'metadata') f.final.response.isFinal = 'SYNTHETIC_PRIVATE';
        if (stage === 'answer') f.final.response.draft.Z2 = 'SYNTHETIC_PRIVATE';
        if (stage === 'content')
          f.final.response.draft.structuredContent.children[0].text = 'SYNTHETIC_PRIVATE';
        const pending = start();
        await ready();
        f.emit();
        f.end();
        await expect(pending).rejects.toMatchObject({
          message: 'Gemini SDK trial failed.',
          cause: stage === 'shape' ? 'response-envelope-keys' : `response-${stage}`,
        });
        expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0 });
      },
    );
  });

  describe('projected metadata diagnostic groups', () => {
    it.each([
      'lists',
      'flags',
      'extra',
      'candidate-lists',
      'candidate-extra',
      'final-metadata',
    ] as const)(
      'reports only the fixed %s group without history or another attempt',
      async (group) => {
        if (group === 'lists') f.final.response.No = ['SYNTHETIC_PRIVATE'];
        if (group === 'flags') f.final.response.JL = 'SYNTHETIC_PRIVATE';
        if (group === 'extra') f.final.response.Mx = 'SYNTHETIC_PRIVATE';
        if (group === 'candidate-lists') f.final.response.draft.Yn = ['SYNTHETIC_PRIVATE'];
        if (group === 'candidate-extra')
          f.final.response.draft.N5 = { fHd: [], Nbc: [], Khc: [], i_f: 'SYNTHETIC_PRIVATE' };
        if (group === 'final-metadata') f.final.response.Vla = { text: 'SYNTHETIC_PRIVATE' };
        const pending = start();
        await ready();
        f.emit();
        f.end();
        await expect(pending).rejects.toMatchObject({
          message: 'Gemini SDK trial failed.',
          cause: group === 'flags' ? 'response-flag-1' : `response-${group}`,
        });
        expect(f.calls).toMatchObject({ builder: 1, send: 1, oub: 1, inner: 1, history: 0 });
      },
    );
  });

  describe('projected flag diagnostic codes', () => {
    it.each([
      ['JL', 1, 'false'],
      ['W7', 2, 1],
      ['Hrg', 3, true],
      ['Fnf', 4, 0],
      ['z7b', 5, true],
      ['aZd', 6, true],
      ['Cs', 7, true],
      ['iDb', 8, null],
    ] as const)(
      'reports the fixed code for ordered flag %s without exposing its value',
      async (field, code, value) => {
        f.final.response[field] = value;
        const pending = start();
        await ready();
        f.emit();
        f.end();
        await expect(pending).rejects.toMatchObject({
          message: 'Gemini SDK trial failed.',
          cause: `response-flag-${code}`,
        });
        expect(f.calls).toMatchObject({ builder: 1, send: 1, oub: 1, inner: 1, history: 0 });
      },
    );
  });

  describe('source projected Boolean i7', () => {
    it.each(['partial', 'final'] as const)(
      'preserves a genuine true %s DTO and collects only its owned fixed final',
      async (kind) => {
        f.final.response.W7 = true;
        const partial = {
          ...f.final,
          response: {
            ...f.final.response,
            isFinal: false,
            draft: {
              ...f.final.response.draft,
              completeness: 'PARTIAL',
              Z2: 'CROSSCHECK',
              structuredContent: { children: [{ nodeType: 18, text: 'CROSSCHECK' }] },
            },
          },
        };
        const pending = start();
        await ready();
        if (kind === 'partial') {
          f.emit(partial);
          expect(f.calls.history).toBe(0);
        }
        f.emit();
        f.end();
        await expect(pending).resolves.toEqual({
          model: 'Synthetic Auto',
          answer: 'CROSSCHECK_GEMINI_OK',
        });
        expect(f.last.latest).toBe(f.final);
        expect(f.forwarded).toHaveLength(kind === 'partial' ? 2 : 1);
        if (kind === 'partial') expect(f.forwarded[0]).toBe(partial);
        expect(f.forwarded.at(-1)).toBe(f.final);
        expect(f.final.response.W7).toBe(true);
        expect(partial.response.W7).toBe(true);
        expect(f.calls).toMatchObject({ builder: 1, send: 1, oub: 1, inner: 1, history: 1 });
      },
    );

    it.each([1, 0, 'true', 'false', null])(
      'refuses non-Boolean data %j with the same fixed code',
      async (value) => {
        f.final.response.W7 = value;
        const pending = start();
        await ready();
        f.emit();
        f.end();
        await expect(pending).rejects.toMatchObject({
          message: 'Gemini SDK trial failed.',
          cause: 'response-flag-2',
        });
        expect(f.calls).toMatchObject({ builder: 1, send: 1, oub: 1, inner: 1, history: 0 });
      },
    );

    it('refuses a response flag accessor before projection without invoking it', async () => {
      const getter = vi.fn(() => true);
      Object.defineProperty(f.final.response, 'W7', { get: getter });
      const pending = start();
      await ready();
      f.emit();
      f.end();
      await expect(pending).rejects.toMatchObject({
        message: 'Gemini SDK trial failed.',
        cause: 'response-record',
      });
      expect(getter).not.toHaveBeenCalled();
      expect(f.calls).toMatchObject({ builder: 1, send: 1, oub: 1, inner: 1, history: 0 });
    });
  });

  describe('source automatic-display Boolean receipt', () => {
    it.each([true, 1] as const)(
      'binds a true final to canonical saved %j without public metadata',
      async (saved) => {
        f.final.response.iDb = true;
        f.response.fl[28] = saved;
        const partial = {
          ...f.final,
          response: { ...f.final.response, isFinal: false },
        };
        const pending = start();
        await ready();
        f.emit(partial);
        expect(f.calls.history).toBe(0);
        f.emit();
        f.end();
        await expect(pending).resolves.toEqual({
          model: 'Synthetic Auto',
          answer: 'CROSSCHECK_GEMINI_OK',
        });
        expect(f.forwarded[0]).toBe(partial);
        expect(f.forwarded[1]).toBe(f.final);
        expect(f.final.response.iDb).toBe(true);
        expect(f.calls).toMatchObject({ builder: 1, send: 1, oub: 1, inner: 1, history: 1 });
      },
    );
    it.each([undefined, false, 0] as const)(
      'refuses a true final with saved %j without retry',
      async (saved) => {
        f.final.response.iDb = true;
        f.response.fl[28] = saved;
        const pending = start();
        await ready();
        f.emit();
        f.end();
        await expect(pending).rejects.toMatchObject({
          message: 'Gemini SDK trial failed.',
          cause: 'history',
        });
        expect(f.calls).toMatchObject({ builder: 1, send: 1, oub: 1, inner: 1, history: 1 });
      },
    );
    it.each(['action', 'ka', 'Qe', 'Oe', 'missing'] as const)(
      'retains the raw receipt when downstream UI copy %s changes',
      async (copy) => {
        f.final.response.iDb = true;
        f.response.fl[28] = true;
        if (copy === 'action')
          f.change.processedTurn((value) => ({
            ...value,
            response: { ...value.response, iDb: false },
          }));
        f.change.afterFinal(() => {
          const changed = { ...f.final, response: { ...f.final.response, iDb: false } };
          if (copy === 'ka')
            f.thread.emit({
              ...(f.thread.latest as object),
              Wb: { [f.completed.turnId]: changed },
            });
          if (copy === 'Qe') f.turns.emit({ id: f.completed.conversationId, Wb: [changed] });
          if (copy === 'Oe') f.last.emit(changed);
          if (copy === 'missing') {
            delete changed.response.iDb;
            f.last.emit(changed);
          }
        });
        const pending = start();
        await ready();
        f.emit();
        f.end();
        await expect(pending).resolves.toEqual({
          model: 'Synthetic Auto',
          answer: 'CROSSCHECK_GEMINI_OK',
        });
        expect(f.final.response.iDb).toBe(true);
        expect(f.calls).toMatchObject({ builder: 1, send: 1, oub: 1, inner: 1, history: 1 });
      },
    );
    it.each([1, 0, 'true', 'false', null])(
      'refuses malformed live Boolean %j at G8',
      async (value) => {
        f.final.response.iDb = value;
        const pending = start();
        await ready();
        f.emit();
        f.end();
        await expect(pending).rejects.toMatchObject({
          message: 'Gemini SDK trial failed.',
          cause: 'response-flag-8',
        });
        expect(f.calls.history).toBe(0);
      },
    );
  });

  describe('response diagnostic boundaries', () => {
    it.each(['request', 'turn', 'owner', 'action', 'stream'] as const)(
      'reports only the fixed %s stage without a readback or another attempt',
      async (stage) => {
        if (stage === 'request') f.final.request.clientTurnId = 'synthetic-other';
        if (stage === 'turn') f.final.response.draft.Z2 = 'SYNTHETIC_PRIVATE';
        if (stage === 'owner')
          f.change.afterFinal(() =>
            f.thread.emit({ ...(f.thread.latest as object), conversationId: 'c_99' }),
          );
        const pending = start();
        await ready();
        if (stage === 'action') f.actions.emit({ type: f.namespace.mM.type });
        else if (stage === 'stream') f.error(new Error('SYNTHETIC_PRIVATE'));
        else {
          f.emit();
          f.end();
        }
        await expect(pending).rejects.toMatchObject({
          message: 'Gemini SDK trial failed.',
          cause:
            stage === 'turn'
              ? 'response-answer'
              : stage === 'owner'
                ? 'capture-current'
                : stage === 'stream'
                  ? 'response-error'
                  : `response-${stage}`,
        });
        expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0 });
      },
    );
  });

  describe('source SDK empty arrays', () => {
    it('accepts the exact frozen namespace empty field alongside ordinary empty metadata', async () => {
      f.final.response.a8a = f.namespace.Yd;
      Object.assign(f.final.response.draft, {
        Xc: { W5: { UGd: [], ccc: [], Yhc: [], Q_f: 0 } },
        pLa: { PUb: [], LRa: [] },
      });
      expect(Object.isFrozen(f.namespace.Yd)).toBe(true);
      expect(Object.getOwnPropertyDescriptor(f.namespace.Yd, f.namespace.La)?.value).toBe(7);
      const pending = start();
      await ready();
      f.emit();
      f.end();
      await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
    });

    it.each([
      'clone',
      'wrong-flag',
      'string-flag',
      'hidden-flag',
      'missing-flag',
      'flag-getter',
      'flag-setter',
      'extra-field',
      'extra-symbol',
      'mutable',
      'nonempty',
      'foreign-prototype',
    ] as const)(
      'rejects %s shared-empty corruption without history or getter execution',
      async (kind) => {
        const value: unknown[] = kind === 'nonempty' ? ['SYNTHETIC_PRIVATE'] : [];
        const getter = vi.fn(() => 7);
        if (kind === 'flag-getter')
          Object.defineProperty(value, f.namespace.La, { get: getter, enumerable: true });
        else if (kind === 'flag-setter')
          Object.defineProperty(value, f.namespace.La, { set: getter, enumerable: true });
        else if (kind !== 'missing-flag')
          Object.defineProperty(value, f.namespace.La, {
            value: kind === 'wrong-flag' ? 1 : kind === 'string-flag' ? '7' : 7,
            enumerable: kind !== 'hidden-flag',
          });
        if (kind === 'extra-field') Object.defineProperty(value, 'extra', { value: undefined });
        if (kind === 'extra-symbol')
          Object.defineProperty(value, Symbol('extra'), { value: undefined });
        if (kind === 'foreign-prototype') Object.setPrototypeOf(value, null);
        if (kind !== 'mutable') Object.freeze(value);
        if (kind !== 'clone') f.namespace.Yd = value;
        if (kind === 'clone') f.final.response.No = value;
        else f.final.response.a8a = value;
        const pending = start();
        await ready();
        f.emit();
        f.end();
        await expect(pending).rejects.toHaveProperty('cause');
        expect(f.calls.history).toBe(0);
        expect(getter).not.toHaveBeenCalled();
      },
    );

    it.each(['Yd', 'La'] as const)(
      'rejects a replaced namespace %s binding after capture',
      async (key) => {
        f.final.response.a8a = f.namespace.Yd;
        const pending = start();
        await ready();
        f.namespace[key] = key === 'La' ? Symbol('replacement') : [];
        f.emit();
        f.end();
        await expect(pending).rejects.toHaveProperty('cause');
        expect(f.calls.history).toBe(0);
      },
    );

    it('does not read an accessor standing in for the namespace empty constant', async () => {
      f.final.response.a8a = f.namespace.Yd;
      const getter = vi.fn(() => []);
      const pending = start();
      await ready();
      Object.defineProperty(f.namespace, 'Yd', { get: getter });
      f.emit();
      f.end();
      await expect(pending).rejects.toHaveProperty('cause');
      expect(f.calls.history).toBe(0);
      expect(getter).not.toHaveBeenCalled();
    });

    it('does not read an accessor replacing the namespace flag binding', async () => {
      f.final.response.a8a = f.namespace.Yd;
      const getter = vi.fn(() => Symbol('replacement'));
      const pending = start();
      await ready();
      Object.defineProperty(f.namespace, 'La', { get: getter });
      f.emit();
      f.end();
      await expect(pending).rejects.toHaveProperty('cause');
      expect(f.calls.history).toBe(0);
      expect(getter).not.toHaveBeenCalled();
    });
  });

  describe('source projected z5a', () => {
    it('accepts the immutable explicitly present empty field distinct from Eb', async () => {
      expect(f.explicitUsage).not.toBe(f.namespace.Yd);
      f.final.response.a8a = f.explicitUsage;
      const pending = start();
      await ready();
      f.emit();
      f.end();
      await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
    });

    it.each(['foreign-flag', 'wrong-flag', 'accessor', 'extra', 'mutable', 'nonempty'] as const)(
      'rejects a %s representation without reading history or accessors',
      async (kind) => {
        const value: unknown[] = kind === 'nonempty' ? ['SYNTHETIC_PRIVATE'] : [];
        const getter = vi.fn(() => 7);
        const key = kind === 'foreign-flag' ? Symbol('foreign') : f.namespace.La;
        Object.defineProperty(
          value,
          key,
          kind === 'accessor'
            ? { get: getter, enumerable: true }
            : { value: kind === 'wrong-flag' ? 21 : 7, enumerable: true },
        );
        if (kind === 'extra') Object.defineProperty(value, 'extra', { value: undefined });
        if (kind !== 'mutable') Object.freeze(value);
        f.final.response.a8a = value;
        const pending = start();
        await ready();
        f.emit();
        f.end();
        await expect(pending).rejects.toHaveProperty('cause', 'response-lists');
        expect(f.calls.history).toBe(0);
        expect(getter).not.toHaveBeenCalled();
      },
    );

    it('does not admit the distinct repeated-field representation in other fields', async () => {
      f.final.request.Ie = f.explicitUsage;
      const pending = start();
      await ready();
      f.emit();
      f.end();
      await expect(pending).rejects.toHaveProperty('cause', 'response-request');
      expect(f.calls.history).toBe(0);
    });
  });

  it('runs the normal effect once and collects only the matching completed result', async () => {
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await expect(pending).resolves.toEqual({
      model: 'Synthetic Auto',
      answer: 'CROSSCHECK_GEMINI_OK',
    });
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1, cancel: 1 });
  });
  it('closes dispatch before forwarding final, allowing the normal next-turn model update', async () => {
    f.change.afterFinal(() => {
      expect(f.dispatchClosed).toBe(true);
      f.change.model(false);
    });
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
  });
  it('admits only the exact route positively learned from the owned TURN', async () => {
    f.change.afterFinal(() => {
      f.location.href = 'https://gemini.google.com/app/47';
    });
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
  });
  it('cancels the real inner subscription on abort while the builder has already returned', async () => {
    const pending = start();
    await ready();
    f.controller.abort();
    await expect(pending).rejects.toHaveProperty('cause', 'interrupted');
    expect(f.calls.cancel).toBe(1);
    expect(f.calls.history).toBe(0);
  });
  it('rejects a forged final packet before original Xub delegation', async () => {
    f.change.beforeSend(() => {
      f.packet.request.textQuery = 'SYNTHETIC_PRIVATE';
    });
    await expect(start()).rejects.toHaveProperty('cause', 'packet');
    expect(f.calls.oub).toBe(0);
  });
  it('rejects incomplete response completion without a raw history read', async () => {
    const pending = start();
    await ready();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'response-completion');
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, cancel: 1 });
    expect(f.calls.history).toBe(0);
  });
  it('accepts source-normal empty candidate metadata without treating it as rich content', async () => {
    Object.assign(f.final.response.draft, {
      Xc: { W5: { UGd: [], ccc: [], Yhc: [], Q_f: 0 } },
      pLa: { PUb: [], LRa: [] },
    });
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
  });
  it('allows attestation to reach Xub asynchronously after the builder returns', async () => {
    f.change.deferredEffect();
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
    expect(f.calls.inner).toBe(1);
  });
  it('captures teardown when normal completion occurs before subscribe returns', async () => {
    f.change.synchronous();
    await expect(start()).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
    expect(f.calls.cancel).toBe(1);
    expect(f.calls.history).toBe(1);
  });
  it.each([
    'foreign-CID',
    'foreign-client',
    'foreign-Ae',
    'wrong-text',
    'wrong-mode',
    'rich-node',
    'stopped',
    'not-final',
    'candidate',
    'nonempty-parents',
  ] as const)('rejects %s response without returning or reading history', async (kind) => {
    if (kind === 'foreign-CID') f.final.request.conversationId = 'SYNTHETIC_PRIVATE';
    if (kind === 'foreign-client') f.final.request.clientTurnId = 'other';
    if (kind === 'foreign-Ae') f.final.request.ze = 'other';
    if (kind === 'wrong-text') f.final.response.draft.Z2 = 'other';
    if (kind === 'wrong-mode') f.final.request.wi = 'other';
    if (kind === 'rich-node')
      f.final.response.draft.structuredContent.children.push({ nodeType: 0, Xj: [{}] });
    if (kind === 'stopped') f.final.response.draft.completeness = 'STOPPED';
    if (kind === 'not-final') f.final.response.isFinal = false;
    if (kind === 'candidate') f.final.response.draft.id = '';
    if (kind === 'nonempty-parents') f.final.request.yj = 'r_old';
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause');
    expect(f.calls.history).toBe(0);
  });
  it.each([
    ['CONTINUATION_UPDATE', 'response-event-2'],
    ['DISCONNECT', 'response-disconnect-2'],
    ['RECONNECT_TURN_ALREADY_EXISTS', 'response-event-1'],
  ] as const)('rejects %s without accepting stream completion', async (responseType, cause) => {
    const pending = start();
    await ready();
    f.emit({ responseType });
    f.end();
    await expect(pending).rejects.toMatchObject({ message: 'Gemini SDK trial failed.', cause });
    expect(f.forwarded).toHaveLength(0);
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, cancel: 1 });
    expect(f.calls.history).toBe(0);
  });
  it.each(['SYNTHETIC_PRIVATE', undefined, null, 42])(
    'keeps an unknown event under the fixed fallback without forwarding (%s)',
    async (responseType) => {
      const pending = start();
      await ready();
      f.emit({ responseType });
      f.end();
      await expect(pending).rejects.toMatchObject({
        message: 'Gemini SDK trial failed.',
        cause: 'response-event',
      });
      expect(f.forwarded).toHaveLength(0);
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, cancel: 1, history: 0 });
    },
  );
  it.each(['title', 'quota', 'routing'] as const)(
    'does not mistake %s for an answer',
    async (kind) => {
      const pending = start();
      await ready();
      if (kind === 'routing') f.rawEmit(f.rawRouting);
      f.emit(
        kind === 'routing'
          ? (f.routing as any)
          : {
              responseType:
                kind === 'title'
                  ? 'TITLE_GENERATION'
                  : kind === 'quota'
                    ? 'CONSUME_GEMINI_QUOTA'
                    : 'ROUTING',
            },
      );
      f.end();
      await expect(pending).rejects.toHaveProperty('cause', 'response-completion');
      expect(f.forwarded).toHaveLength(1);
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, cancel: 1 });
      expect(f.calls.history).toBe(0);
    },
  );
  it.each(['url', 'query', 'hash', 'draft', 'owner', 'store', 'model', 'lease'] as const)(
    'rejects changed %s while generation is waiting',
    async (kind) => {
      const pending = start();
      await ready();
      if (kind === 'url') f.location.href = 'https://gemini.google.com/app/99';
      if (kind === 'query') f.location.href += '?other=1';
      if (kind === 'hash') f.location.href += '#other';
      if (kind === 'draft') f.change.draft('SYNTHETIC_PRIVATE');
      if (kind === 'owner') f.host.isConnected = false;
      if (kind === 'store') f.conversation.oa.emit('other');
      if (kind === 'model') f.change.model(false);
      if (kind === 'lease') f.change.active(false);
      f.emit();
      f.end();
      await expect(pending).rejects.toHaveProperty('cause');
      expect(f.calls.history).toBe(0);
    },
  );
  it('refuses a second Xub before any second original delegation', async () => {
    const pending = start();
    await ready();
    expect(() => f.api.Zxb(f.packet)).toThrow();
    await expect(pending).rejects.toHaveProperty('cause', 'dispatch-spent');
    expect(f.calls.oub).toBe(1);
    expect(f.calls.inner).toBe(1);
  });
  it('refuses a second subscription to the same returned wrapper', async () => {
    const pending = start();
    await ready();
    expect(() => f.wrapper().subscribe({ next() {} })).toThrow();
    await expect(pending).rejects.toHaveProperty('cause', 'dispatch-spent');
    expect(f.calls.inner).toBe(1);
  });
  it('keeps input ownership while raw history is pending', async () => {
    f.change.deferHistory();
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await ready();
    f.document.dispatchEvent(new Event('input'));
    f.change.resolveHistory();
    await expect(pending).rejects.toHaveProperty('cause', 'interrupted');
    expect(f.calls.history).toBe(1);
  });
  it('rejects saved candidate corruption even when the SDK UI completed', async () => {
    f.candidate.fl[0] = 'rc_99';
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'history');
    expect(f.calls.history).toBe(1);
  });
  it('rejects missing raw explicit completion even when normal projection defaulted COMPLETE', async () => {
    f.status[0] = undefined;
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'history');
    expect(f.calls.history).toBe(1);
  });
  it('does not run poisoned response accessors or expose provider error content', async () => {
    const getter = vi.fn(() => {
      throw new Error('SYNTHETIC_PRIVATE');
    });
    Object.defineProperty(f.final.response, 'draft', { get: getter });
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await expect(pending).rejects.toMatchObject({ message: 'Gemini SDK trial failed.' });
    expect(getter).not.toHaveBeenCalled();
  });
  it('cancels a pending raw read immediately on local page input', async () => {
    f.change.deferHistory();
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await ready();
    f.document.dispatchEvent(new Event('input'));
    const bounded = Promise.race([
      pending,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Synthetic deadline')), 20)),
    ]);
    await expect(bounded).rejects.toHaveProperty('cause', 'interrupted');
  });
  it('preserves the genuine current privacy preference in the final approval', async () => {
    f.conversation.kKa.emit(false);
    Object.assign(f.packet.request, { isPersonalContextDisabled: false });
    f.final.request.isPersonalContextDisabled = false;
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
  });

  it('allows normal processors to flush the final turn during downstream completion', async () => {
    f.change.deferProcessing();
    const pending = start();
    await ready();
    f.emit();
    f.end();
    await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
    expect(f.calls.history).toBe(1);
  });

  it('revalidates the final packet before a delayed physical dispatch', async () => {
    f.change.beforeSubscribe(() => {
      f.packet.request.textQuery = 'other';
    });
    const pending = start();
    void pending.catch(() => {});
    await ready();
    expect(f.calls.inner).toBe(0);
    await expect(pending).rejects.toHaveProperty('cause', 'packet');
  });
  it('expires its private lease while the stream is silent', async () => {
    vi.useFakeTimers();
    const pending = start();
    await ready();
    f.change.active(false);
    const rejected = expect(pending).rejects.toHaveProperty('cause', 'interrupted');
    await vi.advanceTimersByTimeAsync(100);
    await rejected;
    expect(f.calls.cancel).toBe(1);
    expect(f.calls.history).toBe(0);
  });
  it('rejects a changed receipt immediately before physical delegation', async () => {
    f.change.beforeSubscribe(() => f.change.model(false));
    await expect(start()).rejects.toHaveProperty('cause', 'model');
    expect(f.calls.inner).toBe(0);
  });
  it('does not substitute terminal success when genuine teardown throws', async () => {
    f.change.cancelError();
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit();
    try {
      f.end();
    } catch {}
    await expect(pending).rejects.toHaveProperty('cause', 'cleanup');
  });
  it('binds only a page-local boolean ownership checker, surviving result and closed leases', async () => {
    let check: (() => boolean) | undefined;
    const bind = vi.fn((value: () => boolean) => {
      check = value;
    });
    const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, bind);
    void pending.catch(() => {});
    await ready();
    expect(bind).toHaveBeenCalledTimes(1);
    expect(check?.()).toBe(true);
    f.emit();
    f.location.href = 'https://gemini.google.com/app/47';
    f.end();
    const result = await pending;
    f.change.active(false);
    f.change.model(false);
    f.controller.abort();
    expect(check?.()).toBe(true);
    expect(Object.keys(result).sort()).toEqual(['answer', 'model']);
    expect(() => f.api.Zxb(f.packet)).toThrow();
    expect(f.calls.inner).toBe(1);
    f.location.href = 'https://gemini.google.com/app/99';
    expect(check?.()).toBe(false);
  });
  it.each(['owner', 'namespace', 'consumer'] as const)(
    'retirement rejects a replaced %s after completion',
    async (key) => {
      let check: (() => boolean) | undefined;
      const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, (value) => {
        check = value;
      });
      void pending.catch(() => {});
      await ready();
      f.emit();
      f.location.href = 'https://gemini.google.com/app/47';
      f.end();
      await pending;
      expect(check?.()).toBe(true);
      Object.assign(f.client, { [key]: {} });
      expect(check?.()).toBe(false);
      expect(f.calls.inner).toBe(1);
    },
  );
  it('does not infer retirement ownership from a route before an owned TURN', async () => {
    let check: (() => boolean) | undefined;
    const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, (value) => {
      check = value;
    });
    void pending.catch(() => {});
    await ready();
    f.location.href = 'https://gemini.google.com/app/47';
    expect(check?.()).toBe(false);
    f.controller.abort();
    await expect(pending).rejects.toHaveProperty('cause', 'interrupted');
  });
  it('still cancels real generation and all observations when listener removal fails', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    const remove = vi.spyOn(f.window, 'removeEventListener').mockImplementation(() => {
      throw new Error('SYNTHETIC_PRIVATE');
    });
    f.controller.abort();
    expect(f.calls.cancel).toBe(1);
    expect(f.calls.builder).toBe(1);
    expect(f.actions.listeners.size).toBe(0);
    expect(f.turns.listeners.size).toBe(0);
    expect(remove).toHaveBeenCalledTimes(3);
    await expect(pending).rejects.toHaveProperty('cause', 'cleanup');
  });
  it.each(['model', 'scope'] as const)(
    'rejects replacement of the real Xub packet request with changed %s',
    async (kind) => {
      f.change.beforeSubscribe(() => {
        f.packet.request = {
          ...f.packet.request,
          ...(kind === 'model'
            ? { wi: 'other' }
            : { Cc: { wAa: { projectId: 'synthetic-other' } } }),
        };
      });
      const pending = start();
      void pending.catch(() => {});
      await ready();
      expect(f.calls.inner).toBe(0);
      await expect(pending).rejects.toHaveProperty('cause', 'packet');
      expect(f.calls.history).toBe(0);
    },
  );
});

describe('source terminal marker and informational continuation', () => {
  const partial = (
    candidate: any = {
      ...f.final.response.draft,
      completeness: 'PARTIAL',
      Z2: 'CROSSCHECK',
      structuredContent: { children: [{ nodeType: 18, text: 'CROSSCHECK' }] },
    },
  ) => ({ ...f.final, response: { ...f.final.response, isFinal: false, draft: candidate } });

  it.each(['synchronous', 'delayed'] as const)(
    'requires marker, original complete and %s approved aJd before one history read',
    async (timing) => {
      if (timing === 'delayed') f.change.deferSuccess();
      const history = vi.spyOn(f, 'history');
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.emit(f.marker);
      expect(f.dispatchClosed).toBe(true);
      expect(f.calls.history).toBe(0);
      f.emit(f.continuation);
      f.change.model(false);
      f.end();
      if (timing === 'delayed') {
        await ready();
        expect(f.calls.history).toBe(0);
        f.success();
      }
      await expect(pending).resolves.toEqual({
        model: 'Synthetic Auto',
        answer: 'CROSSCHECK_GEMINI_OK',
      });
      expect(history.mock.calls[0]?.[3]).toEqual({
        kind: 'marker',
        conversationId: f.completed.conversationId,
        turnId: f.completed.turnId,
      });
      expect(f.forwarded).toEqual([f.marker, f.continuation]);
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1, cancel: 1 });
    },
  );

  it('admits continuation before marker without closing generation admission or guessing a candidate', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.continuation);
    expect(f.dispatchClosed).toBe(false);
    f.emit(f.marker);
    f.end();
    await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
    expect(f.forwarded).toEqual([f.continuation, f.marker]);
  });

  it.each(['absent', 'empty', 'plain', 'complete'] as const)(
    'validates a %s partial before marker and records only an observed candidate ID',
    async (kind) => {
      const history = vi.spyOn(f, 'history');
      const candidate =
        kind === 'absent'
          ? undefined
          : kind === 'empty'
            ? {
                id: f.completed.candidateId,
                completeness: 'PARTIAL',
                structuredContent: { children: [] },
              }
            : {
                ...f.final.response.draft,
                ...(kind === 'complete'
                  ? {}
                  : {
                      completeness: 'PARTIAL',
                      Z2: 'CROSSCHECK',
                      structuredContent: { children: [{ nodeType: 18, text: 'CROSSCHECK' }] },
                    }),
              };
      const pending = start();
      void pending.catch(() => {});
      await ready();
      const value = partial(candidate);
      if (kind === 'absent') value.response.draft = undefined;
      f.emit(value);
      f.emit(f.marker);
      f.end();
      await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
      expect(history.mock.calls[0]?.[3]).toEqual({
        kind: 'marker',
        conversationId: f.completed.conversationId,
        turnId: f.completed.turnId,
        ...(kind === 'absent' ? {} : { observedCandidateId: f.completed.candidateId }),
      });
    },
  );

  it.each(['id', 'status', 'getter', 'extra', 'rich', 'prefix', 'empty-rich', 'metadata'] as const)(
    'refuses malformed %s partial before normal forwarding',
    async (kind) => {
      const value: any = partial();
      const getter = vi.fn(() => f.completed.candidateId);
      if (kind === 'id') value.response.draft.id = '';
      if (kind === 'status') value.response.draft.completeness = 'STOPPED';
      if (kind === 'getter') Object.defineProperty(value.response.draft, 'id', { get: getter });
      if (kind === 'extra') value.response.draft.syntheticUnknown = undefined;
      if (kind === 'rich') value.response.draft.Mmc = {};
      if (kind === 'prefix') value.response.draft.Z2 = 'OTHER';
      if (kind === 'empty-rich') value.response.draft.Z2 = '';
      if (kind === 'metadata') value.response.Vla = {};
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.emit(value);
      f.emit(f.marker);
      f.end();
      await expect(pending).rejects.toHaveProperty('cause');
      expect(getter).not.toHaveBeenCalled();
      expect(f.forwarded).toHaveLength(0);
      expect(f.calls.history).toBe(0);
    },
  );

  it.each(['partial', 'full', 'saved'] as const)(
    'refuses a changed %s candidate after observing its immutable ID',
    async (kind) => {
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.emit(partial());
      if (kind === 'partial') f.emit(partial({ ...f.final.response.draft, id: 'rc_other' }));
      if (kind === 'full') {
        f.final.response.draft.id = 'rc_other';
        f.emit();
      }
      if (kind === 'saved') {
        f.candidate.fl[0] = 'rc_other';
        f.response.fl[3] = 'rc_other';
      }
      f.emit(f.marker);
      f.end();
      await expect(pending).rejects.toHaveProperty('cause');
      expect(f.calls.history).toBe(kind === 'saved' ? 1 : 0);
    },
  );

  it('keeps a later valid ordinary full final as the stronger live-to-saved receipt', async () => {
    f.final.response.iDb = true;
    f.response.fl[28] = true;
    const history = vi.spyOn(f, 'history');
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.marker);
    f.change.model(false);
    f.emit();
    f.end();
    await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
    expect(history.mock.calls[0]?.[3]).toEqual({ ...f.completed, Zzb: true });
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
  });

  it.each(['answer', 'flags', 'candidate', 'CID', 'RID', 'saved'] as const)(
    'never falls back to marker proof after an invalid later full %s receipt',
    async (kind) => {
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.emit(f.marker);
      if (kind === 'answer') f.final.response.draft.Z2 = 'OTHER';
      if (kind === 'flags') f.final.response.JL = true;
      if (kind === 'candidate') f.final.response.draft.Mmc = {};
      if (kind === 'CID') f.final.request.conversationId = 'c_99';
      if (kind === 'RID') f.final.response.turnId = 'r_99';
      if (kind === 'saved') f.final.response.iDb = true;
      f.emit();
      f.end();
      await expect(pending).rejects.toHaveProperty('cause');
      expect(f.calls.history).toBe(kind === 'saved' ? 1 : 0);
    },
  );

  it.each([
    'extra',
    'missing',
    'getter',
    'CID',
    'RID',
    'undefined-CID',
    'undefined-RID',
    'duplicate',
  ] as const)('refuses a %s terminal marker', async (kind) => {
    const value: any = { ...f.marker };
    const getter = vi.fn(() => f.completed.turnId);
    if (kind === 'extra') value.syntheticUnknown = undefined;
    if (kind === 'missing') delete value.turnId;
    if (kind === 'getter') Object.defineProperty(value, 'turnId', { get: getter });
    if (kind === 'CID') value.conversationId = '';
    if (kind === 'RID') value.turnId = '';
    if (kind === 'undefined-CID') value.conversationId = undefined;
    if (kind === 'undefined-RID') value.turnId = undefined;
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(value);
    if (kind === 'duplicate') f.emit(value);
    f.end();
    await expect(pending).rejects.toHaveProperty('cause');
    expect(getter).not.toHaveBeenCalled();
    expect(f.calls.history).toBe(0);
    expect(f.forwarded).toHaveLength(kind === 'duplicate' ? 1 : 0);
  });

  it.each(['none', 'partial', 'continuation', 'promotion'] as const)(
    'cannot read history with %s evidence and EOF alone',
    async (kind) => {
      const pending = start();
      void pending.catch(() => {});
      await ready();
      if (kind === 'partial') f.emit(partial());
      if (kind === 'continuation') f.emit(f.continuation);
      if (kind === 'promotion')
        f.actions.emit({
          type: f.namespace.PKd.type,
          turnId: f.completed.turnId,
          conversationId: f.completed.conversationId,
          Wl: f.context(),
        });
      f.end();
      await expect(pending).rejects.toHaveProperty('cause', 'response-completion');
      expect(f.calls.history).toBe(0);
    },
  );

  it.each([
    'extra',
    'prototype',
    'getter',
    'CID',
    'RID',
    'undefined-CID',
    'undefined-RID',
    'function',
  ] as const)('refuses a %s continuation envelope', async (kind) => {
    const value: any = { ...f.continuation };
    const getter = vi.fn(() => f.continuation.Soa);
    if (kind === 'extra') value.syntheticUnknown = undefined;
    if (kind === 'prototype') value.Soa = {};
    if (kind === 'getter') Object.defineProperty(value, 'Soa', { get: getter });
    if (kind === 'CID') value.conversationId = 'c_99';
    if (kind === 'RID') value.turnId = 'r_99';
    if (kind === 'undefined-CID') value.conversationId = undefined;
    if (kind === 'undefined-RID') value.turnId = undefined;
    if (kind === 'function') value.Soa = Object.setPrototypeOf(() => {}, f.namespace.yL.prototype);
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.marker);
    f.emit(value);
    f.end();
    await expect(pending).rejects.toHaveProperty('cause');
    expect(getter).not.toHaveBeenCalled();
    expect(f.forwarded).toEqual([f.marker]);
    expect(f.calls.history).toBe(0);
  });

  it.each(['unsolicited', 'duplicate', 'opaque', 'CID', 'RID', 'context'] as const)(
    'requires exactly one unchanged mJd correlation (%s)',
    async (kind) => {
      const action: any = { type: f.namespace.uLd.type, ...f.continuation, Wl: f.context() };
      delete action.responseType;
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.emit(f.marker);
      if (kind !== 'unsolicited') {
        f.change.suppressContinuation();
        f.emit(f.continuation);
      }
      if (kind === 'opaque') action.Soa = new f.namespace.yL([]);
      if (kind === 'CID') action.conversationId = 'c_99';
      if (kind === 'RID') action.turnId = 'r_99';
      if (kind === 'context')
        action.Wl = { ...action.Wl, request: { ...f.packet.request, yj: 'r_other' } };
      f.actions.emit(action);
      if (kind === 'duplicate') f.actions.emit(action);
      f.end();
      await expect(pending).rejects.toHaveProperty('cause', 'response-action');
      expect(f.calls.history).toBe(0);
    },
  );

  it('refuses history while a continuation correlation is still outstanding', async () => {
    f.change.suppressContinuation();
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.marker);
    f.emit(f.continuation);
    f.end();
    await expect(pending).rejects.toHaveProperty('cause');
    expect(f.calls.history).toBe(0);
  });

  it.each(['metadata-CID', 'metadata-RID', 'foreign-store', 'foreign-route'] as const)(
    'binds early continuation identity and rechecks %s immediately',
    async (kind) => {
      const pending = start();
      void pending.catch(() => {});
      await ready();
      if (kind === 'metadata-CID')
        f.emit({ responseType: 'TITLE_GENERATION', conversationId: 'c_99' });
      if (kind === 'metadata-RID') f.emit({ responseType: 'CONSUME_GEMINI_QUOTA', turnId: 'r_99' });
      if (kind === 'foreign-store')
        f.thread.latest = { ...(f.thread.latest as object), conversationId: 'c_99' };
      if (kind === 'foreign-route') f.location.href = 'https://gemini.google.com/app/99';
      f.emit(f.continuation);
      f.emit(f.marker);
      f.end();
      await expect(pending).rejects.toHaveProperty('cause');
      expect(f.calls.history).toBe(0);
      expect(f.forwarded).not.toContain(f.continuation);
    },
  );

  it.each(['extra', 'missing', 'parents', 'privacy', 'nested', 's4d'] as const)(
    'validates blank original context and live packet %s after marker',
    async (kind) => {
      f.change.deferSuccess();
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.emit(f.marker);
      f.end();
      const request: any = { ...f.packet.request };
      if (kind === 'extra') request.syntheticUnknown = undefined;
      if (kind === 'missing') delete request.kka;
      if (kind === 'parents') request.yj = 'r_other';
      if (kind === 'privacy') request.isPersonalContextDisabled = true;
      if (kind === 'nested') (f.packet.request.Cc as any).hidden = {};
      if (kind === 's4d') (f.packet.request as any).s4d = new f.namespace.wxd(f.wire({ 1: 9 }));
      f.actions.emit({ type: f.namespace.jLd.type, Wl: { ...f.context(), request } });
      await expect(pending).rejects.toHaveProperty('cause');
      expect(f.calls.history).toBe(0);
    },
  );

  it.each([
    'mM',
    'XKd',
    'nLd',
    'oLd',
    'WKd',
    'pLd',
    'tLd',
    'rLd',
    'qLd',
    'kMd',
    'fMd',
    'dMd',
    'wLd',
    'gLd',
  ] as const)('keeps negative %s active after marker', async (type) => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.marker);
    f.actions.emit({ type: f.namespace[type].type });
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'response-action');
    expect(f.calls.history).toBe(0);
  });

  it.each(['lease', 'draft', 'owner', 'privacy', 'input', 'Zxb', 'subscription'] as const)(
    'keeps %s protection after terminal marker',
    async (kind) => {
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.emit(f.marker);
      if (kind === 'lease') f.change.active(false);
      if (kind === 'draft') f.change.draft('SYNTHETIC_PRIVATE');
      if (kind === 'owner') f.host.isConnected = false;
      if (kind === 'privacy') f.conversation.kKa.emit(true);
      if (kind === 'input') f.document.dispatchEvent(new Event('input'));
      if (kind === 'Zxb') expect(() => f.api.Zxb(f.packet)).toThrow();
      if (kind === 'subscription') expect(() => f.wrapper().subscribe({ next() {} })).toThrow();
      f.end();
      await expect(pending).rejects.toHaveProperty('cause');
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0 });
    },
  );

  it('lets reentrant continuation cancellation win before downstream completion or history', async () => {
    f.change.afterContinuation(() => f.controller.abort());
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.marker);
    f.emit(f.continuation);
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'interrupted');
    expect(f.calls.history).toBe(0);
  });

  it('cancels marker history on input without allowing a late result', async () => {
    f.change.deferHistory();
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.marker);
    f.end();
    await ready();
    expect(f.calls.history).toBe(1);
    f.document.dispatchEvent(new Event('input'));
    f.change.resolveHistory();
    await expect(pending).rejects.toHaveProperty('cause', 'interrupted');
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
  });

  it.each(['blank', 'owned'] as const)(
    'allows safe marker-only home retirement with freshly read %s store CID',
    async (kind) => {
      let check: (() => boolean) | undefined;
      const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, (value) => {
        check = value;
      });
      void pending.catch(() => {});
      await ready();
      f.emit(f.marker);
      f.end();
      await pending;
      if (kind === 'owned')
        f.thread.emit({
          ...(f.thread.latest as object),
          conversationId: f.completed.conversationId,
        });
      expect(check?.()).toBe(true);
      // Observations are gone, so these mutations must be read through the original store.
      f.conversation.oa.emit('other');
      expect(check?.()).toBe(false);
    },
  );

  it.each(['CID', 'state', 'store', 'draft', 'Doc'] as const)(
    'quarantines marker-only home retirement after an unprovable %s change',
    async (kind) => {
      let check: (() => boolean) | undefined;
      const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, (value) => {
        check = value;
      });
      void pending.catch(() => {});
      await ready();
      f.emit(f.marker);
      f.end();
      await pending;
      expect(check?.()).toBe(true);
      if (kind === 'CID') f.thread.emit({ ...(f.thread.latest as object), conversationId: 'c_99' });
      if (kind === 'state') f.conversation.store.state = () => ({});
      if (kind === 'store') f.conversation.store = new f.namespace.tC();
      if (kind === 'draft') f.change.draft('SYNTHETIC_PRIVATE');
      if (kind === 'Doc') f.editor.ownerDocument = {};
      expect(check?.()).toBe(false);
    },
  );
});

describe('fresh marker retirement source lifetime', () => {
  it.each(['closed', 'Ys', 'hasError', 'source', 'selector', 'reentrant'] as const)(
    'rejects stale or replaced %s source after observations close',
    async (kind) => {
      let check: (() => boolean) | undefined;
      const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, (value) => {
        check = value;
      });
      void pending.catch(() => {});
      await ready();
      f.emit(f.marker);
      f.end();
      await pending;
      expect(check?.()).toBe(true);
      if (kind === 'closed' || kind === 'Ys' || kind === 'hasError')
        f.conversation.store.source[kind] = true;
      if (kind === 'source') f.conversation.store.source = {};
      if (kind === 'selector') f.namespace.AC = () => f.approved.storeId;
      if (kind === 'reentrant')
        f.change.beforeStoreRead(() => {
          f.conversation.store.source.closed = true;
        });
      expect(check?.()).toBe(false);
    },
  );
});

describe('continuation and terminal context bounds', () => {
  it('refuses original blank aJd context after a partial TURN updates the source context', async () => {
    f.change.deferSuccess();
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit({ ...f.final, response: { ...f.final.response, isFinal: false } });
    f.emit(f.marker);
    f.end();
    f.actions.emit({
      type: f.namespace.jLd.type,
      Wl: { ...f.context(), request: f.packet.request },
    });
    await expect(pending).rejects.toHaveProperty('cause', 'response-action');
    expect(f.calls.history).toBe(0);
  });

  it('bounds unconsumed original continuation events and never reaches history', async () => {
    f.change.suppressContinuation();
    const pending = start();
    void pending.catch(() => {});
    await ready();
    for (let i = 0; i < 129; i++) f.emit(f.continuation);
    await expect(pending).rejects.toHaveProperty('cause', 'response-event-2');
    expect(f.forwarded).toHaveLength(128);
    expect(f.calls.history).toBe(0);
  });

  it('keeps model admission active after early continuation metadata', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.continuation);
    f.change.model(false);
    f.emit(f.marker);
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'model');
    expect(f.calls.history).toBe(0);
  });
});

describe('marker completion callback reentry', () => {
  it('lets the original downstream complete callback consume its pending mJd before history', async () => {
    f.change.suppressContinuation();
    f.change.beforeComplete(() =>
      f.actions.emit({
        type: f.namespace.uLd.type,
        turnId: f.continuation.turnId,
        conversationId: f.continuation.conversationId,
        Soa: f.continuation.Soa,
        Wl: f.context(),
      }),
    );
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.marker);
    f.emit(f.continuation);
    f.end();
    await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
  });

  it.each(['draft', 'api', 'protection', 'editor'] as const)(
    'rechecks retirement %s after reading current store callbacks',
    async (kind) => {
      let check: (() => boolean) | undefined;
      const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, (value) => {
        check = value;
      });
      void pending.catch(() => {});
      await ready();
      f.emit(f.marker);
      f.end();
      await pending;
      expect(check?.()).toBe(true);
      f.change.beforeStoreRead(() => {
        if (kind === 'draft') f.change.draft('SYNTHETIC_PRIVATE');
        if (kind === 'api') f.conversation.ha = {};
        if (kind === 'protection') f.api.Ja.isEnabled = false;
        if (kind === 'editor') f.editor.isConnected = false;
      });
      expect(check?.()).toBe(false);
    },
  );
});

describe('source closed original downstream context', () => {
  it.each(['$Kd', 'jLd', 'uLd'] as const)(
    'refuses unsupported own fields in %s context before history',
    async (type) => {
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.emit(f.marker);
      const context: any = { ...f.context(), syntheticUnknown: undefined };
      if (type === 'uLd') {
        f.change.suppressContinuation();
        f.emit(f.continuation);
      }
      f.actions.emit({
        type: f.namespace[type].type,
        Wl: context,
        ...(type === 'uLd'
          ? {
              turnId: f.continuation.turnId,
              conversationId: f.continuation.conversationId,
              Soa: f.continuation.Soa,
            }
          : {}),
      });
      f.end();
      await expect(pending).rejects.toHaveProperty('cause', 'response-action');
      expect(f.calls.history).toBe(0);
    },
  );

  it.each(['eOa', 'w2a'] as const)('refuses unapproved %s in the source context', async (field) => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.marker);
    f.actions.emit({ type: f.namespace.jLd.type, Wl: { ...f.context(), [field]: true } });
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'response-action');
    expect(f.calls.history).toBe(0);
  });
});

describe('captured opaque continuation constructor lifetime', () => {
  it.each(['constructor', 'prototype', 'namespace-getter', 'prototype-getter'] as const)(
    'refuses replaced %s after admission without reading opaque fields',
    async (kind) => {
      const ctor: any = () => {};
      Object.defineProperty(ctor, 'prototype', { value: {}, writable: true, configurable: true });
      f.namespace.yL = ctor;
      f.continuation.Soa = Object.create(ctor.prototype);
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.emit(f.marker);
      const getter = vi.fn(() => (kind === 'namespace-getter' ? ctor : f.continuation.Soa));
      if (kind === 'constructor') {
        f.namespace.yL = class {};
        f.continuation.Soa = Object.create(f.namespace.yL.prototype);
      }
      if (kind === 'prototype') {
        ctor.prototype = {};
        f.continuation.Soa = Object.create(ctor.prototype);
      }
      if (kind === 'namespace-getter') Object.defineProperty(f.namespace, 'yL', { get: getter });
      if (kind === 'prototype-getter') Object.defineProperty(ctor, 'prototype', { get: getter });
      f.emit(f.continuation);
      f.end();
      await expect(pending).rejects.toHaveProperty('cause');
      expect(getter).not.toHaveBeenCalled();
      expect(f.forwarded).toEqual([f.marker]);
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0 });
    },
  );

  it('rechecks the original constructor after current store callbacks before forwarding', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.change.beforeStoreRead(() => {
      f.namespace.yL = class {};
    });
    f.emit(f.continuation);
    f.end();
    await expect(pending).rejects.toHaveProperty('cause');
    expect(f.forwarded).toHaveLength(0);
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0 });
  });

  it('keeps the captured constructor guard during marker history', async () => {
    f.change.deferHistory();
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.marker);
    f.end();
    await ready();
    expect(f.calls.history).toBe(1);
    f.namespace.yL = class {};
    f.change.resolveHistory();
    await expect(pending).rejects.toHaveProperty('cause');
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
  });
});

describe('source terminal disconnect after marker and consumed continuation', () => {
  const action = () => ({
    type: f.namespace.wLd.type,
    turnId: f.disconnect.turnId,
    conversationId: f.disconnect.conversationId,
    BFc: f.disconnect.BFc,
    Wl: f.context(),
  });
  const emitTerminal = () => {
    f.emit(f.marker);
    f.emit(f.continuation);
    f.emit(f.disconnect);
  };

  it.each(['synchronous', 'delayed'] as const)(
    'forwards the exact terminal sequence and waits for original complete plus %s aJd',
    async (timing) => {
      if (timing === 'delayed') f.change.deferSuccess();
      const pending = start();
      void pending.catch(() => {});
      await ready();
      emitTerminal();
      expect(f.forwarded).toEqual([f.marker, f.continuation, f.disconnect]);
      expect(f.forwarded[2]).toBe(f.disconnect);
      expect(f.calls).toMatchObject({ oub: 1, inner: 1, cancel: 0, history: 0 });
      expect(f.dispatchClosed).toBe(true);
      expect(f.complete).toBe(false);
      f.end();
      if (timing === 'delayed') {
        await ready();
        expect(f.calls.history).toBe(0);
        f.success();
      }
      await expect(pending).resolves.toEqual({
        model: 'Synthetic Auto',
        answer: 'CROSSCHECK_GEMINI_OK',
      });
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1, cancel: 1 });
    },
  );

  it.each(['complete', 'jLd'] as const)(
    'does not derive the missing %s witness from disconnect or oJd',
    async (missing) => {
      if (missing === 'jLd') f.change.suppressSuccess();
      const pending = start();
      void pending.catch(() => {});
      await ready();
      emitTerminal();
      if (missing === 'jLd') f.end();
      else f.success();
      await ready();
      expect(f.calls.history).toBe(0);
      f.controller.abort();
      await expect(pending).rejects.toHaveProperty('cause', 'interrupted');
    },
  );

  it.each([
    'extra',
    'nonenumerable',
    'symbol',
    'getter',
    'null-prototype',
    'array',
    'null',
    'boolean',
    'function',
  ] as const)(
    'refuses the non-source %s disconnect payload without evaluating getters',
    async (kind) => {
      const value: any = { ...f.disconnect, BFc: {} };
      const getter = vi.fn(() => undefined);
      if (kind === 'extra') value.BFc.reason = undefined;
      if (kind === 'nonenumerable')
        Object.defineProperty(value.BFc, 'reason', { value: undefined });
      if (kind === 'symbol') value.BFc[Symbol('synthetic')] = undefined;
      if (kind === 'getter') Object.defineProperty(value.BFc, 'reason', { get: getter });
      if (kind === 'null-prototype') value.BFc = Object.create(null);
      if (kind === 'array') value.BFc = [];
      if (kind === 'null') value.BFc = null;
      if (kind === 'boolean') value.BFc = true;
      if (kind === 'function') value.BFc = () => {};
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.emit(f.marker);
      f.emit(f.continuation);
      f.emit(value);
      f.end();
      await expect(pending).rejects.toHaveProperty('cause', 'response-disconnect-6');
      expect(getter).not.toHaveBeenCalled();
      expect(f.forwarded).toEqual([f.marker, f.continuation]);
      expect(f.calls.history).toBe(0);
    },
  );

  it.each(['extra', 'missing', 'getter', 'CID', 'RID', 'undefined-CID', 'undefined-RID'] as const)(
    'rejects a malformed %s four-key disconnect envelope',
    async (kind) => {
      const value: any = { ...f.disconnect };
      const getter = vi.fn(() => f.disconnect.BFc);
      if (kind === 'extra') value.synthetic = undefined;
      if (kind === 'missing') delete value.turnId;
      if (kind === 'getter') Object.defineProperty(value, 'BFc', { get: getter });
      if (kind === 'CID') value.conversationId = 'c_99';
      if (kind === 'RID') value.turnId = 'r_99';
      if (kind === 'undefined-CID') value.conversationId = undefined;
      if (kind === 'undefined-RID') value.turnId = undefined;
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.emit(f.marker);
      f.emit(f.continuation);
      f.emit(value);
      f.end();
      await expect(pending).rejects.toHaveProperty('cause');
      expect(getter).not.toHaveBeenCalled();
      expect(f.calls.history).toBe(0);
      expect(f.forwarded).toEqual([f.marker, f.continuation]);
    },
  );

  it.each([
    'no-marker',
    'no-continuation',
    'metadata-between',
    'marker-between',
    'unconsumed-continuation',
    'duplicate',
  ] as const)('refuses unsupported %s disconnect ordering', async (kind) => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    if (kind !== 'no-marker') f.emit(f.marker);
    if (kind === 'unconsumed-continuation') f.change.suppressContinuation();
    if (kind !== 'no-continuation') f.emit(f.continuation);
    if (kind === 'metadata-between')
      f.emit({ responseType: 'TITLE_GENERATION', conversationId: f.completed.conversationId });
    if (kind === 'marker-between')
      f.emit({ ...f.final, response: { ...f.final.response, isFinal: false } });
    f.emit(f.disconnect);
    if (kind === 'duplicate') f.emit(f.disconnect);
    f.end();
    await expect(pending).rejects.toHaveProperty(
      'cause',
      kind === 'duplicate'
        ? 'response-disconnect-1'
        : kind === 'no-marker'
          ? 'response-disconnect-2'
          : 'response-disconnect-3',
    );
    expect(f.calls.history).toBe(0);
    expect(f.forwarded.filter((value: any) => value.responseType === 'DISCONNECT')).toHaveLength(
      kind === 'duplicate' ? 1 : 0,
    );
  });

  it.each([
    'unsolicited',
    'duplicate',
    'missing',
    'CID',
    'RID',
    'reference',
    'getter',
    'extra',
    'context',
    'nested-scope',
  ] as const)('requires one consumable unchanged oJd correlation (%s)', async (kind) => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    if (kind !== 'unsolicited') {
      f.change.suppressDisconnect();
      emitTerminal();
    }
    const value: any = action();
    const getter = vi.fn(() => f.disconnect.BFc);
    if (kind === 'CID') value.conversationId = 'c_99';
    if (kind === 'RID') value.turnId = 'r_99';
    if (kind === 'reference') value.BFc = {};
    if (kind === 'getter') Object.defineProperty(value, 'BFc', { get: getter });
    if (kind === 'extra') value.synthetic = undefined;
    if (kind === 'context')
      value.Wl = { ...value.Wl, request: { ...f.packet.request, yj: 'r_other' } };
    if (kind === 'nested-scope') (f.packet.request.Cc as any).synthetic = {};
    if (kind !== 'missing') f.actions.emit(value);
    if (kind === 'duplicate') f.actions.emit(value);
    f.end();
    await expect(pending).rejects.toHaveProperty('cause');
    expect(getter).not.toHaveBeenCalled();
    expect(f.calls.history).toBe(0);
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1 });
  });

  it('allows the normal complete callback to consume its pending oJd before history', async () => {
    f.change.suppressDisconnect();
    f.change.beforeComplete(() => f.actions.emit(action()));
    const pending = start();
    void pending.catch(() => {});
    await ready();
    emitTerminal();
    f.end();
    await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
    expect(f.calls.history).toBe(1);
  });

  it.each(['before-action', 'after-action', 'state-callback', 'history', 'reference'] as const)(
    'refuses a changed disconnect payload at %s',
    async (when) => {
      const change = () => {
        (f.disconnect.BFc as any).synthetic = undefined;
      };
      if (when === 'before-action') f.change.beforeDisconnect(change);
      if (when === 'after-action') f.change.afterDisconnect(change);
      if (when === 'reference')
        f.change.afterDisconnect(() => {
          f.disconnect.BFc = {};
        });
      if (when === 'history') f.change.deferHistory();
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.emit(f.marker);
      f.emit(f.continuation);
      if (when === 'state-callback') f.change.beforeStoreRead(change);
      f.emit(f.disconnect);
      f.end();
      if (when === 'history') {
        await ready();
        expect(f.calls.history).toBe(1);
        change();
        f.change.resolveHistory();
      }
      await expect(pending).rejects.toHaveProperty('cause');
      expect(f.calls.history).toBe(when === 'history' ? 1 : 0);
    },
  );

  it.each(['abort', 'draft', 'owner', 'lease', 'negative', 'error'] as const)(
    'keeps %s terminal during the disconnect callback',
    async (kind) => {
      f.change.afterDisconnect(() => {
        if (kind === 'abort') f.controller.abort();
        if (kind === 'draft') f.change.draft('SYNTHETIC_PRIVATE');
        if (kind === 'owner') f.host.isConnected = false;
        if (kind === 'lease') f.change.active(false);
        if (kind === 'negative') f.actions.emit({ type: f.namespace.mM.type });
        if (kind === 'error') throw new Error('SYNTHETIC_PRIVATE');
      });
      const pending = start();
      void pending.catch(() => {});
      await ready();
      emitTerminal();
      f.end();
      await expect(pending).rejects.toHaveProperty('cause');
      expect(f.calls.history).toBe(0);
    },
  );

  it.each(['status', 'final', 'stopped', 'literal'] as const)(
    'does not replace invalid saved %s proof with UI disconnect promotion',
    async (kind) => {
      if (kind === 'status') f.status[0] = 1;
      if (kind === 'final') f.response.fl[9] = false;
      if (kind === 'stopped') f.response.fl[10] = true;
      if (kind === 'literal') f.text.fl[0] = 'OTHER';
      const pending = start();
      void pending.catch(() => {});
      await ready();
      emitTerminal();
      f.end();
      await expect(pending).rejects.toHaveProperty('cause', 'history');
      expect(f.calls.history).toBe(1);
    },
  );

  it('preserves a later full final as the stronger receipt after a source disconnect', async () => {
    f.final.response.iDb = true;
    f.response.fl[28] = true;
    const history = vi.spyOn(f, 'history');
    const pending = start();
    void pending.catch(() => {});
    await ready();
    emitTerminal();
    f.emit();
    f.end();
    await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
    expect(history.mock.calls[0]?.[3]).toEqual({ ...f.completed, Zzb: true });
  });

  it('never downgrades an invalid later full TURN to disconnect marker proof', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    emitTerminal();
    f.final.response.draft.Z2 = 'OTHER';
    f.emit();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'response-answer');
    expect(f.calls.history).toBe(0);
  });

  it('keeps partial UI promotion separate from original completion and saved proof', async () => {
    const partial: any = {
      ...f.final,
      response: {
        ...f.final.response,
        isFinal: false,
        draft: {
          ...f.final.response.draft,
          completeness: 'PARTIAL',
          Z2: 'CROSSCHECK',
          structuredContent: { children: [{ nodeType: 18, text: 'CROSSCHECK' }] },
        },
      },
    };
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(partial);
    f.thread.emit({ ...(f.thread.latest as object), xu: f.packet.request });
    emitTerminal();
    expect(f.thread.latest).toMatchObject({
      conversationId: f.completed.conversationId,
      mG: 3,
      bG: 3,
      xu: undefined,
    });
    expect((f.thread.latest as any).Wb[f.completed.turnId].response.draft.completeness).toBe(
      'COMPLETE',
    );
    expect(partial.response.draft.completeness).toBe('PARTIAL');
    expect(f.calls.history).toBe(0);
    f.end();
    await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
  });

  it('keeps a further PId/Xub attempt spent after disconnect acknowledgement', async () => {
    f.change.afterDisconnect(() => {
      f.actions.emit({
        type: f.namespace.YKd.type,
        VD: { ze: f.approved.storeId, request: f.packet.request },
      });
      expect(() => f.api.Zxb(f.packet)).toThrow();
    });
    const pending = start();
    void pending.catch(() => {});
    await ready();
    emitTerminal();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'dispatch-spent');
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0 });
  });

  it('keeps a second subscription spent after disconnect effects', async () => {
    f.change.afterDisconnect(() => {
      expect(() => f.wrapper().subscribe({ next() {} })).toThrow();
    });
    const pending = start();
    void pending.catch(() => {});
    await ready();
    emitTerminal();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'dispatch-spent');
    expect(f.calls.inner).toBe(1);
    expect(f.calls.history).toBe(0);
  });

  it('cancels history on input after accepting disconnect without accepting a late result', async () => {
    f.change.deferHistory();
    const pending = start();
    void pending.catch(() => {});
    await ready();
    emitTerminal();
    f.end();
    await ready();
    expect(f.calls.history).toBe(1);
    f.document.dispatchEvent(new Event('input'));
    f.change.resolveHistory();
    await expect(pending).rejects.toHaveProperty('cause', 'interrupted');
    expect(f.calls.oub).toBe(1);
  });
});

describe('terminal disconnect correlation callback reentry', () => {
  const action = () => ({
    type: f.namespace.wLd.type,
    turnId: f.disconnect.turnId,
    conversationId: f.disconnect.conversationId,
    BFc: f.disconnect.BFc,
    Wl: f.context(),
  });

  it('reserves the matching oJd while branch validation invokes the lease callback', async () => {
    let armed = false,
      checks = 0,
      injected = false;
    f.current = () => {
      // The action observer checks twice before the branch starts its own validation.
      if (armed && ++checks === 3 && !injected) {
        injected = true;
        f.actions.emit(action());
      }
      return true;
    };
    f.change.beforeDisconnect(() => {
      armed = true;
    });
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.marker);
    f.emit(f.continuation);
    f.emit(f.disconnect);
    f.end();
    expect(injected).toBe(true);
    await expect(pending).rejects.toHaveProperty('cause', 'response-action');
    expect(f.calls.history).toBe(0);
    expect(f.calls.oub).toBe(1);
  });

  it('reserves the original disconnect before current store callbacks can emit a duplicate', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.marker);
    f.emit(f.continuation);
    let injected = false;
    f.change.beforeStoreRead(() => {
      if (!injected) {
        injected = true;
        f.emit({ ...f.disconnect });
      }
    });
    f.emit(f.disconnect);
    f.end();
    expect(injected).toBe(true);
    await expect(pending).rejects.toHaveProperty('cause', 'response-disconnect-1');
    expect(f.calls.history).toBe(0);
    expect(f.calls.oub).toBe(1);
    expect(
      f.forwarded.filter((event: any) => event.responseType === 'DISCONNECT').length,
    ).toBeLessThanOrEqual(1);
  });
});

describe('shared paired-action validation reservation', () => {
  it('cannot consume a second opaque continuation by reentering the first mJd validation', async () => {
    let armed = false,
      checks = 0,
      injected = false;
    const first = () => ({
      type: f.namespace.uLd.type,
      turnId: f.continuation.turnId,
      conversationId: f.continuation.conversationId,
      Soa: f.continuation.Soa,
      Wl: f.context(),
    });
    f.current = () => {
      // Target the branch callback after the observer's two initial checks.
      if (armed && ++checks === 3 && !injected) {
        injected = true;
        f.actions.emit(first());
      }
      return true;
    };
    f.change.suppressContinuation();
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.marker);
    f.emit(f.continuation);
    const second = { ...f.continuation, Soa: new f.namespace.yL([]) };
    f.emit(second);
    armed = true;
    f.actions.emit(first());
    f.emit(f.disconnect);
    f.end();
    expect(injected).toBe(true);
    await expect(pending).rejects.toHaveProperty('cause', 'response-action');
    expect(f.calls.history).toBe(0);
    expect(f.forwarded).toEqual([f.marker, f.continuation, second]);
    expect(f.calls.oub).toBe(1);
  });

  it('keeps raw disconnect pending while pre-forward callbacks emit aJd and complete', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.marker);
    f.emit(f.continuation);
    let injected = false;
    f.change.beforeStoreRead(() => {
      if (!injected) {
        injected = true;
        f.success();
        f.end();
      }
    });
    f.emit(f.disconnect);
    expect(injected).toBe(true);
    await expect(pending).rejects.toHaveProperty('cause', 'response-action');
    expect(f.calls.history).toBe(0);
    expect(f.forwarded).toEqual([f.marker, f.continuation]);
  });

  it('does not authorize matching oJd from a callback before the original disconnect is forwarded', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.marker);
    f.emit(f.continuation);
    let injected = false;
    f.change.beforeStoreRead(() => {
      if (!injected) {
        injected = true;
        f.actions.emit({
          type: f.namespace.wLd.type,
          turnId: f.disconnect.turnId,
          conversationId: f.disconnect.conversationId,
          BFc: f.disconnect.BFc,
          Wl: f.context(),
        });
      }
    });
    f.emit(f.disconnect);
    f.end();
    expect(injected).toBe(true);
    await expect(pending).rejects.toHaveProperty('cause', 'response-action');
    expect(f.calls.history).toBe(0);
    expect(f.forwarded).toEqual([f.marker, f.continuation]);
  });
});

describe('source disconnect projection ownership', () => {
  it('emits matched oJd but leaves the blank home projection unchanged', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    const initial = f.thread.latest;
    f.emit(f.marker);
    f.emit(f.continuation);
    f.emit(f.disconnect);
    expect(f.thread.latest).toBe(initial);
    expect((f.thread.latest as any).conversationId).toBe('');
    f.end();
    await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
    expect(f.calls.history).toBe(1);
  });
});

describe('continuation action identity after callbacks', () => {
  it.each(['Soa', 'Wl'] as const)(
    'refuses original mJd %s replacement during branch validation',
    async (field) => {
      let armed = false,
        checks = 0,
        changed = false;
      let value: any;
      f.current = () => {
        // Mutate after initial action matching, inside its branch validation callback.
        if (armed && ++checks === 3 && !changed) {
          changed = true;
          value[field] =
            field === 'Soa'
              ? new f.namespace.yL([])
              : { ...f.context(), request: { ...f.packet.request, yj: 'r_other' } };
        }
        return true;
      };
      f.change.suppressContinuation();
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.emit(f.marker);
      f.emit(f.continuation);
      value = {
        type: f.namespace.uLd.type,
        turnId: f.continuation.turnId,
        conversationId: f.continuation.conversationId,
        Soa: f.continuation.Soa,
        Wl: f.context(),
      };
      armed = true;
      f.actions.emit(value);
      f.emit(f.disconnect);
      f.end();
      expect(changed).toBe(true);
      await expect(pending).rejects.toHaveProperty('cause', 'response-action');
      expect(f.calls.history).toBe(0);
      expect(f.forwarded).toEqual([f.marker, f.continuation]);
      expect(f.calls.oub).toBe(1);
    },
  );
});

describe('fixed original disconnect refusal diagnostics', () => {
  it.each([1, 2, 3, 4, 5, 6] as const)(
    'reports fixed stage %s while preserving the refusal and one-send boundary',
    async (stage) => {
      const pending = start();
      void pending.catch(() => {});
      await ready();
      if (stage !== 2) f.emit(f.marker);
      if (stage !== 3) f.emit(f.continuation);
      const value: any = { ...f.disconnect, BFc: {} };
      if (stage === 1) f.emit(f.disconnect);
      if (stage === 4) value.synthetic = undefined;
      if (stage === 5) value.turnId = 'r_99';
      if (stage === 6) value.BFc.synthetic = undefined;
      f.emit(value);
      f.end();
      await expect(pending).rejects.toMatchObject({
        message: 'Gemini SDK trial failed.',
        cause: `response-disconnect-${stage}`,
      });
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0 });
      expect(f.forwarded.filter((event: any) => event.responseType === 'DISCONNECT')).toHaveLength(
        stage === 1 ? 1 : 0,
      );
    },
  );

  it('keeps the shared payload lifetime refusal under the existing H3 fallback', async () => {
    f.change.afterDisconnect(() => {
      (f.disconnect.BFc as any).synthetic = undefined;
    });
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.marker);
    f.emit(f.continuation);
    f.emit(f.disconnect);
    f.end();
    await expect(pending).rejects.toMatchObject({
      message: 'Gemini SDK trial failed.',
      cause: 'response-event-3',
    });
    expect(f.calls.history).toBe(0);
    expect(f.calls.oub).toBe(1);
  });
});

describe('owned raw final before SDK projection', () => {
  it.each<[string, (f: ReturnType<typeof fixture>) => void]>([
    ['response-shape', (f) => Object.setPrototypeOf(f.live, f.namespace.H5c.prototype)],
    ['response-raw-fields', (f) => (f.live.fl[80] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-1', (f) => (f.live.fl[0] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-3', (f) => (f.live.fl[2] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-4', (f) => (f.live.fl[3] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-14', (f) => (f.live.fl[13] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-17', (f) => (f.live.fl[16] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-metadata', (f) => (f.live.fl[17] = 18)],
    ['response-raw-field-19', (f) => (f.live.fl[18] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-22', (f) => (f.live.fl[21] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-29', (f) => (f.live.fl[28] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-31', (f) => (f.live.fl[30] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-38', (f) => (f.live.fl[37] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-39', (f) => (f.live.fl[38] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-42', (f) => (f.live.fl[41] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-flags', (f) => (f.live.fl[43] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-45', (f) => (f.live.fl[44] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-51', (f) => (f.live.fl[50] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-54', (f) => (f.live.fl[53] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-title', (f) => (f.live.fl[10] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-routing', (f) => (f.live.fl[20] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-attribution', (f) => (f.live.fl[22] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-history', (f) => (f.live.fl[25] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-quota', (f) => (f.live.fl[27] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-heartbeat', (f) => (f.live.fl[36] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-string', (f) => (f.live.fl[19] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-enum', (f) => (f.live.fl[47] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-client', (f) => (f.live.fl[64] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-6', (f) => (f.live.fl[5] = 'SYNTHETIC_PRIVATE_MARKER')],
    [
      'response-raw-field-6',
      (f) =>
        (f.live.fl[5] = [
          null,
          null,
          false,
          null,
          'https://synthetic.invalid/SYNTHETIC_PRIVATE_MARKER',
        ]),
    ],
    ['response-raw-field-6', (f) => (f.live.fl[5] = [{ 4: true }])],
    ['response-raw-field-7', (f) => (f.live.fl[6] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-8', (f) => (f.live.fl[7] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-10', (f) => (f.live.fl[9] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-25', (f) => (f.live.fl[24] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-30', (f) => (f.live.fl[29] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-33', (f) => (f.live.fl[32] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-35', (f) => (f.live.fl[34] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-36', (f) => (f.live.fl[35] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-41', (f) => (f.live.fl[40] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-47', (f) => (f.live.fl[46] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-49', (f) => (f.live.fl[48] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-53', (f) => (f.live.fl[52] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-field-57', (f) => (f.live.fl[56] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-raw-continuation', (f) => (f.live.fl[45] = true)],
    ['response-raw-disconnect', (f) => (f.live.fl[51] = true)],
    ['response-flags', (f) => (f.live.fl[15] = true)],
    ['response-lists', (f) => (f.live.fl[12] = ['SYNTHETIC_PRIVATE_MARKER'])],
    ['response-metadata', (f) => (f.live.fl[39] = true)],
    ['response-identity', (f) => (f.identity.fl[0] = 'invalid identity')],
    ['response-candidate-lists', (f) => f.live.fl[4].push(f.candidate)],
    ['response-answer', (f) => (f.candidate.fl[0] = '')],
    ['response-candidate-extra', (f) => (f.candidate.fl[12] = f.message('bw', { 1: 1 }))],
    ['response-final-metadata', (f) => (f.status[0] = 3)],
    ['response-content', (f) => (f.text.fl[0] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-completion', (f) => delete f.candidate.fl[8]],
  ])(
    'preserves raw phase %s through the runner without retry or history',
    async (cause, mutate) => {
      const pending = start();
      void pending.catch(() => {});
      await ready();
      mutate(f);
      f.rawEmit();
      f.end();
      await expect(pending).rejects.toMatchObject({ message: 'Gemini SDK trial failed.', cause });
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0 });
      expect(f.forwarded).toHaveLength(0);
      expect(f.rawDetached()).toBe(true);
      f.rawEmit();
      await ready();
      expect(f.calls.send).toBe(1);
    },
  );

  it.each([false, true, 0, 1])(
    'collects canonical Boolean44 %s partial/final only after original completion and strict history',
    async (value) => {
      const savedHistory = JSON.stringify(f.raw);
      const pending = start();
      await ready();
      f.live.fl[43] = value;
      f.live.fl[14] = false;
      f.status[0] = 1;
      f.text.fl[0] = 'CROSSCHECK';
      f.rawEmit();
      expect(f.calls.history).toBe(0);
      f.live.fl[14] = true;
      f.status[0] = 2;
      f.text.fl[0] = f.completed.answer;
      f.rawEmit();
      expect(f.calls.history).toBe(0);
      f.emit(f.continuation);
      f.emit(f.disconnect);
      f.end();
      await expect(pending).resolves.toEqual({
        model: 'Synthetic Auto',
        answer: 'CROSSCHECK_GEMINI_OK',
      });
      expect(f.live.fl[43]).toBe(value);
      expect(JSON.stringify(f.raw)).toBe(savedHistory);
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
      expect(f.forwarded).toEqual([f.continuation, f.disconnect]);
      expect(f.rawDetached()).toBe(true);
    },
  );

  it.each([undefined, '', 'SYNTHETIC_PRIVATE_SUPPLEMENT'])(
    'collects raw partial/final string18 %s only after normal completion and the same strict history',
    async (supplement) => {
      const savedHistory = JSON.stringify(f.raw);
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.live.fl[11] = [];
      f.live.fl[17] = supplement;
      f.live.fl[14] = false;
      f.status[0] = 1;
      f.text.fl[0] = 'CROSSCHECK';
      f.rawEmit();
      expect(f.calls.history).toBe(0);
      f.live.fl[14] = true;
      f.status[0] = 2;
      f.text.fl[0] = f.completed.answer;
      f.rawEmit();
      expect(f.calls.history).toBe(0);
      expect(f.rawDetached()).toBe(false);
      f.emit(f.continuation);
      f.emit(f.disconnect);
      f.end();
      const result = await pending;
      expect(result).toEqual({ model: 'Synthetic Auto', answer: 'CROSSCHECK_GEMINI_OK' });
      expect(JSON.stringify(result)).not.toContain('SYNTHETIC_PRIVATE_SUPPLEMENT');
      expect(JSON.stringify(f.raw)).toBe(savedHistory);
      expect(f.forwarded).toEqual([f.continuation, f.disconnect]);
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
      expect(f.rawDetached()).toBe(true);
    },
  );

  it.each(['marker', 'full'] as const)(
    'coexists with the genuine later %s without duplicate finality',
    async (kind) => {
      const pending = start();
      await ready();
      f.rawEmit();
      f.emit(kind === 'marker' ? f.marker : f.final);
      f.end();
      await expect(pending).resolves.toHaveProperty('answer', 'CROSSCHECK_GEMINI_OK');
      expect(f.calls.history).toBe(1);
      expect(f.rawDetached()).toBe(true);
    },
  );

  it('does not let raw final hide an invalid later full TURN', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.rawEmit();
    f.final.response.draft.Z2 = 'Wrong answer';
    f.emit();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'response-answer');
    expect(f.calls.history).toBe(0);
    expect(f.rawDetached()).toBe(true);
  });

  it('requires the original complete callback rather than raw final or disconnect', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.rawEmit();
    f.emit(f.continuation);
    f.emit(f.disconnect);
    await ready();
    expect(f.calls.history).toBe(0);
    f.controller.abort();
    await expect(pending).rejects.toHaveProperty('cause', 'interrupted');
  });

  it('requires source success acknowledgement after original completion', async () => {
    f.change.suppressSuccess();
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.rawEmit();
    f.end();
    await ready();
    expect(f.calls.history).toBe(0);
    f.controller.abort();
    await expect(pending).rejects.toHaveProperty('cause', 'interrupted');
  });

  it('keeps partial-only continuation/disconnect terminal', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.live.fl[14] = false;
    f.rawEmit();
    f.emit(f.continuation);
    f.emit(f.disconnect);
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'response-disconnect-2');
    expect(f.calls.history).toBe(0);
  });

  it('closes and detaches on the fixed raw observer failure without accepting history', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.rawEmit();
    f.rawError();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'dispatch-observation');
    expect(f.calls.history).toBe(0);
    expect(f.rawDetached()).toBe(true);
  });
});

describe('raw receiving ownership through history', () => {
  it('refuses a raw identity conflicting with the genuine marker', async () => {
    f.live.fl[11] = [];
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.emit(f.marker);
    f.identity.fl[0] = 'c_99';
    f.rawEmit();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'response-identity');
    expect(f.calls.history).toBe(0);
  });

  it('cannot replace an already observed candidate with the raw candidate', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    const partial = { ...f.final, response: { ...f.final.response, isFinal: false } };
    f.emit(partial);
    f.candidate.fl[0] = 'rc_50';
    f.rawEmit();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'response-selected');
    expect(f.calls.history).toBe(0);
  });

  it('requires agreement with later full final metadata even when saved proof would match raw', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.live.fl[57] = true;
    f.response.fl[28] = true;
    f.rawEmit();
    f.final.response.iDb = false;
    f.emit();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'response-final-metadata');
    expect(f.calls.history).toBe(0);
  });

  it('refuses repeated raw final without another owned delegation', async () => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.rawEmit();
    f.rawEmit();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'response-turn');
    expect(f.calls).toMatchObject({ send: 1, inner: 1, history: 0 });
  });

  it('keeps raw validation alive during the same-CID history wait', async () => {
    f.change.deferHistory();
    const pending = start();
    void pending.catch(() => {});
    await ready();
    f.rawEmit();
    f.end();
    await ready();
    expect(f.calls.history).toBe(1);
    f.live.fl[80] = 'SYNTHETIC_PRIVATE_MARKER';
    f.rawEmit();
    await expect(pending).rejects.toMatchObject({
      message: 'Gemini SDK trial failed.',
      cause: 'response-raw-fields',
    });
    expect(f.rawDetached()).toBe(true);
  });

  it('reserves raw validation before the lease callback can reenter the same data', async () => {
    let armed = false,
      injected = false;
    f.current = () => {
      if (armed && !injected) {
        injected = true;
        f.rawEmit();
      }
      return true;
    };
    const pending = start();
    void pending.catch(() => {});
    await ready();
    armed = true;
    f.rawEmit();
    f.end();
    expect(injected).toBe(true);
    await expect(pending).rejects.toHaveProperty('cause', 'response-action');
    expect(f.calls.history).toBe(0);
  });
});

it('revalidates the approved model before latching the first raw final', async () => {
  const pending = start();
  void pending.catch(() => {});
  await ready();
  f.change.model(false);
  f.rawEmit();
  f.emit(f.continuation);
  f.emit(f.disconnect);
  f.end();
  await expect(pending).rejects.toHaveProperty('cause', 'model');
  expect(f.calls.history).toBe(0);
});

describe('same-generation routing correlation', () => {
  it.each([undefined, '', 'SYNTHETIC_SURVEY'])(
    'forwards original routing and SId before the same partial/final stream, string18 %s',
    async (supplement) => {
      const pending = start();
      await ready();
      if (supplement !== undefined) f.rawRouting.fl[17] = supplement;
      const event = { ...f.routing, ...(supplement ? { bFd: supplement } : {}) };
      f.rawEmit(f.rawRouting);
      f.emit(event as any);
      const partial = {
        ...f.final,
        response: {
          ...f.final.response,
          isFinal: false,
          draft: { ...f.final.response.draft, completeness: 'PARTIAL' },
        },
      };
      f.emit(partial);
      f.rawEmit();
      f.emit();
      f.emit(f.continuation as any);
      f.emit(f.disconnect as any);
      f.end();
      await expect(pending).resolves.toEqual({
        model: 'Synthetic Auto',
        answer: f.completed.answer,
      });
      expect(f.forwarded[0]).toBe(event);
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
    },
  );
  it('does not accept an unsolicited source routing action', async () => {
    const pending = start();
    await ready();
    f.actions.emit({ type: f.namespace.aLd.type, Xbd: f.routing, Wl: f.context() });
    f.rawEmit();
    f.emit();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'response-action');
    expect(f.calls.history).toBe(0);
  });
});

describe('closed original routing/action ownership', () => {
  it.each([
    'missing-raw',
    'wrong-epa',
    'wrong-cid',
    'wrong-rid',
    'extra',
    'missing',
    'added-empty-Kzd',
    'wrong-Kzd',
    'omitted-Kzd',
    'duplicate',
  ] as const)('rejects %s original routing before answer/history', async (kind) => {
    const pending = start();
    await ready();
    const event: any = { ...f.routing };
    if (kind !== 'missing-raw') {
      if (kind === 'wrong-Kzd' || kind === 'omitted-Kzd') f.rawRouting.fl[17] = 'SYNTHETIC_SURVEY';
      f.rawEmit(f.rawRouting);
    }
    if (kind === 'wrong-epa') event.eqa = 'SYNTHETIC_OTHER';
    if (kind === 'wrong-cid') event.conversationId = 'c_99';
    if (kind === 'wrong-rid') event.turnId = 'r_99';
    if (kind === 'extra') event.extra = undefined;
    if (kind === 'missing') delete event.eqa;
    if (kind === 'added-empty-Kzd') event.bFd = '';
    if (kind === 'wrong-Kzd') event.bFd = 'SYNTHETIC_OTHER';
    f.emit(event);
    if (kind === 'duplicate') f.emit(event);
    f.rawEmit();
    f.emit();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'response-event');
    expect(f.calls.history).toBe(0);
  });
  it.each([
    'copied-event',
    'extra',
    'missing',
    'wrong-store',
    'wrong-client',
    'wrong-model',
    'wrong-prompt',
    'scope',
    'cancelled',
    'duplicate',
    'missing-action',
    'mutated-event',
  ] as const)('rejects %s source routing action', async (kind) => {
    const pending = start();
    await ready();
    f.change.suppressRouting();
    f.rawEmit(f.rawRouting);
    f.emit(f.routing as any);
    const action: any = { type: f.namespace.aLd.type, Xbd: f.routing, Wl: f.context() };
    action.Wl.request = { ...action.Wl.request };
    if (kind === 'copied-event') action.Xbd = { ...f.routing };
    if (kind === 'extra') action.extra = undefined;
    if (kind === 'missing') delete action.Wl;
    if (kind === 'wrong-store') action.Wl.ze = 'SYNTHETIC_OTHER';
    if (kind === 'wrong-client') action.Wl.request.clientTurnId = 'SYNTHETIC_OTHER';
    if (kind === 'wrong-model') action.Wl.request.wi = 'SYNTHETIC_OTHER';
    if (kind === 'wrong-prompt') action.Wl.request.textQuery = 'SYNTHETIC_OTHER';
    if (kind === 'scope') action.Wl.request.uh = true;
    if (kind === 'cancelled') action.Wl.Azb = true;
    if (kind === 'mutated-event') f.routing.eqa = 'SYNTHETIC_OTHER';
    if (kind !== 'missing-action') f.actions.emit(action);
    if (kind === 'duplicate') f.actions.emit(action);
    f.rawEmit();
    f.emit();
    f.end();
    await expect(pending).rejects.toHaveProperty(
      'cause',
      kind === 'mutated-event' ? 'response-event' : 'response-action',
    );
    expect(f.calls.history).toBe(0);
  });
  it.each([
    'event',
    'action',
    'context',
    'request',
    'lease',
    'cancel',
    'reentry',
    'second-generation',
  ] as const)('detects %s mutation during original routing forwarding', async (kind) => {
    let callback = () => {};
    const current = f.current;
    f.current = () => {
      callback();
      return current();
    };
    const pending = start();
    await ready();
    f.change.afterRouting((event) => {
      if (kind === 'event') event.eqa = 'SYNTHETIC_OTHER';
      if (kind === 'lease') f.change.active(false);
      if (kind === 'cancel') f.controller.abort();
      if (kind === 'reentry') {
        f.emit(f.routing as any);
        event.eqa = 'SYNTHETIC_ROUTING';
      }
      if (kind === 'second-generation') {
        try {
          f.api.Zxb(f.packet);
        } catch {}
      }
    });
    if (['action', 'context', 'request'].includes(kind)) {
      f.change.suppressRouting();
      f.change.beforeRouting((event) => {
        const action: any = { type: f.namespace.aLd.type, Xbd: event, Wl: f.context() };
        let changed = false;
        callback = () => {
          if (changed) return;
          changed = true;
          if (kind === 'action') action.Xbd = { ...event };
          if (kind === 'context') action.Wl.ze = 'SYNTHETIC_OTHER';
          if (kind === 'request') action.Wl.request.uh = true;
        };
        f.actions.emit(action);
      });
    }
    f.rawEmit(f.rawRouting);
    f.emit(f.routing as any);
    f.rawEmit();
    f.emit();
    f.end();
    await expect(pending).rejects.toThrow('Gemini SDK trial failed.');
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0 });
  });
  it('consumes delayed actions in raw/event FIFO order under the unchanged blank-CID context', async () => {
    const pending = start();
    await ready();
    f.change.suppressRouting();
    const second = { ...f.routing, eqa: 'SYNTHETIC_SECOND' };
    const rawSecond = f.message('HF', { 2: f.identity, 21: ['SYNTHETIC_SECOND'] });
    f.rawEmit(f.rawRouting);
    f.rawEmit(rawSecond);
    f.emit(f.routing as any);
    f.emit(second as any);
    for (const event of [f.routing, second])
      f.actions.emit({ type: f.namespace.aLd.type, Xbd: event, Wl: f.context() });
    f.rawEmit();
    f.emit();
    f.end();
    await expect(pending).resolves.toHaveProperty('answer', f.completed.answer);
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
  });
  it.each(['raw-only', 'routing-only', 'reordered', 'overflow'] as const)(
    'cannot complete %s routing proof',
    async (kind) => {
      const pending = start();
      await ready();
      if (kind === 'overflow') for (let i = 0; i <= 128; i++) f.rawEmit(f.rawRouting);
      else f.rawEmit(f.rawRouting);
      if (kind === 'routing-only') f.emit(f.routing as any);
      if (kind === 'reordered') {
        f.change.suppressRouting();
        const second = { ...f.routing, eqa: 'SYNTHETIC_SECOND' };
        f.rawEmit(f.message('HF', { 2: f.identity, 21: ['SYNTHETIC_SECOND'] }));
        f.emit(f.routing as any);
        f.emit(second as any);
        f.actions.emit({ type: f.namespace.aLd.type, Xbd: second, Wl: f.context() });
      }
      if (kind !== 'routing-only') {
        f.rawEmit();
        f.emit();
      }
      f.end();
      await expect(pending).rejects.toThrow();
      expect(f.calls.history).toBe(0);
    },
  );
  it('requires SId creator identity even when no routing frame arrives', async () => {
    delete f.namespace.aLd;
    await expect(start()).rejects.toHaveProperty('cause', 'capture-actions');
    expect(f.calls.send).toBe(0);
  });
});

it.each(['action', 'context', 'request'] as const)(
  'rejects %s changed after SId returns but before original next returns',
  async (kind) => {
    const pending = start();
    await ready();
    f.change.suppressRouting();
    f.change.beforeRouting((event) => {
      const action: any = { type: f.namespace.aLd.type, Xbd: event, Wl: f.context() };
      f.actions.emit(action);
      if (kind === 'action') action.Xbd = { ...event };
      if (kind === 'context') action.Wl.Azb = true;
      if (kind === 'request') action.Wl.request = { ...action.Wl.request };
    });
    f.rawEmit(f.rawRouting);
    f.emit(f.routing as any);
    f.rawEmit();
    f.emit();
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'response-action');
    expect(f.calls.history).toBe(0);
  },
);

it('pairs routing after TURN with the admitted updated request context', async () => {
  const pending = start();
  await ready();
  const partial = { ...f.final, response: { ...f.final.response, isFinal: false } };
  f.emit(partial);
  f.rawEmit(f.rawRouting);
  f.emit(f.routing as any);
  f.rawEmit();
  f.emit();
  f.end();
  await expect(pending).resolves.toHaveProperty('answer', f.completed.answer);
});
it('allows delayed routing action during original completion before its successful return', async () => {
  const pending = start();
  await ready();
  f.change.suppressRouting();
  f.rawEmit(f.rawRouting);
  f.emit(f.routing as any);
  f.rawEmit();
  f.emit();
  f.change.beforeComplete(() =>
    f.actions.emit({ type: f.namespace.aLd.type, Xbd: f.routing, Wl: f.context() }),
  );
  f.end();
  await expect(pending).resolves.toHaveProperty('answer', f.completed.answer);
});
it.each(['wrong', 'partial', 'stopped', 'paginated', 'complete-throw', 'late-error'] as const)(
  'keeps routing powerless over %s completion/history',
  async (kind) => {
    const pending = start();
    await ready();
    f.rawEmit(f.rawRouting);
    f.emit(f.routing as any);
    f.rawEmit();
    f.emit();
    if (kind === 'wrong') f.turn.fl[0] = f.message('CI', { 1: 'c_99', 2: f.completed.turnId });
    if (kind === 'partial') f.status[0] = 1;
    if (kind === 'stopped') f.response.fl[10] = true;
    if (kind === 'paginated') f.raw.fl[1] = 'SYNTHETIC_PAGE';
    if (kind === 'complete-throw')
      f.change.beforeComplete(() => {
        throw new Error('SYNTHETIC_PRIVATE');
      });
    if (kind === 'late-error') f.change.afterSuccess(() => f.error());
    f.end();
    await expect(pending).rejects.toThrow('Gemini SDK trial failed.');
    expect(f.calls.send).toBe(1);
  },
);

it('does not let raw final reentry inside original routing forwarding establish completion', async () => {
  const pending = start();
  await ready();
  f.live.fl[64] = [[]];
  f.change.afterRouting(() => f.rawEmit());
  f.rawEmit(f.rawRouting);
  f.emit(f.routing as any);
  f.end();
  await expect(pending).rejects.toHaveProperty('cause', 'response-action');
  expect(f.calls.history).toBe(0);
});

it.each(['action', 'context', 'request'] as const)(
  'rejects delayed %s changed after SId returns but before original complete returns',
  async (kind) => {
    const pending = start();
    await ready();
    f.change.suppressRouting();
    f.live.fl[64] = [[]];
    f.rawEmit(f.rawRouting);
    f.emit(f.routing as any);
    f.rawEmit();
    f.emit();
    f.change.beforeComplete(() => {
      const action: any = { type: f.namespace.aLd.type, Xbd: f.routing, Wl: f.context() };
      f.actions.emit(action);
      if (kind === 'action') action.Xbd = { ...f.routing };
      if (kind === 'context') action.Wl.Azb = true;
      if (kind === 'request') action.Wl.request = { ...action.Wl.request };
    });
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'response-action');
    expect(f.calls.history).toBe(0);
  },
);

it.each(
  (['routing-next', 'final-next', 'complete'] as const).flatMap((phase) =>
    (['event', 'action', 'context', 'request'] as const).map((kind) => [phase, kind] as const),
  ),
)('rejects evidence restored by current after original %s returns, %s', async (phase, kind) => {
  let restore = () => {};
  const current = f.current;
  f.current = () => {
    restore();
    return current();
  };
  const pending = start();
  await ready();
  f.change.suppressRouting();
  const action: any = { type: f.namespace.aLd.type, Xbd: f.routing, Wl: f.context() };
  const request = action.Wl.request;
  const mutate = () => {
    if (kind === 'event') f.routing.eqa = 'SYNTHETIC_OTHER';
    if (kind === 'action') action.Xbd = { ...f.routing };
    if (kind === 'context') action.Wl.Azb = true;
    if (kind === 'request') action.Wl.request = { ...request };
    restore = () => {
      f.routing.eqa = 'SYNTHETIC_ROUTING';
      action.Xbd = f.routing;
      action.Wl.Azb = false;
      action.Wl.request = request;
    };
  };
  f.change.beforeRouting(() => f.actions.emit(action));
  if (phase === 'routing-next') f.change.afterRouting(mutate);
  if (phase === 'final-next') f.change.afterFinal(mutate);
  if (phase === 'complete') f.change.afterSuccess(mutate);
  f.rawEmit(f.rawRouting);
  f.emit(f.routing as any);
  f.rawEmit();
  f.emit();
  f.end();
  await expect(pending).rejects.toHaveProperty(
    'cause',
    kind === 'event' ? 'response-event' : 'response-action',
  );
  expect(f.calls.history).toBe(0);
});

it.each(
  (['Ie', 'rZb'] as const).flatMap((key) =>
    [false, true].map((restore) => [key, restore] as const),
  ),
)(
  'rejects retained post-TURN %s mutated in place after success, current restoration=%s',
  async (key, restoration) => {
    let restore = () => {};
    const current = f.current;
    f.current = () => {
      restore();
      return current();
    };
    const pending = start();
    await ready();
    f.emit({ ...f.final, response: { ...f.final.response, isFinal: false } });
    const request = f.context().request;
    f.rawEmit(f.rawRouting);
    f.emit(f.routing as any);
    f.rawEmit();
    f.emit();
    f.change.afterSuccess(() => {
      request[key].push('SYNTHETIC_OTHER');
      if (restoration) restore = () => request[key].pop();
    });
    f.end();
    await expect(pending).rejects.toHaveProperty('cause', 'response-request');
    expect(f.calls.send).toBe(1);
    expect(f.calls.history).toBe(0);
  },
);

it('bounds retained consumed routing evidence to 128 controls', async () => {
  const pending = start();
  await ready();
  for (let index = 0; index <= 128; index++) {
    f.rawEmit(f.rawRouting);
    f.emit({ ...f.routing } as any);
  }
  f.rawEmit();
  f.emit();
  f.end();
  await expect(pending).rejects.toHaveProperty('cause', 'response-action');
  expect(f.calls.history).toBe(0);
});

describe('empty raw client65 through the normal runner', () => {
  it.each([[], [null], [[]], [{ 1: [] }]].map((metadata) => ({ metadata })))(
    'collects partial/final $metadata only after original completion and strict history',
    async ({ metadata }) => {
      const savedHistory = JSON.stringify(f.raw);
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.live.fl[64] = metadata;
      f.live.fl[14] = false;
      f.status[0] = 1;
      f.text.fl[0] = 'CROSSCHECK';
      f.rawEmit();
      expect(f.calls.history).toBe(0);
      f.live.fl[14] = true;
      f.status[0] = 2;
      f.text.fl[0] = f.completed.answer;
      f.rawEmit();
      expect(f.calls.history).toBe(0);
      f.emit(f.continuation);
      f.emit(f.disconnect);
      expect(f.calls.history).toBe(0);
      f.end();
      await expect(pending).resolves.toEqual({
        model: 'Synthetic Auto',
        answer: f.completed.answer,
      });
      expect(f.live.fl[64]).toBe(metadata);
      expect(JSON.stringify(f.raw)).toBe(savedHistory);
      expect(f.forwarded).toEqual([f.continuation, f.disconnect]);
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
      expect(f.rawDetached()).toBe(true);
    },
  );

  it.each(['metadata-only', 'completion', 'success', 'history', 'late-invalid'] as const)(
    'empty client65 does not bypass %s',
    async (kind) => {
      const pending = start();
      void pending.catch(() => {});
      await ready();
      f.live.fl[64] = [[]];
      if (kind === 'success') f.change.suppressSuccess();
      if (kind === 'metadata-only') f.rawEmit(f.message('HF', { 65: [[]] }));
      else f.rawEmit();
      if (kind === 'late-invalid') {
        f.live.fl[64] = [[[]]];
        f.rawEmit();
      }
      if (kind === 'history') f.response.fl[9] = false;
      if (kind !== 'metadata-only' && kind !== 'success' && kind !== 'late-invalid') {
        f.emit(f.continuation);
        f.emit(f.disconnect);
      }
      if (kind !== 'completion') f.end();
      await ready();
      if (kind === 'completion' || kind === 'success') {
        expect(f.calls.history).toBe(0);
        f.controller.abort();
      }
      await expect(pending).rejects.toHaveProperty(
        'cause',
        kind === 'history'
          ? 'history'
          : kind === 'late-invalid'
            ? 'response-raw-client'
            : kind === 'metadata-only'
              ? 'response-completion'
              : 'interrupted',
      );
      expect(f.calls.send).toBe(1);
      expect(f.calls.history).toBe(kind === 'history' ? 1 : 0);
      expect(f.rawDetached()).toBe(true);
    },
  );
});

it.each(
  [false, true].flatMap((sparse) =>
    [
      { location: [], projected: { N1a: '', I4c: '', TOc: false, m$f: '' } },
      {
        location: ['SYNTHETIC_PRIVATE_LOCATION', 'unknown-description', 1, null, ''],
        projected: {
          N1a: 'SYNTHETIC_PRIVATE_LOCATION',
          I4c: 'unknown-description',
          TOc: true,
          m$f: '',
        },
      },
      { location: [{ 3: true }], projected: { N1a: '', I4c: '', TOc: true, m$f: '' } },
    ].map(({ location, projected }) => [sparse, location, projected] as const),
  ),
)(
  'preserves canonical location6 and live20/43 raw input and normal projection with %s sparse ingress',
  async (sparse, location, projected) => {
    const savedHistory = JSON.stringify(f.raw);
    const raw = (final: boolean) => {
      const fields = {
        2: [f.completed.conversationId, f.completed.turnId],
        5: [
          [
            f.completed.candidateId,
            [final ? f.completed.answer : 'CROSSCHECK'],
            null,
            null,
            null,
            null,
            null,
            null,
            [final ? 2 : 1],
          ],
        ],
        6: location,
        15: final,
        20: 'ko',
        43: 'SYNTHETIC_PRIVATE_ATTRIBUTION',
      };
      const value = Object.create(f.namespace.HF.prototype);
      value.fl = JSON.parse(JSON.stringify(sparse ? [fields] : f.wire(fields)));
      Object.defineProperty(value.fl, f.namespace.La, { value: 2146 | (sparse ? 1 << 14 : 0) });
      return value;
    };
    const pending = start();
    void pending.catch(() => {});
    await ready();
    const partial = raw(false);
    const partialBefore = JSON.stringify(partial);
    const first = f.sourceRawEmit(partial)!;
    expect(first).toBeDefined();
    expect(f.calls.history).toBe(0);
    expect(first.response.lI).toEqual(projected);
    expect(first.response.bV).toBe('ko');
    expect(first.response.draft.Xc.bV).toBe('ko');
    expect(first.response.PN).toBe('SYNTHETIC_PRIVATE_ATTRIBUTION');
    expect((f.last.latest as any).response.PN).toBe(first.response.PN);
    expect((f.last.latest as any).response.draft.Xc).toBe(first.response.draft.Xc);
    expect(f.forwarded[0]).toBe(first);
    expect((f.last.latest as any).response.lI).toBe(first.response.lI);
    expect(JSON.stringify(partial)).toBe(partialBefore);
    const finalRaw = raw(true);
    const finalBefore = JSON.stringify(finalRaw);
    const final = f.sourceRawEmit(finalRaw)!;
    expect(f.calls.history).toBe(0);
    expect(f.rawForwarded).toEqual([partial, finalRaw]);
    expect(f.rawForwarded[0]).toBe(partial);
    expect(f.rawForwarded[1]).toBe(finalRaw);
    expect(f.forwarded[1]).toBe(final);
    expect(final.response.bV).toBe('ko');
    expect(final.response.draft.Xc.bV).toBe('ko');
    expect(final.response.PN).toBe('SYNTHETIC_PRIVATE_ATTRIBUTION');
    expect((f.last.latest as any).response.lI).toBe(final.response.lI);
    expect(JSON.stringify(finalRaw)).toBe(finalBefore);
    f.emit(f.continuation);
    f.emit(f.disconnect);
    f.end();
    const result = await pending;
    expect(result).toEqual({ model: 'Synthetic Auto', answer: 'CROSSCHECK_GEMINI_OK' });
    expect(JSON.stringify(result)).not.toContain('SYNTHETIC_PRIVATE');
    expect(JSON.stringify(f.raw)).toBe(savedHistory);
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
    expect(f.rawDetached()).toBe(true);
  },
);

it.each([
  'metadata-only',
  'partial',
  'incomplete',
  'completion',
  'success',
  'missing-history',
  'wrong-history',
  'scope',
  'current',
  'cancel',
  'late-invalid',
] as const)('admitted location6 does not bypass %s', async (kind) => {
  const pending = start();
  void pending.catch(() => {});
  await ready();
  f.live.fl[5] = ['SYNTHETIC_PRIVATE_LOCATION', '', true, null, ''];
  f.live.fl[19] = 'ko';
  f.live.fl[42] = 'SYNTHETIC_PRIVATE_ATTRIBUTION';
  if (kind === 'success') f.change.suppressSuccess();
  if (kind === 'partial') {
    f.live.fl[14] = false;
    f.status[0] = 1;
    f.text.fl[0] = 'CROSSCHECK';
  }
  if (kind === 'incomplete') f.text.fl[0] = 'CROSSCHECK';
  if (kind === 'metadata-only') f.rawEmit(f.message('HF', { 6: f.live.fl[5] }));
  else f.rawEmit();
  if (kind === 'late-invalid') {
    f.live.fl[5] = [null, null, false, null, 'image'];
    f.rawEmit();
  }
  if (kind === 'missing-history') f.raw.fl[0] = [];
  if (kind === 'wrong-history') f.identity.fl[0] = 'c_other';
  if (kind === 'scope') f.packet.request.textQuery = 'SYNTHETIC_OTHER_SCOPE';
  if (kind === 'current') f.change.active(false);
  if (kind === 'cancel') f.controller.abort();
  if (!['metadata-only', 'partial', 'incomplete', 'success', 'late-invalid'].includes(kind)) {
    f.emit(f.continuation);
    f.emit(f.disconnect);
  }
  if (kind !== 'completion') f.end();
  await ready();
  if (kind === 'completion' || kind === 'success') {
    expect(f.calls.history).toBe(0);
    f.controller.abort();
  }
  await expect(pending).rejects.toHaveProperty(
    'cause',
    kind.endsWith('history')
      ? 'history'
      : kind === 'late-invalid'
        ? 'response-raw-field-6'
        : ['metadata-only', 'partial', 'incomplete'].includes(kind)
          ? 'response-completion'
          : kind === 'scope'
            ? 'packet'
            : 'interrupted',
  );
  expect(f.calls.send).toBe(1);
  expect(f.calls.history).toBe(kind.endsWith('history') ? 1 : 0);
  expect(f.rawDetached()).toBe(true);
});

it.each([
  ['bV', null],
  ['bV', true],
  ['bV', 20],
  ['bV', {}],
  ['bV', []],
  ['bV', new String('ko')],
  ['bV', 'KO'],
  ['bV', 'ko-KR'],
  ['bV', 'zz'],
  ['PN', null],
  ['PN', true],
  ['PN', 43],
  ['PN', {}],
  ['PN', []],
  ['PN', new String('Auto')],
  ['PN', 'name,label'],
  ['PN', '\n'],
  ['PN', '\x7f'],
  ['PN', '한'],
  ['PN', 'x'.repeat(161)],
] as const)('refuses invalid projected %s under the metadata reason', async (key, value) => {
  const pending = start();
  void pending.catch(() => {});
  await ready();
  Object.assign(f.final.response, { [key]: value });
  f.rawEmit();
  f.emit();
  f.end();
  await expect(pending).rejects.toHaveProperty('cause', 'response-metadata');
  expect(f.calls).toMatchObject({ send: 1, inner: 1, history: 0 });
});

it.each([
  [undefined, undefined],
  ['', ''],
  ['iw', 'Legacy'],
  ['en', 'Auto'],
  ['lv', ' ~'.padEnd(160, ' ')],
] as const)(
  'retains permitted projected language/attribution scalars without rewriting',
  async (language, attribution) => {
    const pending = start();
    void pending.catch(() => {});
    await ready();
    const raw = f.message('HF', {
      2: [f.completed.conversationId, f.completed.turnId],
      5: [f.wire({ 1: f.completed.candidateId, 2: [f.completed.answer], 9: [2] })],
      15: true,
      20: language,
      43: attribution,
    });
    const event = f.sourceRawEmit(raw)!;
    expect(event.response.bV).toBe(language ?? '');
    expect(event.response.draft.Xc.bV).toBe(language ?? '');
    expect(event.response.PN).toBe(attribution ?? '');
    f.end();
    expect(await pending).toEqual({ model: 'Synthetic Auto', answer: 'CROSSCHECK_GEMINI_OK' });
    expect((f.last.latest as any).response.bV).toBe(language ?? '');
    expect((f.last.latest as any).response.PN).toBe(attribution ?? '');
    expect(f.calls).toMatchObject({ send: 1, inner: 1, history: 1 });
  },
);

describe('real cold WebChannel runner integration', () => {
  function install(codec: 'json' | 'protobuf' = 'json') {
    f = fixture(codec);
    vi.stubGlobal('window', f.window);
    vi.stubGlobal('document', f.document);
    vi.stubGlobal('location', f.location);
    return f.native!;
  }
  async function realReader() {
    const actual = await vi.importActual<
      typeof import('../../../src/infrastructure/providers/gemini/client-capability')
    >('../../../src/infrastructure/providers/gemini/client-capability');
    const button = {};
    for (const element of [f.host, f.owner, button] as any[])
      Object.assign(element, {
        isConnected: true,
        ownerDocument: f.document,
        getClientRects: () => [{ width: 20, height: 20 }],
        closest: (selector: string) =>
          selector.startsWith('[hidden]') ? null : selector === 'gem-button' ? f.host : f.owner,
        querySelectorAll: () => [button],
      });
    Object.assign(f.document, { querySelectorAll: () => [f.host] });
    vi.stubGlobal(
      'HTMLElement',
      class {
        static [Symbol.hasInstance](value: unknown) {
          return [f.host, f.owner, button].includes(value);
        }
      },
    );
    vi.stubGlobal('getComputedStyle', () => ({ display: 'block', visibility: 'visible' }));
    vi.mocked(readGeminiClientCapability).mockImplementation(actual.readGeminiClientCapability);
    return actual.readGeminiClientCapability;
  }
  it('keeps the real public reader unsupported while recognizing only the exact private native gate', async () => {
    const n = install();
    const read = await realReader();
    expect(read()).toEqual({ status: 'unsupported', reason: 'transport-webchannel' });
    const settled = start().catch((error) => error);
    await ready();
    expect(await Promise.race([settled, Promise.resolve('pending')])).toBe('pending');
    expect(read()).toEqual({ status: 'unsupported', reason: 'hook' });
    n.flushOpen();
    n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })));
    n.receive(n.nativeClose(5));
    expect(await settled).toEqual(result);
    vi.mocked(readGeminiClientCapability).mockReset();
  });
  for (const codec of ['json', 'protobuf'] as const)
    it.each([true, false])(
      `uses the real owning reader with registered-idle enabled=%s through ${codec}`,
      async (enabled) => {
        const n = install(codec),
          manager = n.registerIdle(enabled);
        const read = await realReader();
        const session = f.api.ub,
          registry = f.api.Eb,
          consumer = f.conversation;
        expect(read()).toEqual({ status: 'unsupported', reason: 'transport-webchannel' });
        expect(Object.hasOwn(manager, 'wa')).toBe(false);
        expect(Object.hasOwn(manager, 'Ja')).toBe(false);
        const pending = start();
        await ready();
        expect(read()).toEqual({ status: 'unsupported', reason: 'hook' });
        for (const key of ['wa', 'Ja']) {
          expect(Object.hasOwn(manager, key)).toBe(enabled);
          if (enabled)
            expect(Object.getOwnPropertyDescriptor(manager, key)).toEqual({
              value: undefined,
              writable: true,
              enumerable: true,
              configurable: true,
            });
        }
        expect(registry.ha).toBe(manager);
        expect(manager.Na).toBe(session);
        expect(manager.Oa).toBe(consumer);
        n.flushOpen();
        n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })));
        n.receive(n.nativeClose(5));
        expect(await pending).toEqual(result);
        expect(f.api.ub).toBe(session);
        expect(f.api.Eb).toBe(registry);
        expect(registry.ha).toBe(manager);
        expect(manager.Na).toBe(session);
        expect(manager.Oa).toBe(consumer);
        expect(n.calls.query).toBe(1);
        expect(f.calls.history).toBe(1);
      },
    );
  it.each(['activation', 'replacement'] as const)(
    'refuses registered-idle %s after installing the actual gate',
    async (change) => {
      const n = install(),
        manager = n.registerIdle(true);
      const read = await realReader();
      const pending = start().catch((error) => error);
      await ready();
      expect(read()).toEqual({ status: 'unsupported', reason: 'hook' });
      if (change === 'activation') manager.ha = {};
      else f.api.Eb.ha = Object.assign(Object.create(Object.getPrototypeOf(manager)), manager);
      expect(() => n.flushOpen()).toThrow();
      f.controller.abort();
      expect(await pending).toBeInstanceOf(Error);
      expect(n.calls.query).toBe(1);
      expect(n.calls.nativeSends).toBe(0);
      expect(f.calls.history).toBe(0);
    },
  );
  it.each(['json', 'protobuf'] as const)(
    'projects an observed native seed before first server RID and saved completion through %s',
    async (codec) => {
      const n = install(codec);
      await realReader();
      const pending = start().catch((error) => error);
      await ready();
      n.flushOpen();
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47' })));
      expect(f.forwarded).toHaveLength(1);
      const first = f.forwarded[0] as any;
      expect(first.response.turnId).toBe(f.approved.clientTurnId);
      expect(first.request.clientTurnId).toBe(f.approved.clientTurnId);
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48' })));
      expect(first.response.turnId).toBe(f.approved.clientTurnId);
      expect((f.forwarded[1] as any).response.turnId).toBe('r_48');
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })));
      n.receive(n.nativeClose(5));
      expect(await pending).toEqual(result);
      expect(f.packet.request.clientTurnId).toBe(f.approved.clientTurnId);
      expect(n.calls.query).toBe(1);
      expect(f.calls.history).toBe(1);
    },
  );
  function nativeRouting(n: NonNullable<typeof f.native>) {
    const raw = n.nativeKf({ cid: 'c_47' });
    raw.fl[4] = [];
    raw.fl[20] = ['SYNTHETIC_ROUTING'];
    return raw;
  }
  for (const codec of ['json', 'protobuf'] as const)
    it.each(['routing', 'continuation'] as const)(
      `refuses first explicit RID with prior %s correlation pending through ${codec}`,
      async (kind) => {
        const n = install(codec);
        await realReader();
        if (kind === 'routing') f.change.suppressRouting();
        else f.change.suppressContinuation();
        const pending = start().catch((error) => error);
        await ready();
        n.flushOpen();
        const raw = kind === 'routing' ? nativeRouting(n) : n.nativeKf({ cid: 'c_47' });
        if (kind === 'continuation') raw.fl[45] = new f.namespace.yL([]);
        n.receive(n.nativeEnvelope(raw));
        const original = f.forwarded.at(-1) as any;
        expect(original.turnId).toBe(f.approved.clientTurnId);
        expect(() =>
          n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48' }))),
        ).toThrow();
        expect(await pending).toHaveProperty('cause', 'response-identity');
        expect(original.turnId).toBe(f.approved.clientTurnId);
        expect(f.packet.request.clientTurnId).toBe(f.approved.clientTurnId);
        expect(n.calls.query).toBe(1);
        expect(f.calls.history).toBe(0);
      },
    );
  it.each(['json', 'protobuf'] as const)(
    'retains matched seed routing/action evidence after explicit RID through %s',
    async (codec) => {
      const n = install(codec);
      await realReader();
      const pending = start().catch((error) => error);
      await ready();
      n.flushOpen();
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47' })));
      const first = f.forwarded[0] as any;
      let originalAction: any;
      f.change.afterRouting(() => {
        originalAction = f.actions.latest;
      });
      n.receive(n.nativeEnvelope(nativeRouting(n)));
      const original = f.forwarded[1] as any;
      expect(originalAction.Xbd).toBe(original);
      const oldRequest = originalAction.Wl.request;
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48' })));
      expect(first.response.turnId).toBe(f.approved.clientTurnId);
      expect(original.turnId).toBe(f.approved.clientTurnId);
      expect(originalAction.Wl.request).toBe(oldRequest);
      expect(oldRequest.clientTurnId).toBe(f.approved.clientTurnId);
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })));
      n.receive(n.nativeClose(5));
      expect(await pending).toEqual(result);
      expect(original.turnId).toBe(f.approved.clientTurnId);
      expect(f.packet.request.clientTurnId).toBe(f.approved.clientTurnId);
      expect(n.calls.query).toBe(1);
      expect(f.calls.history).toBe(1);
    },
  );
  for (const codec of ['json', 'protobuf'] as const)
    it.each(['foreign', 'stale', 'late', 'late-first'] as const)(
      `refuses a %s projected event at its native receiving boundary through ${codec}`,
      async (kind) => {
        const n = install(codec);
        await realReader();
        let old: any, destination: any;
        n.project((value, request, next) => {
          destination = next;
          const event = f.projectRaw(value, request);
          if (!old) old = event;
          if (kind === 'foreign') event.response.turnId = 'foreign-server';
          if (kind !== 'late-first') next.next(kind === 'stale' ? old : event);
        });
        const pending = start().catch((error) => error);
        await ready();
        n.flushOpen();
        if (kind === 'foreign')
          expect(() => n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47' })))).toThrow();
        else {
          n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47' })));
          if (kind === 'stale')
            expect(() =>
              n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48' }))),
            ).toThrow();
          else {
            const before = f.forwarded.length;
            destination.next(old);
            expect(f.forwarded).toHaveLength(before);
          }
        }
        expect(await pending).toHaveProperty(
          'cause',
          kind.startsWith('late') ? 'response-event' : 'response-identity',
        );
        expect(n.receiveTrace.map((entry) => entry.stage)).toEqual(
          Array.from({ length: kind === 'stale' ? 2 : 1 }, () => [
            'RJd:before',
            'RJd:after',
            'DJd',
          ]).flat(),
        );
        expect(f.packet.request.clientTurnId).toBe(f.approved.clientTurnId);
        expect(n.calls.query).toBe(1);
        expect(f.calls.history).toBe(0);
      },
    );
  for (const codec of ['json', 'protobuf'] as const)
    it.each(['completion', 'RID'] as const)(
      `refuses %s with terminal disconnect correlation pending through ${codec}`,
      async (change) => {
        const n = install(codec);
        await realReader();
        f.change.suppressDisconnect();
        const pending = start().catch((error) => error);
        await ready();
        n.flushOpen();
        const raw = n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
        raw.fl[45] = new f.namespace.yL([]);
        raw.fl[51] = [];
        n.receive(n.nativeEnvelope(raw));
        const disconnect = f.forwarded.at(-1) as any;
        expect(disconnect.responseType).toBe('DISCONNECT');
        expect(disconnect.turnId).toBe('r_48');
        try {
          if (change === 'completion') n.receive(n.nativeClose(5));
          else
            n.receive(
              n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'late-server', final: true })),
            );
        } catch {}
        expect(await pending).toHaveProperty(
          'cause',
          change === 'RID' ? 'response-event' : 'dispatch-observation',
        );
        expect(disconnect.turnId).toBe('r_48');
        expect(f.packet.request.clientTurnId).toBe(f.approved.clientTurnId);
        expect(n.calls.query).toBe(1);
        expect(f.calls.history).toBe(0);
      },
    );
  const result = { model: 'Synthetic Auto', answer: 'CROSSCHECK_GEMINI_OK' };
  it.each(['json', 'protobuf'] as const)(
    'assembles a parseable %s native page preserving bundled replacement tokens and caller input',
    async (codec) => {
      const source = await geminiNativeTrialSource();
      const html = await geminiNativeTrialPage(codec);
      const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]!);
      expect(() => scripts.forEach((script) => new Script(script))).not.toThrow();
      expect(scripts).toHaveLength(5);
      expect(scripts[3]).toBe(source.replaceAll('</script', '<\\/script'));
      expect(scripts[3]).toContain('_.Yh=function(a,b,c){a=a.fl;return Ooa(Noa(a),a,void 0,b,c)}');
      expect(scripts[3]).toContain('_.Zh=function(a,b,c,d){return _.Yh(a,b,d)===c?c:-1}');
      expect(scripts[3]).toContain('var Noa,Ooa,Nba,Oba;');
      expect(scripts[3]).toContain('$&');
      expect(scripts[3]).toContain('$`');
      expect(scripts[4]).toContain(
        `geminiSdkFixedTextTrialFixture(${JSON.stringify(codec)},{document,window,location})`,
      );
      expect(html.match(/const provider=/g)).toHaveLength(1);
      expect(html.match(/const modeButton=/g)).toHaveLength(1);
    },
  );
  it('executes the serialized fixture with its actual dependencies and caller-supplied seed envelope', async () => {
    const html = await geminiNativeTrialPage('json');
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]!);
    const source = scripts.at(-2)!;
    const receiver = Function(source + ';return GeminiTrialFixture;')();
    f = receiver.geminiSdkFixedTextTrialFixture('json');
    vi.stubGlobal('window', f.window);
    vi.stubGlobal('document', f.document);
    vi.stubGlobal('location', f.location);
    (f.raw.fl[0] as any)[0][0][1] = f.approved.clientTurnId;
    const pending = start();
    await ready();
    const n = f.native!;
    n.flushOpen();
    const original = n.nativeKf({ cid: 'c_47', final: true });
    const envelope: any = n.nativeEnvelope(original);
    n.receive(envelope);
    expect(n.decoded()).toBe(envelope);
    expect(envelope.fl[n.namespace.dga].get(n.namespace.hM)).toBe(2);
    expect(n.receiveTrace[0]!.value).not.toBe(original);
    n.receive(n.nativeClose(5));
    expect(await pending).toEqual(result);
    expect(f.calls.history).toBe(1);
  });
  it.each([
    'gate',
    'factory',
    'factory-descriptor',
    'protection',
    'route',
    'session',
    'registry',
  ] as const)(
    'refuses a real-reader %s change after installing the owned native gate',
    async (change) => {
      const n = install();
      await realReader();
      const pending = start().catch((error) => error);
      await ready();
      if (change === 'gate') Object.defineProperty(f.api, 'Zxb', { enumerable: true });
      if (change === 'factory') n.namespace.dKd = () => {};
      if (change === 'factory-descriptor')
        Object.defineProperty(n.namespace, 'dKd', { writable: false });
      if (change === 'protection') f.api.Ja.isEnabled = false;
      if (change === 'route') f.api.Aa = false;
      if (change === 'session')
        f.api.ub = Object.assign(Object.create(Object.getPrototypeOf(f.api.ub)), f.api.ub);
      if (change === 'registry') f.api.Eb = Object.create(Object.getPrototypeOf(f.api.Eb));
      expect(() => n.flushOpen()).toThrow();
      f.controller.abort();
      expect(await pending).toBeInstanceOf(Error);
      expect(n.calls.nativeSends).toBe(0);
      expect(f.calls.history).toBe(0);
    },
  );

  it('Native63 native current construction preserves original completion before strict history', async () => {
    const n = install();
    Object.assign(f.packet.request, f.sourceConstruction.privacy(f.packet.request, true));
    f.change.deferSuccess();
    const pending = start();
    await ready();
    n.flushOpen();
    n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })));
    n.receive(n.nativeClose(5));
    await ready();
    expect(f.calls.history).toBe(0);
    f.success();
    expect(await pending).toEqual(result);
    expect(f.calls.history).toBe(1);
    expect(f.savedHistory!.wrapper().requestMessage.fl[0]).toBe('c_47');
  });
  it.each(['privacy', 'g8a', 'h8a'] as const)(
    'Native63 native retained %s refuses before physical send',
    async (kind) => {
      const n = install();
      if (kind === 'privacy')
        Object.assign(f.packet.request, f.sourceConstruction.privacy(f.packet.request, true));
      const pending = start().catch((error) => error);
      await ready();
      if (kind === 'privacy') f.packet.request.s4d.fl[0] = 2;
      else f.packet[kind] = kind === 'g8a' ? 'changed-valid-protection' : '1'.repeat(32);
      expect(() => n.flushOpen()).toThrow();
      expect(await pending).toHaveProperty(
        'cause',
        kind === 'privacy' ? 'dispatch-native-n10' : 'packet',
      );
      expect(n.calls).toMatchObject({ query: 1, nativeSends: 0 });
      expect(f.calls.history).toBe(0);
    },
  );
  it.each(['json', 'protobuf'] as const)(
    'collects a native terminal and original control completion through %s',
    async (codec) => {
      const n = install(codec);
      const settled = start().catch((error) => error);
      await ready();
      expect(f.calls.send).toBe(1);
      expect(await Promise.race([settled, Promise.resolve('pending')])).toBe('pending');
      n.flushOpen();
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })));
      expect(f.calls.history).toBe(0);
      n.receive(n.nativeClose(5));
      expect(f.calls.history).toBe(0);
      expect(await settled).toEqual(result);
      expect(n.calls.query).toBe(1);
      expect(f.calls.history).toBe(1);
      expect(f.savedHistory!.wrapper().requestMessage.fl[0]).toBe('c_47');
      expect(n.receiveTrace.map((entry) => entry.stage)).toEqual([
        'RJd:before',
        'RJd:after',
        'DJd',
      ]);
      expect(n.deferredErrors).toEqual([]);
    },
  );
  it.each(['json', 'protobuf'] as const)(
    'defers runner teardown until original completion unwinds through %s',
    async (codec) => {
      const n = install(codec);
      const pending = start().catch((error) => error);
      await ready();
      n.flushOpen();
      const closedInside: boolean[] = [];
      f.wrapperSubscription().add(() => {
        closedInside.push(n.responseSubscription().closed);
      });
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })));
      n.receive(n.nativeClose(5));
      expect(closedInside).toEqual([false]);
      expect(await pending).toEqual(result);
      expect(n.deferredErrors).toEqual([]);
      expect(f.calls.history).toBe(1);
    },
  );
  it.each([false, true])(
    'Native65 latches frozen inbound cache mutation restored=%s',
    async (restore) => {
      const n = install();
      let retirement = () => true;
      const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, (check) => {
        retirement = check;
      }).catch((error) => error);
      await ready();
      n.flushOpen();
      const envelope: any = n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true }));
      let changed = false,
        restored = false;
      n.onReceive((stage) => {
        const cache = envelope.fl[n.namespace.dga];
        if (stage === 'RJd:before') {
          Object.freeze(cache);
          cache.set(n.namespace.hM, 4);
          changed = true;
        }
        if (stage === 'RJd:after' && restore) {
          cache.set(n.namespace.hM, 2);
          restored = true;
        }
      });
      expect(() => n.receive(envelope)).toThrow();
      expect(await pending).toHaveProperty('cause', 'dispatch-observation');
      expect({ changed, restored }).toEqual({ changed: true, restored: restore });
      expect(retirement()).toBe(false);
      expect(f.calls.history).toBe(0);
      expect(n.calls.query).toBe(1);
    },
  );
  it('refuses reentrant retirement throughout deferred cleanup execution', async () => {
    const n = install();
    let retirement = () => true;
    const attempts: boolean[] = [];
    const receipt = await f.receipt();
    vi.spyOn(f, 'receipt').mockResolvedValue({
      ...receipt,
      close() {
        attempts.push(retirement());
      },
    });
    const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, (check) => {
      retirement = check;
    }).catch((error) => error);
    await ready();
    n.flushOpen();
    n.onReceive((stage) => {
      if (stage === 'RJd:before') f.controller.abort();
    });
    expect(() =>
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true }))),
    ).toThrow();
    expect(await pending).toHaveProperty('cause', 'interrupted');
    expect(attempts.length).toBeGreaterThan(0);
    expect(attempts.every((value) => value === false)).toBe(true);
    expect(retirement()).toBe(false);
  });
  it.each(['json', 'protobuf'] as const)(
    'defers nested downstream error teardown and retains the first failure through %s',
    async (codec) => {
      const n = install(codec);
      let retirement = () => true;
      const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, (check) => {
        retirement = check;
      }).catch((error) => error);
      await ready();
      n.flushOpen();
      let listeners = 0;
      n.onReceive((stage) => {
        if (stage === 'RJd:before') {
          f.wrapperSubscription().error(new Error('SYNTHETIC_PRIVATE'));
          listeners = n.graph().tB.observers.length;
        }
      });
      expect(() =>
        n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true }))),
      ).toThrow();
      expect(listeners).toBe(1);
      expect(await pending).toHaveProperty('cause', 'response-action');
      expect(n.receiveTrace.map((entry) => entry.stage)).toEqual([
        'RJd:before',
        'RJd:after',
        'DJd',
      ]);
      expect(retirement()).toBe(false);
      expect(f.calls.history).toBe(0);
      expect(n.calls.query).toBe(1);
    },
  );
  it('preserves the native current callback first cause during decoded receive', async () => {
    const n = install();
    const pending = start().catch((error) => error);
    await ready();
    n.flushOpen();
    n.onDecode(() => f.change.active(false));
    expect(() =>
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true }))),
    ).toThrow();
    expect(
      await Promise.race([pending, ready().then(() => ({ cause: 'unsettled' }))]),
    ).toHaveProperty('cause', 'interrupted');
    expect(f.calls.history).toBe(0);
    expect(n.calls.query).toBe(1);
  });
  it('preserves the native current callback first cause before physical dispatch', async () => {
    const n = install();
    const pending = start().catch((error) => error);
    await ready();
    f.change.active(false);
    expect(() => n.flushOpen()).toThrow();
    expect(await pending).toHaveProperty('cause', 'interrupted');
    expect(n.calls.nativeSends).toBe(0);
    expect(f.calls.history).toBe(0);
  });
  it.each(['json', 'protobuf'] as const)(
    'accepts only the exact saved request-seed RID through %s',
    async (codec) => {
      const n = install(codec);
      (f.raw.fl[0] as any)[0][0][1] = f.approved.clientTurnId;
      const pending = start();
      await ready();
      n.flushOpen();
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', final: true })));
      n.receive(n.nativeClose(5));
      expect(await pending).toEqual(result);
      expect(f.calls.history).toBe(1);
      expect(f.packet.request.clientTurnId).toBe('synthetic-client');
      expect(f.forwarded).toContainEqual({
        responseType: 'TURN_COMPLETED',
        conversationId: 'c_47',
        turnId: 'synthetic-client',
      });
    },
  );
  it('refuses a mismatched saved seed without another lookup', async () => {
    const n = install();
    const pending = start().catch((error) => error);
    await ready();
    n.flushOpen();
    n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', final: true })));
    n.receive(n.nativeClose(5));
    expect(await pending).toHaveProperty('cause', 'history');
    expect(f.calls.history).toBe(1);
    expect(n.calls.query).toBe(1);
  });
  it('waits for the same-context deferred success action before history', async () => {
    const n = install();
    f.change.deferSuccess();
    const pending = start();
    await ready();
    n.flushOpen();
    n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })));
    n.receive(n.nativeClose(5));
    await ready();
    expect(f.calls.history).toBe(0);
    f.success();
    expect(await pending).toEqual(result);
    expect(f.calls.history).toBe(1);
  });
  it.each(['json', 'protobuf'] as const)(
    'refuses a first conflicting explicit RID after terminal through %s',
    async (codec) => {
      const n = install(codec);
      const pending = start().catch((error) => error);
      await ready();
      n.flushOpen();
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', final: true })));
      expect(() =>
        n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'server-late', final: true }))),
      ).toThrow();
      expect(await pending).toBeInstanceOf(Error);
      expect(f.calls.history).toBe(0);
      expect(n.calls.query).toBe(1);
    },
  );
  it.each([4, 5] as const)(
    'refuses close-only control %s without a terminal witness',
    async (field) => {
      const n = install();
      const pending = start().catch((error) => error);
      await ready();
      n.flushOpen();
      try {
        n.receive(n.nativeClose(field));
      } catch (error) {
        expect(error).toHaveProperty('cause', 'dispatch-cold-webchannel');
      }
      expect(await pending).toBeInstanceOf(Error);
      expect(f.calls.history).toBe(0);
    },
  );
  it('closes generation after queue-before-open cancellation', async () => {
    const n = install();
    const pending = start().catch((error) => error);
    await ready();
    expect(n.calls.query).toBe(1);
    expect(n.calls.nativeSends).toBe(0);
    f.controller.abort();
    expect(await pending).toHaveProperty('cause', 'interrupted');
    expect(() => n.flushOpen()).toThrow();
    expect(n.calls.nativeSends).toBe(0);
    expect(n.calls.query).toBe(1);
    expect(f.calls.history).toBe(0);
  });
  it.each(['json', 'protobuf'] as const)(
    'defers cancellation inside normalized delivery and preserves source tails through %s',
    async (codec) => {
      const n = install(codec);
      let retirement = () => true;
      const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, (check) => {
        retirement = check;
      }).catch((error) => error);
      await ready();
      n.flushOpen();
      let listeners = 0;
      n.onReceive((stage) => {
        if (stage === 'RJd:before') {
          f.controller.abort();
          listeners = n.graph().tB.observers.length;
          expect(retirement()).toBe(false);
        }
      });
      expect(() =>
        n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true }))),
      ).toThrow();
      expect(listeners).toBe(1);
      expect(retirement()).toBe(false);
      expect(n.receiveTrace.map((entry) => entry.stage)).toEqual([
        'RJd:before',
        'RJd:after',
        'DJd',
      ]);
      expect(await pending).toHaveProperty('cause', 'interrupted');
      expect(retirement()).toBe(false);
      expect(f.calls.history).toBe(0);
      expect(n.calls.query).toBe(1);
    },
  );
  it.each(
    (['json', 'protobuf'] as const).flatMap((codec) =>
      [false, true].map((restore) => ({ codec, restore })),
    ),
  )(
    'settles a refused $codec send on the existing poll (restored=$restore)',
    async ({ codec, restore }) => {
      vi.useFakeTimers();
      const n = install(codec);
      let retirement = () => true;
      let settled: unknown = 'pending';
      const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, (check) => {
        retirement = check;
      }).catch((error) => {
        settled = error;
        return error;
      });
      await ready();
      const source = n.namespace.LJd;
      n.namespace.LJd = () => {};
      expect(() => n.flushOpen()).toThrow();
      if (restore) n.namespace.LJd = source;
      await vi.advanceTimersByTimeAsync(100);
      expect(settled).toHaveProperty('cause', 'dispatch-native-n10');
      expect(await pending).toBe(settled);
      // A persistent source mismatch makes cleanup unsafe; restored ownership can retire.
      expect(retirement()).toBe(restore);
      expect(n.calls.nativeSends).toBe(0);
      expect(n.calls.query).toBe(1);
      expect(f.calls.history).toBe(0);
      await vi.advanceTimersByTimeAsync(100);
      expect(settled).toHaveProperty('cause', 'dispatch-native-n10');
      expect(n.calls.query).toBe(1);
      expect(vi.getTimerCount()).toBe(0);
    },
  );
  it.each(['json', 'protobuf'] as const)(
    'keeps the existing poll valid across native %s lifecycle phases',
    async (codec) => {
      vi.useFakeTimers();
      const n = install(codec);
      f.change.deferSuccess();
      let settled: unknown = 'pending';
      const pending = start().then(
        (value) => {
          settled = value;
          return value;
        },
        (error) => {
          settled = error;
          throw error;
        },
      );
      void pending.catch(() => {});
      let historyPolled = false;
      f.savedHistory!.beforeThen(() => {
        vi.advanceTimersByTime(100);
        historyPolled = true;
        expect(settled).toBe('pending');
      });
      await ready();
      await vi.advanceTimersByTimeAsync(100);
      expect(settled).toBe('pending');
      n.flushOpen();
      await vi.advanceTimersByTimeAsync(100);
      expect(settled).toBe('pending');
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })));
      await vi.advanceTimersByTimeAsync(100);
      expect(settled).toBe('pending');
      n.receive(n.nativeClose(5));
      await vi.advanceTimersByTimeAsync(100);
      expect(settled).toBe('pending');
      expect(f.calls.history).toBe(0);
      f.success();
      expect(await pending).toEqual(result);
      expect(historyPolled).toBe(true);
      expect(f.calls.history).toBe(1);
      expect(n.calls.query).toBe(1);
      expect(vi.getTimerCount()).toBe(0);
    },
  );
  it.each([true, undefined, null, 0] as const)(
    'refuses metadata admission with native oa=%s before original send',
    async (oa) => {
      install();
      f.api.ub.oa = oa;
      expect(await start().catch((error) => error)).toHaveProperty('cause', 'client-current');
      expect(f.calls.send).toBe(0);
      expect(f.native!.calls.factory).toBe(0);
    },
  );
  it('refuses a changed profile before original send', async () => {
    install();
    const read = vi.mocked(readGeminiClientCapability);
    read.mockImplementationOnce((capture) => {
      capture?.(f.client);
      return { status: 'unsupported', reason: 'transport-rpc' };
    });
    expect(await start().catch((error) => error)).toHaveProperty('cause', 'client-current');
    expect(f.calls.send).toBe(0);
  });
});

describe('current shared recovery runner retirement', () => {
  function installRecovery(codec: 'json' | 'protobuf') {
    f = fixture(codec);
    vi.stubGlobal('window', f.window);
    vi.stubGlobal('document', f.document);
    vi.stubGlobal('location', f.location);
    return f.native!;
  }
  it.each(['json', 'protobuf'] as const)(
    'cancels the original %s control63 reconnect timer without history or another query',
    async (codec) => {
      const n = installRecovery(codec);
      let retirement = () => false;
      const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, (check) => {
        retirement = check;
      }).catch((error) => error);
      await ready();
      n.flushOpen();
      const raw = n.nativeKf({ cid: 'c_63', rid: 'server-rid' });
      raw.fl[62] = 2;
      try {
        n.receive(n.nativeEnvelope(raw));
      } catch {}
      expect(await pending).toHaveProperty('cause', 'dispatch-observation');
      expect(retirement()).toBe(true);
      expect(n.shared.state().wa).toBe(true);
      expect(n.receiveTrace.map((event) => event.stage)).toEqual([
        'RJd:before',
        'RJd:after',
        'DJd',
      ]);
      expect(n.shared.pending()).toBe(0);
      for (const run of n.shared.timers) {
        try {
          run();
        } catch {}
      }
      expect(n.calls).toMatchObject({ factory: 1, config: 1, query: 1 });
      expect(f.calls.history).toBe(0);
      expect(f.complete).toBe(false);
    },
  );
  it.each(['json', 'protobuf'] as const)(
    'keeps the first %s cancellation failure and unsafe retirement when owned probe unsubscribe throws',
    async (codec) => {
      const n = installRecovery(codec);
      let retirement = () => true;
      const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, (check) => {
        retirement = check;
      }).catch((error) => error);
      await ready();
      n.flushOpen();
      const state = n.shared.state();
      state.committed = true;
      state.conversationId = 'c_probe';
      n.shared
        .observer()
        .error(Object.assign(Error('synthetic-network'), { syntheticNetwork: true }));
      expect(n.shared.pending()).toBe(1);
      expect(state.Da.closed).toBe(false);
      n.shared.failProbeUnsubscribe();
      f.controller.abort();
      expect(await pending).toHaveProperty('cause', 'interrupted');
      expect(retirement()).toBe(false);
      expect(n.calls).toMatchObject({ factory: 1, config: 1, query: 1 });
      expect(f.calls.history).toBe(0);
      expect(f.complete).toBe(false);
    },
  );
});

it.each(['g8a', 'h8a'] as const)(
  'Native63 retains current %s identity before delayed original subscription',
  async (key) => {
    let changed = false;
    f.change.beforeSubscribe(() => {
      changed = true;
      f.packet[key] = key === 'g8a' ? 'synthetic-changed-attestation' : '1'.repeat(32);
    });
    const pending = start().catch((error) => error);
    await ready();
    try {
      expect(changed).toBe(true);
      expect(f.calls.send).toBe(1);
      expect(f.calls.oub).toBe(1);
      expect(f.calls.inner).toBe(0);
      expect(await pending).toHaveProperty('cause', 'packet');
      expect(f.calls.history).toBe(0);
    } finally {
      f.controller.abort();
      await pending;
    }
  },
);

it.each([
  'immutable',
  'missing',
  'accessor',
  'inherited',
  'writable',
  'configurable',
  'unknown',
  'direct-code',
])('accepts only immutable own cold diagnostic data: %s', async (kind) => {
  const pending = start();
  await ready();
  const error = new Error('SYNTHETIC_PRIVATE_MARKER', { cause: 'dispatch-cold-webchannel' });
  const getter = vi.fn(() => 'dispatch-native-n03');
  if (kind === 'inherited')
    Object.setPrototypeOf(
      error,
      Object.create(Error.prototype, { geminiNativeDiagnostic: { value: 'dispatch-native-n03' } }),
    );
  else if (kind !== 'missing')
    Object.defineProperty(
      error,
      'geminiNativeDiagnostic',
      kind === 'accessor'
        ? { get: getter }
        : {
            value:
              kind === 'unknown'
                ? 'SYNTHETIC_PRIVATE_MARKER'
                : kind === 'direct-code'
                  ? 'dispatch-native-n25'
                  : 'dispatch-native-n03',
            writable: kind === 'writable',
            configurable: kind === 'configurable',
          },
    );
  f.error(error);
  await expect(pending).rejects.toMatchObject({
    message: 'Gemini SDK trial failed.',
    cause: kind === 'immutable' ? 'dispatch-native-n03' : 'dispatch',
  });
  expect(getter).not.toHaveBeenCalled();
  expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0 });
});

it.each([false, true])(
  'keeps original-send unknown diagnostic native-specific: native=%s',
  async (native) => {
    if (native) {
      f = fixture('json');
      vi.stubGlobal('window', f.window);
      vi.stubGlobal('document', f.document);
      vi.stubGlobal('location', f.location);
    }
    f.change.beforeSend(() => {
      throw Error('SYNTHETIC_PRIVATE_MARKER');
    });
    await expect(start()).rejects.toHaveProperty(
      'cause',
      native ? 'dispatch-native-n27' : 'dispatch',
    );
    expect(f.calls).toMatchObject({ send: 1, oub: 0, inner: 0, history: 0 });
    if (native) expect(f.native!.calls.query).toBe(0);
  },
);
it('keeps RPC unknown original-subscribe fallback generic', async () => {
  f.change.beforeSubscribe(() => {
    throw Error('SYNTHETIC_PRIVATE_MARKER');
  });
  await expect(start()).rejects.toHaveProperty('cause', 'dispatch');
  expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 0, history: 0 });
});

it.each(['request', 'producer'] as const)(
  'classifies native original %s throw at the actual source seam',
  async (seam) => {
    f = fixture('json');
    vi.stubGlobal('window', f.window);
    vi.stubGlobal('document', f.document);
    vi.stubGlobal('location', f.location);
    const called = vi.fn(() => {
      throw Error('SYNTHETIC_PRIVATE_MARKER');
    });
    // gAd runs inside the guarded original producer: its first N16 origin wins
    // over the later unknown-subscribe fallback N26. tzd precedes that producer.
    f.native!.hooks({ [seam]: called });
    await expect(start()).rejects.toHaveProperty(
      'cause',
      seam === 'request' ? 'dispatch-native-n25' : 'dispatch-native-n16',
    );
    expect(called).toHaveBeenCalledTimes(1);
    expect(f.calls).toMatchObject({ send: 1, history: 0 });
    expect(f.native!.calls).toMatchObject({ factory: 0, config: 0, query: 0, nativeSends: 0 });
  },
);

it.each([false, true])(
  'keeps post-return unknown validation outside original-send diagnostic: native=%s',
  async (native) => {
    if (native) {
      f = fixture('json');
      vi.stubGlobal('window', f.window);
      vi.stubGlobal('document', f.document);
      vi.stubGlobal('location', f.location);
    }
    const prototype = Object.getPrototypeOf(f.conversation),
      original = prototype.sendRequest;
    let returned = 0;
    const getPrototypeOf = vi.fn(() => {
      throw Error('SYNTHETIC_PRIVATE_MARKER');
    });
    prototype.sendRequest = function (this: unknown, ...args: unknown[]) {
      const result = Reflect.apply(original, this, args);
      returned++;
      return new Proxy(result as object, { getPrototypeOf });
    };
    await expect(start()).rejects.toHaveProperty('cause', 'dispatch');
    expect(returned).toBe(1);
    expect(getPrototypeOf).toHaveBeenCalledTimes(1);
    expect(f.calls).toMatchObject({ send: 1, history: 0 });
    if (native)
      expect(f.native!.calls).toMatchObject({ factory: 1, config: 1, query: 1, nativeSends: 0 });
    else expect(f.calls).toMatchObject({ oub: 1, inner: 1 });
  },
);

for (const snapshot of ['native', 'polyfill'] as const)
  for (const send of ['native', 'polyfill'] as const)
    for (const active of [false, true])
      it(`keeps exact public context ${snapshot}/${send}, active=${active}, through original callback completion and history`, async () => {
        f = fixture('json');
        vi.stubGlobal('window', f.window);
        vi.stubGlobal('document', f.document);
        vi.stubGlobal('location', f.location);
        const n = f.native!,
          p = n.asyncContext({ snapshot, send, active });
        vi.stubGlobal('AsyncContext', p.context);
        const pending = start();
        void pending.catch(() => {});
        await ready();
        n.flushOpen();
        expect(n.calls).toMatchObject({ factory: 1, config: 1, query: 1, nativeSends: 3 });
        if (send === 'polyfill')
          expect(n.nativeTransmissions().every((v) => p.recordedInitial(v.receiver))).toBe(true);
        const later = {};
        let originalContext = false,
          restored = false;
        n.onDecode(() => {
          originalContext = active ? p.isInitial() : p.isCurrent(later);
        });
        p.run(later, () => {
          n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })), true);
          restored = p.isCurrent(later);
        });
        expect(originalContext).toBe(true);
        expect(restored).toBe(true);
        expect(p.isInitial()).toBe(true);
        expect(f.calls.history).toBe(0);
        n.receive(n.nativeClose(5), true);
        await expect(pending).resolves.toMatchObject({ answer: 'CROSSCHECK_GEMINI_OK' });
        expect(f.calls.history).toBe(1);
        expect(n.calls).toMatchObject({
          factory: 1,
          config: 1,
          query: 1,
          nativeSends: 4,
          terminate: 1,
        });
      });

it.each([true, false])(
  'collects source-shaped int64 Xa=%s through native callback and strict history',
  async (bigint) => {
    f = fixture('json');
    vi.stubGlobal('window', f.window);
    vi.stubGlobal('document', f.document);
    vi.stubGlobal('location', f.location);
    const n = f.native!;
    n.nativeInt64(bigint);
    const p = n.asyncContext({ snapshot: 'polyfill', send: 'polyfill', active: true });
    vi.stubGlobal('AsyncContext', p.context);
    const pending = start();
    void pending.catch(() => {});
    await ready();
    const [config, query] = n.queued();
    expect(config.fl[0].fl[1]).toBe(bigint ? 0n : '0');
    expect(query.fl[1].fl[0]).toBe(bigint ? 1n : '1');
    n.flushOpen();
    expect(config.fl[0].fl[1]).toBe(bigint ? 0n : '0');
    n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })), true);
    expect(f.calls.history).toBe(0);
    n.receive(n.nativeClose(5), true);
    await expect(pending).resolves.toMatchObject({ answer: 'CROSSCHECK_GEMINI_OK' });
    expect(f.calls).toMatchObject({ send: 1, history: 1 });
    expect(n.calls).toMatchObject({
      factory: 1,
      config: 1,
      query: 1,
      nativeSends: 4,
      terminate: 1,
    });
  },
);
it.each(['configuration', 'query'] as const)(
  'refuses original int64 %s type replacement before physical consumption',
  async (kind) => {
    f = fixture('json');
    vi.stubGlobal('window', f.window);
    vi.stubGlobal('document', f.document);
    vi.stubGlobal('location', f.location);
    const n = f.native!,
      pending = start().catch((error) => error);
    await ready();
    const value = n.queued()[kind === 'configuration' ? 0 : 1];
    value.fl[kind === 'configuration' ? 0 : 1].fl[kind === 'configuration' ? 1 : 0] =
      kind === 'configuration' ? '0' : '1';
    expect(() => n.flushOpen()).toThrow();
    expect(await pending).toHaveProperty('cause', 'dispatch-native-n20');
    expect(f.calls).toMatchObject({ send: 1, history: 0 });
    expect(n.calls).toMatchObject({ query: 1, nativeSends: 0 });
  },
);

it.each([
  'immutable',
  'inherited',
  'accessor',
  'writable',
  'configurable',
  'unknown',
  'call-fallback',
])('Native57 decodes only immutable own allowlisted predicate metadata: %s', async (kind) => {
  const pending = start();
  await ready();
  const error = new Error('SYNTHETIC_PRIVATE', { cause: 'dispatch-cold-webchannel' }),
    code = 'dispatch-native-n15-configuration-zero',
    getter = vi.fn(() => code);
  if (kind === 'inherited')
    Object.setPrototypeOf(
      error,
      Object.create(Error.prototype, {
        geminiNativeDiagnostic: { value: code },
      }),
    );
  else
    Object.defineProperty(
      error,
      'geminiNativeDiagnostic',
      kind === 'accessor'
        ? { get: getter }
        : {
            value:
              kind === 'unknown'
                ? 'SYNTHETIC_PRIVATE'
                : kind === 'call-fallback'
                  ? 'dispatch-native-n27'
                  : code,
            writable: kind === 'writable',
            configurable: kind === 'configurable',
          },
    );
  f.error(error);
  await expect(pending).rejects.toMatchObject({
    message: 'Gemini SDK trial failed.',
    cause: kind === 'immutable' ? code : 'dispatch',
  });
  expect(getter).not.toHaveBeenCalled();
  expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0 });
});

it('Native57 preserves the actual configuration-state predicate through poll and safe cleanup', async () => {
  vi.useFakeTimers();
  f = fixture('json');
  vi.stubGlobal('window', f.window);
  vi.stubGlobal('document', f.document);
  vi.stubGlobal('location', f.location);
  const n = f.native!;
  let retirement = () => false;
  const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, (check) => {
    retirement = check;
  }).catch((error) => error);
  await ready();
  expect(() =>
    n.namespace.LJd(
      n.graph(),
      n.ok,
      n.api.requestSource,
      n.approved.modeId,
      n.approved.clientTurnId,
    ),
  ).toThrow();
  await vi.advanceTimersByTimeAsync(100);
  expect(await pending).toHaveProperty('cause', 'dispatch-native-n15-config-state');
  expect(retirement()).toBe(true);
  expect(f.calls).toMatchObject({ send: 1, history: 0 });
  expect(n.calls).toMatchObject({ query: 1, nativeSends: 0 });
});

it.each(['data', 'accessor'] as const)(
  'Native58 refuses late inherited ZKa %s before delayed physical dispatch without history',
  async (kind) => {
    const getter = vi.fn(() => false);
    const previous = Object.getOwnPropertyDescriptor(Object.prototype, 'ZKa');
    f.change.beforeSubscribe(() =>
      Object.defineProperty(Object.prototype, 'ZKa', {
        configurable: true,
        ...(kind === 'data' ? { value: false } : { get: getter }),
      }),
    );
    try {
      await expect(start()).rejects.toHaveProperty('cause', 'packet');
      expect(f.calls.inner).toBe(0);
      expect(f.calls.history).toBe(0);
      expect(getter).not.toHaveBeenCalled();
    } finally {
      if (previous) Object.defineProperty(Object.prototype, 'ZKa', previous);
      else Reflect.deleteProperty(Object.prototype, 'ZKa');
    }
  },
);

it.each(
  (['json', 'protobuf'] as const).flatMap((codec) =>
    [false, true].map((unsafe) => [codec, unsafe] as const),
  ),
)(
  'Native58 keeps %s TURN_ALREADY_EXISTS SUCCESS source tail outside accepted completion and history (unsafe=%s)',
  async (codec, unsafe) => {
    f = fixture(codec);
    vi.stubGlobal('window', f.window);
    vi.stubGlobal('document', f.document);
    vi.stubGlobal('location', f.location);
    const n = f.native!;
    if (unsafe)
      n.hooks({
        teardown() {
          throw Error('synthetic-owned-teardown');
        },
      });
    let retirement = () => false;
    const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, (check) => {
      retirement = check;
    }).catch((error) => error);
    await ready();
    n.flushOpen();
    const service = n.shared.service.ka;
    service.oa = 3;
    service.ka = 2;
    const raw = n.nativeKf({ cid: 'c_63', rid: 'server-rid', final: true });
    raw.fl[62] = 4;
    try {
      n.receive(n.nativeEnvelope(raw));
    } catch {}
    const failure = await pending;
    expect(failure).toHaveProperty('cause', 'response-completion');
    expect(service.oa).toBe(0);
    expect(service.ka).toBe(0);
    expect(service.ha.getValue().status).toBe('SUCCESS');
    expect(retirement()).toBe(!unsafe);
    expect(n.shared.pending()).toBe(0);
    expect(n.projectionTimerStarts()).toBe(1);
    expect(n.projectionTimers()).toBe(0);
    expect(n.projectionCleanup).toEqual(['timer']);
    expect(n.responseSubscription().closed).toBe(true);
    expect(() => n.originalXub()).toThrow();
    expect(n.calls).toMatchObject({ factory: 1, config: 1, query: 1 });
    expect(f.calls.history).toBe(0);
    expect(f.complete).toBe(false);
  },
);

it('Native63 source privacy construction belongs to the native receiving namespace', () => {
  const native = fixture('json');
  native.packet.request = native.sourceConstruction.privacy(native.packet.request, true);
  expect(Object.getPrototypeOf(native.packet.request.s4d)).toBe(native.namespace.wxd.prototype);
});

it('Native64 late cache-only mutation stays uncertain with no history and unsafe retirement', async () => {
  f = fixture('json');
  vi.stubGlobal('window', f.window);
  vi.stubGlobal('document', f.document);
  vi.stubGlobal('location', f.location);
  const n = f.native!;
  let retirement = () => true;
  const pending = runGeminiSdkFixedTextTrial(f.controller.signal, f.current, (check) => {
    retirement = check;
  }).catch((error) => error);
  await ready();
  const config = n.queued()[0],
    child = config.fl[0],
    ns = n.namespace;
  Object.freeze(config.fl);
  Object.freeze(config.fl[ns.dga]);
  config.fl[ns.dga].set(ns.eM, 2);
  expect(() => n.flushOpen()).toThrow();
  expect(await pending).toHaveProperty('cause', 'dispatch-native-n20');
  expect(retirement()).toBe(false);
  expect(config.fl[0]).toBe(child);
  expect(config.fl[ns.dga].get(ns.eM)).toBe(2);
  expect(f.calls).toMatchObject({ send: 1, history: 0 });
  expect(n.calls).toMatchObject({ factory: 1, config: 1, query: 1, nativeSends: 0 });
});
