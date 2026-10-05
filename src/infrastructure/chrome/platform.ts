import { z } from 'zod';
import type { Platform } from '../../application/ports';
import { providers } from '../../domains/providers/model';
import { extensionStatus, watchExtensionUpdate, openExtensionManager } from './updates';
import {
  connect,
  reveal,
  refreshConnection,
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
  extensionStatus,
  watchExtensionUpdate,
  openExtensionManager,
  async requestAccess(ids) {
    if (
      !(await chrome.permissions.request({ origins: ids.map((id) => `${providers[id].origin}/*`) }))
    )
      throw new Error('선택한 AI 사이트에 연결 권한이 필요합니다.');
  },
  connect,
  refreshConnection,
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
  reveal,
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
