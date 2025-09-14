const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    url: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    }
  },
  icon: {
    type: String,
    default: 'tag'
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
    index: true
  },
  ancestors: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    name: String,
    slug: String
  }],
  level: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seoTitle: {
    type: String,
    maxlength: [60, 'SEO title cannot exceed 60 characters']
  },
  seoDescription: {
    type: String,
    maxlength: [160, 'SEO description cannot exceed 160 characters']
  },
  productCount: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  displayInMenu: {
    type: Boolean,
    default: true
  },
  customFields: {
    type: Map,
    of: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
  justOne: false
});

// Indexes
categorySchema.index({ name: 'text', description: 'text' });
categorySchema.index({ parent: 1, sortOrder: 1 });
categorySchema.index({ level: 1, isActive: 1 });

// Generate slug from name and handle hierarchy
categorySchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    // Generate slug from name
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // replace spaces with -
      .replace(/--+/g, '-') // replace multiple - with single -
      .trim();
  }

  // Handle parent/child relationships
  if (this.isModified('parent') || this.isNew) {
    if (this.parent) {
      // If this is a subcategory, get parent details
      const parentCategory = await this.constructor.findById(this.parent);
      if (parentCategory) {
        this.level = parentCategory.level + 1;
        this.ancestors = [
          ...(parentCategory.ancestors || []),
          {
            _id: parentCategory._id,
            name: parentCategory.name,
            slug: parentCategory.slug
          }
        ];
      }
    } else {
      // This is a root category
      this.level = 1;
      this.ancestors = [];
    }
  }
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  }
  next();
});

// Update product counts when category is removed
categorySchema.pre('remove', async function(next) {
  // Remove all subcategories
  await this.model('Category').deleteMany({ parent: this._id });
  
  // Update products to remove this category
  await this.model('Product').updateMany(
    { category: this._id },
    { $unset: { category: 1 } }
  );
  
  next();
});

// Rebuild the category hierarchy
categorySchema.statics.rebuildTree = async function() {
  const categories = await this.find({});
  
  for (const category of categories) {
    if (category.parent) {
      const parent = await this.findById(category.parent);
      if (parent) {
        category.level = parent.level + 1;
        category.ancestors = [
          ...(parent.ancestors || []),
          {
            _id: parent._id,
            name: parent.name,
            slug: parent.slug
          }
        ];
        await category.save();
      }
    } else if (category.level !== 1) {
      category.level = 1;
      category.ancestors = [];
      await category.save();
    }
  }
};

// Update product counts
categorySchema.statics.updateProductCounts = async function() {
  const results = await this.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'category',
        as: 'products'
      }
    },
    {
      $project: {
        name: 1,
        productCount: { $size: '$products' }
      }
    }
  ]);

  const bulkOps = results.map(({ _id, productCount }) => ({
    updateOne: {
      filter: { _id },
      update: { productCount }
    }
  }));

  if (bulkOps.length > 0) {
    await this.bulkWrite(bulkOps);
  }
};

module.exports = mongoose.model('Category', categorySchema);
