import { useState } from 'react';
import Header from '../Header';
import { Plus, Minus, Search, ShoppingCart, X, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL='http://localhost:5000/api';

const categories = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Snacks', 'Beverages'];

const dummyProducts = [
  {
    id: 1,
    name: 'Fresh Vegetables Mix',
    price: 12.99,
    category: 'Vegetables',
    image: 'https://picsum.photos/id/1/200/300',
    unit: 'per kg'
  },
  {
    id: 2,
    name: 'Organic Fruits Basket',
    price: 18.99,
    category: 'Fruits',
    image: 'https://picsum.photos/id/2/200/300',
    unit: 'per basket'
  },
  {
    id: 3,
    name: 'Fresh Dairy Products',
    price: 8.49,
    category: 'Dairy',
    image: 'https://picsum.photos/id/237/200/300',
    unit: 'per liter'
  },
  {
    id: 4,
    name: 'Whole Grain Bread',
    price: 4.99,
    category: 'Bakery',
    image: 'https://picsum.photos/id/4/200/300',
    unit: 'per loaf'
  },
  {
    id: 5,
    name: 'Healthy Snack Pack',
    price: 6.99,
    category: 'Snacks',
    image: 'https://picsum.photos/id/5/200/300',
    unit: 'per pack'
  }
];

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
  trackQuantity: boolean;
  unit?: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Inline quantity selector component
interface InlineQuantitySelectorProps {
  product: typeof dummyProducts[0];
  onAdd: (product: typeof dummyProducts[0], quantity: number) => void;
  onClose: () => void;
}

const InlineQuantitySelector = ({ product, onAdd, onClose }: InlineQuantitySelectorProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAdd(product, quantity);
    onClose();
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2 border border-blue-200">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <Minus size={16} className="text-blue-600" />
        </button>
        
        <span className="font-semibold text-blue-800 w-6 text-center">{quantity}</span>
        
        <button
          onClick={() => setQuantity(q => q + 1)}
          className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <Plus size={16} className="text-blue-600" />
        </button>
      </div>

      <div className="flex gap-1">
        <button
          onClick={handleAdd}
          className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-500 
                     text-white rounded-xl font-semibold text-sm shadow-lg 
                     hover:from-green-700 hover:to-green-600 transition-all duration-200"
        >
          Add
        </button>
        <button
          onClick={onClose}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm 
                     hover:bg-gray-200 transition-all duration-200"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Calculate total items in cart
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: typeof dummyProducts[0], quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity 
      }];
    });
    setShowCart(true);
    setEditingProductId(null);
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart, total: cartTotal } });
  };

  const filteredProducts = dummyProducts.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h2 className="text-2xl font-bold text-center">Product Catalog</h2>
        <p className="text-gray-600 mb-6 text-center">Browse and shop from our wide range of products</p>
        
        {/* Search & Cart Section */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full flex items-center gap-4">
            {/* Search Container */}
            <div className="relative flex-1">
              <Search size={18} className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400" />
              <input
                type="text"
                placeholder="Search for products, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-5 py-3 rounded-2xl border border-gray-200 
                          bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 
                          focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                          shadow-sm hover:shadow-md transition-all duration-300 ease-out
                          focus:bg-white focus:shadow-lg"
              />
            </div>

            {/* Cart and Checkout Icons */}
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCart(true)}
                className="relative p-3 rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-white 
                          border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md
                          transition-all duration-300 group"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={22} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white 
                                 w-6 h-6 rounded-full text-xs flex items-center 
                                 justify-center font-semibold shadow-lg">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              <button 
                onClick={handleCheckout}
                className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-white
                          border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md
                          transition-all duration-300 group"
                aria-label="Proceed to checkout"
              >
                <CreditCard size={22} className="text-gray-700 group-hover:text-green-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Categories */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-2xl whitespace-nowrap font-semibold transition-all duration-300 ease-out transform border ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 border-blue-600 hover:from-blue-700 hover:to-blue-600'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Enhanced Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 overflow-hidden border border-gray-100 hover:border-gray-200"
            >
              <div className="relative aspect-w-4 aspect-h-3 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-64 group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 font-medium">{product.unit}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    ${product.price.toFixed(2)}
                  </span>
                  
                  {/* Conditionally render either Add button or Quantity Selector */}
                  {editingProductId === product.id ? (
                    <InlineQuantitySelector
                      product={product}
                      onAdd={handleAddToCart}
                      onClose={() => setEditingProductId(null)}
                    />
                  ) : (
                    <button 
                      onClick={() => setEditingProductId(product.id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 
                                 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all 
                                 duration-300 font-semibold shadow-lg shadow-blue-500/25 
                                 hover:shadow-xl hover:shadow-blue-500/30"
                    >
                      <Plus size={18} />
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Cart Widget */}
        {showCart && (
          <div className="fixed bottom-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 w-96 z-50 transform transition-all duration-300 ease-out">
            <div className="p-5 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <ShoppingCart size={20} className="text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-900">Your Cart</span>
                </div>
                <button 
                  onClick={() => setShowCart(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="max-h-80 overflow-auto p-5">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-4 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500 font-medium">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-b-2xl">
                <div className="flex justify-between items-center mb-5">
                  <span className="font-semibold text-gray-800 text-lg">Total:</span>
                  <span className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.02]"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Search size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No products found matching your criteria</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filter</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;