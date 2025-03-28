/**
 * Schema validation helpers
 * 
 * This module provides utilities for validating API responses against OpenAPI schemas
 */
import { validateResponse } from '@/features/core/app-api-schema/type-utilities';

/**
 * Enhanced fetch wrapper that validates API responses against OpenAPI types
 * 
 * @param input Request URL or object
 * @param init Request options
 * @param validateFn Optional validation function for the response
 * @returns Validated response data
 */
export async function fetchWithValidation<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  validateFn?: (data: unknown) => { valid: boolean; missing: string[] }
): Promise<T> {
  // Use the existing fetch function (which should include auth token handling)
  const response = await fetch(input, init);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // If validation function is provided, validate the response
  if (validateFn) {
    const validation = validateFn(data);
    if (!validation.valid) {
      console.warn(
        `API response validation warning - Missing fields: ${validation.missing.join(', ')}`,
        data
      );
    }
  }
  
  return data as T;
}

/**
 * Creates a validation function for a specific response type
 * 
 * @param requiredProps The properties that must exist on the response
 * @returns A validation function
 */
export function createValidator<T>(requiredProps: (keyof T)[]) {
  return (data: unknown) => validateResponse<T>(data, requiredProps);
}

/**
 * Extracts the response data from an API response
 * 
 * @param response The API response object
 * @param dataPath The path to the data property
 * @returns The extracted data
 */
export function extractResponseData<T>(
  response: unknown,
  dataPath: string = 'data'
): T | null {
  if (!response || typeof response !== 'object') {
    return null;
  }
  
  // Handle nested data paths like 'data.content'
  const parts = dataPath.split('.');
  let result = response;
  
  for (const part of parts) {
    if (!result || typeof result !== 'object' || !(part in result)) {
      return null;
    }
    result = result[part as keyof typeof result];
  }
  
  return result as T;
}

/**
 * Integration helpers for TanStack Query with OpenAPI types
 */
export const apiSchemaHelpers = {
  /**
   * Enhanced queryFn that validates response against a type
   * 
   * @param url The API URL
   * @param requiredProps Properties required on the response
   * @returns A query function for TanStack Query
   */
  createQueryFn: <T>(url: string, requiredProps: (keyof T)[]) => 
    async () => {
      const data = await fetchWithValidation<T>(
        url,
        undefined,
        (data) => validateResponse<T>(data, requiredProps)
      );
      return data;
    },
    
  /**
   * Enhanced mutationFn that validates request and response
   * 
   * @param url The API URL
   * @param method The HTTP method
   * @param requiredResponseProps Properties required on the response
   * @returns A mutation function for TanStack Query
   */
  createMutationFn: <TData, TVariables>(
    url: string, 
    method: string,
    requiredResponseProps: (keyof TData)[]
  ) => 
    async (variables: TVariables) => {
      const data = await fetchWithValidation<TData>(
        url,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(variables),
        },
        (data) => validateResponse<TData>(data, requiredResponseProps)
      );
      return data;
    }
};
