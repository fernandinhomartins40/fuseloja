/**
 * Customer Controller
 * Customer management endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer.service';
import { success, paginated } from '../utils/response';

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  /**
   * Get all customers
   * GET /api/v1/customers
   */
  getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, search } = req.query;

      const result = await this.customerService.getCustomers({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
      });

      paginated(res, result.customers, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get customer by ID
   * GET /api/v1/customers/:id
   */
  getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const customer = await this.customerService.getCustomerById(id);
      success(res, customer);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get customer by phone
   * GET /api/v1/customers/phone/:phone
   */
  getCustomerByPhone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { phone } = req.params;
      const customer = await this.customerService.getCustomerByPhone(phone);
      success(res, customer);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get customer with orders
   * GET /api/v1/customers/:id/orders
   */
  getCustomerWithOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { limit } = req.query;
      const customer = await this.customerService.getCustomerWithOrders(
        id,
        limit ? Number(limit) : undefined
      );
      success(res, customer);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get customer statistics
   * GET /api/v1/customers/:id/statistics
   */
  getCustomerStatistics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const statistics = await this.customerService.getCustomerStatistics(id);
      success(res, statistics);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create customer
   * POST /api/v1/customers
   */
  createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customer = await this.customerService.createCustomer(req.body);
      success(res, customer, 'Cliente criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update customer
   * PUT /api/v1/customers/:id
   */
  updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const customer = await this.customerService.updateCustomer(id, req.body);
      success(res, customer, 'Cliente atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete customer
   * DELETE /api/v1/customers/:id
   */
  deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.customerService.deleteCustomer(id);
      success(res, null, 'Cliente deletado com sucesso');
    } catch (error) {
      next(error);
    }
  };
}
