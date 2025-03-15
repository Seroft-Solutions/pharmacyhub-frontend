# Exam API

This module provides a comprehensive set of hooks and services for exam-related operations. It leverages the tanstack-query-api feature for consistent API handling across the application.

## Usage

### React Components

For React components, use the hooks from this module for all API operations. This ensures proper data caching, revalidation, and error handling.

```tsx
import { useExamDetail, useExamQuestions } from '@/features/exams/api';

function ExamDetails({ examId }) {
  // Fetch exam details
  const { 
    data: exam, 
    isLoading: examLoading, 
    error: examError 
  } = useExamDetail(examId);
  
  // Fetch exam questions
  const { 
    data: questions, 
    isLoading: questionsLoading, 
    error: questionsError 
  } = useExamQuestions(examId);
  
  // Handle loading and error states
  if (examLoading || questionsLoading) return <LoadingSpinner />;
  if (examError || questionsError) return <ErrorMessage />;
  
  // Render the exam details
  return (
    <div>
      <h1>{exam.title}</h1>
      <p>{exam.description}</p>
      
      <h2>Questions ({questions.length})</h2>
      {questions.map(question => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
}
```

### Non-React Code (Stores, Utils, etc.)

For non-React code like Zustand stores, use the services from this module for API operations.

```tsx
import { create } from 'zustand';
import { examStoreAdapter } from '@/features/exams/api';

export const useExamStore = create((set, get) => ({
  currentExam: null,
  questions: [],
  attemptId: null,
  
  // Load exam
  loadExam: async (examId) => {
    try {
      const exam = await examStoreAdapter.getExamById(examId);
      const questions = await examStoreAdapter.getExamQuestions(examId);
      
      set({ currentExam: exam, questions });
      return true;
    } catch (error) {
      console.error('Failed to load exam:', error);
      return false;
    }
  },
  
  // Start exam
  startExam: async (examId) => {
    try {
      const attempt = await examStoreAdapter.startExam(examId);
      set({ attemptId: attempt.id });
      return attempt;
    } catch (error) {
      console.error('Failed to start exam:', error);
      return null;
    }
  }
}));
```

## Architecture

The module is organized into three main parts:

1. **Hooks**: React hooks for fetching and mutating exam data
   - `useExamApiHooks.ts`: Core exam hooks
   - `useExamAttemptHooks.ts`: Exam attempt hooks
   - `useExamPaperHooks.ts`: Exam paper hooks

2. **Services**: Services for non-React code to interact with the API
   - `examApiService.ts`: Comprehensive API service for all exam operations
   - `examStoreAdapter.ts`: Simplified adapter for Zustand stores
   - `jsonExamUploadService.ts`: Service for handling JSON exam uploads

3. **Constants**: Shared constants for endpoints and permissions
   - `endpoints.ts`: API endpoint constants
   - `permissions.ts`: Permission constants

## Best Practices

1. **Always use hooks in React components**
   - They provide optimized caching, revalidation, and loading/error states

2. **Use the storeAdapter for Zustand stores**
   - Simplified interface with minimal error handling for store usage

3. **Use constants for endpoints and permissions**
   - Prevents typos and makes changes easier to manage

4. **Don't create new API calls outside this module**
   - If you need a new API call, add it to this module first

5. **Follow the conventions for naming**
   - Hooks: `use[Resource][Operation]`
   - Services: `[resource]ApiService`
   - Constants: `[RESOURCE]_[TYPE]`
