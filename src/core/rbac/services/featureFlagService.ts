/**
 * Feature Flag Service
 * 
 * This service provides feature flag functionality for conditionally enabling
 * or disabling features based on user roles, permissions, or other criteria.
 */
import { 
  FeatureFlag,
  FeatureFlagOptions,
  FeatureTargeting 
} from '../types';
import { rbacService } from './rbacService';

/**
 * Service for managing feature flags
 */
class FeatureFlagService {
  private featureFlags: Record<string, FeatureFlag> = {};
  private isInitialized = false;
  private userId: string | null = null;

  /**
   * Initialize the feature flag service
   */
  initialize(): void {
    this.isInitialized = true;
    // In a real implementation, we would fetch feature flags from an API
    // For now, we'll just initialize with an empty object
  }

  /**
   * Register a new feature flag
   * @param featureFlag Feature flag to register
   */
  registerFeature(featureFlag: FeatureFlag): void {
    this.featureFlags[featureFlag.id] = featureFlag;
  }

  /**
   * Register multiple feature flags
   * @param featureFlags Array of feature flags to register
   */
  registerFeatures(featureFlags: FeatureFlag[]): void {
    featureFlags.forEach(flag => this.registerFeature(flag));
  }

  /**
   * Set the current user ID
   * @param userId User ID for targeting
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Check if a feature is enabled
   * @param featureId Feature ID to check
   * @param options Options for feature flag checking
   * @returns True if the feature is enabled
   */
  isFeatureEnabled(
    featureId: string, 
    options: FeatureFlagOptions = {}
  ): boolean {
    const { fallbackValue = false } = options;
    
    // If the service isn't initialized, return the fallback value
    if (!this.isInitialized) {
      return fallbackValue;
    }
    
    // If the feature doesn't exist, return the fallback value
    const feature = this.featureFlags[featureId];
    if (!feature) {
      return fallbackValue;
    }
    
    // Check feature state
    switch (feature.state) {
      case 'enabled':
        return true;
      case 'disabled':
        return false;
      case 'conditional':
        return this.evaluateTargeting(feature.targeting, feature.defaultValue);
      default:
        return fallbackValue;
    }
  }

  /**
   * Evaluate targeting rules to determine if a feature should be enabled
   * @param targeting Targeting rules
   * @param defaultValue Default value if targeting rules don't apply
   * @returns True if the feature should be enabled
   */
  private evaluateTargeting(
    targeting?: FeatureTargeting, 
    defaultValue: boolean = false
  ): boolean {
    if (!targeting) {
      return defaultValue;
    }

    // Check roles
    if (targeting.roles && targeting.roles.length > 0) {
      if (rbacService.hasAnyRole(targeting.roles)) {
        return true;
      }
    }
    
    // Check permissions
    if (targeting.permissions && targeting.permissions.length > 0) {
      if (rbacService.hasAnyPermission(targeting.permissions)) {
        return true;
      }
    }
    
    // Check user IDs
    if (targeting.userIds && targeting.userIds.length > 0 && this.userId) {
      if (targeting.userIds.includes(this.userId)) {
        return true;
      }
    }
    
    // Check percentage rollout
    if (targeting.percentageRollout !== undefined && this.userId) {
      const hash = this.hashUserId(this.userId);
      const percentage = hash % 100;
      if (percentage < targeting.percentageRollout) {
        return true;
      }
    }
    
    // Check custom rule
    if (targeting.customRule && this.userId) {
      try {
        return targeting.customRule({ id: this.userId });
      } catch (error) {
        console.error('Error in feature flag custom rule:', error);
      }
    }
    
    return defaultValue;
  }

  /**
   * Simple hash function for user IDs
   * @param userId User ID to hash
   * @returns Hash value (0-99)
   */
  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = (hash * 31 + userId.charCodeAt(i)) % 100;
    }
    return hash;
  }

  /**
   * Get all feature flags
   * @returns Record of feature flags
   */
  getAllFeatures(): Record<string, FeatureFlag> {
    return { ...this.featureFlags };
  }

  /**
   * Get a specific feature flag
   * @param featureId Feature ID to get
   * @returns Feature flag or undefined
   */
  getFeature(featureId: string): FeatureFlag | undefined {
    return this.featureFlags[featureId];
  }

  /**
   * Check if the feature flag service is initialized
   * @returns True if initialized
   */
  isServiceInitialized(): boolean {
    return this.isInitialized;
  }
}

// Export as a singleton
export const featureFlagService = new FeatureFlagService();

export default featureFlagService;