# Fault Simulation

An interactive 3D tectonic plate boundary visualization tool. Explore how Earth's plates interact at transform, divergent, and convergent boundaries — from the San Andreas Fault to the Himalayas.

![Demo](docs/demo.gif)

## Features

- **Three Fault Types**
  - **Transform** — Strike-slip motion (San Andreas Fault)
  - **Divergent** — Spreading boundaries (Mid-Atlantic Ridge)
  - **Convergent** — Collision zones (Himalayas)

- **Triple Junction Scenarios**
  - Afar Triple Junction (RRR — three divergent boundaries)
  - Mendocino Triple Junction (complex transform + subduction)
  - Chile Triple Junction (ridge subduction)

- **Interactive Controls**
  - Drag to manipulate fault blocks
  - Time slider for geological time scales
  - Real-time displacement measurements

- **Educational Design**
  - Swiss Design–inspired clarity
  - Annotated geological features
  - Scale bars and directional indicators

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **Build**: Vite 7
- **UI Components**: Radix UI + shadcn/ui

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/gentsudaka/fault-simulation.git
cd fault-simulation

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
fault-simulation/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FaultTypeSimulation.tsx  # Main simulation component
│   │   │   ├── PlateScenario.tsx        # Plate interaction scenarios
│   │   │   ├── TectonicPlate3D.tsx      # 3D plate rendering
│   │   │   └── Map.tsx                  # Geographic context
│   │   ├── pages/
│   │   └── App.tsx
│   └── public/
├── server/
├── docs/
│   ├── ideas.md                         # Design concepts
│   └── tectonic_research.md             # Geological research notes
└── package.json
```

## Background

This project visualizes tectonic plate boundaries to make geological concepts accessible and interactive. Inspired by the colorful strike-slip fault formations in the Taklamakan Desert, it extends to cover all major boundary types and multi-plate interactions.

## Author

**Gen Tsudaka**  
Behavioral Scientist | Columbia Business School  
[GitHub](https://github.com/gentsudaka) · [ORCID](https://orcid.org/0000-0002-8969-5763)

## License

[MIT](LICENSE)
