// Complete Admin Routes with Authentication
const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Apply admin authentication to all routes
router.use(adminAuth);

// ============================================
// PART 2: ADMIN STATISTICS API
// ============================================

// GET /api/admin/stats - Dashboard Statistics
router.get('/stats', async (req, res) => {
    try {
        console.log('📊 Admin fetching dashboard statistics...');

        // Get all counts in parallel for better performance
        const [
            totalUsers,
            totalDrivers,
            totalVehicles,
            totalRides,
            completedRides,
            activeRides
        ] = await Promise.all([
            User.countDocuments({ role: { $ne: 'admin' } }),
            User.countDocuments({ role: 'driver' }),
            Vehicle.countDocuments(),
            Booking.countDocuments(),
            Booking.countDocuments({ status: 'completed' }),
            Booking.countDocuments({ status: { $in: ['confirmed', 'active'] } })
        ]);

        // Calculate total revenue from completed rides
        const revenueResult = await Booking.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Get today's statistics
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        
        const todayRides = await Booking.countDocuments({
            createdAt: { $gte: startOfToday }
        });

        const statsData = {
            totalUsers,
            totalDrivers,
            totalVehicles,
            totalRides,
            completedRides,
            activeRides,
            totalRevenue,
            todayRides,
            availableVehicles: await Vehicle.countDocuments({ isAvailable: true })
        };

        console.log('✅ Admin stats retrieved:', statsData);

        res.json({
            success: true,
            data: statsData
        });

    } catch (error) {
        console.error('❌ Error fetching admin stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics'
        });
    }
});

// ============================================
// PART 3: ADMIN DATA APIs
// ============================================

// 1️⃣ GET /api/admin/vehicles - All Vehicles with Availability
router.get('/vehicles', async (req, res) => {
    try {
        console.log('🚗 Admin fetching all vehicles...');

        const vehicles = await Vehicle.find()
            .sort({ createdAt: -1 })
            .lean();

        // Add additional computed fields
        const enhancedVehicles = vehicles.map(vehicle => ({
            ...vehicle,
            status: vehicle.isAvailable ? 'available' : 'unavailable',
            totalBookings: 0, // Will be populated if needed
            lastUsed: null // Will be populated if needed
        }));

        console.log(`✅ Retrieved ${enhancedVehicles.length} vehicles for admin`);

        res.json({
            success: true,
            data: enhancedVehicles
        });

    } catch (error) {
        console.error('❌ Error fetching vehicles for admin:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vehicles'
        });
    }
});

// 2️⃣ GET /api/admin/users - All Users (exclude password)
router.get('/users', async (req, res) => {
    try {
        console.log('👥 Admin fetching all users...');

        const users = await User.find({ role: { $ne: 'admin' } })
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();

        // Add computed fields
        const enhancedUsers = await Promise.all(users.map(async (user) => {
            const userBookings = await Booking.countDocuments({ user: user._id });
            const lastBooking = await Booking.findOne({ user: user._id })
                .sort({ createdAt: -1 })
                .select('createdAt');

            return {
                ...user,
                totalBookings: userBookings,
                lastBooking: lastBooking?.createdAt || null,
                status: userBookings > 0 ? 'active' : 'inactive'
            };
        }));

        console.log(`✅ Retrieved ${enhancedUsers.length} users for admin`);

        res.json({
            success: true,
            data: enhancedUsers
        });

    } catch (error) {
        console.error('❌ Error fetching users for admin:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
});

// 3️⃣ GET /api/admin/rides - All Rides with Passenger + Driver Info
router.get('/rides', async (req, res) => {
    try {
        console.log('🚖 Admin fetching all rides...');

        const rides = await Booking.find()
            .populate('user', 'firstName lastName email phone')
            .populate('vehicle', 'brand model year plateNumber licensePlate')
            .sort({ createdAt: -1 })
            .limit(100) // Limit to recent 100 rides for performance
            .lean();

        // Format rides data
        const formattedRides = rides.map(ride => ({
            _id: ride._id,
            rideId: ride._id.toString().substring(0, 8),
            passenger: ride.user ? {
                name: `${ride.user.firstName} ${ride.user.lastName}`,
                email: ride.user.email,
                phone: ride.user.phone
            } : null,
            driver: null, // Will be populated when driver system is implemented
            vehicle: ride.vehicle ? {
                name: `${ride.vehicle.brand} ${ride.vehicle.model}`,
                year: ride.vehicle.year,
                plateNumber: ride.vehicle.plateNumber || ride.vehicle.licensePlate
            } : null,
            pickup: ride.pickupLocation,
            dropoff: ride.dropoffLocation,
            amount: ride.totalAmount,
            status: ride.status,
            paymentStatus: ride.paymentStatus,
            createdAt: ride.createdAt,
            startDate: ride.startDate,
            endDate: ride.endDate
        }));

        console.log(`✅ Retrieved ${formattedRides.length} rides for admin`);

        res.json({
            success: true,
            data: formattedRides
        });

    } catch (error) {
        console.error('❌ Error fetching rides for admin:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch rides'
        });
    }
});

// 4️⃣ GET /api/admin/activity - Last 10 System Activities
router.get('/activity', async (req, res) => {
    try {
        console.log('📋 Admin fetching recent activity...');

        // Get recent activities from different sources
        const [recentBookings, recentUsers, recentVehicles] = await Promise.all([
            Booking.find()
                .populate('user', 'firstName lastName')
                .populate('vehicle', 'brand model')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
            User.find({ role: { $ne: 'admin' } })
                .sort({ createdAt: -1 })
                .limit(3)
                .lean(),
            Vehicle.find()
                .sort({ createdAt: -1 })
                .limit(2)
                .lean()
        ]);

        // Format activity data
        const activities = [];

        // Add booking activities
        recentBookings.forEach(booking => {
            const userName = booking.user ? 
                `${booking.user.firstName} ${booking.user.lastName}` : 
                'Unknown User';
            const vehicleName = booking.vehicle ? 
                `${booking.vehicle.brand} ${booking.vehicle.model}` : 
                'Unknown Vehicle';

            activities.push({
                id: booking._id,
                type: 'booking',
                icon: 'fas fa-calendar-check',
                title: 'New Ride Booking',
                description: `${userName} booked ${vehicleName}`,
                time: getTimeAgo(booking.createdAt),
                timestamp: booking.createdAt,
                status: booking.status,
                iconClass: 'booking'
            });
        });

        // Add user registration activities
        recentUsers.forEach(user => {
            activities.push({
                id: user._id,
                type: 'user',
                icon: 'fas fa-user-plus',
                title: 'New User Registration',
                description: `${user.firstName} ${user.lastName} joined the platform`,
                time: getTimeAgo(user.createdAt),
                timestamp: user.createdAt,
                status: 'completed',
                iconClass: 'user'
            });
        });

        // Add vehicle activities
        recentVehicles.forEach(vehicle => {
            activities.push({
                id: vehicle._id,
                type: 'vehicle',
                icon: 'fas fa-car',
                title: 'New Vehicle Added',
                description: `${vehicle.brand} ${vehicle.model} added to fleet`,
                time: getTimeAgo(vehicle.createdAt),
                timestamp: vehicle.createdAt,
                status: 'completed',
                iconClass: 'vehicle'
            });
        });

        // Sort by timestamp and limit to 10
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const recentActivities = activities.slice(0, 10);

        console.log(`✅ Retrieved ${recentActivities.length} recent activities`);

        res.json({
            success: true,
            data: recentActivities
        });

    } catch (error) {
        console.error('❌ Error fetching recent activity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent activity'
        });
    }
});

// ============================================
// ADDITIONAL ADMIN ENDPOINTS
// ============================================

// POST /api/admin/vehicles - Add New Vehicle
router.post('/vehicles', async (req, res) => {
    try {
        console.log('➕ Admin adding new vehicle:', req.body);

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
            features: req.body.features ? 
                req.body.features.split(',').map(f => f.trim()) : 
                ['Air Conditioning', 'GPS Navigation'],
            location: req.body.location || 'Dessie, Ethiopia',
            description: `${req.body.year} ${req.body.brand} ${req.body.model} - Perfect for city rides and long trips.`
        };

        const newVehicle = new Vehicle(vehicleData);
        const savedVehicle = await newVehicle.save();

        console.log('✅ Vehicle added successfully:', savedVehicle._id);

        res.json({
            success: true,
            data: savedVehicle,
            message: 'Vehicle added successfully'
        });

    } catch (error) {
        console.error('❌ Error adding vehicle:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add vehicle'
        });
    }
});

// DELETE /api/admin/vehicles/:id - Delete Vehicle
router.delete('/vehicles/:id', async (req, res) => {
    try {
        console.log(`🗑️ Admin deleting vehicle ${req.params.id}`);

        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);

        if (!deletedVehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        console.log('✅ Vehicle deleted successfully');

        res.json({
            success: true,
            data: deletedVehicle,
            message: 'Vehicle deleted successfully'
        });

    } catch (error) {
        console.error('❌ Error deleting vehicle:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete vehicle'
        });
    }
});

// PUT /api/admin/vehicles/:id - Update Vehicle
router.put('/vehicles/:id', async (req, res) => {
    try {
        console.log(`🔄 Admin updating vehicle ${req.params.id}`);

        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedVehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        console.log('✅ Vehicle updated successfully');

        res.json({
            success: true,
            data: updatedVehicle,
            message: 'Vehicle updated successfully'
        });

    } catch (error) {
        console.error('❌ Error updating vehicle:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update vehicle'
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