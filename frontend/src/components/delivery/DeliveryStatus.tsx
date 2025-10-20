import { CheckCircle2, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TimelineStep {
  id: number;
  title: string;
  status: 'current' | 'completed' | 'upcoming';
  label?: string;
  timestamp?: string;
}

function DeliveryStatus() {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<TimelineStep[]>([
    {
      id: 1,
      title: 'Picked Up',
      status: 'completed',
      label: 'Current',
      timestamp: new Date().toLocaleString()
    },
    {
      id: 2,
      title: 'On the Way',
      status: 'current',
    },
    {
      id: 3,
      title: 'Delivered',
      status: 'upcoming',
    }
  ]);

  const getCurrentDateTime = () => {
    return new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleMarkOnTheWay = () => {
    const currentStep = steps.find(step => step.status === 'current');
    
    setSteps(prevSteps => 
      prevSteps.map(step => {
        if (step.id === 2 && currentStep?.title === 'On the Way') {
          return { ...step, status: 'completed' as const, timestamp: getCurrentDateTime() };
        }
        if (step.id === 3 && currentStep?.title === 'On the Way') {
          return { ...step, status: 'current' as const, label: 'Current' };
        }
        if (step.id === 3 && currentStep?.title === 'Delivered') {
          return { ...step, status: 'completed' as const, timestamp: getCurrentDateTime() };
        }
        if (step.id === 1 && step.label) {
          return { ...step, label: undefined };
        }
        return step;
      })
    );

    // Navigate only when marking as delivered
    if (currentStep?.title === 'Delivered') {
      setTimeout(() => {
        navigate("/deliverydashboard");
      }, 1000);
    }
  };

  const getButtonText = () => {
    const currentStep = steps.find(step => step.status === 'current');
    if (currentStep?.title === 'On the Way') {
      return 'Mark as On the Way';
    } else if (currentStep?.title === 'Delivered') {
      return 'Mark as Delivered';
    }
    return 'Update Status';
  };

  const getButtonColor = () => {
    const currentStep = steps.find(step => step.status === 'current');
    if (currentStep?.title === 'On the Way') {
      return 'bg-blue-600 hover:bg-blue-700';
    } else if (currentStep?.title === 'Delivered') {
      return 'bg-green-600 hover:bg-green-700';
    }
    return 'bg-gray-600 hover:bg-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col justify-center items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Update Delivery Status</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Order Id: #1234567890
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
                      {step.timestamp}
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
              <p className="text-gray-600 mt-1">888 Elm Street, Suite 200</p>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <div className="fixed bottom-6 left-0 right-0 px-4">
          <div className="max-w-7xl mx-auto">
            <button 
              onClick={handleMarkOnTheWay}
              className={`w-full text-white py-4 rounded-xl font-semibold transition-colors shadow-lg ${getButtonColor()}`}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DeliveryStatus;