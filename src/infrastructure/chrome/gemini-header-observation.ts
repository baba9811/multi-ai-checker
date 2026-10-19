import { z } from 'zod';
import {
  GeminiHeaderObservationProgress,
  GeminiHeaderObservationResult,
  type GeminiHeaderObservationOutcome,
} from '../../application/gemini-readiness';
import { LIMITS } from '../../domains/crosscheck/model';
import { providers } from '../../domains/providers/model';
import { prepareGeminiHeaderObservation, rpc } from './provider-client';

let running = false;
const Home = providers.gemini.home;
const Identity = z.object({ documentId: z.string().min(1).max(100) }).strict();
const Retirement = z.object({ safeToRetire: z.boolean() }).strict();
/** One explicit DOM-only intent; its result and transport ownership are never persisted. */
export async function observeGeminiHeaderReadiness(
  signal: AbortSignal,
): Promise<GeminiHeaderObservationResult> {
  if (running) throw new Error('이미 Gemini 버튼을 관찰하고 있습니다.');
  running = true;
  const id = crypto.randomUUID();
  const controller = new AbortController();
  let tabId: number | undefined;
  let documentId: string | undefined;
  let touched = false;
  let loaded = false;
  let outcome: GeminiHeaderObservationOutcome = 'unsupported';
  let visibility: GeminiHeaderObservationResult['visibility'] = 'unobserved';
  let retirement: 'closed' | 'retained' = 'retained';
  const earlyTouched = new Set<number>();
  const cancel = () => {
    controller.abort();
    if (tabId !== undefined && documentId)
      void rpc(tabId, { type: 'cancelGeminiHeaderObservation', id, documentId }).catch(() => {});
  };
  const touch = (changedId: number) => {
    if (tabId === undefined) earlyTouched.add(changedId);
    else if (changedId === tabId) {
      touched = true;
      cancel();
    }
  };
  const activated = (info: chrome.tabs.OnActivatedInfo) => touch(info.tabId);
  const removed = (removedId: number) => touch(removedId);
  const updated = (changedId: number, info: chrome.tabs.OnUpdatedInfo) => {
    if ((info.url !== undefined && info.url !== Home) || (loaded && info.status === 'loading'))
      touch(changedId);
  };
  chrome.tabs.onActivated.addListener(activated);
  chrome.tabs.onRemoved.addListener(removed);
  chrome.tabs.onUpdated.addListener(updated);
  signal.addEventListener('abort', cancel, { once: true });
  try {
    if (!(await chrome.permissions.contains({ origins: [`${providers.gemini.origin}/*`] })))
      throw new Error('Gemini 연결 권한이 필요합니다. 연결 버튼으로 먼저 허용해주세요.');
    signal.throwIfAborted();
    await prepareGeminiHeaderObservation(
      controller.signal,
      (allocated) => {
        tabId = allocated;
        touched ||= earlyTouched.has(allocated);
        earlyTouched.clear();
        if (touched || signal.aborted) cancel();
      },
      () => {
        loaded = true;
      },
    );
    signal.throwIfAborted();
    controller.signal.throwIfAborted();
    const before = await chrome.tabs.get(tabId!);
    controller.signal.throwIfAborted();
    if (before.active || before.url !== Home) {
      touched = true;
      throw new Error('page');
    }
    const identity = Identity.parse(
      await rpc(tabId!, { type: 'startGeminiHeaderObservation', id }),
    );
    documentId = identity.documentId;
    controller.signal.throwIfAborted();
    // The bridge independently enforces its absolute structural window.
    const end = performance.now() + LIMITS.timeoutMs;
    while (performance.now() < end) {
      controller.signal.throwIfAborted();
      const progress = GeminiHeaderObservationProgress.parse(
        await rpc(tabId!, { type: 'pollGeminiHeaderObservation', id, documentId }),
      );
      visibility = progress.visibility;
      controller.signal.throwIfAborted();
      if (progress.status === 'done') {
        outcome = progress.outcome;
        break;
      }
      await new Promise<void>((resolve) => {
        const done = () => {
          clearTimeout(timer);
          controller.signal.removeEventListener('abort', done);
          resolve();
        };
        const timer = setTimeout(done, 500);
        controller.signal.addEventListener('abort', done, { once: true });
        if (controller.signal.aborted) done();
      });
      controller.signal.throwIfAborted();
    }
  } catch (failure) {
    outcome = touched
      ? 'page'
      : signal.aborted || controller.signal.aborted
        ? 'interrupted'
        : 'unsupported';
    if (tabId === undefined && !signal.aborted) throw failure;
  } finally {
    // Cancellation stops the observer; retirement requires two fresh document-bound checks.
    if (tabId !== undefined && documentId) {
      try {
        const safe = async () => {
          if (touched) return false;
          const tab = await chrome.tabs.get(tabId!);
          if (touched || tab.active || tab.url !== Home || tab.pendingUrl) return false;
          const result = Retirement.parse(
            await rpc(tabId!, { type: 'cancelGeminiHeaderObservation', id, documentId }),
          );
          return !touched && result.safeToRetire;
        };
        if ((await safe()) && (await safe()) && !touched) {
          const tab = await chrome.tabs.get(tabId);
          if (!touched && !tab.active && tab.url === Home && !tab.pendingUrl) {
            await chrome.tabs.remove(tabId);
            retirement = 'closed';
          }
        }
      } catch {
        /* Uncertain cleanup retains the owned page. */
      }
    }
    signal.removeEventListener('abort', cancel);
    chrome.tabs.onActivated.removeListener(activated);
    chrome.tabs.onRemoved.removeListener(removed);
    chrome.tabs.onUpdated.removeListener(updated);
    running = false;
  }
  return GeminiHeaderObservationResult.parse({ outcome, retirement, visibility });
}
