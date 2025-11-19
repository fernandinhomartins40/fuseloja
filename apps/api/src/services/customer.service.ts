/**
 * Customer Service
 * Customer management business logic
 */

import { Customer } from '@prisma/client';
import { CustomerRepository } from '../repositories/customer.repository';
import { getPaginationParams } from '../utils/pagination';
import { ConflictError, NotFoundError } from '../utils/errors';

export class CustomerService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  /**
   * Get all customers with pagination
   */
  async getCustomers(options?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    customers: Customer[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, skip } = getPaginationParams(options?.page, options?.limit);

    const filters = {
      search: options?.search,
      skip,
      take: limit,
    };

    const [customers, total] = await Promise.all([
      this.customerRepository.findWithFilters(filters),
      this.customerRepository.countWithFilters(filters),
    ]);

    return {
      customers,
      total,
      page,
      limit,
    };
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Cliente não encontrado');
    }

    return customer;
  }

  /**
   * Get customer by phone
   */
  async getCustomerByPhone(phone: string): Promise<Customer | null> {
    return this.customerRepository.findByPhone(phone);
  }

  /**
   * Get customer with orders
   */
  async getCustomerWithOrders(id: string, limit: number = 20): Promise<Customer> {
    const customer = await this.customerRepository.findByIdWithOrders(id, limit);
    if (!customer) {
      throw new NotFoundError('Cliente não encontrado');
    }

    return customer;
  }

  /**
   * Get customer statistics
   */
  async getCustomerStatistics(id: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: Date | null;
  }> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Cliente não encontrado');
    }

    return this.customerRepository.getCustomerStatistics(id);
  }

  /**
   * Create customer
   */
  async createCustomer(data: {
    name: string;
    phone: string;
    email?: string;
    cpf?: string;
    birthDate?: Date;
    notes?: string;
  }): Promise<Customer> {
    // Check if phone already exists
    const existingPhone = await this.customerRepository.findByPhone(data.phone);
    if (existingPhone) {
      throw new ConflictError('Telefone já está em uso');
    }

    // Check if email already exists
    if (data.email) {
      const existingEmail = await this.customerRepository.findByEmail(data.email);
      if (existingEmail) {
        throw new ConflictError('Email já está em uso');
      }
    }

    return this.customerRepository.create(data);
  }

  /**
   * Update customer
   */
  async updateCustomer(
    id: string,
    data: {
      name?: string;
      phone?: string;
      email?: string;
      cpf?: string;
      birthDate?: Date;
      notes?: string;
    }
  ): Promise<Customer> {
    // Check if customer exists
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Cliente não encontrado');
    }

    // Check if phone is being changed and already exists
    if (data.phone && data.phone !== customer.phone) {
      const existingPhone = await this.customerRepository.findByPhone(data.phone);
      if (existingPhone) {
        throw new ConflictError('Telefone já está em uso');
      }
    }

    // Check if email is being changed and already exists
    if (data.email && data.email !== customer.email) {
      const existingEmail = await this.customerRepository.findByEmail(data.email);
      if (existingEmail) {
        throw new ConflictError('Email já está em uso');
      }
    }

    return this.customerRepository.update(id, data);
  }

  /**
   * Delete customer
   */
  async deleteCustomer(id: string): Promise<void> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Cliente não encontrado');
    }

    await this.customerRepository.delete(id);
  }

  /**
   * Find or create customer by phone
   */
  async findOrCreateByPhone(data: {
    name: string;
    phone: string;
    email?: string;
  }): Promise<Customer> {
    // Try to find existing customer
    const existing = await this.customerRepository.findByPhone(data.phone);
    if (existing) {
      return existing;
    }

    // Create new customer
    return this.customerRepository.create(data);
  }
}
