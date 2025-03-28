/**
 * Core API types for standardized request and response handling
 */

import { ApiError, ApiResponse } from './apiClient';

/**
 * Pagination parameters for paginated requests
 */
export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

/**
 * Pagination metadata for paginated responses
 */
export interface PaginationMetadata {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Basic interface for entities that have an ID property
 */
export interface Entity {
  id: string | number;
}
