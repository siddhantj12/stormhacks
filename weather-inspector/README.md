# Weather Inspector

This project merges the Weather and Inspector Next.js applications into a single unified project.

## Installation and Running

1.  Navigate to the project directory:
    `cd weather-inspector`
2.  Install dependencies:
    `npm install`
3.  Run the development server:
    `npm run dev`

## How the Cloud -> Rain -> Theatre Chain Works

-   The landing page (`/`) displays the Weather screen.
-   Tapping the cloud button on the Weather screen:
    -   Activates a rain overlay.
    -   Swaps the theme from 'weather' to 'noir'.
    -   Navigates to the Inspector Theatre scene (`/game/case-001/scene/theatre`).

## Where to Drop Lottie/Thunder SFX

-   **Lottie Rain Animation:** Replace the placeholder in `src/components/weather/RainOverlay.tsx` with your Lottie JSON file. You might need to place the JSON file in `public/lottie/cloud-rain.json` and uncomment the relevant import and usage in `RainOverlay.tsx`.
-   **Thunder SFX:** The `CloudButton.tsx` has a comment indicating where to play thunder sound effects. You can place your `thunder.mp3` in `public/sounds/thunder.mp3` and implement the audio playback logic.

## Where to Integrate Gemini Later

-   **`/api/ask`:** This endpoint is currently mocked. This is where Gemini API integration for partner answers can be added.
-   **`/api/board/suggest-links`:** This endpoint is also mocked. Gemini API integration for suggesting links on the board can be added here.