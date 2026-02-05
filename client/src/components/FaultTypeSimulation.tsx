/*
 * DESIGN: Minimal Monochrome Modernism
 * Individual fault type visualization with isometric 3D blocks
 * Dark lines on light brown/beige background
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
    description: 'Horizontal movement along the fault plane',
    movement: 'Blocks slide past each other horizontally',
  },
  'normal': {
    title: 'Normal',
    description: 'Hanging wall moves down relative to footwall',
    movement: 'Extension causes blocks to pull apart',
  },
  'reverse': {
    title: 'Reverse',
    description: 'Hanging wall moves up relative to footwall',
    movement: 'Compression pushes blocks together',
  },
};

const MAX_DISPLACEMENT = 40;
const ANIMATION_DURATION = 3000;

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

  // Calculate block positions based on fault type
  const getBlockTransforms = () => {
    const d = displacement;
    switch (type) {
      case 'strike-slip':
        return {
          left: { x: -d * 0.8, y: 0 },
          right: { x: d * 0.8, y: 0 },
        };
      case 'normal':
        return {
          left: { x: -d * 0.3, y: d * 0.6 },
          right: { x: d * 0.3, y: -d * 0.2 },
        };
      case 'reverse':
        return {
          left: { x: d * 0.3, y: -d * 0.6 },
          right: { x: -d * 0.3, y: d * 0.2 },
        };
    }
  };

  const transforms = getBlockTransforms();

  // SVG dimensions
  const svgWidth = 320;
  const svgHeight = 240;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  
  // Block dimensions (isometric)
  const blockWidth = 80;
  const blockHeight = 60;
  const blockDepth = 50;
  
  // Isometric projection helpers
  const isoX = (x: number, z: number) => centerX + (x - z) * 0.866;
  const isoY = (x: number, y: number, z: number) => centerY + (x + z) * 0.5 - y;

  // Create isometric block paths
  const createBlockPath = (offsetX: number, offsetY: number, offsetZ: number) => {
    const w = blockWidth;
    const h = blockHeight;
    const d = blockDepth;
    
    // 8 corners of the block
    const corners = {
      // Front face
      ftl: { x: isoX(offsetX, offsetZ), y: isoY(offsetX, h + offsetY, offsetZ) },
      ftr: { x: isoX(offsetX + w, offsetZ), y: isoY(offsetX + w, h + offsetY, offsetZ) },
      fbl: { x: isoX(offsetX, offsetZ), y: isoY(offsetX, offsetY, offsetZ) },
      fbr: { x: isoX(offsetX + w, offsetZ), y: isoY(offsetX + w, offsetY, offsetZ) },
      // Back face
      btl: { x: isoX(offsetX, offsetZ + d), y: isoY(offsetX, h + offsetY, offsetZ + d) },
      btr: { x: isoX(offsetX + w, offsetZ + d), y: isoY(offsetX + w, h + offsetY, offsetZ + d) },
      bbl: { x: isoX(offsetX, offsetZ + d), y: isoY(offsetX, offsetY, offsetZ + d) },
      bbr: { x: isoX(offsetX + w, offsetZ + d), y: isoY(offsetX + w, offsetY, offsetZ + d) },
    };
    
    return {
      top: `M ${corners.ftl.x} ${corners.ftl.y} L ${corners.ftr.x} ${corners.ftr.y} L ${corners.btr.x} ${corners.btr.y} L ${corners.btl.x} ${corners.btl.y} Z`,
      front: `M ${corners.ftl.x} ${corners.ftl.y} L ${corners.ftr.x} ${corners.ftr.y} L ${corners.fbr.x} ${corners.fbr.y} L ${corners.fbl.x} ${corners.fbl.y} Z`,
      right: `M ${corners.ftr.x} ${corners.ftr.y} L ${corners.btr.x} ${corners.btr.y} L ${corners.bbr.x} ${corners.bbr.y} L ${corners.fbr.x} ${corners.fbr.y} Z`,
      left: `M ${corners.ftl.x} ${corners.ftl.y} L ${corners.btl.x} ${corners.btl.y} L ${corners.bbl.x} ${corners.bbl.y} L ${corners.fbl.x} ${corners.fbl.y} Z`,
    };
  };

  // Left block (offset to the left)
  const leftBlock = createBlockPath(
    -blockWidth - 5 + transforms.left.x, 
    transforms.left.y, 
    -blockDepth / 2
  );
  
  // Right block (offset to the right)
  const rightBlock = createBlockPath(
    5 + transforms.right.x, 
    transforms.right.y, 
    -blockDepth / 2
  );

  // Arrow paths for movement direction
  const getArrowPaths = () => {
    const arrowLength = 25;
    const arrowHead = 8;
    
    switch (type) {
      case 'strike-slip':
        return [
          // Left block arrow (pointing left)
          { 
            line: `M ${centerX - 60} ${centerY + 40} L ${centerX - 60 - arrowLength} ${centerY + 40}`,
            head: `M ${centerX - 60 - arrowLength + arrowHead} ${centerY + 40 - 5} L ${centerX - 60 - arrowLength} ${centerY + 40} L ${centerX - 60 - arrowLength + arrowHead} ${centerY + 40 + 5}`,
          },
          // Right block arrow (pointing right)
          { 
            line: `M ${centerX + 60} ${centerY - 20} L ${centerX + 60 + arrowLength} ${centerY - 20}`,
            head: `M ${centerX + 60 + arrowLength - arrowHead} ${centerY - 20 - 5} L ${centerX + 60 + arrowLength} ${centerY - 20} L ${centerX + 60 + arrowLength - arrowHead} ${centerY - 20 + 5}`,
          },
        ];
      case 'normal':
        return [
          // Left block arrow (down-left)
          { 
            line: `M ${centerX - 50} ${centerY + 20} L ${centerX - 65} ${centerY + 45}`,
            head: `M ${centerX - 58} ${centerY + 38} L ${centerX - 65} ${centerY + 45} L ${centerX - 58} ${centerY + 45}`,
          },
          // Right block arrow (up-right)
          { 
            line: `M ${centerX + 50} ${centerY - 10} L ${centerX + 65} ${centerY - 25}`,
            head: `M ${centerX + 58} ${centerY - 18} L ${centerX + 65} ${centerY - 25} L ${centerX + 65} ${centerY - 18}`,
          },
        ];
      case 'reverse':
        return [
          // Left block arrow (up-right)
          { 
            line: `M ${centerX - 50} ${centerY + 20} L ${centerX - 35} ${centerY - 5}`,
            head: `M ${centerX - 42} ${centerY + 2} L ${centerX - 35} ${centerY - 5} L ${centerX - 35} ${centerY + 2}`,
          },
          // Right block arrow (down-left)
          { 
            line: `M ${centerX + 50} ${centerY - 10} L ${centerX + 35} ${centerY + 15}`,
            head: `M ${centerX + 42} ${centerY + 8} L ${centerX + 35} ${centerY + 15} L ${centerX + 42} ${centerY + 15}`,
          },
        ];
    }
  };

  const arrows = getArrowPaths();

  return (
    <motion.div 
      className={`flex flex-col ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <div className="mb-4 text-center">
        <h3 className="text-xl font-medium text-foreground mb-1">{info.title}</h3>
        <p className="text-sm text-muted-foreground">{info.description}</p>
      </div>

      {/* SVG Visualization */}
      <div className="relative bg-card/30 rounded border border-border/50 overflow-hidden">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto"
          style={{ minHeight: '200px' }}
        >
          {/* Fault line (diagonal) */}
          <motion.line
            x1={centerX}
            y1={0}
            x2={centerX}
            y2={svgHeight}
            className="fault-line"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Left block */}
          <motion.g
            animate={{ 
              x: transforms.left.x, 
              y: transforms.left.y 
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            <path d={leftBlock.left} className="block-face block-face-side" />
            <path d={leftBlock.front} className="block-face block-face-front" />
            <path d={leftBlock.top} className="block-face block-face-top" />
          </motion.g>

          {/* Right block */}
          <motion.g
            animate={{ 
              x: transforms.right.x, 
              y: transforms.right.y 
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            <path d={rightBlock.right} className="block-face block-face-side" />
            <path d={rightBlock.front} className="block-face block-face-front" />
            <path d={rightBlock.top} className="block-face block-face-top" />
          </motion.g>

          {/* Movement arrows */}
          <AnimatePresence>
            {displacement > 5 && arrows.map((arrow, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
              >
                <path d={arrow.line} className="movement-arrow" />
                <path d={arrow.head} className="movement-arrow" />
              </motion.g>
            ))}
          </AnimatePresence>

          {/* Labels */}
          <text 
            x={centerX - 70} 
            y={svgHeight - 15} 
            className="measurement-label fill-muted-foreground text-center"
            textAnchor="middle"
          >
            Block A
          </text>
          <text 
            x={centerX + 70} 
            y={svgHeight - 15} 
            className="measurement-label fill-muted-foreground text-center"
            textAnchor="middle"
          >
            Block B
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
            className="rounded-full h-8 w-8 p-0 border-border/50"
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
