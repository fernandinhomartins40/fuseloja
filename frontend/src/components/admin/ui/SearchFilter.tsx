import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Search, Filter, X, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'checkbox' | 'date' | 'daterange' | 'number' | 'text';
  options?: { value: string; label: string }[];
  placeholder?: string;
  defaultValue?: any;
}

export interface ActiveFilter {
  key: string;
  label: string;
  value: any;
  display: string;
}

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  activeFilters?: ActiveFilter[];
  onFiltersChange?: (filters: ActiveFilter[]) => void;
  onClearFilters?: () => void;
  className?: string;
  showFilterCount?: boolean;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Pesquisar...",
  filters = [],
  activeFilters = [],
  onFiltersChange,
  onClearFilters,
  className,
  showFilterCount = true
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const handleFilterChange = (filterKey: string, value: any, filter: FilterOption) => {
    const newFilterValues = { ...filterValues, [filterKey]: value };
    setFilterValues(newFilterValues);

    if (onFiltersChange) {
      // Remove existing filter for this key
      const updatedFilters = activeFilters.filter(f => f.key !== filterKey);
      
      // Add new filter if value is not empty
      if (value !== null && value !== undefined && value !== '' && 
          (Array.isArray(value) ? value.length > 0 : true)) {
        const displayValue = getDisplayValue(value, filter);
        if (displayValue) {
          updatedFilters.push({
            key: filterKey,
            label: filter.label,
            value,
            display: displayValue
          });
        }
      }
      
      onFiltersChange(updatedFilters);
    }
  };

  const getDisplayValue = (value: any, filter: FilterOption): string => {
    if (value === null || value === undefined || value === '') return '';
    
    switch (filter.type) {
      case 'select':
        const option = filter.options?.find(opt => opt.value === value);
        return option?.label || value;
      
      case 'multiselect':
        if (Array.isArray(value) && value.length > 0) {
          const labels = value.map(v => {
            const option = filter.options?.find(opt => opt.value === v);
            return option?.label || v;
          });
          return labels.length > 2 
            ? `${labels.slice(0, 2).join(', ')} +${labels.length - 2}`
            : labels.join(', ');
        }
        return '';
      
      case 'checkbox':
        return value ? 'Sim' : 'Não';
      
      case 'date':
        return value instanceof Date ? format(value, 'dd/MM/yyyy', { locale: ptBR }) : value;
      
      case 'daterange':
        if (value.from && value.to) {
          return `${format(value.from, 'dd/MM', { locale: ptBR })} - ${format(value.to, 'dd/MM', { locale: ptBR })}`;
        } else if (value.from) {
          return `A partir de ${format(value.from, 'dd/MM/yyyy', { locale: ptBR })}`;
        }
        return '';
      
      case 'number':
        return String(value);
      
      case 'text':
        return String(value);
      
      default:
        return String(value);
    }
  };

  const removeFilter = (filterKey: string) => {
    const updatedFilters = activeFilters.filter(f => f.key !== filterKey);
    setFilterValues(prev => ({ ...prev, [filterKey]: null }));
    onFiltersChange?.(updatedFilters);
  };

  const renderFilterInput = (filter: FilterOption) => {
    const value = filterValues[filter.key] || filter.defaultValue;

    switch (filter.type) {
      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(newValue) => handleFilterChange(filter.key, newValue, filter)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={filter.placeholder || `Selecionar ${filter.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${filter.key}-${option.value}`}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = checked
                      ? [...currentValues, option.value]
                      : currentValues.filter(v => v !== option.value);
                    handleFilterChange(filter.key, newValues, filter);
                  }}
                />
                <Label htmlFor={`${filter.key}-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={filter.key}
              checked={Boolean(value)}
              onCheckedChange={(checked) => handleFilterChange(filter.key, checked, filter)}
            />
            <Label htmlFor={filter.key} className="text-sm">
              {filter.placeholder || filter.label}
            </Label>
          </div>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(value, 'dd/MM/yyyy', { locale: ptBR }) : filter.placeholder || 'Selecionar data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value}
                onSelect={(date) => handleFilterChange(filter.key, date, filter)}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={filter.placeholder || `Digite ${filter.label.toLowerCase()}`}
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value ? Number(e.target.value) : null, filter)}
          />
        );

      case 'text':
        return (
          <Input
            type="text"
            placeholder={filter.placeholder || `Digite ${filter.label.toLowerCase()}`}
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value, filter)}
          />
        );

      default:
        return null;
    }
  };

  const activeFilterCount = activeFilters.length;

  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Filter Button */}
        {filters.length > 0 && (
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 w-full sm:w-auto justify-center relative"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden xs:inline">Filtros</span>
                <ChevronDown className="h-4 w-4" />
                {showFilterCount && activeFilterCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-500 text-white text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Filtros</h3>
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onClearFilters?.();
                        setFilterValues({});
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Limpar todos
                    </Button>
                  )}
                </div>

                {filters.map((filter) => (
                  <div key={filter.key} className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      {filter.label}
                    </Label>
                    {renderFilterInput(filter)}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge
              key={filter.key}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1 text-xs"
            >
              <span className="font-medium">{filter.label}:</span>
              <span>{filter.display}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 hover:bg-transparent"
                onClick={() => removeFilter(filter.key)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {activeFilters.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onClearFilters?.();
                setFilterValues({});
              }}
              className="h-auto px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
            >
              Limpar todos
            </Button>
          )}
        </div>
      )}
    </div>
  );
};