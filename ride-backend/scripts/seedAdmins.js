// ============================================
// ADMIN SEEDING SCRIPT - PRODUCTION READY
// ============================================

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');

// Load environment variables from the correct path
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import User model
const User = require('../models/User');

// ============================================
// ADMIN ACCOUNTS CONFIGURATION
// ============================================

const adminAccounts = [
    {
        firstName: 'Nuredin',
        lastName: 'Ibrahim',
        email: 'nuredin@gmail.com',
        password: 'nuredin123',
        role: 'admin'
    },
    {
        firstName: 'Amar',
        lastName: 'Ahmed',
        email: 'amar@gmail.com',
        password: 'amar123',
        role: 'admin'
    },
    {
        firstName: 'Eman',
        lastName: 'Ali',
        email: 'eman@gmail.com',
        password: 'eman123',
        role: 'admin'
    },
    {
        firstName: 'Siham',
        lastName: 'Mohammed',
        email: 'siham@gmail.com',
        password: 'siham123',
        role: 'admin'
    },
    {
        firstName: 'Hayat',
        lastName: 'Hassan',
        email: 'hayat@gmail.com',
        password: 'hayat123',
        role: 'admin'
    },
    {
        firstName: 'Salsawit',
        lastName: 'Bekele',
        email: 'salsawit@gmail.com',
        password: 'salsawit123',
        role: 'admin'
    }
];

// ============================================
// SEEDING FUNCTIONS
// ============================================

/**
 * Hash password using bcrypt with salt rounds of 12
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        return hashedPassword;
    } catch (error) {
        throw new Error(`Password hashing failed: ${error.message}`);
    }
}

/**
 * Check if admin user already exists
 * @param {string} email - Admin email to check
 * @returns {Promise<boolean>} - True if exists, false otherwise
 */
async function adminExists(email) {
    try {
        const existingAdmin = await User.findOne({ email: email.toLowerCase() });
        return !!existingAdmin;
    } catch (error) {
        throw new Error(`Error checking admin existence: ${error.message}`);
    }
}

/**
 * Create a single admin user
 * @param {Object} adminData - Admin user data
 * @returns {Promise<Object>} - Created admin user
 */
async function createAdmin(adminData) {
    try {
        // Create admin user - let the User model handle password hashing
        const admin = new User({
            firstName: adminData.firstName,
            lastName: adminData.lastName,
            email: adminData.email.toLowerCase(),
            password: adminData.password, // User model will hash this automatically
            role: adminData.role,
            isActive: true
        });

        // Save to database
        const savedAdmin = await admin.save();
        
        return savedAdmin;
    } catch (error) {
        throw new Error(`Error creating admin ${adminData.email}: ${error.message}`);
    }
}

/**
 * Seed all admin accounts
 */
async function seedAdmins() {
    console.log('🌱 Starting Admin Seeding Process...\n');
    
    let createdCount = 0;
    let skippedCount = 0;
    const results = [];

    try {
        // Process each admin account
        for (const adminData of adminAccounts) {
            console.log(`🔍 Checking admin: ${adminData.firstName} ${adminData.lastName} (${adminData.email})`);
            
            // Check if admin already exists
            const exists = await adminExists(adminData.email);
            
            if (exists) {
                console.log(`   ⏭️  Admin already exists - skipping`);
                skippedCount++;
                results.push({
                    email: adminData.email,
                    name: `${adminData.firstName} ${adminData.lastName}`,
                    status: 'skipped',
                    reason: 'Already exists'
                });
            } else {
                try {
                    // Create new admin
                    const newAdmin = await createAdmin(adminData);
                    console.log(`   ✅ Admin created successfully`);
                    createdCount++;
                    results.push({
                        email: adminData.email,
                        name: `${adminData.firstName} ${adminData.lastName}`,
                        status: 'created',
                        id: newAdmin._id
                    });
                } catch (createError) {
                    console.log(`   ❌ Failed to create admin: ${createError.message}`);
                    results.push({
                        email: adminData.email,
                        name: `${adminData.firstName} ${adminData.lastName}`,
                        status: 'failed',
                        error: createError.message
                    });
                }
            }
            
            console.log(''); // Empty line for readability
        }

        // Display final results
        console.log('📊 ADMIN SEEDING RESULTS');
        console.log('========================');
        console.log(`✅ Created: ${createdCount} admin(s)`);
        console.log(`⏭️  Skipped: ${skippedCount} admin(s)`);
        console.log(`📝 Total Processed: ${adminAccounts.length} admin(s)\n`);

        // Display detailed results
        console.log('📋 DETAILED RESULTS:');
        console.log('--------------------');
        results.forEach((result, index) => {
            const status = result.status === 'created' ? '✅' : 
                          result.status === 'skipped' ? '⏭️' : '❌';
            console.log(`${index + 1}. ${status} ${result.name} (${result.email})`);
            if (result.status === 'failed') {
                console.log(`   Error: ${result.error}`);
            }
        });

        console.log('\n🎉 ADMIN SEEDING COMPLETED SUCCESSFULLY!');
        
        if (createdCount > 0) {
            console.log('\n🔐 ADMIN LOGIN CREDENTIALS:');
            console.log('---------------------------');
            results.filter(r => r.status === 'created').forEach((admin, index) => {
                const originalAdmin = adminAccounts.find(a => a.email === admin.email);
                console.log(`${index + 1}. Email: ${admin.email}`);
                console.log(`   Password: ${originalAdmin.password}`);
                console.log(`   Name: ${admin.name}`);
                console.log('');
            });
        }

        console.log('🌐 ADMIN DASHBOARD ACCESS:');
        console.log('-------------------------');
        console.log('URL: http://localhost:3000/admin');
        console.log('Login with any of the admin credentials above\n');

        return {
            success: true,
            created: createdCount,
            skipped: skippedCount,
            total: adminAccounts.length,
            results: results
        };

    } catch (error) {
        console.error('❌ ADMIN SEEDING FAILED:', error.message);
        throw error;
    }
}

/**
 * Verify admin accounts can authenticate
 */
async function verifyAdminAccounts() {
    console.log('🔐 Verifying Admin Authentication...\n');
    
    let verifiedCount = 0;
    
    for (const adminData of adminAccounts) {
        try {
            // Find admin in database
            const admin = await User.findOne({ email: adminData.email.toLowerCase() });
            
            if (admin) {
                // Verify password using the User model's comparePassword method
                const isPasswordValid = await admin.comparePassword(adminData.password);
                
                if (isPasswordValid && admin.role === 'admin') {
                    console.log(`✅ ${admin.firstName} ${admin.lastName} - Authentication verified`);
                    verifiedCount++;
                } else {
                    console.log(`❌ ${admin.firstName} ${admin.lastName} - Authentication failed`);
                }
            } else {
                console.log(`❌ ${adminData.firstName} ${adminData.lastName} - Not found in database`);
            }
        } catch (error) {
            console.log(`❌ ${adminData.firstName} ${adminData.lastName} - Verification error: ${error.message}`);
        }
    }
    
    console.log(`\n🎯 Verification Results: ${verifiedCount}/${adminAccounts.length} admins can authenticate\n`);
    
    return verifiedCount === adminAccounts.length;
}

// ============================================
// MAIN EXECUTION
// ============================================

/**
 * Main function to run the seeding process
 */
async function main() {
    try {
        console.log('🚀 ADMIN SEEDING SYSTEM - STARTING\n');
        
        // Validate environment
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is required');
        }

        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully\n');

        // Run seeding process
        const seedResults = await seedAdmins();
        
        // Verify authentication
        const allVerified = await verifyAdminAccounts();
        
        if (allVerified) {
            console.log('🎉 ALL ADMIN ACCOUNTS ARE READY FOR USE!');
        } else {
            console.log('⚠️  Some admin accounts may have authentication issues');
        }

        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        
        // Exit successfully
        process.exit(0);

    } catch (error) {
        console.error('\n💥 FATAL ERROR:', error.message);
        
        // Close database connection if open
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        
        // Exit with error
        process.exit(1);
    }
}

// ============================================
// SCRIPT EXECUTION
// ============================================

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1);
});

// Run the main function
if (require.main === module) {
    main();
}

// Export for testing purposes
module.exports = {
    seedAdmins,
    verifyAdminAccounts,
    adminAccounts
};