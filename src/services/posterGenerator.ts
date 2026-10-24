import type { EndingDef, EndingResult } from '../engine/types';
import { getEnding } from '../story/endings';
import { batteryTier } from '../engine/gameState';

const W = 1080;
const H = 1920;
const FONT_SANS =
  '"Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "SimHei", sans-serif';
const FONT_DISPLAY =
  '"Microsoft YaHei", "PingFang SC", "Noto Sans SC", "Heiti SC", "SimHei", sans-serif';

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  let current = '';
  for (const char of text) {
    const next = current + char;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = char;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  color: string,
  align: CanvasTextAlign = 'left',
): void {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

function drawPaper(ctx: CanvasRenderingContext2D, ending: EndingDef, rng: () => number): void {
  ctx.fillStyle = ending.palette.bg;
  ctx.fillRect(0, 0, W, H);

  // 旧纸纤维
  ctx.save();
  for (let i = 0; i < 900; i += 1) {
    const x = rng() * W;
    const y = rng() * H;
    ctx.fillStyle = rng() > 0.5 ? 'rgba(36,32,25,0.045)' : 'rgba(255,255,255,0.35)';
    ctx.fillRect(x, y, rng() * 6 + 1, rng() * 3 + 1);
  }
  // 印刷套色偏移的大淡字
  ctx.globalAlpha = 0.06;
  drawText(ctx, '菜市场风云', W / 2 + 16, 980, `900 220px ${FONT_DISPLAY}`, ending.palette.accent, 'center');
  ctx.globalAlpha = 1;
  // 边缘暗角
  const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.72);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(36,32,25,0.18)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function drawHeader(ctx: CanvasRenderingContext2D, ending: EndingDef): void {
  ctx.save();
  ctx.fillStyle = ending.palette.accent;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(W, 0);
  ctx.lineTo(W, 150);
  for (let x = W; x > 0; x -= 42) {
    ctx.lineTo(x, 150 + (x % 84 === 0 ? 16 : 0));
  }
  ctx.lineTo(0, 150);
  ctx.closePath();
  ctx.fill();

  drawText(ctx, '幸福路电视台 · 菜市场剧组', W / 2, 62, `700 28px ${FONT_SANS}`, 'rgba(255,255,255,0.82)', 'center');
  drawText(ctx, '《菜市场风云：今天谁先没电？》', W / 2, 112, `900 40px ${FONT_DISPLAY}`, '#FFF9EC', 'center');

  // 右上角台标
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(W - 74, 46, 34, 0, Math.PI * 2);
  ctx.stroke();
  drawText(ctx, 'HR', W - 74, 52, `900 22px ${FONT_SANS}`, 'rgba(255,255,255,0.8)', 'center');
  drawText(ctx, '1024', W - 74, 76, `700 16px ${FONT_SANS}`, 'rgba(255,255,255,0.7)', 'center');
  ctx.restore();
}

function drawAwardBadge(ctx: CanvasRenderingContext2D, ending: EndingDef): void {
  ctx.save();
  ctx.font = `900 40px ${FONT_DISPLAY}`;
  const textWidth = ctx.measureText(ending.award).width;
  const width = Math.min(W - 160, textWidth + 96);
  const x = (W - width) / 2;
  const y = 196;
  roundRect(ctx, x, y, width, 68, 8);
  ctx.fillStyle = ending.palette.ink;
  ctx.fill();
  roundRect(ctx, x + 6, y + 6, width - 12, 56, 6);
  ctx.fillStyle = ending.palette.badge;
  ctx.fill();
  drawText(ctx, ending.award, W / 2, y + 47, `900 36px ${FONT_DISPLAY}`, ending.palette.ink, 'center');
  ctx.restore();
}

function drawTitleBlock(ctx: CanvasRenderingContext2D, ending: EndingDef, result: EndingResult): void {
  ctx.save();
  const maxWidth = W - 160;
  let fontSize = 112;
  ctx.font = `900 ${fontSize}px ${FONT_DISPLAY}`;
  while (ctx.measureText(ending.title).width > maxWidth && fontSize > 64) {
    fontSize -= 6;
    ctx.font = `900 ${fontSize}px ${FONT_DISPLAY}`;
  }
  const titleY = 372;

  // 套色偏移
  ctx.globalAlpha = 0.55;
  drawText(ctx, ending.title, W / 2 + 9, titleY + 9, `900 ${fontSize}px ${FONT_DISPLAY}`, ending.palette.accent, 'center');
  ctx.globalAlpha = 1;
  ctx.lineJoin = 'round';
  ctx.lineWidth = 12;
  ctx.strokeStyle = ending.palette.bg;
  ctx.font = `900 ${fontSize}px ${FONT_DISPLAY}`;
  ctx.textAlign = 'center';
  ctx.strokeText(ending.title, W / 2, titleY);
  drawText(ctx, ending.title, W / 2, titleY, `900 ${fontSize}px ${FONT_DISPLAY}`, ending.palette.ink, 'center');

  // 副标题
  ctx.font = `400 30px ${FONT_SANS}`;
  const subLines = wrapText(ctx, ending.subtitle, maxWidth);
  subLines.forEach((line, index) => {
    drawText(ctx, line, W / 2, 430 + index * 44, `400 28px ${FONT_SANS}`, 'rgba(36,32,25,0.72)', 'center');
  });

  drawText(
    ctx,
    `领衔主演：${result.playerName}`,
    W / 2,
    556,
    `700 26px ${FONT_SANS}`,
    'rgba(36,32,25,0.55)',
    'center',
  );
  ctx.restore();
}

function drawTomato(
  ctx: CanvasRenderingContext2D,
  ending: EndingDef,
  cx: number,
  cy: number,
  r: number,
): void {
  ctx.save();
  // 影子
  ctx.fillStyle = 'rgba(36,32,25,0.18)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 1.02, r * 0.95, r * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // 身体
  const grad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.2, cx, cy, r * 1.05);
  grad.addColorStop(0, '#E24A3C');
  grad.addColorStop(1, '#B2231F');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(cx, cy, r, r * 0.92, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#242019';
  ctx.stroke();

  // 高光
  ctx.globalAlpha = 0.32;
  ctx.fillStyle = '#FFF3D6';
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.38, cy - r * 0.42, r * 0.22, r * 0.15, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // 叶子
  ctx.fillStyle = '#347A48';
  ctx.strokeStyle = '#242019';
  ctx.lineWidth = 6;
  for (let i = 0; i < 5; i += 1) {
    const angle = -Math.PI / 2 + (i - 2) * 0.42;
    const len = r * 0.46;
    ctx.beginPath();
    ctx.ellipse(
      cx + Math.cos(angle) * len * 0.6,
      cy - r * 0.86 + Math.sin(angle) * len * 0.3,
      len * 0.46,
      len * 0.22,
      angle,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.9);
  ctx.lineTo(cx, cy - r * 1.2);
  ctx.strokeStyle = '#242019';
  ctx.lineWidth = 10;
  ctx.stroke();

  // 表情
  const eyeY = cy - r * 0.12;
  const eyeDX = r * 0.34;
  ctx.strokeStyle = '#242019';
  ctx.fillStyle = '#242019';
  ctx.lineWidth = 7;

  if (ending.id === 'studio') {
    // 墨镜
    ctx.fillStyle = '#242019';
    roundRect(ctx, cx - r * 0.66, eyeY - r * 0.2, r * 0.58, r * 0.36, r * 0.12);
    ctx.fill();
    roundRect(ctx, cx + r * 0.08, eyeY - r * 0.2, r * 0.58, r * 0.36, r * 0.12);
    ctx.fill();
    ctx.fillRect(cx - r * 0.1, eyeY - r * 0.08, r * 0.2, r * 0.08);
  } else if (ending.id === 'shutdown') {
    ctx.beginPath();
    ctx.moveTo(cx - eyeDX - r * 0.18, eyeY);
    ctx.lineTo(cx - eyeDX + r * 0.16, eyeY - r * 0.02);
    ctx.moveTo(cx + eyeDX - r * 0.16, eyeY - r * 0.02);
    ctx.lineTo(cx + eyeDX + r * 0.18, eyeY);
    ctx.stroke();
  } else if (ending.id === 'star') {
    // 星星眼
    for (const dx of [-eyeDX, eyeDX]) {
      ctx.save();
      ctx.translate(cx + dx, eyeY);
      ctx.fillStyle = '#F4CE46';
      ctx.beginPath();
      for (let i = 0; i < 10; i += 1) {
        const radius = i % 2 === 0 ? r * 0.2 : r * 0.09;
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  } else {
    for (const dx of [-eyeDX, eyeDX]) {
      ctx.beginPath();
      ctx.ellipse(cx + dx, eyeY, r * 0.1, r * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#FFF3D6';
    for (const dx of [-eyeDX, eyeDX]) {
      ctx.beginPath();
      ctx.arc(cx + dx + r * 0.035, eyeY - r * 0.045, r * 0.035, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // 嘴巴
  ctx.beginPath();
  if (ending.id === 'leader' || ending.id === 'ordinary') {
    ctx.arc(cx, cy + r * 0.22, r * 0.28, 0.15, Math.PI - 0.15);
  } else if (ending.id === 'star') {
    ctx.ellipse(cx, cy + r * 0.28, r * 0.2, r * 0.16, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#6E1B18';
    ctx.fill();
  } else if (ending.id === 'shutdown') {
    ctx.moveTo(cx - r * 0.18, cy + r * 0.3);
    ctx.quadraticCurveTo(cx, cy + r * 0.22, cx + r * 0.18, cy + r * 0.3);
  } else {
    ctx.moveTo(cx - r * 0.22, cy + r * 0.28);
    ctx.lineTo(cx + r * 0.22, cy + r * 0.28);
  }
  ctx.stroke();

  // 腮红
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#F2926A';
  for (const dx of [-r * 0.55, r * 0.55]) {
    ctx.beginPath();
    ctx.ellipse(cx + dx, cy + r * 0.16, r * 0.12, r * 0.07, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 结局道具
  if (ending.id === 'leader') {
    ctx.fillStyle = '#F4CE46';
    ctx.strokeStyle = '#242019';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx - r * 0.62, cy + r * 0.5, r * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    drawText(ctx, '奖', cx - r * 0.62, cy + r * 0.56, `900 ${Math.round(r * 0.22)}px ${FONT_SANS}`, '#242019', 'center');
  } else if (ending.id === 'star') {
    // 补光灯
    ctx.strokeStyle = '#F4CE46';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.42, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.strokeStyle = '#242019';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.42, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    // 手机
    ctx.save();
    ctx.translate(cx + r * 0.78, cy + r * 0.42);
    ctx.rotate(0.2);
    roundRect(ctx, -r * 0.16, -r * 0.3, r * 0.32, r * 0.6, r * 0.05);
    ctx.fillStyle = '#242019';
    ctx.fill();
    ctx.restore();
  } else if (ending.id === 'shutdown') {
    // 电量图标
    ctx.save();
    ctx.translate(cx + r * 0.66, cy - r * 0.62);
    roundRect(ctx, 0, 0, 62, 30, 4);
    ctx.strokeStyle = '#242019';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = '#C62828';
    ctx.fillRect(8, 7, 12, 16);
    ctx.beginPath();
    ctx.moveTo(62, 11);
    ctx.lineTo(70, 11);
    ctx.lineTo(70, 23);
    ctx.lineTo(62, 23);
    ctx.fillStyle = '#242019';
    ctx.fill();
    drawText(ctx, '1%', 0, 58, `900 24px ${FONT_SANS}`, '#C62828', 'left');
    ctx.restore();
  } else if (ending.id === 'studio') {
    // 场记板
    ctx.save();
    ctx.translate(cx + r * 0.72, cy - r * 0.8);
    ctx.rotate(-0.18);
    roundRect(ctx, 0, 0, 180, 110, 6);
    ctx.fillStyle = '#242019';
    ctx.fill();
    ctx.fillStyle = '#F3E8CC';
    for (let i = 0; i < 5; i += 1) {
      ctx.save();
      ctx.translate(8 + i * 34, 8);
      ctx.rotate(0.3);
      ctx.fillRect(0, 0, 16, 30);
      ctx.restore();
    }
    drawText(ctx, 'TAKE 05', 90, 88, `900 30px ${FONT_SANS}`, '#F4CE46', 'center');
    ctx.restore();
  }
  ctx.restore();
}

function drawMarketScene(ctx: CanvasRenderingContext2D, ending: EndingDef, rng: () => number): void {
  const x = 60;
  const y = 600;
  const w = W - 120;
  const h = 560;

  ctx.save();
  roundRect(ctx, x, y, w, h, 18);
  ctx.fillStyle = ending.palette.accentSoft;
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#242019';
  ctx.stroke();
  roundRect(ctx, x + 10, y + 10, w - 20, h - 20, 12);
  ctx.clip();

  // 天空
  const sky = ctx.createLinearGradient(0, y, 0, y + h);
  sky.addColorStop(0, 'rgba(255,255,255,0.55)');
  sky.addColorStop(1, 'rgba(255,255,255,0.05)');
  ctx.fillStyle = sky;
  ctx.fillRect(x + 10, y + 10, w - 20, h - 20);

  // 太阳
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = ending.palette.badge;
  ctx.beginPath();
  ctx.arc(x + w - 130, y + 120, 62, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // 远处楼群剪影
  ctx.fillStyle = 'rgba(36,32,25,0.16)';
  let bx = x + 20;
  while (bx < x + w - 20) {
    const bw = 50 + rng() * 70;
    const bh = 60 + rng() * 110;
    ctx.fillRect(bx, y + h - 300 - bh, bw, bh + 40);
    bx += bw + 12;
  }

  // 三顶棚子
  const awningY = y + 210;
  const awningColors = [ending.palette.accent, ending.palette.ink, '#347A48'];
  for (let i = 0; i < 3; i += 1) {
    const ax = x + 40 + i * ((w - 80) / 3);
    const aw = (w - 80) / 3 - 16;
    ctx.save();
    ctx.fillStyle = awningColors[i % awningColors.length];
    ctx.beginPath();
    ctx.moveTo(ax, awningY);
    ctx.lineTo(ax + aw, awningY);
    ctx.lineTo(ax + aw - 14, awningY + 56);
    ctx.lineTo(ax + 14, awningY + 56);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#242019';
    ctx.lineWidth = 5;
    ctx.stroke();
    // 条纹
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = '#FFF6E2';
    for (let s = 0; s < 5; s += 1) {
      ctx.fillRect(ax + 16 + s * ((aw - 20) / 5), awningY + 4, 12, 48);
    }
    ctx.globalAlpha = 1;
    // 立柱与台面
    ctx.fillStyle = 'rgba(36,32,25,0.75)';
    ctx.fillRect(ax + 8, awningY + 56, 10, 150);
    ctx.fillRect(ax + aw - 18, awningY + 56, 10, 150);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillRect(ax + 10, awningY + 170, aw + -20 + 10, 36);
    ctx.strokeStyle = '#242019';
    ctx.lineWidth = 4;
    ctx.strokeRect(ax + 10, awningY + 170, aw - 10, 36);
    // 菜筐
    ctx.fillStyle = ending.palette.accentSoft;
    ctx.strokeStyle = '#242019';
    ctx.lineWidth = 4;
    for (let c = 0; c < 2; c += 1) {
      const cx = ax + 22 + c * 44;
      const cy = awningY + 132;
      roundRect(ctx, cx, cy, 38, 30, 4);
      ctx.fill();
      ctx.stroke();
    }
    // 番茄堆
    ctx.fillStyle = '#C62828';
    for (let t = 0; t < 5; t += 1) {
      ctx.beginPath();
      ctx.arc(ax + 40 + t * 22 + rng() * 6, awningY + 126 + rng() * 8, 11, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 彩旗
  ctx.strokeStyle = 'rgba(36,32,25,0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 16, y + 120);
  ctx.quadraticCurveTo(x + w / 2, y + 170, x + w - 16, y + 116);
  ctx.stroke();
  for (let i = 1; i < 10; i += 1) {
    const px = x + 16 + (i * (w - 32)) / 10;
    const py = y + 120 + Math.sin((i / 10) * Math.PI) * 48;
    ctx.fillStyle = i % 2 === 0 ? ending.palette.badge : ending.palette.accent;
    ctx.beginPath();
    ctx.moveTo(px - 13, py);
    ctx.lineTo(px + 13, py);
    ctx.lineTo(px, py + 30);
    ctx.closePath();
    ctx.fill();
  }

  // 人群剪影
  for (let i = 0; i < 7; i += 1) {
    const px = x + 60 + i * ((w - 120) / 7) + rng() * 20;
    const py = y + h - 150 + rng() * 12;
    const pr = 26 + rng() * 12;
    ctx.fillStyle = 'rgba(36,32,25,0.55)';
    ctx.beginPath();
    ctx.arc(px, py - pr * 1.6, pr * 0.5, 0, Math.PI * 2);
    ctx.fill();
    roundRect(ctx, px - pr * 0.62, py - pr * 1.3, pr * 1.24, pr * 1.7, pr * 0.42);
    ctx.fill();
  }

  // 地面
  ctx.fillStyle = 'rgba(36,32,25,0.12)';
  ctx.fillRect(x + 10, y + h - 130, w - 20, 120);

  drawTomato(ctx, ending, x + w / 2, y + h - 185, 96);

  // 片名小牌
  ctx.save();
  ctx.translate(x + 44, y + 44);
  ctx.rotate(-0.03);
  ctx.fillStyle = 'rgba(243,232,204,0.92)';
  ctx.strokeStyle = '#242019';
  ctx.lineWidth = 4;
  ctx.fillRect(0, 0, 300, 62);
  ctx.strokeRect(0, 0, 300, 62);
  drawText(ctx, '幸福路第一菜市场', 150, 42, `700 24px ${FONT_SANS}`, '#242019', 'center');
  ctx.restore();

  ctx.restore();
}

function drawBattery(ctx: CanvasRenderingContext2D, ending: EndingDef, result: EndingResult): void {
  const tier = batteryTier(result.finalBattery);
  const x = 210;
  const y = 1250;
  const w = 600;
  const h = 170;

  drawText(ctx, '今日剩余电量', W / 2, 1210, `700 30px ${FONT_SANS}`, 'rgba(36,32,25,0.65)', 'center');

  ctx.save();
  roundRect(ctx, x, y, w, h, 16);
  ctx.fillStyle = 'rgba(36,32,25,0.08)';
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = ending.palette.ink;
  ctx.stroke();

  // 电池正极
  roundRect(ctx, x + w + 8, y + h * 0.32, 26, h * 0.36, 6);
  ctx.fillStyle = ending.palette.ink;
  ctx.fill();

  // 电量
  const innerW = w - 28;
  const fillW = Math.max(8, (innerW * result.finalBattery) / 100);
  roundRect(ctx, x + 14, y + 14, innerW, h - 28, 10);
  ctx.save();
  ctx.clip();
  const grad = ctx.createLinearGradient(x, 0, x + w, 0);
  grad.addColorStop(0, tier.color);
  grad.addColorStop(1, tier.color);
  ctx.fillStyle = grad;
  ctx.fillRect(x + 14, y + 14, fillW, h - 28);
  // 分段纹理
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = '#000';
  for (let i = 1; i < 10; i += 1) {
    ctx.fillRect(x + 14 + (innerW / 10) * i, y + 14, 4, h - 28);
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  drawText(
    ctx,
    `${result.finalBattery}%`,
    W / 2,
    y + h / 2 + 26,
    `900 72px ${FONT_DISPLAY}`,
    result.finalBattery > 45 ? '#242019' : '#FFF6E2',
    'center',
  );
  drawText(ctx, tier.label, W / 2, y + h + 52, `700 30px ${FONT_SANS}`, tier.color, 'center');
  ctx.restore();
}

function drawQuote(ctx: CanvasRenderingContext2D, ending: EndingDef, result: EndingResult): void {
  const x = 90;
  const y = 1500;
  const w = W - 180;
  const h = 210;

  ctx.save();
  roundRect(ctx, x, y, w, h, 14);
  ctx.fillStyle = '#FFF9EC';
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.strokeStyle = ending.palette.ink;
  ctx.stroke();

  // 胶带
  ctx.save();
  ctx.translate(x + 70, y + 6);
  ctx.rotate(-0.08);
  ctx.fillStyle = 'rgba(244,206,70,0.85)';
  ctx.fillRect(-60, -16, 140, 34);
  ctx.restore();
  ctx.save();
  ctx.translate(x + w - 80, y + h - 10);
  ctx.rotate(0.06);
  ctx.fillStyle = 'rgba(244,206,70,0.7)';
  ctx.fillRect(-50, -14, 120, 30);
  ctx.restore();

  drawText(ctx, '「', x + 28, y + 100, `900 96px ${FONT_SANS}`, ending.palette.accent, 'left');

  ctx.font = `700 38px ${FONT_SANS}`;
  const lines = wrapText(ctx, ending.quote, w - 150);
  const startY = h / 2 + 18 - ((lines.length - 1) * 28);
  lines.slice(0, 3).forEach((line, index) => {
    drawText(ctx, line, x + 110, y + startY + index * 54, `700 38px ${FONT_SANS}`, '#242019', 'left');
  });

  drawText(
    ctx,
    `—— ${result.playerName}`,
    x + w - 46,
    y + h - 26,
    `400 24px ${FONT_SANS}`,
    'rgba(36,32,25,0.55)',
    'right',
  );
  ctx.restore();
}

function drawTags(ctx: CanvasRenderingContext2D, ending: EndingDef, tags: string[]): void {
  ctx.save();
  ctx.font = `700 28px ${FONT_SANS}`;
  const widths = tags.map((tag) => ctx.measureText(tag).width + 44);
  const gap = 18;
  const total = widths.reduce((sum, value) => sum + value, 0) + gap * (tags.length - 1);
  let x = (W - total) / 2;
  const y = 1752;
  tags.forEach((tag, index) => {
    roundRect(ctx, x, y, widths[index], 54, 27);
    ctx.fillStyle = index === 0 ? ending.palette.accent : 'rgba(36,32,25,0.1)';
    ctx.fill();
    drawText(
      ctx,
      tag,
      x + widths[index] / 2,
      y + 36,
      `700 28px ${FONT_SANS}`,
      index === 0 ? '#FFF6E2' : '#242019',
      'center',
    );
    x += widths[index] + gap;
  });
  ctx.restore();
}

function drawFooter(ctx: CanvasRenderingContext2D, ending: EndingDef): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(36,32,25,0.25)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(90, 1838);
  ctx.lineTo(W - 90, 1838);
  ctx.stroke();

  drawText(
    ctx,
    '菜可以不卖，电不能不剩。',
    W / 2,
    1880,
    `900 32px ${FONT_DISPLAY}`,
    ending.palette.accent,
    'center',
  );
  drawText(
    ctx,
    '《菜市场风云：今天谁先没电？》 · TRAE FRIENDS 1024',
    W / 2,
    1912,
    `400 20px ${FONT_SANS}`,
    'rgba(36,32,25,0.5)',
    'center',
  );
  ctx.restore();
}

function drawStamp(ctx: CanvasRenderingContext2D, ending: EndingDef): void {
  ctx.save();
  ctx.translate(W - 150, 1010);
  ctx.rotate(-0.16);
  ctx.strokeStyle = 'rgba(198,40,40,0.75)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 78, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 64, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(198,40,40,0.85)';
  ctx.font = `900 34px ${FONT_DISPLAY}`;
  ctx.textAlign = 'center';
  ctx.fillText(ending.stamp, 0, 2);
  ctx.font = `700 18px ${FONT_SANS}`;
  ctx.fillText('幸福路', 0, 32);
  ctx.fillText('已验收', 0, -26);
  ctx.restore();
}

export async function generatePosterBlob(result: EndingResult): Promise<Blob> {
  const ending = getEnding(result.endingId);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('当前浏览器不支持 Canvas 海报生成');

  const rng = mulberry32(hashString(result.endingId + result.playerName));
  ctx.textBaseline = 'alphabetic';

  drawPaper(ctx, ending, rng);
  drawHeader(ctx, ending);
  drawAwardBadge(ctx, ending);
  drawTitleBlock(ctx, ending, result);
  drawMarketScene(ctx, ending, rng);
  drawStamp(ctx, ending);
  drawBattery(ctx, ending, result);
  drawQuote(ctx, ending, result);
  drawTags(ctx, ending, result.tags);
  drawFooter(ctx, ending);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('海报生成失败，请重试'));
    }, 'image/png');
  });
}

export function posterFileName(result: EndingResult): string {
  const ending = getEnding(result.endingId);
  const safeName = result.playerName.replace(/[\\/:*?"<>|\s]/g, '');
  return `菜市场风云-${ending.title}-${safeName || '靓仔'}.png`;
}

export async function downloadPoster(result: EndingResult): Promise<void> {
  const blob = await generatePosterBlob(result);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = posterFileName(result);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 6000);
}

export function buildShareText(result: EndingResult): string {
  const ending = getEnding(result.endingId);
  return [
    '《菜市场风云：今天谁先没电？》',
    `领衔主演：${result.playerName}`,
    `结局 ${ending.letter}：${ending.title}`,
    `${ending.award}`,
    `今日剩余电量：${result.finalBattery}%`,
    `「${ending.quote}」`,
    result.tags.join(' '),
    '#菜市场风云 #TRAE1024 #今天谁先没电',
  ].join('\n');
}
