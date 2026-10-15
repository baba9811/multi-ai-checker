import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import bootstrapTrial from '../../../entrypoints/gemini-sdk-fixed-text-trial';
import { geminiSdkFixedTextTrialFixture as fixture } from '../../fixtures/providers/gemini-sdk-fixed-text-trial';

let f: ReturnType<typeof fixture>;
vi.mock('wxt/utils/define-unlisted-script', () => ({
  defineUnlistedScript: (start: () => unknown) => start,
}));
vi.mock('../../../src/infrastructure/providers/gemini/client-capability', () => ({
  readGeminiClientCapability: (
    capture: (client: typeof f.client) => void,
    expectedUrl = 'https://gemini.google.com/app',
  ) => {
    if (f.location.href !== expectedUrl || !f.host.isConnected || !f.owner.isConnected)
      return { status: 'unsupported', reason: 'owner' };
    capture(f.client);
    return { status: 'unsupported', reason: 'transport-rpc' };
  },
}));
vi.mock('../../../src/infrastructure/providers/gemini/readiness', () => ({
  geminiReadiness: () => f.readiness(),
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
vi.mock('../../../src/infrastructure/providers/gemini/trial-history', () => ({
  readGeminiTrialHistory: (...args: Parameters<typeof f.history>) => f.history(...args),
}));
vi.mock('../../../src/infrastructure/providers/dom', () => ({
  composer: () => f.editor,
  draftText: () => f.draft(),
}));

const realGlobal = globalThis;
let pageGlobal: Record<string, unknown>;
let capability: string;
let registry:
  | {
      lease(value: unknown): unknown;
      stop(value: unknown): boolean;
      terminalError(value: unknown): unknown;
    }
  | undefined;
const ready = async () => {
  for (let i = 0; i < 12; i++) await Promise.resolve();
};
function bootstrap() {
  const entry = bootstrapTrial as unknown as () => { handle: string; capability: string };
  const value = entry();
  capability = value.capability;
  registry = Object.getOwnPropertyDescriptor(pageGlobal, value.handle)!.value;
  return registry!;
}
beforeEach(() => {
  vi.useFakeTimers();
  f = fixture();
  registry = undefined;
  pageGlobal = Object.create(realGlobal);
  vi.stubGlobal('window', f.window);
  vi.stubGlobal('document', f.document);
  vi.stubGlobal('location', f.location);
  // The real MAIN entrypoint owns immutable globals for one native document.
  vi.stubGlobal('globalThis', pageGlobal);
});
afterEach(async () => {
  registry?.stop(capability);
  await ready();
  Reflect.set(realGlobal, 'globalThis', realGlobal);
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('Gemini MAIN lease and retirement separation', () => {
  it.each(['continuation', 'partial'] as const)(
    'keeps a pending %s on its owned home alive until marker/history completion',
    async (kind) => {
      const control = bootstrap();
      expect(control.lease(capability)).toEqual({ status: 'pending' });
      await ready();
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0 });
      const event =
        kind === 'continuation'
          ? f.continuation
          : {
              ...f.final,
              response: {
                ...f.final.response,
                isFinal: false,
                draft: {
                  ...f.final.response.draft,
                  Z2: 'CROSSCHECK',
                  completeness: 'PARTIAL',
                  structuredContent: { children: [{ nodeType: 18, text: 'CROSSCHECK' }] },
                },
              },
            };
      f.emit(event);
      expect(f.forwarded).toContain(event);
      expect(f.dispatchClosed).toBe(false);
      expect(control.lease(capability)).toEqual({ status: 'pending' });
      expect(f.calls.cancel).toBe(0);
      f.emit(f.marker);
      f.end();
      await ready();
      expect(control.lease(capability)).toEqual({
        status: 'done',
        result: { model: 'Synthetic Auto', answer: 'CROSSCHECK_GEMINI_OK' },
      });
      expect(control.stop(capability)).toBe(true);
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
    },
  );

  it('keeps reentrant setup polling pending before approval exists', async () => {
    const control = bootstrap();
    let progress: unknown;
    f.namespace.GN.prototype.Vg = () => {
      progress = control.lease(capability);
      return f.approved.clientTurnId;
    };
    control.lease(capability);
    await ready();
    expect(progress).toEqual({ status: 'pending' });
    expect(f.calls.send).toBe(1);
    f.emit(f.marker);
    f.end();
    await ready();
    expect(control.lease(capability)).toHaveProperty('status', 'done');
  });

  it('preserves a terminal setup refusal when retirement cannot prove approval', async () => {
    const control = bootstrap();
    f.namespace.jLd = undefined;
    control.lease(capability);
    await ready();
    const failure = { status: 'error', reason: 'capture-actions' };
    expect(control.lease(capability)).toEqual(failure);
    expect(control.stop(capability)).toBe(false);
    expect(control.lease(capability)).toEqual(failure);
    expect(f.calls.send).toBe(0);
  });

  it('preserves the original stream refusal when its bound pending home is unsafe to retire', async () => {
    const control = bootstrap();
    control.lease(capability);
    await ready();
    f.emit(f.continuation);
    f.emit({ responseType: 'DISCONNECT' });
    await ready();
    const failure = { status: 'error', reason: 'response-disconnect-2' };
    expect(control.lease(capability)).toEqual(failure);
    expect(control.stop(capability)).toBe(false);
    expect(control.lease(capability)).toEqual(failure);
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0 });
  });

  it('never lets a wrong capability consume the first-lease home check or run a retirement check', async () => {
    const control = bootstrap();
    const storeRead = vi.fn(f.namespace.AC);
    f.namespace.AC = storeRead;
    expect(control.lease('wrong')).toEqual({ status: 'error', reason: 'interrupted' });
    expect(storeRead).not.toHaveBeenCalled();
    f.location.href = 'https://gemini.google.com/app/99';
    expect(control.lease(capability)).toEqual({ status: 'error', reason: 'page' });
    await ready();
    expect(f.calls.send).toBe(0);
    expect(storeRead).not.toHaveBeenCalled();
  });

  it('never runs a bound retirement callback for a wrong capability', async () => {
    const storeRead = vi.fn(f.namespace.AC);
    f.namespace.AC = storeRead;
    const control = bootstrap();
    control.lease(capability);
    await ready();
    f.emit(f.continuation);
    storeRead.mockClear();
    expect(control.lease('wrong')).toEqual({ status: 'error', reason: 'interrupted' });
    expect(control.stop('wrong')).toBe(false);
    expect(storeRead).not.toHaveBeenCalled();
    expect(control.lease(capability)).toEqual({ status: 'pending' });
    expect(f.calls.cancel).toBe(0);
  });

  it('refuses a pre-start draft through the existing SDK editor guard', async () => {
    const control = bootstrap();
    f.change.draft('SYNTHETIC_PRIVATE');
    control.lease(capability);
    await ready();
    expect(control.lease(capability)).toEqual({ status: 'error', reason: 'capture-editor' });
    expect(f.calls.send).toBe(0);
  });

  it('never starts or resumes after a pre-start user input', async () => {
    const control = bootstrap();
    f.document.dispatchEvent(new Event('input'));
    control.lease(capability);
    await ready();
    expect(control.stop(capability)).toBe(false);
    control.lease(capability);
    await ready();
    expect(f.calls.send).toBe(0);
  });

  it.each(['input', 'expiry'] as const)(
    'does not resume a pending owned home after %s',
    async (kind) => {
      const control = bootstrap();
      control.lease(capability);
      await ready();
      f.emit(f.continuation);
      if (kind === 'input') f.document.dispatchEvent(new Event('input'));
      else vi.advanceTimersByTime(15000);
      await ready();
      const failure = { status: 'error', reason: 'interrupted' };
      expect(control.lease(capability)).toEqual(failure);
      expect(control.stop(capability)).toBe(false);
      expect(control.lease(capability)).toEqual(failure);
      expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0, cancel: 1 });
    },
  );
});

it.each([false, true, 0, 1])(
  'keeps canonical Boolean44 %s private through the actual MAIN lease and original completion',
  async (value) => {
    const control = bootstrap();
    expect(control.lease(capability)).toEqual({ status: 'pending' });
    await ready();
    const savedHistory = JSON.stringify(f.raw);
    f.live.fl[43] = value;
    f.rawEmit();
    expect(control.lease(capability)).toEqual({ status: 'pending' });
    expect(f.calls.history).toBe(0);
    f.emit(f.continuation);
    f.emit(f.disconnect);
    f.end();
    await ready();
    expect(control.lease(capability)).toEqual({
      status: 'done',
      result: { model: 'Synthetic Auto', answer: 'CROSSCHECK_GEMINI_OK' },
    });
    expect(f.live.fl[43]).toBe(value);
    expect(JSON.stringify(f.raw)).toBe(savedHistory);
    expect(f.calls).toMatchObject({ send: 1, inner: 1, history: 1 });
    expect(f.rawDetached()).toBe(true);
    expect(control.stop(capability)).toBe(true);
  },
);

it.each(['', 'SYNTHETIC_PRIVATE_SUPPLEMENT'])(
  'preserves raw string18 %s collection and safe untouched-home retirement through the actual MAIN entrypoint',
  async (supplement) => {
    const control = bootstrap();
    expect(control.lease(capability)).toEqual({ status: 'pending' });
    await ready();
    const savedHistory = JSON.stringify(f.raw);
    f.live.fl[17] = supplement;
    f.live.fl[14] = false;
    f.status[0] = 1;
    f.text.fl[0] = 'CROSSCHECK';
    f.rawEmit();
    expect(control.lease(capability)).toEqual({ status: 'pending' });
    expect(f.calls.history).toBe(0);
    f.live.fl[14] = true;
    f.status[0] = 2;
    f.text.fl[0] = f.completed.answer;
    f.rawEmit();
    f.emit(f.continuation);
    f.emit(f.disconnect);
    f.end();
    await ready();
    expect(control.lease(capability)).toEqual({
      status: 'done',
      result: { model: 'Synthetic Auto', answer: 'CROSSCHECK_GEMINI_OK' },
    });
    expect(JSON.stringify(control.lease(capability))).not.toContain('SYNTHETIC_PRIVATE_SUPPLEMENT');
    expect(JSON.stringify(f.raw)).toBe(savedHistory);
    expect(control.stop(capability)).toBe(true);
    expect(f.rawDetached()).toBe(true);
    expect(f.calls).toMatchObject({ send: 1, inner: 1, history: 1 });
  },
);

it.each<[string, (f: ReturnType<typeof fixture>) => void]>([
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
])(
  'preserves %s through raw receiving and the actual MAIN lease without retry',
  async (reason, mutate) => {
    const control = bootstrap();
    expect(control.lease(capability)).toEqual({ status: 'pending' });
    await ready();
    mutate(f);
    f.rawEmit();
    f.end();
    await ready();
    const failure = { status: 'error', reason };
    expect(control.lease(capability)).toEqual(failure);
    expect(JSON.stringify(control.lease(capability))).not.toContain('SYNTHETIC_PRIVATE_MARKER');
    expect(f.rawDetached()).toBe(true);
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 0 });
    expect(f.forwarded).toHaveLength(0);
    control.lease(capability);
    f.rawEmit();
    await ready();
    expect(control.lease(capability)).toEqual(failure);
    expect(f.calls.send).toBe(1);
  },
);

it('keeps routing metadata private through the actual MAIN controls and original callback closure', async () => {
  const control = bootstrap();
  expect(control.lease(capability)).toEqual({ status: 'pending' });
  await ready();
  f.rawRouting.fl[17] = 'SYNTHETIC_SURVEY';
  f.rawEmit(f.rawRouting);
  f.emit({ ...f.routing, bFd: 'SYNTHETIC_SURVEY' } as any);
  expect(control.lease(capability)).toEqual({ status: 'pending' });
  f.rawEmit();
  f.emit();
  f.end();
  await ready();
  const result = control.lease(capability);
  expect(result).toEqual({
    status: 'done',
    result: { model: 'Synthetic Auto', answer: f.completed.answer },
  });
  expect(JSON.stringify(result)).not.toMatch(/SYNTHETIC_ROUTING|SYNTHETIC_SURVEY|c8c|Kzd|epa/);
  expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
});

it.each([[], [null], [[]], [{ 1: [] }]].map((metadata) => ({ metadata })))(
  'keeps empty client65 $metadata private through the actual MAIN lease and original completion',
  async ({ metadata }) => {
    const control = bootstrap();
    expect(control.lease(capability)).toEqual({ status: 'pending' });
    await ready();
    const savedHistory = JSON.stringify(f.raw);
    f.live.fl[64] = metadata;
    f.rawEmit();
    expect(control.lease(capability)).toEqual({ status: 'pending' });
    expect(f.calls.history).toBe(0);
    f.emit(f.continuation);
    f.emit(f.disconnect);
    f.end();
    await ready();
    expect(control.lease(capability)).toEqual({
      status: 'done',
      result: { model: 'Synthetic Auto', answer: f.completed.answer },
    });
    expect(f.live.fl[64]).toBe(metadata);
    expect(JSON.stringify(f.raw)).toBe(savedHistory);
    expect(f.calls).toMatchObject({ send: 1, inner: 1, history: 1 });
    expect(f.rawDetached()).toBe(true);
    expect(control.stop(capability)).toBe(true);
  },
);

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
    const control = bootstrap();
    expect(control.lease(capability)).toEqual({ status: 'pending' });
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
    expect(control.lease(capability)).toEqual({ status: 'pending' });
    f.emit(f.continuation);
    f.emit(f.disconnect);
    f.end();
    await ready();
    const result = control.lease(capability);
    expect(result).toEqual({
      status: 'done',
      result: { model: 'Synthetic Auto', answer: 'CROSSCHECK_GEMINI_OK' },
    });
    expect(control.stop(capability)).toBe(false);
    expect(JSON.stringify(result)).not.toContain('SYNTHETIC_PRIVATE');
    expect(JSON.stringify(f.raw)).toBe(savedHistory);
    expect(f.calls).toMatchObject({ send: 1, oub: 1, inner: 1, history: 1 });
    expect(f.rawDetached()).toBe(true);
  },
);

it.each(['missing', 'foreign', 'completion'] as const)(
  'location6 and live20/43 cannot replace %s strict history/original completion through actual MAIN',
  async (kind) => {
    const control = bootstrap();
    expect(control.lease(capability)).toEqual({ status: 'pending' });
    await ready();
    f.live.fl[5] = ['SYNTHETIC_PRIVATE_LOCATION', '', true, null, ''];
    f.live.fl[19] = 'ko';
    f.live.fl[42] = 'SYNTHETIC_PRIVATE_ATTRIBUTION';
    f.rawEmit();
    expect(f.calls.history).toBe(0);
    if (kind === 'missing') f.raw.fl[0] = [];
    if (kind === 'foreign') f.identity.fl[0] = 'c_other';
    f.emit(f.continuation);
    f.emit(f.disconnect);
    if (kind !== 'completion') f.end();
    await ready();
    if (kind === 'completion') {
      expect(control.lease(capability)).toEqual({ status: 'pending' });
      expect(f.calls.history).toBe(0);
      control.stop(capability);
      await ready();
    }
    const failure = { status: 'error', reason: kind === 'completion' ? 'interrupted' : 'history' };
    expect(control.lease(capability)).toEqual(failure);
    expect(JSON.stringify(failure)).not.toContain('SYNTHETIC_PRIVATE');
    expect(f.calls).toMatchObject({
      send: 1,
      oub: 1,
      inner: 1,
      history: kind === 'completion' ? 0 : 1,
    });
    expect(f.rawDetached()).toBe(true);
  },
);

it('reads only an existing terminal error after a restored draft makes retirement unsafe', async () => {
  const control = bootstrap();
  expect(control.terminalError(capability)).toBeNull();
  control.lease(capability);
  await ready();
  f.emit(f.continuation);
  f.emit({ responseType: 'DISCONNECT' });
  await ready();
  f.change.draft('SYNTHETIC_RESTORED_DRAFT');
  const calls = { ...f.calls };
  const read = vi.spyOn(f, 'draft').mockImplementation(() => {
    throw new Error('Must not inspect page');
  });
  const store = vi.spyOn(f.namespace, 'AC').mockImplementation(() => {
    throw new Error('Must not inspect state');
  });
  expect(control.terminalError('wrong')).toBeNull();
  expect(control.terminalError(capability)).toBe('response-disconnect-2');
  expect(read).not.toHaveBeenCalled();
  expect(store).not.toHaveBeenCalled();
  expect(f.calls).toEqual(calls);
  read.mockRestore();
  store.mockRestore();
  expect(control.stop(capability)).toBe(false);
  expect(control.terminalError(capability)).toBe('response-disconnect-2');
  expect(f.calls).toMatchObject({ send: 1, inner: 1, history: 0 });
});
it('does not start or renew pending work through the entrypoint error query', async () => {
  const control = bootstrap();
  f.change.draft('SYNTHETIC_PREEXISTING_DRAFT');
  expect(control.terminalError(capability)).toBeNull();
  expect(control.terminalError('wrong')).toBeNull();
  await ready();
  expect(f.calls.send).toBe(0);
  f.change.draft('');
  control.lease(capability);
  await ready();
  await vi.advanceTimersByTimeAsync(14000);
  const calls = { ...f.calls };
  expect(control.terminalError(capability)).toBeNull();
  expect(f.calls).toEqual(calls);
  await vi.advanceTimersByTimeAsync(1000);
  expect(control.terminalError(capability)).toBe('interrupted');
  expect(f.calls.send).toBe(1);
});
it('does not expose a completed result or repeat history through the entrypoint error query', async () => {
  const control = bootstrap();
  control.lease(capability);
  await ready();
  f.emit(f.marker);
  f.end();
  await ready();
  expect(control.lease(capability)).toHaveProperty('status', 'done');
  const calls = { ...f.calls };
  expect(control.terminalError(capability)).toBeNull();
  expect(control.terminalError('wrong')).toBeNull();
  expect(f.calls).toEqual(calls);
});

it.each(['dispatch-native-n03', 'dispatch-native-n10', 'dispatch-native-n18'])(
  'preserves fixed native diagnostic %s through actual MAIN error and inert query',
  async (cause) => {
    const control = bootstrap();
    control.lease(capability);
    await ready();
    f.error(new Error('SYNTHETIC_PRIVATE_MARKER', { cause }));
    await ready();
    expect(control.terminalError(capability)).toBe(cause);
    expect(control.lease(capability)).toEqual({ status: 'error', reason: cause });
    expect(f.calls).toMatchObject({ send: 1, inner: 1, history: 0 });
  },
);
