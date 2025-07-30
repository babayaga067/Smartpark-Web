import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ParkingProvider } from '../context/ParkingContext';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
import Home from './Home';
import Login from './Login';
import Register from './Register';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import ParkingPlaces from './ParkingPlaces';
import ViewSlots from './ViewSlots';
import ParkingSlots from './ParkingSlots';
import BookingHistory from './BookingHistory';
import Profile from './Profile';
import BookingConfirmation from './BookingConfirmation';
import BookingDetails from './BookingDetails';
import BookingSearch from './BookingSearch';
import QuickBook from './QuickBook';
import Payment from './Payment';
import Notifications from './Notifications';
import Settings from './Settings';
import About from './About';
import Contact from './Contact';
import Help from './Help';
import Pricing from './Pricing';
import NotFound from './NotFound';
import ManagePlaces from './admin/ManagePlaces';
import ManageSlots from './admin/ManageSlots';
import ManageUsers from './admin/ManageUsers';
import ManageBookings from './admin/ManageBookings';
import Reports from './admin/Reports';
import CreatePlace from './admin/CreatePlace';
import CreateSlot from './admin/CreateSlot';

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
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
              <Route path="/pricing" element={<Pricing />} />
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
              <Route path="/view-slots/:placeId" element={
                <ProtectedRoute>
                  <ViewSlots />
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
              <Route path="/booking-confirmation/:bookingId" element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              } />
              <Route path="/booking-details/:bookingId" element={
                <ProtectedRoute>
                  <BookingDetails />
                </ProtectedRoute>
              } />
              <Route path="/booking-search" element={
                <ProtectedRoute>
                  <BookingSearch />
                </ProtectedRoute>
              } />
              <Route path="/quick-book" element={
                <ProtectedRoute>
                  <QuickBook />
                </ProtectedRoute>
              } />
              <Route path="/payment/:bookingId" element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
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
              <Route path="/admin/places/create" element={
                <ProtectedRoute adminOnly>
                  <CreatePlace />
                </ProtectedRoute>
              } />
              <Route path="/admin/slots/:placeId" element={
                <ProtectedRoute adminOnly>
                  <ManageSlots />
                </ProtectedRoute>
              } />
              <Route path="/admin/slots/:placeId/create" element={
                <ProtectedRoute adminOnly>
                  <CreateSlot />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute adminOnly>
                  <ManageUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute adminOnly>
                  <ManageBookings />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute adminOnly>
                  <Reports />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ParkingProvider>
    </AuthProvider>
  );
}

export default App;