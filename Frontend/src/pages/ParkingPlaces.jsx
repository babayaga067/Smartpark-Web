import React, { useEffect, useState } from 'react';
import { Car, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const ParkingPlaces = () => {
  const { spots = [], fetchSpots, createBooking, loading } = useParking();
  const { user } = useAuth();
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  const handleBookSpot = (spot) => {
    setSelectedSpot(spot);
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (!selectedSpot) return;
    setBookingLoading(true);
    try {
      await createBooking({ spotId: selectedSpot._id });
      setShowBookingModal(false);
      setSelectedSpot(null);
      fetchSpots(); // Refresh
    } catch (error) {
      alert('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const availableSpots = spots.filter(spot => spot.status === 'available');
  const bookedSpots = spots.filter(spot => spot.status === 'booked');

  if (loading) {
    return <LoadingSpinner text="Loading parking spots..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Parking Spots</h1>
          <p className="text-gray-600 mt-2">Find and book available parking spots</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-lg p-3 mr-4">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spots</p>
                <p className="text-2xl font-bold text-gray-900">{spots.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-lg p-3 mr-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{availableSpots.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-red-500 rounded-lg p-3 mr-4">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-gray-900">{bookedSpots.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Spots */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Spots</h2>
          
          {availableSpots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableSpots.map((spot) => (
                <div
                  key={spot._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-lg p-2 mr-3">
                        <Car className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{spot.location}</h3>
                        <p className="text-sm text-gray-600">Spot #{spot._id.slice(-4)}</p>
                      </div>
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Available
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{spot.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Ready for booking</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookSpot(spot)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Spots</h3>
              <p className="text-gray-500">All parking spots are currently occupied. Please check back later.</p>
            </div>
          )}
        </div>

        {/* Occupied Spots */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Occupied Spots</h2>
          
          {bookedSpots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookedSpots.map((spot) => (
                <div
                  key={spot._id}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-red-100 rounded-lg p-2 mr-3">
                        <Car className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{spot.location}</h3>
                        <p className="text-sm text-gray-600">Spot #{spot._id.slice(-4)}</p>
                      </div>
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Occupied
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{spot.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Currently in use</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No occupied spots to display.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Confirm Booking"
      >
        {selectedSpot && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Booking Details</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Location:</strong> {selectedSpot.location}</p>
                <p><strong>Spot ID:</strong> {selectedSpot._id.slice(-4)}</p>
                <p><strong>Status:</strong> Available</p>
              </div>
            </div>
            
            <p className="text-gray-600">
              Are you sure you want to book this parking spot? This will reserve the spot for you.
            </p>
            
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                disabled={bookingLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ParkingPlaces;