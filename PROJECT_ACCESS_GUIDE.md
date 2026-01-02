# 🚀 RideFair Project - Complete Access Guide

## ✅ **PROJECT STATUS: RUNNING**

### **Backend Server**
- **Status**: ✅ Running Successfully
- **Port**: `3000`
- **MongoDB**: ✅ Connected to `ride_db`
- **API Base URL**: `http://localhost:3000`

---

## 🌐 **FRONTEND PAGES (Open in Browser)**

### **📱 Main User Application**
1. **Homepage**: `file:///[YOUR_PATH]/Ride/Ride/index.html`
2. **User Authentication**: `file:///[YOUR_PATH]/Ride/Ride/auth.html`
3. **Book a Ride**: `file:///[YOUR_PATH]/Ride/Ride/book.html`
4. **My Rides**: `file:///[YOUR_PATH]/Ride/Ride/my-rides.html`
5. **About Page**: `file:///[YOUR_PATH]/Ride/Ride/about.html`
6. **Contact Page**: `file:///[YOUR_PATH]/Ride/Ride/contact.html`
7. **Safety Information**: `file:///[YOUR_PATH]/Ride/Ride/safety.html`

### **🛡️ Admin Dashboard**
- **Admin Login**: `file:///[YOUR_PATH]/Ride/Ride/admin.html`
- **Credentials**: 
  - Email: `admin@ridefair.com`
  - Password: `RideFair2024!`

---

## 🔧 **API ENDPOINTS (Backend)**

### **Public Endpoints**
- **Server Status**: `http://localhost:3000/`
- **All Vehicles**: `http://localhost:3000/api/vehicles`
- **Available Vehicles**: `http://localhost:3000/api/vehicles/available`
- **Cars Only**: `http://localhost:3000/api/vehicles/cars`
- **Bikes Only**: `http://localhost:3000/api/vehicles/bikes`

### **Authentication Endpoints**
- **User Register**: `POST http://localhost:3000/api/auth/register`
- **User Login**: `POST http://localhost:3000/api/auth/login`
- **Admin Login**: `POST http://localhost:3000/api/admin/auth/login`

### **Admin Endpoints** (Requires JWT Token)
- **Dashboard Stats**: `GET http://localhost:3000/api/admin/stats`
- **Manage Vehicles**: `GET/POST/PUT/DELETE http://localhost:3000/api/admin/vehicles`
- **Manage Users**: `GET http://localhost:3000/api/admin/users`
- **Manage Bookings**: `GET http://localhost:3000/api/admin/bookings`
- **Recent Activity**: `GET http://localhost:3000/api/admin/activity`

### **Booking Endpoints**
- **Create Booking**: `POST http://localhost:3000/api/bookings`
- **User Bookings**: `GET http://localhost:3000/api/bookings/user/:userId`

---

## 🧪 **TEST PAGES (For Development)**

### **Admin System Tests**
1. **Quick Admin Test**: `file:///[YOUR_PATH]/test-admin-quick.html`
2. **Complete Admin Test**: `file:///[YOUR_PATH]/test-complete-admin-system.html`
3. **Admin Login Flow**: `file:///[YOUR_PATH]/test-admin-login-flow.html`
4. **MongoDB Connection**: `file:///[YOUR_PATH]/test-admin-mongodb-connection.html`

### **System Tests**
1. **MongoDB Status**: `file:///[YOUR_PATH]/test-mongodb-status.html`
2. **Vehicle System**: `file:///[YOUR_PATH]/Ride/Ride/test-vehicle-system.html`
3. **Booking Flow**: `file:///[YOUR_PATH]/Ride/Ride/test-booking-flow.html`
4. **TeleBirr Payment**: `file:///[YOUR_PATH]/Ride/Ride/test-telebirr-demo.html`

---

## 🎯 **QUICK START GUIDE**

### **For Users (Customer Experience)**
1. Open: `Ride/Ride/index.html`
2. Navigate to "Book a Ride"
3. Select vehicle and book
4. Use TeleBirr payment demo

### **For Admins (Management)**
1. Open: `Ride/Ride/admin.html`
2. Login: `admin@ridefair.com` / `RideFair2024!`
3. View dashboard statistics
4. Manage vehicles, users, and bookings

### **For Developers (Testing)**
1. Open: `test-admin-quick.html`
2. Test backend connection
3. Test admin authentication
4. Test all API endpoints

---

## 📊 **CURRENT DATABASE STATE**

### **Collections**
- **Vehicles**: 0-4 vehicles (depending on seeding)
- **Users**: 1 admin user + any registered users
- **Bookings**: Any bookings made through the system

### **Sample Data**
- Use admin dashboard to add vehicles
- Or use test pages to seed sample data

---

## 🔑 **IMPORTANT CREDENTIALS**

### **Admin Access**
- **Email**: `admin@ridefair.com`
- **Password**: `RideFair2024!`

### **Database**
- **MongoDB Atlas**: Connected and operational
- **Database Name**: `ride_db`

---

## 🚀 **RECOMMENDED TESTING FLOW**

1. **Start Here**: `test-admin-quick.html` - Verify everything works
2. **Admin Dashboard**: `admin.html` - Login and explore features
3. **User Experience**: `index.html` - Test the customer journey
4. **Booking Flow**: `book.html` - Test vehicle booking
5. **Payment Demo**: Test TeleBirr integration

---

## 📱 **MOBILE RESPONSIVE**
All pages are mobile-responsive and work on:
- Desktop browsers
- Mobile browsers
- Tablets

---

## 🎉 **PROJECT FEATURES**

### **✅ Completed Features**
- User authentication system
- Vehicle browsing and booking
- TeleBirr payment integration (demo)
- Admin dashboard with JWT authentication
- Real-time MongoDB integration
- Vehicle negotiation system
- Responsive design

### **🔧 Technical Stack**
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens
- **Payment**: TeleBirr demo integration

---

## 🌟 **ACCESS YOUR PROJECT**

**Backend API**: `http://localhost:3000`
**Frontend**: Open any HTML file in `Ride/Ride/` folder
**Admin Dashboard**: `Ride/Ride/admin.html`
**Quick Test**: `test-admin-quick.html`

**Your RideFair project is fully operational!** 🚗✨