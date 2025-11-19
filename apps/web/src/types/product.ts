
// Define product tag type
export type ProductTag = 'promocao' | 'exclusivo' | 'novo' | 'novidade' | 'ultima-unidade' | 'pre-venda' | 'no-tag';

// Product variant type
export type ProductVariant = {
  id: string;
  name: string;
  options: string[];
};

// Product specification type
export type ProductSpecification = {
  name: string;
  value: string;
};

// Product type definition
export type Product = {
  id: string;
  title: string;
  shortDescription?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string; // Renomeado de 'image' e agora obrigatório
  images?: string[];
  category: string;
  stock: number;
  tag?: ProductTag;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  specifications?: ProductSpecification[];
  variants?: ProductVariant[];
  createdAt?: Date;
  updatedAt?: Date;
};

// A lista de produtos mockados será removida, pois os dados virão da API.
