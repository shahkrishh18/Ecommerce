const express = require('express');
const authRoutes = require('./auth');
const orderRoutes = require('./orders');
const productRoutes = require('./products');
const deliveryRoutes = require('./delivery')

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);
router.use('/delivery', deliveryRoutes)

module.exports = router;