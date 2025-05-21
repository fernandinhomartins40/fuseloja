
// Define product tag type
export type ProductTag = 'promocao' | 'exclusivo' | 'novo' | 'no-tag';

// Product type definition
export type Product = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  tag?: ProductTag;
};

// Sample product data for initialization
export const initialProducts: Product[] = [
  {
    id: "p001",
    title: "Smartwatch Premium",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&auto=format&fit=crop",
    category: "Eletrônicos",
    stock: 15,
    tag: 'exclusivo',
  },
  {
    id: "p002",
    title: "Caixa de Som Bluetooth Portátil",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1558089966-a11f54853d0b?q=80&auto=format&fit=crop",
    category: "Audio",
    stock: 23,
    tag: 'promocao',
  },
  {
    id: "p003",
    title: "Mouse Sem Fio Ergonômico",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&auto=format&fit=crop",
    category: "Acessórios",
    stock: 42,
  },
  {
    id: "p004",
    title: "Carregador Sem Fio Rápido",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1608569212221-856278461677?q=80&auto=format&fit=crop",
    category: "Acessórios",
    stock: 18,
    tag: 'promocao',
  },
  {
    id: "p005",
    title: "Fone de Ouvido Bluetooth",
    price: 249.99,
    originalPrice: 299.99,
    image: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&auto=format&fit=crop",
    category: "Audio",
    stock: 7,
    tag: 'promocao',
  },
];
