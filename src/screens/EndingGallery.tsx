import { ENDINGS } from '../story/endings';
import type { EndingDef } from '../engine/types';

export interface EndingGalleryProps {
  unlocked: string[];
  onBack: () => void;
  onReplay: () => void;
}

function Card({ ending, unlocked }: { ending: EndingDef; unlocked: boolean }) {
  const style = {
    '--card-bg': ending.palette.bg,
    '--card-accent': ending.palette.accent,
    '--card-soft': ending.palette.accentSoft,
    '--card-badge': ending.palette.badge,
    '--card-ink': ending.palette.ink,
  } as React.CSSProperties;

  return (
    <article className={`gallery-card${unlocked ? ' is-unlocked' : ' is-locked'}`} style={style}>
      <div className="gallery-card__band">
        <span>结局 {ending.letter}</span>
        <span>{unlocked ? ending.stamp : '未解锁'}</span>
      </div>
      {unlocked ? (
        <>
          <h3 className="gallery-card__title">{ending.title}</h3>
          <p className="gallery-card__award">{ending.award}</p>
          <p className="gallery-card__quote">「{ending.quote}」</p>
        </>
      ) : (
        <>
          <div className="gallery-card__silhouette" aria-hidden="true">
            <span />
          </div>
          <h3 className="gallery-card__title">？？？？</h3>
          <p className="gallery-card__hint">线索：{ending.hint}</p>
        </>
      )}
      <div className="gallery-card__foot">{unlocked ? '已解锁' : '尚未播出'}</div>
    </article>
  );
}

export default function EndingGallery({ unlocked, onBack, onReplay }: EndingGalleryProps) {
  return (
    <div className="gallery-screen">
      <div className="gallery-screen__grain" aria-hidden="true" />
      <header className="gallery-top">
        <button type="button" className="btn btn--ghost btn--small" onClick={onBack}>
          ← 返回
        </button>
        <div className="gallery-top__title">
          <h1>结局图鉴</h1>
          <p>
            已解锁 {unlocked.length}/{ENDINGS.length} · 幸福路电视台 · 节目存档室
          </p>
        </div>
        <button type="button" className="btn btn--primary btn--small" onClick={onReplay}>
          再演一次
        </button>
      </header>

      <div className="gallery-grid">
        {ENDINGS.map((ending) => (
          <Card key={ending.id} ending={ending} unlocked={unlocked.includes(ending.id)} />
        ))}
      </div>

      <footer className="gallery-foot">
        <p>未解锁的结局只放出线索，不剧透。多试几次，电量和人缘都会不一样。</p>
      </footer>
    </div>
  );
}
