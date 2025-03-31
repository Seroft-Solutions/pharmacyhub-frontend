/**
 * Exams Preparation Feature Context Factory
 * 
 * This factory leverages the core context factory to create feature-specific contexts
 * with consistent patterns, enhanced error handling, and proper integration with core modules.
 * It provides a robust foundation for React context-based state management with advanced features:
 * 
 * - Feature-specific naming and error handling
 * - Comprehensive error boundaries and recovery
 * - Performance optimization with memoization
 * - Detailed logging and debugging tools
 * - TypeScript type safety with utility types
 * - Testing utilities for easier context testing
 * - React DevTools integration for better debugging
 * 
 * @example Basic context creation
 * ```tsx
 * // Create a feature-specific context
 * const [MyProvider, useMyContext] = createExamsContext<MyState, MyActions>(
 *   'MyContext',
 *   initialState,
 *   (setState) => ({
 *     // actions implementation
 *     setValue: (value) => setState({ value }),
 *     reset: () => setState(initialState),
 *   })
 * );
 * 
 * // Use the context in components
 * function MyComponent() {
 *   const { value, setValue } = useMyContext();
 *   return (
 *     <div>
 *       <p>Value: {value}</p>
 *       <button onClick={() => setValue('new value')}>Update</button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example With HOC and advanced options
 * ```tsx
 * // Create context with advanced options
 * const [MyProvider, useMyContext] = createExamsContext<MyState, MyActions>(
 *   'MyContext',
 *   initialState,
 *   (setState) => ({
 *     // actions implementation
 *   }),
 *   {
 *     displayName: 'MyFeatureContext',
 *     debug: true,
 *     errorBoundary: true,
 *     memoize: true,
 *     devTools: true,
 *   }
 * );
 * 
 * // Create a HOC for easier usage
 * const withMyContext = withExamsContext(MyProvider);
 * 
 * // Wrap a component with the HOC
 * const EnhancedComponent = withMyContext(MyComponent);
 * ```
 * 
 * @example With performance optimization
 * ```tsx
 * // Create context
 * const [MyProvider, useMyContext, createSelector] = createExamsContext<MyState, MyActions>(
 *   'MyContext',
 *   initialState,
 *   actionsCreator,
 *   { memoize: true }
 * );
 * 
 * // Create optimized selectors
 * const useValue = createSelector(state => state.value);
 * const useIsLoading = createSelector(state => state.isLoading);
 * 
 * // Use selectors in components for optimized renders
 * function OptimizedComponent() {
 *   const value = useValue();
 *   // Only rerenders when value changes
 *   return <div>{value}</div>;
 * }
 * ```
 * 
 * @example With testing utilities
 * ```tsx
 * // In your test file
 * const testContext = createTestProvider<MyState, MyActions>(
 *   initialState,
 *   {
 *     setValue: jest.fn(),
 *     reset: jest.fn(),
 *   }
 * );
 * 
 * test('Component uses context correctly', () => {
 *   render(
 *     <testContext.Provider>
 *       <MyComponent />
 *     </testContext.Provider>
 *   );
 *   
 *   // Test component behavior
 *   fireEvent.click(screen.getByText('Update'));
 *   expect(testContext.getActionMock('setValue')).toHaveBeenCalled();
 *   
 *   // Update context state for testing
 *   testContext.setState({ value: 'updated' });
 *   expect(screen.getByText('Value: updated')).toBeInTheDocument();
 * });
 * ```
 */

import React, { 
  ReactNode, 
  useCallback, 
  useState as useReactState, 
  useMemo, 
  useRef, 
  useEffect,
  useLayoutEffect,
  memo,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  ComponentType,
  ErrorInfo
} from 'react';
import { 
  createContextProvider as createCoreContextProvider, 
  withContextProvider as withCoreContextProvider, 
  ContextOptions as CoreContextOptions 
} from '@/core/state';
import logger from '@/core/utils/logger';

// Define the feature name as a constant to ensure consistency
export const FEATURE_NAME = 'exams-preparation';

/**
 * Logging levels for context operations
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  NONE = 'none',
}

/**
 * Context error types
 */
export enum ContextErrorType {
  CREATION_FAILED = 'CONTEXT_CREATION_FAILED',
  PROVIDER_RENDER_FAILED = 'PROVIDER_RENDER_FAILED',
  ACTION_FAILED = 'CONTEXT_ACTION_FAILED',
  HOOK_USAGE_FAILED = 'CONTEXT_HOOK_USAGE_FAILED',
  SELECTOR_FAILED = 'CONTEXT_SELECTOR_FAILED',
}

/**
 * Custom error class for context-related errors
 */
export class ContextError extends Error {
  type: ContextErrorType;
  contextName: string;
  actionName?: string;
  originalError?: unknown;
  
  constructor(
    message: string, 
    type: ContextErrorType, 
    contextName: string, 
    actionName?: string,
    originalError?: unknown
  ) {
    super(message);
    this.name = 'ContextError';
    this.type = type;
    this.contextName = contextName;
    this.actionName = actionName;
    this.originalError = originalError;
  }
}

/**
 * Extended context options with additional feature-specific options
 */
export interface ExamsContextOptions extends CoreContextOptions {
  /**
   * Enable debug logging for the context (default: false)
   */
  debug?: boolean;
  
  /**
   * Enable memoization of the context value (default: true)
   */
  memoize?: boolean;
  
  /**
   * Enable error boundary around provider (default: false)
   */
  errorBoundary?: boolean;
  
  /**
   * Enable React DevTools integration (default: true)
   */
  devTools?: boolean;
  
  /**
   * Set logging level (default: 'info')
   */
  logLevel?: LogLevel;
  
  /**
   * Custom error handler for context errors
   * 
   * @example
   * ```tsx
   * errorHandler: (error, errorType, contextName, actionName) => {
   *   // Custom error handling logic
   *   errorReportingService.report(error);
   * }
   * ```
   */
  errorHandler?: (
    error: unknown, 
    errorType: ContextErrorType, 
    contextName: string, 
    actionName?: string
  ) => void;
  
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
   * Enable performance tracking for actions (default: false)
   */
  trackPerformance?: boolean;
}

/**
 * Error boundary component for context providers
 */
class ContextErrorBoundary extends React.Component<{
  children: ReactNode;
  contextName: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  fallback?: ReactNode;
}> {
  state = { hasError: false, error: null as Error | null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    logger.error(`Error in ${this.props.contextName} boundary:`, error);
    
    // Call onError if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  
  render() {
    if (this.state.hasError) {
      // Return fallback if provided, otherwise just the children
      return this.props.fallback || this.props.children;
    }
    
    return this.props.children;
  }
}

/**
 * Type for context selector hook
 */
export type SelectorHook<T, R> = () => R;

/**
 * Creates a context provider with state and actions for the exams preparation feature
 * 
 * Enhances the core context factory with:
 * - Feature-specific naming
 * - Advanced error handling
 * - Detailed logging
 * - Action wrapping for debugging
 * - Performance optimization
 * - Testing utilities
 * 
 * @param name Context name (used for error messages and displayName)
 * @param initialState Initial state
 * @param actionsCreator Function that creates the actions
 * @param options Additional options
 * @returns A tuple containing the Provider component, hook to access the context, and optional selector creator
 */
export function createExamsContext<State, Actions>(
  name: string,
  initialState: State,
  actionsCreator: (
    setState: Dispatch<SetStateAction<State>>
  ) => Actions,
  options?: ExamsContextOptions
): [
  React.FC<{ children: ReactNode; initialState?: Partial<State> }>,
  () => State & Actions,
  <Selected>(selector: (state: State & Actions) => Selected) => () => Selected
] {
  // Generate the full context name with feature prefix
  const fullName = `${FEATURE_NAME}.${name}`;
  
  // Default options
  const defaultOptions: Required<ExamsContextOptions> = {
    displayName: `${FEATURE_NAME}.${name}Context`,
    debug: false,
    memoize: true,
    errorBoundary: false,
    devTools: true,
    logLevel: LogLevel.INFO,
    trackPerformance: false,
    beforeAction: () => {},
    afterAction: () => {},
    errorHandler: () => {},
  };
  
  // Merge options with defaults
  const mergedOptions: Required<ExamsContextOptions> = {
    ...defaultOptions,
    ...(options || {}),
  };
  
  // Determine log level function based on options
  const log = (level: LogLevel, message: string, data?: unknown) => {
    const logLevels = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3,
      [LogLevel.NONE]: 4,
    };
    
    if (logLevels[level] >= logLevels[mergedOptions.logLevel]) {
      logger[level](`${fullName}: ${message}`, data);
    }
  };
  
  // Log context creation
  log(LogLevel.DEBUG, 'Creating context');
  
  try {
    // Create internal context for selectors
    const InternalContext = createContext<State & Actions | null>(null);
    
    // For use by selectors
    const SelectorContext = InternalContext;
    
    // Create a wrapped actions creator with error handling and logging
    const wrappedActionsCreator = (setState: Dispatch<SetStateAction<State>>) => {
      // Create the original actions
      const actions = actionsCreator(setState);
      
      // Create a proxy to wrap all actions with enhanced functionality
      return new Proxy(actions, {
        get(target, prop) {
          const origMethod = target[prop as keyof typeof target];
          const actionName = String(prop);
          
          // If the property is a function, wrap it with enhanced functionality
          if (typeof origMethod === 'function') {
            return function(...args: unknown[]) {
              // Run before action hook if provided
              try {
                mergedOptions.beforeAction(actionName, args);
              } catch (hookError) {
                log(LogLevel.WARN, `Error in beforeAction hook for ${actionName}:`, hookError);
              }
              
              // Track performance if enabled
              const startTime = mergedOptions.trackPerformance ? performance.now() : 0;
              
              // Log action call
              log(LogLevel.DEBUG, `Action ${actionName} called`, { args });
              
              try {
                // Execute the original method
                const result = (origMethod as Function).apply(this, args);
                
                // Log performance metrics if tracking is enabled
                if (mergedOptions.trackPerformance) {
                  const duration = performance.now() - startTime;
                  log(LogLevel.DEBUG, `Action ${actionName} completed in ${duration.toFixed(2)}ms`);
                }
                
                // Run after action hook if provided
                try {
                  mergedOptions.afterAction(actionName, args, result);
                } catch (hookError) {
                  log(LogLevel.WARN, `Error in afterAction hook for ${actionName}:`, hookError);
                }
                
                return result;
              } catch (error) {
                // Create a context error with detailed information
                const contextError = new ContextError(
                  `Error executing action ${actionName} in context ${name}: ${error}`,
                  ContextErrorType.ACTION_FAILED,
                  fullName,
                  actionName,
                  error
                );
                
                // Log the error
                log(LogLevel.ERROR, `Action ${actionName} failed:`, contextError);
                
                // Call custom error handler if provided
                try {
                  mergedOptions.errorHandler(error, ContextErrorType.ACTION_FAILED, fullName, actionName);
                } catch (handlerError) {
                  log(LogLevel.ERROR, `Error handler for ${actionName} failed:`, handlerError);
                }
                
                // Rethrow the wrapped error
                throw contextError;
              }
            };
          }
          
          return origMethod;
        }
      }) as Actions;
    };
    
    // Use the core context factory to create the context
    const [CoreProvider, useCoreContextHook] = createCoreContextProvider<State, Actions>(
      name,
      initialState,
      wrappedActionsCreator,
      {
        displayName: mergedOptions.displayName,
      }
    );
    
    // Create a wrapper component to provide both contexts
    const WrappedProvider: React.FC<{ 
      children: ReactNode; 
      initialState?: Partial<State> 
    }> = ({ 
      children, 
      initialState: customInitialState 
    }) => {
      // Function to handle errors in provider rendering
      const handleError = (error: unknown) => {
        const contextError = new ContextError(
          `Error rendering ${fullName} provider: ${error}`,
          ContextErrorType.PROVIDER_RENDER_FAILED,
          fullName,
          undefined,
          error
        );
        
        log(LogLevel.ERROR, `Provider render failed:`, contextError);
        
        // Call custom error handler if provided
        try {
          mergedOptions.errorHandler(
            error, 
            ContextErrorType.PROVIDER_RENDER_FAILED, 
            fullName
          );
        } catch (handlerError) {
          log(LogLevel.ERROR, `Error handler for provider render failed:`, handlerError);
        }
        
        return contextError;
      };
      
      // The actual provider rendering with error handling
      const renderProvider = () => {
        try {
          return (
            <CoreProvider initialState={customInitialState}>
              <ProviderContent />
            </CoreProvider>
          );
        } catch (error) {
          handleError(error);
          // Fallback with just the children to prevent full UI breakdown
          return <>{children}</>;
        }
      };
      
      // Content component to use the core context and provide it to selectors
      const ProviderContent = () => {
        // Get the context value from the core provider
        const contextValue = useCoreContextHook();
        
        // Optimization: memoize context value if enabled
        const memoizedValue = mergedOptions.memoize
          ? useMemo(() => contextValue, [contextValue])
          : contextValue;
        
        // Provide the context value to selectors
        return (
          <InternalContext.Provider value={memoizedValue}>
            {children}
          </InternalContext.Provider>
        );
      };
      
      // Render with or without error boundary based on options
      if (mergedOptions.errorBoundary) {
        return (
          <ContextErrorBoundary 
            contextName={fullName} 
            onError={(error) => {
              try {
                mergedOptions.errorHandler(
                  error, 
                  ContextErrorType.PROVIDER_RENDER_FAILED, 
                  fullName
                );
              } catch (handlerError) {
                log(LogLevel.ERROR, `Error handler for boundary failed:`, handlerError);
              }
            }}
            fallback={<>{children}</>}
          >
            {renderProvider()}
          </ContextErrorBoundary>
        );
      }
      
      return renderProvider();
    };
    
    // Optimize provider with memo if memoization is enabled
    const MemoizedProvider = mergedOptions.memoize 
      ? memo(WrappedProvider)
      : WrappedProvider;
    
    // Set displayName for DevTools
    MemoizedProvider.displayName = `${FEATURE_NAME}.${name}Provider`;
    
    // Create a wrapped hook with enhanced error handling
    const wrappedUseContextHook = () => {
      try {
        const contextValue = useCoreContextHook();
        
        // DEV environment: add some debug properties if devTools enabled
        if (process.env.NODE_ENV !== 'production' && mergedOptions.devTools) {
          // Add properties only visible in React DevTools
          Object.defineProperties(contextValue, {
            // Add a property that will show up in DevTools when inspecting
            __EXAMS_CONTEXT_DEBUG: {
              value: {
                name: fullName,
                options: mergedOptions,
                initialState,
              },
              enumerable: false,
            },
          });
        }
        
        return contextValue;
      } catch (error) {
        // Create a context error with detailed information
        const contextError = new ContextError(
          `Error using ${fullName} context: ${error}`,
          ContextErrorType.HOOK_USAGE_FAILED,
          fullName,
          undefined,
          error
        );
        
        log(LogLevel.ERROR, `Hook usage failed:`, contextError);
        
        // Call custom error handler if provided
        try {
          mergedOptions.errorHandler(
            error, 
            ContextErrorType.HOOK_USAGE_FAILED, 
            fullName
          );
        } catch (handlerError) {
          log(LogLevel.ERROR, `Error handler for hook usage failed:`, handlerError);
        }
        
        // Provide more helpful error message
        throw new ContextError(
          `Failed to use ${fullName} context. Make sure the component is wrapped with ${name}Provider`,
          ContextErrorType.HOOK_USAGE_FAILED,
          fullName,
          undefined,
          error
        );
      }
    };
    
    // Create a selector creator function
    const createSelector = <Selected,>(
      selector: (state: State & Actions) => Selected
    ): SelectorHook<State & Actions, Selected> => {
      // Return a custom hook that uses the selector
      return () => {
        // Get context value from internal context
        const contextValue = useContext(SelectorContext);
        
        // Check if context value exists
        if (contextValue === null) {
          throw new ContextError(
            `Cannot use selector for ${fullName} context. Make sure the component is wrapped with ${name}Provider`,
            ContextErrorType.SELECTOR_FAILED,
            fullName
          );
        }
        
        try {
          // Apply selector to context value
          return selector(contextValue);
        } catch (error) {
          // Create a context error with detailed information
          const contextError = new ContextError(
            `Error in selector for ${fullName} context: ${error}`,
            ContextErrorType.SELECTOR_FAILED,
            fullName,
            undefined,
            error
          );
          
          log(LogLevel.ERROR, `Selector failed:`, contextError);
          
          // Call custom error handler if provided
          try {
            mergedOptions.errorHandler(
              error, 
              ContextErrorType.SELECTOR_FAILED, 
              fullName
            );
          } catch (handlerError) {
            log(LogLevel.ERROR, `Error handler for selector failed:`, handlerError);
          }
          
          // Rethrow the wrapped error
          throw contextError;
        }
      };
    };
    
    return [MemoizedProvider, wrappedUseContextHook, createSelector];
  } catch (error) {
    // Create a context error with detailed information
    const contextError = new ContextError(
      `Failed to create ${fullName} context: ${error}`,
      ContextErrorType.CREATION_FAILED,
      fullName,
      undefined,
      error
    );
    
    log(LogLevel.ERROR, `Context creation failed:`, contextError);
    
    // Call custom error handler if provided
    try {
      if (options?.errorHandler) {
        options.errorHandler(
          error, 
          ContextErrorType.CREATION_FAILED, 
          fullName
        );
      }
    } catch (handlerError) {
      log(LogLevel.ERROR, `Error handler for context creation failed:`, handlerError);
    }
    
    // Rethrow the wrapped error
    throw contextError;
  }
}

/**
 * Type for components that can receive initialState
 */
export type ProviderComponent<S> = React.FC<{
  children: ReactNode;
  initialState?: Partial<S>;
}>;

/**
 * Creates a higher-order component that provides a specific exams preparation context
 * 
 * Enhances the core HOC with:
 * - Better error handling
 * - Performance optimization
 * - Improved type safety
 * 
 * @param Provider The context provider component
 * @param initialState Optional initial state for the context
 * @returns A HOC that wraps components with the provider
 */
export function withExamsContext<P extends object, S>(
  Provider: ProviderComponent<S>,
  initialState?: Partial<S>
): <C extends ComponentType<P>>(Component: C) => React.FC<P & { providerProps?: { initialState?: Partial<S> } }> {
  // Use the core withContextProvider utility as a base
  const baseHoc = withCoreContextProvider<P, S>(Provider, initialState);
  
  // Return an enhanced HOC with better error handling and typing
  return <C extends ComponentType<P>>(Component: C) => {
    // Get the base wrapped component
    const BaseWrapped = baseHoc(Component);
    
    // Create an enhanced component with error handling
    const EnhancedComponent: React.FC<P & { providerProps?: { initialState?: Partial<S> } }> = (props) => {
      // Extract provider props if provided
      const { providerProps, ...componentProps } = props;
      const finalInitialState = providerProps?.initialState || initialState;
      
      try {
        return (
          <Provider initialState={finalInitialState}>
            <Component {...(componentProps as P)} />
          </Provider>
        );
      } catch (error) {
        logger.error(`Error in HOC for ${Component.displayName || Component.name || 'Component'}:`, error);
        // Render the original component without the provider as a fallback
        return <Component {...(componentProps as P)} />;
      }
    };
    
    // Set a better display name
    EnhancedComponent.displayName = `withExamsContext(${Component.displayName || Component.name || 'Component'})`;
    
    // Add Developer Tools properties in development
    if (process.env.NODE_ENV !== 'production') {
      // Add property for React DevTools
      Object.defineProperty(EnhancedComponent, '__EXAMS_HOC_INFO', {
        value: {
          wrappedComponent: Component,
          providerComponent: Provider,
          initialState,
        },
        enumerable: false,
      });
    }
    
    // Return the enhanced component
    return memo(EnhancedComponent);
  };
}

/**
 * Creates a test provider for easier testing of components that use context
 * 
 * @param initialState Initial state for testing
 * @param actionMocks Mock implementations for actions
 * @returns Testing utilities for the context
 * 
 * @example
 * ```tsx
 * // In a test file
 * const testContext = createTestProvider<MyState, MyActions>(
 *   { value: 'test' },
 *   {
 *     setValue: jest.fn(),
 *     reset: jest.fn(),
 *   }
 * );
 * 
 * test('Component uses context correctly', () => {
 *   render(
 *     <testContext.Provider>
 *       <MyComponent />
 *     </testContext.Provider>
 *   );
 *   
 *   // Test component behavior
 *   fireEvent.click(screen.getByText('Button'));
 *   expect(testContext.getActionMock('setValue')).toHaveBeenCalled();
 * });
 * ```
 */
export function createTestProvider<State, Actions>(
  initialState: State,
  actionMocks?: Partial<Actions>
) {
  // Create a context for the test provider
  const TestContext = createContext<State & Actions | null>(null);
  
  // Create state holder
  const stateRef = {
    current: {
      ...initialState,
      ...actionMocks,
    } as State & Actions,
  };
  
  // Create a provider component for testing
  const TestProvider: React.FC<{ children: ReactNode; initialState?: Partial<State> }> = ({
    children,
    initialState: customInitialState,
  }) => {
    // Update state with custom initial state if provided
    if (customInitialState) {
      stateRef.current = {
        ...stateRef.current,
        ...customInitialState,
      };
    }
    
    return (
      <TestContext.Provider value={stateRef.current}>
        {children}
      </TestContext.Provider>
    );
  };
  
  // Create a hook to use the test context
  const useTestContext = () => {
    const context = useContext(TestContext);
    if (context === null) {
      throw new Error('useTestContext must be used within a TestProvider');
    }
    return context;
  };
  
  // Return test utilities
  return {
    // The context provider component
    Provider: TestProvider,
    
    // The hook to use the context
    useContext: useTestContext,
    
    // Set state directly for testing
    setState: (newState: Partial<State>) => {
      stateRef.current = {
        ...stateRef.current,
        ...newState,
      };
    },
    
    // Get current state
    getState: () => stateRef.current,
    
    // Reset state to initial
    resetState: () => {
      stateRef.current = {
        ...initialState,
        ...actionMocks,
      } as State & Actions;
    },
    
    // Get a specific action mock
    getActionMock: <K extends keyof Actions>(actionName: K): Actions[K] => {
      return stateRef.current[actionName];
    },
    
    // The context object itself for advanced usage
    Context: TestContext,
  };
}

/**
 * Type utility for extracting context state from a provider component
 * 
 * @example
 * ```tsx
 * const [MyProvider, useMyContext] = createExamsContext<MyState, MyActions>(...);
 * type ContextState = ExtractContextState<typeof MyProvider>;
 * // ContextState = MyState
 * ```
 */
export type ExtractContextState<T extends ProviderComponent<any>> = 
  T extends ProviderComponent<infer S> ? S : never;

/**
 * Type utility for extracting context value from a use context hook
 * 
 * @example
 * ```tsx
 * const [MyProvider, useMyContext] = createExamsContext<MyState, MyActions>(...);
 * type ContextValue = ExtractContextValue<typeof useMyContext>;
 * // ContextValue = MyState & MyActions
 * ```
 */
export type ExtractContextValue<T extends () => any> = 
  T extends () => infer R ? R : never;

// Re-export the core types for convenience
export type { CoreContextOptions as ContextOptions };
