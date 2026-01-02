// Booking Controller - Handles all booking-related operations
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

// POST /api/bookings - Create a new booking
const createBooking = async (req, res) => {
    try {
        const {
            userId,
            vehicleId,
            startDate,
            endDate,
            startTime,
            endTime,
            pickupLocation,
            dropoffLocation,
            specialRequests
        } = req.body;

        // Validate required fields
        if (!userId || !vehicleId || !startDate || !endDate || !pickupLocation || !dropoffLocation) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Check if vehicle exists and is available
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        if (!vehicle.isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Vehicle is not available'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Calculate total amount
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalAmount = days * vehicle.dailyRate;

        // Create booking
        const booking = new Booking({
            user: userId,
            vehicle: vehicleId,
            startDate,
            endDate,
            startTime,
            endTime,
            totalAmount,
            pickupLocation,
            dropoffLocation,
            specialRequests,
            status: 'pending'
        });

        await booking.save();

        // Populate user and vehicle details
        await booking.populate('user', 'firstName lastName email');
        await booking.populate('vehicle', 'brand model year color licensePlate');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
};

// GET /api/bookings - Get all bookings (admin only)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'firstName lastName email')
            .populate('vehicle', 'brand model year color licensePlate')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Bookings fetched successfully',
            count: bookings.length,
            data: bookings
        });

    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
};

// GET /api/bookings/user/:userId - Get bookings for a specific user
const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;

        const bookings = await Booking.find({ user: userId })
            .populate('vehicle', 'brand model year color licensePlate imageUrl')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'User bookings fetched successfully',
            count: bookings.length,
            data: bookings
        });

    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user bookings',
            error: error.message
        });
    }
};

// PUT /api/bookings/:id - Update booking status
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            id,
            { status, updatedAt: new Date() },
            { new: true }
        ).populate('user', 'firstName lastName email')
         .populate('vehicle', 'brand model year color licensePlate');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking status updated successfully',
            data: booking
        });

    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating booking',
            error: error.message
        });
    }
};

// GET /api/bookings/:id - Get single booking details
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id)
            .populate('user', 'firstName lastName email phone')
            .populate('vehicle', 'brand model year color licensePlate imageUrl dailyRate');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking details fetched successfully',
            data: booking
        });

    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
};

// Export all controller functions
module.exports = {
    createBooking,
    getAllBookings,
    getUserBookings,
    updateBookingStatus,
    getBookingById
};