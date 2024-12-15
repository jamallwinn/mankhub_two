-- First, enable RLS on the voice_users table
alter table voice_users enable row level security;

-- Create a policy that allows inserting during signup
create policy "Enable insert for signing up users"
on voice_users
for insert
with check (auth.uid() = id);

-- Create a policy that allows users to read their own data
create policy "Enable read access for users"
on voice_users
for select
using (auth.uid() = id);

-- Create a policy that allows users to update their own data
create policy "Enable update for users based on id"
on voice_users
for update
using (auth.uid() = id)
with check (auth.uid() = id);

