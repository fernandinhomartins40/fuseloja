
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface ProductDescriptionFieldProps {
  shortDescription: string;
  fullDescription: string;
  onShortDescriptionChange: (value: string) => void;
  onFullDescriptionChange: (value: string) => void;
}

const ProductDescriptionField: React.FC<ProductDescriptionFieldProps> = ({
  shortDescription,
  fullDescription,
  onShortDescriptionChange,
  onFullDescriptionChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="short-description" className="text-sm font-medium block mb-1">
          Descrição Curta*
        </label>
        <Textarea
          id="short-description"
          value={shortDescription}
          onChange={(e) => onShortDescriptionChange(e.target.value)}
          placeholder="Uma breve descrição do produto (exibida em cards e listagens)"
          className="resize-none h-20"
          maxLength={150}
        />
        <div className="text-xs text-muted-foreground mt-1 text-right">
          {shortDescription.length}/150 caracteres
        </div>
      </div>

      <div>
        <label htmlFor="full-description" className="text-sm font-medium block mb-1">
          Descrição Completa
        </label>
        <Textarea
          id="full-description"
          value={fullDescription}
          onChange={(e) => onFullDescriptionChange(e.target.value)}
          placeholder="Descrição detalhada do produto, incluindo recursos e benefícios"
          className="resize-none h-40"
        />
      </div>
    </div>
  );
};

export default ProductDescriptionField;
