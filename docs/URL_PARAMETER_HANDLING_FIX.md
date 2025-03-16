# URL Parameter Handling Fix

## Issue Description

There was a critical issue with how URL parameters were being handled in the tanstack-query-api hooks. When using `useCustomQuery`, the URL parameters were not being properly replaced, causing the backend to receive the literal placeholder string (e.g., `:examId`) instead of the actual parameter value.

This was causing a `MethodArgumentTypeMismatchException` on the backend, as Java was trying to convert the string `:examId` to the expected `Long` type.

## Root Cause

1. The `useCustomQuery` implementation in `createApiHooks.ts` was passing the raw endpoint string with parameter placeholders directly to the API client.

2. Unlike other methods (`useDetail`, `useUpdate`, etc.) which explicitly replaced placeholders, `useCustomQuery` did not have this functionality.

3. For ID parameters, the Java backend specifically expected them to be valid Long integers, which requires proper type conversion.

## Fix Implementation

We implemented a comprehensive fix across multiple files:

### 1. Enhanced `createApiHooks.ts`

- Added a utility function `toLongId` to ensure proper conversion of IDs to Java's Long type
- Added support for a new `urlParams` option in `useCustomQuery` to handle URL parameter replacement
- Improved parameter replacement logic to properly handle ID parameters
- Added proper validation to ensure placeholders are replaced before API calls

### 2. Updated Exam API Hooks

- Modified `useExamApiHooks.ts` to use the new `urlParams` option for parameter-based endpoints
- Ensured all ID parameters are properly converted to Long format
- Replaced direct string manipulation with the standardized mechanism

### 3. Updated Attempt API Hooks

- Applied the same fixes to `useExamAttemptHooks.ts` for consistency
- Ensured all attempt-related endpoints properly handle ID parameters

## Usage Example

Before:
```typescript
export const useExamQuestions = (examId: number) => {
  const endpoint = EXAM_ENDPOINTS.questions.replace(
    ':examId',
    examId.toString()
  );

  return examApiHooks.useCustomQuery<Question[]>(
    'questions',
    ['questions', examId],
    {
      enabled: !!examId,
      staleTime: 5 * 60 * 1000,
    }
  );
};
```

After:
```typescript
export const useExamQuestions = (examId: number) => {
  return examApiHooks.useCustomQuery<Question[]>(
    'questions',
    ['questions', examId],
    {
      enabled: !!examId,
      staleTime: 5 * 60 * 1000,
      urlParams: {
        examId: examId // Will be properly converted to Long format
      }
    }
  );
};
```

## Benefits

1. **Consistency**: All API hooks now handle URL parameters in a consistent way
2. **Type Safety**: ID parameters are correctly converted to the format expected by Java
3. **Maintainability**: The code is more robust and less prone to URL parameter errors
4. **Reusability**: The `urlParams` option can be used across all features that need URL parameters

## Potential Further Improvements

1. Add TypeScript type checking for URL parameters to ensure they match endpoint placeholders
2. Create helper functions for common URL parameter patterns
3. Add logging for URL parameter replacement to help with debugging
