-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES voice_patients(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES voice_patients(id) ON DELETE CASCADE,
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

CREATE POLICY "Users can view their own messages"
ON messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can insert their own messages"
ON messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages"
ON messages FOR UPDATE
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can delete their own messages"
ON messages FOR DELETE
USING (auth.uid() = sender_id);

