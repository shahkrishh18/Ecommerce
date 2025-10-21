import { CheckCircle2, MapPin, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

interface TimelineStep {
  id: number;
  title: string;
  status: 'current' | 'completed' | 'upcoming';
  label?: string;
  timestamp?: string;
  backendStatus: string;
}

interface Order {
  _id: string;
  orderId: string;
  status: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  statusHistory: Array<{
    status: string;
    timestamp: string;
    note: string;
  }>;
  estimatedDelivery: string;
  createdAt: string;
}

function DeliveryStatus() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  
  // Get order ID from multiple sources
  const orderFromState = location.state?.order;
  const orderIdFromState = location.state?.orderId;
  const orderIdFromURL = new URLSearchParams(location.search).get('orderId');
  
  // Priority: state order > state orderId > URL orderId
  const orderId = orderFromState?._id || orderIdFromState || orderIdFromURL;

  useEffect(() => {
    if (orderFromState) {
      setOrder(orderFromState);
      setSteps(getTimelineFromOrder(orderFromState));
      setLoading(false);
    }
  }, [orderFromState]);

  const getTimelineFromOrder = (order: Order): TimelineStep[] => {
    const statusMap = {
      'assigned': { step: 0, title: 'Order Accepted' },
      'picked_up': { step: 1, title: 'Picked Up' },
      'in_transit': { step: 2, title: 'On the Way' },
      'delivered': { step: 3, title: 'Delivered' },
      'failed': { step: 3, title: 'Delivery Failed' }
    };

    const currentStatus = statusMap[order.status as keyof typeof statusMap] || statusMap.assigned;
    const currentStep = currentStatus.step;

    const timeline: TimelineStep[] = [
      {
        id: 1,
        title: 'Order Accepted',
        backendStatus: 'assigned',
        status: currentStep >= 0 ? 'completed' : 'upcoming',
        timestamp: order.statusHistory.find(h => h.status === 'assigned')?.timestamp || order.createdAt
      },
      {
        id: 2,
        title: 'Picked Up',
        backendStatus: 'picked_up',
        status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'upcoming',
        timestamp: order.statusHistory.find(h => h.status === 'picked_up')?.timestamp
      },
      {
        id: 3,
        title: 'On the Way',
        backendStatus: 'in_transit',
        status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'upcoming',
        timestamp: order.statusHistory.find(h => h.status === 'in_transit')?.timestamp
      },
      {
        id: 4,
        title: 'Delivered',
        backendStatus: 'delivered',
        status: currentStep >= 3 ? 'completed' : 'upcoming',
        timestamp: order.statusHistory.find(h => h.status === 'delivered')?.timestamp
      }
    ];

    const currentTimelineStep = timeline.find(step => step.status === 'current');
    if (currentTimelineStep) {
      currentTimelineStep.label = 'Current';
    }

    return timeline;
  };

  const [steps, setSteps] = useState<TimelineStep[]>([]);

  const fetchOrderStatus = async (id: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/delivery/status/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found or not assigned to you');
        }
        throw new Error(`Failed to fetch order status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setOrder(result.order);
        setSteps(getTimelineFromOrder(result.order));
      } else {
        throw new Error(result.message || 'Failed to load order status');
      }
    } catch (err: any) {
      console.error('Error fetching order status:', err);
    } finally {
      setLoading(false);
    }
  };

const updateDeliveryStatus = async (newStatus: string) => {
  try {
    setUpdating(true);
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/delivery/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus,
        note: `Status updated to ${newStatus}`
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update status');
    }

    const result = await response.json();
    
    if (result.success) {
      setOrder(result.order);
      setSteps(getTimelineFromOrder(result.order));
      
      // If delivered, navigate back to dashboard after delay
      if (newStatus === 'delivered') {
        setTimeout(() => {
          navigate("/deliverydashboard");
        }, 2000);
      }
    }
  } catch (err: any) {
    console.error('Error updating status:', err);
    alert(err.message || 'Failed to update status. Please try again.');
  } finally {
    setUpdating(false);
  }
};
  // Get next status to update to
  const getNextStatus = (): string | null => {
    if (!order) return null;
    
    const statusFlow = {
      'assigned': 'picked_up',
      'picked_up': 'in_transit', 
      'in_transit': 'delivered'
    };
    
    return statusFlow[order.status as keyof typeof statusFlow] || null;
  };

  const handleStatusUpdate = () => {
    const nextStatus = getNextStatus();
    if (nextStatus) {
      updateDeliveryStatus(nextStatus);
    }
  };

  const getButtonText = () => {
    const nextStatus = getNextStatus();
    if (!nextStatus) return 'Delivery Completed';
    
    const buttonTexts = {
      'picked_up': 'Mark as Picked Up',
      'in_transit': 'Mark as On the Way', 
      'delivered': 'Mark as Delivered'
    };
    
    return buttonTexts[nextStatus as keyof typeof buttonTexts] || 'Update Status';
  };

  const getButtonColor = () => {
    const nextStatus = getNextStatus();
    if (!nextStatus) return 'bg-gray-600 hover:bg-gray-700';
    
    const buttonColors = {
      'picked_up': 'bg-blue-600 hover:bg-blue-700',
      'in_transit': 'bg-purple-600 hover:bg-purple-700',
      'delivered': 'bg-green-600 hover:bg-green-700'
    };
    
    return buttonColors[nextStatus as keyof typeof buttonColors] || 'bg-gray-600 hover:bg-gray-700';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // WebSocket setup
  useEffect(() => {
    if (!orderId) {
      console.log('❌ No order ID available');
      setLoading(false);
      return;
    }

    // If we don't have order data, fetch it
    if (!orderFromState) {
      fetchOrderStatus(orderId);
    }

    let socketInstance: any;

    const initializeSocket = () => {
      const token = localStorage.getItem('token');
      
      socketInstance = io(SOCKET_URL, {
        auth: { token }
      });

      socketInstance.on('connect', () => {
        console.log(' Delivery Status connected to WebSocket');
        socketInstance.emit('joinOrder', orderId);
      });

      socketInstance.on('orderUpdated', (updatedOrder: Order) => {
        console.log('Order update received:', updatedOrder);
        setOrder(updatedOrder);
        setSteps(getTimelineFromOrder(updatedOrder));
      });

      socketInstance.on('deliveryStatusUpdated', (data: any) => {
        console.log(' Delivery status update:', data);
        fetchOrderStatus(orderId);
      });

      socketInstance.on('connect_error', (error: any) => {
        console.error('WebSocket connection error:', error);
      });

      setSocket(socketInstance);
    };

    initializeSocket();

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col justify-center items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Update Delivery Status</h1>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader size={48} className="animate-spin text-blue-600" />
          </div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col justify-center items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Update Delivery Status</h1>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-red-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-4">Unable to load order details</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col justify-center items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Update Delivery Status</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Order ID: {order.orderId}
          </p>
        </div>

        {/* Timeline Section */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-lg mb-6">Delivery Timeline</h2>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="relative flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-500' :
                    step.status === 'current' ? 'bg-blue-500' :
                    'bg-gray-200'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <div className={`w-3 h-3 rounded-full ${
                        step.status === 'current' ? 'bg-white' : 'bg-gray-400'
                      }`} />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 h-16 ${
                      step.status === 'completed' ? 'bg-green-500' : 
                      step.status === 'current' ? 'bg-blue-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${
                      step.status === 'completed' ? 'text-green-600' :
                      step.status === 'current' ? 'text-blue-600' :
                      'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                    {step.label && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                        {step.label}
                      </span>
                    )}
                  </div>
                  {step.timestamp && (
                    <p className="text-sm text-gray-500">
                      {formatTimestamp(step.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Address Section */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <MapPin className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="font-medium">Delivery Address</h3>
              <p className="text-gray-600 mt-1">
                {order.deliveryAddress.street}, {order.deliveryAddress.city}
              </p>
              <p className="text-sm text-gray-500">
                {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
              </p>
            </div>
          </div>
        </section>

        {/* Estimated Delivery */}
        {order.estimatedDelivery && (
          <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CheckCircle2 className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium">Estimated Delivery</h3>
                <p className="text-gray-600 mt-1">
                  {new Date(order.estimatedDelivery).toLocaleString()}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Action Button */}
        <div className=" bottom-6 left-0 right-0 px-4">
          <div className="max-w-7xl mx-auto">
            <button 
              onClick={handleStatusUpdate}
              disabled={updating || !getNextStatus()}
              className={`w-full text-white py-4 rounded-xl font-semibold transition-colors shadow-lg ${
                updating ? 'bg-gray-400 cursor-not-allowed' : getButtonColor()
              }`}
            >
              {updating ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader size={20} className="animate-spin" />
                  Updating...
                </div>
              ) : (
                getButtonText()
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DeliveryStatus;