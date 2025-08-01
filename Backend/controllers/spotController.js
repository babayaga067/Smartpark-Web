const ParkingSpot = require('../models/ParkingSpot');
const Booking = require('../models/Booking');

exports.getSpots = async (req, res) => {
  try {
    const spots = await ParkingSpot.find();
    res.json(spots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSpot = async (req, res) => {
  const { location } = req.body;
  try {
    const spot = await ParkingSpot.create({ location });
    res.status(201).json(spot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSpot = async (req, res) => {
  try {
    const spot = await ParkingSpot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!spot) return res.status(404).json({ message: 'Spot not found' });
    res.json(spot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSpot = async (req, res) => {
  try {
    const spot = await ParkingSpot.findByIdAndDelete(req.params.id);
    if (!spot) return res.status(404).json({ message: 'Spot not found' });
    // Optionally, delete related bookings
    await Booking.deleteMany({ spotId: req.params.id });
    res.json({ message: 'Spot deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};