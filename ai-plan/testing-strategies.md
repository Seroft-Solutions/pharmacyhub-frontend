# Testing Strategies for Refactored Components

This document outlines comprehensive testing strategies for ensuring the refactored exams feature maintains full functionality throughout and after the migration process.

## Types of Testing

### 1. Unit Testing

Test individual components and functions in isolation to ensure they work correctly.

#### What to Test:
- **Zustand Stores**: Test state updates, actions, and selectors
- **Utility Functions**: Test transformers, formatters, and helper functions
- **Basic Components**: Test rendering and props handling of leaf components

#### Example: Testing a Zustand Store

```typescript
// src/features/exams/taking/store/__tests__/examTakingStore.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useExamTakingStore } from '../examTakingStore';

// Mock API adapter
jest.mock('../../../api/services/adapters/examTakingAdapter', () => ({
  getExamById: jest.fn().mockResolvedValue({
    id: 1,
    title: 'Test Exam',
    // ... other exam data
  }),
  startExam: jest.fn().mockResolvedValue({
    id: 1,
    examId: 1,
    // ... other attempt data
  }),
  // ... other mocked methods
}));

describe('examTakingStore', () => {
  beforeEach(() => {
    // Reset the store
    act(() => {
      useExamTakingStore.getState().resetExam();
    });
  });
  
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useExamTakingStore());
    
    expect(result.current.examId).toBeNull();
    expect(result.current.attemptId).toBeNull();
    expect(result.current.questions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    // ... other assertions
  });
  
  test('should start an exam', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useExamTakingStore());
    
    act(() => {
      result.current.startExam(1, 'user1');
    });
    
    // Should set loading state
    expect(result.current.isStarting).toBe(true);
    
    await waitForNextUpdate();
    
    // Should update state with API response
    expect(result.current.examId).toBe(1);
    expect(result.current.attemptId).toBe(1);
    expect(result.current.isStarting).toBe(false);
    // ... other assertions
  });
  
  // ... more tests for other actions
});
```

#### Example: Testing Utility Functions

```typescript
// src/features/exams/api/utils/__tests__/transformers.test.ts
import { 
  transformExam, 
  transformQuestion, 
  transformAttempt 
} from '../transformers';

describe('transformers', () => {
  describe('transformExam', () => {
    test('should transform exam data correctly', () => {
      const apiData = {
        id: 1,
        title: 'Test Exam',
        description: 'Test Description',
        duration: 60,
        // ... other API data
      };
      
      const result = transformExam(apiData);
      
      expect(result).toEqual({
        id: 1,
        title: 'Test Exam',
        description: 'Test Description',
        duration: 60,
        // ... other expected data
      });
    });
    
    test('should handle nested data structure', () => {
      const apiData = {
        data: {
          id: 1,
          title: 'Test Exam',
          // ... other nested data
        }
      };
      
      const result = transformExam(apiData);
      
      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Exam');
      // ... other assertions
    });
    
    // ... more tests for edge cases
  });
  
  // ... tests for other transformer functions
});
```

#### Example: Testing a Component

```typescript
// src/features/exams/taking/components/__tests__/QuestionText.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { QuestionText } from '../QuestionText';

describe('QuestionText', () => {
  test('should render the question text', () => {
    render(<QuestionText text="What is the capital of France?" />);
    
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
  });
  
  test('should render question number when provided', () => {
    render(<QuestionText text="What is the capital of France?" questionNumber={1} />);
    
    expect(screen.getByText('Q1.')).toBeInTheDocument();
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
  });
  
  test('should handle HTML content in text', () => {
    render(<QuestionText text="What is <strong>bold</strong>?" />);
    
    expect(screen.getByText('bold')).toBeInTheDocument();
    expect(screen.getByText('bold')).toHaveStyle('font-weight: bold');
  });
});
```

### 2. Integration Testing

Test how components interact with each other and with Zustand stores.

#### What to Test:
- **Component Composition**: Test how components work together
- **Store Integration**: Test components with real or mocked stores
- **API Integration**: Test API hooks with mock servers

#### Example: Testing Component Integration

```typescript
// src/features/exams/taking/components/__tests__/ExamQuestions.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExamQuestions } from '../ExamQuestions';
import { useExamTakingStore } from '../../store/examTakingStore';

// Mock the store
jest.mock('../../store/examTakingStore', () => ({
  useExamTakingStore: jest.fn()
}));

const mockStore = {
  currentExam: {
    id: 1,
    title: 'Test Exam',
    // ... other exam data
  },
  questions: [
    {
      id: 1,
      text: 'Question 1',
      options: [
        { id: 1, text: 'Option A' },
        { id: 2, text: 'Option B' },
      ],
    },
    // ... more questions
  ],
  currentQuestionIndex: 0,
  answers: {},
  flaggedQuestions: new Set<number>(),
  navigateToQuestion: jest.fn(),
  answerQuestion: jest.fn(),
  toggleFlagQuestion: jest.fn(),
  // ... other store state and methods
};

describe('ExamQuestions', () => {
  beforeEach(() => {
    (useExamTakingStore as jest.Mock).mockImplementation(() => mockStore);
  });
  
  test('should render the current question', () => {
    render(<ExamQuestions />);
    
    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });
  
  test('should call answerQuestion when option is selected', () => {
    render(<ExamQuestions />);
    
    fireEvent.click(screen.getByText('Option A'));
    
    expect(mockStore.answerQuestion).toHaveBeenCalledWith(1, 1);
  });
  
  test('should call toggleFlagQuestion when flag button is clicked', () => {
    render(<ExamQuestions />);
    
    fireEvent.click(screen.getByText('Flag for Review'));
    
    expect(mockStore.toggleFlagQuestion).toHaveBeenCalledWith(1);
  });
  
  // ... more tests for interactions
});
```

#### Example: Testing API Hooks

```typescript
// src/features/exams/api/hooks/__tests__/useExamApiHooks.test.tsx
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePublishedExams, useExamDetail } from '../useExamApiHooks';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Set up mock server
const server = setupServer(
  rest.get('/api/v1/exams/published', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          title: 'Test Exam 1',
          // ... other data
        },
        // ... more exams
      ])
    );
  }),
  
  rest.get('/api/v1/exams/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.json({
        id: Number(id),
        title: `Test Exam ${id}`,
        // ... other data
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useExamApiHooks', () => {
  describe('usePublishedExams', () => {
    test('should fetch published exams', async () => {
      const { result, waitFor } = renderHook(() => usePublishedExams(), {
        wrapper: createWrapper(),
      });
      
      // Initial state
      expect(result.current.isLoading).toBe(true);
      
      // Wait for the query to resolve
      await waitFor(() => !result.current.isLoading);
      
      // Check the result
      expect(result.current.data).toHaveLength(2);
      expect(result.current.data?.[0].id).toBe(1);
      expect(result.current.data?.[0].title).toBe('Test Exam 1');
    });
  });
  
  describe('useExamDetail', () => {
    test('should fetch exam details', async () => {
      const { result, waitFor } = renderHook(() => useExamDetail(1), {
        wrapper: createWrapper(),
      });
      
      // Initial state
      expect(result.current.isLoading).toBe(true);
      
      // Wait for the query to resolve
      await waitFor(() => !result.current.isLoading);
      
      // Check the result
      expect(result.current.data?.id).toBe(1);
      expect(result.current.data?.title).toBe('Test Exam 1');
    });
  });
});
```

### 3. End-to-End Testing

Test complete user flows from start to finish.

#### What to Test:
- **User Journeys**: Test complete user scenarios
- **Cross-Feature Interactions**: Test how features work together
- **Error Handling**: Test error states and recovery

#### Example: Testing User Journey

```typescript
// cypress/integration/exam_taking_spec.js
describe('Exam Taking', () => {
  beforeEach(() => {
    // Set up test data
    cy.intercept('GET', '/api/v1/exams/1', { fixture: 'exam.json' });
    cy.intercept('GET', '/api/v1/exams/1/questions', { fixture: 'questions.json' });
    cy.intercept('POST', '/api/v1/exams/1/start', { fixture: 'attempt.json' });
    cy.intercept('POST', '/api/v1/exams/attempts/*/answer/*', { statusCode: 200 });
    cy.intercept('POST', '/api/v1/exams/attempts/*/flag/*', { statusCode: 200 });
    cy.intercept('POST', '/api/v1/exams/attempts/*/submit', { fixture: 'result.json' });
    
    // Log in
    cy.login('testuser', 'password');
    
    // Visit exam page
    cy.visit('/exams/1');
  });
  
  it('should complete an exam from start to finish', () => {
    // Start the exam
    cy.contains('Start Exam').click();
    
    // Verify exam started
    cy.contains('Question 1').should('be.visible');
    
    // Answer questions
    cy.contains('Option A').click();
    cy.contains('Next').click();
    
    cy.contains('Question 2').should('be.visible');
    cy.contains('Option B').click();
    
    // Flag a question
    cy.contains('Flag for Review').click();
    cy.contains('Flagged').should('be.visible');
    
    // Navigate to question summary
    cy.contains('Review Answers').click();
    
    // Verify summary
    cy.contains('2 / 2 Answered').should('be.visible');
    cy.contains('1 Flagged').should('be.visible');
    
    // Submit exam
    cy.contains('Submit Exam').click();
    cy.contains('Are you sure').should('be.visible');
    cy.contains('Yes, submit').click();
    
    // Verify result
    cy.contains('Exam Results').should('be.visible');
    cy.contains('Your Score:').should('be.visible');
  });
  
  it('should handle timer expiration', () => {
    // Start the exam
    cy.contains('Start Exam').click();
    
    // Verify exam started
    cy.contains('Question 1').should('be.visible');
    
    // Force timer to expire
    cy.window().then((win) => {
      win.examTakingStore.getState().updateTimeRemaining(1);
    });
    
    // Wait for timer to expire
    cy.wait(2000);
    
    // Verify auto-submission
    cy.contains('Time is up!').should('be.visible');
    cy.contains('Exam Results').should('be.visible');
  });
});
```

### 4. Visual Testing

Test the visual appearance of components to ensure consistent UI.

#### What to Test:
- **Component Rendering**: Test visual appearance
- **Responsive Design**: Test different screen sizes
- **Accessibility**: Test accessibility features

#### Example: Visual Snapshot Testing

```typescript
// src/features/exams/taking/components/__tests__/QuestionDisplay.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { QuestionDisplay } from '../QuestionDisplay';

describe('QuestionDisplay', () => {
  test('should match snapshot', () => {
    const question = {
      id: 1,
      text: 'What is the capital of France?',
      questionNumber: 1,
      options: [
        { id: 1, text: 'London' },
        { id: 2, text: 'Paris' },
        { id: 3, text: 'Berlin' },
        { id: 4, text: 'Madrid' },
      ],
    };
    
    const { container } = render(
      <QuestionDisplay
        question={question}
        userAnswer={undefined}
        isFlagged={false}
        onAnswerSelect={() => {}}
        onFlagQuestion={() => {}}
      />
    );
    
    expect(container).toMatchSnapshot();
  });
  
  test('should match snapshot with selected answer', () => {
    const question = {
      id: 1,
      text: 'What is the capital of France?',
      questionNumber: 1,
      options: [
        { id: 1, text: 'London' },
        { id: 2, text: 'Paris' },
        { id: 3, text: 'Berlin' },
        { id: 4, text: 'Madrid' },
      ],
    };
    
    const { container } = render(
      <QuestionDisplay
        question={question}
        userAnswer={2}
        isFlagged={false}
        onAnswerSelect={() => {}}
        onFlagQuestion={() => {}}
      />
    );
    
    expect(container).toMatchSnapshot();
  });
  
  test('should match snapshot with flagged question', () => {
    const question = {
      id: 1,
      text: 'What is the capital of France?',
      questionNumber: 1,
      options: [
        { id: 1, text: 'London' },
        { id: 2, text: 'Paris' },
        { id: 3, text: 'Berlin' },
        { id: 4, text: 'Madrid' },
      ],
    };
    
    const { container } = render(
      <QuestionDisplay
        question={question}
        userAnswer={undefined}
        isFlagged={true}
        onAnswerSelect={() => {}}
        onFlagQuestion={() => {}}
      />
    );
    
    expect(container).toMatchSnapshot();
  });
});
```

### 5. Performance Testing

Test the performance of the refactored code to ensure it meets or exceeds the performance of the original code.

#### What to Test:
- **Render Performance**: Measure render times
- **Memory Usage**: Monitor memory consumption
- **Network Efficiency**: Check API call frequency

#### Example: Performance Testing

```typescript
// src/features/exams/taking/components/__tests__/ExamContainer.perf.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { Profiler } from 'react';
import { ExamContainer as OldExamContainer } from '../../../deprecated/components/ExamContainer';
import { ExamSession as NewExamContainer } from '../ExamSession';

// Mock the stores and API calls
jest.mock('../../../api/services/adapters/examTakingAdapter', () => ({
  // ... mock implementation
}));

// Mock data
const mockExam = {
  id: 1,
  title: 'Performance Test Exam',
  // ... other data
};

const mockQuestions = Array(50).fill(null).map((_, i) => ({
  id: i + 1,
  text: `Question ${i + 1}`,
  options: Array(4).fill(null).map((_, j) => ({
    id: j + 1,
    text: `Option ${String.fromCharCode(65 + j)}`,
  })),
}));

// Performance callback
let performanceData = {
  oldRenderTime: 0,
  newRenderTime: 0,
  oldRenderCount: 0,
  newRenderCount: 0,
};

const performanceCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  if (id === 'old' && phase === 'mount') {
    performanceData.oldRenderTime += actualDuration;
    performanceData.oldRenderCount++;
  } else if (id === 'new' && phase === 'mount') {
    performanceData.newRenderTime += actualDuration;
    performanceData.newRenderCount++;
  }
};

describe('ExamContainer Performance', () => {
  beforeEach(() => {
    performanceData = {
      oldRenderTime: 0,
      newRenderTime: 0,
      oldRenderCount: 0,
      newRenderCount: 0,
    };
  });
  
  test('should render efficiently compared to old implementation', () => {
    // Render old implementation
    render(
      <Profiler id="old" onRender={performanceCallback}>
        <OldExamContainer
          examId={1}
          userId="user1"
          exam={mockExam}
          questions={mockQuestions}
          // ... other props
        />
      </Profiler>
    );
    
    // Render new implementation
    render(
      <Profiler id="new" onRender={performanceCallback}>
        <NewExamContainer
          examId={1}
          userId="user1"
          // New implementation uses Zustand store
        />
      </Profiler>
    );
    
    // Calculate average render times
    const oldAvgRenderTime = performanceData.oldRenderTime / performanceData.oldRenderCount;
    const newAvgRenderTime = performanceData.newRenderTime / performanceData.newRenderCount;
    
    console.log('Performance comparison:');
    console.log(`Old implementation: ${oldAvgRenderTime.toFixed(2)}ms`);
    console.log(`New implementation: ${newAvgRenderTime.toFixed(2)}ms`);
    console.log(`Improvement: ${((1 - newAvgRenderTime / oldAvgRenderTime) * 100).toFixed(2)}%`);
    
    // Assert performance improvement or at least no regression
    expect(newAvgRenderTime).toBeLessThanOrEqual(oldAvgRenderTime * 1.1); // Allow 10% tolerance
  });
});
```

## Test Implementation Strategy

### 1. Start with Critical Paths

Begin by writing tests for the most critical functionality:

1. **Exam Taking Flow**: Start exam → Answer questions → Submit exam
2. **API Integration**: Data fetching → Error handling → Cache management
3. **Store Functionality**: State updates → Actions → Persistence

### 2. Use Test Doubles

Use different types of test doubles to isolate components:

1. **Mocks**: Replace real dependencies with mock implementations
2. **Stubs**: Provide canned answers to calls made during the test
3. **Spies**: Record calls made to a dependency
4. **Fakes**: Use simplified versions of real dependencies

### 3. Test Across Different Environments

Ensure tests run in different environments:

1. **Unit Tests**: Run in Node.js environment
2. **Component Tests**: Run in a browser-like environment (jsdom)
3. **E2E Tests**: Run in a real browser environment

### 4. Implement Continuous Testing

Set up automated testing:

1. **Pre-commit Hooks**: Run tests before committing code
2. **CI/CD Pipeline**: Run tests on every pull request and merge
3. **Nightly Builds**: Run comprehensive test suites overnight

## Test Coverage Goals

Aim for the following test coverage:

1. **Core Utilities**: 100% coverage
2. **API Layer**: 90% coverage
3. **Zustand Stores**: 90% coverage
4. **UI Components**: 80% coverage
5. **Integration Tests**: Cover all main user flows

## Testing Tools

Use these recommended tools:

1. **Jest**: For unit and integration testing
2. **React Testing Library**: For component testing
3. **Cypress**: For end-to-end testing
4. **MSW (Mock Service Worker)**: For API mocking
5. **react-hooks-testing-library**: For testing hooks
6. **jest-axe**: For accessibility testing
7. **Lighthouse**: For performance testing

## Test Organization

Organize tests to reflect the codebase structure:

```
src/
  features/
    exams/
      api/
        __tests__/
          services/
            examApiService.test.ts
          utils/
            transformers.test.ts
          hooks/
            useExamApiHooks.test.ts
      core/
        __tests__/
          types/
            index.test.ts
          utils/
            timeUtils.test.ts
      taking/
        __tests__/
          store/
            examTakingStore.test.ts
          components/
            ExamSession.test.tsx
            QuestionDisplay.test.tsx
      // ... other domains
```

## Test Naming Conventions

Use clear, descriptive test names:

```typescript
// Format: should [expected behavior] when [condition]
test('should update answers when option is selected', () => {
  // ...
});

// Format: [method] should [expected behavior]
test('startExam should fetch exam data and update state', async () => {
  // ...
});

// Format: [component] should [expected behavior]
test('QuestionDisplay should highlight selected option', () => {
  // ...
});
```

## Conclusion

A comprehensive testing strategy is essential for ensuring a successful refactoring. By implementing tests at multiple levels (unit, integration, and end-to-end), you can verify that the refactored code maintains the same functionality as the original code while improving maintainability and performance.

Remember to:
1. **Write tests early** in the refactoring process
2. **Test incrementally** as you refactor
3. **Automate testing** to catch regressions
4. **Focus on user flows** to ensure end-to-end functionality
5. **Test performance** to ensure the refactoring improves or maintains performance

Following these testing strategies will help ensure a smooth refactoring process and high-quality code.
