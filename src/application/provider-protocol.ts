import { z } from 'zod';
import { ProviderId } from '../domains/providers/model';
import { LIMITS, ConversationTurn } from '../domains/crosscheck/model';
import { AttachmentBatch } from '../domains/attachments/model';

export const AdapterDiagnostics = z.object({
  adapterVersion: z.literal('2026-10-06'),
  layout: z.enum(['legacy', 'redesigned', 'unknown', 'provider-default']),
  documentState: z.enum(['loading', 'interactive', 'complete']),
  composerCandidates: z.number().int().nonnegative(),
  questions: z.number().int().nonnegative(),
  answers: z.number().int().nonnegative(),
  messageUnits: z.number().int().nonnegative(),
  sharedPage: z.boolean(),
});
export type AdapterDiagnostics = z.infer<typeof AdapterDiagnostics>;

// Transport must also read the extension's own bounded prompts appended after import.
export const CapturedConversation = z
  .object({
    scope: z.literal('rendered'),
    turns: z
      .array(ConversationTurn.extend({ question: z.string().min(1).max(LIMITS.prompt) }))
      .max(LIMITS.turns + 7),
    error: z.string().max(500).optional(),
  })
  .refine(
    (context) =>
      context.turns.reduce((size, turn) => size + turn.question.length + turn.answer.length, 0) <=
      LIMITS.context + 2 * (LIMITS.prompt + LIMITS.answer),
    '불러온 대화가 전송 경계를 넘었습니다.',
  );
export const Snapshot = z.object({
  provider: ProviderId,
  documentId: z.string(),
  url: z.string(),
  composer: z.boolean(),
  busy: z.boolean(),
  draft: z.boolean(),
  truncated: z.boolean(),
  lastQuestion: z.string().max(LIMITS.question),
  lastAnswer: z.string().max(LIMITS.answer),
  context: CapturedConversation,
  diagnostics: AdapterDiagnostics.optional(),
});
export type Snapshot = z.infer<typeof Snapshot>;
export const ModelCatalog = z.object({
  current: z.string().max(160).optional(),
  options: z
    .array(
      z.object({ key: z.string().max(300), label: z.string().max(160), disabled: z.boolean() }),
    )
    .max(40),
  message: z.string().max(500).optional(),
});
export type ModelCatalog = z.infer<typeof ModelCatalog>;
export const Command = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('snapshot'),
    waitFor: z.enum(['composer', 'conversation']).optional(),
  }),
  z.object({
    type: z.literal('send'),
    id: z.string().min(1).max(100),
    documentId: z.string().max(100),
    url: z.string().max(3000),
    prompt: z.string().min(1).max(LIMITS.prompt),
    attachments: AttachmentBatch.default([]),
  }),
  z.object({ type: z.literal('poll'), id: z.string().max(100) }),
  z.object({ type: z.literal('cancel'), id: z.string().max(100) }),
  z.object({ type: z.literal('models'), documentId: z.string(), url: z.string() }),
  z.object({
    type: z.literal('selectModel'),
    documentId: z.string(),
    url: z.string(),
    key: z.string().max(300),
  }),
]);
export const Progress = z.object({
  status: z.enum(['pending', 'done', 'error']),
  answer: z.string().max(LIMITS.answer),
  error: z.string().optional(),
  url: z.string().max(3000).optional(),
});
export type Progress = z.infer<typeof Progress>;
