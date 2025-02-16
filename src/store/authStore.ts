import { create } from 'zustand';
import { AuthResponse } from '@/services/authService';

interface AuthState {
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  setUser: (user: AuthResponse['user'] | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()((set) => ({
  ...initialState,
  
  setUser: (user: AuthResponse['user'] | null) => 
    set(() => ({ user })),
  
  setIsAuthenticated: (isAuthenticated: boolean) => 
    set(() => ({ isAuthenticated })),
  
  reset: () => set(() => initialState),
})); 