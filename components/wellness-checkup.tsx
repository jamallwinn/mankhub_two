'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Activity, Brain, Heart, Smile } from 'lucide-react'

interface WellnessCheckupProps {
  userId: string
}

export function WellnessCheckup({ userId }: WellnessCheckupProps) {
  const metrics = [
    {
      label: 'Physical Health',
      value: 75,
      icon: Activity,
      color: 'bg-green-500',
      message: 'Schedule your annual check-up',
    },
    {
      label: 'Mental Health',
      value: 85,
      icon: Brain,
      color: 'bg-blue-500',
      message: 'Practice mindfulness for 10 minutes daily',
    },
    {
      label: 'Heart Health',
      value: 90,
      icon: Heart,
      color: 'bg-red-500',
      message: 'Keep up the good work with regular exercise',
    },
    {
      label: 'Stress Level',
      value: 65,
      icon: Smile,
      color: 'bg-yellow-500',
      message: 'Try deep breathing exercises when feeling overwhelmed',
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

