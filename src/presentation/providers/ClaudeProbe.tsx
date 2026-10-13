import { useEffect, useRef, useState } from 'react';
import type { Platform } from '../../application/ports';
import {
  CLAUDE_PROBE_PROMPT,
  CLAUDE_CONTEXT_PROBE_PROMPT,
  CLAUDE_CONTEXT_PROBE_FOLLOWUP,
  type ClaudeProbeKind,
  type ClaudeProbeRecord,
} from '../../application/claude-probe';

export function ClaudeProbe({
  platform,
  disabled,
  onWorking,
}: {
  platform: Platform;
  disabled: boolean;
  onWorking: (value: boolean) => void;
}) {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [record, setRecord] = useState<ClaudeProbeRecord>();
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [kind, setKind] = useState<ClaudeProbeKind>();
  const controller = useRef<AbortController | undefined>(undefined);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    void platform
      .readClaudeProbe?.()
      .then((value) => {
        if (mounted.current && !controller.current) setRecord(value);
      })
      .catch(() => {
        if (mounted.current) setError('이전 시험 상태를 읽지 못했습니다.');
      })
      .finally(() => {
        if (mounted.current) setReady(true);
      });
    return () => {
      mounted.current = false;
      if (controller.current) {
        controller.current.abort();
        onWorking(false);
      }
    };
  }, [platform]);
  async function start(nextKind?: ClaudeProbeKind) {
    if (!ready || disabled || controller.current || !platform.startClaudeProbe) return;
    const current = new AbortController();
    controller.current = current;
    setBusy(true);
    setAnswer('');
    setError('');
    setRecord(undefined);
    setKind(nextKind);
    onWorking(true);
    try {
      const result = await platform.startClaudeProbe(current.signal, nextKind);
      if (mounted.current) setAnswer(result);
    } catch (failure) {
      if (mounted.current)
        setError(
          failure instanceof Error
            ? failure.message
            : '완료를 확인하지 못했습니다. 자동 재시도하지 않습니다.',
        );
    } finally {
      controller.current = undefined;
      if (mounted.current) {
        setBusy(false);
        onWorking(false);
      }
    }
  }
  return (
    <details className="connection-detail">
      <summary>백그라운드 연결 시험</summary>
      <p className="hint">
        Claude에 별도 테스트 대화를 만들고 짧은 요청 1회를 보냅니다. 탭을 전환하지 않는 연결 방식의
        시험입니다.
      </p>
      <p className="hint">
        테스트 요청: <code>{CLAUDE_PROBE_PROMPT}</code>
      </p>
      <button
        className="secondary"
        disabled={!ready || disabled || busy}
        onClick={() => void start()}
      >
        Claude 연결 시험 시작
      </button>
      <p className="hint">
        문맥 시험은 시험용 질문·답변 2쌍을 보내고, 같은 대화에서 후속 답변까지 확인합니다. 요청
        2회이며 사용자의 기존 대화와 파일은 보내지 않습니다.
      </p>
      <details>
        <summary>시험에 보내는 내용</summary>
        <pre>{CLAUDE_CONTEXT_PROBE_PROMPT}</pre>
        <pre>{CLAUDE_CONTEXT_PROBE_FOLLOWUP}</pre>
      </details>
      <button
        className="secondary"
        disabled={!ready || disabled || busy}
        onClick={() => void start('context')}
      >
        문맥·후속 응답 시험 시작
      </button>
      {busy && (
        <button className="text-button" onClick={() => controller.current?.abort()}>
          시험 중단
        </button>
      )}
      {busy && (
        <p className="hint" role="status">
          응답 완료를 확인하고 있습니다.
        </p>
      )}
      {answer && (
        <>
          <p role="status">{kind === 'context' ? '문맥·후속 응답 시험 완료' : '연결 시험 완료'}</p>
          <p>{answer}</p>
        </>
      )}
      {record?.status === 'done' && (
        <p className="hint">지난 시험은 완료됐습니다. 현재 연결 상태는 새 시험으로 확인하세요.</p>
      )}
      {record?.status === 'uncertain' && (
        <p className="hint" role="status">
          지난 요청의 완료 여부를 확인하지 못했습니다. 자동 재전송하지 않았습니다. Claude에서 먼저
          확인하세요.
        </p>
      )}
      {error && (
        <p className="error" role="status">
          {error}
        </p>
      )}
      <p className="hint">
        현재는 시험용 텍스트만 보냅니다. 기존 대화 가져오기·첨부·최종 반환의 새 방식은 아직 검증
        중입니다.
      </p>
    </details>
  );
}
