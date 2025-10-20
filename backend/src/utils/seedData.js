// src/utils/seedData.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Create admin user
    const admin = await User.create({
      email: 'admin@quickcommerce.com',
      password: 'admin123',
      role: 'admin',
      profile: {
        firstName: 'System',
        lastName: 'Admin'
      }
    });

    // Create delivery partners
    const deliveryPartners = await User.create([
      {
        email: 'rider1@quickcommerce.com',
        password: 'rider123',
        role: 'delivery',
        profile: {
          firstName: 'Raj',
          lastName: 'Kumar',
          phone: '+919876543210'
        },
        deliveryDetails: {
          vehicleType: 'bike',
          vehicleNumber: 'DL01AB1234',
          licenseNumber: 'DL123456789',
          isAvailable: true,
          currentLocation: {
            lat: 28.6139,
            lng: 77.2090
          }
        }
      },
      {
        email: 'rider2@quickcommerce.com',
        password: 'rider123',
        role: 'delivery',
        profile: {
          firstName: 'Amit',
          lastName: 'Sharma',
          phone: '+919876543211'
        },
        deliveryDetails: {
          vehicleType: 'scooter',
          vehicleNumber: 'DL01CD5678',
          licenseNumber: 'DL987654321',
          isAvailable: true,
          currentLocation: {
            lat: 28.6129,
            lng: 77.2290
          }
        }
      }
    ]);

    // Create customer
    const customer = await User.create({
      email: 'customer@quickcommerce.com',
      password: 'customer123',
      role: 'customer',
      profile: {
        firstName: 'Priya',
        lastName: 'Singh',
        phone: '+919876543212'
      },
      customerDetails: {
        addresses: [
          {
            type: 'home',
            street: '123 Main Street',
            city: 'New Delhi',
            state: 'Delhi',
            zipCode: '110001',
            isDefault: true
          }
        ]
      }
    });

    // Create products
    const products = await Product.create([
      {
        name: 'Fresh Apples',
        description: 'Fresh and crunchy red apples, perfect for snacking',
        category: 'groceries',
        price: 120,
        comparePrice: 150,
        cost: 80,
        sku: 'APP001',
        quantity: 100,
        images: ['https://example.com/apples.jpg'],
        tags: ['fruits', 'fresh', 'healthy'],
        vendor: 'Fresh Farms'
      },
      {
        name: 'Organic Milk',
        description: 'Pure organic milk, rich in calcium and vitamins',
        category: 'groceries',
        price: 60,
        comparePrice: 70,
        cost: 45,
        sku: 'MIL001',
        quantity: 50,
        images: ['https://example.com/milk.jpg'],
        tags: ['dairy', 'organic', 'calcium'],
        vendor: 'Organic Dairy'
      },
      {
        name: 'Whole Wheat Bread',
        description: 'Freshly baked whole wheat bread, high in fiber',
        category: 'groceries',
        price: 45,
        comparePrice: 55,
        cost: 30,
        sku: 'BRD001',
        quantity: 75,
        images: ['https://example.com/bread.jpg'],
        tags: ['bakery', 'healthy', 'fiber'],
        vendor: 'Bakery Corner'
      },
      {
        name: 'Smartphone',
        description: 'Latest smartphone with advanced features',
        category: 'electronics',
        price: 25000,
        comparePrice: 28000,
        cost: 22000,
        sku: 'PHN001',
        quantity: 25,
        images: ['https://example.com/phone.jpg'],
        tags: ['electronics', 'mobile', 'tech'],
        vendor: 'Tech Store'
      }
    ]);

    console.log('Sample data created successfully!');
    console.log('Admin:', admin.email);
    console.log('Delivery Partners:', deliveryPartners.length);
    console.log('Customer:', customer.email);
    console.log('Products:', products.length);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();