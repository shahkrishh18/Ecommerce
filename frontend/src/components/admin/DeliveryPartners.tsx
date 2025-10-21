import { MapPin, Phone, Search, Star } from 'lucide-react';
import type { DeliveryPartner } from './AdminDashboard';

interface DeliveryPartnersProps {
  partners: DeliveryPartner[];
}

function DeliveryPartners({ partners }: DeliveryPartnersProps) {
  // Calculate stats from real data
  const calculateStats = () => {
    const totalPartners = partners.length;
    const active = partners.filter(partner => 
      partner.deliveryDetails.isAvailable && 
      partner.lastLogin && 
      new Date(partner.lastLogin).getTime() > Date.now() - 30 * 60 * 1000 // Active in last 30 mins
    ).length;
    const busy = partners.filter(partner => 
      !partner.deliveryDetails.isAvailable
    ).length;
    const offline = partners.filter(partner => 
      !partner.lastLogin || 
      new Date(partner.lastLogin).getTime() <= Date.now() - 30 * 60 * 1000
    ).length;

    return [
      { label: 'Total Partners', count: totalPartners, color: 'bg-purple-500' },
      { label: 'Active', count: active, color: 'bg-green-500' },
      { label: 'Busy', count: busy, color: 'bg-amber-500' },
      { label: 'Offline', count: offline, color: 'bg-slate-600' },
    ];
  };

  const stats = calculateStats();

  // Calculate today's earnings (mock calculation - replace with real data if available)
  const calculateTodaysEarnings = (partner: DeliveryPartner) => {
    // Mock calculation - in real app, calculate from today's deliveries
    const baseEarnings = partner.deliveryDetails.totalDeliveries * 0.5;
    return Math.round(baseEarnings * 100) / 100;
  };

  // Calculate today's deliveries (mock calculation)
  const calculateTodaysDeliveries = (partner: DeliveryPartner) => {
    // Mock calculation - in real app, count today's deliveries from orders
    return Math.floor(Math.random() * 8);
  };

  // Get partner status
  const getPartnerStatus = (partner: DeliveryPartner): 'Active' | 'Busy' | 'Offline' => {
    if (!partner.lastLogin || new Date(partner.lastLogin).getTime() <= Date.now() - 30 * 60 * 1000) {
      return 'Offline';
    }
    return partner.deliveryDetails.isAvailable ? 'Active' : 'Busy';
  };

  // Get area from current location (mock - replace with real geocoding if available)
  const getPartnerArea = (partner: DeliveryPartner) => {
    if (partner.deliveryDetails.currentLocation) {
      // Mock area based on coordinates - in real app, use reverse geocoding
      const areas = ['Downtown Area', 'North District', 'South Zone', 'East Side', 'West End'];
      return areas[Math.floor(Math.random() * areas.length)];
    }
    return 'Area not specified';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Delivery Partners</h1>
          <p className="text-gray-600">Manage your delivery partner network</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} 
                 className={`${stat.color} rounded-2xl p-6 text-white`}>
              <h3 className="text-4xl font-bold mb-1">{stat.count}</h3>
              <p className="text-white/90">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search partners by name, ID, or vehicle..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {partners.map((partner) => {
            const status = getPartnerStatus(partner);
            const partnerName = `${partner.profile.firstName} ${partner.profile.lastName}`;
            const todaysEarnings = calculateTodaysEarnings(partner);
            const todaysDeliveries = calculateTodaysDeliveries(partner);

            return (
              <div key={partner._id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xl font-medium text-gray-600">
                        {partner.profile.firstName.charAt(0)}{partner.profile.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{partnerName}</h3>
                      <p className="text-sm text-gray-500">ID: {partner._id.slice(-6).toUpperCase()}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {partner.deliveryDetails.rating.toFixed(1)} ({partner.deliveryDetails.totalDeliveries} deliveries)
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    status === 'Active' ? 'bg-green-100 text-green-700' :
                    status === 'Busy' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-600">Today</p>
                    <p className="font-medium">{todaysDeliveries} deliveries</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-600">Earnings</p>
                    <p className="font-medium">${todaysEarnings.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span>{partner.profile.phone || 'Phone not available'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{getPartnerArea(partner)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">🛵</span>
                    <span>
                      {partner.deliveryDetails.vehicleType} - {partner.deliveryDetails.vehicleNumber || 'No plate'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {partners.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Delivery Partners</h3>
            <p className="text-gray-600">No delivery partners are currently registered in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryPartners;