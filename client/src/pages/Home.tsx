/*
 * DESIGN: Interactive Diagram Modernism
 * Swiss Design meets Interactive Infographics
 * 
 * Layout: Asymmetric grid with simulation positioned off-center left
 * Typography: Space Grotesk (headers) + Space Mono (data)
 * Colors: Warm sand background, teal accents, geological ridge colors
 */

import FaultSimulation from '@/components/FaultSimulation';
import { motion } from 'framer-motion';
import { MapPin, Clock, Layers, ExternalLink } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-terracotta to-ochre flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #C45C3E, #D4A84B)' }}>
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground text-lg leading-tight">
                  Fault Simulation
                </h1>
                <p className="text-xs text-muted-foreground">
                  Taklamakan Desert, China
                </p>
              </div>
            </div>
            <a 
              href="https://en.wikipedia.org/wiki/Fault_(geology)#Dip-slip_faults"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="hidden sm:inline">Learn more</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-6 lg:py-8">
        <div className="grid lg:grid-cols-[1fr,320px] gap-6 lg:gap-8">
          {/* Simulation area - takes most of the space */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Title above simulation */}
            <div className="mb-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Interactive Fault Movement
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Explore how geological forces split a continuous ridge formation into two 
                separate segments over millions of years.
              </p>
            </div>

            {/* Simulation canvas */}
            <div className="aspect-[4/3] lg:aspect-[16/10] bg-card rounded-xl border border-border overflow-hidden shadow-lg">
              <FaultSimulation className="w-full h-full" />
            </div>
          </motion.div>

          {/* Sidebar with information cards */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Location card */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" style={{ color: '#00A6A6' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Taklamakan Desert, Xinjiang, China — one of the world's largest 
                    sandy deserts, surrounded by mountain ranges.
                  </p>
                </div>
              </div>
            </div>

            {/* Geological time card */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-accent" style={{ color: '#C45C3E' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Geological Timescale</h3>
                  <p className="text-sm text-muted-foreground">
                    The simulation represents approximately <strong>2.5 million years</strong> of 
                    tectonic activity, compressed into seconds.
                  </p>
                </div>
              </div>
            </div>

            {/* Fault type card */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Layers className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Strike-Slip Fault</h3>
                  <p className="text-sm text-muted-foreground">
                    A type of fault where the movement is predominantly horizontal. 
                    The blocks slide past each other along the fault plane.
                  </p>
                </div>
              </div>
            </div>

            {/* Key facts */}
            <div className="bg-gradient-to-br from-card to-secondary/30 rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground mb-3">Key Facts</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2 flex-shrink-0" style={{ backgroundColor: '#00A6A6' }} />
                  <span className="text-muted-foreground">
                    The colorful ridges contain layers of sedimentary rock deposited over millions of years
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta mt-2 flex-shrink-0" style={{ backgroundColor: '#C45C3E' }} />
                  <span className="text-muted-foreground">
                    Different colors represent different mineral compositions and ages
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ochre mt-2 flex-shrink-0" style={{ backgroundColor: '#D4A84B' }} />
                  <span className="text-muted-foreground">
                    Matching the layers on both sides proves they were once connected
                  </span>
                </li>
              </ul>
            </div>

            {/* Source attribution */}
            <div className="text-xs text-muted-foreground text-center pt-2">
              Based on satellite imagery from the Taklamakan Desert.
              <br />
              <a 
                href="https://en.wikipedia.org/wiki/Fault_(geology)"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                style={{ color: '#00A6A6' }}
              >
                Learn more about geological faults →
              </a>
            </div>
          </motion.aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container py-4">
          <p className="text-xs text-muted-foreground text-center">
            Interactive geological simulation for educational purposes
          </p>
        </div>
      </footer>
    </div>
  );
}
