import './index.css'
import Login from './components/login/Login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerDashboard from './components/customer/CustomerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import DeliveryDashboard from './components/delivery/DeliveryDashboard';
import OrderCheckout from './components/customer/OrderCheckout';
import OrderTracking from './components/customer/OrderTracking';
import OrderAccepted from './components/delivery/OrderAccepted';
import DeliveryStatus from './components/delivery/DeliveryStatus';
import DeliveryPartners from './components/admin/DeliveryPartners';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Navigate to='/login' replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/customer"
          element={
            <ProtectedRoute requiredRole='customer' >
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute requiredRole='customer'>
              <OrderCheckout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole='admin'>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery"
          element={
            <ProtectedRoute requiredRole='delivery'>
              <DeliveryDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ordertracking"
          element={
            <ProtectedRoute requiredRole='customer'>
              <OrderTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orderaccepted"
          element={
            <ProtectedRoute requiredRole='delivery'>
              <OrderAccepted />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deliverystatus"
          element={
            <ProtectedRoute requiredRole='delivery'>
              <DeliveryStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deliverypartners"
          element={
            <ProtectedRoute requiredRole='admin'>
              <DeliveryPartners partners={[]} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
