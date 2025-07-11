import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Product } from '@/types/product';
import apiClient from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onProductSelect: (product: Product) => void;
}

const fetchAutocompleteResults = async (searchTerm: string): Promise<Product[]> => {
  if (!searchTerm) return [];
  const response = await apiClient.get<{ products: Product[] }>(`/products?search=${searchTerm}&limit=5`);
  return response.data.products;
};

export const SearchBarWithAutocomplete: React.FC<SearchBarProps> = ({ onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const { data: results, isLoading } = useQuery({
    queryKey: ['productSearch', searchTerm],
    queryFn: () => fetchAutocompleteResults(searchTerm),
    enabled: searchTerm.length > 2,
  });

  const handleSelectProduct = (product: Product) => {
    setSearchTerm('');
    onProductSelect(product);
    navigate(`/produto/${product.id}`);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden">
        <Search className="text-gray-400 mx-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="O que você está procurando?"
          className="w-full py-3 pr-4 bg-transparent focus:outline-none"
        />
      </div>
      {isFocused && searchTerm.length > 2 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl overflow-hidden">
          {isLoading && <div className="p-4 text-gray-500">Buscando...</div>}
          {!isLoading && results && results.length > 0 && (
            <ul>
              {results.map((product) => (
                <li
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                >
                  <img src={product.imageUrl} alt={product.title} className="w-10 h-10 object-cover rounded-md mr-3" />
                  <div>
                    <div className="font-medium">{product.title}</div>
                    <div className="text-sm text-gray-500">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {!isLoading && results && results.length === 0 && (
            <div className="p-4 text-gray-500">Nenhum produto encontrado.</div>
          )}
        </div>
      )}
    </div>
  );
};