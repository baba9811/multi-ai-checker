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
function trigger(provider: ProviderId): HTMLElement | undefined {
  for (const selector of triggers[provider]) {
    const found = [...document.querySelectorAll(selector)].filter(visible);
    if (found.length === 1) return found[0];
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
  return found.length === 1 ? found[0] : undefined;
}
const optionSelector = '[role="menuitemradio"], [role="option"], [role="menuitem"]';
function label(element: HTMLElement) {
  return (
    element.querySelector('[data-testid="model-name"]')?.textContent ??
    element.innerText.split('\n')[0] ??
    ''
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
/** Opens only the model picker. No credentials, private APIs, or subscriptions are touched. */
export async function modelMenu(provider: ProviderId, selectKey?: string): Promise<ModelCatalog> {
  const button = trigger(provider);
  if (!button)
    return {
      options: [],
      message: '모델 메뉴를 찾지 못했습니다. 웹에서 선택한 모델을 사용합니다.',
    };
  const current = button.innerText.trim().slice(0, 160) || undefined;
  if (button.getAttribute('aria-expanded') === 'true')
    throw new Error('열린 모델 메뉴를 먼저 닫아주세요.');
  if ([...document.querySelectorAll('[role="menu"], [role="listbox"]')].some(visible))
    throw new Error('사이트의 열린 메뉴를 먼저 닫아주세요.');
  button.click();
  let options: HTMLElement[] = [];
  try {
    const deadline = Date.now() + 1500;
    while (Date.now() < deadline) {
      options = [...document.querySelectorAll(optionSelector)]
        .filter(visible)
        .filter((el) => families[provider].test(label(el)));
      if (options.length) break;
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    const values = options
      .slice(0, 40)
      .map((el) => ({ key: label(el), label: label(el), disabled: disabled(el) }));
    if (selectKey !== undefined) {
      const matches = options.filter((el) => label(el) === selectKey);
      if (matches.length !== 1 || disabled(matches[0]!))
        throw new Error('현재 선택할 수 없는 모델입니다. 목록을 새로 불러오세요.');
      matches[0]!.click();
      const end = Date.now() + 1500;
      const expected = selectKey.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
      while (Date.now() < end) {
        const actual = trigger(provider)?.innerText.trim().slice(0, 160);
        const value = actual?.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
        if (value === expected || value?.endsWith(` ${expected}`))
          return { current: actual, options: values };
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
      throw new Error('모델 변경을 확인하지 못했습니다. 사이트에서 확인하세요.');
    }
    return {
      current,
      options: values,
      message: values.length
        ? undefined
        : '선택 가능한 모델을 읽지 못했습니다. 웹에서 설정해주세요.',
    };
  } finally {
    // Close the picker we opened, without changing user text or clicking a backdrop.
    if ([...document.querySelectorAll(optionSelector)].some(visible)) {
      const target = document.activeElement ?? button;
      target.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }),
      );
      if (button.getAttribute('aria-expanded') === 'true') button.click();
    }
  }
}
