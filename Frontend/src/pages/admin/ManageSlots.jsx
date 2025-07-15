import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Car, DollarSign, ArrowLeft } from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';

const ManageSlots = () => {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const { places, slots, fetchSlots, createSlot, updateSlot, deleteSlot, loading } = useParking();
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    slotNumber: '',
    type: 'regular',
    pricePerHour: '',
    features: []
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  const place = places.find(p => p.id === placeId);
  const slotTypes = [
    { value: 'regular', label: 'Regular', icon: '🚗' },
    { value: 'premium', label: 'Premium', icon: '⭐' },
    { value: 'ev', label: 'EV Charging', icon: '⚡' }
  ];
  const availableFeatures = ['Covered', 'Near Exit', 'Wide Space', 'Disabled Access', 'EV Charging'];

  useEffect(() => {
    if (placeId) {
      fetchSlots(placeId);
    }
  }, [placeId]);

  const handleAddSlot = () => {
    setEditingSlot(null);
    setFormData({
      slotNumber: '',
      type: 'regular',
      pricePerHour: place?.pricePerHour?.toString() || '',
      features: []
    });
    setError('');
    setShowModal(true);
  };

  const handleEditSlot = (slot) => {
    setEditingSlot(slot);
    setFormData({
      slotNumber: slot.slotNumber,
      type: slot.type,
      pricePerHour: slot.pricePerHour.toString(),
      features: slot.features || []
    });
    setError('');
    setShowModal(true);
  };

  const handleDeleteSlot = async (slot) => {
    if (!window.confirm(`Are you sure you want to delete slot "${slot.slotNumber}"?`)) {
      return;
    }

    try {
      await deleteSlot(slot.id);
    } catch (error) {
      alert('Failed to delete slot: ' + error.message);
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
      const slotData = {
        ...formData,
        placeId,
        pricePerHour: parseFloat(formData.pricePerHour)
      };

      if (editingSlot) {
        await updateSlot(editingSlot.id, slotData);
      } else {
        await createSlot(slotData);
      }

      setShowModal(false);
    } catch (err) {
      setError(err.message || 'Failed to save slot');
    } finally {
      setFormLoading(false);
    }
  };

  const getSlotTypeInfo = (type) => {
    return slotTypes.find(t => t.value === type) || slotTypes[0];
  };

  const getSlotStatusColor = (slot) => {
    if (!slot.isAvailable) return 'bg-red-100 border-red-300';
    
    switch (slot.type) {
      case 'premium':
        return 'bg-purple-100 border-purple-300';
      case 'ev':
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-blue-100 border-blue-300';
    }
  };

  if (loading && slots.length === 0) {
    return <LoadingSpinner text="Loading parking slots..." />;
  }

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Parking place not found</h2>
          <button
            onClick={() => navigate('/admin/places')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to places
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
            onClick={() => navigate('/admin/places')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Places
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{place.name}</h1>
              <p className="text-gray-600 mt-1">{place.address}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                <span>Total Slots: {place.totalSlots}</span>
                <span>Available: {place.availableSlots}</span>
                <span>Price: ${place.pricePerHour}/hour</span>
              </div>
            </div>
            <button
              onClick={handleAddSlot}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Slot
            </button>
          </div>
        </div>

        {/* Slots Grid */}
        {slots.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {slots.map((slot) => {
              const typeInfo = getSlotTypeInfo(slot.type);
              return (
                <div
                  key={slot.id}
                  className={`relative p-4 rounded-lg border-2 transition-all ${getSlotStatusColor(slot)}`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{typeInfo.icon}</div>
                    <div className="font-semibold text-sm mb-1">{slot.slotNumber}</div>
                    <div className="text-xs capitalize mb-2">{slot.type}</div>
                    <div className="text-xs font-medium mb-2">
                      ${slot.pricePerHour}/hr
                    </div>
                    
                    {slot.features && slot.features.length > 0 && (
                      <div className="mb-2">
                        {slot.features.slice(0, 1).map((feature, index) => (
                          <span
                            key={index}
                            className="inline-block px-1 py-0.5 bg-white bg-opacity-50 text-xs rounded"
                          >
                            {feature}
                          </span>
                        ))}
                        {slot.features.length > 1 && (
                          <span className="block text-xs text-gray-600 mt-1">
                            +{slot.features.length - 1} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex justify-center space-x-1 mt-2">
                      <button
                        onClick={() => handleEditSlot(slot)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit slot"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlot(slot)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Delete slot"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {!slot.isAvailable && (
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">OCCUPIED</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No parking slots</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first parking slot</p>
            <button
              onClick={handleAddSlot}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add First Slot
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Slot Types</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {slotTypes.map((type) => (
              <div key={type.value} className="flex items-center">
                <div className="text-2xl mr-3">{type.icon}</div>
                <div>
                  <div className="font-medium text-gray-900">{type.label}</div>
                  <div className="text-sm text-gray-600">
                    {type.value === 'regular' && 'Standard parking spot'}
                    {type.value === 'premium' && 'Enhanced features and location'}
                    {type.value === 'ev' && 'Electric vehicle charging available'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Slot Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingSlot ? 'Edit Parking Slot' : 'Add New Parking Slot'}
          size="md"
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
                  Slot Number *
                </label>
                <input
                  type="text"
                  name="slotNumber"
                  required
                  value={formData.slotNumber}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., A-001, B-15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slot Type *
                </label>
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  {slotTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
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
                    {editingSlot ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  editingSlot ? 'Update Slot' : 'Create Slot'
                )}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageSlots;