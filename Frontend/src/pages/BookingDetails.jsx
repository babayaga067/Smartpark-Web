import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Car, DollarSign, Edit, Trash2, ArrowLeft, AlertCircle } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings, fetchBookings, cancelBooking } = useParking();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      await fetchBookings();
      const foundBooking = bookings.find(b => b.id === bookingId);
      setBooking(foundBooking);
      setLoading(false);
    };

    if (bookingId) {
      loadBooking();
    }
  }, [bookingId, bookings]);

  const handleCancelBooking = async () => {
    setCancelling(true);
    try {
      await cancelBooking(booking.id);
      setShowCancelModal(false);
      navigate('/booking-history');
    } catch (error) {
      alert('Failed to cancel booking: ' + error.message);
    } finally {
      setCancelling(false);
    }
  };

  const canCancelBooking = () => {
    if (!booking) return false;
    return booking.status === 'active' && new Date(booking.startTime) > new Date();
  };

  const canModifyBooking = () => {
    if (!booking) return false;
    return booking.status === 'active' && new Date(booking.startTime) > new Date(Date.now() + 60 * 60 * 1000); // 1 hour before
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return <LoadingSpinner text="Loading booking details..." />;
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/booking-history"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/booking-history')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Booking History
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
              <p className="text-gray-600 mt-1">Booking ID: {booking.id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Location Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Details</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">{booking.placeName}</h3>
                    <p className="text-gray-600">123 Main Street, Downtown</p>
                    <p className="text-sm text-gray-500 mt-1">Premium parking facility with 24/7 security</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Car className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Slot {booking.slotNumber}</p>
                    <p className="text-sm text-gray-600">Regular parking space</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Time & Duration */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Parking Schedule</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">Start Time</span>
                  </div>
                  <p className="text-gray-600 ml-7">
                    {new Date(booking.startTime).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 ml-7">
                    {new Date(booking.startTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">End Time</span>
                  </div>
                  <p className="text-gray-600 ml-7">
                    {new Date(booking.endTime).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 ml-7">
                    {new Date(booking.endTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">
                  Total Duration: {formatDuration(booking.startTime, booking.endTime)}
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Booking Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Payment Method</p>
                  <p className="font-medium text-gray-900">Credit Card</p>
                </div>
                <div>
                  <p className="text-gray-600">Vehicle Type</p>
                  <p className="font-medium text-gray-900">Regular Car</p>
                </div>
                <div>
                  <p className="text-gray-600">Special Requests</p>
                  <p className="font-medium text-gray-900">None</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Parking Fee</span>
                  <span className="font-medium text-gray-900">${booking.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium text-gray-900">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">$0.00</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-blue-600">${booking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  Payment {booking.paymentStatus}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                {canModifyBooking() && (
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Edit className="h-4 w-4 mr-2" />
                    Modify Booking
                  </button>
                )}
                {canCancelBooking() && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cancel Booking
                  </button>
                )}
                <Link
                  to={`/booking-confirmation/${booking.id}`}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  View Confirmation
                </Link>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-blue-700 text-sm mb-3">
                Contact our support team for assistance with your booking.
              </p>
              <Link
                to="/contact"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </div>

        {/* Cancel Booking Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancel Booking"
          size="md"
        >
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              <span className="font-medium text-gray-900">Are you sure you want to cancel this booking?</span>
            </div>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. You will receive a full refund if cancelled at least 1 hour before your start time.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">
                <strong>Refund Policy:</strong> Cancellations made more than 1 hour before start time are eligible for full refund.
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCancelModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Keep Booking
            </button>
            <button
              onClick={handleCancelBooking}
              disabled={cancelling}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default BookingDetails;