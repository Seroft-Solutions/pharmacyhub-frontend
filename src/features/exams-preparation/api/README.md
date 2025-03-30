# Exams Preparation API Integration

This feature leverages the core API module for all data fetching and mutation operations. Do NOT implement custom query or mutation patterns.

## Core API Components Used

- `apiClient` from `@/core/api/core/apiClient` - For all HTTP requests
- `useApiQuery` from `@/core/api/hooks` - For creating query hooks
- `useApiMutation` from `@/core/api/hooks` - For creating mutation hooks
- `createQueryKeyFactory` from `@/core/api/utils/queryKeyFactory` - For consistent query keys
- `handleApiError`, `createApiError` from `@/core/api/core/error` - For error handling
- `createEndpoints` from `@/core/api/utils/endpointUtils` - For endpoint constants

## Pattern Examples

### Endpoint Constants Example

```tsx
// Correct pattern using core
import { createEndpoints } from '@/core/api/utils/endpointUtils';

// Base API path for exams
const EXAMS_BASE_PATH = 'v1/exams-preparation';

// Create exam endpoints using core factory
export const API_ENDPOINTS = createEndpoints(EXAMS_BASE_PATH, {
  // Custom endpoints for exams
  PUBLISHED: `${EXAMS_BASE_PATH}/published`,
  BY_STATUS: (status: string) => `${EXAMS_BASE_PATH}/status/${status}`,
  
  // Exam operations
  PUBLISH: (id: number) => `${EXAMS_BASE_PATH}/${id}/publish`,
  
  // Questions
  QUESTIONS: (examId: number) => `${EXAMS_BASE_PATH}/${examId}/questions`,
});
```

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
    API_ENDPOINTS.DETAIL(examId),
    {
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          examId,
          action: 'fetch-exam',
          endpoint: API_ENDPOINTS.DETAIL(examId)
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
    API_ENDPOINTS.CREATE,
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
          endpoint: API_ENDPOINTS.CREATE
        });
      }
    }
  );
};
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

## Endpoint Management

All API endpoints are defined using the core `createEndpoints` utility to ensure consistent endpoint patterns across the application.

### Endpoint Definition Example

```tsx
const EXAMS_BASE_PATH = 'v1/exams-preparation';

// Create exam endpoints with standard CRUD operations
export const API_ENDPOINTS = createEndpoints(EXAMS_BASE_PATH, {
  // The factory automatically adds these standard endpoints:
  // BASE, LIST, DETAIL(id), CREATE, UPDATE(id), PATCH(id), DELETE(id)
  
  // Custom endpoints
  PUBLISHED: `${EXAMS_BASE_PATH}/published`,
  BY_STATUS: (status: string) => `${EXAMS_BASE_PATH}/status/${status}`,
});

// Usage:
API_ENDPOINTS.LIST;            // '/api/v1/exams-preparation'
API_ENDPOINTS.DETAIL(123);     // '/api/v1/exams-preparation/123'
API_ENDPOINTS.PUBLISHED;       // '/api/v1/exams-preparation/published'
API_ENDPOINTS.BY_STATUS('active'); // '/api/v1/exams-preparation/status/active'
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
11. Define all endpoints using the core `createEndpoints` utility
12. Group related endpoints logically

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
