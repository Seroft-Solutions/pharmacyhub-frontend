# Exams Preparation Core API Integration Guide

This guide provides a reference for how the exams-preparation feature integrates with the core API module and follows the "core as foundation" principle.

## Overview

The exams-preparation feature's API layer is built as a thin, domain-specific layer on top of the core API module. It follows these key principles:

1. **Use core, don't duplicate**: Leverages core API utilities instead of reimplementing functionality
2. **Clean public API**: Exports a well-defined, easy-to-use API for the feature components
3. **Proper typing**: Provides TypeScript interfaces for type safety
4. **Consistent patterns**: Follows established patterns for query keys, error handling, etc.

## Directory Structure

The API layer is organized as follows:

```
/src/features/exams-preparation/api/
  /constants/            # API constants
    /endpoints.ts        # Endpoint definitions
    /index.ts            # Export constants
  /hooks/                # Feature-specific API hooks
    /useExamsQuery.ts    # Hooks for fetching exams lists
    /useExamQuery.ts     # Hooks for fetching a single exam
    /useExamQuestionsQuery.ts # Hooks for fetching questions
    /useExamMutations.ts # Hooks for exam mutations
    /useQuestionMutations.ts # Hooks for question mutations
    /useAttemptQueries.ts # Hooks for attempt queries
    /useAttemptMutations.ts # Hooks for attempt mutations
    /usePaymentHooks.ts  # Hooks for payment functionality
    /index.ts            # Export all hooks
  /utils/                # API utilities
    /queryKeys.ts        # Query key definitions
    /index.ts            # Export utilities
  /__tests__/            # Tests for API hooks
  /index.ts              # Public API for the feature's API layer
  /README.md             # Documentation for the API layer
```

## Core API Components Used

The exams-preparation feature uses the following core API components:

- `useApiQuery` from `@/core/api/hooks/query/useApiQuery` for data fetching
- `useApiMutation` from `@/core/api/hooks/mutation/useApiMutation` for data mutations
- `createEndpoints` from `@/core/api/utils/endpointUtils` for endpoint management
- `createQueryKeyFactory` from `@/core/api/utils/queryKeyFactory` for query key management
- `handleApiError` from `@/core/api/core/error` for error handling
- `apiClient` from `@/core/api/core/apiClient` for direct API access (when needed)

## Usage Examples

### Query Hooks

Here's an example of a query hook that fetches a list of exams with filtering:

```typescript
// src/features/exams-preparation/api/hooks/useExamsQuery.ts
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';
import { EXAM_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';
import { Exam, ExamStatus, PaginatedResponse } from '../../types';

export interface UseExamsQueryOptions {
  page?: number;
  limit?: number;
  status?: ExamStatus;
  search?: string;
  isPremium?: boolean;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  tag?: string;
  enabled?: boolean;
}

export function useExamsQuery(options: UseExamsQueryOptions = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    isPremium,
    sortBy,
    sortDir,
    tag,
    enabled = true,
  } = options;

  // Build query parameters
  const params = {
    page,
    limit,
    ...(status && { status }),
    ...(search && { search }),
    ...(isPremium !== undefined && { isPremium }),
    ...(sortBy && { sortBy }),
    ...(sortDir && { sortDir }),
    ...(tag && { tag }),
  };

  return useApiQuery<PaginatedResponse<Exam>>(
    examsQueryKeys.lists(params),
    EXAM_ENDPOINTS.LIST,
    {
      params,
      enabled,
    }
  );
}
```

### Mutation Hooks

Here's an example of a mutation hook for creating an exam:

```typescript
// src/features/exams-preparation/api/hooks/useExamMutations.ts
import { useApiMutation } from '@/core/api/hooks/mutation/useApiMutation';
import { EXAM_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';
import { Exam } from '../../types';

export interface CreateExamPayload {
  title: string;
  description?: string;
  timeLimit: number;
  passingScore: number;
  status: string;
  isPremium: boolean;
  price?: number;
}

export function useCreateExamMutation() {
  return useApiMutation<Exam, CreateExamPayload>(
    EXAM_ENDPOINTS.CREATE,
    {
      onSuccess: (_, __, context) => {
        // Invalidate the exams list queries to refetch after creation
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.lists(),
        });
      }
    }
  );
}
```

### Endpoint Management

Here's how we define endpoints using core utilities:

```typescript
// src/features/exams-preparation/api/constants/endpoints.ts
import { createEndpoints } from '@/core/api/utils/endpointUtils';

export const EXAM_ENDPOINTS = createEndpoints('v1/exams-preparation', {
  // Custom endpoints beyond standard CRUD
  PUBLISHED: `${createEndpoints('v1/exams-preparation').BASE}/published`,
  BY_STATUS: (status: string) => `${createEndpoints('v1/exams-preparation').BASE}/status/${status}`,
  
  // Nested resource endpoints
  QUESTIONS: (examId: number) => `${createEndpoints('v1/exams-preparation').BASE}/${examId}/questions`,
  QUESTION_DETAIL: (examId: number, questionId: number) => 
    `${createEndpoints('v1/exams-preparation').BASE}/${examId}/questions/${questionId}`,
});
```

### Query Keys

Here's how we define query keys using core utilities:

```typescript
// src/features/exams-preparation/api/utils/queryKeys.ts
import { createQueryKeyFactory } from '@/core/api/utils/queryKeyFactory';
import { ExamStatus } from '../../types';

export const examKeys = createQueryKeyFactory<
  | 'published'
  | 'status'
  | 'questions'
  | 'stats'
  | 'attempts'
  | 'results'
>('exams-preparation');

export const examsQueryKeys = {
  // Get all exams
  all: examKeys.all,
  
  // Get lists of exams with optional filters
  lists: (filters?: Record<string, any>) => examKeys.lists(filters),
  
  // Get exam detail by ID
  detail: (id: number) => examKeys.detail(id),
  
  // Published exams
  published: () => examKeys.action('published'),
  
  // More query keys...
};
```

## Component Usage

Here's how components in the exams-preparation feature use the API hooks:

```tsx
// Example component
import { useExamsQuery } from '@/features/exams-preparation/api';
import { ExamStatus } from '@/features/exams-preparation/types';

function ExamsList() {
  const { data, isLoading, error } = useExamsQuery({
    status: ExamStatus.PUBLISHED,
    limit: 20
  });
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {data?.data.map(exam => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
      <Pagination 
        currentPage={data?.meta.page} 
        totalPages={data?.meta.totalPages} 
      />
    </div>
  );
}
```

## Testing

The API hooks are tested to ensure proper integration with the core API module:

```typescript
// src/features/exams-preparation/api/__tests__/useExamQuery.test.ts
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useExamQuery } from '../hooks/useExamQuery';
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';

// Mock the core API module
jest.mock('@/core/api/hooks/query/useApiQuery');

// Test implementation...
```

## Best Practices

When working with the exams-preparation API layer, follow these best practices:

1. **Use the exported hooks** from `@/features/exams-preparation/api` rather than accessing individual files
2. **Don't bypass the feature API layer** by using core hooks directly in components
3. **Follow the established patterns** for new hooks or functionality
4. **Maintain proper typing** for all parameters and return values
5. **Write tests** for new hooks to ensure proper core integration
6. **Document** any new hooks or patterns you add

## Extending the API Layer

If you need to add new API functionality to the exams-preparation feature:

1. Determine if it fits into an existing hook or needs a new one
2. Create a new hook file if needed, following the established patterns
3. Use core API utilities for implementation
4. Add proper typing
5. Export from the appropriate index.ts file
6. Write tests for the new functionality
7. Update this documentation if the functionality is significant

## Troubleshooting

If you encounter issues with the exams-preparation API layer:

1. Check if the hook is being used correctly (parameters, options, etc.)
2. Verify that the API endpoint is correct and accessible
3. Check the network tab in dev tools for API errors
4. Ensure that authentication is properly configured if needed
5. Verify that query keys are consistent between queries and invalidations
6. Check for proper error handling

For more detailed troubleshooting, refer to the [Core API Integration Guide](../../../../../docs/02-architecture/api/core-api-integration-guide.md).

---

For questions or issues, please contact the architecture team.
