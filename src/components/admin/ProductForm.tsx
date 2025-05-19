
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '@/pages/admin/Products';
import { defaultCategories } from '@/utils/categoryIcons';
import { iconComponents, IconName } from '@/utils/categoryIcons';
import { Category } from '@/types/category';

interface ProductFormProps {
  initialData: Product | null;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

// Sample tags
const tags = [
  { name: 'Promoção', value: 'promocao' },
  { name: 'Exclusivo', value: 'exclusivo' },
  { name: 'Novo', value: 'novo' },
];

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [product, setProduct] = useState<Product>(
    initialData || {
      id: '',
      title: '',
      price: 0,
      image: '',
      category: '',
      stock: 0,
    }
  );
  
  const [isOnSale, setIsOnSale] = useState(!!initialData?.originalPrice);
  
  const handleChange = (field: keyof Product, value: any) => {
    setProduct(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOnSale) {
      // Remove originalPrice if not on sale
      const { originalPrice, ...rest } = product;
      onSubmit(rest);
    } else {
      onSubmit(product);
    }
  };

  const categories = defaultCategories;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium block mb-1">
            Nome do Produto*
          </label>
          <Input
            id="title"
            value={product.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Digite o nome do produto"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="text-sm font-medium block mb-1">
              Preço*
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={product.price}
              onChange={(e) => handleChange('price', parseFloat(e.target.value))}
              placeholder="0,00"
              required
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="stock" className="text-sm font-medium block mb-1">
              Estoque*
            </label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={product.stock}
              onChange={(e) => handleChange('stock', parseInt(e.target.value))}
              placeholder="0"
              required
            />
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="is-on-sale" 
            checked={isOnSale} 
            onCheckedChange={(checked) => {
              setIsOnSale(!!checked);
              if (!checked) {
                handleChange('originalPrice', undefined);
              } else if (!product.originalPrice) {
                handleChange('originalPrice', product.price * 1.2);
              }
            }}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="is-on-sale"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Este produto está em promoção
            </label>
            <p className="text-sm text-muted-foreground">
              Marque esta opção para definir um preço original e um preço promocional.
            </p>
          </div>
        </div>
        
        {isOnSale && (
          <div>
            <label htmlFor="original-price" className="text-sm font-medium block mb-1">
              Preço Original
            </label>
            <Input
              id="original-price"
              type="number"
              step="0.01"
              min={product.price}
              value={product.originalPrice || ''}
              onChange={(e) => handleChange('originalPrice', parseFloat(e.target.value))}
              placeholder="Preço antes do desconto"
              required={isOnSale}
            />
          </div>
        )}
        
        <div>
          <label htmlFor="image" className="text-sm font-medium block mb-1">
            URL da Imagem*
          </label>
          <Input
            id="image"
            value={product.image}
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="https://"
            required
          />
          {product.image && (
            <div className="mt-2 border rounded-md p-2 w-24 h-24 overflow-hidden">
              <img 
                src={product.image} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Erro";
                }}
              />
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="category" className="text-sm font-medium block mb-1">
            Categoria*
          </label>
          <Select
            value={product.category}
            onValueChange={(value) => handleChange('category', value)}
            required
          >
            <SelectTrigger id="category" className="flex items-center">
              <SelectValue placeholder="Selecione uma categoria">
                {product.category && (() => {
                  const category = categories.find(c => c.slug === product.category);
                  if (!category) return product.category;
                  
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
        
        <div>
          <label htmlFor="tag" className="text-sm font-medium block mb-1">
            Tag (opcional)
          </label>
          <Select
            value={product.tag}
            onValueChange={(value) => handleChange('tag', value)}
          >
            <SelectTrigger id="tag">
              <SelectValue placeholder="Selecione uma tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Sem tag</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.value} value={tag.value}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? 'Atualizar Produto' : 'Adicionar Produto'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
