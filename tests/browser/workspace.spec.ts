import { test, expect, type Page } from '@playwright/test';

async function confirmOriginals(page: Page) {
  await page
    .getByRole('checkbox', {
      name: /원래 대화(에 첨부파일이 없습니다|의 파일·이미지를 모두 선택했습니다)/,
    })
    .check();
}

test('one click imports, collects, reviews and sends final synthesis to the original main', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 360, height: 820 });
  await page.goto('/');
  await expect(
    page.locator('.source-question').filter({ hasText: '물은 언제나 100°C에서 끓나요?' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: '질문 복사' })).toHaveCount(0);
  await page.screenshot({ path: info.outputPath('workspace.png'), fullPage: true });
  expect(await page.evaluate(() => window.harness.sends)).toHaveLength(0);
  await confirmOriginals(page);
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
  await confirmOriginals(page);
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
  await confirmOriginals(page);
  await page.getByRole('button', { name: '자동 검토 시작' }).click();
  await expect(page.getByRole('heading', { name: '검토 완료' })).toBeVisible();
  await expect(page.locator('.run-errors')).toContainText('무료 사용량 한도');
  await expect(page.locator('.participation-summary')).toContainText('제외: Claude');
  await expect(page.getByRole('button', { name: 'Claude AI에서 확인' })).toBeVisible();
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
  await confirmOriginals(page);
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
  await confirmOriginals(page);
  await page.getByRole('button', { name: '자동 검토 시작' }).click();
  await expect.poll(() => page.evaluate(() => window.harness.sends.length)).toBe(2);
  await page.getByRole('button', { name: '검토 중단', exact: true }).click();
  await expect(page.getByRole('heading', { name: '검토 멈춤' })).toBeVisible();
  expect(await page.evaluate(() => window.harness.sends.length)).toBe(2);
  await page.reload();
  await expect(page.getByRole('heading', { name: '검토 멈춤' })).toBeVisible();
  expect(await page.evaluate(() => window.harness.sends.length)).toBe(0);
  await page.getByRole('button', { name: '새 검토', exact: true }).click();
  await expect(page.getByRole('heading', { name: '대화 검토' })).toBeVisible();
});

test('storage failure prevents web sends', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.harness.failSave = true;
  });
  await confirmOriginals(page);
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
  await card.getByRole('button', { name: '다시 연결', exact: true }).click();
  await expect(card).toContainText('입력란 감지');
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
  await expect(page.getByRole('checkbox', { name: 'ChatGPT 참여' })).toHaveCount(0);
  await expect(page.getByRole('checkbox', { name: 'Claude 참여' })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: '검토', exact: true })).toBeFocused();
});

test('opening another provider preserves the pinned main until explicitly selected again', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.source-label').first()).toContainText('ChatGPT');
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.evaluate(() => {
    window.harness.activeProvider = 'claude';
    window.dispatchEvent(new Event('focus'));
  });
  await expect(page.getByRole('button', { name: '원래 대화로 돌아가기' })).toBeVisible();
  await page.getByRole('button', { name: '검토', exact: true }).click();
  await expect(page.locator('.source-label').first()).toContainText('ChatGPT');
  await confirmOriginals(page);
  await page.getByRole('button', { name: '자동 검토 시작' }).click();
  await expect(page.getByRole('heading', { name: '검토 완료' })).toBeVisible();
  expect(await page.evaluate(() => window.harness.sends.at(-1)?.target.provider)).toBe('chatgpt');
});

test('selecting a new main clears originals and requires a fresh confirmation', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.source-label').first()).toContainText('ChatGPT');
  await page.getByLabel('원본 파일 선택').setInputFiles({
    name: 'original.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('original'),
  });
  await expect(page.locator('.attachment-list')).toContainText('original.txt');
  await confirmOriginals(page);
  await page.evaluate(() => {
    window.harness.activeProvider = 'claude';
  });
  await page.getByRole('button', { name: /현재 탭(에서 가져오기|으로 변경)/ }).click();
  await expect(page.locator('.source-label').first()).toContainText('Claude');
  await expect(page.locator('.attachment-list')).toHaveCount(0);
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await expect(page.getByRole('button', { name: '자동 검토 시작' })).toBeDisabled();
});

test('original files are forwarded once per provider while only metadata is saved', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: '자동 검토 시작' })).toBeDisabled();
  const bytes = Buffer.from('synthetic original document');
  await page
    .getByLabel('원본 파일 선택')
    .setInputFiles({ name: 'source.txt', mimeType: 'text/plain', buffer: bytes });
  await expect(page.locator('.attachment-list')).toContainText('source.txt');
  expect(await page.getByLabel('원본 파일 선택').inputValue()).toBe('');
  await confirmOriginals(page);
  await page.getByRole('button', { name: '자동 검토 시작' }).click();
  await expect(page.getByRole('heading', { name: '검토 완료' })).toBeVisible();
  const sends = await page.evaluate(() => window.harness.sends);
  const uploads = sends.filter((send) => send.attachments.length);
  expect(uploads.map((send) => send.target.provider).sort()).toEqual([
    'chatgpt',
    'claude',
    'gemini',
  ]);
  expect(uploads.every((send) => send.attachments[0]?.base64 === bytes.toString('base64'))).toBe(
    true,
  );
  const saved = await page.evaluate(() => sessionStorage.getItem('fixture-workspace')!);
  expect(JSON.parse(saved).run.attachments[0]).toMatchObject({
    name: 'source.txt',
    size: bytes.length,
    sha256: expect.stringMatching(/^[a-f0-9]{64}$/),
  });
  expect(saved).not.toContain('base64');
  expect(saved).not.toContain(bytes.toString('base64'));
});

test('restored reviews require matching original bytes before continuing', async ({ page }) => {
  await page.goto('/');
  const original = { name: 'source.txt', mimeType: 'text/plain', buffer: Buffer.from('original') };
  await page.getByLabel('원본 파일 선택').setInputFiles(original);
  await expect(page.locator('.attachment-list')).toContainText('source.txt');
  await confirmOriginals(page);
  await page.evaluate(() => {
    window.harness.delay = 2000;
  });
  await page.getByRole('button', { name: '자동 검토 시작' }).click();
  await expect.poll(() => page.evaluate(() => window.harness.sends.length)).toBe(2);
  await page.getByRole('button', { name: '검토 중단', exact: true }).click();
  await expect(page.getByRole('heading', { name: '검토 멈춤' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: '검토 멈춤' })).toBeVisible();
  const resume = page.getByRole('button', { name: '남은 검토 계속' });
  await expect(resume).toBeDisabled();
  await page
    .getByLabel('원본 파일 선택')
    .setInputFiles({ ...original, buffer: Buffer.from('modified') });
  await expect(
    page.getByText(
      '저장된 원본 파일과 일치하지 않습니다. 이름과 내용을 바꾸지 않은 원본을 다시 선택해주세요.',
    ),
  ).toBeVisible();
  await expect(resume).toBeDisabled();
  await page.getByLabel('원본 파일 선택').setInputFiles(original);
  await expect(resume).toBeEnabled();
  expect(await page.evaluate(() => window.harness.sends)).toHaveLength(0);
});

test('an unavailable source requires an explicit read before files or sending are enabled', async ({
  page,
}) => {
  await page.goto('/?source=unavailable');
  await expect(page.getByRole('button', { name: '자동 검토 시작' })).toBeDisabled();
  await expect(page.getByLabel('원본 파일 선택')).toBeDisabled();
  await expect(page.getByRole('checkbox')).toBeDisabled();
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.evaluate(() => {
    window.harness.activeProvider = 'claude';
    window.dispatchEvent(new Event('focus'));
  });
  await expect(page.getByRole('button', { name: '원래 대화로 돌아가기' })).toHaveCount(0);
  await page.getByRole('button', { name: '검토', exact: true }).click();
  await expect(page.locator('.source-label')).toHaveCount(0);
  await page.getByRole('button', { name: /현재 탭(에서 가져오기|으로 변경)/ }).click();
  await expect(page.locator('.source-label').first()).toContainText('Claude');
  await expect(page.getByLabel('원본 파일 선택')).toBeEnabled();
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  expect(await page.evaluate(() => window.harness.sends)).toHaveLength(0);
});

test('loaded scope and every shared turn remain inspectable before and after review', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByText(/현재 화면에 불러온 질문·답변 2쌍/)).toBeVisible();
  await page.getByText('공유할 대화 전체 보기', { exact: false }).click();
  await expect(page.getByText('먼저 압력의 영향을 설명해주세요.', { exact: true })).toBeVisible();
  await expect(page.getByText('압력이 끓는점에 영향을 줍니다.', { exact: true })).toBeVisible();
  await confirmOriginals(page);
  await page.getByRole('button', { name: '자동 검토 시작' }).click();
  await expect(page.getByRole('heading', { name: '검토 완료' })).toBeVisible();
  await page.getByText('공유한 대화 · 현재 화면에 불러온 2쌍').click();
  await expect(page.getByText('먼저 압력의 영향을 설명해주세요.', { exact: true })).toBeVisible();
});
