-- Alter columns to allow NULL values
ALTER TABLE public.voice_patients 
  ALTER COLUMN citystateofresidence DROP NOT NULL,
  ALTER COLUMN phonenumber DROP NOT NULL,
  ALTER COLUMN dateofbirth DROP NOT NULL,
  ALTER COLUMN lastsocialsecurity DROP NOT NULL,
  ALTER COLUMN familyhealthconditions DROP NOT NULL,
  ALTER COLUMN currentmedications DROP NOT NULL,
  ALTER COLUMN physicalactivity DROP NOT NULL,
  ALTER COLUMN mentalwellbeing DROP NOT NULL,
  ALTER COLUMN age DROP NOT NULL;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "admin_all" ON public.voice_patients;

-- Create new RLS policies
CREATE POLICY "Enable insert for authenticated users" ON public.voice_patients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable select for users based on email" ON public.voice_patients
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Enable update for users based on email" ON public.voice_patients
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = email)
  WITH CHECK (auth.jwt() ->> 'email' = email);

