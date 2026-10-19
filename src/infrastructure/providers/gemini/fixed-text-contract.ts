import {
  GEMINI_FIXED_TEXT_TRIAL_ANSWER,
  GEMINI_FIXED_TEXT_TRIAL_PROMPT,
  GeminiFixedTextTrialReason,
  GEMINI_NATIVE_CONFIGURATION_DIAGNOSTICS,
  type GeminiNativeReceiveDiagnostic,
  type GeminiNativeConfigurationDiagnostic,
} from '../../../application/gemini-fixed-text-trial';

export type ApprovedGeminiTrial = {
  storeId: string;
  clientTurnId: string;
  modeId: string;
  modeCategory?: string;
  Cq?: string;
  thinkingLevel?: string;
  Hj?: string;
  isPersonalContextDisabled?: boolean;
};
export type CompletedGeminiTrial = {
  conversationId: string;
  turnId: string;
  candidateId: string;
  answer: typeof GEMINI_FIXED_TEXT_TRIAL_ANSWER;
  Zzb?: boolean;
  Eka?: string;
  tZa?: string;
  thinkingLevel?: string;
  Cq?: string;
  Hj?: string;
  regionCode?: string;
};
export type GeminiFinalMarker = {
  kind: 'marker';
  conversationId: string;
  turnId: string;
  observedCandidateId?: string;
};
export type GeminiTrialCompletion = CompletedGeminiTrial | GeminiFinalMarker;
export type GeminiTrialRawObservation = {
  conversationId?: string;
  turnId?: string;
  candidateId?: string;
  completed?: CompletedGeminiTrial;
  routing?: { epa: string; Kzd?: string };
};

// Public dF/eF mappings; unspecified metadata never establishes completion.
const categories = [
  'MODE_CATEGORY_UNSPECIFIED',
  'MODE_CATEGORY_FAST',
  'MODE_CATEGORY_THINKING',
  'MODE_CATEGORY_PRO',
  'MODE_CATEGORY_AUTO',
  'MODE_CATEGORY_FAST_DYNAMIC_THINKING',
  'MODE_CATEGORY_FLASH_LITE',
  'MODE_CATEGORY_FLASH_PLUS',
  'MODE_CATEGORY_ULTRA',
] as const;
const thinking = [
  'THINKING_LEVEL_STANDARD',
  'THINKING_LEVEL_STANDARD',
  'THINKING_LEVEL_EXTENDED',
  'THINKING_LEVEL_DEEP_THINK',
  'THINKING_LEVEL_MEDIUM',
] as const;
type ReceivePredicate = GeminiNativeReceiveDiagnostic['predicate'];
const outboundFailures = new WeakMap<object, ReceivePredicate>();
export function readGeminiNativeReceivePredicate(error: unknown) {
  return error !== null && (typeof error === 'object' || typeof error === 'function')
    ? outboundFailures.get(error)
    : undefined;
}
export function readGeminiNativeOutboundDiagnostic(
  error: unknown,
): GeminiNativeConfigurationDiagnostic | undefined {
  const code = readGeminiNativeReceivePredicate(error);
  return GEMINI_NATIVE_CONFIGURATION_DIAGNOSTICS.includes(
    code as GeminiNativeConfigurationDiagnostic,
  )
    ? (code as GeminiNativeConfigurationDiagnostic)
    : undefined;
}
function transferOutboundFailure(
  error: unknown,
  failure: Error,
  fallback?: ReceivePredicate,
): never {
  const diagnostic = readGeminiNativeReceivePredicate(error) ?? fallback;
  if (diagnostic) outboundFailures.set(failure, diagnostic);
  throw failure;
}
function require(condition: unknown, diagnostic?: ReceivePredicate): asserts condition {
  if (!condition) {
    const failure = new Error();
    if (diagnostic) outboundFailures.set(failure, diagnostic);
    throw failure;
  }
}
function own(value: unknown, key: PropertyKey, diagnostics = false) {
  require(value !== null && (typeof value === 'object' || typeof value === 'function'), diagnostics
    ? 'dispatch-native-n15-own-object'
    : undefined);
  const descriptor = Object.getOwnPropertyDescriptor(value, key);
  if (!descriptor) return undefined;
  require('value' in descriptor, diagnostics ? 'dispatch-native-n15-own-data' : undefined);
  return descriptor.value as unknown;
}
function object(value: unknown, diagnostics = false): Record<string, unknown> {
  require(value !== null && typeof value === 'object' && !Array.isArray(value), diagnostics
    ? 'dispatch-native-n15-object-01'
    : undefined);
  require(Object.getPrototypeOf(value) === Object.prototype ||
    Object.getPrototypeOf(value) === null, diagnostics
    ? 'dispatch-native-n15-object-02'
    : undefined);
  const descriptors = Object.getOwnPropertyDescriptors(value);
  require(Reflect.ownKeys(descriptors).length <= 64, diagnostics
    ? 'dispatch-native-n15-object-03'
    : undefined);
  const result: Record<string, unknown> = Object.create(null);
  for (const key of Reflect.ownKeys(descriptors)) {
    require(typeof key === 'string', diagnostics ? 'dispatch-native-n15-object-04' : undefined);
    const descriptor = descriptors[key]!;
    require('value' in descriptor, diagnostics ? 'dispatch-native-n15-object-05' : undefined);
    result[key] = descriptor.value;
  }
  return result;
}
function keys(value: Record<string, unknown>, allowed: string[]) {
  require(Object.keys(value).every((key) => allowed.includes(key)));
}
const id = (value: unknown) =>
  typeof value === 'string' && !!value && value.length <= 160 && !/\s/.test(value);
// Closed default I4h language subset; neither scalar establishes model choice or finality.
const trialLanguages =
  'en ja ko zh id th hi bn vi ar sw es he iw mr gu kn ml ta te ur ru de fr it nl pl pt sv sr tr uk cs hu ro da sk no bg hr lt et lv'.split(
    ' ',
  );
export const isGeminiTrialLanguage = (value: unknown) =>
  value === undefined ||
  (typeof value === 'string' && (value === '' || trialLanguages.includes(value)));
export const isGeminiTrialAttribution = (value: unknown) =>
  value === undefined ||
  (typeof value === 'string' && value.length <= 160 && !/[^\x20-\x7e]|,/.test(value));
const wireTrue = (value: unknown) => value === true || value === 1;
const wireFalse = (value: unknown) => value === undefined || value === false || value === 0;
function approval(value: unknown) {
  const a = object(value);
  keys(a, [
    'storeId',
    'clientTurnId',
    'modeId',
    'modeCategory',
    'Cq',
    'thinkingLevel',
    'Hj',
    'isPersonalContextDisabled',
  ]);
  require(id(a.storeId) && id(a.clientTurnId) && id(a.modeId));
  for (const key of ['Cq', 'Hj']) require(a[key] === undefined || id(a[key]));
  require(a.modeCategory === undefined || categories.some((entry) => entry === a.modeCategory));
  require(a.thinkingLevel === undefined || thinking.some((entry) => entry === a.thinkingLevel));
  require(
    a.isPersonalContextDisabled === undefined || typeof a.isPersonalContextDisabled === 'boolean',
  );
  return a;
}

const outboundOwn = own,
  outboundObject = object;
const nativePlainNodeOneofFields = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28,
  29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
  53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76,
  77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95,
];
const nativeMapPrototype = Map.prototype;
const nativeMapSize = Object.getOwnPropertyDescriptor(nativeMapPrototype, 'size')!.get!;
const nativeMapHas = Object.getOwnPropertyDescriptor(nativeMapPrototype, 'has')!.value;
const nativeMapGet = Object.getOwnPropertyDescriptor(nativeMapPrototype, 'get')!.value;
function wireReader(
  namespace: unknown,
  diagnostics = false,
  outbound = false,
  inbound = false,
  sourceClone = false,
) {
  const own = (value: unknown, key: PropertyKey) => outboundOwn(value, key, diagnostics);
  const object = (value: unknown) => outboundObject(value, diagnostics);
  const candidateFlag = own(namespace, 'La');
  require(typeof candidateFlag === 'symbol' ||
    (typeof candidateFlag === 'string' && !!candidateFlag), diagnostics
    ? 'dispatch-native-n15-wire-01'
    : undefined);
  const flag = candidateFlag;
  const cacheKey = outbound || inbound ? own(namespace, 'dga') : undefined;
  if (outbound || inbound)
    require(typeof cacheKey === 'symbol' && cacheKey !== flag, diagnostics && inbound
      ? 'cache-shape'
      : undefined);
  const groups: Record<string, { key: string; fields: number[] }> = inbound
    ? {
        Kzd: { key: '$L', fields: [1, 2, 3, 4, 5, 6] },
        XJd: { key: 'ZL', fields: [2, 3, 5, 6, 7, 8, 9] },
        RJd: { key: 'SJd', fields: [1, 2] },
        QJd: { key: 'YL', fields: [3, 4] },
        IF: { key: 'HF', fields: [11, 21, 23, 28, 37, 49, 51] },
        oH: { key: 'pH', fields: nativePlainNodeOneofFields },
      }
    : {
        JJd: { key: 'XL', fields: [1, 2, 3, 4] },
        GJd: { key: 'HJd', fields: [6, 8] },
        WL: { key: 'VL', fields: [3, 4, 6, 7, 8, 9] },
      };
  function oneof(raw: unknown[], fields: Map<number, unknown>, owner?: string) {
    const cache = cacheKey === undefined ? undefined : own(raw, cacheKey as symbol);
    const group = owner && groups[owner];
    require(group, diagnostics && inbound ? 'cache-shape' : undefined);
    const expected = own(namespace, group.key);
    require(Array.isArray(expected) &&
      Object.getPrototypeOf(expected) === Array.prototype, diagnostics && inbound
      ? 'cache-shape'
      : undefined);
    require(own(expected, 'length') === group.fields.length, diagnostics && inbound
      ? 'cache-shape'
      : undefined);
    require(Reflect.ownKeys(expected).length === group.fields.length + 1, diagnostics && inbound
      ? 'cache-shape'
      : undefined);
    group.fields.forEach((field, index) =>
      require(own(expected, String(index)) === field, diagnostics && inbound
        ? 'cache-shape'
        : undefined),
    );
    const populated = group.fields.filter((field) => fields.has(field));
    require(populated.length <= 1, diagnostics && inbound ? 'cache-selection' : undefined);
    if (!Object.hasOwn(raw, cacheKey as symbol)) return;
    require(cache !== null &&
      typeof cache === 'object' &&
      Object.getPrototypeOf(cache) === nativeMapPrototype &&
      Reflect.ownKeys(cache).length === 0, diagnostics && inbound ? 'cache-shape' : undefined);
    require(Map.prototype === nativeMapPrototype &&
      Object.getOwnPropertyDescriptor(nativeMapPrototype, 'size')?.get === nativeMapSize &&
      own(nativeMapPrototype, 'has') === nativeMapHas &&
      own(nativeMapPrototype, 'get') === nativeMapGet, diagnostics && inbound
      ? 'cache-shape'
      : undefined);
    for (const [method, source] of [
      [nativeMapSize, 'get size'],
      [nativeMapHas, 'has'],
      [nativeMapGet, 'get'],
    ] as const)
      require(Reflect.apply(Function.prototype.toString, method, []) ===
        `function ${source}() { [native code] }`, diagnostics && inbound
        ? 'cache-shape'
        : undefined);
    // Only captured intrinsics inspect Map internal slots; no provider reader or iterator is called.
    const intrinsic = <T>(call: () => T): T => {
      try {
        return call();
      } catch (error) {
        if (
          diagnostics &&
          inbound &&
          error !== null &&
          (typeof error === 'object' || typeof error === 'function') &&
          !outboundFailures.has(error)
        )
          outboundFailures.set(error, 'cache-intrinsic');
        throw error;
      }
    };
    const size = intrinsic(() => Reflect.apply(nativeMapSize, cache, []));
    require(size <= 1, diagnostics && inbound ? 'cache-selection' : undefined);
    if (size)
      require(intrinsic(() => Reflect.apply(nativeMapHas, cache, [expected])) &&
        intrinsic(() => Reflect.apply(nativeMapGet, cache, [expected])) ===
          (populated[0] ?? 0), diagnostics && inbound ? 'cache-selection' : undefined);
  }
  let nodes = 0;
  const seen = new WeakSet<object>();
  function array(value: unknown, repeated = false, owner?: string): unknown[] {
    require(Array.isArray(value) && Object.getPrototypeOf(value) === Array.prototype, diagnostics
      ? 'dispatch-native-n15-wire-02'
      : undefined);
    const length = own(value, 'length');
    require(typeof length === 'number' && length <= 1024 && Number.isInteger(length), diagnostics
      ? 'dispatch-native-n15-wire-03'
      : undefined);
    require(++nodes <= 4096, diagnostics ? 'dispatch-native-n15-wire-04' : undefined);
    if (length) {
      require(!seen.has(value), diagnostics ? 'dispatch-native-n15-wire-05' : undefined);
      seen.add(value);
    }
    for (const key of Reflect.ownKeys(value)) {
      require(key === 'length' ||
        key === flag ||
        ((outbound || inbound) &&
          owner !== undefined &&
          Object.hasOwn(groups, owner) &&
          key === cacheKey) ||
        (typeof key === 'string' && /^(0|[1-9]\d*)$/.test(key) && Number(key) < length), diagnostics
        ? 'dispatch-native-n15-wire-06'
        : undefined);
      own(value, key);
    }
    const flags = own(value, flag) ?? 0;
    require(typeof flags === 'number' &&
      Number.isInteger(flags) &&
      flags >= 0 &&
      flags <= 0xffffff, diagnostics ? 'dispatch-native-n15-wire-07' : undefined);
    require(!(flags & 128) && (repeated || !(flags & (1 | 256))), diagnostics
      ? 'dispatch-native-n15-wire-forbidden-flags'
      : undefined);
    return value;
  }
  function prototype(name: string) {
    const constructor =
      name === 'history' ? own(own(namespace, 'gHd'), 'Pb') : own(namespace, name);
    require(typeof constructor === 'function', diagnostics
      ? 'dispatch-native-n15-wire-09'
      : undefined);
    const value = own(constructor, 'prototype');
    require(value !== null && typeof value === 'object', diagnostics
      ? 'dispatch-native-n15-wire-10'
      : undefined);
    return value;
  }
  function message(
    value: unknown,
    name?: string,
    repeated = false,
    owner = outbound || inbound ? name : undefined,
  ): Map<number, unknown> {
    let raw: unknown;
    if (Array.isArray(value)) raw = value;
    else {
      require(name &&
        value !== null &&
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === prototype(name), diagnostics
        ? 'dispatch-native-n15-wire-11'
        : undefined);
      for (const key of Reflect.ownKeys(value)) {
        require(key === 'fl' || key === 'Fb' || key === 'tcc', diagnostics
          ? 'dispatch-native-n15-wire-12'
          : undefined);
        own(value, key);
      }
      raw = own(value, 'fl');
      const flags = own(raw, flag);
      require(typeof flags === 'number' && !!(flags & 64), diagnostics
        ? 'dispatch-native-n15-wire-13'
        : undefined);
    }
    const data = array(raw, repeated, owner);
    const result = new Map<number, unknown>();
    const last = data.length - 1;
    const lastValue = last < 0 ? undefined : own(data, String(last));
    const tail =
      lastValue !== null &&
      typeof lastValue === 'object' &&
      Object.getPrototypeOf(lastValue) === Object.prototype
        ? object(lastValue)
        : undefined;
    const pivot = (Number(own(data, flag) ?? 0) >>> 14) & 1023;
    require(!pivot || (tail && pivot === last + 1), diagnostics
      ? 'dispatch-native-n15-wire-14'
      : undefined);
    for (let index = 0; index < data.length - (tail ? 1 : 0); index++) {
      const entry = own(data, String(index));
      if (entry !== null && entry !== undefined) result.set(index + 1, entry);
    }
    if (tail)
      for (const [key, entry] of Object.entries(tail)) {
        require(/^[1-9]\d*$/.test(key) &&
          Number.isSafeInteger(Number(key)) &&
          Number(key) >= last + 1, diagnostics ? 'dispatch-native-n15-wire-15' : undefined);
        if (entry !== null && entry !== undefined) result.set(Number(key), entry);
      }
    if ((outbound || inbound) && owner && Object.hasOwn(groups, owner)) oneof(data, result, owner);
    return result;
  }
  function fields(
    value: Map<number, unknown>,
    allowed: number[],
    predicate: ReceivePredicate = 'dispatch-native-n15-wire-16',
    ignored?: { fields: readonly number[]; predicate: ReceivePredicate },
  ) {
    let failure = predicate;
    require([...value.keys()].every((field) => {
      if (allowed.includes(field)) return true;
      if (ignored?.fields.includes(field)) failure = ignored.predicate;
      return false;
    }), diagnostics ? failure : undefined);
  }
  function emptyMessage(
    value: unknown,
    name?: string,
    allowedRepeated: number[] = [],
    predicate?: ReceivePredicate,
  ) {
    if (value === null || value === undefined) return;
    const data = message(value, name);
    fields(data, allowedRepeated, predicate);
    for (const entry of data.values()) require(array(entry, true).length === 0);
  }
  function emptyList(value: unknown) {
    if (value !== null && value !== undefined) require(array(value, true).length === 0);
  }
  function one(value: unknown) {
    const data = array(value, true);
    require(data.length === 1);
    return own(data, '0');
  }
  let opaqueCharacters = 0;
  function opaque(value: unknown, name?: string, depth = 0) {
    require(depth <= 64);
    const data = message(value, name, depth > 0);
    for (const entry of data.values()) {
      if (Array.isArray(entry)) opaque(entry, undefined, depth + 1);
      else if (typeof entry === 'string') {
        opaqueCharacters += entry.length;
        require(opaqueCharacters <= 1048576);
      } else
        require(
          typeof entry === 'boolean' || (typeof entry === 'number' && Number.isFinite(entry)),
        );
    }
  }
  function backing(value: unknown): unknown[] {
    if (Array.isArray(value)) return value;
    require(value !== null && typeof value === 'object', diagnostics
      ? 'dispatch-native-n15-wire-23'
      : undefined);
    const p = Object.getPrototypeOf(value);
    const constructor = own(p, 'constructor');
    require(typeof constructor === 'function' && own(constructor, 'prototype') === p, diagnostics
      ? 'dispatch-native-n15-wire-24'
      : undefined);
    require(Object.getPrototypeOf(p) === prototype('l'), diagnostics
      ? 'dispatch-native-n15-wire-25'
      : undefined);
    for (const key of Reflect.ownKeys(value)) {
      require(key === 'fl' || key === 'Fb' || key === 'tcc', diagnostics
        ? 'dispatch-native-n15-wire-26'
        : undefined);
      own(value, key);
    }
    const raw = own(value, 'fl');
    require(Array.isArray(raw) && Number(own(raw, flag)) & 64, diagnostics
      ? 'dispatch-native-n15-wire-27'
      : undefined);
    return raw;
  }
  const snapshotBackings: unknown[][] = [];
  type Snapshot = string | number | bigint | boolean | null | undefined | readonly Snapshot[];
  const snapshotNodes: Array<{
    value: unknown;
    raw: unknown[];
    name?: string;
    repeated: boolean;
    opaqueShape: boolean;
    nativeHFPath?: readonly number[];
    content?: Snapshot;
  }> = [];
  function snapshot(
    value: unknown,
    name?: string,
    repeated = false,
    omitIdentity = false,
    depth = 0,
    opaqueShape = false,
    nativePath?: readonly number[],
    nativeHFPath?: readonly number[],
  ): Snapshot {
    if (
      inbound &&
      nativePath?.length === 5 &&
      nativePath.every((field, index) => field === [2, 7, 1, 4, 4][index])
    ) {
      name = 'IF';
      nativeHFPath = [];
    }
    if (inbound && name === 'IF' && depth === 0) nativeHFPath = [];
    require(depth <= 64, diagnostics ? 'dispatch-native-n15-wire-28' : undefined);
    if (value === null || value === undefined || typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      opaqueCharacters += value.length;
      require(opaqueCharacters <= 1048576, diagnostics ? 'dispatch-native-n15-wire-29' : undefined);
      return value;
    }
    if (typeof value === 'number') {
      require(Number.isFinite(value), diagnostics ? 'dispatch-native-n15-wire-30' : undefined);
      return value;
    }
    if (typeof value === 'bigint') {
      require(nativePath?.length === 2 &&
        ((nativePath[0] === 1 && nativePath[1] === 2 && value === 0n) ||
          (nativePath[0] === 2 && nativePath[1] === 1 && value === 1n)), diagnostics
        ? 'dispatch-native-n15-wire-31'
        : undefined);
      return value;
    }
    const raw = backing(value);
    snapshotBackings.push(raw);
    const node = {
      value,
      raw,
      name,
      repeated,
      opaqueShape,
      nativeHFPath,
      content: undefined as Snapshot,
    };
    snapshotNodes.push(node);
    if (!Array.isArray(value) && name) {
      if (name === 'private' || name === 'native-status')
        nativePrivateBacking(
          namespace,
          value,
          name === 'native-status' ? 'm1c' : 'QGd',
          diagnostics,
        );
      else
        require(Object.getPrototypeOf(value) === prototype(name), diagnostics
          ? 'dispatch-native-n15-wire-32'
          : undefined);
    }
    if (repeated) {
      const data = array(raw, true);
      return (node.content = Object.freeze(
        Array.from({ length: data.length }, (_, index) =>
          snapshot(
            own(data, String(index)),
            name,
            false,
            false,
            depth + 1,
            opaqueShape,
            nativePath ? [...nativePath, index] : undefined,
            nativeHFPath ? [...nativeHFPath, index] : undefined,
          ),
        ),
      ));
    }
    const owner =
      inbound && nativeHFPath?.length === 0
        ? 'IF'
        : inbound &&
            name === 'oH' &&
            nativeHFPath?.length === 4 &&
            nativeHFPath.every((field, index) => field === [27, 0, 1, 0][index])
          ? 'oH'
          : outbound && nativePath
            ? nativePath.length === 0
              ? 'JJd'
              : nativePath.length === 1 && nativePath[0] === 1
                ? 'GJd'
                : nativePath.length === 1 && nativePath[0] === 2
                  ? 'WL'
                  : undefined
            : inbound && nativePath
              ? nativePath.length === 0
                ? 'Kzd'
                : nativePath.length === 1 && nativePath[0] === 2
                  ? 'XJd'
                  : nativePath.length === 2 && nativePath[0] === 2 && nativePath[1] === 7
                    ? 'RJd'
                    : nativePath.length === 3 &&
                        nativePath[0] === 2 &&
                        nativePath[1] === 7 &&
                        nativePath[2] === 1
                      ? 'QJd'
                      : undefined
              : undefined;
    if (owner && !Array.isArray(value)) require(Object.getPrototypeOf(value) === prototype(owner));
    const data = message(raw, undefined, nativeHFPath ? !name : true, owner);
    // IJd declares these unused ancillary slots outside the selected response oneofs.
    const ancillary =
      inbound && nativePath
        ? owner === 'XJd'
          ? [1, 4]
          : owner === 'QJd'
            ? [1, 2]
            : nativePath.length === 4 &&
                nativePath.every((field, index) => field === [2, 7, 1, 4][index])
              ? [1, 2, 3]
              : []
        : [];
    const content = [...data]
      .filter(
        ([field, entry]) =>
          (!omitIdentity || field !== 2) &&
          !(inbound && name === 'IF' && field === 25) &&
          !ancillary.includes(field) &&
          !(
            sourceClone &&
            ((name === 'IF' && [5, 12, 13, 27, 56].includes(field)) ||
              (name === 'qH' && field === 1)) &&
            Array.isArray(entry) &&
            entry.length === 0
          ),
      )
      .sort(([a], [b]) => a - b)
      .map(([field, entry]) =>
        Object.freeze([
          field,
          snapshot(
            entry,
            name === 'IF'
              ? (
                  {
                    2: 'CI',
                    5: nativeHFPath ? 'FF' : 'AF',
                    6: 'W4c',
                    21: 'DAd',
                    27: 'qH',
                    46: 'vL',
                    52: 'private',
                    55: 'private',
                    65: 'private',
                  } as Record<number, string>
                )[field]
              : name === 'AF' || name === 'FF'
                ? (
                    {
                      2: '$Zc',
                      9:
                        nativeHFPath?.length === 2 && nativeHFPath[0] === 5 && nativeHFPath[1] === 0
                          ? 'native-status'
                          : 'private',
                      13: '$v',
                    } as Record<number, string>
                  )[field]
                : name === 'qH' && field === 1
                  ? 'oH'
                  : name === 'oH' && field === 2
                    ? 'gH'
                    : undefined,
            (name === 'IF' && [5, 12, 13, 27, 56].includes(field)) ||
              (name === 'qH' && field === 1),
            false,
            depth + 1,
            opaqueShape || (name === 'IF' && [46, 52].includes(field)),
            nativePath ? [...nativePath, field] : undefined,
            nativeHFPath ? [...nativeHFPath, field] : undefined,
          ),
        ]),
      );
    // Opaque arrays have no schema here; retain their cardinality instead of guessing a message/list.
    return (node.content = Object.freeze(
      opaqueShape ? ['opaque-wire', raw.length, ...content] : content,
    ));
  }
  return {
    privateBacking: (value: unknown, kind: 'QGd' | 'm1c') =>
      nativePrivateBacking(namespace, value, kind, diagnostics),
    diagnostics,
    prototype,
    message,
    fields,
    emptyMessage,
    emptyList,
    one,
    array,
    opaque,
    backing,
    snapshot,
    snapshotBackings,
    snapshotNodes,
  };
}

export function readGeminiTrialRawFrame(
  namespace: unknown,
  raw: unknown,
): GeminiTrialRawObservation {
  let read: ReturnType<typeof wireReader>, frame: Map<number, unknown>;
  try {
    read = wireReader(namespace);
    require(
      raw !== null &&
        typeof raw === 'object' &&
        Object.getPrototypeOf(raw) === read.prototype('IF'),
    );
    frame = read.message(raw, 'IF');
  } catch {
    throw new Error('Gemini trial contract failed.', { cause: 'response-shape' });
  }
  return readGeminiRawContent(read, frame, 'rpc');
}

function readGeminiRawContent(
  read: ReturnType<typeof wireReader>,
  frame: Map<number, unknown>,
  profile: 'rpc' | 'native',
  captureRecoveryControl = false,
): GeminiTrialRawObservation {
  let stage: GeminiFixedTextTrialReason = 'response-raw-fields';
  try {
    // These are live kF tags, not the saved o5c response tags.
    const allowed = [
      2, 5, 6, 9, 12, 13, 15, 16, 18, 20, 21, 24, 27, 32, 34, 40, 43, 44, 46, 50, 52, 55, 56, 58,
      59, 60, 61, 62, 63, 65,
    ];
    require(
      [...frame.keys()].every((field) => {
        if (allowed.includes(field) || (profile === 'native' && field === 25)) return true;
        // Classify only the first rejected key; other unsupported fields may remain.
        if ([1, 3, 4, 14, 17, 18, 19, 22, 29, 31, 38, 39, 42, 44, 45, 51, 54].includes(field))
          stage = `response-raw-field-${field}` as GeminiFixedTextTrialReason;
        switch (field) {
          case 11:
            stage = 'response-raw-title';
            break;
          case 21:
            stage = 'response-raw-routing';
            break;
          case 23:
            stage = 'response-raw-attribution';
            break;
          case 26:
            stage = 'response-raw-history';
            break;
          case 28:
            stage = 'response-raw-quota';
            break;
          case 37:
            stage = 'response-raw-heartbeat';
            break;
          case 20:
          case 43:
            stage = 'response-raw-string';
            break;
          case 48:
          case 64:
            stage = 'response-raw-enum';
            break;
          case 65:
            stage = 'response-raw-client';
            break;
          case 7:
          case 8:
          case 10:
          case 25:
          case 30:
          case 33:
          case 35:
          case 36:
          case 41:
          case 47:
          case 49:
          case 53:
          case 57:
            stage = `response-raw-field-${field}` as GeminiFixedTextTrialReason;
        }
        return false;
      }),
    );
    stage = 'response-raw-string';
    require(isGeminiTrialLanguage(frame.get(20)) && isGeminiTrialAttribution(frame.get(43)));
    stage = 'response-raw-field-6';
    if (frame.has(6)) {
      const location = read.message(frame.get(6), profile === 'native' ? 'W4c' : undefined);
      read.fields(location, [1, 2, 3, 5], profile === 'native' ? 'fields-raw-location' : undefined);
      for (const field of [1, 2]) {
        const value = location.get(field);
        require(value === undefined || (typeof value === 'string' && value.length <= 1048576));
      }
      require(wireFalse(location.get(3)) || wireTrue(location.get(3)));
      require(location.get(5) === undefined || location.get(5) === '');
    }
    let routing: GeminiTrialRawObservation['routing'];
    if (frame.has(21)) {
      stage = 'response-raw-routing';
      const control = read.message(frame.get(21), 'DAd');
      read.fields(control, [1], profile === 'native' ? 'fields-raw-routing' : undefined);
      const epa = control.get(1);
      require(typeof epa === 'string' && !!epa && epa.length <= 1048576);
      require(wireFalse(frame.get(15)) && !frame.has(46) && !frame.has(52));
      read.emptyList(frame.get(5));
      read.emptyList(frame.get(27));
      routing = { epa };
    }
    stage = 'response-flags';
    require(wireFalse(frame.get(15)) || wireTrue(frame.get(15)));
    const final = wireTrue(frame.get(15));
    for (const field of [16, 32, 34, 50]) require(wireFalse(frame.get(field)));
    for (const field of [24, 44, 58])
      require(wireFalse(frame.get(field)) || wireTrue(frame.get(field)));
    stage = 'response-lists';
    for (const field of [12, 13, 56]) read.emptyList(frame.get(field));
    stage = 'response-flags';
    require(
      frame.get(63) === undefined ||
        frame.get(63) === 0 ||
        (captureRecoveryControl &&
          profile === 'native' &&
          [2, 3, 4].includes(frame.get(63) as number)),
    );
    stage = 'response-raw-continuation';
    if (frame.has(46)) read.opaque(frame.get(46), 'vL');
    stage = 'response-raw-disconnect';
    if (frame.has(52))
      read.opaque(profile === 'native' ? read.privateBacking(frame.get(52), 'QGd') : frame.get(52));

    stage = 'response-raw-client';
    read.emptyMessage(
      frame.get(65),
      undefined,
      [1],
      profile === 'native' ? 'fields-raw-client' : undefined,
    );

    stage = 'response-metadata';
    const supplement = frame.get(18);
    require(
      supplement === undefined || (typeof supplement === 'string' && supplement.length <= 1048576),
    );
    const metadata: Omit<
      CompletedGeminiTrial,
      'conversationId' | 'turnId' | 'candidateId' | 'answer'
    > = {};
    if (frame.has(58)) metadata.Zzb = wireTrue(frame.get(58));
    for (const [field, key] of [
      [9, 'regionCode'],
      [40, 'Eka'],
      [61, 'Cq'],
      [62, 'Hj'],
    ] as const) {
      const value = frame.get(field);
      require(
        value === undefined ||
          (typeof value === 'string' && value.length <= (field === 9 ? 32 : 160)),
      );
      if (value !== undefined) {
        if (field === 61 || field === 62) require(value === '' || id(value));
        metadata[key] = value as string;
      }
    }
    // Uxd is private. Only an unopened, closed wire representation is supported.
    const fallback = frame.has(55)
      ? read.message(
          profile === 'native' ? read.privateBacking(frame.get(55), 'QGd') : frame.get(55),
        )
      : new Map<number, unknown>();
    read.fields(fallback, [2, 6], profile === 'native' ? 'fields-raw-fallback' : undefined);
    for (const [field, fallbackField, key, mapping] of [
      [59, 2, 'tZa', categories],
      [60, 6, 'thinkingLevel', thinking],
    ] as const) {
      const primary = frame.get(field),
        secondary = fallback.get(fallbackField);
      for (const value of [primary, secondary])
        require(
          value === undefined ||
            (typeof value === 'number' &&
              Number.isInteger(value) &&
              value >= 0 &&
              value < mapping.length),
        );
      const value = primary || secondary;
      if (value !== undefined && value !== 0) metadata[key] = mapping[value as number]!;
    }

    stage = 'response-identity';
    const observed: GeminiTrialRawObservation = {};
    if (frame.has(2)) {
      const identity = read.message(frame.get(2), 'CI');
      read.fields(identity, [1, 2], profile === 'native' ? 'fields-raw-identity' : undefined);
      for (const [field, key] of [
        [1, 'conversationId'],
        [2, 'turnId'],
      ] as const) {
        const value = identity.get(field);
        require(value === undefined || id(value) || (profile === 'native' && value === ''));
        if (value !== undefined && value !== '') observed[key] = value as string;
      }
    }
    let candidateStatus: unknown;
    let text = '';
    stage = 'response-candidate-lists';
    if (frame.has(5)) {
      const candidates = read.array(frame.get(5), true);
      require(candidates.length <= 1);
      if (candidates.length) {
        stage = 'response-answer';
        const candidate = read.message(own(candidates, '0'), profile === 'native' ? 'FF' : 'AF');
        read.fields(
          candidate,
          [1, 2, 9, 13],
          profile === 'native' ? 'fields-raw-candidate' : undefined,
        );
        require(id(candidate.get(1)));
        observed.candidateId = candidate.get(1) as string;
        stage = 'response-candidate-extra';
        read.emptyMessage(
          candidate.get(13),
          '$v',
          [],
          profile === 'native' ? 'fields-raw-candidate-extra' : undefined,
        );
        stage = 'response-final-metadata';
        if (candidate.has(9)) {
          // SZc is private; omission/default status is never a final witness.
          const status = read.message(
            profile === 'native' ? read.privateBacking(candidate.get(9), 'm1c') : candidate.get(9),
          );
          read.fields(status, [1], profile === 'native' ? 'fields-raw-status' : undefined);
          candidateStatus = status.get(1);
          require(
            candidateStatus === undefined ||
              candidateStatus === 0 ||
              candidateStatus === 1 ||
              candidateStatus === 2,
          );
        }
        stage = 'response-content';
        if (candidate.has(2)) {
          const content = read.message(candidate.get(2), '$Zc');
          read.fields(content, [1], profile === 'native' ? 'fields-raw-text' : undefined);
          const value = content.get(1);
          require(
            value === undefined ||
              (typeof value === 'string' &&
                value.length <= GEMINI_FIXED_TEXT_TRIAL_ANSWER.length &&
                GEMINI_FIXED_TEXT_TRIAL_ANSWER.startsWith(value)),
          );
          text = (value ?? '') as string;
        }
      }
    }
    stage = 'response-content';
    if (frame.has(27)) {
      const structured = read.array(frame.get(27), true);
      require(structured.length <= 1);
      if (structured.length) {
        require(observed.candidateId);
        const content = read.message(own(structured, '0'), 'qH');
        read.fields(content, [1], profile === 'native' ? 'fields-raw-structured' : undefined);
        if (!text) read.emptyList(content.get(1));
        else {
          const node = read.message(read.one(content.get(1)), 'oH');
          read.fields(node, [2], profile === 'native' ? 'fields-raw-node' : undefined);
          const plain = read.message(node.get(2), 'gH');
          read.fields(plain, [2, 3], profile === 'native' ? 'fields-raw-plain' : undefined);
          require(plain.get(2) === undefined || plain.get(2) === 0);
          require(plain.get(3) === text);
        }
      }
    }
    if (routing) {
      stage = 'response-raw-routing';
      require(profile === 'native' || (observed.conversationId && observed.turnId));
      observed.routing = { ...routing, ...(supplement ? { Kzd: supplement as string } : {}) };
    }
    stage = 'response-completion';
    if (final) {
      require(
        (profile === 'native' || (observed.conversationId && observed.turnId)) &&
          observed.candidateId &&
          candidateStatus === 2 &&
          text === GEMINI_FIXED_TEXT_TRIAL_ANSWER,
      );
      if (observed.conversationId && observed.turnId)
        observed.completed = {
          conversationId: observed.conversationId,
          turnId: observed.turnId,
          candidateId: observed.candidateId,
          answer: GEMINI_FIXED_TEXT_TRIAL_ANSWER,
          ...metadata,
        };
    }
    return observed;
  } catch (error) {
    return transferOutboundFailure(
      error,
      new Error('Gemini trial contract failed.', { cause: stage }),
      profile === 'native' ? (stage as ReceivePredicate) : undefined,
    );
  }
}

export function assertGeminiTrialPacket(
  namespace: unknown,
  packet: unknown,
  approved: ApprovedGeminiTrial,
): unknown {
  try {
    const read = wireReader(namespace);
    const a = approval(approved);
    const p = object(packet);
    keys(p, ['request', 't8a', 'u8a']);
    require(typeof p.t8a === 'string' && !!p.t8a && p.t8a.length <= 1048576);
    require(typeof p.u8a === 'string' && /^[a-f0-9]{32}$/.test(p.u8a));
    const r = object(p.request);
    const requestPrototype = Object.getPrototypeOf(p.request);
    require(!requestPrototype || !Object.getOwnPropertyDescriptor(requestPrototype, 'dLa'));
    keys(r, [
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
      'rka',
      'WFa',
      'wxa',
      'jt',
      'Cc',
      'isPersonalContextDisabled',
      'm0b',
      'b_',
      'Uo',
      'thinkingLevel',
      'Lj',
      'x5d',
    ]);
    require(r.Ae === a.storeId && r.clientTurnId === a.clientTurnId && r.ri === a.modeId);
    require(r.textQuery === GEMINI_FIXED_TEXT_TRIAL_PROMPT);
    for (const key of ['conversationId', 'ej', 'oy', 'xS']) require(r[key] === '');
    for (const key of ['yg', 'Fo', 'ff']) require(r[key] === 0);
    require(r.Pg === false && r.oh === false);
    for (const key of ['rka', 'WFa', 'wxa', 'jt']) require(r[key] === undefined);
    require(
      r.b_ === a.modeCategory &&
        r.Uo === a.Cq &&
        r.thinkingLevel === a.thinkingLevel &&
        r.Lj === a.Hj,
    );
    require(r.isPersonalContextDisabled === a.isPersonalContextDisabled);
    require(r.m0b === undefined || r.m0b === true);
    const context = object(r.Cc);
    keys(context, ['isPersonalContextDisabled']);
    if (Object.hasOwn(context, 'isPersonalContextDisabled')) {
      require(
        typeof context.isPersonalContextDisabled === 'boolean' &&
          context.isPersonalContextDisabled === a.isPersonalContextDisabled,
      );
    }
    if (r.x5d !== undefined) {
      require(Object.getPrototypeOf(r.x5d) === read.prototype('Ixd'));
      const privacy = read.message(r.x5d, 'Ixd');
      read.fields(privacy, [1]);
      require(privacy.get(1) === 1 || privacy.get(1) === 2);
    }
    return packet;
  } catch {
    throw new Error('Gemini trial contract failed.', { cause: 'packet' });
  }
}

export function assertGeminiTrialHistory(
  namespace: unknown,
  raw: unknown,
  approved: ApprovedGeminiTrial,
  completed: GeminiTrialCompletion,
): typeof GEMINI_FIXED_TEXT_TRIAL_ANSWER {
  try {
    const read = wireReader(namespace);
    const a = approval(approved);
    const c = object(completed);
    const marker = c.kind === 'marker';
    keys(
      c,
      marker
        ? ['kind', 'conversationId', 'turnId', 'observedCandidateId']
        : [
            'conversationId',
            'turnId',
            'candidateId',
            'answer',
            'Zzb',
            'Eka',
            'tZa',
            'thinkingLevel',
            'Cq',
            'Hj',
            'regionCode',
          ],
    );
    require(id(c.conversationId) && id(c.turnId));
    if (marker) {
      if (Object.hasOwn(c, 'observedCandidateId')) require(id(c.observedCandidateId));
    } else {
      require(id(c.candidateId) && c.answer === GEMINI_FIXED_TEXT_TRIAL_ANSWER);
      require(c.Zzb === undefined || typeof c.Zzb === 'boolean');
      for (const key of ['Eka', 'Cq', 'Hj'])
        require(
          c[key] === undefined ||
            (typeof c[key] === 'string' && (key === 'Eka' ? c[key].length <= 160 : id(c[key]))),
        );
      require(
        c.regionCode === undefined ||
          (typeof c.regionCode === 'string' && c.regionCode.length <= 32),
      );
      require(c.tZa === undefined || categories.some((entry) => entry === c.tZa));
      require(c.thinkingLevel === undefined || thinking.some((entry) => entry === c.thinkingLevel));
    }
    require(
      raw !== null &&
        typeof raw === 'object' &&
        Object.getPrototypeOf(raw) === read.prototype('history'),
    );
    const root = read.message(raw, 'history');
    read.fields(root, [1, 2, 4, 5, 6]);
    require(root.get(2) === undefined || root.get(2) === '');
    require(root.get(6) === undefined || root.get(6) === 0);
    read.emptyMessage(root.get(4), undefined, [1, 3, 4]);
    if (root.has(5)) {
      const status = read.message(root.get(5));
      read.fields(status, [1]);
      require(status.get(1) === undefined || status.get(1) === 0);
    }
    const turn = read.message(read.one(root.get(1)), 'N5c');
    read.fields(turn, [1, 2, 3, 4, 5, 6, 7, 13]);
    for (const field of [6, 7, 13]) require(wireFalse(turn.get(field)));
    if (turn.has(5)) {
      const timestamp = read.message(turn.get(5), 'ul');
      read.fields(timestamp, [1, 2]);
      const seconds = timestamp.get(1);
      require(
        seconds === undefined ||
          (typeof seconds === 'number' && Number.isSafeInteger(seconds)) ||
          (typeof seconds === 'string' &&
            /^-?(0|[1-9]\d*)$/.test(seconds) &&
            Number.isSafeInteger(Number(seconds))),
      );
      const nanos = timestamp.get(2);
      require(
        nanos === undefined ||
          (typeof nanos === 'number' &&
            Number.isInteger(nanos) &&
            nanos >= 0 &&
            nanos <= 999999999),
      );
    }
    const identity = read.message(turn.get(1), 'CI');
    read.fields(identity, [1, 2]);
    require(identity.get(1) === c.conversationId && identity.get(2) === c.turnId);
    if (turn.has(2)) {
      const parents = read.message(turn.get(2), 'DI');
      read.fields(parents, [1, 2, 3, 10]);
      for (const entry of parents.values()) require(entry === '');
    }
    const request = read.message(turn.get(3), 'G5c');
    read.fields(request, [1, 2, 5, 6, 7, 9, 11, 12]);
    require(request.get(5) === a.modeId);
    for (const field of [2, 6, 7])
      require(request.get(field) === undefined || request.get(field) === 0);
    require(wireFalse(request.get(12)));
    require(
      a.isPersonalContextDisabled === true ? wireTrue(request.get(9)) : wireFalse(request.get(9)),
    );
    read.emptyMessage(request.get(11), 'nI');
    const query = read.message(request.get(1), 'AI');
    read.fields(query, [1, 5]);
    require(query.get(1) === GEMINI_FIXED_TEXT_TRIAL_PROMPT);
    read.emptyList(query.get(5));
    const response = read.message(turn.get(4), 'H5c');
    read.fields(
      response,
      [1, 3, 4, 5, 6, 9, 10, 11, 12, 13, 15, 16, 19, 24, 25, 26, 28, 29, 30, 31],
    );
    const selected = response.get(4);
    require(id(selected) && wireTrue(response.get(10)));
    require(
      marker
        ? !Object.hasOwn(c, 'observedCandidateId') || selected === c.observedCandidateId
        : selected === c.candidateId,
    );
    for (const field of [11, 16, 24]) require(wireFalse(response.get(field)));
    require(
      marker
        ? wireFalse(response.get(29)) || wireTrue(response.get(29))
        : c.Zzb === true
          ? response.has(29) && wireTrue(response.get(29))
          : wireFalse(response.get(29)),
    );
    for (const field of [3, 5, 6, 12, 19, 28]) read.emptyList(response.get(field));
    for (const [field, key] of [
      [15, 'Eka'],
      [30, 'Cq'],
      [31, 'Hj'],
      [9, 'regionCode'],
    ] as const) {
      const entry = response.get(field);
      require(
        entry === undefined ||
          (typeof entry === 'string' && entry.length <= (field === 9 ? 32 : 160)),
      );
      if (!marker) require((entry || undefined) === (c[key] || undefined));
    }
    for (const [field, key, mapping] of [
      [25, 'tZa', categories],
      [26, 'thinkingLevel', thinking],
    ] as const) {
      const entry = response.get(field);
      if (entry !== undefined) {
        require(
          typeof entry === 'number' &&
            Number.isInteger(entry) &&
            entry >= 0 &&
            entry < mapping.length,
        );
        if (!marker) require(mapping[entry] === c[key]);
      } else if (!marker) require(c[key] === undefined || c[key] === mapping[0]);
    }
    const candidate = read.message(read.one(response.get(1)), 'AF');
    read.fields(candidate, [1, 2, 9, 13]);
    require(candidate.get(1) === selected);
    read.emptyMessage(candidate.get(13), '$v');
    const status = read.message(candidate.get(9));
    read.fields(status, [1]);
    require(status.get(1) === 2);
    const text = read.message(candidate.get(2), '$Zc');
    read.fields(text, [1]);
    require(text.get(1) === GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    const structuredContent = response.get(13);
    if (Array.isArray(structuredContent) && own(structuredContent, 'length') === 0) {
      read.emptyList(structuredContent);
    } else if (response.has(13)) {
      const structured = read.message(read.one(structuredContent), 'qH');
      read.fields(structured, [1]);
      const node = read.message(read.one(structured.get(1)), 'oH');
      read.fields(node, [2]);
      const plain = read.message(node.get(2), 'gH');
      read.fields(plain, [2, 3]);
      require(plain.get(2) === undefined || plain.get(2) === 0);
      require(plain.get(3) === GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    }
    return GEMINI_FIXED_TEXT_TRIAL_ANSWER;
  } catch {
    throw new Error('Gemini trial contract failed.', { cause: 'history' });
  }
}

export type GeminiNativeIdField =
  | Readonly<{ presence: 'absent' }>
  | Readonly<{ presence: 'empty'; value: '' }>
  | Readonly<{ presence: 'value'; value: string }>;
export type GeminiNativeIdentity = Readonly<{
  conversationId?: string;
  turnId: string;
  cidOrigin: 'absent' | 'server';
  ridOrigin: 'request' | 'server';
}>;
export type GeminiNativeEnvelope =
  | Readonly<{
      kind: 'response';
      envelope: object;
      raw: object;
      cid: GeminiNativeIdField;
      rid: GeminiNativeIdField;
    }>
  | Readonly<{ kind: 'close'; envelope: object; field: 4 | 5 }>
  | Readonly<{ kind: 'ignored'; envelope: object; verify: () => void }>;
export type GeminiNativeFrameReceipt = Readonly<{
  original: object;
  normalized: object;
  cid: GeminiNativeIdField;
  rid: GeminiNativeIdField;
  identity: GeminiNativeIdentity;
  cidEvidence: 'this-server-frame' | 'earlier-server-frame' | 'absent';
  ridEvidence: 'this-server-frame' | 'earlier-server-frame' | 'request-seed';
  observation: Readonly<GeminiTrialRawObservation>;
}>;

function nativeContract<T>(cause: GeminiFixedTextTrialReason, run: () => T): T {
  try {
    return run();
  } catch (error) {
    let failure = cause;
    try {
      const candidate = own(error, 'cause');
      if (GeminiFixedTextTrialReason.options.includes(candidate as GeminiFixedTextTrialReason))
        failure = candidate as GeminiFixedTextTrialReason;
    } catch {
      /* Provider errors never escape as diagnostic contents. */
    }
    return transferOutboundFailure(
      error,
      new Error('Gemini trial contract failed.', { cause: failure }),
    );
  }
}
export function assertGeminiNativeLifecycleProfile(namespace: unknown, value: unknown): void {
  nativeContract('response-raw-fields', () => {
    const read = wireReader(namespace, true, false, true),
      frame = read.message(value, 'IF');
    require(!frame.has(65), 'lifecycle-feature');
    if (frame.has(5)) {
      const candidates = read.array(frame.get(5), true);
      require(candidates.length <= 1, 'lifecycle-feature');
      if (candidates.length)
        read.emptyMessage(read.message(own(candidates, '0'), 'FF').get(13), '$v');
    }
  });
}

function sourceIs(value: unknown, expected: string, diagnostics = false) {
  require(typeof value === 'function' &&
    Reflect.apply(Function.prototype.toString, value, []) === expected, diagnostics
    ? 'dispatch-native-n15-source-01'
    : undefined);
}
function nativePrivateBacking(
  namespace: unknown,
  value: unknown,
  kind: 'tHd' | 'QGd' | 'm1c',
  diagnostics = false,
) {
  if (Array.isArray(value)) return value;
  const p = Object.getPrototypeOf(value);
  const constructor = own(p, 'constructor', diagnostics);
  sourceIs(
    constructor,
    kind === 'tHd'
      ? 'class extends _.l{constructor(a){super(a)}getResponse(){return _.m(this,_.M5c,2)}}'
      : kind === 'm1c'
        ? 'class extends _.l{constructor(a){super(a)}getState(){return _.ti(this,1)}setState(a){return _.Ni(this,1,a)}}'
        : 'class extends _.l{constructor(a){super(a)}}',
    diagnostics,
  );
  require(own(constructor, 'prototype', diagnostics) === p &&
    Object.getPrototypeOf(constructor) === own(namespace, 'l', diagnostics), diagnostics
    ? 'dispatch-native-n15-private-01'
    : undefined);
  require(Reflect.ownKeys(p).length === (kind === 'tHd' ? 2 : kind === 'm1c' ? 3 : 1), diagnostics
    ? 'dispatch-native-n15-private-02'
    : undefined);
  if (kind === 'm1c') {
    for (const key of ['constructor', 'getState', 'setState']) {
      const descriptor = Object.getOwnPropertyDescriptor(p, key);
      require(descriptor &&
        'value' in descriptor &&
        descriptor.writable &&
        descriptor.configurable &&
        !descriptor.enumerable, diagnostics ? 'dispatch-native-n15-private-02' : undefined);
    }
    for (const [key, text] of [
      ['getState', 'getState(){return _.ti(this,1)}'],
      ['setState', 'setState(a){return _.Ni(this,1,a)}'],
    ] as const)
      sourceIs(own(p, key, diagnostics), text, diagnostics);
  }
  if (kind === 'tHd')
    sourceIs(
      own(p, 'getResponse', diagnostics),
      'getResponse(){return _.m(this,_.M5c,2)}',
      diagnostics,
    );
  return wireReader(namespace, diagnostics).backing(value);
}
function nativeIds(
  read: ReturnType<typeof wireReader>,
  frame: Map<number, unknown>,
  predicate?: ReceivePredicate,
) {
  const fields = frame.has(2) ? read.message(frame.get(2), 'CI') : new Map<number, unknown>();
  read.fields(fields, [1, 2], predicate);
  const field = (key: number): GeminiNativeIdField => {
    if (!fields.has(key)) return Object.freeze({ presence: 'absent' });
    const value = fields.get(key);
    require(value === '' || id(value));
    return value === ''
      ? Object.freeze({ presence: 'empty', value })
      : Object.freeze({ presence: 'value', value: value as string });
  };
  const cid = field(1),
    rid = field(2);
  require(cid.presence !== 'value' || /^c_[0-9a-fA-F]{1,16}$/.test(cid.value));
  return { cid, rid };
}
function nativeOneof(
  namespace: unknown,
  read: ReturnType<typeof wireReader>,
  key: string,
  expected: number[],
) {
  const value = read.array(own(namespace, key, read.diagnostics), true);
  require(value.length === expected.length &&
    expected.every(
      (item, index) => own(value, String(index), read.diagnostics) === item,
    ), read.diagnostics ? 'dispatch-native-n15-oneof-01' : undefined);
}
function nativeWrapper(
  read: ReturnType<typeof wireReader>,
  value: unknown,
  name: string | undefined,
  field: number,
  predicate?: ReceivePredicate,
  ignored?: { fields: readonly number[]; predicate: ReceivePredicate },
  ancillary: readonly number[] = [],
) {
  const data = read.message(value, name);
  read.fields(data, [field, ...ancillary], predicate, ignored);
  require(data.has(field), read.diagnostics ? 'dispatch-native-n15-wrapper-01' : undefined);
  return data.get(field);
}
function nativeResponsePath(
  namespace: unknown,
  read: ReturnType<typeof wireReader>,
  root: Map<number, unknown>,
  envelope: unknown,
) {
  const flag = own(namespace, 'La') as PropertyKey;
  const effective = (value: unknown, parent: number) =>
    Array.isArray(value)
      ? Number(own(value, flag) ?? 0) | (parent & (32 | 2)) | 64
      : Number(own(own(value, 'fl'), flag));
  let flags = Number(own(own(envelope, 'fl'), flag));
  let child = root.get(2);
  flags = effective(child, flags);
  child = nativeWrapper(
    read,
    child,
    'XJd',
    7,
    'fields-hjd-other',
    {
      fields: [2, 3, 5, 6, 8, 9],
      predicate: 'fields-hjd-ignored-branch',
    },
    [1, 4],
  );
  flags = effective(child, flags);
  child = nativeWrapper(read, child, 'RJd', 1, 'fields-bjd-other', {
    fields: [2],
    predicate: 'fields-bjd-ignored-branch',
  });
  flags = effective(child, flags);
  child = nativeWrapper(
    read,
    child,
    'QJd',
    4,
    'fields-ajd-other',
    {
      fields: [3],
      predicate: 'fields-ajd-ignored-branch',
    },
    [1, 2],
  );
  flags = effective(child, flags);
  const holder = child,
    holderFrozen =
      !!(flags & 2) && (Array.isArray(holder) || own(holder, 'Fb') !== own(namespace, 'Kaa'));
  const raw = nativeWrapper(
    read,
    nativePrivateBacking(namespace, holder, 'tHd', read.diagnostics),
    undefined,
    4,
    'fields-native-holder',
    undefined,
    [1, 2, 3],
  );
  return { raw, holderFrozen, rawFlags: effective(raw, flags) };
}
function ignoredEnvelopeWitness(namespace: unknown, value: object): () => void {
  const read = wireReader(namespace, true, false, true);
  const backing = read.backing(value);
  const cacheKey = own(namespace, 'dga') as symbol;
  const prototype = Object.getPrototypeOf(value);
  const last = backing.length ? own(backing, String(backing.length - 1)) : undefined;
  // A packed tail owns selector slots; the selected payload itself stays opaque.
  const tail =
    last !== null && typeof last === 'object' && Object.getPrototypeOf(last) === Object.prototype
      ? last
      : undefined;
  const owners = [value, backing, ...(tail ? [tail] : [])].map((owner) => ({
    owner,
    prototype: Object.getPrototypeOf(owner),
    descriptors: Object.getOwnPropertyDescriptors(owner),
  }));
  let cache = Object.getOwnPropertyDescriptor(backing, cacheKey);
  const sameDescriptor = (a: PropertyDescriptor, b: PropertyDescriptor | undefined) =>
    b !== undefined &&
    Object.is(a.value, b.value) &&
    a.get === b.get &&
    a.set === b.set &&
    a.writable === b.writable &&
    a.enumerable === b.enumerable &&
    a.configurable === b.configurable;
  return () => {
    require(Object.getPrototypeOf(value) === prototype &&
      wireReader(namespace, true).backing(value) === backing, 'receipt-backing');
    for (const entry of owners) {
      require(Object.getPrototypeOf(entry.owner) === entry.prototype, 'receipt-backing');
      const current = Object.getOwnPropertyDescriptors(entry.owner);
      const keys = Reflect.ownKeys(current).filter(
        (key) => entry.owner !== backing || key !== cacheKey,
      );
      const previous = Reflect.ownKeys(entry.descriptors).filter(
        (key) => entry.owner !== backing || key !== cacheKey,
      );
      require(keys.length === previous.length &&
        previous.every((key) =>
          sameDescriptor(
            own(entry.descriptors, key) as PropertyDescriptor,
            own(current, key) as PropertyDescriptor | undefined,
          ),
        ), 'receipt-content');
    }
    const currentCache = Object.getOwnPropertyDescriptor(backing, cacheKey);
    if (!cache && currentCache) {
      // Only original Noa's data-property addition is expected; message() validates its Map slots.
      require('value' in currentCache &&
        currentCache.writable &&
        currentCache.enumerable &&
        currentCache.configurable, 'receipt-content');
      cache = currentCache;
    }
    require(cache === undefined
      ? currentCache === undefined
      : sameDescriptor(cache, currentCache), 'receipt-content');
  };
}
export function readGeminiNativeEnvelope(namespace: unknown, value: unknown): GeminiNativeEnvelope {
  return nativeEnvelope(namespace, value, true);
}
function nativeEnvelope(
  namespace: unknown,
  value: unknown,
  validateContent: boolean,
  captureRecoveryControl = false,
): GeminiNativeEnvelope {
  return nativeContract('response-shape', () => {
    const read = wireReader(namespace, true, false, true);
    for (const [key, fields] of [
      ['$L', [1, 2, 3, 4, 5, 6]],
      ['ZL', [2, 3, 5, 6, 7, 8, 9]],
      ['SJd', [1, 2]],
      ['YL', [3, 4]],
    ] as const)
      nativeOneof(namespace, read, key, [...fields]);
    require(value !== null &&
      typeof value === 'object' &&
      Object.getPrototypeOf(value) === read.prototype('Kzd'), 'envelope-shape');
    const root = read.message(value, 'Kzd');
    read.fields(root, [1, 2, 3, 4, 5, 6], 'fields-envelope-other');
    require(root.size === 1, 'envelope-shape');
    if ([1, 3, 6].some((field) => root.has(field)))
      return Object.freeze({
        kind: 'ignored',
        envelope: value,
        verify: ignoredEnvelopeWitness(namespace, value),
      });
    for (const field of [4, 5] as const)
      if (root.has(field)) {
        const payload = read.message(root.get(field));
        require(payload.size === 0 && read.array(root.get(field)).length === 0, 'envelope-shape');
        return Object.freeze({ kind: 'close', envelope: value, field });
      }
    require(root.has(2), 'envelope-shape');
    const { raw } = nativeResponsePath(namespace, read, root, value);
    require(raw !== null && typeof raw === 'object', 'envelope-shape');
    const frame = read.message(raw, 'IF');
    const ids = nativeIds(read, frame, 'fields-raw-identity');
    // Parse content independently from provenance; native absence never weakens RPC.
    if (validateContent)
      readGeminiRawContent(
        wireReader(namespace, true, false, true),
        wireReader(namespace, true, false, true).message(raw, 'IF'),
        'native',
        captureRecoveryControl,
      );
    wireReader(namespace, true, false, true).snapshot(value, undefined, false, false, 0, false, []);
    return Object.freeze({ kind: 'response', envelope: value, raw, ...ids });
  });
}
function sameSnapshot(
  a: ReturnType<ReturnType<typeof wireReader>['snapshot']>,
  b: typeof a,
): boolean {
  if (Object.is(a, b)) return true;
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((value, index) => sameSnapshot(value, b[index]))
  );
}
export function captureGeminiNativeWireContent(
  namespace: unknown,
  value: unknown,
  name: 'wL' | 'JJd' | 'CI',
  diagnostics = false,
): (candidate: unknown) => void {
  const identities = nativeContract('packet', () =>
    name === 'JJd'
      ? ['La', 'dga', 'XL', 'HJd', 'VL'].map((key) => ({
          key,
          descriptor: Object.getOwnPropertyDescriptor(namespace, key),
        }))
      : [],
  );
  function snapshot(candidate: unknown) {
    for (const { key, descriptor } of identities) {
      const current = Object.getOwnPropertyDescriptor(namespace, key);
      require(descriptor &&
        current &&
        'value' in descriptor &&
        'value' in current &&
        descriptor.value === current.value &&
        descriptor.writable === current.writable &&
        descriptor.configurable === current.configurable &&
        descriptor.enumerable === current.enumerable, 'envelope-shape');
    }
    try {
      const read = wireReader(namespace, diagnostics, name === 'JJd');
      require(name === 'wL' || name === 'JJd' || name === 'CI', diagnostics
        ? 'dispatch-native-n15-content-01'
        : undefined);
      require(candidate !== null &&
        typeof candidate === 'object' &&
        !Array.isArray(candidate) &&
        Object.getPrototypeOf(candidate) === read.prototype(name), diagnostics
        ? 'dispatch-native-n15-content-02'
        : undefined);
      read.message(candidate, name);
      return wireReader(namespace, diagnostics, name === 'JJd').snapshot(
        candidate,
        name,
        false,
        false,
        0,
        true,
        name === 'JJd' ? [] : undefined,
      );
    } catch (error) {
      return transferOutboundFailure(error, new Error());
    }
  }
  const content = nativeContract('packet', () => snapshot(value));
  let invalidated = false;
  return (candidate) =>
    nativeContract('packet', () => {
      require(!invalidated, diagnostics ? 'dispatch-native-n15-content-03' : undefined);
      try {
        require(sameSnapshot(content, snapshot(candidate)), diagnostics
          ? 'dispatch-native-n15-content-equality'
          : undefined);
      } catch (error) {
        invalidated = true;
        return transferOutboundFailure(error, new Error());
      }
    });
}
function nativeIdentity(
  prior: GeminiNativeIdentity,
  cid: GeminiNativeIdField,
  rid: GeminiNativeIdField,
  terminal: boolean,
): GeminiNativeIdentity {
  const c = cid.presence === 'value' ? cid.value : undefined;
  const r = rid.presence === 'value' ? rid.value : undefined;
  if (c && prior.conversationId && c !== prior.conversationId) require(false, 'envelope-shape');
  if (r && prior.ridOrigin === 'server' && r !== prior.turnId) require(false, 'envelope-shape');
  if (r && terminal && r !== prior.turnId) require(false, 'envelope-shape');
  return Object.freeze({
    conversationId: c ?? prior.conversationId,
    turnId: r ?? prior.turnId,
    cidOrigin: c || prior.cidOrigin === 'server' ? 'server' : 'absent',
    ridOrigin: r || prior.ridOrigin === 'server' ? 'server' : 'request',
  });
}
const nativeNormalizationSources = {
  m: 'function(a,b,c,d){var e=a.fl,f=e[_.La]|0;b=Qoa(e,f,b,c,d);if(b==null)return b;f=e[_.La]|0;if(!_.Ra(a,f)){let g=_.Lg(b);g!==b&&(_.ub(a)&&(e=a.fl,f=e[_.La]|0),b=g,f=_.xb(e,f,c,b,d),_.Mg(e,f))}return b}',
  Ph: 'function(a,b,c,d){a=a.fl;return Qoa(a,a[_.La]|0,b,c,d)||b[_.Xd]||(b[_.Xd]=_.iba(b))}',
  Lg: 'function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?_.Rba(a,b,c)?_.Qba(a,b,!0):new a.constructor(_.tb(b,c,!1)):a}',
  Af: 'function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?a:_.Rba(a,b,c)?_.Qba(a,b):new a.constructor(_.tb(b,c,!0))}',
  Gh: 'function(a,b,c,d,e){d=Qpa(d);_.Vh(a,c,d,e);d&&!_.Ra(d)&&_.Mg(a.fl);return a}',
  ub: 'function(a){if(a.Fb!==_.Kaa)return!1;var b=a.fl;b=_.tb(b,b[_.La]|0);_.Ma(b,2048);a.fl=b;_.Laa(a,!1);a.tcc=void 0;return!0}',
  Ra: 'function(a,b){return b===void 0?a.Fb!==_.Kaa&&!!(2&(a.fl[_.La]|0)):!!(2&b)&&a.Fb!==_.Kaa}',
} as const;
const nativeMaterializationSources = {
  Qh: 'function(a,b,c,d){var e=a.fl;return _.Roa(a,e,e[_.La]|0,b,c,1,d)}',
  GF: 'function(a){return _.ci(a,_.FF,5)}',
  xi: 'function(a,b,c,d){return _.m(a,b,_.Yh(a,d,c),void 0)}',
  Xh: 'function(a,b,c){a=a.fl;return Ooa(Noa(a),a,void 0,b,c)}',
  Yh: 'function(a,b,c,d){return _.Xh(a,b,d)===c?c:-1}',
  nb: 'function(a){return a}',
  tba: 'function(a){var b=_.nb(_.ob);return b?a[b]:void 0}',
  Roa: 'function(a,b,c,d,e,f,g,k,r){f=f&&f!==4?f!==1&&_.Ra(a,c)?1:f:4;k=!!k||f===3;var u=!!r&&!_.Ra(a,c);(f===2||u)&&_.ub(a)&&(b=a.fl,c=b[_.La]|0);a=Loa(b,e,g);var w=a===_.Yd?7:a[_.La]|0,B=Moa(w,c);if(r=!(4&B)){var C=a,G=c;let N=!!(2&B);N&&(G|=2);let T=!N,aa=!0,da=0,ta=0;for(;da<C.length;da++){let ya=_.Hoa(C[da],d,!1,G);if(ya instanceof d){if(!N){let Ca=_.Ra(ya);T&&(T=!Ca);aa&&(aa=Ca)}C[ta++]=ya}}ta<da&&(C.length=ta);B|=4;B=aa?B&-4097:B|4096;B=T?B|8:B&-9}B!==w&&(a[_.La]=B,2&B&&Object.freeze(a));if(u&&\n!(8&B||!a.length&&(f===1||(f!==4?0:2&B||!(16&B)&&32&c)))){Joa(B)&&(a=[...a],B=Ng(B,c),c=_.xb(b,c,e,a,g));d=a;u=B;for(w=0;w<d.length;w++)C=d[w],B=_.Lg(C),C!==B&&(d[w]=B);u|=8;B=u=d.length?u|4096:u&-4097;a[_.La]=B}return a=Koa(a,B,b,c,e,g,f,r,k)}',
  ci: 'function(a,b,c,d,e){var f=a.fl;return _.Roa(a,f,f[_.La]|0,b,c,d,e,!1,!0)}',
  tb: 'function(a,b,c,d){d!=null||(d=!!(34&b));a=_.pb(a,b,_.Pba,d);d=32;c&&(d|=2);b=b&16769217|d;a[_.La]=b;return a}',
  pb: 'function(a,b,c,d){var e=d!==void 0;d=!!d;var f=_.nb(_.ob),g;!e&&f&&(g=a[f])&&g.ayb(Aba);f=[];var k=a.length;g=4294967295;var r=!1,u=!!(b&64),w=u?b&128?0:-1:void 0;if(!(b&1)){var B=k&&a[k-1];B!=null&&typeof B==="object"&&B.constructor===Object?(k--,g=k):B=void 0;if(u&&!(b&128)&&!e){r=!0;var C;g=((C=_.Bba)!=null?C:_.Naa)(g-w,w,a,B,void 0)+w}}b=void 0;for(C=0;C<k;C++){let N=a[C];if(N!=null&&(N=c(N,d))!=null)if(u&&C>=g){let T=C-w;var G=void 0;((G=b)!=null?G:b={})[T]=N}else f[C]=N}if(B)for(let N in B){G=\nB[N];if(G==null||(G=c(G,d))==null)continue;k=+N;let T;if(u&&!Number.isNaN(k)&&(T=k+w)<g)f[T]=G;else{let aa;((aa=b)!=null?aa:b={})[N]=G}}b&&(r?f.push(b):f[g]=b);e&&_.nb(_.ob)&&(a=_.tba(a))&&"function"==typeof _.Cba&&a instanceof _.Cba&&(f[_.ob]=a.ha());return f}',
  Pba: 'function(a,b){if(typeof a!=="object")return a;if(Array.isArray(a)){var c=a[_.La]|0;return a.length===0&&c&1?void 0:Nba(a,c,b)}if(_.Qa(a))return Oba(a);if("function"==typeof _.sb&&a instanceof _.sb){b=a.Ewa;if(b&2)return a;if(!a.size)return;c=_.Na(a.Cmc());if(a.CPa)for(a=0;a<c.length;a++){let d=c[a],e=d[1];e==null||typeof e!=="object"?e=void 0:_.Qa(e)?e=Oba(e):Array.isArray(e)?e=Nba(e,e[_.La]|0,!!(b&32)):e=void 0;d[1]=e}return c}if(a instanceof _.mb)return a}',
  Rba: 'function(a,b,c){return c&2?!0:c&32&&!(c&4096)?(b[_.La]=c|2,_.Laa(a,!0),!0):!1}',
  Qba: 'function(a,b,c){a=new a.constructor(b);c&&_.Laa(a,!0);a.tcc=_.Kaa;return a}',
  Laa: 'function(a,b){a.Fb=b?_.Kaa:void 0}',
  Ma: 'function(a,b){a[_.La]|=b}',
  Qa: 'function(a){return a!=null&&a[_.Oa]===_.Pa}',
  Hoa: 'function(a,b,c,d){if(_.Qa(a))return a;if(!Array.isArray(a))return c?d&2?b[_.Xd]||(b[_.Xd]=_.iba(b)):new b:void 0;c=a[_.La]|0;d=c|d&32|d&2;d!==c&&(a[_.La]=d);return new b(a)}',
  xb: 'function(a,b,c,d,e){var f=c+(e?0:-1),g=a.length-1;if(g>=1+(e?0:-1)&&f>=g){let k=a[g];if(k!=null&&typeof k==="object"&&k.constructor===Object)return k[c]=d,b}if(f<=g)return a[f]=d,b;if(d!==void 0){let k;g=((k=b)!=null?k:b=a[_.La]|0)>>14&1023||536870912;c>=g?d!=null&&(a[g+(e?0:-1)]={[c]:d}):a[f]=d}return b}',
  Mg: 'function(a,b){b===void 0&&(b=a[_.La]|0);b&32&&!(b&4096)&&(a[_.La]=b|4096)}',
  de: 'function(a,b,c,d){if(b===-1)return null;var e=b+(c?0:-1),f=a.length-1;if(!(f<1+(c?0:-1))){if(e>=f){var g=a[f];if(g!=null&&typeof g==="object"&&g.constructor===Object){c=g[b];var k=!0}else if(e===f)c=g;else return}else c=a[e];if(d&&c!=null){d=d(c);if(d==null)return d;if(!Object.is(d,c))return k?g[b]=d:a[e]=d,d}return c}}',
  l: 'class{constructor(a,b,c){this.fl=_.Lba(a,b,c,2048)}toJSON(){return _.Hba(this)}serialize(a){return JSON.stringify(_.Hba(this,a))}clone(){var a=this.fl,b=a[_.La]|0;return _.Rba(this,a,b)?_.Qba(this,a,!0):new this.constructor(_.tb(a,b,!1))}isImmutable(){return _.Ra(this)}}',
  Lba: 'function(a,b,c,d=0){if(a==null){var e=32;c?(a=[c],e|=128):a=[];b&&(e=e&-16760833|(b&1023)<<14)}else{if(!Array.isArray(a))throw Error("F");e=a[_.La]|0;if(Jba&&1&e)throw Error("G");2048&e&&!(2&e)&&Kba();if(e&256)throw Error("H");if(e&64)return(e|d)!==e&&(a[_.La]=e|d),a;if(c&&(e|=128,c!==a[0]))throw Error("I");a:{c=a;e|=64;var f=c.length;if(f){var g=f-1;let r=c[g];if(r!=null&&typeof r==="object"&&r.constructor===Object){b=e&128?0:-1;g-=b;if(g>=1024)throw Error("K");for(var k in r)if(f=+k,f<g)c[f+\nb]=r[k],delete r[k];else break;e=e&-16760833|(g&1023)<<14;break a}}if(b){k=Math.max(b,f-(e&128?0:-1));if(k>1024)throw Error("L");e=e&-16760833|(k&1023)<<14}}}a[_.La]=e|64|d;return a}',
} as const;
const nativeMaterializationConstructors = {
  IF: 'class extends _.l{constructor(a){super(a)}getHeartbeatResponse(){return _.xi(this,Xuc,37,_.HF)}ka(){return _.m(this,_.x_b,8)}}',
  FF: 'class extends _.l{constructor(a){super(a)}}',
  CI: 'class extends _.l{constructor(a){super(a)}ig(){return _.n(this,1)}}',
  $Zc: 'class extends _.l{constructor(a){super(a)}getText(){return _.n(this,1)}setText(a){return _.Li(this,1,a)}Dg(){return _.Si(this,1)}}',
  $v: 'class extends _.l{constructor(a){super(a)}getOptions(){return _.m(this,SLb,7)}setOptions(a){return _.Gh(this,SLb,7,a)}}',
  W4c: 'class extends _.l{constructor(a){super(a)}}',
  DAd: 'class extends _.l{constructor(a){super(a)}}',
  qH: 'class extends _.l{constructor(a){super(a)}Yq(a){return _.Gk(this,1,_.oH,a)}getMetadata(){return _.m(this,N4c,2)}lq(){return _.ge(this,2)}}',
  oH: 'class extends _.l{constructor(a){super(a)}getText(){return _.xi(this,_.gH,2,_.pH)}setText(a){return _.di(this,2,_.pH,a)}Dg(){return _.Zh(this,2,_.pH)}zo(){return _.Zh(this,3,_.pH)}clearVideo(){return _.Oh(this,71,_.pH)}Fg(){return _.xi(this,JGc,4,_.pH)}bF(){return _.Zh(this,4,_.pH)}EGa(){return _.Oh(this,73,_.pH)}D5b(){return _.Zh(this,73,_.pH)}}',
  gH: 'class extends _.l{constructor(a){super(a)}getText(){return _.n(this,3)}setText(a){return _.Li(this,3,a)}Dg(){return _.Si(this,3)}}',
  vL: 'class extends _.l{constructor(a){super(a)}ig(){return _.n(this,1)}}',
} as const;
export function createGeminiNativeReceipt(namespace: unknown, approved: ApprovedGeminiTrial) {
  const a = nativeContract('response-identity', () => approval(approved));
  const sourceEntries = nativeContract('response-shape', () =>
    Object.entries(nativeNormalizationSources).map(([key, text]) => {
      const fn = own(namespace, key);
      sourceIs(fn, text);
      return [key, fn, text] as const;
    }),
  );
  const namespaceEntries = nativeContract('response-shape', () =>
    ['La', 'dga', '$L', 'ZL', 'SJd', 'YL', 'HF', 'pH', 'FF'].map((key) => {
      own(namespace, key);
      return { key, descriptor: Object.getOwnPropertyDescriptor(namespace, key)! };
    }),
  );
  let current: GeminiNativeIdentity = Object.freeze({
    turnId: a.clientTurnId as string,
    cidOrigin: 'absent',
    ridOrigin: 'request',
  });
  let terminal = false,
    final = false,
    invalidated = false,
    outputRefused = false;
  let previousAa: object | undefined;
  let previousAaBacking: unknown[] | undefined;
  const mutableSentinel = nativeContract('response-shape', () => {
    const sentinel = own(namespace, 'Kaa');
    require(sentinel !== null && typeof sentinel === 'object');
    return sentinel;
  });
  function checked<T>(cause: GeminiFixedTextTrialReason, run: () => T): T {
    return nativeContract(cause, () => {
      require(!invalidated, 'receipt-state');
      try {
        return run();
      } catch (error) {
        invalidated = true;
        throw error;
      }
    });
  }
  type Captured = {
    envelope: GeminiNativeEnvelope;
    prior: GeminiNativeIdentity;
    content?: ReturnType<ReturnType<typeof wireReader>['snapshot']>;
    originalIdentity?: ReturnType<ReturnType<typeof wireReader>['snapshot']>;
    rawBacking?: unknown[];
    surveySlot?: ReturnType<typeof surveySlot>;
    initialContent?: ReturnType<ReturnType<typeof wireReader>['snapshot']>;
    materializedContent?: ReturnType<ReturnType<typeof wireReader>['snapshot']>;
    originalFrozen?: boolean;
    cloned?: boolean;
    normalizedFrozen?: boolean;
    normalizedMutable?: boolean;
    materializedView?: object;
    materializedBacking?: unknown[];
    viewCreated?: boolean;
    mayDetach?: boolean;
    identityWasFrozen?: boolean;
    originalBackings?: readonly unknown[][];
    normalizedBackings?: readonly unknown[][];
    materializedBackings?: readonly unknown[][];
    materializedIdentity?: ReturnType<ReturnType<typeof wireReader>['snapshot']>;
    initialIdentity?: ReturnType<ReturnType<typeof wireReader>['snapshot']>;
    receipt?: GeminiNativeFrameReceipt;
    recoveryControl?: boolean;
    normalization?: { normalized: unknown; identity: GeminiNativeIdentity };
    normalizedContent?: ReturnType<ReturnType<typeof wireReader>['snapshot']>;
    normalizedIdentity?: ReturnType<ReturnType<typeof wireReader>['snapshot']>;
    aa?: object;
    aaBacking?: unknown[];
    retired?: Array<ReturnType<typeof retiredNode>>;
  };
  let captured: Captured | undefined;
  let terminalWitness: Captured | undefined;
  const snapshot = (value: unknown, omitIdentity = false) =>
    wireReader(namespace, true, false, true).snapshot(value, 'IF', false, omitIdentity);
  // Pba may omit an empty array carrying its repeated-field bit. This projection is
  // used only inside an authenticated source operation; ordinary snapshots stay exact.
  const cloneSnapshot = (value: unknown) =>
    wireReader(namespace, true, false, true, true).snapshot(value, 'IF');
  const backings = (value: unknown) => {
    const read = wireReader(namespace, true, false, true);
    read.snapshot(value, 'IF');
    return Object.freeze([...read.snapshotBackings]);
  };
  const sameBackings = (value: unknown, retained: readonly unknown[][] | undefined) => {
    const fresh = backings(value);
    require(retained &&
      fresh.length === retained.length &&
      fresh.every((raw, index) => raw === retained[index]), 'receipt-backing');
  };
  const identitySnapshot = (value: unknown) => {
    const read = wireReader(namespace, true, false, true),
      fields = read.message(value, 'IF');
    return read.snapshot(fields.get(2));
  };
  type Materializer = 'm' | 'Roa' | 'ub';
  const materializerKeys = ['m', 'Roa', 'ub'] as const;
  let materializerSources:
    Array<{ key: string; fn: unknown; text: string; descriptor: PropertyDescriptor }> | undefined;
  let materializerHooks: Map<string, PropertyDescriptor> | undefined;
  const materializerOwners = new WeakSet<object>();
  const materializerBindings: Array<{
    owner: object;
    key: PropertyKey;
    descriptor: PropertyDescriptor | undefined;
  }> = [];
  const materializerPrototypes: Array<{ value: object; parent: object | null }> = [];
  let operation:
    | {
        target: object;
        detached: boolean;
        ub: boolean;
        key: 'm' | 'Roa';
        field: number;
        C: any;
        ownerName: string;
        expectsUb: boolean;
        evidence: ReturnType<typeof transitionEvidence>;
        ubSelected?: any;
      }
    | undefined;
  function graph(value: unknown) {
    const read = wireReader(namespace, true, false, true);
    read.snapshot(value, 'IF');
    return read.snapshotNodes;
  }
  function nodeSnapshot(node: ReturnType<typeof graph>[number]) {
    return wireReader(namespace, true, false, true).snapshot(
      node.raw,
      node.name,
      node.repeated,
      false,
      0,
      node.opaqueShape,
      undefined,
      node.nativeHFPath,
    );
  }
  type Shape = {
    value: object;
    prototype: object | null;
    descriptors: Array<{ key: PropertyKey; descriptor: PropertyDescriptor }>;
  };
  function retiredNode(node: ReturnType<typeof graph>[number], expected?: Map<object, Shape>) {
    const read = wireReader(namespace, true, false, true);
    const content = read.snapshot(
      node.raw,
      node.name,
      node.repeated,
      false,
      0,
      node.opaqueShape,
      undefined,
      node.nativeHFPath,
    );
    const values = new Set<object>();
    if (node.value !== null && typeof node.value === 'object') values.add(node.value);
    for (const item of read.snapshotNodes) {
      values.add(item.raw);
      if (item.value !== null && typeof item.value === 'object') values.add(item.value);
      const tail = item.raw.at(-1);
      if (tail && typeof tail === 'object' && Object.getPrototypeOf(tail) === Object.prototype)
        values.add(tail);
    }
    return {
      node: { ...node, content },
      backings: [...read.snapshotBackings],
      shape: [...values].map(
        (value) =>
          expected?.get(value) ?? {
            value,
            prototype: Object.getPrototypeOf(value),
            descriptors: Reflect.ownKeys(value).map((key) => ({
              key,
              descriptor: Object.getOwnPropertyDescriptor(value, key)!,
            })),
          },
      ),
    };
  }
  function checkShape(
    shape: ReturnType<typeof retiredNode>['shape'][number],
    liveCacheOwners?: Set<object>,
  ) {
    const cache = own(namespace, 'dga') as symbol;
    // Yh may populate the already-admitted cache on a pH/HF still shared with the live graph.
    // Its exact role and Map selection have just been validated by the graph reader.
    const addedCache =
      liveCacheOwners?.has(shape.value) && !shape.descriptors.some((item) => item.key === cache);
    const keys = Reflect.ownKeys(shape.value).filter((key) => !addedCache || key !== cache);
    require(Object.getPrototypeOf(shape.value) === shape.prototype &&
      keys.length === shape.descriptors.length &&
      shape.descriptors.every(
        ({ key, descriptor }, i) =>
          keys[i] === key &&
          sameDescriptor(descriptor, Object.getOwnPropertyDescriptor(shape.value, key)),
      ), 'receipt-backing');
  }
  function checkRetired(record: ReturnType<typeof retiredNode>, liveCacheOwners: Set<object>) {
    const fresh = retiredNode(record.node);
    require(sameSnapshot(fresh.node.content, record.node.content), 'receipt-content');
    require(fresh.backings.length === record.backings.length &&
      fresh.backings.every((raw, i) => raw === record.backings[i]), 'receipt-backing');
    for (const shape of record.shape) checkShape(shape, liveCacheOwners);
  }
  // Expected descriptors are advanced only by a proved source branch, never copied from post-state.
  function transitionEvidence(records: Array<ReturnType<typeof retiredNode>>) {
    const shapes = new Map<object, Shape>();
    for (const record of records)
      for (const shape of record.shape)
        if (!shapes.has(shape.value))
          shapes.set(shape.value, {
            ...shape,
            descriptors: shape.descriptors.map((item) => ({
              ...item,
              descriptor: { ...item.descriptor },
            })),
          });
    const flag = own(namespace, 'La') as symbol;
    const cache = own(namespace, 'dga') as symbol;
    const groups = [own(namespace, 'HF'), own(namespace, 'pH')];
    const caches = [...shapes.values()].flatMap((shape) => {
      const value = shape.descriptors.find((item) => item.key === cache)?.descriptor.value;
      return value
        ? [
            {
              value,
              size: Reflect.apply(nativeMapSize, value, []),
              selections: groups.map((group) => [
                Reflect.apply(nativeMapHas, value, [group]),
                Reflect.apply(nativeMapGet, value, [group]),
              ]),
            },
          ]
        : [];
    });
    const get = (value: object, key: PropertyKey): any =>
      shapes.get(value)?.descriptors.find((item) => item.key === key)?.descriptor.value;
    const flags = (value: object) => Number(get(value, flag) ?? 0);
    const put = (value: object, key: PropertyKey, next: unknown) => {
      const shape = shapes.get(value)!;
      require(shape, 'receipt-backing');
      const item = shape.descriptors.find((item) => item.key === key);
      if (item) item.descriptor = { ...item.descriptor, value: next };
      else
        shape.descriptors.push({
          key,
          descriptor: { value: next, writable: true, enumerable: true, configurable: true },
        });
    };
    const fresh = (value: object, prototype: object, entries: Array<[PropertyKey, unknown]>) => {
      require(value !== null &&
        typeof value === 'object' &&
        !shapes.has(value) &&
        Object.getPrototypeOf(value) === prototype, 'receipt-backing');
      shapes.set(value, {
        value,
        prototype,
        descriptors: entries.map(([key, value]) => ({
          key,
          descriptor: {
            value,
            writable: true,
            enumerable: key !== 'length',
            configurable: key !== 'length',
          },
        })),
      });
    };
    const freeze = (value: object) => {
      for (const item of shapes.get(value)!.descriptors)
        item.descriptor = { ...item.descriptor, writable: false, configurable: false };
      require(Object.isFrozen(value), 'receipt-backing');
    };
    const check = () => {
      for (const { value, size, selections } of caches)
        require(Reflect.apply(nativeMapSize, value, []) === size &&
          groups.every(
            (group, i) =>
              Reflect.apply(nativeMapHas, value, [group]) === selections[i]![0] &&
              Reflect.apply(nativeMapGet, value, [group]) === selections[i]![1],
          ), 'receipt-backing');
      for (const shape of shapes.values()) {
        // Array index order can change when Lba writes flags after numeric entries.
        const keys = Reflect.ownKeys(shape.value);
        require(Object.getPrototypeOf(shape.value) === shape.prototype &&
          keys.length === shape.descriptors.length &&
          shape.descriptors.every(({ key, descriptor }) =>
            sameDescriptor(descriptor, Object.getOwnPropertyDescriptor(shape.value, key)),
          ), 'receipt-backing');
      }
    };
    const backing = (value: any): any[] => (Array.isArray(value) ? value : get(value, 'fl'));
    const immutable = (value: any) =>
      !!(flags(backing(value)) & 2) && get(value, 'Fb') !== mutableSentinel;
    const field = (raw: any[], n: number): [object, string] => {
      const last = get(raw, 'length') - 1,
        tail = get(raw, String(last));
      return last >= 0 && n - 1 >= last && tail && Object.getPrototypeOf(tail) === Object.prototype
        ? [tail, String(n)]
        : [raw, String(n - 1)];
    };
    const selected = (raw: any[], n: number) => (n === -1 ? null : get(...field(raw, n)));
    const assign = (raw: any[], n: number, value: unknown) => put(...field(raw, n), value);
    const ng = (raw: any[]) => {
      const f = flags(raw);
      if (f & 32 && !(f & 4096)) put(raw, flag, f | 4096);
    };
    function construct(raw: any[]) {
      let f = flags(raw);
      if (!(f & 64)) {
        const last = get(raw, 'length') - 1,
          tail = get(raw, String(last));
        if (tail && Object.getPrototypeOf(tail) === Object.prototype)
          f = (f & -16760833) | ((last + 1) << 14);
      }
      put(raw, flag, f | 64 | 2048);
    }
    function wrapper(value: any, raw: any[], C: any, mutable = false, shared = false) {
      fresh(value, C.prototype, [
        ['fl', raw],
        ...(mutable ? [['Fb', mutableSentinel] as [string, unknown]] : []),
        ...(shared ? [['tcc', mutableSentinel] as [string, unknown]] : []),
      ]);
      construct(raw);
    }
    function childInfo(value: any, parentFlags: number) {
      const raw = backing(value),
        typed = !Array.isArray(value);
      const f = flags(raw) | (typed ? 0 : (parentFlags & 34) | 64 | 2048);
      return {
        raw,
        typed,
        immutable: !!(f & 2) && (!typed || get(value, 'Fb') !== mutableSentinel),
      };
    }
    function child(value: any, next: any, C: any, parentFlags: number, mutable: boolean) {
      const info = childInfo(value, parentFlags);
      if (!info.typed) {
        const f = flags(info.raw),
          propagated = f | (parentFlags & 34);
        if (propagated !== f) put(info.raw, flag, propagated);
        wrapper(next, info.raw, C, mutable && info.immutable, mutable && info.immutable);
      } else if (mutable && info.immutable) wrapper(next, info.raw, C, true, true);
      else require(next === value, 'receipt-backing');
      return info;
    }
    function cloneValue(value: any, next: any, deep: boolean) {
      if (value === null || typeof value !== 'object') {
        require(next === value, 'receipt-backing');
        return;
      }
      if (Array.isArray(value)) {
        const f = flags(value);
        if (get(value, 'length') === 0 && f & 1) {
          require(next === undefined, 'receipt-backing');
          return;
        }
        if (f & 2) require(next === value, 'receipt-backing');
        else if (!deep || f & (4096 | 16)) cloneArray(value, next, deep && !(f & 16));
        else {
          require(next === value, 'receipt-backing');
          put(value, flag, f | 34);
          if (f & 4) freeze(value);
        }
      } else {
        const raw = backing(value),
          f = flags(raw);
        require(Array.isArray(raw), 'receipt-backing');
        if (immutable(value)) require(next === value, 'receipt-backing');
        else if (f & 2 || (f & 32 && !(f & 4096))) {
          if (!(f & 2)) {
            put(raw, flag, f | 2);
            put(value, 'Fb', mutableSentinel);
          }
          wrapper(next, raw, (Object.getPrototypeOf(value) as any).constructor, false, true);
        } else cloneArray(raw, next, !!(f & 34));
      }
    }
    function cloneArray(raw: any[], next: any[], deep: boolean, root = false) {
      require(Array.isArray(next) && next !== raw, 'receipt-backing');
      const f = flags(raw),
        length = get(raw, 'length'),
        last = length - 1;
      const tail = !(f & 1) && get(raw, String(last));
      const packed = tail && Object.getPrototypeOf(tail) === Object.prototype ? tail : undefined;
      const entries: Array<[PropertyKey, unknown]> = [],
        tailEntries: Array<[PropertyKey, unknown]> = [];
      const omitted = (v: any) =>
        v == null || (Array.isArray(v) && get(v, 'length') === 0 && !!(flags(v) & 1));
      for (let i = 0; i < length - (packed ? 1 : 0); i++) {
        const old = get(raw, String(i));
        if (omitted(old)) continue;
        const value = own(next, String(i));
        cloneValue(old, value, deep);
        entries.push([String(i), value]);
      }
      if (packed) {
        for (const { key, descriptor } of shapes.get(packed)!.descriptors) {
          if (omitted(descriptor.value)) continue;
          const nextTail = own(next, String(last));
          require(nextTail && typeof nextTail === 'object', 'receipt-backing');
          const value = own(nextTail, key);
          cloneValue(descriptor.value, value, deep);
          tailEntries.push([key, value]);
        }
        if (tailEntries.length) {
          const nextTail = own(next, String(last)) as object;
          fresh(nextTail, Object.prototype, tailEntries);
          entries.push([String(last), nextTail]);
        }
      }
      const nextLength = entries.length ? Math.max(...entries.map(([key]) => Number(key))) + 1 : 0;
      fresh(next, Array.prototype, [
        ...entries,
        ['length', nextLength],
        [flag, (f & 16769217) | 32 | (root ? 2048 : 0)],
      ]);
    }
    function m(raw: any[], parent: any, C: any, n: number, result: any, onlyQoa = false) {
      const value = selected(raw, n);
      if (value == null) {
        require(result === undefined, 'receipt-backing');
        return false;
      }
      const f = flags(raw),
        info = childInfo(value, f);
      const mg = !onlyQoa && !immutable(parent) && info.immutable;
      child(value, result, C, f, mg);
      assign(raw, n, result);
      if ((!info.typed && !info.immutable) || mg) ng(raw);
      return mg;
    }
    function roa(
      raw: any[],
      parent: any,
      C: any,
      n: number,
      mode: number | undefined,
      mutableRead: boolean,
      result: any[],
    ) {
      const f = flags(raw),
        parentImmutable = immutable(parent);
      const selectedList = selected(raw, n),
        list = Array.isArray(selectedList) ? selectedList : (own(namespace, 'Yd') as any[]);
      if (!shapes.has(list)) {
        const shape = {
          value: list,
          prototype: Array.prototype,
          descriptors: Reflect.ownKeys(list).map((key) => ({
            key,
            descriptor: Object.getOwnPropertyDescriptor(list, key)!,
          })),
        };
        shapes.set(list, shape);
      }
      const length = get(list, 'length'),
        initial = flags(list),
        parse = !(initial & 4);
      let b = initial | (f & 2) | 1;
      const infos = Array.from({ length }, (_, i) => childInfo(get(list, String(i)), f | (b & 2)));
      if (parse) {
        const allFrozen = !!(b & 2) || infos.every((info) => info.immutable),
          allMutable = !(b & 2) && infos.every((info) => !info.immutable);
        b |= 4;
        b = allFrozen ? b & -4097 : b | 4096;
        b = allMutable ? b | 8 : b & -9;
      }
      const effectiveMode = mode || 4;
      const mg =
        mutableRead &&
        !parentImmutable &&
        !(
          b & 8 ||
          (!length &&
            (effectiveMode === 1 || (effectiveMode === 4 && (b & 2 || (!(b & 16) && f & 32)))))
        );
      const copy = mg && (!!(b & 2 && b & 4) || !!(b & 256));
      if (copy) require(result !== list, 'receipt-backing');
      else require(result === list, 'receipt-backing');
      for (let i = 0; i < length; i++) {
        const value = get(list, String(i));
        if (copy) {
          const intermediate = own(list, String(i));
          if (parse) child(value, intermediate, C, f | (b & 2), false);
          else require(intermediate === value, 'receipt-backing');
          put(list, String(i), intermediate);
          child(intermediate, own(result, String(i)), C, f | (b & 2), true);
        } else if (parse || mg) {
          child(value, own(result, String(i)), C, f | (b & 2), mg);
          put(list, String(i), own(result, String(i)));
        }
      }
      if (b !== initial) {
        put(list, flag, b);
        if (b & 2) freeze(list);
      }
      if (copy) {
        b = (f & 2 ? b | 2 : b & -3) & -273;
        fresh(result, Array.prototype, [
          ...Array.from(
            { length },
            (_, i) => [String(i), own(result, String(i))] as [string, unknown],
          ),
          ['length', length],
          [flag, b],
        ]);
        assign(raw, n, result);
      }
      if (mg) {
        b |= 8;
        b = length ? b | 4096 : b & -4097;
        put(result, flag, b);
      }
      const frozenList = !!(b & 2 && b & 4) || !!(b & 256);
      if (effectiveMode === 1 || (effectiveMode === 4 && (b & 2 || (!(b & 16) && f & 32)))) {
        if (!frozenList) {
          b |= !length || (parse && !(b & 4096)) || (f & 32 && !(b & (4096 | 16))) ? 2 : 256;
          put(result, flag, b);
          freeze(result);
        }
      } else if (!frozenList) {
        b |= 16;
        put(result, flag, b);
      }
      if (!(b & 2) && b & (4096 | 16)) ng(raw);
    }
    return {
      shapes,
      get,
      flags,
      put,
      check,
      backing,
      selected,
      assign,
      ng,
      immutable,
      cloneArray,
      child,
      m,
      roa,
    };
  }
  function retainOwners(entry: Captured) {
    for (const value of [
      entry.envelope.kind === 'response' ? entry.envelope.raw : undefined,
      entry.normalization?.normalized,
      entry.materializedView,
    ]) {
      if (value === undefined) continue;
      for (const node of graph(value))
        if (node.value !== null && typeof node.value === 'object')
          materializerOwners.add(node.value);
    }
  }
  function sameDescriptor(a: PropertyDescriptor, b: PropertyDescriptor | undefined) {
    return (
      b &&
      'value' in b &&
      a.value === b.value &&
      a.writable === b.writable &&
      a.enumerable === b.enumerable &&
      a.configurable === b.configurable
    );
  }
  // Survey is deliberately excluded from our answer copy. Retain only its source slot,
  // never inspect the ancillary value or use it as materializer evidence.
  function surveySlot(raw: unknown[]) {
    const last = String(raw.length - 1),
      tail = own(raw, last);
    const sparse =
      tail !== null &&
      typeof tail === 'object' &&
      Object.getPrototypeOf(tail) === Object.prototype &&
      raw.length <= 25;
    const owner = sparse ? tail : raw,
      key = sparse ? '25' : '24';
    return { owner, key, descriptor: Object.getOwnPropertyDescriptor(owner, key) };
  }
  function omitSurvey(value: object, raw: unknown[]): { message: object; backing: unknown[] } {
    const slot = surveySlot(raw),
      descriptors = Object.getOwnPropertyDescriptors(raw as object);
    if (slot.owner === raw) delete descriptors['24'];
    else {
      const tailDescriptors = Object.getOwnPropertyDescriptors(slot.owner);
      delete tailDescriptors['25'];
      const tail = Object.create(Object.getPrototypeOf(slot.owner), tailDescriptors);
      if (!Object.isExtensible(slot.owner)) Object.preventExtensions(tail);
      descriptors[String(raw.length - 1)]!.value = tail;
    }
    const backing: unknown[] = Object.defineProperties([], descriptors);
    if (!Object.isExtensible(raw)) Object.preventExtensions(backing);
    const messageDescriptors = Object.getOwnPropertyDescriptors(value);
    messageDescriptors.fl = { ...messageDescriptors.fl, value: backing };
    const message = Object.create(Object.getPrototypeOf(value), messageDescriptors);
    if (!Object.isExtensible(value)) Object.preventExtensions(message);
    return { message, backing };
  }
  function sources() {
    nativeOneof(namespace, wireReader(namespace, true), 'HF', [11, 21, 23, 28, 37, 49, 51]);
    nativeOneof(namespace, wireReader(namespace, true), 'pH', nativePlainNodeOneofFields);
    require(Reflect.ownKeys(own(namespace, 'pH') as object).length ===
      nativePlainNodeOneofFields.length + 1, 'cache-shape');
    for (const { key, descriptor } of namespaceEntries) {
      const current = Object.getOwnPropertyDescriptor(namespace, key);
      require(current &&
        'value' in current &&
        current.value === descriptor.value &&
        current.writable === descriptor.writable &&
        current.configurable === descriptor.configurable &&
        current.enumerable === descriptor.enumerable, 'receipt-source');
    }
    require(own(namespace, 'Kaa') === mutableSentinel, 'receipt-source');
    for (const [key, fn, text] of sourceEntries) {
      const hook = materializerHooks?.get(key);
      require(hook
        ? sameDescriptor(hook, Object.getOwnPropertyDescriptor(namespace, key))
        : own(namespace, key) === fn, 'receipt-source');
      sourceIs(fn, text);
    }
  }
  function materializationSources() {
    for (const { owner, key, descriptor } of materializerBindings) {
      const fresh = Object.getOwnPropertyDescriptor(owner, key);
      require(descriptor ? sameDescriptor(descriptor, fresh) : !fresh, 'receipt-source');
    }
    for (const { value, parent } of materializerPrototypes)
      require(Object.getPrototypeOf(value) === parent, 'receipt-source');
    for (const entry of materializerSources ?? []) {
      sourceIs(entry.fn, entry.text, true);
      require(sameDescriptor(
        materializerHooks?.get(entry.key) ?? entry.descriptor,
        Object.getOwnPropertyDescriptor(namespace, entry.key),
      ), 'receipt-source');
    }
  }
  function frozenIdentity(
    value: unknown,
    expected: GeminiNativeIdentity,
    retainedBacking?: unknown[],
    predicate?: ReceivePredicate,
  ) {
    const read = wireReader(namespace, true, false, true);
    require(value !== null &&
      typeof value === 'object' &&
      Object.getPrototypeOf(value) === read.prototype('CI'), 'receipt-frozen-identity');
    const backing = read.backing(value);
    require(retainedBacking === undefined ||
      backing === retainedBacking, 'receipt-frozen-identity');
    require(Number(own(backing, own(namespace, 'La') as PropertyKey)) &
      2, 'receipt-frozen-identity');
    require(own(value, 'Fb') !== own(namespace, 'Kaa'), 'receipt-frozen-identity');
    const fields = read.message(value, 'CI');
    read.fields(fields, [1, 2], predicate);
    require(fields.size === 2 &&
      fields.get(1) === (expected.conversationId ?? '') &&
      fields.get(2) === expected.turnId, 'receipt-frozen-identity');
    return backing;
  }
  function verify(entry: Captured) {
    sources();
    materializationSources();
    if (entry.retired?.length) {
      const liveCacheOwners = new Set(
        graph(entry.normalization!.normalized)
          .filter((node) => node.name === 'IF' || node.name === 'oH')
          .map((node) => node.raw),
      );
      for (const record of entry.retired) checkRetired(record, liveCacheOwners);
    }
    const fresh = nativeEnvelope(namespace, entry.envelope.envelope, false);
    require(fresh.kind === entry.envelope.kind, 'receipt-content');
    if (entry.envelope.kind === 'ignored') {
      entry.envelope.verify();
      return;
    }
    if (entry.envelope.kind === 'close') {
      require(fresh.kind === 'close' && fresh.field === entry.envelope.field, 'receipt-content');
      return;
    }
    require(fresh.kind === 'response', 'receipt-content');
    require(entry.rawBacking, 'receipt-backing');
    const slot = surveySlot(entry.rawBacking);
    require(entry.surveySlot &&
      slot.owner === entry.surveySlot.owner &&
      slot.key === entry.surveySlot.key &&
      (entry.surveySlot.descriptor
        ? sameDescriptor(entry.surveySlot.descriptor, slot.descriptor)
        : !slot.descriptor), 'receipt-content');
    const freshBacking = wireReader(namespace, true, false, true).backing(fresh.raw);
    require(freshBacking === (entry.materializedBacking ?? entry.rawBacking), 'receipt-backing');
    if (entry.materializedView) require(fresh.raw === entry.materializedView, 'receipt-backing');
    if (entry.materializedBacking && entry.materializedBacking !== entry.rawBacking) {
      require(sameSnapshot(
        snapshot(entry.rawBacking, true),
        entry.initialContent,
      ), 'receipt-content');
      require(sameSnapshot(
        identitySnapshot(entry.rawBacking),
        entry.initialIdentity,
      ), 'receipt-content');
    }
    require(sameSnapshot(snapshot(entry.envelope.raw, true), entry.content), 'receipt-content');
    if (entry.normalization) {
      sameBackings(entry.envelope.raw, entry.originalBackings);
      sameBackings(entry.normalization.normalized, entry.normalizedBackings);
      sameBackings(fresh.raw, entry.materializedBackings);
      require(sameSnapshot(
        snapshot(fresh.raw, true),
        entry.materializedContent ?? entry.content,
      ), 'receipt-content');
      require(sameSnapshot(
        identitySnapshot(fresh.raw),
        entry.materializedIdentity,
      ), 'receipt-content');
      const read = wireReader(namespace, true, false, true),
        normalized = entry.normalization.normalized;
      const raw = read.backing(normalized);
      if (!entry.recoveryControl)
        require(!wireReader(namespace, true, false, true)
          .message(normalized, 'IF')
          .has(25), 'receipt-content');
      require(!!(Number(own(raw, own(namespace, 'La') as PropertyKey)) & 2) ===
        entry.normalizedFrozen, 'receipt-backing');
      require((own(normalized, 'Fb') === mutableSentinel) ===
        entry.normalizedMutable, 'receipt-backing');
      if (entry.cloned)
        require(read.message(normalized, 'IF').get(2) === entry.aa, 'receipt-backing');
      require(sameSnapshot(
        snapshot(entry.normalization.normalized, true),
        entry.normalizedContent,
      ), 'receipt-content');
      require(sameSnapshot(
        identitySnapshot(entry.normalization.normalized),
        entry.normalizedIdentity,
      ), 'receipt-content');
      require(sameSnapshot(
        identitySnapshot(entry.envelope.raw),
        entry.originalIdentity,
      ), 'receipt-content');
      frozenIdentity(entry.aa, entry.normalization.identity, entry.aaBacking);
    } else {
      require(sameSnapshot(
        identitySnapshot(entry.envelope.raw),
        entry.originalIdentity,
      ), 'receipt-content');
    }
  }
  function normalizeFrame(value: unknown, actualAa: unknown, recoveryControl: boolean) {
    return checked('response-identity', () => {
      const entry = captured;
      require(entry && entry.envelope.kind === 'response' && !entry.normalization, 'receipt-state');
      require(!recoveryControl || entry.recoveryControl === true, 'receipt-state');
      require(recoveryControl || !outputRefused, 'receipt-state');
      sources();
      const envelope = entry.envelope;
      const next = nativeIdentity(entry.prior, envelope.cid, envelope.rid, terminal);
      const rawCid = envelope.cid.presence === 'value' ? envelope.cid.value : undefined;
      const rawRid = envelope.rid.presence === 'value' ? envelope.rid.value : undefined;
      const cloned = !rawRid || (!rawCid && !!entry.prior.conversationId);
      const read = wireReader(namespace, true, false, true);
      require(value !== null &&
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === read.prototype('IF'), 'normalization-view');
      if (previousAa) {
        frozenIdentity(previousAa, entry.prior, previousAaBacking);
        require(actualAa !== previousAa, 'normalization-view');
      }
      const aaBacking = frozenIdentity(actualAa, next);
      let actualBacking = read.backing(value);
      const observed = nativeEnvelope(namespace, envelope.envelope, false);
      require(observed.kind === 'response', 'normalization-view');
      const view = observed.raw,
        viewBacking = wireReader(namespace, true, false, true).backing(view);
      require(!Array.isArray(view) &&
        Object.getPrototypeOf(view) === read.prototype('IF'), 'normalization-view');
      if (!Array.isArray(envelope.raw))
        require(entry.viewCreated
          ? view !== envelope.raw
          : view === envelope.raw, 'normalization-view');
      const detached = viewBacking !== entry.rawBacking;
      require(!detached ||
        (entry.mayDetach && (cloned || entry.identityWasFrozen)), 'normalization-view');
      if (detached) {
        require(sameSnapshot(
          snapshot(entry.rawBacking, true),
          entry.content,
        ), 'normalization-view');
        require(sameSnapshot(
          identitySnapshot(entry.rawBacking),
          entry.initialIdentity,
        ), 'normalization-view');
      }
      require(sameSnapshot(snapshot(view, true), entry.content), 'normalization-view');
      if (!cloned) require(value === view, 'normalization-clone');
      else {
        require(value !== view, 'normalization-clone');
        require(Number(own(actualBacking, own(namespace, 'La') as PropertyKey)) &
          2, 'normalization-clone');
        require(own(value, 'Fb') !== own(namespace, 'Kaa'), 'normalization-clone');
        require(read.message(value, 'IF').get(2) === actualAa, 'normalization-clone');
        const viewFields = wireReader(namespace, true, false, true).message(view, 'IF');
        if (viewFields.get(2) === actualAa) {
          const shares =
            !!(Number(own(viewBacking, own(namespace, 'La') as PropertyKey)) & 2) &&
            own(view, 'Fb') === own(namespace, 'Kaa');
          require(shares
            ? actualBacking === viewBacking
            : actualBacking !== viewBacking, 'normalization-clone');
        } else
          require(actualBacking !== viewBacking &&
            sameSnapshot(identitySnapshot(view), entry.initialIdentity), 'normalization-clone');
      }
      entry.materializedView = view;
      entry.materializedBacking = viewBacking;
      require(sameSnapshot(snapshot(value, true), entry.content), 'normalization-view');
      require(sameSnapshot(snapshot(envelope.raw, true), entry.content), 'normalization-view');
      const normalized = wireReader(namespace, true, false, true).message(value, 'IF');
      const normalizedIds = nativeIds(wireReader(namespace, true, false, true), normalized);
      const expectedCid = next.conversationId ?? '';
      const actualCid = normalizedIds.cid.presence === 'value' ? normalizedIds.cid.value : '';
      const actualRid = normalizedIds.rid.presence === 'value' ? normalizedIds.rid.value : '';
      require(actualCid === expectedCid && actualRid === next.turnId, 'normalization-identity');
      // Mutable Vg can preserve the original backing; only that source write to field2 is permitted.
      if (entry.originalFrozen || !cloned)
        require(sameSnapshot(
          identitySnapshot(envelope.raw),
          entry.originalIdentity,
        ), 'normalization-view');
      else
        require(sameSnapshot(identitySnapshot(envelope.raw), entry.originalIdentity) ||
          sameSnapshot(
            identitySnapshot(envelope.raw),
            identitySnapshot(value),
          ), 'normalization-view');
      if (normalized.has(25) && !recoveryControl) {
        // Keep the provider frame untouched; only the isolated fixed-trial projection
        // omits survey metadata, after all original normalization proofs have passed.
        const isolated = omitSurvey(value, actualBacking);
        value = isolated.message;
        actualBacking = isolated.backing;
        require(sameSnapshot(snapshot(value, true), entry.content), 'normalization-view');
      }
      const observation = readGeminiRawContent(
        wireReader(namespace, true, false, true),
        wireReader(namespace, true, false, true).message(value, 'IF'),
        'native',
        recoveryControl,
      );
      if (observation.completed) Object.freeze(observation.completed);
      if (observation.routing) Object.freeze(observation.routing);
      Object.freeze(observation);
      const receipt: GeminiNativeFrameReceipt | undefined = recoveryControl
        ? undefined
        : Object.freeze({
            original: envelope.raw,
            normalized: value as object,
            cid: envelope.cid,
            rid: envelope.rid,
            identity: next,
            cidEvidence: rawCid
              ? 'this-server-frame'
              : next.cidOrigin === 'server'
                ? 'earlier-server-frame'
                : 'absent',
            ridEvidence: rawRid
              ? 'this-server-frame'
              : next.ridOrigin === 'server'
                ? 'earlier-server-frame'
                : 'request-seed',
            observation,
          });
      entry.cloned = cloned;
      entry.normalizedFrozen = !!(
        Number(own(actualBacking, own(namespace, 'La') as PropertyKey)) & 2
      );
      entry.normalizedMutable = own(value, 'Fb') === mutableSentinel;
      entry.originalBackings = backings(envelope.raw);
      entry.normalizedBackings = backings(value);
      entry.materializedBackings = backings(view);
      entry.materializedIdentity = identitySnapshot(view);
      entry.receipt = receipt;
      entry.normalization = { normalized: value, identity: next };
      entry.normalizedContent = snapshot(value, true);
      entry.normalizedIdentity = identitySnapshot(value);
      entry.originalIdentity = identitySnapshot(envelope.raw);
      entry.aa = actualAa as object;
      entry.aaBacking = aaBacking;
      previousAa = actualAa as object;
      previousAaBacking = aaBacking;
      current = next;
      if (!recoveryControl && wireTrue(normalized.get(15))) {
        final = true;
        terminalWitness = entry;
      }
      verify(entry);
      retainOwners(entry);
      if (recoveryControl) outputRefused = true;
      return receipt;
    });
  }
  return {
    prepareMaterializers() {
      return checked('response-shape', () => {
        require(!materializerSources, 'receipt-state');
        sources();
        materializerSources = Object.entries({
          ...nativeMaterializationSources,
          ...nativeMaterializationConstructors,
        }).map(([key, text]) => {
          const fn = own(namespace, key);
          sourceIs(fn, text, true);
          return { key, fn, text, descriptor: Object.getOwnPropertyDescriptor(namespace, key)! };
        });
        const marker = own(namespace, 'Oa'),
          token = own(namespace, 'Pa');
        require((typeof marker === 'symbol' || typeof marker === 'string') &&
          token !== null &&
          typeof token === 'object' &&
          marker !== own(namespace, 'La') &&
          marker !== own(namespace, 'dga'), 'receipt-source');
        const base = own(own(namespace, 'l'), 'prototype') as object;
        require(own(base, marker as PropertyKey) === token, 'receipt-source');
        for (const key of ['Oa', 'Pa', 'ob', 'Xd', 'Yd']) {
          own(namespace, key);
          materializerBindings.push({
            owner: namespace as object,
            key,
            descriptor: Object.getOwnPropertyDescriptor(namespace, key),
          });
        }
        materializerBindings.push({
          owner: base,
          key: marker as PropertyKey,
          descriptor: Object.getOwnPropertyDescriptor(base, marker as PropertyKey),
        });
        for (const key of ['l', ...Object.keys(nativeMaterializationConstructors)]) {
          const C = own(namespace, key) as object,
            p = own(C, 'prototype') as object;
          require(own(p, 'constructor') === C &&
            (key === 'l' ||
              (Object.getPrototypeOf(C) === own(namespace, 'l') &&
                Object.getPrototypeOf(p) === base)), 'receipt-source');
          for (const [owner, property] of [
            [C, 'prototype'],
            [p, 'constructor'],
            [p, marker as PropertyKey],
            [C, Symbol.hasInstance],
          ] as const) {
            const descriptor = Object.getOwnPropertyDescriptor(owner, property);
            require(property !== Symbol.hasInstance || !descriptor, 'receipt-source');
            materializerBindings.push({ owner, key: property, descriptor });
          }
          materializerPrototypes.push(
            { value: C, parent: Object.getPrototypeOf(C) },
            { value: p, parent: Object.getPrototypeOf(p) },
          );
        }
        materializationSources();
        return Object.fromEntries(
          materializerKeys.map((key) => [key, own(namespace, key)]),
        ) as Record<Materializer, (...args: any[]) => any>;
      });
    },
    bindMaterializers() {
      checked('response-shape', () => {
        require(materializerSources && !materializerHooks, 'receipt-state');
        materializerHooks = new Map(
          materializerKeys.map((key) => {
            const descriptor = Object.getOwnPropertyDescriptor(namespace, key);
            require(descriptor &&
              'value' in descriptor &&
              typeof descriptor.value === 'function', 'receipt-source');
            return [key, descriptor!];
          }),
        );
        sources();
        materializationSources();
      });
    },
    restoreMaterializers() {
      // Guard restoration has already compared each installed hook descriptor.
      require(materializerHooks, 'receipt-source');
      materializerHooks = undefined;
      sources();
      materializationSources();
    },
    ownsMaterialization(value: unknown) {
      return value !== null && typeof value === 'object' && materializerOwners.has(value);
    },
    materialize(key: Materializer, receiver: unknown, args: any[]) {
      return checked('response-shape', () => {
        const entry = captured;
        require(materializerHooks &&
          entry?.normalization &&
          entry.envelope.kind === 'response', 'receipt-state');
        sources();
        materializationSources();
        const original =
          key === 'Roa'
            ? materializerSources!.find((item) => item.key === key)!.fn
            : sourceEntries.find(([name]) => name === key)![1];
        const target = args[0],
          flag = own(namespace, 'La') as symbol;
        const read = wireReader(namespace, true, false, true);
        if (key === 'ub') {
          require(operation &&
            operation.target === target &&
            !operation.ub &&
            args.length === 1, 'receipt-state');
          operation.ub = true;
          const raw = read.backing(target),
            flags = Number(own(raw, flag));
          const mutable = own(target, 'Fb') === mutableSentinel;
          const evidence = operation.evidence;
          if (operation.key === 'm') {
            const value = wireReader(namespace, true, false, true)
              .message(
                raw,
                undefined,
                false,
                operation.ownerName === 'IF' || operation.ownerName === 'oH'
                  ? operation.ownerName
                  : undefined,
              )
              .get(operation.field);
            evidence.m(raw, target, operation.C, operation.field, value, true);
            require(!evidence.immutable(target) && evidence.immutable(value), 'receipt-backing');
            operation.ubSelected = value;
          } else require(operation.expectsUb, 'receipt-backing');
          evidence.check();
          const before = cloneSnapshot(entry.normalization.normalized);
          const result = Reflect.apply(original as Function, receiver, args);
          sources();
          materializationSources();
          require(result === mutable, 'receipt-backing');
          require(sameSnapshot(
            cloneSnapshot(entry.normalization.normalized),
            before,
          ), 'receipt-content');
          if (mutable) {
            evidence.cloneArray(raw, read.backing(target), !!(flags & 34), true);
            evidence.put(target, 'fl', read.backing(target));
            evidence.put(target, 'Fb', undefined);
            evidence.put(target, 'tcc', undefined);
            operation.detached = true;
          }
          evidence.check();
          return result;
        }
        require(!operation, 'receipt-state');
        verify(entry);
        const before = graph(entry.normalization.normalized);
        const allBefore = [
          ...new Set([entry.envelope.raw, entry.normalization.normalized, entry.materializedView]),
        ].flatMap(graph);
        const owner = before.find((node) => node.value === target && !node.repeated);
        require(owner &&
          !Array.isArray(target) &&
          owner.name &&
          owner.name !== 'CI', 'receipt-backing');
        const raw = read.backing(target),
          flags = Number(own(raw, flag));
        const field = key === 'm' ? args[2] : args[4];
        require(Number.isInteger(field) &&
          (field > 0 || (key === 'm' && field === -1)), 'receipt-state');
        const selected = wireReader(namespace, true, false, true)
          .message(
            raw,
            undefined,
            false,
            owner.name === 'IF' || owner.name === 'oH' ? owner.name : undefined,
          )
          .get(field);
        const C = key === 'm' ? args[1] : args[3];
        require(typeof C === 'function', 'receipt-source');
        if (key === 'm')
          require((args.length === 3 || args.length === 4) &&
            args[3] === undefined, 'receipt-state');
        else
          require(args[1] === raw &&
            args[2] === flags &&
            ((args.length === 9 &&
              args[5] === undefined &&
              args[6] === undefined &&
              args[7] === false &&
              args[8] === true) ||
              (args.length === 7 && args[5] === 1 && args[6] === undefined)), 'receipt-state');
        if (
          selected !== undefined &&
          !(key === 'Roa' && Array.isArray(selected) && selected.length === 0)
        ) {
          const expected =
            key === 'm'
              ? (
                  {
                    IF: { 2: 'CI', 6: 'W4c', 21: 'DAd', 46: 'vL', 52: 'private', 55: 'private' },
                    FF: { 2: '$Zc', 9: 'native-status', 13: '$v' },
                    oH: { 2: 'gH' },
                  } as Record<string, Record<number, string>>
                )[owner.name!]?.[field]
              : (
                  { IF: { 5: 'FF', 27: 'qH' }, qH: { 1: 'oH' } } as Record<
                    string,
                    Record<number, string>
                  >
                )[owner.name!]?.[field];
          require(expected, 'receipt-source');
          if (expected === 'private' || expected === 'native-status') {
            sourceIs(
              C,
              expected === 'private'
                ? 'class extends _.l{constructor(a){super(a)}}'
                : 'class extends _.l{constructor(a){super(a)}getState(){return _.ti(this,1)}setState(a){return _.Ni(this,1,a)}}',
              true,
            );
            require(Object.getPrototypeOf(C) === own(namespace, 'l'), 'receipt-source');
          } else require(C === own(namespace, expected!), 'receipt-source');
        }
        const priorGraph = [
          ...allBefore.map((node) => retiredNode(node)),
          ...(entry.retired ?? []),
        ];
        const evidence = transitionEvidence(priorGraph);
        const contents = cloneSnapshot(entry.normalization.normalized);
        const state = {
          target,
          detached: false,
          ub: false,
          key,
          field,
          C,
          ownerName: owner.name!,
          expectsUb: key === 'Roa' && args[8] === true && !evidence.immutable(target),
          evidence,
          ubSelected: undefined as any,
        };
        operation = state;
        try {
          const result = Reflect.apply(original as Function, receiver, args);
          sources();
          materializationSources();
          require(sameSnapshot(
            cloneSnapshot(entry.normalization.normalized),
            contents,
          ), 'receipt-content');
          const currentRaw = read.backing(target);
          if (key === 'm') {
            if (state.ub) {
              evidence.child(state.ubSelected, result, C, 0, true);
              evidence.assign(currentRaw, field, result);
              evidence.ng(currentRaw);
            } else require(!evidence.m(raw, target, C, field, result), 'receipt-backing');
          } else {
            require(state.ub === state.expectsUb, 'receipt-backing');
            evidence.roa(currentRaw, target, C, field, args[5], args[8] === true, result);
          }
          evidence.check();
          for (const node of allBefore)
            require(sameSnapshot(nodeSnapshot(node), node.content), 'receipt-content');
          const after = graph(entry.normalization.normalized),
            live = new Set(after.map((node) => node.raw));
          // Every retained object was checked against immutable pre-state plus explicit source writes.
          entry.retired = (entry.retired ?? []).map((record) =>
            retiredNode(record.node, evidence.shapes),
          );
          for (const node of before)
            if (!live.has(node.raw) && !entry.retired.some((old) => old.node.raw === node.raw))
              entry.retired.push(retiredNode(node, evidence.shapes));
          entry.content = snapshot(entry.envelope.raw, true);
          entry.normalizedContent = snapshot(entry.normalization.normalized, true);
          entry.materializedContent = snapshot(entry.materializedView, true);
          entry.originalBackings = backings(entry.envelope.raw);
          entry.normalizedBackings = backings(entry.normalization.normalized);
          entry.materializedBackings = backings(entry.materializedView);
          entry.materializedBacking = wireReader(namespace, true, false, true).backing(
            entry.materializedView,
          );
          const normalizedRaw = read.backing(entry.normalization.normalized);
          entry.normalizedFrozen = !!(Number(own(normalizedRaw, flag)) & 2);
          entry.normalizedMutable = own(entry.normalization.normalized, 'Fb') === mutableSentinel;
          verify(entry);
          retainOwners(entry);
          return result;
        } finally {
          operation = undefined;
        }
      });
    },
    capture(value: unknown): GeminiNativeEnvelope {
      return checked('response-shape', () => {
        require(!captured, 'receipt-state');
        sources();
        if (previousAa)
          frozenIdentity(previousAa, current, previousAaBacking, 'fields-prior-aa-identity');
        // Correlate exact source recovery controls so the original projection can unwind.
        // Output normalization stays strict; source-only forwarding returns no accepted frame.
        const envelope = nativeEnvelope(namespace, value, true, true);
        const entry: Captured = { envelope, prior: current };
        if (envelope.kind === 'response') {
          entry.recoveryControl = [2, 3, 4].includes(
            wireReader(namespace, true, false, true).message(envelope.raw, 'IF').get(63) as number,
          );
          const rawBacking = wireReader(namespace, true, false, true).backing(envelope.raw);
          entry.content = snapshot(envelope.raw, true);
          entry.initialContent = entry.content;
          entry.originalIdentity = identitySnapshot(envelope.raw);
          entry.rawBacking = rawBacking;
          entry.surveySlot = surveySlot(rawBacking);
          entry.initialIdentity = entry.originalIdentity;
          const pathRead = wireReader(namespace, true, false, true);
          const path = nativeResponsePath(
            namespace,
            pathRead,
            pathRead.message(envelope.envelope, 'Kzd'),
            envelope.envelope,
          );
          const logicalFrozen =
            !!(path.rawFlags & 2) &&
            (Array.isArray(envelope.raw) || own(envelope.raw, 'Fb') !== own(namespace, 'Kaa'));
          entry.viewCreated = !path.holderFrozen && logicalFrozen;
          entry.mayDetach =
            entry.viewCreated ||
            (!Array.isArray(envelope.raw) && own(envelope.raw, 'Fb') === own(namespace, 'Kaa'));
          const identityRead = wireReader(namespace, true, false, true),
            identity = identityRead.message(envelope.raw, 'IF').get(2);
          if (identity !== undefined)
            entry.identityWasFrozen = Array.isArray(identity)
              ? !!(
                  (Number(own(identity, own(namespace, 'La') as PropertyKey) ?? 0) |
                    path.rawFlags) &
                  2
                )
              : !!(Number(own(own(identity, 'fl'), own(namespace, 'La') as PropertyKey)) & 2) &&
                own(identity, 'Fb') !== own(namespace, 'Kaa');
          const flags = Number(own(rawBacking, own(namespace, 'La') as PropertyKey));
          entry.originalFrozen =
            !!(flags & 2) &&
            (Array.isArray(envelope.raw) || own(envelope.raw, 'Fb') !== own(namespace, 'Kaa'));
        }
        captured = entry;
        return envelope;
      });
    },
    recoveryControl(): boolean {
      return captured?.recoveryControl === true;
    },
    forwardRecovery(value: unknown, actualAa: unknown): void {
      normalizeFrame(value, actualAa, true);
    },
    normalize(value: unknown, actualAa: unknown): GeminiNativeFrameReceipt {
      const receipt = normalizeFrame(value, actualAa, false);
      require(receipt, 'receipt-state');
      return receipt;
    },
    finishEnvelope(): void {
      checked('response-shape', () => {
        const entry = captured;
        require(entry &&
          (entry.envelope.kind === 'close' ||
            entry.envelope.kind === 'ignored' ||
            entry.normalization), 'receipt-state');
        if (previousAa) frozenIdentity(previousAa, current, previousAaBacking);
        verify(entry);
        captured = undefined;
      });
    },
    verify(): void {
      checked('response-shape', () => {
        sources();
        if (previousAa) frozenIdentity(previousAa, current, previousAaBacking);
        if (captured) verify(captured);
        if (terminalWitness && terminalWitness !== captured) verify(terminalWitness);
      });
    },
    terminal(): void {
      checked('response-shape', () => {
        sources();
        if (previousAa) frozenIdentity(previousAa, current, previousAaBacking);
        terminal = true;
      });
    },
    identity(): GeminiNativeIdentity {
      return Object.freeze({ ...current });
    },
    completion(value: GeminiTrialCompletion): GeminiTrialCompletion {
      return nativeContract('response-completion', () => {
        const witness = terminalWitness;
        require(
          !invalidated &&
            !outputRefused &&
            !captured &&
            terminal &&
            final &&
            current.cidOrigin === 'server' &&
            witness,
        );
        checked('response-completion', () => {
          if (previousAa) frozenIdentity(previousAa, current, previousAaBacking);
          verify(witness);
        });
        const completed = object(value);
        require(
          completed.conversationId === current.conversationId &&
            completed.turnId === current.turnId,
        );
        const permitted =
          completed.kind === 'marker'
            ? ['kind', 'conversationId', 'turnId', 'observedCandidateId']
            : [
                'conversationId',
                'turnId',
                'candidateId',
                'answer',
                'Zzb',
                'Eka',
                'tZa',
                'thinkingLevel',
                'Cq',
                'Hj',
                'regionCode',
              ];
        keys(completed, permitted);
        if (completed.kind === 'marker')
          require(completed.observedCandidateId === undefined || id(completed.observedCandidateId));
        else
          require(id(completed.candidateId) && completed.answer === GEMINI_FIXED_TEXT_TRIAL_ANSWER);
        return Object.freeze({ ...completed }) as GeminiTrialCompletion;
      });
    },
    pending(): boolean {
      return !!captured;
    },
  };
}
function nativeConfigurationParts(namespace: unknown, value: unknown, diagnostics = false) {
  const read = wireReader(namespace, diagnostics, true);
  nativeOneof(namespace, read, 'XL', [1, 2, 3, 4]);
  nativeOneof(namespace, read, 'HJd', [6, 8]);
  const config = nativeWrapper(read, value, 'JJd', 1);
  const fields = read.message(config, 'GJd');
  read.fields(fields, [1, 2, 8]);
  const sequence = fields.get(2);
  require(fields.size === 3 && (sequence === 0 || sequence === 0n || sequence === '0'), diagnostics
    ? 'dispatch-native-n15-configuration-zero'
    : undefined);
  const wrapper = nativeWrapper(read, fields.get(8), 'DJd', 5);
  const payload = read.message(nativePrivateBacking(namespace, wrapper, 'QGd', diagnostics));
  read.fields(payload, [1, 4]);
  require(payload.size === 2 && payload.get(4) === 1, diagnostics
    ? 'dispatch-native-n15-configuration-02'
    : undefined);
  const ok = payload.get(1);
  require(ok !== null && typeof ok === 'object', diagnostics
    ? 'dispatch-native-n15-configuration-03'
    : undefined);
  read.message(ok, 'wL');
  const metadata = read.message(fields.get(1), '$Ad');
  read.fields(metadata, [1, 2, 3, 4]);
  require(metadata.size === 4, diagnostics ? 'dispatch-native-n15-configuration-04' : undefined);
  require(typeof metadata.get(1) === 'number' &&
    Number.isInteger(metadata.get(1)) &&
    id(metadata.get(2)) &&
    metadata.get(3) === 'ko' &&
    id(metadata.get(4)), diagnostics ? 'dispatch-native-n15-configuration-05' : undefined);
  // Outbound owner paths are explicit; inbound snapshots keep the default policy.
  wireReader(namespace, diagnostics, true).snapshot(value, 'JJd', false, false, 0, false, []);
  return { ok, metadata };
}
export function assertGeminiNativeConfiguration(
  namespace: unknown,
  value: unknown,
  expectedOk: unknown,
  approved: ApprovedGeminiTrial,
  requestSource: unknown,
  diagnostics = false,
): void {
  nativeContract('packet', () => {
    sourceIs(
      own(namespace, 'dDb', diagnostics),
      'function(a){return Object.assign({},{locale:"ko",requestSource:a.requestSource},a.modeId!==void 0?{modeId:a.modeId}:{},a.turnId!==void 0?{turnId:a.turnId}:{})}',
      diagnostics,
    );
    sourceIs(
      own(namespace, 'EJd', diagnostics),
      'function(a,b){return _.Gh(a,_.$Ad,1,b)}',
      diagnostics,
    );
    sourceIs(own(namespace, 'FJd', diagnostics), 'function(a,b){return _.Ii(a,2,b)}', diagnostics);
    const a = approval(approved),
      { ok, metadata } = nativeConfigurationParts(namespace, value, diagnostics);
    const read = wireReader(namespace, diagnostics, true);
    require(value !== null &&
      typeof value === 'object' &&
      Object.getPrototypeOf(value) === read.prototype('JJd'), diagnostics
      ? 'dispatch-native-n15-configuration-assert-01'
      : undefined);
    require(expectedOk !== null &&
      typeof expectedOk === 'object' &&
      Object.getPrototypeOf(expectedOk) === read.prototype('wL'), diagnostics
      ? 'dispatch-native-n15-configuration-assert-02'
      : undefined);
    // A cold fixed-text request cannot inherit a continuation conversation.
    read.emptyMessage(read.message(expectedOk, 'wL').get(72), 'vL');
    require(typeof requestSource === 'number' && Number.isInteger(requestSource), diagnostics
      ? 'dispatch-native-n15-configuration-assert-03'
      : undefined);
    require(metadata.get(1) === requestSource &&
      metadata.get(2) === a.modeId &&
      metadata.get(3) === 'ko' &&
      metadata.get(4) === a.clientTurnId, diagnostics
      ? 'dispatch-native-n15-configuration-assert-04'
      : undefined);
    require(sameSnapshot(
      wireReader(namespace, diagnostics, true).snapshot(ok, 'wL'),
      wireReader(namespace, diagnostics, true).snapshot(expectedOk, 'wL'),
    ), diagnostics ? 'dispatch-native-n15-configuration-assert-05' : undefined);
  });
}
export function readGeminiNativeSendKind(
  namespace: unknown,
  value: unknown,
  diagnostics = false,
): 'configuration' | 'query' | 'close' {
  return nativeContract('packet', () => {
    const read = wireReader(namespace, diagnostics, true);
    nativeOneof(namespace, read, 'XL', [1, 2, 3, 4]);
    require(value !== null &&
      typeof value === 'object' &&
      Object.getPrototypeOf(value) === read.prototype('JJd'), diagnostics
      ? 'dispatch-native-n15-kind-01'
      : undefined);
    const root = read.message(value, 'JJd');
    read.fields(root, [1, 2, 4]);
    require(root.size === 1, diagnostics ? 'dispatch-native-n15-kind-02' : undefined);
    if (root.has(1)) {
      nativeConfigurationParts(namespace, value, diagnostics);
      return 'configuration';
    }
    if (root.has(2)) {
      nativeOneof(namespace, read, 'VL', [3, 4, 6, 7, 8, 9]);
      const query = read.message(root.get(2), 'WL');
      read.fields(query, [1, 9]);
      const sequence = query.get(1);
      require(query.size === 2 &&
        (sequence === 1 || sequence === 1n || sequence === '1'), diagnostics
        ? 'dispatch-native-n15-kind-03'
        : undefined);
      const text = read.message(query.get(9), 'xJd');
      read.fields(text, [1]);
      require(text.size === 1 && text.get(1) === GEMINI_FIXED_TEXT_TRIAL_PROMPT, diagnostics
        ? 'dispatch-native-n15-kind-04'
        : undefined);
      return 'query';
    }
    require(root.has(4), diagnostics ? 'dispatch-native-n15-kind-05' : undefined);
    const close = read.message(root.get(4), 'jJd');
    read.fields(close, [1]);
    require(close.size === 1 && close.get(1) === 1, diagnostics
      ? 'dispatch-native-n15-kind-06'
      : undefined);
    return 'close';
  });
}
