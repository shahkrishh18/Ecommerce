const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['customer', 'delivery', 'admin'],
    required: true
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String
  },
  // Customer specific fields
  customerDetails: {
    addresses: [{
      type: {
        type: String,
        enum: ['home', 'work', 'other'],
        default: 'home'
      },
      street: String,
      city: String,
      state: String,
      zipCode: String,
      isDefault: Boolean
    }],
    preferences: {
      notifications: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false }
    }
  },
  // Delivery partner specific fields
  deliveryDetails: {
    vehicleType: {
      type: String,
      enum: ['bike', 'scooter', 'car', 'bicycle']
    },
    vehicleNumber: String,
    licenseNumber: String,
    isAvailable: { type: Boolean, default: true },
    currentLocation: {
      lat: Number,
      lng: Number
    },
    rating: { type: Number, default: 0 },
    totalDeliveries: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);