import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ParkingProvider } from './context/ParkingContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ParkingPlaces from './pages/ParkingPlaces';
import ParkingSlots from './pages/ParkingSlots';
import BookingHistory from './pages/BookingHistory';
import Profile from './pages/Profile';
import ManagePlaces from './pages/admin/ManagePlaces';
import ManageSlots from './pages/admin/ManageSlots';

import './index.css'; // Import your main CSS file

function App() {
  return (
    <AuthProvider>
      <ParkingProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* User Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/parking-places" element={
                <ProtectedRoute>
                  <ParkingPlaces />
                </ProtectedRoute>
              } />
              <Route path="/parking-slots/:placeId" element={
                <ProtectedRoute>
                  <ParkingSlots />
                </ProtectedRoute>
              } />
              <Route path="/booking-history" element={
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/places" element={
                <ProtectedRoute adminOnly>
                  <ManagePlaces />
                </ProtectedRoute>
              } />
              <Route path="/admin/slots/:placeId" element={
                <ProtectedRoute adminOnly>
                  <ManageSlots />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ParkingProvider>
    </AuthProvider>
  );
}

export default App;