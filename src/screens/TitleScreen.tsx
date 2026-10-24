import { useEffect, useRef, useState } from 'react';
import { ENDINGS } from '../story/endings';

export interface TitleScreenProps {
  hasSave: boolean;
  playerName: string;
  unlockedCount: number;
  onChangeName: (name: string) => void;
  onStart: (name: string) => void;
  onContinue: () => void;
  onGallery: () => void;
  onOpenSettings: () => void;
}

const BOOT_KEY = 'caimao.booted';

export default function TitleScreen({
  hasSave,
  playerName,
  unlockedCount,
  onChangeName,
  onStart,
  onContinue,
  onGallery,
  onOpenSettings,
}: TitleScreenProps) {
  const [booted, setBooted] = useState(() => {
    try {
      return sessionStorage.getItem(BOOT_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (booted) return;
    const schedule = [
      window.setTimeout(() => setStep(1), 1300),
      window.setTimeout(() => setStep(2), 2900),
      window.setTimeout(() => {
        setStep(3);
        setBooted(true);
        try {
          sessionStorage.setItem(BOOT_KEY, '1');
        } catch {
          /* 忽略 */
        }
      }, 4400),
    ];
    timers.current = schedule;
    return () => schedule.forEach((timer) => window.clearTimeout(timer));
  }, [booted]);

  const skipBoot = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    setBooted(true);
    try {
      sessionStorage.setItem(BOOT_KEY, '1');
    } catch {
      /* 忽略 */
    }
  };

  if (!booted) {
    return (
      <div className="boot" onClick={skipBoot} role="button" tabIndex={0} aria-label="跳过片头">
        <div className="boot__tv">
          <div className="boot__scan" aria-hidden="true" />
          <div className="boot__content">
            {step === 0 ? (
              <div className="boot__station">
                <span className="boot__station-dot" />
                幸福路电视台
              </div>
            ) : null}
            {step >= 1 ? (
              <div className="boot__logo">
                <span className="boot__cn">菜市场风云</span>
                <span className="boot__sub">今天谁先没电？</span>
              </div>
            ) : null}
            {step >= 2 ? <p className="boot__tagline">本故事改编自一个普通人的精神状态。</p> : null}
          </div>
          <div className="boot__skip">点击跳过片头</div>
        </div>
      </div>
    );
  }

  return (
    <div className="title-screen">
      <div className="title-screen__grain" aria-hidden="true" />
      <header className="title-screen__top">
        <span className="title-screen__station">幸福路电视台 · 晚间剧场</span>
        <button type="button" className="icon-btn on-paper" onClick={onOpenSettings} aria-label="设置">
          设置
        </button>
      </header>

      <main className="title-screen__main">
        <div className="logo-lockup">
          <span className="logo-lockup__eyebrow">TRAE FRIENDS 1024 · 代码盲盒</span>
          <h1 className="logo-lockup__title">
            <span className="logo-lockup__line">菜市场</span>
            <span className="logo-lockup__line is-accent">风云</span>
          </h1>
          <p className="logo-lockup__sub">今天谁先没电？</p>
          <p className="logo-lockup__slogan">菜可以不卖，电不能不剩。</p>
        </div>

        <div className="title-poster">
          <div className="title-poster__tape" aria-hidden="true" />
          <p className="title-poster__line1">一部由你亲自决定结局的</p>
          <p className="title-poster__line2">菜市场连续剧</p>
          <div className="title-poster__stats">
            <span>5 集</span>
            <span>38 个剧情节点</span>
            <span>{ENDINGS.length} 种结局</span>
          </div>
          <p className="title-poster__note">
            欢迎来到幸福路第一菜市场。
            <br />
            今天的菜很新鲜，老板的精神状态不一定。
          </p>
        </div>

        <div className="title-actions">
          <label className="name-field">
            <span>主演姓名</span>
            <input
              value={playerName}
              maxLength={10}
              onChange={(event) => onChangeName(event.target.value)}
              placeholder="靓仔"
              aria-label="主演姓名"
            />
          </label>
          <button type="button" className="btn btn--primary" onClick={() => onStart(playerName.trim() || '靓仔')}>
            <span className="btn__cn">开始营业</span>
            <span className="btn__en">START · EP.01</span>
          </button>
          {hasSave ? (
            <button type="button" className="btn btn--ghost" onClick={onContinue}>
              继续上次的营业
            </button>
          ) : null}
          <button type="button" className="btn btn--ghost" onClick={onGallery}>
            结局图鉴（{unlockedCount}/{ENDINGS.length}）
          </button>
        </div>
      </main>

      <footer className="title-screen__foot">
        <span>本剧纯属虚构，如有雷同，说明大家上班都挺累的。</span>
        <span className="title-screen__hint">数字键 1-4 选择 · 空格推进 · Esc 设置</span>
      </footer>
    </div>
  );
}
