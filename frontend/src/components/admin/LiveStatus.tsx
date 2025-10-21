import { Activity, Box, CheckCircle, Clock, Truck } from 'lucide-react';

interface Order {
  _id: string;
  orderId: string;
  status: string;
  createdAt: string;
  customer: {
    profile: {
      firstName: string;
      lastName: string;
    };
  };
}

interface DeliveryPartner {
  _id: string;
  profile: {
    firstName: string;
    lastName: string;
  };
  deliveryDetails: {
    isAvailable: boolean;
    totalDeliveries: number;
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

interface LiveStatusProps {
  stats: LiveStats | null;
  orders: Order[];
}

function LiveStatus({ stats, orders }: LiveStatusProps) {
  // Calculate order distribution from real data
  const calculateOrderDistribution = () => {
    if (!orders.length) {
      return {
        placed: 0,
        preparing: 0,
        outForDelivery: 0,
        delivered: 0
      };
    }

    const placed = orders.filter(order => 
      ['pending', 'confirmed'].includes(order.status)
    ).length;

    const preparing = orders.filter(order => 
      ['preparing', 'ready'].includes(order.status)
    ).length;

    const outForDelivery = orders.filter(order => 
      ['assigned', 'picked_up', 'in_transit'].includes(order.status)
    ).length;

    const delivered = orders.filter(order => 
      order.status === 'delivered'
    ).length;

    const total = orders.length;

    return {
      placed,
      preparing,
      outForDelivery,
      delivered,
      placedPercent: total > 0 ? Math.round((placed / total) * 100) : 0,
      preparingPercent: total > 0 ? Math.round((preparing / total) * 100) : 0,
      outForDeliveryPercent: total > 0 ? Math.round((outForDelivery / total) * 100) : 0,
      deliveredPercent: total > 0 ? Math.round((delivered / total) * 100) : 0
    };
  };

  const distribution = calculateOrderDistribution();

  // Get recent order updates (last 10 orders)
  const recentOrderUpdates = orders
    .slice(0, 10)
    .map(order => ({
      id: order.orderId,
      status: order.status,
      time: getTimeAgo(order.createdAt),
      message: getStatusMessage(order.status, order.customer.profile.firstName)
    }));

  // Get active delivery partners from orders
  const getActiveDeliveryPartners = () => {
    const activePartners = new Map();
    
    orders.forEach(order => {
      if (order.status === 'assigned' || order.status === 'picked_up' || order.status === 'in_transit') {
        // Count orders per status for active deliveries
        // In a real app, you'd have actual partner data here
      }
    });

    // Mock data for demonstration - replace with real partner data
    return [
      { name: 'Delivery Partner 1', currentOrders: Math.floor(Math.random() * 3) + 1, isActive: true },
      { name: 'Delivery Partner 2', currentOrders: Math.floor(Math.random() * 3) + 1, isActive: true },
      { name: 'Delivery Partner 3', currentOrders: Math.floor(Math.random() * 2) + 1, isActive: true }
    ];
  };

  const activePartners = getActiveDeliveryPartners();

  // Helper function to get time ago
  function getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  }

  // Helper function to get status message
  function getStatusMessage(status: string, customerName: string): string {
    const messages: { [key: string]: string } = {
      'pending': `Order placed by ${customerName}`,
      'confirmed': `Order confirmed for ${customerName}`,
      'preparing': `Preparing order for ${customerName}`,
      'ready': `Order ready for ${customerName}`,
      'assigned': `Delivery assigned for ${customerName}`,
      'picked_up': `Order picked up for ${customerName}`,
      'in_transit': `Out for delivery to ${customerName}`,
      'delivered': `Order delivered to ${customerName}`,
      'cancelled': `Order cancelled by ${customerName}`,
      'failed': `Delivery failed for ${customerName}`
    };
    return messages[status] || `Order ${status} for ${customerName}`;
  }

  // Calculate delivery rate
  const deliveryRate = stats && stats.todayOrders > 0 
    ? Math.round((distribution.delivered / stats.todayOrders) * 100)
    : 0;

  // Calculate active deliveries
  const activeDeliveries = distribution.outForDelivery;

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Live Dashboard <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </h1>
            <p className="text-gray-600">Real-time order and partner tracking</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-purple-600 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/90">Total Orders Today</p>
                <h3 className="text-4xl font-bold mt-2">
                  {stats?.todayOrders || 0}
                </h3>
                <p className="text-sm text-white/80 mt-2">
                  {orders.length} total in system
                </p>
              </div>
              <Activity className="text-white/80" size={24} />
            </div>
          </div>

          <div className="bg-green-600 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/90">Delivery Rate</p>
                <h3 className="text-4xl font-bold mt-2">
                  {deliveryRate}%
                </h3>
                <p className="text-sm text-white/80 mt-2">
                  {distribution.delivered} delivered today
                </p>
              </div>
              <CheckCircle className="text-white/80" size={24} />
            </div>
          </div>

          <div className="bg-blue-600 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/90">Active Deliveries</p>
                <h3 className="text-4xl font-bold mt-2">
                  {activeDeliveries}
                </h3>
                <p className="text-sm text-white/80 mt-2">
                  In real-time
                </p>
              </div>
              <Truck className="text-white/80" size={24} />
            </div>
          </div>
        </div>

        {/* Order Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Order Status Distribution</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <Box className="text-blue-600 mb-2" size={24} />
              <p className="text-sm text-blue-600">Order Placed</p>
              <p className="text-2xl font-bold text-blue-700">{distribution.placed}</p>
              <p className="text-xs text-blue-500 mt-1">{distribution.placedPercent}%</p>
            </div>

            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-100">
              <Clock className="text-yellow-600 mb-2" size={24} />
              <p className="text-sm text-yellow-600">Preparing</p>
              <p className="text-2xl font-bold text-yellow-700">{distribution.preparing}</p>
              <p className="text-xs text-yellow-500 mt-1">{distribution.preparingPercent}%</p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
              <Truck className="text-purple-600 mb-2" size={24} />
              <p className="text-sm text-purple-600">Out for Delivery</p>
              <p className="text-2xl font-bold text-purple-700">{distribution.outForDelivery}</p>
              <p className="text-xs text-purple-500 mt-1">{distribution.outForDeliveryPercent}%</p>
            </div>

            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
              <CheckCircle className="text-green-600 mb-2" size={24} />
              <p className="text-sm text-green-600">Delivered</p>
              <p className="text-2xl font-bold text-green-700">{distribution.delivered}</p>
              <p className="text-xs text-green-500 mt-1">{distribution.deliveredPercent}%</p>
            </div>
          </div>
        </div>

        {/* Active Delivery Partners */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Active Delivery Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activePartners.map((partner, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{partner.name}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full 
                    ${partner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    Active
                  </span>
                </div>
                <div className="text-gray-600">
                  Current Orders: {partner.currentOrders}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Updates */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Live Order Updates</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {orders.length} Total
            </span>
          </div>
          <div className="space-y-4">
            {recentOrderUpdates.map(update => (
              <div key={update.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    update.status === 'delivered' ? 'bg-green-500' :
                    update.status === 'in_transit' ? 'bg-blue-500' :
                    update.status === 'picked_up' ? 'bg-purple-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="font-medium">{update.id}</p>
                    <p className="text-sm text-gray-600">{update.message}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{update.time}</span>
              </div>
            ))}
          </div>

          {recentOrderUpdates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No recent order updates
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveStatus;