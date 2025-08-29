-- MineFlow Database Reset and Fresh Setup
-- Project: nentjkjbtxaazppukumd.supabase.co
-- WARNING: This will DELETE ALL EXISTING DATA
-- Run this script in your Supabase SQL Editor

-- Step 1: Drop all existing tables and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_truck_processes_updated_at ON public.truck_processes;

DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

DROP TABLE IF EXISTS public.delivery_proofs CASCADE;
DROP TABLE IF EXISTS public.truck_stages CASCADE;
DROP TABLE IF EXISTS public.truck_processes CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Step 2: Create fresh schema

-- Create users table
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'supervisor', 'operator', 'dispatcher', 'driver', 'auditor')),
    phone TEXT,
    truck_assigned TEXT,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create truck_processes table
CREATE TABLE public.truck_processes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    truck_no TEXT NOT NULL,
    dispatch_id TEXT NOT NULL UNIQUE,
    is_royalty BOOLEAN DEFAULT false,
    current_stage TEXT NOT NULL CHECK (current_stage IN ('gate', 'loading', 'weigh_in', 'weigh_out', 'departed', 'delivered')),
    driver_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    estimated_delivery_time TIMESTAMP WITH TIME ZONE,
    actual_delivery_time TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'in_process' CHECK (status IN ('in_process', 'delivered', 'exception')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create truck_stages table
CREATE TABLE public.truck_stages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    truck_process_id UUID REFERENCES public.truck_processes(id) ON DELETE CASCADE,
    stage TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    operator TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    royalty_code TEXT,
    video_url TEXT,
    notes TEXT,
    media TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create delivery_proofs table
CREATE TABLE public.delivery_proofs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    truck_process_id UUID REFERENCES public.truck_processes(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    video_url TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_truck_assigned ON public.users(truck_assigned);
CREATE INDEX idx_truck_processes_driver_id ON public.truck_processes(driver_id);
CREATE INDEX idx_truck_processes_status ON public.truck_processes(status);
CREATE INDEX idx_truck_processes_current_stage ON public.truck_processes(current_stage);
CREATE INDEX idx_truck_stages_truck_process_id ON public.truck_stages(truck_process_id);
CREATE INDEX idx_delivery_proofs_truck_process_id ON public.delivery_proofs(truck_process_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.truck_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.truck_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_proofs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for truck_processes table
CREATE POLICY "Drivers can view their own processes" ON public.truck_processes
    FOR SELECT USING (driver_id = auth.uid());

CREATE POLICY "Admins can view all processes" ON public.truck_processes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Drivers can update their own processes" ON public.truck_processes
    FOR UPDATE USING (driver_id = auth.uid());

-- RLS Policies for truck_stages table
CREATE POLICY "Users can view stages for their processes" ON public.truck_stages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.truck_processes 
            WHERE id = truck_process_id AND driver_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all stages" ON public.truck_stages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for delivery_proofs table
CREATE POLICY "Users can view proofs for their processes" ON public.delivery_proofs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.truck_processes 
            WHERE id = truck_process_id AND driver_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all proofs" ON public.delivery_proofs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_truck_processes_updated_at BEFORE UPDATE ON public.truck_processes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, name, email, role)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email, COALESCE(NEW.raw_user_meta_data->>'role', 'driver'));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Insert fresh sample data
INSERT INTO public.users (id, name, email, role, phone, truck_assigned) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'राम शर्मा', 'ram.sharma@company.com', 'driver', '+91 9876543210', 'MH12AB1234'),
    ('550e8400-e29b-41d4-a716-446655440002', 'अभय पटेल', 'abhay.patel@company.com', 'driver', '+91 9876543211', 'MH14CD5678'),
    ('550e8400-e29b-41d4-a716-446655440003', 'MineFlow Admin', 'admin@mineflow.com', 'admin', '+91 9876543212', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample truck processes
INSERT INTO public.truck_processes (truck_no, dispatch_id, is_royalty, current_stage, driver_id, start_time, estimated_delivery_time, status) VALUES
    ('MH12AB1234', 'DSP001', true, 'weigh_out', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '4 hours', 'in_process'),
    ('MH14CD5678', 'DSP002', false, 'loading', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '1 hour', NOW() + INTERVAL '5 hours', 'in_process')
ON CONFLICT (dispatch_id) DO NOTHING;

-- Step 4: Verify fresh setup
SELECT 'Database reset completed successfully!' as status;
SELECT 'Tables created:' as info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;

SELECT 'Sample data inserted:' as info;
SELECT COUNT(*) as users_count FROM public.users;
SELECT COUNT(*) as processes_count FROM public.truck_processes;

SELECT 'RLS Policies created:' as info;
SELECT COUNT(*) as policy_count FROM pg_policies WHERE schemaname = 'public';
