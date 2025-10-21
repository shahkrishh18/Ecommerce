const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, paymentMethod, customerLocation } = req.body;
    
    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }
      
      if (product.trackQuantity && product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for product: ${product.name}`
        });
      }
      
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });
    }
    
    // Calculate delivery fee (simple logic - can be enhanced)
    const deliveryFee = subtotal > 500 ? 0 : 49; // Free delivery above 500
    const tax = subtotal * 0.18; // 18% tax
    const total = subtotal + deliveryFee + tax;
    
    // Create order
    const order = await Order.create({
      orderId: `ORD-${Date.now()}`,
      customer: req.user.id,
      items: orderItems,
      deliveryAddress,
      paymentMethod,
      customerLocation,
      subtotal,
      deliveryFee,
      tax,
      total,
      status: 'ready',
      estimatedDelivery: new Date(Date.now() + 45 * 60000) // 45 minutes from now
    });
    
    // Update product quantities
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { 
          $inc: { 
            quantity: -item.quantity,
            salesCount: item.quantity
          } 
        }
      );
    }
    
    await order.populate('items.product', 'name images');
    await order.populate('customer', 'profile');

    // In createOrder function, after order creation:
req.app.get('io').emit('newOrderAvailable');

// In updateOrderStatus function, after status update:
req.app.get('io').to('admin_room').emit('orderUpdated', order);
    
    req.app.get('io').emit('newOrderAvailable');
    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    let query = {};
    
    // Role-based filtering
    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    } else if (req.user.role === 'delivery') {
      query.deliveryPartner = req.user.id;
    }
    // Admin can see all orders
    
    const orders = await Order.find(query)
      .populate('customer', 'profile')
      .populate('deliveryPartner', 'profile deliveryDetails')
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

exports.getOrder = async (req, res, next) => {
  try {
    let query = { _id: req.params.id };
    
    // Role-based access control
    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    } else if (req.user.role === 'delivery') {
      query.deliveryPartner = req.user.id;
    }
    
    const order = await Order.findOne(query)
      .populate('customer', 'profile')
      .populate('deliveryPartner', 'profile deliveryDetails')
      .populate('items.product', 'name images category');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
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

// Add to orderController.js
exports.acceptOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.deliveryPartner) {
      return res.status(400).json({
        success: false,
        message: 'Order already assigned'
      });
    }

    // ✅ Add User import
    const User = require('../models/User');

    // Assign current delivery partner
    order.deliveryPartner = req.user.id;
    order.status = 'assigned';
    
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

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Authorization checks
    if (req.user.role === 'customer' && order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }
    
    if (req.user.role === 'delivery' && order.deliveryPartner?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }
    
    // Status transition validation
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['assigned'],
      assigned: ['picked_up', 'cancelled'],
      picked_up: ['in_transit'],
      in_transit: ['delivered', 'failed'],
      delivered: [],
      cancelled: [],
      failed: []
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
      note: note || `Status updated to ${status}`,
      updatedBy: req.user.id
    });
    
    // Set timestamps for specific statuses
    if (status === 'picked_up') {
      order.preparationTime = Math.floor((new Date() - order.createdAt) / 60000);
    } else if (status === 'delivered') {
      order.actualDelivery = new Date();
      order.deliveryTime = Math.floor((new Date() - order.updatedAt) / 60000);
      
      // Update delivery partner stats
      if (order.deliveryPartner) {
        const User = require('../models/User');
        await User.findByIdAndUpdate(order.deliveryPartner, {
          $inc: { 'deliveryDetails.totalDeliveries': 1 },
          $set: { 'deliveryDetails.isAvailable': true }
        });
      }
    }
    
    await order.save();
    await order.populate('deliveryPartner', 'profile deliveryDetails');
    
    // Emit real-time update
    req.app.get('io').to(`order_${order._id}`).emit('orderUpdated', order);
    
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

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
    
    // Only admin can assign delivery partners
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can assign delivery partners'
      });
    }
    
    const User = require('../models/User');
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
    
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

exports.getUnassignedOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      status: { $in: ['ready', 'confirmed', 'preparing'] },
      deliveryPartner: { $exists: false }
    })
    .populate('customer', 'profile')
    .populate('items.product', 'name images')
    .sort({ createdAt: 1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};