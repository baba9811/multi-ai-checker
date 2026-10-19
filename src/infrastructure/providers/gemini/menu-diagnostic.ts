const diagnostics = [
  'open-trigger',
  'open-menu',
  'owner-missing',
  'owner-changed',
  'trigger-detached',
  'popover-ambiguous',
  'menu-ambiguous',
  'controls-invalid',
  'owner-duplicate',
] as const;
export type GeminiMenuDiagnostic = (typeof diagnostics)[number];

/** Secondary provider-local evidence; the shared Error.cause remains model-menu. */
export function readGeminiMenuDiagnostic(error: unknown): GeminiMenuDiagnostic | undefined {
  try {
    if (!(error instanceof Error)) return;
    const value = Object.getOwnPropertyDescriptor(error, 'geminiMenuDiagnostic')?.value;
    if (typeof value === 'string' && diagnostics.includes(value as GeminiMenuDiagnostic))
      return value as GeminiMenuDiagnostic;
  } catch {}
}

const triggerDiagnostics = [
  'compact-control',
  'final-control',
  'header-context',
  'header-deadline',
  'header-association',
] as const;
export type GeminiTriggerDiagnostic = (typeof triggerDiagnostics)[number];

/** Terminal provider-local origin; never evaluates inherited or accessor metadata. */
export function readGeminiTriggerDiagnostic(error: unknown): GeminiTriggerDiagnostic | undefined {
  try {
    if (!(error instanceof Error)) return;
    const value = Object.getOwnPropertyDescriptor(error, 'geminiTriggerDiagnostic')?.value;
    if (typeof value === 'string' && triggerDiagnostics.includes(value as GeminiTriggerDiagnostic))
      return value as GeminiTriggerDiagnostic;
  } catch {}
}
