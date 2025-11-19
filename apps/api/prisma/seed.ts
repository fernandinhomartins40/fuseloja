/**
 * Database Seed
 * Populates database with initial data
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data (optional, be careful in production!)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.address.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleaned existing data');

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@fuseloja.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'FuseLoja',
      phone: '11999999999',
      role: 'ADMIN',
      isActive: true,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('👤 Created admin user:', adminUser.email);

  // Create Regular User
  const userHashedPassword = await bcrypt.hash('user123', 10);
  const regularUser = await prisma.user.create({
    data: {
      email: 'user@fuseloja.com',
      password: userHashedPassword,
      firstName: 'João',
      lastName: 'Silva',
      phone: '11988888888',
      cpf: '12345678901',
      role: 'USER',
      isActive: true,
    },
  });

  console.log('👤 Created regular user:', regularUser.email);

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Eletrônicos',
        slug: 'eletronicos',
        description: 'Produtos eletrônicos e gadgets',
        icon: 'Laptop',
        color: '#3B82F6',
        iconColor: '#FFFFFF',
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Moda',
        slug: 'moda',
        description: 'Roupas, calçados e acessórios',
        icon: 'ShoppingBag',
        color: '#EC4899',
        iconColor: '#FFFFFF',
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Casa e Decoração',
        slug: 'casa-e-decoracao',
        description: 'Produtos para casa e decoração',
        icon: 'Home',
        color: '#8B5CF6',
        iconColor: '#FFFFFF',
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Esportes',
        slug: 'esportes',
        description: 'Artigos esportivos e fitness',
        icon: 'Dumbbell',
        color: '#10B981',
        iconColor: '#FFFFFF',
        sortOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Livros',
        slug: 'livros',
        description: 'Livros e e-books',
        icon: 'Book',
        color: '#F59E0B',
        iconColor: '#FFFFFF',
        sortOrder: 5,
      },
    }),
  ]);

  console.log(`📁 Created ${categories.length} categories`);

  // Create Products
  const products = await Promise.all([
    // Eletrônicos
    prisma.product.create({
      data: {
        title: 'Smartphone Samsung Galaxy S23',
        slug: 'smartphone-samsung-galaxy-s23',
        shortDescription: 'Smartphone top de linha com câmera profissional',
        description: 'O Samsung Galaxy S23 oferece o melhor em tecnologia móvel, com processador de última geração, câmera de alta qualidade e design premium.',
        price: 3499.00,
        originalPrice: 4299.00,
        costPrice: 2800.00,
        sku: 'SAMGS23-128-BLK',
        barcode: '7891234567890',
        stock: 50,
        minStock: 10,
        categoryId: categories[0].id,
        tag: 'PROMOCAO',
        isFeatured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
              alt: 'Samsung Galaxy S23 - Frente',
              isPrimary: true,
              sortOrder: 1,
            },
            {
              url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
              alt: 'Samsung Galaxy S23 - Traseira',
              isPrimary: false,
              sortOrder: 2,
            },
          ],
        },
        specifications: {
          create: [
            { name: 'Tela', value: '6.1" Dynamic AMOLED' },
            { name: 'Processador', value: 'Snapdragon 8 Gen 2' },
            { name: 'RAM', value: '8GB' },
            { name: 'Armazenamento', value: '128GB' },
            { name: 'Câmera', value: 'Tripla 50MP + 12MP + 10MP' },
            { name: 'Bateria', value: '3900mAh' },
          ],
        },
        variants: {
          create: [
            { name: 'Cor', value: 'Preto', priceAdjustment: 0 },
            { name: 'Cor', value: 'Branco', priceAdjustment: 0 },
            { name: 'Cor', value: 'Verde', priceAdjustment: 50 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: 'Notebook Dell Inspiron 15',
        slug: 'notebook-dell-inspiron-15',
        shortDescription: 'Notebook para trabalho e estudos',
        description: 'Notebook Dell Inspiron 15 com processador Intel Core i5, 8GB RAM e SSD de 256GB. Ideal para trabalho, estudos e entretenimento.',
        price: 2899.00,
        originalPrice: 3499.00,
        sku: 'DELL-I15-I5-8GB',
        stock: 30,
        minStock: 5,
        categoryId: categories[0].id,
        tag: 'PROMOCAO',
        isFeatured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
              alt: 'Dell Inspiron 15',
              isPrimary: true,
              sortOrder: 1,
            },
          ],
        },
        specifications: {
          create: [
            { name: 'Processador', value: 'Intel Core i5 11ª Geração' },
            { name: 'RAM', value: '8GB DDR4' },
            { name: 'Armazenamento', value: 'SSD 256GB' },
            { name: 'Tela', value: '15.6" Full HD' },
            { name: 'Placa de Vídeo', value: 'Intel UHD Graphics' },
          ],
        },
      },
    }),
    // Moda
    prisma.product.create({
      data: {
        title: 'Camiseta Básica Premium',
        slug: 'camiseta-basica-premium',
        shortDescription: 'Camiseta de algodão 100% premium',
        description: 'Camiseta básica de alta qualidade, feita em algodão 100% premium. Confortável e durável.',
        price: 79.90,
        originalPrice: 129.90,
        sku: 'CAM-BAS-001',
        stock: 200,
        minStock: 50,
        categoryId: categories[1].id,
        tag: 'NOVO',
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
              alt: 'Camiseta Básica Premium',
              isPrimary: true,
              sortOrder: 1,
            },
          ],
        },
        specifications: {
          create: [
            { name: 'Material', value: '100% Algodão' },
            { name: 'Lavagem', value: 'Máquina de lavar' },
            { name: 'Modelagem', value: 'Regular' },
          ],
        },
        variants: {
          create: [
            { name: 'Tamanho', value: 'P', stockAdjustment: 0 },
            { name: 'Tamanho', value: 'M', stockAdjustment: 0 },
            { name: 'Tamanho', value: 'G', stockAdjustment: 0 },
            { name: 'Tamanho', value: 'GG', stockAdjustment: 0 },
            { name: 'Cor', value: 'Branco', priceAdjustment: 0 },
            { name: 'Cor', value: 'Preto', priceAdjustment: 0 },
            { name: 'Cor', value: 'Azul', priceAdjustment: 10 },
          ],
        },
      },
    }),
    // Casa e Decoração
    prisma.product.create({
      data: {
        title: 'Jogo de Cama Queen 4 Peças',
        slug: 'jogo-de-cama-queen-4-pecas',
        shortDescription: 'Jogo de cama premium 100% algodão',
        description: 'Jogo de cama queen size completo com 4 peças, confeccionado em 100% algodão de alta qualidade. Inclui lençol, fronha e edredom.',
        price: 299.90,
        originalPrice: 499.90,
        sku: 'JDC-QUEEN-001',
        stock: 45,
        minStock: 10,
        categoryId: categories[2].id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
              alt: 'Jogo de Cama Queen',
              isPrimary: true,
              sortOrder: 1,
            },
          ],
        },
        specifications: {
          create: [
            { name: 'Tamanho', value: 'Queen (1,60m x 2,00m)' },
            { name: 'Material', value: '100% Algodão' },
            { name: 'Peças', value: '4 peças' },
            { name: 'Fios', value: '200 fios' },
          ],
        },
      },
    }),
    // Esportes
    prisma.product.create({
      data: {
        title: 'Tênis Running Nike Air Zoom',
        slug: 'tenis-running-nike-air-zoom',
        shortDescription: 'Tênis profissional para corrida',
        description: 'Tênis Nike Air Zoom desenvolvido para corrida de alta performance. Tecnologia de amortecimento e suporte para os pés.',
        price: 599.90,
        originalPrice: 799.90,
        sku: 'NIKE-AZ-RUN-42',
        stock: 60,
        minStock: 15,
        categoryId: categories[3].id,
        tag: 'PROMOCAO',
        isFeatured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
              alt: 'Tênis Nike Air Zoom',
              isPrimary: true,
              sortOrder: 1,
            },
          ],
        },
        specifications: {
          create: [
            { name: 'Marca', value: 'Nike' },
            { name: 'Tecnologia', value: 'Air Zoom' },
            { name: 'Material', value: 'Mesh respirável' },
            { name: 'Solado', value: 'Borracha antiderrapante' },
          ],
        },
        variants: {
          create: [
            { name: 'Tamanho', value: '38', stockAdjustment: 0 },
            { name: 'Tamanho', value: '39', stockAdjustment: 0 },
            { name: 'Tamanho', value: '40', stockAdjustment: 0 },
            { name: 'Tamanho', value: '41', stockAdjustment: 0 },
            { name: 'Tamanho', value: '42', stockAdjustment: 0 },
            { name: 'Tamanho', value: '43', stockAdjustment: 0 },
          ],
        },
      },
    }),
    // Livros
    prisma.product.create({
      data: {
        title: 'Clean Code - Código Limpo',
        slug: 'clean-code-codigo-limpo',
        shortDescription: 'Habilidades Práticas do Agile Software',
        description: 'Um dos livros mais importantes sobre desenvolvimento de software. Aprenda a escrever código limpo e manutenível.',
        price: 89.90,
        originalPrice: 119.90,
        sku: 'BOOK-CC-001',
        barcode: '9788576082675',
        stock: 100,
        minStock: 20,
        categoryId: categories[4].id,
        tag: 'NOVO',
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
              alt: 'Clean Code',
              isPrimary: true,
              sortOrder: 1,
            },
          ],
        },
        specifications: {
          create: [
            { name: 'Autor', value: 'Robert C. Martin' },
            { name: 'Editora', value: 'Alta Books' },
            { name: 'Páginas', value: '425' },
            { name: 'Idioma', value: 'Português' },
            { name: 'Ano', value: '2009' },
          ],
        },
      },
    }),
  ]);

  console.log(`📦 Created ${products.length} products`);

  // Create Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Maria Santos',
        phone: '11987654321',
        email: 'maria.santos@email.com',
        cpf: '98765432100',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Pedro Oliveira',
        phone: '11976543210',
        email: 'pedro.oliveira@email.com',
      },
    }),
  ]);

  console.log(`👥 Created ${customers.length} customers`);

  // Create Sample Order
  const order = await prisma.order.create({
    data: {
      orderNumber: '2024010001',
      userId: regularUser.id,
      customerId: customers[0].id,
      customerName: customers[0].name,
      customerEmail: customers[0].email,
      customerPhone: customers[0].phone,
      subtotal: 3578.90,
      discount: 0,
      shipping: 50.00,
      total: 3628.90,
      status: 'PROCESSING',
      paymentMethod: 'PIX',
      shippingMethod: 'SEDEX',
      items: {
        create: [
          {
            productId: products[0].id,
            productName: products[0].title,
            productSku: products[0].sku,
            quantity: 1,
            unitPrice: 3499.00,
            subtotal: 3499.00,
            discount: 0,
            total: 3499.00,
          },
          {
            productId: products[2].id,
            productName: products[2].title,
            productSku: products[2].sku,
            quantity: 1,
            unitPrice: 79.90,
            subtotal: 79.90,
            discount: 0,
            total: 79.90,
          },
        ],
      },
    },
    include: {
      items: true,
    },
  });

  console.log(`🛒 Created sample order: ${order.orderNumber}`);

  console.log('✅ Database seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`  - Users: 2 (1 admin, 1 user)`);
  console.log(`  - Categories: ${categories.length}`);
  console.log(`  - Products: ${products.length}`);
  console.log(`  - Customers: ${customers.length}`);
  console.log(`  - Orders: 1`);
  console.log('\n🔐 Admin Credentials:');
  console.log(`  Email: admin@fuseloja.com`);
  console.log(`  Password: admin123`);
  console.log('\n👤 User Credentials:');
  console.log(`  Email: user@fuseloja.com`);
  console.log(`  Password: user123`);
}

main()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
