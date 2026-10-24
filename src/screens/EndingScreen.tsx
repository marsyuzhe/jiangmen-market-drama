import { useMemo, useState } from 'react';
import type { EndingResult } from '../engine/types';
import { getEnding } from '../story/endings';
import { buildShareText, downloadPoster, posterFileName } from '../services/posterGenerator';
import { batteryTier } from '../engine/gameState';

export interface EndingScreenProps {
  result: EndingResult;
  isNew: boolean;
  unlockedCount: number;
  totalEndings: number;
  onReplay: () => void;
  onGallery: () => void;
  onHome: () => void;
}

export default function EndingScreen({
  result,
  isNew,
  unlockedCount,
  totalEndings,
  onReplay,
  onGallery,
  onHome,
}: EndingScreenProps) {
  const ending = getEnding(result.endingId);
  const tier = batteryTier(result.finalBattery);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const paletteVars = useMemo(
    () =>
      ({
        '--poster-bg': ending.palette.bg,
        '--poster-accent': ending.palette.accent,
        '--poster-soft': ending.palette.accentSoft,
        '--poster-ink': ending.palette.ink,
        '--poster-badge': ending.palette.badge,
      }) as React.CSSProperties,
    [ending],
  );

  const handleSave = async () => {
    setSaving(true);
    setMessage('正在冲洗底片……');
    try {
      await downloadPoster(result);
      setMessage(`已保存：${posterFileName(result)}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '海报生成失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    const text = buildShareText(result);
    try {
      await navigator.clipboard.writeText(text);
      setMessage('结局文案已复制，可以直接发朋友圈了。');
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      setMessage(ok ? '结局文案已复制。' : '复制失败，请长按选择文字。');
    }
  };

  return (
    <div className="ending-screen" style={paletteVars}>
      <div className="ending-screen__grain" aria-hidden="true" />
      <header className="ending-screen__top">
        <span>幸福路电视台 · 本剧终</span>
        <span className="ending-screen__count">
          结局收集 {unlockedCount}/{totalEndings}
        </span>
      </header>

      <main className="ending-main">
        <section className="ending-report">
          {isNew ? <div className="ending-report__new">新结局解锁</div> : null}
          <p className="ending-report__eyebrow">结局 {ending.letter} · 今日剩余电量 {result.finalBattery}%</p>
          <h1 className="ending-report__title">{ending.title}</h1>
          <div className="ending-report__award">{ending.award}</div>
          <p className="ending-report__subtitle">{ending.subtitle}</p>

          <blockquote className="ending-report__quote">「{ending.quote}」</blockquote>

          <div className="ending-report__meta">
            <div>
              <span>领衔主演</span>
              <strong>{result.playerName}</strong>
            </div>
            <div>
              <span>最终电量</span>
              <strong style={{ color: tier.color }}>
                {result.finalBattery}% · {tier.label}
              </strong>
            </div>
          </div>

          <div className="ending-report__tags">
            {result.tags.map((tag) => (
              <span key={tag} className="tag is-strong">
                {tag}
              </span>
            ))}
          </div>

          <div className="ending-report__actions">
            <button type="button" className="btn btn--primary" onClick={handleSave} disabled={saving}>
              {saving ? '正在生成海报…' : '保存结局海报（1080×1920 PNG）'}
            </button>
            <button type="button" className="btn btn--ghost" onClick={handleCopy}>
              复制结局文案
            </button>
            <button type="button" className="btn btn--ghost" onClick={onReplay}>
              再演一次
            </button>
            <button type="button" className="btn btn--ghost" onClick={onGallery}>
              查看结局图鉴
            </button>
            <button type="button" className="btn btn--ghost" onClick={onHome}>
              回到片头
            </button>
          </div>
          {message ? <p className="ending-report__msg">{message}</p> : null}
        </section>

        <aside className="poster-preview" aria-label="结局海报预览">
          <div className="poster-preview__poster">
            <div className="poster-preview__band">
              <span>幸福路电视台 · 菜市场剧组</span>
              <strong>今天谁先没电？</strong>
            </div>
            <div className="poster-preview__award">{ending.award}</div>
            <h2 className="poster-preview__title">{ending.title}</h2>
            <p className="poster-preview__sub">{ending.subtitle}</p>
            <p className="poster-preview__star">领衔主演：{result.playerName}</p>
            <div className="poster-preview__scene" aria-hidden="true">
              <span className="poster-preview__sun" />
              <span className="poster-preview__awning" />
              <span className="poster-preview__tomato">
                <i />
              </span>
              <span className="poster-preview__people" />
            </div>
            <div className="poster-preview__battery">
              <span className="poster-preview__label">今日剩余电量</span>
              <div className="poster-preview__bar">
                <span style={{ width: `${result.finalBattery}%`, background: tier.color }} />
                <b>{result.finalBattery}%</b>
              </div>
              <span className="poster-preview__tier" style={{ color: tier.color }}>
                {tier.label}
              </span>
            </div>
            <div className="poster-preview__quote">「{ending.quote}」</div>
            <div className="poster-preview__tags">
              {result.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="poster-preview__foot">
              <strong>菜可以不卖，电不能不剩。</strong>
              <span>《菜市场风云：今天谁先没电？》</span>
            </div>
            <div className="poster-preview__stamp">{ending.stamp}</div>
          </div>
          <p className="poster-preview__hint">点击左侧按钮可下载同一版式的高清海报</p>
        </aside>
      </main>
    </div>
  );
}
