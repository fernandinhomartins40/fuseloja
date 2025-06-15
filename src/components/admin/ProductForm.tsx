
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Product, 
  ProductTag,
  ProductSpecification,
  ProductVariant
} from '@/types/product';
import ProductPriceFields from './product-form/ProductPriceFields';
import ProductCategoryField from './product-form/ProductCategoryField';
import ProductTagField from './product-form/ProductTagField';
import SimpleProductImageUploader from './product-form/SimpleProductImageUploader';
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
      image: '',
      category: '',
      stock: 0,
      images: [],
      specifications: [],
    }
  );
  
  const [isOnSale, setIsOnSale] = useState(!!initialData?.originalPrice);
  const [activeTab, setActiveTab] = useState('basic');
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  
  // Initialize images array with main image if it exists and images is empty
  useEffect(() => {
    if (product.image && (!product.images || product.images.length === 0)) {
      setImages([product.image]);
    }
  }, []);
  
  const handleChange = (field: keyof Product, value: any) => {
    setProduct(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalProduct = {
      ...product,
      images,
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
    handleChange('image', newMainImage);
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
          
          <ProductCategoryField 
            value={product.category}
            onChange={(value) => handleChange('category', value)}
          />
          
          <ProductTagField 
            value={product.tag}
            onChange={(value) => handleChange('tag', value)}
          />
        </TabsContent>
        
        {/* Images Tab */}
        <TabsContent value="images" className="pt-4">
          <SimpleProductImageUploader
            images={images}
            mainImage={product.image}
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
