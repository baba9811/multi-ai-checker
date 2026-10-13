import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readGeminiClientCapability } from '../../../src/infrastructure/providers/gemini/client-capability';

// Invented source-profile objects; no captured account, conversation or runtime values.
function fixture() {
  const calls = vi.fn(() => {
    throw new Error('SYNTHETIC_PRIVATE_MARKER');
  });
  const namespace: Record<string, any> = {};
  for (const name of ['FVb', 'ww', 'lN', 'HL', 'pL', 'RHd', 'DL', 'sV']) {
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
      'Oub',
    ])
      namespace[name].prototype[method] = calls;
  }
  for (const name of ['sC', 'IL', 'IHd'])
    namespace[name] = Object.assign(Object.create(namespace.ww.prototype), {
      RTc: 'InjectionToken',
    });
  for (const name of ['sC', 'IL', 'pL', 'RHd', 'DL', 'IHd'])
    namespace[name].Za = { token: namespace[name], kb: 'root', Xa: calls };
  namespace.QHd = calls;
  const conversation = Object.create(namespace.lN.prototype);
  const api = Object.assign(Object.create(namespace.HL.prototype), { Nd: true, Aa: true });
  const protection = Object.assign(Object.create(namespace.pL.prototype), { isEnabled: true });
  const session = Object.assign(Object.create(namespace.RHd.prototype), { oa: true });
  const registry = Object.create(namespace.DL.prototype);
  conversation.ha = api;
  Object.assign(api, { Ja: protection, wb: session, Fb: registry, Ia: { unrelated: true } });
  const values = {
    sC: conversation,
    IL: api,
    pL: protection,
    RHd: session,
    DL: registry,
    IHd: true,
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
  namespace.DOb = new Map([[7, view]]);
  namespace.sV.Ra = { type: namespace.sV, template: calls };
  const consumer = Object.assign(Object.create(namespace.sV.prototype), { Oa: conversation });
  const declarations = [view];
  const declarationNodes: any[] = [];
  for (const [depth, index] of [30, 29, 81].entries()) {
    const child = declarations[depth]!;
    const node = { index, iB: child[1] };
    const data: any[] = [];
    data[index] = node;
    const parent: any[] = Object.assign([], { 0: null, 1: { data }, 2: 0, 19: 10 + depth });
    child[14] = parent;
    child[5] = node;
    if (index === 81) {
      const origin: any[] = Object.assign([], { 1: true, 3: parent, 5: node });
      parent[81] = origin;
      child[16] = origin;
    }
    declarations.push(parent);
    declarationNodes.push(node);
  }
  const componentView = declarations[3]!;
  componentView[0] = owner;
  componentView[8] = consumer;
  componentView[1].type = 1;
  componentView[1].template = namespace.sV.Ra.template;

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
    [namespace.ww.prototype, 'Ig'],
    [namespace.FVb.prototype, 'Yf'],
    [namespace.RHd.prototype, 'wa'],
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
      'owner-view',
      (f) => {
        f.namespace.DOb.delete(7);
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
        f.declarationNodes[2].iB = {};
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
      (f) => {
        f.namespace.DOb = { get: f.calls };
      },
    ],
    [
      'missing view map',
      (f) => {
        delete f.namespace.DOb;
      },
    ],
    [
      'missing exact view',
      (f) => {
        f.namespace.DOb.delete(7);
      },
    ],
    [
      'different view identity',
      (f) => {
        f.view[19] = 8;
      },
    ],
    [
      'missing view metadata',
      (f) => {
        delete f.view[1];
      },
    ],
    [
      'destroyed view',
      (f) => {
        f.view[2] = 256;
      },
    ],
    [
      'invalid flags',
      (f) => {
        f.view[2] = -1;
      },
    ],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'rejects unsupported owner view: %s',
    (_name, mutate) => {
      mutate(current);
      check('owner-view');
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
    current.namespace.DOb.get = current.calls;
    current.namespace.DOb[Symbol.iterator] = current.calls;
    check();
  });
  it('rejects a wrong selected consumer despite a healthy root cache', () => {
    current.consumer.Oa = { sendRequest: current.calls };
    check('service-identity');
    check('service-identity', true);
  });
  it('accepts the actual consumer when irrelevant root/injector caches are unavailable', () => {
    for (const name of ['FVb', 'ww', 'sC', 'IL', 'IHd']) getter(current.namespace, name);
    getter(current.view, '9');
    getter(current.injector, 'oq');
    current.cache.clear();
    for (const name of ['pL', 'RHd', 'DL']) getter(current.namespace[name], 'Za');
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
        delete f.namespace.DL;
      },
    ],
    [
      'missing component export',
      (f) => {
        delete f.namespace.sV;
      },
    ],
    [
      'wrong component definition type',
      (f) => {
        f.namespace.sV.Ra.type = f.namespace.lN;
      },
    ],
    [
      'non-function component template',
      (f) => {
        f.namespace.sV.Ra.template = {};
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
      const index = [30, 29, 81][depth]!;
      for (const [object, key, value, detail] of [
        [child, 14, undefined, undefined],
        [child, 14, child, undefined],
        [child, 14, {}, undefined],
        [parent, 2, 256, undefined],
        [parent[1], 'data', {}, 'node'],
        [parent[1].data, index, undefined, 'node'],
        [child, depth === 2 ? 16 : 5, {}, 'binding'],
        [node, 'index', index + 1, 'node'],
        [node, 'iB', {}, 'template'],
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
        f.declarations[2]![16] = [...f.componentView[81]];
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
        delete f.componentView[81];
      },
    ],
    [
      'inherited parent origin',
      (f) => {
        const origin = f.componentView[81];
        delete f.componentView[81];
        Object.setPrototypeOf(f.componentView, { 81: origin });
      },
    ],
    [
      'non-array origin',
      (f) => {
        f.declarations[2]![16] = f.componentView[81] = {};
      },
    ],
    [
      'malformed origin marker',
      (f) => {
        f.componentView[81][1] = false;
      },
    ],
    [
      'missing own origin marker',
      (f) => {
        delete f.componentView[81][1];
      },
    ],
    [
      'wrong origin parent',
      (f) => {
        f.componentView[81][3] = [];
      },
    ],
    [
      'wrong origin node',
      (f) => {
        f.componentView[81][5] = { ...f.declarationNodes[2] };
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
    ['parent origin', (f) => getter(f.componentView, '81')],
    ['origin marker', (f) => getter(f.componentView[81], '1')],
    ['origin parent', (f) => getter(f.componentView[81], '3')],
    ['origin node', (f) => getter(f.componentView[81], '5')],
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
    ['namespace export', (f) => getter(f.namespace, 'DOb')],
    ['host context', (f) => getter(f.host, '__ngContext__')],
    ['view slot', (f) => getter(f.view, '28')],
    ['component definition', (f) => getter(f.namespace.sV, 'Ra')],
    ['definition type', (f) => getter(f.namespace.sV.Ra, 'type')],
    ['definition template', (f) => getter(f.namespace.sV.Ra, 'template')],
    ['declaration TNode', (f) => getter(f.declarationNodes[0], 'iB')],
    ['declaration TView data', (f) => getter(f.declarations[1]![1], 'data')],
    ['final instance', (f) => getter(f.componentView, '8')],
    ['selected service', (f) => getter(f.consumer, 'Oa')],
    ['selected API', (f) => getter(f.conversation, 'ha')],
    ['actual protection', (f) => getter(f.api, 'Ja')],
    ['actual session', (f) => getter(f.api, 'wb')],
    ['actual registry', (f) => getter(f.api, 'Fb')],
    ['protection', (f) => getter(f.protection, 'isEnabled')],
    ['session transport', (f) => getter(f.session, 'oa')],
    [
      'API transport',
      (f) => {
        f.api.Aa = false;
        getter(f.api, 'Nd');
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
        f.api.Ja = Object.create(f.namespace.pL.prototype);
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
        f.api.Nd = false;
      },
    ],
    [
      'missing',
      (f) => {
        delete f.api.Nd;
      },
    ],
    ['accessor', (f) => getter(f.api, 'Nd')],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'accepts configured native session without reading irrelevant Nd: %s',
    (_name, mutate) => {
      mutate(current);
      check();
      check(undefined, true);
    },
  );
  it.each([
    [
      'transport-session',
      (f) => {
        f.session.oa = false;
      },
    ],
    [
      'transport-api',
      (f) => {
        f.api.Aa = false;
        delete f.api.Nd;
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
        f.api.Aa = false;
        f.api.Nd = true;
      },
    ],
    [
      'transport-rpc',
      (f) => {
        f.api.Aa = false;
        f.api.Nd = false;
      },
    ],
    [
      'transport-session',
      (f) => {
        f.api.wb = Object.create(f.namespace.RHd.prototype);
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
  it.each([true, false])('ignores session oa and stops before hooks for legacy Nd=%s', (value) => {
    current.api.Aa = false;
    current.api.Nd = value;
    getter(current.session, 'oa');
    getter(current.registry, 'ha');
    getter(current.namespace, 'QHd');
    check(value ? 'transport-sse' : 'transport-rpc');
    check(value ? 'transport-sse' : 'transport-rpc', true);
  });
  it.each([undefined, null, 0, 1, 'true', {}])(
    'rejects unknown route Aa=%j without reading oa/Nd',
    (value) => {
      current.api.Aa = value;
      getter(current.session, 'oa');
      getter(current.api, 'Nd');
      check('transport-route');
    },
  );
  it.each([undefined, null, 0, 1, 'true', {}])(
    'rejects unknown legacy Nd=%j without reading oa',
    (value) => {
      current.api.Aa = false;
      current.api.Nd = value;
      getter(current.session, 'oa');
      check('transport-api');
    },
  );
  it('checks configured session route before native session state', () => {
    getter(current.api, 'Aa');
    current.session.oa = false;
    check('runtime-shape');
  });
  it('accepts explicit undefined manager only in the known prototype chain', () => {
    current.registry.ha = undefined;
    check();
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
    ['registry manager accessor', (f) => getter(f.registry, 'ha')],
    [
      'inherited manager',
      (f) => {
        f.namespace.DL.prototype.ha = undefined;
      },
    ],
    ['inherited manager accessor', (f) => getter(f.namespace.DL.prototype, 'ha')],
    [
      'unsupported registry prototype chain',
      (f) => {
        Object.setPrototypeOf(f.namespace.DL.prototype, {});
      },
    ],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'rejects uncertain prewarm absence: %s',
    (_name, mutate) => {
      mutate(current);
      check('prewarm');
    },
  );
  it('rejects Object.prototype manager state without invoking it', () => {
    getter(Object.prototype, 'ha');
    try {
      check('prewarm');
    } finally {
      delete (Object.prototype as any).ha;
    }
  });
  it.each([
    [
      'own API wrapper',
      (f) => {
        f.api.Oub = f.calls;
      },
    ],
    ['own API accessor', (f) => getter(f.api, 'Oub')],
    [
      'non-extensible API',
      (f) => {
        Object.preventExtensions(f.api);
      },
    ],
    [
      'absent API prototype method',
      (f) => {
        delete f.namespace.HL.prototype.Oub;
      },
    ],
    ['accessor API prototype method', (f) => getter(f.namespace.HL.prototype, 'Oub')],
    [
      'absent connection factory',
      (f) => {
        delete f.namespace.QHd;
      },
    ],
    ['accessor connection factory', (f) => getter(f.namespace, 'QHd')],
    [
      'immutable connection factory',
      (f) => {
        Object.defineProperty(f.namespace, 'QHd', { writable: false });
      },
    ],
    [
      'non-configurable connection factory',
      (f) => {
        Object.defineProperty(f.namespace, 'QHd', { configurable: false });
      },
    ],
  ] satisfies [string, (f: ReturnType<typeof fixture>) => void][])(
    'rejects unsafe future hook shape: %s',
    (_name, mutate) => {
      mutate(current);
      check('hook');
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
