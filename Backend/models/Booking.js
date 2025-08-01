const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingPlace',
    required: [true, 'Parking place ID is required']
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSlot',
    required: [true, 'Parking slot ID is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'expired'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'cash', 'mobile_payment'],
      default: 'credit_card'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: {
      type: String,
      trim: true
    },
    paidAt: {
      type: Date
    },
    refundedAt: {
      type: Date
    }
  },
  vehicle: {
    licensePlate: {
      type: String,
      trim: true,
      uppercase: true
    },
    make: {
      type: String,
      trim: true
    },
    model: {
      type: String,
      trim: true
    },
    color: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['car', 'truck', 'motorcycle', 'bus', 'rv', 'trailer', 'bicycle'],
      default: 'car'
    }
  },
  specialRequests: {
    type: String,
    trim: true,
    maxlength: [500, 'Special requests cannot be more than 500 characters']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  cancellation: {
    reason: {
      type: String,
      trim: true
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: {
      type: Date
    },
    refundAmount: {
      type: Number,
      min: [0, 'Refund amount cannot be negative']
    }
  },
  checkIn: {
    time: {
      type: Date
    },
    checkedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String,
      trim: true
    }
  },
  checkOut: {
    time: {
      type: Date
    },
    checkedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String,
      trim: true
    }
  },
  notifications: {
    reminderSent: {
      type: Boolean,
      default: false
    },
    reminderSentAt: {
      type: Date
    },
    checkInReminderSent: {
      type: Boolean,
      default: false
    },
    checkInReminderSentAt: {
      type: Date
    },
    checkOutReminderSent: {
      type: Boolean,
      default: false
    },
    checkOutReminderSentAt: {
      type: Date
    }
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

// Virtual for duration in hours
BookingSchema.virtual('durationHours').get(function() {
  if (!this.startTime || !this.endTime) return 0;
  return (this.endTime - this.startTime) / (1000 * 60 * 60);
});

// Virtual for is active
BookingSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'confirmed' && 
         this.startTime <= now && 
         this.endTime >= now;
});

// Virtual for is upcoming
BookingSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  return this.status === 'confirmed' && this.startTime > now;
});

// Virtual for is completed
BookingSchema.virtual('isCompleted').get(function() {
  const now = new Date();
  return this.status === 'confirmed' && this.endTime < now;
});

// Virtual for can be cancelled
BookingSchema.virtual('canBeCancelled').get(function() {
  const now = new Date();
  return ['pending', 'confirmed'].includes(this.status) && 
         this.startTime > now;
});

// Indexes for better query performance
BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ placeId: 1, startTime: 1 });
BookingSchema.index({ slotId: 1, status: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ 'payment.status': 1 });
BookingSchema.index({ startTime: 1, endTime: 1 });
BookingSchema.index({ createdAt: -1 });

// Pre-save middleware to validate time range
BookingSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    if (this.startTime >= this.endTime) {
      return next(new Error('Start time must be before end time'));
    }
  }
  next();
});

// Static method to find active bookings
BookingSchema.statics.findActive = function() {
  const now = new Date();
  return this.find({
    status: 'confirmed',
    startTime: { $lte: now },
    endTime: { $gte: now }
  });
};

// Static method to find upcoming bookings
BookingSchema.statics.findUpcoming = function() {
  const now = new Date();
  return this.find({
    status: 'confirmed',
    startTime: { $gt: now }
  });
};

// Static method to find bookings by user
BookingSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Static method to find bookings by place
BookingSchema.statics.findByPlace = function(placeId) {
  return this.find({ placeId }).sort({ startTime: -1 });
};

// Static method to find bookings by slot
BookingSchema.statics.findBySlot = function(slotId) {
  return this.find({ slotId }).sort({ startTime: -1 });
};

// Static method to find conflicting bookings
BookingSchema.statics.findConflicting = function(slotId, startTime, endTime, excludeId = null) {
  const filter = {
    slotId,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  };

  if (excludeId) {
    filter._id = { $ne: excludeId };
  }

  return this.find(filter);
};

// Instance method to calculate total amount
BookingSchema.methods.calculateTotal = function() {
  return this.amount;
};

// Instance method to check if booking can be modified
BookingSchema.methods.canBeModified = function() {
  const now = new Date();
  return ['pending', 'confirmed'].includes(this.status) && 
         this.startTime > now;
};

// Instance method to get booking status display
BookingSchema.methods.getStatusDisplay = function() {
  const statusMap = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    completed: 'Completed',
    expired: 'Expired'
  };
  return statusMap[this.status] || this.status;
};

module.exports = mongoose.model('Booking', BookingSchema);