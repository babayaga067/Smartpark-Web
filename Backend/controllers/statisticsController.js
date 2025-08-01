const Booking = require('../models/Booking');
const User = require('../models/User');
const ParkingPlace = require('../models/ParkingPlace');
const ParkingSlot = require('../models/ParkingSlot');
const asyncHandler = require('express-async-handler');

// @desc    Get general statistics
// @route   GET /api/statistics
// @access  Private/Admin
const getStatistics = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const [
    totalBookings,
    monthlyBookings,
    yearlyBookings,
    totalUsers,
    totalPlaces,
    totalSlots,
    totalRevenue,
    monthlyRevenue,
    yearlyRevenue
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Booking.countDocuments({ createdAt: { $gte: startOfYear } }),
    User.countDocuments(),
    ParkingPlace.countDocuments(),
    ParkingSlot.countDocuments(),
    Booking.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    Booking.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Booking.aggregate([
      { $match: { createdAt: { $gte: startOfYear } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
  ]);

  res.json({
    success: true,
    data: {
      bookings: {
        total: totalBookings,
        monthly: monthlyBookings,
        yearly: yearlyBookings
      },
      users: {
        total: totalUsers
      },
      places: {
        total: totalPlaces
      },
      slots: {
        total: totalSlots
      },
      revenue: {
        total: totalRevenue[0]?.total || 0,
        monthly: monthlyRevenue[0]?.total || 0,
        yearly: yearlyRevenue[0]?.total || 0
      }
    }
  });
});

// @desc    Get dashboard statistics
// @route   GET /api/statistics/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    weeklyBookings,
    monthlyBookings,
    weeklyRevenue,
    monthlyRevenue,
    activeUsers,
    availableSlots
  ] = await Promise.all([
    Booking.countDocuments({ createdAt: { $gte: startOfWeek } }),
    Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Booking.aggregate([
      { $match: { createdAt: { $gte: startOfWeek } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Booking.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    User.countDocuments({ lastLogin: { $gte: startOfWeek } }),
    ParkingSlot.countDocuments({ status: 'available' })
  ]);

  res.json({
    success: true,
    data: {
      weekly: {
        bookings: weeklyBookings,
        revenue: weeklyRevenue[0]?.total || 0
      },
      monthly: {
        bookings: monthlyBookings,
        revenue: monthlyRevenue[0]?.total || 0
      },
      activeUsers,
      availableSlots
    }
  });
});

// @desc    Get revenue statistics
// @route   GET /api/statistics/revenue
// @access  Private/Admin
const getRevenueStats = asyncHandler(async (req, res) => {
  const { period = 'monthly' } = req.query;
  const today = new Date();
  
  let groupBy = {};
  let match = {};

  switch (period) {
    case 'daily':
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
      match = { createdAt: { $gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) } };
      break;
    case 'weekly':
      groupBy = {
        year: { $year: '$createdAt' },
        week: { $week: '$createdAt' }
      };
      match = { createdAt: { $gte: new Date(today.getTime() - 12 * 7 * 24 * 60 * 60 * 1000) } };
      break;
    case 'monthly':
    default:
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
      match = { createdAt: { $gte: new Date(today.getFullYear(), 0, 1) } };
      break;
  }

  const revenueStats = await Booking.aggregate([
    { $match: match },
    {
      $group: {
        _id: groupBy,
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1, '_id.week': -1 } }
  ]);

  res.json({
    success: true,
    period,
    data: revenueStats
  });
});

// @desc    Get user statistics
// @route   GET /api/statistics/users
// @access  Private/Admin
const getUserStats = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const [
    totalUsers,
    monthlyUsers,
    yearlyUsers,
    activeUsers,
    userRoles
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: startOfMonth } }),
    User.countDocuments({ createdAt: { $gte: startOfYear } }),
    User.countDocuments({ lastLogin: { $gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) } }),
    User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  res.json({
    success: true,
    data: {
      total: totalUsers,
      monthly: monthlyUsers,
      yearly: yearlyUsers,
      active: activeUsers,
      byRole: userRoles
    }
  });
});

// @desc    Get parking statistics
// @route   GET /api/statistics/parking
// @access  Private/Admin
const getParkingStats = asyncHandler(async (req, res) => {
  const [
    totalPlaces,
    totalSlots,
    availableSlots,
    occupiedSlots,
    placeTypes,
    slotStatus
  ] = await Promise.all([
    ParkingPlace.countDocuments(),
    ParkingSlot.countDocuments(),
    ParkingSlot.countDocuments({ status: 'available' }),
    ParkingSlot.countDocuments({ status: 'occupied' }),
    ParkingPlace.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]),
    ParkingSlot.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  res.json({
    success: true,
    data: {
      places: {
        total: totalPlaces,
        byType: placeTypes
      },
      slots: {
        total: totalSlots,
        available: availableSlots,
        occupied: occupiedSlots,
        byStatus: slotStatus
      }
    }
  });
});

module.exports = {
  getStatistics,
  getDashboardStats,
  getRevenueStats,
  getUserStats,
  getParkingStats
}; 