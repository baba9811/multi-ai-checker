import { defineUnlistedScript } from 'wxt/utils/define-unlisted-script';
import { Command, type Progress } from '../src/application/provider-protocol';
import { LIMITS } from '../src/domains/crosscheck/model';
import { providerForUrl } from '../src/domains/providers/model';
import {
  assertTarget,
  finishedMarker,
  isBusy,
  replies,
  questions,
  settledSnapshot,
  submit,
  textOf,
  messageKey,
} from '../src/infrastructure/providers/dom';
import { modelMenu } from '../src/infrastructure/providers/models';

export default defineUnlistedScript(() => {
  const world = globalThis as typeof globalThis & { __crosscheckInstalled?: boolean };
  if (world.__crosscheckInstalled) return;
  const provider = providerForUrl(location.href);
  if (!provider) return;
  world.__crosscheckInstalled = true;
  const documentId = crypto.randomUUID();
  type Active = {
    id: string;
    status: Progress['status'];
    answer: string;
    error?: string;
    baseline: Set<string>;
    userBaseline: Set<string>;
    prompt: string;
    previous: string;
    changed: number;
    start: number;
    poll: number;
    submitted: boolean;
    url: string;
    canCreate: boolean;
  };
  let active: Active | undefined;
  let choosingModel = false;
  const used = new Set<string>();
  const fail = (job: Active, message: string) => {
    job.status = 'error';
    job.error = message;
  };
  chrome.runtime.onMessage.addListener((raw, sender, respond) => {
    // Web pages/content scripts may not dispatch commands, even from this extension.
    if (
      sender.id !== chrome.runtime.id ||
      sender.url?.split('?')[0] !== chrome.runtime.getURL('sidepanel.html')
    )
      return;
    const parsed = Command.safeParse(raw);
    if (!parsed.success) {
      respond({ ok: false, error: '잘못된 명령입니다.' });
      return;
    }
    const command = parsed.data;
    void (async () => {
      if (command.type === 'snapshot')
        return settledSnapshot(provider, documentId, command.waitFor);
      if (command.type === 'cancel') {
        if (active?.id === command.id)
          fail(active, '수집을 중단했습니다. 이미 시작된 AI 생성은 해당 탭에서 중지하세요.');
        return true;
      }
      if (command.type === 'poll') {
        if (!active || active.id !== command.id)
          throw new Error(
            '페이지가 새로고침되어 작업을 찾지 못했습니다. 답변을 수동으로 가져오세요.',
          );
        active.poll = Date.now();
        return {
          status: active.status,
          answer: active.answer,
          error: active.error,
          url: active.url,
        } satisfies Progress;
      }
      if (command.documentId !== documentId)
        throw new Error('연결 후 페이지가 바뀌었습니다. 다시 연결하세요.');
      assertTarget(provider, command.url);
      if (command.type === 'models' || command.type === 'selectModel') {
        if (choosingModel || active?.status === 'pending' || isBusy(provider))
          throw new Error('진행 중인 작업이 끝난 후 모델을 변경하세요.');
        choosingModel = true;
        try {
          return await modelMenu(
            provider,
            command.type === 'selectModel' ? command.key : undefined,
          );
        } finally {
          choosingModel = false;
        }
      }
      if (choosingModel) throw new Error('모델 설정이 끝난 뒤 시작하세요.');
      if (used.has(command.id)) throw new Error('이미 시도한 요청입니다. 중복 전송하지 않습니다.');
      if (active?.status === 'pending') throw new Error('이 탭에서 다른 작업이 진행 중입니다.');
      if (used.size >= 30)
        throw new Error('이 탭의 실행 한도에 도달했습니다. 새로고침 후 다시 연결하세요.');
      used.add(command.id);
      const job: Active = {
        id: command.id,
        status: 'pending',
        answer: '',
        baseline: new Set(replies(provider).map(messageKey)),
        userBaseline: new Set(questions(provider).map(messageKey)),
        prompt: command.prompt,
        previous: '',
        changed: Date.now(),
        start: Date.now(),
        poll: Date.now(),
        submitted: false,
        url: command.url,
        canCreate: ['/', '/new', '/app'].includes(new URL(command.url).pathname),
      };
      active = job;
      void submit(
        provider,
        command.prompt,
        () => active === job && job.status === 'pending' && location.href === command.url,
        command.attachments,
      )
        .then(() => {
          job.submitted = true;
        })
        .catch((error) => fail(job, error instanceof Error ? error.message : '전송 실패'));
      return true;
    })()
      .then((data) => respond({ ok: true, data }))
      .catch((error) =>
        respond({ ok: false, error: error instanceof Error ? error.message : '작업 실패' }),
      );
    return true;
  });
  setInterval(() => {
    const job = active;
    if (!job || job.status !== 'pending') return;
    if (Date.now() - job.poll > 15000) {
      fail(job, '패널 연결이 끊겨 수집을 중단했습니다. 자동 재전송하지 않습니다.');
      return;
    }
    if (Date.now() - job.start > LIMITS.timeoutMs) {
      fail(
        job,
        '3분 동안 완료를 확인하지 못했습니다. 한도·로그인·화면 변경을 확인하고 답변을 수동 입력하세요.',
      );
      return;
    }
    if (!job.submitted) return;
    if (location.href !== job.url) {
      const path = location.pathname;
      const created =
        job.canCreate &&
        providerForUrl(location.href) === provider &&
        (provider === 'chatgpt'
          ? /^\/c\/[^/]+$/.test(path)
          : provider === 'claude'
            ? /^\/chat\/[^/]+$/.test(path)
            : /^\/app\/[^/]+$/.test(path));
      if (!created) {
        fail(job, '대화가 변경되어 수집을 멈췄습니다.');
        return;
      }
      job.url = location.href;
      job.canCreate = false;
    }
    const all = replies(provider).filter((el) => !job.baseline.has(messageKey(el)));
    if (!all.length) return;
    const userMessages = questions(provider).filter((el) => !job.userBaseline.has(messageKey(el)));
    if (
      all.length !== 1 ||
      userMessages.length !== 1 ||
      textOf(userMessages.at(-1)).replace(/\s+/g, ' ') !== job.prompt.trim().replace(/\s+/g, ' ')
    ) {
      fail(
        job,
        '대화 내용이 바뀌어 답변을 안전하게 연결할 수 없습니다. 답변을 수동으로 가져오세요.',
      );
      return;
    }
    const latest = all.at(-1)!;
    const text = textOf(latest);
    if (text.length > LIMITS.answer) {
      fail(job, '답변이 14,000자를 초과했습니다. 필요한 부분을 수동으로 가져오세요.');
      return;
    }
    if (text !== job.previous) {
      job.previous = text;
      job.changed = Date.now();
    }
    if (
      text &&
      !isBusy(provider) &&
      finishedMarker(provider, latest) &&
      Date.now() - job.changed >= 2500
    ) {
      job.answer = text;
      job.status = 'done';
    }
  }, 600);
});
