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
  
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      useMobileStore.getState().checkViewport();
    }, 50); // 50ms debounce (reduced for better response)
  };
  
  // Add resize listener
  window.addEventListener('resize', handleResize);
  
  // Add orientation change listener for mobile devices
  window.addEventListener('orientationchange', () => {
    // Check immediately on orientation change
    useMobileStore.getState().checkViewport();
    
    // Also check after a slight delay to ensure accurate values
    setTimeout(() => {
      useMobileStore.getState().checkViewport();
    }, 100);
  });
  
  // Initial check after DOM content loaded to ensure accurate values
  document.addEventListener('DOMContentLoaded', () => {
    useMobileStore.getState().checkViewport();
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
