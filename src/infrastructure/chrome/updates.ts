import type { ExtensionStatus } from '../../application/ports';

const pendingKey = 'crosscheck.update.pending.v1';

/** Passive lifecycle notice only: leave installation and worker lifetime to Chrome. */
export function registerUpdateNotice() {
  chrome.runtime.onUpdateAvailable.addListener(({ version }) => {
    void chrome.storage.session.set({ [pendingKey]: version });
  });
}

export async function extensionStatus(): Promise<ExtensionStatus> {
  const manifest = chrome.runtime.getManifest();
  const pending = (await chrome.storage.session.get(pendingKey))[pendingKey];
  return {
    version: manifest.version,
    automaticUpdates: Boolean(manifest.update_url),
    ...(typeof pending === 'string' && pending !== manifest.version
      ? { pendingVersion: pending }
      : {}),
  };
}

export function watchExtensionUpdate(available: (version: string) => void) {
  const listener = ({ version }: { version: string }) => available(version);
  chrome.runtime.onUpdateAvailable.addListener(listener);
  return () => chrome.runtime.onUpdateAvailable.removeListener(listener);
}

export async function openExtensionManager() {
  await chrome.tabs.create({ url: `chrome://extensions/?id=${chrome.runtime.id}` });
}
