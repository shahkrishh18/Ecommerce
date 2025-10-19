import express from 'express';
const router = express.Router();
import Order from '../models/order.js';
import { authMiddleware, role } from '../middlewares/auth.js';

router.post('/orders', authMiddleware, role(['customer']), async (req, res) => {
  try {
    const { items, total, pickupLocation, dropLocation } = req.body;
    const order = new Order({
      customerId: req.user._id, items, total, pickupLocation, dropLocation
    });
    await order.save();

    // notify delivery partners (via socket)
    const io = req.app.get('io');
    io.to('delivery-room').emit('new_order', { order });

    res.json(order);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

router.get('/orders', authMiddleware, role(['customer']), async (req, res) => {
  const orders = await Order.find({ customerId: req.user._id }).sort({createdAt:-1});
  res.json(orders);
});

export default router;