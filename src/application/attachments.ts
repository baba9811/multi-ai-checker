import {
  ATTACHMENT_LIMITS,
  AttachmentBatch,
  type Attachment,
  type AttachmentPayload,
} from '../domains/attachments/model';

export async function prepareAttachments(files: File[]): Promise<AttachmentPayload[]> {
  if (
    files.length > ATTACHMENT_LIMITS.count ||
    files.reduce((sum, file) => sum + file.size, 0) > ATTACHMENT_LIMITS.bytes
  )
    throw new Error('첨부파일은 최대 10개, 합계 20 MB까지 선택해주세요.');
  const payloads: AttachmentPayload[] = [];
  // Read sequentially so the memory ceiling follows the batch limit.
  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
    let binary = '';
    for (let i = 0; i < bytes.length; i += 8192)
      binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    payloads.push({
      name: file.name,
      type: file.type,
      size: bytes.length,
      sha256: [...hash].map((byte) => byte.toString(16).padStart(2, '0')).join(''),
      base64: btoa(binary),
    });
  }
  return AttachmentBatch.parse(payloads);
}
export function matchAttachments(expected: Attachment[], files: AttachmentPayload[]): boolean {
  return (
    expected.length === files.length &&
    expected.every((item) =>
      files.some(
        (file) => item.name === file.name && item.size === file.size && item.sha256 === file.sha256,
      ),
    )
  );
}
