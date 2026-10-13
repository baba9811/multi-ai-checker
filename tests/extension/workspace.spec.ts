import { test, expect } from './extension';
import { createRun } from '../../src/domains/crosscheck/workflow';
import { providerPage } from '../fixtures/providers/pages';
import { claudeProbeFixture } from '../fixtures/providers/claude-probe';

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

for (const kind of [undefined, 'context'] as const) {
  test(`installed ${kind ?? 'connection'} probe restores unfinished intent without opening a provider or requesting permission`, async ({
    extension,
  }) => {
    const { panel } = extension;
    await panel.evaluate(
      (kind) =>
        chrome.storage.session.set({
          'crosscheck.claude-probe.v1': {
            id: 'fixture-attempt',
            status: 'pending',
            ...(kind ? { kind } : {}),
          },
        }),
      kind,
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
}

test.describe('synthetic Claude permission already granted', () => {
  test.use({ syntheticClaudePermission: true });

  test('installed panel forwards the context kind and collects both verified replies through its isolated bridge', async ({
    extension,
  }) => {
    const { context, panel } = extension;
    const fixture = await claudeProbeFixture(context);
    const claude = await context.newPage();
    await claude.goto('https://claude.ai/new');
    const tabIds = await panel.evaluate(async () =>
      (await chrome.tabs.query({ url: 'https://claude.ai/new' })).map((tab) => tab.id!),
    );
    expect(tabIds).toHaveLength(1);
    const tabId = tabIds[0]!;
    // Chrome-created first navigations may precede Playwright routing. Allocation is not under test here.
    await panel.evaluate((tabId) => {
      chrome.tabs.create = (async (options: chrome.tabs.CreateProperties) => {
        if (options.url !== 'https://claude.ai/new' || options.active !== false)
          throw new Error('Unexpected fixture allocation');
        return chrome.tabs.get(tabId);
      }) as typeof chrome.tabs.create;
    }, tabId);
    const other = await context.newPage();
    await other.goto('about:blank');
    await other.bringToFront();
    const activeBefore = await panel.evaluate(async () =>
      (await chrome.tabs.query({ active: true, currentWindow: true })).map((t) => t.id),
    );
    await panel.getByRole('button', { name: '연결', exact: true }).first().click();
    await panel.getByText('백그라운드 연결 시험', { exact: true }).click();
    await panel.getByRole('button', { name: '문맥·후속 응답 시험 시작', exact: true }).click();
    await expect(panel.getByText('문맥·후속 응답 시험 완료', { exact: true })).toBeVisible();
    await expect(panel.getByText(/First reply: CROSSCHECK_CONTEXT_OK\/47/)).toBeVisible();
    await expect(panel.getByText(/Follow-up reply: 47\/CROSSCHECK_CONTEXT_OK/)).toBeVisible();
    expect(fixture.posts()).toBe(2);
    expect(fixture.requests[0]?.conversation).toBe(fixture.requests[1]?.conversation);
    const stored = (
      await panel.evaluate(() => chrome.storage.session.get('crosscheck.claude-probe.v1'))
    )['crosscheck.claude-probe.v1'];
    expect(stored).toEqual({ id: expect.any(String), kind: 'context', status: 'done' });
    expect(
      await panel.evaluate(async () =>
        (await chrome.tabs.query({ active: true, currentWindow: true })).map((t) => t.id),
      ),
    ).toEqual(activeBefore);
    expect(await other.evaluate(() => document.hasFocus())).toBe(true);
  });

  test('installed Claude model picker captures its choice before asynchronous cleanup without moving focus', async ({
    extension,
  }) => {
    const { context, panel } = extension;
    const url = 'https://claude.ai/new';
    const claude = await context.newPage();
    await claude.route('https://claude.ai/**', (route) =>
      route.fulfill({ contentType: 'text/html', body: providerPage('claude') }),
    );
    await claude.goto(url);
    await claude.evaluate(() => {
      const trigger = document.createElement('button');
      trigger.dataset.testid = 'model-selector-dropdown';
      trigger.textContent = 'Sonnet fixture Medium';
      trigger.setAttribute('aria-expanded', 'false');
      trigger.dataset.menuOpens = '0';
      const menu = document.createElement('div');
      menu.setAttribute('role', 'menu');
      menu.hidden = true;
      const option = document.createElement('button');
      option.setAttribute('role', 'menuitemradio');
      option.setAttribute('aria-checked', 'true');
      option.dataset.modelId = 'claude-private-fixture-key';
      option.textContent = 'Sonnet fixture';
      menu.append(option);
      trigger.onclick = () => {
        trigger.dataset.menuOpens = String(Number(trigger.dataset.menuOpens) + 1);
        menu.hidden = !menu.hidden;
        trigger.setAttribute('aria-expanded', String(!menu.hidden));
        if (!menu.hidden) option.focus();
      };
      option.onkeydown = (event) => {
        if (event.key !== 'Escape') return;
        setTimeout(() => {
          menu.remove();
          option.textContent = '';
          trigger.setAttribute('aria-expanded', 'false');
        }, 20);
      };
      document.body.prepend(trigger, menu);
    });
    expect(
      await panel.evaluate(() => chrome.permissions.contains({ origins: ['https://claude.ai/*'] })),
    ).toBe(true);
    const tabs = await panel.evaluate(
      async (url) =>
        (await chrome.tabs.query({})).filter((tab) => tab.url === url).map((tab) => tab.id!),
      url,
    );
    expect(tabs).toHaveLength(1);
    const tabId = tabs[0]!;
    await panel.evaluate(async (tabId) => {
      await chrome.scripting.executeScript({
        target: { tabId, frameIds: [0] },
        files: ['bridge.js'],
        world: 'ISOLATED',
      });
    }, tabId);
    const snapshot = await panel.evaluate(
      (tabId) => chrome.tabs.sendMessage(tabId, { type: 'snapshot' }),
      tabId,
    );
    expect(snapshot.ok).toBe(true);
    const other = await context.newPage();
    await other.goto('about:blank');
    await other.bringToFront();
    const activeBefore = await panel.evaluate(async () =>
      (await chrome.tabs.query({ active: true, currentWindow: true })).map((tab) => tab.id),
    );
    expect(activeBefore).toHaveLength(1);
    expect(activeBefore[0]).not.toBe(tabId);
    const catalog = await panel.evaluate(
      ({ tabId, documentId, url }) =>
        chrome.tabs.sendMessage(tabId, { type: 'models', documentId, url }),
      { tabId, documentId: snapshot.data.documentId, url },
    );
    expect(catalog).toEqual({
      ok: true,
      data: {
        current: 'Sonnet fixture',
        options: [{ key: 'Sonnet fixture', label: 'Sonnet fixture', disabled: false }],
      },
    });
    expect(JSON.stringify(catalog)).not.toContain('claude-private-fixture-key');
    await expect(claude.getByTestId('model-selector-dropdown')).toHaveAttribute(
      'data-menu-opens',
      '1',
    );
    await expect(claude.getByTestId('model-selector-dropdown')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(claude.getByRole('menu')).not.toBeVisible();
    expect(
      await claude.evaluate(() => (window as unknown as { fixtureSent: string[] }).fixtureSent),
    ).toEqual([]);
    expect(
      await panel.evaluate(async () =>
        (await chrome.tabs.query({ active: true, currentWindow: true })).map((tab) => tab.id),
      ),
    ).toEqual(activeBefore);
    expect(await other.evaluate(() => document.hasFocus())).toBe(true);
  });
});
