require('dotenv').config();
const { query } = require('../database/connection');
const { createAdminUser } = require('./createAdmin');

const createTables = async () => {
  try {
    console.log('🚀 Running database migrations...');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');

    // Create categories table
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        image_url VARCHAR(255),
        icon VARCHAR(50) DEFAULT 'Package',
        color VARCHAR(7) DEFAULT '#6B7280',
        slug VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add new columns if they don't exist (for existing databases)
    try {
      await query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon VARCHAR(50) DEFAULT 'Package'`);
      await query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#6B7280'`);
      await query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug VARCHAR(100)`);
    } catch (error) {
      // Columns might already exist, continue
    }
    console.log('✅ Categories table created/verified');

    // Create products table
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        short_description TEXT,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        original_price DECIMAL(10, 2),
        sku VARCHAR(100) UNIQUE,
        stock INT NOT NULL DEFAULT 0,
        image_url VARCHAR(255),
        category_id INT REFERENCES categories(id),
        tag VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Products table created/verified');

    // Create customers table
    await query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL UNIQUE,
        email VARCHAR(255),
        address TEXT,
        birth_date DATE,
        cpf VARCHAR(14),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Customers table created/verified');

    // Create orders table
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_email VARCHAR(255),
        items JSONB NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'WhatsApp',
        shipping_method VARCHAR(100) DEFAULT 'A definir',
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Orders table created/verified');

    // Create indexes for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone)
    `);
    console.log('✅ Index created for customers phone');

    await query(`
      CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone)
    `);
    console.log('✅ Index created for orders customer phone');

    await query(`
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)
    `);
    console.log('✅ Index created for orders status');

    await query(`
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)
    `);
    console.log('✅ Index created for orders created_at');

    await query(`
      CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id)
    `);
    console.log('✅ Index created for products category_id');
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active)
    `);
    console.log('✅ Index created for products is_active');

    // Add is_provisional column to users table if it doesn't exist
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_provisional BOOLEAN DEFAULT false
    `);
    console.log('✅ Users table updated with is_provisional column');
    
    // Create trigger for updated_at on users table
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ Trigger for users updated_at created/verified');

    console.log('🎉 All tables and extensions created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

// Run the migration if this script is called directly
if (require.main === module) {
  createTables()
    .then(() => {
      // Create admin user after tables are created
      return createAdminUser();
    })
    .then(() => {
      console.log('✨ Database migration and admin creation completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database migration failed:', error);
      process.exit(1);
    });
}

module.exports = { createTables };