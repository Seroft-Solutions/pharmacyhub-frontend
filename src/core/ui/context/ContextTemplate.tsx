"use client";

/**
 * Context Template
 * 
 * This file serves as a template for creating new React contexts.
 * Follow this pattern when creating new contexts for simple UI state.
 * 
 * Instructions:
 * 1. Copy this file and rename it to match your context (e.g., MyFeatureContext.tsx)
 * 2. Replace "ContextTemplate" with your context name
 * 3. Define the state and methods in the context interface
 * 4. Implement the provider component
 * 5. Implement the hook for consuming the context
 */
import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';

/**
 * Context interface
 * 
 * Define the state and methods that will be available through the context.
 */
interface ContextTemplateType {
  /** Example state */
  value: string;
  /** Example method to update state */
  setValue: (value: string) => void;
  /** Example complex method */
  resetValue: () => void;
}

// Create the context with undefined as default
// This ensures that components using the context outside of the provider
// will get a clear error rather than using a default value incorrectly
const ContextTemplate = createContext<ContextTemplateType | undefined>(undefined);

/**
 * Props for the provider component
 */
interface ContextTemplateProviderProps {
  /** Optional initial value */
  initialValue?: string;
  /** Children components */
  children: ReactNode;
}

/**
 * Provider Component
 * 
 * Provides the context to its children components.
 */
export function ContextTemplateProvider({
  initialValue = '',
  children
}: ContextTemplateProviderProps) {
  // State management
  const [value, setValueState] = useState<string>(initialValue);

  // Methods
  // Wrap method in useCallback to prevent unnecessary re-renders
  const setValue = useCallback((newValue: string) => {
    setValueState(newValue);
  }, []);

  const resetValue = useCallback(() => {
    setValueState(initialValue);
  }, [initialValue]);

  // Memoize the context value to prevent unnecessary re-renders
  // Only re-create the value when the dependencies change
  const contextValue = useMemo(() => ({
    value,
    setValue,
    resetValue
  }), [value, setValue, resetValue]);

  return (
    <ContextTemplate.Provider value={contextValue}>
      {children}
    </ContextTemplate.Provider>
  );
}

/**
 * Hook for consuming the context
 * 
 * @returns Context value with state and methods
 * @throws Error if used outside of the provider
 */
export function useContextTemplate(): ContextTemplateType {
  const context = useContext(ContextTemplate);
  
  if (context === undefined) {
    throw new Error('useContextTemplate must be used within a ContextTemplateProvider');
  }
  
  return context;
}

export default ContextTemplate;