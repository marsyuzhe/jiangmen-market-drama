import type { EpisodeMeta } from '../engine/types';

export interface EpisodeTransitionProps {
  episode: EpisodeMeta;
  mode: 'intro' | 'outro';
  hook?: string;
  onContinue: () => void;
}

export default function EpisodeTransition({ episode, mode, hook, onContinue }: EpisodeTransitionProps) {
  const number = String(episode.number).padStart(2, '0');
  return (
    <div className={`episode-card is-${mode}`} onClick={onContinue} role="button" tabIndex={0} onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') onContinue();
    }}>
      <div className="episode-card__noise" aria-hidden="true" />
      <div className="episode-card__inner">
        <div className="episode-card__index">第 {number} 集</div>
        <h2 className="episode-card__title">{episode.title}</h2>
        <p className="episode-card__line">{episode.oneliner}</p>
        {mode === 'outro' ? (
          <>
            <div className="episode-card__end">未完待续</div>
            {hook ? <p className="episode-card__hook">{hook}</p> : null}
          </>
        ) : null}
        <span className="episode-card__skip">点击继续 ▶</span>
      </div>
    </div>
  );
}
