# Exam Feature Structure and Organization

## Component Structure

The exam feature is organized as follows:

```
src/
└── features/
    └── exams/
        ├── api/
        │   └── examApi.ts          # API service functions
        ├── hooks/
        │   └── useExamQueries.ts   # React Query hooks
        ├── model/
        │   └── mcqTypes.ts         # TypeScript interfaces
        ├── store/
        │   └── examStore.ts        # Zustand state store
        └── ui/
            ├── ExamContainer.tsx   # Main container component
            ├── ExamList.tsx        # List of available exams
            └── components/         # Smaller UI components
                ├── QuestionDisplay.tsx
                ├── QuestionNavigation.tsx
                ├── ExamProgress.tsx
                ├── ExamTimer.tsx
                ├── ExamSummary.tsx
                └── ExamResults.tsx
```

## Pages Structure

```
src/
└── app/
    ├── exams/
    │   └── page.tsx               # Available exams listing page
    └── (exams)/
        └── exam/
            └── [id]/
                └── page.tsx       # Individual exam page
```

## State Management

The exam feature uses a combination of state management techniques:

1. **React Query**: For server state and API integration
2. **Zustand**: For client-side state that persists across page refreshes
3. **React state**: For component-level state

## Data Flow

1. User visits `/exams` to see available exams
2. Clicks on an exam to go to `/exam/[id]`
3. ExamContainer manages the entire exam-taking flow:
   - Start exam
   - Navigate between questions
   - Answer questions
   - Flag questions for review
   - View summary
   - Submit exam
   - See results

## API Integration

API integration is handled by `examApi.ts` and exposed through React Query hooks in `useExamQueries.ts`.

## Component Responsibilities

- **ExamContainer**: Overall exam flow and state management
- **QuestionDisplay**: Renders a question with answer options
- **QuestionNavigation**: Handles navigation between questions
- **ExamProgress**: Shows progress through the exam
- **ExamTimer**: Countdown timer
- **ExamSummary**: Review screen before submission
- **ExamResults**: Shows exam results after submission

## File Naming Conventions

- React components use PascalCase (e.g., `ExamContainer.tsx`)
- Hooks use camelCase with "use" prefix (e.g., `useExamQueries.ts`)
- API services use camelCase (e.g., `examApi.ts`)
- Type definitions use camelCase (e.g., `mcqTypes.ts`)
