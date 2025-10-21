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
        <div className="flex justify-center">
          <img src="data:image/png;base64,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" alt="QuickCommerce" className="w-40 h-26" />
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