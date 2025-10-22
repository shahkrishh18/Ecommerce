import Header from "../Header";
import { useState, useEffect } from "react";
import { Package, User, Activity, Loader, RefreshCw } from "lucide-react";
import DeliveryPartners from "./DeliveryPartners";
import OrdersTable from "./OrdersTable";
import LiveStatus from "./LiveStatus";
import io from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

interface Order {
  _id: string;
  orderId: string;
  status: string;
  customer: {
    profile: {
      firstName: string;
      lastName: string;
    };
  };
  deliveryPartner?: {
    profile: {
      firstName: string;
      lastName: string;
    };
  };
  items: Array<{
    product: {
      name: string;
    };
    quantity: number;
  }>;
  total: number;
  createdAt: string;
}

export interface DeliveryPartner {
  _id: string;
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
  };
  deliveryDetails: {
    vehicleType: string;
    vehicleNumber?: string;
    isAvailable: boolean;
    rating: number;
    totalDeliveries: number;
    currentLocation?: {
      lat: number;
      lng: number;
    };
  };
  lastLogin?: string;
}

interface LiveStats {
  statusCounts: Array<{
    _id: string;
    count: number;
  }>;
  todayOrders: number;
  activePartners: number;
  totalRevenue: number;
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'partners' | 'live'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>([]);
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/dashboard-data`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      
      const result = await response.json();
      if (result.success) {
        setOrders(result.data.orders || []);
        setDeliveryPartners(result.data.deliveryPartners || []);
        setLiveStats(result.data.stats || null);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  // WebSocket
  useEffect(() => {
    const initializeSocket = () => {
      const token = localStorage.getItem('token');
      const socketInstance = io(SOCKET_URL, {
        auth: { token }
      });

      socketInstance.on('connect', () => {
        console.log(' Admin Dashboard connected to WebSocket');
        // Join admin room for all admin updates
        socketInstance.emit('joinAdminRoom');
      });

      // Listening for order updates from anywhere in the system
      socketInstance.on('orderUpdated', (updatedOrder: Order) => {
        console.log(' Real-time order update received:', updatedOrder);
        setOrders(prev => prev.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        ));
        setLastUpdate(new Date().toLocaleTimeString());
      });

      // Listening for new orders
      socketInstance.on('newOrderAvailable', () => {
        console.log(' New order created - refreshing data');
        fetchDashboardData();
      });

      // Listening for delivery partner updates
      socketInstance.on('deliveryStatusUpdated', (data: any) => {
        console.log(' Delivery status updated:', data);
        // Refresh delivery partners data
        fetchDeliveryPartners();
      });

      // Listen for admin-specific order assignments
      socketInstance.on('adminOrderUpdated', (data: any) => {
        console.log(' Admin order assignment:', data);
        fetchDashboardData();
      });

      socketInstance.on('connect_error', (error: any) => {
        console.error(' WebSocket connection error:', error);
      });

      setSocket(socketInstance);
    };

    // Initial data
    const loadData = async () => {
      setLoading(true);
      await fetchDashboardData();
      setLoading(false);
    };

    loadData();
    initializeSocket();

    return () => {
      if (socket) {
        socket.emit('leaveAdminRoom');
        socket.disconnect();
      }
    };
  }, []);

  // Separate function to fetch only delivery partners
  const fetchDeliveryPartners = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/delivery-partners`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch delivery partners');
      
      const result = await response.json();
      if (result.success) {
        setDeliveryPartners(result.deliveryPartners);
      }
    } catch (error) {
      console.error('Error fetching delivery partners:', error);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (!loading) {
      fetchDashboardData();
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col items-center py-2 mb-3">
            <h1 className="text-2xl font-bold text-gray-900">Hello Admin!</h1>
            <p className="text-gray-600 text-sm">
              Manage and monitor all order activities
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader size={48} className="animate-spin text-blue-600" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header Section */}
        <div className="flex flex-col items-center py-2 mb-3">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hello Admin!</h1>
              <p className="text-gray-600 text-sm">
                Manage and monitor all order activities
              </p>
              {lastUpdate && (
                <p className="text-xs text-gray-400 mt-1">
                  Last updated: {lastUpdate}
                </p>
              )}
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw 
                size={20} 
                className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} 
              />
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex gap-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Package size={18} />
                All Orders
                {orders.length > 0 && (
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                    {orders.length}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('partners')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'partners'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <User size={18} />
                Partners
                {deliveryPartners.length > 0 && (
                  <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                    {deliveryPartners.length}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'live'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Activity size={18} />
                Live Status
                {liveStats && (
                  <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                    {liveStats.todayOrders} today
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Real-time indicator */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Updates Active
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'orders' && (
            <OrdersTable 
              orders={orders} 
            />
          )}
          {activeTab === 'partners' && (
            <DeliveryPartners 
              partners={deliveryPartners}
            />
          )}
          {activeTab === 'live' && (
            <LiveStatus 
              stats={liveStats}
              orders={orders}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
