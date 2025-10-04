import { create } from 'zustand';
import { CaseClient } from './types';

export type GameState = {
  caseData: CaseClient | null;
  caseId: string;
  sceneId: string;
  unlocked: Set<string>;
  visited: Set<string>;
  foundClues: Set<string>;
  evidenceIds: Set<string>;
};

export type GameActions = {
  loadCase: (data: CaseClient) => void;
  goToScene: (sceneId: string) => void;
  unlockScene: (id: string) => void; // Unlocks scenes
  addEvidence: (id: string) => void;
  addClue: (id: string) => void; // Added addClue to GameActions
  canAccessBoard: () => boolean;
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  caseData: null,
  caseId: 'case-001',
  sceneId: 'theatre',
  unlocked: new Set(['theatre']), // Start with the first scene unlocked
  visited: new Set(['theatre']),
  foundClues: new Set(),
  evidenceIds: new Set(),

  loadCase: (data) => set({ caseData: data, caseId: data.id }),

  goToScene: (sceneId) => {
    if (get().unlocked.has(sceneId)) {
      set((state) => ({ sceneId, visited: new Set(state.visited).add(sceneId) }));
    }
  },

  unlockScene: (id) => {
    set((state) => ({
      unlocked: new Set(state.unlocked).add(id),
      // foundClues: new Set(state.foundClues).add(id), // This line seems incorrect, 'id' is a sceneId, not a clueId
    }));
  },

  addEvidence: (id) => {
    set((state) => ({ evidenceIds: new Set(state.evidenceIds).add(id) }));
  },

  addClue: (id) => {
    set((state) => ({ foundClues: new Set(state.foundClues).add(id) }));
  },

  canAccessBoard: () => {
    const { caseData, unlocked } = get();
    if (!caseData) return false;
    const required = caseData.homeBase.unlocksWhen.unlockedScenesAtLeast;
    const unlockedScenes = caseData.scenes.filter(s => unlocked.has(s.id));
    return unlockedScenes.length >= required;
  },
}));