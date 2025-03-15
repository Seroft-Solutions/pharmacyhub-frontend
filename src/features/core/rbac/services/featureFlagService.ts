/**
 * Feature Flag Service
 * 
 * Service for managing feature flags at runtime.
 * Handles loading, saving, and checking feature flag states.
 */
import { getAllFeatures, getFeatureFlags } from '@/features/core/rbac/registry/featureRegistry';

// Type for feature flag state
type FeatureFlagMap = Record<string, boolean>;

/**
 * Service for managing feature flags at runtime
 */
export class FeatureFlagService {
  private flags: FeatureFlagMap = {};
  private initializing: Promise<void> | null = null;
  
  /**
   * Initialize feature flags from sources (local storage, API, etc.)
   */
  public async initialize(): Promise<void> {
    if (this.initializing) return this.initializing;
    
    this.initializing = (async () => {
      try {
        // First try loading from API
        await this.loadFlagsFromApi();
      } catch (error) {
        console.warn('Failed to load feature flags from API, using defaults or local storage');
        
        // Fall back to local storage or default
        this.loadFlagsFromLocalStorage();
      }
      
      // Ensure we have defaults for all registered features
      this.initializeDefaultFlags();
    })();
    
    return this.initializing;
  }
  
  /**
   * Check if a feature is enabled
   */
  public isEnabled(featureId: string, flagId?: string): boolean {
    // If checking a specific flag within a feature
    if (flagId) {
      const key = `${featureId}:${flagId}`;
      return this.flags[key] ?? false;
    }
    
    // If checking the entire feature
    return this.flags[featureId] ?? false;
  }
  
  /**
   * Enable a feature or a specific flag
   */
  public enableFeature(featureId: string, flagId?: string): void {
    if (flagId) {
      const key = `${featureId}:${flagId}`;
      this.flags[key] = true;
    } else {
      this.flags[featureId] = true;
    }
    this.saveToLocalStorage();
  }
  
  /**
   * Disable a feature or a specific flag
   */
  public disableFeature(featureId: string, flagId?: string): void {
    if (flagId) {
      const key = `${featureId}:${flagId}`;
      this.flags[key] = false;
    } else {
      this.flags[featureId] = false;
    }
    this.saveToLocalStorage();
  }
  
  /**
   * Get all feature flags
   */
  public getAllFlags(): FeatureFlagMap {
    return { ...this.flags };
  }
  
  /**
   * Get all flags for a specific feature
   */
  public getFeatureFlags(featureId: string): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    const prefix = `${featureId}:`;
    
    // Get the feature-level flag
    result[featureId] = this.flags[featureId] ?? false;
    
    // Get all flags that belong to this feature
    Object.keys(this.flags)
      .filter(key => key.startsWith(prefix))
      .forEach(key => {
        result[key] = this.flags[key];
      });
      
    return result;
  }
  
  /**
   * Load feature flags from API
   */
  private async loadFlagsFromApi(): Promise<void> {
    // Implement API call to fetch feature flags
    // Example:
    // const response = await apiClient.get<FeatureFlagMap>('/api/features/flags');
    // this.flags = { ...this.flags, ...response.data };
    
    // For now, just throw to fall back to local storage
    throw new Error('API not implemented');
  }
  
  /**
   * Load feature flags from local storage
   */
  private loadFlagsFromLocalStorage(): void {
    if (typeof window === 'undefined') return;
    
    const savedFlags = localStorage.getItem('feature-flags');
    if (savedFlags) {
      try {
        const parsedFlags = JSON.parse(savedFlags) as FeatureFlagMap;
        this.flags = { ...this.flags, ...parsedFlags };
      } catch (error) {
        console.error('Failed to parse saved feature flags', error);
      }
    }
  }
  
  /**
   * Save current flags to local storage
   */
  private saveToLocalStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('feature-flags', JSON.stringify(this.flags));
    } catch (error) {
      console.error('Failed to save feature flags', error);
    }
  }
  
  /**
   * Initialize default flag values for all registered features
   */
  private initializeDefaultFlags(): void {
    // Get all features
    const features = getAllFeatures();
    
    // Initialize feature-level flags
    Object.keys(features).forEach(featureId => {
      // Set the feature-level flag if not already set
      if (this.flags[featureId] === undefined) {
        this.flags[featureId] = features[featureId].defaultEnabled;
      }
      
      // Get all feature flags for this feature
      const featureFlags = getFeatureFlags(featureId);
      
      // Set individual flags if not already set
      Object.keys(featureFlags).forEach(flagId => {
        const key = `${featureId}:${flagId}`;
        if (this.flags[key] === undefined) {
          this.flags[key] = featureFlags[flagId].defaultEnabled;
        }
      });
    });
    
    // Save to local storage
    this.saveToLocalStorage();
  }
}

// Create a singleton instance
export const featureFlagService = new FeatureFlagService();
