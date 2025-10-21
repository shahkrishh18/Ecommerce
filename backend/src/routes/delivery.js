// const express = require('express');
// const { auth, authorize } = require('../middleware/auth');
// const { getDeliveryOrder, getDeliveryStats, updateDeliveryStatus, getDeliveryStatus } = require('../controllers/deliveryController');

// const router = express.Router();

// router.use(auth);
// router.use(authorize('delivery'));

// router.get('/order/:id', getDeliveryOrder);
// router.get('/stats', getDeliveryStats);
// router.put('/status/:id', updateDeliveryStatus);
// router.get('/stats', getDeliveryStats);

// module.exports = router;

const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { lockOrder, releaseOrderLock } = require('../middleware/orderLock');
const { 
  getDeliveryOrder, 
  getDeliveryStats, 
  updateDeliveryStatus,
  getDeliveryStatus,
  acceptOrder
} = require('../controllers/deliveryController');

const router = express.Router();

router.use(auth);
router.use(authorize('delivery'));

router.get('/order/:id', getDeliveryOrder);
router.get('/status/:id', getDeliveryStatus);
router.get('/stats', getDeliveryStats); // ✅ Fixed: Only one stats route

// Lock order first, then accept
router.post('/:id/lock', lockOrder, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Order locked successfully',
    lockExpiresIn: 120 // 2 minutes in seconds
  });
});

router.post('/:id/accept', lockOrder, acceptOrder, releaseOrderLock);
router.put('/:id/status', updateDeliveryStatus); // ✅ Fixed: Added missing function

module.exports = router;