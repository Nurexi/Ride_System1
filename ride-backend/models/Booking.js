// Booking Model - Blueprint for booking documents in MongoDB
const mongoose = require('mongoose');

// Define the Booking Schema
const bookingSchema = new mongoose.Schema({
    // References to other collections (relationships)
    user: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to User document
        ref: 'User',                          // Which model to reference
        required: true
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to Vehicle document
        ref: 'Vehicle',
        required: true
    },
    
    // Booking Dates and Times
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > this.startDate;    // End date must be after start date
            },
            message: 'End date must be after start date'
        }
    },
    startTime: {
        type: String,           // Format: "14:30" (24-hour format)
        required: false
    },
    endTime: {
        type: String,
        required: false
    },
    
    // Pricing
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    
    // Booking Status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },
    
    // Location Details
    pickupLocation: {
        type: String,
        required: true,
        trim: true
    },
    dropoffLocation: {
        type: String,
        required: true,
        trim: true
    },
    
    // Additional Information
    specialRequests: {
        type: String,
        required: false,
        trim: true
    },
    
    // Payment Information (for future use)
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'cash'],
        required: false
    },
    
    // Booking Notes (internal use)
    notes: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ vehicle: 1, startDate: 1 });
bookingSchema.index({ status: 1 });

// Create and export the Booking model
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;