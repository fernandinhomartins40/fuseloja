const bcrypt = require('bcryptjs');
const { query } = require('../database/connection');

const createAdminUser = async () => {
  try {
    const adminEmail = 'admin@fuseloja.com.br';
    const adminPassword = 'admin123';
    
    // Verificar se o usuário admin já existe
    const existingAdmin = await query(
      'SELECT id FROM users WHERE email = $1',
      [adminEmail]
    );

    if (existingAdmin.rows.length > 0) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Criar hash da senha
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Criar usuário administrador
    await query(
      'INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5)',
      [adminEmail, hashedPassword, 'Admin', 'FuseLoja', 'admin']
    );

    console.log('✅ Admin user created successfully');
    console.log('📧 Email:', adminEmail);
    console.log('🔐 Password:', adminPassword);
    console.log('👑 Role: admin');
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
  }
};

module.exports = { createAdminUser };