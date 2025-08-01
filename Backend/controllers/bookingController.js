const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');
const ParkingPlace = require('../models/ParkingPlace');
const User = require('../models/User');

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      placeId,
      userId,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (placeId) filter.placeId = placeId;
    if (userId) filter.userId = userId;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('userId', 'name email')
      .populate('placeId', 'name address')
      .populate('slotId', 'slotNumber type')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Booking.countDocuments(filter);

    res.json({
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Get all bookings error:', err);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

// Get single booking
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('placeId', 'name address contact')
      .populate('slotId', 'slotNumber type pricing')
      .populate('createdBy', 'name')
      .populate('lastUpdatedBy', 'name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user can access this booking
    if (req.user.role !== 'admin' && booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (err) {
    console.error('Get booking error:', err);
    res.status(500).json({ message: 'Server error fetching booking' });
  }
};

// Create new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      placeId,
      slotId,
      startTime,
      endTime,
      vehicle,
      specialRequests,
      notes
    } = req.body;

    // Validate required fields
    if (!placeId || !slotId || !startTime || !endTime) {
      return res.status(400).json({ 
        message: 'Place ID, slot ID, start time, and end time are required' 
      });
    }

    // Check if slot exists and is available
    const slot = await ParkingSlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    if (!slot.isAvailable || slot.status !== 'available') {
      return res.status(400).json({ 
        message: 'Parking slot is not available' 
      });
    }

    // Check for conflicting bookings
    const conflictingBookings = await Booking.findConflicting(
      slotId, 
      new Date(startTime), 
      new Date(endTime)
    );

    if (conflictingBookings.length > 0) {
      return res.status(400).json({ 
        message: 'Slot is not available for the selected time period' 
      });
    }

    // Calculate amount
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationHours = (end - start) / (1000 * 60 * 60);
    const amount = slot.calculatePrice(durationHours);

    // Create booking
    const bookingData = {
      userId: req.user._id,
      placeId,
      slotId,
      startTime: start,
      endTime: end,
      amount,
      currency: slot.pricing.currency,
      vehicle,
      specialRequests,
      notes,
      createdBy: req.user._id,
      lastUpdatedBy: req.user._id
    };

    const booking = await Booking.create(bookingData);

    // Update slot availability
    slot.isAvailable = false;
    slot.status = 'occupied';
    slot.lastUpdatedBy = req.user._id;
    await slot.save();

    // Update parking place capacity
    const parkingPlace = await ParkingPlace.findById(placeId);
    if (parkingPlace) {
      parkingPlace.capacity.availableSlots = Math.max(0, parkingPlace.capacity.availableSlots - 1);
      parkingPlace.capacity.reservedSlots += 1;
      parkingPlace.lastUpdatedBy = req.user._id;
      await parkingPlace.save();
    }

    // Populate booking data
    await booking.populate('userId', 'name email');
    await booking.populate('placeId', 'name address');
    await booking.populate('slotId', 'slotNumber type');

    res.status(201).json(booking);
  } catch (err) {
    console.error('Create booking error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Server error creating booking' });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user can modify this booking
    if (req.user.role !== 'admin' && booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if booking can be modified
    if (!booking.canBeModified()) {
      return res.status(400).json({ 
        message: 'Booking cannot be modified at this time' 
      });
    }

    // Update fields
    const allowedFields = ['startTime', 'endTime', 'vehicle', 'specialRequests', 'notes'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        booking[field] = req.body[field];
      }
    });

    booking.lastUpdatedBy = req.user._id;
    await booking.save();

    await booking.populate('userId', 'name email');
    await booking.populate('placeId', 'name address');
    await booking.populate('slotId', 'slotNumber type');

    res.json(booking);
  } catch (err) {
    console.error('Update booking error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Server error updating booking' });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user can cancel this booking
    if (req.user.role !== 'admin' && booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if booking can be cancelled
    if (!booking.canBeCancelled) {
      return res.status(400).json({ 
        message: 'Booking cannot be cancelled at this time' 
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancellation = {
      reason: req.body.reason || 'Cancelled by user',
      cancelledBy: req.user._id,
      cancelledAt: new Date(),
      refundAmount: booking.amount // Full refund for now
    };
    booking.lastUpdatedBy = req.user._id;
    await booking.save();

    // Update slot availability
    const slot = await ParkingSlot.findById(booking.slotId);
    if (slot) {
      slot.isAvailable = true;
      slot.status = 'available';
      slot.lastUpdatedBy = req.user._id;
      await slot.save();
    }

    // Update parking place capacity
    const parkingPlace = await ParkingPlace.findById(booking.placeId);
    if (parkingPlace) {
      parkingPlace.capacity.availableSlots += 1;
      parkingPlace.capacity.reservedSlots = Math.max(0, parkingPlace.capacity.reservedSlots - 1);
      parkingPlace.lastUpdatedBy = req.user._id;
      await parkingPlace.save();
    }

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    console.error('Cancel booking error:', err);
    res.status(500).json({ message: 'Server error cancelling booking' });
  }
};

// Delete booking (admin only)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.deleteOne();

    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Delete booking error:', err);
    res.status(500).json({ message: 'Server error deleting booking' });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { userId: req.user._id };
    if (status) filter.status = status;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('placeId', 'name address')
      .populate('slotId', 'slotNumber type')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Booking.countDocuments(filter);

    res.json({
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Get user bookings error:', err);
    res.status(500).json({ message: 'Server error fetching user bookings' });
  }
};

// Search bookings (admin only)
exports.searchBookings = async (req, res) => {
  try {
    const {
      query,
      status,
      placeId,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (query) {
      filter.$or = [
        { 'vehicle.licensePlate': new RegExp(query, 'i') },
        { 'vehicle.make': new RegExp(query, 'i') },
        { 'vehicle.model': new RegExp(query, 'i') }
      ];
    }
    
    if (status) filter.status = status;
    if (placeId) filter.placeId = placeId;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('userId', 'name email')
      .populate('placeId', 'name address')
      .populate('slotId', 'slotNumber type')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Booking.countDocuments(filter);

    res.json({
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Search bookings error:', err);
    res.status(500).json({ message: 'Server error searching bookings' });
  }
};

// Get booking statistics (admin only)
exports.getBookingStats = async (req, res) => {
  try {
    const { period = '30d', placeId } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filter = {
      createdAt: { $gte: startDate }
    };
    if (placeId) filter.placeId = placeId;

    // Get booking counts by status
    const statusStats = await Booking.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Get total bookings and revenue
    const totals = await Booking.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' }
        }
      }
    ]);

    // Get bookings by day
    const dailyStats = await Booking.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const stats = {
      period,
      totals: totals[0] || {
        totalBookings: 0,
        totalRevenue: 0,
        averageAmount: 0
      },
      statusBreakdown: statusStats,
      dailyStats
    };

    res.json(stats);
  } catch (err) {
    console.error('Get booking stats error:', err);
    res.status(500).json({ message: 'Server error fetching booking statistics' });
  }
};

// Quick book functionality
exports.quickBook = async (req, res) => {
  try {
    const { placeId, startTime, endTime, vehicle } = req.body;

    // Find available slot
    const availableSlot = await ParkingSlot.findOne({
      placeId,
      isAvailable: true,
      status: 'available'
    });

    if (!availableSlot) {
      return res.status(400).json({ message: 'No available slots found' });
    }

    // Create booking using the available slot
    const bookingData = {
      userId: req.user._id,
      placeId,
      slotId: availableSlot._id,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      vehicle,
      createdBy: req.user._id,
      lastUpdatedBy: req.user._id
    };

    // Calculate amount
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationHours = (end - start) / (1000 * 60 * 60);
    bookingData.amount = availableSlot.calculatePrice(durationHours);
    bookingData.currency = availableSlot.pricing.currency;

    const booking = await Booking.create(bookingData);

    // Update slot availability
    availableSlot.isAvailable = false;
    availableSlot.status = 'occupied';
    await availableSlot.save();

    await booking.populate('placeId', 'name address');
    await booking.populate('slotId', 'slotNumber type');

    res.status(201).json(booking);
  } catch (err) {
    console.error('Quick book error:', err);
    res.status(500).json({ message: 'Server error processing quick booking' });
  }
};

// Process payment
exports.processPayment = async (req, res) => {
  try {
    const { paymentMethod, transactionId } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update payment information
    booking.payment.method = paymentMethod;
    booking.payment.status = 'completed';
    booking.payment.transactionId = transactionId;
    booking.payment.paidAt = new Date();
    booking.status = 'confirmed';
    booking.lastUpdatedBy = req.user._id;
    await booking.save();

    res.json({ message: 'Payment processed successfully', booking });
  } catch (err) {
    console.error('Process payment error:', err);
    res.status(500).json({ message: 'Server error processing payment' });
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      bookingId: booking._id,
      paymentStatus: booking.payment.status,
      amount: booking.amount,
      currency: booking.currency,
      paidAt: booking.payment.paidAt
    });
  } catch (err) {
    console.error('Get payment status error:', err);
    res.status(500).json({ message: 'Server error fetching payment status' });
  }
};

// Check in (admin only)
exports.checkIn = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.checkIn = {
      time: new Date(),
      checkedBy: req.user._id,
      notes: req.body.notes
    };
    booking.lastUpdatedBy = req.user._id;
    await booking.save();

    res.json({ message: 'Check-in successful', booking });
  } catch (err) {
    console.error('Check in error:', err);
    res.status(500).json({ message: 'Server error processing check-in' });
  }
};

// Check out (admin only)
exports.checkOut = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.checkOut = {
      time: new Date(),
      checkedBy: req.user._id,
      notes: req.body.notes
    };
    booking.status = 'completed';
    booking.lastUpdatedBy = req.user._id;
    await booking.save();

    // Update slot availability
    const slot = await ParkingSlot.findById(booking.slotId);
    if (slot) {
      slot.isAvailable = true;
      slot.status = 'available';
      await slot.save();
    }

    res.json({ message: 'Check-out successful', booking });
  } catch (err) {
    console.error('Check out error:', err);
    res.status(500).json({ message: 'Server error processing check-out' });
  }
};

// Export bookings (admin only)
exports.exportBookings = async (req, res) => {
  try {
    const { format = 'csv', startDate, endDate, placeId } = req.params;

    const filter = {};
    if (startDate) filter.createdAt = { $gte: new Date(startDate) };
    if (endDate) filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };
    if (placeId) filter.placeId = placeId;

    const bookings = await Booking.find(filter)
      .populate('userId', 'name email')
      .populate('placeId', 'name address')
      .populate('slotId', 'slotNumber type');

    // For now, return JSON. In a real application, you'd generate CSV/Excel
    res.json({
      format,
      data: bookings,
      exportedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Export bookings error:', err);
    res.status(500).json({ message: 'Server error exporting bookings' });
  }
};