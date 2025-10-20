// src/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store io instance for use in controllers
app.set('io', io);

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'QuickCommerce API is running',
    timestamp: new Date().toISOString()
  });
});

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join order room for real-time updates
  socket.on('joinOrder', (orderId) => {
    socket.join(`order_${orderId}`);
  });

  // Leave order room
  socket.on('leaveOrder', (orderId) => {
    socket.leave(`order_${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  server.close(() => {
    process.exit(1);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`QuickCommerce Pro server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});