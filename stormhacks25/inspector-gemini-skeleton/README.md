# Inspector Gemini - Game Skeleton

This project is a production-ready Next.js skeleton for a scene-based detective game. It includes a scene viewer with hotspots, a detective board for connecting clues, and a complete set of mock APIs to simulate the game logic without any Gemini integration yet.

This project was bootstrapped by Gemini.

## Features

- **Scene-Based Exploration:** Navigate between scenes using interactive hotspots.
- **Zoom Transitions:** Simple zoom/fade transitions between connected scenes.
- **Interaction System:** A simple counter-based interaction system (e.g., the 3-press piano key).
- **Unlockable Content:** Scenes and clues are unlocked based on player actions.
- **Detective Board:** A `reactflow` powered board to visualize and connect found clues.
- **Mock API Layer:** All backend logic is simulated via Next.js Route Handlers, returning plausible mock data.
- **Manifest-Driven:** Case content (scenes, hotspots, clues) is defined in easy-to-edit JSON files.
- **Clear Integration Points:** The code contains `// TODO(gemini)` and `// TODO(design)` comments to guide future integration and styling.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Navigate to the project directory:**
    ```bash
    cd inspector-gemini-skeleton
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To start the app in development mode, run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to be redirected to the first scene.

## How to Extend

### 1. Scene Flow & Interactions

The primary game flow is now centered around the Theatre and a close-up Piano scene.

- **Scene Manifest**: The file `cases/case-001.client.json` defines all scenes, hotspots, and click actions.
- **Hotspot Rects**: Hotspot positions and sizes (`rect`) are normalized from `0` to `1` (top-left to bottom-right).
- **3-Press Interaction**: The E-flat key logic is handled in `components/scene/SceneShell.tsx`. You can adjust the `handleInteraction` function to change the required press count or the resulting action.
- **Zoom Transitions**: A basic zoom/fade is implemented in `components/scene/SceneCanvas.tsx` and configured in `tailwind.config.ts`. Look for `// TODO(design): nicer zoom/blur transition` to improve it.

### 2. Add Real Assets

The project currently uses placeholder images. You can replace them in `/public/cases/001/`. The paths are defined in `cases/case-001.client.json`.

- Scene backgrounds: `/public/cases/001/scenes/`
- Evidence images: `/public/cases/001/`

### 3. Integrate Gemini

The mock API routes are the designated places to add your Gemini calls.

- **`/app/api/ask/route.ts`**: Replace the mock logic with a call to a Gemini model to answer questions about evidence.
- **`/app/api/board/suggest-links/route.ts`**: Replace the mock logic with a call to a Gemini model to suggest connections between clues.
- **`/app/api/submit/route.ts`**: This route should remain as-is, as it securely grades the player's theory against a server-only answer key.
