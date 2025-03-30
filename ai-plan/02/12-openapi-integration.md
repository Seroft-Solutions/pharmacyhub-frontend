# Task 12: Integrate with OpenAPI Specifications

## Description
Integrate the Exams feature with OpenAPI specifications to ensure consistent API contracts, type safety, and alignment with backend services. This task focuses on using the OpenAPI generator and adapting the feature to use generated types and API clients.

## Current State Analysis
The Exams feature may have manually defined types and API calls that could be replaced or enhanced with OpenAPI-generated code. This task focuses on integrating with the OpenAPI specifications to improve consistency and type safety.

## Implementation Steps

1. **Review OpenAPI specifications**
   - Obtain the latest OpenAPI specification for exam-related endpoints
   - Analyze the available endpoints and data models
   - Compare with current manual implementations
   - Identify gaps or inconsistencies

2. **Generate API client and types**
   - Use the OpenAPI generator to create typed API clients
   - Generate TypeScript interfaces for all models
   - Ensure proper path configurations
   - Validate generated code against current implementation

3. **Create adapters for generated code**
   - Develop adapter functions to bridge generated code with feature needs
   - Implement conversion functions for data transformation
   - Create utility functions for common operations
   - Document adapter patterns

4. **Update API hooks**
   - Refactor API hooks to use generated clients
   - Ensure proper error handling
   - Maintain TanStack Query integration
   - Update typings to use generated interfaces

5. **Align types with generated interfaces**
   - Update feature types to extend or utilize generated types
   - Resolve any conflicts or inconsistencies
   - Ensure backwards compatibility where needed
   - Document type relationships

6. **Implement validation based on schemas**
   - Extract validation rules from OpenAPI schemas
   - Implement client-side validation using schema definitions
   - Ensure consistent error handling
   - Create validation utilities

7. **Document OpenAPI integration**
   - Update API documentation with OpenAPI references
   - Document mapping between UI components and API models
   - Create examples of using generated code
   - Document versioning and update strategies

## OpenAPI Integration Patterns

### Generated API Client Usage

```typescript
// /api/generated/ contains OpenAPI generated code
import { ExamsApi, Exam as ApiExam, CreateExamRequest } from '@/core/api/generated';
import { apiClient } from '@/core/api';

// Create instance of the generated API
const examsApi = new ExamsApi(apiClient);

// Adapter function to convert API types to feature types
const mapApiExamToExam = (apiExam: ApiExam): Exam => ({
  id: apiExam.id,
  title: apiExam.title,
  description: apiExam.description || '',
  questions: apiExam.questions.map(mapApiQuestionToQuestion),
  timeLimit: apiExam.timeLimit,
  isPublished: apiExam.status === 'PUBLISHED',
  createdAt: apiExam.createdAt,
  updatedAt: apiExam.updatedAt,
});

// TanStack Query hook using generated API
export const useExamsQuery = () => {
  return useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      try {
        const response = await examsApi.getExams();
        return response.data.map(mapApiExamToExam);
      } catch (error) {
        // Handle error based on OpenAPI error responses
        if (error.response?.status === 403) {
          throw new Error('You do not have permission to view exams');
        }
        throw error;
      }
    },
  });
};
```

### Type Alignment

```typescript
// Extending OpenAPI generated types
import { Exam as ApiExam } from '@/core/api/generated';

// Feature-specific extension of the API type
export interface Exam extends Omit<ApiExam, 'status' | 'questions'> {
  // Convert status string to boolean for easier usage
  isPublished: boolean;
  // Use our enhanced Question type
  questions: Question[];
  // Add UI-specific properties not in the API
  isExpanded?: boolean;
  isSelected?: boolean;
}

// Type guards for specialized exam types
export function isMcqExam(exam: Exam): exam is McqExam {
  return exam.questions.every(q => q.type === QuestionType.MULTIPLE_CHOICE);
}
```

### Schema-Based Validation

```typescript
// Using OpenAPI schemas for validation
import { schemas } from '@/core/api/generated/schemas';
import Ajv from 'ajv';

const ajv = new Ajv();

// Create validators from OpenAPI schemas
const validateExam = ajv.compile(schemas['Exam']);
const validateCreateExamRequest = ajv.compile(schemas['CreateExamRequest']);

// Validation utility
export const validateExamData = (data: unknown): { valid: boolean; errors: string[] } => {
  const valid = validateCreateExamRequest(data);
  
  if (!valid) {
    return {
      valid: false,
      errors: (validateCreateExamRequest.errors || []).map(err => {
        return `${err.instancePath} ${err.message}`;
      }),
    };
  }
  
  return { valid: true, errors: [] };
};
```

## API Contract Consistency Check

Perform a systematic check to ensure API contract consistency:

1. **Endpoint Coverage**
   - Verify all backend endpoints have corresponding frontend implementations
   - Check HTTP methods match (GET, POST, PUT, DELETE, etc.)
   - Validate URL paths and parameters

2. **Data Model Alignment**
   - Compare request/response types with OpenAPI schemas
   - Check required vs. optional fields
   - Verify field types and formats
   - Validate enum values

3. **Error Handling Consistency**
   - Check error response handling
   - Validate status code interpretation
   - Verify error message extraction
   - Ensure proper user feedback

## Verification Criteria
- Generated API clients used for all API calls
- Types aligned with OpenAPI specifications
- Proper error handling for API responses
- Validation based on OpenAPI schemas
- Documentation updated with OpenAPI references
- Consistent patterns across the feature

## Time Estimate
Approximately 10-12 hours

## Dependencies
- Task 02: Evaluate and Organize API Integration
- Task 06: Organize and Document Types and Interfaces
- OpenAPI specifications must be available

## Risks
- OpenAPI specifications may be incomplete or outdated
- Generated code may require significant adaptation
- Breaking changes in API contracts could impact functionality
- Type conflicts may be challenging to resolve
