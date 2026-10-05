import type { AttachmentPayload } from '../../domains/attachments/model';
import type { ProviderId } from '../../domains/providers/model';
import { visible } from './dom-utils';

function region(provider: ProviderId, editor: HTMLElement) {
  return editor.closest(
    provider === 'chatgpt'
      ? 'form'
      : provider === 'claude'
        ? '[data-tap-focuses-field]'
        : '[xapfileselectordropzone]',
  );
}
function tiles(provider: ProviderId, editor: HTMLElement) {
  const root = region(provider, editor);
  return [
    ...(root?.querySelectorAll(
      provider === 'chatgpt'
        ? '[data-composer-attachments] button[aria-label^="Remove "]'
        : provider === 'claude'
          ? '[data-testid="file-thumbnail"] button[data-cds-attachment-remove]'
          : '.gem-attachment-content',
    ) ?? []),
  ];
}
export function hasAttachments(provider: ProviderId, editor: HTMLElement) {
  const root = region(provider, editor);
  return (
    tiles(provider, editor).length > 0 ||
    !!root?.querySelector(
      provider === 'chatgpt'
        ? '[data-composer-attachments][data-visible-attachments]'
        : provider === 'claude'
          ? '[data-testid="file-thumbnail"]'
          : '.gem-attachment-content',
    )
  );
}
function expectedName(provider: ProviderId, file: AttachmentPayload) {
  // Gemini's observed document chip drops the extension. Reject colliding stems below.
  return provider === 'gemini' && !file.type.startsWith('image/')
    ? file.name.replace(/\.[^.]+$/, '')
    : file.name;
}
function uploadFailed(root: Element) {
  if (
    [
      ...root.querySelectorAll(
        '[aria-invalid="true"], [data-state="error"], [data-status="error"]',
      ),
    ].some(visible)
  )
    return true;
  return [...document.querySelectorAll('[role="alert"]')]
    .filter(visible)
    .some((alert) =>
      /fail|error|couldn.t|unsupported|unable|too large|limit|실패|오류|지원하지|한도|초과/i.test(
        alert.innerText,
      ),
    );
}
export function attachmentsReady(
  provider: ProviderId,
  editor: HTMLElement,
  files: AttachmentPayload[],
) {
  const root = region(provider, editor);
  if (!root || !editor.isConnected) return false;
  const current = tiles(provider, editor);
  const names = current
    .map((tile) =>
      (provider === 'gemini'
        ? tile.querySelector('button[aria-label^="close "]')?.getAttribute('aria-label')
        : tile.getAttribute('aria-label')
      )?.replace(/^(Remove |close )/, ''),
    )
    .filter(Boolean);
  const imageCount =
    provider === 'gemini'
      ? current.filter((tile) => {
          const image = tile
            .closest('mat-basic-chip')
            ?.querySelector<HTMLImageElement>('img.gem-attachment-style-img');
          return image?.complete && image.naturalWidth > 0;
        }).length
      : 0;
  return (
    !uploadFailed(root) &&
    current.length === files.length &&
    (provider !== 'gemini' ||
      imageCount === files.filter((file) => file.type.startsWith('image/')).length) &&
    files
      .filter((file) => provider !== 'gemini' || !file.type.startsWith('image/'))
      .every((file) => names.includes(expectedName(provider, file))) &&
    ![
      ...root.querySelectorAll('[role="progressbar"], progress, [aria-busy="true"], .animate-spin'),
    ].some(visible)
  );
}
/** User file edits must invalidate the entire operation, including hashing and prompt settling. */
export function watchAttachmentEdits(provider: ProviderId, editor: HTMLElement) {
  const root = region(provider, editor);
  let edited = false;
  let ownChange = false;
  const changed = (event: Event) => {
    if (ownChange) return;
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === 'file') edited = true;
    if (target instanceof Element && root?.contains(target)) {
      if (
        event.type === 'drop' ||
        (event instanceof ClipboardEvent && event.clipboardData?.files.length)
      )
        edited = true;
      if (
        event.type === 'click' &&
        target.closest(
          'button[aria-label^="Remove "],button[data-cds-attachment-remove],.gem-attachment-close-button',
        )
      )
        edited = true;
    }
  };
  const events = ['change', 'input', 'drop', 'paste', 'click'];
  events.forEach((type) => document.addEventListener(type, changed, true));
  return {
    valid: () => !edited,
    change(input: HTMLInputElement, files: FileList) {
      ownChange = true;
      try {
        input.files = files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      } finally {
        ownChange = false;
      }
    },
    close() {
      events.forEach((type) => document.removeEventListener(type, changed, true));
    },
  };
}
function supported(input: HTMLInputElement, file: File) {
  const accept = input.accept
    .toLowerCase()
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return (
    !accept.length ||
    accept.some((value) =>
      value.startsWith('.')
        ? file.name.toLowerCase().endsWith(value)
        : value.endsWith('/*')
          ? file.type.startsWith(value.slice(0, -1))
          : file.type === value,
    )
  );
}
async function inputFor(provider: ProviderId, files: File[], valid: () => boolean) {
  const selector =
    provider === 'chatgpt'
      ? 'input[type="file"][aria-label="Attach files"]'
      : provider === 'claude'
        ? 'input[type="file"][data-testid="file-upload"]'
        : files[0]!.type.startsWith('image/')
          ? 'uploader input[type="file"][accept="image/*"]'
          : 'images-files-uploader > input[type="file"]';
  if (provider === 'gemini' && !document.querySelector(selector)) {
    const buttons = [
      ...document.querySelectorAll<HTMLButtonElement>(
        'button[aria-label="업로드 및 도구"],button[aria-label="Upload and tools"]',
      ),
    ].filter(visible);
    if (buttons.length !== 1 || !valid())
      throw new Error('파일 업로드 메뉴를 안전하게 찾지 못했습니다.');
    buttons[0]!.click();
  }
  const deadline = Date.now() + 5000;
  while (!document.querySelector(selector) && valid() && Date.now() < deadline)
    await new Promise((resolve) => setTimeout(resolve, 100));
  const inputs = [...document.querySelectorAll<HTMLInputElement>(selector)];
  if (inputs.length !== 1 || inputs[0]!.disabled)
    throw new Error('파일 업로드 입력란을 찾지 못했습니다. AI 탭에서 확인해주세요.');
  if (files.some((file) => !supported(inputs[0]!, file)))
    throw new Error(
      '이 AI의 업로드 입력란이 선택한 파일 형식을 지원하지 않습니다. 파일을 누락하지 않고 중단했습니다.',
    );
  return inputs[0]!;
}
export async function uploadAttachments(
  provider: ProviderId,
  editor: HTMLElement,
  payloads: AttachmentPayload[],
  valid: () => boolean,
  guard: ReturnType<typeof watchAttachmentEdits>,
) {
  if (!region(provider, editor))
    throw new Error('첨부파일 영역을 확인하지 못했습니다. 자동 전송을 중단했습니다.');
  if (hasAttachments(provider, editor))
    throw new Error('AI 입력란에 기존 첨부파일이 있습니다. 먼저 직접 정리해주세요.');
  if (new Set(payloads.map((file) => expectedName(provider, file))).size !== payloads.length)
    throw new Error(
      '이 AI 화면에서 파일 이름을 구분할 수 없습니다. 서로 다른 이름으로 다시 선택해주세요.',
    );
  const files: File[] = [];
  for (const payload of payloads) {
    const bytes = Uint8Array.from(atob(payload.base64), (value) => value.charCodeAt(0));
    const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
      .map((value) => value.toString(16).padStart(2, '0'))
      .join('');
    if (hash !== payload.sha256 || bytes.length !== payload.size)
      throw new Error('첨부파일 원본 검증에 실패했습니다. 다시 선택해주세요.');
    files.push(new File([bytes], payload.name, { type: payload.type }));
  }
  const groups =
    provider === 'gemini'
      ? [
          files.filter((file) => !file.type.startsWith('image/')),
          files.filter((file) => file.type.startsWith('image/')),
        ].filter((group) => group.length)
      : [files];
  const uploaded: AttachmentPayload[] = [];
  for (const group of groups) {
    const input = await inputFor(provider, group, valid);
    if (!valid()) throw new Error('첨부파일 업로드를 중단했습니다.');
    const transfer = new DataTransfer();
    group.forEach((file) => transfer.items.add(file));
    guard.change(input, transfer.files);
    uploaded.push(
      ...payloads.filter((payload) => group.some((file) => file.name === payload.name)),
    );
    const deadline = Date.now() + 60000;
    let readySince = 0;
    while (Date.now() < deadline) {
      if (!valid())
        throw new Error('첨부파일 업로드를 중단했습니다. AI 탭에 파일이 남아 있을 수 있습니다.');
      if (uploadFailed(region(provider, editor)!))
        throw new Error(
          'AI 사이트가 첨부파일 업로드 오류를 표시했습니다. 질문은 보내지 않았습니다.',
        );
      if (attachmentsReady(provider, editor, uploaded)) {
        readySince ||= Date.now();
        if (Date.now() - readySince >= 1000) break;
      } else readySince = 0;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    if (
      !attachmentsReady(provider, editor, uploaded) ||
      !readySince ||
      Date.now() - readySince < 1000
    )
      throw new Error(
        '첨부파일 업로드 완료를 확인하지 못했습니다. 질문은 보내지 않았습니다. AI 탭의 파일 상태를 확인해주세요.',
      );
  }
  // Gemini images have no filename label. Keep the exact confirmed chips and image sources.
  const receipt = tiles(provider, editor).map((tile) => ({
    tile,
    image: tile.closest('mat-basic-chip')?.querySelector('img')?.getAttribute('src'),
  }));
  return () =>
    attachmentsReady(provider, editor, payloads) &&
    tiles(provider, editor).every(
      (tile, index) =>
        tile === receipt[index]?.tile &&
        tile.closest('mat-basic-chip')?.querySelector('img')?.getAttribute('src') ===
          receipt[index]?.image,
    );
}
