const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const { adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer configuration for category images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/categories/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { includeInactive = false } = req.query;
    
    const query = includeInactive === 'true' ? {} : { isActive: true };
    
    const categories = await Category.find(query)
      .populate('parent', 'name slug')
      .sort({ sortOrder: 1, name: 1 });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name slug');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create category (Admin only)
router.post('/', adminAuth, upload.single('image'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Category name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const categoryData = req.body;

    // Handle image upload
    if (req.file) {
      categoryData.image = {
        url: `/uploads/categories/${req.file.filename}`,
        alt: `${categoryData.name} category image`
      };
    }

    // Parse subcategories if provided as string
    if (typeof categoryData.subcategories === 'string') {
      categoryData.subcategories = categoryData.subcategories.split(',').map(s => s.trim());
    }

    const category = new Category(categoryData);
    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Category name already exists' });
    } else {
      res.status(500).json({ message: 'Server error during category creation' });
    }
  }
});

// Update category (Admin only)
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updates = req.body;

    // Handle image upload
    if (req.file) {
      updates.image = {
        url: `/uploads/categories/${req.file.filename}`,
        alt: `${updates.name || category.name} category image`
      };
    }

    // Parse subcategories if provided as string
    if (typeof updates.subcategories === 'string') {
      updates.subcategories = updates.subcategories.split(',').map(s => s.trim());
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('parent', 'name slug');

    res.json({
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    console.error('Update category error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Category name already exists' });
    } else {
      res.status(500).json({ message: 'Server error during category update' });
    }
  }
});

// Delete category (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has products
    if (category.productCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with existing products. Please move or delete products first.' 
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error during category deletion' });
  }
});

// Get category tree (hierarchical structure)
router.get('/tree/structure', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 });

    // Build tree structure
    const categoryMap = {};
    const tree = [];

    // First pass: create map
    categories.forEach(cat => {
      categoryMap[cat._id] = { ...cat.toObject(), children: [] };
    });

    // Second pass: build tree
    categories.forEach(cat => {
      if (cat.parent) {
        if (categoryMap[cat.parent]) {
          categoryMap[cat.parent].children.push(categoryMap[cat._id]);
        }
      } else {
        tree.push(categoryMap[cat._id]);
      }
    });

    res.json(tree);
  } catch (error) {
    console.error('Get category tree error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
