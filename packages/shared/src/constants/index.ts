/**
 * Shared constants across frontend and backend
 */

/**
 * API Version
 */
export const API_VERSION = 'v1';

/**
 * API Prefix
 */
export const API_PREFIX = `/api/${API_VERSION}`;

/**
 * User Roles
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

/**
 * Order Status
 */
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}

/**
 * Product Tags
 */
export enum ProductTag {
  PROMOCAO = 'promocao',
  EXCLUSIVO = 'exclusivo',
  NOVO = 'novo',
  NOVIDADE = 'novidade',
  ULTIMA_UNIDADE = 'ultima-unidade',
  PRE_VENDA = 'pre-venda',
  NO_TAG = 'no-tag',
}

/**
 * Payment Methods
 */
export enum PaymentMethod {
  WHATSAPP = 'WhatsApp',
  PIX = 'PIX',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
}

/**
 * Shipping Methods
 */
export enum ShippingMethod {
  A_DEFINIR = 'A definir',
  SEDEX = 'SEDEX',
  PAC = 'PAC',
  MOTOBOY = 'Motoboy',
  RETIRADA = 'Retirada',
}

/**
 * Image Upload Limits
 */
export const IMAGE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_WIDTH: 2048,
  MAX_HEIGHT: 2048,
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
} as const;

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/**
 * JWT Configuration
 */
export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
} as const;

/**
 * Rate Limiting
 */
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
} as const;

/**
 * Category Icons (Available Lucide Icons)
 */
export const CATEGORY_ICONS = [
  'Package',
  'ShoppingBag',
  'ShoppingCart',
  'Store',
  'Shirt',
  'Watch',
  'Smartphone',
  'Laptop',
  'Monitor',
  'Keyboard',
  'Mouse',
  'Headphones',
  'Camera',
  'Book',
  'Glasses',
  'Footprints',
  'Home',
  'Sofa',
  'Lamp',
  'Paintbrush',
  'Hammer',
  'Wrench',
  'Coffee',
  'UtensilsCrossed',
  'Wine',
  'Dumbbell',
  'Heart',
  'Star',
  'Gift',
  'Sparkles',
] as const;

export type CategoryIcon = (typeof CATEGORY_ICONS)[number];

/**
 * Brazilian States
 */
export const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

export type BrazilianState = (typeof BRAZILIAN_STATES)[number];
