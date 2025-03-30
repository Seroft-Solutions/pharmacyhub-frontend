# Task 09: Validate Component Size and Responsibilities

## Description
Review all components in the Exams feature to ensure they adhere to the size limitations and single responsibility principle. Identify components that exceed the 200-line limit or have multiple responsibilities, and create plans for breaking them down.

## Current State Analysis
Some components in the Exams feature may exceed the 200-line limit or have multiple responsibilities, making them difficult to maintain and test. This task focuses on identifying and addressing these issues.

## Implementation Steps

1. **Analyze component sizes**
   - Create a script to count lines of code in each component
   - Generate a report of components exceeding 200 lines
   - Sort components by size to identify the largest ones
   - Check components for comment-to-code ratio

2. **Evaluate component responsibilities**
   - Review each component's purpose and functionality
   - Identify components with multiple responsibilities
   - Document responsibilities for components exceeding the size limit
   - Look for components handling multiple concerns (UI, data, logic, etc.)

3. **Create decomposition plans**
   - For each oversized component, create a plan to break it down
   - Identify logical groupings of functionality
   - Consider extraction patterns (containers/presentational, custom hooks, etc.)
   - Document the proposed component hierarchy

4. **Implement size limitations**
   - Add ESLint rules for enforcing size limitations
   - Add documentation about size and responsibility guidelines
   - Consider automated checks for component complexity

5. **Create refactoring examples**
   - Create detailed examples for refactoring complex components
   - Document before and after comparisons
   - Highlight common patterns and approaches

6. **Review edge cases**
   - Identify any components that might legitimately exceed size limits
   - Document justifications for exceptions
   - Create alternative optimization approaches for these cases

7. **Update component guidelines**
   - Create or update guidelines for component design
   - Document best practices for component composition
   - Create templates for different component types

## Component Analysis Report Example

```markdown
# Component Size Analysis

## Components Exceeding Size Limit

| Component | Lines | Responsibilities | Refactoring Priority |
|-----------|-------|-----------------|---------------------|
| ExamEditor.tsx | 387 | Form handling, validation, API calls, UI rendering | High |
| QuestionBuilder.tsx | 312 | Question type handling, form management, drag-and-drop, UI rendering | High |
| ExamResults.tsx | 276 | Data processing, chart rendering, filtering, UI | Medium |
| ExamAttempt.tsx | 243 | Navigation, state management, timer, event handling | Medium |

## Components with Multiple Responsibilities

| Component | Responsibilities | Refactoring Approach |
|-----------|-----------------|---------------------|
| ExamEditor.tsx | Form handling, validation, API calls, UI rendering | Split into container/presentational components, extract form logic to custom hooks |
| QuestionBuilder.tsx | Question type handling, form management, drag-and-drop, UI | Extract each question type to its own component, separate drag-and-drop logic |
| ExamSettings.tsx | Notification settings, timing settings, access settings | Split into focused setting components |
```

## Refactoring Example: ExamEditor

### Before

```tsx
// ExamEditor.tsx - 387 lines
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExamQuery, useUpdateExamMutation, useCreateExamMutation } from '@/features/exams/api';
import { TextField, Button, Checkbox, Select } from '@/core/ui';
import { Exam, CreateExamRequest, UpdateExamRequest } from '@/features/exams/types';

export const ExamEditor = () => {
  // 50+ lines of state declarations
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  // ... many more state variables
  
  // 30+ lines of form validation logic
  const validateForm = () => {
    // Complex validation logic
  };
  
  // 50+ lines of API integration
  const { examId } = useParams();
  const navigate = useNavigate();
  const { data: exam, isLoading } = useExamQuery(examId);
  const updateExamMutation = useUpdateExamMutation();
  const createExamMutation = useCreateExamMutation();
  
  // 30+ lines of effect hooks
  useEffect(() => {
    // Initialize form with exam data
  }, [exam]);
  
  // 40+ lines of event handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Complex submission logic
  };
  
  // 100+ lines of JSX with form controls
  return (
    <div className="exam-editor">
      <h1>{examId ? 'Edit Exam' : 'Create Exam'}</h1>
      <form onSubmit={handleSubmit}>
        {/* Many form fields and complex UI */}
      </form>
    </div>
  );
};
```

### After

```tsx
// Refactored into smaller components with single responsibilities

// ExamEditorContainer.tsx - Container component handling data and logic
import React from 'react';
import { useParams } from 'react-router-dom';
import { useExamQuery } from '@/features/exams/api';
import { useExamForm } from '@/features/exams/hooks';
import { ExamEditorForm } from './ExamEditorForm';
import { LoadingSpinner } from '@/core/ui';

export const ExamEditorContainer = () => {
  const { examId } = useParams();
  const { data: exam, isLoading } = useExamQuery(examId);
  
  const {
    formValues,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useExamForm(exam);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <ExamEditorForm
      formValues={formValues}
      errors={errors}
      isSubmitting={isSubmitting}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isEditMode={!!examId}
    />
  );
};

// useExamForm.ts - Custom hook for form logic
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateExamMutation, useCreateExamMutation } from '@/features/exams/api';
import { Exam } from '@/features/exams/types';
import { validateExamForm } from '@/features/exams/utils';

export const useExamForm = (initialData?: Exam) => {
  // Form state and validation logic extracted to a custom hook
};

// ExamEditorForm.tsx - Presentational component
import React from 'react';
import { TextField, Button, Checkbox, Select } from '@/core/ui';
import { ExamFormValues, ExamFormErrors } from '@/features/exams/types';
import { ExamBasicInfo } from './ExamBasicInfo';
import { ExamSettings } from './ExamSettings';
import { ExamAccessControls } from './ExamAccessControls';

interface ExamEditorFormProps {
  formValues: ExamFormValues;
  errors: ExamFormErrors;
  isSubmitting: boolean;
  isEditMode: boolean;
  onChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ExamEditorForm = ({
  formValues,
  errors,
  isSubmitting,
  isEditMode,
  onChange,
  onSubmit,
}: ExamEditorFormProps) => {
  return (
    <div className="exam-editor">
      <h1>{isEditMode ? 'Edit Exam' : 'Create Exam'}</h1>
      <form onSubmit={onSubmit}>
        <ExamBasicInfo
          values={formValues}
          errors={errors}
          onChange={onChange}
        />
        
        <ExamSettings
          values={formValues}
          errors={errors}
          onChange={onChange}
        />
        
        <ExamAccessControls
          values={formValues}
          errors={errors}
          onChange={onChange}
        />
        
        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Exam'}
          </Button>
        </div>
      </form>
    </div>
  );
};

// ExamBasicInfo.tsx, ExamSettings.tsx, ExamAccessControls.tsx
// Each is a focused component with a single responsibility
```

## Verification Criteria
- All components identified that exceed 200 lines
- Components with multiple responsibilities documented
- Refactoring plans created for oversized components
- Guidelines updated for component design
- ESLint rules added for enforcing size limitations
- Example refactorings documented for common patterns

## Time Estimate
Approximately 8-10 hours

## Dependencies
- Task 01: Document Current Directory Structure and Identify Gaps
- Task 03: Restructure Components Following Atomic Design (partial dependency)

## Risks
- Breaking down complex components may introduce new bugs
- Some components may be difficult to refactor due to tight coupling
- Refactoring may require significant changes to component interfaces
