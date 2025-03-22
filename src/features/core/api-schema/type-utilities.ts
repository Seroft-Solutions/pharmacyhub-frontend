/**
 * Utility functions for working with OpenAPI-generated types
 * and feature-specific types
 */

/**
 * Maps fields from a frontend model to a backend DTO
 * 
 * Example:
 * ```typescript
 * // Convert from frontend Question type to backend QuestionDTO
 * const questionDTO = mapToBackendModel<Question, QuestionDTO>(question, {
 *   text: 'questionText',
 *   options: (options) => options.map(o => mapToBackendModel(o, {
 *     label: 'optionKey',
 *     text: 'optionText'
 *   }))
 * });
 * ```
 */
export function mapToBackendModel<TSource, TTarget>(
  source: TSource,
  fieldMap: Record<string, string | ((value: any) => any)>
): TTarget {
  const target = { ...source } as any;

  // Process each field mapping
  Object.entries(fieldMap).forEach(([sourceField, targetField]) => {
    if (sourceField in source) {
      // If the target field is a string, do a simple rename
      if (typeof targetField === 'string') {
        target[targetField] = source[sourceField as keyof typeof source];
        if (sourceField !== targetField) {
          delete target[sourceField];
        }
      } 
      // If the target field is a function, apply custom transformation
      else if (typeof targetField === 'function') {
        const value = source[sourceField as keyof typeof source];
        target[sourceField] = targetField(value);
      }
    }
  });

  return target as TTarget;
}

/**
 * Maps fields from a backend DTO to a frontend model
 * 
 * Example:
 * ```typescript
 * // Convert from backend QuestionDTO to frontend Question type
 * const question = mapToFrontendModel<QuestionDTO, Question>(questionDTO, {
 *   questionText: 'text',
 *   optionKey: 'label',
 *   optionText: 'text'
 * });
 * ```
 */
export function mapToFrontendModel<TSource, TTarget>(
  source: TSource,
  fieldMap: Record<string, string | ((value: any) => any)>
): TTarget {
  return mapToBackendModel(source, fieldMap) as unknown as TTarget;
}

/**
 * Creates a type guard function for validating objects against a type
 * 
 * Example:
 * ```typescript
 * const isExam = createTypeGuard<Exam>([
 *   'id', 'title', 'description', 'duration'
 * ]);
 * 
 * if (isExam(data)) {
 *   // data is typed as Exam
 * }
 * ```
 */
export function createTypeGuard<T>(requiredProps: (keyof T)[]) {
  return (value: unknown): value is T => {
    if (!value || typeof value !== 'object') return false;
    
    return requiredProps.every(prop => 
      prop in value
    );
  };
}

/**
 * Validates a response against a type and provides error details
 * 
 * Example:
 * ```typescript
 * validateResponse<ExamResponseDTO>(data, [
 *   'id', 'title', 'questions'
 * ]);
 * ```
 */
export function validateResponse<T>(
  data: unknown, 
  requiredProps: (keyof T)[]
): { valid: boolean; missing: string[] } {
  if (!data || typeof data !== 'object') {
    return { valid: false, missing: ['<not an object>'] };
  }
  
  const missing = requiredProps.filter(prop => !(prop in data));
  
  return {
    valid: missing.length === 0,
    missing: missing.map(String)
  };
}
