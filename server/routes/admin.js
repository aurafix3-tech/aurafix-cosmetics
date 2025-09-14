const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const { adminAuth } = require('../middleware/auth');
const { validateCategory } = require('../middleware/validation');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/uploads/categories');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (JPEG, JPG, PNG, WebP, GIF)'));
    }
  },
});

// ======================
// CATEGORY ROUTES
// ======================

// Get all categories with optional filtering
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const { 
      search = '', 
      parent = null, 
      level = null, 
      isActive = null,
      sortBy = 'sortOrder',
      sortOrder = 1,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'seoTitle': { $regex: search, $options: 'i' } },
        { 'seoDescription': { $regex: search, $options: 'i' } }
      ];
    }

    // Parent filter
    if (parent === 'null' || parent === '') {
      query.parent = null;
    } else if (parent) {
      query.parent = parent;
    }

    // Level filter
    if (level) {
      query.level = parseInt(level);
    }

    // Active filter
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }

    const sort = {};
    sort[sortBy] = parseInt(sortOrder);

    const categories = await Category.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('parent', 'name slug')
      .lean();

    const total = await Category.countDocuments(query);

    res.json({
      success: true,
      data: categories,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get a single category by ID
router.get('/categories/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name slug')
      .populate('ancestors._id', 'name slug')
      .lean();

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Get all parent categories for the dropdown
    const parentCategories = await Category.find({
      _id: { $ne: category._id },
      $or: [
        { parent: null },
        { level: { $lt: 3 } } // Limit to 3 levels deep
      ]
    }).select('name slug level parent').lean();

    // Get subcategories count
    const subcategoriesCount = await Category.countDocuments({ parent: category._id });

    res.json({
      success: true,
      data: {
        ...category,
        subcategoriesCount,
        parentCategories
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new category
router.post('/categories', adminAuth, upload.single('image'), validateCategory, async (req, res) => {
  try {
    const { name, description, parent, isActive, sortOrder, seoTitle, seoDescription, isFeatured, displayInMenu } = req.body;
    
    // Check if category with the same name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ 
        success: false, 
        message: 'A category with this name already exists' 
      });
    }

    // Handle file upload
    let imageData = {};
    if (req.file) {
      imageData = {
        url: `/uploads/categories/${req.file.filename}`,
        alt: name
      };
    }

    const categoryData = {
      name,
      description,
      parent: parent || null,
      isActive: isActive !== 'false',
      sortOrder: sortOrder || 0,
      seoTitle: seoTitle || name,
      seoDescription: seoDescription || description.substring(0, 160),
      isFeatured: isFeatured === 'true',
      displayInMenu: displayInMenu !== 'false',
      ...(Object.keys(imageData).length > 0 && { image: imageData })
    };

    const category = new Category(categoryData);
    await category.save();

    // Populate the response
    const savedCategory = await Category.findById(category._id)
      .populate('parent', 'name slug')
      .lean();

    res.status(201).json({
      success: true,
      data: savedCategory,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Error creating category:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(__dirname, '../public', req.file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error creating category' 
    });
  }
});

// Update a category
router.put('/categories/:id', adminAuth, upload.single('image'), validateCategory, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      parent, 
      isActive, 
      sortOrder, 
      seoTitle, 
      seoDescription,
      isFeatured,
      displayInMenu
    } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if updating parent would create a circular reference
    if (parent && parent !== 'null') {
      if (parent === req.params.id) {
        return res.status(400).json({ 
          success: false, 
          message: 'A category cannot be its own parent' 
        });
      }

      // Check if the new parent is a descendant of this category
      const isDescendant = await isCategoryDescendant(parent, req.params.id);
      if (isDescendant) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot set a descendant category as parent' 
        });
      }
    }

    // Handle file upload
    if (req.file) {
      // Delete old image if it exists
      if (category.image && category.image.url) {
        const oldImagePath = path.join(__dirname, '../public', category.image.url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      category.image = {
        url: `/uploads/categories/${req.file.filename}`,
        alt: name || category.name
      };
    }

    // Update fields
    if (name) category.name = name;
    if (description) category.description = description;
    if (parent !== undefined) category.parent = parent === 'null' ? null : parent;
    if (isActive !== undefined) category.isActive = isActive === 'true';
    if (sortOrder !== undefined) category.sortOrder = sortOrder;
    if (seoTitle !== undefined) category.seoTitle = seoTitle;
    if (seoDescription !== undefined) category.seoDescription = seoDescription;
    if (isFeatured !== undefined) category.isFeatured = isFeatured === 'true';
    if (displayInMenu !== undefined) category.displayInMenu = displayInMenu !== 'false';

    await category.save();

    // Update all descendants if parent was changed
    if (req.body.parent !== undefined) {
      await Category.rebuildTree();
    }

    const updatedCategory = await Category.findById(category._id)
      .populate('parent', 'name slug')
      .populate('ancestors._id', 'name slug')
      .lean();

    res.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(__dirname, '../public', req.file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error updating category' 
    });
  }
});

// Delete a category
router.delete('/categories/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with associated products. Please remove or reassign products first.'
      });
    }

    // Check if category has subcategories
    const subcategoryCount = await Category.countDocuments({ parent: category._id });
    if (subcategoryCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories. Please delete or move subcategories first.'
      });
    }

    // Delete the category image if it exists
    if (category.image && category.image.url) {
      const imagePath = path.join(__dirname, '../public', category.image.url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await category.remove();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error deleting category' 
    });
  }
});

// Rebuild category hierarchy
router.post('/categories/rebuild-tree', adminAuth, async (req, res) => {
  try {
    await Category.rebuildTree();
    res.json({
      success: true,
      message: 'Category hierarchy rebuilt successfully'
    });
  } catch (error) {
    console.error('Error rebuilding category tree:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error rebuilding category tree' 
    });
  }
});

// Update product counts for all categories
router.post('/categories/update-product-counts', adminAuth, async (req, res) => {
  try {
    await Category.updateProductCounts();
    res.json({
      success: true,
      message: 'Product counts updated successfully'
    });
  } catch (error) {
    console.error('Error updating product counts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating product counts' 
    });
  }
});

// Helper function to check if a category is a descendant of another
async function isCategoryDescendant(parentId, childId) {
  const parent = await Category.findById(parentId);
  if (!parent) return false;
  
  // If the parent has no ancestors, it's not a descendant
  if (!parent.ancestors || parent.ancestors.length === 0) {
    return false;
  }
  
  // Check if the childId is in the parent's ancestors
  return parent.ancestors.some(ancestor => ancestor._id.toString() === childId);
}

// ======================
// DASHBOARD ROUTES
// ======================
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts,
      monthlyStats
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $in: ['delivered', 'shipped'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.find()
        .populate('user', 'firstName lastName')
        .populate('items.product', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      Product.aggregate([
        { $match: { isActive: true } },
        { $sort: { 'rating.average': -1, 'rating.count': -1 } },
        { $limit: 5 },
        { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category' } }
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
          }
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            orders: { $sum: 1 },
            revenue: { $sum: '$total' }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);

    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      recentOrders,
      topProducts,
      monthlyStats
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role
router.put('/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Analytics - Sales by category
router.get('/analytics/sales-by-category', adminAuth, async (req, res) => {
  try {
    const salesByCategory = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped'] } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category.name',
          totalSales: { $sum: '$items.total' },
          totalQuantity: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalSales: -1 } }
    ]);

    res.json(salesByCategory);
  } catch (error) {
    console.error('Sales by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Analytics - Revenue over time
router.get('/analytics/revenue', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let groupBy;
    switch (period) {
      case 'day':
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        break;
      case 'week':
        groupBy = { $dateToString: { format: '%Y-%U', date: '$createdAt' } };
        break;
      case 'month':
      default:
        groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        break;
    }

    const revenueData = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped'] } } },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json(revenueData);
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Inventory alerts
router.get('/inventory/alerts', adminAuth, async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      stock: { $lte: 10 },
      isActive: true
    })
    .populate('category', 'name')
    .sort({ stock: 1 })
    .limit(20);

    const outOfStockProducts = await Product.find({
      stock: 0,
      isActive: true
    })
    .populate('category', 'name')
    .limit(10);

    res.json({
      lowStock: lowStockProducts,
      outOfStock: outOfStockProducts
    });
  } catch (error) {
    console.error('Inventory alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk operations
router.post('/products/bulk-update', adminAuth, async (req, res) => {
  try {
    const { productIds, updates } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'Product IDs array is required' });
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      updates
    );

    res.json({
      message: `${result.modifiedCount} products updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
