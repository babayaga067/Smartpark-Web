import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { parkingService } from '../services/parkingService';

const ParkingContext = createContext();

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};

export const ParkingProvider = ({ children }) => {
  const [parkingPlaces, setParkingPlaces] = useState([]);
  const [parkingSlots, setParkingSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    availability: 'all',
    amenities: []
  });

  // Fetch parking places
  const fetchParkingPlaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await parkingService.getParkingPlaces();
      setParkingPlaces(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch parking places');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch parking slots for a specific place
  const fetchParkingSlots = useCallback(async (placeId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await parkingService.getParkingSlots(placeId);
      setParkingSlots(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch parking slots');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user bookings
  const fetchUserBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await parkingService.getUserBookings();
      setBookings(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new booking
  const createBooking = useCallback(async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await parkingService.createBooking(bookingData);
      
      // Update local state
      setBookings(prev => [response.data, ...prev]);
      
      // Update slot availability
      setParkingSlots(prev => 
        prev.map(slot => 
          slot._id === bookingData.slotId 
            ? { ...slot, isAvailable: false }
            : slot
        )
      );
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel a booking
  const cancelBooking = useCallback(async (bookingId) => {
    try {
      setLoading(true);
      setError(null);
      await parkingService.cancelBooking(bookingId);
      
      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
      
      // Update slot availability
      setParkingSlots(prev => 
        prev.map(slot => 
          slot._id === selectedSlot?._id 
            ? { ...slot, isAvailable: true }
            : slot
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to cancel booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedSlot]);

  // Update booking
  const updateBooking = useCallback(async (bookingId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await parkingService.updateBooking(bookingId, updateData);
      
      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, ...response.data }
            : booking
        )
      );
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search bookings
  const searchBookings = useCallback(async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await parkingService.searchBookings(searchParams);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to search bookings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get booking details
  const getBookingDetails = useCallback(async (bookingId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await parkingService.getBookingDetails(bookingId);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch booking details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter parking places
  const filterParkingPlaces = useCallback((filters) => {
    setFilters(filters);
  }, []);

  // Get filtered parking places
  const getFilteredParkingPlaces = useCallback(() => {
    let filtered = [...parkingPlaces];

    if (filters.location) {
      filtered = filtered.filter(place => 
        place.name.toLowerCase().includes(filters.location.toLowerCase()) ||
        place.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(place => 
        place.hourlyRate >= min && place.hourlyRate <= max
      );
    }

    if (filters.availability !== 'all') {
      filtered = filtered.filter(place => {
        const availableSlots = place.slots?.filter(slot => slot.isAvailable).length || 0;
        if (filters.availability === 'available') {
          return availableSlots > 0;
        }
        return true;
      });
    }

    if (filters.amenities.length > 0) {
      filtered = filtered.filter(place => 
        filters.amenities.every(amenity => 
          place.amenities?.includes(amenity)
        )
      );
    }

    return filtered;
  }, [parkingPlaces, filters]);

  // Get available slots for a place
  const getAvailableSlots = useCallback((placeId) => {
    return parkingSlots.filter(slot => 
      slot.placeId === placeId && slot.isAvailable
    );
  }, [parkingSlots]);

  // Get booking statistics
  const getBookingStats = useCallback(() => {
    const total = bookings.length;
    const active = bookings.filter(b => b.status === 'confirmed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const pending = bookings.filter(b => b.status === 'pending').length;

    return {
      total,
      active,
      cancelled,
      pending,
      activePercentage: total > 0 ? (active / total) * 100 : 0
    };
  }, [bookings]);

  // Real-time updates (simulated)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setParkingSlots(prev => 
        prev.map(slot => ({
          ...slot,
          lastUpdated: new Date().toISOString()
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchParkingPlaces();
  }, [fetchParkingPlaces]);

  const value = {
    // State
    parkingPlaces,
    parkingSlots,
    bookings,
    loading,
    error,
    selectedPlace,
    selectedSlot,
    filters,

    // Actions
    setSelectedPlace,
    setSelectedSlot,
    fetchParkingPlaces,
    fetchParkingSlots,
    fetchUserBookings,
    createBooking,
    cancelBooking,
    updateBooking,
    searchBookings,
    getBookingDetails,
    filterParkingPlaces,
    getFilteredParkingPlaces,
    getAvailableSlots,
    getBookingStats,

    // Computed values
    filteredParkingPlaces: getFilteredParkingPlaces(),
    bookingStats: getBookingStats(),
    availableSlots: selectedPlace ? getAvailableSlots(selectedPlace._id) : []
  };

  return (
    <ParkingContext.Provider value={value}>
      {children}
    </ParkingContext.Provider>
  );
};
