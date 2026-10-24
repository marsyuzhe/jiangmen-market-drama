import type { CharacterId, Expression, StoryScene } from '../engine/types';
import CharacterSprite from './CharacterSprite';
import SceneBackdrop from './SceneBackdrop';

export interface SceneStageProps {
  scene: StoryScene;
  character?: CharacterId;
  expression: Expression;
  reducedMotion?: boolean;
  children?: React.ReactNode;
}

const EFFECT_CLASS: Record<string, string> = {
  shake: 'fx-shake',
  zoom: 'fx-zoom',
  glitch: 'fx-glitch',
  blackout: 'fx-blackout',
  lightson: 'fx-lightson',
  flash: 'fx-flash',
  freeze: 'fx-freeze',
};

export default function SceneStage({ scene, character, expression, reducedMotion, children }: SceneStageProps) {
  const effectClasses = reducedMotion ? [] : (scene.effects ?? []).map((effect) => EFFECT_CLASS[effect] ?? '');
  const lit = scene.background !== 'blackout';

  return (
    <section className={`stage ${effectClasses.join(' ')}`} aria-label="电视剧画面">
      <div className="stage__bezel">
        <div className="stage__screen">
          <SceneBackdrop background={scene.background} lit={lit} />
          <div className="stage__grade" aria-hidden="true" />
          {character ? (
            <div className={`stage__character side-${character === 'player' ? 'left' : 'right'}`} key={`${character}-${expression}`}>
              <CharacterSprite character={character} expression={expression} size={360} />
            </div>
          ) : null}
          <div className="stage__scanlines" aria-hidden="true" />
          <div className="stage__vignette" aria-hidden="true" />
          {children}
          <div className="stage__corner is-left" aria-hidden="true">
            <span className="stage__rec">● REC</span>
          </div>
          <div className="stage__corner is-right" aria-hidden="true">
            <span>CH-1024</span>
          </div>
        </div>
      </div>
      <div className="stage__stand" aria-hidden="true">
        <span>幸福路牌 · 彩色电视机</span>
        <span className="stage__led" />
      </div>
    </section>
  );
}
