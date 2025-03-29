/**
 * Optimistic Update Utilities
 * 
 * This module provides utilities for implementing optimistic updates
 * with TanStack Query, to improve the user experience for mutations.
 */
import { 
  QueryClient, 
  QueryKey,
  InfiniteData,
  DefaultError
} from '@tanstack/react-query';

/**
 * Options for optimistic adding an item to a list
 */
export interface OptimisticAddOptions<TData, TItem> {
  /**
   * Query client instance
   */
  queryClient: QueryClient;
  
  /**
   * Query key for the list
   */
  queryKey: QueryKey;
  
  /**
   * New item to add to the list
   */
  newItem: TItem;
  
  /**
   * Function to add the item to the list
   * @default list => [newItem, ...list]
   */
  addFn?: (list: TData[], newItem: TItem) => TData[];
}

/**
 * Options for optimistic updating an item in a list
 */
export interface OptimisticUpdateOptions<TData, TItem> {
  /**
   * Query client instance
   */
  queryClient: QueryClient;
  
  /**
   * Query key for the list
   */
  queryKey: QueryKey;
  
  /**
   * ID of the item to update
   */
  id: string | number;
  
  /**
   * Function to identify items by ID
   */
  getItemId: (item: TData) => string | number;
  
  /**
   * Updates to apply to the item
   */
  updates: Partial<TItem>;
}

/**
 * Options for optimistic removing an item from a list
 */
export interface OptimisticRemoveOptions<TData> {
  /**
   * Query client instance
   */
  queryClient: QueryClient;
  
  /**
   * Query key for the list
   */
  queryKey: QueryKey;
  
  /**
   * ID of the item to remove
   */
  id: string | number;
  
  /**
   * Function to identify items by ID
   */
  getItemId: (item: TData) => string | number;
}

/**
 * Optimistically add an item to a list
 * 
 * @param options Options for the optimistic add
 * @returns Previous data for rollback
 */
export function optimisticAddItem<TData, TItem = TData>({
  queryClient,
  queryKey,
  newItem,
  addFn = (list, item) => [item as unknown as TData, ...list]
}: OptimisticAddOptions<TData, TItem>): TData[] | undefined {
  // Get the previous data
  const previousData = queryClient.getQueryData<TData[]>(queryKey);
  
  // If there's no previous data, don't do anything
  if (!previousData) return undefined;
  
  // Update the query data optimistically
  queryClient.setQueryData<TData[]>(queryKey, old => {
    if (!old) return old;
    return addFn(old, newItem);
  });
  
  // Return the previous data for rollback
  return previousData;
}

/**
 * Optimistically update an item in a list
 * 
 * @param options Options for the optimistic update
 * @returns Previous data for rollback
 */
export function optimisticUpdateItem<TData, TItem = TData>({
  queryClient,
  queryKey,
  id,
  getItemId,
  updates
}: OptimisticUpdateOptions<TData, TItem>): TData[] | undefined {
  // Get the previous data
  const previousData = queryClient.getQueryData<TData[]>(queryKey);
  
  // If there's no previous data, don't do anything
  if (!previousData) return undefined;
  
  // Update the query data optimistically
  queryClient.setQueryData<TData[]>(queryKey, old => {
    if (!old) return old;
    
    return old.map(item => {
      // If this is the item we want to update
      if (getItemId(item) === id) {
        // Merge the updates with the existing item
        return {
          ...item,
          ...updates
        };
      }
      
      // Otherwise, return the item unchanged
      return item;
    });
  });
  
  // Return the previous data for rollback
  return previousData;
}

/**
 * Optimistically remove an item from a list
 * 
 * @param options Options for the optimistic remove
 * @returns Previous data for rollback
 */
export function optimisticRemoveItem<TData>({
  queryClient,
  queryKey,
  id,
  getItemId
}: OptimisticRemoveOptions<TData>): TData[] | undefined {
  // Get the previous data
  const previousData = queryClient.getQueryData<TData[]>(queryKey);
  
  // If there's no previous data, don't do anything
  if (!previousData) return undefined;
  
  // Update the query data optimistically
  queryClient.setQueryData<TData[]>(queryKey, old => {
    if (!old) return old;
    
    // Filter out the item we want to remove
    return old.filter(item => getItemId(item) !== id);
  });
  
  // Return the previous data for rollback
  return previousData;
}

/**
 * Optimistically add an item to an infinite query
 * 
 * @param options Options for the optimistic add
 * @returns Previous data for rollback
 */
export function optimisticAddItemToInfiniteQuery<TData, TItem = TData>({
  queryClient,
  queryKey,
  newItem,
  addFn = (list, item) => [item as unknown as TData, ...list]
}: OptimisticAddOptions<TData, TItem>): InfiniteData<TData[]> | undefined {
  // Get the previous data
  const previousData = queryClient.getQueryData<InfiniteData<TData[]>>(queryKey);
  
  // If there's no previous data, don't do anything
  if (!previousData) return undefined;
  
  // Update the query data optimistically
  queryClient.setQueryData<InfiniteData<TData[]>>(queryKey, old => {
    if (!old) return old;
    
    // Clone the old data structure
    return {
      ...old,
      pages: old.pages.map((page, index) => {
        // Add the new item to the first page
        if (index === 0) {
          return addFn(page, newItem);
        }
        
        // Return other pages unchanged
        return page;
      })
    };
  });
  
  // Return the previous data for rollback
  return previousData;
}

/**
 * Optimistically update an item in an infinite query
 * 
 * @param options Options for the optimistic update
 * @returns Previous data for rollback
 */
export function optimisticUpdateItemInInfiniteQuery<TData, TItem = TData>({
  queryClient,
  queryKey,
  id,
  getItemId,
  updates
}: OptimisticUpdateOptions<TData, TItem>): InfiniteData<TData[]> | undefined {
  // Get the previous data
  const previousData = queryClient.getQueryData<InfiniteData<TData[]>>(queryKey);
  
  // If there's no previous data, don't do anything
  if (!previousData) return undefined;
  
  // Update the query data optimistically
  queryClient.setQueryData<InfiniteData<TData[]>>(queryKey, old => {
    if (!old) return old;
    
    // Clone the old data structure
    return {
      ...old,
      pages: old.pages.map(page => {
        // Update items in this page
        return page.map(item => {
          // If this is the item we want to update
          if (getItemId(item) === id) {
            // Merge the updates with the existing item
            return {
              ...item,
              ...updates
            };
          }
          
          // Otherwise, return the item unchanged
          return item;
        });
      })
    };
  });
  
  // Return the previous data for rollback
  return previousData;
}

/**
 * Optimistically remove an item from an infinite query
 * 
 * @param options Options for the optimistic remove
 * @returns Previous data for rollback
 */
export function optimisticRemoveItemFromInfiniteQuery<TData>({
  queryClient,
  queryKey,
  id,
  getItemId
}: OptimisticRemoveOptions<TData>): InfiniteData<TData[]> | undefined {
  // Get the previous data
  const previousData = queryClient.getQueryData<InfiniteData<TData[]>>(queryKey);
  
  // If there's no previous data, don't do anything
  if (!previousData) return undefined;
  
  // Update the query data optimistically
  queryClient.setQueryData<InfiniteData<TData[]>>(queryKey, old => {
    if (!old) return old;
    
    // Clone the old data structure
    return {
      ...old,
      pages: old.pages.map(page => {
        // Filter out the item we want to remove from this page
        return page.filter(item => getItemId(item) !== id);
      })
    };
  });
  
  // Return the previous data for rollback
  return previousData;
}