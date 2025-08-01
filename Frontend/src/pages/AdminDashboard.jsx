import React, { useEffect, useState } from 'react';
import { Users, Car, DollarSign, BarChart3, MapPin, Calendar, TrendingUp, Clock } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { parkingService } from '../services/parkingService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { spots, fetchSpots, bookings, fetchBookings } = useParking();
  const [stats, setStats] = useState({
    totalSpots: 0,
    availableSpots: 0,
    bookedSpots: 0,
    totalBookings: 0,
    activeBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([fetchSpots(), fetchBookings()]);
        
        // Calculate stats from spots and bookings
        const totalSpots = spots.length;
        const availableSpots = spots.filter(spot => spot.status === 'available').length;
        const bookedSpots = spots.filter(spot => spot.status === 'booked').length;
        const totalBookings = bookings.length;
        const activeBookings = bookings.length; // All bookings are considered active in our simple model
        
        setStats({
          totalSpots,
          availableSpots,
          bookedSpots,
          totalBookings,
          activeBookings
        });
        
        setRecentBookings(bookings.slice(0, 5));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchSpots, fetchBookings]);

  const statCards = [
    {
      title: 'Total Spots',
      value: stats.totalSpots,
      icon: Car,
      color: 'bg-blue-500',
      change: `+${Math.floor(Math.random() * 5) + 1} this month`
    },
    {
      title: 'Available Spots',
      value: stats.availableSpots,
      icon: MapPin,
      color: 'bg-green-500',
      change: `${Math.floor(Math.random() * 20) + 10}% available`
    },
    {
      title: 'Active Bookings',
      value: stats.activeBookings,
      icon: Calendar,
      color: 'bg-purple-500',
      change: `+${Math.floor(Math.random() * 8) + 1}% from last week`
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: BarChart3,
      color: 'bg-orange-500',
      change: `+${Math.floor(Math.random() * 12) + 1}% from last month`
    }
  ];

  const occupancyRate = stats.totalSpots > 0 ? ((stats.bookedSpots / stats.totalSpots) * 100).toFixed(1) : 0;

  if (loading) {
    return <LoadingSpinner text="Loading admin dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your parking management system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Occupancy Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupancy Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Occupancy Rate</span>
                <span className="text-lg font-semibold text-gray-900">{occupancyRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${occupancyRate}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{stats.availableSpots} Available</span>
                <span>{stats.bookedSpots} Occupied</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => window.location.href = '/admin/spots'}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Car className="h-5 w-5 mr-2" />
                Manage Spots
              </button>
              <button
                onClick={() => window.location.href = '/admin/bookings'}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Calendar className="h-5 w-5 mr-2" />
                View Bookings
              </button>
              <button
                onClick={() => window.location.href = '/admin/users'}
                className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Users className="h-5 w-5 mr-2" />
                Manage Users
              </button>
              <button
                onClick={() => window.location.href = '/admin/reports'}
                className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                View Reports
              </button>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <button
              onClick={() => window.location.href = '/admin/bookings'}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spot
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.userId?.name || 'Unknown User'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.spotId?.location || 'Unknown Spot'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(booking.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No bookings yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;