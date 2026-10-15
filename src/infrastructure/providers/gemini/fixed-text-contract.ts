import {
  GEMINI_FIXED_TEXT_TRIAL_ANSWER,
  GEMINI_FIXED_TEXT_TRIAL_PROMPT,
  GeminiFixedTextTrialReason,
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
const outboundFailures = new WeakMap<object, GeminiNativeConfigurationDiagnostic>();
export function readGeminiNativeOutboundDiagnostic(error: unknown) {
  return error !== null && (typeof error === 'object' || typeof error === 'function')
    ? outboundFailures.get(error)
    : undefined;
}
function transferOutboundFailure(error: unknown, failure: Error): never {
  const diagnostic = readGeminiNativeOutboundDiagnostic(error);
  if (diagnostic) outboundFailures.set(failure, diagnostic);
  throw failure;
}
function require(
  condition: unknown,
  diagnostic?: GeminiNativeConfigurationDiagnostic,
): asserts condition {
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
const nativeMapPrototype = Map.prototype;
const nativeMapSize = Object.getOwnPropertyDescriptor(nativeMapPrototype, 'size')!.get!;
const nativeMapHas = Object.getOwnPropertyDescriptor(nativeMapPrototype, 'has')!.value;
const nativeMapGet = Object.getOwnPropertyDescriptor(nativeMapPrototype, 'get')!.value;
function wireReader(namespace: unknown, diagnostics = false, outbound = false, inbound = false) {
  const own = (value: unknown, key: PropertyKey) => outboundOwn(value, key, diagnostics);
  const object = (value: unknown) => outboundObject(value, diagnostics);
  const candidateFlag = own(namespace, 'La');
  require(typeof candidateFlag === 'symbol' ||
    (typeof candidateFlag === 'string' && !!candidateFlag), diagnostics
    ? 'dispatch-native-n15-wire-01'
    : undefined);
  const flag = candidateFlag;
  const cacheKey = outbound || inbound ? own(namespace, 'dga') : undefined;
  if (outbound || inbound) require(typeof cacheKey === 'symbol' && cacheKey !== flag);
  const groups: Record<string, { key: string; fields: number[] }> = inbound
    ? {
        xzd: { key: 'hM', fields: [1, 2, 3, 4, 5, 6] },
        HJd: { key: 'gM', fields: [2, 3, 5, 6, 7, 8, 9] },
        BJd: { key: 'CJd', fields: [1, 2] },
        AJd: { key: 'fM', fields: [3, 4] },
      }
    : {
        tJd: { key: 'eM', fields: [1, 2, 3, 4] },
        qJd: { key: 'rJd', fields: [6, 8] },
        dM: { key: 'cM', fields: [3, 4, 6, 7, 8, 9] },
      };
  function oneof(raw: unknown[], fields: Map<number, unknown>, owner?: string) {
    const cache = cacheKey === undefined ? undefined : own(raw, cacheKey as symbol);
    const group = owner && groups[owner];
    require(group);
    const expected = own(namespace, group.key);
    require(Array.isArray(expected) && Object.getPrototypeOf(expected) === Array.prototype);
    require(own(expected, 'length') === group.fields.length);
    require(Reflect.ownKeys(expected).length === group.fields.length + 1);
    group.fields.forEach((field, index) => require(own(expected, String(index)) === field));
    const populated = group.fields.filter((field) => fields.has(field));
    require(populated.length <= 1);
    if (!Object.hasOwn(raw, cacheKey as symbol)) return;
    require(
      cache !== null &&
        typeof cache === 'object' &&
        Object.getPrototypeOf(cache) === nativeMapPrototype &&
        Reflect.ownKeys(cache).length === 0,
    );
    require(
      Map.prototype === nativeMapPrototype &&
        Object.getOwnPropertyDescriptor(nativeMapPrototype, 'size')?.get === nativeMapSize &&
        own(nativeMapPrototype, 'has') === nativeMapHas &&
        own(nativeMapPrototype, 'get') === nativeMapGet,
    );
    for (const [method, source] of [
      [nativeMapSize, 'get size'],
      [nativeMapHas, 'has'],
      [nativeMapGet, 'get'],
    ] as const)
      require(
        Reflect.apply(Function.prototype.toString, method, []) ===
          `function ${source}() { [native code] }`,
      );
    // Only captured intrinsics inspect Map internal slots; no provider reader or iterator is called.
    const size = Reflect.apply(nativeMapSize, cache, []);
    require(size <= 1);
    if (size)
      require(
        Reflect.apply(nativeMapHas, cache, [expected]) &&
          Reflect.apply(nativeMapGet, cache, [expected]) === (populated[0] ?? 0),
      );
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
      name === 'history' ? own(own(namespace, 'RGd'), 'Pb') : own(namespace, name);
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
        require(key === 'fl' || key === 'Fb' || key === 'Xbc', diagnostics
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
  function fields(value: Map<number, unknown>, allowed: number[]) {
    require([...value.keys()].every((field) => allowed.includes(field)), diagnostics
      ? 'dispatch-native-n15-wire-16'
      : undefined);
  }
  function emptyMessage(value: unknown, name?: string, allowedRepeated: number[] = []) {
    if (value === null || value === undefined) return;
    const data = message(value, name);
    fields(data, allowedRepeated);
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
      require(key === 'fl' || key === 'Fb' || key === 'Xbc', diagnostics
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
  function snapshot(
    value: unknown,
    name?: string,
    repeated = false,
    omitIdentity = false,
    depth = 0,
    opaqueShape = false,
    nativePath?: readonly number[],
  ): Snapshot {
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
    if (!Array.isArray(value) && name) {
      if (name === 'private') nativePrivateBacking(namespace, value, 'QGd');
      else
        require(Object.getPrototypeOf(value) === prototype(name), diagnostics
          ? 'dispatch-native-n15-wire-32'
          : undefined);
    }
    if (repeated) {
      const data = array(raw, true);
      return Object.freeze(
        Array.from({ length: data.length }, (_, index) =>
          snapshot(
            own(data, String(index)),
            name,
            false,
            false,
            depth + 1,
            opaqueShape,
            nativePath ? [...nativePath, index] : undefined,
          ),
        ),
      );
    }
    const owner =
      outbound && nativePath
        ? nativePath.length === 0
          ? 'tJd'
          : nativePath.length === 1 && nativePath[0] === 1
            ? 'qJd'
            : nativePath.length === 1 && nativePath[0] === 2
              ? 'dM'
              : undefined
        : inbound && nativePath
          ? nativePath.length === 0
            ? 'xzd'
            : nativePath.length === 1 && nativePath[0] === 2
              ? 'HJd'
              : nativePath.length === 2 && nativePath[0] === 2 && nativePath[1] === 7
                ? 'BJd'
                : nativePath.length === 3 &&
                    nativePath[0] === 2 &&
                    nativePath[1] === 7 &&
                    nativePath[2] === 1
                  ? 'AJd'
                  : undefined
          : undefined;
    if (owner && !Array.isArray(value)) require(Object.getPrototypeOf(value) === prototype(owner));
    const data = message(raw, undefined, true, owner);
    const content = [...data]
      .filter(([field]) => !omitIdentity || field !== 2)
      .sort(([a], [b]) => a - b)
      .map(([field, entry]) =>
        Object.freeze([
          field,
          snapshot(
            entry,
            name === 'HF'
              ? (
                  {
                    2: 'CI',
                    5: 'zF',
                    6: 'R4c',
                    21: 'qAd',
                    27: 'rH',
                    46: 'yL',
                    52: 'private',
                    55: 'private',
                    65: 'private',
                  } as Record<number, string>
                )[field]
              : name === 'zF'
                ? ({ 2: 'XZc', 9: 'private', 13: 'bw' } as Record<number, string>)[field]
                : name === 'rH' && field === 1
                  ? 'pH'
                  : name === 'pH' && field === 2
                    ? 'hH'
                    : undefined,
            (name === 'HF' && [5, 12, 13, 27, 56].includes(field)) ||
              (name === 'rH' && field === 1),
            false,
            depth + 1,
            opaqueShape || (name === 'HF' && [46, 52].includes(field)),
            nativePath ? [...nativePath, field] : undefined,
          ),
        ]),
      );
    // Opaque arrays have no schema here; retain their cardinality instead of guessing a message/list.
    return Object.freeze(opaqueShape ? ['opaque-wire', raw.length, ...content] : content);
  }
  return {
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
        Object.getPrototypeOf(raw) === read.prototype('HF'),
    );
    frame = read.message(raw, 'HF');
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
        if (allowed.includes(field)) return true;
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
      const location = read.message(frame.get(6));
      read.fields(location, [1, 2, 3, 5]);
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
      const control = read.message(frame.get(21), 'qAd');
      read.fields(control, [1]);
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
    if (frame.has(46)) read.opaque(frame.get(46), 'yL');
    stage = 'response-raw-disconnect';
    if (frame.has(52)) read.opaque(frame.get(52));

    stage = 'response-raw-client';
    read.emptyMessage(frame.get(65), undefined, [1]);

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
    const fallback = frame.has(55) ? read.message(frame.get(55)) : new Map<number, unknown>();
    read.fields(fallback, [2, 6]);
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
      read.fields(identity, [1, 2]);
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
        const candidate = read.message(own(candidates, '0'), 'zF');
        read.fields(candidate, [1, 2, 9, 13]);
        require(id(candidate.get(1)));
        observed.candidateId = candidate.get(1) as string;
        stage = 'response-candidate-extra';
        read.emptyMessage(candidate.get(13), 'bw');
        stage = 'response-final-metadata';
        if (candidate.has(9)) {
          // SZc is private; omission/default status is never a final witness.
          const status = read.message(candidate.get(9));
          read.fields(status, [1]);
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
          const content = read.message(candidate.get(2), 'XZc');
          read.fields(content, [1]);
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
        const content = read.message(own(structured, '0'), 'rH');
        read.fields(content, [1]);
        if (!text) read.emptyList(content.get(1));
        else {
          const node = read.message(read.one(content.get(1)), 'pH');
          read.fields(node, [2]);
          const plain = read.message(node.get(2), 'hH');
          read.fields(plain, [2, 3]);
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
  } catch {
    throw new Error('Gemini trial contract failed.', { cause: stage });
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
    keys(p, ['request', 'g8a', 'h8a']);
    require(typeof p.g8a === 'string' && !!p.g8a && p.g8a.length <= 1048576);
    require(typeof p.h8a === 'string' && /^[a-f0-9]{32}$/.test(p.h8a));
    const r = object(p.request);
    const requestPrototype = Object.getPrototypeOf(p.request);
    require(!requestPrototype || !Object.getOwnPropertyDescriptor(requestPrototype, 'ZKa'));
    keys(r, [
      'ze',
      'clientTurnId',
      'wi',
      'textQuery',
      'conversationId',
      'yj',
      'hz',
      'vS',
      'xg',
      'Po',
      'hf',
      'Rg',
      'uh',
      'kka',
      'RFa',
      'nxa',
      'jt',
      'Cc',
      'isPersonalContextDisabled',
      'V_b',
      'WZ',
      'Uo',
      'thinkingLevel',
      'Lj',
      's4d',
    ]);
    require(r.ze === a.storeId && r.clientTurnId === a.clientTurnId && r.wi === a.modeId);
    require(r.textQuery === GEMINI_FIXED_TEXT_TRIAL_PROMPT);
    for (const key of ['conversationId', 'yj', 'hz', 'vS']) require(r[key] === '');
    for (const key of ['xg', 'Po', 'hf']) require(r[key] === 0);
    require(r.Rg === false && r.uh === false);
    for (const key of ['kka', 'RFa', 'nxa', 'jt']) require(r[key] === undefined);
    require(
      r.WZ === a.modeCategory &&
        r.Uo === a.Cq &&
        r.thinkingLevel === a.thinkingLevel &&
        r.Lj === a.Hj,
    );
    require(r.isPersonalContextDisabled === a.isPersonalContextDisabled);
    require(r.V_b === undefined || r.V_b === true);
    const context = object(r.Cc);
    keys(context, ['isPersonalContextDisabled']);
    if (Object.hasOwn(context, 'isPersonalContextDisabled')) {
      require(
        typeof context.isPersonalContextDisabled === 'boolean' &&
          context.isPersonalContextDisabled === a.isPersonalContextDisabled,
      );
    }
    if (r.s4d !== undefined) {
      require(Object.getPrototypeOf(r.s4d) === read.prototype('wxd'));
      const privacy = read.message(r.s4d, 'wxd');
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
    const turn = read.message(read.one(root.get(1)), 'I5c');
    read.fields(turn, [1, 2, 3, 4, 5, 6, 7, 13]);
    for (const field of [6, 7, 13]) require(wireFalse(turn.get(field)));
    if (turn.has(5)) {
      const timestamp = read.message(turn.get(5), 'vl');
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
    const candidate = read.message(read.one(response.get(1)), 'zF');
    read.fields(candidate, [1, 2, 9, 13]);
    require(candidate.get(1) === selected);
    read.emptyMessage(candidate.get(13), 'bw');
    const status = read.message(candidate.get(9));
    read.fields(status, [1]);
    require(status.get(1) === 2);
    const text = read.message(candidate.get(2), 'XZc');
    read.fields(text, [1]);
    require(text.get(1) === GEMINI_FIXED_TEXT_TRIAL_ANSWER);
    const structuredContent = response.get(13);
    if (Array.isArray(structuredContent) && own(structuredContent, 'length') === 0) {
      read.emptyList(structuredContent);
    } else if (response.has(13)) {
      const structured = read.message(read.one(structuredContent), 'rH');
      read.fields(structured, [1]);
      const node = read.message(read.one(structured.get(1)), 'pH');
      read.fields(node, [2]);
      const plain = read.message(node.get(2), 'hH');
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
  | Readonly<{ kind: 'close'; envelope: object; field: 4 | 5 }>;
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
    const read = wireReader(namespace),
      frame = read.message(value, 'HF');
    require(!frame.has(65));
    if (frame.has(5)) {
      const candidates = read.array(frame.get(5), true);
      require(candidates.length <= 1);
      if (candidates.length)
        read.emptyMessage(read.message(own(candidates, '0'), 'zF').get(13), 'bw');
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
  kind: 'tHd' | 'QGd',
  diagnostics = false,
) {
  if (Array.isArray(value)) return value;
  const p = Object.getPrototypeOf(value);
  const constructor = own(p, 'constructor', diagnostics);
  sourceIs(
    constructor,
    kind === 'tHd'
      ? 'class extends _.l{constructor(a){super(a)}getResponse(){return _.m(this,_.H5c,2)}}'
      : 'class extends _.l{constructor(a){super(a)}}',
    diagnostics,
  );
  require(own(constructor, 'prototype', diagnostics) === p &&
    Object.getPrototypeOf(constructor) === own(namespace, 'l', diagnostics), diagnostics
    ? 'dispatch-native-n15-private-01'
    : undefined);
  require(Reflect.ownKeys(p).length === (kind === 'tHd' ? 2 : 1), diagnostics
    ? 'dispatch-native-n15-private-02'
    : undefined);
  if (kind === 'tHd')
    sourceIs(
      own(p, 'getResponse', diagnostics),
      'getResponse(){return _.m(this,_.H5c,2)}',
      diagnostics,
    );
  return wireReader(namespace, diagnostics).backing(value);
}
function nativeIds(read: ReturnType<typeof wireReader>, frame: Map<number, unknown>) {
  const fields = frame.has(2) ? read.message(frame.get(2), 'CI') : new Map<number, unknown>();
  read.fields(fields, [1, 2]);
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
) {
  const data = read.message(value, name);
  read.fields(data, [field]);
  require(data.size === 1 && data.has(field), read.diagnostics
    ? 'dispatch-native-n15-wrapper-01'
    : undefined);
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
  child = nativeWrapper(read, child, 'HJd', 7);
  flags = effective(child, flags);
  child = nativeWrapper(read, child, 'BJd', 1);
  flags = effective(child, flags);
  child = nativeWrapper(read, child, 'AJd', 4);
  flags = effective(child, flags);
  const holder = child,
    holderFrozen =
      !!(flags & 2) && (Array.isArray(holder) || own(holder, 'Fb') !== own(namespace, 'Kaa'));
  const raw = nativeWrapper(read, nativePrivateBacking(namespace, holder, 'tHd'), undefined, 4);
  return { raw, holderFrozen, rawFlags: effective(raw, flags) };
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
    const read = wireReader(namespace, false, false, true);
    for (const [key, fields] of [
      ['hM', [1, 2, 3, 4, 5, 6]],
      ['gM', [2, 3, 5, 6, 7, 8, 9]],
      ['CJd', [1, 2]],
      ['fM', [3, 4]],
    ] as const)
      nativeOneof(namespace, read, key, [...fields]);
    require(
      value !== null &&
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === read.prototype('xzd'),
    );
    const root = read.message(value, 'xzd');
    read.fields(root, [2, 4, 5]);
    require(root.size === 1);
    for (const field of [4, 5] as const)
      if (root.has(field)) {
        const payload = read.message(root.get(field));
        require(payload.size === 0 && read.array(root.get(field)).length === 0);
        return Object.freeze({ kind: 'close', envelope: value, field });
      }
    require(root.has(2));
    const { raw } = nativeResponsePath(namespace, read, root, value);
    require(raw !== null && typeof raw === 'object');
    const frame = read.message(raw, 'HF');
    const ids = nativeIds(read, frame);
    // Parse content independently from provenance; native absence never weakens RPC.
    if (validateContent)
      readGeminiRawContent(
        wireReader(namespace),
        wireReader(namespace).message(raw, 'HF'),
        'native',
        captureRecoveryControl,
      );
    wireReader(namespace, false, false, true).snapshot(
      value,
      undefined,
      false,
      false,
      0,
      false,
      [],
    );
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
  name: 'zL' | 'tJd' | 'CI',
  diagnostics = false,
): (candidate: unknown) => void {
  const identities = nativeContract('packet', () =>
    name === 'tJd'
      ? ['La', 'dga', 'eM', 'rJd', 'cM'].map((key) => ({
          key,
          descriptor: Object.getOwnPropertyDescriptor(namespace, key),
        }))
      : [],
  );
  function snapshot(candidate: unknown) {
    for (const { key, descriptor } of identities) {
      const current = Object.getOwnPropertyDescriptor(namespace, key);
      require(
        descriptor &&
          current &&
          'value' in descriptor &&
          'value' in current &&
          descriptor.value === current.value &&
          descriptor.writable === current.writable &&
          descriptor.configurable === current.configurable &&
          descriptor.enumerable === current.enumerable,
      );
    }
    try {
      const read = wireReader(namespace, diagnostics, name === 'tJd');
      require(name === 'zL' || name === 'tJd' || name === 'CI', diagnostics
        ? 'dispatch-native-n15-content-01'
        : undefined);
      require(candidate !== null &&
        typeof candidate === 'object' &&
        !Array.isArray(candidate) &&
        Object.getPrototypeOf(candidate) === read.prototype(name), diagnostics
        ? 'dispatch-native-n15-content-02'
        : undefined);
      read.message(candidate, name);
      return wireReader(namespace, diagnostics, name === 'tJd').snapshot(
        candidate,
        name,
        false,
        false,
        0,
        true,
        name === 'tJd' ? [] : undefined,
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
  if (c && prior.conversationId && c !== prior.conversationId) require(false);
  if (r && prior.ridOrigin === 'server' && r !== prior.turnId) require(false);
  if (r && terminal && r !== prior.turnId) require(false);
  return Object.freeze({
    conversationId: c ?? prior.conversationId,
    turnId: r ?? prior.turnId,
    cidOrigin: c || prior.cidOrigin === 'server' ? 'server' : 'absent',
    ridOrigin: r || prior.ridOrigin === 'server' ? 'server' : 'request',
  });
}
const nativeNormalizationSources = {
  m: 'function(a,b,c,d){var e=a.fl,f=e[_.La]|0;b=Qoa(e,f,b,c,d);if(b==null)return b;f=e[_.La]|0;if(!_.Ra(a,f)){let g=_.Mg(b);g!==b&&(_.ub(a)&&(e=a.fl,f=e[_.La]|0),b=g,f=_.yb(e,f,c,b,d),_.Ng(e,f))}return b}',
  Qh: 'function(a,b,c,d){a=a.fl;return Qoa(a,a[_.La]|0,b,c,d)||b[_.Xd]||(b[_.Xd]=_.iba(b))}',
  Mg: 'function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?_.Rba(a,b,c)?_.Qba(a,b,!0):new a.constructor(_.tb(b,c,!1)):a}',
  Bf: 'function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?a:_.Rba(a,b,c)?_.Qba(a,b):new a.constructor(_.tb(b,c,!0))}',
  Hh: 'function(a,b,c,d,e){d=Qpa(d);_.Wh(a,c,d,e);d&&!_.Ra(d)&&_.Ng(a.fl);return a}',
  ub: 'function(a){if(a.Fb!==_.Kaa)return!1;var b=a.fl;b=_.tb(b,b[_.La]|0);_.Ma(b,2048);a.fl=b;_.Laa(a,!1);a.Xbc=void 0;return!0}',
  Ra: 'function(a,b){return b===void 0?a.Fb!==_.Kaa&&!!(2&(a.fl[_.La]|0)):!!(2&b)&&a.Fb!==_.Kaa}',
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
    ['La', 'dga', 'hM', 'gM', 'CJd', 'fM'].map((key) => {
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
      require(!invalidated);
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
  };
  let captured: Captured | undefined;
  let terminalWitness: Captured | undefined;
  const snapshot = (value: unknown, omitIdentity = false) =>
    wireReader(namespace).snapshot(value, 'HF', false, omitIdentity);
  const backings = (value: unknown) => {
    const read = wireReader(namespace);
    read.snapshot(value, 'HF');
    return Object.freeze([...read.snapshotBackings]);
  };
  const sameBackings = (value: unknown, retained: readonly unknown[][] | undefined) => {
    const fresh = backings(value);
    require(
      retained &&
        fresh.length === retained.length &&
        fresh.every((raw, index) => raw === retained[index]),
    );
  };
  const identitySnapshot = (value: unknown) => {
    const read = wireReader(namespace),
      fields = read.message(value, 'HF');
    return read.snapshot(fields.get(2));
  };
  function sources() {
    for (const { key, descriptor } of namespaceEntries) {
      const current = Object.getOwnPropertyDescriptor(namespace, key);
      require(
        current &&
          'value' in current &&
          current.value === descriptor.value &&
          current.writable === descriptor.writable &&
          current.configurable === descriptor.configurable &&
          current.enumerable === descriptor.enumerable,
      );
    }
    require(own(namespace, 'Kaa') === mutableSentinel);
    for (const [key, fn, text] of sourceEntries) {
      require(own(namespace, key) === fn);
      sourceIs(fn, text);
    }
  }
  function frozenIdentity(
    value: unknown,
    expected: GeminiNativeIdentity,
    retainedBacking?: unknown[],
  ) {
    const read = wireReader(namespace);
    require(
      value !== null &&
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === read.prototype('CI'),
    );
    const backing = read.backing(value);
    require(retainedBacking === undefined || backing === retainedBacking);
    require(Number(own(backing, own(namespace, 'La') as PropertyKey)) & 2);
    require(own(value, 'Fb') !== own(namespace, 'Kaa'));
    const fields = read.message(value, 'CI');
    read.fields(fields, [1, 2]);
    require(
      fields.size === 2 &&
        fields.get(1) === (expected.conversationId ?? '') &&
        fields.get(2) === expected.turnId,
    );
    return backing;
  }
  function verify(entry: Captured) {
    sources();
    const fresh = nativeEnvelope(namespace, entry.envelope.envelope, false);
    require(fresh.kind === entry.envelope.kind);
    if (entry.envelope.kind === 'close') {
      require(fresh.kind === 'close' && fresh.field === entry.envelope.field);
      return;
    }
    require(fresh.kind === 'response');
    const freshBacking = wireReader(namespace).backing(fresh.raw);
    require(freshBacking === (entry.materializedBacking ?? entry.rawBacking));
    if (entry.materializedView) require(fresh.raw === entry.materializedView);
    if (entry.materializedBacking && entry.materializedBacking !== entry.rawBacking) {
      require(sameSnapshot(snapshot(entry.rawBacking, true), entry.content));
      require(sameSnapshot(identitySnapshot(entry.rawBacking), entry.initialIdentity));
    }
    require(sameSnapshot(snapshot(entry.envelope.raw, true), entry.content));
    if (entry.normalization) {
      sameBackings(entry.envelope.raw, entry.originalBackings);
      sameBackings(entry.normalization.normalized, entry.normalizedBackings);
      sameBackings(fresh.raw, entry.materializedBackings);
      require(sameSnapshot(snapshot(fresh.raw, true), entry.content));
      require(sameSnapshot(identitySnapshot(fresh.raw), entry.materializedIdentity));
      const read = wireReader(namespace),
        normalized = entry.normalization.normalized;
      const raw = read.backing(normalized);
      require(
        !!(Number(own(raw, own(namespace, 'La') as PropertyKey)) & 2) === entry.normalizedFrozen,
      );
      require((own(normalized, 'Fb') === mutableSentinel) === entry.normalizedMutable);
      if (entry.cloned) require(read.message(normalized, 'HF').get(2) === entry.aa);
      require(
        sameSnapshot(snapshot(entry.normalization.normalized, true), entry.normalizedContent),
      );
      require(
        sameSnapshot(identitySnapshot(entry.normalization.normalized), entry.normalizedIdentity),
      );
      require(sameSnapshot(identitySnapshot(entry.envelope.raw), entry.originalIdentity));
      frozenIdentity(entry.aa, entry.normalization.identity, entry.aaBacking);
    } else {
      require(sameSnapshot(identitySnapshot(entry.envelope.raw), entry.originalIdentity));
    }
  }
  function normalizeFrame(value: unknown, actualAa: unknown, recoveryControl: boolean) {
    return checked('response-identity', () => {
      const entry = captured;
      require(entry && entry.envelope.kind === 'response' && !entry.normalization);
      require(!recoveryControl || entry.recoveryControl === true);
      require(recoveryControl || !outputRefused);
      sources();
      const envelope = entry.envelope;
      const next = nativeIdentity(entry.prior, envelope.cid, envelope.rid, terminal);
      const rawCid = envelope.cid.presence === 'value' ? envelope.cid.value : undefined;
      const rawRid = envelope.rid.presence === 'value' ? envelope.rid.value : undefined;
      const cloned = !rawRid || (!rawCid && !!entry.prior.conversationId);
      const read = wireReader(namespace);
      require(
        value !== null &&
          typeof value === 'object' &&
          Object.getPrototypeOf(value) === read.prototype('HF'),
      );
      if (previousAa) {
        frozenIdentity(previousAa, entry.prior, previousAaBacking);
        require(actualAa !== previousAa);
      }
      const aaBacking = frozenIdentity(actualAa, next);
      const actualBacking = read.backing(value);
      const observed = nativeEnvelope(namespace, envelope.envelope, false);
      require(observed.kind === 'response');
      const view = observed.raw,
        viewBacking = wireReader(namespace).backing(view);
      require(!Array.isArray(view) && Object.getPrototypeOf(view) === read.prototype('HF'));
      if (!Array.isArray(envelope.raw))
        require(entry.viewCreated ? view !== envelope.raw : view === envelope.raw);
      const detached = viewBacking !== entry.rawBacking;
      require(!detached || (entry.mayDetach && (cloned || entry.identityWasFrozen)));
      if (detached) {
        require(sameSnapshot(snapshot(entry.rawBacking, true), entry.content));
        require(sameSnapshot(identitySnapshot(entry.rawBacking), entry.initialIdentity));
      }
      require(sameSnapshot(snapshot(view, true), entry.content));
      if (!cloned) require(value === view);
      else {
        require(value !== view);
        require(Number(own(actualBacking, own(namespace, 'La') as PropertyKey)) & 2);
        require(own(value, 'Fb') !== own(namespace, 'Kaa'));
        require(read.message(value, 'HF').get(2) === actualAa);
        const viewFields = wireReader(namespace).message(view, 'HF');
        if (viewFields.get(2) === actualAa) {
          const shares =
            !!(Number(own(viewBacking, own(namespace, 'La') as PropertyKey)) & 2) &&
            own(view, 'Fb') === own(namespace, 'Kaa');
          require(shares ? actualBacking === viewBacking : actualBacking !== viewBacking);
        } else
          require(
            actualBacking !== viewBacking &&
              sameSnapshot(identitySnapshot(view), entry.initialIdentity),
          );
      }
      entry.materializedView = view;
      entry.materializedBacking = viewBacking;
      require(sameSnapshot(snapshot(value, true), entry.content));
      require(sameSnapshot(snapshot(envelope.raw, true), entry.content));
      const normalized = wireReader(namespace).message(value, 'HF');
      const normalizedIds = nativeIds(wireReader(namespace), normalized);
      const expectedCid = next.conversationId ?? '';
      const actualCid = normalizedIds.cid.presence === 'value' ? normalizedIds.cid.value : '';
      const actualRid = normalizedIds.rid.presence === 'value' ? normalizedIds.rid.value : '';
      require(actualCid === expectedCid && actualRid === next.turnId);
      // Mutable Vg can preserve the original backing; only that source write to field2 is permitted.
      if (entry.originalFrozen || !cloned)
        require(sameSnapshot(identitySnapshot(envelope.raw), entry.originalIdentity));
      else
        require(
          sameSnapshot(identitySnapshot(envelope.raw), entry.originalIdentity) ||
            sameSnapshot(identitySnapshot(envelope.raw), identitySnapshot(value)),
        );
      const observation = readGeminiRawContent(
        wireReader(namespace),
        wireReader(namespace).message(value, 'HF'),
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
            normalized: value,
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
      if (recoveryControl) outputRefused = true;
      return receipt;
    });
  }
  return {
    capture(value: unknown): GeminiNativeEnvelope {
      return checked('response-shape', () => {
        require(!captured);
        sources();
        if (previousAa) frozenIdentity(previousAa, current, previousAaBacking);
        // Correlate exact source recovery controls so the original projection can unwind.
        // Output normalization stays strict; source-only forwarding returns no accepted frame.
        const envelope = nativeEnvelope(namespace, value, true, true);
        const entry: Captured = { envelope, prior: current };
        if (envelope.kind === 'response') {
          entry.recoveryControl = [2, 3, 4].includes(
            wireReader(namespace).message(envelope.raw, 'HF').get(63) as number,
          );
          const rawBacking = wireReader(namespace).backing(envelope.raw);
          entry.content = snapshot(envelope.raw, true);
          entry.originalIdentity = identitySnapshot(envelope.raw);
          entry.rawBacking = rawBacking;
          entry.initialIdentity = entry.originalIdentity;
          const pathRead = wireReader(namespace, false, false, true);
          const path = nativeResponsePath(
            namespace,
            pathRead,
            pathRead.message(envelope.envelope, 'xzd'),
            envelope.envelope,
          );
          const logicalFrozen =
            !!(path.rawFlags & 2) &&
            (Array.isArray(envelope.raw) || own(envelope.raw, 'Fb') !== own(namespace, 'Kaa'));
          entry.viewCreated = !path.holderFrozen && logicalFrozen;
          entry.mayDetach =
            entry.viewCreated ||
            (!Array.isArray(envelope.raw) && own(envelope.raw, 'Fb') === own(namespace, 'Kaa'));
          const identityRead = wireReader(namespace),
            identity = identityRead.message(envelope.raw, 'HF').get(2);
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
      require(receipt);
      return receipt;
    },
    finishEnvelope(): void {
      checked('response-shape', () => {
        const entry = captured;
        require(entry && (entry.envelope.kind === 'close' || entry.normalization));
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
  nativeOneof(namespace, read, 'eM', [1, 2, 3, 4]);
  nativeOneof(namespace, read, 'rJd', [6, 8]);
  const config = nativeWrapper(read, value, 'tJd', 1);
  const fields = read.message(config, 'qJd');
  read.fields(fields, [1, 2, 8]);
  const sequence = fields.get(2);
  require(fields.size === 3 && (sequence === 0 || sequence === 0n || sequence === '0'), diagnostics
    ? 'dispatch-native-n15-configuration-zero'
    : undefined);
  const wrapper = nativeWrapper(read, fields.get(8), 'nJd', 5);
  const payload = read.message(nativePrivateBacking(namespace, wrapper, 'QGd', diagnostics));
  read.fields(payload, [1, 4]);
  require(payload.size === 2 && payload.get(4) === 1, diagnostics
    ? 'dispatch-native-n15-configuration-02'
    : undefined);
  const ok = payload.get(1);
  require(ok !== null && typeof ok === 'object', diagnostics
    ? 'dispatch-native-n15-configuration-03'
    : undefined);
  read.message(ok, 'zL');
  const metadata = read.message(fields.get(1), 'LAd');
  read.fields(metadata, [1, 2, 3, 4]);
  require(metadata.size === 4, diagnostics ? 'dispatch-native-n15-configuration-04' : undefined);
  require(typeof metadata.get(1) === 'number' &&
    Number.isInteger(metadata.get(1)) &&
    id(metadata.get(2)) &&
    metadata.get(3) === 'ko' &&
    id(metadata.get(4)), diagnostics ? 'dispatch-native-n15-configuration-05' : undefined);
  // Outbound owner paths are explicit; inbound snapshots keep the default policy.
  wireReader(namespace, diagnostics, true).snapshot(value, 'tJd', false, false, 0, false, []);
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
      own(namespace, '$Cb', diagnostics),
      'function(a){return Object.assign({},{locale:"ko",requestSource:a.requestSource},a.modeId!==void 0?{modeId:a.modeId}:{},a.turnId!==void 0?{turnId:a.turnId}:{})}',
      diagnostics,
    );
    sourceIs(
      own(namespace, 'oJd', diagnostics),
      'function(a,b){return _.Hh(a,_.LAd,1,b)}',
      diagnostics,
    );
    sourceIs(own(namespace, 'pJd', diagnostics), 'function(a,b){return _.Ki(a,2,b)}', diagnostics);
    const a = approval(approved),
      { ok, metadata } = nativeConfigurationParts(namespace, value, diagnostics);
    const read = wireReader(namespace, diagnostics, true);
    require(value !== null &&
      typeof value === 'object' &&
      Object.getPrototypeOf(value) === read.prototype('tJd'), diagnostics
      ? 'dispatch-native-n15-configuration-assert-01'
      : undefined);
    require(expectedOk !== null &&
      typeof expectedOk === 'object' &&
      Object.getPrototypeOf(expectedOk) === read.prototype('zL'), diagnostics
      ? 'dispatch-native-n15-configuration-assert-02'
      : undefined);
    read.message(expectedOk, 'zL');
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
      wireReader(namespace, diagnostics, true).snapshot(ok, 'zL'),
      wireReader(namespace, diagnostics, true).snapshot(expectedOk, 'zL'),
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
    nativeOneof(namespace, read, 'eM', [1, 2, 3, 4]);
    require(value !== null &&
      typeof value === 'object' &&
      Object.getPrototypeOf(value) === read.prototype('tJd'), diagnostics
      ? 'dispatch-native-n15-kind-01'
      : undefined);
    const root = read.message(value, 'tJd');
    read.fields(root, [1, 2, 4]);
    require(root.size === 1, diagnostics ? 'dispatch-native-n15-kind-02' : undefined);
    if (root.has(1)) {
      nativeConfigurationParts(namespace, value, diagnostics);
      return 'configuration';
    }
    if (root.has(2)) {
      nativeOneof(namespace, read, 'cM', [3, 4, 6, 7, 8, 9]);
      const query = read.message(root.get(2), 'dM');
      read.fields(query, [1, 9]);
      const sequence = query.get(1);
      require(query.size === 2 &&
        (sequence === 1 || sequence === 1n || sequence === '1'), diagnostics
        ? 'dispatch-native-n15-kind-03'
        : undefined);
      const text = read.message(query.get(9), 'hJd');
      read.fields(text, [1]);
      require(text.size === 1 && text.get(1) === GEMINI_FIXED_TEXT_TRIAL_PROMPT, diagnostics
        ? 'dispatch-native-n15-kind-04'
        : undefined);
      return 'query';
    }
    require(root.has(4), diagnostics ? 'dispatch-native-n15-kind-05' : undefined);
    const close = read.message(root.get(4), 'UId');
    read.fields(close, [1]);
    require(close.size === 1 && close.get(1) === 1, diagnostics
      ? 'dispatch-native-n15-kind-06'
      : undefined);
    return 'close';
  });
}
