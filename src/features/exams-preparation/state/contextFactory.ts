/**
 * Factory for creating consistent React context providers
 * 
 * Note: This is a candidate for promotion to core in the future.
 * As patterns prove useful, they can be moved to core for wider use.
 */

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

/**
 * Options for context creation
 */
export interface ContextOptions {
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
