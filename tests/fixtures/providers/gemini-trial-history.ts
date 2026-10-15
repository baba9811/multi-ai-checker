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
  _.kl = Symbol('synthetic-registered-descriptor');
  _.ll = Symbol('synthetic-descriptor-data');
  _.Kwa = Symbol('synthetic-kind');
  _.qna = { id: 'unobfuscatedRpcId' };
  _.jna = { id: 'frontendMethodType' };
  _.Uy = {};
  _.l = class {
    fl: unknown[] = [];
    constructor() {
      Object.defineProperty(this.fl, _.La, { value: 2144, writable: true });
    }
  };
  _.Wh = (message: any, field: number, value: unknown) => {
    beforeSet();
    calls.setters.push([message, field, value]);
    message.fl[field - 1] = value;
    return message;
  };
  _.Cpa = _.Wg = _.Yg = _.aba = (value: unknown) => value;
  _.ih = (message: any, field: number, _convert: unknown, value: unknown) => {
    beforeSet();
    calls.setters.push([message, field, value]);
    (message.fl[field - 1] ??= []).push(value);
    return message;
  };
  _.Xg = (value: unknown) => value;
  for (const [name, source] of Object.entries({
    Ni: 'function(a,b,c,d){return _.Wh(a,b,_.Cpa(c),d)}',
    Ii: 'function(a,b,c){return _.Wh(a,b,c==null?c:_.Yg(c))}',
    Pi: 'function(a,b,c){return _.Wh(a,b,c==null?c:_.Wg(c))}',
    Fi: 'function(a,b,c,d){return _.Wh(a,b,c==null?c:_.aba(c),d)}',
    p5c: 'function(a,b){return _.Fi(a,1,b)}',
    xm: 'function(a,b,c){return _.ih(a,b,_.Wg,c,void 0,_.Xg)}',
    Hh: 'function(a,b,c,d,e){d=Qpa(d);_.Wh(a,c,d,e);d&&!_.Ra(d)&&_.Ng(a.fl);return a}',
  }))
    _[name] = new Function('_', 'Qpa', 'return ' + source)(_, (value: unknown) => value);
  _.Ra = () => true;
  _.Ng = () => {};
  _.PGd = new Function(
    '_',
    'return class extends _.l{constructor(a){super(a)}ig(){return _.n(this,1)}getRequestSource(){return _.ui(this,4)}getClientCapabilities(a){return _.Hk(this,6,a)}}',
  )(_);
  _.RI = new Function('_', 'return class extends _.l{constructor(a){super(a)}}')(_);
  _.pM = class {};
  _.yK = class {};
  _.yK.prototype.Qr = new Function(
    'return class {Qr(){if(this.Ha===void 0)throw Error("fk");return this.Ha}}',
  )().prototype.Qr;
  _.JYb = class {
    constructor(metadata: any) {
      (this as any)[_.ll] = {
        ...metadata,
        n_b: [
          { key: _.qna, value: metadata.Sb },
          { key: _.jna, value: metadata.Rb },
        ],
      };
      (this as any).ha = metadata.Ob;
      _.Uy['o_' + metadata.Ob] = (this as any)[_.ll];
    }
  };
  _.JYb.prototype.getInstance = new Function(
    '_',
    'return class {getInstance(a){return new _.xxa(this,a,void 0,this[_.ll].n_b)}}',
  )(_).prototype.getInstance;
  _.Zy = new Function(
    '_',
    'return class extends _.JYb{constructor(a){super(a);this[_.Kwa]="unary"}}',
  )(_);
  _.xxa = class {
    constructor(
      public rpcId: any,
      public requestMessage: any,
      public sideChannel = {},
      public options: unknown[] = [],
    ) {}
  };
  Object.assign(_.RGd, {
    Ob: 'hNvQHb',
    Sb: '/BardFrontendService.ListConversationTurns',
    Rb: true,
    Ub: _.PGd,
  });
  _.RGd[_.kl] = true;
  new _.Zy(_.RGd);
  _.te = class {
    ha = 0;
  };
  _.qe = (value: unknown) => value;
  _.xe = class extends Error {};
  _.re = (callback: () => void, receiver: unknown) => callback.call(receiver);
  _.te.prototype.cancel = new Function(
    '_',
    'fha',
    'return function(a){if(this.ha==0){let b=new _.xe(a);_.re(function(){fha(this,b)},this)}}',
  )(_, (promise: any) => {
    calls.cancel++;
    promise.ha = 3;
  });
  _.te.prototype.then = new Function(
    '_',
    'cha',
    'return function(a,b,c){return cha(this,(0,_.qe)(typeof a==="function"?a:null),(0,_.qe)(typeof b==="function"?b:null),c)}',
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
    'GZb',
    'return class {fetch(a,b=!0){return b?this.ka.then(()=>GZb(this.ha,a)):GZb(this.ha,a)}}',
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
  const api = Object.assign(new _.pM(), { oa, Gc, requestSource: 1, yGc: false, xd: false });
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
