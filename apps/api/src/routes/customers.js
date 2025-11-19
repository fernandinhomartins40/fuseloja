const express = require('express');
const { query } = require('../database/connection');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const response = require('../utils/response');

const router = express.Router();

// POST /api/customers - Create a new customer
router.post('/', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      birthDate,
      cpf,
      notes
    } = req.body;

    // Validate required fields
    if (!name || !phone) {
      return response.badRequest(res, 'Nome e telefone são obrigatórios');
    }

    // Check if customer already exists by phone
    const existingCustomer = await query(
      'SELECT * FROM customers WHERE phone = $1',
      [phone]
    );

    if (existingCustomer.rows.length > 0) {
      // Return existing customer
      const customer = existingCustomer.rows[0];
      return response.success(res, {
        customer: {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          birthDate: customer.birth_date,
          cpf: customer.cpf,
          notes: customer.notes,
          createdAt: customer.created_at,
          updatedAt: customer.updated_at
        }
      }, 'Cliente já existe');
    }

    // Create new customer
    const customerResult = await query(
      `INSERT INTO customers (name, phone, email, address, birth_date, cpf, notes, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [name, phone, email, address, birthDate, cpf, notes]
    );

    const customer = customerResult.rows[0];

    return response.success(res, {
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        birthDate: customer.birth_date,
        cpf: customer.cpf,
        notes: customer.notes,
        createdAt: customer.created_at,
        updatedAt: customer.updated_at
      }
    }, 'Cliente criado com sucesso');
  } catch (error) {
    console.error('Create customer error:', error);
    return response.error(res, 'Erro ao criar cliente');
  }
});

// GET /api/customers - List all customers (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let queryParams = [limit, offset];

    if (search) {
      whereClause = 'WHERE name ILIKE $3 OR phone ILIKE $3 OR email ILIKE $3';
      queryParams.push(`%${search}%`);
    }

    const customersResult = await query(
      `SELECT * FROM customers ${whereClause} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      queryParams
    );

    const customers = customersResult.rows.map(customer => ({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      birthDate: customer.birth_date,
      cpf: customer.cpf,
      notes: customer.notes,
      createdAt: customer.created_at,
      updatedAt: customer.updated_at
    }));

    return response.success(res, { customers, page: parseInt(page), limit: parseInt(limit) }, 'Clientes listados com sucesso');
  } catch (error) {
    console.error('List customers error:', error);
    return response.error(res, 'Erro ao listar clientes');
  }
});

// GET /api/customers/:id - Get a specific customer
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const customerId = req.params.id;

    const customerResult = await query(
      'SELECT * FROM customers WHERE id = $1',
      [customerId]
    );

    if (customerResult.rows.length === 0) {
      return response.notFound(res, 'Cliente não encontrado');
    }

    const customer = customerResult.rows[0];

    return response.success(res, {
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        birthDate: customer.birth_date,
        cpf: customer.cpf,
        notes: customer.notes,
        createdAt: customer.created_at,
        updatedAt: customer.updated_at
      }
    }, 'Cliente encontrado');
  } catch (error) {
    console.error('Get customer error:', error);
    return response.error(res, 'Erro ao buscar cliente');
  }
});

// PUT /api/customers/:id - Update a customer (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const customerId = req.params.id;
    const {
      name,
      phone,
      email,
      address,
      birthDate,
      cpf,
      notes
    } = req.body;

    const customerResult = await query(
      `UPDATE customers 
       SET name = $1, phone = $2, email = $3, address = $4, birth_date = $5, cpf = $6, notes = $7, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $8 
       RETURNING *`,
      [name, phone, email, address, birthDate, cpf, notes, customerId]
    );

    if (customerResult.rows.length === 0) {
      return response.notFound(res, 'Cliente não encontrado');
    }

    const customer = customerResult.rows[0];

    return response.success(res, {
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        birthDate: customer.birth_date,
        cpf: customer.cpf,
        notes: customer.notes,
        createdAt: customer.created_at,
        updatedAt: customer.updated_at
      }
    }, 'Cliente atualizado com sucesso');
  } catch (error) {
    console.error('Update customer error:', error);
    return response.error(res, 'Erro ao atualizar cliente');
  }
});

// GET /api/customers/phone/:phone - Get customer by phone
router.get('/phone/:phone', async (req, res) => {
  try {
    const { phone } = req.params;

    const customerResult = await query(
      'SELECT * FROM customers WHERE phone = $1',
      [phone]
    );

    if (customerResult.rows.length === 0) {
      return response.notFound(res, 'Cliente não encontrado');
    }

    const customer = customerResult.rows[0];

    return response.success(res, {
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        birthDate: customer.birth_date,
        cpf: customer.cpf,
        notes: customer.notes,
        createdAt: customer.created_at,
        updatedAt: customer.updated_at
      }
    }, 'Cliente encontrado');
  } catch (error) {
    console.error('Get customer by phone error:', error);
    return response.error(res, 'Erro ao buscar cliente');
  }
});

// POST /api/customers/provisional - Create provisional user automatically
router.post('/provisional', async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return response.badRequest(res, 'Nome e telefone são obrigatórios');
    }

    // Check if customer already exists by phone
    const existingCustomer = await query(
      'SELECT * FROM customers WHERE phone = $1',
      [phone]
    );

    let customer;
    if (existingCustomer.rows.length > 0) {
      customer = existingCustomer.rows[0];
    } else {
      // Create new customer
      const customerResult = await query(
        `INSERT INTO customers (name, phone, created_at, updated_at) 
         VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
         RETURNING *`,
        [name, phone]
      );
      customer = customerResult.rows[0];
    }

    // Create provisional user
    const email = `provisional_${phone}@temp.com`;
    const password = name.substring(0, 3).toLowerCase(); // First 3 letters of name

    // Check if user already exists
    const existingUser = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    let user;
    if (existingUser.rows.length > 0) {
      user = existingUser.rows[0];
    } else {
      // Create provisional user
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash(password, 10);

      const userResult = await query(
        `INSERT INTO users (email, password, first_name, last_name, role, is_provisional, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
         RETURNING *`,
        [email, hashedPassword, name.split(' ')[0], name.split(' ').slice(1).join(' '), 'user', true]
      );
      user = userResult.rows[0];
    }

    return response.success(res, {
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        birthDate: customer.birth_date,
        cpf: customer.cpf,
        notes: customer.notes,
        createdAt: customer.created_at,
        updatedAt: customer.updated_at
      },
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isProvisional: user.is_provisional,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
      provisionalCredentials: {
        email: email,
        password: password
      }
    }, 'Cliente e usuário provisório criados com sucesso');
  } catch (error) {
    console.error('Create provisional customer error:', error);
    return response.error(res, 'Erro ao criar cliente provisório');
  }
});

module.exports = router; 