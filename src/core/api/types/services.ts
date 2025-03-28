/**
 * API Service Types
 * 
 * This module provides TypeScript types for API services
 */
import { ApiResponse, RequestOptions } from '../core/apiClient';

/**
 * Interface for standard API service methods
 */
export interface ApiService<T> {
  getAll: (options?: RequestOptions) => Promise<ApiResponse<T[]>>;
  getById: (id: string | number, options?: RequestOptions) => Promise<ApiResponse<T>>;
  create: (data: Partial<T>, options?: RequestOptions) => Promise<ApiResponse<T>>;
  update: (id: string | number, data: Partial<T>, options?: RequestOptions) => Promise<ApiResponse<T>>;
  patch: (id: string | number, data: Partial<T>, options?: RequestOptions) => Promise<ApiResponse<T>>;
  remove: (id: string | number, options?: RequestOptions) => Promise<ApiResponse<void>>;
}
