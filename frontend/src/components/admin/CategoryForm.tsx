
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Category, getContrastTextColor } from '@/types/category';
import IconSelector from './IconSelector';
import { cn } from '@/lib/utils';
import { iconComponents, IconName } from '@/utils/categoryIcons';
import { ColorPicker } from '@/components/admin/settings/ColorPicker';

interface CategoryFormProps {
  initialData: Partial<Category> | null;
  onSubmit: (category: Omit<Category, 'id'>) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
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
      // Ensure color is always a string, even if initialData.color is null/undefined
      color: (initialData && initialData.color) ? initialData.color : defaultCategory.color,
    };
  });

  const handleChange = (field: keyof Category, value: any) => {
    setCategory(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug when name changes
      if (field === 'name') {
        updated.slug = value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '-');
      }
      
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category.name || !category.slug || !category.icon || !category.color) {
      return;
    }
    
    // Ensure all required fields are present
    const categoryData = {
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon,
      color: category.color,
    };
    
    console.log('Submitting category data:', categoryData);
    onSubmit(categoryData);
  };

  // Get text color based on background color for better contrast
  const textColor = category.color ? getContrastTextColor(category.color) : '#333333';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium block mb-1">
            Nome da Categoria*
          </label>
          <Input
            id="name"
            value={category.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Digite o nome da categoria"
            required
          />
        </div>

        <div>
          <label htmlFor="slug" className="text-sm font-medium block mb-1">
            Slug*
          </label>
          <Input
            id="slug"
            value={category.slug || ''}
            onChange={(e) => handleChange('slug', e.target.value)}
            placeholder="identificador-unico"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Identificador único usado em URLs (gerado automaticamente)
          </p>
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium block mb-1">
            Descrição
          </label>
          <Textarea
            id="description"
            value={category.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Descrição breve da categoria (opcional)"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="icon" className="text-sm font-medium block mb-1">
            Ícone*
          </label>
          <IconSelector 
            value={category.icon || ''} 
            onChange={(value) => handleChange('icon', value)} 
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">
            Cor da Categoria*
          </label>
          <div className="space-y-2">
            <ColorPicker
              color={category.color || '#E5DEFF'}
              onChange={(color) => handleChange('color', color)}
            />
            <p className="text-xs text-muted-foreground">
              Selecione uma cor para identificar visualmente a categoria
            </p>
            {/* Debug info */}
            <div className="text-xs text-gray-500 font-mono">
              Cor atual: {category.color || 'não definida'}
            </div>
          </div>
        </div>
        
        {/* Preview */}
        {category.name && category.icon && category.color && (
          <div className="mt-4 border rounded p-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <div className="flex items-center gap-2">
              {category.icon && (
                <div 
                  className="p-2 rounded-full"
                  style={{ 
                    backgroundColor: category.color 
                  }}
                >
                  {(() => {
                    const IconComp = category.icon ? 
                      iconComponents[category.icon as IconName] : 
                      null;
                    return IconComp ? 
                      <IconComp 
                        className="h-5 w-5" 
                        style={{ 
                          color: textColor
                        }}
                      /> : 
                      null;
                  })()}
                </div>
              )}
              <span className="font-medium">{category.name}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={!category.name || !category.slug || !category.icon || !category.color}
        >
          {initialData ? 'Atualizar Categoria' : 'Adicionar Categoria'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
