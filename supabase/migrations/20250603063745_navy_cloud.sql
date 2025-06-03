/*
  # Seed Initial Data

  This migration adds initial data:
  - Leave types
  - Admin user
  - Sample leave balances
*/

-- Insert leave types
INSERT INTO leave_types (name) VALUES
  ('Casual Leave'),
  ('Sick Leave'),
  ('Annual Leave'),
  ('Unpaid Leave');

-- Insert admin user (password: adminpassword123)
INSERT INTO users (
  employee_id,
  name,
  email,
  is_admin,
  designation,
  profile_photo_url,
  password_hash
) VALUES (
  'ADMIN001',
  'Admin User',
  'admin@example.com',
  true,
  'System Administrator',
  'https://placehold.co/100x100.png?text=AU',
  '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' -- Replace with actual hashed password
);