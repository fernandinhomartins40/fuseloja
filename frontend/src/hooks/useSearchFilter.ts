import { useState, useMemo, useCallback } from 'react';
import { ActiveFilter, FilterOption } from '@/components/admin/ui/SearchFilter';

interface UseSearchFilterOptions {
  initialSearch?: string;
  filterConfig?: FilterOption[];
  onSearch?: (searchTerm: string, filteredData: any[]) => void;
  onFilter?: (activeFilters: ActiveFilter[], filteredData: any[]) => void;
}

interface UseSearchFilterReturn {
  searchValue: string;
  setSearchValue: (value: string) => void;
  activeFilters: ActiveFilter[];
  setActiveFilters: (filters: ActiveFilter[]) => void;
  clearFilters: () => void;
  filterData: <T>(data: T[]) => T[];
  filteredData: any[];
  setData: (data: any[]) => void;
  filterConfig: FilterOption[];
}

export const useSearchFilter = (
  data: any[] = [],
  options: UseSearchFilterOptions = {}
): UseSearchFilterReturn => {
  const {
    initialSearch = '',
    filterConfig = [],
    onSearch,
    onFilter
  } = options;

  const [searchValue, setSearchValue] = useState(initialSearch);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [currentData, setCurrentData] = useState(data);

  const filterData = useCallback(<T extends Record<string, any>>(dataToFilter: T[]): T[] => {
    let filtered = [...dataToFilter];

    // Apply search filter
    if (searchValue.trim()) {
      const searchTerm = searchValue.toLowerCase().trim();
      filtered = filtered.filter(item => {
        // Search in all string fields of the object
        return Object.values(item).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchTerm);
          }
          if (typeof value === 'number') {
            return value.toString().includes(searchTerm);
          }
          return false;
        });
      });
    }

    // Apply active filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter(item => {
        return activeFilters.every(filter => {
          const itemValue = item[filter.key];
          
          switch (getFilterType(filter.key)) {
            case 'select':
              return itemValue === filter.value;
            
            case 'multiselect':
              if (Array.isArray(filter.value)) {
                return filter.value.includes(itemValue);
              }
              return itemValue === filter.value;
            
            case 'checkbox':
              return Boolean(itemValue) === Boolean(filter.value);
            
            case 'date':
              if (filter.value instanceof Date && itemValue instanceof Date) {
                return itemValue.toDateString() === filter.value.toDateString();
              }
              return itemValue === filter.value;
            
            case 'daterange':
              if (itemValue instanceof Date) {
                const { from, to } = filter.value;
                if (from && to) {
                  return itemValue >= from && itemValue <= to;
                } else if (from) {
                  return itemValue >= from;
                } else if (to) {
                  return itemValue <= to;
                }
              }
              return false;
            
            case 'number':
              if (typeof itemValue === 'number' && typeof filter.value === 'number') {
                return itemValue === filter.value;
              }
              return false;
            
            case 'text':
              if (typeof itemValue === 'string' && typeof filter.value === 'string') {
                return itemValue.toLowerCase().includes(filter.value.toLowerCase());
              }
              return false;
            
            default:
              return itemValue === filter.value;
          }
        });
      });
    }

    return filtered;
  }, [searchValue, activeFilters]);

  const getFilterType = useCallback((filterKey: string): string => {
    const filter = filterConfig.find(f => f.key === filterKey);
    return filter?.type || 'text';
  }, [filterConfig]);

  const filteredData = useMemo(() => {
    const result = filterData(currentData);
    
    // Call callbacks if provided
    if (onSearch && searchValue !== initialSearch) {
      onSearch(searchValue, result);
    }
    
    if (onFilter && activeFilters.length > 0) {
      onFilter(activeFilters, result);
    }
    
    return result;
  }, [currentData, searchValue, activeFilters, filterData, onSearch, onFilter, initialSearch]);

  const clearFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);

  const handleSetSearchValue = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleSetActiveFilters = useCallback((filters: ActiveFilter[]) => {
    setActiveFilters(filters);
  }, []);

  const setData = useCallback((newData: any[]) => {
    setCurrentData(newData);
  }, []);

  return {
    searchValue,
    setSearchValue: handleSetSearchValue,
    activeFilters,
    setActiveFilters: handleSetActiveFilters,
    clearFilters,
    filterData,
    filteredData,
    setData,
    filterConfig
  };
};