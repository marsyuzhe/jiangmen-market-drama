import { useId } from 'react';
import type { BackgroundId } from '../engine/types';

const INK = '#242019';
const RED = '#C62828';
const YELLOW = '#F4CE46';
const PAPER = '#F3E8CC';
const GREEN = '#347A48';

function Awning({
  x,
  y,
  w,
  color,
  stripe = PAPER,
  height = 54,
}: {
  x: number;
  y: number;
  w: number;
  color: string;
  stripe?: string;
  height?: number;
}) {
  const scallops = Math.max(3, Math.round(w / 30));
  const step = w / scallops;
  return (
    <g>
      <path
        d={`M${x} ${y} L${x + w} ${y} L${x + w - 8} ${y + height} ` +
          Array.from({ length: scallops }, (_, index) =>
            `q${-step / 2} ${index % 2 === 0 ? 16 : 10} ${-step} 0`,
          ).join(' ') +
          ' Z'}
        fill={color}
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      {Array.from({ length: scallops }, (_, index) =>
        index % 2 === 0 ? (
          <rect
            key={index}
            x={x + 6 + index * step}
            y={y + 4}
            width={step * 0.42}
            height={height - 12}
            fill={stripe}
            opacity={0.65}
          />
        ) : null,
      )}
    </g>
  );
}

function Crate({
  x,
  y,
  w,
  h,
  fill = '#E2C88F',
  items = 'tomato',
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  items?: 'tomato' | 'green' | 'mixed' | 'none';
}) {
  const count = Math.max(3, Math.round(w / 22));
  return (
    <g>
      {items !== 'none' ? (
        <g>
          {Array.from({ length: count }, (_, index) => {
            const cx = x + 8 + index * ((w - 16) / count);
            const cy = y - 4 + (index % 2) * 3;
            if (items === 'green') {
              return (
                <g key={index}>
                  <ellipse cx={cx} cy={cy - 10} rx={10} ry={16} fill="#4E9A5E" stroke={INK} strokeWidth={3} />
                  <path d={`M${cx} ${cy - 24} q-8 4 -10 10`} stroke={GREEN} strokeWidth={5} fill="none" />
                </g>
              );
            }
            if (items === 'mixed' && index % 3 === 0) {
              return <ellipse key={index} cx={cx} cy={cy - 12} rx={12} ry={14} fill="#4E9A5E" stroke={INK} strokeWidth={3} />;
            }
            return (
              <circle
                key={index}
                cx={cx}
                cy={cy - 12}
                r={11}
                fill={index % 3 === 0 ? '#D94A34' : RED}
                stroke={INK}
                strokeWidth={3}
              />
            );
          })}
        </g>
      ) : null}
      <path d={`M${x} ${y} h${w} l-6 ${h} h${-w + 12} Z`} fill={fill} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {Array.from({ length: 3 }, (_, index) => (
        <path
          key={index}
          d={`M${x + 6} ${y + 10 + index * (h / 3.4)} h${w - 12}`}
          stroke={INK}
          strokeWidth={2}
          opacity={0.25}
        />
      ))}
    </g>
  );
}

function Person({
  x,
  y,
  scale = 1,
  fill = 'rgba(36,32,25,0.72)',
  armUp = false,
}: {
  x: number;
  y: number;
  scale?: number;
  fill?: string;
  armUp?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={fill}>
      <circle cx={0} cy={-78} r={18} />
      <path d="M-26 -6 Q-30 -56 0 -58 Q30 -56 26 -6 Z" />
      <path d="M-26 -52 h30 v10 h-30 Z" opacity={0.4} fill="#000" />
      {armUp ? (
        <path d="M-22 -50 Q-44 -80 -34 -96" stroke={fill} strokeWidth={9} fill="none" strokeLinecap="round" />
      ) : (
        <path d="M24 -50 Q40 -34 34 -14" stroke={fill} strokeWidth={9} fill="none" strokeLinecap="round" />
      )}
    </g>
  );
}

function PhoneGroup({ x, y, scale = 1, glow = '#FFF6E2' }: { x: number; y: number; scale?: number; glow?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x={-11} y={-20} width={22} height={38} rx={4} fill={INK} stroke="#0F0D0A" strokeWidth={2} />
      <rect x={-8} y={-16} width={16} height={30} rx={2} fill={glow} opacity={0.85} />
    </g>
  );
}

function StallFront({
  x,
  y,
  w,
  color,
  label,
  items = 'mixed',
}: {
  x: number;
  y: number;
  w: number;
  color: string;
  label?: string;
  items?: 'tomato' | 'green' | 'mixed' | 'none';
}) {
  return (
    <g>
      <rect x={x + 10} y={y + 60} width={10} height={150} fill="#5B4632" stroke={INK} strokeWidth={3} />
      <rect x={x + w - 20} y={y + 60} width={10} height={150} fill="#5B4632" stroke={INK} strokeWidth={3} />
      <Awning x={x} y={y} w={w} color={color} />
      <rect x={x + 8} y={y + 160} width={w - 16} height={48} fill="#EADBB8" stroke={INK} strokeWidth={4} />
      <Crate x={x + 22} y={y + 158} w={Math.min(110, w / 2 - 18)} h={40} items={items} />
      <Crate x={x + w / 2 + 6} y={y + 158} w={Math.min(110, w / 2 - 28)} h={40} items={items === 'tomato' ? 'green' : 'tomato'} />
      {label ? (
        <g transform={`translate(${x + w / 2} ${y + 92}) rotate(-2)`}>
          <rect x={-56} y={-24} width={112} height={48} rx={3} fill={PAPER} stroke={INK} strokeWidth={3} />
          <text x={0} y={7} textAnchor="middle" fontSize={22} fill={INK} fontFamily="Microsoft YaHei, sans-serif" fontWeight={700}>
            {label}
          </text>
        </g>
      ) : null}
    </g>
  );
}

function Sky({ id, from, to }: { id: string; from: string; to: string }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width={960} height={540} fill={`url(#${id})`} />
    </>
  );
}

function DistantCity({ opacity = 0.35 }: { opacity?: number }) {
  const buildings = [
    [30, 300, 90, 150],
    [128, 260, 70, 190],
    [206, 310, 110, 140],
    [330, 280, 80, 170],
    [418, 318, 120, 130],
    [552, 268, 70, 180],
    [630, 300, 100, 150],
    [740, 250, 90, 200],
    [840, 310, 100, 140],
  ];
  return (
    <g fill={`rgba(36,32,25,${opacity})`}>
      {buildings.map(([x, y, w, h], index) => (
        <g key={index}>
          <rect x={x} y={y} width={w} height={h} />
          {Array.from({ length: 4 }, (_, row) =>
            Array.from({ length: 3 }, (_, col) => (
              <rect
                key={`${row}-${col}`}
                x={x + 12 + col * 24}
                y={y + 14 + row * 30}
                width={12}
                height={14}
                fill="rgba(244,206,70,0.35)"
              />
            )),
          )}
        </g>
      ))}
    </g>
  );
}

function Ground({ color = '#D9C7A4' }: { color?: string }) {
  return (
    <g>
      <rect y={420} width={960} height={120} fill={color} />
      <rect y={420} width={960} height={10} fill="rgba(36,32,25,0.15)" />
      {Array.from({ length: 12 }, (_, index) => (
        <path
          key={index}
          d={`M${index * 88 + 20} 470 h60 M${index * 88 + 60} 510 h50`}
          stroke="rgba(36,32,25,0.12)"
          strokeWidth={3}
        />
      ))}
    </g>
  );
}

function Gate({ x = 330, y = 210, label = '幸福路第一菜市场' }: { x?: number; y?: number; label?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={-26} width={300} height={70} rx={6} fill={RED} stroke={INK} strokeWidth={5} />
      <rect x={8} y={-18} width={284} height={54} rx={3} fill="none" stroke={YELLOW} strokeWidth={3} />
      <text x={150} y={16} textAnchor="middle" fontSize={34} fill={YELLOW} fontFamily="Microsoft YaHei, sans-serif" fontWeight={900} letterSpacing={2}>
        {label}
      </text>
      <rect x={-16} y={44} width={18} height={170} fill="#B9A789" stroke={INK} strokeWidth={4} />
      <rect x={298} y={44} width={18} height={170} fill="#B9A789" stroke={INK} strokeWidth={4} />
      {Array.from({ length: 6 }, (_, index) => (
        <circle key={index} cx={16 + index * 54} cy={70} r={6} fill={YELLOW} stroke={INK} strokeWidth={2} />
      ))}
    </g>
  );
}

function Lamp({ x, y, lit = true, r = 9 }: { x: number; y: number; lit?: boolean; r?: number }) {
  return (
    <g>
      <path d={`M${x} 0 v${y - 16}`} stroke={INK} strokeWidth={3} />
      <path d={`M${x - 26} ${y - 16} q26 -18 52 0 Z`} fill={lit ? YELLOW : '#3B3730'} stroke={INK} strokeWidth={4} />
      {lit ? (
        <circle cx={x} cy={y + 8} r={r * 2.4} fill={YELLOW} opacity={0.18} />
      ) : null}
      <circle cx={x} cy={y + 8} r={r} fill={lit ? '#FFF1B8' : '#2C2822'} stroke={INK} strokeWidth={3} />
    </g>
  );
}

export interface SceneBackdropProps {
  background: BackgroundId;
  lit?: boolean;
}

export default function SceneBackdrop({ background, lit = true }: SceneBackdropProps) {
  const uid = useId().replace(/:/g, '');
  const skyId = `sky-${uid}`;
  const glowId = `glow-${uid}`;
  const darkId = `dark-${uid}`;

  return (
    <svg className="scene-backdrop" viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {background === 'dawn' && (
        <g>
          <Sky id={skyId} from="#F8DFA8" to="#F3E8CC" />
          <circle cx={760} cy={128} r={62} fill="#F7B94E" opacity={0.9} />
          <circle cx={760} cy={128} r={96} fill="#F7B94E" opacity={0.18} />
          <DistantCity opacity={0.18} />
          {Array.from({ length: 5 }, (_, index) => (
            <path
              key={index}
              d={`M${120 + index * 60} ${150 + index * 12} q10 -10 20 0 q10 -10 20 0`}
              stroke="rgba(36,32,25,0.35)"
              strokeWidth={3}
              fill="none"
            />
          ))}
          <Gate />
          <Ground />
          <StallFront x={40} y={300} w={220} color={GREEN} label="青菜" items="green" />
          <StallFront x={700} y={310} w={220} color={RED} label="水果" items="mixed" />
          <Person x={430} y={470} scale={1.1} />
          <Person x={520} y={500} scale={1.3} />
          <Person x={620} y={470} scale={0.95} />
          <Person x={300} y={500} scale={1.2} />
          <g opacity={0.15} fill="#FFF6E2">
            <rect width={960} height={70} />
          </g>
        </g>
      )}

      {background === 'stall' && (
        <g>
          <Sky id={skyId} from="#F5DFB6" to="#E7D2A6" />
          <DistantCity opacity={0.1} />
          <Ground color="#DCC9A3" />
          <StallFront x={120} y={120} w={720} color={RED} label="三号摊 · 番茄 12 元/斤" items="tomato" />
          <StallFront x={-120} y={210} w={240} color="#8C7A5B" items="none" />
          <StallFront x={860} y={210} w={240} color={GREEN} items="green" />
          <g transform="translate(660 250)">
            <rect x={-70} y={-46} width={140} height={92} rx={6} fill={PAPER} stroke={INK} strokeWidth={4} transform="rotate(3)" />
            <text x={0} y={-14} textAnchor="middle" fontSize={20} fill={RED} fontFamily="Microsoft YaHei, sans-serif" fontWeight={900}>
              今日特价
            </text>
            <text x={0} y={18} textAnchor="middle" fontSize={30} fill={INK} fontFamily="Microsoft YaHei, sans-serif" fontWeight={900}>
              12 元/斤
            </text>
            <text x={0} y={38} textAnchor="middle" fontSize={14} fill="rgba(36,32,25,0.6)" fontFamily="Microsoft YaHei, sans-serif">
              不讲价（可讲）
            </text>
          </g>
          <Lamp x={180} y={90} />
          <Lamp x={780} y={90} />
          <Crate x={150} y={452} w={170} h={64} items="tomato" />
          <Crate x={640} y={452} w={170} h={64} items="green" />
        </g>
      )}

      {background === 'live' && (
        <g>
          <Sky id={skyId} from="#3A3330" to="#6B5F52" />
          <Ground color="#4A4038" />
          <DistantCity opacity={0.3} />
          <StallFront x={250} y={146} w={460} color={RED} label="老王严选 · 情绪充电宝" items="tomato" />
          <g transform="translate(480 320)">
            <circle r={132} fill="#FFF4C8" opacity={0.22} />
            <circle r={96} fill="#FFF4C8" opacity={0.3} />
            <circle r={62} fill="#FFF9EC" opacity={0.65} />
            <ellipse cx={62} cy={44} rx={34} ry={12} fill="rgba(0,0,0,0.3)" />
            <rect x={30} y={36} width={14} height={54} rx={4} fill={INK} />
            <rect x={80} y={36} width={14} height={54} rx={4} fill={INK} />
            <g transform="translate(0 -100)">
              <rect x={-34} y={-56} width={68} height={116} rx={8} fill={INK} />
              <rect x={-28} y={-50} width={56} height={100} rx={4} fill="#FFF6E2" opacity={0.9} />
              <path d={`M-20 -20 h34 M-20 -4 h40 M-20 12 h26`} stroke={RED} strokeWidth={4} opacity={0.7} />
              <text x={0} y={40} textAnchor="middle" fontSize={13} fill={INK} fontFamily="Microsoft YaHei, sans-serif">
                直播中
              </text>
              <circle cx={-24} cy={-44} r={3.5} fill={RED} />
            </g>
          </g>
          <g fill="rgba(36,32,25,0.8)">
            <Person x={140} y={520} scale={1.5} armUp />
            <Person x={250} y={540} scale={1.7} armUp />
            <Person x={360} y={530} scale={1.4} />
            <Person x={700} y={536} scale={1.6} armUp />
            <Person x={810} y={520} scale={1.4} />
          </g>
          <g fill="rgba(36,32,25,0.75)">
            <PhoneGroup x={170} y={440} scale={1.4} />
            <PhoneGroup x={730} y={452} scale={1.5} />
            <PhoneGroup x={300} y={430} scale={1.2} />
          </g>
          <Lamp x={330} y={110} />
          <Lamp x={630} y={104} />
        </g>
      )}

      {background === 'crowd' && (
        <g>
          <Sky id={skyId} from="#F1DDB8" to="#E4CFA6" />
          <DistantCity opacity={0.16} />
          <Gate x={360} y={150} label="幸福路菜市场" />
          <Ground />
          <StallFront x={-60} y={250} w={280} color={GREEN} label="青菜" items="green" />
          <StallFront x={740} y={250} w={280} color={RED} label="水果" items="mixed" />
          <g>
            {[
              [120, 500, 1.5, true],
              [210, 530, 1.7, false],
              [300, 505, 1.4, true],
              [450, 545, 1.9, true],
              [560, 515, 1.5, false],
              [660, 540, 1.8, true],
              [780, 505, 1.45, true],
              [880, 530, 1.6, false],
            ].map(([x, y, scale, phone], index) => (
              <g key={index}>
                <Person x={x as number} y={y as number} scale={scale as number} armUp={phone as boolean} />
                {phone ? <PhoneGroup x={(x as number) + 14} y={(y as number) - 110} scale={1.15} /> : null}
              </g>
            ))}
          </g>
          <g transform="translate(720 250) rotate(6)">
            <path d="M0 0 h190 v86 h-190 Z" fill={PAPER} stroke={INK} strokeWidth={4} />
            <path d="M190 0 l16 -14 v100 l-16 -14" fill={PAPER} stroke={INK} strokeWidth={4} />
            <text x={20} y={34} fontSize={20} fill={INK} fontFamily="Microsoft YaHei, sans-serif" fontWeight={900}>
              热搜第七
            </text>
            <text x={20} y={62} fontSize={16} fill={RED} fontFamily="Microsoft YaHei, sans-serif">
              卖菜卖出了电视剧的感觉
            </text>
          </g>
          <Lamp x={420} y={100} />
        </g>
      )}

      {background === 'blackout' && (
        <g>
          <defs>
            <radialGradient id={darkId}>
              <stop offset="0%" stopColor="#2B3A45" />
              <stop offset="100%" stopColor="#141A1E" />
            </radialGradient>
            <radialGradient id={glowId}>
              <stop offset="0%" stopColor="#FFE9A8" stopOpacity={0.75} />
              <stop offset="100%" stopColor="#FFE9A8" stopOpacity={0} />
            </radialGradient>
          </defs>
          <rect width={960} height={540} fill={`url(#${darkId})`} />
          <DistantCity opacity={0.4} />
          <Ground color="#1C2428" />
          <StallFront x={70} y={196} w={250} color="#3A322A" items="none" />
          <StallFront x={640} y={196} w={250} color="#3A322A" items="none" />
          <Lamp x={220} y={70} lit={false} />
          <Lamp x={740} y={70} lit={false} />
          <g>
            <ellipse cx={520} cy={360} rx={170} ry={120} fill={`url(#${glowId})`} />
            <rect x={510} y={330} width={16} height={80} rx={4} fill="#EADBB8" />
            <ellipse cx={518} cy={320} rx={9} ry={14} fill="#FFD77A" />
          </g>
          <Person x={200} y={500} scale={1.3} fill="rgba(10,14,16,0.9)" />
          <Person x={300} y={520} scale={1.5} fill="rgba(10,14,16,0.9)" />
          <Person x={780} y={510} scale={1.4} fill="rgba(10,14,16,0.9)" />
          <Person x={690} y={500} scale={1.2} fill="rgba(10,14,16,0.9)" />
          <g transform="translate(380 300) rotate(-14)">
            <path d="M0 0 L160 22 L160 70 L0 46 Z" fill="#FFF3C4" opacity={0.14} />
          </g>
          <PhoneGroup x={790} y={430} glow="#B9D9F2" />
          <PhoneGroup x={250} y={446} glow="#B9D9F2" />
          <text x={780} y={150} textAnchor="middle" fontSize={22} fill="rgba(255,246,226,0.35)" fontFamily="Microsoft YaHei, sans-serif">
            10:17 AM
          </text>
        </g>
      )}

      {background === 'lightson' && (
        <g>
          <defs>
            <radialGradient id={glowId}>
              <stop offset="0%" stopColor="#FFF6D6" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#FFE08A" stopOpacity={0} />
            </radialGradient>
          </defs>
          <Sky id={skyId} from="#FBEBC4" to="#F3DFB4" />
          <DistantCity opacity={0.12} />
          <Ground color="#E4CFA6" />
          <StallFront x={-40} y={190} w={280} color={GREEN} label="青菜" items="green" />
          <StallFront x={300} y={150} w={360} color={RED} label="三号摊 · 今天卖完了" items="none" />
          <StallFront x={720} y={190} w={280} color={YELLOW} label="水果" items="mixed" />
          <g>
            {[120, 240, 360, 480, 600, 720, 840].map((x, index) => (
              <g key={x}>
                <circle cx={x} cy={120} r={index % 2 === 0 ? 26 : 20} fill={`url(#${glowId})`} />
                <circle cx={x} cy={120} r={9} fill="#FFF6D6" stroke={INK} strokeWidth={3} />
              </g>
            ))}
            <path d="M80 118 Q480 168 880 118" stroke={INK} strokeWidth={3} fill="none" opacity={0.4} />
          </g>
          <g fill="rgba(36,32,25,0.65)">
            <Person x={150} y={520} scale={1.6} armUp />
            <Person x={280} y={540} scale={1.8} />
            <Person x={420} y={525} scale={1.5} armUp />
            <Person x={560} y={545} scale={1.85} armUp />
            <Person x={700} y={520} scale={1.6} />
            <Person x={840} y={535} scale={1.7} armUp />
          </g>
          <g fill={RED} opacity={0.6}>
            <rect x={200} y={60} width={10} height={22} transform="rotate(18 200 60)" />
            <rect x={520} y={40} width={9} height={20} transform="rotate(-24 520 40)" />
            <rect x={760} y={66} width={10} height={22} transform="rotate(12 760 66)" />
          </g>
          <g fill={YELLOW} opacity={0.7}>
            <rect x={330} y={56} width={10} height={20} transform="rotate(-14 330 56)" />
            <rect x={640} y={48} width={9} height={20} transform="rotate(22 640 48)" />
          </g>
          <Lamp x={480} y={92} r={12} />
        </g>
      )}

      {background === 'studio' && (
        <g>
          <rect width={960} height={540} fill="#2A2C30" />
          <rect x={60} y={60} width={840} height={380} fill="#5791A0" stroke={INK} strokeWidth={6} />
          <g opacity={0.5}>
            <rect x={60} y={300} width={840} height={140} fill="#8FB7A8" />
            <Awning x={110} y={150} w={220} color={RED} />
            <Awning x={380} y={140} w={240} color={YELLOW} />
            <Awning x={670} y={152} w={200} color={GREEN} />
            <rect x={140} y={250} width={160} height={56} fill="#DCC9A3" />
            <rect x={410} y={240} width={180} height={60} fill="#DCC9A3" />
            <rect x={690} y={252} width={150} height={54} fill="#DCC9A3" />
            <text x={480} y={100} textAnchor="middle" fontSize={30} fill="rgba(255,255,255,0.6)" fontFamily="Microsoft YaHei, sans-serif" fontWeight={900}>
              幸福路第一菜市场（布景）
            </text>
          </g>
          <g stroke={INK} strokeWidth={5} fill="#3D3F44">
            <rect x={40} y={440} width={880} height={60} />
            <rect x={40} y={500} width={880} height={40} fill="#26282C" />
          </g>
          {[
            [140, 300],
            [820, 300],
          ].map(([x, y], index) => (
            <g key={index}>
              <path d={`M${x} ${y + 150} l-28 90 M${x} ${y + 150} l28 90 M${x} ${y + 150} l0 90`} stroke={INK} strokeWidth={6} fill="none" />
              <rect x={x - 34} y={y} width={68} height={56} rx={5} fill="#494C52" stroke={INK} strokeWidth={5} />
              <circle cx={x} cy={y + 28} r={15} fill="#FFF6D6" />
              <path d={`M${x} ${y + 56} l0 94`} stroke={INK} strokeWidth={5} />
            </g>
          ))}
          <g transform="translate(480 300)">
            <path d="M0 0 v-90 M-40 -90 h80" stroke={INK} strokeWidth={6} fill="none" />
            <rect x={-34} y={-96} width={68} height={34} rx={6} fill="#2C2E33" stroke={INK} strokeWidth={4} />
            <circle cx={0} cy={-30} r={20} fill="#1A1B1E" stroke={INK} strokeWidth={4} />
            <path d="M-16 -100 l-10 -26 M16 -100 l10 -26" stroke={INK} strokeWidth={4} />
            <path d={`M-110 60 q40 -40 96 -26`} stroke={INK} strokeWidth={5} fill="none" />
          </g>
          <g transform="translate(720 470) rotate(-8)">
            <rect x={-70} y={-26} width={140} height={52} rx={4} fill={INK} />
            <rect x={-64} y={-20} width={128} height={40} rx={2} fill={PAPER} />
            <text x={0} y={8} textAnchor="middle" fontSize={18} fill={INK} fontFamily="Microsoft YaHei, sans-serif" fontWeight={900}>
              EP.05 / TAKE 1
            </text>
          </g>
          <path d="M120 500 q160 26 300 -10 q180 -44 380 20" stroke="#1A1B1E" strokeWidth={6} fill="none" />
          <path d="M120 512 q160 26 300 -10 q180 -44 380 20" stroke="#1A1B1E" strokeWidth={6} fill="none" opacity={0.6} />
        </g>
      )}

      {background === 'press' && (
        <g>
          <Sky id={skyId} from="#F6E2BE" to="#EBD3A9" />
          <DistantCity opacity={0.14} />
          <StallFront x={230} y={180} w={500} color={RED} label="三号摊 · 今日营业" items="mixed" />
          <Ground />
          <g fill="rgba(36,32,25,0.82)">
            <Person x={110} y={530} scale={1.8} />
            <Person x={850} y={535} scale={1.9} />
            <Person x={210} y={555} scale={2} />
            <Person x={760} y={558} scale={2} />
          </g>
          <g>
            {[
              [160, 400, -8],
              [300, 430, 6],
              [660, 424, -5],
              [800, 402, 9],
            ].map(([x, y, rotate], index) => (
              <g key={index} transform={`translate(${x} ${y}) rotate(${rotate})`}>
                <rect x={-8} y={-70} width={16} height={70} rx={4} fill="#2C2E33" stroke={INK} strokeWidth={3} />
                <ellipse cx={0} cy={-76} rx={18} ry={20} fill="#3A3C42" stroke={INK} strokeWidth={3} />
                <rect x={-14} y={-42} width={28} height={10} rx={2} fill={RED} stroke={INK} strokeWidth={2} />
              </g>
            ))}
          </g>
          <g>
            {[420, 500, 580].map((x, index) => (
              <g key={x} transform={`translate(${x} 380) rotate(${index === 1 ? 0 : index === 0 ? -6 : 6})`}>
                <rect x={-24} y={-52} width={48} height={58} rx={6} fill={INK} />
                <rect x={-18} y={-46} width={36} height={40} rx={4} fill="#B9D9F2" />
                <path d="M-2 6 l0 30" stroke={INK} strokeWidth={4} />
                <path d="M-14 6 l28 0" stroke={INK} strokeWidth={4} />
              </g>
            ))}
          </g>
          <g fill="#FFF6D6">
            {[300, 480, 660].map((x, index) => (
              <g key={x} opacity={0.8}>
                <path
                  d={`M${x} ${230 + index * 10} l10 22 l24 -4 l-16 18 l10 22 l-22 -10 l-16 18 l2 -26 l-22 -10 l26 -6 Z`}
                />
              </g>
            ))}
          </g>
          <Lamp x={480} y={80} r={12} />
        </g>
      )}
      {!lit && <rect x={0} y={0} width={960} height={540} fill="#0B0A08" opacity={0.45} />}
    </svg>
  );
}
