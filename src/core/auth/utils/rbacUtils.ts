/**
 * RBAC Utilities
 * 
 * Utility functions for Role-Based Access Control (RBAC) operations.
 */

/**
 * Check if all items in the required array are present in the available array
 * 
 * @param available - Array of available items
 * @param required - Array of required items
 * @returns True if all required items are present
 */
export const hasAllItems = (
  available: string[] | undefined, 
  required: string[]
): boolean => {
  if (!available || available.length === 0) {
    return required.length === 0;
  }
  
  return required.every(item => available.includes(item));
};

/**
 * Check if at least one item in the required array is present in the available array
 * 
 * @param available - Array of available items
 * @param required - Array of required items
 * @returns True if at least one required item is present
 */
export const hasAnyItem = (
  available: string[] | undefined, 
  required: string[]
): boolean => {
  if (!available || available.length === 0) {
    return required.length === 0;
  }
  
  return required.some(item => available.includes(item));
};

/**
 * Check if the user has the required items (roles or permissions)
 * based on the requirement mode (all or any)
 * 
 * @param available - Array of available items
 * @param required - Array of required items
 * @param requireAll - Whether all items are required (true) or any item is sufficient (false)
 * @returns True if the requirement is satisfied
 */
export const hasRequiredItems = (
  available: string[] | undefined,
  required: string[],
  requireAll: boolean
): boolean => {
  // If nothing is required, always grant access
  if (required.length === 0) {
    return true;
  }
  
  return requireAll 
    ? hasAllItems(available, required)
    : hasAnyItem(available, required);
};

export default {
  hasAllItems,
  hasAnyItem,
  hasRequiredItems
};
