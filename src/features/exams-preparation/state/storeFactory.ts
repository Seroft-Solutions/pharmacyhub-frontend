/**
 * Exams Preparation Feature Store Factory
 * 
 * This factory leverages the core store factory to create feature-specific stores 
 * with consistent patterns and proper integration with core modules. It extends
 * the core functionality with feature-specific enhancements including:
 * 
 * - Enhanced error handling and logging
 * - Debug mode for development
 * - Type-safe action wrappers
 * - Testing utilities
 * - Performance optimization options
 * 
 * By using this factory instead of directly using Zustand or the core factory,
 * we ensure consistency across all stores in the exams-preparation feature
 * and proper integration with the core state management patterns.
 * 
 * @example Basic store creation
 * ```typescript
 * // Create a feature-specific store
 * const useMyStore = createExamsStore<MyState, MyActions>(
 *   'myStore',
 *   initialState,
 *   (set, get) => ({
 *     // actions implementation
 *     increment: () => set(state => ({ count: state.count + 1 })),
 *     decrement: () => set(state => ({ count: state.count - 1 })),
 *     reset: () => set({ count: 0 }),
 *   })
 * );
 * ```
 * 
 * @example With persistence
 * ```typescript
 * // Create a store with persistence
 * const useMyPersistentStore = createExamsStore<MyState, MyActions>(
 *   'myPersistentStore',
 *   initialState,
 *   (set, get) => ({
 *     // actions implementation
 *   }),
 *   {
 *     persist: true,
 *     partialize: (state) => ({
 *       // Only persist these parts of the state
 *       count: state.count,
 *       // Exclude sensitive or transient data
 *     }),
 *   }
 * );
 * ```
 * 
 * @example With selectors
 * ```typescript
 * // Create a store with optimized selectors
 * const useMyStore = createExamsStore<MyState, MyActions>(
 *   'myStore',
 *   initialState,
 *   (set, get) => ({
 *     // actions implementation
 *   })
 * );
 * 
 * // Create selectors for optimized rerenders
 * const { createSelector } = createSelectors(useMyStore);
 * export const useCount = createSelector(state => state.count);
 * export const useDoubleCount = createSelector(state => state.count * 2);
 * ```
 * 
 * @example With debug mode
 * ```typescript
 * // Create a store with debug mode
 * const useMyStore = createExamsStore<MyState, MyActions>(
 *   'myStore',
 *   initialState,
 *   (set, get) => ({
 *     // actions implementation
 *   }),
 *   {
 *     debug: true, // Enable detailed logging (development only)
 *   }
 * );
 * ```
 */

import { createStoreFactory, createSelectors as createCoreSelectors, StoreOptions as CoreStoreOptions } from '@/core/state';
import logger from '@/core/utils/logger';
import { StateCreator, StoreApi, UseBoundStore } from 'zustand';

// Define the feature name as a constant to ensure consistency
export const FEATURE_NAME = 'exams-preparation';

/**
 * Extended store options for exams-preparation feature
 * Adds feature-specific options on top of core options
 */
export interface ExamsStoreOptions<T> extends CoreStoreOptions<T> {
  /**
   * Enable detailed debug logging (recommended for development only)
   * This logs all state changes, action calls, and errors in detail
   */
  debug?: boolean;
  
  /**
   * Custom error handler for store actions
   * This allows custom error handling strategy per store
   * 
   * @example
   * ```typescript
   * errorHandler: (error, actionName, storeName) => {
   *   // Custom error handling logic
   *   customErrorService.report(error);
   * }
   * ```
   */
  errorHandler?: (error: unknown, actionName: string, storeName: string) => void;
  
  /**
   * Function to run before each action
   * Useful for tracking or middleware
   */
  beforeAction?: (actionName: string, args: unknown[]) => void;
  
  /**
   * Function to run after each action
   * Useful for tracking or side effects
   */
  afterAction?: (actionName: string, args: unknown[], result: unknown) => void;
  
  /**
   * Enable performance tracking for actions
   * Logs execution time of actions for performance analysis
   */
  trackPerformance?: boolean;
}

/**
 * Store creation error types
 */
export enum StoreErrorType {
  CREATION_FAILED = 'STORE_CREATION_FAILED',
  ACTION_FAILED = 'STORE_ACTION_FAILED',
  PERSISTENCE_FAILED = 'STORE_PERSISTENCE_FAILED',
  REHYDRATION_FAILED = 'STORE_REHYDRATION_FAILED',
}

/**
 * Custom error class for store-related errors
 */
export class StoreError extends Error {
  type: StoreErrorType;
  storeName: string;
  actionName?: string;
  originalError?: unknown;
  
  constructor(
    message: string, 
    type: StoreErrorType, 
    storeName: string, 
    actionName?: string,
    originalError?: unknown
  ) {
    super(message);
    this.name = 'StoreError';
    this.type = type;
    this.storeName = storeName;
    this.actionName = actionName;
    this.originalError = originalError;
  }
}

/**
 * Feature-specific store factory that leverages core store factory
 * This ensures consistent patterns and proper integration with core
 * 
 * @template State - The state interface for the store
 * @template Actions - The actions interface for the store
 * @param storeName - The name of the store (used for debugging and storage key)
 * @param initialState - The initial state for the store
 * @param actionsCreator - A function that creates the actions for the store
 * @param options - Optional configuration for the store
 * @returns A Zustand store with state and actions
 * 
 * @throws {StoreError} If store creation fails
 */
export const createExamsStore = <State, Actions>(
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
  options?: ExamsStoreOptions<State & Actions>
): UseBoundStore<StoreApi<State & Actions>> => {
  // Log store creation for debugging
  const isDebug = options?.debug === true;
  const logLevel = isDebug ? 'debug' : 'info';
  
  logger[logLevel](`Creating ${FEATURE_NAME} store: ${storeName}`);
  
  try {
    // Create custom actions that include logging, error handling, and performance tracking
    const wrappedActionsCreator: typeof actionsCreator = (set, get, api) => {
      // Get the original actions
      const actions = actionsCreator(set, get, api);
      
      // Create a proxy to wrap all actions with enhanced functionality
      return new Proxy(actions, {
        get(target, prop) {
          const origMethod = target[prop as keyof typeof target];
          const actionName = String(prop);
          
          // If the property is a function, wrap it with enhanced functionality
          if (typeof origMethod === 'function') {
            return function(...args: unknown[]) {
              // Run before action hook if provided
              if (options?.beforeAction) {
                try {
                  options.beforeAction(actionName, args);
                } catch (hookError) {
                  logger.warn(`Error in beforeAction hook for ${FEATURE_NAME}.${storeName}.${actionName}:`, hookError);
                }
              }
              
              // Track performance if enabled
              const startTime = options?.trackPerformance ? performance.now() : 0;
              
              // Detailed debug logging for the action call
              if (isDebug) {
                logger.debug(`${FEATURE_NAME}.${storeName}.${actionName} called`, { 
                  args,
                  state: get()
                });
              }
              
              try {
                // Execute the original method
                const result = (origMethod as Function).apply(this, args);
                
                // Log performance metrics if tracking is enabled
                if (options?.trackPerformance) {
                  const duration = performance.now() - startTime;
                  logger.debug(`${FEATURE_NAME}.${storeName}.${actionName} completed in ${duration.toFixed(2)}ms`);
                }
                
                // Run after action hook if provided
                if (options?.afterAction) {
                  try {
                    options.afterAction(actionName, args, result);
                  } catch (hookError) {
                    logger.warn(`Error in afterAction hook for ${FEATURE_NAME}.${storeName}.${actionName}:`, hookError);
                  }
                }
                
                return result;
              } catch (error) {
                // Create a store error with detailed context
                const storeError = new StoreError(
                  `Error executing action ${actionName} in store ${storeName}: ${error}`,
                  StoreErrorType.ACTION_FAILED,
                  storeName,
                  actionName,
                  error
                );
                
                // Log the error
                logger.error(`${FEATURE_NAME}.${storeName}.${actionName} failed:`, storeError);
                
                // Use custom error handler if provided
                if (options?.errorHandler) {
                  try {
                    options.errorHandler(error, actionName, storeName);
                  } catch (handlerError) {
                    logger.error(`Error handler for ${FEATURE_NAME}.${storeName}.${actionName} failed:`, handlerError);
                  }
                }
                
                // Rethrow the error
                throw storeError;
              }
            };
          }
          
          return origMethod;
        }
      }) as Actions;
    };
    
    // Get the store factory from core
    const storeFactory = createStoreFactory(FEATURE_NAME);
    
    // Create the store with the wrapped actions
    return storeFactory<State, Actions>(
      storeName,
      initialState,
      wrappedActionsCreator,
      {
        ...options,
        // Add onRehydrateStorage handler if not provided
        onRehydrateStorage: options?.onRehydrateStorage || ((state) => {
          return (rehydratedState, error) => {
            if (error) {
              const storeError = new StoreError(
                `Error rehydrating ${FEATURE_NAME}.${storeName} store: ${error}`,
                StoreErrorType.REHYDRATION_FAILED,
                storeName,
                undefined,
                error
              );
              
              logger.error(`Error rehydrating ${FEATURE_NAME}.${storeName} store:`, storeError);
              
              // Use custom error handler if provided
              if (options?.errorHandler) {
                try {
                  options.errorHandler(error, 'rehydrate', storeName);
                } catch (handlerError) {
                  logger.error(`Error handler for ${FEATURE_NAME}.${storeName} rehydration failed:`, handlerError);
                }
              }
            } else if (isDebug) {
              logger.debug(`${FEATURE_NAME}.${storeName} store rehydrated:`, { 
                stateKeys: rehydratedState ? Object.keys(rehydratedState) : null 
              });
            }
          };
        }),
      }
    );
  } catch (error) {
    // Create a store error with detailed context
    const storeError = new StoreError(
      `Failed to create ${FEATURE_NAME}.${storeName} store: ${error}`,
      StoreErrorType.CREATION_FAILED,
      storeName,
      undefined,
      error
    );
    
    logger.error(storeError.message, storeError);
    
    // Use custom error handler if provided
    if (options?.errorHandler) {
      try {
        options.errorHandler(error, 'creation', storeName);
      } catch (handlerError) {
        logger.error(`Error handler for ${FEATURE_NAME}.${storeName} creation failed:`, handlerError);
      }
    }
    
    throw storeError;
  }
};

// Re-export core types
export type { CoreStoreOptions as StoreOptions };

/**
 * Type utility for extracting the state type from a store
 * 
 * @template T - The store type
 * @example
 * ```typescript
 * const useMyStore = createExamsStore<MyState, MyActions>(...);
 * type MyStoreState = ExtractState<typeof useMyStore>; // MyState & MyActions
 * ```
 */
export type ExtractState<T> = T extends UseBoundStore<StoreApi<infer S>> ? S : never;

/**
 * Type utility for extracting only the state portion (not actions) from a store
 * 
 * @template T - The store type
 * @template S - The state interface
 */
export type ExtractStateOnly<T, S> = T extends UseBoundStore<StoreApi<S & infer A>> ? S : never;

/**
 * Type utility for extracting only the actions portion from a store
 * 
 * @template T - The store type
 * @template A - The actions interface
 */
export type ExtractActions<T, A> = T extends UseBoundStore<StoreApi<infer S & A>> ? A : never;

/**
 * Create selectors for a store with enhanced error handling
 * This is a wrapper around the core createSelectors with additional error handling
 * 
 * @template TState - The state interface
 * @template TActions - The actions interface
 * @param store - The Zustand store to create selectors for
 * @returns An object with the store and a createSelector function
 */
export function createExamsSelectors<TState, TActions>(
  store: UseBoundStore<StoreApi<TState & TActions>>
) {
  const { useStore, createSelector } = createCoreSelectors<TState, TActions>(store);
  
  // Create an enhanced selector creator with error handling
  const createSafeSelector = <TSelected>(
    selector: (state: TState & TActions) => TSelected
  ) => {
    // Create the core selector
    const originalSelector = createSelector(selector);
    
    // Return a wrapped selector with error handling
    return () => {
      try {
        return originalSelector();
      } catch (error) {
        logger.error(`Error in selector for ${FEATURE_NAME} store:`, error);
        throw error;
      }
    };
  };
  
  return {
    useStore,
    createSelector: createSafeSelector
  };
}

/**
 * Creates a store for testing purposes with additional testing utilities
 * This makes it easier to test components that use stores
 * 
 * @template State - The state interface
 * @template Actions - The actions interface
 * @param initialState - The initial state for the test store
 * @param actionsOverrides - Optional overrides for actions (mocks)
 * @returns A test store with utilities for testing
 * 
 * @example
 * ```typescript
 * // In a test file
 * const testStore = createTestStore<MyState, MyActions>(
 *   { count: 0 },
 *   {
 *     increment: jest.fn(),
 *     decrement: jest.fn(),
 *   }
 * );
 * 
 * // Use in tests
 * test('component uses store correctly', () => {
 *   render(<MyComponent />);
 *   expect(screen.getByText('0')).toBeInTheDocument();
 *   
 *   // Simulate state change
 *   testStore.setState({ count: 5 });
 *   expect(screen.getByText('5')).toBeInTheDocument();
 *   
 *   // Verify action was called
 *   fireEvent.click(screen.getByText('Increment'));
 *   expect(testStore.getActionMock('increment')).toHaveBeenCalled();
 * });
 * ```
 */
export function createTestStore<State, Actions>(
  initialState: State,
  actionsOverrides?: Partial<Actions>
) {
  // Create a temporary store name for testing
  const testStoreName = `test-store-${Date.now()}`;
  
  // Create mock actions as needed
  const mockActions = {} as Actions;
  
  // Create the store
  const store = createExamsStore<State, Actions>(
    testStoreName,
    initialState,
    (set, get) => ({
      ...mockActions,
      ...(actionsOverrides || {})
    }),
    {
      // Disable persistence for tests
      persist: false,
      // Enable debug mode for tests
      debug: false,
    }
  );
  
  // Add testing utilities
  return {
    // Original store
    useStore: store,
    
    // Get current state
    getState: () => store.getState() as State & Actions,
    
    // Set state directly (for testing)
    setState: (state: Partial<State>) => {
      store.setState(state);
    },
    
    // Reset to initial state
    resetState: () => {
      store.setState(initialState, true);
    },
    
    // Get a specific action mock
    getActionMock: <K extends keyof Actions>(
      actionName: K
    ): Actions[K] => {
      return store.getState()[actionName];
    },
    
    // Clean up the store (for use in afterEach)
    cleanup: () => {
      store.destroy?.();
    }
  };
}
