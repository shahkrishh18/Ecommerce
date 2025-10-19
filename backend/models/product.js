import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  unit: { type: String },
  stock: { type: Number, default: 0 }
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;