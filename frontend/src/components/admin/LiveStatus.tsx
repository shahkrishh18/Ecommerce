import { Activity, Box, CheckCircle, Clock, Truck } from 'lucide-react';

interface OrderUpdate {
  id: string;
  status: string;
  time: string;
  message: string;
}

interface ActivePartner {
  name: string;
  currentOrders: number;
  isActive: boolean;
}

function LiveStatus() {

  const orderUpdates: OrderUpdate[] = [
    {
      id: "ORD-123",
      status: "Delivered",
      time: "3 mins ago",
      message: "Order delivered successfully"
    },
    // Add more updates as needed
  ];

  const activePartners: ActivePartner[] = [
    { name: 'Mike Johnson', currentOrders: 3, isActive: true },
    { name: 'Sarah Williams', currentOrders: 1, isActive: true },
    { name: 'Emma Davis', currentOrders: 2, isActive: true }
  ];

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
                <h3 className="text-4xl font-bold mt-2">41</h3>
                <p className="text-sm text-white/80 mt-2">+12% from yesterday</p>
              </div>
              <Activity className="text-white/80" size={24} />
            </div>
          </div>

          <div className="bg-green-600 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/90">Delivery Rate</p>
                <h3 className="text-4xl font-bold mt-2">56.1%</h3>
                <p className="text-sm text-white/80 mt-2">Excellent performance</p>
              </div>
              <CheckCircle className="text-white/80" size={24} />
            </div>
          </div>

          <div className="bg-blue-600 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/90">Active Deliveries</p>
                <h3 className="text-4xl font-bold mt-2">8</h3>
                <p className="text-sm text-white/80 mt-2">In real-time</p>
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
              <p className="text-2xl font-bold text-blue-700">4</p>
              <p className="text-xs text-blue-500 mt-1">10%</p>
            </div>

            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-100">
              <Clock className="text-yellow-600 mb-2" size={24} />
              <p className="text-sm text-yellow-600">Preparing</p>
              <p className="text-2xl font-bold text-yellow-700">6</p>
              <p className="text-xs text-yellow-500 mt-1">15%</p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
              <Truck className="text-purple-600 mb-2" size={24} />
              <p className="text-sm text-purple-600">Out for Delivery</p>
              <p className="text-2xl font-bold text-purple-700">8</p>
              <p className="text-xs text-purple-500 mt-1">20%</p>
            </div>

            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
              <CheckCircle className="text-green-600 mb-2" size={24} />
              <p className="text-sm text-green-600">Delivered</p>
              <p className="text-2xl font-bold text-green-700">23</p>
              <p className="text-xs text-green-500 mt-1">56%</p>
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
              5 Active
            </span>
          </div>
          <div className="space-y-4">
            {orderUpdates.map(update => (
              <div key={update.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{update.id}</p>
                    <p className="text-sm text-gray-600">{update.message}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{update.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveStatus;
