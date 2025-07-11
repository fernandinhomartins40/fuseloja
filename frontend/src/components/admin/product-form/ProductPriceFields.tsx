
import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface ProductPriceFieldsProps {
  price: number;
  stock: number;
  originalPrice?: number;
  isOnSale: boolean;
  onPriceChange: (value: number) => void;
  onStockChange: (value: number) => void;
  onOriginalPriceChange: (value: number | undefined) => void;
  onSaleToggle: (checked: boolean) => void;
}

const ProductPriceFields: React.FC<ProductPriceFieldsProps> = ({
  price,
  stock,
  originalPrice,
  isOnSale,
  onPriceChange,
  onStockChange,
  onOriginalPriceChange,
  onSaleToggle
}) => {
  return (
    <>
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
            value={price}
            onChange={(e) => onPriceChange(parseFloat(e.target.value))}
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
            value={stock}
            onChange={(e) => onStockChange(parseInt(e.target.value))}
            placeholder="0"
            required
          />
        </div>
      </div>
      
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="is-on-sale" 
          checked={isOnSale} 
          onCheckedChange={(checked) => onSaleToggle(!!checked)}
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
            min={price}
            value={originalPrice || ''}
            onChange={(e) => onOriginalPriceChange(parseFloat(e.target.value))}
            placeholder="Preço antes do desconto"
            required={isOnSale}
          />
        </div>
      )}
    </>
  );
};

export default ProductPriceFields;
