/**
 * Auth State Management
 * 
 * This module provides utilities for managing auth state
 * including token storage and retrieval.
 */
import { User } from './types';

interface AuthStorageState {
  token: string;
  user?: User;
  expires?: string;
}

interface AuthStorage {
  state: AuthStorageState;
}

const AUTH_STORAGE_KEY = 'auth-storage';

/**
 * Get the current auth state from storage
 */
export function getAuthState(): AuthStorageState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const storageData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!storageData) return null;
    
    const parsedData = JSON.parse(storageData) as AuthStorage;
    return parsedData.state;
  } catch (error) {
    console.error('Failed to parse auth state:', error);
    return null;
  }
}

/**
 * Save auth state to storage
 */
export function saveAuthState(state: AuthStorageState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ state }));
  } catch (error) {
    console.error('Failed to save auth state:', error);
  }
}

/**
 * Clear auth state from storage
 */
export function clearAuthState(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear auth state:', error);
  }
}

/**
 * Get the current auth token
 */
export function getAuthToken(): string | null {
  const state = getAuthState();
  return state?.token || null;
}

/**
 * Check if the user is authenticated based on storage
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
