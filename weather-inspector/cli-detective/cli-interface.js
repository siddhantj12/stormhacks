import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import { DetectiveGameState } from './game-state.js';
import { AIDetective } from './ai-detective.js';

export class CLIDetectiveInterface {
  constructor(caseData, aiDetective) {
    this.gameState = new DetectiveGameState(caseData);
    this.aiDetective = aiDetective;
    this.isRunning = false;
  }

  async start() {
    this.isRunning = true;
    this.showWelcome();
    
    // Auto-analyze all evidence on case start
    await this.performInitialEvidenceAnalysis();
    
    while (this.isRunning) {
      try {
        await this.showMainMenu();
      } catch (error) {
        console.log(chalk.red(`Error: ${error.message}`));
        await this.pause();
      }
    }
  }

  showWelcome() {
    const welcomeText = boxen(
      chalk.blue.bold('🕵️  CLI Detective Game  🕵️\n\n') +
      chalk.white(`Case: ${this.gameState.caseData.title}\n`) +
      chalk.gray(this.gameState.caseData.brief) +
      chalk.yellow('\n\n💡 Tips: Press Ctrl+C to cancel any action, type "back" in chat to return to menu'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'blue'
      }
    );
    
    console.log(welcomeText);
  }

  async showMainMenu() {
    const currentScene = this.gameState.getCurrentScene();
    const progress = this.gameState.getProgress();
    
    const choices = [
      { name: '🎭 Explore Scenes', value: 'explore' },
      { name: '🔍 Examine Evidence', value: 'examine' },
      { name: '💬 Chat with AI Detective', value: 'chat' },
      { name: '🔗 Connect Clues', value: 'connect' },
      { name: '📊 View Progress', value: 'progress' },
      { name: '🧠 View Context Memory', value: 'context' },
      { name: '📝 Generate Detective Notes', value: 'notes' },
      { name: '💡 Get Smart Hint', value: 'hint' },
      { name: '🗺️ View Reasoning Map', value: 'reasoning' },
      { name: '📋 Case Recap', value: 'recap' },
      { name: '📝 Submit Theory', value: 'submit' },
      { name: '❌ Exit Game', value: 'exit' }
    ];

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: currentScene 
          ? `Current Scene: ${chalk.cyan(currentScene.title)}\nWhat would you like to do?`
          : 'What would you like to do?',
        choices,
        pageSize: 10
      }
    ]);

    await this.handleAction(action);
  }

  async handleAction(action) {
    switch (action) {
      case 'explore':
        await this.exploreScenes();
        break;
      case 'examine':
        await this.examineEvidence();
        break;
      case 'chat':
        await this.chatWithDetective();
        break;
      case 'connect':
        await this.connectClues();
        break;
      case 'progress':
        await this.showProgress();
        break;
      case 'context':
        await this.showContextMemory();
        break;
      case 'notes':
        await this.generateDetectiveNotes();
        break;
      case 'hint':
        await this.getSmartHint();
        break;
      case 'reasoning':
        await this.showReasoningMap();
        break;
      case 'recap':
        await this.showCaseRecap();
        break;
      case 'submit':
        await this.submitTheory();
        break;
      case 'exit':
        await this.exitGame();
        break;
    }
  }

  async exploreScenes() {
    const scenes = this.gameState.getAvailableScenes();
    
    if (scenes.length === 0) {
      console.log(chalk.yellow('No scenes available to explore.'));
      return;
    }

    const { sceneId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'sceneId',
        message: 'Choose a scene to explore:',
        choices: scenes.map(scene => ({
          name: `${scene.title}${scene.status === 'completed' ? ' ✓' : ''}`,
          value: scene.id
        }))
      }
    ]);

    const scene = this.gameState.setCurrentScene(sceneId);
    console.log(chalk.green(`\n📍 Now exploring: ${scene.title}`));
    console.log(chalk.gray(`Background: ${scene.bg}`));
    
    if (scene.hotspots && scene.hotspots.length > 0) {
      console.log(chalk.blue('\n🔍 Interactive hotspots available:'));
      scene.hotspots.forEach(hotspot => {
        console.log(chalk.gray(`  • ${hotspot.label}`));
      });
    }

    await this.pause();
  }

  async examineEvidence() {
    const evidence = this.gameState.caseData.evidence;
    
    if (evidence.length === 0) {
      console.log(chalk.yellow('No evidence available to examine.'));
      return;
    }

    const { evidenceId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'evidenceId',
        message: 'Choose evidence to examine:',
        choices: evidence.map(ev => ({
          name: `${ev.title} (${ev.type})${this.gameState.isEvidenceAnalyzed(ev.id) ? ' ✓' : ''}`,
          value: ev.id
        }))
      }
    ]);

    const selectedEvidence = this.gameState.getEvidence(evidenceId);
    console.log(chalk.blue(`\n🔍 Examining: ${selectedEvidence.title}`));
    console.log(chalk.gray(`Type: ${selectedEvidence.type}`));
    console.log(chalk.gray(`Source: ${selectedEvidence.src}`));
    
    if (selectedEvidence.alt) {
      console.log(chalk.gray(`Description: ${selectedEvidence.alt}`));
    }

    const { question } = await inquirer.prompt([
      {
        type: 'input',
        name: 'question',
        message: 'What would you like to know about this evidence?',
        validate: input => input.trim().length > 0 || 'Please enter a question'
      }
    ]);

    await this.analyzeEvidence(selectedEvidence, question);
  }

  async analyzeEvidence(evidence, question) {
    const spinner = ora('AI Detective is analyzing the evidence... (Press Ctrl+C to cancel)').start();
    
    // Set up cancellation
    let cancelled = false;
    const cancelHandler = () => {
      cancelled = true;
      spinner.stop();
      console.log(chalk.yellow('\n⚠️  Analysis cancelled by user'));
    };
    
    process.on('SIGINT', cancelHandler);
    
    try {
      const analysis = await this.aiDetective.analyzeEvidence(
        evidence, 
        question, 
        this.gameState.caseData
      );
      
      if (cancelled) return;
      
      spinner.succeed('Analysis complete!');
      
      console.log(chalk.green('\n🤖 AI Detective Analysis:'));
      console.log(chalk.white(analysis.answer));
      
      if (analysis.confidence) {
        const confidenceColor = analysis.confidence > 0.8 ? 'green' : 
                               analysis.confidence > 0.6 ? 'yellow' : 'red';
        console.log(chalk[confidenceColor](`\nConfidence: ${(analysis.confidence * 100).toFixed(1)}%`));
      }
      
      if (analysis.highlights && analysis.highlights.length > 0) {
        console.log(chalk.blue('\n🔍 Key Points:'));
        analysis.highlights.forEach(highlight => {
          console.log(chalk.gray(`  • ${highlight.description || highlight}`));
        });
      }
      
      if (analysis.next_steps) {
        console.log(chalk.cyan(`\n💡 Next Steps: ${analysis.next_steps}`));
      }
      
      if (analysis.clues_found && analysis.clues_found.length > 0) {
        console.log(chalk.green('\n🎯 New Clues Discovered:'));
        analysis.clues_found.forEach(clueId => {
          const clue = this.gameState.caseData.clues.find(c => c.id === clueId);
          if (clue) {
            this.gameState.findClue(clueId);
            console.log(chalk.green(`  ✓ ${clue.label}`));
          }
        });
      }
      
      this.gameState.analyzeEvidence(evidence.id);
      this.gameState.addToHistory('user', `Examined ${evidence.title}: ${question}`);
      this.gameState.addToHistory('assistant', analysis.answer);
      
    } catch (error) {
      if (!cancelled) {
        spinner.fail('Analysis failed');
        console.log(chalk.red(`Error: ${error.message}`));
      }
    } finally {
      process.removeListener('SIGINT', cancelHandler);
    }
    
    if (!cancelled) {
      await this.pause();
    }
  }

  async chatWithDetective() {
    console.log(chalk.blue('\n💬 Chat with Inspector Gemini'));
    console.log(chalk.gray('Type "back" to return to main menu, "clear" to clear conversation history\n'));
    
    let continueChat = true;
    
    while (continueChat) {
      const { message } = await inquirer.prompt([
        {
          type: 'input',
          name: 'message',
          message: 'Ask Inspector Gemini:',
          validate: input => input.trim().length > 0 || 'Please enter a message'
        }
      ]);

      if (message.toLowerCase() === 'back') {
        continueChat = false;
        break;
      }
      
      if (message.toLowerCase() === 'clear') {
        this.gameState.conversationHistory = [];
        console.log(chalk.yellow('Conversation history cleared.\n'));
        continue;
      }

      const spinner = ora('Inspector Gemini is thinking... (Press Ctrl+C to cancel)').start();
      
      // Set up cancellation
      let cancelled = false;
      const cancelHandler = () => {
        cancelled = true;
        spinner.stop();
        console.log(chalk.yellow('\n⚠️  Chat cancelled by user'));
      };
      
      process.on('SIGINT', cancelHandler);
      
      try {
        const response = await this.aiDetective.chatWithDetective(message, this.gameState);
        
        if (cancelled) {
          continueChat = false;
          break;
        }
        
        spinner.succeed('Response ready!');
        
        console.log(chalk.green('\n🤖 Inspector Gemini:'));
        console.log(chalk.white(response.response));
        
        if (response.suggestions && response.suggestions.length > 0) {
          console.log(chalk.cyan('\n💡 Suggestions:'));
          response.suggestions.forEach(suggestion => {
            console.log(chalk.gray(`  • ${suggestion}`));
          });
        }
        
        // Determine question complexity for context
        const isComplexQuestion = message.toLowerCase().includes('why') || 
                                 message.toLowerCase().includes('how') || 
                                 message.toLowerCase().includes('connect') ||
                                 message.toLowerCase().includes('theory') ||
                                 message.toLowerCase().includes('pattern');
        
        this.gameState.addToHistory('user', message, { 
          action: 'chat',
          questionType: isComplexQuestion ? 'complex' : 'simple'
        });
        this.gameState.addToHistory('assistant', response.response, {
          action: 'chat_response',
          thinkingMode: isComplexQuestion ? 'on' : 'off'
        });
        
        console.log(chalk.gray('\n---\n'));
        
      } catch (error) {
        if (!cancelled) {
          spinner.fail('Chat failed');
          console.log(chalk.red(`Error: ${error.message}`));
          continueChat = false;
        } else {
          continueChat = false;
        }
      } finally {
        process.removeListener('SIGINT', cancelHandler);
      }
    }
    
    console.log(chalk.blue('Returning to main menu...\n'));
  }

  async connectClues() {
    const foundClues = this.gameState.getFoundClues();
    
    if (foundClues.length < 2) {
      console.log(chalk.yellow('You need at least 2 clues to make connections.'));
      return;
    }

    console.log(chalk.blue('\n🔗 AI Detective will analyze your clues and suggest connections...'));
    
    const spinner = ora('Analyzing clue connections...').start();
    
    try {
      const analysis = await this.aiDetective.suggestClueConnections(
        foundClues, 
        this.gameState.caseData
      );
      
      spinner.succeed('Connection analysis complete!');
      
      if (analysis.connections && analysis.connections.length > 0) {
        console.log(chalk.green('\n🔗 Suggested Connections:'));
        analysis.connections.forEach(conn => {
          const fromClue = foundClues.find(c => c.id === conn.from);
          const toClue = foundClues.find(c => c.id === conn.to);
          
          if (fromClue && toClue) {
            console.log(chalk.white(`\n${fromClue.label} → ${toClue.label}`));
            console.log(chalk.gray(`  Reason: ${conn.reason}`));
            console.log(chalk.blue(`  Strength: ${(conn.strength * 100).toFixed(1)}%`));
          }
        });
      }
      
      if (analysis.theory) {
        console.log(chalk.cyan(`\n🧠 Overall Theory: ${analysis.theory}`));
      }
      
      if (analysis.confidence) {
        const confidenceColor = analysis.confidence > 0.8 ? 'green' : 
                               analysis.confidence > 0.6 ? 'yellow' : 'red';
        console.log(chalk[confidenceColor](`\nConfidence: ${(analysis.confidence * 100).toFixed(1)}%`));
      }
      
    } catch (error) {
      spinner.fail('Connection analysis failed');
      console.log(chalk.red(`Error: ${error.message}`));
    }
    
    await this.pause();
  }

  async showProgress() {
    const progress = this.gameState.getProgress();
    const foundClues = this.gameState.getFoundClues();
    
    console.log(chalk.blue('\n📊 Investigation Progress:'));
    
    console.log(chalk.green(`\n🔍 Clues Found: ${progress.clues.found}/${progress.clues.total} (${progress.clues.percentage.toFixed(1)}%)`));
    if (foundClues.length > 0) {
      foundClues.forEach(clue => {
        console.log(chalk.gray(`  ✓ ${clue.label}`));
      });
    }
    
    console.log(chalk.yellow(`\n📄 Evidence Analyzed: ${progress.evidence.analyzed}/${progress.evidence.total} (${progress.evidence.percentage.toFixed(1)}%)`));
    
    console.log(chalk.cyan(`\n🎭 Scenes Unlocked: ${progress.scenes.unlocked}/${progress.scenes.total} (${progress.scenes.percentage.toFixed(1)}%)`));
    
    const connections = this.gameState.getClueConnections();
    if (connections.length > 0) {
      console.log(chalk.magenta(`\n🔗 Clue Connections: ${connections.length}`));
    }
    
    await this.pause();
  }

  async showContextMemory() {
    const context = this.gameState.getRecentContext();
    const conversationHistory = this.gameState.getConversationHistory();
    
    console.log(chalk.blue('\n🧠 Inspector Gemini\'s Context Memory:'));
    
    console.log(chalk.cyan(`\n📍 Current Scene: ${context.currentScene}`));
    console.log(chalk.cyan(`🎯 Investigation Phase: ${context.investigationPhase}`));
    console.log(chalk.cyan(`📊 Progress: ${context.progress.clues} clues, ${context.progress.evidence} evidence`));
    
    if (context.recentTopics.length > 0) {
      console.log(chalk.yellow(`\n🏷️  Recent Topics: ${context.recentTopics.join(', ')}`));
    }
    
    console.log(chalk.green(`\n💬 Recent Conversation (${context.recentMessages.length} exchanges):`));
    if (context.recentMessages.length > 0) {
      context.recentMessages.forEach((entry, index) => {
        const role = entry.role === 'user' ? 'Player' : 'Inspector Gemini';
        const color = entry.role === 'user' ? 'white' : 'green';
        console.log(chalk[color](`  ${index + 1}. ${role}: ${entry.message.substring(0, 80)}${entry.message.length > 80 ? '...' : ''}`));
      });
    } else {
      console.log(chalk.gray('  No conversation yet'));
    }
    
    console.log(chalk.magenta(`\n📈 Total Exchanges: ${conversationHistory.length}`));
    
    await this.pause();
  }

  async submitTheory() {
    const { theory } = await inquirer.prompt([
      {
        type: 'input',
        name: 'theory',
        message: 'Submit your theory about what happened:',
        validate: input => input.trim().length > 10 || 'Please provide a detailed theory'
      }
    ]);

    console.log(chalk.blue('\n📝 Theory submitted!'));
    console.log(chalk.white(theory));
    console.log(chalk.gray('\nNote: This is a demo version. In a full implementation, this would be evaluated against the case answer.'));
    
    this.gameState.addToHistory('user', `Submitted theory: ${theory}`);
    
    await this.pause();
  }

  async exitGame() {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to exit?',
        default: false
      }
    ]);

    if (confirm) {
      console.log(chalk.green('\n👋 Thanks for playing! Good luck with your investigation!'));
      this.isRunning = false;
    }
  }

  async performInitialEvidenceAnalysis() {
    console.log(chalk.blue('\n🔍 Inspector Gemini is performing initial evidence analysis...'));
    
    const spinner = ora('Analyzing all evidence...').start();
    
    try {
      const analysis = await this.aiDetective.analyzeAllEvidence(this.gameState.caseData);
      
      spinner.succeed('Initial analysis complete!');
      
      console.log(chalk.green('\n📋 Case Board Summary:'));
      
      if (analysis.objects_detected && analysis.objects_detected.length > 0) {
        console.log(chalk.cyan('\n🔍 Objects Detected:'));
        analysis.objects_detected.forEach(obj => {
          console.log(chalk.gray(`  • ${obj}`));
        });
      }
      
      if (analysis.text_excerpts && analysis.text_excerpts.length > 0) {
        console.log(chalk.yellow('\n📝 Text Excerpts:'));
        analysis.text_excerpts.forEach(text => {
          console.log(chalk.gray(`  • ${text}`));
        });
      }
      
      if (analysis.anomalies && analysis.anomalies.length > 0) {
        console.log(chalk.red('\n⚠️  Anomalies:'));
        analysis.anomalies.forEach(anomaly => {
          console.log(chalk.gray(`  • ${anomaly}`));
        });
      }
      
      if (analysis.initial_theories && analysis.initial_theories.length > 0) {
        console.log(chalk.magenta('\n🧠 Initial Theories:'));
        analysis.initial_theories.forEach(theory => {
          console.log(chalk.gray(`  • ${theory}`));
        });
      }
      
      if (analysis.next_investigation_steps && analysis.next_investigation_steps.length > 0) {
        console.log(chalk.blue('\n💡 Next Investigation Steps:'));
        analysis.next_investigation_steps.forEach(step => {
          console.log(chalk.gray(`  • ${step}`));
        });
      }
      
      this.gameState.addToHistory('assistant', 'Performed initial evidence analysis', {
        action: 'batch_analysis',
        analysis_summary: analysis
      });
      
    } catch (error) {
      spinner.fail('Initial analysis failed');
      console.log(chalk.red(`Error: ${error.message}`));
    }
    
    await this.pause();
  }

  async generateDetectiveNotes() {
    console.log(chalk.blue('\n📝 Generating Detective Notes...'));
    
    const spinner = ora('Inspector Gemini is writing detective notes...').start();
    
    try {
      const notes = await this.aiDetective.generateDetectiveNotes(this.gameState);
      
      spinner.succeed('Detective notes generated!');
      
      console.log(chalk.green('\n📖 Detective Journal Entry:'));
      console.log(chalk.gray(`Generated: ${notes.timestamp.toLocaleString()}`));
      console.log(chalk.white('\n' + notes.notes));
      
      if (notes.summary) {
        console.log(chalk.cyan(`\n📝 Summary: ${notes.summary}`));
      }
      
      this.gameState.addToHistory('assistant', 'Generated detective notes', {
        action: 'detective_notes',
        notes_summary: notes.summary
      });
      
    } catch (error) {
      spinner.fail('Notes generation failed');
      console.log(chalk.red(`Error: ${error.message}`));
    }
    
    await this.pause();
  }

  async getSmartHint() {
    console.log(chalk.blue('\n💡 Getting Smart Hint...'));
    
    const { message } = await inquirer.prompt([
      {
        type: 'input',
        name: 'message',
        message: 'What are you stuck on? (optional - leave blank for general hint)',
        default: ''
      }
    ]);
    
    const spinner = ora('Inspector Gemini is analyzing your situation...').start();
    
    try {
      const hint = await this.aiDetective.generateSmartHint(this.gameState, message);
      
      spinner.succeed('Smart hint ready!');
      
      console.log(chalk.green('\n💡 Smart Hint:'));
      console.log(chalk.white(hint.hint));
      
      if (hint.category) {
        console.log(chalk.gray(`\nCategory: ${hint.category}`));
      }
      
      if (hint.confidence) {
        const confidenceColor = hint.confidence > 0.8 ? 'green' : 
                               hint.confidence > 0.6 ? 'yellow' : 'red';
        console.log(chalk[confidenceColor](`Confidence: ${(hint.confidence * 100).toFixed(1)}%`));
      }
      
      this.gameState.addToHistory('user', `Requested hint: ${message || 'general'}`);
      this.gameState.addToHistory('assistant', hint.hint, {
        action: 'smart_hint',
        category: hint.category
      });
      
    } catch (error) {
      spinner.fail('Hint generation failed');
      console.log(chalk.red(`Error: ${error.message}`));
    }
    
    await this.pause();
  }

  async showReasoningMap() {
    console.log(chalk.blue('\n🗺️ Generating Reasoning Map...'));
    
    const spinner = ora('Inspector Gemini is mapping the reasoning chain...').start();
    
    try {
      const reasoningMap = await this.aiDetective.generateReasoningMap(this.gameState);
      
      spinner.succeed('Reasoning map generated!');
      
      console.log(chalk.green('\n🗺️ Reasoning Map:'));
      console.log(chalk.white(reasoningMap.reasoning_tree));
      
      if (reasoningMap.key_connections && reasoningMap.key_connections.length > 0) {
        console.log(chalk.cyan('\n🔗 Key Connections:'));
        reasoningMap.key_connections.forEach(conn => {
          console.log(chalk.gray(`  • ${conn}`));
        });
      }
      
      if (reasoningMap.logical_flow && reasoningMap.logical_flow.length > 0) {
        console.log(chalk.yellow('\n📈 Logical Flow:'));
        reasoningMap.logical_flow.forEach(step => {
          console.log(chalk.gray(`  • ${step}`));
        });
      }
      
      if (reasoningMap.insights && reasoningMap.insights.length > 0) {
        console.log(chalk.magenta('\n💡 Key Insights:'));
        reasoningMap.insights.forEach(insight => {
          console.log(chalk.gray(`  • ${insight}`));
        });
      }
      
      this.gameState.addToHistory('assistant', 'Generated reasoning map', {
        action: 'reasoning_map',
        connections_count: reasoningMap.key_connections?.length || 0
      });
      
    } catch (error) {
      spinner.fail('Reasoning map generation failed');
      console.log(chalk.red(`Error: ${error.message}`));
    }
    
    await this.pause();
  }

  async showCaseRecap() {
    console.log(chalk.blue('\n📋 Generating Case Recap...'));
    
    const spinner = ora('Inspector Gemini is creating case recap...').start();
    
    try {
      const recap = await this.aiDetective.generateCaseRecap(this.gameState);
      
      spinner.succeed('Case recap generated!');
      
      console.log(chalk.green('\n📋 Case Recap:'));
      console.log(chalk.white(recap.recap));
      
      if (recap.timeline && recap.timeline.length > 0) {
        console.log(chalk.cyan('\n⏰ Timeline:'));
        recap.timeline.forEach((item, index) => {
          console.log(chalk.gray(`  ${index + 1}. ${item}`));
        });
      }
      
      if (recap.theories && recap.theories.length > 0) {
        console.log(chalk.magenta('\n🧠 Current Theories:'));
        recap.theories.forEach((theory, index) => {
          console.log(chalk.gray(`  ${index + 1}. ${theory}`));
        });
      }
      
      if (recap.next_steps && recap.next_steps.length > 0) {
        console.log(chalk.blue('\n💡 Next Steps:'));
        recap.next_steps.forEach((step, index) => {
          console.log(chalk.gray(`  ${index + 1}. ${step}`));
        });
      }
      
      this.gameState.addToHistory('assistant', 'Generated case recap', {
        action: 'case_recap',
        timeline_items: recap.timeline?.length || 0,
        theories_count: recap.theories?.length || 0
      });
      
    } catch (error) {
      spinner.fail('Case recap generation failed');
      console.log(chalk.red(`Error: ${error.message}`));
    }
    
    await this.pause();
  }

  async pause() {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: 'Press Enter to continue...'
      }
    ]);
  }
}
