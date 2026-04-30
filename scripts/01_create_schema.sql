-- Property Management System Database Schema
-- This script creates the core tables for managing verified properties

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum types for property management
CREATE TYPE property_type AS ENUM (
  'bungalow',
  'flatroof',
  'townhouse',
  'apartment',
  'penthouse',
  'villa',
  'mansion',
  'cottage',
  'duplex',
  'studio'
);

CREATE TYPE verification_status AS ENUM (
  'pending',
  'verified',
  'rejected',
  'under_review'
);

CREATE TYPE user_role AS ENUM (
  'admin',
  'user'
);

-- Users Table (Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role user_role DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties Table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_type property_type NOT NULL,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  county VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  price DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  
  -- Room Details
  total_rooms INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  living_rooms INTEGER DEFAULT 1,
  kitchens INTEGER DEFAULT 1,
  
  -- Property Specifications
  plot_size VARCHAR(100),
  built_area VARCHAR(100),
  construction_year INTEGER,
  
  -- Status and Verification
  verification_status verification_status DEFAULT 'pending',
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  
  -- Admin Info
  added_by UUID NOT NULL REFERENCES users(id),
  is_available BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  
  -- Images (JSON array of URLs)
  images JSONB DEFAULT '[]',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property Features/Amenities Table (Flexible)
CREATE TABLE property_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  feature_name VARCHAR(100) NOT NULL,
  feature_value VARCHAR(255),
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification Logs Table (Audit Trail)
CREATE TABLE verification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  status verification_status NOT NULL,
  notes TEXT,
  verification_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Inquiries/Favorites Table
CREATE TABLE property_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  inquiry_type VARCHAR(50),
  message TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, user_id)
);

-- Create Indexes for Performance
CREATE INDEX idx_properties_verification_status ON properties(verification_status);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_added_by ON properties(added_by);
CREATE INDEX idx_property_features_property_id ON property_features(property_id);
CREATE INDEX idx_verification_logs_property_id ON verification_logs(property_id);
CREATE INDEX idx_verification_logs_admin_id ON verification_logs(admin_id);
CREATE INDEX idx_inquiries_user_id ON property_inquiries(user_id);
CREATE INDEX idx_inquiries_property_id ON property_inquiries(property_id);

-- Create timestamp update triggers
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_properties_timestamp BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;

-- Users can view their own record
CREATE POLICY "Users can view own record" ON users
  FOR SELECT USING (id = auth.uid());

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Anyone (authenticated) can view verified properties
CREATE POLICY "Anyone can view verified properties" ON properties
  FOR SELECT USING (verification_status = 'verified');

-- Admins can view all properties including unverified
CREATE POLICY "Admins can view all properties" ON properties
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can insert properties
CREATE POLICY "Only admins can create properties" ON properties
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update properties
CREATE POLICY "Only admins can update properties" ON properties
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete properties
CREATE POLICY "Only admins can delete properties" ON properties
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Property features visible with properties
CREATE POLICY "View features for verified properties" ON property_features
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE id = property_id AND verification_status = 'verified'
    )
    OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can modify features
CREATE POLICY "Only admins can manage features" ON property_features
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Verification logs visible only to admins
CREATE POLICY "Only admins can view verification logs" ON verification_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can create verification logs
CREATE POLICY "Only admins can create verification logs" ON verification_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can view/create their own inquiries
CREATE POLICY "Users can view own inquiries" ON property_inquiries
  FOR SELECT USING (user_id = auth.uid());

-- Users can create inquiries
CREATE POLICY "Users can create inquiries" ON property_inquiries
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admins can view all inquiries
CREATE POLICY "Admins can view all inquiries" ON property_inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
