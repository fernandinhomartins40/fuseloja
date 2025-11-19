/**
 * Product Controller
 * Product management endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { success, paginated } from '../utils/response';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * Get all products
   * GET /api/v1/products
   */
  getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        page,
        limit,
        search,
        categoryId,
        tag,
        isActive,
        isFeatured,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
      } = req.query;

      const result = await this.productService.getProducts({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
        categoryId: categoryId as string,
        tag: tag as string,
        isActive: isActive ? isActive === 'true' : undefined,
        isFeatured: isFeatured ? isFeatured === 'true' : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      paginated(res, result.products, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get product by ID
   * GET /api/v1/products/:id
   */
  getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      success(res, product);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get product by slug
   * GET /api/v1/products/slug/:slug
   */
  getProductBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { slug } = req.params;
      const product = await this.productService.getProductBySlug(slug);
      success(res, product);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get featured products
   * GET /api/v1/products/featured
   */
  getFeaturedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { limit } = req.query;
      const products = await this.productService.getFeaturedProducts(
        limit ? Number(limit) : undefined
      );
      success(res, products);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get products by category
   * GET /api/v1/products/category/:categoryId
   */
  getProductsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { categoryId } = req.params;
      const { page, limit } = req.query;

      const result = await this.productService.getProductsByCategory(categoryId, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      paginated(res, result.products, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create product
   * POST /api/v1/products
   */
  createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.productService.createProduct(req.body);
      success(res, product, 'Produto criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update product
   * PUT /api/v1/products/:id
   */
  updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productService.updateProduct(id, req.body);
      success(res, product, 'Produto atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete product
   * DELETE /api/v1/products/:id
   */
  deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.productService.deleteProduct(id);
      success(res, null, 'Produto deletado com sucesso');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update product stock
   * PATCH /api/v1/products/:id/stock
   */
  updateStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const product = await this.productService.updateStock(id, quantity);
      success(res, product, 'Estoque atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  };
}
