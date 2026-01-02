// Seed Users Script - Adds sample users to the database
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');

// Sample user data (passwords will be hashed automatically)
const sampleUsers = [
    {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        password: 'password123', // Will be hashed by the pre-save middleware
        phone: '+1234567890',
        dateOfBirth: new Date('1990-05-15'),
        licenseNumber: 'DL123456789',
        isActive: true,
        role: 'user'
    },
    {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        password: 'password123',
        phone: '+1987654321',
        dateOfBirth: new Date('1985-08-22'),
        licenseNumber: 'DL987654321',
        isActive: true,
        role: 'user'
    },
    {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@email.com',
        password: 'password123',
        phone: '+1122334455',
        dateOfBirth: new Date('1992-12-03'),
        licenseNumber: 'DL112233445',
        isActive: true,
        role: 'user'
    },
    {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@ridefair.com',
        password: 'admin123',
        phone: '+1555000000',
        dateOfBirth: new Date('1980-01-01'),
        licenseNumber: 'DL000000000',
        isActive: true,
        role: 'admin'
    }
];

// Function to seed users
const seedUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🍃 Connected to MongoDB');

        // Clear existing users
        await User.deleteMany({});
        console.log('🗑️  Cleared existing users');

        // Insert sample users one by one to trigger pre-save middleware
        const users = [];
        for (const userData of sampleUsers) {
            const user = new User(userData);
            await user.save();
            users.push(user);
        }
        console.log(`✅ Added ${users.length} sample users`);

        // Display user info
        users.forEach(user => {
            console.log(`👤 ${user.firstName} ${user.lastName} (${user.email}) - ID: ${user._id}`);
        });

        // Close connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        process.exit(1);
    }
};

// Run the seed function
seedUsers();