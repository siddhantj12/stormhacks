#!/usr/bin/env node

import chalk from 'chalk';
import { CaseLoader } from './case-loader.js';
import { AIDetective } from './ai-detective.js';
import { CLIDetectiveInterface } from './cli-interface.js';

async function main() {
  console.log(chalk.blue.bold('🕵️  CLI Detective Game  🕵️\n'));

  try {
    // Initialize case loader
    const caseLoader = new CaseLoader();
    
    // Check for available cases
    const availableCases = caseLoader.listAvailableCases();
    if (availableCases.length === 0) {
      console.log(chalk.red('No cases found. Make sure case files are in the correct location.'));
      process.exit(1);
    }

    // For now, load the first available case
    // In a full implementation, you'd let the user choose
    const caseId = availableCases[0];
    console.log(chalk.gray(`Loading case: ${caseId}...`));
    
    const caseData = await caseLoader.loadCase(caseId);
    console.log(chalk.green(`✓ Case loaded: ${caseData.title}`));

    // Initialize AI Detective
    console.log(chalk.gray('Initializing AI Detective...'));
    const aiDetective = new AIDetective();
    console.log(chalk.green('✓ AI Detective ready'));

    // Start the CLI interface
    const cliInterface = new CLIDetectiveInterface(caseData, aiDetective);
    await cliInterface.start();

  } catch (error) {
    console.log(chalk.red(`\n❌ Error: ${error.message}`));
    
    if (error.message.includes('GEMINI_API_KEY')) {
      console.log(chalk.yellow('\n💡 To use the AI features, you need to:'));
      console.log(chalk.gray('1. Get a Gemini API key from Google AI Studio'));
      console.log(chalk.gray('2. Copy env.example to .env'));
      console.log(chalk.gray('3. Add your API key to the .env file'));
    }
    
    process.exit(1);
  }
}

// Handle uncaught errors gracefully
process.on('uncaughtException', (error) => {
  console.log(chalk.red(`\n❌ Unexpected error: ${error.message}`));
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log(chalk.red(`\n❌ Unhandled rejection: ${reason}`));
  process.exit(1);
});

// Start the application
main();
