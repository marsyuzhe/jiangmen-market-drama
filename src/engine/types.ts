export type CharacterId = 'narrator' | 'player' | 'wang' | 'laowang' | 'admin' | 'mystery' | 'rider';

export type Expression = 'normal' | 'happy' | 'angry' | 'speechless' | 'tired' | 'shock' | 'smug';

export type BackgroundId = 'dawn' | 'stall' | 'live' | 'crowd' | 'blackout' | 'lightson' | 'studio' | 'press';

export type SoundId =
  | 'tvOn'
  | 'chapter'
  | 'batteryDown'
  | 'batteryUp'
  | 'click'
  | 'reveal'
  | 'glitch'
  | 'crowd';

export type StageEffect = 'shake' | 'zoom' | 'glitch' | 'blackout' | 'lightson' | 'flash' | 'freeze';

export interface DialogueLine {
  speaker: CharacterId;
  text: string;
  expression?: Expression;
  /** 仅当精神电量不高于该值时出现 */
  maxBattery?: number;
  /** 仅当精神电量不低于该值时出现 */
  minBattery?: number;
  /** 仅当存在该剧情标记时出现 */
  flag?: string;
  /** 仅当不存在该剧情标记时出现 */
  notFlag?: string;
  /** shout = 大字报摔入；poster = 手写海报；whisper = 悄悄话；caption = 片头字幕 */
  style?: 'shout' | 'poster' | 'whisper' | 'caption';
  sfx?: SoundId;
}

export interface StoryChoice {
  id: string;
  text: string;
  note?: string;
  batteryDelta: number;
  nextSceneId: string;
  requireAll?: string[];
  requireNone?: string[];
  minBattery?: number;
  maxBattery?: number;
  setFlags?: string[];
  clearFlags?: string[];
  effect: string;
  tone?: 'kind' | 'risky' | 'wild' | 'tired' | 'smart';
}

export interface EpisodeEndCard {
  episodeNumber: number;
  title: string;
  hook: string;
  nextSceneId: string;
}

export interface StoryScene {
  id: string;
  episode: number;
  background: BackgroundId;
  /** 舞台上站着的角色 */
  focus?: CharacterId;
  expression?: Expression;
  lines: DialogueLine[];
  choices?: StoryChoice[];
  /** 对白播完后点击“继续”进入的节点 */
  next?: string;
  effects?: StageEffect[];
  /** 集末转场卡 */
  episodeEnd?: EpisodeEndCard;
}

export interface EpisodeMeta {
  number: number;
  title: string;
  oneliner: string;
  firstSceneId: string;
}

export interface GameState {
  version: number;
  playerName: string;
  battery: number;
  sceneId: string;
  episode: number;
  flags: string[];
  choicesMade: number;
  updatedAt: number;
}

export interface Settings {
  muted: boolean;
  reducedMotion: boolean;
  showMode: boolean;
  ambience: boolean;
}

export interface EndingDef {
  id: string;
  letter: 'A' | 'B' | 'C' | 'D' | 'E';
  title: string;
  award: string;
  quote: string;
  subtitle: string;
  hint: string;
  palette: {
    bg: string;
    accent: string;
    accentSoft: string;
    ink: string;
    badge: string;
  };
  stamp: string;
  posterScene: BackgroundId;
}

export interface EndingResult {
  endingId: string;
  finalBattery: number;
  tags: string[];
  playerName: string;
}
