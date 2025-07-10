import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Product, initialProducts } from '@/types/product';
import { cn } from '@/lib/utils';

interface SearchBarWithAutocompleteProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onProductSelect?: (product: Product) => void;
  className?: string;
}

export const SearchBarWithAutocomplete: React.FC<SearchBarWithAutocompleteProps> = ({
  placeholder = "Buscar produtos...",
  onSearch,
  onProductSelect,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts([]);
      setIsOpen(false);
      return;
    }

    const filtered = initialProducts.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 6); // Limit to 6 results

    setFilteredProducts(filtered);
    setIsOpen(filtered.length > 0);
    setSelectedIndex(-1);
  }, [searchTerm]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleProductSelect(filteredProducts[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = () => {
    onSearch?.(searchTerm);
    setIsOpen(false);
  };

  const handleProductSelect = (product: Product) => {
    setSearchTerm(product.title);
    setIsOpen(false);
    onProductSelect?.(product);
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilteredProducts([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-2xl mx-auto", className)}>
      <div className="relative flex items-center bg-background border border-input rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredProducts.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 text-foreground placeholder:text-muted-foreground bg-transparent border-none outline-none rounded-l-lg"
        />
        
        {searchTerm && (
          <button
            onClick={handleClear}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Limpar busca"
          >
            <X size={18} />
          </button>
        )}
        
        <button
          onClick={handleSearch}
          className="px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-r-lg transition-colors duration-200 flex items-center justify-center"
          aria-label="Buscar"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && filteredProducts.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              onClick={() => handleProductSelect(product)}
              className={cn(
                "flex items-center gap-3 p-3 cursor-pointer transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                selectedIndex === index && "bg-accent text-accent-foreground"
              )}
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {product.title}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {product.category}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-primary">
                  {formatPrice(product.price)}
                </p>
                {product.originalPrice && (
                  <p className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {searchTerm && (
            <div className="border-t border-border p-3">
              <button
                onClick={handleSearch}
                className="w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Ver todos os resultados para "{searchTerm}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};