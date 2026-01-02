const express = require('express');
const router = express.Router();

// Import models with error handling
let Vehicle, User, Booking;

try {
    Vehicle = require('../models/Vehicle');
    console.log('✅ Vehicle model imported successfully');
} catch (error) {
    console.error('❌ Error importing Vehicle model:', error.message);
}

try {
    User = require('../models/User');
    console.log('✅ User model imported successfully');
} catch (error) {
    console.error('❌ Error importing User model:', error.message);
}

try {
    Booking = require('../models/Booking');
    console.log('✅ Booking model imported successfully');
} catch (error) {
    console.error('❌ Error importing Booking model:', error.message);
}

// ============================================
// ADMIN DASHBOARD ROUTES - FIXED VERSION
// ============================================

// GET /api/admin/stats - Dashboard Statistics
router.get('/stats', async (req, res) => {
    console.log('📊 Admin stats route called');
    
    try {
        // Check if models are available
        if (!Vehicle || !User || !Booking) {
            throw new Error('Models not properly imported');
        }

        console.log('🔍 Fetching counts from database...');

        // Get total counts from database with error handling
        const totalVehicles = await Vehicle.countDocuments().catch(err => {
            console.error('Error counting vehicles:', err);
            return 0;
        });

        const totalUsers = await User.countDocuments().catch(err => {
            console.error('Error counting users:', err);
            return 0;
        });

        const totalBookings = await Booking.countDocuments().catch(err => {
            console.error('Error counting bookings:', err);
            return 0;
        });

        // Get today's bookings (from start of today)
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        
        const todayBookings = await Booking.countDocuments({
            createdAt: { $gte: startOfToday }
        }).catch(err => {
            console.error('Error counting today bookings:', err);
            return 0;
        });

        // Get active drivers (users who are not admin)
        const activeDrivers = await User.countDocuments({
            role: { $ne: 'admin' }
        }).catch(err => {
            console.error('Error counting active drivers:', err);
            return 0;
        });

        // Get available vehicles
        const availableVehicles = await Vehicle.countDocuments({
            isAvailable: true
        }).catch(err => {
            console.error('Error counting available vehicles:', err);
            return 0;
        });

        // Get this week's bookings
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        const weeklyBookings = await Booking.countDocuments({
            createdAt: { $gte: startOfWeek }
        }).catch(err => {
            console.error('Error counting weekly bookings:', err);
            return 0;
        });

        const statsData = {
            totalVehicles,
            totalUsers,
            totalBookings,
            todayBookings,
            activeDrivers,
            availableVehicles,
            weeklyBookings
        };

        console.log('✅ Admin stats retrieved successfully:', statsData);

        res.json({
            success: true,
            message: 'Dashboard statistics retrieved successfully',
            data: statsData
        });

    } catch (error) {
        console.error('❌ Error in admin stats route:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
});

// GET /api/admin/vehicles - All Vehicles for Admin Management
router.get('/vehicles', async (req, res) => {
    console.log('🚗 Admin vehicles route called');
    
    try {
        if (!Vehicle) {
            throw new Error('Vehicle model not available');
        }

        console.log('🔍 Fetching vehicles from database...');

        // Fetch all vehicles from database
        const vehicles = await Vehicle.find().sort({ createdAt: -1 }).catch(err => {
            console.error('Error fetching vehicles:', err);
            return [];
        });

        console.log(`✅ Retrieved ${vehicles.length} vehicles from MongoDB`);

        res.json({
            success: true,
            message: `Retrieved ${vehicles.length} vehicles successfully`,
            data: vehicles
        });

    } catch (error) {
        console.error('❌ Error in admin vehicles route:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vehicles from database',
            error: error.message
        });
    }
});

// POST /api/admin/vehicles - Add New Vehicle
router.post('/vehicles', async (req, res) => {
    console.log('➕ Admin add vehicle route called');
    
    try {
        if (!Vehicle) {
            throw new Error('Vehicle model not available');
        }

        console.log('🔍 Adding new vehicle:', req.body);

        const vehicleData = {
            brand: req.body.brand,
            model: req.body.model,
            year: parseInt(req.body.year),
            type: req.body.type,
            color: req.body.color,
            seats: parseInt(req.body.seats),
            fuelType: req.body.fuelType || 'gasoline',
            transmission: req.body.transmission || 'manual',
            dailyRate: parseInt(req.body.dailyRate),
            hourlyRate: Math.round(parseInt(req.body.dailyRate) / 8),
            plateNumber: req.body.plateNumber,
            licensePlate: req.body.plateNumber, // For backward compatibility
            isAvailable: true,
            features: req.body.features ? req.body.features.split(',').map(f => f.trim()) : ['Air Conditioning', 'GPS Navigation'],
            location: req.body.location || 'Dessie, Ethiopia',
            description: `${req.body.year} ${req.body.brand} ${req.body.model} - Perfect for city rides and long trips.`
        };

        const newVehicle = new Vehicle(vehicleData);
        const savedVehicle = await newVehicle.save();

        console.log('✅ Vehicle added successfully:', savedVehicle._id);

        res.json({
            success: true,
            message: 'Vehicle added successfully',
            data: savedVehicle
        });

    } catch (error) {
        console.error('❌ Error in admin add vehicle route:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add vehicle',
            error: error.message
        });
    }
});

// GET /api/admin/users - All Users for Admin Management
router.get('/users', async (req, res) => {
    console.log('👥 Admin users route called');
    
    try {
        if (!User || !Booking) {
            throw new Error('User or Booking model not available');
        }

        console.log('🔍 Fetching users from database...');

        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .catch(err => {
                console.error('Error fetching users:', err);
                return [];
            });

        // Add computed fields with error handling
        const enhancedUsers = await Promise.all(users.map(async (user) => {
            try {
                const userBookings = await Booking.countDocuments({ user: user._id });
                return {
                    ...user.toObject(),
                    totalBookings: userBookings,
                    status: userBookings > 0 ? 'active' : 'inactive'
                };
            } catch (err) {
                console.error('Error processing user:', user._id, err);
                return {
                    ...user.toObject(),
                    totalBookings: 0,
                    status: 'inactive'
                };
            }
        }));

        console.log(`✅ Retrieved ${enhancedUsers.length} users for admin`);

        res.json({
            success: true,
            message: `Retrieved ${enhancedUsers.length} users successfully`,
            data: enhancedUsers
        });

    } catch (error) {
        console.error('❌ Error in admin users route:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

// GET /api/admin/bookings - All Bookings for Admin Management
router.get('/bookings', async (req, res) => {
    console.log('📅 Admin bookings route called');
    
    try {
        if (!Booking) {
            throw new Error('Booking model not available');
        }

        console.log('🔍 Fetching bookings from database...');

        const bookings = await Booking.find()
            .populate('user', 'firstName lastName email phone')
            .populate('vehicle', 'brand model year plateNumber licensePlate')
            .sort({ createdAt: -1 })
            .limit(50)
            .catch(err => {
                console.error('Error fetching bookings:', err);
                return [];
            });

        console.log(`✅ Retrieved ${bookings.length} bookings for admin`);

        res.json({
            success: true,
            message: `Retrieved ${bookings.length} bookings successfully`,
            data: bookings
        });

    } catch (error) {
        console.error('❌ Error in admin bookings route:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: error.message
        });
    }
});

// GET /api/admin/activity - Recent Platform Activity
router.get('/activity', async (req, res) => {
    console.log('📋 Admin activity route called');
    
    try {
        if (!Booking || !User || !Vehicle) {
            throw new Error('Models not available');
        }

        console.log('🔍 Fetching recent activity...');

        // Get recent data with error handling
        const recentBookings = await Booking.find()
            .populate('user', 'firstName lastName')
            .populate('vehicle', 'brand model')
            .sort({ createdAt: -1 })
            .limit(5)
            .catch(err => {
                console.error('Error fetching recent bookings:', err);
                return [];
            });

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .catch(err => {
                console.error('Error fetching recent users:', err);
                return [];
            });

        const recentVehicles = await Vehicle.find()
            .sort({ createdAt: -1 })
            .limit(2)
            .catch(err => {
                console.error('Error fetching recent vehicles:', err);
                return [];
            });

        // Format activity data
        const activityData = [];

        // Add booking activities
        recentBookings.forEach(booking => {
            const userName = booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'Unknown User';
            activityData.push({
                type: 'booking',
                icon: 'fas fa-calendar-check',
                text: `New booking from ${userName}`,
                time: getTimeAgo(booking.createdAt),
                iconClass: 'booking'
            });
        });

        // Add user registration activities
        recentUsers.forEach(user => {
            activityData.push({
                type: 'user',
                icon: 'fas fa-user-plus',
                text: `New user registered: ${user.firstName} ${user.lastName}`,
                time: getTimeAgo(user.createdAt),
                iconClass: 'driver'
            });
        });

        // Add vehicle activities
        recentVehicles.forEach(vehicle => {
            activityData.push({
                type: 'vehicle',
                icon: 'fas fa-car',
                text: `New vehicle added: ${vehicle.brand} ${vehicle.model}`,
                time: getTimeAgo(vehicle.createdAt),
                iconClass: 'vehicle'
            });
        });

        // Sort by most recent
        activityData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        console.log(`✅ Retrieved ${activityData.length} activity items`);

        res.json({
            success: true,
            message: 'Recent activity retrieved successfully',
            data: activityData.slice(0, 10)
        });

    } catch (error) {
        console.error('❌ Error in admin activity route:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent activity',
            error: error.message
        });
    }
});

// Helper function to calculate time ago
function getTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
        return 'Just now';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
}

module.exports = router;