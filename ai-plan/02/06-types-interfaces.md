# Task 06: Organize and Document Types and Interfaces

## Description
Review, organize, and document the TypeScript types and interfaces used in the Exams feature, ensuring proper structure, naming conventions, and alignment with OpenAPI specifications.

## Current State Analysis
The Exams feature currently has types defined in the `/types` directory, with some deprecated types in the `/model/deprecated` directory. There may be inconsistencies, duplications, or opportunities for better organization.

## Implementation Steps

1. **Catalog all types and interfaces**
   - Create a complete inventory of types and interfaces
   - Map their usage across the feature
   - Identify any duplicated or inconsistent types
   - Check alignment with OpenAPI generated types

2. **Organize types by domain**
   - Group related types together
   - Create subdirectories for major domains if needed
   - Consider organization patterns such as:
     ```
     /types
     ├── exam.ts          # Exam entity types
     ├── question.ts      # Question entity types
     ├── result.ts        # Result entity types
     ├── api.ts           # API request/response types
     ├── props.ts         # Component prop interfaces
     ├── state.ts         # State management types
     └── index.ts         # Export everything
     ```

3. **Clean up type definitions**
   - Ensure consistent naming conventions (PascalCase for interfaces/types)
   - Add proper JSDoc comments for complex types
   - Remove redundant or unused types
   - Consolidate similar types

4. **Align with OpenAPI specifications**
   - Compare types with OpenAPI generated code
   - Ensure consistency between manual types and generated types
   - Consider using OpenAPI types as the source of truth
   - Implement adapters if needed

5. **Enhance type safety**
   - Add proper narrowing for discriminated unions
   - Use more specific types instead of generic ones (e.g., `string[]` -> `ExamId[]`)
   - Implement utility types for common patterns
   - Consider using branded types for IDs

6. **Create consistent exports**
   - Update index.ts to export all types
   - Consider namespaced exports for related types
   - Ensure proper import patterns

7. **Document types and usage**
   - Add JSDoc comments to all types
   - Document complex type relationships
   - Create usage examples for non-obvious types

## Type Definition Patterns

```typescript
/**
 * Represents an exam in the system
 */
export interface Exam {
  /** Unique identifier for the exam */
  id: string;
  /** The title of the exam */
  title: string;
  /** Optional description of the exam content */
  description?: string;
  /** The number of questions in the exam */
  questionCount: number;
  /** The time limit in minutes (null means no limit) */
  timeLimit: number | null;
  /** Whether the exam is currently published */
  isPublished: boolean;
  /** The date the exam was created */
  createdAt: string; // ISO date string
  /** The date the exam was last updated */
  updatedAt: string; // ISO date string
}

/**
 * The type of question in an exam
 */
export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  ESSAY = 'ESSAY',
}

/**
 * Represents a question in an exam
 */
export interface Question {
  /** Unique identifier for the question */
  id: string;
  /** The exam this question belongs to */
  examId: string;
  /** The text content of the question */
  text: string;
  /** The type of question */
  type: QuestionType;
  /** Points awarded for correct answer */
  points: number;
  /** Additional explanation for the question (shown after answering) */
  explanation?: string;
}

/**
 * Multiple choice question specific properties
 */
export interface MultipleChoiceQuestion extends Question {
  type: QuestionType.MULTIPLE_CHOICE;
  /** Available options for the question */
  options: QuestionOption[];
  /** IDs of the correct options */
  correctOptionIds: string[];
}

/**
 * API request to create a new exam
 */
export interface CreateExamRequest {
  title: string;
  description?: string;
  timeLimit?: number;
  // Other properties...
}

/**
 * API response when creating an exam
 */
export interface CreateExamResponse {
  exam: Exam;
  message: string;
}
```

## Type Utility Patterns

```typescript
/**
 * Utility types for common patterns
 */

/** Exam ID branded type for type safety */
export type ExamId = string & { __brand: 'ExamId' };

/** Create a branded ID from a string */
export const createExamId = (id: string): ExamId => id as ExamId;

/** Extract specific fields from an exam */
export type ExamSummary = Pick<Exam, 'id' | 'title' | 'questionCount' | 'isPublished'>;

/** Make certain properties required */
export type PublishedExam = Exam & Required<Pick<Exam, 'publishedAt'>>;

/** Component prop types */
export interface ExamListProps {
  exams: ExamSummary[];
  isLoading?: boolean;
  onSelect: (examId: ExamId) => void;
}
```

## Verification Criteria
- All types consistently named and organized
- Proper JSDoc comments for all types
- Alignment with OpenAPI specifications
- Removal of deprecated or duplicate types
- Enhanced type safety with specific types
- Clear documentation of type usage

## Time Estimate
Approximately 6-8 hours

## Dependencies
- Task 01: Document Current Directory Structure and Identify Gaps
- Task 02: Evaluate and Organize API Integration (partial dependency)

## Risks
- Changes to types could affect multiple components
- OpenAPI specifications may not align perfectly with current types
- Type changes may require updates to component props
