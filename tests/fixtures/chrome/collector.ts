/** Native lifecycle events are synthetic here; installed tests use real Chrome ports. */
export function installCollectorFixture() {
  const state = globalThis as any;
  let listener: ((port: any) => void) | undefined;
  const ports = new Map<string, any>();
  state.chrome.runtime.onConnect = { addListener: (value: typeof listener) => (listener = value) };
  state.__fixtureCollectors = ports;
  state.__fixtureConnectCollector = (
    id: string,
    sender = { id: 'fixture', url: 'chrome-extension://fixture/sidepanel.html' },
  ) => {
    if (ports.has(id)) return ports.get(id);
    const disconnected = new Set<() => void>();
    const port = {
      name: `crosscheck-collector:${id}`,
      sender,
      messages: [] as unknown[],
      postMessage(value: unknown) {
        this.messages.push(value);
      },
      onDisconnect: { addListener: (value: () => void) => disconnected.add(value) },
      disconnect() {
        ports.delete(id);
        for (const value of disconnected) value();
      },
    };
    ports.set(id, port);
    listener?.(port);
    return port;
  };
}
