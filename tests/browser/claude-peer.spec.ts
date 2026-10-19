import { installCollectorFixture } from '../fixtures/chrome/collector';
import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import { claudeProbeFixture } from '../fixtures/providers/claude-probe';

async function command(page: Page, message: object) {
  return page.evaluate(
    (message) =>
      new Promise<{ ok: boolean; data?: any; error?: string }>((resolve) => {
        (window as any).__bridgeHandler(
          message,
          { id: 'fixture', url: 'chrome-extension://fixture/sidepanel.html' },
          resolve,
        );
      }),
    message,
  );
}
async function setup(page: Page) {
  const fixture = await claudeProbeFixture(page);
  await page.goto('https://claude.ai/new');
  await page.evaluate(() => {
    (window as any).chrome = {
      runtime: {
        id: 'fixture',
        getURL: (s: string) => `chrome-extension://fixture/${s}`,
        onMessage: {
          addListener: (h: unknown) => {
            (window as any).__bridgeHandler = h;
          },
        },
      },
    };
  });
  await page.evaluate(installCollectorFixture);
  await page.addScriptTag({ path: path.resolve('.output/chrome-mv3/bridge.js') });
  const snapshot = (await command(page, { type: 'snapshot' })).data;
  return { ...fixture, target: { documentId: snapshot.documentId, url: snapshot.url } };
}
test('peer collect and review stay bound without DOM submit, repeated send or lost-thread fallback', async ({
  page,
  context,
}) => {
  const { target, requests } = await setup(page);
  const foreground = await context.newPage();
  await foreground.goto('about:blank');
  await foreground.bringToFront();
  const threadId = crypto.randomUUID();
  const send = { type: 'sendClaudePeer', threadId, ...target, attachments: [], approved: [] };
  const collect = {
    ...send,
    id: 'peer-first',
    stage: 'collect',
    prompt: 'Full synthetic imported question and answer',
  };
  expect((await command(page, collect)).ok).toBe(true);
  await expect
    .poll(async () => (await command(page, { type: 'poll', id: 'peer-first' })).data?.status)
    .toBe('done');
  expect((await command(page, { type: 'snapshot' })).data.threadId).toBe(threadId);
  expect(requests[0]!.body.prompt).toBe(collect.prompt);
  expect((await command(page, collect)).ok).toBe(false);
  const review = {
    ...send,
    id: 'peer-second',
    stage: 'review',
    prompt: 'Full synthetic imported context and collected answers',
  };
  expect((await command(page, review)).ok).toBe(true);
  await expect
    .poll(async () => (await command(page, { type: 'poll', id: 'peer-second' })).data?.status)
    .toBe('done');
  expect(requests).toHaveLength(2);
  expect(requests[0]!.conversation).toBe(requests[1]!.conversation);
  expect(requests[1]!.body.create_conversation_params).toBeUndefined();
  expect(await foreground.evaluate(() => document.visibilityState)).toBe('visible');
  expect(await page.locator('#messages').textContent()).toBe('');
  await page.reload();
  await page.evaluate(() => {
    (window as any).chrome = {
      runtime: {
        id: 'fixture',
        getURL: (s: string) => `chrome-extension://fixture/${s}`,
        onMessage: {
          addListener: (h: unknown) => {
            (window as any).__bridgeHandler = h;
          },
        },
      },
    };
  });
  await page.evaluate(installCollectorFixture);
  await page.addScriptTag({ path: path.resolve('.output/chrome-mv3/bridge.js') });
  const snap = (await command(page, { type: 'snapshot' })).data;
  expect(snap.threadId).toBeUndefined();
  expect((await command(page, { ...review, id: 'lost', documentId: snap.documentId })).ok).toBe(
    false,
  );
  expect(requests).toHaveLength(2);
});
