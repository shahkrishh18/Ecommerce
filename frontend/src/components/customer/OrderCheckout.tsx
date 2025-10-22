import { ArrowLeft, BoxIcon, MapPin, CreditCard, Loader } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface CartItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

type Step = {
  id: number;
  name: string;
  icon: ReactNode;
  status: "current" | "upcoming" | "complete";
};

function OrderCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    instructions: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    if (location.state?.cart) {
      setCart(location.state.cart);
    } else {
      // If no cart data, redirect back to customer dashboard
      navigate('/customer');
    }
  }, [location.state, navigate]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 49;
  const tax = subtotal * 0.18;
  const total = subtotal + deliveryFee + tax;

  const steps: Step[] = [
    {
      id: 1,
      name: "Cart Review",
      icon: <BoxIcon size={24} className="text-white" />,
      status: currentStep === 1 ? "current" : currentStep > 1 ? "complete" : "upcoming",
    },
    {
      id: 2,
      name: "Delivery Address",
      icon: <MapPin size={24} className="text-white" />,
      status: currentStep === 2 ? "current" : currentStep > 2 ? "complete" : "upcoming",
    },
    {
      id: 3,
      name: "Payment",
      icon: <CreditCard size={24} className="text-white" />,
      status: currentStep === 3 ? "current" : "upcoming",
    },
  ];

  const createOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const orderData = {
        items: cart.map(item => ({
          productId: item.product,
          quantity: item.quantity
        })),
        deliveryAddress: {
          type: 'home',
          street: deliveryAddress.street,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          zipCode: deliveryAddress.zipCode,
          instructions: deliveryAddress.instructions || 'No special instructions'
        },
        paymentMethod: paymentMethod,
        customerLocation: {
          lat: 40.7128,
          lng: -74.0060
        }
      };

      console.log('Sending order data:', orderData);

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create order: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err: any) {
      console.error('Order creation error:', err);
      throw err;
    }
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError('');

      if (!deliveryAddress.fullName || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zipCode) {
        setError('Please fill in all required delivery address fields');
        setLoading(false);
        return;
      }
      const result = await createOrder();
      
      if (result.success) {
        navigate('/ordertracking', { 
          state: { 
            orderId: result.order._id
          } 
        });
      }
    } catch (err: any) {
      console.error('Order placement error:', err);
      
      // Handle specific error cases
      if (err.message.includes('orderId') || err.message.includes('validation failed')) {
        setError('Order creation failed due to server validation. Please try again.');
      } else if (err.message.includes('Token') || err.message.includes('auth')) {
        setError('Authentication failed. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleAddressChange = (field: string, value: string) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Render content based on step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-semibold mb-6">Cart Review</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-4">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 bg-gray-100 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <BoxIcon size={20} className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h2 className="text-xl font-semibold mb-6">Delivery Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={deliveryAddress.fullName}
                  onChange={(e) => handleAddressChange('fullName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <textarea
                  value={deliveryAddress.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Main Street, Apartment 4B"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    value={deliveryAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    value={deliveryAddress.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="NY"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                  <input
                    type="text"
                    value={deliveryAddress.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Instructions</label>
                  <input
                    type="text"
                    value={deliveryAddress.instructions}
                    onChange={(e) => handleAddressChange('instructions', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Leave at front door, ring bell, etc."
                  />
                </div>
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
            <div className="space-y-4">
              <div className={`border-2 p-4 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500" 
                  />
                  <CreditCard size={20} />
                  <span className="font-medium">Credit / Debit Card</span>
                </label>
              </div>
              
              <div className={`border-2 p-4 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="font-medium">Cash on Delivery</span>
                </label>
              </div>

              <div className={`border-2 p-4 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'digital_wallet' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="digital_wallet"
                    checked={paymentMethod === 'digital_wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="font-medium">Digital Wallet</span>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2 font-semibold text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (cart.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BoxIcon size={32} className="text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Please add some products before checkout</p>
          <button
            onClick={() => navigate('/customer')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header section */}
        <div className="flex flex-row items-center gap-4 py-2 mb-4">
          <button
            onClick={() => navigate("/customer")}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
            disabled={loading}
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Checkout</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Review and confirm your order details.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}
        <section className="bg-white shadow-md rounded-2xl p-5 mb-6">
          <div className="grid grid-cols-3 items-center max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center justify-center relative">
                <div className="flex flex-col items-center">
                  <div
                    className={`p-3 rounded-full ${
                      step.status === "current"
                        ? "bg-blue-600"
                        : step.status === "complete"
                        ? "bg-green-600"
                        : "bg-gray-200"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`text-sm font-medium mt-2 ${
                      step.status === "current"
                        ? "text-blue-600"
                        : step.status === "complete"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-1/2 w-full h-1 top-6 -z-10 ${
                      step.status === "complete" ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white shadow-md rounded-2xl p-8">
          <div className="max-w-4xl mx-auto">{renderStepContent()}</div>

          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              {currentStep === 1
                ? "Continue to Delivery"
                : currentStep === 2
                ? "Continue to Payment"
                : "Place Order"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default OrderCheckout;
