import {
  GEMINI_FIXED_TEXT_TRIAL_ANSWER,
  GEMINI_NATIVE_DISPATCH_REASONS,
  GEMINI_NATIVE_GUARD_DIAGNOSTICS,
  GEMINI_FIXED_TEXT_TRIAL_PROMPT,
  type GeminiFixedTextTrialResult,
  type GeminiFixedTextTrialReason,
} from '../../../application/gemini-fixed-text-trial';
import { composer, draftText } from '../dom';
import { readGeminiClientCapability, type GeminiOwnedClient } from './client-capability';
import {
  assertGeminiTrialPacket,
  isGeminiTrialLanguage,
  isGeminiTrialAttribution,
  readGeminiTrialRawFrame,
  type ApprovedGeminiTrial,
  type CompletedGeminiTrial,
  type GeminiFinalMarker,
  type GeminiTrialRawObservation,
  type GeminiNativeFrameReceipt,
} from './fixed-text-contract';
import { captureGeminiTrialModel } from './model-receipt';
import { geminiReadiness } from './readiness';
import { readGeminiMenuDiagnostic, readGeminiTriggerDiagnostic } from './menu-diagnostic';
import { armGeminiRpcDispatch } from './sdk-dispatch';
import { armGeminiColdWebChannel } from './sdk-webchannel';
import { readGeminiTrialHistory } from './trial-history';

// MAIN-only. The caller owns persisted intent, its native-document lease and page retirement.
export async function runGeminiSdkFixedTextTrial(
  signal: AbortSignal,
  current: () => boolean,
  bindRetirement: ((check: () => boolean) => void) | undefined = undefined,
): Promise<GeminiFixedTextTrialResult> {
  type Call = (this: unknown, ...args: unknown[]) => unknown;
  const home = 'https://gemini.google.com/app';
  const operation = new AbortController();
  let closed = false;
  let dispatch:
    | ReturnType<typeof armGeminiRpcDispatch>
    | ReturnType<typeof armGeminiColdWebChannel>
    | undefined;
  let nativeDispatch: ReturnType<typeof armGeminiColdWebChannel> | undefined;
  let consumingOriginalSubscription = false;
  let nativeFrame: GeminiNativeFrameReceipt | undefined;
  let cleanupQueued = false;
  let cleanupPending = false;
  const pendingCancellations = new Set<object>();
  let cleanupUnsafe = false;
  let finishQueued = false;
  let receipt: Awaited<ReturnType<typeof captureGeminiTrialModel>> | undefined;
  let inner: object | undefined;
  let builder: object | undefined;
  let unsubscribe: Call | undefined;
  let timer: ReturnType<typeof setInterval> | undefined;
  let rejectPending: ((error: Error) => void) | undefined;
  let terminal: Error | undefined;
  let called = false;
  let subscribed = false;
  let started = false;
  let settingUp = true;
  let setupStage: GeminiFixedTextTrialReason = 'capture-setup';
  let streamComplete = false;
  let final: CompletedGeminiTrial | undefined;
  let rawFinal: CompletedGeminiTrial | undefined;
  let rawFrameInFlight = false;
  let marker: GeminiFinalMarker | undefined;
  let ownedTurnId: string | undefined;
  let observedCandidateId: string | undefined;
  const routings: Array<{
    raw: GeminiTrialRawObservation;
    source?: object;
    forwarded?: boolean;
    action?: {
      source: unknown;
      event: Record<string, unknown>;
      context: Record<string, unknown>;
      request: Record<string, unknown>;
    };
  }> = [];
  const routingSources = new WeakSet<object>();
  let routingForwarding = false;
  const continuations: Array<Record<string, unknown>> = [];
  let previousEvent: Record<string, unknown> | undefined;
  let disconnect: Record<string, unknown> | undefined;
  let disconnectSource: unknown;
  let disconnectPending = false;
  let disconnectForwarding = false;
  let pairedActionInFlight = false;
  let ownedCid: string | undefined;
  let actionSuccess = false;
  let receivedTurn = false;
  const observations = new Set<object>();
  const retired = new WeakSet<object>();
  const teardowns = new Map<object, Call>();
  const listeners: Array<[EventTarget, string, EventListener]> = [];
  const failure = (cause: GeminiFixedTextTrialReason) =>
    new Error('Gemini SDK trial failed.', { cause });
  function require(
    condition: unknown,
    cause: GeminiFixedTextTrialReason = 'capture',
  ): asserts condition {
    if (!condition) throw failure(cause);
  }
  function own(value: unknown, key: PropertyKey): unknown {
    require(value !== null && (typeof value === 'object' || typeof value === 'function'));
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    require(!descriptor || 'value' in descriptor);
    return descriptor?.value;
  }
  function record(value: unknown): Record<string, unknown> {
    require(value !== null && typeof value === 'object' && !Array.isArray(value));
    require(
      Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null,
    );
    const keys = Reflect.ownKeys(value);
    require(keys.length <= 100 && keys.every((key) => typeof key === 'string'));
    const result: Record<string, unknown> = Object.create(null);
    for (const key of keys) result[key as string] = own(value, key);
    return result;
  }
  function list(value: unknown, limit = 128): unknown[] {
    require(Array.isArray(value) && Object.getPrototypeOf(value) === Array.prototype);
    const length = own(value, 'length');
    require(
      typeof length === 'number' && Number.isSafeInteger(length) && length >= 0 && length <= limit,
    );
    require(
      Reflect.ownKeys(value).every(
        (key) =>
          key === 'length' ||
          (typeof key === 'string' && /^(0|[1-9]\d*)$/.test(key) && Number(key) < length),
      ),
    );
    return Array.from({ length }, (_, index) => {
      require(Object.hasOwn(value, index));
      return own(value, String(index));
    });
  }
  function method(value: unknown, key: string): Call {
    require(value !== null && typeof value === 'object');
    let depth = 0;
    for (let at: object | null = value; at; at = Object.getPrototypeOf(at)) {
      require(++depth <= 12);
      const descriptor = Object.getOwnPropertyDescriptor(at, key);
      if (descriptor) {
        require('value' in descriptor);
        return callable(descriptor.value);
      }
    }
    throw failure('capture');
  }
  function callable(value: unknown): Call {
    require(typeof value === 'function');
    return value as Call;
  }
  const id = (value: unknown): value is string =>
    typeof value === 'string' && !!value && value.length <= 160 && !/\s/.test(value);
  function reason(
    error: unknown,
    fallback: GeminiFixedTextTrialReason,
  ): GeminiFixedTextTrialReason {
    try {
      const cause = own(error, 'cause');
      if (cause === 'dispatch-cold-webchannel') {
        const diagnostic = Object.getOwnPropertyDescriptor(error, 'geminiNativeDiagnostic');
        return diagnostic &&
          'value' in diagnostic &&
          diagnostic.writable === false &&
          diagnostic.configurable === false &&
          GEMINI_NATIVE_GUARD_DIAGNOSTICS.includes(diagnostic.value)
          ? diagnostic.value
          : 'dispatch';
      }
      if (cause === 'model-trigger') {
        const diagnostic = readGeminiTriggerDiagnostic(error);
        return diagnostic ? `model-trigger-${diagnostic}` : 'model-trigger';
      }
      if (cause === 'model-menu') {
        const diagnostic = readGeminiMenuDiagnostic(error);
        return diagnostic ? `model-menu-${diagnostic}` : 'model-menu';
      }
      if (
        [
          'page',
          'model',
          'model-trigger',
          'model-menu',
          'model-menu-open-trigger',
          'model-menu-open-menu',
          'model-menu-owner-missing',
          'model-menu-owner-changed',
          'model-menu-trigger-detached',
          'model-menu-popover-ambiguous',
          'model-menu-menu-ambiguous',
          'model-menu-controls-invalid',
          'model-menu-owner-duplicate',
          'model-cleanup',
          'model-bindings',
          'model-catalog',
          'model-selection',
          'model-selection-id',
          'model-selection-ui',
          'model-selection-catalog',
          'model-settings',
          'client',
          'client-initial',
          'client-initial-page',
          'client-initial-owner',
          'client-initial-owner-context',
          'client-initial-owner-view',
          'client-initial-owner-view-registry',
          'client-initial-owner-view-missing',
          'client-initial-owner-view-shape',
          'client-initial-owner-view-id',
          'client-initial-owner-view-metadata',
          'client-initial-owner-view-flags',
          'client-initial-owner-slot',
          'client-initial-owner-declaration-1',
          'client-initial-owner-declaration-2',
          'client-initial-owner-declaration-3',
          'client-initial-owner-declaration-3-node',
          'client-initial-owner-declaration-3-template',
          'client-initial-owner-declaration-3-binding',
          'client-initial-owner-component',
          'client-initial-runtime-shape',
          'client-initial-service-identity',
          'client-initial-protection',
          'client-initial-transport-session',
          'client-initial-transport-api',
          'client-initial-transport-route',
          'client-initial-transport-sse',
          'client-initial-transport-rpc',
          'client-initial-prewarm',
          'client-initial-hook',
          'client-initial-transport-webchannel',
          'client-protection',
          'client-current',
          'packet',
          'capture',
          'capture-current',
          'capture-state',
          'capture-action',
          'capture-setup',
          'capture-readiness',
          'capture-editor',
          'capture-bindings',
          'capture-actions',
          'capture-request-id',
          'capture-observation',
          'capture-completion',
          'capture-store',
          'dispatch',
          ...GEMINI_NATIVE_DISPATCH_REASONS,
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
          'dispatch-observation',
          'dispatch-source-notify',
          'response',
          'response-request',
          'response-turn',
          'response-selected',
          'response-action',
          'response-stream',
          'response-error',
          'response-event',
          'response-event-1',
          'response-event-2',
          'response-event-3',
          'response-disconnect-1',
          'response-disconnect-2',
          'response-disconnect-3',
          'response-disconnect-4',
          'response-disconnect-5',
          'response-disconnect-6',

          'response-completion',
          'response-shape',
          'response-envelope',
          'response-envelope-record',
          'response-envelope-kind',
          'response-envelope-keys',
          'response-envelope-meta-1',
          'response-envelope-meta-2',
          'response-envelope-meta-3',
          'response-envelope-meta-4',
          'response-envelope-meta-5',
          'response-envelope-meta-6',
          'response-envelope-meta-7',
          'response-record',
          'response-identity',
          'response-metadata',
          'response-lists',
          'response-flags',
          'response-flag-1',
          'response-flag-2',
          'response-flag-3',
          'response-flag-4',
          'response-flag-5',
          'response-flag-6',
          'response-flag-7',
          'response-flag-8',
          'response-extra',
          'response-raw-fields',
          'response-raw-field-1',
          'response-raw-field-3',
          'response-raw-field-4',
          'response-raw-field-14',
          'response-raw-field-17',
          'response-raw-field-18',
          'response-raw-field-19',
          'response-raw-field-22',
          'response-raw-field-29',
          'response-raw-field-31',
          'response-raw-field-38',
          'response-raw-field-39',
          'response-raw-field-42',
          'response-raw-field-44',
          'response-raw-field-45',
          'response-raw-field-51',
          'response-raw-field-54',
          'response-raw-field-6',
          'response-raw-field-7',
          'response-raw-field-8',
          'response-raw-field-10',
          'response-raw-field-25',
          'response-raw-field-30',
          'response-raw-field-33',
          'response-raw-field-35',
          'response-raw-field-36',
          'response-raw-field-41',
          'response-raw-field-47',
          'response-raw-field-49',
          'response-raw-field-53',
          'response-raw-field-57',
          'response-raw-continuation',
          'response-raw-disconnect',
          'response-raw-title',
          'response-raw-routing',
          'response-raw-attribution',
          'response-raw-history',
          'response-raw-quota',
          'response-raw-heartbeat',
          'response-raw-string',
          'response-raw-enum',
          'response-raw-client',
          'response-raw-supplement',
          'response-candidate-lists',
          'response-candidate-extra',
          'response-final-metadata',
          'response-answer',
          'response-content',
          'history',
          'cleanup',
          'interrupted',
        ].includes(cause as string)
      )
        return cause as GeminiFixedTextTrialReason;
    } catch {}
    return fallback;
  }
  function cancel(subscription: object | undefined) {
    if (!subscription || retired.has(subscription)) return;
    if (nativeDispatch?.receiving()) {
      pendingCancellations.add(subscription);
      deferCleanup();
      return;
    }
    pendingCancellations.delete(subscription);
    retired.add(subscription);
    const teardown = teardowns.get(subscription);
    require(teardown && method(subscription, 'unsubscribe') === teardown, 'cleanup');
    Reflect.apply(teardown, subscription, []);
  }
  function deferCleanup(stopped = false) {
    if (!nativeDispatch?.receiving()) return false;
    cleanupPending ||= stopped;
    if (!cleanupQueued) {
      cleanupQueued = true;
      queueMicrotask(() => {
        try {
          if (cleanupPending || terminal) {
            finishStoppedCleanup();
          } else {
            try {
              for (const subscription of pendingCancellations) cancel(subscription);
            } catch {
              cleanupUnsafe = true;
              stop('cleanup');
            }
          }
        } finally {
          cleanupQueued = false;
        }
      });
    }
    return true;
  }
  function cleanup() {
    closed = true;
    cleanupPending = true;
    let failed = cleanupUnsafe;
    try {
      dispatch?.close();
    } catch {
      cleanupUnsafe = failed = true;
    }
    if (deferCleanup(true)) return;
    try {
      operation.abort();
    } catch {
      failed = true;
    }
    if (timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
    for (const [owner, type, callback] of listeners.splice(0)) {
      try {
        owner.removeEventListener(type, callback, true);
      } catch {
        failed = true;
      }
    }
    for (const subscription of [inner, builder, ...observations]) {
      try {
        cancel(subscription);
      } catch {
        failed = true;
      }
    }
    observations.clear();
    try {
      receipt?.close();
    } catch {
      failed = true;
    }
    try {
      dispatch?.detach();
    } catch {
      failed = true;
    }
    if (failed) cleanupUnsafe = true;
    cleanupPending = false;
    require(!failed, 'cleanup');
  }
  function finishStoppedCleanup() {
    try {
      cleanup();
    } catch {
      if (!nativeDispatch || !terminal) terminal = failure('cleanup');
    }
    if (terminal) rejectPending?.(terminal);
  }
  function stop(cause: GeminiFixedTextTrialReason) {
    if (closed) return;
    terminal = failure(cause);
    closed = true;
    try {
      dispatch?.close();
    } catch {
      cleanupUnsafe = true;
    }
    if (!deferCleanup(true)) finishStoppedCleanup();
  }
  function listen(owner: EventTarget, type: string, callback: EventListener) {
    owner.addEventListener(type, callback, true);
    listeners.push([owner, type, callback]);
  }
  try {
    require(signal instanceof AbortSignal && typeof current === 'function', 'interrupted');
    require(bindRetirement === undefined || typeof bindRetirement === 'function');
    require(window.top === window && location.href === home, 'page');
    const doc = document;
    listen(signal, 'abort', () => stop('interrupted'));
    for (const type of ['pagehide', 'popstate', 'hashchange'])
      listen(window, type, () => stop('interrupted'));
    for (const type of ['beforeinput', 'input', 'change', 'paste', 'drop'])
      listen(doc, type, () => stop('interrupted'));
    for (const type of ['pointerdown', 'keydown', 'click'])
      listen(doc, type, (event) => {
        if (event.isTrusted) stop('interrupted');
      });
    function lease() {
      require(!closed && !signal.aborted, 'interrupted');
      let valid = false;
      try {
        valid = current() === true;
      } catch {
        throw failure('interrupted');
      }
      require(!closed &&
        !signal.aborted &&
        valid &&
        document === doc &&
        window.top === window, 'interrupted');
    }
    lease();
    setupStage = 'capture-readiness';
    // This experimental trial supports only the primary header-glow projection.
    const ui = await geminiReadiness(operation.signal, true);
    lease();
    setupStage = 'capture-bindings';
    let client: GeminiOwnedClient | undefined;
    const capability = readGeminiClientCapability((value) => {
      require(!client, 'client-initial');
      client = value;
    });
    const profile =
      capability.status === 'unsupported'
        ? capability.reason === 'transport-rpc'
          ? 'rpc'
          : capability.reason === 'transport-webchannel'
            ? 'cold-webchannel'
            : undefined
        : undefined;
    if (!client || !profile)
      throw failure(
        capability.status === 'unsupported' && typeof capability.reason === 'string'
          ? reason({ cause: `client-initial-${capability.reason}` }, 'client-initial')
          : 'client-initial',
      );
    const captured = Object.freeze({ ...client });
    const { namespace, conversation, api, host, owner, consumer } = captured;
    const nativeSession = profile === 'cold-webchannel' ? own(api, 'ub') : undefined;
    const nativeRegistry = profile === 'cold-webchannel' ? own(api, 'Eb') : undefined;
    let nativeFactoryDescriptor: PropertyDescriptor | undefined;
    let nativeGateDescriptor: PropertyDescriptor | undefined;
    const emptyRepeatedField = own(namespace, 'Yd');
    const repeatedFieldFlag = own(namespace, 'La');
    setupStage = 'capture-editor';
    const editor = composer('gemini');
    require(editor &&
      editor.ownerDocument === doc &&
      editor.isConnected &&
      !draftText(editor), 'capture');
    const editorElement = editor;
    setupStage = 'capture-bindings';
    receipt = await captureGeminiTrialModel(captured, ui, operation.signal);
    lease();
    const modeReceipt = receipt;
    function prototype(name: string): object {
      const value = own(callable(own(namespace, name)), 'prototype');
      require(value !== null && typeof value === 'object');
      return value;
    }
    const observablePrototype = prototype('st');
    const subscriptionPrototype = prototype('qt');
    const continuationConstructor = callable(own(namespace, 'yL'));
    const continuationPrototype = own(continuationConstructor, 'prototype');
    require(continuationPrototype !== null && typeof continuationPrototype === 'object');
    function continuationCurrent() {
      require(
        own(namespace, 'yL') === continuationConstructor &&
          own(continuationConstructor, 'prototype') === continuationPrototype,
      );
    }
    const subscribe = callable(own(observablePrototype, 'subscribe'));
    unsubscribe = callable(own(subscriptionPrototype, 'unsubscribe'));
    const observable = callable(own(namespace, 'st'));
    const ln = prototype('GN'),
      hl = prototype('pM'),
      storePrototype = prototype('tC');
    const protectionPrototype = prototype('bM');
    require(Object.getPrototypeOf(conversation) === ln && Object.getPrototypeOf(api) === hl);
    const protection = own(api, 'Ja');
    require(protection &&
      Object.getPrototypeOf(protection) === protectionPrototype &&
      own(protection, 'isEnabled') === true, 'client-protection');
    const store = own(conversation, 'store');
    require(store && Object.getPrototypeOf(store) === storePrototype);
    const state = callable(own(store, 'state'));
    const source = own(store, 'source');
    const statePrototype = prototype('gu');
    const storeIdSelector = callable(own(namespace, 'AC'));
    const threadSelector = callable(own(namespace, 'wC'));
    function freshStore() {
      require(source && typeof source === 'object' && !Object.hasOwn(source, 'subscribe'));
      let at = Object.getPrototypeOf(source),
        depth = 0;
      while (at !== statePrototype && at) {
        require(++depth <= 12);
        at = Object.getPrototypeOf(at);
      }
      require(
        at === statePrototype &&
          own(conversation, 'store') === store &&
          own(store, 'source') === source &&
          own(store, 'state') === state &&
          own(source, 'state') === state &&
          own(namespace, 'AC') === storeIdSelector &&
          own(namespace, 'wC') === threadSelector &&
          ['closed', 'Ys', 'hasError'].every((key) => own(source, key) === false),
      );
    }
    function currentStore() {
      freshStore();
      const root = Reflect.apply(state, store, []);
      const storeId = Reflect.apply(storeIdSelector, undefined, [root]);
      const cid = own(Reflect.apply(threadSelector, undefined, [root]), 'conversationId');
      freshStore();
      require(approved &&
        storeId === approved.storeId &&
        typeof cid === 'string' &&
        (cid === '' || cid === ownedCid), 'capture-current');
    }
    // The source signal remains readable after completion; refuse its retained stale value.
    bindRetirement?.(() => {
      try {
        if (
          cleanupQueued ||
          cleanupPending ||
          cleanupUnsafe ||
          nativeDispatch?.receiving() ||
          document !== doc ||
          window.top !== window ||
          composer('gemini') !== editorElement ||
          !editorElement.isConnected ||
          editorElement.ownerDocument !== doc ||
          draftText(editorElement)
        )
          return false;
        const expectedUrl =
          (marker || rawFinal) && !final && location.href === home
            ? home
            : ownedCid
              ? home + '/' + ownedCid.slice(2)
              : home;
        let recaptured: GeminiOwnedClient | undefined;
        readGeminiClientCapability((value) => {
          require(!recaptured, 'client');
          recaptured = value;
        }, expectedUrl);
        require(
          recaptured &&
            Object.keys(captured).every((key) => own(recaptured, key) === own(captured, key)),
        );
        currentStore();
        require(
          document === doc &&
            window.top === window &&
            location.href === expectedUrl &&
            composer('gemini') === editorElement &&
            editorElement.isConnected &&
            editorElement.ownerDocument === doc &&
            !draftText(editorElement) &&
            host.isConnected &&
            owner.isConnected &&
            host.ownerDocument === doc &&
            owner.ownerDocument === doc &&
            own(consumer, 'Oa') === conversation &&
            own(conversation, 'ha') === api &&
            own(conversation, 'store') === store &&
            own(api, 'Ja') === protection &&
            own(protection, 'isEnabled') === true,
        );
        return true;
      } catch {
        return false;
      }
    });

    for (const [value, name] of [
      [conversation, 'sendRequest'],
      [conversation, 'Vg'],
      [api, 'Zxb'],
    ] as const)
      require(!Object.hasOwn(value, name));
    const send = callable(own(ln, 'sendRequest')),
      nextId = callable(own(ln, 'Vg')),
      oub = callable(own(hl, 'Zxb'));
    const streams = Object.fromEntries(
      ['oa', 'ka', 'Qe', 'Oe', 'Jb', 'kKa', 'ri', 'cHa', 'Va', 'Ug', 'Ti'].map((name) => [
        name,
        own(conversation, name),
      ]),
    );
    setupStage = 'capture-actions';
    const types = Object.fromEntries(
      [
        '$Kd',
        'aLd',
        'jLd',
        'mM',
        'XKd',
        'nLd',
        'oLd',
        'NKd',
        'YKd',
        'uLd',
        'wLd',
        'gLd',
        'WKd',
        'pLd',
        'tLd',
        'rLd',
        'qLd',
        'kMd',
        'fMd',
        'dMd',
      ].map((name) => {
        const creator = callable(own(namespace, name));
        const type = own(creator, 'type');
        require(typeof type === 'string' && type.length <= 160);
        return [name, type];
      }),
    );
    require(new Set(Object.values(types)).size === Object.keys(types).length);
    function normal(
      value: unknown,
      expected: object,
      shadow: string,
      cause: GeminiFixedTextTrialReason = 'capture',
    ): value is object {
      require(value !== null && typeof value === 'object' && !Object.hasOwn(value, shadow), cause);
      let found = false,
        depth = 0;
      for (
        let at: object | null = Object.getPrototypeOf(value);
        at;
        at = Object.getPrototypeOf(at)
      ) {
        require(++depth <= 12, cause);
        if (at === expected) found = true;
      }
      require(found, cause);
      return true;
    }
    const latest: Record<string, unknown> = Object.create(null);
    let approved: ApprovedGeminiTrial | undefined;
    let actualPacket: unknown;
    let packet: Record<string, unknown> | undefined;
    let initialRequest: Record<string, unknown> | undefined;
    let installed = false;
    function ownedConversation() {
      if (!approved) return;
      try {
        const cid = record(latest.ka).conversationId;
        require(typeof cid === 'string' && (cid === '' || cid === ownedCid), 'capture-current');
      } catch {
        throw failure('capture-current');
      }
    }
    function disconnectPayload(
      value: unknown,
      cause: GeminiFixedTextTrialReason = 'response-event-3',
    ) {
      require(value !== null &&
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === Object.prototype &&
        Reflect.ownKeys(value).length === 0, cause);
    }
    function disconnectCurrent() {
      if (!disconnect) return;
      try {
        const actual = record(disconnectSource);
        require(Object.keys(actual).length === 4 &&
          Object.keys(disconnect).every(
            (key) => Object.hasOwn(actual, key) && actual[key] === disconnect![key],
          ), 'response-event-3');
        disconnectPayload(disconnect.BFc);
      } catch {
        throw failure('response-event-3');
      }
    }
    function readCurrent(checkModel = true) {
      routingCurrent();
      lease();
      routingCurrent();
      continuationCurrent();
      disconnectCurrent();
      require(composer('gemini') === editorElement &&
        editorElement.isConnected &&
        editorElement.ownerDocument === doc &&
        !draftText(editorElement), 'capture');
      require(host.isConnected &&
        owner.isConnected &&
        host.ownerDocument === doc &&
        owner.ownerDocument === doc, 'client-current');
      require(own(consumer, 'Oa') === conversation &&
        own(conversation, 'ha') === api &&
        own(conversation, 'store') === store &&
        own(api, 'Ja') === protection &&
        own(protection, 'isEnabled') === true, 'client-current');
      require(Object.getPrototypeOf(conversation) === ln &&
        Object.getPrototypeOf(api) === hl &&
        Object.getPrototypeOf(protection) === protectionPrototype, 'client-current');
      require(
        own(namespace, 'st') === observable &&
          own(observablePrototype, 'subscribe') === subscribe &&
          own(subscriptionPrototype, 'unsubscribe') === unsubscribe,
      );
      require(
        own(ln, 'sendRequest') === send &&
          own(ln, 'Vg') === nextId &&
          own(hl, 'Zxb') === oub &&
          !Object.hasOwn(conversation, 'sendRequest') &&
          !Object.hasOwn(conversation, 'Vg'),
      );
      if (installed) require(own(api, 'Zxb') === gate, 'dispatch-binding');
      for (const name of Object.keys(streams))
        require(own(conversation, name) === streams[name], 'capture');
      if (approved) {
        ownedConversation();
        require(latest.oa === approved.storeId &&
          latest.kKa === approved.isPersonalContextDisabled, 'capture');
        require(latest.cHa === '' && latest.Va === undefined && latest.Ug === 0, 'capture');
      }
      const expectedUrl =
        location.href === home
          ? home
          : ownedCid
            ? 'https://gemini.google.com/app/' + ownedCid.slice(2)
            : home;
      require(location.href === expectedUrl, 'page');
      if (expectedUrl !== home) require(approved && latest.oa === approved.storeId, 'capture');
      let recaptured: GeminiOwnedClient | undefined;
      const status = readGeminiClientCapability((value) => {
        require(!recaptured, 'client-current');
        recaptured = value;
      }, expectedUrl);
      require(status.status === 'unsupported' &&
        status.reason ===
          (profile === 'rpc' ? 'transport-rpc' : installed ? 'hook' : 'transport-webchannel') &&
        recaptured &&
        Object.keys(captured).every(
          (key) => own(recaptured, key) === own(captured, key),
        ), 'client-current');
      if (profile === 'cold-webchannel') {
        require(own(api, 'Aa') === true &&
          own(api, 'ub') === nativeSession &&
          own(nativeSession, 'oa') === false &&
          own(api, 'Eb') === nativeRegistry &&
          Object.isExtensible(api), 'client-current');
        if (installed) {
          for (const [value, key, retained] of [
            [api, 'Zxb', nativeGateDescriptor],
            [namespace, 'dKd', nativeFactoryDescriptor],
          ] as const) {
            const descriptor = Object.getOwnPropertyDescriptor(value, key);
            require(descriptor &&
              retained &&
              'value' in descriptor &&
              typeof descriptor.value === 'function' &&
              descriptor.writable === true &&
              descriptor.configurable === true &&
              ['value', 'writable', 'configurable', 'enumerable', 'get', 'set'].every(
                (field) => own(descriptor, field) === own(retained, field),
              ), 'client-current');
          }
        }
      }
      if (checkModel && !marker && !final && !rawFinal) require(modeReceipt.current(), 'model');
      if (packet && approved) {
        const admittedPacket = packet;
        assertGeminiTrialPacket(namespace, actualPacket, approved);
        require(['request', 'g8a', 'h8a'].every(
          (key) => own(actualPacket, key) === admittedPacket[key],
        ), 'packet');
      }
      lease();
      routingCurrent();
      continuationCurrent();
      disconnectCurrent();
    }
    function active(checkModel = true) {
      try {
        readCurrent(checkModel);
      } catch (error) {
        const cause = reason(error, 'capture');
        throw failure(cause === 'capture' ? 'capture-current' : cause);
      }
    }
    const poll = () => {
      try {
        active();
        nativeDispatch?.identity();
      } catch (error) {
        stop(reason(error, 'capture'));
      }
    };
    timer = setInterval(poll, 100);
    function empty(value: unknown) {
      if (value === undefined || value === null) return true;
      // RJd's Gk getter can return the SDK's frozen, flagged empty repeated field.
      if (value === emptyRepeatedField) {
        require(own(namespace, 'Yd') === emptyRepeatedField &&
          own(namespace, 'La') === repeatedFieldFlag &&
          typeof repeatedFieldFlag === 'symbol' &&
          Array.isArray(value) &&
          Object.getPrototypeOf(value) === Array.prototype &&
          Object.isFrozen(value) &&
          own(value, 'length') === 0, 'response');
        const flag = Object.getOwnPropertyDescriptor(value, repeatedFieldFlag);
        const keys = Reflect.ownKeys(value);
        require(flag &&
          'value' in flag &&
          flag.value === 7 &&
          flag.enumerable === true &&
          flag.writable === false &&
          flag.configurable === false &&
          keys.length === 2 &&
          keys.every((key) => key === 'length' || key === repeatedFieldFlag), 'response');
        return true;
      }
      return list(value).length === 0;
    }
    function emptyProjected(value: unknown) {
      if (
        value === emptyRepeatedField ||
        !Array.isArray(value) ||
        own(value, 'length') !== 0 ||
        Reflect.ownKeys(value).length === 1
      )
        return empty(value);
      // Only RJd.z5a: immutable Gk preserves a present empty field instead of using Eb.
      require(own(namespace, 'Yd') === emptyRepeatedField &&
        own(namespace, 'La') === repeatedFieldFlag &&
        typeof repeatedFieldFlag === 'symbol' &&
        Object.getPrototypeOf(value) === Array.prototype &&
        Object.isFrozen(value), 'response-turn');
      const flag = Object.getOwnPropertyDescriptor(value, repeatedFieldFlag);
      const keys = Reflect.ownKeys(value);
      require(flag &&
        'value' in flag &&
        flag.value === 7 &&
        flag.enumerable === true &&
        flag.writable === false &&
        flag.configurable === false &&
        keys.length === 2 &&
        keys.every((key) => key === 'length' || key === repeatedFieldFlag), 'response-turn');
      return true;
    }
    function agree(left: CompletedGeminiTrial, right: CompletedGeminiTrial) {
      require(['conversationId', 'turnId', 'candidateId', 'answer'].every(
        (key) => own(left, key) === own(right, key),
      ), 'response-identity');
      for (const key of ['Zzb', 'Eka', 'tZa', 'thinkingLevel', 'Cq', 'Hj', 'regionCode'] as const) {
        const canonical = (value: unknown) =>
          key === 'Zzb'
            ? value === true
            : key === 'tZa' && value === 'MODE_CATEGORY_UNSPECIFIED'
              ? undefined
              : key === 'thinkingLevel' && value === 'THINKING_LEVEL_STANDARD'
                ? undefined
                : value || undefined;
        require(canonical(left[key]) === canonical(right[key]), 'response-final-metadata');
      }
    }
    function bindIds(cid: unknown, rid: unknown, required = false) {
      require(!required || (cid !== undefined && rid !== undefined), 'response-identity');
      if (nativeDispatch) {
        require(nativeFrame && nativeDispatch.projecting(nativeFrame), 'response-identity');
        const identity = nativeFrame.identity;
        require((cid === undefined ||
          (identity.cidOrigin === 'server' && cid === identity.conversationId)) &&
          (rid === undefined || rid === identity.turnId), 'response-identity');
        if (rid !== undefined && ownedTurnId && ownedTurnId !== rid)
          require(!final &&
            !rawFinal &&
            !marker &&
            nativeFrame.ridEvidence === 'this-server-frame' &&
            routings.every((pending) => pending.action) &&
            !routingForwarding &&
            !pairedActionInFlight &&
            !continuations.length &&
            !disconnectPending, 'response-identity');
      }
      if (cid !== undefined) {
        require(typeof cid === 'string' &&
          /^c_[0-9a-fA-F]{1,16}$/.test(cid) &&
          (!ownedCid || ownedCid === cid), 'response-identity');
        ownedCid = cid;
      }
      if (rid !== undefined) {
        require(typeof rid === 'string' &&
          (nativeDispatch
            ? id(rid)
            : /^r_[0-9a-fA-F]{1,16}$/.test(rid) &&
              (!ownedTurnId || ownedTurnId === rid)), 'response-identity');
        ownedTurnId = rid;
      }
      currentStore();
      active(false);
    }
    function readRequest(value: unknown) {
      require(approved && initialRequest, 'response');
      const r = record(value);
      require(r.ze === approved.storeId &&
        r.clientTurnId === approved.clientTurnId &&
        r.textQuery === GEMINI_FIXED_TEXT_TRIAL_PROMPT &&
        r.wi === approved.modeId, 'response');
      require(typeof r.conversationId === 'string' &&
        /^c_[0-9a-fA-F]{1,16}$/.test(r.conversationId), 'response');
      require(!ownedCid || ownedCid === r.conversationId, 'response');
      for (const key of Object.keys(r))
        require(Object.hasOwn(initialRequest, key) ||
          ['R2', 'Ie', 'rZb'].includes(key), 'response');
      for (const key of Object.keys(initialRequest))
        if (key !== 'conversationId') require(r[key] === initialRequest[key], 'response');
      require(r.R2 === '' && empty(r.Ie) && empty(r.rZb), 'response');
      return r;
    }
    function request(value: unknown) {
      try {
        return readRequest(value);
      } catch {
        throw failure('response-request');
      }
    }
    function projected(value: unknown): CompletedGeminiTrial | undefined {
      let stage: GeminiFixedTextTrialReason = 'response-envelope-record';
      try {
        const t = record(value);
        stage = 'response-envelope-kind';
        require(t.responseType === 'TURN' && t.xj === false, 'response');
        stage = 'response-envelope-keys';
        for (const key of Object.keys(t))
          require([
            'responseType',
            'request',
            'response',
            'xj',
            'Ita',
            'ajb',
            'iga',
            'LJb',
            'MJb',
            'mia',
            'zj',
          ].includes(key), 'response');
        for (const [key, metadataStage] of [
          ['Ita', 'response-envelope-meta-1'],
          ['ajb', 'response-envelope-meta-2'],
          ['iga', 'response-envelope-meta-3'],
          ['LJb', 'response-envelope-meta-4'],
          ['MJb', 'response-envelope-meta-5'],
          ['mia', 'response-envelope-meta-6'],
          ['zj', 'response-envelope-meta-7'],
        ] as const) {
          stage = metadataStage;
          require(t[key] === undefined || t[key] === false, 'response');
        }
        const r = request(t.request);
        stage = 'response-record';
        const p = record(t.response);
        stage = 'response-identity';
        require(typeof p.turnId === 'string' &&
          (nativeDispatch ? id(p.turnId) : /^r_[0-9a-fA-F]{1,16}$/.test(p.turnId)), 'response');
        stage = 'response-lists';
        for (const key of ['No', 'K9', 'taa', 'xB']) require(empty(p[key]), 'response');
        require(emptyProjected(p.a8a), 'response-turn');
        stage = 'response-flags';
        for (const [key, flagStage] of [
          ['JL', 'response-flag-1'],
          ['W7', 'response-flag-2'],
          ['Hrg', 'response-flag-3'],
          ['Fnf', 'response-flag-4'],
          ['z7b', 'response-flag-5'],
          ['aZd', 'response-flag-6'],
          ['Cs', 'response-flag-7'],
          ['iDb', 'response-flag-8'],
        ] as const) {
          stage = flagStage;
          require(p[key] === undefined ||
            p[key] === false ||
            ((key === 'W7' || key === 'iDb') && p[key] === true), 'response');
        }
        stage = 'response-extra';
        require(Object.keys(p).every((key) =>
          [
            'turnId',
            'draft',
            'jof',
            'yIa',
            'lI',
            'Mx',
            'No',
            'isFinal',
            'JL',
            'K9',
            'regionCode',
            'Zr',
            'Ile',
            'Hrg',
            'bV',
            'W7',
            'taa',
            'Hof',
            'vS',
            'Fnf',
            'iV',
            'nPc',
            'Xc',
            'Vla',
            'PN',
            'iDb',
            'Ozc',
            'GAa',
            'O0a',
            'thinkingLevel',
            'Uo',
            'Lj',
            'z7b',
            'zbg',
            'a8a',
            'xB',
            'aZd',
            'Cs',
            'Soa',
          ].includes(key),
        ), 'response');
        for (const key of ['Mx', 'Zr', 'Ile', 'yIa', 'jof', 'zbg', 'nPc', 'Soa'])
          require(p[key] === undefined, 'response');
        stage = 'response-metadata';
        require(typeof p.isFinal === 'boolean', 'response');
        require(isGeminiTrialLanguage(p.bV) && isGeminiTrialAttribution(p.PN), 'response');
        stage = 'response-final-metadata';
        for (const key of ['Vla', 'O0a', 'thinkingLevel', 'Uo', 'Lj', 'regionCode'] as const) {
          const field = p[key];
          require(field === undefined ||
            (typeof field === 'string' &&
              field.length <= (key === 'regionCode' ? 32 : 160)), 'response');
        }
        stage = 'response-answer';
        if (p.draft === undefined) {
          require(!p.isFinal, 'response');
          return undefined;
        }
        const candidate = record(p.draft);
        require(id(candidate.id) &&
          (!observedCandidateId || candidate.id === observedCandidateId) &&
          (candidate.completeness === 'PARTIAL' ||
            candidate.completeness === 'COMPLETE'), 'response');
        const text = candidate.Z2;
        require(p.isFinal
          ? candidate.completeness === 'COMPLETE' && text === GEMINI_FIXED_TEXT_TRIAL_ANSWER
          : text === undefined ||
              text === '' ||
              (typeof text === 'string' &&
                text.length <= GEMINI_FIXED_TEXT_TRIAL_ANSWER.length &&
                GEMINI_FIXED_TEXT_TRIAL_ANSWER.startsWith(text)), 'response');
        stage = 'response-candidate-lists';
        for (const key of ['Yn', 'mI', 'r3g']) require(empty(candidate[key]), 'response');
        stage = 'response-candidate-extra';
        // Only the current source-owned outer candidate fields; Xc remains an opaque reference.
        require(Object.keys(candidate).every((key) =>
          [
            'id',
            'structuredContent',
            'Mmc',
            'Z2',
            'pLa',
            'KEc',
            'Ku',
            'jId',
            'r3g',
            'Xc',
            'completeness',
            'Yn',
            'safeMode',
            'k$d',
            'i1a',
            'H9d',
            'mI',
            'rPd',
            'Gaa',
            'vV',
            'oib',
            'm9d',
            'xSc',
            'IEc',
          ].includes(key),
        ), 'response');
        for (const [key, fields] of [['pLa', ['PUb', 'LRa']]] as const) {
          if (candidate[key] === undefined) continue;
          const metadata = record(candidate[key]);
          require(Object.keys(metadata).every((field) =>
            fields.includes(field as never),
          ), 'response');
          for (const field of fields) require(empty(metadata[field]), 'response');
        }
        for (const key of ['Mmc', 'Ku', 'rPd', 'k$d', 'oib', 'Gaa', 'vV', 'IEc'])
          require(candidate[key] === undefined, 'response');
        stage = 'response-content';
        const content = record(candidate.structuredContent);
        require(Object.keys(content).every((key) => key === 'children'), 'response');
        const children = list(content.children, 1);
        require(children.length === (text === undefined || text === '' ? 0 : 1), 'response');
        if (children.length) {
          const node = record(children[0]);
          require(Object.keys(node).every((key) => key === 'nodeType' || key === 'text') &&
            node.nodeType === 18 &&
            node.text === text, 'response');
        }
        observedCandidateId = candidate.id;
        if (!p.isFinal) return undefined;
        const result: CompletedGeminiTrial = {
          conversationId: r.conversationId as string,
          turnId: p.turnId,
          candidateId: candidate.id,
          answer: GEMINI_FIXED_TEXT_TRIAL_ANSWER,
        };
        if (p.iDb !== undefined) result.Zzb = p.iDb as boolean;
        stage = 'response-final-metadata';
        for (const [sourceKey, receiptKey] of [
          ['Vla', 'Eka'],
          ['O0a', 'tZa'],
          ['thinkingLevel', 'thinkingLevel'],
          ['Uo', 'Cq'],
          ['Lj', 'Hj'],
          ['regionCode', 'regionCode'],
        ] as const) {
          const field = p[sourceKey];
          if (field !== undefined) result[receiptKey] = field as never;
        }
        return result;
      } catch (error) {
        throw failure(reason(error, stage) === 'response-request' ? 'response-request' : stage);
      }
    }
    function readContext(value: unknown) {
      const c = record(value),
        r = record(c.request);
      require(Object.keys(c).every((key) =>
        ['ze', 'request', 'eOa', 'w2a', 'Azb', 'bJa', 'GRd'].includes(key),
      ) &&
        c.eOa === undefined &&
        c.w2a === undefined, 'response');
      require(approved &&
        c.ze === approved.storeId &&
        r.clientTurnId === approved.clientTurnId &&
        r.textQuery === GEMINI_FIXED_TEXT_TRIAL_PROMPT &&
        r.wi === approved.modeId, 'response');
      require(c.Azb === false && c.bJa === false && c.GRd === false, 'response');
      if (r.conversationId === '') {
        require(!receivedTurn &&
          initialRequest &&
          Object.keys(r).length === Object.keys(initialRequest).length &&
          Object.keys(initialRequest).every(
            (key) => Object.hasOwn(r, key) && r[key] === initialRequest![key],
          ), 'response');
      } else request(c.request);
      require(approved && packet, 'response');
      assertGeminiTrialPacket(namespace, actualPacket, approved);
      return c;
    }
    function context(value: unknown) {
      try {
        return readContext(value);
      } catch (error) {
        throw failure(
          reason(error, 'response-action') === 'response-request'
            ? 'response-request'
            : 'response-action',
        );
      }
    }
    function routingEvent(value: unknown, raw: GeminiTrialRawObservation) {
      const event = record(value);
      const expected = {
        responseType: 'ROUTING',
        conversationId: raw.conversationId,
        turnId: raw.turnId,
        eqa: raw.routing!.epa,
        ...(raw.routing!.Kzd === undefined ? {} : { bFd: raw.routing!.Kzd }),
      };
      require(Object.keys(event).length === Object.keys(expected).length &&
        Object.keys(expected).every(
          (key) => Object.hasOwn(event, key) && event[key] === own(expected, key),
        ), 'response-event');
      return event;
    }
    function routingAction(pending: (typeof routings)[number]) {
      const witness = pending.action;
      require(witness, 'response-action');
      const action = record(witness.source);
      // A context admitted before TURN keeps its original request after TURN.
      const c = record(action.Wl);
      const r = record(c.request);
      for (const [fresh, snapshot] of [
        [action, witness.event],
        [c, witness.context],
        [r, witness.request],
      ] as const)
        require(Object.keys(fresh).length === Object.keys(snapshot).length &&
          Object.keys(snapshot).every(
            (key) => Object.hasOwn(fresh, key) && fresh[key] === snapshot[key],
          ), 'response-action');
      if (r.conversationId !== '') request(c.request);
      routingEvent(action.Xbd, pending.raw);
    }
    function routingCurrent() {
      for (const pending of routings) {
        if (pending.source) routingEvent(pending.source, pending.raw);
        if (pending.action) routingAction(pending);
      }
    }
    let resolveComplete: (() => void) | undefined;
    const completion = new Promise<void>((resolve, reject) => {
      resolveComplete = resolve;
      rejectPending = reject;
    });
    // Attach immediately: a synchronous stop must not create an unhandled rejection.
    void completion.catch(() => {});
    function finished() {
      if (closed) return;
      if (nativeDispatch?.receiving() || cleanupQueued) {
        if (!finishQueued) {
          finishQueued = true;
          queueMicrotask(() => {
            finishQueued = false;
            finished();
          });
        }
        return;
      }
      if (closed || (!final && !marker && !rawFinal) || !streamComplete || !actionSuccess) return;
      try {
        active(false);
        require(dispatch?.sent(), 'dispatch-handoff');
        require(routings.every((pending) => pending.action) &&
          !routingForwarding &&
          continuations.length === 0 &&
          !disconnectPending &&
          !pairedActionInFlight &&
          !rawFrameInFlight, 'response-action');
        resolveComplete?.();
      } catch (error) {
        stop(reason(error, 'response'));
      }
    }
    function observe(name: string, next: (value: unknown) => void) {
      try {
        const stream = streams[name];
        require(normal(stream, observablePrototype, 'subscribe'));
        const subscription = Reflect.apply(subscribe, stream, [
          {
            next(value: unknown) {
              if (closed) return;
              try {
                next(value);
              } catch (error) {
                const cause = reason(error, 'capture-observation');
                stop(cause === 'capture' ? 'capture-observation' : cause);
              }
            },
            error(value: unknown) {
              stop(reason(value, 'capture-observation'));
            },
            complete() {
              if (!closed) stop('capture-completion');
            },
          },
        ]);
        require(normal(subscription, subscriptionPrototype, 'unsubscribe'));
        teardowns.set(subscription, method(subscription, 'unsubscribe'));
        if (closed) cancel(subscription);
        else observations.add(subscription);
      } catch (error) {
        const cause = reason(error, 'capture-observation');
        throw failure(cause === 'capture' ? 'capture-observation' : cause);
      }
    }
    for (const name of ['oa', 'ka', 'Qe', 'Oe', 'kKa', 'ri', 'cHa', 'Va', 'Ug', 'Ti'])
      observe(name, (value) => {
        latest[name] = value;
        if (approved && latest.oa !== approved.storeId) stop('capture-store');
        if (name === 'ka') ownedConversation();
      });
    function initialState() {
      try {
        const initial = record(latest.ka),
          initialTurns = record(latest.Qe);
        require(id(latest.oa) &&
          initial.conversationId === '' &&
          initialTurns.id === '' &&
          list(initial.Hj).length === 0 &&
          Object.keys(record(initial.Wb)).length === 0 &&
          list(initialTurns.Wb).length === 0 &&
          latest.Oe === undefined &&
          initial.xu === undefined &&
          initial.saa === undefined &&
          initial.mG !== 2 &&
          initial.bG !== 2 &&
          empty(initial.YJ) &&
          initial.vNc !== true &&
          initial.isTemporaryChat !== true, 'capture');
        require(latest.kKa === undefined || typeof latest.kKa === 'boolean', 'capture');
        require(latest.ri === undefined &&
          latest.cHa === '' &&
          latest.Va === undefined &&
          latest.Ug === 0 &&
          latest.Ti === false, 'capture');
      } catch {
        throw failure('capture-state');
      }
    }
    initialState();
    active();
    setupStage = 'capture-request-id';
    const clientTurnId = Reflect.apply(nextId, conversation, []);
    require(id(clientTurnId));
    active();
    approved = Object.freeze({
      storeId: latest.oa as string,
      clientTurnId,
      ...modeReceipt.metadata,
      isPersonalContextDisabled: latest.kKa as boolean | undefined,
    });
    settingUp = false;
    observe('Jb', (value) => {
      let a: Record<string, unknown>;
      try {
        a = record(value);
      } catch {
        throw failure('capture-action');
      }
      const type = a.type;
      require(typeof type === 'string', 'response-action');
      if (type !== types.aLd) active();
      if (type === types.$Kd) {
        context(a.Wl);
      } else if (type === types.aLd) {
        const pending = routings.find((entry) => !entry.action);
        require(pending?.source &&
          pending.forwarded &&
          !pairedActionInFlight &&
          !rawFrameInFlight &&
          Object.keys(a).length === 3 &&
          Object.keys(a).every((key) => ['type', 'Xbd', 'Wl'].includes(key)) &&
          a.Xbd === pending.source, 'response-action');
        pairedActionInFlight = true;
        routingEvent(a.Xbd, pending.raw);
        const c = context(a.Wl);
        const r = record(c.request);
        pending.action = { source: value, event: a, context: c, request: r };
        active();
        require(!closed && routings.includes(pending), 'response-action');
        routingAction(pending);
        pairedActionInFlight = false;
      } else if (type === types.jLd) {
        context(a.Wl);
        require(final || marker || rawFinal, 'response-action');
        actionSuccess = true;
        finished();
      } else if (type === types.uLd) {
        require(Object.keys(a).length === 5 &&
          Object.keys(a).every((key) =>
            ['type', 'turnId', 'conversationId', 'Soa', 'Wl'].includes(key),
          ), 'response-action');
        const pending = continuations[0];
        require(pending &&
          !pairedActionInFlight &&
          ['turnId', 'conversationId', 'Soa'].every(
            (key) => a[key] === pending[key],
          ), 'response-action');
        pairedActionInFlight = true;
        context(a.Wl);
        active(false);
        const fresh = record(value);
        require(Object.keys(fresh).length === 5 &&
          Object.keys(a).every(
            (key) => Object.hasOwn(fresh, key) && fresh[key] === a[key],
          ), 'response-action');
        context(fresh.Wl);
        require(!closed && continuations[0] === pending, 'response-action');
        continuations.shift();
        pairedActionInFlight = false;
      } else if (type === types.wLd) {
        require(disconnect &&
          disconnectPending &&
          disconnectForwarding &&
          !pairedActionInFlight &&
          Object.keys(a).length === 5 &&
          Object.keys(a).every((key) =>
            ['type', 'turnId', 'conversationId', 'BFc', 'Wl'].includes(key),
          ) &&
          ['turnId', 'conversationId', 'BFc'].every(
            (key) => a[key] === disconnect![key],
          ), 'response-action');
        pairedActionInFlight = true;
        disconnectPayload(a.BFc);
        context(a.Wl);
        active(false);
        const fresh = record(value);
        require(Object.keys(fresh).length === 5 &&
          Object.keys(a).every(
            (key) => Object.hasOwn(fresh, key) && fresh[key] === a[key],
          ), 'response-action');
        context(fresh.Wl);
        disconnectPayload(a.BFc);
        disconnectPending = false;
        pairedActionInFlight = false;
      } else if (
        [
          types.mM,
          types.XKd,
          types.nLd,
          types.oLd,
          types.WKd,
          types.pLd,
          types.tLd,
          types.rLd,
          types.qLd,
          types.kMd,
          types.fMd,
          types.dMd,
          types.gLd,
        ].includes(type)
      )
        stop('response-action');
      else if ([types.NKd, types.YKd].includes(type)) {
        const c = record(a.VD),
          r = record(c.request);
        require(c.ze === approved!.storeId &&
          r.clientTurnId === approved!.clientTurnId, 'response-action');
      }
    });
    function gate(this: unknown, ...args: unknown[]) {
      try {
        active();
        require(this === api, 'dispatch-binding');
        require(started, 'dispatch-closed');
        require(!called, 'dispatch-spent');
        require(args.length === 1, 'dispatch-handoff');
        assertGeminiTrialPacket(namespace, args[0], approved!);
        actualPacket = args[0];
        packet = record(args[0]);
        initialRequest = record(packet.request);
        nativeDispatch?.bindPacket(actualPacket);
        called = true;
        let original: unknown;
        try {
          original = Reflect.apply(oub, api, args);
        } catch (error) {
          throw failure(reason(error, nativeDispatch ? 'dispatch-native-n25' : 'dispatch'));
        }
        nativeDispatch?.bindObservable(original);
        require(normal(
          original,
          observablePrototype,
          'subscribe',
          'dispatch-runtime-shape',
        ), 'dispatch-runtime-shape');
        return Reflect.construct(observable, [
          (destination: unknown) => {
            try {
              active();
              require(!subscribed, 'dispatch-spent');
              subscribed = true;
              require(normal(
                destination,
                subscriptionPrototype,
                'unsubscribe',
                'dispatch-runtime-shape',
              ), 'dispatch-runtime-shape');
              const next = method(destination, 'next'),
                error = method(destination, 'error'),
                complete = method(destination, 'complete');
              // Source subscribers inherit these methods; resolve only the admitted ht subscription chain.
              const observed = {
                next(value: unknown) {
                  if (closed) return;
                  try {
                    active();
                    require(!routingForwarding &&
                      !pairedActionInFlight &&
                      !rawFrameInFlight, 'response-action');
                    if (nativeDispatch)
                      require(nativeFrame &&
                        nativeDispatch.projecting(nativeFrame), 'response-event');
                    const event = record(value);
                    let routing: (typeof routings)[number] | undefined;
                    if (event.responseType === 'ROUTING') {
                      routing = routings.find((pending) => !pending.source);
                      require(routing &&
                        value !== null &&
                        typeof value === 'object' &&
                        !routingSources.has(value), 'response-event');
                      routingEvent(value, routing.raw);
                      routing.source = value;
                      routingSources.add(value);
                      routingForwarding = true;
                      bindIds(event.conversationId, event.turnId, true);
                    } else if (event.responseType === 'TURN') {
                      const r = request(event.request);
                      const result = projected(value);
                      const p = record(event.response);
                      bindIds(r.conversationId, p.turnId);
                      receivedTurn = true;
                      if (result) {
                        require(!final, 'response-turn');
                        if (rawFinal) agree(rawFinal, result);
                        final = Object.freeze(result);
                        dispatch!.close();
                      }
                    } else if (event.responseType === 'TURN_COMPLETED') {
                      require(!marker &&
                        Object.keys(event).length === 3 &&
                        Object.keys(event).every((key) =>
                          ['responseType', 'conversationId', 'turnId'].includes(key),
                        ) &&
                        Object.hasOwn(event, 'conversationId') &&
                        Object.hasOwn(event, 'turnId'), 'response-event');
                      bindIds(event.conversationId, event.turnId, true);
                      marker = Object.freeze({
                        kind: 'marker',
                        conversationId: ownedCid!,
                        turnId: ownedTurnId!,
                      });
                      dispatch!.close();
                    } else if (event.responseType === 'CONTINUATION_UPDATE') {
                      require(Object.keys(event).length === 4 &&
                        Object.keys(event).every((key) =>
                          ['responseType', 'conversationId', 'turnId', 'Soa'].includes(key),
                        ) &&
                        Object.hasOwn(event, 'conversationId') &&
                        Object.hasOwn(event, 'turnId') &&
                        event.Soa !== null &&
                        typeof event.Soa === 'object' &&
                        !Array.isArray(event.Soa) &&
                        Object.getPrototypeOf(event.Soa) === continuationPrototype &&
                        continuations.length < 128, 'response-event-2');
                      bindIds(event.conversationId, event.turnId, true);
                      continuations.push(event);
                    } else if (event.responseType === 'DISCONNECT') {
                      require(!disconnect && !pairedActionInFlight, 'response-disconnect-1');
                      require(marker || rawFinal, 'response-disconnect-2');
                      require(previousEvent?.responseType === 'CONTINUATION_UPDATE' &&
                        continuations.length === 0, 'response-disconnect-3');
                      require(Object.keys(event).length === 4 &&
                        Object.keys(event).every((key) =>
                          ['responseType', 'turnId', 'conversationId', 'BFc'].includes(key),
                        ), 'response-disconnect-4');
                      require(event.conversationId === previousEvent.conversationId &&
                        event.turnId === previousEvent.turnId, 'response-disconnect-5');
                      disconnectPayload(event.BFc, 'response-disconnect-6');
                      disconnect = event;
                      disconnectSource = value;
                      disconnectPending = true;
                      bindIds(event.conversationId, event.turnId, true);
                    } else {
                      require([
                        'TITLE_GENERATION',
                        'HISTORY_VERSION_UPDATE',
                        'CONSUME_GEMINI_QUOTA',
                        'BEST_MODE_FOR_NEXT_TURN',
                        'POST_HOC_ATTRIBUTION',
                      ].includes(event.responseType as string), event.responseType ===
                        'RECONNECT_TURN_ALREADY_EXISTS'
                        ? 'response-event-1'
                        : event.responseType === 'CONTINUATION_UPDATE'
                          ? 'response-event-2'
                          : event.responseType === 'DISCONNECT'
                            ? 'response-event-3'
                            : 'response-event');
                      bindIds(event.conversationId, event.turnId);
                    }
                    active(!!routing);
                    previousEvent = event;
                    if (event.responseType === 'DISCONNECT') disconnectForwarding = true;
                    if (routing) {
                      routingEvent(value, routing.raw);
                      routing.forwarded = true;
                    }
                    Reflect.apply(next, destination, [value]);
                    if (!closed) {
                      routingCurrent();
                      active(!!routing);
                    }
                    if (routing) routingForwarding = false;
                  } catch (caught) {
                    stop(reason(caught, 'response-stream'));
                  }
                },
                error(value: unknown) {
                  if (closed) return;
                  stop(reason(value, 'response-error'));
                  Reflect.apply(error, destination, [value]);
                },
                complete() {
                  if (closed) return;
                  try {
                    active(false);
                    require(final || marker || rawFinal, 'response-completion');
                    require(!routingForwarding &&
                      !pairedActionInFlight &&
                      !rawFrameInFlight, 'response-action');
                    Reflect.apply(complete, destination, []);
                    if (closed) return;
                    routingCurrent();
                    active(false);
                    if (closed) return;
                    streamComplete = true;
                    finished();
                  } catch (caught) {
                    stop(reason(caught, 'response-stream'));
                  }
                },
              };
              let subscription: unknown;
              if (nativeDispatch) {
                require(!consumingOriginalSubscription, 'dispatch-spent');
                consumingOriginalSubscription = true;
                try {
                  try {
                    subscription = Reflect.apply(subscribe, original, [observed]);
                  } catch (error) {
                    throw failure(
                      reason(error, nativeDispatch ? 'dispatch-native-n26' : 'dispatch'),
                    );
                  }
                } finally {
                  consumingOriginalSubscription = false;
                }
              } else {
                try {
                  subscription = Reflect.apply(subscribe, original, [observed]);
                } catch (error) {
                  throw failure(reason(error, nativeDispatch ? 'dispatch-native-n26' : 'dispatch'));
                }
              }
              if (nativeDispatch) {
                nativeDispatch.identity();
                require(subscription !== null &&
                  typeof subscription === 'object', 'dispatch-runtime-shape');
                let at = Object.getPrototypeOf(subscription),
                  depth = 0;
                while (at && at !== subscriptionPrototype) {
                  require(++depth <= 12, 'dispatch-runtime-shape');
                  at = Object.getPrototypeOf(at);
                }
                require(at === subscriptionPrototype, 'dispatch-runtime-shape');
              } else
                require(normal(
                  subscription,
                  subscriptionPrototype,
                  'unsubscribe',
                  'dispatch-runtime-shape',
                ), 'dispatch-runtime-shape');
              inner = subscription;
              teardowns.set(subscription, method(subscription, 'unsubscribe'));
              if (closed) cancel(inner);
              return () => {
                try {
                  dispatch?.close();
                  cancel(inner);
                } catch {
                  cleanupUnsafe = true;
                  stop('cleanup');
                  throw failure('cleanup');
                }
              };
            } catch (error) {
              stop(reason(error, 'dispatch'));
              throw terminal ?? failure('dispatch');
            }
          },
        ]);
      } catch (error) {
        stop(reason(error, 'dispatch'));
        throw terminal ?? failure('dispatch');
      }
    }
    function acceptRawObservation(observed: GeminiTrialRawObservation) {
      if (nativeDispatch) bindIds(observed.conversationId, observed.turnId);
      if (observed.routing) {
        require(routings.length < 128, 'response-action');
        routings.push({ raw: observed });
      }
      if (observed.completed) {
        require(!rawFinal, 'response-turn');
        if (final) agree(final, observed.completed);
        rawFinal = Object.freeze(observed.completed);
        dispatch!.close();
      }
      if (observed.candidateId !== undefined) {
        require(!observedCandidateId ||
          observedCandidateId === observed.candidateId, 'response-selected');
        observedCandidateId = observed.candidateId;
      }
      if (!nativeDispatch) bindIds(observed.conversationId, observed.turnId);
      active(false);
    }
    const rawObserver = {
      next(value: unknown) {
        if (closed) return;
        try {
          require(!rawFrameInFlight &&
            !pairedActionInFlight &&
            !routingForwarding, 'response-action');
          rawFrameInFlight = true;
          active();
          acceptRawObservation(readGeminiTrialRawFrame(namespace, value));
        } catch (error) {
          stop(reason(error, 'response'));
        } finally {
          rawFrameInFlight = false;
        }
      },
      error() {
        stop('dispatch-observation');
      },
    };
    if (profile === 'cold-webchannel') {
      nativeDispatch = armGeminiColdWebChannel(
        namespace,
        api,
        approved,
        () => {
          active();
          return !closed && !signal.aborted;
        },
        () => consumingOriginalSubscription,
        {
          next(frame) {
            if (closed) return;
            try {
              require(!rawFrameInFlight &&
                !pairedActionInFlight &&
                !routingForwarding, 'response-action');
              rawFrameInFlight = true;
              active();
              nativeFrame = frame;
              acceptRawObservation(frame.observation);
            } catch (error) {
              stop(reason(error, 'response'));
            } finally {
              rawFrameInFlight = false;
            }
          },
          control() {
            require(!closed && (final || rawFinal || marker), 'response-completion');
            require(routings.every((pending) => pending.action) &&
              !routingForwarding &&
              !continuations.length &&
              !disconnectPending &&
              !pairedActionInFlight &&
              !rawFrameInFlight, 'response-action');
            active(false);
          },
          error: rawObserver.error,
        },
      );
      dispatch = nativeDispatch;
      nativeFactoryDescriptor = Object.getOwnPropertyDescriptor(namespace, 'dKd');
    } else {
      dispatch = armGeminiRpcDispatch(
        namespace,
        api,
        () => {
          try {
            active();
            return !marker && !final && !rawFinal;
          } catch (error) {
            stop(reason(error, 'dispatch'));
            return false;
          }
        },
        rawObserver,
      );
    }
    require(Object.isExtensible(api) && !Object.hasOwn(api, 'Zxb'), 'dispatch-descriptor');
    Object.defineProperty(api, 'Zxb', { value: gate, configurable: true, writable: true });
    if (nativeDispatch) nativeGateDescriptor = Object.getOwnPropertyDescriptor(api, 'Zxb');
    installed = true;
    active();
    started = true;
    let returned: unknown;
    try {
      returned = Reflect.apply(send, conversation, [
        { textQuery: GEMINI_FIXED_TEXT_TRIAL_PROMPT, Rg: false, uh: false, clientTurnId },
      ]);
    } catch (error) {
      stop(reason(error, nativeDispatch ? 'dispatch-native-n27' : 'dispatch'));
      throw terminal ?? failure(nativeDispatch ? 'dispatch-native-n27' : 'dispatch');
    }
    try {
      require(normal(
        returned,
        subscriptionPrototype,
        'unsubscribe',
        'dispatch-runtime-shape',
      ), 'dispatch-runtime-shape');
      builder = returned;
      teardowns.set(returned, method(returned, 'unsubscribe'));
      if (closed) cancel(builder);
    } catch (error) {
      stop(reason(error, 'dispatch'));
      throw terminal ?? failure('dispatch');
    }
    await completion;
    require(!cleanupQueued && !closed, 'interrupted');
    active(false);
    require(routings.every((pending) => pending.action) &&
      !routingForwarding &&
      continuations.length === 0 &&
      !disconnectPending &&
      !pairedActionInFlight &&
      !rawFrameInFlight, 'response-action');
    const completed =
      final ??
      rawFinal ??
      Object.freeze({ ...marker!, ...(observedCandidateId ? { observedCandidateId } : {}) });
    const acceptedCompletion = nativeDispatch ? nativeDispatch.completion(completed) : completed;
    require(!cleanupQueued && !closed, 'interrupted');
    const answer = await readGeminiTrialHistory(
      namespace,
      api,
      approved,
      acceptedCompletion,
      operation.signal,
      () => {
        try {
          active(false);
          return true;
        } catch (error) {
          stop(reason(error, 'capture'));
          return false;
        }
      },
    );
    active(false);
    require(answer === GEMINI_FIXED_TEXT_TRIAL_ANSWER, 'history');
    cleanup();
    return Object.freeze({ model: modeReceipt.model, answer: GEMINI_FIXED_TEXT_TRIAL_ANSWER });
  } catch (error) {
    const cause = terminal
      ? reason(terminal, 'response')
      : reason(error, settingUp ? setupStage : 'capture');
    try {
      cleanup();
    } catch {
      if (!nativeDispatch || !terminal) throw failure('cleanup');
    }
    throw failure(!terminal && settingUp && cause === 'capture' ? setupStage : cause);
  }
}
