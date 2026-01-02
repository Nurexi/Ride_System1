// ============================================
// BOOK NOW PAGE - JavaScript Functionality
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // ============================================
  // 0. GLOBAL VARIABLES & STATE
  // ============================================
  
  let selectedVehicle = null;
  let availableVehicles = [];
  let rideFairMap = null;
  let currentSection = "trip-section";
  let walletPaymentConfirmed = false;

  // ============================================
  // 1. PROFESSIONAL MAP FEATURE - OpenStreetMap + Leaflet
  // ============================================

  class RideFairMap {
    constructor() {
      this.map = null;
      this.pickupMarker = null;
      this.destinationMarker = null;
      this.routeLine = null;
      this.isPickupSet = false;
      this.isDestinationSet = false;
      this.mapInitialized = false;
      this.currentDistance = 0;
      this.currentTime = 0;

      // Ethiopia boundaries
      this.ETHIOPIA_BOUNDS = [
        [3.4, 33.0], // Southwest
        [15.0, 48.0], // Northeast
      ];

      // Initial center (Dessie/Kombolcha region)
      this.INITIAL_CENTER = [11.13, 39.64];
      this.INITIAL_ZOOM = 12;

      this.init();
    }

    init() {
      this.setupMap();
      this.bindMapEvents();
    }

    setupMap() {
      try {
        // Initialize Leaflet map with OpenStreetMap
        this.map = L.map("map", {
          center: this.INITIAL_CENTER,
          zoom: this.INITIAL_ZOOM,
          minZoom: 6,
          maxZoom: 18,
          maxBounds: this.ETHIOPIA_BOUNDS,
          maxBoundsViscosity: 1.0,
        });

        // Add OpenStreetMap tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(this.map);

        // Add scale control
        L.control.scale({ imperial: false, metric: true }).addTo(this.map);

        // Handle map clicks
        this.map.on("click", (e) => this.handleMapClick(e));

        this.mapInitialized = true;

        // Hide loading spinner
        setTimeout(() => {
          const loading = document.querySelector(".map-loading");
          if (loading) {
            loading.style.display = "none";
          }
        }, 1500);

        console.log("🗺️ Map initialized successfully");
      } catch (error) {
        console.error("Map initialization error:", error);
        this.showMapError("Failed to load map. Please refresh the page.");
      }
    }

    bindMapEvents() {
      // Bind map control buttons
      const resetMapBtn = document.getElementById("resetMapBtn");
      const useMyLocationBtn = document.getElementById("useMyLocationBtn");
      const clearMarkersBtn = document.getElementById("clearMarkersBtn");
      const locateMeBtn = document.getElementById("locateMeBtn");
      const closeInfoBtn = document.getElementById("closeInfoBtn");

      if (resetMapBtn) resetMapBtn.addEventListener("click", () => this.resetMap());
      if (useMyLocationBtn) useMyLocationBtn.addEventListener("click", () => this.useCurrentLocation());
      if (clearMarkersBtn) clearMarkersBtn.addEventListener("click", () => this.clearMarkers());
      if (locateMeBtn) locateMeBtn.addEventListener("click", () => this.useCurrentLocation());
      if (closeInfoBtn) closeInfoBtn.addEventListener("click", () => this.hideInfoPanel());
    }

    handleMapClick(e) {
      const { lat, lng } = e.latlng;

      if (!this.isPickupSet) {
        this.setPickupLocation(lat, lng);
      } else if (!this.isDestinationSet) {
        this.setDestinationLocation(lat, lng);
      } else {
        // Both are set, reset and set pickup
        this.clearMarkers();
        this.setPickupLocation(lat, lng);
      }
    }

    setPickupLocation(lat, lng) {
      // Remove existing pickup marker
      if (this.pickupMarker) {
        this.map.removeLayer(this.pickupMarker);
      }

      // Create pickup marker
      this.pickupMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'custom-marker pickup-marker',
          html: '<i class="fas fa-circle"></i>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      }).addTo(this.map);

      this.isPickupSet = true;
      this.reverseGeocode(lat, lng, 'pickup');
      
      console.log("Pickup set:", lat, lng);
    }

    setDestinationLocation(lat, lng) {
      // Remove existing destination marker
      if (this.destinationMarker) {
        this.map.removeLayer(this.destinationMarker);
      }

      // Create destination marker
      this.destinationMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'custom-marker destination-marker',
          html: '<i class="fas fa-map-marker-alt"></i>',
          iconSize: [20, 20],
          iconAnchor: [10, 20]
        })
      }).addTo(this.map);

      this.isDestinationSet = true;
      this.reverseGeocode(lat, lng, 'destination');
      this.calculateRoute();
      
      console.log("Destination set:", lat, lng);
    }

    async reverseGeocode(lat, lng, type) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        
        const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        const inputId = type === 'pickup' ? 'pickup' : 'destination';
        const input = document.getElementById(inputId);
        
        if (input) {
          input.value = address;
        }
      } catch (error) {
        console.error("Reverse geocoding error:", error);
      }
    }

    calculateRoute() {
      if (!this.pickupMarker || !this.destinationMarker) return;

      const pickup = this.pickupMarker.getLatLng();
      const destination = this.destinationMarker.getLatLng();

      // Calculate straight-line distance
      const distance = pickup.distanceTo(destination) / 1000; // Convert to km
      this.currentDistance = distance;
      this.currentTime = Math.round(distance * 2); // Rough estimate: 2 minutes per km

      // Remove existing route
      if (this.routeLine) {
        this.map.removeLayer(this.routeLine);
      }

      // Draw route line
      this.routeLine = L.polyline([pickup, destination], {
        color: '#C1F11D',
        weight: 4,
        opacity: 0.8
      }).addTo(this.map);

      // Fit map to show both markers
      const group = new L.featureGroup([this.pickupMarker, this.destinationMarker]);
      this.map.fitBounds(group.getBounds().pad(0.1));

      // Update info panel
      this.updateInfoPanel();
    }

    updateInfoPanel() {
      const distanceValue = document.getElementById("distanceValue");
      const timeValue = document.getElementById("timeValue");
      const mapInfoPanel = document.getElementById("mapInfoPanel");

      if (distanceValue) distanceValue.textContent = `${this.currentDistance.toFixed(1)} km`;
      if (timeValue) timeValue.textContent = `${this.currentTime} min`;
      if (mapInfoPanel) mapInfoPanel.style.display = 'block';
    }

    clearMarkers() {
      if (this.pickupMarker) {
        this.map.removeLayer(this.pickupMarker);
        this.pickupMarker = null;
      }
      if (this.destinationMarker) {
        this.map.removeLayer(this.destinationMarker);
        this.destinationMarker = null;
      }
      if (this.routeLine) {
        this.map.removeLayer(this.routeLine);
        this.routeLine = null;
      }

      this.isPickupSet = false;
      this.isDestinationSet = false;
      this.currentDistance = 0;
      this.currentTime = 0;

      // Clear input fields
      const pickupInput = document.getElementById("pickup");
      const destinationInput = document.getElementById("destination");
      if (pickupInput) pickupInput.value = "";
      if (destinationInput) destinationInput.value = "";

      // Hide info panel
      this.hideInfoPanel();
    }

    resetMap() {
      this.clearMarkers();
      if (this.map) {
        this.map.setView(this.INITIAL_CENTER, this.INITIAL_ZOOM);
      }
    }

    useCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            this.map.setView([lat, lng], 15);
            
            if (!this.isPickupSet) {
              this.setPickupLocation(lat, lng);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            showError("Unable to get your location. Please set pickup manually.");
          }
        );
      } else {
        showError("Geolocation is not supported by this browser.");
      }
    }

    hideInfoPanel() {
      const mapInfoPanel = document.getElementById("mapInfoPanel");
      if (mapInfoPanel) {
        mapInfoPanel.style.display = 'none';
      }
    }

    showMapError(message) {
      const mapContainer = document.getElementById("map");
      if (mapContainer) {
        mapContainer.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ef4444;">
            <div style="text-align: center;">
              <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 16px;"></i>
              <p>${message}</p>
            </div>
          </div>
        `;
      }
    }

    getTripData() {
      return {
        distance: this.currentDistance,
        time: this.currentTime,
        pickupSet: this.isPickupSet,
        destinationSet: this.isDestinationSet,
      };
    }
  }

  // Initialize the map
  setTimeout(() => {
    rideFairMap = new RideFairMap();
  }, 500);

  // ============================================
  // 2. REAL VEHICLE LOADING SYSTEM
  // ============================================
  
  async function loadAvailableVehicles() {
    const vehicleGrid = document.getElementById('vehicleGrid');
    const vehicleLoading = document.getElementById('vehicleLoading');
    const vehicleError = document.getElementById('vehicleError');
    const noVehicles = document.getElementById('noVehicles');
    
    try {
      // Show loading state and hide other states
      if (vehicleLoading) vehicleLoading.style.display = 'block';
      if (vehicleError) vehicleError.classList.add('hidden');
      if (noVehicles) noVehicles.classList.add('hidden');
      
      // Fetch vehicles from API
      const response = await fetch('http://localhost:3000/api/vehicles/available');
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        // Limit to first 4 vehicles only
        const limitedVehicles = data.data.slice(0, 4);
        availableVehicles = limitedVehicles;
        renderVehicleCards(limitedVehicles);
        if (vehicleLoading) vehicleLoading.style.display = 'none';
        console.log(`✅ Loaded ${limitedVehicles.length} vehicles successfully`);
        console.log('🚗 Available vehicles:', limitedVehicles.map(v => `${v.brand} ${v.model}`));
      } else {
        // No vehicles available
        if (vehicleLoading) vehicleLoading.style.display = 'none';
        if (noVehicles) noVehicles.classList.remove('hidden');
        console.log('⚠️ No vehicles currently available');
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
      if (vehicleLoading) vehicleLoading.style.display = 'none';
      if (vehicleError) {
        vehicleError.classList.remove('hidden');
        const errorMessage = vehicleError.querySelector('p');
        if (errorMessage) {
          errorMessage.textContent = error.message || 'Failed to load vehicles. Please check your connection and try again.';
        }
      }
    }
  }
  
  function renderVehicleCards(vehicles) {
    const vehicleGrid = document.getElementById('vehicleGrid');
    if (!vehicleGrid) return;
    
    // Clear existing vehicle cards
    const existingCards = vehicleGrid.querySelectorAll('.vehicle-card:not(#vehicleLoading):not(#vehicleError)');
    existingCards.forEach(card => card.remove());
    
    vehicles.forEach(vehicle => {
      const vehicleCard = createVehicleCard(vehicle);
      vehicleGrid.appendChild(vehicleCard);
    });
  }
  
  // Helper function to get color codes for visual display
  function getColorCode(colorName) {
    const colorMap = {
      'white': '#ffffff',
      'silver': '#c0c0c0',
      'gray': '#808080',
      'grey': '#808080',
      'black': '#000000',
      'red': '#dc3545',
      'blue': '#007bff',
      'green': '#28a745',
      'yellow': '#ffc107',
      'orange': '#fd7e14',
      'purple': '#6f42c1',
      'brown': '#8b4513'
    };
    return colorMap[colorName.toLowerCase()] || '#6c757d';
  }

  function createVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'vehicle-card real-vehicle';
    card.setAttribute('data-vehicle-id', vehicle._id);
    card.setAttribute('data-type', vehicle.type);
    
    // Determine vehicle icon based on type
    const vehicleIcon = vehicle.type === 'bike' ? 'fas fa-motorcycle' : 'fas fa-car';
    
    // Format features - show top 3 features
    const topFeatures = vehicle.features && vehicle.features.length > 0 
      ? vehicle.features.slice(0, 3) 
      : ['Standard features'];
    
    // Format mileage
    const formattedMileage = vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/A';
    
    // Calculate price range for negotiation
    const basePrice = vehicle.dailyRate;
    const minPrice = Math.round(basePrice * 0.8); // 20% below
    const maxPrice = Math.round(basePrice * 1.2); // 20% above
    
    card.innerHTML = `
      <div class="vehicle-image">
        ${vehicle.imageUrl ? 
          `<img src="${vehicle.imageUrl}" alt="${vehicle.brand} ${vehicle.model}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : 
          ''
        }
        <div class="vehicle-icon-fallback" ${vehicle.imageUrl ? 'style="display:none"' : ''}>
          <i class="${vehicleIcon}"></i>
        </div>
      </div>
      
      <div class="vehicle-info">
        <div class="vehicle-header">
          <h3 class="vehicle-name">${vehicle.brand} ${vehicle.model}</h3>
          <div class="vehicle-year-color">
            <span class="vehicle-year">${vehicle.year}</span>
            <span class="color-dot" style="background-color: ${getColorCode(vehicle.color)}"></span>
            <span class="vehicle-color">${vehicle.color}</span>
          </div>
        </div>
        
        ${vehicle.description ? `
          <p class="vehicle-description">${vehicle.description}</p>
        ` : ''}
        
        <div class="vehicle-specs">
          <div class="spec-item">
            <i class="fas fa-users"></i>
            <span>${vehicle.seats} seats</span>
          </div>
          <div class="spec-item">
            <i class="fas fa-gas-pump"></i>
            <span>${vehicle.fuelType}</span>
          </div>
          <div class="spec-item">
            <i class="fas fa-cogs"></i>
            <span>${vehicle.transmission}</span>
          </div>
          <div class="spec-item">
            <i class="fas fa-tachometer-alt"></i>
            <span>${formattedMileage}</span>
          </div>
        </div>
        
        <div class="vehicle-features">
          <h4>Key Features</h4>
          <div class="features-list">
            ${topFeatures.map(feature => `
              <span class="feature-tag">
                <i class="fas fa-check"></i>
                ${feature}
              </span>
            `).join('')}
            ${vehicle.features && vehicle.features.length > 3 ? `
              <span class="feature-more">+${vehicle.features.length - 3} more</span>
            ` : ''}
          </div>
        </div>
        
        <div class="vehicle-pricing">
          <div class="price-main">
            <div class="price-daily">
              <span class="price-label">Daily Rate</span>
              <span class="price-amount">ETB ${vehicle.dailyRate}</span>
            </div>
            ${vehicle.hourlyRate ? `
              <div class="price-hourly">
                <span class="price-label">Hourly Rate</span>
                <span class="price-amount">ETB ${vehicle.hourlyRate}</span>
              </div>
            ` : ''}
          </div>
          <div class="price-negotiation">
            <span class="negotiation-label">Negotiable Range</span>
            <span class="negotiation-range">ETB ${minPrice} - ${maxPrice}</span>
          </div>
        </div>
        
        <div class="vehicle-location">
          <i class="fas fa-map-marker-alt"></i>
          <span>${vehicle.location}</span>
        </div>
      </div>
      
      <div class="vehicle-select">
        <i class="fas fa-check"></i>
      </div>
      
      <div class="vehicle-badge ${vehicle.isAvailable ? 'available' : 'unavailable'}">
        ${vehicle.isAvailable ? 'Available' : 'Unavailable'}
      </div>
    `;
    
    // Add click event for vehicle selection
    card.addEventListener('click', () => selectVehicle(vehicle, card));
    
    return card;
  }
  
  function selectVehicle(vehicle, cardElement) {
    // Only allow selection of available vehicles
    if (!vehicle.isAvailable) {
      showError('This vehicle is currently unavailable. Please select another vehicle.');
      return;
    }
    
    // Remove previous selection
    document.querySelectorAll('.vehicle-card.selected').forEach(card => {
      card.classList.remove('selected');
    });
    
    // Select current vehicle
    cardElement.classList.add('selected');
    selectedVehicle = vehicle;
    
    // Update price range display
    updatePriceRange(vehicle);
    
    // Update summary
    updateBookingSummary();
    
    console.log('Vehicle selected:', vehicle);
  }
  
  function updatePriceRange(vehicle) {
    const minPrice = document.querySelector('.min-price');
    const maxPrice = document.querySelector('.max-price');
    const rangeFill = document.querySelector('.range-fill');
    
    if (minPrice && maxPrice && rangeFill) {
      const dailyRate = vehicle.dailyRate;
      const minRate = Math.max(dailyRate * 0.8, 50); // 20% below daily rate, minimum 50
      const maxRate = dailyRate * 1.5; // 50% above daily rate
      
      minPrice.textContent = `ETB ${Math.round(minRate)}`;
      maxPrice.textContent = `ETB ${Math.round(maxRate)}`;
      
      // Update range fill (visual indicator)
      rangeFill.style.width = '60%'; // Show selected range
    }
  }

  // Make loadAvailableVehicles globally accessible
  window.loadAvailableVehicles = loadAvailableVehicles;

  // ============================================
  // 3. FORM SECTION NAVIGATION
  // ============================================

  const sections = document.querySelectorAll(".booking-section");
  const steps = document.querySelectorAll(".step");
  const nextButtons = document.querySelectorAll(".next-section");
  const prevButtons = document.querySelectorAll(".prev-section");
  const mobileFooter = document.querySelector(".mobile-booking-footer");
  const mobileConfirmBtn = document.querySelector(".confirm-mobile");

  // Initialize first section
  showSection("trip-section");
  updateProgress(1);
  updateMobileFooter();

  // Next button handlers
  nextButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const nextSection = button.dataset.next;

      // Validate current section before proceeding
      if (validateSection(currentSection)) {
        showSection(nextSection);
        updateProgress(getStepNumber(nextSection));
        updateMobileFooter();
      }
    });
  });

  // Previous button handlers
  prevButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const prevSection = button.dataset.prev;
      showSection(prevSection);
      updateProgress(getStepNumber(prevSection));
      updateMobileFooter();
    });
  });

  // Show specific section
  function showSection(sectionId) {
    sections.forEach((section) => {
      section.classList.remove("active");
      if (section.id === sectionId) {
        section.classList.add("active");
        currentSection = sectionId;
      }
    });

    // Load vehicles when vehicle section is shown
    if (sectionId === "vehicle-section" && availableVehicles.length === 0) {
      loadAvailableVehicles();
    }

    // Update summary if we're in summary section
    if (sectionId === "summary-section") {
      updateBookingSummary();
    }

    // Update map size when section changes
    setTimeout(() => {
      if (rideFairMap && rideFairMap.map) {
        rideFairMap.map.invalidateSize();
      }
    }, 300);
  }

  // Get step number from section
  function getStepNumber(sectionId) {
    const sectionMap = {
      "trip-section": 1,
      "vehicle-section": 2,
      "price-section": 3,
      "payment-section": 4,
      "summary-section": 5,
    };
    return sectionMap[sectionId] || 1;
  }

  // Update progress indicator
  function updateProgress(stepNumber) {
    steps.forEach((step, index) => {
      if (index + 1 <= stepNumber) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });
  }

  // Update mobile footer
  function updateMobileFooter() {
    if (!mobileFooter || !mobileConfirmBtn) return;

    const stepNumber = getStepNumber(currentSection);
    const isLastStep = stepNumber === 5;

    if (isLastStep) {
      mobileConfirmBtn.textContent = "Confirm Booking";
      mobileConfirmBtn.disabled = false;
    } else {
      mobileConfirmBtn.textContent = `Continue to Step ${stepNumber + 1}`;
      mobileConfirmBtn.disabled = !validateSection(currentSection);
    }
  }

  // ============================================
  // 4. FORM VALIDATION
  // ============================================

  function validateSection(sectionId) {
    switch (sectionId) {
      case "trip-section":
        const pickup = document.getElementById("pickup");
        const destination = document.getElementById("destination");

        if (!pickup || !destination) return false;
        
        if (!pickup.value.trim() || !destination.value.trim()) {
          showError("Please enter both pickup and destination locations");
          return false;
        }
        return true;

      case "vehicle-section":
        if (!selectedVehicle) {
          showError("Please select a vehicle before continuing");
          return false;
        }
        return true;

      case "price-section":
        // For now, always return true for price section
        return true;

      case "payment-section":
        const selectedPayment = document.querySelector(".payment-card.selected");
        if (!selectedPayment) {
          showError("Please select a payment method");
          return false;
        }
        return true;

      case "summary-section":
        // Validate all required fields for final booking
        const summaryPickup = document.getElementById("pickup");
        const summaryDestination = document.getElementById("destination");
        
        if (!summaryPickup || !summaryPickup.value.trim()) {
          showError("Pickup location is required");
          return false;
        }
        
        if (!summaryDestination || !summaryDestination.value.trim()) {
          showError("Destination is required");
          return false;
        }
        
        if (!selectedVehicle) {
          showError("Please select a vehicle");
          return false;
        }
        
        const selectedPaymentMethod = document.querySelector(".payment-card.selected");
        if (!selectedPaymentMethod) {
          showError("Please select a payment method");
          return false;
        }
        
        return true;

      default:
        return true;
    }
  }

  // ============================================
  // 5. BOOKING SUMMARY
  // ============================================

  function updateBookingSummary() {
    // Trip details
    const summaryPickup = document.getElementById("summaryPickup");
    const summaryDestination = document.getElementById("summaryDestination");
    const summaryNotes = document.getElementById("summaryNotes");
    const summaryDistance = document.getElementById("summaryDistance");
    const summaryTime = document.getElementById("summaryTime");

    if (summaryPickup) {
      summaryPickup.textContent = document.getElementById("pickup")?.value || "-";
    }
    if (summaryDestination) {
      summaryDestination.textContent = document.getElementById("destination")?.value || "-";
    }
    if (summaryNotes) {
      summaryNotes.textContent = document.getElementById("notes")?.value || "None";
    }

    // Map distance and time
    if (rideFairMap) {
      const tripData = rideFairMap.getTripData();
      if (summaryDistance) {
        summaryDistance.textContent = tripData.distance ? `${tripData.distance.toFixed(1)} km` : "-";
      }
      if (summaryTime) {
        summaryTime.textContent = tripData.time ? `${tripData.time} min` : "-";
      }
    }

    // Real vehicle details
    const summaryVehicle = document.getElementById("summaryVehicle");
    const summaryPriceRange = document.getElementById("summaryPriceRange");
    
    if (selectedVehicle) {
      if (summaryVehicle) {
        summaryVehicle.textContent = `${selectedVehicle.brand} ${selectedVehicle.model} (${selectedVehicle.year})`;
      }
      if (summaryPriceRange) {
        summaryPriceRange.textContent = `ETB ${selectedVehicle.dailyRate}/day`;
      }
    } else {
      if (summaryVehicle) summaryVehicle.textContent = "-";
      if (summaryPriceRange) summaryPriceRange.textContent = "-";
    }

    // Price details
    const finalPrice = agreedFinalPrice > 0 ? agreedFinalPrice : (selectedVehicle ? selectedVehicle.dailyRate : 0);
    const summaryPrice = document.getElementById("summaryPrice");
    const summaryTotal = document.getElementById("summaryTotal");
    const mobileTotal = document.getElementById("mobileTotal");

    if (summaryPrice) summaryPrice.textContent = `ETB ${finalPrice}`;
    if (summaryTotal) summaryTotal.textContent = `ETB ${finalPrice}`;
    if (mobileTotal) mobileTotal.textContent = `ETB ${finalPrice}`;

    // Payment details
    const selectedPaymentCard = document.querySelector(".payment-card.selected");
    const summaryPayment = document.getElementById("summaryPayment");
    
    if (selectedPaymentCard && summaryPayment) {
      const paymentName = selectedPaymentCard.querySelector("h3")?.textContent;
      summaryPayment.textContent = paymentName || "-";
    }

    // Wallet payment
    const summaryWallet = document.getElementById("summaryWallet");
    if (summaryWallet) {
      summaryWallet.textContent = walletPaymentConfirmed ? "Yes" : "No";
    }
  }

  // ============================================
  // DEBUG: Token Testing Function
  // ============================================
  
  // Add this function to test token validity
  window.testToken = async function() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    console.log('🧪 Testing Token...');
    console.log('Token exists:', !!token);
    console.log('UserData exists:', !!userData);
    
    if (token) {
      console.log('Token length:', token.length);
      console.log('Token format valid:', token.includes('.'));
      
      try {
        // Test with profile endpoint
        const response = await fetch('http://localhost:3000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Profile response status:', response.status);
        const result = await response.json();
        console.log('Profile response:', result);
        
        if (result.success) {
          console.log('✅ Token is valid!');
          return true;
        } else {
          console.log('❌ Token is invalid:', result.message);
          return false;
        }
      } catch (error) {
        console.log('❌ Token test error:', error);
        return false;
      }
    } else {
      console.log('❌ No token found');
      return false;
    }
  };

  // ============================================
  // 6. REAL API BOOKING SUBMISSION
  // ============================================

  const bookingForm = document.getElementById("bookingForm");
  const confirmationModal = document.getElementById("confirmationModal");
  const modalClose = document.getElementById("modalClose");
  const viewTripDetailsBtn = document.getElementById("viewTripDetails");

  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      console.log('🚀 Booking form submitted');

      // Final validation
      if (!validateSection("summary-section")) {
        console.log('❌ Summary section validation failed');
        return;
      }

      // Check terms agreement
      const agreeTerms = document.getElementById("agreeTerms");
      if (!agreeTerms || !agreeTerms.checked) {
        showError("Please agree to the Terms of Service");
        console.log('❌ Terms not agreed');
        return;
      }

      // Check authentication
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (!token || !userData) {
        showError('Please log in to complete your booking.');
        console.log('❌ User not authenticated');
        setTimeout(() => {
          window.location.href = 'auth.html';
        }, 2000);
        return;
      }

      // Debug: Log token info
      console.log('🔍 Debug - Token length:', token.length);
      console.log('🔍 Debug - Token starts with:', token.substring(0, 20) + '...');
      
      // Validate token format
      if (!token.includes('.')) {
        showError('Invalid token format. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setTimeout(() => {
          window.location.href = 'auth.html';
        }, 2000);
        return;
      }

      const user = JSON.parse(userData);
      console.log('✅ User authenticated:', user.firstName, user.lastName);
      
      // Validate token by testing it with the profile endpoint
      try {
        console.log('🔍 Validating token with profile endpoint...');
        const profileResponse = await fetch('http://localhost:3000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!profileResponse.ok) {
          const profileError = await profileResponse.json();
          console.log('❌ Token validation failed:', profileError);
          throw new Error(`Token validation failed: ${profileError.message}`);
        }
        
        const profileData = await profileResponse.json();
        console.log('✅ Token validated successfully:', profileData.data.firstName);
      } catch (tokenError) {
        console.error('❌ Token validation error:', tokenError);
        showError('Your session has expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setTimeout(() => {
          window.location.href = 'auth.html';
        }, 2000);
        return;
      }
      
      // Show loading state
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Booking...';
      submitBtn.disabled = true;

      try {
        // Get selected vehicle ID
        const vehicleId = await getSelectedVehicleId();
        if (!vehicleId) {
          throw new Error('Please select a vehicle');
        }
        
        console.log('✅ Vehicle selected:', selectedVehicle.brand, selectedVehicle.model);

        // Prepare booking data
        const bookingData = {
          userId: user._id,
          vehicleId: vehicleId,
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          startTime: '09:00',
          endTime: '18:00',
          pickupLocation: document.getElementById('pickup')?.value || '',
          dropoffLocation: document.getElementById('destination')?.value || '',
          specialRequests: document.getElementById('notes')?.value || ''
        };
        
        console.log('📋 Booking data prepared:', bookingData);

        // Send booking request to backend
        const response = await fetch('http://localhost:3000/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bookingData)
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

        const result = await response.json();
        console.log('📡 API Response:', result);

        if (result.success) {
          // Store booking info
          localStorage.setItem('currentBooking', JSON.stringify(result.data));
          
          // Show confirmation modal
          updateConfirmationModal(result.data);
          if (confirmationModal) {
            confirmationModal.classList.add("active");
            document.body.style.overflow = "hidden";
            
            // Log success for debugging
            console.log('✅ Booking created successfully:', result.data);
            console.log('📋 Confirmation modal should be visible now');
          } else {
            console.error('❌ Confirmation modal element not found');
            // Fallback: show success message and redirect
            showSuccess('Booking confirmed! Redirecting to My Rides...');
            setTimeout(() => {
              window.location.href = 'my-rides.html';
            }, 2000);
          }
        } else {
          throw new Error(result.message || 'Booking failed. Please try again.');
        }
      } catch (error) {
        console.error('Booking error:', error);
        showError(error.message || 'Connection error. Please check if the server is running and try again.');
      } finally {
        // Reset button
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }
    });
  }

  // Get selected vehicle ID
  async function getSelectedVehicleId() {
    if (selectedVehicle && selectedVehicle._id) {
      return selectedVehicle._id;
    }
    
    // If no vehicle selected, show error
    showError('Please select a vehicle before booking.');
    return null;
  }

  // Update confirmation modal with real booking data
  function updateConfirmationModal(bookingData) {
    // Update driver info (mock data for now)
    const driverName = document.querySelector('.driver-details h4');
    const driverRating = document.querySelector('.driver-rating span');
    const vehiclePlate = document.querySelector('.vehicle-plate span');
    
    if (driverName) driverName.textContent = 'Alex'; // Mock driver
    if (driverRating) driverRating.textContent = '4.98';
    if (vehiclePlate) vehiclePlate.textContent = '3-A-12345';
    
    // Update booking details in modal
    const confirmationMessage = document.querySelector('.confirmation-message');
    if (confirmationMessage) {
      confirmationMessage.innerHTML = `
        Your ride has been confirmed! 
        <br><strong>Booking ID:</strong> ${bookingData._id}
        <br><strong>Total:</strong> ETB ${bookingData.totalAmount}
        <br>A driver will arrive shortly.
      `;
    }
  }

  // Modal event handlers
  if (modalClose) {
    modalClose.addEventListener("click", () => {
      if (confirmationModal) {
        confirmationModal.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });
  }

  if (viewTripDetailsBtn) {
    viewTripDetailsBtn.addEventListener("click", () => {
      if (confirmationModal) {
        confirmationModal.classList.remove("active");
        document.body.style.overflow = "auto";
      }
      // Redirect to My Rides page
      window.location.href = 'my-rides.html';
    });
  }

  // Close modal when clicking outside
  if (confirmationModal) {
    confirmationModal.addEventListener("click", (e) => {
      if (e.target === confirmationModal) {
        confirmationModal.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });
  }

  // ============================================
  // 7. NEGOTIATION SYSTEM
  // ============================================

  // Negotiation elements
  const proposedPriceInput = document.getElementById('proposedPrice');
  const sendOfferBtn = document.querySelector('.send-offer');
  const driverResponse = document.getElementById('driverResponse');
  const counterOffer = document.getElementById('counterOffer');
  const agreedPrice = document.getElementById('agreedPrice');
  const counterAmount = document.getElementById('counterAmount');
  const counterDisplay = document.getElementById('counterDisplay');
  const finalAmount = document.getElementById('finalAmount');
  const acceptOfferBtn = document.querySelector('.accept-offer');
  const rejectOfferBtn = document.querySelector('.reject-offer');

  let negotiationState = 'initial'; // initial, offer_sent, counter_received, agreed
  let currentNegotiationPrice = 0;
  let agreedFinalPrice = 0;

  // Update proposed price based on selected vehicle
  function updateProposedPrice(vehicle) {
    if (proposedPriceInput && vehicle) {
      const basePrice = vehicle.dailyRate;
      const suggestedPrice = Math.round(basePrice * 0.9); // Start 10% below asking price
      proposedPriceInput.value = suggestedPrice;
      proposedPriceInput.min = Math.round(basePrice * 0.7); // Minimum 30% below
      proposedPriceInput.max = Math.round(basePrice * 1.3); // Maximum 30% above
    }
  }

  // Send offer to drivers (simulation)
  if (sendOfferBtn) {
    sendOfferBtn.addEventListener('click', async () => {
      const proposedPrice = parseInt(proposedPriceInput.value);
      
      if (!selectedVehicle) {
        showError('Please select a vehicle first');
        return;
      }

      if (!proposedPrice || proposedPrice < 50) {
        showError('Please enter a valid price offer');
        return;
      }

      // Show loading state
      const originalText = sendOfferBtn.innerHTML;
      sendOfferBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Offer...';
      sendOfferBtn.disabled = true;

      // Simulate sending offer to drivers
      await simulateDriverResponse(proposedPrice);

      // Reset button
      sendOfferBtn.innerHTML = originalText;
      sendOfferBtn.disabled = false;
    });
  }

  // Simulate driver response to price negotiation
  async function simulateDriverResponse(proposedPrice) {
    const basePrice = selectedVehicle.dailyRate;
    const priceRatio = proposedPrice / basePrice;

    // Show "searching for drivers" message
    driverResponse.innerHTML = `
      <div class="searching-drivers">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Sending your offer to nearby drivers...</p>
      </div>
    `;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Determine driver response based on price ratio
    if (priceRatio >= 0.95) {
      // Price is close to asking price - accept immediately
      acceptOfferImmediately(proposedPrice);
    } else if (priceRatio >= 0.8) {
      // Price is reasonable - make counter offer
      makeCounterOffer(proposedPrice, basePrice);
    } else if (priceRatio >= 0.7) {
      // Price is low but negotiable - make higher counter offer
      makeCounterOffer(proposedPrice, basePrice, true);
    } else {
      // Price is too low - reject
      rejectOfferCompletely(proposedPrice, basePrice);
    }
  }

  // Accept offer immediately
  function acceptOfferImmediately(price) {
    negotiationState = 'agreed';
    agreedFinalPrice = price;
    
    driverResponse.innerHTML = `
      <div class="driver-accepted">
        <i class="fas fa-check-circle" style="color: #10b981;"></i>
        <p><strong>Great news!</strong> Driver accepted your offer of ETB ${price}</p>
        <small>Your price was fair and competitive</small>
      </div>
    `;

    showAgreedPrice(price);
    updateTelebirrAmount(price);
    showSuccess(`Driver accepted your offer of ETB ${price}!`);
  }

  // Make counter offer
  function makeCounterOffer(proposedPrice, basePrice, isLowOffer = false) {
    negotiationState = 'counter_received';
    
    // Calculate counter offer
    let counterPrice;
    if (isLowOffer) {
      // If offer was low, counter closer to base price
      counterPrice = Math.round(basePrice * 0.9);
    } else {
      // If offer was reasonable, meet in the middle
      counterPrice = Math.round((proposedPrice + basePrice) / 2);
    }
    
    currentNegotiationPrice = counterPrice;
    
    const driverName = getRandomDriverName();
    const responseMessage = isLowOffer 
      ? `Your offer is a bit low for this vehicle. How about we meet at ETB ${counterPrice}?`
      : `I can do ETB ${counterPrice} for this trip. Fair deal?`;

    driverResponse.innerHTML = `
      <div class="driver-counter">
        <div class="driver-avatar">${driverName.charAt(0)}</div>
        <div class="driver-message">
          <strong>${driverName}</strong>
          <p>${responseMessage}</p>
          <small>⭐ 4.8 rating • 2.5km away</small>
        </div>
      </div>
    `;

    // Show counter offer section
    counterAmount.textContent = counterPrice;
    counterDisplay.textContent = counterPrice;
    counterOffer.classList.remove('hidden');
  }

  // Reject offer completely
  function rejectOfferCompletely(proposedPrice, basePrice) {
    const minAcceptable = Math.round(basePrice * 0.8);
    
    driverResponse.innerHTML = `
      <div class="driver-rejected">
        <i class="fas fa-times-circle" style="color: #ef4444;"></i>
        <p><strong>No drivers available</strong> at ETB ${proposedPrice}</p>
        <p>Try offering at least ETB ${minAcceptable} for this vehicle</p>
        <button class="btn btn-outline btn-sm" onclick="suggestBetterPrice(${minAcceptable})">
          <i class="fas fa-lightbulb"></i> Suggest ETB ${minAcceptable}
        </button>
      </div>
    `;
  }

  // Suggest better price
  window.suggestBetterPrice = function(suggestedPrice) {
    proposedPriceInput.value = suggestedPrice;
    driverResponse.innerHTML = `
      <p style="color: #6b7280;">Price updated to ETB ${suggestedPrice}. Click "Send Offer" to try again.</p>
    `;
  };

  // Accept counter offer
  if (acceptOfferBtn) {
    acceptOfferBtn.addEventListener('click', () => {
      negotiationState = 'agreed';
      agreedFinalPrice = currentNegotiationPrice;
      
      counterOffer.classList.add('hidden');
      showAgreedPrice(currentNegotiationPrice);
      updateTelebirrAmount(currentNegotiationPrice);
      showSuccess(`Price agreed at ETB ${currentNegotiationPrice}!`);
    });
  }

  // Reject counter offer
  if (rejectOfferBtn) {
    rejectOfferBtn.addEventListener('click', () => {
      counterOffer.classList.add('hidden');
      
      driverResponse.innerHTML = `
        <div class="negotiation-ended">
          <i class="fas fa-handshake-slash" style="color: #f59e0b;"></i>
          <p>Counter offer declined. You can make a new offer or try a different price.</p>
          <small>Tip: Most drivers accept offers within 20% of the listed price</small>
        </div>
      `;
      
      negotiationState = 'initial';
    });
  }

  // Show agreed price
  function showAgreedPrice(price) {
    finalAmount.textContent = price;
    agreedPrice.classList.remove('hidden');
    
    // Update booking summary
    updateBookingSummary();
  }

  // Get random driver name for realism
  function getRandomDriverName() {
    const names = ['Ahmed', 'Meron', 'Dawit', 'Sara', 'Yonas', 'Hanan', 'Bekele', 'Tigist'];
    return names[Math.floor(Math.random() * names.length)];
  }

  // Update negotiation when vehicle is selected
  const originalSelectVehicleForNegotiation = selectVehicle;
  selectVehicle = function(vehicle, cardElement) {
    originalSelectVehicleForNegotiation(vehicle, cardElement);
    updateProposedPrice(vehicle);
    updateTelebirrAmount(vehicle.dailyRate);
    
    // Reset negotiation state
    negotiationState = 'initial';
    agreedFinalPrice = 0;
    if (counterOffer) counterOffer.classList.add('hidden');
    if (agreedPrice) agreedPrice.classList.add('hidden');
    if (driverResponse) {
      driverResponse.innerHTML = '<p data-key="send_offer_message">Send your offer to see driver responses</p>';
    }
  };

  // ============================================
  // 8. UTILITY FUNCTIONS
  // ============================================

  // Show error message
  function showError(message) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.booking-error');
    existingErrors.forEach(error => error.remove());

    // Create new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'booking-error';
    errorDiv.style.cssText = `
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: #ef4444;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 90%;
      animation: slideIn 0.3s ease;
    `;
    
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (errorDiv && errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  // Show success message
  function showSuccess(message) {
    // Remove existing success messages
    const existingSuccess = document.querySelectorAll('.booking-success');
    existingSuccess.forEach(success => success.remove());

    // Create new success message
    const successDiv = document.createElement('div');
    successDiv.className = 'booking-success';
    successDiv.style.cssText = `
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: #10b981;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 90%;
      animation: slideIn 0.3s ease;
    `;
    
    successDiv.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      if (successDiv && successDiv.parentNode) {
        successDiv.remove();
      }
    }, 3000);
  }

  // ============================================
  // 8. UTILITY FUNCTIONS
  // ============================================

  // TeleBirr payment integration
  const telebirrPaymentBtn = document.getElementById('initiateTelebirrPayment');
  const telebirrPhoneInput = document.getElementById('telebirrPhone');
  const telebirrAmountDisplay = document.getElementById('telebirrAmount');
  const telebirrStatus = document.getElementById('telebirrStatus');

  // Update TeleBirr amount when vehicle is selected
  function updateTelebirrAmount(amount) {
    if (telebirrAmountDisplay) {
      telebirrAmountDisplay.textContent = amount.toFixed(2);
    }
  }

  // TeleBirr payment initiation (Frontend Demo Only)
  if (telebirrPaymentBtn) {
    telebirrPaymentBtn.addEventListener('click', async () => {
      const phoneNumber = telebirrPhoneInput.value.trim();
      const amount = parseFloat(telebirrAmountDisplay.textContent);

      // Validate phone number
      if (!phoneNumber) {
        showError('Please enter your TeleBirr phone number');
        return;
      }

      const phoneRegex = /^(09|07)\d{8}$/;
      if (!phoneRegex.test(phoneNumber)) {
        showError('Please enter a valid Ethiopian phone number (09XXXXXXXX or 07XXXXXXXX)');
        return;
      }

      // Check if vehicle is selected
      if (!selectedVehicle) {
        showError('Please select a vehicle first');
        return;
      }

      // Show loading state
      const originalText = telebirrPaymentBtn.innerHTML;
      telebirrPaymentBtn.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <span>Processing Payment...</span>
      `;
      telebirrPaymentBtn.disabled = true;
      telebirrPaymentBtn.classList.add('processing');

      try {
        // FRONTEND SIMULATION: Simulate payment processing
        console.log('🎭 TeleBirr Payment Processing...');
        
        // Simulate network delay (2-3 seconds)
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Generate demo transaction data
        const demoPaymentData = {
          transactionRef: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          status: 'SUCCESS',
          amount: amount,
          currency: 'ETB',
          phoneNumber: phoneNumber,
          timestamp: new Date().toISOString(),
          description: `RideFair - ${selectedVehicle.brand} ${selectedVehicle.model}`
        };

        // TeleBirr payment processing - works with any valid Ethiopian phone number
        showTelebirrSuccess(demoPaymentData);
        
        // Update status
        telebirrStatus.innerHTML = `
          <span class="status-text" style="color: #00ff41;">
            <i class="fas fa-check-circle"></i> Payment Successful
          </span>
        `;

        console.log('✅ TeleBirr Payment Success:', demoPaymentData);

      } catch (error) {
        console.error('TeleBirr Payment Error:', error);
        showError('Payment Failed: ' + error.message);
        
        telebirrStatus.innerHTML = `
          <span class="status-text" style="color: #d32f2f;">
            <i class="fas fa-exclamation-circle"></i> Payment Failed
          </span>
        `;
      } finally {
        // Reset button
        telebirrPaymentBtn.innerHTML = originalText;
        telebirrPaymentBtn.disabled = false;
        telebirrPaymentBtn.classList.remove('processing');
      }
    });
  }

  // Show TeleBirr success modal (Demo Mode)
  function showTelebirrSuccess(paymentData) {
    // Create success modal
    const modal = document.createElement('div');
    modal.className = 'telebirr-success-modal active';
    modal.innerHTML = `
      <div class="telebirr-success-content">
        <div class="success-icon">
          <i class="fas fa-check"></i>
        </div>
        <h3 class="success-title">Payment Successful!</h3>
        <p class="success-message">Your TeleBirr payment has been processed successfully.</p>
        
        <div class="transaction-details">
          <div class="transaction-row">
            <span>Transaction ID:</span>
            <span>${paymentData.transactionRef}</span>
          </div>
          <div class="transaction-row">
            <span>Amount:</span>
            <span>ETB ${paymentData.amount.toFixed(2)}</span>
          </div>
          <div class="transaction-row">
            <span>Phone:</span>
            <span>${paymentData.phoneNumber}</span>
          </div>
          <div class="transaction-row">
            <span>Status:</span>
            <span style="color: #00ff41;">COMPLETED</span>
          </div>
        </div>
        
        <button class="btn btn-primary" onclick="closeTelebirrModal()">
          Continue to Confirmation
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    // Auto-close after 5 seconds and proceed to next step
    setTimeout(() => {
      closeTelebirrModal();
      // Move to next section
      showSection('summary-section');
      updateProgress(5);
    }, 5000);
  }

  // Close TeleBirr modal and proceed to next step
  window.closeTelebirrModal = function() {
    const modal = document.querySelector('.telebirr-success-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    }
    
    // Move to next section (summary/confirmation)
    showSection('summary-section');
    updateProgress(5);
    updateBookingSummary();
  };

  // Update TeleBirr amount when vehicle is selected
  const originalSelectVehicle = selectVehicle;
  selectVehicle = function(vehicle, cardElement) {
    originalSelectVehicle(vehicle, cardElement);
    updateTelebirrAmount(vehicle.dailyRate);
  };

  // ============================================
  // 9. TELEBIRR DEMO PAYMENT SYSTEM
  // ============================================

  // Payment method selection
  const paymentCards = document.querySelectorAll('.payment-card');
  paymentCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove previous selection
      paymentCards.forEach(c => c.classList.remove('selected'));
      // Select current card
      card.classList.add('selected');
      // Update summary
      updateBookingSummary();
    });
  });

  // Wallet toggle
  const walletToggle = document.getElementById('walletToggle');
  const walletDetails = document.getElementById('walletDetails');
  
  if (walletToggle && walletDetails) {
    walletToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        walletDetails.classList.remove('hidden');
      } else {
        walletDetails.classList.add('hidden');
        walletPaymentConfirmed = false;
      }
    });
  }

  // Wallet confirmation
  const confirmWalletBtn = document.querySelector('.confirm-wallet');
  if (confirmWalletBtn) {
    confirmWalletBtn.addEventListener('click', () => {
      walletPaymentConfirmed = true;
      showSuccess('Wallet payment confirmed!');
      updateBookingSummary();
    });
  }

  // ============================================
  // 10. PAYMENT SYSTEM HANDLERS (Updated for TeleBirr Demo)
  // ============================================

  window.addEventListener("resize", () => {
    updateMobileFooter();
    // Update map size on resize
    if (rideFairMap && rideFairMap.map) {
      setTimeout(() => {
        rideFairMap.map.invalidateSize();
      }, 300);
    }
  });

  // ============================================
  // 11. RESPONSIVE BEHAVIOR
  // ============================================

  // Initialize mobile footer
  updateMobileFooter();

  console.log('✨ RideFair Booking page loaded successfully!');
});

// Add CSS animation for messages
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;
document.head.appendChild(style);