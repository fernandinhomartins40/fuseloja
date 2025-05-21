
// Define user address type
export type UserAddress = {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
};

// Define user order type
export type UserOrder = {
  id: string;
  date: Date;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';
  items: {
    id: string;
    productId: string;
    title: string;
    quantity: number;
    price: number;
    image: string;
  }[];
};

// Define user preferences type
export type UserPreferences = {
  newsletter: boolean;
  marketing: boolean;
  notifications: {
    orders: boolean;
    promotions: boolean;
    news: boolean;
  };
};

// User type definition
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  addresses: UserAddress[];
  preferences: UserPreferences;
  orders: UserOrder[];
  createdAt: Date;
  updatedAt: Date;
};

// Sample user data for initialization
export const initialUser: User = {
  id: "u001",
  name: "João Silva",
  email: "joao.silva@example.com",
  avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop",
  phone: "(11) 98765-4321",
  addresses: [
    {
      id: "addr001",
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 101",
      neighborhood: "Jardim Primavera",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      isDefault: true
    }
  ],
  preferences: {
    newsletter: true,
    marketing: false,
    notifications: {
      orders: true,
      promotions: false,
      news: true
    }
  },
  orders: [
    {
      id: "o001",
      date: new Date("2023-12-15"),
      total: 599.99,
      status: "delivered",
      items: [
        {
          id: "oi001",
          productId: "p001",
          title: "Smartwatch Premium",
          quantity: 1,
          price: 599.99,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&auto=format&fit=crop"
        }
      ]
    },
    {
      id: "o002",
      date: new Date("2024-01-20"),
      total: 149.99,
      status: "shipped",
      items: [
        {
          id: "oi002",
          productId: "p002",
          title: "Caixa de Som Bluetooth Portátil",
          quantity: 1,
          price: 149.99,
          image: "https://images.unsplash.com/photo-1558089966-a11f54853d0b?q=80&auto=format&fit=crop"
        }
      ]
    }
  ],
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-05-15")
};
