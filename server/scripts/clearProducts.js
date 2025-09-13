const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

const clearAllProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aurafix');
    console.log('Connected to MongoDB');

    // Get count before deletion
    const productCount = await Product.countDocuments();
    console.log(`Found ${productCount} products to delete`);

    if (productCount === 0) {
      console.log('No products found in database');
      process.exit(0);
    }

    // Delete all products
    const result = await Product.deleteMany({});
    console.log(`Deleted ${result.deletedCount} products`);

    // Reset all category product counts to 0
    await Category.updateMany({}, { productCount: 0 });
    console.log('Reset all category product counts to 0');

    console.log('✅ All products have been successfully removed from the database');
    console.log('You can now add your own products through the admin dashboard');

  } catch (error) {
    console.error('❌ Error clearing products:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the script
clearAllProducts();
