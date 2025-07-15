import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Car, DollarSign, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const ParkingSlots = () => {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const { places, slots, fetchSlots, createBooking, loading } = useParking();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingData, setBookingData] = useState({
    startTime: '',
    endTime: '',
    totalAmount: 0
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  const place = places.find(p => p.id === placeId);

  useEffect(() => {
    if (placeId) {
      fetchSlots(placeId);
    }
  }, [placeId]);

  useEffect(() => {
    if (selectedSlot && bookingData.startTime && bookingData.endTime) {
      const start = new Date(bookingData.startTime);
      const end = new Date(bookingData.endTime);
      const hours = Math.ceil((end - start) / (1000 * 60 * 60));
      const totalAmount = hours * selectedSlot.pricePerHour;
      setBookingData(prev => ({ ...prev, totalAmount }));
    }
  }, [selectedSlot, bookingData.startTime, bookingData.endTime]);

  const handleSlotSelect = (slot) => {
    if (!slot.isAvailable) return;
    
    setSelectedSlot(slot);
    setShowBookingModal(true);
    setError('');
    
    // Set default times (current time + 1 hour)
    const now = new Date();
    const startTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
    
    setBookingData({
      startTime: startTime.toISOString().slice(0, 16),
      endTime: endTime.toISOString().slice(0, 16),
      totalAmount: 0
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setError('');

    try {
      const bookingPayload = {
        slotId: selectedSlot.id,
        placeId: placeId,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        totalAmount: bookingData.totalAmount
      };

      await createBooking(bookingPayload);
      setShowBookingModal(false);
      setSelectedSlot(null);
      
      // Show success message and redirect
      alert('Booking confirmed successfully!');
      navigate('/booking-history');
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const getSlotTypeColor = (type) => {
    switch (type) {
      case 'premium':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'ev':
        return 'bg-green-100 border-green-300 text-green-800';
      default:
        return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  const getSlotTypeIcon = (type) => {
    switch (type) {
      case 'premium':
        return '⭐';
      case 'ev':
        return '⚡';
      default:
        return '🚗';
    }
  };

  if (loading && slots.length === 0) {
    return <LoadingSpinner text="Loading parking slots..." />;
  }

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Parking place not found</h2>
          <button
            onClick={() => navigate('/parking-places')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to parking places
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/parking-places')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to parking places
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{place.name}</h1>
          <p className="text-gray-600">{place.address}</p>
          <div className="mt-4 flex items-center space-x-6">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-400 mr-1" />
              <span className="text-sm text-gray-600">${place.pricePerHour}/hour</span>
            </div>
            <div className="flex items-center">
              <Car className="h-5 w-5 text-gray-400 mr-1" />
              <span className="text-sm text-gray-600">
                {place.availableSlots}/{place.totalSlots} available
              </span>
            </div>
          </div>
        </div>

        {/* Slots Grid */}
        {slots.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {slots.map((slot) => (
              <div
                key={slot.id}
                onClick={() => handleSlotSelect(slot)}
                className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  slot.isAvailable
                    ? 'hover:shadow-md hover:scale-105 ' + getSlotTypeColor(slot.type)
                    : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {slot.isAvailable ? getSlotTypeIcon(slot.type) : '🚫'}
                  </div>
                  <div className="font-semibold text-sm mb-1">{slot.slotNumber}</div>
                  <div className="text-xs capitalize mb-2">{slot.type}</div>
                  <div className="text-xs font-medium">
                    ${slot.pricePerHour}/hr
                  </div>
                  {!slot.isAvailable && (
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">OCCUPIED</span>
                    </div>
                  )}
                </div>
                
                {slot.features && slot.features.length > 0 && (
                  <div className="mt-2">
                    {slot.features.slice(0, 2).map((feature, index) => (
                      <span
                        key={index}
                        className="inline-block px-1 py-0.5 bg-white bg-opacity-50 text-xs rounded mr-1 mb-1"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No parking slots available</h3>
            <p className="text-gray-500">This parking place doesn't have any slots configured yet.</p>
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Slot Types</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-3"></div>
              <span className="text-sm text-gray-600">Regular - Standard parking spot</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded mr-3"></div>
              <span className="text-sm text-gray-600">Premium - Enhanced features</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-3"></div>
              <span className="text-sm text-gray-600">EV - Electric vehicle charging</span>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        <Modal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          title="Book Parking Slot"
          size="md"
        >
          {selectedSlot && (
            <form onSubmit={handleBookingSubmit}>
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Selected Slot</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Slot {selectedSlot.slotNumber}</p>
                    <p className="text-sm text-gray-600 capitalize">{selectedSlot.type} type</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${selectedSlot.pricePerHour}/hour</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={bookingData.startTime}
                    onChange={(e) => setBookingData(prev => ({ ...prev, startTime: e.target.value }))}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={bookingData.endTime}
                    onChange={(e) => setBookingData(prev => ({ ...prev, endTime: e.target.value }))}
                    min={bookingData.startTime}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {bookingData.totalAmount > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${bookingData.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading || bookingData.totalAmount <= 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {bookingLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Booking...
                    </div>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ParkingSlots;