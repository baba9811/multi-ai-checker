import { z } from 'zod';
export const GeminiReadinessResult = z
  .object({
    model: z.string().min(1).max(160),
    protection: z.enum(['disabled', 'enabled', 'unknown']),
  })
  .strict();
export type GeminiReadinessResult = z.infer<typeof GeminiReadinessResult>;
export const GeminiReadinessRecord = z
  .object({ id: z.string().min(1).max(100), status: z.enum(['pending', 'done', 'uncertain']) })
  .strict();
export type GeminiReadinessRecord = z.infer<typeof GeminiReadinessRecord>;
export const GeminiReadinessProgress = z
  .object({
    status: z.enum(['pending', 'done', 'error']),
    result: GeminiReadinessResult.optional(),
    reason: z.enum(['page', 'model', 'interrupted']).optional(),
  })
  .strict();
export type GeminiReadinessProgress = z.infer<typeof GeminiReadinessProgress>;
