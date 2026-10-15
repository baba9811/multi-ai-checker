import type { GeminiClientCapability } from '../../../application/gemini-readiness';

export type GeminiOwnedClient = {
  namespace: object;
  consumer: object;
  conversation: object;
  api: object;
  host: HTMLElement;
  owner: HTMLElement;
};

// Serialized into MAIN: keep helpers and all provider references inside this function.
export function readGeminiClientCapability(
  capture: ((client: GeminiOwnedClient) => void) | undefined = undefined,
  expectedUrl: string = 'https://gemini.google.com/app',
): GeminiClientCapability {
  type Reason = Extract<GeminiClientCapability, { status: 'unsupported' }>['reason'];
  let reason: Reason = 'page';
  const missing = Symbol();
  function fail(code: Reason): never {
    reason = code;
    throw new Error();
  }
  function object(value: unknown): value is object {
    return value !== null && (typeof value === 'object' || typeof value === 'function');
  }
  function data(value: unknown, key: PropertyKey): unknown {
    if (!object(value)) fail('runtime-shape');
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor) return missing;
    if (!Object.hasOwn(descriptor, 'value')) fail('runtime-shape');
    return descriptor.value;
  }
  function prototype(value: unknown): object {
    if (typeof value !== 'function') fail('runtime-shape');
    const result = data(value, 'prototype');
    if (!object(result)) fail('runtime-shape');
    return result;
  }
  function exact(value: unknown, expected: object): value is object {
    return object(value) && Object.getPrototypeOf(value) === expected;
  }
  function visible(element: Element): element is HTMLElement {
    if (
      !(element instanceof HTMLElement) ||
      !element.isConnected ||
      element.ownerDocument !== document ||
      element.closest('[hidden], [inert], [aria-hidden="true"]')
    )
      return false;
    const style = getComputedStyle(element);
    if (
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      style.visibility === 'collapse'
    )
      return false;
    if ([...element.getClientRects()].some((rect) => rect.width > 0 && rect.height > 0))
      return true;
    if (style.display !== 'contents') return false;
    const range = document.createRange();
    range.selectNodeContents(element);
    return [...range.getClientRects()].some((rect) => rect.width > 0 && rect.height > 0);
  }
  function liveView(value: unknown, root = false): value is unknown[] {
    if (!Array.isArray(value)) {
      if (root) reason = value === undefined ? 'owner-view-missing' : 'owner-view-shape';
      return false;
    }
    const id = data(value, 19);
    const flags = data(value, 2);
    const metadata = data(value, 1);
    if (root) reason = 'owner-view-id';
    if (!(typeof id === 'number' && Number.isSafeInteger(id) && id >= 0)) return false;
    if (root) reason = 'owner-view-metadata';
    if (!(metadata !== null && typeof metadata === 'object')) return false;
    if (root) reason = 'owner-view-flags';
    return (
      typeof flags === 'number' &&
      Number.isInteger(flags) &&
      flags >= 0 &&
      flags <= 0xffffffff &&
      (flags & 256) === 0
    );
  }
  try {
    if (capture !== undefined && typeof capture !== 'function') fail('runtime-shape');
    if (
      typeof expectedUrl !== 'string' ||
      !/^https:\/\/gemini\.google\.com\/app(?:\/[0-9a-fA-F]{1,16})?$/.test(expectedUrl) ||
      window.top !== window ||
      location.href !== expectedUrl
    )
      fail('page');
    reason = 'owner';
    const hosts = [
      ...document.querySelectorAll('gem-button[data-test-id="bard-mode-menu-button"]'),
    ].filter(visible);
    if (hosts.length !== 1) fail('owner');
    const host = hosts[0]!;
    const owner = host.closest('bard-mode-switcher[data-test-id="bard-mode-switcher"]');
    if (!owner || !visible(owner) || host.closest('bard-mode-switcher') !== owner) fail('owner');
    const buttons = [...host.querySelectorAll('button')].filter(
      (button) =>
        visible(button) &&
        button.closest('gem-button') === host &&
        button.closest('bard-mode-switcher') === owner,
    );
    if (buttons.length !== 1) fail('owner');
    reason = 'owner-context';
    const id = data(host, '__ngContext__');
    if (typeof id !== 'number' || !Number.isSafeInteger(id) || id < 0) fail('owner-context');

    reason = 'runtime-shape';
    const namespace = data(window, 'default_BardChatUi');
    if (!object(namespace)) fail('runtime-shape');
    const exported = (name: string) => data(namespace, name);
    const views = exported('uPb');
    reason = 'owner-view-registry';
    if (!exact(views, Map.prototype)) fail('owner-view-registry');
    reason = 'owner-view-missing';
    const view: unknown = Map.prototype.get.call(views, id);
    if (!liveView(view, true)) fail(reason);
    reason = 'owner-view-id';
    if (data(view, 19) !== id) fail('owner-view-id');
    reason = 'owner-slot';
    const slot = data(view, 28);
    function ownedComponent(value: unknown): value is unknown[] {
      return (
        liveView(value) &&
        data(value, 0) === host &&
        data(value, 3) === view &&
        data(value, 14) === view
      );
    }
    if (slot !== host) {
      if (Array.isArray(slot) && data(slot, 1) === true) {
        const flags = data(slot, 2);
        if ((flags !== 0 && flags !== 2) || data(slot, 3) !== view) fail('owner-slot');
        const nodes = data(data(view, 1), 'data');
        if (!Array.isArray(nodes)) fail('owner-slot');
        const node = data(nodes, 28);
        if (
          !object(node) ||
          data(node, 'index') !== 28 ||
          data(node, 'type') !== 2 ||
          data(node, 'value') !== 'gem-button' ||
          data(slot, 5) !== node
        )
          fail('owner-slot');
        const component = data(slot, 0);
        if (!ownedComponent(component) || data(component, 5) !== node) fail('owner-slot');
        const anchor = data(slot, 7);
        const parent = host.parentNode;
        if (
          !(anchor instanceof Comment) ||
          !anchor.isConnected ||
          anchor.ownerDocument !== document ||
          !parent ||
          anchor.parentNode !== parent
        )
          fail('owner-slot');
      } else if (!ownedComponent(slot)) fail('owner-slot');
    }

    reason = 'runtime-shape';
    const componentClass = exported('ZU');
    const componentPrototype = prototype(componentClass);
    const definition = data(componentClass, 'Ra');
    if (!object(definition) || data(definition, 'type') !== componentClass) fail('runtime-shape');
    const template = data(definition, 'template');
    if (typeof template !== 'function') fail('runtime-shape');

    let declaration = view;
    const seen = new Set<object>([view]);
    for (const [index, stage] of [
      [30, 'owner-declaration-1'],
      [29, 'owner-declaration-2'],
      [83, 'owner-declaration-3'],
    ] as const) {
      reason = stage;
      const parent = data(declaration, 14);
      if (!liveView(parent) || seen.has(parent)) fail(stage);
      if (stage === 'owner-declaration-3') reason = 'owner-declaration-3-node';
      const nodes = data(data(parent, 1), 'data');
      if (!Array.isArray(nodes)) fail(reason);
      const node = data(nodes, index);
      if (!object(node) || data(node, 'index') !== index) fail(reason);
      if (stage === 'owner-declaration-3') reason = 'owner-declaration-3-template';
      if (data(node, 'zB') !== data(declaration, 1)) fail(reason);
      if (stage === 'owner-declaration-3') {
        reason = 'owner-declaration-3-binding';
        // Transplant insertion replaces slot 5; slot 16 retains the declaration origin.
        const origin = data(declaration, 16);
        if (
          !Array.isArray(origin) ||
          origin !== data(parent, 83) ||
          data(origin, 1) !== true ||
          data(origin, 3) !== parent ||
          data(origin, 5) !== node
        )
          fail(reason);
      } else if (data(declaration, 5) !== node) fail(reason);
      seen.add(parent);
      declaration = parent;
    }
    reason = 'owner-component';
    const componentView = data(declaration, 1);
    const consumer = data(declaration, 8);
    if (
      data(declaration, 0) !== owner ||
      data(componentView, 'type') !== 1 ||
      data(componentView, 'template') !== template ||
      !exact(consumer, componentPrototype)
    )
      fail('owner-component');

    reason = 'runtime-shape';
    const conversationPrototype = prototype(exported('GN'));
    const apiPrototype = prototype(exported('pM'));
    const protectionPrototype = prototype(exported('bM'));
    const sessionPrototype = prototype(exported('eKd'));
    const registryPrototype = prototype(exported('hKd'));
    reason = 'service-identity';
    const conversation = data(consumer, 'Oa');
    if (!exact(conversation, conversationPrototype)) fail('service-identity');
    const api = data(conversation, 'ha');
    if (!exact(api, apiPrototype)) fail('service-identity');
    const protection = data(api, 'Ja');
    const session = data(api, 'ub');
    const registry = data(api, 'Eb');
    if (
      !exact(protection, protectionPrototype) ||
      !exact(session, sessionPrototype) ||
      !exact(registry, registryPrototype)
    )
      fail('service-identity');
    reason = 'protection';
    if (data(protection, 'isEnabled') !== true) fail('protection');
    // The bundled trial only captures these references; route approval happens afterward.
    capture?.({ namespace, consumer, conversation, api, host, owner });
    reason = 'transport-route';
    const route = data(api, 'Aa');
    if (route === false) {
      reason = 'transport-api';
      const initial = data(api, 'Kd');
      if (initial === true) fail('transport-sse');
      if (initial === false) fail('transport-rpc');
      fail('transport-api');
    }
    if (route !== true) fail('transport-route');
    // Kd selects only the legacy path; native sessions use the factory's oa flag.
    reason = 'transport-session';
    const nativeSse = data(session, 'oa');
    if (nativeSse !== true && nativeSse !== false) fail('transport-session');

    reason = 'prewarm';
    if (
      Object.getPrototypeOf(registryPrototype) !== Object.prototype ||
      Object.getPrototypeOf(Object.prototype) !== null ||
      Object.getOwnPropertyDescriptor(registryPrototype, 'ha') ||
      Object.getOwnPropertyDescriptor(Object.prototype, 'ha')
    )
      fail('prewarm');
    const manager = Object.getOwnPropertyDescriptor(registry as object, 'ha');
    if (manager) {
      if (!Object.hasOwn(manager, 'value')) fail('prewarm');
      if (manager.value !== undefined) {
        try {
          const managerClass = exported('qVd');
          if (typeof managerClass !== 'function') fail('prewarm');
          const managerPrototype = data(managerClass, 'prototype');
          const idle = manager.value;
          if (
            managerPrototype === null ||
            typeof managerPrototype !== 'object' ||
            idle === null ||
            typeof idle !== 'object' ||
            !exact(idle, managerPrototype) ||
            Object.getPrototypeOf(managerPrototype) !== Object.prototype ||
            Object.getPrototypeOf(Object.prototype) !== null ||
            data(idle, 'Na') !== session ||
            data(idle, 'Oa') !== conversation ||
            data(idle, 'ka') !== false
          )
            fail('prewarm');
          for (const key of ['ha', 'wa', 'Ja', 'Ga']) {
            if (
              Object.getOwnPropertyDescriptor(managerPrototype, key) ||
              Object.getOwnPropertyDescriptor(Object.prototype, key)
            )
              fail('prewarm');
            const state = data(idle, key);
            if (state !== missing && state !== undefined) fail('prewarm');
          }
          const enabled = data(idle, 'Za');
          const sse = data(idle, 'kb');
          if ((enabled !== true && enabled !== false) || sse !== nativeSse) fail('prewarm');
        } catch {
          // Unsupported manager descriptors retain the existing bounded prewarm reason.
          fail('prewarm');
        }
      }
    }

    reason = 'hook';
    const connection = Object.getOwnPropertyDescriptor(namespace as object, 'dKd');
    const dispatch = Object.getOwnPropertyDescriptor(apiPrototype, 'Zxb');
    if (
      !connection ||
      !Object.hasOwn(connection, 'value') ||
      typeof connection.value !== 'function' ||
      !connection.writable ||
      !connection.configurable ||
      !dispatch ||
      !Object.hasOwn(dispatch, 'value') ||
      typeof dispatch.value !== 'function' ||
      Object.getOwnPropertyDescriptor(api as object, 'Zxb') ||
      !Object.isExtensible(api)
    )
      fail('hook');
    if (nativeSse === false) fail('transport-webchannel');
    return { status: 'candidate' };
  } catch {
    return { status: 'unsupported', reason };
  }
}
