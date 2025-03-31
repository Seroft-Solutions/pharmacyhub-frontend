/**
 * Core Context Factory
 * 
 * Creates React context providers with consistent patterns.
 * Provides utilities for optimizing component renders with context.
 * 
 * This factory was promoted from the exams-preparation feature to core
 * to establish a consistent pattern for context management across features.
 */

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import logger from '../utils/logger';

/**
 * Options for context creation
 */
export interface ContextOptions {
  /**
   * Display name for the context (used in React DevTools)
   */
  displayName?: string;
}

/**
 * Creates a context provider with state and actions
 * 
 * @param name Context name (used for error messages and displayName)
 * @param initialState Initial state
 * @param actionsCreator Function that creates the actions
 * @param options Additional options
 * @returns A tuple containing the Provider component and a hook to access the context
 */
export function createContextProvider<State, Actions>(
  name: string,
  initialState: State,
  actionsCreator: (
    setState: React.Dispatch<React.SetStateAction<State>>
  ) => Actions,
  options?: ContextOptions
): [
  React.FC<{ children: ReactNode; initialState?: Partial<State> }>,
  () => State & Actions
] {
  // Log the context creation
  logger.debug(`Creating context: ${name}`);
  
  // Create the context
  const Context = createContext<(State & Actions) | null>(null);
  
  // Set display name if provided
  if (options?.displayName) {
    Context.displayName = options.displayName;
  } else {
    Context.displayName = `${name}Context`;
  }
  
  // Create the provider component
  const Provider: React.FC<{ 
    children: ReactNode; 
    initialState?: Partial<State> 
  }> = ({ 
    children, 
    initialState: customInitialState 
  }) => {
    // Merge custom initial state with default initial state
    const mergedInitialState = {
      ...initialState,
      ...(customInitialState || {}),
    } as State;
    
    // Set up state
    const [state, setState] = useState<State>(mergedInitialState);
    
    // Create actions
    const actions = actionsCreator(setState);
    
    // Combine state and actions
    const contextValue = {
      ...state,
      ...actions,
    };
    
    return (
      <Context.Provider value={contextValue}>
        {children}
      </Context.Provider>
    );
  };
  
  // Create hook to access context
  const useContextHook = () => {
    const contextValue = useContext(Context);
    
    if (contextValue === null) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }
    
    return contextValue;
  };
  
  return [Provider, useContextHook];
}

/**
 * Create a higher-order component that provides a specific context
 * 
 * @param Provider The context provider component
 * @param initialState Optional initial state for the context
 * @returns A HOC that wraps components with the provider
 */
export function withContextProvider<P extends object, S>(
  Provider: React.FC<{ children: ReactNode; initialState?: Partial<S> }>,
  initialState?: Partial<S>
): (Component: React.ComponentType<P>) => React.FC<P> {
  return (Component: React.ComponentType<P>) => {
    const WithProvider: React.FC<P> = (props) => (
      <Provider initialState={initialState}>
        <Component {...props} />
      </Provider>
    );
    
    // Set display name for better debugging
    const componentName = Component.displayName || Component.name || 'Component';
    WithProvider.displayName = `withProvider(${componentName})`;
    
    return WithProvider;
  };
}
