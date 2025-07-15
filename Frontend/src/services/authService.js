import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

// Mock data for development
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@parking.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1234567890'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'user@parking.com',
    password: 'user123',
    role: 'user',
    phone: '+1234567891'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(email, password) {
    await delay(1000);
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: 'mock-jwt-token-' + user.id
    };
  },

  async register(userData) {
    await delay(1000);
    
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: 'user'
    };

    mockUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      user: userWithoutPassword,
      token: 'mock-jwt-token-' + newUser.id
    };
  },

  async updateProfile(userData) {
    await delay(500);
    
    const token = localStorage.getItem('token');
    const userId = token?.split('-').pop();
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
    
    return {
      user: userWithoutPassword
    };
  },

  async deleteAccount() {
    await delay(500);
    
    const token = localStorage.getItem('token');
    const userId = token?.split('-').pop();
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers.splice(userIndex, 1);
    return { message: 'Account deleted successfully' };
  }
};