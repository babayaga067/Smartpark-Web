import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Car, DollarSign, Download, Share2 } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings, fetchBookings } = useParking();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleDownloadReceipt = () => {
    // Simulate receipt download
    alert('Receipt downloaded successfully!');
  };

  const handleShareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Parking Booking Confirmation',
        text: `I've booked a parking spot at ${booking?.placeName}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Booking link copied to clipboard!');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading booking confirmation..." />;
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <CheckCircle className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">The booking confirmation you're looking for doesn't exist.</p>
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">Your parking spot has been successfully reserved</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Booking Details</h2>
            <div className="flex space-x-3">
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </button>
              <button
                onClick={handleShareBooking}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Location & Slot Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Slot</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{booking.placeName}</p>
                      <p className="text-sm text-gray-600">Downtown Location</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Slot {booking.slotNumber}</p>
                      <p className="text-sm text-gray-600">Regular Parking</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Booking ID</p>
                      <p className="font-medium text-gray-900">{booking.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {booking.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment Status</p>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {booking.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600">Booked On</p>
                      <p className="font-medium text-gray-900">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time & Payment Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Parking Duration</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Start Time</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.startTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">End Time</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.endTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Parking Fee</span>
                    <span className="font-medium text-gray-900">${booking.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium text-gray-900">$0.00</span>
                  </div>
                  <div className="border-t border-blue-200 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total Paid</span>
                      <span className="text-lg font-bold text-blue-600">${booking.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Access QR Code</h3>
            <div className="bg-gray-100 rounded-lg p-8 mb-4 inline-block">
              <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">QR Code</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Show this QR code at the parking entrance to access your reserved spot
            </p>
            <p className="text-sm text-gray-500">
              QR Code ID: {booking.id.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Important Information</h3>
          <ul className="space-y-2 text-yellow-700">
            <li>• Please arrive within 15 minutes of your start time</li>
            <li>• Keep this confirmation and QR code accessible on your phone</li>
            <li>• Contact support if you need to modify or cancel your booking</li>
            <li>• Late arrivals may result in automatic cancellation</li>
            <li>• Refunds are available up to 1 hour before start time</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/booking-history"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            View All Bookings
          </Link>
          <Link
            to="/parking-places"
            className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors text-center"
          >            Book Another Slot
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
