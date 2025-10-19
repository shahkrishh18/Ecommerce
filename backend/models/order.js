import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ productId: String, name: String, qty: Number, price: Number }],
  total: Number,
  status: { type: String, enum: ['PENDING','ASSIGNED','PICKED','ON_THE_WAY','DELIVERED','CANCELLED'], default: 'PENDING' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  pickupLocation: String,
  dropLocation: String
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
