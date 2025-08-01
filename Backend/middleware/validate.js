const { validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

// Custom validation helpers
const validateObjectId = (value) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId.isValid(value);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validateDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

const validateTime = (time) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

const validateCoordinates = (coordinates) => {
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    return false;
  }
  
  const [lng, lat] = coordinates;
  return typeof lng === 'number' && typeof lat === 'number' &&
         lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
};

const validateFileType = (file, allowedTypes) => {
  if (!file) return false;
  
  const fileExtension = file.originalname.split('.').pop().toLowerCase();
  return allowedTypes.includes(fileExtension);
};

const validateFileSize = (file, maxSizeInMB) => {
  if (!file) return false;
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// Sanitization helpers
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return email;
  return email.toLowerCase().trim();
};

const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') return phone;
  return phone.replace(/\s/g, '').replace(/[^\d+]/g, '');
};

const sanitizeObjectId = (id) => {
  if (typeof id !== 'string') return id;
  return id.trim();
};

module.exports = {
  validate,
  validateObjectId,
  validateEmail,
  validatePhone,
  validatePassword,
  validateDate,
  validateTime,
  validateCoordinates,
  validateFileType,
  validateFileSize,
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  sanitizeObjectId
}; 