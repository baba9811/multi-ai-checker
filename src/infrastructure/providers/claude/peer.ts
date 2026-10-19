import {
  Attachment,
  AttachmentBatch,
  ATTACHMENT_LIMITS,
  type AttachmentPayload,
} from '../../../domains/attachments/model';
import { LIMITS } from '../../../domains/crosscheck/model';
import { createClaudeSession } from './session';
import { prepareClaudeOriginals } from './originals';
const FAILURE = 'Claude peer failed.';
const fail = (): never => {
  throw new Error(FAILURE);
};
export function createClaudePeer(initialLabel: string) {
  const session = createClaudeSession(initialLabel, {
    answerLimit: LIMITS.answer,
    historyBytes: 8 * 1024 * 1024,
    strictRoot: true,
    failure: FAILURE,
  });
  const controller = new AbortController();
  let count = 0,
    terminal = false,
    busy = false;
  let manifest: string | undefined;
  return {
    async send(
      prompt: string,
      files: AttachmentPayload[],
      approved: Attachment[],
      stage: 'collect' | 'review',
      signal: AbortSignal,
    ): Promise<string> {
      if (terminal || busy) {
        terminal = true;
        controller.abort();
        throw new Error(FAILURE);
      }
      busy = true;
      try {
        if (
          signal.aborted ||
          !['/', '/new'].includes(new URL(location.href).pathname) ||
          typeof prompt !== 'string' ||
          !prompt.trim() ||
          prompt.length > LIMITS.prompt ||
          stage !== (count === 0 ? 'collect' : 'review') ||
          count >= 2
        )
          fail();
        const originals = AttachmentBatch.parse(files);
        const metadata = Attachment.array().max(ATTACHMENT_LIMITS.count).parse(approved);
        if (
          new Set(metadata.map((file) => file.name)).size !== metadata.length ||
          metadata.reduce((n, file) => n + file.size, 0) > ATTACHMENT_LIMITS.bytes
        )
          fail();
        const fingerprint = JSON.stringify(
          [...metadata].sort((a, b) => a.name.localeCompare(b.name)),
        );
        if (manifest !== undefined && fingerprint !== manifest) fail();
        if (!count || files.length) {
          if (
            metadata.length !== originals.length ||
            metadata.some(
              (item) =>
                !originals.some(
                  (file) =>
                    item.name === file.name &&
                    item.type === file.type &&
                    item.size === file.size &&
                    item.sha256 === file.sha256,
                ),
            )
          )
            fail();
        }
        const prepared =
          !count || originals.length ? await prepareClaudeOriginals(originals) : undefined;
        manifest = fingerprint;
        signal.addEventListener(
          'abort',
          () => {
            terminal = true;
            controller.abort();
          },
          { once: true },
        );
        const answer = await session.send(
          prompt,
          AbortSignal.any([signal, controller.signal]),
          !count && files.length ? prepared : undefined,
        );
        if (terminal) fail();
        count++;
        return answer;
      } catch {
        terminal = true;
        controller.abort();
        throw new Error(FAILURE);
      } finally {
        busy = false;
      }
    },
  };
}
