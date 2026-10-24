import type { GameState, Settings } from './types';

export const SAVE_VERSION = 1;

export const INITIAL_BATTERY = 100;
export const FIRST_SCENE_ID = 'e1-open';

export type BatteryTierKey = 'full' | 'ok' | 'low' | 'critical';

export interface BatteryTier {
  key: BatteryTierKey;
  label: string;
  hint: string;
  color: string;
}

export function batteryTier(battery: number): BatteryTier {
  if (battery > 75) {
    return {
      key: 'full',
      label: '精神饱满',
      hint: '思路清楚，说话有底气。',
      color: '#347A48',
    };
  }
  if (battery > 40) {
    return {
      key: 'ok',
      label: '勉强营业',
      hint: '还能笑，但笑得有点省电。',
      color: '#DFAE2B',
    };
  }
  if (battery > 15) {
    return {
      key: 'low',
      label: '精神告急',
      hint: '你开始想关掉一半的感官。',
      color: '#E67E22',
    };
  }
  return {
    key: 'critical',
    label: '即将关机',
    hint: '再撑一下。或者不撑。',
    color: '#C62828',
  };
}

export function clampBattery(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export const DEFAULT_SETTINGS: Settings = {
  muted: true,
  reducedMotion: false,
  showMode: false,
  ambience: false,
};

export function createGame(playerName: string): GameState {
  return {
    version: SAVE_VERSION,
    playerName: playerName || '靓仔',
    battery: INITIAL_BATTERY,
    sceneId: FIRST_SCENE_ID,
    episode: 1,
    flags: [],
    choicesMade: 0,
    updatedAt: Date.now(),
  };
}
