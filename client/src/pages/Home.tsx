/*
 * DESIGN: 3D Tectonic Plate Scenarios
 * Light brown/beige background with dark lines
 * Real-world examples: San Andreas, Afar, Mendocino
 * Garamond typography for elegance
 */

import { motion } from 'framer-motion';
import PlateScenario, { ScenarioType } from '@/components/PlateScenario';

const SCENARIOS: ScenarioType[] = ['2-plate', '3-plate', '4-plate'];

export default function Home() {
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
              Tectonic Plate Boundaries
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              3D visualization of multi-plate interactions based on real-world examples
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container py-8 lg:py-12">
        {/* Three-column grid for scenarios */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {SCENARIOS.map((type, index) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className="bg-card/30 rounded-lg border border-border/30 p-5 lg:p-6"
            >
              <PlateScenario type={type} />
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
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-medium text-foreground text-center mb-8">
              Plate Boundary Configurations
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {/* 2-Plate */}
              <div className="space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full border border-border/40 flex items-center justify-center">
                  <svg viewBox="0 0 28 28" className="w-7 h-7 stroke-foreground/70" fill="none" strokeWidth="1.5">
                    <rect x="4" y="8" width="8" height="12" rx="1" />
                    <rect x="16" y="8" width="8" height="12" rx="1" />
                    <line x1="14" y1="6" x2="14" y2="22" strokeDasharray="3 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">Two-Plate</h3>
                <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-2">Simple Boundary</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The most common configuration. Two plates meet at a single boundary that can be divergent, convergent, or transform.
                </p>
              </div>
              
              {/* 3-Plate */}
              <div className="space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full border border-border/40 flex items-center justify-center">
                  <svg viewBox="0 0 28 28" className="w-7 h-7 stroke-foreground/70" fill="none" strokeWidth="1.5">
                    <path d="M14 14 L8 6" strokeDasharray="3 2" />
                    <path d="M14 14 L20 6" strokeDasharray="3 2" />
                    <path d="M14 14 L14 24" strokeDasharray="3 2" />
                    <circle cx="14" cy="14" r="2" fill="currentColor" />
                    <rect x="4" y="3" width="6" height="5" rx="1" />
                    <rect x="18" y="3" width="6" height="5" rx="1" />
                    <rect x="11" y="21" width="6" height="5" rx="1" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">Triple Junction</h3>
                <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-2">Three Plates Meet</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Where three plates converge at a single point. The Afar region shows the clearest example of an RRR (ridge-ridge-ridge) junction.
                </p>
              </div>
              
              {/* 4-Plate */}
              <div className="space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full border border-border/40 flex items-center justify-center">
                  <svg viewBox="0 0 28 28" className="w-7 h-7 stroke-foreground/70" fill="none" strokeWidth="1.5">
                    <line x1="14" y1="4" x2="14" y2="24" strokeDasharray="3 2" />
                    <line x1="4" y1="14" x2="24" y2="14" strokeDasharray="3 2" />
                    <circle cx="14" cy="14" r="2" fill="currentColor" />
                    <rect x="4" y="4" width="5" height="5" rx="1" />
                    <rect x="19" y="4" width="5" height="5" rx="1" />
                    <rect x="4" y="19" width="5" height="5" rx="1" />
                    <rect x="19" y="19" width="5" height="5" rx="1" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">Quadruple Zone</h3>
                <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-2">Complex Interaction</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  True quadruple junctions are unstable and evolve into triple junctions. The Mendocino region shows complex multi-plate dynamics.
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
              <div 
                className="w-6 h-4 rounded border border-foreground/30"
                style={{ background: 'rgba(170, 155, 135, 0.85)' }}
              />
              <span>Tectonic plate</span>
            </div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 30 10" className="w-8 h-3">
                <line x1="0" y1="5" x2="30" y2="5" stroke="rgba(40, 35, 30, 0.4)" strokeWidth="1.5" strokeDasharray="6 4" />
              </svg>
              <span>Plate boundary</span>
            </div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 20 10" className="w-5 h-2.5">
                <path d="M0 5h15M15 5l-4-3M15 5l-4 3" stroke="rgba(40, 35, 30, 0.6)" strokeWidth="1.5" fill="none" />
              </svg>
              <span>Plate motion</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-foreground/50" />
              <span>Junction point</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6">
        <div className="container">
          <p className="text-xs text-muted-foreground text-center">
            3D tectonic plate boundary visualization based on real-world geological examples
          </p>
        </div>
      </footer>
    </div>
  );
}
