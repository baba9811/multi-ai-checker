import type { Binding, ProviderId } from '../domains/providers/model';
import type { Job, Run } from '../domains/crosscheck/model';
import type { Snapshot, ModelCatalog } from './provider-protocol';
import type { AttachmentPayload } from '../domains/attachments/model';

export type Workspace = { run?: Run; bindings: Partial<Record<ProviderId, Binding>> };
export type Conversation = { binding: Binding; snapshot: Snapshot };
export type Collected = { answer: string; binding: Binding };
export type ExtensionStatus = {
  version: string;
  automaticUpdates: boolean;
  pendingVersion?: string;
};
/** Browser implementation is injected at the entrypoint, never imported by the UI. */
export interface Platform {
  extensionStatus?(): Promise<ExtensionStatus>;
  watchExtensionUpdate?(available: (version: string) => void): () => void;
  openExtensionManager?(): Promise<void>;
  requestAccess?(providers: ProviderId[]): Promise<void>;
  connect(provider: ProviderId): Promise<Binding>;
  refreshConnection?(binding: Binding): Promise<Binding>;
  currentConversation(requestAccess?: ProviderId[]): Promise<Conversation | undefined>;
  preparePeer(provider: ProviderId, saved?: Binding): Promise<Binding>;
  inspect(binding: Binding): Promise<Snapshot>;
  sendAndCollect(
    job: Job,
    binding: Binding,
    signal: AbortSignal,
    attachments?: AttachmentPayload[],
  ): Promise<Collected>;
  models(binding: Binding, key?: string): Promise<ModelCatalog>;
  reveal(binding: Binding): Promise<void>;
  watchActiveTab?(changed: () => void): () => void;
  openProvider(provider: ProviderId): Promise<void>;
  disconnect(provider: ProviderId): Promise<void>;
  load(): Promise<{ run?: unknown; bindings?: Record<string, unknown> } | undefined>;
  save(workspace: Workspace): Promise<void>;
}
