-- MineFlow Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'supervisor', 'operator', 'dispatcher', 'driver', 'auditor')),
  avatar TEXT,
  phone VARCHAR(20),
  truck_assigned VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(10) UNIQUE NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES categories(id),
  category VARCHAR(255) NOT NULL,
  uom VARCHAR(20) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_no VARCHAR(50) UNIQUE NOT NULL,
  customer VARCHAR(255) NOT NULL,
  material VARCHAR(255) NOT NULL,
  ordered_qty DECIMAL(10,2) NOT NULL,
  delivered_qty DECIMAL(10,2) DEFAULT 0,
  pending_qty DECIMAL(10,2) DEFAULT 0,
  advance DECIMAL(12,2) DEFAULT 0,
  balance DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'completed', 'cancelled')),
  rate DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trucks table
CREATE TABLE IF NOT EXISTS trucks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  truck_no VARCHAR(20) UNIQUE NOT NULL,
  is_royalty BOOLEAN DEFAULT false,
  arrival_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  gross_weight DECIMAL(10,2) DEFAULT 0,
  tare_weight DECIMAL(10,2) DEFAULT 0,
  net_weight DECIMAL(10,2) DEFAULT 0,
  current_stage VARCHAR(50) DEFAULT 'Gate',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  trips INTEGER DEFAULT 0,
  orders_served INTEGER DEFAULT 0,
  exceptions INTEGER DEFAULT 0,
  media TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dispatches table
CREATE TABLE IF NOT EXISTS dispatches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispatch_id VARCHAR(50) UNIQUE NOT NULL,
  order_no VARCHAR(50) REFERENCES orders(order_no),
  truck_no VARCHAR(20) REFERENCES trucks(truck_no),
  is_royalty BOOLEAN DEFAULT false,
  driver JSONB NOT NULL, -- {name: string, phone: string}
  delivery_address TEXT NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  net_weight DECIMAL(10,2) DEFAULT 0,
  stage VARCHAR(50) DEFAULT 'Gate',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-transit', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Truck Stages table
CREATE TABLE IF NOT EXISTS truck_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  truck_process_id UUID,
  stage VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  operator VARCHAR(255) NOT NULL,
  media TEXT[],
  completed BOOLEAN DEFAULT false,
  royalty_code VARCHAR(50),
  video_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Truck Processes table
CREATE TABLE IF NOT EXISTS truck_processes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  truck_no VARCHAR(20) REFERENCES trucks(truck_no),
  dispatch_id VARCHAR(50) REFERENCES dispatches(dispatch_id),
  is_royalty BOOLEAN DEFAULT false,
  current_stage VARCHAR(50) DEFAULT 'gate' CHECK (current_stage IN ('gate', 'loading', 'weigh_in', 'weigh_out', 'departed', 'delivered')),
  stages JSONB DEFAULT '[]', -- Array of TruckStage objects
  driver JSONB NOT NULL, -- {id: string, name: string, phone: string}
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  actual_delivery_time TIMESTAMP WITH TIME ZONE,
  delivery_proof JSONB, -- {photo: string, video?: string, timestamp: string, location?: string}
  status VARCHAR(20) DEFAULT 'in_process' CHECK (status IN ('in_process', 'delivered', 'exception')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exceptions table
CREATE TABLE IF NOT EXISTS exceptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  truck_no VARCHAR(20) REFERENCES trucks(truck_no),
  dispatch_id VARCHAR(50) REFERENCES dispatches(dispatch_id),
  stage VARCHAR(50) NOT NULL,
  issue TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trucks_truck_no ON trucks(truck_no);
CREATE INDEX IF NOT EXISTS idx_trucks_status ON trucks(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_no ON orders(order_no);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_dispatches_dispatch_id ON dispatches(dispatch_id);
CREATE INDEX IF NOT EXISTS idx_dispatches_truck_no ON dispatches(truck_no);
CREATE INDEX IF NOT EXISTS idx_dispatches_status ON dispatches(status);
CREATE INDEX IF NOT EXISTS idx_truck_processes_truck_no ON truck_processes(truck_no);
CREATE INDEX IF NOT EXISTS idx_truck_processes_status ON truck_processes(status);
CREATE INDEX IF NOT EXISTS idx_exceptions_truck_no ON exceptions(truck_no);
CREATE INDEX IF NOT EXISTS idx_exceptions_status ON exceptions(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trucks_updated_at BEFORE UPDATE ON trucks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dispatches_updated_at BEFORE UPDATE ON dispatches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_truck_processes_updated_at BEFORE UPDATE ON truck_processes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exceptions_updated_at BEFORE UPDATE ON exceptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO categories (name, code, description) VALUES
  ('Stone Products', 'SP', 'All types of stone materials'),
  ('Sand & Soil', 'SS', 'Sand and soil materials'),
  ('Building Materials', 'BM', 'Construction building materials')
ON CONFLICT (code) DO NOTHING;

INSERT INTO materials (code, name, category, uom) VALUES
  ('SA20', 'Stone Aggregate 20mm', 'Stone Products', 'MT'),
  ('SA40', 'Stone Aggregate 40mm', 'Stone Products', 'MT'),
  ('SD', 'Stone Dust', 'Stone Products', 'MT'),
  ('LS', 'Laterite Stone', 'Stone Products', 'MT'),
  ('RS', 'River Sand', 'Sand & Soil', 'MT')
ON CONFLICT (code) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE truck_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE truck_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE exceptions ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication needs)
-- For now, allow all authenticated users to read/write
CREATE POLICY "Allow authenticated users to read all data" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert data" ON users FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update data" ON users FOR UPDATE USING (auth.role() = 'authenticated');

-- Repeat for other tables...
CREATE POLICY "Allow authenticated users to read all data" ON categories FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert data" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update data" ON categories FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read all data" ON materials FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert data" ON materials FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update data" ON materials FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read all data" ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert data" ON orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update data" ON orders FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read all data" ON trucks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert data" ON trucks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update data" ON trucks FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read all data" ON dispatches FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert data" ON dispatches FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update data" ON dispatches FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read all data" ON truck_stages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert data" ON truck_stages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update data" ON truck_stages FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read all data" ON truck_processes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert data" ON truck_processes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update data" ON truck_processes FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read all data" ON exceptions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert data" ON exceptions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update data" ON exceptions FOR UPDATE USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
