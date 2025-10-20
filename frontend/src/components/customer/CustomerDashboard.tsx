import { useState, useEffect } from 'react';
import Header from '../Header';
import { Plus, Minus, Search, ShoppingCart, X, CreditCard, Loader, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  quantity: number;
  trackQuantity: boolean;
  unit?: string;
}

interface CartItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const categories = ['All', 'groceries', 'electronics', 'clothing', 'books', 'toys'];

// Inline quantity selector component
interface InlineQuantitySelectorProps {
  product: Product;
  onAdd: (product: Product, quantity: number) => void;
  onClose: () => void;
}

const InlineQuantitySelector = ({ product, onAdd, onClose }: InlineQuantitySelectorProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (product.trackQuantity && quantity > product.quantity) {
      alert(`Only ${product.quantity} items available in stock`);
      return;
    }
    onAdd(product, quantity);
    onClose();
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2 border border-blue-200">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
          disabled={quantity <= 1}
        >
          <Minus size={16} className="text-blue-600" />
        </button>
        
        <span className="font-semibold text-blue-800 w-6 text-center">{quantity}</span>
        
        <button
          onClick={() => setQuantity(q => product.trackQuantity ? Math.min(q + 1, product.quantity) : q + 1)}
          className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
          disabled={product.trackQuantity && quantity >= product.quantity}
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
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Calculate total items in cart
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const result = await response.json();
      
      if (result.success) {
        setProducts(result.products);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create order in backend
  const createOrder = async (orderData: any) => {
    try {
      const token = localStorage.getItem('token');
      
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
        throw new Error(errorData.message || 'Failed to create order');
      }

      const result = await response.json();
      return result;
    } catch (err: any) {
      console.error('Error creating order:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { 
        product: product._id, 
        name: product.name, 
        price: product.price, 
        quantity,
        image: product.images?.[0]
      }];
    });
    setShowCart(true);
    setEditingProductId(null);
  };

const handleCheckout = async () => {
  try {
    // Check authentication first
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('🔐 Checkout Auth Check:', { token: !!token, userData: !!userData });
    
    if (!token || !userData) {
      // Redirect to login if not authenticated
      alert('Please login again to continue with checkout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }

    // Parse user data to check if user is active
    const user = JSON.parse(userData);
    console.log('👤 User Data:', user);

    // Instead of creating order immediately, navigate to checkout page with cart data
    navigate('/checkout', { 
      state: { 
        cart: cart // Pass the cart data to checkout page
      } 
    });

  } catch (err: any) {
    console.error('❌ Checkout error details:', err);
    
    if (err.message.includes('Token is invalid') || err.message.includes('user is inactive')) {
      // Handle authentication issues
      alert('Your session has expired. Please login again.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } else {
      alert(`Checkout failed: ${err.message}`);
    }
  }
};
  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.product !== productId));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product !== productId));
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={32} className="text-red-600" />
          </div>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
                onClick={() => navigate('/orderTracking')}
                className={`p-3 rounded-2xl backdrop-blur-sm border shadow-sm hover:shadow-md
                          transition-all duration-300 group bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300
                          }`}
                aria-label="Proceed to checkout"
              >
                <Package size={22} className={`group-hover:text-green-600 transition-colors text-gray-700
                }`} />
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
              key={product._id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 overflow-hidden border border-gray-100 hover:border-gray-200"
            >
              <div className="relative aspect-w-4 aspect-h-3 overflow-hidden">
                <img
                  src={product.images?.[0] || `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/300`}
                  alt={product.name}
                  className="object-cover w-full h-64 group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Stock indicator */}
                {product.trackQuantity && product.quantity < 10 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Low Stock
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                <p className="text-sm text-gray-500 mb-4 font-medium">
                  {product.trackQuantity ? `${product.quantity} in stock` : 'In stock'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    ${product.price.toFixed(2)}
                  </span>
                  
                  {/* Conditionally render either Add button or Quantity Selector */}
                  {editingProductId === product._id ? (
                    <InlineQuantitySelector
                      product={product}
                      onAdd={handleAddToCart}
                      onClose={() => setEditingProductId(null)}
                    />
                  ) : (
                    <button 
                      onClick={() => setEditingProductId(product._id)}
                      disabled={product.trackQuantity && product.quantity === 0}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all 
                                 duration-300 font-semibold shadow-lg hover:shadow-xl ${
                                   product.trackQuantity && product.quantity === 0
                                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                     : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-blue-500/25 hover:shadow-blue-500/30'
                                 }`}
                    >
                      <Plus size={18} />
                      {product.trackQuantity && product.quantity === 0 ? 'Out of Stock' : 'Add'}
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
                  <div key={item.product} className="flex justify-between items-center mb-4 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => updateCartItemQuantity(item.product, item.quantity - 1)}
                            className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm text-gray-600 font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartItemQuantity(item.product, item.quantity + 1)}
                            className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
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

        {filteredProducts.length === 0 && !loading && (
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