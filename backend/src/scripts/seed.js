require('dotenv').config();
const { query } = require('../database/connection');

const SEED_CONFIG = {
    categories: 5,
    productsPerCategory: 10,
};

// Helper function to get a random item from an array
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seedDatabase() {
    console.log('🌱 Starting database seeding (without Faker)...');

    try {
        // 1. Seed Categories
        console.log('Creating categories...');
        const categories = [];
        const categoryNames = ['Smartphones', 'Notebooks', 'Fones de Ouvido', 'Acessórios', 'Smartwatches'];
        for (const name of categoryNames) {
            const res = await query(
                'INSERT INTO categories (name, description, image_url) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING RETURNING id',
                [name, `Descrição para ${name}`, `https://placehold.co/600x400/purple/white?text=${name}`]
            );
            if (res.rows[0]) {
                categories.push(res.rows[0].id);
            }
        }
        if (categories.length === 0) {
            const existingCategories = await query('SELECT id FROM categories LIMIT $1', [SEED_CONFIG.categories]);
            existingCategories.rows.forEach(c => categories.push(c.id));
        }
        console.log(`✅ ${categories.length} categories created or found.`);

        // 2. Seed Products
        console.log('Creating products...');
        let productsCreated = 0;
        const productAdjectives = ['Premium', 'Pro', 'Basic', 'Compacto', 'Ultra', 'Gamer'];
        const productTags = ['promocao', 'novo', null, 'exclusivo'];

        for (const categoryId of categories) {
            for (let i = 0; i < SEED_CONFIG.productsPerCategory; i++) {
                const adj = getRandomItem(productAdjectives);
                const title = `Produto ${adj} ${productsCreated + 1}`;
                const price = Math.floor(Math.random() * (2000 - 50 + 1)) + 50;
                const originalPrice = Math.random() > 0.5 ? price * 1.25 : null;

                await query(
                    `INSERT INTO products (title, short_description, description, price, original_price, sku, stock, image_url, category_id, tag)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (sku) DO NOTHING`,
                    [
                        title,
                        `Descrição curta para ${title}`,
                        `Descrição completa e detalhada para ${title}. Este produto é de alta qualidade.`,
                        price,
                        originalPrice,
                        `SKU-STATIC-${Date.now()}-${productsCreated}`,
                        Math.floor(Math.random() * 101),
                        `https://placehold.co/600x400/orange/white?text=${title.replace(' ', '+')}`,
                        categoryId,
                        getRandomItem(productTags),
                    ]
                );
                productsCreated++;
            }
        }
        console.log(`✅ ${productsCreated} products created.`);

        console.log('🌳 Database seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error during database seeding:', error);
    }
}

if (require.main === module) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = { seedDatabase }; 