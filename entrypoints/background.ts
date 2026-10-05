import { defineBackground } from 'wxt/utils/define-background';
import { registerUpdateNotice } from '../src/infrastructure/chrome/updates';
export default defineBackground(() => {
  registerUpdateNotice();
  void chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  void chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' });
});
