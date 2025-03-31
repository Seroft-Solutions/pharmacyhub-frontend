/**
 * useGuardedCallback Hook
 * 
 * A hook that wraps a callback function with a permission check.
 * This is useful for event handlers like button clicks, where you want to
 * ensure the user has permission before performing an action.
 * 
 * If the user doesn't have permission, the callback won't be executed and
 * optionally a notification can be shown.
 */

import { useCallback } from 'react';
import { useExamPermission } from './useExamPermission';
import { ExamOperation, ExamPermissionOptions, OperationPermissionMap } from '../types';
import { OPERATION_DESCRIPTIONS } from '../constants';

// Optional notification function
type NotifyFunc = (message: string) => void;

// Options for the guarded callback
interface GuardedCallbackOptions extends ExamPermissionOptions {
  // Whether to show a notification when the user doesn't have permission
  showNotification?: boolean;
  // Custom notification function
  notify?: NotifyFunc;
  // Custom message to show when the user doesn't have permission
  notificationMessage?: string;
  // Whether to execute the callback even if permission check fails (for testing)
  bypassPermissionCheck?: boolean;
}

/**
 * A hook that wraps a callback function with a permission check
 * 
 * @param operation The operation to check permission for
 * @param callback The callback function to execute if the user has permission
 * @param options Additional options for the permission check and notification
 * @returns A new function that includes the permission check
 * 
 * @example
 * // Basic usage
 * const handleDelete = useGuardedCallback(
 *   ExamOperation.DELETE_EXAM,
 *   () => deleteExam(examId),
 *   { context: { examId }, showNotification: true }
 * );
 * 
 * // Then use it in a component
 * <Button onClick={handleDelete}>Delete</Button>
 */
export function useGuardedCallback<T extends (...args: any[]) => any>(
  operation: ExamOperation,
  callback: T,
  options: GuardedCallbackOptions = {}
): (...args: Parameters<T>) => ReturnType<T> | void {
  // Destructure options
  const {
    showNotification = false,
    notify,
    notificationMessage,
    bypassPermissionCheck = false,
    ...permissionOptions
  } = options;

  // Check permission
  const { hasPermission, isLoading } = useExamPermission(operation, permissionOptions);

  // Default notification function that logs to console
  const defaultNotify: NotifyFunc = (message) => {
    console.warn(`Permission denied: ${message}`);
    
    // If running in a browser, show alert (for development)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      alert(message);
    }
  };

  // The notification function to use
  const notifyFunc = notify || defaultNotify;

  // Get the human-readable description of the operation
  const getOperationDescription = () => {
    return OPERATION_DESCRIPTIONS[operation] || operation.toString();
  };

  // Return a new function that checks permission before executing the callback
  return useCallback((...args: Parameters<T>) => {
    // Skip check if loading or explicitly bypassing
    if (isLoading || bypassPermissionCheck) {
      return callback(...args);
    }

    // Execute the callback if the user has permission
    if (hasPermission) {
      return callback(...args);
    } 
    
    // Otherwise, show a notification if enabled
    if (showNotification) {
      const message = notificationMessage || 
        `You don't have permission to ${getOperationDescription()}`;
      notifyFunc(message);
    }
    
    // Return undefined when permission is denied
    return undefined;
  }, [
    callback, 
    hasPermission, 
    isLoading, 
    bypassPermissionCheck, 
    showNotification, 
    notifyFunc, 
    notificationMessage,
    operation
  ]);
}

export default useGuardedCallback;
