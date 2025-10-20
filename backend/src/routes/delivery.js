const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { getDeliveryOrder, getDeliveryStats, updateDeliveryStatus, getDeliveryStatus } = require('../controllers/deliveryController');

const router = express.Router();

router.use(auth);
router.use(authorize('delivery'));

router.get('/order/:id', getDeliveryOrder);
router.get('/stats', getDeliveryStats);
router.put('/status/:id', updateDeliveryStatus);
router.get('/stats', getDeliveryStats);

module.exports = router;