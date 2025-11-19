/**
 * Category Repository
 * Database operations for Category model
 */

import { Category, Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import prisma from '../lib/prisma';

export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super('category');
  }

  /**
   * Find category by slug
   */
  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true, deletedAt: null },
          take: 10,
        },
      },
    });
  }

  /**
   * Find category by name
   */
  async findByName(name: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { name },
    });
  }

  /**
   * Find active categories
   */
  async findActive(options?: {
    skip?: number;
    take?: number;
  }): Promise<Category[]> {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      ...options,
    });
  }

  /**
   * Count active categories
   */
  async countActive(): Promise<number> {
    return prisma.category.count({
      where: { isActive: true },
    });
  }

  /**
   * Find categories with filters
   */
  async findWithFilters(filters: {
    search?: string;
    isActive?: boolean;
    skip?: number;
    take?: number;
  }): Promise<Category[]> {
    const where: Prisma.CategoryWhereInput = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return prisma.category.findMany({
      where,
      skip: filters.skip,
      take: filters.take,
      orderBy: { sortOrder: 'asc' },
    });
  }

  /**
   * Count categories with filters
   */
  async countWithFilters(filters: {
    search?: string;
    isActive?: boolean;
  }): Promise<number> {
    const where: Prisma.CategoryWhereInput = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return prisma.category.count({ where });
  }

  /**
   * Find category with products
   */
  async findByIdWithProducts(id: string, limit: number = 20): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true, deletedAt: null },
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            images: { take: 1, orderBy: { sortOrder: 'asc' } },
          },
        },
      },
    });
  }

  /**
   * Get categories with product count
   */
  async findWithProductCount(): Promise<Array<Category & { _count: { products: number } }>> {
    return prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
