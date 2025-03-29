/**
 * Feature Error Utilities
 * 
 * This file provides utilities for feature-related error handling.
 */
import { NormalizedError } from './errorUtils';

/**
 * Create a feature access denied error
 * @param featureId The feature ID that access was denied for
 * @returns Normalized error object
 */
export function createFeatureAccessDeniedError(featureId: string): NormalizedError {
  return {
    message: `Access denied to feature: ${featureId}`,
    code: 'FEATURE_ACCESS_DENIED',
    details: {
      featureId,
    },
  };
}