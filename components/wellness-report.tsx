'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Activity, Brain, Heart, Smile } from 'lucide-react'

// Removed the unused props interface
export function WellnessReport() { // Removed the unused userId prop
  const metrics = [
    {
      label: 'Physical Health',
      value: 75,
      icon: Activity,
      color: 'bg-green-500',
      message: 'Great job on your recent workouts! Consider adding a new physical activity to your routine.',
    },
    {
      label: 'Mental Health',
      value: 85,
      icon: Brain,
      color: 'bg-blue-500',
      message: 'Your mindfulness practice is paying off. Try a new relaxation technique this week.',
    },
    {
      label: 'Heart Health',
      value: 90,
      icon: Heart,
      color: 'bg-red-500',
      message: 'Your cardiovascular health is excellent. Keep up with your balanced diet and exercise.',
    },
    {
      label: 'Stress Level',
      value: 65,
      icon: Smile,
      color: 'bg-yellow-500',
      message: 'Your stress levels have improved. Consider scheduling a relaxing activity this weekend.',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className="h-5 w-5" />
              <h3 className="font-semibold">{metric.label}</h3>
            </div>
            <Progress value={metric.value} className="h-2 mb-2" />
            <p className="text-sm text-gray-500">{metric.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}