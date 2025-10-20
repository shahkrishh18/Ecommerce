
import { MapPin, Phone, Search, Star } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  status: 'Active' | 'Busy' | 'Offline';
  rating: number;
  deliveries: number;
  earnings: number;
  phone: string;
  area: string;
  vehicle: string;
  image?: string;
}

function DeliveryPartners() {
  const stats = [
    { label: 'Total Partners', count: 5, color: 'bg-purple-500' },
    { label: 'Active', count: 2, color: 'bg-green-500' },
    { label: 'Busy', count: 2, color: 'bg-amber-500' },
    { label: 'Offline', count: 1, color: 'bg-slate-600' },
  ];

  const partners: Partner[] = [
    {
      id: 'DP-001',
      name: 'Mike Johnson',
      status: 'Busy',
      rating: 4.9,
      deliveries: 342,
      earnings: 127.50,
      phone: '+1 (555) 123-4567',
      area: 'Downtown Area',
      vehicle: 'Bike - ABC-1234'
    },
    {
      id: 'DP-002',
      name: 'Sarah Williams',
      status: 'Active',
      rating: 4.8,
      deliveries: 287,
      earnings: 92.00,
      phone: '+1 (555) 234-5678',
      area: 'North District',
      vehicle: 'Scooter - DEF-5678'
    }
  ];

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
          {partners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {partner.image ? (
                      <img src={partner.image} alt={partner.name} className="w-full h-full rounded-full" />
                    ) : (
                      <span className="text-xl font-medium text-gray-600">
                        {partner.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{partner.name}</h3>
                    <p className="text-sm text-gray-500">{partner.id}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {partner.rating} ({partner.deliveries} deliveries)
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  partner.status === 'Active' ? 'bg-green-100 text-green-700' :
                  partner.status === 'Busy' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {partner.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-600">Today</p>
                  <p className="font-medium">{
                    partner.status === 'Offline' ? '0' : 
                    Math.floor(Math.random() * 15)} deliveries</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-600">Earnings</p>
                  <p className="font-medium">${partner.earnings.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{partner.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{partner.area}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs">🛵</span>
                  <span>{partner.vehicle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DeliveryPartners;
