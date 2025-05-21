
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

interface ProductsSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNewProduct: () => void;
}

const ProductsSearchBar: React.FC<ProductsSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onNewProduct
}) => {
  return (
    <div className="flex items-center mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button className="ml-4" onClick={onNewProduct}>
        <Plus className="h-4 w-4 mr-2" />
        Novo Produto
      </Button>
    </div>
  );
};

export default ProductsSearchBar;
