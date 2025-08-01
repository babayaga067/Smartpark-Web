import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import ViewSlots from './pages/ViewSlots';
import ParkingSlots from './pages/ParkingSlots';
import BookingHistory from './pages/BookingHistory';
import Profile from './pages/Profile';
import BookingConfirmation from './pages/BookingConfirmation';
import BookingDetails from './pages/BookingDetails';
import BookingSearch from './pages/BookingSearch';
import QuickBook from './pages/QuickBook';
import Payment from './pages/Payment';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';

// Admin Pages
import ManagePlaces from './pages/admin/ManagePlaces';
import ManageSlots from './pages/admin/ManageSlots';
import CreatePlace from './pages/admin/CreatePlace';
import CreateSlot from './pages/admin/CreateSlot';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBookings from './pages/admin/ManageBookings';
import Reports from './pages/admin/Reports';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <ParkingProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute><UserDashboard /></ProtectedRoute>
            } />
            <Route path="/parking-places" element={
              <ProtectedRoute><ParkingPlaces /></ProtectedRoute>
            } />
            <Route path="/view-slots/:placeId" element={
              <ProtectedRoute><ViewSlots /></ProtectedRoute>
            } />
            <Route path="/parking-slots/:placeId" element={
              <ProtectedRoute><ParkingSlots /></ProtectedRoute>
            } />
            <Route path="/booking-history" element={
              <ProtectedRoute><BookingHistory /></ProtectedRoute>
            } />
            <Route path="/booking-confirmation/:bookingId" element={
              <ProtectedRoute><BookingConfirmation /></ProtectedRoute>
            } />
            <Route path="/booking-details/:bookingId" element={
              <ProtectedRoute><BookingDetails /></ProtectedRoute>
            } />
            <Route path="/booking-search" element={
              <ProtectedRoute><BookingSearch /></ProtectedRoute>
            } />
            <Route path="/quick-book" element={
              <ProtectedRoute><QuickBook /></ProtectedRoute>
            } />
            <Route path="/payment/:bookingId" element={
              <ProtectedRoute><Payment /></ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute><Notifications /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><Settings /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/places" element={
              <ProtectedRoute adminOnly><ManagePlaces /></ProtectedRoute>
            } />
            <Route path="/admin/places/create" element={
              <ProtectedRoute adminOnly><CreatePlace /></ProtectedRoute>
            } />
            <Route path="/admin/slots" element={
              <ProtectedRoute adminOnly><ManageSlots /></ProtectedRoute>
            } />
            <Route path="/admin/slots/create" element={
              <ProtectedRoute adminOnly><CreateSlot /></ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>
            } />
            <Route path="/admin/bookings" element={
              <ProtectedRoute adminOnly><ManageBookings /></ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute adminOnly><Reports /></ProtectedRoute>
            } />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ParkingProvider>
    </AuthProvider>
  );
}

export default App;
