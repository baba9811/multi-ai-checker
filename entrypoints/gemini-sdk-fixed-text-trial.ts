import { defineUnlistedScript } from 'wxt/utils/define-unlisted-script';
import { createGeminiTrialControl } from '../src/infrastructure/providers/gemini/trial-control';
import { runGeminiSdkFixedTextTrial } from '../src/infrastructure/providers/gemini/sdk-fixed-text-trial';

export default defineUnlistedScript(() => {
  const marker = '__crosscheckGeminiTrialInstalled';
  if (
    window.top !== window ||
    location.href !== 'https://gemini.google.com/app' ||
    Object.getOwnPropertyDescriptor(globalThis, marker)
  )
    throw new Error('Gemini trial bootstrap failed.', { cause: 'page' });
  Object.defineProperty(globalThis, marker, { value: true });
  const handle = '__crosscheckGeminiTrial_' + crypto.randomUUID().replaceAll('-', '');
  let touched = false;
  let leased = false;
  let ownedPage = () => location.href === 'https://gemini.google.com/app';
  const operation = createGeminiTrialControl((signal) =>
    runGeminiSdkFixedTextTrial(
      signal,
      () =>
        operation.current() &&
        !touched &&
        Object.getOwnPropertyDescriptor(globalThis, handle)?.value === registry,
      (check) => {
        ownedPage = check;
      },
    ),
  );
  const samePage = () => {
    try {
      return !touched && ownedPage();
    } catch {
      return false;
    }
  };
  const registry = Object.freeze({
    terminalError(capability: unknown) {
      return operation.registry.terminalError(capability);
    },
    lease(capability: unknown) {
      if (capability !== operation.bootstrap.capability)
        return operation.registry.lease(capability);
      if (!leased && !samePage()) {
        operation.registry.stop(capability);
        return { status: 'error', reason: 'page' } as const;
      }
      leased = true;
      return operation.registry.lease(capability);
    },
    stop(capability: unknown) {
      if (capability !== operation.bootstrap.capability) return false;
      operation.registry.stop(capability);
      return samePage();
    },
  });
  Object.defineProperty(globalThis, handle, { value: registry });
  const stop = () => {
    touched = true;
    operation.registry.stop(operation.bootstrap.capability);
  };
  document.addEventListener('input', stop, true);
  for (const type of ['pointerdown', 'keydown', 'click'])
    document.addEventListener(
      type,
      (event) => {
        if (event.isTrusted) stop();
      },
      true,
    );
  for (const type of ['pagehide', 'popstate', 'hashchange']) window.addEventListener(type, stop);
  return Object.freeze({ handle, ...operation.bootstrap });
});
