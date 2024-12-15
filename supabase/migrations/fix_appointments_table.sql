-- Drop existing table and recreate with proper structure
DROP TABLE IF EXISTS appointments CASCADE;

CREATE TABLE appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    provider TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_type TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES voice_patients(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX idx_appointments_user_id ON appointments(user_id);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "appointments_insert_policy" ON appointments;
DROP POLICY IF EXISTS "appointments_select_policy" ON appointments;
DROP POLICY IF EXISTS "appointments_update_policy" ON appointments;
DROP POLICY IF EXISTS "appointments_delete_policy" ON appointments;

-- Create simplified policies
CREATE POLICY "Enable read access for users based on email"
ON appointments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM voice_patients
        WHERE voice_patients.id = appointments.user_id
        AND voice_patients.email = auth.jwt() ->> 'email'
    )
);

CREATE POLICY "Enable insert access for users based on email"
ON appointments FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM voice_patients
        WHERE voice_patients.id = appointments.user_id
        AND voice_patients.email = auth.jwt() ->> 'email'
    )
);

CREATE POLICY "Enable update access for users based on email"
ON appointments FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM voice_patients
        WHERE voice_patients.id = appointments.user_id
        AND voice_patients.email = auth.jwt() ->> 'email'
    )
);

CREATE POLICY "Enable delete access for users based on email"
ON appointments FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM voice_patients
        WHERE voice_patients.id = appointments.user_id
        AND voice_patients.email = auth.jwt() ->> 'email'
    )
);

-- Grant necessary permissions
GRANT ALL ON appointments TO authenticated;

