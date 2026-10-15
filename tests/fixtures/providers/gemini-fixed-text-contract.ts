import {
  GEMINI_FIXED_TEXT_TRIAL_ANSWER,
  GEMINI_FIXED_TEXT_TRIAL_PROMPT,
} from '../../../src/application/gemini-fixed-text-trial';

// LQaXg.js SHA256 e87e13cc8f9dfc509df905b29b7f4d154b6119eb4e2dd5d8efe170129d94dff6.
// Zero-based UTF-16 spans: UXd RHS [2113154,2114707), PId success [1891468,1891496),
// RId cache [1892006,1892042), PId disabled [1890713,1890746), error [1891538,1891571).
const currentRequestExpression =
  'Object.assign({},{ze:pg,conversationId:(vf?\n(Iv=kf)==null?void 0:Iv.conversationId:void 0)||((Tx=Ch)==null?void 0:(Pw=Tx.request)==null?void 0:Pw.conversationId)||(ig.Wb.length>0?ig.id||(Gg==null?void 0:Gg.conversationId)||"":""),yj:Nt||"",hz:!Ch||vf&&($M(Ch.response)||Ch.response.turnId!==((Au=kf)==null?void 0:Au.turnId))?"":((vn=Ch.response.draft)==null?void 0:vn.id)||""},vf&&{zj:!0},{xg:Ns,textQuery:g,Rg:k},u&&{Ie:u},w!==void 0&&{mxa:w},B&&{toolMentions:B},{uh:r,Po:G!=null?G:0,wi:eh==null?void 0:eh.id},!ok&&{V_b:!0},C&&{g7:C},!!Ti&&{vo:Ti},\nFh&&{Cd:Fh},N&&{taskIdentifiers:N},{clientTurnId:f,vS:(Qj=Hi==null?void 0:Hi.vS)!=null?Qj:""},T&&{qx:T},{kka:ta,RFa:ya,nxa:aa,Cc:Object.assign({},da,c,((Gg==null?void 0:Gg.isTemporaryChat)||(da==null?void 0:(Hq=da.jba)==null?void 0:Hq.isTemporaryChat)||(c==null?void 0:(Iq=c.jba)==null?void 0:Iq.isTemporaryChat))&&{jba:{isTemporaryChat:!0}},a.Eb&&dk!==void 0&&{isPersonalContextDisabled:dk},rj&&((Zk=Ch)==null?void 0:(Sm=Zk.response)==null?void 0:Sm.Soa)&&{Soa:Ch.response.Soa}),hf:Rh},Wa&&{Ocd:Wa},eb&&\n{Qmb:eb},yi&&{Dlc:yi},mj&&{Blc:mj},xh&&{Clc:xh},ko&&{thinkingLevel:ko},(eh==null?void 0:eh.Uo)&&{Uo:eh.Uo},Kl&&{Lj:Kl},(eh==null?void 0:eh.modeCategory)&&{WZ:eh.modeCategory},dk!==void 0&&{isPersonalContextDisabled:dk},nb&&{promptSource:nb},Bb&&{isThirdPartyProfileImport:Bb},{jt:Ib!=null?Ib:Gg.jt},jc&&{Fv:jc},Xb&&{f1c:Xb},Jc&&{Hhb:Jc},Zc&&{isSystemMessage:Zc},ud&&{uk:ud},Gg.eF&&{eF:!0},Gg.Sx!==void 0&&{Sx:Gg.Sx},Gd&&{HPc:Gd},Lc&&{YL:Lc},On&&{WAa:On},bd&&{promptId:bd},rj&&{A7b:!0},Fe&&{kAa:!0})';
const currentProtectedSuccess = 'k=>({request:b,g8a:k,h8a:g})';
const currentProtectedCache = 'd=>({request:b,g8a:d.g8a,h8a:d.h8a})';
const currentUnprotected = '{request:b,g8a:void 0,h8a:void 0}';
// MTd callback [2026635,2026745); synthetic setter/freezer only, no observable/service execution.
const currentPrivacy =
  '([c,d])=>{if(a){var e=Object,f=e.assign,g=new _.wxd;d=_.Pi(g,1,d?1:2);c=f.call(e,{},c,{s4d:_.Bf(d)})}return c}';

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
    'wxd',
    'HF',
    'yL',
    'qAd',
    'I5c',
    'CI',
    'DI',
    'G5c',
    'AI',
    'H5c',
    'zF',
    'XZc',
    'vl',
    'bw',
    'rH',
    'pH',
    'hH',
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
    'zL',
    'R4c',
  ])
    namespace[name] = class extends Message {};
  namespace.RGd = { Pb: class extends Message {} };
  for (const name of ['fe', 'de', 'oi', 'hi', 'tF', 'uF'])
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
    pg: approved.storeId,
    f: approved.clientTurnId,
    g: GEMINI_FIXED_TEXT_TRIAL_PROMPT,
    k: false,
    r: false,
    vf: false,
    kf: undefined,
    Ch: undefined,
    ig: { Wb: [] },
    Gg: {},
    Nt: '',
    Ns: 0,
    u: undefined,
    w: undefined,
    B: undefined,
    G: 0,
    eh: { id: approved.modeId, modeCategory: approved.modeCategory },
    ok: true,
    C: undefined,
    Ti: undefined,
    Fh: undefined,
    N: undefined,
    Hi: undefined,
    T: undefined,
    ta: undefined,
    ya: undefined,
    aa: undefined,
    da: undefined,
    c: undefined,
    a: { Eb: true },
    dk: undefined,
    rj: false,
    Rh: 0,
    Wa: undefined,
    eb: undefined,
    yi: undefined,
    mj: undefined,
    xh: undefined,
    ko: approved.thinkingLevel,
    Kl: undefined,
    nb: undefined,
    Bb: undefined,
    Ib: undefined,
    jc: undefined,
    Xb: undefined,
    Jc: undefined,
    Zc: undefined,
    ud: undefined,
    Gd: undefined,
    Lc: undefined,
    On: undefined,
    bd: undefined,
    Fe: undefined,
    $M: () => {
      throw Error('Unsupported synthetic parent');
    },
  };
  const sourceRequest = Function(
    ...Object.keys(locals),
    'var Iv,Tx,Pw,Au,vn,Qj,Hq,Iq,Zk,Sm;return ' + currentRequestExpression,
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
      wxd: namespace.wxd,
      Pi: (value: any, field: number, item: unknown) => {
        value.fl[field - 1] = item;
        return value;
      },
      Bf: (value: any) => value,
    })([request, disabled]);
  const packet = protect(sourceRequest) as {
    request: Record<string, any>;
    g8a: string;
    h8a: string;
  };
  const identity = message('CI', { 1: completed.conversationId, 2: completed.turnId });
  const parents = message('DI', {});
  const query = message('AI', { 1: GEMINI_FIXED_TEXT_TRIAL_PROMPT });
  const request = message('G5c', { 1: query, 5: approved.modeId });
  const text = message('XZc', { 1: completed.answer });
  const status = wire({ 1: 2 });
  const candidate = message('zF', { 1: completed.candidateId, 2: text, 9: status });
  const response = message('H5c', { 1: [candidate], 4: completed.candidateId, 10: true });
  const turn = message('I5c', { 1: identity, 2: parents, 3: request, 4: response });
  const raw = new namespace.RGd.Pb(wire({ 1: [turn] }));
  const live = message('HF', { 2: identity, 5: [candidate], 15: true });
  const routing = message('HF', { 2: identity, 21: message('qAd', { 1: 'SYNTHETIC_ROUTING' }) });
  namespace.hM = [1, 2, 3, 4, 5, 6];
  namespace.gM = [2, 3, 5, 6, 7, 8, 9];
  namespace.CJd = [1, 2];
  namespace.fM = [3, 4];
  namespace.eM = [1, 2, 3, 4];
  namespace.rJd = [6, 8];
  namespace.cM = [3, 4, 6, 7, 8, 9];
  namespace.$L = () => undefined;
  const tHd = Function(
    '_',
    'return class extends _.l{constructor(a){super(a)}getResponse(){return _.m(this,_.H5c,2)}}',
  )(namespace);
  const QGd = Function('_', 'return class extends _.l{constructor(a){super(a)}}')(namespace);
  // Synthetic, inert source fingerprints: never invoked, no provider cache is evaluated.
  const sources = {
    m: 'function(a,b,c,d){var e=a.fl,f=e[_.La]|0;b=Qoa(e,f,b,c,d);if(b==null)return b;f=e[_.La]|0;if(!_.Ra(a,f)){let g=_.Mg(b);g!==b&&(_.ub(a)&&(e=a.fl,f=e[_.La]|0),b=g,f=_.yb(e,f,c,b,d),_.Ng(e,f))}return b}',
    Qh: 'function(a,b,c,d){a=a.fl;return Qoa(a,a[_.La]|0,b,c,d)||b[_.Xd]||(b[_.Xd]=_.iba(b))}',
    Mg: 'function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?_.Rba(a,b,c)?_.Qba(a,b,!0):new a.constructor(_.tb(b,c,!1)):a}',
    Bf: 'function(a){var b=a.fl,c=b[_.La]|0;return _.Ra(a,c)?a:_.Rba(a,b,c)?_.Qba(a,b):new a.constructor(_.tb(b,c,!0))}',
    Hh: 'function(a,b,c,d,e){d=Qpa(d);_.Wh(a,c,d,e);d&&!_.Ra(d)&&_.Ng(a.fl);return a}',
    ub: 'function(a){if(a.Fb!==_.Kaa)return!1;var b=a.fl;b=_.tb(b,b[_.La]|0);_.Ma(b,2048);a.fl=b;_.Laa(a,!1);a.Xbc=void 0;return!0}',
    Ra: 'function(a,b){return b===void 0?a.Fb!==_.Kaa&&!!(2&(a.fl[_.La]|0)):!!(2&b)&&a.Fb!==_.Kaa}',
    $Cb: 'function(a){return Object.assign({},{locale:"ko",requestSource:a.requestSource},a.modeId!==void 0?{modeId:a.modeId}:{},a.turnId!==void 0?{turnId:a.turnId}:{})}',
    oJd: 'function(a,b){return _.Hh(a,_.LAd,1,b)}',
    pJd: 'function(a,b){return _.Ki(a,2,b)}',
  };
  for (const [name, source] of Object.entries(sources))
    namespace[name] = Function(`return ${source}`)();
  const frozen = (value: any) => {
    value.fl[namespace.La] |= 2;
    return value;
  };
  function nativeKf(input: { cid?: string; rid?: string; final?: boolean }): object {
    const fields: Record<number, unknown> = { 5: [candidate], 15: input.final ?? false };
    if (input.cid !== undefined || input.rid !== undefined)
      fields[2] = message('CI', { 1: input.cid, 2: input.rid });
    return frozen(message('HF', fields));
  }
  function nativeEnvelope(raw: object): object {
    return frozen(message('xzd', { 2: wire({ 7: wire({ 1: wire({ 4: wire({ 4: raw }) }) }) }) }));
  }
  function normalizeNative(
    envelope: object,
    prior: { cid: string; rid: string },
  ): { kf: object; aa: object } {
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
      result.Xbc = sentinel;
      return result;
    };
    const detach = (value: any) => {
      if (value.Fb === sentinel) {
        value.fl = cloneArray(value.fl);
        value.fl[flag] |= 2048;
        value.Fb = undefined;
        value.Xbc = undefined;
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
    const b = oneof(envelope, namespace.hM, 2, namespace.HJd),
      w = oneof(b, namespace.gM, 7, namespace.BJd),
      v = oneof(w, namespace.CJd, 1, namespace.AJd),
      wrapper = oneof(v, namespace.fM, 4, tHd);
    const raw = get(wrapper, 4, namespace.HF, true),
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
        kf = new namespace.HF(view.fl);
        kf.Xbc = sentinel;
      } else kf = new namespace.HF(cloneArray(view.fl, true));
    }
    return { kf, aa };
  }
  function nativeConfiguration(ok: object = message('zL', { 1: 'synthetic-ok' })) {
    const metadata = message('LAd', {
      1: 1,
      2: approved.modeId,
      3: 'ko',
      4: approved.clientTurnId,
    });
    const payload = new QGd(wire({ 1: ok, 4: 1 }));
    return {
      ok,
      value: message('tJd', {
        1: message('qJd', { 1: metadata, 2: 0, 8: message('nJd', { 5: payload }) }),
      }),
    };
  }
  return {
    sourceConstruction: { protect, cache, unprotected, privacy },
    nativeKf,
    nativeEnvelope,
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
