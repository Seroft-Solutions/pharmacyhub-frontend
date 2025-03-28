/**
 * TanStack Query hooks for session management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getAllSessions, 
  getUserSessions, 
  requireOtpVerification, 
  terminateOtherSessions, 
  terminateSession, 
  validateLogin 
} from './sessionApi';
import { SessionFilterOptions } from '../types';

// Query keys
export const sessionKeys = {
  all: ['sessions'] as const,
  user: (userId: string) => [...sessionKeys.all, 'user', userId] as const,
  list: (options?: SessionFilterOptions) => [...sessionKeys.all, 'list', options] as const,
  userList: (userId: string, options?: SessionFilterOptions) => 
    [...sessionKeys.user(userId), 'list', options] as const,
};

/**
 * Hook to fetch all sessions (admin only)
 */
export const useAllSessions = (options?: SessionFilterOptions) => {
  return useQuery({
    queryKey: sessionKeys.list(options),
    queryFn: () => getAllSessions(options),
  });
};

/**
 * Hook to fetch sessions for a specific user
 */
export const useUserSessions = (userId: string, options?: SessionFilterOptions) => {
  return useQuery({
    queryKey: sessionKeys.userList(userId, options),
    queryFn: () => getUserSessions(userId, options),
    enabled: !!userId,
  });
};

/**
 * Hook to validate a login attempt
 */
export const useLoginValidation = () => {
  return useMutation({
    mutationFn: ({ userId, deviceId, userAgent, ipAddress }: { 
      userId: string;
      deviceId: string;
      userAgent: string;
      ipAddress?: string;
    }) => validateLogin(userId, deviceId, userAgent, ipAddress),
  });
};

/**
 * Hook to terminate a session
 */
export const useTerminateSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId: string) => terminateSession(sessionId),
    onSuccess: () => {
      // Invalidate all session queries to refresh the data
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
};

/**
 * Hook to terminate all other sessions for a user
 */
export const useTerminateOtherSessions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, currentSessionId }: { userId: string; currentSessionId: string }) => 
      terminateOtherSessions(userId, currentSessionId),
    onSuccess: (_, variables) => {
      // Invalidate user session queries to refresh the data
      queryClient.invalidateQueries({ queryKey: sessionKeys.user(variables.userId) });
    },
  });
};

/**
 * Hook to require OTP verification for a user's next login
 */
export const useRequireOtpVerification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => requireOtpVerification(userId),
    onSuccess: (_, userId) => {
      // Invalidate user session queries to refresh the data
      queryClient.invalidateQueries({ queryKey: sessionKeys.user(userId) });
    },
  });
};
