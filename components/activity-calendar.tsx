'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'

interface ActivityCalendarProps {
  userId: string
  age: number
}

export function ActivityCalendar({ userId, age }: ActivityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activities, setActivities] = useState<Record<string, { type: string; activity: string }>>({})

  useEffect(() => {
    // In a real application, you would fetch activities from an API or database
    const fetchActivities = async () => {
      // Simulating API call
      const simulatedActivities: Record<string, { type: string; activity: string }> = {}
      const startDate = startOfMonth(currentDate)
      const endDate = endOfMonth(currentDate)
      const days = eachDayOfInterval({ start: startDate, end: endDate })

      const activityTypes = ['medical', 'mental', 'physical'];
      const activities = {
        medical: [
          'Annual check-up', 'Dental cleaning', 'Eye exam', 
          'Dermatology screening', 'Blood test', 'Vaccination',
          'Chiropractic session', 'Physiotherapy', 'Nutritionist consultation'
        ],
        mental: [
          '15 min meditation', 'Journaling session', 'Therapy appointment', 
          'Stress management workshop', 'Mindfulness practice', 'Social connection call',
          'Gratitude exercise', 'Art therapy', 'Music relaxation'
        ],
        physical: [
          'Brisk walk', 'Gym workout', 'Yoga class', 
          'Swimming session', 'Cycling', 'Rock climbing',
          'Tennis match', 'Dance class', 'Hiking trip'
        ]
      };

      days.forEach(day => {
        const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const randomActivity = activities[randomType][Math.floor(Math.random() * activities[randomType].length)];
        simulatedActivities[format(day, 'yyyy-MM-dd')] = { type: randomType, activity: randomActivity };
      });

      setActivities(simulatedActivities)
    }

    fetchActivities()
  }, [currentDate, userId, age])

  const renderCalendar = () => {
    const startDate = startOfMonth(currentDate)
    const endDate = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold">{day}</div>
        ))}
        {days.map(day => {
          const dateString = format(day, 'yyyy-MM-dd')
          const activity = activities[dateString]
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
          let bgColor = 'bg-gray-100'
          if (activity && activity.type === 'medical') bgColor = 'bg-blue-200'
          if (activity && activity.type === 'mental') bgColor = 'bg-green-200'
          if (activity && activity.type === 'physical') bgColor = 'bg-red-200'

          return (
            <Card key={dateString} className={`${bgColor} ${isToday ? 'border-2 border-primary' : ''}`}>
              <CardContent className="p-2 text-center">
                <div className="font-semibold">{format(day, 'd')}</div>
                <div className="text-xs capitalize">{activity ? activity.activity : ''}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentDate(addDays(currentDate, -30))}>Previous Month</button>
        <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrentDate(addDays(currentDate, 30))}>Next Month</button>
      </div>
      {renderCalendar()}
    </div>
  )
}

