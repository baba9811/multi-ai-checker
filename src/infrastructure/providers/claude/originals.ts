import type { AttachmentPayload } from '../../../domains/attachments/model';
import { record, UUID, type ClaudeOriginals } from './session';
function fail(): never {
  throw new Error('Claude peer failed.');
}
export async function prepareClaudeOriginals(files: AttachmentPayload[]): Promise<ClaudeOriginals> {
  const attachments: Record<string, unknown>[] = [];
  const images: { file: File; width: number; height: number; uuid?: string }[] = [];
  const attachmentIds = new Map<string, string>();
  for (const payload of files) {
    const bytes = Uint8Array.from(atob(payload.base64), (value) => value.charCodeAt(0));
    const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
      .map((value) => value.toString(16).padStart(2, '0'))
      .join('');
    if (
      bytes.length !== payload.size ||
      hash !== payload.sha256 ||
      payload.name.normalize('NFC') !== payload.name
    )
      fail();
    if (payload.type === 'text/plain' && payload.name.toLowerCase().endsWith('.txt')) {
      if (bytes.length > 65536 || (bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191))
        fail();
      const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      if (!text.trim() || text.includes('\0')) fail();
      attachments.push({
        file_name: payload.name,
        file_type: payload.type,
        file_size: payload.size,
        extracted_content: text,
        origin: 'user_upload',
        kind: 'file',
      });
    } else if (payload.type === 'image/png' && payload.name.toLowerCase().endsWith('.png')) {
      if (
        bytes.length < 33 ||
        ![137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82].every(
          (value, index) => bytes[index] === value,
        )
      )
        fail();
      const view = new DataView(bytes.buffer);
      const width = view.getUint32(16),
        height = view.getUint32(20);
      if (!width || !height || width > 4096 || height > 4096 || width * height > 16777216) fail();
      const file = new File([bytes], payload.name, { type: payload.type });
      const decoded = await createImageBitmap(file);
      try {
        if (decoded.width !== width || decoded.height !== height) fail();
      } finally {
        decoded.close();
      }
      images.push({ file, width, height });
    } else fail();
  }
  function checkImage(
    value: Record<string, unknown>,
    image: (typeof images)[number],
    history: boolean,
  ) {
    if (
      value.type === 'error' ||
      value.success !== true ||
      value.file_kind !== 'image' ||
      value.file_name !== image.file.name ||
      typeof value.file_uuid !== 'string' ||
      !UUID.test(value.file_uuid) ||
      (image.uuid && value.file_uuid !== image.uuid) ||
      (history
        ? value.uuid !== value.file_uuid
        : value.uuid !== undefined && value.uuid !== value.file_uuid) ||
      (value.size_bytes !== undefined && value.size_bytes !== image.file.size)
    )
      fail();
    for (const key of ['preview_asset', 'thumbnail_asset']) {
      if (value[key] === undefined || value[key] === null) continue;
      const asset = record(value[key]);
      for (const [dimension, expected] of [
        ['image_width', image.width],
        ['image_height', image.height],
      ] as const) {
        const actual = asset[dimension];
        if (
          actual !== undefined &&
          (typeof actual !== 'number' ||
            !Number.isSafeInteger(actual) ||
            actual <= 0 ||
            (key === 'preview_asset' ? actual !== expected : actual > expected))
        )
          fail();
      }
    }
  }
  return {
    async prepare(org, model, request, json) {
      if (images.length && record(model.capabilities).mm_images !== true) fail();
      for (const image of images) {
        const form = new FormData();
        form.append('file', image.file);
        const receipt = record(await json(await request(`/api/${org}/upload`, form)));
        checkImage(receipt, image, false);
        if (images.some((other) => other.uuid === receipt.file_uuid)) fail();
        image.uuid = receipt.file_uuid as string;
      }
      return { attachments, files: images.map((image) => image.uuid!) };
    },
    verify(message, turn) {
      if (
        !Array.isArray(message.attachments) ||
        !Array.isArray(message.files) ||
        !Array.isArray(message.sync_sources) ||
        message.sync_sources.length ||
        message.attachments.length !== (turn ? 0 : attachments.length) ||
        message.files.length !== (turn ? 0 : images.length)
      )
        fail();
      if (turn) return { attachments: [], files: [] };
      const savedAttachments = message.attachments.map(record);
      const savedFiles = message.files.map(record);
      const ids = [
        ...savedAttachments.map((item) => item.id),
        ...savedFiles.map((item) => item.file_uuid),
      ];
      if (new Set(ids).size !== ids.length) fail();
      const stableAttachments = attachments.map((expected) => {
        const matches = savedAttachments.filter((item) => item.file_name === expected.file_name);
        if (matches.length !== 1) fail();
        const saved = matches[0]!;
        if (
          typeof saved.id !== 'string' ||
          !UUID.test(saved.id) ||
          (attachmentIds.has(String(expected.file_name)) &&
            attachmentIds.get(String(expected.file_name)) !== saved.id) ||
          ['file_name', 'file_type', 'file_size', 'extracted_content'].some(
            (key) => saved[key] !== expected[key],
          ) ||
          (saved.origin !== undefined && saved.origin !== 'user_upload') ||
          (saved.kind !== undefined && saved.kind !== 'file')
        )
          fail();
        attachmentIds.set(String(expected.file_name), saved.id);
        return {
          id: saved.id,
          file_name: saved.file_name,
          file_type: saved.file_type,
          file_size: saved.file_size,
          extracted_content: saved.extracted_content,
        };
      });
      const stableFiles = images.map((image) => {
        const matches = savedFiles.filter((item) => item.file_uuid === image.uuid);
        if (matches.length !== 1) fail();
        checkImage(matches[0]!, image, true);
        return {
          file_uuid: image.uuid,
          uuid: image.uuid,
          file_kind: 'image',
          file_name: image.file.name,
          success: true,
        };
      });
      return { attachments: stableAttachments, files: stableFiles };
    },
  };
}
