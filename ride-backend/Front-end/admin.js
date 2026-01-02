// ============================================
// ENHANCED ADMIN DASHBOARD - JavaScript
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // ============================================
  // 1. CHECK FOR EXISTING AUTHENTICATION
  // ============================================
  
  // Check if user is already logged in
  const existingToken = localStorage.getItem('adminToken');
  const existingUser = localStorage.getItem('adminUser');
  
  if (existingToken && existingUser) {
    console.log('🔍 Found existing admin session, verifying...');
    verifyExistingToken(existingToken);
  } else {
    // Show login modal if not authenticated
    document.getElementById('adminLoginModal').style.display = 'flex';
  }

  // ============================================
  // 2. ADMIN LOGIN SYSTEM
  // ============================================
  
  const ADMIN_EMAIL = 'admin@ridefair.com';
  const ADMIN_PASSWORD = 'RideFair2024!';
  
  // Handle login form
  const loginForm = document.getElementById('adminLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('adminEmail').value;
      const password = document.getElementById('adminPassword').value;
      const errorDiv = document.getElementById('loginError');
      const submitBtn = e.target.querySelector('button[type="submit"]');
      
      // Show loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      submitBtn.disabled = true;
      errorDiv.style.display = 'none';
      
      try {
        console.log('🔐 Attempting admin login...');
        
        const response = await fetch('http://localhost:3000/api/admin/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Store JWT token and user info
          localStorage.setItem('adminToken', data.data.token);
          localStorage.setItem('adminUser', JSON.stringify(data.data.user));
          
          console.log('✅ Admin login successful:', data.data.user.name);
          
          // Show success message briefly
          submitBtn.innerHTML = '<i class="fas fa-check"></i> Login Successful!';
          submitBtn.style.background = '#28a745';
          
          // Wait a moment then redirect to dashboard
          setTimeout(() => {
            // Hide login modal
            document.getElementById('adminLoginModal').style.display = 'none';
            // Show dashboard
            document.getElementById('adminDashboard').style.display = 'flex';
            // Initialize dashboard with real data
            initializeDashboard();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 1000);
          
        } else {
          throw new Error(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('❌ Login error:', error);
        
        // Show error message
        errorDiv.textContent = error.message.includes('fetch') ? 
          'Connection error. Please check if the server is running.' : 
          error.message;
        errorDiv.style.display = 'block';
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // ============================================
  // 3. TOKEN VERIFICATION
  // ============================================
  
  async function verifyExistingToken(token) {
    try {
      const response = await fetch('http://localhost:3000/api/admin/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Existing token valid, logging in automatically');
        // Hide login modal and show dashboard
        document.getElementById('adminLoginModal').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'flex';
        // Initialize dashboard
        initializeDashboard();
      } else {
        console.log('❌ Existing token invalid, showing login');
        // Clear invalid token
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        // Show login modal
        document.getElementById('adminLoginModal').style.display = 'flex';
      }
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      // Clear invalid token and show login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      document.getElementById('adminLoginModal').style.display = 'flex';
    }
  }

  // ============================================
  // 2. DASHBOARD INITIALIZATION
  // ============================================
  
  function initializeDashboard() {
    console.log('🚀 Initializing enhanced admin dashboard...');
    
    // Load real data from backend
    loadDashboardStats();
    loadVehiclesData();
    loadUsersData();
    loadBookingsData();
    loadActivityData();
    
    // Setup navigation and interactions
    setupNavigation();
    setupVehicleManagement();
    
    console.log('✅ Enhanced dashboard initialized!');
  }

  // ============================================
  // 3. NAVIGATION
  // ============================================
  
  function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        showSection(section);
      });
    });
  }

  function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
      section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
      targetSection.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[data-section="${sectionName}"]`)?.parentElement;
    if (activeNavItem) {
      activeNavItem.classList.add('active');
    }
    
    // Load section-specific data
    if (sectionName === 'vehicles') {
      renderVehiclesTable();
    } else if (sectionName === 'users') {
      renderUsersTable();
    } else if (sectionName === 'bookings') {
      renderBookingsTable();
    }
  }

  // ============================================
  // 4. DASHBOARD STATS (REAL DATA)
  // ============================================
  
  // Helper function to get auth headers
  function getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      console.warn('⚠️ No admin token found, redirecting to login');
      showLoginModal();
      return null;
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Function to show login modal
  function showLoginModal() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminLoginModal').style.display = 'flex';
  }

  // Function to logout
  function logout() {
    console.log('🚪 Admin logging out');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminLoginModal').style.display = 'flex';
    showNotification('Logged out successfully', 'info');
  }

  async function loadDashboardStats() {
    const authHeaders = getAuthHeaders();
    if (!authHeaders) return;

    try {
      console.log('📊 Loading dashboard statistics from MongoDB...');
      const response = await fetch('http://localhost:3000/api/admin/stats', {
        headers: authHeaders
      });
      
      if (response.status === 401) {
        showLoginModal();
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Real stats loaded from database:', data.data);
        // Update counters with real data from MongoDB
        updateCounter('totalRides', data.data.totalRides);
        updateCounter('activeDrivers', data.data.totalDrivers);
        updateCounter('availableVehicles', data.data.availableVehicles);
        updateCounter('todayBookings', data.data.todayRides);
      } else {
        throw new Error(data.message || 'Failed to load stats');
      }
    } catch (error) {
      console.error('❌ Error loading stats from database:', error);
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        showLoginModal();
        return;
      }
      showNotification('Failed to connect to database. Please check backend connection.', 'error');
      
      // Show zero values instead of demo data
      updateCounter('totalRides', 0);
      updateCounter('activeDrivers', 0);
      updateCounter('availableVehicles', 0);
      updateCounter('todayBookings', 0);
    }
  }

  function updateCounter(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      // Animate counter
      let current = 0;
      const increment = value / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          current = value;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current);
      }, 20);
    }
  }

  // ============================================
  // 5. VEHICLES MANAGEMENT (REAL DATA + CRUD)
  // ============================================
  
  let vehiclesData = [];

  async function loadVehiclesData() {
    const authHeaders = getAuthHeaders();
    if (!authHeaders) return;

    try {
      console.log('🚗 Loading vehicles from MongoDB...');
      const response = await fetch('http://localhost:3000/api/admin/vehicles', {
        headers: authHeaders
      });
      
      if (response.status === 401) {
        showLoginModal();
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        vehiclesData = data.data.map(vehicle => ({
          id: vehicle._id,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          type: vehicle.type,
          plateNumber: vehicle.plateNumber || 'N/A',
          driver: vehicle.driver || 'Unassigned',
          status: vehicle.isAvailable ? 'active' : 'inactive',
          dailyRate: vehicle.dailyRate,
          color: vehicle.color,
          totalRides: vehicle.totalRides || 0,
          lastMaintenance: vehicle.lastMaintenance
        }));
        
        console.log(`✅ Loaded ${vehiclesData.length} real vehicles from MongoDB`);
      } else {
        throw new Error(data.message || 'Failed to load vehicles');
      }
    } catch (error) {
      console.error('❌ Error loading vehicles from database:', error);
      showNotification('Failed to load vehicles from database. Please check backend connection.', 'error');
      
      // Set empty array instead of demo data
      vehiclesData = [];
    }
  }

  function renderVehiclesTable() {
    const tableBody = document.getElementById('vehiclesTableBody');
    if (!tableBody) return;
    
    if (vehiclesData.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: #6b7280;">
            <i class="fas fa-car" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
            <p>No vehicles found in database</p>
            <small>Add vehicles using the "Add New Vehicle" button above</small>
          </td>
        </tr>
      `;
      return;
    }
    
    tableBody.innerHTML = vehiclesData.map(vehicle => `
      <tr>
        <td>
          <div class="vehicle-info">
            <div class="vehicle-avatar">
              <i class="fas fa-car"></i>
            </div>
            <div class="vehicle-details">
              <h4>${vehicle.brand} ${vehicle.model}</h4>
              <p>${vehicle.year} • ${vehicle.color}</p>
            </div>
          </div>
        </td>
        <td>${vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}</td>
        <td>${vehicle.plateNumber}</td>
        <td>${vehicle.driver}</td>
        <td>
          <span class="status-badge ${vehicle.status}">${vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}</span>
        </td>
        <td>ETB ${vehicle.dailyRate}</td>
        <td>
          <div class="table-actions">
            <button class="action-btn-sm edit" onclick="editVehicle('${vehicle.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn-sm delete" onclick="deleteVehicle('${vehicle.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function setupVehicleManagement() {
    // Add vehicle form handler
    const addVehicleForm = document.getElementById('addVehicleForm');
    if (addVehicleForm) {
      addVehicleForm.addEventListener('submit', handleAddVehicle);
    }

    // Edit vehicle form handler
    const editVehicleForm = document.getElementById('editVehicleForm');
    if (editVehicleForm) {
      editVehicleForm.addEventListener('submit', handleEditVehicle);
    }
  }

  async function handleEditVehicle(e) {
    e.preventDefault();
    
    const vehicleId = document.getElementById('editVehicleId').value;
    const vehicleData = {
      brand: document.getElementById('editVehicleBrand').value,
      model: document.getElementById('editVehicleModel').value,
      year: parseInt(document.getElementById('editVehicleYear').value),
      type: document.getElementById('editVehicleType').value,
      color: document.getElementById('editVehicleColor').value,
      seats: parseInt(document.getElementById('editVehicleSeats').value),
      dailyRate: parseInt(document.getElementById('editVehicleRate').value),
      plateNumber: document.getElementById('editVehiclePlate').value,
      isAvailable: document.getElementById('editVehicleStatus').value === 'true'
    };
    
    try {
      console.log('✏️ Updating vehicle:', vehicleData);
      
      const authHeaders = getAuthHeaders();
      if (!authHeaders) return;

      const response = await fetch(`http://localhost:3000/api/admin/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(vehicleData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showNotification('Vehicle updated successfully!', 'success');
        closeModal('editVehicleModal');
        // Reload vehicles data
        await loadVehiclesData();
        renderVehiclesTable();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('❌ Error updating vehicle:', error);
      showNotification('Failed to update vehicle: ' + error.message, 'error');
    }
  }

  async function handleAddVehicle(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const vehicleData = {
      brand: formData.get('vehicleBrand') || document.getElementById('vehicleBrand').value,
      model: formData.get('vehicleModel') || document.getElementById('vehicleModel').value,
      year: parseInt(formData.get('vehicleYear') || document.getElementById('vehicleYear').value),
      type: formData.get('vehicleType') || document.getElementById('vehicleType').value,
      color: formData.get('vehicleColor') || document.getElementById('vehicleColor').value,
      seats: parseInt(formData.get('vehicleSeats') || document.getElementById('vehicleSeats').value),
      dailyRate: parseInt(formData.get('vehicleRate') || document.getElementById('vehicleRate').value),
      plateNumber: formData.get('vehiclePlate') || document.getElementById('vehiclePlate').value,
      fuelType: 'Gasoline',
      transmission: 'Manual'
    };
    
    try {
      console.log('➕ Adding new vehicle:', vehicleData);
      
      const response = await fetch('http://localhost:3000/api/admin/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehicleData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showNotification('Vehicle added successfully!', 'success');
        closeModal('addVehicleModal');
        e.target.reset();
        // Reload vehicles data
        await loadVehiclesData();
        renderVehiclesTable();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('❌ Error adding vehicle:', error);
      showNotification('Failed to add vehicle: ' + error.message, 'error');
    }
  }

  // ============================================
  // 6. USERS MANAGEMENT (REAL DATA)
  // ============================================
  
  let usersData = [];

  async function loadUsersData() {
    const authHeaders = getAuthHeaders();
    if (!authHeaders) return;

    try {
      console.log('👥 Loading users from MongoDB...');
      const response = await fetch('http://localhost:3000/api/admin/users', {
        headers: authHeaders
      });
      
      if (response.status === 401) {
        showLoginModal();
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        usersData = data.data.map(user => ({
          id: user._id,
          name: user.name || `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || 'N/A',
          totalBookings: user.totalBookings || 0,
          completedBookings: user.completedBookings || 0,
          status: user.status || (user.isActive ? 'active' : 'inactive'),
          joinDate: user.createdAt || user.joinDate,
          role: user.role || 'user'
        }));
        console.log(`✅ Loaded ${usersData.length} real users from MongoDB`);
      } else {
        throw new Error(data.message || 'Failed to load users');
      }
    } catch (error) {
      console.error('❌ Error loading users from database:', error);
      showNotification('Failed to load users from database. Please check backend connection.', 'error');
      
      // Set empty array instead of demo data
      usersData = [];
    }
  }

  function renderUsersTable() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;
    
    if (usersData.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 40px; color: #6b7280;">
            <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
            <p>No users found in database</p>
            <small>Users will appear here when they register on your platform</small>
          </td>
        </tr>
      `;
      return;
    }
    
    tableBody.innerHTML = usersData.map(user => `
      <tr>
        <td>
          <div class="user-info">
            <div class="user-avatar">
              ${user.name.charAt(0).toUpperCase()}
            </div>
            <div class="user-details">
              <h4>${user.name}</h4>
              <p>${user.email}</p>
            </div>
          </div>
        </td>
        <td>${user.phone}</td>
        <td>${user.totalBookings}</td>
        <td>
          <span class="status-badge ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
        </td>
        <td>${new Date(user.joinDate).toLocaleDateString()}</td>
        <td>
          <div class="table-actions">
            <button class="action-btn-sm edit" onclick="viewUserDetails('${user.id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn-sm ${user.status === 'active' ? 'delete' : 'edit'}" onclick="toggleUserStatus('${user.id}', '${user.status}')">
              <i class="fas fa-${user.status === 'active' ? 'ban' : 'check'}"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ============================================
  // 7. BOOKINGS MANAGEMENT (REAL DATA)
  // ============================================
  
  let bookingsData = [];

  async function loadBookingsData() {
    const authHeaders = getAuthHeaders();
    if (!authHeaders) return;

    try {
      console.log('📅 Loading bookings from MongoDB...');
      const response = await fetch('http://localhost:3000/api/admin/rides', {
        headers: authHeaders
      });
      
      if (response.status === 401) {
        showLoginModal();
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        bookingsData = data.data.map(booking => ({
          id: booking._id,
          bookingId: booking._id.substring(0, 8) + '...',
          user: booking.user ? {
            name: `${booking.user.firstName} ${booking.user.lastName}`,
            email: booking.user.email,
            phone: booking.user.phone
          } : { name: 'Unknown User', email: 'N/A', phone: 'N/A' },
          vehicle: booking.vehicle ? {
            name: `${booking.vehicle.brand} ${booking.vehicle.model}`,
            plateNumber: booking.vehicle.plateNumber,
            type: booking.vehicle.type
          } : { name: 'Unknown Vehicle', plateNumber: 'N/A', type: 'N/A' },
          totalAmount: booking.totalAmount || 0,
          status: booking.status || 'pending',
          startDate: booking.startDate,
          endDate: booking.endDate,
          pickupLocation: booking.pickupLocation,
          dropoffLocation: booking.dropoffLocation,
          createdAt: booking.createdAt,
          paymentStatus: booking.paymentStatus || 'pending',
          duration: booking.duration || 0
        }));
        console.log(`✅ Loaded ${bookingsData.length} real bookings from MongoDB`);
      } else {
        throw new Error(data.message || 'Failed to load bookings');
      }
    } catch (error) {
      console.error('❌ Error loading bookings from database:', error);
      showNotification('Failed to load bookings from database. Please check backend connection.', 'error');
      
      // Set empty array instead of demo data
      bookingsData = [];
    }
  }

  function renderBookingsTable() {
    const tableBody = document.getElementById('bookingsTableBody');
    if (!tableBody) return;
    
    if (bookingsData.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: #6b7280;">
            <i class="fas fa-calendar" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
            <p>No bookings found in database</p>
            <small>Bookings will appear here when users make reservations</small>
          </td>
        </tr>
      `;
      return;
    }
    
    tableBody.innerHTML = bookingsData.map(booking => `
      <tr>
        <td>
          <div class="booking-info">
            <strong>${booking.bookingId}</strong>
            <br>
            <small style="color: #6b7280;">${new Date(booking.createdAt).toLocaleDateString()}</small>
          </div>
        </td>
        <td>
          <div class="user-info-compact">
            <strong>${booking.user.name}</strong>
            <br>
            <small style="color: #6b7280;">${booking.user.email}</small>
          </div>
        </td>
        <td>
          <div class="vehicle-info-compact">
            <strong>${booking.vehicle.name}</strong>
            <br>
            <small style="color: #6b7280;">${booking.vehicle.plateNumber}</small>
          </div>
        </td>
        <td>
          <strong>ETB ${booking.totalAmount}</strong>
          <br>
          <small style="color: #6b7280;">${booking.paymentStatus}</small>
        </td>
        <td>
          <span class="status-badge ${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
        </td>
        <td>
          <div class="booking-dates">
            <strong>${new Date(booking.startDate).toLocaleDateString()}</strong>
            <br>
            <small style="color: #6b7280;">to ${new Date(booking.endDate).toLocaleDateString()}</small>
          </div>
        </td>
        <td>
          <div class="table-actions">
            <button class="action-btn-sm edit" onclick="viewBookingDetails('${booking.id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn-sm ${booking.status === 'cancelled' ? 'edit' : 'delete'}" onclick="updateBookingStatus('${booking.id}', '${booking.status === 'cancelled' ? 'confirmed' : 'cancelled'}')">
              <i class="fas fa-${booking.status === 'cancelled' ? 'check' : 'times'}"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ============================================
  // 8. ACTIVITY DATA (REAL DATA)
  // ============================================
  
  async function loadActivityData() {
    const authHeaders = getAuthHeaders();
    if (!authHeaders) return;

    try {
      console.log('📋 Loading activity from MongoDB...');
      const response = await fetch('http://localhost:3000/api/admin/activity', {
        headers: authHeaders
      });
      
      if (response.status === 401) {
        showLoginModal();
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        const formattedActivity = data.data.map(activity => ({
          text: activity.description,
          time: formatTimeAgo(new Date(activity.timestamp)),
          icon: activity.icon,
          iconClass: getIconClass(activity.type)
        }));
        renderActivityList(formattedActivity);
        console.log(`✅ Loaded ${data.data.length} real activity items from MongoDB`);
      } else {
        throw new Error(data.message || 'Failed to load activity');
      }
    } catch (error) {
      console.error('❌ Error loading activity from database:', error);
      
      // Show empty activity instead of demo data
      renderActivityList([]);
    }
  }

  function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }

  function getIconClass(type) {
    switch (type) {
      case 'user_registration': return 'user';
      case 'vehicle_added': return 'vehicle';
      case 'booking_created': return 'booking';
      default: return 'info';
    }
  }

  function renderActivityList(activityData) {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    if (activityData.length === 0) {
      activityList.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #6b7280;">
          <i class="fas fa-clock" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
          <p>No recent activity</p>
          <small>Activity will appear here as users interact with your platform</small>
        </div>
      `;
      return;
    }
    
    activityList.innerHTML = activityData.map(activity => `
      <div class="activity-item">
        <div class="activity-icon ${activity.iconClass}">
          <i class="${activity.icon}"></i>
        </div>
        <div class="activity-content">
          <div class="activity-text">${activity.text}</div>
          <div class="activity-time">${activity.time}</div>
        </div>
      </div>
    `).join('');
  }

  // ============================================
  // 10. UTILITY FUNCTIONS
  // ============================================
  
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      z-index: 10001;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }

  function showConfirmation(message, onConfirm) {
    document.getElementById('confirmationMessage').textContent = message;
    
    const confirmBtn = document.getElementById('confirmActionBtn');
    // Remove any existing event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    // Add new event listener
    newConfirmBtn.addEventListener('click', () => {
      closeModal('confirmationModal');
      onConfirm();
    });
    
    // Show modal
    document.getElementById('confirmationModal').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // ============================================
  // 11. GLOBAL FUNCTIONS
  // ============================================
  
  // Make functions globally accessible
  window.showSection = showSection;
  window.logout = logout;
  window.adminLogout = logout; // Alias for the HTML button
  
  window.showAddVehicleModal = function() {
    const modal = document.getElementById('addVehicleModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };
  
  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  };
  
  window.refreshActivity = function() {
    loadActivityData();
  };

  // Vehicle management functions
  window.editVehicle = function(id) {
    const vehicle = vehiclesData.find(v => v.id === id);
    if (!vehicle) return;
    
    // Populate edit form
    document.getElementById('editVehicleId').value = vehicle.id;
    document.getElementById('editVehicleBrand').value = vehicle.brand;
    document.getElementById('editVehicleModel').value = vehicle.model;
    document.getElementById('editVehicleYear').value = vehicle.year;
    document.getElementById('editVehicleType').value = vehicle.type;
    document.getElementById('editVehiclePlate').value = vehicle.plateNumber;
    document.getElementById('editVehicleColor').value = vehicle.color;
    document.getElementById('editVehicleSeats').value = vehicle.seats || 4;
    document.getElementById('editVehicleRate').value = vehicle.dailyRate;
    document.getElementById('editVehicleStatus').value = vehicle.status === 'active' ? 'true' : 'false';
    
    // Show modal
    document.getElementById('editVehicleModal').classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  
  window.deleteVehicle = function(id) {
    const vehicle = vehiclesData.find(v => v.id === id);
    if (!vehicle) return;
    
    showConfirmation(
      `Are you sure you want to delete ${vehicle.brand} ${vehicle.model}? This action cannot be undone.`,
      async () => {
        try {
          const authHeaders = getAuthHeaders();
          if (!authHeaders) return;

          const response = await fetch(`http://localhost:3000/api/admin/vehicles/${id}`, {
            method: 'DELETE',
            headers: authHeaders
          });
          
          const result = await response.json();
          
          if (result.success) {
            showNotification('Vehicle deleted successfully!', 'success');
            await loadVehiclesData();
            renderVehiclesTable();
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          console.error('❌ Error deleting vehicle:', error);
          showNotification('Failed to delete vehicle: ' + error.message, 'error');
        }
      }
    );
  };

  // User management functions
  window.viewUserDetails = function(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;
    
    const content = document.getElementById('userDetailsContent');
    content.innerHTML = `
      <div class="user-details-grid">
        <div class="detail-section">
          <h4><i class="fas fa-user"></i> Personal Information</h4>
          <div class="detail-item">
            <label>Full Name:</label>
            <span>${user.name}</span>
          </div>
          <div class="detail-item">
            <label>Email:</label>
            <span>${user.email}</span>
          </div>
          <div class="detail-item">
            <label>Phone:</label>
            <span>${user.phone}</span>
          </div>
          <div class="detail-item">
            <label>Status:</label>
            <span class="status-badge ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
          </div>
        </div>
        <div class="detail-section">
          <h4><i class="fas fa-chart-bar"></i> Activity Statistics</h4>
          <div class="detail-item">
            <label>Total Bookings:</label>
            <span>${user.totalBookings}</span>
          </div>
          <div class="detail-item">
            <label>Completed Bookings:</label>
            <span>${user.completedBookings || 0}</span>
          </div>
          <div class="detail-item">
            <label>Join Date:</label>
            <span>${new Date(user.joinDate).toLocaleDateString()}</span>
          </div>
          <div class="detail-item">
            <label>Role:</label>
            <span>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
          </div>
        </div>
      </div>
    `;
    
    // Update toggle button
    const toggleBtn = document.getElementById('toggleUserStatusBtn');
    toggleBtn.textContent = user.status === 'active' ? 'Block User' : 'Activate User';
    toggleBtn.className = user.status === 'active' ? 'btn btn-danger' : 'btn btn-success';
    toggleBtn.setAttribute('data-user-id', userId);
    toggleBtn.setAttribute('data-current-status', user.status);
    
    // Show modal
    document.getElementById('userDetailsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.toggleUserStatus = function(userId, currentStatus) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;
    
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'block';
    
    showConfirmation(
      `Are you sure you want to ${action} ${user.name}?`,
      async () => {
        try {
          const authHeaders = getAuthHeaders();
          if (!authHeaders) return;

          const response = await fetch(`http://localhost:3000/api/admin/users/${userId}/block`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({ blocked: newStatus === 'inactive' })
          });
          
          const result = await response.json();
          
          if (result.success) {
            showNotification(`User ${action}d successfully!`, 'success');
            await loadUsersData();
            renderUsersTable();
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          console.error(`❌ Error ${action}ing user:`, error);
          showNotification(`Failed to ${action} user: ` + error.message, 'error');
        }
      }
    );
  };

  window.toggleUserStatusFromModal = function() {
    const toggleBtn = document.getElementById('toggleUserStatusBtn');
    const userId = toggleBtn.getAttribute('data-user-id');
    const currentStatus = toggleBtn.getAttribute('data-current-status');
    
    closeModal('userDetailsModal');
    toggleUserStatus(userId, currentStatus);
  };

  // Booking management functions
  window.viewBookingDetails = function(bookingId) {
    const booking = bookingsData.find(b => b.id === bookingId);
    if (!booking) return;
    
    const content = document.getElementById('bookingDetailsContent');
    content.innerHTML = `
      <div class="booking-details-grid">
        <div class="detail-section">
          <h4><i class="fas fa-info-circle"></i> Booking Information</h4>
          <div class="detail-item">
            <label>Booking ID:</label>
            <span style="font-family: monospace;">${booking.id}</span>
          </div>
          <div class="detail-item">
            <label>Status:</label>
            <span class="status-badge ${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
          </div>
          <div class="detail-item">
            <label>Total Amount:</label>
            <span><strong>ETB ${booking.totalAmount}</strong></span>
          </div>
          <div class="detail-item">
            <label>Payment Status:</label>
            <span class="status-badge ${booking.paymentStatus}">${booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}</span>
          </div>
        </div>
        <div class="detail-section">
          <h4><i class="fas fa-user"></i> Customer Information</h4>
          <div class="detail-item">
            <label>Name:</label>
            <span>${booking.user.name}</span>
          </div>
          <div class="detail-item">
            <label>Email:</label>
            <span>${booking.user.email}</span>
          </div>
          <div class="detail-item">
            <label>Phone:</label>
            <span>${booking.user.phone}</span>
          </div>
        </div>
        <div class="detail-section">
          <h4><i class="fas fa-car"></i> Vehicle Information</h4>
          <div class="detail-item">
            <label>Vehicle:</label>
            <span>${booking.vehicle.name}</span>
          </div>
          <div class="detail-item">
            <label>Plate Number:</label>
            <span>${booking.vehicle.plateNumber}</span>
          </div>
          <div class="detail-item">
            <label>Type:</label>
            <span>${booking.vehicle.type.charAt(0).toUpperCase() + booking.vehicle.type.slice(1)}</span>
          </div>
        </div>
        <div class="detail-section">
          <h4><i class="fas fa-calendar"></i> Booking Period</h4>
          <div class="detail-item">
            <label>Start Date:</label>
            <span>${new Date(booking.startDate).toLocaleDateString()}</span>
          </div>
          <div class="detail-item">
            <label>End Date:</label>
            <span>${new Date(booking.endDate).toLocaleDateString()}</span>
          </div>
          <div class="detail-item">
            <label>Duration:</label>
            <span>${booking.duration} days</span>
          </div>
          <div class="detail-item">
            <label>Booking Date:</label>
            <span>${new Date(booking.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        ${booking.pickupLocation ? `
        <div class="detail-section">
          <h4><i class="fas fa-map-marker-alt"></i> Locations</h4>
          <div class="detail-item">
            <label>Pickup:</label>
            <span>${booking.pickupLocation}</span>
          </div>
          <div class="detail-item">
            <label>Dropoff:</label>
            <span>${booking.dropoffLocation}</span>
          </div>
        </div>
        ` : ''}
      </div>
    `;
    
    // Update status action buttons
    const statusActions = document.getElementById('bookingStatusActions');
    const availableStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
    const currentStatus = booking.status;
    
    statusActions.innerHTML = availableStatuses
      .filter(status => status !== currentStatus)
      .map(status => `
        <button class="btn btn-sm btn-${getStatusButtonClass(status)}" onclick="updateBookingStatus('${bookingId}', '${status}')">
          ${status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      `).join('');
    
    // Show modal
    document.getElementById('bookingDetailsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.updateBookingStatus = function(bookingId, newStatus) {
    const booking = bookingsData.find(b => b.id === bookingId);
    if (!booking) return;
    
    closeModal('bookingDetailsModal');
    
    showConfirmation(
      `Are you sure you want to change booking status to "${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}"?`,
      async () => {
        try {
          const authHeaders = getAuthHeaders();
          if (!authHeaders) return;

          const response = await fetch(`http://localhost:3000/api/admin/rides/${bookingId}/status`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({ status: newStatus })
          });
          
          const result = await response.json();
          
          if (result.success) {
            showNotification(`Booking status updated to ${newStatus}!`, 'success');
            await loadBookingsData();
            renderBookingsTable();
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          console.error('❌ Error updating booking status:', error);
          showNotification('Failed to update booking status: ' + error.message, 'error');
        }
      }
    );
  };

  function getStatusButtonClass(status) {
    switch (status) {
      case 'confirmed': return 'primary';
      case 'active': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  }

  console.log('✨ Enhanced Admin Dashboard loaded with full database integration!');
});