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
  const { unlock, addEvidence } = useGameStore();

  const handleClick = () => {
    if ('inspect' in hotspot) {
      onInspect(hotspot.inspect.evidenceId);
      if (hotspot.addsClues) {
        hotspot.addsClues.forEach(clueId => unlock(clueId));
      }
    } else if ('click' in hotspot) {
      const action = hotspot.click;
      if ('unlockScene' in action) {
        unlock(action.unlockScene);
        // TODO(design): Show a toast: "Security Room unlocked."
        router.push(`/game/case-001/scene/${action.unlockScene}`);
      } else if ('addEvidence' in action) {
        addEvidence(action.addEvidence);
      } else if ('zoomToScene' in action) {
        onZoom(action.zoomToScene);
      } else if ('interact' in action) {
        onInteract(action.interact);
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
