/*
  # Initial Schema Setup for LeavePilot

  1. New Tables
    - users
      - id (uuid, primary key) 
      - employee_id (text, unique)
      - name (text)
      - email (text, unique, optional)
      - is_admin (boolean)
      - designation (text)
      - profile_photo_url (text)
      - password_hash (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - leave_types
      - id (uuid, primary key)
      - name (text)
      - created_at (timestamptz)

    - leave_balances
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - leave_type_id (uuid, references leave_types)
      - balance (integer)
      - total_allocated (integer)
      - year (integer)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - leave_requests
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - leave_type_id (uuid, references leave_types)
      - start_date (date)
      - end_date (date)
      - reason (text)
      - status (text)
      - requested_at (timestamptz)
      - updated_at (timestamptz)
      - approved_by (uuid, references users)
      - admin_remarks (text)

    - notifications
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - message (text)
      - type (text)
      - read (boolean)
      - link (text)
      - related_request_id (uuid, references leave_requests)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for data access
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text UNIQUE,
  is_admin boolean DEFAULT false,
  designation text,
  profile_photo_url text,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create leave_types table
CREATE TABLE leave_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create leave_balances table
CREATE TABLE leave_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  leave_type_id uuid REFERENCES leave_types(id) ON DELETE CASCADE,
  balance integer NOT NULL,
  total_allocated integer NOT NULL,
  year integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, leave_type_id, year)
);

-- Create leave_requests table
CREATE TABLE leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  leave_type_id uuid REFERENCES leave_types(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text NOT NULL,
  status text NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  requested_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  approved_by uuid REFERENCES users(id),
  admin_remarks text
);

-- Create notifications table
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('new_leave_request', 'leave_status_update', 'system_message')),
  read boolean DEFAULT false,
  link text,
  related_request_id uuid REFERENCES leave_requests(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Leave types policies
CREATE POLICY "Anyone can read leave types"
  ON leave_types
  FOR SELECT
  TO authenticated
  USING (true);

-- Leave balances policies
CREATE POLICY "Users can read their own leave balances"
  ON leave_balances
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all leave balances"
  ON leave_balances
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Leave requests policies
CREATE POLICY "Users can read their own leave requests"
  ON leave_requests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own leave requests"
  ON leave_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all leave requests"
  ON leave_requests
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Admins can update leave requests"
  ON leave_requests
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Notifications policies
CREATE POLICY "Users can read their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());