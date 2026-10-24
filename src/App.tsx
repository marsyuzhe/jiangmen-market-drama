import { useCallback, useEffect, useMemo, useState } from 'react';
import type { EndingResult, GameState, Settings } from './engine/types';
import { createGame } from './engine/gameState';
import { clearGame, loadGallery, loadGame, loadSettings, saveGame, saveSettings, unlockEnding } from './engine/saveManager';
import { ENDINGS } from './story/endings';
import TitleScreen from './screens/TitleScreen';
import GameScreen from './screens/GameScreen';
import EndingScreen from './screens/EndingScreen';
import EndingGallery from './screens/EndingGallery';
import SettingsPanel from './components/SettingsPanel';
import { sound } from './services/soundManager';

type Screen = 'title' | 'game' | 'ending' | 'gallery';

const NAME_KEY = 'caimao.playerName';

function readName(): string {
  try {
    return localStorage.getItem(NAME_KEY) || '靓仔';
  } catch {
    return '靓仔';
  }
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerName, setPlayerName] = useState<string>(readName);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [unlocked, setUnlocked] = useState<string[]>(loadGallery);
  const [result, setResult] = useState<EndingResult | null>(null);
  const [isNewEnding, setIsNewEnding] = useState(false);
  const hasSave = useMemo(() => screen === 'title' && !!loadGame(), [screen, gameState]);
  const [saveVersion, setSaveVersion] = useState(0);

  useEffect(() => {
    sound.setMuted(settings.muted);
  }, [settings.muted]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (settings.ambience && !settings.muted && screen === 'game') sound.startAmbience();
    else sound.stopAmbience();
  }, [settings.ambience, settings.muted, screen]);

  useEffect(() => {
    try {
      localStorage.setItem(NAME_KEY, playerName || '靓仔');
    } catch {
      /* 忽略 */
    }
  }, [playerName]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((current) => ({ ...current, ...patch }));
    if (patch.muted === false) sound.init();
  }, []);

  const startNew = useCallback(
    (name: string) => {
      const fresh = createGame(name.trim() || '靓仔');
      saveGame(fresh);
      setPlayerName(fresh.playerName);
      setGameState(fresh);
      setSaveVersion((value) => value + 1);
      sound.init();
      sound.play('tvOn');
      setScreen('game');
    },
    [],
  );

  const resume = useCallback(() => {
    const loaded = loadGame();
    if (!loaded) return;
    setGameState(loaded);
    sound.init();
    setScreen('game');
  }, []);

  const handleFinish = useCallback(
    (endingResult: EndingResult) => {
      const before = loadGallery();
      const after = unlockEnding(endingResult.endingId);
      setUnlocked(after);
      setIsNewEnding(!before.includes(endingResult.endingId));
      setResult(endingResult);
      setGameState(null);
      clearGame();
      setSaveVersion((value) => value + 1);
      setScreen('ending');
      sound.play('reveal');
    },
    [],
  );

  const replay = useCallback(() => {
    startNew(playerName);
  }, [playerName, startNew]);

  const goTitle = useCallback(() => {
    setScreen('title');
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  // Esc 打开 / 关闭设置面板
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setSettingsOpen((open) => !open);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className={`app${settings.reducedMotion ? ' is-reduced' : ''}${settings.showMode ? ' is-showmode' : ''}`}>
      {screen === 'title' ? (
        <TitleScreen
          key={`title-${saveVersion}`}
          hasSave={hasSave}
          playerName={playerName}
          unlockedCount={unlocked.length}
          onChangeName={setPlayerName}
          onStart={startNew}
          onContinue={resume}
          onGallery={() => setScreen('gallery')}
          onOpenSettings={openSettings}
        />
      ) : null}

      {screen === 'game' && gameState ? (
        <GameScreen
          key={gameState.updatedAt}
          initialState={gameState}
          settings={settings}
          inputLocked={settingsOpen}
          onOpenSettings={openSettings}
          onExit={goTitle}
          onFinish={handleFinish}
        />
      ) : null}

      {screen === 'ending' && result ? (
        <EndingScreen
          result={result}
          isNew={isNewEnding}
          unlockedCount={unlocked.length}
          totalEndings={ENDINGS.length}
          onReplay={replay}
          onGallery={() => setScreen('gallery')}
          onHome={goTitle}
        />
      ) : null}

      {screen === 'gallery' ? (
        <EndingGallery unlocked={unlocked} onBack={goTitle} onReplay={() => startNew(playerName)} />
      ) : null}

      {settingsOpen ? (
        <SettingsPanel settings={settings} onChange={updateSettings} onClose={closeSettings} />
      ) : null}
    </div>
  );
}
