import React, { useMemo } from 'react';
import { useLazyLoading, useImageLazyLoading } from '@/hooks/useLazyLoading';
import { SearchFilter, FilterOption } from './SearchFilter';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { Button } from '@/components/ui/button';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
import { TableSkeleton } from './TableSkeleton';
import { cn } from '@/lib/utils';

interface ColumnDef<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, item: T) => React.ReactNode;
}

interface VirtualizedTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  itemHeight?: number;
  containerHeight?: number;
  searchFields?: (keyof T)[];
  filterConfig?: FilterOption[];
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
}

export const VirtualizedTable = <T extends Record<string, any>>({
  data,
  columns,
  itemHeight = 80,
  containerHeight = 600,
  searchFields,
  filterConfig = [],
  searchPlaceholder = 'Buscar...',
  onRowClick,
  className,
  emptyMessage = 'Nenhum item encontrado',
  loading = false
}: VirtualizedTableProps<T>) => {
  const { registerImage } = useImageLazyLoading();

  // Search and filter hook
  const {
    searchValue,
    setSearchValue,
    activeFilters,
    setActiveFilters,
    clearFilters,
    filteredData: searchFilteredData
  } = useSearchFilter(data, {
    filterConfig
  });

  // Apply search manually since we need more control
  const searchedData = useMemo(() => {
    if (!searchValue.trim()) return searchFilteredData;
    
    const searchTerm = searchValue.toLowerCase();
    return searchFilteredData.filter(item => {
      if (searchFields && searchFields.length > 0) {
        return searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchTerm);
        });
      }
      
      return Object.values(item).some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm);
        }
        return false;
      });
    });
  }, [searchFilteredData, searchValue, searchFields]);

  // Lazy loading hook
  const {
    visibleItems,
    totalItems,
    containerProps,
    sortBy,
    sortDirection,
    handleSort,
    startIndex,
    endIndex
  } = useLazyLoading(searchedData, {
    itemHeight,
    containerHeight,
    searchFields,
    sortField: columns[0]?.key,
    sortDirection: 'desc'
  });

  const renderCell = (column: ColumnDef<T>, item: T) => {
    const value = item[column.key];
    
    if (column.render) {
      return column.render(value, item);
    }
    
    // Auto-detect image URLs and apply lazy loading
    if (typeof value === 'string' && (value.includes('http') && (value.includes('.jpg') || value.includes('.png') || value.includes('.webp')))) {
      return (
        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            ref={(el) => el && registerImage(value, el)}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      );
    }
    
    // Format price values
    if (typeof value === 'number' && column.key.toString().includes('price')) {
      return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
    
    // Format dates
    if (value instanceof Date || (typeof value === 'string' && String(value).match(/\d{4}-\d{2}-\d{2}/))) {
      const date = value instanceof Date ? value : new Date(String(value));
      return date.toLocaleDateString('pt-BR');
    }
    
    return String(value || '');
  };

  const SortIcon = ({ column }: { column: ColumnDef<T> }) => {
    if (!column.sortable) return null;
    
    const isActive = sortBy === column.key;
    
    return (
      <div className="flex flex-col ml-1">
        <ChevronUpIcon 
          className={cn(
            "h-3 w-3 transition-colors",
            isActive && sortDirection === 'asc' ? 'text-primary' : 'text-gray-400'
          )} 
        />
        <ChevronDownIcon 
          className={cn(
            "h-3 w-3 -mt-1 transition-colors",
            isActive && sortDirection === 'desc' ? 'text-primary' : 'text-gray-400'
          )} 
        />
      </div>
    );
  };

  if (loading) {
    return (
      <TableSkeleton 
        className={className}
        columns={columns.length}
        rows={8}
        showHeader={true}
        showSearch={true}
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filters */}
      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={searchPlaceholder}
        filters={filterConfig}
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
        onClearFilters={clearFilters}
      />

      {/* Results info */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Exibindo {startIndex + 1}-{Math.min(endIndex + 1, totalItems)} de {totalItems} itens
        </span>
        {searchValue && (
          <span>
            Filtrado de {data.length} itens totais
          </span>
        )}
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid gap-4 px-4 py-3" style={{ gridTemplateColumns: columns.map(col => col.width || '1fr').join(' ') }}>
            {columns.map((column) => (
              <div key={String(column.key)} className={cn("flex items-center", {
                'justify-center': column.align === 'center',
                'justify-end': column.align === 'right',
                'justify-start': column.align === 'left' || !column.align
              })}>
                {column.sortable ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort(column.key)}
                    className="h-auto p-0 font-medium hover:bg-transparent flex items-center"
                  >
                    {column.label}
                    <SortIcon column={column} />
                  </Button>
                ) : (
                  <span className="font-medium text-gray-900">{column.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Virtual scrolling container */}
        <div {...containerProps}>
          {totalItems === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              {emptyMessage}
            </div>
          ) : (
            <div style={{ height: totalItems * itemHeight, position: 'relative' }}>
              {visibleItems.map((item: any) => (
                <div
                  key={item.id || item._virtualIndex}
                  className={cn(
                    "absolute left-0 right-0 border-b border-gray-100 hover:bg-gray-50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  style={{ 
                    top: item._virtualTop,
                    height: itemHeight 
                  }}
                  onClick={() => onRowClick?.(item)}
                >
                  <div className="grid gap-4 px-4 py-3 h-full items-center" style={{ gridTemplateColumns: columns.map(col => col.width || '1fr').join(' ') }}>
                    {columns.map((column) => (
                      <div key={String(column.key)} className={cn("truncate", {
                        'text-center': column.align === 'center',
                        'text-right': column.align === 'right',
                        'text-left': column.align === 'left' || !column.align
                      })}>
                        {renderCell(column, item)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};