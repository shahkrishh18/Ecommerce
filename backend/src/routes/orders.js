const express = require('express');
const { 
  createOrder, 
  getOrders, 
  getOrder, 
  updateOrderStatus,
  assignDeliveryPartner,
  getUnassignedOrders
} = require('../controllers/orderController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.route('/')
  .post(authorize('customer'), createOrder)
  .get(getOrders);

router.get('/unassigned', authorize('delivery', 'admin'), getUnassignedOrders);

router.route('/:id')
  .get(getOrder)
  .put(updateOrderStatus);

router.put('/:id/assign', authorize('admin'), assignDeliveryPartner);

module.exports = router;