'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Scene } from '@/lib/types';
import HotspotButton from './HotspotButton';
import ClueDrawer from './ClueDrawer';

// TODO(design): Style the canvas and hotspot container.
// TODO(design): nicer zoom/blur transition

interface SceneCanvasProps {
  scene: Scene;
  onInteract: (interactionId: string) => void;
  onUnlockScene: (sceneId: string) => void;
  onAddClue: (clueId: string) => void; // NEW: Add onAddClue to props
}

export default function SceneCanvas({ scene, onInteract, onUnlockScene, onAddClue }: SceneCanvasProps) { // NEW: Destructure onAddClue
  const router = useRouter();
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);
  const [zoomState, setZoomState] = useState<'idle' | 'out' | 'in'>('in');

  const handleZoom = (targetSceneId: string) => {
    setZoomState('out');
    setTimeout(() => {
      router.push(`/game/case-001/scene/${targetSceneId}`);
      // The new page will load with its own state, starting with 'in'
    }, 300); // Match animation duration in tailwind.config.ts
  };

  const handleUnlock = (targetSceneId: string) => {
    onUnlockScene(targetSceneId);
    router.push(`/game/case-001/scene/${targetSceneId}`);
  };

  const animationClass = {
    in: 'animate-zoom-in',
    out: 'animate-zoom-out',
    idle: ''
  }[zoomState];

  return (
    <div className={`w-full h-full relative ${animationClass}`}>
      <Image src={scene.bg} alt={scene.title} fill className="object-cover" priority />
      
      <div className="absolute inset-0">
        {scene.hotspots.map(hotspot => (
          <HotspotButton 
            key={hotspot.id} 
            hotspot={hotspot} 
            onInspect={setActiveEvidenceId} 
            onZoom={handleZoom}
            onInteract={onInteract}
            onUnlock={handleUnlock}
            onAddClue={onAddClue} // NEW
          />
        ))}
      </div>

      {activeEvidenceId && (
        <ClueDrawer evidenceId={activeEvidenceId} onClose={() => setActiveEvidenceId(null)} />
      )}
    </div>
  );
}