import type { Settings } from '../engine/types';

export interface SettingsPanelProps {
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
  onClose: () => void;
}

interface RowProps {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function Row({ label, desc, checked, onChange }: RowProps) {
  return (
    <button type="button" className={`setting-row${checked ? ' is-on' : ''}`} onClick={() => onChange(!checked)}>
      <span className="setting-row__text">
        <strong>{label}</strong>
        <small>{desc}</small>
      </span>
      <span className={`switch${checked ? ' is-on' : ''}`} aria-hidden="true">
        <span />
      </span>
    </button>
  );
}

export default function SettingsPanel({ settings, onChange, onClose }: SettingsPanelProps) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="设置">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__card">
        <div className="modal__head">
          <h3>播出设置</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="关闭">
            ✕
          </button>
        </div>
        <Row
          label="音效"
          desc="老电视开机、水箱、电量提示音"
          checked={!settings.muted}
          onChange={(value) => onChange({ muted: !value })}
        />
        <Row
          label="减少动画"
          desc="关闭逐字、抖动与转场特效"
          checked={settings.reducedMotion}
          onChange={(value) => onChange({ reducedMotion: value })}
        />
        <Row
          label="现场演示模式"
          desc="选项更大，支持数字键 1-4 抢答"
          checked={settings.showMode}
          onChange={(value) => onChange({ showMode: value })}
        />
        <Row
          label="菜市场环境音"
          desc="低音量底噪，建议现场外放"
          checked={settings.ambience}
          onChange={(value) => onChange({ ambience: value })}
        />
        <p className="modal__tip">数字键 1-4 选择，空格推进对白，Esc 打开或关闭本面板。</p>
      </div>
    </div>
  );
}
