import { geminiFixedTextContractFixture } from './gemini-fixed-text-contract';

// Handwritten source-shaped functions with synthetic closures; no provider cache is loaded.
export function geminiSdkWebChannelFixture(
  codec: 'json' | 'protobuf' = 'json',
  lifecycle: boolean | 'wvb' = false,
) {
  const contract = geminiFixedTextContractFixture();
  const { namespace: _, approved, packet, wire } = contract;
  const calls = {
    factory: 0,
    open: 0,
    config: 0,
    query: 0,
    protocolClose: 0,
    forward: 0,
    backchannel: 0,
    terminate: 0,
    nativeSends: 0,
  };
  const pending: Array<() => void> = [];
  const timers = new Map<number, () => void>();
  let timerId = 0;
  let now = 1;
  let synchronousOpenEvent = false;
  let handshakeProtocol: string | null = null;
  const requests: any[] = [];
  const images: unknown[] = [];
  const protocolErrors: Array<{ errorCode: number }> = [];
  const nativeTransmissions: Array<{ receiver: object; args: unknown[] }> = [];
  class SyntheticImage {
    set src(value: unknown) {
      images.push(value);
    }
  }
  const receiveTrace: Array<{ stage: string; value?: unknown }> = [];
  let receiveHook = (_stage: string, _value?: unknown) => {};
  let projectResponse: ((value: any, request: any, destination: any) => void) | undefined;
  const traceReceive = (stage: string, value?: unknown) => {
    receiveTrace.push({ stage, value });
    receiveHook(stage, value);
  };
  let decodeHook = () => {};
  let decoded: any;
  let incoming: any;
  const serialized: Array<{ message: object; data: string }> = [];
  let subscribed = false;
  let bindObservable = (_value: unknown) => {};
  let outer: any;
  let responseSubscription: any;
  const deferredErrors: unknown[] = [];
  let owned: any;
  let beforeProtectedRequest = () => {};
  let beforeOriginalProducer = () => {};
  let beforeOriginalTeardown = () => {};
  let beforeCurrent = () => {};
  let beforeScope = () => {};
  let beforeFactory = () => {};
  let beforeConfig = () => {};
  let afterFactory = () => {};
  let afterConfig = () => {};
  let afterQuery = () => {};
  let live = true;
  let produced: any;
  const create = (text: string, bindings: Record<string, unknown> = {}) =>
    Function(
      '_',
      'Date',
      ...Object.keys(bindings),
      `return ${text}`,
    )(_, { now: () => now }, ...Object.values(bindings));
  // Source normalizers retain exact fingerprints; their private primitives are synthetic.
  const write = (a: any, field: number, value: any) => {
    if (Object.getPrototypeOf(a) === _.dM?.prototype && field === 1) calls.query++;
    a.fl[field - 1] = value;
    return a;
  };
  const copy = (value: any): any =>
    Array.isArray(value)
      ? value.map(copy)
      : value && typeof value === 'object' && value.fl
        ? new value.constructor(copy(value.fl))
        : value;
  _.l = class {
    fl: any[];
    constructor(a: any[] = []) {
      this.fl = a;
      if (new.target === _.tJd) produced = this;
      Object.defineProperty(a, _.La, { value: a[_.La] ?? 2144, writable: true });
    }
    serialize(a?: unknown) {
      return JSON.stringify(_.Hba(this, a));
    }
  };
  _.l.prototype.serialize = create(
    'class{serialize(a){return JSON.stringify(_.Hba(this,a))}}',
  ).prototype.serialize;
  for (const name of [
    'zL',
    'yL',
    'wL',
    'Txd',
    'CI',
    'DI',
    'xzd',
    'HJd',
    'BJd',
    'AJd',
    'tJd',
    'qJd',
    'nJd',
    'LAd',
    'dM',
    'hJd',
    'UId',
    'HF',
    'R4c',
    'zF',
    'XZc',
    'bw',
  ])
    _[name] = class extends _.l {};
  // Synthetic nb/Gba ownership leaves execute the exact reached public ob body.
  const jsonArray = (a: any[], project: (v: any) => any): any[] =>
    a.map((v) =>
      v && Object.getPrototypeOf(v) === Object.prototype
        ? Object.fromEntries(Object.entries(v).map(([k, entry]) => [k, project(entry)]))
        : project(v),
    );
  _.Dba = (v: bigint) =>
    v >= BigInt(Number.MIN_SAFE_INTEGER) && v <= BigInt(Number.MAX_SAFE_INTEGER);
  _.Qa = (v: any) => v instanceof _.l;
  _.lb ??= class {};
  _.pb = (a: any[], _flags: unknown, project: (v: any) => any) => jsonArray(a, project);
  _.qb = create(
    'function(a){switch(typeof a){case "number":return Number.isFinite(a)?a:""+a;case "bigint":return(0,_.Dba)(a)?Number(a):""+a;case "boolean":return a?1:0;case "object":if(Array.isArray(a)){let b=a[_.La]|0;return a.length===0&&b&1?void 0:_.pb(a,b,_.qb)}if(_.Qa(a))return Eba(a);if(a instanceof _.lb)return _.rb(a);if("function"==typeof _.sb&&a instanceof _.sb)return a.xog();return}return a}',
    { Eba: (v: any) => jsonArray(v.fl, _.qb) },
  );
  _.Hba = (value: any) => {
    const result = jsonArray(value.fl, _.qb);
    const data = JSON.stringify(result);
    serialized.push({ message: value, data });
    return result;
  };
  // Reached current Ki/ah/wpa/vpa/Ya and ob semantics, with inert synthetic writers.
  const nativeInt64 = (bigint = true) => {
    _.Xa = bigint;
    _.hb = Math.trunc;
    _.ib = Number.isSafeInteger;
    _.ae = BigInt.asIntN;
    _.Ua = (v: unknown) => typeof v === 'string';
    _.Va = (v: unknown) => typeof v === 'number';
    _.Qaa = (v: unknown) => typeof v === 'boolean';
    _.gb = (v: unknown) =>
      typeof v === 'bigint' ||
      (typeof v === 'number' && Number.isFinite(v)) ||
      (typeof v === 'string' && /^-?\d+$/.test(v));
    _.Ya = create(
      'function(a){var b=a;if((0,_.Ua)(b)){if(!/^\\s*(?:-?[1-9]\\d*|0)?\\s*$/.test(b))throw Error(String(b));}else if((0,_.Va)(b)&&!Number.isSafeInteger(b))throw Error(String(b));return _.Xa?BigInt(a):a=(0,_.Qaa)(a)?a?"1":"0":(0,_.Ua)(a)?a.trim()||"0":String(a)}',
    );
    const tpa = create(
      'function(a){a=(0,_.hb)(a);if(!(0,_.ib)(a)){_.ab(a);var b=_.Za,c=_.$a;if(a=c&2147483648)b=~b+1>>>0,c=~c>>>0,b==0&&(c=c+1>>>0);b=fpa(b,c);a=typeof b==="number"?a?-b:b:a?"-"+b:b}return a}',
    );
    const upa = create(
      'function(a){a=(0,_.hb)(a);(0,_.ib)(a)?a=String(a):(_.ab(a),a=gpa(_.Za,_.$a));return a}',
    );
    const rpa = create(
      'function(a){var b=(0,_.hb)(Number(a));if((0,_.ib)(b))return _.Ya(b);b=a.indexOf(".");b!==-1&&(a=a.substring(0,b));return _.Ja()?_.Ya((0,_.ae)(64,BigInt(a))):_.Ya(mpa(a))}',
    );
    const spa = create(
      'function(a){var b=(0,_.hb)(Number(a));if((0,_.ib)(b))return String(b);b=a.indexOf(".");b!==-1&&(a=a.substring(0,b));return mpa(a)}',
    );
    const vpa = create('function(a){return _.Ya((0,_.ib)(a)?a:qpa(a))}', { tpa: tpa, qpa: upa });
    const mpa = () => Error('synthetic-int64-refused');
    _.spa = create(
      'function(a,b){b!=null||(b=1024);if(!_.gb(a))throw ipa("int64");var c=typeof a;switch(b){case 512:switch(c){case "string":return opa(a);case "bigint":return String((0,_.ae)(64,a));default:return qpa(a)}case 1024:switch(c){case "string":return npa(a);case "bigint":return _.Ya((0,_.ae)(64,a));default:return rpa(a)}case 0:switch(c){case "string":return opa(a);case "bigint":return _.Ya((0,_.ae)(64,a));default:return ppa(a)}default:return _.db(b,"Unknown format requested type for int64")}}',
      { npa: rpa, opa: spa, ppa: tpa, qpa: upa, rpa: vpa, ipa: mpa },
    );
    _.ah = create('function(a){return a==null?a:_.spa(a,void 0)}');
    _.Ki = create('function(a,b,c){return _.Wh(a,b,_.ah(c))}');
  };

  _.Wj = JSON.stringify;
  // Codec leaves return the selected invented wire object; both original KRa closures execute.
  _.be = (value: unknown) => value;
  _.Lo = (_type: unknown, value: unknown) => {
    decodeHook();
    decoded = incoming ?? value;
    return decoded;
  };
  _.Ck = (value: unknown) => value;
  _.ci = create('function(a,b,c,d){return _.Qh(a,b,_.Zh(a,d,c))}');
  _.DL = create('function(a){return _.m(a,_.CI,2)}');
  const tHd = create(
    'class extends _.l{constructor(a){super(a)}getResponse(){return _.m(this,_.H5c,2)}}',
  );
  _.zJd = create('function(a){return _.ci(a,yJd,4,_.fM)}', { yJd: tHd });
  _.oi = (value: any, field: number) => value.fl[field - 1] === true;
  _.Vi = (value: any, field: number) => value.fl[field - 1] != null;

  _.Tg = create(
    'function(a,b){b===void 0&&(b=0);Woa();b=Voa[b];for(var c=Array(Math.floor(a.length/3)),d=b[64]||"",e=0,f=0;e<a.length-2;e+=3){var g=a[e],k=a[e+1],r=a[e+2],u=b[g>>2];g=b[(g&3)<<4|k>>4];k=b[(k&15)<<2|r>>6];r=b[r&63];c[f++]=u+g+k+r}u=0;r=d;switch(a.length-e){case 2:u=a[e+1],r=b[(u&15)<<2]||d;case 1:a=a[e],c[f]=b[a>>2]+b[(a&3)<<4|u>>4]+r+d}return c.join("")}',
    { Woa: () => {}, Voa: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='] },
  );
  _.DI.prototype.ig = function () {
    return this.fl[0];
  };
  _.CI.prototype.ig = create('class{ig(){return _.n(this,1)}}').prototype.ig;
  _.LAd.prototype.setLocale = function (v: unknown) {
    return write(this, 3, v);
  };
  _.hJd.prototype.setText = function (v: unknown) {
    return write(this, 1, v);
  };
  _.dM.prototype.Ni = create('class{Ni(a){return _.ei(this,6,_.cM,a)}}').prototype.Ni;
  _.tJd.prototype.Bg = create('class{Bg(a){return _.ei(this,2,_.eM,a)}}').prototype.Bg;
  _.m = create(
    'function(a,b,c,d){var e=a.fl,f=e[_.La]|0;b=Qoa(e,f,b,c,d);if(b==null)return b;f=e[_.La]|0;if(!_.Ra(a,f)){let g=_.Mg(b);g!==b&&(_.ub(a)&&(e=a.fl,f=e[_.La]|0),b=g,f=_.yb(e,f,c,b,d),_.Ng(e,f))}return b}',
    {
      Qoa: (a: any[], _f: unknown, C: any, n: number) => {
        if (a === ok.fl && n === 3) calls.config++;
        const v = a[n - 1];
        return v == null ? v : v instanceof C ? v : new C(v);
      },
    },
  );
  _.Qh = create(
    'function(a,b,c,d){a=a.fl;return Qoa(a,a[_.La]|0,b,c,d)||b[_.Xd]||(b[_.Xd]=_.iba(b))}',
    {
      Qoa: (a: any[], flags: number, C: any, n: number) => {
        const v = a[n - 1];
        if (v == null) return v;
        if (v instanceof C) return v;
        const child = new C(v);
        child.fl[_.La] |= flags & (32 | 2);
        return (a[n - 1] = child);
      },
    },
  );
  _.Mg = create(
    'function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?_.Rba(a,b,c)?_.Qba(a,b,!0):new a.constructor(_.tb(b,c,!1)):a}',
  );
  _.Bf = create(
    'function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?a:_.Rba(a,b,c)?_.Qba(a,b):new a.constructor(_.tb(b,c,!0))}',
  );
  _.Hh = create('function(a,b,c,d,e){d=Qpa(d);_.Wh(a,c,d,e);d&&!_.Ra(d)&&_.Ng(a.fl);return a}', {
    Qpa: (v: unknown) => v,
  });
  _.ub = create(
    'function(a){if(a.Fb!==_.Kaa)return!1;var b=a.fl;b=_.tb(b,b[_.La]|0);_.Ma(b,2048);a.fl=b;_.Laa(a,!1);a.Xbc=void 0;return!0}',
  );
  _.Ra = create(
    'function(a,b){return b===void 0?a.Fb!==_.Kaa&&!!(2&(a.fl[_.La]|0)):!!(2&b)&&a.Fb!==_.Kaa}',
  );
  // Exact bounded public oneof/clone expressions; all other leaves below are invented and inert.
  // Native65 UTF-8 spans in that same LQaXg.js: Yh [28565,28625)
  // SHA256 eff8423f46bcca39d206f8b70ef93191276b44dccc38ee90d7f178e415787239;
  // Zh [28626,28677) SHA256 12649a09544bbb33603122399dc1af6294a132afaf9f7f47b6a412b882d3a1fe.
  // _b.js / LQaXg.js hashes and literal UTF-16 spans are pinned in the Native64 evidence.
  _.dga = contract.namespace.dga;
  _.mb = (v: unknown) => v;
  _.ob = Symbol('synthetic-unknown-fields');
  _.Laa = (a: any, mutable: boolean) => {
    a.Fb = mutable ? _.Kaa : undefined;
  };
  _.Ma = (a: any[], flags: number) => {
    (a as any)[_.La] = (a as any)[_.La] | 0 | flags;
  };
  _.Naa = (pivot: number) => pivot;
  _.Na = (v: any) => [...v];
  _.de = (a: any[], field: number, offset: boolean) => {
    const tail = a[a.length - 1];
    return tail &&
      Object.getPrototypeOf(tail) === Object.prototype &&
      field - (offset ? 0 : 1) >= a.length - 1
      ? tail[field]
      : a[field - (offset ? 0 : 1)];
  };
  _.tba = () => undefined;
  Function(
    '_',
    'Qpa',
    'var Noa,Ooa,Nba,Oba;_.pb=function(a,b,c,d){var e=d!==void 0;d=!!d;var f=_.mb(_.ob),g;!e&&f&&(g=a[f])&&g.Fxb(Aba);f=[];var k=a.length;g=4294967295;var r=!1,u=!!(b&64),w=u?b&128?0:-1:void 0;if(!(b&1)){var B=k&&a[k-1];B!=null&&typeof B==="object"&&B.constructor===Object?(k--,g=k):B=void 0;if(u&&!(b&128)&&!e){r=!0;var C;g=((C=_.Bba)!=null?C:_.Naa)(g-w,w,a,B,void 0)+w}}b=void 0;for(C=0;C<k;C++){let N=a[C];if(N!=null&&(N=c(N,d))!=null)if(u&&C>=g){let T=C-w;var G=void 0;((G=b)!=null?G:b={})[T]=N}else f[C]=N}if(B)for(let N in B){G=\nB[N];if(G==null||(G=c(G,d))==null)continue;k=+N;let T;if(u&&!Number.isNaN(k)&&(T=k+w)<g)f[T]=G;else{let aa;((aa=b)!=null?aa:b={})[N]=G}}b&&(r?f.push(b):f[g]=b);e&&_.mb(_.ob)&&(a=_.tba(a))&&"function"==typeof _.Cba&&a instanceof _.Cba&&(f[_.ob]=a.ha());return f};_.Pba=function(a,b){if(typeof a!=="object")return a;if(Array.isArray(a)){var c=a[_.La]|0;return a.length===0&&c&1?void 0:Nba(a,c,b)}if(_.Qa(a))return Oba(a);if("function"==typeof _.sb&&a instanceof _.sb){b=a.vwa;if(b&2)return a;if(!a.size)return;c=_.Na(a.cmc());if(a.zPa)for(a=0;a<c.length;a++){let d=c[a],e=d[1];e==null||typeof e!=="object"?e=void 0:_.Qa(e)?e=Oba(e):Array.isArray(e)?e=Nba(e,e[_.La]|0,!!(b&32)):e=void 0;d[1]=e}return c}if(a instanceof _.lb)return a};Nba=function(a,b,c){if(b&2)return a;!c||4096&b||16&b?a=_.tb(a,b,!1,c&&!(b&16)):(_.Ma(a,34),b&4&&Object.freeze(a));return a};_.Qba=function(a,b,c){a=new a.constructor(b);c&&_.Laa(a,!0);a.Xbc=_.Kaa;return a};Oba=function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?a:_.Rba(a,b,c)?_.Qba(a,b):_.tb(b,c)};_.tb=function(a,b,c,d){d!=null||(d=!!(34&b));a=_.pb(a,b,_.Pba,d);d=32;c&&(d|=2);b=b&16769217|d;a[_.La]=b;return a};_.wb=function(a){if(!_.ub(a)&&_.Ra(a,a.fl[_.La]|0))throw Error();};_.Rba=function(a,b,c){return c&2?!0:c&32&&!(c&4096)?(b[_.La]=c|2,_.Laa(a,!0),!0):!1};_.yb=function(a,b,c,d,e){var f=c+(e?0:-1),g=a.length-1;if(g>=1+(e?0:-1)&&f>=g){let k=a[g];if(k!=null&&typeof k==="object"&&k.constructor===Object)return k[c]=d,b}if(f<=g)return a[f]=d,b;if(d!==void 0){let k;g=((k=b)!=null?k:b=a[_.La]|0)>>14&1023||536870912;c>=g?d!=null&&(a[g+(e?0:-1)]={[c]:d}):a[f]=d}return b};_.Ng=function(a,b){b===void 0&&(b=a[_.La]|0);b&32&&!(b&4096)&&(a[_.La]=b|4096)};Noa=function(a){var b;return(b=a[_.dga])!=null?b:a[_.dga]=new Map};Ooa=function(a,b,c,d,e){var f=a.get(d);if(f!=null)return f;f=0;for(let g=0;g<d.length;g++){let k=d[g];_.de(b,k,e)!=null&&(f!==0&&(c=_.yb(b,c,f,void 0,e)),f=k)}a.set(d,f);return f};_.Poa=function(a,b,c,d,e){var f=Noa(a),g=Ooa(f,a,b,c,e);g!==d&&(g&&(b=_.yb(a,b,g,void 0,e)),f.set(c,d));return b};_.Ph=function(a,b,c,d){_.wb(a);var e=a.fl,f=e[_.La]|0;if(d==null){let g=Noa(e);if(Ooa(g,e,f,c)===b)g.set(c,0);else return a}else f=_.Poa(e,f,c,b);_.yb(e,f,b,d);return a};_.ei=function(a,b,c,d){d=Qpa(d);_.Ph(a,b,c,d);d&&!_.Ra(d)&&_.Ng(a.fl);return a};_.Yh=function(a,b,c){a=a.fl;return Ooa(Noa(a),a,void 0,b,c)};_.Zh=function(a,b,c,d){return _.Yh(a,b,d)===c?c:-1};return {Noa,Ooa,Nba,Oba};',
  )(_, (v: unknown) => v);
  _.Wh = (a: any, field: number, value: any) => {
    _.wb(a);
    if (Object.getPrototypeOf(a) === _.dM.prototype && field === 1) calls.query++;
    _.yb(a.fl, a.fl[_.La] | 0, field, value);
    return a;
  };
  _.Th = create('function(a){return _.Bf(a)}');
  _.Pi = _.Ni = _.Wh;
  _.NI = create('function(a,b){return _.Ni(a,2,b)}');
  _.MI = create('function(a,b){return _.Ni(a,1,b)}');
  _.jJd = create('function(a,b){return _.Ki(a,1,b)}');
  _.$Cb = create(
    'function(a){return Object.assign({},{locale:"ko",requestSource:a.requestSource},a.modeId!==void 0?{modeId:a.modeId}:{},a.turnId!==void 0?{turnId:a.turnId}:{})}',
  );
  _.oJd = create('function(a,b){return _.Hh(a,_.LAd,1,b)}');
  _.pJd = create('function(a,b){return _.Ki(a,2,b)}');
  const QGd = create('class extends _.l{constructor(a){super(a)}}');
  _.zL.prototype.getQuery = create('class{getQuery(){return _.m(this,_.wL,1)}}').prototype.getQuery;
  _.wL.prototype.getText = create('class{getText(){return _.n(this,1)}}').prototype.getText;
  _.n = (a: any, field: number) => a.fl[field - 1];
  _.ge = (a: any, field: number) => a.fl[field - 1] != null;
  const ok = new _.zL(
    wire({ 1: new _.wL([packet.request.textQuery]), 3: new _.DI(), 60: approved.clientTurnId }),
  );
  // The real HJd body invokes only inert synthetic packet/setting dependencies here.
  _.PLd = create(
    'function(a,b){var c=!!b.request.ZKa,d,e,f;b=_.Fyd(b,a.requestSource,a.Gc,a.kb,(f=(d=a.uv())==null?void 0:d.id)!=null?f:void 0,!c&&a.Hga(),!c&&a.Wa.Ga(),a.Ac.isSupported(),a.lja&&_.nL(a.Va)?(e=a.Gb)==null?void 0:e.Ja.value:void 0);if(a.lja&&_.nL(a.Va)&&(a=_.ved())){a:switch(a.kind){case 0:c=new BL;a=_.Oi(c,2,QFd,a.toolId);a=_.Bf(a);break a;case 1:c=new BL;a=_.Oi(c,3,QFd,a.toolId);a=_.Bf(a);break a;case 2:a=new BL;a=_.Gi(a,5,QFd,!0);a=_.Bf(a);break a;default:throw Error("sk`"+String(a.kind));\n}if(c=a){var g;(a=(g=_.m(b,BL,109))==null?void 0:_.m(g,Ywd,4))?(g=_.Mg(c),g=_.Hh(g,Ywd,4,a)):g=c;_.Hh(b,BL,109,g)}}return b}',
  );
  _.Fyd = (packet: any) => (packet.request.aib === 'RECONNECT_TO_EXISTING_TURN' ? copy(ok) : ok);
  _.LJd = create(
    'function(a,b,c,d,e){var f,g,k=((f=_.XL(b))==null?void 0:f.ig())||((g=_.m(b,_.yL,72))==null?void 0:g.ig())||"";e&&(a.Aa=_.Th(_.MI(_.NI(new _.CI,e),k)));d=_.$Cb({requestSource:c,modeId:d,turnId:e});c=(new _.LAd).setLocale(d.locale);c=_.Pi(c,1,d.requestSource);d.modeId!==void 0&&_.Ni(c,2,d.modeId);d.turnId!==void 0&&_.Ni(c,4,d.turnId);d=new _.nJd;e=new SId;b=_.Hh(e,_.zL,1,b);b=_.Pi(b,4,1);b=_.Bf(b);b=_.Hh(d,SId,5,b);c=_.oJd(_.pJd(new _.qJd,0),c);b=_.ei(c,8,_.rJd,b);b=_.Bf(b);c=new _.tJd;b=_.ei(c,\n1,_.eM,b);b=_.Bf(b);if(a.ha)a.connection.send(b);else{let r,u;(u=(r=a.connection).bfc)==null||u.call(r,b);a.oa.push(b)}}',
    { SId: QGd },
  );
  _.hKd = create('class{register(a){this.ha=a}get(){return this.ha}}');
  _.eKd = create(
    'class{constructor(){this.Ca=_.x(_.Lz);this.ha=_.x(_.$Jd);this.oa=_.x(_.XJd);this.ka=_.x(_.cA)}get wa(){return this.Ca.Ea(cKd)}}',
    { cKd: {} },
  );
  _.pM = class {};
  _.bM = class {};
  _.GN = class {};
  _.qVd = create(
    'class{constructor(){this.Na=_.x(_.eKd);this.Sa=_.x(_.gKd);this.Va=_.x(_.dK);this.Oa=_.x(_.TC);this.Ia=_.x(_.yx);this.Ca=_.x(_.Lz);this.Ha=_.x(_.EA);this.Jc=_.x(_.HA);this.nb=_.x(_.PF);this.Za=this.Ca.Ea(_.jM);this.Wa=this.Ca.Ea(_.bKd);var a;this.kb=(a=_.x(_.XJd,{optional:!0}))!=null?a:!1;this.ob=this.Ca.Ea(_.aKd);this.ka=!1;this.ub=_.Z(this.Oa.Ti,{initialValue:!1});this.JWb=_.Z(this.nb.pG().pipe(_.v(b=>b.map(c=>c.id))),{initialValue:[]});_.x(_.hKd).register(this)}isEnabled(){return!this.kb&&\nthis.Za}Da(){return this.ka||!!this.ha&&_.JJd(this.ha.connection)}mb(){var a=this.ha;if(a&&_.JJd(a.connection))return _.n(a.tec,60)||void 0}Eb(a,b,c,d,e){if(this.isEnabled()){var f=e!=null?e:()=>this.Oa.sAc();a=a.map(g=>typeof g==="object"&&g!==null&&"event"in g&&"observable"in g&&_.pw(g.observable)?g:{event:"CANCELLED_INVALIDATION",observable:g});_.Jt(...a.map(({event:g,observable:k})=>k.pipe(_.uw(),_.yw(1),_.v(()=>g)))).pipe(_.Kt(()=>this.ka||this.ha!==void 0),_.du(g=>{this.reset(g)}),_.zw(()=>\n_.Et(()=>f()).pipe(_.Vt(1),_.Ot(()=>_.It))),_.uA(b)).subscribe(g=>{d&&!d()||this.Aa(g,c())})}}Ab(){this.ha!==void 0&&JOk(this)}thc(a){var b=this.ha;b!=null&&_.JJd(b.connection)&&(b.connection.thc(a),JOk(this))}aDc(){var a=this.Ja;this.Ja=void 0;return a}wnf(){this.wa=void 0;var a=this.ha;if(a){IOk(this);a.XCd.unsubscribe();this.ha=void 0;this.ka=!1;if(_.JJd(a.connection))return{connection:a.connection,tec:a.tec,wi:a.wi,UM:a.UM};let b=a.connection.hasError;a.connection.disconnect();_.AAd(this.Jc,b?\n"CHANNEL_ERROR":"CHANNEL_CLOSED",a.wi)}}oa(a){var b=this.ha;a==="CHANNEL_ERROR"?b&&(this.wa={conversationId:b.conversationId,wi:b.wi}):this.wa=void 0;b&&(IOk(this),b.XCd.unsubscribe(),_.JJd(b.connection)&&a!=="CHANNEL_ERROR"&&a!=="CHANNEL_CLOSED"?_.iM(b.connection):b.connection.disconnect(),this.ha=void 0,_.AAd(this.Jc,a!=null?a:"CANCELLED_INVALIDATION",b.wi));this.ka=!1}reset(a="CANCELLED_INVALIDATION"){this.oa(a)}Aa(a,b){if(this.isEnabled()){var c=_.ui(a,50);if(!(this.Wa&&(_.WM(c)||c===58)||this.ub()||\nthis.JWb().length>0&&b&&!this.JWb().includes(b)||this.ka)){var d,e;c=(e=(d=_.XL(a))==null?void 0:d.ig())!=null?e:"";if(!this.wa||this.wa.conversationId!==c||this.wa.wi!==b)if(!this.ha||!_.JJd(this.ha.connection)||this.ha.conversationId!==c||this.ha.wi!==b){this.oa();this.ka=!0;this.Ja=d=this.Va.now();_.AAd(this.Jc,"CREATED",b);try{let g=_.fKd(this.Sa,{wi:b,isTemporaryChat:_.oi(a,46),clientTurnId:_.n(a,60),requestSource:_.DA(this.Ha)});var f=_.dKd(this.Na,this.Ia,{zS:g});f.connect();_.LJd(f,a,_.DA(this.Ha),\nb!=null?b:"",_.n(a,60));JOk(this);let k=f.Sa.pipe(_.Vt(1),_.uA(this.Ia)).subscribe(r=>{this.oa(r!==void 0?"CHANNEL_ERROR":"CHANNEL_CLOSED")});this.ha={connection:f,wi:b,conversationId:c,tec:a,XCd:k,UM:d}}catch(g){let k;(k=f)==null||k.disconnect();IOk(this);this.ha=void 0;this.ka=!1}finally{this.ka=!1}}}}}}',
  );
  const registry = new _.hKd();
  const session = Object.assign(Object.create(_.eKd.prototype), {
    oa: false,
    Ca: { Ea: () => codec === 'protobuf' },
    ha: { ka: 'synthetic', ha: 'synthetic' },
    ka: {},
  });
  const api = Object.assign(new _.pM(), {
    Aa: true,
    Kd: true,
    ub: session,
    Eb: registry,
    Ia: undefined,
    Ja: Object.assign(new _.bM(), { isEnabled: true }),
    requestSource: 1,
    uv: () => undefined,
    Hga: () => false,
    Wa: { Ga: () => false },
    Ac: { isSupported: () => false },
    lja: false,
  });
  const consumer = Object.assign(new _.GN(), { ha: api });
  // Scheduling is deferred like the source Promise queue; flushOpen is test-only.
  _.re = create('(a,b)=>{Tga||Uga();eca||(Tga(),eca=!0);bca.add(a,b)}', {
    Tga: () => {},
    Uga: () => {},
    eca: false,
    bca: { add: (fn: Function, owner: any) => pending.push(() => fn.call(owner)) },
  });
  _.ka = (a: string, b: string) => a.includes(b);
  _.$b = create('function(a,b,c){return a.call.apply(a.bind,arguments)}');
  _.fa = {
    PerformanceNavigationTiming: class {},
    performance: { getEntriesByType: () => [{ nextHopProtocol: 'h2' }] },
    setTimeout: (callback: () => void) => {
      timers.set(++timerId, callback);
      return timerId;
    },
    clearTimeout: (id: number) => timers.delete(id),
  };
  const blb = create(
    'function(a){this.Aa=a||10;_.fa.PerformanceNavigationTiming?(a=_.fa.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(_.fa.chrome&&_.fa.chrome.loadTimes&&_.fa.chrome.loadTimes()&&_.fa.chrome.loadTimes().wasFetchedViaSpdy);this.wa=a?this.Aa:1;this.ha=null;this.wa>1&&(this.ha=new Set);this.ka=null;this.oa=[]}',
  );
  const Tlb = create(
    'function(a){if(a.ka!=null)return a.oa.concat(a.ka.Za);if(a.ha!=null&&a.ha.size!==0){let b=a.oa;for(let c of a.ha.values())b=b.concat(c.Za);return b}return _.Ea(a.oa)}',
  );
  blb.prototype.cancel = create(
    'function(){this.oa=wlb(this);if(this.ka)this.ka.cancel(),this.ka=null;else if(this.ha&&this.ha.size!==0){for(let a of this.ha.values())a.cancel();this.ha.clear()}}',
    { wlb: Tlb },
  );
  const dt = create(
    'function(a){this.Qf=0;this.oa=[];this.ha=new Akb;this.Vc=this.kf=this.ub=this.Yc=this.ka=this.Lf=this.mb=this.ob=this.Ga=this.Oc=this.Na=null;this.Ih=this.Gb=0;this.Lg=Fkb("failFast",!1,a);this.Eb=this.Va=this.Ja=this.Da=this.wa=null;this.xd=!0;this.kc=this.xf=this.Ha=-1;this.Pc=this.Wa=this.Za=0;this.zg=Fkb("baseRetryDelayMs",5E3,a);this.Fh=Fkb("retryDelaySeedMs",1E4,a);this.wh=Fkb("forwardChannelMaxRetries",2,a);this.Cf=Fkb("forwardChannelRequestTimeoutMs",2E4,a);this.lPb=a&&a.AEa||void 0;this.Wi=\na&&a.P2g||void 0;this.Uf=a&&a.org||!1;this.Ub=void 0;this.Ab=a&&a.Z2a||!1;this.Sa="";this.Aa=new Gkb(a&&a.QYg);this.Wd=Math.min(a&&a.w2g||1E3,1E3);this.Zf=new Ekb;this.Ac=a&&a.Nab||!1;this.Zb=a&&a.q_g||!1;this.Ac&&this.Zb&&(this.ha.warning("Ignore encodeInitMessageHeaders because fastHandshake is set."),this.Zb=!1);this.Ph=a&&a.WXg||!1;a&&a.NHd&&this.ha.NHd();a&&a.ebb&&(this.xd=!1);this.Fd=!this.Ac&&this.xd&&a&&a.fHd||!1;this.Sd=void 0;a&&a.r3d&&a.r3d>0&&(this.Sd=a.r3d);this.Kd=void 0;this.Fb=0;this.Yb=\n!1;this.Ae=this.kb=null}',
    {
      Akb: (() => {
        const C = create('function(){this.Rm=null;this.ha=!0}');
        C.prototype.debug = C.prototype.info = C.prototype.warning = create('function(){}');
        return C;
      })(),
      Fkb: (_k: string, d: unknown) => d,
      Gkb: blb,
      Ekb: class {
        ha = { parse: JSON.parse };
      },
    },
  );
  dt.prototype.fU = 1;
  const Qlb = create('function(a){vlb(a.Aa)||a.Da||(a.Da=!0,_.re(a.Hf,a),a.Za=0)}', {
    vlb: (a: any) => (a.ka ? true : a.ha ? a.ha.size >= a.wa : false),
  });
  dt.prototype.connect = create(
    'function(a,b,c,d){this.ha.debug("connect()");kt(0);this.Yc=a;this.ob=b||{};c&&d!==void 0&&(this.ob.OSID=c,this.ob.OAID=d);this.Eb=this.xd;this.ha.debug("connectChannel_()");a=qlb(this,null,this.Yc);this.ha.debug("GetForwardChannelUri: "+a);this.ub=a;tlb(this)}',
    {
      kt: () => {
        calls.open++;
      },
      qlb: () => uri(),
      tlb: Qlb,
    },
  );
  // URLs, XHR, timers and binary encoding below are synthetic test-only dependencies.
  // The request/batch/scheduler bodies preserve their original source transitions.
  const uri = (): any => ({ clone: () => uri(), toString: () => 'synthetic' });
  _.Fg = _.soa = () => {};
  _.Jg = (a: any) => a;
  _.Pb = (a: any) => ({ ...a });
  _.Qb = Object.assign;
  _.ld = encodeURIComponent;
  _.Cb = () => {};
  const Vkb = create(
    'function(a,b){if(typeof a!=="function")throw Error("le");return _.fa.setTimeout(function(){a()},b)}',
  );
  const Xkb = create('function(){this.oa=null;this.ha="";this.ka=!1}');
  const bt = create(
    'function(a,b,c,d,e){this.Aa=a;this.ka=b;this.Yc=c;this.oa=d;this.Gb=e||1;this.Zb=new _.ak(this);this.lH=45E3;this.ob=null;this.Ha=!1;this.Da=this.Ga=this.Sa=this.mb=this.Wa=this.Ub=this.Va=null;this.Za=[];this.ha=null;this.Na=0;this.DG=this.Ja=null;this.Fb=-1;this.kb=!1;this.Yb=0;this.Ab=null;this.Oc=this.ub=this.Ac=this.Eb=!1;this.wa=new Bkb}',
    { Bkb: Xkb },
  );
  const Flb = create(
    'function(a,b){if(a.Va!=null)throw Error("me");a.Va=zkb((0,_.$b)(a.Pc,a),b)}',
    { zkb: Vkb },
  );
  const qlb = create('function(a){a.Ub=Date.now()+a.lH;ilb(a,a.lH)}', { ilb: Flb });
  const ulb = create('function(a){a.Va&&(_.fa.clearTimeout(a.Va),a.Va=null)}');
  const ylb = create(
    'function(a){Ykb(a);_.Cb(a.Ab);a.Ab=null;a.Zb.removeAll();if(a.ha){let b=a.ha;a.ha=null;b.abort();b.dispose()}}',
    { Ykb: ulb },
  );
  const Slb = create('function(a){return a.ka?!0:a.ha?a.ha.size>=a.wa:!1}');
  const Klb = create('function(a){return a.ka?1:a.ha?a.ha.size:0}');
  const Glb = create('function(a,\nb){return a.ka?a.ka==b:a.ha?a.ha.has(b):!1}');
  const Mlb = create('function(a,b){a.ha?a.ha.add(b):a.ka=b}');
  const Olb = create('function(a,b){a.ka&&a.ka==b?a.ka=null:a.ha&&a.ha.has(b)&&a.ha.delete(b)}');
  const bmb = create(
    'function(a,b,c){c=Math.min(a.oa.length,c);\nvar d=a.wa?(0,_.$b)(a.wa.ALe,a.wa,a):null;a:{var e=a.oa;let k=-1;for(;;){let r=["count="+c];k==-1?c>0?(k=e[0].mapId,r.push("ofs="+k)):k=0:r.push("ofs="+k);let u=!0;for(let w=0;w<c;w++){var f=e[w].mapId;let B=e[w].map;f-=k;if(f<0)k=Math.max(0,e[w].mapId-100),u=!1;else try{f="req"+f+"_"||"";try{var g=B instanceof Map?B:Object.entries(B);for(let [C,G]of g){let N=G;_.Ed(G)&&(N=_.Wj(G));r.push(f+C+"="+encodeURIComponent(N))}}catch(C){throw r.push(f+"type="+encodeURIComponent("_badmap")),C;}}catch(C){d&&\nd(B)}}if(u){g=r.join("&");break a}}g=void 0}a=a.oa.splice(0,c);b.Za=a;return g}',
  );
  const Ylb = create(
    'function(a,b){a.ob&&_.Kb(a.ob,function(c,d){_.Fg(b,d,c)});a.wa&&_.Kb({},function(c,d){_.Fg(b,d,c)})}',
  );
  const rlb = create(
    'function(a,b,c){if(b&&!a.Ab)throw Error("oe");b=a.Uf&&!a.lPb?new _.Xj(new _.Mta({h$c:c})):new _.Xj(a.lPb);b.yI(a.Ab);return b}',
  );
  const olb = create(
    'function(a,b){a.Wa=Date.now();Ukb(a);a.Ga=a.Sa.clone();_.soa(a.Ga,"t",a.Gb);a.Na=0;var c=a.Aa.Ab;a.wa=new Bkb;a.ha=Vkb(a.Aa,c?b:null,!a.Da);a.Yb>0&&(a.Ab=new _.BLa((0,_.$b)(a.kc,a,a.ha),a.Yb));a.Zb.listen(a.ha,"readystatechange",a.Vc);b=a.ob?_.Pb(a.ob):{};a.Da?(a.Ja||(a.Ja="POST"),b["Content-Type"]="application/x-www-form-urlencoded",a.ha.send(a.Ga,a.Ja,a.Da,b)):(a.Ja="GET",a.ha.send(a.Ga,a.Ja,null,b));vkb(1);Kkb(a.ka,\na.Ja,a.Ga,a.oa,a.Gb,a.Da)}',
    {
      Ukb: qlb,
      Bkb: Xkb,
      Vkb: rlb,
      vkb: () => {},
      Kkb: () => {},
    },
  );
  const observeOlb = (a: any, b: any) => {
    requests.push(a);
    if (a.oa === 'rpc') calls.backchannel++;
    else if (a.Za.length) calls.forward++;
    olb(a, b);
  };
  const plb = create('function(a,b,c){a.mb=1;a.Sa=_.Jg(b.clone());a.Da=c;a.Eb=!0;Skb(a,null)}', {
    Skb: observeOlb,
  });
  const cmb = create(
    'function(a,b){var c;b?c=b.oa:c=a.Gb++;var d=a.ub.clone();_.Fg(d,"SID",a.Sa);_.Fg(d,"RID",c);_.Fg(d,"AID",a.Ha);Blb(a,d);a.Ga&&a.Na&&_.zlb(d,a.Ga,a.Na);c=new lt(a,a.ha,a.Sa,c,a.Za+1);a.Ga===null&&(c.ob=a.Na);b&&(a.oa=b.Za.concat(a.oa));b=Flb(a,c,a.Wd);c.setTimeout(Math.round(a.Cf*.5)+Math.round(a.Cf*.5*Math.random()));plb(a.Aa,c);Tkb(c,d,b)}',
    { Blb: Ylb, lt: bt, Flb: bmb, plb: Mlb, Tkb: plb },
  );
  const retryDelay = create(
    'function(a,b){var c=a.Eg+Math.floor(Math.random()*a.Mh);a.isActive()||(a.ha.debug("Inactive channel"),c*=2);return c*b}',
  );
  const Elb = create(
    'function(a){a.kb!=null&&(a.ha.debug("Cancel the BP detection timer."),_.fa.clearTimeout(a.kb),a.kb=null)}',
  );
  const Ilb = create('function(a){a.ka&&(hlb(a),a.ka.cancel(),a.ka=null)}', { hlb: Elb });
  const Hlb = create('function(a){a.Va!=null&&(_.fa.clearTimeout(a.Va),a.Va=null)}');
  const Plb = create('function(a){a.ka||a.Ja||(a.Pc=1,_.re(a.uf,a),a.Wa=0)}');
  const Jlb = create(
    'function(a){if(a.ka||a.Ja||a.Wa>=3)return!1;a.ha.debug("Going to retry GET");a.Pc++;a.Ja=zkb((0,_.$b)(a.uf,a),Dlb(a,a.Wa));a.Wa++;return!0}',
    { zkb: Vkb, Dlb: retryDelay },
  );
  const dmb = create(
    'function(a){a.ha.debug("Creating new HttpRequest");a.ka=new lt(a,a.ha,a.Sa,"rpc",a.Pc);a.Ga===null&&(a.ka.ob=a.Na);a.ka.Yb=0;var b=a.kf.clone();_.Fg(b,"RID","rpc");_.Fg(b,"SID",a.Sa);_.Fg(b,"AID",a.Ha);_.Fg(b,"CI",a.Eb?"0":"1");!a.Eb&&a.Sd&&_.Fg(b,"TO",a.Sd);_.Fg(b,"TYPE","xmlhttp");Blb(a,b);a.Ga&&a.Na&&_.zlb(b,a.Ga,a.Na);a.Ub&&a.ka.setTimeout(a.Ub);var c=a.ka,d=a.Vc;c.mb=1;c.Sa=_.Jg(b.clone());\nc.Da=null;c.Eb=!0;Skb(c,d);a.ha.debug("New Request created")}',
    { lt: bt, Blb: Ylb, Skb: observeOlb },
  );
  const amb = create(
    'function(a,b){if(nlb(a.Aa)>=a.Aa.wa-(a.Da?1:0))return!1;if(a.Da)return a.ha.debug("Use the retry request that is already scheduled."),a.oa=b.Za.concat(a.oa),!0;if(a.fU==1||a.fU==2||a.Za>=(a.Lg?0:a.wh))return!1;a.ha.debug("Going to retry POST");a.Da=zkb((0,_.$b)(a.Hf,a,b),Dlb(a,a.Za));a.Za++;return!0}',
    { nlb: Klb, zkb: Vkb, Dlb: retryDelay },
  );
  const Xlb = create(
    'function(a){llb(a);a.Ja&&(_.fa.clearTimeout(a.Ja),a.Ja=null);klb(a);a.Aa.cancel();a.Da&&(typeof a.Da==="number"&&_.fa.clearTimeout(a.Da),a.Da=null)}',
    { llb: Ilb, klb: Hlb },
  );
  const Zlb = create(
    'function(a){a.fU=0;a.Ae=[];if(a.wa){let b=wlb(a.Aa);if(b.length!=0||a.oa.length!=0)a.ha.debug(()=>"Number of undelivered maps, pending: "+b.length+", outgoing: "+a.oa.length),_.Ga(a.Ae,b),_.Ga(a.Ae,a.oa),a.Aa.oa.length=0,_.Ea(a.oa),a.oa.length=0;a.wa.Zjd()}}',
    { wlb: Tlb },
  );
  _.Ga = (a: any[], b: any[]) => a.push(...b);
  _.Ea = (a: any[]) => a.slice();
  const Llb = create(
    'function(a,b){a.ha.info("Error code "+b);if(b==2){var c=(0,_.$b)(a.jj,a),d=a.Wi;let e=!d;d=new _.xg(d||"//www.google.com/images/cleardot.gif");\n_.fa.location&&_.fa.location.protocol=="http"||_.yg(d,"https");_.Jg(d);e?Ckb(d.toString(),c):Dkb(d.toString(),c)}else kt(2);a.ha.debug("HttpChannel: error - "+b);a.fU=0;a.wa&&a.wa.DU(a,b);Clb(a);Alb(a)}',
    {
      Alb: Xlb,
      Clb: Zlb,
      kt: () => {},
      Ckb: () => {},
      Dkb: () => {},
    },
  );
  dt.prototype.jj = create(
    'function(a){a?(this.ha.info("Successfully pinged google.com"),at(2)):(this.ha.info("Failed to ping google.com"),at(1))}',
    { at: () => {} },
  );
  _.xg = function () {
    return uri();
  };
  _.yg = () => {};
  const Blb = create(
    'function(a,b){a.ha.debug("Request complete");var c=null;if(a.ka==b){klb(a);hlb(a);a.ka=null;var d=2}else if(jlb(a.Aa,b))c=b.Za,rlb(a.Aa,b),d=1;else return;if(a.fU!=0)if(b.zY())d==1?(ykb(b.Da?b.Da.length:0,Date.now()-b.Wa,a.Za),tlb(a)):slb(a);else{var e=b.Fb,f=b.getLastError();if(f==3||f==0&&e>0)a.ha.debug("Not retrying due to error type"),e>200&&(a.kc=b.Fb);else{a.ha.debug(function(){return"Maybe retrying, last error: "+Pkb(f,\na.kc)});if(d==1&&Elb(a,b)||d==2&&mlb(a))return;a.ha.debug("Exceeded max number of retries")}c&&c.length>0&&xlb(a.Aa,c);a.ha.debug("Error: HTTP request failed");switch(f){case 1:olb(a,5);break;case 4:olb(a,10);break;case 3:olb(a,6);break;default:olb(a,2)}}}',
    {
      klb: Hlb,
      hlb: Elb,
      jlb: Glb,
      rlb: Olb,
      ykb: () => {},
      tlb: Qlb,
      slb: Plb,
      Elb: amb,
      mlb: Jlb,
      xlb: (a: any, b: any[]) => {
        a.oa = a.oa.concat(b);
      },
      olb: Llb,
    },
  );
  const zlb = create('function(a){a.Aa.wD()||a.kb||elb(a.Aa,a)}', { elb: Blb });
  bt.prototype.Pc = create(
    'function(){this.Va=null;var a=Date.now();a-this.Ub>=0?(Okb(this.ka,this.Ga),this.mb!=2&&(vkb(3),kt(17)),blb(this),this.DG=2,clb(this)):(this.ka.warning("WatchDog timer called too early"),ilb(this,this.Ub-a))}',
    { Okb: () => {}, vkb: () => {}, kt: () => {}, blb: ylb, clb: zlb, ilb: Flb },
  );
  bt.prototype.Vc = create(
    'function(a){a=a.target;var b=this.Ab;b&&a.pea()==3?(this.ka.debug("Throttling readystatechange."),b.fire()):this.kc(a)}',
  );
  const xlb = create(
    'function(a,b){try{var c=a.Aa;if(c.fU!=0&&(c.ka==a||jlb(c.Aa,a)))if(!a.ub&&jlb(c.Aa,a)&&c.fU==3){try{var d=c.Zf.ha.parse(b)}catch(w){d=null}if(Array.isArray(d)&&d.length==3){var e=d;if(e[0]==0)a:if(c.ha.debug("Server claims our backchannel is missing."),c.Ja)c.ha.debug("But we are currently starting the request.");else{if(c.ka)if(c.ka.Wa+3E3<a.Wa)klb(c),llb(c);else break a;else c.ha.warning("We do not have a BackChannel established");mlb(c);kt(18)}else{c.xf=e[1];var f=c.xf-c.Ha;if(0<f){var g=\ne[2];c.ha.debug(g+" bytes (in "+f+" arrays) are outstanding on the BackChannel");g<37500&&c.Eb&&c.Wa==0&&!c.Va&&(c.Va=zkb((0,_.$b)(c.Jh,c),6E3))}}if(nlb(c.Aa)<=1&&c.Kd){try{c.Kd()}catch(w){}c.Kd=void 0}}else c.ha.debug("Bad POST response data returned"),olb(c,11)}else if((a.ub||c.ka==a)&&klb(c),!_.ja(b))for(e=c.Zf.ha.parse(b),f=0;f<e.length;f++){let w=e[f],B=w[0];if(B<=c.Ha)c.ha.warning("Ignoring out-of-order or duplicate message with arrayId: "+B+", lastArrayId: "+c.Ha);else if(B>c.Ha+1&&c.Ha>-1&&\nc.ha.warning("Received non-consecutive message with arrayId: "+B+", lastArrayId: "+c.Ha),c.Ha=B,w=w[1],c.fU==2)if(w[0]=="c"){c.Sa=w[1];c.Vc=w[2];let C=w[3];C!=null&&(c.frc=C,c.ha.info("VER="+c.frc));let G=w[4];G!=null&&(c.Qf=G,c.ha.info("SVER="+c.Qf));let N=w[5];N!=null&&typeof N==="number"&&N>0&&(g=1.5*N,c.Ub=g,c.ha.info("backChannelRequestTimeoutMs_="+g));g=c;let T=a.ha;if(T){let da=_.Hkb(T,"X-Client-Wire-Protocol");if(da){var k=g.Aa;b=da;!k.ha&&(_.ka(b,"spdy")||_.ka(b,"quic")||_.ka(b,"h2"))&&(k.wa=\nk.Aa,k.ha=new Set,k.ka&&(plb(k,k.ka),k.ka=null))}if(g.mb){let ta=_.Hkb(T,"X-HTTP-Session-Id");ta?(g.Lf=ta,_.Fg(g.ub,g.mb,ta)):g.ha.warning("Missing X_HTTP_SESSION_ID in the handshake response")}}c.fU=3;c.wa&&c.wa.bkd();c.Fb=Date.now()-a.Wa;c.Fd&&c.ha.info("Handshake RTT: "+c.Fb+"ms");g=c;b=a;var r=d=g;let aa=qlb(r,r.Ab?g.Vc:null,g.Yc);r.ha.debug("GetBackChannelUri: "+aa);d.kf=aa;if(b.ub){g.ha.debug("Upgrade the handshake request to a backchannel.");rlb(g.Aa,b);d=b;var u=g.Ub;u&&d.setTimeout(u);d.Va&&\n(Ykb(d),Ukb(d));g.ka=b}else slb(g);c.oa.length>0&&tlb(c)}else w[0]!="stop"&&w[0]!="close"||olb(c,7);else c.fU==3&&(w[0]=="stop"||w[0]=="close"?w[0]=="stop"?olb(c,7):c.disconnect():w[0]!="noop"&&c.wa&&c.wa.akd(w),c.Wa=0)}vkb(4)}catch(w){}}',
    {
      jlb: Glb,
      nlb: Klb,
      zkb: Vkb,
      plb: Mlb,
      rlb: Olb,
      Ykb: ulb,
      Ukb: qlb,
      tlb: Qlb,
      qlb: () => uri(),
      klb: Hlb,
      llb: Ilb,
      mlb: Jlb,
      olb: Llb,
      slb: Plb,
      vkb: () => {},
      kt: () => {},
    },
  );
  _.Hkb = create('function(a,b){return a.vk?a.vk.getResponseHeader(b):null}');
  const tlb = create('function(a){return a.ha?a.wa.ka?!0:!(!a.ha.Ln()&&!a.ha.getResponse()):!1}');
  const chunks = new WeakMap<object, string>();
  const slb = create(
    'function(a){var b=a.ha.pea(),c=a.ha.E1(),d=a.ha.getStatus();if(!(b<3||b==3&&!Xkb(a))){a.kb||b!=4||c==7||(c==8||d<=0?vkb(3):vkb(2));Ykb(a);var e=a.ha.getStatus();a.Fb=e;c=Zkb(a);Xkb(a)||a.ka.debug(function(){return"No response text for uri "+a.Ga+" status "+e});a.Ha=e==200;Lkb(a.ka,a.Ja,a.Ga,a.oa,a.Gb,b,e);if(a.Ha){if(a.Ac&&!a.ub)if(d=$kb(a))Nkb(a.ka,a.oa,d,"Initial handshake response via X-HTTP-Initial-Response"),a.ub=!0,alb(a,d);else{a.Ha=!1;a.DG=3;kt(12);a.ka.warning("XMLHTTP Missing X_HTTP_INITIAL_RESPONSE ("+\na.oa+")");blb(a);clb(a);return}a.Eb?dlb(a,b,c):(Nkb(a.ka,a.oa,c,null),alb(a,c));b==4&&blb(a);a.Ha&&!a.kb&&(b==4?elb(a.Aa,a):(a.Ha=!1,Ukb(a)))}else a.ha.rG(),e==400&&c.indexOf("Unknown SID")>0?(a.DG=3,kt(12),a.ka.warning("XMLHTTP Unknown SID ("+a.oa+")")):(a.DG=0,kt(13),a.ka.warning("XMLHTTP Bad status "+e+" ("+a.oa+")")),blb(a),clb(a)}}',
    {
      Xkb: tlb,
      Ykb: ulb,
      blb: ylb,
      clb: zlb,
      elb: Blb,
      Ukb: qlb,
      alb: xlb,
      vkb: () => {},
      Lkb: () => {},
      Nkb: () => {},
      kt: () => {},
      Zkb: (a: any) => a.ha.Ln(),
      // Chunk assembly is synthetic; the source xlb protocol transition is literal.
      dlb: (a: any, _state: number, raw: string) => {
        if (chunks.get(a) !== raw) {
          chunks.set(a, raw);
          a.Oc = true;
          xlb(a, raw);
        }
      },
    },
  );
  bt.prototype.kc = create(
    'function(a){try{a==this.ha?Wkb(this):this.ka.warning("Called back with an unexpected xmlhttp")}catch(b){this.ka.debug("Failed call to OnXmlHttpReadyStateChanged_"),Xkb(this)}finally{}}',
    { Wkb: slb, Xkb: tlb },
  );
  bt.prototype.setTimeout = create('function(a){this.lH=a}');
  bt.prototype.cancel = create('function(){this.kb=!0;blb(this)}', { blb: ylb });
  bt.prototype.zY = create('function(){return this.Ha}');
  bt.prototype.getLastError = create('function(){return this.DG}');
  bt.prototype.lm = create('function(){return this.Yc}');
  dt.prototype.wD = create('function(){return this.fU==0}');
  dt.prototype.Hf = create(
    'function(a){if(this.Da)if(this.Da=null,this.ha.debug("startForwardChannel_"),this.fU==1){if(!a){this.ha.debug("open_()");this.Gb=Math.floor(Math.random()*1E5);a=this.Gb++;let e=new lt(this,this.ha,"",a),f=this.Na;this.Oc&&(f?(f=_.Pb(f),_.Qb(f,this.Oc)):f=this.Oc);this.Ga!==null||this.Zb||(e.ob=f,f=null);if(this.Ac)a:{var b=0;for(var c=0;c<this.oa.length;c++){b:{var d=this.oa[c];if("__data__"in d.map&&(d=d.map.__data__,typeof d==="string")){d=d.length;break b}d=void 0}if(d===void 0)break;\nb+=d;if(b>4096){b=c;break a}if(b===4096||c===this.oa.length-1){b=c+1;break a}}b=this.Wd}else b=this.Wd;b=Flb(this,e,b);c=this.ub.clone();_.Fg(c,"RID",a);_.Fg(c,"CVER",22);this.mb&&_.Fg(c,"X-HTTP-Session-Id",this.mb);Blb(this,c);f&&(this.Zb?b="headers="+_.ld(ylb(f))+"&"+b:this.Ga&&_.zlb(c,this.Ga,f));plb(this.Aa,e);this.Ph&&_.Fg(c,"TYPE","init");this.Ac?(_.Fg(c,"$req",b),_.Fg(c,"SID","null"),e.Ac=!0,Tkb(e,c,null)):Tkb(e,c,b);this.fU=2}}else this.fU==3&&(a?Glb(this,a):this.oa.length==0?this.ha.debug("startForwardChannel_ returned: nothing to send"):\nvlb(this.Aa)||(Glb(this),this.ha.debug("startForwardChannel_ finished, sent request")))}',
    { lt: bt, Flb: bmb, Blb: Ylb, plb: Mlb, Tkb: plb, vlb: Slb, Glb: cmb, ylb: () => '' },
  );
  _.zlb = () => {};
  dt.prototype.isActive = create('function(){return!!this.wa&&this.wa.isActive(this)}');
  dt.prototype.uf = create(
    'function(){this.Ja=null;Hlb(this);if(this.Fd&&!this.Yb)if(this.ka==null||this.Fb<=0)this.ha.warning("Skip bpDetectionTimerId_ "+this.ka+" "+this.Fb);else{var a=4*this.Fb;this.ha.info("BP detection timer enabled: "+a);this.kb=zkb((0,_.$b)(this.Di,this),a)}}',
    { Hlb: dmb, zkb: Vkb },
  );
  dt.prototype.Di = create(
    'function(){if(this.kb){this.kb=null;this.ha.info("BP detection timeout reached.");if(this.ka.ha!=null){let a=this.ka.ha.Ln();a&&this.ha.warning("Timer should have been cancelled : "+a)}this.ha.info("Buffering proxy detected and switch to long-polling!");this.Eb=!1;this.Yb=!0;kt(10);llb(this);Hlb(this)}else this.ha.warning("Invalid operation.")}',
    { llb: Ilb, Hlb: dmb, kt: () => {} },
  );
  dt.prototype.Jh = create('function(){this.Va!=null&&(this.Va=null,llb(this),mlb(this),kt(19))}', {
    llb: Ilb,
    mlb: Jlb,
    kt: () => {},
  });
  dt.prototype.disconnect = create(
    'function(){this.ha.debug("disconnect()");Alb(this);if(this.fU==3){var a=this.Gb++,b=this.ub.clone();_.Fg(b,"SID",this.Sa);_.Fg(b,"RID",a);_.Fg(b,"TYPE","terminate");Blb(this,b);a=new lt(this,this.ha,this.Sa,a);a.mb=2;a.Sa=_.Jg(b.clone());b=!1;if(_.fa.navigator&&_.fa.navigator.sendBeacon)try{b=_.fa.navigator.sendBeacon(a.Sa.toString(),"")}catch(c){}!b&&_.fa.Image&&((new Image).src=a.Sa,b=!0);b||(a.ha=Vkb(a.Aa,null),a.ha.send(a.Sa));a.Wa=Date.now();Ukb(a)}Clb(this)}',
    {
      lt: bt,
      Image: SyntheticImage,
      Blb: Ylb,
      Vkb: rlb,
      Ukb: (a: any) => {
        requests.push(a);
        calls.terminate++;
        qlb(a);
      },
      Alb: Xlb,
      Clb: Zlb,
    },
  );
  const hmb = create('function(a){this.ha=a}');
  hmb.prototype.isActive = create('function(){return!0}');
  hmb.prototype.bkd = create('function(){this.ha.dispatchEvent("Sd")}');
  const jmb = create('function(a){Jkb.call(this);this.status=1;this.errorCode=a}', {
    Jkb: function (this: any) {
      this.type = 'Ud';
      protocolErrors.push(this);
    },
  });
  hmb.prototype.akd = create('function(a){this.ha.dispatchEvent(new Mlb(a))}', {
    Mlb: function (this: any, a: unknown) {
      this.type = 'Vd';
      this.data = a;
    },
  });
  hmb.prototype.DU = create('function(a,b){this.ha.dispatchEvent(new Nlb(b))}', { Nlb: jmb });
  _.ZJ = create(
    'class extends Error{constructor(a,b){super(b?`error code ${a}: ${b}`:`error code ${a}`);this.Vf=a}}',
  );
  hmb.prototype.ALe = create('function(){}');
  hmb.prototype.Zjd = create('function(){this.ha.dispatchEvent("Td")}');
  const fmb = create(
    'function(a,b){_.Yb.call(this);this.ha=new nt(b);this.wa=a;this.Xm=null;this.ka=b&&b.cVf||null;a=b&&b.aVf||null;b&&b.GYg&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"});this.ha.Na=a;a=b&&b.zS||null;b&&b.bBa&&(a?a["X-WebChannel-Content-Type"]=b.bBa:a={"X-WebChannel-Content-Type":b.bBa});b&&b.JCd&&(a?a["X-WebChannel-Client-Profile"]=b.JCd:a={"X-WebChannel-Client-Profile":b.JCd});this.ha.Oc=a;(a=b&&b.Kcb)&&!_.ja(a)&&(this.ha.Ga=a);this.Da=b&&b.Z2a||!1;this.Aa=b&&b.y1a||\n!1;(b=b&&b.Lcb)&&!_.ja(b)&&(this.ha.mb=b,a=this.ka,a!==null&&b in a&&_.Uta(this.ka,b));this.oa=new Llb(this)}',
    { nt: dt, Llb: hmb },
  );
  _.Eb = create('function(){this.n5=this.n5;this.b_a=this.b_a}');
  _.Rb = create('function(a){this.src=a;this.listeners={};this.ha=0}');
  _.Yb = create('function(){_.Eb.call(this);this.Mpa=new _.Rb(this);this.Dff=this;this.R0c=null}');
  Object.setPrototypeOf(fmb.prototype, _.Yb.prototype);
  _.Gb = class {};
  _.Hb = create(
    'function(a,b){this.type=a instanceof _.Gb?String(a):a;this.currentTarget=this.target=b;this.defaultPrevented=this.ka=!1}',
  );
  _.Yb.prototype.oqa = create('function(){return this.R0c}');
  _.Yb.prototype.dispatchEvent = create(
    'function(a){var b,c=this.oqa();if(c)for(b=[];c;c=c.oqa())b.push(c);c=this.Dff;var d=a.type||a;if(typeof a==="string")a=new _.Hb(a,c);else if(a instanceof _.Hb)a.target=a.target||c;else{var e=a;a=new _.Hb(d,c);_.Qb(a,e)}e=!0;var f;if(b)for(f=b.length-1;!a.ka&&f>=0;f--){var g=a.currentTarget=b[f];e=g.Sab(d,!0,a)&&e}a.ka||(g=a.currentTarget=c,e=g.Sab(d,!0,a)&&e,a.ka||(e=g.Sab(d,!1,a)&&e));if(b)for(f=0;!a.ka&&f<b.length;f++)g=a.currentTarget=b[f],e=g.Sab(d,!1,a)&&e;return e}',
  );
  _.Yb.prototype.Sab = create(
    'function(a,b,c){a=this.Mpa.listeners[String(a)];if(!a)return!0;a=a.concat();var d=!0;for(let e=0;e<a.length;++e){let f=a[e];if(f&&!f.removed&&f.capture==b){let g=f.listener,k=f.handler||f.src;f.r8a&&this.m4(f);d=g.call(k,c)!==!1&&d}}return d&&!c.defaultPrevented}',
  );
  _.ja = (a: string) => !a.trim();
  fmb.prototype.open = create(
    'function(){this.ha.wa=this.oa;this.Da&&(this.ha.Ab=!0);this.ha.connect(this.wa,this.ka||void 0)}',
  );
  fmb.prototype.close = create('function(){this.ha.disconnect()}');
  fmb.prototype.send = create(
    'function(a){var b=this.ha;if(typeof a==="string"){var c={};c.__data__=a;a=c}else this.Aa&&(c={},c.__data__=_.Wj(a),a=c);b.oa.push(new ulb(b.Ih++,a));b.fU==3&&tlb(b)}',
    {
      ulb: create('class{constructor(a,b){this.mapId=a;this.map=b;this.context=null}}'),
      tlb: Qlb,
    },
  );
  _.Klb = create('function(a,b){return new Jlb(a,b)}', { Jlb: fmb });
  _.BDb = () => {
    calls.factory++;
    return {};
  };
  _.Nr = _.Wu = _.pd = () => '';
  _.jf = (_: unknown, d: unknown) => d;
  _.FDb = create(
    'function(a,b,c={},d=!1){var e=Object.assign({},_.BDb()),f=_.Nr([]);f&&(e.Authorization=f);(f=_.Wu())&&(e["X-Goog-AuthUser"]=f);e["X-Goog-Api-Key"]=b;(b=_.jf(_.pd("PI9WOb"),""))&&(e["X-Server-Token"]=b);if(d=EDb(a,d))e["X-Origin"]=window.location.origin;return _.Klb(a,Object.assign({},{Lcb:"gsessionid",Z2a:!0,y1a:!0,fHd:!0},d?{}:{Kcb:"$httpHeaders"},c,{zS:Object.assign({},e,c.zS||{})}))}',
    { EDb: () => false },
  );
  // Literal subscription bookkeeping with only exception reporting inert.
  const kmb = create('function(a,b){a&&(b=a.indexOf(b),0<=b&&a.splice(b,1))}');
  const mnb = create(
    'class extends Error{constructor(a){super(a?`${a.length} errors occurred during unsubscription:\n${a.map((b,c)=>`${c+1}) ${b.toString()}`).join("\\n  ")}`:"");this.errors=a;Object.setPrototypeOf(this,new.target.prototype);this.name="UnsubscriptionError"}}',
  );
  _.qt = create(
    'class{constructor(a){this.Na=a;this.closed=!1;this.wa=this.oa=null}unsubscribe(){if(!this.closed){this.closed=!0;let c=this.oa;if(Array.isArray(c))for(var a of c)a.remove(this);else c==null||c.remove(this);a=this.Na;if(_.pt(a))try{a()}catch(e){var b=e instanceof qnb?e.errors:[e]}let d=this.wa;if(d){this.wa=null;for(let e of d)try{_.pt(e)?e():e.unsubscribe()}catch(f){let g;b=(g=b)!=null?g:[];f instanceof qnb?b=[...b,...f.errors]:b.push(f)}}if(b)throw new qnb(b);}}add(a){if(a&&a!==this)if(this.closed)_.pt(a)?a():\na.unsubscribe();else{if(a instanceof _.qt){if(a.closed||a.Ha(this))return;a.Ga(this)}let b;(this.wa=(b=this.wa)!=null?b:[]).push(a)}}Ha(a){var b=this.oa;return b===a||Array.isArray(b)&&b.includes(a)}Ga(a){var b=this.oa;this.oa=Array.isArray(b)?(b.push(a),b):b?[b,a]:a}Ja(a){var b=this.oa;b===a?this.oa=null:Array.isArray(b)&&Olb(b,a)}remove(a){var b=this.wa;b&&Olb(b,a);a instanceof _.qt&&a.Ja(this)}}',
    { Olb: kmb, qnb: mnb },
  );
  _.qt.ha = new _.qt();
  _.qt.ha.closed = true;
  _.pt = create('function(a){return typeof a==="function"}');
  const pnb = create(
    'class{constructor(a){this.ha=a}next(a){var b=this.ha;if(b.next)try{b.next(a)}catch(c){Rlb(c)}}error(a){var b=this.ha;if(b.error)try{b.error(a)}catch(c){Rlb(c)}else Rlb(a)}complete(){var a=this.ha;if(a.complete)try{a.complete()}catch(b){Rlb(b)}}}',
    {
      Rlb: (error: unknown) => {
        if (lifecycle) deferredErrors.push(error);
        else throw error;
      },
    },
  );
  const lmb = create(
    'function(a){return a instanceof _.qt||a&&"closed"in a&&_.pt(a.remove)&&_.pt(a.add)&&_.pt(a.unsubscribe)}',
  );
  const onb = Function(
    '_',
    'tnb',
    'Plb',
    'let snb; return snb = ' +
      'class extends _.qt{static create(a,b,c){return new _.Tmb(a,b,c)}constructor(a){super();this.Ys=!1;this.destination=a instanceof snb?a:new tnb(!a||_.pt(a)?{next:a!=null?a:void 0}:a);Plb(a)&&a.add(this)}next(a){this.Ys||this.Nj(a)}error(a){this.Ys||(this.Ys=!0,this.M6a(a))}complete(){this.Ys||(this.Ys=!0,this.ha())}unsubscribe(){this.closed||(this.Ys=!0,super.unsubscribe())}Nj(a){this.destination.next(a)}M6a(a){this.destination.error(a);this.unsubscribe()}ha(){this.destination.complete();this.unsubscribe()}}',
  )(_, pnb, lmb);
  _.Tmb = create(
    'class extends snb{constructor(a,b,c){super();var d;_.pt(a)||!a?d={next:a!=null?a:void 0,error:b!=null?b:void 0,complete:c!=null?c:void 0}:d=a;this.destination=new tnb(d)}}',
    { snb: onb, tnb: pnb },
  );
  _.Slb = create(
    'function(a){return a.length===0?_.rt:a.length===1?a[0]:function(b){return a.reduce((c,d)=>d(c),b)}}',
  );
  _.uA = create(
    'function(a){a||(a=_.x(_.yx));var b=new _.st(c=>{if(a.dg)c.next();else return a.Wc(c.next.bind(c))});return c=>c.pipe(_.bu(b))}',
  );
  _.st = create(
    'class{constructor(a){a&&(this.ha=a)}lift(a){var b=new _.st;b.source=this;b.operator=a;return b}subscribe(a,b,c){a=a&&a instanceof snb||a&&_.pt(a.next)&&_.pt(a.error)&&_.pt(a.complete)&&Plb(a)?a:new _.Tmb(a,b,c);b=this.operator;c=this.source;a.add(b?b.call(a,c):c?this.ha(a):this.Da(a));return a}Da(a){try{return this.ha(a)}catch(b){a.error(b)}}forEach(a,b){b=Tlb(b);return new b((c,d)=>{var e=this.subscribe(f=>{try{a(f)}catch(g){d(g),e==null||e.unsubscribe()}},d,c)})}ha(a){var b;return(b=this.source)==\nnull?void 0:b.subscribe(a)}[Zlb](){return this}pipe(...a){return a.length?_.Slb(a)(this):this}VDa(){var a=Tlb(a);return new a((b,c)=>{var d;this.subscribe(e=>d=e,e=>c(e),()=>b(d))})}}',
    { snb: onb, Plb: lmb, Zlb: Symbol('synthetic-observable'), Tlb: () => Promise },
  );
  _.Yt = create(
    'class extends _.st{constructor(){super();this.observers=[];this.hasError=this.Ys=this.closed=!1;this.oa=null}lift(a){var b=new vnb(this,this);b.operator=a;return b}ka(){if(this.closed)throw new unb;}next(a){this.ka();if(!this.Ys){let b=this.observers.slice();for(let c of b)c.next(a)}}error(a){this.ka();if(!this.Ys){this.hasError=this.Ys=!0;this.oa=a;let b=this.observers;for(;b.length;)b.shift().error(a)}}complete(){this.ka();if(!this.Ys){this.Ys=!0;let a=this.observers;for(;a.length;)a.shift().complete()}}unsubscribe(){this.Ys=\nthis.closed=!0;this.observers=null}get Ja(){var a;return((a=this.observers)==null?void 0:a.length)>0}Da(a){this.ka();return super.Da(a)}ha(a){this.ka();this.Aa(a);return this.Ga(a)}Ga(a){var b=this.Ys,c=this.observers;return this.hasError||b?_.qt.ha:(c.push(a),new _.qt(()=>Olb(this.observers,a)))}Aa(a){var b=this.oa,c=this.Ys;this.hasError?a.error(b):c&&a.complete()}}',
    {
      Olb: kmb,
      unb: Error,
      vnb: function (...args: any[]) {
        return new rnb(...args);
      },
    },
  );
  const rnb = create(
    'class extends _.Yt{constructor(a,b){super();this.destination=a;this.source=b}next(a){var b,c;(b=this.destination)==null||(c=b.next)==null||c.call(b,a)}error(a){var b,c;(b=this.destination)==null||(c=b.error)==null||c.call(b,a)}complete(){var a,b;(a=this.destination)==null||(b=a.complete)==null||b.call(a)}ha(a){var b,c;return(c=(b=this.source)==null?void 0:b.subscribe(a))!=null?c:_.qt.ha}}',
  );
  _.zt = create(
    'class extends snb{constructor(a,b,c,d,e){super(a);this.Da=e;b&&(this.Nj=function(f){try{b(f)}catch(g){this.destination.error(g)}});c&&(this.M6a=function(f){try{c(f)}catch(g){this.destination.error(g)}this.unsubscribe()});d&&(this.ha=function(){try{d()}catch(f){this.destination.error(f)}this.unsubscribe()})}unsubscribe(){var a;this.closed||(a=this.Da)!=null&&a.call(this);super.unsubscribe()}}',
    { snb: onb },
  );
  _.xt = create(
    'function(a){return b=>{if(_.pt(b==null?void 0:b.lift))return b.lift(function(c){try{return a(c,this)}catch(d){this.error(d)}});throw new TypeError("ch");}}',
  );
  _.Vt = create(
    'function(a){return a<=0?()=>_.It:_.xt((b,c)=>{var d=0;b.subscribe(new _.zt(c,e=>{++d<=a&&(c.next(e),a<=d&&c.complete())}))})}',
  );
  _.bu = create(
    'function(a){return _.xt((b,c)=>{_.tt(a).subscribe(new _.zt(c,()=>c.complete(),void 0,_.Qlb));!c.closed&&b.subscribe(c)})}',
  );
  _.tt = create(
    'function(a){if(a instanceof _.st)return a;if(a!=null){if(_.pt(a[Zlb]))return emb(a);if(_.cmb(a))return fmb(a);if(_.pt(a==null?void 0:a.then))return gmb(a);if(Symbol.asyncIterator&&_.pt(a==null?void 0:a[Symbol.asyncIterator]))return hmb(a);if(_.pt(a==null?void 0:a[Xlb]))return imb(a)}throw bmb(a);}',
    { Zlb: Symbol('synthetic-observable') },
  );
  _.Qlb = create('function(){}');
  _.yx = class {};
  _.Ow = create('function(a){return(a[2]&256)===256}');
  _.YNb = create(
    'function(a,b){if(_.Ow(a))throw new _.Dw(911,!1);a[21]===null&&(a[21]=[]);a[21].push(b)}',
  );
  _.ZNb = create('function(a,b){a[21]!==null&&(b=a[21].indexOf(b),b!==-1&&a[21].splice(b,1))}');
  const GOb = create(
    'class extends _.yx{constructor(){var a=_.y();super();this.Ps=a}get dg(){return _.Ow(this.Ps)}Wc(a){var b=this.Ps;_.YNb(b,a);return()=>_.ZNb(b,a)}}',
  );
  let lifetime = Object.assign(Object.create(GOb.prototype), {
    Ps: Object.assign([], { 2: 0, 21: null }),
  });
  _.Lx = class {};
  _.JNb = create('function(a){if(a.dg)throw new _.Dw(-205,!1);}');
  _.dw = () => null;
  _.uWb = create(
    'class extends _.Lx{get dg(){return this.jg}constructor(a,b,c,d){super();this.parent=b;this.source=c;this.scopes=d;this.Pn=new Map;this.Bwc=new Set;this.Zpb=[];this.jg=!1;KNb(a,e=>tWb(this,e));this.Pn.set(qWb,FNb(void 0,this));d.has("environment")&&this.Pn.set(_.Lx,FNb(void 0,this));a=this.Pn.get(_.rWb);a!=null&&typeof a.value==="string"&&this.scopes.add(a.value);this.zVd=new Set(this.get(vNb,_.Kw,{self:!0}))}pCa(a,b){b=_.gNb(b)||0;try{return this.get(a,_.pWb,b)}catch(c){if(_.rf(c))return c;\nthrow c;}}destroy(){_.JNb(this);this.jg=!0;var a=_.dw(null);try{for(let c of this.Bwc)c.Lb();let b=this.Zpb;this.Zpb=[];for(let c of b)c()}finally{this.Pn.clear(),this.Bwc.clear(),this.zVd.clear(),_.dw(a)}}Wc(a){_.JNb(this);this.Zpb.push(a);return()=>{var b=this.Zpb.indexOf(a);b!==-1&&this.Zpb.splice(b,1)}}get(a,b=_.pWb,c){_.JNb(this);if(Object.hasOwn(a,oWb))return a[oWb](this);c=_.gNb(c);var d=_.pf(this),e=_.Fw();try{if(!(c&4)){let r=this.Pn.get(a);if(r===void 0){let u=(typeof a==="function"||typeof a===\n"object"&&a.PYc==="InjectionToken")&&_.NMb(a);var f;if(f=u)if(u.hb){var g=_.Hw(u.hb);f=typeof g==="string"?g==="any"||this.scopes.has(g):this.zVd.has(g)}else f=!1;f?r=FNb(ENb(a),HNb):r=null;this.Pn.set(a,r)}if(r!=null)return this.d6b(r,c)}let k=c&2?_.CNb():this.parent;b=c&8&&b===_.pWb?null:b;return k.get(a,b)}catch(k){let r=k[ZMb];if(r===-200||r===-201)throw new _.Dw(r,null);throw k;}finally{_.Fw(e),_.pf(d)}}L0a(){var a=_.dw(null),b=_.pf(this),c=_.Fw();try{let d=this.get(_.wNb,_.Kw,{self:!0});for(let e of d)e()}finally{_.pf(b),\n_.Fw(c),_.dw(a)}}toString(){return"R3Injector[...]"}d6b(a,b){var c=_.dw(null);try{if(a.value===sWb)throw aNb(-200);a.value===HNb&&(a.value=sWb,a.value=a.Xa(void 0,b));var d;if(d=typeof a.value==="object"&&a.value){var e=a.value;d=e!==null&&typeof e==="object"&&typeof e.Lb==="function"}d&&this.Bwc.add(a.value);return a.value}finally{_.dw(c)}}}',
  );
  if (lifecycle === 'wvb')
    lifetime = Object.assign(Object.create(_.uWb.prototype), {
      jg: false,
      Zpb: [],
      Bwc: new Set(),
      Pn: new Map(),
      zVd: new Set(),
    });
  _.x = () => lifetime; // Synthetic injection fallback for the original lifecycle operator.
  if (lifecycle) api.Ia = lifetime;
  _.gu = create(
    'class extends _.Yt{constructor(a){super();this.Pm=a}get value(){return this.getValue()}ha(a){var b=super.ha(a);!b.closed&&a.next(this.Pm);return b}getValue(){var a=this.oa,b=this.Pm;if(this.hasError)throw a;this.ka();return b}next(a){super.next(this.Pm=a)}}',
  );
  _.Eb = create('function(){this.n5=this.n5;this.b_a=this.b_a}');
  _.ak = create('function(a){_.Eb.call(this);this.Ha=a;this.wa={}}');
  _.ak.prototype.listen = create(
    'function(a,b,c,d){Array.isArray(b)||(b&&(Xta[0]=b.toString()),b=Xta);for(let e=0;e<b.length;e++){let f=_.me(a,b[e],c||this.handleEvent,d||!1,this.Ha||this);if(!f)break;this.wa[f.key]=f}return this}',
    { Xta: [] },
  );
  _.ak.prototype.removeAll = create(
    'function(){_.Kb(this.wa,function(a,b){this.wa.hasOwnProperty(b)&&_.oe(a)},this);this.wa={}}',
  );
  // Private listener matching/removal is synthetic; public delegate bodies stay literal.
  _.Uba = create(
    'function(a,b,c,d,e){this.listener=a;this.proxy=null;this.src=b;this.type=c;this.capture=!!d;this.handler=e;this.key=++Tba;this.removed=this.r8a=!1}',
    { Tba: 0 },
  );
  _.Rb.prototype.add = create(
    'function(a,b,c,d,e){var f=a.toString();a=this.listeners[f];a||(a=this.listeners[f]=[],this.ha++);var g=Cga(a,b,d,e);g>-1?(b=a[g],c||(b.r8a=!1)):(b=new _.Uba(b,this.src,f,!!d,e),b.r8a=c,a.push(b));return b}',
    {
      Cga: (list: any[], fn: any, capture: any, owner: any) =>
        list.findIndex(
          (r) => !r.removed && r.listener === fn && r.capture === !!capture && r.handler === owner,
        ),
    },
  );
  _.Yb.prototype.listen = create('function(a,b,c,d){return this.Mpa.add(String(a),b,!1,c,d)}');
  _.Yb.prototype.m4 = create('function(a){return Dga(this.Mpa,a)}', {
    Dga: (map: any, a: any) => {
      const list = map.listeners[a.type];
      const i = list.indexOf(a);
      if (i < 0) return false;
      list.splice(i, 1);
      if (!list.length) delete map.listeners[a.type];
      a.removed = true;
      a.listener = a.proxy = a.src = a.handler = null;
      return true;
    },
  });
  _.Aga = 'synthetic-event-marker';
  _.Yb.prototype[_.Aga] = true;
  _.ke = create('function(a){return!(!a||!a[_.Aga])}');
  _.Ed = create('function(a){var b=typeof a;return b=="object"&&a!=null||b=="function"}');
  _.Hga = create(
    'function(a){if(typeof a==="function")return a;a[Oga]||(a[Oga]=function(b){return a.handleEvent(b)});return a[Oga]}',
  );
  _.me = create(
    'function(a,b,c,d,e){if(d&&d.once)return _.le(a,b,c,d,e);if(Array.isArray(b)){for(let f=0;f<b.length;f++)_.me(a,b[f],c,d,e);return null}c=_.Hga(c);return _.ke(a)?a.listen(b,c,_.Ed(d)?!!d.capture:!!d,e):Iga(a,b,c,!1,d,e)}',
  );
  _.Kb = create('function(a,b,c){for(let d in a)b.call(c,a[d],d,a)}');
  _.oe = create(
    'function(a){if(typeof a==="number"||!a||a.removed)return!1;var b=a.src;if(_.ke(b))return b.m4(a);var c=a.type,d=a.proxy;b.removeEventListener?b.removeEventListener(c,d,a.capture):b.detachEvent?b.detachEvent(Lga(c),d):b.addListener&&b.removeListener&&b.removeListener(d);Gga--;(c=_.Jga(b))?(Dga(c,a),c.ha==0&&(c.src=null,b[Ega]=null)):Bga(a);return!0}',
  );

  const $Ed = create(
    'class{constructor(a,b,c,d,e={}){this.endpoint=a;this.apiKey=b;this.FCa=c;this.NTa=d;this.Qj=new _.ak;this.connectedObs=this.uC=new _.gu(!1);this.s1=this.Ki=new _.Yt;this.uq=iud(this.endpoint,this.apiKey,e);this.s0a()}connect(){this.uC.value||this.uq.open()}disconnect(){this.uq.close()}send(a){this.uC.value?this.uq.send(this.FCa(a)):this.Ki.next({eventType:"channel_error",error:new _.ZJ(2,"Channel is not connected. Cannot send message")})}s0a(){this.uq&&(this.Qj.listen(this.uq,"Sd",this.cWa.bind(this)),\nthis.Qj.listen(this.uq,"Td",this.Xya.bind(this)),this.Qj.listen(this.uq,"Vd",this.b$.bind(this)),this.Qj.listen(this.uq,"Ud",this.aza.bind(this)))}cWa(){this.uC.next(!0);this.Ki.next({eventType:"channel_open"})}Xya(){this.Qj.removeAll();this.Ki.next({eventType:"channel_close"});this.Ki.complete();this.uC.next(!1);this.uC.complete()}b$(a){if(a.data&&Array.isArray(a.data)&&a.data.length!==0)if(a.ha==="status"){let b=_.DDb(a.data);b.hKa||this.Ki.next({eventType:"channel_error",error:new _.ZJ(1,`{status: ${b.statusCode}, message: ${b.statusMessage}}`),\nerrorDetail:JSON.stringify(a.data,void 0,2)})}else a=this.NTa(a.data[0]),this.Ki.next({eventType:"channel_message",message:a});else this.Ki.next({eventType:"channel_error",error:new _.ZJ(2,"Channel message received with empty data")})}aza(a){switch(a.status){case 1:this.Ki.next({eventType:"channel_error",error:new _.ZJ(4,"Network error")});break;case 2:this.Ki.next({eventType:"channel_error",error:new _.ZJ(3,"Server error")});break;default:this.Ki.next({eventType:"channel_error",error:new _.ZJ(2,\n"Unknown error")})}}}',
    { iud: (a: unknown, b: unknown, c: unknown) => _.FDb(a, b, c, false) },
  );
  const aFd = create(
    'class extends lHd{constructor(a,b,c,d={}){super(a,b,e=>e.serialize(),e=>_.Th(_.Lo(c,(0,_.be)(e))),Object.assign({},{bBa:"application/json+protobuf"},d))}}',
    { lHd: $Ed },
  );
  const bFd = create(
    'class extends lHd{constructor(a,b,c,d,e={}){super(a,b,f=>_.Tg(c(f)),f=>{f=typeof f==="string"?_.Ck(f):f;return d(f)},Object.assign({},{bBa:"application/x-protobuf"},e))}}',
    { lHd: $Ed },
  );
  _.YJd = create(
    'function(a,b,c="v1/llmBidiStreamProxy",d){return new mHd(`${a.ka}/${c}`,a.ha,b,...(d!==void 0?[d]:[]))}',
    { mHd: aFd },
  );
  const EHd = create(
    'function(a,b=!1){a.Ha!==void 0&&(clearTimeout(a.Ha),a.Ha=void 0);a.hasError=a.hasError||b;a.wD=!0;a.ha=!1;a.t$=!1;a.oa.length=0}',
    { clearTimeout: _.fa.clearTimeout },
  );
  _.TId = create('function(a,b){return _.Pi(a,1,b)}');
  _.sJd = create('function(a,b){return _.ei(a,4,_.eM,b)}');
  _.iM = create(
    'function(a){a.wD||a.t$||(a.ha?(a.t$=!0,a.connection.send(_.Th(_.sJd(new _.tJd,_.Th(_.TId(new _.UId,1))))),a.Ha=setTimeout(()=>{a.wD||a.disconnect()},2E4)):a.disconnect())}',
    { setTimeout: _.fa.setTimeout },
  );
  const IHd = create(
    'class{constructor(a,b){this.connection=a;this.hasError=this.wD=this.ha=!1;this.wa=0;this.Ja=!1;this.oa=[];this.t$=!1;this.Va=this.tB=new _.Yt;this.Sa=this.ka=new _.Yt;this.Na=this.Da=new _.Yt;this.Ga=(b?this.connection.s1.pipe(_.uA(b)):this.connection.s1).subscribe(c=>{switch(c.eventType){case "channel_message":c=c.message;switch(_.Yh(c,_.hM)){case 2:c=_.ci(c,_.HJd,2,_.hM);var d,e,f;if(c=(d=_.ci(c,_.BJd,7,_.gM))==null?void 0:(e=_.ci(d,_.AJd,1,_.CJd))==null?void 0:(f=_.zJd(e))==null?void 0:_.m(f,\n_.HF,4)){d=c;e=_.DL(d);if(e==null?0:_.n(e,2)){var g;f=e.ig()||((g=this.Aa)==null?void 0:g.ig())||"";this.Aa=g=_.Th(_.NI(_.MI(new _.CI,f),_.n(e,2)));f&&!e.ig()&&(d=_.Mg(d),g=_.Hh(d,_.CI,2,g),d=_.Bf(g))}else this.Aa&&(g=(e==null?void 0:e.ig())||this.Aa.ig(),e=_.n(this.Aa,2),this.Aa=g=_.Th(_.NI(_.MI(new _.CI,g),e)),d=_.Mg(d),g=_.Hh(d,_.CI,2,g),d=_.Bf(g));this.tB.next(d)}break;case 4:KJd(this);this.ka.next(void 0);this.ka.complete();this.tB.complete();this.Ga.unsubscribe();this.connection.disconnect();\nbreak;case 5:KJd(this),this.ka.next(void 0),this.ka.complete(),this.tB.complete()}break;case "channel_error":KJd(this,!0);this.ka.next(c.error);this.tB.Ja&&this.tB.error(c.error);break;case "channel_close":KJd(this);this.ka.next(void 0);this.tB.complete();this.Da.complete();this.Ga.unsubscribe();break;case "channel_open":for(this.ha=!0;this.ha&&this.oa.length>0;)g=this.oa.shift(),this.connection.send(g);this.Da.next()}})}connect(){this.connection.connect()}disconnect(){KJd(this);this.Ga.unsubscribe();\nthis.tB.complete();this.Da.complete();this.ka.complete();this.connection.disconnect()}thc(a){this.wa++;this.Ja=!0;a=_.Th(_.jJd(new _.dM,this.wa).Ni(a));a=_.Th((new _.tJd).Bg(a));if(this.ha)this.connection.send(a);else{let b,c;(c=(b=this.connection).bfc)==null||c.call(b,a);this.oa.push(a)}}}',
    { KJd: EHd },
  );
  _.dKd = create(
    'function(a,b,c){if(a.oa){let d=vtd(`${a.ha.ka}/v1/conversations:processSession`),e=_.Nr([]);c=c==null?void 0:c.zS;a=new VJd(d,{CWb:e?e:void 0,apiKey:a.ha.ha,BWb:a.ka.Qy(),zS:c});return new OJd(a,b)}if(a.wa)return a=ZJd(a.ha,d=>uJd(d),d=>_.Th(IJd(d)),c),new OJd(a,b);a=_.YJd(a.ha,_.xzd,"v1/processSession",c);return new OJd(a,b)}',
    {
      OJd: IHd,
      uJd: (value: any) => {
        const bytes = new TextEncoder().encode(JSON.stringify(jsonArray(value.fl, _.qb)));
        serialized.push({ message: value, data: _.Tg(bytes) });
        return bytes;
      },
      IJd: (value: any) => {
        decodeHook();
        decoded = incoming ?? value;
        return decoded;
      },
      ZJd: (a: any, b: any, c: any, d: any) => new bFd(`${a.ka}/v1/processSession`, a.ha, b, c, d),
    },
  );
  const metadata = {};
  api.Ga = new Map();
  api.ka = { handleError() {} };

  // Original shared native preparation/recovery; timer, network and metrics leaves are invented.
  const metric = { increment() {}, Od() {} };
  const sharedMetrics: any = {
    requestSource: 1,
    getEnvironment: () => 'SYNTHETIC',
    document: { defaultView: {} },
    Ga: metric,
    Ja: metric,
    Aa: metric,
    Wa: metric,
    Da: metric,
  };
  const nativeRecoveryFlag = Symbol('synthetic-native-recovery');
  const rpcRecoveryFlag = Symbol('synthetic-rpc-recovery');
  _.jM = Symbol('synthetic-native-route');
  _.tKd = nativeRecoveryFlag;
  _.uKd = rpcRecoveryFlag;
  const settings = { Ea: (flag: unknown) => flag === _.jM || flag === nativeRecoveryFlag };
  const SharedService = create(
    'class{constructor(){this.Ca=_.x(_.Lz);this.Aa=_.x(_.kM);this.ka=_.x(_.DKd);this.Da=_.x(_.YL);this.Ga=_.x(_.EA);this.oa=_.x(_.aM);this.ha=_.x(nKd);this.Gc=_.x(_.yK);this.xr=_.x(_.gL);this.Ha=_.x(_.xK);this.requestSource=_.DA(this.Ga);this.uv=_.Z(this.xr.HQ,{initialValue:{id:null,EB:null}});this.Hga=_.Z(this.Ha.Ja,{initialValue:!1})}get wa(){return this.Ca.Ea(_.jM)}get SHa(){return this.wa?\nthis.Ca.Ea(_.tKd):this.Ca.Ea(_.uKd)}reset(){this.ka.reset()}}',
    {},
  );
  const network = new _.Yt();
  let sharedState: any, sharedObserver: any, sharedRetry: any;
  const sharedTimers: Array<() => void> = [];
  const timerObservable = (_delay: unknown, interval?: unknown) =>
    new _.st((observer: any) => {
      const id = ++timerId;
      const run = () => {
        if (!observer.closed) {
          observer.next(undefined);
          if (interval === undefined) observer.complete();
        }
      };
      sharedTimers.push(run);
      timers.set(id, run);
      return () => {
        timers.delete(id);
      };
    });
  _.Gt = timerObservable;
  _.v = (project: Function) => (input: any) =>
    new _.st((observer: any) =>
      input.subscribe({
        next: (value: any) => observer.next(project(value)),
        error: (error: unknown) => observer.error(error),
        complete: () => observer.complete(),
      }),
    );
  _.Kt = (predicate: Function) => (input: any) =>
    new _.st((observer: any) =>
      input.subscribe({
        next: (value: any) => {
          if (predicate(value)) observer.next(value);
        },
        error: (error: unknown) => observer.error(error),
        complete: () => observer.complete(),
      }),
    );
  _.zw = (project: Function) => (input: any) =>
    new _.st((observer: any) => {
      let inner: any;
      const outer = input.subscribe({
        next: (value: any) => {
          inner?.unsubscribe();
          inner = project(value).subscribe(observer);
        },
        error: (error: unknown) => observer.error(error),
      });
      return () => {
        inner?.unsubscribe();
        outer.unsubscribe();
      };
    });
  _.Lt = _.sw = () => (input: any) => input;
  _.Ot = (recover: Function) => (input: any) =>
    new _.st((observer: any) => {
      let replacement: any;
      const sub = input.subscribe({
        next: (value: unknown) => observer.next(value),
        error: (error: unknown) => {
          replacement = recover(error).subscribe(observer);
        },
        complete: () => observer.complete(),
      });
      return () => {
        replacement?.unsubscribe();
        sub.unsubscribe();
      };
    });
  _.t = (value: unknown) =>
    new _.st((observer: any) => {
      observer.next(value);
      observer.complete();
    });
  _.Ezd = (error: any) => error?.syntheticNetwork === true;
  _.Gzd = () => 'SYNTHETIC_NETWORK';
  const OHd = create(
    'function(a){return _.Gt(0,2E3).pipe(_.zw(()=>a.fae(5E3)),_.Kt(Boolean),_.Vt(1),_.Lt({first:6E4}),_.v(()=>{}))}',
  );
  const UJd = create('function(a){a=a.Ca.Ea(vKd);return a>0?a:1500}', {
    vKd: Symbol('synthetic-probe-delay'),
  });
  const VJd = create(
    'function(a,b,c,d="UNKNOWN"){var e=a.ha.getValue().status;if(e==="WAITING_FOR_NETWORK"||e==="RECONNECTING")return _.t(!1);if(!b.isEligible)return a.ha.next({status:"FAILED",ze:c}),_.t(!1);if(a.oa>=4)return jKd(a.wa,"MAX_ATTEMPTS_EXCEEDED"),a.ha.next({status:"FAILED",ze:c}),_.t(!1);a.oa++;a.ha.next({status:"WAITING_FOR_NETWORK",ze:c});var f=performance.now();return oId(a.Aa).pipe(_.sw(yKd(a)),_.v(()=>{var g=Math.round(performance.now()-f),k=a.wa;k.Da.Od(g,d,k.requestSource);a.ha.next({status:"RECONNECTING",\nze:c});return!0}),_.Ot(()=>{jKd(a.wa,"PROBE_TIMEOUT");a.ha.next({status:"FAILED",ze:c});return _.t(!1)}))}',
    { oId: OHd, yKd: UJd, jKd() {}, performance: { now: () => now } },
  );
  const NJd = create('function(a){a.ka=!1;a.Aa=!1}');
  const MJd = create('function(a,b){a.oa=b}');
  const WJd = create(
    'function(a){var b=a.Ca.Ea(wKd);b=b>0?b:1500;var c=Math,d=c.max,e=a.Ca.Ea(xKd);c={attempt:a.ka,Bif:b,jUf:d.call(c,b,e>0?e:4E3)};a=Math.max(0,c.attempt);var f;b=(f=c.Bif)!=null?f:500;var g;f=(g=c.jUf)!=null?g:4E3;var k;g=(k=c.L2g)!=null?k:2;var r;k=Math.max(0,Math.min(1,(r=c.J1g)!=null?r:.2));var u;r=(u=c.y4g)!=null?u:Math.random;u=Math.min(f,b*Math.pow(g,a));r=1-k+2*k*r();return Math.max(0,Math.min(f,Math.round(u*r)))}',
    { wKd: Symbol('synthetic-retry-base'), xKd: Symbol('synthetic-retry-max') },
  );
  const dKd = create(
    'function(a,b,c,d){var e=b.request,f=c.getState().conversationId||e.conversationId;c=a.ka;c=c.oa===0?0:1+c.ka;c=Object.assign({},e,{conversationId:f,aib:"RECONNECT_TO_EXISTING_TURN"},c>0?{Ibe:c}:{});var g,k;b=_.Fyd(Object.assign({},b,{request:c}),a.requestSource,a.Gc,a.Aa,(k=(g=a.uv())==null?void 0:g.id)!=null?k:void 0,!e.ZKa&&a.Hga(),!1,a.Da.isSupported());\na=_.Th(_.hxd(new _.yL,f));a=_.vxd(b,a);_.Wh(a,3);(d=d==null?void 0:_.m(d,BL,109))&&_.Hh(b,BL,109,d);return{Fde:b,Gde:c}}',
    { BL: class extends _.l {} },
  );
  const OJd = create(
    'class{constructor(){this.conversationId="";this.wa=this.Aa=this.ka=this.ha=this.JL=this.committed=!1}Zp(){var a;(a=this.Da)==null||a.unsubscribe();var b;(b=this.oa)==null||b.call(this)}isEligible(){return this.committed&&!this.JL}getState(){return{conversationId:this.conversationId,\nisEligible:this.isEligible(),JL:this.JL,aib:this.isEligible()?"RECONNECT_TO_EXISTING_TURN":"NEW_REQUEST",committed:this.committed}}}',
  );
  const sharedService = Object.assign(Object.create(SharedService.prototype), {
    Ca: settings,
    ha: sharedMetrics,
    oa: {},
    requestSource: 1,
    Gc: {},
    Aa: false,
    uv: () => undefined,
    Hga: () => false,
    Da: { isSupported: () => false },
    ka: {
      Ca: settings,
      wa: sharedMetrics,
      Aa: { fae: () => network },
      oa: 0,
      ka: 0,
      ha: new _.gu({ status: 'IDLE', ze: approved.storeId }),
      reset() {
        this.oa = this.ka = 0;
      },
    },
  });
  const YJd = create(
    'function(a,b,c,d,e,f,g,k){var r=c.request;if(a.ka.ka<4){b=a.ka.ka;g=AKd(a.ka);a.ka.ka++;kKd(a.ha,f,b);lKd(a.ha,g,f,b);d.wa=!0;d.Zp();rKd(d);let {Fde:u,Gde:w}=KKd(a,c,d,k),B=_.Gt(g).subscribe(()=>{d.wa=!1;var C=e(u,w);d.oa=C});qKd(d,()=>{B.unsubscribe()})}else d.wa=!1,mKd(a.ha,f),FKd(a,r.ze,\nr.clientTurnId),b.error(GKd(g!=null?g:Error("xk")))}',
    {
      AKd: WJd,
      KKd: dKd,
      rKd: NJd,
      qKd: MJd,
      kKd() {},
      lKd() {},
      mKd() {},
      FKd() {},
      GKd: (value: unknown) => value,
    },
  );
  const aKd = create(
    'function(a,b,c,d,e,f,g){var k=d.request,r=e.getState();e.ha=!0;var u=_.Gzd(b);r=zKd(a.ka,r,k.ze,u).subscribe({next:w=>{if(w){w=a.oa;var B=k.clientTurnId;_.ZL(w,B,"logReconnectAttemptStarted")&&w.ha.log({flow:1,\nstep:190,tag:B});e.Zp();rKd(e);let {Fde:C,Gde:G}=KKd(a,d,e,g);w=f(C,G);e.oa=w}else c.error(GKd(b))},error:()=>{CKd(a.ka,k.ze);c.error(GKd(b))}});e.Da=r}',
    { zKd: VJd, rKd: NJd, KKd: dKd, CKd() {}, GKd: (value: unknown) => value },
  );
  const bKdOriginal = create(
    'function(a,b,c,d,e,f){var g=c.request;return{next:k=>{var r,u,w=_.wtd(k)?(r=k.response)==null?void 0:(u=r.Xc)==null?void 0:u.E5f:void 0;if(w==="SESSION_NOT_FOUND_TO_RECONNECT")EKd(a,b,c,d,e,"RESPONSE_METADATA",void 0,f);else if(w==="NOT_ELIGIBLE_TO_RECONNECT")d.ka=!0,d.Zp(),FKd(a,g.ze,g.clientTurnId),b.error(GKd(Error("wk")));else if(w==="TURN_ALREADY_EXISTS")k=a.ha,r=k.getEnvironment(),k.Ga.increment(r,k.requestSource),tId(a.oa,g.clientTurnId),BKd(a.ka,g.ze),(k=d.getState().conversationId||\ng.conversationId)&&b.next({responseType:"RECONNECT_TURN_ALREADY_EXISTS",conversationId:k,turnId:g.clientTurnId}),b.complete();else{r=g.ze;u=g.clientTurnId;if(d.ha&&!d.Aa){d.Aa=!0;w=a.ha;let B=w.getEnvironment();w.Ja.increment(B,w.requestSource);tId(a.oa,u);BKd(a.ka,r)}b.next(k)}},error:k=>{if(!d.ka)if(a.SHa&&Fzd(k))d.ka=!0,EKd(a,b,c,d,e,"RPC_ERROR",k,f);else{d.ka=!0;if(_.Ezd(k)){var r=_.Gzd(k),u=a.ha;u.Aa.increment(r,u.requestSource);u=a.ha;var w;let C=zzd((w=u.document.defaultView)!=null?w:void 0);\nvar B;w=Azd((B=u.document.defaultView)!=null?B:void 0);u.Wa.increment(C,w,r,u.requestSource);a.SHa?d.ha?iKd(a.ha,!1,"ALREADY_RECONNECTED"):d.isEligible()?iKd(a.ha,!0):iKd(a.ha,!1,d.committed?d.JL?"MUTATING_TOOL_USED":d.ha?"ALREADY_RECONNECTED":"UNKNOWN_ELIGIBILITY_REASON":"COMMIT_NOT_SENT"):iKd(a.ha,!1,"FLAG_DISABLED")}a.SHa&&!d.ha&&_.Ezd(k)&&d.isEligible()?HKd(a,k,b,c,d,e,f):(r=g.ze,B=g.clientTurnId,d.ha&&(u=_.Ezd(k)?"NETWORK_ERROR_ON_RETRY":"SERVER_ERROR_ON_RETRY",jKd(a.ha,u),tId(a.oa,B),CKd(a.ka,\nr)),b.error(_.Ezd(k)||d.ha?GKd(k):k))}},complete:()=>{d.wa||b.complete()}}}',
    {
      EKd: YJd,
      HKd: aKd,
      tId() {},
      BKd: create(
        'function(a,b){a.oa=0;a.ka=0;b=b!=null?b:a.ha.getValue().ze;a.ha.next({status:"SUCCESS",ze:b})}',
      ),
      FKd() {},
      GKd: (value: unknown) => value,
      iKd() {},
      jKd() {},
      zzd() {},
      Azd() {},
      CKd() {},
      Fzd: () => false,
    },
  );
  const cKd = create(
    'function(a,b,c,d,e){a.ka.reset();var f=new sKd,g=IKd(a,d,c,f,(k,r)=>e(k,r,g,f),b);a=e(b,c.request,g,f);f.oa=a;return()=>{f.Zp()}}',
    {
      sKd: OJd,
      IKd: (...args: any[]) => {
        sharedState = args[3];
        sharedRetry = args[4];
        sharedObserver = bKdOriginal(...args);
        return sharedObserver;
      },
    },
  );
  api.Wd = sharedService;
  api.Ab = { ha: {}, wa: { ha: 42 }, ka: { Ht: () => false }, oa: {} };
  _.Mrd = () => ({});
  _.kyd = () => false;
  _.ZCb = () => {
    beforeFactory();
    return metadata;
  };
  _.fKd = create(
    'function(a,b){var c=_.Mrd(a.ha,void 0,{modeId:b.wi,isTemporaryChat:b.isTemporaryChat,G6b:!0,CZa:b.CZa}),d=a.wa.ha;return _.ZCb({bardApplicationMetadata:c,requestSource:b.requestSource,clientTurnId:b.clientTurnId,isEnterpriseForGooglers:a.ka.Ht(),enableBlueStarAgency:_.kyd(a.oa),enableUniversalCartAgency:d===43,enableBlueRemyAgency:d===42||d===67})}',
  );
  _.XL = create('function(a){return _.m(a,_.DI,3)}');
  _.vL = create('function(a){return _.m(a,_.wL,1)}');
  _.ui = (value: any, field: number) => value.fl[field - 1] ?? 0;
  _.wtd = (value: any) => value?.responseType === 'TURN';
  _.vxd = (value: any, continuation: any) => {
    value.fl[71] = continuation;
    return value;
  };
  _.hxd = (value: any, cid: unknown) => {
    value.fl[0] = cid;
    return value;
  };
  _.ZL = () => false;
  const hyd = create(
    'function(a){if(!a)return"UNSPECIFIED";switch(a){case 1:return"SESSION_RECONNECTED";case 2:return"SESSION_NOT_FOUND_TO_RECONNECT";case 3:return"NOT_ELIGIBLE_TO_RECONNECT";case 4:return"TURN_ALREADY_EXISTS";default:return"UNSPECIFIED"}}',
  );
  // Exact current control projection; metric/UI primitives remain inert synthetic leaves.
  _.$h = (value: any, field: number) => Boolean(value.fl[field - 1]);
  const rLdOriginal = create(
    'function(a,b,c,d,e,f,g,k){var r=d.clientTurnId;HId(a.ka,r,b);WLd(a,b);var u=_.m(b,tAd,55);u&&GAd(a.zl,aAd(u));_.oi(b,15)&&IAd(a.zl);var w=_.m(b,vAd,65);w&&a.lja&&_.nL(a.Va)&&a.Za.pipe(_.Vt(1),_.uA(a.Ia)).subscribe({next:ig=>{try{ig.Ab(w,r,d.textQuery)}catch(Hi){}},error:()=>{}});if(!_.$h(b,37,_.GF)){var B=_.ui(b,63);if(B===2||B===3||B===4){let ig;e.next({responseType:"TURN",request:d,xj:!1,response:{turnId:(ig=d.clientTurnId)!=null?ig:"",draft:void 0,xB:[],No:[],isFinal:!0,JL:!1,W7:!1,K9:[],taa:[],\nXc:{E5f:Jyd(B)}}})}else{var {MNb:C,conversationId:G}=Uzd(b,c,d,a.Ub());G&&oKd(k,G);k==null||pKd(k,b);if(C)if(a.Zb()&&_.oi(b,15)&&_.FF(b).length>0&&_.di(b,_.eH,13).length===0&&e.next({responseType:"TURN_COMPLETED",turnId:C,conversationId:G}),_.ge(b,46)){var N=_.m(b,_.yL,46);e.next({responseType:"CONTINUATION_UPDATE",turnId:C,conversationId:G,Soa:N});_.ge(b,52)&&a.Fd&&(a=Iyd(_.m(b,uAd,52)),e.next({responseType:"DISCONNECT",turnId:C,conversationId:G,BFc:a}))}else{B=_.Ai(b,_.qAd,21,_.GF);var T;if((k=\n(T=B==null?void 0:_.n(B,1))!=null?T:"")||a.Aa&&B)a=_.mi(b,18),_.FF(b).length?e.error("Service routing response is invalid."):e.next(Object.assign({},{responseType:"ROUTING",turnId:C,eqa:k,conversationId:G},a?{bFd:a}:{}));else if(_.Ai(b,_.$0c,23,_.GF)){var aa;(a=(aa=_.Ai(b,_.$0c,23,_.GF))==null?void 0:_.Ai(aa,_.e1c,2,_.b1c))?(a={nzc:"RECALL_CLASSIFIER",qIb:_.di(a,_.qRc,1).map(ig=>_.rRc(ig))},e.next({responseType:"POST_HOC_ATTRIBUTION",turnId:C,attribution:a})):(a=izd(b),e.next({responseType:"POST_HOC_ATTRIBUTION",\nturnId:C,attribution:{nzc:"PERSONALIZATION_CLASSIFIER",n9d:a}}))}else if(aa=_.Ai(b,_.lsd,28,_.GF))e.next({responseType:"CONSUME_GEMINI_QUOTA",turnId:C,n5f:_.bsd(aa)}),(a=aa.ha())&&e.next({responseType:"BEST_MODE_FOR_NEXT_TURN",YRa:a});else if(a.Ml(b,d))if(_.Ai(b,sAd,11,_.GF)){var da,ta;e.next({responseType:"TITLE_GENERATION",conversationId:G,title:(ta=(da=_.Ai(b,sAd,11,_.GF))==null?void 0:da.getTitle())!=null?ta:""})}else if(_.Vi(b,26))e.next({responseType:"HISTORY_VERSION_UPDATE",conversationId:G,\nvS:_.n(b,26)});else{a.Da.mark(1,r);var ya,Da;aa=((Da=(ya=_.m(b,rAd,10))==null?void 0:_.di(ya,_.lA,8))!=null?Da:[]).map(_.jA);var Wa,eb;(ya=(Wa=d.Cc)==null?void 0:(eb=Wa.bla)==null?void 0:eb.A2)&&(ya.type===0||ya.type===1||ya.type===2)&&ya.Paa&&aa.unshift(_.Xtd(ya.Paa,ya.type));var nb,Bb;Wa=((Bb=(nb=_.m(b,rAd,10))==null?void 0:_.di(nb,_.lA,1))!=null?Bb:[]).map(_.jA);nb=Wzd(b,a.Pc);Bb=_.LZc(_.di(b,_.eH,13));var Ib=_.oi(b,34)?Szd(b):void 0;eb=a.Da.time(1,r,()=>_.Oyd(b));var jc,Xb=(Ib==null?0:Ib.pGd)?\nIb.pGd:(jc=eb[0])==null?void 0:jc.id;jc=eb.find(ig=>ig.id===Xb);eb=(eb=eb.find(ig=>ig.id===(Ib==null?void 0:Ib.bnf)))?{itb:eb}:void 0;ya=_.NZc(_.m(b,_.d1c,30));Da=_.ZEc(_.m(b,_.f1c,41));var Jc,Zc;da={responseId:(Jc=jc==null?void 0:jc.id)!=null?Jc:"",AP:_.oi(b,15),Ve:{conversationId:G,turnId:C!=null?C:"",Vh:(Zc=jc==null?void 0:jc.id)!=null?Zc:""}};Jc=_.m(b,_.VH,7);ta=d.hf===26;Zc=_.Ai(b,Nyd,49,_.GF);T=a.Yb&&_.kZc(Zc);T=a.Yc||T?Zc:void 0;var ud;(Zc=!!(Zc==null?0:(ud=_.m(Zc,_.eH,3))==null?0:_.ie(ud,\noHd)))||(Zc=_.di(b,_.eH,13).some(ig=>!!_.ie(ig,oHd)));a.n1&&fAd(b,g)&&a.Fb.pipe(_.Vt(1),_.uA(a.Ia)).subscribe({next:ig=>{ig.refresh()},error:()=>{}});var Gd,Lc,Hc;ud=_.JZc(_.di(b,_.eH,13),ta,(Hc=b==null?void 0:(Gd=_.FF(b)[0])==null?void 0:(Lc=_.m(Gd,_.XZc,2))==null?void 0:Lc.getText())!=null?Hc:"",_.n(b,33),_.n(b,35),_.n(b,36),T);f=dAd(ud,f);var bd,Fe;var Ge=(Gd=(Ge=_.FF(b)[0])==null?void 0:(bd=_.mG(Ge))==null?void 0:(Fe=_.m(bd,iAd,149))==null?void 0:_.m(Fe,hAd,1))?{M8f:{url:Gd.getUrl(),threatType:_.ui(Gd,\n2),dJf:_.oi(Gd,3)}}:void 0;bd=_.m(b,_.iL,53);var We,hf,Of;Ge=Object.assign({},{turnId:C,draft:jc},Ge?{jof:Ge}:{},{yIa:bd?_.$rd(bd):void 0,lI:_.Myd(b),Mx:Jc?_.ZYc(Jc,da):void 0,No:XLd(b),isFinal:_.oi(b,15),JL:(hf=(We=_.m(b,_.VH,7))==null?void 0:_.oi(We,4))!=null?hf:!1,K9:_.LYc(_.di(b,_.VH,12)),regionCode:_.n(b,9)},nb?{Zr:nb}:{},Bb?{Ile:Bb}:{},{Hrg:_.oi(b,16),bV:b.ha(),W7:_.oi(b,24),taa:[],Hof:Rzd(_.m(b,wAd,25)),vS:_.n(b,26),Fnf:_.oi(b,32)},ya?{iV:ya}:{},Da?{nPc:Da}:{},{Xc:{Hu:f,Q7:eb},Vla:_.n(b,40),\nPN:_.n(b,43),iDb:_.oi(b,58),Ozc:Kyd(_.ui(b,48)),GAa:Lyd(_.ui(b,64)),O0a:bAd(b,u),thinkingLevel:cAd(b,u),Uo:_.n(b,61)||void 0,Lj:_.n(b,62)||void 0,z7b:_.oi(b,50)},Zc?{zbg:Zc}:{},{a8a:(Of=_.Gk(b,56))!=null?Of:[]});var kf;c=(kf=_.m(c,_.c1c,24))==null?void 0:kf.sD();var vf,pg;if(kf=(pg=(vf=_.I0c(_.m(b,_.N0c,57)))!=null?vf:g.fAd)!=null?pg:d.YL)g.fAd=kf;g=Object.assign({},d,{conversationId:G,R2:d.conversationId,Ie:aa,rZb:Wa},kf?{YL:kf}:{});var Gg;vf=(N=_.FF(b)[0])==null?void 0:(Gg=_.mG(N))==null?void 0:\n_.m(Gg,_.i1c,96);N=(vf==null?void 0:vf.getId())||void 0;Gg=(vf==null?void 0:_.n(vf,3))||void 0;pg=(vf==null?void 0:vf.getTitle())||void 0;kf=(vf==null?void 0:_.n(vf,4))||void 0;vf=(vf==null?void 0:_.oi(vf,5))||void 0;N=Object.assign({},{responseType:"TURN",request:g,response:Ge,xj:!1,Ita:N,ajb:Gg,iga:pg,LJb:kf,MJb:vf},c?{mia:{taskIdentifiers:{taskId:c},yPf:!0}}:{});a.Da.mark(2,r);a.Da.KEb(2,1,2,r);DId(a.ka,r,N);e.next(N)}else a.Aa||e.error("Service response is invalid.")}else e.error("Response received without ID.")}}}',
    {
      Jyd: hyd,
      HId() {},
      WLd() {},
      tAd: class {},
      vAd: class {},
      GAd() {},
      aAd() {},
      IAd() {},
    },
  );
  const projectionCleanup: string[] = [];
  const projectionTimers = new Set<number>();
  let projectionTimerStarts = 0;
  const lifecycleRemovals: unknown[] = [];
  const mLd = create(
    'function(a,b,c,d,e,f,g,k,r){var u=!1,w=!1,B=!1,C,G,N=(G=d.clientTurnId)!=null?G:"",T=()=>{C!==void 0&&(clearTimeout(C),C=void 0)},aa="",da=()=>{_.iM(b);e.complete()},ta={next:Da=>{Da.responseType==="ROUTING"&&(aa=Da.turnId,a.Ga.set(aa,da));e.next(Da)},error:Da=>{e.error(Da)},complete:()=>e.complete()};var ya=b.Va.pipe(_.uA(a.Ia)).subscribe({next:Da=>{u||(u=!0,BId(a.ka,d.clientTurnId));_.Vi(Da,26)&&(B=!0);var Wa=_.ui(Da,63)===2;_.oi(Da,15)&&!Wa&&(w=!0,CId(a.ka,d.clientTurnId),B||C!==void 0||(C=\nwindow.setTimeout(()=>{_.iM(b)},3E4)));YLd(a,Da,c,d,ta,f,g,k);LLd(a.ha,N,Da);if(_.ge(Da,52)||w&&B)C!==void 0&&(clearTimeout(C),C=void 0),_.iM(b)},error:Da=>{T();!u&&r?r():(oM(a.ha,N,ya),e.error(Da))},complete:()=>{T();!u&&r?r():(oM(a.ha,N,ya),CId(a.ka,d.clientTurnId),e.complete())}});ya.add(()=>{T();a.Ga.get(aa)===da&&a.Ga.delete(aa)});return ya}',
    {
      oM(_registry: unknown, _id: unknown, subscription: unknown) {
        lifecycleRemovals.push(subscription);
      },
      BId() {},
      CId() {},
      YLd(_api: unknown, value: any, _ok: unknown, request: any, destination: any) {
        traceReceive('RJd:before', value);
        const control = _.ui(value, 63);
        if ([2, 3, 4].includes(control)) rLdOriginal(_api, value, _ok, request, destination);
        else if (projectResponse) projectResponse(value, request, destination);
        else {
          const ids = _.DL(value);
          destination.next({
            responseType: _.oi(value, 15) ? 'TURN_COMPLETED' : 'TURN',
            conversationId: ids.ig(),
            turnId: _.n(ids, 2),
          });
        }
        traceReceive('RJd:after', value);
      },
      LLd(_registry: unknown, _rid: unknown, value: unknown) {
        traceReceive('DJd', value);
      },
      clearTimeout: (id: number) => {
        projectionCleanup.push(api.Ga.size ? 'timer-before-route' : 'timer');
        projectionTimers.delete(id);
        _.fa.clearTimeout(id);
      },
      window: {
        setTimeout(callback: () => void) {
          const id = _.fa.setTimeout(callback);
          projectionTimerStarts++;
          projectionTimers.add(id);
          return id;
        },
      },
    },
  );
  const hJd = create(
    'function(a,b){a.wa++;var c=_.jJd(new _.dM,a.wa);b=_.Th((new _.hJd).setText(b));c=_.ei(c,9,_.cM,b);c=_.Bf(c);c=_.Th((new _.tJd).Bg(c));if(a.ha)a.connection.send(c);else{let d,e;(e=(d=a.connection).bfc)==null||e.call(d,c);a.oa.push(c)}}',
  );
  const nLd = create(
    'function(a,b,c,d,e,f,g){var k,r,u=_.fKd(a.Ab,{wi:c.wi,isTemporaryChat:(k=c.Cc)==null?void 0:(r=k.jba)==null?void 0:r.isTemporaryChat,clientTurnId:c.clientTurnId,requestSource:a.requestSource,CZa:c.ZKa}),w=_.dKd(a.ub,a.Ia,{zS:u}),B,C=(B=c.clientTurnId)!=null?B:"",G=TLd(a,w,b,c,d,e,f,g),N;KLd(a.ha,C,(N=c.conversationId)!=null?N:"",()=>{_.iM(w);d.complete()},G);zId(a.ka,c.clientTurnId);w.Na.pipe(_.Vt(1),_.uA(a.Ia)).subscribe(()=>{AId(a.ka,c.clientTurnId)});w.connect();var T,aa;_.LJd(w,b,a.requestSource,\n(T=c.wi)!=null?T:"",(aa=c.clientTurnId)!=null?aa:"");e=_.m(b,_.uyd,79);var da,ta;f=(ta=(da=_.vL(b))==null?void 0:da.getText())!=null?ta:_.ge(b,34)?"":void 0;e!==void 0?NJd(w,e):f!==void 0&&MJd(w,f);return()=>{G.unsubscribe();_.iM(w);oM(a.ha,C,G)}}',
    {
      TLd: (...args: any[]) => {
        owned = args[1];
        afterFactory();
        responseSubscription = lifecycle ? mLd(...args) : new _.qt();
        return responseSubscription;
      },
      KLd() {},
      zId() {
        beforeConfig();
      },
      AId() {},
      NJd() {
        throw Error('synthetic-action-refused');
      },
      MJd: (...args: any[]) => {
        afterConfig();
        hJd(...args);
        afterQuery();
      },
      oM() {},
    },
  );
  // The original source path below is used by every lifecycle/recovery case.
  // Earlier physical-only fixtures keep their deliberately narrow receiver leaf.
  const physicalOnly = (_api: any, captured: any, request: any, _observer: any) => {
    _.fKd(api.Ab, {
      wi: request.wi,
      clientTurnId: request.clientTurnId,
      requestSource: api.requestSource,
    });
    owned = _.dKd(session, api.Ia, { zS: metadata });
    afterFactory();
    owned.connect();
    beforeConfig();
    _.LJd(owned, captured, api.requestSource, approved.modeId, approved.clientTurnId);
    afterConfig();
    const action = _.m(captured, _.uyd, 79),
      text = _.vL(captured)?.getText() ?? (_.ge(captured, 34) ? '' : undefined);
    if (action !== undefined) throw Error('synthetic-action-refused');
    if (text !== undefined) hJd(owned, text);
    afterQuery();
    return () => owned.disconnect();
  };
  _.pM.prototype.Zxb = create(
    'class{Zxb(a){if(!Vzd(a.request))throw Error("zk");var b=_.PLd(this,a);a.request.ZKa||this.Wa.Ga.set(!1);var c=a.request,d=c.clientTurnId,e,f=(e=c.conversationId)!=null?e:"";e=c.YL;var g=c.hf===41&&(!e||e.deviceId===_.yAd(this.mb));yId(this.ka,d,this.Aa);return new _.st(k=>\n{var r={CAc:void 0,BAc:void 0,AAc:void 0},u={fAd:void 0,afe:new Set};HAd(this.zl);var w=new OLd(this.mb,f,g);NLd(w);var B=!1,C=JKd(this.Wd,b,a,{next:G=>{if(!B){if(w.enabled&&!w.ka&&!w.ha){var N=_.wtd(G)?G.request.conversationId:G.responseType==="ROUTING"||G.responseType==="TURN_COMPLETED"||G.responseType==="CONTINUATION_UPDATE"?G.conversationId:void 0;N&&(w.ha=N,NLd(w))}k.next(G)}},error:G=>{B||(B=!0,this.ka.handleError(G instanceof Error?G:Error(String(G)),d),w.onComplete(),k.error(G))},complete:()=>\n{B||(B=!0,LId(this.ka,d),w.onComplete(),k.complete())}},(G,N,T,aa)=>{if(this.Aa)a:{var da=this.Eb.get();if((da==null?0:da.isEnabled())&&N.aib!=="RECONNECT_TO_EXISTING_TURN"){let Lc=da.wnf();if(Lc){var ta=!N.ZKa&&_.JJd(Lc.connection);if(ta){{let Hc=Rwd(Lc.tec),bd=Rwd(G);if(_.gk(Hc,bd))var ya=[];else{ya=[];xL(_.XL(Hc),_.XL(bd))||ya.push("IDENTIFIERS");xL(_.m(Hc,_.yL,72),_.m(bd,_.yL,72))||ya.push("CONTINUATION_IDENTIFIERS");_.ui(Hc,19)!==_.ui(bd,19)&&ya.push("REQUESTED_BARD_MODE");_.n(Hc,39)!==_.n(bd,\n39)&&ya.push("REQUESTED_MODE_ID");_.ui(Hc,80)===_.ui(bd,80)&&_.ui(Hc,76)===_.ui(bd,76)&&_.n(Hc,65)===_.n(bd,65)&&_.n(Hc,74)===_.n(bd,74)||ya.push("REQUESTED_MODE_CATEGORY");_.ui(Hc,81)!==_.ui(bd,81)&&ya.push("REQUESTED_THINKING_LEVEL");_.ui(Hc,50)!==_.ui(bd,50)&&ya.push("USER_SELECTED_FEATURE_MODE");_.oi(Hc,92)!==_.oi(bd,92)&&ya.push("SMART_MODEL_SELECTION");_.oi(Hc,97)!==_.oi(bd,97)&&ya.push("MANUAL_PICKER_OVERRIDE");_.oi(Hc,66)!==_.oi(bd,66)&&ya.push("SKIP_THINKING");xL(_.m(Hc,_.wxd,42),_.m(bd,\n_.wxd,42))||ya.push("MEMORY_OPTIONS");Hc.JIa()!==bd.JIa()&&ya.push("PERSONAL_CONTEXT_DISABLED");_.oi(Hc,46)!==_.oi(bd,46)&&ya.push("TEMPORARY_CHAT");var Da=_.vL(Hc),Wa=_.vL(bd),eb,nb;((eb=Da==null?void 0:_.XEd(Da))!=null?eb:!1)!==((nb=Wa==null?void 0:_.XEd(Wa))!=null?nb:!1)&&ya.push("VOICE_ENTRY");var Bb,Ib;((Bb=Da==null?void 0:_.oi(Da,7))!=null?Bb:!1)!==((Ib=Wa==null?void 0:_.oi(Wa,7))!=null?Ib:!1)&&ya.push("ZERO_STATE_PROMPT");xL(_.m(Hc,_.Sv,34),_.m(bd,_.Sv,34))||ya.push("SYSTEM_QUERY");var jc,\nXb;Swd((jc=Da==null?void 0:_.di(Da,_.ZK,4))!=null?jc:[],(Xb=Wa==null?void 0:_.di(Wa,_.ZK,4))!=null?Xb:[])||ya.push("FILE_ATTACHMENTS");xL(Da==null?void 0:_.m(Da,_.tL,10),Wa==null?void 0:_.m(Wa,_.tL,10))||ya.push("ATTACHED_CONTEXT");(Da==null?void 0:_.ui(Da,11))!==(Wa==null?void 0:_.ui(Wa,11))&&ya.push("CONTEXTUAL_ACTION");Swd(_.di(Hc,_.az,10),_.di(bd,_.az,10))||ya.push("TOOL_MENTIONS");Twd(_.vi(Hc,82),_.vi(bd,82))||ya.push("SELECTED_SKILL_IDS");Twd(_.vi(Hc,96),_.vi(bd,96))||ya.push("SELECTED_FIRST_PARTY_SKILL_IDS");\nTwd(_.vi(Hc,107),_.vi(bd,107))||ya.push("SELECTED_PLUGIN_IDS");_.n(Hc,70)!==_.n(bd,70)&&ya.push("SKILL_ID");_.oi(Hc,99)!==_.oi(bd,99)&&ya.push("CHROME_SKILLS_ENABLED");_.oi(Hc,12)===_.oi(bd,12)&&_.oi(Hc,54)===_.oi(bd,54)||ya.push("DISABLE_TOOLS_OR_QUIZ");Swd(_.di(Hc,_.PG,9),_.di(bd,_.PG,9))||ya.push("REQUEST_SCOPED_CONSENTS");xL(_.m(Hc,Ytd,55),_.m(bd,Ytd,55))&&xL(_.m(Hc,dud,56),_.m(bd,dud,56))||ya.push("INPUT_COMPANION");_.n(Hc,20)===_.n(bd,20)&&_.oi(Hc,37)===_.oi(bd,37)&&xL(_.m(Hc,_.hK,25),_.m(bd,\n_.hK,25))&&Twd(_.vi(Hc,40),_.vi(bd,40))&&xL(_.m(Hc,fud,41),_.m(bd,fud,41))||ya.push("BOT_CONFIG_OR_METADATA");_.n(Hc,105)!==_.n(bd,105)&&ya.push("PROJECT_ID");var Jc;Da=(Jc=_.m(Hc,_.EI,62))==null?void 0:Jc.clone();var Zc;Jc=(Zc=_.m(bd,_.EI,62))==null?void 0:Zc.clone();var ud,Gd;((ud=Da==null?void 0:_.qi(Da,9))!=null?ud:0)!==((Gd=Jc==null?void 0:_.qi(Jc,9))!=null?Gd:0)&&ya.push("CAPTURED_REGIONS");Da!=null&&_.Wh(Da,9);Jc!=null&&_.Wh(Jc,9);!Da&&!Jc||xL(Da!=null?Da:new _.EI,Jc!=null?Jc:new _.EI)||ya.push("GEMINI_IN_CHROME_METADATA");\nxL(_.m(Hc,_.eA,16),_.m(bd,_.eA,16))||ya.push("DEVICE_CONTEXT");xL(_.m(Hc,nyd,23),_.m(bd,nyd,23))||ya.push("REQUEST_LOGGING_METADATA");xL(_.m(Hc,rud,43),_.m(bd,rud,43))&&xL(_.m(Hc,Jud,71),_.m(bd,Jud,71))||ya.push("IMMERSIVE_OR_ARTIFACTS_CONTEXT");xL(_.m(Hc,Yud,63),_.m(bd,Yud,63))||ya.push("GOAL_INPUT");xL(_.m(Hc,_.S0c,102),_.m(bd,_.S0c,102))||ya.push("HIGHLIGHT_TO_ASK_CONTEXT");xL(_.m(Hc,Cyd,90),_.m(bd,Cyd,90))||ya.push("REMY_METADATA");xL(_.m(Hc,Ayd,98),_.m(bd,Ayd,98))||ya.push("DEEP_RESEARCH_METADATA");\nxL(_.m(Hc,Pxd,86),_.m(bd,Pxd,86))||ya.push("AGENTIC_SIGNIN_METADATA");xL(_.m(Hc,OFd,58),_.m(bd,OFd,58))||ya.push("COMPUTER_USE_METADATA");xL(_.m(Hc,eyd,87),_.m(bd,eyd,87))||ya.push("REMOTE_DEVICE_TARGET");Hc.oea()===bd.oea()&&xL(_.m(Hc,_.iLb,94),_.m(bd,_.iLb,94))&&_.n(Hc,103)===_.n(bd,103)&&_.n(Hc,108)===_.n(bd,108)&&xL(_.m(Hc,axd,57),_.m(bd,axd,57))||ya.push("PROMPT_SOURCE_OR_ID");xL(_.m(Hc,zxd,85),_.m(bd,zxd,85))||ya.push("FOLLOW_UP_METADATA");_.ui(Hc,73)===_.ui(bd,73)&&xL(_.m(Hc,_.b2c,64),_.m(bd,\n_.b2c,64))&&_.ui(Hc,100)===_.ui(bd,100)&&_.qi(Hc,104)===_.qi(bd,104)||ya.push("REGENERATE");xL(_.m(Hc,$xd,18),_.m(bd,$xd,18))||ya.push("TURN_INDEX");xL(_.m(Hc,_.lG,2),_.m(bd,_.lG,2))&&xL(_.m(Hc,_.RI,7),_.m(bd,_.RI,7))&&_.ui(Hc,69)===_.ui(bd,69)||ya.push("THEME_OR_LOCALE");Twd(_.Gk(Hc,31),_.Gk(bd,31))||ya.push("CLIENT_CAPABILITIES");ya.length===0&&ya.push("OTHER")}}}else ya=["CONNECTION_UNUSABLE"];if(ta&&ya.length===0){_.AAd(this.Jc,"CONSUMED",Lc.wi);zAd(this.Jc,this.Na.now()-Lc.UM,Lc.wi,!0);da.aDc();\nG=VLd(this,Lc.connection,G,N,T,r,u,aa);break a}_.iM(Lc.connection);_.AAd(this.Jc,"MISMATCH",Lc.wi);for(let Hc of ya)ta=this.Jc,ta.Kd.increment(Hc,Lc.wi||"undefined",ta.requestSource);zAd(this.Jc,this.Na.now()-Lc.UM,Lc.wi,!1);da.aDc()}else da=da.aDc(),da!==void 0&&zAd(this.Jc,this.Na.now()-da,N.wi,!1)}G=ULd(this,G,N,T,r,u,aa)}else G=SLd(this,G,N,T,r,u,aa);return G});return()=>{w.onComplete();C();IAd(this.zl)}})}}',
    {
      Vzd: () => {
        beforeProtectedRequest();
        return true;
      },
      yId() {},
      HAd() {
        beforeOriginalProducer();
      },
      IAd() {
        beforeOriginalTeardown();
      },
      LId() {},
      NLd() {},
      OLd: class {
        enabled = false;
        onComplete() {}
      },
      JKd: cKd,
      ULd: lifecycle ? nLd : physicalOnly,
      SLd() {
        throw Error('synthetic-rpc-refused');
      },
    },
  ).prototype.Zxb;
  api.Wa.Ga.set = () => {};
  // Native-looking proxies are explicit test-only platform substitutes, never real XHR evidence.
  class SyntheticXHR {
    readyState = 0;
    responseText = '[[0,["c","synthetic-session",""]]]';
    response = this.responseText;
    status = 200;
    onreadystatechange: (() => void) | null = null;
    open(_method: unknown, _url: unknown, async: boolean) {
      if (async !== true) throw new Error('synthetic-sync-refusal');
      this.readyState = 1;
      // Synthetic native event dispatch reports listener failures without throwing them from open().
      if (synchronousOpenEvent) {
        try {
          this.onreadystatechange?.();
        } catch {}
      }
    }
    send(...args: unknown[]) {
      nativeTransmissions.push({ receiver: this, args });
      calls.nativeSends++;
      this.readyState = 3;
    }
    abort() {
      this.readyState = 0;
    }
    setRequestHeader() {}
    getResponseHeader(name: string) {
      return name === 'X-Client-Wire-Protocol' ? handshakeProtocol : null;
    }
    getAllResponseHeaders() {
      return '';
    }
  }
  for (const key of [
    'open',
    'send',
    'abort',
    'setRequestHeader',
    'getResponseHeader',
    'getAllResponseHeaders',
  ] as const)
    SyntheticXHR.prototype[key] = new Proxy(SyntheticXHR.prototype[key], {}) as any;
  // Exact reached _b AsyncContext leaves with wholly synthetic closure state.
  // These optional test profiles never read or export a provider context/WeakMap.
  const originalNativeSend = SyntheticXHR.prototype.send;
  const asyncContext = (options: {
    snapshot: 'native' | 'polyfill';
    send: 'native' | 'polyfill';
    active?: boolean;
  }) => {
    const initial = options.active ? {} : undefined;
    const state: unknown[] = [initial];
    const contexts = new WeakMap<object, unknown>();
    const wrap = create(
      'function(a){var b=rd;if(!b[0])return a;var c=b[0];return function(){var d=b[0];b[0]=c;try{return a.apply(this,arguments)}finally{b[0]=d}}}',
      { rd: state },
    );
    const Snapshot = create('function b(){this.ha=c[0]}', { c: state });
    Snapshot.wrap = options.snapshot === 'polyfill' ? wrap : new Proxy(wrap, {});
    Snapshot.prototype.run = create(
      'function(d){var e=c[0];c[0]=this.ha;try{return d.apply(null,Array.prototype.slice.call(arguments,1))}finally{c[0]=e}}',
      { c: state },
    );
    const context = { Snapshot };
    const sendFor = (original: Function) =>
      create('function(){c.set(this,rd[0]);return d.apply(this,arguments)}', {
        c: contexts,
        rd: state,
        d: original,
      });
    SyntheticXHR.prototype.send =
      options.send === 'polyfill' ? sendFor(originalNativeSend) : originalNativeSend;
    _.qe = create('a=>a&&AsyncContext.Snapshot.wrap(a)', { AsyncContext: context });
    return {
      context,
      run: <T>(value: unknown, call: () => T): T =>
        Object.assign(new Snapshot(), { ha: value }).run(call),
      isCurrent: (value: unknown) => state[0] === value,
      isInitial: () => state[0] === initial,
      recordedInitial: (receiver: object) =>
        contexts.has(receiver) && contexts.get(receiver) === initial,
      recorded: (receiver: object, value: unknown) => contexts.get(receiver) === value,
      sendFor,
    };
  };
  _.fa.XMLHttpRequest = new Proxy(SyntheticXHR, {});
  _.cja = create('function(){}');
  _.cja.prototype.Z8 = create('function(){return new XMLHttpRequest}', {
    XMLHttpRequest: _.fa.XMLHttpRequest,
  });
  _.bja = new _.cja();
  _.qe = create('a=>a');
  _.xta = ['POST', 'PUT'];
  _.xa = (a: any[], b: unknown) => a.includes(b);
  _.Xj = create(
    'function(a){_.Yb.call(this);this.headers=new Map;this.lPb=a||null;this.nE=!1;this.vk=null;this.FAa="";this.D6=0;this.DG="";this.MWa=this.TOc=this.t6b=this.nIc=!1;this.Vlb=0;this.Fua=null;this.uI="";this.R3f=this.dD=!1;this.mzc=this.Rbd=null}',
  );
  Object.setPrototypeOf(_.Xj.prototype, _.Yb.prototype);
  _.Xj.prototype.send = create(
    'function(a,b,c,d){if(this.vk)throw Error("Xb`"+this.FAa+"`"+a);if(typeof b==="string")var e=b;else if(b){var f=b;e=f.method;c!=null||(c=f.body);d!=null||(d=f.headers)}e=e?e.toUpperCase():"GET";this.FAa=a;this.DG="";this.D6=0;this.nIc=!1;this.nE=!0;this.vk=this.Xtb(f);this.vk.onreadystatechange=(0,_.qe)((0,_.$b)(this.J7d,this));this.R3f&&"onprogress"in this.vk&&(this.vk.onprogress=(0,_.qe)((0,_.$b)(function(k){this.I7d(k,!0)},this)),this.vk.upload&&(this.vk.upload.onprogress=(0,_.qe)((0,_.$b)(this.I7d,\nthis))));try{this.TOc=!0,this.vk.open(e,String(a),!0),this.TOc=!1}catch(k){this.Aq(5,k);return}a=c||"";b=new Map(this.headers);if(d)if(Object.getPrototypeOf(d)===Object.prototype)for(var g in d)b.set(g,d[g]);else if(typeof d.keys==="function"&&typeof d.get==="function")for(let k of d.keys())b.set(k,d.get(k));else throw Error("Yb`"+String(d));d=Array.from(b.keys()).find(k=>"content-type"==k.toLowerCase());g=_.fa.FormData&&a instanceof _.fa.FormData;!_.xa(_.xta,e)||d||g||b.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");\nfor(let [k,r]of b)this.vk.setRequestHeader(k,r);this.uI&&(this.vk.responseType=this.uI);"withCredentials"in this.vk&&this.vk.withCredentials!==this.dD&&(this.vk.withCredentials=this.dD);if("setTrustToken"in this.vk&&this.Rbd)try{this.vk.setTrustToken(this.Rbd)}catch(k){}if("setAttributionReporting"in this.vk&&this.mzc)try{this.vk.setAttributionReporting(this.mzc)}catch(k){}try{this.Fua&&(clearTimeout(this.Fua),this.Fua=null),this.Vlb>0&&(this.Fua=setTimeout(this.lH.bind(this),this.Vlb)),this.t6b=\n!0,this.vk.send(a),this.t6b=!1}catch(k){this.Aq(5,k)}}',
    {},
  );
  _.Xj.prototype.Xtb = create('function(a){return this.lPb?this.lPb.Z8(a):_.bja.Z8()}', {});
  _.Sea = true;
  const Ata = create(
    'function(a,b){if(a.vk){a.Fua&&(clearTimeout(a.Fua),a.Fua=null);let c=a.vk;a.vk=null;b||a.dispatchEvent("ready");try{c.onreadystatechange=null}catch(d){}}}',
  );
  const zta = create(
    'function(a){a.nIc||(a.nIc=!0,a.dispatchEvent("complete"),a.dispatchEvent("error"))}',
  );
  const Bta = create(
    'function(a){if(a.nE&&typeof _.Sea!="undefined")if(a.t6b&&a.pea()==4)setTimeout(a.J7d.bind(a),0);else if(a.dispatchEvent("readystatechange"),a.Xu()){a.nE=!1;try{if(a.pq())a.dispatchEvent("complete"),a.dispatchEvent("success");else{a.D6=6;try{var b=a.pea()>2?a.vk.statusText:""}catch(c){b=""}a.DG=b+" ["+a.getStatus()+"]";Ata(a)}}finally{Bta(a)}}}',
    { Ata: zta, Bta: Ata },
  );
  _.Xj.prototype.J7d = create(
    'function(){this.isDisposed()||(this.TOc||this.t6b||this.MWa?Cta(this):this.l_c())}',
    { Cta: Bta },
  );
  _.Xj.prototype.yI = create('function(a){this.dD=a}', {});
  _.Xj.prototype.abort = create(
    'function(a){this.vk&&this.nE&&(this.nE=!1,this.MWa=!0,this.vk.abort(),this.MWa=!1,this.D6=a||7,this.dispatchEvent("complete"),this.dispatchEvent("abort"),Bta(this))}',
    {
      Bta: Ata,
    },
  );
  _.Xj.prototype.l_c = create('function(){Cta(this)}', {
    Cta: Bta,
  });
  _.Xj.prototype.pea = create('function(){return this.vk?this.vk.readyState:0}');
  _.Xj.prototype.E1 = create('function(){return this.D6}');
  _.Xj.prototype.Ln = create(
    'function(){try{return this.vk?this.vk.responseText:""}catch(a){return""}}',
  );
  _.Xj.prototype.getStatus = create(
    'function(){try{return this.pea()>2?this.vk.status:-1}catch(a){return-1}}',
  );
  _.Xj.prototype.Xu = create('function(){return this.pea()==4}');
  _.Xj.prototype.getResponseHeader = create(
    'function(a){if(this.vk&&this.Xu())return a=this.vk.getResponseHeader(a),a===null?void 0:a}',
  );
  _.Xj.prototype.getResponse = create(
    'function(){try{if(!this.vk)return null;if("response"in this.vk)return this.vk.response;switch(this.uI){case "":case "text":return this.vk.responseText;case "arraybuffer":if("mozResponseArrayBuffer"in this.vk)return this.vk.mozResponseArrayBuffer}return null}catch(a){return null}}',
  );
  _.Xj.oe = _.Yb.prototype;
  _.Yb.oe = _.Eb.prototype;
  _.Eb.prototype.dispose = create('function(){this.n5||(this.n5=!0,this.Hc())}');
  _.Eb.prototype.Hc = create('function(){if(this.b_a)for(;this.b_a.length;)this.b_a.shift()()}');
  _.Yb.prototype.Hc = create(
    'function(){_.Yb.oe.Hc.call(this);this.removeAllListeners();this.R0c=null}',
  );
  _.Yb.prototype.removeAllListeners = create(
    'function(a){return this.Mpa?this.Mpa.removeAll(a):0}',
  );
  _.Rb.prototype.removeAll = create(
    'function(a){a=a&&a.toString();var b=0;for(let c in this.listeners)if(!a||c==a){let d=this.listeners[c];for(let e=0;e<d.length;e++)++b,Bga(d[e]);delete this.listeners[c];this.ha--}return b}',
    {
      Bga: (record: any) => {
        record.removed = true;
        record.listener = record.proxy = record.src = record.handler = null;
      },
    },
  );
  _.Lb = (value: any, map: (v: any) => any) =>
    Object.fromEntries(Object.entries(value).map(([k, v]) => [k, map(v)]));
  _.Jha = (value: string, delimiter: string) => {
    const i = value.indexOf(delimiter);
    return i < 0 ? [value] : [value.slice(0, i), value.slice(i + 1)];
  };
  _.Xj.prototype.Hc = create(
    'function(){this.vk&&(this.nE&&(this.nE=!1,this.MWa=!0,this.vk.abort(),this.MWa=!1),Bta(this,!0));_.Xj.oe.Hc.call(this)}',
    {
      Bta: Ata,
      zta: zta,
    },
  );
  _.Xj.prototype.Aq = create(
    'function(a,b){this.nE=!1;this.vk&&(this.MWa=!0,this.vk.abort(),this.MWa=!1);this.DG=b;this.D6=a;Ata(this);Bta(this)}',
    {
      Bta: Ata,
      Ata: zta,
    },
  );
  _.Xj.prototype.getAllResponseHeaders = create(
    'function(){return this.vk&&this.pea()>=2?this.vk.getAllResponseHeaders()||"":""}',
    {
      Ata: Ata,
      zta: zta,
    },
  );
  _.Xj.prototype.rG = create(
    'function(){var a={},b=this.getAllResponseHeaders().split("\\r\\n");for(let d=0;d<b.length;d++){if(_.ja(b[d]))continue;var c=_.Jha(b[d],":",1);let e=c[0];c=c[1];if(typeof c!=="string")continue;c=c.trim();let f=a[e]||[];a[e]=f;f.push(c)}return _.Lb(a,function(d){return d.join(", ")})}',
    {
      Ata: Ata,
      zta: zta,
    },
  );

  _.Eb.prototype.n5 = false;
  _.Eb.prototype.isDisposed = create('function(){return this.n5}');
  Object.setPrototypeOf(_.Yb.prototype, _.Eb.prototype);
  const identity = Function(
    'var Tea="closure_uid_17",Uea=0;return {Qd:function(a){return Object.prototype.hasOwnProperty.call(a,Tea)&&a[Tea]||(a[Tea]=++Uea)},count:()=>Uea}',
  )();
  _.Fd = identity.Qd;
  _.uga = [];
  _.vga = [];
  _.wga = false;
  _.Cr = { ka: null };
  _.xga = Function(
    '_',
    'return function(a){_.uga[_.uga.length]=a;if(_.wga)for(let b=0;b<_.vga.length;b++)a((0,_.$b)(_.vga[b].wrap,_.vga[b]))}',
  )(_);
  const Monitor = Function(
    '_',
    'return function(a){_.Eb.call(this);this.oa=a;this.ka=!0;this.ha=!1}',
  )(_);
  Monitor.prototype = Object.create(_.Eb.prototype);
  Monitor.prototype.constructor = Monitor;
  const monitorFactory = Function(
    '_',
    'S1o',
    'var hGo=function(a,b){return(b?"__wrapper_":"__protected_")+_.Fd(a)+"__"},gGo=function(a,b){var c=hGo(a,!0);b[c]||((b[c]=iGo(a,b))[hGo(a,!1)]=b);return b[c]},iGo=function(a,b){var c=function(){if(a.isDisposed())return b.apply(this,arguments);try{return b.apply(this,arguments)}catch(d){S1o(a,d)}};c[hGo(a,!1)]=b;return c};return {gGo,hGo}',
  )(_, (_monitor: unknown, error: unknown) => {
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
  )(_);
  _.xga(Function('_', 'return function(a){_.Xj.prototype.l_c=a(_.Xj.prototype.l_c)}')(_));
  const monitor = new Monitor(() => {});
  monitor.ka = monitor.ha = true;
  installMonitor(monitor);
  _.Cr.ka = monitor;

  nativeInt64();
  const originalXub = (observer: object = {}) => {
    const observable = api.Zxb(packet);
    bindObservable(observable);
    subscribed = true;
    try {
      outer = observable.subscribe(observer);
      return outer;
    } finally {
      subscribed = false;
    }
  };
  return {
    sourceConstruction: contract.sourceConstruction,
    namespace: _,
    nativeInt64,
    outbound: () => {
      const receiver: any = { ha: false, connection: {}, oa: [], wa: 0 };
      _.LJd(receiver, ok, api.requestSource, approved.modeId, approved.clientTurnId);
      hJd(receiver, packet.request.textQuery);
      return { configuration: receiver.oa[0], query: receiver.oa[1], seed: receiver.Aa };
    },
    nativeKf: (input: { cid?: string; rid?: string; final?: boolean }) => {
      const fields: Record<number, unknown> = {
        5: [
          new _.zF(
            wire({
              1: 'rc_49',
              2: new _.XZc(['CROSSCHECK_GEMINI_OK']),
              9: [2],
            }),
          ),
        ],
        15: input.final ?? false,
      };
      if (input.cid !== undefined || input.rid !== undefined)
        fields[2] = new _.CI(wire({ 1: input.cid, 2: input.rid }));
      return _.Th(new _.HF(wire(fields)));
    },
    nativeEnvelope: contract.nativeEnvelope,
    nativeClose: (field: 4 | 5) => _.Th(new _.xzd(wire({ [field]: [] }))),
    receive: (envelope: unknown, viaNative = false) => {
      incoming = envelope;
      try {
        const request = owned.connection.uq.ha.ka;
        request.ha.vk.responseText = JSON.stringify([
          [owned.connection.uq.ha.Ha + 1, ['synthetic-response']],
        ]);
        if (viaNative) request.ha.vk.onreadystatechange();
        else request.Vc({ target: request.ha });
      } finally {
        incoming = undefined;
      }
    },
    decoded: () => decoded,
    onDecode: (hook: typeof decodeHook) => {
      decodeHook = hook;
    },
    receiveTrace,
    project: (projection: NonNullable<typeof projectResponse>) => {
      projectResponse = projection;
    },
    onReceive: (hook: typeof receiveHook) => {
      receiveHook = hook;
    },
    api,
    approved,
    packet,
    ok,
    calls,
    consumer,
    metadata,
    shared: {
      state: () => sharedState,
      observer: () => sharedObserver,
      retry: () => sharedRetry,
      service: sharedService,
      timers: sharedTimers,
      pending: () => sharedTimers.filter((run) => [...timers.values()].includes(run)).length,
      network,
      failProbeUnsubscribe() {
        const original = sharedState.Da.unsubscribe;
        sharedState.Da.unsubscribe = function () {
          original.call(this);
          throw Error('synthetic-probe-unsubscribe');
        };
      },
    },
    registerIdle: (enabled = true) => {
      const manager = Object.assign(Object.create(_.qVd.prototype), {
        Na: session,
        Oa: consumer,
        ka: false,
        Za: enabled,
        kb: false,
      });
      registry.register(manager);
      return manager;
    },
    current: () => {
      beforeCurrent();
      return live;
    },
    consumingOriginal: () => {
      beforeScope();
      return subscribed;
    },
    observer: { next(_receipt: unknown) {}, control(_field: 4 | 5) {}, error() {} },
    originalXub,
    bindOriginal: (callback: (value: unknown) => void) => {
      bindObservable = callback;
    },
    outer: () => outer,
    responseSubscription: () => responseSubscription,
    runCloseFallback: () => timers.get(owned.Ha)!(),
    lifetime,
    deferredErrors,
    lifecycleRemovals,
    projectionCleanup,
    projectionTimers: () => projectionTimers.size,
    projectionTimerStarts: () => projectionTimerStarts,

    flushOpen: () => {
      while (pending.length) pending.shift()!();
      const handshake = requests.find((r) => r.Yc === '');
      if (handshake && handshake.Aa.fU === 2) handshake.Vc({ target: handshake.ha });
      while (pending.length) pending.shift()!();
    },
    requests: () => requests,
    images: () => images,
    protocolErrors: () => protocolErrors,
    nativeTransmissions: () => nativeTransmissions,
    asyncContext,
    enableImage: () => {
      _.fa.Image = SyntheticImage;
    },
    synchronousOpenEvents: () => {
      synchronousOpenEvent = true;
    },
    protocolUpgrade: () => {
      handshakeProtocol = 'h2';
      _.fa.performance.getEntriesByType = () => [];
    },
    forwardRequest: () => requests.findLast((r) => r.Za.length),
    watchdog: () => timers.get(requests.findLast((r) => r.Za.length).Va)!,
    recoverBackchannel: () => {
      const transport = owned.connection.uq.ha;
      const request = transport.ka;
      now += 60000;
      const timeout = timers.get(request.Va)!;
      timers.delete(request.Va);
      timeout();
      const retry = timers.get(transport.Ja)!;
      timers.delete(transport.Ja);
      retry();
    },
    protocolEnd: (kind: 'stop' | 'close' | 'synthetic-response') => {
      const request = owned.connection.uq.ha.ka;
      request.ha.vk.responseText = JSON.stringify([[1, [kind]]]);
      request.Vc({ target: request.ha });
    },
    failForward: (unknownSid = true) => {
      const request = requests.findLast((r) => r.Za.length);
      request.ha.vk.status = 400;
      request.ha.vk.responseText = unknownSid ? 'synthetic: Unknown SID' : 'Unknown SID';
      request.Vc({ target: request.ha });
    },
    serialized: () => serialized,
    outgoingMaps: () =>
      requests
        .findLast((r) => r.Za.length)
        ?.Za.map((entry: any) => ({ entry, mapId: entry.mapId, map: entry.map })) ?? [],
    prepareForwardRetry: () => {
      const request = requests.findLast((r) => r.Za.length);
      now += 60000;
      const timeout = timers.get(request.Va)!;
      timers.delete(request.Va);
      timeout();
    },
    retryForward: (alreadyScheduled = false) => {
      const request = requests.findLast((r) => r.Za.length);
      if (alreadyScheduled) {
        const handshake = requests[0];
        handshake.ha.vk.readyState = 4;
        handshake.Vc({ target: handshake.ha });
      }
      now += 60000;
      const timeout = timers.get(request.Va)!;
      timers.delete(request.Va);
      timeout();
      if (alreadyScheduled) {
        while (pending.length) pending.shift()!();
      } else {
        const retry = timers.get(request.Aa.Da)!;
        timers.delete(request.Aa.Da);
        retry();
      }
    },
    cancelOriginal: () => owned.disconnect(),
    queued: () => owned?.oa,
    graph: () => owned,
    produced: () => produced,
    prototypes: { IHd: IHd.prototype, connection: $Ed.prototype },
    pending: () => pending.length,
    setCurrent: (v: boolean) => {
      live = v;
    },
    hooks: (v: {
      request?: () => void;
      producer?: () => void;
      teardown?: () => void;
      current?: () => void;
      scope?: () => void;
      factory?: () => void;
      config?: () => void;
      afterFactory?: () => void;
      afterConfig?: () => void;
      afterQuery?: () => void;
    }) => {
      beforeProtectedRequest = v.request ?? (() => {});
      beforeOriginalProducer = v.producer ?? (() => {});
      beforeOriginalTeardown = v.teardown ?? (() => {});
      beforeCurrent = v.current ?? (() => {});
      beforeScope = v.scope ?? (() => {});
      beforeFactory = v.factory ?? (() => {});
      beforeConfig = v.config ?? (() => {});
      afterFactory = v.afterFactory ?? (() => {});
      afterConfig = v.afterConfig ?? (() => {});
      afterQuery = v.afterQuery ?? (() => {});
    },
  };
}
