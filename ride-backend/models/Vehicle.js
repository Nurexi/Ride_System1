// Vehicle Model - Blueprint for vehicle documents in MongoDB
const mongoose = require('mongoose');

// Define the Vehicle Schema
const vehicleSchema = new mongoose.Schema({
    // Basic Vehicle Information
    type: {
        type: String,
        required: true,
        enum: ['car', 'bike'],    // Only 'car' or 'bike' allowed
        lowercase: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        min: 2000,               // Minimum year 2000
        max: new Date().getFullYear() + 1  // Maximum next year
    },
    
    // Vehicle Details
    color: {
        type: String,
        required: false,
        trim: true
    },
    plateNumber: {
        type: String,
        required: true,
        unique: true,            // Each plate number is unique
        uppercase: true          // Convert to uppercase
    },
    licensePlate: {
        type: String,
        required: false,         // Keep for backward compatibility
        unique: true,            // Each license plate is unique
        uppercase: true          // Convert to uppercase
    },
    
    // Pricing
    dailyRate: {
        type: Number,
        required: true,
        min: 0                   // Price cannot be negative
    },
    hourlyRate: {
        type: Number,
        required: false,
        min: 0
    },
    
    // Technical Specifications
    fuelType: {
        type: String,
        enum: ['gasoline', 'electric', 'hybrid', 'diesel'],
        required: false
    },
    transmission: {
        type: String,
        enum: ['automatic', 'manual'],
        required: false
    },
    seats: {
        type: Number,
        required: function() {
            return this.type === 'car';  // Required only for cars
        },
        min: 1,
        max: 8
    },
    
    // Availability and Location
    isAvailable: {
        type: Boolean,
        default: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    
    // Media
    imageUrl: {
        type: String,
        required: false
    },
    
    // Additional Features (array of strings)
    features: [{
        type: String,
        trim: true
    }],
    
    // Maintenance
    lastServiceDate: {
        type: Date,
        required: false
    },
    mileage: {
        type: Number,
        required: false,
        min: 0
    }
}, {
    timestamps: true
});

// Create indexes for better search performance
vehicleSchema.index({ type: 1, isAvailable: 1 });
vehicleSchema.index({ location: 1 });

// Create and export the Vehicle model
const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;