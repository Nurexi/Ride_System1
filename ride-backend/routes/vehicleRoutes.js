// Vehicle Routes - Define URL endpoints for vehicle operations
const express = require('express');
const router = express.Router();

// Import vehicle controller functions
const {
    getAllVehicles,
    getAvailableVehicles,
    getVehiclesByType
} = require('../controllers/vehicleController');

// Define routes
// GET /api/vehicles - Get all vehicles
router.get('/', getAllVehicles);

// GET /api/vehicles/available - Get only available vehicles (must come before /:type)
router.get('/available', getAvailableVehicles);

// GET /api/vehicles/cars or /api/vehicles/bikes - Get vehicles by type
router.get('/:type', getVehiclesByType);

// Export the router
module.exports = router;