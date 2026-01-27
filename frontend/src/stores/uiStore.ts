import { create } from 'zustand';

interface UIState {
  isAIChatOpen: boolean;
  isCartOpen: boolean;
  openAIChat: () => void;
  closeAIChat: () => void;
  toggleCart: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAIChatOpen: false,
  isCartOpen: false,
  openAIChat: () => set({ isAIChatOpen: true }),
  closeAIChat: () => set({ isAIChatOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
}));
