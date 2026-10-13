import { expect, it, vi } from 'vitest';
import {
  importedClaudePeerRun,
  executeAutomatic,
} from '../../../src/application/automatic-workflow';
import { prepareAttachments } from '../../../src/application/attachments';
import { Command } from '../../../src/application/provider-protocol';
import type { Platform, Workspace } from '../../../src/application/ports';
import { attachmentMetadata } from '../../../src/domains/attachments/model';
import { Run } from '../../../src/domains/crosscheck/model';
import { nextStage, recoverRun } from '../../../src/domains/crosscheck/workflow';
import { Binding } from '../../../src/domains/providers/model';

const main = {
  provider: 'chatgpt' as const,
  tabId: 1,
  documentId: 'main',
  url: 'https://chatgpt.com/c/test',
};
const context = {
  scope: 'rendered' as const,
  turns: [
    { question: 'Synthetic first question', answer: 'Synthetic first answer' },
    { question: 'Synthetic last question', answer: 'Synthetic last answer' },
  ],
};
const snapshot = (binding = main) => ({
  ...binding,
  composer: true,
  busy: false,
  draft: false,
  truncated: false,
  lastQuestion: context.turns[1]!.question,
  lastAnswer: context.turns[1]!.answer,
  context,
});
const source = { binding: main, snapshot: snapshot() };

function harness() {
  const checkpoints: Workspace[] = [];
  const reveal = vi.fn(async () => {});
  const inspect = vi.fn(async (binding) => ({ ...snapshot(), ...binding }));
  const preparePeer = vi.fn(
    async (_provider, saved, threadId) =>
      saved ?? {
        provider: 'claude',
        tabId: 2,
        documentId: 'peer',
        url: 'https://claude.ai/new',
        threadId,
      },
  );
  const sendAndCollect = vi.fn(async (job, binding, _signal, _files, _approved) => {
    expect(checkpoints.at(-1)?.run?.jobs.find((item) => item.id === job.id)?.status).toBe(
      'sending',
    );
    return { answer: `${job.stage} synthetic answer`, binding };
  });
  return {
    checkpoints,
    reveal,
    inspect,
    preparePeer,
    sendAndCollect,
    platform: { reveal, inspect, preparePeer, sendAndCollect } as unknown as Platform,
    checkpoint: async (value: Workspace) => {
      checkpoints.push(structuredClone(value));
    },
  };
}

it('persists a bounded peer intent, sends full scope twice without activation or main synthesis', async () => {
  const files = await prepareAttachments([
    new File(['original synthetic data'], 'facts.txt', { type: 'text/plain' }),
  ]);
  const approved = files.map(attachmentMetadata);
  const initial = importedClaudePeerRun(source, approved);
  const test = harness();
  const unrelated = {
    provider: 'claude' as const,
    tabId: 80,
    documentId: 'other',
    url: 'https://claude.ai/chat/other',
  };
  const result = await executeAutomatic(
    initial,
    { claude: unrelated },
    test.platform,
    new AbortController().signal,
    test.checkpoint,
    files,
  );
  expect(result.kind).toBe('claude-peer');
  expect(test.preparePeer.mock.calls[0]?.slice(0, 3)).toEqual(['claude', undefined, initial.id]);
  expect(test.reveal).not.toHaveBeenCalled();
  expect(test.sendAndCollect.mock.calls.map(([job]) => [job.provider, job.stage])).toEqual([
    ['claude', 'collect'],
    ['claude', 'review'],
  ]);
  expect(test.sendAndCollect.mock.calls.map((call) => call[3])).toEqual([files, []]);
  expect(test.sendAndCollect.mock.calls.map((call) => call[4])).toEqual([approved, approved]);
  for (const [job] of test.sendAndCollect.mock.calls) {
    expect(job.prompt).toContain('Synthetic first question');
    expect(job.prompt).toContain('Synthetic last answer');
    expect(job.prompt).toContain('facts.txt');
  }
  expect(result.jobs.some((job) => job.stage === 'synthesize')).toBe(false);
  expect(result.stage).toBe('review');
  expect(test.checkpoints.every((value) => value.run?.kind === 'claude-peer')).toBe(true);
  expect(JSON.stringify(test.checkpoints)).not.toContain('base64');
  expect(() => nextStage(result)).toThrow();
});

it('checks the captured source again before the follow-up and prevents further sends after edits', async () => {
  const test = harness();
  test.inspect.mockImplementation(async (binding) => ({
    ...snapshot(),
    ...binding,
    context:
      binding.provider === 'chatgpt' && test.sendAndCollect.mock.calls.length
        ? { ...context, turns: context.turns.slice(1) }
        : context,
  }));
  await expect(
    executeAutomatic(
      importedClaudePeerRun(source),
      {},
      test.platform,
      new AbortController().signal,
      test.checkpoint,
    ),
  ).rejects.toThrow();
  expect(test.sendAndCollect).toHaveBeenCalledTimes(1);
  expect(test.reveal).not.toHaveBeenCalled();
});

it('does not treat another hidden thread on the same home document as original-file delivery', async () => {
  const files = await prepareAttachments([
    new File(['synthetic original'], 'facts.txt', { type: 'text/plain' }),
  ]);
  const initial = importedClaudePeerRun(source, files.map(attachmentMetadata));
  const binding = {
    provider: 'claude' as const,
    tabId: 2,
    documentId: 'peer',
    url: 'https://claude.ai/new',
    threadId: initial.id,
  };
  const completed = {
    ...initial,
    jobs: initial.jobs.map((job) =>
      job.provider === 'claude'
        ? {
            ...job,
            status: 'done' as const,
            answer: 'verified synthetic answer',
            attachmentTarget: { ...binding, threadId: crypto.randomUUID() },
          }
        : job,
    ),
  };
  const test = harness();
  await executeAutomatic(
    nextStage(completed),
    { claude: binding },
    test.platform,
    new AbortController().signal,
    test.checkpoint,
    files,
  );
  expect(test.sendAndCollect).toHaveBeenCalledTimes(1);
  expect(test.sendAndCollect.mock.calls[0]?.[3]).toEqual(files);
});

it('retains intent on recovery and rejects chair, stage, participants and lost thread substitutions', async () => {
  const initial = importedClaudePeerRun(source);
  const sending = {
    ...initial,
    jobs: initial.jobs.map((job) =>
      job.provider === 'claude' ? { ...job, status: 'sending' } : job,
    ),
  };
  expect(recoverRun(sending)?.kind).toBe('claude-peer');
  expect(recoverRun(sending)?.jobs.find((job) => job.provider === 'claude')?.status).toBe(
    'interrupted',
  );
  for (const patch of [
    { chair: 'claude' },
    { stage: 'synthesize' },
    { selected: ['chatgpt', 'claude', 'gemini'] },
  ])
    expect(Run.safeParse({ ...initial, ...patch }).success).toBe(false);
  expect(Binding.safeParse({ ...main, threadId: initial.id }).success).toBe(false);
  const test = harness();
  test.preparePeer.mockRejectedValue(new Error('lost bound session'));
  await expect(
    executeAutomatic(
      initial,
      {
        claude: {
          provider: 'claude',
          tabId: 2,
          documentId: 'lost',
          url: 'https://claude.ai/new',
          threadId: initial.id,
        },
      },
      test.platform,
      new AbortController().signal,
      test.checkpoint,
    ),
  ).rejects.toThrow();
  expect(test.sendAndCollect).not.toHaveBeenCalled();
});

it('accepts only the explicit strict peer command and rejects unsupported stages or extra proxy fields', () => {
  const command = {
    type: 'sendClaudePeer',
    id: 'job',
    threadId: crypto.randomUUID(),
    stage: 'collect',
    documentId: 'doc',
    url: 'https://claude.ai/new',
    prompt: 'synthetic',
    attachments: [],
    approved: [],
  };
  expect(Command.safeParse(command).success).toBe(true);
  for (const patch of [
    { stage: 'synthesize' },
    { threadId: 'bad' },
    { headers: {} },
    { approved: undefined },
  ])
    expect(Command.safeParse({ ...command, ...patch }).success).toBe(false);
});
