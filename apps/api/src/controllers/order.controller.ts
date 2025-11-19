/**
 * Order Controller
 * Order management endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { success, paginated } from '../utils/response';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  /**
   * Get all orders
   * GET /api/v1/orders
   */
  getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, search, status, userId, customerId, startDate, endDate } = req.query;

      const result = await this.orderService.getOrders({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
        status: status as string,
        userId: userId as string,
        customerId: customerId as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      paginated(res, result.orders, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get order by ID
   * GET /api/v1/orders/:id
   */
  getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(id);
      success(res, order);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get order by order number
   * GET /api/v1/orders/number/:orderNumber
   */
  getOrderByNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderNumber } = req.params;
      const order = await this.orderService.getOrderByNumber(orderNumber);
      success(res, order);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user orders
   * GET /api/v1/orders/my-orders
   */
  getUserOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { page, limit } = req.query;

      const result = await this.orderService.getUserOrders(userId, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      paginated(res, result.orders, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get customer orders
   * GET /api/v1/orders/customer/:customerId
   */
  getCustomerOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { customerId } = req.params;
      const { page, limit } = req.query;

      const result = await this.orderService.getCustomerOrders(customerId, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      paginated(res, result.orders, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create order
   * POST /api/v1/orders
   */
  createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // If user is authenticated, add userId to order data
      if (req.user) {
        req.body.userId = req.user.userId;
      }

      const order = await this.orderService.createOrder(req.body);
      success(res, order, 'Pedido criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update order
   * PUT /api/v1/orders/:id
   */
  updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const order = await this.orderService.updateOrder(id, req.body);
      success(res, order, 'Pedido atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update order status
   * PATCH /api/v1/orders/:id/status
   */
  updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await this.orderService.updateOrderStatus(id, status);
      success(res, order, 'Status do pedido atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Cancel order
   * POST /api/v1/orders/:id/cancel
   */
  cancelOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const order = await this.orderService.cancelOrder(id);
      success(res, order, 'Pedido cancelado com sucesso');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get order statistics
   * GET /api/v1/orders/statistics
   */
  getStatistics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      const statistics = await this.orderService.getStatistics({
        startDate: startDate as string,
        endDate: endDate as string,
      });
      success(res, statistics);
    } catch (error) {
      next(error);
    }
  };
}
