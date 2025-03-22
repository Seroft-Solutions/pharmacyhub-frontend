"use client";

import { AppManager } from '@/features/shell/components/AppManager';
import { LocalStorageLogger } from '@/features/shell/components/debug/LocalStorageLogger';

interface AppManagerProviderProps {
  children: React.ReactNode;
}

// This provider doesn't actually provide a context, but it ensures the AppManager
// is included in the component tree, which sets up role synchronization
export default function AppManagerProvider({ children }: AppManagerProviderProps) {
  return (
    <>
      {/* Include LocalStorageLogger in development for debugging */}
      {process.env.NODE_ENV === 'development' && <LocalStorageLogger />}
      <AppManager />
      {children}
    </>
  );
}
