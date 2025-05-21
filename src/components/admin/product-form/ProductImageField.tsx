
import React from 'react';
import { Input } from '@/components/ui/input';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ProductImageFieldProps {
  imageUrl: string;
  onChange: (value: string) => void;
}

const ProductImageField: React.FC<ProductImageFieldProps> = ({ imageUrl, onChange }) => {
  return (
    <div>
      <label htmlFor="image" className="text-sm font-medium block mb-1">
        URL da Imagem*
      </label>
      <Input
        id="image"
        value={imageUrl}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://"
        required
      />
      {imageUrl && (
        <div className="mt-2 border rounded-md overflow-hidden w-24 h-24">
          <AspectRatio ratio={1 / 1}>
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Erro";
              }}
            />
          </AspectRatio>
        </div>
      )}
    </div>
  );
};

export default ProductImageField;
