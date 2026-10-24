/**
 * 剧情完整性校验：
 * - 所有跳转目标存在，无不可达节点
 * - 任意可达状态下都有可选项（不卡死）
 * - 所有结局在真实选择路径下可达
 * - 单周目关键选择次数落在 8–12 次
 * - 电量始终在 0–100
 *
 * 运行：npm run validate
 * 说明：借助 esbuild 把 TS 剧情模块打包成临时 ESM 后执行，无需额外依赖。
 */
import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const entry = `
export { SCENES, SCENE_INDEX } from './src/story/scenes';
export { ENDINGS, getEnding } from './src/story/endings';
export { EPISODES } from './src/story/episodes';
export { resolveEnding } from './src/engine/endingResolver';
export { applyChoice, visibleChoices, isFinalScene } from './src/engine/storyEngine';
export { createGame } from './src/engine/gameState';
`;

const cacheDir = join(tmpdir(), 'market-drama-validate');
mkdirSync(cacheDir, { recursive: true });
const outfile = join(cacheDir, 'story-bundle.mjs');

await build({
  stdin: { contents: entry, resolveDir: process.cwd(), loader: 'ts' },
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile,
  logLevel: 'silent',
});

const {
  SCENES,
  SCENE_INDEX,
  ENDINGS,
  EPISODES,
  resolveEnding,
  applyChoice,
  visibleChoices,
  isFinalScene,
  createGame,
} = await import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);

// ── 1. 节点自身检查 ─────────────────────────────
const ids = new Set();
for (const scene of SCENES) {
  if (ids.has(scene.id)) fail(`节点 id 重复：${scene.id}`);
  ids.add(scene.id);
  if (!scene.lines || scene.lines.length === 0) fail(`节点 ${scene.id} 没有台词`);
  if (!scene.choices && !scene.next && !scene.episodeEnd) {
    if (!isFinalScene(scene)) fail(`节点 ${scene.id} 没有出口也没有结局标记`);
  }
  if (scene.choices && scene.choices.length < 2) fail(`节点 ${scene.id} 的选项少于 2 个`);
  for (const choice of scene.choices ?? []) {
    if (!SCENE_INDEX[choice.nextSceneId]) {
      fail(`节点 ${scene.id} 的选项 ${choice.id} 指向不存在的节点 ${choice.nextSceneId}`);
    }
    if (Math.abs(choice.batteryDelta) > 30) {
      warnings.push(`选项 ${choice.id} 电量变化较大（${choice.batteryDelta}）`);
    }
  }
  if (scene.next && !SCENE_INDEX[scene.next]) fail(`节点 ${scene.id} 的 next 指向不存在的节点 ${scene.next}`);
  if (scene.episodeEnd && !SCENE_INDEX[scene.episodeEnd.nextSceneId]) {
    fail(`节点 ${scene.id} 的集末转场指向不存在的节点 ${scene.episodeEnd.nextSceneId}`);
  }
}

// ── 2. 可达性 / 分支模拟 ─────────────────────────
const start = createGame('校验员');
const endingsHit = new Map();
const visitedScenes = new Set();
let minChoices = Infinity;
let maxChoices = 0;
let pathCount = 0;
const deadEnds = [];
const seen = new Set();
const stack = [{ state: start, path: [] }];

while (stack.length > 0) {
  const { state, path } = stack.pop();
  const scene = SCENE_INDEX[state.sceneId];
  if (!scene) {
    fail(`模拟进入不存在的节点 ${state.sceneId}（来自 ${path.join(' → ')}）`);
    continue;
  }
  visitedScenes.add(scene.id);
  if (state.battery < 0 || state.battery > 100) fail(`电量越界 ${state.battery}（${scene.id}）`);

  const key = `${scene.id}|${state.battery}|${[...state.flags].sort().join(',')}`;
  if (seen.has(key)) continue;
  seen.add(key);

  if (scene.choices && scene.choices.length > 0) {
    const available = visibleChoices(scene, state);
    if (available.length === 0) {
      deadEnds.push(`${scene.id}（电量 ${state.battery}，标记 ${state.flags.join(',') || '无'}）`);
      continue;
    }
    for (const choice of available) {
      stack.push({
        state: applyChoice(state, choice),
        path: [...path, `${scene.id}:${choice.id}`],
      });
    }
    continue;
  }

  if (scene.episodeEnd) {
    stack.push({ state: { ...state, sceneId: scene.episodeEnd.nextSceneId }, path });
    continue;
  }

  if (scene.next) {
    stack.push({ state: { ...state, sceneId: scene.next }, path });
    continue;
  }

  // 终局
  pathCount += 1;
  minChoices = Math.min(minChoices, state.choicesMade);
  maxChoices = Math.max(maxChoices, state.choicesMade);
  const result = resolveEnding(state);
  if (!endingsHit.has(result.endingId)) endingsHit.set(result.endingId, { path, battery: state.battery });
}

for (const scene of SCENES) {
  if (!visitedScenes.has(scene.id)) fail(`节点 ${scene.id} 从开局无法到达`);
}
if (deadEnds.length > 0) fail(`存在无可用选项的死路：\n    ${deadEnds.join('\n    ')}`);

// ── 3. 结局可达性 ───────────────────────────────
for (const ending of ENDINGS) {
  if (!endingsHit.has(ending.id)) fail(`结局 ${ending.letter}《${ending.title}》在模拟中不可达`);
}

// ── 4. 选择次数与集数 ───────────────────────────
if (minChoices < 8 || minChoices > 12) fail(`单周目最少选择次数 ${minChoices}，不在 8–12 范围`);
if (maxChoices < 8 || maxChoices > 12) fail(`单周目最多选择次数 ${maxChoices}，不在 8–12 范围`);

const episodeNumbers = EPISODES.map((ep) => ep.number);
for (const number of episodeNumbers) {
  if (!SCENES.some((scene) => scene.episode === number)) fail(`第 ${number} 集没有任何节点`);
}
if (EPISODES.length < 5) fail(`集数不足 5，当前 ${EPISODES.length}`);
if (SCENES.length < 16) fail(`剧情节点不足 16，当前 ${SCENES.length}`);

const choiceSets = SCENES.filter((scene) => scene.choices && scene.choices.length > 0).length;

// ── 5. 输出 ─────────────────────────────────────
console.log('── 剧情校验 ────────────────────────────');
console.log(`节点：${SCENES.length} 个，可达：${visitedScenes.size} 个`);
console.log(`含选项节点：${choiceSets} 个，总选项：${SCENES.reduce((sum, s) => sum + (s.choices?.length ?? 0), 0)} 条`);
console.log(`模拟完整路径：${pathCount} 条（去重状态 ${seen.size} 个）`);
console.log(`单周目选择次数：${minChoices}–${maxChoices}`);
console.log(`集数：${EPISODES.length}（节点分布 ${episodeNumbers.map((n) => `EP${n}:${SCENES.filter((s) => s.episode === n).length}`).join(' / ')}）`);
console.log('结局命中：');
for (const ending of ENDINGS) {
  const hit = endingsHit.get(ending.id);
  console.log(
    hit
      ? `  ✓ ${ending.letter}《${ending.title}》 电量 ${hit.battery}%  路径 ${hit.path.length} 步`
      : `  ✗ ${ending.letter}《${ending.title}》 不可达`,
  );
}
for (const warning of warnings) console.log(`  ! ${warning}`);

if (errors.length > 0) {
  console.error('\n✗ 校验失败：');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log('\n✓ 全部校验通过');
