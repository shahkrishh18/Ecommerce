const express = require('express');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getCategories
} = require('../controllers/productController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

// Protected routes
router.use(auth);

router.post('/', authorize('admin'), createProduct);
router.put('/:id', authorize('admin'), updateProduct);
router.delete('/:id', authorize('admin'), deleteProduct);

module.exports = router;