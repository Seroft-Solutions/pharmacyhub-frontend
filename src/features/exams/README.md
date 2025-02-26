# Exam Feature Integration

## Overview

The exam feature in PharmacyHub allows users to browse and take exams (model papers and past papers). The feature has been integrated with the backend API to fetch real data instead of using mock data.

## Architecture

The exam feature follows a clean architecture with separate layers:

1. **API Layer** - Contains services for communicating with the backend
2. **Model Layer** - Contains TypeScript interfaces for data structures
3. **Store Layer** - Contains Zustand stores for state management
4. **UI Layer** - Contains React components for the user interface

## Integration Details

### API Services

- `examService.ts` - Handles regular MCQ exams with questions and answers
- `mcqService.ts` - Handles MCQ-specific functionality
- `examPaperService.ts` - Handles browsing exam papers (model and past papers)
- `adapter.ts` - Contains adapter functions to transform backend data to frontend models

### Data Stores

- `examStore.ts` - General exam state management
- `mcqExamStore.ts` - MCQ-specific state management
- `examPaperStore.ts` - State management for browsing exam papers

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/exams` | GET | Get all exams |
| `/api/exams/published` | GET | Get published exams |
| `/api/exams/:id` | GET | Get exam by ID |
| `/api/exams/:id/start` | POST | Start an exam attempt |
| `/api/exams/attempts/:id/submit` | POST | Submit an exam attempt |
| `/api/exams/status/:status` | GET | Get exams by status |
| `/api/exams/papers/model` | GET | Get model papers |
| `/api/exams/papers/past` | GET | Get past papers |
| `/api/exams/papers/:id` | GET | Get paper by ID |
| `/api/exams/papers/stats` | GET | Get exam statistics |

## Usage Examples

### Browsing Exam Papers

```tsx
import { useExamPaperStore } from '@/features/exams';
import { useEffect } from 'react';

const ExamBrowser = () => {
  const { 
    modelPapers, 
    pastPapers, 
    stats, 
    isLoading, 
    error, 
    fetchAllPapers, 
    fetchExamStats 
  } = useExamPaperStore();

  useEffect(() => {
    fetchAllPapers();
    fetchExamStats();
  }, [fetchAllPapers, fetchExamStats]);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div>
      <StatsDisplay stats={stats} />
      <ModelPapers papers={modelPapers} />
      <PastPapers papers={pastPapers} />
    </div>
  );
};
```

### Taking an Exam

```tsx
import { useMcqExamStore } from '@/features/exams';
import { useEffect } from 'react';

const ExamTaker = ({ examId }) => {
  const { 
    currentExam, 
    currentQuestionIndex, 
    userAnswers, 
    isLoading, 
    error, 
    fetchExamById, 
    startExam, 
    answerQuestion, 
    completeExam 
  } = useMcqExamStore();

  useEffect(() => {
    startExam(examId);
  }, [examId, startExam]);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!currentExam) return null;

  return (
    <div>
      <ExamHeader exam={currentExam} />
      <QuestionDisplay 
        question={currentExam.questions[currentQuestionIndex]} 
        userAnswer={userAnswers[currentExam.questions[currentQuestionIndex].id]} 
        onAnswer={answerQuestion} 
      />
      <ExamControls onComplete={completeExam} />
    </div>
  );
};
```

## Backend Data Transformation

The backend API may return data in a format that differs from the frontend models. Adapter functions in `adapter.ts` handle the transformation:

```typescript
// Example adapter
function adaptBackendExamPaper(backendPaper: BackendExamPaper): ExamPaper {
  return {
    id: backendPaper.id,
    title: backendPaper.title,
    // ... transform other fields
  };
}
```
