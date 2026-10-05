import { LIMITS, ConversationContext, type Run } from '../domains/crosscheck/model';
import { createRun, nextStage, updateJob } from '../domains/crosscheck/workflow';
import type { Binding, ProviderId } from '../domains/providers/model';
import type { Conversation, Platform, Workspace } from './ports';
import type { Attachment, AttachmentPayload } from '../domains/attachments/model';
import { matchAttachments } from './attachments';

export function assertCapturedContext(
  context: Run['context'],
  current: Conversation['snapshot'],
  ownTurns: Conversation['snapshot']['context']['turns'] = [],
) {
  // Legacy saved runs retain their existing recovery behavior without inventing source history.
  if (!context) return;
  if (
    !current.context ||
    current.context.error ||
    JSON.stringify(current.context.turns) !== JSON.stringify([...context.turns, ...ownTurns])
  )
    throw new Error(
      '원래 대화의 질문·답변이 바뀌었거나 일부만 불러와졌습니다. 새 검토로 다시 선택해주세요.',
    );
}

export function assertSameSource(
  previous: Conversation['snapshot'],
  current: Conversation['snapshot'],
) {
  if (
    previous.lastQuestion !== current.lastQuestion ||
    previous.lastAnswer !== current.lastAnswer ||
    JSON.stringify(previous.context) !== JSON.stringify(current.context)
  )
    throw new Error('원래 대화의 질문·답변이 바뀌었습니다. 현재 탭에서 다시 선택해주세요.');
}

export function importedRun(
  source: Conversation,
  selected: ProviderId[],
  mode: Run['mode'],
  attachments: Attachment[] = [],
): Run {
  const { binding, snapshot } = source;
  if (
    snapshot.url !== binding.url ||
    snapshot.documentId !== binding.documentId ||
    snapshot.provider !== binding.provider
  )
    throw new Error('대화를 읽는 동안 탭이 바뀌었습니다. 현재 대화에서 다시 시작해주세요.');
  if (!selected.includes(binding.provider))
    throw new Error('현재 대화의 AI도 검토 대상에 포함해주세요.');
  if (snapshot.truncated)
    throw new Error(
      `현재 대화가 길이 제한(질문 ${LIMITS.question}자, 답변 ${LIMITS.answer}자)을 넘었습니다.`,
    );
  if (!snapshot.composer)
    throw new Error('입력란을 찾지 못했습니다. 사이트 로그인 상태를 확인하고 새로고침해주세요.');
  if (snapshot.busy) throw new Error('현재 답변이 완성된 뒤 시작해주세요.');
  if (snapshot.draft)
    throw new Error('작성 중인 메시지가 있습니다. 보내거나 지운 뒤 시작해주세요.');
  if (!snapshot.lastQuestion || !snapshot.lastAnswer)
    throw new Error(
      '현재 질문·답변을 읽지 못했습니다. 대화가 보이는데도 이 메시지가 나오면 연결 화면에서 진단을 확인해주세요.',
    );
  if (!snapshot.context || snapshot.context.error)
    throw new Error(
      snapshot.context?.error ??
        '대화 맥락을 읽지 못했습니다. 탭을 새로고침하고 다시 선택해주세요.',
    );
  const parsedContext = ConversationContext.safeParse(snapshot.context);
  if (!parsedContext.success)
    throw new Error(
      `대화 가져오기는 최대 ${LIMITS.turns}쌍 · 합계 ${LIMITS.context}자(질문 ${LIMITS.question}자, 답변 ${LIMITS.answer}자)까지 가능합니다. 더 짧은 대화를 선택해주세요.`,
    );
  const context = parsedContext.data;
  const latest = context.turns.at(-1)!;
  if (latest.question !== snapshot.lastQuestion || latest.answer !== snapshot.lastAnswer)
    throw new Error('마지막 질문·답변과 대화 맥락이 다릅니다. 다시 선택해주세요.');
  const run = createRun(
    snapshot.lastQuestion,
    selected,
    binding.provider,
    mode,
    attachments,
    context,
  );
  return {
    ...run,
    main: binding,
    jobs: run.jobs.map((job) =>
      job.provider === binding.provider
        ? { ...job, status: 'done', answer: snapshot.lastAnswer, method: 'web' }
        : job,
    ),
  };
}

/** A single user action authorizes this bounded pipeline. Never retry ambiguous sends. */
export async function executeAutomatic(
  initial: Run,
  saved: Workspace['bindings'],
  platform: Platform,
  signal: AbortSignal,
  checkpoint: (workspace: Workspace) => Promise<void>,
  attachments: AttachmentPayload[] = [],
): Promise<Run> {
  if (!matchAttachments(initial.attachments, attachments))
    throw new Error(
      '원본 첨부파일을 모두 다시 선택해주세요. 파일 이름과 내용이 이전 선택과 같아야 합니다.',
    );
  let run = initial;
  const bindings = { ...saved, [run.chair]: run.main };
  const publish = () => checkpoint({ run, bindings: { ...bindings } });
  const checkAbort = () => {
    if (signal.aborted)
      throw new Error('자동 검토를 중단했습니다. 이미 보낸 요청은 해당 AI 탭에서 확인하세요.');
  };
  if (!run.main) throw new Error('최종 답변을 보낼 메인 대화가 없습니다.');
  const ownMainTurns = () =>
    run.jobs
      .filter(
        (job) =>
          job.provider === run.chair &&
          job.stage !== 'collect' &&
          job.status === 'done' &&
          job.method === 'web',
      )
      .map((job) => ({ question: job.prompt, answer: job.answer }));
  checkAbort();
  if (run.context) {
    await platform.reveal(run.main);
    checkAbort();
    const source = await platform.inspect(run.main);
    if (source.url !== run.main.url || source.documentId !== run.main.documentId)
      throw new Error('메인 대화가 바뀌었습니다.');
    assertCapturedContext(run.context, source, ownMainTurns());
  }
  await publish();
  checkAbort();
  // Attach only peers that still need their first request. Model choices on bound tabs persist.
  for (const provider of run.selected.filter((id) => id !== run.chair)) {
    checkAbort();
    const pending = run.jobs.find(
      (job) => job.provider === provider && job.stage === run.stage && job.status === 'ready',
    );
    if (!pending) continue;
    try {
      bindings[provider] = await platform.preparePeer(provider, bindings[provider]);
    } catch (error) {
      run = updateJob(run, pending.id, {
        status: 'error',
        error: error instanceof Error ? error.message : '탭 연결 실패',
      });
    }
    await publish();
  }
  while (true) {
    checkAbort();
    const pending = run.jobs.filter((job) => job.stage === run.stage && job.status === 'ready');
    for (const job of pending) {
      checkAbort();
      const target: Binding | undefined =
        job.provider === run.chair ? run.main : bindings[job.provider];
      try {
        if (!target) throw new Error('연결할 AI 탭을 찾지 못했습니다.');
        await platform.reveal(target);
        checkAbort();
        const snap = await platform.inspect(target);
        if (snap.url !== target.url || snap.documentId !== target.documentId)
          throw new Error(
            job.provider === run.chair
              ? '메인 대화가 바뀌었습니다. 자동 전송을 멈췄습니다.'
              : '연결한 대화가 바뀌었습니다.',
          );
        if (job.provider === run.chair) assertCapturedContext(run.context, snap, ownMainTurns());
        if (!snap.composer)
          throw new Error('입력란을 찾지 못했습니다. AI 탭에서 로그인 상태를 확인하세요.');
        if (snap.busy || snap.draft)
          throw new Error('AI 탭에 작성 중인 메시지 또는 생성 중인 답변이 있습니다.');
        checkAbort();
      } catch (error) {
        run = updateJob(run, job.id, {
          status: signal.aborted ? 'interrupted' : 'error',
          error: error instanceof Error ? error.message : '연결 검사 실패',
        });
        await publish();
        continue;
      }
      run = updateJob(run, job.id, { status: 'sending', method: 'web' });
      // A failed save must stop the operation before it can click Send.
      await publish();
      try {
        checkAbort();
        const delivered = run.jobs.some((previous) => {
          const receipt = previous.attachmentTarget;
          return (
            previous.provider === job.provider &&
            previous.status === 'done' &&
            receipt &&
            receipt.tabId === target!.tabId &&
            receipt.documentId === target!.documentId &&
            receipt.url === target!.url
          );
        });
        const result = await platform.sendAndCollect(
          job,
          target!,
          signal,
          delivered ? [] : attachments,
        );
        if (job.provider === run.chair && result.binding.url !== run.main!.url)
          throw new Error('메인 대화가 바뀌었습니다. 답변을 해당 탭에서 확인하세요.');
        bindings[job.provider] = result.binding;
        run = updateJob(run, job.id, {
          status: 'done',
          answer: result.answer,
          attachmentTarget: delivered || attachments.length > 0 ? result.binding : undefined,
        });
      } catch (error) {
        run = updateJob(run, job.id, {
          status: signal.aborted ? 'interrupted' : 'error',
          error: error instanceof Error ? error.message : '답변 수집 실패',
        });
      }
      await publish();
    }
    checkAbort();
    if (run.stage === 'synthesize') {
      if (!run.jobs.some((job) => job.stage === 'synthesize' && job.status === 'done'))
        throw new Error('최종 답변 생성을 완료하지 못했습니다. 아래 상태를 확인해주세요.');
      return run;
    }
    run = nextStage(run);
    await publish();
  }
}
