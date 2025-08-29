    -- Quick Admin Password Setup
    -- Run this in your Supabase SQL Editor

    -- Step 1: Create admin user profile (if not exists)
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
        gen_random_uuid(),
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

    -- Step 2: Get the UUID for manual auth user creation
    SELECT 
        'UUID for auth user creation:' as info,
        id as auth_user_uuid,
        email,
        name,
        role
    FROM public.users 
    WHERE email = 'admin@mineflow.com';

    -- Step 3: Verify admin account exists
    SELECT 
        'Admin accounts in database:' as info,
        id,
        name,
        email,
        role,
        created_at
    FROM public.users 
    WHERE role = 'admin'
    ORDER BY created_at DESC;

    -- Step 4: Check if auth user exists (will be empty until you create it manually)
    SELECT 
        'Auth users (should be empty until manually created):' as info,
        id,
        email,
        created_at
    FROM auth.users 
    WHERE email = 'admin@mineflow.com';
