-- Drop the existing messages table
DROP TABLE IF EXISTS messages;

-- Recreate the messages table with the correct structure
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on recipient_id for faster queries
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_message_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_messages_timestamp
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_message_timestamp();

-- Add RLS policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users"
ON messages
FOR ALL
USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON messages TO authenticated;

