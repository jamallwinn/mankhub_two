-- Update RLS policies for the messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view messages they sent or received" ON messages;
DROP POLICY IF EXISTS "Authenticated users can insert messages" ON messages;
DROP POLICY IF EXISTS "Users can update messages they sent or received" ON messages;
DROP POLICY IF EXISTS "Users can delete messages they sent" ON messages;

-- Create new policies
CREATE POLICY "Allow all operations for authenticated users"
ON messages
FOR ALL
USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON messages TO authenticated;

