const { body, param, query } = require('express-validator');
const Category = require('../models/Category');

// Common validation middleware for category operations
exports.validateCategory = [
  // Name validation
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 50 }).withMessage('Category name cannot exceed 50 characters')
    .custom(async (value, { req }) => {
      // Skip if we're updating and name hasn't changed
      if (req.method === 'PUT' && req.params.id) {
        const category = await Category.findById(req.params.id);
        if (category && category.name === value) {
          return true;
        }
      }
      
      // Check for duplicate category name
      const existingCategory = await Category.findOne({ 
        name: new RegExp(`^${value}$`, 'i'),
        ...(req.params.id ? { _id: { $ne: req.params.id } } : {})
      });
      
      if (existingCategory) {
        throw new Error('A category with this name already exists');
      }
      return true;
    }),
    
  // Description validation
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    
  // Parent validation
  body('parent')
    .optional({ checkFalsy: true })
    .isMongoId().withMessage('Invalid parent category ID')
    .custom(async (value, { req }) => {
      if (value && value === req.params.id) {
        throw new Error('A category cannot be its own parent');
      }
      return true;
    }),
    
  // SEO fields
  body('seoTitle')
    .optional()
    .trim()
    .isLength({ max: 60 }).withMessage('SEO title cannot exceed 60 characters'),
    
  body('seoDescription')
    .optional()
    .trim()
    .isLength({ max: 160 }).withMessage('SEO description cannot exceed 160 characters'),
    
  // Boolean fields
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
  body('displayInMenu').optional().isBoolean().withMessage('displayInMenu must be a boolean'),
  
  // Numeric fields
  body('sortOrder')
    .optional()
    .isInt({ min: -100, max: 100 }).withMessage('Sort order must be between -100 and 100'),
    
  // Custom fields
  body('customFields')
    .optional()
    .isObject().withMessage('Custom fields must be an object')
    .custom(fields => {
      if (fields) {
        for (const [key, value] of Object.entries(fields)) {
          if (typeof value !== 'string') {
            throw new Error(`Custom field '${key}' must be a string`);
          }
        }
      }
      return true;
    })
];

// Validation for category ID in params
exports.validateCategoryId = [
  param('id')
    .notEmpty().withMessage('Category ID is required')
    .isMongoId().withMessage('Invalid category ID')
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        throw new Error('Category not found');
      }
      return true;
    })
];

// Validation for category list query parameters
exports.validateCategoryListQuery = [
  query('search').optional().trim(),
  query('parent')
    .optional()
    .customSanitizer(value => value === 'null' ? null : value)
    .isMongoId().withMessage('Invalid parent category ID'),
  query('level')
    .optional()
    .isInt({ min: 1, max: 3 }).withMessage('Level must be between 1 and 3'),
  query('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean')
    .toBoolean(),
  query('sortBy')
    .optional()
    .isIn(['name', 'sortOrder', 'createdAt', 'productCount']).withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['1', '-1']).withMessage('Sort order must be 1 (ascending) or -1 (descending)')
    .toInt(),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt()
];

// Validation for image upload
exports.validateImageUpload = (req, res, next) => {
  if (!req.file) {
    return next();
  }
  
  // Check file type
  const filetypes = /jpeg|jpg|png|webp|gif/;
  const extname = filetypes.test(path.extname(req.file.originalname).toLowerCase());
  const mimetype = filetypes.test(req.file.mimetype);
  
  if (!mimetype || !extname) {
    // Delete the uploaded file if it's not an image
    fs.unlinkSync(req.file.path);
    return next(new Error('Only image files are allowed (JPEG, JPG, PNG, WebP, GIF)'));
  }
  
  next();
};

// Error formatter for validation errors
exports.validationErrorFormatter = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Middleware to check if category can be deleted
exports.validateCategoryDeletion = async (req, res, next) => {
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
    
    req.category = category;
    next();
  } catch (error) {
    console.error('Error validating category deletion:', error);
    res.status(500).json({ success: false, message: 'Server error during category validation' });
  }
};
