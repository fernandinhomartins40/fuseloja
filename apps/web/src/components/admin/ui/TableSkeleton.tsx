import React from 'react';
import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
  showHeader?: boolean;
  showSearch?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 8,
  columns = 6,
  className,
  showHeader = true,
  showSearch = true
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Search skeleton */}
      {showSearch && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 h-10 bg-gray-200 rounded-md animate-pulse" />
          <div className="w-full sm:w-auto h-10 bg-gray-200 rounded-md animate-pulse" />
        </div>
      )}

      {/* Table skeleton */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {/* Header skeleton */}
        {showHeader && (
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid gap-4 px-4 py-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* Rows skeleton */}
        <div className="space-y-0">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="border-b border-gray-100 last:border-b-0">
              <div className="grid gap-4 px-4 py-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div key={colIndex} className="flex items-center">
                    {/* Vary the skeleton content based on column */}
                    {colIndex === 0 && (
                      // First column - image + text
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-12 h-12 bg-gray-200 rounded-md animate-pulse flex-shrink-0" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
                      </div>
                    )}
                    {colIndex === 1 && (
                      // Second column - text
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    )}
                    {colIndex === 2 && (
                      // Third column - shorter text
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                    )}
                    {colIndex === 3 && (
                      // Fourth column - badge-like
                      <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
                    )}
                    {colIndex === 4 && (
                      // Fifth column - status badge
                      <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
                    )}
                    {colIndex === 5 && (
                      // Last column - button
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-20 ml-auto" />
                    )}
                    {colIndex > 5 && (
                      // Additional columns - generic
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
};

// Compact version for smaller spaces
export const CompactTableSkeleton: React.FC<Omit<TableSkeletonProps, 'showHeader' | 'showSearch'>> = ({
  rows = 5,
  columns = 4,
  className
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
        </div>
      ))}
    </div>
  );
};

// Grid skeleton for card layouts
export const GridSkeleton: React.FC<{
  items?: number;
  columns?: number;
  className?: string;
}> = ({
  items = 12,
  columns = 4,
  className
}) => {
  return (
    <div className={cn(
      "grid gap-6",
      {
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4': columns === 4,
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': columns === 3,
        'grid-cols-1 sm:grid-cols-2': columns === 2,
        'grid-cols-1': columns === 1
      },
      className
    )}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="aspect-square bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};