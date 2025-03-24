import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Define breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,  // Small devices
  md: 768,  // Medium devices (tablets)
  lg: 1024, // Large devices (desktops)
  xl: 1280, // Extra large devices
};

// State interface
interface MobileState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

// Actions interface
interface MobileActions {
  checkViewport: () => void;
}

/**
 * Zustand store for mobile viewport detection
 * - Detects and stores current viewport state
 * - Manages viewport size changes via window resize events
 * - Provides selectors for common viewport queries
 */
export const useMobileStore = create<MobileState & MobileActions>()(
  subscribeWithSelector((set) => ({
    // SSR-safe defaults
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1024,
    height: 768,
    
    // Action to update viewport state
    checkViewport: () => {
      if (typeof window === 'undefined') return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      set({
        width,
        height,
        isMobile: width < BREAKPOINTS.md,
        isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
        isDesktop: width >= BREAKPOINTS.lg,
      });
    },
  }))
);

// Initialize on client-side
if (typeof window !== 'undefined') {
  // Initial check
  useMobileStore.getState().checkViewport();
  
  // Listen for resize events with debounce for performance
  let resizeTimer: NodeJS.Timeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      useMobileStore.getState().checkViewport();
    }, 100); // 100ms debounce
  });
}

// Export selectors
export const selectIsMobile = (state: MobileState) => state.isMobile;
export const selectIsTablet = (state: MobileState) => state.isTablet;
export const selectIsDesktop = (state: MobileState) => state.isDesktop;
export const selectViewportSize = (state: MobileState) => ({
  width: state.width,
  height: state.height,
});
