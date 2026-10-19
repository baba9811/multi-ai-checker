import { describe, expect, it, vi } from 'vitest';
import {
  assertGeminiTrialHistory,
  createGeminiNativeReceipt,
  captureGeminiNativeWireContent,
  readGeminiNativeEnvelope,
  assertGeminiNativeConfiguration,
  assertGeminiNativeLifecycleProfile,
  readGeminiNativeSendKind,
  assertGeminiTrialPacket,
  type GeminiFinalMarker,
  type GeminiTrialCompletion,
} from '../../../src/infrastructure/providers/gemini/fixed-text-contract';
import * as fixedContract from '../../../src/infrastructure/providers/gemini/fixed-text-contract';
import { geminiFixedTextContractFixture } from '../../fixtures/providers/gemini-fixed-text-contract';
import { GEMINI_FIXED_TEXT_TRIAL_ANSWER } from '../../../src/application/gemini-fixed-text-trial';

type Fixture = ReturnType<typeof geminiFixedTextContractFixture>;
function reject(
  fixture: Fixture,
  kind: 'packet' | 'history',
  completion: unknown = fixture.completed,
) {
  const originalCalls = { ...fixture.calls };
  try {
    if (kind === 'packet')
      assertGeminiTrialPacket(fixture.namespace, fixture.packet, fixture.approved);
    else
      assertGeminiTrialHistory(
        fixture.namespace,
        fixture.raw,
        fixture.approved,
        completion as GeminiTrialCompletion,
      );
    expect.fail('Invalid synthetic contract was accepted.');
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchObject({ message: 'Gemini trial contract failed.', cause: kind });
    expect(String(error)).not.toContain('SYNTHETIC_PRIVATE_MARKER');
  }
  expect(fixture.calls).toEqual(originalCalls);
}
const packet = (f: Fixture) => assertGeminiTrialPacket(f.namespace, f.packet, f.approved);
const history = (f: Fixture) =>
  assertGeminiTrialHistory(f.namespace, f.raw, f.approved, f.completed);
const marker = (f: Fixture): GeminiFinalMarker => ({
  kind: 'marker',
  conversationId: f.completed.conversationId,
  turnId: f.completed.turnId,
});

describe('fixed protected packet', () => {
  it.each(['data', 'accessor'])('refuses inherited ZKa %s without evaluating it', (kind) => {
    const f = geminiFixedTextContractFixture();
    const previous = Object.getOwnPropertyDescriptor(Object.prototype, 'dLa');
    const getter = vi.fn(() => false);
    try {
      Object.defineProperty(Object.prototype, 'dLa', {
        configurable: true,
        ...(kind === 'data' ? { value: false } : { get: getter }),
      });
      reject(f, 'packet');
      expect(getter).not.toHaveBeenCalled();
    } finally {
      if (previous) Object.defineProperty(Object.prototype, 'dLa', previous);
      else Reflect.deleteProperty(Object.prototype, 'dLa');
    }
  });
  it.each([false, undefined, 'accessor'])(
    'preserves the own ZKa %s refusal without evaluating it',
    (value) => {
      const f = geminiFixedTextContractFixture();
      const getter = vi.fn(() => false);
      Object.defineProperty(
        f.packet.request,
        'dLa',
        value === 'accessor' ? { get: getter } : { value },
      );
      reject(f, 'packet');
      expect(getter).not.toHaveBeenCalled();
    },
  );
  it.each(['A5a', 'B5a', 'Dj', 'Wz', 'Cq', 'Hj'])(
    'refuses a historical %s field mixed into the current packet',
    (key) => {
      const f = geminiFixedTextContractFixture();
      if (key === 'A5a' || key === 'B5a') Object.assign(f.packet, { [key]: undefined });
      else Object.assign(f.packet.request, { [key]: undefined });
      reject(f, 'packet');
    },
  );

  it('returns the original approved packet without constructors, getters or methods', () => {
    const f = geminiFixedTextContractFixture();
    const calls = { ...f.calls };
    expect(packet(f)).toBe(f.packet);
    expect(f.calls).toEqual(calls);
  });
  it.each([
    ['Ae', 'another-store'],
    ['clientTurnId', 'another-client'],
    ['ri', 'another-mode'],
    ['textQuery', 'SYNTHETIC_PRIVATE_MARKER'],
    ['conversationId', 'c_50'],
    ['ej', 'r_50'],
    ['oy', 'rc_50'],
    ['xS', 'another-version'],
    ['yg', 1],
    ['Fo', 1],
    ['ff', 40],
    ['Pg', true],
    ['oh', true],
    ['b_', 'MODE_CATEGORY_FAST'],
    ['thinkingLevel', 'THINKING_LEVEL_EXTENDED'],
    ['Uo', 'unknown-routing'],
    ['Lj', 'unknown-effort'],
  ])('rejects changed approved field %s', (key, value) => {
    const f = geminiFixedTextContractFixture();
    Object.assign(f.packet.request, { [key as string]: value });
    reject(f, 'packet');
  });
  it.each([
    'Ae',
    'clientTurnId',
    'ri',
    'textQuery',
    'conversationId',
    'ej',
    'oy',
    'xS',
    'yg',
    'Fo',
    'ff',
    'Pg',
    'oh',
    'Cc',
  ])('requires actual own field %s', (key) => {
    const f = geminiFixedTextContractFixture();
    delete (f.packet.request as Record<string, unknown>)[key];
    reject(f, 'packet');
  });
  it.each([
    'Ie',
    'toolMentions',
    'rka',
    'WFa',
    'wxa',
    'jt',
    'eo',
    'Dd',
    'taskIdentifiers',
    'Vw',
    'z8c',
    'ekb',
    'nic',
    'ahc',
    'Ahc',
    'isSystemMessage',
    'Tea',
    'ej',
    'Ree',
    'vFb',
    'V5d',
    'eud',
    'oLc',
    'hud',
    'wAd',
    'unknownContext',
  ])('rejects unsupported meaningful input %s', (key) => {
    const f = geminiFixedTextContractFixture();
    Object.assign(f.packet.request, { [key]: [] });
    reject(f, 'packet');
  });
  it('rejects an unknown key even with undefined value', () => {
    const f = geminiFixedTextContractFixture();
    Object.assign(f.packet.request, { unknown: undefined });
    reject(f, 'packet');
  });
  it.each(['', undefined, 1])('rejects missing/unsupported genuine attestation', (value) => {
    const f = geminiFixedTextContractFixture();
    Object.assign(f.packet, { t8a: value });
    reject(f, 'packet');
  });
  it.each(['', undefined, 'A'.repeat(32), '0'.repeat(31), 'g'.repeat(32)])(
    'rejects unsupported normal nonce',
    (value) => {
      const f = geminiFixedTextContractFixture();
      Object.assign(f.packet, { u8a: value });
      reject(f, 'packet');
    },
  );
  it('supports only captured privacy booleans and the source-proved one-field Qud enum', () => {
    const f = geminiFixedTextContractFixture();
    Object.assign(f.approved, { isPersonalContextDisabled: true });
    Object.assign(f.packet.request, {
      isPersonalContextDisabled: true,
      Cc: { isPersonalContextDisabled: true },
      x5d: f.message('Ixd', { 1: 2 }),
      m0b: true,
    });
    expect(packet(f)).toBe(f.packet);
  });
  it.each([0, 3, '2', undefined])('rejects unsupported Qud state', (value) => {
    const f = geminiFixedTextContractFixture();
    Object.assign(f.packet.request, { x5d: f.message('Ixd', { 1: value }) });
    reject(f, 'packet');
  });
  it.each([
    (f: Fixture) => Object.assign(f.packet.request, { x5d: { fl: [1] } }),
    (f: Fixture) =>
      Object.assign(f.packet.request, { x5d: f.message('Ixd', { 1: 1, 2: 'extra' }) }),
    (f: Fixture) => Object.assign(f.packet.request, { isPersonalContextDisabled: false }),
    (f: Fixture) => Object.assign(f.packet.request, { Cc: { isPersonalContextDisabled: true } }),
    (f: Fixture) => Object.assign(f.packet.request, { Cc: { jaa: { isTemporaryChat: true } } }),
    (f: Fixture) => Object.assign(f.packet.request, { m0b: false }),
    (f: Fixture) => Object.assign(f.packet, { source: 'SYNTHETIC_PRIVATE_MARKER' }),
  ])('rejects extra or unbound metadata', (mutate) => {
    const f = geminiFixedTextContractFixture();
    mutate(f);
    reject(f, 'packet');
  });
  it('accepts exact captured catalog/thinking metadata without remapping model IDs', () => {
    const f = geminiFixedTextContractFixture();
    Object.assign(f.approved, { Cq: 'synthetic-route', Hj: 'synthetic-effort' });
    Object.assign(f.packet.request, { Uo: 'synthetic-route', Lj: 'synthetic-effort' });
    expect(packet(f)).toBe(f.packet);
  });
  it('keeps request JavaScript booleans strict while wire booleans use their own contract', () => {
    const f = geminiFixedTextContractFixture();
    Object.assign(f.packet.request, { Pg: 0 });
    reject(f, 'packet');
    Object.assign(f.packet.request, { Pg: false, oh: 0 });
    reject(f, 'packet');
  });
  it('refuses accessors in packet, request, approval and namespace without invoking them', () => {
    for (const target of ['packet', 'request', 'approved', 'namespace'] as const) {
      const f = geminiFixedTextContractFixture();
      const getter = vi.fn(() => 'SYNTHETIC_PRIVATE_MARKER');
      if (target === 'packet') Object.defineProperty(f.packet, 't8a', { get: getter });
      else if (target === 'request') Object.defineProperty(f.packet.request, 'ri', { get: getter });
      else if (target === 'approved') Object.defineProperty(f.approved, 'modeId', { get: getter });
      else {
        Object.assign(f.packet.request, { x5d: f.message('Ixd', { 1: 1 }) });
        Object.defineProperty(f.namespace, 'Ixd', { get: getter });
      }
      reject(f, 'packet');
      expect(getter).not.toHaveBeenCalled();
    }
  });
});

describe('request-owned terminal marker history', () => {
  it.each([false, true])(
    'accepts explicit saved completion with observed candidate %j',
    (observed) => {
      const f = geminiFixedTextContractFixture();
      const completion = marker(f);
      if (observed) completion.observedCandidateId = f.completed.candidateId;
      const calls = { ...f.calls };
      expect(assertGeminiTrialHistory(f.namespace, f.raw, f.approved, completion)).toBe(
        GEMINI_FIXED_TEXT_TRIAL_ANSWER,
      );
      expect(f.calls).toEqual(calls);
      expect(Object.keys(completion)).not.toContain('answer');
    },
  );
  it.each([undefined, false, 0, true, 1])(
    'accepts only canonical saved display state %j',
    (saved) => {
      const f = geminiFixedTextContractFixture();
      f.response.fl[28] = saved;
      expect(assertGeminiTrialHistory(f.namespace, f.raw, f.approved, marker(f))).toBe(
        GEMINI_FIXED_TEXT_TRIAL_ANSWER,
      );
    },
  );
  it('validates actual bounded metadata without fabricating unseen live fields', () => {
    const f = geminiFixedTextContractFixture();
    Object.assign(f.response.fl, {
      8: 'ZZ',
      14: 'synthetic-server-choice',
      24: 8,
      25: 4,
      29: 'synthetic-route',
      30: 'synthetic-effort',
    });
    expect(assertGeminiTrialHistory(f.namespace, f.raw, f.approved, marker(f))).toBe(
      GEMINI_FIXED_TEXT_TRIAL_ANSWER,
    );
    reject(f, 'history');
  });
  it('uses the actual saved selection when no partial candidate was observed', () => {
    const f = geminiFixedTextContractFixture();
    f.response.fl[3] = f.candidate.fl[0] = 'rc_saved';
    expect(assertGeminiTrialHistory(f.namespace, f.raw, f.approved, marker(f))).toBe(
      GEMINI_FIXED_TEXT_TRIAL_ANSWER,
    );
    reject(f, 'history', { ...marker(f), observedCandidateId: f.completed.candidateId });
  });
  it.each([
    {},
    { kind: 'other' },
    { conversationId: '' },
    { turnId: '' },
    { conversationId: 'c_47 ' },
    { turnId: 'r'.repeat(161) },
    { observedCandidateId: undefined },
    { observedCandidateId: null },
    { observedCandidateId: '' },
    { observedCandidateId: 'rc_other' },
    { observedCandidateId: 'r'.repeat(161) },
    { answer: GEMINI_FIXED_TEXT_TRIAL_ANSWER },
    { candidateId: 'rc_49' },
    { Zzb: false },
    { privateExtra: undefined },
  ])('rejects malformed or fabricated marker fields %j', (change) => {
    const f = geminiFixedTextContractFixture();
    const completion: Record<string, unknown> = { ...marker(f), ...change };
    if (!Object.keys(change).length) delete completion.kind;
    reject(f, 'history', completion);
  });
  it.each(['kind', 'conversationId', 'turnId', 'observedCandidateId'])(
    'rejects marker %s getters',
    (key) => {
      const f = geminiFixedTextContractFixture();
      const getter = vi.fn(() => 'SYNTHETIC_PRIVATE_MARKER');
      const completion = Object.defineProperty(marker(f), key, { get: getter });
      reject(f, 'history', completion);
      expect(getter).not.toHaveBeenCalled();
    },
  );
  it.each([2, -1, 'true', 'false', '1', '0'])('rejects noncanonical saved29 %j', (saved) => {
    const f = geminiFixedTextContractFixture();
    f.response.fl[28] = saved;
    reject(f, 'history', marker(f));
  });
  it.each(['dense', 'sparse'] as const)(
    'accepts %s null omission with later saved metadata',
    (representation) => {
      const f = geminiFixedTextContractFixture();
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
      expect(assertGeminiTrialHistory(f.namespace, f.raw, f.approved, marker(f))).toBe(
        GEMINI_FIXED_TEXT_TRIAL_ANSWER,
      );
    },
  );
  it('does not invoke a saved29 getter', () => {
    const f = geminiFixedTextContractFixture();
    const getter = vi.fn(() => true);
    Object.defineProperty(f.response.fl, '28', { get: getter });
    reject(f, 'history', marker(f));
    expect(getter).not.toHaveBeenCalled();
  });
  it.each([
    (f: Fixture) => (f.identity.fl[0] = 'c_other'),
    (f: Fixture) => (f.identity.fl[1] = 'r_other'),
    (f: Fixture) => delete f.response.fl[3],
    (f: Fixture) => (f.response.fl[3] = ''),
    (f: Fixture) => (f.response.fl[3] = 'rc_other'),
    (f: Fixture) => delete f.candidate.fl[0],
    (f: Fixture) => (f.candidate.fl[0] = ''),
    (f: Fixture) => (f.candidate.fl[0] = 'rc_other'),
    (f: Fixture) => delete f.response.fl[9],
    (f: Fixture) => (f.response.fl[9] = false),
    (f: Fixture) => delete f.candidate.fl[8],
    (f: Fixture) => (f.status[0] = 1),
    (f: Fixture) => (f.status[0] = '2'),
    (f: Fixture) => (f.response.fl[10] = true),
    (f: Fixture) => (f.response.fl[15] = true),
    (f: Fixture) => (f.response.fl[23] = true),
    (f: Fixture) => (f.request.fl[4] = 'other-mode'),
    (f: Fixture) => (f.request.fl[8] = true),
    (f: Fixture) => (f.parents.fl[1] = 'r_parent'),
    (f: Fixture) => (f.query.fl[0] = 'SYNTHETIC_PRIVATE_MARKER'),
    (f: Fixture) => (f.query.fl[4] = ['synthetic-file']),
    (f: Fixture) => (f.request.fl[10] = ['synthetic-context']),
    (f: Fixture) => (f.text.fl[0] = GEMINI_FIXED_TEXT_TRIAL_ANSWER + '\n'),
    (f: Fixture) => f.raw.fl[0].push(f.turn),
    (f: Fixture) => f.response.fl[0].push(f.candidate),
    (f: Fixture) => (f.raw.fl[1] = 'next-page'),
    (f: Fixture) => (f.candidate.fl[12] = ['synthetic-rich']),
    (f: Fixture) => (f.response.fl[18] = ['synthetic-rich']),
    (f: Fixture) => (f.response.fl[99] = false),
    (f: Fixture) => (f.response.fl[8] = 'x'.repeat(33)),
    (f: Fixture) => (f.response.fl[14] = 'x'.repeat(161)),
    (f: Fixture) => (f.response.fl[29] = 1),
    (f: Fixture) => (f.response.fl[30] = 'x'.repeat(161)),
    (f: Fixture) => (f.response.fl[24] = 99),
    (f: Fixture) => (f.response.fl[25] = '1'),
  ])('retains saved identity/completion/scope/content/metadata refusals', (mutate) => {
    const f = geminiFixedTextContractFixture();
    mutate(f);
    reject(f, 'history', marker(f));
  });
});

describe('explicit exact saved history', () => {
  describe('saved automatic-display Boolean agreement', () => {
    it.each([
      [undefined, undefined],
      [undefined, false],
      [undefined, 0],
      [false, undefined],
      [false, false],
      [false, 0],
      [true, true],
      [true, 1],
    ] as const)('accepts matching private %j and saved %j states', (live, saved) => {
      const f = geminiFixedTextContractFixture();
      if (live !== undefined) Object.assign(f.completed, { Zzb: live });
      f.response.fl[28] = saved;
      expect(history(f)).toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    });
    it.each([
      [true, undefined],
      [true, false],
      [true, 0],
      [false, true],
      [undefined, 1],
    ] as const)('refuses mismatched private %j and saved %j states', (live, saved) => {
      const f = geminiFixedTextContractFixture();
      if (live !== undefined) Object.assign(f.completed, { Zzb: live });
      f.response.fl[28] = saved;
      reject(f, 'history');
    });
    it.each([2, -1, 'true', '1', 'false', '0', null])(
      'refuses a noncanonical saved Boolean %j even with a true receipt',
      (saved) => {
        const f = geminiFixedTextContractFixture();
        Object.assign(f.completed, { Zzb: true });
        f.response.fl[28] = saved;
        reject(f, 'history');
      },
    );
    it.each([1, 0, 'true', 'false', null])('refuses a non-Boolean private receipt %j', (live) => {
      const f = geminiFixedTextContractFixture();
      Object.assign(f.completed, { Zzb: live });
      f.response.fl[28] = true;
      reject(f, 'history');
    });
    it.each(['receipt', 'raw'] as const)('does not invoke a %s flag getter', (target) => {
      const f = geminiFixedTextContractFixture();
      const getter = vi.fn(() => true);
      if (target === 'receipt') Object.defineProperty(f.completed, 'Zzb', { get: getter });
      else {
        Object.assign(f.completed, { Zzb: true });
        Object.defineProperty(f.response.fl, '28', { get: getter });
      }
      reject(f, 'history');
      expect(getter).not.toHaveBeenCalled();
    });
  });

  it('accepts one explicit completed owned turn and no provider method calls', () => {
    const f = geminiFixedTextContractFixture();
    const calls = { ...f.calls };
    expect(history(f)).toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    expect(f.calls).toEqual(calls);
  });
  it.each([true, 1])(
    'supports explicitly present canonical final %j and declared zero booleans',
    (final) => {
      const f = geminiFixedTextContractFixture();
      f.response.fl[9] = final;
      for (const field of [11, 16, 24, 29]) f.response.fl[field - 1] = 0;
      for (const field of [6, 7, 13]) f.turn.fl[field - 1] = 0;
      f.request.fl[8] = 0;
      f.request.fl[11] = 0;
      expect(history(f)).toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    },
  );
  it.each([2, -1, 'true', '1', false, 0, undefined])(
    'refuses missing or noncanonical final %j',
    (final) => {
      const f = geminiFixedTextContractFixture();
      f.response.fl[9] = final;
      reject(f, 'history');
    },
  );
  it.each([1, true, 2, -1, 'false', '0'])(
    'refuses stopped or noncanonical stopped %j',
    (stopped) => {
      const f = geminiFixedTextContractFixture();
      f.response.fl[10] = stopped;
      reject(f, 'history');
    },
  );
  it('checks canonical saved privacy booleans against the exact captured setting', () => {
    const f = geminiFixedTextContractFixture();
    Object.assign(f.approved, { isPersonalContextDisabled: true });
    f.request.fl[8] = 1;
    expect(history(f)).toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    f.request.fl[8] = 2;
    reject(f, 'history');
  });
  it.each([
    (f: Fixture) => (f.identity.fl[0] = 'c_50'),
    (f: Fixture) => (f.identity.fl[1] = 'r_50'),
    (f: Fixture) => (f.candidate.fl[0] = 'rc_50'),
    (f: Fixture) => (f.response.fl[3] = 'rc_50'),
    (f: Fixture) => (f.query.fl[0] = 'SYNTHETIC_PRIVATE_MARKER'),
    (f: Fixture) => (f.request.fl[4] = 'another-mode'),
    (f: Fixture) => (f.text.fl[0] = GEMINI_FIXED_TEXT_TRIAL_ANSWER + '\n'),
    (f: Fixture) => (f.parents.fl[1] = 'r_50'),
    (f: Fixture) => (f.parents.fl[2] = 'rc_50'),
    (f: Fixture) => (f.parents.fl[9] = 'another-version'),
    (f: Fixture) => Object.assign(f.completed, { answer: 'wrong' }),
  ])('rejects changed ownership, prompt, mode, parent or exact final text', (mutate) => {
    const f = geminiFixedTextContractFixture();
    mutate(f);
    reject(f, 'history');
  });
  it.each([
    (f: Fixture) => delete f.response.fl[3],
    (f: Fixture) => delete f.response.fl[9],
    (f: Fixture) => delete f.candidate.fl[8],
    (f: Fixture) => delete f.status[0],
    (f: Fixture) => (f.status[0] = 0),
    (f: Fixture) => (f.status[0] = 1),
    (f: Fixture) => (f.status[0] = 3),
    (f: Fixture) => (f.status[0] = '2'),
    (f: Fixture) => (f.response.fl[9] = false),
    (f: Fixture) => (f.response.fl[10] = true),
    (f: Fixture) => delete f.identity.fl[0],
    (f: Fixture) => delete f.identity.fl[1],
    (f: Fixture) => delete f.candidate.fl[0],
    (f: Fixture) => delete f.query.fl[0],
    (f: Fixture) => delete f.text.fl[0],
    (f: Fixture) => delete f.request.fl[4],
  ])('rejects absence/defaulted selection, final, completion or required content', (mutate) => {
    const f = geminiFixedTextContractFixture();
    mutate(f);
    reject(f, 'history');
  });
  it.each([
    (f: Fixture) => f.raw.fl[0].push(f.turn),
    (f: Fixture) => f.response.fl[0].push(f.candidate),
    (f: Fixture) => (f.raw.fl[1] = 'synthetic-next-page'),
    (f: Fixture) => (f.query.fl[4] = ['synthetic-upload']),
    (f: Fixture) => (f.query.fl[6] = []),
    (f: Fixture) => (f.request.fl[10] = ['synthetic-client-context']),
    (f: Fixture) => (f.request.fl[9] = 'synthetic-skill'),
    (f: Fixture) => (f.candidate.fl[12] = ['synthetic-rich']),
    (f: Fixture) => (f.response.fl[18] = ['synthetic-rich']),
    (f: Fixture) => (f.response.fl[4] = ['synthetic-source']),
    (f: Fixture) => (f.response.fl[15] = true),
    (f: Fixture) => (f.raw.fl[5] = 4),
    (f: Fixture) => (f.turn.fl[8] = ['synthetic-task']),
    (f: Fixture) => (f.candidate.fl[99] = 0),
  ])('rejects extra turns, paging, rich/media/context and unknown fields', (mutate) => {
    const f = geminiFixedTextContractFixture();
    mutate(f);
    reject(f, 'history');
  });
  it('supports only an exact single source-proved plain text QG/OG/GG branch', () => {
    const f = geminiFixedTextContractFixture();
    const plain = f.message('gH', { 3: GEMINI_FIXED_TEXT_TRIAL_ANSWER });
    const node = f.message('oH', { 2: plain });
    const structured = f.message('qH', { 1: [node] });
    f.response.fl[12] = [structured];
    expect(history(f)).toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    plain.fl[3] = ['synthetic-annotation'];
    reject(f, 'history');
  });
  it('supports declared empty source/context slots without interpreting unknown fields as empty', () => {
    const f = geminiFixedTextContractFixture();
    for (const field of [3, 5, 6, 12, 19, 28]) f.response.fl[field - 1] = [];
    for (const field of [16, 24, 29]) f.response.fl[field - 1] = false;
    f.query.fl[4] = [];
    f.request.fl[10] = [];
    f.candidate.fl[12] = f.message('$v', {});
    f.turn.fl[4] = f.message('ul', { 1: '47', 2: 49 });
    f.raw.fl[3] = f.wire({ 1: [], 3: [], 4: [] });
    f.raw.fl[4] = f.wire({ 1: 0 });
    expect(history(f)).toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    f.query.fl[99] = false;
    reject(f, 'history');
  });
  it('supports an explicitly empty structured-content list', () => {
    const f = geminiFixedTextContractFixture();
    f.response.fl[12] = [];
    expect(history(f)).toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
  });
  it('supports source-proved frozen repeated-list flags without accepting them on messages', () => {
    const f = geminiFixedTextContractFixture();
    Object.defineProperty(f.raw.fl[0], f.namespace.La, { value: 257 });
    Object.freeze(f.raw.fl[0]);
    expect(history(f)).toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    f.status[f.namespace.La as any] = 257;
    reject(f, 'history');
  });
  it('rejects unknown own properties and accessors on materialized message objects', () => {
    for (const accessor of [false, true]) {
      const f = geminiFixedTextContractFixture();
      const getter = vi.fn(() => 'SYNTHETIC_PRIVATE_MARKER');
      Object.defineProperty(
        f.raw,
        'privateExtra',
        accessor ? { get: getter } : { value: undefined },
      );
      reject(f, 'history');
      expect(getter).not.toHaveBeenCalled();
    }
  });
  it('checks processed final metadata by precise source enum maps, without a model alias', () => {
    const f = geminiFixedTextContractFixture();
    Object.assign(f.completed, {
      Eka: 'synthetic-server-choice',
      tZa: 'MODE_CATEGORY_FAST',
      thinkingLevel: 'THINKING_LEVEL_STANDARD',
      Cq: 'synthetic-route',
      Hj: 'synthetic-effort',
      regionCode: 'ZZ',
    });
    Object.assign(f.response.fl, {
      8: 'ZZ',
      14: 'synthetic-server-choice',
      24: 1,
      25: 0,
      29: 'synthetic-route',
      30: 'synthetic-effort',
    });
    expect(history(f)).toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    f.response.fl[24] = 99;
    reject(f, 'history');
  });
  it.each([
    (f: Fixture) => Object.setPrototypeOf(f.raw, Object.prototype),
    (f: Fixture) => Object.setPrototypeOf(f.turn, f.namespace.AF.prototype),
    (f: Fixture) => (f.candidate.fl[8] = { fl: [2] }),
    (f: Fixture) => (f.candidate.fl[8] = f.candidate.fl),
    (f: Fixture) => (f.raw.fl.length = 1025),
    (f: Fixture) => (f.status.length = 1025),
    (f: Fixture) => (f.status[f.namespace.La as any] = 128),
    (f: Fixture) => (f.status[f.namespace.La as any] = 256),
    (f: Fixture) => (f.status[f.namespace.La as any] = 1),
    (f: Fixture) => (f.status[f.namespace.La as any] = NaN),
    (f: Fixture) => (f.status[f.namespace.La as any] = 1.5),
    (f: Fixture) => (f.status[f.namespace.La as any] = 0x1000000),
    (f: Fixture) => Object.assign(f.status, { private: 'SYNTHETIC_PRIVATE_MARKER' }),
  ])('rejects unsupported prototypes, representation, cycles, bounds and flags', (mutate) => {
    const f = geminiFixedTextContractFixture();
    mutate(f);
    reject(f, 'history');
  });
  it('reads canonical sparse status/selection/final without default getters', () => {
    const f = geminiFixedTextContractFixture();
    f.candidate.fl[8] = [{ 1: 2 }];
    f.response.fl = [[f.candidate], { 4: f.completed.candidateId, 10: true }];
    f.response.fl[f.namespace.La] = 2144 | (2 << 14);
    expect(history(f)).toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
  });
  it.each([
    (f: Fixture) => f.response.fl.push({ 4: f.completed.candidateId }),
    (f: Fixture) => (f.candidate.fl[8] = [2, { 1: 2 }]),
    (f: Fixture) => (f.candidate.fl[8] = [{ '01': 2 }]),
    (f: Fixture) => (f.candidate.fl[8] = [Object.create({ 1: 2 })]),
    (f: Fixture) => (f.candidate.fl[8] = [{ 1: 2, 3: 'synthetic-extra' }]),
    (f: Fixture) => {
      f.status[f.namespace.La as any] = 3 << 14;
    },
  ])(
    'rejects dense/sparse ambiguity, inherited/noncanonical tail keys and contradictory pivots',
    (mutate) => {
      const f = geminiFixedTextContractFixture();
      mutate(f);
      reject(f, 'history');
    },
  );
  it('rejects accessors at every wire boundary without invoking them', () => {
    for (const target of [
      'root',
      'array',
      'status',
      'tail',
      'flags',
      'namespace',
      'completed',
    ] as const) {
      const f = geminiFixedTextContractFixture();
      const getter = vi.fn(() => 'SYNTHETIC_PRIVATE_MARKER');
      if (target === 'root') Object.defineProperty(f.raw, 'fl', { get: getter });
      else if (target === 'array') Object.defineProperty(f.text.fl, '0', { get: getter });
      else if (target === 'status') Object.defineProperty(f.status, '0', { get: getter });
      else if (target === 'flags') Object.defineProperty(f.status, f.namespace.La, { get: getter });
      else if (target === 'tail') {
        const tail = Object.defineProperty({}, '1', { get: getter });
        f.candidate.fl[8] = [tail];
      } else if (target === 'namespace') Object.defineProperty(f.namespace, 'La', { get: getter });
      else Object.defineProperty(f.completed, 'answer', { get: getter });
      reject(f, 'history');
      expect(getter).not.toHaveBeenCalled();
    }
  });
});

describe('source-owned live kF trial frame', () => {
  const read = (f: Fixture) => {
    expect(fixedContract.readGeminiTrialRawFrame).toBeTypeOf('function');
    return fixedContract.readGeminiTrialRawFrame(f.namespace, f.live);
  };
  const refuse = (f: Fixture) => {
    const calls = { ...f.calls };
    expect(() => read(f)).toThrowError(
      expect.objectContaining({
        message: 'Gemini trial contract failed.',
        cause: expect.stringMatching(/^response-/),
      }),
    );
    expect(f.calls).toEqual(calls);
  };

  it.each<[string, (f: Fixture) => void]>([
    ['response-shape', (f) => Object.setPrototypeOf(f.live, f.namespace.H5c.prototype)],
    ['response-shape', (f) => (f.live.fl.length = 1025)],
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
    ['response-flags', (f) => (f.live.fl[14] = 'true')],
    ['response-flags', (f) => (f.live.fl[15] = true)],
    ['response-flags', (f) => (f.live.fl[62] = 1)],
    ['response-lists', (f) => (f.live.fl[12] = ['SYNTHETIC_PRIVATE_MARKER'])],
    ['response-raw-continuation', (f) => (f.live.fl[45] = true)],
    ['response-raw-disconnect', (f) => (f.live.fl[51] = new f.namespace.l(f.wire({ 1: 1 })))],
    ['response-metadata', (f) => (f.live.fl[39] = true)],
    ['response-metadata', (f) => (f.live.fl[54] = f.wire({ 2: 99 }))],
    ['response-identity', (f) => (f.identity.fl[0] = 'invalid identity')],
    ['response-candidate-lists', (f) => f.live.fl[4].push(f.candidate)],
    ['response-answer', (f) => (f.candidate.fl[0] = '')],
    ['response-candidate-extra', (f) => (f.candidate.fl[12] = f.message('$v', { 1: 1 }))],
    ['response-final-metadata', (f) => (f.status[0] = 3)],
    ['response-content', (f) => (f.text.fl[0] = 'SYNTHETIC_PRIVATE_MARKER')],
    ['response-content', (f) => (f.live.fl[26] = [f.message('qH', { 2: 1 })])],
    ['response-completion', (f) => delete f.candidate.fl[8]],
    ['response-completion', (f) => delete f.identity.fl[0]],
  ])('classifies the existing raw refusal as finite %s', (cause, mutate) => {
    const f = geminiFixedTextContractFixture();
    mutate(f);
    const calls = { ...f.calls };
    expect(() => read(f)).toThrowError(
      expect.objectContaining({ message: 'Gemini trial contract failed.', cause }),
    );
    expect(f.calls).toEqual(calls);
  });

  it.each<[number, string]>([
    [11, 'response-raw-title'],
    [23, 'response-raw-attribution'],
    [26, 'response-raw-history'],
    [28, 'response-raw-quota'],
    [37, 'response-raw-heartbeat'],
    [48, 'response-raw-enum'],
    [64, 'response-raw-enum'],
    [7, 'response-raw-field-7'],
    [8, 'response-raw-field-8'],
    [10, 'response-raw-field-10'],
    [25, 'response-raw-field-25'],
    [30, 'response-raw-field-30'],
    [33, 'response-raw-field-33'],
    [35, 'response-raw-field-35'],
    [36, 'response-raw-field-36'],
    [41, 'response-raw-field-41'],
    [47, 'response-raw-field-47'],
    [49, 'response-raw-field-49'],
    [53, 'response-raw-field-53'],
    [57, 'response-raw-field-57'],
    [1, 'response-raw-field-1'],
    [3, 'response-raw-field-3'],
    [4, 'response-raw-field-4'],
    [14, 'response-raw-field-14'],
    [17, 'response-raw-field-17'],
    [19, 'response-raw-field-19'],
    [22, 'response-raw-field-22'],
    [29, 'response-raw-field-29'],
    [31, 'response-raw-field-31'],
    [38, 'response-raw-field-38'],
    [39, 'response-raw-field-39'],
    [42, 'response-raw-field-42'],
    [45, 'response-raw-field-45'],
    [51, 'response-raw-field-51'],
    [54, 'response-raw-field-54'],
    [81, 'response-raw-fields'],
  ])('classifies only rejected local field %s without reading its raw value', (field, cause) => {
    const f = geminiFixedTextContractFixture();
    const inspect = vi.fn(() => {
      throw new Error('SYNTHETIC_PRIVATE_MARKER');
    });
    const value = new Proxy(
      {},
      {
        get: inspect,
        getPrototypeOf: inspect,
        getOwnPropertyDescriptor: inspect,
        ownKeys: inspect,
      },
    );
    f.live.fl = [{ 2: f.identity, 5: [f.candidate], 15: true, [field]: value }];
    Object.defineProperty(f.live.fl, f.namespace.La, { value: 64 + (1 << 14) });
    const calls = { ...f.calls };
    const keys = vi.spyOn(Map.prototype, 'keys');
    const get = vi.spyOn(Map.prototype, 'get');
    let failure: unknown;
    let keyReads = 0,
      valueReads = 0;
    try {
      read(f);
    } catch (error) {
      failure = error;
    } finally {
      keyReads = keys.mock.calls.length;
      valueReads = get.mock.calls.length;
      keys.mockRestore();
      get.mockRestore();
    }
    expect(failure).toMatchObject({ message: 'Gemini trial contract failed.', cause });
    expect(keyReads).toBe(1);
    expect(valueReads).toBe(0);
    expect(inspect).not.toHaveBeenCalled();
    expect(f.calls).toEqual(calls);
  });

  it.each([7, 8, 10, 25, 30, 33, 35, 36, 41, 47, 49, 53, 57])(
    'refuses present supplementary field %s regardless of value without new Map reads',
    (field) => {
      for (const value of [
        false,
        true,
        0,
        1,
        '',
        'SYNTHETIC_PRIVATE_MARKER',
        [],
        [null],
        [{}],
        {},
        Object.create(null),
      ]) {
        const f = geminiFixedTextContractFixture();
        f.live.fl = [{ 2: f.identity, 5: [f.candidate], 15: true, [field]: value }];
        Object.defineProperty(f.live.fl, f.namespace.La, { value: 64 + (1 << 14) });
        const keys = vi.spyOn(Map.prototype, 'keys');
        const get = vi.spyOn(Map.prototype, 'get');
        let failure: unknown;
        let keyReads = 0,
          valueReads = 0;
        try {
          read(f);
        } catch (error) {
          failure = error;
        } finally {
          keyReads = keys.mock.calls.length;
          valueReads = get.mock.calls.length;
          keys.mockRestore();
          get.mockRestore();
        }
        expect(failure).toMatchObject({
          message: 'Gemini trial contract failed.',
          cause: `response-raw-field-${field}`,
        });
        expect(keyReads).toBe(1);
        expect(valueReads).toBe(0);
        expect(JSON.stringify(failure)).not.toContain('SYNTHETIC_PRIVATE_MARKER');
      }
    },
  );

  it.each([
    ['dense', [21, 11], 'response-raw-title'],
    ['dense', [11, 6], 'response-raw-title'],
    ['dense', [21, 17], 'response-raw-field-17'],
    ['sparse', [21, 11], 'response-raw-title'],
    ['sparse', [81, 65], 'response-raw-fields'],
    ['sparse', [65, 51], 'response-raw-field-51'],
    ['mixed', [65, 11], 'response-raw-title'],
    ['dense', [51, 17], 'response-raw-field-17'],
    ['dense', [17, 1], 'response-raw-field-1'],
    ['sparse', [54, 3], 'response-raw-field-3'],
    ['sparse', [81, 54], 'response-raw-field-54'],
    ['dense', [57, 6], 'response-raw-field-57'],
    ['sparse', [57, 6], 'response-raw-field-57'],
    ['sparse', [81, 57], 'response-raw-field-57'],
    ['sparse', [81, 6], 'response-raw-fields'],
    ['sparse', [57, 3], 'response-raw-field-3'],
  ] as const)(
    'reports only the original first rejected key in %s order with multiple unsupported fields %s',
    (shape, fields, cause) => {
      const f = geminiFixedTextContractFixture();
      if (shape === 'dense') {
        for (const field of fields) f.live.fl[field - 1] = 'SYNTHETIC_PRIVATE_MARKER';
      } else if (shape === 'sparse') {
        const tail: Record<number, unknown> = { 2: f.identity, 5: [f.candidate], 15: true };
        for (const field of fields) tail[field] = 'SYNTHETIC_PRIVATE_MARKER';
        f.live.fl = [tail];
        Object.defineProperty(f.live.fl, f.namespace.La, { value: 64 + (1 << 14) });
      } else {
        f.live.fl[10] = 'SYNTHETIC_PRIVATE_MARKER';
        f.live.fl[20] = { 65: 'SYNTHETIC_PRIVATE_MARKER' };
        f.live.fl[f.namespace.La] = 64 + (21 << 14);
      }
      const calls = { ...f.calls };
      expect(() => read(f)).toThrowError(expect.objectContaining({ cause }));
      expect(f.calls).toEqual(calls);
    },
  );

  it.each(['partial', 'final'] as const)(
    'admits bounded location6 on untouched %s JSON2146 dense/sparse ingress without exporting it',
    (kind) => {
      for (const location of [
        undefined,
        null,
        [],
        [null],
        ['', '', false, null, ''],
        ['SYNTHETIC_PRIVATE_LOCATION', 'SYNTHETIC_PRIVATE_DESCRIPTION', true, null, ''],
        [{ 1: 'SYNTHETIC_PRIVATE_LOCATION', 2: 'unknown-description', 3: 1, 5: '' }],
      ]) {
        for (const sparse of [false, true]) {
          const f = geminiFixedTextContractFixture();
          const fields = {
            2: [f.completed.conversationId, f.completed.turnId],
            5: [
              [
                f.completed.candidateId,
                [kind === 'final' ? f.completed.answer : 'CROSSCHECK'],
                null,
                null,
                null,
                null,
                null,
                null,
                [kind === 'final' ? 2 : 1],
              ],
            ],
            6: location,
            15: kind === 'final',
          };
          f.live.fl = JSON.parse(JSON.stringify(sparse ? [fields] : f.wire(fields)));
          Object.defineProperty(f.live.fl, f.namespace.La, {
            value: 2146 | (sparse ? 1 << 14 : 0),
          });
          const before = Object.getOwnPropertyDescriptors(f.live.fl);
          const serialized = JSON.stringify(f.live);
          const calls = { ...f.calls };
          const observed = {
            conversationId: f.completed.conversationId,
            turnId: f.completed.turnId,
            candidateId: f.completed.candidateId,
          };
          const result = read(f);
          expect(result).toEqual(
            kind === 'final' ? { ...observed, completed: f.completed } : observed,
          );
          expect(JSON.stringify(result)).not.toContain('SYNTHETIC_PRIVATE');
          expect(Object.getOwnPropertyDescriptors(f.live.fl)).toEqual(before);
          expect(JSON.stringify(f.live)).toBe(serialized);
          expect(f.calls).toEqual(calls);
        }
      }
    },
  );

  it.each([
    'scalar',
    'holder',
    'nested',
    'tag4',
    'unknown',
    'string1',
    'string2',
    'boolean',
    'image',
    'image-object',
    'boxed',
    'accessor',
    'tail-accessor',
    'duplicate',
    'key',
    'pivot',
    'flags',
    'prototype',
    'length',
    'proxy',
    'string1-length',
    'string2-length',
  ] as const)('refuses malformed location6 %s with a content-free W6', (kind) => {
    const f = geminiFixedTextContractFixture();
    const getter = vi.fn(() => {
      throw new Error('SYNTHETIC_PRIVATE_LOCATION');
    });
    const value: any[] = ['SYNTHETIC_PRIVATE_LOCATION', '', false, null, ''];
    f.live.fl[5] = value;
    if (kind === 'scalar') f.live.fl[5] = 'SYNTHETIC_PRIVATE_LOCATION';
    if (kind === 'holder') f.live.fl[5] = new f.namespace.l([]);
    if (kind === 'nested') value[0] = [];
    if (kind === 'tag4') value[3] = true;
    if (kind === 'unknown') value.push(true);
    if (kind === 'string1') value[0] = 1;
    if (kind === 'string2') value[1] = false;
    if (kind === 'boolean') value[2] = 'true';
    if (kind === 'image') value[4] = 'https://synthetic.invalid/SYNTHETIC_PRIVATE_LOCATION';
    if (kind === 'image-object') f.live.fl[5] = [{ 5: {} }];
    if (kind === 'boxed') value[0] = new String('');
    if (kind === 'accessor') Object.defineProperty(value, '0', { get: getter });
    if (kind === 'tail-accessor')
      f.live.fl[5] = [
        {
          get 1() {
            return getter();
          },
        },
      ];
    if (kind === 'duplicate') value.push({ 1: '' });
    if (kind === 'key') f.live.fl[5] = [{ '01': '' }];
    if (kind === 'pivot') Object.defineProperty(value, f.namespace.La, { value: 2 << 14 });
    if (kind === 'flags') Object.defineProperty(value, f.namespace.La, { value: 128 });
    if (kind === 'prototype') Object.setPrototypeOf(value, null);
    if (kind === 'length') value.length = 1025;
    if (kind === 'proxy') f.live.fl[5] = new Proxy([], { getPrototypeOf: () => null });
    if (kind === 'string1-length') value[0] = 'x'.repeat(1048577);
    if (kind === 'string2-length') value[1] = 'x'.repeat(1048577);
    const calls = { ...f.calls };
    let failure: unknown;
    try {
      read(f);
    } catch (error) {
      failure = error;
    }
    expect(failure).toMatchObject({
      message: 'Gemini trial contract failed.',
      cause: 'response-raw-field-6',
    });
    expect(JSON.stringify(failure)).not.toContain('SYNTHETIC_PRIVATE');
    expect(getter).not.toHaveBeenCalled();
    expect(f.calls).toEqual(calls);
  });

  it.each([false, true, 0, 1])(
    'accepts only canonical location6 Boolean %s and bounded strings',
    (value) => {
      const f = geminiFixedTextContractFixture();
      f.live.fl[5] = ['x'.repeat(1048576), 'x'.repeat(1048576), value, null, ''];
      expect(read(f).completed).toEqual(f.completed);
    },
  );

  it.each(['false', 'true', -1, 2, NaN, Infinity, {}, [], new Boolean(false)])(
    'refuses noncanonical location6 Boolean %j',
    (value) => {
      const f = geminiFixedTextContractFixture();
      f.live.fl[5] = [null, null, value, null, ''];
      expect(() => read(f)).toThrowError(
        expect.objectContaining({ cause: 'response-raw-field-6' }),
      );
    },
  );

  it.each([1, 128, 256, '64', -1, NaN, 0x1000000])(
    'refuses unsupported location6 flags %j',
    (flags) => {
      const f = geminiFixedTextContractFixture();
      const value: unknown[] = [];
      Object.defineProperty(value, f.namespace.La, { value: flags });
      f.live.fl[5] = value;
      expect(() => read(f)).toThrowError(
        expect.objectContaining({ cause: 'response-raw-field-6' }),
      );
    },
  );

  it('validates unopened location6 without locating a private typed holder', () => {
    const f = geminiFixedTextContractFixture();
    const getter = vi.fn(() => {
      throw new Error('SYNTHETIC_PRIVATE_LOCATION');
    });
    Object.defineProperty(f.namespace, 'W4c', { get: getter });
    f.live.fl[5] = [{ 3: true }];
    expect(read(f).completed).toEqual(f.completed);
    expect(getter).not.toHaveBeenCalled();
  });

  it.each([7, 11, 81])(
    'rejects co-present unknown%s before inspecting admitted6 values',
    (field) => {
      const f = geminiFixedTextContractFixture();
      const inspect = vi.fn(() => {
        throw new Error('SYNTHETIC_PRIVATE_LOCATION');
      });
      const location = new Proxy([], {
        getPrototypeOf: inspect,
        getOwnPropertyDescriptor: inspect,
        ownKeys: inspect,
      });
      f.live.fl = [{ 2: f.identity, 5: [f.candidate], 6: location, 15: true, [field]: true }];
      Object.defineProperty(f.live.fl, f.namespace.La, { value: 64 + (1 << 14) });
      const get = vi.spyOn(Map.prototype, 'get');
      try {
        expect(() => read(f)).toThrowError(
          expect.objectContaining({
            cause:
              field === 11
                ? 'response-raw-title'
                : field === 81
                  ? 'response-raw-fields'
                  : 'response-raw-field-7',
          }),
        );
        expect(get).not.toHaveBeenCalled();
        expect(inspect).not.toHaveBeenCalled();
      } finally {
        get.mockRestore();
      }
    },
  );

  it.each(['partial', 'final'] as const)(
    'accepts only empty client65 on untouched %s JSON2146/plain-array ingress',
    (kind) => {
      for (const value of [undefined, null, [], [null], [[]], [{}], [{ 1: [] }]]) {
        for (const sparse of [false, true]) {
          const f = geminiFixedTextContractFixture();
          const fields = {
            2: [f.completed.conversationId, f.completed.turnId],
            5: [
              [
                f.completed.candidateId,
                [kind === 'final' ? f.completed.answer : 'CROSSCHECK'],
                null,
                null,
                null,
                null,
                null,
                null,
                [kind === 'final' ? 2 : 1],
              ],
            ],
            15: kind === 'final',
            65: value,
          };
          f.live.fl = JSON.parse(JSON.stringify(sparse ? [fields] : f.wire(fields)));
          Object.defineProperty(f.live.fl, f.namespace.La, {
            value: 2146 | (sparse ? 1 << 14 : 0),
          });
          const before = Object.getOwnPropertyDescriptors(f.live.fl);
          const serialized = JSON.stringify(f.live);
          const calls = { ...f.calls };
          const observed = {
            conversationId: f.completed.conversationId,
            turnId: f.completed.turnId,
            candidateId: f.completed.candidateId,
          };
          expect(read(f)).toEqual(
            kind === 'final' ? { ...observed, completed: f.completed } : observed,
          );
          expect(Object.getOwnPropertyDescriptors(f.live.fl)).toEqual(before);
          expect(JSON.stringify(f.live)).toBe(serialized);
          expect(f.calls).toEqual(calls);
        }
      }
    },
  );

  it.each([
    'scalar',
    'holder',
    'nonempty',
    'extra',
    'accessor',
    'duplicate',
    'key',
    'pivot',
    'flags',
    'prototype',
    'length',
    'repeated-hole',
  ] as const)('refuses malformed client65 %s without SDK calls or getter execution', (kind) => {
    const f = geminiFixedTextContractFixture();
    const getter = vi.fn(() => []);
    const value: any[] = [[]];
    f.live.fl[64] = value;
    if (kind === 'scalar') f.live.fl[64] = true;
    if (kind === 'holder') f.live.fl[64] = new f.namespace.l([]);
    if (kind === 'nonempty') value[0] = [[]];
    if (kind === 'extra') value[1] = [];
    if (kind === 'accessor') Object.defineProperty(value, '0', { get: getter });
    if (kind === 'duplicate') value.push({ 1: [] });
    if (kind === 'key') value[0] = { '01': [] };
    if (kind === 'pivot') Object.defineProperty(value, f.namespace.La, { value: 2 << 14 });
    if (kind === 'flags') Object.defineProperty(value, f.namespace.La, { value: 128 });
    if (kind === 'prototype') Object.setPrototypeOf(value, null);
    if (kind === 'length') value.length = 1025;
    if (kind === 'repeated-hole') value[0] = Array(1);
    expect(() => read(f)).toThrowError(expect.objectContaining({ cause: 'response-raw-client' }));
    expect(getter).not.toHaveBeenCalled();
  });

  it.each([
    'unknown',
    'flags',
    'routing',
    'rich',
    'media',
    'multiple',
    'status',
    'identity',
    'prefix',
  ] as const)('empty client65 cannot hide co-present %s', (kind) => {
    const f = geminiFixedTextContractFixture();
    f.live.fl[64] = [[]];
    if (kind === 'unknown') f.live.fl[80] = true;
    if (kind === 'flags') f.live.fl[43] = 'true';
    if (kind === 'routing') f.live.fl[20] = [];
    if (kind === 'rich') f.candidate.fl[12] = [1];
    if (kind === 'media') f.live.fl[11] = [[]];
    if (kind === 'multiple') f.live.fl[4].push(f.candidate);
    if (kind === 'status') delete f.candidate.fl[8];
    if (kind === 'identity') delete f.identity.fl[0];
    if (kind === 'prefix') f.text.fl[0] = 'CROSSCHECK';
    refuse(f);
  });

  it('empty client65 alone cannot establish completion', () => {
    const f = geminiFixedTextContractFixture();
    f.live.fl = f.wire({ 65: [[]] });
    Object.defineProperty(f.live.fl, f.namespace.La, { value: 2146 });
    expect(read(f)).toEqual({});
    f.live.fl[14] = true;
    expect(() => read(f)).toThrowError(expect.objectContaining({ cause: 'response-completion' }));
  });

  it('reads only actual live identities and explicit completion without constructors or SDK methods', () => {
    const f = geminiFixedTextContractFixture(),
      calls = { ...f.calls };
    expect(read(f)).toEqual({
      conversationId: f.completed.conversationId,
      turnId: f.completed.turnId,
      candidateId: f.completed.candidateId,
      completed: f.completed,
    });
    expect(f.calls).toEqual(calls);
  });

  it.each([
    ['partial', 'absent', undefined],
    ['final', 'absent', undefined],
    ['partial', 'empty', undefined],
    ['final', 'empty', undefined],
    ['partial', 'empty', ''],
    ['final', 'empty', ''],
    ['partial', 'empty', 'SYNTHETIC_PRIVATE_SUPPLEMENT'],
    ['final', 'empty', 'SYNTHETIC_PRIVATE_SUPPLEMENT'],
  ] as const)(
    'reads untouched JSON-ingress nested arrays on %s with %s media12 and string18 %s without SDK calls',
    (kind, media, supplement) => {
      const f = geminiFixedTextContractFixture();
      const text = kind === 'final' ? f.completed.answer : 'CROSSCHECK';
      f.live.fl = JSON.parse(
        JSON.stringify(
          f.wire({
            2: f.wire({ 1: f.completed.conversationId, 2: f.completed.turnId }),
            5: [
              f.wire({
                1: f.completed.candidateId,
                2: f.wire({ 1: text }),
                9: f.wire({ 1: kind === 'final' ? 2 : 1 }),
              }),
            ],
            12: media === 'empty' ? [] : undefined,
            15: kind === 'final',
            18: supplement,
          }),
        ),
      );
      Object.defineProperty(f.live.fl, f.namespace.La, { value: 2146 });
      const calls = { ...f.calls };
      const observed = {
        conversationId: f.completed.conversationId,
        turnId: f.completed.turnId,
        candidateId: f.completed.candidateId,
      };
      expect(read(f)).toEqual(
        kind === 'final' ? { ...observed, completed: f.completed } : observed,
      );
      expect(f.calls).toEqual(calls);
    },
  );

  it.each(['partial', 'final'] as const)(
    'accepts canonical Boolean44 on untouched %s JSON-ingress frames without exporting or mutating it',
    (kind) => {
      for (const value of [undefined, null, false, true, 0, 1]) {
        for (const shape of ['dense', 'sparse'] as const) {
          const f = geminiFixedTextContractFixture();
          const fields = {
            2: f.wire({ 1: f.completed.conversationId, 2: f.completed.turnId }),
            5: [
              f.wire({
                1: f.completed.candidateId,
                2: f.wire({ 1: kind === 'final' ? f.completed.answer : 'CROSSCHECK' }),
                9: f.wire({ 1: kind === 'final' ? 2 : 1 }),
              }),
            ],
            15: kind === 'final',
            44: value,
          };
          f.live.fl = JSON.parse(JSON.stringify(shape === 'dense' ? f.wire(fields) : [fields]));
          Object.defineProperty(f.live.fl, f.namespace.La, {
            value: 2146 | (shape === 'sparse' ? 1 << 14 : 0),
          });
          const before = Object.getOwnPropertyDescriptors(f.live.fl);
          const calls = { ...f.calls };
          const observed = {
            conversationId: f.completed.conversationId,
            turnId: f.completed.turnId,
            candidateId: f.completed.candidateId,
          };
          expect(read(f)).toEqual(
            kind === 'final' ? { ...observed, completed: f.completed } : observed,
          );
          expect(Object.getOwnPropertyDescriptors(f.live.fl)).toEqual(before);
          expect(f.calls).toEqual(calls);
        }
      }
    },
  );

  it.each([
    'true',
    'false',
    '0',
    '1',
    2,
    -1,
    NaN,
    Infinity,
    {},
    [],
    [true],
    Array(1),
    new Boolean(true),
  ])('refuses noncanonical Boolean44 %j at the flags boundary', (value) => {
    const f = geminiFixedTextContractFixture();
    for (const shape of ['dense', 'sparse'] as const) {
      if (shape === 'dense') {
        f.live.fl[43] = value;
        f.live.fl[62] = 0;
      } else {
        f.live.fl = [{ 2: f.identity, 5: [f.candidate], 15: true, 44: value }];
        Object.defineProperty(f.live.fl, f.namespace.La, { value: 2146 | (1 << 14) });
      }
      expect(() => read(f)).toThrowError(expect.objectContaining({ cause: 'response-flags' }));
    }
  });

  it.each(['message', 'accessor', 'tail-accessor', 'duplicate', 'tail-key', 'pivot'] as const)(
    'refuses malformed Boolean44 %s without invoking getters or SDK methods',
    (kind) => {
      const f = geminiFixedTextContractFixture();
      const getter = vi.fn(() => true);
      f.live.fl[43] = true;
      if (kind === 'message') f.live.fl[43] = f.message('IF', { 1: true });
      if (kind === 'accessor') Object.defineProperty(f.live.fl, '43', { get: getter });
      if (kind === 'tail-accessor') {
        f.live.fl = [Object.defineProperty({}, '44', { get: getter })];
        Object.defineProperty(f.live.fl, f.namespace.La, { value: 2146 });
      }
      if (kind === 'duplicate') f.live.fl.push({ 44: true });
      if (kind === 'tail-key') f.live.fl.push({ '044': true });
      if (kind === 'pivot') f.live.fl[f.namespace.La] = 2146 | (2 << 14);
      const calls = { ...f.calls };
      refuse(f);
      expect(getter).not.toHaveBeenCalled();
      expect(f.calls).toEqual(calls);
    },
  );

  it.each([
    'unknown',
    'flags',
    'routing',
    'error',
    'rich',
    'media',
    'multiple',
    'status',
    'identity',
    'prefix',
  ] as const)('does not let canonical Boolean44 hide co-present %s', (kind) => {
    const f = geminiFixedTextContractFixture();
    f.live.fl[43] = true;
    if (kind === 'unknown') f.live.fl[80] = true;
    if (kind === 'flags') f.live.fl[23] = 'true';
    if (kind === 'routing') f.live.fl[20] = [];
    if (kind === 'error') f.live.fl[15] = true;
    if (kind === 'rich') f.candidate.fl[12] = f.message('$v', { 1: 1 });
    if (kind === 'media') f.live.fl[11] = [f.wire({ 1: 'SYNTHETIC_PRIVATE_MARKER' })];
    if (kind === 'multiple') f.live.fl[4].push(f.candidate);
    if (kind === 'status') delete f.candidate.fl[8];
    if (kind === 'identity') delete f.identity.fl[0];
    if (kind === 'prefix') f.text.fl[0] = 'CROSSCHECK';
    refuse(f);
  });

  it('bounds string18 without exporting it or invoking SDK methods', () => {
    const f = geminiFixedTextContractFixture();
    f.live.fl[17] = 'SYNTHETIC_PRIVATE_SUPPLEMENT'.padEnd(1048576, 'x');
    const calls = { ...f.calls };
    const observed = read(f);
    expect(observed).toEqual({
      conversationId: f.completed.conversationId,
      turnId: f.completed.turnId,
      candidateId: f.completed.candidateId,
      completed: f.completed,
    });
    expect(JSON.stringify(observed)).not.toContain('SYNTHETIC_PRIVATE_SUPPLEMENT');
    expect(f.calls).toEqual(calls);
  });

  it.each([
    { kind: 'number', value: 18 },
    { kind: 'object', value: {} },
    { kind: 'array', value: [] },
    { kind: 'boxed string', value: new String('SYNTHETIC_PRIVATE_SUPPLEMENT') },
    { kind: 'oversize', value: 'x'.repeat(1048577) },
  ])('refuses noncanonical string18 $kind at the metadata boundary', ({ value }) => {
    const f = geminiFixedTextContractFixture();
    f.live.fl[17] = value;
    f.live.fl[62] = 0;
    const calls = { ...f.calls };
    expect(() => read(f)).toThrowError(expect.objectContaining({ cause: 'response-metadata' }));
    expect(f.calls).toEqual(calls);
  });

  it.each(['dense', 'sparse'] as const)(
    'keeps routing21 refused beside empty/nonempty string18 in both %s construction orders',
    (shape) => {
      for (const supplement of ['', 'SYNTHETIC_PRIVATE_SUPPLEMENT']) {
        for (const fields of [
          [18, 21],
          [21, 18],
        ]) {
          const f = geminiFixedTextContractFixture();
          const values: Record<number, unknown> = { 18: supplement, 21: [] };
          if (shape === 'dense') {
            for (const field of fields) f.live.fl[field - 1] = values[field];
          } else {
            const tail: Record<number, unknown> = { 2: f.identity, 5: [f.candidate], 15: true };
            for (const field of fields) tail[field] = values[field];
            f.live.fl = [tail];
            Object.defineProperty(f.live.fl, f.namespace.La, { value: 64 + (1 << 14) });
          }
          const calls = { ...f.calls };
          expect(() => read(f)).toThrowError(
            expect.objectContaining({ cause: 'response-raw-routing' }),
          );
          expect(f.calls).toEqual(calls);
        }
      }
    },
  );

  it.each(['unknown', 'rich', 'error', 'media', 'multiple'] as const)(
    'does not let valid string18 hide co-present %s',
    (kind) => {
      const f = geminiFixedTextContractFixture();
      f.live.fl[17] = 'SYNTHETIC_PRIVATE_SUPPLEMENT';
      if (kind === 'unknown') f.live.fl[80] = 'SYNTHETIC_PRIVATE_MARKER';
      if (kind === 'rich') f.candidate.fl[12] = f.message('$v', { 1: 1 });
      if (kind === 'error') f.live.fl[15] = true;
      if (kind === 'media') f.live.fl[11] = [f.wire({ 1: 'SYNTHETIC_PRIVATE_MARKER' })];
      if (kind === 'multiple') f.live.fl[4].push(f.candidate);
      refuse(f);
    },
  );

  it('uses source-shaped sparse live tags rather than saved response tags', () => {
    const f = geminiFixedTextContractFixture();
    f.live.fl = [{ 2: f.identity, 5: [f.candidate], 15: 1 }];
    Object.defineProperty(f.live.fl, f.namespace.La, { value: 64 + (1 << 14) });
    expect(read(f).completed).toEqual(f.completed);
  });

  it.each(['absent', 'zero', 'partial', 'complete'] as const)(
    'keeps a %s partial status and prefix separate from finality',
    (kind) => {
      const f = geminiFixedTextContractFixture();
      f.live.fl[14] = false;
      f.text.fl[0] = 'CROSSCHECK';
      if (kind === 'absent') delete f.candidate.fl[8];
      else f.status[0] = kind === 'zero' ? 0 : kind === 'partial' ? 1 : 2;
      expect(read(f)).toEqual({
        conversationId: f.completed.conversationId,
        turnId: f.completed.turnId,
        candidateId: f.completed.candidateId,
      });
    },
  );

  it.each(['absent', 'empty'] as const)(
    'validates %s partial text without inventing an answer',
    (kind) => {
      const f = geminiFixedTextContractFixture();
      f.live.fl[14] = 0;
      if (kind === 'absent') delete f.candidate.fl[1];
      else f.text.fl[0] = '';
      expect(read(f)).not.toHaveProperty('completed');
    },
  );

  it('permits absent candidate and identity on nonterminal information without a positive witness', () => {
    const f = geminiFixedTextContractFixture();
    f.live.fl = [];
    Object.defineProperty(f.live.fl, f.namespace.La, { value: 64 });
    expect(read(f)).toEqual({});
  });

  it.each([
    'missing-final',
    'missing-candidate',
    'multiple',
    'missing-status',
    'status-zero',
    'status-partial',
    'status-unknown',
    'literal',
    'no-CID',
    'no-RID',
  ] as const)('never constructs a completed receipt from %s', (kind) => {
    const f = geminiFixedTextContractFixture();
    f.live.fl[11] = [];
    if (kind === 'missing-final') delete f.live.fl[14];
    if (kind === 'missing-candidate') delete f.live.fl[4];
    if (kind === 'multiple')
      f.live.fl[4].push(f.message('AF', { 1: 'rc_other', 2: f.text, 9: f.wire({ 1: 2 }) }));
    if (kind === 'missing-status') delete f.candidate.fl[8];
    if (kind === 'status-zero') f.status[0] = 0;
    if (kind === 'status-partial') f.status[0] = 1;
    if (kind === 'status-unknown') f.status[0] = 3;
    if (kind === 'literal') f.text.fl[0] = 'OTHER';
    if (kind === 'no-CID') delete f.identity.fl[0];
    if (kind === 'no-RID') delete f.identity.fl[1];
    if (kind === 'missing-final') expect(read(f)).not.toHaveProperty('completed');
    else refuse(f);
  });

  it.each(['prefix', 'candidate-id', 'status', 'rich', 'metadata'] as const)(
    'validates %s before returning from a partial frame',
    (kind) => {
      const f = geminiFixedTextContractFixture();
      f.live.fl[14] = false;
      if (kind === 'prefix') f.text.fl[0] = 'OTHER';
      if (kind === 'candidate-id') f.candidate.fl[0] = '';
      if (kind === 'status') f.status[0] = 3;
      if (kind === 'rich') f.candidate.fl[12] = f.message('$v', { 1: 'SYNTHETIC_PRIVATE_MARKER' });
      if (kind === 'metadata') {
        f.live.fl[39] = {};
        f.live.fl[62] = 0;
      }
      refuse(f);
    },
  );

  it.each([
    7, 8, 10, 11, 12, 17, 21, 23, 28, 30, 33, 35, 36, 37, 41, 42, 45, 49, 53, 57, 65, 999,
  ] as const)('refuses unsupported rich/context/heartbeat live field %s', (field) => {
    const f = geminiFixedTextContractFixture();
    f.live.fl[field - 1] = f.wire({ 1: 'SYNTHETIC_PRIVATE_MARKER' });
    refuse(f);
  });

  it('keeps an empty singular heartbeat37 outside admission even with empty media12', () => {
    const f = geminiFixedTextContractFixture();
    f.live.fl[11] = [];
    f.live.fl[36] = [];
    const calls = { ...f.calls };
    expect(() => read(f)).toThrowError(
      expect.objectContaining({ cause: 'response-raw-heartbeat' }),
    );
    expect(f.calls).toEqual(calls);
  });

  it.each([{}, ['SYNTHETIC_PRIVATE_MARKER'], Array(1)].map((media) => ({ media })))(
    'refuses nonempty or malformed raw media12 $media',
    ({ media }) => {
      const f = geminiFixedTextContractFixture();
      f.live.fl[11] = media;
      const calls = { ...f.calls };
      expect(() => read(f)).toThrowError(expect.objectContaining({ cause: 'response-lists' }));
      expect(f.calls).toEqual(calls);
    },
  );

  it.each([16, 32, 34, 50] as const)('refuses a true source-negative live flag %s', (field) => {
    const f = geminiFixedTextContractFixture();
    f.live.fl[field - 1] = true;
    refuse(f);
  });

  it.each([12, 13, 56] as const)('requires live repeated exclusion %s to be empty', (field) => {
    const f = geminiFixedTextContractFixture();
    f.live.fl[field - 1] = [f.wire({ 1: 'SYNTHETIC_PRIVATE_MARKER' })];
    refuse(f);
  });

  it.each(['partial', 'final'] as const)(
    'retains canonical Boolean24 and all false/empty exclusions on %s',
    (kind) => {
      const f = geminiFixedTextContractFixture();
      Object.assign(f.live.fl, { 12: [], 15: 0, 23: true, 31: false, 33: 0, 49: false, 55: [] });
      if (kind === 'partial') f.live.fl[14] = false;
      expect(read(f).completed).toEqual(kind === 'final' ? f.completed : undefined);
    },
  );

  it.each([2, 'true', {}, NaN] as const)('refuses noncanonical Boolean24 %j', (value) => {
    const f = geminiFixedTextContractFixture();
    f.live.fl[23] = value;
    f.live.fl[62] = 0;
    refuse(f);
  });

  it('keeps a null wire Boolean24 absent under the existing reader semantics', () => {
    const f = geminiFixedTextContractFixture();
    f.live.fl[23] = null;
    expect(read(f).completed).toEqual(f.completed);
  });

  it.each([1, 2, 3, '0', true] as const)('refuses unsupported session63 %j', (value) => {
    const f = geminiFixedTextContractFixture();
    f.live.fl[62] = value;
    refuse(f);
  });

  it('maps observed live metadata to private receipt fields and preserves saved equality', () => {
    const f = geminiFixedTextContractFixture();
    Object.assign(f.live.fl, { 8: 'ZZ', 39: 'routing', 57: 1, 58: 4, 59: 2, 60: 'cq', 61: 'hj' });
    const metadata = {
      Zzb: true,
      Eka: 'routing',
      regionCode: 'ZZ',
      tZa: 'MODE_CATEGORY_AUTO',
      thinkingLevel: 'THINKING_LEVEL_EXTENDED',
      Cq: 'cq',
      Hj: 'hj',
    };
    expect(read(f).completed).toEqual({ ...f.completed, ...metadata });
    Object.assign(f.response.fl, {
      8: 'ZZ',
      14: 'routing',
      28: true,
      24: 4,
      25: 2,
      29: 'cq',
      30: 'hj',
    });
    expect(assertGeminiTrialHistory(f.namespace, f.raw, f.approved, read(f).completed!)).toBe(
      GEMINI_FIXED_TEXT_TRIAL_ANSWER,
    );
    f.response.fl[28] = false;
    expect(() =>
      assertGeminiTrialHistory(f.namespace, f.raw, f.approved, read(f).completed!),
    ).toThrowError(expect.objectContaining({ cause: 'history' }));
  });

  it('supports only closed unopened55 fallback with source primary metadata precedence', () => {
    const f = geminiFixedTextContractFixture();
    f.live.fl[54] = f.wire({ 2: 4, 6: 2 });
    expect(read(f).completed).toEqual({
      ...f.completed,
      tZa: 'MODE_CATEGORY_AUTO',
      thinkingLevel: 'THINKING_LEVEL_EXTENDED',
    });
    f.live.fl[58] = 3;
    f.live.fl[59] = 1;
    expect(read(f).completed).toEqual({
      ...f.completed,
      tZa: 'MODE_CATEGORY_PRO',
      thinkingLevel: 'THINKING_LEVEL_STANDARD',
    });
    f.live.fl[58] = 0;
    f.live.fl[59] = 0;
    expect(read(f).completed).toEqual({
      ...f.completed,
      tZa: 'MODE_CATEGORY_AUTO',
      thinkingLevel: 'THINKING_LEVEL_EXTENDED',
    });
  });

  it.each(['cached55', 'extra55', 'bad55', 'cached-status', 'cached52'] as const)(
    'refuses unsupported private holder %s without guessing exports',
    (kind) => {
      const f = geminiFixedTextContractFixture();
      const privateHolder = new f.namespace.l(f.wire({ 2: 4, 6: 1 }));
      if (kind === 'cached55') f.live.fl[54] = privateHolder;
      if (kind === 'extra55') f.live.fl[54] = f.wire({ 1: [1], 2: 4 });
      if (kind === 'bad55') f.live.fl[54] = f.wire({ 2: 99 });
      if (kind === 'cached-status') f.candidate.fl[8] = privateHolder;
      if (kind === 'cached52') f.live.fl[51] = privateHolder;
      refuse(f);
    },
  );

  it.each([9, 40, 61, 62] as const)('bounds source string metadata %s', (field) => {
    const f = geminiFixedTextContractFixture();
    f.live.fl[field - 1] = 'x'.repeat(field === 9 ? 33 : 161);
    refuse(f);
  });

  it.each([58, 59, 60] as const)(
    'refuses malformed source numeric/Boolean metadata %s',
    (field) => {
      const f = geminiFixedTextContractFixture();
      f.live.fl[field - 1] = field === 58 ? 2 : 99;
      refuse(f);
    },
  );

  it('accepts only one source plain OG27 node agreeing with candidate text', () => {
    const f = geminiFixedTextContractFixture();
    f.live.fl[26] = [
      f.message('qH', {
        1: [f.message('oH', { 2: f.message('gH', { 2: 0, 3: f.completed.answer }) })],
      }),
    ];
    expect(read(f).completed).toEqual(f.completed);
  });

  it.each(['multiple-QG', 'rich-node', 'wrong-text', 'metadata', 'format', 'orphan'] as const)(
    'refuses %s structured live content',
    (kind) => {
      const f = geminiFixedTextContractFixture();
      const plain = f.message('gH', { 3: f.completed.answer });
      const node = f.message('oH', { 2: plain });
      const og = f.message('qH', { 1: [node] });
      f.live.fl[26] = [og];
      if (kind === 'multiple-QG') f.live.fl[26].push(og);
      if (kind === 'rich-node') node.fl[2] = f.wire({ 1: 'SYNTHETIC_PRIVATE_MARKER' });
      if (kind === 'wrong-text') plain.fl[2] = 'OTHER';
      if (kind === 'metadata') og.fl[1] = f.wire({ 1: true });
      if (kind === 'format') plain.fl[1] = 1;
      if (kind === 'orphan') {
        delete f.live.fl[4];
        f.live.fl[14] = false;
      }
      refuse(f);
    },
  );

  it('keeps bounded known46/52 opaque and does not return their provider values', () => {
    const f = geminiFixedTextContractFixture();
    const continuation = f.message('vL', { 1: 'SYNTHETIC_PRIVATE_MARKER' });
    const disconnect = f.wire({ 1: f.wire({ 1: 'SYNTHETIC_PRIVATE_MARKER' }) });
    f.live.fl[45] = continuation;
    f.live.fl[51] = disconnect;
    expect(read(f)).toEqual({
      conversationId: f.completed.conversationId,
      turnId: f.completed.turnId,
      candidateId: f.completed.candidateId,
      completed: f.completed,
    });
    expect(f.live.fl[45]).toBe(continuation);
    expect(f.live.fl[51]).toBe(disconnect);
  });

  it.each([
    'frame-getter',
    'candidate-getter',
    'status-getter',
    'opaque-getter',
    'extra-own',
    'symbol',
    'cycle',
    'oversized',
    'wrong-prototype',
    'raw-array',
  ] as const)('refuses malformed %s representation without invoking getters', (kind) => {
    const f = geminiFixedTextContractFixture();
    const getter = vi.fn(() => 'SYNTHETIC_PRIVATE_MARKER');
    if (kind === 'frame-getter') Object.defineProperty(f.live.fl, '14', { get: getter });
    if (kind === 'candidate-getter') Object.defineProperty(f.candidate.fl, '0', { get: getter });
    if (kind === 'status-getter') Object.defineProperty(f.status, '0', { get: getter });
    if (kind === 'opaque-getter') {
      const opaque = f.wire({ 1: 'unused' });
      Object.defineProperty(opaque, '0', { get: getter });
      f.live.fl[51] = opaque;
    }
    if (kind === 'extra-own') (f.live as any).private = undefined;
    if (kind === 'symbol') f.live.fl[Symbol('synthetic') as any] = undefined;
    if (kind === 'cycle') f.live.fl[51] = f.live.fl;
    if (kind === 'oversized') f.live.fl.length = 1025;
    if (kind === 'wrong-prototype') Object.setPrototypeOf(f.live, f.namespace.H5c.prototype);
    if (kind === 'raw-array') f.live = f.live.fl as any;
    refuse(f);
    expect(getter).not.toHaveBeenCalled();
  });
});

describe('same-generation raw routing control', () => {
  it.each([undefined, '', 'SYNTHETIC_SURVEY'])(
    'retains only private routing correlation for string18 %s',
    (supplement) => {
      const f = geminiFixedTextContractFixture();
      if (supplement !== undefined) f.routing.fl[17] = supplement;
      const calls = { ...f.calls };
      expect(fixedContract.readGeminiTrialRawFrame(f.namespace, f.routing)).toEqual({
        conversationId: f.completed.conversationId,
        turnId: f.completed.turnId,
        routing: { epa: 'SYNTHETIC_ROUTING', ...(supplement ? { Kzd: supplement } : {}) },
      });
      expect(f.calls).toEqual(calls);
    },
  );
});

describe('closed raw routing21 frame', () => {
  it.each(['instance', 'array', 'sparse-tail'] as const)(
    'accepts canonical singular control %s without finality',
    (kind) => {
      const f = geminiFixedTextContractFixture();
      if (kind === 'array') f.routing.fl[20] = ['SYNTHETIC_ROUTING'];
      if (kind === 'sparse-tail') {
        f.routing.fl = [{ 2: f.identity, 21: ['SYNTHETIC_ROUTING'], 5: [], 27: [] }];
        Object.defineProperty(f.routing.fl, f.namespace.La, { value: 64 + (1 << 14) });
      }
      expect(fixedContract.readGeminiTrialRawFrame(f.namespace, f.routing)).not.toHaveProperty(
        'completed',
      );
    },
  );
  it.each([undefined, false, 0])('accepts canonical nonfinal routing flag %s', (flag) => {
    const f = geminiFixedTextContractFixture();
    if (flag !== undefined) f.routing.fl[14] = flag;
    expect(fixedContract.readGeminiTrialRawFrame(f.namespace, f.routing)).toEqual({
      conversationId: f.completed.conversationId,
      turnId: f.completed.turnId,
      routing: { epa: 'SYNTHETIC_ROUTING' },
    });
  });
  it('keeps a null routing Boolean15 absent under existing reader semantics', () => {
    const f = geminiFixedTextContractFixture();
    f.routing.fl[14] = null;
    expect(fixedContract.readGeminiTrialRawFrame(f.namespace, f.routing)).not.toHaveProperty(
      'completed',
    );
  });
  it.each([true, 1, 'false', '0', {}, []])('refuses noncanonical/final routing flag %s', (flag) => {
    const f = geminiFixedTextContractFixture();
    f.routing.fl[14] = flag;
    expect(() => fixedContract.readGeminiTrialRawFrame(f.namespace, f.routing)).toThrow();
  });
  it.each([
    undefined,
    [],
    [''],
    [5],
    [new String('SYNTHETIC_ROUTING')],
    ['x'.repeat(1048577)],
    ['SYNTHETIC_ROUTING', 'extra'],
  ])('refuses malformed control %#', (value) => {
    const f = geminiFixedTextContractFixture();
    f.routing.fl[20] = value;
    if (value === undefined) f.routing.fl[20] = f.message('DAd', {});
    expect(() => fixedContract.readGeminiTrialRawFrame(f.namespace, f.routing)).toThrowError(
      expect.objectContaining({ cause: 'response-raw-routing' }),
    );
  });
  it.each([5, 11, 15, 23, 27, 28, 37, 46, 49, 51, 52, 63, 12, 13, 16, 32, 34, 50, 56, 81])(
    'does not hide co-present tag %s',
    (field) => {
      const f = geminiFixedTextContractFixture();
      f.routing.fl[field - 1] =
        field === 5
          ? [f.candidate]
          : field === 27
            ? [f.message('qH', {})]
            : field === 63
              ? 2
              : field === 15
                ? true
                : field === 46
                  ? f.message('vL', {})
                  : [1];
      expect(() => fixedContract.readGeminiTrialRawFrame(f.namespace, f.routing)).toThrow();
    },
  );
  it.each([
    'missing-cid',
    'missing-rid',
    'foreign-prototype',
    'getter',
    'duplicate-tail',
    'private-holder',
    'flag128',
  ])('refuses %s control ownership/representation', (kind) => {
    const f = geminiFixedTextContractFixture();
    if (kind === 'missing-cid') f.routing.fl[1] = f.message('CI', { 2: f.completed.turnId });
    if (kind === 'missing-rid')
      f.routing.fl[1] = f.message('CI', { 1: f.completed.conversationId });
    if (kind === 'foreign-prototype') Object.setPrototypeOf(f.routing.fl[20] as object, {});
    if (kind === 'getter')
      Object.defineProperty((f.routing.fl[20] as any).fl, '0', {
        get: () => {
          throw new Error('never');
        },
      });
    if (kind === 'duplicate-tail')
      f.routing.fl[20] = ['SYNTHETIC_ROUTING', { 1: 'SYNTHETIC_ROUTING' }];
    if (kind === 'private-holder') (f.routing.fl[20] as any).Aa = {};
    if (kind === 'flag128')
      Object.defineProperty((f.routing.fl[20] as any).fl, f.namespace.La, { value: 2144 | 128 });
    expect(() => fixedContract.readGeminiTrialRawFrame(f.namespace, f.routing)).toThrow();
  });
});

describe('bounded live20/43 scalar policy', () => {
  const read = (f: Fixture) => fixedContract.readGeminiTrialRawFrame(f.namespace, f.live);
  const languages =
    'en ja ko zh id th hi bn vi ar sw es he iw mr gu kn ml ta te ur ru de fr it nl pl pt sv sr tr uk cs hu ro da sk no bg hr lt et lv'.split(
      ' ',
    );
  it.each(['partial', 'final'] as const)(
    'preserves %s JSON2146 dense/sparse strings without exporting them',
    (kind) => {
      for (const sparse of [false, true]) {
        for (const [language, attribution] of [
          ...[undefined, null, '', ...languages].map((language) => [
            language,
            'SYNTHETIC_PRIVATE_ATTRIBUTION',
          ]),
          ...[undefined, null, '', 'Legacy', 'Auto', ' '.repeat(160), ' ~'].map((attribution) => [
            'ko',
            attribution,
          ]),
        ]) {
          const f = geminiFixedTextContractFixture();
          const fields = {
            2: [f.completed.conversationId, f.completed.turnId],
            5: [
              [
                f.completed.candidateId,
                [kind === 'final' ? f.completed.answer : 'CROSSCHECK'],
                null,
                null,
                null,
                null,
                null,
                null,
                [kind === 'final' ? 2 : 1],
              ],
            ],
            15: kind === 'final',
            20: language,
            43: attribution,
          };
          f.live.fl = JSON.parse(JSON.stringify(sparse ? [fields] : f.wire(fields)));
          Object.defineProperty(f.live.fl, f.namespace.La, {
            value: 2146 | (sparse ? 1 << 14 : 0),
          });
          const before = Object.getOwnPropertyDescriptors(f.live.fl);
          const calls = { ...f.calls };
          const observed = {
            conversationId: f.completed.conversationId,
            turnId: f.completed.turnId,
            candidateId: f.completed.candidateId,
          };
          const result = read(f);
          expect(result).toEqual(
            kind === 'final' ? { ...observed, completed: f.completed } : observed,
          );
          expect(JSON.stringify(result)).not.toContain('SYNTHETIC_PRIVATE');
          expect(Object.getOwnPropertyDescriptors(f.live.fl)).toEqual(before);
          expect(f.calls).toEqual(calls);
        }
      }
    },
  );
  it.each([20, 43])('rejects wrong scalar kinds on live%s without coercion', (field) => {
    for (const value of [true, 20, {}, [], new String('ko')]) {
      const f = geminiFixedTextContractFixture();
      f.live.fl[field - 1] = value;
      f.live.fl[62] = 0;
      expect(() => read(f)).toThrowError(expect.objectContaining({ cause: 'response-raw-string' }));
    }
  });
  it.each([
    [20, 'AO'],
    [20, ' ko'],
    [20, 'ko '],
    [20, 'ko-KR'],
    [20, 'zh_Hans'],
    [20, 'vz'],
    [20, 'fil'],
    [43, 'name,label'],
    [43, '\n'],
    [43, '\x1f'],
    [43, '\x7f'],
    [43, '한'],
    [43, 'x'.repeat(161)],
  ] as const)('refuses out-of-policy live%s', (field, value) => {
    const f = geminiFixedTextContractFixture();
    f.live.fl[field - 1] = value;
    expect(() => read(f)).toThrowError(expect.objectContaining({ cause: 'response-raw-string' }));
  });
  it.each([20, 43])('refuses live%s getters without invoking them', (field) => {
    const f = geminiFixedTextContractFixture();
    const getter = vi.fn(() => 'ko');
    Object.defineProperty(f.live.fl, String(field - 1), { get: getter });
    expect(() => read(f)).toThrowError(expect.objectContaining({ cause: 'response-shape' }));
    expect(getter).not.toHaveBeenCalled();
  });
  it('keeps primitive scalar policy separate from root nullish omission', () => {
    expect(fixedContract.isGeminiTrialLanguage(undefined)).toBe(true);
    expect(fixedContract.isGeminiTrialAttribution(undefined)).toBe(true);
    expect(fixedContract.isGeminiTrialLanguage(null)).toBe(false);
    expect(fixedContract.isGeminiTrialAttribution(null)).toBe(false);
  });
  it.each([7, 11, 81])('rejects unknown%s before inspecting co-present20/43 values', (field) => {
    const f = geminiFixedTextContractFixture();
    const inspect = vi.fn(() => {
      throw new Error('SYNTHETIC_PRIVATE');
    });
    const value = new Proxy({}, { getPrototypeOf: inspect, ownKeys: inspect, get: inspect });
    f.live.fl = [
      { 2: f.identity, 5: [f.candidate], 15: true, 20: value, 43: value, [field]: true },
    ];
    Object.defineProperty(f.live.fl, f.namespace.La, { value: 2146 | (1 << 14) });
    const get = vi.spyOn(Map.prototype, 'get');
    try {
      expect(() => read(f)).toThrowError(
        expect.objectContaining({
          cause:
            field === 11
              ? 'response-raw-title'
              : field === 81
                ? 'response-raw-fields'
                : 'response-raw-field-7',
        }),
      );
      expect(get).not.toHaveBeenCalled();
      expect(inspect).not.toHaveBeenCalled();
    } finally {
      get.mockRestore();
    }
  });
});

describe('native identity receipt', () => {
  it('does not promote a request-seeded RID to server evidence', () => {
    const f = geminiFixedTextContractFixture();
    const r = createGeminiNativeReceipt(f.namespace, f.approved);
    const incoming = f.nativeEnvelope(f.nativeKf({ cid: 'c_123', final: true }));
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
    const receipt = r.normalize(emitted.hf, emitted.aa);
    expect(receipt.ridEvidence).toBe('request-seed');
    expect(receipt.identity.ridOrigin).toBe('request');
    expect(receipt.observation.completed?.turnId).toBe(f.approved.clientTurnId);
    expect(r.pending()).toBe(true);
    r.finishEnvelope();
    expect(r.pending()).toBe(false);
  });
});

describe('native finite wire contract', () => {
  const accept = (
    f: Fixture,
    r: ReturnType<typeof createGeminiNativeReceipt>,
    input: { cid?: string; rid?: string; final?: boolean },
    prior = { cid: r.identity().conversationId ?? '', rid: r.identity().turnId },
  ) => {
    const incoming = f.nativeEnvelope(f.nativeKf(input));
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, prior);
    const receipt = r.normalize(emitted.hf, emitted.aa);
    return { incoming, emitted, receipt };
  };
  it.each([undefined, ''] as const)('retains absent/empty original IDs (%s)', (empty) => {
    const f = geminiFixedTextContractFixture();
    const r = createGeminiNativeReceipt(f.namespace, f.approved);
    const { receipt } = accept(f, r, { cid: empty, rid: empty });
    expect(receipt.cid.presence).toBe(empty === '' ? 'empty' : 'absent');
    expect(receipt.rid.presence).toBe(empty === '' ? 'empty' : 'absent');
    expect(receipt.identity).toEqual({
      conversationId: undefined,
      turnId: f.approved.clientTurnId,
      cidOrigin: 'absent',
      ridOrigin: 'request',
    });
    expect(() => r.completion(f.completed)).toThrow();
    r.finishEnvelope();
  });
  it('retains an original explicit pair and later inherits server evidence', () => {
    const f = geminiFixedTextContractFixture();
    const r = createGeminiNativeReceipt(f.namespace, f.approved);
    const first = accept(f, r, { cid: 'c_47', rid: 'opaque-server' });
    expect(first.emitted.hf).toBe(first.receipt.original);
    expect(first.receipt.ridEvidence).toBe('this-server-frame');
    const snapshot = r.identity();
    expect(Object.isFrozen(snapshot)).toBe(true);
    r.finishEnvelope();
    const second = accept(f, r, { final: true });
    expect(second.receipt.cidEvidence).toBe('earlier-server-frame');
    expect(second.receipt.ridEvidence).toBe('earlier-server-frame');
    expect(second.receipt.identity.turnId).toBe('opaque-server');
    expect(Object.isFrozen(second.receipt)).toBe(true);
    expect(Object.isFrozen(second.receipt.observation.completed)).toBe(true);
    r.finishEnvelope();
    r.terminal();
    expect(r.completion(second.receipt.observation.completed!)).toEqual({
      ...f.completed,
      turnId: 'opaque-server',
    });
    expect(snapshot).toEqual(r.identity());
  });
  it.each(['cid', 'rid'] as const)('refuses conflicting authoritative %s', (field) => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    accept(f, r, { cid: 'c_47', rid: 'opaque-server' });
    r.finishEnvelope();
    const incoming = f.nativeEnvelope(
      f.nativeKf({
        cid: field === 'cid' ? 'c_99' : 'c_47',
        rid: field === 'rid' ? 'foreign' : 'opaque-server',
      }),
    );
    expect(() => {
      r.capture(incoming);
      const emitted = f.normalizeNative(incoming, { cid: 'c_47', rid: 'opaque-server' });
      r.normalize(emitted.hf, emitted.aa);
    }).toThrow();
  });
  it('permits the first server RID before terminal, but refuses a different late RID', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    accept(f, r, { cid: 'c_47' });
    r.finishEnvelope();
    const receipt = accept(f, r, { rid: 'first-server' }).receipt;
    expect(receipt.identity.ridOrigin).toBe('server');
    r.finishEnvelope();
    r.terminal();
    expect(() => accept(f, r, { rid: 'late-server' })).toThrow();
  });
  it.each([false, true])(
    'late explicit seed RID upgrades provenance only when identical (%s)',
    (same) => {
      const f = geminiFixedTextContractFixture(),
        r = createGeminiNativeReceipt(f.namespace, f.approved);
      accept(f, r, { cid: 'c_47', final: true });
      r.finishEnvelope();
      r.terminal();
      if (!same) expect(() => accept(f, r, { rid: 'changed' })).toThrow();
      else {
        expect(accept(f, r, { rid: f.approved.clientTurnId }).receipt.identity.ridOrigin).toBe(
          'server',
        );
        r.finishEnvelope();
      }
    },
  );
  it.each(['rid', 'prompt', 'parent', 'model', 'candidate', 'stopped'] as const)(
    'seed-only completion keeps exact history %s rejection',
    (kind) => {
      const f = geminiFixedTextContractFixture(),
        r = createGeminiNativeReceipt(f.namespace, f.approved);
      const { receipt } = accept(f, r, { cid: 'c_47', final: true });
      r.finishEnvelope();
      r.terminal();
      const completion = r.completion(receipt.observation.completed!);
      f.identity.fl[1] = f.approved.clientTurnId;
      expect(assertGeminiTrialHistory(f.namespace, f.raw, f.approved, completion)).toBe(
        GEMINI_FIXED_TEXT_TRIAL_ANSWER,
      );
      if (kind === 'rid') f.identity.fl[1] = 'wrong';
      if (kind === 'prompt') f.query.fl[0] = 'wrong';
      if (kind === 'parent') f.parents.fl[0] = 'c_00';
      if (kind === 'model') f.request.fl[4] = 'wrong';
      if (kind === 'candidate') f.response.fl[3] = 'wrong';
      if (kind === 'stopped') f.response.fl[10] = true;
      expect(() => assertGeminiTrialHistory(f.namespace, f.raw, f.approved, completion)).toThrow();
      expect(r.identity().ridOrigin).toBe('request');
    },
  );
  it.each([
    'answer',
    'extra-field',
    'presence',
    'cid',
    'aa',
    'unfrozen-aa',
    'original',
    'clone',
  ] as const)('refuses changed actual normalization: %s', (kind) => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const raw = f.nativeKf({
      cid: 'c_47',
      rid: kind === 'original' ? 'server' : undefined,
      final: true,
    }) as any;
    const incoming = f.nativeEnvelope(raw);
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId }) as any;
    if (kind === 'answer')
      emitted.hf.fl[4] = [
        f.message('AF', {
          1: f.completed.candidateId,
          2: f.message('$Zc', { 1: '' }),
          9: f.wire({ 1: 2 }),
        }),
      ];
    if (kind === 'extra-field') emitted.hf.fl[0] = 'unknown';
    if (kind === 'presence') emitted.hf.fl[23] = false;
    if (kind === 'cid')
      emitted.hf.fl[1] = f.frozen(f.message('CI', { 1: 'c_99', 2: f.approved.clientTurnId }));
    if (kind === 'aa') emitted.aa = f.frozen(f.message('CI', { 1: 'c_47', 2: 'foreign' }));
    if (kind === 'unfrozen-aa') emitted.aa.fl[f.namespace.La] &= ~2;
    if (kind === 'original')
      emitted.hf = f.frozen(f.message('IF', { 2: emitted.aa, 5: [f.candidate], 15: true }));
    if (kind === 'clone') emitted.hf = raw;
    expect(() => r.normalize(emitted.hf, emitted.aa)).toThrow();
  });
  it('detects mutation before a later callback can restore raw evidence', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const { receipt } = accept(f, r, { cid: 'c_47', final: true });
    const original = receipt.original as any;
    original.fl[23] = true;
    expect(() => r.finishEnvelope()).toThrow();
    delete original.fl[23];
    expect(r.pending()).toBe(true);
  });
  it.each(['missing', 'duplicate', 'reentrant', 'close-projection'] as const)(
    'enforces one pending envelope correlation: %s',
    (kind) => {
      const f = geminiFixedTextContractFixture(),
        r = createGeminiNativeReceipt(f.namespace, f.approved);
      const incoming =
        kind === 'close-projection'
          ? f.message('Kzd', { 4: [] })
          : f.nativeEnvelope(f.nativeKf({ cid: 'c_47' }));
      r.capture(incoming);
      if (kind === 'missing') expect(() => r.finishEnvelope()).toThrow();
      if (kind === 'reentrant') expect(() => r.capture(incoming)).toThrow();
      if (kind === 'close-projection') expect(() => r.normalize(f.live, f.identity)).toThrow();
      if (kind === 'duplicate') {
        const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
        r.normalize(emitted.hf, emitted.aa);
        expect(() => r.normalize(emitted.hf, emitted.aa)).toThrow();
      }
    },
  );
  it.each(['array', 'typed'] as const)(
    'reads source-private %s tHd and array-backed kF',
    (kind) => {
      const f = geminiFixedTextContractFixture();
      const raw = (f.nativeKf({ cid: 'c_47', rid: 'server' }) as any).fl;
      const privateValue = kind === 'typed' ? new f.tHd(f.wire({ 4: raw })) : f.wire({ 4: raw });
      const incoming = f.message('Kzd', {
        2: f.wire({ 7: f.wire({ 1: f.wire({ 4: privateValue }) }) }),
      });
      expect(f.namespace.tHd).toBeUndefined();
      expect(f.namespace.QGd).toBeUndefined();
      expect(readGeminiNativeEnvelope(f.namespace, incoming)).toMatchObject({
        kind: 'response',
        raw,
      });
      const r = createGeminiNativeReceipt(f.namespace, f.approved);
      r.capture(incoming);
      const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
      expect(r.normalize(emitted.hf, emitted.aa).original).toBe(raw);
      r.finishEnvelope();
    },
  );
  it.each([4, 5] as const)('accepts only empty control %s without creating finality', (field) => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    expect(r.capture(f.message('Kzd', { [field]: [] }))).toMatchObject({ kind: 'close', field });
    r.finishEnvelope();
    r.terminal();
    expect(() => r.completion(f.completed)).toThrow();
  });
  it.each([
    'root',
    'middle-unknown',
    'missing',
    'error',
    'control',
    'oneof',
    'private',
    'accessor',
  ] as const)('refuses unsupported wrapper %s', (kind) => {
    const f = geminiFixedTextContractFixture(),
      incoming = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server' })) as any;
    if (kind === 'root') incoming.fl[3] = [];
    if (kind === 'middle-unknown') incoming.fl[1][9] = [];
    if (kind === 'missing') incoming.fl[1][6][0][3] = [];
    if (kind === 'error') incoming.fl[0] = [];
    if (kind === 'control') {
      incoming.fl = [];
      incoming.fl[3] = f.wire({ 1: 1 });
      Object.defineProperty(incoming.fl, f.namespace.La, { value: 2144 });
    }
    if (kind === 'oneof') f.namespace.ZL = [2, 3, 5, 6, 7, 8];
    if (kind === 'private') incoming.fl[1][6][0][3] = f.message('AF', { 4: f.live });
    if (kind === 'accessor')
      Object.defineProperty(incoming.fl[1][6][0][3], '3', {
        get() {
          throw new Error('must not call');
        },
      });
    expect(() => readGeminiNativeEnvelope(f.namespace, incoming)).toThrow();
  });
  it('classifies only source-shaped configuration/query/close', () => {
    const f = geminiFixedTextContractFixture(),
      configuration = f.nativeConfiguration();
    expect(readGeminiNativeSendKind(f.namespace, configuration.value)).toBe('configuration');
    expect(() =>
      assertGeminiNativeConfiguration(
        f.namespace,
        configuration.value,
        configuration.ok,
        f.approved,
        1,
      ),
    ).not.toThrow();
    expect(
      readGeminiNativeSendKind(
        f.namespace,
        f.message('JJd', {
          2: f.message('WL', {
            1: 1,
            9: f.message('xJd', { 1: 'Reply with CROSSCHECK_GEMINI_OK only.' }),
          }),
        }),
      ),
    ).toBe('query');
    expect(
      readGeminiNativeSendKind(f.namespace, f.message('JJd', { 4: f.message('jJd', { 1: 1 }) })),
    ).toBe('close');
  });
  it.each(['locale', 'source', 'mode', 'turn', 'slot', 'cofield', 'ok', 'query', 'close'] as const)(
    'refuses changed outgoing %s',
    (kind) => {
      const f = geminiFixedTextContractFixture(),
        c = f.nativeConfiguration();
      const value = c.value as any,
        config = value.fl[0],
        metadata = config.fl[0];
      if (kind === 'locale') metadata.fl[2] = 'en';
      if (kind === 'source') metadata.fl[0] = 2;
      if (kind === 'mode') metadata.fl[1] = 'wrong';
      if (kind === 'turn') metadata.fl[3] = 'wrong';
      if (kind === 'slot') {
        config.fl[1] = metadata;
        delete config.fl[0];
      }
      if (kind === 'cofield') config.fl[9] = [];
      if (kind === 'ok') config.fl[7].fl[4].fl[0] = f.message('wL', { 1: 'changed' });
      if (kind === 'query')
        expect(() =>
          readGeminiNativeSendKind(
            f.namespace,
            f.message('JJd', { 2: f.message('WL', { 1: 2, 9: f.message('xJd', { 1: 'wrong' }) }) }),
          ),
        ).toThrow();
      else if (kind === 'close')
        expect(() =>
          readGeminiNativeSendKind(
            f.namespace,
            f.message('JJd', { 4: f.message('jJd', { 1: 2 }) }),
          ),
        ).toThrow();
      else
        expect(() =>
          assertGeminiNativeConfiguration(f.namespace, value, c.ok, f.approved, 1),
        ).toThrow();
    },
  );
});

describe('native callback witness verification', () => {
  it('keeps pending and identity unchanged, and refuses mutation before restoration', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const incoming = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', final: true }));
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
    const receipt = r.normalize(emitted.hf, emitted.aa),
      identity = r.identity();
    r.verify();
    expect(r.pending()).toBe(true);
    expect(r.identity()).toEqual(identity);
    const raw = receipt.original as any;
    raw.fl[23] = true;
    expect(() => r.verify()).toThrow();
    delete raw.fl[23];
    expect(r.pending()).toBe(true);
  });
  it('rechecks retained terminal content at completion after envelope consumption', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const incoming = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', final: true }));
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
    const receipt = r.normalize(emitted.hf, emitted.aa);
    r.finishEnvelope();
    r.terminal();
    (receipt.normalized as any).fl[23] = true;
    expect(() => r.completion(receipt.observation.completed!)).toThrow();
  });
});

describe('native bounded edge regressions', () => {
  it.each([
    [undefined, 'server'],
    ['', 'server'],
  ] as const)('keeps original when explicit RID has no prior CID (%s)', (cid, rid) => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const original = f.nativeKf({ cid, rid }),
      incoming = f.nativeEnvelope(original);
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
    const receipt = r.normalize(emitted.hf, emitted.aa);
    expect(receipt.normalized).toBe(original);
    expect(receipt.identity.conversationId).toBeUndefined();
    expect(receipt.ridEvidence).toBe('this-server-frame');
    r.finishEnvelope();
  });
  it('permits source mutable Vg/Fh/Lf backing reuse while retaining original absence', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const original = f.nativeKf({ cid: 'c_47', final: true }) as any;
    original.fl[f.namespace.La] &= ~2;
    const incoming = f.nativeEnvelope(original);
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
    const receipt = r.normalize(emitted.hf, emitted.aa);
    expect(receipt.rid.presence).toBe('absent');
    expect(receipt.ridEvidence).toBe('request-seed');
    expect((emitted.hf as any).fl).toBe(original.fl);
    r.verify();
    r.finishEnvelope();
  });
  it.each(['cid', 'rid'] as const)(
    'rejects malformed native %s values without getters',
    (field) => {
      for (const value of [0, true, {}, [], 'with space', 'x'.repeat(161)]) {
        const f = geminiFixedTextContractFixture(),
          raw = f.nativeKf({ cid: 'c_47', rid: 'server' }) as any;
        raw.fl[1].fl.length = 3;
        raw.fl[1].fl[field === 'cid' ? 0 : 1] = value;
        expect(() => readGeminiNativeEnvelope(f.namespace, f.nativeEnvelope(raw))).toThrow();
      }
    },
  );
  it.each(['foreign', 'c_z', 'c_0123456789abcdef0'])('rejects nonnavigable CID %s', (cid) => {
    const f = geminiFixedTextContractFixture();
    expect(() =>
      readGeminiNativeEnvelope(f.namespace, f.nativeEnvelope(f.nativeKf({ cid, rid: 'server' }))),
    ).toThrow();
  });
  it.each([{ payload: [null] }, { payload: [undefined] }, { payload: [{}] }])(
    'rejects noncanonical empty control $payload',
    ({ payload }) => {
      const f = geminiFixedTextContractFixture();
      expect(() =>
        readGeminiNativeEnvelope(f.namespace, f.message('Kzd', { 4: payload })),
      ).toThrow();
    },
  );
  it('requires a fresh frozen source Aa on every native response', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const first = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server' }));
    r.capture(first);
    const emitted = f.normalizeNative(first, { cid: '', rid: f.approved.clientTurnId });
    r.normalize(emitted.hf, emitted.aa);
    r.finishEnvelope();
    const second = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server' }));
    r.capture(second);
    const next = f.normalizeNative(second, { cid: 'c_47', rid: 'server' });
    expect(() => r.normalize(next.hf, emitted.aa)).toThrow();
  });
  it('does not recover a rejected witness after a later callback restores it', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const incoming = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', final: true }));
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId }),
      receipt = r.normalize(emitted.hf, emitted.aa);
    (receipt.original as any).fl[23] = true;
    expect(() => r.verify()).toThrow();
    delete (receipt.original as any).fl[23];
    expect(() => r.finishEnvelope()).toThrow();
  });
  it('accepts an embedded OK source clone with identical bounded content', () => {
    const f = geminiFixedTextContractFixture(),
      configuration = f.nativeConfiguration();
    const value = configuration.value as any;
    value.fl[0].fl[7].fl[4].fl[0] = f.frozen(f.message('wL', { 1: 'synthetic-ok' }));
    expect(() =>
      assertGeminiNativeConfiguration(f.namespace, value, configuration.ok, f.approved, 1),
    ).not.toThrow();
  });
  it.each(['m', 'Ph', 'Lg', 'Af'])('rejects a changed normalization primitive %s', (key) => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    f.namespace[key] = () => {};
    expect(() => r.capture(f.nativeEnvelope(f.nativeKf({ cid: 'c_47' })))).toThrow();
  });
});

describe('native snapshot bounds and content-free failures', () => {
  it.each(['characters', 'nodes', 'array'] as const)(
    'bounds the entire native evidence %s',
    (kind) => {
      const f = geminiFixedTextContractFixture(),
        raw = f.nativeKf({ cid: 'c_47', rid: 'server' }) as any;
      if (kind === 'characters') {
        raw.fl[17] = 'x'.repeat(524289);
        raw.fl[5] = f.wire({ 1: 'y'.repeat(524289) });
      }
      if (kind === 'nodes')
        raw.fl[51] = f.wire({
          1: Array.from({ length: 1024 }, () => Array.from({ length: 4 }, () => [])),
        });
      if (kind === 'array') raw.fl[51] = Array(1025);
      expect(() => readGeminiNativeEnvelope(f.namespace, f.nativeEnvelope(raw))).toThrow();
    },
  );
  it('never propagates a provider-thrown private error cause', () => {
    const f = geminiFixedTextContractFixture();
    const foreign = new Proxy(
      {},
      {
        getOwnPropertyDescriptor() {
          throw new Error('Gemini trial contract failed.', { cause: 'SYNTHETIC_PRIVATE_MARKER' });
        },
      },
    );
    expect(() => readGeminiNativeEnvelope(foreign, f.nativeEnvelope(f.live))).toThrowError(
      expect.objectContaining({ cause: 'response-shape' }),
    );
  });
  it('retains opaque nested repeated cardinality even before array flags are materialized', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const raw = f.nativeKf({ cid: 'c_47' }) as any;
    raw.fl[51] = f.wire({ 1: f.wire({ 1: [] }) });
    const incoming = f.nativeEnvelope(raw);
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
    (emitted.hf as any).fl[51] = f.wire({ 1: f.wire({ 1: [undefined] }) });
    expect(() => r.normalize(emitted.hf, emitted.aa)).toThrow();
  });
});

describe('native consumed normalization relation', () => {
  it.each(['identity-reference', 'frozen-state'] as const)(
    'rechecks %s after normalized callbacks',
    (kind) => {
      const f = geminiFixedTextContractFixture(),
        r = createGeminiNativeReceipt(f.namespace, f.approved);
      const incoming = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', final: true }));
      r.capture(incoming);
      const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
      r.normalize(emitted.hf, emitted.aa);
      const normalized = emitted.hf as any;
      if (kind === 'identity-reference')
        normalized.fl[1] = f.frozen(f.message('CI', { 1: 'c_47', 2: f.approved.clientTurnId }));
      else normalized.fl[f.namespace.La] &= ~2;
      expect(() => r.verify()).toThrow();
    },
  );
});

describe('native source materialized view relations', () => {
  it.each(['mutable-parent', 'logical-mutable'] as const)(
    'retains source %s view and pre-normalization provenance',
    (kind) => {
      const f = geminiFixedTextContractFixture(),
        r = createGeminiNativeReceipt(f.namespace, f.approved);
      const raw = f.nativeKf({ cid: 'c_47', final: true }) as any,
        originalBacking = raw.fl;
      const incoming = f.nativeEnvelope(raw) as any;
      if (kind === 'mutable-parent') incoming.fl[1][6][0][3] = new f.tHd(f.wire({ 4: raw }));
      else {
        raw.Fb = f.namespace.Kaa;
        raw.tcc = f.namespace.Kaa;
      }
      r.capture(incoming);
      const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
      const receipt = r.normalize(emitted.hf, emitted.aa);
      expect(receipt.rid.presence).toBe('absent');
      expect(receipt.ridEvidence).toBe('request-seed');
      expect((emitted.hf as any).fl).not.toBe(originalBacking);
      r.verify();
      r.finishEnvelope();
    },
  );
  it('binds original explicit-pair projection to the actual source materialized view', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const raw = f.nativeKf({ cid: 'c_47', rid: 'server' }) as any,
      incoming = f.nativeEnvelope(raw) as any;
    incoming.fl[1][6][0][3] = new f.tHd(f.wire({ 4: raw }));
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
    expect(emitted.hf).not.toBe(raw);
    expect((emitted.hf as any).fl).toBe(raw.fl);
    expect(() => r.normalize(emitted.hf, emitted.aa)).not.toThrow();
    r.verify();
    r.finishEnvelope();
  });
  it('refuses an equal-content foreign view outside the source-owned envelope path', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const raw = f.nativeKf({ cid: 'c_47', rid: 'server' }) as any,
      incoming = f.nativeEnvelope(raw) as any;
    incoming.fl[1][6][0][3] = new f.tHd(f.wire({ 4: raw }));
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
    const foreign = new f.namespace.IF((emitted.hf as any).fl);
    foreign.Fb = f.namespace.Kaa;
    foreign.tcc = f.namespace.Kaa;
    expect(() => r.normalize(foreign, emitted.aa)).toThrow();
  });
  it('accepts source child materialization after normalized delivery on the retained backing', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const raw = f.nativeKf({ cid: 'c_47', final: true }) as any,
      location = f.wire({ 1: 'synthetic-place', 3: false }),
      client = f.wire({ 1: [] });
    raw.fl[5] = location;
    raw.fl[64] = client;
    const incoming = f.nativeEnvelope(raw);
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
    r.normalize(emitted.hf, emitted.aa);
    (emitted.hf as any).fl[5] = f.frozen(new f.namespace.W4c(location));
    (emitted.hf as any).fl[64] = f.frozen(new f.QGd(client));
    expect(() => r.verify()).not.toThrow();
    r.finishEnvelope();
  });
});

describe('native retained backing ownership', () => {
  it.each(['root', 'repeated', 'child'] as const)(
    'refuses equal-content foreign normalized %s backing',
    (kind) => {
      const f = geminiFixedTextContractFixture(),
        r = createGeminiNativeReceipt(f.namespace, f.approved);
      const raw = f.nativeKf({ cid: 'c_47', final: true }) as any;
      raw.fl[5] = f.wire({ 1: 'synthetic-place' });
      const incoming = f.nativeEnvelope(raw);
      r.capture(incoming);
      const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
      r.normalize(emitted.hf, emitted.aa);
      const normalized = emitted.hf as any;
      if (kind === 'root') {
        const copy = normalized.fl.slice();
        Object.defineProperty(copy, f.namespace.La, {
          value: normalized.fl[f.namespace.La],
          writable: true,
        });
        normalized.fl = copy;
      }
      if (kind === 'repeated') normalized.fl[4] = normalized.fl[4].slice();
      if (kind === 'child') normalized.fl[5] = f.frozen(f.message('W4c', { 1: 'synthetic-place' }));
      expect(() => r.verify()).toThrow();
    },
  );
  it('refuses an unwitnessed mutable-view post-callback root/list detach', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const raw = f.nativeKf({ cid: 'c_47', rid: 'server' }) as any,
      incoming = f.nativeEnvelope(raw) as any;
    incoming.fl[1][6][0][3] = new f.tHd(f.wire({ 4: raw }));
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
    r.normalize(emitted.hf, emitted.aa);
    const normalized = emitted.hf as any,
      copy = normalized.fl.slice();
    Object.defineProperty(copy, f.namespace.La, { value: 2144, writable: true });
    copy[4] = copy[4].slice();
    normalized.fl = copy;
    normalized.Fb = undefined;
    normalized.tcc = undefined;
    expect(() => r.verify()).toThrow();
  });
});

describe('native retained explicit-pair witnesses', () => {
  it.each(['frozen-bit', 'mutable-sentinel', 'separate-Aa-backing'] as const)(
    'permanently rejects observed explicit-pair %s mutation',
    (kind) => {
      const f = geminiFixedTextContractFixture(),
        r = createGeminiNativeReceipt(f.namespace, f.approved);
      const raw = f.nativeKf({ cid: 'c_47', rid: 'server', final: true }) as any;
      const incoming = f.nativeEnvelope(raw);
      r.capture(incoming);
      const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
      const receipt = r.normalize(emitted.hf, emitted.aa),
        normalized = emitted.hf as any,
        aa = emitted.aa as any,
        backing = aa.fl,
        flags = normalized.fl[f.namespace.La];
      expect(emitted.hf).toBe(raw);
      expect(normalized.fl[1]).not.toBe(aa);
      if (kind === 'frozen-bit') normalized.fl[f.namespace.La] &= ~2;
      if (kind === 'mutable-sentinel') normalized.Fb = f.namespace.Kaa;
      if (kind === 'separate-Aa-backing') {
        aa.fl = backing.slice();
        Object.defineProperty(aa.fl, f.namespace.La, { value: backing[f.namespace.La] });
      }
      expect(() => r.verify()).toThrow();
      normalized.fl[f.namespace.La] = flags;
      delete normalized.Fb;
      aa.fl = backing;
      expect(() => r.verify()).toThrow();
      expect(() => r.finishEnvelope()).toThrow();
      expect(() => r.completion(receipt.observation.completed!)).toThrow();
    },
  );
  it('checks the latest separate Aa at completion after another nonfinal envelope', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const incoming = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server', final: true }));
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
    const receipt = r.normalize(emitted.hf, emitted.aa);
    r.finishEnvelope();
    r.terminal();
    const next = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server' }));
    r.capture(next);
    const normalized = f.normalizeNative(next, { cid: 'c_47', rid: 'server' });
    r.normalize(normalized.hf, normalized.aa);
    r.finishEnvelope();
    const aa = normalized.aa as any,
      backing = aa.fl;
    aa.fl = backing.slice();
    Object.defineProperty(aa.fl, f.namespace.La, { value: backing[f.namespace.La] });
    expect(() => r.completion(receipt.observation.completed!)).toThrow();
    aa.fl = backing;
    expect(() => r.completion(receipt.observation.completed!)).toThrow();
  });
  it.each(['capture', 'normalize', 'finish', 'verify', 'terminal', 'completion'] as const)(
    'checks separate retained Aa backing at later %s',
    (stage) => {
      const f = geminiFixedTextContractFixture(),
        r = createGeminiNativeReceipt(f.namespace, f.approved);
      const incoming = f.nativeEnvelope(
        f.nativeKf({ cid: 'c_47', rid: 'server', final: stage === 'completion' }),
      );
      r.capture(incoming);
      const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
      const receipt = r.normalize(emitted.hf, emitted.aa);
      r.finishEnvelope();
      const next =
        stage === 'finish'
          ? f.message('Kzd', { 4: [] })
          : f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server' }));
      if (stage === 'normalize' || stage === 'finish') r.capture(next);
      if (stage === 'completion') r.terminal();
      const aa = emitted.aa as any,
        backing = aa.fl;
      aa.fl = backing.slice();
      Object.defineProperty(aa.fl, f.namespace.La, { value: backing[f.namespace.La] });
      const check = () => {
        if (stage === 'capture') r.capture(next);
        if (stage === 'normalize') {
          const normalized = f.normalizeNative(next, { cid: 'c_47', rid: 'server' });
          r.normalize(normalized.hf, normalized.aa);
        }
        if (stage === 'finish') r.finishEnvelope();
        if (stage === 'verify') r.verify();
        if (stage === 'terminal') r.terminal();
        if (stage === 'completion') r.completion(receipt.observation.completed!);
      };
      expect(check).toThrow();
      aa.fl = backing;
      expect(() => r.verify()).toThrow();
    },
  );
});

describe('native historical wire content witness', () => {
  it.each(['wL', 'JJd', 'CI'] as const)(
    'retains the real %s outer type without provider calls',
    (name) => {
      const f = geminiFixedTextContractFixture();
      const value =
        name === 'JJd'
          ? f.nativeConfiguration().value
          : f.message(
              name,
              name === 'CI' ? { 1: '', 2: f.approved.clientTurnId } : { 1: 'synthetic-ok' },
            );
      const calls = { ...f.calls };
      const verify = captureGeminiNativeWireContent(f.namespace, value, name);
      expect(verify(value)).toBeUndefined();
      expect(f.calls).toEqual(calls);
    },
  );

  it('detects mutation of the original OK rather than comparing it with its current alias', () => {
    const f = geminiFixedTextContractFixture(),
      configuration = f.nativeConfiguration(),
      verify = captureGeminiNativeWireContent(f.namespace, configuration.ok, 'wL');
    (configuration.ok as any).fl[0] = 'changed';
    expect(() => verify(configuration.ok)).toThrowError(
      expect.objectContaining({ message: 'Gemini trial contract failed.', cause: 'packet' }),
    );
  });

  it.each(['wL', 'JJd', 'CI'] as const)(
    'permanently refuses observed nested %s mutation after restoration',
    (name) => {
      const f = geminiFixedTextContractFixture(),
        child = f.wire({ 1: 'synthetic-content' }),
        value = f.message(name, { 1: child }),
        verify = captureGeminiNativeWireContent(f.namespace, value, name);
      child[0] = 'changed';
      expect(() => verify(value)).toThrow();
      child[0] = 'synthetic-content';
      expect(() => verify(value)).toThrow();
    },
  );

  it('accepts same-backing typed child materialization and source representation flags', () => {
    const f = geminiFixedTextContractFixture(),
      child = f.wire({ 1: 'synthetic-content' }),
      value = f.message('wL', { 1: child }),
      verify = captureGeminiNativeWireContent(f.namespace, value, 'wL');
    value.fl[0] = f.frozen(new f.namespace.W4c(child));
    f.frozen(value);
    expect(() => verify(value)).not.toThrow();
    expect(value.fl[0].fl).toBe(child);
  });

  it('accepts a separate equal-content source-style copy without claiming ownership', () => {
    const f = geminiFixedTextContractFixture(),
      value = f.message('wL', { 1: f.wire({ 1: 'synthetic-content' }) }),
      verify = captureGeminiNativeWireContent(f.namespace, value, 'wL'),
      copy = f.frozen(
        f.message('wL', { 1: f.frozen(f.message('W4c', { 1: 'synthetic-content' })) }),
      );
    expect(copy.fl).not.toBe(value.fl);
    expect(() => verify(copy)).not.toThrow();
  });

  it('retains unknown child array cardinality before repeated flags are materialized', () => {
    const f = geminiFixedTextContractFixture(),
      child = f.wire({ 1: [] }),
      value = f.message('wL', { 99: child }),
      verify = captureGeminiNativeWireContent(f.namespace, value, 'wL');
    child[0] = [undefined];
    expect(() => verify(value)).toThrow();
  });

  it('retains semantic presence even when the added scalar is false', () => {
    const f = geminiFixedTextContractFixture(),
      value = f.message('wL', {}),
      verify = captureGeminiNativeWireContent(f.namespace, value, 'wL');
    value.fl[0] = false;
    expect(() => verify(value)).toThrow();
  });

  it.each(['wL', 'JJd', 'CI'] as const)(
    'requires a typed %s root at capture and verification',
    (name) => {
      const f = geminiFixedTextContractFixture(),
        value = f.message(name, { 1: 'synthetic-content' }),
        verify = captureGeminiNativeWireContent(f.namespace, value, name);
      for (const candidate of [value.fl, f.message('IF', { 1: 'synthetic-content' }), null]) {
        expect(() => captureGeminiNativeWireContent(f.namespace, candidate, name)).toThrow();
      }
      expect(() => verify(value.fl)).toThrow();
      expect(() => verify(value)).toThrow();
    },
  );

  it('refuses a raw array even if the supplied root constructor is Array', () => {
    const f = geminiFixedTextContractFixture();
    f.namespace.wL = Array;
    expect(() => captureGeminiNativeWireContent(f.namespace, [], 'wL')).toThrow();
  });

  it.each(['IF', 'constructor', undefined])(
    'refuses an unsupported root name %s at runtime',
    (name) => {
      const f = geminiFixedTextContractFixture();
      expect(() =>
        captureGeminiNativeWireContent(f.namespace, f.message('IF', {}), name as any),
      ).toThrow();
    },
  );

  it.each(['array', 'nodes', 'depth', 'characters', 'root-flags', 'accessor', 'cycle'] as const)(
    'enforces the existing %s boundary at capture and verification',
    (kind) => {
      const f = geminiFixedTextContractFixture(),
        value = f.message('wL', {}),
        verify = captureGeminiNativeWireContent(f.namespace, value, 'wL'),
        getter = vi.fn(() => {
          throw new Error('SYNTHETIC_PRIVATE_MARKER');
        });
      if (kind === 'array') value.fl[0] = new Array(1025);
      if (kind === 'nodes') value.fl[0] = Array.from({ length: 1024 }, () => [[], [], []]);
      if (kind === 'depth') {
        let child: unknown[] = [];
        for (let index = 0; index < 65; index++) child = [child];
        value.fl[0] = child;
      }
      if (kind === 'characters') value.fl[0] = 'x'.repeat(1048577);
      if (kind === 'root-flags') value.fl[f.namespace.La] |= 1;
      if (kind === 'accessor') Object.defineProperty(value.fl, '0', { get: getter });
      if (kind === 'cycle') value.fl[0] = value.fl;
      for (const check of [
        () => captureGeminiNativeWireContent(f.namespace, value, 'wL'),
        () => verify(value),
      ]) {
        expect(check).toThrowError(
          expect.objectContaining({ message: 'Gemini trial contract failed.', cause: 'packet' }),
        );
      }
      expect(getter).not.toHaveBeenCalled();
    },
  );

  it('sanitizes provider traps and permanently closes verification after their failure', () => {
    const f = geminiFixedTextContractFixture(),
      value = f.message('wL', {}),
      verify = captureGeminiNativeWireContent(f.namespace, value, 'wL'),
      candidate = new Proxy(value, {
        getPrototypeOf() {
          throw new Error('SYNTHETIC_PRIVATE_MARKER', { cause: 'response-shape' });
        },
      });
    for (const check of [
      () => captureGeminiNativeWireContent(f.namespace, candidate, 'wL'),
      () => verify(candidate),
      () => verify(value),
    ]) {
      expect(check).toThrowError(
        expect.objectContaining({ message: 'Gemini trial contract failed.', cause: 'packet' }),
      );
    }
  });
});

describe('native lifecycle profile', () => {
  it('accepts a supported normalized response with absent65 without changing it', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved),
      incoming = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', final: true }));
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
    r.normalize(emitted.hf, emitted.aa);
    const value = emitted.hf as any,
      before = Object.getOwnPropertyDescriptors(value.fl),
      calls = { ...f.calls };
    expect(assertGeminiNativeLifecycleProfile(f.namespace, value)).toBeUndefined();
    expect(Object.getOwnPropertyDescriptors(value.fl)).toEqual(before);
    expect(f.calls).toEqual(calls);
    r.verify();
    r.finishEnvelope();
  });

  it.each(['backing', 'overflow', 'pivot-overflow'] as const)(
    'uses semantic65 presence in supported %s storage',
    (storage) => {
      const f = geminiFixedTextContractFixture();
      for (const entry of [undefined, null, [], [null], [[]], [{}], [{ 1: [] }]]) {
        const fields = {
            2: f.identity,
            5: [f.message('FF', { 1: f.completed.candidateId, 2: f.text, 9: f.status })],
            15: true,
            65: entry,
          },
          value =
            storage === 'backing'
              ? f.frozen(f.message('IF', fields))
              : f.frozen(new f.namespace.IF([fields]));
        if (storage === 'pivot-overflow') value.fl[f.namespace.La] |= 1 << 14;
        const before = Object.getOwnPropertyDescriptors(value.fl),
          calls = { ...f.calls },
          check = () => assertGeminiNativeLifecycleProfile(f.namespace, value);
        if (entry === undefined || entry === null) expect(check()).toBeUndefined();
        else
          expect(check).toThrowError(
            expect.objectContaining({
              message: 'Gemini trial contract failed.',
              cause: 'response-raw-fields',
            }),
          );
        expect(Object.getOwnPropertyDescriptors(value.fl)).toEqual(before);
        expect(f.calls).toEqual(calls);
      }
    },
  );

  it('rechecks independent calls after addition, removal and a separate receipt failure', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved),
      value = f.nativeKf({ cid: 'c_47' }) as any;
    expect(() => r.capture(f.message('Kzd', {}))).toThrow();
    expect(assertGeminiNativeLifecycleProfile(f.namespace, value)).toBeUndefined();
    value.fl[64] = [];
    expect(() => assertGeminiNativeLifecycleProfile(f.namespace, value)).toThrow();
    delete value.fl[64];
    expect(() => r.verify()).toThrow();
    expect(assertGeminiNativeLifecycleProfile(f.namespace, value)).toBeUndefined();
  });

  it.each([
    'wrong-type',
    'prototype',
    'backing-accessor',
    'field-accessor',
    'overflow-accessor',
    'duplicate',
    'pivot',
    'flags',
    'namespace-accessor',
  ] as const)('refuses %s without invoking getters or provider code', (kind) => {
    const f = geminiFixedTextContractFixture(),
      value = f.message(kind === 'wrong-type' ? 'AF' : 'IF', {}),
      getter = vi.fn(() => {
        throw new Error('SYNTHETIC_PRIVATE_MARKER');
      });
    if (kind === 'prototype') Object.setPrototypeOf(value, Object.prototype);
    if (kind === 'backing-accessor') Object.defineProperty(value, 'fl', { get: getter });
    if (kind === 'field-accessor') Object.defineProperty(value.fl, '64', { get: getter });
    if (kind === 'overflow-accessor') {
      const overflow = {};
      Object.defineProperty(overflow, '65', { get: getter, enumerable: true });
      value.fl.push(overflow);
    }
    if (kind === 'duplicate') value.fl = f.wire({ 65: [], 66: { 65: [] } });
    if (kind === 'pivot') value.fl[f.namespace.La] |= 1 << 14;
    if (kind === 'flags') value.fl[f.namespace.La] |= 128;
    if (kind === 'namespace-accessor') Object.defineProperty(f.namespace, 'La', { get: getter });
    const calls = { ...f.calls };
    expect(() => assertGeminiNativeLifecycleProfile(f.namespace, value)).toThrowError(
      expect.objectContaining({
        message: 'Gemini trial contract failed.',
        cause: 'response-raw-fields',
      }),
    );
    expect(getter).not.toHaveBeenCalled();
    expect(f.calls).toEqual(calls);
  });

  it('sanitizes malformed roots and provider traps without retaining failure state', () => {
    const f = geminiFixedTextContractFixture(),
      value = Object.freeze(f.frozen(f.message('IF', {}))),
      trap = new Proxy(value, {
        getPrototypeOf() {
          throw new Error('SYNTHETIC_PRIVATE_MARKER');
        },
      });
    Object.freeze(value.fl);
    for (const candidate of [null, undefined, 65, {}, trap])
      expect(() => assertGeminiNativeLifecycleProfile(f.namespace, candidate)).toThrowError(
        expect.objectContaining({
          message: 'Gemini trial contract failed.',
          cause: 'response-raw-fields',
        }),
      );
    expect(assertGeminiNativeLifecycleProfile(f.namespace, value)).toBeUndefined();
  });
});

describe('native lifecycle profile candidate refinement', () => {
  it.each(['typed', 'array', 'candidate-overflow', 'Mv-overflow'] as const)(
    'independently refuses introduced Mv151 in %s after a normalized receipt fails',
    (storage) => {
      const f = geminiFixedTextContractFixture(),
        r = createGeminiNativeReceipt(f.namespace, f.approved),
        incoming = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', final: true }));
      r.capture(incoming);
      const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
      r.normalize(emitted.hf, emitted.aa);
      const value = emitted.hf as any,
        candidate = value.fl[4][0],
        mv = storage === 'typed' ? f.message('$v', { 151: 1 }) : f.wire({ 151: 1 });
      if (storage === 'Mv-overflow') mv.splice(0, mv.length, { 151: 1 });
      if (storage === 'candidate-overflow') {
        candidate.fl = [{ 1: f.completed.candidateId, 2: f.text, 9: f.status, 13: mv }];
        Object.defineProperty(candidate.fl, f.namespace.La, { value: 2144 | (1 << 14) });
      } else candidate.fl[12] = mv;
      expect(() => r.verify()).toThrow();
      const calls = { ...f.calls },
        before = Object.getOwnPropertyDescriptors(candidate.fl);
      expect(() => assertGeminiNativeLifecycleProfile(f.namespace, value)).toThrowError(
        expect.objectContaining({
          message: 'Gemini trial contract failed.',
          cause: 'response-raw-fields',
        }),
      );
      expect(Object.getOwnPropertyDescriptors(candidate.fl)).toEqual(before);
      expect(f.calls).toEqual(calls);
      if (storage === 'candidate-overflow') delete candidate.fl[0][13];
      else delete candidate.fl[12];
      expect(() => r.verify()).toThrow();
      expect(assertGeminiNativeLifecycleProfile(f.namespace, value)).toBeUndefined();
    },
  );

  it('accepts absent, null and semantically empty Mv forms without mutation or provider calls', () => {
    const f = geminiFixedTextContractFixture();
    for (const entry of [
      undefined,
      null,
      [],
      [null],
      [{}],
      f.message('$v', {}),
      f.wire({ 151: undefined }),
      [{ 151: null }],
    ]) {
      const value = f.message('IF', { 5: [f.message('FF', { 13: entry })] }),
        calls = { ...f.calls },
        before = Object.getOwnPropertyDescriptors(value.fl[4][0].fl);
      expect(assertGeminiNativeLifecycleProfile(f.namespace, value)).toBeUndefined();
      expect(Object.getOwnPropertyDescriptors(value.fl[4][0].fl)).toEqual(before);
      expect(f.calls).toEqual(calls);
    }
    for (const candidates of [undefined, null, []])
      expect(
        assertGeminiNativeLifecycleProfile(f.namespace, f.message('IF', { 5: candidates })),
      ).toBeUndefined();
  });

  it('still admits ordinary text, identity and finality mismatches after receipt failure', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved),
      incoming = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', final: true }));
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
    r.normalize(emitted.hf, emitted.aa);
    const value = emitted.hf as any;
    value.fl[1] = f.message('CI', { 1: 'c_99', 2: 'foreign-turn' });
    value.fl[4][0].fl[0] = 'foreign-candidate';
    value.fl[4][0].fl[1] = f.message('$Zc', { 1: 'different ordinary answer' });
    value.fl[14] = false;
    expect(() => r.verify()).toThrow();
    expect(assertGeminiNativeLifecycleProfile(f.namespace, value)).toBeUndefined();
  });

  it.each([
    'many',
    'non-list',
    'hole',
    'wrong-candidate-type',
    'candidate-prototype',
    'Mv-prototype',
    'Mv-scalar',
    'candidate13-accessor',
    'Mv151-accessor',
    'candidate-overflow-accessor',
    'Mv-overflow-accessor',
  ] as const)(
    'refuses ambiguous candidate lifecycle %s without getters or provider calls',
    (kind) => {
      const f = geminiFixedTextContractFixture(),
        candidate = f.message('AF', {}),
        mv = f.message('$v', {}),
        value = f.message('IF', { 5: [candidate] }),
        getter = vi.fn(() => {
          throw new Error('SYNTHETIC_PRIVATE_MARKER');
        });
      candidate.fl[12] = mv;
      if (kind === 'many') value.fl[4].push(candidate);
      if (kind === 'non-list') value.fl[4] = candidate;
      if (kind === 'hole') value.fl[4] = Array(1);
      if (kind === 'wrong-candidate-type') value.fl[4][0] = f.message('IF', {});
      if (kind === 'candidate-prototype') Object.setPrototypeOf(candidate, Object.prototype);
      if (kind === 'Mv-prototype') Object.setPrototypeOf(mv, Object.prototype);
      if (kind === 'Mv-scalar') candidate.fl[12] = 151;
      if (kind === 'candidate13-accessor')
        Object.defineProperty(candidate.fl, '12', { get: getter });
      if (kind === 'Mv151-accessor') Object.defineProperty(mv.fl, '150', { get: getter });
      if (kind === 'candidate-overflow-accessor') {
        const overflow = {};
        Object.defineProperty(overflow, '13', { get: getter, enumerable: true });
        candidate.fl.splice(0, candidate.fl.length, overflow);
      }
      if (kind === 'Mv-overflow-accessor') {
        const overflow = {};
        Object.defineProperty(overflow, '151', { get: getter, enumerable: true });
        mv.fl.push(overflow);
      }
      const calls = { ...f.calls };
      expect(() => assertGeminiNativeLifecycleProfile(f.namespace, value)).toThrowError(
        expect.objectContaining({
          message: 'Gemini trial contract failed.',
          cause: 'response-raw-fields',
        }),
      );
      expect(getter).not.toHaveBeenCalled();
      expect(f.calls).toEqual(calls);
    },
  );
});

describe('native recovery forwarding never accepts fixed output', () => {
  function recovery(control = 2) {
    const f = geminiFixedTextContractFixture();
    const r = createGeminiNativeReceipt(f.namespace, f.approved);
    const raw = f.nativeKf({ cid: 'c_47', rid: 'server', final: true }) as any;
    raw.fl[62] = control;
    const incoming = f.nativeEnvelope(raw);
    return {
      f,
      r,
      raw,
      incoming,
      materialize: () => f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId }),
    };
  }
  it.each([2, 3, 4])(
    'forwards exact control%s provenance without a receipt, final marker or public-reader expansion',
    (control) => {
      const { f, r, raw, incoming, materialize } = recovery(control);
      expect(() => readGeminiNativeEnvelope(f.namespace, incoming)).toThrow();
      expect(() => fixedContract.readGeminiTrialRawFrame(f.namespace, raw)).toThrow();
      expect(r.capture(incoming)).toMatchObject({ envelope: incoming, raw });
      expect(r.recoveryControl()).toBe(true);
      const emitted = materialize();
      expect(r.forwardRecovery(emitted.hf, emitted.aa)).toBeUndefined();
      r.verify();
      r.finishEnvelope();
      r.terminal();
      expect(() =>
        r.completion({ kind: 'marker', conversationId: 'c_47', turnId: 'server' }),
      ).toThrow();
      expect(() => readGeminiNativeEnvelope(f.namespace, incoming)).toThrow();
    },
  );
  it.each([2, 3, 4])(
    'keeps strict normalize refusal for control%s before and after a forwarding witness',
    (control) => {
      for (const forwarded of [false, true]) {
        const { r, incoming, materialize } = recovery(control);
        r.capture(incoming);
        const emitted = materialize();
        if (forwarded) r.forwardRecovery(emitted.hf, emitted.aa);
        expect(() => r.normalize(emitted.hf, emitted.aa)).toThrow();
      }
    },
  );
  it.each(['raw', 'aa', 'envelope', 'content', 'historical-backing'] as const)(
    'refuses changed %s provenance in recovery forwarding',
    (kind) => {
      const { f, r, raw, incoming, materialize } = recovery();
      r.capture(incoming);
      const emitted = materialize();
      if (kind === 'raw') emitted.hf = new f.namespace.IF((emitted.hf as any).fl);
      if (kind === 'aa') emitted.aa = new f.namespace.CI(['c_47', 'other']);
      if (kind === 'envelope') (incoming as any).fl[1] = f.message('XJd', {});
      if (kind === 'content') raw.fl[23] = true;
      if (kind === 'historical-backing') {
        r.forwardRecovery(emitted.hf, emitted.aa);
        raw.fl = raw.fl.slice();
        expect(() => r.verify()).toThrow();
        return;
      }
      expect(() => r.forwardRecovery(emitted.hf, emitted.aa)).toThrow();
    },
  );
  it.each([0, 1, 5, 6])(
    'does not authorize source-only forwarding for other control%s',
    (control) => {
      const { r, incoming, materialize } = recovery(control);
      if (control !== 0) {
        expect(() => r.capture(incoming)).toThrow();
        return;
      }
      r.capture(incoming);
      const emitted = materialize();
      expect(() => r.forwardRecovery(emitted.hf, emitted.aa)).toThrow();
    },
  );
  it.each([34, 65, 81])('keeps non63 field%s validation strict at capture', (field) => {
    const { r, incoming, raw } = recovery();
    raw.fl[field - 1] = true;
    expect(() => r.capture(incoming)).toThrow();
  });
});

it('cannot reuse an earlier accepted final after source-only recovery forwarding', () => {
  const f = geminiFixedTextContractFixture(),
    r = createGeminiNativeReceipt(f.namespace, f.approved);
  const first = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server', final: true }));
  r.capture(first);
  const accepted = f.normalizeNative(first, { cid: '', rid: f.approved.clientTurnId });
  r.normalize(accepted.hf, accepted.aa);
  r.finishEnvelope();
  const raw = f.nativeKf({ cid: 'c_47', rid: 'server' }) as any;
  raw.fl[62] = 2;
  const recovery = f.nativeEnvelope(raw);
  r.capture(recovery);
  const forwarded = f.normalizeNative(recovery, { cid: 'c_47', rid: 'server' });
  r.forwardRecovery(forwarded.hf, forwarded.aa);
  r.finishEnvelope();
  r.terminal();
  expect(() =>
    r.completion({ kind: 'marker', conversationId: 'c_47', turnId: 'server' }),
  ).toThrow();
});

it('cannot accept a later normal frame after source-only recovery forwarding', () => {
  const f = geminiFixedTextContractFixture(),
    r = createGeminiNativeReceipt(f.namespace, f.approved);
  const raw = f.nativeKf({ cid: 'c_47', rid: 'server' }) as any;
  raw.fl[62] = 2;
  const incoming = f.nativeEnvelope(raw);
  r.capture(incoming);
  const forwarded = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
  r.forwardRecovery(forwarded.hf, forwarded.aa);
  r.finishEnvelope();
  const next = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server', final: true }));
  r.capture(next);
  const emitted = f.normalizeNative(next, { cid: 'c_47', rid: 'server' });
  expect(() => r.normalize(emitted.hf, emitted.aa)).toThrow();
});

describe('current source-owned protected packet envelope', () => {
  it('accepts the original g8a/h8a envelope without invoking constructors or methods', () => {
    const f = geminiFixedTextContractFixture();
    const calls = { ...f.calls };
    expect(Object.keys(f.packet)).toEqual(['request', 't8a', 'u8a']);
    expect(packet(f)).toBe(f.packet);
    expect(f.calls).toEqual(calls);
  });
  it.each(['historical-only', 'mixed'] as const)('refuses %s F5a attestation ownership', (kind) => {
    const f = geminiFixedTextContractFixture();
    Object.assign(f.packet, { F5a: f.packet.t8a });
    if (kind === 'historical-only') delete (f.packet as any).t8a;
    reject(f, 'packet');
  });
});

it('accepts a current cached protected envelope retaining its original request and opaque pair', () => {
  const f = geminiFixedTextContractFixture();
  const cached = f.sourceConstruction.cache(f.packet);
  expect(assertGeminiTrialPacket(f.namespace, cached, f.approved)).toBe(cached);
  expect(cached.request).toBe(f.packet.request);
  expect(cached.t8a).toBe(f.packet.t8a);
  expect(cached.u8a).toBe(f.packet.u8a);
});
it.each(['disabled', 'error'] as const)(
  'refuses the source %s envelope without successful attestation',
  () => {
    const f = geminiFixedTextContractFixture();
    const unprotected = f.sourceConstruction.unprotected(f.packet.request);
    expect(() => assertGeminiTrialPacket(f.namespace, unprotected, f.approved)).toThrowError(
      expect.objectContaining({ cause: 'packet' }),
    );
  },
);

import { geminiSdkWebChannelFixture } from '../../fixtures/providers/gemini-sdk-webchannel';
for (const bigint of [true, false]) {
  it(`accepts original int64 configuration scalar with Xa=${bigint}`, () => {
    const f = geminiSdkWebChannelFixture();
    f.nativeInt64(bigint);
    const { configuration } = f.outbound();
    expect(configuration.fl[0].fl[1]).toBe(bigint ? 0n : '0');
    expect(() =>
      assertGeminiNativeConfiguration(
        f.namespace,
        configuration,
        f.ok,
        f.approved,
        f.api.requestSource,
      ),
    ).not.toThrow();
    expect(f.calls).toMatchObject({ factory: 0, query: 1, nativeSends: 0 });
  });
  it(`accepts original int64 query scalar with Xa=${bigint}`, () => {
    const f = geminiSdkWebChannelFixture();
    f.nativeInt64(bigint);
    const { query } = f.outbound();
    expect(query.fl[1].fl[0]).toBe(bigint ? 1n : '1');
    expect(readGeminiNativeSendKind(f.namespace, query)).toBe('query');
    expect(f.calls).toMatchObject({ factory: 0, query: 1, nativeSends: 0 });
  });
  it.each(['configuration', 'query'] as const)(
    `captures original int64 %s raw content with Xa=${bigint}`,
    (kind) => {
      const f = geminiSdkWebChannelFixture();
      f.nativeInt64(bigint);
      const values = f.outbound();
      expect(() => captureGeminiNativeWireContent(f.namespace, values[kind], 'JJd')).not.toThrow();
    },
  );
}

for (const kind of ['configuration', 'query'] as const) {
  it.each(
    kind === 'configuration'
      ? [undefined, null, false, true, '', '00', ' 0', '0.0', '+0', 1, 1n]
      : [undefined, null, false, true, '', '01', ' 1', '1.0', '+1', 0, 0n],
  )(`refuses noncanonical original int64 ${kind} scalar %s`, (value) => {
    const f = geminiSdkWebChannelFixture(),
      messages = f.outbound(),
      message = messages[kind];
    message.fl[kind === 'configuration' ? 0 : 1].fl[kind === 'configuration' ? 1 : 0] = value;
    expect(() => readGeminiNativeSendKind(f.namespace, message)).toThrow();
  });
  it.each(kind === 'configuration' ? [0, '0', 2n] : [1, '1', 2n])(
    `latches original int64 ${kind} raw type/value mutation %s`,
    (value) => {
      const f = geminiSdkWebChannelFixture(),
        message = f.outbound()[kind];
      const verify = captureGeminiNativeWireContent(f.namespace, message, 'JJd');
      const raw = message.fl[kind === 'configuration' ? 0 : 1].fl,
        index = kind === 'configuration' ? 1 : 0,
        prior = raw[index];
      raw[index] = value;
      expect(() => verify(message)).toThrow();
      raw[index] = prior;
      expect(() => verify(message)).toThrow();
    },
  );
}
it('keeps original int64 outbound snapshot scope closed to owning raw-array fields', () => {
  const f = geminiSdkWebChannelFixture(),
    { configuration, query, seed } = f.outbound();
  configuration.fl[0] = configuration.fl[0].fl;
  query.fl[1] = query.fl[1].fl;
  expect(() => captureGeminiNativeWireContent(f.namespace, configuration, 'JJd')).not.toThrow();
  expect(() => captureGeminiNativeWireContent(f.namespace, query, 'JJd')).not.toThrow();
  configuration.fl[0][2] = 0n;
  expect(() => captureGeminiNativeWireContent(f.namespace, configuration, 'JJd')).toThrow();
  query.fl[1][1] = 1n;
  expect(() => captureGeminiNativeWireContent(f.namespace, query, 'JJd')).toThrow();
  seed.fl[0] = 0n;
  expect(() => captureGeminiNativeWireContent(f.namespace, seed, 'CI')).toThrow();
  f.ok.fl[0] = 0n;
  expect(() => captureGeminiNativeWireContent(f.namespace, f.ok, 'wL')).toThrow();
  const close = new f.namespace.JJd();
  close.fl[3] = [1n];
  expect(() => captureGeminiNativeWireContent(f.namespace, close, 'JJd')).toThrow();
});
it('keeps original int64 outside inbound and saved history admission', () => {
  const f = geminiFixedTextContractFixture();
  f.status[0] = 0n;
  expect(() => history(f)).toThrow();
  const n = geminiSdkWebChannelFixture();
  const raw = n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
  raw.fl[23] = 0n;
  expect(() => readGeminiNativeEnvelope(n.namespace, n.nativeEnvelope(raw))).toThrow();
});
it.each([true, false])(
  'serializes original int64 with public ob without mutating raw Xa=%s',
  (bigint) => {
    const f = geminiSdkWebChannelFixture();
    f.nativeInt64(bigint);
    const { configuration, query } = f.outbound();
    const verify = captureGeminiNativeWireContent(f.namespace, configuration, 'JJd');
    const config = f.namespace.Hba(configuration),
      request = f.namespace.Hba(query);
    expect(config[0][1]).toBe(bigint ? 0 : '0');
    expect(request[1][0]).toBe(bigint ? 1 : '1');
    expect(configuration.fl[0].fl[1]).toBe(bigint ? 0n : '0');
    expect(query.fl[1].fl[0]).toBe(bigint ? 1n : '1');
    expect(() => JSON.stringify(config)).not.toThrow();
    expect(() => verify(configuration)).not.toThrow();
  },
);

it.each(['configuration', 'query'] as const)(
  'does not coerce original int64 %s objects or invoke their getter',
  (kind) => {
    const f = geminiSdkWebChannelFixture(),
      message = f.outbound()[kind],
      getter = vi.fn(() => () => 0);
    const value = Object.create(null, { valueOf: { get: getter }, toString: { get: getter } });
    message.fl[kind === 'configuration' ? 0 : 1].fl[kind === 'configuration' ? 1 : 0] = value;
    expect(() => readGeminiNativeSendKind(f.namespace, message)).toThrow();
    expect(getter).not.toHaveBeenCalled();
  },
);
it('does not borrow an original int64 scalar path for nested array content', () => {
  const f = geminiSdkWebChannelFixture(),
    { query } = f.outbound();
  query.fl[1].fl[0] = [1n];
  expect(() => captureGeminiNativeWireContent(f.namespace, query, 'JJd')).toThrow();
});

describe('Native57 outbound failure provenance', () => {
  function diagnostic(error: unknown): unknown {
    return (fixedContract as any).readGeminiNativeOutboundDiagnostic(error);
  }
  it.each(['semantic', 'initial-capture', 'retained-capture'] as const)(
    'preserves only owned %s provenance through existing Error allocations',
    (kind) => {
      const f = geminiSdkWebChannelFixture(),
        { configuration } = f.outbound();
      let failure: unknown;
      try {
        if (kind === 'semantic') {
          configuration.fl[0].fl[1] = 2n;
          assertGeminiNativeConfiguration(
            f.namespace,
            configuration,
            f.ok,
            f.approved,
            f.api.requestSource,
            true,
          );
        } else if (kind === 'initial-capture') {
          configuration.fl[f.namespace.La] |= 128;
          captureGeminiNativeWireContent(f.namespace, configuration, 'JJd', true);
        } else {
          const witness = captureGeminiNativeWireContent(f.namespace, configuration, 'JJd', true);
          configuration.fl[0].fl[0].fl[2] = 'en';
          witness(configuration);
        }
      } catch (error) {
        failure = error;
      }
      expect(failure).toBeInstanceOf(Error);
      expect(diagnostic(failure)).toBe(
        kind === 'semantic'
          ? 'dispatch-native-n15-configuration-zero'
          : kind === 'initial-capture'
            ? 'dispatch-native-n15-wire-forbidden-flags'
            : 'dispatch-native-n15-content-equality',
      );
      expect(Object.getOwnPropertyNames(failure)).toEqual(['stack', 'message', 'cause']);
      expect(Object.getOwnPropertySymbols(failure)).toEqual([]);
    },
  );
  it('does not inspect foreign error properties or accept forged provenance', () => {
    const getter = vi.fn(() => 'dispatch-native-n15-configuration-zero');
    const errors = [
      new Error(),
      Object.create({ geminiNativeDiagnostic: 'dispatch-native-n15-configuration-zero' }),
      Object.defineProperty(new Error(), 'geminiNativeDiagnostic', { get: getter }),
      Object.defineProperty(new Error(), 'geminiNativeDiagnostic', {
        value: 'dispatch-native-n15-configuration-zero',
      }),
      { geminiNativeDiagnostic: 'dispatch-native-n15-configuration-zero' },
    ];
    const trap = vi.fn(() => {
      throw new Error('foreign trap');
    });
    errors.push(
      new Proxy(
        {},
        { get: trap, getOwnPropertyDescriptor: trap, getPrototypeOf: trap, ownKeys: trap },
      ),
    );
    for (const error of errors) expect(diagnostic(error)).toBeUndefined();
    expect(diagnostic(null)).toBeUndefined();
    expect(diagnostic('foreign')).toBeUndefined();
    expect(getter).not.toHaveBeenCalled();
    expect(trap).not.toHaveBeenCalled();
  });
  it.each([false, true])(
    'preserves the exact existing namespace trap sequence with invalid=%s',
    (invalid) => {
      const f = geminiSdkWebChannelFixture(),
        { configuration } = f.outbound(),
        traces: PropertyKey[][] = [];
      if (invalid) configuration.fl[f.namespace.La] |= 128;
      for (const enabled of [false, true]) {
        const reads: PropertyKey[] = [],
          namespace = new Proxy(f.namespace, {
            getOwnPropertyDescriptor(target, key) {
              reads.push(key);
              return Reflect.getOwnPropertyDescriptor(target, key);
            },
          });
        let failure: unknown;
        try {
          readGeminiNativeSendKind(namespace, configuration, enabled);
        } catch (error) {
          failure = error;
        }
        expect(!!failure).toBe(invalid);
        if (failure)
          expect(diagnostic(failure)).toBe(
            enabled ? 'dispatch-native-n15-wire-forbidden-flags' : undefined,
          );
        traces.push(reads);
      }
      expect(traces[1]).toEqual(traces[0]);
    },
  );
  it('keeps default outbound admission errors untagged', () => {
    const f = geminiSdkWebChannelFixture(),
      { configuration } = f.outbound();
    configuration.fl[0].fl[1] = 2n;
    let failure: unknown;
    try {
      readGeminiNativeSendKind(f.namespace, configuration);
    } catch (error) {
      failure = error;
    }
    expect(failure).toBeInstanceOf(Error);
    expect(diagnostic(failure)).toBeUndefined();
  });
});

it('Native57 retains outbound oneof DATA descriptor provenance without invoking its accessor', () => {
  const f = geminiSdkWebChannelFixture(),
    { configuration } = f.outbound(),
    getter = vi.fn(() => [1, 2, 3, 4]);
  Object.defineProperty(f.namespace, 'XL', { get: getter, configurable: true });
  let failure: unknown;
  try {
    readGeminiNativeSendKind(f.namespace, configuration, true);
  } catch (error) {
    failure = error;
  }
  expect(failure).toBeInstanceOf(Error);
  expect(fixedContract.readGeminiNativeOutboundDiagnostic(failure)).toBe(
    'dispatch-native-n15-own-data',
  );
  expect(getter).not.toHaveBeenCalled();
});

it.each(['R7a', 'S7a', 'gS', 'xg', 'fka', 'JFa', 'pxa', 'c3', 'J_b', 'E3d'])(
  'Native63 refuses previous profile alias %s even when undefined',
  (key) => {
    const f = geminiFixedTextContractFixture();
    Object.assign(key === 'R7a' || key === 'S7a' ? f.packet : f.packet.request, {
      [key]: undefined,
    });
    reject(f, 'packet');
  },
);
it.each([true, false])('Native63 consumes the exact current privacy projection %s', (disabled) => {
  const f = geminiFixedTextContractFixture();
  f.packet.request = f.sourceConstruction.privacy(f.packet.request, disabled);
  expect(f.packet.request.x5d.fl[0]).toBe(disabled ? 1 : 2);
  expect(packet(f)).toBe(f.packet);
});

it.each(['old-only', 'mixed'] as const)(
  'Native63 refuses %s envelope and request namespaces',
  (kind) => {
    for (const target of ['envelope', 'request'] as const) {
      const f = geminiFixedTextContractFixture();
      if (target === 'envelope') {
        Object.assign(f.packet, { R7a: f.packet.t8a, S7a: f.packet.u8a });
        if (kind === 'old-only') {
          delete (f.packet as any).t8a;
          delete (f.packet as any).u8a;
        }
      } else {
        const aliases = { xS: 'gS', yg: 'xg', rka: 'fka', WFa: 'JFa', wxa: 'pxa', b_: 'c3' };
        for (const [current, old] of Object.entries(aliases)) {
          f.packet.request[old] = f.packet.request[current];
          if (kind === 'old-only') delete f.packet.request[current];
        }
      }
      reject(f, 'packet');
    }
  },
);

it.each(['historical-only', 'mixed'] as const)('Native63 refuses %s F5a/G5a envelope', (kind) => {
  const f = geminiFixedTextContractFixture();
  Object.assign(f.packet, { F5a: f.packet.t8a, G5a: f.packet.u8a });
  if (kind === 'historical-only') {
    delete (f.packet as any).t8a;
    delete (f.packet as any).u8a;
  }
  reject(f, 'packet');
});

it('Native64 accepts default source-produced retained root oneof metadata and drops it on clone', () => {
  const f = geminiSdkWebChannelFixture();
  const { configuration } = f.outbound();
  const cache = configuration.fl[f.namespace.dga];
  expect([...cache]).toEqual([[f.namespace.XL, 1]]);
  expect(configuration.fl[0].fl[f.namespace.dga]).toBeUndefined();
  const clone = f.namespace.tb(configuration.fl, configuration.fl[f.namespace.La], true);
  expect(clone[f.namespace.dga]).toBeUndefined();
  expect(clone[0]).toBe(configuration.fl[0]);
  expect(readGeminiNativeSendKind(f.namespace, configuration, true)).toBe('configuration');
});

it('Native64 accepts current cM query after an explicit source clone drops caches', () => {
  const f = geminiSdkWebChannelFixture(),
    { query } = f.outbound();
  query.fl[1] = new f.namespace.WL(
    f.namespace.tb(query.fl[1].fl, query.fl[1].fl[f.namespace.La], true),
  );
  const cloned = new f.namespace.JJd(f.namespace.tb(query.fl, query.fl[f.namespace.La], true));
  expect(cloned.fl[f.namespace.dga]).toBeUndefined();
  expect(cloned.fl[1].fl[f.namespace.dga]).toBeUndefined();
  expect([...f.namespace.VL]).toEqual([3, 4, 6, 7, 8, 9]);
  expect(typeof f.namespace.SL).toBe('function');
  expect(readGeminiNativeSendKind(f.namespace, cloned, true)).toBe('query');
});

describe('Native64 closed outbound oneof caches', () => {
  it.each(['configuration', 'query', 'close'] as const)(
    'accepts original %s cache semantics without calling provider readers',
    (kind) => {
      const f = geminiSdkWebChannelFixture(),
        ns = f.namespace;
      const outbound = f.outbound();
      const value =
        kind === 'close' ? ns.IJd(new ns.JJd(), ns.Rh(ns.Ni(new ns.jJd(), 1, 1))) : outbound[kind];
      const reader = vi.fn(() => {
        throw Error('must not execute');
      });
      for (const key of ['Xh', 'Yh', 'de', 'Ph', 'Poa']) ns[key] = reader;
      expect(readGeminiNativeSendKind(ns, value)).toBe(kind);
      const verify = captureGeminiNativeWireContent(ns, value, 'JJd');
      verify(value);
      expect(reader).not.toHaveBeenCalled();
    },
  );
  it.each([
    'wrong-symbol',
    'unknown-string',
    'accessor',
    'undefined',
    'not-map',
    'map-subclass',
    'map-proxy',
    'map-get',
    'map-size',
    'map-iterator',
    'foreign-group',
    'wrong-owner',
    'extra-entry',
    'stale-selection',
    'zero',
    'string',
    'nan',
    'outside',
    'two-fields',
    'group-hole',
    'group-accessor',
    'group-symbol',
    'group-flags',
    'group-prototype',
    'opaque-owner',
    'nested-owner',
    'group-key-accessor',
  ])('refuses %s with unchanged ordinary fields and no sends', (kind) => {
    const f = geminiSdkWebChannelFixture(),
      ns = f.namespace;
    const { configuration: value } = f.outbound(),
      cache = value.fl[ns.dga];
    const child = value.fl[0];
    const getter = vi.fn(() => ns.XL);
    if (kind === 'wrong-symbol') {
      delete value.fl[ns.dga];
      value.fl[Symbol('foreign')] = cache;
    }
    if (kind === 'unknown-string') value.fl.other = 1;
    if (kind === 'accessor') Object.defineProperty(value.fl, ns.dga, { get: getter });
    if (kind === 'undefined') value.fl[ns.dga] = undefined;
    if (kind === 'not-map') value.fl[ns.dga] = {};
    if (kind === 'map-subclass') value.fl[ns.dga] = new (class extends Map {})();
    if (kind === 'map-proxy') value.fl[ns.dga] = new Proxy(cache, {});
    if (kind === 'map-get') Object.defineProperty(cache, 'get', { get: getter });
    if (kind === 'map-size') Object.defineProperty(cache, 'size', { get: getter });
    if (kind === 'map-iterator') cache[Symbol.iterator] = getter;
    if (kind === 'foreign-group') {
      cache.clear();
      cache.set([...ns.XL], 1);
    }
    if (kind === 'wrong-owner') {
      cache.clear();
      cache.set(ns.VL, 1);
    }
    if (kind === 'extra-entry') cache.set(ns.HJd, 8);
    if (kind === 'stale-selection') cache.set(ns.XL, 2);
    if (kind === 'zero') cache.set(ns.XL, 0);
    if (kind === 'string') cache.set(ns.XL, '1');
    if (kind === 'nan') cache.set(ns.XL, NaN);
    if (kind === 'outside') cache.set(ns.XL, 5);
    if (kind === 'two-fields') value.fl[1] = child;
    if (kind === 'group-hole') delete ns.XL[1];
    if (kind === 'group-accessor') Object.defineProperty(ns.XL, '1', { get: getter });
    if (kind === 'group-symbol') ns.XL[Symbol('extra')] = true;
    if (kind === 'group-flags') ns.XL[ns.La] = 0;
    if (kind === 'group-prototype') Object.setPrototypeOf(ns.XL, null);
    if (kind === 'opaque-owner') f.ok.fl[ns.dga] = cache;
    if (kind === 'nested-owner') child.fl[0].fl[ns.dga] = cache;
    if (kind === 'group-key-accessor') Object.defineProperty(ns, 'XL', { get: getter });
    expect(() => captureGeminiNativeWireContent(ns, value, 'JJd')).toThrowError(
      expect.objectContaining({ cause: 'packet' }),
    );
    expect(value.fl[0]).toBe(child);
    expect(getter).not.toHaveBeenCalled();
    expect(f.calls).toMatchObject({ factory: 0, nativeSends: 0 });
  });
  it.each([
    'cache-selection',
    'cache-entry',
    'group-content',
    'namespace-group',
    'namespace-symbol',
    'coordinated-swap',
  ])('revalidates %s after a valid witness, including frozen backing/Map', (kind) => {
    const f = geminiSdkWebChannelFixture(),
      ns = f.namespace;
    const { configuration: value } = f.outbound(),
      child = value.fl[0],
      cache = value.fl[ns.dga];
    const verify = captureGeminiNativeWireContent(ns, value, 'JJd');
    if (kind !== 'coordinated-swap') Object.freeze(value.fl);
    Object.freeze(cache);
    if (kind === 'cache-selection') cache.set(ns.XL, 2);
    if (kind === 'cache-entry') cache.set(ns.VL, 9);
    if (kind === 'group-content') ns.XL[0] = 2;
    if (kind === 'namespace-group') ns.XL = [...ns.XL];
    if (kind === 'namespace-symbol') ns.dga = Symbol('replacement');
    if (kind === 'coordinated-swap') {
      const old = ns.dga;
      ns.dga = Symbol('replacement');
      ns.XL = [...ns.XL];
      delete value.fl[old];
      value.fl[ns.dga] = new Map([[ns.XL, 1]]);
    }
    expect(() => verify(value)).toThrowError(expect.objectContaining({ cause: 'packet' }));
    expect(value.fl[0]).toBe(child);
    cache.clear();
    cache.set(ns.XL, 1);
    expect(() => verify(value)).toThrowError(expect.objectContaining({ cause: 'packet' }));
    expect(f.calls.nativeSends).toBe(0);
  });
  it('admits source clone cache absence and valid sparse pivot metadata', () => {
    const f = geminiSdkWebChannelFixture(),
      ns = f.namespace;
    const { query } = f.outbound();
    const child = query.fl[1],
      text = child.fl[8];
    child.fl.length = 2;
    child.fl[1] = { 9: text };
    child.fl[ns.La] |= 2 << 14;
    const verify = captureGeminiNativeWireContent(ns, query, 'JJd');
    expect(readGeminiNativeSendKind(ns, query)).toBe('query');
    const cloned = new ns.JJd(ns.tb(query.fl, query.fl[ns.La], true));
    expect(cloned.fl[ns.dga]).toBeUndefined();
    verify(cloned);
  });
  it.each(['raw', 'history', 'opaque'] as const)(
    'keeps shared %s readers closed to oneof metadata',
    (kind) => {
      const f = geminiFixedTextContractFixture();
      const cache = new Map([[f.namespace.XL, 1]]);
      if (kind === 'raw') {
        (f.live as any).fl[f.namespace.dga] = cache;
        expect(() => fixedContract.readGeminiTrialRawFrame(f.namespace, f.live)).toThrowError(
          expect.objectContaining({ cause: 'response-shape' }),
        );
      } else if (kind === 'history') {
        (f.raw as any).fl[f.namespace.dga] = cache;
        expect(() =>
          assertGeminiTrialHistory(f.namespace, f.raw, f.approved, f.completed),
        ).toThrowError(expect.objectContaining({ cause: 'history' }));
      } else {
        const value = f.message('wL', { 1: 'opaque' });
        (value as any).fl[f.namespace.dga] = cache;
        expect(() => captureGeminiNativeWireContent(f.namespace, value, 'wL')).toThrowError(
          expect.objectContaining({ cause: 'packet' }),
        );
      }
    },
  );
});

it('Native64 accepts a source-retained qJd cache and rejects its stale selection', () => {
  const f = geminiSdkWebChannelFixture(),
    ns = f.namespace,
    { configuration } = f.outbound();
  const prior = configuration.fl[0];
  configuration.fl[0] = ns.Af(ns.di(ns.Lg(prior), 8, ns.HJd, prior.fl[7]));
  const q = configuration.fl[0];
  expect([...q.fl[ns.dga]]).toEqual([[ns.HJd, 8]]);
  expect(readGeminiNativeSendKind(ns, configuration)).toBe('configuration');
  const verify = captureGeminiNativeWireContent(ns, configuration, 'JJd');
  q.fl[ns.dga].set(ns.HJd, 6);
  expect(() => verify(configuration)).toThrowError(expect.objectContaining({ cause: 'packet' }));
  expect(q.fl[7]).toBe(prior.fl[7]);
  expect(f.calls.nativeSends).toBe(0);
});

it('Native64 keeps invalid standalone witness namespace inside the packet failure boundary', () => {
  const f = geminiSdkWebChannelFixture(),
    { configuration } = f.outbound();
  expect(() => captureGeminiNativeWireContent(null, configuration, 'JJd')).toThrowError(
    expect.objectContaining({ cause: 'packet' }),
  );
});

it('Native65 admits the exact original Yh own-cache side effect after successful capture', () => {
  const f = geminiSdkWebChannelFixture(),
    ns = f.namespace;
  const envelope: any = f.nativeEnvelope(
    f.nativeKf({ cid: 'c_47', rid: 'server-rid', final: true }),
  );
  const r = createGeminiNativeReceipt(ns, f.approved);
  r.capture(envelope);
  const keys = Reflect.ownKeys(envelope.fl);
  expect(ns.Xh(envelope, ns.$L)).toBe(2);
  expect(Reflect.ownKeys(envelope.fl)).toEqual([...keys, ns.dga]);
  expect(envelope.fl[ns.dga].get(ns.$L)).toBe(2);
  expect(() => readGeminiNativeEnvelope(ns, envelope)).not.toThrow();
});

describe('Native65 closed inbound oneof caches', () => {
  it.each([
    'wrong-group',
    'selection',
    'two-fields',
    'extra-entry',
    'unknown-key',
    'unknown-symbol',
    'accessor',
    'fake',
    'subclass',
    'proxy',
    'get',
    'iterator',
    'wrong-path',
    'private',
    'IF',
    'CI',
    'typed-owner',
  ] as const)('refuses %s without invoking provider accessors or iterators', (kind) => {
    const f = geminiSdkWebChannelFixture(),
      ns = f.namespace;
    const raw: any = f.nativeKf({ cid: 'c_47', rid: 'server-rid', final: true });
    const envelope: any = f.nativeEnvelope(raw);
    ns.Xh(envelope, ns.$L);
    const cache = envelope.fl[ns.dga],
      getter = vi.fn(() => cache);
    if (kind === 'wrong-group') {
      cache.clear();
      cache.set([...ns.$L], 2);
    }
    if (kind === 'selection') cache.set(ns.$L, 4);
    if (kind === 'two-fields') envelope.fl[3] = [];
    if (kind === 'extra-entry') cache.set(ns.ZL, 7);
    if (kind === 'unknown-key') envelope.fl.extra = 1;
    if (kind === 'unknown-symbol') envelope.fl[Symbol('extra')] = 1;
    if (kind === 'accessor') Object.defineProperty(envelope.fl, ns.dga, { get: getter });
    if (kind === 'fake') envelope.fl[ns.dga] = Object.create(Map.prototype);
    if (kind === 'subclass') envelope.fl[ns.dga] = new (class extends Map {})();
    if (kind === 'proxy') envelope.fl[ns.dga] = new Proxy(cache, {});
    if (kind === 'get') Object.defineProperty(cache, 'get', { get: getter });
    if (kind === 'iterator') cache[Symbol.iterator] = getter;
    const hjd = envelope.fl[1],
      bjd = hjd[6],
      ajd = bjd[0],
      holder = ajd[3];
    if (kind === 'wrong-path') hjd[ns.dga] = cache;
    if (kind === 'private') holder[ns.dga] = new Map([[ns.fM, 4]]);
    if (kind === 'IF') raw.fl[ns.dga] = new Map([[ns.fM, 4]]);
    if (kind === 'CI') raw.fl[1].fl[ns.dga] = new Map([[ns.SJd, 1]]);
    if (kind === 'typed-owner') envelope.fl[1] = new ns.RJd(hjd);
    expect(() => readGeminiNativeEnvelope(ns, envelope)).toThrowError(
      expect.objectContaining({ cause: 'response-shape' }),
    );
    expect(getter).not.toHaveBeenCalled();
    expect(f.calls.nativeSends).toBe(0);
  });
  it.each([
    'cache',
    'La',
    'dga',
    '$L',
    'ZL',
    'SJd',
    'YL',
    'descriptor',
    'group-content',
    'intrinsic',
  ] as const)('latches %s currentness failure after acceptance and refuses restoration', (kind) => {
    const f = geminiFixedTextContractFixture(),
      ns = f.namespace;
    const envelope: any = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true }));
    const receipt = createGeminiNativeReceipt(ns, f.approved);
    receipt.capture(envelope);
    const emitted = f.normalizeNative(envelope, { cid: '', rid: f.approved.clientTurnId });
    receipt.normalize(emitted.hf, emitted.aa);
    receipt.finishEnvelope();
    const cache = envelope.fl[ns.dga];
    Object.freeze(cache);
    const original = Object.getOwnPropertyDescriptors(ns);
    const mapGet = Object.getOwnPropertyDescriptor(Map.prototype, 'get')!;
    try {
      if (kind === 'cache') cache.set(ns.$L, 4);
      else if (kind === 'descriptor') Object.defineProperty(ns, '$L', { writable: false });
      else if (kind === 'group-content') ns.$L[0] = 9;
      else if (kind === 'intrinsic')
        Object.defineProperty(Map.prototype, 'get', { value: () => 2 });
      else ns[kind] = typeof ns[kind] === 'symbol' ? Symbol('replacement') : [...ns[kind]];
      expect(() => receipt.verify()).toThrow();
    } finally {
      Object.defineProperty(Map.prototype, 'get', mapGet);
      Object.defineProperties(ns, original);
      ns.$L[0] = 1;
      cache.set(ns.$L, 2);
    }
    expect(() => receipt.verify()).toThrow();
    expect(() => receipt.completion(f.completed)).toThrow();
  });
});

describe('Native66 trusted receive contract predicates', () => {
  function rejected(call: () => unknown, predicate: string) {
    let error: unknown;
    try {
      call();
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(Error);
    expect(fixedContract.readGeminiNativeReceivePredicate(error)).toBe(predicate);
    expect(fixedContract.readGeminiNativeOutboundDiagnostic(error)).toBe(
      predicate.startsWith('dispatch-native-n15-') ? predicate : undefined,
    );
    expect(JSON.stringify(error)).not.toContain('SYNTHETIC_PRIVATE');
  }
  it.each(['cache-shape', 'cache-intrinsic', 'cache-selection', 'envelope-shape'] as const)(
    'tags only existing %s refusal',
    (predicate) => {
      const f = geminiSdkWebChannelFixture(),
        ns = f.namespace;
      const envelope: any =
        predicate === 'envelope-shape'
          ? new ns.Kzd([])
          : f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid' }));
      if (predicate === 'cache-shape') envelope.fl[ns.dga] = new (class extends Map {})();
      if (predicate === 'cache-intrinsic') envelope.fl[ns.dga] = Object.create(Map.prototype);
      if (predicate === 'cache-selection') envelope.fl[ns.dga] = new Map([[ns.$L, 4]]);
      rejected(() => readGeminiNativeEnvelope(ns, envelope), predicate);
      expect(f.calls.query).toBe(0);
    },
  );
  it.each(['response-content', 'fields-raw-text'] as const)(
    'retains raw-reader %s through the native wrapper',
    (predicate) => {
      const f = geminiFixedTextContractFixture();
      const raw: any = f.nativeKf({ cid: 'c_47', rid: 'server-rid' });
      if (predicate === 'response-content') raw.fl[4][0].fl[1].fl[0] = 'SYNTHETIC_PRIVATE';
      else raw.fl[4][0].fl[1].fl[1] = 'SYNTHETIC_PRIVATE';
      rejected(() => readGeminiNativeEnvelope(f.namespace, f.nativeEnvelope(raw)), predicate);
    },
  );
  it.each([
    'lifecycle-feature',
    'receipt-state',
    'receipt-source',
    'receipt-frozen-identity',
    'receipt-backing',
    'receipt-content',
    'normalization-view',
    'normalization-clone',
    'normalization-identity',
  ] as const)('preserves %s at its owning unchanged assertion', (predicate) => {
    const f = geminiFixedTextContractFixture(),
      ns = f.namespace;
    const r = createGeminiNativeReceipt(ns, f.approved);
    const raw: any = f.nativeKf({
      cid: 'c_47',
      rid: predicate === 'normalization-clone' ? undefined : 'server-rid',
    });
    const envelope = f.nativeEnvelope(raw);
    if (predicate === 'lifecycle-feature') {
      raw.fl[64] = [];
      rejected(() => assertGeminiNativeLifecycleProfile(ns, raw), predicate);
      return;
    }
    r.capture(envelope);
    if (predicate === 'receipt-state') {
      rejected(() => r.capture(envelope), predicate);
      return;
    }
    if (predicate === 'receipt-source') {
      ns.Kaa = {};
      rejected(() => r.verify(), predicate);
      return;
    }
    const emitted: any = f.normalizeNative(envelope, { cid: '', rid: f.approved.clientTurnId });
    if (predicate === 'normalization-view') {
      rejected(() => r.normalize({}, emitted.aa), predicate);
      return;
    }
    if (predicate === 'normalization-clone') {
      emitted.hf.Fb = ns.Kaa;
      rejected(() => r.normalize(emitted.hf, emitted.aa), predicate);
      return;
    }
    if (predicate === 'normalization-identity') {
      emitted.hf.fl[1].fl[1] = 'wrong-rid';
      rejected(() => r.normalize(emitted.hf, emitted.aa), predicate);
      return;
    }
    r.normalize(emitted.hf, emitted.aa);
    if (predicate === 'receipt-frozen-identity') emitted.aa.fl[1] = 'wrong-rid';
    if (predicate === 'receipt-backing')
      emitted.hf.fl = Object.defineProperties([], Object.getOwnPropertyDescriptors(emitted.hf.fl));
    if (predicate === 'receipt-content') emitted.hf.fl[14] = true;
    rejected(() => r.verify(), predicate);
  });
  it('does not infer trusted provenance from provider causes, symbols, inherited fields or accessors', () => {
    const getter = vi.fn(() => 'response-content');
    const forged = Object.defineProperty(
      new Error('', { cause: 'response-content' }),
      'geminiNativeReceiveDiagnostic',
      { get: getter },
    );
    expect(fixedContract.readGeminiNativeReceivePredicate(forged)).toBeUndefined();
    expect(getter).not.toHaveBeenCalled();
  });
});

describe('Native67 field-boundary predicates', () => {
  function failure(call: () => unknown) {
    let error: unknown;
    try {
      call();
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(Error);
    expect(JSON.stringify(error)).not.toContain('SYNTHETIC_PRIVATE');
    return fixedContract.readGeminiNativeReceivePredicate(error);
  }
  const boundaries = [
    'envelope-other',
    'hjd-ignored-branch',
    'hjd-other',
    'bjd-ignored-branch',
    'bjd-other',
    'ajd-ignored-branch',
    'ajd-other',
    'native-holder',
    'raw-identity',
    'raw-location',
    'raw-routing',
    'raw-client',
    'raw-fallback',
    'raw-candidate',
    'raw-candidate-extra',
    'raw-status',
    'raw-text',
    'raw-structured',
    'raw-node',
    'raw-plain',
  ] as const;
  it.each(boundaries)(
    'identifies %s while preserving refusal and provider read counts',
    (boundary) => {
      const f = geminiFixedTextContractFixture(),
        ns = f.namespace;
      const raw: any = f.nativeKf({ cid: 'c_47', rid: 'server-rid' });
      let envelope: any = f.nativeEnvelope(raw);
      const hjd = envelope.fl[1],
        bjd = hjd[6],
        ajd = bjd[0],
        holder = ajd[3];
      if (boundary === 'envelope-other') envelope.fl[6] = [];
      for (const [name, value, selected, ignored, other] of [
        ['hjd', hjd, 7, 2, 10],
        ['bjd', bjd, 1, 2, 3],
        ['ajd', ajd, 4, 3, 5],
      ] as const) {
        if (boundary === name + '-ignored-branch') {
          delete value[selected - 1];
          value[ignored - 1] = [];
        }
        if (boundary === name + '-other') value[other - 1] = [];
      }
      if (boundary === 'native-holder') holder[4] = [];
      if (boundary === 'raw-identity') raw.fl[1].fl[2] = 'SYNTHETIC_PRIVATE';
      if (boundary === 'raw-location') raw.fl[5] = f.wire({ 4: [] });
      if (boundary === 'raw-routing') raw.fl[20] = f.message('DAd', { 2: [] });
      if (boundary === 'raw-client') raw.fl[64] = f.wire({ 2: [] });
      if (boundary === 'raw-fallback') raw.fl[54] = f.wire({ 1: [] });
      const candidate = raw.fl[4][0];
      if (boundary === 'raw-candidate') candidate.fl[2] = [];
      if (boundary === 'raw-candidate-extra') candidate.fl[12] = f.message('$v', { 1: [] });
      if (boundary === 'raw-status') candidate.fl[8] = f.wire({ 1: 2, 2: [] });
      if (boundary === 'raw-text') candidate.fl[1].fl[1] = 'SYNTHETIC_PRIVATE';
      if (['raw-structured', 'raw-node', 'raw-plain'].includes(boundary)) {
        const plain = f.message('gH', { 2: 0, 3: GEMINI_FIXED_TEXT_TRIAL_ANSWER });
        const node = f.message('oH', { 2: plain });
        const content = f.message('qH', { 1: [node] });
        raw.fl[26] = [content];
        if (boundary === 'raw-structured') content.fl[1] = [];
        if (boundary === 'raw-node') node.fl[18] = []; // Field19 is outside qH; exercise the node field predicate.
        if (boundary === 'raw-plain') plain.fl[0] = [];
      }
      const before = { ...f.calls };
      expect(failure(() => readGeminiNativeEnvelope(ns, envelope))).toBe('fields-' + boundary);
      expect(f.calls).toEqual(before);
    },
  );
  it.each([1, 4])(
    'Native69 keeps unsupported oneof refusal with ancillary%s and later unknown10',
    (field) => {
      const f = geminiFixedTextContractFixture();
      const envelope: any = f.nativeEnvelope(f.nativeKf({ cid: 'c_47' }));
      const hjd = envelope.fl[1];
      delete hjd[6];
      hjd[1] = [];
      hjd[field - 1] = [];
      hjd[9] = [];
      expect(failure(() => readGeminiNativeEnvelope(f.namespace, envelope))).toBe(
        'fields-hjd-ignored-branch',
      );
    },
  );
  it('distinguishes retained prior Aa from raw identity and latches refusal after restoration', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const first = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid' }));
    r.capture(first);
    const emitted = f.normalizeNative(first, { cid: '', rid: f.approved.clientTurnId });
    r.normalize(emitted.hf, emitted.aa);
    r.finishEnvelope();
    (emitted.aa as any).fl[2] = 'SYNTHETIC_PRIVATE';
    const second = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid' }));
    expect(failure(() => r.capture(second))).toBe('fields-prior-aa-identity');
    delete (emitted.aa as any).fl[2];
    expect(failure(() => r.capture(second))).toBe('receipt-state');
    expect(() => r.completion(f.completed)).toThrow();
  });
  it('does not invoke malformed field accessors or replace their earlier leaf', () => {
    const f = geminiFixedTextContractFixture();
    const envelope: any = f.nativeEnvelope(f.nativeKf({ cid: 'c_47' }));
    const getter = vi.fn(() => []);
    Object.defineProperty(envelope.fl[1], '0', { get: getter });
    expect(failure(() => readGeminiNativeEnvelope(f.namespace, envelope))).toBe(
      'dispatch-native-n15-own-data',
    );
    expect(getter).not.toHaveBeenCalled();
  });
});

it('Native68 classifies a known ignored root with one existing Map enumeration and no provider methods', () => {
  const f = geminiFixedTextContractFixture();
  const envelope = f.frozen(f.message('Kzd', { 1: [] }));
  const before = { ...f.calls };
  const keys = vi.spyOn(Map.prototype, 'keys');
  const result = readGeminiNativeEnvelope(f.namespace, envelope);
  expect(keys).toHaveBeenCalledTimes(1);
  keys.mockRestore();
  expect(result.kind).toBe('ignored');
  expect(f.calls).toEqual(before);
});

it('Native67 leaves the shared RPC raw-reader fields fallback generic', () => {
  const f = geminiFixedTextContractFixture();
  (f.live as any).fl[4][0].fl[1].fl[1] = 'SYNTHETIC_PRIVATE';
  let error: unknown;
  try {
    fixedContract.readGeminiTrialRawFrame(f.namespace, f.live);
  } catch (caught) {
    error = caught;
  }
  expect(error).toBeInstanceOf(Error);
  expect(error).toMatchObject({ cause: 'response-content' });
  expect(fixedContract.readGeminiNativeReceivePredicate(error)).toBeUndefined();
});

describe('Native68 source-ignored envelope receipts', () => {
  it.each([
    ['root', 1],
    ['root', 3],
    ['root', 6],
    ['hjd', 2],
    ['bjd', 2],
    ['ajd', 3],
  ] as const)('finishes root %s/%s without output and retains nested refusal', (owner, field) => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const before = r.identity(),
      payload = ['SYNTHETIC_IGNORED', { value: true }];
    const envelope = f.nativeIgnored(owner, field, payload);
    if (owner !== 'root') {
      expect(() => r.capture(envelope)).toThrow();
      expect(() => r.capture(f.nativeIgnored('root', 1))).toThrow();
      return;
    }
    expect(r.capture(envelope)).toMatchObject({ kind: 'ignored', envelope });
    expect(r.identity()).toEqual(before);
    expect(r.pending()).toBe(true);
    r.verify();
    r.finishEnvelope();
    expect(r.pending()).toBe(false);
    expect(r.identity()).toEqual(before);
  });
  it('keeps unused ignored payload opaque and finishes before a valid final response', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const inspect = vi.fn(() => {
      throw Error('UNUSED_OPAQUE_PAYLOAD');
    });
    const payload = Object.defineProperty({}, 'private', { get: inspect });
    const envelope = f.nativeIgnored('root', 1, [payload]);
    expect(r.capture(envelope)).toMatchObject({ kind: 'ignored' });
    r.verify();
    r.finishEnvelope();
    expect(inspect).not.toHaveBeenCalled();
    expect(r.pending()).toBe(false);
    const incoming = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true }));
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
    expect(r.normalize(emitted.hf, emitted.aa).observation.completed).toEqual(f.completed);
    r.finishEnvelope();
  });
});

for (const representation of ['array', 'typed'] as const)
  for (const readonly of [false, true])
    it.each([
      ['root', 1],
      ['hjd', 2],
      ['bjd', 2],
      ['ajd', 3],
    ] as const)(
      `Native68 source getter materialization keeps same backing for ${representation}, readonly=${readonly}, %s/%s`,
      (owner, field) => {
        const f = geminiSdkWebChannelFixture('json', true),
          ns = f.namespace;
        const envelope: any = f.nativeIgnored(owner, field);
        if (!readonly) envelope.fl[ns.La] &= ~2;
        const originalBacking = envelope.fl,
          payload = owner === 'root' ? envelope.fl[field - 1] : undefined;
        if (representation === 'typed' && owner !== 'root') {
          const hjd = ns.bi(envelope, ns.XJd, 2, ns.$L);
          if (owner === 'bjd' || owner === 'ajd') {
            const bjd = ns.bi(hjd, ns.RJd, 7, ns.ZL);
            if (owner === 'ajd') ns.bi(bjd, ns.QJd, 1, ns.SJd);
          }
        }
        const r = createGeminiNativeReceipt(ns, f.approved);
        if (owner === 'root') expect(r.capture(envelope)).toMatchObject({ kind: 'ignored' });
        const original = ns.wKd(f.api.Ab, f.api.Ia, { xR: f.metadata });
        const next = vi.fn();
        original.wB.subscribe(next);
        original.connection.Ki.next({ eventType: 'channel_message', message: envelope });
        expect(f.deferredErrors).toEqual([]);
        expect(next).not.toHaveBeenCalled();
        if (owner === 'root') {
          r.verify();
          r.finishEnvelope();
        } else expect(() => r.capture(envelope)).toThrow();
        expect(envelope.fl).toBe(originalBacking);
        if (owner === 'root') expect(envelope.fl[field - 1]).toBe(payload);
        expect(r.pending()).toBe(false);
      },
    );

it.each([
  'selection',
  'payload-reference',
  'backing',
  'descriptor',
  'flag',
  'cache',
  'namespace',
  'packed-slot',
] as const)(
  'Native68 ignored-root %s currentness failure remains sticky after restoration',
  (kind) => {
    const f = geminiSdkWebChannelFixture('json', true),
      ns = f.namespace;
    const payload = ['SYNTHETIC_OPAQUE'];
    const envelope: any =
      kind === 'packed-slot' ? new ns.Kzd([{ 1: payload }]) : f.nativeIgnored('root', 1, payload);
    const r = createGeminiNativeReceipt(ns, f.approved);
    r.capture(envelope);
    ns.Xh(envelope, ns.$L);
    r.verify();
    const raw = envelope.fl,
      original = Object.getOwnPropertyDescriptors(raw),
      symbol = ns.dga;
    const tail = kind === 'packed-slot' ? raw[0] : undefined;
    const oldTail = tail && Object.getOwnPropertyDescriptors(tail);
    if (kind === 'selection') {
      delete raw[0];
      raw[2] = payload;
    }
    if (kind === 'payload-reference') raw[0] = ['SYNTHETIC_OPAQUE'];
    if (kind === 'backing') envelope.fl = raw.slice();
    if (kind === 'descriptor') Object.defineProperty(raw, '0', { writable: false });
    if (kind === 'flag') raw[ns.La] ^= 16;
    if (kind === 'cache') raw[ns.dga] = new Map([[ns.$L, 1]]);
    if (kind === 'namespace') ns.dga = Symbol('SYNTHETIC_REPLACEMENT');
    if (kind === 'packed-slot') tail[1] = ['SYNTHETIC_OPAQUE'];
    expect(() => r.verify()).toThrow();
    ns.dga = symbol;
    envelope.fl = raw;
    for (const key of Reflect.ownKeys(raw)) if (!Object.hasOwn(original, key)) delete raw[key];
    Object.defineProperties(raw, original);
    if (tail) Object.defineProperties(tail, oldTail);
    expect(() => r.verify()).toThrow();
    expect(() => r.finishEnvelope()).toThrow();
    expect(() =>
      r.completion({
        conversationId: 'c_47',
        turnId: 'r_48',
        candidateId: 'rc_49',
        answer: 'CROSSCHECK_GEMINI_OK',
      }),
    ).toThrow();
  },
);

it.each(['unknown', 'mixed', 'empty', 'wrong-owner', 'extra-symbol'] as const)(
  'Native68 ignored-root admission keeps %s closed',
  (kind) => {
    const f = geminiSdkWebChannelFixture('json', true),
      ns = f.namespace;
    let envelope: any = f.nativeIgnored('root', 1);
    if (kind === 'unknown') envelope.fl[6] = [];
    if (kind === 'mixed') envelope.fl[1] = [];
    if (kind === 'empty') envelope = new ns.Kzd([]);
    if (kind === 'wrong-owner') envelope = new ns.XJd(envelope.fl);
    if (kind === 'extra-symbol') envelope.fl[Symbol('SYNTHETIC_EXTRA')] = true;
    const r = createGeminiNativeReceipt(ns, f.approved);
    expect(() => r.capture(envelope)).toThrow();
    expect(() => r.capture(f.nativeIgnored('root', 1))).toThrow();
    expect(f.calls.query).toBe(0);
  },
);

it('Native68 ignored receipt cannot normalize, finish twice or authorize completion', () => {
  const f = geminiFixedTextContractFixture();
  const r = createGeminiNativeReceipt(f.namespace, f.approved);
  r.capture(f.nativeIgnored('root', 1));
  expect(() => r.normalize(f.nativeKf({ cid: 'c_47', rid: 'r_48' }), {})).toThrow();
  expect(() => r.finishEnvelope()).toThrow();
  const finished = createGeminiNativeReceipt(f.namespace, f.approved);
  finished.capture(f.nativeIgnored('root', 3));
  finished.finishEnvelope();
  expect(() => finished.finishEnvelope()).toThrow();
  expect(() => finished.completion(f.completed)).toThrow();
});

describe('Native69 selected response wrapper ancillary metadata', () => {
  const cases = [
    ['hjd', 1, 7n],
    ['hjd', 4, []],
    ['ajd', 1, true],
    ['ajd', 2, ['c_dead']],
    ['holder', 1, []],
    ['holder', 2, []],
    ['holder', 3, []],
  ] as const;
  it.each(cases)(
    'accepts source-declared %s/%s alongside the selected response',
    (owner, field, value) => {
      const f = geminiFixedTextContractFixture(),
        r = createGeminiNativeReceipt(f.namespace, f.approved);
      const raw = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
      const incoming = f.nativeEnvelope(raw, { [owner]: { [field]: value } });
      expect(readGeminiNativeEnvelope(f.namespace, incoming)).toMatchObject({
        kind: 'response',
        raw,
      });
      r.capture(incoming);
      const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
      r.normalize(emitted.hf, emitted.aa);
      r.finishEnvelope();
      r.terminal();
      expect(r.completion(f.completed)).toEqual(f.completed);
    },
  );
  it('leaves an unused ancillary message interior unread independently of int64 metadata', () => {
    const f = geminiFixedTextContractFixture();
    const getter = vi.fn(() => {
      throw Error('SYNTHETIC_UNUSED');
    });
    const opaque = Object.defineProperty([], '0', { get: getter });
    const incoming = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'r_48' }), {
      hjd: { 4: opaque },
    });
    expect(readGeminiNativeEnvelope(f.namespace, incoming)).toMatchObject({ kind: 'response' });
    expect(getter).not.toHaveBeenCalled();
  });
  it('accepts the combined ancillary family while leaving unused message interiors opaque', () => {
    const f = geminiFixedTextContractFixture(),
      r = createGeminiNativeReceipt(f.namespace, f.approved);
    const getter = vi.fn(() => {
      throw Error('SYNTHETIC_UNUSED');
    });
    const opaque = Object.defineProperty([], '0', { get: getter });
    const incoming = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true }), {
      hjd: { 1: 7n, 4: opaque },
      ajd: { 1: true, 2: ['c_dead'] },
      holder: { 1: [], 2: [], 3: [] },
    });
    r.capture(incoming);
    const emitted = f.normalizeNative(incoming, { cid: '', rid: f.approved.clientTurnId });
    r.normalize(emitted.hf, emitted.aa);
    r.verify();
    r.finishEnvelope();
    r.terminal();
    expect(r.completion(f.completed)).toEqual(f.completed);
    expect(getter).not.toHaveBeenCalled();
  });
});

describe('Native69 ancillary admission keeps owner and selected evidence closed', () => {
  function make() {
    const f = geminiFixedTextContractFixture();
    const raw: any = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
    const envelope: any = f.nativeEnvelope(raw, {
      hjd: { 1: 7n, 4: [] },
      ajd: { 1: true, 2: ['c_dead'] },
      holder: { 1: [], 2: [], 3: [] },
    });
    const hjd = envelope.fl[1],
      bjd = hjd[6],
      ajd = bjd[0],
      holder = ajd[3];
    return {
      f,
      raw,
      envelope,
      owners: { hjd, bjd, ajd, holder },
      r: createGeminiNativeReceipt(f.namespace, f.approved),
    };
  }
  it.each([
    ['hjd', 10, 'fields-hjd-other'],
    ['bjd', 3, 'fields-bjd-other'],
    ['ajd', 5, 'fields-ajd-other'],
    ['holder', 5, 'fields-native-holder'],
  ] as const)('refuses unknown %s/%s despite all ancillary metadata', (owner, field, predicate) => {
    const { f, envelope, owners, r } = make();
    owners[owner][field - 1] = [];
    let error: unknown;
    try {
      r.capture(envelope);
    } catch (caught) {
      error = caught;
    }
    expect(fixedContract.readGeminiNativeReceivePredicate(error)).toBe(predicate);
    delete owners[owner][field - 1];
    expect(() => r.capture(envelope)).toThrow();
    expect(() => r.completion(f.completed)).toThrow();
  });
  it.each([
    ['hjd', 7],
    ['bjd', 1],
    ['ajd', 4],
    ['holder', 4],
  ] as const)('requires selected %s/%s even with ancillary metadata', (owner, field) => {
    const { envelope, owners, r } = make();
    delete owners[owner][field - 1];
    expect(() => r.capture(envelope)).toThrow();
  });
  it.each([
    ['hjd', 7, 2],
    ['bjd', 1, 2],
    ['ajd', 4, 3],
  ] as const)('keeps unsupported %s alternative%s closed', (owner, selected, alternative) => {
    const { envelope, owners, r } = make();
    delete owners[owner][selected - 1];
    owners[owner][alternative - 1] = [];
    let error: unknown;
    try {
      r.capture(envelope);
    } catch (caught) {
      error = caught;
    }
    expect(fixedContract.readGeminiNativeReceivePredicate(error)).toBe(
      'fields-' + owner + '-ignored-branch',
    );
  });
  it.each(['mixed', 'cache', 'accessor'] as const)(
    'rejects %s at the owning ancillary wrapper',
    (kind) => {
      const { f, envelope, owners, r } = make();
      const getter = vi.fn(() => 7n);
      if (kind === 'mixed') owners.hjd[1] = [];
      if (kind === 'cache') owners.hjd[f.namespace.dga] = new Map([[f.namespace.ZL, 2]]);
      if (kind === 'accessor') Object.defineProperty(owners.hjd, '0', { get: getter });
      expect(() => r.capture(envelope)).toThrow();
      expect(getter).not.toHaveBeenCalled();
    },
  );
  it.each(['raw', 'Aa', 'source', 'selected'] as const)(
    'retains sticky %s refusal after restoration with opaque metadata',
    (kind) => {
      const { f, raw, envelope, owners, r } = make();
      r.capture(envelope);
      const emitted: any = f.normalizeNative(envelope, { cid: '', rid: f.approved.clientTurnId });
      r.normalize(emitted.hf, emitted.aa);
      let restore: () => void;
      if (kind === 'raw') {
        const prior = raw.fl[14];
        raw.fl[14] = false;
        restore = () => {
          raw.fl[14] = prior;
        };
      } else if (kind === 'Aa') {
        const prior = emitted.aa.fl[0];
        emitted.aa.fl[0] = 'c_dead';
        restore = () => {
          emitted.aa.fl[0] = prior;
        };
      } else if (kind === 'source') {
        const prior = f.namespace.m;
        f.namespace.m = () => undefined;
        restore = () => {
          f.namespace.m = prior;
        };
      } else {
        const holder = (owners.ajd[3] as any).fl ?? owners.ajd[3];
        const prior = holder[3];
        holder[3] = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
        restore = () => {
          holder[3] = prior;
        };
      }
      try {
        expect(() => r.verify()).toThrow();
      } finally {
        restore();
      }
      expect(() => r.verify()).toThrow();
      expect(() => r.completion(f.completed)).toThrow();
    },
  );
  it.each(['hjd', 'ajd', 'holder'] as const)(
    'parses source wire packed %s slots without decoding unused metadata',
    (owner) => {
      const { f, raw, envelope, owners } = make();
      const value = owners[owner];
      const tail: Record<number, unknown> = {};
      for (let i = 0; i < value.length; i++) if (value[i] != null) tail[i + 1] = value[i];
      value.splice(0, value.length, tail);
      expect(readGeminiNativeEnvelope(f.namespace, envelope)).toMatchObject({
        kind: 'response',
        raw,
      });
      // Packed parsing is a contract check; fixture Qoa does not model packed selected getters.
    },
  );
  it('does not use changing unused metadata as identity or content evidence', () => {
    const { f, envelope, owners, r } = make();
    r.capture(envelope);
    const emitted = f.normalizeNative(envelope, { cid: '', rid: f.approved.clientTurnId });
    r.normalize(emitted.hf, emitted.aa);
    const ajd = owners.bjd[0].fl ?? owners.bjd[0];
    ajd[1] = ['c_bad', 'SYNTHETIC_UNUSED'];
    r.verify();
    r.finishEnvelope();
    r.terminal();
    expect(r.completion(f.completed)).toEqual(f.completed);
  });
});

it('Native69 ancillary exclusions do not relax rawHF bigint validation', () => {
  const f = geminiFixedTextContractFixture(),
    raw: any = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
  raw.fl[0] = 7n;
  expect(() =>
    readGeminiNativeEnvelope(f.namespace, f.nativeEnvelope(raw, { hjd: { 1: 7n, 4: [] } })),
  ).toThrow();
});

describe('Native70 full original source cache producers', () => {
  it.each(['candidate', 'routing'] as const)(
    'keeps the source-produced HF/GF %s cache current after capture and normalize',
    async (kind) => {
      const { geminiSdkWebChannelFixture } =
        await import('../../fixtures/providers/gemini-sdk-webchannel');
      const f = geminiSdkWebChannelFixture('json', true),
        ns = f.namespace;
      const raw: any = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: kind === 'candidate' });
      if (kind === 'routing') {
        delete raw.fl[4];
        raw.fl[20] = new ns.DAd(['SYNTHETIC_ROUTING']);
      }
      const r = createGeminiNativeReceipt(ns, f.approved);
      r.capture(f.nativeEnvelope(raw));
      const aa = ns.Rh(ns.NI(ns.MI(new ns.CI(), 'c_47'), 'r_48'));
      r.normalize(raw, aa);
      const next = vi.fn(),
        error = vi.fn();
      f.projectOriginal(raw, { next, error });
      expect(error).not.toHaveBeenCalled();
      expect(next.mock.calls.map(([event]) => event.responseType)).toEqual(
        kind === 'routing' ? ['ROUTING'] : ['TURN_COMPLETED', 'TURN'],
      );
      if (kind === 'candidate')
        expect(next.mock.calls[1]?.[0].response.draft.j3).toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
      expect(raw.fl[ns.dga]).toBeInstanceOf(Map);
      expect(raw.fl[ns.dga].size).toBe(1);
      expect(raw.fl[ns.dga].get(ns.HF)).toBe(kind === 'candidate' ? 0 : 21);
      expect(f.deferredErrors).toEqual([]);
      let failure: unknown;
      try {
        r.verify();
      } catch (error) {
        failure = error;
      }
      expect(fixedContract.readGeminiNativeReceivePredicate(failure)).toBeUndefined();
      expect(failure).toBeUndefined();
      r.finishEnvelope();
      expect(() => r.verify()).not.toThrow();
    },
  );
});

describe('Native70 source structured node producer', () => {
  it.each([false, true])(
    'retains exact source pH/qH cache with singleton=%s',
    async (singleton) => {
      const { geminiSdkWebChannelFixture } =
        await import('../../fixtures/providers/gemini-sdk-webchannel');
      const f = geminiSdkWebChannelFixture('json', true),
        ns = f.namespace;
      f.singletonFormat(singleton);
      const raw: any = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
      const plain = new ns.gH([undefined, 0, GEMINI_FIXED_TEXT_TRIAL_ANSWER]);
      const node = new ns.oH([undefined, plain]);
      raw.fl[26] = [new ns.qH([[node]])];
      const r = createGeminiNativeReceipt(ns, f.approved);
      r.capture(f.nativeEnvelope(raw));
      r.normalize(raw, ns.Rh(ns.NI(ns.MI(new ns.CI(), 'c_47'), 'r_48')));
      const next = vi.fn(),
        error = vi.fn();
      f.projectOriginal(raw, { next, error });
      expect(error).not.toHaveBeenCalled();
      expect(next.mock.calls.map(([value]) => value.responseType)).toEqual([
        'TURN_COMPLETED',
        'TURN',
      ]);
      expect(next.mock.calls[1]?.[0].response.draft.structuredContent).toEqual({
        children: [{ nodeType: 18, text: GEMINI_FIXED_TEXT_TRIAL_ANSWER }],
      });
      expect(raw.fl[ns.dga].get(ns.HF)).toBe(0);
      expect(node.fl[ns.dga]).toBeInstanceOf(Map);
      expect(node.fl[ns.dga].size).toBe(1);
      expect(node.fl[ns.dga].get(ns.pH)).toBe(2);
      expect(f.deferredErrors).toEqual([]);
      let failure: unknown;
      try {
        r.verify();
      } catch (error) {
        failure = error;
      }
      expect(fixedContract.readGeminiNativeReceivePredicate(failure)).toBeUndefined();
      expect(failure).toBeUndefined();
      r.finishEnvelope();
      expect(() => r.verify()).not.toThrow();
      expect(() => readGeminiNativeEnvelope(ns, f.nativeEnvelope(raw))).not.toThrow();
    },
  );
});

describe('Native70 native cache ownership and lifetime', () => {
  async function source(structured = true, route = false) {
    const { geminiSdkWebChannelFixture } =
      await import('../../fixtures/providers/gemini-sdk-webchannel');
    const f = geminiSdkWebChannelFixture('json', true),
      ns = f.namespace;
    const raw: any = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: !route });
    const plain = new ns.gH([undefined, 0, GEMINI_FIXED_TEXT_TRIAL_ANSWER]);
    const node = new ns.oH([undefined, plain]);
    const content = new ns.qH([[node]]);
    if (structured && !route) raw.fl[26] = [content];
    if (route) {
      delete raw.fl[4];
      raw.fl[20] = new ns.DAd(['SYNTHETIC_ROUTING']);
    }
    const envelope: any = f.nativeEnvelope(raw);
    const r = createGeminiNativeReceipt(ns, f.approved);
    r.capture(envelope);
    const aa = ns.Rh(ns.NI(ns.MI(new ns.CI(), 'c_47'), 'r_48'));
    r.normalize(raw, aa);
    const next = vi.fn(),
      error = vi.fn();
    f.projectOriginal(raw, { next, error });
    expect(error).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(route ? 1 : 2);
    expect(f.deferredErrors).toEqual([]);
    r.verify();
    return { f, ns, raw, node, plain, content, envelope, r, aa };
  }
  for (const role of ['IF', 'oH'] as const) {
    it.each([
      'equal-group',
      'group-content',
      'group-descriptor',
      'group-key',
      'wrong-key',
      'selection',
      'extra-group',
      'fake',
      'proxy',
      'subclass',
      'own-get',
      'accessor',
      'unknown-string',
      'unknown-symbol',
      'mixed-fields',
      'repeated-flags',
      'backing',
      'text',
      'Aa',
      'source',
    ] as const)(
      `${role} refuses %s after the exact source producer and remains sticky after restoration`,
      async (kind) => {
        const { ns, raw, node, r, aa } = await source();
        const groupKey = role === 'IF' ? 'HF' : 'pH',
          group = ns[groupKey];
        const target = role === 'IF' ? raw : node,
          backing = target.fl;
        const cache = backing[ns.dga];
        const descriptor = Object.getOwnPropertyDescriptor(ns, groupKey)!;
        const cacheDescriptor = Object.getOwnPropertyDescriptor(backing, ns.dga)!;
        const previousSource = ns.Lg;
        const originalFields = backing.slice();
        const previousIdentity = aa.fl[1];
        const getter = vi.fn(() => cache);
        if (kind === 'equal-group') ns[groupKey] = group.slice();
        if (kind === 'group-content') group[0] = 999;
        if (kind === 'group-descriptor')
          Object.defineProperty(ns, groupKey, { enumerable: !descriptor.enumerable });
        if (kind === 'group-key') group[Symbol('unknown')] = true;
        if (kind === 'wrong-key') {
          cache.clear();
          cache.set(group.slice(), role === 'IF' ? 0 : 2);
        }
        if (kind === 'selection') cache.set(group, role === 'IF' ? 21 : 0);
        if (kind === 'extra-group') cache.set([], 0);
        if (kind === 'fake') backing[ns.dga] = Object.create(Map.prototype);
        if (kind === 'proxy') backing[ns.dga] = new Proxy(cache, {});
        if (kind === 'subclass')
          backing[ns.dga] = new (class extends Map {})().set(group, role === 'IF' ? 0 : 2);
        if (kind === 'own-get') {
          cache.get = getter;
        }
        if (kind === 'accessor')
          Object.defineProperty(backing, ns.dga, { get: getter, configurable: true });
        if (kind === 'unknown-string') backing.extra = true;
        if (kind === 'unknown-symbol') backing[Symbol('unknown')] = true;
        if (kind === 'mixed-fields') backing[role === 'IF' ? 20 : 2] = [];
        const originalFlags = backing[ns.La];
        if (kind === 'repeated-flags') backing[ns.La] |= 1;
        if (kind === 'backing') target.fl = backing.slice();
        if (kind === 'text') backing[role === 'IF' ? 19 : 1] = 'SYNTHETIC_CHANGED';
        if (kind === 'Aa') aa.fl[1] = 'r_changed';
        if (kind === 'source') ns.Lg = () => raw;
        expect(() => r.verify()).toThrow();
        expect(getter).not.toHaveBeenCalled();
        Object.defineProperty(ns, groupKey, descriptor);
        group[0] = role === 'IF' ? 11 : 1;
        for (const key of Object.getOwnPropertySymbols(group)) Reflect.deleteProperty(group, key);
        Object.defineProperty(backing, ns.dga, cacheDescriptor);
        cache.clear();
        cache.set(group, role === 'IF' ? 0 : 2);
        Reflect.deleteProperty(cache, 'get');
        for (const key of Reflect.ownKeys(backing))
          if (key !== 'length' && key !== ns.La && key !== ns.dga)
            Reflect.deleteProperty(backing, key);
        backing.length = originalFields.length;
        originalFields.forEach((value: unknown, index: number) => (backing[index] = value));
        target.fl = backing;
        backing[ns.La] = originalFlags;
        aa.fl[1] = previousIdentity;
        ns.Lg = previousSource;
        expect(() => r.verify()).toThrow();
      },
    );
  }
  it.each([
    'CI',
    'candidate',
    'candidate-text',
    'candidate-status',
    'candidates',
    'qH',
    'rH-list',
    'pH-list',
    'gH',
    'holder',
    'group',
  ] as const)('rejects a coherent source cache copied onto forbidden %s owner', async (owner) => {
    const { ns, raw, node, plain, content, envelope, r } = await source();
    const targets: Record<string, any> = {
      CI: raw.fl[1].fl,
      candidate: raw.fl[4][0].fl,
      'candidate-text': raw.fl[4][0].fl[1].fl,
      'candidate-status': raw.fl[4][0].fl[8].fl,
      candidates: raw.fl[4],
      qH: content.fl,
      'rH-list': raw.fl[26],
      'pH-list': content.fl[0],
      gH: plain.fl,
      holder: envelope.fl[1][6][0][3],
      group: ns.pH,
    };
    if (['candidates', 'rH-list', 'pH-list'].includes(owner)) {
      targets[owner] = targets[owner].slice();
      if (owner === 'candidates') raw.fl[4] = targets[owner];
      if (owner === 'rH-list') raw.fl[26] = targets[owner];
      if (owner === 'pH-list') content.fl[0] = targets[owner];
    }
    targets[owner][ns.dga] = node.fl[ns.dga];
    expect(() => readGeminiNativeEnvelope(ns, envelope)).toThrow();
    expect(() => r.verify()).toThrow();
  });
  it.each(['raw', 'typed', 'mutable', 'logical-readonly', 'packed'] as const)(
    'capture, direct content, lifecycle, normalize and terminal reads retain already-produced %s metadata',
    async (representation) => {
      const { f, ns, raw, node, r } = await source();
      r.finishEnvelope();
      const convert = (value: any): any => {
        const data = Array.isArray(value) ? value : value?.fl;
        if (!data) return value;
        const result = data.map(convert);
        Object.defineProperty(result, ns.La, { value: data[ns.La] ?? 0, writable: true });
        if (data[ns.dga]) result[ns.dga] = data[ns.dga];
        return result;
      };
      let value: any = raw;
      if (representation === 'raw') value = convert(raw);
      if (representation === 'mutable') raw.fl[ns.La] &= ~2;
      if (representation === 'logical-readonly') {
        raw.Fb = ns.Kaa;
        raw.tcc = ns.Kaa;
      }
      if (representation === 'packed') {
        const cache = node.fl[ns.dga],
          plain = node.fl[1];
        node.fl = [{ 2: plain }];
        Object.defineProperty(node.fl, ns.La, { value: 2144, writable: true });
        node.fl[ns.dga] = cache;
      }
      const nextReceipt = createGeminiNativeReceipt(ns, f.approved);
      const envelope = f.nativeEnvelope(value);
      expect(() => readGeminiNativeEnvelope(ns, envelope)).not.toThrow();
      expect(() => assertGeminiNativeLifecycleProfile(ns, value)).not.toThrow();
      nextReceipt.capture(envelope);
      if (representation === 'raw') {
        const hjd = ns.bi(envelope, ns.XJd, 2, ns.$L),
          bjd = ns.bi(hjd, ns.RJd, 7, ns.ZL),
          ajd = ns.bi(bjd, ns.QJd, 1, ns.SJd);
        value = ns.m(ns.PJd(ajd), ns.IF, 4);
      }
      nextReceipt.normalize(value, ns.Rh(ns.NI(ns.MI(new ns.CI(), 'c_47'), 'r_48')));
      nextReceipt.terminal();
      nextReceipt.finishEnvelope();
      expect(() => nextReceipt.verify()).not.toThrow();
      expect(
        nextReceipt.completion({
          conversationId: 'c_47',
          turnId: 'r_48',
          candidateId: 'rc_49',
          answer: GEMINI_FIXED_TEXT_TRIAL_ANSWER,
        }),
      ).toMatchObject({ turnId: 'r_48' });
    },
  );
  it.each([11, 23, 28, 37, 49, 51])(
    'coherent unsupported GF selection%s never authorizes content',
    async (field) => {
      const { f, ns, raw } = await source(false);
      delete raw.fl[4];
      raw.fl[14] = false;
      raw.fl[field - 1] = [];
      raw.fl[ns.dga].set(ns.HF, field);
      expect(() => readGeminiNativeEnvelope(ns, f.nativeEnvelope(raw))).toThrow();
    },
  );
  it('does not carry HF permission into standalone RPC raw reading', async () => {
    const { f, ns, raw } = await source(false);
    expect(() => fixedContract.readGeminiTrialRawFrame(ns, raw)).toThrow();
    expect(() => captureGeminiNativeWireContent(ns, new ns.CI([raw.fl]), 'CI', true)).toThrow();
    expect(f.deferredErrors).toEqual([]);
  });
});

it('Native70 retaining full YLd materializes exact lexical m1c status before currentness', async () => {
  const { geminiSdkWebChannelFixture } =
    await import('../../fixtures/providers/gemini-sdk-webchannel');
  const f = geminiSdkWebChannelFixture('json', true),
    ns = f.namespace;
  const raw: any = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true }),
    statusBacking = raw.fl[4][0].fl[8];
  const r = createGeminiNativeReceipt(ns, f.approved);
  r.capture(f.nativeEnvelope(raw));
  r.normalize(raw, ns.Rh(ns.NI(ns.MI(new ns.CI(), 'c_47'), 'r_48')));
  const next = vi.fn(),
    error = vi.fn();
  f.projectOriginal(raw, { next, error });
  expect(error).not.toHaveBeenCalled();
  expect(next.mock.calls.map(([event]) => event.responseType)).toEqual(['TURN_COMPLETED', 'TURN']);
  expect(next.mock.calls[1]?.[0].response.draft).toMatchObject({
    j3: GEMINI_FIXED_TEXT_TRIAL_ANSWER,
    completeness: 'COMPLETE',
  });
  const status = raw.fl[4][0].fl[8];
  expect(status.fl).toBe(statusBacking);
  expect(Function.prototype.toString.call(status.constructor)).toBe(
    'class extends _.l{constructor(a){super(a)}getState(){return _.ti(this,1)}setState(a){return _.Ni(this,1,a)}}',
  );
  expect(Object.hasOwn(ns, 'm1c')).toBe(false);
  expect(f.deferredErrors).toEqual([]);
  let failure: unknown;
  try {
    readGeminiNativeEnvelope(ns, f.nativeEnvelope(raw));
  } catch (error) {
    failure = error;
  }
  expect(fixedContract.readGeminiNativeReceivePredicate(failure)).toBeUndefined();
  expect(failure).toBeUndefined();
  expect(() => r.verify()).not.toThrow();
});

it.each(['fallback55', 'continuation52'] as const)(
  'Native70 source materialization family preserves direct native %s rereads',
  async (kind) => {
    const { geminiSdkWebChannelFixture } =
      await import('../../fixtures/providers/gemini-sdk-webchannel');
    const f = geminiSdkWebChannelFixture('json', true),
      ns = f.namespace;
    const raw: any = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: false });
    if (kind === 'fallback55') raw.fl[54] = [undefined, 0];
    else {
      raw.fl[45] = [];
      raw.fl[51] = [];
    }
    const r = createGeminiNativeReceipt(ns, f.approved);
    r.capture(f.nativeEnvelope(raw));
    r.normalize(raw, ns.Rh(ns.NI(ns.MI(new ns.CI(), 'c_47'), 'r_48')));
    const next = vi.fn(),
      error = vi.fn();
    f.projectOriginal(raw, { next, error });
    expect(error).not.toHaveBeenCalled();
    expect(next.mock.calls.map(([event]) => event.responseType)).toEqual(
      kind === 'fallback55' ? ['TURN'] : ['CONTINUATION_UPDATE', 'DISCONNECT'],
    );
    const materialized = raw.fl[kind === 'fallback55' ? 54 : 51];
    expect(Array.isArray(materialized)).toBe(false);
    expect(Function.prototype.toString.call(materialized.constructor)).toBe(
      'class extends _.l{constructor(a){super(a)}}',
    );
    expect(f.deferredErrors).toEqual([]);
    expect(() => r.verify()).not.toThrow();
    let failure: unknown;
    try {
      readGeminiNativeEnvelope(ns, f.nativeEnvelope(raw));
    } catch (error) {
      failure = error;
    }
    expect(fixedContract.readGeminiNativeReceivePredicate(failure)).toBeUndefined();
    expect(failure).toBeUndefined();
  },
);

it.each([
  'constructor',
  'prototype-parent',
  'getState',
  'setState',
  'method-accessor',
  'constructor-accessor',
  'method-descriptor',
  'constructor-descriptor',
  'prototype-extra',
  'instance-extra',
  'instance-accessor',
  'cache',
  'field',
  'value',
  'wrong-owner',
] as const)(
  'Native70 exact native status rejects %s and keeps refusal after restoration',
  async (kind) => {
    const { geminiSdkWebChannelFixture } =
      await import('../../fixtures/providers/gemini-sdk-webchannel');
    const f = geminiSdkWebChannelFixture('json', true),
      ns = f.namespace,
      raw: any = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
    const r = createGeminiNativeReceipt(ns, f.approved);
    r.capture(f.nativeEnvelope(raw));
    r.normalize(raw, ns.Rh(ns.NI(ns.MI(new ns.CI(), 'c_47'), 'r_48')));
    const next = vi.fn(),
      error = vi.fn();
    f.projectOriginal(raw, { next, error });
    expect(error).not.toHaveBeenCalled();
    expect(f.deferredErrors).toEqual([]);
    r.verify();
    const status = raw.fl[4][0].fl[8],
      p = Object.getPrototypeOf(status),
      descriptors = Object.getOwnPropertyDescriptors(p),
      parent = Object.getPrototypeOf(p),
      getter = vi.fn();
    if (kind === 'constructor') p.constructor = class extends ns.l {};
    if (kind === 'prototype-parent') Object.setPrototypeOf(p, {});
    if (kind === 'getState' || kind === 'setState') p[kind] = () => 2;
    if (kind === 'method-accessor')
      Object.defineProperty(p, 'getState', { get: getter, configurable: true });
    if (kind === 'constructor-accessor')
      Object.defineProperty(p, 'constructor', { get: getter, configurable: true });
    if (kind === 'method-descriptor') Object.defineProperty(p, 'getState', { writable: false });
    if (kind === 'constructor-descriptor')
      Object.defineProperty(p, 'constructor', { enumerable: true });
    if (kind === 'prototype-extra') p.extra = true;
    if (kind === 'instance-extra') status.extra = true;
    if (kind === 'instance-accessor')
      Object.defineProperty(status, 'fl', { get: getter, configurable: true });
    if (kind === 'cache') status.fl[ns.dga] = raw.fl[ns.dga];
    if (kind === 'field') status.fl[1] = 0;
    if (kind === 'value') status.fl[0] = 3;
    if (kind === 'wrong-owner') raw.fl[54] = status;
    expect(() => r.verify()).toThrow();
    expect(getter).not.toHaveBeenCalled();
    Object.setPrototypeOf(p, parent);
    for (const key of Reflect.ownKeys(p))
      if (!Object.hasOwn(descriptors, key)) Reflect.deleteProperty(p, key);
    Object.defineProperties(p, descriptors);
    expect(() => r.verify()).toThrow();
  },
);

it('Native70 saved Myd retains native W4c location before direct content reread', async () => {
  const { geminiSdkWebChannelFixture } =
    await import('../../fixtures/providers/gemini-sdk-webchannel');
  const f = geminiSdkWebChannelFixture('json', true),
    ns = f.namespace,
    raw: any = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: false });
  const location = ['SYNTHETIC_LOCATION', '', 0];
  raw.fl[5] = location;
  const r = createGeminiNativeReceipt(ns, f.approved);
  r.capture(f.nativeEnvelope(raw));
  r.normalize(raw, ns.Rh(ns.NI(ns.MI(new ns.CI(), 'c_47'), 'r_48')));
  const next = vi.fn(),
    error = vi.fn();
  f.projectOriginal(raw, { next, error });
  expect(error).not.toHaveBeenCalled();
  expect(next.mock.calls.map(([event]) => event.responseType)).toEqual(['TURN']);
  expect(raw.fl[5].fl).toBe(location);
  expect(Object.getPrototypeOf(raw.fl[5])).toBe(ns.W4c.prototype);
  expect(f.deferredErrors).toEqual([]);
  r.verify();
  let failure: unknown;
  try {
    readGeminiNativeEnvelope(ns, f.nativeEnvelope(raw));
  } catch (error) {
    failure = error;
  }
  expect(fixedContract.readGeminiNativeReceivePredicate(failure)).toBeUndefined();
  expect(failure).toBeUndefined();
});

it('Native70 exact FF retains source EF candidate before currentness and direct native reread', async () => {
  const { geminiSdkWebChannelFixture } =
    await import('../../fixtures/providers/gemini-sdk-webchannel');
  const f = geminiSdkWebChannelFixture('json', true),
    ns = f.namespace,
    raw: any = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
  const candidateBacking = raw.fl[4][0].fl;
  raw.fl[4][0] = candidateBacking;
  const r = createGeminiNativeReceipt(ns, f.approved);
  r.capture(f.nativeEnvelope(raw));
  r.normalize(raw, ns.Rh(ns.NI(ns.MI(new ns.CI(), 'c_47'), 'r_48')));
  const next = vi.fn(),
    error = vi.fn();
  f.projectOriginal(raw, { next, error });
  expect(error).not.toHaveBeenCalled();
  expect(next.mock.calls.map(([event]) => event.responseType)).toEqual(['TURN_COMPLETED', 'TURN']);
  expect(next.mock.calls[1]?.[0].response.draft).toMatchObject({
    id: 'rc_49',
    j3: GEMINI_FIXED_TEXT_TRIAL_ANSWER,
    completeness: 'COMPLETE',
  });
  expect(Object.getPrototypeOf(raw.fl[4][0])).toBe(ns.FF.prototype);
  expect(raw.fl[4][0].fl).toBe(candidateBacking);
  expect(f.deferredErrors).toEqual([]);
  let failure: unknown;
  try {
    r.verify();
  } catch (error) {
    failure = error;
  }
  expect(fixedContract.readGeminiNativeReceivePredicate(failure)).toBeUndefined();
  expect(failure).toBeUndefined();
  expect(() => readGeminiNativeEnvelope(ns, f.nativeEnvelope(raw))).not.toThrow();
});

it('Native70 direct source detachment cannot replace a guarded operation witness', async () => {
  const { geminiSdkWebChannelFixture } =
    await import('../../fixtures/providers/gemini-sdk-webchannel');
  const f = geminiSdkWebChannelFixture('json', true),
    ns = f.namespace,
    raw: any = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
  raw.Fb = ns.Kaa;
  raw.tcc = ns.Kaa;
  const r = createGeminiNativeReceipt(ns, f.approved),
    envelope = f.nativeEnvelope(raw);
  r.capture(envelope);
  r.normalize(raw, ns.Rh(ns.NI(ns.MI(new ns.CI(), 'c_47'), 'r_48')));
  const previous = raw.fl,
    flags = previous[ns.La],
    next = vi.fn(),
    error = vi.fn();
  f.projectOriginal(raw, { next, error });
  expect(error).not.toHaveBeenCalled();
  expect(next.mock.calls.map(([event]) => event.responseType)).toEqual(['TURN_COMPLETED', 'TURN']);
  expect(next.mock.calls[1]?.[0].response.draft).toMatchObject({
    j3: GEMINI_FIXED_TEXT_TRIAL_ANSWER,
    completeness: 'COMPLETE',
  });
  expect(raw.fl).not.toBe(previous);
  expect(raw.Fb).toBeUndefined();
  expect(raw.tcc).toBeUndefined();
  expect(raw.fl[ns.La]).toBe((flags & 16769217) | 32 | 2048 | 4096);
  expect(raw.fl[ns.dga].get(ns.HF)).toBe(0);
  expect(f.deferredErrors).toEqual([]);
  let failure: unknown;
  try {
    r.verify();
  } catch (error) {
    failure = error;
  }
  expect(fixedContract.readGeminiNativeReceivePredicate(failure)).toBe('receipt-backing');
  expect(() => r.verify()).toThrow();
});

it.each(['equal', 'descriptor', 'legacy', 'foreign'] as const)(
  'Native70 native EF mapping rejects %s replacement after source delivery',
  async (kind) => {
    const { geminiSdkWebChannelFixture } =
      await import('../../fixtures/providers/gemini-sdk-webchannel');
    const f = geminiSdkWebChannelFixture('json', true),
      ns = f.namespace,
      raw: any = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
    const r = createGeminiNativeReceipt(ns, f.approved);
    r.capture(f.nativeEnvelope(raw));
    r.normalize(raw, ns.Rh(ns.NI(ns.MI(new ns.CI(), 'c_47'), 'r_48')));
    const next = vi.fn(),
      error = vi.fn();
    f.projectOriginal(raw, { next, error });
    expect(error).not.toHaveBeenCalled();
    expect(f.deferredErrors).toEqual([]);
    r.verify();
    const original = Object.getOwnPropertyDescriptor(ns, 'FF')!,
      candidate = raw.fl[4][0];
    if (kind === 'equal')
      ns.FF = Function('_', 'return class extends _.l{constructor(a){super(a)}}')(ns);
    if (kind === 'descriptor')
      Object.defineProperty(ns, 'FF', { enumerable: !original.enumerable });
    if (kind === 'legacy') raw.fl[4] = [new ns.AF(candidate.fl)];
    if (kind === 'foreign')
      raw.fl[4] = [Object.assign(new (class extends ns.l {})(), { fl: candidate.fl })];
    expect(() => r.verify()).toThrow();
    Object.defineProperty(ns, 'FF', original);
    raw.fl[4] = [candidate];
    expect(() => r.verify()).toThrow();
  },
);

it('Native70 retains exact unused qH group shape across a plain receipt', async () => {
  const { geminiSdkWebChannelFixture } =
    await import('../../fixtures/providers/gemini-sdk-webchannel');
  const f = geminiSdkWebChannelFixture('json', true),
    ns = f.namespace,
    raw: any = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
  const r = createGeminiNativeReceipt(ns, f.approved);
  r.capture(f.nativeEnvelope(raw));
  r.normalize(raw, ns.Rh(ns.NI(ns.MI(new ns.CI(), 'c_47'), 'r_48')));
  const next = vi.fn(),
    error = vi.fn();
  f.projectOriginal(raw, { next, error });
  expect(error).not.toHaveBeenCalled();
  expect(f.deferredErrors).toEqual([]);
  r.verify();
  ns.pH[ns.La] = 0;
  expect(() => r.verify()).toThrow();
  Reflect.deleteProperty(ns.pH, ns.La);
  expect(() => r.verify()).toThrow();
});

it.each(['raw', 'typed'] as const)(
  'Native70 full source retains admitted empty candidate13 bw %s',
  async (kind) => {
    const { geminiSdkWebChannelFixture } =
      await import('../../fixtures/providers/gemini-sdk-webchannel');
    const f = geminiSdkWebChannelFixture('json', true),
      ns = f.namespace,
      raw: any = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
    raw.fl[4][0].fl[12] = kind === 'raw' ? [] : new ns.$v([]);
    const r = createGeminiNativeReceipt(ns, f.approved);
    r.capture(f.nativeEnvelope(raw));
    r.normalize(raw, ns.Rh(ns.NI(ns.MI(new ns.CI(), 'c_47'), 'r_48')));
    const next = vi.fn(),
      error = vi.fn();
    f.projectOriginal(raw, { next, error });
    expect(error).not.toHaveBeenCalled();
    expect(next.mock.calls.map(([event]) => event.responseType)).toEqual([
      'TURN_COMPLETED',
      'TURN',
    ]);
    expect(f.deferredErrors).toEqual([]);
    expect(next.mock.calls[1]?.[0].response.draft.j3).toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    expect(() => r.verify()).not.toThrow();
  },
);

it.each([false, true])(
  'Native70 configuration rejects populated continuation72=%s before query',
  async (populated) => {
    const { geminiSdkWebChannelFixture } =
      await import('../../fixtures/providers/gemini-sdk-webchannel');
    const f = geminiSdkWebChannelFixture(),
      ns = f.namespace;
    f.ok.fl[71] = new ns.vL(populated ? ['c_prior'] : []);
    const { configuration } = f.outbound();
    const check = () =>
      assertGeminiNativeConfiguration(ns, configuration, f.ok, f.approved, f.api.requestSource);
    if (populated) expect(check).toThrowError(expect.objectContaining({ cause: 'packet' }));
    else expect(check).not.toThrow();
  },
);

it.each(['dense', 'sparse'] as const)(
  'Native75 omits opaque survey only from the isolated %s projection copy',
  async (layout) => {
    const { geminiSdkWebChannelFixture } =
      await import('../../fixtures/providers/gemini-sdk-webchannel');
    const f = geminiSdkWebChannelFixture('json', true),
      ns = f.namespace;
    const raw: any = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
    const getter = vi.fn(() => {
      throw Error('SYNTHETIC_PRIVATE_SURVEY');
    });
    const survey = Object.defineProperty([], 'nested', { get: getter });
    if (layout === 'dense') raw.fl[24] = survey;
    else raw.fl.push({ 25: survey });
    const original = Object.getOwnPropertyDescriptors(raw.fl);
    const r = createGeminiNativeReceipt(ns, f.approved);
    r.capture(f.nativeEnvelope(raw));
    const frame = r.normalize(raw, ns.Rh(ns.NI(ns.MI(new ns.CI(), 'c_47'), 'r_48')));
    expect(frame.normalized).not.toBe(raw);
    expect((frame.normalized as any).fl).not.toBe(raw.fl);
    expect(ns.de((frame.normalized as any).fl, 25)).toBeUndefined();
    expect(ns.de(raw.fl, 25)).toBe(survey);
    const next = vi.fn(),
      error = vi.fn();
    f.projectOriginal(frame.normalized, { next, error });
    expect(error).not.toHaveBeenCalled();
    const turn = next.mock.calls
      .map(([event]) => event)
      .find((event) => event.responseType === 'TURN');
    expect(turn.response.Zpf).toBeUndefined();
    expect(turn.response.draft.j3).toBe(GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    expect(getter).not.toHaveBeenCalled();
    expect(Object.getOwnPropertyDescriptors(raw.fl)).toMatchObject(original);
    expect(ns.de(raw.fl, 25)).toBe(survey);
    r.verify();
    expect(JSON.stringify(frame.observation)).not.toContain('SURVEY');
  },
);

it.each(['source-survey', 'source-answer', 'copy-answer', 'copy-survey'] as const)(
  'Native75 omission retains the %s mutation guard',
  async (mutation) => {
    const { geminiSdkWebChannelFixture } =
      await import('../../fixtures/providers/gemini-sdk-webchannel');
    const f = geminiSdkWebChannelFixture('json', true),
      ns = f.namespace;
    const raw: any = f.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
    raw.fl[24] = [['SYNTHETIC_PRIVATE_SURVEY']];
    const r = createGeminiNativeReceipt(ns, f.approved);
    r.capture(f.nativeEnvelope(raw));
    const frame = r.normalize(raw, ns.Rh(ns.NI(ns.MI(new ns.CI(), 'c_47'), 'r_48')));
    const copy = (frame.normalized as any).fl;
    if (mutation === 'source-survey') raw.fl[24] = [];
    if (mutation === 'source-answer') raw.fl[14] = false;
    if (mutation === 'copy-answer') copy[14] = false;
    if (mutation === 'copy-survey') copy[24] = [];
    expect(() => r.verify()).toThrow();
  },
);

it('Native75 refuses survey inserted into an identity clone when the source had none', () => {
  const f = geminiFixedTextContractFixture();
  const r = createGeminiNativeReceipt(f.namespace, f.approved);
  const raw = f.nativeKf({ cid: 'c_47' });
  const envelope = f.nativeEnvelope(raw);
  r.capture(envelope);
  const emitted = f.normalizeNative(envelope, { cid: '', rid: f.approved.clientTurnId });
  const frame = r.normalize(emitted.hf, emitted.aa);
  expect(frame.normalized).not.toBe(raw);
  r.verify();
  (frame.normalized as any).fl[24] = [['SYNTHETIC_PRIVATE_SURVEY']];
  expect(() => r.verify()).toThrow();
});
