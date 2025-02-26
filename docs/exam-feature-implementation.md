# Exam Feature Implementation

This document outlines the implementation of the PharmacyHub exam feature, focusing on React Query integration with the application's API client.

## Architecture Overview

The exam feature follows a layered architecture pattern:

1. **API Layer**: Provides functions to interact with the backend API endpoints
2. **Hooks Layer**: Encapsulates React Query for data fetching and mutations
3. **UI Layer**: Components that consume hooks and display data to users

## API Integration

### Exam API Service

The exam API service (`examApi.ts`) uses the main application's API client for making HTTP requests to exam-related endpoints. This approach ensures consistent error handling, authentication, and caching across the application.

```typescript
// Example API method
getExamById: async (examId: number): Promise<Exam> => {
  const response = await apiClient.get<Exam>(`${BASE_PATH}/${examId}`);
  if (response.error) throw response.error;
  if (!response.data) throw new Error('Exam not found');
  return response.data;
}
```

### React Query Integration

The custom hooks in `useExamQueries.ts` integrate React Query with the API service, providing:

- Structured query keys for proper caching
- Automatic refetching and cache invalidation
- Loading, error, and data states
- Mutations for data modification operations

```typescript
// Example React Query hook
export function useExam(examId: number | undefined) {
  return useQuery({
    queryKey: EXAM_KEYS.detail(examId as number),
    queryFn: () => examApi.getExamById(examId as number),
    enabled: !!examId,
  });
}
```

## Key Features

### Data Fetching

- Automatic data loading with loading states
- Proper error handling
- Cache management (stale time, refetch policies)

### Data Mutations

- Optimistic updates
- Cache invalidation
- Error handling

### State Management

- React Query for server state
- Zustand for client-only state (exam progress, user answers)
- Clear separation of concerns

## Usage Examples

### Fetching Exam Data

```tsx
// In a component:
const { data: exam, isLoading, error } = useExam(examId);

if (isLoading) return <Loading />;
if (error) return <ErrorDisplay error={error} />;
if (!exam) return <NotFound />;

return <ExamDisplay exam={exam} />;
```

### Starting an Exam

```tsx
const { startExam, isStarting } = useExamSession(examId);

// In an event handler:
const handleStartExam = () => {
  startExam(
    { userId },
    {
      onSuccess: (data) => {
        // Handle success
      },
      onError: (error) => {
        // Handle error
      }
    }
  );
};
```

## Component Hierarchy

- `ExamList` - Displays available exams
- `ExamContainer` - Main exam UI that handles exam session state
  - Exam Start View
  - Question Navigation
  - Answer Selection
  - Exam Completion

## Future Improvements

1. **Offline Support**: Implement offline capabilities using React Query's persistQueryClient plugin
2. **Performance Optimization**: Prefetch exams for smoother navigation
3. **Analytics Integration**: Track user progress and performance metrics
4. **Accessibility Enhancements**: Ensure all exam components are fully accessible
5. **Test Coverage**: Add comprehensive tests for API, hooks, and components

## Migration Guide

When migrating existing components to use the new React Query implementation:

1. Replace direct API calls with React Query hooks
2. Update UI components to handle loading/error states
3. Use mutations for data modifications
4. Leverage the query client for cache operations
