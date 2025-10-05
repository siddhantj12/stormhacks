import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export class AIDetective {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: process.env.AI_MODEL || 'gemini-2.5-flash',
      generationConfig: {
        temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7,
        maxOutputTokens: 2048,
      }
    });

    // Master prompt for Inspector Gemini 2.0
    this.masterPrompt = `ROLE:
    You are INSPECTOR GEMINI 2.0 — a composed, analytical detective investigating "The Vanishing Symphony" with enhanced AI capabilities.
    
    OBJECTIVE:
    Help the player uncover the disappearance of pianist Aurelia Moreau through multi-layered AI assistance: visual forensics, semantic memory, dynamic narrative, and intelligent reasoning.
    
    CORE DETECTIVE CAPABILITIES (4 Layers):
    
    LAYER 1 - VISUAL FORENSICS:
    - **OCR & Text Extraction:** Identify and extract written information from images, documents, and notes
    - **Object Detection:** Spot and catalog physical objects, anomalies, and suspicious details
    - **Pattern Recognition:** Find visual patterns, inconsistencies, and hidden elements
    - **Evidence Tagging:** Automatically tag and categorize evidence for easy reference
    
    LAYER 2 - SEMANTIC MEMORY:
    - **Context Tracking:** Maintain awareness of all discovered clues, theories, and connections
    - **Progress Monitoring:** Track investigation phases and player advancement
    - **Topic Extraction:** Identify and remember key themes and subjects discussed
    - **Conversation History:** Reference previous exchanges naturally and meaningfully
    
    LAYER 3 - DYNAMIC NARRATIVE ENGINE:
    - **Adaptive Dialogue:** Generate contextually appropriate responses based on investigation state
    - **Theory Development:** Help formulate and refine working theories about the case
    - **Timeline Construction:** Build chronological understanding of events
    - **Summary Generation:** Create comprehensive recaps and detective journal entries
    
    LAYER 4 - REASONING & HINTS SYSTEM:
    - **Logical Analysis:** Connect clues through deductive reasoning
    - **Frustration Detection:** Identify when player needs assistance
    - **Smart Hints:** Provide contextual help without spoiling solutions
    - **Reasoning Maps:** Visualize logical connections and investigation paths
    
    INFERENCE DEPTH:
    Analyze clues for hidden motives, unspoken histories, and logical inconsistencies. Focus on the theory that **Aurelia faked her abduction** through the piano mechanism and coded messages.
    
    RESPONSE MODES:
    
    STANDARD CHAT (3-4 sentences):
    - Short, natural detective observations
    - Reference previous clues and context
    - End with investigative suggestions
    - Maintain calm, professional tone
    
    BATCH ANALYSIS (Structured JSON):
    - Comprehensive evidence examination
    - Object detection and text extraction
    - Anomaly identification
    - Initial theory formulation
    
    DETECTIVE NOTES (Journal Format):
    - Professional case journal entries
    - Progress summaries
    - Pattern analysis
    - Next step recommendations
    
    SMART HINTS (Contextual Help):
    - Detect player frustration or confusion
    - Provide targeted assistance
    - Suggest specific evidence or scenes
    - Maintain mystery without spoiling
    
    REASONING MAPS (Visual Logic):
    - Show clue connections
    - Display logical flow
    - Highlight key insights
    - Suggest investigation paths
    
    CASE RECAPS (Comprehensive Summary):
    - Timeline of discoveries
    - Current theory status
    - Evidence analysis
    - Next investigation steps
    
    STYLE GUIDELINES:
    - Tone: calm, professional, perceptive
    - Speak as a detective partner, not a narrator
    - Use natural language, avoid technical jargon
    - Reference context naturally ("That cracked key again...")
    - For major insights, briefly increase intensity before returning to calm tone
    
    END GOAL:
    Guide the player through a comprehensive investigation using all four AI layers, providing the right level of assistance at the right time while maintaining the mystery's integrity.`;}

  async analyzeEvidence(evidence, question, caseContext) {
    const prompt = this.buildEvidenceAnalysisPrompt(evidence, question, caseContext);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseAIResponse(text);
    } catch (error) {
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  async suggestClueConnections(clues, caseContext) {
    const prompt = this.buildClueConnectionPrompt(clues, caseContext);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseClueConnections(text);
    } catch (error) {
      throw new Error(`AI connection suggestion failed: ${error.message}`);
    }
  }

  async chatWithDetective(message, gameState) {
    const prompt = this.buildChatPrompt(message, gameState);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return {
        response: text,
        suggestions: this.extractSuggestions(text)
      };
    } catch (error) {
      throw new Error(`AI chat failed: ${error.message}`);
    }
  }

  async analyzeAllEvidence(caseData) {
    const evidence = caseData.evidence;
    const prompt = this.buildBatchEvidenceAnalysisPrompt(evidence, caseData);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseBatchAnalysis(text);
    } catch (error) {
      throw new Error(`Batch evidence analysis failed: ${error.message}`);
    }
  }

  async generateDetectiveNotes(gameState) {
    const context = gameState.getRecentContext(10);
    const foundClues = gameState.getFoundClues();
    const connections = gameState.getClueConnections();
    
    const prompt = this.buildDetectiveNotesPrompt(context, foundClues, connections, gameState.caseData);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseDetectiveNotes(text);
    } catch (error) {
      throw new Error(`Detective notes generation failed: ${error.message}`);
    }
  }

  async generateSmartHint(gameState, userMessage = '') {
    const context = gameState.getRecentContext(5);
    const foundClues = gameState.getFoundClues();
    const progress = gameState.getProgress();
    
    const prompt = this.buildSmartHintPrompt(context, foundClues, progress, userMessage, gameState.caseData);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseSmartHint(text);
    } catch (error) {
      throw new Error(`Smart hint generation failed: ${error.message}`);
    }
  }

  async generateReasoningMap(gameState) {
    const foundClues = gameState.getFoundClues();
    const connections = gameState.getClueConnections();
    const context = gameState.getRecentContext();
    
    const prompt = this.buildReasoningMapPrompt(foundClues, connections, context, gameState.caseData);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseReasoningMap(text);
    } catch (error) {
      throw new Error(`Reasoning map generation failed: ${error.message}`);
    }
  }

  async generateCaseRecap(gameState) {
    const context = gameState.getRecentContext(20);
    const foundClues = gameState.getFoundClues();
    const connections = gameState.getClueConnections();
    const progress = gameState.getProgress();
    
    const prompt = this.buildCaseRecapPrompt(context, foundClues, connections, progress, gameState.caseData);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseCaseRecap(text);
    } catch (error) {
      throw new Error(`Case recap generation failed: ${error.message}`);
    }
  }

  buildEvidenceAnalysisPrompt(evidence, question, caseContext) {
    // Use deep thinking for evidence analysis
    return `${this.masterPrompt}

CASE CONTEXT:
Title: ${caseContext.title}
Brief: ${caseContext.brief}

EVIDENCE TO ANALYZE:
- Type: ${evidence.type}
- Title: ${evidence.title}
- Description: ${evidence.alt || 'No description provided'}

QUESTION: ${question}

thinkingBudget = on

Respond as Inspector Gemini analyzing this evidence. Keep your response short and natural, like a detective thinking aloud. Focus on what you observe and what it might mean for the case.`;
  }

  buildClueConnectionPrompt(clues, caseContext) {
    const clueList = clues.map(clue => `- ${clue.id}: ${clue.label}`).join('\n');
    
    // Use deep thinking for clue connections
    return `${this.masterPrompt}

CASE CONTEXT:
Title: ${caseContext.title}
Brief: ${caseContext.brief}

DISCOVERED CLUES:
${clueList}

thinkingBudget = on

Respond as Inspector Gemini connecting these clues. Speak naturally about what patterns you see and how these pieces might fit together. Keep it conversational and insightful.`;
  }

  buildChatPrompt(message, gameState) {
    const progress = gameState.getProgress();
    const foundClues = gameState.getFoundClues();
    const currentScene = gameState.getCurrentScene();
    const context = gameState.getRecentContext();
    
    // Determine thinking mode based on message complexity
    const isComplexQuestion = message.toLowerCase().includes('why') || 
                             message.toLowerCase().includes('how') || 
                             message.toLowerCase().includes('connect') ||
                             message.toLowerCase().includes('theory') ||
                             message.toLowerCase().includes('pattern');
    
    const thinkingMode = isComplexQuestion ? 'on' : 'off';
    
    // Build conversation context
    const conversationContext = this.buildConversationContext(context);
    
    return `${this.masterPrompt}

CASE: ${gameState.caseData.title}
BRIEF: ${gameState.caseData.brief}

CURRENT INVESTIGATION STATE:
- Scene: ${context.currentScene}
- Phase: ${context.investigationPhase}
- Progress: ${context.progress.clues} clues, ${context.progress.evidence} evidence analyzed

FOUND CLUES:
${foundClues.map(clue => `- ${clue.label}`).join('\n')}

${conversationContext}

USER MESSAGE: ${message}

thinkingBudget = ${thinkingMode}

Respond as Inspector Gemini. Be conversational and helpful, like a detective partner sharing thoughts. Keep responses short and natural.`;
  }

  buildConversationContext(context) {
    if (context.recentMessages.length === 0) {
      return 'CONVERSATION: This is the start of our conversation.';
    }

    const recentExchanges = context.recentMessages.map(entry => {
      const role = entry.role === 'user' ? 'Player' : 'Inspector Gemini';
      return `${role}: ${entry.message}`;
    }).join('\n');

    const topicsContext = context.recentTopics.length > 0 
      ? `\nRECENT TOPICS: ${context.recentTopics.join(', ')}`
      : '';

    return `RECENT CONVERSATION:
${recentExchanges}${topicsContext}

CONTEXT: Continue the conversation naturally, referencing previous exchanges when relevant.`;
  }

  buildBatchEvidenceAnalysisPrompt(evidence, caseData) {
    const evidenceList = evidence.map(ev => `- ${ev.id}: ${ev.title} (${ev.type})`).join('\n');
    
    return `${this.masterPrompt}

BATCH EVIDENCE ANALYSIS MODE:
You are now performing a comprehensive analysis of ALL evidence in the case.

CASE: ${caseData.title}
BRIEF: ${caseData.brief}

EVIDENCE TO ANALYZE:
${evidenceList}

thinkingBudget = on

ANALYSIS REQUIREMENTS:
1. Examine each piece of evidence for objects, text, anomalies, and potential connections
2. Identify patterns across multiple evidence pieces
3. Suggest initial theories based on the evidence
4. Output structured JSON with your findings

Respond with a JSON object containing:
{
  "objects_detected": ["list of objects found in evidence"],
  "text_excerpts": ["extracted text from images/documents"],
  "potential_links": ["connections between evidence pieces"],
  "anomalies": ["unusual or suspicious details"],
  "initial_theories": ["preliminary theories about what happened"],
  "next_investigation_steps": ["suggested next actions"]
}`;
  }

  buildDetectiveNotesPrompt(context, foundClues, connections, caseData) {
    const clueList = foundClues.map(clue => `- ${clue.label}`).join('\n');
    const connectionList = connections.map(conn => `- ${conn.from} → ${conn.to}: ${conn.reason}`).join('\n');
    
    return `${this.masterPrompt}

DETECTIVE NOTES GENERATION MODE:
Generate a comprehensive detective journal entry summarizing the investigation progress.

CASE: ${caseData.title}
BRIEF: ${caseData.brief}

INVESTIGATION PROGRESS:
- Current Scene: ${context.currentScene}
- Phase: ${context.investigationPhase}
- Clues Found: ${context.progress.clues}
- Evidence Analyzed: ${context.progress.evidence}

FOUND CLUES:
${clueList}

CLUE CONNECTIONS:
${connectionList}

thinkingBudget = on

Generate detective notes in a natural, journal-like format that summarizes:
1. What has been discovered so far
2. Key patterns and connections
3. Current working theories
4. Next investigative priorities

Keep the tone professional but personal, like a detective writing in their case journal.`;
  }

  buildSmartHintPrompt(context, foundClues, progress, userMessage, caseData) {
    const clueList = foundClues.map(clue => `- ${clue.label}`).join('\n');
    
    return `${this.masterPrompt}

SMART HINT MODE:
The player seems stuck or frustrated. Provide contextual help without giving away the solution.

CASE: ${caseData.title}
BRIEF: ${caseData.brief}

CURRENT STATE:
- Scene: ${context.currentScene}
- Phase: ${context.investigationPhase}
- Clues Found: ${progress.clues.found}/${progress.clues.total}
- Evidence Analyzed: ${progress.evidence.analyzed}/${progress.evidence.total}

FOUND CLUES:
${clueList}

USER'S LAST MESSAGE: "${userMessage}"

thinkingBudget = on

Provide a helpful hint that:
1. Doesn't reveal the solution directly
2. Points toward unexplored areas or connections
3. Encourages the player to look more carefully
4. Suggests specific evidence or scenes to examine

Keep it encouraging and detective-like.`;
  }

  buildReasoningMapPrompt(foundClues, connections, context, caseData) {
    const clueList = foundClues.map(clue => `- ${clue.label}`).join('\n');
    const connectionList = connections.map(conn => `- ${conn.from} → ${conn.to}: ${conn.reason}`).join('\n');
    
    return `${this.masterPrompt}

REASONING MAP GENERATION MODE:
Create a visual reasoning map showing how clues connect and lead to conclusions.

CASE: ${caseData.title}
BRIEF: ${caseData.brief}

FOUND CLUES:
${clueList}

EXISTING CONNECTIONS:
${connectionList}

thinkingBudget = on

Generate a reasoning map that shows:
1. How clues connect to each other
2. The logical flow of investigation
3. Key insights and deductions
4. Potential paths to the solution

Format as a structured analysis that can be displayed as a text-based reasoning tree.`;
  }

  buildCaseRecapPrompt(context, foundClues, connections, progress, caseData) {
    const clueList = foundClues.map(clue => `- ${clue.label}`).join('\n');
    const connectionList = connections.map(conn => `- ${conn.from} → ${conn.to}: ${conn.reason}`).join('\n');
    
    return `${this.masterPrompt}

CASE RECAP GENERATION MODE:
Generate a comprehensive case recap with timeline and theory analysis.

CASE: ${caseData.title}
BRIEF: ${caseData.brief}

INVESTIGATION PROGRESS:
- Clues Found: ${progress.clues.found}/${progress.clues.total}
- Evidence Analyzed: ${progress.evidence.analyzed}/${progress.evidence.total}
- Scenes Unlocked: ${progress.scenes.unlocked}/${progress.scenes.total}

FOUND CLUES:
${clueList}

CLUE CONNECTIONS:
${connectionList}

thinkingBudget = on

Generate a comprehensive recap including:
1. Timeline of discoveries
2. Key evidence analysis
3. Current working theories
4. Logical reasoning chain
5. Next steps for investigation

Make it clear and organized for the player to understand their progress.`;
  }

  parseAIResponse(text) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback to basic response
      return {
        answer: text,
        confidence: 0.5,
        highlights: [],
        next_steps: "Continue investigating",
        clues_found: []
      };
    } catch (error) {
      return {
        answer: text,
        confidence: 0.5,
        highlights: [],
        next_steps: "Continue investigating", 
        clues_found: []
      };
    }
  }

  parseClueConnections(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        connections: [],
        theory: "No clear connections found",
        confidence: 0.0
      };
    } catch (error) {
      return {
        connections: [],
        theory: "Error parsing connections",
        confidence: 0.0
      };
    }
  }

  extractSuggestions(text) {
    // Simple extraction of action items from AI response
    const suggestions = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.includes('try') || line.includes('check') || line.includes('examine')) {
        suggestions.push(line.trim());
      }
    }
    
    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }

  parseBatchAnalysis(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        objects_detected: [],
        text_excerpts: [],
        potential_links: [],
        anomalies: [],
        initial_theories: [],
        next_investigation_steps: ["Continue examining evidence"]
      };
    } catch (error) {
      return {
        objects_detected: [],
        text_excerpts: [],
        potential_links: [],
        anomalies: [],
        initial_theories: [],
        next_investigation_steps: ["Continue examining evidence"]
      };
    }
  }

  parseDetectiveNotes(text) {
    return {
      notes: text,
      timestamp: new Date(),
      summary: this.extractSummary(text)
    };
  }

  parseSmartHint(text) {
    return {
      hint: text,
      confidence: 0.8,
      category: this.categorizeHint(text)
    };
  }

  parseReasoningMap(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        reasoning_tree: text,
        key_connections: [],
        logical_flow: [],
        insights: []
      };
    } catch (error) {
      return {
        reasoning_tree: text,
        key_connections: [],
        logical_flow: [],
        insights: []
      };
    }
  }

  parseCaseRecap(text) {
    return {
      recap: text,
      timeline: this.extractTimeline(text),
      theories: this.extractTheories(text),
      next_steps: this.extractNextSteps(text)
    };
  }

  extractSummary(text) {
    const sentences = text.split(/[.!?]+/);
    return sentences.slice(0, 2).join('. ').trim();
  }

  categorizeHint(text) {
    if (text.toLowerCase().includes('examine') || text.toLowerCase().includes('look')) {
      return 'examination';
    } else if (text.toLowerCase().includes('connect') || text.toLowerCase().includes('link')) {
      return 'connection';
    } else if (text.toLowerCase().includes('theory') || text.toLowerCase().includes('think')) {
      return 'reasoning';
    }
    return 'general';
  }

  extractTimeline(text) {
    const timeline = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.includes('first') || line.includes('then') || line.includes('next') || line.includes('finally')) {
        timeline.push(line.trim());
      }
    }
    
    return timeline;
  }

  extractTheories(text) {
    const theories = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('theory') || line.toLowerCase().includes('believe') || line.toLowerCase().includes('suggest')) {
        theories.push(line.trim());
      }
    }
    
    return theories;
  }

  extractNextSteps(text) {
    const steps = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.includes('next') || line.includes('should') || line.includes('need to')) {
        steps.push(line.trim());
      }
    }
    
    return steps;
  }
}
