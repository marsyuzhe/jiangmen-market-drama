import type { EpisodeMeta } from '../engine/types';

export const EPISODES: EpisodeMeta[] = [
  {
    number: 1,
    title: '三块钱卖不卖？',
    oneliner: '开摊第一天，你遇到了砍价界的传奇。',
    firstSceneId: 'e1-open',
  },
  {
    number: 2,
    title: '隔壁老王的直播帝国',
    oneliner: '番茄不是番茄，是情绪充电宝。',
    firstSceneId: 'e2-open',
  },
  {
    number: 3,
    title: '幸福路热搜事件',
    oneliner: '你红了。你甚至不知道什么时候开的机。',
    firstSceneId: 'e3-open',
  },
  {
    number: 4,
    title: '全市场停电',
    oneliner: '灯灭了，耐心也快没了。',
    firstSceneId: 'e4-open',
  },
  {
    number: 5,
    title: '今天谁先没电？',
    oneliner: '最终回。请把最后一点电，用在你想用的地方。',
    firstSceneId: 'e5-open',
  },
];

export function getEpisode(number: number): EpisodeMeta {
  return EPISODES.find((episode) => episode.number === number) ?? EPISODES[0];
}
