const ParkingPlace = require('../models/ParkingPlace');
const ParkingSlot = require('../models/ParkingSlot');
const Booking = require('../models/Booking');

// Get all parking places with filtering and pagination
exports.getParkingPlaces = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      status,
      minPrice,
      maxPrice,
      amenities,
      hasAvailable,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };
    
    if (city) {
      filter['address.city'] = new RegExp(city, 'i');
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (minPrice || maxPrice) {
      filter['pricing.hourlyRate'] = {};
      if (minPrice) filter['pricing.hourlyRate'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['pricing.hourlyRate'].$lte = parseFloat(maxPrice);
    }
    
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      filter.amenities = { $all: amenitiesArray };
    }
    
    if (hasAvailable === 'true') {
      filter['capacity.availableSlots'] = { $gt: 0 };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const parkingPlaces = await ParkingPlace.find(filter)
      .populate('createdBy', 'name')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await ParkingPlace.countDocuments(filter);

    res.json({
      data: parkingPlaces,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Get parking places error:', err);
    res.status(500).json({ message: 'Server error fetching parking places' });
  }
};

// Get single parking place by ID
exports.getParkingPlace = async (req, res) => {
  try {
    const parkingPlace = await ParkingPlace.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name');

    if (!parkingPlace) {
      return res.status(404).json({ message: 'Parking place not found' });
    }

    // Get available slots count
    const availableSlots = await ParkingSlot.countDocuments({
      placeId: req.params.id,
      isAvailable: true
    });

    const parkingPlaceData = parkingPlace.toObject();
    parkingPlaceData.availableSlots = availableSlots;

    res.json(parkingPlaceData);
  } catch (err) {
    console.error('Get parking place error:', err);
    res.status(500).json({ message: 'Server error fetching parking place' });
  }
};

// Create new parking place
exports.createParkingPlace = async (req, res) => {
  try {
    const parkingPlaceData = {
      ...req.body,
      createdBy: req.user._id,
      lastUpdatedBy: req.user._id
    };

    const parkingPlace = await ParkingPlace.create(parkingPlaceData);
    
    // Populate creator info
    await parkingPlace.populate('createdBy', 'name email');

    res.status(201).json(parkingPlace);
  } catch (err) {
    console.error('Create parking place error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Server error creating parking place' });
  }
};

// Update parking place
exports.updateParkingPlace = async (req, res) => {
  try {
    const parkingPlace = await ParkingPlace.findById(req.params.id);
    
    if (!parkingPlace) {
      return res.status(404).json({ message: 'Parking place not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'createdBy' && key !== '_id') {
        parkingPlace[key] = req.body[key];
      }
    });

    parkingPlace.lastUpdatedBy = req.user._id;
    await parkingPlace.save();

    await parkingPlace.populate('lastUpdatedBy', 'name');

    res.json(parkingPlace);
  } catch (err) {
    console.error('Update parking place error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Server error updating parking place' });
  }
};

// Delete parking place
exports.deleteParkingPlace = async (req, res) => {
  try {
    const parkingPlace = await ParkingPlace.findById(req.params.id);
    
    if (!parkingPlace) {
      return res.status(404).json({ message: 'Parking place not found' });
    }

    // Check if there are active bookings
    const activeBookings = await Booking.countDocuments({
      placeId: req.params.id,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete parking place with active bookings' 
      });
    }

    // Delete associated slots
    await ParkingSlot.deleteMany({ placeId: req.params.id });

    // Delete the parking place
    await parkingPlace.deleteOne();

    res.json({ message: 'Parking place deleted successfully' });
  } catch (err) {
    console.error('Delete parking place error:', err);
    res.status(500).json({ message: 'Server error deleting parking place' });
  }
};

// Get slots for a parking place
exports.getParkingPlaceSlots = async (req, res) => {
  try {
    const { status, type, isAvailable } = req.query;
    
    const filter = { placeId: req.params.id };
    
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

    const slots = await ParkingSlot.find(filter)
      .populate('placeId', 'name address')
      .sort({ slotNumber: 1 });

    res.json(slots);
  } catch (err) {
    console.error('Get parking place slots error:', err);
    res.status(500).json({ message: 'Server error fetching slots' });
  }
};

// Add slot to parking place
exports.addParkingPlaceSlot = async (req, res) => {
  try {
    const parkingPlace = await ParkingPlace.findById(req.params.id);
    
    if (!parkingPlace) {
      return res.status(404).json({ message: 'Parking place not found' });
    }

    const slotData = {
      ...req.body,
      placeId: req.params.id,
      createdBy: req.user._id
    };

    const slot = await ParkingSlot.create(slotData);

    // Update parking place capacity
    parkingPlace.capacity.totalSlots += 1;
    parkingPlace.capacity.availableSlots += 1;
    parkingPlace.lastUpdatedBy = req.user._id;
    await parkingPlace.save();

    res.status(201).json(slot);
  } catch (err) {
    console.error('Add parking place slot error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Server error adding slot' });
  }
};

// Update slot in parking place
exports.updateParkingPlaceSlot = async (req, res) => {
  try {
    const slot = await ParkingSlot.findOne({
      _id: req.params.slotId,
      placeId: req.params.id
    });

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    // Update slot fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'placeId' && key !== '_id') {
        slot[key] = req.body[key];
      }
    });

    slot.lastUpdatedBy = req.user._id;
    await slot.save();

    res.json(slot);
  } catch (err) {
    console.error('Update parking place slot error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Server error updating slot' });
  }
};

// Delete slot from parking place
exports.deleteParkingPlaceSlot = async (req, res) => {
  try {
    const slot = await ParkingSlot.findOne({
      _id: req.params.slotId,
      placeId: req.params.id
    });

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    // Check if slot has active bookings
    const activeBookings = await Booking.countDocuments({
      slotId: req.params.slotId,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete slot with active bookings' 
      });
    }

    // Update parking place capacity
    const parkingPlace = await ParkingPlace.findById(req.params.id);
    if (parkingPlace) {
      parkingPlace.capacity.totalSlots -= 1;
      if (slot.isAvailable) {
        parkingPlace.capacity.availableSlots -= 1;
      }
      parkingPlace.lastUpdatedBy = req.user._id;
      await parkingPlace.save();
    }

    await slot.deleteOne();

    res.json({ message: 'Slot deleted successfully' });
  } catch (err) {
    console.error('Delete parking place slot error:', err);
    res.status(500).json({ message: 'Server error deleting slot' });
  }
}; 