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
        'owner-view-registry',
        'owner-view-missing',
        'owner-view-shape',
        'owner-view-id',
        'owner-view-metadata',
        'owner-view-flags',
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
        'transport-webchannel',
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

export const GeminiHeaderObservationOutcome = z.enum([
  'ready-early',
  'ready-late',
  'not-observed',
  'inconclusive',
  'visibility-changed',
  'page',
  'not-empty',
  'unsupported',
  'interrupted',
]);
export type GeminiHeaderObservationOutcome = z.infer<typeof GeminiHeaderObservationOutcome>;
export const GeminiHeaderObservationVisibility = z.enum(['hidden', 'visible', 'unobserved']);
const observed = (value: {
  outcome?: GeminiHeaderObservationOutcome;
  visibility: z.infer<typeof GeminiHeaderObservationVisibility>;
}) =>
  !['ready-early', 'ready-late', 'not-observed'].includes(value.outcome ?? '') ||
  value.visibility !== 'unobserved';
export const GeminiHeaderObservationProgress = z
  .discriminatedUnion('status', [
    z
      .object({ status: z.literal('pending'), visibility: GeminiHeaderObservationVisibility })
      .strict(),
    z
      .object({
        status: z.literal('done'),
        outcome: GeminiHeaderObservationOutcome,
        visibility: GeminiHeaderObservationVisibility,
      })
      .strict(),
  ])
  .refine(observed);
export type GeminiHeaderObservationProgress = z.infer<typeof GeminiHeaderObservationProgress>;
export const GeminiHeaderObservationResult = z
  .object({
    outcome: GeminiHeaderObservationOutcome,
    visibility: GeminiHeaderObservationVisibility,
    retirement: z.enum(['closed', 'retained']),
  })
  .strict()
  .refine(observed);
export type GeminiHeaderObservationResult = z.infer<typeof GeminiHeaderObservationResult>;
