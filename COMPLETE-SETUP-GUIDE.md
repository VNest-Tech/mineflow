# 🚛 MineFlow Complete Setup Guide

## 📋 Overview

MineFlow is now a complete mining operations management system with:
- ✅ **Authentication & Authorization** (Login/Logout)
- ✅ **Admin Dashboard** with full CRUD operations
- ✅ **Driver Dashboard** with delivery tracking
- ✅ **Truck Management** with fleet operations
- ✅ **Order Management** with dispatch tracking
- ✅ **User Management** with role-based access
- ✅ **Real-time Updates** with Supabase integration

## 🗄️ Database Reset Instructions

### Step 1: Clear All Data
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/nentjkjbtxaazppukumd
2. Click **SQL Editor**
3. Run the `clear-auth-users.sql` script first
4. Then run the `reset-mineflow-database.sql` script

### Step 2: Create Admin User
1. Go to **Authentication > Users** in Supabase Dashboard
2. Click **"Add User"**
3. Fill in:
   ```
   Email: admin@mineflow.com
   Password: MineFlow@2024!
   User Metadata: {"name": "MineFlow Admin", "role": "admin"}
   ```
4. Click **"Create User"**

### Step 3: Update Database Profile
Run this SQL to link the auth user to the database profile:
```sql
-- Get the UUID of the newly created auth user
SELECT id, email FROM auth.users WHERE email = 'admin@mineflow.com';

-- Update the public.users table with the correct UUID
-- Replace 'PASTE_UUID_HERE' with the actual UUID from above
UPDATE public.users 
SET id = 'PASTE_UUID_HERE'
WHERE email = 'admin@mineflow.com';
```

## 🚀 Application Features

### 🔐 Authentication System
- **Login Form**: Email/password authentication
- **Logout**: Available in both Admin and Driver dashboards
- **Role-based Routing**: Automatic redirection based on user role
- **Session Management**: Persistent login state

### 👨‍💼 Admin Dashboard Features

#### **Dashboard Overview**
- 📊 Real-time statistics (Total Processes, Active Drivers, Active Processes)
- 📈 KPI cards with change indicators
- 🎯 Quick action buttons

#### **Truck Processes Management**
- ➕ **Create New Process**: Add new truck dispatches
- 👥 **Assign Drivers**: Assign available drivers to processes
- 📝 **Edit Processes**: Update process details
- 🗑️ **Delete Processes**: Remove processes with confirmation
- 🔍 **View Details**: Complete process information with stages

#### **Driver Management**
- ➕ **Add New Driver**: Create driver profiles
- 📋 **View All Drivers**: Complete driver list with status
- 🔄 **Assign/Unassign**: Manage driver-truck assignments
- 📊 **Driver Status**: Available/Assigned indicators

#### **Truck Management**
- 🚛 **Fleet Overview**: Visual truck cards with status
- ⛽ **Fuel Monitoring**: Fuel level indicators
- 🔧 **Maintenance Tracking**: Maintenance due dates
- 📍 **Location Tracking**: Last known locations
- 👥 **Driver Assignment**: Assign/unassign drivers to trucks

### 🚚 Driver Dashboard Features

#### **Personal Dashboard**
- 👋 **Welcome Message**: Personalized greeting
- 🚛 **Truck Information**: Assigned truck details
- 📊 **Personal Stats**: Completed today, in progress, total completed

#### **Active Dispatches**
- 📋 **Current Assignments**: Real-time dispatch information
- 🎯 **Status Updates**: Mark stages as completed
- 📸 **Delivery Proof**: Upload photos and videos
- 📝 **Notes**: Add delivery notes

#### **Logout Functionality**
- 🔓 **Secure Logout**: Available in header
- 🔄 **Session Clear**: Complete session termination

## 🛠️ Technical Implementation

### **Service Layer**
- **AdminService**: Complete CRUD operations for admin functions
- **DriverService**: Driver-specific operations and data fetching
- **AuthContext**: Authentication state management

### **Components**
- **AdminDashboard**: Full admin interface with tables and modals
- **DriverDashboard**: Driver-specific interface with delivery tracking
- **TruckManagement**: Dedicated truck fleet management
- **LoginForm**: Authentication interface

### **Database Schema**
```sql
-- Core Tables
users (id, name, email, role, phone, truck_assigned, avatar, created_at, updated_at)
truck_processes (id, truck_no, dispatch_id, is_royalty, current_stage, driver_id, start_time, estimated_delivery_time, actual_delivery_time, status, created_at, updated_at)
truck_stages (id, truck_process_id, stage, timestamp, operator, completed, royalty_code, video_url, notes, media, created_at)
delivery_proofs (id, truck_process_id, photo_url, video_url, timestamp, location, notes, created_at)
```

## 🔧 Environment Setup

### **Required Environment Variables**
Create a `.env` file in your project root:
```env
VITE_SUPABASE_URL=https://nentjkjbtxaazppukumd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lbnRqa2pidHhhYXpwcHVrdW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MjY4MzgsImV4cCI6MjA3MjAwMjgzOH0.SULC-3UNAXcNUm81qgiTf_bFznWig-lx4KwRsiGSHNI
```

### **Development Server**
```bash
npm run dev
```
Access the application at: http://localhost:5174

## 👥 User Roles & Access

### **Admin User**
- **Email**: admin@mineflow.com
- **Password**: MineFlow@2024!
- **Access**: Full system access, all CRUD operations

### **Driver Users**
- **Email**: ram.sharma@company.com (or create new)
- **Password**: Test@123456
- **Access**: Driver dashboard, delivery tracking, status updates

## 📱 Mobile Responsive Design

All components are fully responsive and optimized for:
- 📱 Mobile devices
- 💻 Tablets
- 🖥️ Desktop screens

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Role-based Authorization**: UI and API access control
- **Secure Authentication**: Supabase Auth integration
- **Input Validation**: Form validation and sanitization

## 🚀 Deployment Ready

The application is production-ready with:
- ✅ Error handling and loading states
- ✅ Responsive design
- ✅ TypeScript type safety
- ✅ Modular component architecture
- ✅ Service layer abstraction
- ✅ Environment variable configuration

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Ensure database scripts have been run successfully
4. Confirm admin user has been created in Supabase Auth

## 🎯 Next Steps

After setup, you can:
1. **Create additional drivers** through the admin dashboard
2. **Add trucks** to the fleet management system
3. **Create dispatches** and assign drivers
4. **Monitor real-time progress** through the dashboards
5. **Generate reports** and analytics

---

**🎉 Congratulations! Your MineFlow application is now fully operational with complete CRUD operations and logout functionality!**
