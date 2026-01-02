// Authentication Middleware - Protects routes and verifies JWT tokens
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        console.log('🔍 Auth Debug - Header:', authHeader ? 'Present' : 'Missing');
        console.log('🔍 Auth Debug - Token extracted:', token ? 'Yes' : 'No');

        if (!token) {
            console.log('❌ Auth Debug - No token provided');
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        // Verify token
        console.log('🔍 Auth Debug - Verifying token with secret...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Auth Debug - Token decoded successfully:', decoded.userId);
        
        // Get user from database
        const user = await User.findById(decoded.userId);
        if (!user) {
            console.log('❌ Auth Debug - User not found for ID:', decoded.userId);
            return res.status(401).json({
                success: false,
                message: 'Invalid token - user not found'
            });
        }

        console.log('✅ Auth Debug - User found:', user.firstName, user.lastName);

        if (!user.isActive) {
            console.log('❌ Auth Debug - User account is deactivated');
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Add user to request object
        req.user = user;
        console.log('✅ Auth Debug - Authentication successful');
        next();

    } catch (error) {
        console.log('❌ Auth Debug - Error occurred:', error.name, error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
};

// Middleware to check if user owns the resource or is admin
const requireOwnershipOrAdmin = (userIdField = 'userId') => {
    return (req, res, next) => {
        const resourceUserId = req.params[userIdField] || req.body[userIdField];
        
        if (req.user.role === 'admin' || req.user._id.toString() === resourceUserId) {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: 'Access denied - insufficient permissions'
            });
        }
    };
};

module.exports = {
    authenticateToken,
    requireAdmin,
    requireOwnershipOrAdmin
};