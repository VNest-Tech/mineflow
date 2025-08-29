-- Insert Admin Account for MineFlow
-- Run this script in your Supabase SQL Editor

-- First, create the admin user in Supabase Auth
-- You'll need to do this manually in the Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add User"
-- 3. Enter the following details:
--    Email: admin@mineflow.com
--    Password: Admin@123456
--    User Metadata: {"name": "MineFlow Admin", "role": "admin"}

-- Then run this SQL to insert the admin profile:

INSERT INTO public.users (
    id,
    name,
    email,
    role,
    phone,
    truck_assigned,
    created_at,
    updated_at
) VALUES (
    -- Replace this UUID with the actual UUID from the auth.users table
    -- You can find this by running: SELECT id FROM auth.users WHERE email = 'admin@mineflow.com';
    '00000000-0000-0000-0000-000000000000', -- Replace with actual UUID
    'MineFlow Admin',
    'admin@mineflow.com',
    'admin',
    '+91 9876543210',
    NULL,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    updated_at = NOW();

-- Alternative: If you want to create a test admin account with a known UUID
-- Uncomment and modify the following section:

/*
-- Create a test admin account (for development only)
INSERT INTO public.users (
    id,
    name,
    email,
    role,
    phone,
    truck_assigned,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440003', -- Test UUID
    'Test Admin',
    'test.admin@mineflow.com',
    'admin',
    '+91 9876543210',
    NULL,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    updated_at = NOW();
*/

-- Verify the admin account was created
SELECT 
    id,
    name,
    email,
    role,
    phone,
    truck_assigned,
    created_at
FROM public.users 
WHERE role = 'admin'
ORDER BY created_at DESC;
