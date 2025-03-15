/**
 * Common API Types
 * 
 * This module provides common types for API responses, pagination,
 * and other shared data structures used across the application.
 */

/**
 * Base type for API responses with pagination
 */
export interface ApiPaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

/**
 * Base pagination parameters
 */
export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
}

/**
 * Filter parameters for search functionality
 */
export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Combined parameters for paginated, filtered requests
 */
export interface QueryParams extends PaginationParams, FilterParams {}

/**
 * Typing for API error response
 */
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  errorDetails?: Record<string, string[]>;
}

/**
 * Wrapper for standard API success response
 */
export interface ApiSuccessResponse<T> {
  data: T;
  success: true;
  message?: string;
}

/**
 * Wrapper for standard API failure response
 */
export interface ApiFailureResponse {
  success: false;
  message: string;
  error: string;
  status: number;
}

/**
 * Union type for API responses
 */
export type ApiWrappedResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse;

/**
 * Utility function to build URL query strings from objects
 * 
 * @param params Object containing query parameters
 * @returns URL-encoded query string (without the leading '?')
 */
export function buildQueryString(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      // Handle array values
      if (Array.isArray(value)) {
        return value
          .map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
          .join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
}

/**
 * Standard query key factory for common entity types
 */
export const apiQueryKeys = {
  auth: {
    user: () => ['auth', 'user'],
    session: () => ['auth', 'session'],
    login: () => ['auth', 'login'],
    register: () => ['auth', 'register'],
  },
  users: {
    all: () => ['users'],
    list: (filters?: any) => ['users', 'list', filters],
    detail: (id: string | number) => ['users', 'detail', id],
    profile: () => ['users', 'profile'],
    settings: () => ['users', 'settings'],
  },
  exams: {
    all: () => ['exams'],
    list: (filters?: any) => ['exams', 'list', filters],
    detail: (id: string | number) => ['exams', 'detail', id],
    questions: (examId: string | number) => ['exams', 'questions', examId],
    results: (examId: string | number, userId?: string) => 
      userId ? ['exams', examId, 'results', userId] : ['exams', examId, 'results'],
  },
  progress: {
    user: (userId?: string) => ['progress', 'user', userId],
    exam: (examId: string | number) => ['progress', 'exam', examId],
    detail: (userId: string, examId: string) => ['progress', 'detail', userId, examId],
    statistics: (userId?: string) => ['progress', 'statistics', userId],
  },
  dashboard: {
    stats: () => ['dashboard', 'stats'],
    timeline: (period: string) => ['dashboard', 'timeline', period],
    recommendations: () => ['dashboard', 'recommendations'],
  },
};
