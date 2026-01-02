// Booking Routes - Define URL endpoints for booking operations
const express = require('express');
const router = express.Router();

// Import booking controller functions
const {
    createBooking,
    getAllBookings,
    getUserBookings,
    updateBookingStatus,
    getBookingById
} = require('../controllers/bookingController');

// Import auth middleware
const { authenticateToken, requireAdmin, requireOwnershipOrAdmin } = require('../middleware/auth');

// Protected routes (authentication required)
// POST /api/bookings - Create a new booking
router.post('/', authenticateToken, createBooking);

// GET /api/bookings - Get all bookings (admin only)
router.get('/', authenticateToken, requireAdmin, getAllBookings);

// GET /api/bookings/user/:userId - Get bookings for specific user
router.get('/user/:userId', authenticateToken, requireOwnershipOrAdmin('userId'), getUserBookings);

// GET /api/bookings/:id - Get single booking details
router.get('/:id', authenticateToken, getBookingById);

// PUT /api/bookings/:id - Update booking status (admin only for now)
router.put('/:id', authenticateToken, requireAdmin, updateBookingStatus);

// Export the router
module.exports = router;