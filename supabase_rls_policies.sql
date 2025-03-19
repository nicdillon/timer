-- Enable Row Level Security on the focus_sessions table
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select only their own data
CREATE POLICY "Users can view their own focus sessions"
ON focus_sessions FOR SELECT
USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert only their own data
CREATE POLICY "Users can insert their own focus sessions"
ON focus_sessions FOR INSERT
WITH CHECK (
  -- Ensure user is authenticated
  auth.role() = 'authenticated' AND 
  -- Ensure user_id matches the authenticated user's ID
  auth.uid()::text = user_id
);

-- Create policy to allow users to update only their own data
CREATE POLICY "Users can update their own focus sessions"
ON focus_sessions FOR UPDATE
USING (auth.uid()::text = user_id);

-- Create policy to allow users to delete only their own data
CREATE POLICY "Users can delete their own focus sessions"
ON focus_sessions FOR DELETE
USING (auth.uid()::text = user_id);

-- Ensure the focus_sessions table has the correct schema
-- If you need to create or modify the table, uncomment and adjust this:

-- Create table if it doesn't exist with user_id as TEXT
CREATE TABLE IF NOT EXISTS focus_sessions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  category TEXT NOT NULL,
  duration INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add an index on user_id for better performance
CREATE INDEX IF NOT EXISTS focus_sessions_user_id_idx ON focus_sessions(user_id);
