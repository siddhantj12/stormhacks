# CLI Detective Game

A command-line interface version of the Weather Inspector detective game, featuring AI-powered evidence analysis and clue connections using Google's Gemini API.

## Features

- 🎭 **Scene Exploration**: Navigate through different crime scenes
- 🔍 **Evidence Analysis**: Use AI to analyze evidence and ask questions
- 💬 **AI Detective Chat**: Get help and suggestions from an AI detective
- 🔗 **Clue Connections**: AI suggests connections between discovered clues
- 📊 **Progress Tracking**: Monitor your investigation progress
- 📝 **Theory Submission**: Submit your final theory

## Setup

1. **Install Dependencies**
   ```bash
   cd cli-detective
   npm install
   ```

2. **Configure Gemini API**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env and add your Gemini API key
   # Get your API key from: https://aistudio.google.com/
   ```

3. **Run the Game**
   ```bash
   npm start
   ```

## Usage

### Main Menu Commands

- **🎭 Explore Scenes**: Navigate to different crime scenes
- **🔍 Examine Evidence**: Analyze evidence with AI assistance
- **💬 Chat with AI Detective**: Ask general questions
- **🔗 Connect Clues**: Get AI suggestions for clue connections
- **📊 View Progress**: See your investigation progress
- **📝 Submit Theory**: Submit your final theory
- **❌ Exit Game**: Quit the application

### Evidence Analysis

When examining evidence, you can ask questions like:
- "What do you notice about this image?"
- "Are there any suspicious details?"
- "What does this document tell us?"
- "How does this relate to the case?"

### AI Detective Chat

The AI detective can help with:
- General case guidance
- Investigation strategies
- Evidence interpretation
- Next steps suggestions

## Game Flow

1. **Start**: Choose a case to investigate
2. **Explore**: Visit different scenes to find evidence
3. **Analyze**: Use AI to examine evidence and discover clues
4. **Connect**: Find relationships between clues
5. **Theorize**: Develop and submit your theory

## Configuration

### Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)
- `AI_MODEL`: AI model to use (default: gemini-1.5-flash)
- `AI_TEMPERATURE`: AI creativity level 0-1 (default: 0.7)

### Case Files

The CLI reads case data from the main project's case files:
- `../src/cases/case-001.client.json` - Case data
- `../src/cases/case-001.answer.json` - Case answers

## Development

### Project Structure

```
cli-detective/
├── index.js              # Main entry point
├── case-loader.js        # Case data loading
├── game-state.js         # Game state management
├── ai-detective.js       # Gemini AI integration
├── cli-interface.js      # Interactive CLI interface
├── types.js              # Type definitions
├── package.json          # Dependencies
└── README.md             # This file
```

### Adding New Features

1. **New Commands**: Add to `cli-interface.js` in the main menu
2. **AI Prompts**: Modify prompts in `ai-detective.js`
3. **Game Logic**: Extend functionality in `game-state.js`

## Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY environment variable is required"**
   - Make sure you've created a `.env` file with your API key

2. **"No cases found"**
   - Ensure case files exist in `../src/cases/`
   - Check file permissions

3. **"AI analysis failed"**
   - Verify your Gemini API key is valid
   - Check your internet connection
   - Ensure you have API quota remaining

### Debug Mode

Run with debug logging:
```bash
DEBUG=* npm start
```

## Future Enhancements

- [ ] Multiple case selection
- [ ] Save/load game progress
- [ ] Multiplayer detective mode
- [ ] Custom case creation
- [ ] Advanced AI reasoning
- [ ] Voice interaction
- [ ] Visual evidence display

## License

This project is part of the Weather Inspector application.
