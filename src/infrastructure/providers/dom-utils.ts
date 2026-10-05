/** A display:contents message has no box of its own, but its text is still rendered. */
export function visible(element: Element): element is HTMLElement {
  if (
    !(element instanceof HTMLElement) ||
    element.closest('[hidden], [inert], [aria-hidden="true"]')
  )
    return false;
  const style = getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse')
    return false;
  if ([...element.getClientRects()].some((rect) => rect.width > 0 && rect.height > 0)) return true;
  if (style.display !== 'contents') return false;
  const range = document.createRange();
  range.selectNodeContents(element);
  return [...range.getClientRects()].some((rect) => rect.width > 0 && rect.height > 0);
}

export function outermost(elements: HTMLElement[]) {
  return elements.filter(
    (element, i) =>
      elements.indexOf(element) === i &&
      !elements.some((other) => other !== element && other.contains(element)),
  );
}

/** Visual order handles timelines whose flex/virtual list reverses DOM order. */
export function messageOrder(a: HTMLElement, b: HTMLElement): number {
  const box = (el: HTMLElement) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return range.getBoundingClientRect();
  };
  const delta = box(a).top - box(b).top;
  return delta || (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
}

export function textOf(element?: HTMLElement | null): string {
  if (!element) return '';
  // Turn-level fallbacks can contain copy/read-aloud controls and screen-reader labels.
  const controls =
    'button, [role="toolbar"], .turn-action-controls, .sr-only, [aria-hidden="true"], [hidden]';
  if (!element.querySelector(controls)) return element.innerText?.trim() ?? '';
  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(controls).forEach((node) => node.remove());
  clone.querySelectorAll('br').forEach((node) => node.replaceWith('\n'));
  clone
    .querySelectorAll('p, div, li, pre, blockquote, h1, h2, h3, h4')
    .forEach((node) => node.append('\n'));
  return clone.textContent?.trim() ?? '';
}

const transientKeys = new WeakMap<HTMLElement, string>();
/** Stable server message markers survive virtualization/remounts; values never enter diagnostics. */
export function messageKey(element: HTMLElement): string {
  for (const attr of ['data-message-id', 'data-chatgpt-search-message-ids', 'data-turn-key']) {
    const value = element.closest(`[${attr}]`)?.getAttribute(attr);
    if (value) return `${attr}:${value}`;
  }
  let key = transientKeys.get(element);
  if (!key) {
    key = crypto.randomUUID();
    transientKeys.set(element, key);
  }
  return key;
}
