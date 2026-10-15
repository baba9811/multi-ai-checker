import { afterEach, expect, it, vi } from 'vitest';
import {
  inspectGeminiHeader,
  modelMenu,
  readClaudeProbeLabel,
  readGeminiMode,
} from '../../../src/infrastructure/providers/models';
import { visible } from '../../../src/infrastructure/providers/dom-utils';

vi.mock('../../../src/infrastructure/providers/dom-utils', () => ({ visible: vi.fn(() => true) }));
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.mocked(visible).mockReset().mockReturnValue(true);
  vi.unstubAllGlobals();
});

// Only the existing refusal predicates and cleanup calls; rendered DOM is covered by browser fixtures.
function menuFailure(site: string) {
  let opened = false;
  const local = [
    'owner-missing',
    'owner-changed',
    'trigger-detached',
    'popover-ambiguous',
    'menu-ambiguous',
  ].includes(site);
  const owner = {
    querySelectorAll: () =>
      opened ? Array.from({ length: site === 'popover-ambiguous' ? 2 : 1 }, () => popover) : [],
  };
  const popover = {
    closest: () => owner,
    querySelectorAll: () =>
      Array.from({ length: site === 'menu-ambiguous' ? 2 : 0 }, () => ({ closest: () => owner })),
  };
  const host = { closest: () => (site === 'owner-missing' ? null : owner) };
  const button = {
    tagName: 'BUTTON',
    innerText: 'Gemini fixture',
    getAttribute: (key: string) =>
      key === 'aria-expanded'
        ? site === 'open-trigger'
          ? 'true'
          : 'false'
        : key === 'aria-controls' && site === 'owner-duplicate'
          ? 'synthetic-menu'
          : null,
    hasAttribute: (key: string) => key === 'aria-controls' && site === 'owner-duplicate',
    closest: vi.fn((selector: string) => {
      if (site === 'trigger-detached' && opened) throw new Error('Detached ancestry was read.');
      return selector.startsWith('gem-button')
        ? local
          ? host
          : null
        : site === 'owner-changed' && opened
          ? null
          : owner;
    }),
    click: vi.fn(() => {
      opened = true;
    }),
    dispatchEvent: vi.fn(() => {
      opened = false;
    }),
  };
  Object.defineProperty(button, 'isConnected', {
    get: vi.fn(() => site !== 'trigger-detached' || !opened),
  });
  vi.stubGlobal('KeyboardEvent', Event);
  vi.stubGlobal('document', {
    activeElement: button,
    querySelectorAll: (selector: string) => {
      if (
        selector.includes('bard-mode-menu-button') ||
        selector.includes('model-selector-dropdown') ||
        selector.includes('model-switcher-dropdown-button')
      )
        return [button];
      if (selector === '[role="menu"], [role="listbox"]') return site === 'open-menu' ? [{}] : [];
      if (selector === '[id]' && opened)
        return [{ id: 'synthetic-menu' }, { id: 'synthetic-menu' }];
      return [];
    },
  });
  return button;
}

it.each([
  ['open-trigger', '열린 모델 메뉴를 먼저 닫아주세요.'],
  ['open-menu', '사이트의 열린 메뉴를 먼저 닫아주세요.'],
  ['owner-missing', 'Gemini 모델 메뉴의 연결을 확인하지 못했습니다.'],
  ['owner-changed', 'Gemini 모델 메뉴의 연결이 변경되었습니다.'],
  ['popover-ambiguous', 'Gemini 모델 메뉴의 연결이 모호합니다.'],
  ['menu-ambiguous', 'Gemini 모델 메뉴의 연결이 모호합니다.'],
  ['controls-invalid', 'Gemini 모델 메뉴의 연결을 확인하지 못했습니다.'],
  ['owner-duplicate', 'Gemini 모델 메뉴의 연결이 모호합니다.'],
])(
  'classifies the existing Gemini refusal site %s with the original cause and message',
  async (site, message) => {
    const button = menuFailure(site);
    const failure = await readGeminiMode().catch((error) => error);
    expect(failure).toMatchObject({ message, cause: 'model-menu', geminiMenuDiagnostic: site });
    expect(button.click).toHaveBeenCalledTimes(
      ['open-trigger', 'open-menu', 'owner-missing'].includes(site) ? 0 : 1,
    );
    if (site === 'owner-changed') {
      expect(Object.getOwnPropertyDescriptor(button, 'isConnected')!.get).toHaveBeenCalledTimes(1);
      expect(button.closest).toHaveBeenCalledTimes(2);
      expect(button.dispatchEvent).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ type: 'keydown' }),
      );
    }
  },
);

it.each(['chatgpt', 'claude'] as const)(
  'preserves ordinary %s menu errors without Gemini diagnostics',
  async (provider) => {
    for (const [site, message] of [
      ['open-trigger', '열린 모델 메뉴를 먼저 닫아주세요.'],
      ['open-menu', '사이트의 열린 메뉴를 먼저 닫아주세요.'],
    ]) {
      const button = menuFailure(site!);
      const failure = await modelMenu(provider).catch((error) => error);
      expect(failure).toMatchObject({ message, cause: 'model-menu' });
      expect(Object.hasOwn(failure, 'geminiMenuDiagnostic')).toBe(false);
      expect(Object.hasOwn(failure, 'geminiTriggerDiagnostic')).toBe(false);
      expect(button.click).not.toHaveBeenCalled();
    }
  },
);

it('keeps the normal Gemini model catalog caller on the shared menu error contract', async () => {
  const button = menuFailure('open-trigger');
  await expect(modelMenu('gemini')).rejects.toMatchObject({
    message: '열린 모델 메뉴를 먼저 닫아주세요.',
    cause: 'model-menu',
    geminiMenuDiagnostic: 'open-trigger',
  });
  expect(button.click).not.toHaveBeenCalled();
});

it('distinguishes a detached captured trigger without reading its ancestry after opening', async () => {
  const button = menuFailure('trigger-detached');
  const failure = await readGeminiMode().catch((error) => error);
  expect(failure).toMatchObject({
    message: 'Gemini 모델 메뉴의 연결이 변경되었습니다.',
    cause: 'model-menu',
    geminiMenuDiagnostic: 'trigger-detached',
  });
  expect(Object.getOwnPropertyDescriptor(button, 'isConnected')!.get).toHaveBeenCalledTimes(1);
  expect(button.closest).toHaveBeenCalledTimes(1);
  expect(button.click).toHaveBeenCalledTimes(1);
  expect(button.dispatchEvent).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ type: 'keydown' }),
  );
});

// This replacement occurs in readyTrigger's await gap, before the menu reader captures its owner.
function readinessReplacement(
  kind: 'inner' | 'host',
  fresh: 'normal' | 'absent' | 'ambiguous' = 'normal',
  afterReplace = () => {},
) {
  let opened = false,
    replaced = false,
    queued = false,
    staleLabelReads = 0;
  let host: any, button: any;
  const owner = { querySelectorAll: () => (opened ? [popover] : []) };
  const option: any = {
    getAttribute: (key: string) => (key === 'data-mode-id' ? 'synthetic-current-mode' : null),
    innerText: 'Automatic fixture',
    classList: { contains: (name: string) => name === 'selected' },
    closest: () => menu,
    querySelectorAll: () => [{ innerText: 'Automatic fixture', closest: () => option }],
  };
  const menu = { closest: () => owner, querySelectorAll: () => [option] };
  const popover = { closest: () => owner, querySelectorAll: () => [menu] };
  const makeButton = (parent: any) => ({
    tagName: 'BUTTON',
    get innerText() {
      if (replaced && this !== button) staleLabelReads++;
      return 'Gemini Automatic fixture';
    },
    get isConnected() {
      return !replaced || this === button;
    },
    getAttribute: () => null,
    hasAttribute: () => false,
    closest: (selector: string) => (selector.startsWith('gem-button') ? parent : parent.closest()),
    click: vi.fn(() => {
      if (!replaced || parent === host) opened = true;
    }),
    dispatchEvent: vi.fn(() => {
      opened = false;
    }),
  });
  const makeHost = () => ({
    tagName: 'GEM-BUTTON',
    innerText: 'Gemini Automatic fixture',
    getAttribute: () => null,
    closest() {
      return this === host ? owner : null;
    },
    querySelectorAll: () => [button],
  });
  host = makeHost();
  button = makeButton(host);
  const stale = button;
  vi.stubGlobal('KeyboardEvent', Event);
  vi.stubGlobal('document', {
    get activeElement() {
      return button;
    },
    querySelectorAll: (selector: string) => {
      if (selector === '[data-test-id="bard-mode-menu-button"]') {
        if (!queued) {
          queued = true;
          queueMicrotask(() => {
            replaced = true;
            if (kind === 'host') host = makeHost();
            button = makeButton(host);
            afterReplace();
          });
        }
        return replaced && fresh === 'absent'
          ? []
          : replaced && fresh === 'ambiguous'
            ? [host, host]
            : [host];
      }
      if (selector === '[role="menu"], [role="listbox"]') return opened ? [menu] : [];
      if (selector.startsWith('[role="menuitemradio"]')) return opened ? [option] : [];
      return [];
    },
  });
  return {
    stale,
    current: () => button,
    owner,
    currentOwner: () => host.closest(),
    staleLabelReads: () => staleLabelReads,
  };
}

it.each(['inner', 'host'] as const)(
  'captures the current compact trigger after %s replacement in the readiness await gap',
  async (kind) => {
    const f = readinessReplacement(kind);
    await expect(readGeminiMode()).resolves.toEqual({
      label: 'Automatic fixture',
      modeId: 'synthetic-current-mode',
    });
    expect(f.stale.isConnected).toBe(false);
    expect(f.stale.click).not.toHaveBeenCalled();
    expect(f.staleLabelReads()).toBe(0);
    expect(f.current().click).toHaveBeenCalledTimes(1);
    expect(f.currentOwner()).toBe(f.owner);
    expect(f.current().dispatchEvent).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ type: 'keydown' }),
    );
  },
);

it.each(['absent', 'ambiguous'] as const)(
  'refuses a %s fresh trigger without clicking the captured stale control',
  async (fresh) => {
    const f = readinessReplacement('inner', fresh);
    await expect(readGeminiMode()).rejects.toMatchObject({ cause: 'model-trigger' });
    expect(f.stale.click).not.toHaveBeenCalled();
    expect(f.current().click).not.toHaveBeenCalled();
    expect(f.staleLabelReads()).toBe(0);
  },
);
it('does not capture or click a replacement trigger when aborted in the readiness await gap', async () => {
  const controller = new AbortController();
  const f = readinessReplacement('inner', 'normal', () => controller.abort());
  await expect(readGeminiMode(controller.signal)).rejects.toMatchObject({ name: 'AbortError' });
  expect(f.stale.click).not.toHaveBeenCalled();
  expect(f.current().click).not.toHaveBeenCalled();
  expect(f.staleLabelReads()).toBe(0);
});

// Synthetic owning DOM; timers replace the whole provisional owner before any admission.
function headerProjection() {
  let current: any,
    opened: any,
    duplicate = false,
    absent = false;
  const doc: any = {
    get activeElement() {
      return opened?.button;
    },
    querySelectorAll(selector: string) {
      if (selector === '[data-test-id="bard-mode-menu-button"]')
        return absent ? [] : duplicate ? [current.host, current.host] : [current.host];
      if (selector === '[role="menu"], [role="listbox"]') return opened ? [opened.menu] : [];
      if (selector.startsWith('[role="menuitemradio"]')) return opened ? [opened.option] : [];
      return [];
    },
  };
  const node = (selector: string, parentElement: any = null): any => ({
    parentElement,
    ownerDocument: doc,
    isConnected: true,
    matches: (value: string) => value === selector,
  });
  const make = (projected: boolean) => {
    const header = node('chat-app-side-nav-menu-button');
    const glow = node('new-model-picker-glow.header-model-picker-glow', header);
    const content = node('div.glow-content', glow);
    const owner = node(
      'bard-mode-switcher[data-test-id="bard-mode-switcher"]',
      projected ? content : header,
    );
    const f: any = { header, glow, content, owner, textReads: 0, resolves: 0 };
    const option: any = {
      getAttribute: () => 'synthetic-current-mode',
      classList: { contains: () => true },
      closest: () => menu,
      querySelectorAll: () => [{ innerText: 'Automatic fixture', closest: () => option }],
      innerText: 'Automatic fixture',
    };
    const menu = { closest: () => owner, querySelectorAll: () => [option] };
    const popover = { closest: () => owner, querySelectorAll: () => [menu] };
    owner.querySelectorAll = () => (opened === f ? [popover] : []);
    const host: any = Object.assign(node('gem-button', owner), {
      tagName: 'GEM-BUTTON',
      innerText: 'Gemini fixture',
      getAttribute: () => null,
      closest: () => owner,
      querySelectorAll: () => {
        f.resolves++;
        return [button];
      },
    });
    const button: any = Object.assign(node('button', host), {
      tagName: 'BUTTON',
      getAttribute: () => null,
      hasAttribute: () => false,
      closest: (selector: string) => (selector.startsWith('gem-button') ? host : owner),
      click: vi.fn(() => {
        opened = f;
      }),
      dispatchEvent: vi.fn(() => {
        opened = undefined;
      }),
    });
    Object.defineProperty(button, 'innerText', {
      get: () => {
        f.textReads++;
        return 'Gemini fixture';
      },
    });
    return Object.assign(f, { host, button, menu, option });
  };
  current = make(false);
  const provisional = current;
  vi.stubGlobal('document', doc);
  vi.stubGlobal('location', { href: 'https://gemini.google.com/app' });
  vi.stubGlobal('KeyboardEvent', Event);
  return {
    doc,
    provisional,
    current: () => current,
    opened: () => opened,
    replace(projected = true) {
      for (const member of ['header', 'glow', 'content', 'owner', 'host', 'button'])
        current[member].isConnected = false;
      current = make(projected);
      return current;
    },
    duplicate: () => {
      duplicate = true;
    },
    disappear: () => {
      absent = true;
    },
  };
}

it('waits past 160ms for the whole cold header projection before capture and one opening', async () => {
  vi.useFakeTimers();
  const f = headerProjection();
  setTimeout(() => f.replace(), 240);
  // The provisional menu intentionally has no options and disappears with its owner.
  f.provisional.owner.querySelectorAll = () => [];
  const pending = readGeminiMode(undefined, true).catch((error: unknown) => error);
  await vi.advanceTimersByTimeAsync(239);
  expect(f.provisional.button.click).not.toHaveBeenCalled();
  expect(f.provisional.textReads).toBe(f.provisional.resolves);
  await vi.advanceTimersByTimeAsync(81);
  expect(await pending).toEqual({ label: 'Automatic fixture', modeId: 'synthetic-current-mode' });
  expect(f.current().button.click).toHaveBeenCalledTimes(1);
  expect(f.current().button.dispatchEvent).toHaveBeenCalledTimes(1);
  expect(f.opened()).toBeUndefined();
});

it('accepts a current primary projection without a cosmetic glowing class', async () => {
  const f = headerProjection();
  f.replace();
  await expect(readGeminiMode(undefined, true)).resolves.toEqual({
    label: 'Automatic fixture',
    modeId: 'synthetic-current-mode',
  });
  expect(f.provisional.button.click).not.toHaveBeenCalled();
  expect(f.current().button.click).toHaveBeenCalledTimes(1);
  expect(f.opened()).toBeUndefined();
});

it.each([
  'bare',
  'foreign-glow',
  'missing-content',
  'nested-content',
  'foreign-document',
  'disconnected',
  'duplicate',
  'disappeared',
  'churn',
])(
  'refuses an unqualified %s header within the original absolute deadline without clicking',
  async (kind) => {
    vi.useFakeTimers();
    const f = headerProjection();
    const current = f.replace();
    if (kind === 'bare') current.owner.parentElement = current.header;
    if (kind === 'foreign-glow') current.glow.parentElement = current.content;
    if (kind === 'missing-content') current.owner.parentElement = current.glow;
    if (kind === 'nested-content') current.content.parentElement = current.header;
    if (kind === 'foreign-document') current.glow.ownerDocument = {};
    if (kind === 'disconnected') current.glow.isConnected = false;
    if (kind === 'duplicate') f.duplicate();
    if (kind === 'disappeared') f.disappear();
    if (kind === 'churn') {
      current.owner.parentElement = current.header;
      setInterval(() => f.replace(false), 160);
    }
    const pending = readGeminiMode(undefined, true).catch((error: unknown) => error);
    await vi.advanceTimersByTimeAsync(2560);
    expect(await pending).toMatchObject({ cause: 'model-trigger' });
    expect(current.button.click).not.toHaveBeenCalled();
    expect(f.current().button.click).not.toHaveBeenCalled();
    expect(current.button.dispatchEvent).not.toHaveBeenCalled();
  },
);

it.each(['abort', 'page', 'document', 'expired'])(
  'does not admit a header after %s changes during the readiness wait',
  async (kind) => {
    vi.useFakeTimers();
    const f = headerProjection();
    const controller = new AbortController();
    setTimeout(() => {
      f.replace();
      if (kind === 'abort') controller.abort();
      if (kind === 'page') location.href += '?changed';
      if (kind === 'document') vi.stubGlobal('document', { ...f.doc });
      if (kind === 'expired') vi.setSystemTime(Date.now() + 3000);
    }, 40);
    const pending = readGeminiMode(controller.signal, true).catch((error: unknown) => error);
    await vi.advanceTimersByTimeAsync(2560);
    expect(await pending).toMatchObject(
      kind === 'abort' ? { name: 'AbortError' } : { cause: 'model-trigger' },
    );
    expect(f.provisional.button.click).not.toHaveBeenCalled();
    expect(f.current().button.click).not.toHaveBeenCalled();
  },
);

it.each([
  'bare',
  'foreign',
  'incomplete',
  'absent',
  'ambiguous',
  'compact',
  'compact-expired',
  'abort',
  'page',
  'document',
  'expired',
  'valid',
])('revalidates a %s replacement in the final helper-return await gap', async (kind) => {
  const f = headerProjection();
  const old = f.replace();
  const controller = new AbortController();
  const query = f.doc.querySelectorAll;
  let queued = false;
  f.doc.querySelectorAll = (selector: string) => {
    if (!queued) {
      queued = true;
      queueMicrotask(() => {
        const fresh = f.replace(kind !== 'bare');
        if (kind === 'foreign') fresh.glow.ownerDocument = {};
        if (kind === 'absent') f.disappear();
        if (kind === 'ambiguous') f.duplicate();
        if (kind.startsWith('compact')) fresh.host.querySelectorAll = () => [];
        if (kind === 'incomplete') fresh.owner.parentElement = fresh.glow;
        if (kind === 'abort') controller.abort();
        if (kind === 'page') location.href += '?changed';
        if (kind === 'document') vi.stubGlobal('document', { ...f.doc });
        if (kind === 'expired' || kind === 'compact-expired') {
          vi.useFakeTimers();
          vi.setSystemTime(Date.now() + 3000);
        }
      });
    }
    return query(selector);
  };
  const result = await readGeminiMode(controller.signal, true).catch((error: unknown) => error);
  expect(old.button.click).not.toHaveBeenCalled();
  // Readiness's disabled check reads the label once; it was never captured for a catalog.
  expect(old.textReads).toBe(old.resolves);
  if (kind === 'valid') {
    expect(result).toEqual({ label: 'Automatic fixture', modeId: 'synthetic-current-mode' });
    expect(f.current().button.click).toHaveBeenCalledTimes(1);
  } else {
    expect(result).toMatchObject(
      kind === 'abort' ? { name: 'AbortError' } : { cause: 'model-trigger' },
    );
    expect(f.current().button.click).not.toHaveBeenCalled();
    expect(f.current().textReads).toBe(f.current().resolves);
    if (kind !== 'abort') {
      const expected = kind.startsWith('compact')
        ? 'compact-control'
        : ['absent', 'ambiguous'].includes(kind)
          ? 'final-control'
          : ['page', 'document'].includes(kind)
            ? 'header-context'
            : kind === 'expired'
              ? 'header-deadline'
              : 'header-association';
      expect(result).toHaveProperty('geminiTriggerDiagnostic', expected);
      expect(Object.getOwnPropertyDescriptor(result, 'geminiTriggerDiagnostic')).toMatchObject({
        value: expected,
        writable: false,
        configurable: false,
      });
    }
  }
});

it.each([0, 40])(
  'keeps M9 and never reopens after post-click owner replacement delayed %sms',
  async (delay) => {
    vi.useFakeTimers();
    const f = headerProjection();
    const captured = f.replace();
    captured.owner.querySelectorAll = () => [];
    captured.button.click.mockImplementation(() => {
      if (delay) setTimeout(() => f.replace(), delay);
      else f.replace();
    });
    const pending = readGeminiMode(undefined, true).catch((error: unknown) => error);
    await vi.advanceTimersByTimeAsync(160);
    expect(await pending).toMatchObject({
      cause: 'model-menu',
      geminiMenuDiagnostic: 'trigger-detached',
    });
    expect(captured.button.click).toHaveBeenCalledTimes(1);
    expect(f.current().button.click).not.toHaveBeenCalled();
    expect(f.opened()).toBeUndefined();
  },
);

it('does not resolve a trigger when the fixed-policy operation is already aborted', async () => {
  const f = headerProjection();
  const controller = new AbortController();
  controller.abort();
  await expect(readGeminiMode(controller.signal, true)).rejects.toMatchObject({
    name: 'AbortError',
  });
  expect(f.provisional.resolves).toBe(0);
  expect(f.provisional.button.click).not.toHaveBeenCalled();
});

it('checks cancellation immediately before the opening mutation without unrelated cleanup', async () => {
  const f = headerProjection();
  const current = f.replace();
  const controller = new AbortController();
  current.button.getAttribute = (key: string) => {
    if (key === 'aria-expanded') controller.abort();
    return null;
  };
  await expect(readGeminiMode(controller.signal, true)).rejects.toMatchObject({
    name: 'AbortError',
  });
  expect(current.button.click).not.toHaveBeenCalled();
  expect(current.button.dispatchEvent).not.toHaveBeenCalled();
});

it.each(['host', 'button'])(
  'keeps the exact compact %s enabled prerequisite under the fixed policy',
  async (member) => {
    const f = headerProjection();
    const current = f.replace();
    // Exercise the direct trigger resolver too; the policy must still prove its compact inner control.
    const query = f.doc.querySelectorAll;
    f.doc.querySelectorAll = (selector: string) =>
      selector === '[data-test-id="bard-mode-menu-button"]' ? [current.button] : query(selector);
    current[member].getAttribute = (key: string) => (key === 'aria-disabled' ? 'true' : null);
    await expect(readGeminiMode(undefined, true)).rejects.toMatchObject({
      cause: 'model-trigger',
      geminiTriggerDiagnostic: 'compact-control',
    });
    expect(current.button.click).not.toHaveBeenCalled();
  },
);

it.each(['open-trigger', 'open-menu'] as const)(
  'preserves %s refusal and avoids cleanup before a fixed-policy opening attempt',
  async (site) => {
    const f = headerProjection();
    const current = f.replace();
    if (site === 'open-trigger')
      current.button.getAttribute = (key: string) => (key === 'aria-expanded' ? 'true' : null);
    else {
      const query = f.doc.querySelectorAll;
      f.doc.querySelectorAll = (selector: string) =>
        selector === '[role="menu"], [role="listbox"]' ? [{}] : query(selector);
    }
    await expect(readGeminiMode(undefined, true)).rejects.toMatchObject({
      cause: 'model-menu',
      geminiMenuDiagnostic: site,
    });
    expect(current.button.click).not.toHaveBeenCalled();
    expect(current.button.dispatchEvent).not.toHaveBeenCalled();
  },
);

it('refuses multiple compact inner controls under the fixed policy', async () => {
  const f = headerProjection();
  const current = f.replace();
  current.host.querySelectorAll = () => [current.button, current.button];
  const failure = await readGeminiMode(undefined, true).catch((error) => error);
  expect(failure).toMatchObject({
    cause: 'model-trigger',
    message: 'Gemini 모델 선택 버튼을 확인하지 못했습니다.',
  });
  expect(current.button.click).not.toHaveBeenCalled();
  expect(current.textReads).toBe(0);
  expect(failure).toHaveProperty('geminiTriggerDiagnostic', 'compact-control');
});

it('reports only the final deadline refusal for a current bare compact owner', async () => {
  vi.useFakeTimers();
  const f = headerProjection();
  const current = f.provisional;
  const pending = readGeminiMode(undefined, true).catch((error: unknown) => error);
  await vi.advanceTimersByTimeAsync(2560);
  const failure = await pending;
  expect(failure).toMatchObject({
    cause: 'model-trigger',
    message: 'Gemini 모델 선택 버튼을 확인하지 못했습니다.',
  });
  expect(current.button.click).not.toHaveBeenCalled();
  expect(current.textReads).toBe(current.resolves);
  expect(failure).toHaveProperty('geminiTriggerDiagnostic', 'header-deadline');
});

it.each(['mode', 'catalog'] as const)(
  'keeps ordinary %s compact errors generic',
  async (caller) => {
    const f = headerProjection();
    f.provisional.host.querySelectorAll = () => [];
    const failure = await (caller === 'mode' ? readGeminiMode() : modelMenu('gemini')).catch(
      (error) => error,
    );
    expect(failure).toMatchObject({ cause: 'model-trigger' });
    expect(Object.hasOwn(failure, 'geminiTriggerDiagnostic')).toBe(false);
    expect(f.provisional.button.click).not.toHaveBeenCalled();
  },
);

it('preserves the original final trigger read sequences', async () => {
  const traces: Record<string, string[]> = {};
  for (const kind of [
    'cardinality',
    'host-disabled',
    'button-disabled',
    'document',
    'url',
    'expired',
    'absent',
    'association',
    'valid',
    'throw-disabled',
    'throw-closest',
  ]) {
    const f = headerProjection();
    const current = f.replace();
    const controller = new AbortController();
    const trace: string[] = [];
    let final = false,
      href = 'https://gemini.google.com/app';
    const record = (event: string) => {
      if (final) trace.push(event);
    };
    const unexpected = new Error('Synthetic throwing prerequisite');
    let doc = f.doc;
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      get: () => {
        record('document');
        return doc;
      },
    });
    Object.defineProperty(location, 'href', {
      configurable: true,
      get: () => {
        record('url');
        return href;
      },
    });
    const now = vi.spyOn(Date, 'now').mockImplementation(() => {
      record('clock');
      return final && kind === 'expired' ? 3000 : 0;
    });
    const abort = controller.signal.throwIfAborted.bind(controller.signal);
    vi.spyOn(controller.signal, 'throwIfAborted').mockImplementation(() => {
      record('abort');
      abort();
    });
    for (const name of ['button', 'host', 'owner', 'content', 'glow', 'header']) {
      const node = current[name];
      for (const key of ['parentElement', 'isConnected', 'ownerDocument']) {
        const value = node[key];
        Object.defineProperty(node, key, {
          configurable: true,
          get: () => {
            record(`${name}.${key}`);
            return value;
          },
        });
      }
      if (node.matches) {
        const matches = node.matches;
        node.matches = (selector: string) => {
          record(`${name}.matches`);
          return matches(selector);
        };
      }
      if (node.closest) {
        const closest = node.closest;
        node.closest = (selector: string) => {
          record(`${name}.closest:${selector}`);
          if (final && kind === 'throw-closest' && name === 'button') throw unexpected;
          return closest(selector);
        };
      }
      if (node.getAttribute) {
        const get = node.getAttribute;
        node.getAttribute = (key: string) => {
          record(`${name}.attribute:${key}`);
          if (final && key === 'aria-disabled') {
            if (kind === 'throw-disabled' && name === 'host') throw unexpected;
            if (kind === `${name}-disabled`) return 'true';
          }
          return get(key);
        };
        Object.defineProperty(node, 'disabled', {
          configurable: true,
          get: () => {
            record(`${name}.disabled`);
            return false;
          },
        });
        const text = Object.getOwnPropertyDescriptor(node, 'innerText');
        if (text?.configurable !== false)
          Object.defineProperty(node, 'innerText', {
            configurable: true,
            get: () => {
              record(`${name}.text`);
              return text?.get ? text.get() : text?.value;
            },
          });
      }
    }
    const inner = current.host.querySelectorAll;
    current.host.querySelectorAll = () => {
      record('host.query');
      return final && kind === 'cardinality' ? [] : inner();
    };
    const query = f.doc.querySelectorAll;
    let queued = false;
    f.doc.querySelectorAll = (selector: string) => {
      record(`query:${selector}`);
      if (!queued) {
        queued = true;
        queueMicrotask(() => {
          final = true;
          if (kind === 'document') doc = { ...f.doc };
          if (kind === 'url') href += '?changed';
          if (kind === 'absent') f.disappear();
          if (kind === 'association')
            Object.defineProperty(current.owner, 'parentElement', {
              get: () => {
                record('owner.parentElement');
                return current.header;
              },
            });
        });
      }
      return query(selector);
    };
    const failure = await readGeminiMode(controller.signal, true).catch((error) => error);
    now.mockRestore();
    if (kind.startsWith('throw-')) {
      expect(failure).toBe(unexpected);
      expect(Object.hasOwn(failure, 'geminiTriggerDiagnostic')).toBe(false);
    } else if (kind === 'valid')
      expect(failure).toEqual({ label: 'Automatic fixture', modeId: 'synthetic-current-mode' });
    else expect(failure).toHaveProperty('cause', 'model-trigger');
    if (kind !== 'valid') expect(current.button.click).not.toHaveBeenCalled();
    if (['document', 'url', 'absent'].includes(kind)) expect(trace).not.toContain('clock');
    if (['document', 'url', 'expired', 'absent'].includes(kind))
      expect(trace).not.toContain('owner.parentElement');
    if (kind === 'document') expect(trace).not.toContain('url');
    if (kind === 'cardinality') expect(trace).not.toContain('host.attribute:aria-disabled');
    if (kind === 'host-disabled') expect(trace).not.toContain('button.attribute:aria-disabled');
    if (kind === 'valid') expect(trace.filter((value) => value === 'host.query')).toHaveLength(3);
    traces[kind] = trace;
  }
  expect(traces).toMatchInlineSnapshot(`
    {
      "absent": [
        "abort",
        "document",
        "query:[data-test-id="bard-mode-menu-button"]",
        "document",
        "query:[data-test-id="model-selector-menu-button"]",
        "document",
        "query:button.model-switcher-button",
        "document",
        "query:button[aria-haspopup="menu"], button[aria-haspopup="listbox"]",
      ],
      "association": [
        "abort",
        "document",
        "query:[data-test-id="bard-mode-menu-button"]",
        "host.query",
        "button.closest:gem-button",
        "host.attribute:aria-disabled",
        "host.disabled",
        "host.text",
        "button.attribute:aria-disabled",
        "button.disabled",
        "abort",
        "document",
        "url",
        "clock",
        "button.closest:gem-button[data-test-id="bard-mode-menu-button"]",
        "host.closest:bard-mode-switcher[data-test-id="bard-mode-switcher"]",
        "owner.parentElement",
        "header.parentElement",
      ],
      "button-disabled": [
        "abort",
        "document",
        "query:[data-test-id="bard-mode-menu-button"]",
        "host.query",
        "button.closest:gem-button",
        "host.attribute:aria-disabled",
        "host.disabled",
        "host.text",
        "button.attribute:aria-disabled",
      ],
      "cardinality": [
        "abort",
        "document",
        "query:[data-test-id="bard-mode-menu-button"]",
        "host.query",
      ],
      "document": [
        "abort",
        "document",
        "query:[data-test-id="bard-mode-menu-button"]",
        "host.query",
        "button.closest:gem-button",
        "host.attribute:aria-disabled",
        "host.disabled",
        "host.text",
        "button.attribute:aria-disabled",
        "button.disabled",
        "abort",
        "document",
      ],
      "expired": [
        "abort",
        "document",
        "query:[data-test-id="bard-mode-menu-button"]",
        "host.query",
        "button.closest:gem-button",
        "host.attribute:aria-disabled",
        "host.disabled",
        "host.text",
        "button.attribute:aria-disabled",
        "button.disabled",
        "abort",
        "document",
        "url",
        "clock",
      ],
      "host-disabled": [
        "abort",
        "document",
        "query:[data-test-id="bard-mode-menu-button"]",
        "host.query",
        "button.closest:gem-button",
        "host.attribute:aria-disabled",
      ],
      "throw-closest": [
        "abort",
        "document",
        "query:[data-test-id="bard-mode-menu-button"]",
        "host.query",
        "button.closest:gem-button",
      ],
      "throw-disabled": [
        "abort",
        "document",
        "query:[data-test-id="bard-mode-menu-button"]",
        "host.query",
        "button.closest:gem-button",
        "host.attribute:aria-disabled",
      ],
      "url": [
        "abort",
        "document",
        "query:[data-test-id="bard-mode-menu-button"]",
        "host.query",
        "button.closest:gem-button",
        "host.attribute:aria-disabled",
        "host.disabled",
        "host.text",
        "button.attribute:aria-disabled",
        "button.disabled",
        "abort",
        "document",
        "url",
      ],
      "valid": [
        "abort",
        "document",
        "query:[data-test-id="bard-mode-menu-button"]",
        "host.query",
        "button.closest:gem-button",
        "host.attribute:aria-disabled",
        "host.disabled",
        "host.text",
        "button.attribute:aria-disabled",
        "button.disabled",
        "abort",
        "document",
        "url",
        "clock",
        "button.closest:gem-button[data-test-id="bard-mode-menu-button"]",
        "host.closest:bard-mode-switcher[data-test-id="bard-mode-switcher"]",
        "owner.parentElement",
        "content.parentElement",
        "glow.parentElement",
        "button.isConnected",
        "button.ownerDocument",
        "host.isConnected",
        "host.ownerDocument",
        "owner.isConnected",
        "owner.ownerDocument",
        "content.isConnected",
        "content.ownerDocument",
        "glow.isConnected",
        "glow.ownerDocument",
        "header.isConnected",
        "header.ownerDocument",
        "button.closest:bard-mode-switcher",
        "content.matches",
        "glow.matches",
        "header.matches",
        "host.query",
        "button.closest:gem-button",
        "host.attribute:aria-disabled",
        "host.disabled",
        "host.text",
        "button.attribute:aria-disabled",
        "button.disabled",
        "button.attribute:aria-expanded",
        "document",
        "query:[role="menu"], [role="listbox"]",
        "button.closest:gem-button[data-test-id="bard-mode-menu-button"]",
        "host.closest:bard-mode-switcher[data-test-id="bard-mode-switcher"]",
        "abort",
        "clock",
        "clock",
        "button.isConnected",
        "button.closest:bard-mode-switcher",
        "document",
        "query:[role="menuitemradio"], [role="option"], [role="menuitem"]",
        "document",
        "clock",
        "clock",
        "document",
        "query:[role="menuitemradio"], [role="option"], [role="menuitem"]",
        "document",
        "query:[data-test-id="bard-mode-menu-button"]",
        "host.query",
        "button.closest:gem-button",
        "host.attribute:aria-disabled",
        "host.disabled",
        "host.text",
        "button.attribute:aria-disabled",
        "button.disabled",
        "button.attribute:aria-expanded",
      ],
    }
  `);
});

it('preserves an unexpected visibility exception without a terminal annotation', async () => {
  const f = headerProjection();
  const original = new Error('Synthetic visibility exception');
  vi.mocked(visible).mockImplementationOnce(() => {
    throw original;
  });
  const failure = await readGeminiMode(undefined, true).catch((error) => error);
  expect(failure).toBe(original);
  expect(Object.hasOwn(failure, 'geminiTriggerDiagnostic')).toBe(false);
  expect(f.provisional.button.click).not.toHaveBeenCalled();
});

it('keeps the ordinary Claude disabled-control refusal generic', async () => {
  const button = menuFailure('open-trigger');
  button.getAttribute = (key) => (key === 'aria-disabled' ? 'true' : null);
  const failure = await readClaudeProbeLabel().catch((error) => error);
  expect(failure).toMatchObject({ cause: 'model-trigger' });
  expect(Object.hasOwn(failure, 'geminiTriggerDiagnostic')).toBe(false);
  expect(button.click).not.toHaveBeenCalled();
});

it('inspects the current exact header without opening or exporting controls', () => {
  const f = headerProjection();
  expect(inspectGeminiHeader()).toBe(false);
  const current = f.replace();
  expect(inspectGeminiHeader()).toBe(true);
  expect(current.button.click).not.toHaveBeenCalled();
  expect(current.button.dispatchEvent).not.toHaveBeenCalled();
  f.provisional.host.querySelectorAll = () => {
    throw Error('stale host read');
  };
  expect(inspectGeminiHeader()).toBe(true);
  current.host.querySelectorAll = () => [];
  expect(inspectGeminiHeader()).toBe(false);
  current.host.querySelectorAll = () => {
    throw Error('unexpected DOM read');
  };
  expect(() => inspectGeminiHeader()).toThrow('unexpected DOM read');
});
