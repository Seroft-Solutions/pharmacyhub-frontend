'use client';

import { FEATURE_FLAGS, isFeatureEnabled } from '@/config/featureFlags';

export const FeatureFlagDebug = () => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-sm">
      <h3 className="font-bold mb-2">Feature Flags Status:</h3>
      <pre className="space-y-1">
        {Object.entries(FEATURE_FLAGS).map(([key, value]) => (
          <div key={key}>
            {key}: {String(value)}
          </div>
        ))}
      </pre>
    </div>
  );
};
