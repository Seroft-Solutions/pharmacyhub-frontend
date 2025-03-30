# Exams Preparation API Integration

This feature leverages the core API module for all data fetching and mutation operations. Do NOT implement custom query or mutation patterns.

## Core API Components Used

- `apiClient` from `@/core/api/core/apiClient` - For all HTTP requests
- `useApiQuery` from `@/core/api/hooks` - For creating query hooks
- `useApiMutation` from `@/core/api/hooks` - For creating mutation hooks
- `createQueryKeyFactory` from `@/core/api/utils/queryKeyFactory` - For consistent query keys
- `handleApiError` from `@/core/api/core/error` - For error handling

## Pattern Examples

### Query Hook Example

```tsx
// Correct pattern using core
import { useApiQuery } from '@/core/api/hooks';
import { examsQueryKeys } from '../utils/queryKeys';
import { API_ENDPOINTS } from '../constants';

export const useExam = (examId: number, options = {}) => {
  return useApiQuery<Exam>(
    examsQueryKeys.detail(examId),
    API_ENDPOINTS.EXAM(examId),
    options
  );
};
```

### Mutation Hook Example

```tsx
// Correct pattern using core
import { useApiMutation } from '@/core/api/hooks';
import { examsQueryKeys } from '../utils/queryKeys';
import { API_ENDPOINTS } from '../constants';

export const useCreateExam = () => {
  return useApiMutation<Exam, Partial<Exam>>(
    API_ENDPOINTS.EXAMS,
    {
      onSuccess: (_, __, context) => {
        // Invalidate all exam lists on success
        context?.queryClient?.invalidateQueries({
          queryKey: examsQueryKeys.lists()
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

## Best Practices

1. Always use core API hooks instead of direct TanStack Query imports
2. Follow the established query key patterns for consistency
3. Use the API_ENDPOINTS constants for all endpoint references
4. Always handle invalidation in mutation hooks
5. Leverage the core error handling utilities
6. Use proper TypeScript typing throughout
7. Separate queries and mutations into logical groups
8. Use pagination utilities when dealing with lists

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
