import { z } from 'zod';
import type { Platform } from '../../application/ports';
import { providers } from '../../domains/providers/model';
import {
  connect,
  currentConversation,
  preparePeer,
  models,
  inspect,
  sendAndCollect,
} from './provider-client';

const storageKey = 'crosscheck.workspace.v1';
const Stored = z.object({
  run: z.unknown().optional(),
  bindings: z.record(z.string(), z.unknown()).optional(),
});
export const chromePlatform: Platform = {
  connect,
  currentConversation,
  preparePeer,
  models,
  watchActiveTab(changed) {
    const updated = (_id: number, info: chrome.tabs.OnUpdatedInfo, tab: chrome.tabs.Tab) => {
      if (tab.active && (info.url || info.status === 'complete')) changed();
    };
    chrome.tabs.onActivated.addListener(changed);
    chrome.tabs.onUpdated.addListener(updated);
    return () => {
      chrome.tabs.onActivated.removeListener(changed);
      chrome.tabs.onUpdated.removeListener(updated);
    };
  },
  async reveal(binding) {
    const tab = await chrome.tabs.get(binding.tabId);
    await chrome.windows.update(tab.windowId, { focused: true });
    await chrome.tabs.update(binding.tabId, { active: true });
  },
  inspect,
  sendAndCollect,
  async openProvider(provider) {
    await chrome.tabs.create({ url: providers[provider].home });
  },
  async disconnect(provider) {
    await chrome.permissions.remove({ origins: [`${providers[provider].origin}/*`] });
  },
  async load() {
    const value = (await chrome.storage.session.get(storageKey))[storageKey];
    return value ? Stored.parse(value) : undefined;
  },
  async save(workspace) {
    await chrome.storage.session.set({ [storageKey]: workspace });
  },
};
