import { ArrowLeft, MapPin, Phone, Navigation, Package, Loader } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const API_BASE_URL = 'http://localhost:5000/api';

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
}

function OrderAccepted() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get order from navigation state or fetch it
  const orderId = location.state?.order?._id;

  // Fetch order details
  const fetchOrder = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/delivery/order/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const result = await response.json();
      
      if (result.success) {
        setOrder(result.order);
      } else {
        throw new Error(result.message || 'Failed to load order');
      }
    } catch (err: any) {
      console.error('Error fetching order:', err);
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance (mock function)
  const calculateDistance = (): string => {
    const distances = ['1.2 km', '2.3 km', '0.8 km', '3.1 km', '1.5 km'];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  // Handle navigation to maps
  const handleNavigate = (address: string, type: 'pickup' | 'delivery') => {
    const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(mapUrl, '_blank');
  };

  // Handle phone call
  const handleCall = (phoneNumber?: string) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`);
    } else {
      alert('Phone number not available');
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    } else {
      setError('No order information available');
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-row items-center gap-4 py-2 mb-4">
            <button
              onClick={() => navigate("/deliverydashboard")}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Order Accepted
              </h1>
            </div>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader size={48} className="animate-spin text-blue-600" />
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
              onClick={() => navigate("/deliverydashboard")}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Order Accepted
              </h1>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-red-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Order</h2>
            <p className="text-gray-600 mb-4">{error || 'Order not found'}</p>
            <button
              onClick={() => navigate("/deliverydashboard")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const customerName = order.customer.profile 
    ? `${order.customer.profile.firstName} ${order.customer.profile.lastName}`
    : 'Customer';
  
  const customerInitials = order.customer.profile 
    ? `${order.customer.profile.firstName?.[0] || ''}${order.customer.profile.lastName?.[0] || ''}`
    : 'C';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-row items-center gap-4 py-2 mb-4">
          <button
            onClick={() => navigate("/deliverydashboard")}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Order Accepted
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Order ID: {order.orderId}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Order Details Card */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">Order Details</h2>
            <div className="space-y-6">
              {/* Pickup Location */}
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin className="text-blue-600" size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">Pickup Location</h3>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                      Start Here
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">Restaurant Location</p>
                  <p className="text-sm text-gray-500">Near {order.deliveryAddress.city}</p>
                  <button 
                    onClick={() => handleNavigate(`Restaurant near ${order.deliveryAddress.city}`, 'pickup')}
                    className="flex items-center gap-2 text-blue-600 text-sm font-medium mt-2"
                  >
                    <Navigation size={16} />
                    Navigate
                  </button>
                </div>
              </div>

              {/* Delivery Location */}
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <MapPin className="text-green-600" size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">Delivery Location</h3>
                    <span className="text-xs text-gray-500 font-medium">
                      {calculateDistance()}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    {order.deliveryAddress.street}, {order.deliveryAddress.city}
                  </p>
                  <button 
                    onClick={() => handleNavigate(order.deliveryAddress.street, 'delivery')}
                    className="flex items-center gap-2 text-blue-600 text-sm font-medium mt-2"
                  >
                    <Navigation size={16} />
                    Navigate
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Customer Contact */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">Customer Contact</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-medium">{customerInitials}</span>
                </div>
                <div>
                  <p className="font-medium">{customerName}</p>
                  <p className="text-gray-600">
                    {order.customer.profile?.phone || 'Phone not available'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleCall(order.customer.profile?.phone)}
                className="p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Phone className="text-green-600" size={20} />
              </button>
            </div>
          </section>

          {/* Items to Deliver */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Items to Deliver</h2>
              <span className="text-sm font-medium text-gray-500">{totalItems} items</span>
            </div>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Package size={18} className="text-gray-600" />
                  </div>
                  <span className="flex-1">{item.product.name}</span>
                  <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery Instructions */}
          {order.deliveryAddress.instructions && (
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-lg mb-4">Delivery Instructions</h2>
              <p className="text-gray-600">
                {order.deliveryAddress.instructions}
              </p>
            </section>
          )}

          {/* Start Delivery Button */}
          <div className="pb-6">
            <button 
              onClick={() => navigate('/deliverystatus', { state: { order, orderId: order._id } })}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-colors duration-200"
            >
              Start Delivery
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderAccepted;