import express from 'express';
const router = express.Router();
import Order from '../models/order.js';
import { authMiddleware, role } from '../middlewares/auth.js';

router.get('/unassigned', authMiddleware, role(['delivery']), async (req,res) => {
  const orders = await Order.find({ status: 'PENDING', assignedTo: null }).sort({createdAt:1});
  res.json(orders);
});

// Accept order - atomic
router.post('/accept/:id', authMiddleware, role(['delivery']), async (req,res) => {
  try {
    const orderId = req.params.id;
    const now = new Date();
    const order = await Order.findOneAndUpdate(
      { _id: orderId, status: 'PENDING', assignedTo: null },
      { $set: { assignedTo: req.user._id, status: 'ASSIGNED', updatedAt: now } },
      { new: true }
    );
    if (!order) return res.status(409).json({ message: 'Order already taken or not available' });

    // notify customer and admin
    const io = req.app.get('io');
    io.to(`customer-${order.customerId}`).emit('order_update', order);
    io.to('admin-room').emit('order_update', order);
    io.to(`delivery-${req.user._id}`).emit('order_accepted', order);

    res.json({ order });
  } catch(err){ console.error(err); res.status(500).send('Server error'); }
});

router.post('/status/:id', authMiddleware, role(['delivery']), async (req,res) => {
  try{
    const { status } = req.body; // PICKED, ON_THE_WAY, DELIVERED
    const allowed = ['PICKED','ON_THE_WAY','DELIVERED'];
    if(!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const order = await Order.findOne({ _id: req.params.id, assignedTo: req.user._id });
    if(!order) return res.status(403).json({ message: 'Not your order' });
    order.status = status;
    order.updatedAt = new Date();
    await order.save();

    const io = req.app.get('io');
    io.to(`customer-${order.customerId}`).emit('order_update', order);
    io.to('admin-room').emit('order_update', order);
    io.emit('global_order_update', order); // optional
    res.json({ order });
  }catch(err){ console.error(err); res.status(500).send('Server error'); }
});

export default router;