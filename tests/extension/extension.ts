import { test as base, chromium, type BrowserContext, type Page } from '@playwright/test';
import { cp, mkdtemp, rm, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

export const test = base.extend<{
  extension: { context: BrowserContext; panel: Page; id: string };
  syntheticClaudePermission: boolean;
}>({
  syntheticClaudePermission: [false, { option: true }],
  extension: async ({ syntheticClaudePermission }, use) => {
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
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'crosscheck-e2e-'));
    let context: BrowserContext | undefined;
    try {
      let extensionPath = path.resolve('.output/chrome-mv3');
      if (syntheticClaudePermission) {
        // Tests activation after a grant, not the browser's interactive permission prompt.
        // Only this disposable copy changes; production artifacts and policy stay untouched.
        const copy = path.join(temporaryRoot, 'extension');
        await cp(extensionPath, copy, { recursive: true });
        extensionPath = copy;
        const manifestPath = path.join(copy, 'manifest.json');
        const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
        manifest.host_permissions = ['https://claude.ai/*'];
        manifest.optional_host_permissions = manifest.optional_host_permissions.filter(
          (origin: string) => origin !== 'https://claude.ai/*',
        );
        await writeFile(manifestPath, JSON.stringify(manifest));
      }
      context = await chromium.launchPersistentContext(path.join(temporaryRoot, 'profile'), {
        executablePath: process.env.CHROMIUM_PATH || chromium.executablePath(),
        headless: true,
        args: [
          `--disable-extensions-except=${extensionPath}`,
          `--load-extension=${extensionPath}`,
          '--no-sandbox',
        ],
        viewport: { width: 440, height: 960 },
      });
      const worker =
        context.serviceWorkers()[0] ??
        (await context.waitForEvent('serviceworker', { timeout: 15000 }));
      const id = new URL(worker.url()).host;
      const panel = await context.newPage();
      await panel.goto(`chrome-extension://${id}/sidepanel.html`);
      await use({ context, panel, id });
    } finally {
      await context?.close();
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  },
});
export { expect } from '@playwright/test';
