import {
  GeminiFixedTextTrialReason,
  GeminiFixedTextTrialResult,
  type GeminiFixedTextTrialProgress,
} from '../../../application/gemini-fixed-text-trial';
import { LIMITS } from '../../../domains/crosscheck/model';

export function createGeminiTrialControl(
  start: (signal: AbortSignal) => Promise<GeminiFixedTextTrialResult>,
) {
  const capability = Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
  const controller = new AbortController();
  const interrupted = Object.freeze({ status: 'error', reason: 'interrupted' } as const);
  let progress: GeminiFixedTextTrialProgress = Object.freeze({ status: 'pending' });
  let started = false;
  let closed = false;
  const created = performance.now();
  let leaseDeadline = created + 15000;
  const deadline = created + LIMITS.timeoutMs;
  let leaseTimer = setTimeout(stop, 15000);
  const absoluteTimer = setTimeout(stop, LIMITS.timeoutMs);
  window.addEventListener('pagehide', stop);

  function finish(next: GeminiFixedTextTrialProgress) {
    if (closed) return;
    closed = true;
    progress = Object.freeze(next);
    clearTimeout(leaseTimer);
    clearTimeout(absoluteTimer);
    window.removeEventListener('pagehide', stop);
    controller.abort();
  }
  function stop() {
    finish(interrupted);
  }
  function active() {
    if (!closed && (performance.now() >= leaseDeadline || performance.now() >= deadline)) stop();
    return !closed;
  }
  function failure(error: unknown): GeminiFixedTextTrialReason {
    try {
      const cause =
        error && typeof error === 'object'
          ? Object.getOwnPropertyDescriptor(error, 'cause')
          : undefined;
      const parsed = GeminiFixedTextTrialReason.safeParse(
        cause && 'value' in cause ? cause.value : undefined,
      );
      return parsed.success ? parsed.data : 'response';
    } catch {
      return 'response';
    }
  }
  async function run() {
    if (!active()) return;
    try {
      const output: unknown = await start(controller.signal);
      if (!active()) return;
      if (!output || typeof output !== 'object' || Array.isArray(output)) throw new Error();
      const fields = Object.getOwnPropertyDescriptors(output);
      if (
        Reflect.ownKeys(fields).length !== 2 ||
        !fields.model ||
        !('value' in fields.model) ||
        !fields.answer ||
        !('value' in fields.answer)
      )
        throw new Error();
      const result = GeminiFixedTextTrialResult.parse({
        model: fields.model.value,
        answer: fields.answer.value,
      });
      finish({ status: 'done', result: Object.freeze(result) });
    } catch (error) {
      if (active()) finish({ status: 'error', reason: failure(error) });
    }
  }

  return Object.freeze({
    current: () => active() && started,
    bootstrap: Object.freeze({ capability }),
    registry: Object.freeze({
      terminalError(received: unknown): GeminiFixedTextTrialReason | null {
        if (typeof received !== 'string' || received !== capability || !started || !closed)
          return null;
        return progress.status === 'error' ? progress.reason : null;
      },
      lease(received: unknown): GeminiFixedTextTrialProgress {
        if (typeof received !== 'string' || received !== capability) return interrupted;
        if (!active()) return progress;
        leaseDeadline = performance.now() + 15000;
        clearTimeout(leaseTimer);
        leaseTimer = setTimeout(stop, 15000);
        if (!started) {
          started = true;
          void Promise.resolve().then(run);
        }
        return progress;
      },
      stop(received: unknown) {
        if (typeof received === 'string' && received === capability) stop();
      },
    }),
  });
}
