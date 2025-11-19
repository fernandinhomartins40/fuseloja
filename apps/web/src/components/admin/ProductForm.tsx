
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Product, 
  ProductTag,
  ProductSpecification,
  ProductVariant
} from '@fuseloja/types';
import ProductPriceFields from './product-form/ProductPriceFields';
import ProductCategoryField from './product-form/ProductCategoryField';
import ProductTagField from './product-form/ProductTagField';
import { UnifiedProductImageUploader } from './product-form/UnifiedProductImageUploader';
import ProductDescriptionField from './product-form/ProductDescriptionField';
import ProductSpecificationsField from './product-form/ProductSpecificationsField';
import ProductInventoryField from './product-form/ProductInventoryField';

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
      imageUrl: '',
      category: '', // Agora será category_id
      stock: 0,
      images: [],
      specifications: [],
    }
  );
  
  const [isOnSale, setIsOnSale] = useState(!!initialData?.originalPrice);
  const [activeTab, setActiveTab] = useState('basic');
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Initialize images array with main image if it exists and images is empty
  useEffect(() => {
    if (product.imageUrl && (!product.images || product.images.length === 0)) {
      setImages([product.imageUrl]);
    }
  }, []);
  
  const handleChange = (field: keyof Product, value: any) => {
    setProduct(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!product.title?.trim()) {
      errors.title = 'Nome do produto é obrigatório';
    }
    
    if (!product.price || product.price <= 0) {
      errors.price = 'Preço deve ser maior que zero';
    }
    
    if (product.stock < 0) {
      errors.stock = 'Estoque não pode ser negativo';
    }
    
    if (!product.category) {
      errors.category = 'Categoria é obrigatória';
    }
    
    if (isOnSale && (!product.originalPrice || product.originalPrice <= product.price)) {
      errors.originalPrice = 'Preço original deve ser maior que o preço promocional';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const finalProduct = {
      ...product,
      images,
      title: product.title.trim(),
      shortDescription: product.shortDescription?.trim(),
      description: product.description?.trim(),
    };
    
    if (!isOnSale) {
      // Remove originalPrice if not on sale
      const { originalPrice, ...rest } = finalProduct;
      onSubmit(rest);
    } else {
      onSubmit(finalProduct);
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

  // Update main image and images array
  const handleMainImageChange = (newMainImage: string) => {
    handleChange('imageUrl', newMainImage);
  };
  
  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="images">Imagens</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="inventory">Estoque</TabsTrigger>
        </TabsList>
        
        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-4 pt-4">
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
              className={validationErrors.title ? 'border-red-500' : ''}
            />
            {validationErrors.title && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
            )}
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
            errors={{
              price: validationErrors.price,
              stock: validationErrors.stock,
              originalPrice: validationErrors.originalPrice
            }}
          />
          
          <div>
            <ProductCategoryField 
              value={product.category}
              onChange={(value) => handleChange('category', value)}
            />
            {validationErrors.category && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>
            )}
          </div>
          
          <ProductTagField 
            value={product.tag}
            onChange={(value) => handleChange('tag', value)}
          />
        </TabsContent>
        
        {/* Images Tab */}
        <TabsContent value="images" className="pt-4">
          <UnifiedProductImageUploader
            images={images}
            mainImage={product.imageUrl}
            onImagesChange={handleImagesChange}
            onMainImageChange={handleMainImageChange}
          />
        </TabsContent>
        
        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6 pt-4">
          <ProductDescriptionField 
            shortDescription={product.shortDescription || ''}
            fullDescription={product.description || ''}
            onShortDescriptionChange={(value) => handleChange('shortDescription', value)}
            onFullDescriptionChange={(value) => handleChange('description', value)}
          />
          
          <ProductSpecificationsField
            dimensions={product.dimensions}
            weight={product.weight}
            specifications={product.specifications || []}
            onDimensionsChange={(value) => handleChange('dimensions', value)}
            onWeightChange={(value) => handleChange('weight', value)}
            onSpecificationsChange={(value) => handleChange('specifications', value)}
          />
        </TabsContent>
        
        {/* Inventory Tab */}
        <TabsContent value="inventory" className="pt-4">
          <ProductInventoryField 
            sku={product.sku}
            stock={product.stock}
            onSkuChange={(value) => handleChange('sku', value)}
            onStockChange={(value) => handleChange('stock', value)}
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
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
