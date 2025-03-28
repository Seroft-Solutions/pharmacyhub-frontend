/**
 * Zustand store for anti-sharing state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginStatus, SessionData } from '../types';
import { getDeviceId, isCurrentDevice } from '../core/deviceManager';

// Interface for the anti-sharing state
interface AntiSharingState {
  // State
  deviceId: string;
  sessionId?: string;
  activeSessions: SessionData[];
  loginStatus: LoginStatus;
  isLoading: boolean;
  error?: string;
  
  // Actions
  setDeviceId: (deviceId: string) => void;
  setSessionId: (sessionId: string) => void;
  setActiveSessions: (sessions: SessionData[]) => void;
  setLoginStatus: (status: LoginStatus) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error?: string) => void;
  clearError: () => void;
  reset: () => void;
  
  // Selectors (computed values)
  getCurrentSession: () => SessionData | undefined;
  getOtherSessions: () => SessionData[];
  getSuspiciousSessions: () => SessionData[];
  hasMultipleSessions: () => boolean;
}

// Create the store with persist middleware
export const useAntiSharingStore = create<AntiSharingState>()(
  persist(
    (set, get) => ({
      // Initial state
      deviceId: typeof window !== 'undefined' ? getDeviceId() : '',
      activeSessions: [],
      loginStatus: LoginStatus.OK,
      isLoading: false,
      
      // Actions
      setDeviceId: (deviceId: string) => set({ deviceId }),
      setSessionId: (sessionId: string) => set({ sessionId }),
      setActiveSessions: (sessions: SessionData[]) => set({ activeSessions: sessions }),
      setLoginStatus: (status: LoginStatus) => set({ loginStatus: status }),
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error?: string) => set({ error }),
      clearError: () => set({ error: undefined }),
      reset: () => set({
        sessionId: undefined,
        activeSessions: [],
        loginStatus: LoginStatus.OK,
        isLoading: false,
        error: undefined,
      }),
      
      // Selectors
      getCurrentSession: () => {
        const { activeSessions, deviceId } = get();
        return activeSessions.find(session => isCurrentDevice(session.deviceId));
      },
      getOtherSessions: () => {
        const { activeSessions, deviceId } = get();
        return activeSessions.filter(session => !isCurrentDevice(session.deviceId));
      },
      getSuspiciousSessions: () => {
        const { activeSessions } = get();
        
        // Get sessions with suspicious activity (multiple logins in a short time, unusual locations)
        // This is a simplified example - in a real app, you'd have more sophisticated detection
        const now = new Date();
        const suspiciousSessions = activeSessions.filter(session => {
          const loginTime = new Date(session.loginTime);
          const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
          
          // Consider sessions suspicious if:
          // 1. They are active
          // 2. There are more than 2 active sessions
          // 3. Multiple logins in a short time period
          return (
            session.active && 
            get().hasMultipleSessions() && 
            hoursSinceLogin < 24
          );
        });
        
        return suspiciousSessions;
      },
      hasMultipleSessions: () => {
        const { activeSessions } = get();
        return activeSessions.filter(session => session.active).length > 1;
      },
    }),
    {
      name: 'pharmhub-anti-sharing-storage',
      partialize: (state) => ({
        deviceId: state.deviceId,
        sessionId: state.sessionId,
      }),
    }
  )
);
