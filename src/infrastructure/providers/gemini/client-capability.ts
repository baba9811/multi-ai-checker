import type { GeminiClientCapability } from '../../../application/gemini-readiness';

// Serialized into MAIN: keep helpers and all provider references inside this function.
export function readGeminiClientCapability(): GeminiClientCapability {
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
  function liveView(value: unknown): value is unknown[] {
    if (!Array.isArray(value)) return false;
    const id = data(value, 19);
    const flags = data(value, 2);
    const metadata = data(value, 1);
    return (
      typeof id === 'number' &&
      Number.isSafeInteger(id) &&
      id >= 0 &&
      metadata !== null &&
      typeof metadata === 'object' &&
      typeof flags === 'number' &&
      Number.isInteger(flags) &&
      flags >= 0 &&
      flags <= 0xffffffff &&
      (flags & 256) === 0
    );
  }
  try {
    if (window.top !== window || location.href !== 'https://gemini.google.com/app') fail('page');
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
    const exported = (name: string) => data(namespace, name);
    const views = exported('DOb');
    reason = 'owner-view';
    if (!exact(views, Map.prototype)) fail('owner-view');
    const view: unknown = Map.prototype.get.call(views, id);
    if (!liveView(view) || data(view, 19) !== id) fail('owner-view');
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
    const componentClass = exported('sV');
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
      [81, 'owner-declaration-3'],
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
      if (data(node, 'iB') !== data(declaration, 1)) fail(reason);
      if (stage === 'owner-declaration-3') {
        reason = 'owner-declaration-3-binding';
        // Transplant insertion replaces slot 5; slot 16 retains the declaration origin.
        const origin = data(declaration, 16);
        if (
          !Array.isArray(origin) ||
          origin !== data(parent, 81) ||
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
    const conversationPrototype = prototype(exported('lN'));
    const apiPrototype = prototype(exported('HL'));
    const protectionPrototype = prototype(exported('pL'));
    const sessionPrototype = prototype(exported('RHd'));
    const registryPrototype = prototype(exported('DL'));
    reason = 'service-identity';
    const conversation = data(consumer, 'Oa');
    if (!exact(conversation, conversationPrototype)) fail('service-identity');
    const api = data(conversation, 'ha');
    if (!exact(api, apiPrototype)) fail('service-identity');
    const protection = data(api, 'Ja');
    const session = data(api, 'wb');
    const registry = data(api, 'Fb');
    if (
      !exact(protection, protectionPrototype) ||
      !exact(session, sessionPrototype) ||
      !exact(registry, registryPrototype)
    )
      fail('service-identity');
    reason = 'protection';
    if (data(protection, 'isEnabled') !== true) fail('protection');
    reason = 'transport-route';
    const route = data(api, 'Aa');
    if (route === false) {
      reason = 'transport-api';
      const initial = data(api, 'Nd');
      if (initial === true) fail('transport-sse');
      if (initial === false) fail('transport-rpc');
      fail('transport-api');
    }
    if (route !== true) fail('transport-route');
    // Nd selects only the legacy path; native sessions use the factory's oa flag.
    reason = 'transport-session';
    if (data(session, 'oa') !== true) fail('transport-session');

    reason = 'prewarm';
    if (
      Object.getPrototypeOf(registryPrototype) !== Object.prototype ||
      Object.getPrototypeOf(Object.prototype) !== null ||
      Object.getOwnPropertyDescriptor(registryPrototype, 'ha') ||
      Object.getOwnPropertyDescriptor(Object.prototype, 'ha')
    )
      fail('prewarm');
    const manager = Object.getOwnPropertyDescriptor(registry as object, 'ha');
    if (manager && (!Object.hasOwn(manager, 'value') || manager.value !== undefined))
      fail('prewarm');

    reason = 'hook';
    const connection = Object.getOwnPropertyDescriptor(namespace as object, 'QHd');
    const dispatch = Object.getOwnPropertyDescriptor(apiPrototype, 'Oub');
    if (
      !connection ||
      !Object.hasOwn(connection, 'value') ||
      typeof connection.value !== 'function' ||
      !connection.writable ||
      !connection.configurable ||
      !dispatch ||
      !Object.hasOwn(dispatch, 'value') ||
      typeof dispatch.value !== 'function' ||
      Object.getOwnPropertyDescriptor(api as object, 'Oub') ||
      !Object.isExtensible(api)
    )
      fail('hook');
    return { status: 'candidate' };
  } catch {
    return { status: 'unsupported', reason };
  }
}
