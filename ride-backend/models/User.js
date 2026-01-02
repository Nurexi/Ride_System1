// User Model - Blueprint for user documents in MongoDB
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User Schema (structure of user documents)
const userSchema = new mongoose.Schema({
    // Basic Information
    firstName: {
        type: String,           // Data type: text
        required: true,         // This field is mandatory
        trim: true             // Remove extra spaces
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,          // No two users can have same email
        lowercase: true,       // Convert to lowercase
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6          // Password must be at least 6 characters
    },
    
    // Contact Information
    phone: {
        type: String,
        required: false       // Optional field
    },
    
    // Driver Information
    dateOfBirth: {
        type: Date,
        required: false
    },
    licenseNumber: {
        type: String,
        required: false,
        unique: true,         // Each license number should be unique
        sparse: true          // Allow multiple null values
    },
    
    // Account Status
    isActive: {
        type: Boolean,
        default: true         // New users are active by default
    },
    
    // Role (for future admin features)
    role: {
        type: String,
        enum: ['user', 'admin'], // Only these values allowed
        default: 'user'
    }
}, {
    // Schema options
    timestamps: true          // Automatically add createdAt and updatedAt
});

// Virtual field for full name (for admin dashboard)
userSchema.virtual('name').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

// Hash password before saving
userSchema.pre('save', async function() {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return;
    
    try {
        // Hash password with cost of 12
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
    } catch (error) {
        throw error;
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
    const userObject = this.toObject({ virtuals: true });
    delete userObject.password;
    return userObject;
};

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;