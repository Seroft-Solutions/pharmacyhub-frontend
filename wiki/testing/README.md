# Testing Guide

## Test Utilities

### Custom Render
```typescript
// src/test/utils/test-utils.tsx
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/shared/lib/providers/ThemeProvider';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

export function renderWithProviders(
  ui: React.ReactElement,
  { 
    queryClient = createTestQueryClient(),
    ...renderOptions 
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
```

### Mock Utilities

```typescript
// src/test/utils/mock-data.ts
export const mockExam = {
  id: '1',
  title: 'Mock Exam',
  questions: [
    {
      id: '1',
      text: 'Sample question',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 'A'
    }
  ],
  duration: 3600,
  totalMarks: 100
};

export const mockUser = {
  id: '1',
  username: 'testuser',
  role: 'PHARMACIST',
  permissions: ['read:exam', 'write:exam']
};

// src/test/utils/mock-handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        token: 'mock-token',
        user: mockUser
      })
    );
  }),
  
  rest.get('/api/exam/papers', (req, res, ctx) => {
    return res(
      ctx.json([mockExam])
    );
  })
];
```

## Component Testing Patterns

### Form Testing

```typescript
// src/__tests__/components/forms/RegistrationForm.test.tsx
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils/test-utils';
import { RegistrationForm } from '@/features/auth/ui/register/RegistrationForm';

describe('RegistrationForm', () => {
  it('should validate required fields', async () => {
    renderWithProviders(<RegistrationForm />);
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('should validate password requirements', async () => {
    renderWithProviders(<RegistrationForm />);
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'weak' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i))
        .toBeInTheDocument();
    });
  });
});
```

### Async Component Testing

```typescript
// src/__tests__/components/exam/ExamResults.test.tsx
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils/test-utils';
import { ExamResults } from '@/features/exam/ui/results/ResultsView';
import { mockExam } from '@/test/utils/mock-data';

describe('ExamResults', () => {
  it('should display loading state', () => {
    renderWithProviders(<ExamResults examId="1" />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should display exam results', async () => {
    renderWithProviders(<ExamResults examId="1" />);
    
    await waitFor(() => {
      expect(screen.getByText(mockExam.title)).toBeInTheDocument();
      expect(screen.getByText(/total score/i)).toBeInTheDocument();
    });
  });

  it('should handle error state', async () => {
    // Mock API error
    server.use(
      rest.get('/api/exam/1/results', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    renderWithProviders(<ExamResults examId="1" />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading results/i)).toBeInTheDocument();
    });
  });
});
```

## State Management Testing

### Zustand Store Testing

```typescript
// src/__tests__/store/examStore.test.ts
import { create } from 'zustand';
import { createExamSlice, ExamSlice } from '@/features/exam/model/store';

describe('Exam Store', () => {
  let store: ReturnType<typeof create<ExamSlice>>;

  beforeEach(() => {
    store = create<ExamSlice>((...args) => ({
      ...createExamSlice(...args)
    }));
  });

  it('should update current question', () => {
    store.getState().setCurrentQuestion(2);
    expect(store.getState().currentQuestion).toBe(2);
  });

  it('should track answered questions', () => {
    store.getState().setAnswer(1, 'A');
    expect(store.getState().answers[1]).toBe('A');
    expect(store.getState().isQuestionAnswered(1)).toBe(true);
  });
});
```

### React Query Testing

```typescript
// src/__tests__/features/exam/queries.test.ts
import { renderHook, waitFor } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useExamQuery } from '@/features/exam/api/queries';

describe('Exam Queries', () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should fetch exam data', async () => {
    const { result } = renderHook(() => useExamQuery('1'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockExam);
  });
});
```

## Test Coverage

### Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/test/**/*'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Coverage Scripts

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

## Best Practices

### 1. Testing Guidelines
- Write tests as specifications
- Test behavior, not implementation
- Keep tests focused and isolated
- Use meaningful assertions
- Follow the Arrange-Act-Assert pattern

### 2. Component Testing
- Test user interactions
- Test accessibility
- Test error states
- Test loading states
- Test edge cases

### 3. Integration Testing
- Test feature workflows
- Test data flow
- Test error handling
- Test state management
- Test routing

### 4. Performance Testing
- Test component rendering
- Test data fetching
- Test state updates
- Test memory usage
- Test bundle size

## CI/CD Integration

### GitHub Actions Configuration

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test:ci
        
      - name: Upload coverage
        uses: actions/upload-artifact@v3
        with:
          name: coverage
          path: coverage/
```

## Testing Policy

### 1. Test Requirements
- Unit tests for all new components
- Integration tests for features
- E2E tests for critical paths
- Maintain minimum coverage thresholds

### 2. Review Process
- Test review in PR process
- Coverage report review
- Performance impact review
- Accessibility testing review

### 3. Documentation
- Test documentation
- Testing patterns
- Mock data documentation
- Testing utilities documentation