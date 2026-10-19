import {
  defaultPromptOptions,
  stageNames,
  type PromptOptions,
} from '../../domains/crosscheck/model';

export function PromptSettings({
  value,
  disabled,
  onChange,
}: {
  value: PromptOptions;
  disabled: boolean;
  onChange: (value: PromptOptions) => void;
}) {
  return (
    <fieldset className="prompt-settings" disabled={disabled}>
      <legend>답변과 프롬프트</legend>
      <label>
        답변 언어
        <input
          value={value.language}
          maxLength={80}
          onChange={(event) => onChange({ ...value, language: event.target.value })}
        />
      </label>
      <p className="hint">
        새 검토부터 적용합니다. 공유 범위와 안전 지침은 항상 유지합니다. 설정은 브라우저 세션 동안
        보관합니다.
      </p>
      {(['collect', 'review', 'synthesize'] as const).map((stage) => (
        <details key={stage}>
          <summary>{stageNames[stage]} 문구</summary>
          <label>
            {stageNames[stage]} 지시문
            <textarea
              value={value.stages[stage]}
              maxLength={4000}
              onChange={(event) =>
                onChange({ ...value, stages: { ...value.stages, [stage]: event.target.value } })
              }
            />
          </label>
          <button
            type="button"
            className="text-button"
            onClick={() =>
              onChange({
                ...value,
                stages: { ...value.stages, [stage]: defaultPromptOptions.stages[stage] },
              })
            }
          >
            {stageNames[stage]} 기본값으로
          </button>
        </details>
      ))}
      <button
        type="button"
        className="text-button"
        onClick={() => onChange(structuredClone(defaultPromptOptions))}
      >
        프롬프트 설정 모두 초기화
      </button>
    </fieldset>
  );
}
