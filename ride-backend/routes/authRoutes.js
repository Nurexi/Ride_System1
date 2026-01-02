// Authentication Routes - Define URL endpoints for authentication
const express = require('express');
const router = express.Router();

// Import auth controller functions
const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
} = require('../controllers/authController');

// Import auth middleware
const { authenticateToken } = require('../middleware/auth');

// Public routes (no authentication required)
// POST /api/auth/register - User registration
router.post('/register', register);

// POST /api/auth/login - User login
router.post('/login', login);

// Protected routes (authentication required)
// GET /api/auth/profile - Get user profile
router.get('/profile', authenticateToken, getProfile);

// PUT /api/auth/profile - Update user profile
router.put('/profile', authenticateToken, updateProfile);

// PUT /api/auth/change-password - Change password
router.put('/change-password', authenticateToken, changePassword);

// Export the router
module.exports = router;