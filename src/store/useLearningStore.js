import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLearningStore = create(
  persist(
    (set, get) => ({
      xp: 120,
      completedModules: ['Landing'],
      quizScores: [],
      selectedOrganelle: 'Nucleus',
      soundEnabled: true,
      themePulse: true,
      chatHistory: [
        {
          role: 'assistant',
          content:
            'Welcome to BioVerse AI. Ask me about organelles, ATP, protein synthesis, or cell transport.',
        },
      ],
      setSelectedOrganelle: (name) =>
        set((state) => ({
          selectedOrganelle: name,
          xp: state.xp + 4,
        })),
      addCompletion: (module) =>
        set((state) => ({
          completedModules: state.completedModules.includes(module)
            ? state.completedModules
            : [...state.completedModules, module],
          xp: state.completedModules.includes(module) ? state.xp : state.xp + 25,
        })),
      addQuizScore: (score) =>
        set((state) => ({
          quizScores: [...state.quizScores, score].slice(-8),
          xp: state.xp + score.correct * 12,
        })),
      addChatMessage: (message) =>
        set((state) => ({ chatHistory: [...state.chatHistory, message] })),
      resetChat: () => set({ chatHistory: [] }),
      toggleSound: () => set({ soundEnabled: !get().soundEnabled }),
      toggleThemePulse: () => set({ themePulse: !get().themePulse }),
    }),
    { name: 'bioverse-learning-state' },
  ),
);
