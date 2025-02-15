export const featureFlags = {
  newDashboard: {
    enabled: true,
    roles: ['admin'],
    environments: ['development', 'staging']
  },
  billingEnabled: {
    enabled: process.env.NEXT_PUBLIC_BILLING_ENABLED === 'true',
  },
  // Add more feature flags here
};
