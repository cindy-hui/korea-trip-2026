-- Supabase Database Schema for Seoul Trip Planner
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: Settings (for KRW rate and other key-value pairs)
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: Itinerary (stores the full itinerary as JSON)
CREATE TABLE IF NOT EXISTS itinerary (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 3: Packing List (stores the full packing list as JSON)
CREATE TABLE IF NOT EXISTS packing_list (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 4: Expenses (stores the full expenses array as JSON)
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - allows public read/write
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (for simplicity on free tier)
CREATE POLICY "Allow public read access" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON settings FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON itinerary FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON itinerary FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON itinerary FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON packing_list FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON packing_list FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON packing_list FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON expenses FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON expenses FOR UPDATE USING (true);

-- Insert default KRW rate if not exists
INSERT INTO settings (key, value) VALUES ('krw_rate', '0.0052')
ON CONFLICT (key) DO NOTHING;
