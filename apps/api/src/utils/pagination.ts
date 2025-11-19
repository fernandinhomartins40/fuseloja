/**
 * Pagination Utilities
 * Helper functions for pagination
 */

import config from '../config';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function getPaginationParams(page?: string | number, limit?: string | number): PaginationParams {
  const pageNum = Math.max(1, parseInt(String(page || config.pagination.defaultPage), 10));
  const limitNum = Math.min(
    config.pagination.maxLimit,
    Math.max(1, parseInt(String(limit || config.pagination.defaultLimit), 10))
  );

  return {
    page: pageNum,
    limit: limitNum,
    skip: (pageNum - 1) * limitNum,
  };
}

export function calculateTotalPages(total: number, limit: number): number {
  return Math.ceil(total / limit);
}
