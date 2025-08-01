const mongoose = require('mongoose');

const ParkingSpotSchema = new mongoose.Schema({
  location: { type: String, required: true },
  status: { type: String, enum: ['available', 'booked'], default: 'available' },
}, { timestamps: true });

module.exports = mongoose.model('ParkingSpot', ParkingSpotSchema);