const express = require('express');
const authRoutes = require('./auth');
const orderRoutes = require('./orders');
const productRoutes = require('./products');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);

module.exports = router;