import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  geminiReadiness,
  readGeminiPageProtection,
} from '../../../src/infrastructure/providers/gemini/readiness';
import {
  GeminiReadinessResult,
  GeminiReadinessRecord,
  GeminiReadinessProgress,
  GeminiClientCapability,
} from '../../../src/application/gemini-readiness';
const mode = vi.hoisted(() => vi.fn());
vi.mock('../../../src/infrastructure/providers/models', () => ({ readGeminiMode: mode }));
function page(value: object) {
  Object.defineProperty(value, 'top', { value, configurable: true });
  vi.stubGlobal('window', value);
}
function flags(value: unknown) {
  page({ WIZ_global_data: { TSDtV: value, ignored: 'synthetic-private-value' } });
}
beforeEach(() => {
  vi.stubGlobal('location', { href: 'https://gemini.google.com/app' });
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetAllMocks();
});
describe('Gemini page protection readiness', () => {
  it.each(['registry', 'missing', 'shape', 'id', 'metadata', 'flags'] as const)(
    'accepts only the fixed root-view %s reason without provider data',
    (stage) => {
      const value = { status: 'unsupported', reason: `owner-view-${stage}` };
      expect(GeminiClientCapability.parse(value)).toEqual(value);
      for (const extra of [
        { id: 'SYNTHETIC_PRIVATE_MARKER' },
        { flags: 256 },
        { detail: 'SYNTHETIC_PRIVATE_MARKER' },
      ])
        expect(GeminiClientCapability.safeParse({ ...value, ...extra }).success).toBe(false);
    },
  );
  it('accepts only fixed client prerequisites and never private provider metadata', () => {
    expect(GeminiClientCapability.parse({ status: 'candidate' })).toEqual({ status: 'candidate' });
    for (const reason of [
      'page',
      'owner',
      'owner-context',
      'owner-view',
      'owner-slot',
      'owner-declaration-1',
      'owner-declaration-2',
      'owner-declaration-3',
      'owner-declaration-3-node',
      'owner-declaration-3-template',
      'owner-declaration-3-binding',
      'owner-component',
      'runtime-shape',
      'service-identity',
      'protection',
      'transport-session',
      'transport-api',
      'transport-route',
      'transport-sse',
      'transport-rpc',
      'prewarm',
      'hook',
      'transport-webchannel',
    ])
      expect(GeminiClientCapability.parse({ status: 'unsupported', reason })).toEqual({
        status: 'unsupported',
        reason,
      });
    for (const value of [
      { status: 'unsupported' },
      { status: 'unsupported', reason: 'transport' },
      { status: 'unsupported', reason: 'SYNTHETIC_PRIVATE_MARKER' },
      { status: 'candidate', reason: 'hook' },
      { status: 'candidate', token: 'SYNTHETIC_PRIVATE_MARKER' },
      { status: 'unsupported', reason: 'hook', context: 10 },
      { status: 'unsupported', reason: 'transport-webchannel', oa: false },
      { status: 'unsupported', reason: 'transport-webchannel', detail: 'SYNTHETIC_PRIVATE_MARKER' },
      { status: 'unsupported', reason: 'transport-webchannel-unknown' },
      { status: 'ready' },
    ])
      expect(GeminiClientCapability.safeParse(value).success).toBe(false);
  });
  it.each([
    [false, 'disabled'],
    [true, 'enabled'],
  ] as const)('reads an explicit JSON boolean %s', (value, expected) => {
    flags(JSON.stringify({ flags: { '45428920': value }, token: 'synthetic-secret' }));
    expect(readGeminiPageProtection()).toEqual({ protection: expected });
  });
  it.each([
    undefined,
    '',
    '{}',
    '{broken',
    JSON.stringify({ flags: {} }),
    JSON.stringify({ flags: { '45428920': 0 } }),
    JSON.stringify({ flags: { '45428920': 'false' } }),
    '{"flags":{"45428920":false,"45428920":true}}',
    '{"flags":{"45428920":false,"4542892\\u0030":true}}',
  ])('keeps missing or malformed JSON unknown: %s', (value) => {
    flags(value);
    expect(readGeminiPageProtection().protection).toBe('unknown');
  });
  const jspb = (rows: unknown[], groups?: unknown[]) =>
    'abcd' + JSON.stringify([groups ?? [[null, rows]]]).slice(1);
  it.each([
    [false, 'disabled'],
    [0, 'disabled'],
    [true, 'enabled'],
    [1, 'enabled'],
  ] as const)('reads JSPB boolean %s', (value, expected) => {
    flags(jspb([[45428920, null, value]]));
    expect(readGeminiPageProtection()).toEqual({ protection: expected });
  });
  it.each([
    [],
    [[45428920]],
    [[45428920, null, 'false']],
    [[45428920, null, 2]],
    [[45428920, 0, false]],
    [[45428920, null, false, 0]],
    [
      [45428920, null, false],
      ['45428920', null, true],
    ],
  ])('rejects absent, conflicting, malformed or duplicated JSPB rows: %j', (...rows) => {
    flags(jspb(rows));
    expect(readGeminiPageProtection().protection).toBe('unknown');
  });
  it.each([
    [[[[null, [[45428920, null, false]]]]], 'disabled'],
    [[[[null, [[45428920, null, false, null, null, null, 'metadata']]]]], 'disabled'],
    [
      [
        [
          [null, [[45428920, null, false]]],
          [null, [[45428920, null, true]]],
        ],
        null,
        'unused',
      ],
      'disabled',
    ],
    [
      [
        [
          [
            null,
            [
              [45428920, null, false],
              [7, null, null, null, null, ['type', 'payload']],
            ],
          ],
        ],
      ],
      'unknown',
    ],
    [[[[null, [[45428920, null, false], [7]]]]], 'unknown'],
    [
      [
        [
          [
            null,
            [
              [45428920, null, false],
              [7, null, null, null, null, null, null, [null, 'payload']],
            ],
          ],
        ],
      ],
      'unknown',
    ],
  ] as const)('validates the complete first dense configuration (case %#)', (root, expected) => {
    flags('abcd' + JSON.stringify(root).slice(1));
    expect(readGeminiPageProtection().protection).toBe(expected);
  });
  it('rejects sparse config and root overrides', () => {
    for (const root of [
      [[{ '2': [[45428920, null, false]] }]],
      [[[null, [[45428920, null, false]]]], { '1': [[null, [[45428920, null, true]]]] }],
    ]) {
      flags('abcd' + JSON.stringify(root).slice(1));
      expect(readGeminiPageProtection().protection).toBe('unknown');
    }
  });
  it.each([
    [7, 42],
    [7, '-9223372036854775808'],
    [7, '9223372036854775807'],
    [7, null, false],
    [7, null, 1],
    [7, null, null, 1.5],
    [7, null, null, null, 'text'],
    [7, null, null, null, '', null, 'metadata'],
  ])('accepts supported simple rows beside the target: %j', (...row) => {
    flags(jspb([[45428920, null, false], row]));
    expect(readGeminiPageProtection()).toEqual({ protection: 'disabled' });
  });
  it.each([
    [7],
    [7, null, 2],
    [7, 1.5],
    [7, '9223372036854775808'],
    [7, '-9223372036854775809'],
    [7, 'not-an-integer'],
    [7, Number.MAX_SAFE_INTEGER + 1],
    [7, null, null, '1.5'],
    [7, null, null, null, 42],
    [7, 1, false],
    [7, null, false, null, null, null, 3],
    [7, null, false, null, null, null, null, null, 'unknown'],
    ['', null, false],
    ['other', null, false],
    ['007', null, false],
    ['-0', null, false],
    [' 7', null, false],
    ['7.0', null, false],
    [1.5, null, false],
    [null, null, false],
  ])('rejects an invalid simple row even beside a false target: %j', (...row) => {
    flags(jspb([[45428920, null, false], row]));
    expect(readGeminiPageProtection()).toEqual({
      protection: 'unknown',
      protectionReason: 'flag-format',
    });
  });
  it('rejects duplicated non-target keys across string and numeric rows', () => {
    flags(
      jspb([
        [45428920, null, false],
        [7, null, true],
        ['7', null, false],
      ]),
    );
    expect(readGeminiPageProtection()).toEqual({
      protection: 'unknown',
      protectionReason: 'flag-ambiguous',
    });
  });
  it.each([
    [],
    [[]],
    [[null]],
    [[[null, [[45428920, null, false]], null, 'unsupported']]],
    [[[null, [[45428920, null, false]]], { '2': [[45428920, null, true]] }]],
    [Array(10001).fill(null)],
    [[], ...Array(10000).fill(null)],
    [[[null, Array(10001).fill([7, null, false])]]],
    [[[null, [[45428920, null, false]]], Array(10001).fill(null)]],
  ])('rejects invalid or excessive dense configuration boundaries (case %#)', (...root) => {
    flags('abcd' + JSON.stringify(root).slice(1));
    expect(readGeminiPageProtection()).toEqual({
      protection: 'unknown',
      protectionReason: 'configuration-format',
    });
  });
  it('validates dense JSPB when serialized into the provider page', () => {
    const serialized = new Function(
      `return (${readGeminiPageProtection.toString()});`,
    )() as typeof readGeminiPageProtection;
    flags(
      jspb([
        [7, '9223372036854775807'],
        [45428920, null, false, null, null, null, 'metadata'],
      ]),
    );
    expect(serialized()).toEqual({ protection: 'disabled' });
    flags(
      jspb([
        [45428920, null, false],
        [7, null, null, null, null, ['type', 'payload']],
      ]),
    );
    expect(serialized()).toEqual({ protection: 'unknown', protectionReason: 'flag-format' });
  });
  it.each([
    [null, [['45428920', null, 0]], { '2': [['45428920', null, 1]] }],
    [null, [['45428920', null, 0, null, null, null, { '3': 1 }]]],
    [
      null,
      [
        ['45428920', null, 0],
        ['other', null, false, { '1': '45428920', '3': 1 }],
      ],
    ],
    [null, [['45428920', null, 0, null, null, null, 1]]],
  ])('rejects sparse field overrides and unknown dense fields: %j', (...group) => {
    flags(jspb([], [group]));
    expect(readGeminiPageProtection().protection).toBe('unknown');
  });
  it.each([
    [undefined, 'bootstrap-missing'],
    [null, 'bootstrap-format'],
    [[], 'bootstrap-format'],
    [false, 'bootstrap-format'],
    [{}, 'configuration-format'],
    [{ TSDtV: ' '.repeat(1048577) }, 'bootstrap-limit'],
    [{ TSDtV: '{}' }, 'configuration-format'],
    [{ TSDtV: '{"flags":{}}' }, 'flag-missing'],
    [
      {
        TSDtV: jspb([
          [45428920, null, false],
          [45428920, null, true],
        ]),
      },
      'flag-ambiguous',
    ],
    [{ TSDtV: '{"flags":{"45428920":"false"}}' }, 'flag-format'],
  ] as const)(
    'returns only a fixed cause for unsupported page state (case %#)',
    (bootstrap, reason) => {
      page({ WIZ_global_data: bootstrap });
      expect(readGeminiPageProtection()).toEqual({
        protection: 'unknown',
        protectionReason: reason,
      });
    },
  );
  it('rejects duplicate JSON and excessive nesting', () => {
    for (const source of [
      '{"flags":{"45428920":false,"45428920":true}}',
      '{"flags":{"45428920":false},"nested":' + '['.repeat(40) + '0' + ']'.repeat(40) + '}',
    ]) {
      flags(source);
      expect(readGeminiPageProtection()).toEqual({
        protection: 'unknown',
        protectionReason: 'configuration-format',
      });
    }
  });
  it('reads the active page state and does not inspect a stale DOM bootstrap', () => {
    flags('{"flags":{"45428920":true},"token":"synthetic-secret"}');
    const inspect = vi.fn(() => [{ textContent: 'window.WIZ_global_data={"TSDtV":"old-false"};' }]);
    vi.stubGlobal('document', { querySelectorAll: inspect });
    expect(readGeminiPageProtection()).toEqual({ protection: 'enabled' });
    expect(inspect).not.toHaveBeenCalled();
  });
  it('runs from its serialized function without external closures and exports only fixed metadata', () => {
    flags('{"flags":{"45428920":false},"token":"synthetic-secret"}');
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const serialized = new Function(
      `return (${readGeminiPageProtection.toString()});`,
    )() as typeof readGeminiPageProtection;
    expect(serialized()).toEqual({ protection: 'disabled' });
    flags('{"flags":{},"token":"synthetic-secret"}');
    expect(serialized()).toEqual({ protection: 'unknown', protectionReason: 'flag-missing' });
    expect(fetch).not.toHaveBeenCalled();
  });
  it('does not read provider state outside the exact Gemini home', () => {
    location.href = 'https://gemini.google.com/app/other';
    const read = vi.fn(() => ({ TSDtV: '{"flags":{"45428920":false}}' }));
    page(Object.defineProperty({}, 'WIZ_global_data', { get: read }));
    expect(readGeminiPageProtection()).toEqual({
      protection: 'unknown',
      protectionReason: 'bootstrap-format',
    });
    expect(read).not.toHaveBeenCalled();
  });
  it('does not read provider state from a child frame', () => {
    const read = vi.fn(() => ({ TSDtV: '{"flags":{"45428920":false}}' }));
    page(Object.defineProperty({}, 'WIZ_global_data', { get: read }));
    Object.defineProperty(window, 'top', { value: {} });
    expect(readGeminiPageProtection()).toEqual({
      protection: 'unknown',
      protectionReason: 'bootstrap-format',
    });
    expect(read).not.toHaveBeenCalled();
  });
  it('does not export an exception or read any unrelated bootstrap value', () => {
    const privateRead = vi.fn(() => {
      throw new Error('synthetic-secret');
    });
    page({
      WIZ_global_data: Object.defineProperty({ TSDtV: '{"flags":{"45428920":false}}' }, 'SNlM0e', {
        get: privateRead,
      }),
    });
    expect(readGeminiPageProtection()).toEqual({ protection: 'disabled' });
    expect(privateRead).not.toHaveBeenCalled();
    page(Object.defineProperty({}, 'WIZ_global_data', { get: privateRead }));
    expect(readGeminiPageProtection()).toEqual({
      protection: 'unknown',
      protectionReason: 'bootstrap-format',
    });
  });
  it('returns the UI model and its exact private receipt key without accessing bootstrap or a network', async () => {
    mode.mockResolvedValue({ label: 'Synthetic automatic', modeId: 'synthetic-key' });
    const privateRead = vi.fn(() => {
      throw new Error('must not read');
    });
    page(Object.defineProperty({}, 'WIZ_global_data', { get: privateRead }));
    const fetch = vi.fn(() => {
      throw new Error('must not fetch');
    });
    vi.stubGlobal('fetch', fetch);
    expect(await geminiReadiness()).toEqual({
      model: 'Synthetic automatic',
      modeId: 'synthetic-key',
    });
    expect(privateRead).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each(['', 'x'.repeat(161), undefined])(
    'rejects an invalid model label (case %#)',
    async (label) => {
      mode.mockResolvedValue({ label, modeId: 'synthetic-key' });
      await expect(geminiReadiness()).rejects.toMatchObject({
        message: 'Gemini readiness failed.',
        cause: 'model',
      });
    },
  );
  it.each(['', 'x'.repeat(161), 'two keys', undefined])(
    'rejects an invalid private mode key (case %#)',
    async (modeId) => {
      mode.mockResolvedValue({ label: 'Synthetic automatic', modeId });
      await expect(geminiReadiness()).rejects.toMatchObject({
        message: 'Gemini readiness failed.',
        cause: 'model',
      });
    },
  );
  it('fails with fixed reasons for cancellation, changed page, and model failure', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(geminiReadiness(controller.signal)).rejects.toMatchObject({
      cause: 'interrupted',
    });
    expect(mode).not.toHaveBeenCalled();
    mode.mockImplementation(async () => {
      location.href = 'https://gemini.google.com/app/other';
      return { label: 'Synthetic', modeId: 'key' };
    });
    await expect(geminiReadiness()).rejects.toMatchObject({ cause: 'page' });
    vi.stubGlobal('location', { href: 'https://gemini.google.com/app' });
    mode.mockRejectedValue(new Error('synthetic-secret'));
    await expect(geminiReadiness()).rejects.toMatchObject({
      message: 'Gemini readiness failed.',
      cause: 'model',
    });
  });
  it.each(['model-trigger', 'model-menu', 'model-selection', 'model-cleanup'])(
    'preserves only the known model stage %s without its error message',
    async (cause) => {
      mode.mockRejectedValue(new Error('synthetic-secret', { cause }));
      await expect(geminiReadiness()).rejects.toMatchObject({
        message: 'Gemini readiness failed.',
        cause,
      });
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
    'carries finite Gemini menu diagnostic %s without changing the shared cause',
    async (diagnostic) => {
      mode.mockRejectedValue(
        Object.assign(new Error('synthetic-secret', { cause: 'model-menu' }), {
          geminiMenuDiagnostic: diagnostic,
        }),
      );
      await expect(geminiReadiness()).rejects.toMatchObject({
        message: 'Gemini readiness failed.',
        cause: 'model-menu',
        geminiMenuDiagnostic: diagnostic,
      });
    },
  );
  it.each(['unknown', 'accessor', 'inherited', 'other-cause'] as const)(
    'omits unsupported menu diagnostic %s without reading private data',
    async (kind) => {
      const getter = vi.fn(() => 'open-trigger');
      const cause = kind === 'other-cause' ? 'model-trigger' : 'model-menu';
      const error = new Error('synthetic-secret', { cause });
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
            : { value: kind === 'unknown' ? 'synthetic-secret' : 'open-trigger' },
        );
      mode.mockRejectedValue(error);
      const failure = await geminiReadiness().catch((error) => error);
      expect(failure).toMatchObject({ message: 'Gemini readiness failed.', cause });
      expect(Object.hasOwn(failure, 'geminiMenuDiagnostic')).toBe(false);
      expect(getter).not.toHaveBeenCalled();
    },
  );
  it.each([
    'compact-control',
    'final-control',
    'header-context',
    'header-deadline',
    'header-association',
  ] as const)(
    'carries finite Gemini trigger diagnostic %s without changing the shared cause',
    async (diagnostic) => {
      mode.mockRejectedValue(
        Object.assign(new Error('synthetic-secret', { cause: 'model-trigger' }), {
          geminiTriggerDiagnostic: diagnostic,
        }),
      );
      const failure = await geminiReadiness(undefined, true).catch((error) => error);
      expect(failure).toMatchObject({
        message: 'Gemini readiness failed.',
        cause: 'model-trigger',
        geminiTriggerDiagnostic: diagnostic,
      });
      expect(Object.getOwnPropertyDescriptor(failure, 'geminiTriggerDiagnostic')).toMatchObject({
        value: diagnostic,
        writable: false,
        configurable: false,
      });
    },
  );
  it.each(['unknown', 'accessor', 'inherited', 'other-cause', 'non-error'] as const)(
    'omits unsupported trigger diagnostic %s without reading private data',
    async (kind) => {
      const getter = vi.fn(() => 'compact-control');
      const cause = kind === 'other-cause' ? 'model-menu' : 'model-trigger';
      const error = new Error('synthetic-secret', { cause });
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
            : { value: kind === 'unknown' ? 'synthetic-secret' : 'compact-control' },
        );
      mode.mockRejectedValue(
        kind === 'non-error' ? { cause, geminiTriggerDiagnostic: 'compact-control' } : error,
      );
      const failure = await geminiReadiness(undefined, true).catch((error) => error);
      expect(failure).toMatchObject({
        message: 'Gemini readiness failed.',
        cause: kind === 'non-error' ? 'model' : cause,
      });
      expect(Object.hasOwn(failure, 'geminiTriggerDiagnostic')).toBe(false);
      expect(getter).not.toHaveBeenCalled();
    },
  );
  it('keeps ordinary readiness generic even with recognized trigger metadata', async () => {
    mode.mockRejectedValue(
      Object.assign(new Error('synthetic-secret', { cause: 'model-trigger' }), {
        geminiTriggerDiagnostic: 'compact-control',
      }),
    );
    const failure = await geminiReadiness().catch((error) => error);
    expect(failure).toMatchObject({ message: 'Gemini readiness failed.', cause: 'model-trigger' });
    expect(Object.hasOwn(failure, 'geminiTriggerDiagnostic')).toBe(false);
  });
  it.each(['page', 'interrupted'] as const)(
    'keeps %s precedence over an annotated header refusal',
    async (cause) => {
      const controller = new AbortController();
      mode.mockImplementation(async () => {
        if (cause === 'page') location.href += '/changed';
        else controller.abort();
        throw Object.assign(new Error('synthetic-secret', { cause: 'model-trigger' }), {
          geminiTriggerDiagnostic: 'header-context',
        });
      });
      const failure = await geminiReadiness(controller.signal, true).catch((error) => error);
      expect(failure).toMatchObject({ message: 'Gemini readiness failed.', cause });
      expect(Object.hasOwn(failure, 'geminiTriggerDiagnostic')).toBe(false);
    },
  );
  it('does not read a model error cause accessor', async () => {
    const getter = vi.fn(() => 'model-menu');
    mode.mockRejectedValue(
      Object.defineProperty(new Error('synthetic-secret'), 'cause', { get: getter }),
    );
    await expect(geminiReadiness()).rejects.toMatchObject({
      message: 'Gemini readiness failed.',
      cause: 'model',
    });
    expect(getter).not.toHaveBeenCalled();
  });
  it.each(['synthetic-secret', 'model-confirmation', { token: 'synthetic-secret' }])(
    'replaces an arbitrary model cause with the fixed fallback (case %#)',
    async (cause) => {
      mode.mockRejectedValue(new Error('synthetic-secret', { cause }));
      await expect(geminiReadiness()).rejects.toMatchObject({
        message: 'Gemini readiness failed.',
        cause: 'model',
      });
    },
  );
  it.each(['page', 'interrupted'] as const)(
    'prioritizes %s while preserving sanitized cleanup failure evidence',
    async (cause) => {
      const controller = new AbortController();
      const original = new Error('synthetic-secret', { cause: 'model-cleanup' });
      mode.mockImplementation(async () => {
        location.href = 'https://gemini.google.com/app/other';
        if (cause === 'interrupted') controller.abort();
        throw original;
      });
      const failure = await geminiReadiness(controller.signal).catch((error) => error);
      expect(failure).toBeInstanceOf(AggregateError);
      expect(failure).toMatchObject({
        message: 'Gemini readiness failed.',
        cause,
      });
      expect(failure.errors).toHaveLength(1);
      expect(failure.errors[0]).toBeInstanceOf(Error);
      expect(failure.errors[0]).not.toBe(original);
      expect(failure.errors[0]).toMatchObject({
        message: 'Gemini readiness failed.',
        cause: 'model-cleanup',
      });
    },
  );
  it('does not invent cleanup failure evidence for another cancelled model failure', async () => {
    const controller = new AbortController();
    mode.mockImplementation(async () => {
      controller.abort();
      throw new Error('synthetic-secret', { cause: 'model-selection' });
    });
    const failure = await geminiReadiness(controller.signal).catch((error) => error);
    expect(failure).not.toBeInstanceOf(AggregateError);
    expect(failure).toMatchObject({ message: 'Gemini readiness failed.', cause: 'interrupted' });
    expect(failure.errors).toBeUndefined();
  });
  it('accepts only fixed readiness stages at the public progress boundary', () => {
    for (const reason of [
      'page',
      'model',
      'model-trigger',
      'model-menu',
      'model-selection',
      'model-cleanup',
      'model-confirmation',
      'interrupted',
    ])
      expect(GeminiReadinessProgress.safeParse({ status: 'error', reason }).success).toBe(true);
    expect(
      GeminiReadinessProgress.safeParse({ status: 'error', reason: 'synthetic-secret' }).success,
    ).toBe(false);
  });
  it('requires one fixed reason only for unknown protection', () => {
    const unknown = { model: 'Test', protection: 'unknown', client: { status: 'candidate' } };
    expect(GeminiReadinessResult.safeParse(unknown).success).toBe(false);
    for (const protectionReason of [
      'bootstrap-missing',
      'bootstrap-format',
      'bootstrap-limit',
      'configuration-format',
      'flag-missing',
      'flag-ambiguous',
      'flag-format',
    ]) {
      expect(GeminiReadinessResult.safeParse({ ...unknown, protectionReason }).success).toBe(true);
      for (const protection of ['enabled', 'disabled'])
        expect(
          GeminiReadinessResult.safeParse({ ...unknown, protection, protectionReason }).success,
        ).toBe(false);
    }
    expect(
      GeminiReadinessResult.safeParse({ ...unknown, protectionReason: 'synthetic-secret' }).success,
    ).toBe(false);
  });
  it('strict public schemas reject extra provider values', () => {
    expect(
      GeminiReadinessResult.safeParse({ model: 'Test', protection: 'disabled', token: 'secret' })
        .success,
    ).toBe(false);
    expect(
      GeminiReadinessRecord.safeParse({ id: 'test', status: 'done', result: { model: 'Test' } })
        .success,
    ).toBe(false);
    expect(
      GeminiReadinessProgress.safeParse({ status: 'error', reason: 'synthetic-secret' }).success,
    ).toBe(false);
  });
});

it.each([false, true])(
  'propagates the explicit header readiness policy %s without changing the default',
  async (header) => {
    mode.mockResolvedValue({ label: 'Automatic fixture', modeId: 'fixture-mode' });
    const signal = new AbortController().signal;
    await expect(geminiReadiness(signal, header)).resolves.toEqual({
      model: 'Automatic fixture',
      modeId: 'fixture-mode',
    });
    expect(mode).toHaveBeenCalledExactlyOnceWith(signal, header);
  },
);
