import { outermost, visible, messageOrder } from './dom-utils';

// Legacy + September 2026 redesigned timeline. Evidence: docs/research/chatgpt-compatibility.md.
const thread = '[data-chatgpt-conversation-selection-target]';
const unit = '[data-chatgpt-search-message-ids]';
export const chatgptComposerSelectors = [
  '#prompt-textarea',
  '[data-testid="composer"] [contenteditable="true"]',
  '[data-type="unified-composer"] [contenteditable="true"]',
  '[data-composer] [contenteditable="true"]',
  'form [contenteditable="true"][role="textbox"]',
  'main [contenteditable="true"][role="textbox"]',
  '[data-lexical-editor="true"][contenteditable="true"]',
  '.ProseMirror[contenteditable="true"]',
  'form textarea',
  'main textarea[placeholder]',
] as const;
export const chatgptDoneSelectors = [
  'button[data-testid="copy-turn-action-button"]',
  'button[aria-label="Copy"]',
  'button[aria-label="Copy response"]',
  'button[aria-label="복사"]',
  'button[aria-label="응답 복사"]',
  'button[aria-label="답변 복사"]',
] as const;

export function chatgptComposerCandidates() {
  return [
    ...new Set(
      chatgptComposerSelectors.flatMap((selector) => [...document.querySelectorAll(selector)]),
    ),
  ]
    .filter(visible)
    .filter(
      (element) =>
        (element instanceof HTMLTextAreaElement || element.isContentEditable) &&
        !element.closest(
          '[role="dialog"], nav, aside, [data-turn-key], [data-message-author-role], [data-chatgpt-search-message-ids]',
        ),
    );
}
export function chatgptComposer() {
  const candidates = chatgptComposerCandidates();
  // Keep the actual editable, not a wrapper or nested contenteditable child.
  const inputs = outermost(candidates);
  return inputs.length === 1 ? inputs[0] : undefined;
}
export function chatgptMessages(role: 'user' | 'assistant') {
  const explicit = [
    ...document.querySelectorAll(
      `[data-message-author-role="${role}"], [data-turn="${role}"], [data-message-role="${role}"]`,
    ),
  ].filter(visible);
  const found: HTMLElement[] = explicit.map((element) => {
    const body = element.querySelector(
      role === 'user'
        ? '.whitespace-pre-wrap, .bg-user-message'
        : '.markdown, .markdown-render-styling',
    );
    return body && visible(body) ? body : element;
  });
  for (const container of document.querySelectorAll(`${thread} ${unit}`)) {
    if (
      !visible(container) ||
      explicit.some((element) => element.contains(container) || container.contains(element))
    )
      continue;
    const bubbles = [...container.querySelectorAll('.bg-user-message')].filter(visible);
    if (container.matches('.bg-user-message')) bubbles.unshift(container);
    if (role === 'user') {
      found.push(...bubbles);
      continue;
    }
    const bodies = [
      ...container.querySelectorAll('.markdown, .markdown-render-styling, [data-markdown]'),
    ]
      .filter(visible)
      .filter((element) => !element.closest('.bg-user-message'));
    if (bodies.length) {
      found.push(...bodies);
      continue;
    }
    // Never infer an assistant merely from "not a user" (tool/status/search rows exist).
    const turn = container.closest('[data-turn-key]') ?? container;
    if (
      !bubbles.length &&
      chatgptDoneSelectors.some((selector) => [...turn.querySelectorAll(selector)].some(visible))
    )
      found.push(container);
  }
  return outermost(found).sort(messageOrder);
}
export function chatgptLayout(): 'legacy' | 'redesigned' | 'unknown' {
  if (document.querySelector(thread)) return 'redesigned';
  if (
    document.querySelector(
      '#prompt-textarea, [data-message-author-role], [data-testid^="conversation-turn"]',
    )
  )
    return 'legacy';
  return 'unknown';
}
export function chatgptMessageUnits() {
  return document.querySelectorAll(`${thread} ${unit}`).length;
}
