import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Car, DollarSign, Tag, ArrowLeft, Save, Plus } from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const CreateSlot = () => {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const { places, createSlot, fetchPlaces } = useParking();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createMultiple, setCreateMultiple] = useState(false);
  
  const [formData, setFormData] = useState({
    slotNumber: '',
    type: 'regular',
    pricePerHour: '',
    features: []
  });

  const [multipleSlotData, setMultipleSlotData] = useState({
    prefix: '',
    startNumber: 1,
    count: 5,
    type: 'regular',
    pricePerHour: '',
    features: []
  });

  const slotTypes = [
    { value: 'regular', label: 'Regular', icon: '🚗', description: 'Standard parking space' },
    { value: 'premium', label: 'Premium', icon: '⭐', description: 'Enhanced location and features' },
    { value: 'ev', label: 'EV Charging', icon: '⚡', description: 'Electric vehicle charging available' },
    { value: 'disabled', label: 'Disabled Access', icon: '♿', description: 'Accessible parking space' }
  ];

  const availableFeatures = [
    'Covered', 'Near Exit', 'Wide Space', 'Disabled Access', 'EV Charging', 
    'Security Camera', 'Well Lit', 'Ground Floor', 'Valet Available'
  ];

  useEffect(() => {
    const loadPlace = async () => {
      await fetchPlaces();
      const foundPlace = places.find(p => p.id === placeId);
      if (foundPlace) {
        setPlace(foundPlace);
        setFormData(prev => ({
          ...prev,
          pricePerHour: foundPlace.pricePerHour.toString()
        }));
        setMultipleSlotData(prev => ({
          ...prev,
          pricePerHour: foundPlace.pricePerHour.toString()
        }));
      }
    };

    if (placeId) {
      loadPlace();
    }
  }, [placeId, places]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (createMultiple) {
      setMultipleSlotData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    if (error) setError('');
  };

  const handleFeatureToggle = (feature) => {
    if (createMultiple) {
      setMultipleSlotData(prev => ({
        ...prev,
        features: prev.features.includes(feature)
          ? prev.features.filter(f => f !== feature)
          : [...prev.features, feature]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        features: prev.features.includes(feature)
          ? prev.features.filter(f => f !== feature)
          : [...prev.features, feature]
      }));
    }
  };

  const validateSingleSlot = () => {
    if (!formData.slotNumber.trim()) {
      setError('Slot number is required');
      return false;
    }
    if (!formData.pricePerHour || parseFloat(formData.pricePerHour) <= 0) {
      setError('Valid price per hour is required');
      return false;
    }
    return true;
  };

  const validateMultipleSlots = () => {
    if (!multipleSlotData.prefix.trim()) {
      setError('Slot prefix is required');
      return false;
    }
    if (multipleSlotData.count < 1 || multipleSlotData.count > 50) {
      setError('Number of slots must be between 1 and 50');
      return false;
    }
    if (!multipleSlotData.pricePerHour || parseFloat(multipleSlotData.pricePerHour) <= 0) {
      setError('Valid price per hour is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (createMultiple ? !validateMultipleSlots() : !validateSingleSlot()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (createMultiple) {
        // Create multiple slots
        const promises = [];
        for (let i = 0; i < multipleSlotData.count; i++) {
          const slotNumber = `${multipleSlotData.prefix}-${String(multipleSlotData.startNumber + i).padStart(3, '0')}`;
          const slotData = {
            placeId,
            slotNumber,
            type: multipleSlotData.type,
            pricePerHour: parseFloat(multipleSlotData.pricePerHour),
            features: multipleSlotData.features
          };
          promises.push(createSlot(slotData));
        }
        await Promise.all(promises);
      } else {
        // Create single slot
        const slotData = {
          placeId,
          slotNumber: formData.slotNumber,
          type: formData.type,
          pricePerHour: parseFloat(formData.pricePerHour),
          features: formData.features
        };
        await createSlot(slotData);
      }

      navigate(`/admin/slots/${placeId}`);
    } catch (err) {
      setError(err.message || 'Failed to create parking slot(s)');
    } finally {
      setLoading(false);
    }
  };

  if (!place) {
    return <LoadingSpinner text="Loading place information..." />;
  }

  const currentData = createMultiple ? multipleSlotData : formData;
  const selectedType = slotTypes.find(type => type.value === currentData.type);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/admin/slots/${placeId}`)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Slots
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Parking Slot</h1>
          <p className="text-gray-600 mt-1">Adding slots to: <strong>{place.name}</strong></p>
          <p className="text-sm text-gray-500">{place.address}</p>
        </div>

        {/* Creation Mode Toggle */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Creation Mode</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setCreateMultiple(false)}
              className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all ${
                !createMultiple
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Car className="h-5 w-5 mr-2" />
              Single Slot
            </button>
            <button
              onClick={() => setCreateMultiple(true)}
              className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all ${
                createMultiple
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Plus className="h-5 w-5 mr-2" />
              Multiple Slots
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Slot Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {createMultiple ? 'Multiple Slots Information' : 'Slot Information'}
            </h2>
            
            {createMultiple ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slot Prefix *
                    </label>
                    <input
                      type="text"
                      name="prefix"
                      required
                      value={multipleSlotData.prefix}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., A, B, LEVEL1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Number *
                    </label>
                    <input
                      type="number"
                      name="startNumber"
                      required
                      min="1"
                      value={multipleSlotData.startNumber}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Slots *
                    </label>
                    <input
                      type="number"
                      name="count"
                      required
                      min="1"
                      max="50"
                      value={multipleSlotData.count}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Preview:</h4>
                  <div className="text-blue-700 text-sm">
                    This will create {multipleSlotData.count} slots: {' '}
                    {Array.from({ length: Math.min(3, multipleSlotData.count) }, (_, i) => 
                      `${multipleSlotData.prefix}-${String(multipleSlotData.startNumber + i).padStart(3, '0')}`
                    ).join(', ')}
                    {multipleSlotData.count > 3 && ` ... ${multipleSlotData.prefix}-${String(multipleSlotData.startNumber + multipleSlotData.count - 1).padStart(3, '0')}`}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slot Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Car className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="slotNumber"
                    required
                    value={formData.slotNumber}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., A-001, B-15, LEVEL1-025"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Slot Type */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Slot Type</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slotTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    currentData.type === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={currentData.type === type.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="text-2xl mr-3">{type.icon}</div>
                  <div>
                    <div className="font-medium text-gray-900">{type.label}</div>
                    <div className="text-sm text-gray-600">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>

            {selectedType && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700 text-sm">
                  <strong>Selected:</strong> {selectedType.icon} {selectedType.label} - {selectedType.description}
                </p>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Hour ($) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="pricePerHour"
                  required
                  min="0"
                  step="0.01"
                  value={currentData.pricePerHour}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Default place rate: ${place.pricePerHour}/hour
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Features & Amenities</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableFeatures.map((feature) => (
                <label key={feature} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{feature}</span>
                </label>
              ))}
            </div>

            {currentData.features.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-green-800 text-sm">
                  <strong>Selected features:</strong> {currentData.features.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/admin/slots/${placeId}`)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {createMultiple ? `Create ${multipleSlotData.count} Slots` : 'Create Slot'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSlot;