import { z } from 'zod';

export const CLAUDE_PROBE_PROMPT = 'Reply with CROSSCHECK_OK only.';
export const CLAUDE_CONTEXT_PROBE_PROMPT = `The following is a synthetic conversation used only to test context transfer.
<conversation>
Question: Which verification word should be remembered?
Answer: CROSSCHECK_CONTEXT_OK
Question: Which number should be remembered?
Answer: 47
</conversation>
Return the verification word from the first answer followed by a slash and the number from the second answer. Output only that combined value.`;
export const CLAUDE_CONTEXT_PROBE_FOLLOWUP =
  'Using the synthetic conversation already provided, return its second answer followed by a slash and its first answer. Output only that combined value.';
export const CLAUDE_CONTEXT_PROBE_EXPECTED = [
  'CROSSCHECK_CONTEXT_OK/47',
  '47/CROSSCHECK_CONTEXT_OK',
] as const;
export const ClaudeProbeKind = z.literal('context');
export type ClaudeProbeKind = z.infer<typeof ClaudeProbeKind>;
export const ClaudeProbeRecord = z
  .object({
    id: z.string().min(1).max(100),
    status: z.enum(['pending', 'done', 'uncertain']),
    kind: ClaudeProbeKind.optional(),
  })
  .strict();
export type ClaudeProbeRecord = z.infer<typeof ClaudeProbeRecord>;
export const ClaudeProbeReason = z.enum([
  'page',
  'model',
  'model-menu',
  'model-trigger',
  'account',
  'account-selection',
  'access',
  'catalog',
  'model-confirmation',
  'send',
  'response',
  'response-event',
  'response-metadata',
  'response-role',
  'response-binding',
  'response-block',
  'response-terminal',
  'response-confirmation',
  'response-context',
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
