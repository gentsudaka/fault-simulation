/*
 * DESIGN: 3D Plate Scenario Visualization
 * Shows 2-plate, 3-plate (triple junction), or 4-plate scenarios
 * Real-world examples with proper geological context
 * Third-person isometric view with user-adjustable rotation
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Info, Layers, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import TectonicPlate3D from './TectonicPlate3D';
import FaultCrossSection from './FaultCrossSection';
import { SCENARIOS, type ScenarioType } from '@/data/scenarios';

export type { ScenarioType };

const MAX_DISPLACEMENT = 1;
const ANIMATION_DURATION = 4000;

interface PlateScenarioProps {
  type: ScenarioType;
  className?: string;
}

export default function PlateScenario({ type, className = '' }: PlateScenarioProps) {
  const scenarios = SCENARIOS[type];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [displacement, setDisplacement] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | 'section'>('3d');
  const [viewOffset, setViewOffset] = useState({ x: 0, z: 0 });
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const startDisplacementRef = useRef<number>(0);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startOffset: { x: number; z: number };
  } | null>(null);

  const scenario = scenarios[selectedIndex];

  // Reset state when switching scenarios
  useEffect(() => {
    setIsPlaying(false);
    setDisplacement(0);
    startTimeRef.current = 0;
    startDisplacementRef.current = 0;
    setViewMode('3d');
    setViewOffset({ x: 0, z: 0 });
  }, [selectedIndex]);

  // Animation loop — reads only from refs to avoid stale closures
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const newDisplacement =
      startDisplacementRef.current +
      (MAX_DISPLACEMENT - startDisplacementRef.current) * eased;

    setDisplacement(newDisplacement);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsPlaying(false);
    }
  }, []);

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
      startDisplacementRef.current = 0;
    } else {
      startDisplacementRef.current = displacement;
    }
    startTimeRef.current = 0;
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

  // Drag rotation handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (viewMode !== '3d') return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startOffset: { ...viewOffset },
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setViewOffset({
      x: Math.max(-30, Math.min(30, dragRef.current.startOffset.x - dy * 0.3)),
      z: Math.max(-40, Math.min(40, dragRef.current.startOffset.z - dx * 0.3)),
    });
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  return (
    <motion.div
      className={`flex flex-col ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scenario selector */}
      {scenarios.length > 1 && (
        <div className="flex items-center justify-center gap-1 mb-3">
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSelectedIndex(i)}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                i === selectedIndex
                  ? 'bg-foreground/10 text-foreground font-medium'
                  : 'text-muted-foreground/60 hover:text-muted-foreground'
              }`}
            >
              {s.location}
            </button>
          ))}
        </div>
      )}

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
            <p className="mb-1">
              <strong>Boundary:</strong> {scenario.boundaryType}
            </p>
            <p>{scenario.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View mode toggle */}
      {scenario.faultType && (
        <div className="flex items-center justify-center gap-1 mb-2">
          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-full transition-colors ${
              viewMode === '3d'
                ? 'bg-foreground/10 text-foreground'
                : 'text-muted-foreground/60 hover:text-muted-foreground'
            }`}
          >
            <Box className="w-3 h-3" />
            3D
          </button>
          <button
            onClick={() => setViewMode('section')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-full transition-colors ${
              viewMode === 'section'
                ? 'bg-foreground/10 text-foreground'
                : 'text-muted-foreground/60 hover:text-muted-foreground'
            }`}
          >
            <Layers className="w-3 h-3" />
            Section
          </button>
        </div>
      )}

      {/* Visualization */}
      <div
        className="relative bg-card/20 rounded border border-border/30 overflow-hidden select-none"
        style={{
          height: '280px',
          ...(viewMode === '3d'
            ? {
                perspective: '600px',
                perspectiveOrigin: '50% 40%',
                cursor: dragRef.current ? 'grabbing' : 'grab',
              }
            : {}),
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {viewMode === '3d' ? (
          <>
            {/* 3D Scene */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {scenario.plates.map((plate) => (
                <TectonicPlate3D
                  key={plate.id}
                  plate={plate}
                  displacement={displacement}
                  showLabel={true}
                  showArrow={true}
                  viewOffset={viewOffset}
                />
              ))}
            </div>

            {/* Plate count badge */}
            <div className="absolute top-3 left-3 px-2 py-1 bg-foreground/5 rounded text-xs text-muted-foreground font-mono pointer-events-none">
              {scenario.plates.length} plates
            </div>

            {/* Junction type indicator */}
            <div className="absolute top-3 right-3 px-2 py-1 bg-foreground/5 rounded text-xs text-muted-foreground pointer-events-none">
              {type === '2-plate'
                ? 'Binary'
                : type === '3-plate'
                  ? 'Triple Junction'
                  : 'Quadruple Zone'}
            </div>

            {/* Drag hint */}
            {viewOffset.x === 0 && viewOffset.z === 0 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/40 pointer-events-none">
                drag to rotate
              </div>
            )}
          </>
        ) : (
          scenario.faultType && (
            <FaultCrossSection
              type={scenario.faultType}
              displacement={displacement}
            />
          )
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 space-y-3">
        <div className="px-1">
          <Slider
            value={[displacement * 100]}
            onValueChange={(v) => handleSliderChange([v[0] / 100])}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

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
