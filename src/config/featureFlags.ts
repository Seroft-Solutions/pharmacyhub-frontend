// Feature flag configuration
export const FEATURE_FLAGS = {
  LICENSING_ENABLED: process.env.NEXT_PUBLIC_LICENSING_ENABLED === 'true',
  REGISTRATION_ENABLED: process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === 'true',
  EMAIL_VERIFICATION_ENABLED: process.env.NEXT_PUBLIC_ENABLE_EMAIL_VERIFICATION === 'true',
  SOCIAL_LOGIN_ENABLED: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN === 'true',
  MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
} as const;

// Type-safe feature flag keys
export type FeatureFlag = keyof typeof FEATURE_FLAGS;

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (flag: FeatureFlag): boolean => {
  if (flag in FEATURE_FLAGS) {
    return FEATURE_FLAGS[flag];
  }
  // Log warning for development purposes
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Feature flag "${flag}" not found in configuration`);
  }
  return false;
};

// Debug function for development
if (process.env.NODE_ENV === 'development') {
  console.log('Feature Flags Configuration:', FEATURE_FLAGS);
}