# Admin Password Setup Guide

## 🔐 Setting Up Admin Passwords in Supabase

### Method 1: Manual User Creation (Recommended)

#### Step 1: Create Auth User in Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Go to **Authentication > Users**

2. **Add New User**
   - Click **"Add User"** button
   - Fill in the details:

```
Email: admin@mineflow.com
Password: MineFlow@2024!
User Metadata: 
{
  "name": "MineFlow Admin",
  "role": "admin"
}
```

3. **Alternative Admin Accounts**
```
Email: system.admin@mineflow.com
Password: System@2024!
User Metadata: 
{
  "name": "System Administrator",
  "role": "admin"
}
```

#### Step 2: Update Database Profile

After creating the auth user, run this SQL to update the profile:

```sql
-- Get the UUID of the newly created auth user
SELECT id, email FROM auth.users WHERE email = 'admin@mineflow.com';

-- Update the users table with the correct UUID
UPDATE public.users 
SET id = 'PASTE_UUID_HERE' -- Replace with actual UUID from above query
WHERE email = 'admin@mineflow.com';
```

### Method 2: Quick Test Setup

#### Pre-configured Test Account

Use the existing test account from the schema:

```
Email: admin@company.com
Password: Test@123456
```

This account is already configured in the database with UUID: `550e8400-e29b-41d4-a716-446655440003`

### Method 3: Programmatic User Creation

#### Using Supabase CLI (Advanced)

1. **Install Supabase CLI**
```bash
npm install -g supabase
```

2. **Create User via CLI**
```bash
supabase auth admin create-user \
  --email admin@mineflow.com \
  --password MineFlow@2024! \
  --user-metadata '{"name":"MineFlow Admin","role":"admin"}'
```

## 🔑 Default Admin Passwords

### Production Passwords
```
admin@mineflow.com / MineFlow@2024!
system.admin@mineflow.com / System@2024!
ops.manager@mineflow.com / Ops@2024!
supervisor@mineflow.com / Supervisor@2024!
```

### Development Passwords
```
admin@company.com / Test@123456
test.admin@mineflow.com / Test@123456
```

## 🛡️ Password Security Requirements

### Supabase Default Requirements
- Minimum 6 characters
- No specific complexity requirements by default

### Recommended Strong Passwords
```
MineFlow@2024!     (12 chars, mixed case, numbers, symbols)
System@2024!       (11 chars, mixed case, numbers, symbols)
Ops@2024!          (9 chars, mixed case, numbers, symbols)
```

## 🔧 Password Reset

### Via Supabase Dashboard
1. Go to **Authentication > Users**
2. Find the user
3. Click **"..."** menu
4. Select **"Reset password"**
5. User will receive email with reset link

### Via SQL (Emergency)
```sql
-- Reset password hash (not recommended for production)
UPDATE auth.users 
SET encrypted_password = crypt('NewPassword123!', gen_salt('bf'))
WHERE email = 'admin@mineflow.com';
```

## 🚀 Quick Setup Commands

### 1. Create Admin User with Strong Password
```sql
-- Run this in Supabase SQL Editor
INSERT INTO public.users (
    id,
    name,
    email,
    role,
    phone,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'MineFlow Admin',
    'admin@mineflow.com',
    'admin',
    '+91 9876543210',
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = NOW();
```

### 2. Verify Admin Account
```sql
-- Check if admin account exists
SELECT 
    id,
    name,
    email,
    role,
    created_at
FROM public.users 
WHERE role = 'admin'
ORDER BY created_at DESC;
```

## 🔍 Troubleshooting

### Common Issues

1. **"Invalid login credentials"**
   - Check email spelling
   - Verify password case sensitivity
   - Ensure auth user exists in Supabase

2. **"User not found in database"**
   - Run the SQL to create/update user profile
   - Check UUID matches between auth.users and public.users

3. **"Permission denied"**
   - Verify RLS policies are correct
   - Check user role is set to 'admin'

### Debug Queries

```sql
-- Check auth users
SELECT id, email, created_at FROM auth.users WHERE email LIKE '%admin%';

-- Check public users
SELECT id, name, email, role FROM public.users WHERE role = 'admin';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';
```

## 📱 Testing Login

### 1. Start Development Server
```bash
npm run dev
```

### 2. Navigate to Application
- Go to `http://localhost:5173`
- You should see the login form

### 3. Login with Admin Credentials
```
Email: admin@mineflow.com
Password: MineFlow@2024!
```

### 4. Verify Admin Access
- Should see full admin dashboard
- Access to all features and data
- No restrictions on operations

## 🔒 Security Best Practices

1. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols

2. **Regular Password Rotation**
   - Change admin passwords monthly
   - Use password manager for secure storage

3. **Enable 2FA** (if available)
   - Add additional security layer
   - Use authenticator apps

4. **Monitor Access**
   - Check auth logs regularly
   - Set up alerts for failed login attempts

5. **Limit Admin Accounts**
   - Only create necessary admin accounts
   - Use role-based access control

## 📞 Support

If you encounter issues:

1. **Check Supabase Logs**
   - Go to Dashboard > Logs
   - Look for authentication errors

2. **Verify Environment Variables**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Test Database Connection**
   - Run simple queries in SQL Editor
   - Verify RLS policies are working

4. **Check Browser Console**
   - Look for JavaScript errors
   - Verify network requests to Supabase
