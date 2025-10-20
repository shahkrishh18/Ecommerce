const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled', 'failed'],
    default: 'pending'
  },
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deliveryAddress: {
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    street: String,
    city: String,
    state: String,
    zipCode: String,
    instructions: String
  },
  customerLocation: {
    lat: Number,
    lng: Number
  },
  deliveryLocation: {
    lat: Number,
    lng: Number
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'digital_wallet'],
    default: 'card'
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  preparationTime: Number, // in minutes
  deliveryTime: Number, // in minutes
  rating: {
    score: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: Date
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Generate order ID before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderId = `QC${timestamp}${random}`;
    
    // Add initial status to history
    this.statusHistory.push({
      status: this.status,
      note: 'Order created'
    });
  }
  next();
});

// Update status history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      note: `Status updated to ${this.status}`
    });
  }
  next();
});

// Indexes for performance
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ deliveryPartner: 1, status: 1 });
orderSchema.index({ status: 1, createdAt: 1 });
orderSchema.index({ 'deliveryLocation': '2dsphere' });

module.exports = mongoose.model('Order', orderSchema);