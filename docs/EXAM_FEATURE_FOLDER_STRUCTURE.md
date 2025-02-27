# Exam Feature Implementation - Folder Structure

## Required Folder Structure

To implement the exam feature, ensure the following folder structure is in place:

```
src/
├── app/
│   ├── exams/
│   │   └── page.tsx                   # List of available exams 
│   └── (exams)/                       # Route group for exam-related routes
│       └── exam/
│           └── [id]/
│               └── page.tsx           # Exam page with dynamic id parameter
├── components/
│   ├── layout/
│   │   └── container.tsx              # Layout component for page content
│   └── ui/                            # shadcn/ui components
│       ├── alert.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── label.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── separator.tsx
│       ├── skeleton.tsx
│       └── tabs.tsx
├── features/
│   └── exams/
│       ├── api/
│       │   └── examApi.ts             # API service functions
│       ├── hooks/
│       │   └── useExamQueries.ts      # React Query hooks
│       ├── model/
│       │   └── mcqTypes.ts            # TypeScript interfaces
│       ├── store/
│       │   └── examStore.ts           # Zustand state store
│       └── ui/
│           ├── ExamContainer.tsx      # Main container component 
│           ├── ExamList.tsx           # List of available exams
│           └── components/            # Smaller UI components
│               ├── ExamProgress.tsx
│               ├── ExamResults.tsx
│               ├── ExamSummary.tsx
│               ├── ExamTimer.tsx
│               ├── QuestionDisplay.tsx
│               └── QuestionNavigation.tsx
└── hooks/
    └── useClickOutside.ts             # Custom React hook for click outside detection
```

## Component Placement

- `ExamContainer.tsx` should be directly in `src/features/exams/ui/`
- All smaller components should be in `src/features/exams/ui/components/`
- No components should be in an `enhanced` folder

## Route Structure

Make sure the Next.js pages are correctly structured:

1. All exams listing page: `src/app/exams/page.tsx`
2. Individual exam page: `src/app/(exams)/exam/[id]/page.tsx`

## Imports

Update all imports to point to the correct locations. For example:

```tsx
// In src/app/(exams)/exam/[id]/page.tsx
import { ExamContainer } from '@/features/exams/ui/ExamContainer';

// In src/features/exams/ui/ExamContainer.tsx
import { QuestionDisplay } from './components/QuestionDisplay';
import { QuestionNavigation } from './components/QuestionNavigation';
import { ExamProgress } from './components/ExamProgress';
import { ExamTimer } from './components/ExamTimer';
import { ExamSummary } from './components/ExamSummary';
import { ExamResults } from './components/ExamResults';
```

## Integration Points

- All components should use shadcn/ui components for UI elements
- Use `examStore.ts` for client-side state management
- Use `useExamQueries.ts` for API integration via React Query
- Use `mcqTypes.ts` for TypeScript type definitions
