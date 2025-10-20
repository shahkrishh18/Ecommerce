import { Box, MapPin, Star, DollarSign, Package, Clock } from 'lucide-react';
import Logout from '../Logout';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  items: number;
  distance: string;
  pickup: string;
  delivery: string;
  eta: string;
  amount: number;
  priority: boolean;
}

function DeliveryDashboard() {

  const navigate = useNavigate();
  const stats = [
    {
      title: "Today's Earnings",
      value: "$127.50",
      icon: <DollarSign className="text-white" size={24} />,
      bgColor: "bg-green-500",
    },
    {
      title: "Deliveries Today",
      value: "12",
      icon: <Package className="text-white" size={24} />,
      bgColor: "bg-blue-500",
    },
    {
      title: "Rating",
      value: "4.9",
      icon: <Star className="text-white" size={24} />,
      bgColor: "bg-purple-500",
    },
  ];

  const orders: Order[] = [
    {
      id: "ORD-A8F2D",
      items: 5,
      distance: "2.3 km",
      pickup: "123 Market Street",
      delivery: "456 Oak Avenue, Apt 4B",
      eta: "15 mins",
      amount: 12.50,
      priority: true,
    },
    {
      id: "ORD-B3K9L",
      items: 3,
      distance: "1.8 km",
      pickup: "789 Main Street",
      delivery: "321 Pine Road",
      eta: "20 mins",
      amount: 8.75,
      priority: false,
    },
  ];

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
          {stats.map((stat) => (
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
            <h2 className="text-lg font-semibold">Available Orders (4)</h2>
            <span className="text-orange-600 font-medium">2 High Priority</span>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className={`border rounded-2xl p-6 ${order.priority ? 'border-orange-200 bg-orange-50/50' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Box className="text-green-600" size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{order.id}</span>
                        {order.priority && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                            High Priority
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{order.items} items</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold">${order.amount}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <MapPin className="text-blue-500 flex-shrink-0" size={18} />
                    <div>
                      <p className="text-sm font-medium">Pickup</p>
                      <p className="text-sm text-gray-600">{order.pickup}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <MapPin className="text-green-500 flex-shrink-0" size={18} />
                    <div>
                      <p className="text-sm font-medium">Delivery</p>
                      <p className="text-sm text-gray-600">{order.delivery}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    <span className="text-sm">{order.eta}</span>
                    <span className="text-sm">• {order.distance}</span>
                  </div>
                  <button onClick={() => navigate('/orderaccepted')} className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Accept Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryDashboard;
