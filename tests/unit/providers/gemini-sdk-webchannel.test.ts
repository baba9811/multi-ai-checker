import { describe, expect, it, vi } from 'vitest';
import { geminiSdkWebChannelFixture } from '../../fixtures/providers/gemini-sdk-webchannel';
import {
  assertGeminiTrialPacket,
  assertGeminiNativeConfiguration,
  readGeminiNativeSendKind,
} from '../../../src/infrastructure/providers/gemini/fixed-text-contract';

import * as module from '../../../src/infrastructure/providers/gemini/sdk-webchannel';
const arm = module.armGeminiColdWebChannel;
function start(f = geminiSdkWebChannelFixture()) {
  const g = arm(f.namespace, f.api, f.approved, f.current, f.consumingOriginal, f.observer);
  g.bindPacket(f.packet);
  return { f, g };
}
describe('Gemini cold WebChannel phase1', () => {
  it('provides the source-owned cold guard', () =>
    expect(module).toHaveProperty('armGeminiColdWebChannel', expect.any(Function)));
  it.each(['json', 'protobuf'] as const)(
    'preserves original %s config and query before deferred network',
    (codec) => {
      const { f, g } = start(geminiSdkWebChannelFixture(codec));
      f.originalXub();
      expect(f.calls).toMatchObject({ factory: 1, open: 1, config: 1, query: 1, forward: 0 });
      expect(f.pending()).toBe(1);
      expect(f.queued().map((v: unknown) => readGeminiNativeSendKind(f.namespace, v))).toEqual([
        'configuration',
        'query',
      ]);
      assertGeminiNativeConfiguration(f.namespace, f.queued()[0], f.ok, f.approved, 1);
      expect(g.sent()).toBe(false);
      expect(g.receiving()).toBe(false);
      g.close();
      expect(() => f.flushOpen()).toThrow();
      expect(f.calls.forward).toBe(0);
    },
  );
  it('refuses an out-of-scope registry lookup before factory', () => {
    const { f } = start();
    expect(() => f.api.Eb.get()).toThrow();
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.factory).toBe(0);
  });
  it('refuses a foreign registry receiver', () => {
    const { f } = start();
    expect(() => f.api.Eb.get.call({})).toThrow();
    expect(f.calls.factory).toBe(0);
  });
  it('refuses second binding', () => {
    const { f, g } = start();
    expect(() => g.bindPacket(f.packet)).toThrow();
  });
  it('refuses second original request', () => {
    const { f } = start();
    f.originalXub();
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.factory).toBe(1);
  });
  it('refuses second factory', () => {
    const { f } = start();
    f.originalXub();
    expect(() => f.namespace.dKd(f.api.ub, f.api.Ia, { xR: f.metadata })).toThrow();
  });
  it('refuses second configuration', () => {
    const { f } = start();
    f.originalXub();
    expect(() =>
      f.namespace.LJd(f.graph(), f.ok, 1, f.approved.modeId, f.approved.clientTurnId),
    ).toThrow();
  });
  it('refuses another queued query', () => {
    const { f } = start();
    f.originalXub();
    expect(() => f.queued().push(f.queued()[1])).toThrow();
  });
  it('refuses context ndc', () => {
    const { f } = start();
    f.originalXub();
    expect(() => f.graph().thc(new f.namespace.dM())).toThrow();
  });
  it.each(['Aa', 'protection', 'session', 'manager'] as const)(
    'refuses unsupported %s at arm',
    (kind) => {
      const f = geminiSdkWebChannelFixture();
      if (kind === 'Aa') f.api.Aa = false;
      if (kind === 'protection') f.api.Ja.isEnabled = false;
      if (kind === 'session') f.api.ub.oa = undefined;
      if (kind === 'manager') f.api.Eb.ha = {};
      expect(() => start(f)).toThrow();
    },
  );
  it('retains packet contents before a callback can restore them', () => {
    const { f, g } = start();
    f.hooks({
      current: () => {
        f.packet.request.textQuery = 'changed';
      },
      scope: () => {
        f.packet.request.textQuery = 'Reply with CROSSCHECK_GEMINI_OK only.';
      },
    });
    expect(() => f.originalXub()).toThrow();
    f.hooks({});
    f.packet.request.textQuery = 'Reply with CROSSCHECK_GEMINI_OK only.';
    expect(() => g.identity()).toThrow();
    expect(f.calls.factory).toBe(0);
  });
  it('retains the actual HJd OK contents', () => {
    const { f } = start();
    f.hooks({
      factory: () => {
        f.ok.fl[59] = 'changed';
      },
    });
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.factory).toBe(0);
  });
  it('checks cancellation immediately after a callback', () => {
    const { f, g } = start();
    f.hooks({ current: () => g.close() });
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.factory).toBe(0);
  });
  it('latches callback reentry before delegation', () => {
    const { f } = start();
    f.hooks({
      current: () => {
        try {
          f.originalXub();
        } catch {}
      },
    });
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.factory).toBe(0);
  });
  it('blocks decoded receive and fabricated completion', () => {
    const { f, g } = start();
    f.originalXub();
    expect(() => f.graph().connection.Ki.next({ eventType: 'channel_open' })).toThrow();
    expect(() =>
      g.completion({ kind: 'marker', conversationId: 'c_fake', turnId: 'r_fake' }),
    ).toThrow();
    expect(g.receiving()).toBe(false);
  });
  it('cancels the owned queue and keeps late scheduled network closed', () => {
    const { f, g } = start();
    f.originalXub();
    g.close();
    g.detach();
    expect(f.queued()).toEqual([]);
    expect(f.graph().connection.uq.ha.Da).toBeNull();
    try {
      f.flushOpen();
    } catch {}
    expect(f.calls.forward).toBe(0);
  });
  it.each([true, false])('preserves the original registered idle branch enabled=%s', (enabled) => {
    const f = geminiSdkWebChannelFixture();
    const manager = f.registerIdle(enabled);
    const { g } = start(f);
    f.originalXub();
    expect(f.calls).toMatchObject({ factory: 1, config: 1, query: 1, forward: 0 });
    expect(Object.hasOwn(manager, 'wa')).toBe(enabled);
    expect(Object.hasOwn(manager, 'Ja')).toBe(enabled);
    if (enabled)
      expect(Object.getOwnPropertyDescriptor(manager, 'wa')).toEqual({
        value: undefined,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    g.close();
    g.detach();
    expect(f.queued()).toEqual([]);
  });
  it.each(['ha', 'wa', 'Ja', 'Ga', 'ka', 'kb', 'Na', 'Oa'])(
    'refuses non-idle manager %s',
    (key) => {
      const f = geminiSdkWebChannelFixture();
      const manager = f.registerIdle();
      manager[key] = {};
      expect(() => start(f)).toThrow();
      expect(f.calls.factory).toBe(0);
    },
  );
  it.each(['wa', 'Ja'])('refuses an unsafe original assignment to %s', (key) => {
    const f = geminiSdkWebChannelFixture();
    const manager = f.registerIdle();
    Object.defineProperty(manager, key, { value: undefined, writable: false, configurable: true });
    expect(() => start(f)).toThrow();
  });
  it('refuses absent assignment slots on a nonextensible enabled manager', () => {
    const f = geminiSdkWebChannelFixture();
    Object.preventExtensions(f.registerIdle());
    expect(() => start(f)).toThrow();
  });
  it('accepts disabled nonextensible manager without adding idle slots', () => {
    const f = geminiSdkWebChannelFixture();
    const manager = Object.preventExtensions(f.registerIdle(false));
    start(f);
    f.originalXub();
    expect(Object.hasOwn(manager, 'wa')).toBe(false);
    expect(Object.hasOwn(manager, 'Ja')).toBe(false);
  });
  it('keeps original writable idle-slot attributes', () => {
    const f = geminiSdkWebChannelFixture();
    const manager = f.registerIdle();
    for (const key of ['wa', 'Ja'])
      Object.defineProperty(manager, key, {
        value: undefined,
        writable: true,
        configurable: false,
        enumerable: false,
      });
    start(f);
    f.originalXub();
    expect(Object.getOwnPropertyDescriptor(manager, 'wa')).toEqual({
      value: undefined,
      writable: true,
      configurable: false,
      enumerable: false,
    });
  });
  it('refuses changed consumed idle attributes before a restoring callback', () => {
    const f = geminiSdkWebChannelFixture();
    const manager = f.registerIdle();
    const { g } = start(f);
    f.hooks({
      factory: () =>
        Object.defineProperty(manager, 'wa', {
          value: undefined,
          writable: true,
          enumerable: false,
          configurable: true,
        }),
      current: () => {
        if (Object.hasOwn(manager, 'wa'))
          Object.defineProperty(manager, 'wa', {
            value: undefined,
            writable: true,
            enumerable: true,
            configurable: true,
          });
      },
    });
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.factory).toBe(0);
    expect(() => g.identity()).toThrow();
  });
  it('refuses manager activation and cannot reopen after restoration', () => {
    const f = geminiSdkWebChannelFixture();
    const manager = f.registerIdle();
    const { g } = start(f);
    f.hooks({
      current: () => {
        manager.ka = true;
      },
      scope: () => {
        manager.ka = false;
      },
    });
    expect(() => f.originalXub()).toThrow();
    manager.ka = false;
    f.hooks({});
    expect(() => g.identity()).toThrow();
  });
  it('refuses a changed queue message after original construction', () => {
    const { f, g } = start();
    f.originalXub();
    f.queued()[1].fl[1].fl[0] = 2;
    expect(() => g.identity()).toThrow();
    f.queued()[1].fl[1].fl[0] = 1;
    expect(() => g.identity()).toThrow();
  });
  it('refuses replacing the registry with a new idle manager', () => {
    const f = geminiSdkWebChannelFixture();
    f.registerIdle();
    start(f);
    f.hooks({
      factory: () => {
        f.registerIdle();
      },
    });
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.factory).toBe(0);
  });
  it('retains source methods after callbacks', () => {
    const { f } = start();
    f.hooks({
      current: () => {
        f.namespace.hKd.prototype.get = () => undefined;
      },
    });
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.factory).toBe(0);
  });

  it('cancels safely after closed admission refuses the scheduled first network', () => {
    const { f, g } = start();
    f.originalXub();
    g.close();
    expect(() => f.flushOpen()).toThrow();
    g.detach();
    expect(f.queued()).toEqual([]);
    expect(f.calls.forward).toBe(0);
  });
  it('retains the runner-owned API gate relationship', () => {
    const { f } = start();
    const original = f.api.Zxb;
    f.api.Zxb = function (packet: unknown) {
      return original.call(this, packet);
    };
    f.originalXub();
    expect(f.calls.query).toBe(1);
  });
  it('rejects an unsupported backend before original connect', () => {
    const { f } = start();
    f.hooks({
      afterFactory: () => {
        f.graph().connection.uq.ha.lPb = {};
      },
    });
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.factory).toBe(1);
    expect(f.calls.open).toBe(0);
    expect(f.calls.forward).toBe(0);
  });
  it('rejects queue identity replacement', () => {
    const { f, g } = start();
    f.originalXub();
    f.graph().oa = [...f.queued()];
    expect(() => g.identity()).toThrow();
  });
  it('quarantines an unowned cleanup gate', () => {
    const { f, g } = start();
    f.originalXub();
    const gate = f.namespace.dKd;
    f.graph().connection.uq.ha.Hf = () => {};
    expect(() => g.detach()).toThrow();
    expect(f.namespace.dKd).toBe(gate);
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.forward).toBe(0);
  });
  it('refuses callback reentry into cleanup', () => {
    const { f, g } = start();
    f.originalXub();
    f.hooks({
      current: () => {
        try {
          g.detach();
        } catch {}
      },
    });
    expect(() => g.identity()).toThrow();
    g.detach();
    expect(f.queued()).toEqual([]);
    expect(f.calls.forward).toBe(0);
  });
  it('refuses nonwritable source hooks before changing any hook', () => {
    const f = geminiSdkWebChannelFixture();
    const original = f.namespace.PLd;
    Object.defineProperty(f.namespace, 'LJd', { writable: false });
    expect(() => start(f)).toThrow();
    expect(f.namespace.PLd).toBe(original);
  });
  it('never enters the terminate branch after a cleanup callback changes iT', () => {
    const { f, g } = start();
    f.originalXub();
    const dt = f.graph().connection.uq.ha;
    f.hooks({
      current: () => {
        dt.fU = 3;
      },
    });
    expect(() => g.identity()).toThrow();
    expect(() => g.detach()).toThrow();
    expect(dt.Gb).toBe(0);
  });
  it.each(['wnf', 'aDc', 'isEnabled', 'get', 'subscribe', 'pipe', 'Da', 'ha'])(
    'refuses pre-arm live method replacement %s without calling it',
    (key) => {
      const f = geminiSdkWebChannelFixture();
      f.registerIdle();
      let foreign = 0;
      const p = ['wnf', 'aDc', 'isEnabled'].includes(key)
        ? f.namespace.qVd.prototype
        : key === 'get'
          ? f.namespace.hKd.prototype
          : f.namespace.st.prototype;
      p[key] = function (this: any) {
        foreign++;
        this.wa = undefined;
        return undefined;
      };
      expect(() => {
        start(f);
        f.originalXub();
      }).toThrow();
      expect(foreign).toBe(0);
    },
  );
  it.each(['IHd', 'connection'] as const)(
    'refuses private %s connect replacement before delegation',
    (key) => {
      const f = geminiSdkWebChannelFixture();
      let foreign = 0;
      f.prototypes[key].connect = () => {
        foreign++;
      };
      expect(() => {
        start(f);
        f.originalXub();
      }).toThrow();
      expect(foreign).toBe(0);
    },
  );
  it.each(['own', 'prototype', 'getter'] as const)(
    'retains getter-free Yac absence (%s)',
    (kind) => {
      const { f } = start();
      let foreign = 0;
      f.hooks({
        afterFactory: () => {
          const owner =
            kind === 'prototype'
              ? Object.getPrototypeOf(f.graph().connection)
              : f.graph().connection;
          Object.defineProperty(
            owner,
            'bfc',
            kind === 'getter'
              ? {
                  get: () => {
                    foreign++;
                    return undefined;
                  },
                  configurable: true,
                }
              : {
                  value: () => {
                    foreign++;
                  },
                  configurable: true,
                },
          );
        },
      });
      expect(() => f.originalXub()).toThrow();
      expect(foreign).toBe(0);
    },
  );
  it.each(['handler', 'link', 'vjd', 'dispatch'] as const)(
    'quarantines changed cleanup %s',
    (kind) => {
      const { f, g } = start();
      f.originalXub();
      const c = f.graph().connection.uq;
      let foreign = 0;
      if (kind === 'handler')
        c.ha.wa = {
          Zjd: () => {
            foreign++;
          },
        };
      if (kind === 'link')
        c.oa.ha = {
          dispatchEvent: () => {
            foreign++;
          },
        };
      if (kind === 'vjd')
        c.oa.Zjd = () => {
          foreign++;
        };
      if (kind === 'dispatch')
        c.dispatchEvent = () => {
          foreign++;
        };
      expect(() => g.detach()).toThrow();
      expect(foreign).toBe(0);
    },
  );
  it('captures returned OK before its first callback', () => {
    const { f } = start();
    let currentCalls = 0;
    f.hooks({
      current: () => {
        if (++currentCalls === 2) f.ok.fl[59] = 'changed';
      },
    });
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.factory).toBe(0);
  });
  it.each(['configuration', 'query'] as const)(
    'captures produced %s before callbacks can mutate and restore it',
    (kind) => {
      const { f } = start();
      let touched = false,
        restored = false;
      let original: any;
      f.hooks({
        current: () => {
          const value = f.produced();
          if (!touched && value && readGeminiNativeSendKind(f.namespace, value) === kind) {
            touched = true;
            const data = kind === 'query' ? value.fl[1] : value.fl[0];
            const index = kind === 'query' ? 0 : 1;
            original = data.fl[index];
            data.fl[index] = 17;
          }
        },
        scope: () => {
          if (touched) {
            const value = f.produced();
            (kind === 'query' ? value.fl[1] : value.fl[0]).fl[kind === 'query' ? 0 : 1] = original;
            restored = true;
          }
        },
      });
      expect(() => f.originalXub()).toThrow();
      expect(touched).toBe(true);
      expect(restored).toBe(false);
    },
  );
  it.each(['false', 'throw'] as const)(
    'cancels retained initial work after current becomes %s',
    (kind) => {
      const { f, g } = start();
      f.originalXub();
      if (kind === 'false') f.setCurrent(false);
      else
        f.hooks({
          current: () => {
            throw Error('owner canceled');
          },
        });
      g.detach();
      expect(f.queued()).toEqual([]);
      expect(f.graph().connection.uq.ha.Da).toBeNull();
      expect(() => f.flushOpen()).toThrow();
      expect(f.calls.forward).toBe(0);
    },
  );
  it('does not treat canceled current as permission to clean a changed graph', () => {
    const { f, g } = start();
    f.originalXub();
    f.setCurrent(false);
    const originalQueue = f.queued();
    f.graph().oa = [];
    expect(() => g.detach()).toThrow();
    expect(originalQueue).toHaveLength(2);
  });
  it('derives the queued text from returned OK instead of packet fallback', () => {
    const f = geminiSdkWebChannelFixture();
    f.ok.fl[0] = ['different returned query'];
    start(f);
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.query).toBe(1);
    expect(f.queued()).toHaveLength(1);
  });

  it('closes the actual owned channel before private constructor dZa runs', () => {
    const f = geminiSdkWebChannelFixture();
    let replacement = 0;
    f.prototypes.connection.s0a = function (this: any) {
      replacement++;
      this.Zp.open();
    };
    expect(() => {
      start(f);
      f.originalXub();
    }).toThrow();
    expect(replacement).toBe(1);
    expect(f.calls.open).toBe(0);
    expect(f.calls.forward).toBe(0);
  });

  it.each(['Yt.complete', 'qt.add', 'onb.unsubscribe', 'gu.ka', 'gu.value'])(
    'refuses live inherited/subscription replacement %s before construction',
    (path) => {
      const f = geminiSdkWebChannelFixture();
      let foreign = 0;
      const [name, key] = path.split('.');
      const p =
        name === 'onb'
          ? Object.getPrototypeOf(f.namespace.Tmb.prototype)
          : f.namespace[name!].prototype;
      Object.defineProperty(
        p,
        key!,
        key === 'value'
          ? {
              get: () => {
                foreign++;
                return false;
              },
              configurable: true,
            }
          : {
              value: () => {
                foreign++;
              },
              configurable: true,
              writable: true,
            },
      );
      expect(() => {
        start(f);
        f.originalXub();
      }).toThrow();
      expect(foreign).toBe(0);
    },
  );
  it.each(['teardown', 'observer'] as const)('quarantines a foreign cleanup %s', (kind) => {
    const { f, g } = start();
    f.originalXub();
    let foreign = 0;
    if (kind === 'teardown')
      f.graph().Ga.wa[0].Na = () => {
        foreign++;
      };
    else
      f.graph().tB.observers.push({
        complete: () => {
          foreign++;
        },
      });
    expect(() => g.detach()).toThrow();
    expect(foreign).toBe(0);
  });

  it.each(['absent', 'fallback', 'action'] as const)(
    'preserves returned OK %s query selection',
    (kind) => {
      const f = geminiSdkWebChannelFixture();
      f.ok.fl[0] = undefined;
      if (kind === 'fallback') f.ok.fl[33] = [];
      if (kind === 'action') f.ok.fl[78] = [];
      start(f);
      if (kind === 'absent') f.originalXub();
      else expect(() => f.originalXub()).toThrow();
      expect(f.calls.query).toBe(kind === 'fallback' ? 1 : 0);
      expect(f.queued()).toHaveLength(1);
    },
  );
  it('preserves the actual returned OK text in the literal GHd output', () => {
    const { f } = start();
    f.originalXub();
    expect(f.queued()[1].fl[1].fl[8].fl[0]).toBe(f.ok.getQuery().getText());
  });
  it('quarantines an additional lifecycle subscriber before cleanup', () => {
    const { f, g } = start();
    f.originalXub();
    let foreign = 0;
    f.graph().Na.observers.push({
      complete: () => {
        foreign++;
      },
    });
    expect(() => g.detach()).toThrow();
    expect(foreign).toBe(0);
    expect(f.queued()).toHaveLength(2);
  });
  it.each([
    ['listen', 'data', 'detach'],
    ['listen', 'accessor', 'detach'],
    ['removeAll', 'data', 'detach'],
    ['removeAll', 'accessor', 'detach'],
    ['listen', 'data', 'current'],
    ['listen', 'accessor', 'current'],
    ['removeAll', 'data', 'current'],
    ['removeAll', 'accessor', 'current'],
  ] as const)('retains handler %s absence against %s shadow at %s', (method, kind, timing) => {
    const { f, g } = start();
    let foreign = 0;
    let shadowed = false;
    const shadow = () => {
      const handler = f.graph().connection.Qj;
      const original = handler[method];
      Object.defineProperty(
        handler,
        method,
        kind === 'data'
          ? {
              value: function (this: unknown, ...args: unknown[]) {
                foreign++;
                return Reflect.apply(original, this, args);
              },
              writable: true,
              configurable: true,
            }
          : {
              get: () => {
                foreign++;
                return original;
              },
              configurable: true,
            },
      );
      shadowed = true;
    };
    if (timing === 'current') {
      f.hooks({
        current: () => {
          if (!shadowed && f.graph()?.connection.uq.ha.Da === true) shadow();
        },
      });
      expect(() => f.originalXub()).toThrow();
    } else {
      f.originalXub();
      shadow();
    }
    expect(shadowed).toBe(true);
    expect(() => g.detach()).toThrow();
    expect(() => g.identity()).toThrow();
    expect(foreign).toBe(0);
    expect(() => f.flushOpen()).toThrow();
    expect(() => f.originalXub()).toThrow();
    expect(f.calls).toMatchObject({ factory: 1, forward: 0, backchannel: 0, terminate: 0 });
    expect(g.sent()).toBe(false);
    expect(g.receiving()).toBe(false);
  });
  it('refuses changed transport handler immediately after a connect callback', () => {
    const { f } = start();
    let foreign = 0;
    f.hooks({
      current: () => {
        if (f.graph()?.connection.uq.ha.Da === true)
          f.graph().connection.uq.ha.wa = {
            Zjd: () => {
              foreign++;
            },
          };
      },
    });
    expect(() => f.originalXub()).toThrow();
    expect(foreign).toBe(0);
  });
});

describe('Gemini cold WebChannel phase2 physical ownership', () => {
  it('keeps the source-shaped physical fixture executable without the guard', () => {
    const f = geminiSdkWebChannelFixture();
    f.originalXub();
    f.flushOpen();
    expect(f.calls.forward).toBe(1);
    expect(f.outgoingMaps()).toHaveLength(2);
  });
  it.each(['json', 'protobuf'] as const)(
    'delegates the original asynchronous %s handshake and queued messages once',
    (codec) => {
      const { f, g } = start(geminiSdkWebChannelFixture(codec));
      f.originalXub();
      const queued = f.queued().slice();
      f.flushOpen();
      expect(f.calls).toMatchObject({ factory: 1, open: 1, config: 1, query: 1, forward: 1 });
      expect(g.sent()).toBe(true);
      expect(queued).toHaveLength(2);
      expect(f.serialized().map((v) => v.message)).toEqual(queued);
      expect(f.serialized()).toHaveLength(2);
      for (let i = 0; i < 2; i++) {
        expect(f.serialized()[i]!.message).toBe(queued[i]);
        expect(f.outgoingMaps()[i].map.__data__).toBe(f.serialized()[i]!.data);
      }
      expect(g.receiving()).toBe(false);
    },
  );
  it.each([false, true])(
    'retains actual Rlb objects through watchdog retry (already scheduled: %s)',
    (scheduled) => {
      const { f, g } = start();
      f.originalXub();
      f.flushOpen();
      const original = f.outgoingMaps();
      const previous = f.forwardRequest();
      const nextRid = previous.Aa.Gb;
      f.retryForward(scheduled);
      const retried = f.outgoingMaps();
      expect(f.serialized()).toHaveLength(2);
      expect(retried).toHaveLength(2);
      for (let i = 0; i < 2; i++) {
        expect(retried[i].entry).toBe(original[i].entry);
        expect(retried[i].map).toBe(original[i].map);
        expect(retried[i].mapId).toBe(original[i].mapId);
      }
      expect(f.forwardRequest().oa).toBe(scheduled ? nextRid : previous.oa);
      expect(f.calls).toMatchObject({ factory: 1, config: 1, query: 1, forward: 2 });
      expect(g.sent()).toBe(true);
    },
  );
  it.each(['entry', 'map', 'mapId', 'data', 'sid', 'rid', 'schedule'] as const)(
    'refuses changed %s before retry',
    (kind) => {
      const { f, g } = start();
      f.originalXub();
      f.flushOpen();
      const request = f.forwardRequest(),
        entry = request.Za[0];
      if (kind === 'entry') request.Za[0] = { ...entry };
      if (kind === 'map') entry.map = { ...entry.map };
      if (kind === 'mapId') entry.mapId++;
      if (kind === 'data') entry.map.__data__ += 'x';
      if (kind === 'sid') request.Aa.Sa = 'other-synthetic';
      if (kind === 'rid') request.oa++;
      if (kind === 'schedule') request.Aa.Da = 12345;
      expect(() => f.retryForward()).toThrow();
      expect(f.calls.forward).toBe(1);
      expect(g.sent()).toBe(true);
    },
  );
  it('keeps a prebound watchdog closed after a later own Pc replacement', () => {
    const { f } = start();
    f.originalXub();
    f.flushOpen();
    let foreign = 0;
    f.forwardRequest().Pc = () => {
      foreign++;
    };
    expect(() => f.retryForward()).toThrow();
    expect(foreign).toBe(0);
    expect(f.calls.forward).toBe(1);
  });
  it('cancellation before the bound watchdog prevents retransmission', () => {
    const { f, g } = start();
    f.originalXub();
    f.flushOpen();
    f.setCurrent(false);
    expect(() => f.retryForward()).toThrow();
    expect(f.calls.forward).toBe(1);
    expect(g.sent()).toBe(true);
  });

  it('recovers the owned backchannel without another logical send', () => {
    const { f, g } = start();
    f.originalXub();
    f.flushOpen();
    const before = f.graph().connection.uq.ha.ka;
    f.recoverBackchannel();
    const after = f.graph().connection.uq.ha.ka;
    expect(after).not.toBe(before);
    expect(after.Aa).toBe(before.Aa);
    expect(after.Yc).toBe(before.Yc);
    expect(after.oa).toBe('rpc');
    expect(f.calls).toMatchObject({ forward: 1, backchannel: 2, config: 1, query: 1 });
    expect(g.sent()).toBe(true);
  });
  it('terminates only the source-observed active graph after cancellation', () => {
    const { f, g } = start();
    f.originalXub();
    f.flushOpen();
    f.setCurrent(false);
    g.detach();
    expect(f.calls).toMatchObject({ forward: 1, terminate: 1 });
    expect(f.queued()).toEqual([]);
    expect(() => f.graph().connect()).toThrow();
    expect(g.sent()).toBe(true);
  });

  it.each(['stop', 'close'] as const)(
    'preserves original protocol %s retirement without generation completion',
    (kind) => {
      const { f, g } = start();
      f.originalXub();
      f.flushOpen();
      f.protocolEnd(kind);
      expect(f.graph().connection.uq.ha.fU).toBe(0);
      expect(f.graph().wD).toBe(true);
      expect(f.graph().hasError).toBe(kind === 'stop');
      expect(f.calls.terminate).toBe(kind === 'close' ? 1 : 0);
      expect(() => f.graph().connection.uq.ha.Hf()).toThrow();
      expect(g.receiving()).toBe(false);
      expect(g.sent()).toBe(true);
    },
  );
  it('preserves fatal unknown-session retirement and never reopens', () => {
    const { f, g } = start();
    f.originalXub();
    f.flushOpen();
    const request = f.forwardRequest();
    const entries = request.Za.slice();
    f.failForward();
    expect(request.DG).toBe(3);
    expect(f.protocolErrors().map((event) => event.errorCode)).toEqual([6]);
    expect(f.graph().connection.uq.ha.Ae[0]).toBe(entries[0]);
    expect(f.graph().connection.uq.ha.Ae[1]).toBe(entries[1]);
    expect(f.graph().connection.uq.ha.fU).toBe(0);
    expect(f.graph().hasError).toBe(true);
    expect(f.graph().connection.uq.ha.Ae).toHaveLength(2);
    expect(f.calls).toMatchObject({ forward: 1, query: 1, config: 1, terminate: 0 });
    expect(g.sent()).toBe(true);
    expect(() => f.graph().connection.uq.ha.Hf()).toThrow();
  });

  it('keeps an index-zero Unknown SID marker on the generic HTTP400 branch', () => {
    const { f, g } = start();
    f.originalXub();
    f.flushOpen();
    const request = f.forwardRequest();
    const entries = request.Za.slice();
    f.failForward(false);
    expect(request.DG).toBe(0);
    expect(f.protocolErrors().map((event) => event.errorCode)).toEqual([2]);
    expect(f.graph().connection.uq.ha.fU).toBe(0);
    expect(f.graph().hasError).toBe(true);
    expect(f.graph().connection.uq.ha.Ae).toHaveLength(2);
    expect(f.graph().connection.uq.ha.Ae[0]).toBe(entries[0]);
    expect(f.graph().connection.uq.ha.Ae[1]).toBe(entries[1]);
    expect(f.calls).toMatchObject({ forward: 1, query: 1, config: 1, terminate: 0 });
    expect(g.sent()).toBe(true);
    expect(() => f.graph().connection.uq.ha.Hf()).toThrow();
  });

  it.each(['zg', 'Fh', 'wh', 'Cf', 'Ac', 'Zb', 'Ab', 'Fd', 'Wd'] as const)(
    'rejects changed constructor setting %s before physical delegation',
    (key) => {
      const { f } = start();
      f.originalXub();
      const transport = f.graph().connection.uq.ha;
      transport[key] = typeof transport[key] === 'boolean' ? !transport[key] : transport[key] + 1;
      expect(() => f.flushOpen()).toThrow();
      expect(f.requests()).toHaveLength(0);
    },
  );
  it.each(['getLastError', 'zY', 'cancel', 'setTimeout'] as const)(
    'rejects request method shadow %s before watchdog delegation',
    (key) => {
      const { f } = start();
      f.originalXub();
      f.flushOpen();
      let foreign = 0;
      f.forwardRequest()[key] = () => {
        foreign++;
        return 2;
      };
      expect(() => f.retryForward()).toThrow();
      expect(foreign).toBe(0);
      expect(f.calls.forward).toBe(1);
    },
  );
  it.each(['send', 'abort', 'pea', 'getStatus', 'dispose', 'Hc'] as const)(
    'rejects actual backend method shadow %s before callback delegation',
    (key) => {
      const { f } = start();
      f.originalXub();
      f.flushOpen();
      let foreign = 0;
      f.forwardRequest().ha[key] = () => {
        foreign++;
        return 4;
      };
      expect(() => f.retryForward()).toThrow();
      expect(foreign).toBe(0);
    },
  );
  it.each(
    ['removeAllListeners', 'oqa', 'Sab', 'm4', 'removeAll'].flatMap((key) =>
      ['data', 'accessor'].flatMap((shape) =>
        ['cleanup', 'current'].map((stage) => ({ key, shape, stage })),
      ),
    ),
  )('quarantines actual Wj $key $shape replacement at $stage', ({ key, shape, stage }) => {
    const { f, g } = start();
    f.originalXub();
    f.flushOpen();
    const xhr = f.forwardRequest().ha;
    const owner = key === 'removeAll' ? xhr.Mpa : xhr;
    const saved = f.watchdog();
    const sends = f.calls.nativeSends;
    let foreign = 0;
    let reached = false;
    const replacement = () => {
      foreign++;
      return true;
    };
    const mutate = () => {
      reached = true;
      Object.defineProperty(owner, key, {
        configurable: true,
        ...(shape === 'data' ? { value: replacement, writable: true } : { get: replacement }),
      });
    };
    if (stage === 'cleanup') mutate();
    else f.hooks({ current: mutate });
    expect(() => (stage === 'cleanup' ? g.detach() : f.retryForward())).toThrow(
      'Gemini cold WebChannel refused',
    );
    expect(reached).toBe(true);
    expect(foreign).toBe(0);
    expect(() => saved()).toThrow('Gemini cold WebChannel refused');
    expect(() => f.graph().connect()).toThrow('Gemini cold WebChannel refused');
    expect(f.calls).toMatchObject({
      factory: 1,
      open: 1,
      config: 1,
      query: 1,
      forward: 1,
      terminate: 0,
    });
    expect(f.calls.nativeSends).toBe(sends);
    expect(g.receiving()).toBe(false);
  });
  it.each(
    ['instance', 'prototype'].flatMap((target) =>
      ['data', 'accessor'].flatMap((shape) =>
        ['cleanup', 'current'].map((stage) => ({ target, shape, stage })),
      ),
    ),
  )('quarantines actual Wj $target $shape event marker at $stage', ({ target, shape, stage }) => {
    const { f, g } = start();
    f.originalXub();
    f.flushOpen();
    const xhr = f.forwardRequest().ha;
    const owner = target === 'instance' ? xhr : f.namespace.Xj.prototype;
    const saved = f.watchdog();
    const calls = { ...f.calls };
    let markerGetter = 0;
    let fallback = 0;
    let reached = false;
    xhr.removeEventListener = () => fallback++;
    const mutate = () => {
      reached = true;
      Object.defineProperty(owner, f.namespace.Aga, {
        configurable: true,
        ...(shape === 'data'
          ? { value: false, writable: true }
          : {
              get() {
                markerGetter++;
                return true;
              },
            }),
      });
    };
    if (stage === 'cleanup') mutate();
    else f.hooks({ current: mutate });
    let refusal: unknown;
    try {
      if (stage === 'cleanup') g.detach();
      else f.retryForward();
    } catch (error) {
      refusal = error;
    }
    expect(reached).toBe(true);
    expect(markerGetter).toBe(0);
    expect(fallback).toBe(0);
    expect(refusal).toMatchObject({ message: 'Gemini cold WebChannel refused' });
    expect(() => g.detach()).toThrow('Gemini cold WebChannel refused');
    expect(() => saved()).toThrow('Gemini cold WebChannel refused');
    expect(() => f.graph().connect()).toThrow('Gemini cold WebChannel refused');
    expect(f.calls).toEqual(calls);
    expect(g.receiving()).toBe(false);
  });
  it.each(['data', 'accessor'])(
    'refuses an intermediate Wj %s event marker before first capture',
    (shape) => {
      const { f, g } = start();
      let markerGetter = 0;
      let fallback = 0;
      f.namespace.Xj.prototype.removeEventListener = () => fallback++;
      Object.defineProperty(f.namespace.Xj.prototype, f.namespace.Aga, {
        configurable: true,
        ...(shape === 'data'
          ? { value: false, writable: true }
          : {
              get() {
                markerGetter++;
                return true;
              },
            }),
      });
      expect(() => f.originalXub()).toThrow('Gemini cold WebChannel refused');
      expect(markerGetter).toBe(0);
      expect(fallback).toBe(0);
      expect(f.requests()).toHaveLength(0);
      expect(f.calls).toMatchObject({ forward: 0, backchannel: 0, terminate: 0, nativeSends: 0 });
      expect(f.graph()).toBeUndefined();
      expect(() => f.originalXub()).toThrow('Gemini cold WebChannel refused');
      expect(g.receiving()).toBe(false);
    },
  );
  it.each(
    ['Dff', 'R0c', 'Mpa', 'src'].flatMap((key) =>
      ['data', 'accessor'].flatMap((shape) =>
        ['cleanup', 'current'].map((stage) => ({ key, shape, stage })),
      ),
    ),
  )('quarantines actual Wj event $key $shape owner mutation at $stage', ({ key, shape, stage }) => {
    const { f, g } = start();
    f.originalXub();
    f.flushOpen();
    const xhr = f.forwardRequest().ha;
    const owner = key === 'src' ? xhr.Mpa : xhr;
    const saved = f.watchdog();
    const sends = f.calls.nativeSends;
    let foreign = 0;
    let reached = false;
    const target = {
      opa() {
        foreign++;
        return null;
      },
      l9a() {
        foreign++;
        return true;
      },
    };
    const replacement =
      key === 'Koa'
        ? Object.assign(Object.create(Object.getPrototypeOf(xhr.Mpa)), xhr.Mpa)
        : target;
    const mutate = () => {
      reached = true;
      Object.defineProperty(owner, key, {
        configurable: true,
        ...(shape === 'data'
          ? { value: replacement, writable: true }
          : {
              get() {
                foreign++;
                return replacement;
              },
            }),
      });
    };
    if (stage === 'cleanup') mutate();
    else f.hooks({ current: mutate });
    expect(() => (stage === 'cleanup' ? g.detach() : f.retryForward())).toThrow(
      'Gemini cold WebChannel refused',
    );
    expect(reached).toBe(true);
    expect(foreign).toBe(0);
    expect(() => saved()).toThrow('Gemini cold WebChannel refused');
    expect(() => f.graph().connect()).toThrow('Gemini cold WebChannel refused');
    expect(f.calls).toMatchObject({
      factory: 1,
      open: 1,
      config: 1,
      query: 1,
      forward: 1,
      terminate: 0,
    });
    expect(f.calls.nativeSends).toBe(sends);
    expect(g.receiving()).toBe(false);
  });
  it.each(
    ['removeAllListeners', 'oqa', 'Sab', 'm4', 'dispatchEvent'].flatMap((key) =>
      ['data', 'accessor'].flatMap((shape) =>
        ['capture', 'current'].map((stage) => ({ key, shape, stage })),
      ),
    ),
  )('retains actual Wj intermediate $key $shape resolution at $stage', ({ key, shape, stage }) => {
    const { f } = start();
    let foreign = 0;
    const replacement = () => {
      foreign++;
      return true;
    };
    const mutate = () =>
      Object.defineProperty(f.namespace.Xj.prototype, key, {
        configurable: true,
        ...(shape === 'data' ? { value: replacement, writable: true } : { get: replacement }),
      });
    if (stage === 'capture') {
      mutate();
      expect(() => f.originalXub()).toThrow('Gemini cold WebChannel refused');
      expect(f.requests()).toHaveLength(0);
    } else {
      f.originalXub();
      f.flushOpen();
      const sends = f.calls.nativeSends;
      f.hooks({ current: mutate });
      expect(() => f.retryForward()).toThrow('Gemini cold WebChannel refused');
      expect(f.calls.forward).toBe(1);
      expect(f.calls.nativeSends).toBe(sends);
    }
    expect(foreign).toBe(0);
  });
  it('refuses serializer shadow before source logical sends', () => {
    const { f, g } = start();
    f.originalXub();
    let foreign = 0;
    f.queued()[0].serialize = () => {
      foreign++;
      return 'copied';
    };
    expect(() => f.flushOpen()).toThrow();
    expect(foreign).toBe(0);
    expect(g.sent()).toBe(false);
  });
  it('refuses a repeated owned bind outside the original construction or cleared-callback stack', () => {
    const { f } = start();
    f.originalXub();
    f.flushOpen();
    const request = f.forwardRequest();
    expect(() => f.namespace.$b(request.Pc, request)).toThrow();
    expect(f.calls.forward).toBe(1);
  });
  it('refuses forged cleared-watchdog rearm from the lease callback', () => {
    const { f } = start();
    f.originalXub();
    f.flushOpen();
    const request = f.forwardRequest();
    f.hooks({
      current() {
        request.Va = null;
        f.namespace.$b(request.Pc, request);
      },
    });
    expect(() => f.retryForward()).toThrow();
    expect(f.calls.forward).toBe(1);
  });
  it('preserves unrelated binder receiver, arguments, and exact returned identity', () => {
    const { f } = start();
    const sentinel = {},
      receiver = {},
      value = function () {};
    let seen: unknown[] = [];
    Object.defineProperty(value, 'bind', {
      value: function (this: unknown, ...args: unknown[]) {
        seen = [this, ...args];
        return sentinel;
      },
    });
    // Physical binder is installed only when the original graph is fully captured.
    f.originalXub();
    expect(f.namespace.$b.call(receiver, value, receiver, 17)).toBe(sentinel);
    expect(seen).toEqual([value, receiver, 17]);
  });
  it('rejects callback mutation before a later callback can restore the retained schedule', () => {
    const { f } = start();
    f.originalXub();
    f.flushOpen();
    const transport = f.graph().connection.uq.ha;
    const original = transport.Da;
    let count = 0;
    f.hooks({
      current() {
        transport.Da = ++count === 1 ? 1234 : original;
      },
    });
    expect(() => f.retryForward()).toThrow();
    expect(count).toBe(1);
    expect(f.calls.forward).toBe(1);
  });
  it('quarantines externally mutated active state during detach', () => {
    const { f, g } = start();
    f.originalXub();
    f.flushOpen();
    f.graph().connection.uq.ha.Gb++;
    expect(() => g.detach()).toThrow();
    expect(f.calls.terminate).toBe(0);
  });

  it.each(['bind', 'call', 'apply'] as const)(
    'refuses a shadow of native binder resolution %s before it executes',
    (key) => {
      const { f } = start();
      f.originalXub();
      f.flushOpen();
      let foreign = 0;
      Object.defineProperty(f.forwardRequest().Pc, key, {
        value: () => {
          foreign++;
        },
        configurable: true,
      });
      expect(() => f.retryForward()).toThrow();
      expect(foreign).toBe(0);
    },
  );
  it.each(['native', 'factory', 'wrapper', 'callback'] as const)(
    'refuses replaced %s backend before physical send',
    (kind) => {
      const { f } = start();
      f.originalXub();
      let foreign = 0;
      if (kind === 'native')
        f.namespace.fa.XMLHttpRequest = function () {
          foreign++;
        };
      if (kind === 'factory')
        f.namespace.bja.Z8 = () => {
          foreign++;
        };
      if (kind === 'callback')
        f.namespace.qe = () => {
          foreign++;
        };
      if (kind === 'wrapper')
        f.namespace.Xj.prototype.l_c = () => {
          foreign++;
        };
      expect(() => f.flushOpen()).toThrow();
      expect(foreign).toBe(0);
      expect(f.requests()).toHaveLength(0);
    },
  );
  it('preserves sent intent after the first query delegate fails', () => {
    const { f, g } = start();
    f.originalXub();
    f.hooks({
      current() {
        if (g.sent()) throw new Error('synthetic cancellation');
      },
    });
    expect(() => f.flushOpen()).toThrow();
    expect(g.sent()).toBe(true);
    expect(f.serialized()).toHaveLength(1);
    expect(f.calls.forward).toBe(0);
  });
  it('keeps the actual saved watchdog tombstoned after detach and restores only its binder hook', () => {
    const f = geminiSdkWebChannelFixture(),
      binder = f.namespace.$b;
    const { g } = start(f);
    f.originalXub();
    f.flushOpen();
    const saved = f.watchdog();
    g.detach();
    expect(f.namespace.$b).toBe(binder);
    expect(() => saved()).toThrow();
    expect(f.calls).toMatchObject({ forward: 1, terminate: 1 });
  });
  it('preserves a foreign binder replacement and quarantines cleanup', () => {
    const { f, g } = start();
    f.originalXub();
    f.flushOpen();
    const foreign = () => {};
    f.namespace.$b = foreign;
    expect(() => g.detach()).toThrow();
    expect(f.namespace.$b).toBe(foreign);
    expect(f.calls.terminate).toBe(0);
  });
  it('keeps application close and decoded response control closed', () => {
    const { f, g } = start();
    f.originalXub();
    f.flushOpen();
    expect(() => f.namespace.iM(f.graph())).toThrow('Gemini cold WebChannel refused');
    expect(g.receiving()).toBe(false);
    expect(f.calls.query).toBe(1);
  });
  it.each(['Da', 'Gb', 'Ih'] as const)(
    'rejects non-writable source target %s during graph capture',
    (key) => {
      const f = geminiSdkWebChannelFixture();
      f.hooks({
        afterFactory() {
          const t = f.graph().connection.uq.ha;
          Object.defineProperty(t, key, { writable: false });
        },
      });
      const { g } = start(f);
      expect(() => f.originalXub()).toThrow();
      expect(f.requests()).toHaveLength(0);
      expect(g.sent()).toBe(false);
    },
  );
  it('refuses a decoded frame through the original owned callback and event chain', () => {
    const { f, g } = start();
    f.originalXub();
    f.flushOpen();
    expect(() => f.protocolEnd('synthetic-response')).toThrow('Gemini cold WebChannel refused');
    expect(g.receiving()).toBe(false);
    expect(g.sent()).toBe(true);
  });

  it.each(['listener', 'extra-listener', 'event-owner'] as const)(
    'refuses changed native request %s ownership before watchdog delegation',
    (kind) => {
      const { f } = start();
      f.originalXub();
      f.flushOpen();
      const request = f.forwardRequest();
      const events = request.ha.Mpa.listeners;
      if (kind === 'listener') events.readystatechange[0].listener = () => {};
      if (kind === 'extra-listener') events.complete = [];
      if (kind === 'event-owner') request.Zb.wa = {};
      expect(() => f.retryForward()).toThrow('Gemini cold WebChannel refused');
      expect(f.calls.forward).toBe(1);
    },
  );

  it.each(['missing', 'other-owned'] as const)(
    'refuses %s retry arguments despite a real scheduled retry',
    (kind) => {
      const { f } = start();
      f.originalXub();
      f.flushOpen();
      f.prepareForwardRetry();
      const transport = f.graph().connection.uq.ha;
      expect(typeof transport.Da).toBe('number');
      expect(() => (kind === 'missing' ? transport.Hf() : transport.Hf(f.requests()[0]))).toThrow(
        'Gemini cold WebChannel refused',
      );
      expect(f.calls.forward).toBe(1);
    },
  );

  it('preserves the original handshake upgrade from one active slot to the native request set', () => {
    const f = geminiSdkWebChannelFixture();
    f.protocolUpgrade();
    const { g } = start(f);
    f.originalXub();
    expect(f.graph().connection.uq.ha.Aa.ha).toBe(null);
    f.flushOpen();
    expect(f.graph().connection.uq.ha.Aa.ha).toBeInstanceOf(Set);
    expect(f.calls).toMatchObject({ forward: 1, query: 1, config: 1 });
    expect(g.sent()).toBe(true);
  });
  it('does not send after cancellation observed during native OPENED event delivery', () => {
    const { f } = start();
    f.originalXub();
    f.flushOpen();
    const before = f.calls.nativeSends;
    f.synchronousOpenEvents();
    let canceled = false;
    f.hooks({
      current() {
        if (f.requests().some((request) => request.Za.length && request.ha?.TOc)) {
          canceled = true;
          f.setCurrent(false);
        }
      },
    });
    expect(() => f.retryForward()).toThrow('Gemini cold WebChannel refused');
    expect(canceled).toBe(true);
    expect(f.calls.nativeSends).toBe(before);
  });

  it.each(['throw', 'rk', 'native-send', 'owner', 'hook'] as const)(
    'blocks native continuation after swallowed OPENED %s refusal',
    (kind) => {
      const { f } = start();
      f.originalXub();
      f.flushOpen();
      const before = f.calls.nativeSends;
      let foreignCalls = 0,
        reached = false;
      const foreign = new f.namespace.fa.XMLHttpRequest();
      foreign.open('POST', 'synthetic-target', true);
      foreign.send = () => {
        foreignCalls++;
      };
      f.synchronousOpenEvents();
      f.hooks({
        current() {
          const request = f.requests().findLast((r) => r.Za.length && r.ha?.TOc);
          if (!request) return;
          reached = true;
          if (kind === 'throw') throw new Error('synthetic lease failure');
          if (kind === 'rk') request.ha.vk = foreign;
          if (kind === 'native-send')
            request.ha.vk.send = () => {
              foreignCalls++;
            };
          if (kind === 'owner') request.ha = { ...request.ha };
          if (kind === 'hook')
            f.namespace.$b = () => {
              foreignCalls++;
            };
          f.setCurrent(false);
        },
      });
      expect(() => f.retryForward()).toThrow('Gemini cold WebChannel refused');
      expect(reached).toBe(true);
      expect(foreignCalls).toBe(0);
      expect(f.calls.nativeSends).toBe(before);
    },
  );
  it.each(['rk', 'send'] as const)(
    'does not resume after an OPENED %s mutation attempt is caught and later restored',
    (kind) => {
      const { f } = start();
      f.originalXub();
      f.flushOpen();
      const before = f.calls.nativeSends;
      let attempts = 0;
      f.synchronousOpenEvents();
      f.hooks({
        current() {
          const request = f.requests().findLast((r) => r.Za.length && r.ha?.TOc);
          if (!request) return;
          attempts++;
          const xhr = request.ha,
            native = xhr.vk,
            send = native.send;
          try {
            if (kind === 'rk') xhr.vk = null;
            else native.send = () => {};
          } catch {}
          try {
            if (kind === 'rk') xhr.vk = native;
            else native.send = send;
          } catch {}
        },
      });
      expect(() => f.retryForward()).toThrow('Gemini cold WebChannel refused');
      expect(attempts).toBe(1);
      expect(f.calls.nativeSends).toBe(before);
    },
  );
  it('preserves ordinary native OPENED delivery and original source cleanup', () => {
    const f = geminiSdkWebChannelFixture();
    f.synchronousOpenEvents();
    const { g } = start(f);
    f.originalXub();
    f.flushOpen();
    expect(f.calls.nativeSends).toBe(3);
    const xhr = f.forwardRequest().ha,
      native = xhr.vk;
    g.detach();
    expect(xhr.vk).toBe(null);
    expect(xhr.isDisposed()).toBe(true);
    expect(() => native.send('synthetic-late')).toThrow('Gemini cold WebChannel refused');
    expect(f.calls).toMatchObject({
      nativeSends: 4,
      terminate: 1,
      query: 1,
      config: 1,
      forward: 1,
    });
  });

  it.each(['nE', 't6b', 'MWa'] as const)(
    'refuses OPENED control-state mutation of %s before native send',
    (key) => {
      const { f } = start();
      f.originalXub();
      f.flushOpen();
      const before = f.calls.nativeSends;
      let reached = false;
      f.synchronousOpenEvents();
      f.hooks({
        current() {
          const request = f.requests().findLast((r) => r.Za.length && r.ha?.TOc);
          if (!request) return;
          reached = true;
          request.ha[key] = !request.ha[key];
        },
      });
      expect(() => f.retryForward()).toThrow('Gemini cold WebChannel refused');
      expect(reached).toBe(true);
      expect(f.calls.nativeSends).toBe(before);
    },
  );
  it('preserves actual C1d completion, null cleanup, and inert late native callbacks', () => {
    const { f, g } = start();
    f.originalXub();
    f.flushOpen();
    const request = f.requests()[0],
      xhr = request.ha,
      native = xhr.vk;
    const callback = native.onreadystatechange;
    native.readyState = 4;
    callback();
    expect(request.ha).toBe(null);
    expect(xhr.vk).toBe(null);
    expect(native.onreadystatechange).toBe(null);
    expect(xhr.isDisposed()).toBe(true);
    const before = f.calls.nativeSends;
    callback();
    expect(f.calls.nativeSends).toBe(before);
    expect(() => native.send('synthetic-late')).toThrow('Gemini cold WebChannel refused');
    expect(g.sent()).toBe(true);
  });
  it.each(['beacon', 'beacon-false', 'beacon-throw', 'image', 'xhr'] as const)(
    'preserves cleanup-only terminate choice %s without logical retransmission',
    (kind) => {
      const { f, g } = start();
      f.originalXub();
      f.flushOpen();
      const beacon = vi.fn(() => {
        if (kind === 'beacon-throw') throw new Error('synthetic-beacon');
        return kind === 'beacon';
      });
      if (kind.startsWith('beacon')) f.namespace.fa.navigator = { sendBeacon: beacon };
      if (kind === 'image') f.enableImage();
      const before = f.calls.nativeSends;
      g.detach();
      const terminal = f.requests().at(-1);
      expect(terminal.mb).toBe(2);
      expect(terminal.Za).toEqual([]);
      expect(terminal.Da).toBe(null);
      if (kind.startsWith('beacon'))
        expect(beacon).toHaveBeenCalledExactlyOnceWith(terminal.Sa.toString(), '');
      else expect(beacon).not.toHaveBeenCalled();
      expect(f.images()).toEqual(kind === 'image' ? [terminal.Sa] : []);
      if (kind !== 'beacon' && kind !== 'image') {
        const transmitted = f.nativeTransmissions().at(-1)!;
        expect(transmitted.receiver).toBe(terminal.ha.vk);
        expect(transmitted.args).toEqual(['']);
        expect(terminal.ha.Mpa.listeners).toEqual({});
      }
      expect(f.calls.nativeSends).toBe(before + (kind === 'beacon' || kind === 'image' ? 0 : 1));
      expect(f.calls).toMatchObject({
        factory: 1,
        open: 1,
        query: 1,
        config: 1,
        forward: 1,
        terminate: 1,
      });
      expect(f.graph().connection.uq.ha.fU).toBe(0);
      expect(() => f.graph().connect()).toThrow('Gemini cold WebChannel refused');
    },
  );
});

describe('Gemini cold WebChannel actual lifecycle capture', () => {
  function lifecycle() {
    const f = geminiSdkWebChannelFixture('json', true);
    const { g } = start(f);
    f.bindOriginal(g.bindObservable);
    return { f, g };
  }
  it.each(['close', 'stop', 'failed-forward'] as const)(
    'drainfix compare-restores shared hooks on original physical %s observer return',
    (kind) => {
      const f = geminiSdkWebChannelFixture('json', true);
      const keys = ['PLd', 'Klb', 'dKd', 'LJd', '$b', 'uA', 'bu', 'Vt'];
      const shared = keys.map((key) => Object.getOwnPropertyDescriptor(f.namespace, key));
      const { g } = start(f);
      f.bindOriginal(g.bindObservable);
      const cl = Object.getOwnPropertyDescriptor(f.namespace, 'iM');
      const complete = vi.fn(() => {
        expect(g.receiving()).toBe(true);
        g.detach();
      });
      const error = vi.fn((value: unknown) => {
        expect(value).toBeInstanceOf(f.namespace.ZJ);
        expect(g.receiving()).toBe(true);
        g.detach();
      });
      f.originalXub({ complete, error });
      f.flushOpen();
      const before = { ...f.calls };
      if (kind === 'failed-forward') f.failForward();
      else f.protocolEnd(kind);
      expect(complete).toHaveBeenCalledTimes(kind === 'close' ? 1 : 0);
      expect(error).toHaveBeenCalledTimes(kind === 'close' ? 0 : 1);
      if (kind !== 'close') expect(error.mock.calls[0]![0]).toBe(f.graph().tB.oa);
      expect(g.receiving()).toBe(false);
      expect(f.graph().connection.uq.ha.fU).toBe(0);
      expect(f.lifetime.Ps[21]).toEqual([]);
      expect(f.graph().Ga.closed).toBe(true);
      expect(f.responseSubscription().closed).toBe(true);
      expect(f.outer().closed).toBe(true);
      expect(f.graph().hasError).toBe(kind !== 'close');
      expect(keys.map((key) => Object.getOwnPropertyDescriptor(f.namespace, key))).toEqual(shared);
      expect(Object.getOwnPropertyDescriptor(f.namespace, 'iM')).toEqual(cl);
      f.namespace.iM(f.graph());
      expect(() => f.graph().connect()).toThrow();
      expect(() => f.graph().thc('late')).toThrow();
      expect(() => f.retryForward()).toThrow();
      expect(f.calls).toEqual({
        ...before,
        terminate: before.terminate + (kind === 'close' ? 1 : 0),
        nativeSends: before.nativeSends + (kind === 'close' ? 1 : 0),
      });
      expect(() => g.completion({} as never)).toThrow();
    },
  );
  it('drainfix preserves nested original unsubscribe before physical callback detach', () => {
    const f = geminiSdkWebChannelFixture('json', true);
    const shared = Object.getOwnPropertyDescriptor(f.namespace, 'Klb');
    const { g } = start(f);
    f.bindOriginal(g.bindObservable);
    const complete = vi.fn(() => {
      f.graph().Ga.unsubscribe();
      expect(g.receiving()).toBe(true);
      g.detach();
    });
    f.originalXub({ complete });
    f.flushOpen();
    f.protocolEnd('close');
    expect(complete).toHaveBeenCalledTimes(1);
    expect(g.receiving()).toBe(false);
    expect(Object.getOwnPropertyDescriptor(f.namespace, 'Klb')).toEqual(shared);
    expect(f.lifetime.Ps[21]).toEqual([]);
    expect(f.graph().connection.uq.ha.fU).toBe(0);
    expect(f.calls.query).toBe(1);
  });
  it.each(['foreign-hook', 'failed-unsubscribe'] as const)(
    'drainfix quarantines physical callback detach after %s without overwriting foreign state',
    (kind) => {
      const { f, g } = lifecycle();
      const foreign = vi.fn();
      const hook = f.namespace.Klb;
      const error = vi.fn(() => {
        expect(g.receiving()).toBe(true);
        g.detach();
        if (kind === 'foreign-hook') f.namespace.Klb = foreign;
        else Object.freeze(f.lifetime.Ps[21]);
      });
      f.originalXub({ error });
      f.flushOpen();
      expect(() => f.failForward()).toThrow('Gemini cold WebChannel refused');
      expect(error).toHaveBeenCalledTimes(1);
      expect(g.receiving()).toBe(false);
      expect(f.namespace.Klb).toBe(kind === 'foreign-hook' ? foreign : hook);
      expect(foreign).not.toHaveBeenCalled();
      expect(() => g.detach()).toThrow();
      expect(() => f.graph().thc('late')).toThrow();
      expect(() => f.retryForward()).toThrow();
      expect(f.calls.query).toBe(1);
      if (kind === 'failed-unsubscribe') expect(f.lifetime.Ps[21].length).toBeGreaterThan(0);
    },
  );
  it.each(['complete', 'error'] as const)(
    'reviewfix drains detach requested by the original outer %s callback on terminal return',
    (kind) => {
      const { f, g } = lifecycle();
      const error = new Error('synthetic-terminal');
      const terminal = vi.fn((received?: unknown) => {
        if (kind === 'error') expect(received).toBe(error);
        expect(g.receiving()).toBe(true);
        g.detach();
        expect(f.graph().connection.uq.ha.fU).toBe(3);
      });
      f.originalXub({ [kind]: terminal });
      f.flushOpen();
      if (kind === 'error') f.graph().tB.error(error);
      else f.graph().tB.complete();
      expect(terminal).toHaveBeenCalledTimes(1);
      expect(g.receiving()).toBe(false);
      expect(f.graph().connection.uq.ha.fU).toBe(0);
      expect(f.lifetime.Ps[21]).toEqual([]);
      expect(f.graph().Ga.closed).toBe(true);
      expect(f.outer().closed).toBe(true);
      expect(f.calls.query).toBe(1);
      expect(() => f.graph().thc('late')).toThrow();
    },
  );
  it.each(['outer', 'S0', 'S1', 'S2', 'N0', 'N1', 'R2', 'Z2'] as const)(
    'reviewfix rejects data/accessor iterator overrides on the actual %s teardown array',
    (owner) => {
      for (const trigger of ['detach', 'unsubscribe']) {
        for (const accessor of [false, true]) {
          const { f, g } = lifecycle();
          f.originalXub();
          const s0 = f.graph().Ga;
          const s1 = f.responseSubscription();
          const t2 = f.graph().Da.observers[0];
          const s2 = t2.destination;
          const subscription = {
            outer: f.outer(),
            S0: s0,
            S1: s1,
            S2: s2,
            N0: s0.wa[0],
            N1: s1.wa[0],
            R2: s2.wa[0],
            Z2: t2,
          }[owner];
          const foreign = vi.fn();
          const iterator = vi.fn(function* () {
            yield foreign;
          });
          const getter = vi.fn(() => iterator);
          Object.defineProperty(
            subscription.wa,
            Symbol.iterator,
            accessor ? { get: getter } : { value: iterator },
          );
          expect(() => (trigger === 'detach' ? g.detach() : subscription.unsubscribe())).toThrow();
          expect(getter).not.toHaveBeenCalled();
          expect(iterator).not.toHaveBeenCalled();
          expect(foreign).not.toHaveBeenCalled();
        }
      }
    },
  );
  it.each(['outside', 'complete', 'error'] as const)(
    'reviewfix refuses a deleted live teardown edge from %s without claiming retirement',
    (stage) => {
      const { f, g } = lifecycle();
      const mutate = () => {
        f.graph().Ga.wa.length = 0;
      };
      f.originalXub(stage === 'outside' ? {} : { [stage]: mutate });
      f.flushOpen();
      const notifier = f.graph().Ga.wa[0];
      if (stage === 'outside') mutate();
      else
        expect(() =>
          stage === 'complete'
            ? f.graph().tB.complete()
            : f.graph().tB.error(new Error('synthetic-terminal')),
        ).toThrow();
      expect(() => g.detach()).toThrow();
      expect(notifier.closed).toBe(false);
      expect(f.lifetime.Ps[21].length).toBeGreaterThan(0);
      expect(() => f.graph().thc('late')).toThrow();
      expect(f.calls.query).toBe(1);
    },
  );
  it('reviewfix never treats a failed original fallback disconnect as retirement', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    f.flushOpen();
    f.outer().unsubscribe();
    const parent = f.graph().Ga;
    const [notifier, removal] = parent.wa;
    Object.freeze(f.lifetime.Ps[21]);
    let thrown: any;
    try {
      f.runCloseFallback();
    } catch (error) {
      thrown = error;
    }
    expect(thrown.name).toBe('UnsubscriptionError');
    expect(thrown.errors).toHaveLength(1);
    expect([parent.closed, notifier.closed, removal.closed]).toEqual([true, true, true]);
    expect(f.graph().connection.Ki.observers).toEqual([]);
    expect(f.graph().connection.uq.ha.fU).toBe(3);
    expect(() => g.detach()).toThrow();
    parent.unsubscribe();
    expect(() => g.detach()).toThrow();
    expect(f.lifetime.Ps[21]).toHaveLength(1);
    expect(() => f.graph().thc('late')).toThrow();
    expect(() => f.retryForward()).toThrow();
    expect(f.calls.query).toBe(1);
  });
  it.each(['outer', 'S0', 'S1', 'S2', 'N0', 'N1', 'R2', 'Z2'] as const)(
    'reviewfix refuses disappearance of a captured %s child before cleanup',
    (owner) => {
      const { f, g } = lifecycle();
      f.originalXub();
      const s0 = f.graph().Ga;
      const s1 = f.responseSubscription();
      const t2 = f.graph().Da.observers[0];
      const s2 = t2.destination;
      const subscription = {
        outer: f.outer(),
        S0: s0,
        S1: s1,
        S2: s2,
        N0: s0.wa[0],
        N1: s1.wa[0],
        R2: s2.wa[0],
        Z2: t2,
      }[owner];
      subscription.wa.pop();
      expect(() => g.detach()).toThrow();
      expect(subscription.closed).toBe(false);
    },
  );
  it('reviewfix rejects an unobserved detached parent link', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    f.graph().Ga.wa[0].oa = null;
    expect(() => g.detach()).toThrow();
  });
  it('reviewfix permits original nested unsubscribe from an outer terminal callback', () => {
    const { f, g } = lifecycle();
    f.originalXub({
      complete() {
        f.graph().Ga.unsubscribe();
        g.detach();
      },
    });
    f.flushOpen();
    f.graph().tB.complete();
    expect(f.graph().connection.uq.ha.fU).toBe(0);
    expect(f.lifetime.Ps[21]).toEqual([]);
    expect(g.receiving()).toBe(false);
  });
  it('reviewfix catches a deleted edge before a later application callback can restore it', () => {
    const { f, g } = lifecycle();
    let children: unknown[];
    const restore = vi.fn(() => f.graph().Ga.wa.push(...children));
    f.originalXub({
      complete() {
        f.graph().Ga.wa.length = 0;
        f.hooks({ current: restore });
      },
    });
    f.flushOpen();
    children = [...f.graph().Ga.wa];
    expect(() => f.graph().tB.complete()).toThrow();
    expect(restore).not.toHaveBeenCalled();
    expect(() => g.detach()).toThrow();
  });
  it('captures the original lazy S0/S1/S2 graph before opening', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    const w = f.graph();
    expect(f.calls.open).toBe(1);
    expect(w.Ga.wa[0].destination).toBe(w.Ga);
    expect(f.lifetime.Ps[21]).toHaveLength(3);
    expect(w.tB.observers[0]).toBe(f.responseSubscription());
    expect(w.Da.observers[0].destination).not.toBe(w.Ga);
    expect(g.sent()).toBe(false);
    expect(g.receiving()).toBe(false);
  });
  it('refuses foreign registration before connect instead of accepting the resulting graph', () => {
    const { f } = lifecycle();
    f.hooks({
      afterFactory() {
        f.graph().tB.subscribe(() => {});
      },
    });
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.open).toBe(0);
  });
  it('runs the captured one-shot open listener and its automatic child teardown', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    const s2 = f.graph().Da.observers[0].destination;
    f.flushOpen();
    expect(s2.closed).toBe(true);
    expect(f.graph().Da.observers).toEqual([]);
    expect(f.lifetime.Ps[21]).toHaveLength(2);
    expect(g.sent()).toBe(true);
    g.detach();
    expect(f.lifetime.Ps[21]).toEqual([]);
  });
  it('encloses later original outer unsubscribe and admits exactly one original close frame', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    f.flushOpen();
    f.setCurrent(false);
    f.outer().unsubscribe();
    expect(f.graph().t$).toBe(true);
    expect(
      f.serialized().map(({ message }) => readGeminiNativeSendKind(f.namespace, message)),
    ).toEqual(['configuration', 'query', 'close']);
    f.namespace.iM(f.graph());
    expect(f.serialized()).toHaveLength(3);
    expect(g.sent()).toBe(true);
    g.detach();
    expect(f.graph().wD).toBe(true);
  });
  it('keeps the original close fallback usable after producer consumption ends', () => {
    const { f } = lifecycle();
    f.originalXub();
    f.flushOpen();
    f.outer().unsubscribe();
    f.runCloseFallback();
    expect(f.graph().wD).toBe(true);
    expect(f.graph().connection.uq.ha.fU).toBe(0);
  });
  it('accepts only the original bounded close after explicit stop, never forged H9', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    f.flushOpen();
    f.graph().t$ = true;
    g.close();
    expect(() => f.namespace.iM(f.graph())).toThrow();
    expect(f.serialized()).toHaveLength(2);
  });
  it('preserves late source CL and unsubscribe idempotence after full retirement', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    f.flushOpen();
    const close = f.namespace.iM;
    g.detach();
    close.call(f.namespace, f.graph());
    f.graph().Ga.unsubscribe();
    expect(f.serialized()).toHaveLength(2);
  });
  it('checks every captured callable before invoking cleanup, including foreign sibling replacement', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    const foreign = vi.fn();
    f.graph().Ga.wa[0].unsubscribe = foreign;
    expect(() => g.detach()).toThrow();
    expect(foreign).not.toHaveBeenCalled();
  });
  it('does not accept replacement of a captured parent teardown list', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    f.graph().Ga.wa = [...f.graph().Ga.wa];
    expect(() => g.detach()).toThrow();
  });
  it('restores shared creator and Yc hooks after their one original capture', () => {
    const f = geminiSdkWebChannelFixture('json', true);
    const original = [f.namespace.uA, f.namespace.bu, f.namespace.Vt];
    const { g } = start(f);
    f.bindOriginal(g.bindObservable);
    f.originalXub();
    expect([f.namespace.uA, f.namespace.bu, f.namespace.Vt]).toEqual(original);
    expect(Object.hasOwn(f.api.Ia, 'Wc')).toBe(false);
    g.detach();
  });
  it('refuses an already destroyed owner before the first physical open', () => {
    const { f, g } = lifecycle();
    f.lifetime.Ps[2] |= 256;
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.open).toBe(0);
    expect(f.requests()).toEqual([]);
    expect(g.sent()).toBe(false);
    expect(f.namespace.qt.ha.closed).toBe(true);
  });
  it('allows source owner destruction with the old list retained and its later null phase', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    const callbacks = [...f.lifetime.Ps[21]];
    f.lifetime.Ps[2] |= 256;
    callbacks[0]();
    f.lifetime.Ps[21] = null;
    callbacks[1]();
    callbacks[2]();
    expect(f.graph().Ga.closed).toBe(true);
    expect(f.responseSubscription().closed).toBe(true);
    g.detach();
  });
  it('supports the actual WVb owner and both original destroy phases', () => {
    const f = geminiSdkWebChannelFixture('json', 'wvb');
    const { g } = start(f);
    f.bindOriginal(g.bindObservable);
    f.originalXub();
    expect(f.api.Ia.Zpb).toHaveLength(3);
    f.api.Ia.Bwc.add({
      Lb() {
        f.graph().Ga.unsubscribe();
      },
    });
    f.api.Ia.destroy();
    expect(f.api.Ia.Zpb).toEqual([]);
    expect(f.responseSubscription().closed).toBe(true);
    g.detach();
  });
  it('encloses a synchronous original complete before the producer returns its teardown', () => {
    const { f, g } = lifecycle();
    let inside = false;
    f.hooks({
      afterQuery() {
        inside = g.receiving();
        f.responseSubscription().complete();
      },
    });
    f.originalXub();
    expect(inside).toBe(true);
    expect(f.outer().closed).toBe(true);
    expect(f.graph().wD).toBe(true);
    expect(f.lifetime.Ps[21]).toEqual([]);
    expect(f.calls.forward).toBe(0);
    expect(g.receiving()).toBe(false);
  });
  it('defers extension detach until the complete owned event stack exits', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    let requested = false;
    f.hooks({
      current() {
        if (!requested && g.receiving()) {
          requested = true;
          g.detach();
          expect(f.graph().wD).toBe(false);
        }
      },
    });
    expect(() => f.flushOpen()).toThrow();
    expect(requested).toBe(true);
    expect(g.receiving()).toBe(false);
    expect(f.graph().wD).toBe(true);
  });
  it('checks lifecycle state immediately before a second callback can restore it', () => {
    const { f } = lifecycle();
    f.hooks({
      afterFactory() {
        f.hooks({
          current() {
            f.graph().Ga.Ys = true;
          },
          scope() {
            f.graph().Ga.Ys = false;
          },
        });
      },
    });
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.open).toBe(0);
  });
  it('allows original source terminal completion to reach CL with no response acceptance', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    f.flushOpen();
    f.graph().tB.complete();
    expect(f.outer().closed).toBe(true);
    expect(f.serialized()).toHaveLength(3);
    expect(() => g.completion({} as never)).toThrow();
  });
  it('sends the original close map through the existing physical ledger once', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    f.flushOpen();
    const prior = f.calls.forward;
    f.outer().unsubscribe();
    f.flushOpen();
    expect(f.calls.forward).toBe(prior + 1);
    expect(f.forwardRequest().Za).toHaveLength(1);
    expect(f.calls.query).toBe(1);
    g.detach();
  });
  it.each([
    'duplicate',
    'foreign-prototype',
    'foreign-producer',
    'replaced-producer',
    'late',
  ] as const)('rejects %s observable binding without another physical request', (kind) => {
    const { f, g } = lifecycle();
    const value = f.api.Zxb(f.packet);
    if (kind === 'duplicate') {
      g.bindObservable(value);
      expect(() => g.bindObservable(value)).toThrow();
    }
    if (kind === 'foreign-prototype') expect(() => g.bindObservable({ ha: value.ha })).toThrow();
    if (kind === 'foreign-producer') {
      value.ha = () => {};
      expect(() => g.bindObservable(value)).toThrow();
    }
    if (kind === 'replaced-producer') {
      g.bindObservable(value);
      value.ha = () => {};
      expect(() => g.identity()).toThrow();
    }
    if (kind === 'late') {
      value.subscribe({ error() {} });
      expect(() => g.bindObservable(value)).toThrow();
    }
    expect(f.requests()).toEqual([]);
  });
  it.each(['Wc', 'dg'] as const)('refuses a foreign owner %s getter without invoking it', (key) => {
    const f = geminiSdkWebChannelFixture('json', true);
    const getter = vi.fn();
    Object.defineProperty(f.api.Ia, key, { get: getter });
    expect(() => start(f)).toThrow();
    expect(getter).not.toHaveBeenCalled();
  });
  it.each(['Nj', 'ha', 'Ca', 'destination', 'oa'] as const)(
    'refuses changed captured child %s before cleanup',
    (key) => {
      const { f, g } = lifecycle();
      f.originalXub();
      const foreign = vi.fn();
      f.graph().Ga.wa[0][key] = foreign;
      expect(() => g.detach()).toThrow();
      expect(foreign).not.toHaveBeenCalled();
    },
  );
  it('refuses source-equal route cleanup from outside its original attach slot', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    const route = f.responseSubscription().wa.at(-1);
    const other = Function(
      'a',
      'aa',
      'ea',
      'return ' + route.toString(),
    )({ Ga: new Map() }, '', {});
    expect(() => f.responseSubscription().add(other)).toThrow();
    expect(g.sent()).toBe(false);
  });
  it('preserves the source pnb caught-observer path while retaining closed admission', () => {
    const { f, g } = lifecycle();
    const error = new Error('synthetic-observer');
    let inside = false;
    f.originalXub({
      complete() {
        inside = g.receiving();
        throw error;
      },
    });
    f.responseSubscription().complete();
    expect(inside).toBe(true);
    expect(f.deferredErrors).toContain(error);
    expect(f.outer().closed).toBe(true);
    expect(f.graph().wD).toBe(true);
    expect(() => g.completion({} as never)).toThrow();
  });
  it('preserves original ft aggregation while retiring every proved sibling in that unsubscribe', () => {
    const { f } = lifecycle();
    f.originalXub();
    const parent = f.graph().Ga;
    const [notifier, removal] = parent.wa;
    Object.freeze(f.lifetime.Ps[21]);
    let thrown: any;
    try {
      parent.unsubscribe();
    } catch (error) {
      thrown = error;
    }
    expect(thrown.name).toBe('UnsubscriptionError');
    expect(thrown.errors).toHaveLength(1);
    expect([parent.closed, notifier.closed, removal.closed]).toEqual([true, true, true]);
    expect(f.graph().connection.Ki.observers).toEqual([]);
  });
  it('refuses observer callback mutation before another source callback can hide it', () => {
    const { f, g } = lifecycle();
    const foreign = vi.fn();
    f.originalXub({
      complete() {
        f.graph().Ga.wa[0].unsubscribe = foreign;
      },
    });
    expect(() => f.responseSubscription().complete()).toThrow();
    expect(foreign).not.toHaveBeenCalled();
    expect(() => g.identity()).toThrow();
  });
  it('refuses callback creator acquisition even if its exception is caught', () => {
    const { f } = lifecycle();
    f.hooks({
      afterFactory() {
        f.hooks({
          current() {
            try {
              f.namespace.uA(f.api.Ia);
            } catch {}
          },
        });
      },
    });
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.open).toBe(0);
  });
  it('keeps inactive connected subject subscriptions closed before they can replay', () => {
    const { f } = lifecycle();
    f.originalXub();
    const next = vi.fn();
    expect(() => f.graph().connection.uC.subscribe(next)).toThrow();
    expect(next).not.toHaveBeenCalled();
  });
  it.each(['bind', 'call', 'apply'] as const)(
    'rejects a foreign own %s on an owned callback before cleanup',
    (key) => {
      const { f, g } = lifecycle();
      f.originalXub();
      const foreign = vi.fn();
      f.graph().Ga.wa[0].next[key] = foreign;
      expect(() => g.detach()).toThrow();
      expect(foreign).not.toHaveBeenCalled();
    },
  );
  it.each(['splice', 'indexOf', 'push'] as const)(
    'rejects a foreign teardown-list %s before invoking cleanup',
    (key) => {
      const { f, g } = lifecycle();
      f.originalXub();
      const foreign = vi.fn();
      f.graph().Ga.wa[key] = foreign;
      expect(() => g.detach()).toThrow();
      expect(foreign).not.toHaveBeenCalled();
    },
  );
  it('rejects a replaced shared closed sentinel method without executing or changing it', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    const foreign = vi.fn();
    f.namespace.qt.ha.unsubscribe = foreign;
    expect(() => g.detach()).toThrow();
    expect(foreign).not.toHaveBeenCalled();
    expect(f.namespace.qt.ha.unsubscribe).toBe(foreign);
    expect(f.namespace.qt.ha.closed).toBe(true);
  });
  it('retires the complete actual graph when the current callback throws', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    const w = f.graph();
    const s2 = w.Da.observers[0].destination;
    f.hooks({
      current() {
        throw new Error('synthetic-current');
      },
    });
    expect(() => g.identity()).toThrow();
    g.detach();
    expect([w.Ga.closed, f.responseSubscription().closed, s2.closed]).toEqual([true, true, true]);
    expect(f.lifetime.Ps[21]).toEqual([]);
    expect(f.calls.forward).toBe(0);
  });
  it.each(['stop', 'close'] as const)(
    'preserves original physical %s retirement without native success',
    (kind) => {
      const { f, g } = lifecycle();
      f.originalXub();
      f.flushOpen();
      f.protocolEnd(kind);
      expect(f.graph().wD).toBe(true);
      expect(f.outer().closed).toBe(true);
      expect(f.lifetime.Ps[21]).toEqual([]);
      expect(f.graph().connection.uq.ha.fU).toBe(0);
      expect(f.graph().hasError).toBe(kind === 'stop');
      g.detach();
      expect(() => g.completion({} as never)).toThrow();
    },
  );
  it('preserves original failed-forward error retirement without native success', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    f.flushOpen();
    f.failForward();
    expect(f.graph().hasError).toBe(true);
    expect(f.outer().closed).toBe(true);
    expect(f.lifetime.Ps[21]).toEqual([]);
    g.detach();
    expect(() => g.completion({} as never)).toThrow();
  });
  it.each(['complete', 'error'] as const)(
    'preserves synchronous stopped-source %s and closed route add without touching the shared sentinel',
    (kind) => {
      const { f, g } = lifecycle();
      const terminal = vi.fn();
      const error = new Error('synthetic-stopped');
      const sentinel = Object.getOwnPropertyDescriptors(f.namespace.qt.ha);
      f.hooks({
        afterFactory() {
          f.graph().tB.Ys = true;
          if (kind === 'error') {
            f.graph().tB.hasError = true;
            f.graph().tB.oa = error;
          }
        },
      });
      f.originalXub({ [kind]: terminal });
      expect(terminal).toHaveBeenCalledTimes(1);
      if (kind === 'error') expect(terminal).toHaveBeenCalledWith(error);
      expect(f.lifecycleRemovals[0]).toBeUndefined();
      expect(f.responseSubscription().closed).toBe(true);
      expect(f.responseSubscription().wa).toBeNull();
      expect(Object.getOwnPropertyDescriptors(f.namespace.qt.ha)).toEqual(sentinel);
      expect(f.calls.open).toBe(0);
      expect(f.requests()).toEqual([]);
      expect(g.sent()).toBe(false);
      g.detach();
      expect(f.graph().Ga.closed).toBe(true);
    },
  );
  it('passes through unrelated creator use outside original consumption without claiming its subscription', () => {
    const f = geminiSdkWebChannelFixture('json', true);
    start(f);
    const other = new f.namespace.Yt();
    const subscription = other.pipe(f.namespace.uA(f.api.Ia)).subscribe(() => {});
    expect(subscription.closed).toBe(false);
    expect(Object.hasOwn(subscription, 'unsubscribe')).toBe(false);
    subscription.unsubscribe();
    expect(other.observers).toEqual([]);
    expect(f.requests()).toEqual([]);
  });
  it('retires the complete actual graph after current becomes false', () => {
    const { f, g } = lifecycle();
    f.originalXub();
    const w = f.graph();
    const s2 = w.Da.observers[0].destination;
    f.setCurrent(false);
    g.detach();
    expect([w.Ga.closed, f.responseSubscription().closed, s2.closed]).toEqual([true, true, true]);
    expect(f.lifetime.Ps[21]).toEqual([]);
    expect([w.tB.observers, w.Da.observers, w.connection.Ki.observers]).toEqual([[], [], []]);
    expect(f.calls.forward).toBe(0);
  });
});

describe('Gemini cold WebChannel phase3b native receipts', () => {
  function receiveFixture(codec: 'json' | 'protobuf') {
    const f = geminiSdkWebChannelFixture(codec, true);
    const { g } = start(f);
    f.bindOriginal(g.bindObservable);
    const next = vi.fn(() => {
      expect(g.receiving()).toBe(true);
    });
    const complete = vi.fn(() => {
      expect(g.receiving()).toBe(true);
    });
    const error = vi.fn((_value: unknown) => {
      expect(g.receiving()).toBe(true);
    });
    f.originalXub({ next, complete, error });
    f.flushOpen();
    return { f, g, next, complete, error };
  }
  it.each(['json', 'protobuf'] as const)(
    'Native65 source getters cache all four inbound owners before original %s projection',
    (codec) => {
      const { f, g, next, complete } = receiveFixture(codec),
        ns = f.namespace;
      const envelope: any = f.nativeEnvelope(
        f.nativeKf({ cid: 'c_47', rid: 'server-rid', final: true }),
      );
      expect(envelope.fl[ns.dga]).toBeUndefined();
      f.receive(envelope);
      let value = envelope;
      for (const [key, field] of [
        ['hM', 2],
        ['gM', 7],
        ['CJd', 1],
        ['fM', 4],
      ] as const) {
        expect(value.fl[ns.dga].get(ns[key])).toBe(field);
        value = value.fl[field - 1];
      }
      expect(next).toHaveBeenCalledTimes(1);
      expect(g.identity().turnId).toBe('server-rid');
      f.receive(f.nativeClose(5));
      expect(complete).toHaveBeenCalledTimes(1);
    },
  );
  it.each([4, 5] as const)('Native65 accepts source-created root close%s cache', (field) => {
    const { f, complete } = receiveFixture('json'),
      ns = f.namespace;
    const envelope: any = f.nativeClose(field);
    f.receive(envelope);
    expect(envelope.fl[ns.dga].get(ns.hM)).toBe(field);
    expect(complete).toHaveBeenCalledTimes(1);
  });
  it.each(['json', 'protobuf'] as const)(
    'binds %s projection permission to the exact current xD frame only',
    (codec) => {
      const { f, g, next, complete } = receiveFixture(codec);
      const frames: any[] = [];
      const scope: Array<[string, boolean, boolean, boolean, boolean]> = [];
      const projecting = (frame: unknown) => g.projecting(frame);
      expect(projecting(undefined)).toBe(false);
      const snapshot = (stage: string) =>
        scope.push([
          stage,
          g.receiving(),
          projecting(frames.at(-1)),
          projecting({ ...frames.at(-1) }),
          projecting(frames.at(-2)),
        ]);
      vi.spyOn(f.observer, 'next').mockImplementation((frame) => {
        frames.push(frame);
        snapshot('receipt');
      });
      next.mockImplementation(() => snapshot('projection'));
      f.onReceive((stage) => snapshot(stage));
      vi.spyOn(f.observer, 'control').mockImplementation(() => snapshot('control'));
      complete.mockImplementation(() => snapshot('complete'));
      for (const final of [false, true]) {
        f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid', final })));
        expect(projecting(frames.at(-1))).toBe(false);
      }
      f.receive(f.nativeClose(5));
      expect(scope).toEqual([
        ...Array.from({ length: 2 }, () =>
          ['receipt', 'RJd:before', 'projection', 'RJd:after', 'DJd'].map((stage) => [
            stage,
            true,
            true,
            false,
            false,
          ]),
        ).flat(),
        ['control', true, false, false, false],
        ['complete', true, false, false, false],
      ]);
      g.detach();
      expect(projecting(frames.at(-1))).toBe(false);
    },
  );
  it.each(['json', 'protobuf'] as const)(
    'clears %s projection permission after observer failure and full source tail',
    (codec) => {
      const { f, g, next } = receiveFixture(codec);
      let frame: unknown;
      vi.spyOn(f.observer, 'next').mockImplementation((value) => {
        frame = value;
        throw Error('SYNTHETIC_PRIVATE');
      });
      try {
        f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid' })));
      } catch {}
      expect(next).toHaveBeenCalledTimes(1);
      expect(f.receiveTrace.map((v) => v.stage)).toEqual(['RJd:before', 'RJd:after', 'DJd']);
      expect(g.projecting(frame)).toBe(false);
      expect(g.receiving()).toBe(false);
    },
  );
  it.each(['json', 'protobuf'] as const)(
    'phase3b correlates original %s decode through full source dispatch',
    (codec) => {
      const { f, g, next } = receiveFixture(codec);
      const raw = f.nativeKf({ cid: 'c_47', rid: 'server-rid' });
      const envelope = f.nativeEnvelope(raw);
      const seed = f.graph().Aa;
      const observe = vi.spyOn(f.observer, 'next').mockImplementation((receipt: any) => {
        expect(g.receiving()).toBe(true);
        expect(receipt.original).toBe(raw);
        expect(receipt.normalized).toBe(raw);
        expect(receipt.identity).toMatchObject({
          conversationId: 'c_47',
          turnId: 'server-rid',
          ridOrigin: 'server',
        });
        expect(f.graph().Aa).not.toBe(seed);
        expect(next).not.toHaveBeenCalled();
      });
      f.onReceive(() => expect(g.receiving()).toBe(true));
      f.receive(envelope);
      expect(f.decoded()).toBe(envelope);
      expect(observe).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(f.receiveTrace.map((entry) => entry.stage)).toEqual([
        'RJd:before',
        'RJd:after',
        'DJd',
      ]);
      expect(f.receiveTrace.every((entry) => entry.value === raw)).toBe(true);
      expect(g.identity().turnId).toBe('server-rid');
      expect(g.receiving()).toBe(false);
      expect(f.deferredErrors).toEqual([]);
    },
  );
  it.each(['json', 'protobuf'] as const)(
    'phase3b accepts %s server CID with provisional seed RID only after source completion',
    (codec) => {
      const { f, g, complete } = receiveFixture(codec);
      const raw = f.nativeKf({ cid: 'c_47', final: true });
      const observe = vi.spyOn(f.observer, 'next');
      f.receive(f.nativeEnvelope(raw));
      expect(observe).toHaveBeenCalledTimes(1);
      const receipt = observe.mock.calls[0]![0] as any;
      expect(receipt.original).toBe(raw);
      expect(receipt.normalized).not.toBe(raw);
      expect(receipt.ridEvidence).toBe('request-seed');
      expect(complete).not.toHaveBeenCalled();
      const control = vi.spyOn(f.observer, 'control');
      f.receive(f.nativeClose(5));
      expect(control).toHaveBeenCalledWith(5);
      expect(complete).toHaveBeenCalledTimes(1);
      expect(g.completion(receipt.observation.completed!)).toMatchObject({
        conversationId: 'c_47',
        turnId: f.approved.clientTurnId,
      });
      expect(g.receiving()).toBe(false);
      expect(f.deferredErrors).toEqual([]);
    },
  );
  it.each(['json', 'protobuf'] as const)(
    'phase3b forwards supported %s event and full tail once after observer throw',
    (codec) => {
      const { f, g, next } = receiveFixture(codec);
      const raw = f.nativeKf({ cid: 'c_47', rid: 'server-rid' });
      const observe = vi.spyOn(f.observer, 'next').mockImplementation(() => {
        throw Error('synthetic-observer');
      });
      const error = vi.spyOn(f.observer, 'error').mockImplementation(() => {
        expect(g.receiving()).toBe(false);
        expect(f.receiveTrace.at(-1)?.stage).toBe('DJd');
      });
      try {
        f.receive(f.nativeEnvelope(raw));
      } catch {}
      expect(observe).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(f.receiveTrace.map((entry) => entry.stage)).toEqual([
        'RJd:before',
        'RJd:after',
        'DJd',
      ]);
      expect(error).toHaveBeenCalledTimes(1);
      expect(f.deferredErrors).toEqual([]);
      expect(() => g.identity()).toThrow();
    },
  );
  it.each(['json', 'protobuf'] as const)(
    'phase3b latches %s receipt mutation before a later source callback restores it',
    (codec) => {
      const { f, g, next } = receiveFixture(codec);
      const raw: any = f.nativeKf({ cid: 'c_47', rid: 'server-rid' });
      const original = raw.fl[14];
      vi.spyOn(f.observer, 'next').mockImplementation(() => {
        raw.fl[14] = true;
      });
      f.onReceive((stage) => {
        if (stage === 'RJd:before') raw.fl[14] = original;
      });
      const error = vi.spyOn(f.observer, 'error');
      try {
        f.receive(f.nativeEnvelope(raw));
      } catch {}
      expect(next).toHaveBeenCalledTimes(1);
      expect(f.receiveTrace.at(-1)?.stage).toBe('DJd');
      expect(raw.fl[14]).toBe(original);
      expect(error).toHaveBeenCalledTimes(1);
      expect(() => g.identity()).toThrow();
    },
  );
  for (const codec of ['json', 'protobuf'] as const) {
    it(`final edgefix latches ${codec} removed observer reinsertion before source restoration`, () => {
      const { f, g, next } = receiveFixture(codec);
      const s0 = f.graph().Ga;
      const ii = f.graph().connection.Ki;
      expect(ii.observers).toEqual([s0]);
      let removed = false;
      next.mockImplementation(() => {
        s0.unsubscribe();
        removed = s0.closed && s0.Ys && ii.observers.length === 0;
        ii.observers.push(s0);
      });
      f.onReceive((stage) => {
        if (stage === 'RJd:after') ii.observers.splice(ii.observers.indexOf(s0), 1);
      });
      const notifications: Array<[boolean, string | undefined]> = [];
      const failure = vi.spyOn(f.observer, 'error').mockImplementation(() => {
        notifications.push([g.receiving(), f.receiveTrace.at(-1)?.stage]);
      });
      const raw = f.nativeKf({ cid: 'c_47', rid: 'server-rid' });
      try {
        f.receive(f.nativeEnvelope(raw));
      } catch {}
      expect(removed).toBe(true);
      expect(next).toHaveBeenCalledTimes(1);
      expect(f.receiveTrace.map((entry) => entry.stage)).toEqual([
        'RJd:before',
        'RJd:after',
        'DJd',
      ]);
      expect(f.receiveTrace.every((entry) => entry.value === raw)).toBe(true);
      expect(ii.observers).toEqual([]);
      expect(failure).toHaveBeenCalledTimes(1);
      expect(notifications).toEqual([[false, 'DJd']]);
      expect(f.deferredErrors).toEqual([]);
      expect(() => g.identity()).toThrow();
      expect(() => g.completion({} as never)).toThrow();
      expect(() => g.detach()).toThrow();
      const calls = { ...f.calls };
      expect(() => f.graph().connect()).toThrow();
      expect(() => f.graph().thc('late')).toThrow();
      expect(() => f.retryForward()).toThrow();
      expect(f.calls).toEqual(calls);
      expect(f.calls.query).toBe(1);
      expect(failure).toHaveBeenCalledTimes(1);
    });

    it(`final reviewfix latches ${codec} outer lifecycle mutation before source restoration`, () => {
      const { f, g, next } = receiveFixture(codec);
      const s0 = f.graph().Ga;
      expect(s0.Ys).toBe(false);
      next.mockImplementation(() => {
        s0.Ys = true;
      });
      f.onReceive((stage) => {
        if (stage === 'RJd:after') s0.Ys = false;
      });
      const notifications: Array<[boolean, string | undefined]> = [];
      const failure = vi.spyOn(f.observer, 'error').mockImplementation(() => {
        notifications.push([g.receiving(), f.receiveTrace.at(-1)?.stage]);
      });
      const raw = f.nativeKf({ cid: 'c_47', rid: 'server-rid' });
      try {
        f.receive(f.nativeEnvelope(raw));
      } catch {}
      expect(next).toHaveBeenCalledTimes(1);
      expect(f.receiveTrace.map((entry) => entry.stage)).toEqual([
        'RJd:before',
        'RJd:after',
        'DJd',
      ]);
      expect(f.receiveTrace.every((entry) => entry.value === raw)).toBe(true);
      expect(s0.Ys).toBe(false);
      expect(failure).toHaveBeenCalledTimes(1);
      expect(notifications).toEqual([[false, 'DJd']]);
      expect(f.deferredErrors).toEqual([]);
      expect(() => g.identity()).toThrow();
      expect(() => g.completion({} as never)).toThrow();
      expect(() => g.detach()).toThrow();
      const calls = { ...f.calls };
      expect(() => f.graph().connect()).toThrow();
      expect(() => f.graph().thc('late')).toThrow();
      expect(() => f.retryForward()).toThrow();
      expect(f.calls).toEqual(calls);
      expect(f.calls.query).toBe(1);
      expect(failure).toHaveBeenCalledTimes(1);
    });

    it(`phase3b reviewfix latches ${codec} outer physical mutation before source restoration`, () => {
      const { f, g, next } = receiveFixture(codec);
      const transport = f.graph().connection.uq.ha;
      const counter = transport.Gb;
      next.mockImplementation(() => {
        transport.Gb++;
      });
      f.onReceive((stage) => {
        if (stage === 'RJd:after') transport.Gb = counter;
      });
      const failure = vi.spyOn(f.observer, 'error');
      try {
        f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid' })));
      } catch {}
      expect(next).toHaveBeenCalledTimes(1);
      expect(f.receiveTrace.map((entry) => entry.stage)).toEqual([
        'RJd:before',
        'RJd:after',
        'DJd',
      ]);
      expect(transport.Gb).toBe(counter);
      expect(failure).toHaveBeenCalledTimes(1);
      expect(() => g.identity()).toThrow();
      expect(() => g.detach()).toThrow();
      expect(f.calls.query).toBe(1);
    });

    it(`phase3b reviewfix never adopts ${codec} outer physical mutation after observer failure`, () => {
      const { f, g, next } = receiveFixture(codec);
      const transport = f.graph().connection.uq.ha;
      const counter = transport.Gb;
      const hook = f.namespace.PLd;
      vi.spyOn(f.observer, 'next').mockImplementation(() => {
        throw Error('synthetic-observer');
      });
      next.mockImplementation(() => {
        transport.Gb++;
      });
      const failure = vi.spyOn(f.observer, 'error');
      let firstError: unknown;
      try {
        f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid' })));
      } catch (error) {
        firstError = error;
      }
      expect(next).toHaveBeenCalledTimes(1);
      expect(f.receiveTrace.at(-1)?.stage).toBe('DJd');
      expect(transport.Gb).toBe(counter + 1);
      expect(failure).toHaveBeenCalledTimes(1);
      expect(firstError).toBeInstanceOf(Error);
      expect(() => g.detach()).toThrow(firstError as Error);
      expect(f.namespace.PLd).toBe(hook);
      expect(transport.fU).toBe(3);
      expect(() => g.identity()).toThrow(firstError as Error);
      expect(f.calls.query).toBe(1);
    });

    it(`phase3b reviewfix quarantines ${codec} error observer hook mutation after later restoration`, () => {
      const { f, g, next } = receiveFixture(codec);
      const hook = f.namespace.PLd;
      vi.spyOn(f.observer, 'next').mockImplementation(() => {
        throw Error('synthetic-observer');
      });
      const failure = vi.spyOn(f.observer, 'error').mockImplementation(() => {
        expect(g.receiving()).toBe(false);
        expect(f.receiveTrace.at(-1)?.stage).toBe('DJd');
        f.namespace.PLd = () => {};
      });
      let firstError: unknown;
      try {
        f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid' })));
      } catch (error) {
        firstError = error;
      }
      expect(f.namespace.PLd).not.toBe(hook);
      f.namespace.PLd = hook;
      expect(next).toHaveBeenCalledTimes(1);
      expect(failure).toHaveBeenCalledTimes(1);
      expect(firstError).toBeInstanceOf(Error);
      expect(() => g.detach()).toThrow(firstError as Error);
      expect(f.namespace.PLd).toBe(hook);
      expect(() => g.identity()).toThrow(firstError as Error);
      expect(f.calls.query).toBe(1);
    });
  }

  it.each(['json', 'protobuf'] as const)(
    'phase3b refuses unsupported %s native client lifecycle before downstream dispatch',
    (codec) => {
      const { f, g, next } = receiveFixture(codec);
      const raw: any = f.nativeKf({ cid: 'c_47', rid: 'server-rid' });
      raw.fl[64] = [];
      f.api.gja = false;
      f.api.i1 = false;
      const eligibility = vi.fn(() => false);
      f.namespace.jL = eligibility;
      const observe = vi.spyOn(f.observer, 'next');
      const error = vi.spyOn(f.observer, 'error');
      try {
        f.receive(f.nativeEnvelope(raw));
      } catch {}
      expect(observe).not.toHaveBeenCalled();
      expect(eligibility).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      expect(f.receiveTrace).toEqual([]);
      expect(error).toHaveBeenCalledTimes(1);
      expect(() => g.identity()).toThrow();
      expect(() =>
        g.completion({ kind: 'marker', conversationId: 'c_47', turnId: 'server-rid' }),
      ).toThrow();
    },
  );

  it.each(['json', 'protobuf'] as const)(
    'phase3b preserves %s control4 completion and actual physical retirement',
    (codec) => {
      const { f, g, complete } = receiveFixture(codec);
      const observe = vi.spyOn(f.observer, 'next');
      f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid', final: true })));
      const control = vi.spyOn(f.observer, 'control');
      f.receive(f.nativeClose(4));
      expect(control).toHaveBeenCalledWith(4);
      expect(complete).toHaveBeenCalledTimes(1);
      expect(f.graph().connection.uq.ha.fU).toBe(0);
      expect(f.lifetime.Ps[21]).toEqual([]);
      expect(g.completion((observe.mock.calls[0]![0] as any).observation.completed!)).toMatchObject(
        { turnId: 'server-rid' },
      );
      g.detach();
      expect(f.deferredErrors).toEqual([]);
    },
  );
  it.each(['json', 'protobuf'] as const)(
    'phase3b retains %s normalized Aa and terminal content through later acceptance',
    (codec) => {
      const { f, g } = receiveFixture(codec);
      const raw: any = f.nativeKf({ cid: 'c_47', rid: 'server-rid', final: true });
      const observe = vi.spyOn(f.observer, 'next');
      f.receive(f.nativeEnvelope(raw));
      f.receive(f.nativeClose(5));
      const completion = (observe.mock.calls[0]![0] as any).observation.completed;
      expect(g.completion(completion).turnId).toBe('server-rid');
      raw.fl[14] = false;
      expect(() => g.completion(completion)).toThrow();
      raw.fl[14] = true;
      expect(() => g.completion(completion)).toThrow();
    },
  );
  it.each(['json', 'protobuf'] as const)(
    'phase3b retains %s pending correlation until every original source listener returns',
    (codec) => {
      const { f, g } = receiveFixture(codec);
      const error = vi.spyOn(f.observer, 'error');
      f.onReceive((stage) => {
        if (stage === 'DJd') {
          expect(g.receiving()).toBe(true);
          expect(() =>
            g.completion({ kind: 'marker', conversationId: 'c_47', turnId: 'server-rid' }),
          ).toThrow();
        }
      });
      try {
        f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid', final: true })));
      } catch {}
      expect(error).toHaveBeenCalledTimes(1);
      expect(g.receiving()).toBe(false);
    },
  );
  for (const codec of ['json', 'protobuf'] as const) {
    it.each(['field65', 'candidate-extra', 'candidate-accessor'] as const)(
      `phase3b rechecks ${codec} lifecycle profile after observer adds %s`,
      (kind) => {
        const { f, g, next } = receiveFixture(codec);
        const raw: any = f.nativeKf({ cid: 'c_47', rid: 'server-rid' });
        const getter = vi.fn(() => []);
        vi.spyOn(f.observer, 'next').mockImplementation(() => {
          if (kind === 'field65') raw.fl[64] = [];
          else if (kind === 'candidate-extra') {
            const extra = new f.namespace.bw([]);
            extra.fl[150] = [['synthetic']];
            raw.fl[4][0].fl[12] = extra;
          } else Object.defineProperty(raw.fl[4], '0', { get: getter });
        });
        const error = vi.spyOn(f.observer, 'error');
        try {
          f.receive(f.nativeEnvelope(raw));
        } catch {}
        expect(next).not.toHaveBeenCalled();
        expect(f.receiveTrace).toEqual([]);
        expect(getter).not.toHaveBeenCalled();
        expect(error).toHaveBeenCalledTimes(1);
        expect(() => g.identity()).toThrow();
      },
    );
    it.each(['slot', 'backing', 'content', 'flags'] as const)(
      `phase3b rejects ${codec} Aa %s mutation before a source callback restores it`,
      (kind) => {
        const { f, g, next } = receiveFixture(codec);
        let restore = () => {};
        vi.spyOn(f.observer, 'next').mockImplementation(() => {
          const aa = f.graph().Aa,
            backing = aa.fl,
            flags = backing[f.namespace.La],
            rid = backing[1];
          if (kind === 'slot') {
            f.graph().Aa = new f.namespace.CI([...backing]);
            restore = () => {
              f.graph().Aa = aa;
            };
          }
          if (kind === 'backing') {
            aa.fl = [...backing];
            restore = () => {
              aa.fl = backing;
            };
          }
          if (kind === 'content') {
            backing[1] = 'changed';
            restore = () => {
              backing[1] = rid;
            };
          }
          if (kind === 'flags') {
            backing[f.namespace.La] &= ~2;
            restore = () => {
              backing[f.namespace.La] = flags;
            };
          }
        });
        f.onReceive((stage) => {
          if (stage === 'RJd:before') restore();
        });
        const error = vi.spyOn(f.observer, 'error');
        try {
          f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid' })));
        } catch {}
        expect(next).toHaveBeenCalledTimes(1);
        expect(f.receiveTrace.at(-1)?.stage).toBe('DJd');
        expect(error).toHaveBeenCalledTimes(1);
        expect(() => g.identity()).toThrow();
      },
    );
    it.each(['decode', 'Ii', 'xD'] as const)(
      `phase3b refuses caught ${codec} %s reentry without a second source event`,
      (kind) => {
        const { f, g, next } = receiveFixture(codec);
        const raw = f.nativeKf({ cid: 'c_47', rid: 'server-rid' });
        const envelope = f.nativeEnvelope(raw);
        let reentered = false;
        f.onReceive((stage) => {
          if (stage !== 'RJd:before' || reentered) return;
          reentered = true;
          try {
            if (kind === 'decode') f.graph().connection.NTa(envelope);
            if (kind === 'Ii')
              f.graph().connection.Ki.next({ eventType: 'channel_message', message: envelope });
            if (kind === 'xD') f.graph().tB.next(raw);
          } catch {}
        });
        const error = vi.spyOn(f.observer, 'error');
        try {
          f.receive(envelope);
        } catch {}
        expect(next).toHaveBeenCalledTimes(1);
        expect(f.receiveTrace.map((entry) => entry.stage)).toEqual([
          'RJd:before',
          'RJd:after',
          'DJd',
        ]);
        expect(error).toHaveBeenCalledTimes(1);
        expect(() => g.identity()).toThrow();
      },
    );
  }
  it('phase3b refuses an isolated fake parser invocation outside owned transport dispatch', () => {
    const { f, g } = receiveFixture('json');
    expect(() => f.graph().connection.NTa(f.nativeEnvelope(f.nativeKf({ cid: 'c_47' })))).toThrow();
    expect(() => g.identity()).toThrow();
  });

  it.each(['zL', 'ci', 'zJd', 'Yh', 'Zh', 'n'] as const)(
    'phase3b refuses replaced source normalization helper %s before invocation',
    (key) => {
      const { f, g } = receiveFixture('json');
      const original = f.namespace[key];
      const changed = vi.fn((...args: unknown[]) => original(...args));
      f.namespace[key] = changed;
      try {
        f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid' })));
      } catch {}
      expect(changed).not.toHaveBeenCalled();
      expect(() => g.identity()).toThrow();
    },
  );
  it.each(['4', '5'] as const)(
    'phase3b forwards original control%s through automatic cleanup after observer throws',
    (field) => {
      const { f, g, complete } = receiveFixture('json');
      f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid', final: true })));
      vi.spyOn(f.observer, 'control').mockImplementation(() => {
        throw Error('synthetic-control');
      });
      const error = vi.spyOn(f.observer, 'error');
      try {
        f.receive(f.nativeClose(Number(field) as 4 | 5));
      } catch {}
      expect(complete).toHaveBeenCalledTimes(1);
      expect(f.outer().closed).toBe(true);
      expect(f.responseSubscription().closed).toBe(true);
      expect(f.deferredErrors).toEqual([]);
      expect(error).toHaveBeenCalledTimes(1);
      expect(g.receiving()).toBe(false);
      expect(() =>
        g.completion({ kind: 'marker', conversationId: 'c_47', turnId: 'server-rid' }),
      ).toThrow();
    },
  );
  it('phase3b blocks error observer reentry before another callback can restore mutated evidence', () => {
    const { f, g } = receiveFixture('json');
    const raw: any = f.nativeKf({ cid: 'c_47', rid: 'server-rid' });
    vi.spyOn(f.observer, 'next').mockImplementation(() => {
      throw Error('synthetic');
    });
    const restoration = vi.fn(() => {
      raw.fl[14] = false;
    });
    vi.spyOn(f.observer, 'error').mockImplementation(() => {
      raw.fl[14] = true;
      f.hooks({ current: restoration });
      try {
        g.identity();
      } catch {}
    });
    try {
      f.receive(f.nativeEnvelope(raw));
    } catch {}
    expect(restoration).not.toHaveBeenCalled();
    expect(() => g.identity()).toThrow();
  });

  it('phase3b keeps source network errors distinct from success and forwards original error identity', () => {
    const { f, g, error, complete } = receiveFixture('json');
    const failure = vi.spyOn(f.observer, 'error');
    f.graph().connection.aza({ status: 1 });
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0]?.[0]).toBe(f.graph().tB.oa);
    expect(complete).not.toHaveBeenCalled();
    expect(failure).toHaveBeenCalledTimes(1);
    expect(f.deferredErrors).toEqual([]);
    expect(() =>
      g.completion({ kind: 'marker', conversationId: 'c_47', turnId: 'server-rid' }),
    ).toThrow();
  });
  it('phase3b encloses direct original xD completion after a retained terminal witness', () => {
    const { f, g, complete } = receiveFixture('json');
    const observe = vi.spyOn(f.observer, 'next');
    f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid', final: true })));
    f.graph().tB.complete();
    expect(complete).toHaveBeenCalledTimes(1);
    expect(g.completion((observe.mock.calls[0]![0] as any).observation.completed)).toMatchObject({
      turnId: 'server-rid',
    });
    expect(f.deferredErrors).toEqual([]);
  });
  it.each(['false', 'throw'] as const)(
    'phase3b physically cancels retained graph after current %s and quarantines unresolved receipt',
    (mode) => {
      const { f, g } = receiveFixture('json');
      vi.spyOn(f.observer, 'next').mockImplementation(() => {
        if (mode === 'false') f.setCurrent(false);
        else
          f.hooks({
            current: () => {
              throw Error('synthetic-current');
            },
          });
        g.detach();
      });
      try {
        f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid' })));
      } catch {}
      try {
        g.detach();
      } catch {}
      expect(f.graph().connection.uq.ha.fU).toBe(0);
      expect(f.outer().closed).toBe(true);
      expect(f.graph().Ga.closed).toBe(true);
      expect(g.receiving()).toBe(false);
      expect(() => g.identity()).toThrow();
      expect(f.calls.query).toBe(1);
    },
  );

  it('phase3b checks current immediately after observer before source can restore cancellation', () => {
    const { f, g } = receiveFixture('json');
    vi.spyOn(f.observer, 'next').mockImplementation(() => {
      f.setCurrent(false);
    });
    f.onReceive((stage) => {
      if (stage === 'RJd:before') f.setCurrent(true);
    });
    const error = vi.spyOn(f.observer, 'error');
    try {
      f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid', final: true })));
    } catch {}
    expect(error).toHaveBeenCalledTimes(1);
    expect(() => g.identity()).toThrow();
  });

  it.each(['observer-list', 'callback', 'alias'] as const)(
    'phase3b refuses foreign %s introduced by an observer before delegation',
    (kind) => {
      const { f, g } = receiveFixture('json');
      const foreign = vi.fn();
      vi.spyOn(f.observer, 'next').mockImplementation(() => {
        if (kind === 'observer-list') f.graph().tB.observers.push({ next: foreign });
        if (kind === 'callback') f.responseSubscription().destination.ha.next = foreign;
        if (kind === 'alias') f.graph().tB = { next: foreign };
      });
      try {
        f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid' })));
      } catch {}
      expect(foreign).not.toHaveBeenCalled();
      expect(() => g.identity()).toThrow();
    },
  );
  it.each(['next', 'source', 'current', 'control'] as const)(
    'phase3b latches %s thrown callback before original catchers and reports only once',
    (stage) => {
      const { f, g, next } = receiveFixture('json');
      const failure = vi.spyOn(f.observer, 'error').mockImplementation(() => {
        expect(g.receiving()).toBe(false);
      });
      if (stage === 'next')
        vi.spyOn(f.observer, 'next').mockImplementation(() => {
          throw Error('synthetic');
        });
      if (stage === 'source')
        next.mockImplementation(() => {
          throw Error('synthetic-source');
        });
      if (stage === 'current')
        vi.spyOn(f.observer, 'next').mockImplementation(() => {
          f.hooks({
            current: () => {
              throw Error('synthetic-current');
            },
          });
        });
      try {
        f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid', final: true })));
      } catch {}
      if (stage === 'control') {
        vi.spyOn(f.observer, 'control').mockImplementation(() => {
          throw Error('synthetic-control');
        });
        try {
          f.receive(f.nativeClose(5));
        } catch {}
      }
      expect(failure).toHaveBeenCalledTimes(1);
      expect(g.receiving()).toBe(false);
      expect(() => g.identity()).toThrow();
      expect(failure).toHaveBeenCalledTimes(1);
      if (stage === 'source')
        expect(f.deferredErrors.map((error: any) => error.message)).toEqual(['synthetic-source']);
      else expect(f.deferredErrors).toEqual([]);
      if (stage !== 'control') expect(f.receiveTrace.at(-1)?.stage).toBe('DJd');
    },
  );

  it.each(['json', 'protobuf'] as const)(
    'phase3b latches original %s decoder failure even when its caller catches it',
    (codec) => {
      const { f, g, next } = receiveFixture(codec);
      const failure = vi.spyOn(f.observer, 'error').mockImplementation(() => {
        expect(g.receiving()).toBe(false);
      });
      const decode = vi.fn(() => {
        throw Error('synthetic-decode');
      });
      f.onDecode(decode);
      try {
        f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid' })));
      } catch {}
      expect(decode).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
      expect(failure).toHaveBeenCalledTimes(1);
      expect(() => g.identity()).toThrow();
      expect(failure).toHaveBeenCalledTimes(1);
    },
  );

  for (const codec of ['json', 'protobuf'] as const) {
    it.each(['Ii', 'xD'] as const)(
      `phase3b rejects uncorrelated ${codec} %s data before original dispatch`,
      (channel) => {
        const { f, g, next } = receiveFixture(codec);
        const raw = f.nativeKf({ cid: 'c_47', rid: 'server-rid' });
        try {
          if (channel === 'Ii')
            f.graph().connection.Ki.next({
              eventType: 'channel_message',
              message: f.nativeEnvelope(raw),
            });
          else f.graph().tB.next(raw);
        } catch {}
        expect(next).not.toHaveBeenCalled();
        expect(f.receiveTrace).toEqual([]);
        expect(() => g.identity()).toThrow();
      },
    );
    it.each([4, 5] as const)(
      `phase3b never treats ${codec} control%s as a terminal response`,
      (field) => {
        const { f, g, complete } = receiveFixture(codec);
        f.receive(f.nativeClose(field));
        expect(complete).toHaveBeenCalledTimes(1);
        expect(() =>
          g.completion({ kind: 'marker', conversationId: 'c_47', turnId: 'server-rid' }),
        ).toThrow();
        expect(f.deferredErrors).toEqual([]);
      },
    );
    it(`phase3b refuses replayed ${codec} envelope at the original decoder boundary`, () => {
      const { f, g, next } = receiveFixture(codec);
      const envelope = f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid' }));
      f.receive(envelope);
      try {
        f.receive(envelope);
      } catch {}
      expect(next).toHaveBeenCalledTimes(1);
      expect(() => g.identity()).toThrow();
    });
    it(`phase3b rejects completion during ${codec} observer while correlation is pending`, () => {
      const { f, g, next } = receiveFixture(codec);
      vi.spyOn(f.observer, 'next').mockImplementation((receipt: any) => {
        expect(g.receiving()).toBe(true);
        expect(() => g.completion(receipt.observation.completed)).toThrow();
      });
      try {
        f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid', final: true })));
      } catch {}
      expect(next).toHaveBeenCalledTimes(1);
      expect(() => g.identity()).toThrow();
    });
  }

  it('phase3b observes original completion even without a consumer complete callback', () => {
    const f = geminiSdkWebChannelFixture('json', true);
    const { g } = start(f);
    f.bindOriginal(g.bindObservable);
    f.originalXub({ next: () => {} });
    f.flushOpen();
    const observe = vi.spyOn(f.observer, 'next');
    f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid', final: true })));
    f.receive(f.nativeClose(5));
    expect(f.outer().closed).toBe(true);
    expect(g.completion((observe.mock.calls[0]![0] as any).observation.completed)).toMatchObject({
      conversationId: 'c_47',
      turnId: 'server-rid',
    });
  });

  it.each(['json', 'protobuf'] as const)(
    'phase3b quarantines %s Ii observer append during its original copied next loop',
    (codec) => {
      const { f, g, next } = receiveFixture(codec);
      const foreign = vi.fn();
      const failure = vi.spyOn(f.observer, 'error');
      vi.spyOn(f.observer, 'next').mockImplementation(() => {
        f.graph().connection.Ki.observers.push({ next: foreign });
      });
      try {
        f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid' })));
      } catch {}
      // Lt.next already copied Ii.observers before this callback. This only proves
      // appends to that source list cannot join the current copied next iteration.
      expect(foreign).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      expect(failure).toHaveBeenCalledTimes(1);
      expect(() => g.identity()).toThrow();
      try {
        g.detach();
      } catch {}
      expect(foreign).not.toHaveBeenCalled();
    },
  );

  for (const codec of ['json', 'protobuf'] as const) {
    it.each(['error-observer', 'later'] as const)(
      `phase3b retires intact ${codec} source-consumed state at %s after observer failure`,
      (when) => {
        const { f, g, next } = receiveFixture(codec);
        vi.spyOn(f.observer, 'next').mockImplementation(() => {
          throw Error('synthetic');
        });
        const failure = vi.spyOn(f.observer, 'error').mockImplementation(() => {
          expect(g.receiving()).toBe(false);
          if (when === 'error-observer') g.detach();
        });
        let firstError: unknown;
        try {
          f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid' })));
        } catch (error) {
          firstError = error;
        }
        if (when === 'later') expect(f.graph().connection.uq.ha.fU).toBe(3);
        g.detach();
        expect(f.graph().connection.uq.ha.fU).toBe(0);
        expect(f.outer().closed).toBe(true);
        expect(f.graph().Ga.closed).toBe(true);
        expect(f.responseSubscription().closed).toBe(true);
        expect(f.lifetime.Ps[21]).toEqual([]);
        expect(failure).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledTimes(1);
        expect(f.receiveTrace.at(-1)?.stage).toBe('DJd');
        expect(f.deferredErrors).toEqual([]);
        expect(f.calls.query).toBe(1);
        expect(firstError).toBeInstanceOf(Error);
        try {
          g.identity();
        } catch (error) {
          expect(error).toBe(firstError);
        }
        expect(() =>
          g.completion({ kind: 'marker', conversationId: 'c_47', turnId: 'server-rid' }),
        ).toThrow();
      },
    );
    it(`phase3b never finishes or advances ${codec} skipped lifecycle projection for later cleanup`, () => {
      const { f, g, next } = receiveFixture(codec);
      const raw: any = f.nativeKf({ cid: 'c_47', rid: 'server-rid' });
      vi.spyOn(f.observer, 'next').mockImplementation(() => {
        raw.fl[64] = [];
      });
      try {
        f.receive(f.nativeEnvelope(raw));
      } catch {}
      delete raw.fl[64];
      expect(() => g.detach()).toThrow();
      expect(f.graph().connection.uq.ha.fU).toBe(3);
      expect(next).not.toHaveBeenCalled();
      expect(() => g.identity()).toThrow();
      expect(f.calls.query).toBe(1);
    });
  }
  it.each(['json', 'protobuf'] as const)(
    'phase3b checks current independently after successful %s terminal and original completion',
    (codec) => {
      const { f, g } = receiveFixture(codec);
      const observe = vi.spyOn(f.observer, 'next');
      f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid', final: true })));
      f.receive(f.nativeClose(5));
      const completion = (observe.mock.calls[0]![0] as any).observation.completed;
      f.setCurrent(false);
      expect(() => g.completion(completion)).toThrow();
      f.setCurrent(true);
      expect(() => g.completion(completion)).toThrow();
    },
  );
});

describe('current shared native preparation and recovery ownership', () => {
  it.each(['json', 'protobuf'] as const)(
    'cancels the original %s reconnect timer after unsupported control63 unwinds',
    (codec) => {
      const f = geminiSdkWebChannelFixture(codec, true);
      const error = vi.fn();
      const complete = vi.fn();
      let g: ReturnType<typeof arm>;
      let recovering: unknown;
      let cleanupComplete = false;
      f.observer.error = () => {
        error();
        recovering = {
          wa: f.shared.state().wa,
          pending: f.shared.pending(),
          trace: f.receiveTrace.map((event) => event.stage),
        };
        f.outer().unsubscribe();
        g.close();
        g.detach();
        cleanupComplete = true;
      };
      ({ g } = start(f));
      f.bindOriginal(g.bindObservable);
      f.originalXub({ complete });
      f.flushOpen();
      const raw = f.nativeKf({ cid: 'c_63', rid: 'server-rid' });
      raw.fl[62] = 2;
      try {
        f.receive(f.nativeEnvelope(raw));
      } catch {}
      expect(error).toHaveBeenCalledTimes(1);
      expect(recovering).toEqual({
        wa: true,
        pending: 1,
        trace: ['RJd:before', 'RJd:after', 'DJd'],
      });
      expect(complete).not.toHaveBeenCalled();
      expect(cleanupComplete).toBe(true);
      expect(f.shared.pending()).toBe(0);
      for (const run of f.shared.timers) {
        try {
          run();
        } catch {}
      }
      expect(f.calls).toMatchObject({ factory: 1, config: 1, query: 1 });
      expect(() => g.identity()).toThrow();
    },
  );
  it.each(['json', 'protobuf'] as const)(
    'retains unsafe %s retirement when the original owned probe unsubscribe throws',
    (codec) => {
      const f = geminiSdkWebChannelFixture(codec, true);
      const { g } = start(f);
      f.bindOriginal(g.bindObservable);
      f.originalXub();
      f.flushOpen();
      const state = f.shared.state();
      // Synthetic eligibility leaf supplies the already committed owning state.
      state.committed = true;
      state.conversationId = 'c_probe';
      f.shared
        .observer()
        .error(Object.assign(Error('synthetic-network'), { syntheticNetwork: true }));
      expect(state.Da.closed).toBe(false);
      expect(f.shared.pending()).toBe(1);
      f.shared.failProbeUnsubscribe();
      expect(() => f.outer().unsubscribe()).toThrow();
      expect(f.graph().Ga.closed).toBe(false);
      g.close();
      expect(() => g.detach()).toThrow();
      expect(f.calls).toMatchObject({ factory: 1, config: 1, query: 1 });
    },
  );
  it('refuses a continuation72 CID before another native configuration or query', () => {
    const f = geminiSdkWebChannelFixture('json', true);
    f.ok.fl[71] = new f.namespace.yL(['c_prior']);
    const { g } = start(f);
    f.bindOriginal(g.bindObservable);
    expect(() => f.originalXub()).toThrow();
    expect(f.calls.query).toBe(0);
  });
});

it.each(['json', 'protobuf'] as const)(
  'refuses a later original shared %s callback before a second native factory',
  (codec) => {
    const f = geminiSdkWebChannelFixture(codec, true);
    const { g } = start(f);
    f.bindOriginal(g.bindObservable);
    f.originalXub();
    expect(() => f.shared.retry()(f.ok, f.packet.request)).toThrow();
    expect(f.calls).toMatchObject({ factory: 1, config: 1, query: 1 });
  },
);

it.each(['json', 'protobuf'] as const)(
  'runs original %s projection timer cleanup before route deletion',
  (codec) => {
    const f = geminiSdkWebChannelFixture(codec, true);
    const { g } = start(f);
    f.bindOriginal(g.bindObservable);
    f.project((_raw, _request, destination) =>
      destination.next({ responseType: 'ROUTING', turnId: 'owned-route' }),
    );
    f.originalXub();
    f.flushOpen();
    f.receive(f.nativeEnvelope(f.nativeKf({ cid: 'c_47', rid: 'server-rid', final: true })));
    expect(f.api.Ga.has('owned-route')).toBe(true);
    f.outer().unsubscribe();
    expect(f.projectionCleanup).toEqual(['timer-before-route']);
    expect(f.api.Ga.has('owned-route')).toBe(false);
    g.close();
    g.detach();
  },
);
for (const codec of ['json', 'protobuf'] as const)
  it.each([2, 3, 4])(
    `forwards ${codec} control63=%s through original projection while refusing its receipt`,
    (control) => {
      const f = geminiSdkWebChannelFixture(codec, true);
      const { g } = start(f);
      const accepted = vi.spyOn(f.observer, 'next');
      f.bindOriginal(g.bindObservable);
      f.originalXub();
      f.flushOpen();
      const raw = f.nativeKf({ cid: 'c_63', rid: 'server-rid' });
      raw.fl[62] = control;
      try {
        f.receive(f.nativeEnvelope(raw));
      } catch {}
      expect(accepted).not.toHaveBeenCalled();
      expect(f.receiveTrace.map((event) => event.stage)).toEqual([
        'RJd:before',
        'RJd:after',
        'DJd',
      ]);
      expect(f.calls).toMatchObject({ factory: 1, config: 1, query: 1 });
      expect(() =>
        g.completion({ kind: 'marker', conversationId: 'c_63', turnId: 'server-rid' }),
      ).toThrow();
    },
  );

it.each([
  ['PLd', 'dispatch-native-n01'],
  ['dKd', 'dispatch-native-n02'],
  ['LJd', 'dispatch-native-n03'],
  ['Klb', 'dispatch-native-n04'],
] as const)('latches the before-arm %s fingerprint failure as immutable %s', (key, code) => {
  const f = geminiSdkWebChannelFixture();
  f.namespace[key] = () => {};
  let failure: unknown;
  try {
    arm(f.namespace, f.api, f.approved, f.current, f.consumingOriginal, f.observer);
  } catch (error) {
    failure = error;
  }
  expect(failure).toBeInstanceOf(Error);
  expect(Object.getOwnPropertyDescriptor(failure, 'geminiNativeDiagnostic')).toMatchObject({
    value: code,
    writable: false,
    configurable: false,
  });
  expect(f.calls.factory).toBe(0);
  expect(f.calls.query).toBe(0);
});
it('distinguishes an unreadable preflight descriptor from its source fingerprint without invoking getters', () => {
  const f = geminiSdkWebChannelFixture(),
    getter = vi.fn(() => f.namespace.LJd);
  Object.defineProperty(f.namespace, 'LJd', { get: getter, configurable: true });
  let error: unknown;
  try {
    arm(f.namespace, f.api, f.approved, f.current, f.consumingOriginal, f.observer);
  } catch (e) {
    error = e;
  }
  expect(Object.getOwnPropertyDescriptor(error, 'geminiNativeDiagnostic')?.value).toBe(
    'dispatch-native-n10',
  );
  expect(getter).not.toHaveBeenCalled();
});
it('preserves an unclassified original control throw before any extension Error and never backfills identity', () => {
  const f = geminiSdkWebChannelFixture('json', true),
    { g } = start(f);
  f.bindOriginal(g.bindObservable);
  const original = new Error('synthetic-original');
  f.originalXub({
    complete() {
      throw original;
    },
  });
  f.responseSubscription().complete();
  expect(f.deferredErrors).toContain(original);
  let first: unknown, again: unknown;
  try {
    g.identity();
  } catch (e) {
    first = e;
  }
  try {
    g.identity();
  } catch (e) {
    again = e;
  }
  expect(first).toBeInstanceOf(Error);
  expect(again).toBe(first);
  expect(Object.getOwnPropertyDescriptor(first, 'geminiNativeDiagnostic')).toBeUndefined();
  expect(f.calls.query).toBe(1);
});
it('keeps classified teardown origin while preserving original UnsubscriptionError children and error identity', () => {
  const f = geminiSdkWebChannelFixture('json', true),
    { g } = start(f);
  f.bindOriginal(g.bindObservable);
  f.originalXub();
  const parent = f.graph().Ga,
    [notifier, removal] = parent.wa;
  Object.freeze(f.lifetime.Ps[21]);
  let original: any;
  try {
    parent.unsubscribe();
  } catch (error) {
    original = error;
  }
  expect(original.name).toBe('UnsubscriptionError');
  expect(original.errors).toHaveLength(1);
  expect([parent.closed, notifier.closed, removal.closed]).toEqual([true, true, true]);
  let first: any, again: unknown;
  try {
    g.identity();
  } catch (error) {
    first = error;
  }
  try {
    g.identity();
  } catch (error) {
    again = error;
  }
  expect(first).toBeInstanceOf(Error);
  expect(first.cause).toBe('dispatch-cold-webchannel');
  expect(again).toBe(first);
  expect(Object.getOwnPropertyDescriptor(first, 'geminiNativeDiagnostic')?.value).toBe(
    'dispatch-native-n18',
  );
  const children = [...original.errors];
  expect(original).not.toBe(first);
  expect(children[0]).toBeInstanceOf(Error);
  expect(() => g.detach()).toThrow();
  expect(original.errors).toHaveLength(children.length);
  children.forEach((child, index) => expect(original.errors[index]).toBe(child));
  expect(f.calls.query).toBe(1);
});

it('restores successful nested construction scopes before a new identity-only refusal', () => {
  const f = geminiSdkWebChannelFixture('json', true),
    { g } = start(f);
  f.bindOriginal(g.bindObservable);
  f.originalXub();
  f.setCurrent(false);
  let first: any;
  try {
    g.identity();
  } catch (error) {
    first = error;
  }
  expect(first).toBeInstanceOf(Error);
  expect(Object.getOwnPropertyDescriptor(first, 'geminiNativeDiagnostic')?.value).toBe(
    'dispatch-native-n23',
  );
  expect(f.calls.query).toBe(1);
});
it('distinguishes backend fingerprint from the first later identity poll', () => {
  const f = geminiSdkWebChannelFixture(),
    { g } = start(f);
  f.namespace.cja.prototype.Z8 = () => {};
  try {
    f.originalXub();
  } catch {}
  let error: any;
  try {
    g.identity();
  } catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(Error);
  expect(Object.getOwnPropertyDescriptor(error, 'geminiNativeDiagnostic')?.value).toBe(
    'dispatch-native-n08',
  );
  expect(f.calls.nativeSends).toBe(0);
});

it('uses the selected backend predicate under actual factory construction scope', () => {
  const f = geminiSdkWebChannelFixture();
  const xhr = f.namespace.Xj.prototype;
  Object.setPrototypeOf(xhr, Object.create(Object.getPrototypeOf(xhr)));
  const { g } = start(f);
  let first: any;
  try {
    f.originalXub();
  } catch (error) {
    first = error;
  }
  expect(first).toBeInstanceOf(Error);
  expect(Object.getOwnPropertyDescriptor(first, 'geminiNativeDiagnostic')?.value).toBe(
    'dispatch-native-n19',
  );
  expect(f.calls).toMatchObject({ factory: 1, config: 0, query: 0, nativeSends: 0 });
  expect(() => g.detach()).toThrow();
  let again: unknown;
  try {
    g.identity();
  } catch (error) {
    again = error;
  }
  expect(again).toBe(first);
});

it('uses the selected physical predicate inside original shared-close scope', () => {
  const f = geminiSdkWebChannelFixture('json', true),
    { g } = start(f);
  f.bindOriginal(g.bindObservable);
  f.originalXub();
  f.flushOpen();
  const before = f.calls.nativeSends;
  g.close();
  f.graph().connection.uq.ha.Ih++;
  let first: any;
  try {
    f.namespace.iM(f.graph());
  } catch (error) {
    first = error;
  }
  expect(first).toBeInstanceOf(Error);
  expect(Object.getOwnPropertyDescriptor(first, 'geminiNativeDiagnostic')?.value).toBe(
    'dispatch-native-n20',
  );
  expect(f.calls).toMatchObject({ factory: 1, config: 1, query: 1, nativeSends: before });
  expect(() => g.detach()).toThrow();
  let again: unknown;
  try {
    g.identity();
  } catch (error) {
    again = error;
  }
  expect(again).toBe(first);
});

it('uses the selected native-send gate inside actual Kf physical scope', () => {
  const { f, g } = start();
  f.originalXub();
  f.flushOpen();
  const before = f.calls.nativeSends;
  f.synchronousOpenEvents();
  let attempted = 0,
    first: any;
  f.hooks({
    current() {
      const request = f.requests().findLast((r) => r.Za.length && r.ha?.TOc);
      if (!request || attempted) return;
      attempted++;
      // Actual source OPENED delivery reenters the existing current checkpoint.
      // The already-bound original native gate must refuse extension callback reentry.
      try {
        request.ha.vk.send('synthetic-reentrant');
      } catch (error) {
        first = error;
      }
    },
  });
  expect(() => f.retryForward()).toThrow();
  expect(attempted).toBe(1);
  expect(Object.getOwnPropertyDescriptor(first, 'geminiNativeDiagnostic')?.value).toBe(
    'dispatch-native-n21',
  );
  expect(f.calls).toMatchObject({ factory: 1, config: 1, query: 1, nativeSends: before });
  let again: unknown;
  try {
    g.identity();
  } catch (error) {
    again = error;
  }
  expect(again).toBe(first);
  expect(() => g.detach()).toThrow();
});

it.each(['snapshot', 'send'] as const)(
  'admits exact public AsyncContext %s independently',
  (branch) => {
    const f = geminiSdkWebChannelFixture('json', true);
    const context = f.asyncContext({
      snapshot: branch === 'snapshot' ? 'polyfill' : 'native',
      send: branch === 'send' ? 'polyfill' : 'native',
    });
    const previous = Object.getOwnPropertyDescriptor(globalThis, 'AsyncContext');
    Object.defineProperty(globalThis, 'AsyncContext', {
      value: context.context,
      configurable: true,
      writable: true,
    });
    try {
      const { g } = start(f);
      f.bindOriginal(g.bindObservable);
      const token = {};
      context.run(token, () => f.originalXub());
      expect(f.calls).toMatchObject({ factory: 1, config: 1, query: 1, nativeSends: 0 });
      context.run(token, () => f.flushOpen());
      expect(f.calls.nativeSends).toBe(3);
      g.detach();
    } finally {
      if (previous) Object.defineProperty(globalThis, 'AsyncContext', previous);
      else delete (globalThis as any).AsyncContext;
    }
  },
);

it('preserves exact public wrapper identity, receiver, arguments, return, throw and context finally', () => {
  const f = geminiSdkWebChannelFixture(),
    p = f.asyncContext({ snapshot: 'polyfill', send: 'polyfill' });
  const receiver = {},
    captured = {},
    later = {},
    result = {},
    thrown = {};
  let seen: unknown[],
    capturedDuringCall = false;
  function original(this: unknown, ...args: unknown[]) {
    seen = [this, ...args];
    capturedDuringCall = p.isCurrent(captured);
    return result;
  }
  expect(p.context.Snapshot.wrap(original)).toBe(original);
  const wrapped = p.run(captured, () => p.context.Snapshot.wrap(original));
  expect(p.run(later, () => Reflect.apply(wrapped, receiver, [1, 2]))).toBe(result);
  expect(seen!).toEqual([receiver, 1, 2]);
  expect(capturedDuringCall).toBe(true);
  expect(p.isCurrent(undefined)).toBe(true);
  let throwContext = false;
  const failing = p.run(captured, () =>
    p.context.Snapshot.wrap(function () {
      throwContext = p.isCurrent(captured);
      throw thrown;
    }),
  );
  let failure: unknown,
    restored = false;
  p.run(later, () => {
    try {
      failing();
    } catch (error) {
      failure = error;
    }
    restored = p.isCurrent(later);
  });
  expect(failure).toBe(thrown);
  expect(throwContext).toBe(true);
  expect(restored).toBe(true);
  const underlying = vi.fn(original),
    send = p.sendFor(underlying);
  expect(p.run(captured, () => Reflect.apply(send, receiver, [3, 4]))).toBe(result);
  expect(seen!).toEqual([receiver, 3, 4]);
  expect(p.recorded(receiver, captured)).toBe(true);
  expect(underlying).toHaveBeenCalledTimes(1);
  const sendFailure = p.sendFor(function (this: unknown, ...args: unknown[]) {
    seen = [this, ...args];
    throw thrown;
  });
  failure = undefined;
  try {
    p.run(later, () => Reflect.apply(sendFailure, receiver, [5, 6]));
  } catch (error) {
    failure = error;
  }
  expect(failure).toBe(thrown);
  expect(seen!).toEqual([receiver, 5, 6]);
  expect(p.recorded(receiver, later)).toBe(true);
  expect(p.isCurrent(undefined)).toBe(true);
});

it.each([
  'wrap-body',
  'send-body',
  'other-method',
  'wrap-accessor',
  'send-accessor',
  'wrap-late',
  'send-late',
] as const)('keeps exact public AsyncContext refusal for %s', (kind) => {
  const f = geminiSdkWebChannelFixture('json', true),
    p = f.asyncContext({ snapshot: 'polyfill', send: 'polyfill', active: true });
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'AsyncContext');
  Object.defineProperty(globalThis, 'AsyncContext', {
    value: p.context,
    configurable: true,
    writable: true,
  });
  const getter = vi.fn(() => () => {}),
    owner = kind.startsWith('wrap') ? p.context.Snapshot : f.namespace.fa.XMLHttpRequest.prototype;
  const key = kind.startsWith('wrap') ? 'wrap' : kind === 'other-method' ? 'open' : 'send';
  try {
    if (kind.endsWith('accessor'))
      Object.defineProperty(owner, key, { get: getter, configurable: true });
    else if (!kind.endsWith('late')) owner[key] = kind === 'other-method' ? owner.send : () => {};
    let failure: any;
    if (kind.endsWith('late')) {
      const { g } = start(f);
      f.bindOriginal(g.bindObservable);
      f.originalXub();
      owner[key] = () => {};
      try {
        f.flushOpen();
      } catch (error) {
        failure = error;
      }
      expect(f.calls).toMatchObject({ factory: 1, config: 1, query: 1, nativeSends: 0 });
      expect(() => g.detach()).toThrow();
    } else {
      try {
        const { g } = start(f);
        f.bindOriginal(g.bindObservable);
        f.originalXub();
      } catch (error) {
        failure = error;
      }
    }
    expect(failure).toBeInstanceOf(Error);
    expect(Object.getOwnPropertyDescriptor(failure, 'geminiNativeDiagnostic')?.value).toBe(
      kind.endsWith('accessor') || kind.endsWith('late')
        ? 'dispatch-native-n10'
        : 'dispatch-native-n09',
    );
    expect(getter).not.toHaveBeenCalled();
  } finally {
    if (previous) Object.defineProperty(globalThis, 'AsyncContext', previous);
    else delete (globalThis as any).AsyncContext;
  }
});

it.each(['retirement', 'reentry'] as const)(
  'keeps public polyfill original one-use %s bounds',
  (kind) => {
    const f = geminiSdkWebChannelFixture('json', true),
      p = f.asyncContext({ snapshot: 'polyfill', send: 'polyfill', active: true });
    const previous = Object.getOwnPropertyDescriptor(globalThis, 'AsyncContext');
    Object.defineProperty(globalThis, 'AsyncContext', {
      value: p.context,
      configurable: true,
      writable: true,
    });
    try {
      const { g } = start(f);
      f.bindOriginal(g.bindObservable);
      f.originalXub();
      f.flushOpen();
      expect(f.calls.nativeSends).toBe(3);
      if (kind === 'retirement') {
        const native = f.forwardRequest().ha.vk;
        g.detach();
        expect(f.calls).toMatchObject({ query: 1, config: 1, nativeSends: 4, terminate: 1 });
        expect(() => native.send('synthetic-late')).toThrow();
        expect(f.calls.nativeSends).toBe(4);
      } else {
        f.synchronousOpenEvents();
        let first: any,
          attempts = 0;
        f.hooks({
          current() {
            const request = f.requests().findLast((r) => r.Za.length && r.ha?.TOc);
            if (!request || attempts) return;
            attempts++;
            try {
              request.ha.vk.send('synthetic-reentry');
            } catch (error) {
              first = error;
            }
          },
        });
        expect(() => f.retryForward()).toThrow();
        expect(attempts).toBe(1);
        expect(Object.getOwnPropertyDescriptor(first, 'geminiNativeDiagnostic')?.value).toBe(
          'dispatch-native-n21',
        );
        expect(f.calls).toMatchObject({ query: 1, config: 1, nativeSends: 3 });
        expect(() => g.detach()).toThrow();
      }
      expect(p.isInitial()).toBe(true);
    } finally {
      if (previous) Object.defineProperty(globalThis, 'AsyncContext', previous);
      else delete (globalThis as any).AsyncContext;
    }
  },
);

describe('Native57 first outbound predicate', () => {
  it.each([
    ['argument-mode', 'dispatch-native-n15-argument-mode'],
    ['queue-order', 'dispatch-native-n15-queue-order'],
    ['configuration-zero', 'dispatch-native-n15-configuration-zero'],
    ['wire-forbidden-flags', 'dispatch-native-n15-wire-forbidden-flags'],
    ['content-equality', 'dispatch-native-n15-content-equality'],
    ['evidence-seed-immutable', 'dispatch-native-n15-evidence-seed-immutable'],
  ] as const)('retains the actual %s rejection through a later poll', (kind, code) => {
    const f = geminiSdkWebChannelFixture();
    if (kind === 'configuration-zero') {
      const write = f.namespace.Wh;
      f.namespace.Wh = (value: any, field: number, data: unknown, ...rest: any[]) => {
        const result = write(value, field, data, ...rest);
        if (
          kind === 'configuration-zero' &&
          Object.getPrototypeOf(value) === f.namespace.qJd.prototype &&
          field === 2
        )
          value.fl[1] = 2n;
        return result;
      };
    }
    const { g } = start(f);
    let changed = false,
      captured: unknown;
    f.hooks({
      config() {
        if (kind === 'argument-mode') {
          changed = true;
          try {
            f.namespace.LJd(
              f.graph(),
              f.ok,
              f.api.requestSource,
              'synthetic-other-mode',
              f.approved.clientTurnId,
            );
          } catch (error) {
            captured = error;
          }
        }
        if (kind === 'queue-order') {
          changed = true;
          const close = f.namespace.Th(
            new f.namespace.tJd([undefined, undefined, undefined, new f.namespace.UId([1])]),
          );
          try {
            f.queued().push(close);
          } catch (error) {
            captured = error;
          }
        }
      },
      current() {
        if (changed) return;
        if (kind === 'content-equality' && f.produced()?.fl[0]) {
          changed = true;
          f.produced().fl[0].fl[0].fl[2] = 'en';
        }
        if (kind === 'wire-forbidden-flags' && f.produced()?.fl[0]) {
          changed = true;
          f.produced().fl[0].fl[0].fl[f.namespace.La] |= 128;
        }
        if (kind === 'evidence-seed-immutable' && f.graph()?.Aa) {
          changed = true;
          f.graph().Aa.Fb = f.namespace.Kaa;
        }
      },
    });
    try {
      f.originalXub();
    } catch (error) {
      captured ??= error;
    }
    let first: unknown, again: unknown;
    try {
      g.identity();
    } catch (error) {
      first = error;
    }
    try {
      g.identity();
    } catch (error) {
      again = error;
    }
    expect(first).toBeInstanceOf(Error);
    expect(again).toBe(first);
    if (captured) expect(first).toBe(captured);
    if (kind !== 'configuration-zero') expect(changed).toBe(true);
    expect(Object.getOwnPropertyDescriptor(first, 'geminiNativeDiagnostic')).toMatchObject({
      value: code,
      writable: false,
      configurable: false,
    });
    expect(f.calls).toMatchObject({ factory: 1, query: 0, nativeSends: 0 });
    f.hooks({});
    try {
      g.close();
      g.detach();
    } catch {}
    expect(f.calls.nativeSends).toBe(0);
  });
});

it('Native57 keeps exact original gJd unknown throws distinct from owned assertions', () => {
  const f = geminiSdkWebChannelFixture(),
    getter = vi.fn(() => 'dispatch-native-n15-configuration-zero');
  const original = Object.defineProperty(new Error('SYNTHETIC_PRIVATE'), 'geminiNativeDiagnostic', {
    get: getter,
  });
  f.namespace.XL = () => {
    throw original;
  };
  const { g } = start(f);
  let first: unknown, again: unknown;
  try {
    f.originalXub();
  } catch (error) {
    first = error;
  }
  try {
    g.identity();
  } catch (error) {
    again = error;
  }
  expect(first).toBeInstanceOf(Error);
  expect(again).toBe(first);
  expect(Object.getOwnPropertyDescriptor(first, 'geminiNativeDiagnostic')?.value).toBe(
    'dispatch-native-n15-unknown-gjd',
  );
  expect(getter).not.toHaveBeenCalled();
  expect(Object.getOwnPropertyDescriptor(original, 'geminiNativeDiagnostic')?.get).toBe(getter);
  expect(f.calls).toMatchObject({ factory: 1, config: 0, query: 0, nativeSends: 0 });
});

it('Native57 refines a missing seed object at its existing graph assertion', () => {
  const f = geminiSdkWebChannelFixture(),
    original = f.namespace.LAd.prototype.setLocale;
  f.namespace.LAd.prototype.setLocale = function (this: unknown, value: unknown) {
    f.graph().Aa = null;
    return Reflect.apply(original, this, [value]);
  };
  const { g } = start(f);
  let first: unknown, again: unknown;
  try {
    f.originalXub();
  } catch (error) {
    first = error;
  }
  try {
    g.identity();
  } catch (error) {
    again = error;
  }
  expect(first).toBeInstanceOf(Error);
  expect(again).toBe(first);
  expect(Object.getOwnPropertyDescriptor(first, 'geminiNativeDiagnostic')?.value).toBe(
    'dispatch-native-n15-object-shape',
  );
  expect(f.calls).toMatchObject({ factory: 1, query: 0, nativeSends: 0 });
});

it.each([
  [0, 'instance'],
  [1, 'ok'],
  [2, 'source'],
  [3, 'mode'],
  [4, 'turn'],
] as const)('Native57 distinguishes gJd argument %s before delegation', (index, label) => {
  const f = geminiSdkWebChannelFixture(),
    { g } = start(f);
  let first: unknown;
  f.hooks({
    config() {
      const args = [
        f.graph(),
        f.ok,
        f.api.requestSource,
        f.approved.modeId,
        f.approved.clientTurnId,
      ];
      args[index] = index === 2 ? 999 : 'synthetic-other';
      try {
        Reflect.apply(f.namespace.LJd, f.namespace, args);
      } catch (error) {
        first = error;
      }
    },
  });
  try {
    f.originalXub();
  } catch {}
  expect(Object.getOwnPropertyDescriptor(first, 'geminiNativeDiagnostic')?.value).toBe(
    `dispatch-native-n15-argument-${label}`,
  );
  expect(f.calls).toMatchObject({ factory: 1, config: 0, query: 0, nativeSends: 0 });
  let again: unknown;
  try {
    g.identity();
  } catch (error) {
    again = error;
  }
  expect(again).toBe(first);
});

// Native58 request prototype admission is repeated after application callbacks and before producer entry.
describe('Native58 inherited ZKa checkpoints', () => {
  it.each(['data', 'accessor'] as const)(
    'refuses late inherited %s before original subscription without invoking a getter',
    (kind) => {
      const f = geminiSdkWebChannelFixture('json', true);
      const { g } = start(f);
      const getter = vi.fn(() => false);
      const previous = Object.getOwnPropertyDescriptor(Object.prototype, 'ZKa');
      f.bindOriginal((observable) => {
        Object.defineProperty(Object.prototype, 'ZKa', {
          configurable: true,
          ...(kind === 'data' ? { value: false } : { get: getter }),
        });
        g.bindObservable(observable);
      });
      try {
        const refused = vi.fn();
        f.originalXub({ error: refused });
        expect(refused).toHaveBeenCalledTimes(1);
        expect(f.calls).toMatchObject({ factory: 0, config: 0, query: 0, nativeSends: 0 });
        expect(f.produced()).toBeUndefined();
        expect(getter).not.toHaveBeenCalled();
      } finally {
        if (previous) Object.defineProperty(Object.prototype, 'ZKa', previous);
        else Reflect.deleteProperty(Object.prototype, 'ZKa');
      }
    },
  );
  it.each(['data', 'accessor'] as const)(
    'refuses inherited %s added inside current before original PLd delegation',
    (kind) => {
      const f = geminiSdkWebChannelFixture();
      const { g } = start(f);
      const original = vi.spyOn(f.namespace, 'Fyd');
      const getter = vi.fn(() => undefined);
      const previous = Object.getOwnPropertyDescriptor(Object.prototype, 'ZKa');
      f.hooks({
        current() {
          Object.defineProperty(Object.prototype, 'ZKa', {
            configurable: true,
            ...(kind === 'data' ? { value: undefined } : { get: getter }),
          });
        },
      });
      try {
        expect(() => f.originalXub()).toThrow();
        expect(original).not.toHaveBeenCalled();
        expect(f.calls).toMatchObject({ factory: 0, config: 0, query: 0, nativeSends: 0 });
        expect(() => g.identity()).toThrow();
        expect(getter).not.toHaveBeenCalled();
      } finally {
        if (previous) Object.defineProperty(Object.prototype, 'ZKa', previous);
        else Reflect.deleteProperty(Object.prototype, 'ZKa');
      }
    },
  );
});

it.each(
  (['json', 'protobuf'] as const).flatMap((codec) =>
    [false, true].map((correlated) => [codec, correlated] as const),
  ),
)(
  'Native58 retains refusal after the original %s TURN_ALREADY_EXISTS SUCCESS reset tail (correlated=%s)',
  (codec, correlated) => {
    const f = geminiSdkWebChannelFixture(codec, true);
    const { g } = start(f);
    const accepted = vi.spyOn(f.observer, 'next');
    const error = vi.fn();
    const complete = vi.fn();
    f.observer.error = error;
    f.bindOriginal(g.bindObservable);
    const sourceNext = vi.fn();
    f.originalXub({ next: sourceNext, complete });
    f.flushOpen();
    const service = f.shared.service.ka;
    service.oa = 3;
    service.ka = 2;
    if (correlated) f.shared.state().conversationId = 'c_63';
    const raw = f.nativeKf({
      ...(correlated ? { cid: 'c_63' } : {}),
      rid: 'server-rid',
      final: true,
    });
    raw.fl[62] = 4;
    try {
      f.receive(f.nativeEnvelope(raw));
    } catch {}
    // Fresh IKd delegates BKd after guard refusal; source-internal SUCCESS cannot grant a receipt.
    expect(service.oa).toBe(0);
    expect(service.ka).toBe(0);
    expect(service.ha.getValue()).toEqual({ status: 'SUCCESS', ze: f.approved.storeId });
    expect(f.projectionTimerStarts()).toBe(1);
    expect(f.projectionTimers()).toBe(0);
    expect(f.projectionCleanup).toEqual(['timer']);
    expect(sourceNext).toHaveBeenCalledTimes(correlated ? 1 : 0);
    expect(accepted).not.toHaveBeenCalled();
    expect(complete).toHaveBeenCalledTimes(1); // Source callback runs; guard completion admission remains closed.
    expect(error).toHaveBeenCalledTimes(1);
    let first: unknown;
    try {
      g.identity();
    } catch (failure) {
      first = failure;
    }
    expect(first).toBeInstanceOf(Error);
    expect(() =>
      g.completion({ kind: 'marker', conversationId: 'c_63', turnId: 'server-rid' }),
    ).toThrow(first as Error);
    expect(() => f.shared.retry()(f.ok, f.packet.request)).toThrow();
    expect(f.calls).toMatchObject({ factory: 1, config: 1, query: 1 });
    f.outer().unsubscribe();
    g.close();
    g.detach();
    expect(f.shared.pending()).toBe(0);
    expect(f.outer().closed).toBe(true);
    expect(() => f.originalXub()).toThrow();
    expect(() => g.identity()).toThrow(first as Error);
    expect(f.calls).toMatchObject({ factory: 1, config: 1, query: 1 });
  },
);

it.each(['value', 'backing'] as const)(
  'Native63 retains s4d %s before original factory',
  (kind) => {
    const f = geminiSdkWebChannelFixture();
    const privacy = new f.namespace.wxd([1]);
    f.packet.request.s4d = privacy;
    const { g } = start(f);
    if (kind === 'value') privacy.fl[0] = 2;
    else privacy.fl = new f.namespace.wxd([2]).fl;
    expect(assertGeminiTrialPacket(f.namespace, f.packet, f.approved)).toBe(f.packet);
    expect(() => f.originalXub()).toThrow();
    expect(f.calls).toMatchObject({ factory: 0, query: 0, forward: 0 });
    expect(() => g.identity()).toThrow();
  },
);

it.each(['cache', 'group', 'symbol', 'namespace'] as const)(
  'Native64 refuses late %s mutation before physical send with ordinary fields unchanged',
  (kind) => {
    const { f, g } = start();
    f.originalXub();
    const config = f.queued()[0],
      child = config.fl[0],
      ns = f.namespace;
    if (kind === 'cache') {
      Object.freeze(config.fl);
      Object.freeze(config.fl[ns.dga]);
      config.fl[ns.dga].set(ns.eM, 2);
    }
    if (kind === 'group') ns.eM[0] = 2;
    if (kind === 'symbol') ns.dga = Symbol('replacement');
    if (kind === 'namespace') ns.eM = [...ns.eM];
    expect(() => f.flushOpen()).toThrow();
    let failure: any;
    try {
      g.identity();
    } catch (error) {
      failure = error;
    }
    expect(failure).toBeInstanceOf(Error);
    expect(failure.cause).toBe('dispatch-cold-webchannel');
    expect(Object.getOwnPropertyDescriptor(failure, 'geminiNativeDiagnostic')?.value).toBe(
      kind === 'namespace' || kind === 'symbol' ? 'dispatch-native-n10' : 'dispatch-native-n20',
    );
    expect(config.fl[0]).toBe(child);
    expect(f.calls).toMatchObject({ factory: 1, config: 1, query: 1, forward: 0, nativeSends: 0 });
    expect(f.serialized()).toHaveLength(0);
  },
);
