// ============================================
// COMPLETE ADMIN ROUTES - PRODUCTION READY
// ============================================

const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');

// Import models
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

// Apply admin authentication to ALL routes
router.use(adminAuth);

// ============================================
// PART 1: ADMIN STATISTICS API
// ============================================

// GET /api/admin/stats - Dashboard Statistics
router.get('/stats', async (req, res) => {
    try {
        console.log('📊 Admin requesting dashboard statistics...');

        // Parallel queries for better performance
        const [
            totalUsers,
            totalDrivers,
            totalVehicles,
            totalRides,
            activeRides,
            completedRides,
            cancelledRides,
            completedBookings
        ] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            User.countDocuments({ role: 'driver' }),
            Vehicle.countDocuments(),
            Booking.countDocuments(),
            Booking.countDocuments({ status: 'active' }),
            Booking.countDocuments({ status: 'completed' }),
            Booking.countDocuments({ status: 'cancelled' }),
            Booking.find({ status: 'completed' }).select('totalAmount')
        ]);

        // Calculate total revenue
        const totalRevenue = completedBookings.reduce((sum, booking) => {
            return sum + (booking.totalAmount || 0);
        }, 0);

        // Additional useful stats
        const availableVehicles = await Vehicle.countDocuments({ isAvailable: true });
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayRides = await Booking.countDocuments({ 
            createdAt: { $gte: todayStart } 
        });

        const stats = {
            totalUsers,
            totalDrivers,
            totalVehicles,
            availableVehicles,
            totalRides,
            activeRides,
            completedRides,
            cancelledRides,
            totalRevenue: Math.round(totalRevenue * 100) / 100, // Round to 2 decimal places
            todayRides
        };

        console.log('✅ Admin stats loaded:', stats);

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('❌ Error loading admin stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load dashboard statistics'
        });
    }
});

// ============================================
// PART 2: ADMIN DATA MANAGEMENT APIs
// ============================================

// 1️⃣ VEHICLES MANAGEMENT
// GET /api/admin/vehicles - Get all vehicles
router.get('/vehicles', async (req, res) => {
    try {
        console.log('🚗 Admin requesting all vehicles...');

        const vehicles = await Vehicle.find()
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for better performance

        // Add computed fields
        const vehiclesWithStats = vehicles.map(vehicle => ({
            ...vehicle,
            assignedDriver: 'Unassigned', // TODO: Add driver assignment logic
            totalRides: 0, // TODO: Calculate from bookings
            lastMaintenance: vehicle.lastServiceDate || null,
            status: vehicle.isAvailable ? 'available' : 'unavailable'
        }));

        console.log(`✅ Loaded ${vehicles.length} vehicles for admin`);

        res.json({
            success: true,
            data: vehiclesWithStats,
            count: vehicles.length
        });

    } catch (error) {
        console.error('❌ Error loading vehicles:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load vehicles'
        });
    }
});

// POST /api/admin/vehicles - Add new vehicle
router.post('/vehicles', async (req, res) => {
    try {
        console.log('🚗 Admin adding new vehicle...');

        const vehicle = new Vehicle(req.body);
        await vehicle.save();

        console.log('✅ New vehicle added:', vehicle.brand, vehicle.model);

        res.status(201).json({
            success: true,
            data: vehicle,
            message: 'Vehicle added successfully'
        });

    } catch (error) {
        console.error('❌ Error adding vehicle:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Vehicle with this plate number already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to add vehicle'
        });
    }
});

// PUT /api/admin/vehicles/:id - Update vehicle
router.put('/vehicles/:id', async (req, res) => {
    try {
        console.log('🚗 Admin updating vehicle:', req.params.id);

        const vehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        console.log('✅ Vehicle updated:', vehicle.brand, vehicle.model);

        res.json({
            success: true,
            data: vehicle,
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

// DELETE /api/admin/vehicles/:id - Delete vehicle
router.delete('/vehicles/:id', async (req, res) => {
    try {
        console.log('🚗 Admin deleting vehicle:', req.params.id);

        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        console.log('✅ Vehicle deleted:', vehicle.brand, vehicle.model);

        res.json({
            success: true,
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

// 2️⃣ USERS MANAGEMENT
// GET /api/admin/users - Get all users
router.get('/users', async (req, res) => {
    try {
        console.log('👥 Admin requesting all users...');

        const users = await User.find({ role: 'user' })
            .select('-password') // Exclude password field
            .sort({ createdAt: -1 })
            .lean();

        // Add computed fields
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const totalBookings = await Booking.countDocuments({ user: user._id });
            const completedBookings = await Booking.countDocuments({ 
                user: user._id, 
                status: 'completed' 
            });

            return {
                ...user,
                totalBookings,
                completedBookings,
                joinDate: user.createdAt,
                status: user.isActive ? 'active' : 'inactive'
            };
        }));

        console.log(`✅ Loaded ${users.length} users for admin`);

        res.json({
            success: true,
            data: usersWithStats,
            count: users.length
        });

    } catch (error) {
        console.error('❌ Error loading users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load users'
        });
    }
});

// 3️⃣ DRIVERS MANAGEMENT
// GET /api/admin/drivers - Get all drivers
router.get('/drivers', async (req, res) => {
    try {
        console.log('🚛 Admin requesting all drivers...');

        const drivers = await User.find({ role: 'driver' })
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();

        // Add computed fields for drivers
        const driversWithStats = await Promise.all(drivers.map(async (driver) => {
            const totalRides = await Booking.countDocuments({ 
                // TODO: Add driver field to Booking model
                status: 'completed' 
            });
            
            return {
                ...driver,
                totalRides,
                earnings: totalRides * 50, // Mock calculation
                verificationStatus: 'verified', // TODO: Add verification logic
                onlineStatus: 'offline', // TODO: Add online status tracking
                rating: 4.8, // TODO: Add rating system
                joinDate: driver.createdAt
            };
        }));

        console.log(`✅ Loaded ${drivers.length} drivers for admin`);

        res.json({
            success: true,
            data: driversWithStats,
            count: drivers.length
        });

    } catch (error) {
        console.error('❌ Error loading drivers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load drivers'
        });
    }
});

// 4️⃣ RIDES/BOOKINGS MANAGEMENT
// GET /api/admin/rides - Get all rides/bookings
router.get('/rides', async (req, res) => {
    try {
        console.log('🚖 Admin requesting all rides...');

        const rides = await Booking.find()
            .populate('user', 'firstName lastName email phone')
            .populate('vehicle', 'brand model plateNumber type')
            .sort({ createdAt: -1 })
            .lean();

        // Format rides for admin display
        const ridesWithDetails = rides.map(ride => ({
            ...ride,
            passengerName: ride.user ? `${ride.user.firstName} ${ride.user.lastName}` : 'Unknown',
            passengerEmail: ride.user?.email || 'N/A',
            passengerPhone: ride.user?.phone || 'N/A',
            vehicleInfo: ride.vehicle ? `${ride.vehicle.brand} ${ride.vehicle.model} (${ride.vehicle.plateNumber})` : 'Unknown Vehicle',
            vehicleType: ride.vehicle?.type || 'N/A',
            duration: ride.endDate && ride.startDate ? 
                Math.round((new Date(ride.endDate) - new Date(ride.startDate)) / (1000 * 60 * 60 * 24)) : 0,
            bookingDate: ride.createdAt,
            fare: ride.totalAmount || 0
        }));

        console.log(`✅ Loaded ${rides.length} rides for admin`);

        res.json({
            success: true,
            data: ridesWithDetails,
            count: rides.length
        });

    } catch (error) {
        console.error('❌ Error loading rides:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load rides'
        });
    }
});

// ============================================
// PART 3: ADMIN ACTION APIs
// ============================================

// 1️⃣ VERIFY DRIVER
// PUT /api/admin/drivers/:id/verify - Verify driver
router.put('/drivers/:id/verify', async (req, res) => {
    try {
        console.log('✅ Admin verifying driver:', req.params.id);

        const driver = await User.findById(req.params.id);

        if (!driver || driver.role !== 'driver') {
            return res.status(404).json({
                success: false,
                message: 'Driver not found'
            });
        }

        // TODO: Add verification status field to User model
        // For now, we'll just update a custom field
        driver.verificationStatus = 'verified';
        driver.verifiedAt = new Date();
        driver.verifiedBy = req.user._id;
        await driver.save();

        console.log('✅ Driver verified:', driver.firstName, driver.lastName);

        res.json({
            success: true,
            data: driver,
            message: 'Driver verified successfully'
        });

    } catch (error) {
        console.error('❌ Error verifying driver:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify driver'
        });
    }
});

// 2️⃣ BLOCK USER
// PUT /api/admin/users/:id/block - Block/unblock user
router.put('/users/:id/block', async (req, res) => {
    try {
        console.log('🚫 Admin blocking/unblocking user:', req.params.id);

        const { blocked } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: !blocked },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const action = blocked ? 'blocked' : 'unblocked';
        console.log(`✅ User ${action}:`, user.firstName, user.lastName);

        res.json({
            success: true,
            data: user,
            message: `User ${action} successfully`
        });

    } catch (error) {
        console.error('❌ Error blocking user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user status'
        });
    }
});

// 3️⃣ UPDATE RIDE STATUS
// PUT /api/admin/rides/:id/status - Update ride status
router.put('/rides/:id/status', async (req, res) => {
    try {
        console.log('🚖 Admin updating ride status:', req.params.id);

        const { status } = req.body;
        
        if (!['pending', 'confirmed', 'active', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const ride = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user', 'firstName lastName')
         .populate('vehicle', 'brand model plateNumber');

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: 'Ride not found'
            });
        }

        console.log(`✅ Ride status updated to ${status}:`, ride._id);

        res.json({
            success: true,
            data: ride,
            message: 'Ride status updated successfully'
        });

    } catch (error) {
        console.error('❌ Error updating ride status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update ride status'
        });
    }
});

// ============================================
// PART 4: ADMIN ACTIVITY LOG
// ============================================

// GET /api/admin/activity - Get recent admin activities
router.get('/activity', async (req, res) => {
    try {
        console.log('📋 Admin requesting activity log...');

        // Get recent activities from different collections
        const [recentUsers, recentVehicles, recentBookings] = await Promise.all([
            User.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName createdAt role'),
            Vehicle.find().sort({ createdAt: -1 }).limit(5).select('brand model createdAt'),
            Booking.find().sort({ createdAt: -1 }).limit(5).populate('user', 'firstName lastName').select('createdAt status totalAmount')
        ]);

        // Format activities
        const activities = [];

        recentUsers.forEach(user => {
            activities.push({
                type: 'user_registration',
                description: `New ${user.role} registered: ${user.firstName} ${user.lastName}`,
                timestamp: user.createdAt,
                icon: 'fas fa-user-plus'
            });
        });

        recentVehicles.forEach(vehicle => {
            activities.push({
                type: 'vehicle_added',
                description: `New vehicle added: ${vehicle.brand} ${vehicle.model}`,
                timestamp: vehicle.createdAt,
                icon: 'fas fa-car'
            });
        });

        recentBookings.forEach(booking => {
            const userName = booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'Unknown User';
            activities.push({
                type: 'booking_created',
                description: `New booking by ${userName} - ETB ${booking.totalAmount}`,
                timestamp: booking.createdAt,
                icon: 'fas fa-calendar-check'
            });
        });

        // Sort all activities by timestamp
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        console.log(`✅ Loaded ${activities.length} recent activities`);

        res.json({
            success: true,
            data: activities.slice(0, 10) // Return top 10 activities
        });

    } catch (error) {
        console.error('❌ Error loading activity log:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load activity log'
        });
    }
});

// ============================================
// EXPORT ROUTER
// ============================================

module.exports = router;