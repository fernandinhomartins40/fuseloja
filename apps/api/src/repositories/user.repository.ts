/**
 * User Repository
 * Database operations for User model
 */

import { User, Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import prisma from '../lib/prisma';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('user');
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        addresses: true,
      },
    });
  }

  /**
   * Find user by CPF
   */
  async findByCpf(cpf: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { cpf },
    });
  }

  /**
   * Find active users
   */
  async findActive(options?: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return prisma.user.findMany({
      where: { isActive: true, deletedAt: null },
      ...options,
    });
  }

  /**
   * Count active users
   */
  async countActive(): Promise<number> {
    return prisma.user.count({
      where: { isActive: true, deletedAt: null },
    });
  }

  /**
   * Find users with filters
   */
  async findWithFilters(filters: {
    search?: string;
    role?: string;
    isActive?: boolean;
    skip?: number;
    take?: number;
  }): Promise<User[]> {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { cpf: { contains: filters.search } },
      ];
    }

    if (filters.role) {
      where.role = filters.role as any;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return prisma.user.findMany({
      where,
      skip: filters.skip,
      take: filters.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Count users with filters
   */
  async countWithFilters(filters: {
    search?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<number> {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { cpf: { contains: filters.search } },
      ];
    }

    if (filters.role) {
      where.role = filters.role as any;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return prisma.user.count({ where });
  }

  /**
   * Update last login
   */
  async updateLastLogin(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  /**
   * Create user with address
   */
  async createWithAddress(
    userData: Prisma.UserCreateInput,
    addressData?: Prisma.AddressCreateWithoutUserInput
  ): Promise<User> {
    return prisma.user.create({
      data: {
        ...userData,
        ...(addressData && {
          addresses: {
            create: addressData,
          },
        }),
      },
      include: {
        addresses: true,
      },
    });
  }

  /**
   * Get user with relations
   */
  async findByIdWithRelations(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }
}
