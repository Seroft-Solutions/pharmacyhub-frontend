import { LucideIcon } from "lucide-react";

/**
 * Represents an individual item in the application navigation
 */
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  feature?: string;        // Which feature this item belongs to
  permissions?: string[];
  roles?: string[];
  badge?: string | number;
  subItems?: NavItem[];
  order?: number;          // Optional order for sorting items
}

/**
 * Feature navigation configuration
 */
export interface FeatureNavigation {
  id: string;              // Unique feature identifier
  name: string;            // Display name of the feature
  items: NavItem[];        // Navigation items for this feature
  rootPath?: string;       // Root path for this feature (e.g., /exams)
  permissions?: string[];  // Permissions required to access this feature
  roles?: string[];        // Roles required to access this feature
  order?: number;          // Optional order for sorting features in the navigation
}

/**
 * Props for the NavigationProvider component
 */
export interface NavigationProviderProps {
  children: React.ReactNode;
  initialFeatures?: FeatureNavigation[];
}

/**
 * Navigation context value
 */
export interface NavigationContextValue {
  features: FeatureNavigation[];
  activeFeature: string | null;
  registerFeature: (feature: FeatureNavigation) => void;
  unregisterFeature: (featureId: string) => void;
  getFeatureItems: (featureId: string) => NavItem[];
  getAllItems: () => NavItem[];
  getCurrentPath: () => string;
}
