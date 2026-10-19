import {
  ClaudeProbeProgress,
  ClaudeProbeRecord,
  type ClaudeProbeReason,
  type ClaudeProbeKind,
} from '../../application/claude-probe';
import { LIMITS } from '../../domains/crosscheck/model';
import { providers, type Binding } from '../../domains/providers/model';
import { prepareClaudeProbe, rpc } from './provider-client';

const storageKey = 'crosscheck.claude-probe.v1';
let running = false;
const failure =
  '연결 시험을 완료하지 못했습니다. Claude의 로그인·모델·제한을 확인하세요. 전송됐을 수 있는 요청은 자동 재시도하지 않습니다.';
const reasons: Record<ClaudeProbeReason, string> = {
  page: '시험 페이지가 준비되지 않아 요청하지 않았습니다.',
  model: '현재 선택된 모델을 확인하지 못해 요청하지 않았습니다.',
  'model-menu': 'Claude에 열린 메뉴가 남아 있어 요청하지 않았습니다.',
  'model-trigger': 'Claude 모델 선택 버튼이 준비되지 않아 요청하지 않았습니다.',
  account: 'Claude 로그인·계정 정보를 확인하지 못해 요청하지 않았습니다.',
  'account-selection': '사용할 Claude 계정을 하나로 확인하지 못해 요청하지 않았습니다.',
  access: 'Claude 접근이 거부됐습니다. 사이트에서 로그인·접근 상태를 확인하세요.',
  catalog: '계정의 모델 목록과 현재 선택을 확인하지 못해 요청하지 않았습니다.',
  'model-confirmation': '모델 선택을 다시 확인하지 못해 시험을 중단했습니다.',
  send: 'Claude가 시험 요청을 수락했는지 확인하지 못했습니다.',
  response: '시험 응답의 완성을 확인하지 못했습니다.',
  'response-event': 'Claude 응답 이벤트의 형식을 확인하지 못했습니다.',
  'response-metadata': 'Claude 응답의 부가 이벤트 형식을 확인하지 못했습니다.',
  'response-role': 'Claude 응답의 작성자 표시를 확인하지 못했습니다.',
  'response-binding': '시험 요청과 Claude 응답의 연결을 확인하지 못했습니다.',
  'response-block': 'Claude 응답 내용의 형식을 확인하지 못했습니다.',
  'response-terminal': 'Claude 응답의 완료 표시를 확인하지 못했습니다.',
  'response-confirmation': '시험 대화와 최종 응답이 일치하는지 확인하지 못했습니다.',
  'response-context': '시험 대화의 문맥을 기억하는 답변인지 확인하지 못했습니다.',
  interrupted: '연결 시험이 중단됐습니다.',
};
export async function readClaudeProbe(): Promise<ClaudeProbeRecord | undefined> {
  const raw = (await chrome.storage.session.get(storageKey))[storageKey];
  if (!raw) return;
  const record = ClaudeProbeRecord.parse(raw);
  return record.status === 'pending' ? { ...record, status: 'uncertain' } : record;
}
export async function startClaudeProbe(
  signal: AbortSignal,
  kind?: ClaudeProbeKind,
): Promise<string> {
  if (running) throw new Error('이미 연결 시험이 진행 중입니다.');
  running = true;
  const id = crypto.randomUUID();
  const intent = { id, ...(kind ? { kind } : {}) };
  let target: Binding | undefined;
  let persisted = false;
  let reason: ClaudeProbeReason | undefined;
  const cancel = () => {
    if (target) void rpc(target.tabId, { type: 'cancelClaudeProbe', id }).catch(() => {});
  };
  try {
    // Request permission before the first await so the initiating gesture is preserved.
    const access = chrome.permissions.request({ origins: [`${providers.claude.origin}/*`] });
    if (!(await access)) throw new Error(failure);
    signal.throwIfAborted();
    await chrome.storage.session.set({ [storageKey]: { ...intent, status: 'pending' } });
    persisted = true;
    signal.throwIfAborted();
    target = await prepareClaudeProbe(signal);
    signal.throwIfAborted();
    signal.addEventListener('abort', cancel, { once: true });
    await rpc(target.tabId, {
      type: 'startClaudeProbe',
      id,
      ...(kind ? { kind } : {}),
      documentId: target.documentId,
      url: target.url,
    });
    const deadline = Date.now() + LIMITS.timeoutMs;
    while (Date.now() < deadline) {
      signal.throwIfAborted();
      const progress = ClaudeProbeProgress.parse(
        await rpc(target.tabId, { type: 'pollClaudeProbe', id }),
      );
      signal.throwIfAborted();
      if (progress.status === 'done') {
        if (!progress.answer.trim()) throw new Error(failure);
        await chrome.storage.session.set({ [storageKey]: { ...intent, status: 'done' } });
        signal.throwIfAborted();
        return progress.answer;
      }
      if (progress.status === 'error') {
        reason = progress.reason;
        throw new Error(failure);
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    throw new Error(failure);
  } catch {
    cancel();
    if (persisted)
      await chrome.storage.session
        .set({ [storageKey]: { ...intent, status: 'uncertain' } })
        .catch(() => {});
    throw new Error(reason ? `${reasons[reason]} 자동 재시도하지 않습니다.` : failure);
  } finally {
    signal.removeEventListener('abort', cancel);
    running = false;
  }
}
