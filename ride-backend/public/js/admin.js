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
        
        const response = await fetch('/api/admin/auth/login', {
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
      const response = await fetch('/api/admin/auth/verify', {
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
      const response = await fetch('/api/admin/stats', {
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
        
        showNotification('Dashboard statistics loaded from MongoDB!', 'success');
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
      const response = await fetch('/api/admin/vehicles', {
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
        showNotification(`Loaded ${vehiclesData.length} vehicles from database!`, 'success');
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
      
      const response = await fetch('/api/admin/vehicles', {
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
      const response = await fetch('/api/admin/users', {
        headers: authHeaders
      });
      
      if (response.status === 401) {
        showLoginModal();
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        usersData = data.data;
        console.log(`✅ Loaded ${usersData.length} real users from MongoDB`);
        showNotification(`Loaded ${usersData.length} users from database!`, 'success');
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
    
    // Separate regular users and admin users
    const regularUsers = usersData.filter(user => user.role !== 'admin');
    const adminUsers = usersData.filter(user => user.role === 'admin');
    
    let tableHTML = '';
    
    // Add admin users section if any exist
    if (adminUsers.length > 0) {
      tableHTML += `
        <tr class="admin-section-header">
          <td colspan="6" style="background: #f8fafc; padding: 15px; font-weight: 600; color: #374151; border-top: 2px solid #e5e7eb;">
            <i class="fas fa-shield-alt" style="color: #dc2626; margin-right: 8px;"></i>
            System Administrators (${adminUsers.length})
          </td>
        </tr>
      `;
      
      tableHTML += adminUsers.map(user => `
        <tr class="admin-user-row" style="background: #fef2f2;">
          <td>
            <div class="user-info">
              <div class="user-avatar admin-avatar" style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white;">
                <i class="fas fa-shield-alt"></i>
              </div>
              <div class="user-details">
                <h4 style="color: #dc2626; font-weight: 600;">
                  ${user.name}
                  <span class="admin-badge" style="background: #dc2626; color: white; font-size: 10px; padding: 2px 6px; border-radius: 10px; margin-left: 8px;">ADMIN</span>
                </h4>
                <p style="color: #6b7280;">${user.email}</p>
              </div>
            </div>
          </td>
          <td style="color: #6b7280;">${user.phone || 'N/A'}</td>
          <td style="color: #6b7280;">-</td>
          <td>
            <span class="status-badge active" style="background: #dcfce7; color: #166534;">
              <i class="fas fa-shield-check" style="margin-right: 4px;"></i>
              Admin
            </span>
          </td>
          <td style="color: #6b7280;">${new Date(user.createdAt).toLocaleDateString()}</td>
          <td>
            <div class="table-actions">
              <button class="action-btn-sm view" onclick="viewAdminDetails('${user._id}')" title="View Admin Details">
                <i class="fas fa-eye"></i>
              </button>
              <button class="action-btn-sm settings" onclick="manageAdminPermissions('${user._id}')" title="Manage Permissions" style="background: #f59e0b; color: white;">
                <i class="fas fa-cog"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
      
      // Add separator if there are regular users too
      if (regularUsers.length > 0) {
        tableHTML += `
          <tr class="users-section-header">
            <td colspan="6" style="background: #f8fafc; padding: 15px; font-weight: 600; color: #374151; border-top: 2px solid #e5e7eb;">
              <i class="fas fa-users" style="color: #3b82f6; margin-right: 8px;"></i>
              Regular Users (${regularUsers.length})
            </td>
          </tr>
        `;
      }
    }
    
    // Add regular users
    tableHTML += regularUsers.map(user => `
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
        <td>${user.phone || 'N/A'}</td>
        <td>${user.totalBookings || 0}</td>
        <td>
          <span class="status-badge ${user.status || 'active'}">${(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}</span>
        </td>
        <td>${new Date(user.createdAt).toLocaleDateString()}</td>
        <td>
          <div class="table-actions">
            <button class="action-btn-sm edit" onclick="viewUserDetails('${user._id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn-sm delete" onclick="blockUser('${user._id}')" title="Block User">
              <i class="fas fa-ban"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
    
    tableBody.innerHTML = tableHTML;
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
      const response = await fetch('/api/admin/bookings', {
        headers: authHeaders
      });
      
      if (response.status === 401) {
        showLoginModal();
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        bookingsData = data.data;
        console.log(`✅ Loaded ${bookingsData.length} real bookings from MongoDB`);
        showNotification(`Loaded ${bookingsData.length} bookings from database!`, 'success');
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
          <td colspan="6" style="text-align: center; padding: 40px; color: #6b7280;">
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
        <td>${booking._id.substring(0, 8)}...</td>
        <td>${booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'Unknown'}</td>
        <td>${booking.vehicle ? `${booking.vehicle.brand} ${booking.vehicle.model}` : 'Unknown'}</td>
        <td>ETB ${booking.totalAmount || 'N/A'}</td>
        <td>
          <span class="status-badge ${booking.status || 'pending'}">${(booking.status || 'pending').charAt(0).toUpperCase() + (booking.status || 'pending').slice(1)}</span>
        </td>
        <td>${new Date(booking.createdAt).toLocaleDateString()}</td>
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
      const response = await fetch('/api/admin/activity', {
        headers: authHeaders
      });
      
      if (response.status === 401) {
        showLoginModal();
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        renderActivityList(data.data);
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
  // 9. UTILITY FUNCTIONS
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

  // ============================================
  // 10. GLOBAL FUNCTIONS
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
    showNotification('Activity refreshed!', 'success');
  };

  // Vehicle management functions
  window.editVehicle = function(id) {
    showNotification('Edit vehicle feature coming soon!', 'info');
  };
  
  window.deleteVehicle = async function(id) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const response = await fetch(`/api/admin/vehicles/${id}`, {
          method: 'DELETE'
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
  };

  console.log('✨ Enhanced Admin Dashboard loaded with full database integration!');
});
  // ============================================
  // ADMIN USER MANAGEMENT FUNCTIONS
  // ============================================
  
  // View admin details
  window.viewAdminDetails = function(adminId) {
    const admin = usersData.find(user => user._id === adminId && user.role === 'admin');
    if (!admin) {
      showNotification('Admin not found', 'error');
      return;
    }
    
    const adminInfo = `
      <div style="padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #dc2626, #ef4444); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
            <i class="fas fa-shield-alt" style="color: white; font-size: 2rem;"></i>
          </div>
          <h3 style="margin: 0; color: #dc2626;">${admin.name}</h3>
          <p style="margin: 5px 0; color: #6b7280;">System Administrator</p>
        </div>
        
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h4 style="margin: 0 0 10px 0; color: #374151;">Account Information</h4>
          <p><strong>Email:</strong> ${admin.email}</p>
          <p><strong>Phone:</strong> ${admin.phone || 'Not provided'}</p>
          <p><strong>Account Created:</strong> ${new Date(admin.createdAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span style="color: #059669; font-weight: 600;">Active Administrator</span></p>
        </div>
        
        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626;">
          <h4 style="margin: 0 0 10px 0; color: #dc2626;">Admin Privileges</h4>
          <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
            <li>Full dashboard access</li>
            <li>User management</li>
            <li>Vehicle management</li>
            <li>Booking oversight</li>
            <li>System analytics</li>
            <li>Admin user management</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <button onclick="closeModal('adminDetailsModal')" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
            Close
          </button>
        </div>
      </div>
    `;
    
    // Create or update admin details modal
    let modal = document.getElementById('adminDetailsModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'adminDetailsModal';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3><i class="fas fa-shield-alt"></i> Administrator Details</h3>
            <button class="modal-close" onclick="closeModal('adminDetailsModal')">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div id="adminDetailsContent"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    
    document.getElementById('adminDetailsContent').innerHTML = adminInfo;
    modal.style.display = 'flex';
  };
  
  // Manage admin permissions (placeholder for future feature)
  window.manageAdminPermissions = function(adminId) {
    const admin = usersData.find(user => user._id === adminId && user.role === 'admin');
    if (!admin) {
      showNotification('Admin not found', 'error');
      return;
    }
    
    showNotification(`Admin permissions management for ${admin.name} coming soon!`, 'info');
  };
  
  // View regular user details
  window.viewUserDetails = function(userId) {
    const user = usersData.find(u => u._id === userId && u.role !== 'admin');
    if (!user) {
      showNotification('User not found', 'error');
      return;
    }
    
    showNotification(`User details for ${user.name} - Feature coming soon!`, 'info');
  };
  
  // Block user function
  window.blockUser = function(userId) {
    const user = usersData.find(u => u._id === userId && u.role !== 'admin');
    if (!user) {
      showNotification('User not found', 'error');
      return;
    }
    
    if (confirm(`Are you sure you want to block ${user.name}?`)) {
      showNotification(`User blocking for ${user.name} - Feature coming soon!`, 'info');
    }
  };