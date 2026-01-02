// Seed Data Script - Adds sample vehicles to the database
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Vehicle = require('../models/Vehicle');

// Sample vehicle data with new brands (limited to 4 vehicles)
const sampleVehicles = [
    {
        type: 'car',
        brand: 'Hyundai',
        model: 'Elantra',
        year: 2023,
        color: 'White',
        plateNumber: 'HYU001',
        licensePlate: 'HYU001', // Keep for backward compatibility
        dailyRate: 180.00,
        hourlyRate: 25.00,
        fuelType: 'gasoline',
        transmission: 'automatic',
        seats: 5,
        isAvailable: true,
        location: 'Dessie Central Station',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: ['GPS Navigation', 'Bluetooth', 'Air Conditioning', 'Backup Camera', 'USB Charging'],
        mileage: 15000,
        description: 'Modern and fuel-efficient sedan perfect for city rides'
    },
    {
        type: 'car',
        brand: 'Nissan',
        model: 'Sentra',
        year: 2022,
        color: 'Silver',
        plateNumber: 'NIS002',
        licensePlate: 'NIS002', // Keep for backward compatibility
        dailyRate: 165.00,
        hourlyRate: 22.00,
        fuelType: 'gasoline',
        transmission: 'automatic',
        seats: 5,
        isAvailable: true,
        location: 'Kombolcha Hub',
        imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: ['GPS Navigation', 'Bluetooth', 'Air Conditioning', 'Power Windows'],
        mileage: 22000,
        description: 'Reliable and comfortable for long distance travel'
    },
    {
        type: 'car',
        brand: 'Kia',
        model: 'Forte',
        year: 2023,
        color: 'Red',
        plateNumber: 'KIA003',
        licensePlate: 'KIA003', // Keep for backward compatibility
        dailyRate: 175.00,
        hourlyRate: 24.00,
        fuelType: 'gasoline',
        transmission: 'automatic',
        seats: 5,
        isAvailable: true,
        location: 'Dessie Airport',
        imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: ['GPS Navigation', 'Bluetooth', 'Air Conditioning', 'Heated Seats', 'Sunroof'],
        mileage: 8000,
        description: 'Stylish and feature-rich vehicle for premium experience'
    },
    {
        type: 'car',
        brand: 'Mazda',
        model: 'Mazda3',
        year: 2022,
        color: 'Blue',
        plateNumber: 'MAZ004',
        licensePlate: 'MAZ004', // Keep for backward compatibility
        dailyRate: 190.00,
        hourlyRate: 26.00,
        fuelType: 'gasoline',
        transmission: 'automatic',
        seats: 5,
        isAvailable: true,
        location: 'City Center Parking',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: ['GPS Navigation', 'Bluetooth', 'Premium Sound', 'Leather Interior', 'Sport Mode'],
        mileage: 18000,
        description: 'Premium driving experience with sport performance'
    }
];

// Function to seed the database
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🍃 Connected to MongoDB');

        // Clear existing vehicles
        await Vehicle.deleteMany({});
        console.log('🗑️  Cleared existing vehicles');

        // Insert sample vehicles
        const vehicles = await Vehicle.insertMany(sampleVehicles);
        console.log(`✅ Added ${vehicles.length} sample vehicles`);

        // Close connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();