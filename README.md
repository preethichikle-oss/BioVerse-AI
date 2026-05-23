# BioVerse AI

BioVerse AI is an interactive AI-powered 3D biology learning platform developed for the Indian Servers AI Model Development Competition 2026.
The platform combines AI tutoring, interactive simulations, quizzes, and real-time 3D visualization to make biology learning more immersive and engaging.

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

## Screenshots
### Home Page
<img width="1904" height="1026" alt="home page image" src="https://github.com/user-attachments/assets/a7a3a0aa-c53a-40cf-88cb-2dff9170fe5c" />
### 3D Explorer
<img width="1916" height="1038" alt="3D cell image" src="https://github.com/user-attachments/assets/f2f81e78-82b8-47b5-9d21-a5e3350a6612" />
### Simulation Lab
<img width="1918" height="1035" alt="lab image" src="https://github.com/user-attachments/assets/50e0442a-9bb5-4651-b9e3-4f85f7b87736" />


## Tech Stack

- React
- Vite
- Tailwind CSS
- React Three Fiber
- Three.js
- Framer Motion
- Zustand
- OpenAI / Gemini API


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
  assets/              Static assets and 3D resources
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
