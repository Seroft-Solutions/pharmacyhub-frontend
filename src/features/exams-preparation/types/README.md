# Exams Preparation Feature Type System

## Overview

The Exams Preparation feature uses a comprehensive type system to ensure type safety throughout the codebase. This document provides an overview of the main types and their relationships.

## Domain Models

The core domain models represent the main entities in the Exams Preparation feature:

- `Exam`: Represents an exam with metadata and settings
- `Question`: Represents a question within an exam
- `QuestionOption`: Represents an answer option for a question
- `ExamAttempt`: Represents a student's attempt at an exam
- `ExamAnswer`: Represents a student's answer to a specific question
- `ExamResult`: Represents the calculated results of an exam attempt
- `ExamPurchaseInfo`: Represents information about premium exam purchases

## DTOs

Data Transfer Objects are used for API communication:

- Request DTOs: `ExamCreateDto`, `ExamUpdateDto`, etc.
- Response DTOs: `PaginatedResponseDto<T>`, etc.
- Mapping functions: Convert between DTOs and domain models

## State Types

Types for state management:

- Zustand store types: `ExamEditorState`, `ExamAttemptState`
- Context types: `ExamFilterContextType`, `ExamSessionContextType`

## Component Prop Types

Types for React component props:

- Atom props: Basic UI elements (e.g., `ExamLabelProps`, `QuestionIndicatorProps`)
- Molecule props: Composite components (e.g., `ExamCardProps`, `QuestionFormProps`)
- Organism props: Page-level components (e.g., `ExamDashboardProps`, `ExamEditorProps`)
- Template props: Layout templates (e.g., `ExamPageTemplateProps`)
- Guard props: Access control components (e.g., `ExamOperationGuardProps`, `PaymentRequiredGuardProps`)

## API Types

Types for API interactions:

- Client interfaces: `ExamApiClient`
- Query params: `UseExamsQueryParams`, `UseExamQueryOptions`
- Error types: `ApiErrorResponse`, `ExamApiError`

## Utility Types

Helper types and type guards:

- Type utilities: `DeepPartial<T>`, `WithRequired<T, K>`
- Type guards: `isMultipleChoiceQuestion()`, etc.
- Utility functions: Type-safe helper functions

## Type Organization

The types are organized into the following folders:

- `models/`: Domain models representing the core business entities
- `dtos/`: Data Transfer Objects for API communication
- `props/`: Component prop interfaces
- `state/`: State management type definitions
- `api/`: API-related types and interfaces
- `utils/`: Utility types and type guards

## Usage Examples

### Working with domain models:

```tsx
import { Exam, Question } from '@/features/exams-preparation/types';

function displayExamInfo(exam: Exam) {
  console.log(`Exam: ${exam.title}, Questions: ${exam.questionCount}`);
}
```

### Using component props:

```tsx
import { ExamCardProps } from '@/features/exams-preparation/types';

const MyExamCard: React.FC<ExamCardProps> = ({ exam, variant = 'default', onSelect }) => {
  // Implementation
};
```

### Type guards for conditional logic:

```tsx
import { Question, isMultipleChoiceQuestion } from '@/features/exams-preparation/types';

function renderQuestion(question: Question) {
  if (isMultipleChoiceQuestion(question)) {
    // Render multiple choice question
  } else {
    // Render other question type
  }
}
```
