const express = require('express');
const { 
  createOrder, 
  getOrders, 
  getOrder, 
  updateOrderStatus,
  assignDeliveryPartner,
  getUnassignedOrders,
  acceptOrder
} = require('../controllers/orderController');

const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.route('/')
  .post(authorize('customer'), createOrder)
  .get(getOrders);

router.get('/unassigned', authorize('delivery', 'admin'), getUnassignedOrders);

router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);

router.put('/:id/assign', authorize('admin'), assignDeliveryPartner);
router.post('/:id/accept', authorize('delivery'), acceptOrder);

module.exports = router;