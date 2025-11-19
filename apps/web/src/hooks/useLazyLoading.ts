import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

interface LazyLoadingOptions<T> {
  itemHeight?: number; // altura estimada de cada item
  containerHeight?: number; // altura do container visível
  overscan?: number; // número de itens extras para renderizar
  threshold?: number; // threshold para intersection observer
  searchFields?: (keyof T)[]; // campos para busca
  sortField?: keyof T; // campo padrão para ordenação
  sortDirection?: 'asc' | 'desc';
}

interface LazyLoadingReturn<T> {
  // Dados renderizados
  visibleItems: T[];
  totalItems: number;
  
  // Controles de scroll virtual
  scrollToIndex: (index: number) => void;
  containerProps: {
    style: React.CSSProperties;
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
    ref: React.RefObject<HTMLDivElement>;
  };
  
  // Estados de loading
  isLoading: boolean;
  isSearching: boolean;
  
  // Controles de busca e filtro
  searchValue: string;
  setSearchValue: (value: string) => void;
  filteredData: T[];
  
  // Métricas de performance
  startIndex: number;
  endIndex: number;
  
  // Controles de ordenação
  sortBy: keyof T | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: keyof T) => void;
}

export const useLazyLoading = <T extends Record<string, any>>(
  data: T[],
  options: LazyLoadingOptions<T> = {}
): LazyLoadingReturn<T> => {
  const {
    itemHeight = 80,
    containerHeight = 600,
    overscan = 5,
    threshold = 0.1,
    searchFields = [],
    sortField,
    sortDirection: initialSortDirection = 'desc'
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<keyof T | null>(sortField || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Busca nos dados
  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return data;
    
    const searchTerm = searchValue.toLowerCase();
    return data.filter(item => {
      if (searchFields.length > 0) {
        return searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchTerm);
        });
      }
      
      // Se não especificou campos, busca em todos os campos string
      return Object.values(item).some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm);
        }
        return false;
      });
    });
  }, [data, searchValue, searchFields]);

  // Ordenação dos dados
  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      let comparison = 0;
      
      if (aValue < bValue) comparison = -1;
      else if (aValue > bValue) comparison = 1;
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortBy, sortDirection]);

  // Cálculos de scroll virtual
  const totalHeight = sortedData.length * itemHeight;
  const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    sortedData.length - 1,
    startIndex + visibleItemsCount + overscan * 2
  );

  // Itens visíveis com posicionamento virtual
  const visibleItems = useMemo(() => {
    return sortedData.slice(startIndex, endIndex + 1).map((item, index) => ({
      ...item,
      _virtualIndex: startIndex + index,
      _virtualTop: (startIndex + index) * itemHeight
    }));
  }, [sortedData, startIndex, endIndex, itemHeight]);

  // Handle scroll com debounce
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    setScrollTop(element.scrollTop);
  }, []);

  // Handle search com debounce
  const handleSearchChange = useCallback((value: string) => {
    setIsSearching(true);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearchValue(value);
      setIsSearching(false);
    }, 300);
  }, []);

  // Handle sort
  const handleSort = useCallback((field: keyof T) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  }, [sortBy]);

  // Scroll to index
  const scrollToIndex = useCallback((index: number) => {
    if (containerRef.current) {
      const scrollTop = index * itemHeight;
      containerRef.current.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  }, [itemHeight]);

  // Container props
  const containerProps = useMemo(() => ({
    style: {
      height: containerHeight,
      overflowY: 'auto' as const,
      position: 'relative' as const,
    },
    onScroll: handleScroll,
    ref: containerRef,
  }), [containerHeight, handleScroll]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    visibleItems,
    totalItems: sortedData.length,
    scrollToIndex,
    containerProps,
    isLoading,
    isSearching,
    searchValue,
    setSearchValue: handleSearchChange,
    filteredData: sortedData,
    startIndex,
    endIndex,
    sortBy,
    sortDirection,
    handleSort,
  };
};

// Hook para lazy loading de imagens
export const useImageLazyLoading = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const registerImage = useCallback((src: string, element: HTMLImageElement | null) => {
    if (!element || loadedImages.has(src)) return;

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const src = img.dataset.src;
              if (src) {
                img.src = src;
                img.onload = () => {
                  setLoadedImages(prev => new Set(prev).add(src));
                };
                observerRef.current?.unobserve(img);
              }
            }
          });
        },
        { threshold: 0.1 }
      );
    }

    element.dataset.src = src;
    observerRef.current.observe(element);
  }, [loadedImages]);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return { registerImage, loadedImages };
};