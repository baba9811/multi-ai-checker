import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Platform } from '../../application/ports';
import type {
  GeminiHeaderObservationOutcome,
  GeminiHeaderObservationResult,
  GeminiReadinessRecord,
  GeminiReadinessResult,
  GeminiClientCapability,
} from '../../application/gemini-readiness';

const protectionReasons = {
  'bootstrap-missing': '페이지 초기 설정을 찾지 못했습니다.',
  'bootstrap-format': '페이지 초기 설정 형식을 지원하지 않습니다.',
  'bootstrap-limit': '페이지 초기 설정이 읽기 한도를 초과했습니다.',
  'configuration-format': '보안 설정의 데이터 형식을 지원하지 않습니다.',
  'flag-missing': '필요한 보안 설정이 명시돼 있지 않습니다.',
  'flag-ambiguous': '필요한 보안 설정이 중복되어 구분할 수 없습니다.',
  'flag-format': '필요한 보안 설정 값을 확인할 수 없습니다.',
} satisfies Record<NonNullable<GeminiReadinessResult['protectionReason']>, string>;
const modelErrors = {
  model:
    'Gemini 모델 메뉴를 읽지 못했습니다. 사이트에서 모델을 확인하세요. 요청은 보내지 않았습니다.',
  'model-trigger': 'Gemini 모델 선택 버튼을 확인하지 못했습니다. 요청은 보내지 않았습니다.',
  'model-menu':
    'Gemini 모델 메뉴의 연결·열린 상태를 확인하지 못했습니다. 요청은 보내지 않았습니다.',
  'model-selection': 'Gemini에서 선택된 모델을 구분하지 못했습니다. 요청은 보내지 않았습니다.',
  'model-cleanup': 'Gemini 모델 메뉴가 닫혔는지 확인하지 못했습니다. 요청은 보내지 않았습니다.',
  'model-confirmation':
    '마무리 단계에서 Gemini 모델 재확인이 실패했습니다. 요청은 보내지 않았습니다.',
};
const clientReasons = {
  page: '준비 확인에 사용한 페이지가 변경됐습니다.',
  owner: '모델 선택 영역의 연결을 확인하지 못했습니다.',
  'owner-context': '모델 영역의 페이지 연결 정보를 확인하지 못했습니다.',
  'owner-view': '모델 영역의 현재 연결을 확인하지 못했습니다.',
  'owner-view-registry': '모델 영역의 현재 연결을 확인하지 못했습니다. 확인 코드 V1.',
  'owner-view-missing': '모델 영역의 현재 연결을 확인하지 못했습니다. 확인 코드 V2.',
  'owner-view-shape': '모델 영역의 현재 연결을 확인하지 못했습니다. 확인 코드 V3.',
  'owner-view-id': '모델 영역의 현재 연결을 확인하지 못했습니다. 확인 코드 V4.',
  'owner-view-metadata': '모델 영역의 현재 연결을 확인하지 못했습니다. 확인 코드 V5.',
  'owner-view-flags': '모델 영역의 현재 연결을 확인하지 못했습니다. 확인 코드 V6.',
  'owner-slot': '모델 영역의 소유 관계를 확인하지 못했습니다.',
  'owner-declaration-1': '모델 버튼의 첫 번째 화면 연결을 확인하지 못했습니다.',
  'owner-declaration-2': '모델 버튼의 두 번째 화면 연결을 확인하지 못했습니다.',
  'owner-declaration-3': '모델 버튼과 모델 영역의 연결을 확인하지 못했습니다.',
  'owner-declaration-3-node': '모델 영역의 화면 구성을 확인하지 못했습니다.',
  'owner-declaration-3-template':
    '모델 버튼이 현재 모델 화면에 연결되어 있는지 확인하지 못했습니다.',
  'owner-declaration-3-binding': '모델 버튼과 화면의 연결이 일치하지 않아 확인을 중단했습니다.',
  'owner-component': '모델 영역을 확인하는 마지막 단계에서 멈췄습니다.',
  'runtime-shape': '현재 웹 클라이언트의 구조를 지원하지 않습니다.',
  'service-identity': '실제로 사용 중인 웹 클라이언트를 확인하지 못했습니다.',
  protection: '정상 클라이언트의 추가 보안 검사 상태를 확인하지 못했습니다.',
  'transport-session': '서비스 연결이 준비됐는지 확인하지 못했습니다.',
  'transport-api': '응답을 받는 연결 경로를 확인하지 못했습니다.',
  'transport-route': '세션 연결 경로의 설정을 확인하지 못했습니다.',
  'transport-sse':
    '스트리밍 응답 경로가 선택돼 있습니다. 이 시험에서는 해당 경로를 지원하지 않습니다.',
  'transport-rpc': '기본 응답 경로가 선택돼 있습니다. 이 시험에서는 해당 경로를 지원하지 않습니다.',
  prewarm: '이 시험에 필요한 새 전송 연결 상태를 확인하지 못했습니다.',
  hook: '전송 경계를 확인하는 데 필요한 조건을 확인하지 못했습니다.',
  'transport-webchannel':
    '웹 채널 경로가 선택돼 있습니다. 이 시험에서는 해당 경로를 지원하지 않습니다.',
} satisfies Record<Extract<GeminiClientCapability, { status: 'unsupported' }>['reason'], string>;

const observationMessages = {
  'ready-early':
    '비활성 탭에서 초기 구간에 버튼 구조를 관찰했습니다. 요청·응답 성공은 확인하지 않았습니다.',
  'ready-late':
    '비활성 탭에서 초기 제한 이후의 준비되지 않은 구조와 이후 준비된 구조를 관찰했습니다. 정확한 준비 시점과 원인은 확인하지 않았습니다.',
  'not-observed':
    '관찰 구간에서 준비된 버튼 구조를 보지 못했습니다. 계속 없었거나 지원되지 않는다는 뜻은 아닙니다.',
  inconclusive: '실행 간격 때문에 준비 시점을 판정할 증거가 부족합니다.',
  'visibility-changed': '페이지 표시 상태가 바뀌어 관찰을 중단했습니다.',
  page: '관찰 페이지의 연결이 바뀌어 중단했습니다.',
  'not-empty': '관찰 페이지가 비어 있지 않아 중단했습니다.',
  unsupported: '이 페이지의 버튼 구조를 관찰하지 못했습니다.',
  interrupted: '버튼 관찰을 중단했습니다. 요청은 보내지 않았습니다.',
} satisfies Record<GeminiHeaderObservationOutcome, string>;

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
  const [observing, setObserving] = useState(false);
  const [observation, setObservation] = useState<GeminiHeaderObservationResult>();
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
  async function check(observe = false) {
    if (
      !ready ||
      disabled ||
      controller.current ||
      (observe ? !platform.observeGeminiHeaderReadiness : !platform.checkGeminiReadiness)
    )
      return;
    const current = new AbortController();
    controller.current = current;
    setBusy(true);
    setObserving(observe);
    setObservation(undefined);
    setError('');
    setStopped(false);
    setResult(undefined);
    setRecord(undefined);
    onWorking(true);
    try {
      if (observe) {
        const value = await platform.observeGeminiHeaderReadiness!(current.signal);
        if (mounted.current) {
          if (current.signal.aborted) setObservation({ ...value, outcome: 'interrupted' });
          else setObservation(value);
        }
      } else {
        const value = await platform.checkGeminiReadiness!(current.signal);
        if (mounted.current && !current.signal.aborted) setResult(value);
      }
    } catch (failure) {
      if (mounted.current && current.signal.aborted) setStopped(true);
      else if (mounted.current) {
        const cause = failure instanceof Error ? failure.cause : undefined;
        if (observe) {
          setError(
            'Gemini 버튼을 관찰하지 못했습니다. Gemini 연결 권한과 페이지를 확인하세요. 요청은 보내지 않았습니다.',
          );
          return;
        }
        setError(
          typeof cause === 'string' && Object.hasOwn(modelErrors, cause)
            ? modelErrors[cause as keyof typeof modelErrors]
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
        별도 Gemini 탭에서 현재 모델과 웹 클라이언트 준비 상태를 읽습니다. 기존 대화와 파일은 보내지
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
      {platform.observeGeminiHeaderReadiness && (
        <>
          <p className="hint">
            새 비활성 탭을 엽니다. 페이지와 입력란 준비 후 최대 15초 동안 버튼 구조만 확인합니다.
            메뉴를 열거나 요청을 보내지 않습니다.
          </p>
          <button
            className="secondary"
            disabled={!ready || disabled || busy}
            onClick={() => void check(true)}
          >
            Gemini 버튼 준비만 관찰
          </button>
        </>
      )}
      {observation && (
        <p className="hint" role="status">
          {observationMessages[observation.outcome]}{' '}
          {observation.visibility === 'unobserved'
            ? '초기 페이지 표시 상태를 관찰하지 못했습니다.'
            : !['ready-early', 'ready-late', 'not-observed'].includes(observation.outcome)
              ? observation.visibility === 'hidden'
                ? '초기 페이지는 숨김 상태였습니다.'
                : '초기 페이지는 표시 상태였습니다.'
              : observation.visibility === 'hidden'
                ? '관찰 페이지는 계속 숨김 상태였습니다.'
                : '관찰 페이지는 계속 표시 상태였습니다. 숨김 상태의 증거는 아닙니다.'}{' '}
          {observation.retirement === 'closed'
            ? '관찰 탭을 닫았습니다.'
            : '관찰 탭을 유지했습니다. 탭에서 확인하세요.'}
        </p>
      )}
      {busy && (
        <>
          <button className="text-button" onClick={() => controller.current?.abort()}>
            확인 중단
          </button>
          <p className="hint" role="status">
            {observing
              ? 'Gemini 버튼 구조만 관찰하고 있습니다.'
              : 'Gemini 준비 상태를 확인하고 있습니다.'}
          </p>
        </>
      )}
      {result && (
        <>
          <p>선택된 모델: {result.model}</p>
          <p role="status">
            {result.protection === 'enabled'
              ? '페이지 설정에 추가 보안 검사가 켜져 있습니다. 백그라운드 전송은 아직 준비되지 않았습니다.'
              : result.protection === 'unknown'
                ? '보안 검사 상태를 확인하지 못해 백그라운드 전송을 진행하지 않습니다.'
                : '페이지의 보안 설정값을 읽었습니다. 실제 전송 조건과 응답은 아직 검증하지 않았습니다.'}
          </p>
          {result.protection === 'unknown' && result.protectionReason && (
            <p className="hint">{protectionReasons[result.protectionReason]}</p>
          )}
          <p role="status">
            {result.client.status === 'candidate'
              ? '웹 클라이언트의 준비 조건을 확인했습니다. 요청·응답은 아직 검증하지 않았습니다.'
              : '이 시험에서 웹 클라이언트의 전송 조건을 확인하지 못했습니다.'}
          </p>
          {result.client.status === 'unsupported' && (
            <p className="hint">{clientReasons[result.client.reason]}</p>
          )}
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
          {observing
            ? '버튼 관찰을 중단했습니다. 요청은 보내지 않았습니다.'
            : 'Gemini 준비 확인을 중단했습니다. 요청은 보내지 않았습니다.'}
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
