const mongoose = require('mongoose');

const ParkingSlotSchema = new mongoose.Schema({
  slotNumber: {
    type: String,
    required: [true, 'Slot number is required'],
    trim: true
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingPlace',
    required: [true, 'Parking place is required']
  },
  type: {
    type: String,
    enum: ['standard', 'compact', 'oversized', 'handicap', 'motorcycle', 'electric', 'reserved'],
    default: 'standard'
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance', 'out_of_service'],
    default: 'available'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  dimensions: {
    length: {
      type: Number,
      min: [0, 'Length cannot be negative']
    },
    width: {
      type: Number,
      min: [0, 'Width cannot be negative']
    },
    height: {
      type: Number,
      min: [0, 'Height cannot be negative']
    }
  },
  features: {
    isCovered: {
      type: Boolean,
      default: false
    },
    isCharging: {
      type: Boolean,
      default: false
    },
    isHandicap: {
      type: Boolean,
      default: false
    },
    isOversized: {
      type: Boolean,
      default: false
    },
    isReserved: {
      type: Boolean,
      default: false
    },
    hasSecurity: {
      type: Boolean,
      default: false
    },
    hasLighting: {
      type: Boolean,
      default: false
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
  location: {
    floor: {
      type: String,
      default: 'Ground'
    },
    section: {
      type: String,
      trim: true
    },
    row: {
      type: String,
      trim: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: function(v) {
            return v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90;
          },
          message: 'Invalid coordinates'
        }
      }
    }
  },
  restrictions: {
    maxVehicleLength: {
      type: Number,
      min: [0, 'Max vehicle length cannot be negative']
    },
    maxVehicleWidth: {
      type: Number,
      min: [0, 'Max vehicle width cannot be negative']
    },
    maxVehicleHeight: {
      type: Number,
      min: [0, 'Max vehicle height cannot be negative']
    },
    maxVehicleWeight: {
      type: Number,
      min: [0, 'Max vehicle weight cannot be negative']
    },
    allowedVehicleTypes: [{
      type: String,
      enum: ['car', 'truck', 'motorcycle', 'bus', 'rv', 'trailer', 'bicycle']
    }],
    prohibitedVehicleTypes: [{
      type: String,
      enum: ['car', 'truck', 'motorcycle', 'bus', 'rv', 'trailer', 'bicycle']
    }]
  },
  maintenance: {
    lastInspection: {
      type: Date
    },
    nextInspection: {
      type: Date
    },
    issues: [{
      description: {
        type: String,
        trim: true
      },
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'low'
      },
      reportedAt: {
        type: Date,
        default: Date.now
      },
      resolvedAt: {
        type: Date
      },
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  },
  sensors: {
    isOccupied: {
      type: Boolean,
      default: false
    },
    lastDetection: {
      type: Date
    },
    sensorId: {
      type: String,
      trim: true
    },
    sensorType: {
      type: String,
      enum: ['magnetic', 'optical', 'ultrasonic', 'weight', 'camera'],
      default: 'magnetic'
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
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

// Virtual for full location
ParkingSlotSchema.virtual('fullLocation').get(function() {
  const parts = [];
  if (this.location.floor) parts.push(`Floor: ${this.location.floor}`);
  if (this.location.section) parts.push(`Section: ${this.location.section}`);
  if (this.location.row) parts.push(`Row: ${this.location.row}`);
  return parts.join(', ') || 'Location not specified';
});

// Virtual for current booking
ParkingSlotSchema.virtual('currentBooking', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'slotId',
  justOne: true,
  match: { status: { $in: ['confirmed', 'pending'] } }
});

// Virtual for slot status display
ParkingSlotSchema.virtual('statusDisplay').get(function() {
  if (this.status === 'maintenance') return 'Under Maintenance';
  if (this.status === 'out_of_service') return 'Out of Service';
  if (this.status === 'reserved') return 'Reserved';
  if (this.status === 'occupied') return 'Occupied';
  return 'Available';
});

// Indexes for better query performance
ParkingSlotSchema.index({ placeId: 1, slotNumber: 1 }, { unique: true });
ParkingSlotSchema.index({ placeId: 1, status: 1 });
ParkingSlotSchema.index({ placeId: 1, isAvailable: 1 });
ParkingSlotSchema.index({ 'location.coordinates': '2dsphere' });
ParkingSlotSchema.index({ type: 1 });
ParkingSlotSchema.index({ createdBy: 1 });

// Pre-save middleware to update isAvailable based on status
ParkingSlotSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.isAvailable = ['available'].includes(this.status);
  }
  next();
});

// Static method to find available slots
ParkingSlotSchema.statics.findAvailable = function(placeId) {
  return this.find({
    placeId,
    isAvailable: true,
    status: 'available'
  });
};

// Static method to find by type
ParkingSlotSchema.statics.findByType = function(placeId, type) {
  return this.find({
    placeId,
    type,
    isAvailable: true
  });
};

// Static method to find nearby slots
ParkingSlotSchema.statics.findNearby = function(coordinates, maxDistance = 100) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    },
    isAvailable: true
  });
};

// Instance method to check if slot can accommodate vehicle
ParkingSlotSchema.methods.canAccommodateVehicle = function(vehicleDimensions) {
  if (!this.dimensions || !vehicleDimensions) return true;
  
  const { length, width, height } = vehicleDimensions;
  const slotDimensions = this.dimensions;
  
  return (
    (!length || !slotDimensions.length || length <= slotDimensions.length) &&
    (!width || !slotDimensions.width || width <= slotDimensions.width) &&
    (!height || !slotDimensions.height || height <= slotDimensions.height)
  );
};

// Instance method to calculate price for duration
ParkingSlotSchema.methods.calculatePrice = function(hours) {
  if (hours <= 0) return 0;
  
  if (hours >= 24 && this.pricing.dailyRate) {
    const days = Math.ceil(hours / 24);
    return days * this.pricing.dailyRate;
  }
  
  return hours * this.pricing.hourlyRate;
};

module.exports = mongoose.model('ParkingSlot', ParkingSlotSchema); 