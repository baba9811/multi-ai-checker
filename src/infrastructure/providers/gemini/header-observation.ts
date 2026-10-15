import type {
  GeminiHeaderObservationOutcome,
  GeminiHeaderObservationProgress,
} from '../../../application/gemini-readiness';
import { composer, draftText, isBusy, selectors } from '../dom';
import { hasAttachments } from '../attachments';
import { inspectGeminiHeader } from '../models';

/** Page-local DOM evidence only. No menu, transcript, private runtime or request reads. */
export function createGeminiHeaderObservation(signal: AbortSignal, unchanged = () => true) {
  const originalDocument = document;
  let visibility: 'hidden' | 'visible' | 'unobserved' = 'unobserved';
  try {
    const initial = document.visibilityState;
    if (initial === 'hidden' || initial === 'visible') visibility = initial;
  } catch {
    /* Unsupported DOM projection remains unobserved. */
  }
  let progress: GeminiHeaderObservationProgress = { status: 'pending', visibility };
  let touched = false;
  let unsafe = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const preparedAt = performance.now();
  let origin: number | undefined;
  let polledAt = preparedAt;
  let earlyNegative = false;
  let lateNegative = false;
  const cleanups: Array<() => void> = [];
  const finish = (outcome: GeminiHeaderObservationOutcome) => {
    if (progress.status !== 'pending') return;
    unsafe ||= ['page', 'not-empty', 'unsupported', 'visibility-changed'].includes(outcome);
    progress = { status: 'done', outcome, visibility };
    clearTimeout(timer);
    timer = undefined;
    for (const cleanup of cleanups) cleanup();
    cleanups.length = 0;
  };
  const listen = (target: EventTarget, type: string, listener: EventListener) => {
    target.addEventListener(type, listener, true);
    cleanups.push(() => target.removeEventListener(type, listener, true));
  };
  const context = (): GeminiHeaderObservationOutcome | undefined => {
    if (signal.aborted || touched || !unchanged()) return 'interrupted';
    if (
      document !== originalDocument ||
      window.top !== window ||
      location.href !== 'https://gemini.google.com/app'
    )
      return 'page';
    if (visibility === 'unobserved') return 'unsupported';
    if (document.visibilityState !== visibility) return 'visibility-changed';
  };
  const empty = () => {
    const input = composer('gemini');
    if (
      document.querySelector(selectors.gemini.user) ||
      document.querySelector(selectors.gemini.assistant) ||
      isBusy('gemini') ||
      (input && (draftText(input) || hasAttachments('gemini', input)))
    )
      return 'not-empty';
    return input ? undefined : 'missing';
  };
  listen(document, 'visibilitychange', () => finish('visibility-changed'));
  for (const type of [
    'beforeinput',
    'input',
    'change',
    'paste',
    'drop',
    'pointerdown',
    'keydown',
    'click',
  ])
    listen(document, type, (event) => {
      if (event.isTrusted) {
        touched = true;
        finish('interrupted');
      }
    });
  for (const type of ['pagehide', 'popstate', 'hashchange'])
    listen(window, type, () => {
      touched = true;
      finish('page');
    });
  listen(signal, 'abort', () => finish('interrupted'));
  const sample = () => {
    timer = undefined;
    if (progress.status !== 'pending') return;
    try {
      const invalid = context();
      if (invalid) return finish(invalid);
      const now = performance.now();
      if (origin !== undefined && now - origin >= 15000)
        return finish(earlyNegative && lateNegative ? 'not-observed' : 'inconclusive');
      if (now - polledAt >= 15000) return finish('interrupted');
      const state = empty();
      if (state === 'not-empty') return finish(state);
      if (state === 'missing') {
        if (origin !== undefined) return finish('page');
        if (now - preparedAt >= 2500) return finish('inconclusive');
        timer = setTimeout(sample, 150);
        return;
      }
      origin ??= performance.now();
      const elapsed = performance.now() - origin;
      if (elapsed >= 15000)
        return finish(earlyNegative && lateNegative ? 'not-observed' : 'inconclusive');
      // Recheck after DOM getters, which may synchronously change the context.
      const changed = context();
      if (changed) return finish(changed);
      if (performance.now() - origin >= 15000)
        return finish(earlyNegative && lateNegative ? 'not-observed' : 'inconclusive');
      const eligible = inspectGeminiHeader();
      const after = context();
      if (after) return finish(after);
      const observedAt = performance.now() - origin;
      if (observedAt >= 15000)
        return finish(earlyNegative && lateNegative ? 'not-observed' : 'inconclusive');
      if (eligible)
        return finish(
          observedAt < 2500
            ? 'ready-early'
            : earlyNegative && lateNegative
              ? 'ready-late'
              : 'inconclusive',
        );
      if (observedAt < 2500) earlyNegative = true;
      else lateNegative = true;
      timer = setTimeout(sample, Math.min(80, 15000 - observedAt));
    } catch {
      finish('unsupported');
    }
  };
  sample();
  return {
    poll(): GeminiHeaderObservationProgress {
      if (progress.status === 'pending') polledAt = performance.now();
      return { ...progress };
    },
    cancel() {
      finish('interrupted');
      try {
        return { safeToRetire: !unsafe && !context() && empty() === undefined };
      } catch {
        return { safeToRetire: false };
      }
    },
  };
}
