import { expect, test } from '@playwright/test';

test('shows actual version and browser-managed update guidance without a custom check or reload action', async ({
  page,
}) => {
  await page.goto('/?updates=automatic');
  const section = page.getByRole('region', { name: '확장 업데이트' });
  await section.getByText('버전 0.3.0 · 업데이트 안내').click();
  await expect(section.getByText('브라우저 자동 업데이트', { exact: true })).toBeVisible();
  await expect(
    section.getByText('현재 버전 표시만으로 최신 버전임을 보장하지 않습니다.', { exact: false }),
  ).toBeVisible();
  await section.getByRole('button', { name: '확장 관리 열기' }).click();
  expect(await page.evaluate(() => window.harness.managerOpens)).toBe(1);
  await expect(
    section.getByRole('button', { name: /업데이트 확인|지금 업데이트|다시 시작/ }),
  ).toHaveCount(0);
});

test('shows manual unpacked instructions when automatic-update capability is absent', async ({
  page,
}) => {
  await page.goto('/');
  const section = page.getByRole('region', { name: '확장 업데이트' });
  await section.getByText('버전 0.3.0 · 업데이트 안내').click();
  await expect(section.getByText('수동 업데이트 안내', { exact: true })).toBeVisible();
  await expect(
    section.getByText('압축해제 설치는 새 배포 폴더로 교체한 뒤', { exact: false }),
  ).toBeVisible();
  await expect(section.getByText('AI 탭도 새로고침하세요.', { exact: false })).toBeVisible();
});

test('a downloaded update notice preserves an active review and reappears on panel reopen', async ({
  page,
}) => {
  await page.goto('/?updates=automatic');
  await page.evaluate(() => {
    window.harness.delay = 700;
  });
  await page
    .getByRole('checkbox', {
      name: '원본 대화의 파일·이미지를 모두 선택했거나 첨부가 없음을 확인했습니다',
    })
    .check();
  await page.getByRole('button', { name: '자동 검토 시작', exact: true }).click();
  await expect(page.getByRole('button', { name: '검토 중단', exact: true })).toBeVisible();
  await page.evaluate(() => window.harness.updateAvailable!('0.3.1'));
  const section = page.getByRole('region', { name: '확장 업데이트' });
  await expect(section.getByRole('status')).toContainText('새 버전 0.3.1 설치 대기');
  await expect(section.getByRole('status')).toContainText('진행 중인 작업을 마친 뒤');
  await expect(section.getByRole('status')).toContainText('기록 저장');
  await expect(section.getByRole('status')).toContainText('검토 내역과 연결이 지워집니다');
  await section.getByText('버전 0.3.0 · 업데이트 안내').click();
  await expect(section.getByRole('button', { name: '확장 관리 열기' })).toBeDisabled();
  await expect(page.getByRole('heading', { name: '검토 완료', exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => window.harness.sends.filter((send) => send.job.stage === 'synthesize').length,
    ),
  ).toBe(1);
  await page.reload();
  await expect(
    page.getByRole('region', { name: '확장 업데이트' }).getByRole('status'),
  ).toContainText('새 버전 0.3.1 설치 대기');
});
