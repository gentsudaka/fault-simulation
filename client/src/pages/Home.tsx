/*
 * DESIGN: Minimal Monochrome Modernism
 * Dark navy background with white lines
 * Third-person isometric view for all fault types
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
              Fault Types
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A comparison of geological fault movements
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
              className="bg-card/20 rounded-lg border border-border/30 p-5 lg:p-6"
            >
              <FaultTypeSimulation
                type={type}
                isActive={activeType === type}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Educational content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 lg:mt-16"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-medium text-foreground text-center mb-8">
              Understanding Fault Mechanics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full border border-border/50 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-foreground/70" fill="none" strokeWidth="1.5">
                    <path d="M4 12h16M4 12l4-4M4 12l4 4M20 12l-4-4M20 12l-4 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">Strike-Slip</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Blocks move horizontally past each other. The San Andreas Fault is a famous example.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full border border-border/50 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-foreground/70" fill="none" strokeWidth="1.5">
                    <path d="M7 7l5 5M12 12l5 5M7 7l-3 3M17 17l3-3" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">Normal</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Caused by extensional forces. The hanging wall drops down relative to the footwall.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full border border-border/50 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-foreground/70" fill="none" strokeWidth="1.5">
                    <path d="M17 17l-5-5M12 12l-5-5M17 17l3-3M7 7l-3 3" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">Reverse</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Caused by compressional forces. The hanging wall moves up relative to the footwall.
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
          <div className="flex items-center gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-foreground/60" style={{ borderStyle: 'dashed', borderWidth: '1px 0 0 0', borderColor: 'rgba(255,255,255,0.6)' }} />
              <span>Fault plane</span>
            </div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 20 10" className="w-5 h-2.5">
                <path d="M0 5h15M15 5l-4-3M15 5l-4 3" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none" />
              </svg>
              <span>Movement direction</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6">
        <div className="container">
          <p className="text-xs text-muted-foreground text-center">
            Interactive geological simulation for educational purposes
          </p>
        </div>
      </footer>
    </div>
  );
}
