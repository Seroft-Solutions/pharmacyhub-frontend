# Exams Feature

This feature provides components, hooks, and utilities for working with exams in the PharmacyHub platform. It provides a comprehensive solution for:

- Displaying and taking exams
- Managing exam attempts
- Analyzing results
- Administration of exams

## Directory Structure

```
exams/
├── api/               # API integration using TanStack Query
│   ├── constants/     # API endpoint constants
│   ├── hooks/         # React Query hooks for data fetching
│   ├── services/      # Extended API services
│   ├── deprecated/    # Old implementations (to be removed)
│   └── index.ts       # Main API entry point
├── components/        # UI components
│   ├── admin/         # Admin-specific components
│   ├── layout/        # Layout components
│   ├── sidebar/       # Sidebar components
│   └── ...            # Other components
├── constants/         # Feature constants
├── hooks/             # Custom React hooks
├── model/deprecated   # Deprecated model types (use /types instead)
├── store/             # Zustand stores for state management
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── ui/                # Specialized UI components
└── index.ts           # Main feature entry point
```

## Usage

### API Integration

All API interactions should use the hooks provided in `api/hooks/` instead of direct API calls:

```tsx
import { examApiHooks } from '@/features/exams/api';

const MyComponent = () => {
  const { data: exams, isLoading, error } = examApiHooks.usePublishedExams();

  // Use the data
  return ...;
};
```

### Using Components

Import components directly from the feature:

```tsx
import { ExamContainer, ExamTimer, QuestionDisplay } from '@/features/exams';

const ExamPage = () => {
  return (
    <ExamContainer>
      <ExamTimer />
      <QuestionDisplay ... />
    </ExamContainer>
  );
};
```

### State Management

For complex state management, use the provided Zustand stores:

```tsx
import { useMcqExamStore } from '@/features/exams';

const ExamComponent = () => {
  const { 
    currentQuestion, 
    userAnswers, 
    answerQuestion 
  } = useMcqExamStore();

  const handleAnswer = (optionId) => {
    answerQuestion({
      questionId: currentQuestion.id, 
      selectedOption: optionId
    });
  };

  // Render UI
};
```

## Best Practices

1. **Use TanStack Query for API calls**  
   Always use the hooks from `examApiHooks` for any API interactions.

2. **Single Responsibility**  
   Keep components, hooks, and utilities focused on a single task.

3. **Type Safety**  
   Use the types from the `types` directory for type safety.

4. **Modular Structure**  
   Group related functionality in appropriate directories.

## Deprecated Code

Code in the `deprecated` folders is being phased out and should not be used in new features. It is kept temporarily for backward compatibility.
