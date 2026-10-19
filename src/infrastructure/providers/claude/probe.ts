import {
  CLAUDE_PROBE_PROMPT,
  CLAUDE_CONTEXT_PROBE_PROMPT,
  CLAUDE_CONTEXT_PROBE_FOLLOWUP,
  CLAUDE_CONTEXT_PROBE_EXPECTED,
  type ClaudeProbeKind,
} from '../../../application/claude-probe';
import { collectClaudeStream, createClaudeSession } from './session';
export { CLAUDE_PROBE_PROMPT };
export async function collectClaudeProbeStream(
  stream: ReadableStream<Uint8Array>,
  signal: AbortSignal,
  model: string,
) {
  return collectClaudeStream(stream, signal, model, 4096);
}
export async function claudeProbe(
  initialLabel: string,
  signal: AbortSignal,
  kind?: ClaudeProbeKind,
): Promise<string> {
  if (kind !== undefined && kind !== 'context')
    throw new Error('Claude probe failed.', { cause: signal.aborted ? 'interrupted' : 'page' });
  const session = createClaudeSession(initialLabel, {
    answerLimit: 4096,
    historyBytes: 1048576,
    strictRoot: kind === 'context',
    expected: kind === 'context' ? CLAUDE_CONTEXT_PROBE_EXPECTED : undefined,
    failure: 'Claude probe failed.',
  });
  const first = await session.send(
    kind === 'context' ? CLAUDE_CONTEXT_PROBE_PROMPT : CLAUDE_PROBE_PROMPT,
    signal,
  );
  if (kind === undefined) return first;
  const followup = await session.send(CLAUDE_CONTEXT_PROBE_FOLLOWUP, signal);
  const answer = `First reply: ${first}\nFollow-up reply: ${followup}`;
  if (answer.length > 4096)
    throw new Error('Claude probe failed.', { cause: 'response-confirmation' });
  return answer;
}
