import express from 'express';
import Product from '../models/product.js'; // Adjust path as needed

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products from the database
// @access  Public
router.get('/', async (req, res) => {
  try {
    // 1. Fetch all products from the MongoDB 'products' collection
    const products = await Product.find({});

    // 2. Send the products back as a JSON response
    res.json(products);

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// You can add more routes here later, like getting a single product:
// router.get('/:id', async (req, res) => { ... });

export default router;