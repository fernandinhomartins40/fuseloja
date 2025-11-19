/**
 * Order Service
 * Order management business logic
 */

import { Order, Prisma } from '@prisma/client';
import { OrderRepository } from '../repositories/order.repository';
import { ProductRepository } from '../repositories/product.repository';
import { getPaginationParams } from '../utils/pagination';
import { NotFoundError, ValidationError } from '../utils/errors';

export class OrderService {
  private orderRepository: OrderRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.productRepository = new ProductRepository();
  }

  /**
   * Get all orders with pagination and filters
   */
  async getOrders(options?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    userId?: string;
    customerId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, skip } = getPaginationParams(options?.page, options?.limit);

    const filters = {
      search: options?.search,
      status: options?.status,
      userId: options?.userId,
      customerId: options?.customerId,
      startDate: options?.startDate ? new Date(options.startDate) : undefined,
      endDate: options?.endDate ? new Date(options.endDate) : undefined,
      skip,
      take: limit,
    };

    const [orders, total] = await Promise.all([
      this.orderRepository.findWithFilters(filters),
      this.orderRepository.countWithFilters(filters),
    ]);

    return {
      orders,
      total,
      page,
      limit,
    };
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findByIdWithRelations(id);
    if (!order) {
      throw new NotFoundError('Pedido não encontrado');
    }

    return order;
  }

  /**
   * Get order by order number
   */
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderRepository.findByOrderNumber(orderNumber);
    if (!order) {
      throw new NotFoundError('Pedido não encontrado');
    }

    return order;
  }

  /**
   * Get user orders
   */
  async getUserOrders(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
    }
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, skip } = getPaginationParams(options?.page, options?.limit);

    const [orders, total] = await Promise.all([
      this.orderRepository.findByUserId(userId, { skip, take: limit }),
      this.orderRepository.count({ userId }),
    ]);

    return {
      orders,
      total,
      page,
      limit,
    };
  }

  /**
   * Get customer orders
   */
  async getCustomerOrders(
    customerId: string,
    options?: {
      page?: number;
      limit?: number;
    }
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, skip } = getPaginationParams(options?.page, options?.limit);

    const [orders, total] = await Promise.all([
      this.orderRepository.findByCustomerId(customerId, { skip, take: limit }),
      this.orderRepository.count({ customerId }),
    ]);

    return {
      orders,
      total,
      page,
      limit,
    };
  }

  /**
   * Create order
   */
  async createOrder(data: {
    userId?: string;
    customerId?: string;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    addressId?: string;
    items: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      discount?: number;
    }>;
    discount?: number;
    shipping?: number;
    paymentMethod?: string;
    shippingMethod?: string;
  }): Promise<Order> {
    // Validate items
    if (!data.items || data.items.length === 0) {
      throw new ValidationError('Pedido deve ter pelo menos 1 item');
    }

    // Validate products and stock
    const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];
    let subtotal = 0;

    for (const item of data.items) {
      const product = await this.productRepository.findById(item.productId);

      if (!product || product.deletedAt) {
        throw new NotFoundError(`Produto ${item.productId} não encontrado`);
      }

      if (!product.isActive) {
        throw new ValidationError(`Produto ${product.title} não está disponível`);
      }

      if (product.stock < item.quantity) {
        throw new ValidationError(
          `Estoque insuficiente para o produto ${product.title}. Disponível: ${product.stock}`
        );
      }

      const itemSubtotal = item.quantity * item.unitPrice;
      const itemDiscount = item.discount || 0;
      const itemTotal = itemSubtotal - itemDiscount;

      subtotal += itemSubtotal;

      // Get primary image
      const primaryImage = await this.productRepository.findByIdWithRelations(product.id);
      const imageUrl = primaryImage?.images?.find(img => img.isPrimary)?.url ||
                       primaryImage?.images?.[0]?.url;

      orderItems.push({
        product: { connect: { id: product.id } },
        productName: product.title,
        productSku: product.sku,
        productImage: imageUrl,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: itemSubtotal,
        discount: itemDiscount,
        total: itemTotal,
      });
    }

    // Calculate totals
    const discount = data.discount || 0;
    const shipping = data.shipping || 0;
    const total = subtotal - discount + shipping;

    // Generate order number
    const orderNumber = await this.orderRepository.generateOrderNumber();

    // Create order data
    const orderData: Omit<Prisma.OrderCreateInput, 'items'> = {
      orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      subtotal,
      discount,
      shipping,
      total,
      status: 'PENDING',
      paymentMethod: (data.paymentMethod as any) || 'WHATSAPP',
      shippingMethod: (data.shippingMethod as any) || 'A_DEFINIR',
      ...(data.userId && { user: { connect: { id: data.userId } } }),
      ...(data.customerId && { customer: { connect: { id: data.customerId } } }),
      ...(data.addressId && { address: { connect: { id: data.addressId } } }),
    };

    // Create order
    const order = await this.orderRepository.createWithItems({
      order: orderData,
      items: orderItems,
    });

    // Update product stock and sales count
    for (const item of data.items) {
      await this.productRepository.updateStock(item.productId, -item.quantity);
      await this.productRepository.incrementSalesCount(item.productId, item.quantity);
    }

    return order;
  }

  /**
   * Update order
   */
  async updateOrder(
    id: string,
    data: {
      status?: string;
      paymentMethod?: string;
      shippingMethod?: string;
      trackingCode?: string;
      discount?: number;
      shipping?: number;
    }
  ): Promise<Order> {
    // Check if order exists
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Pedido não encontrado');
    }

    // If status is being updated, use the specific method
    if (data.status && data.status !== order.status) {
      return this.updateOrderStatus(id, data.status);
    }

    // Calculate new total if discount or shipping changed
    let updateData: Prisma.OrderUpdateInput = {};

    if (data.paymentMethod) updateData.paymentMethod = data.paymentMethod as any;
    if (data.shippingMethod) updateData.shippingMethod = data.shippingMethod as any;
    if (data.trackingCode !== undefined) updateData.trackingCode = data.trackingCode;

    if (data.discount !== undefined || data.shipping !== undefined) {
      const discount = data.discount ?? Number(order.discount);
      const shipping = data.shipping ?? Number(order.shipping);
      const total = Number(order.subtotal) - discount + shipping;

      updateData.discount = discount;
      updateData.shipping = shipping;
      updateData.total = total;
    }

    return this.orderRepository.update(id, updateData);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Pedido não encontrado');
    }

    // Validate status transition
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError('Status inválido');
    }

    // If canceling order, restore product stock
    if (status === 'CANCELED' && order.status !== 'CANCELED') {
      const orderWithItems = await this.orderRepository.findByIdWithRelations(id);
      if (orderWithItems?.items) {
        for (const item of orderWithItems.items) {
          await this.productRepository.updateStock(item.productId, item.quantity);
          await this.productRepository.incrementSalesCount(item.productId, -item.quantity);
        }
      }
    }

    return this.orderRepository.updateStatus(id, status);
  }

  /**
   * Cancel order
   */
  async cancelOrder(id: string): Promise<Order> {
    return this.updateOrderStatus(id, 'CANCELED');
  }

  /**
   * Get order statistics
   */
  async getStatistics(filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    canceled: number;
    totalRevenue: number;
  }> {
    return this.orderRepository.getStatistics({
      startDate: filters?.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters?.endDate ? new Date(filters.endDate) : undefined,
    });
  }
}
