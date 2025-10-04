# Weather Inspector Project

## Overview
Weather Inspector is a unified Next.js application combining weather functionality with an interactive detective game. The project was migrated from Vercel to Replit on October 4, 2025.

## Recent Changes (2025-10-04)
- **Vercel to Replit Migration**: Updated package.json scripts to bind to 0.0.0.0:5000 for Replit compatibility
- **Workflow Configuration**: Set up "Weather Inspector" workflow to run Next.js dev server on port 5000
- **Dependencies**: Installed all npm dependencies (577 packages)

## Project Architecture
- **Framework**: Next.js 15.5.4 (App Router)
- **React**: 19.1.0
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Animation**: Framer Motion, Lottie
- **Testing**: Vitest + React Testing Library

### Project Structure
```
weather-inspector/
├── src/
│   ├── app/           # Next.js App Router pages and API routes
│   │   ├── api/       # Mock API endpoints for game logic
│   │   └── game/      # Game routes (board, scenes)
│   ├── components/    # React components
│   │   ├── board/     # Detective board components
│   │   ├── scene/     # Game scene components
│   │   └── weather/   # Weather app components
│   ├── cases/         # Game case data (JSON)
│   └── lib/           # Utilities (weather, geolocation, types)
├── public/            # Static assets (images, sounds, Lottie)
└── tests/            # Vitest unit tests
```

## Key Features
1. **Weather Screen**: Landing page with real-time weather, geolocation, and hourly forecast
2. **Cloud Easter Egg**: Tappable cloud triggers rain animation and theme transition to noir
3. **Detective Game**: Scene-based exploration with interactive hotspots
4. **Detective Board**: ReactFlow-powered board for connecting clues
5. **Mock APIs**: Ready for future Gemini AI integration

## Development
- **Dev Server**: Runs on port 5000 (0.0.0.0:5000)
- **Package Manager**: npm with package-lock.json
- **Commands**: 
  - `npm run dev`: Start development server
  - `npm run build`: Build for production
  - `npm run start`: Start production server
  - `npm run lint`: Run ESLint

## Future Integration Points
- `/api/ask`: Placeholder for Gemini-powered partner answers
- `/api/board/suggest-links`: Placeholder for AI-suggested clue connections
- Thunder SFX and Lottie rain animation ready for enhancement

## Replit-Specific Configuration
- Server binds to `0.0.0.0:5000` (required for Replit proxy)
- Workflow configured to auto-start dev server
- No environment variables required (uses Open-Meteo API with no key)
