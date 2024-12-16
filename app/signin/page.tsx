'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase-client'
import { Notification } from '@/components/notification'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Check if the user exists in the voice_patients table
      const { data: patientData, error: patientError } = await supabase
        .from('voice_patients')
        .select('*')
        .eq('email', email)
        .single()

      if (patientError) {
        if (patientError.code === 'PGRST116') {
          // Record not found
          await supabase.auth.signOut()
          throw new Error('Account setup incomplete. Please complete the onboarding process.')
        }
        throw patientError
      }

      // Check if required fields are filled
      const requiredFields = [
        'age',
        'citystateofresidence',
        'phonenumber',
        'lastsocialsecurity',
        'familyhealthconditions',
        'currentmedications',
        'physicalactivity',
        'mentalwellbeing',
      ]

      const incompleteFields = requiredFields.filter(
        field => !patientData[field]
      )

      if (incompleteFields.length > 0) {
        await supabase.auth.signOut()
        throw new Error('Account setup incomplete. Please complete the onboarding process.')
      }

      router.push('/dashboard')
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
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <Notification type="error" message={error} />}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
            <Link
              href="/reset-password"
              className="text-sm text-primary hover:underline block mt-2"
            >
              Forgot your password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}