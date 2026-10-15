import { test, expect } from './extension';
import {
  GeminiFixedTextTrialRecord,
  GEMINI_NATIVE_CONFIGURATION_DIAGNOSTICS,
} from '../../src/application/gemini-fixed-text-trial';
import type { BrowserContext, Page } from '@playwright/test';
import {
  geminiNativeTrialPage,
  geminiSdkTrialReadinessPage,
  geminiColdHeaderFixture,
} from '../fixtures/providers/gemini-readiness';

test('installed trial restores uncertain intent without provider allocation or permission', async ({
  extension,
}) => {
  const { panel } = extension;
  await panel.evaluate(() =>
    chrome.storage.session.set({
      'crosscheck.gemini-sdk-trial.v1': { id: 'synthetic-trial', status: 'pending' },
    }),
  );
  await panel.reload();
  await panel.getByRole('button', { name: '연결', exact: true }).first().click();
  await panel.getByText('Gemini 응답 시험', { exact: true }).click();
  await expect(panel.getByText(/지난 요청의 완료 여부를 확인하지 못했습니다/)).toBeVisible();
  expect(
    await panel.evaluate(
      async () => (await chrome.tabs.query({ url: 'https://gemini.google.com/*' })).length,
    ),
  ).toBe(0);
  expect((await panel.evaluate(() => chrome.permissions.getAll())).origins ?? []).toEqual([]);
});

test.describe('synthetic Gemini permission already granted', () => {
  test.use({ syntheticGeminiPermission: true });
  test('installed trial reaches the actual MAIN bundle, refuses missing client and retires its untouched page', async ({
    extension,
  }) => {
    const { context, panel } = extension;
    const gemini = await context.newPage();
    let requests = 0;
    await gemini.route('https://gemini.google.com/**', (route) => {
      if (['fetch', 'xhr'].includes(route.request().resourceType())) requests++;
      return route.fulfill({ contentType: 'text/html', body: geminiSdkTrialReadinessPage() });
    });
    await gemini.goto('https://gemini.google.com/app');
    const ids = await panel.evaluate(async () =>
      (await chrome.tabs.query({ url: 'https://gemini.google.com/app' })).map((tab) => tab.id!),
    );
    expect(ids).toHaveLength(1);
    // Initial navigation and interactive permission are outside this disposable installed fixture.
    await panel.evaluate((id) => {
      chrome.tabs.create = (async (options: chrome.tabs.CreateProperties) => {
        if (options.url !== 'https://gemini.google.com/app' || options.active !== false)
          throw Error('Unexpected fixture allocation');
        return chrome.tabs.get(id);
      }) as typeof chrome.tabs.create;
    }, ids[0]!);
    const other = await context.newPage();
    await other.goto('about:blank');
    await other.bringToFront();
    const activeBefore = await panel.evaluate(async () =>
      (await chrome.tabs.query({ active: true, currentWindow: true })).map((tab) => tab.id),
    );
    await panel.getByRole('button', { name: '연결', exact: true }).first().click();
    await panel.getByText('Gemini 응답 시험', { exact: true }).click();
    await panel.getByRole('button', { name: 'Gemini 응답 시험 시작', exact: true }).click();
    await expect(panel.getByText(/현재 Gemini 웹 연결을 확인하지 못했습니다/)).toBeVisible();
    await expect(panel.getByText(/확인 코드 P20-3\./)).toBeVisible();
    await expect.poll(() => gemini.isClosed()).toBe(true);
    expect(requests).toBe(0);
    expect(
      await panel.evaluate(async () =>
        (await chrome.tabs.query({ active: true, currentWindow: true })).map((tab) => tab.id),
      ),
    ).toEqual(activeBefore);
    expect(await other.evaluate(() => document.hasFocus())).toBe(true);
    expect(
      (await panel.evaluate(() => chrome.storage.session.get('crosscheck.gemini-sdk-trial.v1')))[
        'crosscheck.gemini-sdk-trial.v1'
      ],
    ).toEqual({ id: expect.any(String), status: 'uncertain' });
  });
});

test.describe('installed native receive graph with synthetic permission/allocation', () => {
  test.use({ syntheticGeminiPermission: true });
  async function begin(
    { context, panel }: { context: BrowserContext; panel: Page },
    idle?: boolean,
    polyfills = false,
    coldHeader = false,
    initialStateChange?: 'saa' | 'vNc',
    packetChange?: 'privacy' | 'legacy' | 'mixed' | 'g8a' | 'h8a',
  ) {
    const gemini = await context.newPage();
    const html = await geminiNativeTrialPage(
      'json',
      polyfills ? { snapshot: 'polyfill', send: 'polyfill', active: true } : undefined,
    );
    await gemini.route('https://gemini.google.com/**', (route) =>
      route.fulfill({ contentType: 'text/html', body: html }),
    );
    await gemini.goto('https://gemini.google.com/app');
    if (packetChange)
      await gemini.evaluate((kind) => {
        const f = (window as any).fixtureNative;
        if (kind === 'privacy')
          Object.assign(f.packet.request, f.sourceConstruction.privacy(f.packet.request, true));
        else if (kind === 'legacy' || kind === 'mixed') {
          f.packet.R7a = f.packet.g8a;
          f.packet.S7a = f.packet.h8a;
          if (kind === 'legacy') {
            delete f.packet.g8a;
            delete f.packet.h8a;
          }
          f.change.beforeSend(() =>
            queueMicrotask(() => {
              void (window as any).fixturePacketRefusal({
                query: f.native.calls.query,
                nativeSends: f.native.calls.nativeSends,
                history: f.calls.history,
              });
            }),
          );
        }
      }, packetChange);
    if (initialStateChange)
      await gemini.evaluate((field) => {
        const f = (window as any).fixtureNative;
        f.thread.emit({ ...f.thread.latest, [field]: field === 'saa' ? {} : true });
      }, initialStateChange);
    expect(
      await gemini.evaluate(() => {
        const f = (window as any).fixtureNative,
          ns = f.native.namespace;
        return {
          registry: ns.uPb instanceof Map,
          oldRegistry: Object.hasOwn(ns, 'fPb'),
          catalogReceiver: Object.getPrototypeOf(f.consumer.nb) === ns.PF.prototype,
          catalogOwnData: 'value' in Object.getOwnPropertyDescriptor(ns.PF.prototype, 'pG')!,
          oldCatalog: Object.hasOwn(ns, 'OK'),
        };
      }),
    ).toEqual({
      registry: true,
      oldRegistry: false,
      catalogReceiver: true,
      catalogOwnData: true,
      oldCatalog: false,
    });

    if (coldHeader) await gemini.evaluate(geminiColdHeaderFixture);
    if (idle !== undefined)
      await gemini.evaluate(
        (enabled) => (window as any).fixtureNative.native.registerIdle(enabled),
        idle,
      );
    const ids = await panel.evaluate(async () =>
      (await chrome.tabs.query({ url: 'https://gemini.google.com/app' })).map((tab) => tab.id!),
    );
    expect(ids).toHaveLength(1);
    // The installed production entrypoint/bridge run normally after this test-only allocation.
    await panel.evaluate((id) => {
      (window as any).fixtureAllocations = 0;
      chrome.tabs.create = (async (options: chrome.tabs.CreateProperties) => {
        if (options.url !== 'https://gemini.google.com/app' || options.active !== false)
          throw Error('Unexpected fixture allocation');
        (window as any).fixtureAllocations++;
        return chrome.tabs.get(id);
      }) as typeof chrome.tabs.create;
    }, ids[0]!);
    await panel.bringToFront();
    await panel.getByRole('button', { name: '연결', exact: true }).first().click();
    await panel.getByText('Gemini 응답 시험', { exact: true }).click();
    if (coldHeader)
      expect(await gemini.evaluate(() => (window as any).fixtureColdHeader.state.started)).toBe(
        false,
      );
    await panel.getByRole('button', { name: 'Gemini 응답 시험 시작', exact: true }).click();
    if (!initialStateChange && packetChange !== 'legacy' && packetChange !== 'mixed')
      await expect
        .poll(() => gemini.evaluate(() => (window as any).fixtureNative.native.calls.query))
        .toBe(1);
    return gemini;
  }
  async function stored(panel: Page) {
    const value = (
      await panel.evaluate(() => chrome.storage.session.get('crosscheck.gemini-sdk-trial.v1'))
    )['crosscheck.gemini-sdk-trial.v1'];
    expect(value).toEqual({
      id: expect.any(String),
      status: expect.stringMatching(/^(pending|done|uncertain)$/),
    });
    expect(JSON.stringify(value)).not.toMatch(
      /SYNTHETIC_PRIVATE|synthetic-client|c_47|r_48|rc_49|capability|handle|answer|model/,
    );
    return GeminiFixedTextTrialRecord.parse(value);
  }
  // Permission/allocation and provider graph are synthetic; production panel, injection and retirement run normally.
  for (const state of ['empty', 'saa', 'vNc', 'packet'] as const) {
    test(`Native63 installed source construction and initial state ${state} preserves admission and original completion/history`, async ({
      extension,
    }) => {
      const { panel } = extension;
      const gemini = await begin(
        extension,
        undefined,
        false,
        false,
        state === 'empty' || state === 'packet' ? undefined : state,
        state === 'packet' ? 'privacy' : undefined,
      );
      expect(
        await gemini.evaluate(() => {
          const f = (window as any).fixtureNative;
          const root = f.conversation.store.state();
          return {
            id: f.namespace.AC(root) === f.approved.storeId,
            thread: f.namespace.wC(root) === f.thread.latest,
            fallback:
              f.namespace.wC({
                'bard-conversations': { ...root['bard-conversations'], Rm: {} },
              }) === f.initialState.source.Sec,
            turns: f.initialState.source.$ec(root),
            legacy: Object.hasOwn(f.thread.latest, 'Gj'),
          };
        }),
      ).toEqual({
        id: true,
        thread: true,
        fallback: true,
        turns: { id: '', Wb: [] },
        legacy: false,
      });
      if (state !== 'empty' && state !== 'packet') {
        await expect(panel.getByRole('status')).toContainText('대화 상태를 확인하지 못했습니다.');
        expect(
          await gemini.evaluate(() => {
            const f = (window as any).fixtureNative;
            return {
              requestId: f.calls.requestId,
              send: f.calls.send,
              builder: f.calls.builder,
              query: f.native.calls.query,
              history: f.calls.history,
            };
          }),
        ).toEqual({ requestId: 0, send: 0, builder: 0, query: 0, history: 0 });
        expect(await panel.locator('.gemini-trial-result').count()).toBe(0);
        expect((await stored(panel)).status).toBe('uncertain');
        return;
      }
      const evidence: unknown[] = [];
      await gemini.exposeFunction('fixtureInitialHistory', (value: unknown) =>
        evidence.push(value),
      );
      await gemini.evaluate(() => {
        const f = (window as any).fixtureNative,
          n = f.native;
        f.savedHistory.beforeFetch(() => {
          f.calls.history++;
          void (window as any).fixtureInitialHistory({
            send: f.calls.send,
            history: f.calls.history,
            cid: f.savedHistory.wrapper().requestMessage.fl[0],
            tail: n.receiveTrace.map((value: any) => value.stage),
          });
        });
        f.change.deferSuccess();
        n.flushOpen();
        n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })));
        n.receive(n.nativeClose(5));
      });
      expect((await stored(panel)).status).toBe('pending');
      expect(await gemini.evaluate(() => (window as any).fixtureNative.calls.history)).toBe(0);
      await gemini.evaluate(() => (window as any).fixtureNative.success());
      await expect(panel.locator('.gemini-trial-result code')).toHaveText('CROSSCHECK_GEMINI_OK');
      await expect(panel.locator('.gemini-trial-result')).toContainText('Automatic fixture');
      expect(evidence).toEqual([
        { send: 1, history: 1, cid: 'c_47', tail: ['RJd:before', 'RJd:after', 'DJd'] },
      ]);
      expect((await stored(panel)).status).toBe('done');
      await expect.poll(() => gemini.isClosed()).toBe(true);
      expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
    });
  }
  for (const kind of ['legacy', 'mixed', 'privacy', 'g8a', 'h8a'] as const)
    test(`Native63 installed refuses ${kind} with zero physical sends/history`, async ({
      extension,
    }) => {
      const { panel } = extension;
      const counters: unknown[] = [];
      await extension.context.exposeBinding('fixturePacketRefusal', (_source, value) => {
        counters.push(value);
      });
      const gemini = await begin(extension, undefined, false, false, undefined, kind);
      if (kind !== 'legacy' && kind !== 'mixed')
        await gemini.evaluate((kind) => {
          const f = (window as any).fixtureNative;
          if (kind === 'privacy') f.packet.request.s4d.fl[0] = 2;
          else f.packet[kind] = kind === 'g8a' ? 'changed-valid-protection' : '1'.repeat(32);
          try {
            f.native.flushOpen();
          } catch {}
          void (window as any).fixturePacketRefusal({
            query: f.native.calls.query,
            nativeSends: f.native.calls.nativeSends,
            history: f.calls.history,
          });
        }, kind);
      await expect(panel.getByRole('status')).toContainText(
        kind === 'privacy'
          ? '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N10.'
          : '시험 요청을 확인하지 못했습니다.',
      );
      await expect.poll(async () => (await stored(panel)).status).toBe('uncertain');
      await expect(panel.locator('.gemini-trial-result')).toHaveCount(0);
      if (kind === 'legacy' || kind === 'mixed')
        await expect.poll(() => gemini.isClosed()).toBe(true);
      else {
        // Changed retained evidence makes cleanup unsafe; terminal uncertainty must quarantine it.
        expect(gemini.isClosed()).toBe(false);
        expect(
          await gemini.evaluate((kind) => {
            const f = (window as any).fixtureNative;
            return {
              mutation: kind === 'privacy' ? f.packet.request.s4d.fl[0] : f.packet[kind],
              query: f.native.calls.query,
              nativeSends: f.native.calls.nativeSends,
              history: f.calls.history,
            };
          }, kind),
        ).toEqual({
          mutation:
            kind === 'privacy' ? 2 : kind === 'g8a' ? 'changed-valid-protection' : '1'.repeat(32),
          query: 1,
          nativeSends: 0,
          history: 0,
        });
      }
      expect(counters).toContainEqual({
        query: kind === 'legacy' || kind === 'mixed' ? 0 : 1,
        nativeSends: 0,
        history: 0,
      });
      expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
    });
  for (const [kind, suffix, code] of [
    ['compact', 'compact-control', 'T1'],
    ['bare', 'header-deadline', 'T4'],
  ] as const) {
    test(`installed Native60 ${code} reaches MAIN and retires without opening or sending`, async ({
      extension,
    }) => {
      const { context, panel } = extension;
      const gemini = await context.newPage();
      const html = await geminiNativeTrialPage();
      await gemini.route('https://gemini.google.com/**', (route) =>
        route.fulfill({ contentType: 'text/html', body: html }),
      );
      await gemini.goto('https://gemini.google.com/app');
      await gemini.evaluate((kind) => {
        const f = (window as any).fixtureNative;
        (window as any).fixtureTriggerClicks = 0;
        f.host.addEventListener('click', () => (window as any).fixtureTriggerClicks++);
        if (kind === 'compact') f.host.append(f.host.querySelector('button').cloneNode(true));
        else f.owner.closest('new-model-picker-glow').replaceWith(f.owner);
      }, kind);
      const ids = await panel.evaluate(async () =>
        (await chrome.tabs.query({ url: 'https://gemini.google.com/app' })).map((tab) => tab.id!),
      );
      expect(ids).toHaveLength(1);
      await panel.evaluate(
        ({ id, reason }) => {
          (window as any).fixtureAllocations = 0;
          (window as any).fixtureTriggerIntents = 0;
          const save = chrome.storage.session.set.bind(chrome.storage.session);
          chrome.storage.session.set = (async (items: any) => {
            if (items['crosscheck.gemini-sdk-trial.v1']?.status === 'pending')
              (window as any).fixtureTriggerIntents++;
            return save(items);
          }) as typeof chrome.storage.session.set;
          chrome.tabs.create = (async (options: chrome.tabs.CreateProperties) => {
            if (options.url !== 'https://gemini.google.com/app' || options.active !== false)
              throw Error('Unexpected fixture allocation');
            (window as any).fixtureAllocations++;
            return chrome.tabs.get(id);
          }) as typeof chrome.tabs.create;
          const execute = chrome.scripting.executeScript;
          // Observe the actual MAIN result and fixed counters before automatic retirement can close its page.
          chrome.scripting.executeScript = (async (injection: any) => {
            const results = await execute(injection);
            if (results.some((entry) => (entry.result as any)?.reason === reason)) {
              const terminal = await execute({
                ...injection,
                args: [...injection.args.slice(0, 2), 'terminal-error'],
              });
              const counters = await execute({
                target: injection.target,
                world: 'MAIN',
                func: () => {
                  const f = (window as any).fixtureNative;
                  return {
                    menuClicks: (window as any).fixtureTriggerClicks,
                    send: f.calls.send,
                    query: f.native.calls.query,
                    history: f.calls.history,
                  };
                },
              });
              (window as any).fixtureTriggerObservation = {
                reason: (results[0]!.result as any).reason,
                terminal: terminal[0]!.result,
                counters: counters[0]!.result,
              };
            }
            return results;
          }) as typeof chrome.scripting.executeScript;
        },
        { id: ids[0]!, reason: `model-trigger-${suffix}` },
      );
      await panel.bringToFront();
      await panel.getByRole('button', { name: '연결', exact: true }).first().click();
      await panel.getByText('Gemini 응답 시험', { exact: true }).click();
      await panel.getByRole('button', { name: 'Gemini 응답 시험 시작', exact: true }).click();
      await expect(panel.getByRole('status')).toHaveText(
        `모델 선택 버튼을 확인하지 못했습니다. 확인 코드 ${code}. 요청의 완료 여부는 확인하지 못했으며 자동으로 다시 보내지 않습니다.`,
      );
      expect(await panel.evaluate(() => (window as any).fixtureTriggerObservation)).toEqual({
        reason: `model-trigger-${suffix}`,
        terminal: `model-trigger-${suffix}`,
        counters: { menuClicks: 0, send: 0, query: 0, history: 0 },
      });
      await expect(panel.locator('.gemini-trial-result')).toHaveCount(0);
      await expect.poll(() => gemini.isClosed()).toBe(true);
      expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
      expect(await panel.evaluate(() => (window as any).fixtureTriggerIntents)).toBe(1);
      expect((await stored(panel)).status).toBe('uncertain');
      const record = await stored(panel);
      expect(Object.keys(record).sort()).toEqual(['id', 'status']);
      await expect(
        panel.getByText(
          /model-trigger-|geminiTriggerDiagnostic|SYNTHETIC_PRIVATE|요청은 보내지 않았습니다/,
        ),
      ).toHaveCount(0);
    });
  }
  test('installed MAIN waits for the cold header owner and collects original completion and bound history', async ({
    extension,
  }) => {
    const { panel } = extension;
    const gemini = await begin(extension, undefined, false, true);
    const history: unknown[] = [];
    await gemini.exposeFunction('fixtureColdHistory', (value: unknown) => history.push(value));
    const before = await gemini.evaluate(() => {
      const f = (window as any).fixtureNative;
      f.savedHistory.beforeFetch(() => {
        f.calls.history++;
        void (window as any).fixtureColdHistory({
          ...(window as any).fixtureColdHeader.state,
          send: f.calls.send,
          query: f.native.calls.query,
          history: f.calls.history,
          cid: f.savedHistory.wrapper().requestMessage.fl[0],
          tail: f.native.receiveTrace.map((v: any) => v.stage),
        });
      });
      return {
        ...(window as any).fixtureColdHeader.state,
        currentGraph:
          document.querySelector('bard-mode-switcher') === f.owner &&
          document.querySelector('gem-button') === f.host,
        closed: document.querySelectorAll('[role="menu"]').length === 0,
      };
    });
    expect(before).toEqual({
      provisionalClicks: 0,
      finalClicks: 1,
      restored: true,
      started: true,
      starts: 1,
      provisionalAtStart: true,
      currentGraph: true,
      closed: true,
    });
    await gemini.evaluate(() => {
      const f = (window as any).fixtureNative,
        n = f.native;
      n.flushOpen();
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })));
      n.receive(n.nativeClose(5));
    });
    await expect(panel.locator('.gemini-trial-result')).toContainText('CROSSCHECK_GEMINI_OK');
    await expect(panel.locator('.gemini-trial-result')).toContainText('Automatic fixture');
    expect(history).toEqual([
      {
        provisionalClicks: 0,
        finalClicks: 1,
        restored: true,
        started: true,
        starts: 1,
        provisionalAtStart: true,
        send: 1,
        query: 1,
        history: 1,
        cid: 'c_47',
        tail: ['RJd:before', 'RJd:after', 'DJd'],
      },
    ]);
    expect((await stored(panel)).status).toBe('done');
    await expect.poll(() => gemini.isClosed()).toBe(true);
    expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
  });
  test('installed bundle reports the exact first configuration state predicate without another query', async ({
    extension,
  }) => {
    const { panel } = extension,
      gemini = await begin(extension),
      history: unknown[] = [];
    await gemini.exposeFunction('fixturePredicateHistory', (value: unknown) => history.push(value));
    const counts = await gemini.evaluate(() => {
      const f = (window as any).fixtureNative,
        n = f.native;
      f.savedHistory.beforeFetch(() => {
        void (window as any).fixturePredicateHistory('unexpected-history');
      });
      // The real guard rejects this entry before an original builder/send can run.
      try {
        n.namespace.LJd(
          n.graph(),
          n.ok,
          n.api.requestSource,
          n.approved.modeId,
          n.approved.clientTurnId,
        );
      } catch {}
      return {
        send: f.calls.send,
        query: n.calls.query,
        nativeSends: n.calls.nativeSends,
        history: f.calls.history,
      };
    });
    expect(counts).toEqual({ send: 1, query: 1, nativeSends: 0, history: 0 });
    const code =
      GEMINI_NATIVE_CONFIGURATION_DIAGNOSTICS.indexOf('dispatch-native-n15-config-state') + 1;
    await expect(panel.getByRole('status')).toHaveText(
      `응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 N15-${code}. 요청의 완료 여부는 확인하지 못했으며 자동으로 다시 보내지 않습니다.`,
    );
    expect((await stored(panel)).status).toBe('uncertain');
    expect(await panel.locator('.gemini-trial-result').count()).toBe(0);
    // This intact graph can retire after the refusal; the matched runner regression
    // proves post-cleanup query1/native0/history0 rather than inventing unsafe cleanup.
    await expect.poll(() => gemini.isClosed()).toBe(true);
    expect(history).toEqual([]);
    expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
  });
  test('installed bundle original int64 raw backing reaches serialization completion and bound history', async ({
    extension,
  }) => {
    const { panel } = extension,
      gemini = await begin(extension, undefined, true),
      history: unknown[] = [];
    await gemini.exposeFunction('fixtureInt64History', (value: unknown) => history.push(value));
    const evidence = await gemini.evaluate(() => {
      const f = (window as any).fixtureNative,
        n = f.native,
        [config, query] = n.queued();
      f.savedHistory.beforeFetch(() => {
        f.calls.history++;
        void (window as any).fixtureInt64History({
          send: f.calls.send,
          query: n.calls.query,
          history: f.calls.history,
          cid: f.savedHistory.wrapper().requestMessage.fl[0],
        });
      });
      const raw = config.fl[0].fl[1] === 0n && query.fl[1].fl[0] === 1n;
      n.flushOpen();
      const preserved = config.fl[0].fl[1] === 0n && query.fl[1].fl[0] === 1n;
      const json =
        JSON.parse(n.serialized()[0].data)[0][1] === 0 &&
        JSON.parse(n.serialized()[1].data)[1][0] === 1;
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })), true);
      n.receive(n.nativeClose(5), true);
      return { raw, preserved, json };
    });
    expect(evidence).toEqual({ raw: true, preserved: true, json: true });
    await expect(panel.locator('.gemini-trial-result')).toContainText('CROSSCHECK_GEMINI_OK');
    expect(history).toEqual([{ send: 1, query: 1, history: 1, cid: 'c_47' }]);
    expect((await stored(panel)).status).toBe('done');
    await expect.poll(() => gemini.isClosed()).toBe(true);
    expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
  });

  test('Native65 installed frozen inbound cache mutation preserves uncertainty and quarantine after restoration', async ({
    extension,
  }) => {
    const { panel } = extension,
      gemini = await begin(extension, undefined, true);
    await gemini.evaluate(() => {
      const f = (window as any).fixtureNative,
        n = f.native,
        ns = n.namespace;
      n.flushOpen();
      const envelope = n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true }));
      n.onReceive((stage: string) => {
        if (stage === 'RJd:before') {
          Object.freeze(envelope.fl[ns.dga]);
          envelope.fl[ns.dga].set(ns.hM, 4);
        }
        if (stage === 'RJd:after') envelope.fl[ns.dga].set(ns.hM, 2);
      });
      try {
        n.receive(envelope);
      } catch {}
    });
    await expect(panel.getByRole('status')).toContainText('확인 코드 P18.');
    await expect.poll(async () => (await stored(panel)).status).toBe('uncertain');
    await expect(panel.locator('.gemini-trial-result')).toHaveCount(0);
    expect(gemini.isClosed()).toBe(false);
    expect(
      await gemini.evaluate(() => {
        const f = (window as any).fixtureNative;
        return { send: f.calls.send, query: f.native.calls.query, history: f.calls.history };
      }),
    ).toEqual({ send: 1, query: 1, history: 0 });
    expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
  });
  for (const kind of ['cache', 'namespace'] as const) {
    test(`Native64 installed late ${kind} mutation preserves changed evidence and quarantine`, async ({
      extension,
    }) => {
      const { panel } = extension,
        gemini = await begin(extension, undefined, true);
      expect(
        await gemini.evaluate((kind) => {
          const n = (window as any).fixtureNative.native,
            ns = n.namespace,
            config = n.queued()[0];
          const prior = {
            config: config.fl[ns.dga].get(ns.eM),
            query: n.queued()[1].fl[1].fl[ns.dga].get(ns.cM),
          };
          (window as any).fixtureNative64 = { config, child: config.fl[0], originalGroup: ns.eM };
          if (kind === 'cache') {
            Object.freeze(config.fl);
            Object.freeze(config.fl[ns.dga]);
            config.fl[ns.dga].set(ns.eM, 2);
          } else ns.eM = [...ns.eM];
          try {
            n.flushOpen();
          } catch {}
          return prior;
        }, kind),
      ).toEqual({ config: 1, query: 9 });
      await expect(panel.getByRole('status')).toContainText(
        kind === 'cache' ? '확인 코드 N20.' : '확인 코드 N10.',
      );
      expect((await stored(panel)).status).toBe('uncertain');
      await expect(panel.locator('.gemini-trial-result')).toHaveCount(0);
      expect(gemini.isClosed()).toBe(false);
      expect(
        await gemini.evaluate((kind) => {
          const f = (window as any).fixtureNative,
            n = f.native,
            ns = n.namespace,
            retained = (window as any).fixtureNative64;
          return {
            changed:
              kind === 'cache'
                ? retained.config.fl[ns.dga].get(ns.eM) === 2
                : ns.eM !== retained.originalGroup,
            unchanged: retained.config.fl[0] === retained.child,
            send: f.calls.send,
            query: n.calls.query,
            sends: n.calls.nativeSends,
            serialized: n.serialized().length,
            history: f.calls.history,
          };
        }, kind),
      ).toEqual({
        changed: true,
        unchanged: true,
        send: 1,
        query: 1,
        sends: 0,
        serialized: 0,
        history: 0,
      });
      expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
    });
  }
  test('installed bundle quarantines equivalent original int64 raw type replacement', async ({
    extension,
  }) => {
    const { panel } = extension,
      gemini = await begin(extension, undefined, true);
    expect(
      await gemini.evaluate(() => {
        const n = (window as any).fixtureNative.native,
          config = n.queued()[0],
          wasBigint = config.fl[0].fl[1] === 0n;
        config.fl[0].fl[1] = '0';
        try {
          n.flushOpen();
        } catch {}
        return wasBigint;
      }),
    ).toBe(true);
    await expect(panel.getByRole('status')).toContainText('확인 코드 N20.');
    expect((await stored(panel)).status).toBe('uncertain');
    expect(await panel.locator('.gemini-trial-result').count()).toBe(0);
    expect(gemini.isClosed()).toBe(false);
    expect(
      await gemini.evaluate(() => {
        const f = (window as any).fixtureNative;
        return {
          send: f.calls.send,
          query: f.native.calls.query,
          nativeSends: f.native.calls.nativeSends,
          history: f.calls.history,
        };
      }),
    ).toEqual({ send: 1, query: 1, nativeSends: 0, history: 0 });
    expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
  });
  test('installed bundle exact public polyfills collect original callback completion and strict history', async ({
    extension,
  }) => {
    const { panel } = extension,
      gemini = await begin(extension, undefined, true);
    expect(
      await gemini.evaluate(() => {
        const n = (window as any).fixtureNative.native,
          ns = n.namespace,
          [config, query] = n.queued();
        return {
          config: config.fl[ns.dga].get(ns.eM),
          cloned: config.fl[0].fl[ns.dga] === undefined,
          query: query.fl[ns.dga].get(ns.eM),
          text: query.fl[1].fl[ns.dga].get(ns.cM),
          sends: n.calls.nativeSends,
        };
      }),
    ).toEqual({ config: 1, cloned: true, query: 2, text: 9, sends: 0 });
    const history: unknown[] = [];
    await gemini.exposeFunction('fixturePolyfillHistory', (value: unknown) => history.push(value));
    await gemini.evaluate(() => {
      const f = (window as any).fixtureNative,
        n = f.native,
        p = (window as any).fixtureContext;
      f.savedHistory.beforeFetch(() => {
        f.calls.history++;
        void (window as any).fixturePolyfillHistory({
          send: f.calls.send,
          query: n.calls.query,
          history: f.calls.history,
          cid: f.savedHistory.wrapper().requestMessage.fl[0],
        });
      });
      n.flushOpen();
      const later = {};
      let observed = false;
      n.onDecode(() => {
        observed = p.isInitial();
      });
      p.run(later, () =>
        n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })), true),
      );
      if (!observed || !p.isInitial()) throw Error('Synthetic context not restored');
      n.receive(n.nativeClose(5), true);
    });
    await expect(panel.locator('.gemini-trial-result')).toContainText('CROSSCHECK_GEMINI_OK');
    expect(history).toEqual([{ send: 1, query: 1, history: 1, cid: 'c_47' }]);
    expect((await stored(panel)).status).toBe('done');
    await expect.poll(() => gemini.isClosed()).toBe(true);
    expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
  });
  test('installed bundle refuses late public polyfill replacement without another send or history', async ({
    extension,
  }) => {
    const { panel } = extension,
      gemini = await begin(extension, undefined, true);
    await gemini.evaluate(() => {
      const f = (window as any).fixtureNative;
      (window as any).fixtureContext.context.Snapshot.wrap = () => {};
      try {
        f.native.flushOpen();
      } catch {}
    });
    await expect(panel.getByRole('status')).toContainText('확인 코드 N10.');
    expect((await stored(panel)).status).toBe('uncertain');
    expect(await panel.locator('.gemini-trial-result').count()).toBe(0);
    expect(
      await gemini.evaluate(() => {
        const f = (window as any).fixtureNative;
        return {
          send: f.calls.send,
          query: f.native.calls.query,
          nativeSends: f.native.calls.nativeSends,
          history: f.calls.history,
        };
      }),
    ).toEqual({ send: 1, query: 1, nativeSends: 0, history: 0 });
    expect(gemini.isClosed()).toBe(false);
    expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
  });
  for (const seed of [false, true])
    test(`Native65 installed source-cached receive waits for original completion and saved ${seed ? 'seed' : 'server'} identity`, async ({
      extension,
    }) => {
      const { panel } = extension;
      const gemini = await begin(extension);
      const history: unknown[] = [];
      await gemini.exposeFunction('fixtureHistoryRead', (value: unknown) => {
        history.push(value);
      });
      const caches = await gemini.evaluate((seed) => {
        const f = (window as any).fixtureNative,
          n = f.native;
        f.savedHistory.beforeFetch(() => {
          f.calls.history++;
          void (window as any).fixtureHistoryRead({
            query: n.calls.query,
            history: f.calls.history,
            cid: f.savedHistory.wrapper().requestMessage.fl[0],
            tail: n.receiveTrace.map((v: any) => v.stage),
          });
        });
        f.change.deferSuccess();
        n.flushOpen();
        if (seed) f.raw.fl[0][0][0][1] = f.approved.clientTurnId;
        const envelope = n.nativeEnvelope(
          n.nativeKf({ cid: 'c_47', ...(seed ? {} : { rid: 'r_48' }), final: true }),
        );
        n.receive(envelope);
        let value = envelope;
        return (
          [
            ['hM', 2],
            ['gM', 7],
            ['CJd', 1],
            ['fM', 4],
          ] as const
        ).map(([key, field]) => {
          const selected = value.fl[n.namespace.dga].get(n.namespace[key]);
          value = value.fl[field - 1];
          return selected;
        });
      }, seed);
      expect(caches).toEqual([2, 7, 1, 4]);
      expect(await gemini.evaluate(() => (window as any).fixtureNative.calls.history)).toBe(0);
      expect((await stored(panel)).status).toBe('pending');
      await gemini.evaluate(() => {
        const f = (window as any).fixtureNative;
        f.native.receive(f.native.nativeClose(5));
      });
      expect(await gemini.evaluate(() => (window as any).fixtureNative.calls.history)).toBe(0);
      expect((await stored(panel)).status).toBe('pending');
      await gemini.evaluate(() => (window as any).fixtureNative.success());
      await expect(panel.locator('.gemini-trial-result')).toContainText('CROSSCHECK_GEMINI_OK');
      await expect(panel.locator('.gemini-trial-result')).toContainText('Automatic fixture');
      expect(await panel.locator('.gemini-trial-result').innerText()).not.toMatch(
        /SYNTHETIC_PRIVATE|synthetic-client|c_47|r_48|rc_49|capability|handle/,
      );
      expect(history).toEqual([
        { query: 1, history: 1, cid: 'c_47', tail: ['RJd:before', 'RJd:after', 'DJd'] },
      ]);
      expect((await stored(panel)).status).toBe('done');
      await expect.poll(() => gemini.isClosed()).toBe(true);
      expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
    });
  test('installed bundle preserves observed seed routing before first-server saved completion', async ({
    extension,
  }) => {
    const { panel } = extension;
    const gemini = await begin(extension, true);
    const history: unknown[] = [];
    await gemini.exposeFunction('fixtureHistoryRead', (value: unknown) => {
      history.push(value);
    });
    const retained = await gemini.evaluate(() => {
      const f = (window as any).fixtureNative,
        n = f.native;
      f.savedHistory.beforeFetch(() => {
        f.calls.history++;
        void (window as any).fixtureHistoryRead({
          query: n.calls.query,
          history: f.calls.history,
          cid: f.savedHistory.wrapper().requestMessage.fl[0],
        });
      });
      n.flushOpen();
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47' })));
      const first = f.forwarded[0];
      const raw = n.nativeKf({ cid: 'c_47' });
      raw.fl[4] = [];
      raw.fl[20] = ['SYNTHETIC_ROUTING'];
      n.receive(n.nativeEnvelope(raw));
      const routing = f.forwarded[1],
        action = f.actions.latest,
        request = action.Wl.request;
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48' })));
      const unchanged =
        first.response.turnId === f.approved.clientTurnId &&
        routing.turnId === f.approved.clientTurnId &&
        action.Xbd === routing &&
        action.Wl.request === request &&
        request.clientTurnId === f.approved.clientTurnId;
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })));
      n.receive(n.nativeClose(5));
      return unchanged && f.packet.request.clientTurnId === f.approved.clientTurnId;
    });
    expect(retained).toBe(true);
    await expect(panel.locator('.gemini-trial-result')).toContainText('CROSSCHECK_GEMINI_OK');
    expect(await panel.locator('.gemini-trial-result').innerText()).not.toMatch(
      /SYNTHETIC_PRIVATE|synthetic-client|c_47|r_48|rc_49|capability|handle/,
    );
    expect(history).toEqual([{ query: 1, history: 1, cid: 'c_47' }]);
    expect((await stored(panel)).status).toBe('done');
    await expect.poll(() => gemini.isClosed()).toBe(true);
    expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
  });
  for (const scenario of [
    'late-rid',
    'close-only',
    'queued-stop',
    'inside-stop',
    'owner',
    'source',
  ] as const)
    test(`installed bundle refuses ${scenario} without history or retry`, async ({ extension }) => {
      const { panel } = extension;
      const gemini = await begin(extension);
      const observed = await gemini.evaluate((scenario) => {
        const f = (window as any).fixtureNative,
          n = f.native;
        try {
          if (scenario === 'queued-stop') {
            document.dispatchEvent(new Event('input'));
            n.flushOpen();
          } else if (scenario === 'owner' || scenario === 'source') {
            if (scenario === 'owner') f.consumer.Oa = {};
            else n.namespace.LJd = () => {};
            n.flushOpen();
          } else {
            n.flushOpen();
            if (scenario === 'close-only') n.receive(n.nativeClose(5));
            else {
              if (scenario === 'inside-stop')
                n.onReceive((stage: string) => {
                  if (stage === 'RJd:before') document.dispatchEvent(new Event('input'));
                });
              n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', final: true })));
              if (scenario === 'late-rid')
                n.receive(
                  n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'late-server', final: true })),
                );
            }
          }
        } catch {
          /* Expected closed native physical/receive boundary. */
        }
        return {
          query: n.calls.query,
          history: f.calls.history,
          physical: n.calls.nativeSends,
          tail: n.receiveTrace.map((v: any) => v.stage),
        };
      }, scenario);
      await expect.poll(async () => (await stored(panel)).status).toBe('uncertain');
      if (scenario === 'source')
        await expect(panel.getByRole('status')).toContainText('확인 코드 N10.');
      await expect(panel.locator('.gemini-trial-result')).toHaveCount(0);
      expect(observed.query).toBe(1);
      expect(observed.history).toBe(0);
      if (['queued-stop', 'owner', 'source'].includes(scenario)) expect(observed.physical).toBe(0);
      if (scenario === 'inside-stop')
        expect(observed.tail).toEqual(['RJd:before', 'RJd:after', 'DJd']);
      expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
      const tabsBefore = await panel.evaluate(async () =>
        (await chrome.tabs.query({ url: 'https://gemini.google.com/*' })).map((tab) => tab.id),
      );
      await panel.reload();
      await panel.getByRole('button', { name: '연결', exact: true }).first().click();
      await panel.getByText('Gemini 응답 시험', { exact: true }).click();
      await expect(panel.getByText(/지난 요청의 완료 여부를 확인하지 못했습니다/)).toBeVisible();
      expect((await stored(panel)).status).toBe('uncertain');
      expect(
        await panel.evaluate(async () =>
          (await chrome.tabs.query({ url: 'https://gemini.google.com/*' })).map((tab) => tab.id),
        ),
      ).toEqual(tabsBefore);
    });
  test('installed terminal refusal survives a restored fixed draft without unsafe retirement', async ({
    extension,
  }) => {
    const { panel } = extension;
    await panel.evaluate(() => {
      const execute = chrome.scripting.executeScript.bind(chrome.scripting);
      let release!: () => void;
      const firstLease = new Promise<void>((resolve) => {
        release = resolve;
      });
      (window as any).fixtureReleaseTrialLease = release;
      (window as any).fixtureTerminalErrorReads = 0;
      let leased = false;
      chrome.scripting.executeScript = (async (
        options: chrome.scripting.ScriptInjection<unknown[], unknown>,
      ) => {
        if (options.world === 'MAIN' && 'args' in options && options.args?.[2] === 'terminal-error')
          (window as any).fixtureTerminalErrorReads++;
        const result = await execute(options);
        if (
          options.world === 'MAIN' &&
          'args' in options &&
          options.args?.length === 2 &&
          !leased
        ) {
          leased = true;
          // Hold delivery, preserving the actual result, until the occupied-page check is ready.
          await firstLease;
        }
        return result;
      }) as typeof chrome.scripting.executeScript;
    });
    try {
      const gemini = await begin(extension);
      const observed = await gemini.evaluate(async () => {
        const f = (window as any).fixtureNative,
          n = f.native;
        n.flushOpen();
        const raw = n.nativeKf({ cid: 'c_terminal', rid: 'server-rid' });
        // Inner W1 admission fails in the native decoder guard, which reports P18 after unwind.
        raw.fl[0] = 'SYNTHETIC_UNSUPPORTED_RESPONSE_FIELD';
        try {
          n.receive(n.nativeEnvelope(raw));
        } catch {}
        // Let the actual MAIN operation store its terminal refusal before restoring a draft.
        for (let i = 0; i < 20; i++) await Promise.resolve();
        f.editor.textContent = f.packet.request.textQuery;
        return {
          query: n.calls.query,
          history: f.calls.history,
          draft: f.editor.textContent === f.packet.request.textQuery,
        };
      });
      expect(observed).toEqual({ query: 1, history: 0, draft: true });
      // Chrome has not received its first lease response yet: its next reservation must see the draft.
      await panel.evaluate(() => (window as any).fixtureReleaseTrialLease());
      await expect(
        panel.getByText(
          '응답 요청의 전송 상태를 확인하지 못했습니다. 확인 코드 P18. 요청의 완료 여부는 확인하지 못했으며 자동으로 다시 보내지 않습니다.',
          { exact: true },
        ),
      ).toBeVisible();
      await expect.poll(async () => (await stored(panel)).status).toBe('uncertain');
      expect(await panel.evaluate(() => (window as any).fixtureTerminalErrorReads)).toBe(1);
      await expect(panel.locator('.gemini-trial-result')).toHaveCount(0);
      expect(gemini.isClosed()).toBe(false);
      expect(
        await gemini.evaluate(() => {
          const f = (window as any).fixtureNative;
          return {
            query: f.native.calls.query,
            history: f.calls.history,
            draft: f.editor.textContent === f.packet.request.textQuery,
          };
        }),
      ).toEqual({ query: 1, history: 0, draft: true });
      expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
    } finally {
      await panel.evaluate(() => (window as any).fixtureReleaseTrialLease());
    }
  });
  test('installed control63 reconnect timer is canceled after refusal without a second query', async ({
    extension,
  }) => {
    const { panel } = extension;
    const gemini = await begin(extension);
    const observed = await gemini.evaluate(() => {
      const f = (window as any).fixtureNative,
        n = f.native;
      n.flushOpen();
      const raw = n.nativeKf({ cid: 'c_63', rid: 'server-rid' });
      raw.fl[62] = 2;
      try {
        n.receive(n.nativeEnvelope(raw));
      } catch {}
      const pending = n.shared.pending();
      for (const run of n.shared.timers) {
        try {
          run();
        } catch {}
      }
      return {
        pending,
        recovering: n.shared.state().wa,
        trace: n.receiveTrace.map((event: any) => event.stage),
        query: n.calls.query,
        config: n.calls.config,
        factory: n.calls.factory,
        history: f.calls.history,
      };
    });
    expect(observed).toEqual({
      pending: 0,
      recovering: true,
      trace: ['RJd:before', 'RJd:after', 'DJd'],
      query: 1,
      config: 1,
      factory: 1,
      history: 0,
    });
    await expect.poll(async () => (await stored(panel)).status).toBe('uncertain');
    await expect(panel.locator('.gemini-trial-result')).toHaveCount(0);
    await expect.poll(() => gemini.isClosed()).toBe(true);
    expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
  });
  for (const unsubscribeThrows of [false, true])
    test(
      unsubscribeThrows
        ? 'installed owned probe unsubscribe exception leaves retirement uncertain and quarantined'
        : 'installed owned probe cleanup safely retires after panel stop',
      async ({ extension }) => {
        const { panel } = extension;
        const gemini = await begin(extension);
        const observed = await gemini.evaluate((unsubscribeThrows) => {
          const f = (window as any).fixtureNative,
            n = f.native;
          n.flushOpen();
          const state = n.shared.state();
          state.committed = true;
          state.conversationId = 'c_probe';
          n.shared
            .observer()
            .error(Object.assign(Error('synthetic-network'), { syntheticNetwork: true }));
          if (unsubscribeThrows) n.shared.failProbeUnsubscribe();
          return {
            pending: n.shared.pending(),
            probeClosed: state.Da.closed,
            query: n.calls.query,
            history: f.calls.history,
          };
        }, unsubscribeThrows);
        expect(observed).toEqual({ pending: 1, probeClosed: false, query: 1, history: 0 });
        // Abort through the installed panel/Chrome path while the provider page stays untouched.
        await panel.getByRole('button', { name: '시험 중지', exact: true }).click();
        await expect.poll(async () => (await stored(panel)).status).toBe('uncertain');
        await expect(panel.locator('.gemini-trial-result')).toHaveCount(0);
        if (unsubscribeThrows) {
          expect(gemini.isClosed()).toBe(false);
          expect(
            await gemini.evaluate(() => ({
              query: (window as any).fixtureNative.native.calls.query,
              history: (window as any).fixtureNative.calls.history,
              probeClosed: (window as any).fixtureNative.native.shared.state().Da.closed,
            })),
          ).toEqual({ query: 1, history: 0, probeClosed: true });
        } else await expect.poll(() => gemini.isClosed()).toBe(true);
        expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
      },
    );
  test('installed Native58 catalog replacement refuses and safely retires the one allocated trial', async ({
    extension,
  }) => {
    const { panel } = extension;
    const gemini = await begin(extension);
    const observed = await gemini.evaluate(() => {
      const f = (window as any).fixtureNative,
        prototype = f.native.namespace.PF.prototype;
      const original = prototype.pG;
      const replacement = Function('_', 'return ' + original.toString())({});
      Object.defineProperty(prototype, 'pG', { value: replacement });
      try {
        f.native.flushOpen();
      } catch {}
      return {
        replacementIsDifferent: replacement !== original,
        replacementHasSameBody: replacement.toString() === original.toString(),
        query: f.native.calls.query,
        nativeSends: f.native.calls.nativeSends,
        history: f.calls.history,
      };
    });
    expect(observed).toEqual({
      replacementIsDifferent: true,
      replacementHasSameBody: true,
      query: 1,
      nativeSends: 0,
      history: 0,
    });
    await expect.poll(async () => (await stored(panel)).status).toBe('uncertain');
    await expect(panel.locator('.gemini-trial-result')).toHaveCount(0);
    await expect.poll(() => gemini.isClosed()).toBe(true);
    expect(await panel.evaluate(() => (window as any).fixtureAllocations)).toBe(1);
  });
});
