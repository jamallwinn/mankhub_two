'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function WelcomePage() {
  const router = useRouter()

  useEffect(() => {
    // Automatically redirect to dashboard after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/dashboard')
    }, 5000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md text-center">
        <div className="mb-6">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Welcome to Mavent Northstar!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for completing your profile. Your journey to better health starts now!
        </p>
        <Button onClick={() => router.push('/dashboard')} className="w-full">
          Go to Dashboard
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          You will be automatically redirected to your dashboard in 5 seconds...
        </p>
      </div>
    </div>
  )
}

