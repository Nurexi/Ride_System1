// Import required packages
const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables FIRST - use absolute path
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Validate critical environment variables
if (!process.env.MONGODB_URI) {
    console.error('❌ CRITICAL ERROR: MONGODB_URI not found in environment variables');
    console.error('💡 Please ensure your .env file exists and contains MONGODB_URI');
    process.exit(1);
}

// Import database connection
const connectDB = require('../config/database');

// Import routes
const vehicleRoutes = require('../routes/vehicleRoutes');
const authRoutes = require('../routes/authRoutes');
const bookingRoutes = require('../routes/bookingRoutes');
const adminRoutes = require('../routes/adminRoutes'); // Updated to use new admin routes
const adminAuthRoutes = require('../routes/adminAuthRoutes');

// Create Express application
const app = express();

// Set port (use environment variable or default to 3000)
const PORT = process.env.PORT || 3000;

// Connect to MongoDB BEFORE starting server
const startServer = async () => {
    try {
        // Connect to database first
        await connectDB();
        
        // ============================================
        // MIDDLEWARE CONFIGURATION (PROPER ORDER)
        // ============================================
        
        // 1. CORS - Allow frontend to communicate with backend
        app.use(cors());
        
        // 2. JSON Parser - Parse JSON data from requests
        app.use(express.json());
        
        // 3. Static Files - Serve frontend files from /public
        app.use(express.static(path.join(__dirname, '../public')));
        
        // ============================================
        // API ROUTES (MUST COME BEFORE FRONTEND ROUTES)
        // ============================================
        
        app.use('/api/vehicles', vehicleRoutes);
        app.use('/api/auth', authRoutes);
        app.use('/api/bookings', bookingRoutes);
        app.use('/api/admin/auth', adminAuthRoutes);
        app.use('/api/admin', adminRoutes);

        // ============================================
        // FRONTEND ROUTES (AFTER API ROUTES)
        // ============================================
        
        // Serve index.html for root route
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });
        
        // Serve specific HTML pages
        app.get('/auth', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/auth.html'));
        });
        
        app.get('/book', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/book.html'));
        });
        
        app.get('/admin', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/admin.html'));
        });
        
        app.get('/about', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/about.html'));
        });
        
        app.get('/contact', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/contact.html'));
        });
        
        app.get('/safety', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/safety.html'));
        });
        
        app.get('/my-rides', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/my-rides.html'));
        });

        // Start server only after successful database connection
        app.listen(PORT, () => {
            console.log(`🚗 RideFair Server is running on port ${PORT}`);
            console.log(`🌐 Frontend Website: http://localhost:${PORT}`);
            console.log(`📱 Pages Available:`);
            console.log(`   • Homepage: http://localhost:${PORT}/`);
            console.log(`   • Authentication: http://localhost:${PORT}/auth`);
            console.log(`   • Booking: http://localhost:${PORT}/book`);
            console.log(`   • Admin Dashboard: http://localhost:${PORT}/admin`);
            console.log(`🚀 API Endpoints:`);
            console.log(`   • Vehicle API: http://localhost:${PORT}/api/vehicles/available`);
            console.log(`   • Auth API: http://localhost:${PORT}/api/auth/login`);
            console.log(`   • Admin API: http://localhost:${PORT}/api/admin/stats`);
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// Start the server
startServer();