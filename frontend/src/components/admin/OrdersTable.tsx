// import { Eye, Search, Truck, Clock, Package, CheckCircle, Users, Loader } from 'lucide-react';
// import { useState } from 'react';

// interface Order {
//   _id: string;
//   orderId: string;
//   status: string;
//   customer: {
//     profile: {
//       firstName: string;
//       lastName: string;
//     };
//   };
//   deliveryPartner?: {
//     profile: {
//       firstName: string;
//       lastName: string;
//     };
//   };
//   items: Array<{
//     product: {
//       name: string;
//     };
//     quantity: number;
//   }>;
//   total: number;
//   createdAt: string;
// }

// interface DeliveryPartner {
//   _id: string;
//   profile: {
//     firstName: string;
//     lastName: string;
//   };
//   deliveryDetails: {
//     isAvailable: boolean;
//   };
// }

// interface OrdersTableProps {
//   orders: Order[];
//   deliveryPartners: DeliveryPartner[];
//   onAssignDeliveryPartner: (orderId: string, partnerId: string) => Promise<boolean>;
// }

// function OrdersTable({ orders, deliveryPartners, onAssignDeliveryPartner }: OrdersTableProps) {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [assigningOrder, setAssigningOrder] = useState<string | null>(null);
//   const [selectedPartner, setSelectedPartner] = useState<{ [key: string]: string }>({});

//   // Calculate stats from real data
//   const calculateStats = () => {
//     const totalOrders = orders.length;
//     const delivered = orders.filter(order => order.status === 'delivered').length;
//     const inProgress = orders.filter(order => 
//       ['assigned', 'picked_up', 'in_transit', 'ready', 'preparing', 'confirmed'].includes(order.status)
//     ).length;
//     const pending = orders.filter(order => order.status === 'pending').length;

//     return [
//       { 
//         title: 'Total Orders', 
//         value: totalOrders.toString(), 
//         color: 'bg-purple-600', 
//         textColor: 'text-purple-600',
//         icon: <Package className="text-white" size={24} />,
//         bgGradient: 'from-purple-500 to-purple-600'
//       },
//       { 
//         title: 'Delivered', 
//         value: delivered.toString(), 
//         color: 'bg-green-600',
//         textColor: 'text-green-600',
//         icon: <CheckCircle className="text-white" size={24} />,
//         bgGradient: 'from-green-500 to-green-600'
//       },
//       { 
//         title: 'In Progress', 
//         value: inProgress.toString(), 
//         color: 'bg-blue-600',
//         textColor: 'text-blue-600',
//         icon: <Truck className="text-white" size={24} />,
//         bgGradient: 'from-blue-500 to-blue-600'
//       },
//       { 
//         title: 'Pending', 
//         value: pending.toString(), 
//         color: 'bg-orange-600',
//         textColor: 'text-orange-600',
//         icon: <Clock className="text-white" size={24} />,
//         bgGradient: 'from-orange-500 to-orange-600'
//       },
//     ];
//   };

//   const stats = calculateStats();

//   // Filter orders based on search and status
//   const filteredOrders = orders.filter(order => {
//     const matchesSearch = 
//       order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.customer.profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.customer.profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (order.deliveryPartner?.profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//        order.deliveryPartner?.profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()));

//     const matchesStatus = 
//       statusFilter === 'all' || 
//       order.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   // Get available delivery partners
//   const availablePartners = deliveryPartners.filter(partner => 
//     partner.deliveryDetails.isAvailable
//   );

//   // Format status for display
//   const formatStatus = (status: string) => {
//     const statusMap: { [key: string]: string } = {
//       'pending': 'Order Placed',
//       'confirmed': 'Confirmed',
//       'preparing': 'Preparing',
//       'ready': 'Ready',
//       'assigned': 'Assigned',
//       'picked_up': 'Picked Up',
//       'in_transit': 'On the Way',
//       'delivered': 'Delivered',
//       'cancelled': 'Cancelled',
//       'failed': 'Failed'
//     };
//     return statusMap[status] || status;
//   };

//   // Get status color
//   const getStatusColor = (status: string) => {
//     const colorMap: { [key: string]: string } = {
//       'delivered': 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-200',
//       'in_transit': 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border border-purple-200',
//       'picked_up': 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200',
//       'assigned': 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200',
//       'ready': 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-200',
//       'preparing': 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-200',
//       'confirmed': 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border border-orange-200',
//       'pending': 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200',
//       'cancelled': 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-200',
//       'failed': 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-200'
//     };
//     return colorMap[status] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200';
//   };

//   // Handle partner assignment
//   const handleAssignPartner = async (orderId: string) => {
//     const partnerId = selectedPartner[orderId];
//     if (!partnerId) {
//       alert('Please select a delivery partner');
//       return;
//     }

//     setAssigningOrder(orderId);
//     try {
//       const success = await onAssignDeliveryPartner(orderId, partnerId);
//       if (success) {
//         setSelectedPartner(prev => ({ ...prev, [orderId]: '' }));
//       }
//     } catch (error) {
//       console.error('Error assigning partner:', error);
//     } finally {
//       setAssigningOrder(null);
//     }
//   };

//   // Calculate total items
//   const calculateTotalItems = (order: Order) => {
//     return order.items.reduce((sum, item) => sum + item.quantity, 0);
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div>
//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat) => (
//           <div 
//             key={stat.title} 
//             className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 shadow-lg text-white`}
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-white/90 text-sm font-medium">{stat.title}</h3>
//                 <p className="text-3xl font-bold mt-2">
//                   {stat.value}
//                 </p>
//               </div>
//               <div className="p-3 bg-white/20 rounded-xl">
//                 {stat.icon}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Table Controls */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
//         <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search orders, customers, or partners..."
//               className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <div className="flex gap-3">
//             <select 
//               className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="all">All Status</option>
//               <option value="delivered">Delivered</option>
//               <option value="in_transit">On the Way</option>
//               <option value="picked_up">Picked Up</option>
//               <option value="assigned">Assigned</option>
//               <option value="ready">Ready</option>
//               <option value="preparing">Preparing</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="pending">Order Placed</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//             <select className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
//               <option>Today</option>
//               <option>This Week</option>
//               <option>This Month</option>
//             </select>
//             <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md">
//               Export
//             </button>
//           </div>
//         </div>

//         {/* Orders Table */}
//         <div className="rounded-xl overflow-hidden border border-gray-200">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Order ID</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Items</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Total</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Partner</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date & Time</th>
//                 <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.map((order, index) => (
//                 <tr 
//                   key={order._id} 
//                   className={`border-b border-gray-100 transition-colors hover:bg-blue-50/50 ${
//                     index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
//                   }`}
//                 >
//                   <td className="py-4 px-6 font-medium text-gray-900">{order.orderId}</td>
//                   <td className="py-4 px-6">
//                     <div className="flex items-center gap-3">
//                       <span className="font-medium text-gray-900">
//                         {order.customer.profile.firstName} {order.customer.profile.lastName}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="py-4 px-6 text-gray-700">{calculateTotalItems(order)}</td>
//                   <td className="py-4 px-6 font-bold text-green-600">${order.total.toFixed(2)}</td>
//                   <td className="py-4 px-6">
//                     <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
//                       {formatStatus(order.status)}
//                     </span>
//                   </td>
//                   <td className="py-4 px-6">
//                     {order.deliveryPartner ? (
//                       <div className="flex items-center gap-2">
//                         <span className="text-gray-700">
//                           {order.deliveryPartner.profile.firstName} {order.deliveryPartner.profile.lastName}
//                         </span>
//                       </div>
//                     ) : (
//                       <div className="flex flex-col gap-2">
//                         <select
//                           value={selectedPartner[order._id] || ''}
//                           onChange={(e) => setSelectedPartner(prev => ({
//                             ...prev,
//                             [order._id]: e.target.value
//                           }))}
//                           className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                           disabled={assigningOrder === order._id}
//                         >
//                           <option value="">Assign Partner</option>
//                           {availablePartners.map(partner => (
//                             <option key={partner._id} value={partner._id}>
//                               {partner.profile.firstName} {partner.profile.lastName}
//                             </option>
//                           ))}
//                         </select>
//                         {selectedPartner[order._id] && (
//                           <button
//                             onClick={() => handleAssignPartner(order._id)}
//                             disabled={assigningOrder === order._id}
//                             className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             {assigningOrder === order._id ? (
//                               <Loader size={12} className="animate-spin mx-auto" />
//                             ) : (
//                               'Assign'
//                             )}
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   </td>
//                   <td className="py-4 px-6 text-gray-600 text-sm">
//                     {formatDate(order.createdAt)}
//                   </td>
//                   <td className="py-4 px-6">
//                     <button 
//                       className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all shadow-sm"
//                       title="View Order Details"
//                     >
//                       <Eye size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredOrders.length === 0 && (
//             <div className="text-center py-12">
//               <Package size={48} className="text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
//               <p className="text-gray-600">
//                 {searchTerm || statusFilter !== 'all' 
//                   ? 'Try adjusting your search or filters' 
//                   : 'No orders in the system yet'
//                 }
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OrdersTable;

import { Eye, Search, Truck, Clock, Package, CheckCircle } from 'lucide-react';
import { useState } from 'react';

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

interface OrdersTableProps {
  orders: Order[];
}

function OrdersTable({ orders }: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Stats
  const calculateStats = () => {
    const totalOrders = orders.length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const inProgress = orders.filter(o =>
      ['assigned', 'picked_up', 'in_transit', 'ready', 'preparing', 'confirmed'].includes(o.status)
    ).length;
    const pending = orders.filter(o => o.status === 'pending').length;

    return [
      { title: 'Total Orders', value: totalOrders.toString(), bg: 'from-purple-500 to-purple-600', icon: <Package className="text-white" size={24} /> },
      { title: 'Delivered', value: delivered.toString(), bg: 'from-green-500 to-green-600', icon: <CheckCircle className="text-white" size={24} /> },
      { title: 'In Progress', value: inProgress.toString(), bg: 'from-blue-500 to-blue-600', icon: <Truck className="text-white" size={24} /> },
      { title: 'Pending', value: pending.toString(), bg: 'from-orange-500 to-orange-600', icon: <Clock className="text-white" size={24} /> },
    ];
  };

  const stats = calculateStats();

  // Filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.deliveryPartner &&
        `${order.deliveryPartner.profile.firstName} ${order.deliveryPartner.profile.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatStatus = (status: string) => {
    const map: Record<string, string> = {
      pending: 'Order Placed',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      ready: 'Ready',
      assigned: 'Assigned',
      picked_up: 'Picked Up',
      in_transit: 'On the Way',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      failed: 'Failed',
    };
    return map[status] || status;
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      delivered: 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-200',
      in_transit: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border border-purple-200',
      picked_up: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200',
      assigned: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200',
      ready: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-200',
      preparing: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-200',
      confirmed: 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border border-orange-200',
      pending: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200',
      cancelled: 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-200',
      failed: 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-200',
    };
    return map[status] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200';
  };

  const calculateTotalItems = (order: Order) =>
    order.items.reduce((sum, item) => sum + item.quantity, 0);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => (
          <div
            key={stat.title}
            className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-6 shadow-lg text-white`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/90 text-sm font-medium">{stat.title}</h3>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search orders, customers, or partners..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="in_transit">On the Way</option>
              <option value="picked_up">Picked Up</option>
              <option value="assigned">Assigned</option>
              <option value="ready">Ready</option>
              <option value="preparing">Preparing</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Order Placed</option>
              <option value="cancelled">Cancelled</option>
            </select>
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
              {filteredOrders.map((order, index) => (
                <tr
                  key={order._id}
                  className={`border-b border-gray-100 hover:bg-blue-50/50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="py-4 px-6 font-medium text-gray-900">{order.orderId}</td>
                  <td className="py-4 px-6 text-gray-900">
                    {order.customer.profile.firstName} {order.customer.profile.lastName}
                  </td>
                  <td className="py-4 px-6 text-gray-700">{calculateTotalItems(order)}</td>
                  <td className="py-4 px-6 font-bold text-green-600">${order.total.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {order.deliveryPartner ? (
                      `${order.deliveryPartner.profile.firstName} ${order.deliveryPartner.profile.lastName}`
                    ) : (
                      <span className="text-gray-400 italic">Not Assigned</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">{formatDate(order.createdAt)}</td>
                  <td className="py-4 px-6">
                    <button
                      className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all shadow-sm"
                      title="View Order Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No orders in the system yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersTable;
