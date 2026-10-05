import { test, expect } from '@playwright/test';

test('one click imports, collects, reviews and sends final synthesis to the original main', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 360, height: 820 });
  await page.goto('/');
  await expect(page.getByText('물은 언제나 100°C에서 끓나요?', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '질문 복사' })).toHaveCount(0);
  await page.screenshot({ path: info.outputPath('workspace.png'), fullPage: true });
  expect(await page.evaluate(() => window.harness.sends)).toHaveLength(0);
  await page.getByRole('button', { name: '자동 검토 시작' }).click();
  await expect(page.getByRole('heading', { name: '검토 완료' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const sends = await page.evaluate(() => window.harness.sends);
  expect(sends).toHaveLength(4);
  expect(sends.map((send) => send.job.stage)).toEqual([
    'collect',
    'collect',
    'review',
    'synthesize',
  ]);
  expect(sends.filter((send) => send.job.provider === 'chatgpt')).toHaveLength(1);
  expect(sends.at(-1)!.target.url).toBe('https://chatgpt.com/original-conversation');
  expect(sends.at(-1)!.job.prompt).toContain('독립 답변 claude');
  expect(sends.at(-1)!.job.prompt).toContain('교차 검토:');
  expect(sends.at(-1)!.job.prompt).toContain('표준 대기압에서 순수한 물');
  await page.getByText('검토 내역', { exact: true }).click();
  expect(await page.locator('main img:not(.provider-logo)').count()).toBe(0);
  expect(await page.evaluate(() => (window as any).pwned)).toBeUndefined();
  await page.reload();
  await expect(page.getByRole('heading', { name: '검토 완료' })).toBeVisible();
  expect(await page.evaluate(() => window.harness.sends)).toHaveLength(0);
  await page.screenshot({ path: info.outputPath('completed.png'), fullPage: true });
  expect(errors).toEqual([]);
});

test('switching the main conversation during review prevents the final send', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.harness.moveMainDuringReview = true;
  });
  await page.getByRole('button', { name: '자동 검토 시작' }).click();
  await expect(
    page.getByText('메인 대화가 바뀌었습니다. 자동 전송을 멈췄습니다.', { exact: false }).first(),
  ).toBeVisible();
  expect(
    await page.evaluate(() => window.harness.sends.some((item) => item.job.stage === 'synthesize')),
  ).toBe(false);
});

test('a quota failure is disclosed and remaining successful providers finish without retries', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.harness.failProvider = 'claude';
  });
  await page.getByRole('button', { name: '자동 검토 시작' }).click();
  await expect(page.getByRole('heading', { name: '검토 완료' })).toBeVisible();
  await expect(page.locator('.run-errors')).toContainText('무료 사용량 한도');
  const sends = await page.evaluate(() => window.harness.sends);
  expect(sends.filter((send) => send.job.provider === 'claude')).toHaveLength(1);
  expect(sends.find((send) => send.job.stage === 'review')!.job.provider).toBe('gemini');
});

test('insufficient answers stop the pipeline instead of calling consensus verified', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.harness.failAll = true;
  });
  await page.getByRole('button', { name: '자동 검토 시작' }).click();
  await expect(page.getByRole('heading', { name: '검토 멈춤' })).toBeVisible();
  const sends = await page.evaluate(() => window.harness.sends);
  expect(sends).toHaveLength(2);
  expect(sends.every((send) => send.job.stage === 'collect')).toBe(true);
});

test('stop and reload never re-send ambiguous requests', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.harness.delay = 2000;
  });
  await page.getByRole('button', { name: '자동 검토 시작' }).click();
  await expect.poll(() => page.evaluate(() => window.harness.sends.length)).toBe(2);
  await page.getByRole('button', { name: '검토 중단', exact: true }).click();
  await expect(page.getByRole('heading', { name: '검토 멈춤' })).toBeVisible();
  expect(await page.evaluate(() => window.harness.sends.length)).toBe(2);
  await page.reload();
  await expect(page.getByRole('heading', { name: '검토 멈춤' })).toBeVisible();
  expect(await page.evaluate(() => window.harness.sends.length)).toBe(0);
  await page.getByRole('button', { name: '기록 지우고 새 검토' }).click();
  await expect(page.getByRole('heading', { name: '현재 답변 검토' })).toBeVisible();
});

test('storage failure prevents web sends', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.harness.failSave = true;
  });
  await page.getByRole('button', { name: '자동 검토 시작' }).click();
  await expect(page.getByRole('status').first()).toContainText('저장 실패');
  expect(await page.evaluate(() => window.harness.sends)).toHaveLength(0);
});

test('connections loads and changes available web models without sending a question', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: '연결', exact: true }).click();
  const card = page
    .getByRole('article')
    .filter({ has: page.getByRole('heading', { name: 'ChatGPT', exact: true }) });
  await expect(card).not.toContainText('사용 가능');
  await card.getByRole('button', { name: 'ChatGPT 연결 검사' }).click();
  await expect(card).toContainText('사용 가능');
  await page.getByLabel('ChatGPT 모델').selectOption('다른 모델');
  await expect.poll(() => page.evaluate(() => window.harness.models.chatgpt)).toBe('다른 모델');
  await expect(page.getByLabel('ChatGPT 모델').locator('option[value="한도 도달"]')).toBeDisabled();
  expect(await page.evaluate(() => window.harness.sends)).toHaveLength(0);
});

test('narrow side panel stays readable and settings are optional', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: '자동 검토 시작' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await expect(page.getByRole('button', { name: 'ChatGPT 참여' })).not.toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: '검토', exact: true })).toBeFocused();
});
