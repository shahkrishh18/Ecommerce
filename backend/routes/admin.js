import express from 'express';
const router = express.Router();
import Order from '../models/order.js';
import User from '../models/user.js';
import { authMiddleware, role } from '../middlewares/auth.js';

router.get('/orders', authMiddleware, role(['admin']), async (req,res)=>{
  const orders = await Order.find().populate('customerId assignedTo').sort({createdAt:-1});
  res.json(orders);
});

router.get('/delivery-partners', authMiddleware, role(['admin']), async (req,res)=>{
  const partners = await User.find({ role: 'delivery' }).select('-password');
  res.json(partners);
});

export default router;