import type { CharacterId, Expression } from '../engine/types';

interface Palette {
  skin: string;
  skinShade: string;
  hair: string;
  cloth: string;
  clothAlt: string;
  accent: string;
}

const PALETTES: Record<CharacterId, Palette> = {
  narrator: { skin: '#E9CFAF', skinShade: '#D8B78F', hair: '#6B5B4A', cloth: '#8C7A5B', clothAlt: '#F3E8CC', accent: '#C62828' },
  player: { skin: '#F2C79E', skinShade: '#E0AE81', hair: '#2B2620', cloth: '#F3E8CC', clothAlt: '#347A48', accent: '#C62828' },
  wang: { skin: '#EFC3A0', skinShade: '#DFA97F', hair: '#6B5B63', cloth: '#C62828', clothAlt: '#F4CE46', accent: '#F4CE46' },
  laowang: { skin: '#E8B98C', skinShade: '#D19E6E', hair: '#2B2620', cloth: '#242019', clothAlt: '#F4CE46', accent: '#F4CE46' },
  admin: { skin: '#E9C3A1', skinShade: '#D6A97D', hair: '#3A342C', cloth: '#3A5A7A', clothAlt: '#DDE6EE', accent: '#C62828' },
  mystery: { skin: '#EFD0B0', skinShade: '#DAB48D', hair: '#1F1C18', cloth: '#242019', clothAlt: '#F3E8CC', accent: '#C62828' },
  rider: { skin: '#E7B98F', skinShade: '#D09E70', hair: '#2B2620', cloth: '#3A5A7A', clothAlt: '#F4CE46', accent: '#F4CE46' },
};

const INK = '#242019';

function Eyes({ id, expression }: { id: CharacterId; expression: Expression }) {
  const eyeY = 158;
  const dx = 26;

  if (id === 'mystery') {
    return (
      <g>
        <rect x={160 - dx - 22} y={eyeY - 13} width={44} height={26} rx={10} fill={INK} />
        <rect x={160 + dx - 22} y={eyeY - 13} width={44} height={26} rx={10} fill={INK} />
        <rect x={160 - 8} y={eyeY - 4} width={16} height={6} fill={INK} />
        <path d="M150 142 L176 138" stroke={INK} strokeWidth={4} strokeLinecap="round" fill="none" />
        <path d="M170 138 L196 142" stroke={INK} strokeWidth={4} strokeLinecap="round" fill="none" />
      </g>
    );
  }

  if (expression === 'happy') {
    return (
      <g>
        <path
          d={`M${160 - dx - 13} ${eyeY + 4} Q${160 - dx} ${eyeY - 12} ${160 - dx + 13} ${eyeY + 4}`}
          stroke={INK}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M${160 + dx - 13} ${eyeY + 4} Q${160 + dx} ${eyeY - 12} ${160 + dx + 13} ${eyeY + 4}`}
          stroke={INK}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (expression === 'speechless' || expression === 'smug') {
    return (
      <g>
        <path
          d={`M${160 - dx - 12} ${eyeY} L${160 - dx + 12} ${eyeY}`}
          stroke={INK}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <path
          d={`M${160 + dx - 12} ${eyeY - (expression === 'smug' ? 3 : 0)} L${160 + dx + 12} ${eyeY + (expression === 'smug' ? 1 : 0)}`}
          stroke={INK}
          strokeWidth={5}
          strokeLinecap="round"
        />
        {expression === 'smug' ? (
          <path
            d={`M${160 - dx - 14} ${eyeY - 16} L${160 - dx + 10} ${eyeY - 22}`}
            stroke={INK}
            strokeWidth={5}
            strokeLinecap="round"
          />
        ) : (
          <text x={160 + 64} y={eyeY + 6} fontSize={22} fill={INK} fontFamily="sans-serif">
            ···
          </text>
        )}
      </g>
    );
  }

  if (expression === 'tired') {
    return (
      <g>
        <path
          d={`M${160 - dx - 12} ${eyeY - 4} Q${160 - dx} ${eyeY + 4} ${160 - dx + 12} ${eyeY - 4}`}
          stroke={INK}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M${160 + dx - 12} ${eyeY - 4} Q${160 + dx} ${eyeY + 4} ${160 + dx + 12} ${eyeY - 4}`}
          stroke={INK}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
        <path d={`M${160 + dx - 10} ${eyeY + 16} q6 8 12 0`} stroke={INK} strokeWidth={2} fill="none" opacity={0.45} />
      </g>
    );
  }

  if (expression === 'shock') {
    return (
      <g>
        <ellipse cx={160 - dx} cy={eyeY} rx={13} ry={15} fill="#FFF9EC" stroke={INK} strokeWidth={4} />
        <ellipse cx={160 + dx} cy={eyeY} rx={13} ry={15} fill="#FFF9EC" stroke={INK} strokeWidth={4} />
        <circle cx={160 - dx} cy={eyeY + 2} r={5} fill={INK} />
        <circle cx={160 + dx} cy={eyeY + 2} r={5} fill={INK} />
      </g>
    );
  }

  return (
    <g>
      <ellipse cx={160 - dx} cy={eyeY} rx={9} ry={11} fill={INK} />
      <ellipse cx={160 + dx} cy={eyeY} rx={9} ry={11} fill={INK} />
      <circle cx={160 - dx - 3} cy={eyeY - 4} r={2.6} fill="#FFF9EC" />
      <circle cx={160 + dx - 3} cy={eyeY - 4} r={2.6} fill="#FFF9EC" />
      {expression === 'angry' ? (
        <>
          <path d={`M${160 - dx - 14} ${eyeY - 22} L${160 - dx + 10} ${eyeY - 13}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <path d={`M${160 + dx + 14} ${eyeY - 22} L${160 + dx - 10} ${eyeY - 13}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        </>
      ) : null}
    </g>
  );
}

function Mouth({ expression }: { expression: Expression }) {
  const y = 196;
  if (expression === 'happy') {
    return (
      <g>
        <path d={`M${160 - 22} ${y - 4} Q160 ${y + 24} ${160 + 22} ${y - 4}`} fill="#8C2B24" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d={`M${160 - 12} ${y + 12} Q160 ${y + 18} ${160 + 12} ${y + 12}`} fill="#E8897A" />
      </g>
    );
  }
  if (expression === 'angry') {
    return (
      <g>
        <path d={`M${160 - 20} ${y + 6} Q160 ${y - 10} ${160 + 20} ${y + 6}`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d={`M${160 - 6} ${y + 12} l0 10`} stroke={INK} strokeWidth={3} opacity={0.6} />
      </g>
    );
  }
  if (expression === 'shock') {
    return <ellipse cx={160} cy={y + 4} rx={13} ry={18} fill="#8C2B24" stroke={INK} strokeWidth={4} />;
  }
  if (expression === 'speechless') {
    return <path d={`M${160 - 18} ${y + 4} L${160 + 18} ${y + 4}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />;
  }
  if (expression === 'tired') {
    return (
      <path
        d={`M${160 - 18} ${y + 4} q9 -6 18 0 q9 6 18 0`}
        stroke={INK}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  if (expression === 'smug') {
    return (
      <path
        d={`M${160 - 18} ${y + 6} Q160 ${y - 2} ${160 + 16} ${y - 4}`}
        stroke={INK}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  return (
    <path
      d={`M${160 - 15} ${y} Q160 ${y + 10} ${160 + 15} ${y}`}
      stroke={INK}
      strokeWidth={5}
      fill="none"
      strokeLinecap="round"
    />
  );
}

function Marks({ expression }: { expression: Expression }) {
  if (expression === 'angry') {
    return (
      <g stroke="#C62828" strokeWidth={4} strokeLinecap="round" fill="none">
        <path d="M236 120 l22 -14 M236 120 l22 6" />
        <path d="M244 112 l-14 -10 M244 112 l-14 8" />
      </g>
    );
  }
  if (expression === 'tired') {
    return (
      <g>
        <path d="M226 134 q10 14 0 26 q-10 -12 0 -26" fill="#7FB6E8" stroke={INK} strokeWidth={3} />
        <path d="M96 176 l-14 18" stroke="#7FB6E8" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      </g>
    );
  }
  if (expression === 'happy') {
    return (
      <g fill="#E67E22" opacity={0.85}>
        <circle cx={86} cy={110} r={4} />
        <circle cx={238} cy={100} r={3} />
        <circle cx={250} cy={160} r={4} />
      </g>
    );
  }
  return null;
}

function Body({ id }: { id: CharacterId }) {
  const p = PALETTES[id];
  switch (id) {
    case 'player':
      return (
        <g>
          <path d="M40 400 Q46 300 120 280 L200 280 Q274 300 280 400 Z" fill={p.cloth} stroke={INK} strokeWidth={4} />
          <path d="M100 400 Q108 312 160 306 Q212 312 220 400 Z" fill={p.clothAlt} stroke={INK} strokeWidth={4} />
          <path d="M160 308 L160 400" stroke={INK} strokeWidth={3} opacity={0.4} />
          <path d="M126 400 l-6 -60 M194 400 l6 -60" stroke={INK} strokeWidth={3} opacity={0.25} />
          <rect x={114} y={366} width={92} height={20} rx={4} fill="#E9D9B6" stroke={INK} strokeWidth={3} />
          <circle cx={160} cy={338} r={4} fill={INK} opacity={0.5} />
        </g>
      );
    case 'wang':
      return (
        <g>
          <path d="M34 400 Q42 296 122 276 L198 276 Q278 296 286 400 Z" fill={p.cloth} stroke={INK} strokeWidth={4} />
          {[
            [86, 330],
            [128, 356],
            [178, 322],
            [214, 366],
            [100, 390],
            [236, 326],
          ].map(([x, y], index) => (
            <g key={index} transform={`translate(${x} ${y})`} fill={p.clothAlt} opacity={0.85}>
              <circle r={5} />
              <circle cx={8} cy={-5} r={4} />
              <circle cx={8} cy={5} r={4} />
              <circle cx={-8} cy={5} r={4} />
              <circle cx={-8} cy={-5} r={4} />
              <circle r={2.6} fill={p.cloth} />
            </g>
          ))}
          <path d="M118 278 Q160 310 202 278" stroke={INK} strokeWidth={4} fill="#F3E8CC" />
          <path d="M150 282 l10 26 l10 -26" fill={p.clothAlt} stroke={INK} strokeWidth={3} opacity={0.9} />
        </g>
      );
    case 'laowang':
      return (
        <g>
          <path d="M38 400 Q46 300 120 278 L200 278 Q274 300 282 400 Z" fill={p.cloth} stroke={INK} strokeWidth={4} />
          <path d="M104 278 Q160 320 216 278" stroke={p.clothAlt} strokeWidth={4} fill="none" />
          <text x={160} y={356} textAnchor="middle" fontSize={22} fill={p.clothAlt} fontFamily="sans-serif" fontWeight={700}>
            老王严选
          </text>
          <path d="M104 292 Q160 340 216 292" stroke={p.clothAlt} strokeWidth={3} fill="none" />
          <circle cx={160} cy={392} r={4} fill={p.clothAlt} opacity={0.9} />
          <path d="M120 284 Q160 306 200 284" stroke="#D4AF37" strokeWidth={7} fill="none" strokeLinecap="round" />
          <circle cx={160} cy={300} r={7} fill="#D4AF37" stroke={INK} strokeWidth={3} />
        </g>
      );
    case 'admin':
      return (
        <g>
          <path d="M36 400 Q44 298 120 278 L200 278 Q276 298 284 400 Z" fill={p.cloth} stroke={INK} strokeWidth={4} />
          <path d="M140 280 L140 320 L160 336 L180 320 L180 280" fill={p.clothAlt} stroke={INK} strokeWidth={4} />
          <path d="M152 322 l8 8 l8 -8" stroke={INK} strokeWidth={3} fill="none" />
          <rect x={196} y={336} width={54} height={16} rx={3} fill={p.accent} stroke={INK} strokeWidth={3} />
          <text x={223} y={349} textAnchor="middle" fontSize={12} fill="#FFF6E2" fontFamily="sans-serif">
            管理员
          </text>
          <rect x={110} y={372} width={100} height={26} rx={4} fill="#F3E8CC" stroke={INK} strokeWidth={3} />
          <path d="M122 380 h60 M122 390 h44" stroke={INK} strokeWidth={2} opacity={0.5} />
        </g>
      );
    case 'mystery':
      return (
        <g>
          <path d="M38 400 Q46 298 122 278 L198 278 Q274 298 282 400 Z" fill={p.cloth} stroke={INK} strokeWidth={4} />
          <path d="M132 278 L160 350 L188 278" fill="#F3E8CC" stroke={INK} strokeWidth={4} />
          <path d="M160 292 L171 330 L160 344 L149 330 Z" fill={p.accent} stroke={INK} strokeWidth={3} />
          <path d="M124 284 L118 400 M196 284 L202 400" stroke={INK} strokeWidth={3} opacity={0.5} />
          <path d="M104 278 Q130 310 160 310 Q190 310 216 278" fill={p.cloth} stroke={INK} strokeWidth={4} />
        </g>
      );
    case 'rider':
      return (
        <g>
          <path d="M38 400 Q46 300 120 278 L200 278 Q274 300 282 400 Z" fill={p.cloth} stroke={INK} strokeWidth={4} />
          <path d="M80 300 Q80 400 96 400" stroke={p.clothAlt} strokeWidth={8} fill="none" />
          <path d="M240 300 Q240 400 224 400" stroke={p.clothAlt} strokeWidth={8} fill="none" />
          <path d="M120 286 Q160 316 200 286" stroke={p.clothAlt} strokeWidth={4} fill="none" />
          <rect x={112} y={346} width={96} height={40} rx={6} fill="#242019" opacity={0.85} />
          <text x={160} y={372} textAnchor="middle" fontSize={18} fill={p.clothAlt} fontFamily="sans-serif" fontWeight={700}>
            配送中
          </text>
        </g>
      );
    default:
      return (
        <path d="M40 400 Q48 300 120 278 L200 278 Q272 300 280 400 Z" fill={p.cloth} stroke={INK} strokeWidth={4} />
      );
  }
}

function Hair({ id, expression }: { id: CharacterId; expression: Expression }) {
  const p = PALETTES[id];
  switch (id) {
    case 'player':
      return (
        <g fill={p.hair} stroke={INK} strokeWidth={4} strokeLinejoin="round">
          <path d="M92 146 Q84 74 152 62 Q222 56 232 132 Q214 108 196 100 Q182 118 160 104 Q136 124 112 106 Q100 120 92 146 Z" />
          <path d="M214 108 q14 10 8 26 q-10 -8 -14 -16" />
        </g>
      );
    case 'wang':
      return (
        <g fill={p.hair} stroke={INK} strokeWidth={4} strokeLinejoin="round">
          <path d="M86 150 Q76 70 158 58 Q240 68 234 150 Q224 112 200 102 Q188 120 168 104 Q150 122 132 104 Q112 116 106 140 Q96 130 86 150 Z" />
          <circle cx={92} cy={92} r={22} />
          <circle cx={122} cy={74} r={20} />
          <circle cx={158} cy={66} r={22} />
          <circle cx={196} cy={74} r={20} />
          <circle cx={228} cy={94} r={22} />
          <circle cx={236} cy={128} r={16} />
          <circle cx={86} cy={128} r={16} />
        </g>
      );
    case 'laowang':
      return (
        <g>
          <path d="M92 148 Q92 84 160 80 Q228 84 228 148 Q214 118 160 112 Q108 118 92 148 Z" fill={p.hair} stroke={INK} strokeWidth={4} />
          <g transform="translate(160 46) rotate(-8)">
            <path d="M-64 24 Q-60 -18 0 -20 Q60 -18 64 24 Z" fill={p.clothAlt} stroke={INK} strokeWidth={4} />
            <path d="M0 -22 L0 24" stroke={INK} strokeWidth={3} opacity={0.4} />
            <rect x={-30} y={22} width={60} height={14} rx={6} fill={p.clothAlt} stroke={INK} strokeWidth={4} />
            <text x={0} y={-2} textAnchor="middle" fontSize={14} fill={INK} fontFamily="sans-serif" fontWeight={700}>
              老王
            </text>
          </g>
          <path d="M206 150 q10 12 0 20" fill={p.hair} stroke={INK} strokeWidth={3} />
        </g>
      );
    case 'admin':
      return (
        <g>
          <path d="M94 146 Q96 88 160 88 Q224 88 226 146 Q208 122 160 116 Q112 122 94 146 Z" fill={p.hair} stroke={INK} strokeWidth={4} />
          <g transform="translate(160 44)">
            <path d="M-66 30 Q-64 -14 0 -16 Q64 -14 66 30 Z" fill={p.cloth} stroke={INK} strokeWidth={4} />
            <rect x={-72} y={30} width={144} height={14} rx={4} fill={p.cloth} stroke={INK} strokeWidth={4} />
            <path d="M-36 0 Q0 -12 36 0" stroke={p.clothAlt} strokeWidth={3} fill="none" opacity={0.4} />
            <circle cx={0} cy={12} r={9} fill={p.accent} stroke={INK} strokeWidth={3} />
            <path d="M-4 12 l3 4 l6 -8" stroke="#FFF6E2" strokeWidth={2} fill="none" />
          </g>
          <path d="M136 206 Q160 214 184 206 Q180 220 160 220 Q140 220 136 206 Z" fill={p.hair} opacity={expression === 'normal' ? 0.85 : 0.7} />
        </g>
      );
    case 'mystery':
      return (
        <g fill={p.hair} stroke={INK} strokeWidth={4} strokeLinejoin="round">
          <path d="M94 148 Q92 80 160 76 Q230 80 228 148 Q214 116 190 108 Q170 124 148 106 Q120 114 94 148 Z" />
          <path d="M212 132 q14 50 -4 60 q8 -30 0 -52" />
        </g>
      );
    case 'rider':
      return (
        <g>
          <g transform="translate(160 44)">
            <path d="M-74 32 Q-70 -18 0 -20 Q70 -18 74 32 Z" fill={p.clothAlt} stroke={INK} strokeWidth={4} />
            <path d="M-74 32 h148" stroke={INK} strokeWidth={5} />
            <path d="M-16 24 Q0 44 16 24" stroke={INK} strokeWidth={4} fill="none" opacity={0.4} />
            <rect x={-64} y={-6} width={128} height={16} rx={8} fill="#FFF9EC" stroke={INK} strokeWidth={3} opacity={0.85} />
          </g>
          <path d="M96 148 Q100 92 160 90 Q220 92 224 148 Q206 124 160 120 Q114 124 96 148 Z" fill={p.hair} stroke={INK} strokeWidth={3} />
        </g>
      );
    default:
      return null;
  }
}

function Accessory({ id }: { id: CharacterId }) {
  if (id === 'wang') {
    return (
      <g>
        <path d="M104 244 Q160 268 216 244" stroke="#3F7C5C" strokeWidth={8} fill="none" opacity={0.8} />
        <circle cx={210} cy={252} r={9} fill="#8FD3A9" stroke={INK} strokeWidth={3} />
      </g>
    );
  }
  if (id === 'admin') {
    return (
      <g>
        <path d="M246 196 l16 10 l-4 18" stroke={INK} strokeWidth={4} fill="none" opacity={0.5} />
      </g>
    );
  }
  return null;
}

export interface CharacterSpriteProps {
  character: CharacterId;
  expression?: Expression;
  size?: number;
}

export default function CharacterSprite({ character, expression = 'normal', size = 320 }: CharacterSpriteProps) {
  const palette = PALETTES[character];
  return (
    <svg
      className="character-sprite"
      viewBox="0 0 320 400"
      width={size}
      height={(size * 400) / 320}
      role="img"
      aria-label={`${character}-${expression}`}
      style={{ overflow: 'visible' }}
    >
      <g>
        <Body id={character} />
        <rect x={142} y={228} width={36} height={56} rx={12} fill={palette.skinShade} stroke={INK} strokeWidth={4} />
        <ellipse cx={160} cy={152} rx={70} ry={78} fill={palette.skin} stroke={INK} strokeWidth={4} />
        <ellipse cx={90} cy={162} rx={11} ry={16} fill={palette.skin} stroke={INK} strokeWidth={4} />
        <ellipse cx={230} cy={162} rx={11} ry={16} fill={palette.skin} stroke={INK} strokeWidth={4} />
        <Hair id={character} expression={expression} />
        <Eyes id={character} expression={expression} />
        {character !== 'admin' ? (
          <path d="M160 172 q-5 16 3 22" stroke={INK} strokeWidth={3.5} fill="none" opacity={0.55} strokeLinecap="round" />
        ) : null}
        <Mouth expression={expression} />
        {expression === 'happy' ? (
          <g fill="#EFA98A" opacity={0.55}>
            <ellipse cx={112} cy={184} rx={13} ry={8} />
            <ellipse cx={208} cy={184} rx={13} ry={8} />
          </g>
        ) : null}
        <Accessory id={character} />
        <Marks expression={expression} />
        {character === 'admin' ? (
          <rect x={140} y={196} width={40} height={8} rx={4} fill={INK} opacity={0.55} />
        ) : null}
      </g>
    </svg>
  );
}

export function characterPalette(id: CharacterId): Palette {
  return PALETTES[id];
}
