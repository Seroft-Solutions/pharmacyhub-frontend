import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import {
  createExamsContext,
  withExamsContext,
  createTestProvider,
  ContextError,
  ContextErrorType,
  LogLevel,
  ExtractContextState,
  ExtractContextValue
} from '../contextFactory';
import logger from '@/core/utils/logger';

// Mock core utilities
jest.mock('@/core/state', () => ({
  createContextProvider: jest.fn((name, initialState, actionsCreator, options) => {
    const Context = jest.fn();
    const Provider = ({ children, initialState: customInitialState }) => {
      // Mock implementation that supports initialState
      const contextValue = {
        ...initialState,
        ...customInitialState,
        ...actionsCreator(() => {}),
      };
      return children;
    };
    
    const useContext = () => ({
      ...initialState,
      ...actionsCreator(() => {}),
    });
    
    return [Provider, useContext];
  }),
  withContextProvider: jest.fn((Provider, initialState) => 
    (Component) => (props) => <Provider initialState={initialState}><Component {...props} /></Provider>
  ),
}));

// Mock logger
jest.mock('@/core/utils/logger', () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('contextFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createExamsContext', () => {
    it('should create a context provider and hook', () => {
      // Define interfaces for our test context
      interface TestState {
        count: number;
        text: string;
      }
      
      interface TestActions {
        increment: () => void;
        decrement: () => void;
        setText: (text: string) => void;
      }
      
      // Create a test context
      const [TestProvider, useTestContext, createSelector] = createExamsContext<TestState, TestActions>(
        'TestContext',
        { count: 0, text: '' },
        (setState) => ({
          increment: () => setState(state => ({ ...state, count: state.count + 1 })),
          decrement: () => setState(state => ({ ...state, count: state.count - 1 })),
          setText: (text) => setState(state => ({ ...state, text })),
        })
      );
      
      // Verify the context was created
      expect(TestProvider).toBeDefined();
      expect(useTestContext).toBeDefined();
      expect(createSelector).toBeDefined();
      
      // Check that logger was called
      expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('Creating exams-preparation.TestContext context'));
    });
    
    it('should support debug mode', () => {
      // Create a context with debug mode enabled
      const [TestProvider, useTestContext] = createExamsContext(
        'DebugContext',
        { value: 0 },
        (setState) => ({
          update: (value: number) => setState({ value }),
        }),
        { debug: true, logLevel: LogLevel.DEBUG }
      );
      
      // Check that debug log was called
      expect(logger.debug).toHaveBeenCalled();
    });
    
    it('should create selectors that work correctly', () => {
      // Create a context with selectors
      const [TestProvider, useTestContext, createSelector] = createExamsContext(
        'SelectorContext',
        { count: 0, text: '' },
        (setState) => ({
          increment: () => setState(state => ({ ...state, count: state.count + 1 })),
          setText: (text: string) => setState(state => ({ ...state, text })),
        })
      );
      
      // Create selectors
      const useCount = createSelector(state => state.count);
      const useText = createSelector(state => state.text);
      
      // Verify selectors were created
      expect(useCount).toBeDefined();
      expect(useText).toBeDefined();
    });
    
    it('should wrap actions with error handling', () => {
      // Create a mock error handler
      const errorHandler = jest.fn();
      
      // Create a context with an action that throws an error
      const [TestProvider, useTestContext] = createExamsContext(
        'ErrorContext',
        { value: 0 },
        (setState) => ({
          triggerError: () => {
            throw new Error('Test error');
          }
        }),
        {
          debug: true,
          errorHandler
        }
      );
      
      // Get the context and trigger the error
      const context = useTestContext();
      
      // Expect error to be thrown and handled
      try {
        context.triggerError();
      } catch (error) {
        expect(error).toBeInstanceOf(ContextError);
        expect((error as ContextError).type).toBe(ContextErrorType.ACTION_FAILED);
      }
      
      // Check that error handler was called
      expect(logger.error).toHaveBeenCalled();
    });
  });
  
  describe('withExamsContext', () => {
    it('should create a HOC that wraps components with the provider', () => {
      // Create a test context
      const [TestProvider, useTestContext] = createExamsContext(
        'HocContext',
        { value: 'test' },
        (setState) => ({
          setValue: (value: string) => setState({ value }),
        })
      );
      
      // Create a test component
      const TestComponent = jest.fn(() => <div>Test Component</div>);
      
      // Create a HOC
      const withTestContext = withExamsContext(TestProvider);
      
      // Wrap the component with the HOC
      const WrappedComponent = withTestContext(TestComponent);
      
      // Render the wrapped component
      render(<WrappedComponent />);
      
      // Verify the component was rendered with the provider
      expect(TestComponent).toHaveBeenCalled();
    });
    
    it('should support custom initialState through providerProps', () => {
      // Create a test context
      const [TestProvider, useTestContext] = createExamsContext(
        'InitialStateContext',
        { value: 'default' },
        (setState) => ({
          setValue: (value: string) => setState({ value }),
        })
      );
      
      // Create a test component
      const TestComponent = jest.fn(() => <div>Test Component</div>);
      
      // Create a HOC
      const withTestContext = withExamsContext(TestProvider);
      
      // Wrap the component with the HOC
      const WrappedComponent = withTestContext(TestComponent);
      
      // Render the wrapped component with custom initialState
      render(
        <WrappedComponent 
          providerProps={{ 
            initialState: { value: 'custom' } 
          }} 
        />
      );
      
      // Verify the component was rendered
      expect(TestComponent).toHaveBeenCalled();
    });
  });
  
  describe('createTestProvider', () => {
    it('should create a test provider with utilities', () => {
      // Define interfaces for our test context
      interface TestState {
        count: number;
      }
      
      interface TestActions {
        increment: () => void;
        decrement: () => void;
      }
      
      // Create test actions
      const mockedActions = {
        increment: jest.fn(),
        decrement: jest.fn(),
      };
      
      // Create a test provider
      const testProvider = createTestProvider<TestState, TestActions>(
        { count: 0 },
        mockedActions
      );
      
      // Verify the test provider was created with all utilities
      expect(testProvider.Provider).toBeDefined();
      expect(testProvider.useContext).toBeDefined();
      expect(testProvider.setState).toBeDefined();
      expect(testProvider.getState).toBeDefined();
      expect(testProvider.resetState).toBeDefined();
      expect(testProvider.getActionMock).toBeDefined();
      
      // Test the utilities
      testProvider.setState({ count: 5 });
      expect(testProvider.getState().count).toBe(5);
      
      testProvider.resetState();
      expect(testProvider.getState().count).toBe(0);
      
      // Call an action and check that the mock was called
      testProvider.getState().increment();
      expect(mockedActions.increment).toHaveBeenCalled();
      
      // Check that getActionMock returns the correct mock
      expect(testProvider.getActionMock('increment')).toBe(mockedActions.increment);
    });
    
    it('should work with React components', () => {
      // Create a simple component that uses context
      function TestComponent() {
        const { count, increment } = useTestContext();
        return (
          <div>
            <span data-testid="count">{count}</span>
            <button data-testid="increment" onClick={increment}>Increment</button>
          </div>
        );
      }
      
      // Create a mock increment function
      const increment = jest.fn();
      
      // Create a test provider
      const { Provider, useContext: useTestContext } = createTestProvider(
        { count: 0 },
        { increment }
      );
      
      // Render the component with the test provider
      render(
        <Provider>
          <TestComponent />
        </Provider>
      );
      
      // Verify initial state
      expect(screen.getByTestId('count').textContent).toBe('0');
      
      // Trigger increment
      fireEvent.click(screen.getByTestId('increment'));
      
      // Verify increment was called
      expect(increment).toHaveBeenCalled();
    });
  });
  
  describe('Type utilities', () => {
    it('should extract context state type correctly', () => {
      // Define interfaces for our test context
      interface TestState {
        count: number;
      }
      
      interface TestActions {
        increment: () => void;
      }
      
      // Create a test context
      const [TestProvider, useTestContext] = createExamsContext<TestState, TestActions>(
        'TypeContext',
        { count: 0 },
        (setState) => ({
          increment: () => setState(state => ({ ...state, count: state.count + 1 })),
        })
      );
      
      // Use type utilities
      type ExtractedState = ExtractContextState<typeof TestProvider>;
      type ExtractedValue = ExtractContextValue<typeof useTestContext>;
      
      // Create variables of the extracted types to verify compilation
      const state: ExtractedState = { count: 0 };
      const value: ExtractedValue = { 
        count: 0, 
        increment: () => {} 
      };
      
      // Simple assertion to make TypeScript happy
      expect(state.count).toBe(0);
      expect(value.count).toBe(0);
      expect(typeof value.increment).toBe('function');
    });
  });
});
