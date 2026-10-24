import type { GameState } from '../engine/types';
import { batteryTier } from '../engine/gameState';

export interface BatteryMeterProps {
  battery: number;
  delta?: number | null;
}

const SEGMENTS = 10;

export default function BatteryMeter({ battery, delta }: BatteryMeterProps) {
  const tier = batteryTier(battery);
  return (
    <div className="battery" aria-label={`精神电量 ${battery}%`}>
      <div className="battery__head">
        <span className="battery__title">精神电量</span>
        <span className="battery__value" style={{ color: tier.color }}>
          {battery}%
        </span>
      </div>
      <div className="battery__body">
        <div className="battery__shell">
          {Array.from({ length: SEGMENTS }, (_, index) => {
            const threshold = ((index + 1) / SEGMENTS) * 100;
            const filled = battery >= threshold - 100 / SEGMENTS / 2;
            return (
              <span
                key={index}
                className={`battery__seg${filled ? ' is-on' : ''}`}
                style={{ background: filled ? tier.color : undefined }}
              />
            );
          })}
          <span className="battery__cap" style={{ background: tier.color }} />
        </div>
        <div className={`battery__pulse is-${tier.key}`} aria-hidden="true" />
      </div>
      <div className="battery__foot">
        <span className="battery__tier" style={{ color: tier.color }}>
          {tier.label}
        </span>
        <span className="battery__hint">{tier.hint}</span>
      </div>
      {delta !== null && delta !== undefined ? (
        <div className={`battery__delta ${delta >= 0 ? 'is-up' : 'is-down'}`} key={`${battery}-${delta}`}>
          {delta > 0 ? `+${delta}%` : `${delta}%`}
        </div>
      ) : null}
    </div>
  );
}

export function batteryTags(state: GameState): string[] {
  const tags: string[] = [];
  if (state.flags.includes('auntSupport')) tags.push('王阿姨支持');
  if (state.flags.includes('laowangPartner')) tags.push('与老王合作');
  if (state.flags.includes('viral')) tags.push('意外走红');
  if (state.flags.includes('helpedVendors')) tags.push('帮助过摊主');
  return tags.slice(0, 2);
}
