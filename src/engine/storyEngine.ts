import type { DialogueLine, GameState, StoryChoice, StoryScene } from './types';
import { SCENE_INDEX } from '../story/scenes';
import { clampBattery } from './gameState';

export function getScene(sceneId: string): StoryScene {
  return SCENE_INDEX[sceneId] ?? SCENE_INDEX['e1-open'];
}

export function hasFlag(state: GameState, flag: string): boolean {
  return state.flags.includes(flag);
}

export function lineIsVisible(line: DialogueLine, state: GameState): boolean {
  if (line.maxBattery !== undefined && state.battery > line.maxBattery) return false;
  if (line.minBattery !== undefined && state.battery < line.minBattery) return false;
  if (line.flag && !hasFlag(state, line.flag)) return false;
  if (line.notFlag && hasFlag(state, line.notFlag)) return false;
  return true;
}

export function visibleLines(scene: StoryScene, state: GameState): DialogueLine[] {
  return scene.lines.filter((line) => lineIsVisible(line, state));
}

export function choiceIsAvailable(choice: StoryChoice, state: GameState): boolean {
  if (choice.requireAll && !choice.requireAll.every((flag) => hasFlag(state, flag))) return false;
  if (choice.requireNone && choice.requireNone.some((flag) => hasFlag(state, flag))) return false;
  if (choice.minBattery !== undefined && state.battery < choice.minBattery) return false;
  if (choice.maxBattery !== undefined && state.battery > choice.maxBattery) return false;
  return true;
}

export function visibleChoices(scene: StoryScene, state: GameState): StoryChoice[] {
  return (scene.choices ?? []).filter((choice) => choiceIsAvailable(choice, state));
}

/**
 * 应用一次选择：电量边界限制、剧情标记、场景推进。
 * 纯函数，不产生副作用，便于测试。
 */
export function applyChoice(state: GameState, choice: StoryChoice): GameState {
  const flags = new Set(state.flags);
  for (const flag of choice.clearFlags ?? []) flags.delete(flag);
  for (const flag of choice.setFlags ?? []) flags.add(flag);

  const nextScene = getScene(choice.nextSceneId);

  return {
    ...state,
    battery: clampBattery(state.battery + choice.batteryDelta),
    flags: [...flags],
    sceneId: nextScene.id,
    episode: nextScene.episode,
    choicesMade: state.choicesMade + 1,
    updatedAt: Date.now(),
  };
}

export function gotoScene(state: GameState, sceneId: string): GameState {
  const scene = getScene(sceneId);
  return {
    ...state,
    sceneId: scene.id,
    episode: scene.episode,
    updatedAt: Date.now(),
  };
}

export function isFinalScene(scene: StoryScene): boolean {
  return !scene.next && !scene.episodeEnd && (!scene.choices || scene.choices.length === 0);
}

/** 对玩家可见的电量文案 */
export function batteryFeedback(delta: number): string {
  if (delta === 0) return '精神电量 不变';
  return `精神电量 ${delta > 0 ? '+' : '-'}${Math.abs(delta)}%`;
}
