import { LIMITS } from '../../domains/crosscheck/model';
import { providers, type ProviderId } from '../../domains/providers/model';
import type { Snapshot } from '../../application/provider-protocol';
import { visible, textOf, outermost, messageOrder } from './dom-utils';
import {
  chatgptComposer,
  chatgptComposerCandidates,
  chatgptComposerSelectors,
  chatgptDoneSelectors,
  chatgptMessages,
  chatgptLayout,
  chatgptMessageUnits,
} from './chatgpt';
export { visible, textOf, messageKey } from './dom-utils';

/** Versioned heuristics, not a stable provider API. Fail closed on ambiguity. */
export const selectors = {
  chatgpt: {
    composer: chatgptComposerSelectors,
    send: [
      'button[data-testid="send-button"]',
      'button[aria-label="Send prompt"]',
      'button[aria-label="프롬프트 보내기"]',
      'button[aria-label="Send message"]',
      'button[aria-label="메시지 보내기"]',
      'button[aria-label="보내기"]',
    ],
    busy: [
      'button[data-testid="stop-button"]',
      'button[aria-label="Stop generating"]',
      'button[aria-label="Stop streaming"]',
      'button[aria-label="생성 중지"]',
      'button[aria-label="응답 중지"]',
    ],
    assistant: '[data-message-author-role="assistant"]',
    user: '[data-message-author-role="user"]',
    done: chatgptDoneSelectors,
  },
  claude: {
    composer: [
      'div[contenteditable="true"][role="textbox"]',
      '.ProseMirror[contenteditable="true"]',
    ],
    send: [
      'button[aria-label="Send message"]',
      'button[aria-label="메시지 보내기"]',
      'button[data-testid="send-button"]',
    ],
    busy: [
      'button[aria-label="Stop response"]',
      'button[aria-label="Stop generating"]',
      'button[aria-label="응답 중지"]',
    ],
    assistant: '[data-is-streaming] .font-claude-response, .font-claude-response',
    user: '[data-testid="user-message"]',
    done: [
      'button[aria-label="Copy"]',
      'button[aria-label="Copy response"]',
      'button[aria-label="복사"]',
    ],
  },
  gemini: {
    composer: [
      'rich-textarea div[contenteditable="true"][role="textbox"]',
      '.ql-editor[contenteditable="true"]',
    ],
    send: [
      'button.send-button',
      'button[aria-label="Send message"]',
      'button[aria-label="메시지 보내기"]',
    ],
    busy: [
      'button[aria-label="Stop response"]',
      'button[aria-label="응답 중지"]',
      'button.stop-button',
    ],
    assistant: 'model-response .model-response-text, model-response message-content',
    user: 'user-query .query-text',
    done: [
      'button[data-test-id="copy-button"]',
      'button[aria-label="Copy response"]',
      'button[aria-label="답변 복사"]',
    ],
  },
} as const;

function first(selectors: readonly string[], root: ParentNode = document): HTMLElement | undefined {
  for (const selector of selectors) {
    const found = [...root.querySelectorAll(selector)].filter(visible);
    if (found.length > 1)
      throw new Error('입력 또는 전송 요소가 여러 개입니다. 수동 모드를 사용하세요.');
    if (found[0]) return found[0];
  }
}
export function composer(provider: ProviderId) {
  return provider === 'chatgpt' ? chatgptComposer() : first(selectors[provider].composer);
}
export function isBusy(provider: ProviderId) {
  return selectors[provider].busy.some((s) => [...document.querySelectorAll(s)].some(visible));
}
export function questions(provider: ProviderId) {
  return provider === 'chatgpt'
    ? chatgptMessages('user')
    : [...document.querySelectorAll(selectors[provider].user)].filter(visible);
}
export function draftText(element?: HTMLElement) {
  return element instanceof HTMLTextAreaElement ? element.value.trim() : textOf(element);
}
export function replies(provider: ProviderId) {
  if (provider === 'chatgpt') return chatgptMessages('assistant');
  // Selector alternatives can select nested wrappers; count only the outer response.
  const elements = [...document.querySelectorAll(selectors[provider].assistant)].filter(visible);
  return outermost(elements);
}
export function finishedMarker(provider: ProviderId, reply: HTMLElement) {
  const root =
    provider === 'chatgpt'
      ? (reply.closest('[data-turn-key], article, [data-testid^="conversation-turn"]') ??
        reply.closest('[data-chatgpt-search-message-ids]'))
      : provider === 'gemini'
        ? reply.closest('model-response')
        : reply.closest('[data-is-streaming]');
  if (!root) return false;
  return selectors[provider].done.some((s) => [...root.querySelectorAll(s)].some(visible));
}
export function snapshot(provider: ProviderId, documentId: string): Snapshot {
  const input = composer(provider);
  const userMessages = questions(provider);
  const assistantMessages = replies(provider);
  const user = userMessages.at(-1);
  const assistant = assistantMessages.at(-1);
  const question = textOf(user);
  // A new unanswered question must never be paired with the previous turn's answer.
  const answer = user && assistant && messageOrder(user, assistant) < 0 ? textOf(assistant) : '';
  return {
    provider,
    documentId,
    url: location.href,
    composer: !!input,
    draft: !!draftText(input),
    busy: isBusy(provider),
    truncated: question.length > LIMITS.question || answer.length > LIMITS.answer,
    lastQuestion: question.slice(0, LIMITS.question),
    lastAnswer: answer.slice(0, LIMITS.answer),
    diagnostics: {
      adapterVersion: '2026-10-06',
      layout: provider === 'chatgpt' ? chatgptLayout() : 'provider-default',
      documentState: document.readyState,
      composerCandidates:
        provider === 'chatgpt' ? chatgptComposerCandidates().length : Number(!!input),
      questions: userMessages.length,
      answers: assistantMessages.length,
      messageUnits:
        provider === 'chatgpt'
          ? chatgptMessageUnits()
          : userMessages.length + assistantMessages.length,
      sharedPage: provider === 'chatgpt' && location.pathname.startsWith('/share/'),
    },
  };
}
/** Read-only settling window for SPA route hydration; it never clicks or sends. */
export async function settledSnapshot(
  provider: ProviderId,
  documentId: string,
  waitFor?: 'composer' | 'conversation',
) {
  const deadline = Date.now() + 2500;
  let result = snapshot(provider, documentId);
  while (
    waitFor &&
    Date.now() < deadline &&
    !(waitFor === 'conversation' ? result.lastQuestion && result.lastAnswer : result.composer)
  ) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    result = snapshot(provider, documentId);
  }
  return result;
}
export function assertTarget(provider: ProviderId, url: string) {
  if (new URL(location.href).origin !== providers[provider].origin || location.href !== url)
    throw new Error('대화 주소가 변경되었습니다. 다시 연결하고 전송 내용을 확인하세요.');
}
export async function submit(provider: ProviderId, prompt: string, valid: () => boolean) {
  if (isBusy(provider)) throw new Error('AI가 응답 중입니다. 끝난 후 다시 연결하세요.');
  const input = composer(provider);
  if (!input)
    throw new Error(
      '로그인된 채팅 입력란을 찾지 못했습니다. 탭을 확인하거나 수동 모드를 사용하세요.',
    );
  if (draftText(input))
    throw new Error('작성 중인 입력이 있어 덮어쓰지 않았습니다. 탭에서 먼저 처리하세요.');
  if (!valid()) throw new Error('작업이 중단되었습니다.');
  input.focus();
  if (input instanceof HTMLTextAreaElement) {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(
      input,
      prompt,
    );
    input.dispatchEvent(
      new InputEvent('input', { bubbles: true, inputType: 'insertText', data: prompt }),
    );
  } else {
    // Native editing preserves the site's editor state; never insert HTML.
    if (!document.execCommand('insertText', false, prompt))
      throw new Error('편집기가 자동 입력을 지원하지 않습니다. 프롬프트를 복사해 직접 보내세요.');
  }
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (!valid())
    throw new Error('작업이 중단되었습니다. 입력란에 프롬프트가 남아 있을 수 있습니다.');
  const button = first(selectors[provider].send);
  if (
    !button ||
    (button as HTMLButtonElement).disabled ||
    button.getAttribute('aria-disabled') === 'true'
  )
    throw new Error(
      '프롬프트만 입력했습니다. 전송 버튼을 찾지 못해 클릭하지 않았습니다. 탭에서 직접 보내고 답변을 가져오세요.',
    );
  // Recheck input to avoid sending a concurrent user edit.
  if (draftText(input).replace(/\r\n/g, '\n') !== prompt.trim().replace(/\r\n/g, '\n'))
    throw new Error('입력 내용이 달라져 전송을 중단했습니다.');
  button.click();
}
