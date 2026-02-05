/*
 * DESIGN: 3D Plate Scenario Visualization
 * Shows 2-plate, 3-plate (triple junction), or 4-plate scenarios
 * Real-world examples with proper geological context
 * Third-person isometric view with consistent angle
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import TectonicPlate3D, { PlateProps } from './TectonicPlate3D';

export type ScenarioType = '2-plate' | '3-plate' | '4-plate';

interface ScenarioConfig {
  title: string;
  subtitle: string;
  location: string;
  description: string;
  plates: PlateProps[];
  boundaryType: string;
}

// Real-world scenario configurations with proper 3D positioning
const SCENARIOS: Record<ScenarioType, ScenarioConfig> = {
  '2-plate': {
    title: 'San Andreas Fault',
    subtitle: 'Transform Boundary',
    location: 'California, USA',
    description: 'The Pacific Plate slides northwest past the North American Plate at ~46mm/year. This right-lateral strike-slip fault extends 1,300km through California.',
    boundaryType: 'Transform (Conservative)',
    plates: [
      {
        id: 'pacific',
        name: 'Pacific',
        color: 'rgba(195, 175, 155, 0.95)',
        position: { x: -55, y: 0, z: 0 },
        rotation: { x: 55, y: 0, z: -25 },
        size: { width: 90, height: 35, depth: 70 },
        velocity: { x: 0, y: -0.6, z: 0 },
      },
      {
        id: 'north-american',
        name: 'N. American',
        color: 'rgba(175, 160, 140, 0.95)',
        position: { x: 55, y: 0, z: 0 },
        rotation: { x: 55, y: 0, z: -25 },
        size: { width: 90, height: 35, depth: 70 },
        velocity: { x: 0, y: 0.6, z: 0 },
      },
    ],
  },
  '3-plate': {
    title: 'Afar Triple Junction',
    subtitle: 'Ridge-Ridge-Ridge (RRR)',
    location: 'Ethiopia / Djibouti',
    description: 'The clearest triple junction on Earth where the Nubian, Somali, and Arabian plates diverge. The Afar Depression is actively rifting, creating new oceanic crust.',
    boundaryType: 'Divergent (Constructive)',
    plates: [
      {
        id: 'nubian',
        name: 'Nubian',
        color: 'rgba(190, 170, 150, 0.95)',
        position: { x: -45, y: 25, z: 0 },
        rotation: { x: 55, y: 0, z: -25 },
        size: { width: 75, height: 30, depth: 60 },
        velocity: { x: -0.5, y: 0.3, z: 0 },
      },
      {
        id: 'somali',
        name: 'Somali',
        color: 'rgba(180, 165, 145, 0.95)',
        position: { x: 45, y: 25, z: 0 },
        rotation: { x: 55, y: 0, z: -25 },
        size: { width: 75, height: 30, depth: 60 },
        velocity: { x: 0.5, y: 0.3, z: 0 },
      },
      {
        id: 'arabian',
        name: 'Arabian',
        color: 'rgba(170, 155, 135, 0.95)',
        position: { x: 0, y: -40, z: 0 },
        rotation: { x: 55, y: 0, z: -25 },
        size: { width: 75, height: 30, depth: 60 },
        velocity: { x: 0, y: -0.6, z: 0 },
      },
    ],
  },
  '4-plate': {
    title: 'Mendocino Complex',
    subtitle: 'Multi-Plate Interaction Zone',
    location: 'Northern California',
    description: 'A complex region where the Pacific, North American, Gorda, and Juan de Fuca plates interact. Recent research reveals 5+ moving pieces in this seismically active zone.',
    boundaryType: 'Mixed (Transform + Subduction)',
    plates: [
      {
        id: 'pacific-m',
        name: 'Pacific',
        color: 'rgba(195, 175, 155, 0.95)',
        position: { x: -40, y: 30, z: 0 },
        rotation: { x: 55, y: 0, z: -25 },
        size: { width: 65, height: 25, depth: 52 },
        velocity: { x: -0.35, y: -0.35, z: 0 },
      },
      {
        id: 'north-american-m',
        name: 'N. American',
        color: 'rgba(175, 160, 140, 0.95)',
        position: { x: 40, y: 30, z: 0 },
        rotation: { x: 55, y: 0, z: -25 },
        size: { width: 65, height: 25, depth: 52 },
        velocity: { x: 0.35, y: -0.35, z: 0 },
      },
      {
        id: 'gorda',
        name: 'Gorda',
        color: 'rgba(165, 150, 130, 0.95)',
        position: { x: -40, y: -30, z: 0 },
        rotation: { x: 55, y: 0, z: -25 },
        size: { width: 65, height: 25, depth: 52 },
        velocity: { x: -0.35, y: 0.35, z: 0 },
      },
      {
        id: 'juan-de-fuca',
        name: 'J. de Fuca',
        color: 'rgba(185, 170, 150, 0.95)',
        position: { x: 40, y: -30, z: 0 },
        rotation: { x: 55, y: 0, z: -25 },
        size: { width: 65, height: 25, depth: 52 },
        velocity: { x: 0.35, y: 0.35, z: 0 },
      },
    ],
  },
};

const MAX_DISPLACEMENT = 1;
const ANIMATION_DURATION = 4000;

interface PlateScenarioProps {
  type: ScenarioType;
  className?: string;
}

export default function PlateScenario({ type, className = '' }: PlateScenarioProps) {
  const [displacement, setDisplacement] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const startDisplacementRef = useRef<number>(0);

  const scenario = SCENARIOS[type];

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
      startDisplacementRef.current = displacement;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
    
    // Ease out cubic
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

  return (
    <motion.div 
      className={`flex flex-col ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-3 text-center relative">
        <div className="flex items-center justify-center gap-2 mb-1">
          <h3 className="text-xl font-medium text-foreground">{scenario.title}</h3>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 rounded-full hover:bg-foreground/5 transition-colors"
          >
            <Info className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground/70 uppercase tracking-widest mb-0.5">
          {scenario.subtitle}
        </p>
        <p className="text-sm text-muted-foreground">{scenario.location}</p>
      </div>

      {/* Info panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 px-3 py-2 bg-foreground/5 rounded border border-border/30 text-xs text-muted-foreground"
          >
            <p className="mb-1"><strong>Boundary:</strong> {scenario.boundaryType}</p>
            <p>{scenario.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Visualization Container */}
      <div 
        className="relative bg-card/20 rounded border border-border/30 overflow-hidden"
        style={{ 
          height: '280px',
          perspective: '600px',
          perspectiveOrigin: '50% 40%',
        }}
      >
        {/* 3D Scene */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Plates */}
          {scenario.plates.map((plate) => (
            <TectonicPlate3D
              key={plate.id}
              plate={plate}
              displacement={displacement}
              showLabel={true}
              showArrow={true}
            />
          ))}
        </div>

        {/* Plate count badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-foreground/5 rounded text-xs text-muted-foreground font-mono">
          {scenario.plates.length} plates
        </div>

        {/* Junction type indicator */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-foreground/5 rounded text-xs text-muted-foreground">
          {type === '2-plate' ? 'Binary' : type === '3-plate' ? 'Triple Junction' : 'Quadruple Zone'}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 space-y-3">
        {/* Slider */}
        <div className="px-1">
          <Slider
            value={[displacement * 100]}
            onValueChange={(v) => handleSliderChange([v[0] / 100])}
            max={100}
            step={1}
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
      </div>
    </motion.div>
  );
}
