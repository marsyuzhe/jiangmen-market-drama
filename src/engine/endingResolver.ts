import type { EndingResult, GameState } from './types';

/**
 * 结局判定完全由早期选择累积的剧情标记与最终电量决定，不看最后一次点击。
 * 判定顺序：隐藏结局 → 低电量收摊 → 互助领袖 → 顶流 → 普通的一天。
 */
export function resolveEnding(state: GameState): EndingResult {
  const flags = new Set(state.flags);
  const battery = state.battery;
  const community =
    (flags.has('helpedVendors') ? 1 : 0) +
    (flags.has('auntSupport') ? 1 : 0) +
    (flags.has('helpedMystery') ? 1 : 0) +
    (flags.has('feast') ? 1 : 0) +
    (flags.has('rested') ? 1 : 0);

  let endingId = 'ordinary';

  if (flags.has('studioSecret')) {
    endingId = 'studio';
  } else if (flags.has('earlyClose') || battery <= 15) {
    endingId = 'shutdown';
  } else if (flags.has('helpedVendors') && community >= 2 && battery >= 35) {
    endingId = 'leader';
  } else if (flags.has('viral') && battery >= 25) {
    endingId = 'star';
  }

  return {
    endingId,
    finalBattery: battery,
    playerName: state.playerName,
    tags: buildTags(state),
  };
}

interface TagRule {
  flag?: string;
  maxBattery?: number;
  tag: string;
}

const TAG_RULES: TagRule[] = [
  { flag: 'studioSecret', tag: '#片场老演员' },
  { flag: 'helpedVendors', tag: '#停电互助组' },
  { flag: 'viral', tag: '#菜市场顶流' },
  { flag: 'laowangPartner', tag: '#直播打工人' },
  { flag: 'auntSupport', tag: '#王阿姨的人' },
  { flag: 'gaveOnion', tag: '#一根葱的信徒' },
  { flag: 'argument', tag: '#砍价受害者' },
  { flag: 'stubborn', tag: '#尊严十二块一斤' },
  { flag: 'helpedRider', tag: '#一瓶水的交情' },
  { flag: 'performed', tag: '#沉浸式剧场' },
  { flag: 'broke', tag: '#赔本赚吆喝' },
  { flag: 'rested', tag: '#合法休息' },
  { flag: 'checkedOut', tag: '#飞行模式' },
  { flag: 'earlyClose', tag: '#提前关机' },
  { maxBattery: 15, tag: '#精神电量告急' },
];

const FALLBACK_TAGS = ['#菜市场打工人', '#幸福路居民', '#今天没关机'];

export function buildTags(state: GameState): string[] {
  const picked: string[] = [];
  for (const rule of TAG_RULES) {
    if (picked.length >= 3) break;
    const flagHit = rule.flag ? state.flags.includes(rule.flag) : true;
    const batteryHit = rule.maxBattery !== undefined ? state.battery <= rule.maxBattery : true;
    if (flagHit && batteryHit && !picked.includes(rule.tag)) picked.push(rule.tag);
  }
  for (const tag of FALLBACK_TAGS) {
    if (picked.length >= 3) break;
    if (!picked.includes(tag)) picked.push(tag);
  }
  return picked.slice(0, 3);
}
