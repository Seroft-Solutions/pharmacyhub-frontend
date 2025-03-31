# Utilities and Testing Integration Guide

This document outlines how the exams-preparation feature integrates with core utilities and testing modules, following the Core as Foundation principle.

## Core Utilities Integration

### Logging Integration

The exams-preparation feature leverages the core logging module through a specialized exam logger:

```typescript
// src/features/exams-preparation/utils/logger.ts
import coreLogger from '@/core/utils/logger';

const examLogger = {
  // Core logger methods
  error: (message: string, meta?: any) => {
    coreLogger.error(`[Exams] ${message}`, meta);
  },
  
  // ... other methods
  
  // Exam-specific logging methods
  examStarted: (examId: number, userId?: string) => {
    coreLogger.info(`[Exams] User started exam`, { 
      examId, 
      userId, 
      action: 'exam_started' 
    });
  },
  
  // ... other exam-specific methods
};
```

Usage in components and services:

```typescript
import { examLogger } from '@/features/exams-preparation/utils';

function startExam(examId: number) {
  examLogger.examStarted(examId, currentUserId);
  // ... exam start logic
}
```

### Error Handling

The feature uses consistent error handling patterns that integrate with the core error handling:

```typescript
import { examLogger } from '@/features/exams-preparation/utils';
import { handleApiError } from '@/core/api/utils/errorHandling';

try {
  // API call or other operation
} catch (error) {
  // Log the error with context
  examLogger.examApiError('/exams/123', error);
  
  // Handle the error using core utilities
  const formattedError = handleApiError(error);
  
  // Update state or show error message
  setError(formattedError.message);
}
```

### Date and Time Formatting

While the feature has exam-specific time formatting utilities, it should leverage core date/time utilities for standard formats:

```typescript
import { formatDateTime } from '@/core/utils/dateTime';
import { formatTimeVerbose } from '@/features/exams-preparation/utils';

// Use feature-specific formatter for exam duration
const examDuration = formatTimeVerbose(timeInSeconds);

// Use core formatter for standard date/time display
const examStartDate = formatDateTime(examStartTime, 'YYYY-MM-DD HH:mm');
```

## Testing Integration

### Test Utilities

The exams-preparation feature builds on core testing utilities:

```typescript
// src/features/exams-preparation/utils/testUtils.ts
import { renderWithProviders as coreRenderWithProviders } from '@/core/testing';

// Additional providers specific to exams
export function renderWithExamProviders(ui, options = {}) {
  return coreRenderWithProviders(ui, {
    // Add exam-specific providers
    ...options,
  });
}
```

### Mock Data Generators

The feature provides mock data generators for testing:

```typescript
// src/features/exams-preparation/utils/testUtils.ts
export const mockExam = (override = {}) => ({
  id: 123,
  title: 'Mock Exam',
  // ... other default properties
  ...override
});

export const mockQuestion = (override = {}) => ({
  id: 456,
  examId: 123,
  // ... other default properties
  ...override
});
```

Usage in tests:

```typescript
import { mockExam, mockQuestion, renderWithExamProviders } from '@/features/exams-preparation/utils';

describe('ExamComponent', () => {
  it('renders exam information correctly', () => {
    const exam = mockExam({ title: 'Test Exam' });
    const { getByText } = renderWithExamProviders(<ExamComponent exam={exam} />);
    
    expect(getByText('Test Exam')).toBeInTheDocument();
  });
});
```

## Best Practices

### Logging

1. Use `examLogger` for all logging within the exams-preparation feature
2. Add appropriate context to log messages
3. Use the correct log level for different types of events:
   - `error`: For errors that affect functionality
   - `warn`: For potential issues or edge cases
   - `info`: For important events like exam start/completion
   - `debug`: For detailed information useful during development
   - `trace`: For very detailed debugging information

### Testing

1. Use the provided test utilities for consistent test setup
2. Use mock data generators for predictable test data
3. Test components with the appropriate providers
4. Test both success and error scenarios
5. Test boundary conditions and edge cases

### Utility Organization

1. Keep feature-specific utilities in the feature directory
2. Leverage core utilities for cross-cutting concerns
3. Create thin wrappers around core utilities when feature-specific behavior is needed
4. Document utility functions with JSDoc comments

## Example: Testing a Component

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { mockExam, renderWithExamProviders } from '@/features/exams-preparation/utils';
import { ExamSummary } from '../components/ExamSummary';

describe('ExamSummary', () => {
  it('displays correct exam information', () => {
    const exam = mockExam({
      title: 'Test Exam',
      description: 'Test Description',
      timeLimit: 60,
    });
    
    renderWithExamProviders(<ExamSummary exam={exam} />);
    
    expect(screen.getByText('Test Exam')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('60 minutes')).toBeInTheDocument();
  });
  
  it('handles start exam button click', () => {
    const exam = mockExam();
    const onStart = jest.fn();
    
    renderWithExamProviders(<ExamSummary exam={exam} onStart={onStart} />);
    
    const startButton = screen.getByText('Start Exam');
    fireEvent.click(startButton);
    
    expect(onStart).toHaveBeenCalledWith(exam.id);
  });
  
  it('displays premium badge for premium exams', () => {
    const exam = mockExam({ isPremium: true });
    
    renderWithExamProviders(<ExamSummary exam={exam} />);
    
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });
  
  it('does not display premium badge for regular exams', () => {
    const exam = mockExam({ isPremium: false });
    
    renderWithExamProviders(<ExamSummary exam={exam} />);
    
    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });
});
```

## Example: Using the Logger

```typescript
import { examLogger } from '@/features/exams-preparation/utils';

function ExamController() {
  const { examId } = useParams();
  const { user } = useAuth();
  
  const startExam = () => {
    examLogger.examStarted(examId, user?.id);
    // ... implementation
  };
  
  const completeExam = (score) => {
    examLogger.examCompleted(examId, score, user?.id);
    // ... implementation
  };
  
  const answerQuestion = (questionId, answer) => {
    const isCorrect = checkAnswer(questionId, answer);
    examLogger.questionAnswered(examId, questionId, isCorrect, user?.id);
    // ... implementation
  };
  
  // ... rest of component
}
```
