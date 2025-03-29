"use client";

/**
 * Theme Context
 * 
 * Context for managing the application theme.
 * This is a simple UI state that changes infrequently,
 * making it a good candidate for React Context.
 */
import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, ReactNode } from 'react';

// Available theme options
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme context interface
 */
interface ThemeContextType {
  /** Current theme mode */
  theme: ThemeMode;
  /** Function to set the theme */
  setTheme: (theme: ThemeMode) => void;
  /** Whether the current rendered theme is dark */
  isDarkMode: boolean;
  /** Toggle between light and dark theme */
  toggleTheme: () => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Props for the ThemeProvider component
 */
interface ThemeProviderProps {
  /** Initial theme mode */
  defaultTheme?: ThemeMode;
  /** Whether to store theme preference in localStorage */
  storageKey?: string;
  /** Store color scheme in HTML attribute */
  attribute?: string;
  /** Children components */
  children: ReactNode;
}

/**
 * Theme Provider Component
 * 
 * Provides theme functionality to the application
 */
export function ThemeProvider({
  defaultTheme = 'system',
  storageKey = 'theme',
  attribute = 'data-theme',
  children
}: ThemeProviderProps) {
  // State for the theme mode
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // Check if theme is stored in localStorage
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem(storageKey);
      return (storedTheme as ThemeMode) || defaultTheme;
    }
    
    return defaultTheme;
  });
  
  // State for the computed dark mode based on system preference and theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Set the theme in localStorage and attribute
  const setTheme = useCallback((theme: ThemeMode) => {
    setThemeState(theme);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, theme);
    }
  }, [storageKey]);

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  // Effect to apply the theme to the document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme attributes
    root.removeAttribute(attribute);
    
    // Determine if dark mode should be applied
    let computedTheme: string;
    if (theme === 'system') {
      const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      computedTheme = systemDarkMode ? 'dark' : 'light';
      setIsDarkMode(systemDarkMode);
    } else {
      computedTheme = theme;
      setIsDarkMode(theme === 'dark');
    }
    
    // Set the attribute with the computed theme
    root.setAttribute(attribute, computedTheme);
  }, [theme, attribute]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Update dark mode state when system preference changes
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches);
      document.documentElement.setAttribute(
        attribute, 
        event.matches ? 'dark' : 'light'
      );
    };
    
    // Add event listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, attribute]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    isDarkMode,
    toggleTheme
  }), [theme, setTheme, isDarkMode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook for consuming the theme context
 * 
 * @returns Theme context with all theme-related state and functions
 * @throws Error if used outside of ThemeProvider
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

export default ThemeContext;