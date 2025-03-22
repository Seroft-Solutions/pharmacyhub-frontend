# Phase 1: Initial Setup and Directory Structure

This guide provides detailed implementation steps for Phase 1 of the exams feature refactoring.

## Step 1: Create the Directory Structure

Create the following directory structure:

```bash
# Create main domain directories
mkdir -p src/features/exams/api/constants
mkdir -p src/features/exams/api/hooks
mkdir -p src/features/exams/api/services
mkdir -p src/features/exams/api/types

mkdir -p src/features/exams/core/components
mkdir -p src/features/exams/core/constants
mkdir -p src/features/exams/core/store
mkdir -p src/features/exams/core/types
mkdir -p src/features/exams/core/utils

mkdir -p src/features/exams/taking/components
mkdir -p src/features/exams/taking/constants
mkdir -p src/features/exams/taking/store
mkdir -p src/features/exams/taking/types
mkdir -p src/features/exams/taking/utils

mkdir -p src/features/exams/creation/components
mkdir -p src/features/exams/creation/constants
mkdir -p src/features/exams/creation/store
mkdir -p src/features/exams/creation/types
mkdir -p src/features/exams/creation/utils

mkdir -p src/features/exams/review/components
mkdir -p src/features/exams/review/constants
mkdir -p src/features/exams/review/store
mkdir -p src/features/exams/review/types
mkdir -p src/features/exams/review/utils

mkdir -p src/features/exams/management/components
mkdir -p src/features/exams/management/constants
mkdir -p src/features/exams/management/store
mkdir -p src/features/exams/management/types
mkdir -p src/features/exams/management/utils

mkdir -p src/features/exams/analytics/components
mkdir -p src/features/exams/analytics/constants
mkdir -p src/features/exams/analytics/store
mkdir -p src/features/exams/analytics/types
mkdir -p src/features/exams/analytics/utils

mkdir -p src/features/exams/rbac/components
mkdir -p src/features/exams/rbac/constants
mkdir -p src/features/exams/rbac/hooks
mkdir -p src/features/exams/rbac/store

mkdir -p src/features/exams/premium/components
mkdir -p src/features/exams/premium/constants
mkdir -p src/features/exams/premium/store
mkdir -p src/features/exams/premium/hooks

mkdir -p src/features/exams/deprecated
```

## Step 2: Create Basic Index Files

Create basic index.ts files for each domain to define exports:

### 1. Main Feature Index

**src/features/exams/index.ts**
```typescript
/**
 * Exams Feature
 * 
 * This is the main entry point for the exams feature.
 * It exports all public components, hooks, and utilities.
 */

// Re-export from domains
export * from './core';
export * from './taking';
export * from './creation';
export * from './review';
export * from './management';
export * from './analytics';
export * from './rbac';
export * from './premium';

// Default export for convenience
export default {};
```

### 2. Domain Index Files (create for each domain)

**src/features/exams/core/index.ts**
```typescript
/**
 * Core Exams Domain
 * 
 * Exports core types, components, and utilities for the exams feature.
 */

// Re-export from submodules
export * from './components';
export * from './constants';
export * from './store';
export * from './types';
export * from './utils';

// Default export for convenience
export default {};
```

(Create similar index files for each domain)

### 3. Subdirectory Index Files (example)

**src/features/exams/core/types/index.ts**
```typescript
/**
 * Core Exam Types
 * 
 * This module exports all core types for the exams feature.
 */

// Type definitions will be added here

// Default export for convenience
export default {};
```

## Step 3: Create Initial Constants Files

Create basic constants files with placeholders:

**src/features/exams/core/constants/index.ts**
```typescript
/**
 * Core Exam Constants
 * 
 * This module exports all constants used in the core exams domain.
 */

export * from './examConstants';
export * from './routeConstants';
export * from './uiConstants';
```

**src/features/exams/core/constants/examConstants.ts**
```typescript
/**
 * Exam constants
 * 
 * Contains constants related to exams and their behavior.
 */

/**
 * Exam status constants
 */
export const EXAM_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
};

/**
 * Paper type constants
 */
export const PAPER_TYPES = {
  PRACTICE: 'practice',
  MODEL: 'model',
  PAST: 'past',
  SUBJECT: 'subject',
};

/**
 * Default configuration values
 */
export const EXAM_CONFIG = {
  DEFAULT_DURATION: 60, // minutes
  DEFAULT_PASSING_PERCENTAGE: 60,
};
```

**src/features/exams/core/constants/uiConstants.ts**
```typescript
/**
 * UI constants
 * 
 * Contains constants related to UI elements and text.
 */

/**
 * Exam UI text constants
 */
export const EXAM_TEXT = {
  LABELS: {
    START_EXAM: 'Start Exam',
    SUBMIT_EXAM: 'Submit Exam',
    NEXT_QUESTION: 'Next',
    PREVIOUS_QUESTION: 'Previous',
    FLAG_QUESTION: 'Flag for Review',
    REVIEW_ANSWERS: 'Review Answers',
    COMPLETE_EXAM: 'Complete Exam',
  },
  MESSAGES: {
    EXAM_STARTED: 'Exam started successfully!',
    EXAM_COMPLETED: 'Exam completed successfully!',
    TIME_EXPIRED: 'Time is up! Your exam will be submitted automatically.',
    CONFIRM_SUBMIT: 'Are you sure you want to submit your exam?',
  },
  ERRORS: {
    FAILED_TO_START: 'Failed to start exam',
    FAILED_TO_SUBMIT: 'Failed to submit exam',
    FAILED_TO_SAVE_ANSWER: 'Failed to save answer',
    FAILED_TO_FLAG: 'Failed to flag question',
  },
};

/**
 * CSS class constants
 */
export const EXAM_CLASSES = {
  CONTAINER: 'exam-container',
  QUESTION: 'exam-question',
  OPTION: 'exam-option',
};
```

**src/features/exams/core/constants/routeConstants.ts**
```typescript
/**
 * Route constants
 * 
 * Contains constants related to routes and navigation.
 */

/**
 * Exam route constants
 */
export const EXAM_ROUTES = {
  DASHBOARD: '/exams',
  TAKE_EXAM: '/exams/:examId',
  RESULTS: '/exams/results/:attemptId',
  ADMIN_DASHBOARD: '/admin/exams',
  ADMIN_CREATE: '/admin/exams/create',
  ADMIN_EDIT: '/admin/exams/:examId/edit',
  ADMIN_QUESTIONS: '/admin/exams/:examId/questions',
};
```

## Step 4: Define Core Types

Create initial type definitions:

**src/features/exams/core/types/exam.ts**
```typescript
/**
 * Exam types
 * 
 * Contains type definitions for exams and related entities.
 */

/**
 * Exam status
 */
export enum ExamStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Paper type
 */
export enum PaperType {
  PRACTICE = 'practice',
  MODEL = 'model',
  PAST = 'past',
  SUBJECT = 'subject',
}

/**
 * Exam interface
 */
export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  questionCount: number;
  totalMarks: number;
  passingMarks: number;
  status: ExamStatus;
  paperType?: PaperType;
  isPremium?: boolean;
  price?: number;
  questions?: Question[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Question interface
 */
export interface Question {
  id: number;
  examId?: number;
  text: string;
  questionText?: string; // Alias for text to handle API inconsistencies
  questionNumber?: number;
  marks?: number;
  explanation?: string;
  options: Option[];
}

/**
 * Option interface
 */
export interface Option {
  id: number;
  questionId?: number;
  text: string;
  label?: string; // Sometimes API sends 'label' instead of 'text'
  isCorrect?: boolean;
}

/**
 * User answer interface
 */
export interface UserAnswer {
  questionId: number;
  selectedOption: number;
  timeSpent?: number;
}

/**
 * Exam attempt interface
 */
export interface ExamAttempt {
  id: number;
  examId: number;
  userId: string;
  startTime: string;
  endTime?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  score?: number;
  isPassed?: boolean;
}

/**
 * Exam result interface
 */
export interface ExamResult {
  attemptId: number;
  examId: number;
  examTitle: string;
  score: number;
  totalMarks: number;
  passingMarks: number;
  isPassed: boolean;
  timeSpent: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  completedAt: string;
  questionResults: QuestionResult[];
}

/**
 * Question result interface
 */
export interface QuestionResult {
  questionId: number;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  points: number;
  explanation?: string;
}

/**
 * Flagged question interface
 */
export interface FlaggedQuestion {
  id: number;
  attemptId: number;
  questionId: number;
  createdAt: string;
}
```

**src/features/exams/core/types/index.ts**
```typescript
/**
 * Core types index
 * 
 * Re-exports all core types.
 */

export * from './exam';
export * from './store';
```

**src/features/exams/core/types/store.ts**
```typescript
/**
 * Store types
 * 
 * Contains type definitions for Zustand stores.
 */

/**
 * Loading state interface
 * Common interface for tracking loading states across stores
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Base store interface
 * Common interface for all stores
 */
export interface BaseStore extends LoadingState {
  reset: () => void;
}
```

## Step 5: Set Up the Deprecated Folder

Create a structure for the deprecated folder to organize old code:

**src/features/exams/deprecated/README.md**
```markdown
# Deprecated Code

This folder contains deprecated code from the exams feature refactoring.

## Structure

The code is organized by domain:

- `api/` - Old API integration code
- `components/` - Old React components
- `hooks/` - Old React hooks
- `store/` - Old store implementations
- `utils/` - Old utility functions

## Usage

This code is kept for reference only and should not be imported in new code.
All new implementations should use the new feature-based architecture.

## Migration

As components are refactored, they should be moved here rather than deleted
to maintain a history of the implementation.
```

## Step 6: Create Directory Structure for Domain-Specific Subfolders

For each domain (taking, creation, review, etc.), create consistent folder structures:

**src/features/exams/taking/constants/index.ts**
```typescript
/**
 * Taking constants index
 * 
 * Re-exports all taking-specific constants.
 */

export * from './takingConstants';
```

**src/features/exams/taking/constants/takingConstants.ts**
```typescript
/**
 * Taking constants
 * 
 * Contains constants related to the exam taking experience.
 */

/**
 * Taking UI text constants
 */
export const TAKING_TEXT = {
  LABELS: {
    QUESTION_NUMBER: 'Question',
    FLAG_FOR_REVIEW: 'Flag for review',
    UNFLAG: 'Unflag',
    TIME_REMAINING: 'Time Remaining',
    QUESTIONS_ANSWERED: 'Questions Answered',
    QUESTIONS_FLAGGED: 'Questions Flagged',
  },
  MESSAGES: {
    CONFIRM_SUBMIT: 'Are you sure you want to submit your exam?',
    TIME_EXPIRING: 'Time is running out! Only 5 minutes remaining.',
    SUBMIT_SUCCESS: 'Your exam has been submitted successfully.',
  },
};

/**
 * Taking event constants
 */
export const TAKING_EVENTS = {
  START_EXAM: 'exam_start',
  SUBMIT_EXAM: 'exam_submit',
  ANSWER_QUESTION: 'question_answer',
  FLAG_QUESTION: 'question_flag',
  UNFLAG_QUESTION: 'question_unflag',
  NAVIGATE: 'question_navigate',
  TIME_EXPIRED: 'exam_time_expired',
};
```

Create similar files for other domains.

## Step 7: Create Placeholder Store Files

**src/features/exams/taking/store/index.ts**
```typescript
/**
 * Taking store index
 * 
 * Re-exports all taking-specific stores.
 */

export * from './examTakingStore';
```

**src/features/exams/taking/store/examTakingStore.ts**
```typescript
/**
 * Exam Taking Store
 * 
 * Manages state for the exam taking experience.
 * This is a placeholder file that will be implemented in Phase 3.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BaseStore } from '../../core/types';

// Placeholder types to be expanded in Phase 3
interface ExamTakingState extends BaseStore {
  // State will be defined in Phase 3
}

// Export a minimal placeholder store
export const useExamTakingStore = create<ExamTakingState>(() => ({
  isLoading: false,
  error: null,
  reset: () => {
    // Will be implemented in Phase 3
  }
}));

export default useExamTakingStore;
```

Create similar placeholder files for other domains.

## Step 8: Create Placeholder API Files

**src/features/exams/api/constants/index.ts**
```typescript
/**
 * API constants index
 * 
 * Re-exports all API-specific constants.
 */

export * from './endpoints';
export * from './permissions';
```

Copy the existing endpoints.ts and permissions.ts from the current codebase.

**src/features/exams/api/services/index.ts**
```typescript
/**
 * API services index
 * 
 * Re-exports all API services.
 */

export * from './examApiService';
export * from './attemptApiService';
```

**src/features/exams/api/services/examApiService.ts**
```typescript
/**
 * Exam API Service
 * 
 * Provides methods for interacting with exam-related APIs.
 * This is a placeholder file that will be implemented in Phase 2.
 */

// Placeholder to be implemented in Phase 2
export const examApiService = {
  // Methods will be defined in Phase 2
};

export default examApiService;
```

Create similar placeholder files for other API services.

## Next Steps

After completing Phase 1, you should have:

1. A complete directory structure for the refactored exams feature
2. Basic index.ts files for exports
3. Initial constants files
4. Core type definitions
5. A deprecated folder for old code
6. Placeholder files for stores and API services

This provides the foundation for Phase 2, where you'll implement the core and API layers.
