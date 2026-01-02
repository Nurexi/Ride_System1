// Authentication Controller - Handles user registration, login, and profile management
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Token expires in 7 days
    );
};

// POST /api/auth/register - User registration
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, dateOfBirth, licenseNumber } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'First name, last name, email, and password are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Check if license number is already taken (if provided)
        if (licenseNumber) {
            const existingLicense = await User.findOne({ licenseNumber });
            if (existingLicense) {
                return res.status(400).json({
                    success: false,
                    message: 'This license number is already registered'
                });
            }
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            password, // Will be hashed by the pre-save middleware
            phone,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            licenseNumber
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user,
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating user account',
            error: error.message
        });
    }
};

// POST /api/auth/login - User login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
};

// GET /api/auth/profile - Get user profile (protected route)
const getProfile = async (req, res) => {
    try {
        // User is already attached to req by auth middleware
        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: req.user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving profile',
            error: error.message
        });
    }
};

// PUT /api/auth/profile - Update user profile (protected route)
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, dateOfBirth, licenseNumber } = req.body;
        const userId = req.user._id;

        // Check if license number is already taken by another user
        if (licenseNumber && licenseNumber !== req.user.licenseNumber) {
            const existingLicense = await User.findOne({ 
                licenseNumber, 
                _id: { $ne: userId } 
            });
            if (existingLicense) {
                return res.status(400).json({
                    success: false,
                    message: 'This license number is already registered'
                });
            }
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                phone,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                licenseNumber
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);
        
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// PUT /api/auth/change-password - Change password (protected route)
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        // Get user with password (since toJSON removes it)
        const user = await User.findById(req.user._id).select('+password');
        
        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
};