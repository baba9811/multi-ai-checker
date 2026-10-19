import { describe, expect, it, vi } from 'vitest';
import { captureGeminiTrialModel } from '../../../src/infrastructure/providers/gemini/model-receipt';
import type { GeminiOwnedClient } from '../../../src/infrastructure/providers/gemini/client-capability';

// Invented account catalog and signal values; never copied service/account state.
function fixture() {
  class YK {}
  class QF {}
  const catalog = [
    {
      id: 'synthetic-auto',
      modeCategory: 'MODE_CATEGORY_AUTO',
      Ns: [{ thinkingLevel: 'THINKING_LEVEL_STANDARD' }],
    },
    {
      id: 'synthetic-effective',
      modeCategory: 'MODE_CATEGORY_FAST',
      Wo: 'synthetic-routing',
      Ns: [{ thinkingLevel: 'THINKING_LEVEL_EXTENDED', Nj: 'synthetic-effort' }],
    },
  ];
  let selected = catalog[0];
  let effective = catalog[1];
  let level: string | undefined = 'THINKING_LEVEL_EXTENDED';
  let effort: string | undefined = 'synthetic-effort';
  const nb = new QF();
  const Ca = { Ea: vi.fn(() => true) };
  const service = Object.assign(new YK(), { nb, Da: Ca });
  const listeners = new Set<{
    next(value: unknown): void;
    error(error: unknown): void;
    complete(): void;
  }>();
  const teardown = vi.fn();
  let emits = true;
  class st {
    subscribe(observer: {
      next(value: unknown): void;
      error(error: unknown): void;
      complete(): void;
    }) {
      listeners.add(observer);
      if (emits) observer.next(state);
      return {
        unsubscribe() {
          listeners.delete(observer);
          teardown();
        },
      };
    }
  }
  const state: Record<string, unknown> = {
    catalog,
    zKb: undefined,
    xKb: undefined,
    yKb: undefined,
    Ihc: undefined,
  };
  const stream = new st();
  const catalogMethod = Function(
    '_',
    'return function(){return this.ha().pipe(_.v(a=>{var b,c,d=(this.Na&&_.pwc(a)?(b=a.rVa)!=null?b:[]:(c=a.kR)!=null?c:[]).filter(e=>e.yEa||this.Ha.includes(e.id)||!this.Aa&&this.Wa.includes(e.id)?!1:!0);return this.Ua?d.reverse():d}),_.sw((a,b)=>JSON.stringify(a)===JSON.stringify(b)))}',
  )({ v: (fn: Function) => fn, sw: (fn: Function) => fn });
  const catalogSource = vi.fn(function (this: unknown) {
    expect(this).toBe(nb);
    return { pipe: () => stream };
  });
  Object.assign(nb, { ha: catalogSource });
  Object.defineProperty(QF.prototype, 'sG', {
    value: catalogMethod,
    writable: true,
    configurable: true,
  });
  Object.assign(service, { zKb: new st(), xKb: new st(), yKb: new st(), Ihc: new st() });
  const namespace = {
    YK,
    QF,
    st,
    JAb: {},
    At: vi.fn(() => stream),
    oVd: vi.fn(() => effective),
  };
  const controller = new AbortController();
  const consumer = {
    bardModeService: service,
    nb,
    Da: Ca,
    Ua: true,
    host: () => 1,
    Yb: () => selected,
    Qag: () => selected!.id,
    N8: () => effective!.id,
    dM: () => level,
    xT: () => effort,
  };
  const conversation = { bardModeService: service, nb, Da: Ca };
  return {
    client: {
      namespace,
      consumer,
      conversation,
      api: {},
      host: {},
      owner: {},
    } as unknown as GeminiOwnedClient,
    catalog,
    controller,
    listeners,
    state,
    teardown,
    stream,
    nb,
    catalogMethod,
    catalogSource,
    consumer,
    service,
    namespace,
    Ca,
    ui: { model: '자동', modeId: 'synthetic-auto' },
    change: {
      emits(value: boolean) {
        emits = value;
      },
      selected: (value: typeof selected) => {
        selected = value;
      },
      effective: (value: typeof effective) => {
        effective = value;
      },
      level: (value: typeof level) => {
        level = value;
      },
      effort: (value: typeof effort) => {
        effort = value;
      },
    },
  };
}
const capture = (f: ReturnType<typeof fixture>) =>
  captureGeminiTrialModel(f.client, f.ui, f.controller.signal);

describe('Gemini actual-account model receipt', () => {
  it('consumes the final catalog method with nb receiver and zero arguments', async () => {
    const f = fixture();
    Reflect.deleteProperty(f.namespace, 'OK');
    const apply = vi.spyOn(Reflect, 'apply');
    try {
      const receipt = await capture(f);
      expect(apply).toHaveBeenCalledWith(f.catalogMethod, f.nb, []);
      expect(f.catalogSource).toHaveBeenCalledOnce();
      expect(receipt.current()).toBe(true);
      receipt.close();
      expect(f.teardown).toHaveBeenCalledOnce();
    } finally {
      apply.mockRestore();
    }
  });
  it.each(['placeholder', 'wrong-owner', 'prototype-accessor', 'own-data', 'own-accessor'])(
    'refuses an initial catalog %s without invoking it',
    async (kind) => {
      const f = fixture();
      const prototype = f.namespace.QF.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(prototype, 'sG')!;
      const getter = vi.fn(() => f.catalogMethod);
      try {
        if (kind === 'placeholder')
          Object.defineProperty(prototype, 'sG', { value: vi.fn(() => f.stream) });
        if (kind === 'wrong-owner')
          Object.defineProperty(prototype, 'sG', {
            value: Function('return function(){return this.Ga}')(),
          });
        if (kind === 'prototype-accessor') Object.defineProperty(prototype, 'sG', { get: getter });
        if (kind === 'own-data') Object.defineProperty(f.nb, 'sG', { value: f.catalogMethod });
        if (kind === 'own-accessor') Object.defineProperty(f.nb, 'sG', { get: getter });
        await expect(capture(f)).rejects.toMatchObject({ cause: 'model-bindings' });
        expect(getter).not.toHaveBeenCalled();
        expect(f.catalogSource).not.toHaveBeenCalled();
        expect(f.listeners.size).toBe(0);
      } finally {
        Object.defineProperty(prototype, 'sG', descriptor);
      }
    },
  );
  it.each([
    'same-body',
    'accessor',
    'descriptor',
    'constructor',
    'nb-prototype',
    'own-data',
    'own-accessor',
  ])('invalidates a late catalog %s before another catalog invocation', async (kind) => {
    const f = fixture();
    const prototype = f.namespace.QF.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'sG')!;
    const constructor = f.namespace.QF;
    const getter = vi.fn(() => f.catalogMethod);
    const receipt = await capture(f);
    try {
      if (kind === 'same-body') {
        const replacement = Function('_', 'return ' + f.catalogMethod.toString())({});
        expect(replacement).not.toBe(f.catalogMethod);
        expect(replacement.toString()).toBe(f.catalogMethod.toString());
        Object.defineProperty(prototype, 'sG', { value: replacement });
      }
      if (kind === 'accessor') Object.defineProperty(prototype, 'sG', { get: getter });
      if (kind === 'descriptor') Object.defineProperty(prototype, 'sG', { enumerable: true });
      if (kind === 'constructor') f.namespace.QF = class {};
      if (kind === 'nb-prototype') Object.setPrototypeOf(f.nb, {});
      if (kind === 'own-data') Object.defineProperty(f.nb, 'sG', { value: f.catalogMethod });
      if (kind === 'own-accessor') Object.defineProperty(f.nb, 'sG', { get: getter });
      expect(receipt.current()).toBe(false);
      expect(getter).not.toHaveBeenCalled();
      expect(f.catalogSource).toHaveBeenCalledOnce();
    } finally {
      f.namespace.QF = constructor;
      Object.setPrototypeOf(f.nb, prototype);
      Object.defineProperty(prototype, 'sG', descriptor);
      receipt.close();
    }
    expect(f.teardown).toHaveBeenCalledOnce();
  });
  it('keeps UI preference separate from genuine catalog effective mode and pair', async () => {
    const f = fixture();
    const receipt = await capture(f);
    expect(receipt).toMatchObject({
      model: '자동',
      metadata: {
        modeId: 'synthetic-effective',
        modeCategory: 'MODE_CATEGORY_FAST',
        Cq: 'synthetic-routing',
        thinkingLevel: 'THINKING_LEVEL_EXTENDED',
        Hj: 'synthetic-effort',
      },
    });
    expect(f.namespace.oVd).toHaveBeenCalledWith('synthetic-auto', 1, f.catalog);
    expect(receipt.current()).toBe(true);
  });
  it('preserves actual preference without mapping when the provider scope disables it', async () => {
    const f = fixture();
    f.consumer.Ua = false;
    f.Ca.Ea.mockReturnValue(false);
    f.change.effective(f.catalog[0]);
    expect((await capture(f)).metadata.modeId).toBe('synthetic-auto');
    expect(f.namespace.oVd).not.toHaveBeenCalled();
  });
  it.each(['model', 'modeId'])(
    'refuses unsupported UI %s before invoking provider helpers',
    async (key) => {
      const f = fixture();
      Object.assign(f.ui, { [key]: '' });
      await expect(capture(f)).rejects.toThrow();
      expect(f.namespace.oVd).not.toHaveBeenCalled();
    },
  );
  it.each(['host', 'Yb', 'Qag', 'N8', 'dM', 'xT'])(
    'refuses accessor signal %s without executing it',
    async (key) => {
      const f = fixture();
      const getter = vi.fn(() => () => 1);
      Object.defineProperty(f.consumer, key, { get: getter });
      await expect(capture(f)).rejects.toThrow();
      expect(getter).not.toHaveBeenCalled();
    },
  );
  it.each(['bardModeService', 'nb', 'Da'])('refuses different conversation %s', async (key) => {
    const f = fixture();
    Object.assign(f.client.conversation, { [key]: {} });
    await expect(capture(f)).rejects.toThrow();
  });
  it('refuses a different configuration scope or flag', async () => {
    const f = fixture();
    f.Ca.Ea.mockReturnValue(false);
    await expect(capture(f)).rejects.toThrow();
  });
  it('refuses an effective value outside the actual account catalog', async () => {
    const f = fixture();
    f.change.effective({ ...f.catalog[1]! });
    await expect(capture(f)).rejects.toThrow();
  });
  it('refuses an actual B8 mismatch', async () => {
    const f = fixture();
    f.consumer.N8 = () => 'another-effective';
    await expect(capture(f)).rejects.toThrow();
  });
  it('refuses a menu preference mismatch', async () => {
    const f = fixture();
    f.ui.modeId = 'another-preference';
    await expect(capture(f)).rejects.toThrow();
  });
  it('refuses duplicate catalog identities', async () => {
    const f = fixture();
    f.catalog.push({ ...f.catalog[0]! });
    await expect(capture(f)).rejects.toThrow();
  });
  it('refuses catalog accessors without invoking them', async () => {
    const f = fixture();
    const getter = vi.fn(() => 'synthetic-auto');
    Object.defineProperty(f.catalog[0], 'id', { get: getter });
    await expect(capture(f)).rejects.toThrow();
    expect(getter).not.toHaveBeenCalled();
  });
  it('drops an unsupported thinking pair only as the normal mapping does', async () => {
    const f = fixture();
    f.change.level('THINKING_LEVEL_DEEP_THINK');
    const r = await capture(f);
    expect(r.metadata.thinkingLevel).toBeUndefined();
    expect(r.metadata.Hj).toBeUndefined();
  });
  it('preserves selected thinking metadata when the effective model remains selected', async () => {
    const f = fixture();
    f.change.effective(f.catalog[0]);
    f.change.effort(undefined);
    expect((await capture(f)).metadata.thinkingLevel).toBe('THINKING_LEVEL_EXTENDED');
  });
  it.each([
    'selection',
    'effective',
    'level',
    'effort',
    'signal',
    'scope',
    'catalog',
    'service',
    'resolver',
  ])('invalidates a changed pre-send %s', async (key) => {
    const f = fixture();
    const r = await capture(f);
    switch (key) {
      case 'selection':
        f.change.selected(f.catalog[1]);
        break;
      case 'effective':
        f.change.effective(f.catalog[0]);
        break;
      case 'level':
        f.change.level(undefined);
        break;
      case 'effort':
        f.change.effort(undefined);
        break;
      case 'signal':
        f.consumer.N8 = () => 'synthetic-effective';
        break;
      case 'scope':
        f.Ca.Ea.mockReturnValue(false);
        break;
      case 'catalog':
        f.catalog[1]!.Wo = 'changed';
        break;
      case 'service':
        f.consumer.bardModeService = {} as typeof f.service;
        break;
      case 'resolver':
        f.namespace.oVd = vi.fn(() => f.catalog[1]);
        break;
    }
    expect(r.current()).toBe(false);
  });
  it('collects only the genuine full catalog from the exact owning KF', async () => {
    const f = fixture();
    const r = await capture(f);
    expect(f.catalogSource).toHaveBeenCalledOnce();
    expect(f.listeners.size).toBe(1);
    r.close();
    expect(f.listeners.size).toBe(0);
    expect(f.teardown).toHaveBeenCalledTimes(1);
    expect(r.current()).toBe(false);
  });
  it('closes the genuine catalog subscription on abort without reviving the receipt', async () => {
    const f = fixture();
    const r = await capture(f);
    f.controller.abort();
    expect(r.current()).toBe(false);
    expect(f.teardown).toHaveBeenCalledTimes(1);
    r.close();
    expect(f.teardown).toHaveBeenCalledTimes(1);
  });
  it('does not subscribe after an already aborted signal', async () => {
    const f = fixture();
    f.controller.abort();
    await expect(capture(f)).rejects.toThrow();
    expect(f.catalogSource).not.toHaveBeenCalled();
    expect(f.listeners.size).toBe(0);
  });
  it('invalidates source catalog replacement and catalog stream errors', async () => {
    const f = fixture();
    const r = await capture(f);
    for (const listener of f.listeners)
      listener.next({ ...f.state, catalog: [f.catalog[0], { ...f.catalog[1] }] });
    expect(r.current()).toBe(false);
    r.close();
    const other = fixture();
    const receipt = await capture(other);
    for (const listener of other.listeners) listener.error(new Error('SYNTHETIC_PRIVATE_MARKER'));
    expect(receipt.current()).toBe(false);
    expect(other.teardown).toHaveBeenCalledTimes(1);
  });
  it('cleans up a synchronous unsupported catalog before rejecting', async () => {
    const f = fixture();
    f.catalog.length = 0;
    await expect(capture(f)).rejects.toThrow();
    expect(f.listeners.size).toBe(0);
    expect(f.teardown).toHaveBeenCalledTimes(1);
  });
  it.each(['zKb', 'xKb', 'yKb', 'Ihc'])(
    'refuses selected alternative %s even with unchanged displayed mode',
    async (key) => {
      const f = fixture();
      f.state[key] = 'synthetic-suboption';
      await expect(capture(f)).rejects.toThrow();
      expect(f.teardown).toHaveBeenCalledTimes(1);
    },
  );
  it.each(['zKb', 'xKb', 'yKb', 'Ihc'])(
    'invalidates later alternative %s even with unchanged displayed mode',
    async (key) => {
      const f = fixture();
      const r = await capture(f);
      f.state[key] = 'synthetic-suboption';
      for (const listener of f.listeners) listener.next(f.state);
      expect(r.current()).toBe(false);
      r.close();
    },
  );
  it('rejects an abort during genuine catalog construction without retaining a pending subscription', async () => {
    const f = fixture();
    f.change.emits(false);
    f.catalogSource.mockImplementation(() => {
      f.controller.abort();
      return { pipe: () => f.stream };
    });
    let failed: unknown;
    void capture(f).catch((error: unknown) => {
      failed = error;
    });
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect(failed).toMatchObject({ cause: 'model-catalog' });
    expect(f.listeners.size).toBe(0);
    expect(f.teardown).not.toHaveBeenCalled();
  });
  it('sanitizes a provider exception', async () => {
    const f = fixture();
    f.consumer.N8 = () => {
      throw new Error('SYNTHETIC_PRIVATE_MARKER');
    };
    await expect(capture(f)).rejects.toThrowError(
      expect.objectContaining({ cause: 'model-settings' }),
    );
  });
  it.each([
    [
      'model-bindings',
      (f: ReturnType<typeof fixture>) =>
        Object.defineProperty(f.namespace, 'YK', { value: undefined }),
    ],
    [
      'model-catalog',
      (f: ReturnType<typeof fixture>) => {
        f.catalogSource.mockImplementation(() => {
          throw new Error('SYNTHETIC_PRIVATE_MARKER');
        });
      },
    ],
    [
      'model-selection-ui',
      (f: ReturnType<typeof fixture>) => {
        f.ui.modeId = 'synthetic-other';
      },
    ],
    [
      'model-settings',
      (f: ReturnType<typeof fixture>) => {
        f.state.zKb = 'synthetic-alternative';
      },
    ],
  ] as const)('reports only the fixed %s stage', async (cause, mutate) => {
    const f = fixture();
    mutate(f);
    await expect(capture(f)).rejects.toMatchObject({
      message: 'Gemini trial model failed.',
      cause,
    });
    expect(f.listeners.size).toBe(0);
  });
  it.each([
    [
      'model-selection-id',
      (f: ReturnType<typeof fixture>) => {
        f.change.selected({ ...f.catalog[0]!, id: '' });
      },
    ],
    [
      'model-selection-ui',
      (f: ReturnType<typeof fixture>) => {
        f.ui.modeId = 'synthetic-other';
      },
    ],
    [
      'model-selection-catalog',
      (f: ReturnType<typeof fixture>) => {
        f.catalog.push({ ...f.catalog[0]! });
      },
    ],
  ] as const)('separates the fixed %s predicate without private values', async (cause, mutate) => {
    const f = fixture();
    mutate(f);
    await expect(capture(f)).rejects.toMatchObject({
      message: 'Gemini trial model failed.',
      cause,
    });
    expect(f.namespace.oVd).not.toHaveBeenCalled();
    expect(f.listeners.size).toBe(0);
  });
  it('accepts a source-normal selected clone from an independent catalog replay', async () => {
    const f = fixture();
    const selected = JSON.parse(JSON.stringify(f.catalog[0]));
    f.change.selected(selected);
    const receipt = await capture(f);
    expect(receipt.metadata.modeId).toBe('synthetic-effective');
    expect(f.namespace.oVd).toHaveBeenCalledWith('synthetic-auto', 1, f.catalog);
    expect(receipt.current()).toBe(true);
    receipt.close();
  });

  it('preserves the exact selected clone when normal mapping is disabled', async () => {
    const f = fixture();
    const selected = JSON.parse(JSON.stringify(f.catalog[0]));
    f.change.selected(selected);
    f.change.effective(selected);
    f.consumer.Ua = false;
    f.Ca.Ea.mockReturnValue(false);
    const receipt = await capture(f);
    expect(receipt.metadata.modeId).toBe('synthetic-auto');
    expect(receipt.current()).toBe(true);
    expect(f.namespace.oVd).not.toHaveBeenCalled();
    f.change.selected({ ...selected });
    expect(receipt.current()).toBe(false);
    receipt.close();
  });
  it.each(['Wo', 'modeCategory', 'thinkingLevel', 'Nj', 'oN'] as const)(
    'rejects a same-ID selected clone with mismatched %s',
    async (key) => {
      const f = fixture();
      const selected = JSON.parse(JSON.stringify(f.catalog[0]));
      if (key === 'thinkingLevel') selected.Ns[0].thinkingLevel = 'THINKING_LEVEL_DEEP_THINK';
      else if (key === 'Nj') selected.Ns[0].Nj = 'synthetic-other';
      else
        selected[key] =
          key === 'oN' ? [2] : key === 'modeCategory' ? 'MODE_CATEGORY_FAST' : 'synthetic-other';
      f.change.selected(selected);
      await expect(capture(f)).rejects.toHaveProperty('cause', 'model-selection');
      expect(f.namespace.oVd).not.toHaveBeenCalled();
    },
  );
  it.each(['Wo', 'modeCategory', 'thinkingLevel', 'Nj', 'oN'] as const)(
    'invalidates in-place request-relevant %s mutation even when selected and catalog still agree',
    async (key) => {
      const f = fixture();
      const receipt = await capture(f);
      const selected = f.catalog[0]!;
      if (key === 'thinkingLevel') selected.Ns[0]!.thinkingLevel = 'THINKING_LEVEL_DEEP_THINK';
      else if (key === 'Nj') Object.assign(selected.Ns[0]!, { Nj: 'synthetic-other' });
      else
        Object.assign(selected, {
          [key]:
            key === 'oN' ? [2] : key === 'modeCategory' ? 'MODE_CATEGORY_FAST' : 'synthetic-other',
        });
      expect(receipt.current()).toBe(false);
      receipt.close();
    },
  );
  it('rejects a request-relevant accessor without invoking it on a selected clone', async () => {
    const f = fixture();
    const selected = JSON.parse(JSON.stringify(f.catalog[0]));
    const getter = vi.fn(() => 'synthetic-other');
    Object.defineProperty(selected, 'Wo', { get: getter });
    f.change.selected(selected);
    await expect(capture(f)).rejects.toThrow();
    expect(getter).not.toHaveBeenCalled();
  });
  it.each([true, false])(
    'retains unrelated empty-ID category rows when mapping is %s',
    async (enabled) => {
      const f = fixture();
      f.catalog.push(
        { id: '', modeCategory: 'MODE_CATEGORY_FAST', Ns: [] },
        { id: '', modeCategory: 'MODE_CATEGORY_THINKING', Ns: [] },
      );
      const selected = JSON.parse(JSON.stringify(f.catalog[0]));
      f.change.selected(selected);
      if (!enabled) {
        f.consumer.Ua = false;
        f.Ca.Ea.mockReturnValue(false);
        f.change.effective(selected);
      }
      const receipt = await capture(f);
      expect(receipt.current()).toBe(true);
      expect(receipt.metadata.modeId).toBe(enabled ? 'synthetic-effective' : 'synthetic-auto');
      if (enabled) expect(f.namespace.oVd).toHaveBeenCalledWith('synthetic-auto', 1, f.catalog);
      else expect(f.namespace.oVd).not.toHaveBeenCalled();
      receipt.close();
    },
  );
  it.each(['id', 'category', 'routing', 'pair', 'cycle', 'hosts'] as const)(
    'rejects an unsupported empty-ID row %s',
    async (key) => {
      const f = fixture();
      const row = { id: '', modeCategory: 'MODE_CATEGORY_FAST', Ns: [] };
      f.catalog.push(row);
      if (key === 'id') Reflect.deleteProperty(row, 'id');
      else if (key === 'category') Reflect.deleteProperty(row, 'modeCategory');
      else if (key === 'routing') Object.assign(row, { Wo: 'synthetic-routing' });
      else if (key === 'pair') Object.assign(row, { Ns: [{ Nj: 'synthetic-effort' }] });
      else if (key === 'cycle') Object.assign(row, { Ns: [row] });
      else Object.assign(row, { oN: [NaN] });
      await expect(capture(f)).rejects.toHaveProperty('cause', 'model-selection-catalog');
      expect(f.namespace.oVd).not.toHaveBeenCalled();
    },
  );
  it('rejects an empty-ID row accessor without invoking it', async () => {
    const f = fixture();
    const row = { id: '', modeCategory: 'MODE_CATEGORY_FAST', Ns: [] };
    const getter = vi.fn(() => undefined);
    Object.defineProperty(row, 'Wo', { get: getter });
    f.catalog.push(row);
    await expect(capture(f)).rejects.toHaveProperty('cause', 'model-selection-catalog');
    expect(getter).not.toHaveBeenCalled();
  });
  it('invalidates an unrelated empty-ID row metadata mutation', async () => {
    const f = fixture();
    const row = { id: '', modeCategory: 'MODE_CATEGORY_FAST', Ns: [] };
    f.catalog.push(row);
    const receipt = await capture(f);
    row.modeCategory = 'MODE_CATEGORY_THINKING';
    expect(receipt.current()).toBe(false);
    receipt.close();
  });
  it('still rejects duplicate nonempty effective IDs in a mixed catalog', async () => {
    const f = fixture();
    f.catalog.push({ id: '', modeCategory: 'MODE_CATEGORY_FAST', Ns: [] }, { ...f.catalog[1]! });
    await expect(capture(f)).rejects.toHaveProperty('cause', 'model-selection-catalog');
    expect(f.namespace.oVd).not.toHaveBeenCalled();
  });
  it('never admits an empty-ID category as the actual effective model', async () => {
    const f = fixture();
    const row = { id: '', modeCategory: 'MODE_CATEGORY_FAST', Ns: [] };
    f.catalog.push(row);
    f.change.effective(row);
    await expect(capture(f)).rejects.toHaveProperty('cause', 'model-settings');
  });
});
