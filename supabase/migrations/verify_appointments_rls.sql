-- First verify RLS is enabled
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON appointments;
DROP POLICY IF EXISTS "Enable insert access for users based on user_id" ON appointments;
DROP POLICY IF EXISTS "Enable update access for users based on user_id" ON appointments;
DROP POLICY IF EXISTS "Enable delete access for users based on user_id" ON appointments;

-- Create simplified insert policy
CREATE POLICY "appointments_insert_policy" ON appointments
FOR INSERT TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

-- Create read policy
CREATE POLICY "appointments_select_policy" ON appointments
FOR SELECT TO authenticated
USING (auth.uid()::text = user_id::text);

-- Create update policy
CREATE POLICY "appointments_update_policy" ON appointments
FOR UPDATE TO authenticated
USING (auth.uid()::text = user_id::text);

-- Create delete policy
CREATE POLICY "appointments_delete_policy" ON appointments
FOR DELETE TO authenticated
USING (auth.uid()::text = user_id::text);

