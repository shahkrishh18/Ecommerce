import { Eye, Search, Truck, Clock, Package, CheckCircle } from 'lucide-react';

function OrdersTable({ orders }: { orders: any[] }) {
    const stats = [
    { 
      title: 'Total Orders', 
      value: '6', 
      color: 'bg-purple-600', 
      textColor: 'text-purple-600',
      icon: <Package className="text-white" size={24} />,
      bgGradient: 'from-purple-500 to-purple-600'
    },
    { 
      title: 'Delivered', 
      value: '2', 
      color: 'bg-green-600',
      textColor: 'text-green-600',
      icon: <CheckCircle className="text-white" size={24} />,
      bgGradient: 'from-green-500 to-green-600'
    },
    { 
      title: 'In Progress', 
      value: '3', 
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
      icon: <Truck className="text-white" size={24} />,
      bgGradient: 'from-blue-500 to-blue-600'
    },
    { 
      title: 'Pending', 
      value: '1', 
      color: 'bg-orange-600',
      textColor: 'text-orange-600',
      icon: <Clock className="text-white" size={24} />,
      bgGradient: 'from-orange-500 to-orange-600'
    },
  ];
  return (
    <div>
    {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div 
              key={stat.title} 
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 shadow-lg text-white`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white/90 text-sm font-medium">{stat.title}</h3>
                  <p className="text-3xl font-bold mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search orders, customers, or partners..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                <option>All Status</option>
                <option>Delivered</option>
                <option>On the Way</option>
                <option>Preparing</option>
                <option>Order Placed</option>
              </select>
              <select className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md">
                Export
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Items</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Total</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Partner</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date & Time</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr 
                    key={order.id} 
                    className={`border-b border-gray-100 transition-colors hover:bg-blue-50/50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">{order.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        
                        <span className="font-medium text-gray-900">{order.customer}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{order.items}</td>
                    <td className="py-4 px-6 font-bold text-green-600">${order.total}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        order.status === 'Delivered' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-200' :
                        order.status === 'On the Way' ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border border-purple-200' :
                        order.status === 'Preparing' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-200' :
                        'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">{order.partner}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{order.date}</td>
                    <td className="py-4 px-6">
                      <button className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all shadow-sm">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  )
}

export default OrdersTable
