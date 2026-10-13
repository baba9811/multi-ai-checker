import type { ProviderId } from '../../domains/providers/model';
import type { ModelCatalog } from '../../application/provider-protocol';
import { visible } from './dom-utils';

const triggers: Record<ProviderId, string[]> = {
  chatgpt: [
    '[data-testid="model-switcher-dropdown-button"]',
    '[data-testid="model-selector"]',
    'button[aria-haspopup="menu"][aria-label*="ChatGPT"]',
  ],
  claude: [
    '[data-testid="model-selector-dropdown"]',
    '[data-testid="model-selector-dropdown-button"]',
    'button[aria-label="Choose model"]',
  ],
  gemini: [
    '[data-test-id="bard-mode-menu-button"]',
    '[data-test-id="model-selector-menu-button"]',
    'button.model-switcher-button',
  ],
};
const families: Record<ProviderId, RegExp> = {
  chatgpt:
    /(?:ChatGPT|GPT[-\s]?\d|o[134](?:\b|-)|^(?:Auto|Instant|Thinking|Pro|자동|빠른 응답|생각하기)$)/i,
  claude: /(?:Claude|Sonnet|Opus|Haiku)/i,
  gemini: /(?:Gemini|Flash|Pro|Thinking|빠른|사고|생각|Fast)/i,
};
function triggerControl(provider: ProviderId, element: HTMLElement): HTMLElement {
  if (provider !== 'gemini' || element.tagName !== 'GEM-BUTTON') return element;
  const buttons = [...element.querySelectorAll('button')].filter(
    (button) => visible(button) && button.closest('gem-button') === element,
  );
  if (buttons.length !== 1 || disabled(element) || disabled(buttons[0]!))
    throw new Error('Gemini 모델 선택 버튼을 확인하지 못했습니다.', { cause: 'model-trigger' });
  return buttons[0]!;
}
function trigger(provider: ProviderId): HTMLElement | undefined {
  for (const selector of triggers[provider]) {
    const found = [...document.querySelectorAll(selector)].filter(visible);
    if (found.length === 1) return triggerControl(provider, found[0]!);
    if (found.length > 1) return;
  }
  const found = [
    ...document.querySelectorAll('button[aria-haspopup="menu"], button[aria-haspopup="listbox"]'),
  ]
    .filter(visible)
    .filter(
      (el) =>
        !el.closest('nav, aside, [data-turn-key], [data-message-author-role]') &&
        families[provider].test(el.innerText.trim()),
    );
  return found.length === 1 ? triggerControl(provider, found[0]!) : undefined;
}
const optionSelector = '[role="menuitemradio"], [role="option"], [role="menuitem"]';
const geminiModeSelector = 'gem-menu-item[role="menuitem"][data-mode-id]';
type GeminiMode = { label: string; modeId: string };
function label(element: HTMLElement) {
  return (
    (
      element.querySelector<HTMLElement>('[data-testid="model-name"]')?.innerText ??
      element.innerText
    ).split('\n')[0] ?? ''
  )
    .trim()
    .slice(0, 160);
}
function disabled(element: HTMLElement) {
  return (
    element.getAttribute('aria-disabled') === 'true' ||
    (element as HTMLButtonElement).disabled === true ||
    /upgrade|구독|업그레이드|한도 도달|limit reached/i.test(element.innerText)
  );
}
function selectedModel(options: HTMLElement[]): HTMLElement | undefined {
  const marked = options.filter(
    (option) => option.hasAttribute('aria-checked') || option.hasAttribute('aria-selected'),
  );
  if (!marked.length) return;
  const selected = marked.filter(
    (option) =>
      option.getAttribute('aria-checked') === 'true' ||
      option.getAttribute('aria-selected') === 'true',
  );
  if (selected.length !== 1 || disabled(selected[0]!))
    throw new Error('현재 선택된 모델을 확인하지 못했습니다. 사이트에서 확인하세요.', {
      cause: 'model-selection',
    });
  return selected[0];
}
function geminiLabel(element: HTMLElement): string {
  const names = [
    ...element.querySelectorAll<HTMLElement>('gem-menu-item-content .label-container > .label'),
  ].filter((name) => visible(name) && name.closest('gem-menu-item') === element);
  const name = names.length === 1 ? names[0]!.innerText.trim() : '';
  if (!name || name.length > 160)
    throw new Error('Gemini 모델 이름을 확인하지 못했습니다.', { cause: 'model-selection' });
  return name;
}
function geminiModeId(element: HTMLElement): string {
  const modeId = element.getAttribute('data-mode-id') ?? '';
  if (!modeId || modeId.length > 160 || /\s/.test(modeId))
    throw new Error('Gemini 모델 정보를 확인하지 못했습니다.', { cause: 'model-selection' });
  return modeId;
}
function selectedGeminiMode(options: HTMLElement[]): HTMLElement {
  const ids = options.map(geminiModeId);
  const names = options.map(geminiLabel);
  const selected = options.filter((option) => option.classList.contains('selected'));
  if (
    new Set(ids).size !== ids.length ||
    new Set(names).size !== names.length ||
    selected.length !== 1 ||
    disabled(selected[0]!)
  )
    throw new Error('현재 선택된 Gemini 모델을 확인하지 못했습니다.', {
      cause: 'model-selection',
    });
  return selected[0]!;
}
async function readyTrigger(provider: ProviderId) {
  let button = trigger(provider);
  const deadline = Date.now() + 2500;
  while (!button && provider === 'claude' && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    button = trigger(provider);
  }
  return button;
}
/** Opens only the model picker. No credentials, private APIs, or subscriptions are touched. */
export async function modelMenu(provider: ProviderId, selectKey?: string): Promise<ModelCatalog> {
  return (await readModelMenu(provider, selectKey)).catalog;
}
/** The mode key stays in the provider page; public model catalogs contain visible labels only. */
export async function readGeminiMode(): Promise<GeminiMode> {
  const result = await readModelMenu('gemini', undefined, true);
  if (!result.geminiMode)
    throw new Error('현재 선택된 Gemini 모델을 확인하지 못했습니다.', {
      cause: 'model-selection',
    });
  return result.geminiMode;
}
async function readModelMenu(
  provider: ProviderId,
  selectKey?: string,
  requireGeminiMode = false,
): Promise<{ catalog: ModelCatalog; geminiMode?: GeminiMode }> {
  const button = await readyTrigger(provider);
  if (!button)
    return {
      catalog: {
        options: [],
        message: '모델 메뉴를 찾지 못했습니다. 웹에서 선택한 모델을 사용합니다.',
      },
    };
  const current = button.innerText.trim().slice(0, 160) || undefined;
  if (button.getAttribute('aria-expanded') === 'true')
    throw new Error('열린 모델 메뉴를 먼저 닫아주세요.', { cause: 'model-menu' });
  if ([...document.querySelectorAll('[role="menu"], [role="listbox"]')].some(visible))
    throw new Error('사이트의 열린 메뉴를 먼저 닫아주세요.', { cause: 'model-menu' });
  const geminiHost =
    provider === 'gemini'
      ? button.closest('gem-button[data-test-id="bard-mode-menu-button"]')
      : null;
  const localOwner = geminiHost?.closest('bard-mode-switcher[data-test-id="bard-mode-switcher"]');
  if (geminiHost && !localOwner)
    throw new Error('Gemini 모델 메뉴의 연결을 확인하지 못했습니다.', { cause: 'model-menu' });
  const localPopovers = () =>
    localOwner
      ? [
          ...localOwner.querySelectorAll<HTMLElement>('div[data-test-id="bard-mode-popover-menu"]'),
        ].filter(
          (popover) => visible(popover) && popover.closest('bard-mode-switcher') === localOwner,
        )
      : [];
  let currentGemini =
    provider === 'gemini' &&
    (requireGeminiMode || button.hasAttribute('aria-controls') || !!localOwner);
  const readOptions = () => {
    if (provider === 'gemini') {
      currentGemini ||=
        button.hasAttribute('aria-controls') ||
        [...document.querySelectorAll(geminiModeSelector)].some(visible);
      if (currentGemini) {
        if (localOwner && !button.hasAttribute('aria-controls')) {
          if (!button.isConnected || button.closest('bard-mode-switcher') !== localOwner)
            throw new Error('Gemini 모델 메뉴의 연결이 변경되었습니다.', { cause: 'model-menu' });
          const popovers = localPopovers();
          if (popovers.length > 1)
            throw new Error('Gemini 모델 메뉴의 연결이 모호합니다.', { cause: 'model-menu' });
          const popover = popovers[0];
          const menus = popover
            ? [
                ...popover.querySelectorAll<HTMLElement>(
                  'gem-menu[role="menu"][data-test-id="gem-mode-menu"]',
                ),
              ].filter((menu) => visible(menu) && menu.closest('bard-mode-switcher') === localOwner)
            : [];
          if (menus.length > 1)
            throw new Error('Gemini 모델 메뉴의 연결이 모호합니다.', { cause: 'model-menu' });
          const menu = menus[0];
          return menu
            ? [...menu.querySelectorAll<HTMLElement>(geminiModeSelector)].filter(
                (option) => visible(option) && option.closest('gem-menu') === menu,
              )
            : [];
        }
        const ownerId = button.getAttribute('aria-controls') ?? '';
        if (!ownerId || /\s/.test(ownerId))
          throw new Error('Gemini 모델 메뉴의 연결을 확인하지 못했습니다.', {
            cause: 'model-menu',
          });
        const owners = [...document.querySelectorAll<HTMLElement>('[id]')].filter(
          (owner) => owner.id === ownerId,
        );
        if (owners.length > 1)
          throw new Error('Gemini 모델 메뉴의 연결이 모호합니다.', { cause: 'model-menu' });
        const owner = owners[0];
        return owner && visible(owner)
          ? [...owner.querySelectorAll(geminiModeSelector)].filter(visible)
          : [];
      }
    }
    return [...document.querySelectorAll(optionSelector)]
      .filter(visible)
      .filter((el) => families[provider].test(label(el)));
  };
  const readLabel = (element: HTMLElement) =>
    currentGemini ? geminiLabel(element) : label(element);
  const readSelected = (options: HTMLElement[]) =>
    currentGemini ? selectedGeminiMode(options) : selectedModel(options);
  let options: HTMLElement[] = [];
  try {
    button.click();
    const deadline = Date.now() + 1500;
    while (Date.now() < deadline) {
      options = readOptions();
      if (options.length) break;
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    const selected = readSelected(options);
    const values = options
      .slice(0, 40)
      .map((el) => ({ key: readLabel(el), label: readLabel(el), disabled: disabled(el) }));
    if (selectKey !== undefined) {
      const matches = options.filter((el) => readLabel(el) === selectKey);
      if (matches.length !== 1 || disabled(matches[0]!))
        throw new Error('현재 선택할 수 없는 모델입니다. 목록을 새로 불러오세요.');
      matches[0]!.click();
      let reopened = false;
      const end = Date.now() + 1500;
      const expected = selectKey.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
      while (Date.now() < end) {
        if (selected !== undefined && !reopened && !readOptions().length) {
          const current = trigger(provider);
          if (current) current.click();
          reopened = true;
        }
        const confirmationOptions = readOptions();
        const confirmed = confirmationOptions.length
          ? readSelected(confirmationOptions)
          : undefined;
        if (confirmed !== undefined) {
          if (readLabel(confirmed) === selectKey)
            return { catalog: { current: readLabel(confirmed), options: values } };
        }
        const actual = trigger(provider)?.innerText.trim().slice(0, 160);
        const value = actual?.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
        if (
          selected === undefined &&
          confirmed === undefined &&
          (value === expected || value?.endsWith(` ${expected}`))
        )
          return { catalog: { current: actual, options: values } };
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
      throw new Error('모델 변경을 확인하지 못했습니다. 사이트에서 확인하세요.');
    }
    // Capture primitives before finally closes and potentially unmounts the menu.
    return {
      catalog: {
        current: selected ? readLabel(selected) : current,
        options: values,
        message: values.length
          ? undefined
          : '선택 가능한 모델을 읽지 못했습니다. 웹에서 설정해주세요.',
      },
      geminiMode:
        currentGemini && selected
          ? { label: geminiLabel(selected), modeId: geminiModeId(selected) }
          : undefined,
    };
  } finally {
    // Close the picker we opened, without changing user text or clicking a backdrop.
    if (
      [...document.querySelectorAll(optionSelector)].some(visible) ||
      trigger(provider)?.getAttribute('aria-expanded') === 'true' ||
      localPopovers().length
    ) {
      const target = document.activeElement ?? button;
      target.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }),
      );
      const waitForClosed = async () => {
        const deadline = Date.now() + 1500;
        while (Date.now() < deadline) {
          if (
            ![...document.querySelectorAll(optionSelector)].some(visible) &&
            trigger(provider)?.getAttribute('aria-expanded') !== 'true' &&
            !localPopovers().length
          )
            return true;
          await new Promise((resolve) => setTimeout(resolve, 80));
        }
        return false;
      };
      if (!(await waitForClosed())) {
        const current = trigger(provider);
        if (
          current?.getAttribute('aria-expanded') === 'true' ||
          (current === button && localPopovers().length)
        )
          current!.click();
        if (!(await waitForClosed()))
          throw new Error('모델 메뉴가 닫히지 않았습니다. 사이트에서 확인하세요.', {
            cause: 'model-menu',
          });
      }
    }
  }
}

/** The probe pairs this separate visible name with the account's exact selected model metadata. */
export async function readClaudeProbeLabel(): Promise<string> {
  const button = await readyTrigger('claude');
  if (!button || disabled(button))
    throw new Error('Claude 모델 선택 버튼을 확인하지 못했습니다.', { cause: 'model-trigger' });
  if (
    button.getAttribute('aria-expanded') !== 'false' ||
    [...document.querySelectorAll('[role="menu"], [role="listbox"]')].some(visible)
  )
    throw new Error('열린 메뉴를 먼저 닫아주세요.', { cause: 'model-menu' });
  const text = document.createTreeWalker(button, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = text.nextNode())) {
    const parent = node.parentElement;
    const value = node.textContent?.replace(/\s+/g, ' ').trim();
    if (!value || !parent || !visible(parent) || parent.closest('svg, .sr-only')) continue;
    if (value.length <= 160) return value;
    break;
  }
  throw new Error('Claude 모델 이름을 확인하지 못했습니다.', { cause: 'model' });
}
