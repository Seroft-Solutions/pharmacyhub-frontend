# PharmacyHub MCQ Exam Feature

This README provides an overview of the MCQ (Multiple Choice Question) exam feature implementation in PharmacyHub.

## Architecture

The MCQ exam feature follows a feature-based architecture, organized as follows:

```
src/features/exams/
├── api/                  # API services for exams
│   ├── examService.ts    # Service to communicate with backend API
│   └── index.ts
├── model/                # Type definitions
│   ├── mcqTypes.ts       # MCQ-specific types
│   ├── types.ts          # General exam types
│   └── index.ts
├── store/                # State management
│   ├── examStore.ts      # Original Zustand store
│   ├── mcqExamStore.ts   # MCQ-specific Zustand store
│   └── index.ts
├── ui/                   # UI components
│   ├── mcq/              # MCQ-specific UI components
│   │   ├── McqExamLayout.tsx
│   │   ├── McqQuestionCard.tsx
│   │   ├── McqQuestionNavigation.tsx
│   │   ├── McqExamResults.tsx
│   │   ├── McqExamList.tsx
│   │   └── index.ts
│   ├── quiz/             # Original quiz components (for reference)
│   └── index.ts
└── index.ts              # Feature entry point
```

## Implementation

### Data Flow

1. User browses to `/exams` to see available exams
2. User selects an exam to start, navigating to `/exams/[id]`
3. Exam session starts, loading questions from the backend
4. User answers questions and navigates between them
5. User submits the exam when finished
6. Results are calculated and displayed at `/exams/results`

### Key Components

- **McqExamList**: Displays all available published exams
- **McqExamLayout**: Main exam taking interface with question display and navigation
- **McqQuestionCard**: Displays individual questions and answer options
- **McqQuestionNavigation**: Side panel for navigating between questions
- **McqExamResults**: Displays exam results and performance feedback

### State Management

We use Zustand for state management. The `mcqExamStore` handles:

- Loading exam data
- Managing the current question index
- Tracking user answers
- Handling exam time remaining
- Processing exam submission
- Storing and displaying results

### API Integration

The `examService` communicates with the backend API, matching the `ExamController` endpoints:

- `GET /api/exams/published` - List published exams
- `GET /api/exams/:id` - Get exam by ID
- `POST /api/exams/:id/start` - Start an exam session
- `POST /api/exams/attempts/:id/submit` - Submit exam answers

## Usage

To start using the exam feature:

1. Navigate to `/exams` to view available exams
2. Click "Start Exam" on any exam card
3. Answer questions, using the navigation panel to move between questions
4. Submit the exam when finished
5. View your results and performance feedback

## Mock Data

For development purposes, the implementation includes mock data that simulates the backend API responses. This allows for testing and development without requiring the actual backend to be running.

In production, the mock data conditionals should be removed, and the actual API calls should be enabled.
