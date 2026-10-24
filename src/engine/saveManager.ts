import type { GameState, Settings } from './types';
import { DEFAULT_SETTINGS, SAVE_VERSION } from './gameState';
import { SCENE_INDEX } from '../story/scenes';

const SAVE_KEY = 'caimao.save.v1';
const SETTINGS_KEY = 'caimao.settings.v1';
const GALLERY_KEY = 'caimao.gallery.v1';

function canStore(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

function read(key: string): string | null {
  if (!canStore()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): boolean {
  if (!canStore()) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function isValidState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<GameState>;
  return (
    state.version === SAVE_VERSION &&
    typeof state.playerName === 'string' &&
    typeof state.battery === 'number' &&
    state.battery >= 0 &&
    state.battery <= 100 &&
    typeof state.sceneId === 'string' &&
    !!SCENE_INDEX[state.sceneId] &&
    Array.isArray(state.flags) &&
    state.flags.every((flag) => typeof flag === 'string') &&
    typeof state.choicesMade === 'number' &&
    typeof state.episode === 'number'
  );
}

export function loadGame(): GameState | null {
  const raw = read(SAVE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isValidState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveGame(state: GameState): void {
  write(SAVE_KEY, JSON.stringify(state));
}

export function clearGame(): void {
  if (!canStore()) return;
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch {
    /* 忽略存储失败 */
  }
}

export function loadSettings(): Settings {
  const raw = read(SETTINGS_KEY);
  if (!raw) return { ...DEFAULT_SETTINGS };
  try {
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      muted: typeof parsed.muted === 'boolean' ? parsed.muted : DEFAULT_SETTINGS.muted,
      reducedMotion:
        typeof parsed.reducedMotion === 'boolean'
          ? parsed.reducedMotion
          : DEFAULT_SETTINGS.reducedMotion,
      showMode: typeof parsed.showMode === 'boolean' ? parsed.showMode : DEFAULT_SETTINGS.showMode,
      ambience:
        typeof parsed.ambience === 'boolean' ? parsed.ambience : DEFAULT_SETTINGS.ambience,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: Settings): void {
  write(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadGallery(): string[] {
  const raw = read(GALLERY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function unlockEnding(endingId: string): string[] {
  const current = loadGallery();
  if (current.includes(endingId)) return current;
  const next = [...current, endingId];
  write(GALLERY_KEY, JSON.stringify(next));
  return next;
}
