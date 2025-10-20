import { ArrowLeft, MapPin, Phone, Navigation, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

function OrderAccepted() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-row items-center gap-4 py-2 mb-4">
          <button
            onClick={() => navigate("deliverydashboard")}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Order Accepted
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Order Id: #1234567890
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
                  <p className="text-gray-600 mt-1">555 Commerce Plaza</p>
                  <button className="flex items-center gap-2 text-blue-600 text-sm font-medium mt-2">
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
                      3.5 km
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    888 Elm Street, Suite 200
                  </p>
                  <button className="flex items-center gap-2 text-blue-600 text-sm font-medium mt-2">
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
                  <span className="text-purple-600 font-medium">JD</span>
                </div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <button className="p-2 bg-green-50 rounded-lg">
                <Phone className="text-green-600" size={20} />
              </button>
            </div>
          </section>

          {/* Items to Deliver */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Items to Deliver</h2>
              <span className="text-sm font-medium text-gray-500">8 items</span>
            </div>
            <div className="space-y-3">
              {(
                [
                  { name: "Fresh Vegetables Mix", qty: 2 },
                  { name: "Organic Fruits Basket", qty: 1 },
                  { name: "Premium Snacks", qty: 2 },
                ] as const
              ).map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Package size={18} className="text-gray-600" />
                  </div>
                  <span className="flex-1">{item.name}</span>
                  <span className="text-sm text-gray-500">Qty: {item.qty}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery Instructions */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">Delivery Instructions</h2>
            <p className="text-gray-600">
              Ring the doorbell twice. If no answer, leave the package at the door
              and take a photo.
            </p>
          </section>

          
        {/* Start Delivery Button */}
        <div className=" left-1/2 w-full px-4 sm:px-6 lg:px-8">
          <button onClick={()=>navigate('/deliverystatus')} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-colors duration-200">
            Start Delivery
          </button>
        </div>
        </div>

        
      </main>
    </div>
  );
}

export default OrderAccepted;
