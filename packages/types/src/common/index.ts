/**
 * Common utility types used across the application
 */

/**
 * Pagination parameters for API requests
 */
export type PaginationParams = {
  page?: number;
  limit?: number;
  cursor?: string;
};

/**
 * Pagination metadata for API responses
 */
export type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  nextCursor?: string;
};

/**
 * Base response type for all paginated API responses
 */
export type PaginatedResponse<T> = {
  data: T[];
  pagination: PaginationMeta;
};
