const Order = require('../models/Order');

// Lock order for a delivery partner
exports.lockOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order is already locked by someone else
    if (order.isLocked && order.lockedBy.toString() !== req.user.id) {
      const lockTimeLeft = Math.max(0, order.lockExpiresAt - new Date());
      return res.status(423).json({
        success: false,
        message: 'Order is currently being accepted by another delivery partner',
        lockTimeLeft: Math.ceil(lockTimeLeft / 1000)
      });
    }

    // Lock the order for this user (2 minutes expiry)
    order.isLocked = true;
    order.lockedBy = req.user.id;
    order.lockedAt = new Date();
    order.lockExpiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
    
    await order.save();

    next();
  } catch (error) {
    next(error);
  }
};

// Release order lock
exports.releaseOrderLock = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (order && order.isLocked && order.lockedBy.toString() === req.user.id) {
      order.isLocked = false;
      order.lockedBy = undefined;
      order.lockedAt = undefined;
      order.lockExpiresAt = undefined;
      await order.save();
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Cleanup expired locks
exports.cleanupExpiredLocks = async () => {
  try {
    const result = await Order.updateMany(
      { 
        isLocked: true, 
        lockExpiresAt: { $lt: new Date() } 
      },
      {
        $set: {
          isLocked: false,
          lockedBy: null,
          lockedAt: null,
          lockExpiresAt: null
        }
      }
    );
    console.log(`Cleaned up ${result.modifiedCount} expired locks`);
  } catch (error) {
    console.error('Error cleaning up expired locks:', error);
  }
};