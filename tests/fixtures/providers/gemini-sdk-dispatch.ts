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
  namespace.wL = class extends Message {};
  namespace.Fta = class extends Message {};
  namespace.Gta = class extends Message {};
  namespace.IF = class extends Message {};
  // Synthetic deferred lifecycle; production only captures the exported identity and method.
  namespace.bc = class {
    cancel() {
      cancelled++;
    }
  };
  namespace.Ixa = Function(
    'Hxa',
    'return class{constructor(){this.ka=[];this.wa=[];this.oa=[];this.ha=[];this.Aa=null;this.Ca=!1}on(a,b){a=="data"?this.ka.push(b):a=="status"?this.wa.push(b):a=="end"?this.oa.push(b):a=="error"&&this.ha.push(b);return this}cancel(){if(!this.Ca){if(!this.Aa)throw Error("Ac");this.Aa.cancel()}}removeListener(a,b){a=="data"?Hxa(this.ka,b):a=="status"?Hxa(this.wa,b):a=="end"?Hxa(this.oa,b):a=="error"&&Hxa(this.ha,b);return this}}',
  )((callbacks: unknown[], callback: unknown) => {
    const index = callbacks.indexOf(callback);
    if (index !== -1) callbacks.splice(index, 1);
  });
  namespace.gM = class {};
  namespace.UL = class {};
  namespace.cM = Function('return class{constructor(){this.ha=0}reset(){this.ha=0}}')();
  namespace.CKd = Function(
    '_',
    'uKd',
    'return class{constructor(){this.Da=_.x(_.Nz);this.ka=_.x(_.cM);this.ha=this.Da.Ea(_.tKd);this.oa=this.Da.Ea(uKd)}}',
  )(namespace, {});
  namespace.zKd = Function(
    '_',
    'return class{constructor(){this.ha=_.x(_.bL);this.ka=_.x(_.dL);this.oa=_.x(_.bM);this.wa=_.x(_.cM)}}',
  )(namespace);
  namespace.BKd = Function(
    'return function(a){if(!a.ha)return!1;if(a.oa)return!0;a=a.ka.ha;return a!==43&&a!==42}',
  )();
  const mode = new namespace.cM();
  const eligibility = Object.assign(Object.create(namespace.CKd.prototype), {
    Da: {},
    ka: mode,
    ha: false,
    oa: false,
  });
  const header = Object.assign(Object.create(namespace.zKd.prototype), { wa: mode });
  namespace.jl = Symbol();
  namespace.kl = Symbol();
  namespace.Kwa = Symbol();
  namespace.OYb = class {
    NVa() {
      return (this as any)[namespace.kl].Ob;
    }
    kzb() {
      return (this as any)[namespace.kl].Pb;
    }
  };
  namespace.LE = Function('_', 'return function(a,b){return _.Ni(a,4,b)}')(namespace);
  namespace.ME = class extends namespace.OYb {};
  namespace.xxa = class {
    constructor(
      public rpcId: any,
      public requestMessage: any,
    ) {}
    zx() {
      return this.rpcId;
    }
    vea() {
      return this.requestMessage;
    }
    Uq() {
      return undefined;
    }
  };
  namespace.Ty = {};
  namespace.Bg = class {
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
    XE(key: string) {
      return this.ha.get(key);
    }
    clone() {
      return this;
    }
    toString() {
      return 'synthetic-query';
    }
  };
  namespace.wg = class {
    ka = '';
    ha = new namespace.Bg();
    clone() {
      return this;
    }
    toString() {
      return 'synthetic-path';
    }
  };
  namespace.roa = (uri: any, key: string, value: unknown) => uri.ha.ha.set(key, value);
  namespace.n = (message: any, field: number) =>
    field === 1 ? message.rpcMarker : field === 2 ? message.payload : '';
  namespace.ci = (message: any, _type: any, field: number) => (field === 1 ? message.items : []);
  namespace.hf = (value: string) => value;
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
  namespace.bja = class {};
  namespace.bja.prototype.g9 = Function(
    'XMLHttpRequest',
    'return ' + 'function(){return new XMLHttpRequest}',
  )(SyntheticXHR);
  namespace.aja = new namespace.bja();
  namespace.Mta = class {
    wa = null;
    ka = false;
    oa = false;
  };
  namespace.Mta.prototype.g9 = Function(
    'Xj',
    'return ' +
      'function(a){var b=new Xj(this.wa,this.ka,this.oa);this.ha&&(b.Aa=this.ha);a&&(b.oa=a);return b}',
  )(SyntheticXHR);
  namespace.Vj = class {
    BPb: unknown = null;
    vk: any = null;
    headers = new Map();
    isDisposed() {
      return false;
    }
    dispatchEvent() {}
    Cq(_code: number, error: unknown) {
      throw error;
    }
  };
  namespace.Vj.prototype.send = Function(
    '_',
    'return ' +
      'function(a,b,c,d){if(this.vk)throw Error("Xb`"+this.NAa+"`"+a);if(typeof b==="string")var e=b;else if(b){var f=b;e=f.method;c!=null||(c=f.body);d!=null||(d=f.headers)}e=e?e.toUpperCase():"GET";this.NAa=a;this.IG="";this.I6=0;this.WIc=!1;this.qE=!0;this.vk=this.rub(f);this.vk.onreadystatechange=(0,_.qe)((0,_.$b)(this.O8d,this));this.p5f&&"onprogress"in this.vk&&(this.vk.onprogress=(0,_.qe)((0,_.$b)(function(k){this.N8d(k,!0)},this)),this.vk.upload&&(this.vk.upload.onprogress=(0,_.qe)((0,_.$b)(this.N8d,\nthis))));try{this.EPc=!0,this.vk.open(e,String(a),!0),this.EPc=!1}catch(k){this.Cq(5,k);return}a=c||"";b=new Map(this.headers);if(d)if(Object.getPrototypeOf(d)===Object.prototype)for(var g in d)b.set(g,d[g]);else if(typeof d.keys==="function"&&typeof d.get==="function")for(let k of d.keys())b.set(k,d.get(k));else throw Error("Yb`"+String(d));d=Array.from(b.keys()).find(k=>"content-type"==k.toLowerCase());g=_.fa.FormData&&a instanceof _.fa.FormData;!_.xa(_.xta,e)||d||g||b.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");\nfor(let [k,r]of b)this.vk.setRequestHeader(k,r);this.tI&&(this.vk.responseType=this.tI);"withCredentials"in this.vk&&this.vk.withCredentials!==this.eD&&(this.vk.withCredentials=this.eD);if("setTrustToken"in this.vk&&this.Pcd)try{this.vk.setTrustToken(this.Pcd)}catch(k){}if("setAttributionReporting"in this.vk&&this.Tzc)try{this.vk.setAttributionReporting(this.Tzc)}catch(k){}try{this.Pua&&(clearTimeout(this.Pua),this.Pua=null),this.nmb>0&&(this.Pua=setTimeout(this.kH.bind(this),this.nmb)),this.K6b=\n!0,this.vk.send(a),this.K6b=!1}catch(k){this.Cq(5,k)}}',
  )(namespace);
  namespace.Vj.prototype.rub = Function(
    '_',
    'return ' + 'function(a){return this.BPb?this.BPb.g9(a):_.aja.g9()}',
  )(namespace);
  namespace.Vj.prototype.O8d = Function(
    '_',
    'Cta',
    'return ' +
      'function(){this.isDisposed()||(this.EPc||this.K6b||this.TWa?Cta(this):this.Y_c())}',
  )(namespace, () => {});
  namespace.Vj.prototype.Y_c = Function(
    '_',
    'Cta',
    'return ' + 'function(){Cta(this)}',
  )(namespace, () => {
    notifications++;
  });
  namespace.Eb = Function('return function(){this.r5=this.r5;this.n_a=this.n_a}')();
  namespace.Eb.prototype.r5 = false;
  namespace.Eb.prototype.isDisposed = Function('return function(){return this.r5}')();
  const identity = Function(
    'var Tea="closure_uid_17",Uea=0;return {Qd:function(a){return Object.prototype.hasOwnProperty.call(a,Tea)&&a[Tea]||(a[Tea]=++Uea)},count:()=>Uea}',
  )();
  namespace.Fd = identity.Qd;
  namespace.tga = [];
  namespace.uga = [];
  namespace.vga = false;
  namespace.Cr = { ka: null };
  namespace.wga = Function(
    '_',
    'return function(a){_.tga[_.tga.length]=a;if(_.vga)for(let b=0;b<_.uga.length;b++)a((0,_.$b)(_.uga[b].wrap,_.uga[b]))}',
  )(namespace);
  const Monitor = Function(
    '_',
    'return function(a){_.Eb.call(this);this.oa=a;this.ka=!0;this.ha=!1}',
  )(namespace);
  Monitor.prototype = Object.create(namespace.Eb.prototype);
  Monitor.prototype.constructor = Monitor;
  const monitorFactory = Function(
    '_',
    'M5o',
    'var hGo=function(a,b){return(b?"__wrapper_":"__protected_")+_.Fd(a)+"__"},gGo=function(a,b){var c=hGo(a,!0);b[c]||((b[c]=iGo(a,b))[hGo(a,!1)]=b);return b[c]},iGo=function(a,b){var c=function(){if(a.isDisposed())return b.apply(this,arguments);try{return b.apply(this,arguments)}catch(d){M5o(a,d)}};c[hGo(a,!1)]=b;return c};return {gGo,hGo}',
  )(namespace, (_monitor: unknown, error: unknown) => {
    throw error;
  });
  Monitor.prototype.wrap = Function(
    'J5o',
    'return function(a){return J5o(this,a)}',
  )(monitorFactory.gGo);
  Monitor.prototype.unwrap = Function(
    'K5o',
    'return function(a){return a[K5o(this,!1)]||a}',
  )(monitorFactory.hGo);
  const installMonitor = Function(
    '_',
    'return function(a){_.vga=!0;var b=(0,_.$b)(a.wrap,a);for(let c=0;c<_.tga.length;c++)_.tga[c](b);_.uga.push(a)}',
  )(namespace);
  namespace.wga(
    Function('_', 'return function(a){_.Vj.prototype.Y_c=a(_.Vj.prototype.Y_c)}')(namespace),
  );
  namespace.Vj.prototype.uea = Function(
    'return ' + 'function(){return this.vk?this.vk.readyState:0}',
  )();
  namespace.Vj.prototype.Ln = Function(
    'return ' + 'function(){try{return this.vk?this.vk.responseText:""}catch(a){return""}}',
  )();
  namespace.Vj.prototype.Wu = Function('return ' + 'function(){return this.uea()==4}')();
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
    'return class {constructor(){this.wa=[];this.oa={};this.wbc=1000;}reset(){this.Cq=this.ka=null}}',
  )();
  let contextFactory = () => new Context();
  Object.assign(Context.prototype, { i0c: 0, xFb: -1, wFb: 0, zta: 0, sKe: 0, wbc: 0 });
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
!1;uua(this,a);a.setParam("rt",this.tI);var b=a.Ca,c=Object.assign({},a.o4c,{method:a.ka});if(zua(a)){vua(this,a);let d=Aua(a),e=a.wDc;d&&e?iua(d,e).then(f=>{this.isDisposed()||this.aborted||this.ha!==a||(b.set("Content-Encoding",e),this.xhr.send(a.getUrl(),c,f,b))}):this.xhr.send(a.getUrl(),c,d,b)}else this.xhr.send(a.getUrl(),c,null,b)}`;
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
    'PZb',
    `return class extends _.Cua {
    transfer(a){this.wa||
_.Tj("transfer() called during response processing",Error());this.wa=!1;this.oa=0;this.Va=!1;super.transfer(a)}
    kb(){this.xhr.uea()==3&&PZb(this,!1)}
    ob(){PZb(this,!0)}
    Aa(a){var b=this.Ja&&a.getStatus()>=500;PZb(this,!0,b);super.Aa(a)}
  }`,
  )(namespace, () => {});
  namespace.Tj = () => {};
  const transport: any = Object.assign(Object.create(Transport.prototype), {
    xhr: new namespace.Vj(),
    ha: null,
    tI: 'c',
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
    setParam: Function('_', 'return function(a,b){_.roa(this.oa,a,b)}')(namespace),
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
      oa: new namespace.wg(),
      Ca: new Map(),
      ka: 'POST',
      o4c: undefined,
      wDc: compression ? 'gzip' : undefined,
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
    Rb: '/BardFrontendService.StreamGenerate',
    Qb: false,
    Pb: namespace.IF,
    Ub: namespace.wL,
    Fqa: jsa,
    zsa: jsa,
  };
  namespace.Ty.o_RxAFq = metadata;
  const descriptor = Object.assign(new namespace.ME(), {
    [namespace.kl]: metadata,
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
    'hZb',
    'return class {stream(a){var b=a.zx(),c=_.yxa(a),d=a.Uq(_.Iwa);Object.assign(c,d);var e=a.Uq(_.Jwa)||new Map;d=this.ha;a=a.vea();e=Object.fromEntries(e);var f;var g=(f=_.Ty[`o_${b.NVa()}`])==null?void 0:f.zsa;b=_.Wpa(b.kzb());return hZb(d,a,c,e,g,b)}}',
  )(namespace, EYb);
  const streaming = Object.assign(new Streaming(), { ha: service });
  const api = Object.assign(new namespace.gM(), {
    Aa: eligibility,
    Ua: mode,
    Eb: header,
    Kd: false,
    Ja: Object.assign(new namespace.UL(), { isEnabled: true }),
    Sd: streaming,
  });
  const request = () => new namespace.xxa(descriptor, new namespace.wL());
  const OtherMessage = class extends Message {};
  const otherMetadata = {
    Ob: 'SynthRpc',
    Rb: '/BardFrontendService.SyntheticList',
    Qb: false,
    Pb: OtherMessage,
    Ub: OtherMessage,
    Fqa: '/assistant.lamda.BardFrontendService/SyntheticList',
    zsa: '/assistant.lamda.BardFrontendService/SyntheticList',
  };
  namespace.Ty.o_SynthRpc = otherMetadata;
  namespace.eHd = class extends Message {};
  namespace.gHd = {
    Ob: 'hNvQHb',
    Rb: '/BardFrontendService.ListConversationTurns',
    Qb: true,
    Pb: class extends Message {},
    Ub: namespace.eHd,
  };
  namespace.Ty.o_hNvQHb = { ...namespace.gHd };
  namespace.Ygc = class extends Message {};
  namespace.Zgc = {
    Ob: 'otAQ7b',
    Rb: '/BardFrontendService.GetUserStatus',
    Qb: true,
    Ub: namespace.Ygc,
    Pb: class extends Message {},
    [namespace.jl]: true,
  };
  namespace.Ty.o_otAQ7b = { ...namespace.Zgc };
  const otherDescriptor = Object.assign(new namespace.ME(), {
    [namespace.kl]: otherMetadata,
    [namespace.Kwa]: 'server_streaming',
  });
  const survey = [
    ['PCck7e', '/TaskService.GetCandidates', true],
    ['sofYMe', '/TaskService.GetTaskForRendering', true],
    ['Fws7If', '/ResponseService.Write', false],
  ].map(([Ob, Rb, Qb]) => {
    const metadata = {
      Ob,
      Rb,
      Qb,
      Ub: class extends Message {},
      Pb: class extends Message {},
      [namespace.jl]: true,
    };
    namespace.Ty['o_' + Ob] = metadata;
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
      const original = namespace.Vj.prototype.Y_c;
      const monitor = new Monitor(() => {});
      monitor.ka = monitor.ha = true;
      installMonitor(monitor);
      namespace.Cr.ka = monitor;
      const wrapper = namespace.Vj.prototype.Y_c;
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
