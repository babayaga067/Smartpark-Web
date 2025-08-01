const Booking = require('../models/Booking');
const User = require('../models/User');
const ParkingPlace = require('../models/ParkingPlace');
const ParkingSlot = require('../models/ParkingSlot');
const asyncHandler = require('express-async-handler');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
const getReports = asyncHandler(async (req, res) => {
  const { type, startDate, endDate } = req.query;

  let query = {};
  
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  let reports = [];
  
  switch (type) {
    case 'bookings':
      reports = await Booking.find(query).populate('user parkingPlace parkingSlot');
      break;
    case 'users':
      reports = await User.find(query).select('-password');
      break;
    case 'parking-places':
      reports = await ParkingPlace.find(query);
      break;
    case 'revenue':
      reports = await Booking.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      break;
    default:
      // Return summary
      const [bookings, users, places, revenue] = await Promise.all([
        Booking.countDocuments(query),
        User.countDocuments(query),
        ParkingPlace.countDocuments(query),
        Booking.aggregate([
          { $match: query },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
      ]);
      
      reports = {
        bookings: bookings,
        users: users,
        places: places,
        revenue: revenue[0]?.total || 0
      };
  }

  res.json({
    success: true,
    count: Array.isArray(reports) ? reports.length : 1,
    data: reports
  });
});

// @desc    Generate specific report
// @route   POST /api/reports/:type
// @access  Private/Admin
const generateReport = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { startDate, endDate, format } = req.body;

  let query = {};
  
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  let report = {};

  switch (type) {
    case 'bookings':
      report = await Booking.find(query)
        .populate('user parkingPlace parkingSlot')
        .sort({ createdAt: -1 });
      break;
    case 'users':
      report = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 });
      break;
    case 'revenue':
      report = await Booking.aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } }
      ]);
      break;
    default:
      res.status(400);
      throw new Error('Invalid report type');
  }

  res.json({
    success: true,
    type,
    count: report.length,
    data: report
  });
});

// @desc    Export report
// @route   GET /api/reports/:type/export/:format
// @access  Private/Admin
const exportReport = asyncHandler(async (req, res) => {
  const { type, format } = req.params;
  const { startDate, endDate } = req.query;

  let query = {};
  
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  let data = [];

  switch (type) {
    case 'bookings':
      data = await Booking.find(query).populate('user parkingPlace parkingSlot');
      break;
    case 'users':
      data = await User.find(query).select('-password');
      break;
    case 'revenue':
      data = await Booking.aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);
      break;
    default:
      res.status(400);
      throw new Error('Invalid report type');
  }

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${type}-report.json`);
    res.json(data);
  } else if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}-report.csv`);
    
    // Simple CSV conversion
    const csv = data.map(item => Object.values(item).join(',')).join('\n');
    res.send(csv);
  } else {
    res.status(400);
    throw new Error('Unsupported export format');
  }
});

// @desc    Get dashboard statistics
// @route   GET /api/reports/dashboard/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const [
    totalBookings,
    monthlyBookings,
    yearlyBookings,
    totalUsers,
    totalPlaces,
    totalRevenue,
    monthlyRevenue,
    yearlyRevenue
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Booking.countDocuments({ createdAt: { $gte: startOfYear } }),
    User.countDocuments(),
    ParkingPlace.countDocuments(),
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
      revenue: {
        total: totalRevenue[0]?.total || 0,
        monthly: monthlyRevenue[0]?.total || 0,
        yearly: yearlyRevenue[0]?.total || 0
      }
    }
  });
});

module.exports = {
  getReports,
  generateReport,
  exportReport,
  getDashboardStats
}; 