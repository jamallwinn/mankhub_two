-- Add updated_at column to voice_patients table
ALTER TABLE voice_patients
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Add a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_voice_patients_modtime
    BEFORE UPDATE ON voice_patients
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

