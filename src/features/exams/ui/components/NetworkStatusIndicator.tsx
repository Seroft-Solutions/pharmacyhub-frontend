'use client';

import React, { useState, useEffect } from 'react';
import { WifiIcon, WifiOffIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * NetworkStatusIndicator
 * 
 * A component that shows the current network status and notifies the user
 * when they go online or offline during an exam.
 */
export function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    // Handle online status changes
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Network connection restored. Your progress is being saved.');
    };

    // Handle offline status changes
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Network connection lost. Your progress will be saved locally until connection is restored.');
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return (
      <div className={cn(
        "flex items-center gap-1.5 text-xs font-medium py-1 px-2 rounded-full",
        "bg-green-50 text-green-700 border border-green-200"
      )}>
        <WifiIcon className="h-3 w-3" />
        <span>Online</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-1.5 text-xs font-medium py-1 px-2 rounded-full",
      "bg-red-50 text-red-700 border border-red-200 animate-pulse"
    )}>
      <WifiOffIcon className="h-3 w-3" />
      <span>Offline</span>
    </div>
  );
}

export default NetworkStatusIndicator;
