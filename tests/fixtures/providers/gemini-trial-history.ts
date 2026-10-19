import { geminiFixedTextContractFixture } from './gemini-fixed-text-contract';

// Public source profiles around wholly invented messages and unary promise behavior.
export function geminiTrialHistoryFixture() {
  const f = geminiFixedTextContractFixture();
  const _ = f.namespace;
  const calls = { fetch: 0, then: 0, cancel: 0, setters: [] as unknown[][] };
  let beforeSet = () => {};
  let beforeFetch = () => {};
  let beforeThen = () => {};
  let synchronous = false;
  let fetchError = false;
  let result: unknown = f.raw;
  let observer: { next: (raw: unknown) => void; error: (error: unknown) => void } | undefined;
  let observed: any;
  const failures = new WeakMap<object, unknown>();
  let active = true;
  let wrapper: any;
  let fetched: any;
  let ready: any;
  let deferReady = false;
  let readyThenError = false;
  const queued: Array<() => void> = [];
  _.jl = Symbol('synthetic-registered-descriptor');
  _.kl = Symbol('synthetic-descriptor-data');
  _.Kwa = Symbol('synthetic-kind');
  _.pna = { id: 'unobfuscatedRpcId' };
  _.ina = { id: 'frontendMethodType' };
  _.Ty = {};
  _.l = class {
    fl: unknown[] = [];
    constructor() {
      Object.defineProperty(this.fl, _.La, { value: 2144, writable: true });
    }
  };
  _.Vh = (message: any, field: number, value: unknown) => {
    beforeSet();
    calls.setters.push([message, field, value]);
    message.fl[field - 1] = value;
    return message;
  };
  _.bba = Number.isFinite;
  _.$aa = (value: unknown) => typeof value;
  _.ih = (message: any, field: number, _convert: unknown, value: unknown) => {
    beforeSet();
    calls.setters.push([message, field, value]);
    (message.fl[field - 1] ??= []).push(value);
    return message;
  };
  _.Wg = (value: unknown) => value;
  for (const [name, source] of Object.entries({
    Cpa: 'function(a){if(a!=null&&typeof a!=="string")throw Error();return a}',
    Vg: 'function(a){if(!(0,_.bba)(a))throw ipa("enum");return a|0}',
    Xg: 'function(a){if(typeof a!=="number")throw ipa("int32");if(!(0,_.bba)(a))throw ipa("int32");return a|0}',
    aba: 'function(a){if(typeof a!=="boolean")throw Error("D`"+_.$aa(a)+"`"+a);return a}',
    Li: 'function(a,b,c,d){return _.Vh(a,b,_.Cpa(c),d)}',
    Gi: 'function(a,b,c){return _.Vh(a,b,c==null?c:_.Xg(c))}',
    Ni: 'function(a,b,c){return _.Vh(a,b,c==null?c:_.Vg(c))}',
    Ei: 'function(a,b,c,d){return _.Vh(a,b,c==null?c:_.aba(c),d)}',
    u5c: 'function(a,b){return _.Ei(a,1,b)}',
    xm: 'function(a,b,c){return _.ih(a,b,_.Vg,c,void 0,_.Wg)}',
    Gh: 'function(a,b,c,d,e){d=Qpa(d);_.Vh(a,c,d,e);d&&!_.Ra(d)&&_.Mg(a.fl);return a}',
  }))
    _[name] = new Function('_', 'Qpa', 'ipa', 'return ' + source)(
      _,
      (value: unknown) => value,
      () => new Error('Synthetic primitive conversion failed.'),
    );
  _.Ra = () => true;
  _.Mg = () => {};
  _.eHd = new Function(
    '_',
    'return class extends _.l{constructor(a){super(a)}ig(){return _.n(this,1)}getRequestSource(){return _.ti(this,4)}getClientCapabilities(a){return _.Fk(this,6,a)}}',
  )(_);
  _.RI = new Function('_', 'return class extends _.l{constructor(a){super(a)}}')(_);
  _.gM = class {};
  _.yK = class {};
  _.yK.prototype.Sr = new Function(
    'return class {Sr(){if(this.Ha===void 0)throw Error("fk");return this.Ha}}',
  )().prototype.Sr;
  _.OYb = class {
    constructor(metadata: any) {
      (this as any)[_.kl] = {
        ...metadata,
        E_b: [
          { key: _.pna, value: metadata.Rb },
          { key: _.ina, value: metadata.Qb },
        ],
      };
      (this as any).ha = metadata.Ob;
      _.Ty['o_' + metadata.Ob] = (this as any)[_.kl];
    }
  };
  _.OYb.prototype.getInstance = new Function(
    '_',
    'return class {getInstance(a){return new _.xxa(this,a,void 0,this[_.kl].E_b)}}',
  )(_).prototype.getInstance;
  _.Yy = new Function(
    '_',
    'return class extends _.OYb{constructor(a){super(a);this[_.Kwa]="unary"}}',
  )(_);
  _.xxa = class {
    constructor(
      public rpcId: any,
      public requestMessage: any,
      public sideChannel = {},
      public options: unknown[] = [],
    ) {}
  };
  Object.assign((_.gHd = { Pb: Object.getPrototypeOf(f.raw).constructor }), {
    Ob: 'hNvQHb',
    Rb: '/BardFrontendService.ListConversationTurns',
    Qb: true,
    Ub: _.eHd,
  });
  _.gHd[_.jl] = true;
  new _.Yy(_.gHd);
  _.te = class {
    ha = 0;
  };
  _.qe = (value: unknown) => value;
  _.xe = class extends Error {};
  _.re = (callback: () => void, receiver: unknown) => callback.call(receiver);
  _.te.prototype.cancel = new Function(
    '_',
    'eha',
    'return function(a){if(this.ha==0){let b=new _.xe(a);_.re(function(){eha(this,b)},this)}}',
  )(_, (promise: any) => {
    calls.cancel++;
    promise.ha = 3;
  });
  _.te.prototype.then = new Function(
    '_',
    'bha',
    'return function(a,b,c){return bha(this,(0,_.qe)(typeof a==="function"?a:null),(0,_.qe)(typeof b==="function"?b:null),c)}',
  )(_, (promise: any, next: any, error: any) => {
    if (promise === ready) {
      if (readyThenError) throw new Error('SYNTHETIC_PRIVATE_MARKER');
      const child = new _.te();
      const run = () => {
        if (child.ha !== 0) return;
        try {
          next();
          child.ha = 1;
        } catch (failure) {
          child.ha = 3;
          failures.set(child, failure);
          observer?.error(failure);
        }
      };
      if (deferReady) {
        queued.push(run);
        return child;
      }
      run();
      return child;
    }
    calls.then++;
    observed = promise;
    observer = { next, error };
    beforeThen();
    if (failures.has(promise)) error(failures.get(promise));
    else if (synchronous) {
      promise.ha = 2;
      next(result);
    }
    return new _.te();
  });
  const Data = new Function(
    '_',
    'LZb',
    'return class {fetch(a,b=!0){return b?this.ka.then(()=>LZb(this.ha,a)):LZb(this.ha,a)}}',
  )(_, (_service: unknown, request: unknown) => {
    calls.fetch++;
    wrapper = request;
    beforeFetch();
    if (fetchError) throw new Error('SYNTHETIC_PRIVATE_MARKER');
    fetched = new _.te();
    return fetched;
  });
  const oa = new Data();
  oa.ha = {};
  ready = new _.te();
  ready.ha = 2;
  oa.ka = ready;
  const Gc = Object.assign(new _.yK(), { Ha: false });
  const api = Object.assign(new _.gM(), { oa, Gc, requestSource: 1, AHc: false, yd: false });
  const controller = new AbortController();
  return {
    ...f,
    api,
    controller,
    calls,
    oa,
    Gc,
    current: () => active,
    loseLease: () => {
      active = false;
    },
    beforeSet: (callback: () => void) => {
      beforeSet = callback;
    },
    beforeFetch: (callback: () => void) => {
      beforeFetch = callback;
    },
    beforeThen: (callback: () => void) => {
      beforeThen = callback;
    },
    synchronous: () => {
      synchronous = true;
    },
    fetchError: () => {
      fetchError = true;
    },
    result: (raw: unknown) => {
      result = raw;
    },
    resolve: () => {
      fetched.ha = observed.ha = 2;
      observer!.next(result);
    },
    reject: () => {
      fetched.ha = observed.ha = 3;
      observer!.error(new Error('SYNTHETIC_PRIVATE_MARKER'));
    },
    wrapper: () => wrapper,
    fetched: () => fetched,
    deferReady: () => {
      deferReady = true;
    },
    readyThenError: () => {
      readyThenError = true;
    },
    flushReady: () => {
      for (const callback of queued.splice(0)) callback();
    },
  };
}
