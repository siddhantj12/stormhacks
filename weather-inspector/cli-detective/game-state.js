import { GameState, ClueStatus } from './types.js';

export class DetectiveGameState {
  constructor(caseData) {
    this.caseData = caseData;
    this.currentScene = null;
    this.foundClues = new Set();
    this.analyzedEvidence = new Set();
    this.clueConnections = new Map();
    this.gameState = GameState.EXPLORING;
    this.conversationHistory = [];
  }

  // Scene management
  setCurrentScene(sceneId) {
    const scene = this.caseData.scenes.find(s => s.id === sceneId);
    if (!scene) {
      throw new Error(`Scene ${sceneId} not found`);
    }
    this.currentScene = scene;
    return scene;
  }

  getCurrentScene() {
    return this.currentScene;
  }

  getAvailableScenes() {
    return this.caseData.scenes.filter(scene => 
      scene.status === 'unlocked' || scene.status === 'completed'
    );
  }

  // Clue management
  findClue(clueId) {
    const clue = this.caseData.clues.find(c => c.id === clueId);
    if (!clue) {
      throw new Error(`Clue ${clueId} not found`);
    }
    
    this.foundClues.add(clueId);
    clue.status = ClueStatus.FOUND;
    return clue;
  }

  getFoundClues() {
    return this.caseData.clues.filter(clue => 
      this.foundClues.has(clue.id)
    );
  }

  isClueFound(clueId) {
    return this.foundClues.has(clueId);
  }

  // Evidence management
  analyzeEvidence(evidenceId) {
    this.analyzedEvidence.add(evidenceId);
  }

  isEvidenceAnalyzed(evidenceId) {
    return this.analyzedEvidence.has(evidenceId);
  }

  getEvidence(evidenceId) {
    return this.caseData.evidence.find(e => e.id === evidenceId);
  }

  // Clue connections
  connectClues(fromClueId, toClueId, reason = '') {
    const connectionKey = `${fromClueId}-${toClueId}`;
    this.clueConnections.set(connectionKey, {
      from: fromClueId,
      to: toClueId,
      reason,
      timestamp: new Date()
    });
  }

  getClueConnections() {
    return Array.from(this.clueConnections.values());
  }

  // Enhanced conversation history with context
  addToHistory(role, message, context = {}) {
    const currentScene = this.getCurrentScene();
    const progress = this.getProgress();
    
    this.conversationHistory.push({
      role,
      message,
      timestamp: new Date(),
      context: {
        currentScene: currentScene?.id || null,
        currentSceneTitle: currentScene?.title || null,
        evidenceAnalyzed: this.analyzedEvidence.size,
        cluesFound: this.foundClues.size,
        investigationPhase: this.determineInvestigationPhase(),
        previousTopics: this.extractRecentTopics(5),
        ...context
      }
    });
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  // Extract recent topics from conversation
  extractRecentTopics(count = 5) {
    const recentMessages = this.conversationHistory.slice(-count);
    const topics = new Set();
    
    recentMessages.forEach(entry => {
      const words = entry.message.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 3 && !['what', 'how', 'why', 'when', 'where'].includes(word)) {
          topics.add(word);
        }
      });
    });
    
    return Array.from(topics);
  }

  // Determine current investigation phase
  determineInvestigationPhase() {
    const progress = this.getProgress();
    
    if (progress.clues.found === 0) return 'initial_exploration';
    if (progress.clues.found < 3) return 'evidence_gathering';
    if (progress.clues.found < 5) return 'pattern_analysis';
    return 'theory_development';
  }

  // Get recent context for AI
  getRecentContext(count = 5) {
    const recent = this.conversationHistory.slice(-count);
    const currentScene = this.getCurrentScene();
    const progress = this.getProgress();
    
    return {
      recentMessages: recent,
      currentScene: currentScene?.title || 'No scene selected',
      investigationPhase: this.determineInvestigationPhase(),
      progress: {
        clues: `${progress.clues.found}/${progress.clues.total}`,
        evidence: `${progress.evidence.analyzed}/${progress.evidence.total}`
      },
      recentTopics: this.extractRecentTopics(3)
    };
  }

  // Game state
  setGameState(newState) {
    this.gameState = newState;
  }

  getGameState() {
    return this.gameState;
  }

  // Progress tracking
  getProgress() {
    const totalClues = this.caseData.clues.length;
    const foundClues = this.foundClues.size;
    const totalEvidence = this.caseData.evidence.length;
    const analyzedEvidence = this.analyzedEvidence.size;
    const totalScenes = this.caseData.scenes.length;
    const unlockedScenes = this.getAvailableScenes().length;

    return {
      clues: { found: foundClues, total: totalClues, percentage: (foundClues / totalClues) * 100 },
      evidence: { analyzed: analyzedEvidence, total: totalEvidence, percentage: (analyzedEvidence / totalEvidence) * 100 },
      scenes: { unlocked: unlockedScenes, total: totalScenes, percentage: (unlockedScenes / totalScenes) * 100 }
    };
  }
}
