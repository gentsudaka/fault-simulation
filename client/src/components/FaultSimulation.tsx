/*
 * DESIGN: Interactive Diagram Modernism
 * Swiss Design meets Interactive Infographics
 * 
 * Features:
 * - Direct manipulation of fault blocks
 * - Bold graphic contrast
 * - Measurement callouts with leader lines
 * - Animated fault line with direction indicators
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Info, GripHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

// Image URLs for the simulation (CDN hosted)
const IMAGES = {
  desertTerrain: 'https://files.manuscdn.com/user_upload_by_module/session_file/110665082/pSGurSYQOEMoznwf.png',
  ridgeLeft: 'https://files.manuscdn.com/user_upload_by_module/session_file/110665082/doTFgnsjYHDJCrVb.png',
  ridgeRight: 'https://files.manuscdn.com/user_upload_by_module/session_file/110665082/ErTFBTsJsrxwWLns.png',
  faultDiagram: 'https://files.manuscdn.com/user_upload_by_module/session_file/110665082/edXmVtcnnCZLpRil.png',
};

// Maximum displacement in pixels (represents ~5km in geological scale)
const MAX_DISPLACEMENT = 150;
const ANIMATION_DURATION = 8000; // 8 seconds for full animation

interface FaultSimulationProps {
  className?: string;
}

export default function FaultSimulation({ className = '' }: FaultSimulationProps) {
  const [displacement, setDisplacement] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const startDisplacementRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const targetDisplacement = MAX_DISPLACEMENT;
    const newDisplacement = startDisplacementRef.current + (targetDisplacement - startDisplacementRef.current) * eased;
    
    setDisplacement(newDisplacement);

    if (progress < 1 && isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (progress >= 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, displacement]);

  useEffect(() => {
    if (isPlaying && !isDragging) {
      startTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isDragging, animate]);

  const handlePlayPause = () => {
    if (displacement >= MAX_DISPLACEMENT) {
      // Reset if at max
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

  // Calculate geological time based on displacement (simulated millions of years)
  const geologicalTime = Math.round((displacement / MAX_DISPLACEMENT) * 2.5 * 10) / 10;
  const displacementKm = Math.round((displacement / MAX_DISPLACEMENT) * 5 * 10) / 10;

  return (
    <div className={`relative w-full h-full ${className}`} ref={containerRef}>
      {/* Main simulation canvas */}
      <div className="relative w-full h-full overflow-hidden rounded-lg simulation-canvas">
        {/* Background terrain */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${IMAGES.desertTerrain})` }}
        />
        
        {/* SVG overlay for fault line and annotations */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {/* Fault line - diagonal from bottom-left to top-right */}
          <line
            x1="0"
            y1="100%"
            x2="100%"
            y2="0"
            className="fault-line"
            stroke="#2D2D2D"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Direction arrows */}
          <defs>
            <marker
              id="arrowLeft"
              markerWidth="10"
              markerHeight="10"
              refX="5"
              refY="5"
              orient="auto"
            >
              <path d="M10,0 L0,5 L10,10" fill="none" stroke="#00A6A6" strokeWidth="2" />
            </marker>
            <marker
              id="arrowRight"
              markerWidth="10"
              markerHeight="10"
              refX="5"
              refY="5"
              orient="auto"
            >
              <path d="M0,0 L10,5 L0,10" fill="none" stroke="#00A6A6" strokeWidth="2" />
            </marker>
          </defs>
          
          {/* Movement direction indicators */}
          <g className="opacity-70">
            <line
              x1="20%"
              y1="70%"
              x2="10%"
              y2="70%"
              stroke="#00A6A6"
              strokeWidth="2"
              markerEnd="url(#arrowLeft)"
            />
            <line
              x1="80%"
              y1="30%"
              x2="90%"
              y2="30%"
              stroke="#00A6A6"
              strokeWidth="2"
              markerEnd="url(#arrowRight)"
            />
          </g>
        </svg>

        {/* Left block (bottom-left ridge) - moves left */}
        <motion.div
          className="absolute w-[45%] h-[45%] bottom-[5%] left-[5%]"
          animate={{ x: -displacement * 0.7, y: displacement * 0.3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div 
            className="w-full h-full rounded-lg overflow-hidden shadow-2xl"
            style={{
              backgroundImage: `url(${IMAGES.ridgeLeft})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Ridge label */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-charcoal/90 text-white px-3 py-1 rounded text-sm font-medium whitespace-nowrap">
            Ridge A
          </div>
        </motion.div>

        {/* Right block (top-right ridge) - moves right */}
        <motion.div
          className="absolute w-[45%] h-[45%] top-[5%] right-[5%]"
          animate={{ x: displacement * 0.7, y: -displacement * 0.3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div 
            className="w-full h-full rounded-lg overflow-hidden shadow-2xl"
            style={{
              backgroundImage: `url(${IMAGES.ridgeRight})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Ridge label */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-charcoal/90 text-white px-3 py-1 rounded text-sm font-medium whitespace-nowrap">
            Ridge B
          </div>
        </motion.div>

        {/* Alignment guide - shows original position */}
        <AnimatePresence>
          {displacement < 10 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-teal/20 border-2 border-dashed border-teal rounded-lg px-6 py-3">
                <span className="text-teal font-medium text-sm">
                  Originally aligned as one continuous ridge
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Displacement measurement overlay */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 info-card rounded-lg px-4 py-2 z-20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="measurement-label text-muted-foreground uppercase tracking-wider">
                Displacement
              </div>
              <div className="text-2xl font-bold text-foreground font-mono">
                {displacementKm} <span className="text-sm font-normal">km</span>
              </div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="measurement-label text-muted-foreground uppercase tracking-wider">
                Time Elapsed
              </div>
              <div className="text-2xl font-bold text-foreground font-mono">
                {geologicalTime} <span className="text-sm font-normal">Ma</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Drag hint */}
        <AnimatePresence>
          {displacement === 0 && !isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground text-sm"
            >
              <GripHorizontal className="w-4 h-4" />
              <span>Use slider or play to simulate fault movement</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls panel */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/95 to-transparent"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-xl mx-auto space-y-4">
          {/* Slider */}
          <div className="px-2">
            <Slider
              value={[displacement]}
              onValueChange={handleSliderChange}
              max={MAX_DISPLACEMENT}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground font-mono">
              <span>0 km</span>
              <span>5 km</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="rounded-full"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              onClick={handlePlayPause}
              className="rounded-full px-6 bg-teal hover:bg-teal-dark text-white"
              style={{ backgroundColor: '#00A6A6' }}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {displacement >= MAX_DISPLACEMENT ? 'Replay' : 'Play'}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowInfo(!showInfo)}
              className={`rounded-full ${showInfo ? 'bg-primary/10' : ''}`}
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Info panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            className="absolute top-4 right-4 w-72 info-card rounded-xl p-4 z-30"
          >
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal" style={{ backgroundColor: '#00A6A6' }} />
              Strike-Slip Fault
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              This simulation shows a <strong>strike-slip fault</strong> in the Taklamakan Desert. 
              The two colorful ridges were once a single continuous formation, but have been 
              split apart by horizontal movement along the fault plane.
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-border">
              <img 
                src={IMAGES.faultDiagram} 
                alt="Fault diagram" 
                className="w-16 h-16 rounded object-cover"
              />
              <p className="text-xs text-muted-foreground">
                Arrows indicate the direction of relative movement between the two blocks.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
