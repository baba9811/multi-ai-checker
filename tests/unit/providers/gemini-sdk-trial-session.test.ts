import { GEMINI_NATIVE_DISPATCH_REASONS } from '../../../src/application/gemini-fixed-text-trial';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import {
  readGeminiSdkTrial,
  startGeminiSdkTrial,
} from '../../../src/infrastructure/chrome/gemini-sdk-trial';
const home = 'https://gemini.google.com/app';
const key = 'crosscheck.gemini-sdk-trial.v1';
const stored: Record<string, unknown> = {};
const bootstrap = {
  handle: '__crosscheckGeminiTrial_' + 'a'.repeat(32),
  capability: 'b'.repeat(64),
};
const result = { model: 'Synthetic current model', answer: 'CROSSCHECK_GEMINI_OK' };
const removed = new Set<(id: number) => void>();
const activated = new Set<(event: { tabId: number }) => void>();
let frames: unknown[];
let progress: unknown;
let safe = true;
let removedEvent = true;
const browser = {
  permissions: { request: vi.fn(async () => true), contains: vi.fn(async () => true) },
  tabs: {
    create: vi.fn(async () => ({ id: 92, url: home, status: 'complete' })),
    get: vi.fn(async () => ({ id: 92, url: home, status: 'complete', active: false })),
    update: vi.fn(),
    remove: vi.fn(async (id: number) => {
      if (removedEvent) for (const listener of removed) listener(id);
    }),
    onRemoved: {
      addListener: vi.fn((fn: (id: number) => void) => removed.add(fn)),
      removeListener: vi.fn((fn: (id: number) => void) => removed.delete(fn)),
    },
    onActivated: {
      addListener: vi.fn((fn: (event: { tabId: number }) => void) => activated.add(fn)),
      removeListener: vi.fn((fn: (event: { tabId: number }) => void) => activated.delete(fn)),
    },
    sendMessage: vi.fn(async (_id: number, command: { type: string }) => ({
      ok: true,
      data:
        command.type === 'snapshot'
          ? {
              provider: 'gemini',
              documentId: 'bridge-doc',
              url: home,
              composer: true,
              busy: false,
              draft: false,
              truncated: false,
              lastQuestion: '',
              lastAnswer: '',
              context: { scope: 'rendered', turns: [] },
            }
          : command.type === 'checkGeminiSdkTrial'
            ? { ready: true, safeToRetire: safe }
            : true,
    })),
  },
  windows: { update: vi.fn() },
  scripting: {
    executeScript: vi.fn(async (options: { files?: string[]; world?: string; args?: unknown[] }) =>
      options.files?.[0] === 'bridge.js'
        ? []
        : options.files
          ? [{ frameId: 0, documentId: 'native-doc', result: bootstrap }]
          : options.world === 'ISOLATED'
            ? [{ frameId: 0, documentId: 'native-doc', result: true }]
            : options.args?.[2] === true
              ? [{ frameId: 0, documentId: 'native-doc', result: true }]
              : options.args?.[2] === 'terminal-error'
                ? [{ frameId: 0, documentId: 'native-doc', result: null }]
                : frames,
    ),
  },
  storage: {
    session: {
      get: vi.fn(async () => ({ ...stored })),
      set: vi.fn(async (value: Record<string, unknown>) => {
        Object.assign(stored, value);
      }),
    },
  },
};
beforeEach(() => {
  vi.clearAllMocks();
  removed.clear();
  activated.clear();
  for (const field of Object.keys(stored)) delete stored[field];
  safe = true;
  removedEvent = true;
  progress = { status: 'done', result };
  frames = [{ frameId: 0, documentId: 'native-doc', result: progress }];
  browser.permissions.request.mockResolvedValue(true);
  browser.storage.session.set.mockImplementation(async (value) => {
    Object.assign(stored, value);
  });
  vi.stubGlobal('chrome', browser);
});
afterEach(() => vi.unstubAllGlobals());
const start = () => startGeminiSdkTrial(new AbortController().signal);
it('persists intent, binds two distinct document IDs and retires only its inactive page before done', async () => {
  expect(await start()).toEqual(result);
  expect(browser.storage.session.set.mock.invocationCallOrder[0]).toBeLessThan(
    browser.tabs.create.mock.invocationCallOrder[0]!,
  );
  expect(browser.tabs.create).toHaveBeenCalledWith({ url: home, active: false });
  expect(browser.tabs.update).not.toHaveBeenCalled();
  expect(browser.windows.update).not.toHaveBeenCalled();
  expect(browser.scripting.executeScript).toHaveBeenCalledWith(
    expect.objectContaining({
      target: { tabId: 92, documentIds: ['native-doc'] },
      world: 'MAIN',
      files: ['gemini-sdk-fixed-text-trial.js'],
    }),
  );
  expect(browser.tabs.sendMessage).toHaveBeenCalledWith(
    92,
    expect.objectContaining({ type: 'reserveGeminiSdkTrial', documentId: 'bridge-doc', url: home }),
    { frameId: 0 },
  );
  expect(browser.tabs.remove).toHaveBeenCalledWith(92);
  expect(stored[key]).toMatchObject({ status: 'done' });
  expect(JSON.stringify(stored)).not.toMatch(
    /Synthetic|CROSSCHECK|capability|handle|native-doc|bridge-doc/,
  );
  expect(removed.size).toBe(0);
  expect(activated.size).toBe(0);
});
it('does not allocate without permission', async () => {
  browser.permissions.request.mockResolvedValueOnce(false);
  await expect(start()).rejects.toThrow();
  expect(browser.tabs.create).not.toHaveBeenCalled();
});
it('does not allocate or bootstrap when intent persistence fails', async () => {
  browser.storage.session.set.mockRejectedValueOnce(new Error('SYNTHETIC_PRIVATE_MARKER'));
  await expect(start()).rejects.not.toThrow('SYNTHETIC_PRIVATE_MARKER');
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(browser.scripting.executeScript).not.toHaveBeenCalled();
});
it('restores pending as uncertain without starting or exposing metadata', async () => {
  stored[key] = { id: 'synthetic-intent', status: 'pending' };
  expect(await readGeminiSdkTrial()).toEqual({ id: 'synthetic-intent', status: 'uncertain' });
  expect(browser.tabs.create).not.toHaveBeenCalled();
});
it.each(
  [
    [],
    [
      { frameId: 0, documentId: 'native-doc', result: progress },
      { frameId: 0, documentId: 'native-doc', result: progress },
    ],
    [{ frameId: 1, documentId: 'native-doc', result: progress }],
    [{ frameId: 0, documentId: 'another-native-doc', result: progress }],
    [
      {
        frameId: 0,
        documentId: 'native-doc',
        result: { status: 'done', result: { ...result, answer: 'partial' } },
      },
    ],
    [
      {
        frameId: 0,
        documentId: 'native-doc',
        result: {
          status: 'done',
          result: { ...result, conversationId: 'SYNTHETIC_PRIVATE_MARKER' },
        },
      },
    ],
  ].map((value) => [value] as const),
)('rejects malformed or foreign MAIN script result %j without marking done', async (value) => {
  frames = value;
  await expect(start()).rejects.toThrow();
  expect(stored[key]).toMatchObject({ status: 'uncertain' });
  expect(JSON.stringify(stored)).not.toContain('SYNTHETIC_PRIVATE_MARKER');
});
it('cancellation during persistence never allocates a provider page', async () => {
  const controller = new AbortController();
  browser.storage.session.set.mockImplementationOnce(async (value) => {
    Object.assign(stored, value);
    controller.abort();
  });
  await expect(startGeminiSdkTrial(controller.signal)).rejects.toThrow();
  expect(browser.tabs.create).not.toHaveBeenCalled();
  expect(stored[key]).toMatchObject({ status: 'uncertain' });
});
it('never retires a page whose user-owned content/interaction changed', async () => {
  safe = false;
  await expect(start()).rejects.toThrow();
  expect(browser.tabs.remove).not.toHaveBeenCalled();
  expect(stored[key]).toMatchObject({ status: 'uncertain' });
  expect(browser.scripting.executeScript.mock.calls.some(([o]) => o.args?.[2] === true)).toBe(true);
});
it('never reports done without the exact owned removal confirmation', async () => {
  removedEvent = false;
  await expect(start()).rejects.toThrow();
  expect(stored[key]).toMatchObject({ status: 'uncertain' });
});
it.each([
  ...GEMINI_NATIVE_DISPATCH_REASONS,
  'history',
  'response-raw-fields',
  'response-raw-field-1',
  'response-raw-field-3',
  'response-raw-field-4',
  'response-raw-field-14',
  'response-raw-field-17',
  'response-raw-field-18',
  'response-raw-field-19',
  'response-raw-field-22',
  'response-raw-field-29',
  'response-raw-field-31',
  'response-raw-field-38',
  'response-raw-field-39',
  'response-raw-field-42',
  'response-raw-field-44',
  'response-raw-field-45',
  'response-raw-field-51',
  'response-raw-field-54',
  'response-raw-field-6',
  'response-raw-field-7',
  'response-raw-field-8',
  'response-raw-field-10',
  'response-raw-field-25',
  'response-raw-field-30',
  'response-raw-field-33',
  'response-raw-field-35',
  'response-raw-field-36',
  'response-raw-field-41',
  'response-raw-field-47',
  'response-raw-field-49',
  'response-raw-field-53',
  'response-raw-field-57',
  'response-raw-title',
  'response-raw-routing',
  'response-raw-attribution',
  'response-raw-history',
  'response-raw-quota',
  'response-raw-heartbeat',
  'response-raw-string',
  'response-raw-enum',
  'response-raw-client',
  'response-raw-supplement',
  'response-raw-continuation',
  'response-raw-disconnect',
])('does not auto retry a provider %s refusal and exposes a fixed reason only', async (reason) => {
  frames = [{ frameId: 0, documentId: 'native-doc', result: { status: 'error', reason } }];
  await expect(start()).rejects.toMatchObject({ cause: reason });
  expect(browser.tabs.create).toHaveBeenCalledTimes(1);
  expect(stored[key]).toMatchObject({ status: 'uncertain' });
});
it.each([
  'response-raw-field-0',
  'response-raw-field-2',
  'response-raw-field-65',
  'response-raw-field-81',
  'response-raw-field-017',
  'response-raw-field-NaN',
  'response-raw-field-SYNTHETIC_PRIVATE_MARKER',
])('refuses an unlisted protocol diagnostic %s without exposing it or retrying', async (reason) => {
  frames = [{ frameId: 0, documentId: 'native-doc', result: { status: 'error', reason } }];
  await expect(start()).rejects.toMatchObject({ cause: 'page' });
  expect(browser.tabs.create).toHaveBeenCalledTimes(1);
  expect(stored[key]).toMatchObject({ status: 'uncertain' });
});
it('refuses a second start while persistence is pending', async () => {
  let resume!: () => void;
  browser.storage.session.set.mockImplementationOnce(async (value) => {
    await new Promise<void>((resolve) => {
      resume = resolve;
    });
    Object.assign(stored, value);
  });
  const first = start();
  await Promise.resolve();
  await expect(start()).rejects.toThrow();
  resume();
  expect(await first).toEqual(result);
  expect(browser.tabs.create).toHaveBeenCalledTimes(1);
});

it('keeps the start lock until terminal intent persistence settles', async () => {
  const releases: Array<() => void> = [];
  browser.storage.session.set.mockImplementation(async (value) => {
    if ((value[key] as { status?: string })?.status === 'done')
      await new Promise<void>((resolve) => releases.push(resolve));
    Object.assign(stored, value);
  });
  const first = start();
  for (let step = 0; step < 50 && !releases.length; step++) await Promise.resolve();
  expect(releases.length).toBe(1);
  const second = start();
  void second.catch(() => {});
  for (let step = 0; step < 50; step++) await Promise.resolve();
  try {
    expect(browser.tabs.create).toHaveBeenCalledTimes(1);
  } finally {
    for (const release of releases) release();
    await Promise.allSettled([first, second]);
  }
});

it('never retires without a validated MAIN bootstrap/ownership receipt', async () => {
  const original = browser.scripting.executeScript.getMockImplementation()!;
  browser.scripting.executeScript.mockImplementationOnce(original);
  browser.scripting.executeScript.mockImplementation(async (options) =>
    options.files?.[0] === 'gemini-sdk-fixed-text-trial.js' ? [] : original(options),
  );
  await expect(start()).rejects.toThrow();
  expect(browser.tabs.remove).not.toHaveBeenCalled();
  expect(stored[key]).toMatchObject({ status: 'uncertain' });
  browser.scripting.executeScript.mockImplementation(original);
});
it('refreshes exact MAIN ownership after every asynchronous retirement check', async () => {
  const original = browser.scripting.executeScript.getMockImplementation()!;
  let stops = 0;
  browser.scripting.executeScript.mockImplementation(async (options) =>
    options.args?.[2] === true
      ? [{ frameId: 0, documentId: 'native-doc', result: ++stops === 1 }]
      : original(options),
  );
  await expect(start()).rejects.toThrow();
  expect(browser.tabs.remove).not.toHaveBeenCalled();
  expect(stops).toBe(2);
  expect(stored[key]).toMatchObject({ status: 'uncertain' });
  browser.scripting.executeScript.mockImplementation(original);
});
it('releases partial listener registrations and returns only a fixed failure', async () => {
  browser.tabs.onActivated.addListener.mockImplementationOnce(() => {
    throw new Error('SYNTHETIC_PRIVATE_MARKER');
  });
  await expect(start()).rejects.not.toThrow('SYNTHETIC_PRIVATE_MARKER');
  expect(removed.size).toBe(0);
  expect(activated.size).toBe(0);
  expect(browser.tabs.create).not.toHaveBeenCalled();
});

it('attempts every listener release and refuses done when one cleanup fails', async () => {
  browser.tabs.onRemoved.removeListener.mockImplementationOnce(() => {
    throw new Error('SYNTHETIC_PRIVATE_MARKER');
  });
  await expect(start()).rejects.toMatchObject({ cause: 'cleanup' });
  expect(browser.tabs.onActivated.removeListener).toHaveBeenCalledTimes(1);
  expect(activated.size).toBe(0);
  expect(stored[key]).toMatchObject({ status: 'uncertain' });
  expect(JSON.stringify(stored)).not.toContain('SYNTHETIC_PRIVATE_MARKER');
});

it('preserves an existing terminal MAIN refusal when a later reservation detects a restored draft', async () => {
  const send = browser.tabs.sendMessage.getMockImplementation()!;
  const execute = browser.scripting.executeScript.getMockImplementation()!;
  let leases = 0,
    diagnostics = 0;
  const order: string[] = [];
  safe = false;
  browser.tabs.sendMessage.mockImplementation(async (id, command) => {
    if (command.type === 'checkGeminiSdkTrial') {
      if (leases) order.push('reservation-refused');
      return { ok: true, data: { ready: leases === 0, safeToRetire: false } };
    }
    return send(id, command);
  });
  browser.scripting.executeScript.mockImplementation(async (options) => {
    if (options.args?.[2] === 'terminal-error') {
      diagnostics++;
      order.push('diagnostic');
      return [{ frameId: 0, documentId: 'native-doc', result: 'response-error' }];
    }
    if (options.args?.[2] === true) {
      order.push('stop');
      return [{ frameId: 0, documentId: 'native-doc', result: false }];
    }
    if (!options.files && options.world === 'MAIN') {
      leases++;
      return [{ frameId: 0, documentId: 'native-doc', result: { status: 'pending' } }];
    }
    return execute(options);
  });
  try {
    await expect(start()).rejects.toMatchObject({ cause: 'response-error' });
    expect(leases).toBe(1);
    expect(diagnostics).toBe(1);
    expect(order.indexOf('diagnostic')).toBeLessThan(order.indexOf('stop'));
    expect(browser.tabs.create).toHaveBeenCalledTimes(1);
    expect(browser.tabs.remove).not.toHaveBeenCalled();
    expect(stored[key]).toMatchObject({ status: 'uncertain' });
  } finally {
    browser.tabs.sendMessage.mockImplementation(send);
    browser.scripting.executeScript.mockImplementation(execute);
  }
});

it.each([
  ['pending', [{ frameId: 0, documentId: 'native-doc', result: null }]],
  ['done', [{ frameId: 0, documentId: 'native-doc', result: { status: 'done', result } }]],
  ['pending payload', [{ frameId: 0, documentId: 'native-doc', result: { status: 'pending' } }]],
  [
    'unknown reason',
    [{ frameId: 0, documentId: 'native-doc', result: 'SYNTHETIC_PRIVATE_MARKER' }],
  ],
  ['missing method', [{ frameId: 0, documentId: 'native-doc', result: false }]],
  ['missing injection', []],
  ['foreign document', [{ frameId: 0, documentId: 'foreign-doc', result: 'response-error' }]],
  ['foreign frame', [{ frameId: 1, documentId: 'native-doc', result: 'response-error' }]],
  [
    'duplicate frame',
    [
      { frameId: 0, documentId: 'native-doc', result: 'response-error' },
      { frameId: 0, documentId: 'native-doc', result: 'response-error' },
    ],
  ],
  [
    'extra content',
    [
      {
        frameId: 0,
        documentId: 'native-doc',
        result: 'response-error',
        detail: 'SYNTHETIC_PRIVATE_MARKER',
      },
    ],
  ],
  ['throws', null],
])(
  'keeps page refusal for an inert query with %s and never admits a result',
  async (_name, diagnostic) => {
    const send = browser.tabs.sendMessage.getMockImplementation()!;
    const execute = browser.scripting.executeScript.getMockImplementation()!;
    let leases = 0,
      queries = 0;
    safe = false;
    browser.tabs.sendMessage.mockImplementation(async (id, command) =>
      command.type === 'checkGeminiSdkTrial'
        ? { ok: true, data: { ready: leases === 0, safeToRetire: false } }
        : send(id, command),
    );
    browser.scripting.executeScript.mockImplementation(async (options) => {
      if (options.args?.[2] === 'terminal-error') {
        queries++;
        if (diagnostic === null) throw Error('SYNTHETIC_PRIVATE_MARKER');
        return diagnostic;
      }
      if (options.args?.[2] === true)
        return [{ frameId: 0, documentId: 'native-doc', result: false }];
      if (!options.files && options.world === 'MAIN') {
        leases++;
        return [{ frameId: 0, documentId: 'native-doc', result: { status: 'pending' } }];
      }
      return execute(options);
    });
    try {
      await expect(start()).rejects.toMatchObject({ cause: 'page' });
      expect(leases).toBe(1);
      expect(queries).toBe(1);
      expect(browser.scripting.executeScript).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { tabId: 92, documentIds: ['native-doc'] },
          world: 'MAIN',
          args: [bootstrap.handle, bootstrap.capability, 'terminal-error'],
        }),
      );
      expect(browser.tabs.remove).not.toHaveBeenCalled();
      expect(browser.tabs.create).toHaveBeenCalledTimes(1);
      expect(stored[key]).toMatchObject({ status: 'uncertain' });
      expect(JSON.stringify(stored)).not.toMatch(
        /SYNTHETIC_PRIVATE|Synthetic|CROSSCHECK|response-error|capability|handle/,
      );
    } finally {
      browser.tabs.sendMessage.mockImplementation(send);
      browser.scripting.executeScript.mockImplementation(execute);
    }
  },
);

it.each([
  'abort-before',
  'abort-during',
  'abort-after',
  'removed-before',
  'removed-during',
  'touched-before',
  'touched-during',
])('keeps cancellation/document/page guards during terminal diagnostics: %s', async (race) => {
  const send = browser.tabs.sendMessage.getMockImplementation()!;
  const execute = browser.scripting.executeScript.getMockImplementation()!;
  const controller = new AbortController();
  let leases = 0,
    queries = 0;
  const change = () => {
    if (race.startsWith('abort')) controller.abort();
    else if (race.startsWith('removed')) for (const listener of removed) listener(92);
    else for (const listener of activated) listener({ tabId: 92 });
  };
  safe = false;
  browser.tabs.sendMessage.mockImplementation(async (id, command) => {
    if (command.type === 'checkGeminiSdkTrial') {
      if (leases && race.endsWith('before')) change();
      return { ok: true, data: { ready: leases === 0, safeToRetire: false } };
    }
    return send(id, command);
  });
  browser.scripting.executeScript.mockImplementation(async (options) => {
    if (options.args?.[2] === 'terminal-error') {
      queries++;
      if (race.endsWith('during'))
        await new Promise<void>((resolve) => {
          queueMicrotask(() => {
            change();
            resolve();
          });
        });
      const response = [{ frameId: 0, documentId: 'native-doc', result: 'response-error' }];
      if (race.endsWith('after')) queueMicrotask(change);
      return response;
    }
    if (options.args?.[2] === true)
      return [{ frameId: 0, documentId: 'native-doc', result: false }];
    if (!options.files && options.world === 'MAIN') {
      leases++;
      return [{ frameId: 0, documentId: 'native-doc', result: { status: 'pending' } }];
    }
    return execute(options);
  });
  try {
    await expect(startGeminiSdkTrial(controller.signal)).rejects.toMatchObject({
      cause: race.startsWith('abort') ? 'interrupted' : 'page',
    });
    expect(leases).toBe(1);
    expect(queries).toBe(race.endsWith('before') ? 0 : 1);
    expect(browser.tabs.create).toHaveBeenCalledTimes(1);
    expect(
      browser.scripting.executeScript.mock.calls.filter(
        ([o]) => o.files?.[0] === 'gemini-sdk-fixed-text-trial.js',
      ),
    ).toHaveLength(1);
    expect(browser.tabs.remove).not.toHaveBeenCalled();
    expect(stored[key]).toMatchObject({ status: 'uncertain' });
  } finally {
    browser.tabs.sendMessage.mockImplementation(send);
    browser.scripting.executeScript.mockImplementation(execute);
  }
});

it.each(['initial', 'before-first-lease', 'reservation-throws', 'malformed-reservation'])(
  'does not query or start through an invalid reservation: %s',
  async (phase) => {
    const send = browser.tabs.sendMessage.getMockImplementation()!;
    const execute = browser.scripting.executeScript.getMockImplementation()!;
    let leases = 0,
      checks = 0,
      queries = 0;
    safe = false;
    browser.tabs.sendMessage.mockImplementation(async (id, command) => {
      if (command.type === 'checkGeminiSdkTrial') {
        checks++;
        if (phase === 'initial' || (phase === 'before-first-lease' && checks > 1))
          return { ok: true, data: { ready: false, safeToRetire: false } };
        if (leases) {
          if (phase === 'reservation-throws') throw Error('SYNTHETIC_PRIVATE_MARKER');
          return {
            ok: true,
            data: { ready: false, safeToRetire: false, extra: 'SYNTHETIC_PRIVATE_MARKER' },
          };
        }
      }
      return send(id, command);
    });
    browser.scripting.executeScript.mockImplementation(async (options) => {
      if (options.args?.[2] === 'terminal-error') {
        queries++;
        return [{ frameId: 0, documentId: 'native-doc', result: 'response-error' }];
      }
      if (options.args?.[2] === true)
        return [{ frameId: 0, documentId: 'native-doc', result: false }];
      if (!options.files && options.world === 'MAIN') {
        leases++;
        return [{ frameId: 0, documentId: 'native-doc', result: { status: 'pending' } }];
      }
      return execute(options);
    });
    try {
      await expect(start()).rejects.toMatchObject({ cause: 'page' });
      expect(queries).toBe(0);
      expect(leases).toBe(phase === 'initial' || phase === 'before-first-lease' ? 0 : 1);
      expect(browser.tabs.remove).not.toHaveBeenCalled();
      expect(stored[key]).toMatchObject({ status: 'uncertain' });
    } finally {
      browser.tabs.sendMessage.mockImplementation(send);
      browser.scripting.executeScript.mockImplementation(execute);
    }
  },
);

it('serialized MAIN diagnostic delegates only to the frozen terminal-error method', async () => {
  await start();
  const invocation = browser.scripting.executeScript.mock.calls.find(
    ([options]) => options.args?.length === 2,
  )![0];
  const read = (
    invocation as unknown as { func: (handle: string, capability: string, mode: string) => unknown }
  ).func;
  const terminalError = vi.fn(() => 'response-error');
  const lease = vi.fn(() => {
    throw Error('Must not lease');
  });
  const stop = vi.fn(() => {
    throw Error('Must not stop');
  });
  const samePage = vi.fn(() => {
    throw Error('Must not inspect page');
  });
  const page = Object.create(globalThis);
  Object.defineProperty(page, 'synthetic-inert-registry', {
    value: Object.freeze({ terminalError, lease, stop, samePage }),
  });
  const top = {};
  vi.stubGlobal('window', Object.assign(top, { top }));
  vi.stubGlobal('location', { origin: 'https://gemini.google.com' });
  vi.stubGlobal('globalThis', page);
  try {
    expect(read('synthetic-inert-registry', 'synthetic-capability', 'terminal-error')).toBe(
      'response-error',
    );
    expect(terminalError).toHaveBeenCalledExactlyOnceWith('synthetic-capability');
    expect(lease).not.toHaveBeenCalled();
    expect(stop).not.toHaveBeenCalled();
    expect(samePage).not.toHaveBeenCalled();
    expect(read('missing', 'synthetic-capability', 'terminal-error')).toBe(false);
  } finally {
    vi.unstubAllGlobals();
  }
});
