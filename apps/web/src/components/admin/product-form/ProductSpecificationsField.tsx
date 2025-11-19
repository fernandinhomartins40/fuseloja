
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { ProductSpecification } from '@fuseloja/types';

interface ProductSpecificationsFieldProps {
  dimensions: {
    length: number;
    width: number;
    height: number;
  } | undefined;
  weight: number | undefined;
  specifications: ProductSpecification[];
  onDimensionsChange: (dimensions: { length: number; width: number; height: number; } | undefined) => void;
  onWeightChange: (weight: number | undefined) => void;
  onSpecificationsChange: (specifications: ProductSpecification[]) => void;
}

const ProductSpecificationsField: React.FC<ProductSpecificationsFieldProps> = ({
  dimensions,
  weight,
  specifications,
  onDimensionsChange,
  onWeightChange,
  onSpecificationsChange
}) => {
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // Handle dimension changes
  const handleDimensionChange = (field: 'length' | 'width' | 'height', value: string) => {
    const numValue = parseFloat(value);
    const newDimensions = {
      length: dimensions?.length || 0,
      width: dimensions?.width || 0,
      height: dimensions?.height || 0,
      [field]: isNaN(numValue) ? 0 : numValue
    };
    
    // Check if all dimensions are 0, then set to undefined
    if (newDimensions.length === 0 && newDimensions.width === 0 && newDimensions.height === 0) {
      onDimensionsChange(undefined);
    } else {
      onDimensionsChange(newDimensions);
    }
  };

  // Handle weight change
  const handleWeightChange = (value: string) => {
    const numValue = parseFloat(value);
    onWeightChange(isNaN(numValue) ? undefined : numValue);
  };

  // Add new specification
  const addSpecification = () => {
    if (newSpecName.trim() && newSpecValue.trim()) {
      onSpecificationsChange([
        ...specifications,
        { name: newSpecName.trim(), value: newSpecValue.trim() }
      ]);
      setNewSpecName('');
      setNewSpecValue('');
    }
  };

  // Remove specification
  const removeSpecification = (index: number) => {
    const newSpecs = [...specifications];
    newSpecs.splice(index, 1);
    onSpecificationsChange(newSpecs);
  };

  return (
    <div className="space-y-6">
      {/* Dimensions */}
      <div>
        <h3 className="text-sm font-medium mb-2">Dimensões do Produto (cm)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="length" className="text-xs text-muted-foreground block mb-1">
              Comprimento
            </label>
            <Input
              id="length"
              type="number"
              min="0"
              step="0.1"
              value={dimensions?.length || ''}
              onChange={(e) => handleDimensionChange('length', e.target.value)}
              placeholder="0.0"
            />
          </div>
          <div>
            <label htmlFor="width" className="text-xs text-muted-foreground block mb-1">
              Largura
            </label>
            <Input
              id="width"
              type="number"
              min="0"
              step="0.1"
              value={dimensions?.width || ''}
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              placeholder="0.0"
            />
          </div>
          <div>
            <label htmlFor="height" className="text-xs text-muted-foreground block mb-1">
              Altura
            </label>
            <Input
              id="height"
              type="number"
              min="0"
              step="0.1"
              value={dimensions?.height || ''}
              onChange={(e) => handleDimensionChange('height', e.target.value)}
              placeholder="0.0"
            />
          </div>
        </div>
      </div>

      {/* Weight */}
      <div>
        <h3 className="text-sm font-medium mb-2">Peso (kg)</h3>
        <Input
          id="weight"
          type="number"
          min="0"
          step="0.01"
          value={weight || ''}
          onChange={(e) => handleWeightChange(e.target.value)}
          placeholder="0.0"
          className="max-w-[200px]"
        />
      </div>

      {/* Specifications */}
      <div>
        <h3 className="text-sm font-medium mb-2">Especificações Técnicas</h3>
        
        {/* Add new specification */}
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-4">
          <Input
            value={newSpecName}
            onChange={(e) => setNewSpecName(e.target.value)}
            placeholder="Nome (ex: Material)"
          />
          <Input
            value={newSpecValue}
            onChange={(e) => setNewSpecValue(e.target.value)}
            placeholder="Valor (ex: Alumínio)"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={addSpecification}
            disabled={!newSpecName.trim() || !newSpecValue.trim()}
          >
            <Plus size={16} />
          </Button>
        </div>
        
        {/* Specifications list */}
        {specifications.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-xs font-medium text-left p-2 pl-3">Especificação</th>
                  <th className="text-xs font-medium text-left p-2">Valor</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {specifications.map((spec, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2 pl-3 text-sm">{spec.name}</td>
                    <td className="p-2 text-sm">{spec.value}</td>
                    <td className="p-2 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeSpecification(index)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Nenhuma especificação adicionada
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductSpecificationsField;
