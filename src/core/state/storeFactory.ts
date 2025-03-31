/**
 * Core Store Factory
 * 
 * Creates Zustand stores with consistent patterns and persistence options.
 * Provides utilities for optimizing component renders with selectors.
 * 
 * This factory was promoted from the exams-preparation feature to core
 * to establish a consistent pattern for state management across features.
 */

import { create, StateCreator, StoreApi, UseBoundStore } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import logger from '../utils/logger';

/**
 * Options for the store creation
 */
export interface StoreOptions<T> {
  /**
   * Whether to persist the store state to local storage
   */
  persist?: boolean;
  
  /**
   * The key to use for localStorage persistence
   */
  storageKey?: string;
  
  /**
   * Function to determine which state to persist
   */
  partialize?: (state: T) => Partial<T>;
  
  /**
   * Function to run when state is rehydrated from localStorage
   */
  onRehydrateStorage?: (state: T | undefined) => ((state?: T) => void) | void;
}

/**
 * Create a store with consistent patterns
 * 
 * @param name Store name (used for debugging and persistence)
 * @param initialState Initial state of the store
 * @param actionsCreator Function that creates the actions for the store
 * @param options Options for the store
 * @returns A Zustand store with state and actions
 */
export function createStore<State, Actions>(
  name: string,
  initialState: State,
  actionsCreator: (
    set: (
      partial: State | Partial<State> | ((state: State) => State | Partial<State>),
      replace?: boolean
    ) => void,
    get: () => State,
    api: StoreApi<State & Actions>
  ) => Actions,
  options?: StoreOptions<State & Actions>
): UseBoundStore<StoreApi<State & Actions>> {
  
  // Define the state creator function
  let stateCreator: StateCreator<State & Actions> = (set, get, api) => ({
    ...initialState,
    ...actionsCreator(set, get, api),
  });
  
  // Add persistence if enabled
  if (options?.persist) {
    const persistOptions: PersistOptions<State & Actions> = {
      name: options.storageKey || `store-${name}`,
      partialize: options.partialize,
      onRehydrateStorage: options.onRehydrateStorage,
    };
    
    stateCreator = persist(stateCreator, persistOptions);
  }
  
  logger.debug(`Creating store: ${name}`);
  
  // Create the store
  return create<State & Actions>(stateCreator);
}

/**
 * Create selectors for a store to optimize renders
 * 
 * @param store The zustand store to create selectors for
 * @returns A function to create selectors
 */
export function createSelectors<TState, TActions>(
  store: UseBoundStore<StoreApi<TState & TActions>>
) {
  return {
    useStore: store,
    
    /**
     * Create a selector for the store to optimize renders
     * Components using this selector will only re-render when the selected value changes
     * 
     * @param selector The selector function
     * @returns A hook that selects the value from the store
     */
    createSelector: <TSelected>(
      selector: (state: TState & TActions) => TSelected
    ) => {
      return () => store(selector);
    },
  };
}

/**
 * Create a store factory for a specific feature
 * This allows customizing the store creation for a specific feature
 * while still following the core pattern
 * 
 * @param featureName The name of the feature
 * @returns A function to create stores for the feature
 */
export function createStoreFactory(featureName: string) {
  return <State, Actions>(
    storeName: string,
    initialState: State,
    actionsCreator: (
      set: (
        partial: State | Partial<State> | ((state: State) => State | Partial<State>),
        replace?: boolean
      ) => void,
      get: () => State,
      api: StoreApi<State & Actions>
    ) => Actions,
    options?: StoreOptions<State & Actions>
  ): UseBoundStore<StoreApi<State & Actions>> => {
    // Prefix the store name with the feature name for better debugging
    const prefixedName = `${featureName}-${storeName}`;
    
    // Create storage key if persisting
    const storageKey = options?.persist 
      ? (options.storageKey || `${featureName}-${storeName}`)
      : undefined;
    
    // Create the store with the modified options
    return createStore<State, Actions>(
      prefixedName,
      initialState,
      actionsCreator,
      {
        ...options,
        storageKey,
      }
    );
  };
}
