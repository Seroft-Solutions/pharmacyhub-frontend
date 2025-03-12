"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
  NavigationContextValue, 
  NavItem, 
  FeatureNavigation,
  NavigationProviderProps 
} from "./types";

// Create the navigation context
const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

/**
 * NavigationProvider - Provides a central registry for all feature navigation
 * 
 * This component allows features to register their navigation items and
 * provides a unified navigation structure for the application shell.
 */
export function NavigationProvider({ 
  children, 
  initialFeatures = [] 
}: NavigationProviderProps) {
  const [features, setFeatures] = useState<FeatureNavigation[]>(initialFeatures);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const pathname = usePathname();

  // Update active feature based on the current path
  useEffect(() => {
    if (!pathname) return;

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

    setActiveFeature(bestMatch?.featureId || null);
  }, [pathname, features]);

  // Register a new feature
  const registerFeature = (feature: FeatureNavigation) => {
    setFeatures(prevFeatures => {
      // Check if feature already exists
      const exists = prevFeatures.some(f => f.id === feature.id);
      if (exists) {
        // Update existing feature
        return prevFeatures.map(f => 
          f.id === feature.id ? { ...f, ...feature } : f
        );
      }
      // Add new feature
      return [...prevFeatures, feature];
    });
  };

  // Unregister a feature
  const unregisterFeature = (featureId: string) => {
    setFeatures(prevFeatures => 
      prevFeatures.filter(f => f.id !== featureId)
    );
  };

  // Get navigation items for a specific feature
  const getFeatureItems = (featureId: string): NavItem[] => {
    const feature = features.find(f => f.id === featureId);
    return feature?.items || [];
  };

  // Get all navigation items from all features
  const getAllItems = (): NavItem[] => {
    return features
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .flatMap(feature => 
        feature.items.map(item => ({
          ...item,
          feature: feature.id
        }))
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  // Get the current path
  const getCurrentPath = (): string => {
    return pathname || '/';
  };

  // Context value
  const value: NavigationContextValue = {
    features,
    activeFeature,
    registerFeature,
    unregisterFeature,
    getFeatureItems,
    getAllItems,
    getCurrentPath
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * useNavigation - Hook to access the navigation context
 */
export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
