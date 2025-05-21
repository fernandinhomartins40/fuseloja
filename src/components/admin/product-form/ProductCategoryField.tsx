
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@/types/category';
import { defaultCategories } from '@/utils/categoryIcons';
import { iconComponents, IconName } from '@/utils/categoryIcons';

interface ProductCategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const ProductCategoryField: React.FC<ProductCategoryFieldProps> = ({ value, onChange }) => {
  const categories = defaultCategories;
  
  return (
    <div>
      <label htmlFor="category" className="text-sm font-medium block mb-1">
        Categoria*
      </label>
      <Select
        value={value}
        onValueChange={onChange}
        required
      >
        <SelectTrigger id="category" className="flex items-center">
          <SelectValue placeholder="Selecione uma categoria">
            {value && (() => {
              const category = categories.find(c => c.slug === value);
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
              <SelectItem key={category.slug} value={category.slug}>
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
