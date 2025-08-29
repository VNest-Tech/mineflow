-- Quick Admin Setup for MineFlow
-- Run this in your Supabase SQL Editor

-- Option 1: Enable the existing test admin account (already in supabase-schema.sql)
-- This account already exists with UUID: '550e8400-e29b-41d4-a716-446655440003'
-- Email: admin@company.com
-- You can use this for testing immediately

-- Option 2: Create a new admin account with a specific UUID
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
    gen_random_uuid(), -- Generate a new UUID
    'MineFlow Administrator',
    'admin@mineflow.com',
    'admin',
    '+91 9876543210',
    NULL,
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    updated_at = NOW();

-- Option 3: Create multiple admin accounts for different purposes
INSERT INTO public.users (
    id,
    name,
    email,
    role,
    phone,
    truck_assigned,
    created_at,
    updated_at
) VALUES 
    (gen_random_uuid(), 'System Admin', 'system.admin@mineflow.com', 'admin', '+91 9876543211', NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Operations Manager', 'ops.manager@mineflow.com', 'admin', '+91 9876543212', NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Supervisor', 'supervisor@mineflow.com', 'supervisor', '+91 9876543213', NULL, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    updated_at = NOW();

-- View all admin users
SELECT 
    id,
    name,
    email,
    role,
    phone,
    created_at
FROM public.users 
WHERE role IN ('admin', 'supervisor')
ORDER BY role, created_at DESC;

-- Get the UUID of the admin account you want to use
-- Copy this UUID to create the auth user manually in Supabase Dashboard
SELECT 
    id as auth_user_id,
    email,
    name,
    role
FROM public.users 
WHERE email = 'admin@mineflow.com' 
   OR email = 'admin@company.com'
   OR email = 'system.admin@mineflow.com';
