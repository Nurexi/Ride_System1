const express = require('express');
const router = express.Router();

// Simple test route to check if admin routes are working
router.get('/test', (req, res) => {
    console.log('🧪 Admin test route called');
    res.json({
        success: true,
        message: 'Admin routes are working!',
        timestamp: new Date().toISOString()
    });
});

// Simple stats route without database calls
router.get('/stats', (req, res) => {
    console.log('📊 Admin stats route called');
    
    try {
        // Return simple stats without database calls first
        const statsData = {
            totalVehicles: 0,
            totalUsers: 0,
            totalBookings: 0,
            todayBookings: 0,
            activeDrivers: 0,
            availableVehicles: 0,
            weeklyBookings: 0
        };

        console.log('✅ Returning simple stats:', statsData);

        res.json({
            success: true,
            message: 'Dashboard statistics retrieved successfully',
            data: statsData
        });

    } catch (error) {
        console.error('❌ Error in stats route:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
});

// Simple vehicles route without database calls
router.get('/vehicles', (req, res) => {
    console.log('🚗 Admin vehicles route called');
    
    try {
        res.json({
            success: true,
            message: 'Retrieved 0 vehicles successfully',
            data: []
        });

    } catch (error) {
        console.error('❌ Error in vehicles route:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vehicles from database',
            error: error.message
        });
    }
});

// Simple users route without database calls
router.get('/users', (req, res) => {
    console.log('👥 Admin users route called');
    
    try {
        res.json({
            success: true,
            message: 'Retrieved 0 users successfully',
            data: []
        });

    } catch (error) {
        console.error('❌ Error in users route:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

// Simple bookings route without database calls
router.get('/bookings', (req, res) => {
    console.log('📅 Admin bookings route called');
    
    try {
        res.json({
            success: true,
            message: 'Retrieved 0 bookings successfully',
            data: []
        });

    } catch (error) {
        console.error('❌ Error in bookings route:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: error.message
        });
    }
});

module.exports = router;