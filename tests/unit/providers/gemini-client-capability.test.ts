import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readGeminiClientCapability } from '../../../src/infrastructure/providers/gemini/client-capability';

// Invented source-profile objects; no captured account, conversation or runtime values.
function fixture() {
  const calls = vi.fn(() => {
    throw new Error('SYNTHETIC_PRIVATE_MARKER');
  });
  const namespace: Record<string, any> = {};
  for (const name of ['FVb', 'zw', 'wN', 'gM', 'UL', 'xKd', 'AKd', 'SU']) {
    namespace[name] = function () {
      calls();
    };
    for (const method of [
      'get',
      'LAa',
      'k2b',
      'qA',
      'x',
      'tw',
      'snapshot',
      'h5a',
      'JEa',
      'register',
      'sendRequest',
      'ybb',
    ])
      namespace[name].prototype[method] = calls;
  }
  for (const name of ['uC', 'KL', 'RHd'])
    namespace[name] = Object.assign(Object.create(namespace.zw.prototype), {
      RTc: 'InjectionToken',
    });
  for (const name of ['uC', 'KL', 'UL', 'xKd', 'AKd', 'RHd'])
    namespace[name].Za = { token: namespace[name], kb: 'root', Xa: calls };
  namespace.wKd = calls;
  const conversation = Object.create(namespace.wN.prototype);
  const api = Object.assign(Object.create(namespace.gM.prototype), { Kd: true });
  const protection = Object.assign(Object.create(namespace.UL.prototype), { isEnabled: true });
  const session = Object.assign(Object.create(namespace.xKd.prototype), { wa: true });
  const registry = Object.create(namespace.AKd.prototype);
  conversation.ha = api;
  Object.assign(api, { Ja: protection, Ab: session, Fb: registry, Ia: { unrelated: true } });
  namespace.CKd = class {};
  namespace.cM = class {};
  namespace.zKd = class {};
  const mode = Object.assign(Object.create(namespace.cM.prototype), { ha: 67 });
  const eligibility = Object.assign(Object.create(namespace.CKd.prototype), {
    ha: true,
    oa: false,
    ka: mode,
  });
  const headers = Object.assign(Object.create(namespace.zKd.prototype), { wa: mode });
  Object.assign(api, { Aa: eligibility, Ua: mode, Eb: headers });
  const values = {
    uC: conversation,
    KL: api,
    UL: protection,
    xKd: session,
    AKd: registry,
    RHd: true,
  };
  const cache = new Map();
  for (const [name, value] of Object.entries(values))
    cache.set(namespace[name], { value, Xa: namespace[name].Za.Xa, Ig: undefined });
  const injector = Object.assign(Object.create(namespace.FVb.prototype), {
    oq: cache,
    scopes: new Set(['root']),
    parent: null,
    ig: false,
  });
  const document = { querySelectorAll: vi.fn(() => [host]) };
  class Element {
    isConnected = true;
    ownerDocument = document;
    parentNode: object | null = {};
    hidden = false;
    getClientRects() {
      return [{ width: this.hidden ? 0 : 20, height: 20 }];
    }
    closest(selector: string): Element | null {
      if (selector === '[hidden], [inert], [aria-hidden="true"]') return null;
      if (selector === 'gem-button') return host;
      if (selector.startsWith('bard-mode-switcher')) return owner;
      return null;
    }
    querySelectorAll() {
      return [button];
    }
  }
  const host = new Element() as Element & { __ngContext__?: unknown };
  class Comment {
    isConnected = true;
    ownerDocument = document;
    parentNode: object | null = host.parentNode;
  }
  const owner = new Element();
  const button = new Element();
  host.__ngContext__ = 7;
  const view: any[] = [];
  Object.assign(view, { 0: null, 1: {}, 2: 0, 9: injector, 19: 7, 28: host });
  namespace.zPb = new Map([[7, view]]);
  namespace.UOb = function () {}; // Current public UOb is unrelated to the view registry.
  namespace.SU.Ra = { type: namespace.SU, template: calls };
  const consumer = Object.assign(Object.create(namespace.SU.prototype), { Oa: conversation });
  const declarations = [view];
  const declarationNodes: any[] = [];
  for (const [depth, index] of [30, 29, 83].entries()) {
    const child = declarations[depth]!;
    const node = { index, DB: child[1] };
    const data: any[] = [];
    data[index] = node;
    const parent: any[] = Object.assign([], { 0: null, 1: { data }, 2: 0, 19: 10 + depth });
    child[14] = parent;
    child[5] = node;
    if (index === 83) {
      const origin: any[] = Object.assign([], { 1: true, 3: parent, 5: node });
      parent[83] = origin;
      child[16] = origin;
    }
    declarations.push(parent);
    declarationNodes.push(node);
  }
  const componentView = declarations[3]!;
  componentView[0] = owner;
  componentView[8] = consumer;
  componentView[1].type = 1;
  componentView[1].template = namespace.SU.Ra.template;

  const window = { default_BardChatUi: namespace } as any;
  window.top = window;
  vi.stubGlobal('window', window);
  vi.stubGlobal('document', document);
  vi.stubGlobal('location', { href: 'https://gemini.google.com/app' });
  vi.stubGlobal('HTMLElement', Element);
  vi.stubGlobal('Comment', Comment);
  vi.stubGlobal('getComputedStyle', () => ({ display: 'block', visibility: 'visible' }));
  for (const name of ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource'])
    vi.stubGlobal(name, calls);
  for (const [object, key] of [
    [namespace.zw.prototype, 'Ig'],
    [namespace.FVb.prototype, 'Yf'],
    [namespace.xKd.prototype, 'wa'],
    [window, 'WIZ_global_data'],
    [api, 'headers'],
    [api, 'ha'],
    [consumer, 'ha'],
    [session, 'ha'],
    [session, 'ka'],
  ] as const)
    Object.defineProperty(object, key, { get: calls, configurable: true });
  return {
    calls,
    namespace,
    conversation,
    api,
    protection,
    session,
    registry,
    cache,
    injector,
    document,
    host,
    owner,
    button,
    view,
    window,
    Element,
    Comment,
    consumer,
    declarations,
    declarationNodes,
    componentView,
  };
}
let current: ReturnType<typeof fixture>;
beforeEach(() => {
  current = fixture();
});
afterEach(() => {
  expect(current.calls).not.toHaveBeenCalled();
  vi.unstubAllGlobals();
});

function check(reason?: string, serialized = false) {
  const read = serialized
    ? (new Function(
        `return (${readGeminiClientCapability.toString()});`,
      )() as typeof readGeminiClientCapability)
    : readGeminiClientCapability;
  const result = read();
  expect(result).toEqual(reason ? { status: 'unsupported', reason } : { status: 'candidate' });
  expect(JSON.stringify(result)).not.toContain('SYNTHETIC_PRIVATE_MARKER');
}
const getter = (object: object, key: PropertyKey) =>
  Object.defineProperty(object, key, {
    get: current.calls,
    configurable: true,
  });
function registeredIdle(nativeSse = true, enabled = true, ownUndefined = false) {
  current.session.wa = nativeSse;
  current.cache.get(current.namespace.RHd).value = nativeSse;
  current.namespace.JVd = function () {
    current.calls();
  };
  for (const method of ['isEnabled', 'Pff', 'Ryc', 'Aa', 'oa'])
    current.namespace.JVd.prototype[method] = current.calls;
  const manager = Object.assign(Object.create(current.namespace.JVd.prototype), {
    Na: current.session,
    Oa: current.conversation,
    Va: current.api.Aa,
    Ua: current.api.Eb,
    ka: false,
    Za: enabled,
    kb: nativeSse,
  });
  if (ownUndefined) for (const key of ['ha', 'wa', 'Ja', 'Ga']) manager[key] = undefined;
  getter(manager, 'Wa');
  current.registry.ha = manager;
  return manager;
}
function slotContainer() {
  const node = { index: 28, type: 2, value: 'gem-button' };
  const tviewData: any[] = [];
  tviewData[28] = node;
  current.view[1].data = tviewData;
  const child: any[] = Object.assign([], {
    0: current.host,
    1: {},
    2: 0,
    3: current.view,
    5: node,
    14: current.view,
    19: 8,
  });
  const anchor = new current.Comment();
  Object.defineProperty(anchor, 'textContent', { get: current.calls });
  const container: any[] = Object.assign([], {
    0: child,
    1: true,
    2: 0,
    3: current.view,
    5: node,
    7: anchor,
  });
  current.view[28] = container;
  return { container, child, node, tviewData, anchor };
}

describe('Gemini actual consumer client capability', () => {
  it('admits the fresh source registry without a historical registry alias', () => {
    expect(Object.hasOwn(current.namespace, 'zPb')).toBe(true);
    expect(Object.hasOwn(current.namespace, 'fPb')).toBe(false);
    check();
  });
  it('accepts only the current loaded-source owner and selected SDK references', () => {
    check();
    current.namespace.UOb = current.namespace.zPb;
    delete current.namespace.zPb;
    check('owner-view-registry');
  });
  it('shares confirmed references only with a synchronous provider-private capture', () => {
    let captured: unknown;
    const result = readGeminiClientCapability((client) => {
      captured = client;
    });
    expect(captured).toEqual({
      namespace: current.namespace,
      consumer: current.consumer,
      conversation: current.conversation,
      api: current.api,
      host: current.host,
      owner: current.owner,
    });
    expect(result).toEqual({ status: 'candidate' });
    expect(Object.keys(result)).toEqual(['status']);
  });
  it('captures the existing RPC consumer without applying the native-only gates', () => {
    current.api.Aa.ha = false;
    current.api.Kd = false;
    getter(current.session, 'wa');
    getter(current.registry, 'ha');
    const capture = vi.fn();
    expect(readGeminiClientCapability(capture)).toEqual({
      status: 'unsupported',
      reason: 'transport-rpc',
    });
    expect(capture).toHaveBeenCalledTimes(1);
    expect(capture.mock.calls[0]![0].api).toBe(current.api);
  });
  it.each(['owner', 'service-identity', 'protection'])(
    'does not capture unconfirmed references after %s failure',
    (reason) => {
      if (reason === 'owner') current.host.hidden = true;
      if (reason === 'service-identity') current.consumer.Oa = {};
      if (reason === 'protection') current.protection.isEnabled = false;
      const capture = vi.fn();
      expect(readGeminiClientCapability(capture)).toEqual({ status: 'unsupported', reason });
      expect(capture).not.toHaveBeenCalled();
    },
  );
  it('keeps private callback values out of its serialized metadata result', () => {
    const read = new Function(
      `return (${readGeminiClientCapability.toString()});`,
    )() as typeof readGeminiClientCapability;
    const capture = vi.fn(() => current.api);
    expect(read(capture)).toEqual({ status: 'candidate' });
    expect(capture).toHaveBeenCalledTimes(1);
    expect(read.length).toBe(0);
  });
  it.each([null, false, {}, [], 'capture'])(
    'rejects an invalid private capture value without coercion',
    (capture) => {
      expect(readGeminiClientCapability(capture as never)).toEqual({
        status: 'unsupported',
        reason: 'runtime-shape',
      });
    },
  );
  it('returns only a fixed failure when a private capture throws', () => {
    const capture = vi.fn(() => {
      throw new Error('SYNTHETIC_PRIVATE_MARKER');
    });
    const result = readGeminiClientCapability(capture);
    expect(result).toEqual({ status: 'unsupported', reason: 'protection' });
    expect(capture).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(result)).not.toContain('SYNTHETIC_PRIVATE_MARKER');
  });
  it('accepts the bound consumer prerequisites without calling any provider or getter', () => {
    check();
  });
  it('executes the exact serialized no-argument function without imported helpers', () => {
    expect(readGeminiClientCapability.length).toBe(0);
    check(undefined, true);
    current.registry.ha = {};
    check('prewarm', true);
  });
  it.each([
    [
      'owner',
      (f) => {
        f.document.querySelectorAll.mockReturnValue([]);
      },
    ],
    [
      'owner-context',
      (f) => {
        delete f.host.__ngContext__;
      },
    ],
    [
      'owner-view-missing',
      (f) => {
        f.namespace.zPb.delete(7);
      },
    ],
    [
      'owner-slot',
      (f) => {
        delete f.view[28];
      },
    ],
    [
      'owner-declaration-1',
      (f) => {
        delete f.declarations[0]![14];
      },
    ],
    [
      'owner-declaration-2',
      (f) => {
        delete f.declarations[1]![14];
      },
    ],
    [
      'owner-declaration-3',
      (f) => {
        delete f.declarations[2]![14];
      },
    ],
    [
      'owner-component',
      (f) => {
        f.componentView[0] = f.host;
      },
    ],
    [
      'owner-declaration-3-node',
      (f) => {
        f.declarationNodes[2].index = 82;
      },
    ],
    [
      'owner-declaration-3-template',
      (f) => {
        f.declarationNodes[2].DB = {};
      },
    ],
    [
      'owner-declaration-3-binding',
      (f) => {
        f.declarations[2]![16] = {};
      },
    ],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'serializes only the fixed ownership stage %s',
    (reason, mutate) => {
      mutate(current);
      check(reason, true);
    },
  );
  it.each([
    'https://gemini.google.com/app/other',
    'https://gemini.google.com/app?query',
    'http://gemini.google.com/app',
    'https://example.com/app',
  ])('rejects a different page: %s', (url) => {
    location.href = url;
    check('page');
  });
  it('rejects a child window before inspecting runtime exports', () => {
    current.window.top = {};
    getter(current.window, 'default_BardChatUi');
    check('page');
  });
  it.each([
    ['missing host', (f) => f.document.querySelectorAll.mockReturnValue([])],
    [
      'duplicate hosts',
      (f) => f.document.querySelectorAll.mockReturnValue([f.host, new f.Element()]),
    ],
    [
      'detached host',
      (f) => {
        f.host.isConnected = false;
      },
    ],
    [
      'foreign host document',
      (f) => {
        f.host.ownerDocument = {} as any;
      },
    ],
    [
      'hidden host',
      (f) => {
        f.host.hidden = true;
      },
    ],
    [
      'missing owning switcher',
      (f) => {
        f.host.closest = () => null;
      },
    ],
    [
      'wrong nearest switcher',
      (f) => {
        f.host.closest = (selector) => (selector.includes('data-test-id') ? f.owner : f.button);
      },
    ],
    [
      'detached owning switcher',
      (f) => {
        f.owner.isConnected = false;
      },
    ],
    [
      'missing inner button',
      (f) => {
        f.host.querySelectorAll = () => [];
      },
    ],
    [
      'ambiguous inner buttons',
      (f) => {
        f.host.querySelectorAll = () => [f.button, new f.Element()];
      },
    ],
    [
      'wrong nearest gem-button',
      (f) => {
        f.button.closest = () => f.owner;
      },
    ],
    [
      'detached inner button',
      (f) => {
        f.button.isConnected = false;
      },
    ],
    [
      'foreign inner button document',
      (f) => {
        f.button.ownerDocument = {} as any;
      },
    ],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'rejects unsupported owner: %s',
    (_name, mutate) => {
      mutate(current);
      check('owner');
    },
  );
  it.each([
    [
      'missing context',
      (f) => {
        delete f.host.__ngContext__;
      },
    ],
    [
      'array context',
      (f) => {
        f.host.__ngContext__ = f.view;
      },
    ],
    [
      'negative context',
      (f) => {
        f.host.__ngContext__ = -1;
      },
    ],
    [
      'fractional context',
      (f) => {
        f.host.__ngContext__ = 7.1;
      },
    ],
    [
      'context only on native button',
      (f) => {
        delete f.host.__ngContext__;
        Object.assign(f.button, { __ngContext__: 7 });
      },
    ],
    [
      'context only on ancestor',
      (f) => {
        delete f.host.__ngContext__;
        Object.assign(f.owner, { __ngContext__: 7 });
      },
    ],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'rejects unsupported host context: %s',
    (_name, mutate) => {
      mutate(current);
      check('owner-context');
    },
  );
  it.each([
    [
      'fake view map',
      'owner-view-registry',
      (f) => {
        f.namespace.zPb = { get: f.calls };
      },
    ],
    [
      'missing view map',
      'owner-view-registry',
      (f) => {
        delete f.namespace.zPb;
      },
    ],
    [
      'missing exact view',
      'owner-view-missing',
      (f) => {
        f.namespace.zPb.delete(7);
      },
    ],
    [
      'different view identity',
      'owner-view-id',
      (f) => {
        f.view[19] = 8;
      },
    ],
    [
      'missing view metadata',
      'owner-view-metadata',
      (f) => {
        delete f.view[1];
      },
    ],
    [
      'destroyed view',
      'owner-view-flags',
      (f) => {
        f.view[2] = 256;
      },
    ],
    [
      'invalid flags',
      'owner-view-flags',
      (f) => {
        f.view[2] = -1;
      },
    ],
    [
      'non-array exact view',
      'owner-view-shape',
      (f) => {
        f.namespace.zPb.set(7, {});
      },
    ],
  ] satisfies [string, string, (f: ReturnType<typeof fixture>) => void][])(
    'rejects unsupported owner view: %s',
    (_name, reason, mutate) => {
      mutate(current);
      check(reason);
      check(reason, true);
    },
  );

  it.each(['valid', 'invalid-id'] as const)(
    'preserves one exact root lookup and field read order for %s',
    (kind) => {
      if (kind === 'invalid-id') {
        current.view[19] = -1;
        current.view[1] = null;
        current.view[2] = 256;
      }
      const fields: PropertyKey[] = [];
      const descriptor = Object.getOwnPropertyDescriptor;
      const inspect = vi
        .spyOn(Object, 'getOwnPropertyDescriptor')
        .mockImplementation((value, key) => {
          if (value === current.view && ['19', '2', '1'].includes(String(key))) fields.push(key);
          return descriptor(value, key);
        });
      const lookup = vi.spyOn(Map.prototype, 'get');
      const capture = vi.fn();
      try {
        const result = readGeminiClientCapability(capture);
        expect(result).toEqual(
          kind === 'valid'
            ? { status: 'candidate' }
            : { status: 'unsupported', reason: 'owner-view-id' },
        );
        expect(lookup).toHaveBeenCalledTimes(1);
        expect(lookup).toHaveBeenCalledWith(7);
        expect(fields.slice(0, 4)).toEqual(kind === 'valid' ? [19, 2, 1, 19] : [19, 2, 1]);
        if (kind === 'invalid-id') {
          expect(fields).toEqual([19, 2, 1]);
          expect(capture).not.toHaveBeenCalled();
        } else expect(capture).toHaveBeenCalledTimes(1);
        expect(Object.keys(result).sort()).toEqual(
          kind === 'valid' ? ['status'] : ['reason', 'status'],
        );
      } finally {
        inspect.mockRestore();
        lookup.mockRestore();
      }
    },
  );
  it.each([
    [
      'old slot ownership',
      (f) => {
        delete f.view[28];
        f.view[22] = f.host;
      },
    ],
    [
      'slot-zero ownership only',
      (f) => {
        delete f.view[28];
        f.view[0] = f.host;
      },
    ],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'rejects unsupported owner slot: %s',
    (_name, mutate) => {
      mutate(current);
      check('owner-slot');
    },
  );
  it('accepts a null-host embedded LView with one exact live component child at slot 28', () => {
    const child: any[] = Object.assign([], {
      0: current.host,
      1: {},
      2: 0,
      3: current.view,
      14: current.view,
      19: 8,
    });
    current.view[28] = child;
    check();
    for (const [index, value] of [
      [0, current.button],
      [3, []],
      [14, []],
      [2, 256],
      [19, -1],
      [1, null],
    ] as const) {
      const original = child[index];
      child[index] = value;
      check('owner-slot');
      child[index] = original;
    }
    current.view[28] = [child];
    check('owner-slot');
  });
  it.each([0, 2])('accepts exactly one source-backed slot-28 LContainer with flags %s', (flags) => {
    const { container } = slotContainer();
    container[2] = flags;
    check();
    check(undefined, true);
  });
  it('does not inspect comment text, container siblings or tail entries', () => {
    const { container } = slotContainer();
    getter(container, '8');
    getter(container, '19');
    getter(container, '99');
    check();
  });
  it.each([
    [
      'container marker',
      (c) => {
        c.container[1] = false;
      },
    ],
    [
      'container flags',
      (c) => {
        c.container[2] = 3;
      },
    ],
    [
      'container parent',
      (c) => {
        c.container[3] = [];
      },
    ],
    [
      'container TNode identity',
      (c) => {
        c.container[5] = { ...c.node };
      },
    ],
    [
      'parent TView data',
      () => {
        delete current.view[1].data;
      },
    ],
    [
      'parent TView data array',
      () => {
        current.view[1].data = {};
      },
    ],
    [
      'parent TNode',
      (c) => {
        delete c.tviewData[28];
      },
    ],
    [
      'TNode index',
      (c) => {
        c.node.index = 29;
      },
    ],
    [
      'TNode type',
      (c) => {
        c.node.type = 4;
      },
    ],
    [
      'TNode tag',
      (c) => {
        c.node.value = 'button';
      },
    ],
    [
      'nested container',
      (c) => {
        c.container[0] = [c.child];
      },
    ],
    [
      'native host in container',
      (c) => {
        c.container[0] = current.host;
      },
    ],
    [
      'dead component',
      (c) => {
        c.child[2] = 256;
      },
    ],
    [
      'component host',
      (c) => {
        c.child[0] = current.button;
      },
    ],
    [
      'component parent',
      (c) => {
        c.child[3] = [];
      },
    ],
    [
      'component declaration parent',
      (c) => {
        c.child[14] = [];
      },
    ],
    [
      'component TNode identity',
      (c) => {
        c.child[5] = { ...c.node };
      },
    ],
    [
      'missing anchor',
      (c) => {
        delete c.container[7];
      },
    ],
    [
      'non-native anchor',
      (c) => {
        c.container[7] = { ...c.anchor };
      },
    ],
    [
      'detached anchor',
      (c) => {
        c.anchor.isConnected = false;
      },
    ],
    [
      'foreign anchor document',
      (c) => {
        c.anchor.ownerDocument = {} as any;
      },
    ],
    [
      'different anchor parent',
      (c) => {
        c.anchor.parentNode = {};
      },
    ],
    [
      'null host parent',
      (c) => {
        current.host.parentNode = null;
        c.anchor.parentNode = null;
      },
    ],
    [
      'missing host parent',
      (c) => {
        current.host.parentNode = undefined as any;
        c.anchor.parentNode = undefined as any;
      },
    ],
    [
      'inherited container marker',
      (c) => {
        delete c.container[1];
        Object.setPrototypeOf(c.container, { 1: true });
      },
    ],
    [
      'inherited TNode index',
      (c) => {
        delete (c.node as any).index;
        Object.setPrototypeOf(c.node, { index: 28 });
      },
    ],
  ] satisfies [string, (c: ReturnType<typeof slotContainer>) => void][])(
    'rejects unsupported LContainer: %s',
    (_name, mutate) => {
      const owned = slotContainer();
      mutate(owned);
      check('owner-slot');
    },
  );
  it.each([
    ['container host', (c) => getter(c.container, '0')],
    ['container marker', (c) => getter(c.container, '1')],
    ['container flags', (c) => getter(c.container, '2')],
    ['container parent', (c) => getter(c.container, '3')],
    ['container TNode', (c) => getter(c.container, '5')],
    ['container anchor', (c) => getter(c.container, '7')],
    ['parent TView data', () => getter(current.view[1], 'data')],
    ['parent TNode', (c) => getter(c.tviewData, '28')],
    ['TNode index', (c) => getter(c.node, 'index')],
    ['component TNode', (c) => getter(c.child, '5')],
  ] satisfies [string, (c: ReturnType<typeof slotContainer>) => void][])(
    'rejects LContainer accessor without invocation: %s',
    (_name, mutate) => {
      const owned = slotContainer();
      mutate(owned);
      check('runtime-shape');
    },
  );
  it('uses the native Map intrinsic for only the owned context, never map iteration', () => {
    current.namespace.zPb.get = current.calls;
    current.namespace.zPb[Symbol.iterator] = current.calls;
    check();
  });
  it('rejects a wrong selected consumer despite a healthy root cache', () => {
    current.consumer.Oa = { sendRequest: current.calls };
    check('service-identity');
    check('service-identity', true);
  });
  it('accepts the actual consumer when irrelevant root/injector caches are unavailable', () => {
    for (const name of ['FVb', 'zw', 'uC', 'KL', 'RHd']) getter(current.namespace, name);
    getter(current.view, '9');
    getter(current.injector, 'oq');
    current.cache.clear();
    for (const name of ['UL', 'xKd', 'AKd']) getter(current.namespace[name], 'Za');
    check();
    check(undefined, true);
  });
  it('permits transparent consumer proxies through own-data reflection without a proxy-absence claim', () => {
    current.consumer.Oa = new Proxy(current.conversation, { get: current.calls });
    check();
    check(undefined, true);
  });
  it.each([
    [
      'missing namespace',
      (f) => {
        delete f.window.default_BardChatUi;
      },
    ],
    [
      'missing exact service export',
      (f) => {
        delete f.namespace.AKd;
      },
    ],
    [
      'missing component export',
      (f) => {
        delete f.namespace.SU;
      },
    ],
    [
      'wrong component definition type',
      (f) => {
        f.namespace.SU.Ra.type = f.namespace.wN;
      },
    ],
    [
      'non-function component template',
      (f) => {
        f.namespace.SU.Ra.template = {};
      },
    ],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'rejects unsupported source metadata: %s',
    (_name, mutate) => {
      mutate(current);
      check('runtime-shape');
    },
  );
  it.each([0, 1, 2])(
    'requires exact declaration link %s and its TNode without a search',
    (depth) => {
      const child = current.declarations[depth]!;
      const parent = current.declarations[depth + 1]!;
      const node = current.declarationNodes[depth]!;
      const index = [30, 29, 83][depth]!;
      for (const [object, key, value, detail] of [
        [child, 14, undefined, undefined],
        [child, 14, child, undefined],
        [child, 14, {}, undefined],
        [parent, 2, 256, undefined],
        [parent[1], 'data', {}, 'node'],
        [parent[1].data, index, undefined, 'node'],
        [child, depth === 2 ? 16 : 5, {}, 'binding'],
        [node, 'index', index + 1, 'node'],
        [node, 'DB', {}, 'template'],
      ] as const) {
        const descriptor = Object.getOwnPropertyDescriptor(object, key)!;
        Object.defineProperty(object, key, { value, configurable: true, writable: true });
        check(`owner-declaration-${depth + 1}${depth === 2 && detail ? `-${detail}` : ''}`);
        Object.defineProperty(object, key, descriptor);
      }
      getter(child, '14');
      check('runtime-shape');
    },
  );
  it('accepts a transplanted third declaration with its exact immutable origin container', () => {
    const child = current.declarations[2]!;
    child[5] = { insertion: true };
    expect(child[5]).not.toBe(current.declarationNodes[2]);
    check();
    check(undefined, true);
    getter(child, '5');
    for (const key of ['0', '2', '8', '19', '99']) getter(child[16], key);
    check();
  });
  it.each([
    [
      'missing child origin',
      (f) => {
        delete f.declarations[2]![16];
      },
    ],
    [
      'different child origin',
      (f) => {
        f.declarations[2]![16] = [...f.componentView[83]];
      },
    ],
    [
      'inherited child origin',
      (f) => {
        const child = f.declarations[2]!;
        const origin = child[16];
        delete child[16];
        Object.setPrototypeOf(child, { 16: origin });
      },
    ],
    [
      'missing parent origin',
      (f) => {
        delete f.componentView[83];
      },
    ],
    [
      'inherited parent origin',
      (f) => {
        const origin = f.componentView[83];
        delete f.componentView[83];
        Object.setPrototypeOf(f.componentView, { 83: origin });
      },
    ],
    [
      'non-array origin',
      (f) => {
        f.declarations[2]![16] = f.componentView[83] = {};
      },
    ],
    [
      'malformed origin marker',
      (f) => {
        f.componentView[83][1] = false;
      },
    ],
    [
      'missing own origin marker',
      (f) => {
        delete f.componentView[83][1];
      },
    ],
    [
      'wrong origin parent',
      (f) => {
        f.componentView[83][3] = [];
      },
    ],
    [
      'wrong origin node',
      (f) => {
        f.componentView[83][5] = { ...f.declarationNodes[2] };
      },
    ],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'rejects unsupported third declaration origin: %s',
    (_name, mutate) => {
      mutate(current);
      check('owner-declaration-3-binding');
    },
  );
  it.each([
    ['child origin', (f) => getter(f.declarations[2]!, '16')],
    ['parent origin', (f) => getter(f.componentView, '83')],
    ['origin marker', (f) => getter(f.componentView[83], '1')],
    ['origin parent', (f) => getter(f.componentView[83], '3')],
    ['origin node', (f) => getter(f.componentView[83], '5')],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'rejects third declaration origin accessor without invocation: %s',
    (_name, mutate) => {
      mutate(current);
      check('runtime-shape');
    },
  );
  it('rejects a declaration cycle across otherwise live views', () => {
    current.declarations[2]![14] = current.view;
    check('owner-declaration-3');
  });
  it.each([
    [
      'wrong native switcher host',
      (f) => {
        f.componentView[0] = f.host;
      },
    ],
    [
      'wrong component instance',
      (f) => {
        f.componentView[8] = {};
      },
    ],
    [
      'wrong final TView type',
      (f) => {
        f.componentView[1].type = 2;
      },
    ],
    [
      'wrong final template',
      (f) => {
        f.componentView[1].template = () => {};
      },
    ],
    [
      'inherited final instance',
      (f) => {
        delete f.componentView[8];
        Object.setPrototypeOf(f.componentView, { 8: f.consumer });
      },
    ],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'rejects unsupported exact model consumer owner: %s',
    (_name, mutate) => {
      mutate(current);
      check('owner-component');
    },
  );
  it.each([
    ['window export', (f) => getter(f.window, 'default_BardChatUi')],
    ['namespace export', (f) => getter(f.namespace, 'zPb')],
    ['host context', (f) => getter(f.host, '__ngContext__')],
    ['view slot', (f) => getter(f.view, '28')],
    ['component definition', (f) => getter(f.namespace.SU, 'Ra')],
    ['definition type', (f) => getter(f.namespace.SU.Ra, 'type')],
    ['definition template', (f) => getter(f.namespace.SU.Ra, 'template')],
    ['declaration TNode', (f) => getter(f.declarationNodes[0], 'DB')],
    ['declaration TView data', (f) => getter(f.declarations[1]![1], 'data')],
    ['final instance', (f) => getter(f.componentView, '8')],
    ['selected service', (f) => getter(f.consumer, 'Oa')],
    ['selected API', (f) => getter(f.conversation, 'ha')],
    ['actual protection', (f) => getter(f.api, 'Ja')],
    ['actual session', (f) => getter(f.api, 'Ab')],
    ['actual registry', (f) => getter(f.api, 'Fb')],
    ['protection', (f) => getter(f.protection, 'isEnabled')],
    ['session transport', (f) => getter(f.session, 'wa')],
    [
      'API transport',
      (f) => {
        f.api.Aa.ha = false;
        getter(f.api, 'Kd');
      },
    ],
    ['session route', (f) => getter(f.api, 'Aa')],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'rejects accessor without invoking it: %s',
    (_name, mutate) => {
      mutate(current);
      check('runtime-shape');
    },
  );
  it('rejects a subclass of the actual selected conversation service', () => {
    current.consumer.Oa = Object.create(current.conversation);
    check('service-identity');
  });
  it.each([
    [
      'wrong conversation API link',
      (f) => {
        f.conversation.ha = {};
      },
    ],
    [
      'wrong actual API class',
      (f) => {
        Object.setPrototypeOf(f.api, {});
      },
    ],
    [
      'wrong protection class',
      (f) => {
        Object.setPrototypeOf(f.protection, {});
      },
    ],
    [
      'wrong session class',
      (f) => {
        Object.setPrototypeOf(f.session, {});
      },
    ],
    [
      'wrong registry class',
      (f) => {
        Object.setPrototypeOf(f.registry, {});
      },
    ],
    [
      'registry available only at Ia',
      (f) => {
        f.api.Ia = f.registry;
        delete f.api.Fb;
      },
    ],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'rejects selected service identity: %s',
    (_name, mutate) => {
      mutate(current);
      check('service-identity');
    },
  );
  it.each([
    [
      'disabled protection',
      (f) => {
        f.protection.isEnabled = false;
      },
    ],
    [
      'different protection instance',
      (f) => {
        f.api.Ja = Object.create(f.namespace.UL.prototype);
      },
    ],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'rejects unsafe protection: %s',
    (_name, mutate) => {
      mutate(current);
      check('protection');
    },
  );
  it.each([
    [
      'false',
      (f) => {
        f.api.Kd = false;
      },
    ],
    [
      'missing',
      (f) => {
        delete f.api.Kd;
      },
    ],
    ['accessor', (f) => getter(f.api, 'Kd')],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'accepts configured native session without reading irrelevant Kd: %s',
    (_name, mutate) => {
      mutate(current);
      check();
      check(undefined, true);
    },
  );
  it.each([
    [
      'transport-webchannel',
      (f) => {
        f.session.wa = false;
      },
    ],
    [
      'transport-api',
      (f) => {
        f.api.Aa.ha = false;
        delete f.api.Kd;
      },
    ],
    [
      'transport-route',
      (f) => {
        delete f.api.Aa;
      },
    ],
    [
      'transport-sse',
      (f) => {
        f.api.Aa.ha = false;
        f.api.Kd = true;
      },
    ],
    [
      'transport-rpc',
      (f) => {
        f.api.Aa.ha = false;
        f.api.Kd = false;
      },
    ],
    [
      'transport-session',
      (f) => {
        f.api.Ab = Object.create(f.namespace.xKd.prototype);
      },
    ],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'classifies only configured transport prerequisites as %s',
    (reason, mutate) => {
      mutate(current);
      check(reason);
      check(reason, true);
    },
  );
  it.each([true, false])('ignores session wa and stops before hooks for legacy Kd=%s', (value) => {
    current.api.Aa.ha = false;
    current.api.Kd = value;
    getter(current.session, 'wa');
    getter(current.registry, 'ha');
    getter(current.namespace, 'wKd');
    check(value ? 'transport-sse' : 'transport-rpc');
    check(value ? 'transport-sse' : 'transport-rpc', true);
  });
  it.each([undefined, null, 0, 1, 'true', {}])(
    'rejects unknown route Aa=%j without reading wa/Kd',
    (value) => {
      current.api.Aa = value;
      getter(current.session, 'wa');
      getter(current.api, 'Kd');
      check('transport-route');
    },
  );
  it.each([undefined, null, 0, 1, 'true', {}])(
    'rejects unknown legacy Kd=%j without reading wa',
    (value) => {
      current.api.Aa.ha = false;
      current.api.Kd = value;
      getter(current.session, 'wa');
      check('transport-api');
    },
  );
  it.each([undefined, null, 0, 1, 'false', 'true', {}, []])(
    'rejects unknown session wa=%j before reading prewarm or hooks',
    (value) => {
      current.session.wa = value;
      getter(current.registry, 'ha');
      getter(current.namespace, 'wKd');
      check('transport-session');
      check('transport-session', true);
    },
  );
  it('rejects a session wa accessor without invoking it', () => {
    getter(current.session, 'wa');
    check('runtime-shape');
    check('runtime-shape', true);
  });
  it('keeps session reflection failures bounded before inspecting native state', () => {
    current.api.Ab = new Proxy(current.session, {
      getOwnPropertyDescriptor() {
        throw new Error('SYNTHETIC_PRIVATE_MARKER');
      },
    });
    check('transport-session');
    check('transport-session', true);
  });
  it.each([false, true])(
    'captures canonical session wa=%s once and exports only bounded metadata',
    (value) => {
      current.session.wa = value;
      for (const read of [
        readGeminiClientCapability,
        new Function(
          `return (${readGeminiClientCapability.toString()});`,
        )() as typeof readGeminiClientCapability,
      ]) {
        const capture = vi.fn((_client: unknown) => current.api);
        const result = read(capture);
        expect(result).toEqual(
          value
            ? { status: 'candidate' }
            : {
                status: 'unsupported',
                reason: 'transport-webchannel',
              },
        );
        expect(capture).toHaveBeenCalledTimes(1);
        expect(capture.mock.calls[0]![0]).toEqual({
          namespace: current.namespace,
          consumer: current.consumer,
          conversation: current.conversation,
          api: current.api,
          host: current.host,
          owner: current.owner,
        });
        expect(JSON.stringify(result)).not.toMatch(/SYNTHETIC_PRIVATE_MARKER|namespace|api|oa/);
      }
    },
  );
  it('checks configured session route before native session state', () => {
    getter(current.api, 'Aa');
    current.session.wa = false;
    check('runtime-shape');
  });
  describe('source-shaped registered-idle manager metadata', () => {
    it.each([
      [false, false, false],
      [false, true, false],
      [true, false, false],
      [true, true, false],
      [false, false, true],
      [false, true, true],
      [true, false, true],
      [true, true, true],
    ])(
      'classifies wa=%s unused Za=%s own undefined=%s without invoking the manager',
      (nativeSse, Za, ownUndefined) => {
        const manager = registeredIdle(nativeSse, Za, ownUndefined);
        const before = Object.getOwnPropertyDescriptors(manager);
        for (const read of [
          readGeminiClientCapability,
          new Function(
            `return (${readGeminiClientCapability.toString()});`,
          )() as typeof readGeminiClientCapability,
        ]) {
          const capture = vi.fn();
          const result = read(capture);
          expect(result).toEqual(
            nativeSse
              ? { status: 'candidate' }
              : { status: 'unsupported', reason: 'transport-webchannel' },
          );
          expect(capture).toHaveBeenCalledTimes(1);
          expect(capture.mock.calls[0]![0].api.Ab).toBe(manager.Na);
          expect(Object.getOwnPropertyDescriptors(manager)).toEqual(before);
          expect(JSON.stringify(result)).not.toMatch(/SYNTHETIC_PRIVATE|namespace|Na|Za|kb/);
        }
      },
    );
    it.each([
      [
        'unknown manager',
        () => {
          current.registry.ha = {};
        },
      ],
      [
        'null manager',
        () => {
          current.registry.ha = null;
        },
      ],
      [
        'primitive manager',
        () => {
          current.registry.ha = false;
        },
      ],
      [
        'function manager',
        () => {
          Object.setPrototypeOf(current.calls, current.namespace.JVd.prototype);
          current.registry.ha = current.calls;
        },
      ],
      [
        'missing export',
        () => {
          delete current.namespace.JVd;
        },
      ],
      [
        'wrong export',
        () => {
          current.namespace.JVd = {};
        },
      ],
      ['accessor export', () => getter(current.namespace, 'JVd')],
      [
        'missing prototype',
        () => {
          current.namespace.JVd = () => current.calls();
        },
      ],
      [
        'null prototype',
        () => {
          current.namespace.JVd.prototype = null;
        },
      ],
      [
        'primitive prototype',
        () => {
          current.namespace.JVd.prototype = false;
        },
      ],
      [
        'function prototype',
        () => {
          current.namespace.JVd.prototype = current.calls;
          Object.setPrototypeOf(current.registry.ha, current.calls);
        },
      ],
      [
        'accessor prototype',
        () => {
          current.namespace.JVd = () => current.calls();
          getter(current.namespace.JVd, 'prototype');
        },
      ],
      [
        'wrong prototype',
        () => {
          Object.setPrototypeOf(current.registry.ha, {});
        },
      ],
      [
        'wrong prototype parent',
        () => {
          Object.setPrototypeOf(current.namespace.JVd.prototype, {});
        },
      ],
      [
        'null prototype parent',
        () => {
          Object.setPrototypeOf(current.namespace.JVd.prototype, null);
        },
      ],
      [
        'foreign session',
        () => {
          current.registry.ha.Na = Object.create(current.namespace.xKd.prototype);
        },
      ],
      [
        'missing session',
        () => {
          delete current.registry.ha.Na;
        },
      ],
      ['session accessor', () => getter(current.registry.ha, 'Na')],
      [
        'foreign conversation',
        () => {
          current.registry.ha.Oa = Object.create(current.namespace.wN.prototype);
        },
      ],
      [
        'missing conversation',
        () => {
          delete current.registry.ha.Oa;
        },
      ],
      ['conversation accessor', () => getter(current.registry.ha, 'Oa')],
      [
        'missing construction state',
        () => {
          delete current.registry.ha.ka;
        },
      ],
      ['construction accessor', () => getter(current.registry.ha, 'ka')],
      [
        'construction active',
        () => {
          current.registry.ha.ka = true;
        },
      ],
      [
        'construction noncanonical',
        () => {
          current.registry.ha.ka = 0;
        },
      ],
      ...(['Va', 'Ua'] as const).flatMap((key): [string, () => void][] => [
        [
          `${key} missing`,
          () => {
            delete current.registry.ha[key];
          },
        ],
        [
          `${key} accessor`,
          () => {
            getter(current.registry.ha, key);
          },
        ],
        [
          `${key} foreign`,
          () => {
            current.registry.ha[key] = {};
          },
        ],
      ]),
      [
        'kb missing',
        () => {
          delete current.registry.ha.kb;
        },
      ],
      ['kb accessor', () => getter(current.registry.ha, 'kb')],
      [
        'kb noncanonical',
        () => {
          current.registry.ha.kb = 0;
        },
      ],
      [
        'kb mismatches route',
        () => {
          current.registry.ha.kb = false;
        },
      ],
    ] satisfies [string, () => void][])(
      'refuses unsupported idle identity: %s',
      (_name, mutate) => {
        registeredIdle();
        check();
        mutate();
        getter(current.namespace, 'wKd');
        check('prewarm');
        check('prewarm', true);
      },
    );
    for (const key of ['ha', 'wa', 'Ja', 'Ga']) {
      it.each([
        ['active/stale', {}],
        ['null', null],
        ['false', false],
        ['zero', 0],
      ])(`refuses manager ${key} with %s state`, (_name, value) => {
        const manager = registeredIdle();
        check();
        manager[key] = value;
        check('prewarm');
        check('prewarm', true);
      });
      it(`refuses manager ${key} accessor without invoking it`, () => {
        const manager = registeredIdle();
        check();
        getter(manager, key);
        check('prewarm');
        check('prewarm', true);
      });
      it.each(['data', 'accessor'])(
        `refuses inherited manager ${key} %s on the exact JVd prototype`,
        (shape) => {
          registeredIdle();
          check();
          const proto = current.namespace.JVd.prototype;
          if (shape === 'accessor') getter(proto, key);
          else proto[key] = undefined;
          check('prewarm');
          check('prewarm', true);
        },
      );
      // Object.prototype.ha already fails the unchanged registry gate before manager reads.
      if (key !== 'ha')
        it.each(['data', 'accessor'])(
          `refuses inherited manager ${key} %s on Object.prototype`,
          (shape) => {
            registeredIdle();
            check();
            if (shape === 'accessor') getter(Object.prototype, key);
            else
              Object.defineProperty(Object.prototype, key, {
                value: undefined,
                configurable: true,
              });
            try {
              check('prewarm');
              check('prewarm', true);
            } finally {
              delete (Object.prototype as any)[key];
            }
          },
        );
    }
    it.each(['data', 'accessor'])(
      'retains the earlier Object.prototype.ha %s refusal before JVd reads',
      (shape) => {
        registeredIdle();
        check();
        getter(current.namespace, 'JVd');
        if (shape === 'accessor') getter(Object.prototype, 'ha');
        else
          Object.defineProperty(Object.prototype, 'ha', { value: undefined, configurable: true });
        try {
          check('prewarm');
          check('prewarm', true);
        } finally {
          delete (Object.prototype as any).ha;
        }
      },
    );
    it.each(['getPrototypeOf', 'getOwnPropertyDescriptor'] as const)(
      'bounds manager %s reflection failures',
      (trap) => {
        const manager = registeredIdle();
        check();
        current.registry.ha = new Proxy(manager, {
          [trap]() {
            throw Error('SYNTHETIC_PRIVATE_MARKER');
          },
        });
        check('prewarm');
        check('prewarm', true);
      },
    );
    it.each([false, true])(
      'still checks hook refusal after recognizing wa=%s idle state',
      (nativeSse) => {
        registeredIdle(nativeSse);
        check(nativeSse ? undefined : 'transport-webchannel');
        getter(current.namespace, 'wKd');
        check('hook');
        check('hook', true);
      },
    );
    it.each([false, true])(
      'does not read JVd on absent/undefined registry state (%s)',
      (ownUndefined) => {
        if (ownUndefined) current.registry.ha = undefined;
        getter(current.namespace, 'JVd');
        check();
        current.session.wa = false;
        check('transport-webchannel', true);
      },
    );
    it.each([
      [false, false, 'transport-rpc'],
      [false, true, 'transport-sse'],
      [false, undefined, 'transport-api'],
      [undefined, undefined, 'transport-route'],
      [true, undefined, 'transport-session'],
    ])('avoids manager reads for Aa=%s Kd=%s %s', (route, legacy, reason) => {
      registeredIdle();
      if (typeof route === 'boolean') current.api.Aa.ha = route;
      else current.api.Aa = route;
      current.api.Kd = legacy;
      current.session.wa = undefined;
      getter(current.namespace, 'JVd');
      getter(current.registry, 'ha');
      check(reason as string);
      check(reason as string, true);
    });
    it('reads the selected session and own registry manager once, then only the bounded idle fields in order', () => {
      const reads: string[] = [];
      current.session = new Proxy(current.session, {
        getOwnPropertyDescriptor(target, key) {
          if (key === 'wa') reads.push('session.wa');
          return Reflect.getOwnPropertyDescriptor(target, key);
        },
      });
      current.api.Ab = current.session;
      const manager = registeredIdle(false);
      current.registry.ha = new Proxy(manager, {
        get: current.calls,
        getOwnPropertyDescriptor(target, key) {
          reads.push(`manager.${String(key)}`);
          return Reflect.getOwnPropertyDescriptor(target, key);
        },
      });
      current.api.Fb = new Proxy(current.registry, {
        getOwnPropertyDescriptor(target, key) {
          reads.push(`registry.${String(key)}`);
          return Reflect.getOwnPropertyDescriptor(target, key);
        },
      });
      current.window.default_BardChatUi = new Proxy(current.namespace, {
        getOwnPropertyDescriptor(target, key) {
          if (key === 'JVd' || key === 'wKd') reads.push(`namespace.${String(key)}`);
          return Reflect.getOwnPropertyDescriptor(target, key);
        },
      });
      reads.length = 0;
      const capture = vi.fn();
      expect(readGeminiClientCapability(capture)).toEqual({
        status: 'unsupported',
        reason: 'transport-webchannel',
      });
      expect(capture).toHaveBeenCalledTimes(1);
      expect(reads).toEqual([
        'session.wa',
        'registry.ha',
        'namespace.JVd',
        'manager.Na',
        'manager.Oa',
        'manager.Va',
        'manager.Ua',
        'manager.ka',
        'manager.ha',
        'manager.wa',
        'manager.Ja',
        'manager.Ga',
        'manager.kb',
        'namespace.wKd',
      ]);
    });
  });
  it('accepts explicit undefined manager only in the known prototype chain', () => {
    current.registry.ha = undefined;
    check();
    current.session.wa = false;
    check('transport-webchannel');
    check('transport-webchannel', true);
  });
  it.each([
    [
      'registered manager',
      (f) => {
        f.registry.ha = { isEnabled: f.calls, kff: f.calls, Eyc: f.calls };
      },
    ],
    [
      'null manager',
      (f) => {
        f.registry.ha = null;
      },
    ],
    [
      'unknown manager value',
      (f) => {
        f.registry.ha = 'SYNTHETIC_PRIVATE_MARKER';
      },
    ],
    ['registry manager accessor', (f) => getter(f.registry, 'ha')],
    [
      'inherited manager',
      (f) => {
        f.namespace.AKd.prototype.ha = undefined;
      },
    ],
    ['inherited manager accessor', (f) => getter(f.namespace.AKd.prototype, 'ha')],
    [
      'unsupported registry prototype chain',
      (f) => {
        Object.setPrototypeOf(f.namespace.AKd.prototype, {});
      },
    ],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'rejects uncertain prewarm absence: %s',
    (_name, mutate) => {
      mutate(current);
      check('prewarm');
      current.session.wa = false;
      check('prewarm');
      check('prewarm', true);
    },
  );
  it('rejects Object.prototype manager state without invoking it', () => {
    getter(Object.prototype, 'ha');
    try {
      check('prewarm');
      current.session.wa = false;
      check('prewarm');
      check('prewarm', true);
    } finally {
      delete (Object.prototype as any).ha;
    }
  });
  it.each([
    [
      'own API wrapper',
      (f) => {
        f.api.ybb = f.calls;
      },
    ],
    ['own API accessor', (f) => getter(f.api, 'ybb')],
    [
      'non-extensible API',
      (f) => {
        Object.preventExtensions(f.api);
      },
    ],
    [
      'absent API prototype method',
      (f) => {
        delete f.namespace.gM.prototype.ybb;
      },
    ],
    ['accessor API prototype method', (f) => getter(f.namespace.gM.prototype, 'ybb')],
    [
      'absent connection factory',
      (f) => {
        delete f.namespace.wKd;
      },
    ],
    ['accessor connection factory', (f) => getter(f.namespace, 'wKd')],
    [
      'immutable connection factory',
      (f) => {
        Object.defineProperty(f.namespace, 'wKd', { writable: false });
      },
    ],
    [
      'non-configurable connection factory',
      (f) => {
        Object.defineProperty(f.namespace, 'wKd', { configurable: false });
      },
    ],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'rejects unsafe future hook shape: %s',
    (_name, mutate) => {
      mutate(current);
      check('hook');
      current.session.wa = false;
      check('hook');
      check('hook', true);
    },
  );
  it('catches thrown reflection failures into fixed reasons without message leakage', () => {
    current.window.default_BardChatUi = new Proxy(
      {},
      {
        getOwnPropertyDescriptor() {
          throw new Error('SYNTHETIC_PRIVATE_MARKER');
        },
      },
    );
    check('runtime-shape');
  });
});

describe('private expected page during an owned trial', () => {
  it.each(['0', 'Af09', 'a'.repeat(16)])(
    'reuses every owner check on the exact caller-bound page %s',
    (suffix) => {
      const url = 'https://gemini.google.com/app/' + suffix;
      vi.stubGlobal('location', { href: url });
      current.api.Aa.ha = false;
      current.api.Kd = false;
      const capture = vi.fn();
      expect(readGeminiClientCapability(capture, url)).toEqual({
        status: 'unsupported',
        reason: 'transport-rpc',
      });
      expect(capture).toHaveBeenCalledTimes(1);
      current.declarations[1]![2] = 256;
      expect(readGeminiClientCapability(capture, url)).toEqual({
        status: 'unsupported',
        reason: 'owner-declaration-1',
      });
      expect(capture).toHaveBeenCalledTimes(1);
    },
  );
  it('keeps no-argument serialized metadata restricted to home', () => {
    vi.stubGlobal('location', { href: 'https://gemini.google.com/app/a1' });
    check('page', true);
    expect(readGeminiClientCapability.length).toBe(0);
  });
  it.each([
    'https://elsewhere.invalid/app',
    'https://gemini.google.com/app/',
    'https://gemini.google.com/app/gg',
    'https://gemini.google.com/app/' + 'a'.repeat(17),
    'https://gemini.google.com/app/a1?x=1',
    'https://gemini.google.com/app/a1#x',
    'https://gemini.google.com/u/1/app/a1',
    null,
    false,
    1,
    {},
  ])('refuses unsupported expected page without capture %j', (url) => {
    if (typeof url === 'string') vi.stubGlobal('location', { href: url });
    const capture = vi.fn();
    expect(readGeminiClientCapability(capture, url as never)).toEqual({
      status: 'unsupported',
      reason: 'page',
    });
    expect(capture).not.toHaveBeenCalled();
  });
  it('refuses a different actual page even if both paths are supported', () => {
    vi.stubGlobal('location', { href: 'https://gemini.google.com/app/a1' });
    const capture = vi.fn();
    expect(readGeminiClientCapability(capture, 'https://gemini.google.com/app/b2')).toEqual({
      status: 'unsupported',
      reason: 'page',
    });
    expect(capture).not.toHaveBeenCalled();
  });
});

describe('current profile excludes historical mixed owners', () => {
  it.each([false, true])('rejects the old third-node81 graph with serialized=%s', (serialized) => {
    const parent = current.declarations[3]!,
      node = current.declarationNodes[2];
    parent[1].data[81] = node;
    delete parent[1].data[83];
    node.index = 81;
    parent[81] = parent[83];
    delete parent[83];
    check('owner-declaration-3-node', serialized);
  });
  it.each([false, true])(
    'rejects a historical mB declaration mixed into current registry with serialized=%s',
    (serialized) => {
      const node = current.declarationNodes[2];
      node.mB = node.DB;
      delete node.DB;
      check('owner-declaration-3-template', serialized);
    },
  );
  it.each([false, true])(
    'rejects an old conversation export mixed into current registry with serialized=%s',
    (serialized) => {
      current.namespace.nN = current.namespace.wN;
      delete current.namespace.wN;
      check('runtime-shape', serialized);
    },
  );
});
