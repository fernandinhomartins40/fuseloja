/**
 * Category Controller
 * Category management endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { success, paginated } from '../utils/response';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  /**
   * Get all categories
   * GET /api/v1/categories
   */
  getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, search, isActive } = req.query;

      const result = await this.categoryService.getCategories({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
        isActive: isActive ? isActive === 'true' : undefined,
      });

      paginated(res, result.categories, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get active categories
   * GET /api/v1/categories/active
   */
  getActiveCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.categoryService.getActiveCategories();
      success(res, categories);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get categories with product count
   * GET /api/v1/categories/with-count
   */
  getCategoriesWithCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.categoryService.getCategoriesWithProductCount();
      success(res, categories);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get category by ID
   * GET /api/v1/categories/:id
   */
  getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryById(id);
      success(res, category);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get category by slug
   * GET /api/v1/categories/slug/:slug
   */
  getCategoryBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { slug } = req.params;
      const category = await this.categoryService.getCategoryBySlug(slug);
      success(res, category);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get category with products
   * GET /api/v1/categories/:id/products
   */
  getCategoryWithProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { limit } = req.query;
      const category = await this.categoryService.getCategoryWithProducts(
        id,
        limit ? Number(limit) : undefined
      );
      success(res, category);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create category
   * POST /api/v1/categories
   */
  createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      success(res, category, 'Categoria criada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update category
   * PUT /api/v1/categories/:id
   */
  updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.updateCategory(id, req.body);
      success(res, category, 'Categoria atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete category
   * DELETE /api/v1/categories/:id
   */
  deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.categoryService.deleteCategory(id);
      success(res, null, 'Categoria deletada com sucesso');
    } catch (error) {
      next(error);
    }
  };
}
