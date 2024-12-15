-- Allow null values for firstname and lastname
ALTER TABLE voice_patients
ALTER COLUMN firstname DROP NOT NULL,
ALTER COLUMN lastname DROP NOT NULL;

-- Ensure other necessary columns are present and have appropriate constraints
ALTER TABLE voice_patients
ADD COLUMN IF NOT EXISTS email TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS citystateofresidence TEXT,
ADD COLUMN IF NOT EXISTS phonenumber TEXT,
ADD COLUMN IF NOT EXISTS lastsocialsecurity TEXT,
ADD COLUMN IF NOT EXISTS familyhealthconditions TEXT,
ADD COLUMN IF NOT EXISTS currentmedications TEXT,
ADD COLUMN IF NOT EXISTS physicalactivity TEXT,
ADD COLUMN IF NOT EXISTS mentalwellbeing INTEGER;

-- Add a unique constraint on the email column if not already present
ALTER TABLE voice_patients
ADD CONSTRAINT voice_patients_email_key UNIQUE (email);

