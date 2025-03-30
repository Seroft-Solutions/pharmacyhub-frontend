/**
 * Store factory to create Zustand stores with consistent patterns
 * 
 * Note: This is a candidate for promotion to core in the future.
 * As patterns prove useful, they can be moved to core for wider use.
 */

import { create, StateCreator, StoreApi, UseBoundStore } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

/**
 * Options for the store creation
 */
export interface StoreOptions<T> {
  persist?: boolean;
  storageKey?: string;
  partialize?: (state: T) => Partial<T>;
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
      name: `exams-prep-${name}`,
      partialize: options.partialize,
      onRehydrateStorage: options.onRehydrateStorage,
    };
    
    stateCreator = persist(stateCreator, persistOptions);
  }
  
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
