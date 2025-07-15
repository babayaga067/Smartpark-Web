import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Calendar, Clock, MapPin, CreditCard, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useParking } from '../context/ParkingContext';
import LoadingSpinner from '../components/LoadingSpinner';

const UserDashboard = () => {
  const { user } = useAuth();
  const { bookings, fetchBookings, loading } = useParking();
  const [stats, setStats] = useState({
    activeBookings: 0,
    totalBookings: 0,
    totalSpent: 0,
    hoursParked: 0
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      const activeBookings = bookings.filter(b => b.status === 'active').length;
      const totalBookings = bookings.length;
      const totalSpent = bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalAmount, 0);
      
      // Calculate total hours (simplified calculation)
      const hoursParked = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => {
          const start = new Date(b.startTime);
          const end = new Date(b.endTime);
          return sum + Math.ceil((end - start) / (1000 * 60 * 60));
        }, 0);

      setStats({
        activeBookings,
        totalBookings,
        totalSpent,
        hoursParked
      });
    }
  }, [bookings]);

  const recentBookings = bookings.slice(0, 3);

  const quickActions = [
    {
      title: 'Find Parking',
      description: 'Search for available parking spots',
      icon: MapPin,
      link: '/parking-places',
      color: 'bg-blue-500'
    },
    {
      title: 'My Bookings',
      description: 'View and manage your reservations',
      icon: Calendar,
      link: '/booking-history',
      color: 'bg-green-500'
    },
    {
      title: 'Profile Settings',
      description: 'Update your account information',
      icon: CreditCard,
      link: '/profile',
      color: 'bg-purple-500'
    }
  ];

  if (loading && bookings.length === 0) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">Here's your parking overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-lg p-3 mr-4">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-lg p-3 mr-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-lg p-3 mr-4">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 rounded-lg p-3 mr-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hours Parked</p>
                <p className="text-2xl font-bold text-gray-900">{stats.hoursParked}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
              <Link
                to="/booking-history"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        booking.status === 'active' ? 'bg-green-500' :
                        booking.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{booking.placeName}</p>
                        <p className="text-xs text-gray-500">Slot {booking.slotNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${booking.totalAmount}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'active' ? 'bg-green-100 text-green-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No bookings yet</p>
                <Link
                  to="/parking-places"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Make your first booking
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`${action.color} rounded-lg p-3 mr-4`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;