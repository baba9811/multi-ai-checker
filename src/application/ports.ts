import type { Binding, ProviderId } from '../domains/providers/model';
import type { Job, Run } from '../domains/crosscheck/model';
import type { Snapshot, ModelCatalog } from './provider-protocol';

export type Workspace = { run?: Run; bindings: Partial<Record<ProviderId, Binding>> };
export type Conversation = { binding: Binding; snapshot: Snapshot };
export type Collected = { answer: string; binding: Binding };
/** Browser implementation is injected at the entrypoint, never imported by the UI. */
export interface Platform {
  connect(provider: ProviderId): Promise<Binding>;
  currentConversation(requestAccess?: ProviderId[]): Promise<Conversation | undefined>;
  preparePeer(provider: ProviderId, saved?: Binding): Promise<Binding>;
  inspect(binding: Binding): Promise<Snapshot>;
  sendAndCollect(job: Job, binding: Binding, signal: AbortSignal): Promise<Collected>;
  models(binding: Binding, key?: string): Promise<ModelCatalog>;
  reveal(binding: Binding): Promise<void>;
  watchActiveTab?(changed: () => void): () => void;
  openProvider(provider: ProviderId): Promise<void>;
  disconnect(provider: ProviderId): Promise<void>;
  load(): Promise<{ run?: unknown; bindings?: Record<string, unknown> } | undefined>;
  save(workspace: Workspace): Promise<void>;
}
