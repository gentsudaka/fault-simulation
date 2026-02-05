/*
 * DESIGN: Seismically Accurate Curved Plates
 * Abstract minimal visualization with curved fault surfaces
 * Dark lines on light brown/beige background
 * 
 * Seismic accuracy notes:
 * - Fault surfaces are rarely planar; they curve and undulate
 * - Strike-slip: Transform boundary with lateral shear
 * - Normal: Extensional regime, listric (curved) fault geometry
 * - Reverse/Thrust: Compressional regime, curved thrust surface
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export type FaultType = 'strike-slip' | 'normal' | 'reverse';

interface FaultTypeSimulationProps {
  type: FaultType;
  isActive: boolean;
  className?: string;
}

const FAULT_INFO = {
  'strike-slip': {
    title: 'Strike-Slip',
    subtitle: 'Transform Boundary',
    description: 'Lateral shear along curved fault plane',
    movement: 'Plates slide horizontally past each other',
  },
  'normal': {
    title: 'Normal',
    subtitle: 'Extensional Regime',
    description: 'Hanging wall drops along listric surface',
    movement: 'Crustal extension pulls plates apart',
  },
  'reverse': {
    title: 'Reverse',
    subtitle: 'Compressional Regime',
    description: 'Hanging wall rises along thrust surface',
    movement: 'Crustal compression pushes plates together',
  },
};

const MAX_DISPLACEMENT = 50;
const ANIMATION_DURATION = 3500;

export default function FaultTypeSimulation({ 
  type, 
  isActive,
  className = '' 
}: FaultTypeSimulationProps) {
  const [displacement, setDisplacement] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const startDisplacementRef = useRef<number>(0);

  const info = FAULT_INFO[type];

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
      startDisplacementRef.current = displacement;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
    
    // Ease out cubic for natural deceleration
    const eased = 1 - Math.pow(1 - progress, 3);
    const newDisplacement = startDisplacementRef.current + (MAX_DISPLACEMENT - startDisplacementRef.current) * eased;
    
    setDisplacement(newDisplacement);

    if (progress < 1 && isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (progress >= 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, displacement]);

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  const handlePlayPause = () => {
    if (displacement >= MAX_DISPLACEMENT) {
      setDisplacement(0);
      startTimeRef.current = 0;
      startDisplacementRef.current = 0;
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setDisplacement(0);
    startTimeRef.current = 0;
    startDisplacementRef.current = 0;
  };

  const handleSliderChange = (value: number[]) => {
    setIsPlaying(false);
    setDisplacement(value[0]);
  };

  // SVG dimensions
  const svgWidth = 320;
  const svgHeight = 260;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // Normalized displacement (0-1)
  const d = displacement / MAX_DISPLACEMENT;

  // Generate curved plate paths based on fault type
  const generatePlatePaths = () => {
    switch (type) {
      case 'strike-slip': {
        // Transform fault - curved vertical fault plane with horizontal offset
        const offset = d * 35;
        
        // Left plate - curved edge facing right
        const leftPlate = `
          M 30 ${centerY - 60}
          L 30 ${centerY + 80}
          L ${centerX - 8 - offset} ${centerY + 80}
          Q ${centerX - 5 - offset} ${centerY + 40}, ${centerX - 10 - offset} ${centerY}
          Q ${centerX - 5 - offset} ${centerY - 40}, ${centerX - 8 - offset} ${centerY - 60}
          Z
        `;
        
        // Right plate - curved edge facing left (complementary curve)
        const rightPlate = `
          M ${svgWidth - 30} ${centerY - 60}
          L ${svgWidth - 30} ${centerY + 80}
          L ${centerX + 8 + offset} ${centerY + 80}
          Q ${centerX + 5 + offset} ${centerY + 40}, ${centerX + 10 + offset} ${centerY}
          Q ${centerX + 5 + offset} ${centerY - 40}, ${centerX + 8 + offset} ${centerY - 60}
          Z
        `;
        
        // Fault trace - curved line between plates
        const faultLine = `
          M ${centerX} ${centerY - 70}
          Q ${centerX - 3} ${centerY - 35}, ${centerX} ${centerY}
          Q ${centerX + 3} ${centerY + 35}, ${centerX} ${centerY + 90}
        `;
        
        return { leftPlate, rightPlate, faultLine, leftTransform: `translate(0, ${-offset * 0.8})`, rightTransform: `translate(0, ${offset * 0.8})` };
      }
      
      case 'normal': {
        // Listric normal fault - curved concave-up fault surface
        // Hanging wall (right) drops down and rotates slightly
        const dropY = d * 40;
        const pullX = d * 15;
        const rotation = d * 5;
        
        // Footwall (left plate) - stays relatively fixed
        const leftPlate = `
          M 25 ${centerY - 50}
          L 25 ${centerY + 90}
          L ${centerX + 20} ${centerY + 90}
          Q ${centerX - 10} ${centerY + 30}, ${centerX - 25} ${centerY - 20}
          L ${centerX - 35} ${centerY - 50}
          Z
        `;
        
        // Hanging wall (right plate) - drops along curved surface
        const rightPlate = `
          M ${svgWidth - 25} ${centerY - 50}
          L ${svgWidth - 25} ${centerY + 90}
          L ${centerX + 25} ${centerY + 90}
          Q ${centerX - 5} ${centerY + 30}, ${centerX - 20} ${centerY - 20}
          L ${centerX - 30} ${centerY - 50}
          Z
        `;
        
        // Listric fault surface - concave up curve
        const faultLine = `
          M ${centerX - 30} ${centerY - 60}
          Q ${centerX - 40} ${centerY}, ${centerX - 20} ${centerY + 40}
          Q ${centerX + 10} ${centerY + 70}, ${centerX + 30} ${centerY + 95}
        `;
        
        return { 
          leftPlate, 
          rightPlate, 
          faultLine, 
          leftTransform: `translate(${-pullX * 0.3}, 0)`,
          rightTransform: `translate(${pullX}, ${dropY}) rotate(${rotation} ${centerX + 50} ${centerY})`
        };
      }
      
      case 'reverse': {
        // Thrust fault - curved convex-up fault surface
        // Hanging wall (left) rises up and over
        const riseY = d * 35;
        const pushX = d * 20;
        const rotation = d * -4;
        
        // Hanging wall (left plate) - rises along thrust
        const leftPlate = `
          M 25 ${centerY - 40}
          L 25 ${centerY + 90}
          L ${centerX + 10} ${centerY + 90}
          Q ${centerX + 20} ${centerY + 50}, ${centerX + 30} ${centerY}
          Q ${centerX + 25} ${centerY - 30}, ${centerX + 15} ${centerY - 40}
          Z
        `;
        
        // Footwall (right plate) - relatively fixed
        const rightPlate = `
          M ${svgWidth - 25} ${centerY - 40}
          L ${svgWidth - 25} ${centerY + 90}
          L ${centerX + 15} ${centerY + 90}
          Q ${centerX + 25} ${centerY + 50}, ${centerX + 35} ${centerY}
          Q ${centerX + 30} ${centerY - 30}, ${centerX + 20} ${centerY - 40}
          Z
        `;
        
        // Thrust fault surface - convex curve
        const faultLine = `
          M ${centerX + 10} ${centerY - 50}
          Q ${centerX + 40} ${centerY - 10}, ${centerX + 35} ${centerY + 30}
          Q ${centerX + 25} ${centerY + 60}, ${centerX + 15} ${centerY + 95}
        `;
        
        return { 
          leftPlate, 
          rightPlate, 
          faultLine, 
          leftTransform: `translate(${pushX}, ${-riseY}) rotate(${rotation} ${centerX - 50} ${centerY + 50})`,
          rightTransform: `translate(${-pushX * 0.2}, 0)`
        };
      }
    }
  };

  const paths = generatePlatePaths();

  // Stress indicators (small arrows showing force direction)
  const getStressArrows = () => {
    const arrowSize = 20;
    const opacity = Math.min(d * 2, 0.7);
    
    switch (type) {
      case 'strike-slip':
        return [
          { x: 60, y: centerY - 30, rotation: -90, opacity },
          { x: 60, y: centerY + 50, rotation: -90, opacity },
          { x: svgWidth - 60, y: centerY - 30, rotation: 90, opacity },
          { x: svgWidth - 60, y: centerY + 50, rotation: 90, opacity },
        ];
      case 'normal':
        return [
          { x: 50, y: centerY, rotation: 180, opacity },
          { x: svgWidth - 50, y: centerY, rotation: 0, opacity },
        ];
      case 'reverse':
        return [
          { x: 50, y: centerY, rotation: 0, opacity },
          { x: svgWidth - 50, y: centerY, rotation: 180, opacity },
        ];
    }
  };

  const stressArrows = getStressArrows();

  return (
    <motion.div 
      className={`flex flex-col ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <div className="mb-3 text-center">
        <h3 className="text-xl font-medium text-foreground mb-0.5">{info.title}</h3>
        <p className="text-xs text-muted-foreground/70 uppercase tracking-widest mb-1">{info.subtitle}</p>
        <p className="text-sm text-muted-foreground">{info.description}</p>
      </div>

      {/* SVG Visualization */}
      <div className="relative bg-card/20 rounded border border-border/30 overflow-hidden">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto"
          style={{ minHeight: '220px' }}
        >
          <defs>
            {/* Subtle gradient for depth */}
            <linearGradient id={`plateGradient-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(40, 35, 30, 0.08)" />
              <stop offset="100%" stopColor="rgba(40, 35, 30, 0.03)" />
            </linearGradient>
            
            {/* Hatching pattern for geological cross-section look */}
            <pattern id={`hatch-${type}`} patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(40, 35, 30, 0.1)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Fault line (curved) - drawn first, behind plates */}
          <motion.path
            d={paths.faultLine}
            fill="none"
            stroke="rgba(40, 35, 30, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2 }}
          />

          {/* Left plate */}
          <motion.g
            animate={{ 
              transform: paths.leftTransform
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          >
            <path 
              d={paths.leftPlate} 
              fill={`url(#plateGradient-${type})`}
              stroke="rgba(40, 35, 30, 0.75)"
              strokeWidth="1.5"
            />
            <path 
              d={paths.leftPlate} 
              fill={`url(#hatch-${type})`}
              stroke="none"
            />
          </motion.g>

          {/* Right plate */}
          <motion.g
            animate={{ 
              transform: paths.rightTransform
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          >
            <path 
              d={paths.rightPlate} 
              fill={`url(#plateGradient-${type})`}
              stroke="rgba(40, 35, 30, 0.75)"
              strokeWidth="1.5"
            />
            <path 
              d={paths.rightPlate} 
              fill={`url(#hatch-${type})`}
              stroke="none"
            />
          </motion.g>

          {/* Stress arrows */}
          <AnimatePresence>
            {displacement > 5 && stressArrows.map((arrow, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: arrow.opacity }}
                exit={{ opacity: 0 }}
                transform={`translate(${arrow.x}, ${arrow.y}) rotate(${arrow.rotation})`}
              >
                <path 
                  d="M -12 0 L 8 0 M 3 -4 L 8 0 L 3 4" 
                  fill="none"
                  stroke="rgba(40, 35, 30, 0.6)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.g>
            ))}
          </AnimatePresence>

          {/* Plate labels */}
          <text 
            x={70} 
            y={svgHeight - 20} 
            className="fill-muted-foreground/60"
            style={{ fontSize: '10px', fontFamily: 'SF Mono, Monaco, monospace', letterSpacing: '0.1em' }}
            textAnchor="middle"
          >
            {type === 'reverse' ? 'HANGING' : type === 'normal' ? 'FOOTWALL' : 'PLATE A'}
          </text>
          <text 
            x={svgWidth - 70} 
            y={svgHeight - 20} 
            className="fill-muted-foreground/60"
            style={{ fontSize: '10px', fontFamily: 'SF Mono, Monaco, monospace', letterSpacing: '0.1em' }}
            textAnchor="middle"
          >
            {type === 'reverse' ? 'FOOTWALL' : type === 'normal' ? 'HANGING' : 'PLATE B'}
          </text>
        </svg>
      </div>

      {/* Controls */}
      <div className="mt-4 space-y-3">
        {/* Slider */}
        <div className="px-1">
          <Slider
            value={[displacement]}
            onValueChange={handleSliderChange}
            max={MAX_DISPLACEMENT}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="rounded-full h-8 w-8 p-0 border-border/40 bg-transparent hover:bg-card/50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
          <Button
            onClick={handlePlayPause}
            size="sm"
            className="rounded-full px-4 bg-foreground text-background hover:bg-foreground/90"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 mr-1.5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1.5" />
                {displacement >= MAX_DISPLACEMENT ? 'Replay' : 'Play'}
              </>
            )}
          </Button>
        </div>

        {/* Movement description */}
        <p className="text-xs text-muted-foreground text-center italic">
          {info.movement}
        </p>
      </div>
    </motion.div>
  );
}
