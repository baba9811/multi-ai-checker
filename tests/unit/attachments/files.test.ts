import { expect, it } from 'vitest';
import { AttachmentBatch, attachmentMetadata } from '../../../src/domains/attachments/model';
import { prepareAttachments, matchAttachments } from '../../../src/application/attachments';

it('keeps original bytes identical while persisting metadata only and requiring exact originals after reload', async () => {
  const files = await prepareAttachments([
    new File(['hello image review'], 'facts.txt', { type: 'text/plain' }),
  ]);
  expect(atob(files[0]!.base64)).toBe('hello image review');
  const metadata = files.map(attachmentMetadata);
  expect(JSON.stringify(metadata)).not.toContain('base64');
  expect(matchAttachments(metadata, files)).toBe(true);
  expect(matchAttachments(metadata, [])).toBe(false);
  expect(
    matchAttachments(metadata, await prepareAttachments([new File(['changed'], 'facts.txt')])),
  ).toBe(false);
  expect(() => AttachmentBatch.parse([...files, ...files])).toThrow();
});

it('rejects oversized batches before file reads and malformed encoded payloads', async () => {
  await expect(
    prepareAttachments([{ name: 'large.pdf', size: 21 * 1024 * 1024 } as File]),
  ).rejects.toThrow();
  const [file] = await prepareAttachments([new File(['safe'], 'safe.txt')]);
  expect(() => AttachmentBatch.parse([{ ...file, base64: '!bad' }])).toThrow();
  expect(() => AttachmentBatch.parse([{ ...file, size: 1 }])).toThrow();
});
