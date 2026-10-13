import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  geminiReadiness,
  readGeminiProtection,
} from '../../../src/infrastructure/providers/gemini/readiness';
import {
  GeminiReadinessResult,
  GeminiReadinessRecord,
  GeminiReadinessProgress,
} from '../../../src/application/gemini-readiness';
const mode = vi.hoisted(() => vi.fn());
vi.mock('../../../src/infrastructure/providers/models', () => ({ readGeminiMode: mode }));
const bootstrap = (value: unknown) =>
  `window.WIZ_global_data = ${JSON.stringify({ TSDtV: value, ignored: 'synthetic-private-value' })};`;
function scripts(...values: string[]) {
  vi.stubGlobal('document', {
    querySelectorAll: () => values.map((textContent) => ({ textContent })),
  });
}
afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetAllMocks();
});
describe('Gemini protection readiness', () => {
  it.each([
    [false, 'disabled'],
    [true, 'enabled'],
  ] as const)('reads an explicit JSON boolean %s', (value, expected) => {
    scripts(bootstrap(JSON.stringify({ flags: { '45428920': value }, token: 'synthetic-secret' })));
    expect(readGeminiProtection()).toBe(expected);
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
  ])('keeps missing or malformed JSON unknown: %s', (value) => {
    scripts(bootstrap(value));
    expect(readGeminiProtection()).toBe('unknown');
  });
  const jspb = (rows: unknown[], groups?: unknown[]) =>
    'abcd' + JSON.stringify([groups ?? [[null, rows]]]).slice(1);
  it.each([
    [false, 'disabled'],
    [0, 'disabled'],
    [true, 'enabled'],
    [1, 'enabled'],
  ] as const)('reads JSPB boolean %s', (value, expected) => {
    scripts(bootstrap(jspb([[45428920, null, value]])));
    expect(readGeminiProtection()).toBe(expected);
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
    scripts(bootstrap(jspb(rows)));
    expect(readGeminiProtection()).toBe('unknown');
  });
  it('rejects duplicate flag groups and sparse objects', () => {
    scripts(
      bootstrap(
        jspb(
          [],
          [
            [null, [[45428920, null, false]]],
            [null, [[45428920, null, true]]],
          ],
        ),
      ),
    );
    expect(readGeminiProtection()).toBe('unknown');
    scripts(bootstrap('abcd' + JSON.stringify([[{ '2': [[45428920, null, false]] }]]).slice(1)));
    expect(readGeminiProtection()).toBe('unknown');
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
    scripts(bootstrap(jspb([], [group])));
    expect(readGeminiProtection()).toBe('unknown');
  });
  it('rejects duplicate bootstrap assignments and duplicated properties', () => {
    const good = bootstrap('{"flags":{"45428920":false}}');
    for (const values of [
      [good, good],
      [good + good],
      ['window.WIZ_global_data={"TSDtV":"{}","TSDtV":"{}"};'],
    ]) {
      scripts(...values);
      expect(readGeminiProtection()).toBe('unknown');
    }
  });
  it('rejects missing, oversized, inaccessible and executable bootstrap', () => {
    for (const values of [[], [' '.repeat(1048577)], ['window.WIZ_global_data = dangerous();']]) {
      scripts(...values);
      expect(readGeminiProtection()).toBe('unknown');
    }
    vi.stubGlobal('document', {
      querySelectorAll() {
        throw new Error('synthetic-secret');
      },
    });
    expect(readGeminiProtection()).toBe('unknown');
  });
  it('returns only label and protection without using a network or exporting request keys', async () => {
    vi.stubGlobal('location', { href: 'https://gemini.google.com/app' });
    scripts(bootstrap('{"flags":{"45428920":false},"token":"synthetic-secret"}'));
    mode.mockResolvedValue({ label: 'Synthetic automatic', modeId: 'synthetic-key' });
    const fetch = vi.fn(() => {
      throw new Error('must not fetch');
    });
    vi.stubGlobal('fetch', fetch);
    expect(await geminiReadiness()).toEqual({
      model: 'Synthetic automatic',
      protection: 'disabled',
    });
    expect(fetch).not.toHaveBeenCalled();
  });
  it('fails with fixed reasons for cancellation, changed page, and model failure', async () => {
    vi.stubGlobal('location', { href: 'https://gemini.google.com/app' });
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
