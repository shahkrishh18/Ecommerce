import { Box, MapPin, Star, DollarSign, Package, Clock, Loader } from 'lucide-react';
import Logout from '../Logout';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

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
      images: string[];
    };
    quantity: number;
  }>;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    type: string;
    instructions?: string;
  };
  customer: {
    profile: {
      firstName: string;
      lastName: string;
      phone?: string;
    };
  };
  subtotal: number;
  deliveryFee: number;
  total: number;
  estimatedDelivery: string;
  createdAt: string;
  priority?: boolean;
}

interface DeliveryStats {
  todayEarnings: number;
  deliveriesToday: number;
  rating: number;
}

function DeliveryDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DeliveryStats>({
    todayEarnings: 0,
    deliveriesToday: 0,
    rating: 4.9 // Default from your User model
  });
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<any>(null);

  // In DeliveryDashboard component
const fetchUnassignedOrders = async () => {
  try {
    console.log('🔄 Fetching unassigned orders from backend...');
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/orders/unassigned`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) throw new Error('Failed to fetch orders');
    
    const result = await response.json();
    console.log('✅ Orders data:', result);
    
    if (result.success) {
      setOrders(result.orders);
    }
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
  }
};

  // Fetch delivery partner stats
  const fetchDeliveryStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/delivery/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStats(result.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use default stats if endpoint doesn't exist
    }
  };

  // In your DeliveryDashboard component, update the acceptOrder function:
const acceptOrder = async (orderId: string) => {
  try {
    const token = localStorage.getItem('token');
    
    // Step 1: Lock the order first
    const lockResponse = await fetch(`${API_BASE_URL}/delivery/${orderId}/lock`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!lockResponse.ok) {
      const errorData = await lockResponse.json();
      if (lockResponse.status === 423) {
        alert('This order is currently being accepted by another delivery partner. Please try another order.');
      } else {
        throw new Error(errorData.message || 'Failed to lock order');
      }
      return;
    }

    // Step 2: Accept the order (now it's locked for us)
    const acceptResponse = await fetch(`${API_BASE_URL}/delivery/${orderId}/accept`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!acceptResponse.ok) {
      const errorData = await acceptResponse.json();
      throw new Error(errorData.message || 'Failed to accept order');
    }
    
    const result = await acceptResponse.json();
    if (result.success) {
      // Remove accepted order from list
      setOrders(prev => prev.filter(order => order._id !== orderId));
      navigate('/orderaccepted', { state: { order: result.order } });
    }
  } catch (error: any) {
    console.error('Error accepting order:', error);
    alert(error.message || 'Failed to accept order. Please try again.');
  }
};

  // Calculate distance (mock function - replace with real geolocation)
  const calculateDistance = () => {
    // Mock distance calculation - in real app, use customerLocation vs delivery partner location
    const distances = ['1.2 km', '2.3 km', '0.8 km', '3.1 km', '1.5 km'];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  // Calculate ETA (mock function)
  const calculateETA = () => {
    // Mock ETA calculation
    const times = ['15 mins', '20 mins', '25 mins', '30 mins', '35 mins'];
    return times[Math.floor(Math.random() * times.length)];
  };

  // Calculate delivery amount (based on your backend logic)
  const calculateDeliveryAmount = (order: Order): number => {
    // Base amount + distance factor - in real app, use proper pricing algorithm
    const baseAmount = order.deliveryFee > 0 ? order.deliveryFee * 0.6 : 8; // 60% of delivery fee or $8 minimum
    return Math.max(baseAmount, 8);
  };

  // Check if order is priority (orders older than 10 minutes)
  const isPriorityOrder = (order: Order): boolean => {
    const orderTime = new Date(order.createdAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - orderTime.getTime()) / (1000 * 60);
    return diffMinutes > 10;
  };

  // Set up WebSocket for real-time order updates
  useEffect(() => {
    const initializeSocket = () => {
      const token = localStorage.getItem('token');
      const socketInstance = io(SOCKET_URL, {
        auth: { token }
      });

      socketInstance.on('connect', () => {
        console.log('🔌 Delivery Dashboard connected to WebSocket');
      });

      socketInstance.on('newOrderAvailable', () => {
        console.log('🆕 New order available - refreshing list');
        fetchUnassignedOrders();
      });

      socketInstance.on('orderAssigned', (data) => {
        // Remove order if it was assigned to someone else
        setOrders(prev => prev.filter(order => order._id !== data.orderId));
      });

      setSocket(socketInstance);
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUnassignedOrders(), fetchDeliveryStats()]);
      setLoading(false);
    };

    loadData();
    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const statsDisplay = [
    {
      title: "Today's Earnings",
      value: `$${stats.todayEarnings.toFixed(2)}`,
      icon: <DollarSign className="text-white" size={24} />,
      bgColor: "bg-green-500",
    },
    {
      title: "Deliveries Today",
      value: stats.deliveriesToday.toString(),
      icon: <Package className="text-white" size={24} />,
      bgColor: "bg-blue-500",
    },
    {
      title: "Rating",
      value: stats.rating.toFixed(1),
      icon: <Star className="text-white" size={24} />,
      bgColor: "bg-purple-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading available orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Available Orders</h1>
            <p className="text-gray-600">Accept orders and start earning</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Online
            </span>
            <Logout />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsDisplay.map((stat) => (
            <div key={stat.title} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Available Orders ({orders.length})</h2>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders available</h3>
              <p className="text-gray-600">New orders will appear here automatically</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const priority = isPriorityOrder(order);
                const distance = calculateDistance();
                const eta = calculateETA();
                const amount = calculateDeliveryAmount(order);
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

                return (
                  <div key={order._id} className={`border rounded-2xl p-6 ${priority ? 'border-orange-200 bg-orange-50/50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Box className="text-green-600" size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{order.orderId}</span>
                            {priority && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                                High Priority
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{totalItems} items • ${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold">${amount.toFixed(2)}</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <MapPin className="text-blue-500 flex-shrink-0" size={18} />
                        <div>
                          <p className="text-sm font-medium">Pickup from</p>
                          <p className="text-sm text-gray-600">Near {order.deliveryAddress.city}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <MapPin className="text-green-500 flex-shrink-0" size={18} />
                        <div>
                          <p className="text-sm font-medium">Deliver to Customer</p>
                          <p className="text-sm text-gray-600">
                            {order.deliveryAddress.street}, {order.deliveryAddress.city}
                          </p>
                          {order.deliveryAddress.instructions && (
                            <p className="text-xs text-gray-500 mt-1">
                              Note: {order.deliveryAddress.instructions}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} />
                        <span className="text-sm">{eta}</span>
                        <span className="text-sm">• {distance}</span>
                      </div>
                      <button 
                        onClick={() => acceptOrder(order._id)}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Accept Order
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeliveryDashboard;