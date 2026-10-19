import { test, expect, type Page } from '@playwright/test';
async function open(page: Page, mode = '') {
  await page.goto('/?header-observation=' + mode);
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.getByText('Gemini 준비 확인', { exact: true }).click();
  return page.locator('details.connection-detail').filter({ hasText: 'Gemini 준비 확인' });
}
test('DOM observation is explicit, bounded, fixed-result only and shares the existing busy interlock', async ({
  page,
}) => {
  const details = await open(page);
  await expect(details.getByText(/페이지와 입력란 준비 후 최대 15초/)).toBeVisible();
  expect(await page.evaluate(() => window.harness.geminiHeaderStarts)).toBe(0);
  await details
    .getByRole('button', { name: 'Gemini 버튼 준비만 관찰', exact: true })
    .evaluate((button) => {
      (button as HTMLButtonElement).click();
      (button as HTMLButtonElement).click();
    });
  await expect(
    details.getByText(/초기 제한 이후의 준비되지 않은 구조와 이후 준비된 구조/),
  ).toBeVisible();
  await expect(details.getByText(/관찰 탭을 유지했습니다/)).toBeVisible();
  expect(await page.evaluate(() => window.harness.geminiHeaderStarts)).toBe(1);
  expect(await page.evaluate(() => window.harness.geminiSdkTrialStarts)).toBe(0);
  expect(await page.evaluate(() => window.harness.sends)).toEqual([]);
  expect(await page.evaluate(() => sessionStorage.getItem('fixture-gemini-readiness'))).toBeNull();
  await page.reload();
  expect(await page.evaluate(() => window.harness.geminiHeaderStarts)).toBe(0);
});
test('cancellation stays locked until settlement and rejects a late positive result', async ({
  page,
}) => {
  const details = await open(page, 'late');
  const start = details.getByRole('button', { name: 'Gemini 버튼 준비만 관찰', exact: true });
  await start.click();
  await expect(
    details.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }),
  ).toBeDisabled();
  await details.getByRole('button', { name: '확인 중단', exact: true }).click();
  await expect(start).toBeDisabled();
  expect(await page.evaluate(() => window.harness.geminiHeaderCancels)).toBe(1);
  await page.evaluate(() => window.harness.completeGeminiHeader?.());
  await expect(start).toBeEnabled();
  await expect(details.getByText(/버튼 관찰을 중단했습니다/)).toBeVisible();
  await expect(details.getByText(/초기 제한 이후의 준비되지 않은 구조/)).toHaveCount(0);
  expect(await page.evaluate(() => window.harness.geminiHeaderStarts)).toBe(1);
});
test('unmount cancels once without automatic restart and optional port absence hides the action', async ({
  page,
}) => {
  const details = await open(page, 'hold');
  await details.getByRole('button', { name: 'Gemini 버튼 준비만 관찰', exact: true }).click();
  await page.getByRole('button', { name: '검토', exact: true }).click();
  await expect(details).toHaveCount(0);
  expect(await page.evaluate(() => window.harness.geminiHeaderCancels)).toBe(1);
  await page.getByRole('button', { name: '연결', exact: true }).click();
  expect(await page.evaluate(() => window.harness.geminiHeaderStarts)).toBe(1);
  await open(page, 'absent');
  await expect(
    page.getByRole('button', { name: 'Gemini 버튼 준비만 관찰', exact: true }),
  ).toHaveCount(0);
});
test('inconclusive wording cannot imply continuous absence or successful generation', async ({
  page,
}) => {
  const details = await open(page, 'inconclusive');
  await details.getByRole('button', { name: 'Gemini 버튼 준비만 관찰', exact: true }).click();
  await expect(
    details.getByText(/실행 간격 때문에 준비 시점을 판정할 증거가 부족합니다/),
  ).toBeVisible();
  await expect(details.getByText(/응답 확인 완료/)).toHaveCount(0);
});

test('visible-page evidence is displayed distinctly from hidden-page evidence', async ({
  page,
}) => {
  const details = await open(page, 'visible');
  await details.getByRole('button', { name: 'Gemini 버튼 준비만 관찰', exact: true }).click();
  await expect(
    details.getByText(/관찰 페이지는 계속 표시 상태였습니다. 숨김 상태의 증거는 아닙니다/),
  ).toBeVisible();
  await expect(details.getByText(/관찰 페이지는 계속 숨김 상태였습니다/)).toHaveCount(0);
});
