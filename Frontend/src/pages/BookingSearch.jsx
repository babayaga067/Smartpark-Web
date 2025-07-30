import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, Filter, SlidersHorizontal } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { places, fetchPlaces, loading } = useParking();
  
  const [searchFilters, setSearchFilters] = useState({
    location: searchParams.get('location') || '',
    date: searchParams.get('date') || new Date().toISOString().split('T')[0],
    startTime: searchParams.get('startTime') || '09:00',
    endTime: searchParams.get('endTime') || '17:00',
    priceRange: [0, 50],
    slotType: 'all',
    features: []
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const slotTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'regular', label: 'Regular' },
    { value: 'premium', label: 'Premium' },
    { value: 'ev', label: 'EV Charging' }
  ];

  const availableFeatures = [
    'Covered', 'Security', 'CCTV', 'Valet', 'Car Wash', 'EV Charging', '24/7 Access'
  ];

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    if (places.length > 0) {
      filterPlaces();
    }
  }, [places, searchFilters]);

  const filterPlaces = () => {
    let filtered = places.filter(place => {
      // Location filter
      if (searchFilters.location && !place.name.toLowerCase().includes(searchFilters.location.toLowerCase()) &&
          !place.address.toLowerCase().includes(searchFilters.location.toLowerCase())) {
        return false;
      }

      // Price filter
      if (place.pricePerHour < searchFilters.priceRange[0] || place.pricePerHour > searchFilters.priceRange[1]) {
        return false;
      }

      // Features filter
      if (searchFilters.features.length > 0) {
        const hasAllFeatures = searchFilters.features.every(feature => 
          place.features && place.features.includes(feature)
        );
        if (!hasAllFeatures) return false;
      }

      return true;
    });

    // Sort by availability and price
    filtered.sort((a, b) => {
      if (a.availableSlots !== b.availableSlots) {
        return b.availableSlots - a.availableSlots; // More available slots first
      }
      return a.pricePerHour - b.pricePerHour; // Lower price first
    });

    setFilteredPlaces(filtered);
  };

  const handleFilterChange = (key, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFeatureToggle = (feature) => {
    setSearchFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSearch = () => {
    // Update URL with search parameters
    const params = new URLSearchParams();
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value && value !== 'all' && (Array.isArray(value) ? value.length > 0 : true)) {
        params.set(key, Array.isArray(value) ? value.join(',') : value);
      }
    });
    navigate(`/booking-search?${params.toString()}`);
  };

  const handlePlaceSelect = (placeId) => {
    const params = new URLSearchParams();
    params.set('date', searchFilters.date);
    params.set('startTime', searchFilters.startTime);
    params.set('endTime', searchFilters.endTime);
    navigate(`/parking-slots/${placeId}?${params.toString()}`);
  };

  if (loading && places.length === 0) {
    return <LoadingSpinner text="Loading parking locations..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Parking</h1>
          <p className="text-gray-600">Search and filter parking locations based on your preferences</p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Location Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search location..."
                value={searchFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Date */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={searchFilters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Start Time */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                value={searchFilters.startTime}
                onChange={(e) => handleFilterChange('startTime', e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* End Time */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                value={searchFilters.endTime}
                onChange={(e) => handleFilterChange('endTime', e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Advanced Filters
            </button>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (per hour)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={searchFilters.priceRange[0]}
                      onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), searchFilters.priceRange[1]])}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={searchFilters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [searchFilters.priceRange[0], parseInt(e.target.value)])}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Slot Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slot Type
                  </label>
                  <select
                    value={searchFilters.slotType}
                    onChange={(e) => handleFilterChange('slotType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {slotTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {availableFeatures.map(feature => (
                      <label key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={searchFilters.features.includes(feature)}
                          onChange={() => handleFeatureToggle(feature)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results ({filteredPlaces.length} locations found)
            </h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option>Sort by Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Distance</option>
                <option>Availability</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <div key={place.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{place.name}</h3>
                    <div className="text-right ml-2">
                      <div className="text-lg font-bold text-blue-600">${place.pricePerHour}</div>
                      <div className="text-sm text-gray-500">per hour</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm line-clamp-2">{place.address}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Available spots</span>
                      <span className="text-sm font-medium text-gray-900">
                        {place.availableSlots}/{place.totalSlots}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          place.availableSlots > place.totalSlots * 0.5 ? 'bg-green-600' :
                          place.availableSlots > place.totalSlots * 0.2 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${(place.availableSlots / place.totalSlots) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {place.features && place.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {place.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {place.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{place.features.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handlePlaceSelect(place.id)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      place.availableSlots > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={place.availableSlots === 0}
                  >
                    {place.availableSlots > 0 ? 'Select Location' : 'No Slots Available'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or filters to find available parking spots.
            </p>
            <button
              onClick={() => setSearchFilters({
                location: '',
                date: new Date().toISOString().split('T')[0],
                startTime: '09:00',
                endTime: '17:00',
                priceRange: [0, 50],
                slotType: 'all',
                features: []
              })}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSearch;