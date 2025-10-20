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
  category: {
    type: String,
    required: true,
    enum: ['groceries', 'electronics', 'clothing', 'pharmacy', 'home', 'other']
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
  cost: {
    type: Number,
    min: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  trackQuantity: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  images: [String],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  vendor: String,
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  seo: {
    title: String,
    description: String
  },
  salesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text' 
});

productSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);