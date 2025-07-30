import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Car, Calendar, Download, Filter } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('overview');
  const [reportData, setReportData] = useState({});

  // Mock report data
  const mockReportData = {
    overview: {
      totalRevenue: 15420.50,
      totalBookings: 1247,
      totalUsers: 892,
      occupancyRate: 78.5,
      revenueGrowth: 12.5,
      bookingGrowth: 8.3,
      userGrowth: 15.2,
      occupancyGrowth: -2.1
    },
    dailyStats: [
      { date: '2024-01-15', revenue: 2180.50, bookings: 156, users: 12 },
      { date: '2024-01-16', revenue: 2340.75, bookings: 168, users: 15 },
      { date: '2024-01-17', revenue: 2120.25, bookings: 142, users: 8 },
      { date: '2024-01-18', revenue: 2450.00, bookings: 175, users: 18 },
      { date: '2024-01-19', revenue: 2680.25, bookings: 189, users: 22 },
      { date: '2024-01-20', revenue: 1890.50, bookings: 134, users: 9 },
      { date: '2024-01-21', revenue: 1758.25, bookings: 128, users: 11 }
    ],
    topLocations: [
      { name: 'Downtown Mall Parking', revenue: 4250.75, bookings: 342, occupancy: 85.2 },
      { name: 'Business District Garage', revenue: 3890.50, bookings: 298, occupancy: 78.9 },
      { name: 'Airport Terminal Lot', revenue: 3120.25, bookings: 245, occupancy: 92.1 },
      { name: 'Shopping Center Plaza', revenue: 2580.00, bookings: 198, occupancy: 65.4 },
      { name: 'University Campus Parking', revenue: 1579.00, bookings: 164, occupancy: 71.8 }
    ],
    userActivity: [
      { timeSlot: '6:00-9:00', bookings: 245, percentage: 19.6 },
      { timeSlot: '9:00-12:00', bookings: 189, percentage: 15.2 },
      { timeSlot: '12:00-15:00', bookings: 156, percentage: 12.5 },
      { timeSlot: '15:00-18:00', bookings: 298, percentage: 23.9 },
      { timeSlot: '18:00-21:00', bookings: 234, percentage: 18.8 },
      { timeSlot: '21:00-24:00', bookings: 125, percentage: 10.0 }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReportData(mockReportData);
      setLoading(false);
    }, 1000);
  }, [dateRange, reportType]);

  const handleExportReport = () => {
    // Simulate report export
    const reportName = `SmartPark_${reportType}_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`;
    alert(`Exporting report: ${reportName}`);
  };

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <p className={`text-sm flex items-center mt-1 ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${change < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(change)}% vs last period
            </p>
          )}
        </div>
        <div className={`${color} rounded-lg p-3`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner text="Loading reports..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 mt-2">Comprehensive insights into your parking business</p>
            </div>
            <button
              onClick={handleExportReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>

            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="overview">Overview</option>
              <option value="revenue">Revenue Analysis</option>
              <option value="usage">Usage Patterns</option>
              <option value="locations">Location Performance</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`$${reportData.overview?.totalRevenue.toLocaleString()}`}
            change={reportData.overview?.revenueGrowth}
            icon={DollarSign}
            color="bg-green-500"
          />
          <StatCard
            title="Total Bookings"
            value={reportData.overview?.totalBookings.toLocaleString()}
            change={reportData.overview?.bookingGrowth}
            icon={Calendar}
            color="bg-blue-500"
          />
          <StatCard
            title="Active Users"
            value={reportData.overview?.totalUsers.toLocaleString()}
            change={reportData.overview?.userGrowth}
            icon={Users}
            color="bg-purple-500"
          />
          <StatCard
            title="Occupancy Rate"
            value={`${reportData.overview?.occupancyRate}%`}
            change={reportData.overview?.occupancyGrowth}
            icon={Car}
            color="bg-orange-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue Trend</h3>
            <div className="space-y-3">
              {reportData.dailyStats?.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(day.revenue / 3000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-20 text-right">
                      ${day.revenue.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Activity by Time */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Activity by Time</h3>
            <div className="space-y-3">
              {reportData.userActivity?.map((slot, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 w-20">{slot.timeSlot}</span>
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mx-4">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${slot.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16 text-right">
                      {slot.bookings}
                    </span>
                    <span className="text-sm text-gray-500 w-12 text-right">
                      {slot.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Locations */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Locations</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Occupancy Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.topLocations?.map((location, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{location.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${location.revenue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {location.bookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              location.occupancy >= 80 ? 'bg-green-600' :
                              location.occupancy >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${location.occupancy}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{location.occupancy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        location.occupancy >= 80 ? 'bg-green-100 text-green-800' :
                        location.occupancy >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {location.occupancy >= 80 ? 'Excellent' :
                         location.occupancy >= 60 ? 'Good' : 'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-medium text-blue-900">Revenue Growth</h4>
              </div>
              <p className="text-sm text-blue-700">
                Revenue increased by 12.5% compared to the previous period, driven by higher occupancy rates during peak hours.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="font-medium text-green-900">User Acquisition</h4>
              </div>
              <p className="text-sm text-green-700">
                New user registrations are up 15.2%, indicating strong market adoption and effective marketing campaigns.
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center mb-2">
                <BarChart3 className="h-5 w-5 text-orange-600 mr-2" />
                <h4 className="font-medium text-orange-900">Peak Hours</h4>
              </div>
              <p className="text-sm text-orange-700">
                Highest demand occurs between 3-6 PM (23.9% of bookings), suggesting opportunity for dynamic pricing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;