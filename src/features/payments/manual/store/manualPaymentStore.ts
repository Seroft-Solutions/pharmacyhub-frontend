/**
 * Manual Payments Store
 * 
 * A Zustand store to manage manual payment state and prevent request loops.
 * This replaces direct React Query hooks with a centralized store that handles
 * caching, request deduplication, and state persistence.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiClient } from '../../../core/app-api-handler';
import { MANUAL_PAYMENT_ENDPOINTS } from '../api/constants/endpoints';

// Types
export interface ManualPaymentResponseDTO {
  id: number;
  examId: number;
  userId: string;
  username: string;
  amount: number;
  transactionId: string;
  requestDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  screenshotUrl?: string;
  processedDate?: string;
  processedBy?: string;
  notes?: string;
}

export interface ManualPaymentState {
  // Data
  userRequests: ManualPaymentResponseDTO[];
  examAccessMap: Record<number, boolean>;
  pendingRequestMap: Record<number, boolean>;
  
  // Loading states
  isLoadingUserRequests: boolean;
  isLoadingExamAccess: Record<number, boolean>;
  isLoadingPendingRequest: Record<number, boolean>;
  
  // Error states
  userRequestsError: string | null;
  examAccessError: Record<number, string | null>;
  pendingRequestError: Record<number, string | null>;
  
  // Timestamps to control refetching
  lastFetchedUserRequests: number;
  lastFetchedExamAccess: Record<number, number>;
  lastFetchedPendingRequest: Record<number, number>;
  
  // Actions
  fetchUserManualRequests: () => Promise<ManualPaymentResponseDTO[]>;
  checkManualExamAccess: (examId: number) => Promise<boolean>;
  checkPendingManualRequest: (examId: number) => Promise<boolean>;
  
  // Utilities
  clearCache: () => void;
  hasAccess: (examId: number) => boolean;
  hasPendingRequest: (examId: number) => boolean;
}

// Function to convert IDs to long format for Java backend
const toLongId = (id: number | string): string => {
  return String(parseInt(id.toString()));
};

/**
 * Create a throttled storage adapter to prevent excessive localStorage operations
 * This is critical for performance as localStorage operations are synchronous and
 * can block the main thread if called too frequently
 */
const throttledStorage = {
  getItem: createJSONStorage(() => localStorage).getItem,
  setItem: (name: string, value: string) => {
    // Use a debounce technique with setTimeout for better performance
    if (typeof window !== 'undefined') {
      // Clear any existing timeout to prevent multiple pending updates
      const existingTimeout = (window as any).__MANUAL_PAYMENT_STORAGE_TIMEOUT;
      if (existingTimeout) {
        window.clearTimeout(existingTimeout);
      }
      
      // Set a new timeout to batch localStorage updates
      (window as any).__MANUAL_PAYMENT_STORAGE_TIMEOUT = window.setTimeout(() => {
        localStorage.setItem(name, value);
        (window as any).__MANUAL_PAYMENT_STORAGE_TIMEOUT = null;
      }, 500); // 500ms debounce time
    }
  },
  removeItem: createJSONStorage(() => localStorage).removeItem
};

// Create the Zustand store with throttled persistence
export const useManualPaymentStore = create<ManualPaymentState>()(
  persist(
    (set, get) => ({
      // Initial state
      userRequests: [],
      examAccessMap: {},
      pendingRequestMap: {},
      
      isLoadingUserRequests: false,
      isLoadingExamAccess: {},
      isLoadingPendingRequest: {},
      
      userRequestsError: null,
      examAccessError: {},
      pendingRequestError: {},
      
      lastFetchedUserRequests: 0,
      lastFetchedExamAccess: {},
      lastFetchedPendingRequest: {},
      
      // Fetch user's manual payment requests with caching
      fetchUserManualRequests: async () => {
        const currentTime = Date.now();
        const lastFetched = get().lastFetchedUserRequests;
        const CACHE_TTL = 60000; // 1 minute cache
        
        // Return cached data if it's fresh enough
        if (currentTime - lastFetched < CACHE_TTL && get().userRequests.length > 0) {
          return get().userRequests;
        }
        
        // Set loading state
        set({ isLoadingUserRequests: true, userRequestsError: null });
        
        try {
          const response = await apiClient.get<ManualPaymentResponseDTO[]>(
            MANUAL_PAYMENT_ENDPOINTS.getUserRequests
          );
          
          if (response.error) {
            throw new Error(response.error);
          }
          
          // Update state with new data
          set({
            userRequests: response.data,
            isLoadingUserRequests: false,
            lastFetchedUserRequests: currentTime
          });
          
          return response.data;
        } catch (error) {
          // Handle error
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          set({
            isLoadingUserRequests: false,
            userRequestsError: errorMessage
          });
          
          return get().userRequests; // Return current state on error
        }
      },
      
      // Check if user has access to a specific exam
      checkManualExamAccess: async (examId: number) => {
        const currentTime = Date.now();
        const lastFetched = get().lastFetchedExamAccess[examId] || 0;
        const CACHE_TTL = 60000; // 1 minute cache
        
        // Return cached data if it's fresh enough
        if (currentTime - lastFetched < CACHE_TTL && examId in get().examAccessMap) {
          return get().examAccessMap[examId];
        }
        
        // Set loading state for this specific examId
        set(state => ({
          isLoadingExamAccess: {
            ...state.isLoadingExamAccess,
            [examId]: true
          },
          examAccessError: {
            ...state.examAccessError,
            [examId]: null
          }
        }));
        
        try {
          const endpoint = MANUAL_PAYMENT_ENDPOINTS.checkExamAccess.replace(':examId', toLongId(examId));
          const response = await apiClient.get<{hasAccess: boolean}>(endpoint);
          
          if (response.error) {
            throw new Error(response.error);
          }
          
          // Update state with new data
          set(state => ({
            examAccessMap: {
              ...state.examAccessMap,
              [examId]: response.data.hasAccess
            },
            isLoadingExamAccess: {
              ...state.isLoadingExamAccess,
              [examId]: false
            },
            lastFetchedExamAccess: {
              ...state.lastFetchedExamAccess,
              [examId]: currentTime
            }
          }));
          
          return response.data.hasAccess;
        } catch (error) {
          // Handle error
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          set(state => ({
            isLoadingExamAccess: {
              ...state.isLoadingExamAccess,
              [examId]: false
            },
            examAccessError: {
              ...state.examAccessError,
              [examId]: errorMessage
            }
          }));
          
          // Return current state on error, default to false if not existing
          return get().examAccessMap[examId] || false;
        }
      },
      
      // Check if user has a pending request for a specific exam
      checkPendingManualRequest: async (examId: number) => {
        const currentTime = Date.now();
        const lastFetched = get().lastFetchedPendingRequest[examId] || 0;
        const CACHE_TTL = 60000; // 1 minute cache
        
        // Return cached data if it's fresh enough
        if (currentTime - lastFetched < CACHE_TTL && examId in get().pendingRequestMap) {
          return get().pendingRequestMap[examId];
        }
        
        // Set loading state for this specific examId
        set(state => ({
          isLoadingPendingRequest: {
            ...state.isLoadingPendingRequest,
            [examId]: true
          },
          pendingRequestError: {
            ...state.pendingRequestError,
            [examId]: null
          }
        }));
        
        try {
          const endpoint = MANUAL_PAYMENT_ENDPOINTS.checkPendingRequest.replace(':examId', toLongId(examId));
          const response = await apiClient.get<{hasPending: boolean}>(endpoint);
          
          if (response.error) {
            throw new Error(response.error);
          }
          
          // Update state with new data
          set(state => ({
            pendingRequestMap: {
              ...state.pendingRequestMap,
              [examId]: response.data.hasPending
            },
            isLoadingPendingRequest: {
              ...state.isLoadingPendingRequest,
              [examId]: false
            },
            lastFetchedPendingRequest: {
              ...state.lastFetchedPendingRequest,
              [examId]: currentTime
            }
          }));
          
          return response.data.hasPending;
        } catch (error) {
          // Handle error
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          set(state => ({
            isLoadingPendingRequest: {
              ...state.isLoadingPendingRequest,
              [examId]: false
            },
            pendingRequestError: {
              ...state.pendingRequestError,
              [examId]: errorMessage
            }
          }));
          
          // Return current state on error, default to false if not existing
          return get().pendingRequestMap[examId] || false;
        }
      },
      
      // Helper function to check if user has access to an exam
      hasAccess: (examId: number) => {
        // Return cached value or false
        return get().examAccessMap[examId] || false;
      },
      
      // Helper function to check if user has pending request for an exam
      hasPendingRequest: (examId: number) => {
        // Return cached value or false
        return get().pendingRequestMap[examId] || false;
      },
      
      // Clear all cached data
      clearCache: () => {
        set({
          lastFetchedUserRequests: 0,
          lastFetchedExamAccess: {},
          lastFetchedPendingRequest: {}
        });
      }
    }),
    {
      name: 'manual-payment-store',
      // Use our throttled storage implementation
      storage: createJSONStorage(() => throttledStorage),
      // Only persist certain data
      partialize: (state) => ({
        userRequests: state.userRequests,
        examAccessMap: state.examAccessMap,
        pendingRequestMap: state.pendingRequestMap,
        lastFetchedUserRequests: state.lastFetchedUserRequests,
        lastFetchedExamAccess: state.lastFetchedExamAccess,
        lastFetchedPendingRequest: state.lastFetchedPendingRequest
      })
    }
  )
);

// Export selectors
export const selectUserRequests = (state: ManualPaymentState) => state.userRequests;
export const selectIsLoadingUserRequests = (state: ManualPaymentState) => state.isLoadingUserRequests;
export const selectUserRequestsError = (state: ManualPaymentState) => state.userRequestsError;

export const selectExamAccess = (examId: number) => (state: ManualPaymentState) => 
  state.examAccessMap[examId] || false;

export const selectIsLoadingExamAccess = (examId: number) => (state: ManualPaymentState) => 
  state.isLoadingExamAccess[examId] || false;

export const selectExamAccessError = (examId: number) => (state: ManualPaymentState) => 
  state.examAccessError[examId] || null;

export const selectPendingRequest = (examId: number) => (state: ManualPaymentState) => 
  state.pendingRequestMap[examId] || false;

export const selectIsLoadingPendingRequest = (examId: number) => (state: ManualPaymentState) => 
  state.isLoadingPendingRequest[examId] || false;

export const selectPendingRequestError = (examId: number) => (state: ManualPaymentState) => 
  state.pendingRequestError[examId] || null;

export default useManualPaymentStore;