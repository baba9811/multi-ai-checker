import { expect, it } from 'vitest';
import { importedRun } from '../../../src/application/automatic-workflow';
import { markdown, promptFor, recoverRun } from '../../../src/domains/crosscheck/workflow';
import { pairConversation } from '../../../src/infrastructure/providers/dom';
const turns = [
  { question: 'Earlier question', answer: 'Earlier answer' },
  { question: 'Latest question', answer: 'Latest answer' },
];
const binding = {
  provider: 'chatgpt' as const,
  tabId: 1,
  documentId: 'doc',
  url: 'https://chatgpt.com/c/test',
};
const snapshot = {
  ...binding,
  composer: true,
  busy: false,
  draft: false,
  truncated: false,
  lastQuestion: turns[1]!.question,
  lastAnswer: turns[1]!.answer,
  context: { scope: 'rendered' as const, turns },
};
it('retains all ordered pairs in every prompt and exports while reusing the latest main answer', () => {
  const run = importedRun({ binding, snapshot }, ['chatgpt', 'claude'], 'economy');
  expect(run.context).toEqual(snapshot.context);
  for (const stage of ['collect', 'review', 'synthesize'] as const)
    expect(promptFor(run, stage)).toContain('Earlier answer');
  expect(markdown(run)).toContain('Earlier question');
  expect(run.jobs[0]!.answer).toBe('Latest answer');
});
it('rejects fresh sources missing context, with partial history, or oversized context', () => {
  expect(() =>
    importedRun(
      { binding, snapshot: { ...snapshot, context: undefined } } as never,
      ['chatgpt', 'claude'],
      'economy',
    ),
  ).toThrow('대화');
  expect(() =>
    importedRun(
      {
        binding,
        snapshot: {
          ...snapshot,
          context: { ...snapshot.context, error: '이전 대화를 불러오세요.' },
        },
      },
      ['chatgpt', 'claude'],
      'economy',
    ),
  ).toThrow('이전 대화');
  expect(() =>
    importedRun(
      {
        binding,
        snapshot: {
          ...snapshot,
          context: { scope: 'rendered', turns: Array.from({ length: 21 }, () => turns[0]!) },
        },
      },
      ['chatgpt', 'claude'],
      'economy',
    ),
  ).toThrow('최대 20쌍 · 합계 40000자');
});
it('recovers legacy records without inventing earlier context', () => {
  const run = importedRun({ binding, snapshot }, ['chatgpt', 'claude'], 'economy');
  const { context: _, ...legacy } = run;
  expect(recoverRun(legacy)?.context).toBeUndefined();
});
it('pairs strictly and rejects incomplete, ambiguous, and oversized messages', () => {
  expect(
    pairConversation([
      { role: 'user', text: 'q', complete: true },
      { role: 'assistant', text: 'a', complete: true },
    ]),
  ).toEqual([{ question: 'q', answer: 'a' }]);
  for (const messages of [
    [{ role: 'assistant', text: 'a', complete: true }],
    [{ role: 'user', text: 'q', complete: true }],
    [
      { role: 'user', text: 'q', complete: true },
      { role: 'user', text: 'q2', complete: true },
    ],
    [
      { role: 'user', text: 'q', complete: true },
      { role: 'assistant', text: 'a', complete: false },
    ],
    [
      { role: 'user', text: 'q'.repeat(100001), complete: true },
      { role: 'assistant', text: 'a', complete: true },
    ],
  ])
    expect(() => pairConversation(messages as never)).toThrow();
});
it('invalidates pinned source when an earlier pair changes', async () => {
  const { assertSameSource } = await import('../../../src/application/automatic-workflow');
  expect(() =>
    assertSameSource(snapshot, {
      ...snapshot,
      context: {
        ...snapshot.context,
        turns: [{ ...turns[0]!, answer: 'Changed earlier answer' }, turns[1]!],
      },
    }),
  ).toThrow('바뀌');
});
it('blocks changed captured prefix before a main send while allowing later completed turns', async () => {
  const { assertCapturedContext } = await import('../../../src/application/automatic-workflow');
  expect(() =>
    assertCapturedContext(
      snapshot.context,
      {
        ...snapshot,
        context: {
          ...snapshot.context,
          turns: [...turns, { question: 'Own review', answer: 'Own answer' }],
        },
      },
      [{ question: 'Own review', answer: 'Own answer' }],
    ),
  ).not.toThrow();
  expect(() =>
    assertCapturedContext(snapshot.context, {
      ...snapshot,
      context: { ...snapshot.context, turns: [{ ...turns[0]!, question: 'Edited' }, turns[1]!] },
    }),
  ).toThrow('바뀌');
});
it('accepts near-bound imported context followed by only its own long review exchange', async () => {
  const { assertCapturedContext } = await import('../../../src/application/automatic-workflow');
  const context = {
    scope: 'rendered' as const,
    turns: [
      { question: 'q'.repeat(8000), answer: 'a'.repeat(14000) },
      { question: 'q2', answer: 'b'.repeat(14000) },
    ],
  };
  const own = { question: 'review'.repeat(9000), answer: 'review result' };
  const captured = pairConversation(
    [...context.turns, own].flatMap((turn) => [
      { role: 'user' as const, text: turn.question, complete: true },
      { role: 'assistant' as const, text: turn.answer, complete: true },
    ]),
  );
  const current = { ...snapshot, context: { scope: 'rendered' as const, turns: captured } };
  expect(() => assertCapturedContext(context, current, [own])).not.toThrow();
  expect(() => assertCapturedContext(context, current)).toThrow();
});
it('finishes thorough synthesis after its actual long main review prompt is appended', async () => {
  const { executeAutomatic } = await import('../../../src/application/automatic-workflow');
  const turns = [
    { question: 'q'.repeat(8000), answer: 'a'.repeat(14000) },
    { question: 'latest', answer: 'b'.repeat(14000) },
  ];
  const current = {
    ...snapshot,
    lastQuestion: 'latest',
    lastAnswer: turns[1]!.answer,
    context: { scope: 'rendered' as const, turns },
  };
  const run = importedRun({ binding, snapshot: current }, ['chatgpt', 'claude'], 'thorough');
  const sends: string[] = [];
  const platform = {
    async reveal() {},
    async preparePeer() {
      return {
        ...binding,
        provider: 'claude' as const,
        tabId: 2,
        url: 'https://claude.ai/chat/test',
      };
    },
    async inspect(target: typeof binding) {
      return {
        ...current,
        provider: target.provider,
        url: target.url,
        documentId: target.documentId,
        context: {
          scope: 'rendered' as const,
          turns: pairConversation(
            current.context.turns.flatMap((turn) => [
              { role: 'user' as const, text: turn.question, complete: true },
              { role: 'assistant' as const, text: turn.answer, complete: true },
            ]),
          ),
        },
      };
    },
    async sendAndCollect(job: (typeof run.jobs)[number], target: typeof binding) {
      sends.push(job.stage);
      if (job.provider === 'chatgpt')
        current.context.turns.push({ question: job.prompt, answer: 'completed own response' });
      return { binding: target, answer: 'completed own response' };
    },
  };
  const result = await executeAutomatic(
    run,
    {},
    platform as never,
    new AbortController().signal,
    async () => {},
  );
  expect(result.stage).toBe('synthesize');
  expect(sends.at(-1)).toBe('synthesize');
  expect(
    result.jobs.find((job) => job.provider === 'chatgpt' && job.stage === 'review')!.prompt.length,
  ).toBeGreaterThan(40000);
});

it('explains total import bounds in Korean without schema diagnostics', () => {
  const long = [
    { question: 'q'.repeat(8000), answer: 'a'.repeat(14000) },
    { question: 'q'.repeat(8000), answer: 'a'.repeat(14000) },
  ];
  expect(() =>
    importedRun(
      {
        binding,
        snapshot: {
          ...snapshot,
          lastQuestion: long[1]!.question,
          lastAnswer: long[1]!.answer,
          context: { scope: 'rendered', turns: long },
        },
      },
      ['chatgpt', 'claude'],
      'economy',
    ),
  ).toThrow('더 짧은 대화를 선택해주세요.');
});
