import { z } from 'zod';
import { Binding, ProviderId } from '../providers/model';
import { Attachment, ATTACHMENT_LIMITS } from '../attachments/model';

export const LIMITS = {
  question: 8000,
  answer: 14000,
  prompt: 100000,
  evidence: 8,
  timeoutMs: 180000,
} as const;
export const Stage = z.enum(['collect', 'review', 'synthesize']);
export type Stage = z.infer<typeof Stage>;
export const stageNames: Record<Stage, string> = {
  collect: '독립 답변',
  review: '교차 검토',
  synthesize: '최종 종합',
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
export const Run = z.object({
  version: z.literal(1),
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
  attachments: z.array(Attachment).max(ATTACHMENT_LIMITS.count).default([]),
});
export type Run = z.infer<typeof Run>;
