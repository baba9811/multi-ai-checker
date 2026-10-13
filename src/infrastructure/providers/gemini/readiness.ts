import { GeminiReadinessResult } from '../../../application/gemini-readiness';
import { readGeminiMode } from '../models';

type Protection = GeminiReadinessResult['protection'];
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
function protection(source: string): Protection {
  let value: unknown;
  if (source.trimStart().startsWith('{')) {
    const json = uniqueJson(source);
    if (!record(json) || !record(json.flags)) return 'unknown';
    value = json.flags[FLAG];
    if (typeof value !== 'boolean') return 'unknown';
  } else {
    // Official tZa replaces the first four characters with '['; the prefix
    // itself is opaque. Require the supported positional shape, never eval.
    if (source.length < 5) return 'unknown';
    const root = uniqueJson('[' + source.slice(4));
    if (
      !Array.isArray(root) ||
      root.length !== 1 ||
      !Array.isArray(root[0]) ||
      root[0].length !== 1
    )
      return 'unknown';
    // Google JSPB merges numeric trailing-object fields over dense values.
    // Sparse objects are unsupported here; never read a shadowed dense flag.
    const group: unknown = root[0][0];
    if (
      !Array.isArray(group) ||
      group.some(record) ||
      !Array.isArray(group[1]) ||
      group[1].length > 10000
    )
      return 'unknown';
    const rows: unknown[] = group[1];
    if (rows.some((row) => !Array.isArray(row) || row.some(record))) return 'unknown';
    const matches = rows.filter(
      (row) => Array.isArray(row) && (row[0] === FLAG || row[0] === 45428920),
    );
    if (matches.length !== 1) return 'unknown';
    const row = matches[0] as unknown[];
    if (
      row.length > 8 ||
      [1, 3, 4, 5, 6, 7].some((index) => row[index] !== undefined && row[index] !== null)
    )
      return 'unknown';
    value = row[2];
    if (value === 0) value = false;
    if (value === 1) value = true;
    if (typeof value !== 'boolean') return 'unknown';
  }
  return value ? 'enabled' : 'disabled';
}

export function readGeminiProtection(): Protection {
  try {
    const scripts = Array.from(document.querySelectorAll('script'));
    if (scripts.length > 256) return 'unknown';
    let assignment: string | undefined;
    let size = 0;
    for (const script of scripts) {
      const text = script.textContent ?? '';
      size += text.length;
      if (size > LIMIT * 4 || text.length > LIMIT) return 'unknown';
      if (!text.includes('WIZ_global_data')) continue;
      if (assignment !== undefined) return 'unknown';
      assignment = text;
    }
    if (assignment === undefined) return 'unknown';
    const match = /^\s*(?:window\.|var\s+)?WIZ_global_data\s*=\s*(\{[\s\S]*\})\s*;?\s*$/.exec(
      assignment,
    );
    if (!match) return 'unknown';
    const bootstrap = uniqueJson(match[1]!);
    if (!record(bootstrap) || typeof bootstrap.TSDtV !== 'string') return 'unknown';
    return protection(bootstrap.TSDtV);
  } catch {
    return 'unknown';
  }
}

export async function geminiReadiness(signal?: AbortSignal): Promise<GeminiReadinessResult> {
  const check = () => {
    const cause = signal?.aborted
      ? 'interrupted'
      : location.href !== 'https://gemini.google.com/app'
        ? 'page'
        : undefined;
    if (cause) throw new Error('Gemini readiness failed.', { cause });
  };
  check();
  let model: string;
  try {
    model = (await readGeminiMode()).label;
  } catch {
    check();
    throw new Error('Gemini readiness failed.', { cause: 'model' });
  }
  check();
  const result = GeminiReadinessResult.safeParse({ model, protection: readGeminiProtection() });
  if (!result.success) throw new Error('Gemini readiness failed.', { cause: 'model' });
  return result.data;
}
