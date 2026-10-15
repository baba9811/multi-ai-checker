// Provider-owned, version-pinned compatibility guard. It authorizes no Xub call:
// approval, one subscription, genuine cancellation and page retirement belong to the caller.
export function armGeminiRpcDispatch(
  namespace: unknown,
  actualHL: unknown,
  current: () => boolean,
  rawObserver: { next(value: unknown): void; error(): void },
): {
  close(): void;
  sent(): boolean;
  detach(): void;
} {
  type Call = (this: unknown, ...args: unknown[]) => unknown;
  type Cause =
    | 'runtime-shape'
    | 'route'
    | 'protection'
    | 'source-profile'
    | 'descriptor'
    | 'binding'
    | 'handoff'
    | 'retry'
    | 'stream'
    | 'backend'
    | 'closed'
    | 'spent'
    | 'interrupted';
  type SourceCause =
    'source-stream' | 'source-async' | 'source-notify' | 'source-factory' | 'source-handler';
  let closed = false;
  let spent = false;
  let detached = false;
  let observationFailed = false;
  let rawStream: object | undefined;
  let dataListeners: unknown[] | undefined;
  const rawArrays = new Map<string, unknown[]>();
  let capturedWrapper: object | undefined;
  let wrapperCancel: Call | undefined;
  let wrapperPrototype: object | undefined;
  let cancelOwner: object | undefined;
  let notifyCheck = () => {};
  if (typeof current !== 'function') fail('runtime-shape');
  const missing = Symbol();
  function fail(cause: Cause, sourceCause?: SourceCause): never {
    closed = true;
    throw new Error(`Gemini RPC dispatch: ${cause}`, { cause: `dispatch-${sourceCause ?? cause}` });
  }
  function live(): void {
    if (closed) fail('closed');
    streamMethods();
    if (own(streaming, 'stream') !== streamGuard || own(service, 'sendRequest') !== receive)
      fail('binding');
    if (
      own(actualHL, 'Sd') !== streaming ||
      own(streaming, 'ha') !== service ||
      own(actualHL, 'Aa') !== false ||
      own(actualHL, 'Kd') !== false
    )
      fail('binding');
    if (own(actualHL, 'Ja') !== challenge || own(challenge, 'isEnabled') !== true)
      fail('protection');
    let valid: boolean;
    try {
      valid = current() === true;
    } catch {
      if (closed) fail('closed');
      fail('interrupted');
    }
    if (closed) fail('closed');
    if (!valid) fail('interrupted');
  }
  function object(value: unknown): value is object {
    return value !== null && (typeof value === 'object' || typeof value === 'function');
  }
  function own(value: unknown, key: PropertyKey): unknown {
    if (!object(value)) fail('runtime-shape');
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor) return missing;
    if (!Object.hasOwn(descriptor, 'value')) fail('runtime-shape');
    return descriptor.value;
  }
  function callable(value: unknown): Call {
    if (typeof value !== 'function') fail('runtime-shape');
    return value as Call;
  }
  function cancelOwnedWrapper() {
    deferredMethods();
    if (
      !capturedWrapper ||
      !wrapperCancel ||
      !cancelOwner ||
      Object.getPrototypeOf(capturedWrapper) !== wrapperPrototype ||
      own(wrapperPrototype!, 'cancel') !== wrapperCancel ||
      own(capturedWrapper, 'oa') !== cancelOwner ||
      !exact(cancelOwner, deferredPrototype)
    )
      fail('binding');
    unshadowed(capturedWrapper, 'cancel');
    unshadowed(cancelOwner, 'cancel');
    Reflect.apply(wrapperCancel, capturedWrapper, []);
  }
  function exported(name: string): unknown {
    return own(namespace, name);
  }
  function proto(name: string): object {
    const result = own(callable(exported(name)), 'prototype');
    if (!object(result)) fail('runtime-shape');
    return result;
  }
  function exact(value: unknown, expected: object): value is object {
    return object(value) && Object.getPrototypeOf(value) === expected;
  }
  if (
    !object(rawObserver) ||
    (Object.getPrototypeOf(rawObserver) !== Object.prototype &&
      Object.getPrototypeOf(rawObserver) !== null)
  )
    fail('runtime-shape');
  if (Reflect.ownKeys(rawObserver).length !== 2) fail('runtime-shape');
  const rawNext = callable(own(rawObserver, 'next'));
  const rawError = callable(own(rawObserver, 'error'));
  function unshadowed(value: object, key: PropertyKey): void {
    if (Object.getOwnPropertyDescriptor(value, key)) fail('source-profile');
  }
  const functionSource = callable(own(Function.prototype, 'toString'));
  function source(value: unknown, expected: string, sourceCause?: SourceCause): Call {
    const fn = callable(value);
    if (Reflect.apply(functionSource, fn, []) !== expected) fail('source-profile', sourceCause);
    return fn;
  }
  function install(target: object, key: string, fn: Call): void {
    unshadowed(target, key);
    if (!Object.isExtensible(target)) fail('runtime-shape');
    Object.defineProperty(target, key, { value: fn, configurable: true, writable: true });
  }
  const hl = proto('pM');
  const protection = proto('bM');
  if (!exact(actualHL, hl)) fail('binding');
  if (own(actualHL, 'Aa') !== false || own(actualHL, 'Kd') !== false) fail('route');
  const challenge = own(actualHL, 'Ja');
  if (!exact(challenge, protection) || own(challenge, 'isEnabled') !== true) fail('protection');
  const streaming = own(actualHL, 'Sd');
  if (!object(streaming)) fail('binding');
  const streamingPrototype: unknown = Object.getPrototypeOf(streaming);
  if (!object(streamingPrototype) || Object.getPrototypeOf(streamingPrototype) !== Object.prototype)
    fail('source-profile');
  const stream = source(
    own(streamingPrototype, 'stream'),
    'stream(a){var b=a.yx(),c=_.yxa(a),d=a.Tq(_.Iwa);Object.assign(c,d);var e=a.Tq(_.Jwa)||new Map;d=this.ha;a=a.qea();e=Object.fromEntries(e);var f;var g=(f=_.Uy[`o_${b.IVa()}`])==null?void 0:f.qsa;b=_.Wpa(b.Qyb());return cZb(d,a,c,e,g,b)}',
  );
  const service = own(streaming, 'ha');
  const servicePrototype = proto('dva');
  if (!exact(service, servicePrototype)) fail('binding');
  const sendRequest = callable(own(servicePrototype, 'sendRequest'));
  unshadowed(streaming, 'stream');
  unshadowed(service, 'sendRequest');
  if (!Object.isExtensible(streaming) || !Object.isExtensible(service)) fail('runtime-shape');

  const requestPrototype = proto('xxa');
  const descriptorPrototype = proto('LE');
  const descriptorBase = proto('JYb');
  if (Object.getPrototypeOf(descriptorPrototype) !== descriptorBase) fail('source-profile');
  for (const key of ['IVa', 'Qyb']) {
    unshadowed(descriptorPrototype, key);
    callable(own(descriptorBase, key));
  }
  const messagePrototype = proto('zL');
  const bodyPrototype = proto('Fta');
  const batchPrototype = proto('Gta');
  const etaClass = callable(exported('Fta'));
  const baseMessage = proto('l');
  if (
    Object.getPrototypeOf(messagePrototype) !== baseMessage ||
    Object.getPrototypeOf(bodyPrototype) !== baseMessage ||
    Object.getPrototypeOf(batchPrototype) !== baseMessage
  )
    fail('source-profile');
  const serialize = callable(own(baseMessage, 'serialize'));
  const bodyField = callable(exported('n'));
  const repeatedBodyField = callable(exported('di'));
  const config = callable(exported('pd'));
  const configString = callable(exported('jf'));
  const descriptorKey = exported('ll');
  const kindKey = exported('Kwa');
  if (typeof descriptorKey !== 'symbol' || typeof kindKey !== 'symbol') fail('descriptor');
  const registered = own(exported('Uy'), 'o_RxAFq');
  const jsa = '/assistant.lamda.BardFrontendService/StreamGenerate';
  function registeredDescriptor(): void {
    if (
      own(exported('Uy'), 'o_RxAFq') !== registered ||
      !object(registered) ||
      own(registered, 'Ob') !== 'RxAFq' ||
      own(registered, 'Sb') !== '/BardFrontendService.StreamGenerate' ||
      own(registered, 'Rb') !== false ||
      own(registered, 'Pb') !== exported('HF') ||
      own(registered, 'Ub') !== exported('zL') ||
      own(registered, 'oqa') !== jsa ||
      own(registered, 'qsa') !== jsa
    )
      fail('descriptor');
  }
  registeredDescriptor();
  const streamClass = callable(exported('Ixa'));
  const streamPrototype = proto('Ixa');
  const responseClass = callable(exported('HF'));
  const responsePrototype = proto('HF');
  const deferredClass = callable(exported('bc'));
  const deferredPrototype = proto('bc');
  const deferredCancel = callable(own(deferredPrototype, 'cancel'));
  function deferredMethods() {
    if (
      exported('bc') !== deferredClass ||
      proto('bc') !== deferredPrototype ||
      own(deferredPrototype, 'cancel') !== deferredCancel
    )
      fail('binding');
  }
  source(
    streamClass,
    'class{constructor(){this.ka=[];this.wa=[];this.oa=[];this.ha=[];this.Aa=null;this.Da=!1}on(a,b){a=="data"?this.ka.push(b):a=="status"?this.wa.push(b):a=="end"?this.oa.push(b):a=="error"&&this.ha.push(b);return this}cancel(){if(!this.Da){if(!this.Aa)throw Error("Ac");this.Aa.cancel()}}removeListener(a,b){a=="data"?Hxa(this.ka,b):a=="status"?Hxa(this.wa,b):a=="end"?Hxa(this.oa,b):a=="error"&&Hxa(this.ha,b);return this}}',
    'source-stream',
  );
  const streamOn = source(
    own(streamPrototype, 'on'),
    'on(a,b){a=="data"?this.ka.push(b):a=="status"?this.wa.push(b):a=="end"?this.oa.push(b):a=="error"&&this.ha.push(b);return this}',
    'source-stream',
  );
  const streamRemove = source(
    own(streamPrototype, 'removeListener'),
    'removeListener(a,b){a=="data"?Hxa(this.ka,b):a=="status"?Hxa(this.wa,b):a=="end"?Hxa(this.oa,b):a=="error"&&Hxa(this.ha,b);return this}',
    'source-stream',
  );
  const streamCancel = source(
    own(streamPrototype, 'cancel'),
    'cancel(){if(!this.Da){if(!this.Aa)throw Error("Ac");this.Aa.cancel()}}',
    'source-stream',
  );
  function streamMethods() {
    notifyCheck();
    if (xhr !== undefined) {
      if (exported('Xj') !== xhrClass || proto('Xj') !== xhrPrototype || !exact(xhr, xhrPrototype))
        fail('binding');
      unshadowed(xhr, 'l_c');
    }
    if (
      exported('Ixa') !== streamClass ||
      proto('Ixa') !== streamPrototype ||
      exported('HF') !== responseClass ||
      proto('HF') !== responsePrototype ||
      own(streamPrototype, 'on') !== streamOn ||
      own(streamPrototype, 'removeListener') !== streamRemove ||
      own(streamPrototype, 'cancel') !== streamCancel
    )
      fail('binding');
  }
  function listenerList(value: unknown): unknown[] {
    if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype) fail('binding');
    const length = own(value, 'length');
    if (typeof length !== 'number' || !Number.isInteger(length) || length < 0 || length > 128)
      fail('binding');
    for (const key of Reflect.ownKeys(value)) {
      if (
        key !== 'length' &&
        !(typeof key === 'string' && /^(0|[1-9]\d*)$/.test(key) && Number(key) < length)
      )
        fail('binding');
      own(value, key);
    }
    for (let i = 0; i < length; i++) if (typeof own(value, i) !== 'function') fail('binding');
    return value;
  }
  function streamState() {
    if (
      !rawStream ||
      !exact(rawStream, streamPrototype) ||
      Reflect.ownKeys(rawStream).length !== 6 ||
      Reflect.ownKeys(rawStream).some(
        (key) => !['ka', 'wa', 'oa', 'ha', 'Aa', 'Da'].includes(key as string),
      ) ||
      own(rawStream, 'Aa') !== capturedWrapper ||
      own(rawStream, 'Da') !== false
    )
      fail('binding');
    for (const key of ['on', 'removeListener', 'cancel']) unshadowed(rawStream, key);
    for (const [key, list] of rawArrays) if (own(rawStream, key) !== list) fail('binding');
    for (const list of rawArrays.values()) listenerList(list);
    let count = 0;
    for (let i = 0; i < dataListeners!.length; i++)
      if (own(dataListeners!, i) === observeRaw) count++;
    if (count !== 1 || own(dataListeners!, 0) !== observeRaw) fail('binding');
  }
  function detach() {
    closed = true;
    if (detached) return;
    detached = true;
    if (!rawStream || !dataListeners) return;
    if (
      !exact(rawStream, streamPrototype) ||
      own(rawStream, 'Aa') !== capturedWrapper ||
      own(rawStream, 'ka') !== dataListeners ||
      own(streamPrototype, 'removeListener') !== streamRemove
    )
      fail('binding');
    unshadowed(rawStream, 'removeListener');
    listenerList(dataListeners);
    let matches = 0;
    for (let i = 0; i < dataListeners.length; i++)
      if (own(dataListeners, i) === observeRaw) matches++;
    if (matches !== 1) fail('binding');
    Reflect.apply(streamRemove, rawStream, ['data', observeRaw]);
    for (let i = 0; i < dataListeners.length; i++)
      if (own(dataListeners, i) === observeRaw) fail('binding');
  }
  function observeRaw(value: unknown) {
    if (detached || observationFailed) return;
    try {
      streamMethods();
      streamState();
      if (
        !exact(value, responsePrototype) ||
        own(rawObserver, 'next') !== rawNext ||
        own(rawObserver, 'error') !== rawError
      )
        fail('binding');
      Reflect.apply(rawNext, rawObserver, [value]);
      if (!detached && !observationFailed) {
        streamMethods();
        streamState();
        if (own(rawObserver, 'next') !== rawNext || own(rawObserver, 'error') !== rawError)
          fail('binding');
      }
    } catch {
      closed = true;
      observationFailed = true;
      try {
        Reflect.apply(rawError, rawObserver, []);
      } catch {}
    }
  }
  function attachStream(value: unknown) {
    if (!exact(value, streamPrototype)) fail('stream');
    rawStream = value;
    streamMethods();
    for (const key of Reflect.ownKeys(value)) {
      if (!['ka', 'wa', 'oa', 'ha', 'Aa', 'Da'].includes(key as string)) fail('stream');
      own(value, key);
    }
    if (
      Reflect.ownKeys(value).length !== 6 ||
      own(value, 'Aa') !== capturedWrapper ||
      own(value, 'Da') !== false
    )
      fail('binding');
    for (const key of ['on', 'removeListener', 'cancel']) unshadowed(value, key);
    for (const key of ['ka', 'wa', 'oa', 'ha']) {
      const list = listenerList(own(value, key));
      if (list.length) fail('stream');
      rawArrays.set(key, list);
    }
    const callbacks = listenerList(own(value, 'ka'));
    live();
    streamMethods();
    if (
      !exact(value, streamPrototype) ||
      own(value, 'Aa') !== capturedWrapper ||
      own(value, 'Da') !== false
    )
      fail('binding');
    for (const key of ['on', 'removeListener', 'cancel']) unshadowed(value, key);
    for (const [key, list] of rawArrays)
      if (own(value, key) !== list || listenerList(list).length) fail('binding');
    dataListeners = callbacks;
    const result = Reflect.apply(streamOn, value, ['data', observeRaw]);
    if (
      result !== value ||
      own(value, 'ka') !== callbacks ||
      callbacks.length !== 1 ||
      own(callbacks, 0) !== observeRaw
    )
      fail('binding');
    streamMethods();
    live();
    streamMethods();
    streamState();
  }

  const uriPrototype = proto('xg');
  const queryPrototype = proto('Cg');
  const transportBase = proto('Cua');
  // The post-Htc assignment fence relies on this exact normal transfer order.
  const baseTransfer = source(
    own(transportBase, 'transfer'),
    'transfer(a){this.aborted=\n!1;uua(this,a);a.setParam("rt",this.uI);var b=a.Da,c=Object.assign({},a.z3c,{method:a.ka});if(zua(a)){vua(this,a);let d=Aua(a),e=a.OCc;d&&e?iua(d,e).then(f=>{this.isDisposed()||this.aborted||this.ha!==a||(b.set("Content-Encoding",e),this.xhr.send(a.getUrl(),c,f,b))}):this.xhr.send(a.getUrl(),c,d,b)}else this.xhr.send(a.getUrl(),c,null,b)}',
  );
  const xhrClass = callable(exported('Xj'));
  const xhrPrototype = proto('Xj');
  const xhrSend = source(
    own(xhrPrototype, 'send'),
    'function(a,b,c,d){if(this.vk)throw Error("Xb`"+this.FAa+"`"+a);if(typeof b==="string")var e=b;else if(b){var f=b;e=f.method;c!=null||(c=f.body);d!=null||(d=f.headers)}e=e?e.toUpperCase():"GET";this.FAa=a;this.DG="";this.D6=0;this.nIc=!1;this.nE=!0;this.vk=this.Xtb(f);this.vk.onreadystatechange=(0,_.qe)((0,_.$b)(this.J7d,this));this.R3f&&"onprogress"in this.vk&&(this.vk.onprogress=(0,_.qe)((0,_.$b)(function(k){this.I7d(k,!0)},this)),this.vk.upload&&(this.vk.upload.onprogress=(0,_.qe)((0,_.$b)(this.I7d,\nthis))));try{this.TOc=!0,this.vk.open(e,String(a),!0),this.TOc=!1}catch(k){this.Aq(5,k);return}a=c||"";b=new Map(this.headers);if(d)if(Object.getPrototypeOf(d)===Object.prototype)for(var g in d)b.set(g,d[g]);else if(typeof d.keys==="function"&&typeof d.get==="function")for(let k of d.keys())b.set(k,d.get(k));else throw Error("Yb`"+String(d));d=Array.from(b.keys()).find(k=>"content-type"==k.toLowerCase());g=_.fa.FormData&&a instanceof _.fa.FormData;!_.xa(_.xta,e)||d||g||b.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");\nfor(let [k,r]of b)this.vk.setRequestHeader(k,r);this.uI&&(this.vk.responseType=this.uI);"withCredentials"in this.vk&&this.vk.withCredentials!==this.dD&&(this.vk.withCredentials=this.dD);if("setTrustToken"in this.vk&&this.Rbd)try{this.vk.setTrustToken(this.Rbd)}catch(k){}if("setAttributionReporting"in this.vk&&this.mzc)try{this.vk.setAttributionReporting(this.mzc)}catch(k){}try{this.Fua&&(clearTimeout(this.Fua),this.Fua=null),this.Vlb>0&&(this.Fua=setTimeout(this.lH.bind(this),this.Vlb)),this.t6b=\n!0,this.vk.send(a),this.t6b=!1}catch(k){this.Aq(5,k)}}',
    'source-async',
  );
  const xhrFactory = source(
    own(xhrPrototype, 'Xtb'),
    'function(a){return this.lPb?this.lPb.Z8(a):_.bja.Z8()}',
    'source-async',
  );
  const xhrReady = source(
    own(xhrPrototype, 'J7d'),
    'function(){this.isDisposed()||(this.TOc||this.t6b||this.MWa?Cta(this):this.l_c())}',
    'source-async',
  );
  const xhrNotify = callable(own(xhrPrototype, 'l_c'));
  const rawNotifySource = 'function(){Cta(this)}';
  notifyCheck = () => {
    if (own(xhrPrototype, 'l_c') !== xhrNotify) fail('binding');
  };
  if (Reflect.apply(functionSource, xhrNotify, []) !== rawNotifySource) {
    source(
      xhrNotify,
      'function(){if(a.isDisposed())return b.apply(this,arguments);try{return b.apply(this,arguments)}catch(d){S1o(a,d)}}',
      'source-notify',
    );
    const protectedRoot = exported('Cr');
    const monitor = own(protectedRoot, 'ka');
    if (!object(monitor)) fail('binding');
    const monitorPrototype = Object.getPrototypeOf(monitor);
    if (!object(monitorPrototype)) fail('binding');
    const baseClass = source(
      exported('Eb'),
      'function(){this.n5=this.n5;this.b_a=this.b_a}',
      'source-notify',
    );
    const basePrototype = proto('Eb');
    const disposed = source(
      own(basePrototype, 'isDisposed'),
      'function(){return this.n5}',
      'source-notify',
    );
    const monitorClass = source(
      own(monitorPrototype, 'constructor'),
      'function(a){_.Eb.call(this);this.oa=a;this.ka=!0;this.ha=!1}',
      'source-notify',
    );
    const wrap = source(
      own(monitorPrototype, 'wrap'),
      'function(a){return P1o(this,a)}',
      'source-notify',
    );
    const unwrap = source(
      own(monitorPrototype, 'unwrap'),
      'function(a){return a[Q1o(this,!1)]||a}',
      'source-notify',
    );
    const identity = source(
      exported('Fd'),
      'function(a){return Object.prototype.hasOwnProperty.call(a,Tea)&&a[Tea]||(a[Tea]=++Uea)}',
      'source-notify',
    );
    const report = callable(own(monitor, 'oa'));
    const monitors = exported('vga');
    const uidKeys = Reflect.ownKeys(monitor).filter(
      (key) => typeof key === 'string' && /^closure_uid_(0|[1-9]\d{0,8})$/.test(key),
    );
    if (uidKeys.length !== 1) fail('binding');
    const uidKey = uidKeys[0]!;
    const uid = own(monitor, uidKey);
    if (typeof uid !== 'number' || !Number.isSafeInteger(uid) || uid <= 0) fail('binding');
    const protectedKey = `__protected_${uid}__`;
    const wrapperKey = `__wrapper_${uid}__`;
    const original = source(own(xhrNotify, protectedKey), rawNotifySource, 'source-notify');
    function linked(fn: Call, key: string, expected: Call) {
      if (Object.getPrototypeOf(fn) !== Function.prototype) fail('binding');
      unshadowed(fn, 'apply');
      const keys = Reflect.ownKeys(fn).filter(
        (item) => typeof item === 'string' && /^__(protected|wrapper)_/.test(item),
      );
      if (keys.length !== 1 || keys[0] !== key || own(fn, key) !== expected) fail('binding');
    }
    const currentNotify = notifyCheck;
    notifyCheck = () => {
      currentNotify();
      if (
        exported('Cr') !== protectedRoot ||
        own(protectedRoot, 'ka') !== monitor ||
        exported('wga') !== true ||
        exported('vga') !== monitors ||
        !Array.isArray(monitors) ||
        Object.getPrototypeOf(monitors) !== Array.prototype ||
        own(monitors, 'length') !== 1 ||
        Reflect.ownKeys(monitors).length !== 2 ||
        own(monitors, 0) !== monitor ||
        Object.getPrototypeOf(monitor) !== monitorPrototype ||
        Object.getPrototypeOf(monitorPrototype) !== basePrototype ||
        Object.getPrototypeOf(basePrototype) !== Object.prototype ||
        exported('Eb') !== baseClass ||
        proto('Eb') !== basePrototype ||
        own(basePrototype, 'constructor') !== baseClass ||
        own(basePrototype, 'isDisposed') !== disposed ||
        own(basePrototype, 'n5') !== false ||
        own(monitorPrototype, 'constructor') !== monitorClass ||
        own(monitorClass, 'prototype') !== monitorPrototype ||
        own(monitorPrototype, 'wrap') !== wrap ||
        own(monitorPrototype, 'unwrap') !== unwrap ||
        exported('Fd') !== identity ||
        own(monitor, 'oa') !== report ||
        own(monitor, 'ka') !== true ||
        own(monitor, 'ha') !== true ||
        own(monitor, 'n5') !== false ||
        own(monitor, uidKey) !== uid ||
        Reflect.ownKeys(monitor).filter(
          (key) => typeof key === 'string' && /^closure_uid_/.test(key),
        ).length !== 1
      )
        fail('binding');
      for (const key of ['wrap', 'unwrap', 'isDisposed']) unshadowed(monitor, key);
      unshadowed(monitorPrototype, 'isDisposed');
      linked(xhrNotify, protectedKey, original);
      linked(original, wrapperKey, xhrNotify);
    };
    notifyCheck();
  }
  const xhrReadMethods: Array<[string, Call]> = [
    [
      'pea',
      source(
        own(xhrPrototype, 'pea'),
        'function(){return this.vk?this.vk.readyState:0}',
        'source-async',
      ),
    ],
    [
      'Ln',
      source(
        own(xhrPrototype, 'Ln'),
        'function(){try{return this.vk?this.vk.responseText:""}catch(a){return""}}',
        'source-async',
      ),
    ],
    ['Xu', source(own(xhrPrototype, 'Xu'), 'function(){return this.pea()==4}', 'source-async')],
  ];
  const nativeFactory = exported('bja');
  const nativeFactoryPrototype = proto('cja');
  const fetchFactoryPrototype = proto('Mta');
  const nativeCreate = source(
    own(nativeFactoryPrototype, 'Z8'),
    'function(){return new XMLHttpRequest}',
    'source-factory',
  );
  const fetchCreate = source(
    own(fetchFactoryPrototype, 'Z8'),
    'function(a){var b=new Zj(this.wa,this.ka,this.oa);this.ha&&(b.Aa=this.ha);a&&(b.oa=a);return b}',
    'source-factory',
  );
  const setterSource = 'function(a,b){_.soa(this.oa,a,b)}';
  const managerBase = proto('Yb');
  const queuePrototype = proto('Zta');
  let active = false;
  let unrelatedPath: string | undefined;
  let begun = false;
  let captured = false;
  let expectedPath: string | undefined;
  let serialized: string | undefined;
  let body: unknown;
  let low: object | undefined;
  let manager: unknown;
  let transport: object | undefined;
  let xhr: object | undefined;
  let setter: Call | undefined;
  let context: object | undefined;
  let selectedValue: unknown;
  let contextGet: (() => unknown) | undefined;
  let contextSet: ((this: unknown, value: unknown) => void) | undefined;
  let rtBound = false;
  let transferGuard: Call | undefined;
  let callbacks: object | undefined;
  let stcGuard: Call | undefined;
  const admittedBatches = new WeakSet<object>();

  function configuredPath(suffix: string): string {
    const prefix = Reflect.apply(configString, undefined, [
      Reflect.apply(config, undefined, ['eptZe']),
      '',
    ]);
    if (
      typeof prefix !== 'string' ||
      prefix.length > 128 ||
      (prefix !== '' && !/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(prefix))
    )
      fail('handoff');
    return prefix + suffix;
  }
  const surveyMethods = [
    ['PCck7e', '/TaskService.GetCandidates', true],
    ['sofYMe', '/TaskService.GetTaskForRendering', true],
    ['Fws7If', '/ResponseService.Write', false],
  ] as const;
  function unrelatedRoute(metadata: unknown, profile: 'stream' | 'batch'): string {
    if (!object(metadata)) fail('descriptor');
    const id = own(metadata, 'Ob');
    const method = own(metadata, 'Sb');
    if (
      typeof id !== 'string' ||
      !/^[A-Za-z0-9]{3,16}$/.test(id) ||
      id === 'RxAFq' ||
      own(exported('Uy'), 'o_' + id) !== metadata ||
      typeof method !== 'string' ||
      method.includes('StreamGenerate') ||
      typeof own(metadata, 'Rb') !== 'boolean' ||
      (profile === 'stream' && own(metadata, 'Rb') !== false)
    )
      fail('descriptor');
    const match = /^\/BardFrontendService\.([A-Za-z][A-Za-z0-9_]*)$/.exec(method);
    const survey = surveyMethods.find(([rpcId]) => rpcId === id);
    if (
      id === 'otAQ7b' ||
      method === '/BardFrontendService.GetUserStatus' ||
      own(exported('Uy'), 'o_otAQ7b') === metadata
    ) {
      const declaration = exported('Ofc');
      const marker = exported('kl');
      if (
        profile !== 'batch' ||
        id !== 'otAQ7b' ||
        method !== '/BardFrontendService.GetUserStatus' ||
        own(metadata, 'Rb') !== true ||
        own(metadata, 'Ub') !== exported('Nfc') ||
        typeof marker !== 'symbol'
      )
        fail('descriptor');
      for (const key of ['Ob', 'Sb', 'Rb', 'Pb', 'Ub'])
        if (own(metadata, key) !== own(declaration, key)) fail('descriptor');
      for (const tuple of [metadata, declaration])
        if (
          own(tuple, marker) !== true ||
          own(tuple, 'qsa') !== missing ||
          own(tuple, 'oqa') !== missing
        )
          fail('descriptor');
    }
    let route: string;
    if (survey) {
      const marker = exported('kl');
      if (
        profile !== 'batch' ||
        method !== survey[1] ||
        own(metadata, 'Rb') !== survey[2] ||
        typeof marker !== 'symbol' ||
        own(metadata, marker) !== true ||
        own(metadata, 'qsa') !== missing ||
        own(metadata, 'oqa') !== missing
      )
        fail('descriptor');
      route = survey[1];
    } else {
      if (!match) fail('descriptor');
      route = '/assistant.lamda.BardFrontendService/' + match[1];
    }
    for (const key of ['qsa', 'oqa']) {
      const field = own(metadata, key);
      if ((profile === 'stream' || field !== missing) && field !== route) fail('descriptor');
    }
    const input = own(metadata, 'Ub');
    const output = own(metadata, 'Pb');
    if (input === exported('zL') || output === exported('HF')) fail('descriptor');
    const inputPrototype = own(callable(input), 'prototype');
    const outputPrototype = own(callable(output), 'prototype');
    if (
      !object(inputPrototype) ||
      !object(outputPrototype) ||
      Object.getPrototypeOf(inputPrototype) !== baseMessage ||
      Object.getPrototypeOf(outputPrototype) !== baseMessage
    )
      fail('descriptor');
    return route;
  }
  function unrelatedBody(value: unknown, path?: string): object {
    if (exact(value, bodyPrototype)) return value;
    if (!exact(value, batchPrototype)) fail('binding');
    if (path !== undefined) {
      if (path !== configuredPath('data/batchexecute')) fail('handoff');
    } else if (!admittedBatches.has(value)) fail('binding');
    // Axa writes repeated Eta in Fta field 1, and each RPC marker in Eta field 1.
    // Field 2 is the serialized request and is never read here.
    const entries = Reflect.apply(repeatedBodyField, undefined, [value, etaClass, 1]);
    if (!exact(entries, Array.prototype)) fail('descriptor');
    const length = own(entries, 'length');
    if (typeof length !== 'number' || !Number.isSafeInteger(length) || length < 1 || length > 64)
      fail('descriptor');
    for (let i = 0; i < length; i++) {
      const entry = own(entries, i);
      if (!exact(entry, bodyPrototype)) fail('descriptor');
      const marker = Reflect.apply(bodyField, undefined, [entry, 1]);
      if (typeof marker !== 'string') fail('descriptor');
      let metadata: unknown;
      if (/^[A-Za-z0-9]{3,16}$/.test(marker)) metadata = own(exported('Uy'), 'o_' + marker);
      else if (surveyMethods.some(([, method]) => method === marker)) {
        const survey = surveyMethods.find(([, method]) => method === marker)!;
        metadata = own(exported('Uy'), 'o_' + survey[0]);
      } else {
        const match = /^\/BardFrontendService\.([A-Za-z][A-Za-z0-9_]*)$/.exec(marker);
        if (!match) fail('descriptor');
        const declaration =
          match[1] === 'ListConversationTurns'
            ? exported('RGd')
            : match[1] === 'GetConversationTurn'
              ? exported('HGd')
              : match[1] === 'GetUserStatus'
                ? exported('Ofc')
                : undefined;
        if (declaration !== undefined) {
          const id = own(declaration, 'Ob');
          if (typeof id !== 'string' || !/^[A-Za-z0-9]{3,16}$/.test(id)) fail('descriptor');
          metadata = own(exported('Uy'), 'o_' + id);
          for (const key of ['Ob', 'Sb', 'Rb', 'Pb', 'Ub'])
            if (own(metadata, key) !== own(declaration, key)) fail('descriptor');
        } else metadata = own(exported('Uy'), 'u_/assistant.lamda.BardFrontendService/' + match[1]);
        if (!object(metadata) || own(metadata, 'Sb') !== marker) fail('descriptor');
      }
      unrelatedRoute(metadata, 'batch');
    }
    if (path !== undefined) admittedBatches.add(value);
    return value;
  }

  function admittedWa(value: object): void {
    const p: unknown = Object.getPrototypeOf(value);
    if (!object(p) || Object.getPrototypeOf(p) !== Object.prototype) fail('source-profile');
    const slot = Object.getOwnPropertyDescriptor(value, 'Wa');
    if (slot) {
      if (!Object.hasOwn(slot, 'value') || !slot.writable) fail('runtime-shape');
    } else {
      unshadowed(p, 'Wa');
      unshadowed(Object.prototype, 'Wa');
    }
  }
  function pool(value: unknown): object {
    const entries = own(value, 'oa');
    if (!exact(entries, Array.prototype)) fail('runtime-shape');
    const length = own(entries, 'length');
    // Reviewed cva registers ava/uYb, each cloned up to Wj.wBb=10.
    if (typeof length !== 'number' || !Number.isSafeInteger(length) || length < 1 || length > 20)
      fail('binding');
    for (let i = 0; i < length; i++) if (!object(own(entries, i))) fail('binding');
    return entries;
  }
  function selectedMember(selected: object): void {
    const entries = pool(manager);
    const length = own(entries, 'length') as number;
    let matches = 0;
    for (let i = 0; i < length; i++) if (own(entries, i) === selected) matches++;
    if (matches !== 1) fail('binding');
  }

  function requestShape(value: unknown, expectedManager: unknown): object {
    if (!object(value) || own(value, 'Aa') !== expectedManager) fail('binding');
    const p: unknown = Object.getPrototypeOf(value);
    if (
      !object(p) ||
      Object.getPrototypeOf(p) !== Object.prototype ||
      own(own(p, 'constructor'), 'prototype') !== p
    )
      fail('source-profile');
    source(own(p, 'setParam'), setterSource);
    source(own(p, 'getContext'), 'function(){return this.Wa}');
    source(own(p, 'getUrl'), 'function(){return String(this.oa.clone())}');
    source(own(p, 'Ni'), 'function(a){this.Wa=a}');
    admittedWa(value);
    unshadowed(value, 'getContext');
    unshadowed(value, 'getUrl');
    const uri = own(value, 'oa');
    if (!exact(uri, uriPrototype)) fail('binding');
    const query = own(uri, 'ka');
    if (!exact(query, queryPrototype)) fail('binding');
    for (const key of ['ha', 'ka', 'oa', 'wa']) {
      const descriptor = Object.getOwnPropertyDescriptor(query, key);
      if (!descriptor || !Object.hasOwn(descriptor, 'value')) fail('runtime-shape');
    }
    const storage = own(query, 'ha');
    if (storage !== null && !exact(storage, Map.prototype)) fail('binding');
    for (const key of ['remove', 'add', 'clone', 'QE', 'toString']) {
      unshadowed(query, key);
      callable(own(queryPrototype, key));
    }
    if (object(storage))
      for (const key of ['get', 'set', 'has', 'delete', 'keys', 'forEach'])
        unshadowed(storage, key);
    unshadowed(uri, 'clone');
    unshadowed(uri, 'toString');
    return value;
  }
  function managerShape(value: unknown): object {
    if (!object(value)) fail('binding');
    const p: unknown = Object.getPrototypeOf(value);
    if (
      !object(p) ||
      Object.getPrototypeOf(p) !== managerBase ||
      own(own(p, 'constructor'), 'prototype') !== p
    )
      fail('source-profile');
    unshadowed(value, 'send');
    for (const key of ['isDisposed', 'dispatchEvent']) {
      unshadowed(value, key);
      unshadowed(p, key);
    }
    source(
      own(p, 'send'),
      'function(a){this.isDisposed()?Lua(this,a,107):(this.dispatchEvent(new Jua("e")),this.wa.enqueue(a),Mua(this))}',
    );
    const queue = own(value, 'wa');
    if (!exact(queue, queuePrototype)) fail('source-profile');
    for (const key of ['enqueue', 'peek', 'dequeue']) {
      unshadowed(queue, key);
      callable(own(queuePrototype, key));
    }
    for (const key of ['ha', 'ka']) {
      const array = own(queue, key);
      if (!exact(array, Array.prototype)) fail('binding');
      for (const method of ['push', 'pop', 'reverse']) unshadowed(array, method);
    }
    pool(value);
    return value;
  }
  function contextIdentity(): void {
    if (!context || !low || own(low, 'Wa') !== context) fail('binding');
    const d = Object.getOwnPropertyDescriptor(context, 'ka');
    if (!d || d.get !== contextGet || d.set !== contextSet || !d.configurable || !d.enumerable)
      fail('binding');
  }
  function transportShape(value: unknown): object {
    if (!object(value)) fail('binding');
    const p: unknown = Object.getPrototypeOf(value);
    if (
      !object(p) ||
      Object.getPrototypeOf(p) !== transportBase ||
      own(own(p, 'constructor'), 'prototype') !== p
    )
      fail('source-profile');
    if (value === transport && transferGuard) {
      if (own(value, 'transfer') !== transferGuard) fail('binding');
    } else unshadowed(value, 'transfer');
    unshadowed(value, 'abort');
    unshadowed(value, 'isDisposed');
    const ownerSlot = Object.getOwnPropertyDescriptor(value, 'ha');
    if (!ownerSlot || !Object.hasOwn(ownerSlot, 'value') || !ownerSlot.writable)
      fail('runtime-shape');
    if (typeof own(value, 'aborted') !== 'boolean' || typeof own(value, 'uI') !== 'string')
      fail('source-profile');
    const override = own(p, 'transfer');
    if (override === missing) {
      if (own(transportBase, 'transfer') !== baseTransfer) fail('source-profile');
    } else {
      if (typeof own(value, 'wa') !== 'boolean') fail('source-profile');
      source(
        override,
        'transfer(a){this.wa||\n_.Vj("transfer() called during response processing",Error());this.wa=!1;this.oa=0;this.Va=!1;super.transfer(a)}',
      );
      if (own(transportBase, 'transfer') !== baseTransfer) fail('source-profile');
    }
    for (const [key, expected] of [
      ['kb', 'kb(){this.xhr.pea()==3&&KZb(this,!1)}'],
      ['ob', 'ob(){KZb(this,!0)}'],
      ['Aa', 'Aa(a){var b=this.Ja&&a.getStatus()>=500;KZb(this,!0,b);super.Aa(a)}'],
    ] as const) {
      unshadowed(value, key);
      if (override !== missing || own(p, key) !== missing)
        source(own(p, key), expected, 'source-handler');
    }
    unshadowed(p, 'abort');
    unshadowed(p, 'isDisposed');
    return value;
  }
  function backend(value: unknown, guarded = false): object {
    notifyCheck();
    if (!exact(value, xhrPrototype)) fail('backend');
    if (!guarded) unshadowed(value, 'send');
    unshadowed(value, 'Xtb');
    if (own(xhrPrototype, 'send') !== xhrSend || own(xhrPrototype, 'Xtb') !== xhrFactory)
      fail('backend');
    for (const [key, method] of xhrReadMethods) {
      unshadowed(value, key);
      if (own(xhrPrototype, key) !== method) fail('source-profile');
    }
    for (const key of ['J7d', 'l_c']) unshadowed(value, key);
    if (own(xhrPrototype, 'J7d') !== xhrReady || own(xhrPrototype, 'l_c') !== xhrNotify)
      fail('source-profile');
    const factory = own(value, 'lPb');
    if (factory === null) {
      if (!exact(nativeFactory, nativeFactoryPrototype)) fail('backend');
      unshadowed(nativeFactory, 'Z8');
      if (exported('bja') !== nativeFactory || own(nativeFactoryPrototype, 'Z8') !== nativeCreate)
        fail('backend');
    } else {
      if (
        !exact(factory, fetchFactoryPrototype) ||
        own(factory, 'wa') !== null ||
        own(factory, 'ka') !== false ||
        own(factory, 'oa') !== false
      )
        fail('backend');
      unshadowed(factory, 'Z8');
      if (own(fetchFactoryPrototype, 'Z8') !== fetchCreate) fail('backend');
      const mode = Object.getOwnPropertyDescriptor(factory, 'ha');
      if (mode && !Object.hasOwn(mode, 'value')) fail('runtime-shape');
    }
    return value;
  }
  function receive(this: unknown, ...args: unknown[]): unknown {
    if (this !== service || args.length !== 1) fail('binding');
    const wrapper = args[0];
    if (!object(wrapper) || own(wrapper, 'Ha') !== service) fail('binding');
    if (body !== undefined && own(wrapper, 'Aa') === body) fail('retry');
    const path = own(wrapper, 'Da');
    if (typeof path !== 'string') fail('handoff');
    if (active && !captured && !unrelatedPath && path !== expectedPath) fail('handoff');
    if (!path.endsWith('data' + jsa)) {
      // Only positively unrelated native SDK requests may keep using the service.
      if (unrelatedPath && !path.endsWith('data' + unrelatedPath)) fail('handoff');
      const options = own(wrapper, 'ka');
      const otherManager = own(options, 'Dqg') === true ? own(service, 'ka') : own(service, 'wa');
      managerShape(otherManager);
      const other = requestShape(own(wrapper, 'ha'), otherManager);
      if (own(other, 'ub') !== own(wrapper, 'Aa')) fail('binding');
      unrelatedBody(own(other, 'ub'), path);
      return Reflect.apply(sendRequest, service, args);
    }
    if (!active) fail('handoff');
    live();
    if (captured || own(wrapper, 'Da') !== expectedPath) fail('handoff');
    const nextBody = own(wrapper, 'Aa');
    if (
      !exact(nextBody, bodyPrototype) ||
      Reflect.apply(bodyField, undefined, [nextBody, 2]) !== serialized
    )
      fail('handoff');
    const options = own(wrapper, 'ka');
    const selectedManager = own(options, 'Dqg') === true ? own(service, 'ka') : own(service, 'wa');
    managerShape(selectedManager);
    const request = requestShape(own(wrapper, 'ha'), selectedManager);
    if (own(request, 'ub') !== nextBody || own(request, 'Uwb') !== 'FAIL') fail('binding');
    unshadowed(request, 'setParam');
    unshadowed(request, 'Ni');
    setter = callable(own(Object.getPrototypeOf(request), 'setParam'));
    captured = true;
    capturedWrapper = wrapper;
    wrapperPrototype = Object.getPrototypeOf(wrapper);
    if (!object(wrapperPrototype)) fail('source-profile');
    unshadowed(wrapper, 'cancel');
    wrapperCancel = source(own(wrapperPrototype, 'cancel'), 'cancel(){this.oa.cancel()}');
    deferredMethods();
    const deferred = own(wrapper, 'oa');
    if (!exact(deferred, deferredPrototype)) fail('binding');
    unshadowed(deferred, 'cancel');
    cancelOwner = deferred;
    body = nextBody;
    low = request;
    manager = selectedManager;
    serialized = undefined;
    const writeParameter: Call = function (this: unknown, ...parameters: unknown[]) {
      if (this !== request) fail('binding');
      if (own(request, 'setParam') !== writeParameter) fail('binding');
      if (parameters[0] === 'rt') {
        live();
        contextIdentity();
        if (
          !transport ||
          selectedValue !== transport ||
          own(transport, 'ha') !== request ||
          own(transport, 'xhr') !== xhr
        )
          fail('binding');
        transportShape(transport);
        selectedMember(transport);
        backend(xhr, true);
        rtBound = true;
      }
      if (parameters[0] === 'rt') live();
      return Reflect.apply(setter!, request, parameters);
    };
    install(request, 'setParam', writeParameter);
    const attachContext = source(
      own(Object.getPrototypeOf(request), 'Ni'),
      'function(a){this.Wa=a}',
    );
    const bindContext: Call = function (this: unknown, ...contexts: unknown[]) {
      live();
      if (
        this !== request ||
        contexts.length !== 1 ||
        context ||
        own(request, 'Ni') !== bindContext
      )
        fail('binding');
      if (own(request, 'setParam') !== writeParameter) fail('binding');
      const fresh = contexts[0];
      if (!object(fresh) || !Object.isExtensible(fresh)) fail('binding');
      const p: unknown = Object.getPrototypeOf(fresh);
      if (
        !object(p) ||
        Object.getPrototypeOf(p) !== Object.prototype ||
        own(own(p, 'constructor'), 'prototype') !== p
      )
        fail('source-profile');
      source(own(p, 'reset'), 'reset(){this.Aq=this.ka=null}');
      unshadowed(fresh, 'reset');
      unshadowed(fresh, 'ka');
      unshadowed(p, 'ka');
      const arrays = own(fresh, 'wa');
      const headers = own(fresh, 'oa');
      const backoff = own(fresh, 'wbc');
      if (
        !exact(arrays, Array.prototype) ||
        own(arrays, 'length') !== 0 ||
        !exact(headers, Object.prototype) ||
        Reflect.ownKeys(headers).length !== 0 ||
        typeof backoff !== 'number' ||
        !Number.isFinite(backoff)
      )
        fail('binding');
      for (const [key, value] of [
        ['i0c', 0],
        ['xFb', -1],
        ['wFb', 0],
        ['qta', 0],
        ['sKe', 0],
        ['wbc', 0],
      ] as const)
        if (own(p, key) !== value) fail('source-profile');
      context = fresh;
      contextGet = () => {
        contextIdentity();
        return selectedValue;
      };
      contextSet = function (this: unknown, value: unknown) {
        contextIdentity();
        if (this !== fresh) fail('binding');
        if (value === null) {
          closed = true;
          selectedValue = null;
          return;
        }
        live();
        managerShape(manager);
        if (selectedValue !== undefined || transport) fail('binding');
        const selected = transportShape(value);
        selectedMember(selected);
        const selectedXhr = backend(own(selected, 'xhr'));
        const physicalSend: Call = function (this: unknown, ...sendArgs: unknown[]) {
          if (
            this !== selectedXhr ||
            own(selected, 'xhr') !== selectedXhr ||
            own(selectedXhr, 'send') !== physicalSend
          )
            fail('binding');
          transportShape(selected);
          backend(selectedXhr, true);
          managerShape(manager);
          selectedMember(selected);
          if (!callbacks || own(selected, 'Wa') !== callbacks || own(callbacks, 'uxc') !== stcGuard)
            fail('binding');
          const owner = own(selected, 'ha');
          if (owner !== low) {
            const other = requestShape(owner, manager);
            unshadowed(other, 'setParam');
            unshadowed(other, 'Ni');
            const otherBody = own(other, 'ub');
            if (otherBody === body) fail('retry');
            unrelatedBody(otherBody);
            if (own(own(other, 'Wa'), 'ka') !== selected) fail('binding');
            return Reflect.apply(xhrSend, selectedXhr, sendArgs);
          }
          live();
          contextIdentity();
          if (
            selectedValue !== selected ||
            !rtBound ||
            own(request, 'setParam') !== writeParameter ||
            own(request, 'Ni') !== bindContext
          )
            fail('binding');
          // current() may reenter; attest the delegated owner and async profile after it.
          if (
            own(selected, 'xhr') !== selectedXhr ||
            own(selectedXhr, 'send') !== physicalSend ||
            own(selected, 'ha') !== low ||
            !callbacks ||
            own(selected, 'Wa') !== callbacks ||
            own(callbacks, 'uxc') !== stcGuard
          )
            fail('binding');
          transportShape(selected);
          backend(selectedXhr, true);
          managerShape(manager);
          selectedMember(selected);
          if (spent) fail('spent');
          spent = true;
          return Reflect.apply(xhrSend, selectedXhr, sendArgs);
        };
        install(selectedXhr, 'send', physicalSend);
        transport = selected;
        xhr = selectedXhr;
        const originalTransfer = callable(
          own(Object.getPrototypeOf(selected), 'transfer') === missing
            ? baseTransfer
            : own(Object.getPrototypeOf(selected), 'transfer'),
        );
        const callbackObject = own(selected, 'Wa');
        if (!exact(callbackObject, Object.prototype)) fail('source-profile');
        const callbackSlot = Object.getOwnPropertyDescriptor(callbackObject, 'uxc');
        if (
          !callbackSlot ||
          !Object.hasOwn(callbackSlot, 'value') ||
          !callbackSlot.writable ||
          !callbackSlot.configurable
        )
          fail('runtime-shape');
        const originalStc = callable(callbackSlot.value);
        callbacks = callbackObject;
        function transferRequest(args: unknown[]): void {
          if (args.length !== 1) fail('binding');
          if (args[0] === request) {
            live();
            contextIdentity();
            if (selectedValue !== selected) fail('binding');
          } else {
            const other = requestShape(args[0], manager);
            unshadowed(other, 'setParam');
            unshadowed(other, 'Ni');
            if (own(other, 'ub') === body || own(own(other, 'Wa'), 'ka') !== selected)
              fail('binding');
            unrelatedBody(own(other, 'ub'));
          }
          managerShape(manager);
          selectedMember(selected);
          transportShape(selected);
          if (
            own(selected, 'xhr') !== selectedXhr ||
            own(selected, 'Wa') !== callbackObject ||
            own(callbackObject, 'uxc') !== stcGuard
          )
            fail('binding');
          backend(selectedXhr, true);
        }
        stcGuard = function (this: unknown, ...parameters: unknown[]) {
          if (this !== callbackObject) fail('binding');
          transferRequest(parameters);
          const result = Reflect.apply(originalStc, callbackObject, parameters);
          // tua assigns ha immediately after Htc returns; fence the known writer here.
          transferRequest(parameters);
          return result;
        };
        Object.defineProperty(callbackObject, 'uxc', { ...callbackSlot, value: stcGuard });
        transferGuard = function (this: unknown, ...parameters: unknown[]) {
          if (this !== selected) fail('binding');
          transferRequest(parameters);
          return Reflect.apply(originalTransfer, selected, parameters);
        };
        install(selected, 'transfer', transferGuard);
        selectedValue = selected;
      };
      Object.defineProperty(fresh, 'ka', {
        get: contextGet,
        set: contextSet,
        configurable: true,
        enumerable: true,
      });
      live();
      admittedWa(request);
      return Reflect.apply(attachContext, request, contexts);
    };
    install(request, 'Ni', bindContext);
    live();
    return Reflect.apply(sendRequest, service, args);
  }
  install(service, 'sendRequest', receive);
  const streamGuard: Call = function (this: unknown, ...args: unknown[]) {
    if (this !== streaming || args.length !== 1) fail('binding');
    const packet = args[0];
    if (!exact(packet, requestPrototype)) fail('descriptor');
    for (const method of ['yx', 'qea', 'Tq', 'ha']) unshadowed(packet, method);
    const rpc = own(packet, 'rpcId');
    if (!exact(rpc, descriptorPrototype) || own(rpc, kindKey) !== 'server_streaming')
      fail('descriptor');
    unshadowed(rpc, 'IVa');
    unshadowed(rpc, 'Qyb');
    const metadata = own(rpc, descriptorKey);
    const message = own(packet, 'requestMessage');
    if (metadata !== registered) {
      const route = unrelatedRoute(metadata, 'stream');
      const inputPrototype = own(callable(own(metadata, 'Ub')), 'prototype');
      if (!object(inputPrototype) || !exact(message, inputPrototype)) fail('descriptor');
      unshadowed(message, 'serialize');
      unshadowed(inputPrototype, 'serialize');
      const previous = unrelatedPath;
      unrelatedPath = route;
      try {
        return Reflect.apply(stream, streaming, args);
      } finally {
        unrelatedPath = previous;
      }
    }
    live();
    if (begun) fail(spent ? 'spent' : 'stream');
    registeredDescriptor();
    if (!exact(message, messagePrototype)) fail('descriptor');
    unshadowed(message, 'serialize');
    const encoded = Reflect.apply(serialize, message, []);
    if (typeof encoded !== 'string') fail('handoff');
    expectedPath = configuredPath('data' + jsa);
    serialized = encoded;
    begun = true;
    active = true;
    try {
      live();
      const result = Reflect.apply(stream, streaming, args);
      if (!captured) fail('handoff');
      attachStream(result);
      return result;
    } catch (error) {
      closed = true;
      observationFailed = true;
      if (capturedWrapper && wrapperCancel) {
        try {
          cancelOwnedWrapper();
        } catch {}
      }
      if (rawStream && dataListeners) {
        try {
          detach();
        } catch {}
      }
      throw error;
    } finally {
      active = false;
      serialized = undefined;
    }
  };
  install(streaming, 'stream', streamGuard);
  return {
    close() {
      closed = true;
    },
    sent() {
      return spent;
    },
    detach,
  };
}
