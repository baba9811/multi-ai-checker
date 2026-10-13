import { z } from 'zod';
export const GeminiClientCapability = z.discriminatedUnion('status', [
  z.object({ status: z.literal('candidate') }).strict(),
  z
    .object({
      status: z.literal('unsupported'),
      reason: z.enum([
        'page',
        'owner',
        'owner-context',
        'owner-view',
        'owner-slot',
        'owner-declaration-1',
        'owner-declaration-2',
        'owner-declaration-3',
        'owner-declaration-3-node',
        'owner-declaration-3-template',
        'owner-declaration-3-binding',
        'owner-component',
        'runtime-shape',
        'service-identity',
        'protection',
        'transport-session',
        'transport-api',
        'transport-route',
        'transport-sse',
        'transport-rpc',
        'prewarm',
        'hook',
      ]),
    })
    .strict(),
]);
export type GeminiClientCapability = z.infer<typeof GeminiClientCapability>;
const modelLabel = z.string().min(1).max(160);
export const GeminiReadinessModel = z.object({ model: modelLabel }).strict();
export const GeminiProtectionStatus = z
  .object({
    protection: z.enum(['disabled', 'enabled', 'unknown']),
    protectionReason: z
      .enum([
        'bootstrap-missing',
        'bootstrap-format',
        'bootstrap-limit',
        'configuration-format',
        'flag-missing',
        'flag-ambiguous',
        'flag-format',
      ])
      .optional(),
  })
  .strict()
  .refine(
    (result) =>
      result.protection === 'unknown'
        ? result.protectionReason !== undefined
        : result.protectionReason === undefined,
    {
      message: 'A protection reason is required only for unknown protection.',
      path: ['protectionReason'],
    },
  );
export type GeminiProtectionStatus = z.infer<typeof GeminiProtectionStatus>;
export const GeminiReadinessResult = GeminiProtectionStatus.safeExtend({
  model: modelLabel,
  client: GeminiClientCapability,
});
export type GeminiReadinessResult = z.infer<typeof GeminiReadinessResult>;
export const GeminiReadinessRecord = z
  .object({ id: z.string().min(1).max(100), status: z.enum(['pending', 'done', 'uncertain']) })
  .strict();
export type GeminiReadinessRecord = z.infer<typeof GeminiReadinessRecord>;
export const GeminiReadinessReason = z.enum([
  'page',
  'model',
  'model-trigger',
  'model-menu',
  'model-selection',
  'model-cleanup',
  'model-confirmation',
  'interrupted',
]);
export type GeminiReadinessReason = z.infer<typeof GeminiReadinessReason>;
export const GeminiReadinessProgress = z
  .object({
    status: z.enum(['pending', 'done', 'error']),
    result: GeminiReadinessModel.optional(),
    reason: GeminiReadinessReason.optional(),
  })
  .strict();
export type GeminiReadinessProgress = z.infer<typeof GeminiReadinessProgress>;
