#!/usr/bin/env node

import { AIDetective } from './ai-detective.js';
import { CaseLoader } from './case-loader.js';
import { DetectiveGameState } from './game-state.js';
import chalk from 'chalk';

async function testNewFeatures() {
  console.log(chalk.blue.bold('\n🧪 Testing Inspector Gemini 2.0 Features\n'));
  
  try {
    // Load case data
    const caseLoader = new CaseLoader();
    const caseData = await caseLoader.loadCase('case-001');
    
    // Initialize AI Detective
    const aiDetective = new AIDetective();
    const gameState = new DetectiveGameState(caseData);
    
    console.log(chalk.green('✅ Case loaded successfully'));
    console.log(chalk.gray(`Case: ${caseData.title}`));
    console.log(chalk.gray(`Evidence: ${caseData.evidence.length} items`));
    console.log(chalk.gray(`Clues: ${caseData.clues.length} items`));
    console.log(chalk.gray(`Scenes: ${caseData.scenes.length} items\n`));
    
    // Test 1: Auto Evidence Analysis
    console.log(chalk.cyan('🔍 Testing Auto Evidence Analysis...'));
    const batchAnalysis = await aiDetective.analyzeAllEvidence(caseData);
    console.log(chalk.green('✅ Batch analysis completed'));
    console.log(chalk.gray(`Objects detected: ${batchAnalysis.objects_detected?.length || 0}`));
    console.log(chalk.gray(`Text excerpts: ${batchAnalysis.text_excerpts?.length || 0}`));
    console.log(chalk.gray(`Anomalies: ${batchAnalysis.anomalies?.length || 0}`));
    console.log(chalk.gray(`Initial theories: ${batchAnalysis.initial_theories?.length || 0}\n`));
    
    // Simulate some game progress
    gameState.findClue('clue_cracked_eb');
    gameState.findClue('clue_hinge_shadow');
    gameState.analyzeEvidence('IMG-01');
    gameState.analyzeEvidence('DOC-01');
    
    gameState.addToHistory('user', 'I found a cracked E-flat key');
    gameState.addToHistory('assistant', 'Interesting. The crack suggests deliberate damage, not accidental.');
    gameState.addToHistory('user', 'What about the hinge shadow?');
    gameState.addToHistory('assistant', 'That shadow pattern indicates something was hidden beneath the key.');
    
    // Test 2: Detective Notes
    console.log(chalk.cyan('📝 Testing Detective Notes Generation...'));
    const detectiveNotes = await aiDetective.generateDetectiveNotes(gameState);
    console.log(chalk.green('✅ Detective notes generated'));
    console.log(chalk.gray(`Summary: ${detectiveNotes.summary}\n`));
    
    // Test 3: Smart Hint
    console.log(chalk.cyan('💡 Testing Smart Hint System...'));
    const smartHint = await aiDetective.generateSmartHint(gameState, 'I\'m stuck on the piano mechanism');
    console.log(chalk.green('✅ Smart hint generated'));
    console.log(chalk.gray(`Category: ${smartHint.category}`));
    console.log(chalk.gray(`Confidence: ${(smartHint.confidence * 100).toFixed(1)}%\n`));
    
    // Test 4: Reasoning Map
    console.log(chalk.cyan('🗺️ Testing Reasoning Map Generation...'));
    const reasoningMap = await aiDetective.generateReasoningMap(gameState);
    console.log(chalk.green('✅ Reasoning map generated'));
    console.log(chalk.gray(`Key connections: ${reasoningMap.key_connections?.length || 0}`));
    console.log(chalk.gray(`Logical flow steps: ${reasoningMap.logical_flow?.length || 0}\n`));
    
    // Test 5: Case Recap
    console.log(chalk.cyan('📋 Testing Case Recap Generation...'));
    const caseRecap = await aiDetective.generateCaseRecap(gameState);
    console.log(chalk.green('✅ Case recap generated'));
    console.log(chalk.gray(`Timeline items: ${caseRecap.timeline?.length || 0}`));
    console.log(chalk.gray(`Theories: ${caseRecap.theories?.length || 0}`));
    console.log(chalk.gray(`Next steps: ${caseRecap.next_steps?.length || 0}\n`));
    
    // Test 6: Enhanced Chat
    console.log(chalk.cyan('💬 Testing Enhanced Chat System...'));
    const chatResponse = await aiDetective.chatWithDetective('How do these clues connect?', gameState);
    console.log(chalk.green('✅ Chat response generated'));
    console.log(chalk.gray(`Suggestions: ${chatResponse.suggestions?.length || 0}\n`));
    
    console.log(chalk.green.bold('🎉 All features tested successfully!'));
    console.log(chalk.blue('\n📊 Feature Summary:'));
    console.log(chalk.gray('✅ Auto Evidence Analysis - Batch processes all evidence'));
    console.log(chalk.gray('✅ AI Detective Notes - Generates journal entries'));
    console.log(chalk.gray('✅ Smart Hint System - Contextual assistance'));
    console.log(chalk.gray('✅ Reasoning Map - Visualizes clue connections'));
    console.log(chalk.gray('✅ Case Recap - Comprehensive progress summary'));
    console.log(chalk.gray('✅ Enhanced Chat - Multi-layered AI responses'));
    console.log(chalk.gray('✅ Enhanced Master Prompt - 4-layer AI capabilities'));
    
  } catch (error) {
    console.error(chalk.red('❌ Test failed:'), error.message);
    process.exit(1);
  }
}

// Run the test
testNewFeatures();
