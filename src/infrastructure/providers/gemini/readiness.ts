import {
  GeminiReadinessModel,
  type GeminiProtectionStatus as Protection,
} from '../../../application/gemini-readiness';
import { readGeminiMode } from '../models';

export function readGeminiPageProtection(): Protection {
  const unknown = (protectionReason: NonNullable<Protection['protectionReason']>): Protection => ({
    protection: 'unknown',
    protectionReason,
  });
  const FLAG = '45428920';
  const LIMIT = 1048576;
  function record(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  // JSON.parse alone silently accepts duplicate keys. Tokenize only JSON structure;
  // strings are kept whole so escaped braces/commas never become structural tokens.
  function uniqueJson(source: string): unknown {
    if (source.length > LIMIT) throw new Error();
    const value: unknown = JSON.parse(source);
    const stack: { keys?: Set<string>; key: boolean }[] = [];
    for (const match of source.matchAll(/"(?:\\.|[^"\\])*"|[{}\[\],:]/g)) {
      const token = match[0];
      const top = stack.at(-1);
      if (token === '{' || token === '[') {
        if (stack.length >= 32) throw new Error();
        stack.push({ keys: token === '{' ? new Set() : undefined, key: token === '{' });
      } else if (token === '}' || token === ']') stack.pop();
      else if (token === ',' && top?.keys) top.key = true;
      else if (token.startsWith('"') && top?.keys && top.key) {
        const key: string = JSON.parse(token);
        if (top.keys.has(key)) throw new Error();
        top.keys.add(key);
        top.key = false;
      }
    }
    return value;
  }
  function integer(value: unknown): boolean {
    if (typeof value === 'number') return Number.isSafeInteger(value);
    if (typeof value !== 'string' || value.length > 20 || !/^(?:0|-?[1-9]\d*)$/.test(value))
      return false;
    const parsed = BigInt(value);
    return parsed >= -9223372036854775808n && parsed <= 9223372036854775807n;
  }
  function protection(source: string): Protection {
    try {
      let value: unknown;
      if (source.trimStart().startsWith('{')) {
        const json = uniqueJson(source);
        if (!record(json) || !record(json.flags)) return unknown('configuration-format');
        if (!Object.hasOwn(json.flags, FLAG)) return unknown('flag-missing');
        value = json.flags[FLAG];
        if (typeof value !== 'boolean') return unknown('flag-format');
      } else {
        // Official tZa replaces the first four characters with '['; the prefix
        // itself is opaque. Require the supported positional shape, never eval.
        if (source.length < 5) return unknown('configuration-format');
        const root = uniqueJson('[' + source.slice(4));
        if (
          !Array.isArray(root) ||
          !root.length ||
          root.length > 10000 ||
          root.some(record) ||
          !Array.isArray(root[0]) ||
          !root[0].length ||
          root[0].length > 10000
        )
          return unknown('configuration-format');
        // JSPB sparse objects can override dense fields. The official reader
        // takes only the first configuration, but every row in it must resolve.
        const groups: unknown[][] = root[0];
        if (
          groups.some(
            (group) => !Array.isArray(group) || group.length > 10000 || group.some(record),
          )
        )
          return unknown('configuration-format');
        const group = groups[0]!;
        if (
          !Array.isArray(group[1]) ||
          group[1].length > 10000 ||
          group.slice(3).some((value) => value !== null) ||
          (group[0] != null &&
            (!Array.isArray(group[0]) ||
              group[0].length > 1 ||
              (group[0][0] != null && typeof group[0][0] !== 'string'))) ||
          (group[2] != null && typeof group[2] !== 'string')
        )
          return unknown('configuration-format');
        const rows: unknown[] = group[1];
        if (rows.some((row) => !Array.isArray(row) || row.some(record)))
          return unknown('configuration-format');
        const keys = new Set<string>();
        let found = false;
        for (const entry of rows) {
          const row = entry as unknown[];
          const key = row[0];
          if (
            row.length > 8 ||
            !integer(key) ||
            (row[6] != null && (typeof row[6] !== 'string' || row[6].length > LIMIT))
          )
            return unknown('flag-format');
          const normalized = String(key);
          if (keys.has(normalized)) return unknown('flag-ambiguous');
          keys.add(normalized);
          const active = [1, 2, 3, 4, 5, 7].filter((index) => row[index] != null);
          if (active.length !== 1) return unknown('flag-format');
          const index = active[0]!;
          const field = row[index];
          let valid = false;
          if (index === 1) valid = integer(field);
          else if (index === 2) valid = typeof field === 'boolean' || field === 0 || field === 1;
          else if (index === 3) valid = typeof field === 'number' && Number.isFinite(field);
          else if (index === 4) valid = typeof field === 'string' && field.length <= LIMIT;
          // shortcut: complex Any/nested flags remain unknown until their resolver semantics are supported.
          if (!valid) return unknown('flag-format');
          if (normalized === FLAG) {
            if (index !== 2) return unknown('flag-format');
            found = true;
            value = field === true || field === 1;
          }
        }
        if (!found) return unknown('flag-missing');
      }
      return { protection: value ? 'enabled' : 'disabled' };
    } catch {
      return unknown('configuration-format');
    }
  }
  try {
    if (window.top !== window || location.href !== 'https://gemini.google.com/app')
      return unknown('bootstrap-format');
    const bootstrap = (window as Window & { WIZ_global_data?: unknown }).WIZ_global_data;
    if (bootstrap === undefined) return unknown('bootstrap-missing');
    if (!record(bootstrap)) return unknown('bootstrap-format');
    const source = bootstrap.TSDtV;
    if (typeof source !== 'string') return unknown('configuration-format');
    if (source.length > LIMIT) return unknown('bootstrap-limit');
    return protection(source);
  } catch {
    return unknown('bootstrap-format');
  }
}

export async function geminiReadiness(
  signal?: AbortSignal,
): Promise<{ model: string; modeId: string }> {
  const check = () => {
    const cause = signal?.aborted
      ? 'interrupted'
      : location.href !== 'https://gemini.google.com/app'
        ? 'page'
        : undefined;
    if (cause) throw new Error('Gemini readiness failed.', { cause });
  };
  check();
  let selected: Awaited<ReturnType<typeof readGeminiMode>>;
  try {
    selected = await readGeminiMode(signal);
  } catch (error) {
    const cause = error instanceof Error ? error.cause : undefined;
    try {
      check();
    } catch (failure) {
      if (cause === 'model-cleanup')
        throw new AggregateError(
          [new Error('Gemini readiness failed.', { cause: 'model-cleanup' })],
          'Gemini readiness failed.',
          { cause: failure instanceof Error ? failure.cause : undefined },
        );
      throw failure;
    }
    throw new Error('Gemini readiness failed.', {
      cause:
        typeof cause === 'string' &&
        ['model-trigger', 'model-menu', 'model-selection', 'model-cleanup'].includes(cause)
          ? cause
          : 'model',
    });
  }
  check();
  const result = GeminiReadinessModel.safeParse({ model: selected.label });
  if (
    !result.success ||
    typeof selected.modeId !== 'string' ||
    !selected.modeId ||
    selected.modeId.length > 160 ||
    /\s/.test(selected.modeId)
  )
    throw new Error('Gemini readiness failed.', { cause: 'model' });
  return { ...result.data, modeId: selected.modeId };
}
