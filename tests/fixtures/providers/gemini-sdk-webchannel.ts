import { geminiFixedTextContractFixture } from './gemini-fixed-text-contract';

// Saved public source literals with synthetic services and invented wire data; no provider cache is loaded.
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
  const completionFlags: boolean[] = [];
  const receiveTrace: Array<{ stage: string; value?: unknown }> = [];
  let receiveHook = (_stage: string, _value?: unknown) => {};
  let projectResponse: ((value: any, request: any, destination: any) => void) | undefined;
  const traceReceive = (stage: string, value?: unknown) => {
    receiveTrace.push({ stage, value });
    receiveHook(stage, value);
  };
  let decodeHook = () => {};
  let normalizeHook = (_identity: any) => {};
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
    if (Object.getPrototypeOf(a) === _.WL?.prototype && field === 1) calls.query++;
    a.fl[field - 1] = value;
    return a;
  };
  const copy = (value: any): any =>
    Array.isArray(value)
      ? value.map(copy)
      : value && typeof value === 'object' && value.fl
        ? new value.constructor(copy(value.fl))
        : value;
  _.Lba = create(
    'function(a,b,c,d=0){if(a==null){var e=32;c?(a=[c],e|=128):a=[];b&&(e=e&-16760833|(b&1023)<<14)}else{if(!Array.isArray(a))throw Error("F");e=a[_.La]|0;if(Jba&&1&e)throw Error("G");2048&e&&!(2&e)&&Kba();if(e&256)throw Error("H");if(e&64)return(e|d)!==e&&(a[_.La]=e|d),a;if(c&&(e|=128,c!==a[0]))throw Error("I");a:{c=a;e|=64;var f=c.length;if(f){var g=f-1;let r=c[g];if(r!=null&&typeof r==="object"&&r.constructor===Object){b=e&128?0:-1;g-=b;if(g>=1024)throw Error("K");for(var k in r)if(f=+k,f<g)c[f+\nb]=r[k],delete r[k];else break;e=e&-16760833|(g&1023)<<14;break a}}if(b){k=Math.max(b,f-(e&128?0:-1));if(k>1024)throw Error("L");e=e&-16760833|(k&1023)<<14}}}a[_.La]=e|64|d;return a}',
    { Jba: false, Kba: () => {} },
  );
  _.l = create(
    'class{constructor(a,b,c){this.fl=_.Lba(a,b,c,2048)}toJSON(){return _.Hba(this)}serialize(a){return JSON.stringify(_.Hba(this,a))}clone(){var a=this.fl,b=a[_.La]|0;return _.Rba(this,a,b)?_.Qba(this,a,!0):new this.constructor(_.tb(a,b,!1))}isImmutable(){return _.Ra(this)}}',
  );
  for (const name of [
    'wL',
    'vL',
    'Ywd',
    'Txd',
    'CI',
    'DI',
    'Kzd',
    'XJd',
    'RJd',
    'QJd',
    'JJd',
    'GJd',
    'DJd',
    '$Ad',
    'WL',
    'xJd',
    'jJd',
    'IF',
    'W4c',
    'AF',
    '$Zc',
    '$v',
    'DAd',
    'qH',
    'oH',
    'gH',
  ])
    _[name] = class extends _.l {};
  _.IF = create(
    'class extends _.l{constructor(a){super(a)}getHeartbeatResponse(){return _.xi(this,Xuc,37,_.HF)}ka(){return _.m(this,_.x_b,8)}}',
  );
  _.FF = create('class extends _.l{constructor(a){super(a)}}');
  _.CI = create('class extends _.l{constructor(a){super(a)}ig(){return _.n(this,1)}}');
  _.$Zc = create(
    'class extends _.l{constructor(a){super(a)}getText(){return _.n(this,1)}setText(a){return _.Li(this,1,a)}Dg(){return _.Si(this,1)}}',
  );
  _.$v = create(
    'class extends _.l{constructor(a){super(a)}getOptions(){return _.m(this,SLb,7)}setOptions(a){return _.Gh(this,SLb,7,a)}}',
  );
  _.W4c = create('class extends _.l{constructor(a){super(a)}}');
  _.DAd = create('class extends _.l{constructor(a){super(a)}}');
  _.qH = create(
    'class extends _.l{constructor(a){super(a)}Yq(a){return _.Gk(this,1,_.oH,a)}getMetadata(){return _.m(this,N4c,2)}lq(){return _.ge(this,2)}}',
  );
  _.oH = create(
    'class extends _.l{constructor(a){super(a)}getText(){return _.xi(this,_.gH,2,_.pH)}setText(a){return _.di(this,2,_.pH,a)}Dg(){return _.Zh(this,2,_.pH)}zo(){return _.Zh(this,3,_.pH)}clearVideo(){return _.Oh(this,71,_.pH)}Fg(){return _.xi(this,JGc,4,_.pH)}bF(){return _.Zh(this,4,_.pH)}EGa(){return _.Oh(this,73,_.pH)}D5b(){return _.Zh(this,73,_.pH)}}',
  );
  _.gH = create(
    'class extends _.l{constructor(a){super(a)}getText(){return _.n(this,3)}setText(a){return _.Li(this,3,a)}Dg(){return _.Si(this,3)}}',
  );
  _.vL = create('class extends _.l{constructor(a){super(a)}ig(){return _.n(this,1)}}');
  _.JJd = class extends _.l {
    constructor(a?: any[]) {
      super(a);
      produced = this;
    }
  };
  _.Oa = Symbol('synthetic-message-marker');
  _.Pa = {};
  _.l.prototype[_.Oa] = _.Pa;
  // Synthetic nb/Gba ownership leaves execute the exact reached public ob body.
  const jsonArray = (a: any[], project: (v: any) => any): any[] =>
    a.map((v) =>
      v && Object.getPrototypeOf(v) === Object.prototype
        ? Object.fromEntries(Object.entries(v).map(([k, entry]) => [k, project(entry)]))
        : project(v),
    );
  _.Dba = (v: bigint) =>
    v >= BigInt(Number.MIN_SAFE_INTEGER) && v <= BigInt(Number.MAX_SAFE_INTEGER);
  _.Qa = create('function(a){return a!=null&&a[_.Oa]===_.Pa}');
  _.mb ??= class {};
  _.pb = (a: any[], _flags: unknown, project: (v: any) => any) => jsonArray(a, project);
  _.qb = create(
    'function(a){switch(typeof a){case "number":return Number.isFinite(a)?a:""+a;case "bigint":return(0,_.Dba)(a)?Number(a):""+a;case "boolean":return a?1:0;case "object":if(Array.isArray(a)){let b=a[_.La]|0;return a.length===0&&b&1?void 0:_.pb(a,b,_.qb)}if(_.Qa(a))return Eba(a);if(a instanceof _.mb)return _.rb(a);if("function"==typeof _.sb&&a instanceof _.sb)return a.aqg();return}return a}',
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
    _.Ii = create('function(a,b,c){return _.Vh(a,b,_.ah(c))}');
  };

  _.Uj = JSON.stringify;
  // Codec leaves return the selected invented wire object; both original KRa closures execute.
  _.be = (value: unknown) => value;
  _.Lo = (_type: unknown, value: unknown) => {
    decodeHook();
    decoded = incoming ?? value;
    return decoded;
  };
  _.Ak = (value: unknown) => value;
  _.bi = create('function(a,b,c,d){return _.Ph(a,b,_.Yh(a,d,c))}');
  _.AL = create('function(a){return _.m(a,_.CI,2)}');
  const tHd = create(
    'class extends _.l{constructor(a){super(a)}getResponse(){return _.m(this,_.M5c,2)}}',
  );
  _.PJd = create('function(a){return _.bi(a,OJd,4,_.YL)}', { OJd: tHd });
  _.ni = (value: any, field: number) => value.fl[field - 1] === true;
  _.Si = (value: any, field: number) => value.fl[field - 1] != null;

  _.Qg = create(
    'function(a,b){b===void 0&&(b=0);Woa();b=Voa[b];for(var c=Array(Math.floor(a.length/3)),d=b[64]||"",e=0,f=0;e<a.length-2;e+=3){var g=a[e],k=a[e+1],r=a[e+2],u=b[g>>2];g=b[(g&3)<<4|k>>4];k=b[(k&15)<<2|r>>6];r=b[r&63];c[f++]=u+g+k+r}u=0;r=d;switch(a.length-e){case 2:u=a[e+1],r=b[(u&15)<<2]||d;case 1:a=a[e],c[f]=b[a>>2]+b[(a&3)<<4|u>>4]+r+d}return c.join("")}',
    { Woa: () => {}, Voa: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='] },
  );
  _.DI.prototype.ig = function () {
    return this.fl[0];
  };
  _.CI.prototype.ig = create('class{ig(){return _.n(this,1)}}').prototype.ig;
  _.$Ad.prototype.setLocale = function (v: unknown) {
    return write(this, 3, v);
  };
  _.xJd.prototype.setText = function (v: unknown) {
    return write(this, 1, v);
  };
  _.WL.prototype.Ni = create('class{Ni(a){return _.ei(this,6,_.cM,a)}}').prototype.Ni;
  _.JJd.prototype.Bg = create('class{Bg(a){return _.di(this,2,_.XL,a)}}').prototype.Bg;
  _.Hoa = create(
    'function(a,b,c,d){if(_.Qa(a))return a;if(!Array.isArray(a))return c?d&2?b[_.Xd]||(b[_.Xd]=_.iba(b)):new b:void 0;c=a[_.La]|0;d=c|d&32|d&2;d!==c&&(a[_.La]=d);return new b(a)}',
  );
  const Qoa = create(
    'function(a,b,c,d,e){var f=!1;d=_.de(a,d,e,g=>{var k=_.Hoa(g,c,!1,b);f=k!==g&&k!=null;return k});if(d!=null)return f&&!_.Ra(d)&&_.Mg(a,b),d}',
  );
  _.m = create(
    'function(a,b,c,d){var e=a.fl,f=e[_.La]|0;b=Qoa(e,f,b,c,d);if(b==null)return b;f=e[_.La]|0;if(!_.Ra(a,f)){let g=_.Lg(b);g!==b&&(_.ub(a)&&(e=a.fl,f=e[_.La]|0),b=g,f=_.xb(e,f,c,b,d),_.Mg(e,f))}return b}',
    {
      Qoa: (a: any[], flags: number, C: any, n: number, offset: boolean) => {
        if (a === ok.fl && n === 3) calls.config++;
        return Qoa(a, flags, C, n, offset);
      },
    },
  );
  _.Ph = create(
    'function(a,b,c,d){a=a.fl;return Qoa(a,a[_.La]|0,b,c,d)||b[_.Xd]||(b[_.Xd]=_.iba(b))}',
    {
      Qoa,
    },
  );
  _.Lg = create(
    'function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?_.Rba(a,b,c)?_.Qba(a,b,!0):new a.constructor(_.tb(b,c,!1)):a}',
  );
  _.Af = create(
    'function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?a:_.Rba(a,b,c)?_.Qba(a,b):new a.constructor(_.tb(b,c,!0))}',
  );
  _.Gh = create('function(a,b,c,d,e){d=Qpa(d);_.Vh(a,c,d,e);d&&!_.Ra(d)&&_.Mg(a.fl);return a}', {
    Qpa: (v: unknown) => v,
  });
  _.ub = create(
    'function(a){if(a.Fb!==_.Kaa)return!1;var b=a.fl;b=_.tb(b,b[_.La]|0);_.Ma(b,2048);a.fl=b;_.Laa(a,!1);a.tcc=void 0;return!0}',
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
  _.nb = create('function(a){return a}');
  _.ob = Symbol('synthetic-unknown-fields');
  _.Laa = create('function(a,b){a.Fb=b?_.Kaa:void 0}');
  _.Ma = create('function(a,b){a[_.La]|=b}');
  _.Naa = (pivot: number) => pivot;
  _.Xd = Symbol('synthetic-default-message-cache');
  _.Na = create('function(a){_.Ma(a,34);return a}');
  _.iba = create('function(a){a=new a;_.Na(a.fl);return a}');
  _.de = create(
    'function(a,b,c,d){if(b===-1)return null;var e=b+(c?0:-1),f=a.length-1;if(!(f<1+(c?0:-1))){if(e>=f){var g=a[f];if(g!=null&&typeof g==="object"&&g.constructor===Object){c=g[b];var k=!0}else if(e===f)c=g;else return}else c=a[e];if(d&&c!=null){d=d(c);if(d==null)return d;if(!Object.is(d,c))return k?g[b]=d:a[e]=d,d}return c}}',
  );
  _.tba = create('function(a){var b=_.nb(_.ob);return b?a[b]:void 0}');
  const oneofInstrumentation = Function(
    '_',
    'Qpa',
    'var Noa,Ooa,Nba,Oba;_.pb=function(a,b,c,d){var e=d!==void 0;d=!!d;var f=_.nb(_.ob),g;!e&&f&&(g=a[f])&&g.ayb(Aba);f=[];var k=a.length;g=4294967295;var r=!1,u=!!(b&64),w=u?b&128?0:-1:void 0;if(!(b&1)){var B=k&&a[k-1];B!=null&&typeof B==="object"&&B.constructor===Object?(k--,g=k):B=void 0;if(u&&!(b&128)&&!e){r=!0;var C;g=((C=_.Bba)!=null?C:_.Naa)(g-w,w,a,B,void 0)+w}}b=void 0;for(C=0;C<k;C++){let N=a[C];if(N!=null&&(N=c(N,d))!=null)if(u&&C>=g){let T=C-w;var G=void 0;((G=b)!=null?G:b={})[T]=N}else f[C]=N}if(B)for(let N in B){G=\nB[N];if(G==null||(G=c(G,d))==null)continue;k=+N;let T;if(u&&!Number.isNaN(k)&&(T=k+w)<g)f[T]=G;else{let aa;((aa=b)!=null?aa:b={})[N]=G}}b&&(r?f.push(b):f[g]=b);e&&_.nb(_.ob)&&(a=_.tba(a))&&"function"==typeof _.Cba&&a instanceof _.Cba&&(f[_.ob]=a.ha());return f};_.Pba=function(a,b){if(typeof a!=="object")return a;if(Array.isArray(a)){var c=a[_.La]|0;return a.length===0&&c&1?void 0:Nba(a,c,b)}if(_.Qa(a))return Oba(a);if("function"==typeof _.sb&&a instanceof _.sb){b=a.Ewa;if(b&2)return a;if(!a.size)return;c=_.Na(a.Cmc());if(a.CPa)for(a=0;a<c.length;a++){let d=c[a],e=d[1];e==null||typeof e!=="object"?e=void 0:_.Qa(e)?e=Oba(e):Array.isArray(e)?e=Nba(e,e[_.La]|0,!!(b&32)):e=void 0;d[1]=e}return c}if(a instanceof _.mb)return a};Nba=function(a,b,c){if(b&2)return a;!c||4096&b||16&b?a=_.tb(a,b,!1,c&&!(b&16)):(_.Ma(a,34),b&4&&Object.freeze(a));return a};_.Qba=function(a,b,c){a=new a.constructor(b);c&&_.Laa(a,!0);a.tcc=_.Kaa;return a};Oba=function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?a:_.Rba(a,b,c)?_.Qba(a,b):_.tb(b,c)};_.tb=function(a,b,c,d){d!=null||(d=!!(34&b));a=_.pb(a,b,_.Pba,d);d=32;c&&(d|=2);b=b&16769217|d;a[_.La]=b;return a};_.wb=function(a){if(!_.ub(a)&&_.Ra(a,a.fl[_.La]|0))throw Error();};_.Rba=function(a,b,c){return c&2?!0:c&32&&!(c&4096)?(b[_.La]=c|2,_.Laa(a,!0),!0):!1};_.xb=function(a,b,c,d,e){var f=c+(e?0:-1),g=a.length-1;if(g>=1+(e?0:-1)&&f>=g){let k=a[g];if(k!=null&&typeof k==="object"&&k.constructor===Object)return k[c]=d,b}if(f<=g)return a[f]=d,b;if(d!==void 0){let k;g=((k=b)!=null?k:b=a[_.La]|0)>>14&1023||536870912;c>=g?d!=null&&(a[g+(e?0:-1)]={[c]:d}):a[f]=d}return b};_.Mg=function(a,b){b===void 0&&(b=a[_.La]|0);b&32&&!(b&4096)&&(a[_.La]=b|4096)};Noa=function(a){var b;return(b=a[_.dga])!=null?b:a[_.dga]=new Map};Ooa=function(a,b,c,d,e){var f=a.get(d);if(f!=null)return f;f=0;for(let g=0;g<d.length;g++){let k=d[g];_.de(b,k,e)!=null&&(f!==0&&(c=_.xb(b,c,f,void 0,e)),f=k)}a.set(d,f);return f};_.Poa=function(a,b,c,d,e){var f=Noa(a),g=Ooa(f,a,b,c,e);g!==d&&(g&&(b=_.xb(a,b,g,void 0,e)),f.set(c,d));return b};_.Oh=function(a,b,c,d){_.wb(a);var e=a.fl,f=e[_.La]|0;if(d==null){let g=Noa(e);if(Ooa(g,e,f,c)===b)g.set(c,0);else return a}else f=_.Poa(e,f,c,b);_.xb(e,f,b,d);return a};_.di=function(a,b,c,d){d=Qpa(d);_.Oh(a,b,c,d);d&&!_.Ra(d)&&_.Mg(a.fl);return a};_.Xh=function(a,b,c){a=a.fl;return Ooa(Noa(a),a,void 0,b,c)};_.Yh=function(a,b,c,d){return _.Xh(a,b,d)===c?c:-1};return {observeRootSelection(hook){const original=Ooa;Ooa=function(...args){const result=Reflect.apply(original,this,args);if(args[3]===_.$L)hook(args[1]);return result}}};',
  )(_, (v: unknown) => v);
  _.Vh = (a: any, field: number, value: any) => {
    _.wb(a);
    if (Object.getPrototypeOf(a) === _.WL.prototype && field === 1) calls.query++;
    _.xb(a.fl, a.fl[_.La] | 0, field, value);
    if (Object.getPrototypeOf(a) === _.CI.prototype && field === 2) normalizeHook(a);
    return a;
  };
  _.Rh = create('function(a){return _.Af(a)}');
  _.Ni = _.Li = _.Vh;
  _.NI = create('function(a,b){return _.Li(a,2,b)}');
  _.MI = create('function(a,b){return _.Li(a,1,b)}');
  _.zJd = create('function(a,b){return _.Ii(a,1,b)}');
  _.dDb = create(
    'function(a){return Object.assign({},{locale:"ko",requestSource:a.requestSource},a.modeId!==void 0?{modeId:a.modeId}:{},a.turnId!==void 0?{turnId:a.turnId}:{})}',
  );
  _.EJd = create('function(a,b){return _.Gh(a,_.$Ad,1,b)}');
  _.FJd = create('function(a,b){return _.Ii(a,2,b)}');
  const QGd = create('class extends _.l{constructor(a){super(a)}}');
  _.wL.prototype.getQuery = create('class{getQuery(){return _.m(this,_.wL,1)}}').prototype.getQuery;
  _.Ywd.prototype.getText = create('class{getText(){return _.n(this,1)}}').prototype.getText;
  _.n = (a: any, field: number) => a.fl[field - 1];
  _.ge = (a: any, field: number) => a.fl[field - 1] != null;
  const ok = _.Rh(
    new _.wL(
      wire({
        1: _.Rh(new _.Ywd([packet.request.textQuery])),
        3: _.Rh(new _.DI()),
        60: approved.clientTurnId,
      }),
    ),
  );
  // The real HJd body invokes only inert synthetic packet/setting dependencies here.
  _.jMd = create(
    'function(a,b){var c=!!b.request.dLa,d,e,f;b=_.Ryd(b,a.requestSource,a.Gc,a.mb,(f=(d=a.uv())==null?void 0:d.id)!=null?f:void 0,!c&&a.Oga(),!c&&a.Wa.Ga(),a.Ac.isSupported(),a.rja&&_.mL(a.Va)?(e=a.Tb)==null?void 0:e.Ja.value:void 0);if(a.rja&&_.mL(a.Va)&&(a=_.Aed())){a:switch(a.kind){case 0:c=new yL;a=_.Mi(c,2,fGd,a.toolId);a=_.Af(a);break a;case 1:c=new yL;a=_.Mi(c,3,fGd,a.toolId);a=_.Af(a);break a;case 2:a=new yL;a=_.Fi(a,5,fGd,!0);a=_.Af(a);break a;default:throw Error("sk`"+String(a.kind));\n}if(c=a){var g;(a=(g=_.m(b,yL,109))==null?void 0:_.m(g,jxd,4))?(g=_.Lg(c),g=_.Gh(g,jxd,4,a)):g=c;_.Gh(b,yL,109,g)}}return b}',
  );
  _.Ryd = (packet: any) => (packet.request.sib === 'RECONNECT_TO_EXISTING_TURN' ? copy(ok) : ok);
  _.aKd = create(
    'function(a,b,c,d,e){var f,g,k=((f=_.hGd(b))==null?void 0:f.ig())||((g=_.m(b,_.vL,72))==null?void 0:g.ig())||"";e&&(a.oa=_.Rh(_.MI(_.NI(new _.CI,e),k)));d=_.dDb({requestSource:c,modeId:d,turnId:e});c=(new _.$Ad).setLocale(d.locale);c=_.Ni(c,1,d.requestSource);d.modeId!==void 0&&_.Li(c,2,d.modeId);d.turnId!==void 0&&_.Li(c,4,d.turnId);d=new _.DJd;e=new hJd;b=_.Gh(e,_.wL,1,b);b=_.Ni(b,4,1);b=_.Af(b);b=_.Gh(d,hJd,5,b);c=_.EJd(_.FJd(new _.GJd,0),c);b=_.di(c,8,_.HJd,b);b=_.Af(b);c=new _.JJd;b=_.di(c,\n1,_.XL,b);b=_.Af(b);if(a.ha)a.connection.send(b);else{let r,u;(u=(r=a.connection).Afc)==null||u.call(r,b);a.wa.push(b)}}',
    { hJd: QGd },
  );
  _.AKd = create('class{register(a){this.ha=a}get(){return this.ha}}');
  _.xKd = create(
    'class{constructor(){this.Da=_.x(_.Nz);this.ka=_.x(_.pKd);this.wa=_.x(_.mKd);this.oa=_.x(_.eA);this.ha=new Set}get Aa(){return this.Da.Ea(sKd)}}',
    { sKd: {} },
  );
  _.gM = class {};
  _.UL = class {};
  _.wN = class {};
  _.JVd = create(
    'class{constructor(){this.Na=_.x(_.xKd);this.Ua=_.x(_.zKd);this.Va=_.x(_.CKd);this.Wa=_.x(_.dK);this.Oa=_.x(_.UC);this.Ia=_.x(_.xx);this.Da=_.x(_.Nz);this.Ha=_.x(_.GA);this.Fc=_.x(_.JA);this.nb=_.x(_.QF);this.Za=this.Da.Ea(_.rKd);var a;this.kb=(a=_.x(_.mKd,{optional:!0}))!=null?a:!1;this.ob=this.Da.Ea(_.qKd);this.ka=!1;this.ub=_.Z(this.Oa.Si,{initialValue:!1});this.ZWb=_.Z(this.nb.sG().pipe(_.v(b=>b.map(c=>c.id))),{initialValue:[]});_.x(_.AKd).register(this)}isEnabled(){return!this.kb&&_.BKd(this.Va)}Ca(){return this.ka||\n!!this.ha&&_.ZJd(this.ha.connection)}mb(){var a=this.ha;if(a&&_.ZJd(a.connection))return _.n(a.Sec,60)||void 0}Eb(a,b,c,d,e){if(this.isEnabled()){var f=e!=null?e:()=>this.Oa.aBc();a=a.map(g=>typeof g==="object"&&g!==null&&"event"in g&&"observable"in g&&_.ow(g.observable)?g:{event:"CANCELLED_INVALIDATION",observable:g});_.Jt(...a.map(({event:g,observable:k})=>k.pipe(_.sw(),_.ww(1),_.v(()=>g)))).pipe(_.Kt(()=>this.ka||this.ha!==void 0),_.cu(g=>{this.reset(g)}),_.yw(()=>_.Et(()=>f()).pipe(_.Tt(1),_.Mt(()=>\n_.It))),_.wA(b)).subscribe(g=>{d&&!d()||this.Aa(g,c())})}}Ab(){this.ha!==void 0&&ZPk(this)}Shc(a){var b=this.ha;b!=null&&_.ZJd(b.connection)&&(b.connection.Shc(a),ZPk(this))}IDc(){var a=this.Ja;this.Ja=void 0;return a}Oof(){this.wa=void 0;var a=this.ha;if(a){YPk(this);a.bEd.unsubscribe();this.ha=void 0;this.ka=!1;if(_.ZJd(a.connection))return{connection:a.connection,Sec:a.Sec,ri:a.ri,VM:a.VM};let b=a.connection.hasError;a.connection.disconnect();_.NAd(this.Fc,b?"CHANNEL_ERROR":"CHANNEL_CLOSED",a.ri)}}oa(a){var b=\nthis.ha;a==="CHANNEL_ERROR"?b&&(this.wa={conversationId:b.conversationId,ri:b.ri}):this.wa=void 0;b&&(YPk(this),b.bEd.unsubscribe(),_.ZJd(b.connection)&&a!=="CHANNEL_ERROR"&&a!=="CHANNEL_CLOSED"?_.aM(b.connection):b.connection.disconnect(),this.ha=void 0,_.NAd(this.Fc,a!=null?a:"CANCELLED_INVALIDATION",b.ri));this.ka=!1}reset(a="CANCELLED_INVALIDATION"){this.oa(a)}Aa(a,b){if(this.isEnabled()){var c=_.ti(a,50);if(!(this.Za&&(_.pL(c)||c===58)||this.ub()||this.ZWb().length>0&&b&&!this.ZWb().includes(b)||\nthis.ka)){var d,e;c=(e=(d=_.hGd(a))==null?void 0:d.ig())!=null?e:"";if(!this.wa||this.wa.conversationId!==c||this.wa.ri!==b)if(!this.ha||!_.ZJd(this.ha.connection)||this.ha.conversationId!==c||this.ha.ri!==b){this.oa();this.ka=!0;this.Ja=d=this.Wa.now();_.NAd(this.Fc,"CREATED",b);try{let g=_.yKd(this.Ua,{ri:b,isTemporaryChat:_.ni(a,46),clientTurnId:_.n(a,60),requestSource:_.FA(this.Ha)});var f=_.wKd(this.Na,this.Ia,{DS:g});f.connect();_.aKd(f,a,_.FA(this.Ha),b!=null?b:"",_.n(a,60));ZPk(this);let k=\nf.Ja.pipe(_.Tt(1),_.wA(this.Ia)).subscribe(r=>{this.oa(r!==void 0?"CHANNEL_ERROR":"CHANNEL_CLOSED")});this.ha={connection:f,ri:b,conversationId:c,Sec:a,bEd:k,VM:d}}catch(g){let k;(k=f)==null||k.disconnect();YPk(this);this.ha=void 0;this.ka=!1}finally{this.ka=!1}}}}}}',
  );
  _.cM = create('class{constructor(){this.ha=0}reset(){this.ha=0}}');
  _.CKd = create(
    'class{constructor(){this.Da=_.x(_.Nz);this.ka=_.x(_.cM);this.ha=this.Da.Ea(_.tKd);this.oa=this.Da.Ea(uKd)}}',
    { uKd: Symbol('synthetic-override') },
  );
  _.zKd = create(
    'class{constructor(){this.ha=_.x(_.bL);this.ka=_.x(_.dL);this.oa=_.x(_.bM);this.wa=_.x(_.cM)}}',
  );
  _.BKd = create('function(a){if(!a.ha)return!1;if(a.oa)return!0;a=a.ka.ha;return a!==43&&a!==42}');
  const selectedMode = Object.assign(Object.create(_.cM.prototype), { ha: 42 });
  const eligibility = Object.assign(Object.create(_.CKd.prototype), {
    ha: true,
    oa: true,
    ka: selectedMode,
  });
  const registry = new _.AKd();
  const session = Object.assign(Object.create(_.xKd.prototype), {
    ha: new Set(),
    wa: false,
    Da: { Ea: () => codec === 'protobuf' },
    ka: { ka: 'synthetic', ha: 'synthetic' },
    oa: {},
  });
  const api = Object.assign(new _.gM(), {
    Aa: eligibility,
    Ua: selectedMode,
    kb: false,
    Kd: true,
    Ab: session,
    Fb: registry,
    Ia: undefined,
    Ja: Object.assign(new _.UL(), { isEnabled: true }),
    requestSource: 1,
    uv: () => undefined,
    Oga: () => false,
    Wa: { Ga: () => false },
    Ac: { isSupported: () => false },
    rja: false,
  });
  const consumer = Object.assign(new _.wN(), { ha: api });
  // Scheduling is deferred like the source Promise queue; flushOpen is test-only.
  _.re = create('(a,b)=>{Sga||Tga();eca||(Sga(),eca=!0);bca.add(a,b)}', {
    Sga: () => {},
    Tga: () => {},
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
    'function(){this.oa=vlb(this);if(this.ka)this.ka.cancel(),this.ka=null;else if(this.ha&&this.ha.size!==0){for(let a of this.ha.values())a.cancel();this.ha.clear()}}',
    { vlb: Tlb },
  );
  const dt = create(
    'function(a){this.Rf=0;this.oa=[];this.ha=new zkb;this.Xc=this.hf=this.ub=this.Zc=this.ka=this.Kf=this.mb=this.ob=this.Ga=this.Nc=this.Na=null;this.Jh=this.Gb=0;this.Lg=Ekb("failFast",!1,a);this.Eb=this.Va=this.Ja=this.Ca=this.wa=null;this.yd=!0;this.oc=this.xf=this.Ha=-1;this.Pc=this.Wa=this.Za=0;this.xg=Ekb("baseRetryDelayMs",5E3,a);this.Gh=Ekb("retryDelaySeedMs",1E4,a);this.wh=Ekb("forwardChannelMaxRetries",2,a);this.Cf=Ekb("forwardChannelRequestTimeoutMs",2E4,a);this.BPb=a&&a.FEa||void 0;this.Wi=\na&&a.x4g||void 0;this.Uf=a&&a.Rsg||!1;this.Tb=void 0;this.Ab=a&&a.n3a||!1;this.Ua="";this.Aa=new Fkb(a&&a.x_g);this.Wd=Math.min(a&&a.d4g||1E3,1E3);this.Yf=new Dkb;this.Ac=a&&a.cbb||!1;this.Zb=a&&a.X0g||!1;this.Ac&&this.Zb&&(this.ha.warning("Ignore encodeInitMessageHeaders because fastHandshake is set."),this.Zb=!1);this.Qh=a&&a.DZg||!1;a&&a.SId&&this.ha.SId();a&&a.sbb&&(this.yd=!1);this.Fd=!this.Ac&&this.yd&&a&&a.kId||!1;this.Sd=void 0;a&&a.v4d&&a.v4d>0&&(this.Sd=a.v4d);this.Kd=void 0;this.Fb=0;this.Yb=\n!1;this.xe=this.kb=null}',
    {
      zkb: (() => {
        const C = create('function(){this.Rm=null;this.ha=!0}');
        C.prototype.debug = C.prototype.info = C.prototype.warning = create('function(){}');
        return C;
      })(),
      Ekb: (_k: string, d: unknown) => d,
      Fkb: blb,
      Dkb: class {
        ha = { parse: JSON.parse };
      },
    },
  );
  dt.prototype.hU = 1;
  const Qlb = create('function(a){ulb(a.Aa)||a.Ca||(a.Ca=!0,_.re(a.Jf,a),a.Za=0)}', {
    ulb: (a: any) => (a.ka ? true : a.ha ? a.ha.size >= a.wa : false),
  });
  dt.prototype.connect = create(
    'function(a,b,c,d){this.ha.debug("connect()");kt(0);this.Zc=a;this.ob=b||{};c&&d!==void 0&&(this.ob.OSID=c,this.ob.OAID=d);this.Eb=this.yd;this.ha.debug("connectChannel_()");a=plb(this,null,this.Zc);this.ha.debug("GetForwardChannelUri: "+a);this.ub=a;slb(this)}',
    {
      kt: () => {
        calls.open++;
      },
      plb: () => uri(),
      slb: Qlb,
    },
  );
  // URLs, XHR, timers and binary encoding below are synthetic test-only dependencies.
  // The request/batch/scheduler bodies preserve their original source transitions.
  const uri = (): any => ({ clone: () => uri(), toString: () => 'synthetic' });
  _.Eg = _.roa = () => {};
  _.Gg = (a: any) => a;
  _.Pb = (a: any) => ({ ...a });
  _.Qb = Object.assign;
  _.ld = encodeURIComponent;
  _.Bb = () => {};
  const Vkb = create(
    'function(a,b){if(typeof a!=="function")throw Error("le");return _.fa.setTimeout(function(){a()},b)}',
  );
  const Xkb = create('function(){this.oa=null;this.ha="";this.ka=!1}');
  const bt = create(
    'function(a,b,c,d,e){this.Aa=a;this.ka=b;this.Zc=c;this.oa=d;this.Gb=e||1;this.Zb=new _.Yj(this);this.kH=45E3;this.ob=null;this.Ha=!1;this.Ca=this.Ga=this.Ua=this.mb=this.Wa=this.Tb=this.Va=null;this.Za=[];this.ha=null;this.Na=0;this.IG=this.Ja=null;this.Fb=-1;this.kb=!1;this.Yb=0;this.Ab=null;this.Nc=this.ub=this.Ac=this.Eb=!1;this.wa=new Akb}',
    { Akb: Xkb },
  );
  const Flb = create(
    'function(a,b){if(a.Va!=null)throw Error("me");a.Va=ykb((0,_.$b)(a.Pc,a),b)}',
    { ykb: Vkb },
  );
  const qlb = create('function(a){a.Tb=Date.now()+a.kH;hlb(a,a.kH)}', { hlb: Flb });
  const ulb = create('function(a){a.Va&&(_.fa.clearTimeout(a.Va),a.Va=null)}');
  const ylb = create(
    'function(a){Xkb(a);_.Bb(a.Ab);a.Ab=null;a.Zb.removeAll();if(a.ha){let b=a.ha;a.ha=null;b.abort();b.dispose()}}',
    { Xkb: ulb },
  );
  const Slb = create('function(a){return a.ka?!0:a.ha?a.ha.size>=a.wa:!1}');
  const Klb = create('function(a){return a.ka?1:a.ha?a.ha.size:0}');
  const Glb = create('function(a,\nb){return a.ka?a.ka==b:a.ha?a.ha.has(b):!1}');
  const Mlb = create('function(a,b){a.ha?a.ha.add(b):a.ka=b}');
  const Olb = create('function(a,b){a.ka&&a.ka==b?a.ka=null:a.ha&&a.ha.has(b)&&a.ha.delete(b)}');
  const bmb = create(
    'function(a,b,c){c=Math.min(a.oa.length,c);\nvar d=a.wa?(0,_.$b)(a.wa.JMe,a.wa,a):null;a:{var e=a.oa;let k=-1;for(;;){let r=["count="+c];k==-1?c>0?(k=e[0].mapId,r.push("ofs="+k)):k=0:r.push("ofs="+k);let u=!0;for(let w=0;w<c;w++){var f=e[w].mapId;let B=e[w].map;f-=k;if(f<0)k=Math.max(0,e[w].mapId-100),u=!1;else try{f="req"+f+"_"||"";try{var g=B instanceof Map?B:Object.entries(B);for(let [C,G]of g){let N=G;_.Ed(G)&&(N=_.Uj(G));r.push(f+C+"="+encodeURIComponent(N))}}catch(C){throw r.push(f+"type="+encodeURIComponent("_badmap")),C;}}catch(C){d&&\nd(B)}}if(u){g=r.join("&");break a}}g=void 0}a=a.oa.splice(0,c);b.Za=a;return g}',
  );
  const Ylb = create(
    'function(a,b){a.ob&&_.Kb(a.ob,function(c,d){_.Eg(b,d,c)});a.wa&&_.Kb({},function(c,d){_.Eg(b,d,c)})}',
  );
  const rlb = create(
    'function(a,b,c){if(b&&!a.Ab)throw Error("oe");b=a.Uf&&!a.BPb?new _.Vj(new _.Mta({aad:c})):new _.Vj(a.BPb);b.xI(a.Ab);return b}',
  );
  const olb = create(
    'function(a,b){a.Wa=Date.now();Tkb(a);a.Ga=a.Ua.clone();_.roa(a.Ga,"t",a.Gb);a.Na=0;var c=a.Aa.Ab;a.wa=new Akb;a.ha=Ukb(a.Aa,c?b:null,!a.Ca);a.Yb>0&&(a.Ab=new _.ALa((0,_.$b)(a.oc,a,a.ha),a.Yb));a.Zb.listen(a.ha,"readystatechange",a.Xc);b=a.ob?_.Pb(a.ob):{};a.Ca?(a.Ja||(a.Ja="POST"),b["Content-Type"]="application/x-www-form-urlencoded",a.ha.send(a.Ga,a.Ja,a.Ca,b)):(a.Ja="GET",a.ha.send(a.Ga,a.Ja,null,b));ukb(1);Jkb(a.ka,\na.Ja,a.Ga,a.oa,a.Gb,a.Ca)}',
    {
      Tkb: qlb,
      Akb: Xkb,
      Ukb: rlb,
      ukb: () => {},
      Jkb: () => {},
    },
  );
  const observeOlb = (a: any, b: any) => {
    requests.push(a);
    if (a.oa === 'rpc') calls.backchannel++;
    else if (a.Za.length) calls.forward++;
    olb(a, b);
  };
  const plb = create('function(a,b,c){a.mb=1;a.Ua=_.Gg(b.clone());a.Ca=c;a.Eb=!0;Rkb(a,null)}', {
    Rkb: observeOlb,
  });
  const cmb = create(
    'function(a,b){var c;b?c=b.oa:c=a.Gb++;var d=a.ub.clone();_.Eg(d,"SID",a.Ua);_.Eg(d,"RID",c);_.Eg(d,"AID",a.Ha);Alb(a,d);a.Ga&&a.Na&&_.ylb(d,a.Ga,a.Na);c=new lt(a,a.ha,a.Ua,c,a.Za+1);a.Ga===null&&(c.ob=a.Na);b&&(a.oa=b.Za.concat(a.oa));b=Elb(a,c,a.Wd);c.setTimeout(Math.round(a.Cf*.5)+Math.round(a.Cf*.5*Math.random()));olb(a.Aa,c);Skb(c,d,b)}',
    { Alb: Ylb, lt: bt, Elb: bmb, olb: Mlb, Skb: plb },
  );
  const retryDelay = create(
    'function(a,b){var c=a.Eg+Math.floor(Math.random()*a.Mh);a.isActive()||(a.ha.debug("Inactive channel"),c*=2);return c*b}',
  );
  const Elb = create(
    'function(a){a.kb!=null&&(a.ha.debug("Cancel the BP detection timer."),_.fa.clearTimeout(a.kb),a.kb=null)}',
  );
  const Ilb = create('function(a){a.ka&&(glb(a),a.ka.cancel(),a.ka=null)}', { glb: Elb });
  const Hlb = create('function(a){a.Va!=null&&(_.fa.clearTimeout(a.Va),a.Va=null)}');
  const Plb = create('function(a){a.ka||a.Ja||(a.Pc=1,_.re(a.qf,a),a.Wa=0)}');
  const Jlb = create(
    'function(a){if(a.ka||a.Ja||a.Wa>=3)return!1;a.ha.debug("Going to retry GET");a.Pc++;a.Ja=ykb((0,_.$b)(a.qf,a),Clb(a,a.Wa));a.Wa++;return!0}',
    { ykb: Vkb, Clb: retryDelay },
  );
  const dmb = create(
    'function(a){a.ha.debug("Creating new HttpRequest");a.ka=new lt(a,a.ha,a.Ua,"rpc",a.Pc);a.Ga===null&&(a.ka.ob=a.Na);a.ka.Yb=0;var b=a.hf.clone();_.Eg(b,"RID","rpc");_.Eg(b,"SID",a.Ua);_.Eg(b,"AID",a.Ha);_.Eg(b,"CI",a.Eb?"0":"1");!a.Eb&&a.Sd&&_.Eg(b,"TO",a.Sd);_.Eg(b,"TYPE","xmlhttp");Alb(a,b);a.Ga&&a.Na&&_.ylb(b,a.Ga,a.Na);a.Tb&&a.ka.setTimeout(a.Tb);var c=a.ka,d=a.Xc;c.mb=1;c.Ua=_.Gg(b.clone());\nc.Ca=null;c.Eb=!0;Rkb(c,d);a.ha.debug("New Request created")}',
    { lt: bt, Alb: Ylb, Rkb: observeOlb },
  );
  const amb = create(
    'function(a,b){if(mlb(a.Aa)>=a.Aa.wa-(a.Ca?1:0))return!1;if(a.Ca)return a.ha.debug("Use the retry request that is already scheduled."),a.oa=b.Za.concat(a.oa),!0;if(a.hU==1||a.hU==2||a.Za>=(a.Lg?0:a.wh))return!1;a.ha.debug("Going to retry POST");a.Ca=ykb((0,_.$b)(a.Jf,a,b),Clb(a,a.Za));a.Za++;return!0}',
    { mlb: Klb, ykb: Vkb, Clb: retryDelay },
  );
  const Xlb = create(
    'function(a){klb(a);a.Ja&&(_.fa.clearTimeout(a.Ja),a.Ja=null);jlb(a);a.Aa.cancel();a.Ca&&(typeof a.Ca==="number"&&_.fa.clearTimeout(a.Ca),a.Ca=null)}',
    { klb: Ilb, jlb: Hlb },
  );
  const Zlb = create(
    'function(a){a.hU=0;a.xe=[];if(a.wa){let b=vlb(a.Aa);if(b.length!=0||a.oa.length!=0)a.ha.debug(()=>"Number of undelivered maps, pending: "+b.length+", outgoing: "+a.oa.length),_.Ga(a.xe,b),_.Ga(a.xe,a.oa),a.Aa.oa.length=0,_.Ea(a.oa),a.oa.length=0;a.wa.Ykd()}}',
    { vlb: Tlb },
  );
  _.Ga = (a: any[], b: any[]) => a.push(...b);
  _.Ea = (a: any[]) => a.slice();
  const Llb = create(
    'function(a,b){a.ha.info("Error code "+b);if(b==2){var c=(0,_.$b)(a.jj,a),d=a.Wi;let e=!d;d=new _.wg(d||"//www.google.com/images/cleardot.gif");\n_.fa.location&&_.fa.location.protocol=="http"||_.xg(d,"https");_.Gg(d);e?Bkb(d.toString(),c):Ckb(d.toString(),c)}else kt(2);a.ha.debug("HttpChannel: error - "+b);a.hU=0;a.wa&&a.wa.FU(a,b);Blb(a);zlb(a)}',
    {
      zlb: Xlb,
      Blb: Zlb,
      kt: () => {},
      Bkb: () => {},
      Ckb: () => {},
    },
  );
  dt.prototype.jj = create(
    'function(a){a?(this.ha.info("Successfully pinged google.com"),at(2)):(this.ha.info("Failed to ping google.com"),at(1))}',
    { at: () => {} },
  );
  _.wg = function () {
    return uri();
  };
  _.xg = () => {};
  const Blb = create(
    'function(a,b){a.ha.debug("Request complete");var c=null;if(a.ka==b){jlb(a);glb(a);a.ka=null;var d=2}else if(ilb(a.Aa,b))c=b.Za,qlb(a.Aa,b),d=1;else return;if(a.hU!=0)if(b.FY())d==1?(xkb(b.Ca?b.Ca.length:0,Date.now()-b.Wa,a.Za),slb(a)):rlb(a);else{var e=b.Fb,f=b.getLastError();if(f==3||f==0&&e>0)a.ha.debug("Not retrying due to error type"),e>200&&(a.oc=b.Fb);else{a.ha.debug(function(){return"Maybe retrying, last error: "+Okb(f,\na.oc)});if(d==1&&Dlb(a,b)||d==2&&llb(a))return;a.ha.debug("Exceeded max number of retries")}c&&c.length>0&&wlb(a.Aa,c);a.ha.debug("Error: HTTP request failed");switch(f){case 1:nlb(a,5);break;case 4:nlb(a,10);break;case 3:nlb(a,6);break;default:nlb(a,2)}}}',
    {
      jlb: Hlb,
      glb: Elb,
      ilb: Glb,
      qlb: Olb,
      xkb: () => {},
      slb: Qlb,
      rlb: Plb,
      Dlb: amb,
      llb: Jlb,
      wlb: (a: any, b: any[]) => {
        a.oa = a.oa.concat(b);
      },
      nlb: Llb,
    },
  );
  const zlb = create('function(a){a.Aa.xD()||a.kb||dlb(a.Aa,a)}', { dlb: Blb });
  bt.prototype.Pc = create(
    'function(){this.Va=null;var a=Date.now();a-this.Tb>=0?(Nkb(this.ka,this.Ga),this.mb!=2&&(ukb(3),kt(17)),alb(this),this.IG=2,blb(this)):(this.ka.warning("WatchDog timer called too early"),hlb(this,this.Tb-a))}',
    { Nkb: () => {}, ukb: () => {}, kt: () => {}, alb: ylb, blb: zlb, hlb: Flb },
  );
  bt.prototype.Xc = create(
    'function(a){a=a.target;var b=this.Ab;b&&a.uea()==3?(this.ka.debug("Throttling readystatechange."),b.fire()):this.oc(a)}',
  );
  const xlb = create(
    'function(a,b){try{var c=a.Aa;if(c.hU!=0&&(c.ka==a||ilb(c.Aa,a)))if(!a.ub&&ilb(c.Aa,a)&&c.hU==3){try{var d=c.Yf.ha.parse(b)}catch(w){d=null}if(Array.isArray(d)&&d.length==3){var e=d;if(e[0]==0)a:if(c.ha.debug("Server claims our backchannel is missing."),c.Ja)c.ha.debug("But we are currently starting the request.");else{if(c.ka)if(c.ka.Wa+3E3<a.Wa)jlb(c),klb(c);else break a;else c.ha.warning("We do not have a BackChannel established");llb(c);kt(18)}else{c.xf=e[1];var f=c.xf-c.Ha;if(0<f){var g=\ne[2];c.ha.debug(g+" bytes (in "+f+" arrays) are outstanding on the BackChannel");g<37500&&c.Eb&&c.Wa==0&&!c.Va&&(c.Va=ykb((0,_.$b)(c.Kh,c),6E3))}}if(mlb(c.Aa)<=1&&c.Kd){try{c.Kd()}catch(w){}c.Kd=void 0}}else c.ha.debug("Bad POST response data returned"),nlb(c,11)}else if((a.ub||c.ka==a)&&jlb(c),!_.ja(b))for(e=c.Yf.ha.parse(b),f=0;f<e.length;f++){let w=e[f],B=w[0];if(B<=c.Ha)c.ha.warning("Ignoring out-of-order or duplicate message with arrayId: "+B+", lastArrayId: "+c.Ha);else if(B>c.Ha+1&&c.Ha>-1&&\nc.ha.warning("Received non-consecutive message with arrayId: "+B+", lastArrayId: "+c.Ha),c.Ha=B,w=w[1],c.hU==2)if(w[0]=="c"){c.Ua=w[1];c.Xc=w[2];let C=w[3];C!=null&&(c.Mrc=C,c.ha.info("VER="+c.Mrc));let G=w[4];G!=null&&(c.Rf=G,c.ha.info("SVER="+c.Rf));let N=w[5];N!=null&&typeof N==="number"&&N>0&&(g=1.5*N,c.Tb=g,c.ha.info("backChannelRequestTimeoutMs_="+g));g=c;let T=a.ha;if(T){let da=_.Gkb(T,"X-Client-Wire-Protocol");if(da){var k=g.Aa;b=da;!k.ha&&(_.ka(b,"spdy")||_.ka(b,"quic")||_.ka(b,"h2"))&&(k.wa=\nk.Aa,k.ha=new Set,k.ka&&(olb(k,k.ka),k.ka=null))}if(g.mb){let ta=_.Gkb(T,"X-HTTP-Session-Id");ta?(g.Kf=ta,_.Eg(g.ub,g.mb,ta)):g.ha.warning("Missing X_HTTP_SESSION_ID in the handshake response")}}c.hU=3;c.wa&&c.wa.ald();c.Fb=Date.now()-a.Wa;c.Fd&&c.ha.info("Handshake RTT: "+c.Fb+"ms");g=c;b=a;var r=d=g;let aa=plb(r,r.Ab?g.Xc:null,g.Zc);r.ha.debug("GetBackChannelUri: "+aa);d.hf=aa;if(b.ub){g.ha.debug("Upgrade the handshake request to a backchannel.");qlb(g.Aa,b);d=b;var u=g.Tb;u&&d.setTimeout(u);d.Va&&\n(Xkb(d),Tkb(d));g.ka=b}else rlb(g);c.oa.length>0&&slb(c)}else w[0]!="stop"&&w[0]!="close"||nlb(c,7);else c.hU==3&&(w[0]=="stop"||w[0]=="close"?w[0]=="stop"?nlb(c,7):c.disconnect():w[0]!="noop"&&c.wa&&c.wa.Zkd(w),c.Wa=0)}ukb(4)}catch(w){}}',
    {
      ilb: Glb,
      mlb: Klb,
      ykb: Vkb,
      olb: Mlb,
      qlb: Olb,
      Xkb: ulb,
      Tkb: qlb,
      slb: Qlb,
      plb: () => uri(),
      jlb: Hlb,
      klb: Ilb,
      llb: Jlb,
      nlb: Llb,
      rlb: Plb,
      ukb: () => {},
      kt: () => {},
    },
  );
  _.Gkb = create('function(a,b){return a.vk?a.vk.getResponseHeader(b):null}');
  const tlb = create('function(a){return a.ha?a.wa.ka?!0:!(!a.ha.Ln()&&!a.ha.getResponse()):!1}');
  const chunks = new WeakMap<object, string>();
  const slb = create(
    'function(a){var b=a.ha.uea(),c=a.ha.J1(),d=a.ha.getStatus();if(!(b<3||b==3&&!Wkb(a))){a.kb||b!=4||c==7||(c==8||d<=0?ukb(3):ukb(2));Xkb(a);var e=a.ha.getStatus();a.Fb=e;c=Ykb(a);Wkb(a)||a.ka.debug(function(){return"No response text for uri "+a.Ga+" status "+e});a.Ha=e==200;Kkb(a.ka,a.Ja,a.Ga,a.oa,a.Gb,b,e);if(a.Ha){if(a.Ac&&!a.ub)if(d=Zkb(a))Mkb(a.ka,a.oa,d,"Initial handshake response via X-HTTP-Initial-Response"),a.ub=!0,$kb(a,d);else{a.Ha=!1;a.IG=3;kt(12);a.ka.warning("XMLHTTP Missing X_HTTP_INITIAL_RESPONSE ("+\na.oa+")");alb(a);blb(a);return}a.Eb?clb(a,b,c):(Mkb(a.ka,a.oa,c,null),$kb(a,c));b==4&&alb(a);a.Ha&&!a.kb&&(b==4?dlb(a.Aa,a):(a.Ha=!1,Tkb(a)))}else a.ha.uG(),e==400&&c.indexOf("Unknown SID")>0?(a.IG=3,kt(12),a.ka.warning("XMLHTTP Unknown SID ("+a.oa+")")):(a.IG=0,kt(13),a.ka.warning("XMLHTTP Bad status "+e+" ("+a.oa+")")),alb(a),blb(a)}}',
    {
      Wkb: tlb,
      Xkb: ulb,
      alb: ylb,
      blb: zlb,
      dlb: Blb,
      Tkb: qlb,
      $kb: xlb,
      ukb: () => {},
      Kkb: () => {},
      Mkb: () => {},
      kt: () => {},
      Ykb: (a: any) => a.ha.Ln(),
      // Chunk assembly is synthetic; the source xlb protocol transition is literal.
      clb: (a: any, _state: number, raw: string) => {
        if (chunks.get(a) !== raw) {
          chunks.set(a, raw);
          a.Oc = true;
          xlb(a, raw);
        }
      },
    },
  );
  bt.prototype.oc = create(
    'function(a){try{a==this.ha?Vkb(this):this.ka.warning("Called back with an unexpected xmlhttp")}catch(b){this.ka.debug("Failed call to OnXmlHttpReadyStateChanged_"),Wkb(this)}finally{}}',
    { Vkb: slb, Wkb: tlb },
  );
  bt.prototype.setTimeout = create('function(a){this.kH=a}');
  bt.prototype.cancel = create('function(){this.kb=!0;alb(this)}', { alb: ylb });
  bt.prototype.FY = create('function(){return this.Ha}');
  bt.prototype.getLastError = create('function(){return this.IG}');
  bt.prototype.nm = create('function(){return this.Zc}');
  dt.prototype.xD = create('function(){return this.hU==0}');
  dt.prototype.Jf = create(
    'function(a){if(this.Ca)if(this.Ca=null,this.ha.debug("startForwardChannel_"),this.hU==1){if(!a){this.ha.debug("open_()");this.Gb=Math.floor(Math.random()*1E5);a=this.Gb++;let e=new lt(this,this.ha,"",a),f=this.Na;this.Nc&&(f?(f=_.Pb(f),_.Qb(f,this.Nc)):f=this.Nc);this.Ga!==null||this.Zb||(e.ob=f,f=null);if(this.Ac)a:{var b=0;for(var c=0;c<this.oa.length;c++){b:{var d=this.oa[c];if("__data__"in d.map&&(d=d.map.__data__,typeof d==="string")){d=d.length;break b}d=void 0}if(d===void 0)break;\nb+=d;if(b>4096){b=c;break a}if(b===4096||c===this.oa.length-1){b=c+1;break a}}b=this.Wd}else b=this.Wd;b=Elb(this,e,b);c=this.ub.clone();_.Eg(c,"RID",a);_.Eg(c,"CVER",22);this.mb&&_.Eg(c,"X-HTTP-Session-Id",this.mb);Alb(this,c);f&&(this.Zb?b="headers="+_.ld(xlb(f))+"&"+b:this.Ga&&_.ylb(c,this.Ga,f));olb(this.Aa,e);this.Qh&&_.Eg(c,"TYPE","init");this.Ac?(_.Eg(c,"$req",b),_.Eg(c,"SID","null"),e.Ac=!0,Skb(e,c,null)):Skb(e,c,b);this.hU=2}}else this.hU==3&&(a?Flb(this,a):this.oa.length==0?this.ha.debug("startForwardChannel_ returned: nothing to send"):\nulb(this.Aa)||(Flb(this),this.ha.debug("startForwardChannel_ finished, sent request")))}',
    { lt: bt, Elb: bmb, Alb: Ylb, olb: Mlb, Skb: plb, ulb: Slb, Flb: cmb, xlb: () => '' },
  );
  _.ylb = () => {};
  dt.prototype.isActive = create('function(){return!!this.wa&&this.wa.isActive(this)}');
  dt.prototype.qf = create(
    'function(){this.Ja=null;Glb(this);if(this.Fd&&!this.Yb)if(this.ka==null||this.Fb<=0)this.ha.warning("Skip bpDetectionTimerId_ "+this.ka+" "+this.Fb);else{var a=4*this.Fb;this.ha.info("BP detection timer enabled: "+a);this.kb=ykb((0,_.$b)(this.Ei,this),a)}}',
    { Glb: dmb, ykb: Vkb },
  );
  dt.prototype.Ei = create(
    'function(){if(this.kb){this.kb=null;this.ha.info("BP detection timeout reached.");if(this.ka.ha!=null){let a=this.ka.ha.Ln();a&&this.ha.warning("Timer should have been cancelled : "+a)}this.ha.info("Buffering proxy detected and switch to long-polling!");this.Eb=!1;this.Yb=!0;kt(10);klb(this);Glb(this)}else this.ha.warning("Invalid operation.")}',
    { klb: Ilb, Glb: dmb, kt: () => {} },
  );
  dt.prototype.Kh = create('function(){this.Va!=null&&(this.Va=null,klb(this),llb(this),kt(19))}', {
    klb: Ilb,
    llb: Jlb,
    kt: () => {},
  });
  dt.prototype.disconnect = create(
    'function(){this.ha.debug("disconnect()");zlb(this);if(this.hU==3){var a=this.Gb++,b=this.ub.clone();_.Eg(b,"SID",this.Ua);_.Eg(b,"RID",a);_.Eg(b,"TYPE","terminate");Alb(this,b);a=new lt(this,this.ha,this.Ua,a);a.mb=2;a.Ua=_.Gg(b.clone());b=!1;if(_.fa.navigator&&_.fa.navigator.sendBeacon)try{b=_.fa.navigator.sendBeacon(a.Ua.toString(),"")}catch(c){}!b&&_.fa.Image&&((new Image).src=a.Ua,b=!0);b||(a.ha=Ukb(a.Aa,null),a.ha.send(a.Ua));a.Wa=Date.now();Tkb(a)}Blb(this)}',
    {
      lt: bt,
      Image: SyntheticImage,
      Alb: Ylb,
      Ukb: rlb,
      Tkb: (a: any) => {
        requests.push(a);
        calls.terminate++;
        qlb(a);
      },
      zlb: Xlb,
      Blb: Zlb,
    },
  );
  const hmb = create('function(a){this.ha=a}');
  hmb.prototype.isActive = create('function(){return!0}');
  hmb.prototype.ald = create('function(){this.ha.dispatchEvent("Sd")}');
  const jmb = create('function(a){Ikb.call(this);this.status=1;this.errorCode=a}', {
    Ikb: function (this: any) {
      this.type = 'Ud';
      protocolErrors.push(this);
    },
  });
  hmb.prototype.Zkd = create('function(a){this.ha.dispatchEvent(new Llb(a))}', {
    Llb: function (this: any, a: unknown) {
      this.type = 'Vd';
      this.data = a;
    },
  });
  hmb.prototype.FU = create('function(a,b){this.ha.dispatchEvent(new Mlb(b))}', { Mlb: jmb });
  _.ZJ = create(
    'class extends Error{constructor(a,b){super(b?`error code ${a}: ${b}`:`error code ${a}`);this.Vf=a}}',
  );
  hmb.prototype.JMe = create('function(){}');
  hmb.prototype.Ykd = create('function(){this.ha.dispatchEvent("Td")}');
  const fmb = create(
    'function(a,b){_.Yb.call(this);this.ha=new nt(b);this.wa=a;this.Xm=null;this.ka=b&&b.xWf||null;a=b&&b.vWf||null;b&&b.n_g&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"});this.ha.Na=a;a=b&&b.DS||null;b&&b.jBa&&(a?a["X-WebChannel-Content-Type"]=b.jBa:a={"X-WebChannel-Content-Type":b.jBa});b&&b.NDd&&(a?a["X-WebChannel-Client-Profile"]=b.NDd:a={"X-WebChannel-Client-Profile":b.NDd});this.ha.Nc=a;(a=b&&b.bdb)&&!_.ja(a)&&(this.ha.Ga=a);this.Ca=b&&b.n3a||!1;this.Aa=b&&b.L1a||\n!1;(b=b&&b.cdb)&&!_.ja(b)&&(this.ha.mb=b,a=this.ka,a!==null&&b in a&&_.Uta(this.ka,b));this.oa=new Klb(this)}',
    { nt: dt, Klb: hmb },
  );
  _.Eb = create('function(){this.r5=this.r5;this.n_a=this.n_a}');
  _.Rb = create('function(a){this.src=a;this.listeners={};this.ha=0}');
  _.Yb = create('function(){_.Eb.call(this);this.Xpa=new _.Rb(this);this.Rgf=this;this.F1c=null}');
  Object.setPrototypeOf(fmb.prototype, _.Yb.prototype);
  _.Gb = class {};
  _.Hb = create(
    'function(a,b){this.type=a instanceof _.Gb?String(a):a;this.currentTarget=this.target=b;this.defaultPrevented=this.ka=!1}',
  );
  _.Yb.prototype.zqa = create('function(){return this.F1c}');
  _.Yb.prototype.dispatchEvent = create(
    'function(a){var b,c=this.zqa();if(c)for(b=[];c;c=c.zqa())b.push(c);c=this.Rgf;var d=a.type||a;if(typeof a==="string")a=new _.Hb(a,c);else if(a instanceof _.Hb)a.target=a.target||c;else{var e=a;a=new _.Hb(d,c);_.Qb(a,e)}e=!0;var f;if(b)for(f=b.length-1;!a.ka&&f>=0;f--){var g=a.currentTarget=b[f];e=g.hbb(d,!0,a)&&e}a.ka||(g=a.currentTarget=c,e=g.hbb(d,!0,a)&&e,a.ka||(e=g.hbb(d,!1,a)&&e));if(b)for(f=0;!a.ka&&f<b.length;f++)g=a.currentTarget=b[f],e=g.hbb(d,!1,a)&&e;return e}',
  );
  _.Yb.prototype.hbb = create(
    'function(a,b,c){a=this.Xpa.listeners[String(a)];if(!a)return!0;a=a.concat();var d=!0;for(let e=0;e<a.length;++e){let f=a[e];if(f&&!f.removed&&f.capture==b){let g=f.listener,k=f.handler||f.src;f.E8a&&this.s4(f);d=g.call(k,c)!==!1&&d}}return d&&!c.defaultPrevented}',
  );
  _.ja = (a: string) => !a.trim();
  fmb.prototype.open = create(
    'function(){this.ha.wa=this.oa;this.Ca&&(this.ha.Ab=!0);this.ha.connect(this.wa,this.ka||void 0)}',
  );
  fmb.prototype.close = create('function(){this.ha.disconnect()}');
  fmb.prototype.send = create(
    'function(a){var b=this.ha;if(typeof a==="string"){var c={};c.__data__=a;a=c}else this.Aa&&(c={},c.__data__=_.Uj(a),a=c);b.oa.push(new tlb(b.Jh++,a));b.hU==3&&slb(b)}',
    {
      tlb: create('class{constructor(a,b){this.mapId=a;this.map=b;this.context=null}}'),
      slb: Qlb,
    },
  );
  _.Jlb = create('function(a,b){return new Ilb(a,b)}', { Ilb: fmb });
  _.FDb = () => {
    calls.factory++;
    return {};
  };
  _.Nr = _.Vu = _.pd = () => '';
  _.hf = (_: unknown, d: unknown) => d;
  _.JDb = create(
    'function(a,b,c={},d=!1){var e=Object.assign({},_.FDb()),f=_.Nr([]);f&&(e.Authorization=f);(f=_.Vu())&&(e["X-Goog-AuthUser"]=f);e["X-Goog-Api-Key"]=b;(b=_.hf(_.pd("PI9WOb"),""))&&(e["X-Server-Token"]=b);if(d=IDb(a,d))e["X-Origin"]=window.location.origin;return _.Jlb(a,Object.assign({},{cdb:"gsessionid",n3a:!0,L1a:!0,kId:!0},d?{}:{bdb:"$httpHeaders"},c,{DS:Object.assign({},e,c.DS||{})}))}',
    { IDb: () => false },
  );
  // Literal subscription bookkeeping with only exception reporting inert.
  const kmb = create('function(a,b){a&&(b=a.indexOf(b),0<=b&&a.splice(b,1))}');
  const mnb = create(
    'class extends Error{constructor(a){super(a?`${a.length} errors occurred during unsubscription:\n${a.map((b,c)=>`${c+1}) ${b.toString()}`).join("\\n  ")}`:"");this.errors=a;Object.setPrototypeOf(this,new.target.prototype);this.name="UnsubscriptionError"}}',
  );
  _.qt = create(
    'class{constructor(a){this.Na=a;this.closed=!1;this.wa=this.oa=null}unsubscribe(){if(!this.closed){this.closed=!0;let c=this.oa;if(Array.isArray(c))for(var a of c)a.remove(this);else c==null||c.remove(this);a=this.Na;if(_.pt(a))try{a()}catch(e){var b=e instanceof qnb?e.errors:[e]}let d=this.wa;if(d){this.wa=null;for(let e of d)try{_.pt(e)?e():e.unsubscribe()}catch(f){let g;b=(g=b)!=null?g:[];f instanceof qnb?b=[...b,...f.errors]:b.push(f)}}if(b)throw new qnb(b);}}add(a){if(a&&a!==this)if(this.closed)_.pt(a)?a():\na.unsubscribe();else{if(a instanceof _.qt){if(a.closed||a.Ha(this))return;a.Ga(this)}let b;(this.wa=(b=this.wa)!=null?b:[]).push(a)}}Ha(a){var b=this.oa;return b===a||Array.isArray(b)&&b.includes(a)}Ga(a){var b=this.oa;this.oa=Array.isArray(b)?(b.push(a),b):b?[b,a]:a}Ja(a){var b=this.oa;b===a?this.oa=null:Array.isArray(b)&&Nlb(b,a)}remove(a){var b=this.wa;b&&Nlb(b,a);a instanceof _.qt&&a.Ja(this)}}',
    { Nlb: kmb, qnb: mnb },
  );
  _.qt.ha = new _.qt();
  _.qt.ha.closed = true;
  _.pt = create('function(a){return typeof a==="function"}');
  const pnb = create(
    'class{constructor(a){this.ha=a}next(a){var b=this.ha;if(b.next)try{b.next(a)}catch(c){Qlb(c)}}error(a){var b=this.ha;if(b.error)try{b.error(a)}catch(c){Qlb(c)}else Qlb(a)}complete(){var a=this.ha;if(a.complete)try{a.complete()}catch(b){Qlb(b)}}}',
    {
      Qlb: (error: unknown) => {
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
    'Olb',
    'let snb; return snb = ' +
      'class extends _.qt{static create(a,b,c){return new _.omb(a,b,c)}constructor(a){super();this.Zs=!1;this.destination=a instanceof snb?a:new tnb(!a||_.pt(a)?{next:a!=null?a:void 0}:a);Olb(a)&&a.add(this)}next(a){this.Zs||this.Pj(a)}error(a){this.Zs||(this.Zs=!0,this.a7a(a))}complete(){this.Zs||(this.Zs=!0,this.ha())}unsubscribe(){this.closed||(this.Zs=!0,super.unsubscribe())}Pj(a){this.destination.next(a)}a7a(a){this.destination.error(a);this.unsubscribe()}ha(){this.destination.complete();this.unsubscribe()}}',
  )(_, pnb, lmb);
  _.omb = create(
    'class extends snb{constructor(a,b,c){super();var d;_.pt(a)||!a?d={next:a!=null?a:void 0,error:b!=null?b:void 0,complete:c!=null?c:void 0}:d=a;this.destination=new tnb(d)}}',
    { snb: onb, tnb: pnb },
  );
  _.Rlb = create(
    'function(a){return a.length===0?_.rt:a.length===1?a[0]:function(b){return a.reduce((c,d)=>d(c),b)}}',
  );
  _.wA = create(
    'function(a){a||(a=_.x(_.xx));var b=new _.st(c=>{if(a.dg)c.next();else return a.Uc(c.next.bind(c))});return c=>c.pipe(_.au(b))}',
  );
  _.st = create(
    'class{constructor(a){a&&(this.ha=a)}lift(a){var b=new _.st;b.source=this;b.operator=a;return b}subscribe(a,b,c){a=a&&a instanceof snb||a&&_.pt(a.next)&&_.pt(a.error)&&_.pt(a.complete)&&Olb(a)?a:new _.omb(a,b,c);b=this.operator;c=this.source;a.add(b?b.call(a,c):c?this.ha(a):this.Ca(a));return a}Ca(a){try{return this.ha(a)}catch(b){a.error(b)}}forEach(a,b){b=Slb(b);return new b((c,d)=>{var e=this.subscribe(f=>{try{a(f)}catch(g){d(g),e==null||e.unsubscribe()}},d,c)})}ha(a){var b;return(b=this.source)==\nnull?void 0:b.subscribe(a)}[Ylb](){return this}pipe(...a){return a.length?_.Rlb(a)(this):this}Qua(){var a=Slb(a);return new a((b,c)=>{var d;this.subscribe(e=>d=e,e=>c(e),()=>b(d))})}}',
    { snb: onb, Olb: lmb, Ylb: Symbol('synthetic-observable'), Slb: () => Promise },
  );
  _.Wt = create(
    'class extends _.st{constructor(){super();this.observers=[];this.hasError=this.Zs=this.closed=!1;this.oa=null}lift(a){var b=new vnb(this,this);b.operator=a;return b}ka(){if(this.closed)throw new unb;}next(a){this.ka();if(!this.Zs){let b=this.observers.slice();for(let c of b)c.next(a)}}error(a){this.ka();if(!this.Zs){this.hasError=this.Zs=!0;this.oa=a;let b=this.observers;for(;b.length;)b.shift().error(a)}}complete(){this.ka();if(!this.Zs){this.Zs=!0;let a=this.observers;for(;a.length;)a.shift().complete()}}unsubscribe(){this.Zs=\nthis.closed=!0;this.observers=null}get Ja(){var a;return((a=this.observers)==null?void 0:a.length)>0}Ca(a){this.ka();return super.Ca(a)}ha(a){this.ka();this.Aa(a);return this.Ga(a)}Ga(a){var b=this.Zs,c=this.observers;return this.hasError||b?_.qt.ha:(c.push(a),new _.qt(()=>Nlb(this.observers,a)))}Aa(a){var b=this.oa,c=this.Zs;this.hasError?a.error(b):c&&a.complete()}}',
    {
      Nlb: kmb,
      unb: Error,
      vnb: function (...args: any[]) {
        return new rnb(...args);
      },
    },
  );
  const rnb = create(
    'class extends _.Wt{constructor(a,b){super();this.destination=a;this.source=b}next(a){var b,c;(b=this.destination)==null||(c=b.next)==null||c.call(b,a)}error(a){var b,c;(b=this.destination)==null||(c=b.error)==null||c.call(b,a)}complete(){var a,b;(a=this.destination)==null||(b=a.complete)==null||b.call(a)}ha(a){var b,c;return(c=(b=this.source)==null?void 0:b.subscribe(a))!=null?c:_.qt.ha}}',
  );
  _.zt = create(
    'class extends snb{constructor(a,b,c,d,e){super(a);this.Ca=e;b&&(this.Pj=function(f){try{b(f)}catch(g){this.destination.error(g)}});c&&(this.a7a=function(f){try{c(f)}catch(g){this.destination.error(g)}this.unsubscribe()});d&&(this.ha=function(){try{d()}catch(f){this.destination.error(f)}this.unsubscribe()})}unsubscribe(){var a;this.closed||(a=this.Ca)!=null&&a.call(this);super.unsubscribe()}}',
    { snb: onb },
  );
  _.xt = create(
    'function(a){return b=>{if(_.pt(b==null?void 0:b.lift))return b.lift(function(c){try{return a(c,this)}catch(d){this.error(d)}});throw new TypeError("ch");}}',
  );
  _.Tt = create(
    'function(a){return a<=0?()=>_.It:_.xt((b,c)=>{var d=0;b.subscribe(new _.zt(c,e=>{++d<=a&&(c.next(e),a<=d&&c.complete())}))})}',
  );
  _.au = create(
    'function(a){return _.xt((b,c)=>{_.tt(a).subscribe(new _.zt(c,()=>c.complete(),void 0,_.Plb));!c.closed&&b.subscribe(c)})}',
  );
  _.tt = create(
    'function(a){if(a instanceof _.st)return a;if(a!=null){if(_.pt(a[Ylb]))return dmb(a);if(_.bmb(a))return emb(a);if(_.pt(a==null?void 0:a.then))return fmb(a);if(Symbol.asyncIterator&&_.pt(a==null?void 0:a[Symbol.asyncIterator]))return gmb(a);if(_.pt(a==null?void 0:a[Wlb]))return hmb(a)}throw amb(a);}',
    { Zlb: Symbol('synthetic-observable') },
  );
  _.Plb = create('function(){}');
  _.xx = class {};
  _.Nw = create('function(a){return(a[2]&256)===256}');
  _.cOb = create(
    'function(a,b){if(_.Nw(a))throw new _.Cw(911,!1);a[21]===null&&(a[21]=[]);a[21].push(b)}',
  );
  _.dOb = create('function(a,b){a[21]!==null&&(b=a[21].indexOf(b),b!==-1&&a[21].splice(b,1))}');
  const GOb = create(
    'class extends _.xx{constructor(){var a=_.y();super();this.Qs=a}get dg(){return _.Nw(this.Qs)}Uc(a){var b=this.Qs;_.cOb(b,a);return()=>_.dOb(b,a)}}',
  );
  let lifetime = Object.assign(Object.create(GOb.prototype), {
    Qs: Object.assign([], { 2: 0, 21: null }),
  });
  _.Kx = class {};
  _.ONb = create('function(a){if(a.dg)throw new _.Cw(-205,!1);}');
  _.cw = () => null;
  _.zWb = create(
    'class extends _.Kx{get dg(){return this.jg}constructor(a,b,c,d){super();this.parent=b;this.source=c;this.scopes=d;this.Pn=new Map;this.ixc=new Set;this.uqb=[];this.jg=!1;PNb(a,e=>yWb(this,e));this.Pn.set(vWb,KNb(void 0,this));d.has("environment")&&this.Pn.set(_.Kx,KNb(void 0,this));a=this.Pn.get(_.wWb);a!=null&&typeof a.value==="string"&&this.scopes.add(a.value);this.BWd=new Set(this.get(ANb,_.Jw,{self:!0}))}xCa(a,b){b=_.lNb(b)||0;try{return this.get(a,_.uWb,b)}catch(c){if(_.qf(c))return c;\nthrow c;}}destroy(){_.ONb(this);this.jg=!0;var a=_.cw(null);try{for(let c of this.ixc)c.Lb();let b=this.uqb;this.uqb=[];for(let c of b)c()}finally{this.Pn.clear(),this.ixc.clear(),this.BWd.clear(),_.cw(a)}}Uc(a){_.ONb(this);this.uqb.push(a);return()=>{var b=this.uqb.indexOf(a);b!==-1&&this.uqb.splice(b,1)}}get(a,b=_.uWb,c){_.ONb(this);if(Object.hasOwn(a,tWb))return a[tWb](this);c=_.lNb(c);var d=_.nf(this),e=_.Ew();try{if(!(c&4)){let r=this.Pn.get(a);if(r===void 0){let u=(typeof a==="function"||typeof a===\n"object"&&a.BZc==="InjectionToken")&&_.SMb(a);var f;if(f=u)if(u.hb){var g=_.Gw(u.hb);f=typeof g==="string"?g==="any"||this.scopes.has(g):this.BWd.has(g)}else f=!1;f?r=KNb(JNb(a),MNb):r=null;this.Pn.set(a,r)}if(r!=null)return this.u6b(r,c)}let k=c&2?_.HNb():this.parent;b=c&8&&b===_.uWb?null:b;return k.get(a,b)}catch(k){let r=k[dNb];if(r===-200||r===-201)throw new _.Cw(r,null);throw k;}finally{_.Ew(e),_.nf(d)}}Y0a(){var a=_.cw(null),b=_.nf(this),c=_.Ew();try{let d=this.get(_.BNb,_.Jw,{self:!0});for(let e of d)e()}finally{_.nf(b),\n_.Ew(c),_.cw(a)}}toString(){return"R3Injector[...]"}u6b(a,b){var c=_.cw(null);try{if(a.value===xWb)throw fNb(-200);a.value===MNb&&(a.value=xWb,a.value=a.Xa(void 0,b));var d;if(d=typeof a.value==="object"&&a.value){var e=a.value;d=e!==null&&typeof e==="object"&&typeof e.Lb==="function"}d&&this.ixc.add(a.value);return a.value}finally{_.cw(c)}}}',
  );
  if (lifecycle === 'wvb')
    lifetime = Object.assign(Object.create(_.zWb.prototype), {
      jg: false,
      uqb: [],
      ixc: new Set(),
      Pn: new Map(),
      BWd: new Set(),
    });
  _.x = () => lifetime; // Synthetic injection fallback for the original lifecycle operator.
  if (lifecycle) api.Ia = lifetime;
  _.fu = create(
    'class extends _.Wt{constructor(a){super();this.Sm=a}get value(){return this.getValue()}ha(a){var b=super.ha(a);!b.closed&&a.next(this.Sm);return b}getValue(){var a=this.oa,b=this.Sm;if(this.hasError)throw a;this.ka();return b}next(a){super.next(this.Sm=a)}}',
  );
  _.Eb = create('function(){this.r5=this.r5;this.n_a=this.n_a}');
  _.Yj = create('function(a){_.Eb.call(this);this.Ha=a;this.wa={}}');
  _.Yj.prototype.listen = create(
    'function(a,b,c,d){Array.isArray(b)||(b&&(Xta[0]=b.toString()),b=Xta);for(let e=0;e<b.length;e++){let f=_.me(a,b[e],c||this.handleEvent,d||!1,this.Ha||this);if(!f)break;this.wa[f.key]=f}return this}',
    { Xta: [] },
  );
  _.Yj.prototype.removeAll = create(
    'function(){_.Kb(this.wa,function(a,b){this.wa.hasOwnProperty(b)&&_.oe(a)},this);this.wa={}}',
  );
  // Private listener matching/removal is synthetic; public delegate bodies stay literal.
  _.Uba = create(
    'function(a,b,c,d,e){this.listener=a;this.proxy=null;this.src=b;this.type=c;this.capture=!!d;this.handler=e;this.key=++Tba;this.removed=this.E8a=!1}',
    { Tba: 0 },
  );
  _.Rb.prototype.add = create(
    'function(a,b,c,d,e){var f=a.toString();a=this.listeners[f];a||(a=this.listeners[f]=[],this.ha++);var g=Bga(a,b,d,e);g>-1?(b=a[g],c||(b.E8a=!1)):(b=new _.Uba(b,this.src,f,!!d,e),b.E8a=c,a.push(b));return b}',
    {
      Bga: (list: any[], fn: any, capture: any, owner: any) =>
        list.findIndex(
          (r) => !r.removed && r.listener === fn && r.capture === !!capture && r.handler === owner,
        ),
    },
  );
  _.Yb.prototype.listen = create('function(a,b,c,d){return this.Xpa.add(String(a),b,!1,c,d)}');
  _.Yb.prototype.s4 = create('function(a){return Cga(this.Xpa,a)}', {
    Cga: (map: any, a: any) => {
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
  _.zga = 'synthetic-event-marker';
  _.Yb.prototype[_.zga] = true;
  _.ke = create('function(a){return!(!a||!a[_.zga])}');
  _.Ed = create('function(a){var b=typeof a;return b=="object"&&a!=null||b=="function"}');
  _.Gga = create(
    'function(a){if(typeof a==="function")return a;a[Nga]||(a[Nga]=function(b){return a.handleEvent(b)});return a[Nga]}',
  );
  _.me = create(
    'function(a,b,c,d,e){if(d&&d.once)return _.le(a,b,c,d,e);if(Array.isArray(b)){for(let f=0;f<b.length;f++)_.me(a,b[f],c,d,e);return null}c=_.Gga(c);return _.ke(a)?a.listen(b,c,_.Ed(d)?!!d.capture:!!d,e):Hga(a,b,c,!1,d,e)}',
  );
  _.Kb = create('function(a,b,c){for(let d in a)b.call(c,a[d],d,a)}');
  _.oe = create(
    'function(a){if(typeof a==="number"||!a||a.removed)return!1;var b=a.src;if(_.ke(b))return b.s4(a);var c=a.type,d=a.proxy;b.removeEventListener?b.removeEventListener(c,d,a.capture):b.detachEvent?b.detachEvent(Kga(c),d):b.addListener&&b.removeListener&&b.removeListener(d);Fga--;(c=_.Iga(b))?(Cga(c,a),c.ha==0&&(c.src=null,b[Dga]=null)):Aga(a);return!0}',
  );

  const $Ed = create(
    'class{constructor(a,b,c,d,e={}){this.endpoint=a;this.apiKey=b;this.NCa=c;this.RTa=d;this.Rj=new _.Yj;this.connectedObs=this.xC=new _.fu(!1);this.z1=this.Ki=new _.Wt;this.wq=sud(this.endpoint,this.apiKey,e);this.F0a()}connect(){this.xC.value||this.wq.open()}disconnect(){this.wq.close()}send(a){this.xC.value?this.wq.send(this.NCa(a)):this.Ki.next({eventType:"channel_error",error:new _.ZJ(2,"Channel is not connected. Cannot send message")})}F0a(){this.wq&&(this.Rj.listen(this.wq,"Sd",this.jWa.bind(this)),\nthis.Rj.listen(this.wq,"Td",this.hza.bind(this)),this.Rj.listen(this.wq,"Vd",this.f$.bind(this)),this.Rj.listen(this.wq,"Ud",this.kza.bind(this)))}jWa(){this.xC.next(!0);this.Ki.next({eventType:"channel_open"})}hza(){this.Rj.removeAll();this.Ki.next({eventType:"channel_close"});this.Ki.complete();this.xC.next(!1);this.xC.complete()}f$(a){if(a.data&&Array.isArray(a.data)&&a.data.length!==0)if(a.ha==="status"){let b=_.HDb(a.data);b.mKa||this.Ki.next({eventType:"channel_error",error:new _.ZJ(1,`{status: ${b.statusCode}, message: ${b.statusMessage}}`),\nerrorDetail:JSON.stringify(a.data,void 0,2)})}else a=this.RTa(a.data[0]),this.Ki.next({eventType:"channel_message",message:a});else this.Ki.next({eventType:"channel_error",error:new _.ZJ(2,"Channel message received with empty data")})}kza(a){switch(a.status){case 1:this.Ki.next({eventType:"channel_error",error:new _.ZJ(4,"Network error")});break;case 2:this.Ki.next({eventType:"channel_error",error:new _.ZJ(3,"Server error")});break;default:this.Ki.next({eventType:"channel_error",error:new _.ZJ(2,\n"Unknown error")})}}}',
    { sud: (a: unknown, b: unknown, c: unknown) => _.JDb(a, b, c, false) },
  );
  const aFd = create(
    'class extends BHd{constructor(a,b,c,d={}){super(a,b,e=>e.serialize(),e=>_.Rh(_.Lo(c,(0,_.be)(e))),Object.assign({},{jBa:"application/json+protobuf"},d))}}',
    { BHd: $Ed },
  );
  const bFd = create(
    'class extends BHd{constructor(a,b,c,d,e={}){super(a,b,f=>_.Qg(c(f)),f=>{f=typeof f==="string"?_.Ak(f):f;return d(f)},Object.assign({},{jBa:"application/x-protobuf"},e))}}',
    { BHd: $Ed },
  );
  _.nKd = create(
    'function(a,b,c="v1/llmBidiStreamProxy",d){return new CHd(`${a.ka}/${c}`,a.ha,b,...(d!==void 0?[d]:[]))}',
    { CHd: aFd },
  );
  const EHd = create(
    'function(a,b=!1){a.Ha!==void 0&&(clearTimeout(a.Ha),a.Ha=void 0);a.hasError=a.hasError||b;a.xD=!0;a.ha=!1;a.p6=!1;a.wa.length=0;a.oa=void 0}',
    { clearTimeout: _.fa.clearTimeout },
  );
  _.iJd = create('function(a,b){return _.Ni(a,1,b)}');
  _.IJd = create('function(a,b){return _.di(a,4,_.XL,b)}');
  _.aM = create(
    'function(a){a.xD||a.p6||(a.ha?(a.p6=!0,a.connection.send(_.Rh(_.IJd(new _.JJd,_.Rh(_.iJd(new _.jJd,1))))),a.Ha=setTimeout(()=>{a.xD||a.disconnect()},2E4)):a.disconnect())}',
    { setTimeout: _.fa.setTimeout },
  );
  const IHd = create(
    'class{constructor(a,b){this.connection=a;this.hasError=this.xD=this.ha=!1;this.Aa=0;this.Na=!1;this.wa=[];this.p6=!1;this.Va=this.wB=new _.Wt;this.Ja=this.ka=new _.Wt;this.Ua=this.Ca=new _.Wt;this.Ga=(b?this.connection.z1.pipe(_.wA(b)):this.connection.z1).subscribe(c=>{switch(c.eventType){case "channel_message":c=c.message;switch(_.Xh(c,_.$L)){case 2:c=_.bi(c,_.XJd,2,_.$L);var d,e,f;if(c=(d=_.bi(c,_.RJd,7,_.ZL))==null?void 0:(e=_.bi(d,_.QJd,1,_.SJd))==null?void 0:(f=_.PJd(e))==null?void 0:_.m(f,\n_.IF,4)){d=c;e=_.AL(d);if(e==null?0:_.n(e,2)){var g;f=e.ig()||((g=this.oa)==null?void 0:g.ig())||"";this.oa=g=_.Rh(_.NI(_.MI(new _.CI,f),_.n(e,2)));f&&!e.ig()&&(d=_.Lg(d),g=_.Gh(d,_.CI,2,g),d=_.Af(g))}else this.oa&&(g=(e==null?void 0:e.ig())||this.oa.ig(),e=_.n(this.oa,2),this.oa=g=_.Rh(_.NI(_.MI(new _.CI,g),e)),d=_.Lg(d),g=_.Gh(d,_.CI,2,g),d=_.Af(g));this.wB.next(d)}break;case 4:$Jd(this);this.ka.next(void 0);this.ka.complete();this.wB.complete();this.Ga.unsubscribe();this.connection.disconnect();\nbreak;case 5:$Jd(this),this.ka.next(void 0),this.ka.complete(),this.wB.complete()}break;case "channel_error":$Jd(this,!0);this.ka.next(c.error);this.wB.Ja&&this.wB.error(c.error);break;case "channel_close":$Jd(this);this.ka.next(void 0);this.wB.complete();this.Ca.complete();this.Ga.unsubscribe();break;case "channel_open":for(this.ha=!0;this.ha&&this.wa.length>0;)g=this.wa.shift(),this.connection.send(g);this.Ca.next()}})}connect(){this.connection.connect()}disconnect(){$Jd(this);this.Ga.unsubscribe();\nthis.wB.complete();this.Ca.complete();this.ka.complete();this.connection.disconnect()}Shc(a){this.Aa++;this.Na=!0;a=_.Rh(_.zJd(new _.WL,this.Aa).Ui(a));a=_.Rh((new _.JJd).Bg(a));if(this.ha)this.connection.send(a);else{let b,c;(c=(b=this.connection).Afc)==null||c.call(b,a);this.wa.push(a)}}}',
    { $Jd: EHd },
  );
  const vKd = create(
    'function(a,b){a.ha.add(b);b.Ja.pipe(_.Tt(1)).subscribe({next:()=>{a.ha.delete(b)},complete:()=>{a.ha.delete(b)}});return b}',
  );
  _.wKd = create(
    'function(a,b,c){if(a.wa){var d=Ctd(`${a.ka.ka}/v1/conversations:processSession`);let e=_.Nr([]);c=c==null?void 0:c.DS;d=new kKd(d,{SWb:e?e:void 0,apiKey:a.ka.ha,RWb:a.oa.Xx(),DS:c});return vKd(a,new dKd(d,b))}if(a.Aa)return d=oKd(a.ka,e=>KJd(e),e=>_.Rh(YJd(e)),c),vKd(a,new dKd(d,b));d=_.nKd(a.ka,_.Kzd,"v1/processSession",c);return vKd(a,new dKd(d,b))}',
    {
      vKd,
      dKd: IHd,
      KJd: (value: any) => {
        const bytes = new TextEncoder().encode(JSON.stringify(jsonArray(value.fl, _.qb)));
        serialized.push({ message: value, data: _.Qg(bytes) });
        return bytes;
      },
      YJd: (value: any) => {
        decodeHook();
        decoded = incoming ?? value;
        return decoded;
      },
      oKd: (a: any, b: any, c: any, d: any) => new bFd(`${a.ka}/v1/processSession`, a.ha, b, c, d),
    },
  );
  const metadata = {};
  api.Ga = new Map();
  api.ka = { handleError() {} };

  // Original shared native preparation/recovery; timer, network and metrics leaves are invented.
  const metric = { increment() {}, Pd() {} };
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
  _.tKd = Symbol('synthetic-native-route');
  _.OKd = nativeRecoveryFlag;
  _.PKd = rpcRecoveryFlag;
  const settings = { Ea: (flag: unknown) => flag === _.tKd || flag === nativeRecoveryFlag };
  const SharedService = create(
    'class{constructor(){this.Da=_.x(_.Nz);this.Aa=_.x(_.bM);this.ka=_.x(_.YKd);this.Ca=_.x(_.QL);this.Ga=_.x(_.GA);this.oa=_.x(_.TL);this.ha=_.x(IKd);this.Gc=_.x(_.yK);this.zr=_.x(_.gL);this.Ha=_.x(_.xK);this.requestSource=_.FA(this.Ga);this.uv=_.Z(this.zr.JQ,{initialValue:{id:null,IB:null}});this.Oga=_.Z(this.Ha.Ja,\n{initialValue:!1})}get wa(){return this.Da.Ea(_.tKd)}get WHa(){return this.wa?this.Da.Ea(_.OKd):this.Da.Ea(_.PKd)}reset(){this.ka.reset()}}',
    {},
  );
  const network = new _.Wt();
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
  _.yw = (project: Function) => (input: any) =>
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
  _.Lt = _.rw = () => (input: any) => input;
  _.Mt = (recover: Function) => (input: any) =>
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
  _.Rzd = (error: any) => error?.syntheticNetwork === true;
  _.Tzd = () => 'SYNTHETIC_NETWORK';
  const OHd = create(
    'function(a){return _.Gt(0,2E3).pipe(_.yw(()=>a.kbe(5E3)),_.Kt(Boolean),_.Tt(1),_.Lt({first:6E4}),_.v(()=>{}))}',
  );
  const UJd = create('function(a){a=a.Da.Ea(QKd);return a>0?a:1500}', {
    QKd: Symbol('synthetic-probe-delay'),
  });
  const VJd = create(
    'function(a,b,c,d="UNKNOWN"){var e=a.ha.getValue().status;if(e==="WAITING_FOR_NETWORK"||e==="RECONNECTING")return _.t(!1);if(!b.isEligible)return a.ha.next({status:"FAILED",Ae:c}),_.t(!1);if(a.oa>=4)return EKd(a.wa,"MAX_ATTEMPTS_EXCEEDED"),a.ha.next({status:"FAILED",Ae:c}),_.t(!1);a.oa++;a.ha.next({status:"WAITING_FOR_NETWORK",Ae:c});var f=performance.now();return EId(a.Aa).pipe(_.rw(TKd(a)),_.v(()=>{var g=Math.round(performance.now()-f),k=a.wa;k.Ca.Pd(g,d,k.requestSource);a.ha.next({status:"RECONNECTING",\nAe:c});return!0}),_.Mt(()=>{EKd(a.wa,"PROBE_TIMEOUT");a.ha.next({status:"FAILED",Ae:c});return _.t(!1)}))}',
    { EId: OHd, TKd: UJd, EKd() {}, performance: { now: () => now } },
  );
  const NJd = create('function(a){a.ka=!1;a.Aa=!1}');
  const MJd = create('function(a,b){a.oa=b}');
  const WJd = create(
    'function(a){var b=a.Da.Ea(RKd);b=b>0?b:1500;var c=Math,d=c.max,e=a.Da.Ea(SKd);c={attempt:a.ka,Qjf:b,DVf:d.call(c,b,e>0?e:4E3)};a=Math.max(0,c.attempt);var f;b=(f=c.Qjf)!=null?f:500;var g;f=(g=c.DVf)!=null?g:4E3;var k;g=(k=c.t4g)!=null?k:2;var r;k=Math.max(0,Math.min(1,(r=c.q3g)!=null?r:.2));var u;r=(u=c.h6g)!=null?u:Math.random;u=Math.min(f,b*Math.pow(g,a));r=1-k+2*k*r();return Math.max(0,Math.min(f,Math.round(u*r)))}',
    { RKd: Symbol('synthetic-retry-base'), SKd: Symbol('synthetic-retry-max') },
  );
  const dKd = create(
    'function(a,b,c,d){var e=b.request,f=c.getState().conversationId||e.conversationId;c=a.ka;c=c.oa===0?0:1+c.ka;c=Object.assign({},e,{conversationId:f,sib:"RECONNECT_TO_EXISTING_TURN"},c>0?{Pce:c}:{});var g,k;b=_.Ryd(Object.assign({},b,{request:c}),a.requestSource,a.Gc,a.Aa,(k=(g=a.uv())==\nnull?void 0:g.id)!=null?k:void 0,!e.dLa&&a.Oga(),!1,a.Ca.isSupported());a=_.Rh(_.txd(new _.vL,f));a=_.Hxd(b,a);_.Vh(a,3);(d=d==null?void 0:_.m(d,yL,109))&&_.Gh(b,yL,109,d);return{Mee:b,Nee:c}}',
    { yL: class extends _.l {} },
  );
  const OJd = create(
    'class{constructor(){this.conversationId="";this.wa=this.Aa=this.ka=this.ha=this.RL=this.committed=!1}cq(){var a;(a=this.Ca)==null||a.unsubscribe();var b;(b=this.oa)==null||b.call(this)}isEligible(){return this.committed&&!this.RL}getState(){return{conversationId:this.conversationId,\nisEligible:this.isEligible(),RL:this.RL,sib:this.isEligible()?"RECONNECT_TO_EXISTING_TURN":"NEW_REQUEST",committed:this.committed}}}',
  );
  const sharedService = Object.assign(Object.create(SharedService.prototype), {
    Da: settings,
    ha: sharedMetrics,
    oa: {},
    requestSource: 1,
    Gc: {},
    Aa: false,
    uv: () => undefined,
    Oga: () => false,
    Ca: { isSupported: () => false },
    ka: {
      Da: settings,
      wa: sharedMetrics,
      Aa: { kbe: () => network },
      oa: 0,
      ka: 0,
      ha: new _.fu({ status: 'IDLE', Ae: approved.storeId }),
      reset() {
        this.oa = this.ka = 0;
      },
    },
  });
  const YJd = create(
    'function(a,b,c,d,e,f,g,k){var r=c.request;if(a.ka.ka<4){b=a.ka.ka;g=VKd(a.ka);a.ka.ka++;FKd(a.ha,f,b);GKd(a.ha,g,f,b);d.wa=!0;d.cq();MKd(d);let {Mee:u,Nee:w}=eLd(a,c,d,k),B=_.Gt(g).subscribe(()=>{d.wa=!1;var C=e(u,w);d.oa=C});LKd(d,()=>\n{B.unsubscribe()})}else d.wa=!1,HKd(a.ha,f),$Kd(a,r.Ae,r.clientTurnId),b.error(aLd(g!=null?g:Error("xk")))}',
    {
      VKd: WJd,
      eLd: dKd,
      MKd: NJd,
      LKd: MJd,
      FKd() {},
      GKd() {},
      HKd() {},
      $Kd() {},
      aLd: (value: unknown) => value,
    },
  );
  const aKd = create(
    'function(a,b,c,d,e,f,g){var k=d.request,r=e.getState();e.ha=!0;var u=_.Tzd(b);r=UKd(a.ka,r,k.Ae,u).subscribe({next:w=>{if(w){w=a.oa;var B=k.clientTurnId;\n_.RL(w,B,"logReconnectAttemptStarted")&&w.ha.log({flow:1,step:190,tag:B});e.cq();MKd(e);let {Mee:C,Nee:G}=eLd(a,d,e,g);w=f(C,G);e.oa=w}else c.error(aLd(b))},error:()=>{XKd(a.ka,k.Ae);c.error(aLd(b))}});e.Ca=r}',
    { UKd: VJd, MKd: NJd, eLd: dKd, XKd() {}, aLd: (value: unknown) => value },
  );
  const bKdOriginal = create(
    'function(a,b,c,d,e,f){var g=c.request;return{next:k=>{var r,u,w=_.Dtd(k)?(r=k.response)==null?void 0:(u=r.Vc)==null?void 0:u.c7f:void 0;if(w==="SESSION_NOT_FOUND_TO_RECONNECT")ZKd(a,b,c,d,e,"RESPONSE_METADATA",void 0,f);else if(w==="NOT_ELIGIBLE_TO_RECONNECT")d.ka=!0,d.cq(),$Kd(a,g.Ae,g.clientTurnId),b.error(aLd(Error("wk")));else if(w==="TURN_ALREADY_EXISTS")k=a.ha,r=k.getEnvironment(),k.Ga.increment(r,k.requestSource),JId(a.oa,g.clientTurnId),WKd(a.ka,g.Ae),(k=d.getState().conversationId||\ng.conversationId)&&b.next({responseType:"RECONNECT_TURN_ALREADY_EXISTS",conversationId:k,turnId:g.clientTurnId}),b.complete();else{r=g.Ae;u=g.clientTurnId;if(d.ha&&!d.Aa){d.Aa=!0;w=a.ha;let B=w.getEnvironment();w.Ja.increment(B,w.requestSource);JId(a.oa,u);WKd(a.ka,r)}b.next(k)}},error:k=>{if(!d.ka)if(a.WHa&&Szd(k))d.ka=!0,ZKd(a,b,c,d,e,"RPC_ERROR",k,f);else{d.ka=!0;if(_.Rzd(k)){var r=_.Tzd(k),u=a.ha;u.Aa.increment(r,u.requestSource);u=a.ha;var w;let C=Mzd((w=u.document.defaultView)!=null?w:void 0);\nvar B;w=Nzd((B=u.document.defaultView)!=null?B:void 0);u.Wa.increment(C,w,r,u.requestSource);a.WHa?d.ha?DKd(a.ha,!1,"ALREADY_RECONNECTED"):d.isEligible()?DKd(a.ha,!0):DKd(a.ha,!1,d.committed?d.RL?"MUTATING_TOOL_USED":d.ha?"ALREADY_RECONNECTED":"UNKNOWN_ELIGIBILITY_REASON":"COMMIT_NOT_SENT"):DKd(a.ha,!1,"FLAG_DISABLED")}a.WHa&&!d.ha&&_.Rzd(k)&&d.isEligible()?bLd(a,k,b,c,d,e,f):(r=g.Ae,B=g.clientTurnId,d.ha&&(u=_.Rzd(k)?"NETWORK_ERROR_ON_RETRY":"SERVER_ERROR_ON_RETRY",EKd(a.ha,u),JId(a.oa,B),XKd(a.ka,\nr)),b.error(_.Rzd(k)||d.ha?aLd(k):k))}},complete:()=>{d.wa||b.complete()}}}',
    {
      ZKd: YJd,
      bLd: aKd,
      JId() {},
      WKd: create(
        'function(a,b){a.oa=0;a.ka=0;b=b!=null?b:a.ha.getValue().Ae;a.ha.next({status:"SUCCESS",Ae:b})}',
      ),
      $Kd() {},
      aLd: (value: unknown) => value,
      DKd() {},
      EKd() {},
      Mzd() {},
      Nzd() {},
      XKd() {},
      Szd: () => false,
    },
  );
  _.pL = create('function(a){return Ftd.includes(a)}', { Ftd: [40, 41, 35] });
  const cKd = create(
    'function(a,b,c,d,e){var f=new NKd;if(_.pL(c.request.ff))return e(b,c.request,d,f);a.ka.reset();var g=cLd(a,d,c,f,(k,r)=>e(k,r,g,f),b);a=e(b,c.request,g,f);f.oa=a;return()=>{f.cq()}}',
    {
      NKd: OJd,
      cLd: (...args: any[]) => {
        sharedState = args[3];
        sharedRetry = args[4];
        sharedObserver = bKdOriginal(...args);
        return sharedObserver;
      },
    },
  );
  api.Wd = sharedService;
  api.Eb = Object.assign(Object.create(_.zKd.prototype), {
    ha: {},
    wa: selectedMode,
    ka: { Ht: () => false },
    oa: {},
  });
  _.Srd = () => ({});
  _.wyd = () => false;
  _.cDb = () => {
    beforeFactory();
    return metadata;
  };
  _.yKd = create(
    'function(a,b){var c=_.Srd(a.ha,void 0,{modeId:b.ri,isTemporaryChat:b.isTemporaryChat,X6b:!0,NZa:b.NZa}),d=a.wa.ha;return _.cDb({bardApplicationMetadata:c,requestSource:b.requestSource,clientTurnId:b.clientTurnId,isEnterpriseForGooglers:a.ka.Ht(),enableBlueStarAgency:_.wyd(a.oa),enableUniversalCartAgency:d===43,enableBlueRemyAgency:d===42||d===67})}',
  );
  _.hGd = create('function(a){return _.m(a,_.DI,3)}');
  _.tL = create('function(a){return _.m(a,_.Ywd,1)}');
  _.ti = (value: any, field: number) => value.fl[field - 1] ?? 0;
  _.Dtd = (value: any) => value?.responseType === 'TURN';
  _.Hxd = (value: any, continuation: any) => {
    value.fl[71] = continuation;
    return value;
  };
  _.txd = (value: any, cid: unknown) => {
    value.fl[0] = cid;
    return value;
  };
  _.RL = () => false;
  const hyd = create(
    'function(a){if(!a)return"UNSPECIFIED";switch(a){case 1:return"SESSION_RECONNECTED";case 2:return"SESSION_NOT_FOUND_TO_RECONNECT";case 3:return"NOT_ELIGIBLE_TO_RECONNECT";case 4:return"TURN_ALREADY_EXISTS";default:return"UNSPECIFIED"}}',
  );
  // Native70: exact saved producer/projector bodies; no saved artifact is loaded at runtime.
  // Synthetic boundaries: scalar/repeated materialization, absent optional DTO metadata,
  // qVc's proved missing key2, metrics, UI and settings services (not a provider decoder).
  const absent = (value?: any) => {
    const raw = value instanceof _.l ? value.fl : value;
    if (raw != null && (!Array.isArray(raw) || raw.some((entry: unknown) => entry != null)))
      throw Error('synthetic-optional-leaf-refused');
    return undefined;
  };
  if (!_.Yd) {
    const empty: any[] = [];
    Object.defineProperty(empty, _.La, { value: 7 });
    _.Yd = Object.freeze(empty);
  }
  const repeatedHelpers: Record<string, any> = {};
  repeatedHelpers.Joa = create('function(a){return!!(2&a)&&!!(4&a)||!!(256&a)}', repeatedHelpers);
  repeatedHelpers.Ng = create('function(a,b){return a=(2&b?a|2:a&-3)&-273}', repeatedHelpers);
  repeatedHelpers.Loa = create(
    'function(a,b,c){a=_.de(a,b,c);return Array.isArray(a)?a:_.Yd}',
    repeatedHelpers,
  );
  repeatedHelpers.Moa = create('function(a,b){2&b&&(a|=2);return a|1}', repeatedHelpers);
  repeatedHelpers.Koa = create(
    'function(a,b,c,d,e,f,g,k,r){var u=b,w=Joa(b);w&&g===2&&(a=[...a],u=0,b=Ng(b,d),d=_.xb(c,d,e,a,f),w=!1);w||(g===1||(g!==4?0:2&b||!(16&b)&&32&d)?(b|=!a.length||k&&!(4096&b)||32&d&&!(4096&b||16&b)?2:256,b!==u&&(a[_.La]=b),Object.freeze(a)):(r||(b|=16),b!==u&&(a[_.La]=b)));2&b||!(4096&b||16&b)||_.Mg(c,d);return a}',
    repeatedHelpers,
  );
  _.Roa = create(
    'function(a,b,c,d,e,f,g,k,r){f=f&&f!==4?f!==1&&_.Ra(a,c)?1:f:4;k=!!k||f===3;var u=!!r&&!_.Ra(a,c);(f===2||u)&&_.ub(a)&&(b=a.fl,c=b[_.La]|0);a=Loa(b,e,g);var w=a===_.Yd?7:a[_.La]|0,B=Moa(w,c);if(r=!(4&B)){var C=a,G=c;let N=!!(2&B);N&&(G|=2);let T=!N,aa=!0,da=0,ta=0;for(;da<C.length;da++){let ya=_.Hoa(C[da],d,!1,G);if(ya instanceof d){if(!N){let Ca=_.Ra(ya);T&&(T=!Ca);aa&&(aa=Ca)}C[ta++]=ya}}ta<da&&(C.length=ta);B|=4;B=aa?B&-4097:B|4096;B=T?B|8:B&-9}B!==w&&(a[_.La]=B,2&B&&Object.freeze(a));if(u&&\n!(8&B||!a.length&&(f===1||(f!==4?0:2&B||!(16&B)&&32&c)))){Joa(B)&&(a=[...a],B=Ng(B,c),c=_.xb(b,c,e,a,g));d=a;u=B;for(w=0;w<d.length;w++)C=d[w],B=_.Lg(C),C!==B&&(d[w]=B);u|=8;B=u=d.length?u|4096:u&-4097;a[_.La]=B}return a=Koa(a,B,b,c,e,g,f,r,k)}',
    repeatedHelpers,
  );
  _.ci = create('function(a,b,c,d,e){var f=a.fl;return _.Roa(a,f,f[_.La]|0,b,c,d,e,!1,!0)}');
  _.FF = create('class extends _.l{constructor(a){super(a)}}');
  _.GF = create('function(a){return _.ci(a,_.FF,5)}');
  _.nG = create('function(a){return _.m(a,_.$v,13)}');
  _.Wg = (value: unknown) => value;
  _.gh = create(
    'function(a,b,c,d,e,f,g){var k=a.fl,r=k[_.La]|0;d=d&&d!==4?d!==1&&_.Ra(a,r)?1:d:4;e=!!e||d===3;d===2&&_.ub(a)&&(k=a.fl,r=k[_.La]|0);var u=Loa(k,b,g),w=u===_.Yd?7:u[_.La]|0,B=Moa(w,r);var C=B;4&C?f==null?a=!1:(!e&&f===0&&(512&C||1024&C)&&(a.constructor[Npa]=(a.constructor[Npa]|0)+1)<5&&_.Xaa(),a=f===0?!1:!(f&C)):a=!0;if(a){f!==void 0&&4&B&&(u=[...u],w=0,B=Ng(B,r),r=_.xb(k,r,b,u,g));let G=C=0;for(;C<u.length;C++){let N=c(u[C]);N!=null&&(u[G++]=N)}G<C&&(u.length=G);c=(B|4)&-513;B=c&=-1025;f&&(B|=\nf);B&=-4097}B!==w&&(u[_.La]=B,2&B&&Object.freeze(u));return u=Koa(u,B,k,r,b,g,d,a,e)}',
    repeatedHelpers,
  );
  _.Ek = create('function(a,b,c,d,e){return _.gh(a,b,_.Wg,c,e,void 0,d)}');
  _.Qh = create('function(a,b,c,d){var e=a.fl;return _.Roa(a,e,e[_.La]|0,b,c,1,d)}');
  _.oi = _.ti;
  _.li = _.n;
  _.Dk = _.Si;
  _.ni = (value: any, field: number) => {
    const scalar = _.de(value.fl, field);
    return scalar === true || scalar === 1;
  };
  _.n = (value: any, field: number) => _.de(value.fl, field) ?? '';
  _.ge = _.Si = (value: any, field: number) => _.de(value.fl, field) != null;
  _.ti = (value: any, field: number) => _.de(value.fl, field) ?? 0;
  for (const name of [
    'qH',
    'oH',
    'gH',
    'dH',
    'VH',
    'g1c',
    'i1c',
    'iL',
    'f1c',
    'Q0c',
    'l1c',
    'Gyd',
    'Uwd',
    'c1c',
    'rsd',
    'QG',
    'a_c',
    'UH',
    'q_c',
    'F_c',
    'XRc',
  ])
    _[name] ??= class extends _.l {};
  _.IF.prototype.ha = create('class{ha(){return _.n(this,20)}}').prototype.ha;
  _.IF.prototype.ka = () => undefined;
  _.$Zc.prototype.getText = create('class{getText(){return _.n(this,1)}}').prototype.getText;
  _.gH.prototype.getText = create('class{getText(){return _.n(this,3)}}').prototype.getText;
  _.qH.prototype.getMetadata = create('class{getMetadata(){return _.m(this,N4c,2)}}', {
    N4c: QGd,
  }).prototype.getMetadata;
  _.oH.prototype.getText = create(
    'class{getText(){return _.xi(this,_.gH,2,_.pH)}}',
  ).prototype.getText;
  _.Zh = create('function(a,b,c){return _.ge(a,_.Yh(a,c,b))}');
  _.xi = create('function(a,b,c,d){return _.m(a,b,_.Yh(a,d,c),void 0)}');
  const MVc = Symbol('synthetic-singleton-format');
  let singletonFormat = false;
  _.vz = () => ({ Ea: (flag: unknown) => flag === MVc && singletonFormat });
  const Nyd = class extends _.l {};
  const dtoConstructors = Object.fromEntries(
    [
      'TZc',
      'XZc',
      'YZc',
      'ZZc',
      'f_c',
      'h_c',
      'k_c',
      'n_c',
      'p_c',
      'r_c',
      's_c',
      'u_c',
      'v_c',
      'A_c',
      'B_c',
      'I_c',
      'J_c',
      'p1c',
      'hGc',
      'HGc',
    ].map((name) => [name, class extends _.l {}]),
  );
  dtoConstructors.p1c = create(
    'class extends _.l{constructor(a){super(a)}getState(){return _.ti(this,1)}setState(a){return _.Ni(this,1,a)}}',
  );
  const dtoLeaves: Record<string, any> = {
    RZc: (a: any) => absent(_.de(a.fl, 34)),
    SZc: (a: any) => absent(_.de(a.fl, 34)),
    VZc: (a: any) => absent(_.nG(a)),
    WZc: (a: any) => absent(_.nG(a)),
    b_c: absent,
    TQc: () => undefined,
    fRc: absent,
    kRc: absent,
    c_c: absent,
    d_c: absent,
    e_c: () => undefined,
    ZLc: (_ids: unknown, value: unknown) => absent(value),
    bVc: absent,
    dVc: absent,
    gVc: absent,
    i_c: absent,
    g_c: absent,
    w_c: absent,
    j_c: () => undefined,
    l_c: absent,
    m_c: absent,
    o_c: absent,
    sRc: absent,
    t_c: absent,
    x_c: absent,
    sQc: absent,
    zRc: absent,
    z_c: absent,
    C_c: absent,
    E_c: () => [],
    G_c: () => [],
    H_c: absent,
    gKc: absent,
    K_c: () => undefined,
    Tyd: (_rid: string, value: unknown) => absent(value),
    OVc: absent,
    vXc: (values: unknown[]) => {
      absent(values);
      return [];
    },
    UG: () => ({ nodeType: 21 }),
  };
  const sourceHelpers: Record<string, any> = {
    ...dtoConstructors,
    ...dtoLeaves,
    Zyd: Nyd,
    PVc: MVc,
    tVc: Object.freeze({}),
  };
  // Uzd literal SHA256 9b7d2cec077fd7249ca379bf508c70d3098908b5f234d5454c9d799445bf663b.
  sourceHelpers.gAd = create(
    'function(a,b,c,d){var e=_.AL(a);a=e==null?void 0:_.n(e,2);var f;e=(f=e==null?void 0:e.ig())!=null?f:"";d=d&&_.ti(b,50)===26;f=!!a&&!!c.ej&&!c.yj&&!_.Etd(c)&&a===_.Wwd(c.ej);b=_.m(b,_.Gyd,79);var g;b=!!(b==null?0:(g=_.m(b,_.Uwd,2))==null?0:_.ie(g,_.fAd));(d||b||f)&&a&&c.yg!==void 0&&(a=`${a}_actuate_turn_${c.yg}`);return{cOb:a,conversationId:e}}',
    sourceHelpers,
  );
  // oKd literal SHA256 cc4423fd47c86a8be2cceed50c1e87425d0c5ecffff7b0eaff2a41b1027b0858.
  sourceHelpers.JKd = create(
    'function(a,b){a.committed=!0;b&&(a.conversationId=b)}',
    sourceHelpers,
  );
  // pKd literal SHA256 fab6dcd2cacf5e85510cf51169ff7e63a694be178f9ab63eb9c49bd2986d7c01.
  sourceHelpers.KKd = create(
    'function(a,b){var c=_.m(b,_.VH,7);c=!(c==null||!_.ni(c,4))||!(c==null||!_.ge(c,2));if(_.ci(b,_.dH,13).length>0||_.Zh(b,49,_.HF)||c)a.RL=!0}',
    sourceHelpers,
  );
  // Wzd literal SHA256 6cd480f4c7ab0c813b57d804bf79006e73c7c164be6dd9ee4769858e62824811.
  sourceHelpers.iAd = create(
    'function(a,b){var c=a.ka();if(_.ge(a,8)&&c)return c=_.Vsd(c),b&&b.extend(a,c),c}',
    sourceHelpers,
  );
  // XLd literal SHA256 03832a2a2a22ef40cd022e772082f79701a66d6671a5e8cd441d9b70f25f1967.
  sourceHelpers.rMd = create('function(a){return(a=_.m(a,_.VH,7))?_.OYc([a]):[]}', sourceHelpers);
  // dAd literal SHA256 d35e6a1abdaf95be4be9bbdeb5dce5f24f8c532f1ca7fc0521a248ff6aa746d8.
  sourceHelpers.qAd = create(
    'function(a,b){var c,d=((c=a.u0)==null?void 0:c.type)===3;a.u0&&!d&&(b.kBc=a.u0);a.yA&&(b.jBc=a.yA);var e;((e=a.yA)==null?void 0:e.H8)!==void 0&&(b.iBc=a.yA.H8);c=!!a.u0||!!a.yA;!a.u0&&b.kBc&&(a=Object.assign({},a,{u0:b.kBc}));b.jBc&&!a.yA&&(a=Object.assign({},a,{yA:b.jBc}));a.yA&&!a.yA.H8&&b.iBc&&(a=Object.assign({},a,{yA:Object.assign({},a.yA,{H8:b.iBc})}));return Object.assign({},a,{D8b:!c})}',
    sourceHelpers,
  );
  // Rzd literal SHA256 7078c7b4ff38b0d81382d84ac062ef12f526d865d71c91649aa0ce2f431475b3.
  sourceHelpers.dAd = create(
    'function(a){if(a){var b=Xzd(_.m(a,Yzd,2)),c=Zzd(_.m(a,$zd,3)),d=aAd(_.m(a,bAd,5));return Object.assign({},{zkc:1,qqg:_.ci(a,cAd,1).filter(e=>_.Si(e,1)).map(e=>_.n(e,1))},b?{j6f:b}:{},c?{f3f:c}:{},d?{oSf:d}:{},_.Dk(a,4)?{U8f:_.ni(a,4)}:{})}}',
    sourceHelpers,
  );
  // bAd literal SHA256 f8dd93d3db62ccd9dbc3194593473c47abf19b19d15b29a71125742ec6bea5ba.
  sourceHelpers.oAd = create(
    'function(a,b){return(a=(a=_.ti(a,59))?_.BF(a):void 0)&&a!=="MODE_CATEGORY_UNSPECIFIED"?a:(b=b==null?void 0:_.oi(b,2))?_.BF(b):void 0}',
    sourceHelpers,
  );
  // cAd literal SHA256 af6fc7d364f37707aeb326a9c6c28e04e3e4310283f5b54451c2a46627ccbd07.
  sourceHelpers.pAd = create(
    'function(a,b){a=_.ti(a,60);if(a!==void 0&&a!==0)return _.CF(a);b=b==null?void 0:_.oi(b,6);if(b!==void 0&&b!==0)return _.CF(b)}',
    sourceHelpers,
  );
  // Kyd literal SHA256 ca1510c8c65a9bbae5dc52ae7a87e1a1f18f7625d8c40f4b627f563e4df6a7df.
  sourceHelpers.Wyd = create(
    'function(a){if(a)switch(a){case 1:return 1;case 2:return 2;case 3:return 3;case 4:return 4;case 5:return 5;case 6:return 6;case 7:return 7;case 8:return 8}}',
    sourceHelpers,
  );
  // Lyd literal SHA256 58c8a2bb4adc0b83918a307f28dbb9dbfcfd6edf2ef5db291d6f184add6db465.
  sourceHelpers.Xyd = create(
    'function(a){if(a)switch(a){case 1:return 1;case 2:return 2;case 3:return 3}}',
    sourceHelpers,
  );
  // RZc literal SHA256 59d9e2cba991b630cfdfd482fb25609523bae932d8bbdc675e9d95fea1532863.
  sourceHelpers.UZc = create(
    'function(a,b,c){if(b===0&&c.type===0&&_.ni(c.proto,11)&&!_.ni(c.proto,10,!0))return"STOPPED";var d;a=(d=_.m(a,p1c,9))==null?void 0:d.getState();if(a===void 0)return"COMPLETE";switch(a){case 2:case 0:return"COMPLETE";case 1:return"PARTIAL";default:return"COMPLETE"}}',
    sourceHelpers,
  );
  // rVc literal SHA256 184f5884601ec1535bdecd2c433a60bbe5ffbb9b5854108ce5dea2efa76ade88.
  sourceHelpers.uVc = create(
    'function(a,b){var c=tVc[_.Xh(a,_.pH)];if(c)return a=c.Uo(a),(b=c.Qo(a,b))?{nodeType:0,jk:[b]}:UG()}',
    sourceHelpers,
  );
  // SWc literal SHA256 c553ff5304455240256a1ac04cf3c7f9d04ecc7a090aa741a8f67c0bce65271c.
  sourceHelpers.VWc = create(
    'function(a){if(!a)return UG();var b=_.ci(a,hGc,4);b=vXc(b);var c=_.oi(a,2);return Object.assign({},{nodeType:18,text:a.getText()},b.length&&{annotations:b},c&&{oL:c})}',
    sourceHelpers,
  );
  // pI literal SHA256 203ec75137f75ac462aa71b877e7504f5d3bec1ca2cd77ded1a22193c942e1e5.
  sourceHelpers.pI = create(
    'function(a,b,c=[]){var d=uVc(a,b);if(d)return d;switch(_.Xh(a,_.pH)){case 68:return aWc(_.xi(a,bWc,68,_.pH),c.join("-"),b);case 58:return cWc(_.xi(a,_.dWc,58,_.pH),c.join("-"),b);case 74:return eWc(_.xi(a,fWc,74,_.pH),c.join("-"));case 75:return gWc(_.xi(a,_.hWc,75,_.pH),c.join("-"));case 9:return NTc(_.xi(a,iWc,9,_.pH));case 61:return _.vz().Ea(_.DBc)?jWc(_.xi(a,_.kWc,61,_.pH),c.join("-")):UG();case 51:return lWc(_.xi(a,GVc,51,_.pH),c.join("-"));case 52:return mWc(_.xi(a,_.HVc,52,_.pH),c.join("-"),\nb);case 4:return nWc(a.Fg());case 15:return oWc(_.xi(a,pWc,15,_.pH),b);case 69:return qWc(_.xi(a,rWc,69,_.pH),c.join("-"));case 86:return sWc(_.xi(a,tWc,86,_.pH),c.join("-"));case 16:return uWc(_.xi(a,vWc,16,_.pH),b);case 65:return _.vz().Ea(_.GBc)?wWc(_.xi(a,xWc,65,_.pH),c.join("-")):UG();case 89:return _.vz().Ea(_.yWc)?zWc(_.xi(a,_.AWc,89,_.pH),c.join("-")):UG();case 90:return BWc(_.xi(a,NVc,90,_.pH),c.join("-"));case 76:return CWc(_.xi(a,_.DWc,76,_.pH),c.join("-"));case 60:return _.vz().Ea(_.HBc)?\nEWc(_.xi(a,FWc,60,_.pH),b,c):UG();case 39:return GWc(_.xi(a,HWc,39,_.pH));case 3:return IWc(a,b);case 10:return JWc(a,f=>{var g;return(g=_.xi(f,wGc,10,_.pH))==null?void 0:_.ci(g,_.nH,1)},(f,g)=>{var k=b.responseId,r=b.AP;var u=_.m(f,KWc,12);u={Okb:u==null?void 0:_.ni(u,1),e2g:u==null?void 0:_.ni(u,2)};return _.ZPc(f,g,k,r,u)});case 14:return LWc(_.xi(a,iHc,14,_.pH),b);case 35:return MWc(_.xi(a,KGc,35,_.pH));case 24:return{nodeType:13};case 13:return NWc(_.xi(a,UGc,13,_.pH),b);case 17:return OWc(_.xi(a,\nkHc,17,_.pH),b);case 73:return PWc(_.xi(a,QWc,73,_.pH),c.join("-"),b);case 22:return RWc(_.xi(a,mHc,22,_.pH),b);case 56:return SWc(_.xi(a,TWc,56,_.pH),c.join("-"),b);case 11:return UWc(_.xi(a,aHc,11,_.pH),b);case 2:return VWc(a.getText());case 20:return WWc(_.xi(a,XWc,20,_.pH));case 12:return YWc(_.xi(a,XGc,12,_.pH),b);case 71:return ZWc(_.xi(a,LVc,71,_.pH),c.join("-"));case 62:return $Wc(_.xi(a,KVc,62,_.pH),c.join("-"));case 66:return aXc(_.xi(a,bXc,66,_.pH),c.join("-"),b);case 67:return cXc(_.xi(a,\ndXc,67,_.pH),c.join("-"),b);case 88:return eXc(_.xi(a,fXc,88,_.pH),c.join("-"),b,c);case 21:let e;return((e=_.xi(a,_.SVc,21,_.pH))==null?void 0:_.ti(e,2))===2?gXc(a,b):JWc(a,f=>{var g;return(g=_.xi(f,_.SVc,21,_.pH))==null?void 0:_.ci(g,_.hXc,1)},(f,g)=>_.qQc(f,b.responseId,g));case 77:return iXc(_.xi(a,jXc,77,_.pH),c.join("-"));case 80:return _.vz().Ea(_.PBc)?kXc(_.xi(a,_.lXc,80,_.pH),c.join("-")):UG();case 84:return mXc(_.xi(a,_.sI,84,_.pH),b,c);case 83:return nXc(_.xi(a,oXc,83,_.pH),c.join("-"));\ncase 91:return pXc(_.xi(a,qXc,91,_.pH),b);case 93:return rXc(_.xi(a,sXc,93,_.pH),c.join("-"));case 94:return _.vz().Ea(_.LA)?tXc(_.xi(a,uXc,94,_.pH),c.join("-")):UG();default:return UG()}}',
    sourceHelpers,
  );
  // NVc literal SHA256 03276a613376f68325765c0b95b34a685574ed5cd11276387340790510e52174.
  sourceHelpers.QVc = create(
    'function(a,b){var c=[];for(let f=0;f<a.length;f++){var d=a[f],e=pI(d,b,[f]);let g,k=_.Xh(d,_.pH)===49&&((g=_.xi(d,RVc,49,_.pH))==null?void 0:_.ti(g,5))===2,r,u=_.Xh(d,_.pH)===21&&((r=_.xi(d,_.SVc,21,_.pH))==null?void 0:_.ti(r,2))===2;if((_.Xh(d,_.pH)===3||_.Xh(d,_.pH)===52||k||u)&&f+1<a.length&&_.Xh(a[f+1],_.pH)===70){d=_.xi(a[f+1],_.TVc,70,_.pH);let w=sVc(d);w&&e.nodeType===0&&(d=e.jk.map(B=>B.attachmentType===37?Object.assign({},B,{Jn:w}):B.attachmentType===13?Object.assign({},B,{ln:Object.assign({},\nB.ln,{cards:B.ln.cards.map(C=>{if("attachmentType"in C&&C.attachmentType===37){var G;let N=(G=C.imageUrl)!=null?G:C.Jc;G=Object.assign({},w,{Jn:Object.assign({},w.Jn,{Iu:Object.assign({},w.Jn.Iu,{contentId:`carousel:${N}`})})});return Object.assign({},C,{Jn:G})}return"video"in C&&C.video?(G=Object.assign({},w,{Jn:Object.assign({},w.Jn,{Iu:Object.assign({},w.Jn.Iu,{contentId:`carousel:${C.video.Du}`})})}),Object.assign({},C,{video:Object.assign({},C.video,{Jn:G})})):C})})}):B.attachmentType===20?Object.assign({},\nB,{wg:Object.assign({},B.wg,{Jn:w.Jn})}):B.attachmentType===8?Object.assign({},B,{Jn:w.Jn}):B),e=Object.assign({},e,{jk:d}));f++}c.push(e)}return c}',
    sourceHelpers,
  );
  // rI literal SHA256 ce500196a3ffcbf84538ee87fe257a97f91fc24c1f45d9435e52aac900f26672.
  sourceHelpers.rI = create(
    'function(a,b,c){var d,e=(d=a==null?void 0:_.ci(a,_.oH,1))!=null?d:[];if(!a||e.length===0)return{children:c?[{nodeType:18,text:c}]:[]};c=_.vz().Ea(PVc)?QVc(e,b):e.map((f,g)=>pI(f,b,[g]));a=OVc(a.getMetadata());return Object.assign({},{children:c},a&&{metadata:a})}',
    sourceHelpers,
  );
  // I_c literal SHA256 6cec55e0aff8136d179f5c1b0c3d8ed386f7108628ed7e9bd05bc121288eb4fc.
  sourceHelpers.I_c = create(
    'function(a,b,c,d,e,f,g,k,r,u){var w=RZc(a),B=SZc(a),C,G,N=(G=(C=_.m(a,TZc,22))==null?void 0:_.ni(C,1))!=null?G:!1;b=UZc(a,b,c);var T=b==="COMPLETE";C=_.n(a,1);G=VZc(a);var aa=_.nG(a),da=WZc(a,d,T),ta=aa==null?void 0:_.m(aa,XZc,64);ta=ta?xRc(ta):void 0;var ya=_.m(a,YZc,40),Ca=_.m(a,ZZc,43);T={responseId:C,AP:T,We:d};var Wa,eb=(Wa=_.m(a,_.$Zc,2))==null?void 0:Wa.getText();Wa=rI(f,T,eb);var kb=aa==null?void 0:_.Qh(aa,_.kG,35);if(kb&&kb.length>0){let Re=Sf=>{var uf=Sf.Ue;if(uf){var Kf,Tf,Hg,Sg=\n(Hg=(Kf=Sf.ulc)==null?void 0:Kf.conversationId)!=null?Hg:(Tf=Sf.ko)==null?void 0:Tf.subagentConversationId;return Sg?`${uf}:${Sg}`:uf}},of=new Set;var Cb;for(var Ib of(Cb=Wa.children)!=null?Cb:[])if(Ib.nodeType===0){var jc=void 0;for(var Vb of(jc=Ib.jk)!=null?jc:[])(Cb=Re(Vb))&&of.add(Cb)}Ib=[];for(let Sf of kb)if(jc=XNc(Sf)){let uf;if(!(!f||(uf=jc.ko)!=null&&uf.subagentConversationId||jc.Ade||jc.ulc))continue;Vb=Re(jc);Vb&&of.has(Vb)||(Ib.push({nodeType:0,jk:[jc]}),Vb&&of.add(Vb))}if(Ib.length>0){let Sf;\nWa=Object.assign({},Wa,{children:[...((Sf=Wa.children)!=null?Sf:[]),...Ib]})}}f=[];var Lc,bd;for(let Re of(bd=(Lc=aa)==null?void 0:_.Qh(Lc,HGc,44))!=null?bd:[]){let of;(of=_.Ph(Re,_.iG,3))!=null&&_.hG(of)||(Lc=KQc(Re,T.We))&&Lc.sources.some(Sf=>_.TLc(Sf)&&Sf.aAc)&&f.push({nodeType:0,jk:[Lc]})}if(f.length>0){let Re;Wa=Object.assign({},Wa,{children:[...((Re=Wa.children)!=null?Re:[]),...f]})}var wd,Gd,Jc,Hc,ad,Ee,Me;return Object.assign({},{id:C,structuredContent:Wa,mnc:(wd=_.m(a,_.a_c,23))==null?void 0:\nwd.getText(),j3:eb,tLa:b_c(aa,{Ss:r,DG:u}),sFc:TQc(aa==null?void 0:_.ti(aa,70)),Ju:fRc(aa)},(aa==null?void 0:_.ge(aa,150))&&{oJd:TG(aa,vI)},{Z4g:kRc(aa),Vc:Object.assign({},{q7:c_c(aa,r),jgc:d_c(aa)},(aa==null?void 0:_.m(aa,_.UH,58))&&{EM:zRc(aa)},{UTa:_.n(a,10),secondaryLanguage:e_c(a),eV:c.proto.ha(),Pq:ZLc(d,aa),xQ:Object.assign({},k?{Ww:k}:{},da?{Bsa:da}:{},ya?{h3a:eZc(ya,T)}:{}),qr:Object.assign({},{vrb:_.ni(a,16),fPd:_.ni(a,36),Fhf:_.ni(a,28),t1g:_.ni(a,37),WLf:_.ni(a,24),yp:bVc(_.m(a,f_c,3)),\nRka:dVc(_.m(a,f_c,3)),Qwd:aa?g_c(aa):void 0,globalSources:gVc(_.m(a,h_c,29)),Gre:i_c(aa),q$d:j_c(a)},G?{U_a:G}:{}),vD:{kOf:!(aa==null||!_.m(aa,k_c,33)),Tbc:l_c(aa==null?void 0:_.m(aa,k_c,33)),PU:m_c(aa==null?void 0:_.ci(aa,n_c,20))},s2g:o_c(_.m(a,p_c,35)),sHf:_.m(a,_.q_c,4),zfb:_.ni(a,20),OCb:_.ni(a,15)},w?{Zd:w}:{},{P6:sRc(aa==null?void 0:_.m(aa,r_c,32)),LLb:(Me=(Gd=_.m(a,s_c,51))==null?void 0:_.ni(Gd,1))!=null?Me:!1,xMa:t_c(aa==null?void 0:_.m(aa,u_c,46))},N?{vvb:N}:{},e?{feedback:e}:{},{nOf:(Jc=\n_.m(a,v_c,25))==null?void 0:_.ni(Jc,1),qne:aa?w_c(aa):void 0,Mve:x_c(aa),Jfa:sQc(aa),EM:zRc(aa),gLc:aa==null?void 0:_.m(aa,_.y_c,99),Ata:c.type===1?z_c((Hc=_.m(c.proto,A_c,45))==null?void 0:_.m(Hc,B_c,1)):void 0,Lkc:c.type===1?C_c((ad=_.m(c.proto,A_c,45))==null?void 0:_.m(ad,_.D_c,2)):void 0}),completeness:b,Yn:E_c(a,b,d),safeMode:g},B?{pae:B}:{},{v1a:ta,M$d:(Ee=_.m(a,_.F_c,39))==null?void 0:_.oi(Ee,2),lI:G_c(a,b,d,aa),uQd:Ca?mRc(Ca):void 0,Laa:c.type===1?H_c(_.m(c.proto,I_c,42)):void 0,xV:gKc(_.m(a,\nJ_c,46)),Fib:(()=>{var Re=aa==null?void 0:_.Qh(aa,_.kG,35);if(Re)for(let of of Re)if(_.ot(of,$Nc))return Re=BMc(of),Re.cHc.length>0?Re:void 0})(),r$d:_.Dk(a,48)?_.ni(a,48)?1:0:void 0,kTc:_.ni(a,49)||void 0,qFc:K_c(a)})}',
    sourceHelpers,
  );
  _.L_c = sourceHelpers.I_c;
  // Oyd literal SHA256 e5721f99e40e4efea7625d710cdc1a739617f12387972f010620cf66adb59792.
  sourceHelpers.Oyd = create(
    'function(a){var b=_.ti(a,29),c,d,e=Tyd((d=(c=_.AL(a))==null?void 0:_.n(c,2))!=null?d:"",_.m(a,_.VH,7));c=_.vz().Ea(_.C9b);var f;d=(f=_.xi(a,Zyd,49,_.HF))==null?void 0:_.m(f,_.dH,3);f=c&&d?[d]:_.ci(a,_.dH,13);var g=_.HZc(f);f=_.GF(a);if(f.length===0&&(g==null?0:g.V4a)){let k,r;return[_.Q_c(g.V4a,(r=(k=_.AL(a))==null?void 0:_.n(k,2))!=null?r:"")]}return f.map((k,r)=>{if(g==null?0:g.V4a)return _.Q_c(g.V4a,_.n(k,1));var u,w,B,C;return _.L_c(k,r,{type:1,proto:a},{conversationId:(B=(u=_.AL(a))==null?\nvoid 0:u.ig())!=null?B:"",turnId:(C=(w=_.AL(a))==null?void 0:_.n(w,2))!=null?C:"",Eh:_.n(k,1)},void 0,_.ci(a,_.qH,27)[r],b,e)})}',
    sourceHelpers,
  );
  _.$yd = sourceHelpers.Oyd;
  // Myd literal SHA256 0d33588932c8be1d0605c682b27fb6ff934caf5079d4b6cd12d9eeb789d5e09e.
  sourceHelpers.Myd = create(
    'function(a){if(_.ge(a,6))return _.PZc(_.m(a,_.W4c,6))}',
    sourceHelpers,
  );
  _.Yyd = sourceHelpers.Myd;
  _.PZc = create('function(a){if(a)return{w4a:_.n(a,1),p$c:_.n(a,2),LTc:_.ni(a,3),Zlg:_.n(a,5)}}');
  // MZc literal SHA256 9ccf3e58d7c02b082871d2c8d64b474af06adc1515ace052374ef5e95fc63641.
  sourceHelpers.MZc = create(
    'function(a){if(a)return{w4a:_.n(a,1),p$c:_.n(a,2),LTc:_.ni(a,3),Zlg:_.n(a,5)}}',
    sourceHelpers,
  );
  _.MZc = sourceHelpers.MZc;
  _.lA = (value: unknown) => absent(value);
  _.QZc = _.GFc = _.L0c = _.HZc = absent;
  _.OZc = (values: unknown[]) => absent(values);
  _.OYc = (values: unknown[]) => {
    absent(values);
    return [];
  };
  _.MZc = (values: unknown[]) => {
    absent(values);
    return {};
  };
  _.BF = (value: number) =>
    [
      'MODE_CATEGORY_UNSPECIFIED',
      'MODE_CATEGORY_FAST',
      'MODE_CATEGORY_THINKING',
      'MODE_CATEGORY_PRO',
      'MODE_CATEGORY_AUTO',
    ][value];
  _.CF = (value: number) =>
    [
      'THINKING_LEVEL_STANDARD',
      'THINKING_LEVEL_STANDARD',
      'THINKING_LEVEL_EXTENDED',
      'THINKING_LEVEL_DEEP_THINK',
      'THINKING_LEVEL_MEDIUM',
    ][value];
  Object.assign(api, {
    Yb: () => false,
    Zb: () => true,
    Nl: () => true,
    Fd: true,
    Ca: {
      mark() {},
      time(_a: unknown, _b: unknown, read: () => unknown) {
        return read();
      },
      dFb() {},
    },
  });
  const rLdOriginal = create(
    'function(a,b,c,d,e,f,g,k){var r=d.clientTurnId;XId(a.ka,r,b);qMd(a,b);var u=_.m(b,GAd,55);u&&TAd(a.zl,nAd(u));var w=_.xi(b,Zyd,49,_.HF),B=a.kb&&_.nZc(w);_.ni(b,15)&&!B&&VAd(a.zl);var C=_.m(b,IAd,65);C&&a.rja&&_.mL(a.Va)&&a.Za.pipe(_.Tt(1),_.wA(a.Ia)).subscribe({next:Zg=>{try{Zg.Ab(C,r,d.textQuery)}catch(zh){}},error:()=>{}});if(!_.Zh(b,37,_.HF)){var G=_.ti(b,63);if(G===2||G===3||G===4){let Zg;e.next({responseType:"TURN",request:d,xj:!1,response:{turnId:(Zg=d.clientTurnId)!=null?Zg:"",draft:void 0,\nAB:[],Oo:[],isFinal:!0,RL:!1,d8:!1,O9:[],xaa:[],Vc:{c7f:Vyd(G)}}})}else{var {cOb:N,conversationId:T}=gAd(b,c,d,a.Yb());T&&JKd(k,T);k==null||KKd(k,b);if(N)if(a.Zb()&&_.ni(b,15)&&!B&&_.GF(b).length>0&&_.ci(b,_.dH,13).length===0&&e.next({responseType:"TURN_COMPLETED",turnId:N,conversationId:T}),_.ge(b,46)){var aa=_.m(b,_.vL,46);e.next({responseType:"CONTINUATION_UPDATE",turnId:N,conversationId:T,epa:aa});_.ge(b,52)&&a.Fd&&(a=Uyd(_.m(b,HAd,52)),e.next({responseType:"DISCONNECT",turnId:N,conversationId:T,\njGc:a}))}else{G=_.xi(b,_.DAd,21,_.HF);var da;if((k=(da=G==null?void 0:_.n(G,1))!=null?da:"")||_.BKd(a.Aa)&&G)a=_.li(b,18),_.GF(b).length?e.error("Service routing response is invalid."):e.next(Object.assign({},{responseType:"ROUTING",turnId:N,pqa:k,conversationId:T},a?{gGd:a}:{}));else if(_.xi(b,_.c1c,23,_.HF)){var ta;(a=(ta=_.xi(b,_.c1c,23,_.HF))==null?void 0:_.xi(ta,_.h1c,2,_.e1c))?(a={Uzc:"RECALL_CLASSIFIER",HIb:_.ci(a,_.tRc,1).map(Zg=>_.uRc(Zg))},e.next({responseType:"POST_HOC_ATTRIBUTION",turnId:N,\nattribution:a})):(a=vzd(b),e.next({responseType:"POST_HOC_ATTRIBUTION",turnId:N,attribution:{Uzc:"PERSONALIZATION_CLASSIFIER",s$d:a}}))}else if(ta=_.xi(b,_.rsd,28,_.HF))e.next({responseType:"CONSUME_GEMINI_QUOTA",turnId:N,L6f:_.hsd(ta)}),(a=ta.ha())&&e.next({responseType:"BEST_MODE_FOR_NEXT_TURN",dSa:a});else if(a.Nl(b,d))if(_.xi(b,FAd,11,_.HF)){var ya;let Zg;e.next({responseType:"TITLE_GENERATION",conversationId:T,title:(Zg=(ya=_.xi(b,FAd,11,_.HF))==null?void 0:ya.getTitle())!=null?Zg:""})}else if(_.Si(b,\n26))e.next({responseType:"HISTORY_VERSION_UPDATE",conversationId:T,xS:_.n(b,26)});else{a.Ca.mark(1,r);var Ca,Wa;ta=((Wa=(Ca=_.m(b,EAd,10))==null?void 0:_.ci(Ca,_.nA,8))!=null?Wa:[]).map(_.lA);var eb,kb;(Ca=(eb=d.Cc)==null?void 0:(kb=eb.mla)==null?void 0:kb.H2)&&(Ca.type===0||Ca.type===1||Ca.type===2)&&Ca.Taa&&ta.unshift(_.fud(Ca.Taa,Ca.type));var Cb,Ib;eb=((Ib=(Cb=_.m(b,EAd,10))==null?void 0:_.ci(Cb,_.nA,1))!=null?Ib:[]).map(_.lA);Cb=iAd(b,a.Pc);Ib=_.OZc(_.ci(b,_.dH,13));var jc=_.ni(b,34)?eAd(b):\nvoid 0;kb=a.Ca.time(1,r,()=>_.$yd(b));var Vb,Lc=(jc==null?0:jc.uHd)?jc.uHd:(Vb=kb[0])==null?void 0:Vb.id;Vb=kb.find(Zg=>Zg.id===Lc);kb=(kb=kb.find(Zg=>Zg.id===(jc==null?void 0:jc.tof)))?{Ctb:kb}:void 0;Ca=_.QZc(_.m(b,_.g1c,30));Wa=_.GFc(_.m(b,_.i1c,41));var bd,wd;ya={responseId:(bd=Vb==null?void 0:Vb.id)!=null?bd:"",AP:_.ni(b,15),We:{conversationId:T,turnId:N!=null?N:"",Eh:(wd=Vb==null?void 0:Vb.id)!=null?wd:""}};bd=_.m(b,_.VH,7);wd=d.ff===26;B=a.Zc||B?w:void 0;var Gd;(w=!!(w==null?0:(Gd=_.m(w,_.dH,\n3))==null?0:_.ie(Gd,EHd)))||(w=_.ci(b,_.dH,13).some(Zg=>!!_.ie(Zg,EHd)));a.t1&&sAd(b,g)&&a.Gb.pipe(_.Tt(1),_.wA(a.Ia)).subscribe({next:Zg=>{Zg.refresh()},error:()=>{}});var Jc,Hc,ad;Gd=_.MZc(_.ci(b,_.dH,13),wd,(ad=b==null?void 0:(Jc=_.GF(b)[0])==null?void 0:(Hc=_.m(Jc,_.$Zc,2))==null?void 0:Hc.getText())!=null?ad:"",_.n(b,33),_.n(b,35),_.n(b,36),B);f=qAd(Gd,f);var Ee,Me;var Re=(Jc=(Re=_.GF(b)[0])==null?void 0:(Ee=_.nG(Re))==null?void 0:(Me=_.m(Ee,vAd,149))==null?void 0:_.m(Me,uAd,1))?{j$f:{url:Jc.getUrl(),\nthreatType:_.ti(Jc,2),xKf:_.ni(Jc,3)}}:void 0;Ee=_.m(b,_.iL,53);var of,Sf,uf;Re=Object.assign({},{turnId:N,draft:Vb},Re?{Bpf:Re}:{},{CIa:Ee?_.fsd(Ee):void 0,kI:_.Yyd(b),Mx:bd?_.bZc(bd,ya):void 0,Oo:rMd(b),isFinal:_.ni(b,15),RL:(Sf=(of=_.m(b,_.VH,7))==null?void 0:_.ni(of,4))!=null?Sf:!1,O9:_.OYc(_.ci(b,_.VH,12)),regionCode:_.n(b,9)},Cb?{hs:Cb}:{},Ib?{Qme:Ib}:{},{ltg:_.ni(b,16),eV:b.ha(),d8:_.ni(b,24),xaa:[],Zpf:dAd(_.m(b,JAd,25)),xS:_.n(b,26),Xof:_.ni(b,32)},Ca?{lV:Ca}:{},Wa?{YPc:Wa}:{},{Vc:{Hu:f,\nV7:kb},gma:_.n(b,40),PN:_.n(b,43),BDb:_.ni(b,58),vAc:Wyd(_.ti(b,48)),OAa:Xyd(_.ti(b,64)),b1a:oAd(b,u),thinkingLevel:pAd(b,u),Wo:_.n(b,61)||void 0,Nj:_.n(b,62)||void 0,R7b:_.ni(b,50)},w?{Ycg:w}:{},{n8a:(uf=_.Ek(b,56))!=null?uf:[]});var Kf;c=(Kf=_.m(c,_.f1c,24))==null?void 0:Kf.tD();var Tf,Hg;if(Kf=(Hg=(Tf=_.L0c(_.m(b,_.Q0c,57)))!=null?Tf:g.jBd)!=null?Hg:d.cM)g.jBd=Kf;g=Object.assign({},d,{conversationId:T,W2:d.conversationId,Ke:ta,IZb:eb},Kf?{cM:Kf}:{});var Sg;Tf=(aa=_.GF(b)[0])==null?void 0:(Sg=_.nG(aa))==\nnull?void 0:_.m(Sg,_.l1c,96);aa=(Tf==null?void 0:Tf.getId())||void 0;Sg=(Tf==null?void 0:_.n(Tf,3))||void 0;Hg=(Tf==null?void 0:Tf.getTitle())||void 0;Kf=(Tf==null?void 0:_.n(Tf,4))||void 0;Tf=(Tf==null?void 0:_.ni(Tf,5))||void 0;aa=Object.assign({},{responseType:"TURN",request:g,response:Re,xj:!1,Rta:aa,sjb:Sg,oga:Hg,cKb:Kf,dKb:Tf},c?{uia:{taskIdentifiers:{taskId:c},SQf:!0}}:{});a.Ca.mark(2,r);a.Ca.dFb(2,1,2,r);TId(a.ka,r,aa);e.next(aa)}else _.BKd(a.Aa)||e.error("Service response is invalid.")}else e.error("Response received without ID.")}}}',
    {
      ...sourceHelpers,
      Vyd: hyd,
      EAd: class extends _.l {},
      FAd: class extends _.l {},
      JAd: class extends _.l {},
      vAd: class extends _.l {},
      uAd: class extends _.l {},
      HAd: QGd,
      EHd: {},
      TId() {},
      Uyd: create('function(){return{}}'),
      XId() {},
      qMd() {},
      GAd: QGd,
      IAd: QGd,
      TAd() {},
      nAd() {},
      VAd() {},
    },
  );
  _.nZc = create('function(a){var b;return!!(a==null?0:(b=_.m(a,_.dH,3))==null?0:_.ie(b,mZc))}', {
    mZc: {},
  });
  _.cKd = () => {
    throw Error('synthetic-action-refused');
  };
  const projectionCleanup: string[] = [];
  const projectionTimers = new Set<number>();
  let projectionTimerStarts = 0;
  const lifecycleRemovals: unknown[] = [];
  const mLd = create(
    'function(a,b,c,d,e,f,g,k,r){var u=!1,w=!1,B=!1,C,G,N=(G=d.clientTurnId)!=null?G:"",T=()=>{C!==void 0&&(clearTimeout(C),C=void 0)},aa="",da=()=>{_.aM(b);e.complete()},ta={next:Ca=>{Ca.responseType==="ROUTING"&&(aa=Ca.turnId,a.Ga.set(aa,da));e.next(Ca)},error:Ca=>{e.error(Ca)},complete:()=>e.complete()};var ya=b.Va.pipe(_.wA(a.Ia)).subscribe({next:Ca=>{u||(u=!0,RId(a.ka,d.clientTurnId));_.Si(Ca,26)&&(B=!0);var Wa=_.ti(Ca,63)===2,eb=a.kb&&_.nZc(_.xi(Ca,Zyd,49,_.HF));if(Wa=_.ni(Ca,15)&&!Wa&&!eb)w=\n!0,SId(a.ka,d.clientTurnId),B||C!==void 0||(C=window.setTimeout(()=>{_.aM(b)},3E4));sMd(a,Ca,c,d,ta,f,g,k);fMd(a.ha,N,Ca,Wa);if(_.ge(Ca,52)||w&&B)C!==void 0&&(clearTimeout(C),C=void 0),_.aM(b)},error:Ca=>{T();!u&&r?r():(fM(a.ha,N,ya),e.error(Ca))},complete:()=>{T();!u&&r?r():(fM(a.ha,N,ya),SId(a.ka,d.clientTurnId),e.complete())}});ya.add(()=>{T();a.Ga.get(aa)===da&&a.Ga.delete(aa)});return ya}',
    {
      Zyd: create(
        'class extends _.l{constructor(a){super(a)}getId(){return _.oi(this,1)}Xd(a){return _.Gi(this,1,a)}}',
      ),
      fM(_registry: unknown, _id: unknown, subscription: unknown) {
        lifecycleRemovals.push(subscription);
      },
      RId() {},
      SId() {},
      sMd(...args: any[]) {
        const value = args[1];
        traceReceive('RJd:before', value);
        rLdOriginal(...args);
        if (projectResponse) projectResponse(value, args[3], args[4]);
        traceReceive('RJd:after', value);
      },
      fMd(_registry: unknown, _rid: unknown, value: unknown, completed: boolean) {
        completionFlags.push(completed);
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
    'function(a,b){a.Aa++;var c=_.zJd(new _.WL,a.Aa);b=_.Rh((new _.xJd).setText(b));c=_.di(c,9,_.VL,b);c=_.Af(c);c=_.Rh((new _.JJd).Bg(c));if(a.ha)a.connection.send(c);else{let d,e;(e=(d=a.connection).Afc)==null||e.call(d,c);a.wa.push(c)}}',
  );
  const nLd = create(
    'function(a,b,c,d,e,f,g){var k,r,u=_.yKd(a.Eb,{ri:c.ri,isTemporaryChat:(k=c.Cc)==null?void 0:(r=k.M7)==null?void 0:r.isTemporaryChat,clientTurnId:c.clientTurnId,requestSource:a.requestSource,NZa:c.dLa}),w=_.wKd(a.Ab,a.Ia,{DS:u}),B,C=(B=c.clientTurnId)!=null?B:"",G=nMd(a,w,b,c,d,e,f,g),N;eMd(a.ha,C,(N=c.conversationId)!=null?N:"",()=>{_.aM(w);d.complete()},G);PId(a.ka,c.clientTurnId);w.Ua.pipe(_.Tt(1),_.wA(a.Ia)).subscribe(()=>{QId(a.ka,c.clientTurnId)});w.connect();var T,aa;_.aKd(w,b,a.requestSource,\n(T=c.ri)!=null?T:"",(aa=c.clientTurnId)!=null?aa:"");e=_.m(b,_.Gyd,79);var da,ta;f=(ta=(da=_.tL(b))==null?void 0:da.getText())!=null?ta:_.ge(b,34)?"":void 0;e!==void 0?_.cKd(w,e):f!==void 0&&bKd(w,f);return()=>{G.unsubscribe();_.aM(w);fM(a.ha,C,G)}}',
    {
      nMd: (...args: any[]) => {
        owned = args[1];
        afterFactory();
        responseSubscription = lifecycle ? mLd(...args) : new _.qt();
        return responseSubscription;
      },
      eMd() {},
      PId() {
        beforeConfig();
      },
      QId() {},
      NJd() {
        throw Error('synthetic-action-refused');
      },
      bKd: (...args: any[]) => {
        afterConfig();
        hJd(...args);
        afterQuery();
      },
      fM() {},
    },
  );
  // The original source path below is used by every lifecycle/recovery case.
  // Earlier physical-only fixtures keep their deliberately narrow receiver leaf.
  const physicalOnly = (_api: any, captured: any, request: any, _observer: any) => {
    _.yKd(api.Eb, {
      ri: request.ri,
      clientTurnId: request.clientTurnId,
      requestSource: api.requestSource,
    });
    owned = _.wKd(session, api.Ia, { DS: metadata });
    afterFactory();
    owned.connect();
    beforeConfig();
    _.aKd(owned, captured, api.requestSource, approved.modeId, approved.clientTurnId);
    afterConfig();
    const action = _.m(captured, _.Gyd, 79),
      text = _.tL(captured)?.getText() ?? (_.ge(captured, 34) ? '' : undefined);
    if (action !== undefined) throw Error('synthetic-action-refused');
    if (text !== undefined) hJd(owned, text);
    afterQuery();
    return () => owned.disconnect();
  };
  _.gM.prototype.ybb = create(
    'class{ybb(a){if(!hAd(a.request))throw Error("zk");var b=_.jMd(this,a);a.request.dLa||this.Wa.Ga.set(!1);var c=a.request,d=c.clientTurnId,e,f=(e=c.conversationId)!=null?e:"";e=c.cM;var g=c.ff===41&&(!e||e.deviceId===_.LAd(this.ob));OId(this.ka,d,_.BKd(this.Aa));\nreturn new _.st(k=>{var r={kBc:void 0,jBc:void 0,iBc:void 0},u={jBd:void 0,fge:new Set};UAd(this.zl);var w=new iMd(this.ob,f,g);hMd(w);var B=!1,C=dLd(this.Wd,b,a,{next:G=>{if(!B){if(w.enabled&&!w.ka&&!w.ha){var N=_.Dtd(G)?G.request.conversationId:G.responseType==="ROUTING"||G.responseType==="TURN_COMPLETED"||G.responseType==="CONTINUATION_UPDATE"?G.conversationId:void 0;N&&(w.ha=N,hMd(w))}k.next(G)}},error:G=>{B||(B=!0,this.ka.handleError(G instanceof Error?G:Error(String(G)),d),w.onComplete(),k.error(G))},\ncomplete:()=>{B||(B=!0,aJd(this.ka,d),w.onComplete(),k.complete())}},(G,N,T,aa)=>{if(_.BKd(this.Aa))a:{var da=this.Fb.get();if((da==null?0:da.isEnabled())&&N.sib!=="RECONNECT_TO_EXISTING_TURN"){let Jc=da.Oof();if(Jc){var ta=!N.dLa&&_.ZJd(Jc.connection);if(ta){{let Hc=cxd(Jc.Sec),ad=cxd(G);if(_.dk(Hc,ad))var ya=[];else{ya=[];uL(_.hGd(Hc),_.hGd(ad))||ya.push("IDENTIFIERS");uL(_.m(Hc,_.vL,72),_.m(ad,_.vL,72))||ya.push("CONTINUATION_IDENTIFIERS");_.ti(Hc,19)!==_.ti(ad,19)&&ya.push("REQUESTED_BARD_MODE");\n_.n(Hc,39)!==_.n(ad,39)&&ya.push("REQUESTED_MODE_ID");_.ti(Hc,80)===_.ti(ad,80)&&_.ti(Hc,76)===_.ti(ad,76)&&_.n(Hc,65)===_.n(ad,65)&&_.n(Hc,74)===_.n(ad,74)||ya.push("REQUESTED_MODE_CATEGORY");_.ti(Hc,81)!==_.ti(ad,81)&&ya.push("REQUESTED_THINKING_LEVEL");_.ti(Hc,50)!==_.ti(ad,50)&&ya.push("USER_SELECTED_FEATURE_MODE");_.ni(Hc,92)!==_.ni(ad,92)&&ya.push("SMART_MODEL_SELECTION");_.ni(Hc,97)!==_.ni(ad,97)&&ya.push("MANUAL_PICKER_OVERRIDE");_.ni(Hc,66)!==_.ni(ad,66)&&ya.push("SKIP_THINKING");uL(_.m(Hc,\n_.Ixd,42),_.m(ad,_.Ixd,42))||ya.push("MEMORY_OPTIONS");Hc.NIa()!==ad.NIa()&&ya.push("PERSONAL_CONTEXT_DISABLED");_.ni(Hc,46)!==_.ni(ad,46)&&ya.push("TEMPORARY_CHAT");var Ca=_.tL(Hc),Wa=_.tL(ad),eb,kb;((eb=Ca==null?void 0:_.mFd(Ca))!=null?eb:!1)!==((kb=Wa==null?void 0:_.mFd(Wa))!=null?kb:!1)&&ya.push("VOICE_ENTRY");var Cb,Ib;((Cb=Ca==null?void 0:_.ni(Ca,7))!=null?Cb:!1)!==((Ib=Wa==null?void 0:_.ni(Wa,7))!=null?Ib:!1)&&ya.push("ZERO_STATE_PROMPT");uL(_.m(Hc,_.Rv,34),_.m(ad,_.Rv,34))||ya.push("SYSTEM_QUERY");\nvar jc,Vb;dxd((jc=Ca==null?void 0:_.ci(Ca,_.ZK,4))!=null?jc:[],(Vb=Wa==null?void 0:_.ci(Wa,_.ZK,4))!=null?Vb:[])||ya.push("FILE_ATTACHMENTS");uL(Ca==null?void 0:_.m(Ca,_.sL,10),Wa==null?void 0:_.m(Wa,_.sL,10))||ya.push("ATTACHED_CONTEXT");(Ca==null?void 0:_.ti(Ca,11))!==(Wa==null?void 0:_.ti(Wa,11))&&ya.push("CONTEXTUAL_ACTION");dxd(_.ci(Hc,_.$y,10),_.ci(ad,_.$y,10))||ya.push("TOOL_MENTIONS");exd(_.ui(Hc,82),_.ui(ad,82))||ya.push("SELECTED_SKILL_IDS");exd(_.ui(Hc,96),_.ui(ad,96))||ya.push("SELECTED_FIRST_PARTY_SKILL_IDS");\nexd(_.ui(Hc,107),_.ui(ad,107))||ya.push("SELECTED_PLUGIN_IDS");_.n(Hc,70)!==_.n(ad,70)&&ya.push("SKILL_ID");_.ni(Hc,99)!==_.ni(ad,99)&&ya.push("CHROME_SKILLS_ENABLED");_.ni(Hc,12)===_.ni(ad,12)&&_.ni(Hc,54)===_.ni(ad,54)||ya.push("DISABLE_TOOLS_OR_QUIZ");dxd(_.ci(Hc,_.NG,9),_.ci(ad,_.NG,9))||ya.push("REQUEST_SCOPED_CONSENTS");uL(_.m(Hc,gud,55),_.m(ad,gud,55))&&uL(_.m(Hc,nud,56),_.m(ad,nud,56))||ya.push("INPUT_COMPANION");_.n(Hc,20)===_.n(ad,20)&&_.ni(Hc,37)===_.ni(ad,37)&&uL(_.m(Hc,_.hK,25),_.m(ad,\n_.hK,25))&&exd(_.ui(Hc,40),_.ui(ad,40))&&uL(_.m(Hc,pud,41),_.m(ad,pud,41))||ya.push("BOT_CONFIG_OR_METADATA");_.n(Hc,105)!==_.n(ad,105)&&ya.push("PROJECT_ID");var Lc;Ca=(Lc=_.m(Hc,_.EI,62))==null?void 0:Lc.clone();var bd;Lc=(bd=_.m(ad,_.EI,62))==null?void 0:bd.clone();var wd,Gd;((wd=Ca==null?void 0:_.oi(Ca,9))!=null?wd:0)!==((Gd=Lc==null?void 0:_.oi(Lc,9))!=null?Gd:0)&&ya.push("CAPTURED_REGIONS");Ca!=null&&_.Vh(Ca,9);Lc!=null&&_.Vh(Lc,9);!Ca&&!Lc||uL(Ca!=null?Ca:new _.EI,Lc!=null?Lc:new _.EI)||ya.push("GEMINI_IN_CHROME_METADATA");\nuL(_.m(Hc,_.gA,16),_.m(ad,_.gA,16))||ya.push("DEVICE_CONTEXT");uL(_.m(Hc,zyd,23),_.m(ad,zyd,23))||ya.push("REQUEST_LOGGING_METADATA");uL(_.m(Hc,Bud,43),_.m(ad,Bud,43))&&uL(_.m(Hc,Tud,71),_.m(ad,Tud,71))||ya.push("IMMERSIVE_OR_ARTIFACTS_CONTEXT");uL(_.m(Hc,hvd,63),_.m(ad,hvd,63))||ya.push("GOAL_INPUT");uL(_.m(Hc,_.V0c,102),_.m(ad,_.V0c,102))||ya.push("HIGHLIGHT_TO_ASK_CONTEXT");uL(_.m(Hc,Oyd,90),_.m(ad,Oyd,90))||ya.push("REMY_METADATA");uL(_.m(Hc,Myd,98),_.m(ad,Myd,98))||ya.push("DEEP_RESEARCH_METADATA");\nuL(_.m(Hc,ayd,86),_.m(ad,ayd,86))||ya.push("AGENTIC_SIGNIN_METADATA");uL(_.m(Hc,dGd,58),_.m(ad,dGd,58))||ya.push("COMPUTER_USE_METADATA");uL(_.m(Hc,qyd,87),_.m(ad,qyd,87))||ya.push("REMOTE_DEVICE_TARGET");Hc.tea()===ad.tea()&&uL(_.m(Hc,_.nLb,94),_.m(ad,_.nLb,94))&&_.n(Hc,103)===_.n(ad,103)&&_.n(Hc,108)===_.n(ad,108)&&uL(_.m(Hc,mxd,57),_.m(ad,mxd,57))||ya.push("PROMPT_SOURCE_OR_ID");uL(_.m(Hc,Lxd,85),_.m(ad,Lxd,85))||ya.push("FOLLOW_UP_METADATA");_.ti(Hc,73)===_.ti(ad,73)&&uL(_.m(Hc,_.e2c,64),_.m(ad,\n_.e2c,64))&&_.ti(Hc,100)===_.ti(ad,100)&&_.oi(Hc,104)===_.oi(ad,104)||ya.push("REGENERATE");uL(_.m(Hc,lyd,18),_.m(ad,lyd,18))||ya.push("TURN_INDEX");uL(_.m(Hc,_.mG,2),_.m(ad,_.mG,2))&&uL(_.m(Hc,_.RI,7),_.m(ad,_.RI,7))&&_.ti(Hc,69)===_.ti(ad,69)||ya.push("THEME_OR_LOCALE");exd(_.Ek(Hc,31),_.Ek(ad,31))||ya.push("CLIENT_CAPABILITIES");ya.length===0&&ya.push("OTHER")}}}else ya=["CONNECTION_UNUSABLE"];if(ta&&ya.length===0){_.NAd(this.Fc,"CONSUMED",Jc.ri);MAd(this.Fc,this.Na.now()-Jc.VM,Jc.ri,!0);da.IDc();\nG=pMd(this,Jc.connection,G,N,T,r,u,aa);break a}_.aM(Jc.connection);_.NAd(this.Fc,"MISMATCH",Jc.ri);for(let Hc of ya)ta=this.Fc,ta.Sd.increment(Hc,Jc.ri||"undefined",ta.requestSource);MAd(this.Fc,this.Na.now()-Jc.VM,Jc.ri,!1);da.IDc()}else da=da.IDc(),da!==void 0&&MAd(this.Fc,this.Na.now()-da,N.ri,!1)}G=oMd(this,G,N,T,r,u,aa)}else G=mMd(this,G,N,T,r,u,aa);return G});return()=>{w.onComplete();C();VAd(this.zl)}})}}',
    {
      hAd: () => {
        beforeProtectedRequest();
        return true;
      },
      OId() {},
      UAd() {
        beforeOriginalProducer();
      },
      VAd() {
        beforeOriginalTeardown();
      },
      aJd() {},
      hMd() {},
      iMd: class {
        enabled = false;
        onComplete() {}
      },
      dLd: cKd,
      oMd: lifecycle ? nLd : physicalOnly,
      mMd() {
        throw Error('synthetic-rpc-refused');
      },
    },
  ).prototype.ybb;
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
  _.bja = create('function(){}');
  _.bja.prototype.g9 = create('function(){return new XMLHttpRequest}', {
    XMLHttpRequest: _.fa.XMLHttpRequest,
  });
  _.aja = new _.bja();
  _.qe = create('a=>a');
  _.xta = ['POST', 'PUT'];
  _.xa = (a: any[], b: unknown) => a.includes(b);
  _.Vj = create(
    'function(a){_.Yb.call(this);this.headers=new Map;this.BPb=a||null;this.qE=!1;this.vk=null;this.NAa="";this.I6=0;this.IG="";this.TWa=this.EPc=this.K6b=this.WIc=!1;this.nmb=0;this.Pua=null;this.tI="";this.p5f=this.eD=!1;this.Tzc=this.Pcd=null}',
  );
  Object.setPrototypeOf(_.Vj.prototype, _.Yb.prototype);
  _.Vj.prototype.send = create(
    'function(a,b,c,d){if(this.vk)throw Error("Xb`"+this.NAa+"`"+a);if(typeof b==="string")var e=b;else if(b){var f=b;e=f.method;c!=null||(c=f.body);d!=null||(d=f.headers)}e=e?e.toUpperCase():"GET";this.NAa=a;this.IG="";this.I6=0;this.WIc=!1;this.qE=!0;this.vk=this.rub(f);this.vk.onreadystatechange=(0,_.qe)((0,_.$b)(this.O8d,this));this.p5f&&"onprogress"in this.vk&&(this.vk.onprogress=(0,_.qe)((0,_.$b)(function(k){this.N8d(k,!0)},this)),this.vk.upload&&(this.vk.upload.onprogress=(0,_.qe)((0,_.$b)(this.N8d,\nthis))));try{this.EPc=!0,this.vk.open(e,String(a),!0),this.EPc=!1}catch(k){this.Cq(5,k);return}a=c||"";b=new Map(this.headers);if(d)if(Object.getPrototypeOf(d)===Object.prototype)for(var g in d)b.set(g,d[g]);else if(typeof d.keys==="function"&&typeof d.get==="function")for(let k of d.keys())b.set(k,d.get(k));else throw Error("Yb`"+String(d));d=Array.from(b.keys()).find(k=>"content-type"==k.toLowerCase());g=_.fa.FormData&&a instanceof _.fa.FormData;!_.xa(_.xta,e)||d||g||b.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");\nfor(let [k,r]of b)this.vk.setRequestHeader(k,r);this.tI&&(this.vk.responseType=this.tI);"withCredentials"in this.vk&&this.vk.withCredentials!==this.eD&&(this.vk.withCredentials=this.eD);if("setTrustToken"in this.vk&&this.Pcd)try{this.vk.setTrustToken(this.Pcd)}catch(k){}if("setAttributionReporting"in this.vk&&this.Tzc)try{this.vk.setAttributionReporting(this.Tzc)}catch(k){}try{this.Pua&&(clearTimeout(this.Pua),this.Pua=null),this.nmb>0&&(this.Pua=setTimeout(this.kH.bind(this),this.nmb)),this.K6b=\n!0,this.vk.send(a),this.K6b=!1}catch(k){this.Cq(5,k)}}',
    {},
  );
  _.Vj.prototype.rub = create('function(a){return this.BPb?this.BPb.g9(a):_.aja.g9()}', {});
  _.Sea = true;
  const Ata = create(
    'function(a,b){if(a.vk){a.Pua&&(clearTimeout(a.Pua),a.Pua=null);let c=a.vk;a.vk=null;b||a.dispatchEvent("ready");try{c.onreadystatechange=null}catch(d){}}}',
  );
  const zta = create(
    'function(a){a.WIc||(a.WIc=!0,a.dispatchEvent("complete"),a.dispatchEvent("error"))}',
  );
  const Bta = create(
    'function(a){if(a.qE&&typeof _.Sea!="undefined")if(a.K6b&&a.uea()==4)setTimeout(a.O8d.bind(a),0);else if(a.dispatchEvent("readystatechange"),a.Wu()){a.qE=!1;try{if(a.rq())a.dispatchEvent("complete"),a.dispatchEvent("success");else{a.I6=6;try{var b=a.uea()>2?a.vk.statusText:""}catch(c){b=""}a.IG=b+" ["+a.getStatus()+"]";Ata(a)}}finally{Bta(a)}}}',
    { Ata: zta, Bta: Ata },
  );
  _.Vj.prototype.O8d = create(
    'function(){this.isDisposed()||(this.EPc||this.K6b||this.TWa?Cta(this):this.Y_c())}',
    { Cta: Bta },
  );
  _.Vj.prototype.xI = create('function(a){this.eD=a}', {});
  _.Vj.prototype.abort = create(
    'function(a){this.vk&&this.qE&&(this.qE=!1,this.TWa=!0,this.vk.abort(),this.TWa=!1,this.I6=a||7,this.dispatchEvent("complete"),this.dispatchEvent("abort"),Bta(this))}',
    {
      Bta: Ata,
    },
  );
  _.Vj.prototype.Y_c = create('function(){Cta(this)}', {
    Cta: Bta,
  });
  _.Vj.prototype.uea = create('function(){return this.vk?this.vk.readyState:0}');
  _.Vj.prototype.J1 = create('function(){return this.I6}');
  _.Vj.prototype.Ln = create(
    'function(){try{return this.vk?this.vk.responseText:""}catch(a){return""}}',
  );
  _.Vj.prototype.getStatus = create(
    'function(){try{return this.uea()>2?this.vk.status:-1}catch(a){return-1}}',
  );
  _.Vj.prototype.Wu = create('function(){return this.uea()==4}');
  _.Vj.prototype.getResponseHeader = create(
    'function(a){if(this.vk&&this.Wu())return a=this.vk.getResponseHeader(a),a===null?void 0:a}',
  );
  _.Vj.prototype.getResponse = create(
    'function(){try{if(!this.vk)return null;if("response"in this.vk)return this.vk.response;switch(this.tI){case "":case "text":return this.vk.responseText;case "arraybuffer":if("mozResponseArrayBuffer"in this.vk)return this.vk.mozResponseArrayBuffer}return null}catch(a){return null}}',
  );
  _.Vj.oe = _.Yb.prototype;
  _.Yb.oe = _.Eb.prototype;
  _.Eb.prototype.dispose = create('function(){this.r5||(this.r5=!0,this.Hc())}');
  _.Eb.prototype.Hc = create('function(){if(this.n_a)for(;this.n_a.length;)this.n_a.shift()()}');
  _.Yb.prototype.Hc = create(
    'function(){_.Yb.oe.Hc.call(this);this.removeAllListeners();this.F1c=null}',
  );
  _.Yb.prototype.removeAllListeners = create(
    'function(a){return this.Xpa?this.Xpa.removeAll(a):0}',
  );
  _.Rb.prototype.removeAll = create(
    'function(a){a=a&&a.toString();var b=0;for(let c in this.listeners)if(!a||c==a){let d=this.listeners[c];for(let e=0;e<d.length;e++)++b,Aga(d[e]);delete this.listeners[c];this.ha--}return b}',
    {
      Aga: (record: any) => {
        record.removed = true;
        record.listener = record.proxy = record.src = record.handler = null;
      },
    },
  );
  _.Lb = (value: any, map: (v: any) => any) =>
    Object.fromEntries(Object.entries(value).map(([k, v]) => [k, map(v)]));
  _.Iha = (value: string, delimiter: string) => {
    const i = value.indexOf(delimiter);
    return i < 0 ? [value] : [value.slice(0, i), value.slice(i + 1)];
  };
  _.Vj.prototype.Hc = create(
    'function(){this.vk&&(this.qE&&(this.qE=!1,this.TWa=!0,this.vk.abort(),this.TWa=!1),Bta(this,!0));_.Vj.oe.Hc.call(this)}',
    {
      Bta: Ata,
      zta: zta,
    },
  );
  _.Vj.prototype.Cq = create(
    'function(a,b){this.qE=!1;this.vk&&(this.TWa=!0,this.vk.abort(),this.TWa=!1);this.IG=b;this.I6=a;Ata(this);Bta(this)}',
    {
      Bta: Ata,
      Ata: zta,
    },
  );
  _.Vj.prototype.getAllResponseHeaders = create(
    'function(){return this.vk&&this.uea()>=2?this.vk.getAllResponseHeaders()||"":""}',
    {
      Ata: Ata,
      zta: zta,
    },
  );
  _.Vj.prototype.uG = create(
    'function(){var a={},b=this.getAllResponseHeaders().split("\\r\\n");for(let d=0;d<b.length;d++){if(_.ja(b[d]))continue;var c=_.Iha(b[d],":",1);let e=c[0];c=c[1];if(typeof c!=="string")continue;c=c.trim();let f=a[e]||[];a[e]=f;f.push(c)}return _.Lb(a,function(d){return d.join(", ")})}',
    {
      Ata: Ata,
      zta: zta,
    },
  );

  _.Eb.prototype.r5 = false;
  _.Eb.prototype.isDisposed = create('function(){return this.r5}');
  Object.setPrototypeOf(_.Yb.prototype, _.Eb.prototype);
  const identity = Function(
    'var Tea="closure_uid_17",Uea=0;return {Qd:function(a){return Object.prototype.hasOwnProperty.call(a,Tea)&&a[Tea]||(a[Tea]=++Uea)},count:()=>Uea}',
  )();
  _.Fd = identity.Qd;
  _.tga = [];
  _.uga = [];
  _.vga = false;
  _.Cr = { ka: null };
  _.wga = Function(
    '_',
    'return function(a){_.tga[_.tga.length]=a;if(_.vga)for(let b=0;b<_.uga.length;b++)a((0,_.$b)(_.uga[b].wrap,_.uga[b]))}',
  )(_);
  const Monitor = Function(
    '_',
    'return function(a){_.Eb.call(this);this.oa=a;this.ka=!0;this.ha=!1}',
  )(_);
  Monitor.prototype = Object.create(_.Eb.prototype);
  Monitor.prototype.constructor = Monitor;
  const monitorFactory = Function(
    '_',
    'M5o',
    'var hGo=function(a,b){return(b?"__wrapper_":"__protected_")+_.Fd(a)+"__"},gGo=function(a,b){var c=hGo(a,!0);b[c]||((b[c]=iGo(a,b))[hGo(a,!1)]=b);return b[c]},iGo=function(a,b){var c=function(){if(a.isDisposed())return b.apply(this,arguments);try{return b.apply(this,arguments)}catch(d){M5o(a,d)}};c[hGo(a,!1)]=b;return c};return {gGo,hGo}',
  )(_, (_monitor: unknown, error: unknown) => {
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
  )(_);
  _.wga(Function('_', 'return function(a){_.Vj.prototype.Y_c=a(_.Vj.prototype.Y_c)}')(_));
  const monitor = new Monitor(() => {});
  monitor.ka = monitor.ha = true;
  installMonitor(monitor);
  _.Cr.ka = monitor;

  nativeInt64();
  const originalXub = (observer: object = {}) => {
    const observable = api.ybb(packet);
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
    projectOriginal: (value: any, destination: any) =>
      rLdOriginal(
        api,
        value,
        ok,
        packet.request,
        destination,
        {},
        { afe: new Set() },
        sharedState ?? {},
      ),
    singletonFormat: (enabled: boolean) => {
      singletonFormat = enabled;
    },
    namespace: _,
    nativeInt64,
    outbound: () => {
      const receiver: any = { ha: false, connection: {}, wa: [], Aa: 0 };
      _.aKd(receiver, ok, api.requestSource, approved.modeId, approved.clientTurnId);
      hJd(receiver, packet.request.textQuery);
      return { configuration: receiver.wa[0], query: receiver.wa[1], seed: receiver.oa };
    },
    nativeKf: (input: { cid?: string; rid?: string; final?: boolean }) => {
      const fields: Record<number, unknown> = {
        5: [
          _.Rh(
            new _.FF(
              wire({
                1: 'rc_49',
                2: _.Rh(new _.$Zc(['CROSSCHECK_GEMINI_OK'])),
                9: [2],
              }),
            ),
          ),
        ],
        15: input.final ?? false,
      };
      if (input.cid !== undefined || input.rid !== undefined)
        fields[2] = _.Rh(new _.CI(wire({ 1: input.cid, 2: input.rid })));
      return _.Rh(new _.IF(wire(fields)));
    },
    nativeEnvelope: contract.nativeEnvelope,
    nativeIgnored: contract.nativeIgnored,
    nativeClose: (field: 4 | 5) => _.Rh(new _.Kzd(wire({ [field]: [] }))),
    receive: (envelope: unknown, viaNative = false) => {
      incoming = envelope;
      try {
        const request = owned.connection.wq.ha.ka;
        request.ha.vk.responseText = JSON.stringify([
          [owned.connection.wq.ha.Ha + 1, ['synthetic-response']],
        ]);
        if (viaNative) request.ha.vk.onreadystatechange();
        else request.Xc({ target: request.ha });
      } finally {
        incoming = undefined;
      }
    },
    decoded: () => decoded,
    onNormalize: (hook: typeof normalizeHook) => {
      normalizeHook = hook;
    },
    onDecode: (hook: typeof decodeHook) => {
      decodeHook = hook;
    },
    receiveTrace,
    completionFlags,
    // Explicit post-source fault injection; ordinary projection always runs first.
    project: (projection: NonNullable<typeof projectResponse>) => {
      projectResponse = projection;
    },
    // Fault injection after exact original Ooa selection; Yh remains source-exact.
    onRootSelection: (hook: (backing: unknown[]) => void) => {
      oneofInstrumentation.observeRootSelection(hook);
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
        const original = sharedState.Ca.unsubscribe;
        sharedState.Ca.unsubscribe = function () {
          original.call(this);
          throw Error('synthetic-probe-unsubscribe');
        };
      },
    },
    registerIdle: (enabled = true) => {
      const manager = Object.assign(Object.create(_.JVd.prototype), {
        Na: session,
        Va: eligibility,
        Ua: api.Eb,
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
      const handshake = requests.find((r) => r.Zc === '');
      if (handshake && handshake.Aa.hU === 2) handshake.Xc({ target: handshake.ha });
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
      const transport = owned.connection.wq.ha;
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
      const request = owned.connection.wq.ha.ka;
      request.ha.vk.responseText = JSON.stringify([[1, [kind]]]);
      request.Xc({ target: request.ha });
    },
    failForward: (unknownSid = true) => {
      const request = requests.findLast((r) => r.Za.length);
      request.ha.vk.status = 400;
      request.ha.vk.responseText = unknownSid ? 'synthetic: Unknown SID' : 'Unknown SID';
      request.Xc({ target: request.ha });
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
        handshake.Xc({ target: handshake.ha });
      }
      now += 60000;
      const timeout = timers.get(request.Va)!;
      timers.delete(request.Va);
      timeout();
      if (alreadyScheduled) {
        while (pending.length) pending.shift()!();
      } else {
        const retry = timers.get(request.Aa.Ca)!;
        timers.delete(request.Aa.Ca);
        retry();
      }
    },
    cancelOriginal: () => owned.disconnect(),
    queued: () => owned?.wa,
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
