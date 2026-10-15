import { geminiTrialHistoryFixture } from './gemini-trial-history';
import { geminiSdkWebChannelFixture } from './gemini-sdk-webchannel';
import { geminiFixedTextContractFixture } from './gemini-fixed-text-contract';
import {
  assertGeminiTrialHistory,
  type ApprovedGeminiTrial,
  type GeminiTrialCompletion,
} from '../../../src/infrastructure/providers/gemini/fixed-text-contract';

// Current public LQaXg.js SHA-256 e87e13cc8f9dfc509df905b29b7f4d154b6119eb4e2dd5d8efe170129d94dff6.
// Exact zero-based character spans; test-owned literals never load ignored source at runtime.
const geminiInitialStatePins = [
  {
    span: [692587, 692615],
    source: '_.Qec={GWa:[],w4a:[],LRa:[]}',
  },
  {
    span: [692638, 692808],
    source:
      '_.Sec={conversationId:"",Wb:{},Hj:[],Toa:_.Qec,wvb:{},QS:void 0,mG:void 0,bG:void 0,xu:void 0,gib:void 0,a5b:!1,isTemporaryChat:!1,jt:void 0,sua:void 0,Yce:void 0,x5b:!1}',
  },
  {
    span: [692809, 692961],
    source:
      '_.Tec={eY:Rec,Hq:{},Rk:{},bHa:"",Y8:{},Rm:{[Rec]:_.Sec},xWc:void 0,nsa:void 0,osa:void 0,ti:0,iYc:[Rec],sTa:{},mca:new Set,Dqb:{},XUa:void 0,Nfb:void 0}',
  },
  {
    span: [693005, 693350],
    source:
      '_.vC=_.pC("bard-conversations");_.wC=_.oC(_.vC,a=>{a=a.Rm[a.eY];return a!=null?a:_.Sec});_.zC=_.oC(_.wC,a=>a.conversationId);_.AC=_.oC(_.vC,a=>a.eY);_.Vec=_.oC(_.vC,a=>a!=null&&a.Rk?Object.values(a.Rk).filter(b=>!!b).filter(b=>!!b.conversationId).reduce((b,c)=>Object.assign({},b,{[c.conversationId]:c}),{}):{});_.BC=_.oC(_.zC,_.Vec,(a,b)=>b[a])',
  },
  {
    span: [693416, 693688],
    source:
      'Wec=_.oC(_.wC,a=>a.Hj);Xec=_.oC(_.wC,a=>a.Wb);Yec=[];\nZec=_.oC(_.wC,a=>{var b;return((b=a.YJ)==null?0:b.length)?a.YJ.map(c=>a.Wb[c]).filter(c=>!!c):Yec});_.$ec=_.oC(_.zC,Wec,Xec,Zec,(a,b,c,d)=>Object.assign({},{id:a},d.length?{jT:d}:{},{Wb:b.map(e=>c[e]).filter(e=>!!e)}))',
  },
  {
    span: [693715, 693740],
    source: '_.bfc=_.oC(_.vC,a=>a.bHa)',
  },
  {
    span: [694314, 694375],
    source: '_.ifc=_.oC(_.$ec,a=>a.Wb.length>0?a.Wb[a.Wb.length-1]:void 0)',
  },
  {
    span: [694535, 694559],
    source: '_.mfc=_.oC(_.vC,a=>a.ti)',
  },
  {
    span: [2047210, 2047310],
    source:
      '_.CN={text:"",disabled:!1,isFullscreen:!1,isPersonalContextDisabled:void 0};_.kWd={__default__:_.CN}',
  },
  {
    span: [2047323, 2047460],
    source:
      'lWd=_.pC("inputArea");_.mWd=_.oC(lWd,a=>a!=null?a:_.kWd);_.nWd=_.oC(_.mWd,a=>{var b;return(b=a==null?void 0:a.__default__)!=null?b:_.CN})',
  },
  {
    span: [2047719, 2047780],
    source: 'qWd=_.oC(_.nWd,a=>a==null?void 0:a.isPersonalContextDisabled)',
  },
  {
    span: [2106265, 2106291],
    source: 'tXd=_.oC(_.wC,a=>a.mG===2)',
  },
];
function currentInitialState(storeId: string) {
  // Only selector composition and the fresh synthetic ID are supplied by this fixture.
  const source: any = {
    pC: (key: string) => (root: any) => root[key],
    oC: (...parts: Function[]) => {
      const project = parts.pop()!;
      return (root: any) => project(...parts.map((select) => select(root)));
    },
  };
  const selected = Function(
    '_',
    'Rec',
    'var Wec,Xec,Yec,Zec,lWd,qWd,tXd;\n' +
      geminiInitialStatePins.map((pin) => pin.source).join(';\n') +
      ';return {privacy:qWd,active:tXd};',
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
    for (const name of ['PGd', 'RI'])
      Object.setPrototypeOf(historyNamespace[name].prototype, namespace.l.prototype);
    for (const name of [
      'kl',
      'll',
      'Kwa',
      'qna',
      'jna',
      'Uy',
      'PGd',
      'RI',
      'yK',
      'JYb',
      'Zy',
      'xxa',
      'te',
      'xe',
      'RGd',
      'Ni',
      'Ii',
      'Pi',
      'Fi',
      'p5c',
      'xm',
      'Cpa',
      'Wg',
      'aba',
      'Yg',
      'ih',
      'Xg',
    ])
      namespace[name] = historyNamespace[name];
    Object.assign(native.api, { oa: savedHistory.oa, Gc: savedHistory.Gc, yGc: false, xd: false });
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
  class Subject extends (native?.namespace.gu ?? Observable) {
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
  namespace.xF = Subject;
  if (!native) namespace.gu = Subject;
  namespace.tC = class {};
  namespace.yL = class extends namespace.l {};
  const initialState = currentInitialState(contract.approved.storeId);
  namespace.AC = initialState.source.AC;
  namespace.wC = initialState.source.wC;
  if (!native) {
    namespace.GN = class {};
    namespace.pM = class {};
    namespace.bM = class {};
  }
  for (const action of [
    '$Kd',
    'jLd',
    'mM',
    'XKd',
    'nLd',
    'oLd',
    'NKd',
    'YKd',
    'aLd',
    'wKd',
    'xKd',
    'yKd',
    'zKd',
    'uLd',
    'PKd',
    'wLd',
    'gLd',
    'CKd',
    'EKd',
    'IJd',
    'WKd',
    'pLd',
    'tLd',
    'rLd',
    'qLd',
    'kMd',
    'fMd',
    'dMd',
  ]) {
    namespace[action] = Object.assign(() => {}, { type: 'synthetic-' + action });
  }
  const initialRoot = { 'bard-conversations': initialState.source.Tec };
  const storeId = new Subject(namespace.AC(initialRoot));
  const thread = new Subject(namespace.wC(initialRoot));
  const turns = new Subject(initialState.source.$ec(initialRoot));
  const last = new Subject(initialState.source.ifc(initialRoot));
  const actions = new Subject(undefined, false);
  const api: any =
    native?.api ??
    Object.assign(new namespace.pM(), {
      Ja: Object.assign(new namespace.bM(), { isEnabled: true }),
      Aa: false,
      Kd: false,
    });
  let beforeStoreRead = () => {};
  const storeState = () => {
    beforeStoreRead();
    return {
      'bard-conversations': {
        ...initialState.source.Tec,
        eY: storeId.latest,
        Rm: { [storeId.latest as string]: thread.latest },
      },
    };
  };
  const storeSource = Object.assign(new Subject(), {
    state: storeState,
    closed: false,
    Ys: false,
    hasError: false,
  });
  const conversation: any = Object.assign(native?.consumer ?? new namespace.GN(), {
    ha: api,
    oa: storeId,
    ka: thread,
    Qe: turns,
    Oe: last,
    Jb: actions,
    kKa: new Subject(initialState.privacy(initialRoot)),
    ri: new Subject(initialState.source.BC(initialRoot)),
    cHa: new Subject(initialState.source.bfc(initialRoot)),
    Va: new Subject(undefined),
    Ug: new Subject(initialState.source.mfc(initialRoot)),
    Ti: new Subject(initialState.active(initialRoot)),
    store: Object.assign(new namespace.tC(), {
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
  namespace.ZU = class {};
  const consumer: any = Object.assign(new namespace.ZU(), { Oa: conversation, wc: { Sa: owner } });
  if (native) {
    namespace.YK = class {};
    namespace.PF = class {};
    const nb = new namespace.PF();
    const Ca = { Ea: () => false };
    const service = Object.assign(new namespace.YK(), { nb, Ca });
    const selected = { id: contract.approved.modeId, modeCategory: contract.approved.modeCategory };
    const catalog = new Observable((next: Observer) => {
      next.next?.({ catalog: [selected] });
    });
    namespace.IAb = {};
    Object.assign(nb, { ha: () => ({ pipe: () => catalog }) });
    namespace.PF.prototype.pG = Function(
      '_',
      'return function(){return this.ha().pipe(_.v(a=>{var b,c,d=(this.Na&&_.evc(a)?(b=a.mVa)!=null?b:[]:(c=a.iR)!=null?c:[]).filter(e=>e.tEa||this.Ha.includes(e.id)||!this.Aa&&this.Wa.includes(e.id)?!1:!0);return this.Sa?d.reverse():d}),_.uw((a,b)=>JSON.stringify(a)===JSON.stringify(b)))}',
    )({ v: (fn: Function) => fn, uw: (fn: Function) => fn });
    namespace.At = () => catalog;
    namespace.VUd = () => selected;
    Object.assign(conversation, { nb, Ca, bardModeService: service });
    Object.assign(consumer, {
      nb,
      Ca,
      bardModeService: service,
      Sa: false,
      host: () => 1,
      Yb: () => selected,
      r$f: () => selected.id,
      H8: () => selected.id,
      ZL: () => contract.approved.thinkingLevel,
      vT: () => undefined,
    });
    Object.defineProperty(host, '__ngContext__', { value: 17, configurable: true });
    namespace.ZU.Ra = { type: namespace.ZU, template() {} };
    const view: any[] = Object.assign([], { 0: null, 1: { data: [] }, 2: 0, 19: 17, 28: host });
    namespace.uPb = new Map([[17, view]]);
    let child = view;
    for (const [depth, index] of [30, 29, 83].entries()) {
      const node = { index, zB: child[1] };
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
    Object.assign(child[1], { type: 1, template: namespace.ZU.Ra.template });
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
      R2: '',
      Ie: [],
      rZb: [],
    },
    response: {
      turnId: contract.completed.turnId,
      draft: {
        id: contract.completed.candidateId,
        Z2: contract.completed.answer,
        completeness: 'COMPLETE',
        structuredContent: { children: [{ nodeType: 18, text: contract.completed.answer }] },
      },
      isFinal: true,
      JL: false,
      W7: false,
      No: [],
      K9: [],
      taa: [],
      a8a: namespace.Yd,
    },
  };
  const routing = {
    responseType: 'ROUTING',
    conversationId: contract.completed.conversationId,
    turnId: contract.completed.turnId,
    eqa: 'SYNTHETIC_ROUTING',
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
    Soa: new namespace.yL([]),
  };
  const disconnect = {
    responseType: 'DISCONNECT',
    conversationId: contract.completed.conversationId,
    turnId: contract.completed.turnId,
    BFc: {},
  };
  const context = () => ({
    ze: contract.approved.storeId,
    request: actionRequest,
    eOa: undefined,
    w2a: undefined,
    Azb: false,
    bJa: false,
    GRd: false,
  });
  function processed(value: any) {
    actionRequest = value.request;
    actionTurn = processedTransform ? processedTransform(value) : value;
    storedTurn = processedTransform
      ? { ...actionTurn, xj: true, response: { ...actionTurn.response, timestamp: new Date(0) } }
      : actionTurn;
    thread.emit({
      conversationId: storedTurn.request.conversationId,
      Hj: [storedTurn.response.turnId],
      Wb: { [storedTurn.response.turnId]: storedTurn },
      xu: undefined,
      saa: undefined,
      mG: 2,
      bG: 2,
    });
    turns.emit(initialState.source.$ec(storeState()));
    last.emit(initialState.source.ifc(storeState()));
    if (!suppressTurnAction)
      actions.emit({
        type: namespace.$Kd.type,
        turn: actionTurn,
        Wl: {
          ze: contract.approved.storeId,
          request: actionTurn.request,
          eOa: undefined,
          w2a: undefined,
          Azb: false,
          bJa: false,
          GRd: false,
        },
      });
  }
  function success() {
    actions.emit({
      type: namespace.jLd.type,
      Wl: {
        ze: contract.approved.storeId,
        request: actionRequest,
        eOa: undefined,
        w2a: undefined,
        Azb: false,
        bJa: false,
        GRd: false,
      },
    });
    afterSuccess();
  }
  if (!native)
    Object.assign(namespace.pM.prototype, {
      Zxb() {
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
  Object.assign(namespace.GN.prototype, {
    Vg() {
      calls.requestId++;
      return contract.approved.clientTurnId;
    },
    sendRequest(options: Record<string, unknown>) {
      calls.send++;
      // oVd preserves these caller-owned fields without supplying missing defaults.
      Object.assign(contract.packet.request, {
        textQuery: options.textQuery,
        clientTurnId: options.clientTurnId,
        Rg: options.Rg,
        uh: options.uh,
      });
      beforeSend();
      const effect = () => {
        const stream = api.Zxb(contract.packet);
        wrapped = stream;
        wrappedSubscription = stream.subscribe({
          next(value: any) {
            forwarded.push(value);
            if (value.responseType === 'ROUTING') {
              beforeRouting(value);
              if (!suppressRouting)
                actions.emit({ type: namespace.aLd.type, Xbd: value, Wl: context() });
              afterRouting(value);
            } else if (value.responseType === 'CONTINUATION_UPDATE') {
              if (!suppressContinuation)
                actions.emit({
                  type: namespace.uLd.type,
                  turnId: value.turnId,
                  conversationId: value.conversationId,
                  Soa: value.Soa,
                  Wl: context(),
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
                    mG: 3,
                    bG: 3,
                    ...(changed ? { Wb: { ...state.Wb, [value.turnId]: changed } } : {}),
                  });
                }
                actions.emit({
                  type: namespace.wLd.type,
                  turnId: value.turnId,
                  conversationId: value.conversationId,
                  BFc: value.BFc,
                  Wl: context(),
                });
              }
              afterDisconnect();
            } else if (value.responseType === 'TURN_COMPLETED') {
              actions.emit({
                type: namespace.PKd.type,
                turnId: value.turnId,
                conversationId: value.conversationId,
                Wl: context(),
              });
            } else if (value.responseType === 'TURN') {
              if (deferProcessing) buffered = value;
              else processed(value);
              if (value.response.isFinal) afterFinal();
            }
          },
          error() {
            actions.emit({
              type: namespace.mM.type,
              Wl: { ze: contract.approved.storeId, request: contract.packet.request },
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
        R2: '',
        Ie: [],
        rZb: [],
      },
      response: {
        ...final.response,
        turnId: field(field(value, 2), 2),
        isFinal: !!field(value, 15),
        bV: field(value, 20) ?? '',
        PN: field(value, 43) ?? '',
        draft: {
          ...final.response.draft,
          id: field(candidate, 1),
          Xc: { bV: field(value, 20) ?? '' },
          Z2: text,
          completeness: field(field(candidate, 9), 1) === 2 ? 'COMPLETE' : 'PARTIAL',
          structuredContent: { children: [{ nodeType: 18, text }] },
        },
        // Exact default Pqd shape, with numeric canonical Boolean projection.
        lI:
          location == null
            ? undefined
            : {
                N1a: field(location, 1) ?? '',
                I4c: field(location, 2) ?? '',
                TOc: !!field(location, 3),
                m$f: field(location, 5) ?? '',
              },
      },
    };
    return event;
  }
  if (native)
    native.project((value, sourceRequest, destination) => {
      const identity = field(value, 2);
      const ids = { conversationId: field(identity, 1), turnId: field(identity, 2) };
      const route = field(value, 21);
      if (route !== undefined)
        destination.next({
          ...routing,
          ...ids,
          eqa: field(route, 1),
          ...(field(value, 18) === undefined ? {} : { bFd: field(value, 18) }),
        });
      else if (field(value, 15)) destination.next({ ...marker, ...ids });
      else if (field(value, 5)?.length) destination.next(projectRaw(value, sourceRequest));
      const continuationValue = field(value, 46);
      if (continuationValue !== undefined)
        destination.next({ ...continuation, ...ids, Soa: continuationValue });
      if (field(value, 52) !== undefined) destination.next({ ...disconnect, ...ids });
    });
  if (native) {
    const backing = (value: any): any =>
      Array.isArray(value) ? value.map(backing) : value && value.fl ? backing(value.fl) : value;
    contract.raw = new namespace.RGd.Pb(backing(contract.raw));
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
