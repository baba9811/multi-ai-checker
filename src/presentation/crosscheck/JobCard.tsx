import { ProviderLogo } from '../providers/ProviderLogo';
import { useState } from 'react';
import { ChevronDown, Copy } from 'lucide-react';
import { LIMITS, type Job } from '../../domains/crosscheck/model';
import { providers } from '../../domains/providers/model';

export function JobCard({
  job,
  locked,
  onManual,
  onNotice,
}: {
  job: Job;
  locked: boolean;
  onManual: (answer: string) => void;
  onNotice: (message: string) => void;
}) {
  const [answer, setAnswer] = useState('');
  const [manual, setManual] = useState(false);
  const names = {
    ready: '전송 대기',
    sending: '답변 기다리는 중',
    done: '수집 완료',
    error: '확인 필요',
    interrupted: '수집 중단',
  };
  return (
    <article className={`card job ${job.status}`}>
      <div className="section-title">
        <h3>
          <ProviderLogo provider={job.provider} />
          {providers[job.provider].name}
        </h3>
        <span className={`job-status ${job.status}`}>
          {job.status === 'sending' && <span className="pulse" />}
          {names[job.status]}
        </span>
      </div>
      {job.answer ? (
        <>
          {job.stage === 'synthesize' ? (
            <pre className="answer">{job.answer}</pre>
          ) : (
            <details className="answer-details">
              <summary>
                답변 보기 <ChevronDown size={14} />
              </summary>
              <pre className="answer">{job.answer}</pre>
            </details>
          )}
          <span className="hint">
            {job.method === 'manual' ? '직접 붙여넣은 답변' : '웹에서 가져온 답변'}
          </span>
        </>
      ) : (
        <>
          {job.error && <p className="error">{job.error}</p>}
          <div className="button-row">
            <button
              className="text-button"
              disabled={locked}
              onClick={() => {
                void navigator.clipboard
                  .writeText(job.prompt)
                  .then(() =>
                    onNotice('프롬프트를 복사했습니다. 해당 AI의 웹 입력란에 붙여넣어 보내세요.'),
                  )
                  .catch(() =>
                    onNotice(
                      '클립보드에 접근할 수 없습니다. 아래 프롬프트를 펼쳐 직접 복사하세요.',
                    ),
                  );
              }}
            >
              <Copy size={13} /> 질문 복사
            </button>
            <button className="text-button" disabled={locked} onClick={() => setManual(!manual)}>
              답변 붙여넣기 <ChevronDown size={13} />
            </button>
          </div>
          <details className="prompt-details">
            <summary>프롬프트 보기</summary>
            <pre>{job.prompt}</pre>
          </details>
          {manual && (
            <div className="manual-input">
              <label>
                {providers[job.provider].name} 답변
                <textarea
                  aria-label={`${providers[job.provider].name} 답변`}
                  placeholder="해당 AI의 완성된 답변을 붙여넣으세요."
                  maxLength={LIMITS.answer}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={locked}
                />
              </label>
              <p className="hint">
                최대 14,000자. 다른 AI의 답변을 잘못 붙이지 않았는지 확인하세요.
              </p>
              <button
                className="secondary"
                disabled={locked || !answer.trim()}
                onClick={() => onManual(answer.trim())}
              >
                답변 저장
              </button>
            </div>
          )}
        </>
      )}
    </article>
  );
}
