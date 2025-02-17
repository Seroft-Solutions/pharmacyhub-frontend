import { create } from 'zustand';

interface StoreState {
  // Define your global state here
}

export const useStore = create<StoreState>()((set) => ({
  // Initial state and actions
}));
