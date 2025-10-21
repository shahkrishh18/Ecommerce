const Order = require('../models/Order');
const User = require('../models/User');

// Get all orders for admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('customer', 'profile')
      .populate('deliveryPartner', 'profile')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// Get all delivery partners
exports.getDeliveryPartners = async (req, res, next) => {
  try {
    const deliveryPartners = await User.find({ 
      role: 'delivery',
      isActive: true 
    })
    .select('profile deliveryDetails createdAt lastLogin')
    .sort({ 'deliveryDetails.totalDeliveries': -1 });

    res.status(200).json({
      success: true,
      count: deliveryPartners.length,
      deliveryPartners
    });
  } catch (error) {
    next(error);
  }
};

// Get live status stats
exports.getLiveStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get counts by status
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get today's orders count
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    // Get active delivery partners count
    const activePartners = await User.countDocuments({
      role: 'delivery',
      'deliveryDetails.isAvailable': true
    });

    // Get total revenue (sum of all delivered orders)
    const revenueResult = await Order.aggregate([
      {
        $match: { status: 'delivered' }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' }
        }
      }
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      stats: {
        statusCounts,
        todayOrders,
        activePartners,
        totalRevenue: Math.round(totalRevenue)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Assign delivery partner to order
exports.assignDeliveryPartner = async (req, res, next) => {
  try {
    const { deliveryPartnerId } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const deliveryPartner = await User.findOne({
      _id: deliveryPartnerId,
      role: 'delivery',
      'deliveryDetails.isAvailable': true
    });
    
    if (!deliveryPartner) {
      return res.status(400).json({
        success: false,
        message: 'Delivery partner not available or not found'
      });
    }

    order.deliveryPartner = deliveryPartnerId;
    order.status = 'assigned';
    
    order.statusHistory.push({
      status: 'assigned',
      note: `Assigned to delivery partner: ${deliveryPartner.profile?.firstName}`,
      updatedBy: req.user.id
    });

    // Mark delivery partner as unavailable
    deliveryPartner.deliveryDetails.isAvailable = false;
    await deliveryPartner.save();
    
    await order.save();
    await order.populate('deliveryPartner', 'profile deliveryDetails');
    await order.populate('customer', 'profile');

    // Emit real-time update
    req.app.get('io').to(`order_${order._id}`).emit('orderUpdated', order);
    req.app.get('io').emit('adminOrderUpdated', { orderId: order._id });

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// Add this new function for admin-specific updates
exports.getAdminDashboardData = async (req, res, next) => {
  try {
    // Get all data needed for admin dashboard in one call
    const [orders, deliveryPartners, stats] = await Promise.all([
      Order.find({})
        .populate('customer', 'profile')
        .populate('deliveryPartner', 'profile')
        .populate('items.product', 'name images')
        .sort({ createdAt: -1 })
        .limit(50), // Limit for performance
      
      User.find({ 
        role: 'delivery',
        isActive: true 
      })
      .select('profile deliveryDetails createdAt lastLogin')
      .sort({ 'deliveryDetails.totalDeliveries': -1 }),

      // Reuse the stats logic from getLiveStats
      (async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const statusCounts = await Order.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]);

        const todayOrders = await Order.countDocuments({
          createdAt: { $gte: today }
        });

        const activePartners = await User.countDocuments({
          role: 'delivery',
          'deliveryDetails.isAvailable': true
        });

        const revenueResult = await Order.aggregate([
          {
            $match: { status: 'delivered' }
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$total' }
            }
          }
        ]);

        return {
          statusCounts,
          todayOrders,
          activePartners,
          totalRevenue: revenueResult[0]?.totalRevenue || 0
        };
      })()
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        deliveryPartners,
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};