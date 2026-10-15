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
  expect(await control(page, bootstrap, 'terminalError')).toBe('client-initial-owner-context');
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
  for (const state of ['empty', 'saa', 'vNc'] as const) {
    test(`Native62 compiled source initial state ${state} preserves admission and original completion/history`, async ({
      page,
    }) => {
      const { bootstrap } = await setup(page, true);
      expect(
        await page.evaluate((state) => {
          const f = (window as any).fixtureNative;
          if (state !== 'empty')
            f.thread.emit({ ...f.thread.latest, [state]: state === 'saa' ? {} : true });
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
  test('Native63 compiled exact current construction waits for original completion and same-CID history', async ({
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
          version: f.packet.request.vS,
          privacy: f.packet.request.s4d.fl[0],
        };
      }),
    ).toEqual({ envelope: ['request', 'g8a', 'h8a'], version: '', privacy: 1 });
    expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'pending' });
    await expect
      .poll(() => page.evaluate(() => (window as any).fixtureNative.native.calls.query))
      .toBe(1);
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
          query: f.native.calls.query,
          history: f.calls.history,
          cid: f.savedHistory.wrapper().requestMessage.fl[0],
        };
      }),
    ).toEqual({ query: 1, history: 1, cid: 'c_47' });
  });
  for (const kind of ['legacy', 'mixed', 'privacy', 'g8a', 'h8a'] as const)
    test(`Native63 compiled refuses ${kind} without another query or history`, async ({ page }) => {
      const { bootstrap } = await setup(page, true);
      await page.evaluate((kind) => {
        const f = (window as any).fixtureNative;
        if (kind === 'legacy' || kind === 'mixed') {
          f.packet.R7a = f.packet.g8a;
          f.packet.S7a = f.packet.h8a;
          if (kind === 'legacy') {
            delete f.packet.g8a;
            delete f.packet.h8a;
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
          if (kind === 'privacy') f.packet.request.s4d.fl[0] = 2;
          else f.packet[kind] = kind === 'g8a' ? 'changed-valid-protection' : '1'.repeat(32);
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

  test('Native65 compiled default outbound and inbound oneof caches preserve original completion and same-CID history', async ({
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
          config: config.fl[ns.dga].get(ns.eM),
          cloned: config.fl[0].fl[ns.dga] === undefined,
          query: query.fl[ns.dga].get(ns.eM),
          text: query.fl[1].fl[ns.dga].get(ns.cM),
          sends: n.calls.nativeSends,
        };
      }),
    ).toEqual({ config: 1, cloned: true, query: 2, text: 9, sends: 0 });
    expect(await receive(page)).toEqual([2, 7, 1, 4]);
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
          envelope.fl[ns.dga].set(ns.hM, 4);
        }
        if (stage === 'RJd:after') envelope.fl[ns.dga].set(ns.hM, 2);
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
        (window as any).fixtureNative64 = { config, child: config.fl[0], originalGroup: ns.eM };
        if (kind === 'cache') {
          Object.freeze(config.fl);
          Object.freeze(config.fl[ns.dga]);
          config.fl[ns.dga].set(ns.eM, 2);
        } else ns.eM = [...ns.eM];
        try {
          n.flushOpen();
        } catch {}
      }, kind);
      await expect
        .poll(() => control(page, bootstrap, 'lease'))
        .toEqual({
          status: 'error',
          reason: kind === 'cache' ? 'dispatch-native-n20' : 'dispatch-native-n10',
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
                ? retained.config.fl[ns.dga].get(ns.eM) === 2
                : ns.eM !== retained.originalGroup,
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
        const descriptor = Object.getOwnPropertyDescriptor(ns.PF.prototype, 'pG');
        return {
          registry: ns.uPb instanceof Map,
          oldRegistry: Object.hasOwn(ns, 'fPb'),
          catalog: !!descriptor && 'value' in descriptor && typeof descriptor.value === 'function',
          catalogReceiver: Object.getPrototypeOf(f.consumer.nb) === ns.PF.prototype,
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
  async function receive(page: Page, seed = false) {
    return page.evaluate((seed) => {
      const f = (window as any).fixtureNative,
        n = f.native;
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
  test('compiled MAIN refuses equivalent original int64 raw type mutation before physical send', async ({
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
      .toEqual({ status: 'error', reason: 'dispatch-native-n20' });
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
        n.namespace.LJd(
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
    expect(await control(page, bootstrap, 'terminalError')).toBe(
      'dispatch-native-n15-config-state',
    );
    expect(await control(page, bootstrap, 'terminalError')).toBe(
      'dispatch-native-n15-config-state',
    );
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
      const source = n.namespace.LJd;
      n.namespace.LJd = () => {};
      try {
        n.flushOpen();
      } catch {
      } finally {
        n.namespace.LJd = source;
      }
    });
    await expect
      .poll(() => control(page, bootstrap, 'lease'))
      .toEqual({ status: 'error', reason: 'dispatch-native-n10' });
    expect(await control(page, bootstrap, 'terminalError')).toBe('dispatch-native-n10');
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
              else n.namespace.LJd = () => {};
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
      Object.defineProperty(f.consumer.nb, 'pG', {
        value: f.native.namespace.PF.prototype.pG,
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
      expect(await control(page, bootstrap, 'terminalError')).toBe(reason);
      expect(await control(page, bootstrap, 'lease')).toEqual({ status: 'error', reason });
    }
    expect(await control(page, bootstrap, 'terminalError', 'wrong')).toBeNull();
    expect(await counters()).toEqual({ menuClicks: 0, send: 0, query: 0, history: 0 });
    expect(await page.locator('[role="menu"]').count()).toBe(0);
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
    expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
  });
}
