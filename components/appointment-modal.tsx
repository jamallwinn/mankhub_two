'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase-client'
import { toast } from 'sonner'

interface Appointment {
  id: string
  provider: string
  appointment_date: string
  appointment_time: string
  appointment_type: string
  notes: string
}

type AppointmentMode = 'create' | 'update' | 'cancel'

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  mode: AppointmentMode
  appointment: Appointment | null
  userId: string
  onAppointmentChange: () => void
}

export function AppointmentModal({
  isOpen,
  onClose,
  mode,
  appointment,
  userId,
  onAppointmentChange
}: AppointmentModalProps) {
  const defaultFormData: Appointment = {
    id: '',
    provider: 'Dr. Ukwu',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '09:00',
    appointment_type: 'checkup',
    notes: '',
  }

  const [formData, setFormData] = useState<Appointment>(defaultFormData)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (appointment && mode !== 'create') {
      setFormData(appointment)
    } else {
      setFormData(defaultFormData)
    }
  }, [appointment, mode, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error: patientError } = await supabase
        .from('voice_patients')
        .select('id, email')
        .eq('id', userId)
        .single()

      if (patientError) {
        console.error('Error verifying patient:', patientError)
        throw new Error('Failed to verify patient information')
      }

      let error;

      switch (mode) {
        case 'create':
          ({ error } = await supabase
            .from('appointments')
            .insert([{
              user_id: userId,
              provider: formData.provider,
              appointment_date: formData.appointment_date,
              appointment_time: formData.appointment_time,
              appointment_type: formData.appointment_type,
              notes: formData.notes || null
            }])
            .select())
          
          if (!error) toast.success('Appointment created successfully')
          break;

        case 'update':
          ({ error } = await supabase
            .from('appointments')
            .update({
              provider: formData.provider,
              appointment_date: formData.appointment_date,
              appointment_time: formData.appointment_time,
              appointment_type: formData.appointment_type,
              notes: formData.notes || null
            })
            .eq('id', formData.id)
            .eq('user_id', userId))
          
          if (!error) toast.success('Appointment updated successfully')
          break;

        case 'cancel':
          ({ error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', formData.id)
            .eq('user_id', userId))
          
          if (!error) toast.success('Appointment cancelled successfully')
          break;
      }

      if (error) {
        console.error(`Error ${mode}ing appointment:`, error)
        throw error
      }

      onAppointmentChange()
      onClose()
    } catch (err) {
      console.error('Error handling appointment:', err)
      toast.error('Failed to process appointment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderTitle = () => {
    switch (mode) {
      case 'create': return 'Create Appointment'
      case 'update': return 'Update Appointment'
      case 'cancel': return 'Cancel Appointment'
    }
  }

  const renderDescription = () => {
    switch (mode) {
      case 'create': return 'Schedule a new appointment with your healthcare provider.'
      case 'update': return 'Modify your existing appointment details.'
      case 'cancel': return 'Are you sure you want to cancel this appointment?'
    }
  }

  const renderSubmitButton = () => {
    switch (mode) {
      case 'create': return isLoading ? 'Processing...' : 'Create'
      case 'update': return isLoading ? 'Processing...' : 'Update'
      case 'cancel': return isLoading ? 'Processing...' : 'Confirm Cancellation'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{renderTitle()}</DialogTitle>
          <DialogDescription>{renderDescription()}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'cancel' ? (
            <p className="text-center py-4">
              Are you sure you want to cancel this appointment?
            </p>
          ) : (
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="provider" className="text-right">
                  Provider
                </Label>
                <Select
                  value={formData.provider}
                  onValueChange={(value) => handleSelectChange('provider', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. Ukwu">Dr. Ukwu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="appointment_date" className="text-right">
                  Date
                </Label>
                <Input
                  id="appointment_date"
                  name="appointment_date"
                  type="date"
                  value={formData.appointment_date}
                  onChange={handleInputChange}
                  className="col-span-3"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="appointment_time" className="text-right">
                  Time
                </Label>
                <Input
                  id="appointment_time"
                  name="appointment_time"
                  type="time"
                  value={formData.appointment_time}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="appointment_type" className="text-right">
                  Type
                </Label>
                <Select
                  value={formData.appointment_type}
                  onValueChange={(value) => handleSelectChange('appointment_type', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkup">Checkup</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="mental_health">Mental Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Add any additional notes here..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {renderSubmitButton()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}