import type { StoryChoice } from '../engine/types';

export interface ChoicePanelProps {
  choices: StoryChoice[];
  onChoose: (choice: StoryChoice) => void;
  disabled?: boolean;
  showMode?: boolean;
}

const TONE_LABEL: Record<string, string> = {
  kind: '人情',
  risky: '冒险',
  wild: '离谱',
  tired: '省电',
  smart: '机灵',
};

export default function ChoicePanel({ choices, onChoose, disabled, showMode }: ChoicePanelProps) {
  return (
    <div className={`choices${showMode ? ' is-showmode' : ''}`} role="group" aria-label="剧情选项">
      {choices.map((choice, index) => (
        <button
          type="button"
          key={choice.id}
          className={`choice tone-${choice.tone ?? 'smart'}`}
          onClick={() => onChoose(choice)}
          disabled={disabled}
        >
          <span className="choice__num">{index + 1}</span>
          <span className="choice__main">
            <span className="choice__text">{choice.text}</span>
            {choice.note ? <span className="choice__note">{choice.note}</span> : null}
          </span>
          <span className="choice__meta">
            {choice.tone ? <span className={`choice__tone tone-${choice.tone}`}>{TONE_LABEL[choice.tone]}</span> : null}
            <span className={`choice__delta ${choice.batteryDelta >= 0 ? 'is-up' : 'is-down'}`}>
              {choice.batteryDelta > 0 ? `+${choice.batteryDelta}%` : `${choice.batteryDelta}%`}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
