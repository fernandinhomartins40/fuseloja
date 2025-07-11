require('dotenv').config();
const { query } = require('../database/connection');

const seedData = async () => {
  try {
    console.log('🌱 Populando banco de dados com dados de teste...');

    // 1. Verificar se já existem categorias
    const existingCategories = await query('SELECT COUNT(*) FROM categories');
    if (parseInt(existingCategories.rows[0].count) > 0) {
      console.log('⏭️ Categorias já existem, pulando criação...');
    } else {
      // Inserir categorias
      const categories = [
        { name: 'Eletrônicos', description: 'Smartphones, tablets, notebooks e acessórios', image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
        { name: 'Moda', description: 'Roupas, calçados e acessórios para todos os estilos', image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400' },
        { name: 'Casa e Jardim', description: 'Decoração, móveis e utensílios para o lar', image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' },
        { name: 'Esportes', description: 'Equipamentos e roupas esportivas', image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
        { name: 'Livros', description: 'Livros físicos e digitais de todas as categorias', image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400' },
        { name: 'Beleza', description: 'Cosméticos, perfumes e produtos de cuidado pessoal', image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
        { name: 'Automóveis', description: 'Peças, acessórios e equipamentos automotivos', image_url: 'https://images.unsplash.com/photo-1494976688153-ca3ce87638e4?w=400' },
        { name: 'Brinquedos', description: 'Brinquedos e jogos para todas as idades', image_url: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=400' }
      ];

      for (const category of categories) {
        await query(
          'INSERT INTO categories (name, description, image_url) VALUES ($1, $2, $3)',
          [category.name, category.description, category.image_url]
        );
      }
      console.log(`✅ ${categories.length} categorias criadas`);
    }

    // 2. Verificar se já existem produtos
    const existingProducts = await query('SELECT COUNT(*) FROM products');
    if (parseInt(existingProducts.rows[0].count) > 0) {
      console.log('⏭️ Produtos já existem, pulando criação...');
    } else {
      // Buscar IDs das categorias criadas
      const categoriesResult = await query('SELECT id, name FROM categories ORDER BY id');
      const categoryMap = {};
      categoriesResult.rows.forEach(cat => {
        categoryMap[cat.name] = cat.id;
      });

      // Inserir produtos de exemplo
      const products = [
        // Eletrônicos
        {
          title: 'iPhone 15 Pro Max 256GB',
          short_description: 'O mais avançado iPhone com câmera de 48MP e chip A17 Pro',
          description: 'iPhone 15 Pro Max com tela Super Retina XDR de 6,7 polegadas, sistema de câmera Pro com teleobjetiva 5x, chip A17 Pro, botão Ação e design em titânio.',
          price: 8999.99,
          original_price: 9999.99,
          sku: 'APL-IPH15PM-256',
          stock: 25,
          image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
          category_id: categoryMap['Eletrônicos'],
          tag: 'novo'
        },
        {
          title: 'Samsung Galaxy S24 Ultra',
          short_description: 'Galaxy S24 Ultra com S Pen integrada e câmera de 200MP',
          description: 'Samsung Galaxy S24 Ultra com tela Dynamic AMOLED 2X de 6,8 polegadas, câmera principal de 200MP, S Pen integrada e processador Snapdragon 8 Gen 3.',
          price: 7499.99,
          original_price: 8299.99,
          sku: 'SAM-GS24U-512',
          stock: 18,
          image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600',
          category_id: categoryMap['Eletrônicos'],
          tag: 'promocao'
        },
        {
          title: 'MacBook Air M3 13"',
          short_description: 'MacBook Air com chip M3, 8GB RAM e 256GB SSD',
          description: 'MacBook Air de 13 polegadas com chip M3, 8GB de memória unificada, SSD de 256GB, tela Liquid Retina e até 18 horas de duração da bateria.',
          price: 10999.99,
          sku: 'APL-MBA13-M3',
          stock: 12,
          image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
          category_id: categoryMap['Eletrônicos'],
          tag: 'novo'
        },

        // Moda
        {
          title: 'Tênis Nike Air Max 270',
          short_description: 'Tênis Nike Air Max 270 com máximo conforto e estilo',
          description: 'Tênis Nike Air Max 270 com a maior unidade Air Max até hoje, proporcionando amortecimento e conforto excepcionais para o dia todo.',
          price: 599.99,
          original_price: 799.99,
          sku: 'NIK-AM270-42',
          stock: 50,
          image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
          category_id: categoryMap['Moda'],
          tag: 'promocao'
        },
        {
          title: 'Jaqueta Jeans Vintage',
          short_description: 'Jaqueta jeans vintage com lavagem especial',
          description: 'Jaqueta jeans vintage com lavagem stone wash, corte moderno e detalhes em couro sintético. Perfeita para looks casuais.',
          price: 189.99,
          sku: 'MOD-JJV-M',
          stock: 30,
          image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600',
          category_id: categoryMap['Moda'],
          tag: 'exclusivo'
        },

        // Casa e Jardim
        {
          title: 'Sofá 3 Lugares Reclinável',
          short_description: 'Sofá 3 lugares com sistema de reclinação e tecido suede',
          description: 'Sofá 3 lugares com sistema de reclinação elétrica, revestimento em tecido suede anti-manchas, pés em madeira maciça.',
          price: 2499.99,
          original_price: 2999.99,
          sku: 'MOV-SOF3R-BEG',
          stock: 8,
          image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
          category_id: categoryMap['Casa e Jardim'],
          tag: 'promocao'
        },
        {
          title: 'Kit Panelas Antiaderente 5 Peças',
          short_description: 'Kit completo de panelas antiaderente com revestimento cerâmico',
          description: 'Kit com 5 panelas antiaderente com revestimento cerâmico, cabos ergonômicos e tampas de vidro temperado.',
          price: 299.99,
          sku: 'CAS-KPAN5-PRT',
          stock: 40,
          image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
          category_id: categoryMap['Casa e Jardim']
        },

        // Esportes
        {
          title: 'Bicicleta Mountain Bike Aro 29',
          short_description: 'Mountain bike aro 29 com suspensão dianteira e 21 marchas',
          description: 'Mountain bike aro 29 com quadro em alumínio, suspensão dianteira, câmbio Shimano de 21 velocidades e freios V-brake.',
          price: 1299.99,
          sku: 'ESP-MTB29-AZ',
          stock: 15,
          image_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600',
          category_id: categoryMap['Esportes'],
          tag: 'novo'
        },

        // Livros
        {
          title: 'Clean Code - Código Limpo',
          short_description: 'Habilidades Práticas do Agile Software por Robert C. Martin',
          description: 'Clean Code é um guia essencial para desenvolvedores que querem escrever código mais limpo, legível e manutenível.',
          price: 89.99,
          sku: 'LIV-CC-PT',
          stock: 100,
          image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
          category_id: categoryMap['Livros']
        },

        // Beleza
        {
          title: 'Kit Skincare Completo',
          short_description: 'Kit completo para cuidados com a pele com 5 produtos',
          description: 'Kit skincare com cleanser, tônico, sérum vitamina C, hidratante e protetor solar FPS 60.',
          price: 249.99,
          original_price: 349.99,
          sku: 'BEL-SKIN5-UNI',
          stock: 35,
          image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
          category_id: categoryMap['Beleza'],
          tag: 'promocao'
        }
      ];

      for (const product of products) {
        await query(
          `INSERT INTO products 
           (title, short_description, description, price, original_price, sku, stock, image_url, category_id, tag) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            product.title,
            product.short_description,
            product.description,
            product.price,
            product.original_price || null,
            product.sku,
            product.stock,
            product.image_url,
            product.category_id,
            product.tag || null
          ]
        );
      }
      console.log(`✅ ${products.length} produtos criados`);
    }

    // 3. Verificar se já existem pedidos de exemplo
    const existingOrders = await query('SELECT COUNT(*) FROM orders');
    if (parseInt(existingOrders.rows[0].count) > 0) {
      console.log('⏭️ Pedidos já existem, pulando criação...');
    } else {
      // Criar alguns pedidos de exemplo
      const orders = [
        {
          customer_name: 'João Silva',
          customer_phone: '(11) 99999-1111',
          customer_email: 'joao.silva@email.com',
          items: JSON.stringify([
            { id: '1', title: 'iPhone 15 Pro Max 256GB', price: 8999.99, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600' }
          ]),
          total: 8999.99,
          status: 'pending'
        },
        {
          customer_name: 'Maria Santos',
          customer_phone: '(11) 99999-2222',
          customer_email: 'maria.santos@email.com',
          items: JSON.stringify([
            { id: '4', title: 'Tênis Nike Air Max 270', price: 599.99, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' },
            { id: '5', title: 'Jaqueta Jeans Vintage', price: 189.99, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600' }
          ]),
          total: 1389.97,
          status: 'processing'
        },
        {
          customer_name: 'Pedro Costa',
          customer_phone: '(11) 99999-3333',
          customer_email: 'pedro.costa@email.com',
          items: JSON.stringify([
            { id: '6', title: 'Sofá 3 Lugares Reclinável', price: 2499.99, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600' }
          ]),
          total: 2499.99,
          status: 'shipped'
        }
      ];

      for (const order of orders) {
        await query(
          `INSERT INTO orders 
           (customer_name, customer_phone, customer_email, items, total, status) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            order.customer_name,
            order.customer_phone,
            order.customer_email,
            order.items,
            order.total,
            order.status
          ]
        );
      }
      console.log(`✅ ${orders.length} pedidos de exemplo criados`);
    }

    console.log('🎉 Dados de teste inseridos com sucesso!');
    console.log('\n📊 Resumo dos dados:');
    
    const categoriesCount = await query('SELECT COUNT(*) FROM categories');
    const productsCount = await query('SELECT COUNT(*) FROM products');
    const ordersCount = await query('SELECT COUNT(*) FROM orders');
    
    console.log(`📁 Categorias: ${categoriesCount.rows[0].count}`);
    console.log(`📦 Produtos: ${productsCount.rows[0].count}`);
    console.log(`🛒 Pedidos: ${ordersCount.rows[0].count}`);

  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
    throw error;
  }
};

module.exports = { seedData };

// Executar se chamado diretamente
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('✅ Script executado com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro:', error);
      process.exit(1);
    });
}