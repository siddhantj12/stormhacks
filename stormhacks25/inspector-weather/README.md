# Inspector Weather

A minimal, polished Weather App built with Next.js, TypeScript, and Tailwind CSS. It features real-time weather data, a fun animated Easter egg, and a clean, extensible architecture.

This project was bootstrapped with Gemini.

## Features

- **Real-time Weather:** Shows current weather for your location.
- **Geolocation:** Automatically detects user's location with a fallback to Vancouver, BC.
- **Hourly Forecast:** A compact, scrollable 12-hour forecast.
- **Secret Agent Easter Egg:** A tappable cloud that triggers a rain animation and navigates to a secret "case" file.
- **Modern UI:** Clean, accessible, and responsive design.
- **Reduced Motion Support:** Respects user's accessibility preferences.

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Animation:** CSS-based rain animation (with hooks for Lottie).
- **Weather Source:** [Open-Meteo API](https://open-meteo.com/) (no API key required).
- **Testing:** Vitest + React Testing Library.
- **Linting/Formatting:** ESLint + Prettier.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Clone the repository (or save the generated code).**

2.  **Navigate to the project directory:**
    ```bash
    cd inspector-weather
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To start the app in development mode, run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run test`: Runs tests using Vitest.

## Project Structure & Customization

- **`app/`**: Contains the page routes (`/` and `/case`).
- **`components/`**: Reusable React components.
- **`lib/`**: Core logic for geolocation (`geolocate.ts`) and weather fetching (`weather.ts`).
- **`public/`**: Static assets. The `thunder.mp3` sound is currently a placeholder.
- **`tests/`**: Unit and integration tests.

### Animation: CSS vs. Lottie

The rain animation is implemented using CSS by default in `components/RainOverlay.tsx`.

To switch to a Lottie animation:
1.  Place your Lottie JSON file in `public/lottie/cloud-rain.json`.
2.  In `components/RainOverlay.tsx`, set `const useLottie = true;`.

### Changing the Fallback Location

The default fallback location is Vancouver, BC. To change it, edit the coordinates in `lib/geolocate.ts`:

```typescript
const FALLBACK_COORDS = {
  lat: 49.2827, // Your desired latitude
  lon: -123.1207, // Your desired longitude
  label: "Vancouver, BC",
};
```

## Accessibility

- **Semantic HTML:** The app uses semantic HTML elements for better structure and screen reader support.
- **Focus Management:** Interactive elements have clear focus states.
- **Reduced Motion:** Animations are disabled if the user has `prefers-reduced-motion` enabled in their system settings. The rain animation is replaced with a simple fade-in/out.
