const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { 
  getAllOrders, 
  getDeliveryPartners, 
  getLiveStats,
  assignDeliveryPartner,
  getAdminDashboardData
} = require('../controllers/adminController');

const router = express.Router();

router.use(auth);
router.use(authorize('admin'));

router.get('/orders', getAllOrders);
router.get('/delivery-partners', getDeliveryPartners);
router.get('/live-stats', getLiveStats);
router.put('/orders/:id/assign', assignDeliveryPartner);
router.get('/dashboard-data', getAdminDashboardData);

module.exports = router;