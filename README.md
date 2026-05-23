# BioVerse AI

Interactive 3D Human Cell Learning Platform for an AI Model Development Competition 2026 demo.

## Features

- React + Vite + Tailwind CSS application
- React Router navigation with responsive sidebar
- React Three Fiber human cell explorer with OrbitControls, Html labels, Float animation, lighting, shadows, and Environment
- Cell function simulation lab for ATP production, protein synthesis, and cell transport
- AI tutor chat with OpenAI, Gemini, or local fallback mode
- Browser SpeechSynthesis narration support
- Randomized quiz dashboard with instant feedback, XP, badges, and recent scores
- Zustand persisted learner progress
- Lazy-loaded screens and Suspense loading states

## Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## AI Configuration

The app works without an API key using `VITE_AI_PROVIDER=local`.

To use OpenAI:

```bash
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=your_key_here
VITE_OPENAI_MODEL=gpt-4o-mini
```

To use Gemini:

```bash
VITE_AI_PROVIDER=gemini
VITE_GEMINI_API_KEY=your_key_here
VITE_GEMINI_MODEL=gemini-1.5-flash
```

Copy `.env.example` to `.env` and set the provider you want.

## Project Structure

```text
src/
  assets/              Example assets folder for future media
  components/          Layout, dashboard widgets, shared UI
  components/three/    React Three Fiber cell scenes
  data/                Organelle and quiz data
  pages/               Landing, Explorer, Lab, Tutor, Quiz
  services/            AI tutor integrations
  store/               Zustand learning progress store
```

## Demo Flow

1. Start on the landing page and click `Start Learning`.
2. Select organelles in the 3D Cell Explorer and listen to AI explanations.
3. Run the three simulations in the Cell Function Simulation Lab.
4. Ask the AI Tutor beginner questions about cells.
5. Complete the quiz and show XP, badges, and progress tracking.
