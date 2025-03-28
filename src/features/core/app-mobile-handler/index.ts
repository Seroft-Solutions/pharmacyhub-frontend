/**
 * Mobile Support Feature
 * 
 * @deprecated This module has been migrated to `@/core/mobile`. Please update your imports.
 * 
 * A centralized feature for mobile viewport detection and responsive components.
 * Provides utilities, components, and state management for handling different device sizes.
 */

// Import mobile styles to ensure they're loaded
import './utils/mobile-styles.css';

// Export all components
export { 
  MobileWrapper,
  MobileOnly,
  DesktopOnly,
  TabletAndDesktop,
  ResponsiveContainer
} from './components/MobileWrapper';

// Export store and selectors
export {
  useMobileStore,
  selectIsMobile,
  selectIsTablet,
  selectIsDesktop,
  selectViewportSize,
  BREAKPOINTS
} from './store/useMobileStore';

// Export utility functions
export {
  isMobile,
  isTablet,
  isDesktop,
  isPortrait,
  isLandscape,
  getDeviceType
} from './utils/isMobile';
