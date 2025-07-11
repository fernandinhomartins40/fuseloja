
import React from 'react';
import { Input } from '@/components/ui/input';

interface ProductInventoryFieldProps {
  sku: string | undefined;
  stock: number;
  onSkuChange: (value: string) => void;
  onStockChange: (value: number) => void;
}

const ProductInventoryField: React.FC<ProductInventoryFieldProps> = ({
  sku,
  stock,
  onSkuChange,
  onStockChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="sku" className="text-sm font-medium block mb-1">
          SKU (Código do Produto)
        </label>
        <Input
          id="sku"
          value={sku || ''}
          onChange={(e) => onSkuChange(e.target.value)}
          placeholder="Ex: PROD-001"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Código único para identificação do produto
        </p>
      </div>

      <div>
        <label htmlFor="stock" className="text-sm font-medium block mb-1">
          Estoque*
        </label>
        <Input
          id="stock"
          type="number"
          min="0"
          value={stock}
          onChange={(e) => onStockChange(parseInt(e.target.value) || 0)}
          placeholder="0"
          required
          className="max-w-[200px]"
        />
      </div>
    </div>
  );
};

export default ProductInventoryField;
