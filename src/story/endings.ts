import type { EndingDef } from '../engine/types';

export const ENDINGS: EndingDef[] = [
  {
    id: 'leader',
    letter: 'A',
    title: '菜市场精神领袖',
    award: '幸福路第一精神领袖奖',
    quote: '灯亮了，菜卖完了，明天还得来。',
    subtitle: '你没有拯救世界。你只是让一条街的人，都撑到了收摊。',
    hint: '在最黑的时候，选择把大家组织起来。',
    stamp: '互助模范',
    palette: {
      bg: '#F3E8CC',
      accent: '#347A48',
      accentSoft: '#BFD8C2',
      ink: '#242019',
      badge: '#F4CE46',
    },
    posterScene: 'lightson',
  },
  {
    id: 'star',
    letter: 'B',
    title: '幸福路第一顶流',
    award: '幸福路第一顶流奖',
    quote: '我一开始真的只是想卖个番茄。',
    subtitle: '后来你卖了番茄、卖了情绪，还卖了一个上午的人设。',
    hint: '让整条街的手机都对着你。',
    stamp: '全程在线',
    palette: {
      bg: '#F7E3BC',
      accent: '#E67E22',
      accentSoft: '#F6C892',
      ink: '#242019',
      badge: '#F4CE46',
    },
    posterScene: 'press',
  },
  {
    id: 'shutdown',
    letter: 'C',
    title: '原地关机',
    award: '今日提前关机奖',
    quote: '今天不营业了。人不是手机，没必要一直满格。',
    subtitle: '你收摊了。世界没有因此停转，也没有因此变好。但你的电量，回到了自己手里。',
    hint: '把自己耗到很低，然后允许自己休息。',
    stamp: '合法休息',
    palette: {
      bg: '#EDE6D6',
      accent: '#8C7A5B',
      accentSoft: '#CFC3A8',
      ink: '#242019',
      badge: '#E67E22',
    },
    posterScene: 'lightson',
  },
  {
    id: 'studio',
    letter: 'D',
    title: '菜市场宇宙',
    award: '最佳男主角奖',
    quote: '本剧根据一个正常工作日改编。',
    subtitle: '咔。这一条过了。你演了五集，还以为自己只是在上班。',
    hint: '对镜头保持好奇，并且对神秘人足够大方。',
    stamp: '隐藏结局',
    palette: {
      bg: '#E8E1D0',
      accent: '#4B4453',
      accentSoft: '#BFB6C4',
      ink: '#242019',
      badge: '#C62828',
    },
    posterScene: 'studio',
  },
  {
    id: 'ordinary',
    letter: 'E',
    title: '普通的一天',
    award: '幸福路普通市民奖',
    quote: '菜卖了，钱没赚，人还在。',
    subtitle: '不是每一天都要有结局。有些日子，能平平安安收摊，就已经很好。',
    hint: '不追热点，也不逞强，把一天过完。',
    stamp: '正常营业',
    palette: {
      bg: '#F3E8CC',
      accent: '#C62828',
      accentSoft: '#E9CDBE',
      ink: '#242019',
      badge: '#F4CE46',
    },
    posterScene: 'stall',
  },
];

export const ENDING_INDEX: Record<string, EndingDef> = Object.fromEntries(
  ENDINGS.map((ending) => [ending.id, ending]),
);

export function getEnding(id: string): EndingDef {
  return ENDING_INDEX[id] ?? ENDINGS[ENDINGS.length - 1];
}
