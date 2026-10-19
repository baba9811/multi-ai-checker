import { GEMINI_FIXED_TEXT_TRIAL_ANSWER } from '../../../application/gemini-fixed-text-trial';
import {
  assertGeminiTrialHistory,
  type ApprovedGeminiTrial,
  type GeminiTrialCompletion,
} from './fixed-text-contract';

// MAIN-only: one normal unary SDK read; no projection, subscription or retry.
export function readGeminiTrialHistory(
  namespace: unknown,
  actualHL: unknown,
  approved: ApprovedGeminiTrial,
  completed: GeminiTrialCompletion,
  signal: AbortSignal,
  current: () => boolean,
): Promise<typeof GEMINI_FIXED_TEXT_TRIAL_ANSWER> {
  return new Promise((resolve, reject) => {
    type Call = (this: unknown, ...args: unknown[]) => unknown;
    type Reason = 'history' | 'interrupted';
    const failure = (reason: Reason) =>
      new Error('Gemini trial history failed.', { cause: reason });
    let closed = false;
    let listening = false;
    const cancelled = new WeakSet<object>();
    let fetched: object | undefined;
    let inner: object | undefined;
    let cancel: Call | undefined;
    const watched: Array<[unknown, PropertyKey, unknown]> = [];
    const shapes: Array<[object, object | null, PropertyKey[]]> = [];
    function require(value: unknown): asserts value {
      if (!value) throw failure('history');
    }
    function own(value: unknown, key: PropertyKey): unknown {
      require(value !== null && (typeof value === 'object' || typeof value === 'function'));
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      require(!descriptor || 'value' in descriptor);
      return descriptor?.value;
    }
    function reason(error: unknown): Reason {
      try {
        if (own(error, 'cause') === 'interrupted') return 'interrupted';
      } catch {}
      return 'history';
    }
    function capture(value: unknown, key: PropertyKey): unknown {
      const result = own(value, key);
      watched.push([value, key, result]);
      return result;
    }
    function callable(value: unknown): Call {
      require(typeof value === 'function');
      return value as Call;
    }
    function source(value: unknown, expected: string): Call {
      const fn = callable(value);
      require(Function.prototype.toString.call(fn) === expected);
      return fn;
    }
    function exported(name: string) {
      return capture(namespace, name);
    }
    function prototype(name: string): object {
      const result = capture(callable(exported(name)), 'prototype');
      require(result !== null && typeof result === 'object');
      return result;
    }
    function exact(value: unknown, proto: object): value is object {
      return value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === proto;
    }
    function unshadowed(value: object, key: PropertyKey) {
      require(!Object.getOwnPropertyDescriptor(value, key));
    }
    function shape(value: object, allowed: PropertyKey[]) {
      const keys = Reflect.ownKeys(value);
      require(keys.length <= allowed.length && keys.every((key) => allowed.includes(key)));
      shapes.push([value, Object.getPrototypeOf(value), keys]);
    }
    function record(value: unknown, allowed: PropertyKey[]): Record<PropertyKey, unknown> {
      require(value !== null && typeof value === 'object');
      require(
        Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null,
      );
      shape(value, allowed);
      const result: Record<PropertyKey, unknown> = Object.create(null);
      for (const key of Reflect.ownKeys(value)) result[key] = capture(value, key);
      return result;
    }
    const boundedId = (value: unknown) =>
      typeof value === 'string' && !!value && value.length <= 160 && !/\s/.test(value);
    function cancelFetch() {
      let failed = false;
      for (const promise of [fetched, inner]) {
        if (promise && cancel && !cancelled.has(promise)) {
          cancelled.add(promise);
          try {
            Reflect.apply(cancel, promise, []);
          } catch {
            failed = true;
          }
        }
      }
      require(!failed);
    }
    function finish(cause?: Reason, answer?: typeof GEMINI_FIXED_TEXT_TRIAL_ANSWER) {
      if (closed) return;
      closed = true;
      try {
        if (listening) {
          listening = false;
          signal.removeEventListener('abort', onAbort);
        }
      } catch {
        cause = 'history';
      }
      if (cause) {
        try {
          cancelFetch();
        } catch {
          cause = 'history';
        }
      }
      if (cause) reject(failure(cause));
      else resolve(answer!);
    }
    const onAbort = () => finish('interrupted');
    try {
      require(typeof current === 'function' && signal instanceof AbortSignal);
      const aborted = Object.getOwnPropertyDescriptor(AbortSignal.prototype, 'aborted')?.get;
      require(typeof aborted === 'function');
      function active() {
        if (closed || Reflect.apply(aborted!, signal, [])) throw failure('interrupted');
        let valid = false;
        try {
          valid = current() === true;
        } catch {
          throw failure('interrupted');
        }
        if (closed || !valid || Reflect.apply(aborted!, signal, [])) throw failure('interrupted');
      }
      active();
      const a = record(approved, [
        'storeId',
        'clientTurnId',
        'modeId',
        'modeCategory',
        'Cq',
        'thinkingLevel',
        'Hj',
        'isPersonalContextDisabled',
      ]);
      for (const key of ['storeId', 'clientTurnId', 'modeId']) require(boundedId(a[key]));
      for (const key of ['modeCategory', 'Cq', 'thinkingLevel', 'Hj'])
        require(a[key] === undefined || boundedId(a[key]));
      require(
        a.isPersonalContextDisabled === undefined ||
          typeof a.isPersonalContextDisabled === 'boolean',
      );
      const markerCompletion = own(completed, 'kind') === 'marker';
      const c = record(
        completed,
        markerCompletion
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
      for (const key of ['conversationId', 'turnId']) require(boundedId(c[key]));
      if (markerCompletion) {
        if (Object.hasOwn(c, 'observedCandidateId')) require(boundedId(c.observedCandidateId));
      } else {
        require(boundedId(c.candidateId) && c.answer === GEMINI_FIXED_TEXT_TRIAL_ANSWER);
        require(c.Zzb === undefined || typeof c.Zzb === 'boolean');
        for (const key of ['Eka', 'tZa', 'thinkingLevel', 'Cq', 'Hj', 'regionCode'])
          require(
            c[key] === undefined ||
              (typeof c[key] === 'string' && c[key].length <= (key === 'regionCode' ? 32 : 160)),
          );
      }

      const hl = prototype('gM');
      require(exact(actualHL, hl));
      const oa = capture(actualHL, 'oa');
      require(oa !== null && typeof oa === 'object');
      const dataPrototype = Object.getPrototypeOf(oa);
      require(dataPrototype && Object.getPrototypeOf(dataPrototype) === Object.prototype);
      unshadowed(oa, 'fetch');
      const fetch = source(
        capture(dataPrototype, 'fetch'),
        'fetch(a,b=!0){return b?this.ka.then(()=>LZb(this.ha,a)):LZb(this.ha,a)}',
      );
      const fcPrototype = prototype('yK');
      const fc = capture(actualHL, 'Gc');
      require(exact(fc, fcPrototype));
      unshadowed(fc, 'Sr');
      const Mr = source(
        capture(fcPrototype, 'Sr'),
        'Sr(){if(this.Ha===void 0)throw Error("fk");return this.Ha}',
      );
      const theme = capture(fc, 'Ha');
      require(typeof theme === 'boolean');
      const requestSource = capture(actualHL, 'requestSource');
      require(
        typeof requestSource === 'number' &&
          Number.isInteger(requestSource) &&
          requestSource >= 0 &&
          requestSource <= 2147483647,
      );
      const KCc = capture(actualHL, 'AHc'),
        vd = capture(actualHL, 'yd');
      require(typeof KCc === 'boolean' && typeof vd === 'boolean');
      const baseMessage = prototype('l');
      const DEd = source(
        exported('eHd'),
        'class extends _.l{constructor(a){super(a)}ig(){return _.n(this,1)}getRequestSource(){return _.ti(this,4)}getClientCapabilities(a){return _.Fk(this,6,a)}}',
      );
      const dud = source(exported('RI'), 'class extends _.l{constructor(a){super(a)}}');
      require(
        Object.getPrototypeOf(own(DEd, 'prototype')) === baseMessage &&
          Object.getPrototypeOf(own(dud, 'prototype')) === baseMessage,
      );
      const hy = source(
        exported('Yy'),
        'class extends _.OYb{constructor(a){super(a);this[_.Kwa]="unary"}}',
      );
      const descriptorBase = prototype('OYb');
      const hyPrototype = own(hy, 'prototype');
      require(hyPrototype && Object.getPrototypeOf(hyPrototype) === descriptorBase);
      unshadowed(hyPrototype as object, 'getInstance');
      const getInstance = source(
        capture(descriptorBase, 'getInstance'),
        'getInstance(a){return new _.xxa(this,a,void 0,this[_.kl].E_b)}',
      );
      const requestPrototype = prototype('xxa');
      const promisePrototype = prototype('te');
      const then = source(
        capture(promisePrototype, 'then'),
        'function(a,b,c){return bha(this,(0,_.qe)(typeof a==="function"?a:null),(0,_.qe)(typeof b==="function"?b:null),c)}',
      );
      cancel = source(
        capture(promisePrototype, 'cancel'),
        'function(a){if(this.ha==0){let b=new _.xe(a);_.re(function(){eha(this,b)},this)}}',
      );
      capture(oa, 'ha');
      const initialized = capture(oa, 'ka');
      require(exact(initialized, promisePrototype) && Object.isExtensible(initialized));
      unshadowed(initialized, 'then');
      unshadowed(initialized, 'cancel');
      const setters: Record<string, Call> = {};
      for (const [name, profile] of Object.entries({
        Li: 'function(a,b,c,d){return _.Vh(a,b,_.Cpa(c),d)}',
        Gi: 'function(a,b,c){return _.Vh(a,b,c==null?c:_.Xg(c))}',
        Ni: 'function(a,b,c){return _.Vh(a,b,c==null?c:_.Vg(c))}',
        Ei: 'function(a,b,c,d){return _.Vh(a,b,c==null?c:_.aba(c),d)}',
        u5c: 'function(a,b){return _.Ei(a,1,b)}',
        xm: 'function(a,b,c){return _.ih(a,b,_.Vg,c,void 0,_.Wg)}',
        Gh: 'function(a,b,c,d,e){d=Qpa(d);_.Vh(a,c,d,e);d&&!_.Ra(d)&&_.Mg(a.fl);return a}',
      }))
        setters[name] = source(exported(name), profile);
      for (const name of ['Vh', 'Cpa', 'Vg', 'aba', 'Xg', 'ih', 'Wg', 'Ra', 'Mg'])
        callable(exported(name));
      const il = exported('jl'),
        jl = exported('kl'),
        kind = exported('Kwa');
      require(typeof il === 'symbol' && typeof jl === 'symbol' && typeof kind === 'symbol');
      const marker: symbol = il;
      const cna = exported('pna'),
        vna = exported('ina');
      const registry = exported('Ty'),
        metadata = exported('gHd');
      const definition = record(metadata, ['Ob', 'Rb', 'Qb', 'Pb', 'Ub', marker]);
      const responseClass = definition.Pb;
      require(
        typeof responseClass === 'function' &&
          definition.Ob === 'hNvQHb' &&
          definition.Rb === '/BardFrontendService.ListConversationTurns' &&
          definition.Qb === true &&
          definition.Ub === DEd &&
          definition[marker] === true,
      );
      let registered = own(registry, 'o_hNvQHb');
      function checkDescriptor(value: unknown) {
        const d = record(value, ['Ob', 'Rb', 'Qb', 'Pb', 'Ub', marker, 'E_b']);
        for (const key of ['Ob', 'Rb', 'Qb', 'Pb', 'Ub', marker])
          require(d[key] === definition[key]);
        const options = d.E_b;
        require(
          Array.isArray(options) &&
            Object.getPrototypeOf(options) === Array.prototype &&
            own(options, 'length') === 2,
        );
        shape(options, ['length', '0', '1']);
        capture(options, 'length');
        for (const [index, key, value] of [
          [0, cna, definition.Rb],
          [1, vna, true],
        ] as const) {
          const option = record(capture(options, String(index)), ['key', 'value']);
          require(option.key === key && option.value === value);
        }
      }
      checkDescriptor(registered);
      let installed = false;
      let initializationCaptured = false;
      let initializationRun = false;
      const initialize: Call = function (...args) {
        require(this === initialized && args.length === 1 && !initializationCaptured);
        live();
        const callback = source(args[0], '()=>LZb(this.ha,a)');
        initializationCaptured = true;
        const guarded: Call = function (...opaque) {
          live();
          require(!initializationRun);
          initializationRun = true;
          const result = Reflect.apply(callback, this, opaque);
          require(exact(result, promisePrototype));
          inner = result;
          unshadowed(inner, 'then');
          unshadowed(inner, 'cancel');
          if (closed) {
            cancelFetch();
            throw failure('interrupted');
          }
          live();
          return result;
        };
        return Reflect.apply(then, initialized, [guarded]);
      };
      function live() {
        active();
        require(exact(actualHL, hl) && exact(oa, dataPrototype) && exact(fc, fcPrototype));
        unshadowed(oa, 'fetch');
        unshadowed(fc, 'Sr');
        require(exact(initialized, promisePrototype));
        if (installed) {
          const binding = Object.getOwnPropertyDescriptor(initialized, 'then');
          require(
            binding &&
              binding.value === initialize &&
              binding.configurable &&
              binding.writable &&
              !binding.enumerable,
          );
        } else unshadowed(initialized, 'then');
        unshadowed(initialized, 'cancel');
        for (const [owner, key, value] of watched) require(own(owner, key) === value);
        for (const [owner, proto, keys] of shapes) {
          const currentKeys = Reflect.ownKeys(owner);
          require(
            Object.getPrototypeOf(owner) === proto &&
              currentKeys.length === keys.length &&
              keys.every((key, index) => key === currentKeys[index]),
          );
        }
        require(own(registry, 'o_hNvQHb') === registered);
      }
      live();
      listening = true;
      signal.addEventListener('abort', onAbort, { once: true });
      live();
      const request = Reflect.construct(DEd, []);
      function set(name: string, args: unknown[]) {
        live();
        Reflect.apply(setters[name]!, undefined, args);
        live();
      }
      set('Li', [request, 1, c.conversationId]);
      set('Gi', [request, 2, 2]);
      set('Li', [request, 3, undefined]);
      set('Ni', [request, 4, 1]);
      const device = Reflect.construct(dud, []);
      live();
      require(Reflect.apply(Mr, fc, []) === theme);
      set('u5c', [device, theme]);
      set('Gh', [request, dud, 5, device]);
      set('Ni', [request, 4, requestSource]);
      set('xm', [request, 6, 4]);
      if (KCc) set('xm', [request, 6, 12]);
      if (vd) set('Ei', [request, 8, true]);
      const descriptor = Reflect.construct(hy, [metadata]);
      require(exact(descriptor, hyPrototype as object) && own(descriptor, kind) === 'unary');
      registered = own(descriptor, jl);
      checkDescriptor(registered);
      live();
      const wrapper = Reflect.apply(getInstance, descriptor, [request]);
      require(
        exact(wrapper, requestPrototype) &&
          own(wrapper, 'rpcId') === descriptor &&
          own(wrapper, 'requestMessage') === request,
      );
      live();
      let returned: unknown;
      Object.defineProperty(initialized, 'then', {
        value: initialize,
        configurable: true,
        writable: true,
      });
      installed = true;
      try {
        returned = Reflect.apply(fetch, oa, [wrapper]);
        // Capture genuine teardown before a failed compare-owned restoration.
        if (exact(returned, promisePrototype)) fetched = returned;
      } finally {
        const binding = Object.getOwnPropertyDescriptor(initialized, 'then');
        require(
          binding &&
            binding.value === initialize &&
            binding.configurable &&
            binding.writable &&
            !binding.enumerable,
        );
        require(Reflect.deleteProperty(initialized, 'then'));
        installed = false;
        unshadowed(initialized, 'then');
      }
      require(initializationCaptured);
      require(exact(returned, promisePrototype));
      fetched = returned;
      unshadowed(fetched, 'then');
      unshadowed(fetched, 'cancel');
      if (closed) {
        cancelFetch();
        return;
      }
      live();
      let registering = true;
      let outcome: { raw?: unknown; error?: true } | undefined;
      function accept(raw: unknown) {
        if (closed) return;
        if (registering) {
          outcome = { raw };
          return;
        }
        try {
          live();
          const answer = assertGeminiTrialHistory(
            namespace,
            raw,
            a as unknown as ApprovedGeminiTrial,
            c as unknown as GeminiTrialCompletion,
          );
          live();
          finish(undefined, answer);
        } catch (error) {
          finish(reason(error));
        }
      }
      const child = Reflect.apply(then, fetched, [
        accept,
        (error: unknown) => {
          if (registering) outcome = { error: true, raw: reason(error) };
          else finish(reason(error));
        },
      ]);
      require(exact(child, promisePrototype));
      registering = false;
      if (closed) {
        cancelFetch();
        return;
      }
      live();
      if (outcome) {
        if (outcome.error) finish(outcome.raw === 'interrupted' ? 'interrupted' : 'history');
        else accept(outcome.raw);
      }
    } catch (error) {
      if (closed) {
        try {
          cancelFetch();
        } catch {}
      } else finish(reason(error));
    }
  });
}
