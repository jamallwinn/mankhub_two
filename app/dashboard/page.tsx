'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ChatInterface } from '@/components/chat-interface'
import { WellnessReport } from '@/components/wellness-report'
import { AppointmentList } from '@/components/appointment-list'
import { MessageSection } from '@/components/message-section'
import { PersonalizedRecommendations } from '@/components/personalized-recommendations'
import { ActivityCalendar } from '@/components/activity-calendar'
import { supabase } from '@/lib/supabase-client'
import Loading from '@/components/loading'
import { format } from 'date-fns'
import { ProfilePopup } from '@/components/profile-popup'
import { SettingsPopup } from '@/components/settings-popup'

interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  age: number;
  citystateofresidence: string;
  phonenumber: string;
  lastsocialsecurity: string;
  familyhealthconditions: string;
  currentmedications: string;
  physicalactivity: string;
  mentalwellbeing: string;
  user_metadata: {
    first_name: string;
    last_name: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [showSettingsPopup, setShowSettingsPopup] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError) throw authError
        
        if (!authUser) {
          console.error('No authenticated user found')
          router.push('/signin')
          return
        }

        // Fetch user data from voice_patients table
        const { data: patientData, error: patientError } = await supabase
          .from('voice_patients')
          .select('*')
          .eq('email', authUser.email)
          .single()

        if (patientError) {
          console.error('Error fetching patient data:', patientError)
          throw new Error('Failed to fetch user data')
        }

        // Check if any required fields are null, empty, or blank
        const requiredFields = ['age', 'citystateofresidence', 'phonenumber', 'lastsocialsecurity', 'familyhealthconditions', 'currentmedications', 'physicalactivity', 'mentalwellbeing']
        const incompleteFields = requiredFields.filter(field => 
          patientData[field] === null || patientData[field] === '' || patientData[field] === undefined
        )

        if (incompleteFields.length > 0) {
          console.log('Incomplete user data, redirecting to onboarding')
          router.push('/onboarding')
          return
        }

        // Combine auth user and patient data
        setUser({
          ...authUser,
          ...patientData,
          user_metadata: {
            ...authUser.user_metadata,
            first_name: patientData.firstname,
            last_name: patientData.lastname
          }
        })
      } catch (err) {
        console.error('Error in fetchUser:', err)
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
        router.push('/signin')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()

    // Update time every minute
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000)

    return () => clearInterval(timer)
  }, [router])

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No User Data Found</h2>
          <p className="text-gray-600">Please sign in again.</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout 
      user={user}
      onProfileClick={() => setShowProfilePopup(true)}
      onSettingsClick={() => setShowSettingsPopup(true)}
    >
      <div className="flex flex-col gap-4">
        <div className="bg-primary text-white p-4 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-2">
            Welcome, {user.firstname} {user.lastname}
          </h1>
          <p className="text-lg">
            {format(currentDateTime, "EEEE, MMMM do, yyyy")}
          </p>
          <p className="text-lg">
            Current time: {format(currentDateTime, "h:mm a")} EST
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentList userId={user.id} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Interactive Messaging</CardTitle>
            </CardHeader>
            <CardContent>
              <MessageSection userId={user.id} />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Wellness Report</CardTitle>
            </CardHeader>
            <CardContent>
              <WellnessReport userId={user.id} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Health Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <ChatInterface userId={user.id} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <PersonalizedRecommendations userId={user.id} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>30-Day Activity and Wellness Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityCalendar userId={user.id} age={user.age} />
          </CardContent>
        </Card>
      </div>

      {showProfilePopup && (
        <ProfilePopup 
          user={user} 
          onClose={() => setShowProfilePopup(false)} 
        />
      )}
      
      {showSettingsPopup && (
        <SettingsPopup 
          onClose={() => setShowSettingsPopup(false)} 
        />
      )}
    </DashboardLayout>
  )
}