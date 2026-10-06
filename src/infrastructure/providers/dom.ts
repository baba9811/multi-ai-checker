import { LIMITS } from '../../domains/crosscheck/model';
import { providers, type ProviderId } from '../../domains/providers/model';
import { CapturedConversation, type Snapshot } from '../../application/provider-protocol';
import type { AttachmentPayload } from '../../domains/attachments/model';
import { hasAttachments, uploadAttachments, watchAttachmentEdits } from './attachments';
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
      'button[type="submit"][aria-label="Send"]',
      'button[aria-label="메시지 보내기"]',
      'button[aria-label="보내기"]',
    ],
    busy: [
      'button[data-testid="stop-button"]',
      'button[aria-label="Stop generating"]',
      'button[aria-label="Stop streaming"]',
      'button[aria-label="Stop"]',
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
  const found = outermost([...root.querySelectorAll(selectors.join(','))].filter(visible));
  if (found.length > 1)
    throw new Error('입력 또는 전송 요소가 여러 개입니다. 수동 모드를 사용하세요.');
  return found[0];
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
    : [...document.querySelectorAll(selectors[provider].user)].filter(visible).sort(messageOrder);
}
export function draftText(element?: HTMLElement) {
  // These editors store inserted lines as paragraphs; innerText adds display-only blank lines.
  if (
    element?.matches('.ProseMirror, .ql-editor') &&
    [...element.childNodes].every((node) => node instanceof HTMLParagraphElement)
  )
    return [...element.children]
      .map((paragraph) => {
        const clone = paragraph.cloneNode(true) as HTMLElement;
        clone.querySelectorAll('br.ProseMirror-trailingBreak').forEach((node) => node.remove());
        if (
          element.matches('.ql-editor') &&
          clone.childNodes.length === 1 &&
          clone.firstChild instanceof HTMLBRElement
        )
          clone.firstChild.remove();
        clone.querySelectorAll('br').forEach((node) => node.replaceWith('\n'));
        return clone.textContent ?? '';
      })
      .join('\n')
      .trim();
  return element instanceof HTMLTextAreaElement ? element.value.trim() : textOf(element);
}
export function replies(provider: ProviderId) {
  if (provider === 'chatgpt') return chatgptMessages('assistant');
  // Selector alternatives can select nested wrappers; count only the outer response.
  const elements = [...document.querySelectorAll(selectors[provider].assistant)].filter(visible);
  return outermost(elements).sort(messageOrder);
}
export function finishedMarker(provider: ProviderId, reply: HTMLElement) {
  const stream = provider === 'claude' ? reply.closest('[data-is-streaming]') : undefined;
  if (provider === 'claude' && stream?.getAttribute('data-is-streaming') !== 'false') return false;
  const root =
    provider === 'chatgpt'
      ? (reply.closest('[data-turn-key], article, [data-testid^="conversation-turn"]') ??
        reply.closest('[data-chatgpt-search-message-ids]'))
      : provider === 'gemini'
        ? reply.closest('model-response')
        : (reply.closest('[role="article"], [data-testid="transcript-row"]') ?? stream);
  if (
    provider === 'claude' &&
    root &&
    (root.querySelector(selectors.claude.user) ||
      outermost([...root.querySelectorAll<HTMLElement>(selectors.claude.assistant)]).length !== 1)
  )
    return false;
  if (!root) return false;
  return selectors[provider].done.some((s) => [...root.querySelectorAll(s)].some(visible));
}
export function pairConversation(
  messages: { role: 'user' | 'assistant'; text: string; complete: boolean }[],
) {
  const turns = [];
  if (!messages.length || messages.length % 2)
    throw new Error('완료되지 않은 대화가 있습니다. 답변이 끝난 뒤 다시 선택해주세요.');
  for (let index = 0; index < messages.length; index += 2) {
    const question = messages[index]!;
    const answer = messages[index + 1]!;
    if (question.role !== 'user' || answer.role !== 'assistant' || !answer.complete)
      throw new Error(
        '질문·답변의 순서 또는 완료 상태가 불명확합니다. 대화를 확인하고 다시 선택해주세요.',
      );
    turns.push({ question: question.text, answer: answer.text });
  }
  return CapturedConversation.parse({ scope: 'rendered', turns }).turns;
}
function conversationContext(
  provider: ProviderId,
  users: HTMLElement[],
  assistants: HTMLElement[],
): Snapshot['context'] {
  try {
    if (provider === 'chatgpt') {
      const captured = [...users, ...assistants];
      const keyed = [...document.querySelectorAll('[data-chatgpt-search-unit-key]')];
      const represented = (element: Element) =>
        captured.some((message) => element.contains(message) || message.contains(element));
      const indices = keyed
        .filter(represented)
        .map((element) =>
          element.getAttribute('data-chatgpt-search-unit-key')?.match(/^fallback-turn-(\d+):/),
        )
        .filter((match) => !!match)
        .map((match) => Number(match![1]));
      const unique = [...new Set(indices)].sort((a, b) => a - b);
      const omitted = keyed.some(
        (element) =>
          /^fallback-turn-\d+:\d+:(user|assistant)$/.test(
            element.getAttribute('data-chatgpt-search-unit-key') ?? '',
          ) &&
          !represented(element) &&
          captured.some((message) =>
            message.closest('[data-chatgpt-conversation-selection-target]')?.contains(element),
          ),
      );
      if (omitted || unique.some((value, index) => value !== index))
        throw new Error(
          '이전 대화가 일부만 불러와졌습니다. 대화 맨 위까지 불러온 뒤 다시 선택해주세요.',
        );
    }
    const messages = [
      ...users.map((element) => ({ element, role: 'user' as const })),
      ...assistants.map((element) => ({ element, role: 'assistant' as const })),
    ]
      .sort((a, b) => messageOrder(a.element, b.element))
      .map(({ element, role }) => ({
        role,
        text: textOf(element),
        complete: role === 'user' || finishedMarker(provider, element),
      }));
    return { scope: 'rendered', turns: pairConversation(messages) };
  } catch (error) {
    return {
      scope: 'rendered',
      turns: [],
      error:
        error instanceof Error && error.name !== 'ZodError'
          ? error.message
          : '대화가 길이 제한을 넘거나 비어 있습니다. 더 짧은 대화를 선택해주세요.',
    };
  }
}
export function snapshot(provider: ProviderId, documentId: string): Snapshot {
  const input = composer(provider);
  const userMessages = questions(provider);
  const assistantMessages = replies(provider);
  const user = userMessages.at(-1);
  const assistant = assistantMessages.at(-1);
  const question = textOf(user);
  // A new unanswered question must never be paired with the previous turn's answer.
  const answer =
    user && assistant && messageOrder(user, assistant) < 0 && finishedMarker(provider, assistant)
      ? textOf(assistant)
      : '';
  return {
    provider,
    documentId,
    url: location.href,
    composer: !!input,
    draft: !!draftText(input) || (!!input && hasAttachments(provider, input)),
    busy: isBusy(provider),
    truncated: question.length > LIMITS.question || answer.length > LIMITS.answer,
    lastQuestion: question.slice(0, LIMITS.question),
    lastAnswer: answer.slice(0, LIMITS.answer),
    context: conversationContext(provider, userMessages, assistantMessages),
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
export async function submit(
  provider: ProviderId,
  prompt: string,
  valid: () => boolean,
  attachments: AttachmentPayload[] = [],
) {
  if (isBusy(provider)) throw new Error('AI가 응답 중입니다. 끝난 후 다시 연결하세요.');
  const input = composer(provider);
  if (!input)
    throw new Error(
      '로그인된 채팅 입력란을 찾지 못했습니다. 탭을 확인하거나 수동 모드를 사용하세요.',
    );
  if (draftText(input) || hasAttachments(provider, input))
    throw new Error('작성 중인 입력이 있어 덮어쓰지 않았습니다. 탭에서 먼저 처리하세요.');
  const guard = watchAttachmentEdits(provider, input);
  const check = () => valid() && guard.valid();
  let filesReady = () => !hasAttachments(provider, input);
  try {
    if (!check()) throw new Error('작업이 중단되었습니다.');
    if (attachments.length) {
      filesReady = await uploadAttachments(
        provider,
        input,
        attachments,
        () => check() && composer(provider) === input && !isBusy(provider) && !draftText(input),
        guard,
      );
      if (!check() || composer(provider) !== input || isBusy(provider) || draftText(input))
        throw new Error('업로드 중 입력란이 바뀌어 전송을 중단했습니다.');
    }
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
    // Preserve the post-input edit window while waiting for the site's send control.
    const started = Date.now();
    const deadline = started + 2500;
    while (true) {
      if (!check())
        throw new Error('작업이 중단되었습니다. 입력란에 프롬프트가 남아 있을 수 있습니다.');
      if (!input.isConnected || composer(provider) !== input || isBusy(provider))
        throw new Error('입력란 또는 생성 상태가 바뀌어 전송을 중단했습니다.');
      if (!filesReady()) throw new Error('첨부파일 상태가 바뀌어 전송을 중단했습니다.');
      // Let the editor normalize native input before exact comparisons; never click before this.
      const settled = Date.now() - started >= 300;
      if (
        settled &&
        draftText(input).replace(/\r\n/g, '\n') !== prompt.trim().replace(/\r\n/g, '\n')
      )
        throw new Error('입력 내용이 달라져 전송을 중단했습니다.');
      if (Date.now() >= deadline)
        throw new Error(
          '프롬프트만 입력했습니다. 전송 버튼을 찾지 못해 클릭하지 않았습니다. 탭에서 직접 보내고 답변을 가져오세요.',
        );
      const button = first(selectors[provider].send);
      if (
        button &&
        !(button as HTMLButtonElement).disabled &&
        button.getAttribute('aria-disabled') !== 'true' &&
        settled
      ) {
        button.click();
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  } finally {
    guard.close();
  }
}
