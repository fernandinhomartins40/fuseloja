
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductTag } from '@/types/product';
import { productTags } from '@/utils/productTags';

interface ProductTagFieldProps {
  value?: ProductTag;
  onChange: (value: ProductTag | undefined) => void;
}

const ProductTagField: React.FC<ProductTagFieldProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="tag" className="text-sm font-medium block mb-1">
        Tag (opcional)
      </label>
      <Select
        value={value || "no-tag"}
        onValueChange={(val) => onChange(val === "no-tag" ? undefined : val as ProductTag)}
      >
        <SelectTrigger id="tag">
          <SelectValue placeholder="Selecione uma tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no-tag">Sem tag</SelectItem>
          {productTags.map((tag) => (
            <SelectItem key={tag.value} value={tag.value}>
              {tag.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductTagField;
