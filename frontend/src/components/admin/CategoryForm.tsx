
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
      color: '#E5DEFF', // Default background color
      icon_color: '#FFFFFF', // Default icon color
    };
    return {
      ...defaultCategory,
      ...(initialData || {}),
      // Ensure colors are always strings, even if initialData values are null/undefined
      color: (initialData && initialData.color) ? initialData.color : defaultCategory.color,
      icon_color: (initialData && initialData.icon_color) ? initialData.icon_color : defaultCategory.icon_color,
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
    
    if (!category.name || !category.slug || !category.icon || !category.color || !category.icon_color) {
      return;
    }
    
    // Ensure all required fields are present
    const categoryData = {
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon,
      color: category.color,
      icon_color: category.icon_color,
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
              Selecione uma cor para o fundo da categoria
            </p>
            {/* Debug info */}
            <div className="text-xs text-gray-500 font-mono">
              Cor da categoria: {category.color || 'não definida'}
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">
            Cor do Ícone*
          </label>
          <div className="space-y-2">
            <ColorPicker
              color={category.icon_color || '#FFFFFF'}
              onChange={(color) => handleChange('icon_color', color)}
            />
            <p className="text-xs text-muted-foreground">
              Selecione uma cor para o ícone da categoria
            </p>
            {/* Debug info */}
            <div className="text-xs text-gray-500 font-mono">
              Cor do ícone: {category.icon_color || 'não definida'}
            </div>
          </div>
        </div>
        
        {/* Preview */}
        <div className="mt-4 border rounded-lg p-4 bg-gray-50">
          <p className="text-sm font-medium mb-3">Preview da Categoria:</p>
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
              style={{ 
                backgroundColor: category.color || '#E5DEFF'
              }}
            >
              {category.icon && iconComponents[category.icon as IconName] ? (
                React.createElement(iconComponents[category.icon as IconName], {
                  size: 24,
                  color: category.icon_color || '#FFFFFF',
                  className: "drop-shadow-sm"
                })
              ) : (
                <div className="w-6 h-6 bg-white/50 rounded-full flex items-center justify-center">
                  <span className="text-xs" style={{ color: category.icon_color || '#000000' }}>?</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {category.name || 'Nome da categoria'}
              </h3>
              <p className="text-sm text-gray-500">
                {category.description || 'Descrição da categoria'}
              </p>
              <div className="text-xs text-gray-400 font-mono mt-1">
                Ícone: {category.icon || 'não selecionado'} | Cor fundo: {category.color || 'não definida'} | Cor ícone: {category.icon_color || 'não definida'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={!category.name || !category.slug || !category.icon || !category.color || !category.icon_color}
        >
          {initialData ? 'Atualizar Categoria' : 'Adicionar Categoria'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
