import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Mock data for development
let mockPlaces = [
  {
    id: '1',
    name: 'Downtown Mall Parking',
    address: '123 Main Street, Downtown',
    description: 'Covered parking facility with 24/7 security',
    totalSlots: 100,
    availableSlots: 45,
    pricePerHour: 5.00,
    features: ['Covered', 'Security', 'CCTV'],
    coordinates: { lat: 40.7128, lng: -74.0060 },
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Business District Garage',
    address: '456 Business Ave, Financial District',
    description: 'Premium parking with valet service',
    totalSlots: 150,
    availableSlots: 78,
    pricePerHour: 8.00,
    features: ['Valet', 'Car Wash', 'EV Charging'],
    coordinates: { lat: 40.7589, lng: -73.9851 },
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Shopping Center Plaza',
    address: '789 Mall Drive, Shopping District',
    description: 'Convenient parking for shopping',
    totalSlots: 200,
    availableSlots: 120,
    pricePerHour: 4.00,
    features: ['Covered', 'Security', '24/7 Access'],
    coordinates: { lat: 40.7505, lng: -73.9934 },
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Airport Terminal Lot',
    address: '321 Airport Blvd, Terminal Area',
    description: 'Long-term airport parking',
    totalSlots: 300,
    availableSlots: 85,
    pricePerHour: 6.00,
    features: ['Shuttle Service', 'Security', 'Covered'],
    coordinates: { lat: 40.6413, lng: -73.7781 },
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'University Campus Parking',
    address: '555 College Ave, Campus District',
    description: 'Student and visitor parking',
    totalSlots: 180,
    availableSlots: 95,
    pricePerHour: 3.00,
    features: ['Student Discount', 'EV Charging', 'Bike Racks'],
    coordinates: { lat: 40.7282, lng: -73.9942 },
    createdAt: new Date().toISOString()
  }
];

let mockSlots = [
  {
    id: '1',
    placeId: '1',
    slotNumber: 'A-001',
    type: 'regular',
    isAvailable: true,
    pricePerHour: 5.00,
    features: ['Covered']
  },
  {
    id: '2',
    placeId: '1',
    slotNumber: 'A-002',
    type: 'premium',
    isAvailable: false,
    pricePerHour: 7.00,
    features: ['Covered', 'Near Exit']
  },
  {
    id: '3',
    placeId: '1',
    slotNumber: 'A-003',
    type: 'ev',
    isAvailable: true,
    pricePerHour: 8.00,
    features: ['EV Charging', 'Covered']
  },
  {
    id: '4',
    placeId: '1',
    slotNumber: 'A-004',
    type: 'regular',
    isAvailable: true,
    pricePerHour: 5.00,
    features: ['Covered']
  },
  {
    id: '5',
    placeId: '2',
    slotNumber: 'B-001',
    type: 'ev',
    isAvailable: true,
    pricePerHour: 10.00,
    features: ['EV Charging', 'Premium']
  },
  {
    id: '6',
    placeId: '2',
    slotNumber: 'B-002',
    type: 'premium',
    isAvailable: false,
    pricePerHour: 9.00,
    features: ['Valet', 'Premium']
  },
  {
    id: '7',
    placeId: '3',
    slotNumber: 'C-001',
    type: 'regular',
    isAvailable: true,
    pricePerHour: 4.00,
    features: ['Ground Floor']
  },
  {
    id: '8',
    placeId: '3',
    slotNumber: 'C-002',
    type: 'disabled',
    isAvailable: true,
    pricePerHour: 4.00,
    features: ['Disabled Access', 'Near Entrance']
  }
];

let mockBookings = [
  {
    id: '1',
    userId: '2',
    slotId: '2',
    placeId: '1',
    placeName: 'Downtown Mall Parking',
    slotNumber: 'A-002',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    totalAmount: 14.00,
    paymentStatus: 'paid',
    createdAt: new Date().toISOString()
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const parkingService = {
  // Places
  async getPlaces() {
    await delay(500);
    return { data: mockPlaces };
  },

  async createPlace(placeData) {
    await delay(500);
    const newPlace = {
      id: Date.now().toString(),
      ...placeData,
      totalSlots: 0,
      availableSlots: 0,
      createdAt: new Date().toISOString()
    };
    mockPlaces.push(newPlace);
    return { data: newPlace };
  },

  async updatePlace(id, placeData) {
    await delay(500);
    const index = mockPlaces.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Place not found');
    
    mockPlaces[index] = { ...mockPlaces[index], ...placeData };
    return { data: mockPlaces[index] };
  },

  async deletePlace(id) {
    await delay(500);
    mockPlaces = mockPlaces.filter(p => p.id !== id);
    mockSlots = mockSlots.filter(s => s.placeId !== id);
    return { message: 'Place deleted successfully' };
  },

  // Slots
  async getSlots(placeId) {
    await delay(500);
    const slots = mockSlots.filter(s => s.placeId === placeId);
    return { data: slots };
  },

  async createSlot(slotData) {
    await delay(500);
    const newSlot = {
      id: Date.now().toString(),
      ...slotData,
      isAvailable: true
    };
    mockSlots.push(newSlot);
    
    // Update place total slots
    const placeIndex = mockPlaces.findIndex(p => p.id === slotData.placeId);
    if (placeIndex !== -1) {
      mockPlaces[placeIndex].totalSlots += 1;
      mockPlaces[placeIndex].availableSlots += 1;
    }
    
    return { data: newSlot };
  },

  async updateSlot(id, slotData) {
    await delay(500);
    const index = mockSlots.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Slot not found');
    
    mockSlots[index] = { ...mockSlots[index], ...slotData };
    return { data: mockSlots[index] };
  },

  async deleteSlot(id) {
    await delay(500);
    const slot = mockSlots.find(s => s.id === id);
    if (!slot) throw new Error('Slot not found');
    
    mockSlots = mockSlots.filter(s => s.id !== id);
    
    // Update place total slots
    const placeIndex = mockPlaces.findIndex(p => p.id === slot.placeId);
    if (placeIndex !== -1) {
      mockPlaces[placeIndex].totalSlots -= 1;
      if (slot.isAvailable) {
        mockPlaces[placeIndex].availableSlots -= 1;
      }
    }
    
    return { message: 'Slot deleted successfully' };
  },

  // Bookings
  async getBookings() {
    await delay(500);
    const token = localStorage.getItem('token');
    const userId = token?.split('-').pop();
    const userBookings = mockBookings.filter(b => b.userId === userId);
    return { data: userBookings };
  },

  async createBooking(bookingData) {
    await delay(500);
    const slot = mockSlots.find(s => s.id === bookingData.slotId);
    const place = mockPlaces.find(p => p.id === bookingData.placeId);
    
    if (!slot || !slot.isAvailable) {
      throw new Error('Slot not available');
    }

    const token = localStorage.getItem('token');
    const userId = token?.split('-').pop();
    
    const newBooking = {
      id: Date.now().toString(),
      userId,
      ...bookingData,
      placeName: place.name,
      slotNumber: slot.slotNumber,
      status: 'active',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString()
    };
    
    mockBookings.push(newBooking);
    
    // Update slot availability
    const slotIndex = mockSlots.findIndex(s => s.id === bookingData.slotId);
    mockSlots[slotIndex].isAvailable = false;
    
    // Update place available slots
    const placeIndex = mockPlaces.findIndex(p => p.id === bookingData.placeId);
    if (placeIndex !== -1) {
      mockPlaces[placeIndex].availableSlots -= 1;
    }
    
    return { data: newBooking };
  },

  async cancelBooking(id) {
    await delay(500);
    const bookingIndex = mockBookings.findIndex(b => b.id === id);
    if (bookingIndex === -1) throw new Error('Booking not found');
    
    const booking = mockBookings[bookingIndex];
    mockBookings[bookingIndex] = { ...booking, status: 'cancelled' };
    
    // Update slot availability
    const slotIndex = mockSlots.findIndex(s => s.id === booking.slotId);
    if (slotIndex !== -1) {
      mockSlots[slotIndex].isAvailable = true;
    }
    
    // Update place available slots
    const placeIndex = mockPlaces.findIndex(p => p.id === booking.placeId);
    if (placeIndex !== -1) {
      mockPlaces[placeIndex].availableSlots += 1;
    }
    
    return { data: mockBookings[bookingIndex] };
  },

  // Admin endpoints
  async getAllBookings() {
    await delay(500);
    return { data: mockBookings };
  },

  async getStatistics() {
    await delay(500);
    const totalPlaces = mockPlaces.length;
    const totalSlots = mockSlots.length;
    const bookedSlots = mockSlots.filter(s => !s.isAvailable).length;
    const activeBookings = mockBookings.filter(b => b.status === 'active').length;
    const totalRevenue = mockBookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    
    return {
      data: {
        totalPlaces,
        totalSlots,
        bookedSlots,
        availableSlots: totalSlots - bookedSlots,
        activeBookings,
        totalRevenue
      }
    };
  }
};