// Invented SDK objects and public method profiles; no copied account/runtime state.
export function geminiSdkDispatchFixture() {
  const calls = { stream: 0, service: 0, send: 0, serialize: 0, config: 0 };
  const namespace: Record<string, any> = {};
  const pending: Array<() => void> = [];
  let compression = false;
  let empty = false;
  let sendError = false;
  let earlyRt = false;
  let prefix = '/_/BardChatUi/';
  let beforeService = (_wrapper: any) => {};
  let beforeTransfer = () => {};
  let beforeConfig = () => {};
  let beforeTransport = () => {};
  let afterStc = () => {};
  let beforeReturn = (_stream: any) => {};
  let rawStream: any;
  let cancelled = 0;
  let notifications = 0;
  const rawObserver = { next(_value: unknown) {}, error() {} };
  class Message {
    payload = 'synthetic-message';
    serialize() {
      calls.serialize++;
      return this.payload;
    }
  }
  namespace.l = Message;
  namespace.zL = class extends Message {};
  namespace.Fta = class extends Message {};
  namespace.Gta = class extends Message {};
  namespace.HF = class extends Message {};
  // Synthetic deferred lifecycle; production only captures the exported identity and method.
  namespace.bc = class {
    cancel() {
      cancelled++;
    }
  };
  namespace.Ixa = Function(
    'Hxa',
    'return class{constructor(){this.ka=[];this.wa=[];this.oa=[];this.ha=[];this.Aa=null;this.Da=!1}on(a,b){a=="data"?this.ka.push(b):a=="status"?this.wa.push(b):a=="end"?this.oa.push(b):a=="error"&&this.ha.push(b);return this}cancel(){if(!this.Da){if(!this.Aa)throw Error("Ac");this.Aa.cancel()}}removeListener(a,b){a=="data"?Hxa(this.ka,b):a=="status"?Hxa(this.wa,b):a=="end"?Hxa(this.oa,b):a=="error"&&Hxa(this.ha,b);return this}}',
  )((callbacks: unknown[], callback: unknown) => {
    const index = callbacks.indexOf(callback);
    if (index !== -1) callbacks.splice(index, 1);
  });
  namespace.pM = class {};
  namespace.bM = class {};
  namespace.kl = Symbol();
  namespace.ll = Symbol();
  namespace.Kwa = Symbol();
  namespace.JYb = class {
    IVa() {
      return (this as any)[namespace.ll].Ob;
    }
    Qyb() {
      return (this as any)[namespace.ll].Pb;
    }
  };
  namespace.LE = class extends namespace.JYb {};
  namespace.xxa = class {
    constructor(
      public rpcId: any,
      public requestMessage: any,
    ) {}
    yx() {
      return this.rpcId;
    }
    qea() {
      return this.requestMessage;
    }
    Tq() {
      return undefined;
    }
  };
  namespace.Uy = {};
  namespace.Cg = class {
    ha = new Map();
    ka = 0;
    oa = null;
    wa = false;
    remove(key: string) {
      return this.ha.delete(key);
    }
    add(key: string, value: unknown) {
      this.ha.set(key, value);
    }
    QE(key: string) {
      return this.ha.get(key);
    }
    clone() {
      return this;
    }
    toString() {
      return 'synthetic-query';
    }
  };
  namespace.xg = class {
    ka = new namespace.Cg();
    clone() {
      return this;
    }
    toString() {
      return 'synthetic-path';
    }
  };
  namespace.soa = (uri: any, key: string, value: unknown) => uri.ka.ha.set(key, value);
  namespace.n = (message: any, field: number) =>
    field === 1 ? message.rpcMarker : field === 2 ? message.payload : '';
  namespace.di = (message: any, _type: any, field: number) => (field === 1 ? message.items : []);
  namespace.jf = (value: string) => value;
  namespace.pd = () => {
    calls.config++;
    beforeConfig();
    return prefix;
  };
  namespace.yxa = () => ({});
  namespace.Iwa = Symbol();
  namespace.Jwa = Symbol();
  namespace.Wpa = (value: unknown) => value;
  class SyntheticXHR {
    readyState = 0;
    responseText = '';
    onreadystatechange: (() => void) | null = null;
    open(_method: string, _url: string, asynchronous: boolean) {
      if (asynchronous !== true) throw new Error('synthetic-sync-xhr');
      this.readyState = 1;
      this.onreadystatechange?.();
    }
    setRequestHeader() {}
    send() {
      calls.send++;
      if (sendError) throw new Error('synthetic-sdk-error');
    }
  }
  namespace.qe = (value: unknown) => value;
  namespace.$b = (callback: Function, owner: unknown) => callback.bind(owner);
  namespace.xta = ['POST', 'PUT'];
  namespace.fa = {};
  namespace.xa = (values: unknown[], value: unknown) => values.includes(value);
  namespace.cja = class {};
  namespace.cja.prototype.Z8 = Function(
    'XMLHttpRequest',
    'return ' + 'function(){return new XMLHttpRequest}',
  )(SyntheticXHR);
  namespace.bja = new namespace.cja();
  namespace.Mta = class {
    wa = null;
    ka = false;
    oa = false;
  };
  namespace.Mta.prototype.Z8 = Function(
    'Zj',
    'return ' +
      'function(a){var b=new Zj(this.wa,this.ka,this.oa);this.ha&&(b.Aa=this.ha);a&&(b.oa=a);return b}',
  )(SyntheticXHR);
  namespace.Xj = class {
    lPb: unknown = null;
    vk: any = null;
    headers = new Map();
    isDisposed() {
      return false;
    }
    dispatchEvent() {}
    Aq(_code: number, error: unknown) {
      throw error;
    }
  };
  namespace.Xj.prototype.send = Function(
    '_',
    'return ' +
      'function(a,b,c,d){if(this.vk)throw Error("Xb`"+this.FAa+"`"+a);if(typeof b==="string")var e=b;else if(b){var f=b;e=f.method;c!=null||(c=f.body);d!=null||(d=f.headers)}e=e?e.toUpperCase():"GET";this.FAa=a;this.DG="";this.D6=0;this.nIc=!1;this.nE=!0;this.vk=this.Xtb(f);this.vk.onreadystatechange=(0,_.qe)((0,_.$b)(this.J7d,this));this.R3f&&"onprogress"in this.vk&&(this.vk.onprogress=(0,_.qe)((0,_.$b)(function(k){this.I7d(k,!0)},this)),this.vk.upload&&(this.vk.upload.onprogress=(0,_.qe)((0,_.$b)(this.I7d,\nthis))));try{this.TOc=!0,this.vk.open(e,String(a),!0),this.TOc=!1}catch(k){this.Aq(5,k);return}a=c||"";b=new Map(this.headers);if(d)if(Object.getPrototypeOf(d)===Object.prototype)for(var g in d)b.set(g,d[g]);else if(typeof d.keys==="function"&&typeof d.get==="function")for(let k of d.keys())b.set(k,d.get(k));else throw Error("Yb`"+String(d));d=Array.from(b.keys()).find(k=>"content-type"==k.toLowerCase());g=_.fa.FormData&&a instanceof _.fa.FormData;!_.xa(_.xta,e)||d||g||b.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");\nfor(let [k,r]of b)this.vk.setRequestHeader(k,r);this.uI&&(this.vk.responseType=this.uI);"withCredentials"in this.vk&&this.vk.withCredentials!==this.dD&&(this.vk.withCredentials=this.dD);if("setTrustToken"in this.vk&&this.Rbd)try{this.vk.setTrustToken(this.Rbd)}catch(k){}if("setAttributionReporting"in this.vk&&this.mzc)try{this.vk.setAttributionReporting(this.mzc)}catch(k){}try{this.Fua&&(clearTimeout(this.Fua),this.Fua=null),this.Vlb>0&&(this.Fua=setTimeout(this.lH.bind(this),this.Vlb)),this.t6b=\n!0,this.vk.send(a),this.t6b=!1}catch(k){this.Aq(5,k)}}',
  )(namespace);
  namespace.Xj.prototype.Xtb = Function(
    '_',
    'return ' + 'function(a){return this.lPb?this.lPb.Z8(a):_.bja.Z8()}',
  )(namespace);
  namespace.Xj.prototype.J7d = Function(
    '_',
    'Cta',
    'return ' +
      'function(){this.isDisposed()||(this.TOc||this.t6b||this.MWa?Cta(this):this.l_c())}',
  )(namespace, () => {});
  namespace.Xj.prototype.l_c = Function(
    '_',
    'Cta',
    'return ' + 'function(){Cta(this)}',
  )(namespace, () => {
    notifications++;
  });
  namespace.Eb = Function('return function(){this.n5=this.n5;this.b_a=this.b_a}')();
  namespace.Eb.prototype.n5 = false;
  namespace.Eb.prototype.isDisposed = Function('return function(){return this.n5}')();
  const identity = Function(
    'var Tea="closure_uid_17",Uea=0;return {Qd:function(a){return Object.prototype.hasOwnProperty.call(a,Tea)&&a[Tea]||(a[Tea]=++Uea)},count:()=>Uea}',
  )();
  namespace.Fd = identity.Qd;
  namespace.uga = [];
  namespace.vga = [];
  namespace.wga = false;
  namespace.Cr = { ka: null };
  namespace.xga = Function(
    '_',
    'return function(a){_.uga[_.uga.length]=a;if(_.wga)for(let b=0;b<_.vga.length;b++)a((0,_.$b)(_.vga[b].wrap,_.vga[b]))}',
  )(namespace);
  const Monitor = Function(
    '_',
    'return function(a){_.Eb.call(this);this.oa=a;this.ka=!0;this.ha=!1}',
  )(namespace);
  Monitor.prototype = Object.create(namespace.Eb.prototype);
  Monitor.prototype.constructor = Monitor;
  const monitorFactory = Function(
    '_',
    'S1o',
    'var hGo=function(a,b){return(b?"__wrapper_":"__protected_")+_.Fd(a)+"__"},gGo=function(a,b){var c=hGo(a,!0);b[c]||((b[c]=iGo(a,b))[hGo(a,!1)]=b);return b[c]},iGo=function(a,b){var c=function(){if(a.isDisposed())return b.apply(this,arguments);try{return b.apply(this,arguments)}catch(d){S1o(a,d)}};c[hGo(a,!1)]=b;return c};return {gGo,hGo}',
  )(namespace, (_monitor: unknown, error: unknown) => {
    throw error;
  });
  Monitor.prototype.wrap = Function(
    'P1o',
    'return function(a){return P1o(this,a)}',
  )(monitorFactory.gGo);
  Monitor.prototype.unwrap = Function(
    'Q1o',
    'return function(a){return a[Q1o(this,!1)]||a}',
  )(monitorFactory.hGo);
  const installMonitor = Function(
    '_',
    'return function(a){_.wga=!0;var b=(0,_.$b)(a.wrap,a);for(let c=0;c<_.uga.length;c++)_.uga[c](b);_.vga.push(a)}',
  )(namespace);
  namespace.xga(
    Function('_', 'return function(a){_.Xj.prototype.l_c=a(_.Xj.prototype.l_c)}')(namespace),
  );
  namespace.Xj.prototype.pea = Function(
    'return ' + 'function(){return this.vk?this.vk.readyState:0}',
  )();
  namespace.Xj.prototype.Ln = Function(
    'return ' + 'function(){try{return this.vk?this.vk.responseText:""}catch(a){return""}}',
  )();
  namespace.Xj.prototype.Xu = Function('return ' + 'function(){return this.pea()==4}')();
  namespace.Yb = class {
    isDisposed() {
      return false;
    }
    dispatchEvent() {}
  };
  namespace.Zta = class {
    ha: any[] = [];
    ka: any[] = [];
    enqueue(request: any) {
      this.ka.push(request);
    }
    peek() {
      return this.ka[0];
    }
    dequeue() {
      return this.ka.shift();
    }
  };
  const Context = Function(
    'return class {constructor(){this.wa=[];this.oa={};this.wbc=1000;}reset(){this.Aq=this.ka=null}}',
  )();
  let contextFactory = () => new Context();
  Object.assign(Context.prototype, { i0c: 0, xFb: -1, wFb: 0, qta: 0, sKe: 0, wbc: 0 });
  const Manager = class extends namespace.Yb {};
  const manager: any = Object.assign(new Manager(), {
    uxc(request: any) {
      if (earlyRt) request.setParam('rt', 'synthetic');
      afterStc();
    },
  });
  Manager.prototype.send = Function(
    'Lua',
    'Jua',
    'Mua',
    'return function(a){this.isDisposed()?Lua(this,a,107):(this.dispatchEvent(new Jua("e")),this.wa.enqueue(a),Mua(this))}',
  )(
    () => {},
    class {},
    (owner: any) => {
      const request = owner.wa.peek();
      owner.wa.dequeue();
      request.Ni(contextFactory());
      request.getContext().ka = transport;
      beforeTransport();
      transport.transfer(request);
    },
  );
  manager.wa = new namespace.Zta();
  const tua = (transport: any, request: any) => {
    transport.Wa.uxc(request);
    transport.ha = request;
  };
  const transfer = `transfer(a){this.aborted=
!1;uua(this,a);a.setParam("rt",this.uI);var b=a.Da,c=Object.assign({},a.z3c,{method:a.ka});if(zua(a)){vua(this,a);let d=Aua(a),e=a.OCc;d&&e?iua(d,e).then(f=>{this.isDisposed()||this.aborted||this.ha!==a||(b.set("Content-Encoding",e),this.xhr.send(a.getUrl(),c,f,b))}):this.xhr.send(a.getUrl(),c,d,b)}else this.xhr.send(a.getUrl(),c,null,b)}`;
  namespace.Cua = Function(
    'uua',
    'zua',
    'vua',
    'Aua',
    'iua',
    `return class {

    ${transfer}
    abort(){this.aborted=true;}
    isDisposed(){return false;}
  }`,
  )(
    tua,
    () => !empty,
    () => {},
    () => 'synthetic-body',
    () => ({
      then(callback: () => void) {
        pending.push(callback);
      },
    }),
  );
  // Allocate the invented instance without invoking the Bua constructor.
  const Transport = Function(
    '_',
    'KZb',
    `return class extends _.Cua {
    transfer(a){this.wa||
_.Vj("transfer() called during response processing",Error());this.wa=!1;this.oa=0;this.Va=!1;super.transfer(a)}
    kb(){this.xhr.pea()==3&&KZb(this,!1)}
    ob(){KZb(this,!0)}
    Aa(a){var b=this.Ja&&a.getStatus()>=500;KZb(this,!0,b);super.Aa(a)}
  }`,
  )(namespace, () => {});
  namespace.Vj = () => {};
  const transport: any = Object.assign(Object.create(Transport.prototype), {
    xhr: new namespace.Xj(),
    ha: null,
    uI: 'c',
    wa: true,
    aborted: false,
    Wa: {
      uxc(request: any) {
        manager.uxc(request);
      },
    },
  });
  manager.oa = [transport];
  const proto = {
    constructor: function Request() {},
    setParam: Function('_', 'return function(a,b){_.soa(this.oa,a,b)}')(namespace),
    getContext: Function('return function(){return this.Wa}')(),
    Ni: Function('return function(a){this.Wa=a}')(),
    getUrl: Function('return function(){return String(this.oa.clone())}')(),
  };
  proto.constructor.prototype = proto;
  function lowRequest(body: any) {
    return Object.assign(Object.create(proto), {
      Aa: manager,
      ub: body,
      Uwb: 'FAIL',
      oa: new namespace.xg(),
      Da: new Map(),
      ka: 'POST',
      z3c: undefined,
      OCc: compression ? 'gzip' : undefined,
    });
  }
  let current: any;
  namespace.dva = class {
    ka = manager;
    wa = manager;
    sendRequest(wrapper: any) {
      calls.service++;
      current = wrapper;
      beforeTransfer();
      manager.send(wrapper.ha);
      return wrapper;
    }
  };
  const service = new namespace.dva();
  const jsa = '/assistant.lamda.BardFrontendService/StreamGenerate';
  const metadata = {
    Ob: 'RxAFq',
    Sb: '/BardFrontendService.StreamGenerate',
    Rb: false,
    Pb: namespace.HF,
    Ub: namespace.zL,
    oqa: jsa,
    qsa: jsa,
  };
  namespace.Uy.o_RxAFq = metadata;
  const descriptor = Object.assign(new namespace.LE(), {
    [namespace.ll]: metadata,
    [namespace.Kwa]: 'server_streaming',
  });
  const EYb = (receiver: any, message: any, _headers: any, _options: any, path: string) => {
    calls.stream++;
    const body = new namespace.Fta();
    body.payload = message.serialize();
    const Wrapper = Function('return class{cancel(){this.oa.cancel()}}')();
    const wrapper = Object.assign(new Wrapper(), {
      Ha: receiver,
      Aa: body,
      Da: prefix + 'data' + path,
      ka: { Dqg: false },
      ha: lowRequest(body),
      oa: new namespace.bc(),
    });
    rawStream = new namespace.Ixa();
    rawStream.Aa = wrapper;
    beforeService(wrapper);
    receiver.sendRequest(wrapper);
    beforeReturn(rawStream);
    return rawStream;
  };
  const Streaming = Function(
    '_',
    'cZb',
    'return class {stream(a){var b=a.yx(),c=_.yxa(a),d=a.Tq(_.Iwa);Object.assign(c,d);var e=a.Tq(_.Jwa)||new Map;d=this.ha;a=a.qea();e=Object.fromEntries(e);var f;var g=(f=_.Uy[`o_${b.IVa()}`])==null?void 0:f.qsa;b=_.Wpa(b.Qyb());return cZb(d,a,c,e,g,b)}}',
  )(namespace, EYb);
  const streaming = Object.assign(new Streaming(), { ha: service });
  const api = Object.assign(new namespace.pM(), {
    Aa: false,
    Kd: false,
    Ja: Object.assign(new namespace.bM(), { isEnabled: true }),
    Sd: streaming,
  });
  const request = () => new namespace.xxa(descriptor, new namespace.zL());
  const OtherMessage = class extends Message {};
  const otherMetadata = {
    Ob: 'SynthRpc',
    Sb: '/BardFrontendService.SyntheticList',
    Rb: false,
    Pb: OtherMessage,
    Ub: OtherMessage,
    oqa: '/assistant.lamda.BardFrontendService/SyntheticList',
    qsa: '/assistant.lamda.BardFrontendService/SyntheticList',
  };
  namespace.Uy.o_SynthRpc = otherMetadata;
  namespace.PGd = class extends Message {};
  namespace.RGd = {
    Ob: 'hNvQHb',
    Sb: '/BardFrontendService.ListConversationTurns',
    Rb: true,
    Pb: class extends Message {},
    Ub: namespace.PGd,
  };
  namespace.Uy.o_hNvQHb = { ...namespace.RGd };
  namespace.Nfc = class extends Message {};
  namespace.Ofc = {
    Ob: 'otAQ7b',
    Sb: '/BardFrontendService.GetUserStatus',
    Rb: true,
    Ub: namespace.Nfc,
    Pb: class extends Message {},
    [namespace.kl]: true,
  };
  namespace.Uy.o_otAQ7b = { ...namespace.Ofc };
  const otherDescriptor = Object.assign(new namespace.LE(), {
    [namespace.ll]: otherMetadata,
    [namespace.Kwa]: 'server_streaming',
  });
  const survey = [
    ['PCck7e', '/TaskService.GetCandidates', true],
    ['sofYMe', '/TaskService.GetTaskForRendering', true],
    ['Fws7If', '/ResponseService.Write', false],
  ].map(([Ob, Sb, Rb]) => {
    const metadata = {
      Ob,
      Sb,
      Rb,
      Ub: class extends Message {},
      Pb: class extends Message {},
      [namespace.kl]: true,
    };
    namespace.Uy['o_' + Ob] = metadata;
    return metadata;
  });
  return {
    survey,
    namespace,
    api,
    service,
    streaming,
    transport,
    manager,
    descriptor,
    metadata,
    calls,
    pending,
    rawObserver,
    notifications: () => notifications,
    identityAssignments: identity.count,
    protectedNotify() {
      // Execute the public Gga/rCo/monitor path with invented owner/report/UID values.
      const original = namespace.Xj.prototype.l_c;
      const monitor = new Monitor(() => {});
      monitor.ka = monitor.ha = true;
      installMonitor(monitor);
      namespace.Cr.ka = monitor;
      const wrapper = namespace.Xj.prototype.l_c;
      const uidKey = 'closure_uid_17';
      const uid = monitor[uidKey];
      return {
        monitor,
        original,
        wrapper,
        uidKey,
        protectedKey: `__protected_${uid}__`,
        wrapperKey: `__wrapper_${uid}__`,
      };
    },
    rawStream: () => rawStream,
    completeTransport: () => {
      transport.xhr.vk = null;
    },
    cancelled: () => cancelled,
    emit(value: unknown, metadata?: unknown) {
      // Normal mYb calls through the array and forwards its opaque second argument.
      for (let i = 0; i < rawStream.ka.length; i++) rawStream.ka[i](value, metadata);
    },
    lowRequest,
    request,
    otherMetadata,
    unrelatedRequest: () => new namespace.xxa(otherDescriptor, new OtherMessage()),
    batchWrapper: (markers: string[] = ['SynthRpc']) => {
      const body = new namespace.Gta();
      body.items = markers.map((rpcMarker) => Object.assign(new namespace.Fta(), { rpcMarker }));
      const request = lowRequest(body);
      request.zae = false;
      request.Sa = true;
      return {
        Ha: service,
        Aa: body,
        Da: prefix + 'data/batchexecute',
        ka: { Dqg: false, DWa() {} },
        ha: request,
      };
    },
    current: () => current,
    context: () => new Context(),
    compression: () => {
      compression = true;
    },
    empty: () => {
      empty = true;
    },
    error: () => {
      sendError = true;
    },
    earlyRt: () => {
      earlyRt = true;
    },
    prefix: (value: string) => {
      prefix = value;
    },
    beforeService: (callback: (wrapper: any) => void) => {
      beforeService = callback;
    },
    beforeTransfer: (callback: () => void) => {
      beforeTransfer = callback;
    },
    beforeConfig: (callback: () => void) => {
      beforeConfig = callback;
    },
    beforeTransport: (callback: () => void) => {
      beforeTransport = callback;
    },
    afterStc: (callback: () => void) => {
      afterStc = callback;
    },
    beforeReturn: (callback: (stream: any) => void) => {
      beforeReturn = callback;
    },
    contextFactory: (callback: () => any) => {
      contextFactory = callback;
    },
  };
}
