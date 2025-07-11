
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
  image: string;
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

// Sample product data for initialization
export const initialProducts: Product[] = [
  {
    id: "p001",
    title: "Smartwatch Premium",
    shortDescription: "Smartwatch com monitoramento de saúde e notificações",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&auto=format&fit=crop",
    category: "Eletrônicos",
    stock: 15,
    tag: 'exclusivo',
    sku: 'SW-PREM-001',
  },
  {
    id: "p002",
    title: "Caixa de Som Bluetooth Portátil",
    shortDescription: "Som potente e bateria de longa duração",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1558089966-a11f54853d0b?q=80&auto=format&fit=crop",
    category: "Audio",
    stock: 23,
    tag: 'promocao',
    sku: 'BT-SPKR-002',
  },
  {
    id: "p003",
    title: "Mouse Sem Fio Ergonômico",
    shortDescription: "Design ergonômico para uso prolongado",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&auto=format&fit=crop",
    category: "Acessórios",
    stock: 42,
    sku: 'MS-ERG-003',
  },
  {
    id: "p004",
    title: "Carregador Sem Fio Rápido",
    shortDescription: "Carregamento sem fio de alta velocidade",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1608569212221-856278461677?q=80&auto=format&fit=crop",
    category: "Acessórios",
    stock: 18,
    tag: 'promocao',
    sku: 'CHRG-WL-004',
  },
  {
    id: "p005",
    title: "Fone de Ouvido Bluetooth",
    shortDescription: "Qualidade de áudio superior com cancelamento de ruído",
    price: 249.99,
    originalPrice: 299.99,
    image: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&auto=format&fit=crop",
    category: "Audio",
    stock: 7,
    tag: 'promocao',
    sku: 'HP-BT-005',
  },
];
