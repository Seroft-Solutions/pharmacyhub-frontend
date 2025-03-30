# Exams Preparation API Integration

This feature leverages the core API module for all data fetching and mutation operations. Do NOT implement custom query or mutation patterns.

## Core API Components Used

- `apiClient` from `@/core/api/core/apiClient` - For all HTTP requests
- `useApiQuery` from `@/core/api/hooks` - For creating query hooks
- `useApiMutation` from `@/core/api/hooks` - For creating mutation hooks
- `createQueryKeyFactory` from `@/core/api/utils/queryKeyFactory` - For consistent query keys
- `handleApiError`, `createApiError` from `@/core/api/core/error` - For error handling

## Pattern Examples

### Query Hook Example

```tsx
// Correct pattern using core
import { useApiQuery } from '@/core/api/hooks';
import { examsQueryKeys } from '../utils/queryKeys';
import { API_ENDPOINTS } from '../constants';
import { handleExamError } from '../utils/errorHandler';

export const useExam = (examId: number, options = {}) => {
  return useApiQuery<Exam>(
    examsQueryKeys.detail(examId),
    API_ENDPOINTS.EXAM(examId),
    {
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          examId,
          action: 'fetch-exam',
          endpoint: API_ENDPOINTS.EXAM(examId)
        });
      },
      ...options
    }
  );
};
```

### Mutation Hook Example

```tsx
// Correct pattern using core
import { useApiMutation } from '@/core/api/hooks';
import { examsQueryKeys } from '../utils/queryKeys';
import { API_ENDPOINTS } from '../constants';
import { handleExamError } from '../utils/errorHandler';

export const useCreateExam = () => {
  return useApiMutation<Exam, Partial<Exam>>(
    API_ENDPOINTS.EXAMS,
    {
      onSuccess: (_, __, context) => {
        // Invalidate all exam lists on success
        context?.queryClient?.invalidateQueries({
          queryKey: examsQueryKeys.lists()
        });
      },
      onError: (error, variables) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'create-exam',
          endpoint: API_ENDPOINTS.EXAMS
        });
      }
    }
  );
};
```

### Query Keys Example

```tsx
// Correct pattern using core
import { createQueryKeyFactory } from '@/core/api/utils/queryKeyFactory';

export const examKeys = createQueryKeyFactory<
  | 'published'
  | 'status'
  | 'questions'
  | 'stats'
>('exams-preparation');

// Usage example
examKeys.detail(123); // ['exams-preparation', 'detail', 123]
examKeys.action('published'); // ['exams-preparation', 'published']
```

## Error Handling

The exams-preparation feature uses the core API error handling utilities for consistent error handling across the application. All API hooks include proper error handling using the `handleExamError` utility.

### Error Handling Utility

```tsx
import { handleError, ApiError } from '@/core/api/core/error';

export interface ExamErrorContext {
  examId?: number;
  attemptId?: number;
  questionId?: number;
  paperId?: number;
  endpoint?: string;
  action?: string;
}

export function handleExamError(
  error: any, 
  context: ExamErrorContext = {}
): ApiError {
  // Add feature-specific context
  const enhancedContext = {
    ...context,
    feature: 'exams-preparation'
  };
  
  // Use the core error handling with our enhanced context
  return handleError(error, {
    context: enhancedContext,
    rethrow: true
  });
}
```

### Error Handling in Components

Use the error information from API hooks for displaying appropriate messages to users:

```tsx
import { useExam } from '../api/hooks';
import { isValidationError, getUserFriendlyErrorMessage } from '../api/utils/errorHandler';

function ExamDetailComponent({ examId }) {
  const { data, error, isLoading } = useExam(examId);
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    const message = getUserFriendlyErrorMessage(error);
    return <ErrorState message={message} />;
  }
  
  return <ExamDetail exam={data} />;
}
```

## Best Practices

1. Always use core API hooks instead of direct TanStack Query imports
2. Follow the established query key patterns for consistency
3. Use the API_ENDPOINTS constants for all endpoint references
4. Always handle invalidation in mutation hooks
5. Leverage the core error handling utilities
6. Use proper TypeScript typing throughout
7. Separate queries and mutations into logical groups
8. Use pagination utilities when dealing with lists
9. Include proper error handling in all API hooks
10. Use domain-specific context in error handlers

## Extending Core Functionality

If you need functionality that doesn't exist in the core module:

1. First, check if it can be added to the core module
2. If not, create a thin wrapper around core functionality
3. Document why you needed to extend core functionality
4. Ensure your extension follows the same patterns and conventions

## Troubleshooting

If you encounter issues with the core API integration:

1. Check query keys for proper structure
2. Verify endpoint URLs for correct formatting
3. Ensure you're using the core API client and not direct fetch/axios
4. Look for invalidation issues if data isn't refreshing
5. Check typing for proper generics usage
6. Use the proper error type checking utilities for handling different error scenarios
