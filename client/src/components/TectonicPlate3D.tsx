/*
 * DESIGN: 3D Tectonic Plate Visualization
 * Uses CSS 3D transforms for true 3D plate rendering
 * Minimal aesthetic with warm beige background
 * Shows thick crustal blocks with visible depth
 */

import { motion } from 'framer-motion';
import { CSSProperties } from 'react';

interface PlateProps {
  id: string;
  name: string;
  color: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  velocity?: { x: number; y: number; z: number };
  style?: CSSProperties;
}

interface TectonicPlate3DProps {
  plate: PlateProps;
  displacement: number;
  showLabel?: boolean;
  showArrow?: boolean;
}

export default function TectonicPlate3D({ 
  plate, 
  displacement,
  showLabel = true,
  showArrow = true
}: TectonicPlate3DProps) {
  const { position, rotation, size, velocity, color, name } = plate;
  
  // Calculate animated position based on displacement and velocity
  const animatedPos = {
    x: position.x + (velocity?.x || 0) * displacement * 50,
    y: position.y + (velocity?.y || 0) * displacement * 50,
    z: position.z + (velocity?.z || 0) * displacement * 50,
  };

  // CSS 3D transform for the entire plate group
  const groupTransform = `
    translate3d(${animatedPos.x}px, ${animatedPos.y}px, ${animatedPos.z}px)
    rotateX(${rotation.x}deg)
    rotateY(${rotation.y}deg)
    rotateZ(${rotation.z}deg)
  `;

  const { width, height, depth } = size;
  const hw = width / 2;
  const hh = height / 2;
  const hd = depth / 2;

  // Define the 6 faces of the 3D box
  const faces = [
    // Top face (most visible in isometric view)
    {
      name: 'top',
      width: width,
      height: depth,
      transform: `rotateX(90deg) translateZ(${hh}px)`,
      shade: 1.0,
    },
    // Front face
    {
      name: 'front',
      width: width,
      height: height,
      transform: `translateZ(${hd}px)`,
      shade: 0.85,
    },
    // Right face
    {
      name: 'right',
      width: depth,
      height: height,
      transform: `rotateY(90deg) translateZ(${hw}px)`,
      shade: 0.7,
    },
    // Back face
    {
      name: 'back',
      width: width,
      height: height,
      transform: `rotateY(180deg) translateZ(${hd}px)`,
      shade: 0.5,
    },
    // Left face
    {
      name: 'left',
      width: depth,
      height: height,
      transform: `rotateY(-90deg) translateZ(${hw}px)`,
      shade: 0.75,
    },
    // Bottom face
    {
      name: 'bottom',
      width: width,
      height: depth,
      transform: `rotateX(-90deg) translateZ(${hh}px)`,
      shade: 0.4,
    },
  ];

  return (
    <motion.div
      className="absolute"
      style={{
        transform: groupTransform,
        transformStyle: 'preserve-3d',
        width: 0,
        height: 0,
        ...plate.style,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Render all 6 faces */}
      {faces.map((face) => (
        <div
          key={face.name}
          className="absolute"
          style={{
            width: face.width,
            height: face.height,
            transform: face.transform,
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            left: -face.width / 2,
            top: -face.height / 2,
          }}
        >
          {/* Face background */}
          <div
            className="absolute inset-0 border border-foreground/40"
            style={{
              backgroundColor: color,
              opacity: face.shade,
            }}
          />
          
          {/* Geological hatching pattern */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                ${face.name === 'top' ? '45deg' : '30deg'},
                transparent,
                transparent 6px,
                rgba(40, 35, 30, 0.12) 6px,
                rgba(40, 35, 30, 0.12) 7px
              )`,
              opacity: face.shade * 0.8,
            }}
          />
          
          {/* Edge highlight for depth */}
          {(face.name === 'top' || face.name === 'front' || face.name === 'right') && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.15)',
              }}
            />
          )}
        </div>
      ))}

      {/* Plate label on top face */}
      {showLabel && (
        <div
          className="absolute pointer-events-none"
          style={{
            transform: `rotateX(90deg) translateZ(${hh + 2}px)`,
            width: width,
            height: depth,
            left: -hw,
            top: -hd,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span 
            className="font-medium tracking-wider uppercase text-center px-1"
            style={{ 
              color: 'rgba(40, 35, 30, 0.9)',
              textShadow: '0 1px 2px rgba(255,255,255,0.4)',
              fontFamily: 'SF Mono, Monaco, Consolas, monospace',
              fontSize: '8px',
              letterSpacing: '0.1em',
              lineHeight: 1,
            }}
          >
            {name}
          </span>
        </div>
      )}

      {/* Movement arrow on top face */}
      {showArrow && velocity && (displacement > 0.05) && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            transform: `rotateX(90deg) translateZ(${hh + 5}px)`,
            width: width,
            height: depth,
            left: -hw,
            top: -hd,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: Math.min(displacement * 1.5, 0.8) }}
        >
          <svg 
            width="35" 
            height="35" 
            viewBox="0 0 35 35"
            style={{
              transform: `rotate(${Math.atan2(velocity.y, velocity.x) * 180 / Math.PI + 90}deg)`,
            }}
          >
            <path
              d="M 17.5 28 L 17.5 8 M 12 14 L 17.5 8 L 23 14"
              fill="none"
              stroke="rgba(40, 35, 30, 0.7)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}

export type { PlateProps };
