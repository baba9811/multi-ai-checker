import {
  GEMINI_NATIVE_DISPATCH_REASONS,
  GEMINI_NATIVE_CONFIGURATION_DIAGNOSTICS,
} from '../../src/application/gemini-fixed-text-trial';
import { test, expect, type Page } from '@playwright/test';
import { GEMINI_FIXED_TEXT_TRIAL_PROMPT } from '../../src/application/gemini-fixed-text-trial';

async function open(page: Page, query = '') {
  await page.goto('/' + query);
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.getByText('Gemini 응답 시험', { exact: true }).click();
  return page.locator('details.connection-detail').filter({ hasText: 'Gemini 응답 시험' });
}

test('folded fixed trial discloses its scope and one start renders only verified model and answer', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: '연결', exact: true }).click();
  const trial = page.locator('details.connection-detail').filter({ hasText: 'Gemini 응답 시험' });
  await expect(trial).not.toHaveAttribute('open');
  await page.getByText('Gemini 응답 시험', { exact: true }).click();
  await expect(trial.getByText(GEMINI_FIXED_TEXT_TRIAL_PROMPT, { exact: true })).toBeVisible();
  await expect(trial.getByText(/새 Gemini 시험 탭 1개를 백그라운드에서/)).toBeVisible();
  await expect(trial.getByText(/기존 대화와 파일은 보내지 않습니다/)).toBeVisible();
  await expect(trial.locator('input, textarea, select')).toHaveCount(0);
  await expect(
    trial.getByRole('button', { name: 'Gemini 응답 시험 시작', exact: true }),
  ).toBeEnabled();
  await trial
    .getByRole('button', { name: 'Gemini 응답 시험 시작', exact: true })
    .evaluate((button) => {
      if (!(button instanceof HTMLButtonElement)) throw new Error('Expected a trial button.');
      button.click();
      button.click();
    });
  await expect(trial.getByText('응답 확인 완료', { exact: true })).toBeVisible();
  await expect(trial.getByText('모델: Gemini fixture', { exact: true })).toBeVisible();
  await expect(trial.getByText('CROSSCHECK_GEMINI_OK', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.harness.geminiSdkTrialStarts)).toBe(1);
  expect(await page.evaluate(() => window.harness.sends)).toEqual([]);
  expect(
    await page.evaluate(() => JSON.parse(sessionStorage.getItem('fixture-gemini-sdk-trial')!)),
  ).toEqual({ id: 'fixture-gemini-sdk-1', status: 'done' });
});

test('stop is immediate, stays locked until settlement and rejects a late successful result', async ({
  page,
}) => {
  const trial = await open(page, '?sdk-trial=late');
  await trial.getByRole('button', { name: 'Gemini 응답 시험 시작', exact: true }).click();
  await trial.getByRole('button', { name: '시험 중지', exact: true }).click();
  await expect(trial.getByText(/Gemini 응답 시험을 중지했습니다/)).toBeVisible();
  await expect(
    trial.getByRole('button', { name: '새 Gemini 응답 시험 시작', exact: true }),
  ).toBeDisabled();
  expect(await page.evaluate(() => window.harness.geminiSdkTrialCancels)).toBe(1);
  await page.evaluate(() => window.harness.completeGeminiSdkTrial?.());
  await expect(
    trial.getByRole('button', { name: '새 Gemini 응답 시험 시작', exact: true }),
  ).toBeEnabled();
  await expect(trial.getByText('응답 확인 완료', { exact: true })).toHaveCount(0);
  await expect(trial.getByText('CROSSCHECK_GEMINI_OK', { exact: true })).toHaveCount(0);
  await expect(trial.locator('.error')).toHaveCount(0);
  expect(await page.evaluate(() => window.harness.geminiSdkTrialStarts)).toBe(1);
  expect(
    await page.evaluate(() => JSON.parse(sessionStorage.getItem('fixture-gemini-sdk-trial')!)),
  ).toEqual({ id: 'fixture-gemini-sdk-1', status: 'uncertain' });
});

for (const status of ['pending', 'uncertain'] as const) {
  test(`restored ${status} is uncertain and never automatically resumes`, async ({ page }) => {
    await page.addInitScript(
      (status) =>
        sessionStorage.setItem(
          'fixture-gemini-sdk-trial',
          JSON.stringify({ id: 'fixture-previous', status }),
        ),
      status,
    );
    const trial = await open(page);
    await expect(trial.getByText(/지난 요청의 완료 여부를 확인하지 못했습니다/)).toBeVisible();
    await expect(
      trial.getByRole('button', { name: '새 Gemini 응답 시험 시작', exact: true }),
    ).toBeEnabled();
    await expect(trial.getByText('응답 확인 완료', { exact: true })).toHaveCount(0);
    expect(await page.evaluate(() => window.harness.geminiSdkTrialStarts)).toBe(0);
    await page.reload();
    await page.getByRole('button', { name: '연결', exact: true }).click();
    await page.getByText('Gemini 응답 시험', { exact: true }).click();
    expect(await page.evaluate(() => window.harness.geminiSdkTrialStarts)).toBe(0);
  });
}

test('unmount aborts the operation and a later result cannot populate a remounted trial', async ({
  page,
}) => {
  const trial = await open(page, '?sdk-trial=late');
  await trial.getByRole('button', { name: 'Gemini 응답 시험 시작', exact: true }).click();
  await page.getByRole('button', { name: '검토', exact: true }).click();
  expect(await page.evaluate(() => window.harness.geminiSdkTrialCancels)).toBe(1);
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.getByText('Gemini 응답 시험', { exact: true }).click();
  await page.evaluate(() => window.harness.completeGeminiSdkTrial?.());
  await expect(trial.getByText(/지난 요청의 완료 여부를 확인하지 못했습니다/)).toBeVisible();
  await expect(trial.getByText('응답 확인 완료', { exact: true })).toHaveCount(0);
  await expect(trial.getByText('CROSSCHECK_GEMINI_OK', { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => window.harness.geminiSdkTrialStarts)).toBe(1);
});

test('an absent platform port keeps the response trial out of the connection screen', async ({
  page,
}) => {
  await page.goto('/?sdk-trial=absent');
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await expect(page.getByText('Gemini 응답 시험', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Gemini 준비 확인', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.harness.geminiSdkTrialStarts)).toBe(0);
});

test('fixed failure stage explains uncertainty without showing raw errors or an unsent claim', async ({
  page,
}) => {
  const trial = await open(page, '?sdk-trial=history');
  await trial.getByRole('button', { name: 'Gemini 응답 시험 시작', exact: true }).click();
  await expect(trial.getByText(/저장된 응답을 확인하지 못했습니다/)).toBeVisible();
  await expect(
    trial.getByText(/요청의 완료 여부는 확인하지 못했으며 자동으로 다시 보내지 않습니다/),
  ).toBeVisible();
  await expect(trial.getByText(/SYNTHETIC_PRIVATE_MARKER|요청은 보내지 않았습니다/)).toHaveCount(0);
  await expect(trial.getByText('CROSSCHECK_GEMINI_OK', { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => window.harness.geminiSdkTrialStarts)).toBe(1);
});

test('a long model label stays inside a narrow side panel', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  const trial = await open(page, '?sdk-trial=long-model');
  await trial.getByRole('button', { name: 'Gemini 응답 시험 시작', exact: true }).click();
  await expect(trial.getByText('모델: ' + 'x'.repeat(160), { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

for (const [reason, text] of [
  ...GEMINI_NATIVE_DISPATCH_REASONS.map((reason, i) => [
    reason,
    GEMINI_NATIVE_CONFIGURATION_DIAGNOSTICS.includes(reason as any)
      ? `확인 코드 N15-${GEMINI_NATIVE_CONFIGURATION_DIAGNOSTICS.indexOf(reason as any) + 1}`
      : `확인 코드 N${String(i + 1).padStart(2, '0')}`,
  ]),
  ['model-trigger', '모델 선택 버튼'],
  ['model-trigger-compact-control', '모델 선택 버튼을 확인하지 못했습니다. 확인 코드 T1.'],
  ['model-trigger-final-control', '모델 선택 버튼을 확인하지 못했습니다. 확인 코드 T2.'],
  ['model-trigger-header-context', '모델 선택 버튼을 확인하지 못했습니다. 확인 코드 T3.'],
  ['model-trigger-header-deadline', '모델 선택 버튼을 확인하지 못했습니다. 확인 코드 T4.'],
  ['model-trigger-header-association', '모델 선택 버튼을 확인하지 못했습니다. 확인 코드 T5.'],

  ['model-menu', '모델 메뉴 상태'],
  ['model-menu-open-trigger', '확인 코드 M1'],
  ['model-menu-open-menu', '확인 코드 M2'],
  ['model-menu-owner-missing', '확인 코드 M3'],
  ['model-menu-owner-changed', '확인 코드 M4'],
  ['model-menu-trigger-detached', '확인 코드 M9'],
  ['model-menu-popover-ambiguous', '확인 코드 M5'],
  ['model-menu-menu-ambiguous', '확인 코드 M6'],
  ['model-menu-controls-invalid', '확인 코드 M7'],
  ['model-menu-owner-duplicate', '확인 코드 M8'],
  ['model-cleanup', '모델 메뉴 정리'],
  ['model-bindings', '모델 연결'],
  ['model-catalog', '모델 목록'],
  ['model-selection', '모델 선택'],
  ['model-selection-id', '선택된 모델을 구분'],
  ['model-selection-ui', '화면의 모델 선택'],
  ['model-selection-catalog', '선택된 모델의 목록'],
  ['model-settings', '모델 설정'],
  ['capture-setup', '시험 준비 상태'],
  ['capture-readiness', '시험 페이지의 준비 상태'],
  ['capture-editor', '시험 입력 상태'],
  ['capture-bindings', '시험 연결 정보'],
  ['capture-actions', '시험 처리 상태'],
  ['capture-request-id', '시험 요청의 연결'],
  ['capture-observation', '대화 상태의 연결'],
  ['capture-completion', '대화 상태를 계속 확인'],
  ['capture-store', '시험 대화의 연결'],
  ['capture-current', '시험 페이지의 연결 상태'],
  ['capture-state', '대화 상태'],
  ['capture-action', '대화 처리 상태'],
  ['response-request', '응답의 요청 연결'],
  ['response-turn', '응답 내용'],
  ['response-shape', '응답 형식'],
  ['response-envelope', '응답 전달 형식'],
  ['response-envelope-record', '응답 전달 정보'],
  ['response-envelope-kind', '응답 유형'],
  ['response-envelope-keys', '응답 구성 정보'],
  ['response-envelope-meta-1', '확인 코드 E1'],
  ['response-envelope-meta-2', '확인 코드 E2'],
  ['response-envelope-meta-3', '확인 코드 E3'],
  ['response-envelope-meta-4', '확인 코드 E4'],
  ['response-envelope-meta-5', '확인 코드 E5'],
  ['response-envelope-meta-6', '확인 코드 E6'],
  ['response-envelope-meta-7', '확인 코드 E7'],
  ['response-record', '응답 정보의 형식'],
  ['response-identity', '응답 연결 정보'],
  ['response-metadata', '응답의 부가 정보'],
  ['response-lists', '응답의 추가 항목'],
  ['response-flags', '응답 상태'],
  ['response-flag-1', '확인 코드 G1'],
  ['response-flag-2', '확인 코드 G2'],
  ['response-flag-3', '확인 코드 G3'],
  ['response-flag-4', '확인 코드 G4'],
  ['response-flag-5', '확인 코드 G5'],
  ['response-flag-6', '확인 코드 G6'],
  ['response-flag-7', '확인 코드 G7'],
  ['response-flag-8', '확인 코드 G8'],
  ['response-extra', '응답의 추가 정보'],
  ['response-raw-fields', '확인 코드 R1'],
  ['response-raw-field-1', '확인 코드 W1'],
  ['response-raw-field-3', '확인 코드 W3'],
  ['response-raw-field-4', '확인 코드 W4'],
  ['response-raw-field-14', '확인 코드 W14'],
  ['response-raw-field-17', '확인 코드 W17'],
  ['response-raw-field-18', '확인 코드 W18'],
  ['response-raw-field-19', '확인 코드 W19'],
  ['response-raw-field-22', '확인 코드 W22'],
  ['response-raw-field-29', '확인 코드 W29'],
  ['response-raw-field-31', '확인 코드 W31'],
  ['response-raw-field-38', '확인 코드 W38'],
  ['response-raw-field-39', '확인 코드 W39'],
  ['response-raw-field-42', '확인 코드 W42'],
  ['response-raw-field-44', '확인 코드 W44'],
  ['response-raw-field-45', '확인 코드 W45'],
  ['response-raw-field-51', '확인 코드 W51'],
  ['response-raw-field-54', '확인 코드 W54'],
  ['response-raw-field-6', '확인 코드 W6'],
  ['response-raw-field-7', '확인 코드 W7'],
  ['response-raw-field-8', '확인 코드 W8'],
  ['response-raw-field-10', '확인 코드 W10'],
  ['response-raw-field-25', '확인 코드 W25'],
  ['response-raw-field-30', '확인 코드 W30'],
  ['response-raw-field-33', '확인 코드 W33'],
  ['response-raw-field-35', '확인 코드 W35'],
  ['response-raw-field-36', '확인 코드 W36'],
  ['response-raw-field-41', '확인 코드 W41'],
  ['response-raw-field-47', '확인 코드 W47'],
  ['response-raw-field-49', '확인 코드 W49'],
  ['response-raw-field-53', '확인 코드 W53'],
  ['response-raw-field-57', '확인 코드 W57'],
  ['response-raw-continuation', '확인 코드 R2'],
  ['response-raw-disconnect', '확인 코드 R3'],
  ['response-raw-title', '확인 코드 R4'],
  ['response-raw-routing', '확인 코드 R5'],
  ['response-raw-attribution', '확인 코드 R6'],
  ['response-raw-history', '확인 코드 R7'],
  ['response-raw-quota', '확인 코드 R8'],
  ['response-raw-heartbeat', '확인 코드 R9'],
  ['response-raw-string', '확인 코드 R10'],
  ['response-raw-enum', '확인 코드 R11'],
  ['response-raw-client', '확인 코드 R12'],
  ['response-raw-supplement', '확인 코드 R13'],
  ['response-candidate-lists', '답변의 추가 내용'],
  ['response-candidate-extra', '답변의 추가 정보'],
  ['response-final-metadata', '최종 응답 정보'],
  ['response-answer', '시험 답변'],
  ['response-content', '응답의 내용 구성'],
  ['response-selected', '선택된 응답'],
  ['response-action', '응답 처리 상태'],
  ['response-stream', '응답 종료'],
  ['response-error', 'Gemini 요청 처리'],
  ['response-event', '지원하지 않는 응답 흐름'],
  ['response-event-1', '확인 코드 H1'],
  ['response-event-2', '확인 코드 H2'],
  ['response-event-3', '확인 코드 H3'],
  ['dispatch-runtime-shape', '확인 코드 P1'],
  ['dispatch-route', '확인 코드 P2'],
  ['dispatch-protection', '확인 코드 P3'],
  ['dispatch-source-profile', '확인 코드 P4'],
  ['dispatch-descriptor', '확인 코드 P5'],
  ['dispatch-binding', '확인 코드 P6'],
  ['dispatch-handoff', '확인 코드 P7'],
  ['dispatch-retry', '확인 코드 P8'],
  ['dispatch-stream', '확인 코드 P9'],
  ['dispatch-backend', '확인 코드 P10'],
  ['dispatch-closed', '확인 코드 P11'],
  ['dispatch-spent', '확인 코드 P12'],
  ['dispatch-interrupted', '확인 코드 P13'],
  ['dispatch-source-stream', '확인 코드 P14'],
  ['dispatch-source-async', '확인 코드 P15'],
  ['dispatch-source-factory', '확인 코드 P16'],
  ['dispatch-source-handler', '확인 코드 P17'],
  ['dispatch-observation', '확인 코드 P18'],
  ['dispatch-source-notify', '확인 코드 P19'],
  ['client-initial', '확인 코드 P20'],
  ['client-initial-page', '확인 코드 P20-1.'],
  ['client-initial-owner', '확인 코드 P20-2.'],
  ['client-initial-owner-context', '확인 코드 P20-3.'],
  ['client-initial-owner-view', '확인 코드 P20-4.'],
  ['client-initial-owner-view-registry', '확인 코드 P20-5.'],
  ['client-initial-owner-view-missing', '확인 코드 P20-6.'],
  ['client-initial-owner-view-shape', '확인 코드 P20-7.'],
  ['client-initial-owner-view-id', '확인 코드 P20-8.'],
  ['client-initial-owner-view-metadata', '확인 코드 P20-9.'],
  ['client-initial-owner-view-flags', '확인 코드 P20-10.'],
  ['client-initial-owner-slot', '확인 코드 P20-11.'],
  ['client-initial-owner-declaration-1', '확인 코드 P20-12.'],
  ['client-initial-owner-declaration-2', '확인 코드 P20-13.'],
  ['client-initial-owner-declaration-3', '확인 코드 P20-14.'],
  ['client-initial-owner-declaration-3-node', '확인 코드 P20-15.'],
  ['client-initial-owner-declaration-3-template', '확인 코드 P20-16.'],
  ['client-initial-owner-declaration-3-binding', '확인 코드 P20-17.'],
  ['client-initial-owner-component', '확인 코드 P20-18.'],
  ['client-initial-runtime-shape', '확인 코드 P20-19.'],
  ['client-initial-service-identity', '확인 코드 P20-20.'],
  ['client-initial-protection', '확인 코드 P20-21.'],
  ['client-initial-transport-session', '확인 코드 P20-22.'],
  ['client-initial-transport-api', '확인 코드 P20-23.'],
  ['client-initial-transport-route', '확인 코드 P20-24.'],
  ['client-initial-transport-sse', '확인 코드 P20-25.'],
  ['client-initial-transport-rpc', '확인 코드 P20-26.'],
  ['client-initial-prewarm', '확인 코드 P20-27.'],
  ['client-initial-hook', '확인 코드 P20-28.'],
  ['client-initial-transport-webchannel', '확인 코드 P20-29.'],
  ['client-protection', '확인 코드 P21'],
  ['client-current', '확인 코드 P22'],
  ['response-disconnect-1', '확인 코드 D1'],
  ['response-disconnect-2', '확인 코드 D2'],
  ['response-disconnect-3', '확인 코드 D3'],
  ['response-disconnect-4', '확인 코드 D4'],
  ['response-disconnect-5', '확인 코드 D5'],
  ['response-disconnect-6', '확인 코드 D6'],
  ['response-completion', '완료된 시험 답변'],
] as const) {
  test(`fixed ${reason} failure reveals its stage without private values`, async ({ page }) => {
    const trial = await open(page, '?sdk-trial=' + reason);
    await trial.getByRole('button', { name: 'Gemini 응답 시험 시작', exact: true }).click();
    await expect(trial.locator('.error')).toContainText(text);
    await expect(trial.locator('.error')).toContainText('자동으로 다시 보내지 않습니다');
    await expect(trial.getByText(/SYNTHETIC_PRIVATE_MARKER|요청은 보내지 않았습니다/)).toHaveCount(
      0,
    );
    await expect(trial.getByText('응답 확인 완료', { exact: true })).toHaveCount(0);
    await expect(trial.getByText('CROSSCHECK_GEMINI_OK', { exact: true })).toHaveCount(0);
    expect(await page.evaluate(() => window.harness.geminiSdkTrialStarts)).toBe(1);
    expect(await page.evaluate(() => window.harness.sends)).toEqual([]);
  });
}
