import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, MapPin, DollarSign, Car } from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';

const ManagePlaces = () => {
  const { places, fetchPlaces, createPlace, updatePlace, deletePlace, loading } = useParking();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    pricePerHour: '',
    features: []
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  const availableFeatures = ['Covered', 'Security', 'CCTV', 'Valet', 'Car Wash', 'EV Charging', '24/7 Access'];

  useEffect(() => {
    fetchPlaces();
  }, []);

  const filteredPlaces = places.filter(place =>
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPlace = () => {
    setEditingPlace(null);
    setFormData({
      name: '',
      address: '',
      description: '',
      pricePerHour: '',
      features: []
    });
    setError('');
    setShowModal(true);
  };

  const handleEditPlace = (place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      address: place.address,
      description: place.description || '',
      pricePerHour: place.pricePerHour.toString(),
      features: place.features || []
    });
    setError('');
    setShowModal(true);
  };

  const handleDeletePlace = async (place) => {
    if (!window.confirm(`Are you sure you want to delete "${place.name}"? This will also delete all associated slots.`)) {
      return;
    }

    try {
      await deletePlace(place.id);
    } catch (error) {
      alert('Failed to delete place: ' + error.message);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      const placeData = {
        ...formData,
        pricePerHour: parseFloat(formData.pricePerHour)
      };

      if (editingPlace) {
        await updatePlace(editingPlace.id, placeData);
      } else {
        await createPlace(placeData);
      }

      setShowModal(false);
    } catch (err) {
      setError(err.message || 'Failed to save place');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading && places.length === 0) {
    return <LoadingSpinner text="Loading parking places..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Parking Places</h1>
              <p className="text-gray-600 mt-2">Add, edit, and manage parking locations</p>
            </div>
            <button
              onClick={handleAddPlace}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Place
            </button>
          </div>

          {/* Search */}
          <div className="mt-6 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search places..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Places Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <div key={place.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{place.name}</h3>
                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={() => handleEditPlace(place)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePlace(place)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
                  <div className="flex items-center text-gray-600">
                    <Car className="h-4 w-4 mr-2" />
                    <span className="text-sm">{place.availableSlots}/{place.totalSlots} available</span>
                  </div>
                </div>

                {place.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{place.description}</p>
                )}

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

                <div className="flex space-x-2">
                  <button
                    onClick={() => window.location.href = `/admin/slots/${place.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Manage Slots ({place.totalSlots})
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No parking places found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first parking place'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddPlace}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add First Place
              </button>
            )}
          </div>
        )}

        {/* Add/Edit Place Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingPlace ? 'Edit Parking Place' : 'Add New Parking Place'}
          size="lg"
        >
          <form onSubmit={handleFormSubmit}>
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Place Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter place name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter description (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Hour ($) *
                </label>
                <input
                  type="number"
                  name="pricePerHour"
                  required
                  min="0"
                  step="0.01"
                  value={formData.pricePerHour}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableFeatures.map((feature) => (
                    <label key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {formLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingPlace ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  editingPlace ? 'Update Place' : 'Create Place'
                )}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ManagePlaces;