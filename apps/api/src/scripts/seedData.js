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
      // Inserir categorias com ícones e cores
      const categories = [
        { name: 'Eletrônicos', description: 'Smartphones, tablets, notebooks e acessórios', image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', icon: 'Smartphone', color: '#3B82F6', icon_color: '#FFFFFF', slug: 'eletronicos' },
        { name: 'Moda', description: 'Roupas, calçados e acessórios para todos os estilos', image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', icon: 'Shirt', color: '#EC4899', icon_color: '#FFFFFF', slug: 'moda' },
        { name: 'Casa e Jardim', description: 'Decoração, móveis e utensílios para o lar', image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', icon: 'Home', color: '#10B981', icon_color: '#FFFFFF', slug: 'casa-e-jardim' },
        { name: 'Esportes', description: 'Equipamentos e roupas esportivas', image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', icon: 'Activity', color: '#EF4444', icon_color: '#FFFFFF', slug: 'esportes' },
        { name: 'Livros', description: 'Livros físicos e digitais de todas as categorias', image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', icon: 'BookOpen', color: '#8B5CF6', icon_color: '#FFFFFF', slug: 'livros' },
        { name: 'Beleza e Saúde', description: 'Produtos de beleza, cosméticos e suplementos', image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', icon: 'Heart', color: '#F59E0B', icon_color: '#FFFFFF', slug: 'beleza-e-saude' }
      ];

      for (const category of categories) {
        await query(
          'INSERT INTO categories (name, description, image_url, icon, color, icon_color, slug) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [category.name, category.description, category.image_url, category.icon, category.color, category.icon_color, category.slug]
        );
      }
      console.log(`✅ ${categories.length} categorias criadas`);
    }

    // 2. Verificar se já existem produtos
    const existingProducts = await query('SELECT COUNT(*) FROM products');
    if (parseInt(existingProducts.rows[0].count) > 0) {
      console.log('⏭️ Produtos já existem, pulando criação...');
    } else {
      // Buscar categorias para usar seus IDs
      const categoriesResult = await query('SELECT id, name FROM categories ORDER BY id');
      const categoriesList = categoriesResult.rows;

      if (categoriesList.length === 0) {
        console.log('⚠️ Nenhuma categoria encontrada, pulando criação de produtos');
        return;
      }

      // Produtos de exemplo
      const products = [
        {
          title: 'Smartphone Galaxy Pro',
          short_description: 'Smartphone com 128GB de armazenamento e câmera de 48MP',
          description: 'Smartphone top de linha com tela de 6.5 polegadas, processador octa-core, 8GB de RAM e 128GB de armazenamento. Câmera principal de 48MP com IA para fotos profissionais.',
          price: 1299.99,
          original_price: 1599.99,
          sku: 'SMRT-001',
          stock: 25,
          category_name: 'Eletrônicos',
          tag: 'promocao',
          image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
        },
        {
          title: 'Notebook Gamer Ultra',
          short_description: 'Notebook para jogos com placa de vídeo dedicada',
          description: 'Notebook gamer com processador Intel i7, 16GB RAM, SSD 512GB e placa de vídeo GeForce RTX. Ideal para jogos e trabalho profissional.',
          price: 3499.99,
          original_price: null,
          sku: 'NB-GAMER-001',
          stock: 8,
          category_name: 'Eletrônicos',
          tag: 'novo',
          image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400'
        },
        {
          title: 'Camiseta Básica Algodão',
          short_description: 'Camiseta 100% algodão disponível em várias cores',
          description: 'Camiseta de algodão premium, confortável e durável. Disponível em diversas cores e tamanhos. Ideal para o dia a dia.',
          price: 49.99,
          original_price: 79.99,
          sku: 'CAM-ALG-001',
          stock: 150,
          category_name: 'Moda',
          tag: 'promocao',
          image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
        },
        {
          title: 'Tênis Esportivo Running',
          short_description: 'Tênis profissional para corrida e caminhada',
          description: 'Tênis desenvolvido especialmente para corrida, com amortecimento avançado e solado antiderrapante. Conforto garantido para longas distâncias.',
          price: 299.99,
          original_price: null,
          sku: 'TEN-RUN-001',
          stock: 45,
          category_name: 'Esportes',
          tag: 'exclusivo',
          image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
        },
        {
          title: 'Kit Jardinagem Completo',
          short_description: 'Kit com ferramentas essenciais para jardinagem',
          description: 'Kit completo com pá, rastelo, regador, luvas e tesoura de poda. Tudo que você precisa para cuidar do seu jardim.',
          price: 159.99,
          original_price: 199.99,
          sku: 'JARD-KIT-001',
          stock: 30,
          category_name: 'Casa e Jardim',
          tag: 'promocao',
          image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'
        },
        {
          title: 'Livro: Programação Web Moderna',
          short_description: 'Guia completo de desenvolvimento web com React e Node.js',
          description: 'Livro abrangente sobre desenvolvimento web moderno, cobrindo React, Node.js, bancos de dados e deploy. Ideal para iniciantes e profissionais.',
          price: 89.99,
          original_price: null,
          sku: 'LIV-PROG-001',
          stock: 75,
          category_name: 'Livros',
          tag: 'novo',
          image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
        }
      ];

      let productsCreated = 0;
      for (const product of products) {
        try {
          // Encontrar categoria
          const category = categoriesList.find(cat => cat.name === product.category_name);
          if (!category) {
            console.log(`⚠️ Categoria '${product.category_name}' não encontrada para produto '${product.title}'`);
            continue;
          }

          await query(
            `INSERT INTO products (title, short_description, description, price, original_price, sku, stock, category_id, tag, image_url, is_active) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)`,
            [
              product.title,
              product.short_description,
              product.description,
              product.price,
              product.original_price,
              product.sku,
              product.stock,
              category.id,
              product.tag,
              product.image_url
            ]
          );
          productsCreated++;
        } catch (error) {
          console.log(`⚠️ Erro ao criar produto '${product.title}':`, error.message);
        }
      }
      console.log(`✅ ${productsCreated} produtos criados`);
    }

    console.log('🎉 Seed do banco de dados concluído com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro durante seed do banco:', error);
    throw error;
  }
};

// Export the function
module.exports = { seedData };

// Run directly if called as script
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('✅ Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}