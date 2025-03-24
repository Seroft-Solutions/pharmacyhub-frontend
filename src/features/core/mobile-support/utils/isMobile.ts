import { BREAKPOINTS } from '../store/useMobileStore';

/**
 * SSR-safe check for mobile viewport
 * @returns boolean indicating if the current viewport is mobile
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.md;
};

/**
 * SSR-safe check for tablet viewport
 * @returns boolean indicating if the current viewport is tablet
 */
export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg;
};

/**
 * SSR-safe check for desktop viewport
 * @returns boolean indicating if the current viewport is desktop
 */
export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= BREAKPOINTS.lg;
};

/**
 * Check if the device is in portrait orientation
 * @returns boolean indicating if the current orientation is portrait
 */
export const isPortrait = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerHeight > window.innerWidth;
};

/**
 * Check if the device is in landscape orientation
 * @returns boolean indicating if the current orientation is landscape
 */
export const isLandscape = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth > window.innerHeight;
};

/**
 * Get current device type category
 * @returns 'mobile' | 'tablet' | 'desktop' based on current viewport
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};
