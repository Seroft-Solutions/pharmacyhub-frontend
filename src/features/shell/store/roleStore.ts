import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logger } from '@/shared/lib/logger';

// Define all available roles as string literals
export type SystemRole = 
  | 'USER' 
  | 'STUDENT' 
  | 'PHARMACIST' 
  | 'INSTRUCTOR' 
  | 'EXAM_CREATOR' 
  | 'SALESMAN' 
  | 'PHARMACY_MANAGER' 
  | 'PROPRIETOR' 
  | 'ADMIN' 
  | 'PER_ADMIN';

// Group roles for UI modes
export type UIMode = 'standard' | 'admin';

interface RoleState {
  // State
  activeRole: SystemRole;
  availableRoles: SystemRole[];
  initialized: boolean;
  
  // Actions
  setActiveRole: (role: SystemRole) => void;
  initializeRoles: (availableRoles?: string[]) => void;
  setInitialized: (initialized: boolean) => void;
  forceAdminRoleIfAvailable: () => boolean;
  resetRoles: () => void;
  
  // Derived states
  isAdmin: boolean;
  uiMode: UIMode;
}

// Safe localStorage access that works with SSR
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') {
    return null; // Return null during server-side rendering
  }
  try {
    return localStorage.getItem(key);
  } catch (e) {
    logger.error("[roleStore] Error accessing localStorage", { error: e });
    return null;
  }
};

// Safe localStorage setter that works with SSR
const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      logger.error("[roleStore] Error setting localStorage", { error: e, key, value });
    }
  }
};

// Safe localStorage removal that works with SSR
const removeLocalStorageItem = (key: string): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      logger.error("[roleStore] Error removing localStorage item", { error: e, key });
    }
  }
};

// Helper to determine if a role is an admin role
const isAdminRole = (role: SystemRole): boolean => {
  return role === 'ADMIN' || role === 'PER_ADMIN';
};

// Helper to determine the UI mode based on the active role
const getUIModeForRole = (role: SystemRole): UIMode => {
  return isAdminRole(role) ? 'admin' : 'standard';
};

// Convert string to SystemRole (with validation)
const toSystemRole = (role: string): SystemRole | null => {
  const validRoles: SystemRole[] = [
    'USER', 'STUDENT', 'PHARMACIST', 'INSTRUCTOR', 
    'EXAM_CREATOR', 'SALESMAN', 'PHARMACY_MANAGER', 
    'PROPRIETOR', 'ADMIN', 'PER_ADMIN'
  ];
  
  if (validRoles.includes(role as SystemRole)) {
    return role as SystemRole;
  }
  
  return null; // Return null for invalid roles
};

// Helper to check if arrays are equal
const areArraysEqual = (a: SystemRole[], b: SystemRole[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((val, idx) => val === b[idx]);
};

/**
 * Role store for managing user's selected role
 * 
 * This provides a global store for role state using Zustand,
 * which avoids React context/provider issues and hook ordering problems.
 */
export const useRoleStore = create<RoleState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeRole: 'USER',
      availableRoles: ['USER'],
      initialized: false,
      
      // Actions
      setActiveRole: (role) => {
        // Only allow setting roles that the user actually has
        const availableRoles = get().availableRoles;
        if (!availableRoles.includes(role)) {
          logger.warn('[RoleStore] Cannot switch to role: user lacks this role', {
            requestedRole: role,
            availableRoles
          });
          return;
        }
        
        // Don't update if role is already active to avoid re-renders
        if (get().activeRole === role) return;
        
        // Store in localStorage for persistence
        setLocalStorageItem('activeRole', role);
        
        logger.debug('[RoleStore] Setting active role', {
          previousRole: get().activeRole,
          newRole: role
        });
        
        set({ 
          activeRole: role,
          initialized: true
        });
      },
      
      initializeRoles: (userRoles?: string[]) => {
        // If we don't have userRoles, don't proceed to avoid infinite loops
        if (!userRoles || !userRoles.length) {
          logger.debug('[RoleStore] initializeRoles called with no roles, skipping');
          return;
        }
        
        // Convert valid user roles to SystemRole type (excluding nulls)
        const validUserRoles: SystemRole[] = userRoles
          .map(toSystemRole)
          .filter((role): role is SystemRole => role !== null);
        
        if (!validUserRoles.length) {
          logger.debug('[RoleStore] No valid roles found, skipping initialization');
          return;
        }
        
        // Always add USER role if it's not already included
        if (!validUserRoles.includes('USER')) {
          validUserRoles.unshift('USER');
        }
        
        // Get current state
        const currentState = get();
        
        logger.debug('[RoleStore] Initializing roles', {
          currentRoles: currentState.availableRoles,
          newRoles: validUserRoles,
          initialized: currentState.initialized,
          activeRole: currentState.activeRole
        });
        
        // Get saved role from localStorage directly (not from state)
        const savedRole = getLocalStorageItem('activeRole') as SystemRole | null;
        const savedRoleValid = savedRole && validUserRoles.includes(savedRole);
        
        logger.debug('[RoleStore] Saved role', {
          savedRole,
          savedRoleValid,
          validUserRoles
        });
        
        // If we don't have an active role yet or it's invalid, set a default
        if (!currentState.activeRole || !validUserRoles.includes(currentState.activeRole)) {
          // Decide what role to activate
          let newActiveRole: SystemRole;
          
          if (savedRoleValid) {
            // Use saved role from localStorage
            newActiveRole = savedRole;
            logger.debug('[RoleStore] Using saved role from localStorage', { savedRole });
          } else if (validUserRoles.includes('ADMIN')) {
            // Default to ADMIN if available
            newActiveRole = 'ADMIN';
            logger.debug('[RoleStore] Using ADMIN role by default');
          } else if (validUserRoles.includes('PER_ADMIN')) {
            // Fall back to PER_ADMIN
            newActiveRole = 'PER_ADMIN';
            logger.debug('[RoleStore] Using PER_ADMIN role by default');
          } else {
            // Otherwise use USER
            newActiveRole = 'USER';
            logger.debug('[RoleStore] Using USER role by default');
          }
          
          // Update localStorage with the active role
          setLocalStorageItem('activeRole', newActiveRole);
          
          // Update state with new active role and available roles
          set({ 
            activeRole: newActiveRole,
            availableRoles: validUserRoles,
            initialized: true
          });
          
          return;
        }
        
        // If roles haven't changed, just update initialized state if needed
        if (areArraysEqual(currentState.availableRoles, validUserRoles)) {
          if (!currentState.initialized) {
            set({ initialized: true });
          }
          return;
        }
        
        // Update available roles while keeping active role the same
        set({ 
          availableRoles: validUserRoles,
          initialized: true
        });
      },
      
      setInitialized: (initialized) => set({ initialized }),
      
      // Reset roles to initial state
      resetRoles: () => {
        removeLocalStorageItem('activeRole');
        set({
          activeRole: 'USER',
          availableRoles: ['USER'],
          initialized: false
        });
      },
      
      forceAdminRoleIfAvailable: () => {
        const availableRoles = get().availableRoles;
        
        // Try to set admin role if available
        if (availableRoles.includes('ADMIN')) {
          logger.debug('[RoleStore] Forcing ADMIN role');
          set({ activeRole: 'ADMIN' });
          setLocalStorageItem('activeRole', 'ADMIN');
          return true;
        } else if (availableRoles.includes('PER_ADMIN')) {
          logger.debug('[RoleStore] Forcing PER_ADMIN role');
          set({ activeRole: 'PER_ADMIN' });
          setLocalStorageItem('activeRole', 'PER_ADMIN');
          return true;
        }
        
        // Could not set admin role
        logger.debug('[RoleStore] Could not force admin role - no admin roles available', {
          availableRoles
        });
        return false;
      },
      
      // Derived states that update automatically
      get isAdmin() {
        return isAdminRole(get().activeRole);
      },
      
      get uiMode() {
        return getUIModeForRole(get().activeRole);
      }
    }),
    {
      name: 'role-storage', // unique name for localStorage
      partialize: (state) => ({ 
        activeRole: state.activeRole,
        availableRoles: state.availableRoles,
        initialized: state.initialized
      }),
    }
  )
);

/**
 * Force admin mode - use this for admin pages
 */
export function forceAdminMode() {
  logger.debug('[roleStore] Attempting to force admin mode');
  return useRoleStore.getState().forceAdminRoleIfAvailable();
}

/**
 * Hook to handle role synchronization during auth state changes.
 * Used by AppManager component to handle auth events.
 */
export function useRoleSync() {
  const { initializeRoles, setActiveRole, resetRoles } = useRoleStore();
  
  // Function to handle authentication events
  const syncWithAuthState = (user: any) => {
    if (!user || !user.roles) {
      // Reset roles if user is not logged in
      resetRoles();
      return;
    }
    
    logger.debug('[roleSync] Syncing with auth state', {
      username: user.username,
      roles: user.roles
    });
    
    // Initialize roles
    initializeRoles(user.roles);
    
    // Check if there's a stored role preference
    const savedRole = localStorage.getItem('activeRole');
    
    // If there's a saved role and it's valid for this user, ensure it's active
    if (savedRole && user.roles.includes(savedRole)) {
      setActiveRole(savedRole as SystemRole);
      logger.debug('[roleSync] Restored saved role', { savedRole });
    } else if (user.roles.includes('ADMIN')) {
      // Default to admin role if available
      setActiveRole('ADMIN');
      logger.debug('[roleSync] Set ADMIN role by default');
    }
  };
  
  return { syncWithAuthState };
}

export default useRoleStore;