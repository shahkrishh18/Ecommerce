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
    name: "Organic Gala Apples",
    description: "Fresh organic gala apples, sweet and crunchy",
    category: "groceries",
    price: 300,
    comparePrice: 350,
    cost: 200,
    sku: "FOOD001",
    quantity: 150,
    unit: "per kg",
    stock: 150,
    images: ["https://plus.unsplash.com/premium_photo-1661322640130-f6a1e2c36653?auto=format&fit=crop&q=60&w=600"],
    tags: ["organic", "fruit", "healthy"],
    vendor: "Nature’s Basket"
  },
  {
    name: "Men's Cotton T-Shirt",
    description: "Soft cotton T-shirt for everyday comfort and style",
    category: "clothing",
    price: 24.99,
    comparePrice: 29.99,
    cost: 15,
    sku: "CLTH001",
    quantity: 80,
    unit: "per item",
    stock: 80,
    images: ["https://plus.unsplash.com/premium_photo-1707932495000-5748b915e4f2?auto=format&fit=crop&q=60&w=600"],
    tags: ["men", "tshirt", "casual"],
    vendor: "Urban Threads"
  },
  {
    name: "Wireless Bluetooth Headphones",
    description: "High-quality sound with long battery life and wireless freedom",
    category: "electronics",
    price: 149.99,
    comparePrice: 179.99,
    cost: 100,
    sku: "ELEC001",
    quantity: 45,
    unit: "per unit",
    stock: 45,
    images: ["https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?auto=format&fit=crop&q=60&w=600"],
    tags: ["audio", "wireless", "bluetooth"],
    vendor: "TechMart"
  },
  {
    name: "Artisanal Sourdough Bread",
    description: "Handcrafted sourdough bread with a crisp crust and soft interior",
    category: "groceries",
    price: 6.49,
    comparePrice: 8.99,
    cost: 4,
    sku: "FOOD002",
    quantity: 60,
    unit: "per loaf",
    stock: 60,
    images: ["https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&q=60&w=600"],
    tags: ["bread", "bakery", "artisanal"],
    vendor: "Baker’s Choice"
  },
  {
    name: "Women's Denim Jeans",
    description: "Comfort-fit denim jeans perfect for everyday wear",
    category: "clothing",
    price: 59.99,
    comparePrice: 69.99,
    cost: 40,
    sku: "CLTH002",
    quantity: 70,
    unit: "per item",
    stock: 70,
    images: ["https://plus.unsplash.com/premium_photo-1673977134363-c86a9d5dcafa?auto=format&fit=crop&q=60&w=600"],
    tags: ["women", "jeans", "denim"],
    vendor: "Urban Threads"
  },
  {
    name: "4K Ultra HD Smart TV",
    description: "Ultra HD Smart TV with stunning visuals and streaming support",
    category: "electronics",
    price: 499.00,
    comparePrice: 599.00,
    cost: 350,
    sku: "ELEC002",
    quantity: 20,
    unit: "per unit",
    stock: 20,
    images: ["https://media.istockphoto.com/id/614142568/photo/curved-tv-isolated-on-white.webp"],
    tags: ["tv", "4k", "smart"],
    vendor: "ElectroWorld"
  },
  {
    name: "Fresh Atlantic Salmon",
    description: "Premium quality fresh Atlantic salmon fillets",
    category: "groceries",
    price: 19.99,
    comparePrice: 24.99,
    cost: 12,
    sku: "FOOD003",
    quantity: 40,
    unit: "per lb",
    stock: 40,
    images: ["https://plus.unsplash.com/premium_photo-1723478431094-4854c4555fc2?auto=format&fit=crop&q=60&w=600"],
    tags: ["seafood", "fish", "fresh"],
    vendor: "Ocean Catch"
  },
  {
    name: "Classic Leather Wallet",
    description: "Stylish and durable leather wallet for everyday use",
    category: "clothing",
    price: 39.99,
    comparePrice: 49.99,
    cost: 25,
    sku: "CLTH003",
    quantity: 110,
    unit: "per item",
    stock: 110,
    images: ["https://images.unsplash.com/photo-1579014134953-1580d7f123f3?auto=format&fit=crop&q=60&w=600"],
    tags: ["leather", "wallet", "accessory"],
    vendor: "Crafted Goods"
  },
  {
    name: "Portable Power Bank",
    description: "Compact and powerful 10000mAh portable power bank",
    category: "electronics",
    price: 29.99,
    comparePrice: 39.99,
    cost: 18,
    sku: "ELEC003",
    quantity: 90,
    unit: "per unit",
    stock: 90,
    images: ["https://images.unsplash.com/photo-1614399113305-a127bb2ca893?auto=format&fit=crop&q=60&w=600"],
    tags: ["power", "charging", "portable"],
    vendor: "TechMart"
  },
  {
    name: "Organic Greek Yogurt",
    description: "Creamy organic Greek yogurt rich in protein and probiotics",
    category: "groceries",
    price: 3.99,
    comparePrice: 4.99,
    cost: 2.5,
    sku: "FOOD004",
    quantity: 120,
    unit: "per tub",
    stock: 120,
    images: ["https://images.unsplash.com/photo-1614399113305-a127bb2ca893?auto=format&fit=crop&q=60&w=600"],
    tags: ["yogurt", "organic", "healthy"],
    vendor: "Nature’s Basket"
  },
  {
    name: "Men's Running Shoes",
    description: "Lightweight and breathable running shoes for men",
    category: "clothing",
    price: 89.99,
    comparePrice: 109.99,
    cost: 60,
    sku: "CLTH004",
    quantity: 65,
    unit: "per pair",
    stock: 65,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=60&w=600"],
    tags: ["shoes", "running", "sports"],
    vendor: "Urban Threads"
  },
  {
    name: "Smartwatch Fitness Tracker",
    description: "Track your fitness, heart rate, and notifications on the go",
    category: "electronics",
    price: 199.00,
    comparePrice: 249.00,
    cost: 130,
    sku: "ELEC004",
    quantity: 55,
    unit: "per unit",
    stock: 55,
    images: ["https://plus.unsplash.com/premium_photo-1712764121254-d9867c694b81?auto=format&fit=crop&q=60&w=600"],
    tags: ["smartwatch", "fitness", "wearable"],
    vendor: "TechMart"
  },
  {
    name: "Cage-Free Brown Eggs",
    description: "Healthy and nutritious cage-free brown eggs",
    category: "groceries",
    price: 5.49,
    comparePrice: 6.99,
    cost: 3.5,
    sku: "FOOD005",
    quantity: 200,
    unit: "per dozen",
    stock: 200,
    images: ["https://plus.unsplash.com/premium_photo-1712764121254-d9867c694b81?auto=format&fit=crop&q=60&w=600"],
    tags: ["eggs", "organic", "protein"],
    vendor: "Farm Fresh"
  },
  {
    name: "Women's Summer Dress",
    description: "Light and airy summer dress perfect for casual outings",
    category: "clothing",
    price: 45.00,
    comparePrice: 55.00,
    cost: 30,
    sku: "CLTH005",
    quantity: 85,
    unit: "per item",
    stock: 85,
    images: ["https://images.unsplash.com/photo-1542295669297-4d352b042bca?auto=format&fit=crop&q=60&w=600"],
    tags: ["dress", "summer", "women"],
    vendor: "Urban Threads"
  },
  {
    name: "Wireless Gaming Mouse",
    description: "Precision wireless gaming mouse with RGB lighting",
    category: "electronics",
    price: 69.99,
    comparePrice: 89.99,
    cost: 45,
    sku: "ELEC005",
    quantity: 75,
    unit: "per unit",
    stock: 75,
    images: ["https://images.unsplash.com/photo-1660491083562-d91a64d6ea9c?auto=format&fit=crop&q=60&w=600"],
    tags: ["gaming", "mouse", "wireless"],
    vendor: "TechMart"
  },
  {
    name: "Avocado Hass",
    description: "Fresh and creamy Hass avocados perfect for salads and toast",
    category: "groceries",
    price: 2.50,
    comparePrice: 3.00,
    cost: 1.5,
    sku: "FOOD006",
    quantity: 130,
    unit: "per item",
    stock: 130,
    images: ["https://images.unsplash.com/photo-1594959866993-63d110d379c2?auto=format&fit=crop&q=60&w=600"],
    tags: ["fruit", "avocado", "healthy"],
    vendor: "Nature’s Basket"
  },
  {
    name: "Men's Winter Jacket",
    description: "Warm and stylish winter jacket made with premium materials",
    category: "clothing",
    price: 120.00,
    comparePrice: 150.00,
    cost: 80,
    sku: "CLTH006",
    quantity: 40,
    unit: "per item",
    stock: 40,
    images: ["https://plus.unsplash.com/premium_photo-1670623042512-1a5ecebc3f42?auto=format&fit=crop&q=60&w=600"],
    tags: ["jacket", "winter", "men"],
    vendor: "Urban Threads"
  },
  {
    name: "Digital SLR Camera",
    description: "Professional-grade DSLR camera for photography enthusiasts",
    category: "electronics",
    price: 899.99,
    comparePrice: 1099.99,
    cost: 650,
    sku: "ELEC006",
    quantity: 15,
    unit: "per unit",
    stock: 15,
    images: ["https://images.unsplash.com/photo-1625545013865-80da35181abf?auto=format&fit=crop&q=60&w=600"],
    tags: ["camera", "dslr", "photography"],
    vendor: "TechMart"
  },
  {
    name: "Dark Chocolate Bar (70%)",
    description: "Rich and smooth dark chocolate made with 70% cocoa",
    category: "groceries",
    price: 3.29,
    comparePrice: 4.29,
    cost: 2,
    sku: "FOOD007",
    quantity: 180,
    unit: "per bar",
    stock: 180,
    images: ["https://images.unsplash.com/photo-1600231409360-e58ed635543a?auto=format&fit=crop&q=60&w=600"],
    tags: ["chocolate", "snack", "dessert"],
    vendor: "Sweet Delights"
  },
  {
    name: "Leather Belt",
    description: "Classic leather belt designed for durability and elegance",
    category: "clothing",
    price: 34.99,
    comparePrice: 44.99,
    cost: 20,
    sku: "CLTH007",
    quantity: 95,
    unit: "per item",
    stock: 95,
    images: ["https://images.unsplash.com/photo-1711443982852-b3df5c563448?auto=format&fit=crop&q=60&w=600"],
    tags: ["belt", "leather", "men"],
    vendor: "Crafted Goods"
  },
  {
    name: "1TB External Hard Drive",
    description: "Portable 1TB hard drive for fast and secure data storage",
    category: "electronics",
    price: 59.99,
    comparePrice: 79.99,
    cost: 40,
    sku: "ELEC007",
    quantity: 60,
    unit: "per unit",
    stock: 60,
    images: ["https://images.unsplash.com/photo-1587202372775-e229f172b6c1?auto=format&fit=crop&q=60&w=600"],
    tags: ["storage", "backup", "portable"],
    vendor: "ElectroWorld"
  },
  {
    name: "Whole Bean Coffee",
    description: "Premium roasted whole bean coffee for a rich aroma and flavor",
    category: "groceries",
    price: 14.99,
    comparePrice: 19.99,
    cost: 10,
    sku: "FOOD008",
    quantity: 100,
    unit: "per bag",
    stock: 100,
    images: ["https://images.unsplash.com/photo-1562051036-e0eea191d42f?auto=format&fit=crop&q=60&w=600"],
    tags: ["coffee", "beans", "aroma"],
    vendor: "Bean Haven"
  },
  {
    name: "Wool Scarf",
    description: "Cozy and soft wool scarf to keep you warm in winter",
    category: "clothing",
    price: 29.99,
    comparePrice: 39.99,
    cost: 18,
    sku: "CLTH008",
    quantity: 115,
    unit: "per item",
    stock: 115,
    images: ["https://images.unsplash.com/photo-1599948126830-89f10444e491?auto=format&fit=crop&q=60&w=600"],
    tags: ["scarf", "winter", "wool"],
    vendor: "Urban Threads"
  },
  {
    name: "Mechanical Keyboard",
    description: "Durable mechanical keyboard with customizable RGB lighting",
    category: "electronics",
    price: 119.99,
    comparePrice: 149.99,
    cost: 80,
    sku: "ELEC008",
    quantity: 50,
    unit: "per unit",
    stock: 50,
    images: ["https://images.unsplash.com/photo-1713713717233-dd5cd01133a9?auto=format&fit=crop&q=60&w=600"],
    tags: ["keyboard", "gaming", "mechanical"],
    vendor: "TechMart"
  },
  {
    name: "Extra Virgin Olive Oil",
    description: "Premium cold-pressed extra virgin olive oil for cooking and dressing",
    category: "groceries",
    price: 12.99,
    comparePrice: 16.99,
    cost: 9,
    sku: "FOOD009",
    quantity: 80,
    unit: "per bottle",
    stock: 80,
    images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=60&w=600"],
    tags: ["oil", "olive", "healthy"],
    vendor: "Nature’s Basket"
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