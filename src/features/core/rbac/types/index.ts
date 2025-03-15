/**
 * Feature DTO
 */
export interface FeatureDTO {
  id: number;
  name: string;
  description: string;
  code: string;
  active: boolean;
  parentFeatureId?: number;
  permissions: string[];
  childFeatures?: FeatureDTO[];
}

/**
 * Feature tree structure for UI display
 */
export interface FeatureTreeNode {
  id: number;
  name: string;
  description: string;
  code: string;
  active: boolean;
  level: number;
  children: FeatureTreeNode[];
  permissions: string[];
  parentFeatureId?: number;
}

/**
 * Feature access map
 */
export type FeatureAccessMap = Record<string, boolean>;
