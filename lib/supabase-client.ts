import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jhvqymffkrmqmtcqrzzo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpodnF5bWZma3JtcW10Y3FyenpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU1NjU0ODcsImV4cCI6MjA0MTE0MTQ4N30.vHpThxnCXzY_w_jQ1CZuwQBEg_b8v3-bPJrG7f3LNR8'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const VOICE_USERS_TABLE = 'voice_users'

