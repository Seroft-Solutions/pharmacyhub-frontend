/**
 * Shared Types
 */

import { LucideIcon } from 'lucide-react';
import { Permission, Role } from '@/features/core/auth/types';

/**
 * MenuItem interface for navigation components
 */
export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  permissions?: Permission[];
  roles?: Role[];
  subItems?: MenuItem[];
  isActive?: boolean;
  isExternal?: boolean;
  requiresAuthentication?: boolean;
  badgeText?: string | number;
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger';
  dividerBefore?: boolean;
  dividerAfter?: boolean;
  onClick?: () => void;
  tooltip?: string;
}

/**
 * Function interfaces
 */
export interface GenericCallback<T = void> {
  (): T;
}

export interface GenericAsyncCallback<T = void> {
  (): Promise<T>;
}

/**
 * Pagination interface for API responses
 */
export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
  hasMore?: boolean;
}

/**
 * Common response formats
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
  pagination?: PaginationParams;
  timestamp?: string;
}

/**
 * Error response format
 */
export interface ApiError {
  message: string;
  code?: string;
  status: number;
  details?: Record<string, any>;
  timestamp?: string;
}

/**
 * Config options for API requests
 */
export interface ApiRequestConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  withCredentials?: boolean;
}

/**
 * Generic filter interface
 */
export interface Filter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in' | 'between';
  value: any;
}

/**
 * Generic sort interface
 */
export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Query parameters interface
 */
export interface QueryParams {
  filters?: Filter[];
  sort?: SortOption[];
  pagination?: Partial<PaginationParams>;
  search?: string;
  includes?: string[];
  fields?: string[];
}
