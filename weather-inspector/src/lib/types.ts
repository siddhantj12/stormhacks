export type Rect = { x: number; y: number; w: number; h: number }; // 0..1 normalized

export type Evidence = {
  id: string;
  type: 'image' | 'doc' | 'audio';
  title: string;
  src: string;
  alt?: string;
};

type ClickAction =
  | { unlockScene: string }
  | { addEvidence: string }
  | { zoomToScene: string }
  | { interact: string };

export type Hotspot =
  | { id:string; label:string; rect:Rect; click: ClickAction; addsClues?:string[] }
  | { id:string; label:string; rect:Rect; inspect: { evidenceId:string; action:'zoom'|'open'|'ocr'|'region'; region?:Rect }; addsClues?:string[] };

export type Scene = {
  id: string;
  title: string;
  bg: string;
  lockedUntil?: { cluesFoundAny: string[] }; // Fixed type
  hotspots: Hotspot[];
};

export type Clue = { id: string; label: string; evidenceId: string };

export type CaseClient = {
  id: string;
  title: string;
  brief: string;
  scenes: Scene[];
  evidence: Evidence[];
  clues: Clue[];
  homeBase: {
    unlocksWhen: {
      unlockedScenesAtLeast: number;
    };
  };
};

export type CaseAnswer = {
  id: string;
  grading: {
    mustInclude: string[];
    someOf: string[];
  };
  endings: {
    S: string;
    A: string;
    F: string;
  };
};

export type Update = { // NEW: Update type
  id: string;
  message: string;
  timestamp: number;
};

export type MockAskResponse = {
  answer: string;
  confidence: number;
  highlights?: Array<{ x: number; y: number; w: number; h: number; label?: string }>;
  next_step?: string;
};

export type SuggestEdgesRequest = {
  clues: Array<{ id: string; label: string }>;
};

export type SuggestEdgesResponse = {
  edges: Array<{ from: string; to: string; reason: string; suggested: boolean }>;
};