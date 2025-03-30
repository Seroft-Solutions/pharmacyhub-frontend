# Exams Preparation API Module

This module provides a feature-specific API layer for the exams-preparation feature that leverages the core API module for data fetching and mutations.

## Core Integration

This feature strictly follows the "core as foundation" principle by:

- Using the core API module's `useApiQuery` and `useApiMutation` hooks for all data operations
- Following established patterns for query keys and caching
- Implementing consistent error handling through core utilities
- Providing a thin, domain-specific layer with proper typing

## Available Hooks

### Query Hooks

- `useExamsQuery` - For fetching a paginated list of exams with filtering
- `usePublishedExamsQuery` - For fetching published exams
- `useExamsByStatusQuery` - For fetching exams by status
- `useExamQuery` - For fetching a single exam by ID
- `useExamStatsQuery` - For fetching exam statistics
- `useExamQuestionsQuery` - For fetching questions for an exam
- `useQuestionQuery` - For fetching a single question
- `useExamAttemptsQuery` - For fetching attempts for an exam
- `useAttemptQuery` - For fetching a single attempt
- `useAttemptResultQuery` - For fetching results for an attempt
- `useExamAccessQuery` - For checking if a user has access to a premium exam

### Mutation Hooks

- `useCreateExamMutation` - For creating a new exam
- `useUpdateExamMutation` - For updating an existing exam
- `useDeleteExamMutation` - For deleting an exam
- `usePublishExamMutation` - For publishing an exam
- `useAddQuestionMutation` - For adding a question to an exam
- `useUpdateQuestionMutation` - For updating a question
- `useDeleteQuestionMutation` - For deleting a question
- `useReorderQuestionsMutation` - For reordering questions
- `useStartAttemptMutation` - For starting a new exam attempt
- `useSubmitAnswerMutation` - For submitting an answer during an attempt
- `useSubmitAttemptMutation` - For submitting a completed attempt
- `useAbandonAttemptMutation` - For abandoning an in-progress attempt
- `useCreatePaymentIntentMutation` - For creating a payment intent
- `useConfirmPaymentMutation` - For confirming a payment

## Usage Examples

### Fetching Exams

```tsx
import { useExamsQuery } from '@/features/exams-preparation/api';

function ExamsList() {
  const { data, isLoading, error } = useExamsQuery({
    page: 1,
    limit: 10,
    status: ExamStatus.PUBLISHED
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.data.map(exam => (
        <div key={exam.id}>{exam.title}</div>
      ))}
    </div>
  );
}
```

### Fetching a Single Exam

```tsx
import { useExamQuery } from '@/features/exams-preparation/api';

function ExamDetail({ examId }) {
  const { data, isLoading, error } = useExamQuery(examId);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      {/* ... */}
    </div>
  );
}
```

### Creating an Exam

```tsx
import { useCreateExamMutation } from '@/features/exams-preparation/api';

function CreateExamForm() {
  const { mutate, isLoading, error } = useCreateExamMutation();
  
  const handleSubmit = (formData) => {
    mutate(formData, {
      onSuccess: (data) => {
        console.log('Exam created:', data);
        // Handle success (e.g., redirect to the new exam)
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Query Invalidation

The mutation hooks automatically invalidate the relevant queries based on the operation performed. For example:

- Creating an exam invalidates the exams list queries
- Updating an exam invalidates both the list queries and the specific exam query
- Adding a question invalidates both the questions list and the exam detail (as the question count changes)

If you need to manually invalidate queries, you can use the exported query keys:

```tsx
import { examsQueryKeys } from '@/features/exams-preparation/api';
import { useQueryClient } from '@tanstack/react-query';

function SomeComponent() {
  const queryClient = useQueryClient();
  
  const invalidateExams = () => {
    queryClient.invalidateQueries({
      queryKey: examsQueryKeys.lists()
    });
  };
  
  // ...
}
```
