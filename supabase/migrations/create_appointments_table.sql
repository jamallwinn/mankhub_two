-- Create appointments table
CREATE TABLE appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES voice_patients(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  appointment_type TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster queries
CREATE INDEX idx_appointments_user_id ON appointments(user_id);

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_appointment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_appointments_timestamp
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_appointment_timestamp();

-- Add RLS policies
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own appointments"
ON appointments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own appointments"
ON appointments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
ON appointments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appointments"
ON appointments FOR DELETE
USING (auth.uid() = user_id);

