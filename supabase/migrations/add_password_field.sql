-- Add password field to voice_users table
ALTER TABLE voice_users
ADD COLUMN password text;

-- Update the dateofbirth field to allow null
ALTER TABLE voice_users
ALTER COLUMN dateofbirth TYPE text,
ALTER COLUMN dateofbirth DROP NOT NULL;

