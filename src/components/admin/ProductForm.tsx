
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product, ProductTag } from '@/types/product';
import ProductImageField from './product-form/ProductImageField';
import ProductPriceFields from './product-form/ProductPriceFields';
import ProductCategoryField from './product-form/ProductCategoryField';
import ProductTagField from './product-form/ProductTagField';

interface ProductFormProps {
  initialData: Product | null;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

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
  
  const handleSaleToggle = (checked: boolean) => {
    setIsOnSale(checked);
    if (!checked) {
      handleChange('originalPrice', undefined);
    } else if (!product.originalPrice) {
      handleChange('originalPrice', product.price * 1.2);
    }
  };

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

        <ProductPriceFields 
          price={product.price}
          stock={product.stock}
          originalPrice={product.originalPrice}
          isOnSale={isOnSale}
          onPriceChange={(value) => handleChange('price', value)}
          onStockChange={(value) => handleChange('stock', value)}
          onOriginalPriceChange={(value) => handleChange('originalPrice', value)}
          onSaleToggle={handleSaleToggle}
        />
        
        <ProductImageField 
          imageUrl={product.image}
          onChange={(value) => handleChange('image', value)}
        />
        
        <ProductCategoryField 
          value={product.category}
          onChange={(value) => handleChange('category', value)}
        />
        
        <ProductTagField 
          value={product.tag}
          onChange={(value) => handleChange('tag', value)}
        />
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
