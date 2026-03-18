import type { PlateProps } from '@/components/TectonicPlate3D';

export type ScenarioType = '2-plate' | '3-plate' | '4-plate';

export type FaultType = 'strike-slip' | 'normal' | 'reverse';

export interface ScenarioConfig {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  description: string;
  plates: PlateProps[];
  boundaryType: string;
  faultType?: FaultType;
}

export const SCENARIOS: Record<ScenarioType, ScenarioConfig[]> = {
  '2-plate': [
    {
      id: 'san-andreas',
      title: 'San Andreas Fault',
      subtitle: 'Transform Boundary',
      location: 'California',
      description: 'The Pacific Plate slides northwest past the North American Plate at ~46mm/year. This right-lateral strike-slip fault extends 1,300km through California.',
      boundaryType: 'Transform (Conservative)',
      faultType: 'strike-slip',
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
    {
      id: 'mid-atlantic',
      title: 'Mid-Atlantic Ridge',
      subtitle: 'Divergent Boundary',
      location: 'Atlantic Ocean',
      description: 'The longest mountain range on Earth, where the North American and Eurasian plates spread apart at ~2.5cm/year, creating new oceanic crust along the seafloor.',
      boundaryType: 'Divergent (Constructive)',
      faultType: 'normal',
      plates: [
        {
          id: 'north-american-ma',
          name: 'N. American',
          color: 'rgba(175, 160, 140, 0.95)',
          position: { x: -55, y: 0, z: 0 },
          rotation: { x: 55, y: 0, z: -25 },
          size: { width: 90, height: 35, depth: 70 },
          velocity: { x: -0.5, y: 0, z: 0 },
        },
        {
          id: 'eurasian-ma',
          name: 'Eurasian',
          color: 'rgba(190, 170, 150, 0.95)',
          position: { x: 55, y: 0, z: 0 },
          rotation: { x: 55, y: 0, z: -25 },
          size: { width: 90, height: 35, depth: 70 },
          velocity: { x: 0.5, y: 0, z: 0 },
        },
      ],
    },
    {
      id: 'himalayas',
      title: 'Himalayan Collision',
      subtitle: 'Convergent Boundary',
      location: 'Nepal / Tibet',
      description: 'India moves north into Eurasia at ~5cm/year, creating the highest mountains on Earth. Continental-continental collision produces intense folding and thrust faulting.',
      boundaryType: 'Convergent (Destructive)',
      faultType: 'reverse',
      plates: [
        {
          id: 'indian',
          name: 'Indian',
          color: 'rgba(185, 165, 145, 0.95)',
          position: { x: -75, y: 0, z: 0 },
          rotation: { x: 55, y: 0, z: -25 },
          size: { width: 85, height: 35, depth: 70 },
          velocity: { x: 0.5, y: 0, z: 0 },
        },
        {
          id: 'eurasian-h',
          name: 'Eurasian',
          color: 'rgba(175, 160, 140, 0.95)',
          position: { x: 55, y: 0, z: 0 },
          rotation: { x: 55, y: 0, z: -25 },
          size: { width: 90, height: 35, depth: 70 },
          velocity: { x: -0.1, y: 0, z: 0 },
        },
      ],
    },
  ],
  '3-plate': [
    {
      id: 'afar',
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
    {
      id: 'chile',
      title: 'Chile Triple Junction',
      subtitle: 'Ridge-Trench-Trench (RTT)',
      location: 'Southern Chile',
      description: 'Where the Nazca, Antarctic, and South American plates meet. The Chile Ridge is actively subducting beneath South America — a rare case of mid-ocean ridge entering a subduction zone.',
      boundaryType: 'Mixed (Divergent + Convergent)',
      plates: [
        {
          id: 'nazca',
          name: 'Nazca',
          color: 'rgba(190, 170, 150, 0.95)',
          position: { x: -45, y: -25, z: 0 },
          rotation: { x: 55, y: 0, z: -25 },
          size: { width: 75, height: 30, depth: 60 },
          velocity: { x: 0.4, y: -0.3, z: 0 },
        },
        {
          id: 'antarctic',
          name: 'Antarctic',
          color: 'rgba(170, 155, 135, 0.95)',
          position: { x: -45, y: 30, z: 0 },
          rotation: { x: 55, y: 0, z: -25 },
          size: { width: 75, height: 30, depth: 60 },
          velocity: { x: -0.3, y: 0.4, z: 0 },
        },
        {
          id: 'south-american',
          name: 'S. American',
          color: 'rgba(180, 165, 145, 0.95)',
          position: { x: 50, y: 0, z: 0 },
          rotation: { x: 55, y: 0, z: -25 },
          size: { width: 75, height: 30, depth: 60 },
          velocity: { x: 0.1, y: 0, z: 0 },
        },
      ],
    },
  ],
  '4-plate': [
    {
      id: 'mendocino',
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
  ],
};
