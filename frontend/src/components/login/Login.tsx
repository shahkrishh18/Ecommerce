import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const nav = useNavigate();
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const { role } = JSON.parse(userData);
      if (role === 'admin') nav('/admin');
      else if (role === 'delivery') nav('/delivery');
      else nav('/customer');
    }
  }, [nav]);

  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState('login');
  const [name, setName] = useState('');
  const [confirmPass, setconfirmPass] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (loginMethod === 'register') {
      console.log('Registration:', { name, email, password, confirmPass, phone, role });
      // Simulate successful registration → save user
      const user = { email, role, name };
      localStorage.setItem('user', JSON.stringify(user));
      navigateBasedOnRole(role);
    } else {
      console.log('Login:', { email, password, role });
      if (email && password) {
        const user = { email, role };
        localStorage.setItem('user', JSON.stringify(user));
        navigateBasedOnRole(role);
      } else {
        alert('Please enter valid credentials');
      }
    }
  };

  const navigateBasedOnRole = (role: string) => {
    if (role === 'admin') nav('/admin');
    else if (role === 'delivery') nav('/delivery');
    else nav('/customer');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo-icon.png" alt="QuickCommerce" className="w-16 h-16" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">QuickCommerce Portal</h1>
        <p className="text-gray-600 mb-8">Select your role and sign in to continue</p>

        {/* Role Selector */}
        <div className="my-8">
          <h3 className="text-lg font-medium text-gray-700 mb-3">I am a...</h3>
          <div className="flex justify-center gap-3 mb-4">
            {[
              { key: 'customer', icon: '🛍️', label: 'Customer' },
              { key: 'delivery', icon: '🚚', label: 'Delivery Partner' },
              { key: 'admin', icon: '🛡️', label: 'Admin' },
            ].map((r) => (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                className={`flex flex-col items-center px-4 py-3 rounded-lg border transition 
                  ${role === r.key
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-blue-400'}
                `}
              >
                <span className="text-2xl mb-1">{r.icon}</span>
                <span className="text-sm font-medium text-gray-700">{r.label}</span>
              </button>
            ))}
          </div>
          <p className="text-gray-600 text-sm">
            {role === 'customer'
              ? 'Shop and order products'
              : role === 'delivery'
              ? 'Deliver products to customers'
              : 'Manage users and orders'}
          </p>
        </div>

        {/* Auth Tabs */}
        <div className="flex gap-3 mb-8">
          <button 
            className={`flex-1 py-3 rounded-lg font-medium ${
              loginMethod === 'login' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setLoginMethod('login')}
          >
            Login
          </button>
          <button 
            className={`flex-1 py-3 rounded-lg font-medium ${
              loginMethod === 'register' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setLoginMethod('register')}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {loginMethod === 'register' && (
            <div className="mb-4 text-left">
              <label className="block text-gray-700 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div className="mb-4 text-left">
            <label className="block text-gray-700 mb-1 font-medium">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {loginMethod === 'register' && (
            <div className="mb-4 text-left">
              <label className="block text-gray-700 mb-1 font-medium">Phone Number</label>
              <input
                type="tel"
                placeholder="+1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div className="mb-4 text-left">
            <label className="block text-gray-700 mb-1 font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {loginMethod === 'register' && (
            <div className="mb-4 text-left">
              <label className="block text-gray-700 mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPass}
                onChange={(e) => setconfirmPass(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Footer */}
          {loginMethod === 'login' && (
            <div className="flex justify-between items-center my-4 text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-blue-600 w-4 h-4"
                />
                Remember me
              </label>
              <a href="/forgot-password" className="text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            {loginMethod === 'login' ? 'Sign In' : 'Register'} as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
