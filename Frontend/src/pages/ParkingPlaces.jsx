import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Star, Search, Filter } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ParkingPlaces = () => {
  const { places, fetchPlaces, loading } = useParking();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    let filtered = places.filter(place =>
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort places
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.pricePerHour - b.pricePerHour;
        case 'availability':
          return b.availableSlots - a.availableSlots;
        default:
          return 0;
      }
    });

    setFilteredPlaces(filtered);
  }, [places, searchTerm, sortBy]);

  if (loading && places.length === 0) {
    return <LoadingSpinner text="Loading parking places..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Parking Places</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by location or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="availability">Sort by Availability</option>
              </select>
              <Filter className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Places Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <div key={place.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{place.name}</h3>
                    <div className="flex items-center ml-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">4.5</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm line-clamp-2">{place.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="text-sm">${place.pricePerHour}/hour</span>
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

                  <Link
                    to={`/parking-slots/${place.id}`}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      place.availableSlots > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {place.availableSlots > 0 ? 'View Slots' : 'No Slots Available'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No parking places found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No parking places available at the moment'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingPlaces;