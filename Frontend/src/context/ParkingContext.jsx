import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [places, setPlaces] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Places CRUD
  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const response = await parkingService.getPlaces();
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPlace = async (placeData) => {
    try {
      const response = await parkingService.createPlace(placeData);
      setPlaces(prev => [...prev, response.data]);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updatePlace = async (id, placeData) => {
    try {
      const response = await parkingService.updatePlace(id, placeData);
      setPlaces(prev => prev.map(place => 
        place.id === id ? response.data : place
      ));
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deletePlace = async (id) => {
    try {
      await parkingService.deletePlace(id);
      setPlaces(prev => prev.filter(place => place.id !== id));
    } catch (error) {
      throw error;
    }
  };

  // Slots CRUD
  const fetchSlots = async (placeId) => {
    try {
      setLoading(true);
      const response = await parkingService.getSlots(placeId);
      setSlots(response.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSlot = async (slotData) => {
    try {
      const response = await parkingService.createSlot(slotData);
      setSlots(prev => [...prev, response.data]);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateSlot = async (id, slotData) => {
    try {
      const response = await parkingService.updateSlot(id, slotData);
      setSlots(prev => prev.map(slot => 
        slot.id === id ? response.data : slot
      ));
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteSlot = async (id) => {
    try {
      await parkingService.deleteSlot(id);
      setSlots(prev => prev.filter(slot => slot.id !== id));
    } catch (error) {
      throw error;
    }
  };

  // Bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await parkingService.getBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData) => {
    try {
      const response = await parkingService.createBooking(bookingData);
      setBookings(prev => [...prev, response.data]);
      // Update slot availability
      setSlots(prev => prev.map(slot => 
        slot.id === bookingData.slotId 
          ? { ...slot, isAvailable: false }
          : slot
      ));
      return response;
    } catch (error) {
      throw error;
    }
  };

  const cancelBooking = async (id) => {
    try {
      const response = await parkingService.cancelBooking(id);
      setBookings(prev => prev.map(booking => 
        booking.id === id ? response.data : booking
      ));
      // Update slot availability
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        setSlots(prev => prev.map(slot => 
          slot.id === booking.slotId 
            ? { ...slot, isAvailable: true }
            : slot
        ));
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    places,
    slots,
    bookings,
    loading,
    fetchPlaces,
    createPlace,
    updatePlace,
    deletePlace,
    fetchSlots,
    createSlot,
    updateSlot,
    deleteSlot,
    fetchBookings,
    createBooking,
    cancelBooking
  };

  return (
    <ParkingContext.Provider value={value}>
      {children}
    </ParkingContext.Provider>
  );
};