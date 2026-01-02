// MongoDB Connection Configuration
const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Check if MONGODB_URI is defined
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI is not defined in environment variables');
            console.error('💡 Please check your .env file contains: MONGODB_URI=your_mongodb_connection_string');
            process.exit(1);
        }

        // Log connection attempt (without exposing the full URI for security)
        const uriStart = process.env.MONGODB_URI.substring(0, 20);
        console.log(`🔄 Attempting to connect to MongoDB: ${uriStart}...`);
        
        // Connect to MongoDB using the connection string from .env
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log(`🍃 MongoDB Connected Successfully!`);
        console.log(`📍 Database Host: ${conn.connection.host}`);
        console.log(`🗄️  Database Name: ${conn.connection.name}`);
        
        return conn;
        
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.error('💡 Common fixes:');
        console.error('   • Check your internet connection');
        console.error('   • Verify MONGODB_URI in .env file');
        console.error('   • Ensure MongoDB Atlas allows your IP address');
        console.error('   • Check username/password in connection string');
        
        // Exit the process if we can't connect to database
        process.exit(1);
    }
};

// Export the connection function
module.exports = connectDB;