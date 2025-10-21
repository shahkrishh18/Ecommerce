const Order = require('../models/Order');
const User = require('../models/User');

// Get specific order for delivery partner
exports.getDeliveryOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      deliveryPartner: req.user.id
    })
    .populate('customer', 'profile phone')
    .populate('items.product', 'name images')
    .populate('deliveryPartner', 'profile');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not assigned to you'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// Get delivery partner stats
exports.getDeliveryStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's delivered orders count
    const deliveriesToday = await Order.countDocuments({
      deliveryPartner: req.user.id,
      status: 'delivered',
      updatedAt: { $gte: today }
    });

    // Calculate today's earnings (mock calculation - adjust based on your business logic)
    const todayEarnings = deliveriesToday * 8.50; // $8.50 per delivery

    // Get delivery partner's rating
    const deliveryPartner = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      stats: {
        deliveriesToday,
        todayEarnings,
        rating: deliveryPartner.deliveryDetails?.rating || 4.9
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update delivery status
// Add this to your deliveryController.js if missing
exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      deliveryPartner: req.user.id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not assigned to you'
      });
    }

    // Validate status transitions for delivery partners
    const validTransitions = {
      'assigned': ['picked_up'],
      'picked_up': ['in_transit'],
      'in_transit': ['delivered', 'failed'],
      'delivered': [],
      'failed': []
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${order.status} to ${status}`
      });
    }

    // Update order status
    order.status = status;
    
    // Add to status history
    order.statusHistory.push({
      status,
      note: note || `Status updated to ${status} by delivery partner`,
      updatedBy: req.user.id
    });

    // Set timestamps for specific statuses
    if (status === 'picked_up') {
      order.preparationTime = Math.floor((new Date() - order.createdAt) / 60000);
    } else if (status === 'delivered') {
      order.actualDelivery = new Date();
      order.deliveryTime = Math.floor((new Date() - order.updatedAt) / 60000);
      
      // Mark delivery partner as available again
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user.id, {
        'deliveryDetails.isAvailable': true
      });
    }

    await order.save();
    await order.populate('customer', 'profile');
    await order.populate('items.product', 'name images');
    await order.populate('deliveryPartner', 'profile');

    // Emit real-time update to order room and admin room
    req.app.get('io').to(`order_${order._id}`).emit('orderUpdated', order);
    req.app.get('io').to('admin_room').emit('orderUpdated', order);

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// Get current delivery order status
exports.getDeliveryStatus = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      deliveryPartner: req.user.id
    })
    .populate('customer', 'profile')
    .populate('items.product', 'name images')
    .select('orderId status deliveryAddress statusHistory estimatedDelivery');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not assigned to you'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

exports.acceptOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify the order is still locked by this user
    if (!order.isLocked || order.lockedBy.toString() !== req.user.id) {
      return res.status(409).json({
        success: false,
        message: 'Order lock expired or invalid. Please try accepting again.'
      });
    }

    if (order.deliveryPartner) {
      return res.status(400).json({
        success: false,
        message: 'Order already assigned'
      });
    }

    const User = require('../models/User');

    // Assign current delivery partner
    order.deliveryPartner = req.user.id;
    order.status = 'assigned';
    
    // Release the lock
    order.isLocked = false;
    order.lockedBy = undefined;
    order.lockedAt = undefined;
    order.lockExpiresAt = undefined;
    
    order.statusHistory.push({
      status: 'assigned',
      note: `Accepted by delivery partner`,
      updatedBy: req.user.id
    });

    // Mark delivery partner as unavailable
    await User.findByIdAndUpdate(req.user.id, {
      'deliveryDetails.isAvailable': false
    });

    await order.save();
    await order.populate('customer', 'profile');
    await order.populate('items.product', 'name images');

    // Emit real-time update
    req.app.get('io').to(`order_${order._id}`).emit('orderUpdated', order);
    req.app.get('io').emit('orderAssigned', { orderId: order._id });
    req.app.get('io').emit('orderLockReleased', { orderId: order._id });

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};