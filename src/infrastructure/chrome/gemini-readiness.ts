import {
  GeminiReadinessProgress,
  GeminiReadinessRecord,
  type GeminiReadinessResult,
} from '../../application/gemini-readiness';
import { LIMITS } from '../../domains/crosscheck/model';
import { providers, type Binding } from '../../domains/providers/model';
import { prepareGeminiReadiness, rpc } from './provider-client';

const storageKey = 'crosscheck.gemini-readiness.v1';
const failure = 'Gemini 준비 상태를 확인하지 못했습니다. 요청은 보내지 않았습니다.';
let running = false;
export async function readGeminiReadiness(): Promise<GeminiReadinessRecord | undefined> {
  const raw = (await chrome.storage.session.get(storageKey))[storageKey];
  if (!raw) return;
  const record = GeminiReadinessRecord.parse(raw);
  return record.status === 'pending' ? { ...record, status: 'uncertain' } : record;
}
export async function checkGeminiReadiness(signal: AbortSignal): Promise<GeminiReadinessResult> {
  if (running) throw new Error('이미 Gemini 준비 상태를 확인하고 있습니다.');
  running = true;
  const id = crypto.randomUUID();
  let target: Binding | undefined;
  let persisted = false;
  let reason: GeminiReadinessProgress['reason'];
  const cancel = () => {
    if (target) void rpc(target.tabId, { type: 'cancelGeminiReadiness', id }).catch(() => {});
  };
  try {
    // Keep the site's permission request in the initiating user gesture.
    const access = chrome.permissions.request({ origins: [`${providers.gemini.origin}/*`] });
    if (!(await access)) throw new Error(failure);
    signal.throwIfAborted();
    await chrome.storage.session.set({ [storageKey]: { id, status: 'pending' } });
    persisted = true;
    signal.throwIfAborted();
    target = await prepareGeminiReadiness(signal);
    signal.throwIfAborted();
    signal.addEventListener('abort', cancel, { once: true });
    await rpc(target.tabId, {
      type: 'startGeminiReadiness',
      id,
      documentId: target.documentId,
      url: target.url,
    });
    const deadline = Date.now() + LIMITS.timeoutMs;
    while (Date.now() < deadline) {
      signal.throwIfAborted();
      const progress = GeminiReadinessProgress.parse(
        await rpc(target.tabId, { type: 'pollGeminiReadiness', id }),
      );
      signal.throwIfAborted();
      if (progress.status === 'done') {
        if (!progress.result) throw new Error(failure);
        await chrome.storage.session.set({ [storageKey]: { id, status: 'done' } });
        signal.throwIfAborted();
        return progress.result;
      }
      if (progress.status === 'error') {
        reason = progress.reason;
        throw new Error(failure);
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    throw new Error(failure);
  } catch {
    cancel();
    if (persisted)
      await chrome.storage.session
        .set({ [storageKey]: { id, status: 'uncertain' } })
        .catch(() => {});
    throw new Error(failure, { cause: reason });
  } finally {
    signal.removeEventListener('abort', cancel);
    running = false;
  }
}
