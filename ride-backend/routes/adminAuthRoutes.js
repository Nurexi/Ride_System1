// Admin Authentication Routes
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// POST /api/admin/auth/login - Admin Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('🔐 Admin login attempt:', email);

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // For demo purposes, allow hardcoded admin login
        if (email === 'admin@ridefair.com' && password === 'RideFair2024!') {
            // Create or find admin user
            let adminUser = await User.findOne({ email: 'admin@ridefair.com' });
            
            if (!adminUser) {
                // Create admin user if doesn't exist
                adminUser = new User({
                    firstName: 'Admin',
                    lastName: 'User',
                    email: 'admin@ridefair.com',
                    password: 'RideFair2024!', // Will be hashed by pre-save middleware
                    role: 'admin'
                });
                await adminUser.save();
                console.log('✅ Admin user created');
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: adminUser._id, role: adminUser.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            console.log('✅ Admin login successful');

            return res.json({
                success: true,
                data: {
                    token,
                    user: {
                        id: adminUser._id,
                        name: `${adminUser.firstName} ${adminUser.lastName}`,
                        email: adminUser.email,
                        role: adminUser.role
                    }
                },
                message: 'Admin login successful'
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('✅ Admin login successful');

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user._id,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    role: user.role
                }
            },
            message: 'Admin login successful'
        });

    } catch (error) {
        console.error('❌ Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// POST /api/admin/auth/verify - Verify Admin Token
router.post('/verify', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user || user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token or insufficient permissions'
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('❌ Token verification error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
});

module.exports = router;