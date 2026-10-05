import type { ExtensionStatus, Platform } from '../../../src/application/ports';
import {
  providerIds,
  providers,
  type ProviderId,
  type Binding,
} from '../../../src/domains/providers/model';
import type { Job } from '../../../src/domains/crosscheck/model';
import type { AttachmentPayload } from '../../../src/domains/attachments/model';

declare global {
  interface Window {
    harness: {
      sends: { job: Job; target: Binding; attachments: AttachmentPayload[] }[];
      activeProvider: ProviderId;
      sourceAvailable: boolean;
      accessRequests: ProviderId[][];
      mainMoved: boolean;
      moveMainDuringReview?: boolean;
      failProvider?: ProviderId;
      delay: number;
      failSave?: boolean;
      failAll?: boolean;
      models: Partial<Record<ProviderId, string>>;
      extensionStatus: ExtensionStatus;
      updateAvailable?: (version: string) => void;
      managerOpens: number;
    };
  }
}
window.harness = {
  sends: [],
  activeProvider: 'chatgpt',
  sourceAvailable: new URL(location.href).searchParams.get('source') !== 'unavailable',
  accessRequests: [],
  mainMoved: false,
  delay: 80,
  models: {},
  extensionStatus: {
    version: '0.3.0',
    automaticUpdates: new URL(location.href).searchParams.get('updates') === 'automatic',
  },
  managerOpens: 0,
};
const bindings = Object.fromEntries(
  providerIds.map((provider, i) => [
    provider,
    {
      provider,
      tabId: i + 1,
      documentId: `fixture-${provider}`,
      url: `${providers[provider].origin}/original-conversation`,
    },
  ]),
) as Record<ProviderId, Binding>;
export const fixturePlatform: Platform = {
  async extensionStatus() {
    const pendingVersion = sessionStorage.getItem('fixture-pending-update');
    return { ...window.harness.extensionStatus, ...(pendingVersion ? { pendingVersion } : {}) };
  },
  watchExtensionUpdate(available) {
    window.harness.updateAvailable = (version) => {
      sessionStorage.setItem('fixture-pending-update', version);
      available(version);
    };
    return () => {
      window.harness.updateAvailable = undefined;
    };
  },
  async openExtensionManager() {
    window.harness.managerOpens++;
  },
  async requestAccess(selected) {
    window.harness.accessRequests.push(selected);
  },
  async currentConversation(requestAccess) {
    if (requestAccess) window.harness.sourceAvailable = true;
    if (!window.harness.sourceAvailable) return;
    const binding = bindings[window.harness.activeProvider];
    return { binding, snapshot: await this.inspect(binding) };
  },
  async preparePeer(provider, saved) {
    return saved ?? bindings[provider];
  },
  async reveal(binding) {
    window.harness.activeProvider = binding.provider;
  },
  async models(binding, key) {
    if (key) window.harness.models[binding.provider] = key;
    return {
      current: window.harness.models[binding.provider] ?? '기본 모델',
      options: [
        { key: '기본 모델', label: '기본 모델', disabled: false },
        { key: '다른 모델', label: '다른 모델', disabled: false },
        { key: '한도 도달', label: '한도 도달', disabled: true },
      ],
    };
  },
  async connect(provider) {
    return bindings[provider];
  },
  async inspect(binding) {
    return {
      provider: binding.provider,
      documentId: binding.documentId,
      url:
        window.harness.mainMoved && binding.provider === 'chatgpt'
          ? 'https://chatgpt.com/c/changed'
          : binding.url,
      composer: true,
      busy: false,
      draft: false,
      truncated: false,
      lastQuestion: '물은 언제나 100°C에서 끓나요?',
      lastAnswer: '표준 대기압에서 순수한 물은 약 100°C에서 끓습니다.',
    };
  },
  async sendAndCollect(job, target, signal, attachments = []) {
    window.harness.sends.push({ job, target, attachments });
    await new Promise((resolve) => setTimeout(resolve, window.harness.delay));
    if (signal.aborted) throw new Error('수집 중단');
    if (job.stage === 'review' && window.harness.moveMainDuringReview)
      window.harness.mainMoved = true;
    if (window.harness.failAll || window.harness.failProvider === job.provider)
      throw new Error('fixture: 무료 사용량 한도. 수동으로 확인하세요.');
    if (job.stage === 'synthesize')
      return {
        binding: target,
        answer:
          '최종 답변: 항상 100°C는 아닙니다. 압력과 용질에 따라 달라집니다. 실제 원문 확인은 필요합니다.',
      };
    if (job.stage === 'review')
      return {
        binding: target,
        answer: '교차 검토: 대기압과 순도를 명시해야 합니다. 다수결은 검증이 아닙니다.',
      };
    return {
      binding: target,
      answer: `독립 답변 ${job.provider}: 압력에 따라 끓는점이 달라집니다. https://example.org/pressure <img src=x onerror="window.pwned=true">`,
    };
  },
  async openProvider() {},
  async disconnect() {},
  async load() {
    return JSON.parse(sessionStorage.getItem('fixture-workspace') ?? 'null') ?? { bindings };
  },
  async save(workspace) {
    if (window.harness.failSave) throw new Error('fixture: 저장 실패');
    sessionStorage.setItem('fixture-workspace', JSON.stringify(workspace));
  },
};
