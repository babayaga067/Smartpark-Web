import React, { useEffect, useState } from 'react';
import { Car, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';

const ManageSpots = () => {
  const { spots, fetchSpots, createSpot, updateSpot, deleteSpot, loading } = useParking();
  const [showModal, setShowModal] = useState(false);
  const [editingSpot, setEditingSpot] = useState(null);
  const [formData, setFormData] = useState({ location: '' });
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  const handleAddSpot = () => {
    setEditingSpot(null);
    setFormData({ location: '' });
    setShowModal(true);
  };

  const handleEditSpot = (spot) => {
    setEditingSpot(spot);
    setFormData({ location: spot.location });
    setShowModal(true);
  };

  const handleDeleteSpot = async (spotId) => {
    if (window.confirm('Are you sure you want to delete this spot?')) {
      try {
        await deleteSpot(spotId);
      } catch (error) {
        console.error('Error deleting spot:', error);
        alert('Failed to delete spot. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      if (editingSpot) {
        await updateSpot(editingSpot._id, formData);
      } else {
        await createSpot(formData);
      }
      setShowModal(false);
      setFormData({ location: '' });
      setEditingSpot(null);
    } catch (error) {
      console.error('Error saving spot:', error);
      alert('Failed to save spot. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <LoadingSpinner text="Loading spots..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Parking Spots</h1>
              <p className="text-gray-600 mt-2">Add, edit, and manage parking spots</p>
            </div>
            <button
              onClick={handleAddSpot}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Spot
            </button>
          </div>
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
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {spots.filter(spot => spot.status === 'available').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-red-500 rounded-lg p-3 mr-4">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-gray-900">
                  {spots.filter(spot => spot.status === 'booked').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Spots List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Parking Spots</h2>
          </div>
          
          {spots.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spot ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {spots.map((spot) => (
                    <tr key={spot._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {spot._id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {spot.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          spot.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {spot.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(spot.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditSpot(spot)}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSpot(spot._id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Spots Yet</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first parking spot.</p>
              <button
                onClick={handleAddSpot}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add First Spot
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSpot ? 'Edit Parking Spot' : 'Add New Parking Spot'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter spot location (e.g., A1, B2, etc.)"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              disabled={modalLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              disabled={modalLoading}
            >
              {modalLoading ? 'Saving...' : (editingSpot ? 'Update Spot' : 'Add Spot')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageSpots;