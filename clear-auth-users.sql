-- Clear All Authentication Users
-- WARNING: This will DELETE ALL EXISTING AUTH USERS
-- Run this BEFORE running the reset-mineflow-database.sql script

-- Step 1: Delete all auth users (this will cascade to public.users)
DELETE FROM auth.users;

-- Step 2: Verify all users are deleted
SELECT 'Auth users remaining:' as info, COUNT(*) as count FROM auth.users;
SELECT 'Public users remaining:' as info, COUNT(*) as count FROM public.users;

-- Step 3: Reset auth sequences (optional)
-- This resets the auto-increment counters
-- ALTER SEQUENCE auth.users_id_seq RESTART WITH 1;

SELECT 'All auth users cleared successfully!' as status;
