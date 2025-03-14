/**
 * Types for feature-based access control
 */

/**
 * Feature access DTO
 * Contains information about a feature and the operations a user can perform
 */
export interface FeatureAccessDTO {
  featureCode: string;
  name: string;
  description: string;
  hasAccess: boolean;
  allowedOperations: string[];
}

/**
 * Common operation types
 * These are the standard operations that can be performed on features
 */
export enum FeatureOperation {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  MANAGE = 'MANAGE',
  EXECUTE = 'EXECUTE',
  PUBLISH = 'PUBLISH',
  TAKE = 'TAKE'
}

/**
 * Feature access map
 * Maps feature codes to their access status and operations
 */
export type FeatureAccessMap = Record<string, FeatureAccessDTO>;
