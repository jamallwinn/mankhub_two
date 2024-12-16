'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase-client'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Notification } from '@/components/notification'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // First, attempt to sign in with auth
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      if (user) {
        // Then check voice_patients table
        const { data: patientData, error: patientError } = await supabase
          .from('voice_patients')
          .select('*')
          .eq('email', email)
          .single()

        if (patientError) {
          if (patientError.code === 'PGRST116') {
            console.error('No patient record found:', patientError)
            throw new Error('Account setup incomplete. Please complete the onboarding process.')
          } else {
            console.error('Patient lookup error:', patientError)
            throw new Error('Error accessing your account. Please try again.')
          }
        }

        if (!patientData) {
          // User exists in auth but not in voice_patients
          await supabase.auth.signOut() // Sign out the user
          throw new Error('Account setup incomplete. Please complete the onboarding process.')
        }

        // User has completed onboarding, redirect to dashboard
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Sign in error:', err)
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      
      if (errorMessage === 'Invalid login credentials') {
        setError('Invalid email or password. Please try again.')
      } else if (errorMessage === 'Account setup incomplete. Please complete the onboarding process.') {
        setError('Account setup incomplete. Please complete the onboarding process.')
      } else {
        setError('An error occurred during sign in. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        {error && <Notification type="error" message={error} />}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => router.push('/reset-password')}
              className="text-sm text-primary hover:underline mt-2 block"
            >
              Forgot password?
            </button>
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}

