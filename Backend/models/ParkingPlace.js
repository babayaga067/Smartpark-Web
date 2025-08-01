const mongoose = require('mongoose');

const ParkingPlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Parking place name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      trim: true
    },
    country: {
      type: String,
      default: 'USA',
      trim: true
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: [true, 'Coordinates are required'],
      validate: {
        validator: function(v) {
          return v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90;
        },
        message: 'Invalid coordinates'
      }
    }
  },
  contact: {
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL']
    }
  },
  pricing: {
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [0, 'Hourly rate cannot be negative']
    },
    dailyRate: {
      type: Number,
      min: [0, 'Daily rate cannot be negative']
    },
    monthlyRate: {
      type: Number,
      min: [0, 'Monthly rate cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    }
  },
  capacity: {
    totalSlots: {
      type: Number,
      required: [true, 'Total slots is required'],
      min: [1, 'Total slots must be at least 1']
    },
    availableSlots: {
      type: Number,
      default: 0,
      min: [0, 'Available slots cannot be negative']
    },
    reservedSlots: {
      type: Number,
      default: 0,
      min: [0, 'Reserved slots cannot be negative']
    }
  },
  amenities: [{
    type: String,
    enum: [
      'security_camera',
      'lighting',
      'covered_parking',
      'valet_service',
      'car_wash',
      'charging_station',
      'disabled_access',
      'bike_rack',
      'motorcycle_parking',
      'oversized_vehicle',
      'shuttle_service',
      'restroom',
      'vending_machine',
      'atm',
      'wifi',
      'shade',
      'security_guard',
      'gated_access',
      'key_card_access',
      'mobile_app_access'
    ]
  }],
  operatingHours: {
    monday: {
      open: { type: String, default: '00:00' },
      close: { type: String, default: '23:59' },
      closed: { type: Boolean, default: false }
    },
    tuesday: {
      open: { type: String, default: '00:00' },
      close: { type: String, default: '23:59' },
      closed: { type: Boolean, default: false }
    },
    wednesday: {
      open: { type: String, default: '00:00' },
      close: { type: String, default: '23:59' },
      closed: { type: Boolean, default: false }
    },
    thursday: {
      open: { type: String, default: '00:00' },
      close: { type: String, default: '23:59' },
      closed: { type: Boolean, default: false }
    },
    friday: {
      open: { type: String, default: '00:00' },
      close: { type: String, default: '23:59' },
      closed: { type: Boolean, default: false }
    },
    saturday: {
      open: { type: String, default: '00:00' },
      close: { type: String, default: '23:59' },
      closed: { type: Boolean, default: false }
    },
    sunday: {
      open: { type: String, default: '00:00' },
      close: { type: String, default: '23:59' },
      closed: { type: Boolean, default: false }
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      trim: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'closed'],
    default: 'active'
  },
  features: {
    is24Hours: {
      type: Boolean,
      default: false
    },
    isCovered: {
      type: Boolean,
      default: false
    },
    isGuarded: {
      type: Boolean,
      default: false
    },
    hasCharging: {
      type: Boolean,
      default: false
    },
    hasValet: {
      type: Boolean,
      default: false
    },
    isAccessible: {
      type: Boolean,
      default: false
    }
  },
  rules: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full address
ParkingPlaceSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

// Virtual for availability percentage
ParkingPlaceSchema.virtual('availabilityPercentage').get(function() {
  if (this.capacity.totalSlots === 0) return 0;
  return Math.round((this.capacity.availableSlots / this.capacity.totalSlots) * 100);
});

// Virtual for isOpen
ParkingPlaceSchema.virtual('isOpen').get(function() {
  const now = new Date();
  const dayOfWeek = now.toLocaleLowerCase().slice(0, 3);
  const currentTime = now.toTimeString().slice(0, 5);
  
  const todayHours = this.operatingHours[dayOfWeek];
  if (!todayHours || todayHours.closed) return false;
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
});

// Indexes for better query performance
ParkingPlaceSchema.index({ location: '2dsphere' });
ParkingPlaceSchema.index({ 'address.city': 1 });
ParkingPlaceSchema.index({ status: 1 });
ParkingPlaceSchema.index({ 'pricing.hourlyRate': 1 });
ParkingPlaceSchema.index({ createdBy: 1 });

// Pre-save middleware to update available slots
ParkingPlaceSchema.pre('save', function(next) {
  if (this.isModified('capacity.totalSlots') || this.isModified('capacity.reservedSlots')) {
    this.capacity.availableSlots = Math.max(0, this.capacity.totalSlots - this.capacity.reservedSlots);
  }
  next();
});

// Static method to find nearby places
ParkingPlaceSchema.statics.findNearby = function(coordinates, maxDistance = 10000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    },
    status: 'active'
  });
};

// Static method to find by city
ParkingPlaceSchema.statics.findByCity = function(city) {
  return this.find({
    'address.city': new RegExp(city, 'i'),
    status: 'active'
  });
};

// Static method to find available places
ParkingPlaceSchema.statics.findAvailable = function() {
  return this.find({
    'capacity.availableSlots': { $gt: 0 },
    status: 'active'
  });
};

module.exports = mongoose.model('ParkingPlace', ParkingPlaceSchema); 