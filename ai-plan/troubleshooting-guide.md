# Troubleshooting Guide for Exams Feature Refactoring

This guide provides solutions for common issues that might arise during the exams feature refactoring process.

## Build and Compilation Issues

### Issue: Missing Dependencies

**Symptoms:**
- Build errors mentioning missing modules
- TypeScript errors for undefined imports

**Solutions:**
1. **Check Import Paths**
   ```typescript
   // Incorrect
   import { ExamSession } from '../components/ExamSession';
   
   // Correct
   import { ExamSession } from '../../taking/components/ExamSession';
   ```

2. **Update Index Files**
   ```typescript
   // src/features/exams/taking/components/index.ts
   export * from './ExamSession';
   export * from './ExamQuestions';
   // ... other exports
   ```

3. **Check for Circular Dependencies**
   ```typescript
   // Break circular dependencies by creating intermediate files
   // Instead of importing directly between files that import each other
   ```

### Issue: TypeScript Errors

**Symptoms:**
- Type mismatch errors
- Property does not exist on type errors
- Cannot find name errors

**Solutions:**
1. **Update Type Definitions**
   ```typescript
   // Ensure types are properly defined
   interface QuestionDisplayProps {
     question: Question;
     userAnswer?: number;
     isFlagged: boolean;
     onAnswerSelect: (questionId: number, optionId: number) => void;
     onFlagQuestion: (questionId: number) => void;
   }
   ```

2. **Use Type Guards**
   ```typescript
   // Add type guards for nullable values
   if (exam && typeof exam === 'object') {
     // Now TypeScript knows exam is not null or undefined
     console.log(exam.title);
   }
   ```

3. **Fix Import Issues**
   ```typescript
   // Ensure types are imported correctly
   import type { Exam, Question } from '../../core/types';
   ```

### Issue: ESLint Errors

**Symptoms:**
- ESLint warnings or errors in the console
- Build failures due to linting issues

**Solutions:**
1. **Fix Missing React Imports**
   ```typescript
   // For React 17+ with new JSX transform, no import needed
   // For older React versions:
   import React from 'react';
   ```

2. **Add ESLint Disable Comments (temporarily)**
   ```typescript
   // eslint-disable-next-line react-hooks/exhaustive-deps
   ```

3. **Fix Missing Dependencies in useEffect**
   ```typescript
   useEffect(() => {
     // Effect code
   }, [dependency1, dependency2]); // Add all dependencies
   ```

## Runtime Issues

### Issue: Components Not Rendering

**Symptoms:**
- Components not appearing in the UI
- No visible errors in the console

**Solutions:**
1. **Check Component Exports and Imports**
   ```typescript
   // Make sure you're exporting correctly
   export const ExamSession = () => { /* ... */ };
   // Or
   const ExamSession = () => { /* ... */ };
   export default ExamSession;
   ```

2. **Check Conditional Rendering Logic**
   ```typescript
   // Fix conditions that might prevent rendering
   {isLoading ? <LoadingSpinner /> : exam ? <ExamDisplay exam={exam} /> : <EmptyState />}
   ```

3. **Check Feature Flags**
   ```typescript
   // Make sure the correct feature flag is enabled
   if (FEATURE_FLAGS.USE_NEW_EXAM_COMPONENTS) {
     return <NewComponent />;
   } else {
     return <OldComponent />;
   }
   ```

### Issue: State Not Updating

**Symptoms:**
- UI not reflecting state changes
- Actions not having the expected effect

**Solutions:**
1. **Check Zustand Store Implementation**
   ```typescript
   // Make sure you're updating state correctly
   set(state => ({ ...state, counter: state.counter + 1 }));
   
   // Not this, which mutates state
   set(state => {
     state.counter += 1; // Wrong!
     return state;
   });
   ```

2. **Check Component Re-Renders**
   ```typescript
   // Add console.log to check if component re-renders
   console.log('Component rendering with:', answers);
   ```

3. **Add Custom Store Middleware for Debugging**
   ```typescript
   // Add logging middleware to Zustand store
   const logMiddleware = (config) => (set, get, api) => config(
     (...args) => {
       console.log('Prev state:', get());
       console.log('Args:', args);
       set(...args);
       console.log('Next state:', get());
     },
     get,
     api
   );
   
   export const useExamStore = create(
     logMiddleware((set, get) => ({
       // Your store implementation
     }))
   );
   ```

### Issue: API Calls Not Working

**Symptoms:**
- Network errors in console
- Data not loading
- Actions failing silently

**Solutions:**
1. **Check API Endpoint Constants**
   ```typescript
   // Make sure endpoints are defined correctly
   export const EXAM_ENDPOINTS = {
     // Correct
     getExamById: `/api/v1/exams/:id`,
     
     // Incorrect (missing slash)
     getExamById: `api/v1/exams/:id`,
   };
   ```

2. **Check URL Parameter Substitution**
   ```typescript
   // Ensure parameters are replaced correctly
   const url = EXAM_ENDPOINTS.getExamById.replace(':id', examId.toString());
   ```

3. **Add Error Handling**
   ```typescript
   try {
     const response = await examApiService.getExamById(examId);
     if (!response.data) {
       throw new Error('No data returned');
     }
     // Process data
   } catch (error) {
     console.error('API error:', error);
     toast.error(`Failed to load exam: ${error instanceof Error ? error.message : 'Unknown error'}`);
   }
   ```

4. **Set Up Request/Response Interceptors**
   ```typescript
   // Add interceptors to log and debug API calls
   apiClient.interceptors.request.use(
     (config) => {
       console.log('Request:', config.method?.toUpperCase(), config.url, config.data);
       return config;
     },
     (error) => {
       console.error('Request error:', error);
       return Promise.reject(error);
     }
   );
   
   apiClient.interceptors.response.use(
     (response) => {
       console.log('Response:', response.status, response.data);
       return response;
     },
     (error) => {
       console.error('Response error:', error.response || error);
       return Promise.reject(error);
     }
   );
   ```

### Issue: Performance Problems

**Symptoms:**
- Slow rendering
- UI freezes
- High CPU usage

**Solutions:**
1. **Memoize Components and Functions**
   ```typescript
   // Use React.memo to prevent unnecessary renders
   export const QuestionDisplay = React.memo(({ question, userAnswer, isFlagged, onAnswerSelect, onFlagQuestion }) => {
     // Component implementation
   });
   
   // Use useCallback for functions
   const handleAnswerSelect = useCallback((questionId: number, optionId: number) => {
     answerQuestion(questionId, optionId);
   }, [answerQuestion]);
   
   // Use useMemo for derived values
   const completionPercentage = useMemo(() => {
     if (questions.length === 0) return 0;
     return (Object.keys(answers).length / questions.length) * 100;
   }, [questions.length, answers]);
   ```

2. **Use Zustand Selectors**
   ```typescript
   // Instead of this
   const { questions, answers, currentQuestionIndex } = useExamTakingStore();
   const currentQuestion = questions[currentQuestionIndex];
   
   // Use selectors
   const currentQuestion = useExamTakingStore(state => 
     state.questions[state.currentQuestionIndex]
   );
   const hasAnswer = useExamTakingStore(state => 
     !!state.answers[currentQuestion?.id]
   );
   ```

3. **Lazy Load Components**
   ```typescript
   // Use React.lazy for code splitting
   const ExamResults = React.lazy(() => import('./ExamResults'));
   
   // Use with Suspense
   <Suspense fallback={<LoadingSpinner />}>
     {showResults && <ExamResults result={examResult} />}
   </Suspense>
   ```

### Issue: Component Communication Problems

**Symptoms:**
- Components not receiving updates
- Actions in one component not affecting others
- Inconsistent state across components

**Solutions:**
1. **Ensure Using Same Store Instance**
   ```typescript
   // Make sure all components use the same store
   import { useExamTakingStore } from '../../taking/store/examTakingStore';
   
   // Not different imports of the same store
   import { useExamTakingStore } from '../../store/examTakingStore'; // Wrong path
   ```

2. **Check Store Persistence**
   ```typescript
   // Make sure persist middleware is configured correctly
   export const useExamTakingStore = create(
     persist(
       (set, get) => ({
         // Store implementation
       }),
       {
         name: 'exam-taking-store',
         getStorage: () => localStorage, // Use localStorage or sessionStorage
       }
     )
   );
   ```

3. **Use Store Events for Debugging**
   ```typescript
   // Add state change listener
   useEffect(() => {
     const unsubscribe = useExamTakingStore.subscribe(
       state => state.answers,
       answers => {
         console.log('Answers changed:', answers);
       }
     );
     
     return () => unsubscribe();
   }, []);
   ```

## Common Zustand Issues

### Issue: Store Not Persisting

**Symptoms:**
- State resets on page refresh
- LocalStorage not updating

**Solutions:**
1. **Fix Persist Configuration**
   ```typescript
   export const useExamTakingStore = create(
     persist(
       (set, get) => ({
         // Store implementation
       }),
       {
         name: 'exam-taking-store', // Unique name
         storage: createJSONStorage(() => localStorage), // Explicitly set storage
       }
     )
   );
   ```

2. **Add Manual Hydration**
   ```typescript
   // In your top-level component
   useEffect(() => {
     const hydrate = async () => {
       await useExamTakingStore.persist.rehydrate();
     };
     hydrate();
   }, []);
   ```

3. **Check Storage Serialization**
   ```typescript
   // Add custom serialization for complex objects
   export const useExamTakingStore = create(
     persist(
       (set, get) => ({
         // Store implementation
       }),
       {
         name: 'exam-taking-store',
         storage: createJSONStorage(() => ({
           getItem: (name) => {
             const str = localStorage.getItem(name);
             return str ? JSON.parse(str) : null;
           },
           setItem: (name, value) => {
             localStorage.setItem(name, JSON.stringify(value));
           },
           removeItem: (name) => {
             localStorage.removeItem(name);
           },
         })),
       }
     )
   );
   ```

### Issue: Store Updates Not Triggering Re-renders

**Symptoms:**
- State changes in store but UI doesn't update
- Components not re-rendering on state change

**Solutions:**
1. **Use Selector Functions**
   ```typescript
   // Use selectors instead of destructuring
   // This only re-renders when selected state changes
   const answers = useExamTakingStore(state => state.answers);
   const currentQuestion = useExamTakingStore(state => 
     state.questions[state.currentQuestionIndex]
   );
   
   // Avoid this, which re-renders on any state change
   const { answers, questions, currentQuestionIndex } = useExamTakingStore();
   const currentQuestion = questions[currentQuestionIndex];
   ```

2. **Add Equality Function**
   ```typescript
   // Add custom equality function to prevent unnecessary re-renders
   const answers = useExamTakingStore(
     state => state.answers,
     (prev, next) => {
       // Only re-render if the keys have changed
       return Object.keys(prev).length === Object.keys(next).length &&
         Object.keys(prev).every(key => prev[key].selectedOption === next[key].selectedOption);
     }
   );
   ```

3. **Check Immutability**
   ```typescript
   // Make sure you're updating state immutably
   set(state => ({
     ...state,
     answers: {
       ...state.answers,
       [questionId]: {
         questionId,
         selectedOption: optionId,
         timeSpent: 0
       }
     }
   }));
   ```

## Common TanStack Query Issues

### Issue: Stale Data

**Symptoms:**
- UI showing outdated data
- Changes not reflected immediately

**Solutions:**
1. **Invalidate Queries**
   ```typescript
   const queryClient = useQueryClient();
   
   // Invalidate specific query
   queryClient.invalidateQueries({ queryKey: ['exams', examId] });
   
   // Invalidate all exam queries
   queryClient.invalidateQueries({ queryKey: ['exams'] });
   ```

2. **Set Appropriate Cache Time**
   ```typescript
   // Decrease cache time for frequently changing data
   return examApiHooks.useCustomQuery<Question[]>(
     'questions',
     ['questions', examId],
     {
       staleTime: 30 * 1000, // 30 seconds
       cacheTime: 5 * 60 * 1000, // 5 minutes
     }
   );
   ```

3. **Use Optimistic Updates**
   ```typescript
   const { mutate } = useAnswerQuestionMutation(attemptId, questionId);
   
   // Add optimistic update
   mutate(
     { selectedOptionId, timeSpent },
     {
       onMutate: async (newAnswer) => {
         // Cancel outgoing refetches
         await queryClient.cancelQueries(['attempts', attemptId]);
         
         // Save previous value
         const previousAttempt = queryClient.getQueryData(['attempts', attemptId]);
         
         // Optimistically update
         queryClient.setQueryData(['attempts', attemptId], (old) => ({
           ...old,
           answers: {
             ...old.answers,
             [questionId]: {
               questionId,
               selectedOption: selectedOptionId,
               timeSpent
             }
           }
         }));
         
         // Return context
         return { previousAttempt };
       },
       onError: (err, newAnswer, context) => {
         // Rollback on error
         queryClient.setQueryData(
           ['attempts', attemptId],
           context.previousAttempt
         );
       },
       onSettled: () => {
         // Refetch to ensure consistency
         queryClient.invalidateQueries(['attempts', attemptId]);
       }
     }
   );
   ```

### Issue: API Errors Not Handled

**Symptoms:**
- Silent failures
- UI stuck in loading state
- Network errors in console

**Solutions:**
1. **Add Error Handling to Hooks**
   ```typescript
   const {
     data: exam,
     isLoading,
     error,
     isError
   } = useExamDetail(examId);
   
   // Handle error state
   if (isError) {
     return <ErrorState error={error} onRetry={() => refetch()} />;
   }
   ```

2. **Add Global Error Handler**
   ```typescript
   // In your QueryClientProvider setup
   const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         retry: 3, // Retry failed queries 3 times
         retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
         onError: (error) => {
           // Log all query errors
           console.error('Query error:', error);
           
           // Show toast for network errors
           if (error instanceof Error && error.message.includes('Network')) {
             toast.error('Network error. Please check your connection.');
           }
         }
       },
       mutations: {
         onError: (error) => {
           // Log all mutation errors
           console.error('Mutation error:', error);
           
           // Show generic error toast
           toast.error('An error occurred. Please try again.');
         }
       }
     }
   });
   ```

3. **Add Error Boundaries**
   ```tsx
   // Create error boundary component
   class QueryErrorBoundary extends React.Component {
     state = { hasError: false, error: null };
     
     static getDerivedStateFromError(error) {
       return { hasError: true, error };
     }
     
     componentDidCatch(error, errorInfo) {
       console.error('Query error caught by boundary:', error, errorInfo);
     }
     
     render() {
       if (this.state.hasError) {
         return (
           <ErrorState 
             error={this.state.error}
             onRetry={() => this.setState({ hasError: false, error: null })}
           />
         );
       }
       
       return this.props.children;
     }
   }
   
   // Use error boundary
   <QueryErrorBoundary>
     <ExamQuestions />
   </QueryErrorBoundary>
   ```

## Migration Process Issues

### Issue: Feature Flags Not Working

**Symptoms:**
- Always using old implementation
- Feature flags being ignored

**Solutions:**
1. **Check Flag Configuration**
   ```typescript
   // Make sure flags are defined correctly
   export const FEATURE_FLAGS = {
     USE_NEW_EXAM_STORES: process.env.NODE_ENV === 'development' || 
       localStorage.getItem('USE_NEW_EXAM_STORES') === 'true',
     // Other flags
   };
   ```

2. **Debug Flag Values**
   ```typescript
   // Add debugging
   console.log('Feature flags:', FEATURE_FLAGS);
   
   // Add React DevTools component for toggling flags
   const FeatureFlagDebug = () => {
     if (process.env.NODE_ENV !== 'development') return null;
     
     return (
       <div style={{ position: 'fixed', bottom: 0, right: 0, background: '#f0f0f0', padding: 10, zIndex: 9999 }}>
         <h4>Feature Flags</h4>
         {Object.entries(FEATURE_FLAGS).map(([key, value]) => (
           <div key={key}>
             <label>
               <input
                 type="checkbox"
                 checked={value}
                 onChange={() => {
                   localStorage.setItem(key, (!value).toString());
                   window.location.reload();
                 }}
               />
               {key}
             </label>
           </div>
         ))}
       </div>
     );
   };
   ```

3. **Fix Conditional Imports**
   ```typescript
   // Use dynamic imports instead of conditional variables
   import { FEATURE_FLAGS } from './config';
   
   const ExamContainer = (props) => {
     const [Component, setComponent] = useState(null);
     
     useEffect(() => {
       async function loadComponent() {
         if (FEATURE_FLAGS.USE_NEW_EXAM_COMPONENTS) {
           const { ExamSession } = await import('./taking/components/ExamSession');
           setComponent(() => ExamSession);
         } else {
           const { ExamContainer } = await import('./deprecated/components/ExamContainer');
           setComponent(() => ExamContainer);
         }
       }
       
       loadComponent();
     }, []);
     
     if (!Component) return <LoadingSpinner />;
     
     return <Component {...props} />;
   };
   ```

### Issue: Backward Compatibility Problems

**Symptoms:**
- Old components broken after refactoring
- Mix of old and new components not working together

**Solutions:**
1. **Create Adapter Components**
   ```tsx
   // Create adapter component to make new store compatible with old components
   const OldExamContainerAdapter = (props) => {
     // Get state from new store
     const {
       currentExam: exam,
       questions,
       answers: userAnswers,
       startExam,
       answerQuestion,
       // ... other state and actions
     } = useExamTakingStore();
     
     // Transform data to match old component props
     const transformedProps = {
       ...props,
       exam,
       questions,
       userAnswers: Object.values(userAnswers).reduce((acc, answer) => {
         acc[answer.questionId] = answer.selectedOption;
         return acc;
       }, {}),
       onStartExam: (examId, userId) => startExam(examId, userId),
       onAnswerQuestion: (questionId, optionId) => answerQuestion(questionId, optionId),
       // ... other transformed props
     };
     
     // Render old component with transformed props
     return <OldExamContainer {...transformedProps} />;
   };
   ```

2. **Create Hook Adapters**
   ```tsx
   // Create adapter hook to make new hooks compatible with old code
   export const useExamData = (examId) => {
     // Use new hook
     const { data: exam, isLoading, error } = useExamDetail(examId);
     const { data: questions } = useExamQuestions(examId);
     
     // Transform to match old hook return value
     return {
       exam,
       questions,
       isLoading,
       error,
       // ... other transformed values
     };
   };
   ```

3. **Maintain API Compatibility**
   ```tsx
   // Keep old API exports for backward compatibility
   // src/features/exams/api/hooks/backwardCompatibility.ts
   import { useExamApiHooks, useExamAttemptHooks } from './index';
   
   // Export old hook structure
   export const useExamApi = () => {
     return {
       getExams: useExamApiHooks.useList,
       getExamById: useExamApiHooks.useDetail,
       // ... other methods
     };
   };
   ```

## General Debugging Tips

### 1. Use React DevTools

React DevTools Chrome/Firefox extension helps debug component props, state, and performance.

### 2. Add Logging Middleware to Zustand

```typescript
// src/features/exams/taking/store/examTakingStore.ts
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// Add devtools middleware for debugging
export const useExamTakingStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Store implementation
      }),
      {
        name: 'exam-taking-store',
      }
    ),
    {
      name: 'ExamTakingStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);
```

### 3. Setup React Query DevTools

```tsx
// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
```

### 4. Add Tracking for Component Re-renders

```tsx
// src/utils/debugUtils.ts
import { useRef } from 'react';

// Hook to log component renders
export const useRenderCount = (componentName: string) => {
  const renderCount = useRef(0);
  
  renderCount.current += 1;
  
  console.log(`[${componentName}] Render count: ${renderCount.current}`);
  
  return renderCount.current;
};

// Usage in component
const MyComponent = (props) => {
  useRenderCount('MyComponent');
  
  // Rest of component
};
```

### 5. Debug Network Requests

```typescript
// src/utils/apiDebugging.ts
import axios from 'axios';

// Enable network debugging
export const setupApiDebugging = () => {
  if (process.env.NODE_ENV === 'development') {
    axios.interceptors.request.use(
      (config) => {
        console.log(`%c API Request: ${config.method?.toUpperCase()} ${config.url}`, 'color: #3498db', {
          data: config.data,
          params: config.params,
        });
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );
    
    axios.interceptors.response.use(
      (response) => {
        console.log(`%c API Response: ${response.status} ${response.config.url}`, 'color: #2ecc71', {
          data: response.data,
        });
        return response;
      },
      (error) => {
        console.error(`%c API Response Error: ${error.response?.status || 'NETWORK ERROR'}`, 'color: #e74c3c', {
          error: error.response || error,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }
};
```

## Final Checks

Before considering the refactoring complete, perform these final checks:

1. **Test All User Flows**: Verify all user journeys work as expected
2. **Check Performance**: Ensure the refactored code performs at least as well as the original
3. **Validate API Integration**: Confirm all API endpoints are called correctly
4. **Verify Error Handling**: Test error scenarios to ensure they're handled properly
5. **Check Browser Compatibility**: Test in different browsers
6. **Verify Mobile Responsiveness**: Test on different screen sizes
7. **Review Code Quality**: Ensure code follows best practices and coding standards
8. **Remove Debug Code**: Clean up any temporary debugging code
9. **Update Documentation**: Ensure documentation reflects the new architecture

## Conclusion

This troubleshooting guide covers common issues you might encounter during the exams feature refactoring. By addressing these issues proactively, you can ensure a smooth refactoring process and a high-quality result.

Remember that refactoring is an incremental process. If you encounter a complex issue, it's often better to make a small, focused change and test it thoroughly before moving on to the next change. This approach minimizes risk and makes it easier to identify and fix issues as they arise.
