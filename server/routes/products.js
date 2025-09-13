
const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|glb|gltf|obj/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.includes('model');
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/products - Request received');
    console.log('Query params:', req.query);

    const {
      page = 1,
      limit = 12,
      category,
      brand,
      minPrice,
      maxPrice,
      skinType,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured
    } = req.query;

    const query = { isActive: true };

    // Apply filters
    if (category) query.category = category;
    if (brand) query.brand = new RegExp(brand, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (skinType) query.skinType = { $in: [skinType] };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    if (featured === 'true') query.isFeatured = true;

    console.log('MongoDB query:', JSON.stringify(query, null, 2));

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      populate: [
        { path: 'category', select: 'name slug' }
      ]
    };

    console.log('Query options:', options);

    const products = await Product.find(query)
      .populate(options.populate)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    console.log(`Found ${products.length} products`);

    const total = await Product.countDocuments(query);
    console.log(`Total products matching query: ${total}`);

    const response = {
      products,
      totalPages: Math.ceil(total / options.limit),
      currentPage: options.page,
      totalProducts: total
    };

    console.log('Sending response with', response.products.length, 'products');
    res.json(response);
  } catch (error) {
    console.error('Get products error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('reviews.user', 'firstName lastName avatar');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (Admin only)
router.post('/', adminAuth, upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'model3D', maxCount: 1 }
]), [
  body('name').trim().isLength({ min: 2 }).withMessage('Product name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').isMongoId().withMessage('Valid category is required'),
  body('brand').trim().isLength({ min: 2 }).withMessage('Brand is required'),
  body('sku').trim().isLength({ min: 3 }).withMessage('SKU is required')
], async (req, res) => {
  try {
    console.log('POST /api/products - Create product request received');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const productData = { ...req.body };
    console.log('Product data before processing:', productData);

    // Ensure required fields are properly formatted
    if (productData.skinType && typeof productData.skinType === 'string') {
      productData.skinType = productData.skinType.split(',').map(s => s.trim());
    }
    
    if (productData.tags && typeof productData.tags === 'string') {
      try {
        productData.tags = JSON.parse(productData.tags);
      } catch (e) {
        productData.tags = productData.tags.split(',').map(s => s.trim());
      }
    }

    if (productData.ingredients && typeof productData.ingredients === 'string') {
      productData.ingredients = productData.ingredients.split(',').map(s => s.trim());
    }

    // Parse variants if it's a string
    if (productData.variants && typeof productData.variants === 'string') {
      try {
        productData.variants = JSON.parse(productData.variants);
      } catch (e) {
        console.log('Failed to parse variants, setting to empty array');
        productData.variants = [];
      }
    }

    // Parse dimensions if it's a string
    if (productData.dimensions && typeof productData.dimensions === 'string') {
      try {
        productData.dimensions = JSON.parse(productData.dimensions);
      } catch (e) {
        console.log('Failed to parse dimensions, setting to empty object');
        productData.dimensions = {};
      }
    }

    // Handle image uploads
    if (req.files?.images) {
      console.log('Processing image uploads:', req.files.images.length);
      productData.images = req.files.images.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        alt: `${productData.name} image ${index + 1}`,
        isPrimary: index === 0
      }));
    }

    // Handle 3D model upload
    if (req.files?.model3D) {
      console.log('Processing 3D model upload');
      const model3DFile = req.files.model3D[0];
      productData.model3D = {
        url: `/uploads/products/${model3DFile.filename}`,
        format: path.extname(model3DFile.originalname).substring(1)
      };
    }

    console.log('Final product data:', productData);

    const product = new Product(productData);
    console.log('Product model created, attempting to save...');
    
    await product.save();
    console.log('Product saved successfully with ID:', product._id);

    // Update category product count
    if (productData.category) {
      console.log('Updating category product count for:', productData.category);
      await Category.findByIdAndUpdate(
        productData.category,
        { $inc: { productCount: 1 } }
      );
    }

    console.log('Product creation completed successfully');
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      console.log('Mongoose validation error details:', error.errors);
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    
    if (error.code === 11000) {
      console.log('Duplicate key error:', error.keyValue);
      return res.status(400).json({ 
        message: 'Product with this SKU already exists',
        field: 'sku'
      });
    }

    res.status(500).json({ 
      message: 'Server error during product creation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update product (Admin only)
router.put('/:id', adminAuth, upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'model3D', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('PUT /api/products/:id - Update product request received');
    console.log('Product ID:', req.params.id);
    console.log('Request body:', req.body);

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Current product status:', product.status);
    const updates = { ...req.body };
    console.log('Updates object:', updates);
    console.log('Status in updates:', updates.status);

    // Parse JSON string fields
    if (updates.variants && typeof updates.variants === 'string') {
      try {
        updates.variants = JSON.parse(updates.variants);
      } catch (e) {
        console.log('Failed to parse variants, setting to empty array');
        updates.variants = [];
      }
    }

    if (updates.dimensions && typeof updates.dimensions === 'string') {
      try {
        updates.dimensions = JSON.parse(updates.dimensions);
      } catch (e) {
        console.log('Failed to parse dimensions, setting to empty object');
        updates.dimensions = {};
      }
    }

    if (updates.tags && typeof updates.tags === 'string') {
      try {
        updates.tags = JSON.parse(updates.tags);
      } catch (e) {
        updates.tags = updates.tags.split(',').map(s => s.trim());
      }
    }

    // Handle new image uploads
    if (req.files?.images) {
      const newImages = req.files.images.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        alt: `${updates.name || product.name} image ${index + 1}`,
        isPrimary: index === 0 && !product.images.length
      }));
      updates.images = [...(product.images || []), ...newImages];
    }

    // Handle 3D model upload
    if (req.files?.model3D) {
      const model3DFile = req.files.model3D[0];
      updates.model3D = {
        url: `/uploads/products/${model3DFile.filename}`,
        format: path.extname(model3DFile.originalname).substring(1)
      };
    }

    console.log('Final updates before saving:', updates);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('category');

    console.log('Product updated successfully. New status:', updatedProduct.status);

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error during product update' });
  }
});

// Update product field (Admin only) - for quick updates like featured status
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle featured field mapping
    const updates = { ...req.body };
    if (updates.featured !== undefined) {
      updates.isFeatured = updates.featured;
      delete updates.featured;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Patch product error:', error);
    res.status(500).json({ message: 'Server error during product update' });
  }
});

// Delete product (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    // Update category product count
    await Category.findByIdAndUpdate(
      product.category,
      { $inc: { productCount: -1 } }
    );

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error during product deletion' });
  }
});

// Add product review
router.post('/:id/reviews', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.userId
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = {
      user: req.user.userId,
      rating: req.body.rating,
      comment: req.body.comment
    };

    product.reviews.push(review);
    product.calculateAverageRating();
    await product.save();

    res.status(201).json({
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete all products (Admin only)
router.delete('/bulk/all', adminAuth, async (req, res) => {
  try {
    const result = await Product.deleteMany({});
    
    // Reset all category product counts to 0
    await Category.updateMany({}, { productCount: 0 });

    res.json({ 
      message: 'All products deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Bulk delete products error:', error);
    res.status(500).json({ message: 'Server error during bulk deletion' });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(8)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
