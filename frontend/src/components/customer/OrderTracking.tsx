import { ArrowLeft, Package, Truck, CheckCircle, MapPin, Loader, } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import type { JSX } from "react";
import { io } from "socket.io-client";

const API_BASE_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

interface Order {
  _id: string;
  orderId: string;
  status: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
    total: number;
  }>;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    type: string;
    instructions?: string;
  };
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    note: string;
  }>;
  createdAt: string;
  estimatedDelivery: string;
  paymentMethod: string;
}

interface TimelineItem {
  title: string;
  time: string;
  status: 'completed' | 'in-progress' | 'pending';
  icon: JSX.Element;
}

function OrderTracking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState<any>(null);

  // Get order ID from multiple possible sources
  const orderId = location.state?.orderId || 
                  new URLSearchParams(location.search).get('orderId') ||
                  localStorage.getItem('lastOrderId');

  const fetchOrder = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      console.log('🔍 Fetching order with ID:', id);

      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found');
        }
        if (response.status === 401) {
          throw new Error('Authentication failed');
        }
        throw new Error(`Failed to fetch order: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Order data received:', result);
      
      if (result.success) {
        setOrder(result.order);
      } else {
        throw new Error(result.message || 'Failed to load order');
      }
    } catch (err: any) {
      console.error('❌ Error fetching order:', err);
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

   // Set up WebSocket connection for real-time updates

  const getTimelineFromOrder = (order: Order): TimelineItem[] => {
  const statusOrder = [
    { 
      key: 'pending', 
      title: 'Order Placed', 
      icon: <Package className="w-5 h-5" /> 
    },
    { 
      key: 'picked_up', 
      title: 'Picked Up', 
      icon: <Truck className="w-5 h-5" /> 
    },
    { 
      key: 'in_transit', 
      title: 'Out for Delivery', 
      icon: <Truck className="w-5 h-5" /> 
    },
    { 
      key: 'delivered', 
      title: 'Delivered', 
      icon: <CheckCircle className="w-5 h-5" /> 
    }
  ];

  // Special cases for cancelled and failed orders
  if (order.status === 'cancelled') {
    return [
      {
        title: 'Order Cancelled',
        time: order.statusHistory.find(h => h.status === 'cancelled')?.timestamp 
          ? new Date(order.statusHistory.find(h => h.status === 'cancelled')!.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '',
        status: 'completed',
        icon: <CheckCircle className="w-5 h-5" />
      }
    ];
  }

  if (order.status === 'failed') {
    return [
      {
        title: 'Delivery Failed',
        time: order.statusHistory.find(h => h.status === 'failed')?.timestamp 
          ? new Date(order.statusHistory.find(h => h.status === 'failed')!.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '',
        status: 'completed',
        icon: <CheckCircle className="w-5 h-5" />
      }
    ];
  }

  const getTimelineIndex = (status: string): number => {
    switch (status) {
      case 'pending':
      case 'confirmed':
      case 'preparing':
      case 'ready':
      case 'assigned':
        return 0;
      case 'picked_up':
        return 1;
      case 'in_transit':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentStatusIndex = getTimelineIndex(order.status);
  
  return statusOrder.map((item, index) => {
    let status: 'completed' | 'in-progress' | 'pending' = 'pending';
    
    if (index < currentStatusIndex) {
      status = 'completed';
    } else if (index === currentStatusIndex) {
      status = 'in-progress';
    } else {
      status = 'pending';
    }

    let time = '';
    
    if (index === 0) {
      time = new Date(order.createdAt).toLocaleDateString() + ' ' + new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {

      const targetStatus = index === 1 ? 'picked_up' : 
                          index === 2 ? 'in_transit' : 
                          index === 3 ? 'delivered' : '';
      
      const statusHistoryItem = order.statusHistory.find(history => history.status === targetStatus);
      time = statusHistoryItem ? 
        new Date(statusHistoryItem.timestamp).toLocaleDateString() + ' ' +
        new Date(statusHistoryItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    }

    return {
      title: item.title,
      time,
      status,
      icon: item.icon
    };
  });
};

   useEffect(() => {
    if (!orderId) return;

    let socketInstance: any;

    const initializeSocket = () => {
      const token = localStorage.getItem('token');
      
      // Create socket connection
      socketInstance = io(SOCKET_URL, {
        auth: {
          token: token
        }
      });

      socketInstance.on('connect', () => {
        console.log(' WebSocket connected:', socketInstance.id);
        
        // Join the order room for real-time updates
        socketInstance.emit('joinOrder', orderId);
      });

      socketInstance.on('orderUpdated', (updatedOrder: Order) => {
        console.log(' Real-time order update received:', updatedOrder);
        setOrder(updatedOrder);
      });

      socketInstance.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      socketInstance.on('connect_error', (error: any) => {
        console.error('WebSocket connection error:', error);
      });

      setSocket(socketInstance);
    };

    fetchOrder(orderId);
    initializeSocket();

    localStorage.setItem('lastOrderId', orderId);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        console.log('🧹 Cleaning up WebSocket connection');
        socketInstance.emit('leaveOrder', orderId);
        socketInstance.disconnect();
      }
    };
  }, [orderId]);

  // If no order ID, show error immediately
  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-row items-center gap-4 py-2 mb-4">
            <button
              onClick={() => navigate("/customer")}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Tracking</h1>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-yellow-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Order Selected</h2>
            <p className="text-gray-600 mb-4">Please go back and select an order to track.</p>
            <button
              onClick={() => navigate("/customer")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Shopping
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-row items-center gap-4 py-2 mb-4">
            <button
              onClick={() => navigate("/customer")}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Tracking</h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Loading order details...
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center py-12 flex-col">
            <Loader size={48} className="animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Fetching order information...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-row items-center gap-4 py-2 mb-4">
            <button
              onClick={() => navigate("/customer")}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Tracking</h1>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-red-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Order</h2>
            <p className="text-gray-600 mb-4">{error || 'Order not found or access denied'}</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Order ID: {orderId}</p>
              <button
                onClick={() => fetchOrder(orderId)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mr-2"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/customer")}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Shopping
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const timeline = getTimelineFromOrder(order);
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-row items-center gap-4 py-2 mb-4">
          <button
            onClick={() => navigate("/customer")}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Tracking</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
                Track your order status and delivery details here
            </p>
            <p className="text-sm text-gray-500 mt-1">Order ID: {order.orderId}</p>
            <p className="text-xs text-gray-400 mt-1">Status: {order.status.replace('_', ' ').toUpperCase()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Timeline */}
          <section className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-6">Order Timeline</h2>
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <div key={item.title} className="flex">
                  <div className="flex flex-col items-center">
                    <div className={`p-3 rounded-full ${
                      item.status === 'completed' ? 'bg-green-500' :
                      item.status === 'in-progress' ? 'bg-blue-500' :
                      'bg-gray-200'
                    }`}>
                      {React.cloneElement(item.icon, {
                        className: `${item.status === 'pending' ? 'text-gray-500' : 'text-white'}`
                      })}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className={`w-0.5 h-full my-2 ${
                        item.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-medium ${
                          item.status === 'completed' ? 'text-green-600' :
                          item.status === 'in-progress' ? 'text-blue-600' :
                          'text-gray-500'
                        }`}>
                          {item.title}
                        </h3>
                        {item.time && (
                          <p className="text-sm text-gray-500">{item.time}</p>
                        )}
                      </div>
                      {item.status === 'completed' && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">
                          Completed
                        </span>
                      )}
                      {item.status === 'in-progress' && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {order.createdAt && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">
                  Estimated Delivery:{" "}
                  {new Date(
                    new Date(order.createdAt).setDate(
                      new Date(order.createdAt).getDate() + 4
                    )
                  ).toLocaleString()}
                </p>
              </div>
            )}

          </section>
          <section className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-6">Order Details</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-medium text-gray-900">Delivery Address</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {order.deliveryAddress.street},
                      {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                    </p>
                    {order.deliveryAddress.instructions && (
                      <p className="text-xs text-gray-500 mt-1">
                        Instructions: {order.deliveryAddress.instructions}
                      </p>
                    )}
                    {/* <p className="text-xs text-gray-500 mt-1 capitalize">
                      {order.deliveryAddress.type} address
                    </p> */}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-4">Items ({totalItems})</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{item.product.name}</p>
                          <p className="text-gray-500">× {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium">${item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  {order.deliveryFee > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>${order.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  {order.tax > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-gray-900 border-t pt-2">
                    <span>Total Amount</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t flex flex-row justify-between pt-4">
                <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                <p className="text-sm text-gray-600 font-bold capitalize">
                  {order.paymentMethod.replace('_', ' ')}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default OrderTracking;