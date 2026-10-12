import { z } from 'zod';

export const CLAUDE_PROBE_PROMPT = 'Reply with CROSSCHECK_OK only.';
export const ClaudeProbeRecord = z
  .object({
    id: z.string().min(1).max(100),
    status: z.enum(['pending', 'done', 'uncertain']),
  })
  .strict();
export type ClaudeProbeRecord = z.infer<typeof ClaudeProbeRecord>;
export const ClaudeProbeReason = z.enum([
  'page',
  'model',
  'account',
  'account-selection',
  'access',
  'catalog',
  'send',
  'response',
  'interrupted',
]);
export type ClaudeProbeReason = z.infer<typeof ClaudeProbeReason>;
export const ClaudeProbeProgress = z
  .object({
    status: z.enum(['pending', 'done', 'error']),
    answer: z.string().max(4096),
    reason: ClaudeProbeReason.optional(),
  })
  .strict();
export type ClaudeProbeProgress = z.infer<typeof ClaudeProbeProgress>;
