'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Edit, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'
import { format } from 'date-fns'
import { AppointmentModal } from './appointment-modal'
import { toast } from 'sonner'

interface Appointment {
  id: string
  provider: string
  appointment_date: string
  appointment_time: string
  appointment_type: string
  notes: string
}

interface AppointmentListProps {
  userId: string
}

export function AppointmentList({ userId }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'update' | 'cancel'>('create')

  // Set up real-time subscription
  useEffect(() => {
    fetchAppointments()

    // Subscribe to changes
    const channel = supabase
      .channel('appointments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchAppointments()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
        .gte('appointment_date', new Date().toISOString().split('T')[0])
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (err) {
      console.error('Error fetching appointments:', err)
      toast.error('Failed to load appointments')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAppointment = () => {
    setSelectedAppointment(null)
    setModalMode('create')
    setModalOpen(true)
  }

  const handleUpdateAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setModalMode('update')
    setModalOpen(true)
  }

  const handleCancelAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setModalMode('cancel')
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setSelectedAppointment(null)
  }

  if (isLoading) {
    return <div className="flex justify-center py-4">Loading appointments...</div>
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleCreateAppointment} className="w-full">
        <Calendar className="mr-2 h-4 w-4" />
        Book New Appointment
      </Button>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-center text-muted-foreground">No upcoming appointments</p>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div>
                <p className="font-medium">{appointment.provider}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(appointment.appointment_date), 'MMMM d, yyyy')} at{' '}
                  {format(new Date(`2000-01-01T${appointment.appointment_time}`), 'h:mm a')}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {appointment.appointment_type.replace('_', ' ')}
                </p>
                {appointment.notes && (
                  <p className="text-sm text-muted-foreground mt-1">{appointment.notes}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateAppointment(appointment)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit appointment</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCancelAppointment(appointment)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Cancel appointment</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <AppointmentModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        appointment={selectedAppointment}
        userId={userId}
        onAppointmentChange={fetchAppointments}
      />
    </div>
  )
}

