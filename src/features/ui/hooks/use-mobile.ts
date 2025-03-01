/**
 * Responsive hooks for UI components
 */
import { useEffect, useState } from 'react';

/**
 * Hook that detects if the viewport is mobile-sized
 * @param breakpoint - Width threshold in pixels
 * @returns Boolean indicating if viewport is below the breakpoint
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Default to desktop on server
    if (typeof window === 'undefined') {
      setIsMobile(false);
      return;
    }

    // Check if viewport is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkMobile();

    // Set up listener for window resize
    window.addEventListener('resize', checkMobile);

    // Clean up listener
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Export as default for compatibility
 */
export default useIsMobile;
