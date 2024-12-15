'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase-client'
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      console.log('User logged in:', data)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error logging in:', error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => router.push('/reset-password')}
              className="text-sm text-primary hover:underline mt-2 block"
            >
              Forgot password?
            </button>
          </div>
          <Button type="submit" className="w-full">Login</Button>
          <div className="mt-4 text-center text-sm">
            <p>
              New to Man Cave Health Hub?{' '}
              <Link href="/signup" className="text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

