import { test, expect } from './extension';
import { createRun } from '../../src/domains/crosscheck/workflow';
import { providers } from '../../src/domains/providers/model';
import type { Workspace } from '../../src/application/ports';
import { providerPage } from '../fixtures/providers/pages';
import { claudeProbeFixture } from '../fixtures/providers/claude-probe';
import {
  geminiReadinessPage,
  geminiClientReadinessPage,
} from '../fixtures/providers/gemini-readiness';
import path from 'node:path';

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

test.describe('synthetic three-provider workflow permissions already granted', () => {
  test.use({ syntheticWorkflowPermissions: true });

  test.afterEach(async ({ extension }, info) => {
    if (
      info.title !==
      'installed panel completes one-start three-provider experimental background review with new background window from an inactive original main'
    )
      return;
    const diagnostics = await extension.panel
      .evaluate(
        () =>
          (window as unknown as { fixtureWindowDiagnostics?: unknown })
            .fixtureWindowDiagnostics ?? { unavailable: true },
      )
      .catch(() => ({ unavailable: true }));
    await info.attach('background-window-state', {
      body: JSON.stringify(diagnostics),
      contentType: 'application/json',
    });
  });

  test('closing the real extension page disconnects its pending collector without resending', async ({
    extension,
  }) => {
    const { context, panel, id } = extension;
    await context.route('https://claude.ai/**', (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: providerPage('claude').replace('},150);', '},60000);'),
      }),
    );
    const claude = await context.newPage();
    await claude.goto(providers.claude.home);
    await claude.bringToFront();
    await panel.getByRole('button', { name: '연결', exact: true }).click();
    const card = panel.getByRole('article').filter({
      has: panel.getByRole('heading', { name: 'Claude', exact: true }),
    });
    await card.getByRole('button', { name: '연결', exact: true }).click();
    await expect(card).toContainText('입력란 감지');
    await expect(card.getByRole('button', { name: '다시 연결', exact: true })).toBeEnabled();
    const main = await context.newPage();
    const sourceUrl = 'https://chatgpt.com/c/synthetic-panel-closure';
    await main.route('https://chatgpt.com/**', (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: providerPage('chatgpt').replace(
          "user('기존 질문')",
          "user('패널 종료 연결 확인 질문')",
        ),
      }),
    );
    await main.goto(sourceUrl);
    await main.bringToFront();
    await panel.getByRole('button', { name: '검토', exact: true }).click();
    await panel.getByRole('button', { name: /현재 탭(에서 가져오기|으로 변경)/ }).click();
    await expect(panel.locator('.auto-source')).toContainText('질문·답변 1쌍');
    await expect(panel.locator('.auto-source')).toContainText('ChatGPT');
    await expect(panel.locator('.source-question')).toHaveText('패널 종료 연결 확인 질문');
    await panel.getByRole('checkbox', { name: 'Gemini 참여' }).uncheck();
    await panel.getByRole('checkbox', { name: '원래 대화에 첨부파일이 없습니다' }).check();
    await panel.getByRole('button', { name: '자동 검토 시작', exact: true }).click();
    await expect.poll(() => claude.evaluate(() => (window as any).fixtureSent.length)).toBe(1);
    const stored = (
      await panel.evaluate(() => chrome.storage.session.get('crosscheck.workspace.v1'))
    )['crosscheck.workspace.v1'] as Workspace;
    const pending = stored.run!.jobs.find((job) => job.status === 'sending')!;
    expect(stored.run!.chair).toBe('chatgpt');
    expect(stored.run!.main!.url).toBe(sourceUrl);
    expect(pending.provider).toBe('claude');
    expect(pending.stage).toBe('collect');
    const binding = stored.bindings.claude!;
    await panel.close();
    const reopened = await context.newPage();
    await reopened.goto(`chrome-extension://${id}/sidepanel.html`);
    await expect(reopened.getByRole('heading', { name: '검토 멈춤', exact: true })).toBeVisible();
    await expect
      .poll(async () =>
        reopened.evaluate(
          async ({ tabId, id }) =>
            (await chrome.tabs.sendMessage(tabId, { type: 'poll', id })).data,
          { tabId: binding.tabId, id: pending.id },
        ),
      )
      .toMatchObject({
        status: 'error',
        error: expect.stringContaining('패널 연결이 끊겨'),
      });
    expect(await claude.evaluate(() => (window as any).fixtureSent)).toEqual([pending.prompt]);
    expect(await main.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  });

  for (const { savedPeers, background } of [
    { savedPeers: true, background: false },
    { savedPeers: true, background: true },
    { savedPeers: false, background: true },
  ]) {
    test(`installed panel completes one-start three-provider ${background ? 'experimental background' : 'default foreground'} review with ${savedPeers ? 'saved tabs' : 'new background window'} from an inactive original main`, async ({
      extension,
    }) => {
      const { context, panel } = extension;
      if (!savedPeers)
        await context.route(/^https?:\/\//, (route) => route.abort('blockedbyclient'));
      await panel.getByRole('button', { name: '연결', exact: true }).click();
      const claude = await context.newPage();
      const gemini = await context.newPage();
      for (const [id, page] of [
        ['claude', claude],
        ['gemini', gemini],
      ] as const) {
        await context.route(`${providers[id].origin}/**`, (route) =>
          route.fulfill({ contentType: 'text/html', body: providerPage(id) }),
        );
        await page.goto(providers[id].home);
        await page.bringToFront();
        if (savedPeers) {
          const card = panel.getByRole('article').filter({
            has: panel.getByRole('heading', { name: providers[id].name, exact: true }),
          });
          await card.getByRole('button', { name: '연결', exact: true }).click();
          await expect(card).toContainText('입력란 감지');
          await expect(card.getByRole('button', { name: '다시 연결', exact: true })).toBeEnabled();
        }
      }
      const turns = [
        { question: '첫 번째 합성 질문', answer: '첫 번째 원래 답변' },
        { question: '두 번째 합성 질문', answer: '두 번째 원래 답변' },
        { question: '세 번째 합성 질문', answer: '세 번째 원래 답변' },
      ];
      const sourceUrl = 'https://chatgpt.com/c/synthetic-three-provider-source';
      const main = await context.newPage();
      await main.route('https://chatgpt.com/**', (route) =>
        route.fulfill({
          contentType: 'text/html',
          body: providerPage('chatgpt').replace(
            "user('기존 질문');assistant('과거 답변 — 새 답변으로 수집하면 안 됨');",
            turns
              .map(
                (turn) =>
                  `user(${JSON.stringify(turn.question)});assistant(${JSON.stringify(turn.answer)});`,
              )
              .join('\n'),
          ),
        }),
      );
      await main.goto(sourceUrl);
      await main.bringToFront();
      await panel.getByRole('button', { name: '검토', exact: true }).click();
      await expect(panel.locator('.auto-source')).toContainText('질문·답변 3쌍');
      await expect(panel.locator('.source-question')).toHaveText(turns[2]!.question);
      const mainTabs = await panel.evaluate(
        async (url) => (await chrome.tabs.query({ url })).map((tab) => tab.id!),
        sourceUrl,
      );
      expect(mainTabs).toHaveLength(1);
      const mainTab = mainTabs[0]!;
      const original = await panel.evaluate(
        (tabId) => chrome.tabs.sendMessage(tabId, { type: 'snapshot' }),
        mainTab,
      );
      expect(original).toMatchObject({
        ok: true,
        data: { provider: 'chatgpt', url: sourceUrl, context: { scope: 'rendered', turns } },
      });
      for (const page of [main, claude, gemini])
        expect(
          await page.evaluate(() => (window as unknown as { fixtureSent: string[] }).fixtureSent),
        ).toEqual([]);
      const foreground = await context.newPage();
      await foreground.goto('about:blank');
      await foreground.bringToFront();
      if (!savedPeers) {
        // Chrome-created first navigations can precede Playwright routing. Stage only these two
        // allocations at about:blank; real window/tab ownership, focus, navigation and RPC remain.
        let allocationPage = context.waitForEvent('page').catch(() => undefined);
        let remaining = 2;
        await panel.exposeFunction('fixtureAllocationReady', async (url: string) => {
          const provider = (['claude', 'gemini'] as const).find((id) => providers[id].home === url);
          if (!provider) throw new Error('Unexpected fixture destination');
          const page = await allocationPage;
          if (!page) throw new Error('Allocated fixture page was not initialized');
          await page.waitForLoadState('domcontentloaded');
          expect(page.url()).toBe('about:blank');
          await page.route('**/*', (route) =>
            route.request().url() === url
              ? route.fulfill({ contentType: 'text/html', body: providerPage(provider) })
              : route.abort('blockedbyclient'),
          );
          if (--remaining > 0) allocationPage = context.waitForEvent('page').catch(() => undefined);
        });
        await panel.evaluate(() => {
          const fixture = window as unknown as {
            fixtureAllocationReady(url: string): Promise<void>;
            fixtureWindowDiagnostics: {
              reads: { requestedId: number; id?: number; type?: string; focused: boolean }[];
              focusChanges: number[];
            };
          };
          fixture.fixtureWindowDiagnostics = { reads: [], focusChanges: [] };
          const diagnostics = fixture.fixtureWindowDiagnostics;
          const getWindow = chrome.windows.get.bind(chrome.windows);
          chrome.windows.get = (async (
            requestedId: number,
            options?: chrome.windows.QueryOptions,
          ) => {
            const result = await getWindow(requestedId, options);
            if (diagnostics.reads.length < 30)
              diagnostics.reads.push({
                requestedId,
                id: result.id,
                type: result.type,
                focused: result.focused,
              });
            return result;
          }) as typeof chrome.windows.get;
          chrome.windows.onFocusChanged.addListener((id) => {
            if (diagnostics.focusChanges.length < 30) diagnostics.focusChanges.push(id);
          });
          const createWindow = chrome.windows.create.bind(chrome.windows);
          const createTab = chrome.tabs.create.bind(chrome.tabs);
          let windowId: number | undefined;
          chrome.windows.create = (async (options: chrome.windows.CreateData) => {
            if (
              windowId !== undefined ||
              options.focused !== false ||
              options.type !== 'normal' ||
              options.url !== 'https://claude.ai/new'
            )
              throw new Error('Unexpected fixture window allocation');
            const created = await createWindow({ ...options, url: 'about:blank' });
            if (created?.id === undefined || created.tabs?.length !== 1 || !created.tabs[0]?.id)
              throw new Error('Fixture window did not allocate one real tab');
            windowId = created.id;
            await fixture.fixtureAllocationReady(options.url);
            await chrome.tabs.update(created.tabs[0].id, { url: options.url });
            return chrome.windows.get(windowId, { populate: true });
          }) as typeof chrome.windows.create;
          chrome.tabs.create = (async (options: chrome.tabs.CreateProperties) => {
            if (
              windowId === undefined ||
              options.windowId !== windowId ||
              options.active !== true ||
              options.url !== 'https://gemini.google.com/app'
            )
              throw new Error('Unexpected fixture tab allocation');
            const created = await createTab({ ...options, url: 'about:blank' });
            if (!created.id) throw new Error('Fixture peer tab was not allocated');
            await fixture.fixtureAllocationReady(options.url);
            await chrome.tabs.update(created.id, { url: options.url });
            return chrome.tabs.get(created.id);
          }) as typeof chrome.tabs.create;
        });
      }
      const activeBefore = await panel.evaluate(async () =>
        (await chrome.tabs.query({ active: true })).map(({ id, windowId }) => ({ id, windowId })),
      );
      await panel.evaluate(() => {
        const observed = window as unknown as { activations: chrome.tabs.OnActivatedInfo[] };
        observed.activations = [];
        chrome.tabs.onActivated.addListener((info) => observed.activations.push(info));
      });
      await panel.getByRole('checkbox', { name: '원래 대화에 첨부파일이 없습니다' }).check();
      await panel.getByText('검토 설정', { exact: true }).click();
      const execution = panel.getByRole('checkbox', { name: '탭 전환 없이 실행 (실험)' });
      await expect(execution).not.toBeChecked();
      if (background) await execution.check();
      await panel.getByRole('button', { name: '자동 검토 시작', exact: true }).click();
      await expect(panel.getByRole('heading', { name: '검토 완료', exact: true })).toBeVisible({
        timeout: 30000,
      });
      await expect(panel.locator('.final-answer .answer')).toHaveText('새로운 chatgpt 검증 답변');
      await expect(panel.locator('.run-errors')).toHaveCount(0);
      const stored = (
        await panel.evaluate(() => chrome.storage.session.get('crosscheck.workspace.v1'))
      )['crosscheck.workspace.v1'] as Workspace;
      const run = stored.run!;
      expect(run.execution).toBe(background ? 'background' : undefined);
      expect(run.main).toEqual({
        provider: 'chatgpt',
        tabId: mainTab,
        documentId: original.data.documentId,
        url: sourceUrl,
      });
      expect(run.context).toEqual({ scope: 'rendered', turns });
      expect(run.jobs.map(({ provider, stage, status }) => ({ provider, stage, status }))).toEqual([
        { provider: 'chatgpt', stage: 'collect', status: 'done' },
        { provider: 'claude', stage: 'collect', status: 'done' },
        { provider: 'gemini', stage: 'collect', status: 'done' },
        { provider: 'claude', stage: 'review', status: 'done' },
        { provider: 'chatgpt', stage: 'synthesize', status: 'done' },
      ]);
      expect(run.jobs[0]!.answer).toBe(turns[2]!.answer);
      const actualPeers = savedPeers
        ? [claude, gemini]
        : context
            .pages()
            .filter(
              (page) =>
                page !== claude &&
                page !== gemini &&
                [providers.claude.origin, providers.gemini.origin].some((origin) =>
                  page.url().startsWith(origin),
                ),
            );
      expect(actualPeers).toHaveLength(2);
      if (!savedPeers)
        for (const page of [claude, gemini])
          expect(
            await page.evaluate(() => (window as unknown as { fixtureSent: string[] }).fixtureSent),
          ).toEqual([]);
      for (const [page, provider] of [
        [main, 'chatgpt'],
        [actualPeers.find((page) => page.url().startsWith(providers.claude.origin))!, 'claude'],
        [actualPeers.find((page) => page.url().startsWith(providers.gemini.origin))!, 'gemini'],
      ] as const) {
        const sends = await page.evaluate(
          () => (window as unknown as { fixtureSent: string[] }).fixtureSent,
        );
        expect(sends).toEqual(
          run.jobs
            .filter(
              (job) =>
                job.provider === provider && !(provider === 'chatgpt' && job.stage === 'collect'),
            )
            .map((job) => job.prompt),
        );
        for (const prompt of sends) {
          for (const [index, turn] of turns.entries())
            expect(prompt).toContain(
              `### ${index + 1}번째 질문\n${turn.question}\n\n### ${index + 1}번째 답변\n${turn.answer}`,
            );
          expect(prompt).not.toContain('검토 데이터(JSON)');
        }
      }
      const finalPrompt = run.jobs.at(-1)!.prompt;
      expect(finalPrompt).toContain(
        `## 후보 답변\n### 답변 A\n${turns[2]!.answer}\n\n### 답변 B\n새로운 claude 검증 답변\n\n### 답변 C\n새로운 gemini 검증 답변`,
      );
      expect(finalPrompt).toContain('## 교차 검토\n### 검토 1\n새로운 claude 검증 답변');
      const activations = await panel.evaluate(
        () => (window as unknown as { activations: chrome.tabs.OnActivatedInfo[] }).activations,
      );
      if (background) {
        expect(
          activations.filter(({ windowId }) =>
            activeBefore.some((tab) => tab.windowId === windowId),
          ),
        ).toEqual([]);
        expect(
          await panel.evaluate(async () =>
            (await chrome.tabs.query({ active: true })).map(({ id, windowId }) => ({
              id,
              windowId,
            })),
          ),
        ).toEqual(expect.arrayContaining(activeBefore));
      } else {
        expect(activations.map(({ tabId }) => tabId)).toEqual(expect.arrayContaining([mainTab]));
        expect(
          await panel.evaluate(async (tabId) => (await chrome.tabs.get(tabId)).active, mainTab),
        ).toBe(true);
      }
      expect(main.url()).toBe(sourceUrl);
      expect(stored.bindings.chatgpt).toEqual(run.main);
      expect(run.jobs.at(-1)!.answer).toBe('새로운 chatgpt 검증 답변');
    });
  }
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

test.describe('synthetic imported-source peer permissions already granted', () => {
  test.use({ syntheticPeerPermissions: true });
  for (const originals of [false, true])
    test(`installed panel imports fixture turns ${originals ? 'with TXT and PNG' : 'without originals'} and collects peer review without main send or focus change`, async ({
      extension,
    }) => {
      const { context, panel } = extension;
      const fixture = await claudeProbeFixture(context, { originals });
      const claude = await context.newPage();
      await claude.goto('https://claude.ai/new');
      const ids = await panel.evaluate(async () =>
        (await chrome.tabs.query({ url: 'https://claude.ai/new' })).map((t) => t.id!),
      );
      expect(ids).toHaveLength(1);
      await panel.evaluate((tabId) => {
        chrome.tabs.create = (async (options: chrome.tabs.CreateProperties) => {
          if (options.url !== 'https://claude.ai/new' || options.active !== false)
            throw new Error('Unexpected fixture allocation');
          return chrome.tabs.get(tabId);
        }) as typeof chrome.tabs.create;
      }, ids[0]!);
      const main = await context.newPage();
      await main.route('https://chatgpt.com/**', (route) =>
        route.fulfill({ contentType: 'text/html', body: providerPage('chatgpt') }),
      );
      await main.goto('https://chatgpt.com/c/synthetic-peer-source');
      await main.bringToFront();
      await expect(panel.locator('.source-preview')).toContainText('공유할 대화 전체 보기');
      if (originals)
        await panel
          .getByLabel('원본 파일 선택')
          .setInputFiles([
            path.resolve('tests/fixtures/attachments/crosscheck-facts.txt'),
            path.resolve('tests/fixtures/attachments/crosscheck-icon.png'),
          ]);
      await panel
        .getByRole('checkbox', {
          name: originals
            ? '원래 대화의 파일·이미지를 모두 선택했습니다'
            : '원래 대화에 첨부파일이 없습니다',
        })
        .check();
      await panel.getByText('검토 설정', { exact: true }).click();
      const activeBefore = await panel.evaluate(async () =>
        (await chrome.tabs.query({ active: true, currentWindow: true })).map((t) => t.id),
      );
      await panel.getByRole('button', { name: 'Claude 백그라운드 검토', exact: true }).click();
      await expect(
        panel.getByRole('heading', { name: 'Claude 검토 완료', exact: true }),
      ).toBeVisible();
      expect(fixture.posts()).toBe(2);
      expect(fixture.requests[0]!.body.prompt).toContain('기존 질문');
      expect(fixture.requests[1]!.body.prompt).toContain('과거 답변');
      if (originals) {
        expect(fixture.uploads).toEqual([{ exactBytes: true }]);
        expect(fixture.requests[0]!.body.attachments[0].extracted_content).toContain('CC-4729');
        expect(fixture.requests[0]!.body.files).toEqual(['88888888-8888-4888-8888-888888888888']);
        expect(fixture.requests[1]!.body.attachments).toEqual([]);
        expect(fixture.requests[1]!.body.files).toEqual([]);
      }
      expect(await main.evaluate(() => (window as any).fixtureSent)).toEqual([]);
      expect(await claude.evaluate(() => (window as any).fixtureSent)).toEqual([]);
      expect(
        await panel.evaluate(async () =>
          (await chrome.tabs.query({ active: true, currentWindow: true })).map((t) => t.id),
        ),
      ).toEqual(activeBefore);
      const value = (
        await panel.evaluate(() => chrome.storage.session.get('crosscheck.workspace.v1'))
      )['crosscheck.workspace.v1'] as any;
      expect(value.run.kind).toBe('claude-peer');
      expect(value.run.jobs.some((job: any) => job.stage === 'synthesize')).toBe(false);
      expect(value.bindings.claude.threadId).toBe(value.run.id);
      expect(JSON.stringify(value)).not.toContain('base64');
      await panel.reload();
      await expect(
        panel.getByRole('heading', { name: 'Claude 검토 완료', exact: true }),
      ).toBeVisible();
      expect(fixture.posts()).toBe(2);
    });
});

test('installed Gemini readiness restores uncertain metadata without dispatch or permission grant', async ({
  extension,
}) => {
  const { panel } = extension;
  await panel.evaluate(() =>
    chrome.storage.session.set({
      'crosscheck.gemini-readiness.v1': { id: 'readiness-attempt', status: 'pending' },
    }),
  );
  await panel.reload();
  await panel.getByRole('button', { name: '연결', exact: true }).first().click();
  await panel.getByText('Gemini 준비 확인', { exact: true }).click();
  await expect(panel.getByText(/지난 준비 확인이 중단됐습니다/)).toBeVisible();
  expect(
    await panel.evaluate(async () =>
      (await chrome.tabs.query({})).some((tab) =>
        tab.url?.startsWith('https://gemini.google.com/'),
      ),
    ),
  ).toBe(false);
  expect((await panel.evaluate(() => chrome.permissions.getAll())).origins ?? []).toEqual([]);
});

test.describe('synthetic Gemini permission already granted', () => {
  test.use({ syntheticGeminiPermission: true });
  for (const protection of [true, false, undefined]) {
    test(`installed origin panel reads Gemini ${String(protection)} protection through its isolated bridge without generation`, async ({
      extension,
    }) => {
      const { context, panel } = extension;
      const gemini = await context.newPage();
      let apiCalls = 0;
      await gemini.route('https://gemini.google.com/**', (route) => {
        if (['fetch', 'xhr'].includes(route.request().resourceType())) apiCalls++;
        return route.fulfill({ contentType: 'text/html', body: geminiReadinessPage(protection) });
      });
      await gemini.goto('https://gemini.google.com/app');
      const tabIds = await panel.evaluate(async () =>
        (await chrome.tabs.query({ url: 'https://gemini.google.com/app' })).map((t) => t.id!),
      );
      expect(tabIds).toHaveLength(1);
      await panel.evaluate((tabId) => {
        // Tests the isolated product bridge after allocation; initial navigation is substituted.
        chrome.tabs.create = (async (options: chrome.tabs.CreateProperties) => {
          if (options.url !== 'https://gemini.google.com/app' || options.active !== false)
            throw new Error('Unexpected fixture allocation');
          return chrome.tabs.get(tabId);
        }) as typeof chrome.tabs.create;
      }, tabIds[0]!);
      const other = await context.newPage();
      await other.goto('about:blank');
      await other.bringToFront();
      const activeBefore = await panel.evaluate(async () =>
        (await chrome.tabs.query({ active: true, currentWindow: true })).map((t) => t.id),
      );
      await panel.getByRole('button', { name: '연결', exact: true }).first().click();
      await panel.getByText('Gemini 준비 확인', { exact: true }).click();
      await panel.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }).click();
      await expect(
        panel.getByText('선택된 모델: Automatic fixture', { exact: true }),
      ).toBeVisible();
      await expect(
        panel.getByText('모델 선택 영역의 연결을 확인하지 못했습니다.', { exact: true }),
      ).toBeVisible();
      if (protection === true)
        await expect(
          panel.getByText(
            '페이지 설정에 추가 보안 검사가 켜져 있습니다. 백그라운드 전송은 아직 준비되지 않았습니다.',
            { exact: true },
          ),
        ).toBeVisible();
      else if (protection === false)
        await expect(
          panel.getByText(
            '페이지의 보안 설정값을 읽었습니다. 실제 전송 조건과 응답은 아직 검증하지 않았습니다.',
            { exact: true },
          ),
        ).toBeVisible();
      else {
        await expect(
          panel.getByText('보안 검사 상태를 확인하지 못해 백그라운드 전송을 진행하지 않습니다.', {
            exact: true,
          }),
        ).toBeVisible();
        await expect(
          panel.getByText('필요한 보안 설정이 명시돼 있지 않습니다.', { exact: true }),
        ).toBeVisible();
      }
      expect(await gemini.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
      expect(apiCalls).toBe(0);
      expect(await gemini.evaluate(() => (window as any).fixtureSent)).toEqual([]);
      const stored = (
        await panel.evaluate(() => chrome.storage.session.get('crosscheck.gemini-readiness.v1'))
      )['crosscheck.gemini-readiness.v1'];
      expect(stored).toEqual({ id: expect.any(String), status: 'done' });
      expect(
        await panel.evaluate(async () =>
          (await chrome.tabs.query({ active: true, currentWindow: true })).map((t) => t.id),
        ),
      ).toEqual(activeBefore);
      expect(await other.evaluate(() => document.hasFocus())).toBe(true);
    });
  }
});

test.describe('synthetic cached Gemini client with permission already granted', () => {
  test.use({ syntheticGeminiPermission: true });
  for (const registered of [false, true])
    test(`installed MAIN client preflight with registered connection ${registered} never calls provider methods`, async ({
      extension,
    }) => {
      const { context, panel } = extension;
      const gemini = await context.newPage();
      let apiCalls = 0;
      await gemini.route('https://gemini.google.com/**', (route) => {
        if (['fetch', 'xhr'].includes(route.request().resourceType())) apiCalls++;
        return route.fulfill({
          contentType: 'text/html',
          body: geminiClientReadinessPage(registered),
        });
      });
      await gemini.goto('https://gemini.google.com/app');
      const ids = await panel.evaluate(async () =>
        (await chrome.tabs.query({ url: 'https://gemini.google.com/app' })).map((t) => t.id!),
      );
      expect(ids).toHaveLength(1);
      await panel.evaluate((tabId) => {
        chrome.tabs.create = (async (options: chrome.tabs.CreateProperties) => {
          if (options.url !== 'https://gemini.google.com/app' || options.active !== false)
            throw Error('Unexpected fixture allocation');
          return chrome.tabs.get(tabId);
        }) as typeof chrome.tabs.create;
      }, ids[0]!);
      const other = await context.newPage();
      await other.goto('about:blank');
      await other.bringToFront();
      await panel.getByRole('button', { name: '연결', exact: true }).first().click();
      await panel.getByText('Gemini 준비 확인', { exact: true }).click();
      await panel.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }).click();
      await expect(
        panel.getByText('선택된 모델: Automatic fixture', { exact: true }),
      ).toBeVisible();
      await expect(
        panel.getByText(
          registered
            ? '이 시험에 필요한 새 전송 연결 상태를 확인하지 못했습니다.'
            : '웹 클라이언트의 준비 조건을 확인했습니다. 요청·응답은 아직 검증하지 않았습니다.',
          { exact: true },
        ),
      ).toBeVisible();
      expect(await gemini.evaluate(() => (window as any).fixtureClientCalls)).toBe(0);
      expect(await gemini.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
      expect(await gemini.evaluate(() => (window as any).fixtureSent)).toEqual([]);
      expect(apiCalls).toBe(0);
      expect(await other.evaluate(() => document.hasFocus())).toBe(true);
      expect(
        (await panel.evaluate(() => chrome.storage.session.get('crosscheck.gemini-readiness.v1')))[
          'crosscheck.gemini-readiness.v1'
        ],
      ).toEqual({ id: expect.any(String), status: 'done' });
    });
});
