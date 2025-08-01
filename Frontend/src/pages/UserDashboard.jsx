// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Calendar, MapPin, CreditCard, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useParking } from '../context/ParkingContext';
import LoadingSpinner from '../components/LoadingSpinner';

const UserDashboard = () => {
  const { user } = useAuth();

  // Use context with correct variable names!
  const {
    parkingPlaces,
    bookings,
    fetchParkingPlaces,
    fetchUserBookings,
    loading
  } = useParking();

  const [stats, setStats] = useState({
    activeBookings: 0,
    totalBookings: 0,
    availableSpots: 0,
    totalSpots: 0
  });

  // Fetch on mount
  useEffect(() => {
    async function loadData() {
      await Promise.all([fetchParkingPlaces(), fetchUserBookings()]);
    }
    loadData();
    // Do not include fetchParkingPlaces/fetchUserBookings in deps to avoid unwanted infinite loops.
    // eslint-disable-next-line
  }, []);

  // Defensive typing
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const safeParkingPlaces = Array.isArray(parkingPlaces) ? parkingPlaces : [];

  // Calculate statistics from data
  useEffect(() => {
    let availableSpots = 0;
    let totalSpots = 0;
    safeParkingPlaces.forEach(place => {
      if (Array.isArray(place.slots)) {
        totalSpots += place.slots.length;
        availableSpots += place.slots.filter(slot => slot.isAvailable).length;
      }
    });

    setStats({
      activeBookings: safeBookings.length,
      totalBookings: safeBookings.length,
      availableSpots,
      totalSpots
    });
  }, [safeParkingPlaces, safeBookings]);

  const recentBookings = safeBookings.slice(0, 3);

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

  // Safe user name for greeting
  const userName =
    user?.firstName ||
    user?.name ||
    (user?.email ? user.email.split('@')[0] : "User");

  if (loading && safeBookings.length === 0) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userName}!
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
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Spots</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableSpots}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 rounded-lg p-3 mr-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spots</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSpots}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className={`${action.color} rounded-lg p-3 mr-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <Link to="/booking-history" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-lg p-2 mr-4">
                        <Car className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.spotId?.location || 'Unknown Spot'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Booked on {booking.timestamp ? new Date(booking.timestamp).toLocaleDateString() : "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                      <Link
                        to={`/booking-details/${booking._id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No bookings yet</p>
              <Link
                to="/parking-places"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Find Parking
              </Link>
            </div>
          )}
        </div>

        {/* Quick Book Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Need Parking Fast?</h3>
              <p className="text-blue-100 mb-4">
                Book your parking spot in seconds with our quick booking feature.
              </p>
              <Link
                to="/quick-book"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
              >
                Quick Book Now
              </Link>
            </div>
            <div className="hidden md:block">
              <Car className="h-16 w-16 text-blue-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
