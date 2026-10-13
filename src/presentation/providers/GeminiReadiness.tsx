import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Platform } from '../../application/ports';
import type {
  GeminiReadinessRecord,
  GeminiReadinessResult,
} from '../../application/gemini-readiness';

export function GeminiReadiness({
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
  const [record, setRecord] = useState<GeminiReadinessRecord>();
  const [result, setResult] = useState<GeminiReadinessResult>();
  const [error, setError] = useState('');
  const [stopped, setStopped] = useState(false);
  const controller = useRef<AbortController | undefined>(undefined);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    void platform
      .readGeminiReadiness?.()
      .then((value) => {
        if (mounted.current) setRecord(value);
      })
      .catch(() => {
        if (mounted.current) setError('이전 준비 확인 상태를 읽지 못했습니다.');
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
  async function check() {
    if (!ready || disabled || controller.current || !platform.checkGeminiReadiness) return;
    const current = new AbortController();
    controller.current = current;
    setBusy(true);
    setError('');
    setStopped(false);
    setResult(undefined);
    setRecord(undefined);
    onWorking(true);
    try {
      const value = await platform.checkGeminiReadiness(current.signal);
      if (mounted.current) setResult(value);
    } catch (failure) {
      if (mounted.current && current.signal.aborted) setStopped(true);
      else if (mounted.current) {
        const cause = failure instanceof Error ? failure.cause : undefined;
        setError(
          cause === 'model'
            ? 'Gemini 모델 메뉴를 읽지 못했습니다. 사이트에서 모델을 확인하세요. 요청은 보내지 않았습니다.'
            : cause === 'page'
              ? 'Gemini 페이지가 준비되지 않았습니다. 로그인·로딩 상태를 확인하세요. 요청은 보내지 않았습니다.'
              : 'Gemini 준비 상태를 확인하지 못했습니다. 요청은 보내지 않았습니다.',
        );
      }
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
      <summary>
        Gemini 준비 확인 <ChevronDown size={13} />
      </summary>
      <p className="hint">
        별도 Gemini 탭에서 현재 모델과 보안 검사 상태만 읽습니다. 기존 대화와 파일은 보내지
        않습니다.
      </p>
      <p className="hint">요청을 보내거나 응답을 받은 시험은 아닙니다.</p>
      <button
        className="secondary"
        disabled={!ready || disabled || busy}
        onClick={() => void check()}
      >
        Gemini 준비 상태 확인
      </button>
      {busy && (
        <>
          <button className="text-button" onClick={() => controller.current?.abort()}>
            확인 중단
          </button>
          <p className="hint" role="status">
            Gemini 준비 상태를 확인하고 있습니다.
          </p>
        </>
      )}
      {result && (
        <>
          <p>선택된 모델: {result.model}</p>
          <p role="status">
            {result.protection === 'enabled'
              ? '보안 검사 필요: 백그라운드 전송 준비가 완료되지 않았습니다.'
              : result.protection === 'unknown'
                ? '보안 검사 상태를 확인하지 못해 백그라운드 전송을 진행하지 않습니다.'
                : '보안 검사 조건을 확인했습니다. 실제 응답과 대화 연결은 아직 검증하지 않았습니다.'}
          </p>
        </>
      )}
      {record?.status === 'done' && (
        <p className="hint">지난 준비 확인은 완료됐습니다. 응답 성공을 확인한 상태는 아닙니다.</p>
      )}
      {record?.status === 'uncertain' && (
        <p className="hint" role="status">
          지난 준비 확인이 중단됐습니다. 자동으로 다시 시작하지 않았으며 요청도 보내지 않았습니다.
        </p>
      )}
      {stopped && (
        <p className="hint" role="status">
          Gemini 준비 확인을 중단했습니다. 요청은 보내지 않았습니다.
        </p>
      )}
      {error && (
        <p className="error" role="status">
          {error}
        </p>
      )}
    </details>
  );
}
