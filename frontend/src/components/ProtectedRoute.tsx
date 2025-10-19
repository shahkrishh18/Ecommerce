import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    // Not logged in → go back to login
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;