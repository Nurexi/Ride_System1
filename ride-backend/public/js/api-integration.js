// Frontend-Backend Integration for RideFair
// This file handles all API calls to your backend

// Backend API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// API Functions
class RideFairAPI {
    
    // Fetch all vehicles from backend
    static async getAllVehicles() {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles`);
            const data = await response.json();
            
            if (data.success) {
                console.log('✅ Vehicles loaded:', data.data);
                return data.data;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('❌ Error fetching vehicles:', error);
            throw error;
        }
    }
    
    // Fetch only available vehicles
    static async getAvailableVehicles() {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles/available`);
            const data = await response.json();
            
            if (data.success) {
                console.log('✅ Available vehicles loaded:', data.data);
                return data.data;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('❌ Error fetching available vehicles:', error);
            throw error;
        }
    }
    
    // Fetch cars only
    static async getCars() {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles/cars`);
            const data = await response.json();
            
            if (data.success) {
                console.log('✅ Cars loaded:', data.data);
                return data.data;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('❌ Error fetching cars:', error);
            throw error;
        }
    }
    
    // Fetch bikes only
    static async getBikes() {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles/bikes`);
            const data = await response.json();
            
            if (data.success) {
                console.log('✅ Bikes loaded:', data.data);
                return data.data;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('❌ Error fetching bikes:', error);
            throw error;
        }
    }
}

// Vehicle Display Functions
class VehicleDisplay {
    
    // Display vehicles in the booking page
    static displayVehicles(vehicles) {
        const vehicleGrid = document.querySelector('.vehicle-grid');
        
        if (!vehicleGrid) {
            console.warn('Vehicle grid not found on this page');
            return;
        }
        
        // Clear existing vehicles (keep the original cards for now)
        // We'll replace this with dynamic content
        
        // Create a new section for real vehicles
        const realVehiclesSection = document.createElement('div');
        realVehiclesSection.className = 'real-vehicles-section';
        realVehiclesSection.innerHTML = '<h3>🚗 Available Vehicles from Database</h3>';
        
        const realVehicleGrid = document.createElement('div');
        realVehicleGrid.className = 'real-vehicle-grid';
        
        vehicles.forEach(vehicle => {
            const vehicleCard = this.createVehicleCard(vehicle);
            realVehicleGrid.appendChild(vehicleCard);
        });
        
        realVehiclesSection.appendChild(realVehicleGrid);
        
        // Insert after the existing vehicle grid
        vehicleGrid.parentNode.insertBefore(realVehiclesSection, vehicleGrid.nextSibling);
    }
    
    // Create a vehicle card element
    static createVehicleCard(vehicle) {
        const card = document.createElement('div');
        card.className = 'real-vehicle-card';
        card.dataset.vehicleId = vehicle._id;
        card.dataset.type = vehicle.type;
        
        card.innerHTML = `
            <div class="vehicle-image">
                ${vehicle.imageUrl ? 
                    `<img src="${vehicle.imageUrl}" alt="${vehicle.brand} ${vehicle.model}">` :
                    `<div class="vehicle-icon-placeholder">
                        <i class="fas fa-${vehicle.type === 'car' ? 'car' : 'motorcycle'}"></i>
                    </div>`
                }
            </div>
            <div class="vehicle-details">
                <h4>${vehicle.brand} ${vehicle.model}</h4>
                <p class="vehicle-year">${vehicle.year} • ${vehicle.color}</p>
                <p class="vehicle-location">📍 ${vehicle.location}</p>
                <div class="vehicle-features">
                    ${vehicle.features ? vehicle.features.slice(0, 3).map(feature => 
                        `<span class="feature-tag">${feature}</span>`
                    ).join('') : ''}
                </div>
                <div class="vehicle-pricing">
                    <div class="price-item">
                        <span class="price-label">Daily:</span>
                        <span class="price-value">$${vehicle.dailyRate}</span>
                    </div>
                    ${vehicle.hourlyRate ? `
                        <div class="price-item">
                            <span class="price-label">Hourly:</span>
                            <span class="price-value">$${vehicle.hourlyRate}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="vehicle-status ${vehicle.isAvailable ? 'available' : 'unavailable'}">
                    ${vehicle.isAvailable ? '✅ Available' : '❌ Not Available'}
                </div>
            </div>
            <button class="select-vehicle-btn ${!vehicle.isAvailable ? 'disabled' : ''}" 
                    ${!vehicle.isAvailable ? 'disabled' : ''}>
                ${vehicle.isAvailable ? 'Select Vehicle' : 'Unavailable'}
            </button>
        `;
        
        // Add click event for vehicle selection
        if (vehicle.isAvailable) {
            const selectBtn = card.querySelector('.select-vehicle-btn');
            selectBtn.addEventListener('click', () => {
                this.selectVehicle(vehicle);
            });
        }
        
        return card;
    }
    
    // Handle vehicle selection
    static selectVehicle(vehicle) {
        console.log('🚗 Vehicle selected:', vehicle);
        
        // Remove previous selections
        document.querySelectorAll('.real-vehicle-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Mark this vehicle as selected
        const selectedCard = document.querySelector(`[data-vehicle-id="${vehicle._id}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // Store selected vehicle data
        window.selectedVehicle = vehicle;
        
        // Show success message
        this.showMessage(`✅ Selected: ${vehicle.brand} ${vehicle.model}`, 'success');
        
        // You can add more logic here, like:
        // - Update pricing calculations
        // - Enable next step button
        // - Show vehicle details in a modal
    }
    
    // Show messages to user
    static showMessage(message, type = 'info') {
        // Create or update message element
        let messageEl = document.querySelector('.api-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'api-message';
            document.body.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.className = `api-message ${type}`;
        messageEl.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 RideFair API Integration loaded');
    
    // Check if we're on the booking page
    if (document.querySelector('.vehicle-grid')) {
        console.log('📍 Booking page detected, loading vehicles...');
        
        try {
            // Load available vehicles
            const vehicles = await RideFairAPI.getAvailableVehicles();
            VehicleDisplay.displayVehicles(vehicles);
            
        } catch (error) {
            console.error('Failed to load vehicles:', error);
            VehicleDisplay.showMessage('⚠️ Could not load vehicles. Make sure your backend is running!', 'error');
        }
    }
});

// Export for use in other files
window.RideFairAPI = RideFairAPI;
window.VehicleDisplay = VehicleDisplay;