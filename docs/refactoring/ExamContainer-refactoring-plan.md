# ExamContainer Refactoring Plan

## Overview

The `ExamContainer` component is currently 1061 lines of code with a main function (`ExamContainerInternal`) that's 959 lines long. This far exceeds our architecture principles of:
- 200 lines maximum for components
- 30 lines maximum for functions

This document outlines the plan to refactor this component according to our architecture principles.

## Component Analysis

### Current Structure Issues

1. **Mixing of concerns**:
   - UI logic
   - Business logic
   - Error handling
   - Analytics tracking
   - State management

2. **Oversized functions**:
   - `ExamContainerInternal` (959 lines)
   - `handleStartExam` (43 lines)
   - `handleTryAgain` (43 lines)
   - `handleSubmitExam` (47 lines)
   - `findCorrectOptionLabel` (62 lines)

3. **Repeated code**:
   - State reset logic appears in multiple places
   - Similar error handling patterns
   - Alert dialog components with similar configurations

## Refactoring Strategy

### 1. Extract Custom Hooks

Extract business logic and state management into custom hooks:

- **`useExamNavigation`**: Handles navigation between questions
- **`useExamSubmission`**: Manages exam submission logic
- **`useExamReset`**: Centralizes reset logic
- **`useExamAnswers`**: Manages answer selection and flagging
- **`useExamStatus`**: Tracks exam status (starting, in progress, completed)

### 2. Extract Utility Functions

Move complex logic into utility functions:

- **`examUtils.ts`**:
  - `findCorrectOptionLabel`: Move answer determination logic
  - `resetLocalStorageExamState`: Centralize reset logic
  - `calculateExamResults`: Exam score calculation

### 3. Component Decomposition

Break down the main component into smaller, focused components:

- **`ExamContainer`**: Main container and orchestrator (under 200 lines)
- **`ExamStartView`**: Start screen component
- **`ExamQuestionsView`**: Main exam questions interface
- **`ExamSummaryView`**: Summary before submission
- **`ExamResultsView`**: Results after submission
- **`ExamNavBar`**: Navigation controls
- **`MobileControls`**: Mobile-specific controls
- **`DesktopSidebar`**: Desktop-specific sidebar
- **`ExamErrorHandler`**: Centralized error handling

### 4. Container/Presentation Separation

Apply container/presentation pattern:

- **`ExamContainerInternal`**: Container component (handles data, state)
- Presentation components: Receive props, minimal logic

## Folder Structure

```
/features/exams/components/student/
├── ExamContainer.tsx            # Main container (orchestrator)
├── exam-container/              # Component folder
│   ├── index.ts                 # Re-exports
│   ├── ExamStartView.tsx        # Start screen component
│   ├── ExamQuestionsView.tsx    # Questions interface
│   ├── ExamSummaryView.tsx      # Summary before submission
│   ├── ExamResultsView.tsx      # Results display
│   ├── MobileControls.tsx       # Mobile-specific controls
│   ├── DesktopSidebar.tsx       # Desktop sidebar
│   ├── ExamSubmitDialog.tsx     # Submit confirmation dialog
│   └── ExamErrorHandler.tsx     # Error handling
├── hooks/
│   ├── useExamNavigation.ts     # Navigation logic
│   ├── useExamSubmission.ts     # Submission logic
│   ├── useExamReset.ts          # Reset logic
│   ├── useExamAnswers.ts        # Answer management
│   └── useExamStatus.ts         # Exam status management
└── utils/
    ├── examUtils.ts             # Utility functions
    └── examResults.ts           # Results calculation
```

## Implementation Approach

1. **Extract utility functions first**
   - Isolate pure functions that don't depend on state

2. **Create custom hooks**
   - Extract state management and business logic
   - Test each hook independently

3. **Create smaller components**
   - Start with clearly defined UI sections
   - Ensure single responsibility

4. **Refactor main container**
   - Connect hooks and components
   - Keep orchestration logic minimal

5. **Update tests**
   - Ensure all functionality is covered
   - Test individual components

## Acceptance Criteria

- ExamContainer component is under 200 lines
- All functions are under 30 lines
- Component functionality is maintained
- Tests pass after refactoring
- Code is properly documented
- Each component has a clear single responsibility

## Example Component Structure

```tsx
// ExamContainer.tsx
function ExamContainer({ examId, userId, onExit, showTimer, examType }: ExamContainerProps) {
  // Minimal state management
  const [viewState, setViewState] = useState<'starting' | 'questions' | 'summary' | 'results'>('starting');
  
  // Use custom hooks
  const { exam, questions, isLoading, error } = useExamData(examId);
  const { startExam, isStarting, startError } = useExamStart(examId, userId);
  const { submitExam, isSubmitting, submitError } = useExamSubmission(examId);
  
  // Render appropriate view based on viewState
  if (isLoading) return <LoadingView />;
  if (error) return <ErrorView error={error} />;
  
  switch(viewState) {
    case 'starting':
      return <ExamStartView exam={exam} onStart={() => {
        startExam();
        setViewState('questions');
      }} />;
    case 'questions':
      return <ExamQuestionsView 
        exam={exam}
        questions={questions}
        onSubmit={() => setViewState('summary')}
      />;
    case 'summary':
      return <ExamSummaryView 
        exam={exam}
        questions={questions}
        onConfirmSubmit={() => {
          submitExam();
          setViewState('results');
        }}
        onReturn={() => setViewState('questions')}
      />;
    case 'results':
      return <ExamResultsView 
        examId={examId}
        onExit={onExit}
        onTryAgain={() => setViewState('starting')}
      />;
  }
}
```
