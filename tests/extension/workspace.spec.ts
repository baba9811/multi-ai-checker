import { test, expect } from './extension';
import { createRun } from '../../src/domains/crosscheck/workflow';

test('production panel starts without permissions or manual stage controls', async ({
  extension,
}, info) => {
  const { panel } = extension;
  await expect(panel.getByRole('heading', { name: '대화 검토' })).toBeVisible();
  await expect(panel.getByRole('button', { name: '자동 검토 시작' })).toBeDisabled();
  await expect(
    panel.getByRole('button', { name: /현재 탭(에서 가져오기|으로 변경)/ }),
  ).toBeEnabled();
  await expect(
    panel.getByRole('checkbox', { name: '원래 대화에 첨부파일이 없습니다' }),
  ).toBeDisabled();
  await expect(panel.getByRole('checkbox', { name: 'Claude 참여' })).toBeEnabled();
  await expect(panel.getByRole('button', { name: '질문 복사' })).toHaveCount(0);
  await expect(panel.getByRole('dialog')).toHaveCount(0);
  const stored = await panel.evaluate(() => chrome.storage.session.get(null));
  expect(stored['crosscheck.workspace.v1']).toBeUndefined();
  await panel.screenshot({ path: info.outputPath('workspace.png'), fullPage: true });
});

test('production manifest has only optional AI origins and a strict CSP', async ({ extension }) => {
  const { panel } = extension;
  const manifest = await panel.evaluate(() => chrome.runtime.getManifest());
  expect(manifest.manifest_version).toBe(3);
  expect(manifest.host_permissions ?? []).toEqual([]);
  expect(manifest.content_scripts ?? []).toEqual([]);
  expect(manifest.permissions?.sort()).toEqual(
    ['activeTab', 'scripting', 'sidePanel', 'storage'].sort(),
  );
  expect(manifest.content_security_policy).toEqual(
    expect.objectContaining({ extension_pages: expect.stringContaining("connect-src 'none'") }),
  );
  expect(manifest.externally_connectable).toBeUndefined();
  const permissions = await panel.evaluate(() => chrome.permissions.getAll());
  expect(permissions.origins ?? []).toEqual([]);
});

test('production session recovery never resumes ambiguous sends or renders model HTML', async ({
  extension,
}) => {
  const { panel } = extension;
  const run = createRun('세션 복구 테스트', ['chatgpt', 'claude'], 'chatgpt', 'economy');
  run.jobs[0]!.status = 'done';
  run.jobs[0]!.answer = '<img src=x onerror="window.pwned=true">';
  run.jobs[1]!.status = 'sending';
  await panel.evaluate(async (run) => {
    await chrome.storage.session.set({ 'crosscheck.workspace.v1': { run, bindings: {} } });
  }, run);
  await panel.reload();
  await expect(panel.getByRole('heading', { name: '검토 멈춤' })).toBeVisible();
  await expect(panel.locator('.run-errors')).toContainText('이미 전송됐을 수 있으니');
  await panel.getByText('검토 내역', { exact: true }).click();
  await expect(panel.locator('main img:not(.provider-logo)')).toHaveCount(0);
  expect(
    await panel.evaluate(() => (window as unknown as { pwned?: boolean }).pwned),
  ).toBeUndefined();
  await panel.getByRole('button', { name: '새 검토', exact: true }).click();
  await expect(panel.getByRole('heading', { name: '대화 검토' })).toBeVisible();
  await expect
    .poll(
      async () =>
        (await panel.evaluate(() => chrome.storage.session.get('crosscheck.workspace.v1')))[
          'crosscheck.workspace.v1'
        ],
    )
    .toEqual({ bindings: {} });
});

test('installed probe restores unfinished intent without opening a provider or requesting permission', async ({
  extension,
}) => {
  const { panel } = extension;
  await panel.evaluate(() =>
    chrome.storage.session.set({
      'crosscheck.claude-probe.v1': { id: 'fixture-attempt', status: 'pending' },
    }),
  );
  await panel.reload();
  await panel.getByRole('button', { name: '연결', exact: true }).first().click();
  await panel.getByText('백그라운드 연결 시험', { exact: true }).click();
  await expect(panel.getByText(/지난 요청의 완료 여부를 확인하지 못했습니다/)).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Claude 연결 시험 시작' })).toBeEnabled();
  expect(
    await panel.evaluate(async () =>
      (await chrome.tabs.query({})).some((tab) => tab.url?.startsWith('https://claude.ai/')),
    ),
  ).toBe(false);
  expect((await panel.evaluate(() => chrome.permissions.getAll())).origins ?? []).toEqual([]);
});
