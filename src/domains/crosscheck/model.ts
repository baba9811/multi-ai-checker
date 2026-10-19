import { z } from 'zod';
import { Binding, ProviderId } from '../providers/model';
import { Attachment, ATTACHMENT_LIMITS } from '../attachments/model';

export const LIMITS = {
  question: 8000,
  answer: 14000,
  prompt: 100000,
  evidence: 8,
  turns: 20,
  context: 40000,
  timeoutMs: 180000,
} as const;
export const ConversationTurn = z.object({
  question: z.string().min(1).max(LIMITS.question),
  answer: z.string().min(1).max(LIMITS.answer),
});
export const ConversationContext = z
  .object({
    scope: z.literal('rendered'),
    turns: z.array(ConversationTurn).min(1).max(LIMITS.turns),
  })
  .refine(
    (context) =>
      context.turns.reduce((size, turn) => size + turn.question.length + turn.answer.length, 0) <=
      LIMITS.context,
    '대화가 전체 길이 제한을 넘었습니다.',
  );
export type ConversationContext = z.infer<typeof ConversationContext>;
export const Stage = z.enum(['collect', 'review', 'synthesize']);
export type Stage = z.infer<typeof Stage>;
export const stageNames: Record<Stage, string> = {
  collect: '독립 답변',
  review: '교차 검토',
  synthesize: '최종 종합',
};
const stagePrompt = z.string().trim().min(1).max(4000);
export const PromptOptions = z.object({
  language: z
    .string()
    .regex(/^[^\r\n\u2028\u2029]*$/)
    .trim()
    .min(1)
    .max(80),
  stages: z.object({ collect: stagePrompt, review: stagePrompt, synthesize: stagePrompt }),
});
export type PromptOptions = z.infer<typeof PromptOptions>;
export const defaultPromptOptions: PromptOptions = {
  language: '한국어',
  stages: {
    collect:
      '질문에 독립적으로 답하세요. 가능한 대안과 실패 조건을 탐색하고 검증 가능한 핵심 주장을 명시하세요.',
    review:
      '각 답변의 핵심 주장을 교차 검토하세요. 모순, 누락, 근거 없는 주장을 찾고, 합의점 / 이견 / 확인된 근거 / 미확인 주장 / 수정 권고로 정리하세요. 출처를 실제로 열었는지 명시하세요.',
    synthesize:
      '후보 답변과 비판, 사용자가 확인한 근거를 검토해 가장 근거가 탄탄한 최종 답변을 작성하세요. 원래 질문에 직접 답하고, 채택 이유 / 반대 근거 / 남은 불확실성 / 출처를 포함하세요. 반박된 주장은 수정하고 검증하지 못한 내용은 단정하지 마세요. 사용자 근거도 오류 가능성을 검토하세요.',
  },
};
export const Job = z.object({
  id: z.string(),
  provider: ProviderId,
  stage: Stage,
  prompt: z.string().max(LIMITS.prompt),
  status: z.enum(['ready', 'sending', 'done', 'error', 'interrupted']),
  answer: z.string().max(LIMITS.answer),
  error: z.string().max(2000).optional(),
  method: z.enum(['manual', 'web']).optional(),
  attachmentTarget: Binding.optional(),
});
export type Job = z.infer<typeof Job>;
export const Evidence = z.object({
  id: z.string(),
  url: z.string().max(2000),
  claim: z.string().min(1).max(1000),
  excerpt: z.string().min(1).max(2000),
  verdict: z.enum(['supports', 'contradicts', 'unclear']),
});
export type Evidence = z.infer<typeof Evidence>;
export const Run = z
  .object({
    version: z.literal(1),
    kind: z.literal('claude-peer').optional(),
    execution: z.literal('background').optional(),
    id: z.string(),
    createdAt: z.string(),
    question: z.string().min(1).max(LIMITS.question),
    selected: z.array(ProviderId).min(2).max(3),
    chair: ProviderId,
    mode: z.enum(['economy', 'thorough']),
    stage: Stage,
    jobs: z.array(Job).max(7),
    evidence: z.array(Evidence).max(LIMITS.evidence),
    main: Binding.optional(),
    context: ConversationContext.optional(),
    promptOptions: PromptOptions.optional(),
    attachments: z.array(Attachment).max(ATTACHMENT_LIMITS.count).default([]),
  })
  .refine(
    (run) =>
      run.kind !== 'claude-peer' ||
      (run.chair !== 'claude' &&
        run.mode === 'economy' &&
        run.selected.length === 2 &&
        new Set(run.selected).size === 2 &&
        run.selected.includes(run.chair) &&
        run.selected.includes('claude') &&
        run.stage !== 'synthesize' &&
        !!run.main &&
        run.main.provider === run.chair &&
        !run.main.threadId &&
        !!run.context &&
        run.jobs.every(
          (job) =>
            job.stage !== 'synthesize' &&
            (job.stage === 'collect'
              ? run.selected.includes(job.provider)
              : job.provider === 'claude'),
        )),
    'Invalid Claude peer review intent.',
  );
export type Run = z.infer<typeof Run>;
