// Booking Modal - Handles the booking form and process
class BookingModal {
    constructor() {
        this.modal = null;
        this.selectedVehicle = null;
        this.currentUser = this.getCurrentUser(); // For now, we'll use a mock user
        this.createModal();
    }

    // Get current user (mock for now - in real app, this would come from authentication)
    getCurrentUser() {
        return {
            id: '695413d257ca45cc1a3e87f3', // John Doe's ID from our seed data
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com'
        };
    }

    // Create the booking modal HTML
    createModal() {
        const modalHTML = `
            <div id="bookingModal" class="booking-modal" style="display: none;">
                <div class="booking-modal-overlay">
                    <div class="booking-modal-content">
                        <div class="booking-modal-header">
                            <h2>🚗 Book Your Vehicle</h2>
                            <button class="booking-modal-close" id="closeBookingModal">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <div class="booking-modal-body">
                            <!-- Vehicle Summary -->
                            <div class="selected-vehicle-summary" id="vehicleSummary">
                                <!-- Vehicle details will be inserted here -->
                            </div>
                            
                            <!-- Booking Form -->
                            <form id="bookingForm" class="booking-form-modal">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="startDate">
                                            <i class="fas fa-calendar-alt"></i> Start Date
                                        </label>
                                        <input type="date" id="startDate" name="startDate" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="endDate">
                                            <i class="fas fa-calendar-alt"></i> End Date
                                        </label>
                                        <input type="date" id="endDate" name="endDate" required>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="startTime">
                                            <i class="fas fa-clock"></i> Start Time (Optional)
                                        </label>
                                        <input type="time" id="startTime" name="startTime">
                                    </div>
                                    <div class="form-group">
                                        <label for="endTime">
                                            <i class="fas fa-clock"></i> End Time (Optional)
                                        </label>
                                        <input type="time" id="endTime" name="endTime">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="pickupLocation">
                                        <i class="fas fa-map-marker-alt"></i> Pickup Location
                                    </label>
                                    <input type="text" id="pickupLocation" name="pickupLocation" 
                                           placeholder="Enter pickup address" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="dropoffLocation">
                                        <i class="fas fa-map-marker-alt"></i> Drop-off Location
                                    </label>
                                    <input type="text" id="dropoffLocation" name="dropoffLocation" 
                                           placeholder="Enter drop-off address" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="specialRequests">
                                        <i class="fas fa-comment"></i> Special Requests (Optional)
                                    </label>
                                    <textarea id="specialRequests" name="specialRequests" 
                                              placeholder="Any special requirements or notes..." rows="3"></textarea>
                                </div>
                                
                                <!-- Price Calculation -->
                                <div class="price-calculation" id="priceCalculation">
                                    <div class="price-row">
                                        <span>Daily Rate:</span>
                                        <span id="dailyRate">$0.00</span>
                                    </div>
                                    <div class="price-row">
                                        <span>Number of Days:</span>
                                        <span id="numberOfDays">0</span>
                                    </div>
                                    <div class="price-row total">
                                        <span>Total Amount:</span>
                                        <span id="totalAmount">$0.00</span>
                                    </div>
                                </div>
                                
                                <div class="booking-form-actions">
                                    <button type="button" class="btn btn-secondary" id="cancelBooking">
                                        Cancel
                                    </button>
                                    <button type="submit" class="btn btn-primary" id="confirmBooking">
                                        <i class="fas fa-check"></i> Confirm Booking
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('bookingModal');
        this.setupEventListeners();
    }

    // Setup event listeners
    setupEventListeners() {
        // Close modal events
        document.getElementById('closeBookingModal').addEventListener('click', () => this.close());
        document.getElementById('cancelBooking').addEventListener('click', () => this.close());
        
        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal.querySelector('.booking-modal-overlay')) {
                this.close();
            }
        });

        // Date change events for price calculation
        document.getElementById('startDate').addEventListener('change', () => this.calculatePrice());
        document.getElementById('endDate').addEventListener('change', () => this.calculatePrice());

        // Form submission
        document.getElementById('bookingForm').addEventListener('submit', (e) => this.handleSubmit(e));

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startDate').min = today;
        document.getElementById('endDate').min = today;
    }

    // Open modal with selected vehicle
    open(vehicle) {
        this.selectedVehicle = vehicle;
        this.populateVehicleInfo();
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Close modal
    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.resetForm();
    }

    // Populate vehicle information
    populateVehicleInfo() {
        const vehicleSummary = document.getElementById('vehicleSummary');
        vehicleSummary.innerHTML = `
            <div class="vehicle-summary-card">
                <div class="vehicle-summary-image">
                    ${this.selectedVehicle.imageUrl ? 
                        `<img src="${this.selectedVehicle.imageUrl}" alt="${this.selectedVehicle.brand} ${this.selectedVehicle.model}">` :
                        `<div class="vehicle-icon-placeholder">
                            <i class="fas fa-${this.selectedVehicle.type === 'car' ? 'car' : 'motorcycle'}"></i>
                        </div>`
                    }
                </div>
                <div class="vehicle-summary-details">
                    <h3>${this.selectedVehicle.brand} ${this.selectedVehicle.model}</h3>
                    <p>${this.selectedVehicle.year} • ${this.selectedVehicle.color}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${this.selectedVehicle.location}</p>
                    <div class="vehicle-summary-price">
                        <span class="price-label">Daily Rate:</span>
                        <span class="price-value">$${this.selectedVehicle.dailyRate}</span>
                    </div>
                </div>
            </div>
        `;

        // Set daily rate in price calculation
        document.getElementById('dailyRate').textContent = `$${this.selectedVehicle.dailyRate}`;
        
        // Pre-fill pickup location with vehicle location
        document.getElementById('pickupLocation').value = this.selectedVehicle.location;
    }

    // Calculate price based on dates
    calculatePrice() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        if (startDate && endDate && this.selectedVehicle) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            if (end > start) {
                const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                const total = days * this.selectedVehicle.dailyRate;
                
                document.getElementById('numberOfDays').textContent = days;
                document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
                
                // Update end date minimum
                document.getElementById('endDate').min = startDate;
            } else {
                document.getElementById('numberOfDays').textContent = '0';
                document.getElementById('totalAmount').textContent = '$0.00';
            }
        }
    }

    // Handle form submission
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const bookingData = {
            userId: this.currentUser.id,
            vehicleId: this.selectedVehicle._id,
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            startTime: formData.get('startTime') || null,
            endTime: formData.get('endTime') || null,
            pickupLocation: formData.get('pickupLocation'),
            dropoffLocation: formData.get('dropoffLocation'),
            specialRequests: formData.get('specialRequests') || null
        };

        try {
            // Show loading state
            const submitBtn = document.getElementById('confirmBooking');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Booking...';
            submitBtn.disabled = true;

            // Create booking
            const booking = await RideFairAPI.createBooking(bookingData);
            
            // Show success message
            VehicleDisplay.showMessage(`✅ Booking confirmed! Booking ID: ${booking._id}`, 'success');
            
            // Close modal
            this.close();
            
            // Optionally refresh vehicle list to update availability
            // await this.refreshVehicleList();
            
        } catch (error) {
            VehicleDisplay.showMessage(`❌ Booking failed: ${error.message}`, 'error');
        } finally {
            // Reset button
            const submitBtn = document.getElementById('confirmBooking');
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Confirm Booking';
            submitBtn.disabled = false;
        }
    }

    // Reset form
    resetForm() {
        document.getElementById('bookingForm').reset();
        document.getElementById('numberOfDays').textContent = '0';
        document.getElementById('totalAmount').textContent = '$0.00';
    }
}

// Create global booking modal instance
window.bookingModal = new BookingModal();