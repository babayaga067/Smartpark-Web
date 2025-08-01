import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import parkingService from '../services/parkingService';

const ParkingContext = createContext();

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) throw new Error('useParking must be used within a ParkingProvider');
  return context;
};

export const ParkingProvider = ({ children }) => {
  // The canonical source of all places/spots in your app.
  const [parkingPlaces, setParkingPlaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Alias for compatibility
  const spots = parkingPlaces;
  const places = parkingPlaces;
  const fetchSpots = useCallback(async () => {
    setLoading(true);
    try {
      const response = await parkingService.getParkingPlaces();
      setParkingPlaces(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      setParkingPlaces([]);
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchPlaces = fetchSpots;

  const fetchUserBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await parkingService.getUserBookings();
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add your slot/bookings actions here as needed, e.g.:
  const createBooking = useCallback(async (bookingData) => {
    // Implement as needed
    return parkingService.createBooking(bookingData);
  }, []);

  // ...other actions for slots/filters as per your earlier code...

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  const value = {
    parkingPlaces,   // master, array of place/spot objects
    spots,           // alias for legacy/summary uses
    places,          // alias for components expecting 'places'
    fetchSpots,
    fetchPlaces,
    bookings,
    fetchUserBookings,
    createBooking,
    loading,
    // ...add more actions/fields as required
  };

  return <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>;
};

export default ParkingContext;