# MineFlow Supabase Setup Guide

## 🚀 Quick Setup for Your Supabase Project

**Project URL**: `https://nentjkjbtxaazppukumd.supabase.co`

### Step 1: Environment Configuration

Create a `.env` file in your project root with:

```env
VITE_SUPABASE_URL=https://nentjkjbtxaazppukumd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lbnRqa2pidHhhYXpwcHVrdW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MjY4MzgsImV4cCI6MjA3MjAwMjgzOH0.SULC-3UNAXcNUm81qgiTf_bFznWig-lx4KwRsiGSHNI
```

### Step 2: Database Setup

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/nentjkjbtxaazppukumd
   - Click on **SQL Editor**

2. **Run the Database Schema**
   - Copy the entire contents of `setup-mineflow-database.sql`
   - Paste it in the SQL Editor
   - Click **Run**

3. **Verify Setup**
   - You should see: "Database setup completed successfully!"
   - Check that users_count and processes_count are > 0

### Step 3: Storage Configuration

1. **Create Storage Bucket**
   - Go to **Storage** in your Supabase dashboard
   - Click **"New bucket"**
   - Name: `mineflow-media`
   - Set to **Public**
   - Click **Create bucket**

2. **Configure CORS** (if needed)
   - Go to **Settings > API**
   - Add your domain to CORS origins

### Step 4: Create Admin User

1. **Go to Authentication > Users**
   - Click **"Add User"**
   - Fill in:
     ```
     Email: admin@mineflow.com
     Password: MineFlow@2024!
     User Metadata: {"name": "MineFlow Admin", "role": "admin"}
     ```

2. **Update Database Profile**
   - Run this SQL to get the UUID:
     ```sql
     SELECT id FROM auth.users WHERE email = 'admin@mineflow.com';
     ```
   - Copy the UUID and run:
     ```sql
     UPDATE public.users 
     SET id = 'PASTE_UUID_HERE'
     WHERE email = 'admin@mineflow.com';
     ```

### Step 5: Test the Application

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Navigate to Application**
   - Go to `http://localhost:5173`
   - You should see the login form

3. **Login with Admin Credentials**
   ```
   Email: admin@mineflow.com
   Password: MineFlow@2024!
   ```

## 🔑 Available Test Accounts

### Admin Account
```
Email: admin@mineflow.com
Password: MineFlow@2024!
```

### Driver Accounts (for testing)
```
Email: ram.sharma@company.com
Password: Test@123456

Email: abhay.patel@company.com
Password: Test@123456
```

## 📊 Database Tables Created

- ✅ `users` - User profiles and roles
- ✅ `truck_processes` - Dispatch tracking
- ✅ `truck_stages` - Stage progression
- ✅ `delivery_proofs` - Photo/video uploads

## 🔒 Security Features

- ✅ Row Level Security (RLS) enabled
- ✅ Role-based access control
- ✅ Secure authentication
- ✅ File upload security

## 🛠️ Troubleshooting

### Common Issues

1. **"Invalid login credentials"**
   - Ensure auth user exists in Supabase Dashboard
   - Check password case sensitivity

2. **"User not found in database"**
   - Run the UUID update SQL
   - Verify RLS policies

3. **"Permission denied"**
   - Check user role is set to 'admin'
   - Verify RLS policies are correct

### Debug Queries

```sql
-- Check auth users
SELECT id, email FROM auth.users WHERE email LIKE '%admin%';

-- Check public users
SELECT id, name, email, role FROM public.users WHERE role = 'admin';

-- Check RLS policies
SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'users';
```

## 📱 Features Available

### Admin Dashboard
- ✅ Full system access
- ✅ User management
- ✅ Truck tracking
- ✅ Reports and analytics

### Driver Dashboard
- ✅ Dispatch viewing
- ✅ Status updates
- ✅ Photo/video upload
- ✅ GPS location tracking

## 🚀 Next Steps

1. **Test all features**
2. **Add more users** as needed
3. **Configure email settings** (optional)
4. **Set up monitoring** (optional)
5. **Deploy to production** (optional)

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify environment variables are correct
3. Check Supabase logs in the dashboard
4. Ensure all SQL scripts ran successfully

Your MineFlow application is now connected to Supabase and ready to use! 🎉
