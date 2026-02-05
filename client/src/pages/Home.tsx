/*
 * DESIGN: Seismically Accurate Curved Plates
 * Light brown/beige background with dark lines
 * Abstract minimal visualization
 * Garamond typography for elegance
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import FaultTypeSimulation, { FaultType } from '@/components/FaultTypeSimulation';

const FAULT_TYPES: FaultType[] = ['strike-slip', 'normal', 'reverse'];

export default function Home() {
  const [activeType, setActiveType] = useState<FaultType>('strike-slip');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/30 py-8">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground tracking-tight mb-3">
              Tectonic Fault Types
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Curved fault surfaces and plate boundary dynamics
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container py-8 lg:py-12">
        {/* Three-column grid for fault types */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {FAULT_TYPES.map((type, index) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className="bg-card/30 rounded-lg border border-border/30 p-5 lg:p-6"
            >
              <FaultTypeSimulation
                type={type}
                isActive={activeType === type}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Educational content - Seismically accurate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 lg:mt-16"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-medium text-foreground text-center mb-8">
              Fault Surface Geometry
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full border border-border/40 flex items-center justify-center">
                  {/* Transform boundary icon - curved vertical */}
                  <svg viewBox="0 0 28 28" className="w-7 h-7 stroke-foreground/70" fill="none" strokeWidth="1.5">
                    <path d="M14 4 Q12 14, 14 24" />
                    <path d="M6 10 L6 18" />
                    <path d="M22 10 L22 18" />
                    <path d="M6 14 L3 11 M6 14 L3 17" />
                    <path d="M22 14 L25 11 M22 14 L25 17" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">Transform</h3>
                <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-2">Strike-Slip Motion</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Plates slide laterally past each other along a curved vertical fault plane. The San Andreas Fault accommodates Pacific-North American plate motion.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full border border-border/40 flex items-center justify-center">
                  {/* Listric fault icon - concave up curve */}
                  <svg viewBox="0 0 28 28" className="w-7 h-7 stroke-foreground/70" fill="none" strokeWidth="1.5">
                    <path d="M6 8 Q4 16, 10 22 Q16 26, 22 24" />
                    <path d="M4 14 L8 14" />
                    <path d="M20 20 L24 20" />
                    <path d="M6 14 L4 11 M6 14 L4 17" />
                    <path d="M22 20 L25 17 M22 20 L25 23" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">Listric</h3>
                <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-2">Normal Fault Geometry</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Extensional faults often have concave-upward curved surfaces. The hanging wall rotates as it drops, creating half-graben basins.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full border border-border/40 flex items-center justify-center">
                  {/* Thrust fault icon - convex curve */}
                  <svg viewBox="0 0 28 28" className="w-7 h-7 stroke-foreground/70" fill="none" strokeWidth="1.5">
                    <path d="M6 22 Q10 18, 14 12 Q18 6, 22 6" />
                    <path d="M4 14 L8 14" />
                    <path d="M20 8 L24 8" />
                    <path d="M6 14 L3 11 M6 14 L3 17" />
                    <path d="M22 8 L25 5 M22 8 L25 11" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">Thrust</h3>
                <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-2">Reverse Fault Geometry</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Compressional faults curve to become nearly horizontal at depth. Major mountain ranges form where thrust sheets stack.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Visual key */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 flex justify-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 30 10" className="w-8 h-3">
                <path d="M0 5 Q15 2, 30 5" stroke="rgba(40, 35, 30, 0.5)" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
              </svg>
              <span>Curved fault surface</span>
            </div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 20 10" className="w-5 h-2.5">
                <path d="M0 5h15M15 5l-4-3M15 5l-4 3" stroke="rgba(40, 35, 30, 0.6)" strokeWidth="1.5" fill="none" />
              </svg>
              <span>Stress direction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(40,35,30,0.1) 2px, rgba(40,35,30,0.1) 4px)' }} />
              <span>Plate cross-section</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6">
        <div className="container">
          <p className="text-xs text-muted-foreground text-center">
            Seismically accurate fault geometry visualization
          </p>
        </div>
      </footer>
    </div>
  );
}
