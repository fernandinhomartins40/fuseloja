/**
 * Order Repository
 * Database operations for Order model
 */

import { Order, Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import prisma from '../lib/prisma';

export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super('order');
  }

  /**
   * Order include relations
   */
  private readonly defaultInclude = {
    items: {
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            stock: true,
            isActive: true,
          },
        },
      },
    },
    user: {
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    },
    customer: true,
    address: true,
  };

  /**
   * Find order by order number
   */
  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: this.defaultInclude,
    });
  }

  /**
   * Find orders with filters
   */
  async findWithFilters(filters: {
    search?: string;
    status?: string;
    userId?: string;
    customerId?: string;
    startDate?: Date;
    endDate?: Date;
    skip?: number;
    take?: number;
  }): Promise<Order[]> {
    const where: Prisma.OrderWhereInput = {};

    if (filters.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { customerName: { contains: filters.search, mode: 'insensitive' } },
        { customerPhone: { contains: filters.search } },
        { customerEmail: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.status) {
      where.status = filters.status as any;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    return prisma.order.findMany({
      where,
      include: this.defaultInclude,
      skip: filters.skip,
      take: filters.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Count orders with filters
   */
  async countWithFilters(filters: {
    search?: string;
    status?: string;
    userId?: string;
    customerId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<number> {
    const where: Prisma.OrderWhereInput = {};

    if (filters.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { customerName: { contains: filters.search, mode: 'insensitive' } },
        { customerPhone: { contains: filters.search } },
        { customerEmail: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.status) {
      where.status = filters.status as any;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    return prisma.order.count({ where });
  }

  /**
   * Find user orders
   */
  async findByUserId(userId: string, options?: {
    skip?: number;
    take?: number;
  }): Promise<Order[]> {
    return prisma.order.findMany({
      where: { userId },
      include: this.defaultInclude,
      ...options,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find customer orders
   */
  async findByCustomerId(customerId: string, options?: {
    skip?: number;
    take?: number;
  }): Promise<Order[]> {
    return prisma.order.findMany({
      where: { customerId },
      include: this.defaultInclude,
      ...options,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create order with items
   */
  async createWithItems(data: {
    order: Omit<Prisma.OrderCreateInput, 'items'>;
    items: Array<Prisma.OrderItemCreateWithoutOrderInput>;
  }): Promise<Order> {
    return prisma.order.create({
      data: {
        ...data.order,
        items: {
          create: data.items,
        },
      },
      include: this.defaultInclude,
    });
  }

  /**
   * Update order status
   */
  async updateStatus(id: string, status: string): Promise<Order> {
    const updateData: Prisma.OrderUpdateInput = {
      status: status as any,
    };

    // Set timestamps based on status
    if (status === 'PROCESSING') {
      // No specific timestamp for processing
    } else if (status === 'SHIPPED') {
      updateData.shippedAt = new Date();
    } else if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    } else if (status === 'CANCELED') {
      updateData.canceledAt = new Date();
    }

    return prisma.order.update({
      where: { id },
      data: updateData,
      include: this.defaultInclude,
    });
  }

  /**
   * Find by ID with relations
   */
  async findByIdWithRelations(id: string): Promise<Order | null> {
    return prisma.order.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
  }

  /**
   * Get order statistics
   */
  async getStatistics(filters?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    canceled: number;
    totalRevenue: number;
  }> {
    const where: Prisma.OrderWhereInput = {};

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const [total, pending, processing, shipped, delivered, canceled, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.count({ where: { ...where, status: 'PENDING' } }),
      prisma.order.count({ where: { ...where, status: 'PROCESSING' } }),
      prisma.order.count({ where: { ...where, status: 'SHIPPED' } }),
      prisma.order.count({ where: { ...where, status: 'DELIVERED' } }),
      prisma.order.count({ where: { ...where, status: 'CANCELED' } }),
      prisma.order.findMany({
        where: { ...where, status: { not: 'CANCELED' } },
        select: { total: true },
      }),
    ]);

    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );

    return {
      total,
      pending,
      processing,
      shipped,
      delivered,
      canceled,
      totalRevenue,
    };
  }

  /**
   * Generate unique order number
   */
  async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // Count today's orders
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    return `${year}${month}${day}${sequence}`;
  }
}
