import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import { geminiReadinessPage } from '../fixtures/providers/gemini-readiness';

async function command(
  page: Page,
  message: object,
  sender = 'chrome-extension://fixture/sidepanel.html',
) {
  return page.evaluate(
    ({ message, sender }) =>
      new Promise<{ ok: boolean; data?: any; error?: string }>((resolve) => {
        (window as any).__bridgeHandler(message, { id: 'fixture', url: sender }, resolve);
        if (sender !== 'chrome-extension://fixture/sidepanel.html')
          setTimeout(() => resolve({ ok: false }), 50);
      }),
    { message, sender },
  );
}
async function setup(page: Page, protection: boolean | undefined) {
  await page.route('https://gemini.google.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: geminiReadinessPage(protection) }),
  );
  await page.goto('https://gemini.google.com/app');
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
  const bridge = await page.addScriptTag({ path: path.resolve('.output/chrome-mv3/bridge.js') });
  // Production ISOLATED injection leaves no provider DOM script node.
  await bridge.evaluate((element) => element.parentNode?.removeChild(element));
  const snap = (await command(page, { type: 'snapshot' })).data;
  return { documentId: snap.documentId, url: snap.url };
}
for (const protection of [true, false, undefined]) {
  test(`Gemini readiness reads ${String(protection)} protection with no generation, fetch or credential output`, async ({
    page,
    context,
  }) => {
    const target = await setup(page, protection);
    const other = await context.newPage();
    await other.goto('about:blank');
    await other.bringToFront();
    expect(
      (await command(page, { type: 'startGeminiReadiness', id: 'readiness', ...target })).ok,
    ).toBe(true);
    await expect
      .poll(
        async () =>
          (await command(page, { type: 'pollGeminiReadiness', id: 'readiness' })).data?.status,
      )
      .toBe('done');
    const result = await command(page, { type: 'pollGeminiReadiness', id: 'readiness' });
    expect(result.data.result).toEqual({
      model: 'Automatic fixture',
      protection: protection === true ? 'enabled' : protection === false ? 'disabled' : 'unknown',
    });
    expect(JSON.stringify(result)).not.toMatch(/SYNTHETIC_PRIVATE|fixture-mode-key/);
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
    expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
    expect(await page.locator('[role="menu"]').count()).toBe(0);
    expect(await other.evaluate(() => document.hasFocus())).toBe(true);
    expect(
      (await command(page, { type: 'startGeminiReadiness', id: 'readiness', ...target })).ok,
    ).toBe(false);
  });
}
test('Gemini readiness rejects foreign senders, stale documents, drafts and proxy fields without network', async ({
  page,
}) => {
  const target = await setup(page, true);
  expect(
    (
      await command(
        page,
        { type: 'startGeminiReadiness', id: 'foreign', ...target },
        'https://gemini.google.com/app',
      )
    ).ok,
  ).toBe(false);
  expect(
    (
      await command(page, {
        type: 'startGeminiReadiness',
        id: 'stale',
        ...target,
        documentId: 'wrong',
      })
    ).ok,
  ).toBe(false);
  expect(
    (
      await command(page, {
        type: 'startGeminiReadiness',
        id: 'proxy',
        ...target,
        headers: { at: 'SYNTHETIC_PRIVATE_MARKER' },
      })
    ).ok,
  ).toBe(false);
  await page.locator('.ql-editor').fill('Existing user draft');
  expect((await command(page, { type: 'startGeminiReadiness', id: 'draft', ...target })).ok).toBe(
    true,
  );
  await expect
    .poll(
      async () => (await command(page, { type: 'pollGeminiReadiness', id: 'draft' })).data?.status,
    )
    .toBe('error');
  expect(await page.locator('.ql-editor').innerText()).toBe('Existing user draft');
  expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
});

test('Gemini readiness UI separates preparation from response success', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await expect(page.getByText('Gemini 준비 확인', { exact: true })).toBeVisible({ timeout: 1000 });
  await page.getByText('Gemini 준비 확인', { exact: true }).click();
  await expect(
    page.getByText('요청을 보내거나 응답을 받은 시험은 아닙니다.', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }).click();
  await expect(
    page.getByText('보안 검사 필요: 백그라운드 전송 준비가 완료되지 않았습니다.', { exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => window.harness.sends)).toEqual([]);
  await page.reload();
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.getByText('Gemini 준비 확인', { exact: true }).click();
  await expect(
    page.getByText('지난 준비 확인은 완료됐습니다. 응답 성공을 확인한 상태는 아닙니다.', {
      exact: true,
    }),
  ).toBeVisible();
});

test('cancelled Gemini readiness keeps the picker lock until delayed cleanup finishes', async ({
  page,
}) => {
  const target = await setup(page, true);
  await page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>(
      '[data-test-id="bard-mode-menu-button"]',
    )!;
    const click = button.onclick!;
    button.onclick = (event) => {
      click.call(button, event);
      const menu = document.getElementById('fixture-mode-menu')!;
      menu.onkeydown = (event) => {
        if (event.key === 'Escape')
          setTimeout(() => {
            menu.remove();
            button.setAttribute('aria-expanded', 'false');
          }, 500);
      };
    };
  });
  expect((await command(page, { type: 'startGeminiReadiness', id: 'cleanup', ...target })).ok).toBe(
    true,
  );
  await expect(page.locator('[role="menu"]')).toBeVisible();
  await command(page, { type: 'cancelGeminiReadiness', id: 'cleanup' });
  expect(
    (
      await command(page, {
        type: 'send',
        id: 'racing-send',
        ...target,
        prompt: 'Must not send during cleanup',
      })
    ).ok,
  ).toBe(false);
  await expect(page.locator('[role="menu"]')).toHaveCount(0);
  expect((await command(page, { type: 'models', ...target })).ok).toBe(true);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
});

test('readiness UI explains only the fixed failed stage without rendering raw provider errors', async ({
  page,
}) => {
  await page.goto('/?readiness=model-error');
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.getByText('Gemini 준비 확인', { exact: true }).click();
  await page.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }).click();
  await expect(
    page.getByText(
      'Gemini 모델 메뉴를 읽지 못했습니다. 사이트에서 모델을 확인하세요. 요청은 보내지 않았습니다.',
      { exact: true },
    ),
  ).toBeVisible({ timeout: 1000 });
  await expect(page.getByText('SYNTHETIC_PRIVATE_MARKER', { exact: true })).toHaveCount(0);
});

test('stopping readiness is a neutral explicit stop instead of a provider fault', async ({
  page,
}) => {
  await page.goto('/?readiness=hold');
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.getByText('Gemini 준비 확인', { exact: true }).click();
  await page.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }).click();
  await page.getByRole('button', { name: '확인 중단', exact: true }).click();
  await expect(
    page.getByText('Gemini 준비 확인을 중단했습니다. 요청은 보내지 않았습니다.', { exact: true }),
  ).toBeVisible({ timeout: 1000 });
  await expect(page.locator('.error')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }),
  ).toBeEnabled();
  expect(await page.evaluate(() => window.harness.sends)).toEqual([]);
});
