import Header from "../Header";
import { useState } from "react";
import { Package, User, Activity } from "lucide-react";
import DeliveryPartners from "./DeliveryPartners";
import OrdersTable from "./OrdersTable";
import LiveStatus from "./LiveStatus";

interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: 'Delivered' | 'On the Way' | 'Preparing' | 'Order Placed';
  partner: string;
  date: string;
}

function AdminDashboard() {

  const orders: Order[] = [
    {
      id: 'ORD-A8F2D',
      customer: 'John Doe',
      items: 5,
      total: 45.99,
      status: 'Delivered',
      partner: 'Mike Johnson',
      date: '2025-10-17 14:30'
    },
    {
      id: 'ORD-B3K9L',
      customer: 'Jane Smith',
      items: 3,
      total: 28.50,
      status: 'On the Way',
      partner: 'Sarah Williams',
      date: '2025-10-17 15:15'
    },
    {
      id: 'ORD-C7M4N',
      customer: 'Robert Brown',
      items: 2,
      total: 32.75,
      status: 'Preparing',
      partner: 'David Lee',
      date: '2025-10-17 16:45'
    },
    {
      id: 'ORD-D1P8Q',
      customer: 'Emily Davis',
      items: 4,
      total: 67.25,
      status: 'Order Placed',
      partner: 'Lisa Chen',
      date: '2025-10-17 17:20'
    },
  ];

  const [activeTab, setActiveTab] = useState<'orders' | 'partners' | 'live'>('orders');
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header Section */}
        <div className="flex flex-col items-center py-2 mb-3">
          <h1 className="text-2xl font-bold text-gray-900">Hello Admin!</h1>
          <p className="text-gray-600 text-sm">
            Manage and monitor all order activities
          </p>
        </div>

        {/* Toggle Navigation */}
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
              </span>
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="mt-6">
          {activeTab === 'orders' && (
            <OrdersTable orders={orders} />
          )}
          {activeTab === 'partners' && (
            <DeliveryPartners />
          )}
          {activeTab === 'live' && (
            <LiveStatus />
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;