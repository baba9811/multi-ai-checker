import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  geminiNativeTrialPage,
  geminiSdkTrialReadinessPage,
  geminiColdHeaderFixture,
} from '../fixtures/providers/gemini-readiness';

async function setup(page: Page, native = false, polyfills = false) {
  const html = native
    ? await geminiNativeTrialPage(
        'json',
        polyfills ? { snapshot: 'polyfill', send: 'polyfill', active: true } : undefined,
      )
    : geminiSdkTrialReadinessPage();
  await page.route('https://gemini.google.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: html }),
  );
  await page.goto('https://gemini.google.com/app');
  const source = await readFile(
    path.resolve('.output/chrome-mv3/gemini-sdk-fixed-text-trial.js'),
    'utf8',
  );
  const bootstrap = await page.evaluate((source) => (0, eval)(source), source);
  expect(bootstrap).toEqual({
    handle: expect.stringMatching(/^__crosscheckGeminiTrial_[a-f0-9]{32}$/),
    capability: expect.stringMatching(/^[a-f0-9]{64}$/),
  });
  return { source, bootstrap: bootstrap as { handle: string; capability: string } };
}

async function control(
  page: Page,
  bootstrap: { handle: string; capability: string },
  method: 'lease' | 'stop' | 'terminalError',
  capability = bootstrap.capability,
) {
  return page.evaluate(
    ({ handle, method, capability }) => (window as any)[handle][method](capability),
    { handle: bootstrap.handle, method, capability },
  );
}

test('compiled MAIN bootstrap is dormant, immutable and exposes only bounded controls', async ({
  page,
}) => {
  const { source, bootstrap } = await setup(page);
  expect(
    await page.evaluate((handle) => {
      const descriptor = Object.getOwnPropertyDescriptor(window, handle)!;
      return {
        keys: Object.keys(descriptor.value),
        frozen: Object.isFrozen(descriptor.value),
        writable: descriptor.writable,
        configurable: descriptor.configurable,
      };
    }, bootstrap.handle),
  ).toEqual({
    keys: ['terminalError', 'lease', 'stop'],
    frozen: true,
    writable: false,
    configurable: false,
  });
  expect(await control(page, bootstrap, 'terminalError')).toBeNull();
  expect(await control(page, bootstrap, 'terminalError', 'wrong')).toBeNull();
  expect(await control(page, bootstrap, 'lease', 'wrong')).toEqual({
    status: 'error',
    reason: 'interrupted',
  });
  expect(await control(page, bootstrap, 'stop', 'wrong')).toBe(false);
  expect(await page.locator('[role="menu"]').count()).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
  expect(
    await page.evaluate((source) => {
      try {
        (0, eval)(source);
        return false;
      } catch {
        return true;
      }
    }, source),
  ).toBe(true);
  expect(await control(page, bootstrap, 'stop')).toBe(true);
  expect(await control(page, bootstrap, 'lease')).toEqual({
    status: 'error',
    reason: 'interrupted',
  });
});

test('compiled MAIN first lease fails closed on a missing client and never starts twice', async ({
  page,
}) => {
  const { bootstrap } = await setup(page);
  expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'pending' });
  await expect
    .poll(() => control(page, bootstrap, 'lease'))
    .toEqual({ status: 'error', reason: 'client-initial-owner-context' });
  expect(await control(page, bootstrap, 'lease')).toEqual({
    status: 'error',
    reason: 'client-initial-owner-context',
  });
  expect(await control(page, bootstrap, 'terminalError')).toEqual({
    status: 'error',
    reason: 'client-initial-owner-context',
  });
  expect(await control(page, bootstrap, 'terminalError', 'wrong')).toBeNull();
  expect(await page.locator('[role="menu"]').count()).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  expect(JSON.stringify(await control(page, bootstrap, 'lease'))).not.toMatch(
    /SYNTHETIC_PRIVATE|fixture-mode|capability|handle/,
  );
});

for (const change of ['draft', 'route'] as const) {
  test(`compiled MAIN refuses start and retirement after a ${change} change`, async ({ page }) => {
    const { bootstrap } = await setup(page);
    if (change === 'draft') await page.locator('.ql-editor').fill('User draft');
    else await page.evaluate(() => history.replaceState({}, '', '/app/abcdef'));
    expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'error', reason: 'page' });
    expect(await control(page, bootstrap, 'stop')).toBe(false);
    expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  });
}

test.describe('compiled MAIN real native receive graph', () => {
  for (const state of ['empty', 'waa', 'gOc'] as const) {
    test(`Native62 compiled source initial state ${state} preserves admission and original completion/history`, async ({
      page,
    }) => {
      const { bootstrap } = await setup(page, true);
      expect(
        await page.evaluate((state) => {
          const f = (window as any).fixtureNative;
          if (state !== 'empty')
            f.thread.emit({ ...f.thread.latest, [state]: state === 'waa' ? {} : true });
          const root = f.conversation.store.state();
          return {
            id: f.namespace.zC(root) === f.approved.storeId,
            thread: f.namespace.xC(root) === f.thread.latest,
            fallback:
              f.namespace.xC({
                'bard-conversations': { ...root['bard-conversations'], Um: {} },
              }) === f.initialState.source.cgc,
            turns: f.initialState.source.kgc(root),
            legacy: Object.hasOwn(f.thread.latest, 'Ij'),
          };
        }, state),
      ).toEqual({
        id: true,
        thread: true,
        fallback: true,
        turns: { id: '', Wb: [] },
        legacy: false,
      });
      expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'pending' });
      if (state !== 'empty') {
        await expect
          .poll(() => control(page, bootstrap, 'lease'))
          .toEqual({ status: 'error', reason: 'capture-state' });
        expect(
          await page.evaluate(() => {
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
        return;
      }
      await expect
        .poll(() => page.evaluate(() => (window as any).fixtureNative.native.calls.query))
        .toBe(1);
      await page.evaluate(() => (window as any).fixtureNative.change.deferSuccess());
      await receive(page);
      await page.evaluate(() => {
        const f = (window as any).fixtureNative;
        f.native.receive(f.native.nativeClose(5));
      });
      expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'pending' });
      expect(await page.evaluate(() => (window as any).fixtureNative.calls.history)).toBe(0);
      await page.evaluate(() => (window as any).fixtureNative.success());
      await expect
        .poll(() => control(page, bootstrap, 'lease'))
        .toEqual({
          status: 'done',
          result: { model: 'Automatic fixture', answer: 'CROSSCHECK_GEMINI_OK' },
        });
      expect(
        await page.evaluate(() => {
          const f = (window as any).fixtureNative;
          return {
            requestId: f.calls.requestId,
            send: f.calls.send,
            history: f.calls.history,
            cid: f.savedHistory.wrapper().requestMessage.fl[0],
            tail: f.native.receiveTrace.map((value: any) => value.stage),
          };
        }),
      ).toEqual({
        requestId: 1,
        send: 1,
        history: 1,
        cid: 'c_47',
        tail: ['RJd:before', 'RJd:after', 'DJd'],
      });
    });
  }
  for (const survey of [false, true])
    test(`Native63 compiled ${survey ? 'survey ignored' : 'exact current construction'} waits for original completion and same-CID history`, async ({
      page,
    }) => {
      const { bootstrap } = await setup(page, true);
      expect(
        await page.evaluate(() => {
          const f = (window as any).fixtureNative;
          Object.assign(f.packet.request, f.sourceConstruction.privacy(f.packet.request, true));
          f.change.deferSuccess();
          return {
            envelope: Object.keys(f.packet),
            version: f.packet.request.xS,
            privacy: f.packet.request.x5d.fl[0],
          };
        }),
      ).toEqual({ envelope: ['request', 't8a', 'u8a'], version: '', privacy: 1 });
      expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'pending' });
      await expect
        .poll(() => page.evaluate(() => (window as any).fixtureNative.native.calls.query))
        .toBe(1);
      await receive(page, false, survey);
      await page.evaluate(() => {
        const f = (window as any).fixtureNative;
        f.native.receive(f.native.nativeClose(5));
      });
      expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'pending' });
      expect(await page.evaluate(() => (window as any).fixtureNative.calls.history)).toBe(0);
      await page.evaluate(() => (window as any).fixtureNative.success());
      await expect
        .poll(() => control(page, bootstrap, 'lease'))
        .toEqual({
          status: 'done',
          result: { model: 'Automatic fixture', answer: 'CROSSCHECK_GEMINI_OK' },
        });
      expect(
        await page.evaluate(() => {
          const f = (window as any).fixtureNative;
          return {
            query: f.native.calls.query,
            history: f.calls.history,
            cid: f.savedHistory.wrapper().requestMessage.fl[0],
          };
        }),
      ).toEqual({ query: 1, history: 1, cid: 'c_47' });
    });
  for (const kind of ['legacy', 'mixed', 'privacy', 't8a', 'u8a'] as const)
    test(`Native63 compiled refuses ${kind} without another query or history`, async ({ page }) => {
      const { bootstrap } = await setup(page, true);
      await page.evaluate((kind) => {
        const f = (window as any).fixtureNative;
        if (kind === 'legacy' || kind === 'mixed') {
          f.packet.R7a = f.packet.t8a;
          f.packet.S7a = f.packet.u8a;
          if (kind === 'legacy') {
            delete f.packet.t8a;
            delete f.packet.u8a;
          }
        } else if (kind === 'privacy')
          Object.assign(f.packet.request, f.sourceConstruction.privacy(f.packet.request, true));
      }, kind);
      expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'pending' });
      if (kind !== 'legacy' && kind !== 'mixed') {
        await expect
          .poll(() => page.evaluate(() => (window as any).fixtureNative.native.calls.query))
          .toBe(1);
        await page.evaluate((kind) => {
          const f = (window as any).fixtureNative;
          if (kind === 'privacy') f.packet.request.x5d.fl[0] = 2;
          else f.packet[kind] = kind === 't8a' ? 'changed-valid-protection' : '1'.repeat(32);
          try {
            f.native.flushOpen();
          } catch {}
        }, kind);
      }
      await expect
        .poll(() => control(page, bootstrap, 'lease'))
        .toEqual({
          status: 'error',
          reason: kind === 'privacy' ? 'dispatch-native-n10' : 'packet',
        });
      expect(
        await page.evaluate(() => {
          const f = (window as any).fixtureNative;
          return {
            query: f.native.calls.query,
            nativeSends: f.native.calls.nativeSends,
            history: f.calls.history,
          };
        }),
      ).toEqual({
        query: kind === 'legacy' || kind === 'mixed' ? 0 : 1,
        nativeSends: 0,
        history: 0,
      });
    });

  test('Native70 compiled full original structured projection preserves original completion and same-CID history', async ({
    page,
  }) => {
    const bootstrap = await begin(page, true);
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative,
          n = f.native,
          ns = n.namespace,
          [config, query] = n.queued();
        f.change.deferSuccess();
        return {
          config: config.fl[ns.dga].get(ns.XL),
          cloned: config.fl[0].fl[ns.dga] === undefined,
          query: query.fl[ns.dga].get(ns.XL),
          text: query.fl[1].fl[ns.dga].get(ns.VL),
          sends: n.calls.nativeSends,
        };
      }),
    ).toEqual({ config: 1, cloned: true, query: 2, text: 9, sends: 0 });
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative,
          n = f.native,
          ns = n.namespace;
        n.flushOpen();
        const raw = n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
        const node = new ns.oH([undefined, new ns.gH([undefined, 0, 'CROSSCHECK_GEMINI_OK'])]);
        raw.fl[26] = [new ns.qH([[node]])];
        raw.Fb = ns.Kaa;
        raw.tcc = ns.Kaa;
        raw.fl[1].Fb = ns.Kaa;
        raw.fl[1].tcc = ns.Kaa;
        let before: any;
        n.onReceive((stage: string, value: any) => {
          if (stage === 'RJd:before') before = value.fl;
        });
        n.receive(n.nativeEnvelope(raw), true);
        return {
          events: f.forwarded.map((event: any) => event.responseType),
          ff: raw.fl[ns.dga].get(ns.HF),
          node: raw.fl[26][0].fl[0][0].fl[ns.dga].get(ns.pH),
          detached: raw.fl !== before,
          deferred: n.deferredErrors.length,
        };
      }),
    ).toEqual({ events: ['TURN_COMPLETED', 'TURN'], ff: 0, node: 2, detached: true, deferred: 0 });
    await page.evaluate(() => {
      const f = (window as any).fixtureNative;
      f.native.receive(f.native.nativeClose(5));
    });
    expect(await page.evaluate(() => (window as any).fixtureNative.calls.history)).toBe(0);
    await page.evaluate(() => (window as any).fixtureNative.success());
    await expect
      .poll(() => control(page, bootstrap, 'lease'))
      .toEqual({
        status: 'done',
        result: { model: 'Automatic fixture', answer: 'CROSSCHECK_GEMINI_OK' },
      });
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative;
        return {
          query: f.native.calls.query,
          sends: f.native.calls.nativeSends,
          history: f.calls.history,
          cid: f.savedHistory.wrapper().requestMessage.fl[0],
        };
      }),
    ).toEqual({ query: 1, sends: 4, history: 1, cid: 'c_47' });
    expect(page.url()).toBe('https://gemini.google.com/app');
    expect(await control(page, bootstrap, 'stop')).toBe(true);
    await page.evaluate(() => history.replaceState(null, '', '/app/99'));
    expect(await control(page, bootstrap, 'stop')).toBe(false);
    await page.evaluate(() => history.replaceState(null, '', '/app/47'));
    expect(page.url()).toBe('https://gemini.google.com/app/47');
    expect(await control(page, bootstrap, 'stop')).toBe(true);
  });
  for (const detachment of [false, true])
    test(`Native70 compiled source HF cache corruption retains exact refusal and inert terminal evidence with detach=${detachment}`, async ({
      page,
    }) => {
      const bootstrap = await begin(page, true);
      const expected = {
        status: 'error',
        reason: 'dispatch-observation',
        diagnostic: { origin: 'receipt-currentness', predicate: 'cache-selection' },
      };
      await page.evaluate((detachment) => {
        const f = (window as any).fixtureNative,
          n = f.native,
          ns = n.namespace;
        n.flushOpen();
        const raw = n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true });
        if (detachment) {
          raw.Fb = ns.Kaa;
          raw.tcc = ns.Kaa;
          raw.fl[1].Fb = ns.Kaa;
          raw.fl[1].tcc = ns.Kaa;
        }
        (window as any).fixtureNative70Raw = raw;
        n.onReceive((stage: string) => {
          if (stage === 'RJd:after') {
            Object.freeze(raw.fl[ns.dga]);
            raw.fl[ns.dga].set(ns.HF, 21);
          }
        });
        try {
          n.receive(n.nativeEnvelope(raw), true);
        } catch {}
      }, detachment);
      await expect.poll(() => control(page, bootstrap, 'lease')).toEqual(expected);
      expect(await control(page, bootstrap, 'stop')).toBe(false);
      const counters = () =>
        page.evaluate(() => {
          const f = (window as any).fixtureNative,
            n = f.native;
          return { query: n.calls.query, sends: n.calls.nativeSends, history: f.calls.history };
        });
      const before = await counters();
      for (let i = 0; i < 3; i++)
        expect(await control(page, bootstrap, 'terminalError')).toEqual(expected);
      expect(await control(page, bootstrap, 'stop')).toBe(false);
      expect(await counters()).toEqual(before);
      expect(
        await page.evaluate(() => {
          const f = (window as any).fixtureNative,
            n = f.native,
            ns = n.namespace,
            raw = (window as any).fixtureNative70Raw;
          return {
            query: n.calls.query,
            history: f.calls.history,
            complete: f.complete,
            physicalState: n.graph().connection.wq.ha.hU,
            retained: raw.fl[ns.dga].get(ns.HF) === 21,
            deferred: n.deferredErrors.length,
          };
        }),
      ).toEqual({
        query: 1,
        history: 0,
        complete: false,
        physicalState: 3,
        retained: true,
        deferred: 0,
      });
    });
  test('Native65 compiled frozen inbound cache mutation latches refusal and quarantine', async ({
    page,
  }) => {
    const bootstrap = await begin(page, true);
    await page.evaluate(() => {
      const f = (window as any).fixtureNative,
        n = f.native,
        ns = n.namespace;
      n.flushOpen();
      const envelope = n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true }));
      n.onReceive((stage: string) => {
        if (stage === 'RJd:before') {
          Object.freeze(envelope.fl[ns.dga]);
          envelope.fl[ns.dga].set(ns.$L, 4);
        }
        if (stage === 'RJd:after') envelope.fl[ns.dga].set(ns.$L, 2);
      });
      try {
        n.receive(envelope);
      } catch {}
    });
    await expect
      .poll(() => control(page, bootstrap, 'lease'))
      .toEqual({
        status: 'error',
        reason: 'dispatch-observation',
        diagnostic: { origin: 'receipt-currentness', predicate: 'cache-selection' },
      });
    expect(await control(page, bootstrap, 'stop')).toBe(false);
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative;
        return { query: f.native.calls.query, history: f.calls.history };
      }),
    ).toEqual({ query: 1, history: 0 });
  });
  for (const kind of ['cache', 'namespace'] as const) {
    test(`Native64 compiled late ${kind} mutation refuses before serialization or physical send`, async ({
      page,
    }) => {
      const bootstrap = await begin(page, true);
      await page.evaluate((kind) => {
        const n = (window as any).fixtureNative.native,
          ns = n.namespace,
          config = n.queued()[0];
        (window as any).fixtureNative64 = { config, child: config.fl[0], originalGroup: ns.XL };
        if (kind === 'cache') {
          Object.freeze(config.fl);
          Object.freeze(config.fl[ns.dga]);
          config.fl[ns.dga].set(ns.XL, 2);
        } else ns.XL = [...ns.XL];
        try {
          n.flushOpen();
        } catch {}
      }, kind);
      await expect
        .poll(() => control(page, bootstrap, 'lease'))
        .toEqual({
          status: 'error',
          reason: kind === 'cache' ? 'dispatch-native-n20-forward-before' : 'dispatch-native-n10',
        });
      expect(
        await page.evaluate((kind) => {
          const f = (window as any).fixtureNative,
            n = f.native,
            ns = n.namespace,
            retained = (window as any).fixtureNative64;
          return {
            changed:
              kind === 'cache'
                ? retained.config.fl[ns.dga].get(ns.XL) === 2
                : ns.XL !== retained.originalGroup,
            unchanged: retained.config.fl[0] === retained.child,
            query: n.calls.query,
            sends: n.calls.nativeSends,
            serialized: n.serialized().length,
            history: f.calls.history,
          };
        }, kind),
      ).toEqual({ changed: true, unchanged: true, query: 1, sends: 0, serialized: 0, history: 0 });
    });
  }
  async function begin(page: Page, polyfills = false) {
    const { bootstrap } = await setup(page, true, polyfills);
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative,
          ns = f.native.namespace;
        const descriptor = Object.getOwnPropertyDescriptor(ns.QF.prototype, 'sG');
        return {
          registry: ns.zPb instanceof Map,
          oldRegistry: Object.hasOwn(ns, 'fPb'),
          catalog: !!descriptor && 'value' in descriptor && typeof descriptor.value === 'function',
          catalogReceiver: Object.getPrototypeOf(f.consumer.nb) === ns.QF.prototype,
          oldCatalog: Object.hasOwn(ns, 'OK'),
        };
      }),
    ).toEqual({
      registry: true,
      oldRegistry: false,
      catalog: true,
      catalogReceiver: true,
      oldCatalog: false,
    });

    expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'pending' });
    await expect
      .poll(() => page.evaluate(() => (window as any).fixtureNative.native.calls.query))
      .toBe(1);
    return bootstrap;
  }
  async function receive(page: Page, seed = false, survey = false) {
    return page.evaluate(
      ({ seed, survey }) => {
        const f = (window as any).fixtureNative,
          n = f.native;
        n.flushOpen();
        if (seed) f.raw.fl[0][0][0][1] = f.approved.clientTurnId;
        const raw = n.nativeKf({ cid: 'c_47', ...(seed ? {} : { rid: 'r_48' }), final: true });
        if (survey) raw.fl[24] = [['SYNTHETIC_PRIVATE_SURVEY']];
        const envelope = n.nativeEnvelope(raw);
        n.receive(envelope);
        let value = envelope;
        return (
          [
            ['$L', 2],
            ['ZL', 7],
            ['SJd', 1],
            ['iM', 4],
          ] as const
        ).map(([key, field]) => {
          const selected = value.fl[n.namespace.dga].get(n.namespace[key]);
          value = value.fl[field - 1];
          return selected;
        });
      },
      { seed, survey },
    );
  }
  test('compiled MAIN waits for a cold whole-owner header transition through original completion and history', async ({
    page,
  }) => {
    const { bootstrap } = await setup(page, true);
    await page.evaluate(geminiColdHeaderFixture);
    expect(await page.evaluate(() => (window as any).fixtureColdHeader.state.started)).toBe(false);
    expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'pending' });
    await expect
      .poll(() => page.evaluate(() => (window as any).fixtureNative.native.calls.query))
      .toBe(1);
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative;
        return {
          ...(window as any).fixtureColdHeader.state,
          currentGraph:
            document.querySelector('bard-mode-switcher') === f.owner &&
            document.querySelector('gem-button') === f.host,
          closed: document.querySelectorAll('[role="menu"]').length === 0,
        };
      }),
    ).toEqual({
      provisionalClicks: 0,
      finalClicks: 1,
      restored: true,
      started: true,
      starts: 1,
      provisionalAtStart: true,
      currentGraph: true,
      closed: true,
    });
    await receive(page);
    await page.evaluate(() => {
      const f = (window as any).fixtureNative;
      f.native.receive(f.native.nativeClose(5));
    });
    await expect
      .poll(() => control(page, bootstrap, 'lease'))
      .toEqual({
        status: 'done',
        result: { model: 'Automatic fixture', answer: 'CROSSCHECK_GEMINI_OK' },
      });
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative;
        return {
          send: f.calls.send,
          query: f.native.calls.query,
          history: f.calls.history,
          cid: f.savedHistory.wrapper().requestMessage.fl[0],
          tail: f.native.receiveTrace.map((v: any) => v.stage),
        };
      }),
    ).toEqual({
      send: 1,
      query: 1,
      history: 1,
      cid: 'c_47',
      tail: ['RJd:before', 'RJd:after', 'DJd'],
    });
  });
  test('compiled MAIN original int64 backing survives serialization and strict completion history', async ({
    page,
  }) => {
    const bootstrap = await begin(page, true);
    const evidence = await page.evaluate(() => {
      const f = (window as any).fixtureNative,
        n = f.native,
        [config, query] = n.queued();
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
    await expect
      .poll(() => control(page, bootstrap, 'lease'))
      .toEqual({
        status: 'done',
        result: { model: 'Automatic fixture', answer: 'CROSSCHECK_GEMINI_OK' },
      });
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative;
        return {
          send: f.calls.send,
          query: f.native.calls.query,
          history: f.calls.history,
          cid: f.savedHistory.wrapper().requestMessage.fl[0],
        };
      }),
    ).toEqual({ send: 1, query: 1, history: 1, cid: 'c_47' });
  });
  test('Native73 compiled MAIN propagates forward-before refusal for original int64 mutation', async ({
    page,
  }) => {
    const bootstrap = await begin(page, true);
    expect(
      await page.evaluate(() => {
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
    await expect
      .poll(() => control(page, bootstrap, 'lease'))
      .toEqual({ status: 'error', reason: 'dispatch-native-n20-forward-before' });
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative;
        return {
          query: f.native.calls.query,
          nativeSends: f.native.calls.nativeSends,
          history: f.calls.history,
        };
      }),
    ).toEqual({ query: 1, nativeSends: 0, history: 0 });
  });
  test('compiled MAIN exact public polyfills retain original callback completion and saved history', async ({
    page,
  }) => {
    const bootstrap = await begin(page, true);
    await page.evaluate(() => {
      const f = (window as any).fixtureNative,
        n = f.native,
        p = (window as any).fixtureContext;
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
    await expect
      .poll(() => control(page, bootstrap, 'lease'))
      .toEqual({
        status: 'done',
        result: { model: 'Automatic fixture', answer: 'CROSSCHECK_GEMINI_OK' },
      });
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative;
        return {
          send: f.calls.send,
          query: f.native.calls.query,
          history: f.calls.history,
          cid: f.savedHistory.wrapper().requestMessage.fl[0],
        };
      }),
    ).toEqual({ send: 1, query: 1, history: 1, cid: 'c_47' });
  });
  test('compiled MAIN refuses late public polyfill replacement without sending', async ({
    page,
  }) => {
    const bootstrap = await begin(page, true);
    await page.evaluate(() => {
      const f = (window as any).fixtureNative;
      (window as any).fixtureContext.context.Snapshot.wrap = () => {};
      try {
        f.native.flushOpen();
      } catch {}
    });
    await expect
      .poll(() => control(page, bootstrap, 'lease'))
      .toEqual({ status: 'error', reason: 'dispatch-native-n10' });
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative;
        return {
          query: f.native.calls.query,
          nativeSends: f.native.calls.nativeSends,
          history: f.calls.history,
        };
      }),
    ).toEqual({ query: 1, nativeSends: 0, history: 0 });
  });
  test('compiled MAIN retains the exact first configuration state predicate through polling', async ({
    page,
  }) => {
    const bootstrap = await begin(page);
    await page.evaluate(() => {
      const n = (window as any).fixtureNative.native;
      // A second configuration entry is refused before calling the original builder.
      try {
        n.namespace.aKd(
          n.graph(),
          n.ok,
          n.api.requestSource,
          n.approved.modeId,
          n.approved.clientTurnId,
        );
      } catch {}
    });
    await expect
      .poll(() => control(page, bootstrap, 'lease'))
      .toEqual({ status: 'error', reason: 'dispatch-native-n15-config-state' });
    expect(await control(page, bootstrap, 'terminalError')).toEqual({
      status: 'error',
      reason: 'dispatch-native-n15-config-state',
    });
    expect(await control(page, bootstrap, 'terminalError')).toEqual({
      status: 'error',
      reason: 'dispatch-native-n15-config-state',
    });
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative;
        return {
          send: f.calls.send,
          query: f.native.calls.query,
          nativeSends: f.native.calls.nativeSends,
          history: f.calls.history,
        };
      }),
    ).toEqual({ send: 1, query: 1, nativeSends: 0, history: 0 });
  });
  test('compiled MAIN preserves first native retained-descriptor diagnostic through polling', async ({
    page,
  }) => {
    const bootstrap = await begin(page);
    await page.evaluate(() => {
      const n = (window as any).fixtureNative.native;
      const source = n.namespace.aKd;
      n.namespace.aKd = () => {};
      try {
        n.flushOpen();
      } catch {
      } finally {
        n.namespace.aKd = source;
      }
    });
    await expect
      .poll(() => control(page, bootstrap, 'lease'))
      .toEqual({ status: 'error', reason: 'dispatch-native-n10' });
    expect(await control(page, bootstrap, 'terminalError')).toEqual({
      status: 'error',
      reason: 'dispatch-native-n10',
    });
    expect(
      await page.evaluate(() => ({
        query: (window as any).fixtureNative.native.calls.query,
        history: (window as any).fixtureNative.calls.history,
      })),
    ).toEqual({ query: 1, history: 0 });
  });
  for (const seed of [false, true])
    test(`collects original completion and exact saved ${seed ? 'seed' : 'server'} identity`, async ({
      page,
    }) => {
      const bootstrap = await begin(page);
      await page.evaluate(() => (window as any).fixtureNative.change.deferSuccess());
      await receive(page, seed);
      expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'pending' });
      expect(await page.evaluate(() => (window as any).fixtureNative.calls.history)).toBe(0);
      await page.evaluate(() => {
        const f = (window as any).fixtureNative;
        f.native.receive(f.native.nativeClose(5));
      });
      expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'pending' });
      expect(await page.evaluate(() => (window as any).fixtureNative.calls.history)).toBe(0);
      await page.evaluate(() => (window as any).fixtureNative.success());
      const expected = {
        status: 'done',
        result: { model: 'Automatic fixture', answer: 'CROSSCHECK_GEMINI_OK' },
      };
      await expect.poll(() => control(page, bootstrap, 'lease')).toEqual(expected);
      expect(JSON.stringify(await control(page, bootstrap, 'lease'))).not.toMatch(
        /SYNTHETIC_PRIVATE|synthetic-client|c_47|r_48|rc_49|capability|handle/,
      );
      expect(
        await page.evaluate(() => {
          const f = (window as any).fixtureNative;
          return {
            send: f.calls.send,
            query: f.native.calls.query,
            history: f.calls.history,
            cid: f.savedHistory.wrapper().requestMessage.fl[0],
            tail: f.native.receiveTrace.map((v: any) => v.stage),
          };
        }),
      ).toEqual({
        send: 1,
        query: 1,
        history: 1,
        cid: 'c_47',
        tail: ['RJd:before', 'RJd:after', 'DJd'],
      });
    });
  test('collects a registered-idle seed routing and first-server projection through the compiled bundle', async ({
    page,
  }) => {
    const { bootstrap } = await setup(page, true);
    await page.evaluate(() => (window as any).fixtureNative.native.registerIdle(false));
    expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'pending' });
    await expect
      .poll(() => page.evaluate(() => (window as any).fixtureNative.native.calls.query))
      .toBe(1);
    const retained = await page.evaluate(() => {
      const f = (window as any).fixtureNative,
        n = f.native;
      n.flushOpen();
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47' })));
      const first = f.forwarded[0];
      const raw = n.nativeKf({ cid: 'c_47' });
      raw.fl[4] = [];
      raw.fl[20] = ['SYNTHETIC_ROUTING'];
      n.receive(n.nativeEnvelope(raw));
      const routing = f.forwarded[1],
        action = f.actions.latest,
        request = action.Yl.request;
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48' })));
      const unchanged =
        first.response.turnId === f.approved.clientTurnId &&
        routing.turnId === f.approved.clientTurnId &&
        action.Wcd === routing &&
        action.Yl.request === request &&
        request.clientTurnId === f.approved.clientTurnId;
      n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true })));
      n.receive(n.nativeClose(5));
      return unchanged && f.packet.request.clientTurnId === f.approved.clientTurnId;
    });
    expect(retained).toBe(true);
    await expect
      .poll(() => control(page, bootstrap, 'lease'))
      .toEqual({
        status: 'done',
        result: { model: 'Automatic fixture', answer: 'CROSSCHECK_GEMINI_OK' },
      });
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative;
        return { query: f.native.calls.query, history: f.calls.history };
      }),
    ).toEqual({ query: 1, history: 1 });
  });
  for (const scenario of [
    'late-rid',
    'close-only',
    'queued-stop',
    'inside-stop',
    'owner',
    'source',
  ] as const)
    test(`refuses ${scenario} without history or another query`, async ({ page }) => {
      const bootstrap = await begin(page);
      await page.evaluate(
        ({ scenario, bootstrap }) => {
          const f = (window as any).fixtureNative,
            n = f.native;
          try {
            if (scenario === 'queued-stop') {
              (window as any)[bootstrap.handle].stop(bootstrap.capability);
              n.flushOpen();
            } else if (scenario === 'owner' || scenario === 'source') {
              if (scenario === 'owner') f.consumer.Oa = {};
              else n.namespace.aKd = () => {};
              n.flushOpen();
            } else {
              n.flushOpen();
              if (scenario === 'close-only') n.receive(n.nativeClose(5));
              else {
                if (scenario === 'inside-stop')
                  n.onReceive((stage: string) => {
                    if (stage === 'RJd:before')
                      (window as any)[bootstrap.handle].stop(bootstrap.capability);
                  });
                n.receive(n.nativeEnvelope(n.nativeKf({ cid: 'c_47', final: true })));
                if (scenario === 'late-rid')
                  n.receive(
                    n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'late-server', final: true })),
                  );
              }
            }
          } catch {
            /* The real native guard can refuse at the physical unwind boundary. */
          }
        },
        { scenario, bootstrap },
      );
      await expect
        .poll(async () => ((await control(page, bootstrap, 'lease')) as any).status)
        .toBe('error');
      const progress = await control(page, bootstrap, 'lease');
      expect(JSON.stringify(progress)).not.toMatch(
        /SYNTHETIC_PRIVATE|synthetic-client|c_47|late-server|capability|handle/,
      );
      const calls = await page.evaluate(() => {
        const f = (window as any).fixtureNative;
        return {
          query: f.native.calls.query,
          history: f.calls.history,
          physical: f.native.calls.nativeSends,
          tail: f.native.receiveTrace.map((v: any) => v.stage),
        };
      });
      expect(calls.query).toBe(1);
      expect(calls.history).toBe(0);
      if (['queued-stop', 'owner', 'source'].includes(scenario)) expect(calls.physical).toBe(0);
      if (scenario === 'inside-stop')
        expect(calls.tail).toEqual(['RJd:before', 'RJd:after', 'DJd']);
    });
  test('compiled MAIN Native58 refuses a late catalog shadow before native send or history', async ({
    page,
  }) => {
    const bootstrap = await begin(page);
    await page.evaluate(() => {
      const f = (window as any).fixtureNative;
      Object.defineProperty(f.consumer.nb, 'sG', {
        value: f.native.namespace.QF.prototype.sG,
        configurable: true,
      });
      try {
        f.native.flushOpen();
      } catch {}
    });
    await expect
      .poll(async () => ((await control(page, bootstrap, 'lease')) as any).status)
      .toBe('error');
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative;
        return {
          query: f.native.calls.query,
          nativeSends: f.native.calls.nativeSends,
          history: f.calls.history,
        };
      }),
    ).toEqual({ query: 1, nativeSends: 0, history: 0 });
  });
  for (const origin of ['capture', 'original-callback'] as const) {
    test(`Native66 compiled MAIN ${origin} diagnostic through ${origin === 'capture' ? 'ordinary lease' : 'settled terminal fallback'}`, async ({
      page,
    }) => {
      const expected = {
        status: 'error',
        reason: 'dispatch-observation',
        diagnostic: {
          origin,
          predicate: origin === 'capture' ? 'dispatch-native-n15-wire-06' : 'unknown',
        },
      } as const;
      const bootstrap = await begin(page);
      await page.evaluate((origin) => {
        const f = (window as any).fixtureNative,
          n = f.native;
        n.flushOpen();
        const raw = n.nativeKf({ cid: 'c_47', rid: 'r_48' });
        (window as any).fixtureNative66Raw = raw;
        if (origin === 'capture') raw.fl.extra = 'SYNTHETIC_PRIVATE';
        else
          n.project(() => {
            raw.fl[14] = true;
            throw Error('SYNTHETIC_A');
          });
        try {
          n.receive(n.nativeEnvelope(raw));
        } catch {}
        if (origin === 'original-callback') f.change.draft('SYNTHETIC_RESTORED_DRAFT');
      }, origin);
      const method = origin === 'capture' ? 'lease' : 'terminalError';
      await expect.poll(() => control(page, bootstrap, method)).toEqual(expected);
      expect(await control(page, bootstrap, 'terminalError', 'wrong')).toBeNull();
      expect(
        await page.evaluate(() => {
          const f = (window as any).fixtureNative,
            n = f.native;
          return {
            send: f.calls.send,
            query: n.calls.query,
            history: f.calls.history,
            complete: f.complete,
            physicalState: n.graph().connection.wq.ha.hU,
          };
        }),
      ).toEqual({ send: 1, query: 1, history: 0, complete: false, physicalState: 3 });
      expect(await control(page, bootstrap, 'stop')).toBe(false);
      const counters = () =>
        page.evaluate(() => {
          const f = (window as any).fixtureNative,
            n = f.native;
          return {
            query: n.calls.query,
            nativeSends: n.calls.nativeSends,
            history: f.calls.history,
          };
        });
      const beforeQueries = await counters();
      for (let query = 0; query < 3; query++)
        expect(await control(page, bootstrap, 'terminalError')).toEqual(expected);
      expect(await control(page, bootstrap, 'stop')).toBe(false);
      expect(await counters()).toEqual(beforeQueries);
      expect(
        await page.evaluate((origin) => {
          const f = (window as any).fixtureNative,
            raw = (window as any).fixtureNative66Raw;
          return {
            physicalState: f.native.graph().connection.wq.ha.hU,
            evidenceRetained:
              origin === 'capture' ? raw.fl.extra === 'SYNTHETIC_PRIVATE' : raw.fl[14] === true,
            draftRetained:
              origin !== 'original-callback' || f.draft() === 'SYNTHETIC_RESTORED_DRAFT',
          };
        }, origin),
      ).toEqual({ physicalState: 3, evidenceRetained: true, draftRetained: true });
      // MAIN is compiled production code; provider/runtime, DOM and network are synthetic.
      expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
      expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
    });
  }
  test('Native67 compiled MAIN raw text fields diagnostic P18-R3-P230 remains inert through terminal queries', async ({
    page,
  }) => {
    const expected = {
      status: 'error',
      reason: 'dispatch-observation',
      diagnostic: { origin: 'capture', predicate: 'fields-raw-text' },
    } as const;
    const bootstrap = await begin(page);
    await page.evaluate(() => {
      const f = (window as any).fixtureNative,
        n = f.native;
      n.flushOpen();
      const raw = n.nativeKf({ cid: 'c_47', rid: 'r_48' });
      (window as any).fixtureNative67Raw = raw;
      raw.fl[4][0].fl[1].fl[1] = 'SYNTHETIC_PRIVATE';
      try {
        n.receive(n.nativeEnvelope(raw));
      } catch {}
    });
    await expect.poll(() => control(page, bootstrap, 'terminalError')).toEqual(expected);
    expect(await control(page, bootstrap, 'terminalError', 'wrong')).toBeNull();
    const counters = () =>
      page.evaluate(() => {
        const f = (window as any).fixtureNative,
          n = f.native;
        return { query: n.calls.query, nativeSends: n.calls.nativeSends, history: f.calls.history };
      });
    const before = await counters();
    for (let query = 0; query < 3; query++)
      expect(await control(page, bootstrap, 'terminalError')).toEqual(expected);
    expect(await control(page, bootstrap, 'stop')).toBe(false);
    expect(await counters()).toEqual(before);
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative,
          n = f.native;
        return {
          send: f.calls.send,
          query: n.calls.query,
          history: f.calls.history,
          complete: f.complete,
          physicalState: n.graph().connection.wq.ha.hU,
          retained: (window as any).fixtureNative67Raw.fl[4][0].fl[1].fl[1] === 'SYNTHETIC_PRIVATE',
        };
      }),
    ).toEqual({ send: 1, query: 1, history: 0, complete: false, physicalState: 3, retained: true });
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
    expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
  });
  test('Native68/69 compiled root preludes and ancillary family require original completion and bound history', async ({
    page,
  }) => {
    const bootstrap = await begin(page);
    const preludes = await page.evaluate(() => {
      const f = (window as any).fixtureNative,
        n = f.native;
      f.change.deferSuccess();
      n.flushOpen();
      return [1, 3, 6].map((field) => {
        n.receive(n.nativeIgnored('root', field));
        return {
          query: n.calls.query,
          history: f.calls.history,
          complete: f.complete,
          deferredErrors: n.deferredErrors.length,
        };
      });
    });
    expect(preludes).toEqual(
      Array(3).fill({ query: 1, history: 0, complete: false, deferredErrors: 0 }),
    );
    expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'pending' });
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative,
          n = f.native;
        n.receive(
          n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true }), {
            hjd: { 1: 7n, 4: [] },
            ajd: { 1: true, 2: ['c_dead'] },
            holder: { 1: [], 2: [], 3: [] },
          }),
        );
        n.receive(n.nativeClose(5));
        return {
          deferredErrors: n.deferredErrors.length,
          query: n.calls.query,
          history: f.calls.history,
        };
      }),
    ).toEqual({ deferredErrors: 0, query: 1, history: 0 });
    expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'pending' });
    expect(await page.evaluate(() => (window as any).fixtureNative.calls.history)).toBe(0);
    await page.evaluate(() => (window as any).fixtureNative.success());
    await expect
      .poll(() => control(page, bootstrap, 'lease'))
      .toEqual({
        status: 'done',
        result: { model: 'Automatic fixture', answer: 'CROSSCHECK_GEMINI_OK' },
      });
    expect(
      await page.evaluate(() => {
        const f = (window as any).fixtureNative;
        return {
          query: f.native.calls.query,
          history: f.calls.history,
          cid: f.savedHistory.wrapper().requestMessage.fl[0],
        };
      }),
    ).toEqual({ query: 1, history: 1, cid: 'c_47' });
  });
  test('Native68 compiled known ignored root with unknown extra stays closed and terminal reads inert', async ({
    page,
  }) => {
    const bootstrap = await begin(page);
    await page.evaluate(() => {
      const f = (window as any).fixtureNative,
        n = f.native;
      n.flushOpen();
      const envelope = n.nativeIgnored('root', 1);
      envelope.fl[6] = [];
      try {
        n.receive(envelope);
      } catch {}
    });
    const expected = {
      status: 'error',
      reason: 'dispatch-observation',
      diagnostic: { origin: 'capture', predicate: 'fields-envelope-other' },
    } as const;
    await expect.poll(() => control(page, bootstrap, 'terminalError')).toEqual(expected);
    const counters = () =>
      page.evaluate(() => {
        const f = (window as any).fixtureNative,
          n = f.native;
        return {
          query: n.calls.query,
          nativeSends: n.calls.nativeSends,
          history: f.calls.history,
          complete: f.complete,
        };
      });
    const before = await counters();
    expect(before).toMatchObject({ query: 1, history: 0, complete: false });
    for (let i = 0; i < 3; i++)
      expect(await control(page, bootstrap, 'terminalError')).toEqual(expected);
    expect(await control(page, bootstrap, 'stop')).toBe(false);
    expect(await counters()).toEqual(before);
  });
  test('Native69 compiled ancillary family with unknown HJd10 stays closed and terminal reads inert', async ({
    page,
  }) => {
    const bootstrap = await begin(page);
    await page.evaluate(() => {
      const f = (window as any).fixtureNative,
        n = f.native;
      n.flushOpen();
      const envelope = n.nativeEnvelope(n.nativeKf({ cid: 'c_47', rid: 'r_48', final: true }), {
        hjd: { 1: 7n, 4: [] },
        ajd: { 1: true, 2: ['c_dead'] },
        holder: { 1: [], 2: [], 3: [] },
      });
      envelope.fl[1][9] = [];
      try {
        n.receive(envelope);
      } catch {}
    });
    const expected = {
      status: 'error',
      reason: 'dispatch-observation',
      diagnostic: { origin: 'capture', predicate: 'fields-hjd-other' },
    } as const;
    await expect.poll(() => control(page, bootstrap, 'terminalError')).toEqual(expected);
    const counters = () =>
      page.evaluate(() => {
        const f = (window as any).fixtureNative,
          n = f.native;
        return {
          query: n.calls.query,
          nativeSends: n.calls.nativeSends,
          history: f.calls.history,
          complete: f.complete,
        };
      });
    const before = await counters();
    expect(before).toMatchObject({ query: 1, history: 0, complete: false });
    for (let i = 0; i < 3; i++)
      expect(await control(page, bootstrap, 'terminalError')).toEqual(expected);
    expect(await control(page, bootstrap, 'stop')).toBe(false);
    expect(await counters()).toEqual(before);
  });
});

// Real compiled readiness predicates on invented DOM; no public error DTO or reader substitution.
for (const [kind, reason] of [
  ['compact', 'model-trigger-compact-control'],
  ['bare', 'model-trigger-header-deadline'],
] as const) {
  test(`compiled MAIN preserves Native60 ${reason} through inert terminal queries`, async ({
    page,
  }) => {
    const { bootstrap } = await setup(page, true);
    await page.evaluate((kind) => {
      const f = (window as any).fixtureNative;
      const button = f.host.querySelector('button');
      (window as any).fixtureTriggerClicks = 0;
      f.host.addEventListener('click', () => (window as any).fixtureTriggerClicks++);
      if (kind === 'compact') f.host.append(button.cloneNode(true));
      else f.owner.closest('new-model-picker-glow').replaceWith(f.owner);
    }, kind);
    expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'pending' });
    await expect.poll(() => control(page, bootstrap, 'lease')).toEqual({ status: 'error', reason });
    const counters = () =>
      page.evaluate(() => {
        const f = (window as any).fixtureNative;
        return {
          menuClicks: (window as any).fixtureTriggerClicks,
          send: f.calls.send,
          query: f.native.calls.query,
          history: f.calls.history,
        };
      });
    expect(await counters()).toEqual({ menuClicks: 0, send: 0, query: 0, history: 0 });
    for (let query = 0; query < 3; query++) {
      expect(await control(page, bootstrap, 'terminalError')).toEqual({
        status: 'error',
        reason: reason,
      });
      expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'error', reason });
    }
    expect(await control(page, bootstrap, 'terminalError', 'wrong')).toBeNull();
    expect(await counters()).toEqual({ menuClicks: 0, send: 0, query: 0, history: 0 });
    expect(await page.locator('[role="menu"]').count()).toBe(0);
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
    expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
  });
}
