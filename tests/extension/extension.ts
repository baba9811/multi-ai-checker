import { test as base, chromium, type BrowserContext, type Page } from '@playwright/test';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

export const test = base.extend<{
  extension: { context: BrowserContext; panel: Page; id: string };
}>({
  extension: async ({}, use) => {
    // Respect managed browser policy. Do not disable it or quietly skip this suite.
    if (process.env.CHROMIUM_PATH === '/usr/bin/chromium' || !process.env.CHROMIUM_PATH) {
      const policy = await readFile('/etc/chromium/policies/managed/extensions.json', 'utf8').catch(
        () => '{}',
      );
      if (JSON.parse(policy).ExtensionInstallBlocklist?.includes('*'))
        throw new Error(
          'ENVIRONMENT BLOCKER: managed Chromium blocks unpacked extensions. Run this suite on an unmanaged test machine; do not change policy.',
        );
    }
    const userDataDir = await mkdtemp(path.join(tmpdir(), 'crosscheck-e2e-'));
    const extensionPath = path.resolve('.output/chrome-mv3');
    const context = await chromium.launchPersistentContext(userDataDir, {
      executablePath: process.env.CHROMIUM_PATH || chromium.executablePath(),
      headless: true,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-sandbox',
      ],
      viewport: { width: 440, height: 960 },
    });
    try {
      const worker =
        context.serviceWorkers()[0] ??
        (await context.waitForEvent('serviceworker', { timeout: 15000 }));
      const id = new URL(worker.url()).host;
      const panel = await context.newPage();
      await panel.goto(`chrome-extension://${id}/sidepanel.html`);
      await use({ context, panel, id });
    } finally {
      await context.close();
      await rm(userDataDir, { recursive: true, force: true });
    }
  },
});
export { expect } from '@playwright/test';
