import { z } from 'zod';

export const ATTACHMENT_LIMITS = { count: 10, bytes: 20 * 1024 * 1024 } as const;
export const Attachment = z.object({
  name: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[^\x00-\x1f/\\]+$/),
  type: z.string().max(150),
  size: z.number().int().positive().max(ATTACHMENT_LIMITS.bytes),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
});
export type Attachment = z.infer<typeof Attachment>;
export const AttachmentPayload = Attachment.extend({
  base64: z
    .string()
    .max(Math.ceil(ATTACHMENT_LIMITS.bytes / 3) * 4)
    .regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/),
}).refine(
  (file) =>
    (file.base64.length / 4) * 3 -
      (file.base64.endsWith('==') ? 2 : file.base64.endsWith('=') ? 1 : 0) ===
    file.size,
  '파일 데이터 크기가 일치하지 않습니다.',
);
export type AttachmentPayload = z.infer<typeof AttachmentPayload>;
export const AttachmentBatch = z
  .array(AttachmentPayload)
  .max(ATTACHMENT_LIMITS.count)
  .refine(
    (files) => files.reduce((sum, file) => sum + file.size, 0) <= ATTACHMENT_LIMITS.bytes,
    '첨부파일은 합계 20 MB까지 선택해주세요.',
  )
  .refine(
    (files) => new Set(files.map((file) => file.name)).size === files.length,
    '같은 이름의 파일은 구분할 수 없습니다. 이름을 바꾼 뒤 다시 선택해주세요.',
  );
export function attachmentMetadata(file: AttachmentPayload): Attachment {
  return Attachment.parse(file);
}
