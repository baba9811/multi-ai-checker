import { LIMITS, type Run } from '../domains/crosscheck/model';
import { createRun, nextStage, updateJob } from '../domains/crosscheck/workflow';
import type { Binding, ProviderId } from '../domains/providers/model';
import type { Conversation, Platform, Workspace } from './ports';

export function importedRun(source: Conversation, selected: ProviderId[], mode: Run['mode']): Run {
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
  const run = createRun(snapshot.lastQuestion, selected, binding.provider, mode);
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
): Promise<Run> {
  let run = initial;
  const bindings = { ...saved, [run.chair]: run.main };
  const publish = () => checkpoint({ run, bindings: { ...bindings } });
  const checkAbort = () => {
    if (signal.aborted)
      throw new Error('자동 검토를 중단했습니다. 이미 보낸 요청은 해당 AI 탭에서 확인하세요.');
  };
  if (!run.main) throw new Error('최종 답변을 보낼 메인 대화가 없습니다.');
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
    const results = await Promise.allSettled(
      pending.map(async (job) => {
        const target: Binding | undefined =
          job.provider === run.chair ? run.main : bindings[job.provider];
        try {
          checkAbort();
          if (!target) throw new Error('연결할 AI 탭을 찾지 못했습니다.');
          const snap = await platform.inspect(target);
          if (snap.url !== target.url || snap.documentId !== target.documentId)
            throw new Error(
              job.provider === run.chair
                ? '메인 대화가 바뀌었습니다. 자동 전송을 멈췄습니다.'
                : '연결한 대화가 바뀌었습니다.',
            );
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
          return;
        }
        run = updateJob(run, job.id, { status: 'sending', method: 'web' });
        // A failed save must stop the operation before it can click Send.
        await publish();
        try {
          checkAbort();
          const result = await platform.sendAndCollect(job, target!, signal);
          if (job.provider === run.chair && result.binding.url !== run.main!.url)
            throw new Error('메인 대화가 바뀌었습니다. 답변을 해당 탭에서 확인하세요.');
          bindings[job.provider] = result.binding;
          run = updateJob(run, job.id, { status: 'done', answer: result.answer });
        } catch (error) {
          run = updateJob(run, job.id, {
            status: signal.aborted ? 'interrupted' : 'error',
            error: error instanceof Error ? error.message : '답변 수집 실패',
          });
        }
        await publish();
      }),
    );
    const failed = results.find((result) => result.status === 'rejected');
    if (failed?.status === 'rejected') throw failed.reason;
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
