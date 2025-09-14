const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

async function migrateProductImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://aurafix:honeywellT55$@cluster0.y6e7drb.mongodb.net/aurafix?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find all products with old image paths
    const products = await Product.find({
      $or: [
        { 'images.url': { $regex: '^/uploads/products/' } },
        { 'images.url': { $regex: '^uploads/products/' } }
      ]
    });

    console.log(`Found ${products.length} products with old image paths`);

    let updatedCount = 0;

    for (const product of products) {
      let hasChanges = false;
      
      // Update image URLs
      if (product.images && product.images.length > 0) {
        product.images = product.images.map(image => {
          if (image.url && (image.url.startsWith('/uploads/products/') || image.url.startsWith('uploads/products/'))) {
            const filename = image.url.split('/').pop();
            image.url = `/uploads/products/${filename}`;
            hasChanges = true;
          }
          return image;
        });
      }

      // Update model3D URL if it exists
      if (product.model3D && product.model3D.url && 
          (product.model3D.url.startsWith('/uploads/products/') || product.model3D.url.startsWith('uploads/products/'))) {
        const filename = product.model3D.url.split('/').pop();
        product.model3D.url = `/uploads/products/${filename}`;
        hasChanges = true;
      }

      if (hasChanges) {
        await product.save();
        updatedCount++;
        console.log(`Updated product: ${product.name}`);
      }
    }

    console.log(`Migration completed. Updated ${updatedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error('Error migrating product images:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  migrateProductImages();
}

module.exports = { migrateProductImages };
