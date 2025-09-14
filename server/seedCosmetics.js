const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const makeupApiService = require('./services/makeupApi');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://aurafix:honeywellT55$@cluster0.y6e7drb.mongodb.net/aurafix?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create categories for cosmetic products
const createCategories = async () => {
  const categories = [
    {
      name: 'Face',
      slug: 'face',
      description: 'Foundation, concealer, powder, and face makeup',
      image: '/images/categories/face.jpg',
      parentCategory: null,
      isActive: true
    },
    {
      name: 'Eyes',
      slug: 'eyes',
      description: 'Eyeshadow, mascara, eyeliner, and eye makeup',
      image: '/images/categories/eyes.jpg',
      parentCategory: null,
      isActive: true
    },
    {
      name: 'Lips',
      slug: 'lips',
      description: 'Lipstick, lip gloss, lip liner, and lip care',
      image: '/images/categories/lips.jpg',
      parentCategory: null,
      isActive: true
    },
    {
      name: 'Nails',
      slug: 'nails',
      description: 'Nail polish, nail care, and nail art',
      image: '/images/categories/nails.jpg',
      parentCategory: null,
      isActive: true
    },
    {
      name: 'Cheeks',
      slug: 'cheeks',
      description: 'Blush, bronzer, highlighter, and contouring',
      image: '/images/categories/cheeks.jpg',
      parentCategory: null,
      isActive: true
    }
  ];

  const createdCategories = {};
  
  for (const categoryData of categories) {
    try {
      let category = await Category.findOne({ slug: categoryData.slug });
      if (!category) {
        category = new Category(categoryData);
        await category.save();
        console.log(`Created category: ${category.name}`);
      }
      createdCategories[categoryData.slug] = category._id;
    } catch (error) {
      console.error(`Error creating category ${categoryData.name}:`, error);
    }
  }
  
  return createdCategories;
};

// Map product types to categories
const mapProductTypeToCategory = (productType, categories) => {
  const typeMap = {
    'foundation': categories.face,
    'concealer': categories.face,
    'powder': categories.face,
    'blush': categories.cheeks,
    'bronzer': categories.cheeks,
    'highlighter': categories.cheeks,
    'contour': categories.cheeks,
    'eyeshadow': categories.eyes,
    'eyeliner': categories.eyes,
    'mascara': categories.eyes,
    'eyebrow': categories.eyes,
    'lipstick': categories.lips,
    'lip_liner': categories.lips,
    'lip_gloss': categories.lips,
    'nail_polish': categories.nails
  };
  
  return typeMap[productType] || categories.face; // Default to face category
};

// Seed products from Makeup API
const seedProducts = async () => {
  try {
    console.log('Starting cosmetic products seeding...');
    
    // Connect to database
    await connectDB();
    
    // Create categories
    console.log('Creating categories...');
    const categories = await createCategories();
    
    // Clear existing products (optional - comment out if you want to keep existing products)
    console.log('Clearing existing products...');
    await Product.deleteMany({ apiSource: 'makeup-api' });
    
    // Fetch products from Makeup API
    console.log('Fetching products from Makeup API...');
    const apiProducts = await makeupApiService.getAllProducts();
    console.log(`Found ${apiProducts.length} products from Makeup API`);
    
    // Transform and save products
    let savedCount = 0;
    let errorCount = 0;
    
    for (const apiProduct of apiProducts) {
      try {
        // Skip products without names or images
        if (!apiProduct.name || !apiProduct.image_link) {
          continue;
        }
        
        // Transform the product
        const transformedProduct = makeupApiService.transformProduct(apiProduct);
        
        // Set category based on product type
        transformedProduct.category = mapProductTypeToCategory(apiProduct.product_type, categories);
        
        // Create and save the product
        const product = new Product(transformedProduct);
        await product.save();
        
        savedCount++;
        console.log(`Saved product: ${product.name} (${savedCount}/${apiProducts.length})`);
        
        // Add a small delay to avoid overwhelming the database
        if (savedCount % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (error) {
        errorCount++;
        console.error(`Error saving product ${apiProduct.name}:`, error.message);
      }
    }
    
    console.log(`\n✅ Seeding completed!`);
    console.log(`📊 Successfully saved: ${savedCount} products`);
    console.log(`❌ Errors: ${errorCount} products`);
    console.log(`📁 Categories created: ${Object.keys(categories).length}`);
    
    // Display some statistics
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    
    console.log(`\n📈 Database Statistics:`);
    console.log(`Total products: ${totalProducts}`);
    console.log(`Total categories: ${totalCategories}`);
    
    // Show products by category
    for (const [categorySlug, categoryId] of Object.entries(categories)) {
      const count = await Product.countDocuments({ category: categoryId });
      console.log(`${categorySlug}: ${count} products`);
    }
    
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the seeding script
if (require.main === module) {
  seedProducts();
}

module.exports = { seedProducts, createCategories };
