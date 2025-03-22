"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logger } from '@/shared/lib/logger';
import { FeatureNavigation, NavItem } from '../types/navigationTypes';

interface NavigationState {
  // State
  features: FeatureNavigation[];
  activeFeature: string | null;
  
  // Actions
  registerFeature: (feature: FeatureNavigation) => void;
  unregisterFeature: (featureId: string) => void;
  setActiveFeature: (featureId: string | null) => void;
  
  // Selector functions
  getFeatureItems: (featureId: string) => NavItem[];
  getAllItems: () => NavItem[];
}

/**
 * Check if two navigation features are the same
 */
const isSameFeature = (a: FeatureNavigation, b: FeatureNavigation): boolean => {
  return a.id === b.id;
};

/**
 * Navigation store - A global store for application navigation
 * 
 * This replaces the context-based navigation with a Zustand store
 * for better performance and to avoid React context/provider issues.
 */
export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      // Initial state
      features: [],
      activeFeature: null,
      
      // Register a feature in the navigation system
      registerFeature: (feature) => {
        logger.debug('[NavigationStore] Registering feature', { 
          featureId: feature.id 
        });
        
        set((state) => {
          // Check if feature already exists
          const existingIndex = state.features.findIndex(f => f.id === feature.id);
          
          if (existingIndex !== -1) {
            // Update existing feature
            const features = [...state.features];
            features[existingIndex] = { ...features[existingIndex], ...feature };
            return { features };
          }
          
          // Add new feature
          return { 
            features: [...state.features, feature] 
          };
        });
      },
      
      // Unregister a feature
      unregisterFeature: (featureId) => {
        set((state) => ({
          features: state.features.filter(f => f.id !== featureId)
        }));
      },
      
      // Set the active feature
      setActiveFeature: (featureId) => {
        set({ activeFeature: featureId });
      },
      
      // Get navigation items for a specific feature
      getFeatureItems: (featureId) => {
        const state = get();
        const feature = state.features.find(f => f.id === featureId);
        return feature?.items || [];
      },
      
      // Get all navigation items from all features
      getAllItems: () => {
        const state = get();
        return state.features
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .flatMap(feature => 
            feature.items.map(item => ({
              ...item,
              feature: feature.id
            }))
          )
          .sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    }),
    {
      name: 'navigation-storage', // unique name for localStorage
      partialize: (state) => ({ 
        features: state.features,
        activeFeature: state.activeFeature
      }),
    }
  )
);

/**
 * Utility function to find the best matching active feature based on current path
 */
export function findActiveFeatureByPath(pathname: string): string | null {
  const { features, setActiveFeature } = useNavigationStore.getState();
  
  // Special case for admin paths
  if (pathname.startsWith('/admin')) {
    setActiveFeature('admin');
    return 'admin';
  }
  
  // Find the feature with the longest matching rootPath
  let bestMatch: { featureId: string, pathLength: number } | null = null;

  features.forEach(feature => {
    if (feature.rootPath && pathname.startsWith(feature.rootPath)) {
      const pathLength = feature.rootPath.length;
      if (!bestMatch || pathLength > bestMatch.pathLength) {
        bestMatch = { featureId: feature.id, pathLength };
      }
    }
  });
  
  const featureId = bestMatch?.featureId || null;
  
  // Update active feature in store
  setActiveFeature(featureId);
  
  return featureId;
}

/**
 * Hook for active feature path detection
 * 
 * @param pathname Current path from Next.js router
 */
export function useActiveFeature(pathname: string) {
  const activeFeature = useNavigationStore(state => state.activeFeature);
  
  // Find active feature if not set yet or path changed
  if (!activeFeature && pathname) {
    findActiveFeatureByPath(pathname);
  }
  
  return {
    activeFeature: useNavigationStore(state => state.activeFeature)
  };
}

export default useNavigationStore;