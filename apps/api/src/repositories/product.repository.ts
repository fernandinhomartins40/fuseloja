/**
 * Product Repository
 * Database operations for Product model
 */

import { Product, Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import prisma from '../lib/prisma';

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super('product');
  }

  /**
   * Product include relations
   */
  private readonly defaultInclude = {
    category: true,
    images: {
      orderBy: { sortOrder: 'asc' as const },
    },
    specifications: true,
    variants: true,
  };

  /**
   * Find product by slug
   */
  async findBySlug(slug: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { slug },
      include: this.defaultInclude,
    });
  }

  /**
   * Find product by SKU
   */
  async findBySku(sku: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { sku },
      include: this.defaultInclude,
    });
  }

  /**
   * Find product by barcode
   */
  async findByBarcode(barcode: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { barcode },
      include: this.defaultInclude,
    });
  }

  /**
   * Find products with filters and pagination
   */
  async findWithFilters(filters: {
    search?: string;
    categoryId?: string;
    tag?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Product[]> {
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
    };

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.tag) {
      where.tag = filters.tag as any;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (filters.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    return prisma.product.findMany({
      where,
      include: this.defaultInclude,
      skip: filters.skip,
      take: filters.take,
      orderBy,
    });
  }

  /**
   * Count products with filters
   */
  async countWithFilters(filters: {
    search?: string;
    categoryId?: string;
    tag?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<number> {
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
    };

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.tag) {
      where.tag = filters.tag as any;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    return prisma.product.count({ where });
  }

  /**
   * Find featured products
   */
  async findFeatured(limit: number = 10): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true,
        deletedAt: null,
      },
      include: this.defaultInclude,
      take: limit,
      orderBy: { salesCount: 'desc' },
    });
  }

  /**
   * Find products by category
   */
  async findByCategory(categoryId: string, options?: {
    skip?: number;
    take?: number;
  }): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
        deletedAt: null,
      },
      include: this.defaultInclude,
      ...options,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: string): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
    });
  }

  /**
   * Increment sales count
   */
  async incrementSalesCount(id: string, quantity: number = 1): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        salesCount: { increment: quantity },
      },
    });
  }

  /**
   * Update stock
   */
  async updateStock(id: string, quantity: number): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        stock: { increment: quantity },
      },
    });
  }

  /**
   * Create product with relations
   */
  async createWithRelations(data: {
    product: Prisma.ProductCreateInput;
    images?: Array<Omit<Prisma.ProductImageCreateWithoutProductInput, 'product'>>;
    specifications?: Array<Omit<Prisma.ProductSpecificationCreateWithoutProductInput, 'product'>>;
    variants?: Array<Omit<Prisma.ProductVariantCreateWithoutProductInput, 'product'>>;
  }): Promise<Product> {
    return prisma.product.create({
      data: {
        ...data.product,
        ...(data.images && {
          images: { create: data.images },
        }),
        ...(data.specifications && {
          specifications: { create: data.specifications },
        }),
        ...(data.variants && {
          variants: { create: data.variants },
        }),
      },
      include: this.defaultInclude,
    });
  }

  /**
   * Update product with relations
   */
  async updateWithRelations(
    id: string,
    data: {
      product?: Prisma.ProductUpdateInput;
      images?: Array<Prisma.ProductImageCreateWithoutProductInput>;
      specifications?: Array<Prisma.ProductSpecificationCreateWithoutProductInput>;
      variants?: Array<Prisma.ProductVariantCreateWithoutProductInput>;
    }
  ): Promise<Product> {
    // Delete existing relations if new ones are provided
    if (data.images) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
    }
    if (data.specifications) {
      await prisma.productSpecification.deleteMany({ where: { productId: id } });
    }
    if (data.variants) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
    }

    return prisma.product.update({
      where: { id },
      data: {
        ...data.product,
        ...(data.images && {
          images: { create: data.images },
        }),
        ...(data.specifications && {
          specifications: { create: data.specifications },
        }),
        ...(data.variants && {
          variants: { create: data.variants },
        }),
      },
      include: this.defaultInclude,
    });
  }

  /**
   * Find by ID with relations
   */
  async findByIdWithRelations(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
  }
}
