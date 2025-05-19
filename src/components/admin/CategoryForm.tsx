
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Category, CategoryColor, categoryColorsMap } from '@/types/category';
import IconSelector from './IconSelector';
import { cn } from '@/lib/utils';
import { iconComponents, IconName } from '@/utils/categoryIcons';

interface CategoryFormProps {
  initialData: Partial<Category> | null;
  onSubmit: (category: Omit<Category, 'id'>) => void;
  onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}) => {
  const [category, setCategory] = useState<Partial<Category>>(
    initialData || {
      name: '',
      slug: '',
      description: '',
      icon: '',
      color: 'neutral',
    }
  );

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
    
    if (!category.name || !category.slug || !category.icon) {
      return;
    }
    
    onSubmit(category as Omit<Category, 'id'>);
  };

  const availableColors: CategoryColor[] = [
    'neutral',
    'purple',
    'green',
    'yellow',
    'orange',
    'pink',
    'blue',
    'red'
  ];

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
            Cor da Categoria
          </label>
          <div className="grid grid-cols-4 gap-2">
            {availableColors.map((colorName) => {
              const colorData = categoryColorsMap[colorName];
              const isSelected = category.color === colorName;
              
              return (
                <Button
                  key={colorName}
                  type="button"
                  className={cn(
                    "h-10 border border-transparent",
                    isSelected && "border-primary ring-2 ring-primary/20"
                  )}
                  style={{ 
                    backgroundColor: colorData.bg, 
                    color: colorData.text
                  }}
                  onClick={() => handleChange('color', colorName)}
                >
                  {colorName}
                </Button>
              );
            })}
          </div>
        </div>
        
        {/* Preview */}
        {category.name && category.icon && (
          <div className="mt-4 border rounded p-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <div className="flex items-center gap-2">
              {category.icon && (
                <div 
                  className={cn(
                    "p-2 rounded-full",
                    `bg-${category.color}-100`
                  )}
                  style={{ 
                    backgroundColor: categoryColorsMap[category.color as CategoryColor]?.bg 
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
                          color: categoryColorsMap[category.color as CategoryColor]?.text 
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
          disabled={!category.name || !category.slug || !category.icon}
        >
          {initialData ? 'Atualizar Categoria' : 'Adicionar Categoria'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
