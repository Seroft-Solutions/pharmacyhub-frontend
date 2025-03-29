/**
 * User Service
 * 
 * Example service that demonstrates how to use TanStack Query with the API module.
 * This is a reference implementation that can be used as a template for other services.
 */
import { QueryClient } from '@tanstack/react-query';
import { 
  useApiQuery, 
  useApiMutation, 
  useApiPaginatedQuery 
} from '../hooks';
import { 
  optimisticAddItem, 
  optimisticUpdateItem, 
  optimisticRemoveItem 
} from '../utils/optimisticUpdates';
import { createQueryKeyFactory } from '../utils/queryKeyFactory';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Define user input for creation/updates
export interface UserInput {
  name: string;
  email: string;
  role?: string;
}

// Define pagination response
export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Create query keys for users
export const userKeys = createQueryKeyFactory<'me' | 'profile' | 'permissions'>('users');

/**
 * User Service
 * 
 * Provides hooks and utilities for working with user data
 */
export const userService = {
  /**
   * Get all users
   */
  useUsers: (filters?: Record<string, any>) => {
    return useApiQuery<User[]>(
      userKeys.lists(filters),
      '/users',
      {
        params: filters
      }
    );
  },

  /**
   * Get a paginated list of users
   */
  usePaginatedUsers: (page: number, size: number, filters?: Record<string, any>) => {
    return useApiPaginatedQuery<PaginatedResponse<User>>(
      userKeys.lists(filters),
      '/users',
      { page, size },
      {
        params: filters
      }
    );
  },

  /**
   * Get a user by ID
   */
  useUser: (id: string) => {
    return useApiQuery<User>(
      userKeys.detail(id),
      `/users/${id}`
    );
  },

  /**
   * Get the current user
   */
  useCurrentUser: () => {
    return useApiQuery<User>(
      userKeys.action('me'),
      '/users/me'
    );
  },

  /**
   * Create a new user
   */
  useCreateUser: (options?: {
    onSuccess?: (user: User) => void;
    useOptimisticUpdate?: boolean;
  }) => {
    const queryClient = new QueryClient();
    
    return useApiMutation<User, UserInput>(
      '/users',
      {
        onMutate: async (newUserData) => {
          // Only do optimistic update if requested
          if (!options?.useOptimisticUpdate) return;
          
          // Cancel outgoing refetches
          await queryClient.cancelQueries(userKeys.lists());
          
          // Create a temporary user for optimistic update
          const tempUser: User = {
            id: `temp-${Date.now()}`,
            name: newUserData.name,
            email: newUserData.email,
            role: newUserData.role || 'user'
          };
          
          // Add user optimistically
          const previousUsers = optimisticAddItem<User>({
            queryClient,
            queryKey: userKeys.lists(),
            newItem: tempUser
          });
          
          // Return context for rollback
          return { previousUsers };
        },
        onError: (err, newUserData, context) => {
          // Only rollback if we did an optimistic update
          if (!options?.useOptimisticUpdate) return;
          
          // Rollback to previous state
          if (context?.previousUsers) {
            queryClient.setQueryData(userKeys.lists(), context.previousUsers);
          }
        },
        onSuccess: (data) => {
          // Invalidate related queries
          queryClient.invalidateQueries(userKeys.lists());
          
          // Call success callback
          if (options?.onSuccess) {
            options.onSuccess(data);
          }
        }
      }
    );
  },

  /**
   * Update a user
   */
  useUpdateUser: (id: string, options?: {
    onSuccess?: (user: User) => void;
    useOptimisticUpdate?: boolean;
  }) => {
    const queryClient = new QueryClient();
    
    return useApiMutation<User, UserInput>(
      `/users/${id}`,
      {
        onMutate: async (userData) => {
          // Only do optimistic update if requested
          if (!options?.useOptimisticUpdate) return;
          
          // Cancel outgoing refetches
          await queryClient.cancelQueries(userKeys.lists());
          await queryClient.cancelQueries(userKeys.detail(id));
          
          // Update user in list
          const previousUsers = optimisticUpdateItem<User>({
            queryClient,
            queryKey: userKeys.lists(),
            id,
            getItemId: (user) => user.id,
            updates: userData
          });
          
          // Update user in detail view
          const previousUser = queryClient.getQueryData<User>(userKeys.detail(id));
          if (previousUser) {
            queryClient.setQueryData<User>(userKeys.detail(id), {
              ...previousUser,
              ...userData
            });
          }
          
          // Return context for rollback
          return { previousUsers, previousUser };
        },
        onError: (err, userData, context) => {
          // Only rollback if we did an optimistic update
          if (!options?.useOptimisticUpdate) return;
          
          // Rollback to previous state
          if (context?.previousUsers) {
            queryClient.setQueryData(userKeys.lists(), context.previousUsers);
          }
          
          if (context?.previousUser) {
            queryClient.setQueryData(userKeys.detail(id), context.previousUser);
          }
        },
        onSuccess: (data) => {
          // Invalidate related queries
          queryClient.invalidateQueries(userKeys.lists());
          queryClient.invalidateQueries(userKeys.detail(id));
          
          // Call success callback
          if (options?.onSuccess) {
            options.onSuccess(data);
          }
        }
      }
    );
  },

  /**
   * Delete a user
   */
  useDeleteUser: (id: string, options?: {
    onSuccess?: () => void;
    useOptimisticUpdate?: boolean;
  }) => {
    const queryClient = new QueryClient();
    
    return useApiMutation<void, void>(
      `/users/${id}`,
      {
        method: 'DELETE',
        onMutate: async () => {
          // Only do optimistic update if requested
          if (!options?.useOptimisticUpdate) return;
          
          // Cancel outgoing refetches
          await queryClient.cancelQueries(userKeys.lists());
          
          // Remove user from list
          const previousUsers = optimisticRemoveItem<User>({
            queryClient,
            queryKey: userKeys.lists(),
            id,
            getItemId: (user) => user.id
          });
          
          // Remove user from detail view
          const previousUser = queryClient.getQueryData<User>(userKeys.detail(id));
          queryClient.removeQueries(userKeys.detail(id));
          
          // Return context for rollback
          return { previousUsers, previousUser };
        },
        onError: (err, userData, context) => {
          // Only rollback if we did an optimistic update
          if (!options?.useOptimisticUpdate) return;
          
          // Rollback to previous state
          if (context?.previousUsers) {
            queryClient.setQueryData(userKeys.lists(), context.previousUsers);
          }
          
          if (context?.previousUser) {
            queryClient.setQueryData(userKeys.detail(id), context.previousUser);
          }
        },
        onSuccess: () => {
          // Invalidate related queries
          queryClient.invalidateQueries(userKeys.lists());
          queryClient.removeQueries(userKeys.detail(id));
          
          // Call success callback
          if (options?.onSuccess) {
            options.onSuccess();
          }
        }
      }
    );
  }
};

export default userService;