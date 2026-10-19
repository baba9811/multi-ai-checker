import {
  GEMINI_FIXED_TEXT_TRIAL_ANSWER,
  GEMINI_FIXED_TEXT_TRIAL_PROMPT,
} from '../../../src/application/gemini-fixed-text-trial';

// LQaXg.js SHA256 e87e13cc8f9dfc509df905b29b7f4d154b6119eb4e2dd5d8efe170129d94dff6.
// Zero-based UTF-16 spans: UXd RHS [2113154,2114707), PId success [1891468,1891496),
// RId cache [1892006,1892042), PId disabled [1890713,1890746), error [1891538,1891571).
const currentRequestExpression =
  'Object.assign({},{Ae:Tf,conversationId:(Kf?\n(Lv=uf)==null?void 0:Lv.conversationId:void 0)||((Tx=zh)==null?void 0:(Qw=Tx.request)==null?void 0:Qw.conversationId)||(Sg.Wb.length>0?Sg.id||(Hg==null?void 0:Hg.conversationId)||"":""),ej:Qt||"",oy:!zh||Kf&&(OM(zh.response)||zh.response.turnId!==((Fu=uf)==null?void 0:Fu.turnId))?"":((vn=zh.response.draft)==null?void 0:vn.id)||""},Kf&&{yj:!0},{yg:Ns,textQuery:g,Pg:k},u&&{Ke:u},w!==void 0&&{vxa:w},B&&{toolMentions:B},{oh:r,Fo:G!=null?G:0,ri:hh==null?void 0:hh.id},!pk&&{m0b:!0},C&&{k7:C},!!Ti&&{vo:Ti},\nHh&&{Cd:Hh},N&&{taskIdentifiers:N},{clientTurnId:f,xS:(Rj=Zg==null?void 0:Zg.xS)!=null?Rj:""},T&&{ux:T},{rka:ta,WFa:ya,wxa:aa,Cc:Object.assign({},da,c,((Hg==null?void 0:Hg.isTemporaryChat)||(da==null?void 0:(Iq=da.M7)==null?void 0:Iq.isTemporaryChat)||(c==null?void 0:(Jq=c.M7)==null?void 0:Jq.isTemporaryChat))&&{M7:{isTemporaryChat:!0}},a.Eb&&ek!==void 0&&{isPersonalContextDisabled:ek},tj&&((al=zh)==null?void 0:(Tm=al.response)==null?void 0:Tm.epa)&&{epa:zh.response.epa}),ff:Th},Wa&&{Odd:Wa},eb&&\n{jnb:eb},Ai&&{dmc:Ai},nj&&{bmc:nj},Ah&&{cmc:Ah},lo&&{thinkingLevel:lo},(hh==null?void 0:hh.Wo)&&{Wo:hh.Wo},Ll&&{Nj:Ll},(hh==null?void 0:hh.modeCategory)&&{b_:hh.modeCategory},ek!==void 0&&{isPersonalContextDisabled:ek},kb&&{promptSource:kb},Cb&&{isThirdPartyProfileImport:Cb},{jt:Ib!=null?Ib:Hg.jt},jc&&{Gv:jc},Vb&&{T1c:Vb},Lc&&{Yhb:Lc},bd&&{isSystemMessage:bd},wd&&{uk:wd},Hg.hF&&{hF:!0},Hg.Sx!==void 0&&{Sx:Hg.Sx},Gd&&{tQc:Gd},Jc&&{cM:Jc},On&&{eBa:On},ad&&{promptId:ad},tj&&{dRc:!0},Ee&&{Sra:!0})';
const currentProtectedSuccess = 'k=>({request:b,t8a:k,u8a:g})';
const currentProtectedCache = 'd=>({request:b,t8a:d.t8a,u8a:d.u8a})';
const currentUnprotected = '{request:b,t8a:void 0,u8a:void 0}';
// MTd callback [2026635,2026745); synthetic setter/freezer only, no observable/service execution.
const currentPrivacy =
  '([c,d])=>{if(a){var e=Object,f=e.assign,g=new _.Ixd;d=_.Ni(g,1,d?1:2);c=f.call(e,{},c,{x5d:_.Af(d)})}return c}';

// Invented wire/profile objects, never captured provider requests or account data.
export function geminiFixedTextContractFixture() {
  const calls = { constructors: 0, methods: 0 };
  const namespace: Record<string, any> = {
    La: Symbol('synthetic-jspb-flags'),
    dga: Symbol('synthetic-oneof-cache'),
    Kaa: {},
  };
  class Message {
    fl: unknown[];
    constructor(fields: unknown[] = []) {
      calls.constructors++;
      this.fl = fields;
      Object.defineProperty(fields, namespace.La, {
        value: ((fields as any)[namespace.La] ?? 2080) | 64,
        writable: true,
      });
    }
    serialize() {
      calls.methods++;
      throw new Error('SYNTHETIC_PRIVATE_MARKER');
    }
  }
  namespace.l = Message;
  for (const name of [
    'Ixd',
    'IF',
    'FF',
    'vL',
    'DAd',
    'N5c',
    'CI',
    'DI',
    'G5c',
    'AI',
    'H5c',
    'AF',
    '$Zc',
    'ul',
    '$v',
    'qH',
    'oH',
    'gH',
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
    'wL',
    'W4c',
  ])
    namespace[name] = class extends Message {};
  namespace.gHd = { Pb: class extends Message {} };
  for (const name of ['fe', 'de', 'ti', 'fi', 'uF', 'vF'])
    namespace[name] = () => {
      calls.methods++;
      throw new Error('SYNTHETIC_PRIVATE_MARKER');
    };
  const wire = (fields: Record<number, unknown>) => {
    const value: unknown[] = [];
    for (const [field, item] of Object.entries(fields)) value[Number(field) - 1] = item;
    return value;
  };
  const message = (name: string, fields: Record<number, unknown>) =>
    new namespace[name](wire(fields));
  const approved = {
    storeId: 'synthetic-store',
    clientTurnId: 'synthetic-client',
    modeId: 'synthetic-ui-mode',
    modeCategory: 'MODE_CATEGORY_AUTO',
    thinkingLevel: 'THINKING_LEVEL_STANDARD',
  };
  const completed = {
    conversationId: 'c_47',
    turnId: 'r_48',
    candidateId: 'rc_49',
    answer: GEMINI_FIXED_TEXT_TRIAL_ANSWER as typeof GEMINI_FIXED_TEXT_TRIAL_ANSWER,
  };
  const locals: Record<string, unknown> = {
    Tf: approved.storeId,
    f: approved.clientTurnId,
    g: GEMINI_FIXED_TEXT_TRIAL_PROMPT,
    k: false,
    r: false,
    Kf: false,
    uf: undefined,
    zh: undefined,
    Sg: { Wb: [] },
    Hg: {},
    Qt: '',
    Ns: 0,
    u: undefined,
    w: undefined,
    B: undefined,
    G: 0,
    hh: { id: approved.modeId, modeCategory: approved.modeCategory },
    pk: true,
    C: undefined,
    Ti: undefined,
    Hh: undefined,
    N: undefined,
    Zg: undefined,
    T: undefined,
    ta: undefined,
    ya: undefined,
    aa: undefined,
    da: undefined,
    c: undefined,
    a: { Eb: true },
    ek: undefined,
    tj: false,
    Th: 0,
    Wa: undefined,
    eb: undefined,
    Ai: undefined,
    nj: undefined,
    Ah: undefined,
    lo: approved.thinkingLevel,
    Ll: undefined,
    kb: undefined,
    Cb: undefined,
    Ib: undefined,
    jc: undefined,
    Vb: undefined,
    Lc: undefined,
    bd: undefined,
    wd: undefined,
    Gd: undefined,
    Jc: undefined,
    On: undefined,
    ad: undefined,
    Ee: undefined,
    OM: () => {
      throw Error('Unsupported synthetic parent');
    },
  };
  const sourceRequest = Function(
    ...Object.keys(locals),
    'var Lv,Tx,Qw,Fu,vn,Rj,Iq,Jq,al,Tm;return ' + currentRequestExpression,
  )(...Object.values(locals)) as Record<string, any>;
  const protect = (request: object) =>
    Function('b', 'g', 'return ' + currentProtectedSuccess)(request, '0'.repeat(32))(
      'synthetic-attestation',
    );
  const cache = (packet: any) =>
    Function('b', 'return ' + currentProtectedCache)(packet.request)(packet);
  const unprotected = (request: object) =>
    Function('b', 'return (' + currentUnprotected + ')')(request);
  const privacy = (request: object, disabled: boolean) =>
    Function(
      'a',
      '_',
      'return ' + currentPrivacy,
    )(true, {
      Ixd: namespace.Ixd,
      Ni: (value: any, field: number, item: unknown) => {
        value.fl[field - 1] = item;
        return value;
      },
      Af: (value: any) => value,
    })([request, disabled]);
  const packet = protect(sourceRequest) as {
    request: Record<string, any>;
    t8a: string;
    u8a: string;
  };
  const identity = message('CI', { 1: completed.conversationId, 2: completed.turnId });
  const parents = message('DI', {});
  const query = message('AI', { 1: GEMINI_FIXED_TEXT_TRIAL_PROMPT });
  const request = message('G5c', { 1: query, 5: approved.modeId });
  const text = message('$Zc', { 1: completed.answer });
  const status = wire({ 1: 2 });
  const candidate = message('AF', { 1: completed.candidateId, 2: text, 9: status });
  const response = message('H5c', { 1: [candidate], 4: completed.candidateId, 10: true });
  const turn = message('N5c', { 1: identity, 2: parents, 3: request, 4: response });
  const raw = new namespace.gHd.Pb(wire({ 1: [turn] }));
  const live = message('IF', { 2: identity, 5: [candidate], 15: true });
  const routing = message('IF', { 2: identity, 21: message('DAd', { 1: 'SYNTHETIC_ROUTING' }) });
  namespace.$L = [1, 2, 3, 4, 5, 6];
  namespace.ZL = [2, 3, 5, 6, 7, 8, 9];
  namespace.SJd = [1, 2];
  namespace.YL = [3, 4];
  namespace.HF = [11, 21, 23, 28, 37, 49, 51];
  namespace.pH = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27,
    28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
    76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95,
  ];
  namespace.XL = [1, 2, 3, 4];
  namespace.HJd = [6, 8];
  namespace.VL = [3, 4, 6, 7, 8, 9];
  namespace.SL = () => undefined;
  const tHd = Function(
    '_',
    'return class extends _.l{constructor(a){super(a)}getResponse(){return _.m(this,_.M5c,2)}}',
  )(namespace);
  const QGd = Function('_', 'return class extends _.l{constructor(a){super(a)}}')(namespace);
  // Synthetic, inert source fingerprints: never invoked, no provider cache is evaluated.
  const sources = {
    m: 'function(a,b,c,d){var e=a.fl,f=e[_.La]|0;b=Qoa(e,f,b,c,d);if(b==null)return b;f=e[_.La]|0;if(!_.Ra(a,f)){let g=_.Lg(b);g!==b&&(_.ub(a)&&(e=a.fl,f=e[_.La]|0),b=g,f=_.xb(e,f,c,b,d),_.Mg(e,f))}return b}',
    Ph: 'function(a,b,c,d){a=a.fl;return Qoa(a,a[_.La]|0,b,c,d)||b[_.Xd]||(b[_.Xd]=_.iba(b))}',
    Lg: 'function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?_.Rba(a,b,c)?_.Qba(a,b,!0):new a.constructor(_.tb(b,c,!1)):a}',
    Af: 'function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?a:_.Rba(a,b,c)?_.Qba(a,b):new a.constructor(_.tb(b,c,!0))}',
    Gh: 'function(a,b,c,d,e){d=Qpa(d);_.Vh(a,c,d,e);d&&!_.Ra(d)&&_.Mg(a.fl);return a}',
    ub: 'function(a){if(a.Fb!==_.Kaa)return!1;var b=a.fl;b=_.tb(b,b[_.La]|0);_.Ma(b,2048);a.fl=b;_.Laa(a,!1);a.tcc=void 0;return!0}',
    Ra: 'function(a,b){return b===void 0?a.Fb!==_.Kaa&&!!(2&(a.fl[_.La]|0)):!!(2&b)&&a.Fb!==_.Kaa}',
    dDb: 'function(a){return Object.assign({},{locale:"ko",requestSource:a.requestSource},a.modeId!==void 0?{modeId:a.modeId}:{},a.turnId!==void 0?{turnId:a.turnId}:{})}',
    EJd: 'function(a,b){return _.Gh(a,_.$Ad,1,b)}',
    FJd: 'function(a,b){return _.Ii(a,2,b)}',
  };
  for (const [name, source] of Object.entries(sources))
    namespace[name] = Function(`return ${source}`)();
  const frozen = (value: any) => {
    value.fl[namespace.La] |= 2;
    return value;
  };
  function nativeKf(input: { cid?: string; rid?: string; final?: boolean }): object {
    const fields: Record<number, unknown> = {
      5: [message('FF', { 1: completed.candidateId, 2: text, 9: status })],
      15: input.final ?? false,
    };
    if (input.cid !== undefined || input.rid !== undefined)
      fields[2] = message('CI', { 1: input.cid, 2: input.rid });
    return frozen(message('IF', fields));
  }
  function nativeEnvelope(
    raw: object,
    ancillary: {
      hjd?: Record<number, unknown>;
      ajd?: Record<number, unknown>;
      holder?: Record<number, unknown>;
    } = {},
  ): object {
    const holder = wire({ ...ancillary.holder, 4: raw }),
      ajd = wire({ ...ancillary.ajd, 4: holder });
    return frozen(message('Kzd', { 2: wire({ ...ancillary.hjd, 7: wire({ 1: ajd }) }) }));
  }
  function nativeIgnored(
    owner: 'root' | 'hjd' | 'bjd' | 'ajd',
    field: number,
    payload: unknown = ['SYNTHETIC_IGNORED', { marker: true }],
  ): object {
    let fields: Record<number, unknown> = { [field]: payload };
    if (owner === 'ajd') fields = { 1: wire(fields) };
    if (owner === 'ajd' || owner === 'bjd') fields = { 7: wire(fields) };
    if (owner !== 'root') fields = { 2: wire(fields) };
    return frozen(message('Kzd', fields));
  }
  function normalizeNative(
    envelope: object,
    prior: { cid: string; rid: string },
  ): { hf: object; aa: object } {
    // Independent source-shaped getters and normalization, never the contract projection.
    const flag = namespace.La,
      sentinel = namespace.Kaa;
    const immutable = (value: any) => !!(value.fl[flag] & 2) && value.Fb !== sentinel;
    const cloneArray = (raw: any[], freeze = false) => {
      const result = raw.slice();
      Object.defineProperty(result, flag, {
        value: ((raw as any)[flag] & 16769217) | 32 | (freeze ? 2 : 0),
        writable: true,
      });
      return result;
    };
    const mutable = (value: any) => {
      if (!immutable(value)) return value;
      const result = new value.constructor(value.fl);
      result.Fb = sentinel;
      result.tcc = sentinel;
      return result;
    };
    const detach = (value: any) => {
      if (value.Fb === sentinel) {
        value.fl = cloneArray(value.fl);
        value.fl[flag] |= 2048;
        value.Fb = undefined;
        value.tcc = undefined;
      }
    };
    const get = (parent: any, field: number, constructor: any, ordinary = false) => {
      let child = parent.fl[field - 1];
      if (child == null) return child;
      if (Array.isArray(child)) {
        Object.defineProperty(child, flag, {
          value: ((child as any)[flag] ?? 0) | (parent.fl[flag] & (32 | 2)),
          writable: true,
        });
        child = new constructor(child);
        parent.fl[field - 1] = child;
      }
      if (ordinary && !immutable(parent)) {
        const changed = mutable(child);
        if (changed !== child) {
          detach(parent);
          parent.fl[field - 1] = changed;
          parent.fl[flag] |= 4096;
          child = changed;
        }
      }
      return child;
    };
    const oneof = (parent: any, fields: number[], field: number, constructor: any) => {
      const cache = parent.fl[namespace.dga] ?? (parent.fl[namespace.dga] = new Map());
      if (!cache.has(fields)) {
        let selected = 0;
        for (const candidate of fields)
          if (parent.fl[candidate - 1] != null) {
            if (selected) parent.fl[selected - 1] = undefined;
            selected = candidate;
          }
        cache.set(fields, selected);
      }
      return get(parent, cache.get(fields) === field ? field : -1, constructor);
    };
    const b = oneof(envelope, namespace.$L, 2, namespace.XJd),
      w = oneof(b, namespace.ZL, 7, namespace.RJd),
      v = oneof(w, namespace.SJd, 1, namespace.QJd),
      wrapper = oneof(v, namespace.YL, 4, tHd);
    const raw = get(wrapper, 4, namespace.IF, true),
      incoming = get(raw, 2, namespace.CI, true);
    const c = incoming?.fl[0] || '',
      r = incoming?.fl[1] || '';
    const aa = frozen(message('CI', { 1: c || prior.cid, 2: r || prior.rid }));
    let kf = raw;
    if (!r || (!c && prior.cid)) {
      const view = mutable(raw);
      detach(view);
      view.fl[1] = aa;
      if (view.fl[flag] & 32 && !(view.fl[flag] & 4096)) {
        view.fl[flag] |= 2;
        view.Fb = sentinel;
        kf = new namespace.IF(view.fl);
        kf.tcc = sentinel;
      } else kf = new namespace.IF(cloneArray(view.fl, true));
    }
    return { hf: kf, aa };
  }
  function nativeConfiguration(ok: object = message('wL', { 1: 'synthetic-ok' })) {
    const metadata = message('$Ad', {
      1: 1,
      2: approved.modeId,
      3: 'ko',
      4: approved.clientTurnId,
    });
    const payload = new QGd(wire({ 1: ok, 4: 1 }));
    return {
      ok,
      value: message('JJd', {
        1: message('GJd', { 1: metadata, 2: 0, 8: message('DJd', { 5: payload }) }),
      }),
    };
  }
  return {
    sourceConstruction: { protect, cache, unprotected, privacy },
    nativeKf,
    nativeEnvelope,
    nativeIgnored,
    normalizeNative,
    nativeConfiguration,
    tHd,
    QGd,
    frozen,
    routing,
    namespace,
    approved,
    completed,
    packet,
    raw,
    live,
    calls,
    wire,
    message,
    identity,
    parents,
    query,
    request,
    text,
    status,
    candidate,
    response,
    turn,
  };
}
