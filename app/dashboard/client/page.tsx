'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarIcon, MessageSquareIcon, ActivityIcon, BrainCircuitIcon } from 'lucide-react'

export default function ClientDashboard() {
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState([])
  const [messages, setMessages] = useState([])
  const [activityData, setActivityData] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      // Fetch appointments, messages, and activity data from Supabase
      // This is a placeholder and should be replaced with actual data fetching logic
    }
    fetchUserData()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.email}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display appointments here */}
            <Button className="w-full mt-4">
              <CalendarIcon className="mr-2 h-4 w-4" /> Schedule Appointment
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display messages here */}
            <Button className="w-full mt-4">
              <MessageSquareIcon className="mr-2 h-4 w-4" /> View All Messages
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display activity data */}
            {activityData ? (
              <div>
                <p>Steps: {activityData.steps}</p>
                <p>Calories: {activityData.calories}</p>
                <p>Sleep: {activityData.sleep} hours</p>
              </div>
            ) : (
              <p>No activity data available</p>
            )}
            <Button className="w-full mt-4">
              <ActivityIcon className="mr-2 h-4 w-4" /> View Detailed Activity
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Health Coach</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Get personalized health recommendations and chat with our AI.</p>
            <Button className="w-full mt-4">
              <BrainCircuitIcon className="mr-2 h-4 w-4" /> Start AI Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

