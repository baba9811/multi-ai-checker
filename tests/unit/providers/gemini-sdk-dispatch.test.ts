import { describe, expect, it, vi } from 'vitest';
import { armGeminiRpcDispatch } from '../../../src/infrastructure/providers/gemini/sdk-dispatch';
import { geminiSdkDispatchFixture as fixture } from '../../fixtures/providers/gemini-sdk-dispatch';

describe('request-owned Gemini RPC dispatch', () => {
  it('uses the source URI ha query and XE member while ka remains the scheme', () => {
    const f = fixture();
    const uri = f.lowRequest(new f.namespace.Fta()).oa;
    expect(uri.ka).toBe('');
    expect(Object.getPrototypeOf(uri.ha)).toBe(f.namespace.Bg.prototype);
    expect(Object.hasOwn(f.namespace.Bg.prototype, 'QE')).toBe(false);
    expect(typeof f.namespace.Bg.prototype.XE).toBe('function');
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    expect(guard.sent()).toBe(true);
    expect(f.calls.send).toBe(1);
    expect(f.current().ha.oa.ha.ha.has('rt')).toBe(true);
  });
  it.each(['native', 'fetch'] as const)(
    'uses exported bja/aja with no cja for the %s factory',
    (kind) => {
      const f = fixture();
      expect(Object.hasOwn(f.namespace, 'cja')).toBe(false);
      expect(Object.getPrototypeOf(f.namespace.aja)).toBe(f.namespace.bja.prototype);
      if (kind === 'fetch') f.transport.xhr.BPb = new f.namespace.Mta();
      const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      f.streaming.stream(f.request());
      expect(guard.sent()).toBe(true);
      expect(f.calls.send).toBe(1);
    },
  );
  it('uses the Native71 ME streaming descriptor while LE remains a separate setter', () => {
    const f = fixture();
    const setter = vi.spyOn(f.namespace, 'LE');
    expect(Object.getPrototypeOf(f.namespace.ME.prototype)).toBe(f.namespace.OYb.prototype);
    expect(Object.getPrototypeOf(f.descriptor)).toBe(f.namespace.ME.prototype);
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    expect(guard.sent()).toBe(true);
    expect(f.calls.send).toBe(1);
    expect(setter).not.toHaveBeenCalled();
  });
  it.each(['constructor', 'reset', 'base'] as const)(
    'rejects a late selected mode prototype %s mutation',
    (kind) => {
      const f = fixture();
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      if (kind === 'constructor') f.namespace.cM.prototype.constructor = function () {};
      if (kind === 'reset') f.namespace.cM.prototype.reset = function () {};
      if (kind === 'base') Object.setPrototypeOf(f.namespace.cM.prototype, {});
      expect(() => f.streaming.stream(f.request())).toThrow(/binding/);
      expect(f.calls.send).toBe(0);
    },
  );
  it.each([
    'route',
    'mode',
    'header',
    'route-mode',
    'header-mode',
    'ha',
    'oa',
    'mode-value',
    'route-descriptor',
    'mode-descriptor',
    'header-descriptor',
    'value-descriptor',
    'namespace',
    'prototype',
  ] as const)('retains selected %s through the delayed physical boundary', (kind) => {
    const f = fixture();
    f.compression();
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    if (kind === 'route')
      f.api.Aa = Object.assign(Object.create(f.namespace.CKd.prototype), f.api.Aa);
    if (kind === 'mode') f.api.Ua = new f.namespace.cM();
    if (kind === 'header')
      f.api.Eb = Object.assign(Object.create(f.namespace.zKd.prototype), f.api.Eb);
    if (kind === 'route-mode') f.api.Aa.ka = new f.namespace.cM();
    if (kind === 'header-mode') f.api.Eb.wa = new f.namespace.cM();
    if (kind === 'ha') {
      f.api.Ua.ha = 42;
      f.api.Aa.ha = true;
    }
    if (kind === 'oa') f.api.Aa.oa = true;
    if (kind === 'mode-value') f.api.Ua.ha = 67;
    if (kind === 'route-descriptor') Object.defineProperty(f.api, 'Aa', { writable: false });
    if (kind === 'mode-descriptor') Object.defineProperty(f.api, 'Ua', { enumerable: false });
    if (kind === 'header-descriptor')
      Object.defineProperty(f.api.Eb, 'wa', { configurable: false });
    if (kind === 'value-descriptor') Object.defineProperty(f.api.Ua, 'ha', { writable: false });
    if (kind === 'namespace')
      f.namespace.BKd = function () {
        return false;
      };
    if (kind === 'prototype') Object.setPrototypeOf(f.api.Aa, {});
    expect(() => f.pending.shift()!()).toThrow(/binding/);
    expect(f.calls.send).toBe(0);
  });
  it.each([
    [true, false, 0],
    [true, false, 67],
    [true, true, 42],
    [true, true, 43],
  ])('refuses the actual cold predicate %s/%s/%s on the legacy route', (ha, oa, mode) => {
    const f = fixture();
    Object.assign(f.api.Aa, { ha, oa });
    f.api.Ua.ha = mode;
    expect(f.namespace.BKd(f.api.Aa)).toBe(true);
    expect(() => armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver)).toThrow(
      /route/,
    );
    expect(f.calls.send).toBe(0);
  });
  it.each([NaN, Infinity, 1.5, undefined, '0'])('refuses an unsupported actual mode %s', (mode) => {
    const f = fixture();
    f.api.Ua.ha = mode;
    expect(() => armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver)).toThrow(
      /runtime-shape/,
    );
    expect(f.calls.send).toBe(0);
  });
  it('checks selected state before and after the late raw callback without reopening generation', () => {
    const f = fixture();
    const error = vi.fn();
    const next = vi.fn(() => {
      f.api.Aa.oa = true;
    });
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, { next, error });
    f.streaming.stream(f.request());
    guard.close();
    f.emit(new f.namespace.IF());
    expect(next).toHaveBeenCalledOnce();
    expect(error).toHaveBeenCalledOnce();
    expect(f.calls.send).toBe(1);
  });
  it.each([
    [false, false, 0],
    [false, true, 67],
    [true, false, 42],
    [true, false, 43],
  ])('admits the actual Native71 legacy predicate %s/%s/%s', (ha, oa, mode) => {
    const f = fixture();
    Object.assign(f.api.Aa, { ha, oa });
    f.api.Ua.ha = mode;
    expect(f.namespace.BKd(f.api.Aa)).toBe(false);
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    expect(guard.sent()).toBe(true);
    expect(f.calls.send).toBe(1);
  });
  it('rejects a selected mode mutation made by current even when BKd remains false', () => {
    const f = fixture();
    let changed = false;
    armGeminiRpcDispatch(
      f.namespace,
      f.api,
      () => {
        if (!changed) {
          changed = true;
          f.api.Ua.ha = 67;
        }
        return true;
      },
      f.rawObserver,
    );
    expect(() => f.streaming.stream(f.request())).toThrow(/binding/);
    expect(changed).toBe(true);
    expect(f.calls.send).toBe(0);
  });
  it('preserves the single source-owned protected notify entrypoint through dispatch and late raw data', () => {
    const f = fixture();
    const notify = f.protectedNotify();
    const next = vi.fn();
    const error = vi.fn();
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, { next, error });
    expect(f.notifications()).toBe(0);
    expect(f.identityAssignments()).toBe(1);
    expect(f.namespace.Vj.prototype.Y_c).toBe(notify.wrapper);
    f.streaming.stream(f.request());
    f.transport.xhr.Y_c();
    expect(f.notifications()).toBe(1);
    guard.close();
    f.emit(new f.namespace.IF());
    expect(next).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();
    expect(f.namespace.Vj.prototype.Y_c).toBe(notify.wrapper);
    expect(f.identityAssignments()).toBe(1);
    expect(f.calls.send).toBe(1);
  });
  it.each([
    'missing-uid',
    'uid-getter',
    'ambiguous-uid',
    'nested',
    'disposed',
    'owner',
    'monitor-array',
    'inactive',
    'wrap-shadow',
    'wrap-getter',
    'wrap-source',
    'unwrap-source',
    'report-getter',
    'base',
    'reciprocal',
    'protected-getter',
    'original-apply',
  ] as const)('refuses the protected notify %s profile without effects', (kind) => {
    const f = fixture();
    const notify = f.protectedNotify();
    const getter = vi.fn();
    if (kind === 'missing-uid') delete notify.monitor[notify.uidKey];
    if (kind === 'uid-getter')
      Object.defineProperty(notify.monitor, notify.uidKey, { get: getter });
    if (kind === 'ambiguous-uid') notify.monitor.closure_uid_18 = 7;
    if (kind === 'nested') f.protectedNotify();
    if (kind === 'disposed') notify.monitor.r5 = true;
    if (kind === 'owner') f.namespace.Cr.ka = {};
    if (kind === 'monitor-array') f.namespace.uga.push({});
    if (kind === 'inactive') f.namespace.vga = false;
    if (kind === 'wrap-shadow') notify.monitor.wrap = function () {};
    if (kind === 'wrap-getter') Object.defineProperty(notify.monitor, 'wrap', { get: getter });
    if (kind === 'wrap-source') Object.getPrototypeOf(notify.monitor).wrap = function () {};
    if (kind === 'unwrap-source') Object.getPrototypeOf(notify.monitor).unwrap = function () {};
    if (kind === 'report-getter') Object.defineProperty(notify.monitor, 'oa', { get: getter });
    if (kind === 'base') f.namespace.Eb = class {};
    if (kind === 'reciprocal') notify.original[notify.wrapperKey] = function () {};
    if (kind === 'protected-getter')
      Object.defineProperty(notify.wrapper, notify.protectedKey, { get: getter });
    if (kind === 'original-apply') Object.defineProperty(notify.original, 'apply', { get: getter });
    const assignments = f.identityAssignments();
    expect(() => armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver)).toThrow(
      /binding|source-profile|runtime-shape/,
    );
    expect(getter).not.toHaveBeenCalled();
    expect(f.identityAssignments()).toBe(assignments);
    expect(f.notifications()).toBe(0);
    expect(f.calls.send).toBe(0);
  });
  it.each([
    'owner',
    'monitor-array',
    'monitor-array-ref',
    'inactive',
    'uid',
    'uid-getter',
    'report',
    'wrap',
    'unwrap',
    'Fd',
    'Eb',
    'disposed',
    'reciprocal',
    'protected',
    'original-proto',
    'base-method',
  ] as const)('keeps checking protected notify %s after generation closes', (kind) => {
    const f = fixture();
    const notify = f.protectedNotify();
    const next = vi.fn();
    const error = vi.fn();
    const getter = vi.fn();
    const current = vi.fn(() => true);
    const guard = armGeminiRpcDispatch(f.namespace, f.api, current, { next, error });
    f.streaming.stream(f.request());
    guard.close();
    const checks = current.mock.calls.length;
    if (kind === 'owner') f.namespace.Cr.ka = {};
    if (kind === 'monitor-array') f.namespace.uga[0] = {};
    if (kind === 'monitor-array-ref') f.namespace.uga = [notify.monitor];
    if (kind === 'inactive') f.namespace.vga = false;
    if (kind === 'uid') notify.monitor[notify.uidKey]++;
    if (kind === 'uid-getter')
      Object.defineProperty(notify.monitor, notify.uidKey, { get: getter });
    if (kind === 'report') notify.monitor.oa = function () {};
    if (kind === 'wrap') Object.getPrototypeOf(notify.monitor).wrap = function () {};
    if (kind === 'unwrap') Object.getPrototypeOf(notify.monitor).unwrap = function () {};
    if (kind === 'Fd') f.namespace.Fd = function () {};
    if (kind === 'Eb') f.namespace.Eb = class {};
    if (kind === 'disposed') notify.monitor.r5 = true;
    if (kind === 'reciprocal') notify.original[notify.wrapperKey] = function () {};
    if (kind === 'protected') notify.wrapper[notify.protectedKey] = function () {};
    if (kind === 'original-proto') Object.setPrototypeOf(notify.original, {});
    if (kind === 'base-method') f.namespace.Eb.prototype.isDisposed = function () {};
    expect(() => f.emit(new f.namespace.IF())).not.toThrow();
    expect(next).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith();
    expect(getter).not.toHaveBeenCalled();
    expect(current.mock.calls.length).toBe(checks);
    expect(f.identityAssignments()).toBe(1);
    expect(f.calls.send).toBe(1);
  });
  it.each(['uid', 'owner', 'wrap'] as const)(
    'refuses protected notify %s changed by the final physical callback',
    (kind) => {
      const f = fixture();
      const notify = f.protectedNotify();
      let changed = false;
      armGeminiRpcDispatch(
        f.namespace,
        f.api,
        () => {
          if (!changed && f.current()?.ha.oa.ha.ha.has('rt')) {
            changed = true;
            if (kind === 'uid') notify.monitor[notify.uidKey]++;
            if (kind === 'owner') f.namespace.Cr.ka = {};
            if (kind === 'wrap') Object.getPrototypeOf(notify.monitor).wrap = function () {};
          }
          return true;
        },
        f.rawObserver,
      );
      expect(() => f.streaming.stream(f.request())).toThrow(/binding/);
      expect(changed).toBe(true);
      expect(f.calls.send).toBe(0);
      expect(f.identityAssignments()).toBe(1);
      expect(f.notifications()).toBe(0);
    },
  );
  it('rechecks the notify owner after forwarding a late raw frame', () => {
    const f = fixture();
    const notify = f.protectedNotify();
    const error = vi.fn();
    const next = vi.fn(() => {
      notify.monitor.ha = false;
    });
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, { next, error });
    f.streaming.stream(f.request());
    guard.close();
    expect(() => f.emit(new f.namespace.IF())).not.toThrow();
    expect(next).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith();
    expect(f.identityAssignments()).toBe(1);
    expect(f.calls.send).toBe(1);
  });
  it.each(['value', 'getter'] as const)(
    'refuses a late %s notify shadow on the captured XHR after generation closes',
    (kind) => {
      const f = fixture();
      f.protectedNotify();
      const next = vi.fn();
      const error = vi.fn();
      const foreign = vi.fn();
      const current = vi.fn(() => true);
      const guard = armGeminiRpcDispatch(f.namespace, f.api, current, { next, error });
      f.streaming.stream(f.request());
      const xhr = f.transport.xhr;
      guard.close();
      const checks = current.mock.calls.length;
      Object.defineProperty(xhr, 'Y_c', kind === 'getter' ? { get: foreign } : { value: foreign });
      expect(() => f.emit(new f.namespace.IF())).not.toThrow();
      expect(next).not.toHaveBeenCalled();
      expect(error).toHaveBeenCalledWith();
      expect(foreign).not.toHaveBeenCalled();
      expect(current.mock.calls.length).toBe(checks);
      expect(f.calls.send).toBe(1);
    },
  );
  it('rechecks the captured XHR notify callee after forwarding a raw frame', () => {
    const f = fixture();
    f.protectedNotify();
    const foreign = vi.fn();
    const error = vi.fn();
    const next = vi.fn(() => {
      Object.defineProperty(f.transport.xhr, 'Y_c', { value: foreign });
    });
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, { next, error });
    f.streaming.stream(f.request());
    guard.close();
    expect(() => f.emit(new f.namespace.IF())).not.toThrow();
    expect(next).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith();
    expect(foreign).not.toHaveBeenCalled();
    expect(f.calls.send).toBe(1);
  });
  it.each(['namespace', 'prototype', 'namespace-getter'] as const)(
    'refuses late captured Wj %s changes without invoking getters',
    (kind) => {
      const f = fixture();
      f.protectedNotify();
      const next = vi.fn();
      const error = vi.fn();
      const getter = vi.fn();
      const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, { next, error });
      f.streaming.stream(f.request());
      const xhr = f.transport.xhr;
      guard.close();
      if (kind === 'namespace') f.namespace.Vj = class {};
      if (kind === 'prototype') Object.setPrototypeOf(xhr, {});
      if (kind === 'namespace-getter') Object.defineProperty(f.namespace, 'Vj', { get: getter });
      expect(() => f.emit(new f.namespace.IF())).not.toThrow();
      expect(next).not.toHaveBeenCalled();
      expect(error).toHaveBeenCalledWith();
      expect(getter).not.toHaveBeenCalled();
      expect(f.calls.send).toBe(1);
    },
  );
  it('keeps late receipt bound to the captured XHR without pinning mutable pooled fields', () => {
    const f = fixture();
    f.protectedNotify();
    const next = vi.fn();
    const error = vi.fn();
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, { next, error });
    f.streaming.stream(f.request());
    guard.close();
    f.transport.ha = f.lowRequest(new f.namespace.Fta());
    f.transport.xhr = new f.namespace.Vj();
    expect(() => f.emit(new f.namespace.IF())).not.toThrow();
    expect(next).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();
    expect(f.calls.send).toBe(1);
  });
  it.each([
    'runtime-shape',
    'route',
    'protection',
    'source-profile',
    'descriptor',
    'binding',
    'handoff',
    'retry',
    'stream',
    'backend',
    'closed',
    'spent',
    'interrupted',
  ] as const)('reports only the fixed dispatch-%s cause', (cause) => {
    const f = fixture();
    const getter = vi.fn();
    if (cause === 'runtime-shape') Object.defineProperty(f.api, 'Aa', { get: getter });
    if (cause === 'route') f.api.Aa.ha = true;
    if (cause === 'protection') f.api.Ja.isEnabled = false;
    if (cause === 'source-profile') f.namespace.Cua.prototype.transfer = function () {};
    if (cause === 'descriptor') f.namespace.kl = 'synthetic-not-a-symbol';
    if (cause === 'binding') f.streaming.ha = {};
    if (cause === 'handoff') f.prefix('synthetic-invalid-prefix');
    if (cause === 'stream') f.beforeReturn((stream) => Object.setPrototypeOf(stream, {}));
    if (cause === 'backend') f.transport.xhr.BPb = {};
    expect(() => {
      const guard = armGeminiRpcDispatch(
        f.namespace,
        f.api,
        () => cause !== 'interrupted',
        f.rawObserver,
      );
      if (cause === 'closed') guard.close();
      f.streaming.stream(f.request());
      if (cause === 'retry') f.service.sendRequest(f.current());
      if (cause === 'spent') f.transport.transfer(f.current().ha);
    }).toThrow(expect.objectContaining({ cause: `dispatch-${cause}` }));
    expect(getter).not.toHaveBeenCalled();
  });
  it('classifies an invalid current callback without SDK work', () => {
    const f = fixture();
    expect(() =>
      armGeminiRpcDispatch(f.namespace, f.api, false as unknown as () => boolean, f.rawObserver),
    ).toThrow(expect.objectContaining({ cause: 'dispatch-runtime-shape' }));
    expect(f.calls.send).toBe(0);
  });
  it.each(['constructor', 'on', 'removeListener', 'cancel'] as const)(
    'identifies the static Ixa %s source group without exposing its source',
    (key) => {
      const f = fixture();
      if (key === 'constructor') f.namespace.Ixa = class {};
      else f.namespace.Ixa.prototype[key] = function () {};
      expect(() => armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver)).toThrow(
        expect.objectContaining({
          message: 'Gemini RPC dispatch: source-profile',
          cause: 'dispatch-source-stream',
        }),
      );
      expect(f.calls.send).toBe(0);
    },
  );
  it.each(['send', 'rub', 'O8d', 'uea', 'Ln', 'Wu'] as const)(
    'identifies the static Wj %s source group before delegation',
    (key) => {
      const f = fixture();
      f.namespace.Vj.prototype[key] = function () {};
      expect(() => armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver)).toThrow(
        expect.objectContaining({
          message: 'Gemini RPC dispatch: source-profile',
          cause: 'dispatch-source-async',
        }),
      );
      expect(f.calls.send).toBe(0);
    },
  );
  it('identifies only the static BVc notify source mismatch', () => {
    const f = fixture();
    f.namespace.Vj.prototype.Y_c = function () {};
    expect(() => armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver)).toThrow(
      expect.objectContaining({
        message: 'Gemini RPC dispatch: source-profile',
        cause: 'dispatch-source-notify',
      }),
    );
    expect(f.calls.send).toBe(0);
  });
  it.each(['bja', 'Mta'] as const)(
    'identifies the static %s factory source group before delegation',
    (key) => {
      const f = fixture();
      f.namespace[key].prototype.g9 = function () {};
      expect(() => armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver)).toThrow(
        expect.objectContaining({
          message: 'Gemini RPC dispatch: source-profile',
          cause: 'dispatch-source-factory',
        }),
      );
      expect(f.calls.send).toBe(0);
    },
  );
  it.each(['kb', 'ob', 'Aa'] as const)(
    'identifies the static stream %s handler group before physical delegation',
    (key) => {
      const f = fixture();
      Object.getPrototypeOf(f.transport)[key] = function () {};
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      expect(() => f.streaming.stream(f.request())).toThrow(
        expect.objectContaining({
          message: 'Gemini RPC dispatch: source-profile',
          cause: 'dispatch-source-handler',
        }),
      );
      expect(f.calls.send).toBe(0);
    },
  );
  it('observes the same raw frame before downstream registration and after send closure', () => {
    const f = fixture();
    const seen: unknown[] = [];
    const error = vi.fn();
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, {
      next: (value) => {
        seen.push(value);
        guard.close();
      },
      error,
    });
    const stream = f.streaming.stream(f.request());
    const frame = new f.namespace.IF();
    const later = new f.namespace.IF();
    frame.fl = [];
    frame.fl[64] = [[]];
    const before = JSON.stringify(frame);
    stream.on('data', (value: unknown) => seen.push(value));
    f.emit(
      frame,
      Object.defineProperty({}, 'opaque', {
        get() {
          throw new Error();
        },
      }),
    );
    f.emit(later);
    expect(seen).toEqual([frame, frame, later, later]);
    expect(seen[0]).toBe(frame);
    expect(seen[1]).toBe(frame);
    expect(JSON.stringify(frame)).toBe(before);
    expect(error).not.toHaveBeenCalled();
    expect(f.calls.send).toBe(1);
  });
  it('detaches only its owned observer once after permission closure', () => {
    const f = fixture();
    const next = vi.fn();
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, { next, error() {} });
    const stream = f.streaming.stream(f.request());
    const downstream = vi.fn();
    stream.on('data', downstream);
    guard.close();
    expect(stream.ka).toHaveLength(2);
    guard.detach();
    guard.detach();
    f.emit(new f.namespace.IF());
    expect(next).not.toHaveBeenCalled();
    expect(downstream).toHaveBeenCalledTimes(1);
    expect(stream.ka).toEqual([downstream]);
  });
  it('closes and sends only a fixed notification when raw validation throws', () => {
    const f = fixture();
    const error = vi.fn();
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, {
      next() {
        throw new Error('synthetic-private-value');
      },
      error,
    });
    f.streaming.stream(f.request());
    expect(() => f.emit(new f.namespace.IF())).not.toThrow();
    expect(error).toHaveBeenCalledWith();
    expect(() => f.transport.transfer(f.current().ha)).toThrow(/closed/);
    guard.detach();
  });
  it('cancels the original owned request when returned stream installation fails', () => {
    const f = fixture();
    f.beforeReturn((stream) => {
      stream.Aa = {};
    });
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    expect(() => f.streaming.stream(f.request())).toThrow(/binding|stream/);
    expect(f.calls.send).toBe(1);
    expect(f.cancelled()).toBe(1);
    expect(guard.sent()).toBe(true);
  });
  it('refuses an unsupported async send profile before any physical delegation', () => {
    const f = fixture();
    f.namespace.Vj.prototype.send = function () {
      f.calls.send++;
    };
    expect(() => armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver)).toThrow(
      /source-profile/,
    );
    expect(f.calls.send).toBe(0);
  });
  it.each(['factory', 'rub', 'O8d', 'kb'] as const)(
    'refuses %s changed by the final physical ownership callback',
    (key) => {
      const f = fixture();
      const next = vi.fn();
      const foreign = vi.fn(() => f.namespace.aja.g9());
      let changed = false;
      armGeminiRpcDispatch(
        f.namespace,
        f.api,
        () => {
          if (!changed && f.current()?.ha.oa.ha.ha.has('rt') && f.calls.send === 0) {
            changed = true;
            if (key === 'factory') f.transport.xhr.BPb = { g9: foreign };
            else if (key === 'kb') Object.getPrototypeOf(f.transport).kb = foreign;
            else f.namespace.Vj.prototype[key] = foreign;
          }
          return true;
        },
        { next, error() {} },
      );
      expect(() => f.streaming.stream(f.request())).toThrow(/binding|backend|source-profile/);
      expect(changed).toBe(true);
      expect(f.calls.send).toBe(0);
      expect(foreign).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      expect(f.rawStream().ka).toEqual([]);
    },
  );
  it.each(['O8d', 'Y_c', 'uea', 'Ln', 'Wu', 'rub'])(
    'refuses altered async %s behavior before SDK delegation',
    (key) => {
      const f = fixture();
      f.namespace.Vj.prototype[key] = function () {};
      expect(() => armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver)).toThrow(
        /source-profile/,
      );
      expect(f.calls.send).toBe(0);
    },
  );
  it.each(['kb', 'ob', 'Aa'])(
    'refuses altered stream handler %s before physical delegation',
    (key) => {
      const f = fixture();
      Object.getPrototypeOf(f.transport)[key] = function () {};
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      expect(() => f.streaming.stream(f.request())).toThrow(/source-profile/);
      expect(f.calls.send).toBe(0);
    },
  );
  it.each(['Ixa', 'IF', 'Aa', 'ka', 'wa', 'oa', 'ha', 'Ca', 'listener'])(
    'keeps checking changed %s after send permission closes',
    (key) => {
      const f = fixture();
      const next = vi.fn();
      const error = vi.fn();
      const current = vi.fn(() => true);
      const guard = armGeminiRpcDispatch(f.namespace, f.api, current, { next, error });
      f.streaming.stream(f.request());
      const stream = f.rawStream();
      const callback = stream.ka[0];
      const frame = new f.namespace.IF();
      guard.close();
      const count = current.mock.calls.length;
      if (key === 'Ixa' || key === 'IF') f.namespace[key] = class {};
      else if (key === 'listener') stream.ka.splice(0, 1);
      else stream[key] = key === 'Ca' ? true : key === 'Aa' ? {} : [];
      expect(() => callback.call(stream.ka, frame, {})).not.toThrow();
      expect(next).not.toHaveBeenCalled();
      expect(error).toHaveBeenCalledWith();
      expect(current.mock.calls.length).toBe(count);
      expect(f.calls.send).toBe(1);
    },
  );
  it('never invokes a changed stream accessor while checking late raw data', () => {
    const f = fixture();
    const next = vi.fn();
    const error = vi.fn();
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, { next, error });
    f.streaming.stream(f.request());
    const stream = f.rawStream();
    const callback = stream.ka[0];
    guard.close();
    const getter = vi.fn();
    Object.defineProperty(stream, 'Aa', { get: getter });
    callback(new f.namespace.IF());
    expect(getter).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith();
  });
  it('refuses an owned raw observer reordered behind projection in the same array', () => {
    const f = fixture();
    const next = vi.fn();
    const error = vi.fn();
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, { next, error });
    const stream = f.streaming.stream(f.request());
    const callback = stream.ka[0];
    stream.on('data', () => {});
    stream.ka.reverse();
    guard.close();
    expect(() => callback(new f.namespace.IF())).not.toThrow();
    expect(next).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith();
  });
  it('does not remove a foreign listener array during teardown', () => {
    const f = fixture();
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    const foreign = [() => {}];
    f.rawStream().ka = foreign;
    expect(() => guard.detach()).toThrow(/binding/);
    expect(f.rawStream().ka).toBe(foreign);
    expect(foreign).toHaveLength(1);
    expect(() => f.transport.transfer(f.current().ha)).toThrow(/closed/);
  });
  it('closes a not-yet-started operation when observation is detached', () => {
    const f = fixture();
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    guard.detach();
    expect(() => f.streaming.stream(f.request())).toThrow(/closed/);
    expect(f.calls.send).toBe(0);
  });
  it('does not register into an array replaced during the ownership callback', () => {
    const f = fixture();
    const foreign: unknown[] = [];
    let changed = false;
    armGeminiRpcDispatch(
      f.namespace,
      f.api,
      () => {
        if (!changed && f.calls.send === 1) {
          changed = true;
          f.rawStream().ka = foreign;
        }
        return true;
      },
      f.rawObserver,
    );
    expect(() => f.streaming.stream(f.request())).toThrow(/binding/);
    expect(foreign).toEqual([]);
    expect(f.cancelled()).toBe(1);
  });
  it('never cancels a replaced deferred owner during installation rollback', () => {
    const f = fixture();
    const cancel = vi.fn();
    f.beforeReturn((stream) => {
      stream.Aa.oa = { cancel };
      stream.Aa = {};
    });
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    expect(() => f.streaming.stream(f.request())).toThrow(/binding/);
    expect(cancel).not.toHaveBeenCalled();
    expect(f.calls.send).toBe(1);
    expect(guard.sent()).toBe(true);
    expect(() => f.transport.transfer(f.current().ha)).toThrow(/closed/);
  });
  it.each(['object', 'prototype'] as const)(
    'refuses an unsupported %s deferred owner before service delegation',
    (kind) => {
      const f = fixture();
      const cancel = vi.fn();
      f.beforeService((wrapper) => {
        if (kind === 'object') wrapper.oa = { cancel };
        else Object.setPrototypeOf(wrapper.oa, {});
      });
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      expect(() => f.streaming.stream(f.request())).toThrow(/binding/);
      expect(f.calls.send).toBe(0);
      expect(cancel).not.toHaveBeenCalled();
      expect(f.cancelled()).toBe(0);
    },
  );
  it.each(['constructor', 'prototype', 'accessor'] as const)(
    'quarantines rollback after the deferred namespace %s changes',
    (kind) => {
      const f = fixture();
      const getter = vi.fn();
      f.beforeReturn((stream) => {
        if (kind === 'constructor') f.namespace.bc = class {};
        else if (kind === 'prototype') f.namespace.bc.prototype.cancel = function () {};
        else Object.defineProperty(f.namespace, 'bc', { get: getter });
        stream.Aa = {};
      });
      const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      expect(() => f.streaming.stream(f.request())).toThrow(/binding/);
      expect(f.cancelled()).toBe(0);
      expect(getter).not.toHaveBeenCalled();
      expect(f.calls.send).toBe(1);
      expect(guard.sent()).toBe(true);
    },
  );
  it('never reads a replaced deferred accessor during rollback', () => {
    const f = fixture();
    const getter = vi.fn();
    f.beforeReturn((stream) => {
      Object.defineProperty(stream.Aa, 'oa', { get: getter });
      stream.Aa = {};
    });
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    expect(() => f.streaming.stream(f.request())).toThrow(/binding/);
    expect(getter).not.toHaveBeenCalled();
    expect(f.cancelled()).toBe(0);
    expect(f.calls.send).toBe(1);
    expect(guard.sent()).toBe(true);
  });
  it('rechecks the owned observer after the final installation callback', () => {
    const f = fixture();
    const next = vi.fn();
    let changed = false;
    armGeminiRpcDispatch(
      f.namespace,
      f.api,
      () => {
        if (!changed && f.rawStream()?.ka.length === 1) {
          changed = true;
          f.rawStream().ka = [];
        }
        return true;
      },
      { next, error() {} },
    );
    expect(() => f.streaming.stream(f.request())).toThrow(/binding/);
    expect(changed).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(f.calls.send).toBe(1);
    expect(f.cancelled()).toBe(1);
    expect(f.rawStream().ka).toEqual([]);
  });
  it('arms without calling SDK or configuration helpers and allows one genuine handoff', () => {
    const f = fixture();
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    expect(f.calls).toEqual({ stream: 0, service: 0, send: 0, serialize: 0, config: 0 });
    expect(guard.sent()).toBe(false);
    f.streaming.stream(f.request());
    expect(f.calls.send).toBe(1);
    expect(guard.sent()).toBe(true);
    expect(() => f.streaming.stream(f.request())).toThrow(/spent|stream/);
    expect(f.calls.send).toBe(1);
  });
  it('closes before any original stream delegation', () => {
    const f = fixture();
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    guard.close();
    guard.close();
    expect(() => f.streaming.stream(f.request())).toThrow(/closed/);
    expect(f.calls.stream).toBe(0);
    expect(guard.sent()).toBe(false);
  });
  it('reports a closed owned dispatch through only its fixed public cause', () => {
    const f = fixture();
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    guard.close();
    expect(() => f.streaming.stream(f.request())).toThrowError(
      expect.objectContaining({ message: 'Gemini RPC dispatch: closed', cause: 'dispatch-closed' }),
    );
    expect(f.calls.send).toBe(0);
  });
  it('guards a direct manager retry that bypasses the service', () => {
    const f = fixture();
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    expect(() => f.transport.transfer(f.current().ha)).toThrow(/spent/);
    expect(f.calls.service).toBe(1);
    expect(f.calls.send).toBe(1);
  });
  it('rejects cloned wrapper retries with the original body reference', () => {
    const f = fixture();
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    const original = f.current();
    expect(() => f.service.sendRequest({ ...original, ha: f.lowRequest(original.Aa) })).toThrow(
      /retry/,
    );
    expect(f.calls.service).toBe(1);
    expect(f.calls.send).toBe(1);
  });
  it('rejects pending rt before the transport binds the request', () => {
    const f = fixture();
    f.earlyRt();
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    expect(() => f.streaming.stream(f.request())).toThrow(/binding/);
    expect(f.calls.send).toBe(0);
  });
  it('closes a delayed compressed attempt before callback resolution', () => {
    const f = fixture();
    f.compression();
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    guard.close();
    expect(() => f.pending.shift()!()).toThrow(/closed/);
    expect(f.calls.send).toBe(0);
    expect(guard.sent()).toBe(false);
  });
  it('allows the mandatory rt boundary for an empty body', () => {
    const f = fixture();
    f.empty();
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    expect(guard.sent()).toBe(true);
    expect(f.calls.send).toBe(1);
  });
  it('does not invoke accessors during arming', () => {
    const f = fixture();
    const getter = vi.fn();
    Object.defineProperty(f.api, 'Kd', { get: getter });
    expect(() => armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver)).toThrow(
      /shape|route/,
    );
    expect(getter).not.toHaveBeenCalled();
    expect(f.calls.send).toBe(0);
  });
  it('rejects a selected transfer that skips rt before any physical delegation', () => {
    const f = fixture();
    Object.getPrototypeOf(f.transport).transfer = function () {
      this.xhr.send('synthetic');
    };
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    expect(() => f.streaming.stream(f.request())).toThrow(/source-profile/);
    expect(f.calls.send).toBe(0);
  });
  it('does not call the required current check just by arming', () => {
    const f = fixture();
    const current = vi.fn(() => true);
    armGeminiRpcDispatch(f.namespace, f.api, current, f.rawObserver);
    expect(current).not.toHaveBeenCalled();
    f.streaming.stream(f.request());
    expect(current).toHaveBeenCalled();
  });
  it.each(['stream', 'service', 'rt', 'xhr'] as const)(
    'checks current immediately before owned %s delegation',
    (stage) => {
      const f = fixture();
      let valid = true;
      armGeminiRpcDispatch(f.namespace, f.api, () => valid, f.rawObserver);
      if (stage === 'stream')
        f.beforeConfig(() => {
          valid = false;
        });
      if (stage === 'service')
        f.beforeService(() => {
          valid = false;
        });
      if (stage === 'rt')
        f.beforeTransfer(() => {
          valid = false;
        });
      if (stage === 'xhr') f.compression();
      if (stage === 'xhr') {
        f.streaming.stream(f.request());
        valid = false;
        expect(() => f.pending.shift()!()).toThrow(/interrupted/);
      } else expect(() => f.streaming.stream(f.request())).toThrow(/interrupted/);
      expect(f.calls.send).toBe(0);
    },
  );
  it('sanitizes a thrown current check and stays closed', () => {
    const f = fixture();
    const secret = 'synthetic-private-marker';
    armGeminiRpcDispatch(
      f.namespace,
      f.api,
      () => {
        throw new Error(secret);
      },
      f.rawObserver,
    );
    expect(() => f.streaming.stream(f.request())).toThrow('Gemini RPC dispatch: interrupted');
    expect(f.calls.stream).toBe(0);
    expect(f.calls.send).toBe(0);
  });
  it('permits compressed dispatch only after the rt boundary and before close', () => {
    const f = fixture();
    f.compression();
    const g = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    expect(g.sent()).toBe(false);
    f.pending.shift()!();
    expect(f.calls.send).toBe(1);
    expect(g.sent()).toBe(true);
  });
  it('retains the spent allowance after the original SDK throws', () => {
    const f = fixture();
    f.error();
    const g = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    expect(() => f.streaming.stream(f.request())).toThrow('synthetic-sdk-error');
    expect(g.sent()).toBe(true);
    expect(() => f.transport.transfer(f.current().ha)).toThrow(/closed|spent/);
    expect(f.calls.send).toBe(1);
  });
  it('closes on normal context reset and cannot revive the same compressed request', () => {
    const f = fixture();
    f.compression();
    const g = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    const a = f.current().ha;
    a.Wa.reset();
    expect(a.Wa.ka).toBe(null);
    f.transport.aborted = false;
    expect(() => f.pending.shift()!()).toThrow(/closed/);
    expect(f.calls.send).toBe(0);
    expect(g.sent()).toBe(false);
  });
  it('old compressed A short-circuits after normal pool reuse by B', () => {
    const f = fixture();
    f.compression();
    const g = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    const b = f.lowRequest(new f.namespace.Fta());
    b.Ni(f.context());
    b.Wa.ka = f.transport;
    f.transport.ha = b;
    f.pending.shift()!();
    expect(f.calls.send).toBe(0);
    expect(g.sent()).toBe(false);
    f.transport.transfer(b);
    f.pending.shift()!();
    expect(f.calls.send).toBe(1);
    expect(g.sent()).toBe(false);
  });
  it('rejects uncertain unrelated ownership rather than delegating', () => {
    const f = fixture();
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    f.transport.ha = f.lowRequest(new f.namespace.Fta());
    expect(() => f.transport.xhr.send('synthetic')).toThrow(/binding|shape/);
    expect(f.calls.send).toBe(1);
  });
  it('does not call an unknown context getter after its descriptor changes', () => {
    const f = fixture();
    const getter = vi.fn();
    f.beforeTransport(() =>
      Object.defineProperty(f.current().ha.Wa, 'ka', { get: getter, configurable: true }),
    );
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    expect(() => f.streaming.stream(f.request())).toThrow(/binding/);
    expect(getter).not.toHaveBeenCalled();
    expect(f.calls.send).toBe(0);
  });
  it('rejects an existing context accessor before its setter is invoked', () => {
    const f = fixture();
    const setter = vi.fn();
    f.contextFactory(() => Object.defineProperty(f.context(), 'ka', { set: setter }));
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    expect(() => f.streaming.stream(f.request())).toThrow(/source-profile/);
    expect(setter).not.toHaveBeenCalled();
    expect(f.calls.send).toBe(0);
  });
  it('rejects replacement of owned context or Li before the physical delegate', () => {
    const f = fixture();
    f.compression();
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    f.current().ha.Wa = f.context();
    expect(() => f.pending.shift()!()).toThrow(/binding/);
    expect(f.calls.send).toBe(0);
  });
  it.each(['Aa', 'Kd'] as const)(
    'rejects a different natural %s route without an SDK call',
    (key) => {
      const f = fixture();
      if (key === 'Aa') f.api.Aa.ha = true;
      else f.api.Kd = true;
      expect(() => armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver)).toThrow(
        /route/,
      );
      expect(f.calls.stream).toBe(0);
    },
  );
  it('requires exact enabled native protection', () => {
    const f = fixture();
    f.api.Ja.isEnabled = false;
    expect(() => armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver)).toThrow(
      /protection/,
    );
  });
  it.each(['Ob', 'Rb', 'Pb', 'Ub', 'Fqa', 'zsa', 'Qb'] as const)(
    'rejects wrong registered %s metadata',
    (key) => {
      const f = fixture();
      f.metadata[key] = 'synthetic-wrong' as never;
      expect(() => armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver)).toThrow(
        /descriptor/,
      );
      expect(f.calls.stream).toBe(0);
    },
  );
  it.each(['https://synthetic.invalid/', '/_/../', '/_/?x=', '/_/a\\', '/_/a#', '/_/a@/'])(
    'rejects unsupported configured prefix %s without stream delegation',
    (value) => {
      const f = fixture();
      f.prefix(value);
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      expect(() => f.streaming.stream(f.request())).toThrow(/handoff/);
      expect(f.calls.stream).toBe(0);
    },
  );
  it('supports the genuine empty-prefix default', () => {
    const f = fixture();
    f.prefix('');
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    expect(f.calls.send).toBe(1);
  });
  it.each(['body', 'ub', 'service', 'path', 'manager'] as const)(
    'rejects wrong synchronous %s handoff',
    (key) => {
      const f = fixture();
      f.beforeService((w) => {
        if (key === 'body') w.Aa.payload = 'synthetic-other';
        if (key === 'ub') w.ha.ub = new f.namespace.Fta();
        if (key === 'service') w.Ha = {};
        if (key === 'path') w.Da = 'synthetic-other';
        if (key === 'manager') w.ha.Aa = {};
      });
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      expect(() => f.streaming.stream(f.request())).toThrow(/handoff|binding/);
      expect(f.calls.send).toBe(0);
    },
  );
  it.each(['factory', 'worker', 'g9', 'base', 'transfer', 'setter', 'Ni'] as const)(
    'rejects unsupported %s before transfer delegation',
    (key) => {
      const f = fixture();
      if (key === 'factory') f.transport.xhr.BPb = {};
      if (key === 'worker') f.transport.xhr.BPb = Object.assign(new f.namespace.Mta(), { wa: {} });
      if (key === 'g9') f.namespace.aja.g9 = () => ({});
      if (key === 'base') Object.setPrototypeOf(Object.getPrototypeOf(f.transport), {});
      if (key === 'transfer') Object.getPrototypeOf(f.transport).transfer = function () {};
      if (key === 'setter')
        f.beforeService((w) => {
          Object.getPrototypeOf(w.ha).setParam = function () {};
        });
      if (key === 'Ni')
        f.beforeService((w) => {
          Object.getPrototypeOf(w.ha).Ni = function () {};
        });
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      expect(() => f.streaming.stream(f.request())).toThrow(/backend|source-profile/);
      expect(f.calls.send).toBe(0);
    },
  );
  it('accepts the exact fetch-backed factory without changing its options', () => {
    const f = fixture();
    const factory = new f.namespace.Mta();
    f.transport.xhr.BPb = factory;
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    expect(f.calls.send).toBe(1);
    expect(factory.wa).toBe(null);
    expect(factory.ka).toBe(false);
  });
  it.each(['stream', 'service', 'route', 'factory', 'query'] as const)(
    'keeps unknown %s getters uninvoked',
    (key) => {
      const f = fixture();
      const getter = vi.fn();
      if (key === 'stream') Object.defineProperty(f.streaming, 'stream', { get: getter });
      if (key === 'service') Object.defineProperty(f.streaming, 'ha', { get: getter });
      if (key === 'route') Object.defineProperty(f.api, 'Aa', { get: getter });
      if (key === 'factory') Object.defineProperty(f.transport.xhr, 'BPb', { get: getter });
      if (key === 'query')
        f.beforeService((w) => Object.defineProperty(w.ha.oa, 'ha', { get: getter }));
      if (key === 'factory' || key === 'query') {
        armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
        expect(() => f.streaming.stream(f.request())).toThrow(/shape/);
      } else
        expect(() => armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver)).toThrow(
          /shape|profile/,
        );
      expect(getter).not.toHaveBeenCalled();
      expect(f.calls.send).toBe(0);
    },
  );
  it('rejects packet method shadows without invoking them', () => {
    const f = fixture();
    const getter = vi.fn();
    const packet = f.request();
    Object.defineProperty(packet, 'zx', { get: getter });
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    expect(() => f.streaming.stream(packet)).toThrow(/source-profile/);
    expect(getter).not.toHaveBeenCalled();
    expect(f.calls.send).toBe(0);
  });
  it('revalidates registered metadata immediately before stream delegation', () => {
    const f = fixture();
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.metadata.Ob = 'synthetic-other';
    expect(() => f.streaming.stream(f.request())).toThrow(/descriptor/);
    expect(f.calls.stream).toBe(0);
  });
  it.each(['remove', 'XE', 'ha', 'oa'] as const)(
    'rejects unknown query %s shadows without invoking them',
    (key) => {
      const f = fixture();
      const getter = vi.fn();
      f.beforeService((w) => Object.defineProperty(w.ha.oa.ha, key, { get: getter }));
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      expect(() => f.streaming.stream(f.request())).toThrow(/shape|profile/);
      expect(getter).not.toHaveBeenCalled();
      expect(f.calls.send).toBe(0);
    },
  );
  it('rejects changed native protection immediately before dispatch', () => {
    const f = fixture();
    f.compression();
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    f.api.Ja.isEnabled = false;
    expect(() => f.pending.shift()!()).toThrow(/protection|binding/);
    expect(f.calls.send).toBe(0);
  });
  it('works after serialization with no external helper references', () => {
    const f = fixture();
    const arm = Function(
      `return (${armGeminiRpcDispatch.toString()})`,
    )() as typeof armGeminiRpcDispatch;
    const g = arm(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    expect(g.sent()).toBe(true);
    expect(f.calls.send).toBe(1);
  });
  it('rejects loss of the owned service guard before original stream entry', () => {
    const f = fixture();
    const original = f.service.sendRequest;
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.service.sendRequest = original;
    expect(() => f.streaming.stream(f.request())).toThrow(/binding/);
    expect(f.calls.stream).toBe(0);
    expect(f.calls.send).toBe(0);
  });
  it('rejects a manager queue that could bypass context capture', () => {
    const f = fixture();
    f.manager.wa = {
      enqueue() {
        f.transport.xhr.send('synthetic');
      },
    };
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    expect(() => f.streaming.stream(f.request())).toThrow(/source-profile|binding/);
    expect(f.calls.send).toBe(0);
  });
  it('rejects a manager entry shadow before it can bypass Li', () => {
    const f = fixture();
    const shadow = vi.fn(() => {
      f.transport.xhr.send('synthetic');
      return false;
    });
    f.manager.isDisposed = shadow;
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    expect(() => f.streaming.stream(f.request())).toThrow(/source-profile/);
    expect(shadow).not.toHaveBeenCalled();
    expect(f.calls.send).toBe(0);
  });
  it('rejects a private transport wa getter before transfer starts', () => {
    const f = fixture();
    const getter = vi.fn(() => true);
    Object.defineProperty(f.transport, 'wa', { get: getter });
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    expect(() => f.streaming.stream(f.request())).toThrow(/shape/);
    expect(getter).not.toHaveBeenCalled();
    expect(f.calls.send).toBe(0);
  });
  it('preserves a registered unrelated stream before and after the owned attempt', () => {
    const f = fixture();
    let valid = false;
    const current = vi.fn(() => valid);
    const g = armGeminiRpcDispatch(f.namespace, f.api, current, f.rawObserver);
    f.streaming.stream(f.unrelatedRequest());
    expect(g.sent()).toBe(false);
    expect(current).not.toHaveBeenCalled();
    valid = true;
    f.completeTransport();
    f.streaming.stream(f.request());
    const checks = current.mock.calls.length;
    valid = false;
    g.close();
    f.completeTransport();
    f.streaming.stream(f.unrelatedRequest());
    expect(current.mock.calls.length).toBe(checks);
    expect(f.calls.send).toBe(3);
    expect(g.sent()).toBe(true);
  });
  it.each(['Rb', 'zsa', 'Ub'] as const)(
    'does not treat a registered generation %s alias as unrelated',
    (key) => {
      const f = fixture();
      f.otherMetadata[key] = f.metadata[key] as never;
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      expect(() => f.streaming.stream(f.unrelatedRequest())).toThrow(/descriptor/);
      expect(f.calls.send).toBe(0);
    },
  );
  it.each(['own-Wa', 'inherited-Wa', 'own-ha', 'inherited-ha'] as const)(
    'rejects a poisoned %s assignment without invoking its setter',
    (key) => {
      const f = fixture();
      const setter = vi.fn();
      if (key.endsWith('Wa'))
        f.beforeService((w) => {
          Object.defineProperty(key === 'own-Wa' ? w.ha : Object.getPrototypeOf(w.ha), 'Wa', {
            set: setter,
          });
        });
      else {
        if (key === 'inherited-ha') delete f.transport.ha;
        Object.defineProperty(
          key === 'own-ha' ? f.transport : Object.getPrototypeOf(f.transport),
          'ha',
          { set: setter, configurable: true },
        );
      }
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      expect(() => f.streaming.stream(f.request())).toThrow(/shape|profile/);
      expect(setter).not.toHaveBeenCalled();
      expect(f.calls.send).toBe(0);
    },
  );
  it('rejects an exported base transfer that initially skips rt before arming SDK hooks', () => {
    const f = fixture();
    f.namespace.Cua.prototype.transfer = function (this: any) {
      this.xhr.send('synthetic');
    };
    expect(() => armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver)).toThrow(
      /source-profile/,
    );
    expect(Object.hasOwn(f.streaming, 'stream')).toBe(false);
    expect(Object.hasOwn(f.service, 'sendRequest')).toBe(false);
    expect(f.calls.send).toBe(0);
  });
  it.each(['inherited', 'private-override'] as const)(
    'rejects an initially reordered base transfer for the %s profile before a late ha write',
    (profile) => {
      const f = fixture();
      const originalTransfer = vi.fn();
      const setter = vi.fn();
      if (profile === 'inherited') delete Object.getPrototypeOf(f.transport).transfer;
      f.namespace.Cua.prototype.transfer = function (this: any, request: any) {
        originalTransfer();
        this.aborted = false;
        this.ha = request;
        request.setParam('rt', this.tI);
        // Skip normal tua/Htc and poison the assignment after the entry fence.
        Object.defineProperty(this, 'ha', { set: setter, configurable: true });
        this.ha = request;
        this.xhr.send('synthetic');
      };
      let failure: unknown;
      try {
        armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
        f.streaming.stream(f.request());
      } catch (error) {
        failure = error;
      }
      expect(originalTransfer).not.toHaveBeenCalled();
      expect(setter).not.toHaveBeenCalled();
      expect(f.calls.send).toBe(0);
      expect(failure).toBeInstanceOf(Error);
      expect((failure as Error).message).toMatch(/source-profile/);
    },
  );
  it('supports the exact inherited Bua transfer without a private override', () => {
    const f = fixture();
    delete Object.getPrototypeOf(f.transport).transfer;
    const g = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.streaming.stream(f.request());
    expect(g.sent()).toBe(true);
    expect(f.calls.send).toBe(1);
  });
  it.each(['absent', 'wrong', 'duplicate', 'hole', 'primitive', 'oversized'] as const)(
    'rejects a %s selected-manager pool before transfer',
    (kind) => {
      const f = fixture();
      if (kind === 'absent') delete f.manager.oa;
      if (kind === 'wrong') {
        f.manager.oa = [{}];
        f.service.ka = { oa: [f.transport] };
      }
      if (kind === 'duplicate') f.manager.oa = [f.transport, f.transport];
      if (kind === 'hole') f.manager.oa = Array(1);
      if (kind === 'primitive') f.manager.oa = [false];
      if (kind === 'oversized') f.manager.oa = Array(21).fill(f.transport);
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      expect(() => f.streaming.stream(f.request())).toThrow(/shape|binding|profile/);
      expect(f.calls.send).toBe(0);
    },
  );
  it.each(['pool', 'entry'] as const)('never invokes a selected pool %s getter', (kind) => {
    const f = fixture();
    const getter = vi.fn();
    if (kind === 'pool') Object.defineProperty(f.manager, 'oa', { get: getter });
    else Object.defineProperty(f.manager.oa, '0', { get: getter });
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    expect(() => f.streaming.stream(f.request())).toThrow(/shape/);
    expect(getter).not.toHaveBeenCalled();
    expect(f.calls.send).toBe(0);
  });
  it.each(['rt', 'xhr'] as const)('rechecks removed membership before %s delegation', (stage) => {
    const f = fixture();
    if (stage === 'rt')
      f.afterStc(() => {
        f.manager.oa = [];
      });
    else f.compression();
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    if (stage === 'rt') expect(() => f.streaming.stream(f.request())).toThrow(/binding/);
    else {
      f.streaming.stream(f.request());
      f.manager.oa = [];
      expect(() => f.pending.shift()!()).toThrow(/binding/);
    }
    expect(f.calls.send).toBe(0);
  });
  it.each(['own', 'inherited'] as const)(
    'rejects a late %s Wa setter immediately before original Li',
    (kind) => {
      const f = fixture();
      const setter = vi.fn();
      f.beforeTransfer(() =>
        Object.defineProperty(
          kind === 'own' ? f.current().ha : Object.getPrototypeOf(f.current().ha),
          'Wa',
          { set: setter },
        ),
      );
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      expect(() => f.streaming.stream(f.request())).toThrow(/shape|profile/);
      expect(setter).not.toHaveBeenCalled();
      expect(f.calls.send).toBe(0);
    },
  );
  it.each(['entry', 'uxc'] as const)(
    'rejects late ha poisoning at %s before tua writes it',
    (stage) => {
      const f = fixture();
      const setter = vi.fn();
      const poison = () =>
        Object.defineProperty(f.transport, 'ha', { set: setter, configurable: true });
      if (stage === 'entry') f.beforeTransport(poison);
      else f.afterStc(poison);
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      expect(() => f.streaming.stream(f.request())).toThrow(/shape|profile/);
      expect(setter).not.toHaveBeenCalled();
      expect(f.calls.send).toBe(0);
    },
  );
  it('cancellation dominates a stale true return from current', () => {
    const f = fixture();
    f.compression();
    let cancel = false;
    let g: ReturnType<typeof armGeminiRpcDispatch>;
    g = armGeminiRpcDispatch(
      f.namespace,
      f.api,
      () => {
        if (cancel) g.close();
        return true;
      },
      f.rawObserver,
    );
    f.streaming.stream(f.request());
    cancel = true;
    expect(() => f.pending.shift()!()).toThrow(/closed/);
    expect(f.calls.send).toBe(0);
    expect(g.sent()).toBe(false);
  });
  it('preserves normal same-service Fta batching before and after the owned stream', () => {
    const f = fixture();
    let valid = false;
    const current = vi.fn(() => valid);
    const g = armGeminiRpcDispatch(f.namespace, f.api, current, f.rawObserver);
    f.service.sendRequest(f.batchWrapper());
    expect(current).not.toHaveBeenCalled();
    expect(g.sent()).toBe(false);
    valid = true;
    f.completeTransport();
    f.streaming.stream(f.request());
    const checks = current.mock.calls.length;
    valid = false;
    g.close();
    f.completeTransport();
    f.service.sendRequest(f.batchWrapper());
    expect(f.calls.send).toBe(3);
    expect(g.sent()).toBe(true);
    expect(current.mock.calls.length).toBe(checks);
  });
  it.each([
    'RxAFq',
    '/BardFrontendService.StreamGenerate',
    '/assistant.lamda.BardFrontendService/StreamGenerate',
  ])('rejects batched generation marker %s', (marker) => {
    const f = fixture();
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    expect(() => f.service.sendRequest(f.batchWrapper([marker]))).toThrow(/descriptor|binding/);
    expect(f.calls.send).toBe(0);
  });
  it('admits the source Bfa method-name marker using exact registered u_dra metadata', () => {
    const f = fixture();
    f.namespace.Ty['u_' + f.otherMetadata.zsa] = f.otherMetadata;
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.service.sendRequest(f.batchWrapper([f.otherMetadata.Rb]));
    expect(f.calls.send).toBe(1);
  });
  it('reads only batch RPC markers, without reading request field 2', () => {
    const f = fixture();
    const batch = f.batchWrapper();
    const getter = vi.fn();
    Object.defineProperty(batch.Aa.items[0], 'payload', { get: getter });
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.service.sendRequest(batch);
    expect(getter).not.toHaveBeenCalled();
    expect(f.calls.send).toBe(1);
  });
  it.each(['hNvQHb', '/BardFrontendService.ListConversationTurns'])(
    'admits source-shaped cacheable history marker %s with no vpa/mra',
    (marker) => {
      const f = fixture();
      const current = vi.fn(() => false);
      const g = armGeminiRpcDispatch(f.namespace, f.api, current, f.rawObserver);
      f.service.sendRequest(f.batchWrapper([marker]));
      expect(f.calls.send).toBe(1);
      expect(g.sent()).toBe(false);
      expect(current).not.toHaveBeenCalled();
    },
  );
  it.each(['path', 'empty', 'unknown', 'item', 'hole'] as const)(
    'rejects ambiguous batched %s schema',
    (kind) => {
      const f = fixture();
      const batch = f.batchWrapper();
      if (kind === 'path') batch.Da = '/other/data/batchexecute';
      if (kind === 'empty') batch.Aa.items = [];
      if (kind === 'unknown') batch.Aa.items[0].rpcMarker = 'Unknown';
      if (kind === 'item') batch.Aa.items = [{}];
      if (kind === 'hole') batch.Aa.items = Array(1);
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      expect(() => f.service.sendRequest(batch)).toThrow(/descriptor|binding|handoff/);
      expect(f.calls.send).toBe(0);
    },
  );
});

describe('source-owned routing survey batch', () => {
  it.each([0, 1, 2])('preserves exact survey tuple %s in both native marker forms', (index) => {
    const f = fixture();
    const survey = f.survey[index]!;
    const guard = armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    f.service.sendRequest(f.batchWrapper([survey.Ob as string]));
    f.completeTransport();
    f.service.sendRequest(f.batchWrapper([survey.Rb as string]));
    expect(guard.sent()).toBe(false);
    f.completeTransport();
    f.streaming.stream(f.request());
    expect(guard.sent()).toBe(true);
    expect(f.calls.send).toBe(3);
  });
});

describe('closed routing survey registration', () => {
  it.each([
    'flag',
    'id',
    'method',
    'registration',
    'constructor',
    'prototype',
    'generation-input',
    'generation-output',
    'zsa',
    'Fqa',
  ] as const)('rejects changed survey %s in both marker forms', (kind) => {
    for (const full of [false, true]) {
      const f = fixture();
      const survey = f.survey[0]!;
      const marker = (full ? survey.Rb : survey.Ob) as string;
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      if (kind === 'flag') survey.Qb = false;
      if (kind === 'id') survey.Ob = 'WrongRpc';
      if (kind === 'method') survey.Rb = '/TaskService.Unknown';
      if (kind === 'registration') delete (survey as any)[f.namespace.jl];
      if (kind === 'constructor') (survey as any).Ub = {};
      if (kind === 'prototype') Object.setPrototypeOf(survey.Ub.prototype, {});
      if (kind === 'generation-input') survey.Ub = f.namespace.wL;
      if (kind === 'generation-output') survey.Pb = f.namespace.IF;
      if (kind === 'zsa' || kind === 'Fqa')
        (survey as any)[kind] = '/assistant.lamda.BardFrontendService/GetCandidates';
      expect(() => f.service.sendRequest(f.batchWrapper([marker]))).toThrow();
      expect(f.calls.send).toBe(0);
    }
  });
  it.each([
    'RxAFq',
    '/BardFrontendService.StreamGenerate',
    '/TaskService.Unknown',
    '/ResponseService.WriteTaskResponse',
    'NnuTQ',
    'gPfwKf',
  ])('rejects mixed/unknown/nearby batch marker %s', (marker) => {
    const f = fixture();
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    expect(() => f.service.sendRequest(f.batchWrapper(['PCck7e', marker]))).toThrow();
    expect(f.calls.send).toBe(0);
  });
  it.each([0, 1, 2])('refuses survey tuple %s in streaming lane', (index) => {
    const f = fixture();
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    Object.assign(f.otherMetadata, f.survey[index]);
    f.namespace.Ty['o_' + f.otherMetadata.Ob] = f.otherMetadata;
    expect(() => f.streaming.stream(f.unrelatedRequest())).toThrow(/descriptor/);
    expect(f.calls.send).toBe(0);
  });
});

describe('exact normal unary GetUserStatus compatibility', () => {
  it.each(['otAQ7b', '/BardFrontendService.GetUserStatus'])(
    'preserves source status marker %s, original arguments and one owned generation',
    (marker) => {
      const f = fixture();
      let valid = false;
      const current = vi.fn(() => valid);
      const guard = armGeminiRpcDispatch(f.namespace, f.api, current, f.rawObserver);
      const batch = f.batchWrapper([marker]);
      const getter = vi.fn();
      Object.defineProperty(batch.Aa.items[0], 'payload', { get: getter });
      expect(f.namespace.Ty.o_otAQ7b).not.toBe(f.namespace.Zgc);
      expect(Object.keys(f.namespace.Ty)).not.toContain(
        'u_/assistant.lamda.BardFrontendService/GetUserStatus',
      );
      f.service.sendRequest(batch);
      expect(f.calls.send).toBe(1);
      expect(f.transport.ha).toBe(batch.ha);
      expect(f.transport.ha.ub).toBe(batch.Aa);
      expect(getter).not.toHaveBeenCalled();
      expect(current).not.toHaveBeenCalled();
      expect(guard.sent()).toBe(false);
      f.completeTransport();
      valid = true;
      f.streaming.stream(f.request());
      expect(guard.sent()).toBe(true);
      valid = false;
      const checks = current.mock.calls.length;
      guard.close();
      f.completeTransport();
      f.service.sendRequest(f.batchWrapper([marker]));
      expect(f.calls.send).toBe(3);
      expect(current.mock.calls.length).toBe(checks);
    },
  );

  it.each([
    'flag',
    'id',
    'method',
    'declaration',
    'registration',
    'marker',
    'declaration-marker',
    'declaration-flags',
    'input',
    'constructor',
    'prototype',
    'generation-input',
    'generation-output',
    'zsa',
    'Fqa',
  ] as const)('refuses changed status %s in both batch marker forms', (kind) => {
    for (const marker of ['otAQ7b', '/BardFrontendService.GetUserStatus']) {
      const f = fixture();
      const status = f.namespace.Ty.o_otAQ7b;
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      if (kind === 'flag') status.Qb = false;
      if (kind === 'id') status.Ob = 'WrongRpc';
      if (kind === 'method') status.Rb = '/BardFrontendService.SyntheticList';
      if (kind === 'declaration') f.namespace.Zgc.Pb = class extends f.namespace.l {};
      if (kind === 'registration') delete f.namespace.Ty.o_otAQ7b;
      if (kind === 'marker') delete status[f.namespace.jl];
      if (kind === 'declaration-marker') delete f.namespace.Zgc[f.namespace.jl];
      if (kind === 'declaration-flags')
        f.namespace.Zgc.zsa = '/assistant.lamda.BardFrontendService/GetUserStatus';
      if (kind === 'input') status.Ub = f.namespace.Zgc.Ub = class extends f.namespace.l {};
      if (kind === 'constructor') status.Pb = f.namespace.Zgc.Pb = {};
      if (kind === 'prototype') Object.setPrototypeOf(status.Pb.prototype, {});
      if (kind === 'generation-input') status.Ub = f.namespace.Zgc.Ub = f.namespace.wL;
      if (kind === 'generation-output') status.Pb = f.namespace.Zgc.Pb = f.namespace.IF;
      if (kind === 'zsa' || kind === 'Fqa')
        status[kind] = '/assistant.lamda.BardFrontendService/GetUserStatus';
      expect(() => f.service.sendRequest(f.batchWrapper([marker]))).toThrow();
      expect(f.calls.send).toBe(0);
    }
  });

  it.each(['true', 'false', 'renamed'] as const)('refuses status %s in streaming lane', (kind) => {
    const f = fixture();
    armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
    Object.assign(f.otherMetadata, f.namespace.Ty.o_otAQ7b);
    f.namespace.Ty.o_otAQ7b = f.otherMetadata;
    if (kind !== 'true') f.otherMetadata.Qb = false;
    if (kind === 'renamed') f.otherMetadata.Ob = 'SynthRpc';
    expect(() => f.streaming.stream(f.unrelatedRequest())).toThrow(/descriptor/);
    expect(f.calls.send).toBe(0);
  });

  it.each(['RxAFq', '/BardFrontendService.StreamGenerate', '/BardFrontendService.Unknown'])(
    'refuses status mixed with generation/unknown %s',
    (marker) => {
      const f = fixture();
      armGeminiRpcDispatch(f.namespace, f.api, () => true, f.rawObserver);
      expect(() => f.service.sendRequest(f.batchWrapper(['otAQ7b', marker]))).toThrow();
      expect(f.calls.send).toBe(0);
    },
  );
});
