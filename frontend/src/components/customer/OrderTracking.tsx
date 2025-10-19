import { ArrowLeft, Package, Box, Truck, CheckCircle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";
import type { JSX } from "react";

interface TimelineItem {
  title: string;
  time: string;
  status: 'completed' | 'in-progress' | 'pending';
  icon: JSX.Element;
}

function OrderTracking() {
  const navigate = useNavigate();

  const timeline: TimelineItem[] = [
    {
      title: 'Order Placed',
      time: '01:42 PM',
      status: 'completed',
      icon: <Package className="w-5 h-5" />
    },
    {
      title: 'Preparing',
      time: '01:42 PM',
      status: 'in-progress',
      icon: <Box className="w-5 h-5" />
    },
    {
      title: 'Out for Delivery',
      time: '',
      status: 'pending',
      icon: <Truck className="w-5 h-5" />
    },
    {
      title: 'Delivered',
      time: '',
      status: 'pending',
      icon: <CheckCircle className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-row items-center gap-4 py-2 mb-4">
          <button
            onClick={() => navigate("checkout")}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Tracking</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
                Track your order status and delivery details here
            </p>
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
          </section>

          {/* Order Details */}
          <section className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-6">Order Details</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-medium text-gray-900">Delivery Address</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      123 Main Street, Apartment 4B
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-4">Items (1)</h3>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Premium Snacks</p>
                      <p className="text-gray-500">× 1</p>
                    </div>
                  </div>
                  <span className="font-medium">$4.99</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>$8.38</span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-900">
                    <span>Total Amount</span>
                    <span>$8.38</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default OrderTracking;
