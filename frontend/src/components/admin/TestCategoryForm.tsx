import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import IconSelector from './IconSelector';
import { ColorPicker } from '@/components/admin/settings/ColorPicker';
import { Category } from '@/types/category';

interface TestCategoryFormProps {
  initialData: Partial<Category> | null;
  onSubmit: (category: Omit<Category, 'id'>) => void;
  onCancel: () => void;
}

export const TestCategoryForm: React.FC<TestCategoryFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [category, setCategory] = useState<Partial<Category>>(() => {
    const defaultCategory = {
      name: '',
      slug: '',
      description: '',
      icon: '',
      color: '#E5DEFF', // Default color
    };
    return {
      ...defaultCategory,
      ...(initialData || {}),
      color: (initialData && initialData.color) ? initialData.color : defaultCategory.color,
      icon: (initialData && initialData.icon) ? initialData.icon : defaultCategory.icon,
    };
  });

  const handleChange = (field: keyof Category, value: any) => {
    setCategory(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For testing, we'll just log the data
    console.log('TestCategoryForm submitted:', category);
    onSubmit(category as Omit<Category, 'id'>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div>
        <label htmlFor="icon" className="text-sm font-medium block mb-1">
          Ícone de Teste*
        </label>
        <IconSelector 
          value={category.icon || ''} 
          onChange={(value) => handleChange('icon', value)} 
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">
          Cor de Teste*
        </label>
        <ColorPicker
          color={category.color || '#E5DEFF'}
          onChange={(color) => handleChange('color', color)}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar Teste
        </Button>
        <Button type="submit">
          Enviar Teste
        </Button>
      </div>
    </form>
  );
};
