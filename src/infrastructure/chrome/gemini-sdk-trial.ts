import { z } from 'zod';
import {
  GeminiFixedTextTrialBootstrap,
  GeminiFixedTextTrialProgress,
  GeminiFixedTextTrialReason,
  GeminiFixedTextTrialRecord,
  GeminiFixedTextTrialReservation,
  type GeminiFixedTextTrialResult,
} from '../../application/gemini-fixed-text-trial';
import { LIMITS } from '../../domains/crosscheck/model';
import { providers, type Binding } from '../../domains/providers/model';
import { inspect, prepareGeminiReadiness, rpc } from './provider-client';

const key = 'crosscheck.gemini-sdk-trial.v1';
const failure =
  'Gemini 응답 시험을 완료하지 못했습니다. 전송됐을 수 있는 요청은 자동 재전송하지 않습니다.';
let running = false;
export async function readGeminiSdkTrial() {
  const raw = (await chrome.storage.session.get(key))[key];
  if (!raw) return;
  const record = GeminiFixedTextTrialRecord.parse(raw);
  return record.status === 'pending' ? { ...record, status: 'uncertain' as const } : record;
}

// Serialized MAIN control accepts only this operation's opaque capability, never a request.
function control(
  handle: string,
  capability: string,
  mode: boolean | 'terminal-error' = false,
): unknown {
  if (window.top !== window || location.origin !== 'https://gemini.google.com') return false;
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, handle);
  if (!descriptor || !('value' in descriptor) || descriptor.configurable || descriptor.writable)
    return false;
  const registry = descriptor.value;
  if (!registry || typeof registry !== 'object' || !Object.isFrozen(registry)) return false;
  const method = Object.getOwnPropertyDescriptor(
    registry,
    mode === 'terminal-error' ? 'terminalError' : mode ? 'stop' : 'lease',
  );
  if (!method || !('value' in method) || typeof method.value !== 'function') return false;
  const progress = Reflect.apply(method.value, registry, [capability]);
  return mode === true ? progress === true : progress;
}
export async function startGeminiSdkTrial(
  signal: AbortSignal,
): Promise<GeminiFixedTextTrialResult> {
  if (running) throw new Error(failure, { cause: 'interrupted' });
  running = true;
  const id = crypto.randomUUID();
  let target: Binding | undefined;
  let allocated: number | undefined;
  let nativeDocument: string | undefined;
  let bootstrap: GeminiFixedTextTrialBootstrap | undefined;
  let leased = false;
  let persisted = false;
  let released = false;
  let removed = false;
  let touched = false;
  let result: GeminiFixedTextTrialResult | undefined;
  let reason: z.infer<typeof GeminiFixedTextTrialReason> = 'page';
  const onRemoved = (tabId: number) => {
    if (tabId === allocated) removed = true;
  };
  const onActivated = ({ tabId }: { tabId: number }) => {
    if (tabId === allocated) touched = true;
  };
  function single<T extends z.ZodType>(schema: T, values: unknown): z.infer<T> {
    const [injection] = z
      .array(
        z
          .object({
            frameId: z.literal(0),
            documentId: z.literal(nativeDocument!),
            result: z.unknown(),
          })
          .strict(),
      )
      .length(1)
      .parse(values);
    return schema.parse(injection!.result);
  }
  async function stopMain() {
    if (!allocated || !nativeDocument || !bootstrap || removed) return;
    const values = await chrome.scripting.executeScript({
      target: { tabId: allocated, documentIds: [nativeDocument] },
      world: 'MAIN',
      func: control,
      args: [bootstrap.handle, bootstrap.capability, true],
    });
    single(z.literal(true), values);
  }
  const cancel = () => {
    void stopMain().catch(() => {});
    if (target)
      void rpc(target.tabId, {
        type: 'cancelGeminiSdkTrial',
        id,
        documentId: target.documentId,
      }).catch(() => {});
  };
  async function reservation() {
    if (!target || removed) throw new Error();
    return GeminiFixedTextTrialReservation.parse(
      await rpc(target.tabId, {
        type: 'checkGeminiSdkTrial',
        id,
        documentId: target.documentId,
      }),
    );
  }
  async function retire(): Promise<boolean> {
    if (!allocated || !nativeDocument || !bootstrap) return false;
    if (removed) return true;
    try {
      await stopMain();
      if (!target || touched || !(await reservation()).safeToRetire) return false;
      const tab = await chrome.tabs.get(allocated);
      if (tab.active || touched) return false;
      if (!(await reservation()).safeToRetire || touched) return false;
      await stopMain();
      if (touched) return false;
      await chrome.tabs.remove(allocated);
      return removed;
    } catch {
      return removed;
    }
  }
  function releaseListeners(): boolean {
    if (released) return true;
    released = true;
    let clean = true;
    for (const release of [
      () => signal.removeEventListener('abort', cancel),
      () => chrome.tabs.onRemoved.removeListener(onRemoved),
      () => chrome.tabs.onActivated.removeListener(onActivated),
    ]) {
      try {
        release();
      } catch {
        clean = false;
      }
    }
    return clean;
  }
  try {
    chrome.tabs.onRemoved.addListener(onRemoved);
    chrome.tabs.onActivated.addListener(onActivated);
    signal.addEventListener('abort', cancel, { once: true });
    try {
      // Keep permission in the initiating gesture; intent precedes allocation/bootstrap.
      const access = chrome.permissions.request({ origins: [`${providers.gemini.origin}/*`] });
      if (!(await access)) throw new Error();
      signal.throwIfAborted();
      await chrome.storage.session.set({ [key]: { id, status: 'pending' } });
      persisted = true;
      signal.throwIfAborted();
      target = await prepareGeminiReadiness(signal, (tabId) => {
        allocated = tabId;
      });
      signal.throwIfAborted();
      await inspect(target);
      signal.throwIfAborted();
      z.literal(true).parse(
        await rpc(target.tabId, {
          type: 'reserveGeminiSdkTrial',
          id,
          documentId: target.documentId,
          url: target.url,
        }),
      );
      signal.throwIfAborted();
      const [identity] = z
        .array(
          z
            .object({
              frameId: z.literal(0),
              documentId: z.string().min(1).max(128),
              result: z.literal(true),
            })
            .strict(),
        )
        .length(1)
        .parse(
          await chrome.scripting.executeScript({
            target: { tabId: target.tabId, frameIds: [0] },
            world: 'ISOLATED',
            func: () => window.top === window && location.href === 'https://gemini.google.com/app',
          }),
        );
      nativeDocument = identity!.documentId;
      signal.throwIfAborted();
      if (!(await reservation()).ready || touched) throw new Error();
      signal.throwIfAborted();
      reason = 'client';
      bootstrap = single(
        GeminiFixedTextTrialBootstrap,
        await chrome.scripting.executeScript({
          target: { tabId: target.tabId, documentIds: [nativeDocument] },
          world: 'MAIN',
          files: ['gemini-sdk-fixed-text-trial.js'],
        }),
      );
      signal.throwIfAborted();
      const deadline = Date.now() + LIMITS.timeoutMs;
      while (Date.now() < deadline) {
        reason = 'page';
        signal.throwIfAborted();
        const reserved = await reservation();
        signal.throwIfAborted();
        if (!reserved.ready || touched || removed) {
          if (!reserved.ready && leased && !touched && !removed) {
            try {
              const terminal = single(
                GeminiFixedTextTrialReason.nullable(),
                await chrome.scripting.executeScript({
                  target: { tabId: target.tabId, documentIds: [nativeDocument] },
                  world: 'MAIN',
                  func: control,
                  args: [bootstrap.handle, bootstrap.capability, 'terminal-error'],
                }),
              );
              if (!touched && !removed && terminal !== null) reason = terminal;
            } catch {}
          }
          signal.throwIfAborted();
          throw new Error();
        }
        signal.throwIfAborted();
        const progress = single(
          GeminiFixedTextTrialProgress,
          await chrome.scripting.executeScript({
            target: { tabId: target.tabId, documentIds: [nativeDocument] },
            world: 'MAIN',
            func: control,
            args: [bootstrap.handle, bootstrap.capability],
          }),
        );
        leased = true;
        signal.throwIfAborted();
        if (progress.status === 'error') {
          reason = progress.reason;
          throw new Error();
        }
        if (progress.status === 'done') {
          result = progress.result;
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      if (!result) reason = 'interrupted';
    } catch {
      if (signal.aborted) reason = 'interrupted';
    }
    const retired = await retire();
    if (!releaseListeners()) {
      reason = 'cleanup';
      result = undefined;
    }
    if (!result || !retired || signal.aborted) {
      if (result && !retired) reason = 'cleanup';
      if (signal.aborted) reason = 'interrupted';
      if (persisted)
        await chrome.storage.session.set({ [key]: { id, status: 'uncertain' } }).catch(() => {});
      throw new Error(failure, { cause: reason });
    }
    try {
      await chrome.storage.session.set({ [key]: { id, status: 'done' } });
      signal.throwIfAborted();
      return result;
    } catch {
      await chrome.storage.session.set({ [key]: { id, status: 'uncertain' } }).catch(() => {});
      throw new Error(failure, { cause: 'interrupted' });
    }
  } catch (error) {
    const cause =
      error instanceof Error ? Object.getOwnPropertyDescriptor(error, 'cause')?.value : undefined;
    const parsed = GeminiFixedTextTrialReason.safeParse(cause);
    if (persisted)
      await chrome.storage.session.set({ [key]: { id, status: 'uncertain' } }).catch(() => {});
    throw new Error(failure, { cause: parsed.success ? parsed.data : reason });
  } finally {
    releaseListeners();
    running = false;
  }
}
