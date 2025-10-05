// Type definitions for the CLI detective game

export const EvidenceType = {
  IMAGE: 'image',
  DOC: 'doc', 
  AUDIO: 'audio'
};

export const SceneStatus = {
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  COMPLETED: 'completed'
};

export const ClueStatus = {
  HIDDEN: 'hidden',
  FOUND: 'found',
  ANALYZED: 'analyzed'
};

export const GameState = {
  EXPLORING: 'exploring',
  ANALYZING: 'analyzing', 
  CONNECTING: 'connecting',
  SUBMITTING: 'submitting'
};
