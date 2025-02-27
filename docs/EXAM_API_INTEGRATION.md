# Exam Feature API Integration Guide

This document provides detailed information about how the exam feature integrates with the backend APIs.

## Overview

The exam feature uses React Query for server state management and API integration. This provides:

- Automatic caching
- Optimistic updates
- Refetching strategies
- Loading and error states
- Data synchronization

## API Service

The `examApi.ts` file contains all the functions for interacting with the backend API:

```typescript
// Base API functions
getAllExams() - Fetch all exams
getPublishedExams() - Fetch only published exams
getExamsByStatus(status) - Fetch exams with specific status
getExamById(examId) - Fetch a single exam by ID
getExamQuestions(examId) - Fetch questions for an exam

// Exam attempt functions
startExam(examId, userId) - Start a new exam attempt
saveAnswer(attemptId, answer) - Save a single answer
submitExam(attemptId, answers) - Submit all exam answers

// Question flagging
flagQuestion(attemptId, questionId) - Flag a question for review
unflagQuestion(attemptId, questionId) - Unflag a question
getFlaggedQuestions(attemptId) - Get all flagged questions for an attempt

// Results and stats
getExamResult(attemptId) - Get exam result
getUserAttempts(userId) - Get user's exam attempts
getExamAttemptsByUser(examId, userId) - Get attempts for an exam by a user
getExamStats() - Get exam statistics
```

## React Query Hooks

The API is wrapped with React Query hooks in `useExamQueries.ts`:

```typescript
// Basic data fetching hooks
useExams() - Get all exams
usePublishedExams() - Get published exams
useExamsByStatus(status) - Get exams by status
useExam(examId) - Get a single exam
useExamQuestions(examId) - Get exam questions

// User attempts hooks
useUserAttempts(userId) - Get user's exam attempts
useExamAttemptsByUser(examId, userId) - Get attempts by exam and user
useFlaggedQuestions(attemptId) - Get flagged questions

// Results hook
useExamResult(attemptId) - Get exam result

// Statistics hook
useExamStats() - Get exam statistics

// Comprehensive hook for exam session
useExamSession(examId) - Manages the entire exam session
```

## The `useExamSession` Hook

The `useExamSession` hook is the main integration point, combining multiple queries and mutations:

```typescript
// Data fetching
exam - Exam details from API
questions - Exam questions from API
isLoading - Loading state
error - Error state

// State from Zustand store
currentQuestionIndex - Current question index
answers - User answers
flaggedQuestions - Questions flagged by user
timeRemaining - Time left for exam
isCompleted - Exam completion status

// Navigation actions
navigateToQuestion(index) - Navigate to specific question
nextQuestion() - Go to next question
previousQuestion() - Go to previous question

// Question actions
answerQuestion(questionId, optionIndex) - Save answer
toggleFlagQuestion(questionId) - Flag/unflag question

// Exam session actions
startExam({userId}) - Start exam attempt
submitExam() - Submit exam
handleTimeExpired() - Handle timer expiration

// UI actions
toggleSummary() - Show/hide summary
showSummary - Summary visibility state

// Helper getters
hasAnswer(questionId) - Check if question is answered
isFlagged(questionId) - Check if question is flagged
getAnsweredQuestionsCount() - Count of answered questions
getFlaggedQuestionsCount() - Count of flagged questions
getCompletionPercentage() - Completion percentage
```

## API Integration Flow

### Starting an Exam

1. User clicks "Start Exam"
2. `handleStartExam()` in `ExamContainer` is called
3. Calls `startExam()` from `useExamSession`
4. Makes API request via `examApi.startExam()`
5. On success:
   - Updates Zustand store via `examStore.startExam()`
   - Sets attempt ID in state
   - Invalidates relevant queries

### Answering Questions

1. User selects an answer
2. Calls `answerQuestion(questionId, optionIndex)` from `useExamSession`
3. Updates local state in Zustand store
4. Optionally calls API to save answer via `examApi.saveAnswer()`

### Flagging Questions

1. User flags a question
2. Calls `toggleFlagQuestion(questionId)` from `useExamSession`
3. Makes API request via `examApi.flagQuestion()` or `examApi.unflagQuestion()`
4. Updates local state in Zustand store
5. Invalidates flagged questions query

### Submitting Exam

1. User clicks "Submit Exam"
2. Calls `handleSubmitExam()` in `ExamContainer`
3. Calls `submitExam()` from `useExamSession`
4. Makes API request via `examApi.submitExam()`
5. On success:
   - Marks exam as completed in Zustand store
   - Shows results view
   - Invalidates result query

### Timer Expiration

1. Timer reaches zero
2. Calls `handleTimeExpired()` from `useExamSession`
3. Automatically submits exam via `submitExam()`

## Error Handling

Error handling is managed at multiple levels:

1. **API Layer**: Errors from API calls are caught and formatted
2. **React Query Layer**: Provides error states for failed queries/mutations
3. **UI Layer**: Displays appropriate error messages using alerts and toast notifications

## Optimizations

1. **Cache Invalidation**: Only invalidate affected queries to reduce unnecessary calls
2. **State Management Split**: Use Zustand for client state, React Query for server state
3. **Optimistic Updates**: Apply changes locally before API confirms for better UX
4. **Prefetching**: Prefetch related data when appropriate

## Integration Points with Components

- **ExamContainer**: Main component that uses `useExamSession` hook
- **QuestionDisplay**: Shows question and handles answers/flagging
- **QuestionNavigation**: Manages navigation between questions
- **ExamSummary**: Shows overview of exam progress
- **ExamResults**: Displays exam results from API

## Security Considerations

1. User ID is validated on server-side
2. Attempt ownership is verified before allowing actions
3. Exam access is controlled via permissions

## Performance Considerations

1. Minimize API calls during exam session
2. Cache questions to reduce loading times
3. Batch updates when possible
4. Use optimistic updates for better UX
