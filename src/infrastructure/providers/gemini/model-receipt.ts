import type { GeminiOwnedClient } from './client-capability';
import type { ApprovedGeminiTrial } from './fixed-text-contract';

type ModelMetadata = Pick<
  ApprovedGeminiTrial,
  'modeId' | 'modeCategory' | 'Cq' | 'thinkingLevel' | 'Hj'
>;
const signals = ['host', 'Yb', 'r$f', 'H8', 'ZL', 'vT'] as const;
const alternatives = ['iKb', 'gKb', 'hKb', 'jhc'] as const;
function require(condition: unknown): asserts condition {
  if (!condition) throw new Error();
}
function data(value: unknown, key: PropertyKey): unknown {
  require(value !== null && (typeof value === 'object' || typeof value === 'function'));
  const descriptor = Object.getOwnPropertyDescriptor(value, key);
  require(!descriptor || 'value' in descriptor);
  return descriptor?.value;
}
function method(value: unknown, key: PropertyKey): Function {
  require(value !== null && typeof value === 'object');
  for (let at: object | null = value; at; at = Object.getPrototypeOf(at)) {
    const descriptor = Object.getOwnPropertyDescriptor(at, key);
    if (!descriptor) continue;
    require('value' in descriptor && typeof descriptor.value === 'function');
    return descriptor.value;
  }
  throw new Error();
}
const id = (value: unknown): value is string =>
  typeof value === 'string' && !!value && value.length <= 160 && !/\s/.test(value);
function list(value: unknown): unknown[] {
  require(Array.isArray(value) && Object.getPrototypeOf(value) === Array.prototype);
  const length = data(value, 'length');
  require(typeof length === 'number' && length <= 128);
  const result: unknown[] = [];
  for (let index = 0; index < length; index++) {
    require(Object.hasOwn(value, index));
    result.push(data(value, index));
  }
  return result;
}
// Only the source-projected fields used by VUd, YK and the final request.
// Serialize new primitive tuples, never a provider object or its toJSON method.
function modelSnapshot(value: unknown): string {
  require(value !== null && typeof value === 'object');
  require(
    Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null,
  );
  const modeId = data(value, 'id');
  const category = data(value, 'modeCategory');
  const routing = data(value, 'Uo');
  require(id(modeId) || modeId === '');
  require(
    category === undefined ||
      (typeof category === 'string' &&
        category.length <= 160 &&
        /^MODE_CATEGORY_[A-Z_]+$/.test(category)),
  );
  require(routing === undefined || id(routing));
  // The catalog projection retains category-only rows in the catalog; these cannot identify a send model.
  require(modeId !== '' || (typeof category === 'string' && routing === undefined));
  const pairs = list(data(value, 'Ms') ?? []).map((pair) => {
    require(pair !== null && typeof pair === 'object');
    require(
      Object.getPrototypeOf(pair) === Object.prototype || Object.getPrototypeOf(pair) === null,
    );
    const level = data(pair, 'thinkingLevel');
    const effort = data(pair, 'Lj');
    require(
      typeof level === 'string' && level.length <= 160 && /^THINKING_LEVEL_[A-Z_]+$/.test(level),
    );
    require(effort === undefined || id(effort));
    return [level, effort];
  });
  const hosts = list(data(value, 'oN') ?? []);
  require(hosts.every((host) => typeof host === 'number' && Number.isFinite(host)));
  return JSON.stringify([modeId, category, routing, pairs, hosts]);
}

/** MAIN-local pre-send receipt. Normal final responses may subsequently change the preference. */
export async function captureGeminiTrialModel(
  client: GeminiOwnedClient,
  ui: { model: string; modeId: string },
  signal: AbortSignal,
): Promise<{ model: string; metadata: ModelMetadata; current(): boolean; close(): void }> {
  let closed = false;
  let subscription: object | undefined;
  let rejectPending: ((reason: unknown) => void) | undefined;
  let stage:
    | 'model-bindings'
    | 'model-catalog'
    | 'model-selection'
    | 'model-selection-id'
    | 'model-selection-ui'
    | 'model-selection-catalog'
    | 'model-settings' = 'model-bindings';
  const failure = () => new Error('Gemini trial model failed.', { cause: stage });
  function close() {
    if (closed) return;
    closed = true;
    signal.removeEventListener('abort', abort);
    rejectPending?.(failure());
    if (subscription) Reflect.apply(method(subscription, 'unsubscribe'), subscription, []);
  }
  function abort() {
    try {
      close();
    } catch {
      /* Closed before SDK teardown. */
    }
  }
  try {
    require(!signal.aborted);

    require(typeof ui.model === 'string' && !!ui.model.trim() && ui.model.length <= 160);
    require(id(ui.modeId));
    const { namespace, consumer, conversation } = client;
    const service = data(consumer, 'bardModeService');
    const nb = data(consumer, 'nb');
    const scope = data(consumer, 'Ca');
    for (const [name, value] of [
      ['YK', service],
      ['PF', nb],
    ] as const) {
      const constructor = data(namespace, name);
      require(typeof constructor === 'function' && value !== null && typeof value === 'object');
      require(Object.getPrototypeOf(value) === data(constructor, 'prototype'));
    }
    const selectedSignals = signals.map((key) => {
      const signal = data(consumer, key);
      require(typeof signal === 'function');
      return signal;
    });
    const flag = data(namespace, 'IAb');
    require(flag !== undefined);
    const resolve = data(namespace, 'VUd');
    require(typeof resolve === 'function');
    const resolveMode = resolve;
    const config = method(scope, 'Ea');
    const enabled = data(consumer, 'Sa');
    require(typeof enabled === 'boolean');
    const catalogConstructor = data(namespace, 'PF');
    const catalogPrototype = data(catalogConstructor, 'prototype') as object;
    const catalogDescriptor = Object.getOwnPropertyDescriptor(catalogPrototype, 'pG');
    require(catalogDescriptor && 'value' in catalogDescriptor);
    const retainedCatalogDescriptor = { ...catalogDescriptor };
    const source = catalogDescriptor.value;
    require(!Object.getOwnPropertyDescriptor(nb, 'pG'));
    require(
      typeof source === 'function' &&
        Function.prototype.toString.call(source) ===
          'function(){return this.ha().pipe(_.v(a=>{var b,c,d=(this.Na&&_.evc(a)?(b=a.mVa)!=null?b:[]:(c=a.iR)!=null?c:[]).filter(e=>e.tEa||this.Ha.includes(e.id)||!this.Aa&&this.Wa.includes(e.id)?!1:!0);return this.Sa?d.reverse():d}),_.uw((a,b)=>JSON.stringify(a)===JSON.stringify(b)))}',
    );
    function catalogCurrent() {
      const descriptor = Object.getOwnPropertyDescriptor(catalogPrototype, 'pG');
      require(
        !closed &&
          !signal.aborted &&
          data(namespace, 'PF') === catalogConstructor &&
          data(catalogConstructor, 'prototype') === catalogPrototype &&
          Object.getPrototypeOf(nb) === catalogPrototype &&
          !Object.getOwnPropertyDescriptor(nb, 'pG') &&
          descriptor &&
          'value' in descriptor &&
          (['value', 'writable', 'enumerable', 'configurable'] as const).every(
            (key) => descriptor[key] === retainedCatalogDescriptor[key],
          ),
      );
    }
    catalogCurrent();
    const observable = data(namespace, 'st');
    require(typeof source === 'function' && typeof observable === 'function');
    const observablePrototype = data(observable, 'prototype');
    require(observablePrototype !== null && typeof observablePrototype === 'object');
    const combine = data(namespace, 'At');
    require(typeof combine === 'function');
    stage = 'model-catalog';
    const catalogStream = Reflect.apply(source, nb, []);
    const inputs: Record<string, unknown> = { catalog: catalogStream };
    for (const key of alternatives) inputs[key] = data(service, key);
    const stream = Reflect.apply(combine, namespace, [inputs]);
    require(stream !== null && typeof stream === 'object' && !Object.hasOwn(stream, 'subscribe'));
    let normal = false;
    for (let at: object | null = Object.getPrototypeOf(stream); at; at = Object.getPrototypeOf(at))
      if (at === observablePrototype) normal = true;
    require(normal);
    const subscribe = data(observablePrototype, 'subscribe');
    require(typeof subscribe === 'function');
    let latest: unknown;
    const ready = new Promise<unknown>((resolve, reject) => {
      rejectPending = reject;
      signal.addEventListener('abort', abort, { once: true });
      if (signal.aborted) {
        abort();
        return;
      }
      subscription = Reflect.apply(subscribe, stream, [
        {
          next(value: unknown) {
            if (!closed) {
              latest = value;
              resolve(value);
            }
          },
          error() {
            abort();
          },
          complete() {
            abort();
          },
        },
      ]);
      require(subscription !== null && typeof subscription === 'object');
      if (closed) Reflect.apply(method(subscription, 'unsubscribe'), subscription, []);
    });
    const initial = await ready;
    const catalog = data(initial, 'catalog');
    rejectPending = undefined;
    require(!closed && !signal.aborted && data(latest, 'catalog') === catalog);
    stage = 'model-selection-id';
    const selected = Reflect.apply(selectedSignals[1]!, consumer, []);
    const selectedId = data(selected, 'id');
    require(id(selectedId));
    stage = 'model-selection-ui';
    require(selectedId === ui.modeId);
    stage = 'model-selection-catalog';
    const sourceCatalog = list(catalog);
    require(sourceCatalog.length > 0);
    const identities = sourceCatalog.map((entry) => data(entry, 'id'));
    require(identities.every((value) => id(value) || value === ''));
    const nonemptyIdentities = identities.filter(id);
    require(new Set(nonemptyIdentities).size === nonemptyIdentities.length);
    const catalogSnapshots = sourceCatalog.map(modelSnapshot);
    stage = 'model-selection';
    const selectedSnapshot = modelSnapshot(selected);
    require(catalogSnapshots[identities.indexOf(selectedId)] === selectedSnapshot);

    function read(): {
      effective: unknown;
      metadata: ModelMetadata;
      level: unknown;
      effort: unknown;
    } {
      stage = 'model-settings';
      for (const key of alternatives) {
        require(data(service, key) === inputs[key]);
        const value = data(latest, key);
        require(value === undefined || value === null);
      }
      catalogCurrent();
      require(
        !closed &&
          !signal.aborted &&
          data(namespace, 'st') === observable &&
          data(namespace, 'At') === combine &&
          data(latest, 'catalog') === catalog,
      );
      require(data(namespace, 'VUd') === resolve && data(namespace, 'IAb') === flag);
      require(method(scope, 'Ea') === config && Reflect.apply(config, scope, [flag]) === enabled);
      require(data(consumer, 'Sa') === enabled);
      for (const owner of [consumer, conversation, service]) {
        require(data(owner, 'nb') === nb && data(owner, 'Ca') === scope);
        if (owner !== service) require(data(owner, 'bardModeService') === service);
      }
      signals.forEach((key, index) => require(data(consumer, key) === selectedSignals[index]));
      const values = selectedSignals.map((signal) => Reflect.apply(signal, consumer, []));
      require(values[0] === 1 && values[1] === selected && values[2] === selectedId);
      const entries = list(catalog);
      require(
        entries.length === sourceCatalog.length &&
          entries.every((entry, index) => entry === sourceCatalog[index]),
      );
      require(entries.every((entry, index) => data(entry, 'id') === identities[index]));
      require(
        modelSnapshot(selected) === selectedSnapshot &&
          entries.every((entry, index) => modelSnapshot(entry) === catalogSnapshots[index]),
      );
      const effective = enabled
        ? Reflect.apply(resolveMode, namespace, [selectedId, 1, catalog])
        : selected;
      require(enabled ? entries.includes(effective) : effective === selected);
      const modeId = data(effective, 'id');
      require(id(modeId) && values[3] === modeId);
      const modeCategory = data(effective, 'modeCategory');
      const Cq = data(effective, 'Uo');
      require(
        modeCategory === undefined ||
          (typeof modeCategory === 'string' && /^MODE_CATEGORY_[A-Z_]+$/.test(modeCategory)),
      );
      require(Cq === undefined || id(Cq));
      const [level, effort] = [values[4], values[5]];
      require(
        level === undefined ||
          (typeof level === 'string' && /^THINKING_LEVEL_[A-Z_]+$/.test(level)),
      );
      require(effort === undefined || id(effort));
      let thinkingLevel = level as string | undefined;
      let Hj = effort as string | undefined;
      // Preserve a thinking pair only when the source-remapped model supports it.
      if (modeId !== selectedId) {
        const pairs = list(data(effective, 'Ms') ?? []).filter(
          (entry) => data(entry, 'thinkingLevel') === level,
        );
        if (!pairs.length) {
          thinkingLevel = undefined;
          Hj = undefined;
        } else if (!effort || !pairs.some((entry) => data(entry, 'Lj') === effort)) Hj = undefined;
      }
      catalogCurrent();
      return {
        effective,
        metadata: {
          modeId,
          modeCategory: modeCategory as string | undefined,
          Cq: Cq as string | undefined,
          thinkingLevel,
          Hj,
        },
        level,
        effort,
      };
    }
    const captured = read();
    const metadata = Object.freeze(captured.metadata);
    return Object.freeze({
      model: ui.model,
      metadata,
      close,
      current() {
        try {
          const next = read();
          return (
            next.effective === captured.effective &&
            next.level === captured.level &&
            next.effort === captured.effort &&
            Object.keys(metadata).every(
              (key) =>
                next.metadata[key as keyof ModelMetadata] === metadata[key as keyof ModelMetadata],
            )
          );
        } catch {
          return false;
        }
      },
    });
  } catch {
    try {
      close();
    } catch {
      /* No receipt is returned after failed cleanup. */
    }
    throw failure();
  }
}
