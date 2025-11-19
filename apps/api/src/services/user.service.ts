/**
 * User Service
 * User management business logic
 */

import { User, Address } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';
import { hashPassword } from '../utils/hash';
import { getPaginationParams } from '../utils/pagination';
import { ConflictError, NotFoundError } from '../utils/errors';
import prisma from '../lib/prisma';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Get all users with pagination
   */
  async getUsers(options?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<{
    users: Omit<User, 'password'>[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, skip } = getPaginationParams(options?.page, options?.limit);

    const filters = {
      search: options?.search,
      role: options?.role,
      isActive: options?.isActive,
      skip,
      take: limit,
    };

    const [users, total] = await Promise.all([
      this.userRepository.findWithFilters(filters),
      this.userRepository.countWithFilters(filters),
    ]);

    // Remove passwords
    const usersWithoutPassword = users.map(({ password, ...user }) => user);

    return {
      users: usersWithoutPassword,
      total,
      page,
      limit,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findByIdWithRelations(id);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Create user
   */
  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    cpf?: string;
    role?: string;
  }): Promise<Omit<User, 'password'>> {
    // Check if email exists
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new ConflictError('Email já está em uso');
    }

    // Check if CPF exists
    if (data.cpf) {
      const existingCpf = await this.userRepository.findByCpf(data.cpf);
      if (existingCpf) {
        throw new ConflictError('CPF já está em uso');
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      cpf: data.cpf,
      role: (data.role as any) || 'USER',
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update user
   */
  async updateUser(
    id: string,
    data: {
      email?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      cpf?: string;
      role?: string;
      isActive?: boolean;
    }
  ): Promise<Omit<User, 'password'>> {
    // Check if user exists
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    // Check if email is being changed and is already in use
    if (data.email && data.email !== user.email) {
      const existingEmail = await this.userRepository.findByEmail(data.email);
      if (existingEmail) {
        throw new ConflictError('Email já está em uso');
      }
    }

    // Check if CPF is being changed and is already in use
    if (data.cpf && data.cpf !== user.cpf) {
      const existingCpf = await this.userRepository.findByCpf(data.cpf);
      if (existingCpf) {
        throw new ConflictError('CPF já está em uso');
      }
    }

    // Update user
    const updatedUser = await this.userRepository.update(id, data);

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Delete user (soft delete)
   */
  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    await this.userRepository.softDelete(id);
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      cpf?: string;
      birthDate?: Date;
      avatar?: string;
    }
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    // Check if CPF is being changed and is already in use
    if (data.cpf && data.cpf !== user.cpf) {
      const existingCpf = await this.userRepository.findByCpf(data.cpf);
      if (existingCpf) {
        throw new ConflictError('CPF já está em uso');
      }
    }

    const updatedUser = await this.userRepository.update(userId, data);

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Get user addresses
   */
  async getUserAddresses(userId: string): Promise<Address[]> {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  /**
   * Create user address
   */
  async createAddress(
    userId: string,
    data: {
      label?: string;
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
      isDefault?: boolean;
    }
  ): Promise<Address> {
    // If this is set as default, unset other default addresses
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  /**
   * Update user address
   */
  async updateAddress(
    userId: string,
    addressId: string,
    data: {
      label?: string;
      street?: string;
      number?: string;
      complement?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      isDefault?: boolean;
    }
  ): Promise<Address> {
    // Check if address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundError('Endereço não encontrado');
    }

    // If this is set as default, unset other default addresses
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  /**
   * Delete user address
   */
  async deleteAddress(userId: string, addressId: string): Promise<void> {
    // Check if address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundError('Endereço não encontrado');
    }

    await prisma.address.delete({
      where: { id: addressId },
    });
  }
}
