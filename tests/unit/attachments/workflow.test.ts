import { expect, it } from 'vitest';
import { executeAutomatic, importedRun } from '../../../src/application/automatic-workflow';
import { prepareAttachments } from '../../../src/application/attachments';
import type { Conversation, Platform, Workspace } from '../../../src/application/ports';
import type { AttachmentPayload } from '../../../src/domains/attachments/model';
import { attachmentMetadata } from '../../../src/domains/attachments/model';
import type { Job } from '../../../src/domains/crosscheck/model';
import {
  providerIds,
  providers,
  type Binding,
  type ProviderId,
} from '../../../src/domains/providers/model';

const target = (provider: ProviderId): Binding => ({
  provider,
  tabId: providerIds.indexOf(provider) + 1,
  documentId: provider,
  url: `${providers[provider].origin}/c/test`,
});
const snapshot = (binding: Binding) => ({
  ...binding,
  composer: true,
  busy: false,
  draft: false,
  truncated: false,
  lastQuestion: 'Compare the synthetic document.',
  lastAnswer: 'Existing main answer.',
  context: {
    scope: 'rendered' as const,
    turns: [{ question: 'Compare the synthetic document.', answer: 'Existing main answer.' }],
  },
});
const source: Conversation = { binding: target('chatgpt'), snapshot: snapshot(target('chatgpt')) };

function harness(failure?: string) {
  const checkpoints: Workspace[] = [];
  const sends: {
    job: Job;
    binding: Binding;
    files: AttachmentPayload[];
    checkpointStatus?: string;
  }[] = [];
  const port: Pick<Platform, 'preparePeer' | 'inspect' | 'sendAndCollect'> = {
    async preparePeer(provider) {
      return target(provider);
    },
    async inspect(binding) {
      return snapshot(binding);
    },
    async sendAndCollect(job, binding, _signal, files = []) {
      sends.push({
        job,
        binding,
        files,
        checkpointStatus: checkpoints.at(-1)?.run?.jobs.find((item) => item.id === job.id)?.status,
      });
      if (failure && job.provider === 'claude') throw new Error(failure);
      return { answer: `${job.provider} ${job.stage} answer`, binding };
    },
  };
  return {
    platform: port as Platform,
    checkpoints,
    sends,
    async checkpoint(workspace: Workspace) {
      checkpoints.push(structuredClone(workspace));
    },
  };
}
async function originals() {
  return prepareAttachments([
    new File(['original test document'], 'facts.txt', { type: 'text/plain' }),
  ]);
}

it('fans out exact originals once per provider, including main synthesis, with metadata-only checkpoints', async () => {
  const files = await originals();
  const initial = importedRun(source, [...providerIds], 'economy', files.map(attachmentMetadata));
  const test = harness();
  const result = await executeAutomatic(
    initial,
    {},
    test.platform,
    new AbortController().signal,
    test.checkpoint,
    files,
  );
  for (const provider of providerIds) {
    const uploads = test.sends.filter(
      (send) => send.job.provider === provider && send.files.length,
    );
    expect(uploads).toHaveLength(1);
    expect(uploads[0]!.files).toEqual(files);
  }
  expect(
    test.sends.filter((send) => send.job.stage === 'review').map((send) => send.files),
  ).toEqual([[]]);
  const final = test.sends.find((send) => send.job.stage === 'synthesize')!;
  expect(final.job.provider).toBe('chatgpt');
  expect(final.binding).toEqual(source.binding);
  expect(final.files).toEqual(files);
  expect(test.sends.every((send) => send.checkpointStatus === 'sending')).toBe(true);
  for (const checkpoint of test.checkpoints) {
    expect(checkpoint.run?.attachments).toEqual(files.map(attachmentMetadata));
    expect(JSON.stringify(checkpoint)).not.toContain('base64');
    expect(JSON.stringify(checkpoint)).not.toContain(files[0]!.base64);
  }
  expect(
    result.jobs
      .filter((job) => job.stage === 'collect' && job.provider !== 'chatgpt')
      .every((job) => job.attachmentTarget),
  ).toBe(true);
});

it('requires the exact reselected originals on resume and does not repeat files already delivered to peers', async () => {
  const files = await originals();
  const initial = importedRun(source, [...providerIds], 'economy', files.map(attachmentMetadata));
  const first = harness();
  await executeAutomatic(
    initial,
    {},
    first.platform,
    new AbortController().signal,
    first.checkpoint,
    files,
  );
  const saved = first.checkpoints.find(
    (workspace) =>
      workspace.run?.stage === 'collect' &&
      workspace.run.jobs.every((job) => job.status === 'done'),
  )!;
  const resumed = harness();
  await executeAutomatic(
    saved.run!,
    saved.bindings,
    resumed.platform,
    new AbortController().signal,
    resumed.checkpoint,
    await originals(),
  );
  expect(
    resumed.sends
      .filter((send) => send.job.provider !== 'chatgpt')
      .every((send) => !send.files.length),
  ).toBe(true);
  expect(resumed.sends.find((send) => send.job.stage === 'synthesize')!.files).toEqual(files);
  expect(resumed.sends.some((send) => send.job.stage === 'collect')).toBe(false);
});

it.each(['missing', 'changed'])(
  'rejects %s originals before checkpoints or sends',
  async (kind) => {
    const files = await originals();
    const initial = importedRun(source, [...providerIds], 'economy', files.map(attachmentMetadata));
    const selected =
      kind === 'missing'
        ? []
        : await prepareAttachments([
            new File(['modified test document'], 'facts.txt', { type: 'text/plain' }),
          ]);
    const test = harness();
    await expect(
      executeAutomatic(
        initial,
        {},
        test.platform,
        new AbortController().signal,
        test.checkpoint,
        selected,
      ),
    ).rejects.toThrow('원본 첨부파일을 모두 다시 선택');
    expect(test.sends).toEqual([]);
    expect(test.checkpoints).toEqual([]);
  },
);

it('uploads originals again when a completed peer is explicitly rebound before review resumes', async () => {
  const files = await originals();
  const first = harness();
  await executeAutomatic(
    importedRun(source, [...providerIds], 'economy', files.map(attachmentMetadata)),
    {},
    first.platform,
    new AbortController().signal,
    first.checkpoint,
    files,
  );
  const saved = first.checkpoints.find(
    (workspace) =>
      workspace.run?.stage === 'review' &&
      workspace.run.jobs.some((job) => job.stage === 'review' && job.status === 'ready'),
  )!;
  const replacement = {
    ...target('claude'),
    tabId: 50,
    documentId: 'new-claude-document',
    url: `${providers.claude.origin}/chat/reconnected`,
  };
  const resumed = harness();
  resumed.platform.preparePeer = async (provider, binding) => binding ?? target(provider);
  await executeAutomatic(
    saved.run!,
    { ...saved.bindings, claude: replacement },
    resumed.platform,
    new AbortController().signal,
    resumed.checkpoint,
    files,
  );
  const review = resumed.sends.find((send) => send.job.stage === 'review')!;
  expect(review.binding).toEqual(replacement);
  expect(review.files).toEqual(files);
  expect(
    resumed.checkpoints.at(-1)?.run?.jobs.find((job) => job.id === review.job.id)?.attachmentTarget,
  ).toEqual(replacement);
});

it.each(['upload failed', 'send outcome uncertain'])(
  'does not retry or mark attachment delivery after %s',
  async (failure) => {
    const files = await originals();
    const initial = importedRun(source, [...providerIds], 'economy', files.map(attachmentMetadata));
    const test = harness(failure);
    const result = await executeAutomatic(
      initial,
      {},
      test.platform,
      new AbortController().signal,
      test.checkpoint,
      files,
    );
    expect(test.sends.filter((send) => send.job.provider === 'claude')).toHaveLength(1);
    const failed = result.jobs.find((job) => job.provider === 'claude')!;
    expect(failed.status).toBe('error');
    expect(failed.error).toBe(failure);
    expect(failed.attachmentTarget).toBeUndefined();
    expect(
      test.checkpoints
        .flatMap((workspace) => workspace.run?.jobs ?? [])
        .filter((job) => job.provider === 'claude')
        .every((job) => !job.attachmentTarget),
    ).toBe(true);
  },
);
