const { query } = require('../database/connection');

const createTables = async () => {
  try {
    console.log('🚀 Creating database tables...');

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

    // Add is_provisional column to users table if it doesn't exist
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_provisional BOOLEAN DEFAULT false
    `);
    console.log('✅ Users table updated with is_provisional column');

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

    console.log('🎉 All tables created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

// Run the migration if this script is called directly
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('✨ Database migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database migration failed:', error);
      process.exit(1);
    });
}

module.exports = { createTables };