import { useEffect, useRef, useState } from 'react';
import type { Platform } from '../../application/ports';
import { CLAUDE_PROBE_PROMPT, type ClaudeProbeRecord } from '../../application/claude-probe';

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
  async function start() {
    if (!ready || disabled || controller.current || !platform.startClaudeProbe) return;
    const current = new AbortController();
    controller.current = current;
    setBusy(true);
    setAnswer('');
    setError('');
    setRecord(undefined);
    onWorking(true);
    try {
      const result = await platform.startClaudeProbe(current.signal);
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
          <p role="status">연결 시험 완료</p>
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
        현재는 짧은 텍스트만 시험합니다. 전체 대화·첨부·최종 반환의 새 방식은 아직 검증 중입니다.
      </p>
    </details>
  );
}
