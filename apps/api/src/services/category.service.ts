/**
 * Category Service
 * Category management business logic
 */

import { Category } from '@prisma/client';
import { CategoryRepository } from '../repositories/category.repository';
import { getPaginationParams } from '../utils/pagination';
import { ConflictError, NotFoundError } from '../utils/errors';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  /**
   * Generate slug from name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Get all categories with pagination
   */
  async getCategories(options?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }): Promise<{
    categories: Category[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, skip } = getPaginationParams(options?.page, options?.limit);

    const filters = {
      search: options?.search,
      isActive: options?.isActive,
      skip,
      take: limit,
    };

    const [categories, total] = await Promise.all([
      this.categoryRepository.findWithFilters(filters),
      this.categoryRepository.countWithFilters(filters),
    ]);

    return {
      categories,
      total,
      page,
      limit,
    };
  }

  /**
   * Get active categories
   */
  async getActiveCategories(): Promise<Category[]> {
    return this.categoryRepository.findActive();
  }

  /**
   * Get categories with product count
   */
  async getCategoriesWithProductCount(): Promise<Array<Category & { _count: { products: number } }>> {
    return this.categoryRepository.findWithProductCount();
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Categoria não encontrada');
    }

    return category;
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) {
      throw new NotFoundError('Categoria não encontrada');
    }

    return category;
  }

  /**
   * Get category with products
   */
  async getCategoryWithProducts(id: string, limit: number = 20): Promise<Category> {
    const category = await this.categoryRepository.findByIdWithProducts(id, limit);
    if (!category) {
      throw new NotFoundError('Categoria não encontrada');
    }

    return category;
  }

  /**
   * Create category
   */
  async createCategory(data: {
    name: string;
    slug?: string;
    description?: string;
    icon?: string;
    color?: string;
    iconColor?: string;
    imageUrl?: string;
    isActive?: boolean;
    sortOrder?: number;
  }): Promise<Category> {
    // Generate slug if not provided
    const slug = data.slug || this.generateSlug(data.name);

    // Check if name already exists
    const existingName = await this.categoryRepository.findByName(data.name);
    if (existingName) {
      throw new ConflictError('Nome da categoria já está em uso');
    }

    // Check if slug already exists
    const existingSlug = await this.categoryRepository.findBySlug(slug);
    if (existingSlug) {
      throw new ConflictError('Slug já está em uso');
    }

    return this.categoryRepository.create({
      name: data.name,
      slug,
      description: data.description,
      icon: data.icon || 'Package',
      color: data.color || '#6B7280',
      iconColor: data.iconColor,
      imageUrl: data.imageUrl,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    });
  }

  /**
   * Update category
   */
  async updateCategory(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      icon?: string;
      color?: string;
      iconColor?: string;
      imageUrl?: string;
      isActive?: boolean;
      sortOrder?: number;
    }
  ): Promise<Category> {
    // Check if category exists
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Categoria não encontrada');
    }

    // Check if name is being changed and already exists
    if (data.name && data.name !== category.name) {
      const existingName = await this.categoryRepository.findByName(data.name);
      if (existingName) {
        throw new ConflictError('Nome da categoria já está em uso');
      }
    }

    // Check if slug is being changed and already exists
    if (data.slug && data.slug !== category.slug) {
      const existingSlug = await this.categoryRepository.findBySlug(data.slug);
      if (existingSlug) {
        throw new ConflictError('Slug já está em uso');
      }
    }

    return this.categoryRepository.update(id, data);
  }

  /**
   * Delete category
   */
  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Categoria não encontrada');
    }

    await this.categoryRepository.delete(id);
  }
}
