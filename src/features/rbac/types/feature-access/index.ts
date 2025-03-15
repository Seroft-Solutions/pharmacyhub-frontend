/**
 * Feature Access Types
 */

/**
 * Represents access details for a specific feature
 */
export interface FeatureAccessDTO {
  /**
   * Unique code identifying the feature
   */
  featureCode: string;
  
  /**
   * Display name of the feature
   */
  featureName: string;
  
  /**
   * Description of the feature
   */
  description?: string;
  
  /**
   * Whether the user has access to this feature
   */
  hasAccess: boolean;
  
  /**
   * Operations the user is allowed to perform on this feature
   */
  allowedOperations: string[];
  
  /**
   * Additional feature metadata
   */
  metadata?: Record<string, any>;
}

/**
 * Map of feature codes to their access details
 */
export interface FeatureAccessMap {
  [featureCode: string]: FeatureAccessDTO;
}
