import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                <Search className="h-16 w-16 text-blue-400" />
              </div>
            </div>
            <div className="relative z-10 pt-16">
              <div className="w-8 h-8 bg-red-500 rounded-full mx-auto animate-bounce"></div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            The page you're looking for seems to have driven away.
          </p>
          <p className="text-gray-500">
            Don't worry, even the best parking apps have dead ends sometimes!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Looking for something specific?</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link
              to="/parking-places"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Find Parking
            </Link>
            <Link
              to="/dashboard"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/booking-history"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              My Bookings
            </Link>
            <Link
              to="/help"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Help Center
            </Link>
          </div>
        </div>

        {/* Fun Parking Fact */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Fun Fact:</strong> The average driver spends 17 hours per year looking for parking. 
            With SmartPark, you can find your spot in seconds!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;