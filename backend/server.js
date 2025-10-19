import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customer.js';
import deliveryRoutes from './routes/delivery.js';
import adminRoutes from './routes/admin.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));

// Health
app.get('/health', (req,res) => res.json({ status: 'ok', time: new Date() }));

app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/admin', adminRoutes);

const server = http.createServer(app);
import { Server } from 'socket.io';
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || '*',
    methods: ["GET","POST"],
    credentials: true
  },
  path: '/socket.io'
});
app.set('io', io);

// Socket logic
io.on('connection', (socket) => {
  // Example: join rooms for customers/delivery/admin
  socket.on('join', (payload) => {
    // payload: { role, id }
    if (!payload) return;
    if (payload.role === 'customer') socket.join(`customer-${payload.id}`);
    if (payload.role === 'delivery') {
      socket.join('delivery-room');
      socket.join(`delivery-${payload.id}`);
    }
    if (payload.role === 'admin') socket.join('admin-room');
  });

  socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> {
  server.listen(PORT, ()=> console.log(`Server listening ${PORT}`));
}).catch(err => { console.error(err); process.exit(1); });