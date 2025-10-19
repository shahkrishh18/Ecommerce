import { ArrowLeft, BoxIcon, MapPin, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { ReactNode } from "react";
type Step = {
  id: number;
  name: string;
  icon: ReactNode;
  status: "current" | "upcoming" | "complete";
};

function OrderCheckout() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Step definition with dynamic status
  const steps: Step[] = [
    {
      id: 1,
      name: "Cart Review",
      icon: <BoxIcon size={24} className="text-white" />,
      status:
        currentStep === 1 ? "current" : currentStep > 1 ? "complete" : "upcoming",
    },
    {
      id: 2,
      name: "Delivery Address",
      icon: <MapPin size={24} className="text-white" />,
      status:
        currentStep === 2 ? "current" : currentStep > 2 ? "complete" : "upcoming",
    },
    {
      id: 3,
      name: "Payment",
      icon: <CreditCard size={24} className="text-white" />,
      status: currentStep === 3 ? "current" : "upcoming",
    },
  ];

  // Navigation logic
  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
    else navigate("/OrderTracking");
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  // Render content based on step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-semibold mb-6">Cart Review</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                  <div>
                    <h3 className="font-medium">Product Name</h3>
                    <p className="text-sm text-gray-500">Quantity: 2</p>
                  </div>
                </div>
                <span className="font-semibold">$24.99</span>
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">$24.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">$5.00</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">$29.99</span>
                </div>
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h2 className="text-xl font-semibold mb-6">Delivery Address</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                  placeholder="123 Main Street, City, Country"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                    placeholder="123456"
                  />
                </div>
              </div>
            </form>
          </>
        );

      case 3:
        return (
          <>
            <h2 className="text-xl font-semibold mb-6">Payment</h2>
            <div className="space-y-4">
              <div className="border p-4 rounded-lg">
                <label className="flex items-center gap-2">
                  <input type="radio" name="payment" className="text-blue-600" />
                  Credit / Debit Card
                </label>
              </div>
              <div className="border p-4 rounded-lg">
                <label className="flex items-center gap-2">
                  <input type="radio" name="payment" className="text-blue-600" />
                  Cash on Delivery
                </label>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header section */}
        <div className="flex flex-row items-center gap-4 py-2 mb-4">
          <button
            onClick={() => navigate("CustomerDashboard")}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
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

        {/* Steps indicator */}
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

        {/* Content section */}
        <section className="bg-white shadow-md rounded-2xl p-8">
          <div className="max-w-4xl mx-auto">{renderStepContent()}</div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
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
