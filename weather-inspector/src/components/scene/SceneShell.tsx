'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
// import { getCaseClient } from '@/lib/cases'; // Removed
import SceneCanvas from './SceneCanvas';
import ChatDock from './ChatDock';
import { CaseClient } from '@/lib/types'; // Import CaseClient

// TODO(design): Style the main scene shell, header, and buttons.
// TODO(design): toast component

export default function SceneShell({ initialCaseData, caseId, sceneId }: { initialCaseData: CaseClient, caseId: string, sceneId: string }) {
  const router = useRouter();
  const {
    caseData,
    loadCase,
    unlocked,
    goToScene,
    canAccessBoard,
    unlockScene,
    addClue, // NEW
  } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);
  const [interactionCounters, setInteractionCounters] = useState<Record<string, number>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadCase(initialCaseData);
    setIsLoading(false);
  }, [initialCaseData, loadCase]);

  const handleUnlockScene = (targetSceneId: string) => {
    unlockScene(targetSceneId);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleInteraction = (interactionId: string) => {
    if (interactionId === 'press-eb') {
      const newCount = (interactionCounters['press-eb'] || 0) + 1;
      setInteractionCounters(prev => ({ ...prev, 'press-eb': newCount }));

      if (newCount === 3) {
        showToast('You hear a faint click beneath the key...');
      }
    }
  };

  if (isLoading || !caseData) {
    return <div className="text-white">Loading Scene...</div>; // TODO(design): Add loading skeleton
  }

  if (!unlocked.has(sceneId)) {
    return (
      <div className="text-white">
        <div>Scene Locked</div>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
    );
  }

  const currentScene = caseData.scenes.find(s => s.id === sceneId);
  if (!currentScene) return <div className="text-white">Scene not found.</div>;

  return (
    <main className="w-screen h-screen flex flex-col bg-black">
      {toastMessage && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-black text-white p-3 rounded-lg z-50 border border-gray-600">
          {toastMessage}
        </div>
      )}

      <header className="p-2 bg-black/50 text-white border-b border-gray-700 flex justify-between items-center z-10">
        <h1 className="text-lg font-bold">{currentScene.title}</h1>
        <div>
          <select 
            onChange={(e) => goToScene(e.target.value)} 
            value={sceneId}
            className="bg-gray-800 text-white p-1 rounded"
          >
            {caseData.scenes
              .filter(s => unlocked.has(s.id))
              .map(s => <option key={s.id} value={s.id}>{s.title}</option>)
            }
          </select>
          {canAccessBoard() && (
            <button onClick={() => router.push(`/game/${caseId}/board`)} className="ml-4">
              Home Base
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 relative">
        <SceneCanvas scene={currentScene} onInteract={handleInteraction} onUnlockScene={handleUnlockScene} onAddClue={addClue} />
      </div>

      <ChatDock />
    </main>
  );
}