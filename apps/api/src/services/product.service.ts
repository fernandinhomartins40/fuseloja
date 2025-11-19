/**
 * Product Service
 * Product management business logic
 */

import { Product, Prisma } from '@prisma/client';
import { ProductRepository } from '../repositories/product.repository';
import { getPaginationParams } from '../utils/pagination';
import { ConflictError, NotFoundError, ValidationError } from '../utils/errors';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  /**
   * Generate slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Get all products with pagination and filters
   */
  async getProducts(options?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    tag?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, skip } = getPaginationParams(options?.page, options?.limit);

    const filters = {
      search: options?.search,
      categoryId: options?.categoryId,
      tag: options?.tag,
      isActive: options?.isActive,
      isFeatured: options?.isFeatured,
      minPrice: options?.minPrice,
      maxPrice: options?.maxPrice,
      sortBy: options?.sortBy,
      sortOrder: options?.sortOrder,
      skip,
      take: limit,
    };

    const [products, total] = await Promise.all([
      this.productRepository.findWithFilters(filters),
      this.productRepository.countWithFilters(filters),
    ]);

    return {
      products,
      total,
      page,
      limit,
    };
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findByIdWithRelations(id);
    if (!product || product.deletedAt) {
      throw new NotFoundError('Produto não encontrado');
    }

    // Increment view count
    await this.productRepository.incrementViewCount(id);

    return product;
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findBySlug(slug);
    if (!product || product.deletedAt) {
      throw new NotFoundError('Produto não encontrado');
    }

    // Increment view count
    await this.productRepository.incrementViewCount(product.id);

    return product;
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    return this.productRepository.findFeatured(limit);
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(
    categoryId: string,
    options?: {
      page?: number;
      limit?: number;
    }
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, skip } = getPaginationParams(options?.page, options?.limit);

    const [products, total] = await Promise.all([
      this.productRepository.findByCategory(categoryId, { skip, take: limit }),
      this.productRepository.count({ categoryId, isActive: true, deletedAt: null }),
    ]);

    return {
      products,
      total,
      page,
      limit,
    };
  }

  /**
   * Create product
   */
  async createProduct(data: {
    title: string;
    slug?: string;
    shortDescription?: string;
    description?: string;
    price: number;
    originalPrice?: number;
    costPrice?: number;
    sku?: string;
    barcode?: string;
    stock?: number;
    minStock?: number;
    maxStock?: number;
    weight?: number;
    height?: number;
    width?: number;
    length?: number;
    categoryId?: string;
    tag?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    images?: Array<{
      url: string;
      alt?: string;
      isPrimary?: boolean;
      sortOrder?: number;
    }>;
    specifications?: Array<{
      name: string;
      value: string;
    }>;
    variants?: Array<{
      name: string;
      value: string;
      priceAdjustment?: number;
      stockAdjustment?: number;
      sku?: string;
    }>;
  }): Promise<Product> {
    // Generate slug if not provided
    const slug = data.slug || this.generateSlug(data.title);

    // Check if slug already exists
    const existingSlug = await this.productRepository.findBySlug(slug);
    if (existingSlug) {
      throw new ConflictError('Slug já está em uso');
    }

    // Check if SKU already exists
    if (data.sku) {
      const existingSku = await this.productRepository.findBySku(data.sku);
      if (existingSku) {
        throw new ConflictError('SKU já está em uso');
      }
    }

    // Check if barcode already exists
    if (data.barcode) {
      const existingBarcode = await this.productRepository.findByBarcode(data.barcode);
      if (existingBarcode) {
        throw new ConflictError('Código de barras já está em uso');
      }
    }

    // Prepare product data
    const productData: Prisma.ProductCreateInput = {
      title: data.title,
      slug,
      shortDescription: data.shortDescription,
      description: data.description,
      price: data.price,
      originalPrice: data.originalPrice,
      costPrice: data.costPrice,
      sku: data.sku,
      barcode: data.barcode,
      stock: data.stock ?? 0,
      minStock: data.minStock ?? 0,
      maxStock: data.maxStock,
      weight: data.weight,
      height: data.height,
      width: data.width,
      length: data.length,
      tag: data.tag as any,
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      ...(data.categoryId && {
        category: { connect: { id: data.categoryId } },
      }),
    };

    return this.productRepository.createWithRelations({
      product: productData,
      images: data.images,
      specifications: data.specifications,
      variants: data.variants,
    });
  }

  /**
   * Update product
   */
  async updateProduct(
    id: string,
    data: {
      title?: string;
      slug?: string;
      shortDescription?: string;
      description?: string;
      price?: number;
      originalPrice?: number;
      costPrice?: number;
      sku?: string;
      barcode?: string;
      stock?: number;
      minStock?: number;
      maxStock?: number;
      weight?: number;
      height?: number;
      width?: number;
      length?: number;
      categoryId?: string;
      tag?: string;
      isActive?: boolean;
      isFeatured?: boolean;
      images?: Array<{
        url: string;
        alt?: string;
        isPrimary?: boolean;
        sortOrder?: number;
      }>;
      specifications?: Array<{
        name: string;
        value: string;
      }>;
      variants?: Array<{
        name: string;
        value: string;
        priceAdjustment?: number;
        stockAdjustment?: number;
        sku?: string;
      }>;
    }
  ): Promise<Product> {
    // Check if product exists
    const product = await this.productRepository.findById(id);
    if (!product || product.deletedAt) {
      throw new NotFoundError('Produto não encontrado');
    }

    // Check if slug is being changed and already exists
    if (data.slug && data.slug !== product.slug) {
      const existingSlug = await this.productRepository.findBySlug(data.slug);
      if (existingSlug) {
        throw new ConflictError('Slug já está em uso');
      }
    }

    // Check if SKU is being changed and already exists
    if (data.sku && data.sku !== product.sku) {
      const existingSku = await this.productRepository.findBySku(data.sku);
      if (existingSku) {
        throw new ConflictError('SKU já está em uso');
      }
    }

    // Check if barcode is being changed and already exists
    if (data.barcode && data.barcode !== product.barcode) {
      const existingBarcode = await this.productRepository.findByBarcode(data.barcode);
      if (existingBarcode) {
        throw new ConflictError('Código de barras já está em uso');
      }
    }

    // Prepare update data
    const updateData: Prisma.ProductUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.originalPrice !== undefined) updateData.originalPrice = data.originalPrice;
    if (data.costPrice !== undefined) updateData.costPrice = data.costPrice;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.barcode !== undefined) updateData.barcode = data.barcode;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.minStock !== undefined) updateData.minStock = data.minStock;
    if (data.maxStock !== undefined) updateData.maxStock = data.maxStock;
    if (data.weight !== undefined) updateData.weight = data.weight;
    if (data.height !== undefined) updateData.height = data.height;
    if (data.width !== undefined) updateData.width = data.width;
    if (data.length !== undefined) updateData.length = data.length;
    if (data.tag !== undefined) updateData.tag = data.tag as any;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;

    if (data.categoryId !== undefined) {
      updateData.category = data.categoryId
        ? { connect: { id: data.categoryId } }
        : { disconnect: true };
    }

    return this.productRepository.updateWithRelations(id, {
      product: updateData,
      images: data.images,
      specifications: data.specifications,
      variants: data.variants,
    });
  }

  /**
   * Delete product (soft delete)
   */
  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product || product.deletedAt) {
      throw new NotFoundError('Produto não encontrado');
    }

    await this.productRepository.softDelete(id);
  }

  /**
   * Update product stock
   */
  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product || product.deletedAt) {
      throw new NotFoundError('Produto não encontrado');
    }

    const newStock = product.stock + quantity;
    if (newStock < 0) {
      throw new ValidationError('Estoque insuficiente');
    }

    return this.productRepository.updateStock(id, quantity);
  }
}
