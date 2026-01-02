// Vehicle Controller - Handles all vehicle-related business logic
const Vehicle = require('../models/Vehicle');

// GET /api/vehicles - Fetch all vehicles
const getAllVehicles = async (req, res) => {
    try {
        // Find all vehicles in the database
        const vehicles = await Vehicle.find();
        
        // Send successful response
        res.status(200).json({
            success: true,
            message: 'Vehicles fetched successfully',
            count: vehicles.length,
            data: vehicles
        });
        
    } catch (error) {
        // Handle any errors
        console.error('Error fetching vehicles:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vehicles',
            error: error.message
        });
    }
};

// GET /api/vehicles/available - Fetch only available vehicles
const getAvailableVehicles = async (req, res) => {
    try {
        // Find only vehicles that are available
        const vehicles = await Vehicle.find({ isAvailable: true });
        
        res.status(200).json({
            success: true,
            message: 'Available vehicles fetched successfully',
            count: vehicles.length,
            data: vehicles
        });
        
    } catch (error) {
        console.error('Error fetching available vehicles:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching available vehicles',
            error: error.message
        });
    }
};

// GET /api/vehicles/:type - Fetch vehicles by type (car or bike)
const getVehiclesByType = async (req, res) => {
    try {
        const { type } = req.params;  // Get type from URL parameter
        
        // Validate type
        if (!['car', 'bike'].includes(type.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid vehicle type. Must be "car" or "bike"'
            });
        }
        
        // Find vehicles by type
        const vehicles = await Vehicle.find({ 
            type: type.toLowerCase(),
            isAvailable: true 
        });
        
        res.status(200).json({
            success: true,
            message: `${type.charAt(0).toUpperCase() + type.slice(1)}s fetched successfully`,
            count: vehicles.length,
            data: vehicles
        });
        
    } catch (error) {
        console.error(`Error fetching ${req.params.type}s:`, error);
        res.status(500).json({
            success: false,
            message: `Error fetching ${req.params.type}s`,
            error: error.message
        });
    }
};

// Export all controller functions
module.exports = {
    getAllVehicles,
    getAvailableVehicles,
    getVehiclesByType
};