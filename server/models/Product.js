const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  model3D: {
    url: String,
    format: {
      type: String,
      enum: ['glb', 'gltf', 'obj'],
      default: 'glb'
    }
  },
  variants: [{
    name: String, // e.g., "Color", "Size", "Shade"
    options: [{
      value: String, // e.g., "Red", "Large", "Fair"
      price: Number,
      stock: Number,
      sku: String,
      image: String
    }]
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  ingredients: [String],
  howToUse: String,
  skinType: [{
    type: String,
    enum: ['oily', 'dry', 'combination', 'sensitive', 'normal', 'all']
  }],
  tags: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    verified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  seoTitle: String,
  seoDescription: String,
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text',
  tags: 'text'
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
    return;
  }
  
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.rating.average = sum / this.reviews.length;
  this.rating.count = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);
