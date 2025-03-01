/**
 * Common response types for the API
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
