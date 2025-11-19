/**
 * Customer Repository
 * Database operations for Customer model
 */

import { Customer, Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import prisma from '../lib/prisma';

export class CustomerRepository extends BaseRepository<Customer> {
  constructor() {
    super('customer');
  }

  /**
   * Find customer by phone
   */
  async findByPhone(phone: string): Promise<Customer | null> {
    return prisma.customer.findUnique({
      where: { phone },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  /**
   * Find customer by email
   */
  async findByEmail(email: string): Promise<Customer | null> {
    return prisma.customer.findFirst({
      where: { email },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  /**
   * Find customers with filters
   */
  async findWithFilters(filters: {
    search?: string;
    skip?: number;
    take?: number;
  }): Promise<Customer[]> {
    const where: Prisma.CustomerWhereInput = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { cpf: { contains: filters.search } },
      ];
    }

    return prisma.customer.findMany({
      where,
      skip: filters.skip,
      take: filters.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Count customers with filters
   */
  async countWithFilters(filters: {
    search?: string;
  }): Promise<number> {
    const where: Prisma.CustomerWhereInput = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { cpf: { contains: filters.search } },
      ];
    }

    return prisma.customer.count({ where });
  }

  /**
   * Find customer with orders
   */
  async findByIdWithOrders(id: string, limit: number = 20): Promise<Customer | null> {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    title: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get customer statistics
   */
  async getCustomerStatistics(id: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: Date | null;
  }> {
    const orders = await prisma.order.findMany({
      where: { customerId: id },
      select: {
        total: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const lastOrderDate = orders.length > 0 ? orders[0].createdAt : null;

    return {
      totalOrders,
      totalSpent,
      lastOrderDate,
    };
  }
}
