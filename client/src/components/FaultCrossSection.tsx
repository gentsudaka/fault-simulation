/*
 * Geological cross-section visualization
 * Shows fault mechanics: strike-slip, normal (listric), and reverse (thrust)
 * Shares displacement with parent PlateScenario
 */

export type FaultType = 'strike-slip' | 'normal' | 'reverse';

interface FaultCrossSectionProps {
  type: FaultType;
  displacement: number; // 0-1
}

const LABELS: Record<FaultType, { left: string; right: string }> = {
  'strike-slip': { left: 'PLATE A', right: 'PLATE B' },
  'normal': { left: 'FOOTWALL', right: 'HANGING' },
  'reverse': { left: 'HANGING', right: 'FOOTWALL' },
};

const DESCRIPTIONS: Record<FaultType, string> = {
  'strike-slip': 'Lateral shear along curved fault plane',
  'normal': 'Hanging wall drops along listric surface',
  'reverse': 'Hanging wall rises along thrust surface',
};

function generatePaths(type: FaultType, d: number, cx: number, cy: number, W: number) {
  switch (type) {
    case 'strike-slip': {
      const offset = d * 35;
      return {
        leftPlate: `M 30 ${cy - 60} L 30 ${cy + 80} L ${cx - 8 - offset} ${cy + 80} Q ${cx - 5 - offset} ${cy + 40}, ${cx - 10 - offset} ${cy} Q ${cx - 5 - offset} ${cy - 40}, ${cx - 8 - offset} ${cy - 60} Z`,
        rightPlate: `M ${W - 30} ${cy - 60} L ${W - 30} ${cy + 80} L ${cx + 8 + offset} ${cy + 80} Q ${cx + 5 + offset} ${cy + 40}, ${cx + 10 + offset} ${cy} Q ${cx + 5 + offset} ${cy - 40}, ${cx + 8 + offset} ${cy - 60} Z`,
        faultLine: `M ${cx} ${cy - 70} Q ${cx - 3} ${cy - 35}, ${cx} ${cy} Q ${cx + 3} ${cy + 35}, ${cx} ${cy + 90}`,
        leftTransform: `translate(0, ${-offset * 0.8})`,
        rightTransform: `translate(0, ${offset * 0.8})`,
      };
    }
    case 'normal': {
      const dropY = d * 40;
      const pullX = d * 15;
      const rotation = d * 5;
      return {
        leftPlate: `M 25 ${cy - 50} L 25 ${cy + 90} L ${cx + 20} ${cy + 90} Q ${cx - 10} ${cy + 30}, ${cx - 25} ${cy - 20} L ${cx - 35} ${cy - 50} Z`,
        rightPlate: `M ${W - 25} ${cy - 50} L ${W - 25} ${cy + 90} L ${cx + 25} ${cy + 90} Q ${cx - 5} ${cy + 30}, ${cx - 20} ${cy - 20} L ${cx - 30} ${cy - 50} Z`,
        faultLine: `M ${cx - 30} ${cy - 60} Q ${cx - 40} ${cy}, ${cx - 20} ${cy + 40} Q ${cx + 10} ${cy + 70}, ${cx + 30} ${cy + 95}`,
        leftTransform: `translate(${-pullX * 0.3}, 0)`,
        rightTransform: `translate(${pullX}, ${dropY}) rotate(${rotation} ${cx + 50} ${cy})`,
      };
    }
    case 'reverse': {
      const riseY = d * 35;
      const pushX = d * 20;
      const rotation = d * -4;
      return {
        leftPlate: `M 25 ${cy - 40} L 25 ${cy + 90} L ${cx + 10} ${cy + 90} Q ${cx + 20} ${cy + 50}, ${cx + 30} ${cy} Q ${cx + 25} ${cy - 30}, ${cx + 15} ${cy - 40} Z`,
        rightPlate: `M ${W - 25} ${cy - 40} L ${W - 25} ${cy + 90} L ${cx + 15} ${cy + 90} Q ${cx + 25} ${cy + 50}, ${cx + 35} ${cy} Q ${cx + 30} ${cy - 30}, ${cx + 20} ${cy - 40} Z`,
        faultLine: `M ${cx + 10} ${cy - 50} Q ${cx + 40} ${cy - 10}, ${cx + 35} ${cy + 30} Q ${cx + 25} ${cy + 60}, ${cx + 15} ${cy + 95}`,
        leftTransform: `translate(${pushX}, ${-riseY}) rotate(${rotation} ${cx - 50} ${cy + 50})`,
        rightTransform: `translate(${-pushX * 0.2}, 0)`,
      };
    }
  }
}

function getArrows(type: FaultType, cx: number, cy: number, W: number) {
  switch (type) {
    case 'strike-slip':
      return [
        { x: 60, y: cy - 30, rotation: -90 },
        { x: 60, y: cy + 50, rotation: -90 },
        { x: W - 60, y: cy - 30, rotation: 90 },
        { x: W - 60, y: cy + 50, rotation: 90 },
      ];
    case 'normal':
      return [
        { x: 50, y: cy, rotation: 180 },
        { x: W - 50, y: cy, rotation: 0 },
      ];
    case 'reverse':
      return [
        { x: 50, y: cy, rotation: 0 },
        { x: W - 50, y: cy, rotation: 180 },
      ];
  }
}

export default function FaultCrossSection({ type, displacement }: FaultCrossSectionProps) {
  const W = 320, H = 260;
  const cx = W / 2, cy = H / 2;
  const d = displacement;

  const paths = generatePaths(type, d, cx, cy, W);
  const arrows = getArrows(type, cx, cy, W);
  const labels = LABELS[type];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-h-[250px]">
        <defs>
          <linearGradient id={`cg-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(40, 35, 30, 0.08)" />
            <stop offset="100%" stopColor="rgba(40, 35, 30, 0.03)" />
          </linearGradient>
          <pattern id={`ch-${type}`} patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(40, 35, 30, 0.1)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Fault line */}
        <path
          d={paths.faultLine}
          fill="none"
          stroke="rgba(40, 35, 30, 0.4)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />

        {/* Left plate */}
        <g transform={paths.leftTransform}>
          <path d={paths.leftPlate} fill={`url(#cg-${type})`} stroke="rgba(40, 35, 30, 0.75)" strokeWidth="1.5" />
          <path d={paths.leftPlate} fill={`url(#ch-${type})`} stroke="none" />
        </g>

        {/* Right plate */}
        <g transform={paths.rightTransform}>
          <path d={paths.rightPlate} fill={`url(#cg-${type})`} stroke="rgba(40, 35, 30, 0.75)" strokeWidth="1.5" />
          <path d={paths.rightPlate} fill={`url(#ch-${type})`} stroke="none" />
        </g>

        {/* Stress arrows */}
        {d > 0.1 && arrows.map((a, i) => (
          <g
            key={i}
            transform={`translate(${a.x}, ${a.y}) rotate(${a.rotation})`}
            opacity={Math.min(d * 2, 0.7)}
          >
            <path
              d="M -12 0 L 8 0 M 3 -4 L 8 0 L 3 4"
              fill="none"
              stroke="rgba(40, 35, 30, 0.6)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}

        {/* Labels */}
        <text
          x={70}
          y={H - 20}
          textAnchor="middle"
          fill="rgba(40, 35, 30, 0.5)"
          style={{ fontSize: '10px', fontFamily: 'SF Mono, Monaco, monospace', letterSpacing: '0.1em' }}
        >
          {labels.left}
        </text>
        <text
          x={W - 70}
          y={H - 20}
          textAnchor="middle"
          fill="rgba(40, 35, 30, 0.5)"
          style={{ fontSize: '10px', fontFamily: 'SF Mono, Monaco, monospace', letterSpacing: '0.1em' }}
        >
          {labels.right}
        </text>
      </svg>

      <p className="text-[10px] text-muted-foreground/50 mt-1">
        {DESCRIPTIONS[type]}
      </p>
    </div>
  );
}
