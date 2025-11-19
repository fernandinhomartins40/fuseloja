const express = require('express');
const { query } = require('../database/connection');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const response = require('../utils/response');

const router = express.Router();

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      items,
      total,
      paymentMethod = 'WhatsApp',
      shippingMethod = 'A definir'
    } = req.body;

    // Validate required fields
    if (!customerName || !customerPhone || !items || !total) {
      return response.badRequest(res, 'Nome, telefone, itens e total são obrigatórios');
    }

    if (!Array.isArray(items) || items.length === 0) {
      return response.badRequest(res, 'Pelo menos um item é obrigatório');
    }

    // Insert order into database
    const orderResult = await query(
      `INSERT INTO orders (customer_name, customer_phone, customer_email, items, total, payment_method, shipping_method, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [customerName, customerPhone, customerEmail, JSON.stringify(items), total, paymentMethod, shippingMethod, 'pending']
    );

    const order = orderResult.rows[0];

    // Generate order ID in the format #TIMESTAMP
    const formattedOrderId = `#${order.id}`;

    return response.success(res, {
      order: {
        id: formattedOrderId,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail: order.customer_email,
        items: JSON.parse(order.items),
        total: parseFloat(order.total),
        paymentMethod: order.payment_method,
        shippingMethod: order.shipping_method,
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      }
    }, 'Pedido criado com sucesso');
  } catch (error) {
    console.error('Create order error:', error);
    return response.error(res, 'Erro ao criar pedido');
  }
});

// GET /api/orders - List all orders (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let queryParams = [limit, offset];

    if (status) {
      whereClause = 'WHERE status = $3';
      queryParams.push(status);
    }

    const ordersResult = await query(
      `SELECT * FROM orders ${whereClause} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      queryParams
    );

    const orders = ordersResult.rows.map(order => ({
      id: `#${order.id}`,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      customerEmail: order.customer_email,
      items: JSON.parse(order.items),
      total: parseFloat(order.total),
      paymentMethod: order.payment_method,
      shippingMethod: order.shipping_method,
      status: order.status,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }));

    return response.success(res, { orders, page: parseInt(page), limit: parseInt(limit) }, 'Pedidos listados com sucesso');
  } catch (error) {
    console.error('List orders error:', error);
    return response.error(res, 'Erro ao listar pedidos');
  }
});

// GET /api/orders/:id - Get a specific order
router.get('/:id', async (req, res) => {
  try {
    const orderId = req.params.id.replace('#', ''); // Remove # prefix if present

    const orderResult = await query(
      'SELECT * FROM orders WHERE id = $1',
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return response.notFound(res, 'Pedido não encontrado');
    }

    const order = orderResult.rows[0];

    return response.success(res, {
      order: {
        id: `#${order.id}`,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail: order.customer_email,
        items: JSON.parse(order.items),
        total: parseFloat(order.total),
        paymentMethod: order.payment_method,
        shippingMethod: order.shipping_method,
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      }
    }, 'Pedido encontrado');
  } catch (error) {
    console.error('Get order error:', error);
    return response.error(res, 'Erro ao buscar pedido');
  }
});

// PUT /api/orders/:id/status - Update order status (admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orderId = req.params.id.replace('#', ''); // Remove # prefix if present
    const { status } = req.body;

    if (!status) {
      return response.badRequest(res, 'Status é obrigatório');
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return response.badRequest(res, 'Status inválido');
    }

    const orderResult = await query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, orderId]
    );

    if (orderResult.rows.length === 0) {
      return response.notFound(res, 'Pedido não encontrado');
    }

    const order = orderResult.rows[0];

    return response.success(res, {
      order: {
        id: `#${order.id}`,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail: order.customer_email,
        items: JSON.parse(order.items),
        total: parseFloat(order.total),
        paymentMethod: order.payment_method,
        shippingMethod: order.shipping_method,
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      }
    }, 'Status do pedido atualizado com sucesso');
  } catch (error) {
    console.error('Update order status error:', error);
    return response.error(res, 'Erro ao atualizar status do pedido');
  }
});

// GET /api/orders/customer/:phone - Get orders by customer phone
router.get('/customer/:phone', async (req, res) => {
  try {
    const { phone } = req.params;

    const ordersResult = await query(
      'SELECT * FROM orders WHERE customer_phone = $1 ORDER BY created_at DESC',
      [phone]
    );

    const orders = ordersResult.rows.map(order => ({
      id: `#${order.id}`,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      customerEmail: order.customer_email,
      items: JSON.parse(order.items),
      total: parseFloat(order.total),
      paymentMethod: order.payment_method,
      shippingMethod: order.shipping_method,
      status: order.status,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }));

    return response.success(res, { orders }, 'Pedidos do cliente encontrados');
  } catch (error) {
    console.error('Get customer orders error:', error);
    return response.error(res, 'Erro ao buscar pedidos do cliente');
  }
});

module.exports = router; 