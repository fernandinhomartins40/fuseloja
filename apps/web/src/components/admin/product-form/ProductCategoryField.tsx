
import React, { useEffect, useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@fuseloja/types';
import { iconComponents, IconName } from '@/utils/categoryIcons';
import apiClient from '@/services/api';

interface ProductCategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const ProductCategoryField: React.FC<ProductCategoryFieldProps> = ({ value, onChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<{ categories: any[] }>('/categories');
        const backendCategories = response.data?.categories || [];
        
        // Mapear categorias do backend para o formato do frontend
        const mappedCategories: Category[] = backendCategories.map(cat => ({
          id: cat.id.toString(),
          name: cat.name,
          slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
          description: cat.description || '',
          icon: cat.icon || 'Package',
          color: cat.color || '#6B7280',
          icon_color: cat.icon_color || '#FFFFFF'
        }));
        
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        // Fallback para categorias padrão se a API falhar
        setCategories([
          { id: '1', name: 'Eletrônicos', slug: 'eletronicos', icon: 'Smartphone', color: '#3B82F6', icon_color: '#FFFFFF' },
          { id: '2', name: 'Moda', slug: 'moda', icon: 'Shirt', color: '#EC4899', icon_color: '#FFFFFF' },
          { id: '3', name: 'Casa', slug: 'casa', icon: 'Home', color: '#10B981', icon_color: '#FFFFFF' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
  return (
    <div>
      <label htmlFor="category" className="text-sm font-medium block mb-1">
        Categoria*
      </label>
      <Select
        value={value}
        onValueChange={onChange}
        required
        disabled={isLoading}
      >
        <SelectTrigger id="category" className="flex items-center">
          <SelectValue placeholder={isLoading ? "Carregando categorias..." : "Selecione uma categoria"}>
            {value && (() => {
              const category = categories.find(c => c.id === value);
              if (!category) return value;
              
              const IconComp = category.icon ? iconComponents[category.icon as IconName] : null;
              
              return (
                <div className="flex items-center gap-2">
                  {IconComp && <IconComp className="h-4 w-4" />}
                  <span>{category.name}</span>
                </div>
              );
            })()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {categories.map((category: Category) => {
            const IconComp = category.icon ? iconComponents[category.icon as IconName] : null;
            
            return (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  {IconComp && <IconComp className="h-4 w-4" />}
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductCategoryField;
