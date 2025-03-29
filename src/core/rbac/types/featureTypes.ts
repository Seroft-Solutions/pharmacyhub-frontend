/**
 * Feature Flag Type Definitions
 * 
 * This file contains TypeScript interfaces and types for Feature Flag functionality.
 * These types are used throughout the RBAC module to ensure type safety and provide IntelliSense.
 */
import { NormalizedError } from '../utils/errorHandling';

/**
 * Defines the possible states of a feature flag
 */
export type FeatureFlagState = 'enabled' | 'disabled' | 'conditional';

/**
 * Feature flag targeting rules for conditional features
 * @property roles - Roles that have access to this feature
 * @property permissions - Permissions required to access this feature
 * @property percentageRollout - Percentage of users who should see this feature (0-100)
 * @property userIds - Specific user IDs who should see this feature
 * @property customRule - Custom function to determine if a user should see this feature
 */
export interface FeatureTargeting {
  roles?: string[];
  permissions?: string[];
  percentageRollout?: number;
  userIds?: string[];
  customRule?: (user: any) => boolean;
}

/**
 * Represents a feature flag configuration
 * @property id - Unique identifier for the feature
 * @property name - Human-readable name for the feature
 * @property description - Description of what the feature does
 * @property state - Current state of the feature
 * @property targeting - Targeting rules for conditional features
 * @property defaultValue - Default value if targeting rules don't apply
 */
export interface FeatureFlag {
  id: string;
  name: string;
  description?: string;
  state: FeatureFlagState;
  targeting?: FeatureTargeting;
  defaultValue?: boolean;
}

/**
 * Feature flag check result
 * @property isEnabled - Whether the feature is enabled for the current user
 * @property isLoading - Whether the feature flag check is still loading
 * @property error - Any error that occurred during the feature flag check
 */
export interface FeatureFlagCheckResult {
  isEnabled: boolean;
  isLoading: boolean;
  error: NormalizedError | null;
}

/**
 * Feature flag configuration options
 * @property throwOnError - If true, throw an error if the feature flag check fails
 * @property fallbackValue - Value to return if the feature flag check fails
 */
export interface FeatureFlagOptions {
  throwOnError?: boolean;
  fallbackValue?: boolean;
}

/**
 * Represents the state of the feature flag service
 * @property isInitialized - Whether the feature flag service has been initialized
 * @property isLoading - Whether the feature flag service is currently loading data
 * @property error - Any error that occurred during initialization
 * @property flags - The current feature flags
 */
export interface FeatureFlagState {
  isInitialized: boolean;
  isLoading: boolean;
  error: NormalizedError | null;
  flags: Record<string, FeatureFlag>;
}