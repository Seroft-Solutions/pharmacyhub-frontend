/**
 * Utility functions for debugging the application
 */
import { logger } from '@/shared/lib/logger';

/**
 * Inspect the sidebar storage in localStorage to help debug issues
 */
export const inspectSidebarStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const sidebarStorage = window.localStorage.getItem('sidebar-storage');
      if (sidebarStorage) {
        const parsed = JSON.parse(sidebarStorage);
        logger.debug('[Debug] Sidebar storage content:', parsed);
        return parsed;
      } else {
        logger.debug('[Debug] Sidebar storage is empty');
        return null;
      }
    }
  } catch (error) {
    logger.error('[Debug] Error inspecting sidebar storage:', error);
    return null;
  }
  return null;
};

/**
 * Clear the sidebar storage in localStorage to reset to initial state
 */
export const resetSidebarStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('sidebar-storage');
      logger.debug('[Debug] Sidebar storage has been reset');
      return true;
    }
  } catch (error) {
    logger.error('[Debug] Error resetting sidebar storage:', error);
    return false;
  }
  return false;
};

/**
 * Function to help enforce exams is always expanded in sidebar
 */
export const ensureExamsExpanded = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const sidebarStorage = window.localStorage.getItem('sidebar-storage');
      if (sidebarStorage) {
        const parsed = JSON.parse(sidebarStorage);
        if (parsed?.state?.expandedItems) {
          parsed.state.expandedItems.exams = true;
          window.localStorage.setItem('sidebar-storage', JSON.stringify(parsed));
          logger.debug('[Debug] Exams has been set to expanded');
          return true;
        }
      }
    }
  } catch (error) {
    logger.error('[Debug] Error ensuring exams expanded:', error);
    return false;
  }
  return false;
};

/**
 * Clear the navigation storage in localStorage to reset to initial state
 */
export const resetNavigationStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('navigation-storage');
      logger.debug('[Debug] Navigation storage has been reset');
      return true;
    }
  } catch (error) {
    logger.error('[Debug] Error resetting navigation storage:', error);
    return false;
  }
  return false;
};

/**
 * Reset all storage related to navigation and sidebar
 */
export const resetAllStorage = () => {
  resetSidebarStorage();
  resetNavigationStorage();
  logger.debug('[Debug] All navigation storage has been reset');
  return true;
};

export default {
  inspectSidebarStorage,
  resetSidebarStorage,
  ensureExamsExpanded,
  resetNavigationStorage,
  resetAllStorage
};
