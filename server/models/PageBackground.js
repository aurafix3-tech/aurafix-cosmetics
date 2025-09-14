const mongoose = require('mongoose');

const pageBackgroundSchema = new mongoose.Schema({
  pageName: {
    type: String,
    required: true,
    enum: ['home', 'products', 'contact', 'about', 'loading'],
    unique: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  mediaUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String // For video thumbnails
  },
  alt: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  overlayOpacity: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.3
  },
  overlayColor: {
    type: String,
    default: '#000000'
  },
  position: {
    type: String,
    enum: ['center', 'top', 'bottom', 'left', 'right', 'cover', 'contain'],
    default: 'cover'
  },
  duration: {
    type: Number, // For loading screen duration in milliseconds
    default: 2000
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

pageBackgroundSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PageBackground', pageBackgroundSchema);
