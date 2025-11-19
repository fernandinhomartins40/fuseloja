/**
 * Base Repository
 * Generic CRUD operations for Prisma models
 */

import { PrismaClient } from '@prisma/client';
import prisma from '../lib/prisma';

export class BaseRepository<T> {
  protected prisma: PrismaClient;
  protected modelName: string;

  constructor(modelName: string) {
    this.prisma = prisma;
    this.modelName = modelName;
  }

  /**
   * Get model delegate
   */
  protected get model(): any {
    return (this.prisma as any)[this.modelName];
  }

  /**
   * Find by ID
   */
  async findById(id: string, include?: Record<string, boolean>): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
      include,
    });
  }

  /**
   * Find all with optional filters
   */
  async findAll(options?: {
    where?: Record<string, any>;
    include?: Record<string, boolean>;
    orderBy?: Record<string, any>;
    skip?: number;
    take?: number;
  }): Promise<T[]> {
    return this.model.findMany(options);
  }

  /**
   * Count records
   */
  async count(where?: Record<string, any>): Promise<number> {
    return this.model.count({ where });
  }

  /**
   * Create record
   */
  async create(data: any, include?: Record<string, boolean>): Promise<T> {
    return this.model.create({
      data,
      include,
    });
  }

  /**
   * Update record
   */
  async update(id: string, data: any, include?: Record<string, boolean>): Promise<T> {
    return this.model.update({
      where: { id },
      data,
      include,
    });
  }

  /**
   * Delete record
   */
  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  /**
   * Soft delete (if deletedAt field exists)
   */
  async softDelete(id: string): Promise<T> {
    return this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Find one by field
   */
  async findOne(where: Record<string, any>, include?: Record<string, boolean>): Promise<T | null> {
    return this.model.findFirst({
      where,
      include,
    });
  }

  /**
   * Check if exists
   */
  async exists(where: Record<string, any>): Promise<boolean> {
    const count = await this.model.count({ where });
    return count > 0;
  }
}
