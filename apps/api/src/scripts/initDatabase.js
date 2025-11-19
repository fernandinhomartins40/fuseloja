require('dotenv').config();
const { Pool } = require('pg');

// Configuração do banco de dados
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'fuseloja',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const initDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Iniciando configuração do banco de dados...');
    
    // Criar tabelas
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        is_provisional BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela users criada/verificada');

    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        image_url VARCHAR(255),
        icon VARCHAR(50) DEFAULT 'Package',
        color VARCHAR(7) DEFAULT '#6B7280',
        icon_color VARCHAR(7) DEFAULT '#FFFFFF',
        slug VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela categories criada/verificada');

    await client.query(`
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
        category_id INT REFERENCES categories(id) ON DELETE SET NULL,
        tag VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela products criada/verificada');

    await client.query(`
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
    console.log('✅ Tabela customers criada/verificada');

    await client.query(`
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
    console.log('✅ Tabela orders criada/verificada');

    // Inserir categorias padrão
    const categoriesData = [
      { name: 'Eletrônicos', description: 'Smartphones, tablets, laptops e outros dispositivos', icon: 'Smartphone', color: '#3B82F6', slug: 'eletronicos' },
      { name: 'Moda', description: 'Roupas, calçados e acessórios de moda', icon: 'Shirt', color: '#EC4899', slug: 'moda' },
      { name: 'Casa e Decoração', description: 'Móveis, decoração e itens para o lar', icon: 'Home', color: '#10B981', slug: 'casa-decoracao' },
      { name: 'Beleza e Saúde', description: 'Produtos de beleza, saúde e bem-estar', icon: 'Sparkles', color: '#8B5CF6', slug: 'beleza-saude' },
      { name: 'Esportes', description: 'Artigos esportivos e equipamentos de fitness', icon: 'Dumbbell', color: '#EF4444', slug: 'esportes' },
      { name: 'Livros', description: 'Livros físicos, e-books e audiolivros', icon: 'BookOpen', color: '#F59E0B', slug: 'livros' },
      { name: 'Alimentos', description: 'Alimentos, bebidas e artigos de culinária', icon: 'UtensilsCrossed', color: '#059669', slug: 'alimentos' },
      { name: 'Automotivo', description: 'Peças, acessórios e produtos para automóveis', icon: 'Car', color: '#0EA5E9', slug: 'automotivo' }
    ];

    for (const category of categoriesData) {
      await client.query(`
        INSERT INTO categories (name, description, icon, color, icon_color, slug)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (name) DO UPDATE SET
          description = EXCLUDED.description,
          icon = EXCLUDED.icon,
          color = EXCLUDED.color,
          icon_color = EXCLUDED.icon_color,
          slug = EXCLUDED.slug
      `, [category.name, category.description, category.icon, category.color, '#FFFFFF', category.slug]);
    }
    console.log('✅ Categorias padrão inseridas/atualizadas');

    // Inserir produtos de exemplo
    const productsData = [
      { title: 'Smartphone Premium Galaxy S24', short_description: 'Smartphone avançado com câmera de 200MP', description: 'Smartphone com tela de 6.8 polegadas, processador Snapdragon 8 Gen 3, 12GB RAM, 256GB armazenamento', price: 2999.99, original_price: 3499.99, sku: 'SMART001', stock: 15, image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', category: 'Eletrônicos', tag: 'novo' },
      { title: 'Notebook Gamer RTX 4060', short_description: 'Notebook para jogos com placa RTX 4060', description: 'Notebook para jogos com Intel i7, 16GB RAM, SSD 512GB, RTX 4060 8GB', price: 4599.99, original_price: 5199.99, sku: 'NOTE001', stock: 8, image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', category: 'Eletrônicos', tag: 'promocao' },
      { title: 'Camiseta Básica Premium', short_description: 'Camiseta 100% algodão com qualidade premium', description: 'Camiseta básica de algodão peruano, corte moderno, disponível em várias cores', price: 89.99, original_price: 119.99, sku: 'CAM001', stock: 50, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', category: 'Moda', tag: 'promocao' },
      { title: 'Tênis Esportivo Pro Runner', short_description: 'Tênis para corrida com tecnologia de amortecimento', description: 'Tênis esportivo com tecnologia de amortecimento avançada, solado antiderrapante', price: 299.99, original_price: 399.99, sku: 'TEN001', stock: 25, image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', category: 'Esportes', tag: 'novo' },
      { title: 'Sofá Moderno 3 Lugares', short_description: 'Sofá confortável para sala de estar', description: 'Sofá moderno de 3 lugares em tecido suede, estrutura em madeira maciça', price: 1299.99, original_price: 1699.99, sku: 'SOF001', stock: 5, image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', category: 'Casa e Decoração', tag: 'promocao' },
      { title: 'Kit Maquiagem Completo', short_description: 'Kit completo com produtos de maquiagem', description: 'Kit com base, pó, batom, rímel, sombras e pincéis profissionais', price: 199.99, original_price: 299.99, sku: 'MAQ001', stock: 30, image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', category: 'Beleza e Saúde', tag: 'novo' },
      { title: 'Livro: Marketing Digital', short_description: 'Guia completo de marketing digital', description: 'Livro abrangente sobre estratégias de marketing digital e mídias sociais', price: 59.99, original_price: 79.99, sku: 'LIV001', stock: 40, image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', category: 'Livros', tag: 'promocao' },
      { title: 'Whey Protein Isolado', short_description: 'Suplemento proteico para atletas', description: 'Whey protein isolado com 90% de proteína, sabor chocolate, 2kg', price: 159.99, original_price: 199.99, sku: 'SUP001', stock: 20, image_url: 'https://images.unsplash.com/photo-1581368076903-c20fee986735?w=400', category: 'Esportes', tag: 'novo' },
      { title: 'Óleo de Coco Extravirgem', short_description: 'Óleo de coco puro e natural', description: 'Óleo de coco extravirgem prensado a frio, 500ml, para culinária e beleza', price: 29.99, original_price: 39.99, sku: 'ALI001', stock: 60, image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', category: 'Alimentos', tag: 'promocao' },
      { title: 'Pneu Aro 16 Michelin', short_description: 'Pneu de alta performance para automóveis', description: 'Pneu radial 205/55 R16 com tecnologia Michelin, alta durabilidade', price: 499.99, original_price: 599.99, sku: 'PNE001', stock: 12, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', category: 'Automotivo', tag: 'novo' },
      { title: 'Smartwatch Apple Watch Series 9', short_description: 'Relógio inteligente com GPS e monitoramento de saúde', description: 'Apple Watch Series 9 com tela Retina, GPS, monitoramento cardíaco e de sono', price: 2199.99, original_price: 2499.99, sku: 'WATCH001', stock: 18, image_url: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400', category: 'Eletrônicos', tag: 'promocao' },
      { title: 'Jaqueta Jeans Clássica', short_description: 'Jaqueta jeans atemporal e versátil', description: 'Jaqueta jeans 100% algodão, corte clássico, disponível em azul e preto', price: 179.99, original_price: 229.99, sku: 'JAQ001', stock: 35, image_url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400', category: 'Moda', tag: 'novo' }
    ];

    for (const product of productsData) {
      // Buscar o ID da categoria
      const categoryResult = await client.query('SELECT id FROM categories WHERE name = $1', [product.category]);
      const categoryId = categoryResult.rows[0]?.id || 1;

      await client.query(`
        INSERT INTO products (title, short_description, description, price, original_price, sku, stock, image_url, category_id, tag, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (sku) DO UPDATE SET
          title = EXCLUDED.title,
          short_description = EXCLUDED.short_description,
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          original_price = EXCLUDED.original_price,
          stock = EXCLUDED.stock,
          image_url = EXCLUDED.image_url,
          category_id = EXCLUDED.category_id,
          tag = EXCLUDED.tag,
          updated_at = CURRENT_TIMESTAMP
      `, [product.title, product.short_description, product.description, product.price, product.original_price, product.sku, product.stock, product.image_url, categoryId, product.tag, true]);
    }
    console.log('✅ Produtos de exemplo inseridos/atualizados');

    // Criar usuário admin
    const bcrypt = require('bcryptjs');
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    await client.query(`
      INSERT INTO users (email, password, first_name, last_name, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO UPDATE SET
        password = EXCLUDED.password,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active
    `, ['admin@fuseloja.com', adminPassword, 'Admin', 'FuseLoja', 'admin', true]);
    console.log('✅ Usuário admin criado/atualizado');

    console.log('🎉 Banco de dados inicializado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('✅ Inicialização concluída com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha na inicialização:', error);
      process.exit(1);
    });
}

module.exports = { initDatabase }; 