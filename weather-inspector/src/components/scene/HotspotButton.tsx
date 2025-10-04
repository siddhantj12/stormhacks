'use client';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { Hotspot } from '@/lib/types';

// TODO(design): Style the hotspot button (e.g., pulsing, outline).

interface HotspotButtonProps {
  hotspot: Hotspot;
  onInspect: (evidenceId: string) => void;
  onZoom: (sceneId: string) => void;
  onInteract: (interactionId: string) => void;
}

export default function HotspotButton({ hotspot, onInspect, onZoom, onInteract }: HotspotButtonProps) {
  const router = useRouter();
  const { unlockScene, addEvidence, addClue } = useGameStore();

  const handleClick = () => {
    if ('inspect' in hotspot) {
      onInspect(hotspot.inspect.evidenceId);
      if (hotspot.addsClues) {
        hotspot.addsClues.forEach(clueId => addClue(clueId)); // Changed unlock to addClue
      }
    } else if ('click' in hotspot) {
      const action = hotspot.click;
      if ('unlockScene' in action) {
        unlockScene(action.unlockScene); // Changed unlock to unlockScene
        if (hotspot.addsClues) { // Added addsClues handling for click actions
          hotspot.addsClues.forEach(clueId => addClue(clueId));
        }
        // TODO(design): Show a toast: "Security Room unlocked."
        router.push(`/game/case-001/scene/${action.unlockScene}`);
      } else if ('addEvidence' in action) {
        addEvidence(action.addEvidence);
        if (hotspot.addsClues) { // Added addsClues handling for addEvidence actions
          hotspot.addsClues.forEach(clueId => addClue(clueId));
        }
      } else if ('zoomToScene' in action) {
        onZoom(action.zoomToScene);
        if (hotspot.addsClues) { // Added addsClues handling for zoomToScene actions
          hotspot.addsClues.forEach(clueId => addClue(clueId));
        }
      } else if ('interact' in action) {
        onInteract(action.interact);
        if (hotspot.addsClues) { // Added addsClues handling for interact actions
          hotspot.addsClues.forEach(clueId => addClue(clueId));
        }
      }
    }
  };

  return (
    <button
      aria-label={hotspot.label}
      className="absolute border-2 border-cyan-400 hover:bg-cyan-400/50 transition-colors duration-200 rounded-sm"
      style={{
        left: `${hotspot.rect.x * 100}%`,
        top: `${hotspot.rect.y * 100}%`,
        width: `${hotspot.rect.w * 100}%`,
        height: `${hotspot.rect.h * 100}%`,
      }}
      onClick={handleClick}
    />
  );
}
