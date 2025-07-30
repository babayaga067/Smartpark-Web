import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Calendar, Zap, Star } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import LoadingSpinner from '../components/LoadingSpinner';

const QuickBook = () => {
  const navigate = useNavigate();
  const { places, fetchPlaces, createBooking, loading } = useParking();

  const [quickBookData, setQuickBookData] = useState({
    duration: '2', // hours
    startTime: 'now'
  });

  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [bookingPlace, setBookingPlace] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const durationOptions = [
    { value: '1', label: '1 Hour', price: 'from $5' },
    { value: '2', label: '2 Hours', price: 'from $10' },
    { value: '4', label: '4 Hours', price: 'from $18' },
    { value: '8', label: '8 Hours', price: 'from $32' }
  ];

  const startTimeOptions = [
    { value: 'now', label: 'Right Now' },
    { value: '30min', label: 'In 30 Minutes' },
    { value: '1hour', label: 'In 1 Hour' },
    { value: '2hours', label: 'In 2 Hours' }
  ];

  useEffect(() => {
    fetchPlaces(); // Fetch only on mount
  }, [fetchPlaces]);

  useEffect(() => {
    if (!places || places.length === 0) return;

    const available = places
      .filter(place => place.availableSlots > 0)
      .sort((a, b) => b.availableSlots - a.availableSlots)
      .slice(0, 6);

    setAvailablePlaces(available);
  }, [places]);

  const calculateStartTime = () => {
    const now = new Date();
    switch (quickBookData.startTime) {
      case '30min':
        return new Date(now.getTime() + 30 * 60 * 1000);
      case '1hour':
        return new Date(now.getTime() + 60 * 60 * 1000);
      case '2hours':
        return new Date(now.getTime() + 2 * 60 * 60 * 1000);
      default:
        return now;
    }
  };

  const calculateEndTime = (startTime) => {
    const hours = parseInt(quickBookData.duration, 10);
    return new Date(startTime.getTime() + hours * 60 * 60 * 1000);
  };

  const handleQuickBook = async (place) => {
    setBookingPlace(place);
    setBookingLoading(true);

    try {
      const startTime = calculateStartTime();
      const endTime = calculateEndTime(startTime);

      const searchParams = new URLSearchParams({
        date: startTime.toISOString().split('T')[0],
        startTime: startTime.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5)
      });

      navigate(`/view-slots/${place.id}?${searchParams.toString()}`);
    } catch (error) {
      console.error('Navigation failed:', error);
    } finally {
      setBookingLoading(false);
      setBookingPlace(null);
    }
  };

  if (loading && places.length === 0) {
    return <LoadingSpinner text="Loading quick booking options..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
            <Zap className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quick Book</h1>
          <p className="text-lg text-gray-600">Find and book parking in seconds</p>
        </div>

        {/* Duration Options */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">How long do you need parking?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {durationOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setQuickBookData(prev => ({ ...prev, duration: option.value }))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  quickBookData.duration === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{option.price}</div>
                </div>
              </button>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">When do you want to start?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {startTimeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setQuickBookData(prev => ({ ...prev, startTime: option.value }))}
                className={`p-3 rounded-lg border-2 transition-all ${
                  quickBookData.startTime === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <Clock className="h-5 w-5 mx-auto mb-1" />
                  <div className="font-medium text-sm">{option.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Available Places */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Available Now ({availablePlaces.length} locations)
          </h2>
          <p className="text-gray-600 mb-6">
            These locations have spots available for your selected time and duration
          </p>
        </div>

        {availablePlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePlaces.map(place => {
              const hours = parseInt(quickBookData.duration, 10);
              const totalCost = hours * place.pricePerHour;
              const isBooking = bookingPlace?.id === place.id;

              return (
                <div key={place.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{place.name}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{place.address}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-600">4.5 (120 reviews)</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-blue-600">${totalCost}</div>
                        <div className="text-sm text-gray-500">for {hours}h</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Available spots</span>
                        <span className="text-sm font-medium text-green-600">
                          {place.availableSlots} available
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${Math.min((place.availableSlots / place.totalSlots) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {place.features?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {place.features.slice(0, 2).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {place.features.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{place.features.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {quickBookData.startTime === 'now'
                            ? 'Starting now'
                            : `Starting ${startTimeOptions.find(opt => opt.value === quickBookData.startTime)?.label.toLowerCase()}`}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Duration: {hours} hour{hours !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickBook(place)}
                      disabled={isBooking || bookingLoading}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isBooking ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Booking...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Quick Book - ${totalCost}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No spots available</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your duration or start time, or browse all locations.
            </p>
            <button
              onClick={() => navigate('/parking-places')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Locations
            </button>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Booking Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
            <div className="flex items-start">
              <Zap className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Instant Confirmation</div>
                <div className="text-sm text-blue-700">
                  Your spot is reserved immediately after booking
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Flexible Timing</div>
                <div className="text-sm text-blue-700">
                  Extend your booking anytime through the app
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickBook;
