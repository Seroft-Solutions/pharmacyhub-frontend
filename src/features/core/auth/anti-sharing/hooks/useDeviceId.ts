/**
 * Hook for getting and managing device ID
 */

import { useCallback, useEffect } from 'react';
import { getDeviceId, getBrowserFingerprint } from '../core/deviceManager';
import { useAntiSharingStore } from '../store';

export const useDeviceId = () => {
  const { deviceId, setDeviceId } = useAntiSharingStore();
  
  // Initialize device ID on mount
  useEffect(() => {
    if (!deviceId) {
      const newDeviceId = getDeviceId();
      setDeviceId(newDeviceId);
    }
  }, [deviceId, setDeviceId]);
  
  // Get device information including ID and browser fingerprint
  const getDeviceInfo = useCallback(() => {
    return {
      deviceId: deviceId || getDeviceId(),
      ...getBrowserFingerprint(),
    };
  }, [deviceId]);
  
  return {
    deviceId,
    getDeviceInfo,
  };
};
