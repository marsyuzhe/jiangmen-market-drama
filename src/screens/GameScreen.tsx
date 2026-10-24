import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CharacterId, EndingResult, EpisodeEndCard, GameState, Settings, StoryChoice } from '../engine/types';
import { applyChoice, gotoScene, getScene, isFinalScene, visibleChoices, visibleLines } from '../engine/storyEngine';
import { resolveEnding } from '../engine/endingResolver';
import { saveGame } from '../engine/saveManager';
import { getEpisode } from '../story/episodes';
import { CHARACTERS, EXPRESSION_LABEL, speakerName } from '../story/characters';
import BatteryMeter, { batteryTags } from '../components/BatteryMeter';
import ChoicePanel from '../components/ChoicePanel';
import DialogueBox from '../components/DialogueBox';
import SceneStage from '../components/SceneStage';
import EpisodeTransition from '../components/EpisodeTransition';
import { sound } from '../services/soundManager';

export interface GameScreenProps {
  initialState: GameState;
  settings: Settings;
  inputLocked: boolean;
  onOpenSettings: () => void;
  onExit: () => void;
  onFinish: (result: EndingResult) => void;
}

interface Consequence {
  text: string;
  delta: number;
}

export default function GameScreen({
  initialState,
  settings,
  inputLocked,
  onOpenSettings,
  onExit,
  onFinish,
}: GameScreenProps) {
  const [state, setState] = useState<GameState>(initialState);
  const [lineIndex, setLineIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [linesDone, setLinesDone] = useState(false);
  const [locked, setLocked] = useState(false);
  const [delta, setDelta] = useState<number | null>(null);
  const [consequence, setConsequence] = useState<Consequence | null>(null);
  const [outro, setOutro] = useState<EpisodeEndCard | null>(null);
  const [intro, setIntro] = useState<number | null>(null);
  const [readyEnding, setReadyEnding] = useState(false);
  const timers = useRef<number[]>([]);

  const scene = getScene(state.sceneId);
  const episode = getEpisode(scene.episode);
  const lines = useMemo(() => visibleLines(scene, state), [scene, state]);
  const activeLine = lines[Math.min(lineIndex, Math.max(0, lines.length - 1))];

  const choices = useMemo(() => {
    if (!linesDone || scene.choices?.length === 0) return [];
    return visibleChoices(scene, state);
  }, [linesDone, scene, state]);

  const stageCharacter = useMemo(() => {
    let character: CharacterId | undefined = scene.focus;
    let expression = scene.expression ?? 'normal';
    for (let i = Math.min(lineIndex, lines.length - 1); i >= 0; i -= 1) {
      const line = lines[i];
      if (line && line.speaker !== 'narrator') {
        character = line.speaker;
        expression = line.expression ?? expression;
        break;
      }
      if (line?.expression) expression = line.expression;
    }
    return { character, expression };
  }, [lines, lineIndex, scene]);

  const flushTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => () => flushTimers(), [flushTimers]);

  // 集首转场卡
  useEffect(() => {
    if (scene.episodeEnd) return;
    const meta = getEpisode(scene.episode);
    let timer: number | undefined;
    if (meta.firstSceneId === scene.id) {
      setIntro(scene.episode);
      sound.play('chapter');
      timer = window.setTimeout(() => setIntro(null), 2600);
      timers.current.push(timer);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id, scene.episode]);

  // 逐字显示
  useEffect(() => {
    const text = activeLine?.text ?? '';
    setTyped(0);
    if (!text) return;
    if (settings.reducedMotion) {
      setTyped(text.length);
      return;
    }
    let index = 0;
    const timer = window.setInterval(() => {
      index += 2;
      setTyped(Math.min(index, text.length));
      if (index >= text.length) window.clearInterval(timer);
    }, 24);
    return () => window.clearInterval(timer);
  }, [activeLine?.text, lineIndex, state.sceneId, settings.reducedMotion]);

  useEffect(() => {
    if (delta === null) return;
    const timer = window.setTimeout(() => setDelta(null), 1900);
    return () => window.clearTimeout(timer);
  }, [delta]);

  useEffect(() => {
    if (!consequence) return;
    const timer = window.setTimeout(() => setConsequence(null), 3200);
    return () => window.clearTimeout(timer);
  }, [consequence]);

  const typing = !!activeLine && typed < (activeLine.text?.length ?? 0);
  const visibleText = activeLine ? activeLine.text.slice(0, typed) : '';

  const goNextScene = useCallback(
    (nextId: string) => {
      const next = gotoScene(state, nextId);
      setState(next);
      saveGame(next);
      setLineIndex(0);
      setTyped(0);
      setLinesDone(false);
      setReadyEnding(false);
    },
    [state],
  );

  const finishLines = useCallback(() => {
    if (scene.episodeEnd) {
      const card = scene.episodeEnd;
      setOutro(card);
      sound.play('chapter');
      return;
    }
    if (scene.next) {
      goNextScene(scene.next);
      return;
    }
    if (isFinalScene(scene)) {
      setReadyEnding(true);
      sound.play('reveal');
      return;
    }
    setLinesDone(true);
  }, [scene, goNextScene]);

  const advance = useCallback(() => {
    if (inputLocked || locked) return;
    if (intro !== null) {
      setIntro(null);
      return;
    }
    if (outro) return;
    if (readyEnding) return;
    if (!activeLine) {
      finishLines();
      return;
    }
    if (typing) {
      setTyped(activeLine.text.length);
      return;
    }
    if (lineIndex < lines.length - 1) {
      setLineIndex((value) => value + 1);
      return;
    }
    if (linesDone) return;
    finishLines();
  }, [inputLocked, locked, intro, outro, readyEnding, activeLine, typing, lineIndex, lines.length, linesDone, finishLines]);

  const handleChoose = useCallback(
    (choice: StoryChoice) => {
      if (locked || inputLocked) return;
      setLocked(true);
      const next = applyChoice(state, choice);
      setState(next);
      saveGame(next);
      setLineIndex(0);
      setTyped(0);
      setLinesDone(false);
      setReadyEnding(false);
      setDelta(choice.batteryDelta);
      setConsequence({ text: choice.effect, delta: choice.batteryDelta });
      sound.play(choice.batteryDelta >= 0 ? 'batteryUp' : 'batteryDown');
      const timer = window.setTimeout(() => setLocked(false), 520);
      timers.current.push(timer);
    },
    [locked, inputLocked, state],
  );

  const continueOutro = useCallback(() => {
    if (!outro) return;
    const nextId = outro.nextSceneId;
    setOutro(null);
    goNextScene(nextId);
  }, [outro, goNextScene]);

  const continueEnding = useCallback(() => {
    const result = resolveEnding(state);
    saveGame(state);
    onFinish(result);
  }, [state, onFinish]);

  // 键盘操作
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (inputLocked) return;
      const key = event.key;
      if (key === '1' || key === '2' || key === '3' || key === '4' || key === '5') {
        const target = choices[Number(key) - 1];
        if (target) {
          event.preventDefault();
          handleChoose(target);
        }
        return;
      }
      if (key === ' ' || key === 'Enter' || key === 'ArrowRight') {
        event.preventDefault();
        if (outro) continueOutro();
        else if (readyEnding) continueEnding();
        else if (intro !== null) setIntro(null);
        else advance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inputLocked, choices, handleChoose, advance, outro, readyEnding, intro, continueOutro, continueEnding]);

  const activeCharMeta = stageCharacter.character ? CHARACTERS[stageCharacter.character] : null;
  const statusTags = batteryTags(state);

  return (
    <div
      className={`game-screen${settings.showMode ? ' is-showmode' : ''}`}
      data-battery-tier={state.battery > 75 ? 'full' : state.battery > 40 ? 'ok' : state.battery > 15 ? 'low' : 'critical'}
    >
      <header className="game-top">
        <button type="button" className="game-top__brand" onClick={onExit} title="返回主菜单（进度已自动保存）">
          <span className="game-top__logo">菜市场风云</span>
          <span className="game-top__sub">今天谁先没电？</span>
        </button>
        <div className="game-top__episode">
          <span className="game-top__ep">EP.{String(episode.number).padStart(2, '0')}</span>
          <span className="game-top__title">{episode.title}</span>
        </div>
        <div className="game-top__tools">
          <button type="button" className="icon-btn on-paper" onClick={onOpenSettings} aria-label="设置">
            设置
          </button>
          <button type="button" className="icon-btn on-paper" onClick={onExit} aria-label="返回主菜单">
            主菜单
          </button>
        </div>
      </header>

      <main className="game-main">
        <div className="game-left" onClick={advance} role="presentation">
          <SceneStage
            key={scene.id}
            scene={scene}
            character={stageCharacter.character}
            expression={stageCharacter.expression}
            reducedMotion={settings.reducedMotion}
          >
            {!intro && !outro && activeLine ? (
              <DialogueBox
                line={activeLine}
                playerName={state.playerName}
                visibleText={visibleText}
                typing={typing}
                showContinueHint={!typing && (lineIndex >= lines.length - 1 ? !linesDone : true)}
              />
            ) : null}
            {consequence ? (
              <div className="consequence" onClick={(event) => event.stopPropagation()}>
                <div className="consequence__head">
                  <span>剧情结果</span>
                  <span className={`consequence__delta ${consequence.delta >= 0 ? 'is-up' : 'is-down'}`}>
                    {consequence.delta > 0 ? `+${consequence.delta}%` : `${consequence.delta}%`}
                  </span>
                </div>
                <p>{consequence.text}</p>
              </div>
            ) : null}
            {readyEnding ? (
              <div className="ending-call" onClick={(event) => event.stopPropagation()}>
                <p>五集演完了。灯还亮着。</p>
                <button type="button" className="btn btn--primary" onClick={continueEnding}>
                  揭晓你的结局
                </button>
              </div>
            ) : null}
            {intro !== null ? (
              <EpisodeTransition
                episode={getEpisode(intro)}
                mode="intro"
                onContinue={() => setIntro(null)}
              />
            ) : null}
            {outro ? (
              <EpisodeTransition
                episode={episode}
                mode="outro"
                hook={outro.hook}
                onContinue={continueOutro}
              />
            ) : null}
          </SceneStage>
          <p className="game-hint">
            {typing ? '点击画面 · 立即显示整句' : choices.length ? '选择右侧的应对方式' : '点击画面 / 空格 · 继续'}
          </p>
        </div>

        <aside className="game-side">
          <BatteryMeter battery={state.battery} delta={delta} />

          <div className="side-episode">
            <div className="side-episode__row">
              <span className="side-episode__label">当前集数</span>
              <strong>
                EP.{String(episode.number).padStart(2, '0')} / 05
              </strong>
            </div>
            <p className="side-episode__title">{episode.title}</p>
            <div className="side-episode__ticks" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((number) => (
                <span
                  key={number}
                  className={`tick${number < episode.number ? ' is-done' : ''}${number === episode.number ? ' is-now' : ''}`}
                />
              ))}
            </div>
          </div>

          {activeCharMeta ? (
            <div className="side-character">
              <div className="side-character__head">
                <span className="side-character__dot" style={{ background: activeCharMeta.color }} />
                <div>
                  <strong>{speakerName(activeCharMeta.id, state.playerName)}</strong>
                  <small>{activeCharMeta.role}</small>
                </div>
                <span className="side-character__mood">{EXPRESSION_LABEL[stageCharacter.expression]}</span>
              </div>
              <p className="side-character__line">「{activeCharMeta.catchphrase}」</p>
            </div>
          ) : null}

          <div className="side-choices">
            {choices.length ? (
              <ChoicePanel choices={choices} onChoose={handleChoose} disabled={locked} showMode={settings.showMode} />
            ) : (
              <div className="side-wait">
                <span className="side-wait__label">{linesDone ? '—— 本场结束 ——' : '剧情进行中'}</span>
                <p>
                  {consequence
                    ? '先看看这个选择带来了什么。'
                    : linesDone
                      ? '点击画面继续。'
                      : '把这段对白看完，再决定怎么做。'}
                </p>
                {linesDone && scene.next ? (
                  <button type="button" className="btn btn--small" onClick={() => goNextScene(scene.next!)}>
                    继续
                  </button>
                ) : null}
              </div>
            )}
          </div>

          <div className="side-status">
            <span className="side-status__label">状态</span>
            <div className="side-status__tags">
              {statusTags.length ? (
                statusTags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="tag is-empty">暂无特殊关系</span>
              )}
              <span className="tag is-ghost">已做选择 {state.choicesMade}</span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
