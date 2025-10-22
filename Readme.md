1. Project Overview
QuickCommerce is a full-stack delivery management platform that connects customers, delivery partners, and administrators in real-time. The system enables customers to place orders, delivery partners to accept and track deliveries, and administrators to monitor the entire operation.

Key Features:

Real-time order tracking with WebSocket updates
Multi-role dashboards (Customer, Delivery Partner, Admin)
Order locking system to prevent race conditions
Live status updates and notifications
Dockerized deployment with AWS EC2

2. System Architecture Diagram

![QuickCommerce System Architecture](./System%20Arch.png)

The architecture consists of three main components:

- **Frontend (React + TypeScript)**
  - Customer ordering interface
  - Delivery partner tracking dashboard
  - Admin management console

- **Backend (Node.js + Express)**
  - RESTful API endpoints
  - WebSocket server for real-time updates
  - Authentication & Authorization
  - Order management system

- **Database & Services**
  - MongoDB for persistent storage
  - JWT for secure authentication

3. Stack Used

Frontend:
    React 18 with TypeScript

    Vite for build tooling

    Tailwind CSS for styling

    Socket.IO Client for real-time communication

    React Router for navigation

Backend:
    Node.js with Express.js

    Socket.IO for WebSocket server

    MongoDB with Mongoose ODM

    JWT for authentication

    bcryptjs for password hashing

Infrastructure:
    Docker & Docker Compose for containerization

    AWS EC2 for cloud hosting

    Nginx as reverse proxy

    MongoDB for database


4. Folder Structure:

quickcommerce/
├── docker-compose.yml          # Main Docker composition
├── backend/
│   ├── Dockerfile             # Backend container definition
│   ├── src/
│   │   ├── server.js          # Main server file
│   │   ├── config/
│   │   │   └── database.js    # MongoDB connection
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Auth & validation
│   │   ├── models/           # MongoDB models
│   │   └── routes/           # API routes
│   └── package.json
├── frontend/
│   ├── Dockerfile             # Frontend container definition
│   ├── nginx.conf            # Nginx configuration
│   ├── vite.config.js        # Vite configuration
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   └── App.jsx          # Main App component
│   └── package.json
└── README.md


5. SSH Commands

# Make key file secure
chmod 400 your-key.pem

# SSH into EC2 instance
ssh -i "your-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP

**Git Clone**

# Install Git (if not already installed)
sudo apt update && sudo apt install -y git

# Clone your repository
git clone https://github.com/shahkrishh18/Ecommerce.git

# Navigate to project directory
cd Ecommerce

**Docker Compose Setup**

# Build and start all services
docker-compose up -d --build

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

**Env Variables**

# Backend Configuration
NODE_ENV=production
PORT=5000
CORS_ORIGIN=http://13.233.221.31

# Frontend Configuration (Vite)
VITE_API_URL=http://13.233.221.31/api
VITE_WS_URL=http://13.233.221.31

**5. Hosting & Deployment**

*1.AWS EC2 Setup*

1. Launch EC2 Instance

AMI: Ubuntu 22.04 LTS

Instance Type: t2.micro or t2.small

Security Groups: Open ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

2. Install Docker & Dependencies
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

*Nginx Reverse Proxy Configuration*
The frontend container runs Nginx that:

Serves React static files

Proxies /api/* requests to backend

Proxies WebSocket connections (/socket.io/*)

Handles SSL termination (if configured)

**7. WebSocket Flow Explanation**

Client → Nginx → Backend (Socket.IO)
    1. Client connects via WebSocket
    2. Joins specific rooms (order_{id}, admin_room)
    3. Listens for real-time events

Realtime updates:
// Order Status Update Flow
Delivery Partner → PUT /api/orders/:id/status
    ↓
Backend updates database
    ↓
Backend emits 'orderUpdated' event
    ↓
Socket.IO broadcasts to:
    - order_{orderId} room (customer tracking)
    - admin_room (admin dashboard)
    ↓
All connected clients receive real-time update

**8. Scaling Plans**

Adding Redis for Socket Scaling
Problem: Multiple server instances can't share Socket.IO connections

Solution: Redis Adapter for Socket.IO clustering. We can use horizontal scaling with load balancer, database scaling. 

// Backend scaling with Redis
const redis = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

const pubClient = redis.createClient({ host: 'redis', port: 6379 });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

**9. Future Improvements**

Performance Optimizations
    CDN Integration: CloudFront for static assets

    Database Indexing: Optimize MongoDB queries

    Caching Layer: Redis for frequent queries

    Image Optimization: WebP format with lazy loading

Security Improvements
    Rate Limiting: Advanced DDoS protection

    API Gateway: AWS API Gateway for request validation

    WAF Integration: Web Application Firewall

    Database Encryption: At-rest and in-transit encryption