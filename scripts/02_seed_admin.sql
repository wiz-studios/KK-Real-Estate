-- Seed initial admin user
-- Primary admin login
-- Email: admin@kkestates.com

INSERT INTO users (
  id,
  email,
  password_hash,
  full_name,
  phone,
  role,
  is_active
) VALUES (
  uuid_generate_v4(),
  'admin@kkestates.com',
  '$2b$10$Yd1W.y7eAmPSivPPWByLsewrcdGm0Byw2fucmaM04i03uXJi3f7lS',
  'Admin User',
  '+254700000000',
  'admin',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Additional seed admin (optional)
INSERT INTO users (
  id,
  email,
  password_hash,
  full_name,
  phone,
  role,
  is_active
) VALUES (
  uuid_generate_v4(),
  'verifier@kkestates.com',
  'hashed_password_here',
  'Property Verifier',
  '+254700000001',
  'admin',
  true
) ON CONFLICT (email) DO NOTHING;

-- Seed sample user (for testing)
INSERT INTO users (
  id,
  email,
  password_hash,
  full_name,
  phone,
  role,
  is_active
) VALUES (
  uuid_generate_v4(),
  'user@example.com',
  'hashed_password_here',
  'John Doe',
  '+254700000002',
  'user',
  true
) ON CONFLICT (email) DO NOTHING;
