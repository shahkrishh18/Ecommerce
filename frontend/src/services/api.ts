// services/api.ts
declare global {
  interface ProcessEnv {
    VITE_API_URL?: string;
    VITE_WS_URL?: string;
  }
  const process: {
    env: ProcessEnv;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  },

  // Auth endpoints
  auth: {
    login: (email: string, password: string, role: string) =>
      api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
      }),
    
    register: (userData: any) =>
      api.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    
    getProfile: () => api.request('/auth/me'),
  },

  // Product endpoints
  products: {
    getAll: (params?: any) => 
      api.request(`/products?${new URLSearchParams(params)}`),
    
    getById: (id: string) => api.request(`/products/${id}`),
  },

  // Order endpoints
  orders: {
    create: (orderData: any) =>
      api.request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),
    
    getAll: () => api.request('/orders'),
    
    getUnassigned: () => api.request('/orders/unassigned'),
  },
};