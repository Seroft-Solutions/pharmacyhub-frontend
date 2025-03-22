import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  // State
  expandedItems: Record<string, boolean>;
  isSidebarOpen: boolean;
  isMobileSidebarOpen: boolean;
  
  // Actions
  toggleItem: (id: string) => void;
  setExpanded: (id: string, isExpanded: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (isOpen: boolean) => void;
  
  // Initialize expanded state based on current path
  initializeExpandedState: (currentPath: string, menuItems: any[]) => void;
}

/**
 * Clean up any old keys from localStorage that might cause conflicts
 */
try {
  // If we're in a browser environment
  if (typeof window !== 'undefined' && window.localStorage) {
    const sidebarStorage = window.localStorage.getItem('sidebar-storage');
    if (sidebarStorage) {
      const parsed = JSON.parse(sidebarStorage);
      // Clean up examPreparation if it exists
      if (parsed?.state?.expandedItems?.examPreparation !== undefined) {
        delete parsed.state.expandedItems.examPreparation;
        // Make sure exams is set to true
        parsed.state.expandedItems.exams = true;
        // Save back to localStorage
        window.localStorage.setItem('sidebar-storage', JSON.stringify(parsed));
      }
    }
  }
} catch (error) {
  // Silently ignore any errors
  console.error('Error cleaning up sidebar storage:', error);
}

/**
 * Sidebar store for managing sidebar state
 * 
 * This replaces React context and hooks with a global Zustand store,
 * avoiding React hook ordering issues.
 */
export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      // Initial state - only use the 'exams' key consistently
      expandedItems: {
        exams: true
      },
      isSidebarOpen: true,
      isMobileSidebarOpen: false,
      
      // Actions
      toggleItem: (id: string) => set((state) => {
        // For the exams section, only allow expanding (never collapse)
        if (id === 'exams') {
          return {
            expandedItems: {
              ...state.expandedItems,
              exams: true  // Always keep exams expanded
            }
          };
        }
        
        // For other items, toggle as normal
        return {
          expandedItems: {
            ...state.expandedItems,
            [id]: !state.expandedItems[id]
          }
        };
      }),
      
      setExpanded: (id: string, isExpanded: boolean) => set((state) => {
        // For the exams section, only allow expanded state
        if (id === 'exams') {
          return {
            expandedItems: {
              ...state.expandedItems,
              exams: true  // Always keep exams expanded
            }
          };
        }
        
        // For other items, set as normal
        return {
          expandedItems: {
            ...state.expandedItems,
            [id]: isExpanded
          }
        };
      }),
      
      toggleSidebar: () => set((state) => ({
        isSidebarOpen: !state.isSidebarOpen
      })),
      
      setSidebarOpen: (isOpen: boolean) => set({
        isSidebarOpen: isOpen
      }),
      
      toggleMobileSidebar: () => set((state) => ({
        isMobileSidebarOpen: !state.isMobileSidebarOpen
      })),
      
      setMobileSidebarOpen: (isOpen: boolean) => set({
        isMobileSidebarOpen: isOpen
      }),
      
      // Initialize expanded state based on current URL
      initializeExpandedState: (currentPath: string, menuItems: any[]) => {
        // Only update state if necessary by checking current state first
        const currentState = get();
        
        // If exams is already expanded, we don't need to update
        if (currentState.expandedItems.exams === true) {
          // Check if we need to expand any other items based on current path
          const activeNavigationItemIds = [];
          
          // Find active navigation items
          menuItems.forEach(item => {
            if (item.subItems) {
              const isActive = item.href === currentPath || 
                currentPath?.startsWith(`${item.href}/`) ||
                item.subItems.some((subItem: any) => 
                  subItem.href === currentPath || currentPath?.startsWith(`${subItem.href}/`)
                );
                
              if (isActive) {
                activeNavigationItemIds.push(item.id);
              }
            }
          });
          
          // If all active items are already expanded, don't update state
          const needsUpdate = activeNavigationItemIds.some(id => !currentState.expandedItems[id]);
          
          if (!needsUpdate) {
            return; // No update needed
          }
        }
        
        // Always ensure the exams section is expanded by default
        const newExpandedState: Record<string, boolean> = {
          exams: true
        };
        
        // Add active navigation items
        menuItems.forEach(item => {
          if (item.subItems) {
            // Check for active navigation based on current path
            const isActive = item.href === currentPath || 
              currentPath?.startsWith(`${item.href}/`) ||
              item.subItems.some((subItem: any) => 
                subItem.href === currentPath || currentPath?.startsWith(`${subItem.href}/`)
              );
              
            if (isActive) {
              newExpandedState[item.id] = true;
            }
          }
        });
        
        // Only update if there are changes
        set((state) => ({
          expandedItems: {
            ...state.expandedItems,
            ...newExpandedState
          }
        }));
      }
    }),
    {
      name: 'sidebar-storage', // unique name for localStorage
      partialize: (state) => ({
        expandedItems: {
          ...state.expandedItems,
          // Always ensure exams is expanded by default
          exams: true
        },
        isSidebarOpen: state.isSidebarOpen,
      }),
      // Merge strategy to ensure exams is always expanded
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        expandedItems: {
          ...persistedState.expandedItems,
          ...currentState.expandedItems,
          // Always ensure exams is expanded by default
          exams: true
        }
      }),
    }
  )
);

export default useSidebarStore;