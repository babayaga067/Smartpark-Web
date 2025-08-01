const ParkingSlot = require('../models/ParkingSlot');
const ParkingPlace = require('../models/ParkingPlace');
const Booking = require('../models/Booking');

// Get all parking slots with filtering and pagination
exports.getParkingSlots = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      placeId,
      type,
      status,
      isAvailable,
      sortBy = 'slotNumber',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (placeId) {
      filter.placeId = placeId;
    }
    
    if (type) {
      filter.type = type;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === 'true';
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const slots = await ParkingSlot.find(filter)
      .populate('placeId', 'name address')
      .populate('createdBy', 'name')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await ParkingSlot.countDocuments(filter);

    res.json({
      data: slots,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Get parking slots error:', err);
    res.status(500).json({ message: 'Server error fetching parking slots' });
  }
};

// Get single parking slot by ID
exports.getParkingSlot = async (req, res) => {
  try {
    const slot = await ParkingSlot.findById(req.params.id)
      .populate('placeId', 'name address contact')
      .populate('createdBy', 'name')
      .populate('lastUpdatedBy', 'name');

    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    // Get current booking if any
    const currentBooking = await Booking.findOne({
      slotId: req.params.id,
      status: { $in: ['confirmed', 'pending'] }
    }).populate('userId', 'name email');

    const slotData = slot.toObject();
    slotData.currentBooking = currentBooking;

    res.json(slotData);
  } catch (err) {
    console.error('Get parking slot error:', err);
    res.status(500).json({ message: 'Server error fetching parking slot' });
  }
};

// Create new parking slot
exports.createParkingSlot = async (req, res) => {
  try {
    const slotData = {
      ...req.body,
      createdBy: req.user._id,
      lastUpdatedBy: req.user._id
    };

    // Check if slot number already exists for this place
    const existingSlot = await ParkingSlot.findOne({
      placeId: slotData.placeId,
      slotNumber: slotData.slotNumber
    });

    if (existingSlot) {
      return res.status(400).json({ 
        message: 'Slot number already exists for this parking place' 
      });
    }

    const slot = await ParkingSlot.create(slotData);
    
    // Populate place and creator info
    await slot.populate('placeId', 'name');
    await slot.populate('createdBy', 'name');

    // Update parking place capacity
    const parkingPlace = await ParkingPlace.findById(slotData.placeId);
    if (parkingPlace) {
      parkingPlace.capacity.totalSlots += 1;
      if (slot.isAvailable) {
        parkingPlace.capacity.availableSlots += 1;
      }
      parkingPlace.lastUpdatedBy = req.user._id;
      await parkingPlace.save();
    }

    res.status(201).json(slot);
  } catch (err) {
    console.error('Create parking slot error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Server error creating parking slot' });
  }
};

// Update parking slot
exports.updateParkingSlot = async (req, res) => {
  try {
    const slot = await ParkingSlot.findById(req.params.id);
    
    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    // Check if slot number is being changed and if it conflicts
    if (req.body.slotNumber && req.body.slotNumber !== slot.slotNumber) {
      const existingSlot = await ParkingSlot.findOne({
        placeId: slot.placeId,
        slotNumber: req.body.slotNumber,
        _id: { $ne: req.params.id }
      });

      if (existingSlot) {
        return res.status(400).json({ 
          message: 'Slot number already exists for this parking place' 
        });
      }
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'placeId' && key !== '_id') {
        slot[key] = req.body[key];
      }
    });

    slot.lastUpdatedBy = req.user._id;
    await slot.save();

    await slot.populate('placeId', 'name');
    await slot.populate('lastUpdatedBy', 'name');

    res.json(slot);
  } catch (err) {
    console.error('Update parking slot error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Server error updating parking slot' });
  }
};

// Delete parking slot
exports.deleteParkingSlot = async (req, res) => {
  try {
    const slot = await ParkingSlot.findById(req.params.id);
    
    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    // Check if slot has active bookings
    const activeBookings = await Booking.countDocuments({
      slotId: req.params.id,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete slot with active bookings' 
      });
    }

    // Update parking place capacity
    const parkingPlace = await ParkingPlace.findById(slot.placeId);
    if (parkingPlace) {
      parkingPlace.capacity.totalSlots -= 1;
      if (slot.isAvailable) {
        parkingPlace.capacity.availableSlots -= 1;
      }
      parkingPlace.lastUpdatedBy = req.user._id;
      await parkingPlace.save();
    }

    await slot.deleteOne();

    res.json({ message: 'Parking slot deleted successfully' });
  } catch (err) {
    console.error('Delete parking slot error:', err);
    res.status(500).json({ message: 'Server error deleting parking slot' });
  }
};

// Check slot availability for a time period
exports.checkAvailability = async (req, res) => {
  try {
    const { slotId, startTime, endTime } = req.body;

    if (!slotId || !startTime || !endTime) {
      return res.status(400).json({ 
        message: 'Slot ID, start time, and end time are required' 
      });
    }

    const slot = await ParkingSlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    // Check if slot is available
    if (!slot.isAvailable || slot.status !== 'available') {
      return res.json({
        available: false,
        reason: `Slot is ${slot.statusDisplay}`
      });
    }

    // Check for conflicting bookings
    const conflictingBookings = await Booking.find({
      slotId,
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        {
          startTime: { $lt: new Date(endTime) },
          endTime: { $gt: new Date(startTime) }
        }
      ]
    });

    const isAvailable = conflictingBookings.length === 0;

    res.json({
      available: isAvailable,
      slot: {
        id: slot._id,
        slotNumber: slot.slotNumber,
        type: slot.type,
        pricing: slot.pricing
      },
      conflictingBookings: isAvailable ? [] : conflictingBookings.length
    });
  } catch (err) {
    console.error('Check availability error:', err);
    res.status(500).json({ message: 'Server error checking availability' });
  }
};

// Calculate price for a slot and duration
exports.calculatePrice = async (req, res) => {
  try {
    const { slotId, startTime, endTime } = req.body;

    if (!slotId || !startTime || !endTime) {
      return res.status(400).json({ 
        message: 'Slot ID, start time, and end time are required' 
      });
    }

    const slot = await ParkingSlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationHours = (end - start) / (1000 * 60 * 60);

    if (durationHours <= 0) {
      return res.status(400).json({ message: 'Invalid time duration' });
    }

    const price = slot.calculatePrice(durationHours);

    res.json({
      slotId: slot._id,
      slotNumber: slot.slotNumber,
      startTime,
      endTime,
      durationHours,
      price,
      currency: slot.pricing.currency,
      pricing: slot.pricing
    });
  } catch (err) {
    console.error('Calculate price error:', err);
    res.status(500).json({ message: 'Server error calculating price' });
  }
};

// Get slot statistics for admin
exports.getSlotStatistics = async (req, res) => {
  try {
    const { placeId, period = '30d' } = req.query;

    const filter = {};
    if (placeId) filter.placeId = placeId;

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

    // Get slot counts by status
    const statusStats = await ParkingSlot.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get slot counts by type
    const typeStats = await ParkingSlot.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get availability stats
    const availabilityStats = await ParkingSlot.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$isAvailable',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent bookings for slots
    const recentBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          ...(placeId && { placeId })
        }
      },
      {
        $group: {
          _id: '$slotId',
          bookingCount: { $sum: 1 },
          totalRevenue: { $sum: '$amount' }
        }
      },
      {
        $lookup: {
          from: 'parkingslots',
          localField: '_id',
          foreignField: '_id',
          as: 'slot'
        }
      },
      { $unwind: '$slot' },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: '$bookingCount' },
          totalRevenue: { $sum: '$totalRevenue' },
          averageBookingsPerSlot: { $avg: '$bookingCount' }
        }
      }
    ]);

    const stats = {
      period,
      totalSlots: statusStats.reduce((sum, stat) => sum + stat.count, 0),
      statusBreakdown: statusStats,
      typeBreakdown: typeStats,
      availabilityBreakdown: availabilityStats,
      bookingStats: recentBookings[0] || {
        totalBookings: 0,
        totalRevenue: 0,
        averageBookingsPerSlot: 0
      }
    };

    res.json(stats);
  } catch (err) {
    console.error('Get slot statistics error:', err);
    res.status(500).json({ message: 'Server error fetching slot statistics' });
  }
}; 