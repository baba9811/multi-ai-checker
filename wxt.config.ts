import { defineConfig } from 'wxt';
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'CrossCheck — Multi AI Checker',
    description:
      'ChatGPT·Claude·Gemini 대화와 첨부파일을 비교·교차 검토하고, 원래 대화에서 종합 답변을 받으세요.',
    minimum_chrome_version: '120',
    icons: {
      16: 'icons/16.png',
      32: 'icons/32.png',
      48: 'icons/48.png',
      128: 'icons/128.png',
    },
    permissions: ['sidePanel', 'storage', 'scripting', 'activeTab'],
    optional_host_permissions: [
      'https://chatgpt.com/*',
      'https://claude.ai/*',
      'https://gemini.google.com/*',
    ],
    action: { default_title: 'CrossCheck 열기' },
    side_panel: { default_path: 'sidepanel.html' },
    content_security_policy: {
      extension_pages:
        "default-src 'none'; script-src 'self'; object-src 'none'; connect-src 'none'; img-src 'self' data:; style-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    },
  },
});
