const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aurafix');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@aurafix.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Created admin user');

    // Create sample customer
    const customer = new User({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'password123',
      role: 'customer'
    });
    await customer.save();
    console.log('Created sample customer');

    // Create categories
    const categories = [
      {
        name: 'Skincare',
        description: 'Premium skincare products for all skin types',
        slug: 'skincare'
      },
      {
        name: 'Makeup',
        description: 'High-quality makeup and cosmetics',
        slug: 'makeup'
      },
      {
        name: 'Fragrance',
        description: 'Luxury fragrances and perfumes',
        slug: 'fragrance'
      },
      {
        name: 'Hair Care',
        description: 'Professional hair care products',
        slug: 'hair-care'
      }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('Created categories');

    // Create sample products
    const products = [
      {
        name: 'Hydrating Face Serum',
        description: 'A powerful hydrating serum with hyaluronic acid and vitamin C. Perfect for all skin types, this lightweight formula absorbs quickly and provides long-lasting moisture.',
        shortDescription: 'Powerful hydrating serum with hyaluronic acid and vitamin C for all skin types.',
        price: 89.99,
        comparePrice: 120.00,
        sku: 'HFS-001',
        stock: 50,
        category: createdCategories[0]._id,
        subcategory: 'Serums',
        brand: 'AuraFix',
        tags: ['skincare', 'serum', 'hydrating', 'vitamin-c'],
        images: [
          { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500', alt: 'Hydrating Face Serum', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500', alt: 'Serum texture', isPrimary: false }
        ],
        variants: [
          { 
            name: 'Size', 
            options: [
              { value: '30ml', price: 0, stock: 30, sku: 'HFS-001-30' },
              { value: '50ml', price: 20, stock: 20, sku: 'HFS-001-50' }
            ]
          }
        ],
        skinType: ['all'],
        ingredients: ['Hyaluronic Acid', 'Vitamin C', 'Niacinamide', 'Peptides'],
        howToUse: 'Apply 2-3 drops to clean face morning and evening. Follow with moisturizer.',
        seoTitle: 'Best Hydrating Face Serum - AuraFix',
        seoDescription: 'Transform your skin with our premium hydrating face serum. Contains hyaluronic acid and vitamin C for radiant, youthful skin.'
      },
      {
        name: 'Matte Liquid Lipstick',
        description: 'Long-lasting matte liquid lipstick with intense color payoff. Comfortable formula that doesn\'t dry out your lips.',
        shortDescription: 'Long-lasting matte liquid lipstick with intense color payoff.',
        price: 24.99,
        comparePrice: 35.00,
        sku: 'MLL-002',
        stock: 75,
        category: createdCategories[1]._id,
        subcategory: 'Lipstick',
        brand: 'AuraFix',
        tags: ['makeup', 'lipstick', 'matte', 'long-lasting'],
        images: [
          { url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500', alt: 'Matte Liquid Lipstick', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500', alt: 'Lipstick swatches', isPrimary: false }
        ],
        variants: [
          { 
            name: 'Color', 
            options: [
              { value: 'Ruby Red', price: 0, stock: 25, sku: 'MLL-002-RR' },
              { value: 'Berry Bliss', price: 0, stock: 25, sku: 'MLL-002-BB' },
              { value: 'Nude Rose', price: 0, stock: 25, sku: 'MLL-002-NR' }
            ]
          }
        ],
        skinType: ['all'],
        ingredients: ['Dimethicone', 'Isododecane', 'Cyclopentasiloxane', 'Vitamin E'],
        howToUse: 'Apply directly to lips starting from the center and working outward.'
      },
      {
        name: 'Luxury Eau de Parfum',
        description: 'An enchanting fragrance with notes of jasmine, vanilla, and sandalwood. Perfect for special occasions or everyday elegance.',
        shortDescription: 'Enchanting fragrance with jasmine, vanilla, and sandalwood notes.',
        price: 149.99,
        comparePrice: 200.00,
        sku: 'LEP-003',
        stock: 30,
        category: createdCategories[2]._id,
        subcategory: 'Eau de Parfum',
        brand: 'AuraFix',
        tags: ['fragrance', 'perfume', 'luxury', 'floral'],
        images: [
          { url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500', alt: 'Luxury Eau de Parfum', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=500', alt: 'Perfume bottle detail', isPrimary: false }
        ],
        variants: [
          { 
            name: 'Size', 
            options: [
              { value: '50ml', price: 0, stock: 20, sku: 'LEP-003-50' },
              { value: '100ml', price: 50, stock: 10, sku: 'LEP-003-100' }
            ]
          }
        ],
        skinType: ['all'],
        ingredients: ['Alcohol Denat', 'Parfum', 'Aqua', 'Benzyl Salicylate'],
        howToUse: 'Spray on pulse points such as wrists, neck, and behind ears.'
      },
      {
        name: 'Nourishing Hair Mask',
        description: 'Deep conditioning hair mask enriched with argan oil and keratin. Repairs damaged hair and adds incredible shine.',
        shortDescription: 'Deep conditioning hair mask with argan oil and keratin.',
        price: 39.99,
        comparePrice: 55.00,
        sku: 'NHM-004',
        stock: 40,
        category: createdCategories[3]._id,
        subcategory: 'Hair Masks',
        brand: 'AuraFix',
        tags: ['hair-care', 'mask', 'nourishing', 'argan-oil'],
        images: [
          { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', alt: 'Nourishing Hair Mask', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500', alt: 'Hair mask texture', isPrimary: false }
        ],
        skinType: ['all'],
        ingredients: ['Argan Oil', 'Keratin', 'Shea Butter', 'Coconut Oil'],
        howToUse: 'Apply to damp hair, leave for 10-15 minutes, then rinse thoroughly.'
      },
      {
        name: 'Vitamin C Brightening Cream',
        description: 'Brightening day cream with 20% vitamin C complex. Reduces dark spots and evens skin tone for a radiant complexion.',
        shortDescription: 'Brightening day cream with 20% vitamin C complex.',
        price: 69.99,
        sku: 'VCC-005',
        stock: 35,
        category: createdCategories[0]._id,
        subcategory: 'Day Creams',
        brand: 'AuraFix',
        tags: ['skincare', 'vitamin-c', 'brightening', 'day-cream'],
        images: [
          { url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', alt: 'Vitamin C Brightening Cream', isPrimary: true }
        ],
        skinType: ['all'],
        ingredients: ['Vitamin C', 'Hyaluronic Acid', 'Niacinamide', 'Sunflower Oil'],
        howToUse: 'Apply to clean face every morning. Follow with sunscreen.'
      },
      {
        name: 'Professional Makeup Brush Set',
        description: 'Complete 12-piece makeup brush set with synthetic bristles. Includes all essential brushes for face and eye makeup.',
        shortDescription: 'Complete 12-piece makeup brush set with synthetic bristles.',
        price: 79.99,
        comparePrice: 120.00,
        sku: 'MBS-006',
        stock: 25,
        category: createdCategories[1]._id,
        subcategory: 'Brushes & Tools',
        brand: 'AuraFix',
        tags: ['makeup', 'brushes', 'professional', 'set'],
        images: [
          { url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500', alt: 'Professional Makeup Brush Set', isPrimary: true }
        ],
        skinType: ['all'],
        howToUse: 'Use appropriate brush for each makeup step. Clean regularly with brush cleanser.'
      }
    ];

    await Product.insertMany(products);
    console.log('Created sample products');

    console.log('\n✅ Sample data created successfully!');
    console.log('\n📧 Admin Login:');
    console.log('Email: admin@aurafix.com');
    console.log('Password: admin123');
    console.log('\n👤 Customer Login:');
    console.log('Email: jane@example.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
