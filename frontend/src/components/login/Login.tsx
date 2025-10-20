// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {

//   const nav = useNavigate();
//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       const { role } = JSON.parse(userData);
//       if (role === 'admin') nav('/admin');
//       else if (role === 'delivery') nav('/delivery');
//       else nav('/customer');
//     }
//   }, [nav]);

//   // const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [role, setRole] = useState('customer');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const [loginMethod, setLoginMethod] = useState('login');
//   const [name, setName] = useState('');
//   const [confirmPass, setconfirmPass] = useState('');
//   const [phone, setPhone] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (loginMethod === 'register') {
//       console.log('Registration:', { name, email, password, confirmPass, phone, role });
//       // Simulate successful registration → save user
//       const user = { email, role, name };
//       localStorage.setItem('user', JSON.stringify(user));
//       navigateBasedOnRole(role);
//     } else {
//       console.log('Login:', { email, password, role });
//       if (email && password) {
//         const user = { email, role };
//         localStorage.setItem('user', JSON.stringify(user));
//         navigateBasedOnRole(role);
//       } else {
//         alert('Please enter valid credentials');
//       }
//     }
//   };

//   const navigateBasedOnRole = (role: string) => {
//     if (role === 'admin') nav('/admin');
//     else if (role === 'delivery') nav('/delivery');
//     else nav('/customer');
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
//         {/* Logo */}
//         <div className="flex justify-center mb-4">
//           <img src="/logo-icon.png" alt="QuickCommerce" className="w-16 h-16" />
//         </div>

//         <h1 className="text-2xl font-semibold text-gray-800 mb-2">QuickCommerce Portal</h1>
//         <p className="text-gray-600 mb-8">Select your role and sign in to continue</p>

//         {/* Role Selector */}
//         <div className="my-8">
//           <h3 className="text-lg font-medium text-gray-700 mb-3">I am a...</h3>
//           <div className="flex justify-center gap-3 mb-4">
//             {[
//               { key: 'customer', icon: '🛍️', label: 'Customer' },
//               { key: 'delivery', icon: '🚚', label: 'Delivery Partner' },
//               { key: 'admin', icon: '🛡️', label: 'Admin' },
//             ].map((r) => (
//               <button
//                 key={r.key}
//                 onClick={() => setRole(r.key)}
//                 className={`flex flex-col items-center px-4 py-3 rounded-lg border transition 
//                   ${role === r.key
//                     ? 'border-blue-600 bg-blue-50'
//                     : 'border-gray-300 bg-white hover:border-blue-400'}
//                 `}
//               >
//                 <span className="text-2xl mb-1">{r.icon}</span>
//                 <span className="text-sm font-medium text-gray-700">{r.label}</span>
//               </button>
//             ))}
//           </div>
//           <p className="text-gray-600 text-sm">
//             {role === 'customer'
//               ? 'Shop and order products'
//               : role === 'delivery'
//               ? 'Deliver products to customers'
//               : 'Manage users and orders'}
//           </p>
//         </div>

//         {/* Auth Tabs */}
//         <div className="flex gap-3 mb-8">
//           <button 
//             className={`flex-1 py-3 rounded-lg font-medium ${
//               loginMethod === 'login' 
//                 ? 'bg-blue-600 text-white' 
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//             onClick={() => setLoginMethod('login')}
//           >
//             Login
//           </button>
//           <button 
//             className={`flex-1 py-3 rounded-lg font-medium ${
//               loginMethod === 'register' 
//                 ? 'bg-blue-600 text-white' 
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//             onClick={() => setLoginMethod('register')}
//           >
//             Register
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit}>
//           {loginMethod === 'register' && (
//             <div className="mb-4 text-left">
//               <label className="block text-gray-700 mb-1 font-medium">Full Name</label>
//               <input
//                 type="text"
//                 placeholder="John Doe"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           )}

//           <div className="mb-4 text-left">
//             <label className="block text-gray-700 mb-1 font-medium">Email Address</label>
//             <input
//               type="email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {loginMethod === 'register' && (
//             <div className="mb-4 text-left">
//               <label className="block text-gray-700 mb-1 font-medium">Phone Number</label>
//               <input
//                 type="tel"
//                 placeholder="+1234567890"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           )}

//           <div className="mb-4 text-left">
//             <label className="block text-gray-700 mb-1 font-medium">Password</label>
//             <input
//               type="password"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {loginMethod === 'register' && (
//             <div className="mb-4 text-left">
//               <label className="block text-gray-700 mb-1 font-medium">Confirm Password</label>
//               <input
//                 type="password"
//                 placeholder="••••••••"
//                 value={confirmPass}
//                 onChange={(e) => setconfirmPass(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           )}

//           {/* Footer */}
//           {loginMethod === 'login' && (
//             <div className="flex justify-between items-center my-4 text-sm">
//               <label className="flex items-center gap-2 text-gray-600">
//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   className="accent-blue-600 w-4 h-4"
//                 />
//                 Remember me
//               </label>
//               <a href="/forgot-password" className="text-blue-600 hover:underline">
//                 Forgot password?
//               </a>
//             </div>
//           )}

//           <button
//             type="submit"
//             className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
//           >
//             {loginMethod === 'login' ? 'Sign In' : 'Register'} as {role.charAt(0).toUpperCase() + role.slice(1)}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


// API base URL - adjust based on your environment
const API_BASE_URL = 'http://localhost:5000/api';

interface User {
  email: string;
  role: 'customer' | 'delivery' | 'admin';
  name?: string;
  id?: string;
  token?: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    role: 'customer' | 'delivery' | 'admin';
    profile?: {
      firstName: string;
      lastName: string;
      phone?: string;
    };
  };
}

interface RegisterData {
  email: string;
  password: string;
  role: 'customer' | 'delivery' | 'admin';
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

const Login = () => {
  const nav = useNavigate();
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      const user: User = JSON.parse(userData);
      navigateBasedOnRole(user.role);
    }
  }, [nav]);

  const [role, setRole] = useState<'customer' | 'delivery' | 'admin'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // API call functions
  const loginUser = async (email: string, password: string, role: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        role,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  };

  const registerUser = async (userData: RegisterData): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (loginMethod === 'register') {
        // Registration logic
        if (password !== confirmPass) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (!firstName || !lastName) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }

        const registerData: RegisterData = {
          email,
          password,
          role,
          profile: {
            firstName,
            lastName,
            phone: phone || undefined,
          },
        };

        const result = await registerUser(registerData);
        
        if (result.success) {
          // Store user data and token
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify({
            id: result.user.id,
            email: result.user.email,
            role: result.user.role,
            name: `${result.user.profile?.firstName} ${result.user.profile?.lastName}`,
          }));
          
          navigateBasedOnRole(result.user.role);
        }
      } else {
        // Login logic
        if (!email || !password) {
          setError('Please enter email and password');
          setLoading(false);
          return;
        }

        const result = await loginUser(email, password, role);
        
        if (result.success) {
          // Store user data and token
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify({
            id: result.user.id,
            email: result.user.email,
            role: result.user.role,
            name: result.user.profile ? 
              `${result.user.profile.firstName} ${result.user.profile.lastName}` : 
              result.user.email,
          }));
          
          navigateBasedOnRole(result.user.role);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const navigateBasedOnRole = (role: string) => {
    if (role === 'admin') nav('/admin');
    else if (role === 'delivery') nav('/delivery');
    else nav('/customer');
  };

  // Reset form when switching between login/register
  useEffect(() => {
    setError('');
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setConfirmPass('');
    setPhone('');
  }, [loginMethod]);

  // Reset error when changing form fields
  useEffect(() => {
    setError('');
  }, [email, password, firstName, lastName, confirmPass, phone, role]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo-icon.png" alt="QuickCommerce" className="w-16 h-16" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">QuickCommerce Portal</h1>
        <p className="text-gray-600 mb-8">Select your role and sign in to continue</p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Role Selector */}
        <div className="my-8">
          <h3 className="text-lg font-medium text-gray-700 mb-3">I am a...</h3>
          <div className="flex justify-center gap-3 mb-4">
            {[
              { key: 'customer' as const, icon: '🛍️', label: 'Customer' },
              { key: 'delivery' as const, icon: '🚚', label: 'Delivery Partner' },
              { key: 'admin' as const, icon: '🛡️', label: 'Admin' },
            ].map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={`flex flex-col items-center px-4 py-3 rounded-lg border transition 
                  ${role === r.key
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-blue-400'}
                `}
                disabled={loading}
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
            type="button"
            className={`flex-1 py-3 rounded-lg font-medium ${
              loginMethod === 'login' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setLoginMethod('login')}
            disabled={loading}
          >
            Login
          </button>
          <button 
            type="button"
            className={`flex-1 py-3 rounded-lg font-medium ${
              loginMethod === 'register' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setLoginMethod('register')}
            disabled={loading}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {loginMethod === 'register' && (
            <>
              <div className="mb-4 text-left">
                <label className="block text-gray-700 mb-1 font-medium">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-4 text-left">
                <label className="block text-gray-700 mb-1 font-medium">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
            </>
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
              disabled={loading}
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
                disabled={loading}
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
              minLength={6}
              disabled={loading}
            />
            {loginMethod === 'register' && (
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
            )}
          </div>

          {loginMethod === 'register' && (
            <div className="mb-4 text-left">
              <label className="block text-gray-700 mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
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
                  disabled={loading}
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
            disabled={loading}
            className={`w-full py-3 font-semibold rounded-lg transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {loginMethod === 'login' ? 'Signing In...' : 'Registering...'}
              </div>
            ) : (
              `${loginMethod === 'login' ? 'Sign In' : 'Register'} as ${role.charAt(0).toUpperCase() + role.slice(1)}`
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;