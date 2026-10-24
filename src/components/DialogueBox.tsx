import type { DialogueLine } from '../engine/types';
import { CHARACTERS, speakerName } from '../story/characters';

export interface DialogueBoxProps {
  line: DialogueLine;
  playerName: string;
  visibleText: string;
  typing: boolean;
  showContinueHint: boolean;
}

export default function DialogueBox({
  line,
  playerName,
  visibleText,
  typing,
  showContinueHint,
}: DialogueBoxProps) {
  const narrator = line.speaker === 'narrator';
  const name = speakerName(line.speaker, playerName);
  const accent = CHARACTERS[line.speaker].color;
  const dramatic = line.style === 'shout' || line.style === 'poster';

  return (
    <div
      className={[
        'dialogue',
        narrator ? 'is-narrator' : '',
        dramatic ? 'is-dramatic' : '',
        line.style ? `style-${line.style}` : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {!narrator ? (
        <div className="dialogue__name" style={{ background: accent }}>
          <span>{name}</span>
        </div>
      ) : (
        <div className="dialogue__name is-narrator-name">画外音</div>
      )}
      <p className="dialogue__text">
        {visibleText}
        {typing ? <span className="dialogue__caret" aria-hidden="true" /> : null}
      </p>
      {showContinueHint ? (
        <span className="dialogue__next" aria-hidden="true">
          ▼
        </span>
      ) : null}
    </div>
  );
}

export function DialogueNameplate({ line, playerName }: { line: DialogueLine; playerName: string }) {
  return <span>{speakerName(line.speaker, playerName)}</span>;
}
