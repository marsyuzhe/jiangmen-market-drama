import type { CharacterId, Expression } from '../engine/types';

export interface CharacterMeta {
  id: CharacterId;
  name: string;
  role: string;
  catchphrase: string;
  color: string;
}

export const CHARACTERS: Record<CharacterId, CharacterMeta> = {
  narrator: {
    id: 'narrator',
    name: '画外音',
    role: '幸福路电视台',
    catchphrase: '本剧纯属虚构，如有雷同，说明大家上班都挺累的。',
    color: '#8C7A5B',
  },
  player: {
    id: 'player',
    name: '靓仔',
    role: '三号蔬菜摊 · 新人摊主',
    catchphrase: '我一开始真的只是想卖个番茄。',
    color: '#347A48',
  },
  wang: {
    id: 'wang',
    name: '王阿姨',
    role: '砍价界传奇',
    catchphrase: '三块钱卖不卖？',
    color: '#C62828',
  },
  laowang: {
    id: 'laowang',
    name: '隔壁老王',
    role: '直播带货天才',
    catchphrase: '家人们，这不是番茄，这是生活态度！',
    color: '#E67E22',
  },
  admin: {
    id: 'admin',
    name: '市场管理员',
    role: '秩序守护者',
    catchphrase: '记下了。',
    color: '#3A5A7A',
  },
  mystery: {
    id: 'mystery',
    name: '神秘顾客',
    role: '剧情推进者',
    catchphrase: '一根葱。',
    color: '#4B4453',
  },
  rider: {
    id: 'rider',
    name: '外卖骑手',
    role: '人间清醒担当',
    catchphrase: '哥，你这算加班吧？',
    color: '#F4CE46',
  },
};

export const EXPRESSION_LABEL: Record<Expression, string> = {
  normal: '平静',
  happy: '开心',
  angry: '生气',
  speechless: '无语',
  tired: '疲惫',
  shock: '震惊',
  smug: '得意',
};

export function speakerName(id: CharacterId, playerName: string): string {
  return id === 'player' ? playerName : CHARACTERS[id].name;
}
