import { geminiTrialHistoryFixture } from './gemini-trial-history';
import { geminiSdkWebChannelFixture } from './gemini-sdk-webchannel';
import { geminiFixedTextContractFixture } from './gemini-fixed-text-contract';
import {
  assertGeminiTrialHistory,
  type ApprovedGeminiTrial,
  type GeminiTrialCompletion,
} from '../../../src/infrastructure/providers/gemini/fixed-text-contract';

// Current public LQaXg.js SHA-256 c59573d81446d714f3eb8104f854d02f825f822ff279679734a99e0ff4988d2f.
// Exact zero-based character spans; test-owned literals never load ignored source at runtime.
const geminiInitialStatePins = [
  {
    span: [692890, 692918],
    source: '_.agc={NWa:[],K4a:[],QRa:[]}',
  },
  {
    span: [692941, 693111],
    source:
      '_.cgc={conversationId:"",Wb:{},Kj:[],fpa:_.agc,Rvb:{},VS:void 0,pG:void 0,eG:void 0,xu:void 0,yib:void 0,r5b:!1,isTemporaryChat:!1,jt:void 0,Cua:void 0,dee:void 0,O5b:!1}',
  },
  {
    span: [693112, 693264],
    source:
      '_.dgc={iY:bgc,Jq:{},Rk:{},gHa:"",f9:{},Um:{[bgc]:_.cgc},iXc:void 0,wsa:void 0,xsa:void 0,wi:0,UYc:[bgc],xTa:{},oca:new Set,Xqb:{},cVa:void 0,dgb:void 0}',
  },
  {
    span: [693308, 693653],
    source:
      '_.wC=_.qC("bard-conversations");_.xC=_.pC(_.wC,a=>{a=a.Um[a.iY];return a!=null?a:_.cgc});_.yC=_.pC(_.xC,a=>a.conversationId);_.zC=_.pC(_.wC,a=>a.iY);_.fgc=_.pC(_.wC,a=>a!=null&&a.Rk?Object.values(a.Rk).filter(b=>!!b).filter(b=>!!b.conversationId).reduce((b,c)=>Object.assign({},b,{[c.conversationId]:c}),{}):{});_.AC=_.pC(_.yC,_.fgc,(a,b)=>b[a])',
  },
  {
    span: [693719, 693991],
    source:
      'ggc=_.pC(_.xC,a=>a.Kj);hgc=_.pC(_.xC,a=>a.Wb);igc=[];\njgc=_.pC(_.xC,a=>{var b;return((b=a.YJ)==null?0:b.length)?a.YJ.map(c=>a.Wb[c]).filter(c=>!!c):igc});_.kgc=_.pC(_.yC,ggc,hgc,jgc,(a,b,c,d)=>Object.assign({},{id:a},d.length?{lT:d}:{},{Wb:b.map(e=>c[e]).filter(e=>!!e)}))',
  },
  {
    span: [694018, 694043],
    source: '_.mgc=_.pC(_.wC,a=>a.gHa)',
  },
  {
    span: [694617, 694678],
    source: '_.tgc=_.pC(_.kgc,a=>a.Wb.length>0?a.Wb[a.Wb.length-1]:void 0)',
  },
  {
    span: [694838, 694862],
    source: '_.xgc=_.pC(_.wC,a=>a.wi)',
  },
  {
    span: [2048954, 2049054],
    source:
      '_.sN={text:"",disabled:!1,isFullscreen:!1,isPersonalContextDisabled:void 0};_.DWd={__default__:_.sN}',
  },
  {
    span: [2049067, 2049204],
    source:
      'EWd=_.qC("inputArea");_.FWd=_.pC(EWd,a=>a!=null?a:_.DWd);_.GWd=_.pC(_.FWd,a=>{var b;return(b=a==null?void 0:a.__default__)!=null?b:_.sN})',
  },
  {
    span: [2049463, 2049524],
    source: 'JWd=_.pC(_.GWd,a=>a==null?void 0:a.isPersonalContextDisabled)',
  },
  {
    span: [2107890, 2107916],
    source: 'MXd=_.pC(_.xC,a=>a.pG===2)',
  },
];
function currentInitialState(storeId: string) {
  // Only selector composition and the fresh synthetic ID are supplied by this fixture.
  const source: any = {
    qC: (key: string) => (root: any) => root[key],
    pC: (...parts: Function[]) => {
      const project = parts.pop()!;
      return (root: any) => project(...parts.map((select) => select(root)));
    },
  };
  const selected = Function(
    '_',
    'bgc',
    'var ggc,hgc,igc,jgc,EWd,JWd,MXd;\n' +
      geminiInitialStatePins.map((pin) => pin.source).join(';\n') +
      ';return {privacy:JWd,active:MXd};',
  )(source, storeId);
  return { source, ...selected };
}

// Invented page/actions/observable pipeline; no account or captured runtime data.
export function geminiSdkFixedTextTrialFixture(
  codec?: 'json' | 'protobuf',
  page?: { document: Document; window: Window; location: Location },
) {
  const contract = geminiFixedTextContractFixture();
  const savedHistory = codec ? geminiTrialHistoryFixture() : undefined;
  const native = codec ? geminiSdkWebChannelFixture(codec, true) : undefined;
  const namespace = native?.namespace ?? contract.namespace;
  if (native && savedHistory) {
    contract.packet = native.packet;
    contract.sourceConstruction = native.sourceConstruction;
    const historyNamespace = savedHistory.namespace;
    historyNamespace.La = namespace.La;
    for (const name of ['eHd', 'RI'])
      Object.setPrototypeOf(historyNamespace[name].prototype, namespace.l.prototype);
    for (const name of [
      'kl',
      'jl',
      'Kwa',
      'pna',
      'ina',
      'Ty',
      'eHd',
      'RI',
      'yK',
      'OYb',
      'Yy',
      'xxa',
      'te',
      'xe',
      'gHd',
      'Li',
      'Gi',
      'Ni',
      'Ei',
      'u5c',
      'xm',
      'Cpa',
      'Vg',
      'aba',
      'Xg',
      'ih',
      'Wg',
    ])
      namespace[name] = historyNamespace[name];
    Object.assign(native.api, { oa: savedHistory.oa, Gc: savedHistory.Gc, AHc: false, yd: false });
    savedHistory.synchronous();
    savedHistory.beforeFetch(() => {
      calls.history++;
    });
  }
  // Source-normal shared empty repeated field: assigned flags, then frozen.
  const empty: unknown[] = [];
  Object.defineProperty(empty, namespace.La, { value: 7, enumerable: true });
  namespace.Yd = Object.freeze(empty);
  // Immutable kF getter preserves an explicitly present empty field's identity.
  const explicitUsage: unknown[] = [];
  Object.defineProperty(explicitUsage, namespace.La, { value: 7, enumerable: true });
  Object.freeze(explicitUsage);
  const calls = {
    requestId: 0,
    send: 0,
    oub: 0,
    inner: 0,
    cancel: 0,
    builder: 0,
    history: 0,
    closed: 0,
  };
  const forwarded: unknown[] = [];
  const rawForwarded: unknown[] = [];
  type Observer = { next?(value: any): void; error?(error: unknown): void; complete?(): void };
  class Subscription {
    closed = false;
    private cleanups: (() => void)[] = [];
    add(cleanup: () => void) {
      if (this.closed) cleanup();
      else this.cleanups.push(cleanup);
    }
    unsubscribe() {
      if (!this.closed) {
        this.closed = true;
        for (const cleanup of this.cleanups) cleanup();
      }
    }
  }
  class kt {
    constructor(
      protected start?: (observer: Observer) => (() => void) | Subscription | undefined,
    ) {}
    subscribe(observer: Observer) {
      const sub = new Subscription();
      const wrapped = Object.assign(sub, {
        next(value: any) {
          if (!sub.closed) observer.next?.(value);
        },
        error(error: unknown) {
          if (!sub.closed) {
            observer.error?.(error);
            sub.unsubscribe();
          }
        },
        complete() {
          if (!sub.closed) {
            observer.complete?.();
            sub.unsubscribe();
          }
        },
      });
      const cleanup = this.start?.(wrapped);
      if (cleanup instanceof Subscription) sub.add(() => cleanup.unsubscribe());
      else if (cleanup) sub.add(cleanup);
      return sub;
    }
  }
  const Observable = native?.namespace.st ?? kt;
  const Teardown = native?.namespace.qt ?? Subscription;
  class Subject extends (native?.namespace.fu ?? Observable) {
    listeners = new Set<Observer>();
    constructor(
      public latest?: unknown,
      private initial = true,
    ) {
      super();
      const start = (observer: Observer) => {
        this.listeners.add(observer);
        if (this.initial) observer.next?.(this.latest);
        return () => {
          this.listeners.delete(observer);
        };
      };
      if (native) this.ha = start;
      else this.start = start;
    }
    emit(value: unknown) {
      this.latest = value;
      for (const listener of [...this.listeners]) listener.next?.(value);
    }
    fail(error: unknown = new Error('SYNTHETIC_PRIVATE')) {
      for (const listener of [...this.listeners]) listener.error?.(error);
    }
    complete() {
      for (const listener of [...this.listeners]) listener.complete?.();
    }
  }
  // The inherited field is only a fixture implementation detail.
  namespace.st = Observable;
  namespace.qt = Teardown;
  namespace.yF = Subject;
  if (!native) namespace.fu = Subject;
  namespace.uC = class {};
  if (!native) namespace.vL = class extends namespace.l {};
  const initialState = currentInitialState(contract.approved.storeId);
  namespace.zC = initialState.source.zC;
  namespace.xC = initialState.source.xC;
  if (!native) {
    namespace.wN = class {};
    namespace.gM = class {};
    namespace.UL = class {};
  }
  for (const action of [
    'uLd',
    'ELd',
    'dM',
    'rLd',
    'ILd',
    'JLd',
    'hLd',
    'sLd',
    'vLd',
    'PLd',
    'jLd',
    'RLd',
    'BLd',
    'qLd',
    'KLd',
    'OLd',
    'MLd',
    'LLd',
    'FMd',
    'AMd',
    'yMd',
  ]) {
    namespace[action] = Object.assign(() => {}, { type: 'synthetic-' + action });
  }
  const initialRoot = { 'bard-conversations': initialState.source.dgc };
  const storeId = new Subject(namespace.zC(initialRoot));
  const thread = new Subject(namespace.xC(initialRoot));
  const turns = new Subject(initialState.source.kgc(initialRoot));
  const last = new Subject(initialState.source.tgc(initialRoot));
  const actions = new Subject(undefined, false);
  const api: any =
    native?.api ??
    Object.assign(new namespace.gM(), {
      Ja: Object.assign(new namespace.UL(), { isEnabled: true }),
      Aa: false,
      Kd: false,
    });
  if (!native) {
    namespace.CKd = class {};
    namespace.cM = class {};
    namespace.zKd = class {};
    const mode = Object.assign(new namespace.cM(), { ha: 0 });
    Object.assign(api, {
      Aa: Object.assign(new namespace.CKd(), { ha: false, oa: false, ka: mode }),
      Ua: mode,
      Eb: Object.assign(new namespace.zKd(), { wa: mode }),
    });
  }
  let beforeStoreRead = () => {};
  const storeState = () => {
    beforeStoreRead();
    return {
      'bard-conversations': {
        ...initialState.source.dgc,
        iY: storeId.latest,
        Um: { [storeId.latest as string]: thread.latest },
      },
    };
  };
  const storeSource = Object.assign(new Subject(), {
    state: storeState,
    closed: false,
    Zs: false,
    hasError: false,
  });
  const conversation: any = Object.assign(native?.consumer ?? new namespace.wN(), {
    ha: api,
    oa: storeId,
    ka: thread,
    Te: turns,
    Se: last,
    Jb: actions,
    pKa: new Subject(initialState.privacy(initialRoot)),
    ui: new Subject(initialState.source.AC(initialRoot)),
    hHa: new Subject(initialState.source.mgc(initialRoot)),
    Va: new Subject(undefined),
    Vg: new Subject(initialState.source.xgc(initialRoot)),
    Si: new Subject(initialState.active(initialRoot)),
    store: Object.assign(new namespace.uC(), {
      state: storeState,
      source: storeSource,
    }),
  });
  const document =
    page?.document ??
    Object.assign(new EventTarget(), {
      documentElement: {},
      querySelectorAll: () => [],
    });
  const owner: any = page?.document.querySelector('bard-mode-switcher') ?? {
    isConnected: true,
    ownerDocument: document,
  };
  const host: any = page?.document.querySelector(
    'gem-button[data-test-id="bard-mode-menu-button"]',
  ) ?? {
    isConnected: true,
    ownerDocument: document,
    __ngContext__: 17,
    closest: () => owner,
  };
  const editor: any = page?.document.querySelector('.ql-editor') ?? {
    isConnected: true,
    ownerDocument: document,
    closest: () => undefined,
  };
  const window = page?.window ?? Object.assign(new EventTarget(), { top: undefined as unknown });
  if (!page) Object.assign(window, { top: window });
  const location = page?.location ?? { href: 'https://gemini.google.com/app' };
  namespace.SU = class {};
  const consumer: any = Object.assign(new namespace.SU(), { Oa: conversation, wc: { Sa: owner } });
  if (native) {
    namespace.YK = class {};
    namespace.QF = class {};
    const nb = new namespace.QF();
    const Ca = { Ea: () => false };
    const service = Object.assign(new namespace.YK(), { nb, Da: Ca });
    const selected = { id: contract.approved.modeId, modeCategory: contract.approved.modeCategory };
    const catalog = new Observable((next: Observer) => {
      next.next?.({ catalog: [selected] });
    });
    namespace.JAb = {};
    Object.assign(nb, { ha: () => ({ pipe: () => catalog }) });
    namespace.QF.prototype.sG = Function(
      '_',
      'return function(){return this.ha().pipe(_.v(a=>{var b,c,d=(this.Na&&_.pwc(a)?(b=a.rVa)!=null?b:[]:(c=a.kR)!=null?c:[]).filter(e=>e.yEa||this.Ha.includes(e.id)||!this.Aa&&this.Wa.includes(e.id)?!1:!0);return this.Ua?d.reverse():d}),_.sw((a,b)=>JSON.stringify(a)===JSON.stringify(b)))}',
    )({ v: (fn: Function) => fn, sw: (fn: Function) => fn });
    namespace.At = () => catalog;
    namespace.oVd = () => selected;
    Object.assign(conversation, { nb, Da: Ca, bardModeService: service });
    Object.assign(consumer, {
      nb,
      Da: Ca,
      bardModeService: service,
      Ua: false,
      host: () => 1,
      Yb: () => selected,
      Qag: () => selected.id,
      N8: () => selected.id,
      dM: () => contract.approved.thinkingLevel,
      xT: () => undefined,
    });
    Object.defineProperty(host, '__ngContext__', { value: 17, configurable: true });
    namespace.SU.Ra = { type: namespace.SU, template() {} };
    const view: any[] = Object.assign([], { 0: null, 1: { data: [] }, 2: 0, 19: 17, 28: host });
    namespace.zPb = new Map([[17, view]]);
    let child = view;
    for (const [depth, index] of [30, 29, 83].entries()) {
      const node = { index, DB: child[1] };
      const parent: any[] = Object.assign([], { 0: null, 1: { data: [] }, 2: 0, 19: 18 + depth });
      parent[1].data[index] = node;
      child[14] = parent;
      child[5] = node;
      if (index === 83) {
        const origin = Object.assign([], { 1: true, 3: parent, 5: node });
        parent[83] = origin;
        child[16] = origin;
      }
      child = parent;
    }
    child[0] = owner;
    child[8] = consumer;
    Object.assign(child[1], { type: 1, template: namespace.SU.Ra.template });
    Object.defineProperty(window, 'default_BardChatUi', { value: namespace, configurable: true });
  }
  const client = { namespace, consumer, conversation, api, host, owner };
  const controller = new AbortController();
  let active = true,
    model = true,
    draft = '',
    complete = false,
    dispatchClosed = false;
  let dispatchCurrent = () => true;
  let observer: Observer | undefined;
  let rawObserver: { next(value: unknown): void; error(): void } | undefined;
  let rawDetached = false;
  let afterFinal = () => {};
  let afterMarker = () => {};
  let beforeSubscribe = () => {};
  let beforeSend = () => {};
  let historyDelay: (() => void) | undefined;
  let deferHistory = false;
  let synchronous = false;
  let cancelError = false;
  let deferredEffect = false;
  let deferProcessing = false;
  let processedTransform: ((value: any) => any) | undefined;
  let suppressTurnAction = false;
  let deferSuccess = false;
  let suppressSuccess = false;
  let beforeComplete = () => {};
  let afterSuccess = () => {};
  let actionRequest: any = contract.packet.request;
  let suppressRouting = false;
  let beforeRouting = (_value: any) => {};
  let afterRouting = (_value: any) => {};
  let suppressContinuation = false;
  let suppressDisconnect = false;
  let beforeDisconnect = () => {};
  let afterDisconnect = () => {};
  let afterContinuation = () => {};
  let actionTurn: any;
  let storedTurn: any;
  let buffered: any;
  let wrapped: any;
  let wrappedSubscription: any;
  const final: any = {
    responseType: 'TURN',
    xj: false,
    request: {
      ...contract.packet.request,
      conversationId: contract.completed.conversationId,
      W2: '',
      Ke: [],
      IZb: [],
    },
    response: {
      turnId: contract.completed.turnId,
      draft: {
        id: contract.completed.candidateId,
        j3: contract.completed.answer,
        completeness: 'COMPLETE',
        structuredContent: { children: [{ nodeType: 18, text: contract.completed.answer }] },
      },
      isFinal: true,
      RL: false,
      d8: false,
      Oo: [],
      O9: [],
      xaa: [],
      n8a: namespace.Yd,
    },
  };
  const routing = {
    responseType: 'ROUTING',
    conversationId: contract.completed.conversationId,
    turnId: contract.completed.turnId,
    pqa: 'SYNTHETIC_ROUTING',
  };
  const marker = {
    responseType: 'TURN_COMPLETED',
    conversationId: contract.completed.conversationId,
    turnId: contract.completed.turnId,
  };
  const continuation = {
    responseType: 'CONTINUATION_UPDATE',
    conversationId: contract.completed.conversationId,
    turnId: contract.completed.turnId,
    epa: new namespace.vL([]),
  };
  const disconnect = {
    responseType: 'DISCONNECT',
    conversationId: contract.completed.conversationId,
    turnId: contract.completed.turnId,
    jGc: {},
  };
  const context = () => ({
    Ae: contract.approved.storeId,
    request: actionRequest,
    hOa: undefined,
    J2a: undefined,
    Uzb: false,
    fJa: false,
    JSd: false,
  });
  function processed(value: any) {
    actionRequest = value.request;
    actionTurn = processedTransform ? processedTransform(value) : value;
    storedTurn = processedTransform
      ? { ...actionTurn, xj: true, response: { ...actionTurn.response, timestamp: new Date(0) } }
      : actionTurn;
    thread.emit({
      conversationId: storedTurn.request.conversationId,
      Kj: [storedTurn.response.turnId],
      Wb: { [storedTurn.response.turnId]: storedTurn },
      xu: undefined,
      waa: undefined,
      pG: 2,
      eG: 2,
    });
    turns.emit(initialState.source.kgc(storeState()));
    last.emit(initialState.source.tgc(storeState()));
    if (!suppressTurnAction)
      actions.emit({
        type: namespace.uLd.type,
        turn: actionTurn,
        Yl: {
          Ae: contract.approved.storeId,
          request: actionTurn.request,
          hOa: undefined,
          J2a: undefined,
          Uzb: false,
          fJa: false,
          JSd: false,
        },
      });
  }
  function success() {
    actions.emit({
      type: namespace.ELd.type,
      Yl: {
        Ae: contract.approved.storeId,
        request: actionRequest,
        hOa: undefined,
        J2a: undefined,
        Uzb: false,
        fJa: false,
        JSd: false,
      },
    });
    afterSuccess();
  }
  if (!native)
    Object.assign(namespace.gM.prototype, {
      ybb() {
        calls.oub++;
        return new kt((next) => {
          beforeSubscribe();
          if (dispatchClosed || !dispatchCurrent()) throw new Error('closed');
          calls.inner++;
          observer = next;
          if (synchronous) {
            next.next?.(final);
            next.complete?.();
          }
          return () => {
            calls.cancel++;
            if (cancelError) throw new Error('SYNTHETIC_PRIVATE');
          };
        });
      },
    });
  Object.assign(namespace.wN.prototype, {
    Tg() {
      calls.requestId++;
      return contract.approved.clientTurnId;
    },
    sendRequest(options: Record<string, unknown>) {
      calls.send++;
      // oVd preserves these caller-owned fields without supplying missing defaults.
      Object.assign(contract.packet.request, {
        textQuery: options.textQuery,
        clientTurnId: options.clientTurnId,
        Pg: options.Pg,
        oh: options.oh,
      });
      beforeSend();
      const effect = () => {
        const stream = api.ybb(contract.packet);
        wrapped = stream;
        wrappedSubscription = stream.subscribe({
          next(value: any) {
            forwarded.push(value);
            if (value.responseType === 'ROUTING') {
              beforeRouting(value);
              if (!suppressRouting)
                actions.emit({ type: namespace.vLd.type, Wcd: value, Yl: context() });
              afterRouting(value);
            } else if (value.responseType === 'CONTINUATION_UPDATE') {
              if (!suppressContinuation)
                actions.emit({
                  type: namespace.PLd.type,
                  turnId: value.turnId,
                  conversationId: value.conversationId,
                  epa: value.epa,
                  Yl: context(),
                });
              afterContinuation();
            } else if (value.responseType === 'DISCONNECT') {
              beforeDisconnect();
              if (!suppressDisconnect) {
                const state: any = thread.latest;
                if (state.conversationId === value.conversationId) {
                  const turn = state.Wb?.[value.turnId];
                  const candidate = turn?.response.draft;
                  const changed =
                    candidate?.completeness === 'PARTIAL'
                      ? {
                          ...turn,
                          response: {
                            ...turn.response,
                            draft: { ...candidate, completeness: 'COMPLETE' },
                          },
                        }
                      : turn;
                  thread.emit({
                    ...state,
                    xu: undefined,
                    pG: 3,
                    eG: 3,
                    ...(changed ? { Wb: { ...state.Wb, [value.turnId]: changed } } : {}),
                  });
                }
                actions.emit({
                  type: namespace.RLd.type,
                  turnId: value.turnId,
                  conversationId: value.conversationId,
                  jGc: value.jGc,
                  Yl: context(),
                });
              }
              afterDisconnect();
            } else if (value.responseType === 'TURN_COMPLETED') {
              actions.emit({
                type: namespace.jLd.type,
                turnId: value.turnId,
                conversationId: value.conversationId,
                Yl: context(),
              });
              afterMarker();
            } else if (value.responseType === 'TURN') {
              if (deferProcessing) buffered = value;
              else processed(value);
              if (value.response.isFinal) afterFinal();
            }
          },
          error() {
            actions.emit({
              type: namespace.dM.type,
              Yl: { Ae: contract.approved.storeId, request: contract.packet.request },
            });
          },
          complete() {
            beforeComplete();
            complete = true;
            if (buffered) {
              processed(buffered);
              buffered = undefined;
            }
            if (!deferSuccess && !suppressSuccess) success();
          },
        });
      };
      if (deferredEffect) queueMicrotask(effect);
      else effect();
      const builder = new Teardown();
      builder.add(() => {
        calls.builder++;
      });
      return builder;
    },
  });
  function field(value: any, tag: number): any {
    const data = Array.isArray(value) ? value : value.fl;
    const tail = data.at(-1);
    const sparse = tail && Object.getPrototypeOf(tail) === Object.prototype;
    return (
      (sparse ? tail[tag] : undefined) ??
      (tag <= data.length - (sparse ? 1 : 0) ? data[tag - 1] : undefined)
    );
  }

  function projectRaw(value: any, sourceRequest = final.request) {
    const location = field(value, 6);
    const candidate = field(value, 5)[0];
    const text = field(field(candidate, 2), 1);
    const event = {
      ...final,
      request: {
        ...sourceRequest,
        conversationId: field(field(value, 2), 1),
        W2: '',
        Ke: [],
        IZb: [],
      },
      response: {
        ...final.response,
        turnId: field(field(value, 2), 2),
        isFinal: !!field(value, 15),
        eV: field(value, 20) ?? '',
        PN: field(value, 43) ?? '',
        draft: {
          ...final.response.draft,
          id: field(candidate, 1),
          Vc: { eV: field(value, 20) ?? '' },
          j3: text,
          completeness: field(field(candidate, 9), 1) === 2 ? 'COMPLETE' : 'PARTIAL',
          structuredContent: { children: [{ nodeType: 18, text }] },
        },
        // Exact default Pqd shape, with numeric canonical Boolean projection.
        kI:
          location == null
            ? undefined
            : {
                N1a: field(location, 1) ?? '',
                I4c: field(location, 2) ?? '',
                EPc: !!field(location, 3),
                m$f: field(location, 5) ?? '',
              },
      },
    };
    return event;
  }
  if (native) {
    const backing = (value: any): any =>
      Array.isArray(value) ? value.map(backing) : value && value.fl ? backing(value.fl) : value;
    contract.raw = new namespace.gHd.Pb(backing(contract.raw));
    savedHistory!.result(contract.raw);
  }
  return {
    ...contract,
    native,
    savedHistory,
    namespace,
    initialState,
    client,
    controller,
    calls,
    forwarded,
    rawForwarded,
    editor,
    document,
    window,
    location,
    host,
    owner,
    consumer,
    conversation,
    api,
    final,
    routing,
    rawRouting: contract.routing,
    marker,
    continuation,
    disconnect,
    context,
    explicitUsage,
    actions,
    thread,
    turns,
    last,
    current: () => active,
    readiness: async () => ({ model: 'Synthetic Auto', modeId: contract.approved.modeId }),
    receipt: async () => ({
      model: 'Synthetic Auto',
      metadata: {
        modeId: contract.approved.modeId,
        modeCategory: contract.approved.modeCategory,
        thinkingLevel: contract.approved.thinkingLevel,
      },
      current: () => model,
      close() {},
    }),
    guard: (current: () => boolean, incoming: { next(value: unknown): void; error(): void }) => {
      dispatchCurrent = current;
      rawObserver = incoming;
      return {
        close() {
          dispatchClosed = true;
          calls.closed++;
        },
        sent: () => calls.inner > 0,
        detach() {
          rawDetached = true;
        },
      };
    },
    history: async (
      _n: unknown,
      _api: unknown,
      _a: unknown,
      _c: unknown,
      _s: unknown,
      current: () => boolean,
    ) => {
      calls.history++;
      if (deferHistory)
        await new Promise<void>((resolve, reject) => {
          historyDelay = resolve;
          (_s as AbortSignal).addEventListener(
            'abort',
            () => reject(new Error('', { cause: 'interrupted' })),
            { once: true },
          );
        });
      if (!current()) throw new Error('', { cause: 'interrupted' });
      return assertGeminiTrialHistory(
        namespace,
        contract.raw,
        _a as ApprovedGeminiTrial,
        _c as GeminiTrialCompletion,
      );
    },
    draft: () => draft,
    wrapper: () => wrapped,
    wrapperSubscription: () => wrappedSubscription,
    process: processed,
    projectRaw,
    rawEmit: (value: unknown = contract.live) => rawObserver?.next(value),
    // Test-only normal TURN projection, after the real raw guard sees this exact caller input.
    sourceRawEmit: (value = contract.live) => {
      rawObserver?.next(value);
      if (rawDetached) return;
      rawForwarded.push(value);
      const event = projectRaw(value);
      observer?.next?.(event);
      return event;
    },
    rawError: () => rawObserver?.error(),
    rawDetached: () => rawDetached,
    emit: (value = final) => observer?.next?.(value),
    end: () => observer?.complete?.(),
    error: (error: unknown = new Error('SYNTHETIC_PRIVATE')) => observer?.error?.(error),
    stateError: (error: unknown) => turns.fail(error),
    success,
    change: {
      suppressRouting: () => {
        suppressRouting = true;
      },
      beforeRouting: (value: (event: any) => void) => {
        beforeRouting = value;
      },
      afterRouting: (value: (event: any) => void) => {
        afterRouting = value;
      },
      active: (value: boolean) => {
        active = value;
      },
      model: (value: boolean) => {
        model = value;
      },
      draft: (value: string) => {
        draft = value;
      },
      afterMarker: (value: () => void) => {
        afterMarker = value;
      },
      afterFinal: (value: () => void) => {
        afterFinal = value;
      },
      beforeSend: (value: () => void) => {
        beforeSend = value;
      },
      beforeSubscribe: (value: () => void) => {
        beforeSubscribe = value;
      },
      synchronous: () => {
        synchronous = true;
      },
      cancelError: () => {
        cancelError = true;
      },
      deferProcessing: () => {
        deferProcessing = true;
      },
      processedTurn: (value: (turn: any) => any) => {
        processedTransform = value;
      },
      beforeStoreRead: (value: () => void) => {
        beforeStoreRead = value;
      },
      suppressDisconnect: () => {
        suppressDisconnect = true;
      },
      beforeDisconnect: (value: () => void) => {
        beforeDisconnect = value;
      },
      afterDisconnect: (value: () => void) => {
        afterDisconnect = value;
      },
      suppressContinuation: () => {
        suppressContinuation = true;
      },
      afterContinuation: (value: () => void) => {
        afterContinuation = value;
      },
      suppressTurnAction: () => {
        suppressTurnAction = true;
      },
      deferSuccess: () => {
        deferSuccess = true;
      },
      suppressSuccess: () => {
        suppressSuccess = true;
      },
      beforeComplete: (value: () => void) => {
        beforeComplete = value;
      },
      afterSuccess: (value: () => void) => {
        afterSuccess = value;
      },
      deferredEffect: () => {
        deferredEffect = true;
      },
      deferHistory: () => {
        deferHistory = true;
      },
      resolveHistory: () => historyDelay?.(),
    },
    get complete() {
      return complete;
    },
    get actionTurn() {
      return actionTurn;
    },
    get storedTurn() {
      return storedTurn;
    },
    get dispatchClosed() {
      return dispatchClosed;
    },
  };
}
